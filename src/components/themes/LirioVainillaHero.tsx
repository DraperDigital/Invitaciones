import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2 } from 'lucide-react';
import { getHeroImageStyle } from '../../lib/heroImagePosition';
import './LirioVainilla.css';

/**
 * Lirio Vainilla — portada estilo "flat lay" (sobre con forro de lirios,
 * tarjeta en arco, polaroid, ramo y sello de cera).
 *
 * Solo dibuja la PORTADA (módulo `hero`, que también contiene la cuenta
 * regresiva). El resto de los módulos se visten con LirioVainilla.css
 * bajo `.theme-lirio-vainilla`, sin cambiar su estructura.
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

/** Definiciones SVG compartidas (lirio, anturio, hoja y filtro de papel rasgado). */
export function LirioVainillaDefs() {
    return (
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
            <defs>
                <filter id="lv-deckle" x="-4%" y="-4%" width="108%" height="108%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={4} seed={7} />
                    <feDisplacementMap in="SourceGraphic" scale={7} xChannelSelector="R" yChannelSelector="G" />
                </filter>
                <linearGradient id="lv-petal" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset=".7" stopColor="#f4f3e6" />
                    <stop offset="1" stopColor="#d9e0b0" />
                </linearGradient>
                <radialGradient id="lv-anth" cx="40%" cy="35%" r="70%">
                    <stop offset="0" stopColor="#e6edb8" />
                    <stop offset="1" stopColor="#a8bb60" />
                </radialGradient>
                <symbol id="lv-lily" viewBox="-50 -50 100 100">
                    {[0, 60, 120, 180, 240, 300].map((r) => (
                        <path key={r} d="M0 0 C-8 -18 -6 -38 0 -46 C6 -38 8 -18 0 0Z" fill="url(#lv-petal)" stroke="#d6d9bf" strokeWidth=".6" transform={`rotate(${r})`} />
                    ))}
                    <circle r="5" fill="#cfdc94" />
                    <path d="M0 0 L-9 -16 M0 0 L9 -15 M0 0 L-14 4 M0 0 L13 6 M0 0 L2 16" stroke="#a9b56a" strokeWidth="1" />
                    <g fill="#c99a2e">
                        <circle cx="-9" cy="-16" r="2" /><circle cx="9" cy="-15" r="2" /><circle cx="-14" cy="4" r="2" /><circle cx="13" cy="6" r="2" /><circle cx="2" cy="16" r="2" />
                    </g>
                </symbol>
                <symbol id="lv-anthurium" viewBox="0 0 100 110">
                    <path d="M50 14 C26 -6 -2 16 8 46 C16 70 40 82 50 100 C60 82 84 70 92 46 C102 16 74 -6 50 14Z" fill="url(#lv-anth)" />
                    <path d="M50 18 L50 96" stroke="#93a64f" strokeWidth="1" opacity=".6" />
                    <path d="M48 22 C44 8 52 -2 58 -6" stroke="#f1eedb" strokeWidth="5" strokeLinecap="round" fill="none" />
                </symbol>
                <symbol id="lv-leaf" viewBox="0 0 40 100">
                    <path d="M20 100 C4 70 2 30 20 0 C38 30 36 70 20 100Z" fill="#7f9446" />
                    <path d="M20 98 L20 4" stroke="#5d7130" strokeWidth="1" />
                </symbol>
            </defs>
        </svg>
    );
}

function Bouquet({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 160 150" aria-hidden="true">
            <use href="#lv-leaf" x="18" y="40" width="26" height="70" transform="rotate(-40 30 75)" />
            <use href="#lv-leaf" x="110" y="40" width="26" height="70" transform="rotate(40 123 75)" />
            <use href="#lv-anthurium" x="6" y="58" width="56" height="62" transform="rotate(-18 34 89)" />
            <use href="#lv-anthurium" x="96" y="66" width="52" height="58" transform="rotate(20 122 95)" />
            <use href="#lv-lily" x="38" y="10" width="84" height="84" />
            <use href="#lv-lily" x="54" y="64" width="66" height="66" />
            <use href="#lv-lily" x="10" y="20" width="56" height="56" />
        </svg>
    );
}

