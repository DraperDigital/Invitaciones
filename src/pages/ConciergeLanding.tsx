import React from 'react';
import { Link } from 'react-router-dom';
import {
    MessageCircle,
    Sparkles,
    ArrowRight,
    Clock,
    Gem,
    Check,
    PhoneCall
} from 'lucide-react';
import Seo from '../components/Seo';

const SERVICE_JSONLD = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Concierge para invitaciones digitales',
    provider: { '@type': 'Organization', name: 'Invitto' },
    areaServed: { '@type': 'Country', name: 'México' },
    description: 'Servicio de guante blanco: cargamos tu lista de invitados, enviamos cada invitación por WhatsApp y hacemos 4 rondas de seguimiento hasta la fecha de tu evento.',
    offers: {
        '@type': 'Offer',
        price: '4499',
        priceCurrency: 'MXN',
        availability: 'https://schema.org/InStock',
    },
};

const ConciergeLanding: React.FC = () => {

    return (
        <div className="min-h-screen bg-[#171E28] text-white font-sans selection:bg-[#DF3B94]/30 overflow-x-hidden">
            <Seo
                title="Servicio Concierge — Tu evento sin estrés | Invitto"
                description="Nosotros cargamos tus invitados, enviamos invitaciones por WhatsApp y hacemos seguimiento. Tú disfrutas tu evento. Servicio Concierge $4,499 MXN."
                path="/concierge-service"
                jsonLd={SERVICE_JSONLD}
            />

            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-[#171E28]/85 backdrop-blur-md border-b border-white/10 px-4 md:px-6">
                <div className="mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center hover:opacity-95 transition-opacity">
                        <img src="/logo.png" alt="Invitto" className="h-8 md:h-10 w-auto object-contain brightness-0 invert" />
                    </Link>

                    <nav className="hidden lg:flex items-center gap-8">
                        <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest text-slate-300 hover:text-[#DF3B94] transition-colors">
                            Ejemplos
                        </Link>
                        <Link to="/planes" className="text-xs uppercase font-bold tracking-widest text-slate-300 hover:text-[#DF3B94] transition-colors">
                            Planes
                        </Link>
                        <Link to="/comparativas" className="text-xs uppercase font-bold tracking-widest text-slate-300 hover:text-[#DF3B94] transition-colors">
                            Comparativas
                        </Link>
                        <Link to="/concierge-service" className="text-xs uppercase font-bold tracking-widest text-[#DF3B94]">
                            Concierge
                        </Link>
                        <Link to="/blog" className="text-xs uppercase font-bold tracking-widest text-slate-300 hover:text-[#DF3B94] transition-colors">
                            Blog
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link to="/checkout?plan=concierge">
                            <button className="px-5 py-2.5 md:px-6 md:py-3 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-[10px] md:text-xs uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#DF3B94]/20 hover:-translate-y-0.5 active:scale-95">
                                Contratar Concierge
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 md:pt-44 pb-20 md:pb-32 px-6 overflow-hidden bg-gradient-to-b from-[#222B38] via-[#171E28] to-[#171E28]">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[#DF3B94]/15 rounded-full blur-[140px] pointer-events-none" />
                
                <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                        <Gem className="h-4 w-4 text-[#DF3B94]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[#DF3B94]">Servicio Luxury de Guante Blanco</span>
                    </div>
                    
                    <h1 className="text-4xl xs:text-5xl md:text-7xl font-display font-extrabold text-white leading-tight tracking-tight">
                        Tú disfruta tu evento, <br />
                        <span className="italic font-light text-[#DF3B94]">nosotros hacemos todo.</span>
                    </h1>
                    
                    <p className="text-base md:text-xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
                        El primer servicio de gestión humana para invitaciones digitales en México. Cargamos tu lista, enviamos las invitaciones por WhatsApp y hacemos 4 rondas de seguimiento hasta el día de tu fiesta.
                    </p>

                    <div className="pt-4 flex flex-col items-center justify-center gap-4">
                        <Link to="/checkout?plan=concierge" className="w-full xs:w-auto px-10 md:px-12 py-5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-full font-bold text-xs md:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl shadow-[#DF3B94]/30 active:scale-95">
                            CONTRATAR CONCIERGE <ArrowRight className="h-5 w-5" />
                        </Link>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs text-slate-400 font-semibold">
                            <span>Inversión única:</span>
                            <span className="text-[#F5B837] font-bold">$4,499 MXN</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values / Features Grid */}
            <section className="py-20 md:py-32 px-6 border-t border-white/5 bg-[#171E28]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#DF3B94]">Atención Personalizada</span>
                        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">¿Qué incluye el plan Concierge?</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-5 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#DF3B94]/40 transition-all group flex flex-col justify-between">
                            <div>
                                <div className="h-14 w-14 rounded-2xl bg-[#DF3B94]/15 text-[#DF3B94] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <MessageCircle className="h-7 w-7" />
                                </div>
                                <h3 className="text-2xl font-display font-bold text-white mb-3">Envío Personalizado</h3>
                                <p className="text-sm text-slate-300 font-normal leading-relaxed">
                                    Olvida copiar y pegar enlaces. Nuestro equipo envía cada invitación vía WhatsApp de forma individual, asegurando una atención cercana y elegante.
                                </p>
                            </div>
                            <div className="pt-6 border-t border-white/10 text-xs font-bold text-[#DF3B94]">
                                Vía WhatsApp Directo →
                            </div>
                        </div>

                        <div className="space-y-5 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#DF3B94]/40 transition-all group flex flex-col justify-between">
                            <div>
                                <div className="h-14 w-14 rounded-2xl bg-[#F5B837]/15 text-[#F5B837] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Clock className="h-7 w-7" />
                                </div>
                                <h3 className="text-2xl font-display font-bold text-white mb-3">4 Rondas de Seguimiento</h3>
                                <p className="text-sm text-slate-300 font-normal leading-relaxed">
                                    Realizamos seguimiento estratégico a los invitados pendientes para entregarte tu lista final de pases confirmados con semanas de anticipación.
                                </p>
                            </div>
                            <div className="pt-6 border-t border-white/10 text-xs font-bold text-[#F5B837]">
                                Seguimiento Programado →
                            </div>
                        </div>

                        <div className="space-y-5 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#DF3B94]/40 transition-all group flex flex-col justify-between">
                            <div>
                                <div className="h-14 w-14 rounded-2xl bg-emerald-500/15 text-[#4E7B55] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <PhoneCall className="h-7 w-7" />
                                </div>
                                <h3 className="text-2xl font-display font-bold text-white mb-3">Atención a Dudas</h3>
                                <p className="text-sm text-slate-300 font-normal leading-relaxed">
                                    ¿Tienen dudas sobre el hotel o el dress code? Tu concierge dedicado resuelve todas las preguntas de tus invitados por ti.
                                </p>
                            </div>
                            <div className="pt-6 border-t border-white/10 text-xs font-bold text-[#4E7B55]">
                                Soporte Humano Directo →
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Experience Section */}
            <section className="py-24 md:py-36 px-6 bg-[#222B38] border-t border-white/10">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white leading-tight">
                                Por qué elegir el servicio <span className="text-[#DF3B94]">Concierge</span>
                            </h2>
                            <p className="text-slate-300 text-base font-normal">Diseñado para anfitriones que valoran su tiempo y exigen excelencia.</p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6 text-left">
                            {[
                                { t: "Cero fricción operativa", d: "Nosotros cargamos tu lista de Excel, la depuramos y gestionamos los pases." },
                                { t: "Diseño 100% Personalizado", d: "Nuestros expertos ajustan cada detalle gráfico de tu invitación." },
                                { t: "Reporte Final de Asistencia", d: "Recibe un reporte ejecutivo completo en Excel / PDF con tus confirmados." },
                                { t: "Gestión de Cambios", d: "¿Alguien canceló a última hora? Actualizamos tus métricas en tiempo real." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-2">
                                    <div className="flex items-center gap-2 text-[#DF3B94]">
                                        <Check className="h-4 w-4" />
                                        <h4 className="font-bold text-sm text-white">{item.t}</h4>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed font-normal">{item.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="p-8 md:p-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl space-y-8 shadow-2xl">
                            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                                <div className="h-14 w-14 rounded-2xl bg-[#DF3B94]/15 text-[#DF3B94] flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#DF3B94]">PRÓXIMO PASO</p>
                                    <h3 className="text-2xl font-display font-bold text-white">Eleva tu evento</h3>
                                </div>
                            </div>
                            
                            <p className="text-sm md:text-base font-normal italic leading-relaxed text-slate-300 text-center">
                                "La diferencia entre un evento improvisado y uno memorable está en la atención a tus invitados."
                            </p>

                            <div className="space-y-3">
                                <Link to="/checkout?plan=concierge" className="w-full py-4 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#DF3B94]/20 active:scale-95">
                                    Contratar Concierge <ArrowRight className="h-4 w-4" />
                                </Link>
                                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">Atención VIP Inmediata tras la compra</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#171E28] text-white pt-16 pb-12 px-6 border-t border-white/10">
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
};

export default ConciergeLanding;
