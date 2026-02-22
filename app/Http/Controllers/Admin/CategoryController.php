<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Models\Category;
use App\Support\MediaStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index(): Response
    {
        $categories = Category::latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new category.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Categories/CreateEdit', [
            'category' => null,
        ]);
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = MediaStorage::storeUploadedImage($validated['image'], 'category');
        }

        Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'image' => $imagePath,
            'type' => $validated['type'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Kategori berhasil ditambahkan!');
    }

    /**
     * Show the form for editing the specified category.
     */
    public function edit(Category $category): Response
    {
        return Inertia::render('Admin/Categories/CreateEdit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified category in storage.
     */
    public function update(StoreCategoryRequest $request, Category $category): RedirectResponse
    {
        $validated = $request->validated();
        $imagePath = $category->getRawOriginal('image');

        if ($request->hasFile('image')) {
            $imagePath = MediaStorage::storeUploadedImage($validated['image'], 'category');
            MediaStorage::deleteIfStored($category->getRawOriginal('image'));
        }

        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'image' => $imagePath,
            'type' => $validated['type'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Kategori berhasil diperbarui!');
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(Category $category): RedirectResponse
    {
        // Check if category has products
        if ($category->products()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Tidak dapat menghapus kategori yang masih memiliki produk.');
        }

        MediaStorage::deleteIfStored($category->getRawOriginal('image'));
        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Kategori berhasil dihapus!');
    }
}
