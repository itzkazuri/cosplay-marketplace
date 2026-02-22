import Alert from '@/components/ui/Alert';

interface PromoFlashAlertProps {
    success?: string;
    error?: string;
}

export default function PromoFlashAlert({ success, error }: PromoFlashAlertProps): JSX.Element {
    return (
        <>
            {success && <Alert type="success" title="Berhasil" message={success} />}
            {error && <Alert type="error" title="Gagal" message={error} />}
        </>
    );
}
