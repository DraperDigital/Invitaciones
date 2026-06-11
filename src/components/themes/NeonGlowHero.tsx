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
        <div className="relative min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 overflow-hidden">
            {/* Dark background pattern or image */}
            <div className="absolute inset-0 z-0 opacity-40">
                {heroImageUrl ? (
                    <img src={heroImageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-b from-black via-zinc-900 to-black" />
                )}
                <div className="absolute inset-0 bg-black/60" />
            </div>

            <nav className="absolute top-8 w-full px-8 z-20 flex justify-center gap-8 text-[11px] tracking-widest font-bold uppercase text-white/50">
                <button onClick={() => scrollToSection('rsvp')} className="hover:text-white transition-colors" style={{textShadow: `0 0 10px ${primaryColor}80`}}>RSVP</button>
                <button onClick={() => scrollToSection('location')} className="hover:text-white transition-colors" style={{textShadow: `0 0 10px ${primaryColor}80`}}>Ubicación</button>
            </nav>

            <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
                <p className="text-[12px] uppercase tracking-[0.5em] font-black text-white/50 mb-8">{labels.welcome}</p>
                
                <h1 
                    className="text-6xl sm:text-8xl md:text-9xl font-black italic tracking-tighter uppercase mb-6 drop-shadow-2xl"
                    style={{ 
                        color: '#fff',
                        textShadow: `0 0 10px #fff, 0 0 20px #fff, 0 0 40px ${primaryColor}, 0 0 80px ${primaryColor}, 0 0 120px ${primaryColor}`
                    }}
                >
                    {event.title}
                </h1>

                <div className="flex items-center gap-6 mt-12 mb-16 px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
                    <p className="text-xl font-medium tracking-widest uppercase">{format(eventDate, "d 'de' MMMM", { locale: es })}</p>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }} />
                    <p className="text-xl font-medium tracking-widest uppercase">{format(eventDate, 'HH:mm', { locale: es })} hrs</p>
                </div>

                {(countdown.days > 0 || countdown.hours > 0) && (
                    <div className="flex gap-6 sm:gap-12 text-center">
                        {[
                            { label: 'Días', value: countdown.days },
                            { label: 'Hrs', value: countdown.hours },
                            { label: 'Min', value: countdown.minutes },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className="text-5xl sm:text-7xl font-black tabular-nums" style={{ textShadow: `0 0 20px ${primaryColor}80` }}>{item.value.toString().padStart(2, '0')}</p>
                                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 mt-2">{item.label}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