function Seal({ className }: { className?: string }) {
    return (
        <div className={`lv-seal ${className || ''}`} aria-hidden="true">
            <svg viewBox="-50 -50 100 100"><use href="#lv-lily" x="-50" y="-50" width="100" height="100" /></svg>
        </div>
    );
}

export default function LirioVainillaHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const [opened, setOpened] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setOpened(true), 300);
        return () => clearTimeout(t);
    }, []);

    const eventDate = event?.date_time ? new Date(event.date_time) : null;
    const validDate = eventDate && !isNaN(eventDate.getTime());
    const title: string = event?.title || '';
    const ampIdx = title.indexOf('&');
    const nameA = ampIdx > -1 ? title.slice(0, ampIdx).trim() : title;
    const nameB = ampIdx > -1 ? title.slice(ampIdx + 1).trim() : '';
    const city = event?.venue_address || '';
    const showCountdown = cfg?.showCountdown !== false && cfg?.show_countdown !== false && countdown
        && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0);

    return (
        <section id="hero" className={`lv-hero ${opened ? 'is-open' : ''}`}>
            <LirioVainillaDefs />

            <div className="lv-hero-inner">
                {/* Sobre con forro de lirios */}
                <div className="lv-env">
                    <div className="lv-env-back" />
                    <div className="lv-env-liner">
                        <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                            <rect width="300" height="200" fill="#eef0e2" />
                            <path d="M150 200 C140 150 120 110 90 70 M150 200 C155 140 170 100 205 60 M150 200 C150 150 150 100 150 30" stroke="#7f9446" strokeWidth="2" fill="none" opacity=".7" />
                            {[[60, 40, 70], [115, 5, 70], [170, 35, 72], [20, 100, 64], [210, 95, 66], [105, 75, 80], [-10, 20, 56], [250, 10, 56]].map(([x, y, s], i) => (
                                <use key={i} href="#lv-lily" x={x} y={y} width={s} height={s} />
                            ))}
                        </svg>
                    </div>
                    <div className="lv-env-flap" />
                    <div className="lv-env-front" />
                    <Seal className="lv-env-seal" />
                </div>

                <Bouquet className="lv-bouquet" />

                {/* Tarjeta en arco */}
                <div className="lv-arch lv-paper">
                    <p className="lv-kicker">{labels?.tagline || 'Nos casamos'}</p>
                    <h1 className="lv-names">
                        {nameA}
                        {nameB && <><br /><span className="lv-amp">&amp;</span> {nameB}</>}
                    </h1>
                    {validDate && (
                        <>
                            <p className="lv-date">{format(eventDate!, "d 'de' MMMM", { locale: es })}</p>
                            <p className="lv-year">{format(eventDate!, 'EEEE · yyyy', { locale: es })}</p>
                        </>
                    )}
                    {city && <p className="lv-city">{city}</p>}

                    {showCountdown && (
                        <div className="lv-count" aria-label="Cuenta regresiva">
                            <p className="lv-count-label">Solo faltan</p>
                            <div className="lv-count-grid">
                                {[
                                    { v: countdown.days, l: 'Días' },
                                    { v: countdown.hours, l: 'Horas' },
                                    { v: countdown.minutes, l: 'Min' },
                                    { v: countdown.seconds, l: 'Seg' },
                                ].map((it) => (
                                    <div key={it.l}><b>{pad(it.v)}</b><small>{it.l}</small></div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button type="button" className="lv-btn" onClick={() => scrollToSection('rsvp')}>
                        Confirmar asistencia
                    </button>
                </div>

                {/* Polaroid con la foto de portada */}
                {heroImageUrl && (
                    <div
                        className={`lv-polaroid ${onEditHero ? 'is-editable' : ''}`}
                        onClick={onEditHero}
                        title={onEditHero ? 'Haz clic para cambiar foto de portada' : undefined}
                    >
                        <div className="lv-polaroid-photo">
                            <img src={heroImageUrl} alt="" style={getHeroImageStyle(cfg)} />
                            {onEditHero && (
                                <span className="lv-edit"><Edit2 className="h-4 w-4" /> Cambiar foto</span>
                            )}
                        </div>
                        <p className="lv-polaroid-caption">{title}</p>
                    </div>
                )}

                <p className="lv-scroll">Desliza<i /></p>
            </div>
        </section>
    );
}
