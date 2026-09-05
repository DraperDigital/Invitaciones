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

export default function ClassicEleganceProHero({ event, cfg, countdown, heroImageUrl, scrollToSection }: Props) {
    const eventDate = new Date(event.date_time || Date.now());
    const gold = cfg.accent_color || cfg.accentColor || '#D4AF37';
    const heroBg = cfg.heroBgColor || cfg.hero_bg_color || '#0A0A0A';
    const heroText = cfg.hero_text_color || cfg.heroTextColor || '#F5D76E';

    const getInitials = () => {
        if (!event?.title) return 'E & W';
        const parts = event.title.split(/ y | & | Y | e | E /i);
        if (parts.length >= 2) return `${parts[0].trim()[0]} & ${parts[1].trim()[0]}`;
        return event.title.slice(0, 3).toUpperCase();
    };

    const bgImage = heroImageUrl
        ? `url(${heroImageUrl})`
        : `linear-gradient(135deg, #141414 0%, #1a1208 50%, ${heroBg} 100%)`;

    return (
        <section id="hero" className="w-full relative overflow-hidden select-none" style={{ backgroundColor: heroBg }}>

            {/* ── Full-screen hero image ── */}
            <div
                className="relative w-full flex flex-col"
                style={{
                    minHeight: '95vh',
                    backgroundImage: bgImage,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                }}
            >
                {/* Multi-layer overlay: bottom heavy black, subtle top vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

                {/* ── Top nav bar ── */}
                <header className="relative z-20 w-full pt-8 pb-5 px-6 flex items-center justify-between border-b"
                    style={{ borderColor: `${gold}30` }}>
                    {/* Left nav */}
                    <nav className="hidden sm:flex gap-6 text-[10px] uppercase tracking-[0.3em] font-sans font-semibold"
                        style={{ color: `${gold}CC` }}>
                        <button onClick={() => scrollToSection('location')} className="hover:text-white transition-colors">Eventos</button>
                        <button onClick={() => scrollToSection('itinerary')} className="hover:text-white transition-colors">Itinerario</button>
                    </nav>

                    {/* Center monogram */}
                    <div className="flex flex-col items-center">
                        <svg width="28" height="14" viewBox="0 0 40 20" fill="none" stroke={gold} strokeWidth="1.2">
                            <path d="M20 2 L25 10 L35 4 L30 18 L10 18 L5 4 L15 10 Z" />
                            <circle cx="20" cy="2" r="1.5" fill={gold} />
                        </svg>
                        <span className="text-base sm:text-lg font-serif tracking-[0.3em] font-light mt-1"
                            style={{ color: gold }}>
                            {getInitials()}
                        </span>
                    </div>

                    {/* Right nav */}
                    <nav className="hidden sm:flex gap-6 text-[10px] uppercase tracking-[0.3em] font-sans font-semibold"
                        style={{ color: `${gold}CC` }}>
                        <button onClick={() => scrollToSection('rsvp')} className="hover:text-white transition-colors">RSVP</button>
                        <button onClick={() => scrollToSection('hotels')} className="hover:text-white transition-colors">Hoteles</button>
                    </nav>
                </header>

                {/* ── Bottom content block ── */}
                <div className="relative z-10 mt-auto pb-12 sm:pb-16 px-6 text-center text-white max-w-2xl mx-auto w-full">

                    {/* Tagline */}
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.5em] font-sans font-semibold mb-5 opacity-80"
                        style={{ color: gold }}>
                        {cfg.subtitle || 'Nuestra Boda'}
                    </p>

                    {/* Title */}
                    <h1 className="font-serif font-light leading-tight mb-5 break-normal hyphens-none"
                        style={{
                            fontSize: 'clamp(1.75rem, 6vw, 4.5rem)',
                            color: heroText,
                        }}>
                        {event?.title || 'ELEANOR & WILLIAM'}
                    </h1>

                    {/* Date + venue */}
                    <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 border text-xs font-sans tracking-[0.25em] uppercase"
                        style={{ borderColor: `${gold}40`, color: `${gold}EE` }}>
                        <span>{format(eventDate, "dd 'de' MMMM, yyyy", { locale: es }).toUpperCase()}</span>
                        <span className="opacity-40">|</span>
                        <span>{event?.venue_name || 'Lugar del Evento'}</span>
                    </div>

                    {/* ── Countdown ── */}
                    {cfg.showCountdown !== false && (
                        <div className="border-t border-b py-5" style={{ borderColor: `${gold}35` }}>
                            <div className="theme-classicpro-countdown flex justify-center gap-4 sm:gap-12 font-serif">
                                {[
                                    { label: 'Días',  value: countdown.days },
                                    { label: 'Hrs',   value: countdown.hours },
                                    { label: 'Min',   value: countdown.minutes },
                                    { label: 'Seg',   value: countdown.seconds },
                                ].map(item => (
                                    <div key={item.label} className="text-center">
                                        <span className="block text-3xl sm:text-4xl font-serif font-light"
                                            style={{ color: heroText }}>
                                            {String(item.value).padStart(2, '0')}
                                        </span>
                                        <span className="text-[9px] uppercase tracking-[0.3em] font-sans font-semibold opacity-50">
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom gold line accent */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: `linear-gradient(to right, transparent, ${gold}, transparent)` }} />
            </div>
        </section>
    );
}
