import React from 'react';
import { Link } from 'react-router-dom';
import {
    MessageCircle,
    Sparkles,
    ArrowRight,
    CheckCircle2,
    Clock,
    Gem,
    ArrowLeft,
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
        <div className="min-h-screen bg-[#0A0C0A] text-white font-sans selection:bg-[#BD7474]/30 overflow-x-hidden">
            <Seo
                title="Servicio Concierge — Tu evento sin estrés"
                description="Nosotros cargamos tus invitados, enviamos invitaciones por WhatsApp y hacemos seguimiento. Tú disfrutas tu evento. Servicio Concierge $4,499 MXN."
                path="/concierge-service"
                jsonLd={SERVICE_JSONLD}
            />
            {/* Elegant Header */}
            <header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/5 px-6 md:px-8 py-4 md:py-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/planes" className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/40 hover:text-white transition-all">
                        <ArrowLeft className="h-4 w-4" /> <span className="hidden xs:inline">Volver</span>
                    </Link>
                    <div className="text-xl md:text-2xl font-serif italic tracking-tighter">Invitto <span className="text-[#BD7474]">Concierge</span></div>
                    <div className="hidden md:block h-px w-20 bg-white/10" />
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 px-6 md:px-8">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[#BD7474]/10 rounded-full blur-[80px] md:blur-[120px] -z-0 opacity-30" />
                
                <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-10 relative z-10">
                    <div className="inline-flex items-center gap-3 px-5 md:px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                        <Gem className="h-3.5 w-3.5 text-[#BD7474]" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Servicio de Guante Blanco</span>
                    </div>
                    
                    <h1 className="text-4xl xs:text-5xl md:text-8xl font-serif leading-[1.1] tracking-tight">
                        Tú disfruta tu evento, <br />
                        <span className="italic text-[#BD7474]">nosotros hacemos todo.</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-white/50 font-light italic max-w-2xl mx-auto leading-relaxed">
                        El primer servicio de gestión humana para invitaciones digitales. No solo enviamos mensajes; cuidamos a tus invitados como tú lo harías.
                    </p>

                    <div className="pt-4 md:pt-6 flex flex-col items-center justify-center gap-5 md:gap-6">
                        <Link to="/checkout?plan=concierge" className="group w-full xs:w-auto px-10 md:px-12 py-5 md:py-6 bg-white text-black rounded-full font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-[#BD7474] hover:text-white transition-all flex items-center justify-center gap-3 shadow-2xl shadow-white/5">
                            Contratar Concierge <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <p className="text-[9px] md:text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">Inversión única: $4,499 MXN</p>
                    </div>
                </div>
            </section>

            {/* Core Values / Features Grid */}
            <section className="py-20 md:py-32 px-6 md:px-8 border-t border-white/5 bg-gradient-to-b from-transparent to-black/40">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        <div className="space-y-5 md:space-y-6 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-[#BD7474]/20 transition-all group">
                            <div className="h-12 w-12 md:h-14 md:w-14 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-[#BD7474] group-hover:scale-110 transition-transform">
                                <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-serif">Envío Personalizado</h3>
                            <p className="text-xs md:text-sm text-white/40 font-light leading-relaxed italic">
                                Olvida copiar y pegar. Nuestro equipo envía cada invitación vía WhatsApp de forma individual, asegurando que llegue con calidez humana.
                            </p>
                        </div>

                        <div className="space-y-5 md:space-y-6 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-[#BD7474]/20 transition-all group">
                            <div className="h-12 w-12 md:h-14 md:w-14 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-[#BD7474] group-hover:scale-110 transition-transform">
                                <Clock className="h-6 w-6 md:h-7 md:w-7" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-serif">4 Rondas de Seguimiento</h3>
                            <p className="text-xs md:text-sm text-white/40 font-light leading-relaxed italic">
                                Realizamos seguimiento estratégico a los invitados pendientes para que tengas tu lista confirmada mucho antes de la fecha límite.
                            </p>
                        </div>

                        <div className="space-y-5 md:space-y-6 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-[#BD7474]/20 transition-all group">
                            <div className="h-12 w-12 md:h-14 md:w-14 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-[#BD7474] group-hover:scale-110 transition-transform">
                                <PhoneCall className="h-6 w-6 md:h-7 md:w-7" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-serif">Atención a Dudas</h3>
                            <p className="text-xs md:text-sm text-white/40 font-light leading-relaxed italic">
                                ¿Tienen dudas sobre el hotel o el código de vestimenta? Tu concierge dedicado resuelve todo por ti, 24/7.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Experience Section */}
            <section className="py-24 md:py-40 px-6 md:px-8 relative overflow-hidden">
                <div className="absolute right-0 top-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-white/5 rounded-full blur-[80px] md:blur-[150px] -z-0" />
                
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
                    <div className="space-y-10 md:space-y-12 text-center lg:text-left">
                        <div className="space-y-4">
                            <h2 className="text-3xl xs:text-4xl md:text-5xl font-serif leading-tight">Por qué elegir <br className="hidden md:block" /> el servicio <span className="text-[#BD7474]">Concierge</span></h2>
                            <p className="text-white/40 font-light italic text-xs md:text-base">Diseñado para anfitriones que valoran su tiempo y la excelencia.</p>
                        </div>

                        <ul className="space-y-6 md:space-y-8 max-w-lg mx-auto lg:mx-0">
                            {[
                                { t: "Cero fricción operativa", d: "Nosotros cargamos tu lista de Excel, la depuramos y la gestionamos." },
                                { t: "Diseño 100% Personalizado", d: "Nuestros expertos ajustan cada detalle visual de tu invitación." },
                                { t: "Reporte Final de Asistencia", d: "Recibe un PDF ejecutivo con cada detalle de tus invitados confirmados." },
                                { t: "Gestión de Cambios de Último Minuto", d: "¿Alguien canceló? Nosotros actualizamos tus métricas al instante." }
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4 md:gap-6 items-start text-left group">
                                    <div className="mt-1 h-6 w-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[10px] md:text-sm uppercase tracking-widest mb-1 md:mb-2">{item.t}</h4>
                                        <p className="text-[11px] md:text-sm text-white/40 font-light italic leading-relaxed">{item.d}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative group w-full max-w-md mx-auto">
                        <div className="absolute inset-0 bg-[#BD7474]/20 blur-[50px] md:blur-[80px] group-hover:blur-[100px] transition-all" />
                        <div className="relative p-7 md:p-12 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[3rem] backdrop-blur-xl">
                            <div className="space-y-6 md:space-y-8">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-6 md:pb-8">
                                    <div className="h-12 w-12 md:h-16 md:w-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-black shadow-xl">
                                        <Sparkles className="h-6 w-6 md:h-8 md:w-8" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#BD7474]">Próximo Paso</p>
                                        <h3 className="text-xl md:text-3xl font-serif">Eleva tu evento</h3>
                                    </div>
                                </div>
                                
                                <p className="text-base md:text-xl font-light italic leading-relaxed text-white/70 text-center">
                                    "La diferencia entre un evento bueno y uno inolvidable está en los detalles. Permítenos cuidar de tus invitados."
                                </p>

                                <div className="space-y-4">
                                    <Link to="/checkout?plan=concierge" className="w-full py-5 md:py-6 bg-[#BD7474] text-white rounded-full font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-[#A65B5B] transition-all flex items-center justify-center gap-3 shadow-xl shadow-rose-900/20">
                                        Contratar ahora <ArrowRight className="h-5 w-5" />
                                    </Link>
                                    <p className="text-center text-[8px] md:text-[9px] text-white/20 font-bold uppercase tracking-widest px-4 leading-loose">Atención VIP Inmediata tras la compra</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Minimal Footer */}
            <footer className="py-12 md:py-20 px-6 md:px-8 border-t border-white/5 text-center">
                <div className="text-white/10 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4">Invitto Luxury Experiences</div>
                <div className="h-px w-12 md:w-20 bg-white/5 mx-auto" />
            </footer>
        </div>
    );
};

export default ConciergeLanding;
