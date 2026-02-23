import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    productsCount: number;
}

interface FilterSidebarProps {
    categories: Category[];
    priceRange: { min: number; max: number };
    filters: {
        category?: string | null;
        min_price?: string | null;
        max_price?: string | null;
        discount?: boolean;
    };
    onFilterChange: (filters: Record<string, any>) => void;
    onClearFilters: () => void;
}

export default function FilterSidebar({
    categories,
    priceRange,
    filters,
    onFilterChange,
    onClearFilters,
}: FilterSidebarProps) {
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        price: true,
        discount: true,
    });

    const [localPriceRange, setLocalPriceRange] = useState({
        min: filters.min_price || String(priceRange.min),
        max: filters.max_price || String(priceRange.max),
    });

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleCategoryChange = (categoryId: string | null) => {
        onFilterChange({ category: categoryId });
    };

    const handlePriceChange = () => {
        onFilterChange({
            min_price: localPriceRange.min || String(priceRange.min),
            max_price: localPriceRange.max || String(priceRange.max),
        });
    };

    const handleDiscountChange = (checked: boolean) => {
        onFilterChange({ discount: checked });
    };

    const hasActiveFilters =
        filters.category ||
        filters.min_price !== String(priceRange.min) ||
        filters.max_price !== String(priceRange.max) ||
        filters.discount;

    return (
        <div className="card bg-base-100 shadow-lg sticky top-20">
            <div className="card-body p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5" />
                        Filter
                    </h2>
                    {hasActiveFilters && (
                        <button
                            onClick={onClearFilters}
                            className="btn btn-ghost btn-xs text-error"
                        >
                            <X className="w-4 h-4" />
                            Reset
                        </button>
                    )}
                </div>

                {/* Category Filter */}
                <div className="mb-4">
                    <button
                        onClick={() => toggleSection('category')}
                        className="flex items-center justify-between w-full font-semibold text-sm mb-2"
                    >
                        <span>Kategori</span>
                        <ChevronDown
                            className={`w-4 h-4 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {expandedSections.category && (
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-200 cursor-pointer">
                                <input
                                    type="radio"
                                    name="category"
                                    className="radio radio-sm radio-primary"
                                    checked={!filters.category}
                                    onChange={() => handleCategoryChange(null)}
                                />
                                <span className="text-sm flex-1">Semua Kategori</span>
                            </label>
                            {categories.map((category) => (
                                <label
                                    key={category.id}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-200 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="category"
                                        className="radio radio-sm radio-primary"
                                        checked={filters.category === String(category.id)}
                                        onChange={() => handleCategoryChange(String(category.id))}
                                    />
                                    <span className="text-sm flex-1">{category.name}</span>
                                    <span className="text-xs text-base-content/60">
                                        {category.productsCount}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price Range Filter */}
                <div className="mb-4">
                    <button
                        onClick={() => toggleSection('price')}
                        className="flex items-center justify-between w-full font-semibold text-sm mb-2"
                    >
                        <span>Rentang Harga</span>
                        <ChevronDown
                            className={`w-4 h-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {expandedSections.price && (
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <div className="form-control flex-1">
                                    <label className="label-text text-xs mb-1">Min</label>
                                    <input
                                        type="number"
                                        value={localPriceRange.min}
                                        onChange={(e) =>
                                            setLocalPriceRange((prev) => ({
                                                ...prev,
                                                min: e.target.value,
                                            }))
                                        }
                                        onBlur={handlePriceChange}
                                        className="input input-sm input-bordered w-full"
                                        placeholder={String(priceRange.min)}
                                    />
                                </div>
                                <div className="form-control flex-1">
                                    <label className="label-text text-xs mb-1">Max</label>
                                    <input
                                        type="number"
                                        value={localPriceRange.max}
                                        onChange={(e) =>
                                            setLocalPriceRange((prev) => ({
                                                ...prev,
                                                max: e.target.value,
                                            }))
                                        }
                                        onBlur={handlePriceChange}
                                        className="input input-sm input-bordered w-full"
                                        placeholder={String(priceRange.max)}
                                    />
                                </div>
                            </div>

                            {/* Price Range Slider */}
                            <div className="px-2">
                                <input
                                    type="range"
                                    min={priceRange.min}
                                    max={priceRange.max}
                                    value={localPriceRange.max}
                                    onChange={(e) =>
                                        setLocalPriceRange((prev) => ({
                                            ...prev,
                                            max: e.target.value,
                                        }))
                                    }
                                    onMouseUp={handlePriceChange}
                                    onTouchEnd={handlePriceChange}
                                    className="range range-primary range-xs w-full"
                                />
                                <div className="flex justify-between text-xs text-base-content/60 mt-1">
                                    <span>Rp {priceRange.min.toLocaleString('id-ID')}</span>
                                    <span>Rp {priceRange.max.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Discount Filter */}
                <div className="mb-4">
                    <button
                        onClick={() => toggleSection('discount')}
                        className="flex items-center justify-between w-full font-semibold text-sm mb-2"
                    >
                        <span>Promosi</span>
                        <ChevronDown
                            className={`w-4 h-4 transition-transform ${expandedSections.discount ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {expandedSections.discount && (
                        <label className="flex items-center gap-2 p-3 rounded-lg hover:bg-base-200 cursor-pointer bg-base-100 border border-base-200">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-primary checkbox-sm"
                                checked={!!filters.discount}
                                onChange={(e) => handleDiscountChange(e.target.checked)}
                            />
                            <div>
                                <span className="text-sm font-medium">Sedang Diskon</span>
                                <p className="text-xs text-base-content/60">
                                    Tampilkan produk yang sedang promo
                                </p>
                            </div>
                        </label>
                    )}
                </div>
            </div>
        </div>
    );
}
