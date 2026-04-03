import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, EyeOff, Lock } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1B2E1D] font-sans selection:bg-[#BD7474]/20 py-20 md:py-32">
            <div className="max-w-4xl mx-auto px-6">
                <Link to="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 hover:text-[#1B2E1D] transition-colors mb-16">
                    <ArrowLeft className="h-4 w-4" /> VOLVER A LA INVITACIÓN
                </Link>

                <div className="space-y-8 mb-20">
                    <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight leading-none text-[#1B2E1D]">
                        Política de <br /> Privacidad
                    </h1>
                    <p className="text-stone-400 font-light italic text-xl">Nuestra prioridad es la seguridad de tus datos y la exclusividad de tu evento.</p>
                </div>

                <div className="grid gap-16 md:grid-cols-2 mb-32">
                    <div className="p-10 bg-white rounded-[2rem] border border-stone-100 shadow-sm space-y-6">
                        <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-serif">Protección de Datos</h3>
                        <p className="text-stone-500 font-light leading-relaxed text-sm">
                            Toda la información proporcionada a través de este formulario de confirmación (RSVP) se utiliza exclusivamente para la planificación y gestión del evento.
                        </p>
                    </div>

                    <div className="p-10 bg-white rounded-[2rem] border border-stone-100 shadow-sm space-y-6">
                        <div className="h-12 w-12 bg-[#BD7474]/10 rounded-2xl flex items-center justify-center text-[#BD7474]">
                            <EyeOff className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-serif">Privacidad de la Lista</h3>
                        <p className="text-stone-500 font-light leading-relaxed text-sm">
                            Su nombre y preferencias no se comparten con terceros ni se utilizan con fines comerciales o de marketing. Solo los organizadores del evento tendrán acceso a estos datos.
                        </p>
                    </div>
                </div>

                <article className="prose prose-stone prose-lg max-w-none space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">1. Recolección de Información</h2>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Recopilamos su nombre, número de invitados adicionales, preferencias alimentarias y mensajes personales únicamente con el fin de asegurar que su asistencia a la celebración de la Familia Cardona Nieto sea de lo más placentera.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">2. Cookies y Seguridad</h2>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Nuestra plataforma utiliza un sistema de códigos de invitación (Tokens) únicos y encriptados para que solo usted pueda acceder y confirmar su información personal.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">3. Sus Derechos</h2>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Usted tiene derecho a rectificar su asistencia o solicitar la eliminación de sus datos en cualquier momento previo al evento contactando a nuestro concierge.
                        </p>
                    </div>
                </article>

                <footer className="mt-32 pt-16 border-t border-stone-100 text-center space-y-6">
                    <div className="flex justify-center mb-8">
                        <Lock className="h-4 w-4 text-stone-300" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-400">
                        © 2026 INVITTO. ESTABLECIENDO EL ESTÁNDAR EN INVITACIONES DIGITALES PREMIUM.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
