import { Link } from 'react-router-dom';
import {
    Check, ChevronDown, ArrowRight,
    X, Users, Gem, Menu, Calendar,
    Crown, Wallet, Store, ListChecks, CalendarHeart
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Seo from '../components/Seo';
import { FAQ_ITEMS, FAQ_JSONLD } from '../data/faq';
import { WHATSAPP_SUPPORT_URL } from '../lib/constants';

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
        '@type': 'Product',
        name: 'Invitto — Invitaciones Digitales con RSVP Inteligente',
        description: 'Invitaciones digitales con RSVP en tiempo real por WhatsApp, pases QR y control de asistentes para bodas, XV años y eventos en México.',
        brand: { '@type': 'Brand', name: 'Invitto' },
        offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'MXN',
            lowPrice: '499',
            highPrice: '4499',
            offerCount: '4',
            price: '499',
        },
    },
    FAQ_JSONLD,
];

// Fecha calculada dinámicamente a 45 días en el futuro para que el contador "45 DÍAS 12 HORAS" siempre sea exacto
const MOCK_HERO_DATE = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
})();

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
            <header className="fixed top-0 w-full z-50 bg-white border-b border-slate-100 px-4 md:px-6">
                <div className="mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center hover:opacity-95 transition-opacity">
                        <img
                            src="/logo.png?v=3"
                            alt="Invitto"
                            width={160}
                            height={40}
                            loading="eager"
                            decoding="async"
                            className="h-8 md:h-10 w-auto object-contain"
                        />
                    </Link>

                    <nav className="hidden lg:flex items-center gap-8">
                        <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Ejemplos
                        </Link>
                        <Link to="/save-the-date" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors flex items-center gap-1.5">
                            Save the Date
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#DF3B94]/10 text-[#DF3B94]">Nuevo</span>
                        </Link>
                        <a href="#planeador" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors flex items-center gap-1.5">
                            Planeador
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#111827] text-white">Pro +</span>
                        </a>
                        <Link to="/planes" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Planes
                        </Link>
                        <Link to="/comparativas" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Comparativas
                        </Link>
                        <Link to="/confirma" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Invitto Confirma
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
                            <Link 
                                to="/dashboard"
                                className="min-h-[44px] px-4 py-2 md:px-6 md:py-3 bg-[#C2287B] hover:bg-[#A81B65] text-white rounded-xl text-[10px] md:text-xs uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#C2287B]/20 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center no-underline"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="hidden sm:inline-flex items-center min-h-[44px] text-[10px] md:text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#C2287B] transition-colors">
                                    Ingresar
                                </Link>
                                <Link 
                                    to="/dashboard/new" 
                                    className="hidden sm:flex items-center justify-center min-h-[44px] px-5 py-2.5 md:px-6 md:py-3 bg-[#C2287B] hover:bg-[#A81B65] text-white rounded-xl text-[10px] md:text-xs uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#C2287B]/20 hover:-translate-y-0.5 active:scale-95 no-underline"
                                >
                                    Comenzar
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-slate-100 bg-white px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
                        <Link
                            to="/ejemplos"
                            className="block text-xs uppercase font-bold tracking-widest text-slate-700 hover:text-[#DF3B94] transition-colors py-2 border-b border-slate-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Ejemplos
                        </Link>
                        <Link
                            to="/save-the-date"
                            className="flex items-center justify-between text-xs uppercase font-bold tracking-widest text-slate-700 hover:text-[#DF3B94] transition-colors py-2 border-b border-slate-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span>Save the Date</span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#DF3B94]/10 text-[#DF3B94]">Nuevo</span>
                        </Link>
                        <a
                            href="#planeador"
                            className="flex items-center justify-between text-xs uppercase font-bold tracking-widest text-slate-700 hover:text-[#DF3B94] transition-colors py-2 border-b border-slate-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span>Planeador de Eventos</span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#111827] text-white">Plan Pro +</span>
                        </a>
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
                            to="/confirma"
                            className="block text-xs uppercase font-bold tracking-widest text-slate-700 hover:text-[#DF3B94] transition-colors py-2 border-b border-slate-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Invitto Confirma
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
                                to={user ? '/dashboard' : '/dashboard/new'}
                                className="block w-full text-center px-6 py-3 bg-[#C2287B] hover:bg-[#A81B65] text-white rounded-xl text-xs uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#C2287B]/20 active:scale-95"
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

            {/* --- MAIN CONTENT LANDMARK --- */}
            <main id="main-content">
                {/* Barra de aviso arriba del hero */}
                <div className="mt-16 md:mt-20 bg-[#C2287B] text-white py-3.5 sm:py-4 px-4 text-center border-b border-[#A81B65] relative z-40 shadow-xs">
                    <Link to="/confirma" className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide hover:opacity-95 transition-opacity max-w-4xl mx-auto flex-wrap leading-snug">
                        <span className="bg-emerald-400 text-stone-950 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shrink-0 shadow-sm">
                            NUEVO
                        </span>
                        <span>Nuevo: Invitto Confirma · confirmamos a tus invitados por ti →</span>
                    </Link>
                </div>

                {/* --- 1. HERO SECTION (Optimizado para pliegue en escritorio 1366x800 y móvil) --- */}
                <section className="relative pt-6 pb-10 md:pt-10 md:pb-14 overflow-hidden px-6 bg-gradient-to-b from-[#fdf2f8]/50 via-white to-[#F8F9FA]">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                            <div className="space-y-4 md:space-y-5 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#C2287B]">
                                    <span className="h-2 w-2 rounded-full bg-[#C2287B] animate-pulse" />
                                    <span>RSVP inteligente en tiempo real · Sin perseguir invitados</span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-extrabold text-[#222B38] tracking-tight leading-[1.15]">
                                    Deja de perseguir invitados.<br />
                                    <span className="bg-gradient-to-r from-[#C2287B] via-[#B45309] to-[#C2287B] bg-clip-text text-transparent">
                                        Ten el control de tu evento
                                    </span><br />
                                    desde el primer día.
                                </h1>

                                <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    Tus invitados confirman con un clic. Tú ves en tiempo real quién va, quién no y cuántos acompañantes traen. Sin WhatsApp saturado, sin Excel.
                                </p>

                                <div className="space-y-3 pt-1">
                                    <div className="flex flex-col xs:flex-row items-center justify-center lg:justify-start gap-3">
                                        <Link 
                                            to={user ? "/dashboard" : "/dashboard/new"} 
                                            className="w-full xs:w-auto min-h-[44px] px-7 py-3.5 md:px-8 md:py-4 bg-[#C2287B] hover:bg-[#A81B65] text-white rounded-2xl text-xs md:text-sm font-bold tracking-wider hover:-translate-y-0.5 transition-all active:scale-95 shadow-xl shadow-[#C2287B]/25 flex items-center justify-center gap-3 no-underline"
                                        >
                                            {user ? 'IR AL PANEL' : 'CREAR MI INVITACIÓN'} <ArrowRight className="h-4 w-4" />
                                        </Link>
                                        <Link to="/i/cumplea%C3%B1os-cecilia-h2657" className="w-full xs:w-auto px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-xs md:text-sm font-bold tracking-wider text-slate-700 hover:text-[#C2287B] hover:border-[#C2287B]/30 transition-all flex items-center justify-center gap-2 group shadow-sm">
                                            VER EJEMPLO DEMO <span className="text-lg group-hover:translate-x-1 transition-transform text-[#C2287B]">→</span>
                                        </Link>
                                    </div>

                                    {/* Trust, Pricing & Free Trial Anchor */}
                                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1 text-xs text-slate-600 pt-1">
                                        <span className="font-semibold text-slate-800">Diseña gratis</span>
                                        <span className="text-slate-400">•</span>
                                        <span>Planes desde <strong className="text-[#222B38] font-bold">$499 MXN</strong> (pago único)</span>
                                        <span className="text-slate-400">•</span>
                                        <span>Sin tarjeta para empezar</span>
                                    </div>
                                </div>

                                <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 font-medium">
                                    <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#4E7B55]" /> Confirmaciones WhatsApp</span>
                                    <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#4E7B55]" /> Pases QR</span>
                                    <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#4E7B55]" /> Borrador en 5 min</span>
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
                                            <picture>
                                                <source srcSet="/assets/hero-wedding.avif" type="image/avif" />
                                                <source srcSet="/assets/hero-wedding-400.webp 400w, /assets/hero-wedding.webp 800w" type="image/webp" sizes="(max-width: 640px) 290px, (max-width: 1024px) 320px, 340px" />
                                                <img
                                                    src="/assets/hero-wedding.webp"
                                                    width={340}
                                                    height={450}
                                                    fetchPriority="high"
                                                    loading="eager"
                                                    decoding="async"
                                                    className="w-full h-full object-cover"
                                                    alt="Boda Isabel & Rodrigo"
                                                />
                                            </picture>
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                                            
                                            <div className="absolute bottom-4 left-0 w-full px-5 z-10 text-center">
                                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] uppercase font-bold tracking-widest text-[#F5B837] border border-white/10 inline-block mb-2">
                                                    Nuestra Boda
                                                </span>
                                                <p className="font-display font-extrabold text-2xl drop-shadow-sm text-white">Isabel & Rodrigo</p>
                                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-300 mt-0.5">{MOCK_HERO_DATE}</p>
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
                                        <span className="px-2 py-0.5 bg-[#fdf2f8] text-[#C52A7C] text-[10px] font-bold rounded-full">84%</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-semibold text-slate-600">
                                            <span>142 Asistirán</span>
                                            <span className="text-slate-600">Meta: 170</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div className="bg-gradient-to-r from-[#DF3B94] to-[#F5B837] h-full rounded-full w-[84%]" />
                                        </div>
                                        <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                                            <div className="h-6 w-6 rounded-full bg-[#4E7B55]/15 text-[#4E7B55] flex items-center justify-center font-bold text-[10px]">
                                                ✓
                                            </div>
                                            <span className="truncate">Ejemplo: Invitados confirmados</span>
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

            {/* --- 2. DEMO INTERACTIVA ("Así verán tus invitados tu invitación") --- */}
            <section className="py-16 md:py-24 bg-[#F8F9FA] px-6 border-b border-slate-100">
                <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 md:gap-20 items-center">
                    <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center px-3.5 py-1.5 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#C2287B]">
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
                            <Link to="/i/cumplea%C3%B1os-cecilia-h2657" className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#222B38] hover:text-[#C2287B] transition-colors group">
                                PROBAR DEMO INTERACTIVA <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-[#C2287B]" />
                            </Link>
                        </div>
                    </div>

                    <div className="relative h-[400px] md:h-[480px] w-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#C2287B]/5 rounded-full blur-[80px]" />
                        
                        {/* RSVP Card */}
                        <div className="absolute top-4 left-0 z-20 w-56 md:w-64 p-5 bg-white rounded-3xl shadow-xl border border-slate-100 transform -rotate-3 hover:rotate-0 transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-emerald-50 text-[#4E7B55] flex items-center justify-center flex-shrink-0 font-bold">
                                    ✓
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">¡Asistencia Confirmada!</p>
                                    <p className="text-xs text-slate-600">Mesa 12 • 4 pax</p>
                                </div>
                            </div>
                        </div>

                        {/* Event Date Card */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-64 md:w-72 p-6 bg-[#222B38] text-white rounded-3xl shadow-2xl">
                            <p className="text-xs font-bold uppercase tracking-widest text-[#FF80BF] mb-1 text-center">Boda Isabel & Rodrigo</p>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-300 text-center mb-4">{MOCK_HERO_DATE}</p>
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
                            <button className="w-full py-3 bg-[#C2287B] hover:bg-[#A81B65] rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-md transition-colors">
                                Confirmar Asistencia
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 3. CÓMO FUNCIONA (PASO A PASO) --- */}
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
                                <h3 className="text-base font-bold text-white">{item.title}</h3>
                                <p className="text-xs text-slate-400 font-normal leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 4. ASÍ SE VE UNA INVITACIÓN INVITTO --- */}
            <section className="py-20 md:py-32 bg-white border-y border-slate-100">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center px-3.5 py-1.5 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#C52A7C]">
                            <span>Diseños Reales</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38]">
                            Así se ve una invitación Invitto
                        </h2>
                        <p className="text-slate-600 max-w-xl mx-auto text-base">
                            Explora nuestras plantillas interactivas y prueba la experiencia tal como la recibirán tus invitados.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Boda Elegante Clásica',
                                names: 'Isabel & Rodrigo',
                                event: 'Boda de Ensueño',
                                description: 'Tipografía serif sofisticada, sobre digital interactivo y confirmación por pases familiares.',
                                tag: 'Boda',
                                demoUrl: '/i/boda-isabel-rodrigo-premium'
                            },
                            {
                                title: 'XV Años Glamour',
                                names: 'Valeria',
                                event: 'Mis XV Años',
                                description: 'Diseño moderno con cuenta regresiva, código de vestimenta, mesa de regalos y pase QR.',
                                tag: 'XV Años',
                                demoUrl: '/i/xv-valeria-premium'
                            },
                            {
                                title: 'Cumpleaños & Fiesta',
                                names: 'Emilia',
                                event: 'Festejo Especial',
                                description: 'Música de fondo, mapa interactivo para salón y confirmación ágil vía WhatsApp.',
                                tag: 'Cumpleaños',
                                demoUrl: '/i/cumple-emilia-premium'
                            }
                        ].map((card, i) => (
                            <div key={i} className="bg-[#F8F9FA] p-8 rounded-3xl border border-slate-100 flex flex-col justify-between space-y-6 hover:shadow-xl hover:shadow-[#DF3B94]/5 transition-all">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200/60 font-mono">
                                            Ejemplo
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-white text-slate-700 rounded-full border border-slate-100">
                                            {card.tag}
                                        </span>
                                    </div>
                                    <h3 className="font-display font-extrabold text-[#222B38] text-xl leading-tight">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm font-normal text-slate-600 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                                    <div>
                                        <p className="font-display font-bold text-[#222B38] text-sm leading-tight">{card.names}</p>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">{card.event}</p>
                                    </div>
                                    <Link
                                        to={card.demoUrl}
                                        className="px-4 py-2 bg-white hover:bg-slate-50 text-[#C2287B] border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 shadow-2xs hover:-translate-y-0.5"
                                        title={`Ver demo de ${card.title}`}
                                    >
                                        <span>Ver Demo</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link
                            to="/ejemplos"
                            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-[#222B38] hover:text-[#C2287B] transition-colors group"
                        >
                            <span>VER TODOS LOS EJEMPLOS Y PLANTILLAS</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-[#C2287B]" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- 4.5. SAVE THE DATE (10 Diseños de una sola pantalla) --- */}
            <section id="save-the-date" className="py-20 md:py-28 bg-[#F7F2EA] px-6 border-b border-stone-200/60 relative overflow-hidden">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="space-y-6 max-w-2xl text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#DF3B94]">
                                <Calendar className="h-3.5 w-3.5 text-[#DF3B94]" />
                                <span>Nuevo · Save the Date Digital</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38] tracking-tight leading-tight">
                                Aparta la fecha meses antes de enviar la invitación
                            </h2>
                            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                                Una sola pantalla ultra rápida con nombres, fecha, ciudad, cuenta regresiva y botón directo para agregar a Google Calendar y Apple Calendar. Perfecto para bodas en destino, XV años y aniversarios.
                            </p>
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-bold text-slate-700 pt-2">
                                <span className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl shadow-xs border border-stone-200/80">
                                    <Check className="h-4 w-4 text-[#4E7B55]" /> 10 estilos tipográficos
                                </span>
                                <span className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl shadow-xs border border-stone-200/80">
                                    <Check className="h-4 w-4 text-[#4E7B55]" /> Enlace propio (/std/tu-evento)
                                </span>
                                <span className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl shadow-xs border border-stone-200/80">
                                    <Check className="h-4 w-4 text-[#4E7B55]" /> Incluido en Diseño Pro y Concierge
                                </span>
                            </div>
                            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                                <Link
                                    to="/std/demo-editorial"
                                    className="min-h-[44px] px-6 py-3.5 bg-[#222B38] hover:bg-[#111827] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
                                >
                                    <span>Ver los 10 diseños de Save the Date</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    to="/planes"
                                    className="min-h-[44px] px-6 py-3.5 bg-white hover:bg-stone-50 border border-stone-300 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center"
                                >
                                    Ver en los Planes (+$299 o incluido)
                                </Link>
                            </div>
                        </div>

                        {/* Interactive Preview Mockup Card */}
                        <div className="w-full max-w-sm sm:max-w-md lg:max-w-sm flex-shrink-0">
                            <div className="bg-white rounded-3xl p-5 shadow-2xl border border-stone-200/80 transform hover:-translate-y-1 transition-all">
                                <div className="rounded-2xl overflow-hidden aspect-[9/16] max-h-[480px] bg-stone-900 relative flex flex-col justify-between p-6 text-white text-center">
                                    <img
                                        src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                                        alt="Save the Date Preview"
                                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                                    />
                                    <div className="relative z-10">
                                        <p className="text-[10px] uppercase tracking-widest font-mono text-stone-200">Save the Date</p>
                                    </div>
                                    <div className="relative z-10 space-y-2">
                                        <h3 className="font-serif text-3xl md:text-4xl font-normal tracking-wide italic">Isabel & Rodrigo</h3>
                                        <p className="text-xs uppercase tracking-widest text-stone-200">24 · OCTUBRE · 2026</p>
                                        <p className="text-[11px] text-stone-300">San Miguel de Allende, Gto.</p>
                                    </div>
                                    <div className="relative z-10 pt-2">
                                        <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md border border-white/40 rounded-full text-[11px] font-bold text-white tracking-wider uppercase">
                                            + Agendar en Calendario
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                                    <span className="font-bold text-[#222B38]">Diseño Editorial</span>
                                    <Link to="/std/demo-editorial" className="text-[#DF3B94] font-bold hover:underline flex items-center gap-1">
                                        Probar en vivo <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 4.7. PLANEADOR DE EVENTOS (Exclusivo Plan Pro en adelante) --- */}
            <section id="planeador" className="py-20 md:py-28 bg-[#111827] text-white px-6 relative overflow-hidden border-b border-stone-800">
                {/* Luces decorativas sutiles de fondo */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#DF3B94]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#FAC345]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="mx-auto max-w-7xl relative z-10">
                    <div className="text-center max-w-3xl mx-auto space-y-5">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#DF3B94]/20 border border-[#DF3B94]/40 rounded-full text-xs font-bold text-[#FF85C0]">
                            <Crown className="h-4 w-4 text-[#FAC345]" />
                            <span>Módulo Exclusivo · Plan Pro en adelante</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
                            Planeador de Eventos: Presupuesto, Proveedores y el Día B
                        </h2>
                        <p className="text-slate-300 text-base md:text-lg leading-relaxed font-normal">
                            Tu boda o festejo no solo necesita una invitación bonita, necesita orden. Centraliza pagos, cotizaciones, contratos y el itinerario minuto a minuto directamente dentro de tu panel de Invitto.
                        </p>
                        
                        {/* Callout de gating claro y permanente */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300">
                            <span className="h-2 w-2 rounded-full bg-[#FAC345]" />
                            <span><strong>Incluido en:</strong> Plan Pro ($1,699 MXN), Diseño Pro y Concierge. <em>(No disponible en Plan Clásica).</em></span>
                        </div>
                    </div>

                    {/* Grid de 4 pilares de Planeación */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* 1. Presupuesto */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="h-12 w-12 rounded-2xl bg-[#DF3B94]/20 border border-[#DF3B94]/30 flex items-center justify-center text-[#FF85C0]">
                                    <Wallet className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-display font-extrabold text-white">Presupuesto y Pagos</h3>
                                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                    Desglosa por rubros (salón, música, flores, foto). Monitorea anticipos, liquidaciones y alertas de fechas de vencimiento con medias de referencia del mercado.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-[#FAC345] flex items-center justify-between">
                                <span>Control de saldos</span>
                                <span>Exporta a CSV</span>
                            </div>
                        </div>

                        {/* 2. Directorio Proveedores */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                    <Store className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-display font-extrabold text-white">Directorio de Proveedores</h3>
                                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                    Guarda fichas de cada proveedor con contacto directo a WhatsApp, cotizaciones comparativas, notas y contratos asignados.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-emerald-400 flex items-center justify-between">
                                <span>WhatsApp directo</span>
                                <span>Compara ofertas</span>
                            </div>
                        </div>

                        {/* 3. Pendientes Auto-fechados */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                    <ListChecks className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-display font-extrabold text-white">Pendientes por Fases</h3>
                                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                    Checklist inteligente calculado automáticamente según la fecha de tu evento: 12 meses antes, 6 meses, 1 mes, última semana y después de la boda.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-amber-400 flex items-center justify-between">
                                <span>Cronograma vivo</span>
                                <span>Avance en %</span>
                            </div>
                        </div>

                        {/* 4. Carpeta Día B */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="h-12 w-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                                    <CalendarHeart className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-display font-extrabold text-white">Carpeta del Día B en PDF</h3>
                                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                    Genera con un solo clic el itinerario minuto a minuto con cortejo, fotógrafo y teléfonos de emergencia, listo para imprimir para tu wedding planner.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-purple-400 flex items-center justify-between">
                                <span>Descarga PDF</span>
                                <span>Minuto a minuto</span>
                            </div>
                        </div>
                    </div>

                    {/* Barra de acción inferior */}
                    <div className="mt-12 p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1 text-center md:text-left">
                            <p className="text-lg font-bold text-white">¿Listo para organizar tu evento sin estrés?</p>
                            <p className="text-xs text-slate-400">Elige el Plan Pro al crear tu evento y desbloquea el Planeador inmediatamente.</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <Link
                                to="/planes"
                                className="min-h-[44px] px-6 py-3.5 bg-[#DF3B94] hover:bg-[#C2287B] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#DF3B94]/25 inline-flex items-center gap-2 no-underline"
                            >
                                <span>Ver Planes con Planeador (desde $1,699)</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                to="/dashboard/planeacion/demo"
                                className="min-h-[44px] px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center no-underline"
                            >
                                <span>Ver Demo del Planeador</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 5. ¿QUÉ CELEBRAS? (8 Event Types) --- */}
            <section className="py-20 md:py-28 bg-[#F8F9FA] px-6 border-b border-slate-100">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <div className="inline-flex items-center px-3.5 py-1.5 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#C52A7C]">
                            <span>Invitaciones por Categoría</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38] tracking-tight">
                            ¿Qué celebras?
                        </h2>
                        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                            Cada evento tiene su propia magia y necesidades especiales. Elige tu tipo de fiesta para ver funciones diseñadas para ti.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {[
                            { title: 'Boda', slug: 'invitaciones-digitales-boda', icon: '💍', desc: 'Diseños románticos, confirmación por familia, pases y mesa de regalos.' },
                            { title: 'XV Años', slug: 'invitaciones-digitales-xv-anos', icon: '👑', desc: 'Vals, música, padrinos, cuenta regresiva y pase de acceso con QR.' },
                            { title: 'Cumpleaños', slug: 'invitaciones-digitales-cumpleanos', icon: '🎂', desc: 'Festejos para todas las edades sin el caos de los grupos de WhatsApp.' },
                            { title: 'Bautizo', slug: 'invitaciones-digitales-bautizo', icon: '🕊️', desc: 'Diseños angelicales con sección de padrinos, iglesia y comida familiar.' },
                            { title: 'Primera Comunión', slug: 'invitaciones-digitales-primera-comunion', icon: '⛪', desc: 'Ceremonia solemne, horarios puntuales, mapas y confirmación rápida.' },
                            { title: 'Baby Shower', slug: 'invitaciones-digitales-baby-shower', icon: '🍼', desc: 'Mesa de regalos Liverpool/Amazon, guía de pañales y confirmación tierna.' },
                            { title: 'Revelación de Género', slug: 'invitaciones-digitales-revelacion-de-genero', icon: '🎈', desc: '¿Team Rosa o Azul? Dinámicas interactivas y cuenta regresiva al gran secreto.' },
                            { title: 'Graduación', slug: 'invitaciones-digitales-graduacion', icon: '🎓', desc: 'Pases de gala individuales, check-in con QR y fotos de generación.' }
                        ].map((event, idx) => (
                            <Link
                                key={idx}
                                to={`/${event.slug}`}
                                className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-[#DF3B94]/40 hover:shadow-xl hover:shadow-[#DF3B94]/5 transition-all group flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    <div className="w-12 h-12 rounded-2xl bg-[#fdf2f8] text-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        {event.icon}
                                    </div>
                                    <h3 className="text-xl font-display font-extrabold text-[#222B38] group-hover:text-[#C2287B] transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                        {event.desc}
                                    </p>
                                </div>
                                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#C2287B]">
                                    <span>Ver invitación</span>
                                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 6. RESUMEN DE PLANES Y PRECIOS --- */}
            <section className="py-20 md:py-32 bg-white px-6 border-b border-slate-100">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#C52A7C]">
                            <Check className="h-3.5 w-3.5 text-[#C52A7C]" />
                            <span>Precios Claros · Un Solo Pago</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38] tracking-tight">
                            Planes diseñados para tu evento
                        </h2>
                        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                            Sin suscripciones mensuales ni sorpresas. Diseña tu invitación gratis y paga únicamente cuando decidas publicarla.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch max-w-7xl mx-auto">
                        
                        {/* Plan Clásica */}
                        <div className="bg-[#F8F9FA] rounded-3xl p-7 border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all">
                            <div className="space-y-6">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">PLAN BÁSICO</span>
                                    <h3 className="text-2xl font-display font-extrabold text-[#222B38] mt-1">Clásica</h3>
                                    <p className="text-xs text-slate-600 mt-1">Solo lo básico: para celebraciones íntimas que buscan una invitación hermosa.</p>
                                </div>

                                <div className="py-2 border-y border-slate-200/60">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-4xl font-serif font-extrabold text-[#222B38]">$499</span>
                                        <span className="text-xs font-bold text-slate-600 uppercase">MXN</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 font-medium mt-1">Un solo pago · Activa hasta 30 días después de tu evento</p>
                                </div>

                                <ul className="space-y-3 text-xs text-slate-700 font-medium">
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span>Información del evento y cuenta regresiva</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span>Ubicación interactiva con Google Maps & Waze</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span>Galería de fotos y mesa de regalos</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span>Confirmación de asistencia por WhatsApp</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span>Save the Date digital (+$299 MXN opcional)</span>
                                    </li>
                                    <li className="flex items-center gap-2.5 text-slate-400">
                                        <X className="h-4 w-4 text-slate-300 flex-shrink-0" />
                                        <span>Planeador de eventos (requiere Plan Pro)</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-8">
                                <Link 
                                    to="/dashboard/new?plan=clasico"
                                    className="w-full min-h-[44px] py-3.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-white hover:border-[#DF3B94] hover:text-[#DF3B94] transition-all flex items-center justify-center text-center no-underline"
                                >
                                    Diseñar Gratis
                                </Link>
                                <p className="text-[11px] text-slate-600 text-center mt-2.5 font-medium">Borrador gratis · Sin ingresar tarjeta</p>
                            </div>
                        </div>

                        {/* Plan Pro (Destacado) */}
                        <div className="relative bg-slate-900 text-white rounded-3xl p-7 border-2 border-[#C2287B] shadow-2xl shadow-[#C2287B]/20 flex flex-col justify-between lg:-translate-y-2">
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#C2287B] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
                                <Gem className="h-3 w-3" /> MÁS ELEGIDO
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FAC345]">CONTROL TOTAL</span>
                                    <h3 className="text-2xl font-display font-extrabold text-white mt-1">Pro</h3>
                                    <p className="text-xs text-slate-300 mt-1">Control total: para quienes no quieren perseguir invitados ni pagar de más en el banquete.</p>
                                </div>

                                <div className="py-2 border-y border-white/10">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-4xl font-serif font-extrabold text-white">$1,699</span>
                                        <span className="text-xs font-bold text-[#FAC345] uppercase">MXN</span>
                                    </div>
                                    <p className="text-[11px] text-slate-300 font-medium mt-1">Un solo pago · Activa hasta 30 días después de tu evento</p>
                                </div>

                                <ul className="space-y-3 text-xs text-slate-200 font-medium">
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#FAC345] flex-shrink-0" />
                                        <span><strong>Todo lo del plan Clásica</strong></span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#FAC345] flex-shrink-0" />
                                        <span><strong>Planeador de Eventos Premium</strong> (presupuesto, proveedores, pagos y Día B)</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#FAC345] flex-shrink-0" />
                                        <span><strong>Pases digitales con código QR individual</strong></span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#FAC345] flex-shrink-0" />
                                        <span>Dashboard de confirmaciones en tiempo real</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#FAC345] flex-shrink-0" />
                                        <span>Límite de pases y acompañantes por familia</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#FAC345] flex-shrink-0" />
                                        <span>Recordatorios de RSVP para tus invitados</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#FAC345] flex-shrink-0" />
                                        <span>Save the Date digital (+$299 MXN opcional)</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-8">
                                <Link 
                                    to="/dashboard/new?plan=pro"
                                    className="w-full min-h-[44px] py-4 px-4 bg-[#C2287B] hover:bg-[#A81B65] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#C2287B]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center text-center no-underline"
                                >
                                    Probar Plan Pro Gratis
                                </Link>
                                <p className="text-[11px] text-slate-300 text-center mt-2.5 font-medium">Empieza tu borrador gratis · Pagas al publicar</p>
                            </div>
                        </div>

                        {/* Plan Diseño Pro */}
                        <div className="bg-[#F8F9FA] rounded-3xl p-7 border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all">
                            <div className="space-y-6">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#B45309]">PERSONALIZADO</span>
                                    <h3 className="text-2xl font-display font-extrabold text-[#222B38] mt-1">Diseño Pro</h3>
                                    <p className="text-xs text-slate-600 mt-1">Diseño a tu medida: plantillas exclusivas, paleta y tipografía adaptadas a tu concepto.</p>
                                </div>

                                <div className="py-2 border-y border-slate-200/60">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-4xl font-serif font-extrabold text-[#222B38]">$2,499</span>
                                        <span className="text-xs font-bold text-slate-600 uppercase">MXN</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 font-medium mt-1">Un solo pago · Activa hasta 30 días después de tu evento</p>
                                </div>

                                <ul className="space-y-3 text-xs text-slate-700 font-medium">
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span><strong>Todo lo del plan Pro</strong> (incluye Planeador)</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span><strong>Plantillas exclusivas de alta gama</strong></span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span>Ajuste de tipografía y paleta por diseñador</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span><strong>Save the Date digital incluido</strong></span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span>Música de fondo personalizada</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span>Soporte prioritario por WhatsApp</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-8">
                                <Link 
                                    to="/dashboard/new?plan=premium"
                                    className="w-full min-h-[44px] py-3.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-white hover:border-[#DF3B94] hover:text-[#DF3B94] transition-all flex items-center justify-center text-center no-underline"
                                >
                                    Elegir Diseño Pro
                                </Link>
                                <p className="text-[11px] text-slate-600 text-center mt-2.5 font-medium">Empieza tu borrador gratis · Pagas al publicar</p>
                            </div>
                        </div>

                        {/* Plan Concierge */}
                        <div className="bg-[#F8F9FA] rounded-3xl p-7 border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all">
                            <div className="space-y-6">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C2287B]">TODO INCLUIDO · LLAVE EN MANO</span>
                                    <h3 className="text-2xl font-display font-extrabold text-[#222B38] mt-1">Concierge</h3>
                                    <p className="text-xs text-slate-600 mt-1">Nosotros hacemos todo: Diseño Pro + Invitto Confirma (llamamos y confirmamos a tus invitados).</p>
                                </div>

                                <div className="py-2 border-y border-slate-200/60">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-4xl font-serif font-extrabold text-[#222B38]">$4,499</span>
                                        <span className="text-xs font-bold text-slate-600 uppercase">MXN</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 font-medium mt-1">Un solo pago · Activa hasta 30 días después de tu evento</p>
                                </div>

                                <ul className="space-y-3 text-xs text-slate-700 font-medium">
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span><strong>Todo lo del plan Diseño Pro</strong> (incluye Planeador)</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span><strong>Incluye Invitto Confirma:</strong> confirmamos por ti</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span><strong>Save the Date digital incluido</strong></span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span>3 rondas + llamada a pendientes + reconfirmación</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span>Lista final cerrada 15 días antes del evento</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span>Atención dedicada a dudas de tus invitados</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-8">
                                <Link 
                                    to="/planes/concierge"
                                    className="w-full min-h-[44px] py-3.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-white hover:border-[#C2287B] hover:text-[#C2287B] transition-all flex items-center justify-center text-center no-underline"
                                >
                                    Conocer Plan Concierge
                                </Link>
                                <p className="text-[11px] text-slate-600 text-center mt-2.5 font-medium">Servicio completo · Garantía de entrega</p>
                            </div>
                        </div>

                    </div>

                    <div className="mt-12 text-center">
                        <Link 
                            to="/planes" 
                            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-[#C2287B] hover:text-[#A81B65] transition-colors"
                        >
                            <span>¿Quieres ver la comparativa completa de 29 características?</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- INVITTO CONFIRMA / SERVICIO VIP BANNER (Inmediatamente debajo de Precios) --- */}
            <section className="py-20 md:py-28 bg-[#171E28] text-white px-6 overflow-hidden border-t border-white/5">
                <div className="mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        
                        {/* Left Copy */}
                        <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold tracking-widest text-[#FF80BF]">
                                <Gem className="h-4 w-4 text-[#FF80BF]" />
                                <span>SERVICIO VIP · INVITTO CONFIRMA</span>
                            </div>

                            <h2 className="text-4xl xs:text-5xl md:text-6xl font-display font-extrabold tracking-tight leading-tight text-white">
                                ¿No tienes tiempo? <br />
                                <span className="italic font-light text-[#FF80BF]">Confirmamos a tus invitados por ti.</span>
                            </h2>

                            <p className="text-base md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Con el servicio <strong>Invitto Confirma</strong> tú solo disfrutas: cargamos tus invitados, enviamos cada invitación por WhatsApp, hacemos 3 rondas de seguimiento + 1 llamada a pendientes + reconfirmación 7 días antes, y te entregamos la lista final confirmada 15 días antes del evento (o te devolvemos el 100%).
                            </p>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Link to="/confirma" className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#C2287B] hover:bg-[#A81B65] text-white rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest transition-all shadow-lg shadow-[#C2287B]/20 group">
                                    <span>SABER MÁS SOBRE INVITTO CONFIRMA</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-white" />
                                </Link>
                                <span className="text-xs text-[#FAC345] font-semibold bg-[#FAC345]/10 px-3.5 py-2 rounded-xl border border-[#FAC345]/20">
                                    Servicio disponible para cualquier plan
                                </span>
                            </div>
                        </div>

                        {/* Right Card (Dark Glass Container) */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 backdrop-blur-md shadow-2xl">
                                <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                                    <div className="h-12 w-12 rounded-2xl bg-[#C2287B]/20 text-[#FF80BF] flex items-center justify-center flex-shrink-0">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF80BF]">GESTIÓN HUMANA</p>
                                        <p className="text-lg font-display font-bold text-white italic">Tu equipo dedicado</p>
                                    </div>
                                </div>

                                <ul className="space-y-4">
                                    {[
                                        "Cargamos tus invitados por ti",
                                        "Envío individual por WhatsApp",
                                        "3 rondas de seguimiento + llamada a pendientes",
                                        "Garantía: lista final 15 días antes o devolución 100%",
                                        "Reporte final de asistencia impreso y digital"
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



            {/* --- 6. PREGUNTAS FRECUENTES --- */}
            <section className="py-20 md:py-28 bg-white">
                <div className="mx-auto max-w-3xl px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#222B38]">
                            Preguntas Frecuentes
                        </h2>
                        <p className="text-slate-600 text-sm mt-2">Todo lo que necesitas saber antes de empezar</p>
                    </div>

                    <div className="space-y-4">
                        {FAQ_ITEMS.map((item, idx) => (
                            <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden transition-all">
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    aria-expanded={openFaq === idx}
                                    aria-controls={`faq-answer-${idx}`}
                                    id={`faq-question-${idx}`}
                                    className="w-full p-6 text-left font-bold text-slate-800 flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors"
                                >
                                    <span>{item.question || item.q}</span>
                                    <ChevronDown className={`h-5 w-5 text-[#DF3B94] transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                                </button>
                                <div 
                                    id={`faq-answer-${idx}`}
                                    role="region"
                                    aria-labelledby={`faq-question-${idx}`}
                                    className={`px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50 ${openFaq === idx ? 'block' : 'hidden'}`}
                                >
                                    {item.answer || item.a}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 7. CTA BANNER ("Organiza tu evento sin estrés") --- */}
            <section className="relative py-28 md:py-36 bg-[#222B38] text-white text-center px-6 overflow-hidden">
                {/* Background image overlay (decorative with empty alt) */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=75&fm=webp&auto=format&fit=crop"
                        alt=""
                        role="presentation"
                        aria-hidden="true"
                        width={1200}
                        height={600}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover opacity-20 pointer-events-none select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#222B38]/90 via-[#222B38]/85 to-[#222B38]" />
                </div>

                <div className="relative z-10 mx-auto max-w-4xl space-y-6">
                    <h2 className="text-4xl xs:text-5xl md:text-7xl font-display font-extrabold tracking-tight leading-tight">
                        Organiza tu evento <br />
                        <span className="italic font-light text-[#DF3B94]">sin estrés</span>
                    </h2>

                    <p className="text-xl md:text-2xl font-display text-white font-medium max-w-2xl mx-auto pt-1">
                        La invitación digital que merece tu historia
                    </p>

                    <p className="text-sm md:text-base text-slate-300 font-normal max-w-xl mx-auto leading-relaxed">
                        Crea tu borrador gratis y publica cuando estés listo. RSVP inteligente, pases con código QR y confirmaciones por WhatsApp en un solo enlace.
                    </p>

                    <div className="pt-4 space-y-4">
                        <Link 
                            to={user ? "/dashboard" : "/dashboard/new"}
                            className="min-h-[44px] px-10 py-5 bg-[#C2287B] hover:bg-[#A81B65] text-white rounded-full text-xs md:text-sm font-bold tracking-widest uppercase hover:-translate-y-0.5 transition-all shadow-2xl active:scale-95 inline-flex items-center justify-center gap-2 no-underline"
                        >
                            <span>{user ? 'IR AL PANEL' : 'CREAR MI INVITACIÓN'}</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <p className="text-xs text-slate-400 font-medium">
                            Diseña gratis tu borrador · Planes desde $499 MXN pago único · Sin tarjeta de crédito requerida
                        </p>
                        <p className="text-xs text-slate-400 pt-1">
                            ¿Dudas o necesitas asesoría personalizada? Escríbenos a{' '}
                            <a href="mailto:soporte@invitto.com.mx" className="text-white hover:underline font-bold">
                                soporte@invitto.com.mx
                            </a>
                            {' '}o por{' '}
                            <a href={WHATSAPP_SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline font-bold">
                                WhatsApp
                            </a>
                        </p>
                    </div>
                </div>
            </section>
            </main>

            {/* --- 12. COMPREHENSIVE FOOTER --- */}
            <footer className="bg-[#222B38] text-white pt-16 pb-12 px-6 border-t border-white/10">
                <div className="mx-auto max-w-7xl space-y-12">
                    
                    {/* Top Guarantee Bar */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-white/10 text-xs">
                        <div className="space-y-1 text-center md:text-left">
                            <p className="font-bold tracking-wider uppercase text-[#FF80BF]">El camino más fácil a tu evento</p>
                            <p className="text-slate-400">Sin mensualidades · Crea gratis · Paga solo al publicar · Sin tarjetas</p>
                        </div>
                        <div className="text-center md:text-right text-slate-400">
                            <p>¿Dudas o algo no cuadra? Escríbenos a <a href="mailto:soporte@invitto.com.mx" className="text-white hover:underline font-bold">soporte@invitto.com.mx</a></p>
                            <p className="text-[11px] text-slate-400 mt-0.5">— Atención prioritaria para los primeros clientes</p>
                        </div>
                    </div>

                    {/* Main Footer Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-8">
                        
                        {/* Brand Column */}
                        <div className="col-span-2 md:col-span-3 lg:col-span-3 space-y-4">
                            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
                                <img
                                    src="/logo.png?v=3"
                                    alt="Invitto"
                                    width={128}
                                    height={32}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-8 w-auto object-contain brightness-0 invert"
                                />
                            </Link>
                            <p className="text-xs text-slate-400 font-normal leading-relaxed max-w-sm">
                                <strong className="text-white font-bold">invitto.com.mx</strong> es la plataforma oficial de invitaciones digitales con RSVP inteligente en México. Sin comisiones sorpresa, cobro transparente en Pesos (MXN) y soporte local.
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium">
                                León, Guanajuato · Hecho en México
                            </p>
                        </div>

                        {/* Invitaciones para... Column */}
                        <div className="col-span-1 md:col-span-1 lg:col-span-3 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-white">Invitaciones para…</p>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li><Link to="/invitaciones-digitales-boda" className="hover:text-white transition-colors">Bodas</Link></li>
                                <li><Link to="/invitaciones-digitales-xv-anos" className="hover:text-white transition-colors">XV Años</Link></li>
                                <li><Link to="/invitaciones-digitales-cumpleanos" className="hover:text-white transition-colors">Cumpleaños</Link></li>
                                <li><Link to="/invitaciones-digitales-bautizo" className="hover:text-white transition-colors">Bautizos</Link></li>
                                <li><Link to="/invitaciones-digitales-primera-comunion" className="hover:text-white transition-colors">Primera Comunión</Link></li>
                                <li><Link to="/invitaciones-digitales-baby-shower" className="hover:text-white transition-colors">Baby Shower</Link></li>
                                <li><Link to="/invitaciones-digitales-revelacion-de-genero" className="hover:text-white transition-colors">Revelación de Género</Link></li>
                                <li><Link to="/invitaciones-digitales-graduacion" className="hover:text-white transition-colors">Graduaciones</Link></li>
                            </ul>
                        </div>

                        {/* Por ciudad Column */}
                        <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-white">Por ciudad</p>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li><Link to="/invitaciones-digitales-cdmx" className="hover:text-white transition-colors">CDMX</Link></li>
                                <li><Link to="/invitaciones-digitales-guadalajara" className="hover:text-white transition-colors">Guadalajara</Link></li>
                                <li><Link to="/invitaciones-digitales-monterrey" className="hover:text-white transition-colors">Monterrey</Link></li>
                                <li><Link to="/invitaciones-digitales-leon" className="hover:text-white transition-colors">León, Gto.</Link></li>
                            </ul>
                        </div>

                        {/* Product Column */}
                        <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-white">Producto</p>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li><Link to="/planes" className="hover:text-white transition-colors">Planes y precios</Link></li>
                                <li><Link to="/ejemplos" className="hover:text-white transition-colors">Ejemplos</Link></li>
                                <li><Link to="/save-the-date" className="hover:text-white transition-colors">Save the Date</Link></li>
                                <li><Link to="/confirma" className="hover:text-white transition-colors">Invitto Confirma</Link></li>
                                <li><Link to="/comparativas" className="hover:text-white transition-colors">Comparativas</Link></li>
                                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                            </ul>
                        </div>

                        {/* Contact & Legal Column */}
                        <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-white">Contacto y Legal</p>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li><a href={WHATSAPP_SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp Soporte</a></li>
                                <li><a href="mailto:soporte@invitto.com.mx" className="hover:text-white transition-colors">soporte@invitto.com.mx</a></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Iniciar sesión</Link></li>
                                <li><Link to="/terminos-y-condiciones" className="hover:text-white transition-colors">Términos</Link></li>
                                <li><Link to="/aviso-de-privacidad" className="hover:text-white transition-colors">Privacidad</Link></li>
                            </ul>
                        </div>

                    </div>

                    {/* Bottom Line */}
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-widest text-slate-400 font-bold">
                        <p>© {new Date().getFullYear()} INVITTO.COM.MX · PLATAFORMA OFICIAL EN MÉXICO · TODOS LOS DERECHOS RESERVADOS</p>
                        <p>HECHO CON CARIÑO EN MÉXICO</p>
                    </div>

                </div>
            </footer>
        </div>
    );
}