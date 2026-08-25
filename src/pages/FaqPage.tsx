import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Seo from '../components/Seo';
import { FAQ_ITEMS, FAQ_JSONLD } from '../data/faq';
import { ArrowRight, HelpCircle } from 'lucide-react';

export default function FaqPage() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-[#222B38]">
            <Seo
                title="Preguntas Frecuentes | Invitto"
                description="Resuelve todas tus dudas sobre cómo crear, enviar y gestionar tus invitaciones digitales y confirmaciones de asistencia con Invitto."
                path="/faq"
                jsonLd={FAQ_JSONLD}
            />

            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-slate-100 px-4 md:px-6">
                <div className="mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center hover:opacity-95 transition-opacity">
                        <img src="/logo.png?v=3" alt="Invitto" className="h-8 md:h-10 w-auto object-contain" />
                    </Link>
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Ejemplos
                        </Link>
                        <Link to="/planes" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Planes
                        </Link>
                        <Link to="/comparativas" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Comparativas
                        </Link>
                        <Link to="/concierge-service" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Concierge
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link to={user ? "/dashboard" : "/planes"}>
                            <button className="px-5 py-2.5 md:px-6 md:py-3 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-[10px] md:text-xs uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#DF3B94]/20 hover:-translate-y-0.5 active:scale-95">
                                {user ? 'Dashboard' : 'Comenzar'}
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-6 pt-32 md:pt-40 pb-20 md:pb-32">
                <div className="text-center space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#DF3B94]">
                        <HelpCircle className="h-4 w-4" />
                        <span>Centro de Ayuda</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[#222B38]">Preguntas Frecuentes</h1>
                    <p className="text-base md:text-lg text-slate-600 font-normal max-w-2xl mx-auto">
                        Todo lo que necesitas saber sobre cómo Invitto te ayuda a gestionar tus invitados sin estrés.
                    </p>
                </div>

                <div className="space-y-6">
                    {FAQ_ITEMS.map((item, index) => (
                        <div key={index} className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
                            <h2 className="text-xl md:text-2xl font-display font-bold text-[#222B38] mb-3">
                                {item.question || item.q}
                            </h2>
                            <p className="text-slate-600 font-normal leading-relaxed text-base">
                                {item.answer || item.a}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center bg-[#222B38] p-10 md:p-14 rounded-3xl text-white space-y-6">
                    <h3 className="text-2xl md:text-4xl font-display font-extrabold">¿Listo para crear tu invitación?</h3>
                    <p className="text-slate-300 font-normal text-sm md:text-base max-w-xl mx-auto">
                        Empieza hoy mismo de forma gratuita y paga solo cuando estés listo para compartir.
                    </p>
                    <Link to={user ? "/dashboard" : "/dashboard/new"}>
                        <button className="px-8 py-4 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-2xl text-xs uppercase font-bold tracking-widest transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 inline-flex items-center gap-2">
                            {user ? 'Ir al Dashboard' : 'Comenzar gratis'} <ArrowRight className="h-4 w-4" />
                        </button>
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#222B38] text-white pt-16 pb-12 px-6 border-t border-white/10">
                <div className="mx-auto max-w-7xl space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-4 space-y-4">
                            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
                                <img src="/logo.png?v=3" alt="Invitto" className="h-8 w-auto object-contain brightness-0 invert" />
                            </Link>
                            <p className="text-xs text-slate-400 font-normal leading-relaxed">
                                Invitaciones digitales de alta gama con control de pases y confirmación inteligente para México y Latinoamérica.
                            </p>
                        </div>
                        <div className="lg:col-span-4 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-white">Navegación</p>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li><Link to="/planes" className="hover:text-white transition-colors">Planes y precios</Link></li>
                                <li><Link to="/ejemplos" className="hover:text-white transition-colors">Ejemplos</Link></li>
                                <li><Link to="/comparativas" className="hover:text-white transition-colors">Comparativas</Link></li>
                                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            </ul>
                        </div>
                        <div className="lg:col-span-4 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-white">Contacto</p>
                            <p className="text-xs text-slate-400">Soporte directo por WhatsApp y correo en México.</p>
                            <a href="mailto:soporte@invitto.com.mx" className="text-xs text-[#DF3B94] font-bold hover:underline">soporte@invitto.com.mx</a>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                        <p>© 2026 INVITTO.MX · TODOS LOS DERECHOS RESERVADOS</p>
                        <p>HECHO CON CARIÑO EN MÉXICO</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
