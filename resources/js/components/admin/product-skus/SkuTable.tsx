import { Edit, Trash2, Shirt, Palette, Settings, Warehouse } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    slug: string;
}

interface Sku {
    id: number;
    product_id: number;
    sku: string;
    size: string | null;
    gender: string | null;
    color: string | null;
    custom_option: string | null;
    price: string | number;
    stock: number;
    is_custom_order: boolean;
    is_active: boolean;
    product: Product;
}

interface SkuTableProps {
    skus: Sku[];
    onEdit: (sku: Sku) => void;
    onDelete: (skuId: number, skuCode: string) => void;
    onUpdateStock: (skuId: number, currentStock: number) => void;
}

const getSizeLabel = (size: string | null): string => {
    if (!size) return '-';
    const labels: Record<string, string> = {
        xs: 'XS', s: 'S', m: 'M', l: 'L', xl: 'XL', xxl: 'XXL', xxxl: 'XXXL',
        free_size: 'Free Size', custom: 'Custom',
    };
    return labels[size.toLowerCase()] || size;
};

const getGenderLabel = (gender: string | null): string => {
    if (!gender) return '-';
    const labels: Record<string, string> = {
        unisex: 'Unisex', male: 'Pria', female: 'Wanita',
    };
    return labels[gender] || gender;
};

const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Habis', color: 'text-error', bg: 'bg-error/10' };
    if (stock <= 5) return { label: 'Rendah', color: 'text-warning', bg: 'bg-warning/10' };
    return { label: 'Tersedia', color: 'text-success', bg: 'bg-success/10' };
};

export default function SkuTable({ skus, onEdit, onDelete, onUpdateStock }: SkuTableProps) {
    const formatPrice = (price: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(typeof price === 'string' ? parseFloat(price) : price);
    };

    if (skus.length === 0) {
        return (
            <div className="card bg-base-100 border border-base-300 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-base-content/20" />
                </div>
                <h3 className="font-bold text-lg text-base-content mb-2">Tidak ada SKU yang ditemukan</h3>
                <p className="text-sm text-base-content/50">Coba ubah filter pencarian atau tambah SKU baru</p>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-300">
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200/50">
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">SKU</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Produk</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Varian</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Harga</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Stok</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Status</th>
                            <th className="w-16"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {skus.map((sku) => {
                            const stockStatus = getStockStatus(sku.stock);
                            return (
                                <tr key={sku.id} className="hover:bg-primary/5 transition-colors group">
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-primary font-mono">
                                                {sku.sku}
                                            </span>
                                            <span className="text-[10px] text-base-content/50">
                                                #{sku.id.toString().padStart(5, '0')}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm truncate max-w-[200px]">
                                                {sku.product.name}
                                            </span>
                                            <span className="text-[10px] text-base-content/50">
                                                /{sku.product.slug}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-wrap gap-1">
                                            {sku.size && (
                                                <span className="badge badge-outline badge-sm gap-1 font-bold rounded-lg border-base-300">
                                                    <Shirt className="w-3 h-3" />
                                                    {getSizeLabel(sku.size)}
                                                </span>
                                            )}
                                            {sku.gender && (
                                                <span className="badge badge-outline badge-sm gap-1 font-bold rounded-lg border-base-300">
                                                    <Settings className="w-3 h-3" />
                                                    {getGenderLabel(sku.gender)}
                                                </span>
                                            )}
                                            {sku.color && (
                                                <span className="badge badge-outline badge-sm gap-1 font-bold rounded-lg border-base-300">
                                                    <Palette className="w-3 h-3" />
                                                    {sku.color}
                                                </span>
                                            )}
                                            {!sku.size && !sku.gender && !sku.color && (
                                                <span className="text-xs text-base-content/40">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="font-black text-sm">
                                        {formatPrice(sku.price)}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => onUpdateStock(sku.id, sku.stock)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-sm transition-colors ${stockStatus.bg} ${stockStatus.color} hover:opacity-80`}
                                            title="Klik untuk update stok"
                                        >
                                            <Warehouse className="w-4 h-4" />
                                            {sku.stock}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="flex flex-col gap-1">
                                            <span className={`badge badge-sm font-bold py-1.5 px-2 rounded-lg ${
                                                sku.is_active ? 'badge-success' : 'badge-ghost'
                                            }`}>
                                                {sku.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                            {sku.is_custom_order && (
                                                <span className="badge badge-warning badge-sm font-bold py-1.5 px-2 rounded-lg">
                                                    Pre-Order
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => onEdit(sku)}
                                                className="btn btn-ghost btn-xs btn-square text-warning hover:bg-warning/10 rounded-xl"
                                                title="Edit SKU"
                                            >
                                                <Edit className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(sku.id, sku.sku)}
                                                className="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10 rounded-xl"
                                                title="Hapus SKU"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
