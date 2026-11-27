/**
 * Save the Date — una sola pantalla con los datos principales del evento.
 *
 * Vive en su propio enlace: /std/<slug del evento>.
 * Incluido en Premium (premium) y Concierge. En Clásica y Pro es un extra de $299
 * (theme_config.save_the_date_paid = true lo marca el webhook de Stripe).
 */
import { normalizePlan } from './sectionRegistry';

export const SAVE_THE_DATE_PRICE = 299;

export interface StdTemplate {
    id: string;
    name: string;
    /** Para qué tipo de evento luce mejor (solo informativo) */
    bestFor: string;
    desc: string;
    /** ¿El diseño usa foto? */
    usesPhoto: boolean;
}

export const STD_TEMPLATES: StdTemplate[] = [
    { id: 'editorial', name: 'Editorial', bestFor: 'Boda', desc: 'Foto a pantalla completa y tipografía de revista', usesPhoto: true },
    { id: 'calendario', name: 'Calendario', bestFor: 'Boda', desc: 'El mes del evento con el día marcado a mano', usesPhoto: false },
    { id: 'arco', name: 'Arco', bestFor: 'Boda', desc: 'Foto dentro de un arco, nombres en caligrafía', usesPhoto: true },
    { id: 'polaroid', name: 'Polaroid', bestFor: 'Boda · Cumpleaños', desc: 'Foto instantánea con cinta y letra a mano', usesPhoto: true },
    { id: 'boleto', name: 'Pase de abordar', bestFor: 'Boda en destino', desc: 'Boleto de avión con destino y fecha de salida', usesPhoto: false },
    { id: 'tipografico', name: 'Tipográfico', bestFor: 'Cualquier evento', desc: 'La fecha en números enormes, estilo suizo', usesPhoto: false },
    { id: 'lacre', name: 'Sello de lacre', bestFor: 'Boda formal', desc: 'Tarjeta marfil con sello y letras doradas', usesPhoto: false },
    { id: 'brillo', name: 'Brillo XV', bestFor: 'XV años', desc: 'Rosa profundo con destellos y foto en óvalo', usesPhoto: true },
    { id: 'nube', name: 'Nube', bestFor: 'Baby shower · Bautizo', desc: 'Cielo, nubes y borreguito ilustrado', usesPhoto: false },
    { id: 'botanico', name: 'Botánico', bestFor: 'Boda · Bautizo · Comunión', desc: 'Verde salvia con ramas dibujadas', usesPhoto: false },
];

export const DEFAULT_STD_TEMPLATE = 'editorial';

/** Fuentes de Google que usa cada diseño */
export const STD_FONTS: Record<string, string[]> = {
    editorial: ['Bodoni+Moda:ital,wght@0,400;0,600;1,400', 'Jost:wght@300;400;500'],
    calendario: ['Cormorant+Garamond:ital,wght@0,400;0,500;1,400', 'Caveat:wght@500', 'Jost:wght@300;400;500'],
    arco: ['Pinyon+Script', 'Cormorant+Garamond:wght@400;500', 'Jost:wght@300;400;500'],
    polaroid: ['Caveat:wght@500;700', 'Jost:wght@300;400;500'],
    boleto: ['Space+Grotesk:wght@400;500;700', 'Space+Mono:wght@400;700'],
    tipografico: ['Archivo:wght@400;800;900', 'Archivo+Narrow:wght@400;500'],
    lacre: ['Cinzel:wght@400;600', 'Cormorant+Garamond:ital,wght@0,400;1,400', 'Pinyon+Script'],
    brillo: ['Great+Vibes', 'Montserrat:wght@300;400;600'],
    nube: ['Fredoka:wght@400;500;600', 'Quicksand:wght@400;500;600'],
    botanico: ['Cormorant+Garamond:ital,wght@0,400;0,500;1,400', 'Jost:wght@300;400;500'],
};

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const WEEKDAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const KICKER_BY_TYPE: Record<string, string> = {
    wedding: 'Save the Date',
    xv: 'Mis XV años',
    quinceanera: 'Mis XV años',
    baby_shower: 'Baby Shower',
    gender_reveal: 'Revelación de género',
    baptism: 'Mi bautizo',
    bautizo: 'Mi bautizo',
    communion: 'Mi primera comunión',
    birthday: 'Mi cumpleaños',
    graduation: 'Mi graduación',
    corporate: 'Save the Date',
};

export interface StdData {
    kicker: string;
    title: string;
    /** Nombres separados (pareja) o uno solo */
    names: string[];
    date: Date | null;
    day: number;
    month: number; // 0-11
    year: number;
    dd: string;
    mm: string;
    yy: string;
    monthName: string;
    weekday: string;
    dateLong: string;
    city: string;
    photo: string;
    note: string;
    eventType: string;
}

function cityFromAddress(address?: string | null): string {
    if (!address) return '';
    const parts = address.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length <= 2) return parts.join(', ');
    return parts.slice(-2).join(', ').replace(/\b\d{5}\b/g, '').replace(/\s{2,}/g, ' ').trim();
}

