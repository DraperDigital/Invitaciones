import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, PartyPopper, GraduationCap, Cake, Baby, Church, Sparkles, ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';

const categories = [
    { id: 'todas', name: 'Todas', icon: Sparkles },
    { id: 'boda', name: 'Bodas', icon: HeartHandshake },
    { id: 'xv', name: 'XV Años', icon: PartyPopper },
    { id: 'cumpleanos', name: 'Cumpleaños', icon: Cake },
    { id: 'bautizo', name: 'Bautizos', icon: Baby },
    { id: 'graduacion', name: 'Graduaciones', icon: GraduationCap },
    { id: 'comunion', name: 'Primera Comunión', icon: Church },
];

export default function ExamplesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get('category') || 'todas';
    const [activeCategory, setActiveCategory] = useState(categoryParam);
    const { user } = useAuth();

    const filteredExamples = useMemo(() => {
        const TEMPLATES = [
            { id: 'modern-minimalist', name: 'Moderna Minimalista', category: 'boda', slug: 'boda-gabriela-arturo-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop' },
            { id: 'split-screen', name: 'Vanguardia Dividida', category: 'boda', slug: 'boda-sofia-mateo-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop' },
            { id: 'classic-elegance', name: 'Clásica Atemporal', category: 'boda', slug: 'boda-isabel-rodrigo-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop' },
            { id: 'magazine', name: 'Estilo Editorial', category: 'xv', slug: 'xv-valeria-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop' },
            { id: 'romantic-botanical', name: 'Elegancia Floral', category: 'xv', slug: 'xv-regina-2026-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=800&auto=format&fit=crop' },
            { id: 'neon-glow', name: 'Fiesta Neón', category: 'cumpleanos', slug: 'cumple-emilia-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8892bf30b5?q=80&w=800&auto=format&fit=crop' },
            { id: 'luxury-gold', name: 'Lujo Metálico', category: 'boda', slug: 'gala-aniversario-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop' },
            { id: 'passport', name: 'Pase de Abordaje', category: 'boda', slug: 'boda-destino-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop' },
            { id: 'polaroid-vintage', name: 'Retro Fotográfico', category: 'graduacion', slug: 'graduacion-ana-psicologia-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop' },
            { id: 'whimsical-kids', name: 'Fantasía Infantil', category: 'bautizo', slug: 'bautizo-victoria-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop' },
            { id: 'collage', name: 'Collage Elegante', category: 'boda', slug: 'boda-collage-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop' },
            { id: 'floral-symmetry', name: 'Simetría Floral', category: 'boda', slug: 'boda-simetria-floral', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1546842631-8ea8736a58fc?q=80&w=800&auto=format&fit=crop' }
        ];

        if (activeCategory === 'todas') {
            return TEMPLATES;
        }
        
        return TEMPLATES.filter(
            tpl => tpl.category === activeCategory
        );
    }, [activeCategory]);

    const handleCategoryChange = (categoryId: string) => {
        setActiveCategory(categoryId);
        if (categoryId === 'todas') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', categoryId);
        }
        setSearchParams(searchParams);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-[#222B38]">
            <Seo
                title="Ejemplos de invitaciones digitales — Bodas, XV años, eventos"
                description="Mira ejemplos reales de invitaciones digitales para bodas, XV años, cumpleaños, bautizos y más. Estilos elegantes con RSVP integrado."
                path="/ejemplos"
            />
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-slate-100 px-4 md:px-6">
                <div className="mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center hover:opacity-95 transition-opacity">
                        <img src="/logo.png?v=3" alt="Invitto" className="h-8 md:h-10 w-auto object-contain" />
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest text-[#DF3B94]">
                            Ejemplos
                        </Link>
                        <Link to="/planes" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Planes
                        </Link>
                        <Link to="/comparativas" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Comparativas
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link to={user ? "/dashboard" : "/planes"}>
                            <button className="px-5 py-2.5 md:px-6 md:py-3 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-[10px] md:text-xs uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#DF3B94]/20 hover:-translate-y-0.5 active:scale-95">
                                {user ? 'Ir al Panel' : 'Comenzar'}
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-14 px-6 bg-white border-b border-slate-100 text-center">
                <div className="mx-auto max-w-3xl space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#DF3B94]">
                        <span>Galería de Plantillas</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-[#222B38]">
                        Elige tu diseño favorito
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 font-normal max-w-xl mx-auto">
                        Explora nuestros estilos interactivos y personaliza tus fotos, música y lista de pases en minutos.
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="sticky top-16 md:top-20 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const isActive = activeCategory === category.id;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryChange(category.id)}
                                    className={`
                                        flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold tracking-wider uppercase
                                        whitespace-nowrap transition-all flex-shrink-0
                                        ${isActive
                                            ? 'border-[#DF3B94] bg-[#DF3B94] text-white shadow-md shadow-[#DF3B94]/20'
                                            : 'border-slate-200 bg-white text-slate-700 hover:border-[#DF3B94] hover:text-[#DF3B94]'
                                        }
                                    `}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{category.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Examples Grid */}
            <section className="py-12 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                            {filteredExamples.length} {filteredExamples.length === 1 ? 'plantilla disponible' : 'plantillas disponibles'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredExamples.map((tpl) => {
                            const categoryInfo = categories.find(c => c.id === tpl.category) || categories[1];

                            return (
                                <Link
                                    key={tpl.id}
                                    to={`/i/${tpl.slug}?t=token-preview`}
                                    className="group"
                                >
                                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-[#DF3B94]/10 transition-all duration-300 relative flex flex-col h-full">
                                        
                                        {/* Thumbnail Area */}
                                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                                            <img 
                                                src={tpl.thumbnail} 
                                                alt={tpl.name} 
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                            
                                            {/* Plan Badge */}
                                            <div className="absolute top-4 right-4 z-10">
                                                <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold bg-slate-900/90 text-[#F5B837] border border-[#F5B837]/30 backdrop-blur-md">
                                                    {tpl.plan}
                                                </span>
                                            </div>

                                            {/* Hover Button */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                                <div className="px-6 py-3 bg-[#DF3B94] text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl">
                                                    Ver Previa <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Footer */}
                                        <div className="p-6 bg-white flex flex-col justify-between flex-grow">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <categoryInfo.icon className="h-3.5 w-3.5 text-[#DF3B94]" />
                                                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                                                        {categoryInfo.name}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-display font-bold text-[#222B38] group-hover:text-[#DF3B94] transition-colors">
                                                    {tpl.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#222B38] text-white pt-16 pb-12 px-6 border-t border-white/10 mt-16">
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
