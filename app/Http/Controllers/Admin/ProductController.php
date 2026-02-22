<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductRating;
use App\Support\MediaStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    private function resolveBasePrice(array $validated): float|int
    {
        if (isset($validated['base_price'])) {
            return $validated['base_price'];
        }

        $skuPrices = collect($validated['skus'] ?? [])
            ->pluck('price')
            ->filter(fn ($price): bool => is_numeric($price))
            ->map(fn ($price): float => (float) $price);

        return $skuPrices->min() ?? 0;
    }

    /**
     * Display a listing of products.
     */
    public function index(): Response
    {
        $products = Product::with(['category', 'skus'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Products', [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/Products/CreateEdit', [
            'product' => null,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            // Create product
            $product = Product::create([
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']),
                'description' => $validated['description'] ?? null,
                'base_price' => $this->resolveBasePrice($validated),
                'main_image' => MediaStorage::storeUploadedImage($validated['main_image'], 'costume/thumbnail'),
                'is_custom' => $validated['is_custom'] ?? false,
                'is_active' => $validated['is_active'] ?? true,
                'weight' => $validated['weight'],
            ]);

            // Create SKUs if provided
            if (! empty($validated['skus'])) {
                foreach ($validated['skus'] as $skuData) {
                    $product->skus()->create([
                        'sku' => $skuData['sku'],
                        'size' => $skuData['size'] ?? null,
                        'gender' => $skuData['gender'] ?? 'unisex',
                        'color' => $skuData['color'] ?? null,
                        'custom_option' => $skuData['custom_option'] ?? null,
                        'price' => $skuData['price'],
                        'stock' => $skuData['stock'] ?? 0,
                        'is_custom_order' => $skuData['is_custom_order'] ?? false,
                        'is_active' => $skuData['is_active'] ?? true,
                    ]);
                }
            }

            // Create images if provided
            if (! empty($validated['images'])) {
                foreach ($validated['images'] as $index => $imageFile) {
                    $product->images()->create([
                        'image_path' => MediaStorage::storeUploadedImage($imageFile, 'costume/preview'),
                        'sort_order' => $index,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('admin.products.index')
                ->with('success', 'Produk berhasil ditambahkan!');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()
                ->with('error', 'Gagal menambahkan produk: '.$e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product): Response
    {
        $product->load(['category', 'skus', 'images']);

        $product->setRelation('images', $product->images->map(function ($image) {
            return [
                'id' => $image->id,
                'url' => $image->image_path,
                'sort_order' => $image->sort_order,
            ];
        }));

        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/Products/CreateEdit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(StoreProductRequest $request, Product $product): RedirectResponse
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            // Update product
            $mainImagePath = $product->getRawOriginal('main_image');

            if ($request->hasFile('main_image')) {
                $mainImagePath = MediaStorage::storeUploadedImage($validated['main_image'], 'costume/thumbnail');
                MediaStorage::deleteIfStored($product->getRawOriginal('main_image'));
            }

            $product->update([
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']),
                'description' => $validated['description'] ?? null,
                'base_price' => $this->resolveBasePrice($validated),
                'main_image' => $mainImagePath,
                'is_custom' => $validated['is_custom'] ?? false,
                'is_active' => $validated['is_active'] ?? true,
                'weight' => $validated['weight'],
            ]);

            // Sync SKUs
            if (! empty($validated['skus'])) {
                // Get existing SKU IDs
                $existingSkuIds = $product->skus->pluck('id')->toArray();
                $updatedSkuIds = [];

                foreach ($validated['skus'] as $skuData) {
                    if (isset($skuData['id']) && in_array($skuData['id'], $existingSkuIds)) {
                        // Update existing SKU
                        $sku = $product->skus()->find($skuData['id']);
                        if ($sku) {
                            $sku->update([
                                'sku' => $skuData['sku'],
                                'size' => $skuData['size'] ?? null,
                                'gender' => $skuData['gender'] ?? 'unisex',
                                'color' => $skuData['color'] ?? null,
                                'custom_option' => $skuData['custom_option'] ?? null,
                                'price' => $skuData['price'],
                                'stock' => $skuData['stock'] ?? 0,
                                'is_custom_order' => $skuData['is_custom_order'] ?? false,
                                'is_active' => $skuData['is_active'] ?? true,
                            ]);
                            $updatedSkuIds[] = $sku->id;
                        }
                    } else {
                        // Create new SKU
                        $newSku = $product->skus()->create([
                            'sku' => $skuData['sku'],
                            'size' => $skuData['size'] ?? null,
                            'gender' => $skuData['gender'] ?? 'unisex',
                            'color' => $skuData['color'] ?? null,
                            'custom_option' => $skuData['custom_option'] ?? null,
                            'price' => $skuData['price'],
                            'stock' => $skuData['stock'] ?? 0,
                            'is_custom_order' => $skuData['is_custom_order'] ?? false,
                            'is_active' => $skuData['is_active'] ?? true,
                        ]);
                        $updatedSkuIds[] = $newSku->id;
                    }
                }

                // Delete SKUs that are not in the updated list
                $skusToDelete = array_diff($existingSkuIds, $updatedSkuIds);
                if (! empty($skusToDelete)) {
                    $product->skus()->whereIn('id', $skusToDelete)->delete();
                }
            } else {
                // If no SKUs provided, delete all existing SKUs
                $product->skus()->delete();
            }

            // Sync images
            if ($request->hasFile('images')) {
                $existingImagePaths = $product->images()->pluck('image_path')->all();

                foreach ($existingImagePaths as $existingImagePath) {
                    MediaStorage::deleteIfStored($existingImagePath);
                }

                // Delete existing images
                $product->images()->delete();

                // Create new images
                foreach ($validated['images'] as $index => $imageFile) {
                    $product->images()->create([
                        'image_path' => MediaStorage::storeUploadedImage($imageFile, 'costume/preview'),
                        'sort_order' => $index,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('admin.products.index')
                ->with('success', 'Produk berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()
                ->with('error', 'Gagal memperbarui produk: '.$e->getMessage());
        }
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        DB::beginTransaction();
        try {
            MediaStorage::deleteIfStored($product->getRawOriginal('main_image'));

            $previewImagePaths = $product->images()->pluck('image_path')->all();
            foreach ($previewImagePaths as $previewImagePath) {
                MediaStorage::deleteIfStored($previewImagePath);
            }

            $product->skus()->delete();
            $product->images()->delete();
            $product->delete();

            DB::commit();

            return redirect()->route('admin.products.index')
                ->with('success', 'Produk berhasil dihapus!');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()
                ->with('error', 'Gagal menghapus produk: '.$e->getMessage());
        }
    }

    /**
     * Display product ratings with per-product breakdown.
     */
    public function ratings(Request $request): Response
    {
        // Get all products with their rating statistics
        $productsQuery = Product::with(['category', 'ratings' => function ($query) {
            $query->select('product_id', DB::raw('AVG(rating) as average_rating'), DB::raw('COUNT(*) as total_ratings'))
                ->groupBy('product_id');
        }])
        ->withCount(['ratings as total_ratings_count' => function ($query) {
            $query->where('is_visible', true);
        }])
        ->withAvg(['ratings as average_rating' => function ($query) {
            $query->where('is_visible', true);
        }], 'rating')
        ->latest();

        // Search by product name
        if ($request->filled('search')) {
            $productsQuery->where('name', 'like', "%{$request->search}%");
        }

        // Filter by minimum rating
        if ($request->filled('min_rating')) {
            $productsQuery->havingRaw('AVG(CASE WHEN ratings.is_visible = 1 THEN ratings.rating END) >= ?', [$request->min_rating]);
        }

        $products = $productsQuery->paginate(15)->withQueryString();

        // Get rating statistics
        $totalRatings = ProductRating::count();
        $visibleRatings = ProductRating::where('is_visible', true)->count();
        $pendingRatings = ProductRating::whereNull('approved_at')->count();
        $averageRating = ProductRating::where('is_visible', true)->avg('rating') ?? 0;

        // Rating distribution
        $ratingDistribution = ProductRating::where('is_visible', true)
            ->select('rating', DB::raw('COUNT(*) as count'))
            ->groupBy('rating')
            ->orderByDesc('rating')
            ->get()
            ->pluck('count', 'rating');

        return Inertia::render('Admin/ProductRatings/Index', [
            'products' => $products,
            'statistics' => [
                'total' => $totalRatings,
                'visible' => $visibleRatings,
                'pending' => $pendingRatings,
                'average' => round($averageRating, 2),
                'distribution' => $ratingDistribution,
            ],
            'filters' => [
                'search' => $request->search,
                'min_rating' => $request->min_rating,
            ],
        ]);
    }

    /**
     * Show ratings for a specific product.
     */
    public function showProductRatings(Request $request, Product $product): Response
    {
        $query = ProductRating::with(['user', 'order'])
            ->where('product_id', $product->id)
            ->latest();

        // Filter by rating
        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        // Filter by verified purchase
        if ($request->boolean('verified')) {
            $query->where('is_verified_purchase', true);
        }

        // Filter by visibility
        if ($request->filled('visibility')) {
            $query->where('is_visible', $request->visibility === 'visible');
        }

        // Search by review text or user name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('review', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $ratings = $query->paginate(15)->withQueryString();

        // Product rating stats
        $productStats = [
            'total' => ProductRating::where('product_id', $product->id)->count(),
            'visible' => ProductRating::where('product_id', $product->id)->where('is_visible', true)->count(),
            'pending' => ProductRating::where('product_id', $product->id)->whereNull('approved_at')->count(),
            'average' => ProductRating::where('product_id', $product->id)->avg('rating') ?? 0,
        ];

        return Inertia::render('Admin/ProductRatings/Show', [
            'product' => $product,
            'ratings' => $ratings,
            'stats' => $productStats,
            'filters' => [
                'rating' => $request->rating,
                'verified' => $request->boolean('verified'),
                'visibility' => $request->visibility,
                'search' => $request->search,
            ],
        ]);
    }

    /**
     * Approve a product rating.
     */
    public function approveRating(ProductRating $rating): RedirectResponse
    {
        $rating->update([
            'is_visible' => true,
            'approved_at' => now(),
        ]);

        return back()->with('success', 'Rating berhasil disetujui.');
    }

    /**
     * Reject/hide a product rating.
     */
    public function rejectRating(ProductRating $rating): RedirectResponse
    {
        $rating->update([
            'is_visible' => false,
            'approved_at' => null,
        ]);

        return back()->with('success', 'Rating disembunyikan.');
    }

    /**
     * Delete a product rating.
     */
    public function destroyRating(ProductRating $rating): RedirectResponse
    {
        $rating->delete();

        return back()->with('success', 'Rating berhasil dihapus.');
    }
}
