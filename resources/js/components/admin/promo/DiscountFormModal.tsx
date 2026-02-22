import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import type { ProductDiscount, PromoProduct } from '@/components/admin/promo/DiscountTable';

interface DiscountFormModalProps {
    isOpen: boolean;
    products: PromoProduct[];
    initialData: ProductDiscount | null;
    onClose: () => void;
}

interface DiscountPayload {
    product_id: number | '';
    name: string;
    type: 'percentage' | 'fixed';
    value: string;
    starts_at: string;
    ends_at: string;
    is_active: boolean;
}

export default function DiscountFormModal({ isOpen, products, initialData, onClose }: DiscountFormModalProps): JSX.Element | null {
    const isEditing = initialData !== null;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<DiscountPayload>({
        product_id: '',
        name: '',
        type: 'percentage',
        value: '',
        starts_at: '',
        ends_at: '',
        is_active: true,
    });

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (initialData) {
            setData('product_id', initialData.product_id);
            setData('name', initialData.name);
            setData('type', initialData.type);
            setData('value', `${initialData.value}`);
            setData('starts_at', initialData.starts_at ?? '');
            setData('ends_at', initialData.ends_at ?? '');
            setData('is_active', initialData.is_active);
        } else {
            reset();
        }

        clearErrors();
    }, [isOpen, initialData]);

    if (!isOpen) {
        return null;
    }

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
            put(route('admin.discounts.update', initialData.id), options);
            return;
        }

        post(route('admin.discounts.store'), options);
    };

    return (
        <dialog className="modal modal-open">
            <div className="modal-box max-w-2xl rounded-3xl border border-base-300 p-0">
                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-wide">{isEditing ? 'Edit Diskon' : 'Tambah Diskon'}</h3>
                        <p className="mt-1 text-xs font-medium text-base-content/60">Setiap produk hanya bisa punya satu diskon.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label className="form-control">
                            <span className="label-text mb-1 text-xs font-bold uppercase">Produk</span>
                            <select
                                className={`select select-bordered rounded-xl ${errors.product_id ? 'select-error' : ''}`}
                                value={data.product_id}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setData('product_id', value === '' ? '' : Number(value));
                                }}
                                disabled={isEditing}
                            >
                                <option value="">Pilih Produk</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                            </select>
                            {errors.product_id && <span className="label-text-alt text-error">{errors.product_id}</span>}
                        </label>

                        <label className="form-control">
                            <span className="label-text mb-1 text-xs font-bold uppercase">Nama Diskon</span>
                            <input
                                type="text"
                                className={`input input-bordered rounded-xl ${errors.name ? 'input-error' : ''}`}
                                value={data.name}
                                onChange={(event) => setData('name', event.target.value)}
                            />
                            {errors.name && <span className="label-text-alt text-error">{errors.name}</span>}
                        </label>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label className="form-control">
                            <span className="label-text mb-1 text-xs font-bold uppercase">Tipe</span>
                            <select className="select select-bordered rounded-xl" value={data.type} onChange={(event) => setData('type', event.target.value as 'percentage' | 'fixed')}>
                                <option value="percentage">Persentase (%)</option>
                                <option value="fixed">Nominal (Rp)</option>
                            </select>
                        </label>

                        <label className="form-control">
                            <span className="label-text mb-1 text-xs font-bold uppercase">Nilai</span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className={`input input-bordered rounded-xl ${errors.value ? 'input-error' : ''}`}
                                value={data.value}
                                onChange={(event) => setData('value', event.target.value)}
                            />
                            {errors.value && <span className="label-text-alt text-error">{errors.value}</span>}
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

                    <label className="label cursor-pointer justify-start gap-3 rounded-xl border border-base-300 bg-base-200 px-4 py-3">
                        <input type="checkbox" className="toggle toggle-primary" checked={data.is_active} onChange={(event) => setData('is_active', event.target.checked)} />
                        <span className="label-text text-sm font-semibold">Aktifkan diskon sekarang</span>
                    </label>

                    <div className="modal-action mt-0">
                        <button type="button" className="btn btn-ghost rounded-xl" onClick={onClose}>
                            Batal
                        </button>
                        <button type="submit" className="btn btn-primary rounded-xl font-black" disabled={processing}>
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
