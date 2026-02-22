interface AlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    className?: string;
}

export default function Alert({ type = 'info', title, message, className = '' }: AlertProps): JSX.Element {
    return (
        <div className={`alert alert-${type} rounded-2xl shadow-lg ${className}`.trim()}>
            <div>
                {title && <p className="text-sm font-black">{title}</p>}
                <p className="text-sm font-bold">{message}</p>
            </div>
        </div>
    );
}
