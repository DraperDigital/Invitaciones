import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2 } from 'lucide-react';
import { getHeroImageStyle } from '../../lib/heroImagePosition';
import { kidsHeroData } from './kidsHeroData';
import './KidsPastel.css';
import './Unicornio.css';

/**
 * Unicornio — cumpleaños de niña en acuarela pastel, con parallax.
 * Portada: manchas de acuarela, nombre grande lila, fecha entre líneas punteadas,
 * foto redonda, pastel arcoíris con la edad y unicornio. Módulos: KidsPastel.css.
 */

interface Props {
    event: any; cfg: any; countdown: any; labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
    onEditHero?: () => void;
}

const U = '/images/themes/unicornio';
const STARS: [number, number, number, number][] = [
    [8, 6, 30, 1], [86, 4, 24, 2], [90, 26, 18, 3], [4, 34, 20, 2], [88, 52, 26, 1], [6, 66, 22, 3], [80, 80, 18, 2],
];

export default function UnicornioHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const [shown, setShown] = useState(false);
    useEffect(() => { const t = setTimeout(() => setShown(true), 120); return () => clearTimeout(t); }, []);
    const d = kidsHeroData(event, cfg, countdown);
    const kicker = labels?.tagline && labels.tagline !== 'Cumpleaños' ? labels.tagline : 'Acompáñanos a celebrar';

    return (
        <section id="hero" className={`un-hero ${shown ? 'is-shown' : ''}`}>
            {STARS.map(([l, t, w, i], k) => (
                <img key={k} className="un-star" src={`${U}/estrella-${i}.webp`} alt="" aria-hidden="true"
                    style={{ left: `${l}%`, top: `${t}%`, width: w, animationDelay: `${k * 0.5}s` }} />
            ))}

            <div className="un-grid">
                <div className="un-main">
                    <p className="un-kicker">{kicker}</p>
                    <p className="un-sub">El cumpleaños de</p>
                    <h1 className="un-name">{d.name}</h1>

                    {d.eventDate && (
                        <div className="un-date">
                            <span>{format(d.eventDate, 'EEEE', { locale: es })}</span>
                            <b>{format(d.eventDate, 'd')}</b>
                            <span>{format(d.eventDate, 'MMMM', { locale: es })}</span>
                            <small>{format(d.eventDate, 'yyyy')} · {format(d.eventDate, 'h:mm a')}</small>
                        </div>
                    )}
                    {d.placeName && <p className="un-place">{d.placeName}</p>}
                    {d.placeAddress && <p className="un-address">{d.placeAddress}</p>}

                    {d.showCountdown && (
                        <div className="un-count" aria-label="Cuenta regresiva">
                            {d.countItems.map((it) => <div key={it.l}><b>{it.v}</b><small>{it.l}</small></div>)}
                        </div>
                    )}
                    <button type="button" className="un-btn" onClick={() => scrollToSection('rsvp')}>Confirmar asistencia</button>
                </div>

                <div className="un-side">
                    {heroImageUrl && (
                        <div className={`un-photo ${onEditHero ? 'is-editable' : ''}`} onClick={onEditHero}
                            title={onEditHero ? 'Haz clic para cambiar foto de portada' : undefined}>
                            <img src={heroImageUrl} alt="" style={getHeroImageStyle(cfg)} />
                            {onEditHero && <span className="un-edit"><Edit2 className="h-4 w-4" /> Cambiar foto</span>}
                        </div>
                    )}
                    <div className="un-scene">
                        <img className="un-rainbow" src={`${U}/arcoiris.webp`} alt="" aria-hidden="true" />
                        <div className="un-cake">
                            {d.age && <span className="un-age">{d.age}</span>}
                            <img src={`${U}/pastel.webp`} alt="" aria-hidden="true" />
                        </div>
                        <img className="un-unicorn" src={`${U}/unicornio.webp`} alt="" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </section>
    );
}
