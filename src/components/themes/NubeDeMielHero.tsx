import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2 } from 'lucide-react';
import { getHeroImageStyle } from '../../lib/heroImagePosition';
import './NubeDeMiel.css';

/**
 * Nube de Miel — portada editorial tierna para baby shower / bautizo:
 * azul marino, azul cielo, crema y miel. Capítulo numerado, título serif con
 * palabra de acento en itálica, ilustraciones propias (borreguito en una nube,
 * luna, estrellas y abejita) y cuenta regresiva en tarjeta.
 *
 * Solo dibuja la PORTADA (módulo `hero`, que incluye la cuenta regresiva).
 * El resto de los módulos se visten con NubeDeMiel.css bajo `.theme-nube-de-miel`.
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

/** Borreguito dormido sobre una nube, con luna y estrellas (ilustración original). */
export function NubeLambIllustration({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 320 240" aria-hidden="true">
            <defs>
                <radialGradient id="nm-moon" cx="40%" cy="35%" r="70%">
                    <stop offset="0" stopColor="#fff6d8" />
                    <stop offset="1" stopColor="#f1d58b" />
                </radialGradient>
                <linearGradient id="nm-cloud" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="1" stopColor="#dfeaf6" />
                </linearGradient>
            </defs>
            {/* luna */}
            <path d="M250 34 a34 34 0 1 0 30 50 a28 28 0 1 1 -30 -50Z" fill="url(#nm-moon)" />
            {/* estrellas */}
            {[[60, 40, 1], [96, 22, .7], [214, 104, .8], [292, 128, .6], [30, 96, .6]].map(([x, y, s], i) => (
                <path key={i} d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2Z" fill="#e8c46a" transform={`translate(${x} ${y}) scale(${s})`} />
            ))}
            {/* nube */}
            <path d="M48 196 C30 196 22 176 38 166 C34 144 62 134 76 148 C84 124 118 120 130 140 C146 118 186 122 192 150 C212 140 238 152 234 174 C252 176 256 196 238 200 Z" fill="url(#nm-cloud)" stroke="#c9d9ea" strokeWidth="2" />
            {/* borreguito */}
            <g transform="translate(96 108)">
                {/* lana */}
                <g fill="#fffdf7" stroke="#d9cfbd" strokeWidth="1.6">
                    <circle cx="30" cy="36" r="16" /><circle cx="50" cy="28" r="17" /><circle cx="72" cy="30" r="16" />
                    <circle cx="88" cy="40" r="14" /><circle cx="20" cy="50" r="13" /><circle cx="60" cy="48" r="20" />
                    <circle cx="84" cy="54" r="13" />
                </g>
                {/* cabeza */}
                <ellipse cx="18" cy="52" rx="17" ry="14" fill="#f6e2cf" stroke="#d6bda4" strokeWidth="1.6" />
                <path d="M6 46 c-8 -2 -12 4 -10 9 c4 1 8 -2 10 -5Z" fill="#f0cdb5" stroke="#d6bda4" strokeWidth="1.2" />
                <circle cx="22" cy="40" r="8" fill="#fffdf7" stroke="#d9cfbd" strokeWidth="1.4" />
                {/* ojitos cerrados */}
                <path d="M12 52 q3 3 6 0 M22 52 q3 3 6 0" stroke="#4a3a30" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <circle cx="10" cy="58" r="2.6" fill="#f4b7a8" opacity=".7" />
                <circle cx="30" cy="58" r="2.6" fill="#f4b7a8" opacity=".7" />
                {/* gorrito de dormir */}
                <path d="M10 36 C14 18 36 12 46 20 C40 24 34 30 32 38Z" fill="#9cc0e3" stroke="#6f97c0" strokeWidth="1.4" />
                <circle cx="48" cy="19" r="4" fill="#f1d58b" />
            </g>
            {/* z z */}
            <text x="70" y="104" fontFamily="Georgia, serif" fontStyle="italic" fontSize="16" fill="#7c9cc1">z</text>
            <text x="58" y="88" fontFamily="Georgia, serif" fontStyle="italic" fontSize="12" fill="#9cb5d2">z</text>
        </svg>
    );
}

