<?php

require_once base_path('vendor/autoload.php');
require_once base_path('vendor/stripe/stripe/stripe-php/init.php');

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\GetProfileController;
use App\Http\Controllers\Api\SpotController;
use App\Http\Controllers\Api\AddSpotController;
use App\Http\Controllers\Api\UpdateSpotController;
use App\Http\Controllers\Api\DeleteSpotController;
use App\Http\Controllers\Api\DeleteUserController;
use App\Http\Controllers\Api\SearchFilterController;
use App\Http\Controllers\Api\GetAllSpotController;
use App\Http\Controllers\Api\GetAllUsersController;
use App\Http\Controllers\Api\ContactInquiryController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\PlaceImageController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\StripeController;
use App\Http\Controllers\Api\WebhookController;
use App\Http\Controllers\Api\PlanMaintenanceController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\SubscriptionController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();

});

Route::post('/register', [RegisterController::class, 'register']);

Route::post('/login', [LoginController::class, 'login']);

// Protected route example (requires token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/profile', function (Request $request) {
        return $request->user();
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [App\Http\Controllers\Api\LoginController::class, 'logout']);
    
    // 🔹 New Update Profile Route
    Route::put('/update-profile', [ProfileController::class, 'updateProfile']);
    Route::put('/change-password', [ProfileController::class, 'changePassword']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/get-profile', [GetProfileController::class, 'getProfile']);
    Route::post('update-profile-image', [GetProfileController::class, 'updateProfileImage']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/spots', [SpotController::class, 'index']);
});
Route::get('/allspots', [GetAllSpotController::class, 'index']);
Route::get('/users', [GetAllUsersController::class, 'index']);
Route::get('/cities', [GetAllSpotController::class, 'cities']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/addspot', [AddSpotController::class, 'addSpot']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::put('/updatespot/{id}', [UpdateSpotController::class, 'updateSpot']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::delete('/deletespot/{id}', [DeleteSpotController::class, 'deleteSpot']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::delete('/deleteuser/{id}', [DeleteUserController::class, 'deleteSpot']);
});

Route::get('/search', [SearchFilterController::class, 'filter']);
Route::get('/facility/{id}', [SearchFilterController::class, 'details']);

// Route::post('/send-inquiry', [ContactInquiryController::class, 'sendInquiry']);
Route::post('/send-inquiry', [ContactInquiryController::class, 'sendInquiry']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/leads', [LeadController::class, 'index']);
});
Route::get('/leads', [LeadController::class, 'index']);

Route::put('/leads/{id}/status', [LeadController::class, 'updateStatus']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('place-images/{place_id}', [PlaceImageController::class, 'index']);
    Route::post('place-images', [PlaceImageController::class, 'storeOrUpdate']);
    Route::delete('place-images/{id}', [PlaceImageController::class, 'destroy']);
});

Route::get('place-images/{place_id}', [PlaceImageController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
Route::get('/dashboard/overview', [DashboardController::class, 'overview']);
});

Route::get('/dashboard/count', [DashboardController::class, 'count']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/stripe/plans', [StripeController::class, 'getPlans']);
    Route::post('/create-subscription-session', [StripeController::class, 'createSubscriptionSession']);
    Route::post('/stripe/customer-portal', [StripeController::class, 'customerPortal']);
    Route::get(
    '/stripe/current-subscription',
    [StripeController::class, 'currentSubscription']);
     // 3️⃣ Stripe checkout success (SAVE PLAN & STATUS HERE)
    });
Route::post('/stripe/webhook', [WebhookController::class, 'handleWebhook']);

// Maintenance Route to expire trial plans
Route::get('/expire-trial-plans', [PlanMaintenanceController::class, 'expireTrialPlans']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/me', [UserController::class, 'getCurrentUser']);
});
Route::middleware('auth:sanctum')->group(function () {
   Route::get('/audit-logs', [AuditLogController::class, 'index']);
   Route::delete('audit-logs/{id}', [AuditLogController::class, 'destroy']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/subscriptions', [SubscriptionController::class, 'index']);
});

