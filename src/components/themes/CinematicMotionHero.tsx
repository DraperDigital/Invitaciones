import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Edit2, ShieldCheck } from 'lucide-react';

interface Props {
    event: any;
    cfg: any;
    countdown: { days: number; hours: number; minutes: number; seconds: number };
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
    onEditHero?: () => void;
    guest?: any;
}

export default function CinematicMotionHero({
    event,
    cfg,
    countdown,
    heroImageUrl,
    scrollToSection,
    onEditHero,
    guest,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const primaryColor = cfg.primary_color || '#CCA461';

    const title = event.title || 'Baby Posada';

    // Parallax scroll hooks
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const artY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
    const textOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

    // Canvas particle engine: gentle soft snowflakes and warm golden dust
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        const particleCount = window.innerWidth < 768 ? 28 : 45;
        const particles = Array.from({ length: particleCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 0.8,
            speedY: Math.random() * 0.45 + 0.2,
            speedX: (Math.random() - 0.5) * 0.2,
            alpha: Math.random() * 0.5 + 0.2,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            isGold: Math.random() > 0.5,
        }));

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                p.y += p.speedY;
                p.x += Math.sin(p.y * 0.01) * 0.2 + p.speedX;
                p.alpha += Math.sin(Date.now() * p.pulseSpeed * 0.05) * 0.01;

                if (p.y > height + 10) {
                    p.y = -10;
                    p.x = Math.random() * width;
                }
                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;

                const currentAlpha = Math.max(0.12, Math.min(0.75, p.alpha));

                ctx.save();
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

                if (p.isGold) {
                    ctx.fillStyle = `rgba(204, 164, 97, ${currentAlpha})`;
                    ctx.shadowColor = primaryColor;
                    ctx.shadowBlur = 4;
                } else {
                    ctx.fillStyle = `rgba(253, 248, 240, ${currentAlpha * 0.85})`;
                    ctx.shadowColor = '#E1EAF2';
                    ctx.shadowBlur = 3;
                }

                ctx.fill();
                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [primaryColor]);

    const artworkSource = heroImageUrl || cfg.hero_image_url || '/images/baby-posada-art.jpg';

    return (
        <section
            id="hero"
            ref={containerRef}
            className="w-full relative min-h-screen flex flex-col justify-between items-center overflow-hidden select-none bg-transparent"
        >
            {/* ── 1. Gentle Snowflake & Dust Canvas ── */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
            />

            {/* ── 2. Top Navigation Bar (Warm Crema / Beige Glass) ── */}
            <header className="w-full pt-4 sm:pt-6 pb-3 px-4 sm:px-8 flex items-center justify-between z-20 border-b border-[#CCA461]/30 backdrop-blur-md bg-[#FDF8F0]/85 shadow-xs">
                <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FDF8F0] border border-[#CCA461]/40 shadow-xs">
                        <img src="/images/icons/farol.png" alt="Farol" className="w-4 h-4 object-contain" />
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-[#8D6B4F]">
                        {cfg.subtitle || 'Baby Shower & Revelación de Género'}
                    </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-sans tracking-widest uppercase">
                    <button
                        onClick={() => scrollToSection('itinerary')}
                        className="hidden xs:inline-block px-2.5 py-1 text-[#4A443E] hover:text-[#8D6B4F] transition-colors cursor-pointer font-medium"
                    >
                        Itinerario
                    </button>
                    <button
                        onClick={() => scrollToSection('location')}
                        className="hidden xs:inline-block px-2.5 py-1 text-[#4A443E] hover:text-[#8D6B4F] transition-colors cursor-pointer font-medium"
                    >
                        Ubicación
                    </button>
                    <button
                        onClick={() => scrollToSection('rsvp')}
                        className="px-4 py-1.5 rounded-full bg-[#CCA461] hover:bg-[#b89150] text-[#FDF8F0] font-bold transition-all cursor-pointer shadow-md shadow-[#CCA461]/25 active:scale-95 text-xs"
                    >
                        Confirmar Asistencia
                    </button>
                    {onEditHero && (
                        <button
                            onClick={onEditHero}
                            className="p-1.5 rounded-lg bg-[#FDF8F0] hover:bg-[#E1EAF2] text-[#4A443E] border border-[#CCA461]/30 transition-colors cursor-pointer"
                            title="Editar portada"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </header>

            {/* ── 3. Main Hero Body with Art, Calligraphy and Countdown ── */}
            <motion.div
                style={{ y: textY, opacity: textOpacity }}
                className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center text-center my-auto"
            >
                {/* Clean "Save the date" pill - NO stars */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="inline-flex items-center px-7 py-2 rounded-full bg-[#FDF8F0]/95 border border-[#CCA461]/40 backdrop-blur-md mb-3 shadow-xs"
                >
                    <span className="font-serif italic text-base sm:text-lg text-[#8D6B4F] tracking-wider">
                        Save the date
                    </span>
                </motion.div>

                {/* Main Event Title: Babyn Posada */}
                <motion.h1
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="font-serif text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-normal tracking-wide leading-none mb-3"
                >
                    <span className="text-[#4A443E] drop-shadow-[0_2px_12px_rgba(204,164,97,0.25)]">
                        {title}
                    </span>
                </motion.h1>

                {/* Event Sub-headline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.35 }}
                    className="text-xs sm:text-sm font-sans tracking-[0.25em] uppercase text-[#8D6B4F] font-semibold mb-6"
                >
                    Baby Shower • Posada Navideña • Revelación de Género
                </motion.p>

                {/* ── 4. Central Artwork Card Flanked by Posada Elements ── */}
                <div className="relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[430px] mb-8">
                    {/* Floating Farol on Top-Left with Parallax Bob */}
                    <motion.div
                        animate={{ y: [0, -7, 0], rotate: [-2, 2, -2] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-7 -left-6 sm:-left-10 w-16 sm:w-20 h-16 sm:h-20 z-20 pointer-events-none drop-shadow-md"
                    >
                        <img src="/images/icons/farol.png" alt="Farol Navideño" className="w-full h-full object-contain" />
                    </motion.div>

                    {/* Floating Piñata on Top-Right with Gentle Sway */}
                    <motion.div
                        animate={{ y: [0, 7, 0], rotate: [2, -2, 2] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-8 -right-6 sm:-right-10 w-16 sm:w-20 h-16 sm:h-20 z-20 pointer-events-none drop-shadow-md"
                    >
                        <img src="/images/icons/pinata.png" alt="Piñata Navideña" className="w-full h-full object-contain" />
                    </motion.div>

                    {/* Artwork Container */}
                    <motion.div
                        style={{ y: artY }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_-10px_rgba(74,68,62,0.18)] border-2 border-[#CCA461]/50 bg-[#FDF8F0] group"
                    >
                        {/* Soft Warm Aura Behind Artwork */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#CCA461]/20 via-[#E1EAF2]/30 to-[#8D6B4F]/20 rounded-3xl blur-xl opacity-60 pointer-events-none" />

                        {/* The User's Illustration */}
                        <div className="relative w-full overflow-hidden bg-[#FAF8F5]">
                            <img
                                src={artworkSource}
                                alt="Baby Posada Art"
                                className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* ── 5. Personalized VIP Guest Access Card with Bebé Icon ── */}
                {guest && (
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="w-full max-w-md p-4 sm:p-5 rounded-2xl bg-[#FDF8F0]/95 backdrop-blur-xl border border-[#CCA461]/40 shadow-[0_12px_32px_rgba(74,68,62,0.08)] mb-8 text-left relative overflow-hidden group hover:border-[#CCA461] transition-colors"
                    >
                        <div className="flex items-center justify-between gap-3 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 shrink-0 rounded-xl bg-[#FDF8F0] border border-[#CCA461]/30 flex items-center justify-center p-1">
                                    <img src="/images/icons/bebe_solo.png" alt="Bebé" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[#8D6B4F] mb-0.5">
                                        <ShieldCheck className="w-3.5 h-3.5 text-[#CCA461]" />
                                        Pase Exclusivo para la Baby Posada
                                    </span>
                                    <h3 className="font-serif text-base sm:text-lg text-[#4A443E] font-semibold leading-tight">
                                        {guest.name}
                                    </h3>
                                    <p className="text-xs text-[#8D6B4F] mt-0.5">
                                        Acceso reservado: <span className="text-[#4A443E] font-bold">{guest.max_plus_ones ? guest.max_plus_ones + 1 : 1} personas</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider bg-[#FDF8F0] border border-[#CCA461]/50 text-[#8D6B4F] font-bold">
                                    INVITADO VIP
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── 6. Glassmorphic Live Countdown (Targeting Dec 12, 2026) ── */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-lg mb-6"
                >
                    {[
                        { label: 'DÍAS', value: countdown.days },
                        { label: 'HORAS', value: countdown.hours },
                        { label: 'MINUTOS', value: countdown.minutes },
                        { label: 'SEGUNDOS', value: countdown.seconds },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FDF8F0]/90 backdrop-blur-md border border-[#CCA461]/40 hover:border-[#CCA461] transition-all shadow-[0_4px_16px_rgba(74,68,62,0.06)]"
                        >
                            <span className="font-serif text-xl sm:text-3xl md:text-4xl font-bold text-[#CCA461]">
                                {String(item.value).padStart(2, '0')}
                            </span>
                            <span className="text-[9px] sm:text-[11px] font-sans tracking-widest text-[#8D6B4F] font-bold uppercase mt-1">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* ── 7. Posada Scroll Cue ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.8 }}
                className="relative z-10 pb-6 sm:pb-8 flex flex-col items-center gap-2 cursor-pointer group"
                onClick={() => scrollToSection('guest_welcome')}
            >
                <span className="text-[10px] sm:text-xs font-sans tracking-[0.25em] text-[#8D6B4F] font-bold uppercase group-hover:text-[#4A443E] transition-colors">
                    Desliza para conocer los detalles de la posada
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="p-1 rounded-full text-[#CCA461]"
                >
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 opacity-85" />
                </motion.div>
            </motion.div>
        </section>
    );
}
