import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, MapPin, Gamepad2, Edit2 } from 'lucide-react';

interface Props {
    event: any;
    cfg: any;
    countdown: { days: number; hours: number; minutes: number; seconds: number };
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
    onEditHero?: () => void;
}

export default function GamerPartyHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const eventDate = new Date(event.date_time);
    const childName = cfg.child_name || cfg.childName || event.title?.replace(/^(cumpleaños|cumple|fiesta gamer|gamer party)\s*(de\s*)?/i, '') || 'SAMUEL';

    return (
        <div className="relative overflow-hidden bg-[#0A0D14] text-white pt-8 md:pt-16 pb-12 font-sans">
            {/* ── Ambient RGB Neon Glows ── */}
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-[100px] pointer-events-none animate-pulse" />
            <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-purple-600/15 blur-[100px] pointer-events-none" />

            {/* Subtle Floating Gamepad Symbols (▲ ● ✖ ■) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                <span className="absolute top-10 left-10 text-3xl font-mono text-cyan-400">▲</span>
                <span className="absolute top-32 right-16 text-3xl font-mono text-rose-400">●</span>
                <span className="absolute top-1/2 left-8 text-3xl font-mono text-blue-400">✖</span>
                <span className="absolute bottom-20 right-12 text-3xl font-mono text-emerald-400">■</span>
                <span className="absolute top-20 left-1/2 text-2xl font-mono text-amber-400">★</span>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ── Header: Player Tag & Arcade 8-Bit Title ── */}
                <div className="text-center space-y-2 mb-8 md:mb-12">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-cyan-300 uppercase">
                            {childName}'S
                        </span>
                    </div>

                    <h1 
                        className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase select-none drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                        style={{ fontFamily: '"Press Start 2P", "VT323", monospace' }}
                    >
                        <span className="text-white">Gamer </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
                            Party
                        </span>
                    </h1>

                    <p className="text-xs sm:text-sm font-mono text-slate-400 tracking-wider">
                        {labels?.tagline || 'LEVEL UP CELEBRATION'}
                    </p>
                </div>

                {/* ── Main Stage: 2-Column on Desktop, Stack on Mobile ── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    {/* LEFT (7 cols on Desktop): Neon Gamepad Controller & Date Card */}
                    <div className="md:col-span-7 flex flex-col items-center">
                        <div className="relative w-full max-w-md bg-gradient-to-b from-[#111827] via-[#0F172A] to-[#0A0D14] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col items-center text-center group">
                            {/* Controller Neon Glow SVG */}
                            <div className="relative w-56 sm:w-72 h-44 sm:h-56 mb-4 flex items-center justify-center">
                                <svg viewBox="0 0 320 220" className="w-full h-full drop-shadow-[0_0_25px_rgba(56,189,248,0.6)]">
                                    {/* Gamepad Body */}
                                    <path 
                                        d="M60 40 C100 30, 220 30, 260 40 C285 45, 305 75, 305 130 C305 185, 270 210, 240 205 C215 200, 195 160, 160 160 C125 160, 105 200, 80 205 C50 210, 15 185, 15 130 C15 75, 35 45, 60 40 Z" 
                                        fill="#0B0F19" 
                                        stroke="#38BDF8" 
                                        strokeWidth="4" 
                                    />
                                    {/* Inner Grip Lines Neon */}
                                    <path d="M40 100 C35 130, 45 165, 65 175" stroke="#EC4899" strokeWidth="3" fill="none" />
                                    <path d="M280 100 C285 130, 275 165, 255 175" stroke="#10B981" strokeWidth="3" fill="none" />

                                    {/* D-Pad (Left) */}
                                    <g transform="translate(65, 90)">
                                        <rect x="16" y="0" width="14" height="46" rx="3" fill="#1E293B" stroke="#06B6D4" strokeWidth="2" />
                                        <rect x="0" y="16" width="46" height="14" rx="3" fill="#1E293B" stroke="#06B6D4" strokeWidth="2" />
                                    </g>

                                    {/* Action Buttons (Right: ▲ ● ✖ ■) */}
                                    <g transform="translate(215, 88)">
                                        {/* Top Yellow (▲) */}
                                        <circle cx="23" cy="5" r="7" fill="#1E293B" stroke="#FACC15" strokeWidth="2" />
                                        <text x="20" y="9" fontSize="8" fill="#FACC15" fontWeight="bold">▲</text>
                                        {/* Right Red (●) */}
                                        <circle cx="41" cy="23" r="7" fill="#1E293B" stroke="#EF4444" strokeWidth="2" />
                                        <text x="38" y="27" fontSize="8" fill="#EF4444" fontWeight="bold">●</text>
                                        {/* Bottom Blue (✖) */}
                                        <circle cx="23" cy="41" r="7" fill="#1E293B" stroke="#3B82F6" strokeWidth="2" />
                                        <text x="20" y="45" fontSize="8" fill="#3B82F6" fontWeight="bold">✖</text>
                                        {/* Left Green (■) */}
                                        <circle cx="5" cy="23" r="7" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
                                        <text x="3" y="26" fontSize="8" fill="#10B981" fontWeight="bold">■</text>
                                    </g>

                                    {/* Analog Thumbsticks */}
                                    <circle cx="120" cy="140" r="18" fill="#0F172A" stroke="#64748B" strokeWidth="2" />
                                    <circle cx="120" cy="140" r="10" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
                                    <circle cx="200" cy="140" r="18" fill="#0F172A" stroke="#64748B" strokeWidth="2" />
                                    <circle cx="200" cy="140" r="10" fill="#1E293B" stroke="#EC4899" strokeWidth="2" />

                                    {/* Center Touchpad with Lightning Bolt ⚡ */}
                                    <rect x="135" y="65" width="50" height="32" rx="4" fill="#0F172A" stroke="#FACC15" strokeWidth="2" />
                                    <path d="M162 70 L154 81 L160 81 L158 92 L168 79 L162 79 Z" fill="#FACC15" />
                                </svg>
                            </div>

                            {/* Date Details below Gamepad */}
                            <div className="space-y-1 my-2">
                                <p className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.3em] text-slate-400">
                                    {format(eventDate, 'EEEE', { locale: es })}
                                </p>
                                <p 
                                    className="text-4xl sm:text-6xl font-black text-white tracking-wider drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                                    style={{ fontFamily: '"Press Start 2P", monospace' }}
                                >
                                    {format(eventDate, 'd', { locale: es })}
                                </p>
                                <p className="text-sm sm:text-base font-mono font-bold uppercase tracking-[0.25em] text-cyan-300">
                                    {format(eventDate, 'MMMM', { locale: es })}
                                </p>
                            </div>

                            {/* Time Pill Badge */}
                            <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1E293B] border border-cyan-400/40 text-cyan-300 font-mono font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                                <Clock className="w-4 h-4 text-cyan-400" />
                                <span>{format(eventDate, 'h:mm a', { locale: es })}</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT (5 cols on Desktop): Gamer Photo, Countdown & Actions */}
                    <div className="md:col-span-5 flex flex-col items-center space-y-6">
                        {/* ── Gamer Photo Card (Level Up Frame) ── */}
                        <div className="relative w-64 sm:w-72 bg-[#111827] p-4 rounded-3xl border-2 border-emerald-400/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                            {/* Level Up Banner Tag */}
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-red-600 border border-red-400 text-white font-mono font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-md">
                                ¡Level Up!
                            </div>

                            <div 
                                onClick={onEditHero}
                                className={`aspect-[4/4] rounded-2xl overflow-hidden bg-slate-900 relative mt-2 border border-white/10 group/gamerphoto ${
                                    onEditHero ? 'cursor-pointer hover:border-cyan-400/50' : ''
                                }`}
                                title={onEditHero ? "Haz clic para cambiar foto del festejado" : undefined}
                            >
                                {heroImageUrl ? (
                                    <img 
                                        src={heroImageUrl} 
                                        alt={childName} 
                                        className="w-full h-full object-cover group-hover/gamerphoto:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-tr from-slate-900 to-indigo-950">
                                        <Gamepad2 className="w-16 h-16 text-cyan-400 mb-2 animate-bounce" />
                                        <p className="text-xs font-mono text-slate-300 font-bold">Player 1 Ready</p>
                                    </div>
                                )}
                                {/* Corner Controller Badge */}
                                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md p-1.5 rounded-xl border border-white/20 text-xl select-none z-10">
                                    🎮
                                </div>
                                {onEditHero && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/gamerphoto:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 z-20">
                                        <Edit2 className="h-4 w-4 text-cyan-400" />
                                        <span>Cambiar Foto</span>
                                    </div>
                                )}
                            </div>

                            {/* Player Invite Text */}
                            <div className="pt-3 text-center">
                                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                    ¡Jugador conectado! Estás invitado a la fiesta gamer del año. Ven a subir de nivel.
                                </p>
                            </div>
                        </div>

                        {/* ── Digital Arcade Countdown ── */}
                        {(countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0) && (
                            <div className="w-full max-w-xs bg-[#111827]/90 rounded-2xl p-4 border border-amber-400/30 shadow-[0_0_20px_rgba(250,204,21,0.1)] text-center">
                                <p 
                                    className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-3"
                                    style={{ fontFamily: '"Press Start 2P", monospace' }}
                                >
                                    EL JUEGO COMIENZA EN
                                </p>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { val: countdown.days, label: 'DÍAS' },
                                        { val: countdown.hours, label: 'HRS' },
                                        { val: countdown.minutes, label: 'MIN' },
                                        { val: countdown.seconds, label: 'SEG' }
                                    ].map((item) => (
                                        <div key={item.label} className="bg-[#0B0F19] rounded-xl py-2 px-1 border border-amber-400/40">
                                            <p 
                                                className="text-lg sm:text-xl font-black text-amber-300"
                                                style={{ fontFamily: '"VT323", monospace' }}
                                            >
                                                {String(item.val).padStart(2, '0')}
                                            </p>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Action Buttons ── */}
                        <div className="w-full max-w-xs space-y-2.5">
                            <button
                                onClick={() => scrollToSection('rsvp')}
                                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.4)] transform active:scale-95 transition-all flex items-center justify-center gap-2 border border-red-400"
                            >
                                <span>Confirmar Asistencia</span>
                                <span>⚡</span>
                            </button>
                            <button
                                onClick={() => scrollToSection('location')}
                                className="w-full py-2.5 px-6 rounded-full bg-[#10B981] hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
                            >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>Ver Ubicación</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
