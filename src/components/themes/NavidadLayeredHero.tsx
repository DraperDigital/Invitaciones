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
    layers: { k: string; src: string; inCard?: boolean }[];
    script: string;
    countTitle: string;
    /** 'first': primera palabra arriba y el resto abajo (por defecto: todo menos la última palabra) */
    split?: 'first';
    /** Muestra el año que empieza (dic → año siguiente) */
    year?: boolean | 'bye';
}

const P = (t: string, f: string) => (t === 'fin' ? `/images/themes/fin-ano/${f}.webp` : `/images/themes/nav-${t}/${f}.webp`);
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
    },    'posada-mexicana': {
        layers: [
            { k: 'pm-b1', src: P('posada', 'esfera-1') },
            { k: 'pm-b2', src: P('posada', 'esfera-2') },
            { k: 'pm-b3', src: P('posada', 'esfera-3') },
            { k: 'pm-poin', src: P('posada', 'nochebuena') },
            { k: 'pm-pinata', src: P('posada', 'pinata') },
            { k: 'pm-jarrito', src: P('posada', 'jarrito') },
            { k: 'pm-gifts', src: P('posada', 'regalos') },
        ],
        script: 'Querida familia, los invitamos a nuestra',
        countTitle: '¡La fecha se acerca!',
    },
    'posada-linea': {
        layers: [
            { k: 'pl-poin1', src: P('posada', 'nochebuena') },
            { k: 'pl-poin2', src: P('posada', 'nochebuena') },
            { k: 'pl-pinata', src: P('clasicas', 'ico-1') },
            { k: 'pl-sweater', src: P('clasicas', 'ico-6') },
            { k: 'pl-jarrito', src: P('clasicas', 'ico-5') },
        ],
        script: 'Querida familia, con gran alegría los invitamos a nuestra',
        countTitle: '¡La fecha se acerca!',
    },
    'cuadros-escoceses': {
        layers: [
            { k: 'ce-santa', inCard: true, src: P('clasicas', 'santa') },
            { k: 'ce-gift1', inCard: true, src: P('clasicas', 'rl-4') },
            { k: 'ce-gift2', inCard: true, src: P('clasicas', 'rl-7') },
            { k: 'ce-s1', inCard: true, src: P('clasicas', 'rl-2') },
            { k: 'ce-s2', inCard: true, src: P('clasicas', 'rl-8') },
            { k: 'ce-s3', inCard: true, src: P('clasicas', 'rl-10') },
            { k: 'ce-s4', inCard: true, src: P('clasicas', 'rl-11') },
        ],
        script: 'Celebra con nosotros la magia de la Navidad',
        countTitle: 'Faltan',
    },
    'rayas-rojas': {
        layers: [
            { k: 'rr-tree', src: P('clasicas', 'pino') },
        ],
        script: 'Estás invitado a una pequeña y alegre',
        countTitle: 'Faltan',
    },
    'casita-nevada': {
        layers: [
            { k: 'cn-house', inCard: true, src: P('clasicas', 'casita') },
            { k: 'cn-holly', src: P('clasicas', 'acebo-franja') },
        ],
        script: 'Te invitamos a celebrar juntos',
        countTitle: 'Faltan',
    },
    'holly-jolly': {
        layers: [
            { k: 'hj-fil1', src: P('clasicas', 'filigrana') },
            { k: 'hj-fil2', src: P('clasicas', 'filigrana') },
            { k: 'hj-h1', src: P('clasicas', 'acebo') },
            { k: 'hj-h2', src: P('clasicas', 'acebo') },
        ],
        script: 'La fiesta navideña más alegre del año',
        countTitle: 'Faltan',
    },    'brindis-oro': {
        layers: [
            { k: 'bo-serp1', src: P('fin', 'serp-3') },
            { k: 'bo-serp2', src: P('fin', 'serp-2') },
            { k: 'bo-d1', src: P('fin', 'dest-9') },
            { k: 'bo-d2', src: P('fin', 'dest-4') },
            { k: 'bo-d3', src: P('fin', 'dest-13') },
            { k: 'bo-d4', src: P('fin', 'dest-10') },
            { k: 'bo-glass', src: P('fin', 'copas') },
        ],
        script: 'Brindemos por un nuevo comienzo',
        countTitle: 'Para el Año Nuevo faltan',
        split: 'first',
        year: true,
    },
    'globos-champana': {
        layers: [
            { k: 'gc-cluster', src: P('fin', 'globos') },
            { k: 'gc-b1', src: P('fin', 'globo-1') },
            { k: 'gc-b2', src: P('fin', 'globo-3') },
            { k: 'gc-bottle', src: P('fin', 'botella') },
        ],
        script: '¡Salud!',
        countTitle: 'Para el Año Nuevo faltan',
        split: 'first',
    },
    'noche-disco': {
        layers: [
            { k: 'nd-bow', src: P('fin', 'mono') },
            { k: 'nd-s1', src: P('fin', 'estrella-3') },
            { k: 'nd-s2', src: P('fin', 'estrella-1') },
            { k: 'nd-s3', src: P('fin', 'estrella-4') },
            { k: 'nd-bot1', src: P('fin', 'bot-1') },
            { k: 'nd-bot2', src: P('fin', 'bot-3') },
            { k: 'nd-leg', src: P('fin', 'pierna') },
            { k: 'nd-ball', src: P('fin', 'disco') },
        ],
        script: 'Despidamos el año en grande',
        countTitle: 'Para el Año Nuevo faltan',
        split: 'first',
        year: 'bye',
    },
    'cena-gala': {
        layers: [
            { k: 'cg-plume1', src: P('fin', 'pluma') },
            { k: 'cg-plume2', src: P('fin', 'pluma') },
            { k: 'cg-star', src: P('fin', 'estrella-oro') },
        ],
        script: 'Te invitamos a celebrar nuestros logros',
        countTitle: 'Faltan',
        split: 'first',
    },
    'cierre-brillante': {
        layers: [
            { k: 'cb-h1', src: P('fin', 'hoja-2') },
            { k: 'cb-h2', src: P('fin', 'hoja-6') },
            { k: 'cb-h3', src: P('fin', 'hoja-10') },
            { k: 'cb-h4', src: P('fin', 'hoja-14') },
            { k: 'cb-h5', src: P('fin', 'hoja-7') },
            { k: 'cb-seq', src: P('fin', 'lentejuelas') },
        ],
        script: 'Celebremos el',
        countTitle: 'Faltan',
        split: 'first',
    },
    'perlas-champana': {
        layers: [
            { k: 'pc-balloons', src: P('fin', 'globos-perla') },
            { k: 'pc-vase', src: P('fin', 'florero') },
            { k: 'pc-tower', src: P('fin', 'torre') },
            { k: 'pc-c1', src: P('fin', 'conf-2') },
            { k: 'pc-c2', src: P('fin', 'conf-7') },
            { k: 'pc-c3', src: P('fin', 'conf-11') },
            { k: 'pc-c4', src: P('fin', 'conf-15') },
        ],
        script: 'Recibamos juntos el',
        countTitle: 'Para el Año Nuevo faltan',
        split: 'first',
        year: true,
    },
    'soiree-deco': {
        layers: [],
        script: 'Te invitamos a nuestra',
        countTitle: 'Faltan',
        split: 'first',
    },
    'esmoquin': {
        layers: [
            { k: 'es-bow', src: P('fin', 'corbatin') },
        ],
        script: 'Te invitamos a la',
        countTitle: 'Faltan',
        split: 'first',
    },
    'fuegos-plata': {
        layers: [
            { k: 'fp-fw1', src: P('fin', 'fw-1') },
            { k: 'fp-fw2', src: P('fin', 'fw-6') },
            { k: 'fp-st1', src: P('fin', 'fw-3') },
            { k: 'fp-st2', src: P('fin', 'fw-5') },
            { k: 'fp-st3', src: P('fin', 'fw-4') },
            { k: 'fp-bottle', src: P('fin', 'fw-2') },
        ],
        script: 'Hagamos el conteo juntos',
        countTitle: 'Faltan',
        split: 'first',
    },
    'arco-dorado': {
        layers: [
            { k: 'ad-tl', src: P('fin', 'flores-oro') },
            { k: 'ad-tr', src: P('fin', 'flores-oro') },
            { k: 'ad-bl', src: P('fin', 'flores-oro') },
            { k: 'ad-br', src: P('fin', 'flores-oro') },
        ],
        script: 'Invitación a nuestra',
        countTitle: 'Faltan',
        split: 'first',
    },
    'brillo-oro': {
        layers: [
            { k: 'bg-paper', src: P('fin', 'papel-oro') },
        ],
        script: 'Celebremos juntos la',
        countTitle: 'Faltan',
        split: 'first',
    },
    'monos-rojos': {
        layers: [
            { k: 'mr-tl', src: P('fin', 'liston') },
            { k: 'mr-tr', src: P('fin', 'liston') },
            { k: 'mr-bl', src: P('fin', 'liston') },
            { k: 'mr-br', src: P('fin', 'liston') },
        ],
        script: 'Recibamos juntos el año que llega',
        countTitle: 'Faltan',
        split: 'first',
    },
    'mesa-nochevieja': {
        layers: [
            { k: 'mn-tag', inCard: true, src: P('fin', 'copa-tag') },
        ],
        script: 'Esta mesa se llena hoy de lo más importante: personas queridas',
        countTitle: 'Faltan',
        split: 'first',
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
    const byFirst = conf.split === 'first' && words.length > 1;
    const first = words.length > 1 ? (byFirst ? words[0] : words.slice(0, -1).join(' ')) : title;
    const last = words.length > 1 ? (byFirst ? words.slice(1).join(' ') : words[words.length - 1]) : '';
    const newYear = valid ? (date!.getMonth() >= 10 ? date!.getFullYear() + 1 : date!.getFullYear()) : new Date().getFullYear() + 1;
    const kicker = cfg?.hero_kicker || (labels?.tagline && labels.tagline !== 'Posada Navideña' && labels.tagline !== 'Cena de Fin de Año' ? labels.tagline : '');
    const venue = event?.venue_name || '';
    const city = event?.venue_address || '';
    const showCountdown = cfg?.showCountdown !== false && cfg?.show_countdown !== false && countdown
        && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0);

    return (
        <section id="hero" className={`nv nv--${theme} ${shown ? 'is-shown' : ''}`}>
            {conf.layers.filter((l) => !l.inCard).map((l) => (
                <img key={l.k} className={`nv-l nv-l--${l.k}`} src={l.src} alt="" aria-hidden="true" />
            ))}
            <div className="nv-inner">
                <div className="nv-card">
                    {conf.layers.filter((l) => l.inCard).map((l) => (
                        <img key={l.k} className={`nv-l nv-l--${l.k}`} src={l.src} alt="" aria-hidden="true" />
                    ))}
                    {kicker && <p className="nv-kicker">{kicker}</p>}
                    {conf.year && <p className="nv-year">{conf.year === 'bye' ? newYear - 1 : newYear}</p>}
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
