import { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, X, RotateCw } from 'lucide-react';

interface VideoModalProps {
    isOpen: boolean;
    videoUrl: string;
    onEnded: () => void;
    onClose: () => void;
}

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: any;
    }
}

const extractYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const extractStreamableId = (url: string) => {
    if (!url) return null;
    const match = url.match(/streamable\.com\/(?:e\/)?([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
};

export default function VideoModal({ isOpen, videoUrl, onEnded, onClose }: VideoModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [showUnmuteHint, setShowUnmuteHint] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [rotation, setRotation] = useState<number>(0);

    const youtubeId = extractYouTubeId(videoUrl);
    const streamableId = extractStreamableId(videoUrl);

    useEffect(() => {
        if (!isOpen) return;

        setHasError(false);
        const isMobilePortrait = window.innerWidth < 768 && window.innerHeight > window.innerWidth;
        setRotation(isMobilePortrait ? 90 : 0);

        if (!youtubeId && !streamableId && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.volume = 1.0;
            videoRef.current.muted = false;
            setIsMuted(false);
            setShowUnmuteHint(false);

            videoRef.current.play()
                .then(() => {
                    if (videoRef.current) {
                        if (videoRef.current.requestFullscreen) {
                            videoRef.current.requestFullscreen().catch(() => {});
                        } else if ((videoRef.current as any).webkitEnterFullscreen) {
                            (videoRef.current as any).webkitEnterFullscreen();
                        }
                    }
                })
                .catch(e => {
                    console.warn("Unmuted play blocked by browser, falling back to muted:", e);
                    if (videoRef.current) {
                        videoRef.current.muted = true;
                        setIsMuted(true);
                        setShowUnmuteHint(true);
                        videoRef.current.play().catch(err => console.error("Muted play failed:", err));
                    }
                });
        }
    }, [isOpen, videoUrl, youtubeId, streamableId]);

    // Listen to Streamable postMessage ended event
    useEffect(() => {
        if (!isOpen || !streamableId) return;

        const handleMessage = (event: MessageEvent) => {
            try {
                const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                if (data && (data.event === 'ended' || data.type === 'ended')) {
                    onEnded();
                }
            } catch {
                // Ignore non-JSON messages
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [isOpen, streamableId, onEnded]);

    // Listen to YouTube API ended event
    useEffect(() => {
        if (!isOpen || !youtubeId) return;

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        let player: any = null;

        const initPlayer = () => {
            if (window.YT && window.YT.Player) {
                player = new window.YT.Player('youtube-player-iframe', {
                    events: {
                        onStateChange: (event: any) => {
                            if (event.data === 0) {
                                onEnded();
                            }
                        }
                    }
                });
            }
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            if (player && player.destroy) {
                player.destroy();
            }
        };
    }, [isOpen, youtubeId, onEnded]);

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
                        Verifica la dirección del video: <br/>
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
                    {streamableId ? (
                        <iframe
                            src={`https://streamable.com/e/${streamableId}?autoplay=1`}
                            className="transition-transform duration-300 ease-in-out border-0"
                            title="La Gran Revelación"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                            style={{
                                transform: `rotate(${rotation}deg)`,
                                width: isRotated ? '100vh' : '100%',
                                height: isRotated ? '100vw' : '100%',
                                maxWidth: isRotated ? '100vh' : '100%',
                                maxHeight: isRotated ? '100vw' : '100%',
                            }}
                        />
                    ) : youtubeId ? (
                        <iframe
                            id="youtube-player-iframe"
                            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1`}
                            className="transition-transform duration-300 ease-in-out border-0"
                            title="La Gran Revelación"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            style={{
                                transform: `rotate(${rotation}deg)`,
                                width: isRotated ? '100vh' : '100%',
                                height: isRotated ? '100vw' : '100%',
                                maxWidth: isRotated ? '100vh' : '100%',
                                maxHeight: isRotated ? '100vw' : '100%',
                            }}
                        />
                    ) : (
                        <>
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
                                    <span className="text-white font-bold text-xl sm:text-2xl drop-shadow-md text-center px-4">
                                        Toca para activar el sonido y sube tu volumen 🔊
                                    </span>
                                </button>
                            )}

                            {/* Control flotante de volumen */}
                            {!showUnmuteHint && (
                                <button 
                                    onClick={handleToggleMute}
                                    className="absolute bottom-10 right-6 p-4 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-md text-white transition-all z-20"
                                >
                                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
