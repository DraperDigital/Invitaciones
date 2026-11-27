import { Link } from 'react-router-dom';
import {
    Check, ChevronDown, ArrowRight, ChevronLeft,
    X, Users, Gem, Menu, Calendar,
    Crown, Wallet, Store, ListChecks, CalendarHeart,
    MessageCircle, Clock, QrCode
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Seo from '../components/Seo';
import { RAW_FAQ_ITEMS, FAQ_JSONLD } from '../data/faq';
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

interface HeroSlide {
    tag: string;
    names: string;
    event: string;
    image: string;
    alt: string;
    demoUrl: string;
}

const HERO_SLIDES: HeroSlide[] = [
    {
        tag: 'Nuestra Boda',
        names: 'Isabel & Rodrigo',
        event: 'Clásica Atemporal',
        image: '/screenshots_plantillas/01_classic.jpg',
        alt: 'Invitación digital de boda Clásica Atemporal - Isabel & Rodrigo',
        demoUrl: '/i/boda-isabel-rodrigo-premium',
    },
    {
        tag: 'Mis XV Años',
        names: 'Valeria',
        event: 'Estilo Editorial',
        image: '/screenshots_plantillas/05_magazine.jpg',
        alt: 'Invitación digital de XV años estilo revista - Valeria',
        demoUrl: '/i/xv-valeria-premium',
    },
    {
        tag: 'Cumpleaños',
        names: 'Emilia',
        event: 'Fiesta Neón',
        image: '/screenshots_plantillas/09_neon-glow.jpg',
        alt: 'Invitación digital de cumpleaños Fiesta Neón - Emilia',
        demoUrl: '/i/cumple-emilia-premium',
    },
    {
        tag: 'Mi Bautizo',
        names: 'Victoria',
        event: 'Fantasía Infantil',
        image: '/screenshots_plantillas/20_whimsical-kids.jpg',
        alt: 'Invitación digital de bautizo Fantasía Infantil - Victoria',
        demoUrl: '/i/bautizo-victoria-premium',
    },
    {
        tag: 'Baby Shower',
        names: 'Mateo Emiliano',
        event: 'Nube de Miel',
        image: '/screenshots_plantillas/13_nube-de-miel.jpg',
        alt: 'Invitación digital de baby shower Nube de Miel - Mateo Emiliano',
        demoUrl: '/i/baby-nube-de-miel',
    },
];

const FEATURE_CHIPS = [
    'Confirmación WhatsApp',
    'Pases con Código QR',
    'Mesa de Regalos',
    'Música de Fondo',
    'Cuenta Regresiva',
    'Mapa Waze & Maps',
    'Código de Vestimenta',
    'Libro de Firmas',
    'Itinerario Minuto a Minuto',
    'Save the Date Digital',
    'Galería de Fotos',
    'Recordatorios Automáticos',
];

const OCCASIONS = [
    {
        id: 'boda',
        name: 'Boda',
        icon: '💍',
        slug: 'invitaciones-digitales-boda',
        badge: 'Clásica Atemporal',
        title: 'Boda Isabel & Rodrigo',
        names: 'Isabel & Rodrigo',
        event: 'Boda de Ensueño',
        description: 'Sobre digital interactivo con sello de lacre, tipografía serif de lujo, confirmación por pases familiares y mesa de regalos Liverpool/Amazon.',
        demoUrl: '/i/boda-isabel-rodrigo-premium',
        previewImage: '/screenshots_plantillas/01_classic.jpg',
        features: ['Sobre interactivo con lacre', 'Pases familiares y niños', 'Mesa de regalos en línea'],
    },
    {
        id: 'xv-anos',
        name: 'XV Años',
        icon: '👑',
        slug: 'invitaciones-digitales-xv-anos',
        badge: 'Estilo Editorial',
        title: 'XV Años Valeria',
        names: 'Valeria',
        event: 'Mis XV Años',
        description: 'Portada estilo revista editorial de moda, música de vals, sección de chambelanes y padrinos, y pase QR para control de acceso al salón.',
        demoUrl: '/i/xv-valeria-premium',
        previewImage: '/screenshots_plantillas/05_magazine.jpg',
        features: ['Portada estilo revista', 'Vals, chambelanes y padrinos', 'Pase QR para acceso al salón'],
    },
    {
        id: 'cumpleanos',
        name: 'Cumpleaños',
        icon: '🎂',
        slug: 'invitaciones-digitales-cumpleanos',
        badge: 'Fiesta Neón',
        title: 'Cumpleaños Emilia',
        names: 'Emilia',
        event: 'Fiesta Neón & Party',
        description: 'Diseño vibrante para festejar a lo grande con música de fondo, mapa con GPS Waze/Maps integrado y confirmación ágil con un clic.',
        demoUrl: '/i/cumple-emilia-premium',
        previewImage: '/screenshots_plantillas/09_neon-glow.jpg',
        features: ['Mapa con GPS Waze & Maps', 'Confirmación 1 toque vía WhatsApp', 'Música de fondo activa'],
    },
    {
        id: 'infantil',
        name: 'Infantil',
        icon: '🎈',
        slug: 'invitaciones-digitales-infantiles',
        badge: 'Zoológico Aventura',
        title: 'Cumpleaños Zair',
        names: 'Zair',
        event: 'Zoológico Aventura',
        description: 'Expedición salvaje con animales safari, mapa al salón de fiestas, cuenta regresiva y confirmación con desglose de adultos y niños.',
        demoUrl: '/i/cumpleanos-zoologico-zair',
        previewImage: '/screenshots_plantillas/21_kids-farm.jpg',
        features: ['Temática safari con animales', 'Desglose de pases adultos y niños', 'Mapa directo al salón de fiestas'],
    },
    {
        id: 'bautizo',
        name: 'Bautizo',
        icon: '🕊️',
        slug: 'invitaciones-digitales-bautizo',
        badge: 'Fantasía Infantil',
        title: 'Bautizo de Victoria',
        names: 'Victoria',
        event: 'Mi Bautizo',
        description: 'Diseño angelical con foto circular, sección dedicada a padrinos y bendición, misa en templo parroquial, mapa al salón y confirmación familiar.',
        demoUrl: '/i/bautizo-victoria-premium',
        previewImage: '/screenshots_plantillas/20_whimsical-kids.jpg',
        features: ['Sección de padrinos y bendición', 'Misa y recepción con mapa', 'Confirmación familiar sencilla'],
    },
    {
        id: 'baby-shower',
        name: 'Baby Shower',
        icon: '🍼',
        slug: 'invitaciones-digitales-baby-shower',
        badge: 'Nube de Miel',
        title: 'Baby Shower Mateo Emiliano',
        names: 'Mateo Emiliano',
        event: 'Esperando a Mateo Emiliano',
        description: 'Sobre digital con apertura suave, diseño tierno Nube de Miel, mesa de regalos Liverpool, guía de pañales por etapa y confirmación con un toque.',
        demoUrl: '/i/baby-nube-de-miel',
        previewImage: '/screenshots_plantillas/13_nube-de-miel.jpg',
        features: ['Mesa de regalos Liverpool', 'Guía de tallas y pañales', 'Sobre digital interactivo'],
    },
    {
        id: 'revelacion-de-genero',
        name: 'Revelación',
        icon: '🎈',
        slug: 'invitaciones-digitales-revelacion-de-genero',
        badge: 'Dúo Rosa & Azul',
        title: '¿Mateo o Sofía? Revelación',
        names: '¿Mateo o Sofía?',
        event: 'Gran Revelación de Género',
        description: 'Dinámica interactiva Team Niño vs Team Niña con votación en tiempo real, cuenta regresiva al momento de la revelación y confirmación.',
        demoUrl: '/i/gender-reveal-mateo-o-sofia-premium',
        previewImage: '/screenshots_plantillas/26_reveal-duo.jpg',
        features: ['Votación Team Niño vs Team Niña', 'Cuenta regresiva al gran secreto', 'Mesa de regalos Amazon'],
    },
    {
        id: 'graduacion',
        name: 'Graduación',
        icon: '🎓',
        slug: 'invitaciones-digitales-graduacion',
        badge: 'Retro Fotográfico',
        title: 'Graduación Ana - Lic. en Psicología',
        names: 'Ana',
        event: 'Licenciada en Psicología',
        description: 'Plantilla tipo Polaroid con recuerdos de generación, itinerario de acto académico y fiesta de gala con código QR para control en puerta.',
        demoUrl: '/i/graduacion-ana-psicologia-premium',
        previewImage: '/screenshots_plantillas/12_polaroid-vintage.jpg',
        features: ['Estilo Polaroid vintage', 'Acto académico y fiesta de gala', 'Pases individuales con QR'],
    },
    {
        id: 'aniversario',
        name: 'Gala / Aniversario',
        icon: '💎',
        slug: 'invitaciones-digitales-boda',
        badge: 'Lujo Metálico',
        title: 'Gala de Aniversario',
        names: 'Gala de Aniversario',
        event: 'Noche de Distinción',
        description: 'Elegancia de etiqueta rigurosa con acentos dorados sobre fondo oscuro, código de vestimenta, confirmación y pases de gala.',
        demoUrl: '/i/gala-aniversario-premium',
        previewImage: '/screenshots_plantillas/10_luxury-gold.jpg',
        features: ['Acentos dorados metálicos', 'Pases de gala con QR', 'Código de etiqueta rigurosa'],
    },
];

const FAQ_GROUPS = [
    {
        category: 'Invitaciones y RSVP',
        items: [
            RAW_FAQ_ITEMS[0], // descargar app
            RAW_FAQ_ITEMS[2], // editar información
            RAW_FAQ_ITEMS[3], // rsvp inteligente
            RAW_FAQ_ITEMS[7], // xv años y méxico
            RAW_FAQ_ITEMS[8], // save the date
            RAW_FAQ_ITEMS[9], // compartir por whatsapp
        ].filter(Boolean),
    },
    {
        category: 'Planes, Pagos y Garantía',
        items: [
            RAW_FAQ_ITEMS[1], // tiempo disponible
            RAW_FAQ_ITEMS[4], // crear sin pagar
            RAW_FAQ_ITEMS[5], // métodos de pago
            RAW_FAQ_ITEMS[6], // tarjeta para empezar
        ].filter(Boolean),
    },
];

export default function HomePage() {
    const { user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<string | null>(null);

    // Hero Slider state
    const [heroSlide, setHeroSlide] = useState(0);
    const [isHeroHovered, setIsHeroHovered] = useState(false);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);

    // Gallery Tabs state
    const [activeOccasion, setActiveOccasion] = useState(0);

    // Dark Band (Planeador + Confirma) Tabs state
    const [darkTab, setDarkTab] = useState<'planeador' | 'confirma'>('planeador');

    // Autoplay hero slider
    useEffect(() => {
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        if (isHeroHovered) return;
        const timer = setInterval(() => {
            setHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 3500);
        return () => clearInterval(timer);
    }, [isHeroHovered]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (diff > 40) {
            setHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        } else if (diff < -40) {
            setHeroSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
        }
        setTouchStartX(null);
    };

    const toggleFaq = (key: string) => {
        setOpenFaq(openFaq === key ? null : key);
    };

    const currentSlide = HERO_SLIDES[heroSlide] || HERO_SLIDES[0];
    const currentOccasion = OCCASIONS[activeOccasion] || OCCASIONS[0];

    return (
        <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#222B38]">
            <Seo
                title="Invitaciones digitales para bodas, XV años y eventos | Invitto"
                description="Crea tu invitación digital con confirmación automática, recordatorios por WhatsApp y seguimiento en tiempo real. Sin perseguir invitados. Planes desde $499 MXN."
                path="/"
                image="https://invitto.com.mx/logo.png"
                jsonLd={HOMEPAGE_JSONLD}
            />

            {/* Custom Keyframes for Marquee */}
            <style>{`
                @keyframes marqueeScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-smooth {
                    display: flex;
                    width: max-content;
                    animation: marqueeScroll 30s linear infinite;
                }
                .animate-marquee-smooth:hover {
                    animation-play-state: paused;
                }
                @media (prefers-reduced-motion: reduce) {
                    .animate-marquee-smooth {
                        animation: none;
                        flex-wrap: wrap;
                        justify-content: center;
                        width: auto;
                    }
                }
            `}</style>

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
                {/* 1. Barra de aviso arriba del hero */}
                <div className="mt-16 md:mt-20 bg-[#C2287B] text-white py-3.5 sm:py-4 px-4 text-center border-b border-[#A81B65] relative z-40 shadow-xs">
                    <Link to="/confirma" className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide hover:opacity-95 transition-opacity max-w-4xl mx-auto flex-wrap leading-snug">
                        <span className="bg-emerald-400 text-stone-950 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shrink-0 shadow-sm">
                            NUEVO
                        </span>
                        <span>Nuevo: Invitto Confirma · confirmamos a tus invitados por ti →</span>
                    </Link>
                </div>

                {/* --- 2. HERO SECTION CON SLIDER DE INVITACIONES (TAREA A) --- */}
                <section className="relative pt-6 pb-12 md:pt-10 md:pb-16 overflow-hidden px-6 bg-gradient-to-b from-[#fdf2f8]/50 via-white to-[#F8F9FA]">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                            
                            {/* Left Column: Value Proposition & CTAs */}
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
                                    Tus invitados confirman con un toque. Tú ves en tiempo real quién asiste, quién no y sus acompañantes. Sin saturar tu WhatsApp ni hojas de cálculo.
                                </p>

                                <div className="space-y-3 pt-1">
                                    <div className="flex flex-col xs:flex-row items-center justify-center lg:justify-start gap-3">
                                        <Link 
                                            to={user ? "/dashboard" : "/dashboard/new"} 
                                            className="w-full xs:w-auto min-h-[44px] px-7 py-3.5 md:px-8 md:py-4 bg-[#C2287B] hover:bg-[#A81B65] text-white rounded-2xl text-xs md:text-sm font-bold tracking-wider hover:-translate-y-0.5 transition-all active:scale-95 shadow-xl shadow-[#C2287B]/25 flex items-center justify-center gap-3 no-underline"
                                        >
                                            {user ? 'IR AL PANEL' : 'CREAR MI INVITACIÓN'} <ArrowRight className="h-4 w-4" />
                                        </Link>
                                        <Link to={currentSlide.demoUrl} className="w-full xs:w-auto px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-xs md:text-sm font-bold tracking-wider text-slate-700 hover:text-[#C2287B] hover:border-[#C2287B]/30 transition-all flex items-center justify-center gap-2 group shadow-sm">
                                            VER DEMO EN VIVO <span className="text-lg group-hover:translate-x-1 transition-transform text-[#C2287B]">→</span>
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

                            {/* Right Column: Interactive Phone Slider with Floating Cards */}
                            <div 
                                className="relative mt-8 lg:mt-0 flex flex-col items-center justify-center"
                                onMouseEnter={() => setIsHeroHovered(true)}
                                onMouseLeave={() => setIsHeroHovered(false)}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            >
                                {/* Ambient Glows */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#DF3B94]/10 rounded-full blur-[100px] pointer-events-none" />
                                <div className="absolute top-1/3 left-10 w-72 h-72 bg-[#F5B837]/15 rounded-full blur-[80px] pointer-events-none" />

                                {/* 1. Main Smartphone Frame */}
                                <div className="relative z-20 mx-auto w-full max-w-[290px] xs:max-w-[320px] lg:max-w-[340px] aspect-[9/18] bg-slate-900 rounded-[2.8rem] p-3 shadow-2xl shadow-[#222B38]/20 ring-1 ring-slate-800 select-none">
                                    {/* Speaker notch */}
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-center">
                                        <div className="w-3 h-1 bg-slate-800 rounded-full" />
                                    </div>

                                    {/* Phone Screen: Muestra la captura y diseño real de cada invitación */}
                                    <div className="w-full h-full bg-slate-950 rounded-[2.2rem] overflow-hidden relative shadow-inner select-none">
                                        <Link 
                                            to={currentSlide.demoUrl} 
                                            className="block w-full h-full relative group"
                                            title={`Probar demo interactiva de ${currentSlide.names}`}
                                        >
                                            <img
                                                src={currentSlide.image}
                                                alt={currentSlide.alt}
                                                width={340}
                                                height={680}
                                                fetchPriority={heroSlide === 0 ? "high" : "auto"}
                                                loading={heroSlide === 0 ? "eager" : "lazy"}
                                                decoding="async"
                                                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                                            />
                                            {/* Barra flotante inferior para probar demo en vivo */}
                                            <div className="absolute bottom-3 left-3 right-3 z-10 py-2.5 px-3 bg-black/75 backdrop-blur-md rounded-xl text-center border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg group-hover:bg-[#C2287B] group-hover:border-[#C2287B] transition-all">
                                                <span>{currentSlide.names} · Probar Demo</span>
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                {/* --- Tarjetas Flotantes en Desktop (Ubicadas a los costados para no tapar la invitación) --- */}

                                {/* 1. Desktop: Top-Right Floating Card (RSVP en Vivo) */}
                                <div className="hidden lg:block lg:absolute lg:-right-14 xl:-right-20 lg:top-6 z-30 p-5 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-100 w-[240px] animate-fade-in">
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

                                {/* 2. Desktop: Bottom-Left Floating Card (Pase QR) */}
                                <div className="hidden lg:block lg:absolute lg:-left-14 xl:-left-20 lg:bottom-14 z-30 p-4 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-100 w-[230px]">
                                    <div className="flex items-center gap-3">
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

                                {/* 3. Desktop: Bottom-Right GPS Pill */}
                                <div className="hidden lg:flex lg:absolute lg:-bottom-2 lg:right-2 z-30 px-4 py-2 bg-[#222B38] text-white rounded-full shadow-xl border border-white/10 text-xs font-bold items-center gap-2">
                                    <span className="text-[#F5B837]">📍</span> Waze & Maps integrado
                                </div>

                                {/* --- Badges sutiles en Móvil (en los bordes del marco sin tapar foto ni textos) --- */}
                                <div className="lg:hidden absolute -top-3 right-2 z-30 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full shadow-md border border-slate-200/80 flex items-center gap-1.5 text-[10px] font-bold text-slate-800">
                                    <span className="h-2 w-2 rounded-full bg-[#4E7B55] animate-pulse" />
                                    <span>RSVP 84%</span>
                                    <span className="text-slate-400 font-normal">· 142 van</span>
                                </div>

                                <div className="lg:hidden absolute -bottom-3 left-2 z-30 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full shadow-md border border-slate-200/80 flex items-center gap-1.5 text-[10px] font-bold text-slate-800">
                                    <span className="text-xs">🎟️</span>
                                    <span>Pase QR</span>
                                    <span className="text-slate-400 font-normal">· Mesa 12</span>
                                </div>

                                {/* Slider Controls: Dots + Prev/Next Buttons */}
                                <div className="mt-5 flex items-center justify-center gap-4 z-20">
                                    <button
                                        onClick={() => setHeroSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                                        className="p-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors shadow-2xs"
                                        aria-label="Invitación anterior"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {HERO_SLIDES.map((slide, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setHeroSlide(idx)}
                                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                                    heroSlide === idx ? 'w-7 bg-[#C2287B]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                                                }`}
                                                aria-label={`Ver ejemplo de ${slide.tag}`}
                                                aria-selected={heroSlide === idx}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                                        className="p-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors shadow-2xs"
                                        aria-label="Siguiente invitación"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Resumen de funciones en móvil (debajo de los controles, limpio y ordenado) */}
                                <div className="lg:hidden mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px]">
                                    <span className="px-3 py-1 bg-white rounded-full border border-slate-200 shadow-2xs text-slate-700 font-medium flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-[#4E7B55]" /> 84% confirmados en vivo
                                    </span>
                                    <span className="px-3 py-1 bg-white rounded-full border border-slate-200 shadow-2xs text-slate-700 font-medium flex items-center gap-1.5">
                                        <span>🎟️</span> Pases QR
                                    </span>
                                    <span className="px-3 py-1 bg-white rounded-full border border-slate-200 shadow-2xs text-slate-700 font-medium flex items-center gap-1.5">
                                        <span>📍</span> Waze & Maps
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 3. CÓMO FUNCIONA (COMPACTO) --- */}
                <section className="py-16 md:py-20 bg-[#222B38] text-white relative overflow-hidden px-6">
                    <div className="mx-auto max-w-5xl relative z-10">
                        <div className="text-center mb-12 space-y-2">
                            <h2 className="text-2xl md:text-4xl font-display font-extrabold leading-tight">
                                Así de fácil funciona Invitto
                            </h2>
                            <p className="text-slate-300 text-sm">Cuatro pasos simples para tener el control total de tu evento</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Crea tu invitación', step: '01', desc: 'Elige tu plantilla y llena los detalles de tu evento.' },
                                { title: 'Comparte el enlace', step: '02', desc: 'Envía por WhatsApp a contactos individuales o grupos.' },
                                { title: 'Confirman con un clic', step: '03', desc: 'Sin descargar apps, tus invitados responden al instante.' },
                                { title: 'Todo en tu panel', step: '04', desc: 'Monitorea confirmados, declinados, mesas y pases QR.' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3 hover:border-[#DF3B94]/50 transition-all">
                                    <span className="text-2xl font-display font-extrabold text-[#DF3B94]">{item.step}</span>
                                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                                    <p className="text-xs text-slate-400 font-normal leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- 4. MARQUEE DE FUNCIONES (SCROLL INFINITO) (TAREA B) --- */}
                <section className="py-3 bg-gradient-to-r from-[#fdf2f8]/80 via-white to-[#fdf2f8]/80 border-y border-[#fbcfe8]/60 overflow-hidden relative group" aria-label="Funciones destacadas">
                    <div className="animate-marquee-smooth flex items-center gap-3 whitespace-nowrap">
                        {[...FEATURE_CHIPS, ...FEATURE_CHIPS].map((chip, i) => (
                            <span 
                                key={i} 
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#fbcfe8] text-[#C2287B] shadow-2xs hover:bg-[#fdf2f8] transition-colors"
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-[#DF3B94]" />
                                {chip}
                            </span>
                        ))}
                    </div>
                </section>

                {/* --- 5. GALERÍA CON TABS POR OCASIÓN (FUSIÓN: "ASÍ SE VE" + "¿QUÉ CELEBRAS?") (TAREA C) --- */}
                <section className="py-16 md:py-24 bg-white border-b border-slate-100">
                    <div className="mx-auto max-w-7xl px-6">
                        
                        {/* Compact Header */}
                        <div className="text-center mb-10 space-y-3">
                            <div className="inline-flex items-center px-3.5 py-1.5 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#C52A7C]">
                                <span>Galería Interactiva por Ocasión</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38] tracking-tight">
                                Diseños reales para cada celebración
                            </h2>
                            <p className="text-slate-600 max-w-xl mx-auto text-sm md:text-base">
                                Explora cómo se ve y funciona cada diseño según tu tipo de festejo.
                            </p>
                        </div>

                        {/* Occasion Filter Tabs (Horizontal Scrollable on Mobile) */}
                        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 no-scrollbar">
                            {OCCASIONS.map((occ, idx) => (
                                <button
                                    key={occ.id}
                                    onClick={() => setActiveOccasion(idx)}
                                    className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 border ${
                                        activeOccasion === idx
                                            ? 'bg-[#222B38] text-white border-[#222B38] shadow-md'
                                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-[#C2287B]'
                                    }`}
                                >
                                    <span>{occ.icon}</span>
                                    <span>{occ.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Interactive Showcase Card for Selected Occasion */}
                        <div className="mt-8 bg-gradient-to-br from-[#F8F9FA] to-white p-6 md:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100">
                            <div className="grid lg:grid-cols-12 gap-8 items-center">
                                
                                {/* Left Info Column */}
                                <div className="lg:col-span-7 space-y-5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200/60 font-mono">
                                            Ejemplo en Vivo
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-white text-slate-700 rounded-full border border-slate-200">
                                            {currentOccasion.badge}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="font-display font-extrabold text-[#222B38] text-2xl md:text-3xl leading-tight">
                                            {currentOccasion.title}
                                        </h3>
                                        <p className="text-sm font-semibold text-[#C2287B] mt-1">{currentOccasion.names} · {currentOccasion.event}</p>
                                    </div>

                                    <p className="text-sm md:text-base font-normal text-slate-600 leading-relaxed max-w-xl">
                                        {currentOccasion.description}
                                    </p>

                                    {/* Features Chips */}
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {currentOccasion.features.map((feat, fIdx) => (
                                            <span key={fIdx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs">
                                                <Check className="h-3.5 w-3.5 text-[#4E7B55]" />
                                                {feat}
                                            </span>
                                        ))}
                                    </div>

                                    {/* CTAs */}
                                    <div className="pt-4 flex flex-wrap items-center gap-4">
                                        <Link
                                            to={currentOccasion.demoUrl}
                                            className="px-6 py-3 bg-[#C2287B] hover:bg-[#A81B65] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-lg shadow-[#C2287B]/20"
                                        >
                                            <span>Probar Demo en Vivo</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                        <Link
                                            to={`/${currentOccasion.slug}`}
                                            className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#C2287B] border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 shadow-2xs"
                                        >
                                            <span>Ver detalles de {currentOccasion.name}</span>
                                            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Right Preview: Tarjeta con captura real de la plantilla */}
                                <div className="lg:col-span-5 flex justify-center">
                                    <Link 
                                        to={currentOccasion.demoUrl}
                                        className="w-full max-w-[270px] xs:max-w-[290px] aspect-[9/16] rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl group block relative bg-slate-900 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#C2287B]/10"
                                        title={`Probar demo de ${currentOccasion.title}`}
                                    >
                                        <img
                                            src={currentOccasion.previewImage}
                                            alt={currentOccasion.title}
                                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 justify-center">
                                            <span className="w-full py-2.5 bg-white text-slate-900 group-hover:bg-[#C2287B] group-hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 transition-colors">
                                                <span>Ver Demo en Vivo</span>
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </span>
                                        </div>
                                    </Link>
                                </div>

                            </div>
                        </div>

                        {/* Critical SEO Internal Links Bar (Guarantees Googlebot indexes all 8 event-type landings) */}
                        <div className="mt-10 p-5 bg-[#F8F9FA] rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                            <span className="font-bold text-slate-700 uppercase tracking-wider">
                                Explorar por evento:
                            </span>
                            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-slate-600 font-medium">
                                {OCCASIONS.map((occ) => (
                                    <Link 
                                        key={occ.slug} 
                                        to={`/${occ.slug}`} 
                                        className="hover:text-[#C2287B] transition-colors underline-offset-4 hover:underline"
                                    >
                                        {occ.name}
                                    </Link>
                                ))}
                            </div>
                            <Link 
                                to="/ejemplos" 
                                className="font-bold text-[#C2287B] hover:text-[#A81B65] uppercase tracking-wider inline-flex items-center gap-1 shrink-0"
                            >
                                <span>Ver todas las plantillas</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                    </div>
                </section>

                {/* --- 6. SAVE THE DATE (COMPACTO) --- */}
                <section id="save-the-date" className="py-16 md:py-20 bg-[#F7F2EA] px-6 border-b border-stone-200/60 relative overflow-hidden">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                            
                            <div className="space-y-4 max-w-2xl text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#DF3B94]">
                                    <Calendar className="h-3.5 w-3.5 text-[#DF3B94]" />
                                    <span>Save the Date Digital</span>
                                </div>

                                <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38] tracking-tight leading-tight">
                                    Aparta la fecha meses antes de la invitación
                                </h2>

                                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                                    Una sola pantalla ultra rápida con nombres, fecha, ciudad, cuenta regresiva y botón directo para agregar a Google y Apple Calendar. Perfecto para bodas en destino, XV años y aniversarios.
                                </p>

                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-bold text-slate-700 pt-1">
                                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl shadow-xs border border-stone-200/80">
                                        <Check className="h-4 w-4 text-[#4E7B55]" /> 10 estilos tipográficos
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl shadow-xs border border-stone-200/80">
                                        <Check className="h-4 w-4 text-[#4E7B55]" /> Enlace propio (/std/evento)
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl shadow-xs border border-stone-200/80">
                                        <Check className="h-4 w-4 text-[#4E7B55]" /> Incluido en Diseño Pro y Concierge
                                    </span>
                                </div>

                                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                                    <Link
                                        to="/std/demo-editorial"
                                        className="min-h-[44px] px-6 py-3 bg-[#222B38] hover:bg-[#111827] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
                                    >
                                        <span>Ver los 10 diseños Save the Date</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        to="/planes"
                                        className="min-h-[44px] px-6 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center"
                                    >
                                        Ver en los Planes (+$299 o incluido)
                                    </Link>
                                </div>
                            </div>

                            {/* Preview Mockup Card */}
                            <div className="w-full max-w-sm flex-shrink-0">
                                <div className="bg-white rounded-3xl p-4 shadow-xl border border-stone-200/80 transform hover:-translate-y-1 transition-all">
                                    <div className="rounded-2xl overflow-hidden aspect-[9/15] max-h-[420px] bg-stone-900 relative flex flex-col justify-between p-6 text-white text-center">
                                        <img
                                            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                                            alt="Save the Date Preview"
                                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                                            loading="lazy"
                                        />
                                        <div className="relative z-10">
                                            <p className="text-[10px] uppercase tracking-widest font-mono text-stone-200">Save the Date</p>
                                        </div>
                                        <div className="relative z-10 space-y-2">
                                            <h3 className="font-serif text-3xl font-normal tracking-wide italic">Isabel & Rodrigo</h3>
                                            <p className="text-xs uppercase tracking-widest text-stone-200">24 · OCTUBRE · 2026</p>
                                            <p className="text-[11px] text-stone-300">San Miguel de Allende, Gto.</p>
                                        </div>
                                        <div className="relative z-10 pt-2">
                                            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md border border-white/40 rounded-full text-[11px] font-bold text-white tracking-wider uppercase">
                                                + Agendar en Calendario
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
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

                {/* --- 7. PLANEADOR + INVITTO CONFIRMA (TABS EN BANDA OSCURA) (TAREA D) --- */}
                <section id="planeador" className="py-16 md:py-24 bg-[#111827] text-white px-6 relative overflow-hidden border-b border-stone-800">
                    {/* Decorative Ambient Background */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#DF3B94]/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#FAC345]/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="mx-auto max-w-7xl relative z-10">
                        
                        {/* Selector Tabs: Planeador vs Invitto Confirma */}
                        <div className="flex justify-center mb-10">
                            <div className="inline-flex p-1.5 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                                <button
                                    onClick={() => setDarkTab('planeador')}
                                    className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                                        darkTab === 'planeador'
                                            ? 'bg-[#DF3B94] text-white shadow-lg shadow-[#DF3B94]/30'
                                            : 'text-slate-300 hover:text-white'
                                    }`}
                                >
                                    <Crown className="h-4 w-4 text-[#FAC345]" />
                                    <span>Planeador de Eventos</span>
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/20 text-white ml-1">Pro +</span>
                                </button>

                                <button
                                    onClick={() => setDarkTab('confirma')}
                                    className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                                        darkTab === 'confirma'
                                            ? 'bg-[#C2287B] text-white shadow-lg shadow-[#C2287B]/30'
                                            : 'text-slate-300 hover:text-white'
                                    }`}
                                >
                                    <Gem className="h-4 w-4 text-[#FF80BF]" />
                                    <span>Invitto Confirma</span>
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-400 text-stone-950 ml-1">VIP</span>
                                </button>
                            </div>
                        </div>

                        {/* TAB 1: PLANEADOR DE EVENTOS */}
                        {darkTab === 'planeador' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                                    <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
                                        Planeador de Eventos: Presupuesto, Proveedores y Día B
                                    </h2>
                                    <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal">
                                        Tu evento no solo necesita una invitación hermosa, necesita orden. Centraliza pagos, cotizaciones, contratos y el itinerario minuto a minuto directamente dentro de tu panel de Invitto.
                                    </p>
                                    
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300">
                                        <span className="h-2 w-2 rounded-full bg-[#FAC345]" />
                                        <span><strong>Incluido en:</strong> Plan Pro ($1,699 MXN), Diseño Pro y Concierge. <em>(No disponible en Clásica).</em></span>
                                    </div>
                                </div>

                                {/* 4 Pillars Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="h-12 w-12 rounded-2xl bg-[#DF3B94]/20 border border-[#DF3B94]/30 flex items-center justify-center text-[#FF85C0]">
                                                <Wallet className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-lg font-display font-extrabold text-white">Presupuesto y Pagos</h3>
                                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                                Desglosa rubros (salón, música, foto). Monitorea anticipos y fechas límite con alertas automáticas.
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-[#FAC345] flex items-center justify-between">
                                            <span>Control de saldos</span>
                                            <span>Exporta a CSV</span>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                                <Store className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-lg font-display font-extrabold text-white">Directorio de Proveedores</h3>
                                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                                Fichas de cada proveedor con contacto directo a WhatsApp, cotizaciones comparativas y contratos.
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-emerald-400 flex items-center justify-between">
                                            <span>WhatsApp directo</span>
                                            <span>Compara ofertas</span>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                                <ListChecks className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-lg font-display font-extrabold text-white">Pendientes por Fases</h3>
                                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                                Checklist cronológico calculado según la fecha de tu evento: 12 meses, 6 meses, 1 mes y última semana.
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-amber-400 flex items-center justify-between">
                                            <span>Cronograma vivo</span>
                                            <span>Avance en %</span>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="h-12 w-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                                                <CalendarHeart className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-lg font-display font-extrabold text-white">Carpeta Día B en PDF</h3>
                                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                                Genera en 1 clic el itinerario minuto a minuto con cortejo, teléfonos clave y detalles para tu wedding planner.
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-purple-400 flex items-center justify-between">
                                            <span>Descarga PDF</span>
                                            <span>Minuto a minuto</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Action Bar */}
                                <div className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="space-y-0.5 text-center md:text-left">
                                        <p className="text-base font-bold text-white">¿Quieres organizar tu evento sin estrés?</p>
                                        <p className="text-xs text-slate-400">Elige Plan Pro al crear tu evento y desbloquea el Planeador de inmediato.</p>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center gap-3">
                                        <Link
                                            to="/planes"
                                            className="min-h-[44px] px-6 py-3 bg-[#DF3B94] hover:bg-[#C2287B] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 no-underline"
                                        >
                                            <span>Ver Planes con Planeador (desde $1,699)</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                        <Link
                                            to="/dashboard/planeacion/demo"
                                            className="min-h-[44px] px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center no-underline"
                                        >
                                            <span>Ver Demo Planeador</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: INVITTO CONFIRMA */}
                        {darkTab === 'confirma' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                                    <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
                                        ¿No tienes tiempo? Confirmamos a tus invitados por ti
                                    </h2>
                                    <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal">
                                        Servicio VIP con asistente WhatsApp y equipo humano: cargamos tus invitados, enviamos cada invitación personalizada, hacemos 3 rondas de seguimiento y cerramos tu lista.
                                    </p>
                                    
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                        <span><strong>Garantía:</strong> Lista final cerrada 15 días antes del evento o devolución 100% · Add-on $2,000 MXN o incluido en Concierge.</span>
                                    </div>
                                </div>

                                {/* 4 Features Grid for Confirma */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="h-12 w-12 rounded-2xl bg-[#C2287B]/20 border border-[#C2287B]/30 flex items-center justify-center text-[#FF80BF]">
                                                <Users className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-lg font-display font-extrabold text-white">Carga y Envío Individual</h3>
                                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                                Nos das tu lista y nosotros enviamos cada invitación con su enlace y token individual directamente por WhatsApp.
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-[#FF80BF] flex items-center justify-between">
                                            <span>Tokens únicos</span>
                                            <span>Cero fricción</span>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                                <Clock className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-lg font-display font-extrabold text-white">3 Rondas de Seguimiento</h3>
                                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                                Recordatorios amables en cadencia inteligente más 1 llamada de cortesía a los invitados con dudas o pendientes.
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-amber-400 flex items-center justify-between">
                                            <span>Cadencia automática</span>
                                            <span>Llamada de cortesía</span>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                                <QrCode className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-lg font-display font-extrabold text-white">Pases QR y Reconfirmación</h3>
                                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                                Envío del pase digital individual con código QR y ubicación GPS 48-72 horas antes del gran día.
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-emerald-400 flex items-center justify-between">
                                            <span>Acceso rápido</span>
                                            <span>Mapa GPS</span>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="h-12 w-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                                                <Check className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-lg font-display font-extrabold text-white">Lista Lista para Banquete</h3>
                                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                                Reporte final ordenado por mesas, confirmados y dietas especiales entregado 15 días antes para que no pagues platillos de más.
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-purple-400 flex items-center justify-between">
                                            <span>Cero desperdicio</span>
                                            <span>Garantía 100%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Action Bar for Confirma */}
                                <div className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="space-y-0.5 text-center md:text-left">
                                        <p className="text-base font-bold text-white">¿Prefieres delegar completamente el seguimiento de invitados?</p>
                                        <p className="text-xs text-slate-400">Disponible como add-on para cualquier plan por $2,000 MXN o incluido en Concierge.</p>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center gap-3">
                                        <Link
                                            to="/confirma"
                                            className="min-h-[44px] px-6 py-3 bg-[#C2287B] hover:bg-[#A81B65] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 no-underline"
                                        >
                                            <span>Saber más sobre Invitto Confirma</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                        <Link
                                            to="/planes"
                                            className="min-h-[44px] px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center no-underline"
                                        >
                                            <span>Ver en los Planes</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </section>

                {/* --- 8. PLANES Y PRECIOS (COMPACTO CON PATRÓN PRECIO TACHADO EN ADD-ONS) (TAREA E) --- */}
                <section className="py-16 md:py-24 bg-white px-6 border-b border-slate-100">
                    <div className="mx-auto max-w-7xl">
                        
                        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#C52A7C]">
                                <Check className="h-3.5 w-3.5 text-[#C52A7C]" />
                                <span>Precios Claros · Un Solo Pago</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38] tracking-tight">
                                Planes diseñados para tu evento
                            </h2>
                            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                                Sin suscripciones mensuales ni sorpresas. Diseña tu borrador gratis y paga únicamente al publicar.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch max-w-7xl mx-auto">
                            
                            {/* Plan Clásica */}
                            <div className="bg-[#F8F9FA] rounded-3xl p-7 border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all">
                                <div className="space-y-5">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">PLAN BÁSICO</span>
                                        <h3 className="text-2xl font-display font-extrabold text-[#222B38] mt-1">Clásica</h3>
                                        <p className="text-xs text-slate-600 mt-1">Para celebraciones íntimas que buscan una invitación hermosa y funcional.</p>
                                    </div>

                                    <div className="py-2 border-y border-slate-200/60">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-4xl font-serif font-extrabold text-[#222B38]">$499</span>
                                            <span className="text-xs font-bold text-slate-600 uppercase">MXN</span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 font-medium mt-1">Un solo pago · Activa hasta 30 días post-evento</p>
                                    </div>

                                    <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
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
                                        <li className="flex items-center gap-2.5 text-slate-600">
                                            <Check className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                            <span>Save the Date digital (+ $299 MXN opcional)</span>
                                        </li>
                                        <li className="flex items-center gap-2.5 text-slate-600">
                                            <Check className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                            <span>Confirma por WhatsApp (<span className="line-through text-slate-400">$3,499</span> <strong>$2,000 en paquete</strong>)</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="pt-6">
                                    <Link 
                                        to="/dashboard/new?plan=clasico"
                                        className="w-full min-h-[44px] py-3.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-white hover:border-[#DF3B94] hover:text-[#DF3B94] transition-all flex items-center justify-center text-center no-underline"
                                    >
                                        Diseñar Gratis
                                    </Link>
                                    <p className="text-[11px] text-slate-600 text-center mt-2 font-medium">Borrador gratis · Sin ingresar tarjeta</p>
                                </div>
                            </div>

                            {/* Plan Pro (Destacado) */}
                            <div className="relative bg-slate-900 text-white rounded-3xl p-7 border-2 border-[#C2287B] shadow-2xl shadow-[#C2287B]/20 flex flex-col justify-between lg:-translate-y-2">
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#C2287B] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
                                    <Gem className="h-3 w-3" /> MÁS ELEGIDO
                                </div>

                                <div className="space-y-5">
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
                                        <p className="text-[11px] text-slate-300 font-medium mt-1">Un solo pago · Activa hasta 30 días post-evento</p>
                                    </div>

                                    <ul className="space-y-2.5 text-xs text-slate-200 font-medium">
                                        <li className="flex items-center gap-2.5">
                                            <Check className="h-4 w-4 text-[#FAC345] flex-shrink-0" />
                                            <span><strong>Todo lo del plan Clásica</strong></span>
                                        </li>
                                        <li className="flex items-center gap-2.5">
                                            <Check className="h-4 w-4 text-[#FAC345] flex-shrink-0" />
                                            <span><strong>Planeador de Eventos Premium</strong> (pagos, proveedores, Día B)</span>
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
                                        <li className="flex items-center gap-2.5 text-slate-300">
                                            <Check className="h-4 w-4 text-[#FAC345] flex-shrink-0" />
                                            <span>Confirma por WhatsApp (<span className="line-through text-slate-400">$3,499</span> <strong>$2,000 en paquete</strong>)</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="pt-6">
                                    <Link 
                                        to="/dashboard/new?plan=pro"
                                        className="w-full min-h-[44px] py-4 px-4 bg-[#C2287B] hover:bg-[#A81B65] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#C2287B]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center text-center no-underline"
                                    >
                                        Probar Plan Pro Gratis
                                    </Link>
                                    <p className="text-[11px] text-slate-300 text-center mt-2 font-medium">Empieza tu borrador gratis · Pagas al publicar</p>
                                </div>
                            </div>

                            {/* Plan Diseño Pro */}
                            <div className="bg-[#F8F9FA] rounded-3xl p-7 border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all">
                                <div className="space-y-5">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B45309]">PERSONALIZADO</span>
                                        <h3 className="text-2xl font-display font-extrabold text-[#222B38] mt-1">Diseño Pro</h3>
                                        <p className="text-xs text-slate-600 mt-1">Plantillas exclusivas, paleta y tipografía adaptadas a tu concepto por diseñador.</p>
                                    </div>

                                    <div className="py-2 border-y border-slate-200/60">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-4xl font-serif font-extrabold text-[#222B38]">$2,499</span>
                                            <span className="text-xs font-bold text-slate-600 uppercase">MXN</span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 font-medium mt-1">Un solo pago · Activa hasta 30 días post-evento</p>
                                    </div>

                                    <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
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
                                        <li className="flex items-center gap-2.5 text-slate-600">
                                            <Check className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                            <span>Confirma por WhatsApp (<span className="line-through text-slate-400">$3,499</span> <strong>$2,000 en paquete</strong>)</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="pt-6">
                                    <Link 
                                        to="/dashboard/new?plan=premium"
                                        className="w-full min-h-[44px] py-3.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-white hover:border-[#DF3B94] hover:text-[#DF3B94] transition-all flex items-center justify-center text-center no-underline"
                                    >
                                        Elegir Diseño Pro
                                    </Link>
                                    <p className="text-[11px] text-slate-600 text-center mt-2 font-medium">Empieza tu borrador gratis · Pagas al publicar</p>
                                </div>
                            </div>

                            {/* Plan Concierge */}
                            <div className="bg-[#F8F9FA] rounded-3xl p-7 border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all">
                                <div className="space-y-5">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#C2287B]">TODO INCLUIDO · LLAVE EN MANO</span>
                                        <h3 className="text-2xl font-display font-extrabold text-[#222B38] mt-1">Concierge</h3>
                                        <p className="text-xs text-slate-600 mt-1">Diseño Pro + Invitto Confirma (llamamos y confirmamos a tus invitados por ti).</p>
                                    </div>

                                    <div className="py-2 border-y border-slate-200/60">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-4xl font-serif font-extrabold text-[#222B38]">$4,499</span>
                                            <span className="text-xs font-bold text-slate-600 uppercase">MXN</span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 font-medium mt-1">Un solo pago · Activa hasta 30 días post-evento</p>
                                    </div>

                                    <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                                        <li className="flex items-center gap-2.5">
                                            <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                            <span><strong>Todo lo del plan Diseño Pro</strong> (incluye Planeador)</span>
                                        </li>
                                        <li className="flex items-center gap-2.5">
                                            <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                            <span><strong>Invitto Confirma INCLUIDO</strong> (confirmamos por ti)</span>
                                        </li>
                                        <li className="flex items-center gap-2.5">
                                            <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                            <span><strong>Save the Date digital INCLUIDO</strong></span>
                                        </li>
                                        <li className="flex items-center gap-2.5">
                                            <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                            <span>3 rondas + llamada a pendientes + reconfirmación</span>
                                        </li>
                                        <li className="flex items-center gap-2.5">
                                            <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                            <span>Lista final cerrada 15 días antes (Garantía 100%)</span>
                                        </li>
                                        <li className="flex items-center gap-2.5">
                                            <Check className="h-4 w-4 text-[#4E7B55] flex-shrink-0" />
                                            <span>Atención dedicada a dudas de tus invitados</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="pt-6">
                                    <Link 
                                        to="/planes/concierge"
                                        className="w-full min-h-[44px] py-3.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-white hover:border-[#C2287B] hover:text-[#C2287B] transition-all flex items-center justify-center text-center no-underline"
                                    >
                                        Conocer Plan Concierge
                                    </Link>
                                    <p className="text-[11px] text-slate-600 text-center mt-2 font-medium">Servicio completo · Garantía de entrega</p>
                                </div>
                            </div>

                        </div>

                        <div className="mt-10 text-center">
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

                {/* --- 9. PREGUNTAS FRECUENTES (AGRUPADAS POR TEMA EN ACORDEÓN) (TAREA E) --- */}
                <section className="py-16 md:py-24 bg-white">
                    <div className="mx-auto max-w-3xl px-6">
                        <div className="text-center mb-10 space-y-2">
                            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#222B38]">
                                Preguntas Frecuentes
                            </h2>
                            <p className="text-slate-600 text-sm">Todo lo que necesitas saber antes de crear tu invitación</p>
                        </div>

                        <div className="space-y-8">
                            {FAQ_GROUPS.map((group, gIdx) => (
                                <div key={gIdx} className="space-y-3">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-700">
                                        <MessageCircle className="h-3.5 w-3.5 text-[#C2287B]" />
                                        <span>{group.category}</span>
                                    </div>

                                    <div className="space-y-3">
                                        {group.items.map((item, i) => {
                                            const key = `faq-${gIdx}-${i}`;
                                            return (
                                                <div key={key} className="border border-slate-200 rounded-2xl overflow-hidden transition-all">
                                                    <button
                                                        onClick={() => toggleFaq(key)}
                                                        aria-expanded={openFaq === key}
                                                        aria-controls={`faq-answer-${key}`}
                                                        id={`faq-question-${key}`}
                                                        className="w-full p-5 text-left font-bold text-slate-800 flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors"
                                                    >
                                                        <span className="text-sm md:text-base">{item.q}</span>
                                                        <ChevronDown className={`h-4 w-4 text-[#DF3B94] shrink-0 transition-transform duration-300 ${openFaq === key ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    <div 
                                                        id={`faq-answer-${key}`}
                                                        role="region"
                                                        aria-labelledby={`faq-question-${key}`}
                                                        className={`px-5 pb-5 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3.5 bg-slate-50/50 ${openFaq === key ? 'block' : 'hidden'}`}
                                                    >
                                                        {item.a}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- 10. CTA BANNER ("Organiza tu evento sin estrés") --- */}
                <section className="relative py-20 md:py-28 bg-[#222B38] text-white text-center px-6 overflow-hidden">
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

                    <div className="relative z-10 mx-auto max-w-4xl space-y-5">
                        <h2 className="text-3xl xs:text-4xl md:text-6xl font-display font-extrabold tracking-tight leading-tight">
                            Organiza tu evento <br />
                            <span className="italic font-light text-[#DF3B94]">sin estrés</span>
                        </h2>

                        <p className="text-lg md:text-xl font-display text-white font-medium max-w-2xl mx-auto pt-1">
                            La invitación digital que merece tu historia
                        </p>

                        <p className="text-xs md:text-sm text-slate-300 font-normal max-w-xl mx-auto leading-relaxed">
                            Crea tu borrador gratis y publica cuando estés listo. RSVP inteligente, pases con código QR y confirmaciones por WhatsApp en un solo enlace.
                        </p>

                        <div className="pt-2 space-y-3">
                            <Link 
                                to={user ? "/dashboard" : "/dashboard/new"}
                                className="min-h-[44px] px-8 py-4 bg-[#C2287B] hover:bg-[#A81B65] text-white rounded-full text-xs md:text-sm font-bold tracking-widest uppercase hover:-translate-y-0.5 transition-all shadow-2xl active:scale-95 inline-flex items-center justify-center gap-2 no-underline"
                            >
                                <span>{user ? 'IR AL PANEL' : 'CREAR MI INVITACIÓN'}</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <p className="text-xs text-slate-400 font-medium">
                                Diseña gratis tu borrador · Planes desde $499 MXN pago único · Sin tarjeta requerida
                            </p>
                            <p className="text-xs text-slate-400 pt-1">
                                ¿Dudas o necesitas asesoría? Escríbenos a{' '}
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

            {/* --- 11. FOOTER --- */}
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
                            <p className="text-[11px] text-slate-400 mt-0.5">— Atención prioritaria para nuestros clientes</p>
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
                                <li><Link to="/invitaciones-digitales-infantiles" className="hover:text-white transition-colors">Cumpleaños Infantiles</Link></li>
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
