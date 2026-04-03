import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** UI alternativo. Si no se provee se muestra el fallback por defecto. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — captura errores de render en cualquier componente hijo.
 *
 * React exige que sea un class component para usar componentDidCatch.
 * Colócalo alrededor de secciones críticas (rutas, widgets pesados) para
 * que un crash aislado no tire toda la app.
 *
 * Uso básico:
 *   <ErrorBoundary>
 *     <ComponenteQuePuedeFallar />
 *   </ErrorBoundary>
 *
 * Con fallback personalizado:
 *   <ErrorBoundary fallback={<p>Algo salió mal</p>}>
 *     ...
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Punto de extensión: reemplazar con Sentry.captureException(error, { extra: info })
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };


  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">

          {/* Logo / marca */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-400">
              INVITTO
            </p>
            <h1 className="text-3xl font-serif italic text-[#1B2E1D]">
              Algo salió mal
            </h1>
          </div>

          {/* Ilustración */}
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center">
            <svg
              className="w-9 h-9 text-rose-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>

          {/* Mensaje */}
          <p className="text-stone-500 text-sm leading-relaxed">
            Un error inesperado ocurrió en esta página. Puedes intentar
            recargar o regresar al inicio.
          </p>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={this.handleReload}
              className="px-6 py-3 bg-[#1B2E1D] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#2a4a2d] transition-colors"
            >
              Recargar página
            </button>
            <a
              href="/"
              className="px-6 py-3 border border-stone-200 text-stone-600 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:border-stone-400 transition-colors"
            >
              Ir al inicio
            </a>
          </div>

          {/* Error técnico (solo en development) */}
          {import.meta.env.DEV && this.state.error && (
            <details className="text-left bg-stone-100 rounded-xl p-4 text-[11px] text-stone-500 font-mono">
              <summary className="cursor-pointer font-sans font-bold text-stone-400 uppercase tracking-widest text-[10px] mb-2">
                Detalle técnico
              </summary>
              <pre className="whitespace-pre-wrap break-all">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}
