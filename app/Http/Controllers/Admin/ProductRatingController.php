<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductRating;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductRatingController extends Controller
{
    /**
     * Display a listing of product ratings.
     */
    public function index(Request $request): Response
    {
        $query = ProductRating::with(['product', 'user', 'order'])
            ->latest();

        // Filter by product
        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

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
                    })
                    ->orWhereHas('product', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $ratings = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/ProductRatings', [
            'ratings' => $ratings,
            'filters' => [
                'product_id' => $request->product_id,
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
    public function approve(ProductRating $rating): \Symfony\Component\HttpFoundation\Response
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
    public function reject(ProductRating $rating): \Symfony\Component\HttpFoundation\Response
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
    public function destroy(ProductRating $rating): \Symfony\Component\HttpFoundation\Response
    {
        $rating->delete();

        return back()->with('success', 'Rating berhasil dihapus.');
    }
}
