import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToasts } from '../../context/ToastContext';

// ─── Configuración visual por tipo ───────────────────────────────────────────

const CONFIG = {
  success: {
    Icon:      CheckCircle2,
    bar:       'bg-emerald-500',
    iconClass: 'text-emerald-500',
  },
  error: {
    Icon:      XCircle,
    bar:       'bg-rose-500',
    iconClass: 'text-rose-500',
  },
  info: {
    Icon:      Info,
    bar:       'bg-[#1B2E1D]',
    iconClass: 'text-[#1B2E1D]',
  },
  warning: {
    Icon:      AlertTriangle,
    bar:       'bg-amber-500',
    iconClass: 'text-amber-500',
  },
} as const;

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Toaster — colócalo una sola vez en App.tsx (fuera del router).
 * Renderiza todos los toasts activos en la esquina superior derecha.
 */
export default function Toaster() {
  const { toasts, dismiss } = useToasts();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none"
    >
      {toasts.map(toast => {
        const { Icon, bar, iconClass } = CONFIG[toast.type];
        return (
          <div
            key={toast.id}
            role="alert"
            className="pointer-events-auto flex items-start gap-3 bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden animate-in slide-in-from-right-8 duration-300"
          >
            {/* barra de color lateral */}
            <div className={`w-1 self-stretch shrink-0 ${bar}`} />

            {/* ícono */}
            <Icon className={`h-5 w-5 mt-[14px] shrink-0 ${iconClass}`} />

            {/* mensaje */}
            <p className="flex-1 py-3 pr-2 text-sm leading-snug text-stone-700">
              {toast.message}
            </p>

            {/* cerrar */}
            <button
              onClick={() => dismiss(toast.id)}
              aria-label="Cerrar notificación"
              className="mt-2 mr-2 shrink-0 rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
