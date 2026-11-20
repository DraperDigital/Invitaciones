import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2 } from 'lucide-react';
import { getHeroImageStyle } from '../../lib/heroImagePosition';
import './AnturioVino.css';

/**
 * Anturio Vino — portada estilo collage "flat lay" en vino, papel y oro:
 * marco en arco vino con la foto, tarjeta de papel rasgado con nombres,
 * fecha y cuenta regresiva, sello de cera dorado y anturios.
 *
 * Solo dibuja la PORTADA (módulo `hero`, que incluye la cuenta regresiva).
 * El resto de los módulos se visten con AnturioVino.css bajo `.theme-anturio-vino`.
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
    const parts = title.split('&').map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}&${parts[1][0]}`;
    return (title.trim()[0] || '').toUpperCase();
}

/** Definiciones SVG compartidas por la portada y el CSS (filtro de papel y anturio). */
export function AnturioVinoDefs() {
    return (
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
            <defs>
                <filter id="av-deckle" x="-4%" y="-4%" width="108%" height="108%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={4} seed={7} />
                    <feDisplacementMap in="SourceGraphic" scale={9} xChannelSelector="R" yChannelSelector="G" />
                </filter>
                <filter id="av-deckle-s" x="-10%" y="-10%" width="120%" height="120%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={2} seed={2} />
                    <feDisplacementMap in="SourceGraphic" scale={6} xChannelSelector="R" yChannelSelector="G" />
                </filter>
                <radialGradient id="av-ag" cx="40%" cy="35%" r="75%">
                    <stop offset="0" stopColor="#7d2536" />
                    <stop offset=".55" stopColor="#4a0f1d" />
                    <stop offset="1" stopColor="#22050c" />
                </radialGradient>
                <linearGradient id="av-sp" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#efe3b0" />
                    <stop offset="1" stopColor="#c9b06a" />
                </linearGradient>
                <symbol id="av-anthurium" viewBox="0 0 120 160">
                    <path d="M60 18 C30 -6 -4 22 8 58 C18 88 46 104 60 128 C74 104 102 88 112 58 C124 22 90 -6 60 18Z" fill="url(#av-ag)" />
                    <path d="M60 22 C58 50 60 80 60 124" stroke="#2a0710" strokeWidth="1.4" fill="none" opacity=".6" />
                    <path d="M60 30 C40 40 30 60 32 82 M60 30 C80 40 90 60 88 82" stroke="#9a3a4c" strokeWidth=".8" fill="none" opacity=".45" />
                    <path d="M58 28 C54 10 62 -2 70 -8" stroke="url(#av-sp)" strokeWidth="5" strokeLinecap="round" fill="none" />
                    <path d="M60 126 C62 140 58 150 54 160" stroke="#3a0b16" strokeWidth="3" fill="none" />
                </symbol>
            </defs>
        </svg>
    );
}

export default function AnturioVinoHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setShown(true), 150);
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
        <section id="hero" className={`av-hero ${shown ? 'is-shown' : ''}`}>
            <AnturioVinoDefs />

            {/* Cartas manuscritas de fondo (decorativas) */}
            <div className="av-letters" aria-hidden="true">
                <p className="av-letter av-l1">Querida mía, desde el primer día supe que esta historia sería distinta; los domingos en la plaza, las cartas que nunca enviamos y aquella tarde de lluvia…</p>
                <p className="av-letter av-l2">Guardo cada palabra tuya como quien guarda una flor entre las páginas de un libro. Prometo seguir escribiéndote aunque vivamos en la misma casa…</p>
            </div>

            <div className="av-hero-inner">
                {/* Marco en arco con la foto */}
                <div
                    className={`av-arch ${onEditHero ? 'is-editable' : ''}`}
                    onClick={onEditHero}
                    title={onEditHero ? 'Haz clic para cambiar foto de portada' : undefined}
                >
                    <div className="av-arch-inner">
                        {heroImageUrl ? (
                            <img src={heroImageUrl} alt="" style={getHeroImageStyle(cfg)} />
                        ) : (
                            <div className="av-arch-empty" />
                        )}
                        {onEditHero && (
                            <span className="av-edit"><Edit2 className="h-4 w-4" /> Cambiar foto</span>
                        )}
                    </div>
                </div>

                <div className="av-seal av-hero-seal" aria-hidden="true"><span>{initials(title)}</span></div>

                {/* Tarjeta de papel */}
                <div className="av-card">
                    <p className="av-kicker">{labels?.tagline || 'Nos casamos'}</p>
                    <h1 className="av-names">
                        {nameA}
                        {nameB && <> <span className="av-amp">&amp;</span> {nameB}</>}
                    </h1>
                    <div className="av-rule" />
                    {validDate && (
                        <>
                            <p className="av-date">{format(eventDate!, "EEEE d 'de' MMMM", { locale: es })}</p>
                            <p className="av-year">{format(eventDate!, 'yyyy')}</p>
                        </>
                    )}
                    {city && <p className="av-city">{city}</p>}

                    {showCountdown && (
                        <div className="av-count" aria-label="Cuenta regresiva">
                            <p className="av-count-label">Solo faltan</p>
                            <div className="av-count-grid">
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

                    <button type="button" className="av-btn" onClick={() => scrollToSection('rsvp')}>
                        Confirmar asistencia
                    </button>
                </div>

                <svg className="av-flower av-flower-1" viewBox="0 0 120 160" aria-hidden="true"><use href="#av-anthurium" /></svg>
                <svg className="av-flower av-flower-2" viewBox="0 0 120 160" aria-hidden="true"><use href="#av-anthurium" /></svg>

                <p className="av-scroll">Desliza<i /></p>
            </div>
        </section>
    );
}
