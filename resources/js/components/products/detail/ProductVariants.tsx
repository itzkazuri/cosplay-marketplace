import { useState } from 'react';

interface ProductVariant {
    id: number;
    sku: string;
    size?: string | null;
    gender?: string | null;
    color?: string | null;
    price: number;
    stock: number;
    isCustomOrder: boolean;
}

interface Product {
    variants: ProductVariant[];
    sizes: string[];
    colors: string[];
    genders: string[];
    price: number;
}

interface ProductVariantsProps {
    product: Product;
    selectedVariant: ProductVariant | null;
    quantity: number;
    onVariantSelect: (variant: ProductVariant | null) => void;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    onBuyNow: () => void;
}

export default function ProductVariants({
    product,
    selectedVariant,
    quantity,
    onVariantSelect,
    onQuantityChange,
    onAddToCart,
    onBuyNow,
}: ProductVariantsProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(
        product.variants[0]?.size || null
    );
    const [selectedColor, setSelectedColor] = useState<string | null>(
        product.variants[0]?.color || null
    );
    const [selectedGender, setSelectedGender] = useState<string | null>(
        product.variants[0]?.gender || null
    );

    // Find variant based on selected options
    const findVariant = () => {
        return product.variants.find((variant) => {
            const sizeMatch = !selectedSize || variant.size === selectedSize;
            const colorMatch = !selectedColor || variant.color === selectedColor;
            const genderMatch = !selectedGender || variant.gender === selectedGender;
            return sizeMatch && colorMatch && genderMatch;
        });
    };

    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
        const variant = product.variants.find((v) => v.size === size);
        if (variant) {
            onVariantSelect(variant);
        }
    };

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        const variant = product.variants.find((v) => v.color === color);
        if (variant) {
            onVariantSelect(variant);
        }
    };

    const handleGenderSelect = (gender: string) => {
        setSelectedGender(gender);
        const variant = product.variants.find((v) => v.gender === gender);
        if (variant) {
            onVariantSelect(variant);
        }
    };

    const isOutOfStock = selectedVariant ? selectedVariant.stock === 0 : false;
    const maxQuantity = selectedVariant ? selectedVariant.stock : 0;

    return (
        <div className="mt-8 p-6 bg-base-100 rounded-2xl shadow-lg space-y-6">
            {/* Size Selection */}
            {product.sizes.length > 0 && (
                <div>
                    <label className="block text-sm font-semibold mb-3">
                        Ukuran
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => handleSizeSelect(size)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    selectedSize === size
                                        ? 'btn btn-primary'
                                        : 'btn btn-outline'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
                <div>
                    <label className="block text-sm font-semibold mb-3">
                        Warna
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => handleColorSelect(color)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    selectedColor === color
                                        ? 'btn btn-primary'
                                        : 'btn btn-outline'
                                }`}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Gender Selection */}
            {product.genders.length > 0 && (
                <div>
                    <label className="block text-sm font-semibold mb-3">
                        Gender
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {product.genders.map((gender) => (
                            <button
                                key={gender}
                                onClick={() => handleGenderSelect(gender)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    selectedGender === gender
                                        ? 'btn btn-primary'
                                        : 'btn btn-outline'
                                }`}
                            >
                                {gender === 'unisex'
                                    ? 'Unisex'
                                    : gender === 'male'
                                    ? 'Pria'
                                    : 'Wanita'}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Stock Info */}
            {selectedVariant && (
                <div className="flex items-center gap-2">
                    <span
                        className={`text-sm font-medium ${
                            isOutOfStock
                                ? 'text-error'
                                : selectedVariant.stock < 10
                                ? 'text-warning'
                                : 'text-success'
                        }`}
                    >
                        {isOutOfStock
                            ? 'Stok habis'
                            : selectedVariant.stock < 10
                            ? `Sisa ${selectedVariant.stock} stok`
                            : 'Stok tersedia'}
                    </span>
                </div>
            )}

            {/* Quantity */}
            {!isOutOfStock && (
                <div>
                    <label className="block text-sm font-semibold mb-3">
                        Jumlah
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                            className="btn btn-square btn-outline w-10"
                            disabled={quantity <= 1}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) =>
                                onQuantityChange(
                                    Math.min(
                                        maxQuantity || 10,
                                        Math.max(1, parseInt(e.target.value) || 1)
                                    )
                                )
                            }
                            className="input input-bordered w-20 text-center"
                            min="1"
                            max={maxQuantity || 10}
                        />
                        <button
                            onClick={() =>
                                onQuantityChange(Math.min(maxQuantity || 10, quantity + 1))
                            }
                            className="btn btn-square btn-outline w-10"
                            disabled={quantity >= (maxQuantity || 10)}
                        >
                            +
                        </button>
                        {maxQuantity > 0 && (
                            <span className="text-xs text-base-content/60 ml-2">
                                Maksimal {maxQuantity}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    onClick={onAddToCart}
                    disabled={isOutOfStock}
                    className="btn btn-primary flex-1"
                >
                    <span className="font-bold">Tambah ke Keranjang</span>
                </button>
                <button
                    onClick={onBuyNow}
                    disabled={isOutOfStock}
                    className="btn btn-secondary flex-1"
                >
                    <span className="font-bold">Beli Sekarang</span>
                </button>
            </div>
        </div>
    );
}
