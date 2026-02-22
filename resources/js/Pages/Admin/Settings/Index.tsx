import SettingsFlashAlert from '@/components/admin/settings/SettingsFlashAlert';
import SettingsHeader from '@/components/admin/settings/SettingsHeader';
import ProfileSettingsForm, { type AdminProfileData } from '@/components/admin/settings/ProfileSettingsForm';
import PasswordSettingsForm from '@/components/admin/settings/PasswordSettingsForm';
import LogMonitorCard from '@/components/admin/settings/LogMonitorCard';
import AdminLayout from '@/components/layout/AdminLayout';
import { Head, usePage } from '@inertiajs/react';

interface LogEntry {
    timestamp: string;
    level: string;
    message: string;
}

interface SettingsPageProps {
    profile: AdminProfileData;
    logs: LogEntry[];
    log_refreshed_at: string;
}

export default function SettingsIndex({ profile, logs, log_refreshed_at: logRefreshedAt }: SettingsPageProps): JSX.Element {
    const page = usePage();
    const flash = (page.props as { flash?: { success?: string; error?: string } }).flash;

    return (
        <AdminLayout title="Pengaturan">
            <Head title="Pengaturan Admin" />

            <div className="space-y-6">
                <SettingsFlashAlert success={flash?.success} error={flash?.error} />
                <SettingsHeader />

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                    <div className="space-y-6 xl:col-span-3">
                        <ProfileSettingsForm profile={profile} />
                        <PasswordSettingsForm />
                    </div>
                    <div className="xl:col-span-2">
                        <LogMonitorCard logs={logs} logRefreshedAt={logRefreshedAt} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
