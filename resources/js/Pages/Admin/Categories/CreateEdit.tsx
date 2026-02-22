import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Save, X, Sparkles, ChevronLeft } from 'lucide-react';
import CategoryForm from '@/components/admin/categories/CategoryForm';

interface CategoryData {
    id?: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    type: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

interface CreateEditProps {
    category: CategoryData | null;
}

interface CategoryFormData {
    name: string;
    description: string;
    image: File | null;
    type: string;
    is_active: boolean;
}

export default function CreateEdit({ category }: CreateEditProps): JSX.Element {
    const isEditing = !!category;
    const [imagePreview, setImagePreview] = useState<string | null>(category?.image || null);

    const { data, setData, post, processing, errors, transform } = useForm<CategoryFormData>({
        name: category?.name || '',
        description: category?.description || '',
        image: null,
        type: category?.type || 'ready_stock',
        is_active: category?.is_active ?? true,
    });

    const handleDataChange = (field: string, value: string | boolean | null): void => {
        setData(field as keyof CategoryFormData, value as never);
    };

    const handleImageChange = (file: File | null): void => {
        setData('image', file);

        if (file === null) {
            setImagePreview(category?.image ?? null);
            return;
        }

        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault();

        transform((formData) => {
            const payload: Record<string, unknown> = {
                name: formData.name,
                description: formData.description,
                type: formData.type,
                is_active: formData.is_active,
            };

            if (formData.image instanceof File) {
                payload.image = formData.image;
            }

            if (isEditing) {
                payload._method = 'put';
            }

            return payload;
        });

        const endpoint = isEditing && category?.id
            ? route('admin.categories.update', category.id)
            : route('admin.categories.store');

        post(endpoint, {
            forceFormData: true,
            onFinish: () => transform((formData) => formData),
        });
    };

    const handleCancel = (): void => {
        router.visit(route('admin.categories.index'));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card rounded-2xl border border-base-300 bg-base-100 p-5">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="flex items-center gap-2 text-2xl font-black text-base-content">
                            <Sparkles className="h-6 w-6 text-primary" />
                            {isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                        </h2>
                        <p className="mt-1 text-sm text-base-content/50">
                            {isEditing
                                ? `Mengedit: ${category?.name}`
                                : 'Lengkapi informasi kategori di bawah ini'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn btn-ghost gap-2 rounded-xl font-bold"
                        >
                            <X className="h-4 w-4" />
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn btn-primary gap-2 rounded-xl font-black shadow-lg shadow-primary/20"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Simpan Kategori'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="card rounded-2xl border border-base-300 bg-base-100 p-5">
                <CategoryForm
                    formData={{
                        name: data.name,
                        slug: category?.slug || '',
                        description: data.description,
                        imagePreview,
                        type: data.type,
                        is_active: data.is_active,
                    }}
                    errors={errors as Record<string, string>}
                    onDataChange={handleDataChange}
                    onImageChange={handleImageChange}
                />
            </div>

            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-ghost gap-2 rounded-xl font-bold"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Kembali
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="btn btn-primary gap-2 rounded-xl font-black shadow-lg shadow-primary/20"
                >
                    <Save className="h-4 w-4" />
                    {processing ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Simpan Kategori'}
                </button>
            </div>
        </form>
    );
}
