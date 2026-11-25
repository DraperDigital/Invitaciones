import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2, MapPin } from 'lucide-react';
import { getHeroImageStyle } from '../../lib/heroImagePosition';
import './Sirenita.css';

/**
 * Sirenita — cumpleaños infantil de niña, fondo marino en acuarela pastel.
 * Cola de sirena, listón lila con el nombre, concha con la edad, fecha en dos
 * columnas, foto en burbuja y algas en las esquinas.
 *
 * Solo dibuja la PORTADA (módulo `hero`, que incluye la cuenta regresiva).
 * El resto de los módulos se visten con Sirenita.css bajo `.theme-sirenita`.
 * Ilustraciones propias en /images/themes/sirenita/*.webp
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

const S = '/images/themes/sirenita';
const pad = (n: number) => String(Math.max(0, n || 0)).padStart(2, '0');

const STARS: [number, number, number, number, number][] = [
    // left%, top px, width px, imagen 1-3, giro
    [6, 70, 34, 1, -14], [44, 18, 24, 2, 10], [86, 300, 30, 3, 18], [4, 420, 26, 2, -6],
];

export default function SirenitaHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setShown(true), 120);
        return () => clearTimeout(t);
    }, []);

    const eventDate = event?.date_time ? new Date(event.date_time) : null;
    const validDate = !!eventDate && !isNaN(eventDate.getTime());
    const name: string = cfg?.child_name || cfg?.childName
        || (event?.title || '').replace(/^(cumpleaños|cumple|mi cumpleaños)\s*(de\s*)?/i, '').trim()
        || 'Festejada';
    const age = cfg?.age || cfg?.turning_age;
    const kicker = labels?.tagline && labels.tagline !== 'Cumpleaños' ? labels.tagline : 'Cumple';
    const place = [event?.venue_name, event?.venue_address].filter(Boolean).join(' · ');
    const showCountdown = cfg?.showCountdown !== false && cfg?.show_countdown !== false && countdown
        && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0);

    return (
        <section id="hero" className={`sr-hero ${shown ? 'is-shown' : ''}`}>
            {STARS.map(([l, t, w, i, r], k) => (
                <img key={k} className="sr-star" src={`${S}/estrella-${i}.webp`} alt="" aria-hidden="true"
                    style={{ left: `${l}%`, top: t, width: w, rotate: `${r}deg`, animationDelay: `${k * 0.6}s` }} />
            ))}

            <div className="sr-hero-grid">
                <div className="sr-hero-main">
                    <img className="sr-tail" src={`${S}/cola.webp`} alt="" aria-hidden="true" />

                    <div className="sr-ribbon">
                        <img src={`${S}/liston.webp`} alt="" aria-hidden="true" />
                        <h1 className="sr-name">{name}</h1>
                    </div>

                    <p className="sr-kicker">{kicker}</p>
                    <div className="sr-shell">
                        <img src={`${S}/concha.webp`} alt="" aria-hidden="true" />
                        {age && <span className="sr-age">{age}</span>}
                    </div>
                </div>

                <div className="sr-hero-side">
                    {validDate && (
                        <div className="sr-when">
                            <div>
                                <p className="sr-hand">{format(eventDate!, 'EEEE', { locale: es })}</p>
                                <p className="sr-hand sr-pink">{format(eventDate!, 'd')}</p>
                                <p className="sr-hand">{format(eventDate!, 'MMMM', { locale: es })}</p>
                            </div>
                            <i aria-hidden="true" />
                            <div>
                                <p className="sr-hand">Hora</p>
                                <p className="sr-hand sr-pink">{format(eventDate!, 'h:mm')}</p>
                                <p className="sr-hand">{format(eventDate!, 'aaaa', { locale: es }).replace(/\s/g, '')}</p>
                            </div>
                        </div>
                    )}
                    {place && (
                        <p className="sr-place"><MapPin className="h-4 w-4" aria-hidden="true" /> {place}</p>
                    )}

                    {heroImageUrl && (
                        <div
                            className={`sr-bubble ${onEditHero ? 'is-editable' : ''}`}
                            onClick={onEditHero}
                            title={onEditHero ? 'Haz clic para cambiar foto de portada' : undefined}
                        >
                            <img src={heroImageUrl} alt="" style={getHeroImageStyle(cfg)} />
                            {onEditHero && <span className="sr-edit"><Edit2 className="h-4 w-4" /> Cambiar foto</span>}
                        </div>
                    )}

                    {showCountdown && (
                        <div className="sr-count-wrap">
                            <p className="sr-count-title">¡Ya casi nos vemos bajo el mar!</p>
                            <div className="sr-count" aria-label="Cuenta regresiva">
                                {[
                                    { v: countdown.days, l: 'Días' },
                                    { v: countdown.hours, l: 'Horas' },
                                    { v: countdown.minutes, l: 'Min' },
                                    { v: countdown.seconds, l: 'Seg' },
                                ].map((it, k) => (
                                    <div key={it.l} style={{ animationDelay: `${k * 0.5}s` }}>
                                        <b>{it.l === 'Días' ? it.v : pad(it.v)}</b><small>{it.l}</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button type="button" className="sr-btn" onClick={() => scrollToSection('rsvp')}>
                        Confirmar asistencia
                    </button>
                </div>
            </div>

            <img className="sr-weed sr-weed--l" src={`${S}/algas.webp`} alt="" aria-hidden="true" />
            <img className="sr-weed sr-weed--r" src={`${S}/algas.webp`} alt="" aria-hidden="true" />
        </section>
    );
}
