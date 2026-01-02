<?php

namespace App\Http\Controllers\Api; // ✔ Api namespace

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PlaceImage;
use Illuminate\Support\Facades\Storage;

class PlaceImageController extends Controller
{
    // List images for a place
    public function index($place_id)
    {
        $images = PlaceImage::where('place_id', $place_id)
            ->orderBy('order_index')
            ->get();

        return response()->json($images);
    }

    // Add / update images
    public function storeOrUpdate(Request $request)
    {
        $request->validate([
            'place_id' => 'required|exists:spots,id',
            'photos.*' => 'nullable|file|image|max:5120', // 5MB
            'order_index.*' => 'nullable|integer',
            'alt_text.*' => 'nullable|string',
            'existing_photos.*' => 'nullable|integer', // IDs of existing images
        ]);

        $place_id = $request->place_id;

        // Delete removed images
        $existing_ids = $request->existing_photos ?? [];
        PlaceImage::where('place_id', $place_id)
            ->whereNotIn('id', $existing_ids)
            ->each(function($img) {
                if (Storage::exists($img->storage_path)) {
                    Storage::delete($img->storage_path);
                }
                $img->delete();
            });

        // Update existing images order/alt_text
        foreach ($existing_ids as $index => $id) {
            $img = PlaceImage::find($id);
            if ($img) {
                $img->order_index = $request->order_index[$index] ?? $img->order_index;
                $img->alt_text = $request->alt_text[$index] ?? $img->alt_text;
                $img->save();
            }
        }

        // Upload new images
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $index => $file) {
                $path = $file->store('places', 'public'); // storage/app/public/places
                PlaceImage::create([
                    'place_id' => $place_id,
                     'file_url' => Storage::url($path), // ✅ Correct public URL
                    'storage_path' => $path,
                    'order_index' => $request->order_index[$index] ?? 0,
                    'alt_text' => $request->alt_text[$index] ?? '',
                ]);
            }
        }

        return response()->json(['message' => 'Images updated successfully']);
    }

    // Delete single image
    public function destroy($id)
    {
        $img = PlaceImage::findOrFail($id);
        if ($img->storage_path && Storage::exists($img->storage_path)) {
            Storage::delete($img->storage_path);
        }
        $img->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }
}
