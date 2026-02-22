import { Pencil, Plus, Trash2 } from 'lucide-react';

export interface PromoProduct {
    id: number;
    name: string;
    base_price: string | number;
}

export interface ProductDiscount {
    id: number;
    product_id: number;
    name: string;
    type: 'percentage' | 'fixed';
    value: string | number;
    starts_at: string | null;
    ends_at: string | null;
    is_active: boolean;
    product: PromoProduct;
}

interface DiscountTableProps {
    discounts: ProductDiscount[];
    onCreate: () => void;
    onEdit: (discount: ProductDiscount) => void;
    onDelete: (discount: ProductDiscount) => void;
}

function formatCurrency(value: string | number): string {
    const amount = typeof value === 'string' ? Number.parseFloat(value) : value;

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function DiscountTable({ discounts, onCreate, onEdit, onDelete }: DiscountTableProps): JSX.Element {
    return (
        <div className="card border border-base-300 bg-base-100 shadow-xl">
            <div className="card-body gap-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-black uppercase tracking-wide">Diskon Produk</h2>
                        <p className="text-xs font-medium text-base-content/60">Satu produk hanya boleh punya satu diskon aktif.</p>
                    </div>
                    <button type="button" className="btn btn-primary btn-sm rounded-xl font-black" onClick={onCreate}>
                        <Plus className="h-4 w-4" />
                        Tambah Diskon
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Produk</th>
                                <th>Nama Diskon</th>
                                <th>Nilai</th>
                                <th>Periode</th>
                                <th>Status</th>
                                <th className="w-32">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {discounts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-sm font-semibold text-base-content/50">
                                        Belum ada diskon produk.
                                    </td>
                                </tr>
                            ) : (
                                discounts.map((discount) => (
                                    <tr key={discount.id}>
                                        <td>
                                            <div className="font-bold">{discount.product.name}</div>
                                            <div className="text-xs text-base-content/60">{formatCurrency(discount.product.base_price)}</div>
                                        </td>
                                        <td className="font-semibold">{discount.name}</td>
                                        <td className="font-black">
                                            {discount.type === 'percentage' ? `${discount.value}%` : formatCurrency(discount.value)}
                                        </td>
                                        <td className="text-xs font-semibold">
                                            {discount.starts_at || '-'} s/d {discount.ends_at || '-'}
                                        </td>
                                        <td>
                                            <span className={`badge badge-sm ${discount.is_active ? 'badge-success' : 'badge-ghost'}`}>
                                                {discount.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button type="button" className="btn btn-ghost btn-xs" onClick={() => onEdit(discount)}>
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button type="button" className="btn btn-ghost btn-xs text-error" onClick={() => onDelete(discount)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
