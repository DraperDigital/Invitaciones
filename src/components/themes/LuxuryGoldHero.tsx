import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getHeroBackgroundStyle } from '../../lib/heroImagePosition';

interface Props {
    event: any;
    cfg: any;
    countdown: any;
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
    onEditHero?: () => void;
}

export default function LuxuryGoldHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero: _onEditHero }: Props) {
    const eventDate = new Date(event.date_time);

    return (
        <div className="relative min-h-[100svh] min-h-screen bg-[#0a0a0a] text-[#d4af37] flex flex-col items-center justify-between sm:justify-center p-3 sm:p-6 border-4 sm:border-[12px] border-[#d4af37]/20 overflow-hidden">
            {/* Subtle Luxury Background Photo if provided */}
            {heroImageUrl && (
                <>
                    <div
                        className="absolute inset-0 opacity-40 sm:opacity-25 mix-blend-luminosity pointer-events-none"
                        style={getHeroBackgroundStyle(cfg, heroImageUrl)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/85 pointer-events-none" />
                </>
            )}

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />

            <nav className="relative sm:absolute top-0 sm:top-12 w-full pt-4 sm:pt-0 flex justify-center gap-8 sm:gap-12 text-[10px] tracking-[0.3em] sm:tracking-[0.4em] font-light uppercase z-20">
                <button onClick={() => scrollToSection('rsvp')} className="hover:text-white transition-colors cursor-pointer">RSVP</button>
                <button onClick={() => scrollToSection('location')} className="hover:text-white transition-colors cursor-pointer">Ubicación</button>
            </nav>

            {/* Espaciador flexible en móvil para despejar el rostro de los anfitriones */}
            <div className="flex-1 min-h-[140px] sm:hidden pointer-events-none" aria-hidden="true" />

            <div className="relative z-10 w-full max-w-2xl mx-auto border border-[#d4af37]/30 p-5 sm:p-14 md:p-20 text-center backdrop-blur-md bg-black/65 sm:bg-black/50 shadow-2xl rounded-2xl sm:rounded-none mt-auto mb-2 sm:my-auto">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
                
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.5em] font-light mb-2 sm:mb-6 opacity-80">
                    {cfg?.subtitle || labels?.welcome || labels?.tagline || 'GALA & CELEBRACIÓN'}
                </p>
                
                <h1 className="text-xl sm:text-4xl md:text-6xl font-serif font-light tracking-normal sm:tracking-wide leading-tight mb-4 sm:mb-6 break-normal hyphens-none" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {event.title}
                </h1>

                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-8">
                    <div className="h-px w-8 sm:w-12 bg-[#d4af37]/40" />
                    <p className="text-xs sm:text-sm font-serif italic">{format(eventDate, "d 'de' MMMM, yyyy", { locale: es })}</p>
                    <div className="h-px w-8 sm:w-12 bg-[#d4af37]/40" />
                </div>

                {((countdown?.days ?? 0) > 0 || (countdown?.hours ?? 0) > 0 || (countdown?.minutes ?? 0) > 0) && (
                    <div className="flex justify-center gap-6 sm:gap-16">
                        {[
                            { label: 'Días', value: countdown?.days ?? 0 },
                            { label: 'Hrs', value: countdown?.hours ?? 0 },
                            { label: 'Min', value: countdown?.minutes ?? 0 },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className="text-xl sm:text-3xl font-serif font-light">{item.value.toString().padStart(2, '0')}</p>
                                <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] sm:tracking-[0.4em] mt-0.5 sm:mt-1 opacity-60">{item.label}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
