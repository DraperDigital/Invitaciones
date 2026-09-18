import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Sparkles, Heart, Gift } from 'lucide-react';

interface Props {
    event: any;
    cfg: any;
    countdown: { days: number; hours: number; minutes: number; seconds: number };
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
}

export default function RainbowPopHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection }: Props) {
    const eventDate = new Date(event.date_time);
    const childName = cfg.child_name || cfg.childName || event.title?.replace(/^(cumpleaños|cumple|mi fiesta|fiesta infantil)\s*(de\s*)?/i, '') || 'Lucas';
    const age = cfg.age || cfg.turning_age || 1;

    // Split letters of childName to give each an alternating playful pop color
    const POP_COLORS = ['#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#EF4444'];

    const renderBubblyName = (name: string) => {
        const letters = name.split('');
        return (
            <span className="inline-flex flex-wrap justify-center items-center">
                <span className="text-[#EC4899] mr-0.5">¡</span>
                {letters.map((char, index) => {
                    if (char === ' ') return <span key={index} className="w-3">&nbsp;</span>;
                    const color = POP_COLORS[index % POP_COLORS.length];
                    return (
                        <span 
                            key={index}
                            style={{ 
                                color,
                                textShadow: '2px 3px 0px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06)' 
                            }}
                            className="inline-block transform hover:-translate-y-1 hover:rotate-3 transition-transform duration-200"
                        >
                            {char}
                        </span>
                    );
                })}
                <span className="text-[#3B82F6] ml-0.5">!</span>
            </span>
        );
    };

    return (
        <div className="relative overflow-hidden bg-[#FAFAF9] text-[#1E293B] pt-6 md:pt-12 pb-12 font-sans select-none">
            
            {/* ── Ambient Pastel Rainbow Halos & Floating Confetti ── */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-pink-100/60 via-sky-100/40 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-yellow-200/30 blur-2xl pointer-events-none" />
            <div className="absolute top-32 -right-20 w-80 h-80 rounded-full bg-emerald-200/30 blur-2xl pointer-events-none" />

            {/* Confetti Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-10 left-6 w-3 h-3 rounded-full bg-[#EC4899] opacity-70 animate-bounce" style={{ animationDuration: '3s' }} />
                <div className="absolute top-24 right-10 w-3.5 h-3.5 rounded-full bg-[#06B6D4] opacity-75 animate-pulse" />
                <div className="absolute top-48 left-12 w-2.5 h-2.5 rounded-sm bg-[#F59E0B] rotate-45 opacity-70" />
                <div className="absolute top-64 right-16 w-3 h-3 rounded-full bg-[#10B981] opacity-70 animate-bounce" style={{ animationDuration: '4s' }} />
                <div className="absolute top-36 left-1/3 w-2 h-2 rounded-full bg-[#8B5CF6] opacity-60" />
                <div className="absolute top-16 right-1/4 w-3 h-3 rounded-sm bg-[#EC4899] rotate-12 opacity-60" />
                <div className="absolute top-80 left-20 w-4 h-4 text-yellow-400 opacity-80">★</div>
                <div className="absolute top-72 right-1/3 w-4 h-4 text-pink-400 opacity-80">✦</div>
            </div>

            {/* ── Main Container ── */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ── Main Stage: Responsive 2-Columns on Desktop, Vertical Stack on Mobile ── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* LEFT COLUMN (Desktop 6 cols): Circular Photo, Bubbly Name & Welcome Message */}
                    <div className="md:col-span-6 flex flex-col items-center text-center">
                        
                        {/* ── Circular Rainbow Photo Badge ── */}
                        <div className="relative mb-6">
                            {/* Colorful Multi-layer Outer Rings */}
                            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full p-2 bg-gradient-to-tr from-[#EC4899] via-[#FBBF24] via-[#10B981] to-[#06B6D4] shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                                <div className="w-full h-full rounded-full p-1.5 bg-white flex items-center justify-center overflow-hidden">
                                    {heroImageUrl ? (
                                        <img 
                                            src={heroImageUrl} 
                                            alt={childName} 
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-100 to-sky-100 flex flex-col items-center justify-center p-4">
                                            <Sparkles className="w-12 h-12 text-[#EC4899] mb-2 animate-spin" style={{ animationDuration: '8s' }} />
                                            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">¡Fiesta Divertida!</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Floating decorative mini badges */}
                            <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-md border-2 border-[#FBBF24] text-xl animate-bounce" style={{ animationDuration: '2.5s' }}>
                                🎈
                            </div>
                            <div className="absolute -bottom-2 -left-2 bg-white rounded-full p-2 shadow-md border-2 border-[#06B6D4] text-xl">
                                🎂
                            </div>
                        </div>

                        {/* ── Tagline Pill (e.g. "MI CUMPLEAÑOS" or "MI 1ER AÑITO") ── */}
                        <div className="inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20 mb-3">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                            <span 
                                className="text-xs sm:text-sm font-extrabold uppercase tracking-wider"
                                style={{ fontFamily: '"Fredoka", "Quicksand", sans-serif' }}
                            >
                                {labels?.tagline || `¡Mi ${age === 1 ? '1er' : `${age}°`} Añito!`}
                            </span>
                        </div>

                        {/* ── Giant Bubbly Pop Name: ¡Lucas! ── */}
                        <div className="my-1">
                            <h1 
                                className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight"
                                style={{ fontFamily: '"Fredoka", "Quicksand", sans-serif' }}
                            >
                                {renderBubblyName(childName)}
                            </h1>
                        </div>

                        {/* ── Subtitle / Age Badge ── */}
                        <div className="mt-2 mb-4">
                            <span 
                                className="inline-block px-4 py-1 rounded-full bg-sky-100 border border-sky-300 text-sky-700 font-bold text-xs sm:text-sm uppercase tracking-widest"
                                style={{ fontFamily: '"Fredoka", "Quicksand", sans-serif' }}
                            >
                                Cumplo {age} {age === 1 ? 'Año' : 'Años'}
                            </span>
                        </div>

                        {/* ── Cheerful Speech Bubble Card: ¡Te espero! ── */}
                        <div className="relative w-full max-w-md bg-white rounded-3xl p-5 border-2 border-[#38BDF8]/60 shadow-[0_8px_24px_-6px_rgba(56,189,248,0.2)] mt-2">
                            {/* Cute folded green tag on top-left (distinctive motif from reference) */}
                            <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-md bg-[#84CC16] text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                                <span>🎉</span>
                                <span>¡INVITACIÓN!</span>
                            </div>

                            <p 
                                className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed mt-1"
                                style={{ fontFamily: '"Quicksand", sans-serif' }}
                            >
                                {cfg.message || '¡Te espero para celebrar juntos mi cumpleaños! Habrá juegos, pastel, muchas risas y sorpresas increíbles.'}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (Desktop 6 cols): Date Card, Countdown, Calendar Button & RSVP ── */}
                    <div className="md:col-span-6 flex flex-col items-center space-y-5">
                        
                        {/* ── Clean White Date Card (Style from reference) ── */}
                        <div className="relative w-full max-w-md bg-white rounded-3xl p-6 border-2 border-[#38BDF8]/60 shadow-[0_10px_25px_-5px_rgba(56,189,248,0.2)]">
                            
                            {/* Cyan Top Pill Header */}
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 rounded-full bg-[#06B6D4] text-white text-xs font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span style={{ fontFamily: '"Fredoka", sans-serif' }}>¿CUÁNDO Y DÓNDE?</span>
                            </div>

                            {/* Date Layout: Big Day Box + Month & Day Name */}
                            <div className="flex items-center justify-center gap-4 mt-3 mb-4">
                                {/* Big Green Day Number Box */}
                                <div className="bg-[#ECFDF5] border-2 border-[#10B981] rounded-2xl px-5 py-2.5 text-center shadow-sm">
                                    <span 
                                        className="block text-4xl sm:text-5xl font-black text-[#10B981] leading-none"
                                        style={{ fontFamily: '"Fredoka", sans-serif' }}
                                    >
                                        {format(eventDate, 'd', { locale: es })}
                                    </span>
                                    <span className="text-[11px] font-bold text-[#047857] uppercase tracking-wider">
                                        {format(eventDate, 'EEEE', { locale: es })}
                                    </span>
                                </div>

                                {/* Month & Time Badge */}
                                <div className="space-y-1.5 text-left">
                                    <p 
                                        className="text-2xl sm:text-3xl font-extrabold text-[#EC4899] uppercase leading-none"
                                        style={{ fontFamily: '"Fredoka", sans-serif' }}
                                    >
                                        {format(eventDate, 'MMMM', { locale: es })}
                                    </p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {format(eventDate, 'yyyy', { locale: es })}
                                    </p>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                                        <span>{format(eventDate, 'h:mm a', { locale: es })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Venue Details */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                                <MapPin className="w-4 h-4 text-[#06B6D4] flex-shrink-0" />
                                <span className="truncate">{event.venue_name || 'Salón de Eventos Infantiles'}</span>
                            </div>
                        </div>

                        {/* ── Bubbly Countdown Timer ── */}
                        {(countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0) && (
                            <div className="w-full max-w-md bg-gradient-to-r from-pink-50 via-purple-50 to-sky-50 rounded-3xl p-5 border-2 border-pink-200 shadow-sm text-center">
                                <p 
                                    className="text-xs font-extrabold uppercase tracking-wider text-[#EC4899] mb-3"
                                    style={{ fontFamily: '"Fredoka", sans-serif' }}
                                >
                                    ¡FALTAN SOLO!
                                </p>
                                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                                    {[
                                        { val: countdown.days, label: 'DÍAS', color: '#EC4899', bg: '#FDF2F8' },
                                        { val: countdown.hours, label: 'HORAS', color: '#3B82F6', bg: '#EFF6FF' },
                                        { val: countdown.minutes, label: 'MIN', color: '#10B981', bg: '#ECFDF5' },
                                        { val: countdown.seconds, label: 'SEG', color: '#F59E0B', bg: '#FFFBEB' }
                                    ].map((item) => (
                                        <div 
                                            key={item.label} 
                                            className="rounded-2xl py-2 px-1 border shadow-sm"
                                            style={{ backgroundColor: item.bg, borderColor: `${item.color}40` }}
                                        >
                                            <p 
                                                className="text-2xl sm:text-3xl font-black leading-tight"
                                                style={{ color: item.color, fontFamily: '"Fredoka", sans-serif' }}
                                            >
                                                {String(item.val).padStart(2, '0')}
                                            </p>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Main Action Buttons ── */}
                        <div className="w-full max-w-md space-y-3">
                            <button
                                onClick={() => scrollToSection('rsvp')}
                                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#EC4899] via-[#F43F5E] to-[#E11D48] hover:opacity-95 text-white font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-pink-500/30 transform active:scale-98 transition-all flex items-center justify-center gap-2 border-2 border-white"
                                style={{ fontFamily: '"Fredoka", sans-serif' }}
                            >
                                <span>CONFIRMAR ASISTENCIA</span>
                                <Heart className="w-4 h-4 fill-white" />
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => scrollToSection('location')}
                                    className="w-full py-3 px-4 rounded-full bg-[#06B6D4] hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                                    style={{ fontFamily: '"Fredoka", sans-serif' }}
                                >
                                    <MapPin className="w-4 h-4" />
                                    <span>UBICACIÓN</span>
                                </button>

                                <button
                                    onClick={() => scrollToSection('gifts')}
                                    className="w-full py-3 px-4 rounded-full bg-white hover:bg-slate-50 text-[#8B5CF6] border-2 border-[#8B5CF6] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
                                    style={{ fontFamily: '"Fredoka", sans-serif' }}
                                >
                                    <Gift className="w-4 h-4" />
                                    <span>REGALOS</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
