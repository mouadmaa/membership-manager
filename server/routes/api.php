<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CheckinController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PlanController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/plans', [PlanController::class, 'index']);
    Route::post('/plans', [PlanController::class, 'store']);
    Route::put('/plans/{plan}', [PlanController::class, 'update']);
    Route::delete('/plans/{plan}', [PlanController::class, 'destroy']);

    Route::get('/me/member', [MemberController::class, 'me']);
    Route::get('/members', [MemberController::class, 'index']);
    Route::post('/members', [MemberController::class, 'store']);
    Route::get('/members/{member}', [MemberController::class, 'show']);
    Route::put('/members/{member}', [MemberController::class, 'update']);
    Route::delete('/members/{member}', [MemberController::class, 'destroy']);

    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments', [PaymentController::class, 'store']);

    Route::get('/checkins', [CheckinController::class, 'index']);
    Route::post('/checkins', [CheckinController::class, 'store']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
});
