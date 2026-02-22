import { Tag, AlignLeft, Image as ImageIcon, Settings, Link as LinkIcon } from 'lucide-react';

interface CategoryFormData {
    name: string;
    slug: string;
    description: string;
    imagePreview: string | null;
    type: string;
    is_active: boolean;
}

interface CategoryFormProps {
    formData: CategoryFormData;
    errors: Record<string, string>;
    onDataChange: (field: string, value: string | boolean | null) => void;
    onImageChange: (file: File | null) => void;
}

const typeOptions = [
    { value: 'ready_stock', label: 'Ready Stock', description: 'Produk tersedia dan siap kirim' },
    { value: 'custom', label: 'Custom Order', description: 'Produk dibuat sesuai pesanan' },
    { value: 'aksesori', label: 'Aksesoris', description: 'Aksesoris dan properti kecil' },
    { value: 'wig', label: 'Wig', description: 'Wig dan rambut palsu' },
    { value: 'props', label: 'Props', description: 'Props dan alat peraga' },
];

export default function CategoryForm({
    formData,
    errors,
    onDataChange,
    onImageChange,
}: CategoryFormProps): JSX.Element {
    return (
        <div className="space-y-6">
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text flex items-center gap-2 font-bold text-base-content/70">
                        <Tag className="h-4 w-4 text-primary" />
                        Nama Kategori <span className="text-error">*</span>
                    </span>
                </label>
                <input
                    type="text"
                    placeholder="Contoh: Kostum Naruto"
                    value={formData.name}
                    onChange={(event) => onDataChange('name', event.target.value)}
                    className={`input input-bordered w-full rounded-xl font-medium focus:input-primary ${
                        errors.name ? 'input-error' : ''
                    }`}
                />
                {errors.name && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.name}</span>
                    </label>
                )}
                {formData.name && (
                    <label className="label">
                        <span className="label-text-alt flex items-center gap-1 text-base-content/50">
                            <LinkIcon className="h-3 w-3" />
                            Slug akan otomatis: <span className="font-mono text-primary">/{formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}</span>
                        </span>
                    </label>
                )}
            </div>

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text flex items-center gap-2 font-bold text-base-content/70">
                        <Settings className="h-4 w-4 text-primary" />
                        Tipe Kategori <span className="text-error">*</span>
                    </span>
                </label>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {typeOptions.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => onDataChange('type', option.value)}
                            className={`card cursor-pointer border-2 transition-all ${
                                formData.type === option.value
                                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                                    : 'border-base-300 bg-base-100 hover:border-primary/50'
                            }`}
                        >
                            <div className="card-body p-4">
                                <h4 className="text-sm font-bold">{option.label}</h4>
                                <p className="text-[10px] text-base-content/50">{option.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {errors.type && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.type}</span>
                    </label>
                )}
            </div>

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text flex items-center gap-2 font-bold text-base-content/70">
                        <AlignLeft className="h-4 w-4 text-primary" />
                        Deskripsi
                    </span>
                </label>
                <textarea
                    placeholder="Deskripsikan kategori ini..."
                    value={formData.description}
                    onChange={(event) => onDataChange('description', event.target.value)}
                    className={`textarea textarea-bordered min-h-[100px] w-full rounded-xl font-medium focus:textarea-primary ${
                        errors.description ? 'textarea-error' : ''
                    }`}
                />
                {errors.description && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.description}</span>
                    </label>
                )}
            </div>

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text flex items-center gap-2 font-bold text-base-content/70">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        Upload Gambar
                    </span>
                </label>
                <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(event) => {
                        const file = event.target.files?.[0] ?? null;
                        onImageChange(file);
                    }}
                    className={`file-input file-input-bordered w-full rounded-xl ${
                        errors.image ? 'file-input-error' : ''
                    }`}
                />
                {errors.image && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.image}</span>
                    </label>
                )}
                {formData.imagePreview && (
                    <div className="mt-2">
                        <div className="relative h-32 w-full max-w-xs overflow-hidden rounded-xl bg-base-200">
                            <img
                                src={formData.imagePreview}
                                alt="Preview"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="form-control">
                <label className="label cursor-pointer gap-3">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            formData.is_active ? 'bg-success/20' : 'bg-base-content/10'
                        }`}>
                            <Settings className={`h-5 w-5 ${
                                formData.is_active ? 'text-success' : 'text-base-content/40'
                            }`} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold">Kategori Aktif</h4>
                            <p className="text-[10px] text-base-content/50">
                                Tampilkan di katalog dan form produk
                            </p>
                        </div>
                    </div>
                    <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(event) => onDataChange('is_active', event.target.checked)}
                        className="checkbox checkbox-primary rounded-xl"
                    />
                </label>
            </div>
        </div>
    );
}
