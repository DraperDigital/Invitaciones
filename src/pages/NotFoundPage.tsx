import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Sparkles } from 'lucide-react';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                <div className="relative mb-12 flex justify-center">
                    <div className="absolute inset-0 blur-3xl bg-[#BD7474]/10 rounded-full" />
                    <Sparkles className="h-20 w-20 text-[#BD7474] animate-pulse relative" />
                </div>
                <h1 className="text-9xl font-serif font-light text-[#1B2E1D] mb-4">404</h1>
                <p className="text-2xl font-serif italic text-stone-600 mb-8">Página no encontrada</p>
                <div className="h-px w-24 bg-stone-200 mx-auto mb-8" />
                <p className="text-stone-500 font-light mb-12">
                    Parece que la invitación que buscas se ha extraviado o el enlace es incorrecto. 
                    Por favor, verifica la dirección o vuelve al inicio.
                </p>
                <Link to="/">
                    <button className="inline-flex items-center gap-3 px-10 py-4 bg-[#1B2E1D] text-white rounded-full font-sans font-bold uppercase tracking-widest text-xs hover:bg-[#2D312E] transition-all transform active:scale-95 shadow-xl">
                        <Home className="h-4 w-4" />
                        <span>Volver al Inicio</span>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
