import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

// ─────────────────────────────────────────────────────────────────────────────
// usePlanning v2 — modelo rubro → cotizaciones → contrato → pagos.
// Carga las 6 tablas + conteo de confirmados (rsvps) y calcula los agregados en
// JS. Degrada a datos de ejemplo INTERACTIVOS cuando no hay Supabase (mock).
// ─────────────────────────────────────────────────────────────────────────────

export const QUOTE_STATES = ['contactado', 'cotizado', 'contratado', 'descartado'] as const;
export type QuoteState = typeof QUOTE_STATES[number];

const isMock = !import.meta.env.VITE_SUPABASE_URL;
const uid = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Math.random()));
const today = () => new Date().toISOString().slice(0, 10);

// ── Semilla de ejemplo para el modo mock ─────────────────────────────────────
function mockSeed() {
    const rubros = [
        { id: 'r1', name: 'Venue — Iglesia', location: 'iglesia', estimated_amount: 15000, benchmark_pct: 3, is_external: false, sort_order: 1 },
        { id: 'r2', name: 'Venue — Salón', location: 'recepcion', estimated_amount: 120000, benchmark_pct: 12, is_external: false, sort_order: 2 },
        { id: 'r3', name: 'Flores', location: 'ambos', estimated_amount: 35000, benchmark_pct: 6, is_external: false, sort_order: 3 },
        { id: 'r4', name: 'Música', location: 'ambos', estimated_amount: 40000, benchmark_pct: 8, is_external: false, sort_order: 4 },
        { id: 'r5', name: 'Banquete', location: null, estimated_amount: 130000, benchmark_pct: 30, is_external: false, sort_order: 5 },
        { id: 'r6', name: 'Fotografía y video', location: null, estimated_amount: 45000, benchmark_pct: 9, is_external: false, sort_order: 6 },
        { id: 'r7', name: 'Imprevistos', location: null, estimated_amount: 20000, benchmark_pct: 5, is_external: false, sort_order: 7 },
        { id: 'r8', name: 'Invitaciones', location: null, estimated_amount: 0, benchmark_pct: 0, is_external: true, sort_order: 8 },
    ];
    const vendors = [
        { id: 'v1', name: 'Banquetes La Hacienda', category: 'Banquete', phone: '+52 55 1234 5678', email: '', contact_name: 'Sra. Rivera', notes: '' },
        { id: 'v2', name: 'Catering Don Pepe', category: 'Banquete', phone: '+52 55 2222 3333', email: '', contact_name: '', notes: '' },
        { id: 'v3', name: 'Estudio Luz & Lente', category: 'Fotografía y video', phone: '+52 55 9876 5432', email: '', contact_name: 'Marco', notes: '' },
        { id: 'v4', name: 'Flores Primavera', category: 'Flores', phone: '+52 55 4444 5555', email: '', contact_name: '', notes: '' },
    ];
    const quotes = [
        { id: 'q1', rubro_id: 'r5', vendor_id: 'v1', amount: 125000, status: 'contratado', is_chosen: true, quoted_on: '2026-10-01', notes: '' },
        { id: 'q2', rubro_id: 'r5', vendor_id: 'v2', amount: 138000, status: 'descartado', is_chosen: false, quoted_on: '2026-10-03', notes: '' },
        { id: 'q3', rubro_id: 'r6', vendor_id: 'v3', amount: 45000, status: 'contratado', is_chosen: true, quoted_on: '2026-10-05', notes: '' },
        { id: 'q4', rubro_id: 'r3', vendor_id: 'v4', amount: 32000, status: 'cotizado', is_chosen: false, quoted_on: '2026-10-10', notes: '' },
    ];
    const payments = [
        { id: 'p1', quote_id: 'q1', vendor_id: 'v1', label: 'Anticipo 50%', amount: 62500, due_date: '2026-10-15', paid_on: '2026-10-15', status: 'paid' },
        { id: 'p2', quote_id: 'q1', vendor_id: 'v1', label: 'Liquidación', amount: 62500, due_date: '2027-09-20', paid_on: null, status: 'scheduled' },
        { id: 'p3', quote_id: 'q3', vendor_id: 'v3', label: 'Anticipo foto', amount: 20000, due_date: '2026-12-15', paid_on: null, status: 'scheduled' },
    ];
    const wd = Date.now() + 86 * 86400000;
    const dd = (days: number) => new Date(wd - days * 86400000).toISOString().slice(0, 10);
    const tasks = [
        { id: 't1', title: 'Reservar iglesia y salón (fechas)', phase: '3_months', due_date: dd(360), is_done: true, source: 'template', rubro_id: 'r2' },
        { id: 't2', title: 'Pedir cotizaciones de banquete y foto', phase: '3_months', due_date: dd(330), is_done: true, source: 'template', rubro_id: 'r5' },
        { id: 't3', title: 'Comprar los anillos', phase: '3_months', due_date: dd(270), is_done: false, source: 'template', rubro_id: null },
        { id: 't4', title: 'Planear la luna de miel', phase: '3_months', due_date: dd(240), is_done: false, source: 'template', rubro_id: null },
        { id: 't5', title: 'Prueba de menú con el banquete', phase: '1_month', due_date: dd(90), is_done: false, source: 'template', rubro_id: 'r5' },
        { id: 't6', title: 'Enviar invitaciones digitales', phase: '1_month', due_date: dd(60), is_done: false, source: 'template', rubro_id: null },
        { id: 't7', title: 'Liquidar anticipos pendientes', phase: '1_month', due_date: dd(30), is_done: false, source: 'template', rubro_id: null },
        { id: 't8', title: 'Elegir las canciones clave', phase: 'week_of', due_date: dd(10), is_done: false, source: 'template', rubro_id: 'r4' },
        { id: 't9', title: 'Confirmar conteo final con banquete', phase: 'week_of', due_date: dd(7), is_done: false, source: 'template', rubro_id: 'r5' },
        { id: 't10', title: 'Devolver materiales y mobiliario rentado', phase: 'after', due_date: dd(-2), is_done: false, source: 'template', rubro_id: null },
        { id: 't11', title: 'Enviar agradecimientos a los invitados', phase: 'after', due_date: dd(-14), is_done: false, source: 'template', rubro_id: null },
    ];
    const gifts = [
        { id: 'g1', giver_name: 'Tía Rosa', gift: 'Juego de sábanas', amount: 1500, thanked: true, thanked_on: dd(-5) },
        { id: 'g2', giver_name: 'Carlos y Ana', gift: 'Sobre', amount: 3000, thanked: false, thanked_on: null },
        { id: 'g3', giver_name: 'La oficina', gift: 'Cafetera', amount: 2200, thanked: false, thanked_on: null },
    ];
    const dayOf = [
        { id: 'dp1', section: 'preparativos', title: 'Despertar y desayunar', time: '08:00', vendor_id: null, is_done: false, sort_order: 1 },
        { id: 'dp2', section: 'preparativos', title: 'Peluquería y maquillaje', time: '09:30', vendor_id: null, is_done: false, sort_order: 2 },
        { id: 'dp3', section: 'preparativos', title: 'Vestirse', time: '12:00', vendor_id: null, is_done: false, sort_order: 3 },
        { id: 'dp4', section: 'preparativos', title: 'Fotos previas y con la familia', time: '13:30', vendor_id: 'v3', is_done: false, sort_order: 4 },
        { id: 'd1', section: 'montaje', title: 'Llegada de flores a iglesia', time: '09:00', vendor_id: 'v4', is_done: false, sort_order: 1 },
        { id: 'd2', section: 'montaje', title: 'Montaje de salón y mobiliario', time: '11:00', vendor_id: null, is_done: false, sort_order: 2 },
        { id: 'd3', section: 'ceremonia', title: 'Entrada del cortejo', time: '17:00', vendor_id: null, is_done: false, sort_order: 1 },
        { id: 'd4', section: 'ceremonia', title: 'Ceremonia religiosa', time: '17:15', vendor_id: null, is_done: false, sort_order: 2 },
        { id: 'd5', section: 'general', title: 'Primer baile', time: '19:35', vendor_id: null, is_done: false, sort_order: 1 },
        { id: 'd6', section: 'general', title: 'Banquete', time: '20:00', vendor_id: 'v1', is_done: false, sort_order: 2 },
        { id: 'd7', section: 'general', title: 'Partir el pastel', time: '22:30', vendor_id: null, is_done: false, sort_order: 3 },
        { id: 'd8', section: 'general', title: 'Cierre y gran salida', time: '23:30', vendor_id: null, is_done: false, sort_order: 4 },
    ];
    const notes = [
        { id: 'n1', title: 'Pendiente con el banquete', body: 'Preguntar si el menú infantil entra sin costo y confirmar opción vegetariana.', created_at: '2026-11-10' },
        { id: 'n2', title: 'Idea de decoración', body: 'Centros de mesa con eucalipto y velas; cotizar con Flores Primavera.', created_at: '2026-11-12' },
    ];
    return { rubros, vendors, quotes, payments, tasks, dayOf, notes, gifts, confirmed: 112, countdownDays: 86 };
}

