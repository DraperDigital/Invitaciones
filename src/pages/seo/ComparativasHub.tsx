import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Sparkles } from 'lucide-react';
import Seo from '../../components/Seo';
import Breadcrumb from '../../components/Breadcrumb';

const COMPARISONS = [
    {
        slug: 'invitaciones-digitales-vs-papel',
        title: 'Invitaciones digitales vs papel',
        description: '¿Cuál conviene más en 2026? Comparamos costo, tiempo de entrega, impacto ambiental y experiencia del invitado.',
        cta: 'Ver comparativa',
    },
    {
        slug: 'invitto-vs-otras-plataformas',
        title: 'Invitto vs Otras Plataformas',
        description: 'Comparativa de Invitto contra Canva, Paperless Post, Greenvelope y PDFs interactivos. Analizamos precios y funciones.',
        cta: 'Ver comparativa',
    },
    {
        slug: 'invitto-vs-paperless-post',
        title: 'Invitto vs Paperless Post',
        description: 'Comparativa completa: precios en pesos mexicanos, funciones, soporte local y experiencia para anfitriones en México.',
        cta: 'Ver comparativa',
    },
    {
        slug: 'invitto-vs-greenvelope',
        title: 'Invitto vs Greenvelope',
        description: 'Comparativa enfocada en bodas: pricing en MXN, integración con WhatsApp, plantillas y mercado mexicano.',
        cta: 'Ver comparativa',
    },
];

const JSON_LD = [
    {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Comparativas de invitaciones digitales',
        url: 'https://invitto.com.mx/comparativas',
        description: 'Comparativas honestas entre Invitto y otras alternativas de invitaciones digitales para el mercado mexicano.',
        inLanguage: 'es-MX',
        hasPart: COMPARISONS.map((c) => ({
            '@type': 'WebPage',
            name: c.title,
            url: `https://invitto.com.mx/${c.slug}`,
        })),
    },
];

export default function ComparativasHub() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1B2E1D]">
            <Seo
                title="Comparativas — Invitto vs Alternativas"
                description="Comparativas honestas: invitaciones digitales vs papel, Invitto vs Paperless Post y vs Greenvelope. Precios en pesos, funciones y experiencia para México."
                path="/comparativas"
                jsonLd={JSON_LD}
            />

            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-[#1B2E1D]/5 px-4 md:px-6">
                <div className="mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
                    <Link to="/" className="text-xl md:text-2xl font-serif italic tracking-tighter hover:text-stone-600 transition-colors">
                        Invitto
                    </Link>
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">Ejemplos</Link>
                        <Link to="/planes" className="text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">Planes</Link>
                        <Link to="/comparativas" className="text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">Comparativas</Link>
                        <Link to="/concierge-service" className="text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">Concierge</Link>
                        <Link to="/blog" className="text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">Blog</Link>
                    </nav>
                    <Link to="/planes">
                        <button className="px-4 py-2.5 md:px-6 md:py-3 bg-[#1B2E1D] text-white rounded-lg md:rounded-xl text-[9px] md:text-xs uppercase font-bold tracking-widest hover:bg-[#2D312E] transition-all shadow-lg shadow-[#1B2E1D]/10">
                            Comenzar
                        </button>
                    </Link>
                </div>
            </header>

            <main className="pt-28 md:pt-40 pb-20 md:pb-32 px-6">
                <div className="mx-auto max-w-5xl">
                    <Breadcrumb items={[{ label: 'Comparativas' }]} />

                    <div className="text-center space-y-6 mb-16 md:mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 md:py-2 bg-[#1B2E1D]/5 rounded-full text-[8px] md:text-[10px] uppercase font-bold tracking-widest text-[#1B2E1D]">
                            <Sparkles className="h-3.5 w-3.5 text-[#BD7474]" />
                            <span>Comparativas honestas</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif leading-tight tracking-tight">
                            ¿Cómo se compara <span className="italic text-[#BD7474]">Invitto</span> con tus alternativas?
                        </h1>
                        <p className="text-base md:text-xl text-stone-500 font-light leading-relaxed max-w-2xl mx-auto">
                            Te dejamos las comparativas sin endulzar. Mira pricing en pesos, funciones reales y cuál conviene más para tu evento en México.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        {COMPARISONS.map((c) => (
                            <Link
                                key={c.slug}
                                to={`/${c.slug}`}
                                className="group bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all flex flex-col"
                            >
                                <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-[#BD7474]/10 flex items-center justify-center text-[#BD7474] mb-6 group-hover:scale-110 transition-transform">
                                    <FileText className="h-6 w-6 md:h-7 md:w-7" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-serif text-[#1B2E1D] mb-3 leading-tight">{c.title}</h2>
                                <p className="text-sm md:text-base text-stone-500 font-light leading-relaxed mb-8 flex-1">{c.description}</p>
                                <span className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.3em] text-[#1B2E1D] group-hover:text-[#BD7474] transition-colors">
                                    {c.cta} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-20 md:mt-24 text-center">
                        <p className="text-stone-400 font-light italic text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                            ¿Listo para crear tu invitación? Empieza ahora y elige tu plan al final.
                        </p>
                        <Link
                            to="/dashboard/new"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-[#1B2E1D] text-white rounded-2xl text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-[#2D312E] transition-all shadow-xl"
                        >
                            Crear mi invitación <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
