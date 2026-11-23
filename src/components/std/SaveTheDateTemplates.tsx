import React, { useEffect, useState } from 'react';
import type { StdData } from '../../lib/saveTheDate';
import { googleCalendarUrl, downloadIcs } from '../../lib/saveTheDate';
import './SaveTheDate.css';

/* ───────────────────────── Piezas compartidas ───────────────────────── */

function useCountdown(date: Date | null) {
    const calc = () => {
        if (!date) return null;
        const diff = Math.max(0, date.getTime() - Date.now());
        return {
            d: Math.floor(diff / 86400000),
            h: Math.floor((diff / 3600000) % 24),
            m: Math.floor((diff / 60000) % 60),
            s: Math.floor((diff / 1000) % 60),
        };
    };
    const [left, setLeft] = useState(calc);
    useEffect(() => {
        const t = window.setInterval(() => setLeft(calc()), 1000);
        return () => window.clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date?.getTime()]);
    return left;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function StdCountdown({ data, compact }: { data: StdData; compact?: boolean }) {
    const left = useCountdown(data.date);
    if (!left) return null;
    const items = [
        { v: left.d, l: 'días' },
        { v: left.h, l: 'hrs' },
        { v: left.m, l: 'min' },
        { v: left.s, l: 'seg' },
    ];
    return (
        <div className={`std-count ${compact ? 'is-compact' : ''}`} aria-label="Cuenta regresiva">
            {items.map(it => (
                <div key={it.l} className="std-count-cell">
                    <b>{it.l === 'días' ? it.v : pad(it.v)}</b>
                    <small>{it.l}</small>
                </div>
            ))}
        </div>
    );
}

export function StdCalendarButton({ data, event }: { data: StdData; event: any }) {
    const [open, setOpen] = useState(false);
    if (!data.date) return null;
    return (
        <div className="std-cal">
            <button type="button" className="std-cal-btn" onClick={() => setOpen(o => !o)} aria-expanded={open}>
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="1.6" d="M4 6.5h16v13H4zM4 10h16M8 4v4M16 4v4" /></svg>
                Agregar al calendario
            </button>
            {open && (
                <div className="std-cal-menu" role="menu">
                    <a role="menuitem" href={googleCalendarUrl(data, event)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Google Calendar</a>
                    <button role="menuitem" type="button" onClick={() => { downloadIcs(data, event); setOpen(false); }}>Apple / Outlook</button>
                </div>
            )}
        </div>
    );
}

/** Cuenta regresiva + botón de calendario + nota, en el orden que usa casi todo diseño */
function Actions({ data, event, compact }: { data: StdData; event: any; compact?: boolean }) {
    return (
        <div className="std-actions">
            <StdCountdown data={data} compact={compact} />
            <StdCalendarButton data={data} event={event} />
            {data.note && <p className="std-note">{data.note}</p>}
        </div>
    );
}

const Names = ({ data, amp = '&', className = '' }: { data: StdData; amp?: string; className?: string }) => (
    <h1 className={`std-names ${className}`}>
        {data.names.length >= 2 ? (
            <>
                <span>{data.names[0]}</span>
                <i className="std-amp">{amp}</i>
                <span>{data.names.slice(1).join(' ')}</span>
            </>
        ) : <span>{data.names[0]}</span>}
    </h1>
);

const initials = (data: StdData) =>
    data.names.map(n => n.charAt(0).toUpperCase()).slice(0, 2).join(data.names.length >= 2 ? '&' : '');

function toRoman(num: number): string {
    const map: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    let out = '';
    for (const [v, s] of map) while (num >= v) { out += s; num -= v; }
    return out;
}

interface TplProps { data: StdData; event: any }

/* ───────────────────────── 1 · Editorial ───────────────────────── */
function Editorial({ data, event }: TplProps) {
    return (
        <div className="std std--editorial">
            <div className="std-ed-photo" style={data.photo ? { backgroundImage: `url(${data.photo})` } : undefined} />
            <div className="std-ed-shade" />
            <header className="std-ed-top">
                <p className="std-kicker">{data.kicker === 'Save the Date' ? (data.eventType === 'wedding' ? 'Nos casamos' : 'Te esperamos') : data.kicker}</p>
                <p className="std-ed-city">{data.city.split(',')[0]}</p>
            </header>
            <div className="std-ed-bottom">
                <p className="std-ed-std">Save the <em>Date</em></p>
                <Names data={data} />
                <p className="std-ed-date">{data.dd}.{data.mm}.{data.yy}<span>{data.weekday}</span></p>
                <Actions data={data} event={event} compact />
            </div>
        </div>
    );
}

/* ───────────────────────── 2 · Calendario ───────────────────────── */
function Calendario({ data, event }: TplProps) {
    const first = data.date ? new Date(data.year, data.month, 1) : null;
    const offset = first ? (first.getDay() + 6) % 7 : 0; // lunes primero
    const daysInMonth = data.date ? new Date(data.year, data.month + 1, 0).getDate() : 30;
    const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    return (
        <div className="std std--calendario">
            <div className="std-cal-card">
                <p className="std-kicker">{data.kicker}</p>
                <Names data={data} />
                <div className="std-month">
                    <p className="std-month-name">{data.monthName} <span>{data.year}</span></p>
                    <div className="std-grid">
                        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <span key={i} className="std-grid-head">{d}</span>)}
                        {cells.map((n, i) => (
                            <span key={i} className={`std-grid-day ${n === data.day ? 'is-day' : ''}`}>
                                {n}
                                {n === data.day && (
                                    <svg className="std-circle" viewBox="0 0 60 60" aria-hidden="true">
                                        <path d="M30 6c14 0 25 9 24 23-1 15-13 25-26 25C14 54 5 44 6 30 7 17 18 7 34 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                                    </svg>
                                )}
                            </span>
                        ))}
                    </div>
                </div>
                <p className="std-cal-hand">¡Aparta la fecha!</p>
                <p className="std-city-line">{data.city}</p>
                <Actions data={data} event={event} compact />
            </div>
        </div>
    );
}

