import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import type { PromoProduct } from '@/components/admin/promo/DiscountTable';
import type { Voucher } from '@/components/admin/promo/VoucherTable';

interface VoucherFormModalProps {
    isOpen: boolean;
    products: PromoProduct[];
    initialData: Voucher | null;
    onClose: () => void;
}

interface VoucherPayload {
    name: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: string;
    min_purchase: string;
    max_discount: string;
    usage_limit: string;
    starts_at: string;
    ends_at: string;
    applies_to_all_products: boolean;
    is_active: boolean;
    product_ids: number[];
}

export default function VoucherFormModal({ isOpen, products, initialData, onClose }: VoucherFormModalProps): JSX.Element | null {
    const isEditing = initialData !== null;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<VoucherPayload>({
        name: '',
        code: '',
        type: 'percentage',
        value: '',
        min_purchase: '',
        max_discount: '',
        usage_limit: '',
        starts_at: '',
        ends_at: '',
        applies_to_all_products: false,
        is_active: true,
        product_ids: [],
    });

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (initialData) {
            setData('name', initialData.name);
            setData('code', initialData.code);
            setData('type', initialData.type);
            setData('value', `${initialData.value}`);
            setData('min_purchase', initialData.min_purchase === null ? '' : `${initialData.min_purchase}`);
            setData('max_discount', initialData.max_discount === null ? '' : `${initialData.max_discount}`);
            setData('usage_limit', initialData.usage_limit === null ? '' : `${initialData.usage_limit}`);
            setData('starts_at', initialData.starts_at ?? '');
            setData('ends_at', initialData.ends_at ?? '');
            setData('applies_to_all_products', initialData.applies_to_all_products);
            setData('is_active', initialData.is_active);
            setData('product_ids', initialData.products.map((product) => product.id));
        } else {
            reset();
        }

        clearErrors();
    }, [isOpen, initialData]);

    if (!isOpen) {
        return null;
    }

    const toggleProduct = (productId: number): void => {
        if (data.product_ids.includes(productId)) {
            setData('product_ids', data.product_ids.filter((id) => id !== productId));
            return;
        }

        setData('product_ids', [...data.product_ids, productId]);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                reset();
            },
        };

        if (isEditing && initialData) {
            put(route('admin.vouchers.update', initialData.id), options);
            return;
        }

        post(route('admin.vouchers.store'), options);
    };

    return (
        <dialog className="modal modal-open">
            <div className="modal-box max-w-3xl rounded-3xl border border-base-300 p-0">
                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-wide">{isEditing ? 'Edit Voucher' : 'Tambah Voucher'}</h3>
                        <p className="mt-1 text-xs font-medium text-base-content/60">Voucher aktif tidak dapat dipakai pada produk dengan diskon aktif.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label className="form-control">
                            <span className="label-text mb-1 text-xs font-bold uppercase">Nama Voucher</span>
                            <input type="text" className={`input input-bordered rounded-xl ${errors.name ? 'input-error' : ''}`} value={data.name} onChange={(event) => setData('name', event.target.value)} />
                            {errors.name && <span className="label-text-alt text-error">{errors.name}</span>}
                        </label>

                        <label className="form-control">
                            <span className="label-text mb-1 text-xs font-bold uppercase">Kode Voucher</span>
                            <input type="text" className={`input input-bordered rounded-xl ${errors.code ? 'input-error' : ''}`} value={data.code} onChange={(event) => setData('code', event.target.value.toUpperCase())} />
                            {errors.code && <span className="label-text-alt text-error">{errors.code}</span>}
                        </label>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <label className="form-control">
                            <span className="label-text mb-1 text-xs font-bold uppercase">Tipe</span>
                            <select className="select select-bordered rounded-xl" value={data.type} onChange={(event) => setData('type', event.target.value as 'percentage' | 'fixed')}>
                                <option value="percentage">Persentase (%)</option>
                                <option value="fixed">Nominal (Rp)</option>
                            </select>
                        </label>

                        <label className="form-control">
                            <span className="label-text mb-1 text-xs font-bold uppercase">Nilai</span>
                            <input type="number" min="0" step="0.01" className={`input input-bordered rounded-xl ${errors.value ? 'input-error' : ''}`} value={data.value} onChange={(event) => setData('value', event.target.value)} />
                            {errors.value && <span className="label-text-alt text-error">{errors.value}</span>}
                        </label>

                        <label className="form-control">
                            <span className="label-text mb-1 text-xs font-bold uppercase">Batas Pakai</span>
                            <input type="number" min="1" className={`input input-bordered rounded-xl ${errors.usage_limit ? 'input-error' : ''}`} value={data.usage_limit} onChange={(event) => setData('usage_limit', event.target.value)} />
                            {errors.usage_limit && <span className="label-text-alt text-error">{errors.usage_limit}</span>}
                        </label>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label className="form-control">
                            <span className="label-text mb-1 text-xs font-bold uppercase">Minimum Belanja</span>
                            <input type="number" min="0" step="0.01" className="input input-bordered rounded-xl" value={data.min_purchase} onChange={(event) => setData('min_purchase', event.target.value)} />
                        </label>

                        <label className="form-control">
                            <span className="label-text mb-1 text-xs font-bold uppercase">Maksimum Potongan</span>
                            <input type="number" min="0" step="0.01" className="input input-bordered rounded-xl" value={data.max_discount} onChange={(event) => setData('max_discount', event.target.value)} />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label className="form-control">
                            <span className="label-text mb-1 text-xs font-bold uppercase">Tanggal Mulai</span>
                            <input type="date" className="input input-bordered rounded-xl" value={data.starts_at} onChange={(event) => setData('starts_at', event.target.value)} />
                        </label>

                        <label className="form-control">
                            <span className="label-text mb-1 text-xs font-bold uppercase">Tanggal Akhir</span>
                            <input type="date" className={`input input-bordered rounded-xl ${errors.ends_at ? 'input-error' : ''}`} value={data.ends_at} onChange={(event) => setData('ends_at', event.target.value)} />
                            {errors.ends_at && <span className="label-text-alt text-error">{errors.ends_at}</span>}
                        </label>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-base-300 bg-base-200 p-4">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input type="checkbox" className="checkbox checkbox-primary" checked={data.applies_to_all_products} onChange={(event) => setData('applies_to_all_products', event.target.checked)} />
                            <span className="label-text font-semibold">Terapkan ke semua produk</span>
                        </label>

                        {!data.applies_to_all_products && (
                            <div className="grid max-h-48 grid-cols-1 gap-2 overflow-y-auto pr-2 md:grid-cols-2">
                                {products.map((product) => (
                                    <label key={product.id} className="label cursor-pointer justify-start gap-3 rounded-xl border border-base-300 bg-base-100 px-3 py-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm checkbox-secondary"
                                            checked={data.product_ids.includes(product.id)}
                                            onChange={() => toggleProduct(product.id)}
                                        />
                                        <span className="label-text text-sm font-semibold">{product.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {errors.product_ids && <p className="text-xs font-semibold text-error">{errors.product_ids}</p>}
                        {errors.applies_to_all_products && <p className="text-xs font-semibold text-error">{errors.applies_to_all_products}</p>}
                    </div>

                    <label className="label cursor-pointer justify-start gap-3 rounded-xl border border-base-300 bg-base-200 px-4 py-3">
                        <input type="checkbox" className="toggle toggle-secondary" checked={data.is_active} onChange={(event) => setData('is_active', event.target.checked)} />
                        <span className="label-text text-sm font-semibold">Aktifkan voucher sekarang</span>
                    </label>

                    <div className="modal-action mt-0">
                        <button type="button" className="btn btn-ghost rounded-xl" onClick={onClose}>Batal</button>
                        <button type="submit" className="btn btn-secondary rounded-xl font-black" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button type="button" onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}
