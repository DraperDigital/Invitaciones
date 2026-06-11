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

export default function ClassicEleganceHero({ event, cfg, countdown, labels, heroImageUrl }: Props) {
    const eventDate = new Date(event.date_time);
    const heroBgColor = cfg.heroBgColor || cfg.hero_bg_color || '#FDFBF7';
    const primaryColor = cfg.primary_color || '#1B2E1D';
    const accentColor = cfg.accent_color || '#BD7474';
    
    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: heroBgColor }}>
            {heroImageUrl ? (
                <div className="absolute inset-0">
                    <img src={heroImageUrl} alt="" className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
                </div>
            ) : (
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px]" style={{ background: accentColor }} />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px]" style={{ background: primaryColor, opacity: 0.2 }} />
                </div>
            )}
            
            <div className="relative z-10 text-center px-6 w-full max-w-4xl py-20">
                <div className="border-t border-b py-16 px-8 relative animate-in fade-in slide-in-from-bottom-8 duration-1000" style={{ borderColor: `${primaryColor}30` }}>
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l" style={{ borderColor: primaryColor }} />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r" style={{ borderColor: primaryColor }} />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l" style={{ borderColor: primaryColor }} />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r" style={{ borderColor: primaryColor }} />

                    <p className="text-xs sm:text-sm uppercase tracking-[0.6em] font-sans font-bold mb-8" style={{ color: accentColor }}>
                        {cfg.subtitle || labels.tagline}
                    </p>
                    
                    <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-serif font-light leading-[1.2] mb-10 tracking-wide" style={{ color: primaryColor }}>
                        {event.title}
                    </h1>

                    <div className="flex flex-col items-center justify-center gap-2 mb-12">
                        <p className="text-lg sm:text-xl font-serif" style={{ color: primaryColor }}>
                            {format(eventDate, "EEEE d 'de' MMMM", { locale: es })}
                        </p>
                        <p className="text-sm font-sans uppercase tracking-[0.3em] font-bold" style={{ color: accentColor }}>
                            {format(eventDate, 'yyyy', { locale: es })}
                        </p>
                    </div>

                    {(cfg.showCountdown !== false) && (
                        <div className="flex justify-center items-center gap-6 sm:gap-16">
                            {[
                                { label: 'Días', value: countdown.days },
                                { label: 'Horas', value: countdown.hours },
                                { label: 'Minutos', value: countdown.minutes },
                                { label: 'Segundos', value: countdown.seconds },
                            ].map((item) => (
                                <div key={item.label} className="text-center">
                                    <p className="text-3xl sm:text-5xl font-serif mb-2" style={{ color: primaryColor }}>{item.value.toString().padStart(2, '0')}</p>
                                    <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.4em] font-bold" style={{ color: accentColor }}>{item.label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="mt-16 animate-bounce">
                    <div className="h-12 w-px mx-auto" style={{ backgroundColor: accentColor }} />
                </div>
            </div>
        </section>
    );
}
