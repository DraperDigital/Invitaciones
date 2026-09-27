import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Sparkles, HelpCircle, MapPin, Calendar, Clock, Edit2, Heart } from 'lucide-react';
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

export default function RevealBwHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const eventDate = new Date(event.date_time);
    const heroBg = cfg.heroBgColor || cfg.hero_bg_color || '#FFFFFF';
    const heroText = cfg.hero_text_color || cfg.heroTextColor || '#0A0A0A';

    // Interactive prediction poll (stored in state / localStorage for delight)
    const [userVote, setUserVote] = useState<'boy' | 'girl' | null>(() => {
        try {
            return localStorage.getItem(`reveal_vote_${event.id || 'demo'}`) as 'boy' | 'girl' | null;
        } catch {
            return null;
        }
    });

    const [voteCounts, setVoteCounts] = useState({ boy: 48, girl: 52 });

    const handleVote = (choice: 'boy' | 'girl') => {
        if (userVote) return;
        setUserVote(choice);
        try {
            localStorage.setItem(`reveal_vote_${event.id || 'demo'}`, choice);
        } catch {}
        setVoteCounts(prev => ({
            ...prev,
            [choice]: prev[choice] + 1
        }));
    };

    const totalVotes = voteCounts.boy + voteCounts.girl;
    const boyPercent = Math.round((voteCounts.boy / totalVotes) * 100);
    const girlPercent = 100 - boyPercent;

    return (
        <section 
            id="hero" 
            className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-24 select-none overflow-hidden font-sans border-b border-black"
            style={{ backgroundColor: heroBg }}
        >
            {/* Subtle Monochrome Ambient Details */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
                backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
            }} />

            {/* Floating Monochrome Mystery Elements */}
            <div className="absolute top-12 left-6 sm:left-16 text-stone-200 text-6xl sm:text-8xl font-black select-none pointer-events-none animate-pulse">
                ?
            </div>
            <div className="absolute bottom-16 right-6 sm:right-20 text-stone-200 text-7xl sm:text-9xl font-black select-none pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}>
                ?
            </div>

            <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
                
                {/* Top Secret Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] mb-6 shadow-md">
                    <HelpCircle className="h-3.5 w-3.5 text-stone-300" />
                    <span>Top Secret · Revelación de Género</span>
                </div>

                {/* Subtitle / Question */}
                <p className="text-xs sm:text-sm uppercase font-bold tracking-[0.4em] text-stone-500 mb-3">
                    {cfg.subtitle || labels.tagline || '¿Niño o Niña? El gran misterio'}
                </p>

                {/* Main Headline */}
                <h1 
                    className="text-4xl sm:text-7xl md:text-8xl font-display font-extrabold tracking-tight leading-[1.05] mb-6 break-normal uppercase"
                    style={{ color: heroText }}
                >
                    {event.title}
                </h1>

                {/* Optional Hero Image with Black & White Editorial Frame */}
                {heroImageUrl && (
                    <div className="relative my-6 group/bwphoto">
                        <div 
                            onClick={onEditHero}
                            className={`w-44 h-44 sm:w-56 sm:h-56 rounded-full p-2 bg-black shadow-2xl flex items-center justify-center transform hover:scale-105 transition-all duration-300 ${
                                onEditHero ? 'cursor-pointer' : ''
                            }`}
                            title={onEditHero ? 'Haz clic para cambiar foto' : undefined}
                        >
                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white relative">
                                <img
                                    src={heroImageUrl}
                                    alt="Gender Reveal"
                                    className="w-full h-full object-cover grayscale contrast-125"
                                    style={getHeroImageStyle(cfg)}
                                />
                                {onEditHero && (
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/bwphoto:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1">
                                        <Edit2 className="h-5 w-5" />
                                        <span>Editar Foto</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-black px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest text-black shadow-sm">
                            El Secreto
                        </span>
                    </div>
                )}

                {/* Intriguing Dedication Message */}
                <p className="max-w-xl mx-auto text-sm sm:text-base text-stone-600 font-normal leading-relaxed mb-10 px-4">
                    {cfg.welcomeMessage || 'Estamos a punto de descubrir el secreto más esperado de nuestras vidas. Acompáñanos a abrir el sobre y celebrar este momento inolvidable.'}
                </p>

                {/* Countdown Timer in Black & White Noir style */}
                {(cfg.showCountdown !== false) && (
                    <div className="w-full max-w-lg mb-12">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Clock className="h-3.5 w-3.5 text-stone-900" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-stone-900">
                                La revelación comienza en:
                            </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 sm:gap-4">
                            {[
                                { label: 'Días', value: countdown.days },
                                { label: 'Horas', value: countdown.hours },
                                { label: 'Min', value: countdown.minutes },
                                { label: 'Seg', value: countdown.seconds },
                            ].map((item) => (
                                <div 
                                    key={item.label}
                                    className="bg-black text-white p-3 sm:p-5 rounded-2xl border border-stone-800 shadow-xl flex flex-col items-center justify-center"
                                >
                                    <span className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight">
                                        {item.value.toString().padStart(2, '0')}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-stone-400 mt-1">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Interactive Intuition Poll / Votación para invitados */}
                <div className="w-full max-w-md bg-stone-50 border-2 border-black rounded-3xl p-6 mb-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-xs font-black uppercase tracking-widest text-black mb-1 flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4 text-black" />
                        ¿Cuál es tu predicción?
                    </p>
                    <p className="text-[11px] text-stone-500 mb-4">
                        Vota por tu intuición antes de la revelación:
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <button
                            type="button"
                            onClick={() => handleVote('boy')}
                            className={`py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-2 ${
                                userVote === 'boy'
                                    ? 'bg-black text-white border-black scale-[1.02] shadow-md'
                                    : 'bg-white text-black border-black hover:bg-stone-100 active:scale-95'
                            }`}
                        >
                            <span>🤍</span> Team Niño
                        </button>

                        <button
                            type="button"
                            onClick={() => handleVote('girl')}
                            className={`py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-2 ${
                                userVote === 'girl'
                                    ? 'bg-black text-white border-black scale-[1.02] shadow-md'
                                    : 'bg-white text-black border-black hover:bg-stone-100 active:scale-95'
                            }`}
                        >
                            <span>🖤</span> Team Niña
                        </button>
                    </div>

                    {/* Voting Results Bar */}
                    <div className="space-y-1.5">
                        <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden flex border border-stone-300">
                            <div 
                                className="h-full bg-stone-400 transition-all duration-700 ease-out" 
                                style={{ width: `${boyPercent}%` }}
                                title={`Team Niño: ${boyPercent}%`}
                            />
                            <div 
                                className="h-full bg-black transition-all duration-700 ease-out" 
                                style={{ width: `${girlPercent}%` }}
                                title={`Team Niña: ${girlPercent}%`}
                            />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-stone-600 px-1">
                            <span>Team Niño: {boyPercent}%</span>
                            <span>Team Niña: {girlPercent}%</span>
                        </div>
                    </div>
                </div>

                {/* Event Key Information Badges */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-stone-800 mb-8">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 border border-stone-200">
                        <Calendar className="h-4 w-4 text-black" />
                        <span>{format(eventDate, "d 'de' MMMM, yyyy", { locale: es })}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 border border-stone-200">
                        <Clock className="h-4 w-4 text-black" />
                        <span>{format(eventDate, 'HH:mm', { locale: es })} hrs</span>
                    </div>
                    {event.venue_name && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 border border-stone-200">
                            <MapPin className="h-4 w-4 text-black" />
                            <span>{event.venue_name}</span>
                        </div>
                    )}
                </div>

                {/* Action CTA to RSVP */}
                <button
                    onClick={() => scrollToSection('rsvp')}
                    className="px-8 py-4 bg-black hover:bg-stone-800 text-white rounded-2xl text-xs uppercase font-black tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                    <Heart className="h-4 w-4 text-white fill-white" />
                    Confirmar mi Asistencia
                </button>
            </div>
        </section>
    );
}
