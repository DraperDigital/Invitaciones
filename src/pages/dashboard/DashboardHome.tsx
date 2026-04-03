import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Layout, Users, Zap, ArrowUpRight, Plus, Calendar, Clock, Sparkles, PartyPopper, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardHome: React.FC = () => {
    const [stats, setStats] = useState({
        totalEvents: 0,
        totalGuests: 0,
        confirmedRate: 0,
    });
    const [recentEvents, setRecentEvents] = useState<any[]>([]);
    const [isPersonalized, setIsPersonalized] = useState(false);
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

                // Check if any event has a pro/personalized plan
                const hasPro = events?.some((e: any) =>
                    ['pro', 'personalized', 'personalizado'].includes(e.plan?.toLowerCase() || '')
                ) || false;
                setIsPersonalized(hasPro);

                // Fetch total guests for these events
                const eventIds = events?.map(e => e.id) || [];
                const { data: guests, error: guestsError } = await supabase
                    .from('guests')
                    .select('id, status')
                    .in('event_id', eventIds);

                if (guestsError) throw guestsError;

                const confirmedCount = guests?.filter(g => g.status === 'confirmed').length || 0;

                setStats({
                    totalEvents: events?.length || 0,
                    totalGuests: guests?.length || 0,
                    confirmedRate: guests?.length ? Math.round((confirmedCount / guests.length) * 100) : 0,
                });
                setRecentEvents(events?.slice(0, 3) || []);
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-serif text-[#1B2E1D] tracking-tight">Bienvenido al Panel</h1>
                        {isPersonalized && (
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[9px] uppercase font-black tracking-widest flex items-center gap-1.5 shadow-sm">
                                <Sparkles className="h-3 w-3 text-emerald-500" />
                                Personalizado
                            </span>
                        )}
                    </div>
                    <p className="text-stone-500 font-light italic">Aquí tienes un resumen de tus celebraciones activas.</p>
                </div>
                <Link 
                    id="new-event-btn"
                    to="/dashboard/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B2E1D] text-white rounded-xl text-xs uppercase font-bold tracking-widest hover:bg-[#2D312E] transition-all shadow-lg shadow-[#1B2E1D]/10"
                >
                    <Plus className="h-4 w-4" />
                    Nueva Invitación
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {statCards.map((stat, index) => (
                    <div key={stat.name} id={index === 0 ? 'total-events-card' : undefined} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`p-4 rounded-2xl ${stat.bg} w-fit mb-6`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">{stat.name}</p>
                        <p className="text-4xl font-serif text-[#1B2E1D]">{stat.value}</p>
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
                                    src={event.theme_config?.theme === 'cecilia-70' ? '/images/cecilia_roses_hero.png' : 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=75'}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt={event.title}
                                    loading="lazy"
                                    width="800"
                                    height="450"
                                />
                                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                                    <div className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] uppercase font-bold tracking-tighter text-[#1B2E1D] shadow-sm">
                                        {event.event_type === 'birthday' ? 'Cumpleaños' : 'Boda'}
                                    </div>
                                    <div className="px-3 py-1 bg-[#1B2E1D] text-white rounded-full text-[8px] uppercase font-black tracking-widest shadow-xl flex items-center gap-1.5 animate-pulse">
                                        <Sparkles className="h-2.5 w-2.5 text-[#BD7474]" />
                                        Personalizado
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-serif text-[#1B2E1D] mb-4">{event.title}</h3>
                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-stone-400 text-sm">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(event.date_time).toLocaleDateString('es-MX', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-stone-400 text-sm">
                                        <Clock className="h-4 w-4" />
                                        <span>{new Date(event.date_time).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} hrs</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-stone-400 text-sm">
                                        <Users className="h-4 w-4" />
                                        <span>Confirmaciones abiertas</span>
                                    </div>
                                </div>
                                <Link 
                                    to={`/dashboard/event/${event.slug}`}
                                    className="block w-full text-center py-4 bg-stone-50 border border-stone-100 rounded-xl text-[10px] uppercase font-bold tracking-widest text-stone-600 hover:bg-[#1B2E1D] hover:text-white transition-all shadow-sm"
                                >
                                    PANEL DE EVENTO
                                </Link>
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
