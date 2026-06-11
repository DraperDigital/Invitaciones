import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Seo from '../components/Seo';
import { FAQ_ITEMS, FAQ_JSONLD } from '../data/faq';

export default function FaqPage() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1B2E1D]">
            <Seo
                title="Preguntas Frecuentes | Invitto"
                description="Resuelve todas tus dudas sobre cómo crear, enviar y gestionar tus invitaciones digitales y confirmaciones de asistencia con Invitto."
                path="/faq"
                jsonLd={FAQ_JSONLD}
            />

            {/* Header (Simplified) */}
            <header className="w-full bg-[#FDFBF7] border-b border-[#1B2E1D]/5 px-4 md:px-6 sticky top-0 z-50">
                <div className="mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
                    <Link to="/" className="text-xl md:text-2xl font-serif italic tracking-tighter hover:text-stone-600 transition-colors">
                        Invitto
                    </Link>
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">
                            Ejemplos
                        </Link>
                        <Link to="/planes" className="text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">
                            Planes
                        </Link>
                        <Link to="/comparativas" className="text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">
                            Comparativas
                        </Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link to="/dashboard">
                                <button className="px-4 py-2 bg-[#1B2E1D] text-white rounded-lg text-xs uppercase font-bold tracking-widest hover:bg-[#2D312E] transition-all">
                                    Panel
                                </button>
                            </Link>
                        ) : (
                            <Link to="/login" className="hidden sm:block text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">
                                Ingresar
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif mb-6 text-[#1B2E1D]">Preguntas Frecuentes</h1>
                    <p className="text-lg text-stone-500 font-light max-w-2xl mx-auto">
                        Todo lo que necesitas saber sobre cómo Invitto te ayuda a gestionar tus invitados sin estrés.
                    </p>
                </div>

                <div className="space-y-12">
                    {FAQ_ITEMS.map((item, index) => (
                        <div key={index} className="bg-white p-8 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-stone-100">
                            <h2 className="text-xl md:text-2xl font-serif text-[#1B2E1D] mb-4">
                                {item.q}
                            </h2>
                            <p className="text-stone-500 font-light leading-relaxed md:text-lg">
                                {item.a}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center bg-[#1B2E1D] p-10 md:p-16 rounded-[2.5rem] md:rounded-[3rem] text-white">
                    <h3 className="text-2xl md:text-4xl font-serif mb-6">¿Listo para crear tu invitación?</h3>
                    <p className="text-stone-300 font-light mb-8 max-w-xl mx-auto">
                        Empieza hoy mismo de forma gratuita y paga solo cuando estés listo para compartir.
                    </p>
                    <Link to="/dashboard/new">
                        <button className="px-8 py-4 bg-white text-[#1B2E1D] rounded-xl text-[10px] md:text-xs uppercase font-bold tracking-[0.2em] hover:bg-[#BD7474] hover:text-white transition-all shadow-lg">
                            Comenzar gratis
                        </button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
