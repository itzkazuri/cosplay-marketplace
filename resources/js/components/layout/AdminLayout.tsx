import { useToast } from '@/components/ui/Toast';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/admin/layout/Sidebar';
import Topbar from '@/components/admin/layout/Topbar';

export default function AdminLayout({ 
    children, 
    title = 'Admin Panel' 
}: PropsWithChildren<{ title?: string }>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const page = usePage();
    const flash = (page.props as { flash?: { success?: string; error?: string } }).flash;
    const { showToast } = useToast();
    const lastToastRef = useRef<string>('');

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [window.location.pathname]);

    useEffect(() => {
        if (!flash?.success && !flash?.error) {
            return;
        }

        const signature = `${flash.success ?? ''}|${flash.error ?? ''}`;
        if (lastToastRef.current === signature) {
            return;
        }

        lastToastRef.current = signature;

        if (flash.success) {
            showToast({
                type: 'success',
                title: 'Berhasil',
                message: flash.success,
            });
        }

        if (flash.error) {
            showToast({
                type: 'error',
                title: 'Terjadi Kesalahan',
                message: flash.error,
                duration: 4500,
            });
        }
    }, [flash?.success, flash?.error, showToast]);

    return (
        <div className="min-h-screen bg-base-200">
            <Head title={`${title} | Admin Cosplay Shop`} />

            {/* ── Sidebar ── */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            />

            {/* ── Backdrop (Mobile) ── */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-base-content/20 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* ── Main Content ── */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                <Topbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main className="flex-1 p-4 lg:p-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>

                <footer className="p-4 border-t border-base-300 text-center text-xs text-base-content/40">
                    &copy; {new Date().getFullYear()} Cosplay Shop Administrator. All rights reserved.
                </footer>
            </div>
        </div>
    );
}
