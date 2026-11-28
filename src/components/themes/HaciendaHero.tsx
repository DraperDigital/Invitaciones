import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2 } from 'lucide-react';
import './Hacienda.css';

/**
 * Plantilla "Hacienda Bugambilia" (boda, Pro).
 * Apertura en dos tiempos: sobre que se abre → portón que se abre → portada con nombres.
 * Si existen los videos (/videos/hacienda/sobre.mp4 y porton.mp4, o cfg.intro_video_sobre /
 * cfg.intro_video_porton) se reproducen; si no, se anima con las ilustraciones.
 */

interface Props {
    event: any;
    cfg: any;
    countdown: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
    onEditHero?: () => void;
}

export const HA = (f: string) => `/images/themes/hacienda/${f}.webp`;
const pad = (n: number) => String(Math.max(0, n || 0)).padStart(2, '0');

type Stage = 'sobre' | 'sobre-open' | 'porton' | 'porton-open' | 'done';

function useReveal(root: React.RefObject<HTMLElement>) {
    useEffect(() => {
        const el = root.current; if (!el) return;
        const io = new IntersectionObserver((ents) => ents.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')), { threshold: 0.2 });
        el.querySelectorAll('.ha-scene').forEach((s) => io.observe(s));
        return () => io.disconnect();
    }, [root]);
}

function calendarLink(event: any, date: Date | null) {
    if (!date) return '';
    const s = new Date(date.getTime());
    const e = new Date(date.getTime() + 6 * 3600e3);
    const f = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const q = new URLSearchParams({
        action: 'TEMPLATE',
        text: event?.title || 'Nuestra boda',
        dates: `${f(s)}/${f(e)}`,
        location: [event?.venue_name, event?.venue_address].filter(Boolean).join(', '),
    });
    return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

export default function HaciendaHero({ event, cfg, countdown, scrollToSection, onEditHero }: Props) {
    const rootRef = useRef<HTMLElement>(null);
    const v1 = useRef<HTMLVideoElement>(null);
    const v2 = useRef<HTMLVideoElement>(null);
    const [stage, setStage] = useState<Stage>('sobre');
    const [noV1, setNoV1] = useState(false);
    const [noV2, setNoV2] = useState(false);
    useReveal(rootRef as React.RefObject<HTMLElement>);

    const title: string = event?.title || '';
    const amp = title.indexOf('&');
    const nameA = amp > -1 ? title.slice(0, amp).trim() : title.trim();
    const nameB = amp > -1 ? title.slice(amp + 1).trim() : '';
    const date = event?.date_time ? new Date(event.date_time) : null;
    const valid = !!date && !isNaN(date.getTime());
    const dateLong = valid ? format(date!, "d 'de' MMMM 'de' yyyy", { locale: es }) : '';
    const dateDots = valid ? format(date!, "d · MMMM · yyyy", { locale: es }) : '';
    const venue = event?.venue_name || '';
    const address = event?.venue_address || '';
    const showCount = countdown && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0);
    const calUrl = calendarLink(event, valid ? date : null);
    const vid1 = cfg?.intro_video_sobre || '/videos/hacienda/sobre.mp4';
    const vid2 = cfg?.intro_video_porton || '/videos/hacienda/porton.mp4';
    const introOn = stage !== 'done';

    // Bloquea el scroll mientras corre la apertura
    useEffect(() => {
        const html = document.documentElement;
        if (introOn) { html.style.overflow = 'hidden'; } else { html.style.overflow = ''; }
        return () => { html.style.overflow = ''; };
    }, [introOn]);

    const goPorton = () => {
        setStage('porton');
        const v = v2.current;
        if (v && !noV2) {
            v.currentTime = 0;
            v.playbackRate = 1.6;
            v.play().catch(() => { setNoV2(true); setTimeout(() => setStage('porton-open'), 500); });
        } else {
            setTimeout(() => setStage('porton-open'), 500);
        }
    };

    useEffect(() => {
        if (stage === 'porton-open') { const t = setTimeout(() => setStage('done'), 1900); return () => clearTimeout(t); }
        if (stage === 'sobre-open' && noV1) { const t = setTimeout(goPorton, 1500); return () => clearTimeout(t); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stage, noV1]);

    const openSobre = () => {
        if (stage !== 'sobre') return;
        setStage('sobre-open');
        const v = v1.current;
        if (v && !noV1) { v.playbackRate = 1.6; v.play().catch(() => setNoV1(true)); }
        else setNoV1(true);
    };

    const skip = () => setStage('done');

    return (
        <section id="hero" ref={rootRef} className={`ha ${introOn ? 'is-intro' : 'is-ready'}`}>
            {onEditHero && (
                <button type="button" onClick={onEditHero} className="ha-edit" aria-label="Editar portada"><Edit2 className="h-4 w-4" /></button>
            )}

            {/* ── Apertura: sobre → portón ── */}
            {introOn && (
                <div className={`ha-intro ha-intro--${stage}`} role="button" tabIndex={0} onClick={openSobre} onKeyDown={(e) => e.key === 'Enter' && openSobre()}>
                    <div className="ha-col">
                        <div className="ha-layer ha-sobre">
                            <img className="ha-full ha-sobre-c" src={HA('sobre-cerrado')} alt="Sobre de invitación" />
                            <img className="ha-full ha-sobre-o" src={HA('sobre-abierto')} alt="" />
                            {!noV1 && (
                                <video ref={v1} className="ha-full ha-video" src={vid1} muted playsInline preload="auto"
                                    onError={() => setNoV1(true)} onEnded={goPorton} />
                            )}
                            <p className="ha-tap">Toca para abrir</p>
                        </div>
                        <div className="ha-layer ha-porton">
                            <img className="ha-full ha-porton-c" src={HA('porton-cerrado')} alt="" />
                            <img className="ha-full ha-porton-o" src={HA('porton-abierto')} alt="" />
                            {!noV2 && (
                                <video ref={v2} className="ha-full ha-video" src={vid2} muted playsInline preload="auto"
                                    onError={() => setNoV2(true)} onEnded={() => setStage('done')} />
                            )}
                        </div>
                    </div>
                    {stage !== 'sobre' && <button type="button" className="ha-skip" onClick={(e) => { e.stopPropagation(); skip(); }}>Saltar</button>}
                </div>
            )}

            {/* ── 1 · Portada ── */}
            <div className="ha-scene ha-cover">
                <div className="ha-col">
                    <img className="ha-full" src={HA('porton-abierto')} alt="Portón de la hacienda abierto" />
                    <div className="ha-cover-txt">
                        <p className="ha-script ha-cover-pre">Nos casamos</p>
                        <h1 className="ha-names">
                            <span>{nameA}</span>
                            {nameB && <><em>&amp;</em><span>{nameB}</span></>}
                        </h1>
                        {dateDots && <p className="ha-cover-date">{dateDots}</p>}
                        {venue && <p className="ha-cover-venue">{venue}</p>}
                    </div>
                    <button type="button" className="ha-down" onClick={() => document.querySelector('.ha-big')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Bajar">⌄</button>
                </div>
            </div>

            {/* ── 2 · Nuestro gran día ── */}
            <div className="ha-scene ha-big ha-tile">
                <img className="ha-deco ha-bug-l" src={HA('bugambilia-izq')} alt="" />
                <img className="ha-deco ha-bug-r" src={HA('bugambilia-der')} alt="" />
                <div className="ha-card ha-pop">
                    <p className="ha-script ha-title">Nuestro gran día</p>
                    <p className="ha-body">{cfg?.welcome_message || 'Con la bendición de Dios y de nuestros padres, queremos compartir contigo el día más feliz de nuestras vidas.'}</p>
                    <p className="ha-names ha-names--sm"><span>{nameA}</span>{nameB && <><em>&amp;</em><span>{nameB}</span></>}</p>
                    <p className="ha-caps">junto con sus familias</p>
                    {cfg?.welcome_quote && <p className="ha-quote">{cfg.welcome_quote}</p>}
                </div>
            </div>

            {/* ── 3 · Save the date ── */}
            <div className="ha-scene ha-save ha-paper">
                <img className="ha-deco ha-picado" src={HA('papel-picado')} alt="" />
                <p className="ha-script ha-title">Save the date</p>
                {dateLong && <p className="ha-save-date">{dateLong}</p>}
                {showCount && (
                    <div className="ha-count ha-pop">
                        {[{ v: countdown.days, l: 'días' }, { v: countdown.hours, l: 'horas' }, { v: countdown.minutes, l: 'min' }, { v: countdown.seconds, l: 'seg' }].map((it) => (
                            <div key={it.l} className="ha-count-box"><b>{pad(it.v)}</b><span>{it.l}</span></div>
                        ))}
                    </div>
                )}
                <p className="ha-body ha-save-sub">La cuenta regresiva para nuestro día favorito ya comenzó.</p>
                <div className="ha-actions">
                    {calUrl && <a className="ha-btn" href={calUrl} target="_blank" rel="noopener noreferrer">Agregar al calendario</a>}
                    <button type="button" className="ha-btn ha-btn--solid" onClick={() => scrollToSection('rsvp')}>Confirmar asistencia</button>
                </div>
                {address && <p className="ha-caps ha-save-addr">{venue}{venue && address ? ' · ' : ''}{address}</p>}
                <img className="ha-cenefa" src={HA('cenefa')} alt="" />
            </div>
        </section>
    );
}
