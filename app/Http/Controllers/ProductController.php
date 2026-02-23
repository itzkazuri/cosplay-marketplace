<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display products listing page with filters.
     */
    public function index(Request $request): Response
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->withCount(['products' => fn ($query) => $query->where('is_active', true)])
            ->orderByDesc('products_count')
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'type' => $category->type,
                'image' => $category->image,
                'productsCount' => $category->products_count,
            ]);

        // Get price range for filter
        $priceRange = Product::query()
            ->where('is_active', true)
            ->selectRaw('MIN(base_price) as min_price, MAX(base_price) as max_price')
            ->first();

        return Inertia::render('Products/Index', [
            'categories' => $categories,
            'filters' => $request->only(['category', 'min_price', 'max_price', 'discount', 'sort', 'search']),
            'priceRange' => [
                'min' => (int) ($priceRange->min_price ?? 0),
                'max' => (int) ($priceRange->max_price ?? 1000000),
            ],
        ]);
    }

    /**
     * Get products with filters (API for dynamic filtering).
     */
    public function filter(Request $request): JsonResponse
    {
        $query = Product::query()
            ->where('is_active', true)
            ->with(['category', 'discount' => fn ($q) => $q->active()])
            ->withCount(['ratings as reviews_count' => fn ($q) => $q->visible()])
            ->withAvg(['ratings as average_rating' => fn ($q) => $q->visible()], 'rating');

        // Category filter
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // Price range filter
        if ($request->filled('min_price')) {
            $query->where('base_price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('base_price', '<=', $request->max_price);
        }

        // Discount filter
        if ($request->boolean('discount')) {
            $query->whereHas('discount', fn ($q) => $q->active());
        }

        // Search filter
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'ILIKE', "%{$request->search}%")
                    ->orWhere('description', 'ILIKE', "%{$request->search}%");
            });
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        match ($sort) {
            'price_asc' => $query->orderBy('base_price', 'asc'),
            'price_desc' => $query->orderBy('base_price', 'desc'),
            'rating' => $query->orderByDesc('average_rating'),
            'popular' => $query->withCount(['ratings' => fn ($q) => $q->visible()])
                ->orderByDesc('ratings_count'),
            default => $query->latest(), // latest
        };

        $products = $query->paginate($request->get('per_page', 12))
            ->through(function (Product $product) {
                $basePrice = (float) $product->base_price;
                $discount = $product->discount;
                $finalPrice = $basePrice;
                $originalPrice = null;

                if ($discount) {
                    $discountValue = (float) $discount->value;
                    if ($discount->type === 'percentage') {
                        $finalPrice = max(0, $basePrice - ($basePrice * ($discountValue / 100)));
                    } else {
                        $finalPrice = max(0, $basePrice - $discountValue);
                    }
                    $originalPrice = $basePrice;
                }

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'category' => $product->category?->name,
                    'categorySlug' => $product->category?->slug,
                    'image' => $product->main_image,
                    'price' => round($finalPrice),
                    'originalPrice' => $originalPrice ? round($originalPrice) : null,
                    'rating' => round((float) ($product->average_rating ?? 0), 1),
                    'reviews' => (int) ($product->reviews_count ?? 0),
                    'discount' => $discount ? [
                        'type' => $discount->type,
                        'value' => (float) $discount->value,
                    ] : null,
                ];
            });

        return response()->json([
            'products' => $products,
            'filters' => [
                'category' => $request->category,
                'min_price' => $request->min_price,
                'max_price' => $request->max_price,
                'discount' => $request->boolean('discount'),
                'sort' => $request->sort,
                'search' => $request->search,
            ],
        ]);
    }

    /**
     * Search products and return recommendations based on query.
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->input('q', '');

        // If query is empty, return popular searches
        if (empty(trim($query))) {
            return $this->getPopularSearches();
        }

        // Search products by name or description
        $products = Product::query()
            ->where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('name', 'ILIKE', "%{$query}%")
                    ->orWhere('description', 'ILIKE', "%{$query}%");
            })
            ->with(['category', 'discount' => fn ($q) => $q->active()])
            ->withCount(['ratings as reviews_count' => fn ($q) => $q->visible()])
            ->withAvg(['ratings as average_rating' => fn ($q) => $q->visible()], 'rating')
            ->limit(8)
            ->get()
            ->map(function (Product $product) {
                $basePrice = (float) $product->base_price;
                $discount = $product->discount;
                $finalPrice = $basePrice;
                $originalPrice = null;

                if ($discount) {
                    $discountValue = (float) $discount->value;
                    if ($discount->type === 'percentage') {
                        $finalPrice = max(0, $basePrice - ($basePrice * ($discountValue / 100)));
                    } else {
                        $finalPrice = max(0, $basePrice - $discountValue);
                    }

                    $originalPrice = $basePrice;
                }

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'category' => $product->category?->name,
                    'categorySlug' => $product->category?->slug,
                    'image' => $product->main_image,
                    'price' => round($finalPrice),
                    'originalPrice' => $originalPrice ? round($originalPrice) : null,
                    'rating' => round((float) ($product->average_rating ?? 0), 1),
                    'reviews' => (int) ($product->reviews_count ?? 0),
                ];
            });

        return response()->json([
            'products' => $products,
            'popularSearches' => [],
            'hasResults' => $products->count() > 0,
        ]);
    }

    /**
     * Get popular searches (trending terms based on product names and categories).
     */
    private function getPopularSearches(): JsonResponse
    {
        // Get popular search terms from top-rated products and categories
        $topProducts = Product::query()
            ->where('is_active', true)
            ->withAvg(['ratings as average_rating' => fn ($q) => $q->visible()], 'rating')
            ->orderByDesc('average_rating')
            ->limit(5)
            ->pluck('name');

        $topCategories = Category::query()
            ->where('is_active', true)
            ->withCount(['products' => fn ($q) => $q->where('is_active', true)])
            ->orderByDesc('products_count')
            ->limit(3)
            ->pluck('name');

        // Combine and create popular searches list
        $popularSearches = [];

        // Add category names
        foreach ($topCategories as $category) {
            $popularSearches[] = $category;
        }

        // Add product names (shortened if needed)
        foreach ($topProducts->take(2) as $productName) {
            // Extract key terms from product name (e.g., "Cosplay Naruto" -> "Naruto")
            $words = explode(' ', $productName);
            $keyWord = collect($words)
                ->reject(fn ($word) => in_array(strtolower($word), ['cosplay', 'kostum', 'outfit', 'uniform']))
                ->first() ?? $productName;

            if (! in_array($keyWord, $popularSearches)) {
                $popularSearches[] = $keyWord;
            }
        }

        // Add some fixed popular terms if we don't have enough
        $fixedTerms = ['Wig', 'Aksesoris', 'Sepatu', 'Pedang', 'Topeng'];
        foreach ($fixedTerms as $term) {
            if (count($popularSearches) >= 5) {
                break;
            }
            if (! in_array($term, $popularSearches)) {
                $popularSearches[] = $term;
            }
        }

        // Limit to 5 popular searches
        $popularSearches = array_slice(array_values($popularSearches), 0, 5);

        return response()->json([
            'products' => [],
            'popularSearches' => $popularSearches,
            'hasResults' => false,
        ]);
    }
}
