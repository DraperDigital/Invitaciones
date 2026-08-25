import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Heart, Gem, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Seo from '../components/Seo';

export default function PlanesPage() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const eventId = searchParams.get('id');
    const theme = searchParams.get('theme');
    const plans = [
        {
            id: 'clasico',
            name: 'Clásica',
            price: '$499',
            period: 'MXN',
            description: 'Solo lo básico',
            subcopy: '“Solo quiero mi invitación bonita”',
            icon: Heart,
            color: 'stone',
            features: [
                'Información del evento',
                'Cuenta regresiva',
                'Ubicación con mapa',
                'Galería de fotos',
                'Confirmación simple por WhatsApp',
            ],
            cta: 'Solo mi invitación',
            demoUrl: '/i/bautizo-victoria'
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '$1,699',
            period: 'MXN',
            description: 'Control total de invitados',
            subcopy: '“Ya sé exactamente quién sí va a ir”',
            icon: Gem,
            color: 'rose',
            popular: true,
            features: [
                'Dashboard en tiempo real',
                'Recordatorios automáticos',
                'Control de pases y acompañantes',
                'Importación masiva (Excel)',
                'Métricas de visualización',
                'Todo en un solo lugar',
            ],
            cta: 'Quiero control total',
            demoUrl: '/i/boda-isabel-rodrigo-pro'
        },
        {
            id: 'premium',
            name: 'Diseño Pro',
            price: '$2,499',
            period: 'MXN',
            description: 'Diseño a tu medida',
            subcopy: '“Quiero algo único para mi evento”',
            icon: Crown,
            color: 'emerald',
            features: [
                'Todo lo del plan Pro',
                'Diseño desde cero por expertos',
                'Código QR para invitados',
                'Control de acceso (Check-in)',
                'Dominio personalizado (.com)',
                'Soporte prioritario',
            ],
            cta: 'Diseño a medida',
            demoUrl: '/i/xv-regina-2026-premium'
        },
        {
            id: 'concierge',
            name: 'Concierge',
            price: '$4,499',
            period: 'MXN',
            description: 'Nosotros hacemos todo',
            subcopy: '“Yo no me encargo de nada”',
            icon: Crown,
            color: 'gold',
            features: [
                'Todo lo del plan Diseño Pro',
                'Gestión total de lista de invitados',
                'Envío de invitaciones vía WhatsApp Pro',
                '4 rondas de seguimiento y confirmación',
                'Concierge dedicado para dudas',
                'Reporte final de asistencia',
            ],
            cta: 'Quiero el servicio completo',
            demoUrl: '/i/boda-gabriela-arturo-premium'
        }
    ];

    const productJsonLd = plans.map((plan) => ({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `Plan ${plan.name}`,
        description: plan.description,
        brand: { '@type': 'Brand', name: 'Invitto' },
        offers: {
            '@type': 'Offer',
            price: plan.price.replace(/[^0-9]/g, ''),
            priceCurrency: 'MXN',
            availability: 'https://schema.org/InStock',
            url: `https://invitto.com.mx/checkout?plan=${plan.id}`,
        },
    }));

    return (
        <div className="min-h-screen bg-[#FFFFFF] selection:bg-[#fdf2f8] pb-20 md:pb-32 overflow-x-hidden">
            <Seo
                title="Planes y precios — Invitaciones digitales desde $499 MXN | Invitto"
                description="4 planes diseñados para tu evento: Clásica $499, Pro $1,699, Diseño Pro $2,499 y Concierge $4,499. Un solo pago, sin suscripciones."
                path="/planes"
                jsonLd={productJsonLd}
            />
            {/* Header / Navigation */}
            <header className="pt-4 pb-4 md:pt-6 md:pb-6 sticky top-0 bg-white/85 backdrop-blur-md z-50 border-b border-slate-100 px-4 md:px-8">
                <div className="mx-auto max-w-7xl flex justify-between items-center relative h-12 md:h-auto">
                    {/* Back link */}
                    <Link to="/" className="group flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#e0409a] transition-all">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
                        <span className="hidden xs:inline">Inicio</span>
                    </Link>

                    {/* Center Logo */}
                    <Link to="/" className="absolute left-1/2 -translate-x-1/2 hover:opacity-95 transition-opacity">
                        <img src="/logo.png" alt="Invitto" className="h-8 md:h-10 w-auto object-contain" />
                    </Link>

                    {/* Right CTA */}
                    <div className="flex items-center gap-3 md:gap-6">
                        {user ? (
                            <Link to="/dashboard" className="px-4 py-2.5 md:px-6 md:py-3 bg-[#e0409a] text-white rounded-xl text-[10px] uppercase font-bold tracking-widest shadow-lg shadow-[#e0409a]/20 hover:-translate-y-0.5 transition-all">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-slate-600 hover:text-[#e0409a] transition-colors">Ingresar</Link>
                                <Link to="/login" className="px-4 py-2.5 md:px-6 md:py-3 bg-[#e0409a] text-white rounded-xl text-[10px] uppercase font-bold tracking-widest shadow-lg shadow-[#e0409a]/20 hover:-translate-y-0.5 transition-all">Comenzar</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="text-center space-y-6 md:space-y-8 py-12 md:py-24 px-6 md:px-8 relative overflow-hidden bg-gradient-to-b from-[#fdf2f8]/40 via-white to-[#F8F9FA]">
                <div className="relative z-10 space-y-4 md:space-y-6 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#e0409a]">
                        <span>Precios Transparentes • Un solo pago por evento</span>
                    </div>

                    <h1 className="text-4xl xs:text-5xl md:text-6xl font-display font-extrabold text-[#1E293B] leading-tight tracking-tight">
                        Tu evento merece <br className="hidden xs:block" />
                        <span className="bg-gradient-to-r from-[#e0409a] via-[#FF6B6B] to-[#e0409a] bg-clip-text text-transparent">
                            distinción total.
                        </span>
                    </h1>
                    <p className="text-base md:text-lg text-slate-600 font-normal max-w-xl mx-auto leading-relaxed">
                        Selecciona el nivel de control y personalización que mejor se adapte a tu celebración.
                    </p>
                </div>
            </section>

            {/* Pricing Cards Grid */}
            <section className="px-6 md:px-8 max-w-[1600px] mx-auto mb-24 md:mb-40 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-6 items-stretch">
                    {plans.map((plan) => (
                        <div 
                            key={plan.id} 
                            className={`group relative flex flex-col p-7 md:p-8 rounded-3xl border transition-all duration-300 hover:shadow-xl ${
                                plan.popular 
                                    ? 'bg-slate-900 border-slate-800 text-white shadow-2xl shadow-[#e0409a]/15 md:scale-105 z-20' 
                                    : plan.id === 'concierge'
                                        ? 'bg-white border-[#e0409a]/30 text-[#1E293B] shadow-lg'
                                        : 'bg-white border-slate-100 text-[#1E293B] shadow-sm'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-[#e0409a] text-white text-[10px] uppercase font-bold tracking-widest rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
                                    <Gem className="h-3.5 w-3.5" /> MÁS POPULAR
                                </div>
                            )}

                            <div className="flex-1 space-y-8 md:space-y-10">
                                <div className="flex items-center justify-between">
                                    <div className={`p-3 md:p-4 rounded-2xl ${plan.popular ? 'bg-white/10' : 'bg-[#fdf2f8]'}`}>
                                        <plan.icon className={`h-6 w-6 text-[#e0409a]`} />
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${plan.popular ? 'text-white/40' : 'text-slate-400'}`}>
                                        PLAN {plan.id}
                                    </span>
                                </div>

                                <div className="text-center md:text-left">
                                    <h3 className="text-2xl md:text-3xl font-display font-extrabold mb-1 tracking-tight">{plan.name}</h3>
                                    <p className={`text-xs font-normal opacity-80 ${plan.popular ? 'text-white' : 'text-slate-500'}`}>
                                        {plan.description}
                                    </p>
                                    <p className="text-xs mt-2 font-bold uppercase tracking-wide text-[#e0409a]">
                                        {plan.subcopy}
                                    </p>
                                </div>

                                <div className="text-center md:text-left space-y-1">
                                    <div className="flex items-baseline justify-center md:justify-start gap-1.5 md:gap-2">
                                        <span className="text-4xl md:text-5xl font-serif tracking-tighter">{plan.price}</span>
                                        <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${plan.popular ? 'text-white/40' : 'text-stone-300'}`}>{plan.period}</span>
                                    </div>
                                    <p className={`text-[7px] md:text-[8px] uppercase font-bold tracking-widest ${plan.popular ? 'text-white/20' : 'text-stone-200'}`}>Un solo pago · De por vida</p>
                                </div>

                                <div className={`h-px w-full ${plan.popular ? 'bg-white/10' : 'bg-stone-50'}`} />

                                <ul className="space-y-3 md:space-y-4">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 md:gap-4 text-left">
                                            <div className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 bg-emerald-500`} />
                                            <span className={`text-[12px] md:text-[13px] font-light leading-tight ${
                                                plan.popular ? 'text-white/90' : 'text-stone-600'
                                            }`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8 md:mt-10">
                                <Link to={eventId ? `/checkout?plan=${plan.id}&id=${eventId}` : `/dashboard/new?plan=${plan.id}${theme ? `&theme=${theme}` : ''}`}>
                                    <button className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] uppercase font-bold tracking-[0.2em] md:tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 ${
                                        plan.popular
                                            ? 'bg-white text-[#1B2E1D] hover:bg-stone-100 shadow-2xl'
                                            : 'bg-[#1B2E1D] text-white hover:bg-[#2D312E] shadow-xl'
                                    }`}>
                                        {plan.cta}
                                    </button>
                                </Link>
                                {plan.id === 'concierge' ? (
                                    <div className="mt-4 text-center space-y-3">
                                        <Link 
                                            to="/concierge-service" 
                                            className="block text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#BD7474] hover:text-[#1B2E1D] transition-colors border-b border-[#BD7474]/20 pb-0.5 mx-auto w-fit"
                                        >
                                            Saber más sobre Concierge →
                                        </Link>
                                        <Link 
                                            to={plan.demoUrl} 
                                            className={`block text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-colors mx-auto w-fit ${plan.popular ? 'text-white/60 hover:text-white' : 'text-stone-400 hover:text-[#1B2E1D]'}`}
                                        >
                                            Ver invitación de prueba
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="mt-4 text-center">
                                        <Link 
                                            to={plan.demoUrl} 
                                            className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-colors ${plan.popular ? 'text-white/60 hover:text-white' : 'text-stone-400 hover:text-[#1B2E1D]'}`}
                                        >
                                            Ver invitación de prueba
                                        </Link>
                                    </div>
                                )}
                                <p className={`mt-4 md:mt-5 text-[7px] md:text-[8px] text-center uppercase font-bold tracking-[0.2em] opacity-30 ${plan.popular ? 'text-white' : 'text-stone-400'}`}>
                                    Activación instantánea
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final Statement */}
            <section className="py-16 md:py-24 border-t border-stone-100">
                <div className="max-w-4xl mx-auto px-6 md:px-8 text-center space-y-6 md:space-y-8">
                    <p className="text-stone-400 font-light italic text-lg md:text-2xl leading-relaxed">
                        "La mayoría de eventos se desorganizan porque no saben quién va a ir. <br className="hidden md:block" />
                        <span className="text-[#BD7474] font-semibold not-italic">El plan Pro elimina ese problema por completo.</span>"
                    </p>
                </div>
            </section>
        </div>
    );
}
