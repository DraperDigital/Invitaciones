import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2, MapPin } from 'lucide-react';
import { getHeroImageStyle } from '../../lib/heroImagePosition';
import './Dinosaurios.css';

/**
 * Dinosaurios — cumpleaños infantil en ilustración plana pastel.
 * T-rex con "ROAR!", nombre con letras de colores, edad junto al triceratops,
 * fecha en renglón, foto en forma de huevo, volcán en la cuenta regresiva,
 * hojas tropicales y confeti de triangulitos.
 *
 * Solo dibuja la PORTADA (módulo `hero`, que incluye la cuenta regresiva).
 * El resto de los módulos se visten con Dinosaurios.css bajo `.theme-dinosaurios`.
 * Ilustraciones propias en /images/themes/dinosaurios/*.webp
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

const D = '/images/themes/dinosaurios';
const pad = (n: number) => String(Math.max(0, n || 0)).padStart(2, '0');
const LETTER_COLORS = ['#E2A845', '#9DBFE0', '#A9CDB4', '#6E9A72'];
const CONFETTI_COLORS = ['#E2A845', '#9DBFE0', '#6E9A72', '#C9B48A'];

// Confeti fijo (posiciones deterministas para que no "salte" entre renders)
const CONFETTI = Array.from({ length: 26 }, (_, i) => ({
    left: (i * 37 + 11) % 100,
    top: (i * 53 + 7) % 100,
    rot: (i * 47) % 360,
    size: 7 + (i % 3) * 2,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
}));

export default function DinosauriosHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
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
    const kicker = labels?.tagline && labels.tagline !== 'Cumpleaños' ? labels.tagline : 'Cumple';
    const place = event?.venue_name || event?.venue_address || '';
    const showCountdown = cfg?.showCountdown !== false && cfg?.show_countdown !== false && countdown
        && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0);

    // Nombre con letras de colores (los espacios no cuentan para el color)
    let colorIdx = 0;
    const letters = name.split('').map((ch, i) => {
        if (ch === ' ') return <span key={i} className="dn-space"> </span>;
        const color = LETTER_COLORS[colorIdx++ % LETTER_COLORS.length];
        return <span key={i} style={{ color }}>{ch}</span>;
    });

    return (
        <section id="hero" className={`dn-hero ${shown ? 'is-shown' : ''}`}>
            <div className="dn-confetti" aria-hidden="true">
                {CONFETTI.map((c, i) => (
                    <i key={i} style={{ left: `${c.left}%`, top: `${c.top}%`, width: c.size, height: c.size, background: c.color, rotate: `${c.rot}deg` }} />
                ))}
            </div>
            <img className="dn-leaf dn-leaf--tr" src={`${D}/monstera.webp`} alt="" aria-hidden="true" />
            <img className="dn-leaf dn-leaf--tl" src={`${D}/palma-1.webp`} alt="" aria-hidden="true" />
            <img className="dn-leaf dn-leaf--bl" src={`${D}/platano-1.webp`} alt="" aria-hidden="true" />
            <img className="dn-leaf dn-leaf--br" src={`${D}/palma-2.webp`} alt="" aria-hidden="true" />

            <div className="dn-hero-grid">
                <div className="dn-hero-main">
                    <div className="dn-top">
                        <img className="dn-trex" src={`${D}/trex.webp`} alt="" aria-hidden="true" />
                        <p className="dn-roar">ROAR!</p>
                    </div>

                    <h1 className="dn-name" aria-label={name}>{letters}</h1>

                    <div className="dn-age-row">
                        <p className="dn-kicker">{kicker}</p>
                        {age && <p className="dn-age">{age}</p>}
                        <img className="dn-tricera" src={`${D}/tricera.webp`} alt="" aria-hidden="true" />
                    </div>

                    {validDate && (
                        <div className="dn-when">
                            <img className="dn-ptero" src={`${D}/ptero.webp`} alt="" aria-hidden="true" />
                            <div className="dn-when-date">
                                <b>{format(eventDate!, 'd')}</b>
                                <div>
                                    <span className="dn-green">{format(eventDate!, 'EEEE', { locale: es })}</span>
                                    <span className="dn-mustard">{format(eventDate!, 'MMMM', { locale: es })}</span>
                                </div>
                            </div>
                            <i aria-hidden="true" />
                            <div className="dn-when-time">
                                <span className="dn-mustard">{format(eventDate!, 'h:mm a')}</span>
                                {place && <span className="dn-blue">{place}</span>}
                            </div>
                        </div>
                    )}
                    {event?.venue_address && event?.venue_name && (
                        <p className="dn-place"><MapPin className="h-4 w-4" aria-hidden="true" /> {event.venue_address}</p>
                    )}
                </div>

                <div className="dn-hero-side">
                    {heroImageUrl && (
                        <div
                            className={`dn-egg ${onEditHero ? 'is-editable' : ''}`}
                            onClick={onEditHero}
                            title={onEditHero ? 'Haz clic para cambiar foto de portada' : undefined}
                        >
                            <img src={heroImageUrl} alt="" style={getHeroImageStyle(cfg)} />
                            {onEditHero && <span className="dn-edit"><Edit2 className="h-4 w-4" /> Cambiar foto</span>}
                        </div>
                    )}

                    {showCountdown && (
                        <div className="dn-launch">
                            <img className="dn-volcano" src={`${D}/volcan.webp`} alt="" aria-hidden="true" />
                            <div className="dn-launch-text">
                                <p className="dn-launch-title">¡Falta poco para la erupción!</p>
                                <div className="dn-count" aria-label="Cuenta regresiva">
                                    {[
                                        { v: countdown.days, l: 'Días', c: '#E2A845' },
                                        { v: countdown.hours, l: 'Horas', c: '#9DBFE0' },
                                        { v: countdown.minutes, l: 'Min', c: '#6E9A72' },
                                        { v: countdown.seconds, l: 'Seg', c: '#C9B48A' },
                                    ].map((it) => (
                                        <div key={it.l}><b style={{ color: it.c }}>{it.l === 'Días' ? it.v : pad(it.v)}</b><small>{it.l}</small></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <button type="button" className="dn-btn" onClick={() => scrollToSection('rsvp')}>
                        Confirmar asistencia
                    </button>
                </div>
            </div>

            <img className="dn-braquio" src={`${D}/braquio.webp`} alt="" aria-hidden="true" />
        </section>
    );
}
