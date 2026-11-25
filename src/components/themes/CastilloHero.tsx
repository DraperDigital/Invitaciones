import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, Clock, Edit2, Home } from 'lucide-react';
import { getHeroImageStyle } from '../../lib/heroImagePosition';
import { kidsHeroData } from './kidsHeroData';
import './KidsPastel.css';
import './Castillo.css';

/**
 * Castillo — cumpleaños de princesa en acuarela, con parallax.
 * Portada: cielo rosa y lila, castillo que asoma sobre una tarjeta con marco
 * dorado, corona, nombre en letra script, listones, edad grande y datos con íconos.
 * Módulos: KidsPastel.css.
 */

interface Props {
    event: any; cfg: any; countdown: any; labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
    onEditHero?: () => void;
}

const C = '/images/themes/castillo';

export default function CastilloHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const [shown, setShown] = useState(false);
    useEffect(() => { const t = setTimeout(() => setShown(true), 120); return () => clearTimeout(t); }, []);
    const d = kidsHeroData(event, cfg, countdown);
    const kicker = labels?.tagline && labels.tagline !== 'Cumpleaños' ? labels.tagline : '¡Estás invitado/a a mi cumpleaños!';

    return (
        <section id="hero" className={`cs-hero ${shown ? 'is-shown' : ''}`}>
            <img className="cs-cloud cs-cloud--1" src={`${C}/nube-1.webp`} alt="" aria-hidden="true" />
            <img className="cs-cloud cs-cloud--2" src={`${C}/nube-3.webp`} alt="" aria-hidden="true" />

            <div className="cs-grid">
                <div className="cs-main">
                    <img className="cs-castle" src={`${C}/castillo.webp`} alt="" aria-hidden="true" />
                    <div className="cs-card">
                        <img className="cs-crown" src={`${C}/corona.webp`} alt="" aria-hidden="true" />
                        <p className="cs-kicker">{kicker}</p>
                        <h1 className="cs-name">{d.name}</h1>
                        {d.age && (
                            <>
                                <p className="cs-ribbon cs-ribbon--lilac">Cumplo mis</p>
                                <p className="cs-age"><b>{d.age}</b><span>{Number(d.age) === 1 ? 'año' : 'años'}</span></p>
                            </>
                        )}
                        <ul className="cs-list">
                            {d.eventDate && <li><CalendarDays aria-hidden="true" /> <span>{format(d.eventDate, "EEEE d 'de' MMMM", { locale: es })}</span></li>}
                            {(d.placeName || d.placeAddress) && <li><Home aria-hidden="true" /> <span>{d.placeName || d.placeAddress}</span></li>}
                            {d.eventDate && <li><Clock aria-hidden="true" /> <span>Hora: {format(d.eventDate, 'h:mm a')}</span></li>}
                        </ul>
                        <p className="cs-ribbon cs-ribbon--pink">¡No faltes!</p>
                    </div>
                </div>

                <div className="cs-side">
                    {heroImageUrl && (
                        <div className={`cs-photo ${onEditHero ? 'is-editable' : ''}`} onClick={onEditHero}
                            title={onEditHero ? 'Haz clic para cambiar foto de portada' : undefined}>
                            <img src={heroImageUrl} alt="" style={getHeroImageStyle(cfg)} />
                            {onEditHero && <span className="cs-edit"><Edit2 className="h-4 w-4" /> Cambiar foto</span>}
                        </div>
                    )}
                    {d.showCountdown && (
                        <div className="cs-countbox">
                            <p className="cs-count-title">Faltan para la gran fiesta</p>
                            <div className="cs-count" aria-label="Cuenta regresiva">
                                {d.countItems.map((it) => <div key={it.l}><b>{it.v}</b><small>{it.l}</small></div>)}
                            </div>
                        </div>
                    )}
                    <button type="button" className="cs-btn" onClick={() => scrollToSection('rsvp')}>Confirmar asistencia</button>
                </div>
            </div>

            <img className="cs-towers cs-towers--l" src={`${C}/torres.webp`} alt="" aria-hidden="true" />
            <img className="cs-towers cs-towers--r" src={`${C}/torres.webp`} alt="" aria-hidden="true" />
            <img className="cs-cloud cs-cloud--front" src={`${C}/nube-2.webp`} alt="" aria-hidden="true" />
        </section>
    );
}
