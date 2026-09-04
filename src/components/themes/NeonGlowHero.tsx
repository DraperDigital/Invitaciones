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

export default function NeonGlowHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection }: Props) {
    const primaryColor = cfg.primaryColor || cfg.primary_color || '#ff00ff';
    const eventDate = new Date(event.date_time);

    return (
        <div className="relative min-h-screen bg-black text-white flex flex-col justify-center items-center p-4 sm:p-6 overflow-hidden">
            {/* Dark background pattern or image */}
            <div className="absolute inset-0 z-0 opacity-40">
                {heroImageUrl ? (
                    <img src={heroImageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-b from-black via-zinc-900 to-black" />
                )}
                <div className="absolute inset-0 bg-black/60" />
            </div>

            <nav className="absolute top-6 sm:top-8 w-full px-4 sm:px-8 z-20 flex justify-center gap-6 sm:gap-8 text-[10px] sm:text-[11px] tracking-widest font-bold uppercase text-white/50">
                <button onClick={() => scrollToSection('rsvp')} className="hover:text-white transition-colors" style={{textShadow: `0 0 10px ${primaryColor}80`}}>RSVP</button>
                <button onClick={() => scrollToSection('location')} className="hover:text-white transition-colors" style={{textShadow: `0 0 10px ${primaryColor}80`}}>Ubicación</button>
            </nav>

            <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center px-4 w-full">
                <p className="text-[10px] sm:text-[12px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-black text-white/60 mb-4 sm:mb-8">{labels.welcome}</p>
                
                <h1 
                    className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-black italic tracking-tight uppercase mb-4 sm:mb-6 leading-tight drop-shadow-2xl max-w-full"
                    style={{ 
                        color: '#fff',
                        textShadow: `0 0 8px rgba(255,255,255,0.8), 0 0 20px ${primaryColor}, 0 0 40px ${primaryColor}99`
                    }}
                >
                    {event.title}
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 sm:mt-10 mb-8 sm:mb-14 px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md max-w-full">
                    <p className="text-sm sm:text-lg font-medium tracking-wider sm:tracking-widest uppercase">{format(eventDate, "d 'de' MMMM", { locale: es })}</p>
                    <div className="w-1.5 h-1.5 rounded-full hidden xs:block" style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }} />
                    <p className="text-sm sm:text-lg font-medium tracking-wider sm:tracking-widest uppercase">{format(eventDate, 'HH:mm', { locale: es })} hrs</p>
                </div>

                {(countdown.days > 0 || countdown.hours > 0) && (
                    <div className="flex gap-4 sm:gap-10 text-center">
                        {[
                            { label: 'Días', value: countdown.days },
                            { label: 'Hrs', value: countdown.hours },
                            { label: 'Min', value: countdown.minutes },
                        ].map((item) => (
                            <div key={item.label} className="min-w-[55px] sm:min-w-[80px]">
                                <p className="text-3xl sm:text-6xl md:text-7xl font-black tabular-nums" style={{ textShadow: `0 0 15px ${primaryColor}99` }}>{item.value.toString().padStart(2, '0')}</p>
                                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-bold text-white/50 mt-1 sm:mt-2">{item.label}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
