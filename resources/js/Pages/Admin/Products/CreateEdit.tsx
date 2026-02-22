import AdminLayout from '@/components/layout/AdminLayout';
import { Head } from '@inertiajs/react';
import CreateEditForm from '@/components/admin/products/CreateEditForm';
import { Category } from '@/types';

interface ProductData {
    id?: number;
    name: string;
    slug?: string;
    category_id: string | number;
    description: string;
    base_price: string | number;
    weight: string | number;
    main_image: string | null;
    is_custom: boolean;
    is_active: boolean;
    skus: Array<{
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
    }>;
    images: Array<{
        id?: number;
        url: string;
        sort_order?: number;
    }>;
}

interface Props {
    product: ProductData | null;
    categories: Category[];
}

export default function CreateEdit({ product, categories }: Props) {
    const isEditing = !!product;

    return (
        <AdminLayout title={isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}>
            <Head title={isEditing ? `Edit: ${product?.name}` : 'Tambah Produk Baru'} />

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black tracking-tight text-base-content uppercase flex items-center gap-3">
                        {isEditing ? (
                            <>
                                <span className="text-primary">Edit</span> Produk
                            </>
                        ) : (
                            <>
                                <span className="text-primary">Tambah</span> Produk Baru
                            </>
                        )}
                    </h1>
                    <p className="text-sm text-base-content/50 font-medium">
                        {isEditing
                            ? 'Perbarui informasi produk di bawah ini'
                            : 'Lengkapi semua informasi produk untuk dijual'}
                    </p>
                </div>
            </div>

            {/* Form */}
            <CreateEditForm product={product} categories={categories} />
        </AdminLayout>
    );
}
