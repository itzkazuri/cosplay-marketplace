import { Search, X } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    slug: string;
}

interface SkuFiltersProps {
    searchQuery: string;
    selectedProduct: string;
    products: Product[];
    onSearchChange: (value: string) => void;
    onProductChange: (value: string) => void;
    onSearch: () => void;
    onClear: () => void;
}

export default function SkuFilters({
    searchQuery,
    selectedProduct,
    products,
    onSearchChange,
    onProductChange,
    onSearch,
    onClear,
}: SkuFiltersProps) {
    return (
        <div className="card bg-base-100 border border-base-300 rounded-2xl p-4 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari SKU atau nama produk..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                        className="input input-bordered w-full pl-12 rounded-xl focus:input-primary border-base-300 font-medium"
                    />
                </div>
                <select
                    value={selectedProduct}
                    onChange={(e) => onProductChange(e.target.value)}
                    className="select select-bordered rounded-xl focus:select-primary border-base-300 font-bold text-sm flex-1 md:flex-none min-w-[200px]"
                >
                    <option value="">Semua Produk</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onSearch}
                        className="btn btn-primary btn-sm gap-2 rounded-xl font-bold shadow-lg shadow-primary/20"
                    >
                        <Search className="w-4 h-4" /> Cari
                    </button>
                    <button
                        onClick={onClear}
                        className="btn btn-ghost btn-sm gap-2 rounded-xl font-bold"
                    >
                        <X className="w-4 h-4" /> Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