/* ───────────────────────── 3 · Arco ───────────────────────── */
function Arco({ data, event }: TplProps) {
    return (
        <div className="std std--arco">
            <p className="std-kicker">{data.kicker}</p>
            <div className="std-arch">
                <div className="std-arch-img" style={data.photo ? { backgroundImage: `url(${data.photo})` } : undefined}>
                    {!data.photo && <span className="std-arch-mono">{initials(data)}</span>}
                </div>
            </div>
            <Names data={data} amp="y" />
            <div className="std-arco-date">
                <span>{data.weekday}</span>
                <b>{data.day}</b>
                <span>{data.monthName} {data.year}</span>
            </div>
            <p className="std-city-line">{data.city}</p>
            <Actions data={data} event={event} compact />
        </div>
    );
}

/* ───────────────────────── 4 · Polaroid ───────────────────────── */
function Polaroid({ data, event }: TplProps) {
    return (
        <div className="std std--polaroid">
            <div className="std-pola">
                <i className="std-tape std-tape--l" />
                <i className="std-tape std-tape--r" />
                <div className="std-pola-img" style={data.photo ? { backgroundImage: `url(${data.photo})` } : undefined}>
                    {!data.photo && <span>{initials(data)}</span>}
                </div>
                <p className="std-pola-caption">{data.names.join(' & ')}</p>
            </div>
            <div className="std-pola-text">
                <p className="std-pola-big">¡Guarda la fecha!</p>
                <p className="std-pola-date">{data.dd} · {data.mm} · {data.year}</p>
                <p className="std-city-line">{data.kicker !== 'Save the Date' ? `${data.kicker} · ` : ''}{data.city}</p>
            </div>
            <Actions data={data} event={event} compact />
        </div>
    );
}

/* ───────────────────────── 5 · Pase de abordar ───────────────────────── */
function Boleto({ data, event }: TplProps) {
    const cityName = data.city.split(',')[0] || data.city;
    const code = (cityName.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z]/g, '').slice(0, 3) || 'FIE').toUpperCase();
    const hour = data.date ? `${pad(data.date.getHours())}:${pad(data.date.getMinutes())}` : '';
    return (
        <div className="std std--boleto">
            <svg className="std-route" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
                <path d="M-10 110 C 110 20, 250 150, 420 14" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round" />
            </svg>
            <div className="std-ticket">
                <div className="std-ticket-head">
                    <span>Pase de abordar</span>
                    <span>{data.kicker}</span>
                </div>
                <div className="std-ticket-route">
                    <div><small>Desde</small><b>TÚ</b><span>donde estés</span></div>
                    <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path fill="currentColor" d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5z" /></svg>
                    <div className="is-right"><small>Hacia</small><b>{code}</b><span>{cityName}</span></div>
                </div>
                <div className="std-ticket-fields">
                    <div><small>Pasajeros</small><b>{data.names.join(' & ')}</b></div>
                    <div><small>Fecha</small><b>{data.dd} {data.monthName.slice(0, 3).toUpperCase()} {data.year}</b></div>
                    <div><small>Salida</small><b>{hour} hrs</b></div>
                    <div><small>Asiento</small><b>Junto a nosotros</b></div>
                </div>
                <div className="std-ticket-cut" />
                <div className="std-ticket-stub">
                    <div className="std-barcode" aria-hidden="true" />
                    <p>Save the Date</p>
                </div>
            </div>
            <Actions data={data} event={event} compact />
        </div>
    );
}

/* ───────────────────────── 6 · Tipográfico ───────────────────────── */
function Tipografico({ data, event }: TplProps) {
    return (
        <div className="std std--tipografico">
            <header className="std-tp-top">
                <p className="std-kicker">{data.kicker}</p>
                <Names data={data} amp="+" />
            </header>
            <div className="std-tp-nums" aria-label={data.dateLong}>
                <span>{data.dd}</span>
                <span>{data.mm}</span>
                <span>{data.yy}<i className="std-dot" /></span>
            </div>
            <footer className="std-tp-bottom">
                <p className="std-tp-meta">{data.weekday} · {data.city}</p>
                <Actions data={data} event={event} compact />
            </footer>
        </div>
    );
}

