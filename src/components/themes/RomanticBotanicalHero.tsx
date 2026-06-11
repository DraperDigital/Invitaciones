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

export default function RomanticBotanicalHero({ event, cfg, countdown, labels, heroImageUrl }: Props) {
    const eventDate = new Date(event.date_time);
    const heroBgColor = cfg.heroBgColor || cfg.hero_bg_color || '#F4F1EA';
    const primaryColor = cfg.primary_color || '#2C3E2D';
    const accentColor = cfg.accent_color || '#B98A73';
    
    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: heroBgColor }}>
            {/* Soft background glow */}
            <div className="absolute inset-0 opacity-50">
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full blur-[150px]" style={{ background: accentColor, opacity: 0.15 }} />
                <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] rounded-full blur-[150px]" style={{ background: primaryColor, opacity: 0.1 }} />
            </div>

            {heroImageUrl && (
                <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-12">
                    <div className="w-full h-full max-w-7xl mx-auto relative rounded-[3rem] sm:rounded-[4rem] overflow-hidden opacity-30 shadow-2xl">
                        <img src={heroImageUrl} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#F4F1EA]/80 to-transparent" />
                    </div>
                </div>
            )}
            
            <div className="relative z-10 text-center px-6 w-full max-w-3xl">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 mb-12">
                    <p className="text-[11px] sm:text-[13px] uppercase tracking-[0.4em] font-sans font-medium" style={{ color: accentColor }}>
                        {cfg.subtitle || labels.tagline}
                    </p>
                    
                    <h1 className="text-6xl xs:text-7xl sm:text-8xl md:text-[8rem] font-serif font-normal leading-[1.1] sm:leading-[1]" style={{ color: primaryColor }}>
                        {event.title}
                    </h1>
                </div>

                <div className="bg-white/40 backdrop-blur-md rounded-full px-8 py-4 sm:px-12 sm:py-6 inline-block shadow-sm border border-white/60 mb-12 animate-in fade-in duration-1000 delay-300">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
                        <p className="text-xl sm:text-2xl font-serif" style={{ color: primaryColor }}>
                            {format(eventDate, "EEEE d 'de' MMMM", { locale: es })}
                        </p>
                        <div className="hidden sm:block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                        <p className="text-lg sm:text-xl font-sans font-light tracking-widest" style={{ color: primaryColor }}>
                            {format(eventDate, 'yyyy', { locale: es })}
                        </p>
                    </div>
                </div>

                {(cfg.showCountdown !== false) && (
                    <div className="flex justify-center items-center gap-6 sm:gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                        {[
                            { label: 'Días', value: countdown.days },
                            { label: 'Hrs', value: countdown.hours },
                            { label: 'Min', value: countdown.minutes },
                            { label: 'Seg', value: countdown.seconds },
                        ].map((item, idx) => (
                            <div key={item.label} className="text-center relative">
                                <p className="text-3xl sm:text-5xl font-serif mb-1" style={{ color: primaryColor }}>{item.value.toString().padStart(2, '0')}</p>
                                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: accentColor }}>{item.label}</p>
                                {idx < 3 && <div className="hidden sm:block absolute top-1/2 -right-6 sm:-right-6 w-px h-8 -translate-y-1/2 opacity-20" style={{ backgroundColor: primaryColor }} />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
