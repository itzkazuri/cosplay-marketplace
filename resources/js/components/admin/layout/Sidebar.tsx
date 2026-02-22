import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { adminNavigation, AdminNavItem } from '@/configs/admin-navigation';

export default function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) {
    const { url } = usePage();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const toggleExpand = (title: string) => {
        setExpandedItems(prev => 
            prev.includes(title) 
                ? prev.filter(t => t !== title) 
                : [...prev, title]
        );
    };

    // Auto-expand based on active URL
    useEffect(() => {
        adminNavigation.forEach(item => {
            if (item.items && item.items.some(sub => url.startsWith(sub.href))) {
                setExpandedItems(prev => Array.from(new Set([...prev, item.title])));
            }
        });
    }, [url]);

    return (
        <aside 
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-base-100 border-r border-base-300 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="flex flex-col h-full">
                {/* ── Logo ── */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-base-300">
                    <Link href="/admin" className="flex items-center gap-2 group">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                            <span className="text-primary-content text-sm font-black leading-none">C</span>
                        </span>
                        <div className="flex flex-col">
                            <span className="font-black text-base-content text-sm leading-none tracking-tight uppercase">Admin</span>
                            <span className="font-bold text-primary text-[10px] leading-none tracking-wider uppercase">Cosplay Shop</span>
                        </div>
                    </Link>
                    <button onClick={toggleSidebar} className="btn btn-ghost btn-sm btn-square lg:hidden">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ── Navigation ── */}
                <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
                    <div className="space-y-1">
                        {adminNavigation.map((item, idx) => (
                            <SidebarItem 
                                key={idx} 
                                item={item} 
                                url={url}
                                isExpanded={expandedItems.includes(item.title)}
                                onToggle={() => toggleExpand(item.title)}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="p-4 border-t border-base-300 bg-base-200/50">
                    <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-content">
                                <span className="text-xs font-bold font-mono">AD</span>
                            </div>
                        </div>
                        <div className="flex-1 truncate">
                            <p className="text-xs font-bold truncate">Admin Central</p>
                            <p className="text-[10px] text-base-content/50 truncate">admin@cosplay.id</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

function SidebarItem({ 
    item, 
    url, 
    isExpanded, 
    onToggle 
}: { 
    item: AdminNavItem, 
    url: string, 
    isExpanded: boolean, 
    onToggle: () => void 
}) {
    const Icon = item.icon;
    const isActive = item.href === url || (item.items && item.items.some(sub => url.startsWith(sub.href)));
    const hasItems = item.items && item.items.length > 0;

    return (
        <div>
            {item.href ? (
                <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary text-primary-content shadow-md' : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'}`}
                >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.title}</span>
                </Link>
            ) : (
                <button
                    onClick={onToggle}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary' : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'}`}
                >
                    <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.title}</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
            )}

            {hasItems && isExpanded && (
                <div className="mt-1 ml-4 pl-4 border-l border-base-300 space-y-1">
                    {item.items?.map((sub, sIdx) => {
                        const isSubActive = url === sub.href;
                        return (
                            <Link
                                key={sIdx}
                                href={sub.href}
                                className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${isSubActive ? 'text-primary' : 'text-base-content/50 hover:text-base-content'}`}
                            >
                                {sub.title}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
