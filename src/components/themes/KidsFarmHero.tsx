import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Sparkles, Edit2 } from 'lucide-react';

interface Props {
    event: any;
    cfg: any;
    countdown: { days: number; hours: number; minutes: number; seconds: number };
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
    onEditHero?: () => void;
}

export default function KidsFarmHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const eventDate = new Date(event.date_time);
    const childName = cfg.child_name || cfg.childName || event.title?.replace(/^(cumpleaños|cumple|mi cumpleaños)\s*(de\s*)?/i, '') || 'El Festejado';
    const age = cfg.age || cfg.turning_age || 5;

    // Wooden fence SVG pattern component
    const WoodenFence = ({ className = "" }: { className?: string }) => (
        <svg className={`w-full h-12 md:h-16 text-[#B45309] ${className}`} viewBox="0 0 1200 64" fill="none" preserveAspectRatio="none">
            {/* Horizontal rails */}
            <rect x="0" y="20" width="1200" height="8" rx="2" fill="#D97706" />
            <rect x="0" y="42" width="1200" height="8" rx="2" fill="#B45309" />
            {/* Vertical picket fence posts */}
            {Array.from({ length: 28 }).map((_, i) => {
                const x = i * 44 + 8;
                return (
                    <g key={i}>
                        <path
                            d={`M${x} 64 V12 L${x + 12} 0 L${x + 24} 12 V64 Z`}
                            fill="#F59E0B"
                            stroke="#B45309"
                            strokeWidth="2"
                        />
                        {/* Nail heads */}
                        <circle cx={x + 12} cy="24" r="2" fill="#78350F" />
                        <circle cx={x + 12} cy="46" r="2" fill="#78350F" />
                    </g>
                );
            })}
        </svg>
    );

    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-[#7DD3FC] via-[#BAE6FD] to-[#E0F2FE] pt-6 md:pt-12 pb-0 font-sans">
            {/* ── Floating Cartoon Clouds ── */}
            <div className="absolute top-4 left-6 animate-pulse opacity-90 pointer-events-none">
                <svg className="w-20 md:w-32 h-12 text-white fill-current drop-shadow-sm" viewBox="0 0 100 50">
                    <circle cx="30" cy="30" r="18" />
                    <circle cx="50" cy="22" r="22" />
                    <circle cx="70" cy="30" r="18" />
                    <rect x="25" y="30" width="50" height="16" rx="8" />
                </svg>
            </div>
            <div className="absolute top-8 right-10 opacity-90 hidden sm:block pointer-events-none">
                <svg className="w-24 md:w-36 h-14 text-white fill-current drop-shadow-sm" viewBox="0 0 100 50">
                    <circle cx="30" cy="30" r="18" />
                    <circle cx="50" cy="22" r="22" />
                    <circle cx="70" cy="30" r="18" />
                    <rect x="25" y="30" width="50" height="16" rx="8" />
                </svg>
            </div>
            <div className="absolute top-20 right-1/4 opacity-75 pointer-events-none">
                <svg className="w-16 md:w-24 h-10 text-white/80 fill-current" viewBox="0 0 100 50">
                    <circle cx="30" cy="30" r="18" />
                    <circle cx="50" cy="22" r="22" />
                    <circle cx="70" cy="30" r="18" />
                    <rect x="25" y="30" width="50" height="16" rx="8" />
                </svg>
            </div>

            {/* Glowing cartoon sun */}
            <div className="absolute -top-6 -right-6 md:top-2 md:right-8 w-24 h-24 md:w-32 md:h-32 bg-amber-300 rounded-full blur-sm opacity-90 pointer-events-none flex items-center justify-center animate-spin-slow">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-amber-400 rounded-full shadow-lg" />
            </div>

            {/* ── Main Container: Mobile Stack & Desktop 2-Column Grid ── */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Titles: Cartoon Arch & Ribbon */}
                <div className="text-center space-y-3 mb-6 md:mb-10">
                    {/* Bubbly Cartoon Title */}
                    <div className="inline-block transform hover:scale-105 transition-transform duration-300">
                        <span 
                            className="block text-2xl sm:text-4xl md:text-5xl font-black tracking-wide text-[#EA580C] uppercase"
                            style={{
                                fontFamily: '"Fredoka", "Quicksand", "Comic Sans MS", sans-serif',
                                textShadow: '2px 2px 0 #FFF, -2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF, 0 4px 10px rgba(0,0,0,0.15)'
                            }}
                        >
                            {labels?.tagline || 'Mi Cumpleaños'}
                        </span>
                    </div>

                    {/* Festive 3D Red Ribbon for Name */}
                    <div className="relative inline-flex items-center justify-center my-2">
                        {/* Ribbon left tail */}
                        <div className="w-4 sm:w-6 h-10 sm:h-12 bg-[#991B1B] -mr-2 transform -skew-y-12" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 40% 50%)' }} />
                        {/* Ribbon center body */}
                        <div className="bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#DC2626] px-8 sm:px-14 py-2 sm:py-3 rounded-md shadow-xl border-y-2 border-amber-300 relative z-10">
                            <h1 
                                className="text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-widest drop-shadow-md"
                                style={{ fontFamily: '"Fredoka", "Quicksand", sans-serif' }}
                            >
                                {childName}
                            </h1>
                        </div>
                        {/* Ribbon right tail */}
                        <div className="w-4 sm:w-6 h-10 sm:h-12 bg-[#991B1B] -ml-2 transform skew-y-12" style={{ clipPath: 'polygon(0 0, 100% 0, 60% 50%, 100% 100%, 0 100%)' }} />
                    </div>

                    {/* Age Badge */}
                    <div className="flex justify-center items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-400 text-amber-950 font-black text-xs sm:text-sm rounded-full shadow-md uppercase tracking-wider border-2 border-white">
                            <Sparkles className="w-4 h-4 text-amber-950" />
                            ¡Festejando mis {age} años!
                        </span>
                    </div>
                </div>

                {/* ── Responsive Stage: Side-by-Side on Desktop, Stack on Mobile ── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center pb-6">
                    {/* LEFT (Desktop: 7 cols): The Farm Barn & Animals Scene */}
                    <div className="md:col-span-7 flex flex-col items-center">
                        <div className="relative w-full max-w-md md:max-w-none bg-gradient-to-b from-[#6EE7B7]/30 to-[#22C55E]/40 rounded-3xl p-4 sm:p-6 border-4 border-white shadow-xl backdrop-blur-sm">
                            {/* Date & Time Pills on Grass */}
                            <div className="flex flex-wrap justify-center items-center gap-2.5 mb-4">
                                <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/95 rounded-full shadow-md border border-amber-200 text-[#B45309] font-black text-xs sm:text-sm">
                                    <Calendar className="w-4 h-4 text-amber-500" />
                                    <span>{format(eventDate, "d 'de' MMMM", { locale: es })}</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0284C7] text-white rounded-full shadow-md font-black text-xs sm:text-sm">
                                    <Clock className="w-4 h-4 text-sky-200" />
                                    <span>{format(eventDate, 'h:mm a', { locale: es })}</span>
                                </div>
                            </div>

                            {/* Barn & Animals Cartoon Graphic Container */}
                            <div className="relative w-full h-56 sm:h-64 flex items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-sky-100 via-sky-50 to-[#86EFAC]/50 border-2 border-emerald-200">
                                {/* Red Barn Illustration (SVG) */}
                                <svg className="absolute bottom-10 right-4 sm:right-8 w-36 sm:w-44 h-36 sm:h-44 drop-shadow-lg" viewBox="0 0 160 160">
                                    {/* Barn Roof */}
                                    <polygon points="80,10 10,65 150,65" fill="#DC2626" stroke="#991B1B" strokeWidth="4" />
                                    <polygon points="80,18 25,62 135,62" fill="#EF4444" />
                                    <polygon points="80,22 80,62" stroke="#FFF" strokeWidth="3" />
                                    {/* Barn Body */}
                                    <rect x="20" y="65" width="120" height="85" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="4" />
                                    {/* Barn Trim White Beams */}
                                    <line x1="20" y1="65" x2="140" y2="150" stroke="#FFF" strokeWidth="4" />
                                    <line x1="140" y1="65" x2="20" y2="150" stroke="#FFF" strokeWidth="4" />
                                    <rect x="20" y="65" width="120" height="85" fill="none" stroke="#FFF" strokeWidth="4" />
                                    {/* Barn Door */}
                                    <rect x="60" y="95" width="40" height="55" rx="3" fill="#7F1D1D" stroke="#FFF" strokeWidth="3" />
                                    <line x1="60" y1="95" x2="100" y2="150" stroke="#FFF" strokeWidth="2" />
                                    <line x1="100" y1="95" x2="60" y2="150" stroke="#FFF" strokeWidth="2" />
                                    {/* Loft Window */}
                                    <rect x="70" y="42" width="20" height="18" rx="2" fill="#FEF08A" stroke="#FFF" strokeWidth="2" />
                                </svg>

                                {/* Cute Apple Tree */}
                                <div className="absolute bottom-12 left-3 sm:left-6 flex flex-col items-center">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500 rounded-full shadow-md relative border-2 border-emerald-600">
                                        <div className="w-3 h-3 bg-red-500 rounded-full absolute top-2 left-4 shadow-sm" />
                                        <div className="w-3 h-3 bg-red-500 rounded-full absolute top-5 right-3 shadow-sm" />
                                        <div className="w-3 h-3 bg-red-500 rounded-full absolute bottom-3 left-6 shadow-sm" />
                                    </div>
                                    <div className="w-4 h-8 bg-amber-800 rounded-sm -mt-1" />
                                </div>

                                {/* Animals Group in foreground */}
                                <div className="relative z-10 w-full flex items-end justify-around px-2 sm:px-6 pb-2">
                                    {/* Friendly Horse */}
                                    <div className="text-center group cursor-pointer transform hover:scale-110 transition-transform">
                                        <span className="text-4xl sm:text-5xl drop-shadow-md block">🐴</span>
                                        <span className="text-[10px] font-black uppercase text-stone-700 bg-white/90 px-2 py-0.5 rounded-full shadow-xs">Caballito</span>
                                    </div>
                                    {/* Fluffy Sheep */}
                                    <div className="text-center group cursor-pointer transform hover:scale-110 transition-transform">
                                        <span className="text-4xl sm:text-5xl drop-shadow-md block">🐑</span>
                                        <span className="text-[10px] font-black uppercase text-stone-700 bg-white/90 px-2 py-0.5 rounded-full shadow-xs">Ovejita</span>
                                    </div>
                                    {/* Hen and Chicks */}
                                    <div className="text-center group cursor-pointer transform hover:scale-110 transition-transform">
                                        <div className="flex items-center justify-center gap-0.5">
                                            <span className="text-3xl sm:text-4xl drop-shadow-md">🐔</span>
                                            <span className="text-xl sm:text-2xl drop-shadow-sm">🐥</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-stone-700 bg-white/90 px-2 py-0.5 rounded-full shadow-xs">Gallinita</span>
                                    </div>
                                </div>

                                {/* Rolling green grass foreground */}
                                <div className="absolute -bottom-6 left-0 right-0 h-14 bg-[#22C55E] rounded-t-[50%] border-t-4 border-[#16A34A]" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT (Desktop: 5 cols): The Birthday Kid Polaroid & CTA */}
                    <div className="md:col-span-5 flex flex-col items-center space-y-5">
                        {/* Polaroid Photo Frame */}
                        <div 
                            onClick={onEditHero}
                            className={`relative w-64 sm:w-72 bg-white p-3 sm:p-4 rounded-2xl shadow-2xl border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-300 group/farmphoto ${
                                onEditHero ? 'cursor-pointer' : ''
                            }`}
                            title={onEditHero ? "Haz clic para cambiar foto del festejado" : undefined}
                        >
                            {/* Confetti decoration on polaroid */}
                            <div className="absolute -top-3 -left-3 text-xl select-none">🎉</div>
                            <div className="absolute -bottom-3 -right-3 text-xl select-none">⭐</div>
                            <div className="absolute top-2 right-2 text-sm select-none">🎈</div>

                            <div className="aspect-[4/4] rounded-xl overflow-hidden bg-slate-100 relative shadow-inner border border-slate-200">
                                {heroImageUrl ? (
                                    <img 
                                        src={heroImageUrl} 
                                        alt={childName} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-tr from-amber-100 to-rose-100">
                                        <span className="text-5xl mb-2">🤠</span>
                                        <p className="text-xs font-bold text-amber-900">¡Foto del Festejado!</p>
                                    </div>
                                )}
                                {onEditHero && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/farmphoto:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 z-20">
                                        <Edit2 className="h-4 w-4" />
                                        <span>Cambiar Foto</span>
                                    </div>
                                )}
                            </div>

                            {/* Polaroid caption */}
                            <div className="pt-3 pb-1 text-center">
                                <p 
                                    className="text-base sm:text-lg font-black text-stone-800"
                                    style={{ fontFamily: '"Fredoka", "Quicksand", sans-serif' }}
                                >
                                    ¡Ven a festejar conmigo!
                                </p>
                            </div>
                        </div>

                        {/* Interactive Countdown Blocks (Días, Horas, Minutos) */}
                        {(countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0) && (
                            <div className="w-full max-w-xs bg-white/90 backdrop-blur-md rounded-2xl p-3 border-2 border-amber-300 shadow-lg">
                                <p className="text-[10px] font-black uppercase tracking-widest text-center text-amber-900 mb-2">
                                    Falta muy poquito para la fiesta:
                                </p>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-[#FEF3C7] rounded-xl p-2 border border-amber-300/60 shadow-xs">
                                        <p className="text-2xl font-black text-[#B45309]">{countdown.days}</p>
                                        <p className="text-[9px] font-bold uppercase text-amber-800">Días</p>
                                    </div>
                                    <div className="bg-[#BAE6FD] rounded-xl p-2 border border-sky-300/60 shadow-xs">
                                        <p className="text-2xl font-black text-[#0369A1]">{countdown.hours}</p>
                                        <p className="text-[9px] font-bold uppercase text-sky-800">Horas</p>
                                    </div>
                                    <div className="bg-[#BBF7D0] rounded-xl p-2 border border-emerald-300/60 shadow-xs">
                                        <p className="text-2xl font-black text-[#15803D]">{countdown.minutes}</p>
                                        <p className="text-[9px] font-bold uppercase text-emerald-800">Minutos</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick Action Button */}
                        <div className="w-full max-w-xs flex flex-col gap-2">
                            <button
                                onClick={() => scrollToSection('rsvp')}
                                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#DC2626] to-[#EF4444] hover:from-[#B91C1C] hover:to-[#DC2626] text-white font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transform active:scale-95 transition-all flex items-center justify-center gap-2 border-2 border-white"
                            >
                                <span>Confirmar Asistencia</span>
                                <span>🎈</span>
                            </button>
                            <button
                                onClick={() => scrollToSection('location')}
                                className="w-full py-2.5 px-6 rounded-full bg-white hover:bg-amber-50 text-[#B45309] border-2 border-[#F59E0B] font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
                            >
                                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                                <span>Ver Salón y Ubicación</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Wooden Fence Divider (Connects to Next Section) ── */}
            <div className="relative w-full -mb-1 mt-4">
                <WoodenFence />
            </div>
        </div>
    );
}
