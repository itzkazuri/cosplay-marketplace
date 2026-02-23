import { ChevronDown, ArrowUpDown, TrendingUp, Star, Tag, Clock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';

interface SortOptionDef {
    value: SortOption;
    label: string;
    icon: React.ReactNode;
}

const SORT_OPTIONS: SortOptionDef[] = [
    { value: 'latest', label: 'Terbaru', icon: <Clock className="w-4 h-4" /> },
    { value: 'price_asc', label: 'Harga Terendah', icon: <ArrowUpDown className="w-4 h-4" /> },
    { value: 'price_desc', label: 'Harga Tertinggi', icon: <ArrowUpDown className="w-4 h-4" /> },
    { value: 'rating', label: 'Rating Tertinggi', icon: <Star className="w-4 h-4" /> },
    { value: 'popular', label: 'Paling Populer', icon: <TrendingUp className="w-4 h-4" /> },
];

interface SortDropdownProps {
    currentSort: SortOption;
    onSortChange: (sort: SortOption) => void;
}

export default function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentOption = SORT_OPTIONS.find((opt) => opt.value === currentSort) || SORT_OPTIONS[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (value: SortOption) => {
        onSortChange(value);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-sm btn-ghost gap-2"
            >
                <Tag className="w-4 h-4" />
                <span className="hidden sm:inline">Urutkan:</span>
                <span className="font-semibold">{currentOption.label}</span>
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-base-100 border border-base-300 rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="p-1">
                        {SORT_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                    currentSort === option.value
                                        ? 'bg-primary/10 text-primary font-semibold'
                                        : 'text-base-content/80 hover:bg-base-200'
                                }`}
                            >
                                <span className={currentSort === option.value ? 'text-primary' : ''}>
                                    {option.icon}
                                </span>
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
