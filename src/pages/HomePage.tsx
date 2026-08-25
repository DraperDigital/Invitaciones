import { Link } from 'react-router-dom';
import {
    UserCheck, BarChart3, PartyPopper,
    Check, MessageSquare, Star, ChevronDown, ArrowRight,
    X, Music, Users, Gem, Menu
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Seo from '../components/Seo';
import { FAQ_ITEMS, FAQ_JSONLD } from '../data/faq';

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
    FAQ_JSONLD,
];

export default function HomePage() {
    const { user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#222B38]">
            <Seo
                title="Invitaciones digitales para bodas, XV años y eventos | Invitto"
                description="Crea tu invitación digital con confirmación automática, recordatorios por WhatsApp y seguimiento en tiempo real. Sin perseguir invitados. Planes desde $499 MXN."
                path="/"
                image="https://invitto.com.mx/logo.png"
                jsonLd={HOMEPAGE_JSONLD}
            />

            {/* --- 1. HEADER --- */}
            <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-slate-100 px-4 md:px-6">
                <div className="mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center hover:opacity-95 transition-opacity">
                        <img src="/logo.png?v=3" alt="Invitto" className="h-8 md:h-10 w-auto object-contain" />
                    </Link>

                    <nav className="hidden lg:flex items-center gap-8">
                        <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Ejemplos
                        </Link>
                        <Link to="/planes" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Planes
                        </Link>
                        <Link to="/comparativas" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Comparativas
                        </Link>
                        <Link to="/concierge-service" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Concierge
                        </Link>
                        <Link to="/blog" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Blog
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3 md:gap-6">
                        <button
                            className="lg:hidden p-2 text-[#222B38] focus:outline-none"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Menú principal"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>

                        {user ? (
                            <Link to="/dashboard">
                                <button className="px-4 py-2 md:px-6 md:py-3 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-[10px] md:text-xs uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#DF3B94]/20 hover:-translate-y-0.5 active:scale-95">
                                    Dashboard
                                </button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="hidden sm:inline-block text-[10px] md:text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                                    Ingresar
                                </Link>
                                <Link to="/planes" className="hidden sm:block">
                                    <button className="px-5 py-2.5 md:px-6 md:py-3 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-[10px] md:text-xs uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#DF3B94]/20 hover:-translate-y-0.5 active:scale-95">
                                        Comenzar
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
                        <Link
                            to="/ejemplos"
                            className="block text-xs uppercase font-bold tracking-widest text-slate-700 hover:text-[#DF3B94] transition-colors py-2 border-b border-slate-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Ejemplos
                        </Link>
                        <Link
                            to="/planes"
                            className="block text-xs uppercase font-bold tracking-widest text-slate-700 hover:text-[#DF3B94] transition-colors py-2 border-b border-slate-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Planes y Precios
                        </Link>
                        <Link
                            to="/comparativas"
                            className="block text-xs uppercase font-bold tracking-widest text-slate-700 hover:text-[#DF3B94] transition-colors py-2 border-b border-slate-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Comparativas
                        </Link>
                        <Link
                            to="/concierge-service"
                            className="block text-xs uppercase font-bold tracking-widest text-slate-700 hover:text-[#DF3B94] transition-colors py-2 border-b border-slate-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Servicio Concierge
                        </Link>
                        <Link
                            to="/blog"
                            className="block text-xs uppercase font-bold tracking-widest text-slate-700 hover:text-[#DF3B94] transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Blog
                        </Link>
                        <div className="pt-3 flex flex-col gap-3">
                            <Link
                                to={user ? '/dashboard' : '/planes'}
                                className="block w-full text-center px-6 py-3 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-xs uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#DF3B94]/20 active:scale-95"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {user ? 'Mi Dashboard' : 'Comenzar'}
                            </Link>
                            {!user && (
                                <Link
                                    to="/login"
                                    className="block w-full text-center px-6 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs uppercase font-bold tracking-widest transition-all hover:bg-slate-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Ingresar
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* --- 2. HERO SECTION --- */}
            <section className="relative pt-28 pb-16 md:pt-48 md:pb-36 overflow-hidden px-6 bg-gradient-to-b from-[#fdf2f8]/50 via-white to-[#F8F9FA]">
                <div className="mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
                        <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center px-4 py-2 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#DF3B94]">
                                <span>Plataforma #1 de Invitaciones Digitales</span>
                            </div>

                            <h1 className="text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-[#222B38] tracking-tight leading-[1.1]">
                                Deja de perseguir invitados.<br />
                                <span className="bg-gradient-to-r from-[#DF3B94] via-[#F5B837] to-[#DF3B94] bg-clip-text text-transparent">
                                    Ten el control de tu evento
                                </span><br />
                                desde el primer día.
                            </h1>

                            <p className="text-base md:text-xl text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Tus invitados confirman con un clic. Tú ves en tiempo real quién va, quién no y cuántos acompañantes traen. Sin WhatsApp saturado, sin Excel.
                            </p>

                            <div className="flex flex-col xs:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                                <Link to={user ? "/dashboard" : "/dashboard/new"} className="w-full xs:w-auto">
                                    <button className="w-full px-8 py-4 md:px-10 md:py-5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-2xl text-xs md:text-sm font-bold tracking-wider hover:-translate-y-0.5 transition-all active:scale-95 shadow-xl shadow-[#DF3B94]/25 flex items-center justify-center gap-3">
                                        {user ? 'IR AL PANEL' : 'CREAR MI INVITACIÓN'} <ArrowRight className="h-4 w-4" />
                                    </button>
                                </Link>
                                <Link to="/i/cecilia-70" className="w-full xs:w-auto px-6 py-4 rounded-2xl bg-white border border-slate-200 text-xs md:text-sm font-bold tracking-wider text-slate-700 hover:text-[#DF3B94] hover:border-[#DF3B94]/30 transition-all flex items-center justify-center gap-2 group shadow-sm">
                                    VER EJEMPLO DEMO <span className="text-lg group-hover:translate-x-1 transition-transform text-[#DF3B94]">→</span>
                                </Link>
                            </div>

                            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#4E7B55]" /> Confirmaciones WhatsApp</span>
                                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#4E7B55]" /> Pases QR</span>
                                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#4E7B55]" /> Listos en 5 min</span>
                            </div>
                        </div>

                        {/* Right Column: Layered Product Collage (Smartphone + Live RSVP + QR Pass) */}
                        <div className="relative mt-12 lg:mt-0 flex items-center justify-center">
                            
                            {/* Ambient Glows */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#DF3B94]/10 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute top-1/3 left-10 w-72 h-72 bg-[#F5B837]/15 rounded-full blur-[80px] pointer-events-none" />

                            {/* 1. Main Smartphone Frame */}
                            <div className="relative z-20 mx-auto w-full max-w-[290px] xs:max-w-[320px] lg:max-w-[340px] aspect-[9/18] bg-slate-900 rounded-[2.8rem] p-3 shadow-2xl shadow-[#222B38]/20 ring-1 ring-slate-800">
                                {/* Speaker notch */}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-center">
                                    <div className="w-3 h-1 bg-slate-800 rounded-full" />
                                </div>

                                {/* Phone Screen Content */}
                                <div className="w-full h-full bg-slate-950 rounded-[2.2rem] overflow-hidden relative flex flex-col justify-between text-white">
                                    {/* Event Hero Cover */}
                                    <div className="relative h-2/3 w-full">
                                        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Boda Isabel & Rodrigo" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                                        
                                        <div className="absolute bottom-4 left-0 w-full px-5 z-10 text-center">
                                            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] uppercase font-bold tracking-widest text-[#F5B837] border border-white/10 inline-block mb-2">
                                                Nuestra Boda
                                            </span>
                                            <p className="font-display font-extrabold text-2xl drop-shadow-sm text-white">Isabel & Rodrigo</p>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-300 mt-0.5">25 Octubre 2026</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons inside Phone */}
                                    <div className="p-4 space-y-2 bg-slate-950 z-10">
                                        <div className="flex justify-center gap-3 text-center text-[10px] font-bold">
                                            <div className="flex-1 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                                                <p className="text-sm font-display text-[#DF3B94]">45</p>
                                                <p className="text-[8px] text-slate-400">DÍAS</p>
                                            </div>
                                            <div className="flex-1 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                                                <p className="text-sm font-display text-[#F5B837]">12</p>
                                                <p className="text-[8px] text-slate-400">HORAS</p>
                                            </div>
                                        </div>

                                        <button className="w-full py-3 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md">
                                            Confirmar Asistencia
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Top-Right Floating Card: Live RSVP Counter */}
                            <div className="absolute -top-4 -right-2 lg:-right-10 z-30 p-5 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-100 w-[240px] xs:w-[260px] animate-fade-in">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#4E7B55] animate-pulse" />
                                        <span className="text-[11px] font-bold text-slate-800">RSVP en Vivo</span>
                                    </div>
                                    <span className="px-2 py-0.5 bg-[#fdf2f8] text-[#DF3B94] text-[10px] font-bold rounded-full">84%</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                                        <span>142 Asistirán</span>
                                        <span className="text-slate-400">Meta: 170</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-gradient-to-r from-[#DF3B94] to-[#F5B837] h-full rounded-full w-[84%]" />
                                    </div>
                                    <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                                        <div className="h-6 w-6 rounded-full bg-[#4E7B55]/15 text-[#4E7B55] flex items-center justify-center font-bold text-[10px]">
                                            ✓
                                        </div>
                                        <span className="truncate">Familia Morales +3 confirmados</span>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Bottom-Left Floating Card: QR Digital Pass */}
                            <div className="absolute bottom-6 -left-4 lg:-left-12 z-30 p-4 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-100 w-[230px] xs:w-[250px]">
                                <div className="flex items-center gap-3">
                                    {/* Simulación QR Code */}
                                    <div className="h-12 w-12 rounded-2xl bg-slate-900 p-2 flex flex-wrap gap-1 items-center justify-center shrink-0">
                                        <div className="w-3 h-3 bg-white rounded-sm" />
                                        <div className="w-3 h-3 bg-[#DF3B94] rounded-sm" />
                                        <div className="w-3 h-3 bg-[#F5B837] rounded-sm" />
                                        <div className="w-3 h-3 bg-white rounded-sm" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-bold rounded-md uppercase tracking-wider">Pase QR</span>
                                        <p className="text-xs font-bold text-slate-900 truncate mt-0.5">Roberto Nieto</p>
                                        <p className="text-[10px] text-[#DF3B94] font-semibold">Mesa 12 · 4 Pax</p>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Bottom-Right GPS Pill */}
                            <div className="absolute -bottom-4 right-4 z-30 px-4 py-2 bg-[#222B38] text-white rounded-full shadow-xl border border-white/10 text-xs font-bold flex items-center gap-2">
                                <span className="text-[#F5B837]">📍</span> Waze & Maps integrado
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* --- 3. CAOS VS CONTROL SECTION --- */}
            <section className="py-20 md:py-28 bg-[#FFFFFF] border-y border-slate-100">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38] mb-8">
                        Organizar invitados no debería ser un caos
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 text-left items-center">
                        <div className="space-y-6">
                            <p className="text-slate-600 leading-relaxed text-base">
                                Mensajes por WhatsApp, listas en Excel desactualizadas, gente que no responde, cambios de último minuto…
                            </p>
                            <p className="text-xl font-bold text-[#DF3B94]">
                                Al final, no sabes quién va a ir realmente a tu evento.
                            </p>
                            <p className="text-base text-slate-800 font-medium">
                                <strong>Invitto</strong> resuelve toda la logística en un solo panel fácil y automatizado.
                            </p>
                        </div>
                        <div className="bg-[#F8F9FA] p-8 rounded-3xl space-y-4 border border-slate-100 shadow-sm">
                            {[
                                "WhatsApp saturado de confirmaciones sueltas",
                                "Listas de Excel duplicadas y obsoletas",
                                "Estrés y llamadas de seguimiento a última hora",
                                "Incertidumbre en mesas y pases de entrada"
                            ].map((err, i) => (
                                <div key={i} className="flex items-center gap-3.5 text-slate-600">
                                    <div className="h-6 w-6 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
                                        <X className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="text-sm font-medium">{err}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 4. VISUAL EXPERIENCE SECTION ("Así verán tus invitados tu invitación") --- */}
            <section className="py-20 md:py-32 bg-[#F8F9FA] px-6 border-b border-slate-100">
                <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 md:gap-20 items-center">
                    <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center px-3.5 py-1.5 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#DF3B94]">
                            <span>Experiencia del Invitado</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38] leading-tight">
                            Así verán tus invitados tu invitación
                        </h2>
                        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                            Una experiencia simple, elegante y fácil de usar desde cualquier celular. Sin aplicaciones que descargar, solo un clic y listo.
                        </p>
                        <ul className="space-y-4 max-w-xs mx-auto lg:mx-0 pt-2 text-left">
                            {['Botón de confirmación con 1 toque', 'Flujo simple sin contraseñas', 'Detalles de ceremonia y recepción'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-xs md:text-sm font-bold text-slate-700">
                                    <Check className="h-5 w-5 text-[#4E7B55] flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="pt-4 flex justify-center lg:justify-start">
                            <Link to="/i/cecilia-70" className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#222B38] hover:text-[#DF3B94] transition-colors group">
                                PROBAR DEMO INTERACTIVA <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-[#DF3B94]" />
                            </Link>
                        </div>
                    </div>

                    <div className="relative h-[400px] md:h-[480px] w-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#DF3B94]/5 rounded-full blur-[80px]" />
                        
                        {/* RSVP Card */}
                        <div className="absolute top-4 left-0 z-20 w-56 md:w-64 p-5 bg-white rounded-3xl shadow-xl border border-slate-100 transform -rotate-3 hover:rotate-0 transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-emerald-50 text-[#4E7B55] flex items-center justify-center flex-shrink-0 font-bold">
                                    ✓
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">¡Asistencia Confirmada!</p>
                                    <p className="text-xs text-slate-500">Mesa 12 • 4 pax</p>
                                </div>
                            </div>
                        </div>

                        {/* Event Date Card */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-64 md:w-72 p-6 bg-[#222B38] text-white rounded-3xl shadow-2xl">
                            <p className="text-xs font-bold uppercase tracking-widest text-[#DF3B94] mb-4 text-center">Boda Isabel & Rodrigo</p>
                            <div className="flex justify-center gap-6 mb-6">
                                <div className="text-center">
                                    <p className="text-3xl font-display font-extrabold">45</p>
                                    <p className="text-[10px] uppercase font-bold text-white/50">Días</p>
                                </div>
                                <div className="w-px bg-white/10" />
                                <div className="text-center">
                                    <p className="text-3xl font-display font-extrabold">12</p>
                                    <p className="text-[10px] uppercase font-bold text-white/50">Hrs</p>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-[#DF3B94] hover:bg-[#C52A7C] rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-md transition-colors">
                                Confirmar Asistencia
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 5. WHATSAPP SHARING SECTION ("Comparte por WhatsApp en segundos") --- */}
            <section className="py-20 md:py-32 bg-white px-6 overflow-hidden border-b border-slate-100">
                <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 md:gap-20 items-center">
                    {/* Mockup WhatsApp (Left Column) */}
                    <div className="order-2 lg:order-1 relative flex justify-center items-center">
                        {/* Ambient Glows */}
                        <div className="absolute inset-0 bg-[#25D366]/15 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute top-1/2 left-10 w-64 h-64 bg-[#DF3B94]/10 rounded-full blur-[80px] pointer-events-none" />

                        {/* Top-Right Floating Badge */}
                        <div className="absolute -top-6 -right-2 lg:-right-6 z-30 px-4 py-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 text-xs font-bold text-slate-800 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
                            <span>Tarjeta Automática</span>
                        </div>

                        {/* Smartphone Frame */}
                        <div className="relative z-10 w-full max-w-[290px] xs:max-w-[320px] md:max-w-[340px] bg-slate-900 rounded-[2.8rem] p-3 border-4 md:border-8 border-slate-900 shadow-2xl shadow-[#25D366]/15 flex flex-col h-[520px] overflow-hidden ring-1 ring-slate-800">
                            
                            {/* WhatsApp Header Bar */}
                            <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between text-white shadow-md z-20 rounded-t-[2rem]">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-slate-200 overflow-hidden border border-white/20 shrink-0">
                                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Contacto" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold leading-tight">Familia García</p>
                                        <p className="text-[10px] text-emerald-200 font-medium">en línea</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-white/80 text-xs">
                                    <span>📞</span>
                                    <span>⋮</span>
                                </div>
                            </div>

                            {/* Chat Body Wallpaper */}
                            <div className="flex-1 p-4 flex flex-col justify-end bg-[#E5DDD5] relative overflow-hidden">
                                {/* Subtle doodle texture simulation */}
                                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#075E54_1px,transparent_1px)] [background-size:16px_16px]" />

                                {/* Outgoing Bubble */}
                                <div className="self-end bg-[#DCF8C6] rounded-2xl rounded-tr-none p-3.5 max-w-[95%] shadow-md relative text-xs z-10 border border-[#bce89b]/50">
                                    <p className="text-slate-800 mb-2 leading-relaxed font-normal">
                                        ¡Hola! Nos casamos y nos encantaría que nos acompañen. Pueden ver todos los detalles y confirmar asistencia aquí: 👇
                                    </p>

                                    {/* Link Preview Card */}
                                    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden mb-2 shadow-sm">
                                        <div className="h-32 bg-slate-200 overflow-hidden relative">
                                            <img 
                                                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" 
                                                className="w-full h-full object-cover" 
                                                alt="Boda Isabel & Rodrigo" 
                                            />
                                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-white rounded text-[8px] font-bold uppercase tracking-wider">
                                                Invitación Oficial
                                            </div>
                                        </div>
                                        <div className="p-3 bg-[#F0F2F5]">
                                            <p className="text-xs font-bold text-slate-900 truncate">Boda de Isabel & Rodrigo 💍</p>
                                            <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                                                Toca para ver la ubicación en Maps, el itinerario y confirmar tu asistencia en 1 toque.
                                            </p>
                                            <p className="text-[9px] text-[#075E54] font-bold mt-1.5 uppercase tracking-widest flex items-center gap-1">
                                                <span>INVITTO.COM.MX</span>
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-xs text-blue-600 font-medium hover:underline break-all">
                                        https://invitto.com.mx/i/boda-isa-rodrigo
                                    </p>
                                    
                                    <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 mt-1">
                                        <span>14:30</span>
                                        <span className="text-[#34B7F1] font-bold">✓✓</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom-Left Floating Badge */}
                        <div className="absolute -bottom-4 -left-2 lg:-left-6 z-30 px-4 py-2 bg-[#222B38] text-white rounded-2xl shadow-xl border border-white/10 text-xs font-bold flex items-center gap-2">
                            <span className="text-[#4E7B55]">✓</span> Sin aplicaciones que descargar
                        </div>
                    </div>

                    {/* Copy */}
                    <div className="order-1 lg:order-2 space-y-6 md:space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 rounded-full text-xs font-bold text-[#4E7B55]">
                            <MessageSquare className="h-4 w-4" />
                            <span>Envío Rápido y Nativo</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38] leading-tight">
                            Comparte por WhatsApp en <span className="text-[#4E7B55]">segundos</span>
                        </h2>
                        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                            Copia y pega tu enlace en cualquier chat. WhatsApp generará automáticamente una elegante tarjeta con tu imagen oficial y detalles del evento.
                        </p>
                        <ul className="space-y-4 max-w-sm mx-auto lg:mx-0 pt-2 text-left">
                            <li className="flex items-start gap-3 text-xs md:text-sm font-medium text-slate-700">
                                <Check className="h-5 w-5 text-[#4E7B55] flex-shrink-0" />
                                <span>Tus invitados no tienen que instalar nada.</span>
                            </li>
                            <li className="flex items-start gap-3 text-xs md:text-sm font-medium text-slate-700">
                                <Check className="h-5 w-5 text-[#4E7B55] flex-shrink-0" />
                                <span>Previsualización oficial con imagen del evento.</span>
                            </li>
                            <li className="flex items-start gap-3 text-xs md:text-sm font-medium text-slate-700">
                                <Check className="h-5 w-5 text-[#4E7B55] flex-shrink-0" />
                                <span>Carga instantánea en cualquier celular.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* --- 6. BENTO GRID FEATURE SHOWCASE --- */}
            <section className="py-20 md:py-32 bg-[#F8F9FA]">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center px-3.5 py-1.5 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#DF3B94]">
                            <span>Experiencia SaaS Festiva</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38]">
                            Todo lo que necesitas en módulos inteligentes
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-base">
                            Diseñado con la velocidad de una aplicación moderna y el encanto de una celebración inolvidable.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Bento 1: RSVP Realtime */}
                        <div className="md:col-span-2 bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#DF3B94]/5 transition-all group flex flex-col justify-between">
                            <div>
                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-[#4E7B55] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <BarChart3 className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-display font-bold text-[#222B38] mb-3">
                                    Confirmación RSVP en Tiempo Real
                                </h3>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
                                    Visualiza quién confirmó, cuántos pases usará y qué menú prefirió en un panel en vivo. Sin duplicados y sin perseguir a nadie.
                                </p>
                            </div>
                            <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-slate-100 flex items-center justify-between text-xs font-medium text-slate-700">
                                <span className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#4E7B55]" /> 84 de 100 Confirmados
                                </span>
                                <span className="text-[#DF3B94] font-bold">84% Asistencia</span>
                            </div>
                        </div>

                        {/* Bento 2: QR Pass */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#DF3B94]/5 transition-all group flex flex-col justify-between">
                            <div>
                                <div className="h-12 w-12 rounded-2xl bg-purple-50 text-[#9F7AEA] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <UserCheck className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg md:text-xl font-display font-bold text-[#222B38] mb-2">
                                    Pases QR Digitales
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Boletos individuales con código QR para escaneo rápido en la entrada de tu fiesta.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-[#9F7AEA]">
                                Acceso Ágil & Seguro →
                            </div>
                        </div>

                        {/* Bento 3: Quiniela */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#DF3B94]/5 transition-all group flex flex-col justify-between">
                            <div>
                                <div className="h-12 w-12 rounded-2xl bg-rose-50 text-[#FF6B6B] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <PartyPopper className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg md:text-xl font-display font-bold text-[#222B38] mb-2">
                                    Quiniela & Interacción
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Permite a la familia votar en vivo antes de la gran noticia (niño/niña o canción de vals).
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-[#FF6B6B]">
                                Participación Familiar →
                            </div>
                        </div>

                        {/* Bento 4: Maps & Music */}
                        <div className="md:col-span-2 bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#DF3B94]/5 transition-all group flex flex-col justify-between">
                            <div>
                                <div className="h-12 w-12 rounded-2xl bg-[#fdf2f8] text-[#DF3B94] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Music className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-display font-bold text-[#222B38] mb-3">
                                    Navegación GPS, Música & Mesa de Regalos
                                </h3>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
                                    Tus invitados abren la ubicación directo en Waze o Google Maps, escuchan la canción favorita del evento y ven tu mesa de regalos con 1 toque.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs font-semibold">
                                <span className="px-3 py-1.5 bg-[#F8F9FA] rounded-xl text-slate-700">📍 Waze & Google Maps</span>
                                <span className="px-3 py-1.5 bg-[#F8F9FA] rounded-xl text-slate-700">🎵 Spotify / MP3</span>
                                <span className="px-3 py-1.5 bg-[#fdf2f8] rounded-xl text-[#DF3B94]">🎁 Amazon & Liverpool</span>
                            </div>
                        </div>

                        {/* Bento 5: Reminders */}
                        <div className="md:col-span-2 bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#DF3B94]/5 transition-all group flex flex-col justify-between">
                            <div>
                                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-display font-bold text-[#222B38] mb-3">
                                    Previsualizaciones Perfectas para WhatsApp
                                </h3>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                                    Al compartir tu enlace por WhatsApp, la tarjeta muestra la imagen oficial de tu evento, fecha y nombres con elegancia profesional.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-blue-600">
                                Formato Optimizado para México →
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 7. REVIEWS / HISTORIAS REALES --- */}
            <section className="py-20 md:py-32 bg-white border-y border-slate-100">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#DF3B94]">
                            <Star className="h-4 w-4 fill-current text-[#F5B837]" />
                            <span>Historias Reales</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38]">
                            Parejas y familias que ya confían en Invitto
                        </h2>
                        <p className="text-slate-600 max-w-xl mx-auto text-base">
                            Organiza tu evento sin estrés con la plataforma preferida en México.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: 'No queríamos un grupo gigante de WhatsApp donde todos opinan. Con Invitto enviamos el link y en 3 días teníamos el 80% de las confirmaciones.',
                                names: 'Sofía & Mateo',
                                event: 'Boda en Valle de Bravo • 220 invitados',
                                rating: 5,
                                tag: 'Boda'
                            },
                            {
                                quote: 'El control de pases por familia fue la salvación. Evitamos que primos lejanos trajeran acompañantes no contemplados.',
                                names: 'Familia Morales',
                                event: 'XV Años de Valentina • CDMX',
                                rating: 5,
                                tag: 'XV Años'
                            },
                            {
                                quote: 'Súper fácil de configurar. En 10 minutos la teníamos lista con la ubicación en Google Maps y la mesa de regalos.',
                                names: 'Carolina & Diego',
                                event: 'Bautizo de Sebastián • Guadalajara',
                                rating: 5,
                                tag: 'Bautizo'
                            }
                        ].map((card, i) => (
                            <div key={i} className="bg-[#F8F9FA] p-8 rounded-3xl border border-slate-100 flex flex-col justify-between space-y-6 hover:shadow-xl hover:shadow-[#DF3B94]/5 transition-all">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex text-[#F5B837] gap-1">
                                            {Array.from({ length: card.rating }).map((_, r) => (
                                                <Star key={r} className="h-4 w-4 fill-current" />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-white text-slate-700 rounded-full border border-slate-100">{card.tag}</span>
                                    </div>
                                    <p className="text-sm font-normal italic text-slate-600 leading-relaxed">
                                        "{card.quote}"
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-slate-200/60">
                                    <p className="font-display font-bold text-[#222B38] text-base">{card.names}</p>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">{card.event}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 8. COMPARATIVA RÁPIDA --- */}
            <section className="py-20 md:py-32 bg-[#F8F9FA] px-6">
                <div className="mx-auto max-w-4xl">
                    <div className="text-center mb-14 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38]">
                            ¿Por qué Invitto frente a otras opciones?
                        </h2>
                        <p className="text-slate-600 text-base">Diseñado específicamente para el mercado mexicano</p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 overflow-x-auto">
                        <table className="w-full text-left min-w-[500px]">
                            <thead>
                                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 pb-4">
                                    <th className="pb-4">Característica</th>
                                    <th className="pb-4 text-center text-[#DF3B94]">Invitto</th>
                                    <th className="pb-4 text-center">PDF / Imagen</th>
                                    <th className="pb-4 text-center">Plataformas Globales</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm font-normal">
                                {[
                                    { feature: 'Confirmación en tiempo real (RSVP)', invitto: true, pdf: false, global: true },
                                    { feature: 'Límite de pases por invitado', invitto: true, pdf: false, global: false },
                                    { feature: 'Precios claros en Pesos (MXN)', invitto: true, pdf: 'N/A', global: false },
                                    { feature: 'Envío nativo por WhatsApp', invitto: true, pdf: 'Parcial', global: false },
                                    { feature: 'Sin suscripciones mensuales', invitto: true, pdf: true, global: false },
                                    { feature: 'Ubicación con Waze / Maps', invitto: true, pdf: 'Texto', global: 'A veces' }
                                ].map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 font-semibold text-[#222B38]">{row.feature}</td>
                                        <td className="py-4 text-center font-bold text-[#DF3B94]">
                                            {row.invitto === true ? <Check className="h-5 w-5 mx-auto text-[#4E7B55]" /> : row.invitto}
                                        </td>
                                        <td className="py-4 text-center text-slate-400">
                                            {row.pdf === true ? <Check className="h-4 w-4 mx-auto text-slate-400" /> : row.pdf === false ? <X className="h-4 w-4 mx-auto text-red-400" /> : row.pdf}
                                        </td>
                                        <td className="py-4 text-center text-slate-400">
                                            {row.global === true ? <Check className="h-4 w-4 mx-auto text-slate-400" /> : row.global === false ? <X className="h-4 w-4 mx-auto text-red-400" /> : row.global}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 text-center">
                        <Link to="/comparativas" className="text-xs font-bold uppercase tracking-widest text-[#DF3B94] hover:underline">
                            Ver comparativa detallada contra otras plataformas →
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- 9. PASO A PASO --- */}
            <section className="py-20 md:py-28 bg-[#222B38] text-white relative overflow-hidden px-6">
                <div className="mx-auto max-w-5xl relative z-10">
                    <h2 className="text-3xl md:text-5xl font-display font-extrabold text-center mb-16 leading-tight">
                        Así de fácil funciona Invitto
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Crea tu invitación en minutos', step: '01', desc: 'Escoge tu plantilla y llena los datos de tu fiesta.' },
                            { title: 'Comparte por WhatsApp', step: '02', desc: 'Envía el link directo a tus contactos o grupos.' },
                            { title: 'Ellos confirman con 1 clic', step: '03', desc: 'Sin instalar nada, tus invitados responden al momento.' },
                            { title: 'Tú ves todo organizado', step: '04', desc: 'Tu panel te muestra la lista limpia de pases y mesas.' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4 hover:border-[#DF3B94]/50 transition-all">
                                <span className="text-3xl font-display font-extrabold text-[#DF3B94]">{item.step}</span>
                                <h4 className="text-base font-bold text-white">{item.title}</h4>
                                <p className="text-xs text-slate-400 font-normal leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CONCIERGE / SERVICIO LUXURY SECTION --- */}
            <section className="py-24 md:py-36 bg-[#171E28] text-white px-6 overflow-hidden border-t border-white/5">
                <div className="mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        
                        {/* Left Copy */}
                        <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold tracking-widest text-[#DF3B94]">
                                <Gem className="h-4 w-4 text-[#DF3B94]" />
                                <span>SERVICIO LUXURY</span>
                            </div>

                            <h2 className="text-4xl xs:text-5xl md:text-6xl font-display font-extrabold tracking-tight leading-tight text-white">
                                ¿No tienes tiempo? <br />
                                <span className="italic font-light text-[#DF3B94]">Nosotros lo hacemos todo.</span>
                            </h2>

                            <p className="text-base md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                El plan Concierge: cargamos tus invitados, enviamos cada invitación por WhatsApp, hacemos 4 rondas de seguimiento y te entregamos la lista final confirmada. Tú solo disfrutas.
                            </p>

                            <div className="pt-2 flex justify-center lg:justify-start">
                                <Link to="/concierge-service" className="inline-flex items-center gap-3 text-xs md:text-sm font-bold uppercase tracking-widest text-white hover:text-[#DF3B94] transition-colors group">
                                    SABER MÁS SOBRE CONCIERGE <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-[#DF3B94]" />
                                </Link>
                            </div>
                        </div>

                        {/* Right Card (Dark Glass Container) */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 backdrop-blur-md shadow-2xl">
                                <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                                    <div className="h-12 w-12 rounded-2xl bg-[#DF3B94]/15 text-[#DF3B94] flex items-center justify-center flex-shrink-0">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#DF3B94]">GESTIÓN HUMANA</p>
                                        <p className="text-lg font-display font-bold text-white italic">Tu equipo dedicado</p>
                                    </div>
                                </div>

                                <ul className="space-y-4">
                                    {[
                                        "Cargamos tus invitados por ti",
                                        "Envío individual por WhatsApp",
                                        "4 rondas de seguimiento",
                                        "Reporte final de asistencia"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-200">
                                            <Check className="h-4 w-4 text-[#DF3B94] flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- 10. FAQ SECTION --- */}
            <section className="py-20 md:py-28 bg-white">
                <div className="mx-auto max-w-3xl px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#222B38]">
                            Preguntas Frecuentes
                        </h2>
                        <p className="text-slate-500 text-sm mt-2">Todo lo que necesitas saber antes de empezar</p>
                    </div>

                    <div className="space-y-4">
                        {FAQ_ITEMS.map((item, idx) => (
                            <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden transition-all">
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full p-6 text-left font-bold text-slate-800 flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors"
                                >
                                    <span>{item.question || item.q}</span>
                                    <ChevronDown className={`h-5 w-5 text-[#DF3B94] transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                                </button>
                                {openFaq === idx && (
                                    <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                                        {item.answer || item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 11. CTA BANNER ("Organiza tu evento sin estrés") --- */}
            <section className="relative py-28 md:py-36 bg-[#222B38] text-white text-center px-6 overflow-hidden">
                {/* Background image overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80"
                        alt="Celebration Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#222B38]/90 via-[#222B38]/85 to-[#222B38]" />
                </div>

                <div className="relative z-10 mx-auto max-w-4xl space-y-6">
                    <h2 className="text-4xl xs:text-5xl md:text-7xl font-display font-extrabold tracking-tight leading-tight">
                        Organiza tu evento <br />
                        <span className="italic font-light text-[#DF3B94]">sin estrés</span>
                    </h2>

                    <p className="text-base md:text-xl text-slate-300 font-normal max-w-xl mx-auto leading-relaxed">
                        Empieza hoy y ten control total de tus invitados en minutos.
                    </p>

                    <div className="pt-4">
                        <Link to={user ? "/dashboard" : "/dashboard/new"}>
                            <button className="px-10 py-5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-full text-xs md:text-sm font-bold tracking-widest uppercase hover:-translate-y-0.5 transition-all shadow-2xl active:scale-95">
                                {user ? 'IR AL PANEL' : 'CREAR MI INVITACIÓN'}
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- 12. COMPREHENSIVE FOOTER (As requested in reference image) --- */}
            <footer className="bg-[#222B38] text-white pt-16 pb-12 px-6 border-t border-white/10">
                <div className="mx-auto max-w-7xl space-y-12">
                    
                    {/* Top Guarantee Bar */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-white/10 text-xs">
                        <div className="space-y-1 text-center md:text-left">
                            <p className="font-bold tracking-wider uppercase text-[#DF3B94]">El camino más fácil a tu evento</p>
                            <p className="text-slate-400">Sin mensualidades · Crea gratis · Paga solo al publicar · Sin tarjetas</p>
                        </div>
                        <div className="text-center md:text-right text-slate-400">
                            <p>¿Dudas o algo no cuadra? Escríbenos a <a href="mailto:soporte@invitto.com.mx" className="text-white hover:underline font-bold">soporte@invitto.com.mx</a></p>
                            <p className="text-[11px] text-slate-400 mt-0.5">— Atención prioritaria para los primeros clientes</p>
                        </div>
                    </div>

                    {/* Main Footer Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        
                        {/* Callout Box */}
                        <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
                            <div className="space-y-4">
                                <h3 className="text-2xl md:text-3xl font-display font-extrabold leading-tight text-white">
                                    La invitación digital <br />
                                    <span className="text-[#DF3B94]">que merece tu historia</span>
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                    Crea gratis y publica cuando estés listo: RSVP, pases individuales, código QR y detalles del evento en un solo enlace.
                                </p>
                            </div>
                            <Link to={user ? "/dashboard" : "/dashboard/new"}>
                                <button className="w-full py-4 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-2xl text-xs font-bold tracking-wider transition-all shadow-lg flex items-center justify-center gap-2">
                                    {user ? 'IR AL PANEL' : 'CREAR INVITACIÓN'} <ArrowRight className="h-4 w-4" />
                                </button>
                            </Link>
                        </div>

                        {/* Brand Column */}
                        <div className="lg:col-span-3 space-y-4">
                            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
                                <img src="/logo.png?v=3" alt="Invitto" className="h-8 w-auto object-contain brightness-0 invert" />
                            </Link>
                            <p className="text-xs text-slate-400 font-normal leading-relaxed">
                                Invitaciones digitales de alta gama con control de pases y confirmación inteligente. Diseñado para anfitriones exigentes en México y Latinoamérica.
                            </p>
                        </div>

                        {/* Product Column */}
                        <div className="lg:col-span-2 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-white">Producto</p>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li><Link to="/planes" className="hover:text-white transition-colors">Planes y precios</Link></li>
                                <li><Link to="/ejemplos" className="hover:text-white transition-colors">Ejemplos</Link></li>
                                <li><Link to="/concierge-service" className="hover:text-white transition-colors">Servicio Concierge</Link></li>
                                <li><Link to="/comparativas" className="hover:text-white transition-colors">Comparativas</Link></li>
                                <li><Link to="/blog" className="hover:text-white transition-colors">Blog y consejos</Link></li>
                                <li><Link to="/faq" className="hover:text-white transition-colors">Preguntas frecuentes (FAQ)</Link></li>
                            </ul>
                        </div>

                        {/* Legal & Contact Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-widest text-white">Legal</p>
                                <ul className="space-y-2 text-xs text-slate-400">
                                    <li><Link to="/terminos-y-condiciones" className="hover:text-white transition-colors">Términos</Link></li>
                                    <li><Link to="/aviso-de-privacidad" className="hover:text-white transition-colors">Aviso de privacidad</Link></li>
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-widest text-white">Contacto</p>
                                <ul className="space-y-2 text-xs text-slate-400">
                                    <li><a href="https://wa.me/5215500000000" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp Soporte</a></li>
                                    <li><Link to="/login" className="hover:text-white transition-colors">Iniciar sesión</Link></li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Line */}
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                        <p>© 2026 INVITTO.MX · TODOS LOS DERECHOS RESERVADOS</p>
                        <p>HECHO CON CARIÑO EN MÉXICO</p>
                    </div>

                </div>
            </footer>
        </div>
    );
}