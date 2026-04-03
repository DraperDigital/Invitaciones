import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Sparkles, Crown, X } from 'lucide-react';

export default function PlanesPage() {
    const plans = [
        {
            id: 'clasico',
            name: 'Clásico',
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
                'Galería básica',
                'Confirmación simple por WhatsApp',
            ],
            friction: [
                'No sabes realmente quién va a ir',
                'Tienes que escribirle a cada invitado',
                'Todo sigue desorganizado en WhatsApp'
            ],
            cta: 'Solo quiero mi invitación',
        },
        {
            id: 'premium',
            name: 'Premium',
            price: '$1,699',
            period: 'MXN',
            description: 'Control total de tus invitados',
            subcopy: '“Ya sé exactamente quién sí va a ir”',
            icon: Crown,
            color: 'rose',
            popular: true,
            features: [
                'Ves en tiempo real quién confirmó',
                'Dejas de perseguir gente por WhatsApp',
                'Confirmaciones automáticas sin esfuerzo',
                'Control de invitados y acompañantes',
                'Recordatorios automáticos',
                'Importa tu lista desde Excel',
                'Todo organizado en un solo lugar',
            ],
            cta: 'Quiero saber quién sí va a ir',
        },
        {
            id: 'pro',
            name: 'Personalizado',
            price: '$2,999+',
            period: 'MXN',
            description: 'Nosotros lo hacemos por ti',
            subcopy: '“Yo no me encargo de nada”',
            icon: Sparkles,
            color: 'emerald',
            features: [
                'Todo lo del plan Premium',
                'Configuración completa por nuestro equipo',
                'Invitaciones con código QR',
                'Control de acceso en tu evento',
                'Dominio personalizado',
                'Soporte dedicado',
            ],
            cta: 'Quiero que lo hagan por mí',
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
                        <Link to="/login" className="text-[10px] uppercase font-bold tracking-[0.3em] text-stone-400 hover:text-[#1B2E1D] transition-colors">Ingresar</Link>
                        <Link to="/login" className="px-6 py-3 bg-[#1B2E1D] text-white rounded-xl text-[10px] uppercase font-bold tracking-[0.2em] shadow-lg hover:scale-105 transition-all">Comenzar</Link>
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
            <section className="px-8 max-w-7xl mx-auto mb-40">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
                    {plans.map((plan) => (
                        <div 
                            key={plan.id} 
                            className={`group relative flex flex-col p-12 rounded-[3.5rem] border transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] ${
                                plan.popular 
                                    ? 'bg-[#1B2E1D] border-stone-800 text-white shadow-2xl scale-105 z-20 xl:scale-110' 
                                    : 'bg-white border-stone-100 text-[#1B2E1D]'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-8 py-3 bg-[#BD7474] text-white text-[10px] uppercase font-black tracking-[0.3em] rounded-full shadow-2xl flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" /> MÁS POPULAR
                                </div>
                            )}

                            <div className="flex-1 space-y-12">
                                <div className="flex items-center justify-between">
                                    <div className={`p-5 rounded-2xl ${plan.popular ? 'bg-white/10' : 'bg-[#FDFBF7]'}`}>
                                        <plan.icon className={`h-8 w-8 ${plan.popular ? 'text-[#BD7474]' : 'text-[#BD7474]'}`} />
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-[0.4em] ${plan.popular ? 'text-white/20' : 'text-stone-200'}`}>
                                        PLAN {plan.id}
                                    </span>
                                </div>

                                <div className="text-center lg:text-left">
                                    <h3 className="text-4xl font-serif mb-2 tracking-tight">{plan.name}</h3>
                                    <p className={`text-sm italic font-light opacity-70 ${plan.popular ? 'text-white' : 'text-stone-400'}`}>
                                        {plan.description}
                                    </p>
                                    <p className={`text-[11px] mt-3 italic font-medium uppercase tracking-tighter ${plan.popular ? 'text-[#BD7474]' : 'text-[#BD7474]'}`}>
                                        {plan.subcopy}
                                    </p>
                                </div>

                                <div className="text-center lg:text-left space-y-1">
                                    <div className="flex items-baseline justify-center lg:justify-start gap-2">
                                        <span className="text-6xl font-serif tracking-tighter">{plan.price}</span>
                                        <span className={`text-[11px] font-bold uppercase tracking-widest ${plan.popular ? 'text-white/40' : 'text-stone-300'}`}>{plan.period}</span>
                                    </div>
                                    <p className={`text-[9px] uppercase font-bold tracking-widest ${plan.popular ? 'text-white/20' : 'text-stone-200'}`}>Un solo pago · De por vida</p>
                                </div>

                                <div className={`h-px w-full ${plan.popular ? 'bg-white/10' : 'bg-stone-50'}`} />

                                <ul className="space-y-6">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-4 text-left">
                                            <div className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 bg-emerald-500`} />
                                            <span className={`text-[14px] font-light leading-tight ${
                                                plan.popular ? 'text-white/90' : 'text-stone-600'
                                            }`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                    {plan.friction?.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-4 text-left opacity-60">
                                            <div className="mt-1 flex-shrink-0">
                                                <X className="h-3 w-3 text-rose-500" />
                                            </div>
                                            <span className={`text-[14px] font-light leading-tight ${
                                                plan.popular ? 'text-white/40' : 'text-stone-400'
                                            }`}>
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-16">
                                <Link to={`/checkout?plan=${plan.id}`}>
                                    <button className={`w-full py-6 rounded-2xl text-[10px] uppercase font-bold tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 ${
                                        plan.popular 
                                            ? 'bg-white text-[#1B2E1D] hover:bg-stone-100 shadow-2xl' 
                                            : 'bg-[#1B2E1D] text-white hover:bg-[#2D312E] shadow-xl'
                                    }`}>
                                        {plan.cta}
                                    </button>
                                </Link>
                                <p className={`mt-6 text-[9px] text-center uppercase font-bold tracking-[0.2em] opacity-30 ${plan.popular ? 'text-white' : 'text-stone-400'}`}>
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
                        <span className="text-[#BD7474] font-semibold not-italic">Premium elimina ese problema por completo.</span>"
                    </p>
                </div>
            </section>
        </div>
    );
}
