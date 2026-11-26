import { useCallback, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Volume2, VolumeX, Edit2 } from 'lucide-react';
import './DulceEspera.css';

/**
 * Experiencia privada "Dulce Espera · Baby Posada de Matías".
 * Historia por escenas (sobre → frase → gran noticia → celebremos → nacimiento → datos)
 * con parallax, polvo de estrellas, farol encendido, música y animalitos que interactúan.
 * No aparece en el catálogo: solo con su enlace o desbloqueándola en el editor.
 */

interface Props {
    event: any;
    cfg: any;
    countdown: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
    onEditHero?: () => void;
}

const A = (f: string) => `/images/themes/matias/${f}.webp`;
const MUSIC = '/sounds/matias.mp3';
const MUSIC_FALLBACK = '/sounds/christmas.mp3';
const pad = (n: number) => String(Math.max(0, n || 0)).padStart(2, '0');

/* ── Polvo de estrellas: un solo canvas fijo para chispitas y explosiones ── */
type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; hue: number; star: boolean };

function useStardust() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const parts = useRef<P[]>([]);
    const raf = useRef<number>(0);
    const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const burst = useCallback((x: number, y: number, n = 60, power = 1) => {
        if (reduced) return;
        for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2;
            const s = (1 + Math.random() * 4.5) * power;
            parts.current.push({
                x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.5 * power,
                life: 0, max: 60 + Math.random() * 70, size: 1 + Math.random() * 3.2,
                hue: 38 + Math.random() * 14, star: Math.random() < 0.3,
            });
        }
    }, [reduced]);

    useEffect(() => {
        const c = canvasRef.current; if (!c || reduced) return;
        const ctx = c.getContext('2d'); if (!ctx) return;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const resize = () => { c.width = innerWidth * dpr; c.height = innerHeight * dpr; c.style.width = innerWidth + 'px'; c.style.height = innerHeight + 'px'; };
        resize(); addEventListener('resize', resize);
        let t = 0;
        const loop = () => {
            t++;
            // chispitas que caen de vez en cuando
            if (t % 9 === 0 && parts.current.length < 260) {
                parts.current.push({ x: Math.random() * innerWidth, y: -10, vx: (Math.random() - .5) * .4, vy: .5 + Math.random() * .7, life: 0, max: 320 + Math.random() * 200, size: .8 + Math.random() * 2, hue: 42, star: Math.random() < .25 });
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            const next: P[] = [];
            for (const p of parts.current) {
                p.life++; p.x += p.vx; p.y += p.vy; p.vx *= .985; p.vy = p.vy * .985 + .03;
                const k = 1 - p.life / p.max;
                if (k <= 0 || p.y > innerHeight + 20) continue;
                const tw = .55 + .45 * Math.sin((p.life + p.x) * .25);
                ctx.globalAlpha = Math.max(0, k * tw);
                ctx.fillStyle = `hsl(${p.hue} 90% ${68 + 20 * tw}%)`;
                ctx.shadowColor = 'rgba(255,215,130,.9)'; ctx.shadowBlur = 8;
                if (p.star) {
                    const s = p.size * 2.4;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y - s); ctx.lineTo(p.x + s * .22, p.y - s * .22); ctx.lineTo(p.x + s, p.y);
                    ctx.lineTo(p.x + s * .22, p.y + s * .22); ctx.lineTo(p.x, p.y + s); ctx.lineTo(p.x - s * .22, p.y + s * .22);
                    ctx.lineTo(p.x - s, p.y); ctx.lineTo(p.x - s * .22, p.y - s * .22); ctx.closePath(); ctx.fill();
                } else {
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
                }
                next.push(p);
            }
            parts.current = next;
            raf.current = requestAnimationFrame(loop);
        };
        raf.current = requestAnimationFrame(loop);
        return () => { cancelAnimationFrame(raf.current); removeEventListener('resize', resize); };
    }, [reduced]);

    return { canvasRef, burst };
}

/* ── Marca escenas visibles (.is-in) para disparar animaciones ── */
function useInView(root: React.RefObject<HTMLElement>) {
    useEffect(() => {
        const el = root.current; if (!el) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => e.target.classList.toggle('is-in', e.isIntersecting));
        }, { threshold: 0.28 });
        el.querySelectorAll('.de-scene').forEach((s) => io.observe(s));
        return () => io.disconnect();
    }, [root]);
}

function Letters({ text }: { text: string }) {
    let i = 0;
    return (
        <>
            {text.split('\n').map((line, li) => (
                <span key={li} className="de-line">
                    {line.split(' ').map((w, wi) => (
                        <span key={wi} className="de-word">
                            {w.split('').map((ch, ci) => <span key={ci} className="de-ch" style={{ ['--i' as any]: i++ }}>{ch}</span>)}
                            {' '}
                        </span>
                    ))}
                </span>
            ))}
        </>
    );
}

function Twinkles({ n = 5, cls = '' }: { n?: number; cls?: string }) {
    return (
        <div className={`de-twinkles ${cls}`} aria-hidden="true">
            {Array.from({ length: n }).map((_, i) => <i key={i} style={{ ['--k' as any]: i }} />)}
        </div>
    );
}

