import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './ConciergeVideo.css';

/**
 * Sobre en video (exclusivo del plan Concierge).
 *
 * Muestra el primer cuadro del video (el sobre cerrado). Al tocarlo, el video
 * se reproduce una sola vez (el sobre se abre) y al terminar entra la invitación.
 * Si el video no carga o el navegador bloquea la reproducción, abre igual.
 *
 * cfg.envelope_video_url    → video MP4 vertical (≈ 720×1280, 4–6 s, sin bucle)
 * cfg.envelope_video_poster → imagen del sobre cerrado (opcional; si no, el primer cuadro)
 */

interface Props {
    cfg: any;
    onOpen: () => void;
}

export default function VideoEnvelopeIntro({ cfg, onOpen }: Props) {
    const videoUrl: string = cfg?.envelope_video_url || cfg?.envelopeVideoUrl || '';
    const poster: string | undefined = cfg?.envelope_video_poster || cfg?.envelopeVideoPoster || undefined;
    const ref = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const doneRef = useRef(false);

    const finish = () => {
        if (doneRef.current) return;
        doneRef.current = true;
        setLeaving(true);
        window.setTimeout(onOpen, 650);
    };

    // Red de seguridad: si el video se atora, abrir de todos modos
    useEffect(() => {
        if (!playing) return;
        const max = Math.max(4000, ((ref.current?.duration || 6) + 1.5) * 1000);
        const t = window.setTimeout(finish, max);
        return () => window.clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playing]);

    const handleTap = () => {
        if (playing) return;
        const v = ref.current;
        try { if ('vibrate' in navigator) navigator.vibrate(18); } catch (_) { /* sin vibración */ }
        if (!v) { finish(); return; }
        setPlaying(true);
        v.currentTime = 0;
        v.play().catch(() => finish());
    };

    return (
        <motion.section
            className="cv-env"
            initial={{ opacity: 0 }}
            animate={{ opacity: leaving ? 0 : 1 }}
            transition={{ duration: 0.6 }}
            onClick={handleTap}
            role="button"
            aria-label="Abrir invitación"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTap(); }}
        >
            <div className="cv-hero-backdrop" aria-hidden="true">
                {poster && <img src={poster} alt="" />}
            </div>
            <div className="cv-env-column">
                <video
                    ref={ref}
                    className="cv-env-video"
                    src={`${videoUrl}#t=0.05`}
                    poster={poster}
                    muted
                    playsInline
                    preload="auto"
                    onEnded={finish}
                    onError={finish}
                    aria-hidden="true"
                />
                {!playing && (
                    <p className="cv-env-hint">
                        <i aria-hidden="true" />
                        Toca para abrir
                    </p>
                )}
            </div>
        </motion.section>
    );
}
