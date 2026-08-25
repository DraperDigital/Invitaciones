import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Sparkles } from 'lucide-react';
import Seo from '../components/Seo';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-6 font-sans text-[#222B38]">
            <Seo
                title="Página no encontrada | Invitto"
                description="La página que buscas no existe o ha sido movida."
                path="/404"
                noindex
            />
            <div className="max-w-md w-full text-center space-y-8">
                <div className="relative flex justify-center">
                    <div className="absolute inset-0 blur-3xl bg-[#DF3B94]/10 rounded-full" />
                    <div className="w-20 h-20 bg-pink-50 text-[#DF3B94] rounded-3xl flex items-center justify-center relative shadow-sm border border-pink-100">
                        <Sparkles className="h-10 w-10 text-[#DF3B94]" />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-8xl md:text-9xl font-display font-extrabold text-[#222B38] tracking-tight">404</h1>
                    <p className="text-xl md:text-2xl font-display font-bold text-slate-700">Página no encontrada</p>
                </div>

                <div className="h-px w-16 bg-slate-200 mx-auto" />

                <p className="text-slate-500 font-normal text-sm md:text-base leading-relaxed">
                    Parece que el enlace que buscas ha cambiado o no existe. Verifica la dirección o regresa a la página principal.
                </p>

                <div>
                    <Link to="/">
                        <button className="inline-flex items-center gap-3 px-8 py-4 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#DF3B94]/20 active:scale-95">
                            <Home className="h-4 w-4" />
                            <span>Volver al Inicio</span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
