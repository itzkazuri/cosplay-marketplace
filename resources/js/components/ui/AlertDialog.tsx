interface AlertDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmType?: 'error' | 'primary' | 'secondary';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function AlertDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Ya, Lanjutkan',
    cancelLabel = 'Batal',
    confirmType = 'primary',
    onConfirm,
    onCancel,
}: AlertDialogProps): JSX.Element | null {
    if (!isOpen) {
        return null;
    }

    const buttonClass = confirmType === 'error' ? 'btn-error' : confirmType === 'secondary' ? 'btn-secondary' : 'btn-primary';

    return (
        <dialog className="modal modal-open">
            <div className="modal-box max-w-md rounded-3xl border border-base-300">
                <h3 className="text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm font-medium text-base-content/70">{message}</p>
                <div className="modal-action">
                    <button type="button" className="btn btn-ghost rounded-xl" onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button type="button" className={`btn rounded-xl font-black ${buttonClass}`} onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button type="button" onClick={onCancel}>close</button>
            </form>
        </dialog>
    );
}