export function usePlanning(eventId: string | undefined) {
    const [loading, setLoading] = useState(true);
    const [rubros, setRubros] = useState<any[]>([]);
    const [vendors, setVendors] = useState<any[]>([]);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const [dayOf, setDayOf] = useState<any[]>([]);
    const [notes, setNotes] = useState<any[]>([]);
    const [gifts, setGifts] = useState<any[]>([]);
    const [confirmed, setConfirmed] = useState(0);
    const [countdownDays, setCountdownDays] = useState(0);

    const load = useCallback(async () => {
        if (!eventId) return;
        setLoading(true);

        if (isMock) {
            const s = mockSeed();
            setRubros(s.rubros); setVendors(s.vendors); setQuotes(s.quotes);
            setPayments(s.payments); setTasks(s.tasks); setDayOf(s.dayOf); setNotes(s.notes); setGifts(s.gifts);
            setConfirmed(s.confirmed); setCountdownDays(s.countdownDays);
            setLoading(false);
            return;
        }

        try {
            const [ru, ve, qu, pa, ta, dy, ev, rs, no, gi] = await Promise.all([
                supabase.from('budget_rubros').select('*').eq('event_id', eventId).order('sort_order'),
                supabase.from('vendors').select('*').eq('event_id', eventId).order('created_at'),
                supabase.from('quotes').select('*').eq('event_id', eventId).order('created_at'),
                supabase.from('vendor_payments').select('*').eq('event_id', eventId).order('due_date'),
                supabase.from('tasks').select('*').eq('event_id', eventId).order('sort_order'),
                supabase.from('day_of_items').select('*').eq('event_id', eventId).order('sort_order'),
                supabase.from('events').select('date_time').eq('id', eventId).maybeSingle(),
                supabase.from('rsvps').select('status, plus_ones_confirmed').eq('event_id', eventId).eq('status', 'yes'),
                supabase.from('notes').select('*').eq('event_id', eventId).order('created_at', { ascending: false }),
                supabase.from('gifts').select('*').eq('event_id', eventId).order('created_at', { ascending: false }),
            ]);
            setRubros(ru.data || []); setVendors(ve.data || []); setQuotes(qu.data || []);
            setPayments(pa.data || []); setTasks(ta.data || []); setDayOf(dy.data || []); setNotes(no.data || []); setGifts(gi.data || []);
            const conf = (rs.data || []).reduce((n: number, r: any) => n + 1 + (r.plus_ones_confirmed || 0), 0);
            setConfirmed(conf);
            const date = ev.data?.date_time ? new Date(ev.data.date_time) : null;
            setCountdownDays(date ? Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86400000)) : 0);
        } catch (err) {
            console.error('[usePlanning] load error:', err);
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => { load(); }, [load]);

    // ── Agregados (se calculan en JS desde las filas cargadas) ────────────────
    const chosenByRubro = useMemo(() => {
        const m: Record<string, any> = {};
        for (const q of quotes) if (q.is_chosen) m[q.rubro_id] = q;
        return m;
    }, [quotes]);

    const minQuoteByRubro = useMemo(() => {
        const m: Record<string, number> = {};
        for (const q of quotes) {
            if (q.status === 'descartado') continue;
            const a = Number(q.amount || 0);
            if (m[q.rubro_id] == null || a < m[q.rubro_id]) m[q.rubro_id] = a;
        }
        return m;
    }, [quotes]);

    const totals = useMemo(() => {
        const estimado = rubros.reduce((n, r) => n + Number(r.estimated_amount || 0), 0);
        const contratado = Object.values(chosenByRubro).reduce((n: number, q: any) => n + Number(q.amount || 0), 0) as number;
        // cotizado = contrato si existe, si no la cotización más baja del rubro
        const cotizado = rubros.reduce((n, r) => {
            const chosen = chosenByRubro[r.id];
            if (chosen) return n + Number(chosen.amount || 0);
            return n + (minQuoteByRubro[r.id] || 0);
        }, 0);
        const pagado = payments.filter(p => p.status === 'paid').reduce((n, p) => n + Number(p.amount || 0), 0);
        const pendiente = Math.max(contratado - pagado, 0);
        const costPerGuest = confirmed > 0 ? Math.round(contratado / confirmed) : 0;
        return { estimado, cotizado, contratado, pagado, pendiente, costPerGuest };
    }, [rubros, chosenByRubro, minQuoteByRubro, payments, confirmed]);

    const upcomingPayments = useMemo(
        () => payments.filter(p => p.status !== 'paid' && p.due_date)
            .sort((a, b) => (a.due_date < b.due_date ? -1 : 1)),
        [payments]);

    const nextPayment = upcomingPayments[0] || null;
    const overdueCount = useMemo(
        () => payments.filter(p => p.status !== 'paid' && p.due_date && p.due_date < today()).length,
        [payments]);
    const openTasks = useMemo(() => tasks.filter(t => !t.is_done).length, [tasks]);

    // ── Mutations (optimistas; en mock solo tocan estado local) ───────────────
    async function run(local: () => void, remote: () => PromiseLike<any>) {
        local();
        if (isMock) return;
        const { error } = await remote();
        if (error) console.error('[usePlanning] mutation error:', error);
        return error;
    }

    const seedDefaults = useCallback(async () => {
        if (isMock) { const s = mockSeed(); setRubros(s.rubros); setVendors(s.vendors); setQuotes(s.quotes); setPayments(s.payments); setTasks(s.tasks); setDayOf(s.dayOf); return; }
        if (!eventId) return;
        const { error } = await supabase.rpc('seed_planning_defaults', { p_event_id: eventId });
        if (!error) await load();
        return error;
    }, [eventId, load]);

    const addRubro = useCallback((name: string, estimated_amount: number, location: string | null) => {
        const row = { id: uid(), event_id: eventId, name, estimated_amount, location, is_external: false, sort_order: rubros.length + 1 };
        return run(() => setRubros(p => [...p, row]),
            () => supabase.from('budget_rubros').insert([{ event_id: eventId, name, estimated_amount, location, sort_order: rubros.length + 1 }]));
    }, [eventId, rubros]);

    const updateRubroEstimate = useCallback((id: string, estimated_amount: number) =>
        run(() => setRubros(p => p.map(r => r.id === id ? { ...r, estimated_amount } : r)),
            () => supabase.from('budget_rubros').update({ estimated_amount }).eq('id', id)), []);

    const addVendor = useCallback((v: { name: string; category?: string; phone?: string; email?: string; contact_name?: string }) => {
        const row = { id: uid(), event_id: eventId, notes: '', ...v };
        return run(() => setVendors(p => [...p, row]),
            () => supabase.from('vendors').insert([{ event_id: eventId, ...v }]));
    }, [eventId]);

    const updateVendor = useCallback((id: string, patch: Record<string, any>) =>
        run(() => setVendors(p => p.map(v => v.id === id ? { ...v, ...patch } : v)),
            () => supabase.from('vendors').update(patch).eq('id', id)), []);

    const deleteVendor = useCallback((id: string) =>
        run(() => { setVendors(p => p.filter(v => v.id !== id)); setQuotes(p => p.filter(q => q.vendor_id !== id)); },
            () => supabase.from('vendors').delete().eq('id', id)), []);

    const addQuote = useCallback((rubro_id: string, vendor_id: string, amount: number, status: QuoteState) => {
        const row = { id: uid(), event_id: eventId, rubro_id, vendor_id, amount, status, is_chosen: false, quoted_on: today() };
        return run(() => setQuotes(p => [...p, row]),
            () => supabase.from('quotes').insert([{ event_id: eventId, rubro_id, vendor_id, amount, status, quoted_on: today() }]));
    }, [eventId]);

    const setQuoteStatus = useCallback((id: string, status: QuoteState) =>
        run(() => setQuotes(p => p.map(q => q.id === id ? { ...q, status } : q)),
            () => supabase.from('quotes').update({ status }).eq('id', id)), []);

    // Elegir cotización = contrato del rubro (las demás del rubro → descartadas)
    const chooseQuote = useCallback((quote: any) => {
        return run(() => setQuotes(p => p.map(q => {
            if (q.id === quote.id) return { ...q, is_chosen: true, status: 'contratado' };
            if (q.rubro_id === quote.rubro_id) return { ...q, is_chosen: false, status: q.status === 'contratado' ? 'cotizado' : q.status };
            return q;
        })), async () => {
            await supabase.from('quotes').update({ is_chosen: false }).eq('rubro_id', quote.rubro_id).eq('event_id', eventId);
            return supabase.from('quotes').update({ is_chosen: true, status: 'contratado' }).eq('id', quote.id);
        });
    }, [eventId]);

    const addPayment = useCallback((quote: any, label: string, amount: number, due_date: string) => {
        const due = due_date || null;
        const row = { id: uid(), event_id: eventId, quote_id: quote.id, vendor_id: quote.vendor_id, label, amount, due_date: due, paid_on: null, status: 'scheduled' };
        return run(() => setPayments(p => [...p, row]),
            () => supabase.from('vendor_payments').insert([{ event_id: eventId, quote_id: quote.id, vendor_id: quote.vendor_id, label, amount, due_date: due, status: 'scheduled' }]));
    }, [eventId]);

    const markPaymentPaid = useCallback((id: string) =>
        run(() => setPayments(p => p.map(x => x.id === id ? { ...x, status: 'paid', paid_on: today() } : x)),
            () => supabase.from('vendor_payments').update({ status: 'paid', paid_on: today() }).eq('id', id)), []);

    const addTask = useCallback((title: string, phase: string) => {
        const row = { id: uid(), event_id: eventId, title, phase, is_done: false, source: 'custom', rubro_id: null };
        return run(() => setTasks(p => [...p, row]),
            () => supabase.from('tasks').insert([{ event_id: eventId, title, phase, source: 'custom', sort_order: tasks.length + 1 }]));
    }, [eventId, tasks]);

    const toggleTask = useCallback((id: string, is_done: boolean) =>
        run(() => setTasks(p => p.map(t => t.id === id ? { ...t, is_done, done_at: is_done ? new Date().toISOString() : null } : t)),
            () => supabase.from('tasks').update({ is_done, done_at: is_done ? new Date().toISOString() : null }).eq('id', id)), []);

    const toggleDayOf = useCallback((id: string, is_done: boolean) =>
        run(() => setDayOf(p => p.map(d => d.id === id ? { ...d, is_done } : d)),
            () => supabase.from('day_of_items').update({ is_done }).eq('id', id)), []);

    const addNote = useCallback((title: string, body: string) => {
        const row = { id: uid(), event_id: eventId, title, body, created_at: today() };
        return run(() => setNotes(p => [row, ...p]),
            () => supabase.from('notes').insert([{ event_id: eventId, title, body }]));
    }, [eventId]);

    const updateNote = useCallback((id: string, patch: { title?: string; body?: string }) =>
        run(() => setNotes(p => p.map(n => n.id === id ? { ...n, ...patch } : n)),
            () => supabase.from('notes').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)), []);

    const deleteNote = useCallback((id: string) =>
        run(() => setNotes(p => p.filter(n => n.id !== id)),
            () => supabase.from('notes').delete().eq('id', id)), []);

    const addGift = useCallback((giver_name: string, gift: string, amount: number | null) => {
        const row = { id: uid(), event_id: eventId, giver_name, gift, amount, thanked: false, thanked_on: null };
        return run(() => setGifts(p => [row, ...p]),
            () => supabase.from('gifts').insert([{ event_id: eventId, giver_name, gift, amount }]));
    }, [eventId]);

    const toggleThanked = useCallback((id: string, thanked: boolean) =>
        run(() => setGifts(p => p.map(g => g.id === id ? { ...g, thanked, thanked_on: thanked ? today() : null } : g)),
            () => supabase.from('gifts').update({ thanked, thanked_on: thanked ? today() : null }).eq('id', id)), []);

    const deleteGift = useCallback((id: string) =>
        run(() => setGifts(p => p.filter(g => g.id !== id)),
            () => supabase.from('gifts').delete().eq('id', id)), []);

    return {
        loading, rubros, vendors, quotes, payments, tasks, dayOf, notes, gifts, confirmed, countdownDays,
        chosenByRubro, minQuoteByRubro, totals, upcomingPayments, nextPayment, overdueCount, openTasks,
        reload: load,
        seedDefaults, addRubro, updateRubroEstimate, addVendor, updateVendor, deleteVendor,
        addQuote, setQuoteStatus, chooseQuote, addPayment, markPaymentPaid,
        addTask, toggleTask, toggleDayOf,
        addNote, updateNote, deleteNote,
        addGift, toggleThanked, deleteGift,
    };
}
