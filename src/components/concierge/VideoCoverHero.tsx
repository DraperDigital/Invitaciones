import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import './ConciergeVideo.css';

/**
 * Portada en video (exclusiva del plan Concierge).
 *
 * Reproduce un video vertical en bucle, mudo, como fondo de la portada,
 * con nombres, fecha y cuenta regresiva encima. Sirve con cualquier plantilla:
 * la tipografía sale de la plantilla (font-serif) y los colores de sus variables.
 *
 * En escritorio la portada se ve como una columna del ancho de un celular,
 * centrada, con el mismo video desenfocado y oscurecido a los lados.
 *
 * cfg.hero_video_url   → video MP4 vertical (≈ 720×1280, 6–10 s, 2–3 MB)
 * cfg.hero_video_poster → imagen fija mientras carga (opcional; si no, se usa la foto de portada)
 */

interface Props {
    event: any;
    cfg: any;
    countdown: any;
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
}

const pad = (n: number) => String(Math.max(0, n || 0)).padStart(2, '0');

export default function VideoCoverHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection }: Props) {
    const videoUrl: string = cfg?.hero_video_url || cfg?.heroVideoUrl || '';
    const poster: string | undefined = cfg?.hero_video_poster || cfg?.heroVideoPoster || heroImageUrl || undefined;
    const mainRef = useRef<HTMLVideoElement>(null);

    // Algunos navegadores móviles no arrancan el autoplay hasta que el video está en pantalla
    useEffect(() => {
        const v = mainRef.current;
        if (!v) return;
        const tryPlay = () => { v.play().catch(() => {}); };
        tryPlay();
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => (e.isIntersecting ? tryPlay() : v.pause()));
        }, { threshold: 0.15 });
        io.observe(v);
        return () => io.disconnect();
    }, [videoUrl]);

    const eventDate = event?.date_time ? new Date(event.date_time) : null;
    const validDate = eventDate && !isNaN(eventDate.getTime());
    const title: string = event?.title || '';
    const parts = title.split(/\s*&\s*|\s+y\s+/i).map((p) => p.trim()).filter(Boolean);
    const showCountdown = cfg?.showCountdown !== false && cfg?.show_countdown !== false && countdown
        && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0);

    return (
        <section id="hero" className="cv-hero">
            {/* Fondo de escritorio: el mismo video desenfocado */}
            <div className="cv-hero-backdrop" aria-hidden="true">
                {poster && <img src={poster} alt="" />}
            </div>

            <div className="cv-hero-column">
                <video
                    ref={mainRef}
                    className="cv-hero-video"
                    src={videoUrl}
                    poster={poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                />
                <div className="cv-hero-shade" aria-hidden="true" />

                <div className="cv-hero-text">
                    <p className="cv-hero-kicker">{labels?.tagline || 'Nuestra boda'}</p>
                    {validDate && <p className="cv-hero-date">{format(eventDate!, 'dd · MM · yy', { locale: es })}</p>}
                    <h1 className="cv-hero-names font-serif">
                        {parts.length >= 2 ? (
                            <>
                                <span>{parts[0]}</span>
                                <i>&amp;</i>
                                <span>{parts.slice(1).join(' ')}</span>
                            </>
                        ) : title}
                    </h1>
                </div>

                <div className="cv-hero-bottom">
                    {showCountdown && (
                        <div className="cv-hero-count" aria-label="Cuenta regresiva">
                            {[
                                { v: countdown.days, l: 'Días' },
                                { v: countdown.hours, l: 'Horas' },
                                { v: countdown.minutes, l: 'Min' },
                                { v: countdown.seconds, l: 'Seg' },
                            ].map((it) => (
                                <div key={it.l}><b>{pad(it.v)}</b><small>{it.l}</small></div>
                            ))}
                        </div>
                    )}
                    <button type="button" className="cv-hero-scroll" onClick={() => scrollToSection('message')}>
                        Desliza<i aria-hidden="true" />
                    </button>
                </div>
            </div>
        </section>
    );
}
