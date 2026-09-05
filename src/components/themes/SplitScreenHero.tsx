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

export default function SplitScreenHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection }: Props) {
    const primaryColor = cfg.button_color || cfg.buttonColor || cfg.primaryColor || cfg.primary_color || '#1B2E1D';
    const heroText = cfg.hero_text_color || cfg.heroTextColor || '#FFFFFF';
    
    const eventDate = new Date(event.date_time);
    const dateStr = format(eventDate, "d 'de' MMMM, yyyy", { locale: es });

    return (
        <div className="relative min-h-screen flex flex-col md:flex-row overflow-hidden bg-white theme-splitscreen-wrapper">
            {/* Left Image Side */}
            <div className="w-full md:w-1/2 h-[42vh] sm:h-[48vh] md:h-screen relative theme-splitscreen-img">
                {heroImageUrl ? (
                    <img src={heroImageUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-stone-200 animate-pulse" />
                )}
            </div>

            {/* Right Content Side */}
            <div className="w-full md:w-1/2 min-h-[58vh] sm:min-h-[52vh] md:h-screen flex flex-col justify-center p-6 sm:p-12 lg:p-20 relative theme-splitscreen-content" style={{ backgroundColor: primaryColor }}>
                <nav className="absolute top-5 sm:top-8 left-6 sm:left-8 right-6 sm:right-8 flex justify-end gap-6 text-[10px] tracking-[0.2em] font-bold uppercase text-white/70">
                    <button onClick={() => scrollToSection('rsvp')} className="hover:text-white transition-colors">RSVP</button>
                    <button onClick={() => scrollToSection('location')} className="hover:text-white transition-colors">Ubicaciones</button>
                </nav>

                <div className="max-w-lg w-full mx-auto text-left animate-in fade-in slide-in-from-right-8 duration-1000 mt-6 sm:mt-0">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-bold text-white/60 mb-3 sm:mb-6">{event.event_type === 'wedding' ? 'Nos Casamos' : labels.welcome}</p>
                    <h1 className="text-2xl sm:text-4xl lg:text-6xl font-serif leading-tight mb-4 sm:mb-8 break-normal" style={{ color: heroText }}>
                        {event.title}
                    </h1>
                    
                    <div className="h-px w-16 sm:w-24 bg-white/30 mb-4 sm:mb-8" />
                    
                    <p className="text-sm sm:text-xl text-white/80 font-serif mb-6 sm:mb-12 italic">
                        {dateStr}
                    </p>

                    {(countdown.days > 0 || countdown.hours > 0) && (
                        <div className="flex items-center gap-6 sm:gap-8">
                            {[
                                { label: 'Días', value: countdown.days },
                                { label: 'Hrs', value: countdown.hours },
                                { label: 'Min', value: countdown.minutes },
                            ].map((item) => (
                                <div key={item.label}>
                                    <p className="text-3xl sm:text-5xl font-serif text-white">{item.value.toString().padStart(2, '0')}</p>
                                    <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-accent font-bold mt-1 sm:mt-2">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
