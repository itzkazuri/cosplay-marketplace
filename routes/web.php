<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Midtrans\NotificationController as MidtransNotification;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/categories/{category:slug}', [CategoryController::class, 'show'])->name('categories.show');
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [ProductDetailController::class, 'show'])->name('products.show');
Route::get('/api/products/filter', [ProductController::class, 'filter'])->name('api.products.filter');
Route::get('/api/products/search', [ProductController::class, 'search'])->name('api.products.search');

Route::post('/midtrans/notification', MidtransNotification::class)->name('midtrans.notification');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'user', 'verified'])->name('dashboard');

Route::middleware(['auth', 'user'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['require-auth', 'user'])->group(function () {
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
});

use App\Http\Controllers\Admin\CategoryController as AdminCategory;
use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\OrderController as AdminOrder;
use App\Http\Controllers\Admin\ProductController as AdminProduct;
use App\Http\Controllers\Admin\ProductSkuController as AdminProductSku;
use App\Http\Controllers\Admin\PromoController as AdminPromo;
use App\Http\Controllers\Admin\RevenueController as AdminRevenue;
use App\Http\Controllers\Admin\SettingsController as AdminSettings;
use App\Http\Controllers\Admin\ShipmentController as AdminShipment;

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboard::class, 'index'])->name('dashboard');

    // Revenue Reports
    Route::get('/revenue/monthly', [AdminRevenue::class, 'monthly'])->name('revenue.monthly');
    Route::get('/revenue/yearly', [AdminRevenue::class, 'yearly'])->name('revenue.yearly');

    // Products CRUD
    Route::get('/products', [AdminProduct::class, 'index'])->name('products.index');
    Route::get('/products/create', [AdminProduct::class, 'create'])->name('products.create');
    Route::post('/products', [AdminProduct::class, 'store'])->name('products.store');
    Route::get('/products/{product}/edit', [AdminProduct::class, 'edit'])->name('products.edit');
    Route::put('/products/{product}', [AdminProduct::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [AdminProduct::class, 'destroy'])->name('products.destroy');

    // Categories CRUD
    Route::get('/categories', [AdminCategory::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [AdminCategory::class, 'create'])->name('categories.create');
    Route::post('/categories', [AdminCategory::class, 'store'])->name('categories.store');
    Route::get('/categories/{category}/edit', [AdminCategory::class, 'edit'])->name('categories.edit');
    Route::put('/categories/{category}', [AdminCategory::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [AdminCategory::class, 'destroy'])->name('categories.destroy');

    // Product SKUs CRUD
    Route::get('/product-skus', [AdminProductSku::class, 'index'])->name('product-skus.index');
    Route::post('/product-skus', [AdminProductSku::class, 'store'])->name('product-skus.store');
    Route::put('/product-skus/{productSku}', [AdminProductSku::class, 'update'])->name('product-skus.update');
    Route::delete('/product-skus/{productSku}', [AdminProductSku::class, 'destroy'])->name('product-skus.destroy');
    Route::post('/product-skus/{productSku}/update-stock', [AdminProductSku::class, 'updateStock'])->name('product-skus.update-stock');

    // Orders CRUD
    Route::get('/orders', [AdminOrder::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [AdminOrder::class, 'show'])->name('orders.show');
    Route::post('/orders/{order}/update-status', [AdminOrder::class, 'updateStatus'])->name('orders.update-status');

    // Shipments CRUD
    Route::get('/shipments', [AdminShipment::class, 'index'])->name('shipments.index');
    Route::post('/shipments', [AdminShipment::class, 'store'])->name('shipments.store');
    Route::put('/shipments/{shipment}', [AdminShipment::class, 'update'])->name('shipments.update');
    Route::delete('/shipments/{shipment}', [AdminShipment::class, 'destroy'])->name('shipments.destroy');
    Route::post('/shipments/{shipment}/update-status', [AdminShipment::class, 'updateStatus'])->name('shipments.update-status');

    // Users
    Route::get('/users', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('users.index');

    // Product Ratings
    Route::get('/product-ratings', [AdminProduct::class, 'ratings'])->name('product-ratings.index');
    Route::get('/product-ratings/{product}', [AdminProduct::class, 'showProductRatings'])->name('product-ratings.show');
    Route::post('/product-ratings/{rating}/approve', [AdminProduct::class, 'approveRating'])->name('product-ratings.approve');
    Route::post('/product-ratings/{rating}/reject', [AdminProduct::class, 'rejectRating'])->name('product-ratings.reject');
    Route::delete('/product-ratings/{rating}', [AdminProduct::class, 'destroyRating'])->name('product-ratings.destroy');

    // Promo Management (Voucher & Product Discount)
    Route::get('/vouchers', [AdminPromo::class, 'index'])->name('vouchers.index');
    Route::post('/vouchers', [AdminPromo::class, 'storeVoucher'])->name('vouchers.store');
    Route::put('/vouchers/{voucher}', [AdminPromo::class, 'updateVoucher'])->name('vouchers.update');
    Route::delete('/vouchers/{voucher}', [AdminPromo::class, 'destroyVoucher'])->name('vouchers.destroy');
    Route::post('/discounts', [AdminPromo::class, 'storeDiscount'])->name('discounts.store');
    Route::put('/discounts/{discount}', [AdminPromo::class, 'updateDiscount'])->name('discounts.update');
    Route::delete('/discounts/{discount}', [AdminPromo::class, 'destroyDiscount'])->name('discounts.destroy');

    // Settings
    Route::get('/settings', [AdminSettings::class, 'index'])->name('settings.index');
    Route::patch('/settings/profile', [AdminSettings::class, 'updateProfile'])->name('settings.profile.update');
    Route::patch('/settings/password', [AdminSettings::class, 'updatePassword'])->name('settings.password.update');
});

require __DIR__.'/auth.php';

// 404 Fallback Route
Route::fallback(function () {
    return Inertia::render('Errors/NotFound')->toResponse(request())->setStatusCode(404);
});
