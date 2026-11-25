import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2 } from 'lucide-react';
import { getHeroImageStyle } from '../../lib/heroImagePosition';
import './Astronauta.css';

/**
 * Astronauta — cumpleaños infantil espacial en acuarela.
 * Cielo nocturno, Tierra, niño en cohete, arcos azul cielo / blanco hueso
 * con línea punteada y foto en ventanilla de nave.
 *
 * Solo dibuja la PORTADA (módulo `hero`, que incluye la cuenta regresiva).
 * El resto de los módulos se visten con Astronauta.css bajo `.theme-astronauta`.
 * Ilustraciones propias en /images/themes/astronauta/*.webp
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

const A = '/images/themes/astronauta';
const pad = (n: number) => String(Math.max(0, n || 0)).padStart(2, '0');

const STARS: [number, number, number, number][] = [
    // left%, top%, size px, imagen 1-3
    [8, 30, 22, 1], [88, 6, 26, 2], [92, 40, 16, 3], [6, 62, 14, 2], [84, 72, 20, 1], [50, 3, 12, 3],
];

export default function AstronautaHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setShown(true), 120);
        return () => clearTimeout(t);
    }, []);

    const eventDate = event?.date_time ? new Date(event.date_time) : null;
    const validDate = !!eventDate && !isNaN(eventDate.getTime());
    const name: string = cfg?.child_name || cfg?.childName
        || (event?.title || '').replace(/^(cumpleaños|cumple|mi cumpleaños)\s*(de\s*)?/i, '').trim()
        || 'Festejado';
    const age = cfg?.age || cfg?.turning_age;
    const kicker = labels?.tagline && labels.tagline !== 'Cumpleaños' ? labels.tagline : 'Te invito a mi cumpleaños';
    const place = [event?.venue_name, event?.venue_address].filter(Boolean).join(' · ');
    const showCountdown = cfg?.showCountdown !== false && cfg?.show_countdown !== false && countdown
        && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0);

    return (
        <section id="hero" className={`as-hero ${shown ? 'is-shown' : ''}`}>
            {STARS.map(([l, t, s, i], k) => (
                <img key={k} className="as-twinkle" src={`${A}/estrella-${i}.webp`} alt="" aria-hidden="true"
                    style={{ left: `${l}%`, top: `${t}%`, width: s, animationDelay: `${k * 0.45}s` }} />
            ))}
            <img className="as-earth" src={`${A}/tierra.webp`} alt="" aria-hidden="true" />

            <div className="as-hero-grid">
                {/* Arco azul con el nombre */}
                <div className="as-arch as-arch--blue">
                    <img className="as-rider" src={`${A}/nino-cohete.webp`} alt="" aria-hidden="true" />
                    <div className="as-arch-inner">
                        <p className="as-kicker">{kicker}</p>
                        <h1 className="as-name">{name}</h1>
                        {age && <p className="as-age">{age} {Number(age) === 1 ? 'año' : 'años'}</p>}
                    </div>
                </div>

                <div className="as-hero-side">
                    {heroImageUrl && (
                        <div
                            className={`as-porthole ${onEditHero ? 'is-editable' : ''}`}
                            onClick={onEditHero}
                            title={onEditHero ? 'Haz clic para cambiar foto de portada' : undefined}
                        >
                            <img src={heroImageUrl} alt="" style={getHeroImageStyle(cfg)} />
                            {onEditHero && <span className="as-edit"><Edit2 className="h-4 w-4" /> Cambiar foto</span>}
                        </div>
                    )}

                    {/* Arco blanco con la fecha */}
                    {validDate && (
                        <div className="as-arch as-arch--ivory">
                            <div className="as-arch-inner">
                                <p className="as-month">{format(eventDate!, 'MMMM', { locale: es })}</p>
                                <p className="as-day">{format(eventDate!, 'd')}</p>
                                <p className="as-time">{format(eventDate!, "EEEE · h:mm a", { locale: es })}</p>
                                {place && <p className="as-place">{place}</p>}
                                <button type="button" className="as-btn" onClick={() => scrollToSection('rsvp')}>
                                    Confirmar asistencia
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showCountdown && (
                <div className="as-launch">
                    <img className="as-rocket" src={`${A}/cohete.webp`} alt="" aria-hidden="true" />
                    <div className="as-launch-text">
                        <p className="as-kicker as-kicker--orange">Cuenta regresiva</p>
                        <h2 className="as-launch-title">¡Despegamos en…!</h2>
                        <div className="as-count" aria-label="Cuenta regresiva">
                            {[
                                { v: countdown.days, l: 'Días' },
                                { v: countdown.hours, l: 'Horas' },
                                { v: countdown.minutes, l: 'Min' },
                                { v: countdown.seconds, l: 'Seg' },
                            ].map((it) => (
                                <div key={it.l}><b>{it.l === 'Días' ? it.v : pad(it.v)}</b><small>{it.l}</small></div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
