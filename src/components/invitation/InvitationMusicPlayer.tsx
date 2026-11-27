import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface InvitationMusicPlayerProps {
    musicUrl?: string | null;
    accentColor?: string;
}

export default function InvitationMusicPlayer({ musicUrl, accentColor = '#1B2E1D' }: InvitationMusicPlayerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [userPaused, setUserPaused] = useState(false);

    useEffect(() => {
        if (!musicUrl) return;

        const audio = audioRef.current;
        if (!audio) return;

        // Try playing audio (handles browser autoplay policies)
        const tryPlay = () => {
            if (!audio || userPaused) return;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                        cleanupListeners();
                    })
                    .catch(() => {
                        // Autoplay blocked by browser policy, wait for first user gesture
                    });
            }
        };

        const handleUserGesture = () => {
            if (!userPaused) {
                tryPlay();
            }
        };

        const cleanupListeners = () => {
            window.removeEventListener('pointerdown', handleUserGesture);
            window.removeEventListener('click', handleUserGesture);
            window.removeEventListener('touchstart', handleUserGesture);
            window.removeEventListener('keydown', handleUserGesture);
        };

        // Attempt immediate playback
        tryPlay();

        // Listen for first interaction
        window.addEventListener('pointerdown', handleUserGesture, { passive: true });
        window.addEventListener('click', handleUserGesture, { passive: true });
        window.addEventListener('touchstart', handleUserGesture, { passive: true });
        window.addEventListener('keydown', handleUserGesture, { passive: true });

        return () => {
            cleanupListeners();
            if (audio) {
                audio.pause();
            }
        };
    }, [musicUrl, userPaused]);

    if (!musicUrl) return null;

    const togglePlayback = (e: React.MouseEvent) => {
        e.stopPropagation();
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
            setUserPaused(true);
        } else {
            setUserPaused(false);
            audio.play()
                .then(() => setIsPlaying(true))
                .catch((err) => console.error('Error al reproducir audio:', err));
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        const audio = audioRef.current;
        if (!audio) return;

        audio.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    return (
        <div className="fixed top-5 right-5 sm:top-6 sm:right-6 z-[70] flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-500">
            <audio
                ref={audioRef}
                src={musicUrl}
                loop
                preload="auto"
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            <button
                type="button"
                onClick={togglePlayback}
                aria-label={isPlaying ? 'Pausar música de fondo' : 'Reproducir música de fondo'}
                title={isPlaying ? 'Pausar música' : 'Reproducir música'}
                className="group relative h-11 w-11 sm:h-12 sm:w-12 rounded-full flex items-center justify-center shadow-xl border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                    backgroundColor: isPlaying ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.85)',
                    borderColor: isPlaying ? accentColor : 'rgba(0,0,0,0.1)'
                }}
            >
                {/* Visual ripple ring when playing */}
                {isPlaying && (
                    <span
                        className="absolute inset-0 rounded-full animate-ping opacity-25 pointer-events-none"
                        style={{ backgroundColor: accentColor }}
                    />
                )}

                {/* Animated music note icon */}
                <div
                    className={`relative flex items-center justify-center transition-transform duration-700 ${isPlaying ? 'rotate-12' : ''}`}
                    style={{ color: accentColor }}
                >
                    {isPlaying ? (
                        <div className="flex items-center gap-0.5">
                            <span className="w-0.5 h-3.5 rounded-full animate-[bounce_1s_infinite_100ms]" style={{ backgroundColor: accentColor }} />
                            <span className="w-0.5 h-5 rounded-full animate-[bounce_1s_infinite_300ms]" style={{ backgroundColor: accentColor }} />
                            <span className="w-0.5 h-2.5 rounded-full animate-[bounce_1s_infinite_200ms]" style={{ backgroundColor: accentColor }} />
                            <Music className="h-4 w-4 ml-0.5" />
                        </div>
                    ) : (
                        <div className="relative">
                            <Music className="h-5 w-5 opacity-60" />
                            <span className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-400 rotate-45 -translate-y-1/2" />
                        </div>
                    )}
                </div>

                {/* Mini secondary mute button indicator */}
                {isPlaying && (
                    <span
                        onClick={toggleMute}
                        title={isMuted ? 'Activar sonido' : 'Silenciar'}
                        className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white shadow border border-stone-200 flex items-center justify-center text-[10px] text-stone-600 hover:text-stone-900"
                    >
                        {isMuted ? <VolumeX className="h-3 w-3 text-red-500" /> : <Volume2 className="h-3 w-3" />}
                    </span>
                )}
            </button>
        </div>
    );
}
