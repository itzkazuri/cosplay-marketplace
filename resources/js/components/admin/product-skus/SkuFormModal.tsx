import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    X,
    Save,
    Package,
    Tag,
    Shirt,
    Palette,
    Settings,
    DollarSign,
    Warehouse,
} from "lucide-react";

interface Product {
    id: number;
    name: string;
    slug: string;
}

interface SkuData {
    id?: number;
    product_id: number | string;
    sku: string;
    size: string | null;
    gender: string | null;
    color: string | null;
    custom_option: string | null;
    price: string | number;
    stock: string | number;
    is_custom_order: boolean;
    is_active: boolean;
}

interface SkuFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    products: Product[];
    initialData?: SkuData | null;
    isSubmitting?: boolean;
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

export default function SkuFormModal({
    isOpen,
    onClose,
    onSubmit,
    products,
    initialData,
    isSubmitting = false,
}: SkuFormModalProps) {
    const isEditing = !!initialData?.id;

    const { data, setData, errors, reset } = useForm({
        product_id: initialData?.product_id || "",
        sku: initialData?.sku || "",
        size: initialData?.size || null,
        gender: initialData?.gender || "unisex",
        color: initialData?.color || null,
        custom_option: initialData?.custom_option || null,
        price: initialData?.price || "",
        stock: initialData?.stock || 0,
        is_custom_order: initialData?.is_custom_order || false,
        is_active: initialData?.is_active ?? true,
    });

    useEffect(() => {
        if (initialData) {
            reset({
                product_id: initialData.product_id || "",
                sku: initialData.sku || "",
                size: initialData.size || null,
                gender: initialData.gender || "unisex",
                color: initialData.color || null,
                custom_option: initialData.custom_option || null,
                price: initialData.price || "",
                stock: initialData.stock || 0,
                is_custom_order: initialData.is_custom_order || false,
                is_active: initialData.is_active ?? true,
            });
        } else {
            reset({
                product_id: "",
                sku: "",
                size: null,
                gender: "unisex",
                color: null,
                custom_option: null,
                price: "",
                stock: 0,
                is_custom_order: false,
                is_active: true,
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(data);
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-base-content/20 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-base-100 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-base-300">
                {/* Header */}
                <div className="sticky top-0 bg-base-100 border-b border-base-300 p-5 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-xl font-black text-base-content flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            {isEditing ? "Edit SKU" : "Tambah SKU Baru"}
                        </h2>
                        <p className="text-xs text-base-content/50 mt-0.5">
                            {isEditing
                                ? "Perbarui informasi SKU"
                                : "Tambah variant produk baru"}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="btn btn-ghost btn-sm btn-square rounded-xl"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Product & SKU */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold text-xs flex items-center gap-1">
                                    <Package className="w-3 h-3 text-primary" />
                                    Produk <span className="text-error">*</span>
                                </span>
                            </label>
                            <select
                                value={data.product_id}
                                onChange={(e) =>
                                    setData("product_id", e.target.value)
                                }
                                disabled={isEditing}
                                className={`select select-bordered select-sm rounded-xl font-medium focus:select-primary disabled:opacity-50 ${
                                    errors.product_id ? "select-error" : ""
                                }`}
                            >
                                <option value="">Pilih Produk</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                            {errors.product_id && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {errors.product_id}
                                    </span>
                                </label>
                            )}
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold text-xs flex items-center gap-1">
                                    <Tag className="w-3 h-3 text-primary" />
                                    Kode SKU{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: NARUTO-SAGE-M"
                                value={data.sku}
                                onChange={(e) => setData("sku", e.target.value)}
                                className={`input input-bordered input-sm rounded-xl font-medium focus:input-primary ${
                                    errors.sku ? "input-error" : ""
                                }`}
                            />
                            {errors.sku && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {errors.sku}
                                    </span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Size & Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold text-xs flex items-center gap-1">
                                    <Shirt className="w-3 h-3 text-primary" />
                                    Ukuran
                                </span>
                            </label>
                            <select
                                value={data.size || ""}
                                onChange={(e) =>
                                    setData("size", e.target.value || null)
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

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold text-xs flex items-center gap-1">
                                    <Settings className="w-3 h-3 text-primary" />
                                    Gender
                                </span>
                            </label>
                            <select
                                value={data.gender || "unisex"}
                                onChange={(e) =>
                                    setData("gender", e.target.value)
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
                    </div>

                    {/* Color & Custom Option */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold text-xs flex items-center gap-1">
                                    <Palette className="w-3 h-3 text-primary" />
                                    Warna
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: Orange"
                                value={data.color || ""}
                                onChange={(e) =>
                                    setData("color", e.target.value || null)
                                }
                                className="input input-bordered input-sm rounded-xl font-medium focus:input-primary"
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold text-xs flex items-center gap-1">
                                    <Settings className="w-3 h-3 text-primary" />
                                    Opsi Custom
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Catatan khusus"
                                value={data.custom_option || ""}
                                onChange={(e) =>
                                    setData(
                                        "custom_option",
                                        e.target.value || null,
                                    )
                                }
                                className="input input-bordered input-sm rounded-xl font-medium focus:input-primary"
                            />
                        </div>
                    </div>

                    {/* Price & Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold text-xs flex items-center gap-1">
                                    <DollarSign className="w-3 h-3 text-primary" />
                                    Harga <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={data.price}
                                onChange={(e) =>
                                    setData("price", e.target.value)
                                }
                                className={`input input-bordered input-sm rounded-xl font-medium focus:input-primary ${
                                    errors.price ? "input-error" : ""
                                }`}
                            />
                            {errors.price && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {errors.price}
                                    </span>
                                </label>
                            )}
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold text-xs flex items-center gap-1">
                                    <Warehouse className="w-3 h-3 text-primary" />
                                    Stok <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={data.stock}
                                onChange={(e) =>
                                    setData("stock", e.target.value)
                                }
                                className={`input input-bordered input-sm rounded-xl font-medium focus:input-primary ${
                                    errors.stock ? "input-error" : ""
                                }`}
                            />
                            {errors.stock && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {errors.stock}
                                    </span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label className="label cursor-pointer gap-3 p-3 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        data.is_custom_order
                                            ? "bg-warning/20"
                                            : "bg-base-content/10"
                                    }`}
                                >
                                    <Settings
                                        className={`w-4 h-4 ${
                                            data.is_custom_order
                                                ? "text-warning"
                                                : "text-base-content/40"
                                        }`}
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs">
                                        Custom Order
                                    </h4>
                                    <p className="text-[10px] text-base-content/50">
                                        Pre-order sesuai pesanan
                                    </p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={data.is_custom_order}
                                onChange={(e) =>
                                    setData("is_custom_order", e.target.checked)
                                }
                                className="checkbox checkbox-sm checkbox-warning rounded-lg"
                            />
                        </label>

                        <label className="label cursor-pointer gap-3 p-3 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        data.is_active
                                            ? "bg-success/20"
                                            : "bg-base-content/10"
                                    }`}
                                >
                                    <Settings
                                        className={`w-4 h-4 ${
                                            data.is_active
                                                ? "text-success"
                                                : "text-base-content/40"
                                        }`}
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs">
                                        SKU Aktif
                                    </h4>
                                    <p className="text-[10px] text-base-content/50">
                                        Tampilkan di katalog
                                    </p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData("is_active", e.target.checked)
                                }
                                className="checkbox checkbox-sm checkbox-success rounded-lg"
                            />
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-base-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn btn-ghost gap-2 rounded-xl font-bold"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary gap-2 rounded-xl font-black shadow-lg shadow-primary/20"
                        >
                            <Save className="w-4 h-4" />
                            {isSubmitting
                                ? "Menyimpan..."
                                : isEditing
                                  ? "Simpan Perubahan"
                                  : "Simpan SKU"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
