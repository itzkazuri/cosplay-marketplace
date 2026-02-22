import { Settings, Eye, EyeOff, Truck } from 'lucide-react';

interface SettingsTabProps {
    isEditing: boolean;
    formData: {
        is_active: boolean;
        is_custom: boolean;
    };
    onDataChange: (field: string, value: boolean) => void;
}

export default function SettingsTab({
    isEditing,
    formData,
    onDataChange,
}: SettingsTabProps) {
    return (
        <div className="space-y-6">
            {/* Status Settings */}
            <div className="card bg-base-100 border border-base-300 rounded-2xl p-5">
                <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" />
                    Status & Visibilitas
                </h3>
                
                <div className="space-y-4">
                    {/* Is Active */}
                    <div className="flex items-center justify-between p-3 bg-base-200/50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                formData.is_active ? 'bg-success/20' : 'bg-base-content/10'
                            }`}>
                                {formData.is_active ? (
                                    <Eye className="w-5 h-5 text-success" />
                                ) : (
                                    <EyeOff className="w-5 h-5 text-base-content/40" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Produk Aktif</h4>
                                <p className="text-[10px] text-base-content/50">
                                    Tampilkan di katalog dan pencarian
                                </p>
                            </div>
                        </div>
                        <label className="swap swap-checkbox">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => onDataChange('is_active', e.target.checked)}
                                className="checkbox checkbox-primary rounded-xl"
                            />
                        </label>
                    </div>

                    {/* Is Custom */}
                    <div className="flex items-center justify-between p-3 bg-base-200/50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                formData.is_custom ? 'bg-warning/20' : 'bg-base-content/10'
                            }`}>
                                <Truck className="w-5 h-5 text-warning" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Custom Order (Pre-Order)</h4>
                                <p className="text-[10px] text-base-content/50">
                                    Produk dibuat sesuai pesanan khusus
                                </p>
                            </div>
                        </div>
                        <label className="swap swap-checkbox">
                            <input
                                type="checkbox"
                                checked={formData.is_custom}
                                onChange={(e) => onDataChange('is_custom', e.target.checked)}
                                className="checkbox checkbox-warning rounded-xl"
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <div className="card bg-primary/5 border border-primary/20 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                    <Settings className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                        <h4 className="font-bold text-sm text-primary mb-1">Pengaturan Produk</h4>
                        <ul className="text-xs text-base-content/60 space-y-1">
                            <li>• <strong>Produk Aktif:</strong> Produk akan muncul di katalog dan dapat dicari oleh pelanggan</li>
                            <li>• <strong>Custom Order:</strong> Tandai jika produk memerlukan waktu produksi khusus (pre-order)</li>
                        </ul>
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="card bg-error/5 border border-error/20 rounded-2xl p-5">
                    <h3 className="font-bold text-error mb-2">Zona Bahaya</h3>
                    <p className="text-xs text-base-content/60 mb-4">
                        Setelah menghapus produk, data tidak dapat dikembalikan. Pastikan Anda sudah backup data jika diperlukan.
                    </p>
                    <div className="alert alert-warning rounded-xl">
                        <Settings className="w-5 h-5 shrink-0" />
                        <div>
                            <h4 className="font-bold text-xs mb-1">Hapus Produk</h4>
                            <p className="text-[10px]">
                                Aksi ini akan menghapus produk beserta semua variant SKU dan gambar yang terkait.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
