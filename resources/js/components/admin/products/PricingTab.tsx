import { Weight } from 'lucide-react';

interface PricingTabProps {
    formData: {
        weight: string | number;
    };
    errors: {
        weight?: string;
    };
    onDataChange: (field: string, value: string | number) => void;
}

export default function PricingTab({
    formData,
    errors,
    onDataChange,
}: PricingTabProps) {
    return (
        <div className="space-y-6">
            {/* Weight */}
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text font-bold text-base-content/70 flex items-center gap-2">
                        <Weight className="w-4 h-4 text-primary" />
                        Berat Produk (gram) <span className="text-error">*</span>
                    </span>
                </label>
                <div className="relative">
                    <input
                        type="number"
                        placeholder="0"
                        value={formData.weight}
                        onChange={(e) => onDataChange('weight', e.target.value)}
                        className={`input input-bordered w-full pr-16 rounded-xl font-medium focus:input-primary ${
                            errors.weight ? 'input-error' : ''
                        }`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 font-bold">
                        gram
                    </span>
                </div>
                {errors.weight && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.weight}</span>
                    </label>
                )}
                <label className="label">
                    <span className="label-text-alt text-base-content/40">
                        Isi berat dalam gram untuk kalkulasi ongkos kirim.
                    </span>
                </label>
            </div>

            {/* Info Card */}
            <div className="card bg-primary/5 border border-primary/20 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                    <Weight className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                        <h4 className="font-bold text-sm text-primary mb-1">Tips Berat</h4>
                        <p className="text-xs text-base-content/60">
                            Pastikan berat sudah termasuk kemasan utama agar perhitungan ongkir lebih akurat.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
