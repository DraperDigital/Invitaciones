import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, Clock, Edit2, MapPin } from 'lucide-react';
import { getHeroImageStyle } from '../../lib/heroImagePosition';
import { kidsHeroData } from './kidsHeroData';
import './KidsPastel.css';
import './KidsLayered.css';

/**
 * Portada infantil por capas (con parallax), compartida por:
 * Convivio Pastel, Mis Primeros Juguetes, Capibaras, Perritos Salchicha,
 * Mariposas y Flores, y Globos 3D.
 *
 * La estructura es la misma; cada plantilla da sus ilustraciones (KIDS_LAYERED)
 * y su apariencia (Kids<Plantilla>.css bajo `.kh--<id>`).
 */

export interface KidsLayeredConfig {
    /** Capas decorativas (clase `kh-l--<k>`, posición en el CSS de la plantilla) */
    layers: { k: string; src: string }[];
    /** Ilustración sobre la tarjeta del nombre */
    topArt?: string;
    /** Ilustración junto a la edad */
    ageArt?: string;
    /** Nombre con letras de colores */
    letterColors?: string[];
    kicker: string;
    countTitle: string;
    fallbackName?: string;
}

const P = (t: string, f: string) => `/images/themes/${t}/${f}.webp`;

export const KIDS_LAYERED: Record<string, KidsLayeredConfig> = {
    convivio: {
        layers: [
            { k: 'flags', src: P('convivio', 'banderines') },
            { k: 'gifts', src: P('convivio', 'regalos') },
            { k: 'cupcake', src: P('convivio', 'cupcake') },
        ],
        ageArt: P('convivio', 'pastel'),
        letterColors: ['#ef7fa6', '#a58be0', '#5fc3a4', '#f0b43c', '#6fb0e6'],
        kicker: '¡Vamos a celebrar!',
        countTitle: 'Faltan para la fiesta',
    },
    juguetes: {
        layers: [
            { k: 'sun', src: P('juguetes', 'sol') },
            { k: 'giraffe', src: P('juguetes', 'jirafa') },
            { k: 'balloons', src: P('juguetes', 'globos') },
            { k: 'blocks', src: P('juguetes', 'cubos') },
            { k: 'crayons', src: P('juguetes', 'crayolas') },
            { k: 'balls', src: P('juguetes', 'pelotas') },
        ],
        letterColors: ['#e5483e', '#2f7fd6', '#f4b81f', '#3aa64f'],
        kicker: '¡Ven a jugar a mi fiesta!',
        countTitle: '¡Ya casi es hora de jugar!',
        fallbackName: 'Festejado',
    },
    capibaras: {
        layers: [
            { k: 'flags', src: P('capibaras', 'banderines') },
            { k: 'rainbow', src: P('capibaras', 'arcoiris') },
            { k: 'trio', src: P('capibaras', 'tres') },
        ],
        topArt: P('capibaras', 'boba'),
        kicker: 'Te invito a mi cumpleaños',
        countTitle: 'Cuenta regresiva, sin prisa',
    },
    perritos: {
        layers: [
            { k: 'lying', src: P('perritos', 'lentes') },
            { k: 'bone1', src: P('perritos', 'deco-1') },
            { k: 'paw1', src: P('perritos', 'deco-3') },
            { k: 'heart1', src: P('perritos', 'deco-2') },
            { k: 'walk', src: P('perritos', 'camina') },
        ],
        topArt: P('perritos', 'sentado'),
        kicker: '¡Guau! Estás invitado a mi cumpleaños',
        countTitle: 'Moviendo la colita en…',
        fallbackName: 'Festejado',
    },
    mariposas: {
        layers: [
            { k: 'frame-l', src: P('mariposas', 'marco') },
            { k: 'frame-r', src: P('mariposas', 'marco') },
            { k: 'bf1', src: P('mariposas', 'mariposa-rosa') },
            { k: 'bf2', src: P('mariposas', 'mariposa-azul') },
            { k: 'bf3', src: P('mariposas', 'mariposa-rosa') },
        ],
        ageArt: P('mariposas', 'pastel'),
        kicker: 'Acompáñame a celebrar mi cumpleaños',
        countTitle: 'Faltan para mi gran día',
    },
    globos3d: {
        layers: [
            { k: 'far', src: P('globos3d', 'lejanos') },
            { k: 'big-l', src: P('globos3d', 'globos') },
            { k: 'big-r', src: P('globos3d', 'globos') },
            { k: 'clouds', src: P('globos3d', 'nubes') },
        ],
        ageArt: P('globos3d', 'pastel'),
        kicker: '¡Vamos a celebrar!',
        countTitle: 'Faltan para la fiesta',
    },
};

