<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductSkuRequest;
use App\Models\Product;
use App\Models\ProductSku;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductSkuController extends Controller
{
    /**
     * Display a listing of product SKUs.
     */
    public function index(Request $request): Response
    {
        $skus = ProductSku::with(['product'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('sku', 'like', '%'.$request->search.'%')
                    ->orWhereHas('product', function ($q) use ($request) {
                        $q->where('name', 'like', '%'.$request->search.'%');
                    });
            })
            ->when($request->filled('product_id'), function ($query) use ($request) {
                $query->where('product_id', $request->product_id);
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $products = Product::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/ProductSkus/Index', [
            'skus' => $skus,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created product SKU in storage.
     */
    public function store(StoreProductSkuRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        ProductSku::create($validated);

        return redirect()->route('admin.product-skus.index')
            ->with('success', 'SKU produk berhasil ditambahkan!');
    }

    /**
     * Update the specified product SKU in storage.
     */
    public function update(StoreProductSkuRequest $request, ProductSku $productSku): RedirectResponse
    {
        $validated = $request->validated();

        $productSku->update($validated);

        return redirect()->route('admin.product-skus.index')
            ->with('success', 'SKU produk berhasil diperbarui!');
    }

    /**
     * Remove the specified product SKU from storage.
     */
    public function destroy(ProductSku $productSku): RedirectResponse
    {
        $productSku->delete();

        return redirect()->route('admin.product-skus.index')
            ->with('success', 'SKU produk berhasil dihapus!');
    }

    /**
     * Update stock for a product SKU.
     */
    public function updateStock(Request $request, ProductSku $productSku): RedirectResponse
    {
        $request->validate([
            'stock' => ['required', 'integer', 'min:0'],
            'note' => ['nullable', 'string', 'max:255'],
        ]);

        $oldStock = $productSku->stock;
        $productSku->update([
            'stock' => $request->stock,
        ]);

        return redirect()->back()
            ->with('success', "Stok diperbarui dari {$oldStock} ke {$request->stock}");
    }
}
