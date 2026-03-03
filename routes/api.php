<?php

use App\Http\Controllers\Midtrans\NotificationController as MidtransNotification;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// Midtrans Payment Notification Webhook
Route::post('/midtrans/notification', MidtransNotification::class)->name('midtrans.notification');
