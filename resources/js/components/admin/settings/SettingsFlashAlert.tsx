import Alert from '@/components/ui/Alert';

interface SettingsFlashAlertProps {
    success?: string;
    error?: string;
}

export default function SettingsFlashAlert({ success, error }: SettingsFlashAlertProps): JSX.Element {
    return (
        <>
            {success && <Alert type="success" title="Berhasil" message={success} />}
            {error && <Alert type="error" title="Gagal" message={error} />}
        </>
    );
}
