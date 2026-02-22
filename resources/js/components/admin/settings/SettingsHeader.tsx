import { Settings } from 'lucide-react';

export default function SettingsHeader(): JSX.Element {
    return (
        <div className="rounded-3xl border border-base-300 bg-gradient-to-r from-primary/15 via-base-100 to-secondary/15 p-6 shadow-lg">
            <h1 className="flex items-center gap-3 text-3xl font-black uppercase tracking-tight text-base-content">
                <Settings className="h-8 w-8 text-primary" />
                Pengaturan Admin
            </h1>
            <p className="mt-2 text-sm font-medium text-base-content/70">
                Kelola akun admin, ubah password, dan pantau log aplikasi Laravel dari satu halaman.
            </p>
        </div>
    );
}
