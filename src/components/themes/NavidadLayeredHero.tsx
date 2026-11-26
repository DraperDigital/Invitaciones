import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2 } from 'lucide-react';
import { getHeroImageStyle } from '../../lib/heroImagePosition';
import './NavidadLayered.css';

/**
 * Portadas navideñas por capas (con parallax): Pueblo de Papel, Bordado de Lujo,
 * La Época Más Bonita y Noche de Velas. Solo dibujan el módulo `hero`;
 * el resto de los módulos se visten con KidsPastel.css (--kp-*) + NavidadLayered.css.
 */

interface Props {
    theme: string;
    event: any;
    cfg: any;
    countdown: any;
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
    onEditHero?: () => void;
}

interface NavConfig {
    layers: { k: string; src: string }[];
    script: string;
    countTitle: string;
}

const P = (t: string, f: string) => `/images/themes/nav-${t}/${f}.webp`;
const pad = (n: number) => String(Math.max(0, n || 0)).padStart(2, '0');

export const NAVIDAD_LAYERED: Record<string, NavConfig> = {
    'pueblo-papel': {
        layers: [
            { k: 'star', src: P('papel', 'estrella') },
            { k: 'pines', src: P('papel', 'pinos') },
            { k: 'village', src: P('papel', 'pueblo') },
            { k: 'hills', src: P('papel', 'colinas') },
            { k: 'branch', src: P('papel', 'ramas') },
        ],
        script: 'Felices fiestas',
        countTitle: 'Faltan',
    },
    'bordado-lujo': {
        layers: [
            { k: 'orn1', src: P('bordado', 'esfera-x-1') },
            { k: 'orn2', src: P('bordado', 'esfera-1') },
            { k: 'orn3', src: P('bordado', 'esfera-x-2') },
            { k: 'garland', src: P('bordado', 'guirnalda') },
            { k: 'poin1', src: P('bordado', 'nochebuena') },
            { k: 'poin2', src: P('bordado', 'nochebuena') },
        ],
        script: 'Celebremos juntos',
        countTitle: 'Faltan',
    },
    'epoca-bonita': {
        layers: [
            { k: 'corner', src: P('acuarela', 'esquina') },
            { k: 'ball', src: P('acuarela', 'esfera') },
            { k: 'cookie', src: P('acuarela', 'gv-1') },
            { k: 'candle', src: P('acuarela', 'gv-2') },
            { k: 'gift', src: P('acuarela', 'regalo') },
            { k: 'land', src: P('acuarela', 'paisaje') },
            { k: 'mug', src: P('acuarela', 'taza') },
        ],
        script: 'la época más bonita del año',
        countTitle: 'Faltan',
    },
    'noche-velas': {
        layers: [
            { k: 'pine', src: P('velas', 'rama') },
            { k: 'lantern', src: P('velas', 'farol') },
            { k: 'balls', src: P('velas', 'esferas') },
        ],
        script: 'Te invitamos a nuestra',
        countTitle: 'Faltan',
    },
};

export default function NavidadLayeredHero({ theme, event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const conf = NAVIDAD_LAYERED[theme];
    const [shown, setShown] = useState(false);
    useEffect(() => { const t = setTimeout(() => setShown(true), 120); return () => clearTimeout(t); }, []);
    if (!conf) return null;

    const date = event?.date_time ? new Date(event.date_time) : null;
    const valid = !!date && !isNaN(date.getTime());
    const title: string = event?.title || 'Posada Navideña';
    const words = title.trim().split(/\s+/);
    const first = words.length > 1 ? words.slice(0, -1).join(' ') : title;
    const last = words.length > 1 ? words[words.length - 1] : '';
    const kicker = cfg?.hero_kicker || (labels?.tagline && labels.tagline !== 'Posada Navideña' ? labels.tagline : '');
    const venue = event?.venue_name || '';
    const city = event?.venue_address || '';
    const showCountdown = cfg?.showCountdown !== false && cfg?.show_countdown !== false && countdown
        && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0);

    return (
        <section id="hero" className={`nv nv--${theme} ${shown ? 'is-shown' : ''}`}>
            {conf.layers.map((l) => (
                <img key={l.k} className={`nv-l nv-l--${l.k}`} src={l.src} alt="" aria-hidden="true" />
            ))}
            <div className="nv-inner">
                <div className="nv-card">
                    {kicker && <p className="nv-kicker">{kicker}</p>}
                    <p className="nv-script">{conf.script}</p>
                    <h1 className="nv-title">
                        <span>{first}</span>
                        {last && <span>{last}</span>}
                    </h1>
                    <i className="nv-rule" aria-hidden="true" />
                    {valid && (
                        <div className="nv-date">
                            <div><small>{format(date!, 'EEEE', { locale: es })}</small><b>{format(date!, 'd')}</b><small>{format(date!, 'MMMM', { locale: es })}</small></div>
                            <i aria-hidden="true" />
                            <div><small>A las</small><b>{format(date!, 'h:mm')}</b><small>{format(date!, 'a')}</small></div>
                        </div>
                    )}
                    {venue && <p className="nv-venue">{venue}</p>}
                    {city && <p className="nv-city">{city}</p>}
                </div>
                <div className="nv-side">
                    {heroImageUrl && (
                        <div className={`nv-photo ${onEditHero ? 'is-editable' : ''}`} onClick={onEditHero}
                            title={onEditHero ? 'Haz clic para cambiar foto de portada' : undefined}>
                            <img src={heroImageUrl} alt="" style={getHeroImageStyle(cfg)} />
                            {onEditHero && <span className="nv-edit"><Edit2 className="h-4 w-4" /> Cambiar foto</span>}
                        </div>
                    )}
                    {showCountdown && (
                        <div className="nv-count" aria-label="Cuenta regresiva">
                            <p>{conf.countTitle}</p>
                            <div>
                                {[
                                    { v: countdown.days, l: 'Días' },
                                    { v: countdown.hours, l: 'Horas' },
                                    { v: countdown.minutes, l: 'Min' },
                                    { v: countdown.seconds, l: 'Seg' },
                                ].map((it) => <span key={it.l}><b>{pad(it.v)}</b><small>{it.l}</small></span>)}
                            </div>
                        </div>
                    )}
                    <button type="button" className="nv-btn" onClick={() => scrollToSection('rsvp')}>Confirmar asistencia</button>
                </div>
            </div>
        </section>
    );
}
