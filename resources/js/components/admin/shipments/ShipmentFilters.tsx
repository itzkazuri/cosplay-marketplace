import { Search, X, Filter } from 'lucide-react';

interface ShipmentFiltersProps {
    searchQuery: string;
    selectedStatus: string;
    selectedCourier: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onCourierChange: (value: string) => void;
    onSearch: () => void;
    onClear: () => void;
}

const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'packed', label: 'Dikemas' },
    { value: 'shipped', label: 'Dikirim' },
    { value: 'in_transit', label: 'Dalam Perjalanan' },
    { value: 'delivered', label: 'Terkirim' },
    { value: 'returned', label: 'Dikembalikan' },
    { value: 'failed', label: 'Gagal' },
];

const courierOptions = [
    { value: '', label: 'Semua Kurir' },
    { value: 'jne', label: 'JNE' },
    { value: 'jnt', label: 'J&T' },
    { value: 'sicepat', label: 'SiCepat' },
    { value: 'pos_indonesia', label: 'Pos Indonesia' },
    { value: 'anteraja', label: 'AnterAja' },
    { value: 'wahana', label: 'Wahana' },
    { value: 'tiki', label: 'TIKI' },
    { value: 'ninja_express', label: 'Ninja Express' },
    { value: 'gosend', label: 'GoSend' },
    { value: 'grab_express', label: 'GrabExpress' },
    { value: 'other', label: 'Lainnya' },
];

export default function ShipmentFilters({
    searchQuery,
    selectedStatus,
    selectedCourier,
    onSearchChange,
    onStatusChange,
    onCourierChange,
    onSearch,
    onClear,
}: ShipmentFiltersProps) {
    return (
        <div className="card bg-base-100 border border-base-300 rounded-2xl p-4 mb-6">
            <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari nomor resi atau nama penerima..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                        className="input input-bordered w-full pl-12 rounded-xl focus:input-primary border-base-300 font-medium"
                    />
                </div>
                <select
                    value={selectedStatus}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="select select-bordered rounded-xl focus:select-primary border-base-300 font-bold text-sm flex-1 lg:flex-none min-w-[150px]"
                >
                    {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedCourier}
                    onChange={(e) => onCourierChange(e.target.value)}
                    className="select select-bordered rounded-xl focus:select-primary border-base-300 font-bold text-sm flex-1 lg:flex-none min-w-[150px]"
                >
                    {courierOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onSearch}
                        className="btn btn-primary btn-sm gap-2 rounded-xl font-bold shadow-lg shadow-primary/20"
                    >
                        <Filter className="w-4 h-4" /> Filter
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