export default function DulceEsperaHero({ event, cfg, countdown, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const rootRef = useRef<HTMLElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [opened, setOpened] = useState(false);
    const [musicOn, setMusicOn] = useState(false);
    const { canvasRef, burst } = useStardust();
    useInView(rootRef as React.RefObject<HTMLElement>);

    const baby = cfg?.baby_name || 'Matías';
    const date = event?.date_time ? new Date(event.date_time) : null;
    const valid = !!date && !isNaN(date.getTime());
    const dateLong = valid ? format(date!, "d 'de' MMMM 'de' yyyy", { locale: es }) : '';
    const t12 = (d: Date) => format(d, 'h:mm a').replace('AM', 'a. m.').replace('PM', 'p. m.');
    const endTxt = cfg?.end_time_label || '';
    const hora = valid ? `${t12(date!)}${endTxt ? ` a ${endTxt}` : ''}` : (cfg?.venue_time || '');
    const venue = event?.venue_name || '';
    const address = event?.venue_address || '';
    const showCount = countdown && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0);

    const playMusic = useCallback(() => {
        const a = audioRef.current; if (!a) return;
        a.volume = 0.5;
        a.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
    }, []);

    const openEnvelope = (e?: React.MouseEvent) => {
        if (opened) return;
        setOpened(true);
        const r = (e?.currentTarget as HTMLElement)?.getBoundingClientRect?.();
        const x = r ? r.left + r.width / 2 : innerWidth / 2;
        const y = r ? r.top + r.height * .45 : innerHeight / 2;
        burst(x, y, 140, 1.6);
        setTimeout(() => burst(x, y - 60, 70, 1.1), 380);
        playMusic();
    };

    // Abrir también si bajan sin tocar
    useEffect(() => {
        if (opened) return;
        const onScroll = () => { if (scrollY > 80) { setOpened(true); burst(innerWidth / 2, innerHeight * .4, 100, 1.4); } };
        addEventListener('scroll', onScroll, { passive: true });
        return () => removeEventListener('scroll', onScroll);
    }, [opened, burst]);

    const toggleMusic = () => {
        const a = audioRef.current; if (!a) return;
        if (musicOn) { a.pause(); setMusicOn(false); } else playMusic();
    };

    // Tocar un animalito: brinco + chispa
    const poke = (e: React.MouseEvent<HTMLElement>) => {
        const el = e.currentTarget;
        el.classList.remove('is-poked'); void el.offsetWidth; el.classList.add('is-poked');
        burst(e.clientX, e.clientY, 26, .8);
    };

    return (
        <section id="hero" ref={rootRef} className={`de ${opened ? 'is-open' : ''}`}>
            <canvas ref={canvasRef} className="de-dust" aria-hidden="true" />
            <audio ref={audioRef} src={cfg?.music_url || MUSIC} loop preload="auto"
                onError={(e) => { const a = e.currentTarget; if (!a.src.endsWith(MUSIC_FALLBACK)) a.src = MUSIC_FALLBACK; }} />
            <button type="button" className={`de-music ${musicOn ? 'is-on' : ''}`} onClick={toggleMusic} aria-label={musicOn ? 'Pausar música' : 'Reproducir música'}>
                {musicOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>

            {/* 1 · El sobre */}
            <div className="de-scene de-s1 de-blue">
                <Twinkles n={6} />
                <div className="de-env" role="button" tabIndex={0} onClick={openEnvelope} onKeyDown={(e) => e.key === 'Enter' && openEnvelope()}>
                    <div className="de-card">
                        <div className="de-card-in">
                            <p className="de-eyebrow">Dulce espera</p>
                            <p className="de-card-title">Baby<br />Posada</p>
                            <i className="de-rule" />
                            {dateLong && <p className="de-card-date">{dateLong}</p>}
                            <img className="de-card-star" src={A('estrella')} alt="" />
                        </div>
                    </div>
                    <img className="de-env-closed" src={A('sobre-cerrado')} alt="Sobre: para ti y tu familia" />
                    <div className="de-env-open" aria-hidden="true">
                        <img className="de-env-back" src={A('sobre-abierto')} alt="" />
                        <div className="de-env-front" />
                    </div>
                </div>
                <p className="de-hint">{opened ? 'Desliza hacia abajo' : 'Toca el sobre para abrirlo'}</p>
            </div>

            {/* 2 · La frase */}
            <div className="de-scene de-s2 de-cream">
                <div className="de-frame">
                    <p className="de-quote"><Letters text={'Esta Navidad,\nnuestro mejor regalo\nestá por llegar…'} /></p>
                    <svg className="de-flourish" viewBox="0 0 120 30" aria-hidden="true"><path d="M8 15c18-14 34-14 52 0s34 14 52 0M8 15c18 14 34 14 52 0s34-14 52 0" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M60 5l2 4-2 4-2-4zM60 21l2 4-2 4-2-4z" fill="currentColor" /></svg>
                </div>
                <img className="de-peek de-peek--r" src={A('motita')} alt="Motita" onClick={poke} />
            </div>

            {/* 3 · La gran noticia */}
            <div className="de-scene de-s3 de-blue">
                <div className="de-frame de-frame--gold">
                    <p className="de-eyebrow de-eyebrow--big">Nuestra gran noticia</p>
                    <div className="de-star-wrap">
                        <span className="de-star-glow" />
                        <img className="de-star" src={A('estrella')} alt="" />
                        <Twinkles n={7} cls="de-tw-star" />
                    </div>
                    <h1 className="de-name">¡{baby}!</h1>
                    <p className="de-sub">Una nueva ilusión llenará<br />nuestros días de amor.</p>
                    <img className="de-angel-pray de-l" src={A('angel-orando')} alt="Angelito" onClick={poke} />
                </div>
            </div>

            {/* 4 · Celebremos juntos */}
            <div className="de-scene de-s4 de-cream">
                <div className="de-frame">
                    <h2 className="de-script">Celebremos<br />juntos</h2>
                    <div className="de-divider"><i /><span>✦</span><i /></div>
                    <p className="de-body">La magia de la Navidad<br />y la alegría de nuestra familia<br />se unen en la dulce espera<br />de una nueva vida.</p>
                    <div className="de-pair">
                        <img className="de-lamb de-l" src={A('borrego')} alt="Borreguito" onClick={poke} />
                        <img className="de-bunny de-l" src={A('conejo')} alt="Conejito" onClick={poke} />
                    </div>
                </div>
                <img className="de-peek de-peek--l" src={A('motita')} alt="Motita" onClick={poke} />
            </div>

            {/* 5 · El nacimiento */}
            <div className="de-scene de-s5 de-blue">
                <p className="de-eyebrow">Dulce espera</p>
                <p className="de-card-title de-card-title--lg">Baby Posada</p>
                <div className="de-nat">
                    <div className="de-nat-star"><span className="de-star-glow" /><img src={A('estrella')} alt="" /><Twinkles n={5} cls="de-tw-star" /></div>
                    <img className="de-nat-angel de-l" src={A('angel')} alt="Angelito" onClick={poke} />
                    <img className="de-nat-deer de-l" src={A('venado')} alt="Venadito" onClick={poke} />
                    <img className="de-nat-manger de-l" src={A('pesebre')} alt={`Bebé ${baby}`} onClick={poke} />
                    <img className="de-nat-straw de-l" src={A('paja')} alt="" />
                    <img className="de-nat-lamb de-l" src={A('borrego')} alt="Borreguito" onClick={poke} />
                    <img className="de-nat-dog de-l" src={A('motita')} alt="Motita" onClick={poke} />
                    <img className="de-nat-bunny de-l" src={A('conejo')} alt="Conejito" onClick={poke} />
                    <div className="de-nat-lantern de-l" onClick={poke}>
                        <span className="de-lantern-glow" />
                        <img src={A('farol')} alt="Farol" />
                        <span className="de-flame" />
                    </div>
                </div>
            </div>

            {/* 6 · Los datos */}
            <div className="de-scene de-s6 de-cream">
                <div className="de-frame de-frame--details">
                    <div className="de-detail">
                        <div className="de-ico de-ico--candle"><img src={A('ico-vela')} alt="" /><span className="de-flame de-flame--sm" /></div>
                        <p className="de-label">Fecha</p>
                        <p className="de-value">{dateLong}</p>
                    </div>
                    <i className="de-hr" />
                    <div className="de-detail">
                        <div className="de-ico de-ico--lantern"><img src={A('ico-farol')} alt="" /></div>
                        <p className="de-label">Hora</p>
                        <p className="de-value">{hora}</p>
                    </div>
                    <i className="de-hr" />
                    <div className="de-detail">
                        <div className="de-ico de-ico--pinata"><img src={A('ico-pinata')} alt="" /></div>
                        <p className="de-label">Lugar</p>
                        <p className="de-value">{venue}</p>
                        {address && <p className="de-value de-value--sm">{address}</p>}
                    </div>
                    {showCount && (
                        <div className="de-count" aria-label="Cuenta regresiva">
                            {[{ v: countdown.days, l: 'días' }, { v: countdown.hours, l: 'horas' }, { v: countdown.minutes, l: 'min' }, { v: countdown.seconds, l: 'seg' }].map((it) => (
                                <span key={it.l}><b>{pad(it.v)}</b><small>{it.l}</small></span>
                            ))}
                        </div>
                    )}
                    <button type="button" className="de-btn" onClick={() => scrollToSection('rsvp')}>Confirmar asistencia</button>
                    {heroImageUrl && (
                        <div className={`de-photo ${onEditHero ? 'is-editable' : ''}`} onClick={onEditHero}>
                            <img src={heroImageUrl} alt="" />
                            {onEditHero && <span><Edit2 className="h-4 w-4" /> Cambiar foto</span>}
                        </div>
                    )}
                </div>
                <img className="de-peek de-peek--top" src={A('motita')} alt="Motita" onClick={poke} />
            </div>
        </section>
    );
}
