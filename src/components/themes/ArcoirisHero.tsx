import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, Clock, Edit2, MapPin } from 'lucide-react';
import { getHeroImageStyle } from '../../lib/heroImagePosition';
import { kidsHeroData } from './kidsHeroData';
import './KidsPastel.css';
import './Arcoiris.css';

/**
 * Arcoíris Kawaii — cumpleaños con arcoíris acolchado, nubes con carita y globos, con parallax.
 * Portada: listones "Bienvenidos / a mi cumpleaños" sobre el arcoíris, nombre con letras
 * de colores, foto redonda, datos en tres tarjetitas y cuenta regresiva. Módulos: KidsPastel.css.
 */

interface Props {
    event: any; cfg: any; countdown: any; labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
    onEditHero?: () => void;
}

const R = '/images/themes/arcoiris';
const COLORS = ['#f27aa8', '#f4a25c', '#e8b93a', '#5cc59a', '#5aa9e6', '#a07be0'];

export default function ArcoirisHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const [shown, setShown] = useState(false);
    useEffect(() => { const t = setTimeout(() => setShown(true), 120); return () => clearTimeout(t); }, []);
    const d = kidsHeroData(event, cfg, countdown);
    const kicker = labels?.tagline && labels.tagline !== 'Cumpleaños' ? labels.tagline : '¡Bienvenidos!';

    let ci = 0;
    const letters = d.name.split('').map((ch, i) =>
        ch === ' ' ? <span key={i} className="ar-space"> </span>
            : <span key={i} style={{ color: COLORS[ci++ % COLORS.length] }}>{ch}</span>);

    return (
        <section id="hero" className={`ar-hero ${shown ? 'is-shown' : ''}`}>
            <img className="ar-balloons ar-balloons--l" src={`${R}/globos.webp`} alt="" aria-hidden="true" />
            <img className="ar-balloons ar-balloons--r" src={`${R}/globos.webp`} alt="" aria-hidden="true" />

            <div className="ar-grid">
                <div className="ar-main">
                    <div className="ar-top">
                        <img className="ar-rainbow" src={`${R}/arcoiris.webp`} alt="" aria-hidden="true" />
                        <p className="ar-banner ar-banner--purple">{kicker}</p>
                        <p className="ar-banner ar-banner--pink">a mi cumpleaños</p>
                    </div>
                    <h1 className="ar-name" aria-label={d.name}>{letters}</h1>
                    {d.age && <p className="ar-age">¡Cumplo <b>{d.age}</b> {Number(d.age) === 1 ? 'año' : 'años'}!</p>}

                    <div className="ar-chips">
                        {d.eventDate && <div><CalendarDays aria-hidden="true" /><small>Día</small><span>{format(d.eventDate, "EEEE d 'de' MMMM", { locale: es })}</span></div>}
                        {d.eventDate && <div><Clock aria-hidden="true" /><small>Hora</small><span>{format(d.eventDate, 'h:mm a')}</span></div>}
                        {(d.placeName || d.placeAddress) && <div><MapPin aria-hidden="true" /><small>Lugar</small><span>{d.placeName || d.placeAddress}</span></div>}
                    </div>
                </div>

                <div className="ar-side">
                    <img className="ar-cloud ar-cloud--l" src={`${R}/nube-2.webp`} alt="" aria-hidden="true" />
                    <img className="ar-cloud ar-cloud--r" src={`${R}/nube-1.webp`} alt="" aria-hidden="true" />
                    {heroImageUrl && (
                        <div className={`ar-photo ${onEditHero ? 'is-editable' : ''}`} onClick={onEditHero}
                            title={onEditHero ? 'Haz clic para cambiar foto de portada' : undefined}>
                            <img src={heroImageUrl} alt="" style={getHeroImageStyle(cfg)} />
                            {onEditHero && <span className="ar-edit"><Edit2 className="h-4 w-4" /> Cambiar foto</span>}
                        </div>
                    )}
                    {d.showCountdown && (
                        <div className="ar-count" aria-label="Cuenta regresiva">
                            {d.countItems.map((it, k) => <div key={it.l} style={{ background: ['#ffd9e7', '#fff1c4', '#d6f3e6', '#dcebfb'][k] }}><b>{it.v}</b><small>{it.l}</small></div>)}
                        </div>
                    )}
                    <button type="button" className="ar-btn" onClick={() => scrollToSection('rsvp')}>Confirmar asistencia</button>
                </div>
            </div>

            <img className="ar-star" src={`${R}/estrella.webp`} alt="" aria-hidden="true" />
            <img className="ar-flowers ar-flowers--l" src={`${R}/flores.webp`} alt="" aria-hidden="true" />
            <img className="ar-flowers ar-flowers--r" src={`${R}/flores.webp`} alt="" aria-hidden="true" />
        </section>
    );
}
