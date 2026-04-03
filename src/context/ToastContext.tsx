import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (type: ToastType, message: string) => void;
  dismiss: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const id = crypto.randomUUID();
      setToasts(prev => [...prev, { id, type, message }]);

      // Errores duran más para que el usuario pueda leerlos
      const duration = type === 'error' ? 6000 : 4000;
      const timer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Usar dentro de cualquier componente para disparar toasts */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');

  return {
    success: (msg: string) => ctx.addToast('success', msg),
    error:   (msg: string) => ctx.addToast('error',   msg),
    info:    (msg: string) => ctx.addToast('info',    msg),
    warning: (msg: string) => ctx.addToast('warning', msg),
  };
}

/** Usar en el componente Toaster para leer y descartar toasts activos */
export function useToasts() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToasts debe usarse dentro de <ToastProvider>');
  return { toasts: ctx.toasts, dismiss: ctx.dismiss };
}
