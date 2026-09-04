import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
    event: any;
    cfg: any;
    countdown: any;
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
}

export default function CollageHero({ event, cfg, heroImageUrl }: Props) {
    const eventDate = new Date(event.date_time);
    
    // Default colors inspired by the Renderforest template
    const heroBgColor = cfg.heroBgColor || cfg.hero_bg_color || '#F8F5F0';
    const primaryColor = cfg.primary_color || '#767A6B'; // Dark olive green for the details bar
    const heroTextColor = cfg.hero_text_color || cfg.heroTextColor || '#4A4A4A';
    
    // Images for collage
    const gallery = cfg.gallery_images || cfg.galleryImages || [];
    const images = [
        gallery[0]?.url || heroImageUrl || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        gallery[1]?.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        gallery[2]?.url || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
        gallery[3]?.url || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
        gallery[4]?.url || 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
    ];

    // Smart contrast calculation
    const isDarkBg = (colorStr: string) => {
        if (!colorStr || !colorStr.startsWith('#')) return false;
        const c = colorStr.replace('#', '');
        if (c.length !== 6) return false;
        const r = parseInt(c.substring(0, 2), 16);
        const g = parseInt(c.substring(2, 4), 16);
        const b = parseInt(c.substring(4, 6), 16);
        return (r * 0.299 + g * 0.587 + b * 0.114) < 150;
    };
    const hasDarkBg = isDarkBg(heroBgColor);
    const titleColor = hasDarkBg ? (cfg.hero_text_color || cfg.heroTextColor || '#FFFFFF') : primaryColor;
    const subtitleColor = hasDarkBg ? 'rgba(255,255,255,0.85)' : heroTextColor;

    return (
        <section id="hero" className="relative flex flex-col w-full min-h-screen">
            {/* Top Collage Section */}
            <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden py-12 sm:py-20 px-4 sm:px-8" style={{ background: heroBgColor }}>
                
                {/* Optional faint background texture or overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

                <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 theme-collage-container">
                    
                    {/* Left Collage (Desktop only) */}
                    <div className="hidden lg:flex w-1/3 relative h-[400px] items-center justify-center animate-in fade-in slide-in-from-left duration-1000 theme-collage-desktop-left">
                        <img 
                            src={images[1]} 
                            alt="" 
                            className="absolute left-0 top-10 w-48 h-56 object-cover rounded-2xl shadow-xl -rotate-6 z-10 border-4 border-white" 
                        />
                        <img 
                            src={images[0]} 
                            alt="" 
                            className="absolute left-24 top-20 w-56 h-64 object-cover rounded-2xl shadow-2xl z-20 border-4 border-white" 
                        />
                        <img 
                            src={images[2]} 
                            alt="" 
                            className="absolute left-10 bottom-0 w-40 h-48 object-cover rounded-2xl shadow-lg rotate-6 z-30 border-4 border-white" 
                        />
                        {/* Decorative squiggly arrow */}
                        <svg className="absolute -left-4 bottom-20 w-16 h-16 text-stone-400 rotate-12 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 9l-6 6 6 6" />
                            <path d="M4 15h14a4 4 0 004-4v-4" />
                        </svg>
                    </div>

                    {/* Center Content */}
                    <div className="w-full lg:w-1/3 text-center space-y-4 sm:space-y-6 animate-in zoom-in duration-1000 delay-300 relative z-40 theme-collage-center">
                        <p className="text-xs sm:text-base font-serif italic tracking-wide" style={{ color: subtitleColor }}>
                            {cfg.welcome_message || "Estás invitado a celebrar el gran día de"}
                        </p>
                        
                        <h1 
                            className="text-3xl sm:text-5xl md:text-6xl lg:text-[5rem] font-serif font-light leading-[1.15] drop-shadow-sm break-normal hyphens-none px-2" 
                            style={{ color: titleColor, fontFamily: "'Great Vibes', cursive" }}
                        >
                            {event.title}
                        </h1>

                        {/* Mobile Collage Cards (shown on mobile & simulator) */}
                        <div className="flex lg:hidden justify-center items-center gap-2 sm:gap-3 py-4 px-2 w-full max-w-xs mx-auto theme-collage-mobile-fan">
                            <img src={images[1]} alt="" className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded-xl shadow-md -rotate-6 border-2 border-white" />
                            <img src={images[0]} alt="" className="w-24 h-32 sm:w-28 sm:h-36 object-cover rounded-xl shadow-xl z-10 border-2 border-white scale-105" />
                            <img src={images[2]} alt="" className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded-xl shadow-md rotate-6 border-2 border-white" />
                        </div>

                        <div className="pt-4 sm:pt-8">
                            <button 
                                onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
                                className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans uppercase tracking-[0.2em] font-bold transition-all hover:opacity-70 px-6 py-2.5 rounded-full border border-current"
                                style={{ color: titleColor }}
                            >
                                RSVP
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                        </div>
                    </div>

                    {/* Right Collage (Desktop only) */}
                    <div className="hidden lg:flex w-1/3 relative h-[400px] items-center justify-center animate-in fade-in slide-in-from-right duration-1000 theme-collage-desktop-right">
                        <img 
                            src={images[3]} 
                            alt="" 
                            className="absolute right-20 top-10 w-56 h-72 object-cover rounded-2xl shadow-2xl -rotate-3 z-20 border-4 border-white" 
                        />
                        <img 
                            src={images[4]} 
                            alt="" 
                            className="absolute right-0 top-32 w-48 h-56 object-cover rounded-2xl shadow-xl rotate-6 z-10 border-4 border-white" 
                        />
                        <p className="absolute bottom-4 right-10 text-xs font-serif italic text-stone-500 tracking-widest z-30 opacity-70">
                            {cfg.subtitle || "Y así comienza la aventura"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Details Bar */}
            <div className="w-full py-12 px-6 sm:px-12 z-50 shadow-2xl" style={{ backgroundColor: primaryColor }}>
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white/90">
                    
                    {/* Date */}
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
                        <h3 className="font-serif italic text-2xl sm:text-3xl mb-4 text-white/80" style={{ fontFamily: "'Great Vibes', cursive" }}>Fecha</h3>
                        <p className="text-sm font-sans font-medium tracking-wide">
                            {format(eventDate, "MMMM do", { locale: es })}
                        </p>
                        <p className="text-xs font-sans font-light tracking-wider opacity-80">
                            {format(eventDate, "EEEE", { locale: es })}
                        </p>
                    </div>

                    {/* Time */}
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom duration-700 delay-600">
                        <h3 className="font-serif italic text-2xl sm:text-3xl mb-4 text-white/80" style={{ fontFamily: "'Great Vibes', cursive" }}>Hora</h3>
                        <p className="text-sm font-sans font-medium tracking-wide">
                            A partir de las {format(eventDate, 'HH:mm', { locale: es })}
                        </p>
                        {cfg.misa_time && (
                            <p className="text-xs font-sans font-light tracking-wider opacity-80">
                                Ceremonia a las {cfg.misa_time}
                            </p>
                        )}
                    </div>

                    {/* Location */}
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom duration-700 delay-700">
                        <h3 className="font-serif italic text-2xl sm:text-3xl mb-4 text-white/80" style={{ fontFamily: "'Great Vibes', cursive" }}>Ubicación</h3>
                        <p className="text-sm font-sans font-medium tracking-wide truncate">
                            {event.venue_name}
                        </p>
                        <p className="text-xs font-sans font-light tracking-wider opacity-80 truncate">
                            {event.venue_address}
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
