import { useState, useEffect, useRef } from 'react';
import { useCountdown } from './useCountdown';
import QuinielaModal from './QuinielaModal';
import VideoModal from './VideoModal';
import { ChevronUp, PlayCircle } from 'lucide-react';

const SLIDES = [
    {
        id: 'ninos_heroes',
        theme: 'bg-gradient-to-br from-slate-900 via-stone-800 to-zinc-950',
        textColor: 'text-slate-50',
        accentColor: 'text-amber-300',
        title: 'para los Niños Héroes',
        subtitle: '(13 de Septiembre)',
        description: 'Homenaje solemne en el Castillo de Chapultepec recordando el valor, la lealtad y el sacrificio de nuestros jóvenes héroes.',
        targetDate: '2026-09-13T00:00:00',
        emoji: '🏰'
    },
    {
        id: 'sept15',
        theme: 'bg-gradient-to-br from-emerald-900 via-green-800 to-teal-950',
        textColor: 'text-emerald-50',
        accentColor: 'text-emerald-300',
        title: 'para el 15 de Septiembre',
        subtitle: '(Grito de Independencia)',
        description: 'El repicar de las campanas de Dolores, mariachi, pozole y el orgullo mexicano retumbando en el corazón. ¡Viva México!',
        targetDate: '2026-09-15T00:00:00',
        emoji: '🇲🇽'
    },
    {
        id: 'halloween',
        theme: 'bg-gradient-to-br from-purple-950 via-fuchsia-900/40 to-indigo-950',
        textColor: 'text-purple-50',
        accentColor: 'text-orange-400',
        title: 'para Halloween',
        subtitle: '(31 de Octubre)',
        description: 'Calabazas encendidas en los porches, disfraces, ambiente de misterio y la mágica búsqueda de "truco o trato" bajo la luna.',
        targetDate: '2026-10-31T00:00:00',
        emoji: '🎃'
    },
    {
        id: 'dia_muertos',
        theme: 'bg-gradient-to-br from-orange-950 via-rose-950 to-purple-950',
        textColor: 'text-orange-50',
        accentColor: 'text-purple-300',
        title: 'para el Día de Muertos',
        subtitle: '(2 de Noviembre)',
        description: 'Caminos de pétalos de cempasúchil, aroma a copal y pan de muerto recién horneado. El reencuentro más hermoso con nuestros seres queridos.',
        targetDate: '2026-11-02T00:00:00',
        emoji: '💀'
    },
    {
        id: 'virgen',
        theme: 'bg-gradient-to-br from-blue-950 via-cyan-950 to-slate-950',
        textColor: 'text-blue-50',
        accentColor: 'text-amber-200',
        title: 'para la Virgen de Guadalupe',
        subtitle: '(12 de Diciembre)',
        description: 'Rosas del Tepeyac, Mañanitas de medianoche, peregrinaciones y la fe que abraza a millones de familias.',
        targetDate: '2026-12-12T00:00:00',
        emoji: '🌹'
    },
    {
        id: 'navidad',
        theme: 'bg-gradient-to-br from-green-950 via-emerald-950 to-red-950/40',
        textColor: 'text-green-50',
        accentColor: 'text-red-300',
        title: 'para Navidad',
        subtitle: '(25 de Diciembre)',
        description: 'El calor de la cena en Nochebuena, piñatas de 7 picos, ponche de frutas con canela y el abrazo apretado al abrir los regalos.',
        targetDate: '2026-12-25T00:00:00',
        emoji: '🎄'
    },
    {
        id: 'reyes',
        theme: 'bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950',
        textColor: 'text-indigo-50',
        accentColor: 'text-amber-300',
        title: 'para el Día de Reyes',
        subtitle: '(6 de Enero)',
        description: 'Rebanadas de Rosca de Reyes con chocolate caliente, la ilusión de la mañana y descubrir a quién le toca el niño en el pan.',
        targetDate: '2027-01-06T00:00:00',
        emoji: '👑'
    },
    {
        id: 'aniversario',
        theme: 'bg-gradient-to-br from-rose-950 via-pink-900/50 to-amber-950',
        textColor: 'text-rose-50',
        accentColor: 'text-pink-300',
        title: 'para nuestro Aniversario de Bodas',
        subtitle: '(25 de Enero)',
        description: 'Recordando el día en que unimos nuestras vidas: celebrando el amor, la complicidad y cada momento único compartido juntos.',
        targetDate: '2027-01-25T00:00:00',
        emoji: '💍'
    }
];

