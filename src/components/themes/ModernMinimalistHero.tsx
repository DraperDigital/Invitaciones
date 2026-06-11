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

export default function ModernMinimalistHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection }: Props) {
    const eventDate = new Date(event.date_time);
    
    return (
        <>
            {/* Transparent Sticky Navigation */}
            <header className="fixed top-0 left-0 w-full z-50 bg-black/10 backdrop-blur-md border-b border-white/10 hidden md:block">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-center gap-10">
                    <button onClick={() => scrollToSection('hero')} className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/80 hover:text-white transition-colors">Inicio</button>
                    {(cfg.gallery_images?.length > 0 || cfg.photoGallery?.images?.length > 0) && (
                        <button onClick={() => scrollToSection('gallery')} className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/80 hover:text-white transition-colors">Fotos</button>
                    )}
                    <button onClick={() => scrollToSection('rsvp')} className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/80 hover:text-white transition-colors">RSVP</button>
                    <button onClick={() => scrollToSection('location')} className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/80 hover:text-white transition-colors">Ubicaciones</button>
                    {(cfg.hotels?.length > 0 || cfg.accommodations?.hotels?.length > 0) && (
                        <button onClick={() => scrollToSection('hotels')} className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/80 hover:text-white transition-colors">Hoteles</button>
                    )}
                </div>
            </header>

            <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-stone-900">
                {heroImageUrl && (
                    <div className="absolute inset-0">
                        <img src={heroImageUrl} alt="" className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-stone-900/90" />
                    </div>
                )}
                
                <div className="relative z-10 text-center px-6 w-full max-w-5xl mt-16 md:mt-0">
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-12 duration-1000 mb-16">
                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.6em] sm:tracking-[1em] font-sans text-accent font-black">
                            {cfg.subtitle || labels.tagline}
                        </p>
                        <h1 className="text-6xl xs:text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-serif font-light leading-[1.1] sm:leading-[0.9] tracking-tight text-white drop-shadow-lg">
                            {event.title}
                        </h1>
                    </div>

                    {(cfg.showCountdown !== false) && (
                        <div className="flex justify-center items-center gap-4 sm:gap-12 animate-in fade-in zoom-in duration-1000 delay-300 mb-16">
                            {[
                                { label: 'Días', value: countdown.days },
                                { label: 'Hrs', value: countdown.hours },
                                { label: 'Min', value: countdown.minutes },
                                { label: 'Seg', value: countdown.seconds },
                            ].map((item) => (
                                <div key={item.label} className="flex flex-col items-center">
                                    <div className="backdrop-blur-md bg-black/10 border border-white/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl hover:bg-black/20 transition-colors w-20 h-20 sm:w-28 sm:h-28 flex flex-col items-center justify-center">
                                        <p className="text-4xl sm:text-6xl font-serif font-light text-white mb-2">{item.value.toString().padStart(2, '0')}</p>
                                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-accent font-bold">{item.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                        <div className="text-center">
                            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-bold text-accent mb-2">Cuándo</p>
                            <p className="text-lg sm:text-xl font-serif text-white">{format(eventDate, "d 'de' MMMM", { locale: es })}</p>
                            <p className="text-xs sm:text-sm text-white/50">{format(eventDate, "yyyy", { locale: es })}</p>
                        </div>
                        <div className="hidden md:block w-px h-16 bg-white/20" />
                        <div className="text-center">
                            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-bold text-accent mb-2">Hora</p>
                            <p className="text-lg sm:text-xl font-serif text-white">{format(eventDate, 'HH:mm', { locale: es })} hrs</p>
                            <p className="text-xs sm:text-sm text-white/50 uppercase tracking-widest">Puntual</p>
                        </div>
                        <div className="hidden md:block w-px h-16 bg-white/20" />
                        <div className="text-center">
                            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-bold text-accent mb-2">Dónde</p>
                            <p className="text-lg sm:text-xl font-serif text-white">{event.venue_name}</p>
                            <p className="text-xs sm:text-sm text-white/50 truncate max-w-[200px]">{event.venue_address}</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
