<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductDiscountRequest;
use App\Http\Requests\StoreVoucherRequest;
use App\Http\Requests\UpdateProductDiscountRequest;
use App\Http\Requests\UpdateVoucherRequest;
use App\Models\Product;
use App\Models\ProductDiscount;
use App\Models\Voucher;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PromoController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'base_price']);

        $discounts = ProductDiscount::query()
            ->with(['product:id,name,base_price'])
            ->latest()
            ->get();

        $vouchers = Voucher::query()
            ->with(['products:id,name,base_price'])
            ->latest()
            ->get();

        return Inertia::render('Admin/Promos/Index', [
            'products' => $products,
            'discounts' => $discounts,
            'vouchers' => $vouchers,
        ]);
    }

    public function storeDiscount(StoreProductDiscountRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        ProductDiscount::query()->create([
            'product_id' => $validated['product_id'],
            'name' => $validated['name'],
            'type' => $validated['type'],
            'value' => $validated['value'],
            'starts_at' => $validated['starts_at'] ?? null,
            'ends_at' => $validated['ends_at'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.vouchers.index')
            ->with('success', 'Diskon produk berhasil ditambahkan.');
    }

    public function updateDiscount(UpdateProductDiscountRequest $request, ProductDiscount $discount): RedirectResponse
    {
        $validated = $request->validated();

        $discount->update([
            'product_id' => $validated['product_id'],
            'name' => $validated['name'],
            'type' => $validated['type'],
            'value' => $validated['value'],
            'starts_at' => $validated['starts_at'] ?? null,
            'ends_at' => $validated['ends_at'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.vouchers.index')
            ->with('success', 'Diskon produk berhasil diperbarui.');
    }

    public function destroyDiscount(ProductDiscount $discount): RedirectResponse
    {
        $discount->delete();

        return redirect()->route('admin.vouchers.index')
            ->with('success', 'Diskon produk berhasil dihapus.');
    }

    public function storeVoucher(StoreVoucherRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $voucher = Voucher::query()->create([
            'name' => $validated['name'],
            'code' => strtoupper($validated['code']),
            'type' => $validated['type'],
            'value' => $validated['value'],
            'min_purchase' => $validated['min_purchase'] ?? null,
            'max_discount' => $validated['max_discount'] ?? null,
            'usage_limit' => $validated['usage_limit'] ?? null,
            'starts_at' => $validated['starts_at'] ?? null,
            'ends_at' => $validated['ends_at'] ?? null,
            'applies_to_all_products' => $validated['applies_to_all_products'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        if (! ($validated['applies_to_all_products'] ?? false)) {
            $voucher->products()->sync($validated['product_ids'] ?? []);
        }

        return redirect()->route('admin.vouchers.index')
            ->with('success', 'Voucher berhasil ditambahkan.');
    }

    public function updateVoucher(UpdateVoucherRequest $request, Voucher $voucher): RedirectResponse
    {
        $validated = $request->validated();

        $voucher->update([
            'name' => $validated['name'],
            'code' => strtoupper($validated['code']),
            'type' => $validated['type'],
            'value' => $validated['value'],
            'min_purchase' => $validated['min_purchase'] ?? null,
            'max_discount' => $validated['max_discount'] ?? null,
            'usage_limit' => $validated['usage_limit'] ?? null,
            'starts_at' => $validated['starts_at'] ?? null,
            'ends_at' => $validated['ends_at'] ?? null,
            'applies_to_all_products' => $validated['applies_to_all_products'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        if ($validated['applies_to_all_products'] ?? false) {
            $voucher->products()->detach();
        } else {
            $voucher->products()->sync($validated['product_ids'] ?? []);
        }

        return redirect()->route('admin.vouchers.index')
            ->with('success', 'Voucher berhasil diperbarui.');
    }

    public function destroyVoucher(Voucher $voucher): RedirectResponse
    {
        $voucher->delete();

        return redirect()->route('admin.vouchers.index')
            ->with('success', 'Voucher berhasil dihapus.');
    }
}
