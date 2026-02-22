import { Pencil, Plus, Trash2 } from 'lucide-react';
import type { PromoProduct } from '@/components/admin/promo/DiscountTable';

export interface Voucher {
    id: number;
    name: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: string | number;
    min_purchase: string | number | null;
    max_discount: string | number | null;
    usage_limit: number | null;
    used_count: number;
    starts_at: string | null;
    ends_at: string | null;
    applies_to_all_products: boolean;
    is_active: boolean;
    products: PromoProduct[];
}

interface VoucherTableProps {
    vouchers: Voucher[];
    onCreate: () => void;
    onEdit: (voucher: Voucher) => void;
    onDelete: (voucher: Voucher) => void;
}

function formatCurrency(value: string | number | null): string {
    if (value === null) {
        return '-';
    }

    const amount = typeof value === 'string' ? Number.parseFloat(value) : value;

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function VoucherTable({ vouchers, onCreate, onEdit, onDelete }: VoucherTableProps): JSX.Element {
    return (
        <div className="card border border-base-300 bg-base-100 shadow-xl">
            <div className="card-body gap-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-black uppercase tracking-wide">Voucher Produk</h2>
                        <p className="text-xs font-medium text-base-content/60">Voucher tidak bisa dipakai untuk produk yang memiliki diskon aktif.</p>
                    </div>
                    <button type="button" className="btn btn-secondary btn-sm rounded-xl font-black" onClick={onCreate}>
                        <Plus className="h-4 w-4" />
                        Tambah Voucher
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Kode</th>
                                <th>Voucher</th>
                                <th>Nilai</th>
                                <th>Produk</th>
                                <th>Penggunaan</th>
                                <th>Status</th>
                                <th className="w-32">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-10 text-center text-sm font-semibold text-base-content/50">
                                        Belum ada voucher.
                                    </td>
                                </tr>
                            ) : (
                                vouchers.map((voucher) => (
                                    <tr key={voucher.id}>
                                        <td><span className="badge badge-outline font-black">{voucher.code}</span></td>
                                        <td>
                                            <div className="font-bold">{voucher.name}</div>
                                            <div className="text-xs text-base-content/60">{voucher.starts_at || '-'} s/d {voucher.ends_at || '-'}</div>
                                        </td>
                                        <td className="font-black">
                                            {voucher.type === 'percentage' ? `${voucher.value}%` : formatCurrency(voucher.value)}
                                            <div className="text-xs font-semibold text-base-content/60">
                                                Min: {formatCurrency(voucher.min_purchase)}
                                            </div>
                                        </td>
                                        <td>
                                            {voucher.applies_to_all_products ? (
                                                <span className="badge badge-info badge-sm">Semua Produk</span>
                                            ) : (
                                                <div className="text-xs font-semibold">
                                                    {voucher.products.length > 0 ? voucher.products.map((product) => product.name).join(', ') : '-'}
                                                </div>
                                            )}
                                        </td>
                                        <td className="text-sm font-semibold">
                                            {voucher.used_count} / {voucher.usage_limit ?? '∞'}
                                        </td>
                                        <td>
                                            <span className={`badge badge-sm ${voucher.is_active ? 'badge-success' : 'badge-ghost'}`}>
                                                {voucher.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button type="button" className="btn btn-ghost btn-xs" onClick={() => onEdit(voucher)}>
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button type="button" className="btn btn-ghost btn-xs text-error" onClick={() => onDelete(voucher)}>
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
