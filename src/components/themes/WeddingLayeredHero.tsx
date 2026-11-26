import type React from 'react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2, MapPin, CalendarHeart, Gift, MailCheck } from 'lucide-react';
import { getHeroImageStyle } from '../../lib/heroImagePosition';
import './WeddingLayered.css';

/**
 * Portadas de boda por capas (con parallax): Pase de Abordar y Sobre Azul Marino.
 * Solo dibujan el módulo `hero` (con su cuenta regresiva). El resto de los
 * módulos se visten con KidsPastel.css (variables --kp-*) + WeddingLayered.css.
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

const P = (t: string, f: string) => `/images/themes/${t}/${f}.webp`;
const pad = (n: number) => String(Math.max(0, n || 0)).padStart(2, '0');

function useHeroData(event: any, cfg: any, countdown: any) {
    const date = event?.date_time ? new Date(event.date_time) : null;
    const valid = !!date && !isNaN(date.getTime());
    const title: string = event?.title || '';
    const i = title.indexOf('&');
    const nameA = i > -1 ? title.slice(0, i).trim() : title.trim();
    const nameB = i > -1 ? title.slice(i + 1).trim() : '';
    const initials = nameB ? `${nameA[0] || ''}${nameB[0] || ''}` : (nameA[0] || '');
    const showCountdown = cfg?.showCountdown !== false && cfg?.show_countdown !== false && countdown
        && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0);
    return {
        date: valid ? date! : null,
        nameA, nameB, initials: initials.toUpperCase(),
        venue: event?.venue_name || '',
        city: event?.venue_address || '',
        showCountdown,
    };
}

function Countdown({ countdown, title }: { countdown: any; title: string }) {
    return (
        <div className="wh-count" aria-label="Cuenta regresiva">
            <p className="wh-count-title">{title}</p>
            <div className="wh-count-grid">
                {[
                    { v: countdown.days, l: 'Días' },
                    { v: countdown.hours, l: 'Horas' },
                    { v: countdown.minutes, l: 'Min' },
                    { v: countdown.seconds, l: 'Seg' },
                ].map((it) => <div key={it.l}><b>{pad(it.v)}</b><small>{it.l}</small></div>)}
            </div>
        </div>
    );
}

function Photo({ cls, heroImageUrl, cfg, onEditHero }: { cls: string; heroImageUrl: string | null; cfg: any; onEditHero?: () => void }) {
    return (
        <div className={`${cls} ${onEditHero ? 'is-editable' : ''}`} onClick={onEditHero}
            title={onEditHero ? 'Haz clic para cambiar foto de portada' : undefined}>
            {heroImageUrl ? <img src={heroImageUrl} alt="" style={getHeroImageStyle(cfg)} /> : <div className="wh-photo-empty" />}
            {onEditHero && <span className="wh-edit"><Edit2 className="h-4 w-4" /> Cambiar foto</span>}
        </div>
    );
}

function PaseHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const d = useHeroData(event, cfg, countdown);
    return (
        <>
            <svg className="wh-l wp-path" viewBox="0 0 400 900" preserveAspectRatio="none" aria-hidden="true">
                <path d="M370 40 C 250 160, 60 140, 70 330 S 340 520, 300 700 S 80 860, 40 900" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="5 7" />
            </svg>
            <img className="wh-l wp-plane" src={P('boleto', 'avion')} alt="" aria-hidden="true" />
            <div className="wh-inner">
                <div className="wp-ticket">
                    <span className="wp-side">▾ Salida</span>
                    <p className="wp-kicker">{labels?.tagline || 'Pase de abordar · Boda'}</p>
                    <img className="wp-globe" src={P('boleto', 'globo')} alt="" aria-hidden="true" />
                    <h1 className="wp-names">
                        <span>{d.nameA}</span>
                        {d.nameB && <><em>y</em><span>{d.nameB}</span></>}
                    </h1>
                    <div className="wp-grid">
                        <div><small>Fecha y hora</small><b>{d.date ? format(d.date, 'dd.MM.yyyy · HH:mm') : '—'}</b></div>
                        <div><small>Clase</small><b>Primera</b></div>
                        <div><small>Destino</small><b>{d.city || '—'}</b></div>
                        <div><small>Lugar</small><b>{d.venue || '—'}</b></div>
                    </div>
                    <div className="wp-foot">
                        <div className="wp-stamp" aria-hidden="true">
                            <img src={P('boleto', 'sello')} alt="" />
                        </div>
                        <p className="wp-sign">{d.initials.split('').join(' & ')}</p>
                    </div>
                    <p className="wp-boarding">Abordando hacia el amor</p>
                </div>
                <div className="wh-side">
                    <Photo cls="wh-photo wp-photo" heroImageUrl={heroImageUrl} cfg={cfg} onEditHero={onEditHero} />
                    {d.showCountdown && <Countdown countdown={countdown} title="Despegamos en" />}
                    <button type="button" className="wh-btn" onClick={() => scrollToSection('rsvp')}>Confirmar asistencia</button>
                </div>
            </div>
            <img className="wh-l wp-clouds" src={P('boleto', 'nubes')} alt="" aria-hidden="true" />
        </>
    );
}

function SobreHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const d = useHeroData(event, cfg, countdown);
    return (
        <>
            <img className="wh-l ws-corner ws-corner--tl" src={P('sobre', 'esquina')} alt="" aria-hidden="true" />
            <img className="wh-l ws-corner ws-corner--br" src={P('sobre', 'esquina')} alt="" aria-hidden="true" />
            <img className="wh-l ws-f ws-f--1" src={P('sobre', 'p-3')} alt="" aria-hidden="true" />
            <img className="wh-l ws-f ws-f--2" src={P('sobre', 'p-4')} alt="" aria-hidden="true" />
            <img className="wh-l ws-f ws-f--3" src={P('sobre', 'p-10')} alt="" aria-hidden="true" />
            <img className="wh-l ws-f ws-f--4" src={P('sobre', 'p-7')} alt="" aria-hidden="true" />
            <img className="wh-l ws-f ws-f--5" src={P('sobre', 'p-11')} alt="" aria-hidden="true" />
            <div className="wh-inner">
                <div className="ws-card">
                    <p className="ws-kicker">{labels?.tagline || 'La boda de'}</p>
                    <h1 className="ws-names">
                        <span>{d.nameA}</span>
                        {d.nameB && <><em>&amp;</em><span>{d.nameB}</span></>}
                    </h1>
                    <p className="ws-heart" aria-hidden="true">♥</p>
                    <div className="ws-envelope" aria-hidden="true">
                        <img src={P('sobre', 'sobre')} alt="" />
                        <span className="ws-initials">{d.initials.split('').join('')}</span>
                        <p className="ws-env-text">El comienzo de<br />nuestro <i>para siempre</i></p>
                    </div>
                    {d.date && (
                        <div className="ws-date">
                            <small>{format(d.date, 'EEEE', { locale: es })}</small>
                            <b>{format(d.date, 'd')}</b>
                            <span>{format(d.date, "MMMM yyyy", { locale: es })} · {format(d.date, 'h:mm a')}</span>
                            {d.venue && <em>{d.venue}</em>}
                            {d.city && <span>{d.city}</span>}
                        </div>
                    )}
                </div>
                <div className="wh-side">
                    <div className="ws-hoop">
                        <Photo cls="wh-photo ws-photo" heroImageUrl={heroImageUrl} cfg={cfg} onEditHero={onEditHero} />
                        <img className="ws-hoop-art" src={P('sobre', 'aro')} alt="" aria-hidden="true" />
                    </div>
                    {d.showCountdown && <Countdown countdown={countdown} title="Faltan" />}
                    <button type="button" className="wh-btn" onClick={() => scrollToSection('rsvp')}>Confirmar asistencia</button>
                </div>
            </div>
            <img className="wh-l ws-garland" src={P('sobre', 'guirnalda')} alt="" aria-hidden="true" />
        </>
    );
}

function VinoHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const d = useHeroData(event, cfg, countdown);
    return (
        <>
            <img className="wh-l wv-curtain wv-curtain--l" src={P('vino', 'cortina')} alt="" aria-hidden="true" />
            <img className="wh-l wv-curtain wv-curtain--r" src={P('vino', 'cortina')} alt="" aria-hidden="true" />
            <img className="wh-l wv-pt wv-pt--1" src={P('vino', 'p-4')} alt="" aria-hidden="true" />
            <img className="wh-l wv-pt wv-pt--2" src={P('vino', 'p-2')} alt="" aria-hidden="true" />
            <img className="wh-l wv-pt wv-pt--3" src={P('vino', 'p-8')} alt="" aria-hidden="true" />
            <img className="wh-l wv-pt wv-pt--4" src={P('vino', 'p-11')} alt="" aria-hidden="true" />
            <div className="wh-inner">
                <div className="wv-cover">
                    <Photo cls="wh-photo wv-photo" heroImageUrl={heroImageUrl} cfg={cfg} onEditHero={onEditHero} />
                    <img className="wh-l wv-roses" src={P('vino', 'esquina')} alt="" aria-hidden="true" />
                    <div className="wv-cover-text">
                        <p className="wv-kicker">{labels?.tagline || 'Nos casamos'}</p>
                        <h1 className="wv-names">
                            <span>{d.nameA}</span>
                            {d.nameB && <><em>y</em><span>{d.nameB}</span></>}
                        </h1>
                        {d.date && <p className="wv-date">{format(d.date, 'dd · MM · yyyy')}</p>}
                    </div>
                </div>
                <div className="wv-paper">
                    <p className="wv-small">Con amor te invitamos a compartir con nosotros</p>
                    <h2 className="wv-title">Un día.<br />Nuestra eternidad.</h2>
                    {d.venue && <p className="wv-venue">{d.venue}{d.city ? ` · ${d.city}` : ''}</p>}
                    {d.showCountdown && <Countdown countdown={countdown} title="Faltan" />}
                    <button type="button" className="wh-btn" onClick={() => scrollToSection('rsvp')}>Confirmar asistencia</button>
                    <img className="wh-l wv-garland" src={P('vino', 'guirnalda')} alt="" aria-hidden="true" />
                </div>
            </div>
        </>
    );
}

function AzulHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const d = useHeroData(event, cfg, countdown);
    const links = [
        { id: 'location', l: 'Ubicación', I: MapPin },
        { id: 'rsvp', l: 'Confirmar', I: MailCheck },
        { id: 'itinerary', l: 'Itinerario', I: CalendarHeart },
        { id: 'gifts', l: 'Regalos', I: Gift },
    ];
    const go = (id: string) => scrollToSection(document.getElementById(id) ? id : 'rsvp');
    return (
        <>
            <img className="wh-l wa-corner wa-corner--tr" src={P('azul', 'esquina')} alt="" aria-hidden="true" />
            <img className="wh-l wa-corner wa-corner--bl" src={P('azul', 'esquina')} alt="" aria-hidden="true" />
            <div className="wh-inner">
                <div className="wa-card">
                    <div className="wa-top">
                        <Photo cls="wh-photo wa-photo" heroImageUrl={heroImageUrl} cfg={cfg} onEditHero={onEditHero} />
                        <img className="wh-l wa-photo-flowers" src={P('azul', 'esquina')} alt="" aria-hidden="true" />
                        <div className="wa-seal" aria-hidden="true">
                            <img src={P('azul', 'sello')} alt="" />
                            <span>{d.initials.split('').join(' | ')}</span>
                        </div>
                    </div>
                    <p className="wa-kicker">{labels?.tagline || 'Junto con sus familias'}</p>
                    <h1 className="wa-names">
                        <span>{d.nameA}</span>
                        {d.nameB && <><em>y</em><span>{d.nameB}</span></>}
                    </h1>
                    <p className="wa-invite">Te invitan a celebrar su boda</p>
                    <img className="wa-sprig" src={P('azul', 'ramita')} alt="" aria-hidden="true" />
                    {d.date && (
                        <div className="wa-date">
                            <small>{format(d.date, 'EEEE', { locale: es })}</small>
                            <div><span>{format(d.date, 'MMMM', { locale: es })}</span><b>{format(d.date, 'd')}</b><span>{format(d.date, 'yyyy')}</span></div>
                            <small>{format(d.date, 'h:mm a')}</small>
                        </div>
                    )}
                    {d.venue && <p className="wa-venue">{d.venue}</p>}
                    {d.city && <p className="wa-city">{d.city}</p>}
                    <div className="wa-links">
                        {links.map(({ id, l, I }) => (
                            <button key={id} type="button" onClick={() => go(id)}><i><I className="h-5 w-5" /></i><span>{l}</span></button>
                        ))}
                    </div>
                    <p className="wa-wait">¡Te esperamos para celebrar!</p>
                    <img className="wh-l wa-wash" src={P('azul', 'mancha')} alt="" aria-hidden="true" />
                </div>
                <div className="wh-side">
                    <img className="wa-bouquet" src={P('azul', 'ramo')} alt="" aria-hidden="true" />
                    {d.showCountdown && <Countdown countdown={countdown} title="Faltan" />}
                </div>
            </div>
        </>
    );
}

export const WEDDING_LAYERED_THEMES = ['pase-abordar', 'sobre-marino', 'terciopelo-vino', 'azul-acuarela'];

export default function WeddingLayeredHero(props: Props) {
    const [shown, setShown] = useState(false);
    useEffect(() => { const t = setTimeout(() => setShown(true), 120); return () => clearTimeout(t); }, []);
    const variants: Record<string, [string, (p: Props) => React.ReactElement]> = {
        'pase-abordar': ['wh--pase', PaseHero],
        'sobre-marino': ['wh--sobre', SobreHero],
        'terciopelo-vino': ['wh--vino', VinoHero],
        'azul-acuarela': ['wh--azul', AzulHero],
    };
    const [cls, Comp] = variants[props.theme] || variants['sobre-marino'];
    return (
        <section id="hero" className={`wh ${cls} ${shown ? 'is-shown' : ''}`}>
            <Comp {...props} />
        </section>
    );
}
