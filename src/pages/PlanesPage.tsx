import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Heart, Gem, Crown, ArrowDown, Wallet, Store, ListChecks, CalendarHeart, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Seo from '../components/Seo';
import PlanComparisonTable from '../components/PlanComparisonTable';
import { trackEvent } from '../lib/analytics';
import { getTemplateRequiredPlan, isProOnlyTemplate } from '../lib/themePresets';

export default function PlanesPage() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const eventId = searchParams.get('id');
    const theme = searchParams.get('theme');
    const planParam = searchParams.get('plan');
    const tipo = searchParams.get('tipo') || searchParams.get('type') || searchParams.get('category');

    const [eventTheme, setEventTheme] = useState<string | null>(theme);

    useEffect(() => {
        if (!eventId || theme) return;
        supabase.from('events').select('theme_config').eq('id', eventId).single().then(({ data }) => {
            if (data?.theme_config?.theme) {
                setEventTheme(data.theme_config.theme);
            }
        });
    }, [eventId, theme]);

    const requiredPlan = planParam || (eventTheme ? getTemplateRequiredPlan(eventTheme) : null);
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
                'Save the Date digital (+$299 opcional)',
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
                'Planeador de Eventos (presupuesto, proveedores y Día B)',
                'Dashboard en tiempo real',
                'Pases digitales con código QR',
                'Recordatorios automáticos',
                'Control de pases y acompañantes',
                'Importación masiva (Excel)',
                'Métricas de visualización',
                'Save the Date digital (+$299 opcional)',
            ],
            cta: 'Quiero control total',
            demoUrl: '/i/boda-isabel-rodrigo-pro'
        },
        {
            id: 'premium',
            name: 'Premium',
            price: '$2,499',
            period: 'MXN',
            description: 'Diseño a tu medida',
            subcopy: '“Quiero algo único para mi evento”',
            icon: Crown,
            color: 'emerald',
            features: [
                'Todo lo del plan Pro (incluye Planeador)',
                'Diseño desde cero por expertos',
                'Save the Date digital incluido',
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
            subcopy: '“Premium + Invitto Confirma”',
            icon: Crown,
            color: 'gold',
            features: [
                'Todo lo del plan Premium (incluye Planeador)',
                'Incluye Invitto Confirma: confirmamos a cada invitado por ti',
                'Save the Date digital incluido',
                'Lista final confirmada 15 días antes, o te devolvemos tu dinero',
                'Cargamos y depuramos tu lista de invitados',
                'Línea de atención para dudas de tus invitados',
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
                description="4 planes diseñados para tu evento: Clásica $499, Pro $1,699, Premium $2,499 y Concierge $4,499. Un solo pago, sin suscripciones."
                path="/planes"
                jsonLd={productJsonLd}
            />
            {/* Header / Navigation */}
            <header className="pt-4 pb-4 md:pt-6 md:pb-6 sticky top-0 bg-white z-50 border-b border-slate-100 px-4 md:px-8">
                <div className="mx-auto max-w-7xl flex justify-between items-center relative h-12 md:h-auto">
                    {/* Back link */}
                    <Link to="/" className="group flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#e0409a] transition-all">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
                        <span className="hidden xs:inline">Inicio</span>
                    </Link>

                    {/* Center Logo */}
                    <Link to="/" className="absolute left-1/2 -translate-x-1/2 hover:opacity-95 transition-opacity">
                        <img src="/logo.png?v=3" alt="Invitto" className="h-8 md:h-10 w-auto object-contain" />
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
                        Deja de perseguir invitados.<br className="hidden xs:block" />
                        <span className="bg-gradient-to-r from-[#e0409a] via-[#FF6B6B] to-[#e0409a] bg-clip-text text-transparent">
                            Ten el control de tu evento.
                        </span>
                    </h1>
                    <p className="text-base md:text-lg text-slate-600 font-normal max-w-xl mx-auto leading-relaxed">
                        Tus invitados confirman con un clic. Tú ves en tiempo real quién va, quién no y cuántos acompañantes traen. Un solo pago, sin mensualidades.
                    </p>
                </div>
            </section>

            {/* Pricing Cards Grid */}
            <section className="px-6 md:px-8 max-w-[1600px] mx-auto mb-24 md:mb-40 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 max-w-[1600px] mx-auto gap-8 md:gap-6 items-stretch">
                    {plans.map((plan) => {
                        const isPreselectedByTemplate = requiredPlan === plan.id;
                        const blockedByTemplate = plan.id === 'clasico' && !!eventTheme && isProOnlyTemplate(eventTheme);
                        return (
                        <div 
                            key={plan.id} 
                            className={`group relative flex flex-col p-7 md:p-8 rounded-3xl border transition-all duration-300 hover:shadow-xl ${
                                isPreselectedByTemplate
                                    ? 'bg-slate-900 border-[#DF3B94] text-white shadow-2xl shadow-[#DF3B94]/25 ring-2 ring-[#DF3B94] md:scale-105 z-30'
                                    : plan.popular 
                                        ? 'bg-slate-900 border-slate-800 text-white shadow-2xl shadow-[#e0409a]/15 md:scale-105 z-20' 
                                        : plan.id === 'concierge'
                                            ? 'bg-white border-[#e0409a]/30 text-[#1E293B] shadow-lg'
                                            : 'bg-white border-slate-100 text-[#1E293B] shadow-sm'
                            }`}
                        >
                            {isPreselectedByTemplate ? (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 bg-gradient-to-r from-[#DF3B94] to-pink-600 text-white text-[10px] uppercase font-black tracking-widest rounded-full shadow-lg flex items-center whitespace-nowrap">
                                    Esta plantilla es del plan {plan.name}
                                </div>
                            ) : plan.popular && (
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
                                    <p className={`text-[10px] md:text-[11px] font-medium tracking-wide ${plan.popular ? 'text-white/80' : 'text-stone-500'}`}>Un solo pago · Activa hasta 30 días después de tu evento</p>
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
                                {blockedByTemplate ? (
                                    <p className="w-full min-h-[44px] py-4 px-3 rounded-xl md:rounded-2xl text-[10px] font-bold uppercase tracking-[0.15em] text-center bg-stone-100 text-stone-500">
                                        Tu plantilla con efectos animados requiere plan Pro o superior
                                    </p>
                                ) : (
                                <Link 
                                    to={eventId ? `/checkout?plan=${plan.id}&id=${eventId}` : `/dashboard/new?plan=${plan.id}${theme ? `&theme=${theme}` : ''}${tipo ? `&tipo=${tipo}` : ''}`}
                                    onClick={() => {
                                        trackEvent('select_item', {
                                            item_id: plan.id,
                                            item_name: `Plan ${plan.name}`,
                                            price: parseInt(plan.price.replace(/\D/g, '') || '0', 10),
                                            currency: 'MXN'
                                        });
                                    }}
                                    className={`w-full min-h-[44px] py-4 md:py-5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] uppercase font-bold tracking-[0.2em] md:tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center text-center no-underline ${
                                        plan.popular
                                            ? 'bg-white text-[#1B2E1D] hover:bg-stone-100 shadow-2xl'
                                            : 'bg-[#1B2E1D] text-white hover:bg-[#2D312E] shadow-xl'
                                    }`}
                                >
                                    {plan.cta}
                                </Link>
                                )}
                                {plan.id === 'concierge' ? (
                                    <div className="mt-4 text-center space-y-2">
                                        <Link 
                                            to="/planes/concierge" 
                                            className="block text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#e0409a] hover:text-[#C52A7C] transition-colors border-b border-[#e0409a]/20 pb-0.5 mx-auto w-fit"
                                        >
                                            Saber más sobre Plan Concierge →
                                        </Link>
                                        <Link 
                                            to={plan.demoUrl} 
                                            className="block text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-[#1B2E1D] transition-colors mx-auto w-fit"
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
                    ); })}
                </div>

                {/* Banner Invitto Confirma */}
                <div className="mt-12 md:mt-16 max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-[#fdf2f8] via-white to-[#fdf2f8] border-2 border-[#DF3B94]/30 p-6 sm:p-8 md:p-10 shadow-xl shadow-[#DF3B94]/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF3B94]/5 rounded-bl-full pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                        <div className="text-center md:text-left space-y-2 flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DF3B94]/10 border border-[#DF3B94]/20 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#DF3B94]">
                                <span>Servicio de Confirmación Humana</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[#1E293B] tracking-tight">
                                ¿Solo necesitas que confirmemos a tus invitados?
                            </h3>
                            <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
                                <strong>Invitto Confirma</strong>: confirmamos a tus invitados por ti. Se suma a cualquier plan, desde $3,499. ¿Quieres que también diseñemos tu invitación? Eso es el <strong>plan Concierge</strong>.
                            </p>
                        </div>
                        <div className="shrink-0 w-full md:w-auto">
                            <Link
                                to="/concierge-service"
                                className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 rounded-2xl bg-[#DF3B94] hover:bg-[#C52A7C] text-white text-xs md:text-sm font-bold uppercase tracking-widest transition-all shadow-lg shadow-[#DF3B94]/30 hover:scale-[1.02] active:scale-95 text-center"
                            >
                                Conocer Invitto Confirma →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quick Link to Detailed Comparison */}
                <div className="mt-12 text-center">
                    <a 
                        href="#comparativa" 
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-100 hover:bg-[#fdf2f8] border border-stone-200 hover:border-[#fbcfe8] text-stone-600 hover:text-[#e0409a] text-xs font-bold uppercase tracking-wider transition-all shadow-sm group"
                    >
                        <span>Ver comparativa detallada de funciones</span>
                        <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                    </a>
                </div>
            </section>

            {/* SECCIÓN PLANEADOR DE EVENTOS (PRO, PREMIUM & CONCIERGE) */}
            <section id="planeador" className="py-16 md:py-24 bg-[#111827] text-white px-6 relative overflow-hidden border-t border-b border-stone-800">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#DF3B94]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#FAC345]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="mx-auto max-w-7xl relative z-10">
                    <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#FAC345]">
                            <Crown className="h-3.5 w-3.5" />
                            <span>Herramienta Incluida</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
                            Planeador de Eventos: Presupuesto, Proveedores y Día B
                        </h2>
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal">
                            Tu evento no solo necesita una invitación hermosa, necesita orden. Centraliza pagos, cotizaciones, contratos y el itinerario minuto a minuto directamente dentro de tu panel de Invitto.
                        </p>
                        
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300">
                            <span className="h-2 w-2 rounded-full bg-[#FAC345]" />
                            <span><strong>Incluido en:</strong> Plan Pro ($1,699 MXN), Premium y Concierge. <em>(No disponible en Clásica).</em></span>
                        </div>
                    </div>

                    {/* 4 Pillars Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="h-12 w-12 rounded-2xl bg-[#DF3B94]/20 border border-[#DF3B94]/30 flex items-center justify-center text-[#FF85C0]">
                                    <Wallet className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-display font-extrabold text-white">Presupuesto y Pagos</h3>
                                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                    Desglosa rubros (salón, música, foto). Monitorea anticipos y fechas límite con alertas automáticas.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-[#FAC345] flex items-center justify-between">
                                <span>Control de saldos</span>
                                <span>Exporta a CSV</span>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                    <Store className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-display font-extrabold text-white">Directorio de Proveedores</h3>
                                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                    Fichas de cada proveedor con contacto directo a WhatsApp, cotizaciones comparativas y contratos.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-emerald-400 flex items-center justify-between">
                                <span>WhatsApp directo</span>
                                <span>Compara ofertas</span>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                    <ListChecks className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-display font-extrabold text-white">Pendientes por Fases</h3>
                                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                    Checklist cronológico calculado según la fecha de tu evento: 12 meses, 6 meses, 1 mes y última semana.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-amber-400 flex items-center justify-between">
                                <span>Cronograma vivo</span>
                                <span>Avance en %</span>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="h-12 w-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                                    <CalendarHeart className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-display font-extrabold text-white">Carpeta Día B en PDF</h3>
                                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                    Genera en 1 clic el itinerario minuto a minuto con cortejo, teléfonos clave y detalles para tu wedding planner.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-purple-400 flex items-center justify-between">
                                <span>Descarga PDF</span>
                                <span>Minuto a minuto</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="space-y-0.5 text-center md:text-left">
                            <p className="text-base font-bold text-white">¿Quieres organizar tu evento sin estrés?</p>
                            <p className="text-xs text-slate-400">Elige Plan Pro al crear tu evento y desbloquea el Planeador de inmediato.</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <Link
                                to={user ? "/dashboard/new?plan=pro" : "/dashboard/new?plan=pro"}
                                className="min-h-[44px] px-6 py-3 bg-[#DF3B94] hover:bg-[#C2287B] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 no-underline"
                            >
                                <span>Elegir Plan Pro ($1,699)</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                to="/dashboard/planeacion/demo"
                                className="min-h-[44px] px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center no-underline"
                            >
                                <span>Ver Demo Planeador</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Comparison Table Section */}
            <section id="comparativa" className="border-t border-stone-200/80 bg-gradient-to-b from-stone-50/50 via-white to-stone-50/30">
                <PlanComparisonTable eventId={eventId} theme={theme} tipo={tipo} />
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
