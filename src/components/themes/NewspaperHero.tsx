import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2 } from 'lucide-react';
import { getHeroImageStyle } from '../../lib/heroImagePosition';

interface Props {
    event: any;
    cfg: any;
    countdown: { days: number; hours: number; minutes: number; seconds: number };
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
    onEditHero?: () => void;
}

function getInitials(title: string) {
    const parts = title.split(/ y | & | Y | e | E /i);
    if (parts.length >= 2 && parts[0].trim() && parts[1].trim()) {
        return `${parts[0].trim()[0]}${parts[1].trim()[0]}`.toUpperCase();
    }
    return title.slice(0, 2).toUpperCase();
}

export default function NewspaperHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const eventDate = new Date(event.date_time);
    const ink = cfg.hero_text_color || cfg.heroTextColor || '#1A1A1A';

    return (
        <section id="hero" className="relative w-full bg-white" style={{ color: ink }}>
            {/* Cabecera tipo periódico */}
            <header className="flex items-center justify-between px-6 sm:px-10 py-4 border-b" style={{ borderColor: `${ink}26` }}>
                <div className="h-8 w-8 rounded-full border flex items-center justify-center text-[10px] font-serif font-bold" style={{ borderColor: ink }}>
                    {getInitials(event.title)}
                </div>
                <nav className="hidden sm:flex gap-6 text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: `${ink}B3` }}>
                    <button onClick={() => scrollToSection('location')} className="hover:opacity-70 transition-opacity">{labels?.reception ? 'Cuándo y dónde' : 'Ubicación'}</button>
                    <button onClick={() => scrollToSection('itinerary')} className="hover:opacity-70 transition-opacity">Itinerario</button>
                    <button onClick={() => scrollToSection('gifts')} className="hover:opacity-70 transition-opacity">Mesa de regalos</button>
                    <button onClick={() => scrollToSection('rsvp')} className="hover:opacity-70 transition-opacity">Confirmación</button>
                </nav>
            </header>

            {/* Cabezal / nameplate */}
            <div className="px-6 py-10 sm:py-14 text-center max-w-4xl mx-auto">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] mb-4" style={{ color: `${ink}80` }}>
                    {format(eventDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })} · Edición Especial
                </p>
                <div className="h-px w-full mb-4" style={{ background: ink }} />
                <h1 className="font-serif font-black text-4xl sm:text-6xl md:text-7xl tracking-tight leading-none break-normal hyphens-none">
                    {event.title}
                </h1>
                <div className="h-px w-full mt-4 mb-4" style={{ background: ink }} />
                <p className="font-serif italic text-sm sm:text-base" style={{ color: `${ink}B3` }}>
                    {cfg.subtitle || 'Acompáñanos a celebrar este gran día'}
                </p>
            </div>

            {/* Nota principal a dos columnas: fotografía + texto editorial */}
            <div className="max-w-5xl mx-auto sm:px-6 pb-12">
                <div className="grid sm:grid-cols-2 border-t border-b" style={{ borderColor: ink }}>
                    <div
                        onClick={onEditHero}
                        className={`relative aspect-[4/5] sm:aspect-auto overflow-hidden group/newspaper-photo ${onEditHero ? 'cursor-pointer' : ''}`}
                        style={{ background: `${ink}0D` }}
                        title={onEditHero ? 'Haz clic para cambiar la fotografía' : undefined}
                    >
                        {heroImageUrl ? (
                            <img
                                src={heroImageUrl}
                                alt={event.title}
                                className="w-full h-full object-cover grayscale contrast-125"
                                style={getHeroImageStyle(cfg)}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-serif italic text-sm" style={{ color: `${ink}4D` }}>
                                Sin fotografía
                            </div>
                        )}
                        {onEditHero && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/newspaper-photo:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                                <Edit2 className="h-4 w-4" /> Cambiar Foto
                            </div>
                        )}
                    </div>

                    <div className="p-8 sm:p-10 flex flex-col justify-center" style={{ background: ink, color: '#FFFFFF' }}>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wide mb-4">
                            {cfg.banner_title || 'Nos Casamos'}
                        </h2>
                        <p className="font-serif text-sm sm:text-base leading-relaxed whitespace-pre-line text-white/80">
                            {cfg.welcome_message || 'Dos historias que se convierten en una sola. Acompáñanos a celebrar el inicio de esta nueva aventura juntos.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Cuenta regresiva */}
            {cfg.showCountdown !== false && cfg.show_countdown !== false && (
                <div className="max-w-md mx-auto px-6 pb-14 text-center">
                    <div className="grid grid-cols-4 gap-4 sm:gap-6">
                        {[
                            { value: countdown.days, label: 'Días' },
                            { value: countdown.hours, label: 'Horas' },
                            { value: countdown.minutes, label: 'Min' },
                            { value: countdown.seconds, label: 'Seg' },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className="font-serif text-3xl sm:text-4xl font-black">{String(item.value).padStart(2, '0')}</p>
                                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mt-1" style={{ color: `${ink}80` }}>{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
