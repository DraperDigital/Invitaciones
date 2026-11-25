import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
    Compass, Wallet, Store, ListChecks, CalendarHeart, Crown, ChevronDown, ChevronRight, ChevronLeft,
    CalendarClock, AlertTriangle, CheckCircle2, Circle, Plus, Sparkles, Phone, Check,
    MapPin, Trash2, Pencil, CalendarDays, Download, StickyNote, Gift, Boxes, GripVertical,
    Share2, Link2, X, Star, Scale, Target,
} from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RTooltip } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import { usePlanning, type QuoteState } from '../../hooks/usePlanning';

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
    favorito: { bg: '#fce7f3', fg: '#9d174d', label: 'Favorito' },
    contratado: { bg: '#dcfce7', fg: '#166534', label: 'Contratado' },
    descartado: { bg: '#fafaf9', fg: '#a8a29e', label: 'Descartado' },
};

type SubTab = 'copiloto' | 'presupuesto' | 'proveedores' | 'pendientes' | 'agenda' | 'materiales' | 'dia' | 'notas' | 'despues';
type Planning = ReturnType<typeof usePlanning>;

// ── Compartir el plan (enlace de solo lectura) ─────────────────────────────────
const ShareButton: React.FC<{ planning: Planning; isDemo: boolean; toast: any }> = ({ planning, isDemo, toast }) => {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const openPanel = async () => {
        const next = !open;
        setOpen(next);
        if (!next || url || loading) return;
        setLoading(true);
        const token = await planning.getOrCreateShare();
        setLoading(false);
        if (token) setUrl(`${window.location.origin}/plan/${token}`);
        else toast.error('No se pudo crear el enlace');
    };
    const copy = async () => {
        if (!url) return;
        try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); toast.success('Enlace copiado'); }
        catch { toast.error('No se pudo copiar'); }
    };
    const revoke = async () => {
        if (isDemo) { setUrl(null); setOpen(false); return; }
        if (!window.confirm('¿Desactivar el enlace? Dejará de funcionar para quien lo tenga.')) return;
        await planning.revokeShare();
        setUrl(null); setOpen(false); toast.success('Enlace desactivado');
    };

    return (
        <div className="relative shrink-0 self-start">
            <button onClick={openPanel}
                className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-600 hover:border-[#DF3B94] hover:text-[#DF3B94] cursor-pointer">
                <Share2 className="h-4 w-4" /> Compartir
            </button>
            {open && (
                <div className="absolute right-0 z-30 mt-2 w-[min(20rem,88vw)] rounded-2xl border border-stone-200 bg-white p-4 shadow-xl">
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-[11px] uppercase font-bold tracking-widest" style={{ color: PINK }}>Compartir plan</p>
                        <button onClick={() => setOpen(false)} className="text-stone-400 hover:text-stone-600" aria-label="Cerrar"><X className="h-4 w-4" /></button>
                    </div>
                    <p className="mb-3 text-xs text-stone-500">
                        Cualquiera con este enlace ve el plan en <span className="font-bold">solo lectura</span>, sin iniciar sesión.
                        {isDemo ? ' En el demo el enlace es de ejemplo.' : ''}
                    </p>
                    {loading ? (
                        <p className="py-3 text-center text-sm text-stone-400">Generando enlace…</p>
                    ) : url ? (
                        <>
                            <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-[#F8F9FA] p-2">
                                <Link2 className="h-4 w-4 shrink-0 text-stone-400" />
                                <input readOnly value={url} onFocus={e => e.currentTarget.select()}
                                    className="min-w-0 flex-1 bg-transparent text-xs text-stone-600 outline-none" />
                                <button onClick={copy} className="shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] uppercase font-bold tracking-wider text-white cursor-pointer" style={{ background: PINK }}>
                                    {copied ? 'Copiado' : 'Copiar'}
                                </button>
                            </div>
                            <button onClick={revoke} className="mt-2 text-[11px] font-bold text-rose-500 hover:text-rose-700 cursor-pointer">Desactivar enlace</button>
                        </>
                    ) : (
                        <p className="py-3 text-center text-sm text-stone-400">No se pudo generar el enlace.</p>
                    )}
                </div>
            )}
        </div>
    );
};

interface PlanningUserEvent {
    id: string;
    title: string;
    plan?: string | null;
    theme_config?: any;
}

const isEligibleForPlanning = (ev: { plan?: string | null; theme_config?: any }) => {
    const p = (ev.plan || ev.theme_config?.plan || '').toLowerCase();
    return p === 'pro' || p === 'personalized' || p === 'personalizado' || p === 'premium' || p === 'concierge';
};

const PlanningPage: React.FC = () => {
    const { id: routeEventId } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();

    const isExplicitDemo = routeEventId === 'demo' || searchParams.get('demo') === 'true' || searchParams.get('event') === 'demo';
    const isMockBackend = !import.meta.env.VITE_SUPABASE_URL;

    const [userEvents, setUserEvents] = useState<PlanningUserEvent[]>([]);
    const [activeEvent, setActiveEvent] = useState<any>(null);
    const [eventId, setEventId] = useState<string | undefined>(
        routeEventId || searchParams.get('event') || (isExplicitDemo || !user ? 'demo' : undefined)
    );
    const [tab, setTab] = useState<SubTab>('copiloto');

    const isDemo = !user || eventId === 'demo' || eventId === 'mock-event-id' || isExplicitDemo || isMockBackend;
    const { hasFeature, currentPlan, isLoading: accessLoading } = useFeatureAccess(isDemo ? undefined : eventId, isDemo ? 'pro' : undefined);
    const planning = usePlanning(eventId || (isDemo ? 'demo' : undefined));

    const locked = !isDemo && !accessLoading && !hasFeature('event_planning');
    const eligibleEvents = userEvents.filter(isEligibleForPlanning);

    useEffect(() => {
        if (isDemo) {
            setUserEvents([]);
            if (!eventId) setEventId('demo');
            return;
        }
        if (!user || isMockBackend) {
            return;
        }
        (async () => {
            const { data, error } = await supabase
                .from('events')
                .select('id, title, plan, theme_config')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('[Planning] error fetching user events:', error);
            }
            const owned = (data || []) as PlanningUserEvent[];
            setUserEvents(owned);

            const eligible = owned.filter(isEligibleForPlanning);
            const stored = localStorage.getItem(`last_managed_event_id_${user.id}`);

            if (!eventId) {
                let next: string | undefined;
                if (stored && eligible.some(e => e.id === stored)) {
                    next = stored;
                } else if (eligible.length > 0) {
                    next = eligible[0].id;
                } else if (stored && owned.some(e => e.id === stored)) {
                    next = stored;
                } else {
                    next = owned[0]?.id;
                }
                if (next) {
                    setEventId(next);
                    navigate(`/dashboard/planeacion/${next}`, { replace: true });
                }
            } else if (eventId !== 'demo' && owned.length > 0 && !owned.some(e => e.id === eventId)) {
                // Si el id en la URL no le pertenece al usuario actual, corregir al propio elegible
                const next = eligible[0]?.id || owned[0]?.id;
                if (next) {
                    setEventId(next);
                    navigate(`/dashboard/planeacion/${next}`, { replace: true });
                }
            }
        })();
    }, [user, isDemo, isMockBackend, eventId, navigate]);

    useEffect(() => {
        if (isDemo || !eventId || eventId === 'demo' || eventId === 'mock-event-id') {
            setActiveEvent({
                title: 'Boda Ana & Luis',
                date_time: new Date(Date.now() + 86 * 86400000).toISOString(),
                venue_name: 'Hacienda Los Encinos, Cuernavaca'
            });
            return;
        }
        supabase.from('events').select('title,date_time,venue_name').eq('id', eventId).maybeSingle()
            .then(({ data }) => setActiveEvent(data));
    }, [eventId, isDemo]);

    // Auto-carga: al entrar a un evento real vacío, siembra el plan una sola vez
    // (rubros + pendientes + proveedores sugeridos + carpeta del día). Sin botones.
    const seededRef = useRef<string | null>(null);
    useEffect(() => {
        if (isDemo || planning.loading || accessLoading || locked || !eventId || eventId === 'demo') return;
        if (seededRef.current === eventId) return;
        if (planning.rubros.length === 0 && planning.tasks.length === 0) {
            seededRef.current = eventId;
            planning.seedDefaults().then((err: any) => {
                if (err) toast.error(typeof err === 'string' ? err : 'No se pudo cargar tu plan');
            });
        }
    }, [isDemo, planning.loading, accessLoading, locked, eventId, planning.rubros.length, planning.tasks.length, toast]);

    const handleEventChange = (id: string) => {
        if (!id) return;
        setEventId(id);
        if (user && id !== 'demo') localStorage.setItem(`last_managed_event_id_${user.id}`, id);
        navigate(id === 'demo' ? `/dashboard/planeacion/demo` : `/dashboard/planeacion/${id}`);
    };

    if (!user && !isDemo) {
        return (
            <div className="py-20 text-center text-stone-500 space-y-4">
                <p>Inicia sesión para ver tu planeación o explora el demo con datos de prueba.</p>
                <div className="flex items-center justify-center gap-3">
                    <Link to="/login" className="px-5 py-2.5 bg-[#DF3B94] text-white rounded-xl text-xs font-bold uppercase tracking-wider no-underline">
                        Iniciar sesión
                    </Link>
                    <Link to="/dashboard/planeacion/demo" className="px-5 py-2.5 bg-stone-100 text-stone-800 rounded-xl text-xs font-bold uppercase tracking-wider no-underline">
                        Ver Demo con Datos Mock
                    </Link>
                </div>
            </div>
        );
    }

    if (!eventId) {
        if (userEvents.length === 0) {
            return (
                <div className="rounded-[2.5rem] border border-stone-200 bg-white p-12 text-center shadow-xs">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 text-stone-600">
                        <Compass className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[#222B38]">Aún no tienes invitaciones</h3>
                    <p className="mx-auto mt-3 max-w-md text-stone-600 text-sm sm:text-base">
                        Crea una invitación con el plan Pro para desbloquear el módulo de planeación o explora el demo interactivo.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Link to="/planes" className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-[11px] uppercase font-bold tracking-[0.2em] text-white shadow-xl hover:opacity-90 no-underline transition-all"
                            style={{ background: PINK }}>
                            <Crown className="h-4 w-4" /> Ver Planes
                        </Link>
                        <Link to="/dashboard/planeacion/demo" className="inline-flex items-center gap-2 rounded-2xl px-6 py-4 text-[11px] uppercase font-bold tracking-[0.2em] bg-stone-100 hover:bg-stone-200 text-stone-800 no-underline transition-all">
                            Ver Demo con Datos Mock
                        </Link>
                    </div>
                </div>
            );
        }

        const eligible = userEvents.filter(isEligibleForPlanning);
        if (eligible.length === 0) {
            return <UpgradeState planName={userEvents[0]?.plan || 'Clásica'} />;
        }

        return (
            <div className="text-center py-20 max-w-md mx-auto">
                <h2 className="text-2xl font-display font-extrabold mb-4 text-[#222B38]">Elige un evento para planear</h2>
                <div className="relative">
                    <select onChange={(e) => handleEventChange(e.target.value)} defaultValue=""
                        className="w-full appearance-none bg-white border-2 border-stone-200 hover:border-[#DF3B94] focus:border-[#DF3B94] rounded-2xl p-3.5 pr-10 outline-none text-stone-900 font-semibold cursor-pointer shadow-xs transition-colors">
                        <option value="" disabled>Seleccionar evento...</option>
                        {eligible.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                    </select>
                    <ChevronDown className="h-4 w-4 text-[#C2287B] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 w-full max-w-full min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
                <div className="flex flex-col gap-1.5 min-w-0 w-full max-w-full">
                    <p className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2" style={{ color: PINK }}>
                        <span>Planeación · {isDemo ? 'Demo' : (currentPlan?.name || 'Pro')}</span>
                        {isDemo && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[9px] font-mono font-bold tracking-normal border border-amber-200">
                                Datos de prueba · Mock
                            </span>
                        )}
                    </p>
                    {isDemo ? (
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-stone-900 tracking-tight">
                            Boda Demo · Ana & Luis
                        </h1>
                    ) : eligibleEvents.length > 1 ? (
                        <div className="relative inline-block w-full sm:w-auto min-w-[260px] max-w-md mt-1">
                            <label htmlFor="planning-event-selector" className="sr-only">Seleccionar evento</label>
                            <div className="relative">
                                <select
                                    id="planning-event-selector"
                                    value={eventId}
                                    onChange={(e) => handleEventChange(e.target.value)}
                                    className="w-full appearance-none bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-[#DF3B94] focus:border-[#DF3B94] focus:ring-4 focus:ring-[#DF3B94]/15 rounded-2xl py-2.5 sm:py-3 pl-4 pr-11 text-base sm:text-xl md:text-2xl font-display font-extrabold text-[#222B38] outline-none cursor-pointer transition-all shadow-xs"
                                >
                                    {eligibleEvents.map(ev => (
                                        <option key={ev.id} value={ev.id} className="font-sans text-sm font-medium text-stone-900 py-1">
                                            {ev.title}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                                    <ChevronDown className="h-5 w-5 text-[#C2287B]" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-[#222B38] tracking-tight">
                            {activeEvent?.title || userEvents.find(e => e.id === eventId)?.title || 'Mi Invitación'}
                        </h1>
                    )}
                </div>
                {!locked && <ShareButton planning={planning} isDemo={isDemo} toast={toast} />}
            </div>

            {/* Banner de aviso: Datos Mock / Prueba */}
            {isDemo && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-amber-900 text-xs w-full max-w-full min-w-0">
                    <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse mt-1 sm:mt-0 shrink-0" />
                        <div className="min-w-0">
                            <span className="font-bold uppercase tracking-wider text-[11px] block sm:inline mr-2 text-amber-950">
                                Modo Demostración · Datos de prueba (mock):
                            </span>
                            <span className="text-stone-700 font-normal">
                                Todos los presupuestos, proveedores, cotizaciones, pagos e itinerarios mostrados son ficticios. Puedes probar añadir, editar o marcar pagos libremente.
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto pt-1 sm:pt-0">
                        <button
                            type="button"
                            onClick={() => { planning.seedDefaults(); toast.success('Datos de prueba reiniciados'); }}
                            className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-amber-300 text-amber-900 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
                            title="Restaurar datos de prueba originales"
                        >
                            Reiniciar datos demo
                        </button>
                        {!user && (
                            <Link
                                to="/login"
                                className="px-3 py-1.5 bg-[#DF3B94] hover:bg-[#C2287B] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors shadow-2xs no-underline"
                            >
                                Iniciar sesión
                            </Link>
                        )}
                    </div>
                </div>
            )}

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
                            {tab === 'agenda' && <Agenda planning={planning} toast={toast} />}
                            {tab === 'materiales' && <Materiales planning={planning} toast={toast} />}
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
    <div className="rounded-[2.5rem] border border-stone-200 bg-white p-8 sm:p-12 text-center shadow-xs">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: `${PINK}1a`, color: PINK }}>
            <Crown className="h-8 w-8" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-display font-extrabold" style={{ color: DARK }}>Planeación es parte del plan Pro</h3>
        <p className="mx-auto mt-3 max-w-md text-stone-600 text-sm sm:text-base leading-relaxed">
            Tu evento actual{planName ? ` (${planName})` : ''} incluye la invitación y las confirmaciones. El plan Pro suma
            presupuesto por rubros, cotizaciones, contratos, pagos, pendientes y la carpeta del día.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/planes" className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-[11px] uppercase font-bold tracking-[0.2em] text-white shadow-xl hover:opacity-90 no-underline transition-all"
                style={{ background: PINK }}>
                <Crown className="h-4 w-4" /> Mejorar a Pro
            </Link>
            <Link to="/dashboard/planeacion/demo" className="inline-flex items-center gap-2 rounded-2xl px-6 py-4 text-[11px] uppercase font-bold tracking-[0.2em] bg-stone-100 hover:bg-stone-200 text-stone-800 no-underline transition-all">
                Ver Demo Mock
            </Link>
        </div>
    </div>
);

// ── Subtabs ─────────────────────────────────────────────────────────────────
const SubTabs: React.FC<{ tab: SubTab; setTab: (t: SubTab) => void; planning: Planning }> = ({ tab, setTab, planning }) => {
    const items: { key: SubTab; label: string; icon: any; badge?: number }[] = [
        { key: 'copiloto', label: 'Resumen', icon: Compass },
        { key: 'presupuesto', label: 'Presupuesto', icon: Wallet },
        { key: 'proveedores', label: 'Proveedores', icon: Store },
        { key: 'pendientes', label: 'Pendientes', icon: ListChecks, badge: planning.openTasks || undefined },
        { key: 'agenda', label: 'Agenda', icon: CalendarClock },
        { key: 'materiales', label: 'Materiales', icon: Boxes },
        { key: 'dia', label: 'Día B', icon: CalendarHeart },
        { key: 'notas', label: 'Notas', icon: StickyNote },
        { key: 'despues', label: 'Después', icon: Gift },
    ];
    return (
        <div className="w-full max-w-full min-w-0 overflow-x-auto pb-1 sm:pb-0 rounded-2xl border border-stone-200 bg-white p-1.5 no-scrollbar">
            <div className="flex gap-1.5 min-w-max sm:min-w-0 sm:flex-wrap">
                {items.map(({ key, label, icon: Icon, badge }) => {
                    const active = tab === key;
                    return (
                        <button key={key} onClick={() => setTab(key)}
                            className={`flex items-center gap-2 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer ${active ? 'text-white shadow-md' : 'text-stone-500 hover:bg-stone-50'}`}
                            style={active ? { background: DARK } : undefined}>
                            <Icon className="h-4 w-4" style={active ? { color: PINK } : undefined} />
                            {label}
                            {badge ? <span className="ml-1 rounded-full px-1.5 py-0.5 text-[10px]" style={{ background: PINK, color: '#fff' }}>{badge}</span> : null}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// ── Resumen (Copiloto) ────────────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: string; hint?: string; accent?: boolean }> = ({ label, value, hint, accent }) => (
    <div className="rounded-3xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm min-w-0">
        <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-stone-500 truncate">{label}</p>
        <p className="mt-1 sm:mt-1.5 text-lg sm:text-2xl font-display font-black truncate" style={{ color: accent ? PINK : DARK }}>{value}</p>
        {hint && <p className="mt-1 text-[11px] sm:text-xs text-stone-400 truncate">{hint}</p>}
    </div>
);

// Roadmap visual: línea de tiempo de las fases con avance por fase.
const ROADMAP_PHASES = PHASES.filter(p => p.key !== 'sin_fase');
const Roadmap: React.FC<{ planning: Planning; setTab: (t: SubTab) => void }> = ({ planning, setTab }) => {
    const { tasks } = planning;
    const stats = ROADMAP_PHASES.map(p => {
        const items = tasks.filter(t => (t.phase || 'sin_fase') === p.key);
        const done = items.filter(t => t.is_done).length;
        const pct = items.length ? Math.round((done / items.length) * 100) : 0;
        const nextDue = items.filter(t => !t.is_done && t.due_date).sort((a, b) => (a.due_date < b.due_date ? -1 : 1))[0]?.due_date;
        return { ...p, total: items.length, done, pct, nextDue, complete: items.length > 0 && done === items.length };
    });
    // La fase "actual" = la primera con tareas que aún no está completa.
    const currentIdx = stats.findIndex(s => s.total > 0 && !s.complete);

    if (!tasks.length) return null;

    return (
        <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display font-extrabold" style={{ color: DARK }}>Ruta de planeación</h3>
                <button onClick={() => setTab('pendientes')} className="text-xs font-bold" style={{ color: PINK }}>Ver todo →</button>
            </div>
            {/* Desktop: stepper horizontal */}
            <div className="hidden sm:flex items-start justify-between gap-1">
                {stats.map((s, i) => {
                    const active = i === currentIdx;
                    const past = currentIdx === -1 || i < currentIdx || s.complete;
                    return (
                        <React.Fragment key={s.key}>
                            <button onClick={() => setTab('pendientes')} className="group flex flex-1 flex-col items-center gap-2 min-w-0 cursor-pointer">
                                <span className="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-display font-black transition-all"
                                    style={past ? { background: '#dcfce7', color: '#166534' } : active ? { background: PINK, color: '#fff' } : { background: '#f5f5f4', color: '#a8a29e' }}>
                                    {s.complete ? <Check className="h-5 w-5" /> : s.total || '·'}
                                </span>
                                <span className="text-center text-[10px] uppercase font-bold tracking-wider leading-tight" style={{ color: active ? PINK : past ? DARK : '#a8a29e' }}>{s.label}</span>
                                <span className="text-[9px] text-stone-400">{s.total ? `${s.done}/${s.total}` : '—'}</span>
                                {active && s.nextDue && <span className="text-[9px] text-stone-400">prox. {fmtShort(s.nextDue)}</span>}
                            </button>
                            {i < stats.length - 1 && <span className="mt-5 h-0.5 flex-1 rounded-full" style={{ background: i < currentIdx || currentIdx === -1 ? '#86efac' : '#e7e5e4' }} />}
                        </React.Fragment>
                    );
                })}
            </div>
            {/* Mobile: lista vertical compacta */}
            <div className="sm:hidden space-y-2.5">
                {stats.map((s, i) => {
                    const active = i === currentIdx;
                    const past = s.complete;
                    return (
                        <button key={s.key} onClick={() => setTab('pendientes')}
                            className="flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left cursor-pointer"
                            style={{ borderColor: active ? `${PINK}55` : '#f5f5f4', background: active ? `${PINK}0d` : '#fff' }}>
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-display font-black"
                                style={past ? { background: '#dcfce7', color: '#166534' } : active ? { background: PINK, color: '#fff' } : { background: '#f5f5f4', color: '#a8a29e' }}>
                                {s.complete ? <Check className="h-4 w-4" /> : s.total || '·'}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-xs font-bold uppercase tracking-wider" style={{ color: active ? PINK : DARK }}>{s.label}</span>
                                <span className="block text-[10px] text-stone-400">{s.total ? `${s.done} de ${s.total} hechas` : 'Sin tareas'}{active && s.nextDue ? ` · prox. ${fmtShort(s.nextDue)}` : ''}</span>
                            </span>
                            <div className="h-1.5 w-14 shrink-0 overflow-hidden rounded-full bg-stone-100">
                                <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: past ? '#22c55e' : PINK }} />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const Copiloto: React.FC<{ planning: Planning; setTab: (t: SubTab) => void; event: any }> = ({ planning, setTab, event }) => {
    const { totals, confirmed, countdownDays, nextPayment, overdueCount, tasks, vendors } = planning;
    const vendorName = (id: string) => vendors.find(v => v.id === id)?.name || '';
    const doneTasks = tasks.filter(t => t.is_done).length;
    const taskPct = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;

    return (
        <div className="space-y-6 min-w-0">
            {/* Hero: cuenta regresiva grande + datos del evento */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-[2rem] p-5 sm:p-8 text-white min-w-0" style={{ background: DARK }}>
                <div className="space-y-2 min-w-0">
                    <p className="text-[11px] uppercase font-bold tracking-[0.2em]" style={{ color: PINK }}>Cuenta regresiva</p>
                    <h2 className="text-xl sm:text-2xl font-display font-black truncate">{event?.title || 'Tu evento'}</h2>
                    <p className="text-sm text-slate-300">{fmtDate(event?.date_time) || 'Fecha por definir'}</p>
                    {event?.venue_name && <p className="flex items-center gap-1.5 text-sm text-slate-400 truncate"><MapPin className="h-4 w-4 shrink-0" /> {event.venue_name}</p>}
                </div>
                <div className="text-left sm:text-right shrink-0">
                    <p className="font-display font-black leading-none text-5xl sm:text-7xl" style={{ color: '#fff' }}>{countdownDays}</p>
                    <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-400 mt-1">días</p>
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

            <Roadmap planning={planning} setTab={setTab} />

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
    <div className="flex-1 min-w-[120px] rounded-2xl border border-stone-200 bg-white p-3 sm:px-4 sm:py-3 min-w-0">
        <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-stone-400 truncate">{label}</p>
        <p className="text-base sm:text-xl font-display font-black truncate" style={{ color: accent ? PINK : DARK }}>{value}</p>
    </div>
);

const Presupuesto: React.FC<{ planning: Planning; toast: any }> = ({ planning, toast }) => {
    const { rubros, totals, addRubro } = planning;
    const [view, setView] = useState<'partidas' | 'comparar' | 'pagos'>('partidas');
    const [open, setOpen] = useState<string | null>(null);
    const [nn, setNn] = useState(''); const [na, setNa] = useState('');

    const submit = async () => {
        if (!nn.trim()) return;
        await addRubro(nn.trim(), Number(na) || 0, null);
        setNn(''); setNa(''); toast.success('Rubro agregado');
    };

    return (
        <div className="space-y-4 min-w-0 w-full">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-3">
                <TotalPill label="Estimado" value={money(totals.estimado)} />
                <TotalPill label="Cotizado" value={money(totals.cotizado)} />
                <TotalPill label="Contratado" value={money(totals.contratado)} />
                <TotalPill label="Pagado" value={money(totals.pagado)} accent />
            </div>

            {/* Sub-vistas + export */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex gap-1 rounded-2xl border border-stone-200 bg-white p-1">
                    {([['partidas', 'Partidas'], ['comparar', 'Comparar'], ['pagos', 'Calendario de pagos']] as const).map(([k, label]) => (
                        <button key={k} onClick={() => setView(k)}
                            className={`rounded-xl px-3 sm:px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer ${view === k ? 'text-white' : 'text-stone-500'}`}
                            style={view === k ? { background: DARK } : undefined}>{label}</button>
                    ))}
                </div>
                <button onClick={() => downloadBudgetCSV(rubros, planning.chosenByRubro, totals)}
                    className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-3 sm:px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-600 hover:border-[#DF3B94] hover:text-[#DF3B94] cursor-pointer">
                    <Download className="h-4 w-4" /> Excel (CSV)
                </button>
            </div>

            {view === 'partidas' && (
                <>
                    <BudgetPanel planning={planning} toast={toast} />
                    <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 rounded-3xl border border-stone-200 bg-white p-3.5 sm:p-4 min-w-0">
                        <input value={nn} onChange={e => setNn(e.target.value)} placeholder="Nuevo rubro (ej. Pastel)"
                            className="flex-1 rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 text-sm outline-none focus:border-[#DF3B94] min-w-0" />
                        <input value={na} onChange={e => setNa(e.target.value)} placeholder="Estimado MXN" type="number"
                            className="w-full sm:w-44 rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 text-sm outline-none focus:border-[#DF3B94] min-w-0" />
                        <button onClick={submit} className="flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-xs font-bold uppercase tracking-widest text-white cursor-pointer" style={{ background: PINK }}>
                            <Plus className="h-4 w-4" /> Agregar
                        </button>
                    </div>
                    {rubros.length > 1 && <p className="px-1 text-[10px] uppercase tracking-wider text-stone-300">Arrastra <GripVertical className="inline h-3 w-3" /> para reordenar</p>}
                    <Reorder.Group as="div" axis="y" values={rubros} onReorder={planning.reorderRubros} className="space-y-2">
                        {rubros.map(r => (
                            <RubroRow key={r.id} rubro={r} planning={planning} toast={toast}
                                expanded={open === r.id} onToggle={() => setOpen(open === r.id ? null : r.id)} />
                        ))}
                    </Reorder.Group>
                </>
            )}
            {view === 'comparar' && <Comparador planning={planning} toast={toast} />}
            {view === 'pagos' && <PagosCalendar planning={planning} toast={toast} />}
        </div>
    );
};

// Panel de meta de presupuesto: meta global, disponible, sugerido y distribución (pie).
const BudgetPanel: React.FC<{ planning: Planning; toast: any }> = ({ planning, toast }) => {
    const { rubros, totals, chosenByRubro, budgetGoal, setBudgetGoal, confirmed } = planning;
    const [goalInput, setGoalInput] = useState('');
    const [guests, setGuests] = useState(String(confirmed || ''));

    // Costo por invitado de referencia en MX (rango medio) para el sugerido.
    const SUGG_PER_GUEST = 1800;
    const g = Number(guests) || confirmed || 0;
    const suggested = g * SUGG_PER_GUEST;

    const goal = Number(budgetGoal) || 0;
    const disponible = goal > 0 ? goal - totals.contratado : 0;
    const usedPct = goal > 0 ? Math.min(100, Math.round((totals.contratado / goal) * 100)) : 0;

    // Distribución por rubro (usa contratado si existe, si no el estimado).
    const COLORS = ['#DF3B94', '#222B38', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6', '#0ea5e9'];
    const pieData = useMemo(() => rubros
        .map(r => ({ name: r.name, value: chosenByRubro[r.id] ? Number(chosenByRubro[r.id].amount) : Number(r.estimated_amount || 0) }))
        .filter(d => d.value > 0)
        .sort((a, b) => b.value - a.value), [rubros, chosenByRubro]);

    const saveGoal = () => {
        const v = Number(goalInput);
        if (!v || v <= 0) return toast.error('Pon una meta válida');
        setBudgetGoal(v); setGoalInput(''); toast.success('Meta de presupuesto guardada');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Meta global + sugerido */}
            <div className="rounded-3xl border border-stone-200 bg-white p-5 space-y-4">
                <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" style={{ color: PINK }} />
                    <h3 className="text-[11px] uppercase font-bold tracking-widest text-stone-500">Meta de presupuesto</h3>
                </div>
                {goal > 0 ? (
                    <>
                        <div className="flex items-end justify-between gap-2">
                            <div>
                                <p className="text-2xl font-display font-black" style={{ color: DARK }}>{money(goal)}</p>
                                <p className="text-xs text-stone-400">Contratado {money(totals.contratado)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold" style={{ color: disponible < 0 ? '#e11d48' : '#166534' }}>{money(disponible)}</p>
                                <p className="text-[10px] uppercase tracking-wider text-stone-400">{disponible < 0 ? 'te pasaste' : 'disponible'}</p>
                            </div>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
                            <div className="h-full rounded-full transition-all" style={{ width: `${usedPct}%`, background: disponible < 0 ? '#e11d48' : PINK }} />
                        </div>
                        <button onClick={() => setBudgetGoal(0)} className="text-[11px] font-bold text-stone-400 hover:text-stone-600 cursor-pointer">Cambiar meta</button>
                    </>
                ) : (
                    <div className="space-y-3">
                        <div className="rounded-2xl bg-[#F8F9FA] p-3">
                            <p className="text-xs text-stone-500">Sugerido para <span className="font-bold" style={{ color: DARK }}>{g || '—'}</span> invitados</p>
                            <p className="text-xl font-display font-black" style={{ color: PINK }}>{suggested ? money(suggested) : '—'}</p>
                            <p className="text-[10px] text-stone-400">≈ {money(SUGG_PER_GUEST)} por invitado (rango medio MX). Ajusta abajo.</p>
                            <div className="mt-2 flex items-center gap-2">
                                <input value={guests} onChange={e => setGuests(e.target.value)} type="number" placeholder="# invitados"
                                    className="w-28 rounded-xl border border-stone-200 bg-white p-2 text-sm outline-none focus:border-[#DF3B94]" />
                                {suggested > 0 && <button onClick={() => setBudgetGoal(suggested)} className="rounded-xl px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-white cursor-pointer" style={{ background: DARK }}>Usar sugerido</button>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input value={goalInput} onChange={e => setGoalInput(e.target.value)} type="number" placeholder="O fija tu meta (MXN)"
                                className="flex-1 rounded-xl border border-stone-200 bg-[#F8F9FA] p-2.5 text-sm outline-none focus:border-[#DF3B94]" />
                            <button onClick={saveGoal} className="rounded-xl px-4 py-2.5 text-[10px] uppercase font-bold tracking-wider text-white cursor-pointer" style={{ background: PINK }}>Guardar</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Distribución (pie) */}
            <div className="rounded-3xl border border-stone-200 bg-white p-5">
                <h3 className="mb-2 text-[11px] uppercase font-bold tracking-widest text-stone-500">Distribución del gasto</h3>
                {pieData.length === 0 ? (
                    <p className="py-8 text-center text-sm text-stone-400">Agrega montos para ver la distribución.</p>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="h-36 w-36 shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={34} outerRadius={64} paddingAngle={2}>
                                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <RTooltip formatter={(v: any) => money(Number(v))} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                            {pieData.slice(0, 6).map((d, i) => (
                                <div key={d.name} className="flex items-center gap-2 text-xs">
                                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                                    <span className="min-w-0 flex-1 truncate text-stone-600">{d.name}</span>
                                    <span className="shrink-0 font-bold" style={{ color: DARK }}>{money(d.value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Comparador de cotizaciones: por rubro, todas las cotizaciones lado a lado.
const Comparador: React.FC<{ planning: Planning; toast: any }> = ({ planning, toast }) => {
    const { rubros, quotes, vendors, chosenByRubro, setQuoteStatus, chooseQuote } = planning;
    const vendorName = (id: string) => vendors.find(v => v.id === id)?.name || '—';
    const rubrosConQuotes = rubros.filter(r => quotes.some(q => q.rubro_id === r.id));

    if (rubrosConQuotes.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center">
                <Scale className="mx-auto mb-3 h-8 w-8" style={{ color: PINK }} />
                <p className="font-display font-extrabold text-lg" style={{ color: DARK }}>Nada que comparar todavía</p>
                <p className="mt-1 text-sm text-stone-500">Agrega cotizaciones a tus rubros (en Partidas) y aquí las verás lado a lado para decidir.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <p className="px-1 text-xs text-stone-400">Compara las cotizaciones de cada rubro. Marca una <Star className="inline h-3 w-3" style={{ color: PINK }} /> favorita o elige el contrato. La más barata se resalta.</p>
            {rubrosConQuotes.map(r => {
                const qs = quotes.filter(q => q.rubro_id === r.id && q.status !== 'descartado');
                const min = Math.min(...qs.map(q => Number(q.amount || 0)));
                const chosen = chosenByRubro[r.id];
                return (
                    <div key={r.id} className="rounded-3xl border border-stone-200 bg-white p-4 sm:p-5">
                        <div className="mb-3 flex items-center justify-between gap-2">
                            <h3 className="font-display font-extrabold truncate" style={{ color: DARK }}>{r.name}</h3>
                            <span className="shrink-0 text-[11px] text-stone-400">{qs.length} opción(es)</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            {qs.sort((a, b) => Number(a.amount) - Number(b.amount)).map(q => {
                                const isMin = Number(q.amount) === min && qs.length > 1;
                                const chip = QUOTE_CHIP[q.status as QuoteState] || QUOTE_CHIP.cotizado;
                                return (
                                    <div key={q.id} className={`rounded-2xl border p-3 ${q.is_chosen ? 'border-emerald-300 bg-emerald-50/40' : 'border-stone-200'}`}>
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="min-w-0 flex-1 truncate font-bold text-sm" style={{ color: DARK }}>{vendorName(q.vendor_id)}</p>
                                            {isMin && <span className="shrink-0 rounded-full bg-sky-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-700">+ barata</span>}
                                        </div>
                                        <p className="mt-1 text-xl font-display font-black" style={{ color: DARK }}>{money(Number(q.amount))}</p>
                                        <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider" style={{ background: chip.bg, color: chip.fg }}>{chip.label}</span>
                                        <div className="mt-2.5 flex items-center gap-1.5">
                                            <button onClick={() => setQuoteStatus(q.id, q.status === 'favorito' ? 'cotizado' : 'favorito')}
                                                className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer ${q.status === 'favorito' ? 'border-pink-200 bg-pink-50 text-pink-700' : 'border-stone-200 text-stone-500 hover:bg-stone-50'}`}>
                                                <Star className="h-3 w-3" fill={q.status === 'favorito' ? '#DF3B94' : 'none'} /> Favorito
                                            </button>
                                            {q.is_chosen
                                                ? <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: '#166534' }}><Check className="h-3.5 w-3.5" /> Contrato</span>
                                                : <button onClick={async () => { await chooseQuote(q); toast.success('Contrato elegido'); }} className="rounded-lg px-2.5 py-1.5 text-[10px] uppercase font-bold tracking-wider text-white cursor-pointer" style={{ background: DARK }}>Elegir</button>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {chosen && <p className="mt-2 text-[11px] text-stone-400">Contrato actual: <span className="font-bold" style={{ color: '#166534' }}>{vendorName(chosen.vendor_id)} · {money(Number(chosen.amount))}</span></p>}
                    </div>
                );
            })}
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
    const dragControls = useDragControls();

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
        <Reorder.Item value={rubro} dragListener={false} dragControls={dragControls}
            className="rounded-2xl border border-stone-200 bg-white min-w-0 overflow-hidden shadow-2xs list-none">
          <div className="flex items-stretch">
            <span onPointerDown={e => dragControls.start(e)}
                className="flex shrink-0 cursor-grab touch-none items-center px-1 sm:px-1.5 text-stone-300 hover:text-stone-500 active:cursor-grabbing"
                title="Arrastra para reordenar" aria-label="Reordenar rubro">
                <GripVertical className="h-4 w-4" />
            </span>
            <button onClick={onToggle} className="flex-1 min-w-0 text-left p-3.5 pl-1 sm:px-5 sm:py-4 sm:pl-2 transition-colors hover:bg-stone-50/50 cursor-pointer">
                {/* Vista Mobile (< sm) */}
                <div className="sm:hidden space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            {expanded ? <ChevronDown className="h-4 w-4 text-stone-400 shrink-0" /> : <ChevronRight className="h-4 w-4 text-stone-400 shrink-0" />}
                            <span className="font-display font-bold text-sm text-stone-900 truncate">{rubro.name}</span>
                            {rubro.location && <span className="shrink-0 rounded-full bg-stone-100 px-1.5 py-0.5 text-[8px] uppercase tracking-wider text-stone-500">{LOC_LABEL[rubro.location] || rubro.location}</span>}
                            {rubro.is_external && <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[8px] uppercase tracking-wider" style={{ background: `${PINK}1a`, color: PINK }}>Invitto</span>}
                        </div>
                        <div className="shrink-0 text-right">
                            {chosen ? (
                                <span className="font-bold text-xs" style={{ color: '#166534' }}>{money(Number(chosen.amount))}</span>
                            ) : (
                                <span className="text-[10px] font-medium text-stone-400">{myQuotes.length} cot.</span>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-left bg-stone-50/80 p-2 rounded-xl">
                        <div className="min-w-0">
                            <span className="block text-[8px] uppercase font-bold tracking-wider text-stone-400">Estimado</span>
                            <span className="font-bold text-stone-700 text-xs truncate block">{money(est)}</span>
                            {guia > 0 && <span className="block text-[8px] text-stone-400 truncate leading-tight">guía {money(guia)}</span>}
                        </div>
                        <div className="min-w-0">
                            <span className="block text-[8px] uppercase font-bold tracking-wider text-stone-400">Cotizado</span>
                            <span className="font-bold text-stone-700 text-xs truncate block">{cotizado ? money(cotizado) : '—'}</span>
                        </div>
                        <div className="min-w-0 text-right">
                            <span className="block text-[8px] uppercase font-bold tracking-wider text-stone-400">Contratado</span>
                            {chosen ? (
                                <span className="font-bold text-xs truncate block" style={{ color: '#166534' }}>{money(Number(chosen.amount))}</span>
                            ) : (
                                <span className="text-stone-400 text-xs truncate block">—</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Vista Desktop (>= sm) */}
                <div className="hidden sm:grid sm:grid-cols-12 sm:items-center sm:gap-2">
                    <div className="col-span-5 flex items-center gap-2 min-w-0">
                        {expanded ? <ChevronDown className="h-4 w-4 text-stone-400 shrink-0" /> : <ChevronRight className="h-4 w-4 text-stone-400 shrink-0" />}
                        <span className="font-display font-bold truncate" style={{ color: DARK }}>{rubro.name}</span>
                        {rubro.location && <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-[9px] uppercase tracking-wider text-stone-500">{LOC_LABEL[rubro.location] || rubro.location}</span>}
                        {rubro.is_external && <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider" style={{ background: `${PINK}1a`, color: PINK }}>Invitto</span>}
                    </div>
                    <div className="col-span-2 text-right text-xs text-stone-400 min-w-0">
                        <span className="block text-[9px] uppercase tracking-wider">Estimado</span>
                        <span className="font-bold text-stone-700 truncate block">{money(est)}</span>
                        {guia > 0 && <span className="block text-[9px] text-stone-400 truncate">guía {money(guia)}</span>}
                    </div>
                    <div className="col-span-2 text-right text-xs text-stone-400 min-w-0">
                        <span className="block text-[9px] uppercase tracking-wider">Cotizado</span>
                        <span className="font-bold text-stone-700 truncate block">{cotizado ? money(cotizado) : '—'}</span>
                    </div>
                    <div className="col-span-3 text-right text-xs min-w-0">
                        <span className="block text-[9px] uppercase tracking-wider text-stone-400">Contratado</span>
                        {chosen
                            ? <span className="font-bold truncate block" style={{ color: '#166534' }}>{money(Number(chosen.amount))}</span>
                            : <span className="text-stone-400 truncate block">{myQuotes.length} cotización(es)</span>}
                    </div>
                </div>
            </button>
          </div>

            {expanded && (
                <div className="border-t border-stone-100 px-4 sm:px-5 py-4 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
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
                                                : <button onClick={() => chooseQuote(q)} className="rounded-lg px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-white cursor-pointer" style={{ background: DARK }}>Elegir</button>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-3 flex flex-col sm:flex-row flex-wrap gap-2">
                            <select value={qv} onChange={e => setQv(e.target.value)} className="w-full sm:w-auto sm:min-w-[160px] sm:flex-1 rounded-xl border border-stone-200 bg-[#F8F9FA] p-2.5 text-sm outline-none focus:border-[#DF3B94]">
                                <option value="">Proveedor…</option>
                                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                                <input value={qa} onChange={e => setQa(e.target.value)} type="number" placeholder="Monto"
                                    className="w-full sm:w-28 rounded-xl border border-stone-200 bg-[#F8F9FA] p-2.5 text-sm outline-none focus:border-[#DF3B94]" />
                                <select value={qs} onChange={e => setQs(e.target.value as QuoteState)} className="w-full sm:w-auto rounded-xl border border-stone-200 bg-[#F8F9FA] p-2.5 text-sm outline-none focus:border-[#DF3B94]">
                                    {(['contactado', 'cotizado'] as QuoteState[]).map(s => <option key={s} value={s}>{QUOTE_CHIP[s].label}</option>)}
                                </select>
                            </div>
                            <button onClick={submitQuote} className="w-full sm:w-auto rounded-xl px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest text-white cursor-pointer" style={{ background: PINK }}>Añadir</button>
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
                                            : <button onClick={() => markPaymentPaid(p.id)} className="rounded-lg px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-white cursor-pointer" style={{ background: PINK }}>Pagar</button>}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 flex flex-col sm:flex-row flex-wrap gap-2">
                                <input value={pl} onChange={e => setPl(e.target.value)} placeholder="Concepto (Anticipo…)"
                                    className="w-full sm:w-auto sm:min-w-[150px] sm:flex-1 rounded-xl border border-stone-200 bg-[#F8F9FA] p-2.5 text-sm outline-none focus:border-[#DF3B94]" />
                                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                                    <input value={pa} onChange={e => setPa(e.target.value)} type="number" placeholder="Monto"
                                        className="w-full sm:w-28 rounded-xl border border-stone-200 bg-[#F8F9FA] p-2.5 text-sm outline-none focus:border-[#DF3B94]" />
                                    <input value={pd} onChange={e => setPd(e.target.value)} type="date"
                                        className="w-full sm:w-auto rounded-xl border border-stone-200 bg-[#F8F9FA] p-2.5 text-sm outline-none focus:border-[#DF3B94]" />
                                </div>
                                <button onClick={submitPayment} className="w-full sm:w-auto rounded-xl px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest text-white cursor-pointer" style={{ background: DARK }}>Añadir pago</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Reorder.Item>
    );
};

// ── Proveedores (directorio + ficha editable) ─────────────────────────────────
const Proveedores: React.FC<{ planning: Planning; toast: any }> = ({ planning, toast }) => {
    const { vendors, quotes, rubros, addVendor, updateVendor, deleteVendor } = planning;
    const [sel, setSel] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', category: '', phone: '', contact_name: '' });
    const [edit, setEdit] = useState({ name: '', category: '', phone: '', contact_name: '', notes: '' });
    const [catFilter, setCatFilter] = useState('');

    const categories = useMemo(() => Array.from(new Set(vendors.map(v => v.category).filter(Boolean))).sort(), [vendors]);
    const visibleVendors = catFilter ? vendors.filter(v => v.category === catFilter) : vendors;
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
                {categories.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                        <button onClick={() => setCatFilter('')} className={`rounded-full px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider cursor-pointer ${!catFilter ? 'text-white' : 'bg-stone-100 text-stone-500'}`} style={!catFilter ? { background: DARK } : undefined}>Todas</button>
                        {categories.map(c => (
                            <button key={c} onClick={() => setCatFilter(c)} className={`rounded-full px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider cursor-pointer ${catFilter === c ? 'text-white' : 'bg-stone-100 text-stone-500'}`} style={catFilter === c ? { background: DARK } : undefined}>{c}</button>
                        ))}
                    </div>
                )}
                <div className="space-y-2">
                    {visibleVendors.length === 0 && <p className="text-sm text-stone-400">{vendors.length === 0 ? 'Sin proveedores aún.' : 'Sin proveedores en esta categoría.'}</p>}
                    {visibleVendors.map(v => (
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

// Fila de pendiente reordenable (asa de arrastre separada del toggle).
const TaskRow: React.FC<{ task: any; onToggle: () => void }> = ({ task, onToggle }) => {
    const controls = useDragControls();
    return (
        <Reorder.Item value={task} dragListener={false} dragControls={controls}
            className="flex items-center gap-1 rounded-2xl border border-stone-100 bg-white list-none min-w-0">
            <span onPointerDown={e => controls.start(e)}
                className="flex shrink-0 cursor-grab touch-none items-center pl-1.5 text-stone-300 hover:text-stone-500 active:cursor-grabbing"
                aria-label="Reordenar pendiente"><GripVertical className="h-4 w-4" /></span>
            <button onClick={onToggle}
                className="flex flex-1 items-center gap-2.5 sm:gap-3 rounded-2xl p-2.5 pl-1 sm:p-3 text-left hover:bg-stone-50 min-w-0 cursor-pointer">
                {task.is_done ? <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: PINK }} /> : <Circle className="h-5 w-5 shrink-0 text-stone-300" />}
                <span className={`font-medium text-sm flex-1 min-w-0 ${task.is_done ? 'text-stone-400 line-through' : ''}`} style={{ color: task.is_done ? undefined : DARK }}>{task.title}</span>
                <span className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
                    {task.due_date && <span className="text-[10px] sm:text-[11px] text-stone-400">{fmtShort(task.due_date)}</span>}
                    {task.source === 'template' && <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-stone-300">base</span>}
                </span>
            </button>
        </Reorder.Item>
    );
};

// ── Pendientes ────────────────────────────────────────────────────────────────
const Pendientes: React.FC<{ planning: Planning; toast: any }> = ({ planning, toast }) => {
    const { tasks, toggleTask, addTask, seedDefaults, reload, reorderTasks } = planning;
    const [title, setTitle] = useState(''); const [phase, setPhase] = useState('1_month');

    const done = tasks.filter(t => t.is_done).length;
    const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    const grouped = useMemo(() => {
        const g: Record<string, any[]> = {};
        for (const t of tasks) { const k = t.phase || 'sin_fase'; (g[k] ||= []).push(t); }
        return g;
    }, [tasks]);

    const submit = async () => { if (!title.trim()) return; await addTask(title.trim(), phase); setTitle(''); toast.success('Pendiente agregado'); };
    const seed = async () => { const err = await seedDefaults(); if (err) return toast.error(typeof err === 'string' ? err : 'No se pudo cargar tu plan'); await reload(); toast.success('¡Tu plan está listo!'); };

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

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 rounded-3xl border border-stone-200 bg-white p-3.5 sm:p-4 min-w-0">
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nuevo pendiente"
                    className="flex-1 rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 text-sm outline-none focus:border-[#DF3B94] min-w-0" />
                <select value={phase} onChange={e => setPhase(e.target.value)} className="w-full sm:w-auto rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 text-sm outline-none focus:border-[#DF3B94] min-w-0">
                    {PHASES.filter(p => p.key !== 'sin_fase').map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                </select>
                <button onClick={submit} className="flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-xs font-bold uppercase tracking-widest text-white cursor-pointer" style={{ background: PINK }}>
                    <Plus className="h-4 w-4" /> Agregar
                </button>
            </div>

            {tasks.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center">
                    <Sparkles className="mx-auto mb-3 h-8 w-8" style={{ color: PINK }} />
                    <p className="font-display font-extrabold text-lg" style={{ color: DARK }}>Carga tu plan en un clic</p>
                    <p className="mt-1 text-sm text-stone-500">Te dejamos listo el presupuesto por rubros, el checklist por fases (anillos, menú, canciones…), una lista de proveedores sugeridos y la carpeta del día. Luego solo ajustas.</p>
                    <button onClick={seed} className="mt-5 rounded-2xl px-6 py-3 text-[11px] uppercase font-bold tracking-widest text-white cursor-pointer" style={{ background: DARK }}>Cargar mi plan</button>
                </div>
            ) : (
                PHASES.filter(p => grouped[p.key]?.length).map(p => {
                    const items = [...(grouped[p.key] || [])].sort((a, b) =>
                        ((a.sort_order ?? 9999) - (b.sort_order ?? 9999)) || ((a.due_date || '9999') < (b.due_date || '9999') ? -1 : 1));
                    const d = items.filter(t => t.is_done).length;
                    return (
                        <div key={p.key} className="rounded-3xl border border-stone-200 bg-white p-4 sm:p-6 min-w-0">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-[11px] uppercase font-bold tracking-widest" style={{ color: PINK }}>{p.label}</h3>
                                <span className="text-[11px] font-bold text-stone-400">{d}/{items.length}</span>
                            </div>
                            <Reorder.Group as="div" axis="y" values={items} onReorder={(arr) => reorderTasks(p.key, arr)} className="space-y-2">
                                {items.map(t => (
                                    <TaskRow key={t.id} task={t} onToggle={() => toggleTask(t.id, !t.is_done)} />
                                ))}
                            </Reorder.Group>
                        </div>
                    );
                })
            )}
        </div>
    );
};

// ── Agenda / calendario (pagos + tareas + citas) ──────────────────────────────
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const EVENT_META: Record<string, { color: string; label: string }> = {
    pago: { color: '#DF3B94', label: 'Pago' },
    tarea: { color: '#f59e0b', label: 'Tarea' },
    cita: { color: '#6366f1', label: 'Cita' },
};
const WEEK_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const Agenda: React.FC<{ planning: Planning; toast: any }> = ({ planning, toast }) => {
    const { payments, tasks, appointments, vendors, markPaymentPaid, addAppointment, deleteAppointment } = planning;
    const today = new Date();
    const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [mode, setMode] = useState<'mes' | 'semana'>('mes');
    const [selected, setSelected] = useState<string>(ymd(today));
    const [showForm, setShowForm] = useState(false);
    const [f, setF] = useState({ title: '', date: ymd(today), time: '', vendor_id: '', location: '' });
    const vendorName = (id: string | null) => (id ? vendors.find(v => v.id === id)?.name : '') || '';

    const items = useMemo(() => {
        const out: { date: string; type: 'pago' | 'tarea' | 'cita'; title: string; time?: string; raw: any }[] = [];
        for (const p of payments) if (p.due_date && p.status !== 'paid') out.push({ date: p.due_date, type: 'pago', title: `${p.label || 'Pago'} · ${money(Number(p.amount))}`, raw: p });
        for (const t of tasks) if (t.due_date && !t.is_done) out.push({ date: t.due_date, type: 'tarea', title: t.title, raw: t });
        for (const a of appointments) if (a.date) out.push({ date: a.date, type: 'cita', title: a.title, time: a.time, raw: a });
        return out;
    }, [payments, tasks, appointments]);

    const byDate = useMemo(() => {
        const m: Record<string, typeof items> = {};
        for (const it of items) (m[it.date] ||= []).push(it);
        return m;
    }, [items]);

    const upcoming = useMemo(() => {
        const ts = ymd(today);
        return [...items].filter(i => i.date >= ts).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)).slice(0, 6);
    }, [items]);

    // Grid del mes (lunes a domingo)
    const grid = useMemo(() => {
        const y = cursor.getFullYear(), mo = cursor.getMonth();
        const startDay = (new Date(y, mo, 1).getDay() + 6) % 7;
        const days = new Date(y, mo + 1, 0).getDate();
        const cells: (Date | null)[] = [];
        for (let i = 0; i < startDay; i++) cells.push(null);
        for (let d = 1; d <= days; d++) cells.push(new Date(y, mo, d));
        while (cells.length % 7 !== 0) cells.push(null);
        return cells;
    }, [cursor]);

    // Días de la semana que contiene `selected`
    const weekDays = useMemo(() => {
        const base = new Date(selected + 'T00:00:00');
        const monday = new Date(base); monday.setDate(base.getDate() - ((base.getDay() + 6) % 7));
        return Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });
    }, [selected]);

    const moveMonth = (delta: number) => setCursor(c => new Date(c.getFullYear(), c.getMonth() + delta, 1));
    const selItems = byDate[selected] || [];

    const submit = async () => {
        if (!f.title.trim() || !f.date) return toast.error('Pon título y fecha');
        await addAppointment({ title: f.title.trim(), date: f.date, time: f.time, vendor_id: f.vendor_id || null, location: f.location });
        setF({ title: '', date: selected, time: '', vendor_id: '', location: '' }); setShowForm(false); toast.success('Cita agregada');
    };

    const remindWhatsApp = (p: any) => {
        const ph = (vendors.find(v => v.id === p.vendor_id)?.phone || '').replace(/[^0-9]/g, '');
        if (!ph) return toast.error('Ese proveedor no tiene WhatsApp');
        const msg = `Hola, te escribo sobre el pago "${p.label || 'Pago'}" de ${money(Number(p.amount))}${p.due_date ? ` con fecha ${p.due_date}` : ''}. ¿Lo confirmamos?`;
        window.open(`https://wa.me/${ph}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const dayLabel = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <button onClick={() => moveMonth(-1)} className="rounded-xl border border-stone-200 p-2 text-stone-500 hover:bg-stone-50 cursor-pointer"><ChevronLeft className="h-4 w-4" /></button>
                    <h3 className="min-w-[160px] text-center font-display font-extrabold capitalize" style={{ color: DARK }}>{cursor.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}</h3>
                    <button onClick={() => moveMonth(1)} className="rounded-xl border border-stone-200 p-2 text-stone-500 hover:bg-stone-50 cursor-pointer"><ChevronRight className="h-4 w-4" /></button>
                </div>
                <div className="flex items-center gap-2">
                    <div className="inline-flex gap-1 rounded-xl border border-stone-200 bg-white p-1">
                        {(['mes', 'semana'] as const).map(m => (
                            <button key={m} onClick={() => setMode(m)} className={`rounded-lg px-3 py-1.5 text-[11px] uppercase font-bold tracking-wider cursor-pointer ${mode === m ? 'text-white' : 'text-stone-500'}`} style={mode === m ? { background: DARK } : undefined}>{m}</button>
                        ))}
                    </div>
                    <button onClick={() => { setF(s => ({ ...s, date: selected })); setShowForm(v => !v); }} className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] uppercase font-bold tracking-wider text-white cursor-pointer" style={{ background: PINK }}><Plus className="h-3.5 w-3.5" /> Cita</button>
                </div>
            </div>

            {showForm && (
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 rounded-2xl border border-stone-200 bg-white p-3">
                    <input value={f.title} onChange={e => setF({ ...f, title: e.target.value })} placeholder="Título (ej. Prueba de menú)" className="flex-1 min-w-0 rounded-xl border border-stone-200 bg-[#F8F9FA] p-2.5 text-sm outline-none focus:border-[#DF3B94]" />
                    <div className="grid grid-cols-2 sm:flex gap-2">
                        <input value={f.date} onChange={e => setF({ ...f, date: e.target.value })} type="date" className="rounded-xl border border-stone-200 bg-[#F8F9FA] p-2.5 text-sm outline-none focus:border-[#DF3B94]" />
                        <input value={f.time} onChange={e => setF({ ...f, time: e.target.value })} type="time" className="rounded-xl border border-stone-200 bg-[#F8F9FA] p-2.5 text-sm outline-none focus:border-[#DF3B94]" />
                    </div>
                    <select value={f.vendor_id} onChange={e => setF({ ...f, vendor_id: e.target.value })} className="rounded-xl border border-stone-200 bg-[#F8F9FA] p-2.5 text-sm outline-none focus:border-[#DF3B94]">
                        <option value="">Proveedor (opc.)</option>
                        {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                    <button onClick={submit} className="rounded-xl px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest text-white cursor-pointer" style={{ background: DARK }}>Guardar</button>
                </div>
            )}

            {/* Leyenda */}
            <div className="flex flex-wrap gap-3 px-1">
                {Object.entries(EVENT_META).map(([k, v]) => (
                    <span key={k} className="flex items-center gap-1.5 text-[11px] text-stone-500"><span className="h-2.5 w-2.5 rounded-full" style={{ background: v.color }} /> {v.label}</span>
                ))}
            </div>

            {mode === 'mes' ? (
                <div className="rounded-3xl border border-stone-200 bg-white p-3 sm:p-4">
                    <div className="grid grid-cols-7 gap-1">
                        {WEEK_DAYS.map((d, i) => <div key={i} className="pb-1 text-center text-[10px] uppercase font-bold tracking-wider text-stone-400">{d}</div>)}
                        {grid.map((d, i) => {
                            if (!d) return <div key={i} />;
                            const iso = ymd(d);
                            const dayItems = byDate[iso] || [];
                            const isToday = iso === ymd(today);
                            const isSel = iso === selected;
                            return (
                                <button key={i} onClick={() => setSelected(iso)}
                                    className={`flex min-h-[48px] sm:min-h-[60px] flex-col items-center gap-1 rounded-xl border p-1 text-left transition-colors cursor-pointer ${isSel ? 'border-[#DF3B94] bg-[#DF3B94]/5' : 'border-transparent hover:bg-stone-50'}`}>
                                    <span className={`text-xs font-bold ${isToday ? 'flex h-5 w-5 items-center justify-center rounded-full text-white' : 'text-stone-600'}`} style={isToday ? { background: PINK } : undefined}>{d.getDate()}</span>
                                    <span className="flex flex-wrap justify-center gap-0.5">
                                        {dayItems.slice(0, 3).map((it, j) => <span key={j} className="h-1.5 w-1.5 rounded-full" style={{ background: EVENT_META[it.type].color }} />)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="rounded-3xl border border-stone-200 bg-white p-3 sm:p-4 space-y-1.5">
                    {weekDays.map(d => {
                        const iso = ymd(d);
                        const dayItems = byDate[iso] || [];
                        return (
                            <button key={iso} onClick={() => setSelected(iso)} className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left cursor-pointer ${iso === selected ? 'border-[#DF3B94] bg-[#DF3B94]/5' : 'border-stone-100 hover:bg-stone-50'}`}>
                                <span className="w-14 shrink-0 text-xs font-bold capitalize" style={{ color: iso === ymd(today) ? PINK : DARK }}>{d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' })}</span>
                                <span className="flex flex-1 flex-wrap gap-1">
                                    {dayItems.length === 0 ? <span className="text-xs text-stone-300">—</span> : dayItems.map((it, j) => (
                                        <span key={j} className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: `${EVENT_META[it.type].color}1a`, color: EVENT_META[it.type].color }}>{it.title.length > 22 ? it.title.slice(0, 22) + '…' : it.title}</span>
                                    ))}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Detalle del día seleccionado */}
            <div className="rounded-3xl border border-stone-200 bg-white p-5">
                <h3 className="mb-3 text-[11px] uppercase font-bold tracking-widest capitalize" style={{ color: PINK }}>{dayLabel(selected)}</h3>
                {selItems.length === 0 ? (
                    <p className="text-sm text-stone-400">Sin pagos, tareas ni citas este día.</p>
                ) : (
                    <div className="space-y-2">
                        {selItems.map((it, j) => (
                            <div key={j} className="flex items-center justify-between gap-2 rounded-2xl border border-stone-100 p-3">
                                <div className="flex min-w-0 items-center gap-2.5">
                                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: EVENT_META[it.type].color }} />
                                    <div className="min-w-0">
                                        <p className="truncate font-bold text-sm" style={{ color: DARK }}>{it.title}</p>
                                        <p className="text-xs text-stone-500">
                                            {EVENT_META[it.type].label}
                                            {it.type === 'cita' && it.time ? ` · ${it.time}` : ''}
                                            {it.type === 'cita' && vendorName(it.raw.vendor_id) ? ` · ${vendorName(it.raw.vendor_id)}` : ''}
                                            {it.type === 'cita' && it.raw.location ? ` · ${it.raw.location}` : ''}
                                            {it.type === 'pago' && vendorName(it.raw.vendor_id) ? ` · ${vendorName(it.raw.vendor_id)}` : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-1.5">
                                    {it.type === 'pago' && (
                                        <>
                                            <button onClick={() => remindWhatsApp(it.raw)} className="flex items-center gap-1 rounded-lg bg-[#25D366] px-2.5 py-1.5 text-[10px] font-bold text-white cursor-pointer" title="Recordar por WhatsApp"><Phone className="h-3 w-3" /> Recordar</button>
                                            <button onClick={async () => { await markPaymentPaid(it.raw.id); toast.success('Marcado como pagado'); }} className="rounded-lg px-2.5 py-1.5 text-[10px] uppercase font-bold tracking-wider text-white cursor-pointer" style={{ background: PINK }}>Pagar</button>
                                        </>
                                    )}
                                    {it.type === 'cita' && (
                                        <button onClick={async () => { if (window.confirm('¿Eliminar esta cita?')) { await deleteAppointment(it.raw.id); toast.success('Cita eliminada'); } }} className="rounded-lg p-2 text-stone-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Eliminar cita"><Trash2 className="h-4 w-4" /></button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Próximos eventos */}
            <div className="rounded-3xl border border-stone-200 bg-white p-5">
                <h3 className="mb-3 text-[11px] uppercase font-bold tracking-widest text-stone-500">Próximos eventos</h3>
                {upcoming.length === 0 ? (
                    <p className="text-sm text-stone-400">Nada próximo en la agenda.</p>
                ) : (
                    <div className="space-y-2">
                        {upcoming.map((it, j) => (
                            <button key={j} onClick={() => { setSelected(it.date); setCursor(new Date(it.date + 'T00:00:00')); }} className="flex w-full items-center gap-3 rounded-2xl border border-stone-100 p-2.5 text-left hover:bg-stone-50 cursor-pointer">
                                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: EVENT_META[it.type].color }} />
                                <span className="min-w-0 flex-1 truncate text-sm" style={{ color: DARK }}>{it.title}</span>
                                <span className="shrink-0 text-[11px] text-stone-400">{fmtShort(it.date)}{it.type === 'cita' && it.time ? ` · ${it.time}` : ''}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <p className="px-2 text-xs text-stone-400">Los recordatorios automáticos por WhatsApp/correo se activan desde el servidor (requiere tu API conectada). Aquí puedes recordar manualmente con el botón verde.</p>
        </div>
    );
};

// ── Materiales / inventario de alquiler ───────────────────────────────────────
const Materiales: React.FC<{ planning: Planning; toast: any }> = ({ planning, toast }) => {
    const { rentalItems, vendors, addRentalItem, toggleReturned, deleteRentalItem } = planning;
    const [name, setName] = useState(''); const [qty, setQty] = useState(''); const [vendor, setVendor] = useState('');
    const vendorName = (id: string | null) => (id ? vendors.find(v => v.id === id)?.name : '') || '';
    const returned = rentalItems.filter(m => m.status === 'returned').length;
    const totalUnits = rentalItems.reduce((n, m) => n + (Number(m.qty) || 0), 0);

    const submit = async () => {
        if (!name.trim()) return toast.error('Pon el nombre del material');
        await addRentalItem({ name: name.trim(), qty: Number(qty) || 1, vendor_id: vendor || null });
        setName(''); setQty(''); setVendor(''); toast.success('Material agregado');
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-stone-200 bg-[#F8F9FA] p-5">
                <p className="text-sm text-stone-500">
                    <span className="font-bold" style={{ color: DARK }}>Inventario de alquiler.</span> Lleva la cuenta de lo rentado
                    (sillas, mantelería, vajilla, pista…) y marca lo que ya devolviste tras el evento.
                </p>
                <div className="flex gap-2.5">
                    <TotalPill label="Materiales" value={`${rentalItems.length}`} />
                    <TotalPill label="Piezas" value={`${totalUnits}`} />
                    <TotalPill label="Devueltos" value={`${returned}/${rentalItems.length}`} accent />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 rounded-3xl border border-stone-200 bg-white p-3.5 sm:p-4">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Material (ej. Sillas Tiffany)"
                    className="flex-1 rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 text-sm outline-none focus:border-[#DF3B94] min-w-0" />
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                    <input value={qty} onChange={e => setQty(e.target.value)} type="number" placeholder="Cant."
                        className="w-full sm:w-24 rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 text-sm outline-none focus:border-[#DF3B94] min-w-0" />
                    <select value={vendor} onChange={e => setVendor(e.target.value)}
                        className="w-full sm:w-auto rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 text-sm outline-none focus:border-[#DF3B94] min-w-0">
                        <option value="">Proveedor (opc.)</option>
                        {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                </div>
                <button onClick={submit} className="flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-xs font-bold uppercase tracking-widest text-white cursor-pointer" style={{ background: PINK }}>
                    <Plus className="h-4 w-4" /> Agregar
                </button>
            </div>

            <div className="space-y-2">
                {rentalItems.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center">
                        <Boxes className="mx-auto mb-3 h-8 w-8" style={{ color: PINK }} />
                        <p className="font-display font-extrabold text-lg" style={{ color: DARK }}>Aún no hay materiales</p>
                        <p className="mt-1 text-sm text-stone-500">Agrega lo que vas a rentar para no perder la cuenta de las devoluciones.</p>
                    </div>
                )}
                {rentalItems.map(m => {
                    const done = m.status === 'returned';
                    return (
                        <div key={m.id} className="flex items-center justify-between gap-2 rounded-2xl border border-stone-100 bg-white p-3">
                            <button onClick={() => toggleReturned(m.id, !done)} className="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer">
                                {done ? <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: PINK }} /> : <Circle className="h-5 w-5 shrink-0 text-stone-300" />}
                                <span className="min-w-0">
                                    <span className={`block truncate font-bold ${done ? 'text-stone-400 line-through' : ''}`} style={{ color: done ? undefined : DARK }}>
                                        {m.name} <span className="font-normal text-stone-400">× {m.qty}</span>
                                    </span>
                                    <span className="block truncate text-xs text-stone-500">
                                        {vendorName(m.vendor_id) ? `${vendorName(m.vendor_id)} · ` : ''}{done ? 'devuelto' : 'pendiente de devolver'}{m.notes ? ` · ${m.notes}` : ''}
                                    </span>
                                </span>
                            </button>
                            <div className="flex shrink-0 items-center gap-2">
                                <span className="rounded-full px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider"
                                    style={done ? { background: '#dcfce7', color: '#166534' } : { background: '#fef3c7', color: '#92400e' }}>
                                    {done ? 'Devuelto' : 'Pendiente'}
                                </span>
                                <button onClick={async () => { if (window.confirm(`¿Eliminar "${m.name}"?`)) { await deleteRentalItem(m.id); toast.success('Eliminado'); } }}
                                    className="rounded-lg p-2 text-stone-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Eliminar material"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        </div>
                    );
                })}
            </div>
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
                <div className="mb-4 flex flex-col sm:flex-row flex-wrap gap-2">
                    <input value={gn} onChange={e => setGn(e.target.value)} placeholder="Quién regaló"
                        className="w-full sm:w-auto sm:min-w-[140px] sm:flex-1 rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 text-sm outline-none focus:border-[#DF3B94]" />
                    <input value={gg} onChange={e => setGg(e.target.value)} placeholder="Regalo"
                        className="w-full sm:w-auto sm:min-w-[140px] sm:flex-1 rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 text-sm outline-none focus:border-[#DF3B94]" />
                    <div className="flex gap-2">
                        <input value={ga} onChange={e => setGa(e.target.value)} type="number" placeholder="Valor (opc.)"
                            className="w-28 rounded-2xl border border-stone-200 bg-[#F8F9FA] p-3 text-sm outline-none focus:border-[#DF3B94]" />
                        <button onClick={submit} className="flex-1 sm:flex-none rounded-2xl px-6 py-3 text-xs font-bold uppercase tracking-widest text-white cursor-pointer" style={{ background: PINK }}>Agregar</button>
                    </div>
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
                    {afterTasks.length === 0 && <p className="text-sm text-stone-400">Aparecen al cargar tu plan: devolver materiales, pagar saldos, agradecer, compartir fotos, reseñas.</p>}
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
                <div key={s.key} className="rounded-3xl border border-stone-200 bg-white p-4 sm:p-6 min-w-0">
                    <h3 className="mb-4 text-[11px] uppercase font-bold tracking-widest" style={{ color: PINK }}>{s.label}</h3>
                    <div className="space-y-2">
                        {!(grouped[s.key]?.length) && <p className="text-sm text-stone-400">Sin elementos. Se cargan solos al abrir tu plan.</p>}
                        {(grouped[s.key] || []).map(d => (
                            <button key={d.id} onClick={() => toggleDayOf(d.id, !d.is_done)}
                                className="flex w-full items-center gap-3 sm:gap-4 rounded-2xl border border-stone-100 p-2.5 sm:p-3 text-left hover:bg-stone-50 min-w-0 cursor-pointer">
                                <span className="w-12 sm:w-14 shrink-0 font-display font-black text-sm sm:text-base" style={{ color: PINK }}>{d.time || '--:--'}</span>
                                {d.is_done ? <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: PINK }} /> : <Circle className="h-5 w-5 shrink-0 text-stone-300" />}
                                <span className={`font-medium text-sm flex-1 min-w-0 ${d.is_done ? 'text-stone-400 line-through' : ''}`} style={{ color: d.is_done ? undefined : DARK }}>{d.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            <div className="rounded-3xl border border-stone-200 bg-white p-4 sm:p-6 min-w-0">
                <h3 className="mb-1 text-[11px] uppercase font-bold tracking-widest" style={{ color: PINK }}>A quién llamar</h3>
                <p className="mb-4 text-xs text-stone-400">Se arma solo con los proveedores que tienen WhatsApp.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {contactos.length === 0 && <p className="text-sm text-stone-400">Agrega teléfonos a tus proveedores.</p>}
                    {contactos.map(v => (
                        <a key={v.id} href={`https://wa.me/${v.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer"
                            className="flex items-center justify-between rounded-2xl border border-stone-100 p-3 hover:bg-stone-50 min-w-0">
                            <div className="min-w-0 flex-1 mr-2">
                                <p className="font-bold truncate text-sm" style={{ color: DARK }}>{v.name}</p>
                                <p className="text-xs text-stone-500 truncate">{v.category || ''}</p>
                            </div>
                            <span className="shrink-0 flex items-center gap-1.5 rounded-xl bg-[#25D366] px-2.5 sm:px-3 py-1.5 text-[10px] font-bold text-white"><Phone className="h-3 w-3" /> {v.phone}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlanningPage;