export function buildStdData(event: any): StdData {
    const cfg = event?.theme_config || {};
    const title: string = (event?.title || '').trim();
    const names = title.split(/\s*&\s*|\s+y\s+/i).map((p: string) => p.trim()).filter(Boolean);
    const raw = event?.date_time ? new Date(event.date_time) : null;
    const date = raw && !isNaN(raw.getTime()) ? raw : null;
    const day = date ? date.getDate() : 0;
    const month = date ? date.getMonth() : 0;
    const year = date ? date.getFullYear() : 0;
    const pad = (n: number) => String(n).padStart(2, '0');
    const type = (event?.event_type || 'wedding').toLowerCase();
    return {
        kicker: cfg.save_the_date_kicker || KICKER_BY_TYPE[type] || 'Save the Date',
        title,
        names: names.length ? names : [title],
        date,
        day, month, year,
        dd: date ? pad(day) : '',
        mm: date ? pad(month + 1) : '',
        yy: date ? String(year).slice(-2) : '',
        monthName: date ? MONTHS[month] : '',
        weekday: date ? WEEKDAYS[date.getDay()] : '',
        dateLong: date ? `${WEEKDAYS[date.getDay()]} ${day} de ${MONTHS[month]} de ${year}` : '',
        city: cfg.save_the_date_city || cityFromAddress(event?.venue_address) || '',
        photo: cfg.save_the_date_photo || cfg.hero_image_url || cfg.heroImage || '',
        note: cfg.save_the_date_note ?? 'Invitación formal próximamente',
        eventType: type,
    };
}

/** ¿Este evento puede mostrar su Save the Date? */
export function hasSaveTheDateAccess(event: any): boolean {
    const cfg = event?.theme_config || {};
    if (cfg.save_the_date_paid === true) return true;
    if (cfg.isPremium === true || cfg.isConcierge === true) return true;
    const p = (event?.plan || cfg.plan_tier || '').toLowerCase();
    return normalizePlan(p) === 'premium';
}

/** ¿El plan ya incluye el Save the Date? (Premium y Concierge) */
export function saveTheDateIncluded(plan?: string | null, cfg?: any): boolean {
    if (cfg?.isPremium === true || cfg?.isConcierge === true) return true;
    return normalizePlan(plan) === 'premium';
}

// ── Agregar al calendario ─────────────────────────────────────────────

const fmtUtc = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function googleCalendarUrl(data: StdData, event: any): string {
    if (!data.date) return '';
    const end = new Date(data.date.getTime() + 5 * 60 * 60 * 1000);
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: `${data.kicker}: ${data.title}`,
        dates: `${fmtUtc(data.date)}/${fmtUtc(end)}`,
        details: `${data.note ? data.note + '. ' : ''}${typeof window !== 'undefined' ? window.location.href : ''}`,
        location: event?.venue_address || data.city || '',
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcs(data: StdData, event: any): void {
    if (!data.date) return;
    const end = new Date(data.date.getTime() + 5 * 60 * 60 * 1000);
    const esc = (s: string) => s.replace(/[\\,;]/g, m => '\\' + m).replace(/\n/g, '\\n');
    const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitto//Save the Date//ES', 'BEGIN:VEVENT',
        `UID:${event?.id || data.title}-std@invitto.com.mx`,
        `DTSTAMP:${fmtUtc(new Date())}`,
        `DTSTART:${fmtUtc(data.date)}`,
        `DTEND:${fmtUtc(end)}`,
        `SUMMARY:${esc(`${data.kicker}: ${data.title}`)}`,
        `LOCATION:${esc(event?.venue_address || data.city || '')}`,
        `DESCRIPTION:${esc(data.note || '')}`,
        'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `save-the-date-${(event?.slug || 'evento')}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

// ── Ejemplos públicos (/std/demo-<plantilla>) ─────────────────────────

const inMonths = (m: number, day: number, hour = 18) => {
    const d = new Date();
    d.setMonth(d.getMonth() + m, day);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
};

export const STD_DEMOS: Record<string, any> = {
    editorial: { title: 'Isabel & Rodrigo', event_type: 'wedding', venue_address: 'San Miguel de Allende, Guanajuato', photo: '/images/couples/isabel-rodrigo-hero.jpg', date: inMonths(7, 12, 17) },
    calendario: { title: 'Ana & Carlos', event_type: 'wedding', venue_address: 'Valle de Bravo, Estado de México', photo: '', date: inMonths(6, 20, 17) },
    arco: { title: 'Gabriela & Arturo', event_type: 'wedding', venue_address: 'Tequisquiapan, Querétaro', photo: '/images/couples/gabriela-arturo-hero.jpg', date: inMonths(8, 5, 16) },
    polaroid: { title: 'Helena & Austin', event_type: 'wedding', venue_address: 'Mérida, Yucatán', photo: '/images/couples/helena-austin-hero.jpg', date: inMonths(5, 27, 18) },
    boleto: { title: 'Sofía & Diego', event_type: 'wedding', venue_address: 'Tulum, Quintana Roo', photo: '', date: inMonths(9, 14, 17) },
    tipografico: { title: 'Mariana & Pablo', event_type: 'wedding', venue_address: 'Ciudad de México', photo: '', date: inMonths(6, 9, 19) },
    lacre: { title: 'Valeria & Emiliano', event_type: 'wedding', venue_address: 'Puebla, Puebla', photo: '', date: inMonths(10, 3, 18) },
    brillo: { title: 'Renata', event_type: 'xv', venue_address: 'León, Guanajuato', photo: '/images/couples/ana-carlos-gallery-2.jpg', date: inMonths(4, 16, 20) },
    nube: { title: 'Mateo Emiliano', event_type: 'baby_shower', venue_address: 'Torreón, Coahuila', photo: '', date: inMonths(3, 22, 17) },
    botanico: { title: 'Lucía & Andrés', event_type: 'wedding', venue_address: 'Valle de Guadalupe, Baja California', photo: '', date: inMonths(7, 25, 17) },
};

export function getStdDemoEvent(templateId: string): any | null {
    const d = STD_DEMOS[templateId];
    if (!d) return null;
    return {
        id: `std-demo-${templateId}`,
        slug: `demo-${templateId}`,
        title: d.title,
        event_type: d.event_type,
        date_time: d.date,
        venue_address: d.venue_address,
        plan: 'premium',
        theme_config: { save_the_date_theme: templateId, save_the_date_photo: d.photo, isPremium: true },
    };
}
