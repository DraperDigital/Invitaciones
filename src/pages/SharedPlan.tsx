import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CalendarHeart, MapPin, Wallet, ListChecks, Clock, Boxes, CheckCircle2, Circle, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PINK = '#DF3B94';
const DARK = '#222B38';

const money = (n: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n || 0);
const fmtDate = (v?: string | null) => {
    if (!v) return '';
    const d = new Date(v);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
};
const fmtShort = (v?: string | null) => {
    if (!v) return '';
    const d = new Date(v + 'T00:00:00');
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
};

const PHASES = [
    { key: '3_months', label: 'A 3 meses' },
    { key: '1_month', label: 'A 1 mes' },
    { key: 'week_of', label: 'Semana del evento' },
    { key: 'day_of', label: 'Día del evento' },
    { key: 'after', label: 'Después' },
    { key: 'sin_fase', label: 'Sin fase' },
];
const DAYOF_SECTIONS = [
    { key: 'preparativos', label: 'Preparativos de la pareja' },
    { key: 'montaje', label: 'Horario de montaje' },
    { key: 'ceremonia', label: 'Orden de la ceremonia' },
    { key: 'general', label: 'Recepción y fiesta' },
];

const SharedPlan: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<'loading' | 'ok' | 'invalid' | 'error'>('loading');
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            if (!token) { setStatus('invalid'); return; }
            try {
                const { data: res, error } = await supabase.rpc('get_shared_plan', { p_token: token });
                if (!alive) return;
                if (error) { setStatus('error'); return; }
                if (!res) { setStatus('invalid'); return; }
                setData(res); setStatus('ok');
            } catch {
                if (alive) setStatus('error');
            }
        })();
        return () => { alive = false; };
    }, [token]);

    const ev = data?.event || {};
    const rubros: any[] = data?.rubros || [];
    const quotes: any[] = data?.quotes || [];
    const tasks: any[] = data?.tasks || [];
    const dayOf: any[] = data?.day_of || [];
    const vendors: any[] = data?.vendors || [];
    const rentalItems: any[] = data?.rental_items || [];

    const chosenByRubro = useMemo(() => {
        const m: Record<string, any> = {};
        for (const q of quotes) if (q.is_chosen) m[q.rubro_id] = q;
        return m;
    }, [quotes]);
    const totals = useMemo(() => {
        const estimado = rubros.reduce((n, r) => n + Number(r.estimated_amount || 0), 0);
        const contratado = Object.values(chosenByRubro).reduce((n: number, q: any) => n + Number(q.amount || 0), 0) as number;
        return { estimado, contratado };
    }, [rubros, chosenByRubro]);
    const countdown = useMemo(() => {
        if (!ev.date_time) return null;
        const d = new Date(ev.date_time);
        return isNaN(d.getTime()) ? null : Math.max(0, Math.ceil((d.getTime() - Date.now()) / 86400000));
    }, [ev.date_time]);

    const doneTasks = tasks.filter(t => t.is_done).length;
    const taskPct = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;
    const groupedTasks = useMemo(() => {
        const g: Record<string, any[]> = {};
        for (const t of tasks) (g[t.phase || 'sin_fase'] ||= []).push(t);
        return g;
    }, [tasks]);
    const groupedDay = useMemo(() => {
        const g: Record<string, any[]> = {};
        for (const d of dayOf) (g[d.section] ||= []).push(d);
        return g;
    }, [dayOf]);
    const vendorName = (id: string | null) => (id ? vendors.find(v => v.id === id)?.name : '') || '';

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] text-stone-400">Cargando plan…</div>;
    }
    if (status !== 'ok') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F8F9FA] px-6 text-center">
                <AlertTriangle className="h-10 w-10 text-stone-300" />
                <h1 className="text-xl font-display font-extrabold" style={{ color: DARK }}>
                    {status === 'invalid' ? 'Este enlace ya no está disponible' : 'No se pudo cargar el plan'}
                </h1>
                <p className="max-w-sm text-sm text-stone-500">
                    {status === 'invalid'
                        ? 'El enlace puede haber sido desactivado por los organizadores.'
                        : 'Intenta de nuevo en un momento.'}
                </p>
                <Link to="/" className="rounded-2xl px-6 py-3 text-[11px] uppercase font-bold tracking-widest text-white no-underline" style={{ background: PINK }}>Ir a Invitto</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-16">
            <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 pt-6 sm:pt-10 space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: PINK }}>Plan de evento · Solo lectura</span>
                    <Link to="/" className="no-underline"><img src="/logo.png?v=3" alt="Invitto" className="h-7 w-auto object-contain" /></Link>
                </div>

                {/* Hero */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-[2rem] p-6 sm:p-8 text-white" style={{ background: DARK }}>
                    <div className="min-w-0 space-y-2">
                        <p className="flex items-center gap-2 text-[11px] uppercase font-bold tracking-[0.2em]" style={{ color: PINK }}><CalendarHeart className="h-4 w-4" /> Cuenta regresiva</p>
                        <h1 className="text-2xl sm:text-3xl font-display font-black truncate">{ev.title || 'Evento'}</h1>
                        <p className="text-sm text-slate-300">{fmtDate(ev.date_time) || 'Fecha por definir'}</p>
                        {ev.venue_name && <p className="flex items-center gap-1.5 text-sm text-slate-400 truncate"><MapPin className="h-4 w-4 shrink-0" /> {ev.venue_name}</p>}
                    </div>
                    {countdown != null && (
                        <div className="text-left sm:text-right shrink-0">
                            <p className="font-display font-black leading-none text-5xl sm:text-6xl">{countdown}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">días</p>
                        </div>
                    )}
                </div>

                {/* Presupuesto */}
                {rubros.length > 0 && (
                    <section className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
                        <h2 className="mb-4 flex items-center gap-2 font-display font-extrabold" style={{ color: DARK }}><Wallet className="h-5 w-5" style={{ color: PINK }} /> Presupuesto</h2>
                        <div className="mb-4 flex flex-wrap gap-3">
                            <div className="flex-1 min-w-[120px] rounded-2xl border border-stone-200 p-3">
                                <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Estimado</p>
                                <p className="text-xl font-display font-black" style={{ color: DARK }}>{money(totals.estimado)}</p>
                            </div>
                            <div className="flex-1 min-w-[120px] rounded-2xl border border-stone-200 p-3">
                                <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Contratado</p>
                                <p className="text-xl font-display font-black" style={{ color: PINK }}>{money(totals.contratado)}</p>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            {rubros.map(r => {
                                const chosen = chosenByRubro[r.id];
                                return (
                                    <div key={r.id} className="flex items-center justify-between gap-2 rounded-xl border border-stone-100 px-3 py-2.5">
                                        <span className="truncate font-bold text-sm" style={{ color: DARK }}>{r.name}</span>
                                        <span className="shrink-0 text-xs text-stone-500">
                                            <span className="text-stone-400">{money(Number(r.estimated_amount))}</span>
                                            {chosen && <span className="ml-2 font-bold" style={{ color: '#166534' }}>{money(Number(chosen.amount))}</span>}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Pendientes */}
                {tasks.length > 0 && (
                    <section className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 font-display font-extrabold" style={{ color: DARK }}><ListChecks className="h-5 w-5" style={{ color: PINK }} /> Pendientes</h2>
                            <span className="text-sm font-bold" style={{ color: PINK }}>{doneTasks}/{tasks.length} · {taskPct}%</span>
                        </div>
                        <div className="mb-5 h-2.5 overflow-hidden rounded-full bg-stone-100">
                            <div className="h-full rounded-full" style={{ width: `${taskPct}%`, background: PINK }} />
                        </div>
                        <div className="space-y-4">
                            {PHASES.filter(p => groupedTasks[p.key]?.length).map(p => (
                                <div key={p.key}>
                                    <h3 className="mb-2 text-[10px] uppercase font-bold tracking-widest" style={{ color: PINK }}>{p.label}</h3>
                                    <div className="space-y-1.5">
                                        {groupedTasks[p.key].map(t => (
                                            <div key={t.id} className="flex items-center gap-2.5 rounded-xl border border-stone-100 px-3 py-2">
                                                {t.is_done ? <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: PINK }} /> : <Circle className="h-4 w-4 shrink-0 text-stone-300" />}
                                                <span className={`flex-1 text-sm ${t.is_done ? 'text-stone-400 line-through' : ''}`} style={{ color: t.is_done ? undefined : DARK }}>{t.title}</span>
                                                {t.due_date && <span className="shrink-0 text-[11px] text-stone-400">{fmtShort(t.due_date)}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Itinerario del día */}
                {dayOf.length > 0 && (
                    <section className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
                        <h2 className="mb-4 flex items-center gap-2 font-display font-extrabold" style={{ color: DARK }}><Clock className="h-5 w-5" style={{ color: PINK }} /> Itinerario del día</h2>
                        <div className="space-y-4">
                            {DAYOF_SECTIONS.filter(s => groupedDay[s.key]?.length).map(s => (
                                <div key={s.key}>
                                    <h3 className="mb-2 text-[10px] uppercase font-bold tracking-widest" style={{ color: PINK }}>{s.label}</h3>
                                    <div className="space-y-1.5">
                                        {groupedDay[s.key].map(d => (
                                            <div key={d.id} className="flex items-center gap-3 rounded-xl border border-stone-100 px-3 py-2">
                                                <span className="w-12 shrink-0 font-display font-black text-sm" style={{ color: PINK }}>{d.time || '--:--'}</span>
                                                <span className="flex-1 text-sm" style={{ color: DARK }}>{d.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Materiales */}
                {rentalItems.length > 0 && (
                    <section className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
                        <h2 className="mb-4 flex items-center gap-2 font-display font-extrabold" style={{ color: DARK }}><Boxes className="h-5 w-5" style={{ color: PINK }} /> Materiales de alquiler</h2>
                        <div className="space-y-1.5">
                            {rentalItems.map(m => (
                                <div key={m.id} className="flex items-center justify-between gap-2 rounded-xl border border-stone-100 px-3 py-2">
                                    <span className="truncate text-sm" style={{ color: DARK }}>{m.name} <span className="text-stone-400">× {m.qty}</span>{vendorName(m.vendor_id) ? <span className="text-stone-400"> · {vendorName(m.vendor_id)}</span> : null}</span>
                                    <span className="shrink-0 rounded-full px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider"
                                        style={m.status === 'returned' ? { background: '#dcfce7', color: '#166534' } : { background: '#fef3c7', color: '#92400e' }}>
                                        {m.status === 'returned' ? 'Devuelto' : 'Pendiente'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <p className="pt-2 text-center text-xs text-stone-400">
                    Plan compartido con <Link to="/" className="font-bold no-underline" style={{ color: PINK }}>Invitto</Link> · vista de solo lectura
                </p>
            </div>
        </div>
    );
};

export default SharedPlan;
