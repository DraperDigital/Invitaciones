import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
    Compass, Wallet, Store, ListChecks, CalendarHeart, Crown, ChevronDown, ChevronRight,
    CalendarClock, AlertTriangle, CheckCircle2, Circle, Plus, Sparkles, Phone, Check,
    MapPin, Trash2, Pencil, CalendarDays, Download, StickyNote, Gift,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import { usePlanning, QUOTE_STATES, type QuoteState } from '../../hooks/usePlanning';

const PINK = '#DF3B94';
const DARK = '#222B38';

const money = (n: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n || 0);

const fmtDate = (v?: string | null) => {
    if (!v) return '';
    const d = new Date(v);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
};
const monthLabel = (iso: string) => {
    const d = new Date(iso + 'T00:00:00');
    return isNaN(d.getTime()) ? 'Sin fecha' : d.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
};
const fmtShort = (v?: string | null) => {
    if (!v) return '';
    const d = new Date(v + 'T00:00:00');
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
};

// Export del presupuesto a CSV (Excel lo abre nativo; sin dependencias).
const downloadBudgetCSV = (rubros: any[], chosenByRubro: Record<string, any>, totals: any) => {
    const esc = (s: any) => `"${String(s ?? '').replace(/"/g, '""')}"`;
    const total = Number(totals.estimado) || 0;
    const lines = [['Rubro', 'Lugar', '% ref', 'Guía (media)', 'Estimado', 'Contratado'].join(',')];
    for (const r of rubros) {
        const guia = Math.round(total * (Number(r.benchmark_pct) || 0) / 100);
        const chosen = chosenByRubro[r.id];
        lines.push([esc(r.name), esc(LOC_LABEL[r.location] || r.location || ''), (Number(r.benchmark_pct) || 0) + '%',
            guia, Number(r.estimated_amount) || 0, chosen ? Number(chosen.amount) : ''].join(','));
    }
    lines.push(['Total', '', '', '', Number(totals.estimado) || 0, Number(totals.contratado) || 0].join(','));
    const csv = '﻿' + lines.join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'Presupuesto.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

const PHASES = [
    { key: '3_months', label: 'A 3 meses' },
    { key: '1_month', label: 'A 1 mes' },
    { key: 'week_of', label: 'Semana del evento' },
    { key: 'day_of', label: 'Día del evento' },
    { key: 'after', label: 'Después' },
    { key: 'sin_fase', label: 'Sin fase' },
];

const LOC_LABEL: Record<string, string> = { iglesia: 'Iglesia', recepcion: 'Salón', ambos: 'Ambos' };

const QUOTE_CHIP: Record<QuoteState, { bg: string; fg: string; label: string }> = {
    contactado: { bg: '#f5f5f4', fg: '#78716c', label: 'Contactado' },
    cotizado: { bg: '#fef3c7', fg: '#92400e', label: 'Cotizado' },
    contratado: { bg: '#dcfce7', fg: '#166534', label: 'Contratado' },
    descartado: { bg: '#fafaf9', fg: '#a8a29e', label: 'Descartado' },
};

type SubTab = 'copiloto' | 'presupuesto' | 'proveedores' | 'pendientes' | 'dia' | 'notas' | 'despues';
type Planning = ReturnType<typeof usePlanning>;

const PlanningPage: React.FC = () => {
    const { id: routeEventId } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();

    const [userEvents, setUserEvents] = useState<any[]>([]);
    const [activeEvent, setActiveEvent] = useState<any>(null);
    const [eventId, setEventId] = useState<string | undefined>(routeEventId || searchParams.get('event') || undefined);
    const [tab, setTab] = useState<SubTab>('copiloto');

    const mockMode = !import.meta.env.VITE_SUPABASE_URL;
    const { hasFeature, currentPlan, isLoading: accessLoading } = useFeatureAccess(eventId, mockMode ? 'pro' : undefined);
    const planning = usePlanning(eventId);

    useEffect(() => {
        if (!user) return;
        if (mockMode) {
            setUserEvents([{ id: 'mock-event-id', title: 'Boda Ana & Luis (demo)' }]);
            if (!eventId) setEventId('mock-event-id');
            return;
        }
        (async () => {
            const { data } = await supabase.from('events').select('id,title')
                .eq('user_id', user.id).order('created_at', { ascending: false });
            setUserEvents(data || []);
            if (!eventId) {
                const stored = localStorage.getItem(`last_managed_event_id_${user.id}`);
                const next = stored || data?.[0]?.id;
                if (next) setEventId(next);
            }
        })();
    }, [user]);

    useEffect(() => {
        if (!eventId) return;
        if (mockMode) {
            setActiveEvent({ title: 'Boda Ana & Luis', date_time: new Date(Date.now() + 86 * 86400000).toISOString(), venue_name: 'Jardín Los Encinos' });
            return;
        }
        supabase.from('events').select('title,date_time,venue_name').eq('id', eventId).maybeSingle()
            .then(({ data }) => setActiveEvent(data));
    }, [eventId]);

    const handleEventChange = (id: string) => {
        if (!id) return;
        setEventId(id);
        if (user) localStorage.setItem(`last_managed_event_id_${user.id}`, id);
        navigate(`/dashboard/planeacion/${id}`);
    };

    const locked = !accessLoading && !hasFeature('event_planning');

    if (!user) return <div className="py-20 text-center text-stone-500">Inicia sesión para ver tu planeación.</div>;

    if (!eventId) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-display font-extrabold mb-4">Elige un evento para planear</h2>
                <select onChange={(e) => handleEventChange(e.target.value)} defaultValue=""
                    className="p-3 border border-stone-200 rounded-xl outline-none">
                    <option value="">Seleccionar...</option>
                    {userEvents.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                </select>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: PINK }}>Planeación · Premium</p>
                    <div className="relative inline-block">
                        <select value={eventId} onChange={(e) => handleEventChange(e.target.value)}
                            className="pr-8 text-2xl md:text-3xl font-display font-black bg-transparent outline-none border-b border-stone-200 focus:border-[#DF3B94] py-1 cursor-pointer"
                            style={{ color: DARK }}>
                            {userEvents.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                        </select>
                        <ChevronDown className="h-4 w-4 text-stone-400 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>

            {locked ? (
                <UpgradeState planName={currentPlan?.name} />
            ) : (
                <>
                    <SubTabs tab={tab} setTab={setTab} planning={planning} />
                    {planning.loading ? (
                        <div className="py-20 text-center text-stone-400">Cargando planeación…</div>
                    ) : (
                        <>
                            {tab === 'copiloto' && <Copiloto planning={planning} setTab={setTab} event={activeEvent} />}
                            {tab === 'presupuesto' && <Presupuesto planning={planning} toast={toast} />}
                            {tab === 'proveedores' && <Proveedores planning={planning} toast={toast} />}
                            {tab === 'pendientes' && <Pendientes planning={planning} toast={toast} />}
                            {tab === 'dia' && <DiaB planning={planning} event={activeEvent} />}
                            {tab === 'notas' && <Notas planning={planning} toast={toast} />}
                            {tab === 'despues' && <DespuesBoda planning={planning} toast={toast} />}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

// ── Upgrade ───────────────────────────────────────────────────────────────────
const UpgradeState: React.FC<{ planName?: string }> = ({ planName }) => (
    <div className="rounded-[2.5rem] border border-stone-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: `${PINK}1a`, color: PINK }}>
            <Crown className="h-8 w-8" />
        </div>
        <h3 className="text-3xl font-display font-extrabold" style={{ color: DARK }}>Planeación es parte del plan Pro</h3>
        <p className="mx-auto mt-3 max-w-md text-stone-600">
            Tu plan actual{planName ? ` (${planName})` : ''} incluye la invitación y las confirmaciones. Planeación suma
            presupuesto por rubros, cotizaciones, contratos, pagos y la carpeta del día.
        </p>
        <Link to="/planes" className="mt-8 inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-[11px] uppercase font-bold tracking-[0.2em] text-white shadow-xl hover:opacity-90"
            style={{ background: PINK }}>
            <Crown className="h-4 w-4" /> Mejorar a Pro
        </Link>
    </div>
);

// ── Subtabs ─────────────────────────────────────────────────────────────────
const SubTabs: React.FC<{ tab: SubTab; setTab: (t: SubTab) => void; planning: Planning }> = ({ tab, setTab, planning }) => {
    const items: { key: SubTab; label: string; icon: any; badge?: number }[] = [
        { key: 'copiloto', label: 'Resumen', icon: Compass },
        { key: 'presupuesto', label: 'Presupuesto', icon: Wallet },
        { key: 'proveedores', label: 'Proveedores', icon: Store },
        { key: 'pendientes', label: 'Pendientes', icon: ListChecks, badge: planning.openTasks || undefined },
        { key: 'dia', label: 'Día B', icon: CalendarHeart },
        { key: 'notas', label: 'Notas', icon: StickyNote },
        { key: 'despues', label: 'Después', icon: Gift },
    ];
    return (
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap rounded-2xl border border-stone-200 bg-white p-1.5 no-scrollbar">
            {items.map(({ key, label, icon: Icon, badge }) => {
                const active = tab === key;
                return (
                    <button key={key} onClick={() => setTab(key)}
                        className={`flex items-center gap-2 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${active ? 'text-white shadow-md' : 'text-stone-500 hover:bg-stone-50'}`}
                        style={active ? { background: DARK } : undefined}>
                        <Icon className="h-4 w-4" style={active ? { color: PINK } : undefined} />
                        {label}
                        {badge ? <span className="ml-1 rounded-full px-1.5 py-0.5 text-[10px]" style={{ background: PINK, color: '#fff' }}>{badge}</span> : null}
                    </button>
                );
            })}
        </div>
    );
};

// ── Resumen (Copiloto) ────────────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: string; hint?: string; accent?: boolean }> = ({ label, value, hint, accent }) => (
    <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">{label}</p>
        <p className="mt-1.5 text-2xl font-display font-black" style={{ color: accent ? PINK : DARK }}>{value}</p>
        {hint && <p className="mt-1 text-xs text-stone-400">{hint}</p>}
    </div>
);

const Copiloto: React.FC<{ planning: Planning; setTab: (t: SubTab) => void; event: any }> = ({ planning, setTab, event }) => {
    const { totals, confirmed, countdownDays, nextPayment, overdueCount, tasks, vendors } = planning;
    const vendorName = (id: string) => vendors.find(v => v.id === id)?.name || '';
    const doneTasks = tasks.filter(t => t.is_done).length;
    const taskPct = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Hero: cuenta regresiva grande + datos del evento */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-[2rem] p-8 text-white" style={{ background: DARK }}>
                <div className="space-y-2">
                    <p className="text-[11px] uppercase font-bold tracking-[0.2em]" style={{ color: PINK }}>Cuenta regresiva</p>
                    <h2 className="text-2xl font-display font-black">{event?.title || 'Tu evento'}</h2>
                    <p className="text-sm text-slate-300">{fmtDate(event?.date_time) || 'Fecha por definir'}</p>
                    {event?.venue_name && <p className="flex items-center gap-1.5 text-sm text-slate-400"><MapPin className="h-4 w-4" /> {event.venue_name}</p>}
                </div>
                <div className="text-center sm:text-right">
                    <p className="font-display font-black leading-none" style={{ fontSize: '4.5rem', color: '#fff' }}>{countdownDays}</p>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">días</p>
                </div>
            </div>

            {/* Lo que sigue */}
            {nextPayment && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border-2 p-6"
                    style={{ borderColor: `${PINK}55`, background: `${PINK}0d` }}>
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: PINK, color: '#fff' }}>
                            <CalendarClock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">Lo que sigue</p>
                            <p className="text-lg font-display font-extrabold" style={{ color: DARK }}>{nextPayment.label || 'Pago'} — {money(nextPayment.amount)}</p>
                            <p className="text-xs text-stone-500">{vendorName(nextPayment.vendor_id) ? `${vendorName(nextPayment.vendor_id)} · ` : ''}{nextPayment.due_date}</p>
                        </div>
                    </div>
                    <button onClick={() => setTab('presupuesto')} className="rounded-2xl px-6 py-3 text-[11px] uppercase font-bold tracking-widest text-white" style={{ background: DARK }}>Ver pagos</button>
                </div>
            )}

            {overdueCount > 0 && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="text-sm font-bold">{overdueCount} pago(s) vencido(s) sin liquidar.</p>
                </div>
            )}

            {/* Progreso de tareas */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-display font-extrabold" style={{ color: DARK }}>Avance de tareas</h3>
                    <button onClick={() => setTab('pendientes')} className="text-xs font-bold" style={{ color: PINK }}>Ver pendientes →</button>
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-stone-100">
                        <div className="h-full rounded-full transition-all" style={{ width: `${taskPct}%`, background: PINK }} />
                    </div>
                    <span className="text-sm font-bold" style={{ color: DARK }}>{taskPct}%</span>
                </div>
                <p className="mt-2 text-xs text-stone-400">{doneTasks} de {tasks.length} hechas</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Confirmados (RSVP)" value={`${confirmed}`} hint="En vivo" />
                <StatCard label="Costo por invitado" value={money(totals.costPerGuest)} accent hint="Contratado ÷ confirmados" />
                <StatCard label="Contratado" value={money(totals.contratado)} />
                <StatCard label="Pendiente por pagar" value={money(totals.pendiente)} />
            </div>
        </div>
    );
};

// ── Presupuesto ───────────────────────────────────────────────────────────────
const TotalPill: React.FC<{ label: string; value: string; accent?: boolean }> = ({ label, value, accent }) => (
    <div className="flex-1 min-w-[130px] rounded-2xl border border-stone-200 bg-white px-4 py-3">
        <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">{label}</p>
        <p className="text-xl font-display font-black" style={{ color: accent ? PINK : DARK }}>{value}</p>
    </div>
);

const Presupuesto: React.FC<{ planning: Planning; toast: any }> = ({ planning, toast }) => {
    const { rubros, totals, addRubro } = planning;
    const [view, setView] = useState<'partidas' | 'pagos'>('partidas');
    const [open, setOpen] = useState<string | null>(null);
    const [nn, setNn] = useState(''); const [na, setNa] = useState('');

    const submit = async () => {
        if (!nn.trim()) return;
        await addRubro(nn.trim(), Number(na) || 0, null);
        setNn(''); setNa(''); toast.success('Rubro agregado');
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
                <TotalPill label="Estimado" value={money(totals.estimado)} />
                <TotalPill label="Cotizado" value={money(totals.cotizado)} />
                <TotalPill label="Contratado" value={money(totals.contratado)} />
                <TotalPill label="Pagado" value={money(totals.pagado)} accent />
            </div>

            {/* Sub-vistas + export */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex gap-1 rounded-2xl border border-stone-200 bg-white p-1">
                    {([['partidas', 'Partidas'], ['pagos', 'Calendario de pagos']] as const).map(([k, label]) => (
                        <button key={k} onClick={() => setView(k)}
                            className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider ${view === k ? 'text-white' : 'text-stone-500'}`}
                            style={view === k ? { background: DARK } : undefined}>{label}</button>
                    ))}
                </div>
                <button onClick={() => downloadBudgetCSV(rubros, planning.chosenByRubro, totals)}
                    className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-600 hover:border-[#DF3B94] hover:text-[#DF3B94]">
                    <Download className="h-4 w-4" /> Excel (CSV)
                </button>
            </div>

            {view === 'partidas' ? (
                <>
                    <div className="flex flex-col sm:flex-row gap-3 rounded-3xl border border-stone-200 bg-white p-4">
                        <input value={nn} onChange={e => setNn(e.target.value)} placeholder="Nuevo rubro (ej. Pastel)"
                            className="flex-1 rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 outline-none focus:border-[#DF3B94]" />
                        <input value={na} onChange={e => setNa(e.target.value)} placeholder="Estimado MXN" type="number"
                            className="w-full sm:w-44 rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 outline-none focus:border-[#DF3B94]" />
                        <button onClick={submit} className="flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-xs font-bold uppercase tracking-widest text-white" style={{ background: PINK }}>
                            <Plus className="h-4 w-4" /> Agregar
                        </button>
                    </div>
                    <div className="space-y-2">
                        {rubros.map(r => (
                            <RubroRow key={r.id} rubro={r} planning={planning} toast={toast}
                                expanded={open === r.id} onToggle={() => setOpen(open === r.id ? null : r.id)} />
                        ))}
                    </div>
                </>
            ) : (
                <PagosCalendar planning={planning} toast={toast} />
            )}
        </div>
    );
};

// Calendario de pagos: todos los pagos agrupados por mes
const PagosCalendar: React.FC<{ planning: Planning; toast: any }> = ({ planning, toast }) => {
    const { payments, vendors, markPaymentPaid, totals } = planning;
    const vendorName = (id: string) => vendors.find(v => v.id === id)?.name || '—';
    const sorted = [...payments].sort((a, b) => ((a.due_date || '9999') < (b.due_date || '9999') ? -1 : 1));
    const groups = useMemo(() => {
        const g: Record<string, any[]> = {};
        for (const p of sorted) { const k = p.due_date ? monthLabel(p.due_date) : 'Sin fecha'; (g[k] ||= []).push(p); }
        return g;
    }, [payments]);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
                <TotalPill label="Pagado" value={money(totals.pagado)} accent />
                <TotalPill label="Pendiente por pagar" value={money(totals.pendiente)} />
            </div>
            {Object.keys(groups).length === 0 && (
                <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center text-stone-400">
                    Aún no hay pagos. Agrégalos en cada contrato dentro de Partidas.
                </div>
            )}
            {Object.entries(groups).map(([label, items]) => (
                <div key={label} className="rounded-3xl border border-stone-200 bg-white p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-[11px] uppercase font-bold tracking-widest capitalize" style={{ color: PINK }}>
                        <CalendarDays className="h-4 w-4" /> {label}
                    </h3>
                    <div className="space-y-2">
                        {items.map(p => {
                            const overdue = p.status !== 'paid' && p.due_date && p.due_date < new Date().toISOString().slice(0, 10);
                            return (
                                <div key={p.id} className="flex items-center justify-between gap-2 rounded-2xl border p-3"
                                    style={{ borderColor: overdue ? '#fecdd3' : '#f5f5f4', background: overdue ? '#fff1f2' : '#fff' }}>
                                    <div className="min-w-0">
                                        <p className="truncate font-bold" style={{ color: DARK }}>{p.label || 'Pago'} · {money(Number(p.amount))}</p>
                                        <p className="text-xs text-stone-500">{vendorName(p.vendor_id)} · {p.due_date || 'sin fecha'}{overdue ? ' · vencido' : ''}</p>
                                    </div>
                                    {p.status === 'paid'
                                        ? <span className="rounded-full px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider" style={{ background: '#dcfce7', color: '#166534' }}>Pagado</span>
                                        : <button onClick={async () => { await markPaymentPaid(p.id); toast.success('Marcado como pagado'); }}
                                            className="rounded-lg px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-white" style={{ background: PINK }}>Pagar</button>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

const RubroRow: React.FC<{ rubro: any; planning: Planning; toast: any; expanded: boolean; onToggle: () => void }> = ({ rubro, planning, toast, expanded, onToggle }) => {
    const { quotes, vendors, payments, chosenByRubro, minQuoteByRubro, updateRubroEstimate, addQuote, chooseQuote, addPayment, markPaymentPaid } = planning;
    const myQuotes = quotes.filter(q => q.rubro_id === rubro.id);
    const chosen = chosenByRubro[rubro.id];
    const cotizado = chosen ? Number(chosen.amount) : (minQuoteByRubro[rubro.id] || 0);
    const est = Number(rubro.estimated_amount || 0);
    const pct = Number(rubro.benchmark_pct || 0);
    const guia = Math.round(planning.totals.estimado * pct / 100);
    const guiaDiff = guia > 0 ? Math.round((est - guia) / guia * 100) : 0;

    const [qv, setQv] = useState(''); const [qa, setQa] = useState(''); const [qs, setQs] = useState<QuoteState>('cotizado');
    const [pl, setPl] = useState(''); const [pa, setPa] = useState(''); const [pd, setPd] = useState('');

    const vendorName = (id: string) => vendors.find(v => v.id === id)?.name || '—';
    const myPayments = chosen ? payments.filter(p => p.quote_id === chosen.id) : [];

    const submitQuote = async () => {
        if (!qv || !qa) return toast.error('Elige proveedor y monto');
        await addQuote(rubro.id, qv, Number(qa), qs);
        setQv(''); setQa(''); toast.success('Cotización agregada');
    };
    const submitPayment = async () => {
        if (!chosen || !pa) return;
        await addPayment(chosen, pl || 'Pago', Number(pa), pd || '');
        setPl(''); setPa(''); setPd(''); toast.success('Pago agregado');
    };

    return (
        <div className="rounded-2xl border border-stone-200 bg-white">
            <button onClick={onToggle} className="grid w-full grid-cols-12 items-center gap-2 px-5 py-4 text-left">
                <div className="col-span-5 flex items-center gap-2">
                    {expanded ? <ChevronDown className="h-4 w-4 text-stone-400" /> : <ChevronRight className="h-4 w-4 text-stone-400" />}
                    <span className="font-display font-bold" style={{ color: DARK }}>{rubro.name}</span>
                    {rubro.location && <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[9px] uppercase tracking-wider text-stone-500">{LOC_LABEL[rubro.location] || rubro.location}</span>}
                    {rubro.is_external && <span className="rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider" style={{ background: `${PINK}1a`, color: PINK }}>Invitto</span>}
                </div>
                <div className="col-span-2 text-right text-xs text-stone-400">
                    <span className="block text-[9px] uppercase tracking-wider">Estimado</span>
                    <span className="font-bold text-stone-700">{money(est)}</span>
                    {guia > 0 && <span className="block text-[9px] text-stone-400">guía {money(guia)}</span>}
                </div>
                <div className="col-span-2 text-right text-xs text-stone-400">
                    <span className="block text-[9px] uppercase tracking-wider">Cotizado</span>
                    <span className="font-bold text-stone-700">{cotizado ? money(cotizado) : '—'}</span>
                </div>
                <div className="col-span-3 text-right text-xs">
                    <span className="block text-[9px] uppercase tracking-wider text-stone-400">Contratado</span>
                    {chosen
                        ? <span className="font-bold" style={{ color: '#166534' }}>{money(Number(chosen.amount))}</span>
                        : <span className="text-stone-400">{myQuotes.length} cotización(es)</span>}
                </div>
            </button>

            {expanded && (
                <div className="border-t border-stone-100 px-5 py-4 space-y-4">
                    <div className="flex items-center gap-3">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Presupuesto estimado</label>
                        <input type="number" defaultValue={Number(rubro.estimated_amount)}
                            onBlur={e => { const v = Number(e.target.value); if (v !== Number(rubro.estimated_amount)) updateRubroEstimate(rubro.id, v); }}
                            className="w-32 rounded-lg border border-stone-200 p-1.5 text-right font-medium outline-none focus:border-[#DF3B94]" />
                    </div>
                    {guia > 0 && (
                        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#F8F9FA] px-3 py-2 text-xs text-stone-500">
                            <span>Media sugerida: <span className="font-bold" style={{ color: DARK }}>{money(guia)}</span> ({pct}% del total)</span>
                            {Math.abs(guiaDiff) <= 10
                                ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">en la media</span>
                                : guiaDiff > 10
                                    ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">{guiaDiff}% arriba de la media</span>
                                    : <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">{Math.abs(guiaDiff)}% debajo de la media</span>}
                        </div>
                    )}

                    <div>
                        <p className="mb-2 text-[10px] uppercase font-bold tracking-widest text-stone-400">Cotizaciones</p>
                        <div className="space-y-2">
                            {myQuotes.length === 0 && <p className="text-sm text-stone-400">Sin cotizaciones. Agrega la primera abajo.</p>}
                            {myQuotes.map(q => {
                                const chip = QUOTE_CHIP[q.status as QuoteState] || QUOTE_CHIP.cotizado;
                                return (
                                    <div key={q.id} className="flex items-center justify-between gap-2 rounded-xl border border-stone-100 p-3">
                                        <div className="min-w-0">
                                            <p className="truncate font-bold" style={{ color: DARK }}>{vendorName(q.vendor_id)}</p>
                                            <p className="text-xs text-stone-500">{money(Number(q.amount))}{q.quoted_on ? ` · ${q.quoted_on}` : ''}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-full px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider" style={{ background: chip.bg, color: chip.fg }}>{chip.label}</span>
                                            {q.is_chosen
                                                ? <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: '#166534' }}><Check className="h-3.5 w-3.5" /> Contrato</span>
                                                : <button onClick={() => chooseQuote(q)} className="rounded-lg px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-white" style={{ background: DARK }}>Elegir</button>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <select value={qv} onChange={e => setQv(e.target.value)} className="min-w-[160px] flex-1 rounded-xl border border-stone-200 bg-[#F8F9FA] p-2.5 text-sm outline-none focus:border-[#DF3B94]">
                                <option value="">Proveedor…</option>
                                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                            <input value={qa} onChange={e => setQa(e.target.value)} type="number" placeholder="Monto"
                                className="w-28 rounded-xl border border-stone-200 bg-[#F8F9FA] p-2.5 text-sm outline-none focus:border-[#DF3B94]" />
                            <select value={qs} onChange={e => setQs(e.target.value as QuoteState)} className="rounded-xl border border-stone-200 bg-[#F8F9FA] p-2.5 text-sm outline-none focus:border-[#DF3B94]">
                                {QUOTE_STATES.filter(s => s !== 'descartado').map(s => <option key={s} value={s}>{QUOTE_CHIP[s].label}</option>)}
                            </select>
                            <button onClick={submitQuote} className="rounded-xl px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest text-white" style={{ background: PINK }}>Añadir</button>
                        </div>
                        {vendors.length === 0 && <p className="mt-2 text-xs text-stone-400">Agrega proveedores en la pestaña Proveedores para cotizar.</p>}
                    </div>

                    {chosen && (
                        <div>
                            <p className="mb-2 text-[10px] uppercase font-bold tracking-widest text-stone-400">Pagos del contrato</p>
                            <div className="space-y-2">
                                {myPayments.length === 0 && <p className="text-sm text-stone-400">Sin pagos aún.</p>}
                                {myPayments.map(p => (
                                    <div key={p.id} className="flex items-center justify-between rounded-xl border border-stone-100 p-3">
                                        <div>
                                            <p className="font-bold" style={{ color: DARK }}>{p.label} · {money(Number(p.amount))}</p>
                                            <p className="text-xs text-stone-500">{p.due_date || 'sin fecha'}{p.status === 'paid' ? ` · pagado ${p.paid_on}` : ''}</p>
                                        </div>
                                        {p.status === 'paid'
                                            ? <span className="rounded-full px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider" style={{ background: '#dcfce7', color: '#166534' }}>Pagado</span>
                                            : <button onClick={() => markPaymentPaid(p.id)} className="rounded-lg px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-white" style={{ background: PINK }}>Pagar</button>}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <input value={pl} onChange={e => setPl(e.target.value)} placeholder="Concepto (Anticipo…)"
                                    className="min-w-[150px] flex-1 rounded-xl border border-stone-200 bg-[#F8F9FA] p-2.5 text-sm outline-none focus:border-[#DF3B94]" />
                                <input value={pa} onChange={e => setPa(e.target.value)} type="number" placeholder="Monto"
                                    className="w-28 rounded-xl border border-stone-200 bg-[#F8F9FA] p-2.5 text-sm outline-none focus:border-[#DF3B94]" />
                                <input value={pd} onChange={e => setPd(e.target.value)} type="date"
                                    className="rounded-xl border border-stone-200 bg-[#F8F9FA] p-2.5 text-sm outline-none focus:border-[#DF3B94]" />
                                <button onClick={submitPayment} className="rounded-xl px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest text-white" style={{ background: DARK }}>Añadir pago</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ── Proveedores (directorio + ficha editable) ─────────────────────────────────
const Proveedores: React.FC<{ planning: Planning; toast: any }> = ({ planning, toast }) => {
    const { vendors, quotes, rubros, addVendor, updateVendor, deleteVendor } = planning;
    const [sel, setSel] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', category: '', phone: '', contact_name: '' });
    const [edit, setEdit] = useState({ name: '', category: '', phone: '', contact_name: '', notes: '' });

    const rubroName = (id: string) => rubros.find(r => r.id === id)?.name || '—';
    const selected = vendors.find(v => v.id === sel) || null;
    const selectedQuotes = selected ? quotes.filter(q => q.vendor_id === selected.id) : [];

    const submit = async () => {
        if (!form.name.trim()) return;
        await addVendor({ name: form.name.trim(), category: form.category, phone: form.phone, contact_name: form.contact_name });
        setForm({ name: '', category: '', phone: '', contact_name: '' });
        toast.success('Proveedor agregado');
    };
    const startEdit = (v: any) => { setEdit({ name: v.name || '', category: v.category || '', phone: v.phone || '', contact_name: v.contact_name || '', notes: v.notes || '' }); setEditing(true); };
    const saveEdit = async () => { if (!selected) return; await updateVendor(selected.id, edit); setEditing(false); toast.success('Proveedor actualizado'); };
    const remove = async (id: string, name: string) => {
        if (!window.confirm(`¿Eliminar a "${name}"? Se borran también sus cotizaciones.`)) return;
        await deleteVendor(id);
        if (sel === id) setSel(null);
        toast.success('Proveedor eliminado');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
                <h3 className="mb-4 font-display font-extrabold" style={{ color: DARK }}>Directorio</h3>
                <div className="mb-4 space-y-2">
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nombre del proveedor"
                        className="w-full rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 outline-none focus:border-[#DF3B94]" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Categoría"
                            className="w-full rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 outline-none focus:border-[#DF3B94] min-w-0" />
                        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="WhatsApp (teléfono)"
                            className="w-full rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 outline-none focus:border-[#DF3B94] min-w-0" />
                    </div>
                    <button onClick={submit} className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold uppercase tracking-widest text-white" style={{ background: DARK }}>
                        <Plus className="h-4 w-4" /> Agregar proveedor
                    </button>
                </div>
                <div className="space-y-2">
                    {vendors.length === 0 && <p className="text-sm text-stone-400">Sin proveedores aún.</p>}
                    {vendors.map(v => (
                        <div key={v.id} className={`flex items-center justify-between rounded-2xl border p-3 ${sel === v.id ? 'border-[#DF3B94] bg-[#DF3B94]/5' : 'border-stone-100'}`}>
                            <button onClick={() => { setSel(v.id); setEditing(false); }} className="min-w-0 flex-1 text-left">
                                <p className="truncate font-bold" style={{ color: DARK }}>{v.name}</p>
                                <p className="truncate text-xs text-stone-500">{v.category || 'Sin categoría'}</p>
                            </button>
                            <button onClick={() => remove(v.id, v.name)} className="ml-2 rounded-lg p-2 text-stone-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Eliminar proveedor">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6">
                {!selected ? (
                    <div className="flex h-full items-center justify-center py-16 text-center text-stone-400">
                        <p>Elige un proveedor para ver su ficha, contacto y cotizaciones.</p>
                    </div>
                ) : editing ? (
                    <div className="space-y-3">
                        <h3 className="text-lg font-display font-extrabold" style={{ color: DARK }}>Editar proveedor</h3>
                        {(['name', 'category', 'phone', 'contact_name'] as const).map(f => (
                            <input key={f} value={(edit as any)[f]} onChange={e => setEdit({ ...edit, [f]: e.target.value })}
                                placeholder={f === 'name' ? 'Nombre' : f === 'category' ? 'Categoría' : f === 'phone' ? 'WhatsApp' : 'Contacto'}
                                className="w-full rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 outline-none focus:border-[#DF3B94]" />
                        ))}
                        <textarea value={edit.notes} onChange={e => setEdit({ ...edit, notes: e.target.value })} placeholder="Notas"
                            className="w-full rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 outline-none focus:border-[#DF3B94]" rows={2} />
                        <div className="flex gap-2">
                            <button onClick={saveEdit} className="flex-1 rounded-2xl py-3 text-xs font-bold uppercase tracking-widest text-white" style={{ background: PINK }}>Guardar</button>
                            <button onClick={() => setEditing(false)} className="rounded-2xl border border-stone-200 px-4 py-3 text-xs font-bold uppercase tracking-widest text-stone-500">Cancelar</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="text-xl font-display font-extrabold" style={{ color: DARK }}>{selected.name}</h3>
                                <p className="text-sm text-stone-500">{selected.category || 'Sin categoría'}</p>
                            </div>
                            <button onClick={() => startEdit(selected)} className="flex items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-stone-600 hover:bg-stone-50">
                                <Pencil className="h-3.5 w-3.5" /> Editar
                            </button>
                        </div>
                        <div className="space-y-2 text-sm">
                            {selected.contact_name && <p className="text-stone-600">Contacto: <span className="font-bold" style={{ color: DARK }}>{selected.contact_name}</span></p>}
                            {selected.notes && <p className="text-stone-500">{selected.notes}</p>}
                            {selected.phone && (
                                <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-bold text-white">
                                    <Phone className="h-3.5 w-3.5" /> {selected.phone}
                                </a>
                            )}
                        </div>
                        <div>
                            <p className="mb-2 text-[10px] uppercase font-bold tracking-widest text-stone-400">Cotizaciones de este proveedor</p>
                            <div className="space-y-2">
                                {selectedQuotes.length === 0 && <p className="text-sm text-stone-400">Aún no has registrado cotizaciones suyas.</p>}
                                {selectedQuotes.map(q => {
                                    const chip = QUOTE_CHIP[q.status as QuoteState] || QUOTE_CHIP.cotizado;
                                    return (
                                        <div key={q.id} className="flex items-center justify-between rounded-xl border border-stone-100 p-3">
                                            <div>
                                                <p className="font-bold" style={{ color: DARK }}>{rubroName(q.rubro_id)}</p>
                                                <p className="text-xs text-stone-500">{money(Number(q.amount))}</p>
                                            </div>
                                            <span className="rounded-full px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider" style={{ background: chip.bg, color: chip.fg }}>{chip.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Pendientes ────────────────────────────────────────────────────────────────
const Pendientes: React.FC<{ planning: Planning; toast: any }> = ({ planning, toast }) => {
    const { tasks, toggleTask, addTask, seedDefaults, reload } = planning;
    const [title, setTitle] = useState(''); const [phase, setPhase] = useState('1_month');

    const done = tasks.filter(t => t.is_done).length;
    const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    const grouped = useMemo(() => {
        const g: Record<string, any[]> = {};
        for (const t of tasks) { const k = t.phase || 'sin_fase'; (g[k] ||= []).push(t); }
        return g;
    }, [tasks]);

    const submit = async () => { if (!title.trim()) return; await addTask(title.trim(), phase); setTitle(''); toast.success('Pendiente agregado'); };
    const seed = async () => { const err = await seedDefaults(); if (err) return toast.error('No se pudo sembrar'); await reload(); toast.success('Checklist base creado'); };

    return (
        <div className="space-y-6">
            {tasks.length > 0 && (
                <div className="rounded-3xl border border-stone-200 bg-white p-6">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-display font-extrabold" style={{ color: DARK }}>Avance</h3>
                        <span className="text-sm font-bold" style={{ color: PINK }}>{done} de {tasks.length} · {pct}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-stone-100">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: PINK }} />
                    </div>
                    <p className="mt-2 text-xs text-stone-400">Las fechas se calculan solas desde el día del evento.</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 rounded-3xl border border-stone-200 bg-white p-4">
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nuevo pendiente"
                    className="flex-1 rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 outline-none focus:border-[#DF3B94]" />
                <select value={phase} onChange={e => setPhase(e.target.value)} className="rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 outline-none focus:border-[#DF3B94]">
                    {PHASES.filter(p => p.key !== 'sin_fase').map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                </select>
                <button onClick={submit} className="flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-xs font-bold uppercase tracking-widest text-white" style={{ background: PINK }}>
                    <Plus className="h-4 w-4" /> Agregar
                </button>
            </div>

            {tasks.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center">
                    <Sparkles className="mx-auto mb-3 h-8 w-8" style={{ color: PINK }} />
                    <p className="font-display font-extrabold text-lg" style={{ color: DARK }}>Empieza con todo precargado</p>
                    <p className="mt-1 text-sm text-stone-500">El asistente siembra rubros, checklist por fase (anillos, menú, canciones…) y la carpeta del día.</p>
                    <button onClick={seed} className="mt-5 rounded-2xl px-6 py-3 text-[11px] uppercase font-bold tracking-widest text-white" style={{ background: DARK }}>Sembrar todo</button>
                </div>
            ) : (
                PHASES.filter(p => grouped[p.key]?.length).map(p => {
                    const items = [...(grouped[p.key] || [])].sort((a, b) => ((a.due_date || '9999') < (b.due_date || '9999') ? -1 : 1));
                    const d = items.filter(t => t.is_done).length;
                    return (
                        <div key={p.key} className="rounded-3xl border border-stone-200 bg-white p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-[11px] uppercase font-bold tracking-widest" style={{ color: PINK }}>{p.label}</h3>
                                <span className="text-[11px] font-bold text-stone-400">{d}/{items.length}</span>
                            </div>
                            <div className="space-y-2">
                                {items.map(t => (
                                    <button key={t.id} onClick={() => toggleTask(t.id, !t.is_done)}
                                        className="flex w-full items-center gap-3 rounded-2xl border border-stone-100 p-3 text-left hover:bg-stone-50">
                                        {t.is_done ? <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: PINK }} /> : <Circle className="h-5 w-5 shrink-0 text-stone-300" />}
                                        <span className={`font-medium ${t.is_done ? 'text-stone-400 line-through' : ''}`} style={{ color: t.is_done ? undefined : DARK }}>{t.title}</span>
                                        <span className="ml-auto flex shrink-0 items-center gap-2">
                                            {t.due_date && <span className="text-[11px] text-stone-400">{fmtShort(t.due_date)}</span>}
                                            {t.source === 'template' && <span className="text-[9px] uppercase tracking-wider text-stone-300">base</span>}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

// ── Notas ─────────────────────────────────────────────────────────────────────
const Notas: React.FC<{ planning: Planning; toast: any }> = ({ planning, toast }) => {
    const { notes, addNote, updateNote, deleteNote } = planning;
    const [title, setTitle] = useState(''); const [body, setBody] = useState('');
    const [editId, setEditId] = useState<string | null>(null);

    const submit = async () => {
        if (!body.trim() && !title.trim()) return;
        if (editId) { await updateNote(editId, { title: title.trim(), body: body.trim() }); setEditId(null); }
        else { await addNote(title.trim(), body.trim()); }
        setTitle(''); setBody(''); toast.success(editId ? 'Nota actualizada' : 'Nota agregada');
    };
    const startEdit = (n: any) => { setEditId(n.id); setTitle(n.title || ''); setBody(n.body || ''); };
    const cancel = () => { setEditId(null); setTitle(''); setBody(''); };

    return (
        <div className="space-y-4">
            <div className="space-y-2 rounded-3xl border border-stone-200 bg-white p-4">
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título (opcional)"
                    className="w-full rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 outline-none focus:border-[#DF3B94]" />
                <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Escribe una nota…" rows={3}
                    className="w-full rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 outline-none focus:border-[#DF3B94]" />
                <div className="flex gap-2">
                    <button onClick={submit} className="flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-bold uppercase tracking-widest text-white" style={{ background: PINK }}>
                        <Plus className="h-4 w-4" /> {editId ? 'Guardar' : 'Agregar nota'}
                    </button>
                    {editId && <button onClick={cancel} className="rounded-2xl border border-stone-200 px-4 py-3 text-xs font-bold uppercase tracking-widest text-stone-500">Cancelar</button>}
                </div>
            </div>

            {notes.length === 0 && <p className="px-2 text-sm text-stone-400">Sin notas aún.</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {notes.map(n => (
                    <div key={n.id} className="rounded-3xl border border-stone-200 bg-white p-5">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                {n.title && <p className="font-display font-extrabold" style={{ color: DARK }}>{n.title}</p>}
                                <p className="mt-1 whitespace-pre-wrap text-sm text-stone-600">{n.body}</p>
                            </div>
                            <div className="flex shrink-0 gap-1">
                                <button onClick={() => startEdit(n)} className="rounded-lg p-2 text-stone-400 hover:bg-stone-50 hover:text-stone-700" aria-label="Editar nota"><Pencil className="h-4 w-4" /></button>
                                <button onClick={async () => { if (window.confirm('¿Eliminar nota?')) { await deleteNote(n.id); toast.success('Nota eliminada'); } }}
                                    className="rounded-lg p-2 text-stone-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Eliminar nota"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── Después de la boda ──────────────────────────────────────────────────────────
const DespuesBoda: React.FC<{ planning: Planning; toast: any }> = ({ planning, toast }) => {
    const { gifts, tasks, addGift, toggleThanked, deleteGift, toggleTask } = planning;
    const [gn, setGn] = useState(''); const [gg, setGg] = useState(''); const [ga, setGa] = useState('');
    const afterTasks = tasks.filter(t => t.phase === 'after');
    const thanked = gifts.filter(g => g.thanked).length;

    const submit = async () => {
        if (!gn.trim()) return toast.error('Pon al menos quién regaló');
        await addGift(gn.trim(), gg.trim(), ga ? Number(ga) : null);
        setGn(''); setGg(''); setGa(''); toast.success('Regalo agregado');
    };

    return (
        <div className="space-y-6">
            {/* Agradecimientos */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display font-extrabold" style={{ color: DARK }}>Agradecimientos</h3>
                    <span className="text-sm font-bold" style={{ color: PINK }}>{thanked} de {gifts.length} agradecidos</span>
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                    <input value={gn} onChange={e => setGn(e.target.value)} placeholder="Quién regaló"
                        className="min-w-[140px] flex-1 rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 outline-none focus:border-[#DF3B94]" />
                    <input value={gg} onChange={e => setGg(e.target.value)} placeholder="Regalo"
                        className="min-w-[140px] flex-1 rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 outline-none focus:border-[#DF3B94]" />
                    <input value={ga} onChange={e => setGa(e.target.value)} type="number" placeholder="Valor (opc.)"
                        className="w-28 rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 outline-none focus:border-[#DF3B94]" />
                    <button onClick={submit} className="rounded-2xl px-6 py-3 text-xs font-bold uppercase tracking-widest text-white" style={{ background: PINK }}>Agregar</button>
                </div>
                <div className="space-y-2">
                    {gifts.length === 0 && <p className="text-sm text-stone-400">Sin regalos registrados. Toca uno para marcar que ya diste las gracias.</p>}
                    {gifts.map(g => (
                        <div key={g.id} className="flex items-center justify-between gap-2 rounded-2xl border border-stone-100 p-3">
                            <button onClick={() => toggleThanked(g.id, !g.thanked)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                                {g.thanked ? <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: PINK }} /> : <Circle className="h-5 w-5 shrink-0 text-stone-300" />}
                                <span className="min-w-0">
                                    <span className="block truncate font-bold" style={{ color: DARK }}>{g.giver_name}</span>
                                    <span className="block truncate text-xs text-stone-500">{g.gift || '—'}{g.amount ? ` · ${money(Number(g.amount))}` : ''}{g.thanked ? ' · gracias enviadas' : ''}</span>
                                </span>
                            </button>
                            <button onClick={async () => { if (window.confirm('¿Eliminar este regalo?')) { await deleteGift(g.id); toast.success('Eliminado'); } }}
                                className="rounded-lg p-2 text-stone-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Eliminar regalo"><Trash2 className="h-4 w-4" /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pendientes post-boda */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6">
                <h3 className="mb-4 font-display font-extrabold" style={{ color: DARK }}>Pendientes después de la boda</h3>
                <div className="space-y-2">
                    {afterTasks.length === 0 && <p className="text-sm text-stone-400">Aparecen al sembrar el checklist: devolver materiales, pagar saldos, agradecer, compartir fotos, reseñas.</p>}
                    {afterTasks.map(t => (
                        <button key={t.id} onClick={() => toggleTask(t.id, !t.is_done)}
                            className="flex w-full items-center gap-3 rounded-2xl border border-stone-100 p-3 text-left hover:bg-stone-50">
                            {t.is_done ? <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: PINK }} /> : <Circle className="h-5 w-5 shrink-0 text-stone-300" />}
                            <span className={`font-medium ${t.is_done ? 'text-stone-400 line-through' : ''}`} style={{ color: t.is_done ? undefined : DARK }}>{t.title}</span>
                            {t.due_date && <span className="ml-auto text-[11px] text-stone-400">{fmtShort(t.due_date)}</span>}
                        </button>
                    ))}
                </div>
            </div>

            <p className="px-2 text-xs text-stone-400">Próximo: subir el álbum de fotos (requiere almacenamiento en Supabase).</p>
        </div>
    );
};

// ── Día B (carpeta) ────────────────────────────────────────────────────────────
const DAYOF_SECTIONS = [
    { key: 'preparativos', label: 'Preparativos de la pareja' },
    { key: 'montaje', label: 'Horario de montaje' },
    { key: 'ceremonia', label: 'Orden de la ceremonia' },
    { key: 'general', label: 'Recepción y fiesta' },
];

const buildCarpetaPDF = (event: any, dayOf: any[], vendors: any[]) => {
    const doc = new jsPDF();
    const title = event?.title || 'Evento';
    doc.setFontSize(20); doc.setTextColor(34, 43, 56); doc.text(title, 14, 20);
    doc.setFontSize(12); doc.setTextColor(223, 59, 148); doc.text('Carpeta del día', 14, 28);
    doc.setFontSize(10); doc.setTextColor(120); doc.text(fmtDate(event?.date_time) || '', 14, 35);
    let y = 44;
    const sections: [string, string][] = [['montaje', 'Horario de montaje'], ['ceremonia', 'Orden de la ceremonia'], ['general', 'Recepción y fiesta']];
    for (const [key, label] of sections) {
        const items = dayOf.filter(d => d.section === key).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        if (!items.length) continue;
        if (y > 255) { doc.addPage(); y = 20; }
        doc.setFontSize(13); doc.setTextColor(34, 43, 56); doc.text(label, 14, y); y += 3;
        autoTable(doc, {
            startY: y, head: [['Hora', 'Momento']], body: items.map(d => [d.time || '', d.title]),
            headStyles: { fillColor: [34, 43, 56] }, styles: { fontSize: 10 }, margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
    }
    const contactos = vendors.filter(v => v.phone);
    if (contactos.length) {
        if (y > 255) { doc.addPage(); y = 20; }
        doc.setFontSize(13); doc.setTextColor(34, 43, 56); doc.text('A quién llamar', 14, y); y += 3;
        autoTable(doc, {
            startY: y, head: [['Proveedor', 'Categoría', 'WhatsApp']], body: contactos.map(v => [v.name, v.category || '', v.phone]),
            headStyles: { fillColor: [223, 59, 148] }, styles: { fontSize: 10 }, margin: { left: 14, right: 14 },
        });
    }
    const safe = title.replace(/\s+/g, '_');
    const dataUri = doc.output('datauristring');
    const a = document.createElement('a');
    a.href = dataUri; a.download = `Carpeta_${safe}.pdf`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => { try { window.open(doc.output('bloburl'), '_blank'); } catch { /* popup bloqueado */ } }, 100);
};

const DiaB: React.FC<{ planning: Planning; event: any }> = ({ planning, event }) => {
    const { dayOf, vendors, toggleDayOf } = planning;
    const grouped = useMemo(() => {
        const g: Record<string, any[]> = {};
        for (const d of dayOf) (g[d.section] ||= []).push(d);
        return g;
    }, [dayOf]);
    const contactos = vendors.filter(v => v.phone);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-stone-200 bg-[#F8F9FA] p-5">
                <p className="text-sm text-stone-500">
                    La <span className="font-bold" style={{ color: DARK }}>carpeta del día</span> reúne todo lo que necesitas el día del evento:
                    horarios de montaje, orden de la ceremonia, recepción y a quién llamar.
                </p>
                <button onClick={() => buildCarpetaPDF(event, dayOf, vendors)}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-[11px] uppercase font-bold tracking-widest text-white" style={{ background: PINK }}>
                    <Download className="h-4 w-4" /> Descargar PDF
                </button>
            </div>
            {DAYOF_SECTIONS.map(s => (
                <div key={s.key} className="rounded-3xl border border-stone-200 bg-white p-6">
                    <h3 className="mb-4 text-[11px] uppercase font-bold tracking-widest" style={{ color: PINK }}>{s.label}</h3>
                    <div className="space-y-2">
                        {!(grouped[s.key]?.length) && <p className="text-sm text-stone-400">Sin elementos. Se siembran al activar el módulo.</p>}
                        {(grouped[s.key] || []).map(d => (
                            <button key={d.id} onClick={() => toggleDayOf(d.id, !d.is_done)}
                                className="flex w-full items-center gap-4 rounded-2xl border border-stone-100 p-3 text-left hover:bg-stone-50">
                                <span className="w-14 shrink-0 font-display font-black" style={{ color: PINK }}>{d.time || '--:--'}</span>
                                {d.is_done ? <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: PINK }} /> : <Circle className="h-5 w-5 shrink-0 text-stone-300" />}
                                <span className={`font-medium ${d.is_done ? 'text-stone-400 line-through' : ''}`} style={{ color: d.is_done ? undefined : DARK }}>{d.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            <div className="rounded-3xl border border-stone-200 bg-white p-6">
                <h3 className="mb-1 text-[11px] uppercase font-bold tracking-widest" style={{ color: PINK }}>A quién llamar</h3>
                <p className="mb-4 text-xs text-stone-400">Se arma solo con los proveedores que tienen WhatsApp.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {contactos.length === 0 && <p className="text-sm text-stone-400">Agrega teléfonos a tus proveedores.</p>}
                    {contactos.map(v => (
                        <a key={v.id} href={`https://wa.me/${v.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer"
                            className="flex items-center justify-between rounded-2xl border border-stone-100 p-3 hover:bg-stone-50">
                            <div>
                                <p className="font-bold" style={{ color: DARK }}>{v.name}</p>
                                <p className="text-xs text-stone-500">{v.category || ''}</p>
                            </div>
                            <span className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-1.5 text-[10px] font-bold text-white"><Phone className="h-3 w-3" /> {v.phone}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlanningPage;
