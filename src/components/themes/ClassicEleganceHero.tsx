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

export default function ClassicEleganceHero({ event, cfg, countdown, heroImageUrl, scrollToSection }: Props) {
    const eventDate = new Date(event.date_time || Date.now());
    const primaryGold = '#C5A059';

    // Couples Initials Monogram
    const getInitials = () => {
        if (!event?.title) return 'E & W';
        const parts = event.title.split(/ y | & | Y | e | E /i);
        if (parts.length >= 2) {
            return `${parts[0].trim()[0]} & ${parts[1].trim()[0]}`;
        }
        return event.title.slice(0, 3).toUpperCase();
    };

    return (
        <section id="hero" className="w-full bg-[#FAF8F5] text-[#2B2625] font-serif relative overflow-hidden select-none">
            {/* ── Background Botanical & Filigree SVGs ── */}
            <div className="absolute top-0 left-0 w-48 sm:w-80 h-48 sm:h-80 pointer-events-none opacity-25">
                <svg viewBox="0 0 200 200" fill="none" stroke={primaryGold} strokeWidth="1">
                    <path d="M10,10 Q50,90 100,10 T190,10" />
                    <circle cx="40" cy="40" r="15" />
                    <path d="M20,20 C60,40 40,80 80,60" />
                    <path d="M0,0 C50,100 100,50 150,150" />
                </svg>
            </div>
            <div className="absolute top-0 right-0 w-48 sm:w-80 h-48 sm:h-80 pointer-events-none opacity-25 transform scale-x-[-1]">
                <svg viewBox="0 0 200 200" fill="none" stroke={primaryGold} strokeWidth="1">
                    <path d="M10,10 Q50,90 100,10 T190,10" />
                    <circle cx="40" cy="40" r="15" />
                    <path d="M20,20 C60,40 40,80 80,60" />
                </svg>
            </div>

            {/* ── 1. Top Header & Navigation Bar ── */}
            <header className="w-full pt-8 pb-4 text-center border-b border-[#C5A059]/20 relative z-20 bg-[#FAF8F5]/90 backdrop-blur-sm">
                {/* Gold Crest / Tiara Ornament */}
                <div className="flex justify-center mb-1">
                    <svg width="36" height="18" viewBox="0 0 40 20" fill="none" stroke={primaryGold} strokeWidth="1.2">
                        <path d="M20 2 L25 10 L35 4 L30 18 L10 18 L5 4 L15 10 Z" />
                        <circle cx="20" cy="2" r="1.5" fill={primaryGold} />
                        <circle cx="5" cy="4" r="1" fill={primaryGold} />
                        <circle cx="35" cy="4" r="1" fill={primaryGold} />
                    </svg>
                </div>
                {/* Monogram */}
                <h2 className="text-xl sm:text-2xl font-serif tracking-[0.25em] text-[#C5A059] font-normal mb-3">
                    {getInitials()}
                </h2>
                {/* Links */}
                <nav className="flex flex-wrap justify-center gap-2.5 sm:gap-6 px-2 text-[9px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.3em] text-[#554D47] font-sans font-semibold">
                    <button onClick={() => scrollToSection('guest_welcome')} className="hover:text-[#C5A059] transition-colors">SOBRE NOSOTROS</button>
                    <button onClick={() => scrollToSection('location')} className="hover:text-[#C5A059] transition-colors">EVENTOS</button>
                    <button onClick={() => scrollToSection('itinerary')} className="hover:text-[#C5A059] transition-colors">ITINERARIO</button>
                    <button onClick={() => scrollToSection('registry')} className="hover:text-[#C5A059] transition-colors">REGALOS</button>
                    <button onClick={() => scrollToSection('rsvp')} className="hover:text-[#C5A059] transition-colors">RSVP</button>
                </nav>
            </header>

            {/* ── 2. Hero Title & Framed Couple Photo ── */}
            <div className="py-12 sm:py-20 px-4 text-center relative z-10 max-w-4xl mx-auto">
                <div className="space-y-3 mb-8">
                    <h1 className="text-2xl sm:text-5xl md:text-7xl font-serif tracking-normal sm:tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#9A7B38] uppercase font-light leading-tight break-normal hyphens-none">
                        {event?.title || 'ELEANOR & WILLIAM'}
                    </h1>
                    <p className="text-xs sm:text-sm uppercase tracking-[0.5em] text-[#5A5047] font-sans font-medium">
                        CELEBRA NUESTRO AMOR
                    </p>
                    <div className="inline-block mt-2 px-6 py-1.5 rounded-full border border-[#C5A059]/40 bg-[#FAF8F5] text-xs sm:text-sm font-sans tracking-[0.2em] text-[#8C7A5E]">
                        {format(eventDate, "dd 'DE' MMMM, yyyy", { locale: es }).toUpperCase()} &nbsp;|&nbsp; {event?.venue_name || 'CASA CAMPESTRE'}
                    </div>
                </div>

                {/* Framed Couple Photo */}
                <div className="relative mx-auto max-w-sm sm:max-w-md p-3 bg-white border-2 border-[#C5A059] shadow-2xl rounded-sm mb-14">
                    <div className="relative aspect-[3/4] overflow-hidden">
                        <img 
                            src={heroImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'} 
                            alt={event?.title || 'Pareja'} 
                            className="w-full h-full object-cover filter brightness-[1.02]"
                        />
                    </div>
                </div>

                {/* ── 3. Countdown Section ── */}
                {(cfg.showCountdown !== false) && (
                    <div className="py-10 border-t border-b border-[#C5A059]/30 relative my-8">
                        {/* Filigree Ornament top center */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FAF8F5] px-4 text-[#C5A059]">
                            ❦
                        </div>

                        <h3 className="text-xs sm:text-sm uppercase tracking-[0.4em] text-[#8C7A5E] font-sans font-bold mb-8">
                            CUENTA REGRESIVA PARA NUESTRO DÍA ESPECIAL
                        </h3>

                        <div className="theme-classic-countdown grid grid-cols-4 gap-2 sm:gap-6 max-w-xl mx-auto divide-x divide-[#C5A059]/30">
                            {[
                                { label: 'DÍAS', value: countdown.days },
                                { label: 'HORAS', value: countdown.hours },
                                { label: 'MIN', value: countdown.minutes },
                                { label: 'SEG', value: countdown.seconds },
                            ].map((item) => (
                                <div key={item.label} className="px-2 text-center">
                                    <span className="text-3xl sm:text-5xl font-serif text-[#C5A059] font-light block mb-1">
                                        {String(item.value).padStart(2, '0')}
                                    </span>
                                    <span className="text-[8px] sm:text-[10px] font-sans uppercase tracking-[0.3em] text-[#7A6E65] font-semibold">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#FAF8F5] px-4 text-[#C5A059]">
                            ❦
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