interface Props {
    theme: string;
    event: any; cfg: any; countdown: any; labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
    onEditHero?: () => void;
}

export default function KidsLayeredHero({ theme, event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const conf = KIDS_LAYERED[theme];
    const [shown, setShown] = useState(false);
    useEffect(() => { const t = setTimeout(() => setShown(true), 120); return () => clearTimeout(t); }, []);
    if (!conf) return null;
    const d = kidsHeroData(event, cfg, countdown, conf.fallbackName);
    const kicker = labels?.tagline && labels.tagline !== 'Cumpleaños' ? labels.tagline : conf.kicker;

    let ci = 0;
    const name = conf.letterColors
        ? d.name.split('').map((ch, i) => ch === ' '
            ? <span key={i} className="kh-space"> </span>
            : <span key={i} style={{ color: conf.letterColors![ci++ % conf.letterColors!.length] }}>{ch}</span>)
        : d.name;

    return (
        <section id="hero" className={`kh-hero kh--${theme} ${shown ? 'is-shown' : ''}`}>
            {conf.layers.map((l) => (
                <img key={l.k} className={`kh-l kh-l--${l.k}`} src={l.src} alt="" aria-hidden="true" />
            ))}

            <div className="kh-grid">
                <div className="kh-main">
                    <div className="kh-card">
                        {conf.topArt && <img className="kh-top" src={conf.topArt} alt="" aria-hidden="true" />}
                        <p className="kh-kicker">{kicker}</p>
                        <h1 className={`kh-name ${conf.letterColors ? 'is-letters' : ''}`} aria-label={d.name}>{name}</h1>
                        {d.age && (
                            <div className={`kh-age ${conf.ageArt ? 'has-art' : ''}`}>
                                {conf.ageArt && <img src={conf.ageArt} alt="" aria-hidden="true" />}
                                <p><span>Cumplo</span><b>{d.age}</b><span>{Number(d.age) === 1 ? 'año' : 'años'}</span></p>
                            </div>
                        )}
                        <div className="kh-chips">
                            {d.eventDate && <div><CalendarDays aria-hidden="true" /><span>{format(d.eventDate, "EEEE d 'de' MMMM", { locale: es })}</span></div>}
                            {d.eventDate && <div><Clock aria-hidden="true" /><span>{format(d.eventDate, 'h:mm a')}</span></div>}
                            {(d.placeName || d.placeAddress) && <div><MapPin aria-hidden="true" /><span>{d.placeName || d.placeAddress}</span></div>}
                        </div>
                    </div>
                </div>

                <div className="kh-side">
                    {heroImageUrl && (
                        <div className={`kh-photo ${onEditHero ? 'is-editable' : ''}`} onClick={onEditHero}
                            title={onEditHero ? 'Haz clic para cambiar foto de portada' : undefined}>
                            <img src={heroImageUrl} alt="" style={getHeroImageStyle(cfg)} />
                            {onEditHero && <span className="kh-edit"><Edit2 className="h-4 w-4" /> Cambiar foto</span>}
                        </div>
                    )}
                    {d.showCountdown && (
                        <div className="kh-countbox">
                            <p className="kh-count-title">{conf.countTitle}</p>
                            <div className="kh-count" aria-label="Cuenta regresiva">
                                {d.countItems.map((it) => <div key={it.l}><b>{it.v}</b><small>{it.l}</small></div>)}
                            </div>
                        </div>
                    )}
                    <button type="button" className="kh-btn" onClick={() => scrollToSection('rsvp')}>Confirmar asistencia</button>
                </div>
            </div>
        </section>
    );
}
