import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Layout, Users, Zap, ArrowUpRight, Plus, Clock, Sparkles, PartyPopper, ArrowRight, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardHome: React.FC = () => {
    const [stats, setStats] = useState({
        totalEvents: 0,
        totalGuests: 0,
        confirmedRate: 0,
    });
    const [recentEvents, setRecentEvents] = useState<any[]>([]);
    const [isPersonalized, setIsPersonalized] = useState(false);
    const [tier, setTier] = useState('clasico');
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        // MOCK MODE: skip real Supabase queries
        if (!import.meta.env.VITE_SUPABASE_URL) {
            setLoading(false);
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Fetch events
                const { data: events, error: eventsError } = await supabase
                    .from('events')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (eventsError) throw eventsError;

                // Check user plan from profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('plan_tier')
                    .eq('id', user.id)
                    .single();
                
                let currentTier = profile?.plan_tier?.toLowerCase() || 'free';

                // FALLBACK: Calculate the highest plan from user's events in case profiles.plan_tier is missing/stale
                if (events && events.length > 0) {
                    const ranks: Record<string, number> = { 'free': 0, 'clasico': 1, 'classic': 1, 'pro': 2, 'personalized': 2, 'premium': 3, 'concierge': 4 };
                    let currentMaxRank = ranks[currentTier] || 0;
                    
                    for (const ev of events) {
                        let tc = ev.theme_config;
                        if (typeof tc === 'string') { try { tc = JSON.parse(tc); } catch { tc = {}; } }
                        tc = tc || {};
                        const p = tc.plan_tier || (tc.isPremium ? 'premium' : tc.isPro ? 'pro' : 'clasico');
                        const r = ranks[p] || 0;
                        if (r > currentMaxRank) {
                            currentTier = p;
                            currentMaxRank = r;
                        }
                    }
                }

                setTier(currentTier);
                setIsPersonalized(['pro', 'premium', 'personalizado', 'concierge'].includes(currentTier));

                // Fetch total guests for these events
                const eventIds = events?.map(e => e.id) || [];
                const { data: guests, error: guestsError } = await supabase
                    .from('guests')
                    .select('event_id, status, max_plus_ones')
                    .in('event_id', eventIds);

                if (guestsError) throw guestsError;

                const totalGuests = guests?.reduce((acc, g) => acc + (g.max_plus_ones || 0) + 1, 0) || 0;
                const confirmedCount = guests?.filter(g => g.status === 'confirmed')
                    .reduce((acc, g) => acc + (g.max_plus_ones || 0) + 1, 0) || 0;

                setStats({
                    totalEvents: events?.length || 0,
                    totalGuests: totalGuests,
                    confirmedRate: totalGuests ? Math.round((confirmedCount / totalGuests) * 100) : 0,
                });

                // Calculate stats per event for recent cards
                const eventsWithStats = events?.map(e => {
                    const eventGuests = guests?.filter(g => g.event_id === e.id) || [];
                    const t = eventGuests.reduce((acc, g) => acc + (g.max_plus_ones || 0) + 1, 0);
                    const c = eventGuests.filter(g => g.status === 'confirmed').reduce((acc, g) => acc + (g.max_plus_ones || 0) + 1, 0);
                    const d = eventGuests.filter(g => g.status === 'declined').length; // Declined using count
                    const p = eventGuests.filter(g => g.status === 'pending').reduce((acc, g) => acc + (g.max_plus_ones || 0) + 1, 0);
                    
                    return {
                        ...e,
                        metrics: { total: t, confirmed: c, declined: d, pending: p }
                    };
                });

                setRecentEvents(eventsWithStats?.slice(0, 3) || []);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setLoadError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        { name: 'Total Eventos', value: stats.totalEvents, icon: Layout, color: 'text-blue-500', bg: 'bg-blue-50' },
        { name: 'Total Invitados', value: stats.totalGuests, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { name: 'Tasa de Confirmación', value: `${stats.confirmedRate}%`, icon: Zap, color: 'text-[#BD7474]', bg: 'bg-[#BD7474]/5' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B2E1D]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {loadError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-4 text-sm text-red-700 font-medium">
                    No se pudieron cargar los datos. Verifica tu conexión e intenta recargar la página.
                </div>
            )}
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10">
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl md:text-5xl font-serif text-[#1B2E1D] tracking-tight leading-tight">Bienvenido,</h1>
                        {isPersonalized && (
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[8px] md:text-[9px] uppercase font-black tracking-widest flex items-center gap-1.5 shadow-sm">
                                <Sparkles className="h-3 w-3 text-emerald-500" />
                                Personalizado
                            </span>
                        )}
                    </div>
                    <p className="text-sm md:text-xl text-stone-400 font-light italic">Aquí tienes un resumen de tus celebraciones.</p>
                </div>
                <Link 
                    id="new-event-btn"
                    to="/dashboard/new"
                    className="group relative h-14 md:h-16 px-8 bg-[#1B2E1D] text-white rounded-2xl md:rounded-[2rem] text-[10px] md:text-[11px] uppercase font-bold tracking-[0.3em] hover:bg-[#2D312E] transition-all shadow-xl shadow-[#1B2E1D]/10 flex items-center justify-center gap-3 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                    <span>Nueva Invitación</span>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                {statCards.map((stat, index) => (
                    <div 
                        key={stat.name} 
                        id={index === 0 ? 'total-events-card' : undefined} 
                        className={`bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-md transition-all group ${index === 2 ? 'col-span-2 md:col-span-1' : ''}`}
                    >
                        <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${stat.bg} w-fit mb-4 md:mb-6 group-hover:scale-110 transition-transform`}>
                            <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                        </div>
                        <p className="text-[7px] md:text-[10px] uppercase tracking-[0.2em] font-black text-stone-300 mb-1 md:mb-2">{stat.name}</p>
                        <p className="text-2xl md:text-5xl font-serif text-[#1B2E1D]">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Invitations */}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-serif text-[#1B2E1D]">Invitaciones Recientes</h2>
                    <Link to="/dashboard/events" className="text-xs uppercase font-bold tracking-widest text-stone-400 hover:text-[#1B2E1D] transition-colors flex items-center gap-2">
                        Ver todas <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>

                <div id="recent-events-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recentEvents.length === 0 ? (
                        /* Empty State - Onboarding for new users */
                        <div className="col-span-full">
                            <div className="bg-gradient-to-br from-[#1B2E1D] to-[#2D4A30] rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden">
                                {/* Decorative background */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#BD7474]/10 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                                <div className="relative z-10 max-w-2xl mx-auto text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[9px] uppercase font-bold tracking-widest mb-8 border border-white/10">
                                        <Sparkles className="h-3 w-3 text-[#BD7474]" />
                                        <span>Bienvenido a Invitto</span>
                                    </div>

                                    <h3 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">
                                        <PartyPopper className="inline h-8 w-8 text-[#BD7474] mr-3" />
                                        Crea tu primera invitación
                                    </h3>
                                    <p className="text-stone-400 font-light text-lg mb-12 max-w-lg mx-auto">
                                        En 3 pasos tendrás tu evento listo para compartir y empezar a recibir confirmaciones.
                                    </p>

                                    {/* Steps checklist */}
                                    <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
                                        {[
                                            { step: '01', title: 'Crea tu evento', desc: 'Nombre, fecha, lugar y código de vestimenta.' },
                                            { step: '02', title: 'Agrega invitados', desc: 'Importa tu lista o agrégalos uno por uno.' },
                                            { step: '03', title: 'Comparte el link', desc: 'Recibe confirmaciones automáticas en tiempo real.' },
                                        ].map((item) => (
                                            <div key={item.step} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all">
                                                <span className="text-[#BD7474] font-serif text-3xl italic block mb-3">{item.step}</span>
                                                <p className="font-bold uppercase tracking-widest text-xs mb-2">{item.title}</p>
                                                <p className="text-stone-400 text-sm font-light">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        to="/dashboard/new"
                                        className="inline-flex items-center gap-3 px-10 py-5 bg-[#BD7474] text-white rounded-2xl text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-[#A05C5C] transition-all shadow-xl shadow-[#BD7474]/20 hover:scale-105"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Crear mi Primera Invitación
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                    {recentEvents.map((event) => (
                        <div key={event.id} className="group bg-white rounded-[2rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all">
                            <div className="aspect-video bg-stone-100 relative overflow-hidden">
                                <img
                                    src={event.theme_config?.hero_image_url || event.theme_config?.heroImage || (event.theme_config?.theme === 'cecilia-70' ? '/images/cecilia_roses_hero.png' : 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=75')}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt={event.title}
                                    loading="lazy"
                                    width="800"
                                    height="450"
                                />
                                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                                    <div className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] uppercase font-bold tracking-tighter text-[#1B2E1D] shadow-sm">
                                        {{
                                            wedding: 'Boda',
                                            xv: 'XV Años',
                                            birthday: 'Cumpleaños',
                                            bautizo: 'Bautizo',
                                            graduacion: 'Graduación',
                                            comunion: 'Comunión',
                                            corporate: 'Corporativo',
                                            other: 'Otro'
                                        }[event.event_type as string] || event.event_type}
                                    </div>
                                    {isPersonalized && (
                                        <div className="px-3 py-1 bg-[#1B2E1D] text-white rounded-full text-[8px] uppercase font-black tracking-widest shadow-xl flex items-center gap-1.5 animate-pulse">
                                            <Sparkles className="h-2.5 w-2.5 text-[#BD7474]" />
                                            {tier === 'premium' ? 'Premium' : 'Pro'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-serif text-[#1B2E1D] mb-4 truncate" title={event.title}>{event.title}</h3>
                                
                                {/* Metrics Grid 2x2 */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100/50">
                                        <p className="text-[7px] uppercase font-black tracking-widest text-stone-400 mb-1">Confirmados</p>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-lg font-serif text-[#1B2E1D] leading-none">{event.metrics?.confirmed || 0}</span>
                                        </div>
                                    </div>
                                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100/50">
                                        <p className="text-[7px] uppercase font-black tracking-widest text-stone-400 mb-1">Pendientes</p>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                            <span className="text-lg font-serif text-[#1B2E1D] leading-none">{event.metrics?.pending || 0}</span>
                                        </div>
                                    </div>
                                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100/50">
                                        <p className="text-[7px] uppercase font-black tracking-widest text-stone-400 mb-1">Declinados</p>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                                            <span className="text-lg font-serif text-[#1B2E1D] leading-none">{event.metrics?.declined || 0}</span>
                                        </div>
                                    </div>
                                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100/50">
                                        <p className="text-[7px] uppercase font-black tracking-widest text-stone-400 mb-1">PAX Total</p>
                                        <div className="flex items-center gap-2 text-stone-300">
                                            <Users className="h-3 w-3" />
                                            <span className="text-lg font-serif text-stone-400 leading-none">{event.metrics?.total || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Mini Bar */}
                                {(() => {
                                    const perc = event.metrics?.total > 0 ? Math.round((event.metrics.confirmed / event.metrics.total) * 100) : 0;
                                    const deadlineDate = event.rsvp_deadline ? new Date(event.rsvp_deadline) : null;
                                    const isDeadlinePassed = deadlineDate ? deadlineDate < new Date() : false;
                                    const daysLeft = deadlineDate ? Math.max(0, Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : null;

                                    return (
                                        <div className="space-y-4 mb-6">
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between items-end px-1">
                                                    <span className="text-[8px] uppercase font-bold tracking-widest text-stone-400">Progreso</span>
                                                    <span className="text-[10px] font-serif text-emerald-600">{perc}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${perc}%` }} />
                                                </div>
                                            </div>

                                            {/* Deadline Badge */}
                                            {deadlineDate && (
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 text-[8px] uppercase font-black tracking-widest rounded-lg border ${isDeadlinePassed ? 'bg-rose-50 border-rose-100 text-rose-600' : daysLeft !== null && daysLeft <= 7 ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-stone-50 border-stone-100 text-stone-400'}`}>
                                                    <Clock className="h-3 w-3" />
                                                    {isDeadlinePassed ? 'Plazo Vencido' : `Cierra en ${daysLeft} días`}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}

                                <div className="flex gap-2">
                                    <Link 
                                        to={`/dashboard/event/${event.id}`}
                                        className="flex-1 text-center py-4 bg-white border border-stone-200 rounded-2xl text-[10px] uppercase font-bold tracking-widest text-stone-600 hover:border-[#1B2E1D] hover:text-[#1B2E1D] transition-all"
                                    >
                                        Panel del Evento
                                    </Link>
                                    {isPersonalized && (
                                        <Link 
                                            to={`/dashboard/checkin/${event.id}`}
                                            className="px-6 py-4 bg-[#1B2E1D] text-white rounded-2xl flex items-center justify-center hover:bg-[#2D312E] transition-all"
                                            title="Check-in"
                                        >
                                            <QrCode className="h-4 w-4 text-[#BD7474]" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Placeholder for "Create New" */}
                    <Link 
                        to="/dashboard/new"
                        className="aspect-[4/5] md:aspect-auto flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-[2rem] hover:border-[#BD7474] hover:bg-[#FDFBF7] transition-all group"
                    >
                        <div className="p-4 rounded-full bg-stone-50 group-hover:bg-[#BD7474]/10 transition-colors mb-4">
                            <Plus className="h-8 w-8 text-stone-300 group-hover:text-[#BD7474]" />
                        </div>
                        <span className="text-xs uppercase font-bold tracking-widest text-stone-400 group-hover:text-[#1B2E1D]">Agregar Evento</span>
                    </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
