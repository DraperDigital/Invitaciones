import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        try {
            const consent = localStorage.getItem('invitto_cookie_consent');
            if (!consent) {
                // Pequeño retardo para no interferir con la carga inicial
                const timer = setTimeout(() => setIsVisible(true), 1200);
                return () => clearTimeout(timer);
            }
        } catch {
            // Si localStorage está bloqueado, no mostramos el banner
        }
    }, []);

    const handleConsent = (choice: 'all' | 'essential') => {
        try {
            localStorage.setItem('invitto_cookie_consent', choice);
        } catch {
            // Manejar posibles excepciones de storage
        }
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <aside
            aria-label="Aviso de cookies"
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
        >
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 md:p-6 shadow-2xl border border-slate-200/90 text-[#222B38] space-y-4">
                <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-[#fdf2f8] text-[#DF3B94] flex items-center justify-center flex-shrink-0">
                        <Cookie className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <h4 className="text-sm font-bold text-[#222B38] flex items-center justify-between">
                            <span>Privacidad y Cookies</span>
                            <button
                                onClick={() => handleConsent('essential')}
                                aria-label="Cerrar aviso de cookies"
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Usamos cookies esenciales para tu sesión y pagos, y analíticas anónimas para mejorar Invitto. Consulta nuestra{' '}
                            <Link to="/cookies" className="text-[#DF3B94] font-semibold underline hover:text-[#C52A7C]">
                                Política de Cookies
                            </Link>.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                    <button
                        onClick={() => handleConsent('all')}
                        className="flex-1 py-2.5 px-4 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#DF3B94]/20 active:scale-95 text-center"
                    >
                        Aceptar todas
                    </button>
                    <button
                        onClick={() => handleConsent('essential')}
                        className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors active:scale-95 text-center"
                    >
                        Solo necesarias
                    </button>
                </div>
            </div>
        </aside>
    );
}
