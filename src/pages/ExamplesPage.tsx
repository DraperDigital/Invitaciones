import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, PartyPopper, GraduationCap, Cake, Baby, Church, Sparkles } from 'lucide-react';
import { MOCK_EVENTS } from '../lib/mockData';

const categories = [
    { id: 'todas', name: 'Todas', icon: Sparkles, color: 'text-accent' },
    { id: 'boda', name: 'Bodas', icon: HeartHandshake, color: 'text-accent' },
    { id: 'xv', name: 'XV Años', icon: PartyPopper, color: 'text-pink-500' },
    { id: 'cumpleanos', name: 'Cumpleaños', icon: Cake, color: 'text-blue-500' },
    { id: 'bautizo', name: 'Bautizos', icon: Baby, color: 'text-cyan-500' },
    { id: 'graduacion', name: 'Graduaciones', icon: GraduationCap, color: 'text-purple-500' },
    { id: 'comunion', name: 'Primera Comunión', icon: Church, color: 'text-stone-600' },
];

export default function ExamplesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get('category') || 'todas';
    const [activeCategory, setActiveCategory] = useState(categoryParam);
    const { user } = useAuth();

    const filteredExamples = useMemo(() => {
        const SHOWCASE_SLUGS = [
            'boda-isabel-rodrigo', 
            'boda-gabriela-arturo-premium', 
            'xv-regina-2026-premium', 
            'cumple-miguel-40', 
            'bautizo-victoria', 
            'graduacion-ana-psicologia-premium',
            'comunion-gael-premium'
        ];
        const SHOWCASE_EVENTS = MOCK_EVENTS.filter(e => SHOWCASE_SLUGS.includes(e.slug));

        if (activeCategory === 'todas') {
            return SHOWCASE_EVENTS.filter(event => event.is_published);
        }
        
        const mapCategoryToEventType = (cat: string) => {
            switch (cat) {
                case 'boda': return 'wedding';
                case 'cumpleanos': return 'birthday';
                default: return cat;
            }
        };
        
        const targetType = mapCategoryToEventType(activeCategory);
        
        return SHOWCASE_EVENTS.filter(
            event => event.is_published && event.event_type.toLowerCase() === targetType
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
        <div className="min-h-screen bg-[#FDFBF7]">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-[#1B2E1D]/5">
                <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-serif italic tracking-tighter hover:text-stone-600 transition-colors">
                        Invitto
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest text-[#BD7474]">
                            Ejemplos
                        </Link>
                        <Link to="/planes" className="text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">
                            Planes
                        </Link>
                    </nav>
                    <div className="flex items-center gap-6">
                        {user ? (
                            <Link to="/dashboard">
                                <button className="px-6 py-3 bg-[#1B2E1D] text-white rounded-xl text-xs uppercase font-bold tracking-widest hover:bg-[#2D312E] transition-all shadow-lg shadow-[#1B2E1D]/10">
                                    Ir al Panel
                                </button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">
                                    Ingresar
                                </Link>
                                <Link to="/login">
                                    <button className="px-6 py-3 bg-[#1B2E1D] text-white rounded-xl text-xs uppercase font-bold tracking-widest hover:bg-[#2D312E] transition-all shadow-lg shadow-[#1B2E1D]/10">
                                        Comenzar
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-36 pb-16 px-4 bg-[#FDFBF7]">
                <div className="mx-auto max-w-7xl text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-stone-900 mb-4">
                        Elige tu plantilla
                    </h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        Selecciona una plantilla y personalízala después
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="sticky top-20 z-40 bg-[#FDFBF7] border-b border-[#1B2E1D]/5 py-4 px-4">
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
                                        flex items-center gap-2 px-5 py-2.5 rounded-full border-2
                                        whitespace-nowrap transition-all flex-shrink-0
                                        ${isActive
                                            ? 'border-accent bg-accent text-white'
                                            : 'border-stone-200 bg-white text-stone-700 hover:border-accent hover:text-accent'
                                        }
                                    `}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="text-sm font-medium">{category.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Examples Grid */}
            <section className="py-12 px-4">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6">
                        <p className="text-stone-600 text-sm">
                            {filteredExamples.length} {filteredExamples.length === 1 ? 'plantilla' : 'plantillas'} disponibles
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredExamples.map((event) => {
                            const eventTypeToCategory: Record<string, string> = {
                                wedding: 'boda', xv: 'xv', birthday: 'cumpleanos',
                                bautizo: 'bautizo', graduacion: 'graduacion', comunion: 'comunion'
                            };
                            const catId = eventTypeToCategory[event.event_type] || 'todas';
                            const categoryInfo = categories.find(c => c.id === catId) || categories[1];

                            return (
                                <Link
                                    key={event.id}
                                    to={`/i/${event.slug}?t=token-preview`}
                                    className="group"
                                >
                                    <div className="bg-white border border-stone-200 rounded-[2rem] overflow-hidden hover:border-stone-300 hover:shadow-2xl transition-all duration-500 relative flex flex-col h-full">
                                        
                                        {/* Thumbnail Area */}
                                        {(() => {
                                            const thumbnails: Record<string, string[]> = {
                                                wedding: [
                                                    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
                                                    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
                                                    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop'
                                                ],
                                                xv: [
                                                    'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop',
                                                    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop'
                                                ],
                                                birthday: [
                                                    'https://images.unsplash.com/photo-1530103862676-de8892bf30b5?q=80&w=800&auto=format&fit=crop',
                                                    'https://images.unsplash.com/photo-1513271239644-245c61eb6e60?q=80&w=800&auto=format&fit=crop'
                                                ],
                                                bautizo: [
                                                    'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop'
                                                ],
                                                graduacion: [
                                                    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop'
                                                ],
                                                comunion: [
                                                    'https://images.unsplash.com/photo-1438032005730-c7aedb098c71?q=80&w=800&auto=format&fit=crop'
                                                ],
                                            };
                                            const typeThumbnails = thumbnails[event.event_type] || thumbnails.wedding;
                                            const hash = event.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                                            const thumbnailUrl = event.theme_config?.thumbnail_url || typeThumbnails[hash % typeThumbnails.length];
                                            
                                            const isPremium = event.theme_config?.isPremium || event.slug?.endsWith('-premium');
                                            const isPro = event.theme_config?.isPro || event.slug?.endsWith('-pro');
                                            const planLabel = isPremium ? 'Premium' : isPro ? 'Pro' : 'Clásica';
                                            const planColor = isPremium ? 'bg-stone-900/80 text-amber-300 border border-amber-300/30' : isPro ? 'bg-stone-900/80 text-white border border-stone-600/50' : 'bg-white/80 text-stone-700 border border-stone-200/50';

                                            return (
                                                <div className="relative aspect-[3/4] w-full overflow-hidden">
                                                    <img 
                                                        src={thumbnailUrl} 
                                                        alt={event.title} 
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    
                                                    {/* Gradient Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                                    
                                                    {/* Plan Badge */}
                                                    <div className="absolute top-4 right-4 z-10">
                                                        <span className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold backdrop-blur-md shadow-lg ${planColor}`}>
                                                            {planLabel}
                                                        </span>
                                                    </div>

                                                    {/* Hover "Ver Ejemplo" Button */}
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                                                        <div className="px-6 py-3 bg-white/90 backdrop-blur-md text-stone-900 rounded-full font-serif text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl border border-white/50">
                                                            <Sparkles className="h-4 w-4 text-accent" />
                                                            Ver Plantilla
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* Card Content Footer */}
                                        <div className="p-6 bg-white flex flex-col flex-grow relative z-30">
                                            <div className="flex items-center gap-2 mb-3">
                                                <categoryInfo.icon className={`h-4 w-4 ${categoryInfo.color}`} />
                                                <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">
                                                    {categoryInfo.name}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-serif text-stone-900 mb-2 line-clamp-1 group-hover:text-accent transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-sm text-stone-400 mt-auto">
                                                Diseño Exclusivo Invitto
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {filteredExamples.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-stone-500 text-lg">
                                No hay plantillas disponibles en esta categoría
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-gradient-to-br from-accent-light/10 via-white to-accent/10">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-4">
                        ¿Listo para crear tu invitación?
                    </h2>
                    <p className="text-stone-600 mb-8">
                        Personaliza cualquier plantilla en minutos
                    </p>
                    <Link to="/login">
                        <button className="btn-premium px-8 py-4 rounded-full text-white font-sans font-semibold text-base uppercase tracking-wider">
                            Comenzar ahora
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
