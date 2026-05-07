import { Link } from 'react-router-dom';
import { 
    UserCheck, BarChart3, Heart, Shield, Sparkles, PartyPopper, 
    Check, Smartphone, Bell, MessageSquare, Star, ChevronDown, ArrowRight,
    Layout, X, Zap, Music, Timer, AlertTriangle, Clock, Users, Gem
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const { user } = useAuth();

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1B2E1D]">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-[#1B2E1D]/5">
                <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-serif italic tracking-tighter hover:text-stone-600 transition-colors">
                        Invitto
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">
                            Ejemplos
                        </Link>
                        <Link to="/planes" className="text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">
                            Planes
                        </Link>
                    </nav>
                    <div className="flex items-center gap-8">
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

            {/* --- HERO SECTION --- */}
            <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                    <img src="/images/cecilia_botanical_flower.png" alt="" className="w-full h-full object-contain rotate-12" />
                </div>
                
                <div className="mx-auto max-w-7xl px-6 text-center lg:text-left">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B2E1D]/5 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#1B2E1D]">
                                <Sparkles className="h-4 w-4 text-[#BD7474]" />
                                <span>Control Total de tus Invitados</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight tracking-tight">
                                Deja de perseguir invitados.<br />
                                <span className="italic text-[#BD7474]">Ten el control de tu evento</span><br />
                                desde el primer día.
                            </h1>
                            <p className="text-xl text-stone-500 font-light leading-relaxed max-w-xl mt-6">
                                Invitaciones digitales con confirmación automática, seguimiento en tiempo real y recordatorios inteligentes.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <Link to={user ? "/dashboard" : "/login"} className="w-full sm:w-auto">
                                    <button className="w-full px-10 py-5 bg-[#1B2E1D] text-white rounded-2xl text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-[#2D312E] transition-all transform active:scale-95 shadow-xl shadow-[#1B2E1D]/20 flex items-center justify-center gap-3">
                                        {user ? 'IR AL PANEL' : 'CREAR MI INVITACIÓN'} <ArrowRight className="h-4 w-4" />
                                    </button>
                                </Link>
                                <Link to="/i/cecilia-70" className="text-[10px] uppercase font-bold tracking-widest text-[#1B2E1D] hover:text-[#BD7474] flex items-center gap-2 group transition-all">
                                    VER EJEMPLO <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            {/* Main Phone Mockup */}
                            <div className="relative z-10 mx-auto max-w-[320px] lg:max-w-md aspect-[4/5] bg-stone-200 rounded-[3rem] overflow-hidden border-8 border-[#1B2E1D] shadow-2xl">
                                <img src="/images/cecilia_roses_hero.png" className="w-full h-full object-cover" alt="Phone Mockup" />
                                {/* Darker gradient for better text contrast */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2E1D]/80 via-[#1B2E1D]/20 to-transparent" />
                                
                                <div className="absolute bottom-10 left-0 w-full px-10 text-white z-20">
                                    <p className="font-serif italic text-4xl mb-1 drop-shadow-sm">Cecilia Cardona</p>
                                    <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#BD7474]">Mis 70 Primaveras</p>
                                    
                                    {/* Added Time Range "Inicio y Fin" */}
                                    <div className="flex items-center gap-2 mt-4 text-white/90 bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg w-fit border border-white/10">
                                        <Clock className="h-3 w-3 text-[#BD7474]" />
                                        <p className="text-[9px] font-bold tracking-widest uppercase">01 Mayo | 14:30 a 21:00 hrs</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Cards - Re-positioned to avoid cutting off */}
                            <div className="absolute top-1/2 -right-4 lg:-right-8 -translate-y-1/2 hidden xl:block p-6 bg-white rounded-2xl shadow-2xl border border-stone-100 max-w-[240px] animate-bounce-slow z-30">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#1B2E1D]">Nuevo Invitado</span>
                                </div>
                                <p className="text-sm font-bold text-[#1B2E1D] mb-1">Roberto Nieto</p>
                                <p className="text-[10px] text-stone-500 font-medium italic">Confirmó con +2 acompañantes</p>
                            </div>

                            {/* Second Floating Notification */}
                            <div className="absolute top-[80%] -left-8 hidden lg:block p-4 bg-white rounded-xl shadow-xl border border-stone-100 animate-float z-30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#BD7474]/10 rounded-lg">
                                        <Users className="h-4 w-4 text-[#BD7474]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-[#1B2E1D]">Mesa Asignada</p>
                                        <p className="text-[10px] text-stone-400">Mesa 12 • 4 pax</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PROBLEMA SECTION --- */}
            <section className="py-24 bg-white border-y border-[#1B2E1D]/5">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-serif mb-10">Organizar invitados no debería ser un caos</h2>
                    <div className="grid md:grid-cols-2 gap-12 text-left items-center">
                        <div className="space-y-6">
                            <p className="text-stone-500 font-light leading-relaxed">
                                Mensajes por WhatsApp, listas en Excel, gente que no confirma, cambios de último momento…
                            </p>
                            <p className="text-xl font-medium text-[#BD7474] italic">
                                Al final, no sabes quién va a ir realmente a tu evento.
                            </p>
                            <p className="text-lg font-light text-[#1B2E1D]">
                                <strong>Invitto</strong> soluciona todo eso en un solo lugar.
                            </p>
                        </div>
                        <div className="bg-[#FDFBF7] p-8 rounded-3xl space-y-4 border border-stone-100">
                             {[
                                "WhatsApp saturado",
                                "Listas de Excel obsoletas",
                                "Llamadas de gente que no confirma",
                                "Estrés de último momento"
                             ].map((err, i) => (
                                <div key={i} className="flex items-center gap-4 text-stone-300">
                                    <X className="h-5 w-5 text-red-300" />
                                    <span className="text-sm font-light italic">{err}</span>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PROPUESTA DE VALOR --- */}
            <section className="py-32 bg-[#FDFBF7]">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-5xl font-serif">Todo lo que necesitas para tener control total</h2>
                        <div className="h-1 w-20 bg-[#BD7474] mx-auto" />
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {[
                            { title: 'Sabe exactamente quién va a ir', desc: 'Visualiza confirmaciones en tiempo real. Sin perseguir a nadie por WhatsApp.', icon: BarChart3, color: 'text-emerald-500' },
                            { title: 'Lista en tiempo real', desc: 'Cada confirmación llega al instante a tu panel, organizada y sin duplicados.', icon: MessageSquare, color: 'text-blue-500' },
                            { title: 'Confirmaciones automáticas', desc: 'Tus invitados confirman con un clic. Sin llamadas, sin mensajes, sin estrés.', icon: UserCheck, color: 'text-purple-500' },
                            { title: 'Recordatorios automáticos', desc: 'El sistema avisa a tus invitados antes del evento. Tú no escribes nada.', icon: Layout, color: 'text-[#BD7474]' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                                <div className={`h-14 w-14 rounded-2xl bg-stone-50 flex items-center justify-center mb-8 ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon className="h-7 w-7" />
                                </div>
                                <p className="text-lg font-medium leading-normal mb-3">{item.title}</p>
                                <p className="text-sm text-stone-400 font-light leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- COMO FUNCIONA --- */}
            <section className="py-24 bg-[#1B2E1D] text-white overflow-hidden relative">
                <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-[#BD7474]/10 rounded-full blur-[120px]" />
                <div className="mx-auto max-w-5xl px-6 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-serif text-center mb-20">Así de fácil funciona Invitto</h2>
                    
                    <div className="grid md:grid-cols-4 gap-16 relative">
                         {/* Connector Lines */}
                         <div className="hidden md:block absolute top-[2.75rem] left-0 w-full h-[1px] bg-white/10 z-0" />
                         
                         {[
                            { title: 'Crea tu invitación en minutos', step: '01' },
                            { title: 'Comparte el link', step: '02' },
                            { title: 'Ellos confirman automáticamente', step: '03' },
                            { title: 'Tú ves todo organizado', step: '04' }
                         ].map((item, i) => (
                            <div key={i} className="text-center space-y-8 relative z-10 group">
                                <div className="h-20 w-20 rounded-full bg-[#FDFBF7] text-[#1B2E1D] flex items-center justify-center font-bold text-xl mx-auto ring-8 ring-white/5 group-hover:bg-[#BD7474] group-hover:text-white transition-all duration-500">
                                    {item.step}
                                </div>
                                <p className="text-sm uppercase tracking-widest font-bold opacity-80">{item.title}</p>
                            </div>
                         ))}
                    </div>

                    <div className="mt-24 text-center">
                        <p className="text-lg md:text-xl font-light italic text-[#BD7474] mb-8">“Sin Excel, sin estrés, sin perseguir a nadie”</p>
                        <Link to={user ? "/dashboard" : "/login"}>
                            <button className="px-12 py-5 bg-white text-[#1B2E1D] rounded-2xl text-xs uppercase font-bold tracking-[0.3em] hover:bg-[#BD7474] hover:text-white transition-all shadow-2xl">
                                {user ? 'IR A MI PANEL' : 'CREAR MI INVITACIÓN AHORA'}
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- CONCIERGE PREVIEW SECTION --- */}
            <section className="py-32 bg-[#0A0C0A] text-white relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[#BD7474]/5 rounded-full blur-[120px] -z-0 opacity-40" />
                
                <div className="mx-auto max-w-5xl px-6 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                            <Gem className="h-4 w-4 text-[#BD7474]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Servicio Luxury</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif leading-tight">
                            ¿No tienes tiempo? <br />
                            <span className="italic text-[#BD7474]">Nosotros lo hacemos todo.</span>
                        </h2>
                        <p className="text-lg text-white/40 font-light italic leading-relaxed">
                            Descubre el plan Concierge: gestión humana de tus invitados, envíos personalizados por WhatsApp y seguimiento profesional. Tú solo disfruta tu fiesta.
                        </p>
                        <Link to="/concierge-service" className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-white hover:text-[#BD7474] transition-colors group">
                            SABER MÁS SOBRE CONCIERGE <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl space-y-6">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <div className="h-12 w-12 bg-[#BD7474]/20 rounded-xl flex items-center justify-center text-[#BD7474]">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#BD7474]">Gestión Humana</p>
                                    <p className="text-sm font-serif italic">Tu equipo dedicado</p>
                                </div>
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed font-light italic">
                                "Mi concierge se encargó de cargar mis 300 invitados de un PDF, depuró la lista y me avisó cuando el 90% ya había confirmado. La mejor inversión de mi boda."
                            </p>
                            <div className="pt-4 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-white/10" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">— Sofía R., Novia Invitto</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- VISUAL SECTION --- */}
            <section className="py-32 bg-[#FDFBF7]">
                <div className="mx-auto max-w-7xl px-6 items-center grid lg:grid-cols-2 gap-20">
                    <div className="space-y-8">
                        <h2 className="text-5xl font-serif leading-tight">Así verán tus invitados tu invitación</h2>
                        <p className="text-xl text-stone-400 font-light leading-relaxed">
                            Una experiencia simple, elegante y fácil de usar desde cualquier celular. Sin aplicaciones que descargar, solo un clic y listo.
                        </p>
                        <ul className="space-y-4">
                            {['Botón de confirmación', 'Flujo simple'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                                    <Check className="h-5 w-5 text-[#BD7474]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative">
                        <div className="h-[600px] w-full bg-stone-100 rounded-[3rem] border border-stone-200 shadow-inner overflow-hidden flex items-center justify-center">
                            <Smartphone className="h-20 w-20 text-stone-200" />
                            <div className="absolute inset-0 p-8">
                                <div className="h-full w-full bg-white rounded-3xl shadow-2xl p-0 overflow-hidden relative border border-stone-100">
                                    <img src="/images/cecilia_roses_hero.png" className="w-full h-1/2 object-cover" alt="Previsualización" loading="lazy" />
                                    <div className="p-8 text-center space-y-4">
                                        <p className="font-serif italic text-2xl">Bienvenido al Evento</p>
                                        <button className="w-full py-4 bg-[#BD7474] text-white rounded-xl text-[10px] uppercase font-bold tracking-widest">Confirmar Asistencia</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- BENEFICIOS REALES --- */}
            <section className="py-32 bg-white">
                <div className="mx-auto max-w-7xl px-6">
                    <h2 className="text-4xl md:text-6xl font-serif text-center mb-24">Tu evento, bajo control total</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { title: 'Lista en tiempo real', icon: Bell, bg: 'bg-[#FDFBF7]' },
                            { title: 'Confirmaciones automáticas', icon: Zap, bg: 'bg-[#1B2E1D] text-white' },
                            { title: 'Recordatorios fáciles', icon: Timer, bg: 'bg-[#FDFBF7]' },
                            { title: 'Todo organizado', icon: Shield, bg: 'bg-[#FDFBF7]' },
                            { title: 'Evita cancelaciones sorpresa', icon: AlertTriangle, bg: 'bg-[#FDFBF7]' },
                            { title: 'Toma decisiones con datos reales', icon: BarChart3, bg: 'bg-[#1B2E1D] text-white' }
                        ].map((item, i) => (
                            <div key={i} className={`p-12 rounded-[3.5rem] flex flex-col items-center text-center space-y-8 ${item.bg}`}>
                                <div className="h-16 w-16 rounded-2xl bg-[#BD7474]/10 flex items-center justify-center">
                                    <item.icon className="h-8 w-8 text-[#BD7474]" />
                                </div>
                                <h3 className="text-lg font-bold uppercase tracking-widest leading-tight">{item.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CASOS DE USO --- */}
            <section className="py-24 bg-[#FDFBF7]">
                <div className="mx-auto max-w-7xl px-6">
                    <h2 className="text-5xl font-serif text-center mb-20 text-stone-400 opacity-50 uppercase tracking-[0.2em] text-sm font-bold">Para eventos con control total</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { name: 'Bodas', icon: Heart },
                            { name: 'XV años', icon: PartyPopper },
                            { name: 'Fiestas grandes', icon: Music },
                            { name: 'Eventos especiales', icon: Star }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-6 group cursor-default">
                                <div className="h-28 w-28 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-[#BD7474] group-hover:bg-[#BD7474]/5 transition-all transition-transform">
                                    <item.icon className="h-10 w-10 text-stone-300 group-hover:text-[#BD7474]" />
                                </div>
                                <span className="font-serif italic text-2xl">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- PRICING SECTION --- */}
            <section className="py-32 bg-white">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center mb-20 space-y-6">
                        <h2 className="text-5xl font-serif">Elige tu plan</h2>
                        <p className="text-xl text-stone-400 font-light italic">Paga una sola vez y organiza tu evento sin estrés.</p>
                        <div className="h-1 w-20 bg-[#BD7474] mx-auto" />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto items-stretch">
                        {/* Plan Clásico */}
                        <div className="p-8 rounded-[2.5rem] border border-stone-100 bg-[#FDFBF7] flex flex-col items-center text-center hover:shadow-xl transition-all">
                             <h4 className="text-2xl font-serif mb-2">Clásica</h4>
                             <p className="text-[9px] uppercase font-bold tracking-widest text-stone-400 mb-8">SOLO LO BÁSICO</p>
                             <div className="text-4xl font-serif mb-6 text-[#1B2E1D]">$499</div>
                             <p className="text-[10px] font-medium text-stone-500 italic mb-10 w-full pb-6 border-b border-stone-200 uppercase tracking-tighter">“Solo quiero mi invitación bonita”</p>
                             
                             <ul className="space-y-3 mb-10 text-[13px] text-stone-400 font-light text-left w-full">
                                {[
                                    'Información del evento',
                                    'Cuenta regresiva',
                                    'Ubicación con mapa',
                                    'Galería de fotos',
                                    'Confirmación por WhatsApp'
                                ].map((f, i) => (
                                    <li key={i} className="flex gap-3 items-center">
                                        <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /> <span>{f}</span>
                                    </li>
                                ))}
                             </ul>

                             <div className="mt-auto w-full">
                                 <Link to={user ? "/dashboard" : "/login"} className="w-full">
                                    <button className="w-full py-4 bg-[#1B2E1D] text-white rounded-xl text-[9px] uppercase font-bold tracking-[0.2em] hover:bg-[#2D312E] transition-all">Solo mi invitación</button>
                                 </Link>
                             </div>
                        </div>

                        {/* Plan Pro - DESTACADO */}
                        <div className="p-8 rounded-[2.5rem] bg-[#1B2E1D] text-white flex flex-col items-center text-center relative shadow-2xl scale-105 z-10 border-4 border-[#BD7474]/20">
                             <div className="absolute -top-5 bg-[#BD7474] text-white px-6 py-1.5 rounded-full text-[9px] uppercase font-black tracking-widest flex items-center gap-2 shadow-lg">
                                <Sparkles className="h-3 w-3" /> POPULAR
                             </div>
                             <h4 className="text-2xl font-serif mb-2">Pro</h4>
                             <p className="text-[9px] uppercase font-bold tracking-widest text-[#BD7474] mb-8">CONTROL TOTAL</p>
                             <div className="text-5xl font-serif mb-6">$1,699</div>
                             <p className="text-[10px] font-medium text-[#BD7474] italic mb-10 w-full pb-6 border-b border-[#2D312E] uppercase tracking-tighter">“Ya sé quién sí va a ir”</p>
                             
                             <ul className="space-y-3 mb-10 text-[13px] text-stone-300 font-light text-left w-full">
                                {[
                                    'Confirmaciones en tiempo real',
                                    'Recordatorios automáticos',
                                    'Control de pases y acompañantes',
                                    'Métricas de visualización',
                                    'Importación masiva (Excel)'
                                ].map((f, i) => (
                                    <li key={i} className="flex gap-3 items-center">
                                        <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" /> <span>{f}</span>
                                    </li>
                                ))}
                             </ul>
                             <div className="mt-auto w-full">
                                 <Link to={user ? "/dashboard" : "/login"} className="w-full">
                                    <button className="w-full py-4 bg-white text-[#1B2E1D] rounded-xl text-[9px] uppercase font-black tracking-[0.2em] hover:bg-stone-100 transition-all">Quiero control total</button>
                                 </Link>
                             </div>
                        </div>

                        {/* Plan Diseño Pro */}
                        <div className="p-8 rounded-[2.5rem] border border-stone-100 bg-[#FDFBF7] flex flex-col items-center text-center hover:shadow-xl transition-all">
                             <h4 className="text-2xl font-serif mb-2">Diseño Pro</h4>
                             <p className="text-[9px] uppercase font-bold tracking-widest text-stone-400 mb-8">ÚNICO Y A MEDIDA</p>
                             <div className="text-4xl font-serif mb-6 text-[#1B2E1D]">$2,499</div>
                             <p className="text-[10px] font-medium text-stone-500 italic mb-10 w-full pb-6 border-b border-stone-200 uppercase tracking-tighter">“Quiero algo personalizado”</p>
                             
                             <ul className="space-y-3 mb-10 text-[13px] text-stone-400 font-light text-left w-full">
                                {[
                                    'Diseño desde cero por expertos',
                                    'Código QR para invitados',
                                    'Control de acceso (Check-in)',
                                    'Dominio personalizado (.com)',
                                    'Soporte prioritario'
                                ].map((f, i) => (
                                    <li key={i} className="flex gap-3 items-center">
                                        <Check className="h-3.5 w-3.5 text-[#BD7474] flex-shrink-0" /> <span>{f}</span>
                                    </li>
                                ))}
                             </ul>
                             <div className="mt-auto w-full">
                                 <Link to={user ? "/dashboard" : "/login"} className="w-full">
                                    <button className="w-full py-4 bg-[#1B2E1D] text-white rounded-xl text-[9px] uppercase font-bold tracking-[0.2em] hover:bg-[#2D312E] transition-all">Diseño a medida</button>
                                 </Link>
                             </div>
                        </div>

                        {/* Plan Concierge */}
                        <div className="p-8 rounded-[2.5rem] border border-[#BD7474]/20 bg-white flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition-all">
                             <h4 className="text-2xl font-serif mb-2 text-[#1B2E1D]">Concierge</h4>
                             <p className="text-[9px] uppercase font-black tracking-[0.2em] text-[#BD7474] mb-8">NOSOTROS HACEMOS TODO</p>
                             <div className="text-4xl font-serif mb-6 text-[#1B2E1D]">$4,499</div>
                             <p className="text-[10px] font-medium text-[#BD7474] italic mb-10 w-full pb-6 border-b border-[#BD7474]/10 uppercase tracking-tighter">“Yo no me encargo de nada”</p>
                             
                             <ul className="space-y-3 mb-10 text-[13px] text-stone-600 font-light text-left w-full">
                                {[
                                    'Gestión total de lista',
                                    'Envío masivo WhatsApp Pro',
                                    '4 rondas de seguimiento',
                                    'Concierge dedicado 24/7',
                                    'Reporte final de asistencia'
                                ].map((f, i) => (
                                    <li key={i} className="flex gap-3 items-center">
                                        <Check className="h-3.5 w-3.5 text-[#BD7474] flex-shrink-0" /> <span className="font-medium">{f}</span>
                                    </li>
                                ))}
                             </ul>
                             <div className="mt-auto w-full space-y-4">
                                 <Link to={user ? "/dashboard" : "/login"} className="w-full">
                                    <button className="w-full py-4 bg-[#BD7474] text-white rounded-xl text-[9px] uppercase font-black tracking-[0.2em] shadow-lg shadow-[#BD7474]/20 hover:scale-[1.02] transition-all">Servicio Completo</button>
                                 </Link>
                                 <Link to="/concierge-service" className="block text-[8px] uppercase font-black tracking-widest text-stone-300 hover:text-[#BD7474] transition-colors">Saber más →</Link>
                             </div>
                        </div>
                    </div>

                    {/* LÍNEA DE CIERRE */}
                    <div className="mt-20 text-center max-w-2xl mx-auto">
                        <p className="text-stone-400 font-light italic text-lg leading-relaxed px-10">
                            "La mayoría de eventos se desorganizan porque no saben quién va a ir. <span className="text-[#BD7474] font-semibold not-italic">El plan Pro elimina ese problema por completo.</span>"
                        </p>
                    </div>
                </div>
            </section>

            {/* --- PROCESO --- */}
            <section className="py-24 bg-[#1B2E1D] text-white text-center">
                <div className="mx-auto max-w-5xl px-6">
                    <h2 className="text-4xl font-serif mb-20">¿Cómo empezar?</h2>
                    <div className="grid md:grid-cols-3 gap-20">
                        {[
                            { title: 'Elige tu diseño', desc: 'Explora nuestros estilos exclusivos.' },
                            { title: 'Configuramos', desc: 'Nos encargamos de los detalles técnicos.' },
                            { title: 'Comparte', desc: 'Recibe confirmaciones al instante.' }
                        ].map((item, i) => (
                            <div key={i} className="space-y-6">
                                <span className="text-6xl font-serif italic text-[#BD7474] leading-none mb-6 block opacity-50">{i + 1}</span>
                                <h4 className="text-lg font-bold uppercase tracking-widest">{item.title}</h4>
                                <p className="text-stone-400 font-light text-sm italic">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIOS --- */}
            <section className="py-32 bg-[#FDFBF7]">
                <div className="mx-auto max-w-7xl px-6">
                    <h2 className="text-5xl font-serif text-center mb-24">Lo que dicen nuestros clientes</h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            "Antes tenía todo en WhatsApp y era un desastre. Con Invitto supe exactamente quién iba a ir.",
                            "Me quitó muchísimo estrés organizar a los invitados.",
                            "Súper fácil de usar y todo quedó organizado en minutos."
                        ].map((text, i) => (
                            <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-stone-100 relative shadow-sm hover:-translate-y-2 transition-transform">
                                <Star className="h-8 w-8 text-[#BD7474] absolute -top-4 left-1/2 -translate-x-1/2" />
                                <p className="text-lg font-light leading-relaxed italic text-stone-500">“{text}”</p>
                                <div className="mt-10 h-10 w-10 rounded-full bg-stone-100 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section className="py-32 bg-white">
                <div className="mx-auto max-w-3xl px-6">
                    <h2 className="text-5xl font-serif text-center mb-20">Preguntas frecuentes</h2>
                    <div className="space-y-6">
                        {[
                            { q: '¿Mis invitados tienen que descargar algo?', a: 'No, todo funciona desde su celular con un enlace directo que se abre en su navegador.' },
                            { q: '¿Puedo ver quién ya confirmó?', a: 'Sí, en tiempo real desde tu propio panel de administración (Dashboard).' },
                            { q: '¿Funciona con WhatsApp?', a: 'Sí, puedes compartir tu invitación y el enlace personalizado fácilmente por WhatsApp.' },
                            { q: '¿Puedo enviar recordatorios?', a: 'Sí, la plataforma permite gestionar recordatorios para tus invitados fácilmente.' }
                        ].map((item, i) => (
                            <div key={i} className="border-b border-stone-100 pb-6 group cursor-pointer" onClick={() => toggleFaq(i)}>
                                <div className="flex items-center justify-between gap-4">
                                    <h4 className="text-lg font-medium">{item.q}</h4>
                                    <ChevronDown className={`h-5 w-5 text-stone-300 transition-transform ${openFaq === i ? 'rotate-180 text-[#BD7474]' : ''}`} />
                                </div>
                                {openFaq === i && (
                                    <p className="mt-4 text-stone-400 font-light leading-relaxed animate-fade-in">{item.a}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CIERRE FINAL --- */}
            <section className="py-40 bg-[#1B2E1D] text-white text-center relative overflow-hidden">
                 <div className="absolute inset-0 z-0 overflow-hidden">
                    <img src="/images/cecilia_roses_hero.png" alt="" className="w-full h-full object-cover opacity-10 grayscale scale-110" loading="lazy" />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-12">
                    <h2 className="text-6xl md:text-8xl font-serif leading-tight">Organiza tu evento <br /> <span className="italic text-[#BD7474]">sin estrés</span></h2>
                    <p className="text-xl text-stone-300 font-light italic max-w-2xl mx-auto">Empieza hoy y ten control total de tus invitados en minutos.</p>
                    <Link to={user ? "/dashboard" : "/login"} className="inline-block">
                        <button className="px-16 py-6 bg-[#BD7474] text-white rounded-2xl text-[10px] uppercase font-bold tracking-[0.4em] shadow-2xl hover:bg-[#B06060] transition-all transform hover:scale-105 active:scale-95">
                            {user ? 'ENTRAR AL PANEL' : 'CREAR MI INVITACIÓN'}
                        </button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 bg-white border-t border-stone-100">
                <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <Link to="/" className="text-2xl font-serif italic tracking-tighter text-[#1B2E1D] hover:text-stone-600 transition-colors">
                        Invitto
                    </Link>
                    <nav className="flex flex-wrap items-center justify-center gap-8">
                        <Link to="/ejemplos" className="text-[10px] uppercase font-bold tracking-widest text-stone-400 hover:text-[#1B2E1D] transition-colors">Ejemplos</Link>
                        <Link to="/planes" className="text-[10px] uppercase font-bold tracking-widest text-stone-400 hover:text-[#1B2E1D] transition-colors">Planes</Link>
                        <Link to="/login" className="text-[10px] uppercase font-bold tracking-widest text-stone-400 hover:text-[#1B2E1D] transition-colors">Ingresar</Link>
                        <Link to="/privacy-policy" className="text-[10px] uppercase font-bold tracking-widest text-stone-400 hover:text-[#1B2E1D] transition-colors">Privacidad</Link>
                    </nav>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-stone-300 font-bold">
                        © 2026 Invitto.mx
                    </p>
                </div>
            </footer>
        </div>
    );
}
