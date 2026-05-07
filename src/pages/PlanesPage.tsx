import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Sparkles, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PlanesPage() {
    const { user } = useAuth();
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
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '$1,699',
            period: 'MXN',
            description: 'Control total de invitados',
            subcopy: '“Ya sé exactamente quién sí va a ir”',
            icon: Sparkles,
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
        }
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] selection:bg-[#BD7474]/10 pb-32">
            {/* Header / Navigation */}
            <header className="pt-12 pb-20 sticky top-0 bg-[#FDFBF7]/80 backdrop-blur-md z-50 border-b border-stone-100">
                <div className="mx-auto max-w-7xl px-8 flex justify-between items-center">
                    <Link to="/" className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 hover:text-[#1B2E1D] transition-all">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Inicio
                    </Link>
                    <Link to="/" className="text-4xl font-serif italic tracking-tighter text-[#1B2E1D] absolute left-1/2 -translate-x-1/2">
                        Invitto
                    </Link>
                    <div className="flex items-center gap-8">
                        {user ? (
                            <Link to="/dashboard" className="px-6 py-3 bg-[#1B2E1D] text-white rounded-xl text-[10px] uppercase font-bold tracking-[0.2em] shadow-lg hover:scale-105 transition-all">
                                Panel de Control
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-[10px] uppercase font-bold tracking-[0.3em] text-stone-400 hover:text-[#1B2E1D] transition-colors">Ingresar</Link>
                                <Link to="/login" className="px-6 py-3 bg-[#1B2E1D] text-white rounded-xl text-[10px] uppercase font-bold tracking-[0.2em] shadow-lg hover:scale-105 transition-all">Comenzar</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="text-center space-y-8 py-32 px-8 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#BD7474]/5 rounded-full blur-[120px] -z-0" />
                <div className="relative z-10 space-y-6">
                    <span className="inline-block px-5 py-2 bg-[#BD7474]/10 text-[#BD7474] text-[9px] uppercase font-bold tracking-[0.5em] rounded-full">
                        Inversiones con Propósito
                    </span>
                    <h1 className="text-6xl md:text-8xl font-serif text-[#1B2E1D] leading-[0.9] tracking-tighter">
                        Tu evento merece <br />
                        <span className="italic font-light opacity-30 text-stone-400">distinción total.</span>
                    </h1>
                    <p className="text-xl text-stone-400 font-light italic max-w-2xl mx-auto">
                        Selecciona el nivel de control y personalización que <br className="hidden md:block" /> mejor se adapte a tu celebración.
                    </p>
                </div>
            </section>

            {/* Pricing Cards Grid */}
            <section className="px-8 max-w-[1600px] mx-auto mb-40">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
                    {plans.map((plan) => (
                        <div 
                            key={plan.id} 
                            className={`group relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] ${
                                plan.popular 
                                    ? 'bg-[#1B2E1D] border-stone-800 text-white shadow-2xl scale-105 z-20' 
                                    : plan.id === 'concierge'
                                        ? 'bg-[#FDFBF7] border-[#BD7474]/20 text-[#1B2E1D] shadow-xl'
                                        : 'bg-white border-stone-100 text-[#1B2E1D]'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-8 py-3 bg-[#BD7474] text-white text-[10px] uppercase font-black tracking-[0.3em] rounded-full shadow-2xl flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" /> MÁS POPULAR
                                </div>
                            )}

                            <div className="flex-1 space-y-10">
                                <div className="flex items-center justify-between">
                                    <div className={`p-4 rounded-2xl ${plan.popular ? 'bg-white/10' : 'bg-stone-50'}`}>
                                        <plan.icon className={`h-6 w-6 ${plan.id === 'concierge' ? 'text-[#BD7474]' : 'text-[#BD7474]'}`} />
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-[0.4em] ${plan.popular ? 'text-white/20' : 'text-stone-200'}`}>
                                        PLAN {plan.id}
                                    </span>
                                </div>

                                <div className="text-center lg:text-left">
                                    <h3 className="text-3xl font-serif mb-2 tracking-tight">{plan.name}</h3>
                                    <p className={`text-xs italic font-light opacity-70 ${plan.popular ? 'text-white' : 'text-stone-400'}`}>
                                        {plan.description}
                                    </p>
                                    <p className={`text-[10px] mt-2 italic font-medium uppercase tracking-tighter ${plan.popular ? 'text-[#BD7474]' : 'text-[#BD7474]'}`}>
                                        {plan.subcopy}
                                    </p>
                                </div>

                                <div className="text-center lg:text-left space-y-1">
                                    <div className="flex items-baseline justify-center lg:justify-start gap-2">
                                        <span className="text-5xl font-serif tracking-tighter">{plan.price}</span>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${plan.popular ? 'text-white/40' : 'text-stone-300'}`}>{plan.period}</span>
                                    </div>
                                    <p className={`text-[8px] uppercase font-bold tracking-widest ${plan.popular ? 'text-white/20' : 'text-stone-200'}`}>Un solo pago · De por vida</p>
                                </div>

                                <div className={`h-px w-full ${plan.popular ? 'bg-white/10' : 'bg-stone-50'}`} />

                                <ul className="space-y-4">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-4 text-left">
                                            <div className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 bg-emerald-500`} />
                                            <span className={`text-[13px] font-light leading-tight ${
                                                plan.popular ? 'text-white/90' : 'text-stone-600'
                                            }`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-10">
                                <Link to={`/checkout?plan=${plan.id}`}>
                                    <button className={`w-full py-5 rounded-2xl text-[10px] uppercase font-bold tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 ${
                                        plan.popular 
                                            ? 'bg-white text-[#1B2E1D] hover:bg-stone-100 shadow-2xl' 
                                            : 'bg-[#1B2E1D] text-white hover:bg-[#2D312E] shadow-xl'
                                    }`}>
                                        {plan.cta}
                                    </button>
                                </Link>
                                {plan.id === 'concierge' && (
                                    <div className="mt-4 text-center">
                                        <Link 
                                            to="/concierge-service" 
                                            className="text-[10px] font-bold uppercase tracking-widest text-[#BD7474] hover:text-[#1B2E1D] transition-colors border-b border-[#BD7474]/20 pb-0.5"
                                        >
                                            Saber más sobre Concierge →
                                        </Link>
                                    </div>
                                )}
                                <p className={`mt-5 text-[8px] text-center uppercase font-bold tracking-[0.2em] opacity-30 ${plan.popular ? 'text-white' : 'text-stone-400'}`}>
                                    Activación instantánea
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final Statement */}
            <section className="py-24 border-t border-stone-100">
                <div className="max-w-4xl mx-auto px-8 text-center space-y-8">
                    <p className="text-stone-400 font-light italic text-2xl leading-relaxed">
                        "La mayoría de eventos se desorganizan porque no saben quién va a ir. <br />
                        <span className="text-[#BD7474] font-semibold not-italic">El plan Pro elimina ese problema por completo.</span>"
                    </p>
                </div>
            </section>
        </div>
    );
}
