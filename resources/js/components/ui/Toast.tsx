import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export interface ToastPayload {
    type?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    duration?: number;
}

interface ToastEntry extends ToastPayload {
    id: string;
}

interface ToastContextValue {
    showToast: (payload: ToastPayload) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [toasts, setToasts] = useState<ToastEntry[]>([]);

    const showToast = useCallback((payload: ToastPayload) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const toast: ToastEntry = {
            id,
            type: payload.type ?? 'info',
            title: payload.title,
            message: payload.message,
            duration: payload.duration ?? 3000,
        };

        setToasts((prev) => [...prev, toast]);

        window.setTimeout(() => {
            setToasts((prev) => prev.filter((item) => item.id !== id));
        }, toast.duration);
    }, []);

    const value = useMemo(() => ({ showToast }), [showToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="toast toast-top toast-end z-[100]">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`alert alert-${toast.type ?? 'info'} rounded-2xl shadow-xl`}>
                        <div>
                            {toast.title && <p className="text-sm font-black">{toast.title}</p>}
                            <p className="text-sm font-bold">{toast.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const context = useContext(ToastContext);

    if (context === null) {
        throw new Error('useToast must be used inside ToastProvider');
    }

    return context;
}
