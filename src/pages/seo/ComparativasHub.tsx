import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Sparkles, Check } from 'lucide-react';
import Seo from '../../components/Seo';
import Breadcrumb from '../../components/Breadcrumb';
import { useAuth } from '../../context/AuthContext';

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
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-[#222B38]">
            <Seo
                title="Comparativas — Invitto vs Alternativas"
                description="Comparativas honestas: invitaciones digitales vs papel, Invitto vs Paperless Post y vs Greenvelope. Precios en pesos, funciones y experiencia para México."
                path="/comparativas"
                jsonLd={JSON_LD}
            />

            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-slate-100 px-4 md:px-6">
                <div className="mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center hover:opacity-95 transition-opacity">
                        <img src="/logo.png" alt="Invitto" className="h-8 md:h-10 w-auto object-contain" />
                    </Link>

                    <nav className="hidden lg:flex items-center gap-8">
                        <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Ejemplos
                        </Link>
                        <Link to="/planes" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Planes
                        </Link>
                        <Link to="/comparativas" className="text-xs uppercase font-bold tracking-widest text-[#DF3B94] transition-colors">
                            Comparativas
                        </Link>
                        <Link to="/concierge-service" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Concierge
                        </Link>
                        <Link to="/blog" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Blog
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link to={user ? "/dashboard" : "/planes"}>
                            <button className="px-5 py-2.5 md:px-6 md:py-3 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-[10px] md:text-xs uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#DF3B94]/20 hover:-translate-y-0.5 active:scale-95">
                                {user ? 'Dashboard' : 'Comenzar'}
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-28 md:pt-40 pb-20 md:pb-32 px-6">
                <div className="mx-auto max-w-5xl">
                    <Breadcrumb items={[{ label: 'Comparativas' }]} />

                    <div className="text-center space-y-6 mb-16 md:mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#DF3B94]">
                            <span>Comparativas Transparentes</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-[#222B38] leading-tight tracking-tight">
                            ¿Cómo se compara <span className="bg-gradient-to-r from-[#DF3B94] via-[#F5B837] to-[#DF3B94] bg-clip-text text-transparent">Invitto</span> con tus alternativas?
                        </h1>
                        <p className="text-base md:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
                            Te dejamos las comparativas sin endulzar. Mira precios en pesos, funciones reales y cuál conviene más para tu evento en México.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {COMPARISONS.map((c) => (
                            <Link
                                key={c.slug}
                                to={`/${c.slug}`}
                                className="group bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#DF3B94]/5 transition-all flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="h-14 w-14 rounded-2xl bg-[#fdf2f8] text-[#DF3B94] flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FileText className="h-7 w-7" />
                                    </div>
                                    <h2 className="text-2xl font-display font-bold text-[#222B38] leading-tight">{c.title}</h2>
                                    <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal">{c.description}</p>
                                </div>
                                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs uppercase font-bold tracking-widest text-[#DF3B94] group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                                        {c.cta} <ArrowRight className="h-4 w-4" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-20 md:mt-24 text-center bg-[#222B38] text-white p-10 md:p-14 rounded-3xl space-y-6">
                        <h3 className="text-2xl md:text-4xl font-display font-extrabold">¿Listo para crear tu invitación?</h3>
                        <p className="text-slate-300 font-normal text-sm md:text-base max-w-xl mx-auto">
                            Diseña tu invitación de forma gratuita en modo borrador. Solo pagas cuando decidas publicar.
                        </p>
                        <Link to={user ? "/dashboard" : "/dashboard/new"}>
                            <button className="px-8 py-4 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-2xl text-xs uppercase font-bold tracking-widest transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 inline-flex items-center gap-2">
                                {user ? 'Ir al Dashboard' : 'Crear mi invitación'} <ArrowRight className="h-4 w-4" />
                            </button>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#222B38] text-white pt-16 pb-12 px-6 border-t border-white/10">
                <div className="mx-auto max-w-7xl space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-4 space-y-4">
                            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
                                <img src="/logo.png" alt="Invitto" className="h-8 w-auto object-contain brightness-0 invert" />
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
