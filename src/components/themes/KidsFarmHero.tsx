import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Edit2, Compass } from 'lucide-react';
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

export default function KidsFarmHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const eventDate = new Date(event.date_time);
    const childName = cfg.child_name || cfg.childName || event.title?.replace(/^(cumpleaños|cumple|mi cumpleaños)\s*(de\s*)?/i, '') || 'El Festejado';
    const age = cfg.age || cfg.turning_age || 5;

    // Safari / Zoo wooden timber & rope divider
    const SafariDivider = ({ className = "" }: { className?: string }) => (
        <svg className={`w-full h-12 md:h-16 text-[#78350F] ${className}`} viewBox="0 0 1200 64" fill="none" preserveAspectRatio="none">
            {/* Top horizontal rope line */}
            <path d="M0 24 Q300 28 600 24 T1200 24" stroke="#D97706" strokeWidth="6" strokeDasharray="8 4" />
            {/* Bottom timber rail */}
            <rect x="0" y="38" width="1200" height="12" rx="4" fill="#92400E" />
            <rect x="0" y="40" width="1200" height="4" fill="#B45309" />
            {/* Wooden posts with rope wraps and leaf accents */}
            {Array.from({ length: 24 }).map((_, i) => {
                const x = i * 50 + 12;
                return (
                    <g key={i}>
                        {/* Rounded wood post */}
                        <rect x={x} y="8" width="16" height="56" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="2" />
                        <rect x={x + 3} y="12" width="4" height="48" rx="2" fill="#D97706" opacity="0.6" />
                        {/* Rope ties */}
                        <line x1={x - 2} y1="24" x2={x + 18} y2="24" stroke="#FDE68A" strokeWidth="3" />
                        <line x1={x - 2} y1="44" x2={x + 18} y2="44" stroke="#FDE68A" strokeWidth="3" />
                        {/* Small decorative leaf on every 3rd post */}
                        {i % 3 === 0 && (
                            <path
                                d={`M${x + 8} 8 Q${x + 20} -4 ${x + 22} 6 Q${x + 14} 12 ${x + 8} 8 Z`}
                                fill="#22C55E"
                                stroke="#15803D"
                                strokeWidth="1"
                            />
                        )}
                    </g>
                );
            })}
        </svg>
    );

    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-[#86EFAC]/30 via-[#FEF08A]/25 to-[#F0FDF4] pt-6 md:pt-12 pb-0 font-sans">
            {/* ── Jungle & Safari Ambient Elements ── */}
            {/* Tropical vine leaves hanging from top left */}
            <div className="absolute top-0 left-0 pointer-events-none select-none z-0 opacity-80">
                <svg className="w-28 sm:w-44 h-24 sm:h-36 text-emerald-600" viewBox="0 0 160 120" fill="currentColor">
                    <path d="M0 0 C40 10 70 35 85 70 C70 65 50 55 40 40 C30 55 15 65 0 75 Z" opacity="0.85" />
                    <path d="M20 0 C60 15 100 45 120 90 C100 80 80 70 65 50 Z" opacity="0.7" />
                    <path d="M0 20 C30 35 60 65 70 110 C55 95 35 85 20 70 Z" opacity="0.9" />
                </svg>
            </div>
            {/* Tropical vine leaves hanging from top right */}
            <div className="absolute top-0 right-0 pointer-events-none select-none z-0 opacity-80 transform -scale-x-100">
                <svg className="w-28 sm:w-44 h-24 sm:h-36 text-emerald-600" viewBox="0 0 160 120" fill="currentColor">
                    <path d="M0 0 C40 10 70 35 85 70 C70 65 50 55 40 40 C30 55 15 65 0 75 Z" opacity="0.85" />
                    <path d="M20 0 C60 15 100 45 120 90 C100 80 80 70 65 50 Z" opacity="0.7" />
                </svg>
            </div>

            {/* Floating Safari Clouds */}
            <div className="absolute top-6 left-1/4 animate-pulse opacity-70 pointer-events-none">
                <svg className="w-20 md:w-28 h-10 text-white fill-current drop-shadow-xs" viewBox="0 0 100 50">
                    <circle cx="30" cy="30" r="18" />
                    <circle cx="50" cy="22" r="22" />
                    <circle cx="70" cy="30" r="18" />
                    <rect x="25" y="30" width="50" height="16" rx="8" />
                </svg>
            </div>

            {/* Glowing Safari Golden Sun */}
            <div className="absolute -top-6 right-8 md:top-2 md:right-16 w-24 h-24 md:w-32 md:h-32 bg-amber-300 rounded-full blur-xs opacity-90 pointer-events-none flex items-center justify-center">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full shadow-lg flex items-center justify-center">
                    <span className="text-xl md:text-2xl select-none">☀️</span>
                </div>
            </div>

            {/* ── Main Container: Mobile Stack & Desktop 2-Column Grid ── */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Titles: Safari Theme */}
                <div className="text-center space-y-3 mb-6 md:mb-10">
                    {/* Bubbly Tagline with Safari Compass */}
                    <div className="inline-flex items-center gap-2 transform hover:scale-105 transition-transform duration-300">
                        <span className="text-xl sm:text-2xl select-none">🦁</span>
                        <span 
                            className="block text-xl sm:text-3xl md:text-4xl font-black tracking-wide text-[#15803D] uppercase"
                            style={{
                                fontFamily: '"Fredoka", "Quicksand", "Comic Sans MS", sans-serif',
                                textShadow: '2px 2px 0 #FFF, -2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF, 0 4px 10px rgba(21,128,61,0.2)'
                            }}
                        >
                            {labels?.tagline || '¡Aventura en el Zoológico!'}
                        </span>
                        <span className="text-xl sm:text-2xl select-none">🦒</span>
                    </div>

                    {/* Festive Safari Wooden / Explorer Ribbon for Name */}
                    <div className="relative inline-flex items-center justify-center my-2">
                        {/* Ribbon left tail */}
                        <div className="w-4 sm:w-6 h-10 sm:h-12 bg-[#B45309] -mr-2 transform -skew-y-12" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 40% 50%)' }} />
                        {/* Ribbon center body */}
                        <div className="bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#D97706] px-8 sm:px-14 py-2 sm:py-3 rounded-md shadow-xl border-y-2 border-yellow-300 relative z-10">
                            <h1 
                                className="text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-widest drop-shadow-md"
                                style={{ fontFamily: '"Fredoka", "Quicksand", sans-serif' }}
                            >
                                {childName}
                            </h1>
                        </div>
                        {/* Ribbon right tail */}
                        <div className="w-4 sm:w-6 h-10 sm:h-12 bg-[#B45309] -ml-2 transform skew-y-12" style={{ clipPath: 'polygon(0 0, 100% 0, 60% 50%, 100% 100%, 0 100%)' }} />
                    </div>

                    {/* Age Explorer Badge */}
                    <div className="flex justify-center items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#FEF08A] text-[#78350F] font-black text-xs sm:text-sm rounded-full shadow-md uppercase tracking-wider border-2 border-white">
                            <Compass className="w-3.5 h-3.5 text-[#B45309]" />
                            <span>¡Expedición de {age} Años!</span>
                            <span>🐾</span>
                        </span>
                    </div>
                </div>

                {/* ── Responsive Stage: Side-by-Side on Desktop, Stack on Mobile ── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center pb-6">
                    {/* LEFT (Desktop: 7 cols): The Zoo Entrance & Animal Friends Scene */}
                    <div className="md:col-span-7 flex flex-col items-center">
                        <div className="relative w-full max-w-md md:max-w-none bg-gradient-to-b from-[#DCFCE7]/70 via-[#FEF9C3]/50 to-[#BBF7D0]/60 rounded-3xl p-4 sm:p-6 border-4 border-white shadow-xl backdrop-blur-xs">
                            {/* Date & Time Pills */}
                            <div className="flex flex-wrap justify-center items-center gap-2.5 mb-4">
                                <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/95 rounded-full shadow-md border border-amber-200 text-[#B45309] font-black text-xs sm:text-sm">
                                    <Calendar className="w-4 h-4 text-emerald-600" />
                                    <span>{format(eventDate, "d 'de' MMMM", { locale: es })}</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#15803D] text-white rounded-full shadow-md font-black text-xs sm:text-sm">
                                    <Clock className="w-4 h-4 text-emerald-200" />
                                    <span>{format(eventDate, 'h:mm a', { locale: es })}</span>
                                </div>
                            </div>

                            {/* Zoo Safari Gate & Animals Graphic Container */}
                            <div className="relative w-full h-56 sm:h-64 flex items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-sky-100 via-emerald-50 to-[#86EFAC]/60 border-2 border-emerald-300">
                                {/* Tropical Palm Tree Left (SVG) */}
                                <svg className="absolute bottom-6 left-1 sm:left-4 w-28 sm:w-36 h-48 sm:h-56 drop-shadow-sm pointer-events-none" viewBox="0 0 120 180">
                                    {/* Trunk */}
                                    <path d="M55 180 Q62 100 48 45" stroke="#92400E" strokeWidth="12" strokeLinecap="round" fill="none" />
                                    <path d="M55 180 Q62 100 48 45" stroke="#B45309" strokeWidth="6" strokeLinecap="round" fill="none" />
                                    {/* Palm Fronds */}
                                    <path d="M48 45 Q20 20 -5 35" stroke="#15803D" strokeWidth="7" strokeLinecap="round" fill="none" />
                                    <path d="M48 45 Q40 5 15 -5" stroke="#16A34A" strokeWidth="7" strokeLinecap="round" fill="none" />
                                    <path d="M48 45 Q65 10 90 25" stroke="#22C55E" strokeWidth="7" strokeLinecap="round" fill="none" />
                                    <path d="M48 45 Q80 35 110 50" stroke="#15803D" strokeWidth="7" strokeLinecap="round" fill="none" />
                                </svg>

                                {/* Tropical Palm Tree Right (SVG) */}
                                <svg className="absolute bottom-6 right-1 sm:right-4 w-24 sm:w-32 h-44 sm:h-52 drop-shadow-sm pointer-events-none transform -scale-x-100" viewBox="0 0 120 180">
                                    <path d="M55 180 Q62 100 48 45" stroke="#92400E" strokeWidth="11" strokeLinecap="round" fill="none" />
                                    <path d="M48 45 Q20 20 -5 35" stroke="#15803D" strokeWidth="6" strokeLinecap="round" fill="none" />
                                    <path d="M48 45 Q40 5 15 -5" stroke="#16A34A" strokeWidth="6" strokeLinecap="round" fill="none" />
                                    <path d="M48 45 Q65 10 90 25" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" fill="none" />
                                </svg>

                                {/* Wooden Zoo Entrance Arch (SVG) */}
                                <svg className="absolute bottom-8 w-60 sm:w-72 h-44 sm:h-52 drop-shadow-lg" viewBox="0 0 240 180">
                                    {/* Left timber pillar */}
                                    <rect x="30" y="40" width="20" height="140" rx="4" fill="#92400E" stroke="#78350F" strokeWidth="3" />
                                    <rect x="34" y="45" width="5" height="130" rx="2" fill="#B45309" />
                                    {/* Right timber pillar */}
                                    <rect x="190" y="40" width="20" height="140" rx="4" fill="#92400E" stroke="#78350F" strokeWidth="3" />
                                    <rect x="194" y="45" width="5" height="130" rx="2" fill="#B45309" />
                                    {/* Crossbeam top */}
                                    <rect x="15" y="32" width="210" height="22" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="3" />
                                    {/* Hanging Zoo Signboard */}
                                    <rect x="45" y="58" width="150" height="42" rx="6" fill="#FEF3C7" stroke="#92400E" strokeWidth="3" />
                                    {/* Hanging ropes */}
                                    <line x1="65" y1="54" x2="65" y2="58" stroke="#78350F" strokeWidth="3" />
                                    <line x1="175" y1="54" x2="175" y2="58" stroke="#78350F" strokeWidth="3" />
                                    {/* Carved Sign Text */}
                                    <text x="120" y="85" textAnchor="middle" fill="#78350F" fontSize="16" fontWeight="900" fontFamily="'Fredoka', sans-serif" letterSpacing="1.5">
                                        ★ ZOO AVENTURA ★
                                    </text>
                                    {/* Climbing Green Vines on pillars */}
                                    <path d="M28 140 Q40 120 30 100 Q20 80 32 60" stroke="#16A34A" strokeWidth="4" fill="none" />
                                    <circle cx="36" cy="115" r="4" fill="#22C55E" />
                                    <circle cx="26" cy="75" r="4" fill="#22C55E" />
                                    <path d="M208 140 Q198 120 208 100 Q218 80 206 60" stroke="#16A34A" strokeWidth="4" fill="none" />
                                    <circle cx="202" cy="115" r="4" fill="#22C55E" />
                                </svg>

                                {/* Cute Zoo Animals Row */}
                                <div className="relative z-10 w-full flex items-end justify-around px-2 sm:px-6 pb-2">
                                    {/* Lion */}
                                    <div className="text-center group cursor-pointer transform hover:scale-125 transition-transform duration-300">
                                        <span className="text-3xl sm:text-4xl drop-shadow-md block">🦁</span>
                                        <span className="text-[9px] sm:text-[10px] font-black uppercase text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded-full shadow-xs">León</span>
                                    </div>
                                    {/* Giraffe */}
                                    <div className="text-center group cursor-pointer transform hover:scale-125 transition-transform duration-300">
                                        <span className="text-3xl sm:text-4xl drop-shadow-md block">🦒</span>
                                        <span className="text-[9px] sm:text-[10px] font-black uppercase text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded-full shadow-xs">Jirafa</span>
                                    </div>
                                    {/* Elephant */}
                                    <div className="text-center group cursor-pointer transform hover:scale-125 transition-transform duration-300">
                                        <span className="text-3xl sm:text-4xl drop-shadow-md block">🐘</span>
                                        <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-800 bg-slate-100/90 px-1.5 py-0.5 rounded-full shadow-xs">Elefante</span>
                                    </div>
                                    {/* Zebra */}
                                    <div className="text-center group cursor-pointer transform hover:scale-125 transition-transform duration-300">
                                        <span className="text-3xl sm:text-4xl drop-shadow-md block">🦓</span>
                                        <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-800 bg-slate-100/90 px-1.5 py-0.5 rounded-full shadow-xs">Cebra</span>
                                    </div>
                                    {/* Monkey */}
                                    <div className="text-center group cursor-pointer transform hover:scale-125 transition-transform duration-300">
                                        <span className="text-3xl sm:text-4xl drop-shadow-md block">🐒</span>
                                        <span className="text-[9px] sm:text-[10px] font-black uppercase text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded-full shadow-xs">Monito</span>
                                    </div>
                                </div>

                                {/* Rolling savannah grass foreground with paw prints */}
                                <div className="absolute -bottom-6 left-0 right-0 h-14 bg-[#22C55E] rounded-t-[50%] border-t-4 border-[#16A34A] flex items-center justify-around px-8 opacity-95">
                                    <span className="text-xs opacity-40">🐾</span>
                                    <span className="text-xs opacity-40">🐾</span>
                                    <span className="text-xs opacity-40">🐾</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT (Desktop: 5 cols): The Birthday Explorer Photo & CTA */}
                    <div className="md:col-span-5 flex flex-col items-center space-y-5">
                        {/* Explorer Polaroid Photo Frame */}
                        <div 
                            onClick={onEditHero}
                            className={`relative w-64 sm:w-72 bg-white p-3 sm:p-4 rounded-2xl shadow-2xl border-4 border-amber-200 transform rotate-1 hover:rotate-0 transition-transform duration-300 group/zoophoto ${
                                onEditHero ? 'cursor-pointer' : ''
                            }`}
                            title={onEditHero ? "Haz clic para cambiar foto del festejado" : undefined}
                        >
                            {/* Safari stickers on frame */}
                            <div className="absolute -top-3 -left-3 text-2xl select-none">🦁</div>
                            <div className="absolute -bottom-3 -right-3 text-2xl select-none">🐾</div>
                            <div className="absolute top-2 right-2 text-base select-none">🌿</div>

                            <div className="aspect-[4/4] rounded-xl overflow-hidden bg-emerald-50 relative shadow-inner border border-emerald-200">
                                {heroImageUrl ? (
                                    <img
                                        src={heroImageUrl}
                                        alt={childName}
                                        className="w-full h-full object-cover"
                                        style={getHeroImageStyle(cfg)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-tr from-amber-100 to-emerald-100">
                                        <span className="text-5xl mb-2">🤠</span>
                                        <p className="text-xs font-bold text-amber-900">¡Foto del Explorador!</p>
                                    </div>
                                )}
                                {onEditHero && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/zoophoto:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 z-20">
                                        <Edit2 className="h-4 w-4" />
                                        <span>Cambiar Foto</span>
                                    </div>
                                )}
                            </div>

                            {/* Polaroid caption */}
                            <div className="pt-3 pb-1 text-center">
                                <p 
                                    className="text-base sm:text-lg font-black text-[#15803D]"
                                    style={{ fontFamily: '"Fredoka", "Quicksand", sans-serif' }}
                                >
                                    ¡Ven a mi safari de cumpleaños!
                                </p>
                            </div>
                        </div>

                        {/* Interactive Countdown Blocks */}
                        {(countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0) && (
                            <div className="w-full max-w-xs bg-white/90 backdrop-blur-md rounded-2xl p-3 border-2 border-emerald-300 shadow-lg">
                                <p className="text-[10px] font-black uppercase tracking-widest text-center text-[#15803D] mb-2 flex items-center justify-center gap-1">
                                    <span>🐾</span>
                                    <span>Faltan pocos rugidos para la fiesta:</span>
                                    <span>🐾</span>
                                </p>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-[#FEF3C7] rounded-xl p-2 border border-amber-300/60 shadow-xs">
                                        <p className="text-2xl font-black text-[#B45309]">{countdown.days}</p>
                                        <p className="text-[9px] font-bold uppercase text-amber-800">Días</p>
                                    </div>
                                    <div className="bg-[#DCFCE7] rounded-xl p-2 border border-emerald-300/60 shadow-xs">
                                        <p className="text-2xl font-black text-[#15803D]">{countdown.hours}</p>
                                        <p className="text-[9px] font-bold uppercase text-emerald-800">Horas</p>
                                    </div>
                                    <div className="bg-[#FFEDD5] rounded-xl p-2 border border-orange-300/60 shadow-xs">
                                        <p className="text-2xl font-black text-[#EA580C]">{countdown.minutes}</p>
                                        <p className="text-[9px] font-bold uppercase text-orange-800">Minutos</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick Action Button */}
                        <div className="w-full max-w-xs flex flex-col gap-2">
                            <button
                                onClick={() => scrollToSection('rsvp')}
                                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#EA580C] to-[#D97706] hover:from-[#C2410C] hover:to-[#B45309] text-white font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transform active:scale-95 transition-all flex items-center justify-center gap-2 border-2 border-white"
                            >
                                <span>Confirmar Asistencia</span>
                                <span>🦁</span>
                            </button>
                            <button
                                onClick={() => scrollToSection('location')}
                                className="w-full py-2.5 px-6 rounded-full bg-white hover:bg-emerald-50 text-[#15803D] border-2 border-[#15803D] font-black text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2"
                            >
                                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Ver Ubicación del Zoológico</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Safari Timber & Rope Divider (Connects to Next Section) ── */}
            <div className="relative w-full -mb-1 mt-4">
                <SafariDivider />
            </div>
        </div>
    );
}
