import React, { useState, useEffect, useRef } from 'react';
import { loadGoogleFonts } from '../lib/loadFonts';
import { THEME_PRESET_PROFILES } from '../lib/themePresets';

export interface EnvelopeIntroProps {
    event: {
        title: string;
        event_type?: string;
        date_time?: string | null;
        theme_config?: Record<string, any>;
    };
    guest?: {
        name: string;
    } | null;
    cfg?: Record<string, any>;
    onOpen: () => void;
    accentColor?: string;
    primaryColor?: string;
    cardBgColor?: string;
    sectionBgColor?: string;
    sectionBgAltColor?: string;
    textPrimaryColor?: string;
    textSecondaryColor?: string;
}

/**
 * Extrae iniciales elegantes del título del evento a partir de los NOMBRES.
 * Separa por conectores (" & ", " y ", " e ") y toma la inicial de la última palabra
 * antes del separador y la primera palabra después ("Boda de Ana y Luis" -> "A&L").
 * Ignora palabras como "Boda", "de", "del", "Mis", "XV", "años", "Bautizo", "Prueba", etc.
 * Si solo hay un nombre ("Mis XV Valeria"), extrae una sola inicial ("V").
 */
function getInitials(title?: string): string {
    if (!title || typeof title !== 'string') return 'I';
    const trimmed = title.trim();

    const stopWords = new Set([
        'boda', 'de', 'del', 'los', 'las', 'la', 'el', 'mis', 'mi', 'nuestra', 'nuestro',
        'xv', 'anos', 'años', 'bautizo', 'cumpleanos', 'cumpleaños', 'cumple',
        'prueba', 'test', 'demo', 'evento', 'fiesta', 'graduacion', 'graduación',
        'aniversario', 'primera', 'comunion', 'comunión', 'baby', 'shower', 'revelacion', 'revelación'
    ]);

    // Separadores: ' & ', ' y ', ' e ' (o & directo)
    const separatorRegex = /\s+(?:&|y|e)\s+|\s*&\s*/i;
    if (separatorRegex.test(trimmed)) {
        const parts = trimmed.split(separatorRegex);
        if (parts.length >= 2) {
            const leftTokens = parts[0].trim().split(/\s+/).map(w => w.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '')).filter(Boolean);
            const rightTokens = parts[1].trim().split(/\s+/).map(w => w.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '')).filter(Boolean);

            const leftWord = leftTokens.length > 0 ? leftTokens[leftTokens.length - 1] : '';
            const rightWord = rightTokens.length > 0 ? rightTokens[0] : '';

            if (leftWord && rightWord) {
                return (leftWord.charAt(0) + '&' + rightWord.charAt(0)).toUpperCase();
            }
        }
    }

    // Si solo hay un nombre o no hay conector: ignorar palabras de ocasión y tomar el primer nombre
    const words = trimmed.split(/\s+/).map(w => w.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '')).filter(Boolean);
    const meaningful = words.filter(w => !stopWords.has(w.toLowerCase()));

    if (meaningful.length > 0) {
        return meaningful[0].charAt(0).toUpperCase();
    }
    if (words.length > 0) {
        return words[0].charAt(0).toUpperCase();
    }
    return 'I';
}

/**
 * Obtiene la etiqueta de ocasión según el tipo de evento.
 */
function getEventLabel(eventType?: string): string {
    const t = (eventType || '').toLowerCase();
    if (t.includes('wedding') || t.includes('boda')) return 'Nuestra boda';
    if (t.includes('xv') || t.includes('quince')) return 'Mis XV años';
    if (t.includes('bautizo') || t.includes('baptism')) return 'Mi bautizo';
    if (t.includes('primera_comunion') || t.includes('comunion') || t.includes('comunión')) return 'Mi Primera Comunión';
    if (t.includes('baby_shower')) return 'Baby Shower';
    if (t.includes('gender_reveal') || t.includes('revelacion')) return 'Revelación de Género';
    if (t.includes('birthday') || t.includes('cumple')) return 'Mi cumpleaños';
    if (t.includes('graduacion') || t.includes('graduación')) return 'Mi graduación';
    if (t.includes('corporate') || t.includes('corporativo')) return 'Evento Especial';
    return 'Nuestra celebración';
}

