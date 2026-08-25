import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
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
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full text-center space-y-8 bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl">

          {/* Logo & Header */}
          <div className="space-y-3">
            <a href="/" className="inline-block hover:opacity-90 transition-opacity">
              <img src="/logo.png?v=3" alt="Invitto" className="h-9 w-auto mx-auto object-contain" />
            </a>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-[#222B38]">
              Algo salió mal
            </h1>
          </div>

          {/* Icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#DF3B94]">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>

          {/* Message */}
          <p className="text-slate-600 text-sm leading-relaxed font-normal">
            Un error inesperado ocurrió en esta página. Puedes intentar recargar o regresar al inicio.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={this.handleReload}
              className="px-6 py-3.5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#DF3B94]/20 active:scale-95"
            >
              Recargar página
            </button>
            <a
              href="/"
              className="px-6 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:border-slate-400 transition-colors inline-block"
            >
              Ir al inicio
            </a>
          </div>

          {/* Technical detail (in dev mode) */}
          {import.meta.env.DEV && this.state.error && (
            <details className="text-left bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 font-mono border border-slate-100">
              <summary className="cursor-pointer font-sans font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">
                Detalle técnico
              </summary>
              <pre className="whitespace-pre-wrap break-all text-[11px]">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}
