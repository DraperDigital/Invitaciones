import { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, X } from 'lucide-react';

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

    useEffect(() => {
        if (isOpen && videoRef.current) {
            videoRef.current.currentTime = 0;
            setIsMuted(true);
            setShowUnmuteHint(true);
            videoRef.current.play().catch(e => console.error("Auto-play failed:", e));
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

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in duration-500">
            {/* Controles superiores */}
            <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
                <button 
                    onClick={onClose}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white transition-all"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="text-white/60 text-sm font-medium tracking-widest uppercase">
                    La Gran Revelación
                </div>
            </div>

            <video 
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover sm:object-contain"
                playsInline
                muted={isMuted}
                onEnded={onEnded}
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
                    className="absolute bottom-10 right-6 p-4 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-md text-white transition-all z-10"
                >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
            )}
        </div>
    );
}
