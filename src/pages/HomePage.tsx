import { Link } from 'react-router-dom';
import {
    Check, Star, ChevronDown, ArrowRight,
    X, Users, Gem, Menu
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
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '128',
            bestRating: '5',
            worstRating: '1',
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

            {/* Barra de aviso de una línea arriba del hero */}
            <div className="pt-16 md:pt-20 bg-[#DF3B94] text-white text-[11px] md:text-xs font-bold tracking-wider py-2.5 px-4 text-center border-b border-[#C52A7C] relative z-40">
                <Link to="/confirma" className="inline-flex items-center gap-1.5 hover:underline">
                    <span>Nuevo: Invitto Confirma · confirmamos a tus invitados por ti. 5 lugares de fundadora</span>
                    <span>→</span>
                </Link>
            </div>

            {/* --- 1. HERO SECTION (Optimizado para pliegue en escritorio 1366x800 y móvil) --- */}
            <section className="relative pt-6 pb-10 md:pt-10 md:pb-14 overflow-hidden px-6 bg-gradient-to-b from-[#fdf2f8]/50 via-white to-[#F8F9FA]">
                <div className="mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="space-y-4 md:space-y-5 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#DF3B94]">
                                <span className="h-2 w-2 rounded-full bg-[#DF3B94] animate-pulse" />
                                <span>RSVP inteligente en tiempo real · Sin perseguir invitados</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-extrabold text-[#222B38] tracking-tight leading-[1.15]">
                                Deja de perseguir invitados.<br />
                                <span className="bg-gradient-to-r from-[#DF3B94] via-[#F5B837] to-[#DF3B94] bg-clip-text text-transparent">
                                    Ten el control de tu evento
                                </span><br />
                                desde el primer día.
                            </h1>

                            <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Tus invitados confirman con un clic. Tú ves en tiempo real quién va, quién no y cuántos acompañantes traen. Sin WhatsApp saturado, sin Excel.
                            </p>

                            <div className="space-y-3 pt-1">
                                <div className="flex flex-col xs:flex-row items-center justify-center lg:justify-start gap-3">
                                    <Link to={user ? "/dashboard" : "/dashboard/new"} className="w-full xs:w-auto">
                                        <button className="w-full px-7 py-3.5 md:px-8 md:py-4 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-2xl text-xs md:text-sm font-bold tracking-wider hover:-translate-y-0.5 transition-all active:scale-95 shadow-xl shadow-[#DF3B94]/25 flex items-center justify-center gap-3">
                                            {user ? 'IR AL PANEL' : 'CREAR MI INVITACIÓN'} <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </Link>
                                    <Link to="/i/cumplea%C3%B1os-cecilia-h2657" className="w-full xs:w-auto px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-xs md:text-sm font-bold tracking-wider text-slate-700 hover:text-[#DF3B94] hover:border-[#DF3B94]/30 transition-all flex items-center justify-center gap-2 group shadow-sm">
                                        VER EJEMPLO DEMO <span className="text-lg group-hover:translate-x-1 transition-transform text-[#DF3B94]">→</span>
                                    </Link>
                                </div>

                                {/* Trust, Pricing & Free Trial Anchor */}
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1 text-xs text-slate-500 pt-1">
                                    <span className="font-semibold text-slate-700">Diseña gratis</span>
                                    <span className="text-slate-300">•</span>
                                    <span>Planes desde <strong className="text-[#222B38] font-bold">$499 MXN</strong> (pago único)</span>
                                    <span className="text-slate-300">•</span>
                                    <span>Sin tarjeta para empezar</span>
                                </div>
                            </div>

                            <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
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
                                        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Boda Isabel & Rodrigo" />
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

            {/* --- 2. DEMO INTERACTIVA ("Así verán tus invitados tu invitación") --- */}
            <section className="py-16 md:py-24 bg-[#F8F9FA] px-6 border-b border-slate-100">
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
                            <Link to="/i/cumplea%C3%B1os-cecilia-h2657" className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#222B38] hover:text-[#DF3B94] transition-colors group">
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
                            <p className="text-xs font-bold uppercase tracking-widest text-[#DF3B94] mb-1 text-center">Boda Isabel & Rodrigo</p>
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
                            <button className="w-full py-3 bg-[#DF3B94] hover:bg-[#C52A7C] rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-md transition-colors">
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
                                <h4 className="text-base font-bold text-white">{item.title}</h4>
                                <p className="text-xs text-slate-400 font-normal leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 4. RESUMEN DE PLANES Y PRECIOS --- */}
            <section className="py-20 md:py-32 bg-white px-6 border-b border-slate-100">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#DF3B94]">
                            <Check className="h-3.5 w-3.5 text-[#DF3B94]" />
                            <span>Precios Claros · Un Solo Pago</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38] tracking-tight">
                            Planes diseñados para tu evento
                        </h2>
                        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                            Sin suscripciones mensuales ni sorpresas. Diseña tu invitación gratis y paga únicamente cuando decidas publicarla.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
                        
                        {/* Plan Clásica */}
                        <div className="bg-[#F8F9FA] rounded-3xl p-8 border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all">
                            <div className="space-y-6">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">PLAN BÁSICO</span>
                                    <h3 className="text-2xl font-display font-extrabold text-[#222B38] mt-1">Clásica</h3>
                                    <p className="text-xs text-slate-500 mt-1">Para celebraciones íntimas que solo buscan una invitación hermosa.</p>
                                </div>

                                <div className="py-2 border-y border-slate-200/60">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-4xl md:text-5xl font-serif font-extrabold text-[#222B38]">$499</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase">MXN</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium mt-1">Un solo pago · Sin mensualidades</p>
                                </div>

                                <ul className="space-y-3.5 text-xs text-slate-700 font-medium">
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
                                </ul>
                            </div>

                            <div className="pt-8">
                                <Link to={user ? "/dashboard/new?plan=clasico" : "/planes"}>
                                    <button className="w-full py-3.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-white hover:border-[#DF3B94] hover:text-[#DF3B94] transition-all">
                                        Diseñar Gratis
                                    </button>
                                </Link>
                                <p className="text-[11px] text-slate-500 text-center mt-2.5 font-medium">Borrador gratis · Sin ingresar tarjeta</p>
                            </div>
                        </div>

                        {/* Plan Pro (Destacado) */}
                        <div className="relative bg-slate-900 text-white rounded-3xl p-8 border-2 border-[#DF3B94] shadow-2xl shadow-[#DF3B94]/20 flex flex-col justify-between lg:-translate-y-2">
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#DF3B94] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
                                <Gem className="h-3 w-3" /> MÁS ELEGIDO
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FAC345]">CONTROL TOTAL</span>
                                    <h3 className="text-2xl font-display font-extrabold text-white mt-1">Pro</h3>
                                    <p className="text-xs text-slate-300 mt-1">Para quienes no quieren perseguir invitados ni pagar de más en el banquete.</p>
                                </div>

                                <div className="py-2 border-y border-white/10">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-4xl md:text-5xl font-serif font-extrabold text-white">$1,699</span>
                                        <span className="text-xs font-bold text-[#FAC345] uppercase">MXN</span>
                                    </div>
                                    <p className="text-[11px] text-slate-300 font-medium mt-1">Un solo pago · Activa hasta 30 días después de tu fiesta</p>
                                </div>

                                <ul className="space-y-3.5 text-xs text-slate-200 font-medium">
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#FAC345] flex-shrink-0" />
                                        <span><strong>Todo lo del plan Clásica</strong></span>
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
                                        <span>Importación de invitados desde Excel</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#FAC345] flex-shrink-0" />
                                        <span>Recordatorios de RSVP para tus invitados</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-8">
                                <Link to={user ? "/dashboard/new?plan=pro" : "/planes"}>
                                    <button className="w-full py-4 px-4 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#DF3B94]/30 hover:scale-[1.02] active:scale-95 transition-all">
                                        Probar Plan Pro Gratis
                                    </button>
                                </Link>
                                <p className="text-[11px] text-slate-300 text-center mt-2.5 font-medium">Empieza tu borrador gratis · Pagas al publicar</p>
                            </div>
                        </div>

                        {/* Plan Concierge */}
                        <div className="bg-[#F8F9FA] rounded-3xl p-8 border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all">
                            <div className="space-y-6">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#DF3B94]">TODO INCLUIDO · LLAVE EN MANO</span>
                                    <h3 className="text-2xl font-display font-extrabold text-[#222B38] mt-1">Concierge</h3>
                                    <p className="text-xs text-slate-500 mt-1">Diseño Pro + Invitto Confirma + atención a tus invitados. Nosotros hacemos todo.</p>
                                </div>

                                <div className="py-2 border-y border-slate-200/60">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-4xl md:text-5xl font-serif font-extrabold text-[#222B38]">$4,499</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase">MXN</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium mt-1">Servicio completo con equipo humano</p>
                                </div>

                                <ul className="space-y-3.5 text-xs text-slate-700 font-medium">
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span><strong>Todo lo del plan Diseño Pro (diseño a medida)</strong></span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span><strong>Incluye Invitto Confirma:</strong> confirmamos por ti</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span>3 rondas + llamada a pendientes + reconfirmación</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span>Lista final 15 días antes o garantía de 100%</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                        <span>Línea de atención para dudas de tus invitados</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-8">
                                <Link to="/planes/concierge">
                                    <button className="w-full py-3.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-white hover:border-[#DF3B94] hover:text-[#DF3B94] transition-all">
                                        Conocer Plan Concierge
                                    </button>
                                </Link>
                                <p className="text-[11px] text-slate-500 text-center mt-2.5 font-medium">Servicio completo · Garantía de entrega</p>
                            </div>
                        </div>

                    </div>

                    <div className="mt-12 text-center">
                        <Link 
                            to="/planes" 
                            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-[#DF3B94] hover:text-[#C52A7C] transition-colors"
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
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold tracking-widest text-[#DF3B94]">
                                <Gem className="h-4 w-4 text-[#DF3B94]" />
                                <span>SERVICIO VIP · INVITTO CONFIRMA</span>
                            </div>

                            <h2 className="text-4xl xs:text-5xl md:text-6xl font-display font-extrabold tracking-tight leading-tight text-white">
                                ¿No tienes tiempo? <br />
                                <span className="italic font-light text-[#DF3B94]">Confirmamos a tus invitados por ti.</span>
                            </h2>

                            <p className="text-base md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Con el servicio <strong>Invitto Confirma</strong> tú solo disfrutas: cargamos tus invitados, enviamos cada invitación por WhatsApp, hacemos 3 rondas de seguimiento + 1 llamada a pendientes + reconfirmación 7 días antes, y te entregamos la lista final confirmada 15 días antes del evento (o te devolvemos el 100%).
                            </p>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Link to="/confirma" className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest transition-all shadow-lg shadow-[#DF3B94]/20 group">
                                    <span>SABER MÁS SOBRE INVITTO CONFIRMA</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-white" />
                                </Link>
                                <span className="text-xs text-[#FAC345] font-semibold bg-[#FAC345]/10 px-3.5 py-2 rounded-xl border border-[#FAC345]/20">
                                    ✨ 5 lugares de fundadora disponibles este mes
                                </span>
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

            {/* --- 5. PRUEBA SOCIAL (HISTORIAS REALES) --- */}
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
                                initials: 'SM',
                                event: 'Boda en Valle de Bravo • 220 invitados',
                                rating: 5,
                                tag: 'Boda',
                                demoUrl: '/i/boda-ana-y-carlos'
                            },
                            {
                                quote: 'El control de pases por familia fue la salvación. Evitamos que primos lejanos trajeran acompañantes no contemplados.',
                                names: 'Familia Morales',
                                initials: 'FM',
                                event: 'XV Años de Valentina • CDMX',
                                rating: 5,
                                tag: 'XV Años',
                                demoUrl: '/i/xv-valeria-premium'
                            },
                            {
                                quote: 'Súper fácil de configurar. En 10 minutos la teníamos lista con la ubicación en Google Maps y la mesa de regalos.',
                                names: 'Carolina & Diego',
                                initials: 'CD',
                                event: 'Bautizo de Sebastián • Guadalajara',
                                rating: 5,
                                tag: 'Bautizo',
                                demoUrl: '/i/bautizo-victoria'
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
                                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#fdf2f8] text-[#DF3B94] font-bold text-xs flex items-center justify-center border border-[#fbcfe8] flex-shrink-0">
                                            {card.initials}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <p className="font-display font-bold text-[#222B38] text-base leading-tight">{card.names}</p>
                                                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full">✓ Verificado</span>
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5">{card.event}</p>
                                        </div>
                                    </div>
                                    <Link
                                        to={card.demoUrl}
                                        className="text-[11px] font-bold text-[#DF3B94] hover:text-[#C52A7C] transition-colors inline-flex items-center gap-1 group/demo flex-shrink-0"
                                        title={`Ver invitación demo similar a la de ${card.names}`}
                                    >
                                        <span className="hidden sm:inline">Ver demo</span>
                                        <ArrowRight className="h-3 w-3 group-hover/demo:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
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
                        <p className="text-slate-500 text-sm mt-2">Todo lo que necesitas saber antes de empezar</p>
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
                        src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80"
                        alt=""
                        role="presentation"
                        aria-hidden="true"
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
                        <Link to={user ? "/dashboard" : "/dashboard/new"}>
                            <button className="px-10 py-5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-full text-xs md:text-sm font-bold tracking-widest uppercase hover:-translate-y-0.5 transition-all shadow-2xl active:scale-95 inline-flex items-center gap-2">
                                <span>{user ? 'IR AL PANEL' : 'CREAR MI INVITACIÓN'}</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
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

            {/* --- 12. COMPREHENSIVE FOOTER --- */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
                        
                        {/* Brand Column */}
                        <div className="lg:col-span-5 space-y-4">
                            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
                                <img src="/logo.png?v=3" alt="Invitto" className="h-8 w-auto object-contain brightness-0 invert" />
                            </Link>
                            <p className="text-xs text-slate-400 font-normal leading-relaxed max-w-sm">
                                <strong className="text-white font-bold">invitto.com.mx</strong> es la plataforma oficial de invitaciones digitales con RSVP inteligente en México. Sin comisiones sorpresa, cobro transparente en Pesos (MXN) y soporte local.
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">
                                Bodas · XV Años · Bautizos · Cumpleaños · Eventos Privados
                            </p>
                        </div>

                        {/* Product Column */}
                        <div className="lg:col-span-3 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-white">Producto</p>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li><Link to="/planes" className="hover:text-white transition-colors">Planes y precios</Link></li>
                                <li><Link to="/ejemplos" className="hover:text-white transition-colors">Ejemplos interactivos</Link></li>
                                <li><Link to="/confirma" className="hover:text-white transition-colors">Invitto Confirma</Link></li>
                                <li><Link to="/comparativas" className="hover:text-white transition-colors">Comparativas</Link></li>
                                <li><Link to="/blog" className="hover:text-white transition-colors">Blog y consejos</Link></li>
                                <li><Link to="/faq" className="hover:text-white transition-colors">Preguntas frecuentes (FAQ)</Link></li>
                            </ul>
                        </div>

                        {/* Legal Column */}
                        <div className="lg:col-span-2 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-white">Legal</p>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li><Link to="/terminos-y-condiciones" className="hover:text-white transition-colors">Términos</Link></li>
                                <li><Link to="/aviso-de-privacidad" className="hover:text-white transition-colors">Aviso de privacidad</Link></li>
                                <li><Link to="/cookies" className="hover:text-white transition-colors">Política de cookies</Link></li>
                            </ul>
                        </div>

                        {/* Contact & Access Column */}
                        <div className="lg:col-span-2 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-white">Contacto</p>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li><a href={WHATSAPP_SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp Soporte</a></li>
                                <li><a href="mailto:soporte@invitto.com.mx" className="hover:text-white transition-colors">soporte@invitto.com.mx</a></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Iniciar sesión</Link></li>
                                <li><Link to="/dashboard/new" className="hover:text-white transition-colors">Crear borrador</Link></li>
                            </ul>
                        </div>

                    </div>

                    {/* Bottom Line */}
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                        <p>© 2026 INVITTO.COM.MX · PLATAFORMA OFICIAL EN MÉXICO · TODOS LOS DERECHOS RESERVADOS</p>
                        <p>HECHO CON CARIÑO EN MÉXICO</p>
                    </div>

                </div>
            </footer>
        </div>
    );
}