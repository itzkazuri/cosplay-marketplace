import { Category } from '@/types';
import { Package, Tag, AlignLeft } from 'lucide-react';

interface BasicInfoTabProps {
    categories: Category[];
    formData: {
        name: string;
        category_id: string | number;
        description: string;
    };
    errors: {
        name?: string;
        category_id?: string;
        description?: string;
    };
    onDataChange: (field: string, value: string | number) => void;
}

export default function BasicInfoTab({
    categories,
    formData,
    errors,
    onDataChange,
}: BasicInfoTabProps) {
    return (
        <div className="space-y-6">
            {/* Product Name */}
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text font-bold text-base-content/70 flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary" />
                        Nama Produk <span className="text-error">*</span>
                    </span>
                </label>
                <input
                    type="text"
                    placeholder="Contoh: Kostum Naruto Uzumaki Sage Mode"
                    value={formData.name}
                    onChange={(e) => onDataChange('name', e.target.value)}
                    className={`input input-bordered w-full rounded-xl font-medium focus:input-primary ${
                        errors.name ? 'input-error' : ''
                    }`}
                />
                {errors.name && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.name}</span>
                    </label>
                )}
            </div>

            {/* Category */}
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text font-bold text-base-content/70 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        Kategori <span className="text-error">*</span>
                    </span>
                </label>
                <select
                    value={formData.category_id}
                    onChange={(e) => onDataChange('category_id', e.target.value)}
                    className={`select select-bordered w-full rounded-xl font-medium focus:select-primary ${
                        errors.category_id ? 'select-error' : ''
                    }`}
                >
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                {errors.category_id && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.category_id}</span>
                    </label>
                )}
            </div>

            {/* Description */}
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text font-bold text-base-content/70 flex items-center gap-2">
                        <AlignLeft className="w-4 h-4 text-primary" />
                        Deskripsi Produk
                    </span>
                </label>
                <textarea
                    placeholder="Deskripsikan detail produk, bahan, ukuran, dan informasi penting lainnya..."
                    value={formData.description}
                    onChange={(e) => onDataChange('description', e.target.value)}
                    className={`textarea textarea-bordered w-full rounded-xl font-medium min-h-[150px] focus:textarea-primary ${
                        errors.description ? 'textarea-error' : ''
                    }`}
                />
                {errors.description && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.description}</span>
                    </label>
                )}
                <label className="label">
                    <span className="label-text-alt text-base-content/40">
                        {formData.description.length} karakter
                    </span>
                </label>
            </div>
        </div>
    );
}