/** Abejita (ilustración original). */
export function NubeBee({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 60 50" aria-hidden="true">
            <ellipse cx="22" cy="14" rx="10" ry="8" fill="#ffffff" stroke="#b9cfe5" strokeWidth="1.4" opacity=".95" />
            <ellipse cx="36" cy="12" rx="10" ry="8" fill="#ffffff" stroke="#b9cfe5" strokeWidth="1.4" opacity=".95" />
            <ellipse cx="30" cy="30" rx="16" ry="12" fill="#f2c94c" stroke="#b78a1c" strokeWidth="1.4" />
            <path d="M24 19 v22 M32 18 v24" stroke="#3b2f22" strokeWidth="4" />
            <circle cx="45" cy="28" r="7" fill="#3b2f22" />
            <circle cx="47" cy="26" r="1.4" fill="#fff" />
            <path d="M14 30 l-6 2" stroke="#3b2f22" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export default function NubeDeMielHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setShown(true), 120);
        return () => clearTimeout(t);
    }, []);

    const eventDate = event?.date_time ? new Date(event.date_time) : null;
    const validDate = eventDate && !isNaN(eventDate.getTime());
    const title: string = event?.title || '';
    const words = title.trim().split(/\s+/);
    const first = words[0] || '';
    const rest = words.slice(1).join(' ');
    const city = event?.venue_address || '';
    const showCountdown = cfg?.showCountdown !== false && cfg?.show_countdown !== false && countdown
        && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0);

    return (
        <section id="hero" className={`nm-hero ${shown ? 'is-shown' : ''}`}>
            <div className="nm-hero-top">
                <p className="nm-chapter">01 — El principio de nuestra historia</p>
                <p className="nm-italic-gold">{labels?.tagline || 'Hay un sueño en camino…'}</p>
                <h1 className="nm-name">
                    {first}
                    {rest && <em>{rest}</em>}
                </h1>
                {validDate && (
                    <p className="nm-when">
                        {format(eventDate!, "EEEE d 'de' MMMM · h:mm a", { locale: es })}
                    </p>
                )}
                {city && <p className="nm-city">{city}</p>}

                <NubeLambIllustration className="nm-lamb" />
                <NubeBee className="nm-bee nm-bee-1" />
                <NubeBee className="nm-bee nm-bee-2" />

                <button type="button" className="nm-btn-light" onClick={() => scrollToSection('rsvp')}>
                    Confirmar asistencia <span aria-hidden="true">→</span>
                </button>
            </div>

            {/* Curva hacia la sección clara */}
            <svg className="nm-wave" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 0 H400 V12 C300 44 100 44 0 12Z" fill="#0f2a4a" />
            </svg>

            <div className="nm-hero-bottom">
                {heroImageUrl && (
                    <div
                        className={`nm-photo ${onEditHero ? 'is-editable' : ''}`}
                        onClick={onEditHero}
                        title={onEditHero ? 'Haz clic para cambiar foto de portada' : undefined}
                    >
                        <img src={heroImageUrl} alt="" style={getHeroImageStyle(cfg)} />
                        {onEditHero && (
                            <span className="nm-edit"><Edit2 className="h-4 w-4" /> Cambiar foto</span>
                        )}
                        <p className="nm-photo-caption">Con amor, mientras esperamos tu llegada</p>
                    </div>
                )}

                {showCountdown && (
                    <div className="nm-count-wrap">
                        <p className="nm-chapter nm-chapter-dark">Save the date</p>
                        <h2 className="nm-title">La magia está <em>por llegar.</em></h2>
                        <div className="nm-count" aria-label="Cuenta regresiva">
                            {[
                                { v: countdown.days, l: 'Días' },
                                { v: countdown.hours, l: 'Horas' },
                                { v: countdown.minutes, l: 'Minutos' },
                                { v: countdown.seconds, l: 'Segundos' },
                            ].map((it) => (
                                <div key={it.l}><b>{pad(it.v)}</b><small>{it.l}</small></div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
