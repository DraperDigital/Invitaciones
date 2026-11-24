import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getHeroImageStyle } from '../../lib/heroImagePosition';

interface Props {
    event: any;
    cfg: any;
    countdown: any;
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
    onEditHero?: () => void;
}

export default function ModernMinimalistHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero: _onEditHero }: Props) {
    const eventDate = new Date(event.date_time);
    
    const heroBg = cfg.heroBgColor || cfg.hero_bg_color || '#1c1917';
    const heroText = cfg.hero_text_color || cfg.heroTextColor || '#ffffff';

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

            <section id="hero" className="relative min-h-[100svh] min-h-screen flex flex-col justify-between md:justify-center items-center overflow-hidden py-10 md:py-0" style={{ backgroundColor: heroBg }}>
                {heroImageUrl && (
                    <div className="absolute inset-0">
                        <img src={heroImageUrl} alt="" className="w-full h-full object-cover opacity-60" style={getHeroImageStyle(cfg)} />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/85 md:from-black/40 md:via-black/20 md:to-black/80" />
                    </div>
                )}
                
                {/* ── Bloque Superior (Título / Monograma) ── */}
                <div className="relative z-10 text-center px-6 w-full max-w-5xl pt-4 md:pt-0">
                    <div className="space-y-3 sm:space-y-6 animate-in fade-in slide-in-from-top-12 duration-1000 md:mb-16">
                        {(cfg.decorative_image_url || cfg.decorativeImage) && (
                            <div className="flex justify-center mb-2">
                                <img
                                    src={cfg.decorative_image_url || cfg.decorativeImage}
                                    alt="Logo o Monograma"
                                    className="h-10 sm:h-16 w-auto max-w-[160px] sm:max-w-[180px] object-contain drop-shadow-md"
                                />
                            </div>
                        )}
                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.5em] sm:tracking-[1em] font-sans text-white/90 font-bold">
                            {cfg.subtitle || labels.tagline}
                        </p>
                        <h1 className="text-3xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-light leading-[1.1] sm:leading-[0.9] tracking-tight drop-shadow-lg break-normal hyphens-none" style={{ color: heroText }}>
                            {event.title}
                        </h1>
                    </div>
                </div>

                {/* ── Espaciador en móvil para mantener libres los rostros / torsos de los novios ── */}
                <div className="flex-1 min-h-[120px] md:hidden pointer-events-none" aria-hidden="true" />

                {/* ── Bloque Inferior (Conteo regresivo + Detalles) ── */}
                <div className="relative z-10 text-center px-4 sm:px-6 w-full max-w-5xl pb-4 md:pb-0">
                    {(cfg.showCountdown !== false) && (
                        <div className="theme-modern-countdown flex justify-center items-center gap-2 sm:gap-6 md:gap-10 animate-in fade-in zoom-in duration-1000 delay-300 mb-6 sm:mb-10 md:mb-16 w-full px-2 max-w-full">
                            {[
                                { label: 'Días', value: countdown.days },
                                { label: 'Hrs', value: countdown.hours },
                                { label: 'Min', value: countdown.minutes },
                                { label: 'Seg', value: countdown.seconds },
                            ].map((item) => (
                                <div key={item.label} className="flex flex-col items-center">
                                    <div className="theme-modern-countdown-box backdrop-blur-md bg-black/30 border border-white/20 p-2 sm:p-5 rounded-xl sm:rounded-3xl shadow-xl hover:bg-black/40 transition-colors w-[4rem] h-[4.2rem] sm:w-24 sm:h-28 md:w-28 md:h-28 flex flex-col items-center justify-center">
                                        <p className="text-2xl sm:text-5xl md:text-6xl font-serif font-light text-white mb-0.5 sm:mb-2">{item.value.toString().padStart(2, '0')}</p>
                                        <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.3em] text-white/80 font-bold">{item.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="theme-modern-details flex flex-row items-center justify-center gap-3 sm:gap-8 md:gap-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 w-full px-2 max-w-3xl mx-auto">
                        <div className="text-center flex-1">
                            <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] font-bold text-white/90 mb-0.5 sm:mb-2">Cuándo</p>
                            <p className="text-xs sm:text-xl font-serif text-white">{format(eventDate, "d 'de' MMMM", { locale: es })}</p>
                            <p className="text-[10px] sm:text-sm text-white/50">{format(eventDate, "yyyy", { locale: es })}</p>
                        </div>
                        <div className="w-px h-8 sm:h-16 bg-white/20 theme-modern-divider shrink-0" />
                        <div className="text-center flex-1">
                            <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] font-bold text-white/90 mb-0.5 sm:mb-2">Hora</p>
                            <p className="text-xs sm:text-xl font-serif text-white">{format(eventDate, 'HH:mm', { locale: es })} hrs</p>
                            <p className="text-[10px] sm:text-sm text-white/50 uppercase tracking-widest">Puntual</p>
                        </div>
                        <div className="w-px h-8 sm:h-16 bg-white/20 theme-modern-divider shrink-0" />
                        <div className="text-center flex-1 max-w-[130px] sm:max-w-xs">
                            <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] font-bold text-white/90 mb-0.5 sm:mb-2">Dónde</p>
                            <p className="text-xs sm:text-xl font-serif text-white truncate">{event.venue_name}</p>
                            <p className="text-[10px] sm:text-sm text-white/60 truncate">{event.venue_address}</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
