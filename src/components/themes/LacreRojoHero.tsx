import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2 } from 'lucide-react';
import { getHeroImageStyle } from '../../lib/heroImagePosition';
import './LacreRojo.css';

/**
 * Lacre Rojo — portada editorial en blanco y negro con un solo acento:
 * el sello de lacre rojo. "Nuestra boda" en serif didona, foto grande,
 * sello sobre el borde de la foto, nombres en caligrafía, monograma,
 * fecha en grotesca extendida y cuenta regresiva.
 *
 * Solo dibuja la PORTADA (módulo `hero`, que incluye la cuenta regresiva).
 * El resto de los módulos se visten con LacreRojo.css bajo `.theme-lacre-rojo`.
 */

interface Props {
    event: any;
    cfg: any;
    countdown: any;
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
    onEditHero?: () => void;
}

const pad = (n: number) => String(Math.max(0, n || 0)).padStart(2, '0');

function initials(title: string) {
    const parts = title.split(/&| y /i).map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) return { a: parts[0][0], b: parts[1][0] };
    return { a: (title.trim()[0] || '').toUpperCase(), b: '' };
}

/** Sello de lacre rojo con flor en relieve (SVG puro). */
export function LacreSeal({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
            <defs>
                <radialGradient id="lr-wax" cx="38%" cy="32%" r="75%">
                    <stop offset="0" stopColor="#b53a48" />
                    <stop offset=".45" stopColor="#8a1a28" />
                    <stop offset="1" stopColor="#4c0812" />
                </radialGradient>
                <radialGradient id="lr-pool" cx="50%" cy="50%" r="50%">
                    <stop offset=".78" stopColor="#7b1420" />
                    <stop offset="1" stopColor="#5a0c17" />
                </radialGradient>
                <filter id="lr-rough" x="-10%" y="-10%" width="120%" height="120%">
                    <feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves={2} seed={4} />
                    <feDisplacementMap in="SourceGraphic" scale={5} xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </defs>
            <g filter="url(#lr-rough)">
                <circle cx="50" cy="50" r="46" fill="url(#lr-pool)" />
                <circle cx="50" cy="50" r="36" fill="url(#lr-wax)" />
            </g>
            <circle cx="50" cy="50" r="36" fill="none" stroke="#3d050d" strokeOpacity=".35" strokeWidth="1.4" />
            {/* flor en relieve */}
            <g transform="translate(50 50)">
                {[0, 72, 144, 216, 288].map((r) => (
                    <path
                        key={r}
                        d="M0 -4 C-9 -10 -10 -24 0 -27 C10 -24 9 -10 0 -4Z"
                        fill="#7b1420"
                        stroke="#3d050d"
                        strokeOpacity=".55"
                        strokeWidth="1"
                        transform={`rotate(${r})`}
                    />
                ))}
                {[0, 72, 144, 216, 288].map((r) => (
                    <path key={`h${r}`} d="M-2 -8 C-5 -14 -4 -20 0 -23" stroke="#d4626f" strokeOpacity=".55" strokeWidth=".9" fill="none" transform={`rotate(${r})`} />
                ))}
                <circle r="5" fill="#5e0d18" />
                <circle r="2.2" cx="-1" cy="-1" fill="#c4505d" opacity=".7" />
            </g>
            <ellipse cx="34" cy="28" rx="10" ry="4" fill="#fff" opacity=".18" transform="rotate(-28 34 28)" />
        </svg>
    );
}

export default function LacreRojoHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setShown(true), 120);
        return () => clearTimeout(t);
    }, []);

    const eventDate = event?.date_time ? new Date(event.date_time) : null;
    const validDate = eventDate && !isNaN(eventDate.getTime());
    const title: string = event?.title || '';
    const city = event?.venue_address || '';
    const ini = initials(title);
    const showCountdown = cfg?.showCountdown !== false && cfg?.show_countdown !== false && countdown
        && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0);

    return (
        <section id="hero" className={`lr-hero ${shown ? 'is-shown' : ''}`}>
            <p className="lr-kicker">{labels?.tagline || 'Nuestra boda'}</p>

            <div className="lr-photo-wrap">
                {heroImageUrl && (
                    <div
                        className={`lr-photo ${onEditHero ? 'is-editable' : ''}`}
                        onClick={onEditHero}
                        title={onEditHero ? 'Haz clic para cambiar foto de portada' : undefined}
                    >
                        <img src={heroImageUrl} alt="" style={getHeroImageStyle(cfg)} />
                        {onEditHero && (
                            <span className="lr-edit"><Edit2 className="h-4 w-4" /> Cambiar foto</span>
                        )}
                    </div>
                )}
                <LacreSeal className="lr-seal" />
            </div>

            <h1 className="lr-names">{title}</h1>
            {city && <p className="lr-city">{city}</p>}

            <div className="lr-block">
                <p className="lr-monogram">{ini.a}{ini.b && <><span>y</span>{ini.b}</>}</p>
                {validDate && (
                    <p className="lr-date">{format(eventDate!, 'dd MMM yy', { locale: es }).replace('.', '')}</p>
                )}
            </div>

            {showCountdown && (
                <div className="lr-count" aria-label="Cuenta regresiva">
                    <p className="lr-brush">Solo faltan</p>
                    <div className="lr-count-grid">
                        {[
                            { v: countdown.days, l: 'Días' },
                            { v: countdown.hours, l: 'Horas' },
                            { v: countdown.minutes, l: 'Minutos' },
                            { v: countdown.seconds, l: 'Segundos' },
                        ].map((it, i) => (
                            <div key={it.l} className="lr-count-cell">
                                <b>{pad(it.v)}</b>
                                <small>{it.l}</small>
                                {i < 3 && <i aria-hidden="true">:</i>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button type="button" className="lr-btn" onClick={() => scrollToSection('rsvp')}>
                Confirmar asistencia
            </button>
        </section>
    );
}
