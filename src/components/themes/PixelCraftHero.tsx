import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, MapPin, Sparkles, Cake, Compass } from 'lucide-react';

interface Props {
    event: any;
    cfg: any;
    countdown: { days: number; hours: number; minutes: number; seconds: number };
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
}

export default function PixelCraftHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection }: Props) {
    const eventDate = new Date(event.date_time);
    const childName = cfg.child_name || cfg.childName || event.title?.replace(/^(cumpleaños|cumple|mi fiesta|fiesta infantil)\s*(de\s*)?/i, '') || 'MATEO';
    const age = cfg.age || cfg.turning_age || 7;

    return (
        <div className="relative overflow-hidden bg-[#3D2817] text-white pt-4 md:pt-10 pb-12 font-sans select-none">
            {/* ── Background: Deep Minecraft Cave / Earth Pixel Atmosphere ── */}
            <div 
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                    backgroundImage: `
                        radial-gradient(#5C3E26 15%, transparent 16%),
                        radial-gradient(#2A1A0E 15%, transparent 16%)
                    `,
                    backgroundSize: '24px 24px',
                    backgroundPosition: '0 0, 12px 12px'
                }}
            />

            {/* ── Top Canopy: Pixel Leaf Blocks ── */}
            <div className="absolute top-0 left-0 right-0 h-6 sm:h-8 flex justify-between pointer-events-none opacity-80 z-20 overflow-hidden">
                <div className="flex">
                    {Array.from({ length: 14 }).map((_, i) => (
                        <div 
                            key={`leaf-l-${i}`} 
                            className="w-8 sm:w-12 h-6 sm:h-8 bg-[#2E6F22] border-b-4 border-r-4 border-[#1E4D16]" 
                            style={{ opacity: (i % 2 === 0 ? 0.95 : 0.8) }}
                        />
                    ))}
                </div>
            </div>

            {/* ── Top Pixel Bunting / Banderines Festivos ── */}
            <div className="relative z-30 max-w-4xl mx-auto px-2 mb-4">
                <svg viewBox="0 0 800 65" className="w-full h-10 sm:h-14 drop-shadow-md" preserveAspectRatio="none">
                    {/* Hanging String */}
                    <path d="M 0,10 Q 200,32 400,28 T 800,10" stroke="#E2E8F0" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />
                    
                    {/* Pennant 1: Pixel Yellow */}
                    <polygon points="60,14 110,14 85,58" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
                    {/* Pennant 2: Pixel Lime Green */}
                    <polygon points="170,22 220,22 195,64" fill="#4ADE80" stroke="#16A34A" strokeWidth="2" />
                    {/* Pennant 3: Pixel Purple */}
                    <polygon points="280,27 330,27 305,68" fill="#A855F7" stroke="#7E22CE" strokeWidth="2" />
                    {/* Pennant 4: Pixel Blue */}
                    <polygon points="390,28 440,28 415,68" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
                    {/* Pennant 5: Pixel Red/Orange */}
                    <polygon points="500,26 550,26 525,65" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
                    {/* Pennant 6: Pixel Magenta */}
                    <polygon points="610,21 660,21 635,62" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
                    {/* Pennant 7: Pixel Emerald */}
                    <polygon points="710,14 760,14 735,55" fill="#10B981" stroke="#047857" strokeWidth="2" />
                </svg>
            </div>

            {/* ── Pixel Confetti & Floating Sparkles ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                {/* Pixel Squares */}
                <div className="absolute top-24 left-8 w-3 h-3 bg-yellow-400 rotate-12 animate-pulse" />
                <div className="absolute top-36 right-12 w-2.5 h-2.5 bg-pink-500 -rotate-12" />
                <div className="absolute top-64 left-1/4 w-3 h-3 bg-cyan-400 rotate-45 animate-bounce" />
                <div className="absolute top-48 right-1/4 w-2 h-2 bg-emerald-400" />
                <div className="absolute top-1/2 left-10 w-2.5 h-2.5 bg-purple-400 rotate-12" />
                <div className="absolute top-2/3 right-8 w-3 h-3 bg-amber-400 animate-pulse" />
                {/* Pixel Stars */}
                <span className="absolute top-28 right-24 text-cyan-300 text-lg">✦</span>
                <span className="absolute top-72 left-16 text-yellow-300 text-base">★</span>
                <span className="absolute top-96 right-1/3 text-pink-300 text-sm">✦</span>
            </div>

            {/* ── Main Layout Container ── */}
            <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ── Big Pixel Name: MATEO (with 3D Pixel Extrusion) ── */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-block relative">
                        {/* Subtitle tag */}
                        <div className="inline-flex items-center gap-2 px-4 py-1 mb-2 bg-[#22C55E]/20 border-2 border-[#22C55E] rounded-md backdrop-blur-sm shadow-md">
                            <Sparkles className="w-3.5 h-3.5 text-[#4ADE80] animate-spin" />
                            <span 
                                className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#86EFAC]"
                                style={{ fontFamily: '"Press Start 2P", monospace' }}
                            >
                                {labels?.tagline ? `¡${labels.tagline.toUpperCase()}!` : '¡MI FIESTA DE CUMPLEAÑOS!'}
                            </span>
                        </div>

                        {/* Pixel Name */}
                        <h1 
                            className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#86EFAC] via-[#4ADE80] to-[#16A34A] transform transition-transform hover:scale-105"
                            style={{
                                fontFamily: '"Press Start 2P", monospace',
                                filter: 'drop-shadow(0px 6px 0px #0F3810) drop-shadow(0px 10px 0px #000000)',
                                WebkitTextStroke: '2px #000'
                            }}
                        >
                            {childName}
                        </h1>

                        {/* Age Pill (Level / Años) */}
                        <div className="mt-4 inline-flex items-center gap-2 bg-[#1E293B] border-2 border-[#FACC15] px-4 py-1.5 rounded-none shadow-[4px_4px_0px_#000]">
                            <Cake className="w-4 h-4 text-[#FACC15]" />
                            <span 
                                className="text-xs sm:text-sm font-bold text-[#FACC15] uppercase tracking-wider"
                                style={{ fontFamily: '"Press Start 2P", monospace' }}
                            >
                                ¡NIVEL {age} DESBLOQUEADO!
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Main Stage Grid: Responsive Desktop 2-Col / Mobile Stack ── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    
                    {/* LEFT (Desktop 7 cols): Pixel Creeper with Cake & Floating Grass Blocks */}
                    <div className="md:col-span-7 flex flex-col items-center relative">
                        
                        {/* Purple Pixel Balloon (Floating right side) */}
                        <div className="absolute -top-6 right-2 sm:right-8 z-30 pointer-events-none animate-bounce" style={{ animationDuration: '3s' }}>
                            <svg width="70" height="120" viewBox="0 0 70 120">
                                {/* Pixel Balloon Body */}
                                <rect x="15" y="5" width="40" height="45" rx="10" fill="#A855F7" stroke="#3B0764" strokeWidth="3" />
                                <rect x="20" y="10" width="8" height="10" rx="2" fill="#E9D5FF" />
                                {/* Balloon knot */}
                                <polygon points="31,50 39,50 35,56" fill="#7E22CE" stroke="#3B0764" strokeWidth="2" />
                                {/* Pixel Zig-Zag String */}
                                <path d="M 35,56 L 38,68 L 32,80 L 37,94 L 33,108 L 36,120" stroke="#1E293B" strokeWidth="2" fill="none" strokeDasharray="3 2" />
                            </svg>
                        </div>

                        {/* ── Central Illustration: Creeper holding 3-Tier Birthday Cake ── */}
                        <div className="relative w-full max-w-sm sm:max-w-md flex flex-col items-center">
                            
                            {/* Creeper & Cake SVG Vector Pixel Art */}
                            <div className="relative w-64 sm:w-80 h-72 sm:h-84 flex items-center justify-center filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.5)]">
                                <svg viewBox="0 0 300 320" className="w-full h-full">
                                    
                                    {/* ── CREEPER HEAD (Iconic 8x8 Pixel Art) ── */}
                                    <g transform="translate(90, 10)">
                                        {/* Head Base */}
                                        <rect x="0" y="0" width="120" height="120" fill="#4ADE80" stroke="#15803D" strokeWidth="4" />
                                        
                                        {/* Pixel Pattern Shade Variations */}
                                        <rect x="0" y="0" width="30" height="30" fill="#22C55E" />
                                        <rect x="90" y="0" width="30" height="30" fill="#86EFAC" />
                                        <rect x="30" y="30" width="30" height="30" fill="#16A34A" />
                                        <rect x="90" y="60" width="30" height="30" fill="#22C55E" />
                                        <rect x="0" y="90" width="30" height="30" fill="#15803D" />
                                        <rect x="60" y="90" width="30" height="30" fill="#86EFAC" />

                                        {/* Left Eye */}
                                        <rect x="15" y="30" width="30" height="30" fill="#0F172A" />
                                        {/* Right Eye */}
                                        <rect x="75" y="30" width="30" height="30" fill="#0F172A" />

                                        {/* Nose Bridge */}
                                        <rect x="45" y="60" width="30" height="40" fill="#0F172A" />
                                        {/* Mouth Center */}
                                        <rect x="30" y="75" width="60" height="35" fill="#0F172A" />
                                        {/* Mouth Outer Drops */}
                                        <rect x="30" y="90" width="15" height="30" fill="#0F172A" />
                                        <rect x="75" y="90" width="15" height="30" fill="#0F172A" />
                                    </g>

                                    {/* ── CREEPER BODY & ARMS ── */}
                                    <g transform="translate(105, 130)">
                                        {/* Torso */}
                                        <rect x="0" y="0" width="90" height="65" fill="#22C55E" stroke="#15803D" strokeWidth="3" />
                                        <rect x="10" y="10" width="25" height="25" fill="#16A34A" />
                                        <rect x="55" y="20" width="25" height="25" fill="#4ADE80" />
                                    </g>
                                    {/* Left Arm holding cake */}
                                    <rect x="70" y="145" width="35" height="40" rx="3" fill="#16A34A" stroke="#15803D" strokeWidth="3" />
                                    {/* Right Arm holding cake */}
                                    <rect x="195" y="145" width="35" height="40" rx="3" fill="#16A34A" stroke="#15803D" strokeWidth="3" />

                                    {/* ── CAKE SERVING PLATTER ── */}
                                    <rect x="30" y="225" width="240" height="12" rx="2" fill="#475569" stroke="#1E293B" strokeWidth="3" />

                                    {/* ── 3-TIER PIXEL BIRTHDAY CAKE ── */}
                                    <g transform="translate(45, 140)">
                                        {/* BOTTOM TIER */}
                                        <rect x="10" y="55" width="190" height="30" fill="#6B3F1D" stroke="#38210F" strokeWidth="3" />
                                        {/* Bottom Frosting with Pixel Drippings */}
                                        <rect x="10" y="55" width="190" height="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                                        <rect x="25" y="67" width="12" height="8" fill="#F8FAFC" />
                                        <rect x="65" y="67" width="14" height="10" fill="#F8FAFC" />
                                        <rect x="110" y="67" width="12" height="7" fill="#F8FAFC" />
                                        <rect x="155" y="67" width="14" height="9" fill="#F8FAFC" />
                                        {/* Cherry / Sprinkles */}
                                        <rect x="30" y="60" width="8" height="6" fill="#EF4444" />
                                        <rect x="90" y="60" width="8" height="6" fill="#EF4444" />
                                        <rect x="150" y="60" width="8" height="6" fill="#EF4444" />

                                        {/* MIDDLE TIER */}
                                        <rect x="30" y="25" width="150" height="30" fill="#7C4A21" stroke="#38210F" strokeWidth="3" />
                                        {/* Middle Frosting */}
                                        <rect x="30" y="25" width="150" height="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                                        <rect x="45" y="35" width="12" height="7" fill="#F8FAFC" />
                                        <rect x="95" y="35" width="14" height="8" fill="#F8FAFC" />
                                        <rect x="140" y="35" width="12" height="6" fill="#F8FAFC" />
                                        <rect x="50" y="28" width="6" height="5" fill="#EF4444" />
                                        <rect x="120" y="28" width="6" height="5" fill="#EF4444" />

                                        {/* TOP TIER */}
                                        <rect x="50" y="0" width="110" height="25" fill="#8F5527" stroke="#38210F" strokeWidth="3" />
                                        {/* Top Frosting */}
                                        <rect x="50" y="0" width="110" height="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                                        <rect x="65" y="10" width="10" height="6" fill="#F8FAFC" />
                                        <rect x="115" y="10" width="12" height="7" fill="#F8FAFC" />
                                        <rect x="75" y="3" width="6" height="5" fill="#EF4444" />
                                        <rect x="125" y="3" width="6" height="5" fill="#EF4444" />

                                        {/* 5 LIT CANDLES ON TOP */}
                                        {[60, 80, 105, 130, 150].map((cx, i) => (
                                            <g key={`candle-${i}`}>
                                                {/* Candle Stick (Magenta / Pink like image) */}
                                                <rect x={cx - 3} y="-16" width="7" height="16" fill="#EC4899" stroke="#9D174D" strokeWidth="1.5" />
                                                {/* Candle Wick */}
                                                <line x1={cx} y1="-16" x2={cx} y2="-20" stroke="#1E293B" strokeWidth="2" />
                                                {/* Lit Flame Yellow & Orange with Glow */}
                                                <circle cx={cx} cy="-23" r="5" fill="#FACC15" />
                                                <circle cx={cx} cy="-23" r="2.5" fill="#EA580C" />
                                            </g>
                                        ))}
                                    </g>

                                    {/* ── MINECRAFT LOGO PLATE AT BASE ── */}
                                    <g transform="translate(25, 255)">
                                        {/* 3D Gray Stone Logo Plaque */}
                                        <rect x="0" y="0" width="250" height="38" fill="#4B5563" stroke="#1F2937" strokeWidth="3" />
                                        <rect x="4" y="4" width="242" height="6" fill="#9CA3AF" />
                                        <rect x="4" y="28" width="242" height="6" fill="#374151" />
                                        <text 
                                            x="125" 
                                            y="26" 
                                            fill="#F3F4F6" 
                                            textAnchor="middle" 
                                            fontSize="18" 
                                            fontWeight="900" 
                                            letterSpacing="4" 
                                            fontFamily='"Press Start 2P", monospace'
                                            stroke="#111827"
                                            strokeWidth="1"
                                        >
                                            MINECRAFT
                                        </text>
                                    </g>
                                </svg>
                            </div>

                            {/* ── FLOATING VOXEL GRASS BLOCKS (Iconic Islands from Reference) ── */}
                            <div className="w-full flex justify-around items-end mt-2 px-2 z-20">
                                {/* Left Floating Island */}
                                <div className="w-24 sm:w-28 flex flex-col items-center transform -translate-y-2">
                                    <div className="w-full h-8 bg-[#4ADE80] border-t-4 border-l-4 border-r-4 border-[#22C55E] relative" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 85% 100%, 60% 70%, 40% 100%, 15% 70%, 0% 90%)' }}>
                                        <div className="absolute top-1 left-2 w-3 h-2 bg-[#86EFAC]" />
                                    </div>
                                    <div className="w-full h-12 bg-[#78350F] border-4 border-t-0 border-[#451A03] p-1 grid grid-cols-3 gap-1">
                                        <div className="w-2 h-2 bg-[#92400E]" />
                                        <div className="w-2 h-2 bg-[#451A03]" />
                                        <div className="w-2 h-2 bg-[#92400E]" />
                                    </div>
                                </div>

                                {/* Center Big Island */}
                                <div className="w-32 sm:w-36 flex flex-col items-center">
                                    <div className="w-full h-10 bg-[#4ADE80] border-t-4 border-l-4 border-r-4 border-[#22C55E] relative" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 80% 100%, 55% 70%, 35% 100%, 15% 75%, 0% 95%)' }}>
                                        <div className="absolute top-1 left-4 w-4 h-2 bg-[#86EFAC]" />
                                        <div className="absolute top-2 right-4 w-3 h-2 bg-[#86EFAC]" />
                                    </div>
                                    <div className="w-full h-14 bg-[#78350F] border-4 border-t-0 border-[#451A03] p-1 grid grid-cols-4 gap-1">
                                        <div className="w-2.5 h-2.5 bg-[#451A03]" />
                                        <div className="w-2.5 h-2.5 bg-[#92400E]" />
                                        <div className="w-2.5 h-2.5 bg-[#451A03]" />
                                        <div className="w-2.5 h-2.5 bg-[#92400E]" />
                                    </div>
                                </div>

                                {/* Right Floating Island */}
                                <div className="w-24 sm:w-28 flex flex-col items-center transform -translate-y-4">
                                    <div className="w-full h-8 bg-[#4ADE80] border-t-4 border-l-4 border-r-4 border-[#22C55E] relative" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 80%, 75% 100%, 50% 65%, 25% 100%, 0% 75%)' }}>
                                        <div className="absolute top-1 right-2 w-3 h-2 bg-[#86EFAC]" />
                                    </div>
                                    <div className="w-full h-12 bg-[#78350F] border-4 border-t-0 border-[#451A03] p-1 grid grid-cols-3 gap-1">
                                        <div className="w-2 h-2 bg-[#92400E]" />
                                        <div className="w-2 h-2 bg-[#451A03]" />
                                        <div className="w-2 h-2 bg-[#92400E]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT (Desktop 5 cols): Quest Parchment / Crafting Card with Date, Countdown & Action Buttons */}
                    <div className="md:col-span-5 flex flex-col items-center space-y-6">
                        
                        {/* ── Quest Scroll / Crafting Table Card ── */}
                        <div className="relative w-full max-w-sm bg-[#523A28] p-5 sm:p-6 border-4 border-[#2A1A0E] shadow-[8px_8px_0px_#170F08] text-center">
                            
                            {/* Card Header Rivets */}
                            <div className="absolute top-2 left-2 w-2 h-2 bg-[#2A1A0E]" />
                            <div className="absolute top-2 right-2 w-2 h-2 bg-[#2A1A0E]" />
                            <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#2A1A0E]" />
                            <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#2A1A0E]" />

                            {/* Badge: Misión Principal */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#15803D] border-2 border-[#4ADE80] text-white text-[10px] uppercase font-bold tracking-widest mb-3">
                                <span>⚔️</span>
                                <span style={{ fontFamily: '"Press Start 2P", monospace' }}>MISIÓN DE CUMPLE</span>
                            </div>

                            {/* Date Box */}
                            <div className="bg-[#2A1A0E] p-3 border-2 border-[#85532A] my-2">
                                <p className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-[#FACC15]">
                                    {format(eventDate, 'EEEE', { locale: es })}
                                </p>
                                <p 
                                    className="text-4xl sm:text-5xl font-black text-white tracking-wider my-1 drop-shadow-[2px_2px_0px_#000]"
                                    style={{ fontFamily: '"Press Start 2P", monospace' }}
                                >
                                    {format(eventDate, 'd', { locale: es })}
                                </p>
                                <p className="text-sm font-mono font-bold uppercase tracking-widest text-[#86EFAC]">
                                    {format(eventDate, 'MMMM yyyy', { locale: es })}
                                </p>
                            </div>

                            {/* Time and Venue Quick Line */}
                            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-mono text-amber-200">
                                <Clock className="w-3.5 h-3.5 text-[#FACC15]" />
                                <span className="font-bold">{format(eventDate, 'h:mm a', { locale: es })}</span>
                                <span>•</span>
                                <MapPin className="w-3.5 h-3.5 text-[#4ADE80]" />
                                <span className="truncate max-w-[140px]">{event.venue_name || 'Salón de Fiestas'}</span>
                            </div>

                            {/* Optional Photo or Message */}
                            {heroImageUrl && (
                                <div className="mt-4 border-4 border-[#2A1A0E] overflow-hidden bg-black/40">
                                    <img src={heroImageUrl} alt={childName} className="w-full h-36 object-cover" />
                                </div>
                            )}

                            <p className="mt-3 text-xs text-amber-100/90 font-medium leading-relaxed font-mono">
                                {cfg.message || '¡Prepara tu armadura y tu pico! Estás invitado a explorar, craftear y festejar en grande.'}
                            </p>
                        </div>

                        {/* ── Pixel Craft Countdown ── */}
                        {(countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0) && (
                            <div className="w-full max-w-sm bg-[#2A1A0E] p-4 border-4 border-[#85532A] shadow-[6px_6px_0px_#170F08] text-center">
                                <p 
                                    className="text-[10px] font-bold uppercase tracking-widest text-[#FACC15] mb-3"
                                    style={{ fontFamily: '"Press Start 2P", monospace' }}
                                >
                                    LA AVENTURA INICIA EN:
                                </p>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { val: countdown.days, label: 'DÍAS' },
                                        { val: countdown.hours, label: 'HRS' },
                                        { val: countdown.minutes, label: 'MIN' },
                                        { val: countdown.seconds, label: 'SEG' }
                                    ].map((item) => (
                                        <div key={item.label} className="bg-[#170F08] py-2 px-1 border-2 border-[#523A28]">
                                            <p 
                                                className="text-xl sm:text-2xl font-black text-[#4ADE80]"
                                                style={{ fontFamily: '"VT323", monospace' }}
                                            >
                                                {String(item.val).padStart(2, '0')}
                                            </p>
                                            <p className="text-[8px] font-bold text-amber-200 uppercase tracking-wider">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Minecraft Beveled Action Buttons ── */}
                        <div className="w-full max-w-sm space-y-3">
                            <button
                                onClick={() => scrollToSection('rsvp')}
                                className="w-full py-3.5 px-6 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs sm:text-sm uppercase tracking-wider border-t-4 border-l-4 border-[#86EFAC] border-b-4 border-r-4 border-[#14532D] shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                                style={{ fontFamily: '"Press Start 2P", monospace' }}
                            >
                                <span>CONFIRMAR ASISTENCIA</span>
                                <span>⚔️</span>
                            </button>

                            <button
                                onClick={() => scrollToSection('location')}
                                className="w-full py-3 px-6 bg-[#4B5563] hover:bg-[#374151] text-[#F9FAFB] font-bold text-xs uppercase tracking-wider border-t-4 border-l-4 border-[#9CA3AF] border-b-4 border-r-4 border-[#1F2937] shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                                style={{ fontFamily: '"Press Start 2P", monospace' }}
                            >
                                <Compass className="w-4 h-4 text-[#FACC15]" />
                                <span>VER COORDENADAS (MAPA)</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
