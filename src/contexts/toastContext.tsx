"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type?: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, number>>({});

  const removeToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    const t = timers.current[id];
    if (t) {
      window.clearTimeout(t);
      delete timers.current[id];
    }
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((t) => [...t, { id, message, type }]);
      timers.current[id] = window.setTimeout(
        () => removeToast(id),
        3000,
      ) as unknown as number;
    },
    [removeToast],
  );

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach((t) => window.clearTimeout(t));
      timers.current = {};
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed right-4 top-20 z-50 flex flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`max-w-sm rounded-md px-4 py-3 shadow ${
              toast.type === "success"
                ? "bg-green-50 text-green-800"
                : toast.type === "error"
                  ? "bg-red-50 text-red-800"
                  : "bg-gray-50 text-gray-800"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 text-sm">{toast.message}</div>
              <button
                aria-label="Close"
                onClick={() => removeToast(toast.id)}
                className="text-sm text-gray-500"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
