import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Layout, Users, Zap, ArrowUpRight, Plus, Sparkles, PartyPopper, ArrowRight, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPlatformContext } from '../../utils/context';

const DashboardHome: React.FC = () => {
    const { isCorporate } = getPlatformContext();

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

                const eventsWithStats = events?.map(e => {
                    const eventGuests = guests?.filter(g => g.event_id === e.id) || [];
                    const t = eventGuests.reduce((acc, g) => acc + (g.max_plus_ones || 0) + 1, 0);
                    const c = eventGuests.filter(g => g.status === 'confirmed').reduce((acc, g) => acc + (g.max_plus_ones || 0) + 1, 0);
                    const d = eventGuests.filter(g => g.status === 'declined').length;
                    const p = eventGuests.filter(g => g.status === 'pending').reduce((acc, g) => acc + (g.max_plus_ones || 0) + 1, 0);
                    
                    return {
                        ...e,
                        metrics: { total: t, confirmed: c, declined: d, pending: p }
                    };
                });

                setRecentEvents(eventsWithStats || []);
            } catch (err) {
                console.error('Error loading dashboard data:', err);
                setLoadError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        {
            name: isCorporate ? 'TOTAL EVENTOS B2B' : 'TOTAL EVENTOS',
            value: stats.totalEvents,
            icon: Layout,
            color: 'text-[#2563EB]',
            bg: 'bg-blue-50',
        },
        {
            name: isCorporate ? 'ASISTENTES ACREDITADOS' : 'TOTAL INVITADOS',
            value: stats.totalGuests,
            icon: Users,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
        {
            name: 'TASA DE CONFIRMACIÓN',
            value: `${stats.confirmedRate}%`,
            icon: Zap,
            color: 'text-[#DF3B94]',
            bg: 'bg-pink-50',
        },
    ];

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-12 bg-slate-200 rounded-2xl w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-32 bg-slate-200 rounded-3xl" />
                    <div className="h-32 bg-slate-200 rounded-3xl" />
                    <div className="h-32 bg-slate-200 rounded-3xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 font-sans">
            {loadError && (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl px-6 py-4 text-sm text-rose-700 font-medium">
                    No se pudieron cargar los datos. Verifica tu conexión e intenta recargar la página.
                </div>
            )}
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-[#222B38] tracking-tight">
                            Bienvenido
                        </h1>
                        {isPersonalized && (
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 shadow-sm">
                                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                                Plan {tier.toUpperCase()}
                            </span>
                        )}
                    </div>
                    <p className="text-sm md:text-base text-slate-500 font-normal">
                        {isCorporate 
                            ? 'Aquí tienes un resumen de tus eventos corporativos y asistentes acreditados.' 
                            : 'Aquí tienes un resumen de tus invitaciones y confirmaciones en tiempo real.'}
                    </p>
                </div>

                <Link 
                    id="new-event-btn"
                    to="/dashboard/new"
                    className={`px-6 py-3.5 ${
                        isCorporate ? 'bg-[#2563EB] hover:bg-[#1D4ED8] shadow-[#2563EB]/25' : 'bg-[#DF3B94] hover:bg-[#C52A7C] shadow-[#DF3B94]/25'
                    } text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2.5 active:scale-95`}
                >
                    <Plus className="h-4 w-4" />
                    <span>{isCorporate ? 'Crear Evento B2B' : 'Nueva Invitación'}</span>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <div 
                        key={stat.name} 
                        id={index === 0 ? 'total-events-card' : undefined} 
                        className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className={`p-3.5 rounded-2xl ${stat.bg} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">{stat.name}</p>
                        <p className="text-3xl md:text-4xl font-display font-extrabold text-[#222B38]">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Events Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-display font-extrabold text-[#222B38]">
                        {isCorporate ? 'Eventos Recientes' : 'Invitaciones Recientes'}
                    </h2>
                    <Link to="/dashboard/events" className="text-xs uppercase font-bold tracking-wider text-[#DF3B94] hover:underline flex items-center gap-1.5">
                        Ver todas <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>

                <div id="recent-events-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentEvents.length === 0 ? (
                        /* Empty State Card */
                        <div className="col-span-full">
                            <div className={`bg-gradient-to-br ${
                                isCorporate ? 'from-[#0F172A] via-[#1E293B] to-[#1E3A8A]' : 'from-[#222B38] via-[#2D3748] to-[#222B38]'
                            } rounded-3xl p-8 md:p-14 text-white relative overflow-hidden shadow-xl`}>
                                <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-xs font-mono font-bold tracking-wider border border-white/10">
                                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                                        <span>Bienvenido a {isCorporate ? 'Invitto One' : 'Invitto'}</span>
                                    </div>

                                    <h3 className="text-3xl md:text-4xl font-display font-extrabold leading-tight">
                                        Crea tu primer {isCorporate ? 'evento corporativo' : 'evento'}
                                    </h3>
                                    <p className="text-slate-300 font-normal text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                                        En 3 sencillos pasos tendrás tu invitación digital lista para compartir y recibir confirmaciones en tiempo real.
                                    </p>

                                    {/* Checklist */}
                                    <div className="grid md:grid-cols-3 gap-4 pt-2 text-left">
                                        {[
                                            { step: '01', title: 'Configura tu evento', desc: 'Nombre, fecha, sede y detalles.' },
                                            { step: '02', title: 'Agrega invitados', desc: 'Importa tu lista o regístralos manualmente.' },
                                            { step: '03', title: 'Comparte por WhatsApp', desc: 'Recibe confirmaciones instantáneas con QR.' },
                                        ].map((item) => (
                                            <div key={item.step} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                                                <span className="text-[#38BDF8] font-mono font-bold text-2xl block mb-1">{item.step}</span>
                                                <p className="font-bold uppercase tracking-wider text-xs mb-1">{item.title}</p>
                                                <p className="text-slate-400 text-xs">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4">
                                        <Link
                                            to="/dashboard/new"
                                            className={`inline-flex items-center gap-3 px-8 py-4 ${
                                                isCorporate ? 'bg-[#2563EB] hover:bg-[#1D4ED8]' : 'bg-[#DF3B94] hover:bg-[#C52A7C]'
                                            } text-white rounded-2xl text-xs uppercase font-bold tracking-widest transition-all shadow-xl active:scale-95`}
                                        >
                                            <Plus className="h-4 w-4" />
                                            Crear Mi Primer Evento
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        recentEvents.map((event) => (
                            <div key={event.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
                                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                    <img
                                        src={event.theme_config?.hero_image_url || event.theme_config?.heroImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=75'}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        alt={event.title}
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] uppercase font-bold tracking-wider text-[#222B38] shadow-sm">
                                            {event.event_type}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="text-lg font-display font-extrabold text-[#222B38] truncate">{event.title}</h3>
                                        <p className="text-xs text-slate-400 font-normal">{event.event_date}</p>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                        <span>Confirmados: <strong className="text-[#222B38]">{event.metrics?.confirmed || 0}</strong></span>
                                        <Link to={`/dashboard/events/${event.id}`} className="text-[#DF3B94] font-bold hover:underline flex items-center gap-1">
                                            Gestionar <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
