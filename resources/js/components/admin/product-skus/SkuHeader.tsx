import { Plus, Layers } from 'lucide-react';

interface SkuHeaderProps {
    onAdd: () => void;
}

export default function SkuHeader({ onAdd }: SkuHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tight text-base-content uppercase flex items-center gap-3">
                    <Layers className="w-8 h-8 text-primary shrink-0" />
                    SKU & Stok
                </h1>
                <p className="text-sm text-base-content/50 font-medium">Kelola variant dan stok produk Anda di sini.</p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onAdd}
                    className="btn btn-primary btn-sm font-black gap-2 rounded-xl shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" /> Tambah SKU
                </button>
            </div>
        </div>
    );
}
