import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Sparkles, Heart, MapPin, Calendar, Clock, Edit2 } from 'lucide-react';
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

export default function RevealDuoHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const eventDate = new Date(event.date_time);
    const heroBg = cfg.heroBgColor || cfg.hero_bg_color || '#FAFAFA';

    // Interactive prediction poll (stored in state / localStorage)
    const [userVote, setUserVote] = useState<'boy' | 'girl' | null>(() => {
        try {
            return localStorage.getItem(`reveal_duo_vote_${event.id || 'demo'}`) as 'boy' | 'girl' | null;
        } catch {
            return null;
        }
    });

    const [voteCounts, setVoteCounts] = useState({ boy: 50, girl: 50 });

    const handleVote = (choice: 'boy' | 'girl') => {
        if (userVote) return;
        setUserVote(choice);
        try {
            localStorage.setItem(`reveal_duo_vote_${event.id || 'demo'}`, choice);
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
            className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-24 select-none overflow-hidden font-sans"
            style={{ backgroundColor: heroBg }}
        >
            {/* Ambient Dual-Tone Clouds: Sky Blue on the Left, Blush Pink on the Right */}
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-sky-100/30 via-transparent to-pink-100/30 blur-2xl pointer-events-none" />

            {/* Floating Dual Question Marks & Confetti */}
            <div className="absolute top-16 left-8 sm:left-20 text-sky-300/60 text-6xl sm:text-8xl font-black select-none pointer-events-none animate-bounce" style={{ animationDuration: '3.5s' }}>
                ?
            </div>
            <div className="absolute bottom-20 right-8 sm:right-24 text-pink-300/60 text-6xl sm:text-8xl font-black select-none pointer-events-none animate-bounce" style={{ animationDuration: '4s' }}>
                ?
            </div>
            <div className="absolute top-28 right-12 text-pink-400 text-xl select-none pointer-events-none animate-pulse">
                ✦
            </div>
            <div className="absolute bottom-32 left-12 text-sky-400 text-xl select-none pointer-events-none animate-pulse">
                ✦
            </div>

            <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
                
                {/* Team Badges Row */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-600 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm">
                        💙 Team Niño
                    </span>
                    <span className="text-stone-300 font-bold text-xs">VS</span>
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm">
                        💖 Team Niña
                    </span>
                </div>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm uppercase font-bold tracking-[0.3em] text-stone-500 mb-3">
                    {cfg.subtitle || labels.tagline || '¿Azul o Rosa? Acompáñanos a descubrirlo'}
                </p>

                {/* Dual Color Headline */}
                <h1 className="text-4xl sm:text-7xl md:text-8xl font-display font-extrabold tracking-tight leading-[1.05] mb-6 break-normal uppercase">
                    <span className="text-sky-600">¿Niño</span>{' '}
                    <span className="text-stone-400 font-light">o</span>{' '}
                    <span className="text-pink-500">Niña?</span>
                </h1>

                {/* Optional Hero Image with Dual-tone Blue & Pink border */}
                {heroImageUrl && (
                    <div className="relative my-6 group/duophoto">
                        <div 
                            onClick={onEditHero}
                            className={`w-44 h-44 sm:w-56 sm:h-56 rounded-full p-2 bg-gradient-to-tr from-sky-400 via-purple-300 to-pink-400 shadow-xl flex items-center justify-center transform hover:scale-105 transition-all duration-300 ${
                                onEditHero ? 'cursor-pointer' : ''
                            }`}
                            title={onEditHero ? 'Haz clic para cambiar foto' : undefined}
                        >
                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white relative">
                                <img
                                    src={heroImageUrl}
                                    alt="Gender Reveal"
                                    className="w-full h-full object-cover"
                                    style={getHeroImageStyle(cfg)}
                                />
                                {onEditHero && (
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/duophoto:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1">
                                        <Edit2 className="h-5 w-5" />
                                        <span>Editar Foto</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-stone-200 px-3.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-stone-700 shadow-sm flex items-center gap-1">
                            <span className="text-sky-500">👦</span> & <span className="text-pink-500">👧</span>
                        </span>
                    </div>
                )}

                {/* Dedication Message */}
                <p className="max-w-xl mx-auto text-sm sm:text-base text-stone-600 font-normal leading-relaxed mb-10 px-4">
                    {cfg.welcomeMessage || '¿Será él o será ella? Lo que sea, llegará a un hogar lleno de amor. ¡Ven listo con tus mejores predicciones para vivir la gran revelación!'}
                </p>

                {/* Alternating Dual Countdown Cards */}
                {(cfg.showCountdown !== false) && (
                    <div className="w-full max-w-lg mb-12">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Clock className="h-3.5 w-3.5 text-stone-700" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-stone-700">
                                La revelación comienza en:
                            </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 sm:gap-4">
                            {[
                                { label: 'Días', value: countdown.days, bg: 'bg-sky-50 border-sky-200 text-sky-800' },
                                { label: 'Horas', value: countdown.hours, bg: 'bg-pink-50 border-pink-200 text-pink-800' },
                                { label: 'Min', value: countdown.minutes, bg: 'bg-sky-50 border-sky-200 text-sky-800' },
                                { label: 'Seg', value: countdown.seconds, bg: 'bg-pink-50 border-pink-200 text-pink-800' },
                            ].map((item) => (
                                <div 
                                    key={item.label}
                                    className={`${item.bg} p-3 sm:p-5 rounded-2xl border shadow-sm flex flex-col items-center justify-center`}
                                >
                                    <span className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight">
                                        {item.value.toString().padStart(2, '0')}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider opacity-75 mt-1">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Interactive Prediction Voting Poll: Blue vs Pink */}
                <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-6 mb-12 shadow-xl shadow-stone-200/50">
                    <p className="text-xs font-black uppercase tracking-widest text-stone-800 mb-1 flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        ¿Qué crees que será?
                    </p>
                    <p className="text-[11px] text-stone-500 mb-4">
                        ¡Elige tu bando antes del conteo regresivo!
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <button
                            type="button"
                            onClick={() => handleVote('boy')}
                            className={`py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-2 ${
                                userVote === 'boy'
                                    ? 'bg-sky-600 text-white border-sky-600 scale-[1.02] shadow-md shadow-sky-500/20'
                                    : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 active:scale-95'
                            }`}
                        >
                            <span>💙</span> Team Niño
                        </button>

                        <button
                            type="button"
                            onClick={() => handleVote('girl')}
                            className={`py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-2 ${
                                userVote === 'girl'
                                    ? 'bg-pink-500 text-white border-pink-500 scale-[1.02] shadow-md shadow-pink-500/20'
                                    : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 active:scale-95'
                            }`}
                        >
                            <span>💖</span> Team Niña
                        </button>
                    </div>

                    {/* Dual Color Result Progress Bar */}
                    <div className="space-y-1.5">
                        <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden flex border border-stone-200">
                            <div 
                                className="h-full bg-sky-500 transition-all duration-700 ease-out" 
                                style={{ width: `${boyPercent}%` }}
                                title={`Team Niño: ${boyPercent}%`}
                            />
                            <div 
                                className="h-full bg-pink-500 transition-all duration-700 ease-out" 
                                style={{ width: `${girlPercent}%` }}
                                title={`Team Niña: ${girlPercent}%`}
                            />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold px-1">
                            <span className="text-sky-600 font-extrabold">Team Niño: {boyPercent}%</span>
                            <span className="text-pink-600 font-extrabold">Team Niña: {girlPercent}%</span>
                        </div>
                    </div>
                </div>

                {/* Event Logistics and Dress Code Fun Tip */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-stone-800 mb-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 shadow-sm">
                        <Calendar className="h-4 w-4 text-sky-600" />
                        <span>{format(eventDate, "d 'de' MMMM, yyyy", { locale: es })}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 shadow-sm">
                        <Clock className="h-4 w-4 text-pink-500" />
                        <span>{format(eventDate, 'HH:mm', { locale: es })} hrs</span>
                    </div>
                    {event.venue_name && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 shadow-sm">
                            <MapPin className="h-4 w-4 text-purple-500" />
                            <span>{event.venue_name}</span>
                        </div>
                    )}
                </div>

                <div className="mb-8 px-4 py-2 rounded-full bg-gradient-to-r from-sky-50 via-purple-50 to-pink-50 border border-purple-100 text-[11px] font-semibold text-stone-700">
                    💡 <strong>Dress code sugerido:</strong> Ven vestido de azul si crees que es niño o de rosa si crees que es niña.
                </div>

                {/* Action CTA */}
                <button
                    onClick={() => scrollToSection('rsvp')}
                    className="px-8 py-4 bg-gradient-to-r from-sky-600 via-purple-600 to-pink-500 text-white rounded-2xl text-xs uppercase font-black tracking-[0.2em] shadow-xl shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                    <Heart className="h-4 w-4 text-white fill-white" />
                    Confirmar Asistencia
                </button>
            </div>
        </section>
    );
}
