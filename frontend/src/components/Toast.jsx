import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    return (
        <div className={`alert alert-${type}`} style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 9999,
            minWidth: '300px',
            maxWidth: '400px'
        }}>
            <span>{message}</span>
            <button
                onClick={onClose}
                style={{
                    marginLeft: 'auto',
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    lineHeight: 1
                }}
            >
                ×
            </button>
        </div>
    );
};

// Toast container with multiple toasts support
export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999 }}>
            {toasts.map((toast, index) => (
                <div key={toast.id} style={{ marginBottom: '0.5rem' }}>
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                        duration={toast.duration}
                    />
                </div>
            ))}
        </div>
    );
};

// Custom hook for managing toasts
export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info', duration = 5000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const success = (message) => addToast(message, 'success');
    const error = (message) => addToast(message, 'error');
    const warning = (message) => addToast(message, 'warning');
    const info = (message) => addToast(message, 'info');

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
        ToastContainer: () => <ToastContainer toasts={toasts} removeToast={removeToast} />
    };
};

export default Toast;
