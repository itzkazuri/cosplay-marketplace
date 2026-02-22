import { Image, Upload, Trash2 } from 'lucide-react';

interface PreviewImageSlot {
    id?: number;
    preview: string | null;
    file: File | null;
}

interface ImageUploaderProps {
    mainImagePreview: string | null;
    previewImages: PreviewImageSlot[];
    hasAnyPreviewFile: boolean;
    errors: Record<string, string | undefined>;
    onMainImageChange: (file: File | null) => void;
    onPreviewImageChange: (index: number, file: File | null) => void;
}

export default function ImageUploader({
    mainImagePreview,
    previewImages,
    hasAnyPreviewFile,
    errors,
    onMainImageChange,
    onPreviewImageChange,
}: ImageUploaderProps): JSX.Element {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-bold text-base-content">Media Produk</h3>
                <p className="text-xs text-base-content/50">Wajib 1 thumbnail portrait dan 3 gambar preview produk.</p>
            </div>

            <div className="card border border-base-300 bg-base-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-black uppercase tracking-wide">Thumbnail Utama (Portrait)</h4>
                    <span className="badge badge-primary badge-sm">Wajib 1</span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-[180px_1fr]">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-base-300 bg-base-200">
                        {mainImagePreview ? (
                            <img src={mainImagePreview} alt="Thumbnail produk" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <Image className="h-10 w-10 text-base-content/20" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={(event) => {
                                const file = event.target.files?.[0] ?? null;
                                onMainImageChange(file);
                            }}
                            className={`file-input file-input-bordered w-full rounded-xl ${errors.main_image ? 'file-input-error' : ''}`}
                        />
                        {errors.main_image && <p className="text-xs font-semibold text-error">{errors.main_image}</p>}
                        <p className="text-xs text-base-content/60">Gunakan rasio portrait (contoh 3:4) agar kartu produk konsisten.</p>
                    </div>
                </div>
            </div>

            <div className="card border border-base-300 bg-base-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-black uppercase tracking-wide">Preview Produk</h4>
                    <span className="badge badge-secondary badge-sm">{hasAnyPreviewFile ? 'Set Baru Siap Upload' : 'Set Existing'}</span>
                </div>

                {errors.images && <p className="mb-3 text-xs font-semibold text-error">{errors.images}</p>}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {previewImages.map((previewImage, index) => (
                        <div key={previewImage.id ?? `preview-${index}`} className="rounded-xl border border-base-300 p-3">
                            <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-base-200">
                                {previewImage.preview ? (
                                    <img src={previewImage.preview} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <Image className="h-8 w-8 text-base-content/20" />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => onPreviewImageChange(index, null)}
                                    className="btn btn-circle btn-error btn-xs absolute right-2 top-2"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>

                            <label className="mb-1 block text-xs font-semibold text-base-content/70">Preview {index + 1}</label>
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                onChange={(event) => {
                                    const file = event.target.files?.[0] ?? null;
                                    onPreviewImageChange(index, file);
                                }}
                                className={`file-input file-input-bordered file-input-sm w-full rounded-lg ${errors[`images.${index}`] ? 'file-input-error' : ''}`}
                            />

                            {errors[`images.${index}`] && (
                                <p className="mt-1 text-xs font-semibold text-error">{errors[`images.${index}`]}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-xl border border-info/20 bg-info/5 p-4">
                <p className="text-xs font-medium text-base-content/70">
                    Format final: 1 thumbnail portrait + 3 gambar preview (total 4 gambar per produk).
                </p>
            </div>
        </div>
    );
}
