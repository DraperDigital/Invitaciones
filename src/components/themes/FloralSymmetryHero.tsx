import { format } from 'date-fns';


interface Props {
    event: any;
    cfg: any;
    countdown: any;
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
}

const TornEdge = ({ className = '', flip = false }: { className?: string, flip?: boolean }) => (
    <div className={`w-full h-6 overflow-hidden text-[var(--section-bg)] ${className}`}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-current" style={{ transform: flip ? 'rotate(180deg)' : 'none' }}>
            {/* Creates a jagged torn paper effect */}
            <polygon fill="currentColor" points="0,100 0,0 5,15 10,0 15,18 20,2 25,20 30,5 35,15 40,0 45,18 50,5 55,20 60,0 65,15 70,5 75,20 80,0 85,15 90,5 95,20 100,0 100,100" />
        </svg>
    </div>
);

export default function FloralSymmetryHero({ event, cfg, heroImageUrl, scrollToSection }: Props) {
    const eventDate = new Date(event.date_time);
    
    // Helper to test if a color is too dark or blue for botanical floral symmetry
    const isUnsuitableBg = (c?: string) => {
        if (!c) return true;
        const hex = c.replace('#', '');
        if (hex.length !== 6) return false;
        const r = parseInt(hex.substring(0, 2), 16) || 0;
        const g = parseInt(hex.substring(2, 4), 16) || 0;
        const b = parseInt(hex.substring(4, 6), 16) || 0;
        // If it's heavily dark (YIQ < 150) or dominantly blue (like #203497), fallback to warm ivory
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        if (yiq < 170) return true;
        if (b > r + 30 && b > g + 20) return true; // unwanted blue/cool cast
        return false;
    };

    // Theme colors: botanical eucalyptus green & romantic dusty rose
    const rawBg = cfg.heroBgColor || cfg.hero_bg_color;
    const bgColor = (!rawBg || isUnsuitableBg(rawBg)) ? '#FAF7F5' : rawBg;
    const rawAccent = cfg.accent_color || cfg.accentColor;
    const accentColor = (!rawAccent || rawAccent === '#F47C62' || rawAccent === '#C88A58') ? '#B85568' : rawAccent;
    const rawBanner = cfg.primary_color || cfg.primaryColor;
    const bannerColor = (!rawBanner || rawBanner === '#456A5B' || rawBanner === '#3A4D39' || rawBanner === '#1B2E1D') ? '#3A5240' : rawBanner;
    // Primary title color in botanical dark tone for crisp contrast and floral luxury
    const titleColor = '#3A5240';

    // Using the custom generated floral branch
    const floralImage = "/floral_ornament.png"; 
    
    // Get the couple's picture for the circular avatar. Fallback to heroImage or a default.
    const avatarUrl = (cfg.gallery_images && cfg.gallery_images[0]?.url) || heroImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80';

    return (
        <section id="hero" className="relative flex flex-col w-full bg-[var(--section-bg)]" style={{ backgroundColor: bgColor }}>
            
            {/* 1. TOP HERO SECTION */}
            <div className="relative w-full flex flex-col items-center justify-center min-h-[90vh] py-12 px-6">
                
                {/* Top Floral Image */}
                <div className="w-full max-w-2xl mx-auto flex justify-center mb-8 animate-in fade-in slide-in-from-top duration-1000">
                    <img 
                        src={floralImage} 
                        alt="" 
                        className="w-full max-w-md object-contain mix-blend-multiply opacity-80"
                        style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
                    />
                </div>

                {/* Central Text Content */}
                <div className="text-center space-y-6 z-10 animate-in zoom-in duration-1000 delay-300">
                    <p className="text-xs sm:text-sm font-sans uppercase tracking-[0.2em]" style={{ color: accentColor }}>
                        {cfg.save_the_date_text || "Reserva la fecha"}
                    </p>
                    
                    <p className="text-sm font-serif text-stone-500 tracking-widest">
                        {format(eventDate, "dd.MM.yyyy")} | {format(eventDate, "h:mm a")}
                    </p>
                    
                    <h1 className="text-3xl sm:text-6xl md:text-7xl font-serif font-light tracking-normal sm:tracking-wide uppercase mt-4 sm:mt-6 mb-4 break-normal hyphens-none" style={{ color: titleColor }}>
                        {event.title}
                    </h1>
                    
                    <p className="text-sm sm:text-base font-serif italic text-stone-500 tracking-wide">
                        {cfg.subtitle || "comienzan su gran aventura juntos"}
                    </p>

                    <div className="pt-8">
                        <button 
                            onClick={() => scrollToSection('rsvp')}
                            className="px-8 py-3 rounded-full text-xs font-sans uppercase tracking-[0.2em] font-bold transition-all hover:scale-105 text-white shadow-lg"
                            style={{ backgroundColor: accentColor }}
                        >
                            RSVP
                        </button>
                    </div>
                </div>

                {/* Bottom Floral Image (Mirrored) */}
                <div className="w-full max-w-2xl mx-auto flex justify-center mt-12 animate-in fade-in slide-in-from-bottom duration-1000">
                    <img 
                        src={floralImage} 
                        alt="" 
                        className="w-full max-w-md object-contain mix-blend-multiply opacity-80 rotate-180"
                        style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
                    />
                </div>
            </div>

            {/* 2. TORN PAPER GREEN BANNER */}
            <div className="relative w-full z-20 mt-12" style={{ backgroundColor: bannerColor }}>
                {/* Top torn edge (using the background color of the hero to cut into the banner) */}
                <div className="absolute top-0 left-0 w-full -translate-y-[99%]">
                    <TornEdge />
                </div>

                <div className="py-24 px-6 text-center text-white space-y-6">
                    <p className="text-xs sm:text-sm font-sans uppercase tracking-[0.3em] opacity-80">
                        {cfg.banner_subtitle || "Junto con nuestras familias"}
                    </p>
                    <h2 className="text-3xl sm:text-5xl font-serif font-light uppercase tracking-widest leading-tight">
                        {cfg.banner_title || "Te invitamos a nuestra boda"}
                    </h2>
                </div>

                {/* Bottom torn edge (flips the color logic) */}
                <div className="absolute bottom-0 left-0 w-full translate-y-[99%]">
                    <TornEdge flip />
                </div>
            </div>

            {/* 3. CIRCULAR AVATAR & STORY SECTION */}
            <div className="relative w-full pt-32 pb-16 px-6 bg-[var(--section-bg)] text-center" style={{ backgroundColor: bgColor }}>
                <div className="max-w-3xl mx-auto space-y-10">
                    
                    {/* Circular Avatar */}
                    <div className="mx-auto w-40 h-40 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 shadow-xl animate-in zoom-in duration-1000" style={{ borderColor: bgColor }}>
                        <img src={avatarUrl} alt="Couple" className="w-full h-full object-cover" />
                    </div>

                    {/* Titles */}
                    <div className="space-y-4">
                        <h2 className="text-3xl sm:text-5xl font-serif uppercase tracking-widest" style={{ color: titleColor }}>
                            {cfg.story_title || "Nos encantaría que nos acompañes"}
                        </h2>
                        <p className="text-xs sm:text-sm font-sans uppercase tracking-[0.2em]" style={{ color: accentColor }}>
                            {cfg.story_subtitle || "En nuestro día tan especial"}
                        </p>
                    </div>

                    {/* Body Text */}
                    <p className="text-sm sm:text-base font-serif italic text-stone-500 leading-relaxed max-w-2xl mx-auto">
                        {cfg.welcome_message || "Como ocupas un lugar muy especial en nuestros corazones, tu presencia significaría el mundo para nosotros. Únete a nosotros para compartir nuestra historia de amor, vivir momentos inolvidables y crear recuerdos que atesoraremos por siempre."}
                    </p>
                </div>
            </div>

        </section>
    );
}