const CountdownDisplay = ({ targetDate, accentColor }: { targetDate: string, accentColor: string }) => {
    const timeLeft = useCountdown(targetDate);
    
    return (
        <div className="flex gap-3 sm:gap-4 justify-center mt-6">
            {[
                { label: 'DÍAS', value: timeLeft.days },
                { label: 'HRS', value: timeLeft.hours },
                { label: 'MIN', value: timeLeft.minutes },
                { label: 'SEG', value: timeLeft.seconds }
            ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center group">
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border border-white/20 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50" />
                        <span className={`text-3xl sm:text-4xl font-black ${accentColor} drop-shadow-md z-10 font-serif tabular-nums`}>
                            {item.value.toString().padStart(2, '0')}
                        </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] mt-3 opacity-60 uppercase group-hover:opacity-100 transition-opacity">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default function CarlosYFridaLanding() {
    const [activeSlide, setActiveSlide] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [showRotateHint, setShowRotateHint] = useState(false);
    const [showRotateBackHint, setShowRotateBackHint] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [showQuiniela, setShowQuiniela] = useState(false);
    const [hasWatchedVideo, setHasWatchedVideo] = useState(false);
    const videoUrl = 'https://invitto.com.mx/assets/Web.mp4';

    const wasRotatedByHintRef = useRef(false);

    // Update active slide based on scroll position
    const handleScroll = () => {
        if (!containerRef.current) return;
        const { scrollTop, clientHeight } = containerRef.current;
        const index = Math.round(scrollTop / clientHeight);
        setActiveSlide(index);
    };

    const handleRevealClick = () => {
        const isMobile = window.innerWidth < 768;
        const isPortrait = window.innerHeight > window.innerWidth;
        
        if (isMobile && isPortrait) {
            wasRotatedByHintRef.current = true;
            setShowRotateHint(true);
        } else {
            wasRotatedByHintRef.current = false;
            setShowVideo(true);
        }
    };

    const handleReadyToWatch = () => {
        setShowRotateHint(false);
        setShowVideo(true);
    };

    const handleVideoEnded = () => {
        setShowVideo(false);
        setHasWatchedVideo(true);
        
        const isMobile = window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth <= 1024);
        
        if (wasRotatedByHintRef.current && isMobile) {
            wasRotatedByHintRef.current = false;
            setShowRotateBackHint(true);
        } else {
            wasRotatedByHintRef.current = false;
            setTimeout(() => {
                setShowQuiniela(true);
            }, 500);
        }
    };

    const handleRotatedBack = () => {
        setShowRotateBackHint(false);
        setTimeout(() => {
            setShowQuiniela(true);
        }, 500);
    };

    // Prevent body scroll when in this page to avoid double scrollbars
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    // Total slides = 7 regular + 1 puente + 1 clímax
    const totalSlides = SLIDES.length + 2;

    return (
        <div className="h-[100dvh] w-full bg-black relative overflow-hidden font-sans">
            
            {/* Story Progress Bar */}
            <div className="absolute top-0 inset-x-0 p-4 z-50 flex gap-1 sm:gap-2">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                    <div key={idx} className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden">
                        <div 
                            className={`h-full bg-white transition-all duration-300 ${idx === activeSlide ? 'w-full' : idx < activeSlide ? 'w-full' : 'w-0'}`} 
                        />
                    </div>
                ))}
            </div>

            {/* Scroll Container */}
            <div 
                ref={containerRef}
                onScroll={handleScroll}
                className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {/* 1-7. Regular Slides */}
                {SLIDES.map((slide, idx) => (
                    <div 
                        key={slide.id} 
                        className={`h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center p-6 sm:p-12 text-center relative ${slide.theme} ${slide.textColor}`}
                    >
                        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 pointer-events-none" />
                        
                        <div className="z-10 max-w-2xl px-4 animate-in slide-in-from-bottom-8 fade-in duration-1000">
                            <div className="text-7xl sm:text-9xl mb-8 filter drop-shadow-2xl hover:scale-110 transition-transform duration-500 cursor-default">{slide.emoji}</div>
                            
                            <h2 className="text-sm sm:text-base font-bold mb-4 tracking-[0.3em] uppercase opacity-70">
                                Faltan
                            </h2>

                            <div className="mb-10">
                                <CountdownDisplay targetDate={slide.targetDate} accentColor={slide.accentColor} />
                            </div>

                            <div className="relative pt-6">
                                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-12 h-[2px] bg-white/20 rounded-full" />
                                <h3 className="text-3xl sm:text-5xl font-black mb-3 tracking-tight leading-tight drop-shadow-xl font-serif">
                                    {slide.title}
                                </h3>
                                <h4 className={`text-lg sm:text-xl font-bold mb-6 opacity-90 ${slide.accentColor} italic font-serif`}>
                                    {slide.subtitle}
                                </h4>
                                <p className="text-base sm:text-lg opacity-80 leading-relaxed font-light max-w-md mx-auto drop-shadow-md">
                                    {slide.description}
                                </p>
                            </div>
                        </div>

                        {idx < totalSlides - 1 && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-pulse opacity-60">
                                <span className="text-xs uppercase tracking-widest font-bold mb-2">Desliza</span>
                                <ChevronUp className="w-6 h-6" />
                            </div>
                        )}
                    </div>
                ))}

                {/* 8. Puente Emocional */}
                <div className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center p-8 text-center bg-[#faf4e8] relative">
                    <div className="z-10 max-w-2xl animate-in zoom-in-95 fade-in duration-1000">
                        <div className="w-24 h-px bg-stone-300 mx-auto mb-8" />
                        <h2 className="text-4xl sm:text-6xl font-serif text-stone-800 mb-8 leading-tight">
                            Pero la fecha más importante de todas... <br/>
                            <span className="italic text-stone-500">La espera es más dulce</span>
                        </h2>
                        <p className="text-xl sm:text-2xl text-stone-600 font-light leading-relaxed">
                            Cada día que pasa nos acerca al regalo más maravilloso que transformará nuestra familia para siempre.
                        </p>
                        <div className="w-24 h-px bg-stone-300 mx-auto mt-8" />
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-pulse text-stone-400">
                        <span className="text-xs uppercase tracking-widest font-bold mb-2">Desliza para descubrir</span>
                        <ChevronUp className="w-6 h-6" />
                    </div>
                </div>

                {/* 9. El Clímax y la Revelación */}
                <div className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center p-6 text-center bg-stone-50 relative overflow-hidden">
                    {/* Elementos decorativos sutiles en el fondo */}
                    <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-amber-100/50 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-rose-100/30 to-transparent pointer-events-none" />
                    
                    {!hasWatchedVideo ? (
                        <div className="z-10 max-w-2xl flex flex-col items-center animate-in fade-in duration-700">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-bold tracking-widest uppercase mb-8 shadow-sm">
                                ✨ La Gran Revelación
                            </span>
                            
                            <h2 className="text-4xl sm:text-6xl font-black text-stone-800 mb-6 tracking-tight leading-tight">
                                El secreto mejor guardado...
                            </h2>
                            <p className="text-xl sm:text-2xl text-stone-500 font-serif italic mb-10 max-w-md">
                                Tenemos algo muy especial que queremos compartir con todos ustedes.
                            </p>

                            <button 
                                onClick={handleRevealClick}
                                className="relative group overflow-hidden rounded-full bg-stone-900 text-white px-10 py-5 font-bold text-xl sm:text-2xl shadow-2xl transition-all hover:scale-105 active:scale-95"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] animate-gradient" />
                                <span className="relative flex items-center gap-3">
                                    <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                                    ¿Quieres saber qué es?
                                </span>
                            </button>
                        </div>
                    ) : (
                        <div className="z-10 max-w-2xl flex flex-col items-center animate-in fade-in duration-700">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-bold tracking-widest uppercase mb-8 shadow-sm">
                                🍼 La Gran Noticia
                            </span>
                            
                            <h2 className="text-4xl sm:text-6xl font-black text-stone-800 mb-4 tracking-tight">
                                Nacimiento del bebé
                            </h2>
                            <h3 className="text-2xl sm:text-3xl font-serif italic text-stone-500 mb-8">
                                Enero 2027
                            </h3>

                            <div className="mb-10">
                                <CountdownDisplay targetDate="2027-01-15T00:00:00" accentColor="text-rose-500" />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <button 
                                    onClick={() => setShowQuiniela(true)}
                                    className="relative group overflow-hidden rounded-full bg-amber-600 text-white px-8 py-4 font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95"
                                >
                                    <span className="relative flex items-center gap-2">
                                        🎲 Participar en la Quiniela
                                    </span>
                                </button>

                                <button 
                                    onClick={handleRevealClick}
                                    className="rounded-full bg-stone-200 hover:bg-stone-300 text-stone-800 px-6 py-4 font-semibold text-sm transition-all"
                                >
                                    🎥 Volver a ver el video
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>



            {/* Hint Rotate Device (Mobile Only) */}
            {showRotateHint && (
                <div className="fixed inset-0 z-[100] bg-stone-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
                    <div className="animate-spin-slow mb-8">
                        <Smartphone className="w-24 h-24 text-amber-400 rotate-90" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">¡Gira tu teléfono!</h3>
                    <p className="text-stone-300 text-lg mb-10 max-w-sm">
                        Para disfrutar al máximo el video de revelación, por favor gira tu celular horizontalmente.
                    </p>
                    <button 
                        onClick={handleReadyToWatch}
                        className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold px-8 py-4 rounded-full text-lg shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
                    >
                        ▶️ ¡Listo, Ver Video!
                    </button>
                </div>
            )}

            {/* Hint Rotate Back Device (Mobile Only) */}
            {showRotateBackHint && (
                <div className="fixed inset-0 z-[100] bg-stone-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
                    <div className="animate-spin-slow mb-8">
                        <Smartphone className="w-24 h-24 text-amber-400" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">¡Gira tu teléfono a Vertical!</h3>
                    <p className="text-stone-300 text-lg mb-10 max-w-sm">
                        Para participar en la quiniela familiar, por favor acomoda tu celular de vuelta a modo vertical.
                    </p>
                    <button 
                        onClick={handleRotatedBack}
                        className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold px-8 py-4 rounded-full text-lg shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
                    >
                        📲 ¡Listo, ya lo giré!
                    </button>
                </div>
            )}

            {/* Video Modal */}
            <VideoModal 
                isOpen={showVideo} 
                videoUrl={videoUrl}
                onEnded={handleVideoEnded}
                onClose={handleVideoEnded}
            />

            {/* Quiniela Modal */}
            <QuinielaModal 
                isOpen={showQuiniela}
                onClose={() => setShowQuiniela(false)}
            />

            {/* Global style for noise */}
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                .bg-noise {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    background-repeat: repeat;
                    background-size: 150px;
                }
            `}</style>
        </div>
    );
}