/* ───────────────────────── 7 · Sello de lacre ───────────────────────── */
function Lacre({ data, event }: TplProps) {
    return (
        <div className="std std--lacre">
            <div className="std-lacre-card">
                <img className="std-lacre-seal" src="/images/themes/lacre-sello.svg" alt="" aria-hidden="true" />
                <p className="std-lacre-std">Save the Date</p>
                <p className="std-kicker">{data.kicker === 'Save the Date' ? 'Nuestra boda' : data.kicker}</p>
                <Names data={data} amp="&" />
                <div className="std-lacre-rule"><span /></div>
                <p className="std-lacre-roman">{data.date ? `${toRoman(data.day)} · ${toRoman(data.month + 1)} · ${toRoman(data.year)}` : ''}</p>
                <p className="std-lacre-long">{data.dateLong}</p>
                <p className="std-city-line">{data.city}</p>
                <Actions data={data} event={event} compact />
            </div>
        </div>
    );
}

/* ───────────────────────── 8 · Brillo XV ───────────────────────── */
const SPARKS = [[8, 12, 14], [86, 9, 10], [14, 46, 8], [90, 38, 16], [6, 78, 12], [80, 70, 9], [50, 5, 8], [30, 88, 10], [70, 90, 12], [62, 24, 7]];
function Brillo({ data, event }: TplProps) {
    return (
        <div className="std std--brillo">
            {SPARKS.map(([x, y, s], i) => (
                <svg key={i} className="std-spark" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDelay: `${i * 0.37}s` }} viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="currentColor" />
                </svg>
            ))}
            <p className="std-kicker">{data.kicker}</p>
            <div className="std-oval">
                <div className="std-oval-img" style={data.photo ? { backgroundImage: `url(${data.photo})` } : undefined}>
                    {!data.photo && <span>{initials(data)}</span>}
                </div>
            </div>
            <Names data={data} />
            <p className="std-brillo-std">Save the Date</p>
            <p className="std-brillo-date">{data.dd} <i>·</i> {data.monthName} <i>·</i> {data.year}</p>
            <p className="std-city-line">{data.city}</p>
            <Actions data={data} event={event} compact />
        </div>
    );
}

/* ───────────────────────── 9 · Nube ───────────────────────── */
function Nube({ data, event }: TplProps) {
    return (
        <div className="std std--nube">
            <i className="std-cloud std-cloud--1" /><i className="std-cloud std-cloud--2" /><i className="std-cloud std-cloud--3" />
            <img className="std-nube-star s1" src="/images/themes/nube-estrella.svg" alt="" aria-hidden="true" />
            <img className="std-nube-star s2" src="/images/themes/nube-estrella.svg" alt="" aria-hidden="true" />
            <img className="std-nube-star s3" src="/images/themes/nube-estrella.svg" alt="" aria-hidden="true" />
            <p className="std-kicker">{data.kicker}</p>
            <img className="std-nube-lamb" src="/images/themes/nube/borreguito.webp" alt="" aria-hidden="true" />
            <p className="std-nube-std">¡Guarda la fecha!</p>
            <Names data={data} />
            <p className="std-nube-pill">{data.weekday.charAt(0).toUpperCase() + data.weekday.slice(1)} {data.day} de {data.monthName}</p>
            <p className="std-city-line">{data.city}</p>
            <Actions data={data} event={event} compact />
        </div>
    );
}

/* ───────────────────────── 10 · Botánico ───────────────────────── */
const Branch = ({ className }: { className: string }) => (
    <svg className={className} viewBox="0 0 220 220" aria-hidden="true">
        <path d="M10 210 C 60 160, 110 120, 210 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {[[40, 178, -40], [62, 158, 30], [84, 138, -45], [104, 118, 25], [126, 98, -50], [146, 78, 20], [168, 58, -50], [188, 40, 15]].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx="20" ry="8" transform={`rotate(${r} ${x} ${y}) translate(${r < 0 ? -14 : 14} 0)`} fill="currentColor" opacity={0.75 + (i % 3) * 0.08} />
        ))}
    </svg>
);
function Botanico({ data, event }: TplProps) {
    return (
        <div className="std std--botanico">
            <Branch className="std-branch std-branch--tl" />
            <Branch className="std-branch std-branch--br" />
            <div className="std-bot-inner">
                <p className="std-kicker">{data.kicker}</p>
                <Names data={data} amp="&" />
                <div className="std-bot-date">
                    <span>{data.monthName}</span>
                    <b>{data.dd}</b>
                    <span>{data.year}</span>
                </div>
                <p className="std-bot-week">{data.weekday}</p>
                <p className="std-city-line">{data.city}</p>
                <Actions data={data} event={event} compact />
            </div>
        </div>
    );
}

export const STD_COMPONENTS: Record<string, (p: TplProps) => React.ReactElement> = {
    editorial: Editorial,
    calendario: Calendario,
    arco: Arco,
    polaroid: Polaroid,
    boleto: Boleto,
    tipografico: Tipografico,
    lacre: Lacre,
    brillo: Brillo,
    nube: Nube,
    botanico: Botanico,
};
