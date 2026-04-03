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
        if (activeCategory === 'todas') {
            return MOCK_EVENTS.filter(event => event.is_published);
        }
        return MOCK_EVENTS.filter(
            event => event.is_published && event.event_type.toLowerCase().includes(activeCategory)
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
                            const categoryInfo = categories.find(c =>
                                event.event_type.toLowerCase().includes(c.id)
                            ) || categories[0];

                            return (
                                <Link
                                    key={event.id}
                                    to={`/i/${event.slug}?t=token-preview`}
                                    className="group"
                                >
                                    <div className="bg-white border-2 border-stone-200 rounded-2xl overflow-hidden hover:border-accent hover:shadow-xl transition-all">
                                        {/* Preview - Themed gradient by event type */}
                                        {(() => {
                                            const gradients: Record<string, string> = {
                                                wedding: 'from-stone-100 via-amber-50 to-stone-200',
                                                xv: 'from-pink-50 via-rose-100 to-pink-200',
                                                birthday: 'from-sky-50 via-blue-100 to-indigo-100',
                                                bautizo: 'from-cyan-50 via-teal-100 to-cyan-200',
                                                graduacion: 'from-violet-50 via-purple-100 to-violet-200',
                                                comunion: 'from-stone-50 via-slate-100 to-stone-200',
                                            };
                                            const gradient = gradients[event.event_type] || 'from-stone-50 via-stone-100 to-stone-200';
                                            const Icon = categoryInfo.icon;
                                            return (
                                                <div className={`aspect-[3/4] bg-gradient-to-br ${gradient} flex flex-col items-center justify-center relative overflow-hidden`}>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <Icon className={`h-14 w-14 mb-4 ${categoryInfo.color} opacity-60`} />
                                                    <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                                                        {event.event_type}
                                                    </p>
                                                </div>
                                            );
                                        })()}

                                        {/* Card Content */}
                                        <div className="p-4">
                                            <div className="mb-2">
                                                <span className="inline-block px-2 py-1 rounded-full bg-accent-light/20 text-accent text-xs font-medium">
                                                    {event.event_type}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-stone-900 mb-1 group-hover:text-accent transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-sm text-stone-500 mb-3">
                                                {new Date(event.date_time).toLocaleDateString('es-MX', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <div className="text-accent text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                                Ver ejemplo
                                                <span>→</span>
                                            </div>
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
