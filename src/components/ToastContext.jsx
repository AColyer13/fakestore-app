import { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer, Button } from 'react-bootstrap';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, options = {}) => {
    const id = Math.random().toString(36);
    setToasts((prev) => [...prev, { id, message, ...options }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999 }}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            onClose={() => removeToast(toast.id)}
            bg={toast.variant || 'dark'}
            delay={toast.delay || 4000}
            autohide
            role="status"
            aria-live="polite"
          >
            <Toast.Body>
              {toast.message}
              {toast.action && (
                <Button
                  variant="link"
                  size="sm"
                  className="ms-2"
                  onClick={() => {
                    toast.action();
                    removeToast(toast.id);
                  }}
                  aria-label={toast.actionLabel || "Undo"}
                >
                  {toast.actionLabel || "Undo"}
                </Button>
              )}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}
