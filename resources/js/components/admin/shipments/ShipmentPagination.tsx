import { ChevronRight } from 'lucide-react';
import { router } from '@inertiajs/react';

interface Link {
    url: string | null;
    label: string;
    active: boolean;
}

interface ShipmentPaginationProps {
    from: number;
    to: number;
    total: number;
    links: Link[];
}

export default function ShipmentPagination({ from, to, total, links }: ShipmentPaginationProps) {
    if (total === 0) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-2">
            <p className="text-xs font-bold text-base-content/40 tracking-widest uppercase">
                Menampilkan {from} - {to} dari {total} Pengiriman
            </p>
            <div className="join shadow-xl shadow-base-content/5 rounded-2xl overflow-hidden">
                {links.map((link, index) => {
                    if (index === 0 && link.label === '&laquo; Previous') {
                        return (
                            <button
                                key={index}
                                onClick={() => link.url && router.visit(link.url)}
                                className="join-item btn btn-sm bg-base-100 border-base-300 hover:bg-primary hover:text-primary-content transition-all duration-300 disabled:opacity-50"
                                disabled={!link.url}
                            >
                                Sebelumnya
                            </button>
                        );
                    }
                    if (index === links.length - 1 && link.label === 'Next &raquo;') {
                        return (
                            <button
                                key={index}
                                onClick={() => link.url && router.visit(link.url)}
                                className="join-item btn btn-sm bg-base-100 border-base-300 hover:bg-primary hover:text-primary-content transition-all duration-300 disabled:opacity-50"
                                disabled={!link.url}
                            >
                                Berikutnya
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        );
                    }
                    return (
                        <button
                            key={index}
                            onClick={() => link.url && router.visit(link.url)}
                            className={`join-item btn btn-sm transition-all duration-300 ${
                                link.active
                                    ? 'bg-primary text-primary-content'
                                    : 'bg-base-100 border-base-300 hover:bg-primary hover:text-primary-content'
                            }`}
                        >
                            {link.label.replace('&laquo;', '').replace('&raquo;', '').trim()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
