import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import Seo from '../components/Seo';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col justify-between text-[#222B38] font-sans antialiased relative overflow-hidden selection:bg-[#DF3B94] selection:text-white">
            <Seo
                title="404 - Esta página no existe | Invitto"
                description="Lo sentimos, la página que buscas no pudo ser encontrada."
                path="/404"
                noindex
            />

            {/* Top Minimal Navigation Bar */}
            <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10 border-b border-slate-100">
                <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
                    <img src="/logo.png?v=3" alt="Invitto" className="h-8 w-auto object-contain" />
                </Link>
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#222B38] transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Regresar</span>
                </button>
            </header>

            {/* Main 404 Hero Section */}
            <main className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="max-w-xl w-full text-center flex flex-col items-center">
                    
                    {/* Centered Illustration */}
                    <div className="w-full max-w-[380px] sm:max-w-[420px] mb-8 relative transition-transform duration-500 hover:scale-[1.02]">
                        <img 
                            src="/images/404-illustration.png" 
                            alt="404 - Esta página no existe" 
                            className="w-full h-auto object-contain mx-auto select-none pointer-events-none drop-shadow-sm"
                            loading="eager"
                        />
                    </div>

                    {/* Headline */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-[#DF3B94] text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles className="h-3.5 w-3.5" /> Error 404
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222B38] tracking-tight mb-3">
                        Esta Página No Existe
                    </h1>

                    {/* Subtitle */}
                    <p className="text-slate-500 text-sm sm:text-base font-normal max-w-md mx-auto leading-relaxed mb-8">
                        Lo sentimos, la página que buscas no pudo ser encontrada. Pudo haber sido un enlace incorrecto o la dirección fue reubicada.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                        <Link to="/" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#DF3B94]/20 active:scale-95">
                                <Home className="h-4 w-4 text-white/90" />
                                <span>Volver al Inicio</span>
                            </button>
                        </Link>
                        <Link to="/ejemplos" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95">
                                <span>Ver Plantillas</span>
                            </button>
                        </Link>
                    </div>

                </div>
            </main>

            {/* Subtle Footer Note */}
            <footer className="w-full text-center py-6 text-xs text-slate-400 border-t border-slate-100">
                <p>© 2026 Invitto · Invitaciones Digitales</p>
            </footer>
        </div>
    );
};

export default NotFoundPage;
