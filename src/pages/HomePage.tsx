import { Link } from 'react-router-dom';
import {
    UserCheck, BarChart3, Heart, Sparkles, PartyPopper,
    Check, MessageSquare, Star, ChevronDown, ArrowRight,
    Layout, X, Music, Clock, Users, Gem
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Seo from '../components/Seo';

const FAQ_ITEMS = [
    { q: '¿Mis invitados necesitan descargar una app?', a: 'No, ninguno de tus invitados tiene que descargar nada. Tu invitación es una página web responsiva optimizada para móviles que se abre instantáneamente al tocar el enlace.' },
    { q: '¿Cuánto tiempo estará disponible mi invitación?', a: 'Tu invitación estará totalmente activa desde el momento en que la creas hasta 30 días después de que finalice tu evento, permitiéndote consultar y descargar la lista final de asistentes.' },
    { q: '¿Puedo editar la información después de publicarla?', a: 'Sí, por supuesto. Puedes modificar horarios, ubicaciones, textos, fotos y detalles de tus mesas en cualquier momento desde tu panel de control. Los cambios se actualizan al instante en el mismo enlace.' },
    { q: '¿Cómo funciona el RSVP inteligente?', a: 'Cada invitado o familia tiene asignado un número de pases personalizados. Al ingresar su nombre en la invitación, el sistema detecta sus pases disponibles (ej. "3 adultos, 1 de niño") y les permite confirmar quién asistirá. La confirmación actualiza tu panel en tiempo real.' },
    { q: '¿Puedo crear mi invitación sin pagar de inmediato?', a: 'Sí, puedes diseñar tu invitación, cargar tus fotos y configurar todas las secciones de manera totalmente gratuita en modo borrador. Solo realizas el pago único cuando decidas publicarla y compartirla.' },
    { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, American Express) de forma segura a través de Stripe, además de transferencias bancarias (SPEI).' },
    { q: '¿Necesito tarjeta de crédito para empezar a crear?', a: 'No, para registrarte y empezar a diseñar tu invitación en borrador no necesitas ingresar ninguna tarjeta de crédito ni método de pago.' },
    { q: '¿Sirve para XV años y eventos en México?', a: 'Sí, está diseñada especialmente para el mercado mexicano y latinoamericano. Funciona perfecto para bodas, XV años, cumpleaños, bautizos, graduaciones y cualquier evento que requiera control de asistencia.' },
    { q: '¿Cómo comparto la invitación por WhatsApp o redes?', a: 'Una vez que publiques tu invitación, obtendrás un enlace personalizado (ej. invitto.mx/i/mi-evento). Puedes copiar y pegar este enlace en chats de WhatsApp, grupos o redes sociales. Al compartirlo, generará una vista previa automática y elegante de tu evento.' }
];

const HOMEPAGE_JSONLD = [
    {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Invitto',
        url: 'https://invitto.com.mx',
        logo: 'https://invitto.com.mx/logo.png',
        description: 'Invitaciones digitales con control de confirmaciones para bodas, XV años y eventos privados en México.',
        areaServed: { '@type': 'Country', name: 'México' },
    },
    {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Invitto',
        url: 'https://invitto.com.mx',
        inLanguage: 'es-MX',
    },
    {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    },
];

export default function HomePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const { user } = useAuth();

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1B2E1D]">
            <Seo
                title="Invitaciones digitales para bodas, XV años y eventos"
                description="Crea tu invitación digital con confirmación automática, recordatorios por WhatsApp y seguimiento en tiempo real. Sin perseguir invitados. Planes desde $499 MXN."
                path="/"
                image="https://invitto.com.mx/logo.png"
                jsonLd={HOMEPAGE_JSONLD}
            />
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-[#1B2E1D]/5 px-4 md:px-6">
                <div className="mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
                    <Link to="/" className="text-xl md:text-2xl font-serif italic tracking-tighter hover:text-stone-600 transition-colors">
                        Invitto
                    </Link>
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">
                            Ejemplos
                        </Link>
                        <Link to="/planes" className="text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">
                            Planes
                        </Link>
                        <Link to="/comparativas" className="text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">
                            Comparativas
                        </Link>
                        <Link to="/concierge-service" className="text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">
                            Concierge
                        </Link>
                        <Link to="/blog" className="text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">
                            Blog
                        </Link>
                    </nav>
                    <div className="flex items-center gap-3 md:gap-8">
                        {user ? (
                            <Link to="/dashboard">
                                <button className="px-4 py-2.5 md:px-6 md:py-3 bg-[#1B2E1D] text-white rounded-lg md:rounded-xl text-[9px] md:text-xs uppercase font-bold tracking-widest hover:bg-[#2D312E] transition-all shadow-lg shadow-[#1B2E1D]/10">
                                    Dashboard
                                </button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="hidden xs:inline-block text-[9px] md:text-xs uppercase font-bold tracking-widest hover:text-[#BD7474] transition-colors">
                                    Ingresar
                                </Link>
                                <Link to="/planes">
                                    <button className="px-4 py-2.5 md:px-6 md:py-3 bg-[#1B2E1D] text-white rounded-lg md:rounded-xl text-[9px] md:text-xs uppercase font-bold tracking-widest hover:bg-[#2D312E] transition-all shadow-lg shadow-[#1B2E1D]/10">
                                        Comenzar
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-16 md:pt-56 md:pb-40 overflow-hidden px-6">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 md:opacity-10 pointer-events-none">
                    <img src="/images/cecilia_botanical_flower.png" alt="" className="w-full h-full object-contain rotate-12" />
                </div>
                
                <div className="mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
                        <div className="space-y-8 md:space-y-10 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 md:py-2 bg-[#1B2E1D]/5 rounded-full text-[8px] md:text-[10px] uppercase font-bold tracking-widest text-[#1B2E1D]">
                                <Sparkles className="h-3.5 w-3.5 text-[#BD7474]" />
                                <span>Control Total de tus Invitados</span>
                            </div>
                            <h1 className="text-4xl xs:text-5xl md:text-7xl font-serif leading-tight tracking-tight">
                                Deja de perseguir invitados.<br />
                                <span className="italic text-[#BD7474]">Ten el control de tu evento</span><br />
                                desde el primer día.
                            </h1>
                            <p className="text-base md:text-xl text-stone-500 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Tus invitados confirman con un clic. Tú ves en tiempo real quién va, quién no y cuántos acompañantes traen. Sin WhatsApp saturado, sin Excel.
                            </p>
                            <div className="flex flex-col xs:flex-row items-center justify-center lg:justify-start gap-6">
                                <Link to={user ? "/dashboard" : "/dashboard/new"} className="w-full xs:w-auto">
                                    <button className="w-full px-10 py-5 bg-[#1B2E1D] text-white rounded-2xl text-[9px] md:text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-[#2D312E] transition-all transform active:scale-95 shadow-xl shadow-[#1B2E1D]/20 flex items-center justify-center gap-3">
                                        {user ? 'IR AL PANEL' : 'CREAR MI INVITACIÓN'} <ArrowRight className="h-4 w-4" />
                                    </button>
                                </Link>
                                <Link to="/i/cecilia-70" className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-[#1B2E1D] hover:text-[#BD7474] flex items-center gap-2 group transition-all">
                                    VER EJEMPLO <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        </div>

                        <div className="relative mt-8 lg:mt-0">
                            {/* Main Phone Mockup */}
                            <div className="relative z-10 mx-auto max-w-[280px] xs:max-w-[320px] lg:max-w-md aspect-[4/5] bg-stone-200 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border-4 md:border-8 border-[#1B2E1D] shadow-2xl">
                                <img src="/images/cecilia_roses_hero.png" className="w-full h-full object-cover" alt="Phone Mockup" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2E1D]/80 via-[#1B2E1D]/20 to-transparent" />
                                
                                <div className="absolute bottom-8 md:bottom-10 left-0 w-full px-6 md:px-10 text-white z-20">
                                    <p className="font-serif italic text-3xl md:text-4xl mb-1 drop-shadow-sm">Cecilia Cardona</p>
                                    <p className="text-[9px] md:text-[11px] uppercase tracking-[0.2em] font-bold text-[#BD7474]">Mis 70 Primaveras</p>
                                    
                                    <div className="flex items-center gap-2 mt-4 text-white/90 bg-white/10 backdrop-blur-md px-3 py-1.5 md:py-2 rounded-lg w-fit border border-white/10">
                                        <Clock className="h-3 w-3 text-[#BD7474]" />
                                        <p className="text-[8px] md:text-[9px] font-bold tracking-widest uppercase">01 Mayo | 14:30 a 21:00 hrs</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Cards */}
                            <div className="absolute top-1/2 -right-4 lg:-right-8 -translate-y-1/2 hidden xl:block p-6 bg-white rounded-2xl shadow-2xl border border-stone-100 max-w-[240px] animate-bounce-slow z-30">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#1B2E1D]">Nuevo Invitado</span>
                                </div>
                                <p className="text-sm font-bold text-[#1B2E1D] mb-1">Roberto Nieto</p>
                                <p className="text-[10px] text-stone-500 font-medium italic">Confirmó con +2 acompañantes</p>
                            </div>

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
            <section className="py-20 md:py-24 bg-white border-y border-[#1B2E1D]/5">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-serif mb-8 md:mb-10">Organizar invitados no debería ser un caos</h2>
                    <div className="grid md:grid-cols-2 gap-10 md:grid-cols-2 lg:gap-12 text-left items-center">
                        <div className="space-y-6">
                            <p className="text-stone-500 font-light leading-relaxed text-sm md:text-base">
                                Mensajes por WhatsApp, listas en Excel, gente que no confirma, cambios de último momento…
                            </p>
                            <p className="text-lg md:text-xl font-medium text-[#BD7474] italic">
                                Al final, no sabes quién va a ir realmente a tu evento.
                            </p>
                            <p className="text-base md:text-lg font-light text-[#1B2E1D]">
                                <strong>Invitto</strong> soluciona todo eso en un solo lugar.
                            </p>
                        </div>
                        <div className="bg-[#FDFBF7] p-6 md:p-8 rounded-2xl md:rounded-3xl space-y-4 border border-stone-100">
                             {[
                                "WhatsApp saturado",
                                "Listas de Excel obsoletas",
                                "Llamadas de gente que no confirma",
                                "Estrés de último momento"
                             ].map((err, i) => (
                                <div key={i} className="flex items-center gap-4 text-stone-300">
                                    <X className="h-4 w-4 md:h-5 md:w-5 text-red-300" />
                                    <span className="text-xs md:text-sm font-light italic">{err}</span>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PROPUESTA DE VALOR --- */}
            <section className="py-20 md:py-32 bg-[#FDFBF7]">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center mb-16 md:mb-20 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-serif">Todo lo que necesitas para tener control total</h2>
                        <div className="h-1 w-16 md:w-20 bg-[#BD7474] mx-auto" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                        {[
                            { title: 'Sabe exactamente quién va a ir', desc: 'Visualiza confirmaciones en tiempo real. Sin perseguir a nadie por WhatsApp.', icon: BarChart3, color: 'text-emerald-500' },
                            { title: 'Lista en tiempo real', desc: 'Cada confirmación llega al instante a tu panel, organizada y sin duplicados.', icon: MessageSquare, color: 'text-blue-500' },
                            { title: 'Confirmaciones automáticas', desc: 'Tus invitados confirman con un clic. Sin llamadas, sin mensajes, sin estrés.', icon: UserCheck, color: 'text-purple-500' },
                            { title: 'Recordatorios automáticos', desc: 'El sistema avisa a tus invitados antes del evento. Tú no escribes nada.', icon: Layout, color: 'text-[#BD7474]' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                                <div className={`h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-stone-50 flex items-center justify-center mb-6 md:mb-8 ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon className="h-6 w-6 md:h-7 md:w-7" />
                                </div>
                                <p className="text-base md:text-lg font-medium leading-tight mb-3">{item.title}</p>
                                <p className="text-xs md:text-sm text-stone-400 font-light leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- COMO FUNCIONA --- */}
            <section className="py-20 md:py-24 bg-[#1B2E1D] text-white overflow-hidden relative px-6">
                <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-[#BD7474]/10 rounded-full blur-[100px] md:blur-[120px]" />
                <div className="mx-auto max-w-5xl relative z-10">
                    <h2 className="text-3xl md:text-6xl font-serif text-center mb-16 md:mb-20 leading-tight">Así de fácil funciona Invitto</h2>
                    
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 relative">
                         <div className="hidden md:block absolute top-[2.75rem] left-0 w-full h-[1px] bg-white/10 z-0" />
                         
                         {[
                            { title: 'Crea tu invitación en minutos', step: '01' },
                            { title: 'Comparte el link', step: '02' },
                            { title: 'Ellos confirman automáticamente', step: '03' },
                            { title: 'Tú ves todo organizado', step: '04' }
                         ].map((item, i) => (
                            <div key={i} className="text-center space-y-6 md:space-y-8 relative z-10 group">
                                <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-[#FDFBF7] text-[#1B2E1D] flex items-center justify-center font-bold text-lg md:text-xl mx-auto ring-6 md:ring-8 ring-white/5 group-hover:bg-[#BD7474] group-hover:text-white transition-all duration-500">
                                    {item.step}
                                </div>
                                <p className="text-[10px] md:text-xs uppercase tracking-widest font-bold opacity-80 max-w-[120px] mx-auto leading-relaxed">{item.title}</p>
                            </div>
                         ))}
                    </div>

                    <div className="mt-16 md:mt-24 text-center">
                        <p className="text-base md:text-xl font-light italic text-[#BD7474] mb-8 leading-relaxed">“Sin Excel, sin estrés, sin perseguir a nadie”</p>
                        <Link to={user ? "/dashboard" : "/dashboard/new"}>
                            <button className="w-full xs:w-auto px-12 py-5 bg-white text-[#1B2E1D] rounded-2xl text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-[#BD7474] hover:text-white transition-all shadow-2xl active:scale-95">
                                {user ? 'IR A MI PANEL' : 'CREAR MI INVITACIÓN AHORA'}
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- VISUAL SECTION --- */}
            <section className="py-20 md:py-32 bg-[#FDFBF7] px-6">
                <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 md:gap-20 items-center">
                    <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                        <h2 className="text-3xl md:text-5xl font-serif leading-tight">Así verán tus invitados tu invitación</h2>
                        <p className="text-lg md:text-xl text-stone-400 font-light leading-relaxed">
                            Una experiencia simple, elegante y fácil de usar desde cualquier celular. Sin aplicaciones que descargar, solo un clic y listo.
                        </p>
                        <ul className="space-y-4 max-w-xs mx-auto lg:mx-0">
                            {['Botón de confirmación', 'Flujo simple'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-[10px] md:text-sm font-bold uppercase tracking-widest text-left">
                                    <Check className="h-4 w-4 md:h-5 md:w-5 text-[#BD7474] flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="pt-4 md:pt-6 flex justify-center lg:justify-start">
                            <Link to="/i/cecilia-70" className="inline-flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#1B2E1D] hover:text-[#BD7474] transition-colors group">
                                PROBAR DEMO INTERACTIVA <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                    <div className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center mt-10 lg:mt-0">
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-[#BD7474]/5 rounded-full blur-[80px]" />
                        
                        {/* Card 1: RSVP Success */}
                        <div className="absolute top-0 md:top-10 left-0 md:left-4 z-20 w-56 md:w-64 p-5 md:p-6 bg-white rounded-3xl shadow-2xl border border-stone-100 transform -rotate-6 hover:rotate-0 transition-transform duration-500 hover:scale-105 hover:z-30">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                    <Check className="h-5 w-5 md:h-6 md:w-6 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="font-serif text-base md:text-lg text-stone-900 leading-tight">¡Confirmado!</p>
                                    <p className="text-[8px] md:text-[10px] uppercase tracking-widest font-bold text-stone-400 mt-1">Mesa 12 • 4 pax</p>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Date & Countdown */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-64 md:w-72 p-6 md:p-8 bg-[#1B2E1D] text-white rounded-[2.5rem] shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 hover:scale-105 hover:z-30">
                            <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-black text-[#BD7474] mb-5 md:mb-6 text-center">Boda Isabel & Rodrigo</p>
                            <div className="flex justify-center gap-4 md:gap-6 mb-6 md:mb-8">
                                <div className="text-center">
                                    <p className="text-3xl md:text-4xl font-serif">45</p>
                                    <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/50 mt-1">Días</p>
                                </div>
                                <div className="w-px bg-white/10" />
                                <div className="text-center">
                                    <p className="text-3xl md:text-4xl font-serif">12</p>
                                    <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/50 mt-1">Hrs</p>
                                </div>
                            </div>
                            <button className="w-full py-3 md:py-4 bg-[#BD7474] rounded-xl text-[8px] md:text-[9px] uppercase font-bold tracking-widest text-white shadow-lg shadow-[#BD7474]/20">
                                Confirmar Asistencia
                            </button>
                        </div>

                        {/* Card 3: Timeline/Location */}
                        <div className="absolute bottom-0 md:bottom-10 right-0 md:right-4 z-20 w-56 md:w-64 p-5 md:p-6 bg-stone-50/90 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-200 transform rotate-6 hover:rotate-0 transition-transform duration-500 hover:scale-105 hover:z-30">
                            <div className="space-y-3 md:space-y-4">
                                <div className="flex items-center gap-3 md:gap-4 bg-white p-2.5 md:p-3 rounded-2xl shadow-sm">
                                    <div className="p-1.5 md:p-2 bg-stone-50 rounded-full">
                                        <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#BD7474]" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] md:text-[10px] uppercase tracking-widest font-bold text-stone-400">Ceremonia</p>
                                        <p className="font-serif text-xs md:text-sm text-stone-900">16:00 hrs</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 md:gap-4 bg-white p-2.5 md:p-3 rounded-2xl shadow-sm">
                                    <div className="p-1.5 md:p-2 bg-stone-50 rounded-full">
                                        <Heart className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#BD7474]" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] md:text-[10px] uppercase tracking-widest font-bold text-stone-400">Recepción</p>
                                        <p className="font-serif text-xs md:text-sm text-stone-900">18:00 hrs</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CASOS DE USO --- */}
            <section className="py-20 md:py-24 bg-[#FDFBF7] px-6">
                <div className="mx-auto max-w-7xl">
                    <h2 className="text-3xl font-serif text-center mb-16 md:mb-20 text-stone-400 opacity-50 uppercase tracking-[0.2em] text-[10px] md:text-sm font-bold">Para eventos con control total</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
                        {[
                            { name: 'Bodas', icon: Heart, href: '/invitaciones-digitales-boda' },
                            { name: 'XV años', icon: PartyPopper, href: '/invitaciones-digitales-xv-anos' },
                            { name: 'Cumpleaños', icon: Music, href: '/invitaciones-digitales-cumpleanos' },
                            { name: 'Más eventos', icon: Star, href: '/ejemplos' }
                        ].map((item, i) => (
                            <Link
                                key={i}
                                to={item.href}
                                className="flex flex-col items-center gap-4 md:gap-6 group"
                            >
                                <div className="h-20 w-20 md:h-28 md:w-28 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-[#BD7474] group-hover:bg-[#BD7474]/5 transition-all">
                                    <item.icon className="h-8 w-8 md:h-10 md:w-10 text-stone-300 group-hover:text-[#BD7474] transition-colors" />
                                </div>
                                <span className="font-serif italic text-xl md:text-2xl group-hover:text-[#BD7474] transition-colors">{item.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* SEO internal linking: ciudades */}
                    <div className="mt-12 md:mt-16 text-center">
                        <p className="text-[10px] md:text-xs uppercase font-bold tracking-widest text-stone-400 mb-4">Disponible en todo México</p>
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm md:text-base">
                            <Link to="/invitaciones-digitales-cdmx" className="text-stone-500 hover:text-[#BD7474] font-serif italic transition-colors">
                                CDMX
                            </Link>
                            <span className="text-stone-200">·</span>
                            <Link to="/invitaciones-digitales-guadalajara" className="text-stone-500 hover:text-[#BD7474] font-serif italic transition-colors">
                                Guadalajara
                            </Link>
                            <span className="text-stone-200">·</span>
                            <Link to="/invitaciones-digitales-monterrey" className="text-stone-500 hover:text-[#BD7474] font-serif italic transition-colors">
                                Monterrey
                            </Link>
                            <span className="text-stone-200">·</span>
                            <Link to="/comparativas" className="text-stone-500 hover:text-[#BD7474] font-serif italic transition-colors">
                                Comparativas
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING SECTION --- */}
            <section className="py-20 md:py-32 bg-white px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-16 md:mb-20 space-y-4 md:space-y-6">
                        <h2 className="text-3xl md:text-5xl font-serif">Elige tu plan</h2>
                        <p className="text-lg md:text-xl text-stone-400 font-light italic leading-relaxed">Paga una sola vez y organiza tu evento sin estrés.</p>
                        <div className="h-1 w-16 md:w-20 bg-[#BD7474] mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 max-w-[1400px] mx-auto items-stretch">
                        {/* Plan Clásico */}
                        <div className="p-7 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-stone-100 bg-[#FDFBF7] flex flex-col items-center text-center hover:shadow-xl transition-all">
                             <h4 className="text-xl md:text-2xl font-serif mb-2">Clásica</h4>
                             <p className="text-[8px] md:text-[9px] uppercase font-bold tracking-widest text-stone-400 mb-6 md:mb-8">SOLO LO BÁSICO</p>
                             <div className="text-3xl md:text-4xl font-serif mb-4 md:mb-6 text-[#1B2E1D]">$499</div>
                             <p className="text-[9px] md:text-[10px] font-medium text-stone-500 italic mb-8 md:mb-10 w-full pb-4 md:pb-6 border-b border-stone-200 uppercase tracking-tighter leading-relaxed">“Solo quiero mi invitación bonita”</p>
                             
                             <ul className="space-y-3 mb-8 md:mb-10 text-[12px] md:text-[13px] text-stone-400 font-light text-left w-full">
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

                             <div className="mt-auto w-full space-y-4">
                                 <Link to="/dashboard/new?plan=clasico" className="block w-full">
                                    <button className="w-full py-4 bg-[#1B2E1D] text-white rounded-xl text-[9px] uppercase font-bold tracking-[0.2em] hover:bg-[#2D312E] transition-all active:scale-95">Solo mi invitación</button>
                                 </Link>
                                 <Link to="/i/bautizo-victoria" className="block text-[8px] uppercase font-bold tracking-widest text-stone-400 hover:text-[#1B2E1D] transition-colors">Ver Ejemplo →</Link>
                             </div>
                        </div>

                        {/* Plan Pro - DESTACADO */}
                        <div className="p-7 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-[#1B2E1D] text-white flex flex-col items-center text-center relative shadow-2xl md:scale-105 z-10 border-4 border-[#BD7474]/20">
                             <div className="absolute -top-4 md:-top-5 bg-[#BD7474] text-white px-5 md:px-6 py-1.5 rounded-full text-[8px] md:text-[9px] uppercase font-black tracking-widest flex items-center gap-2 shadow-lg">
                                <Gem className="h-3 w-3" /> POPULAR
                             </div>
                             <h4 className="text-xl md:text-2xl font-serif mb-2">Pro</h4>
                             <p className="text-[8px] md:text-[9px] uppercase font-bold tracking-widest text-[#BD7474] mb-6 md:mb-8">CONTROL TOTAL</p>
                             <div className="text-4xl md:text-5xl font-serif mb-4 md:mb-6">$1,699</div>
                             <p className="text-[9px] md:text-[10px] font-medium text-[#BD7474] italic mb-8 md:mb-10 w-full pb-4 md:pb-6 border-b border-[#2D312E] uppercase tracking-tighter leading-relaxed">“Ya sé quién sí va a ir”</p>
                             
                             <ul className="space-y-3 mb-8 md:mb-10 text-[12px] md:text-[13px] text-stone-300 font-light text-left w-full">
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
                             <div className="mt-auto w-full space-y-4">
                                 <Link to="/dashboard/new?plan=pro" className="block w-full">
                                    <button className="w-full py-4 bg-white text-[#1B2E1D] rounded-xl text-[9px] uppercase font-black tracking-[0.2em] hover:bg-stone-100 transition-all active:scale-95">Quiero control total</button>
                                 </Link>
                                 <Link to="/i/boda-isabel-rodrigo-pro" className="block text-[8px] uppercase font-bold tracking-widest text-white/60 hover:text-white transition-colors">Ver Ejemplo <ArrowRight className="inline-block h-3 w-3" /></Link>
                             </div>
                        </div>

                        {/* Plan Diseño Pro */}
                        <div className="p-7 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-stone-100 bg-[#FDFBF7] flex flex-col items-center text-center hover:shadow-xl transition-all">
                             <h4 className="text-xl md:text-2xl font-serif mb-2">Diseño Pro</h4>
                             <p className="text-[8px] md:text-[9px] uppercase font-bold tracking-widest text-stone-400 mb-6 md:mb-8">ÚNICO Y A MEDIDA</p>
                             <div className="text-3xl md:text-4xl font-serif mb-4 md:mb-6 text-[#1B2E1D]">$2,499</div>
                             <p className="text-[9px] md:text-[10px] font-medium text-stone-500 italic mb-8 md:mb-10 w-full pb-4 md:pb-6 border-b border-stone-200 uppercase tracking-tighter leading-relaxed">“Quiero algo personalizado”</p>
                             
                             <ul className="space-y-3 mb-8 md:mb-10 text-[12px] md:text-[13px] text-stone-400 font-light text-left w-full">
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
                             <div className="mt-auto w-full space-y-4">
                                 <Link to="/dashboard/new?plan=premium" className="block w-full">
                                    <button className="w-full py-4 bg-[#1B2E1D] text-white rounded-xl text-[9px] uppercase font-bold tracking-[0.2em] hover:bg-[#2D312E] transition-all active:scale-95">Diseño a medida</button>
                                 </Link>
                                 <Link to="/i/xv-regina-2026-premium" className="block text-[8px] uppercase font-bold tracking-widest text-stone-400 hover:text-[#1B2E1D] transition-colors">Ver Ejemplo →</Link>
                             </div>
                        </div>

                        {/* Plan Concierge */}
                        <div className="p-7 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-[#BD7474]/20 bg-white flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition-all">
                             <h4 className="text-xl md:text-2xl font-serif mb-2 text-[#1B2E1D]">Concierge</h4>
                             <p className="text-[8px] md:text-[9px] uppercase font-black tracking-[0.2em] text-[#BD7474] mb-6 md:mb-8">NOSOTROS HACEMOS TODO</p>
                             <div className="text-3xl md:text-4xl font-serif mb-4 md:mb-6 text-[#1B2E1D]">$4,499</div>
                             <p className="text-[9px] md:text-[10px] font-medium text-[#BD7474] italic mb-8 md:mb-10 w-full pb-4 md:pb-6 border-b border-[#BD7474]/10 uppercase tracking-tighter leading-relaxed">“Yo no me encargo de nada”</p>
                             
                             <ul className="space-y-3 mb-8 md:mb-10 text-[12px] md:text-[13px] text-stone-600 font-light text-left w-full">
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
                                 <Link to="/dashboard/new?plan=concierge" className="block w-full">
                                    <button className="w-full py-4 bg-[#BD7474] text-white rounded-xl text-[9px] uppercase font-black tracking-[0.2em] shadow-lg shadow-[#BD7474]/20 hover:scale-[1.02] transition-all active:scale-95">Servicio Completo</button>
                                 </Link>
                                 <div className="flex flex-col gap-2">
                                    <Link to="/concierge-service" className="block text-[8px] uppercase font-black tracking-widest text-stone-300 hover:text-[#BD7474] transition-colors">Saber más del servicio →</Link>
                                    <Link to="/i/boda-gabriela-arturo-premium" className="block text-[8px] uppercase font-bold tracking-widest text-stone-400 hover:text-[#1B2E1D] transition-colors">Ver Ejemplo de Invitación →</Link>
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* LÍNEA DE CIERRE */}
                    <div className="mt-16 md:mt-20 text-center max-w-2xl mx-auto">
                        <p className="text-stone-400 font-light italic text-base md:text-lg leading-relaxed px-6 md:px-10">
                            "La mayoría de eventos se desorganizan porque no saben quién va a ir. <span className="text-[#BD7474] font-semibold not-italic">El plan Pro elimina ese problema por completo.</span>"
                        </p>
                    </div>
                </div>
            </section>

            {/* --- CONCIERGE UPSELL --- */}
            <section className="py-20 md:py-32 bg-[#0A0C0A] text-white relative overflow-hidden px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[#BD7474]/5 rounded-full blur-[80px] md:blur-[120px] -z-0 opacity-40" />

                <div className="mx-auto max-w-5xl relative z-10 grid lg:grid-cols-2 gap-16 md:gap-20 items-center">
                    <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                            <Gem className="h-3.5 w-3.5 text-[#BD7474]" />
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">Servicio Luxury</span>
                        </div>
                        <h2 className="text-3xl md:text-6xl font-serif leading-tight">
                            ¿No tienes tiempo? <br />
                            <span className="italic text-[#BD7474]">Nosotros lo hacemos todo.</span>
                        </h2>
                        <p className="text-base md:text-lg text-white/40 font-light italic leading-relaxed">
                            El plan Concierge: cargamos tus invitados, enviamos cada invitación por WhatsApp, hacemos 4 rondas de seguimiento y te entregamos la lista final confirmada. Tú solo disfrutas.
                        </p>
                        <Link to="/concierge-service" className="inline-flex items-center justify-center lg:justify-start gap-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-white hover:text-[#BD7474] transition-colors group">
                            SABER MÁS SOBRE CONCIERGE <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="p-7 md:p-10 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[3rem] backdrop-blur-xl space-y-6">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <div className="h-10 w-10 md:h-12 md:w-12 bg-[#BD7474]/20 rounded-xl flex items-center justify-center text-[#BD7474]">
                                    <Users className="h-5 w-5 md:h-6 md:w-6" />
                                </div>
                                <div>
                                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#BD7474]">Gestión Humana</p>
                                    <p className="text-xs md:text-sm font-serif italic">Tu equipo dedicado</p>
                                </div>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    'Cargamos tus invitados por ti',
                                    'Envío individual por WhatsApp',
                                    '4 rondas de seguimiento',
                                    'Reporte final de asistencia'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-xs md:text-sm text-white/70 font-light">
                                        <Check className="h-4 w-4 text-[#BD7474] flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section className="py-20 md:py-32 bg-white px-6">
                <div className="mx-auto max-w-3xl">
                    <h2 className="text-3xl md:text-5xl font-serif text-center mb-16 md:mb-20 leading-tight">Todo lo que necesitas saber</h2>
                    <div className="space-y-4 md:space-y-6">
                        {FAQ_ITEMS.map((item, i) => (
                            <div key={i} className="border-b border-stone-100 pb-5 md:pb-6 group cursor-pointer" onClick={() => toggleFaq(i)}>
                                <div className="flex items-center justify-between gap-4">
                                    <h4 className="text-base md:text-lg font-medium">{item.q}</h4>
                                    <ChevronDown className={`h-4 w-4 md:h-5 md:w-5 text-stone-300 transition-transform ${openFaq === i ? 'rotate-180 text-[#BD7474]' : ''}`} />
                                </div>
                                {openFaq === i && (
                                    <p className="mt-4 text-xs md:text-sm text-stone-400 font-light leading-relaxed animate-fade-in">{item.a}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CIERRE FINAL --- */}
            <section className="py-24 md:py-40 bg-[#1B2E1D] text-white text-center relative overflow-hidden px-6">
                 <div className="absolute inset-0 z-0 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?auto=format&fit=crop&q=80" alt="Event Background" className="w-full h-full object-cover opacity-10 md:opacity-15 grayscale scale-110" loading="lazy" />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto space-y-10 md:space-y-12">
                    <h2 className="text-4xl md:text-8xl font-serif leading-tight">Organiza tu evento <br /> <span className="italic text-[#BD7474]">sin estrés</span></h2>
                    <p className="text-lg md:text-xl text-stone-300 font-light italic max-w-2xl mx-auto leading-relaxed">Empieza hoy y ten control total de tus invitados en minutos.</p>
                    <Link to={user ? "/dashboard" : "/dashboard/new"} className="inline-block w-full xs:w-auto">
                        <button className="w-full px-12 md:px-16 py-5 md:py-6 bg-[#BD7474] text-white rounded-2xl text-[9px] md:text-[10px] uppercase font-bold tracking-[0.3em] md:tracking-[0.4em] shadow-2xl hover:bg-[#B06060] transition-all transform active:scale-95">
                            {user ? 'ENTRAR AL PANEL' : 'CREAR MI INVITACIÓN'}
                        </button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 md:py-24 bg-[#0F1C11] text-white/80 border-t border-white/5 px-6">
                <div className="mx-auto max-w-7xl space-y-16">
                    {/* Top reassurance banners */}
                    <div className="pb-12 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#BD7474]">
                                El camino más fácil a tu evento
                            </p>
                            <p className="text-xs text-white/50 font-light">
                                Sin mensualidades · Crea gratis · Paga solo al publicar · Sin tarjeta
                            </p>
                        </div>
                        <div className="md:text-right">
                            <p className="text-xs text-white/60 font-light">
                                ¿Dudas o algo no cuadra? Escríbenos a{' '}
                                <a href="mailto:soporte@invitto.com.mx" className="text-white hover:text-[#BD7474] font-medium transition-colors">
                                    soporte@invitto.com.mx
                                </a>
                            </p>
                            <p className="text-[10px] text-white/40 font-light mt-0.5">
                                — atención prioritaria para los primeros clientes.
                            </p>
                        </div>
                    </div>

                    {/* Main content grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                        {/* Left column: Tagline & CTA */}
                        <div className="lg:col-span-5 space-y-6">
                            <h3 className="text-3xl md:text-4xl font-serif text-white leading-tight">
                                La invitación digital <br />
                                <span className="italic text-[#BD7474]">que merece tu historia</span>
                            </h3>
                            <p className="text-xs text-white/50 font-light leading-relaxed max-w-sm">
                                Crea gratis y publica cuando estés listo: RSVP, pases individuales, código QR y detalles del evento en un solo enlace.
                            </p>
                            <div className="pt-2">
                                <Link to={user ? "/dashboard" : "/dashboard/new"} className="inline-block w-full xs:w-auto">
                                    <button className="w-full xs:w-auto px-8 py-4 bg-[#BD7474] text-white rounded-xl text-[9px] uppercase font-bold tracking-[0.2em] hover:bg-[#B06060] transition-all transform active:scale-95 flex items-center justify-center gap-2">
                                        Crear invitación
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Middle column: Logo & statement */}
                        <div className="lg:col-span-3 space-y-4 lg:border-l lg:border-white/5 lg:pl-12">
                            <span className="text-2xl font-serif italic tracking-tighter text-white block">
                                Invitto
                            </span>
                            <p className="text-xs text-white/40 font-light leading-relaxed max-w-xs">
                                Invitaciones digitales de alta gama con control de pases y confirmación inteligente. Diseñado para anfitriones exigentes en México y Latinoamérica.
                            </p>
                        </div>

                        {/* Right columns: Links */}
                        <div className="lg:col-span-4 grid grid-cols-2 gap-8">
                            {/* Col 1: Links */}
                            <div className="space-y-4">
                                <h4 className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-white/40">Producto</h4>
                                <ul className="space-y-3">
                                    <li><Link to="/planes" className="text-xs text-white/60 hover:text-white transition-colors font-light">Planes y precios</Link></li>
                                    <li><Link to="/ejemplos" className="text-xs text-white/60 hover:text-white transition-colors font-light">Ejemplos</Link></li>
                                    <li><Link to="/concierge-service" className="text-xs text-white/60 hover:text-white transition-colors font-light">Servicio Concierge</Link></li>
                                    <li><Link to="/comparativas" className="text-xs text-white/60 hover:text-white transition-colors font-light">Comparativas</Link></li>
                                    <li><Link to="/blog" className="text-xs text-white/60 hover:text-white transition-colors font-light">Blog y consejos</Link></li>
                                </ul>
                            </div>

                            {/* Col 2: Legal & Contacto */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-white/40">Legal</h4>
                                    <ul className="space-y-3">
                                        <li><Link to="/terminos" className="text-xs text-white/60 hover:text-white transition-colors font-light">Términos</Link></li>
                                        <li><Link to="/terminos#4-politica-de-reembolso-y-cancelacion" className="text-xs text-white/60 hover:text-white transition-colors font-light">Reembolsos</Link></li>
                                        <li><Link to="/aviso-de-privacidad" className="text-xs text-white/60 hover:text-white transition-colors font-light">Aviso de privacidad</Link></li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-white/40">Contacto</h4>
                                    <ul className="space-y-3">
                                        <li><a href="https://wa.me/525544332211" target="_blank" rel="noopener noreferrer" className="text-xs text-white/60 hover:text-white transition-colors font-light">WhatsApp Soporte</a></li>
                                        <li><Link to="/login" className="text-xs text-white/60 hover:text-white transition-colors font-light">Iniciar sesión</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom copyright line */}
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium">
                            © 2026 Invitto.mx · Todos los derechos reservados
                        </p>
                        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium">
                            Hecho con cariño en México
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
