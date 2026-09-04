import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import Seo from '../components/Seo';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F5F6FF] flex flex-col justify-between text-[#1A1D26] font-sans antialiased relative overflow-hidden selection:bg-[#5E4AE3] selection:text-white">
            <Seo
                title="404 - Esta página no existe | Invitto"
                description="Lo sentimos, la página que buscas no pudo ser encontrada."
                path="/404"
                noindex
            />

            {/* Top Minimal Navigation Bar */}
            <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-[#1B2E1D] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                        <Sparkles className="h-4 w-4 text-amber-300" />
                    </div>
                    <span className="font-serif text-xl font-bold tracking-tight text-[#1B2E1D]">Invitto</span>
                </Link>
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-stone-200/50"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Regresar</span>
                </button>
            </header>

            {/* Main 404 Hero Section (Matching Reference Design) */}
            <main className="flex-1 flex items-center justify-center px-6 py-8">
                <div className="max-w-xl w-full text-center flex flex-col items-center">
                    
                    {/* Centered Skater 404 Illustration */}
                    <div className="w-full max-w-[440px] sm:max-w-[480px] mb-8 relative transition-transform duration-500 hover:scale-[1.02]">
                        <img 
                            src="/images/404-illustration.png" 
                            alt="404 - Esta página no existe" 
                            className="w-full h-auto object-contain mx-auto select-none pointer-events-none drop-shadow-sm"
                            loading="eager"
                        />
                    </div>

                    {/* Headline */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1D26] tracking-tight mb-3">
                        Esta Página No Existe
                    </h1>

                    {/* Subtitle */}
                    <p className="text-stone-500 text-sm sm:text-base font-normal max-w-md mx-auto leading-relaxed mb-8">
                        Lo sentimos, la página que buscas no pudo ser encontrada. Pudo haber sido un enlace incorrecto o la dirección fue reubicada.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <Link to="/" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#1B2E1D] hover:bg-stone-800 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95">
                                <Home className="h-4 w-4 text-stone-300" />
                                <span>Volver al Inicio</span>
                            </button>
                        </Link>
                        <Link to="/ejemplos" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/80 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow active:scale-95">
                                <span>Ver Plantillas</span>
                            </button>
                        </Link>
                    </div>

                </div>
            </main>

            {/* Subtle Footer Note */}
            <footer className="w-full text-center py-6 text-xs text-stone-400">
                <p>© 2026 Invitto · Invitaciones Digitales</p>
            </footer>
        </div>
    );
};

export default NotFoundPage;
