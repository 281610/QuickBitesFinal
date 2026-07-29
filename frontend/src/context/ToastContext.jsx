import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

const ToastContext = createContext(null);

function getTone(type) {
  if (type === "success") {
    return "border-emerald-200 bg-gradient-to-r from-emerald-50 to-white text-emerald-800";
  }
  if (type === "error") {
    return "border-rose-200 bg-gradient-to-r from-rose-50 to-white text-rose-800";
  }
  return "border-amber-200 bg-gradient-to-r from-amber-50 to-white text-amber-900";
}

function getIcon(type) {
  if (type === "success") return <CheckCircle2 size={18} className="text-emerald-600" />;
  if (type === "error") return <XCircle size={18} className="text-rose-600" />;
  return <Info size={18} className="text-amber-700" />;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 2600) => {
      if (!message) return;
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      window.setTimeout(() => removeToast(id), duration);
    },
    [removeToast],
  );

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed top-4 right-4 z-[120] flex flex-col gap-3 w-[min(92vw,380px)] pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border shadow-[0_16px_40px_rgba(0,0,0,0.18)] px-4 py-3 animate-[toast-in_220ms_ease-out] ${getTone(toast.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIcon(toast.type)}</div>
              <p className="text-sm font-medium leading-relaxed flex-1">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-lg p-1 hover:bg-black/5"
                aria-label="Close popup"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>
        {`@keyframes toast-in { from { opacity: 0; transform: translateY(-8px) scale(0.98);} to { opacity: 1; transform: translateY(0) scale(1);} }`}
      </style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
