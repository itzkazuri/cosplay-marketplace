import { Link, usePage } from '@inertiajs/react';
import { Menu, Bell, Search, LogOut, Settings, UserCircle, Maximize2 } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import ThemeSwitcher from '@/components/layout/ThemeSwitcher';

export default function Topbar({ toggleSidebar }: { toggleSidebar: () => void }) {
    const { auth } = usePage().props as any;

    return (
        <header className="sticky top-0 z-40 h-16 bg-base-100/80 backdrop-blur-md border-b border-base-300 px-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 truncate">
                <button 
                    onClick={toggleSidebar} 
                    className="btn btn-ghost btn-sm btn-square lg:hidden"
                >
                    <Menu className="w-5 h-5" />
                </button>
                
                <div className="hidden sm:block truncate">
                    <Breadcrumb />
                </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
                {/* ── Search ── */}
                <button className="btn btn-ghost btn-sm btn-square hover:bg-primary/10 hover:text-primary transition-colors">
                    <Search className="w-4 h-4" />
                </button>

                {/* ── Theme ── */}
                <ThemeSwitcher />

                {/* ── Notifications ── */}
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-square relative">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-base-100 ring-offset-base-100"></span>
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-base-100 border border-base-300 rounded-2xl w-80 mt-2 z-50">
                        <li className="menu-title px-4 py-2 border-b border-base-200 font-bold uppercase tracking-widest text-[10px]">Pemberitahuan</li>
                        <li>
                            <div className="flex gap-3 py-3 px-4 rounded-xl hover:bg-base-200 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center shrink-0">
                                    <Bell className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold leading-none mb-1">Pesanan Baru #ORD-001</p>
                                    <p className="text-[10px] text-base-content/50 leading-tight">Pesanan baru dari Budi Santoso sedang menunggu konfirmasi.</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* ── User Profile ── */}
                <div className="dropdown dropdown-end ml-1">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                        {auth?.user?.avatar ? (
                            <div className="avatar">
                                <div className="w-7 rounded-full">
                                    <img src={auth.user.avatar} alt={auth.user.name} />
                                </div>
                            </div>
                        ) : (
                            <div className="avatar placeholder">
                                <div className="w-7 rounded-full bg-primary text-primary-content">
                                    <span className="text-[10px] font-black uppercase">AD</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu p-1.5 shadow-2xl bg-base-100 border border-base-300 rounded-2xl w-60 mt-2 z-50">
                        <li className="px-4 py-3 border-b border-base-200 mb-1">
                            <p className="text-sm font-black truncate">{auth?.user?.name || 'Administrator'}</p>
                            <p className="text-[10px] text-base-content/50 truncate tracking-wider uppercase font-bold">{auth?.user?.role || 'admin'}</p>
                        </li>
                        <li>
                            <Link href="/admin/profile" className="rounded-xl py-2 px-3 text-sm font-medium">
                                <UserCircle className="w-4 h-4" />
                                <span>Profil Saya</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={route('admin.settings.index')} className="rounded-xl py-2 px-3 text-sm font-medium">
                                <Settings className="w-4 h-4" />
                                <span>Pengaturan</span>
                            </Link>
                        </li>
                        <li className="mt-1 border-t border-base-200 pt-1">
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button" 
                                className="rounded-xl py-2 px-3 text-sm font-bold text-error hover:bg-error/10 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Keluar Sistem</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}
