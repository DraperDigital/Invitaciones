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
    const primaryColor = cfg.primaryColor || cfg.primary_color || '#1B2E1D';
    
    const eventDate = new Date(event.date_time);
    const dateStr = format(eventDate, "d 'de' MMMM, yyyy", { locale: es });

    return (
        <div className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden bg-white">
            {/* Left Image Side */}
            <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen relative">
                {heroImageUrl ? (
                    <img src={heroImageUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-stone-200 animate-pulse" />
                )}
            </div>

            {/* Right Content Side */}
            <div className="w-full lg:w-1/2 min-h-[50vh] lg:h-screen flex flex-col justify-center p-8 sm:p-16 lg:p-24 relative" style={{ backgroundColor: primaryColor }}>
                <nav className="absolute top-8 left-8 right-8 flex justify-end gap-6 text-[10px] tracking-[0.2em] font-bold uppercase text-white/60">
                    <button onClick={() => scrollToSection('rsvp')} className="hover:text-white transition-colors">RSVP</button>
                    <button onClick={() => scrollToSection('location')} className="hover:text-white transition-colors">Ubicaciones</button>
                </nav>

                <div className="max-w-lg w-full mx-auto text-left animate-in fade-in slide-in-from-right-8 duration-1000">
                    <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-white/50 mb-6">{event.event_type === 'wedding' ? 'Nos Casamos' : labels.welcome}</p>
                    <h1 className="text-5xl sm:text-7xl font-serif text-white leading-tight mb-8">
                        {event.title}
                    </h1>
                    
                    <div className="h-px w-24 bg-white/20 mb-8" />
                    
                    <p className="text-xl text-white/80 font-serif mb-12 italic">
                        {dateStr}
                    </p>

                    {(countdown.days > 0 || countdown.hours > 0) && (
                        <div className="flex items-center gap-8">
                            {[
                                { label: 'Días', value: countdown.days },
                                { label: 'Hrs', value: countdown.hours },
                                { label: 'Min', value: countdown.minutes },
                            ].map((item) => (
                                <div key={item.label}>
                                    <p className="text-5xl font-serif text-white">{item.value.toString().padStart(2, '0')}</p>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mt-2">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
