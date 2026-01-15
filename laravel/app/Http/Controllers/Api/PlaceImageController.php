<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PlaceImage;
use App\Models\Spot;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class PlaceImageController extends Controller
{
    /**
     * Image limit based on plan
     */
    private function maxImagesAllowed(string $plan): ?int
    {
        return match (strtolower($plan)) {
            'basic' => 5,
            'pro' => 15,
            'enterprise' => null, // unlimited
            'free' => 15,
        };
    }

    /**
     * List images for a place
     */
    public function index($place_id)
    {
        $images = PlaceImage::where('place_id', $place_id)
            ->orderBy('order_index')
            ->get();

        return response()->json($images);
    }

    /**
     * Add / Update images with HARD LIMIT
     */
    public function storeOrUpdate(Request $request)
    {
        $request->validate([
            'place_id' => 'required|exists:spots,id',
            'photos.*' => 'nullable|image|max:5120',
            'order_index.*' => 'nullable|integer',
            'alt_text.*' => 'nullable|string',
            'existing_photos.*' => 'nullable|integer',
        ]);

        $placeId = $request->place_id;

        /** -------------------------------
         *  PLAN IMAGE LIMIT CHECK
         *  ------------------------------- */
        $spot = Spot::findOrFail($placeId);
        $user = $spot->user; // assuming Spot has `user()` relationship
        // 1️⃣ Check plan status first
        if (!in_array(strtolower($user->plan_status), ['active','trialing'])) {
            return response()->json([
                'error_code' => 'PLAN_EXPIRED'
            ], 403); // Forbidden
        }

        $maxAllowed = $this->maxImagesAllowed($spot->plan_level_cached);

        $existingIds = $request->existing_photos ?? [];

        $existingCount = PlaceImage::where('place_id', $placeId)
            ->whereIn('id', $existingIds)
            ->count();

        $newUploads = $request->hasFile('photos')
            ? count($request->file('photos'))
            : 0;

        if ($maxAllowed !== null && ($existingCount + $newUploads) > $maxAllowed) {
           return response()->json([
            'error_code' => 'IMAGE_LIMIT_EXCEEDED',
                'meta' => [
                    'max' => $maxAllowed
                ]
            ], 422);
        }

        /** -------------------------------
         *  DELETE REMOVED IMAGES
         *  ------------------------------- */
        PlaceImage::where('place_id', $placeId)
            ->whereNotIn('id', $existingIds)
            ->each(function ($img) {
                if ($img->storage_path && Storage::disk('public')->exists($img->storage_path)) {
                    Storage::disk('public')->delete($img->storage_path);
                }
                $img->delete();
            });

        /** -------------------------------
         *  UPDATE EXISTING IMAGES
         *  ------------------------------- */
        foreach ($existingIds as $index => $id) {
            $img = PlaceImage::find($id);
            if ($img) {
                $img->order_index = $request->order_index[$index] ?? $img->order_index;
                $img->alt_text = $request->alt_text[$index] ?? $img->alt_text;
                $img->save();
            }
        }

        /** -------------------------------
         *  UPLOAD NEW IMAGES
         *  ------------------------------- */
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $index => $file) {
                $path = $file->store('places', 'public');

                PlaceImage::create([
                    'place_id'     => $placeId,
                    'file_url'     => Storage::url($path),
                    'storage_path' => $path,
                    'order_index'  => $request->order_index[$index] ?? 0,
                    'alt_text'     => $request->alt_text[$index] ?? '',
                ]);
            }
        }

        return response()->json([
            'message' => 'IMAGE_UPDATED'
        ]);
    }

    /**
     * Delete single image
     */
    public function destroy($id)
    {
        $img = PlaceImage::findOrFail($id);

        if ($img->storage_path && Storage::disk('public')->exists($img->storage_path)) {
            Storage::disk('public')->delete($img->storage_path);
        }

        $img->delete();

        return response()->json([
            'message' => 'IMAGE_DELETED'
        ]);
    }
}
