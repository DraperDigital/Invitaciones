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

// Design tokens — matches the invitto-pro HTML exactly
const GOLD   = '#FAC345';
const GREEN  = '#527853';

export default function RomanticBotanicalHero({ event, cfg, countdown, labels, heroImageUrl }: Props) {
    const eventDate  = new Date(event.date_time);
    const tagline    = cfg.subtitle || labels?.tagline || 'Nuestra Boda';
    const fallbackBg = heroImageUrl
        ? `url(${heroImageUrl})`
        : `linear-gradient(to bottom, ${GREEN} 0%, #2a4030 100%)`;

    return (
        <section
            id="hero"
            className="relative flex flex-col items-center justify-end pb-14 sm:pb-16 overflow-hidden"
            style={{
                minHeight: '85vh',
                backgroundImage: fallbackBg,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Dark gradient overlay — from-black/70 to-transparent */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            {/* Content — anchored at bottom */}
            <div className="relative z-10 text-center text-white px-6 w-full max-w-sm mx-auto">

                {/* Gold tagline */}
                <p
                    className="font-sans uppercase text-xs mb-3 tracking-[0.3em] animate-in fade-in duration-700"
                    style={{ color: GOLD }}
                >
                    {tagline}
                </p>

                {/* Couple / event title */}
                <h1 className="font-serif text-4xl sm:text-5xl font-normal text-white mb-8 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    {event.title}
                </h1>

                {/* Date strip */}
                <p className="font-sans text-xs tracking-widest uppercase text-white/70 mb-6">
                    {format(eventDate, "EEEE d 'de' MMMM · yyyy", { locale: es })}
                </p>

                {/* Countdown — border-t/b gold, numbers inline */}
                {cfg.showCountdown !== false && (
                    <div
                        className="flex justify-center gap-6 font-serif py-3 animate-in fade-in duration-700 delay-200"
                        style={{ borderTop: `1px solid ${GOLD}80`, borderBottom: `1px solid ${GOLD}80` }}
                    >
                        {[
                            { label: 'Días',  value: countdown.days },
                            { label: 'Hrs',   value: countdown.hours },
                            { label: 'Min',   value: countdown.minutes },
                            { label: 'Seg',   value: countdown.seconds },
                        ].map(item => (
                            <div key={item.label} className="text-center">
                                <span className="block text-2xl sm:text-3xl font-serif text-white">
                                    {String(item.value).padStart(2, '0')}
                                </span>
                                <span className="text-[10px] uppercase tracking-wider text-white/70">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Scroll hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-bounce opacity-50">
                <div className="w-px h-8 mx-auto" style={{ background: GOLD }} />
            </div>
        </section>
    );
}
