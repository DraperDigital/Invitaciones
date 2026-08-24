import { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, X, RotateCw } from 'lucide-react';

interface VideoModalProps {
    isOpen: boolean;
    videoUrl: string;
    onEnded: () => void;
    onClose: () => void;
}

export default function VideoModal({ isOpen, videoUrl, onEnded, onClose }: VideoModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [showUnmuteHint, setShowUnmuteHint] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [rotation, setRotation] = useState<number>(0);

    useEffect(() => {
        if (isOpen && videoRef.current) {
            setHasError(false);
            videoRef.current.currentTime = 0;
            setIsMuted(true);
            setShowUnmuteHint(true);

            // Default to 90deg rotation on mobile portrait so horizontal video fits vertically
            const isMobilePortrait = window.innerWidth < 768 && window.innerHeight > window.innerWidth;
            setRotation(isMobilePortrait ? 90 : 0);

            videoRef.current.play()
                .then(() => {
                    // Request native full screen on devices that support it
                    if (videoRef.current) {
                        if (videoRef.current.requestFullscreen) {
                            videoRef.current.requestFullscreen().catch(() => {});
                        } else if ((videoRef.current as any).webkitEnterFullscreen) {
                            (videoRef.current as any).webkitEnterFullscreen();
                        }
                    }
                })
                .catch(e => console.error("Auto-play failed:", e));
        }
    }, [isOpen, videoUrl]);

    if (!isOpen) return null;

    const handleToggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
            setShowUnmuteHint(false);
        }
    };

    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    const handleVideoError = () => {
        console.error("Error al cargar el video desde:", videoUrl);
        setHasError(true);
    };

    const isRotated = rotation === 90 || rotation === 270;

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in duration-500 overflow-hidden">
            {/* Controles superiores */}
            <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-30 bg-gradient-to-b from-black/80 to-transparent">
                <button 
                    onClick={onClose}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white transition-all"
                    title="Cerrar"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-white/60 text-xs sm:text-sm font-medium tracking-widest uppercase">
                    La Gran Revelación
                </div>

                {/* Botón de girar contenedor */}
                <button 
                    onClick={handleRotate}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white transition-all flex items-center gap-2 text-xs font-semibold"
                    title="Girar video"
                >
                    <RotateCw className="w-5 h-5" />
                    <span className="hidden sm:inline">Girar</span>
                </button>
            </div>

            {hasError ? (
                <div className="text-center p-8 max-w-md bg-stone-900/90 rounded-3xl border border-stone-800 text-white z-30">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold mb-2">No se pudo cargar el video</h3>
                    <p className="text-stone-400 text-sm mb-6">
                        Verifica que el archivo esté disponible en la dirección: <br/>
                        <code className="text-amber-400 text-xs break-all bg-black/50 p-2 rounded block mt-2">{videoUrl}</code>
                    </p>
                    <button
                        onClick={onEnded}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl transition-all"
                    >
                        Continuar a la Quiniela ➔
                    </button>
                </div>
            ) : (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    <video 
                        ref={videoRef}
                        src={videoUrl}
                        className="transition-transform duration-300 ease-in-out object-cover"
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            width: isRotated ? '100vh' : '100%',
                            height: isRotated ? '100vw' : '100%',
                            maxWidth: isRotated ? '100vh' : '100%',
                            maxHeight: isRotated ? '100vw' : '100%',
                        }}
                        playsInline
                        muted={isMuted}
                        onEnded={onEnded}
                        onError={handleVideoError}
                    />

                    {/* Hint para activar sonido */}
                    {showUnmuteHint && (
                        <button 
                            onClick={handleToggleMute}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm z-20 group"
                        >
                            <div className="bg-white/20 p-6 rounded-full group-hover:bg-white/30 transition-all mb-4 animate-bounce">
                                <VolumeX className="w-12 h-12 text-white" />
                            </div>
                            <span className="text-white font-bold text-xl drop-shadow-md">
                                Toca para activar el sonido
                            </span>
                        </button>
                    )}

                    {/* Control flotante de volumen (solo si ya se quitó el hint) */}
                    {!showUnmuteHint && (
                        <button 
                            onClick={handleToggleMute}
                            className="absolute bottom-10 right-6 p-4 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-md text-white transition-all z-20"
                        >
                            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
