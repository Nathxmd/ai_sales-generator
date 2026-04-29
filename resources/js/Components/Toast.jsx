import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

function ToastItem({ message, type = 'success', onDismiss }) {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 4000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const icons = {
        success: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    return (
        <div className={`toast toast-${type}`} role="alert">
            {icons[type]}
            <span className="flex-1">{message}</span>
            <button onClick={onDismiss} className="opacity-60 hover:opacity-100 transition ml-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

export default function Toast() {
    const { flash } = usePage().props;
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        if (flash?.success) {
            setToasts(prev => [...prev, { id: Date.now(), message: flash.success, type: 'success' }]);
        }
        if (flash?.error) {
            setToasts(prev => [...prev, { id: Date.now() + 1, message: flash.error, type: 'error' }]);
        }
    }, [flash?.success, flash?.error]);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <ToastItem
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onDismiss={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}
