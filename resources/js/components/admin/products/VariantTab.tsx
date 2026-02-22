import {
    Plus,
    Trash2,
    Settings,
    Shirt,
    Palette,
    Tag,
    Package,
    DollarSign,
} from "lucide-react";

interface SkuData {
    id?: number;
    sku: string;
    size?: string | null;
    gender?: string | null;
    color?: string | null;
    custom_option?: string | null;
    price: string | number;
    stock: string | number;
    is_custom_order?: boolean;
    is_active?: boolean;
}

interface VariantTabProps {
    skus: SkuData[];
    basePriceError?: string;
    errors: {
        skus?: Record<
            number,
            {
                sku?: string;
                price?: string;
                stock?: string;
            }
        >;
    };
    onAddSku: () => void;
    onRemoveSku: (index: number) => void;
    onUpdateSku: (
        index: number,
        field: string,
        value: string | number | boolean | null,
    ) => void;
}

const sizeOptions = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL",
    "free_size",
    "custom",
];
const genderOptions = [
    { value: "unisex", label: "Unisex" },
    { value: "male", label: "Pria" },
    { value: "female", label: "Wanita" },
];

export default function VariantTab({
    skus,
    basePriceError,
    errors,
    onAddSku,
    onRemoveSku,
    onUpdateSku,
}: VariantTabProps) {
    return (
        <div className="space-y-4">
            {basePriceError && (
                <div className="alert alert-error rounded-xl">
                    <span className="text-xs font-semibold">
                        {basePriceError}
                    </span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-base-content">
                        Variant & Stok
                    </h3>
                    <p className="text-xs text-base-content/50">
                        Kelola semua variant produk (ukuran, warna, dll)
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onAddSku}
                    className="btn btn-primary btn-sm gap-2 rounded-xl font-bold shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Variant
                </button>
            </div>

            {/* SKUs List */}
            {skus.length === 0 ? (
                <div className="card bg-base-100 border border-base-300 rounded-2xl p-8 text-center">
                    <Package className="w-12 h-12 text-base-content/20 mx-auto mb-3" />
                    <h4 className="font-bold text-base-content mb-1">
                        Belum ada variant
                    </h4>
                    <p className="text-xs text-base-content/50 mb-4">
                        Tambahkan variant untuk mengatur ukuran, warna, dan stok
                    </p>
                    <button
                        type="button"
                        onClick={onAddSku}
                        className="btn btn-outline btn-sm gap-2 rounded-xl"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Variant Pertama
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {skus.map((sku, index) => (
                        <div
                            key={sku.id || `sku-${index}`}
                            className="card bg-base-100 border border-base-300 rounded-2xl p-4"
                        >
                            {/* Card Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="badge badge-primary badge-sm font-bold">
                                        #{index + 1}
                                    </div>
                                    <span className="font-bold text-sm text-base-content">
                                        Variant {sku.sku || "Baru"}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onRemoveSku(index)}
                                    className="btn btn-ghost btn-xs text-error hover:bg-error/10 rounded-xl"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>

                            {/* Row 1: SKU (full width on its own row for readability) */}
                            <div className="mb-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs flex items-center gap-1">
                                            <Tag className="w-3 h-3" />
                                            Kode SKU (Otomatis){" "}
                                            <span className="text-error">
                                                *
                                            </span>
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: NARUTO-SAGE-M"
                                        value={sku.sku}
                                        onChange={(e) =>
                                            onUpdateSku(
                                                index,
                                                "sku",
                                                e.target.value,
                                            )
                                        }
                                        className={`input input-bordered input-sm rounded-xl font-medium focus:input-primary ${
                                            errors.skus?.[index]?.sku
                                                ? "input-error"
                                                : ""
                                        }`}
                                    />
                                    <label className="label">
                                        <span className="label-text-alt text-base-content/40">
                                            Diisi otomatis dari nama produk +
                                            variant. Anda tetap bisa ubah
                                            manual.
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Row 2: Ukuran, Gender, Warna */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                {/* Size */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs flex items-center gap-1">
                                            <Shirt className="w-3 h-3" />
                                            Ukuran
                                        </span>
                                    </label>
                                    <select
                                        value={sku.size || ""}
                                        onChange={(e) =>
                                            onUpdateSku(
                                                index,
                                                "size",
                                                e.target.value || null,
                                            )
                                        }
                                        className="select select-bordered select-sm rounded-xl font-medium focus:select-primary"
                                    >
                                        <option value="">Pilih Ukuran</option>
                                        {sizeOptions.map((size) => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Gender */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs flex items-center gap-1">
                                            <Settings className="w-3 h-3" />
                                            Gender
                                        </span>
                                    </label>
                                    <select
                                        value={sku.gender || "unisex"}
                                        onChange={(e) =>
                                            onUpdateSku(
                                                index,
                                                "gender",
                                                e.target.value,
                                            )
                                        }
                                        className="select select-bordered select-sm rounded-xl font-medium focus:select-primary"
                                    >
                                        {genderOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Color */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs flex items-center gap-1">
                                            <Palette className="w-3 h-3" />
                                            Warna
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Orange"
                                        value={sku.color || ""}
                                        onChange={(e) =>
                                            onUpdateSku(
                                                index,
                                                "color",
                                                e.target.value || null,
                                            )
                                        }
                                        className="input input-bordered input-sm rounded-xl font-medium focus:input-primary"
                                    />
                                </div>
                            </div>

                            {/* Row 3: Opsi Custom, Harga, Stok */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Custom Option */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs flex items-center gap-1">
                                            <Settings className="w-3 h-3" />
                                            Opsi Custom
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Catatan khusus"
                                        value={sku.custom_option || ""}
                                        onChange={(e) =>
                                            onUpdateSku(
                                                index,
                                                "custom_option",
                                                e.target.value || null,
                                            )
                                        }
                                        className="input input-bordered input-sm rounded-xl font-medium focus:input-primary"
                                    />
                                </div>

                                {/* Price */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs flex items-center gap-1">
                                            <DollarSign className="w-3 h-3" />
                                            Harga per SKU{" "}
                                            <span className="text-error">
                                                *
                                            </span>
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={sku.price}
                                        onChange={(e) =>
                                            onUpdateSku(
                                                index,
                                                "price",
                                                e.target.value,
                                            )
                                        }
                                        className={`input input-bordered input-sm rounded-xl font-medium focus:input-primary ${
                                            errors.skus?.[index]?.price
                                                ? "input-error"
                                                : ""
                                        }`}
                                    />
                                </div>

                                {/* Stock */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs flex items-center gap-1">
                                            <Package className="w-3 h-3" />
                                            Stok{" "}
                                            <span className="text-error">
                                                *
                                            </span>
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={sku.stock}
                                        onChange={(e) =>
                                            onUpdateSku(
                                                index,
                                                "stock",
                                                e.target.value,
                                            )
                                        }
                                        className={`input input-bordered input-sm rounded-xl font-medium focus:input-primary ${
                                            errors.skus?.[index]?.stock
                                                ? "input-error"
                                                : ""
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-base-200">
                                <label className="label cursor-pointer gap-2">
                                    <span className="label-text font-bold text-xs">
                                        Custom Order
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={sku.is_custom_order || false}
                                        onChange={(e) =>
                                            onUpdateSku(
                                                index,
                                                "is_custom_order",
                                                e.target.checked,
                                            )
                                        }
                                        className="checkbox checkbox-sm checkbox-primary rounded-lg"
                                    />
                                </label>
                                <label className="label cursor-pointer gap-2">
                                    <span className="label-text font-bold text-xs">
                                        Aktif
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={sku.is_active ?? true}
                                        onChange={(e) =>
                                            onUpdateSku(
                                                index,
                                                "is_active",
                                                e.target.checked,
                                            )
                                        }
                                        className="checkbox checkbox-sm checkbox-success rounded-lg"
                                    />
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
