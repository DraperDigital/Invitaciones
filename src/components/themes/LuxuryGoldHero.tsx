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
        <div className="relative min-h-screen bg-[#0a0a0a] text-[#d4af37] flex flex-col items-center justify-center p-3 sm:p-6 border-4 sm:border-[12px] border-[#d4af37]/20 overflow-hidden">
            {/* Subtle Luxury Background Photo if provided */}
            {heroImageUrl && (
                <div
                    className="absolute inset-0 opacity-20 mix-blend-luminosity pointer-events-none"
                    style={getHeroBackgroundStyle(cfg, heroImageUrl)}
                />
            )}

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />

            <nav className="absolute top-6 sm:top-12 w-full flex justify-center gap-8 sm:gap-12 text-[10px] tracking-[0.3em] sm:tracking-[0.4em] font-light uppercase z-20">
                <button onClick={() => scrollToSection('rsvp')} className="hover:text-white transition-colors cursor-pointer">RSVP</button>
                <button onClick={() => scrollToSection('location')} className="hover:text-white transition-colors cursor-pointer">Ubicación</button>
            </nav>

            <div className="relative z-10 w-full max-w-2xl mx-auto border border-[#d4af37]/30 p-6 sm:p-16 md:p-24 text-center backdrop-blur-sm bg-black/50 shadow-2xl rounded-2xl sm:rounded-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
                
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-light mb-4 sm:mb-8 opacity-80">
                    {cfg?.subtitle || labels?.welcome || labels?.tagline || 'GALA & CELEBRACIÓN'}
                </p>
                
                <h1 className="text-2xl sm:text-5xl md:text-7xl font-serif font-light tracking-normal sm:tracking-wide leading-tight mb-6 sm:mb-8 break-normal hyphens-none" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {event.title}
                </h1>

                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
                    <div className="h-px w-8 sm:w-12 bg-[#d4af37]/40" />
                    <p className="text-xs sm:text-sm font-serif italic">{format(eventDate, "d 'de' MMMM, yyyy", { locale: es })}</p>
                    <div className="h-px w-8 sm:w-12 bg-[#d4af37]/40" />
                </div>

                {((countdown?.days ?? 0) > 0 || (countdown?.hours ?? 0) > 0 || (countdown?.minutes ?? 0) > 0) && (
                    <div className="flex justify-center gap-5 sm:gap-16">
                        {[
                            { label: 'Días', value: countdown?.days ?? 0 },
                            { label: 'Hrs', value: countdown?.hours ?? 0 },
                            { label: 'Min', value: countdown?.minutes ?? 0 },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className="text-2xl sm:text-4xl font-serif font-light">{item.value.toString().padStart(2, '0')}</p>
                                <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-1 sm:mt-2 opacity-60">{item.label}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