/**
 * Formatea la fecha en formato día · mes · año numérico espaciado (ej. 14 · 02 · 2027)
 */
function formatEnvelopeDate(dateTimeStr?: string | null): string {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return '';
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d} · ${m} · ${y}`;
}

/**
 * Oscurece un color hexadecimal o rgb para el sombreado del sello de cera y papel.
 */
function darkenHex(color?: string, percent: number = 25): string {
    if (!color || typeof color !== 'string') return '#8E3F53';
    const clean = color.trim();
    if (clean.startsWith('rgb')) {
        const m = clean.match(/\d+/g);
        if (m && m.length >= 3) {
            const r = Math.max(0, parseInt(m[0], 10) - Math.round(255 * (percent / 100)));
            const g = Math.max(0, parseInt(m[1], 10) - Math.round(255 * (percent / 100)));
            const b = Math.max(0, parseInt(m[2], 10) - Math.round(255 * (percent / 100)));
            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        }
    }
    if (!clean.startsWith('#')) return '#8E3F53';
    let c = clean.slice(1);
    if (c.length === 3 || c.length === 4) c = c.slice(0, 3).split('').map(x => x + x).join('');
    if (c.length >= 6) c = c.slice(0, 6);
    const num = parseInt(c, 16);
    if (isNaN(num)) return '#8E3F53';
    const r = Math.max(0, (num >> 16) - Math.round(255 * (percent / 100)));
    const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(255 * (percent / 100)));
    const b = Math.max(0, (num & 0x0000FF) - Math.round(255 * (percent / 100)));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function isDarkColor(hex?: string): boolean {
    if (!hex || typeof hex !== 'string') return false;
    let c = hex.replace('#', '').trim();
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    if (c.length < 6) return false;
    const r = parseInt(c.substring(0, 2), 16) || 0;
    const g = parseInt(c.substring(2, 4), 16) || 0;
    const b = parseInt(c.substring(4, 6), 16) || 0;
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq < 135;
}

export default function EnvelopeIntro({
    event,
    guest,
    cfg,
    onOpen,
    accentColor,
    primaryColor,
    cardBgColor,
    sectionBgColor,
    sectionBgAltColor,
    textPrimaryColor,
    textSecondaryColor,
}: EnvelopeIntroProps) {
    const [isBusy, setIsBusy] = useState(false);
    const [envelopeState, setEnvelopeState] = useState<'idle' | 'cracked' | 'open' | 'flapdown' | 'lifted'>('idle');
    const [isGone, setIsGone] = useState(false);
    const isOpeningRef = useRef(false);
    const timersRef = useRef<number[]>([]);

    // Cargar fuentes decorativas para el sobre (Cormorant Garamond, Outfit, Manrope)
    useEffect(() => {
        loadGoogleFonts([
            'Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600',
            'Outfit:wght@500;600;700',
            'Manrope:wght@500;600;700'
        ]);
        return () => {
            timersRef.current.forEach(clearTimeout);
            timersRef.current = [];
        };
    }, []);

    const effectiveCfg = cfg || event.theme_config || {};
    const decorativeImage = effectiveCfg.decorative_image_url || effectiveCfg.decorativeImage || null;
    const initials = getInitials(event.title);
    const eventLabel = getEventLabel(event.event_type);
    const formattedDate = formatEnvelopeDate(event.date_time);

    // Identificar plantilla activa para obtener perfil de colores de respaldo fiel al diseño
    const activeThemeId = (effectiveCfg.theme || event.theme_config?.theme || 'classic') as string;
    const presetProfile = THEME_PRESET_PROFILES[activeThemeId] || THEME_PRESET_PROFILES['classic'];

    // Mapeo dinámico y robusto de colores según la plantilla activa y las elecciones del usuario
    const rawAccent = accentColor
        || effectiveCfg.accent_color
        || effectiveCfg.accentColor
        || presetProfile?.accentColor
        || '#C5A059';

    const rawPrimary = primaryColor
        || effectiveCfg.primary_color
        || effectiveCfg.primaryColor
        || effectiveCfg.button_color
        || effectiveCfg.buttonColor
        || presetProfile?.primaryColor
        || '#2B2625';

    const rawPaper = cardBgColor
        || effectiveCfg.card_bg_color
        || effectiveCfg.cardBgColor
        || presetProfile?.cardBgColor
        || '#FFFFFF';

    const rawBg = sectionBgAltColor
        || sectionBgColor
        || effectiveCfg.section_bg_color
        || effectiveCfg.sectionBgColor
        || presetProfile?.sectionBgColor
        || '#FAF8F5';

    const rawInk = textPrimaryColor
        || effectiveCfg.text_primary
        || effectiveCfg.textPrimary
        || presetProfile?.textPrimary
        || rawPrimary;

    const rawInkSoft = textSecondaryColor
        || effectiveCfg.text_secondary
        || effectiveCfg.textSecondary
        || presetProfile?.textSecondary
        || '#7A6E65';

    // Regla 80/15/5 y salvaguarda de contraste estricta:
    // Si la tarjeta interior (papel) es oscura, la tinta (15%) DEBE ser clara. Si es clara, la tinta DEBE ser oscura.
    const paperIsDark = isDarkColor(rawPaper);

    let finalInk = rawInk;
    if (paperIsDark) {
        if (isDarkColor(finalInk)) {
            if (activeThemeId === 'luxury-gold' || activeThemeId === 'classic-elegance-pro') {
                finalInk = '#F5D76E';
            } else if (presetProfile?.heroTextColor && !isDarkColor(presetProfile.heroTextColor)) {
                finalInk = presetProfile.heroTextColor;
            } else {
                finalInk = '#FFFFFF';
            }
        }
    } else {
        if (!isDarkColor(finalInk)) {
            if (presetProfile?.textPrimary && isDarkColor(presetProfile.textPrimary)) {
                finalInk = presetProfile.textPrimary;
            } else {
                finalInk = '#1E293B';
            }
        }
    }

    let finalInkSoft = rawInkSoft;
    if (paperIsDark) {
        if (isDarkColor(finalInkSoft)) {
            finalInkSoft = (activeThemeId === 'luxury-gold' || activeThemeId === 'classic-elegance-pro') ? '#D4AF37' : '#CBD5E1';
        }
    } else {
        if (!isDarkColor(finalInkSoft)) {
            finalInkSoft = '#64748B';
        }
    }

    // Acento para el sello y etiqueta .k (5% acento):
    let finalAccent = rawAccent;
    if (paperIsDark && isDarkColor(finalAccent)) {
        finalAccent = (activeThemeId === 'luxury-gold' || activeThemeId === 'classic-elegance-pro') ? '#D4AF37' : '#F5D76E';
    }
    const accentDark = darkenHex(finalAccent, 28);

    // Contraste para el fondo general del escenario y texto del destinatario (.env-to)
    const bgIsDark = isDarkColor(rawBg);
    const stageInk = bgIsDark ? '#FFFFFF' : '#1E293B';
    const stageInkSoft = bgIsDark ? '#94A3B8' : '#64748B';

    // Tipografía dinámica adaptada al preset del tema (100% legible y con alta personalidad)
    const fontPreset = presetProfile?.typographyPreset || effectiveCfg.typography_preset || effectiveCfg.typographyPreset || 'elegante';

    let titleFontFamily = "'Cormorant Garamond', Georgia, serif";
    let titleFontWeight = '600';
    let titleFontStyle = 'italic';
    let titleLetterSpacing = '0.01em';
    let titleFontSize = 'clamp(24px, 7vw, 32px)';

    if (fontPreset === 'divertida') {
        titleFontFamily = "'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
        titleFontWeight = '700';
        titleFontStyle = 'normal';
        titleLetterSpacing = '-0.01em';
        titleFontSize = 'clamp(18px, 5.2vw, 24px)';
    } else if (fontPreset === 'moderna') {
        titleFontFamily = "'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
        titleFontWeight = '600';
        titleFontStyle = 'normal';
        titleLetterSpacing = '0.01em';
        titleFontSize = 'clamp(19px, 5.5vw, 25px)';
    }

    // El forro interior de la solapa usa el tono primario/secundario de la plantilla activa
    const rawLiner = rawPrimary || rawInkSoft;

    // Sombra del papel calculada de manera robusta sin depender de color-mix
    const paperShade = darkenHex(rawPaper, 8);

    // Estados acumulativos fieles al prototipo (classList.add):
    // una vez que el sello se quiebra, la clase 'cracked' permanece durante 'open', 'flapdown' y 'lifted'
    // para que las dos mitades del sello se mantengan desvanecidas (opacity: 0) y no vuelvan a aparecer.
    const isCracked = envelopeState !== 'idle';
    const isOpen = envelopeState === 'open' || envelopeState === 'flapdown' || envelopeState === 'lifted';
    const isFlapDown = envelopeState === 'flapdown' || envelopeState === 'lifted';
    const isLifted = envelopeState === 'lifted';

    const handleOpen = () => {
        if (isOpeningRef.current) return;
        isOpeningRef.current = true;

        // Vibración háptica en dispositivos móviles soportados
        try {
            if (typeof window !== 'undefined' && 'vibrate' in navigator) {
                navigator.vibrate(18);
            }
        } catch (_) {}

        // Comprobar preferencia de reducción de movimiento
        const reduceMotion = typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion) {
            onOpen();
            return;
        }

        // Tiempos exactos del prototipo:
        // crack: 380ms, flap: 400ms, down: 450ms, reveal: 1300ms
        const T = { crack: 380, flap: 400, down: 450, reveal: 1300 };

        setIsBusy(true);
        setEnvelopeState('cracked'); // 1. Se parte el sello

        let elapsed = T.crack;
        const t1 = window.setTimeout(() => {
            setEnvelopeState('open'); // 2. La solapa se voltea con scaleY(-1)
        }, elapsed);
        timersRef.current.push(t1);

        elapsed += T.flap;
        const t2 = window.setTimeout(() => {
            setEnvelopeState('flapdown'); // La solapa pasa detrás (z-index 1) y cambia a cara forro
        }, elapsed);
        timersRef.current.push(t2);

        elapsed += T.down;
        const t3 = window.setTimeout(() => {
            setEnvelopeState('lifted'); // 3. La tarjeta sale del bolsillo (translateY(-62%))
        }, elapsed);
        timersRef.current.push(t3);

        elapsed += T.reveal;
        const t4 = window.setTimeout(() => {
            setIsGone(true); // 4. El sobre se desvanece suavemente
        }, elapsed);
        timersRef.current.push(t4);

        // Llamar a onOpen al completar la transición visual
        const t5 = window.setTimeout(() => {
            onOpen();
        }, elapsed + 600);
        timersRef.current.push(t5);
    };

    return (
        <section
            className={`env-stage ${isBusy ? 'busy' : ''} ${isGone ? 'gone' : ''}`}
            aria-label="Sobre de invitación digital"
            style={{
                '--env-bg': rawBg,
                '--env-paper': rawPaper,
                '--env-paper-shade': paperShade,
                '--env-ink': finalInk,
                '--env-ink-soft': finalInkSoft,
                '--env-accent': finalAccent,
                '--env-accent-dark': accentDark,
                '--env-liner': rawLiner,
                '--env-stage-ink': stageInk,
                '--env-stage-ink-soft': stageInkSoft,
                '--env-title-font': titleFontFamily,
                '--env-title-weight': titleFontWeight,
                '--env-title-style': titleFontStyle,
                '--env-title-spacing': titleLetterSpacing,
                '--env-title-size': titleFontSize,
            } as React.CSSProperties}
        >
            <style>{`
                .env-stage {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 28px;
                    z-index: 50;
                    background: var(--env-bg);
                    color: var(--env-ink);
                    overflow: hidden;
                    font-family: 'Manrope', system-ui, -apple-system, sans-serif;
                    -webkit-tap-highlight-color: transparent;
                    transition: opacity .7s ease, transform .9s cubic-bezier(.22,1,.36,1);
                }
                .env-stage.gone {
                    opacity: 0;
                    transform: scale(1.04);
                    pointer-events: none;
                }
                .env-stage::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    opacity: .35;
                    mix-blend-mode: multiply;
                    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .55  0 0 0 0 .5  0 0 0 0 .45  0 0 0 .18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
                }

                .env-to {
                    text-align: center;
                    opacity: 0;
                    transform: translateY(8px);
                    animation: envRise .9s .2s cubic-bezier(.22,1,.36,1) forwards;
                    transition: opacity .4s ease;
                    z-index: 2;
                    padding: 0 16px;
                }
                .env-stage.busy .env-to {
                    opacity: 0 !important;
                }
                .env-to small {
                    display: block;
                    font-size: 10px;
                    letter-spacing: .42em;
                    text-transform: uppercase;
                    color: var(--env-stage-ink-soft);
                    margin-bottom: 6px;
                    font-weight: 600;
                }
                .env-to strong {
                    font-family: var(--env-title-font);
                    font-weight: 500;
                    font-size: clamp(24px, 6vw, 30px);
                    letter-spacing: .01em;
                    color: var(--env-stage-ink);
                }

                .env-scene {
                    width: min(86vw, 360px);
                    aspect-ratio: 1.55 / 1;
                    position: relative;
                    opacity: 0;
                    transform: translateY(18px);
                    animation: envRise 1s .35s cubic-bezier(.22,1,.36,1) forwards;
                    z-index: 2;
                }

                .env-ground {
                    position: absolute;
                    left: 8%;
                    right: 8%;
                    bottom: -18px;
                    height: 26px;
                    border-radius: 50%;
                    background: radial-gradient(closest-side, rgba(40,30,20,.22), rgba(40,30,20,0));
                    filter: blur(2px);
                    transition: opacity .6s;
                }

                .env-envelope {
                    position: absolute;
                    inset: 0;
                    transition: transform 1s cubic-bezier(.22,1,.36,1);
                }
                .env-envelope.idle {
                    animation: envBreathe 4.5s ease-in-out infinite;
                }

                .env-back {
                    position: absolute;
                    inset: 0;
                    border-radius: 6px;
                    background: var(--env-paper-shade);
                    box-shadow: 0 18px 40px -18px rgba(40,30,20,.35), inset 0 0 0 1px rgba(0,0,0,.04);
                }

                .env-letter {
                    position: absolute;
                    left: 5%;
                    right: 5%;
                    top: 6%;
                    height: 88%;
                    border-radius: 4px;
                    background: var(--env-paper);
                    box-shadow: 0 2px 10px rgba(40,30,20,.12);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    transform: translateY(0);
                    transition: transform 1.05s cubic-bezier(.22,1,.36,1);
                    z-index: 2;
                    padding: 10px 14px;
                    box-sizing: border-box;
                }
                .env-envelope.lifted .env-letter {
                    transform: translateY(-62%);
                }
                .env-letter .k {
                    font-size: 9px;
                    letter-spacing: .38em;
                    text-transform: uppercase;
                    color: var(--env-accent);
                    font-weight: 700;
                }
                .env-letter .n {
                    font-family: var(--env-title-font);
                    font-weight: var(--env-title-weight);
                    font-style: var(--env-title-style);
                    letter-spacing: var(--env-title-spacing);
                    font-size: var(--env-title-size);
                    line-height: 1.15;
                    color: var(--env-ink);
                    margin: 6px 0 4px;
                }
                .env-letter .d {
                    font-family: 'Cormorant Garamond', Georgia, serif;
                    font-size: 13px;
                    letter-spacing: .28em;
                    color: var(--env-ink-soft);
                }
                .env-letter svg {
                    width: 70px;
                    height: 18px;
                    margin-top: 8px;
                    opacity: .85;
                }

                .env-pocket {
                    position: absolute;
                    inset: 0;
                    z-index: 3;
                    pointer-events: none;
                }
                .env-pocket .l, .env-pocket .r, .env-pocket .b {
                    position: absolute;
                    inset: 0;
                    border-radius: 6px;
                }
                .env-pocket .l {
                    background: linear-gradient(100deg, var(--env-paper) 0%, var(--env-paper-shade) 120%);
                    -webkit-clip-path: polygon(0 0, 52% 56%, 0 100%);
                    clip-path: polygon(0 0, 52% 56%, 0 100%);
                }
                .env-pocket .r {
                    background: linear-gradient(260deg, var(--env-paper) 0%, var(--env-paper-shade) 120%);
                    -webkit-clip-path: polygon(100% 0, 48% 56%, 100% 100%);
                    clip-path: polygon(100% 0, 48% 56%, 100% 100%);
                }
                .env-pocket .b {
                    background: linear-gradient(0deg, var(--env-paper) 30%, var(--env-paper-shade) 100%);
                    -webkit-clip-path: polygon(0 100%, 50% 48%, 100% 100%);
                    clip-path: polygon(0 100%, 50% 48%, 100% 100%);
                    filter: drop-shadow(0 -1px 0 rgba(0,0,0,.05));
                }

                /* Solapa con volteo 2D mediante scaleY(-1) sin preserve-3d ni backface-visibility */
                .env-flap {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    height: 60%;
                    transform-origin: 50% 0;
                    transform: scaleY(1);
                    transition: transform .8s cubic-bezier(.65,0,.35,1);
                    z-index: 5;
                }
                .env-flap .face {
                    position: absolute;
                    inset: 0;
                    -webkit-clip-path: polygon(0 0, 100% 0, 50% 100%);
                    clip-path: polygon(0 0, 100% 0, 50% 100%);
                    transition: opacity .05s linear;
                }
                .env-flap .front {
                    background: linear-gradient(180deg, var(--env-paper) 0%, var(--env-paper-shade) 100%);
                    filter: drop-shadow(0 2px 2px rgba(0,0,0,.08));
                    opacity: 1;
                }
                .env-flap .inside {
                    opacity: 0;
                    background:
                        radial-gradient(circle at 20% 30%, rgba(255,255,255,.22) 0 2px, transparent 3px) 0 0/18px 18px,
                        radial-gradient(circle at 70% 70%, rgba(255,255,255,.16) 0 1.5px, transparent 2.5px) 0 0/22px 22px,
                        var(--env-liner);
                }
                .env-envelope.open .env-flap {
                    transform: scaleY(-1);
                }
                .env-envelope.flapdown .env-flap {
                    z-index: 1;
                }
                .env-envelope.flapdown .env-flap .inside {
                    opacity: 1;
                }
                .env-envelope.flapdown .env-flap .front {
                    opacity: 0;
                }

                /* Sello de cera con apertura en dos mitades */
                .env-seal {
                    position: absolute;
                    left: 50%;
                    top: 60%;
                    width: 66px;
                    height: 66px;
                    margin: -33px 0 0 -33px;
                    z-index: 6;
                    cursor: pointer;
                    border: 0;
                    background: none;
                    outline: none;
                    transition: transform .25s ease;
                    padding: 0;
                    touch-action: manipulation;
                }
                .env-seal:focus-visible .half {
                    outline: 2px solid var(--env-ink);
                    outline-offset: 3px;
                }
                .env-seal:active {
                    transform: scale(.94);
                }
                .env-seal .ring {
                    position: absolute;
                    inset: -10px;
                    border-radius: 50%;
                    border: 1.5px solid var(--env-accent);
                    opacity: 0;
                    animation: envPulse 2.2s 1.4s ease-out infinite;
                    pointer-events: none;
                }
                .env-seal .half {
                    position: absolute;
                    inset: 0;
                    transition: transform .55s cubic-bezier(.3,.7,.4,1), opacity .5s ease;
                }
                .env-seal .half.a {
                    -webkit-clip-path: polygon(0 0, 54% 0, 46% 45%, 58% 62%, 48% 100%, 0 100%);
                    clip-path: polygon(0 0, 54% 0, 46% 45%, 58% 62%, 48% 100%, 0 100%);
                }
                .env-seal .half.b {
                    -webkit-clip-path: polygon(54% 0, 100% 0, 100% 100%, 48% 100%, 58% 62%, 46% 45%);
                    clip-path: polygon(54% 0, 100% 0, 100% 100%, 48% 100%, 58% 62%, 46% 45%);
                }
                .env-seal svg {
                    width: 100%;
                    height: 100%;
                    display: block;
                }
                .env-envelope.cracked .env-seal .ring {
                    display: none;
                }
                .env-envelope.cracked .env-seal .half.a {
                    transform: translate(-26px, 30px) rotate(-38deg);
                    opacity: 0;
                }
                .env-envelope.cracked .env-seal .half.b {
                    transform: translate(26px, 34px) rotate(34deg);
                    opacity: 0;
                }
                .env-envelope.cracked .env-seal {
                    pointer-events: none;
                }
                .env-envelope.flapdown .env-seal,
                .env-envelope.lifted .env-seal {
                    opacity: 0 !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                }

                .env-hint {
                    font-size: 11px;
                    letter-spacing: .3em;
                    text-transform: uppercase;
                    color: var(--env-ink-soft);
                    opacity: 0;
                    animation: envRise .8s 1.2s ease forwards;
                    transition: opacity .3s ease;
                    z-index: 2;
                    font-weight: 600;
                    text-align: center;
                }
                .env-stage.busy .env-hint {
                    opacity: 0 !important;
                }

                /* Versión Desktop: 40% más grande (360px * 1.4 = 504px) */
                @media (min-width: 640px) {
                    .env-scene {
                        width: min(86vw, 430px);
                    }
                    .env-seal {
                        width: 78px;
                        height: 78px;
                        margin: -39px 0 0 -39px;
                    }
                    .env-letter .n {
                        font-size: clamp(32px, 5vw, 44px);
                    }
                }

                @media (min-width: 768px) {
                    .env-stage {
                        gap: 36px;
                    }
                    .env-to small {
                        font-size: 12px;
                        letter-spacing: .46em;
                        margin-bottom: 8px;
                    }
                    .env-to strong {
                        font-size: 38px;
                    }
                    .env-scene {
                        width: min(88vw, 504px);
                    }
                    .env-ground {
                        bottom: -24px;
                        height: 36px;
                    }
                    .env-letter {
                        padding: 18px 24px;
                    }
                    .env-letter .k {
                        font-size: 11px;
                        letter-spacing: .42em;
                    }
                    .env-letter .n {
                        font-size: calc(var(--env-title-size) * 1.25);
                        margin: 10px 0 6px;
                    }
                    .env-letter .d {
                        font-size: 18px;
                        letter-spacing: .32em;
                    }
                    .env-letter svg {
                        width: 96px;
                        height: 24px;
                        margin-top: 12px;
                    }
                    .env-seal {
                        width: 92px;
                        height: 92px;
                        margin: -46px 0 0 -46px;
                    }
                    .env-seal .ring {
                        inset: -14px;
                        border-width: 2px;
                    }
                    .env-envelope.cracked .env-seal .half.a {
                        transform: translate(-38px, 44px) rotate(-38deg);
                        opacity: 0;
                    }
                    .env-envelope.cracked .env-seal .half.b {
                        transform: translate(38px, 50px) rotate(34deg);
                        opacity: 0;
                    }
                    .env-hint {
                        font-size: 13px;
                        letter-spacing: .34em;
                    }
                }

                @keyframes envRise {
                    to { opacity: 1; transform: none; }
                }
                @keyframes envBreathe {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes envPulse {
                    0% { transform: scale(.9); opacity: .7; }
                    100% { transform: scale(1.45); opacity: 0; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .env-envelope.idle { animation: none !important; }
                    .env-seal .ring { animation: none !important; }
                    .env-flap, .env-letter, .env-seal .half, .env-stage { transition-duration: .01s !important; }
                }
            `}</style>

            {/* Símbolos SVG compartidos para el Sello de Cera */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <radialGradient id="invitto-wax-gradient" cx="38%" cy="32%" r="75%">
                        <stop offset="0%" stopColor={finalAccent} stopOpacity="1" />
                        <stop offset="65%" stopColor={accentDark} />
                        <stop offset="100%" stopColor={accentDark} />
                    </radialGradient>
                    <symbol id="invitto-waxseal-symbol" viewBox="0 0 66 66">
                        <path
                            d="M33 3c5 0 7 3 11 4s8 0 10 4 1 7 3 11 6 6 6 11-4 7-5 11-1 8-5 10-7 1-11 3-6 6-9 6-6-4-10-5-8 1-10-3-1-7-3-11-6-6-6-11 4-7 5-11 1-8 5-10 7-1 11-3 3-6 8-6z"
                            fill="url(#invitto-wax-gradient)"
                        />
                        <circle cx="33" cy="33" r="19" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="2" />
                        <circle cx="33" cy="33" r="19" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1" transform="translate(-.6 -.6)" />
                        {decorativeImage ? (
                            <image
                                href={decorativeImage}
                                x="18"
                                y="18"
                                width="30"
                                height="30"
                                preserveAspectRatio="xMidYMid meet"
                                filter="drop-shadow(0 1px 1px rgba(0,0,0,0.3)) brightness(1.15)"
                            />
                        ) : (
                            <text
                                x="33"
                                y="39"
                                textAnchor="middle"
                                fontFamily="'Pinyon Script', cursive, serif"
                                fontSize="20"
                                fill="rgba(255,255,255,.92)"
                            >
                                {initials}
                            </text>
                        )}
                        <ellipse cx="24" cy="20" rx="8" ry="4" fill="rgba(255,255,255,.22)" transform="rotate(-25 24 20)" />
                    </symbol>
                </defs>
            </svg>

            {/* Cabecera del Destinatario (solo si hay invitado con nombre) */}
            {guest?.name && (
                <div className="env-to">
                    <small>Para</small>
                    <strong>{guest.name}</strong>
                </div>
            )}

            {/* Escenario del Sobre */}
            <div className="env-scene">
                <div className="env-ground" />
                <div
                    className={`env-envelope ${envelopeState === 'idle' ? 'idle' : ''} ${
                        isCracked ? 'cracked' : ''
                    } ${isOpen ? 'open' : ''} ${isFlapDown ? 'flapdown' : ''} ${
                        isLifted ? 'lifted' : ''
                    }`}
                >
                    <div className="env-back" />

                    {/* Tarjeta interior */}
                    <div className="env-letter" aria-hidden="true">
                        <div className="k">{eventLabel}</div>
                        <div className="n">{event.title}</div>
                        {formattedDate && <div className="d">{formattedDate}</div>}
                        <svg viewBox="0 0 70 18" fill="none">
                            <path d="M2 9h66" stroke={finalInkSoft} strokeWidth=".8" />
                            <path d="M35 3c-3 3-3 9 0 12 3-3 3-9 0-12z" fill={finalAccent} stroke="none" opacity=".85" />
                        </svg>
                    </div>

                    {/* Bolsillo frontal */}
                    <div className="env-pocket">
                        <div className="l" />
                        <div className="r" />
                        <div className="b" />
                    </div>

                    {/* Solapa con 2 caras */}
                    <div className="env-flap">
                        <div className="face front" />
                        <div className="face inside" />
                    </div>

                    {/* Sello de cera interactivo */}
                    <button
                        type="button"
                        className="env-seal"
                        onClick={handleOpen}
                        aria-label="Abrir invitación"
                    >
                        <span className="ring" />
                        <span className="half a">
                            <svg viewBox="0 0 66 66">
                                <use href="#invitto-waxseal-symbol" />
                            </svg>
                        </span>
                        <span className="half b">
                            <svg viewBox="0 0 66 66">
                                <use href="#invitto-waxseal-symbol" />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>

            {/* Indicador de acción */}
            <div className="env-hint">Toca el sello para abrir</div>
        </section>
    );
}
