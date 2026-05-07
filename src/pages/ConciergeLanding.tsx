import React from 'react';
import { Link } from 'react-router-dom';
import { 
    MessageCircle, 
    ShieldCheck, 
    Users, 
    Sparkles, 
    ArrowRight, 
    CheckCircle2, 
    Clock, 
    Gem,
    ArrowLeft,
    PhoneCall
} from 'lucide-react';

const ConciergeLanding: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0A0C0A] text-white font-sans selection:bg-[#BD7474]/30 overflow-x-hidden">
            {/* Elegant Header */}
            <header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/5 px-8 py-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/planes" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all">
                        <ArrowLeft className="h-4 w-4" /> Volver
                    </Link>
                    <div className="text-2xl font-serif italic tracking-tighter">Invitto <span className="text-[#BD7474]">Concierge</span></div>
                    <div className="hidden md:block h-px w-20 bg-white/10" />
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-8">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[#BD7474]/10 rounded-full blur-[120px] -z-0 opacity-30" />
                
                <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                        <Gem className="h-4 w-4 text-[#BD7474]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Servicio de Guante Blanco</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-serif leading-[1.1] tracking-tight">
                        Tú disfruta tu evento, <br />
                        <span className="italic text-[#BD7474]">nosotros hacemos todo.</span>
                    </h1>
                    
                    <p className="text-xl text-white/50 font-light italic max-w-2xl mx-auto leading-relaxed">
                        El primer servicio de gestión humana para invitaciones digitales. No solo enviamos mensajes; cuidamos a tus invitados como tú lo harías.
                    </p>

                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/checkout?plan=concierge" className="group px-12 py-6 bg-white text-black rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#BD7474] hover:text-white transition-all flex items-center gap-3 shadow-2xl shadow-white/5">
                            Contratar Concierge <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">Inversión única: $4,499 MXN</p>
                    </div>
                </div>
            </section>

            {/* Core Values / Features Grid */}
            <section className="py-32 px-8 border-t border-white/5 bg-gradient-to-b from-transparent to-black/40">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="space-y-6 p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-[#BD7474]/20 transition-all group">
                            <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center text-[#BD7474] group-hover:scale-110 transition-transform">
                                <MessageCircle className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-serif">Envío Personalizado</h3>
                            <p className="text-sm text-white/40 font-light leading-relaxed italic">
                                Olvida copiar y pegar. Nuestro equipo envía cada invitación vía WhatsApp de forma individual, asegurando que llegue con calidez humana.
                            </p>
                        </div>

                        <div className="space-y-6 p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-[#BD7474]/20 transition-all group">
                            <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center text-[#BD7474] group-hover:scale-110 transition-transform">
                                <Clock className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-serif">4 Rondas de Seguimiento</h3>
                            <p className="text-sm text-white/40 font-light leading-relaxed italic">
                                Realizamos seguimiento estratégico a los invitados pendientes para que tengas tu lista confirmada mucho antes de la fecha límite.
                            </p>
                        </div>

                        <div className="space-y-6 p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-[#BD7474]/20 transition-all group">
                            <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center text-[#BD7474] group-hover:scale-110 transition-transform">
                                <PhoneCall className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-serif">Atención a Dudas</h3>
                            <p className="text-sm text-white/40 font-light leading-relaxed italic">
                                ¿Tienen dudas sobre el hotel o el código de vestimenta? Tu concierge dedicado resuelve todo por ti, 24/7.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Experience Section */}
            <section className="py-40 px-8 relative overflow-hidden">
                <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px] -z-0" />
                
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-serif leading-tight">Por qué elegir <br /> el servicio <span className="text-[#BD7474]">Concierge</span></h2>
                            <p className="text-white/40 font-light italic">Diseñado para anfitriones que valoran su tiempo y la excelencia.</p>
                        </div>

                        <ul className="space-y-8">
                            {[
                                { t: "Cero fricción operativa", d: "Nosotros cargamos tu lista de Excel, la depuramos y la gestionamos." },
                                { t: "Diseño 100% Personalizado", d: "Nuestros expertos ajustan cada detalle visual de tu invitación." },
                                { t: "Reporte Final de Asistencia", d: "Recibe un PDF ejecutivo con cada detalle de tus invitados confirmados." },
                                { t: "Gestión de Cambios de Último Minuto", d: "¿Alguien canceló? Nosotros actualizamos tus métricas al instante." }
                            ].map((item, i) => (
                                <li key={i} className="flex gap-6 items-start">
                                    <div className="mt-1 h-6 w-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm uppercase tracking-widest mb-2">{item.t}</h4>
                                        <p className="text-sm text-white/40 font-light italic">{item.d}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-[#BD7474]/20 blur-[60px] group-hover:blur-[80px] transition-all" />
                        <div className="relative p-12 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl">
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-black shadow-xl">
                                        <Sparkles className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BD7474]">Próximo Paso</p>
                                        <h3 className="text-3xl font-serif">Eleva tu evento</h3>
                                    </div>
                                </div>
                                
                                <p className="text-xl font-light italic leading-relaxed text-white/70">
                                    "La diferencia entre un evento bueno y uno inolvidable está en los detalles. Permítenos cuidar de tus invitados mientras tú creas memorias."
                                </p>

                                <div className="space-y-4">
                                    <Link to="/checkout?plan=concierge" className="w-full py-6 bg-[#BD7474] text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#A65B5B] transition-all flex items-center justify-center gap-3">
                                        Contratar ahora <ArrowRight className="h-5 w-5" />
                                    </Link>
                                    <p className="text-center text-[10px] text-white/20 font-bold uppercase tracking-widest">Atención VIP Inmediata tras la compra</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Minimal Footer */}
            <footer className="py-20 px-8 border-t border-white/5 text-center">
                <div className="text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] mb-4">Invitto Luxury Experiences</div>
                <div className="h-px w-20 bg-white/10 mx-auto" />
            </footer>
        </div>
    );
};

export default ConciergeLanding;
