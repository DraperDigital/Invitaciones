import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Plus, Calendar, MapPin, Loader2, Clock, Trash2, Lock, X, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Event } from '../types/database.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MOCK_EVENTS } from '../lib/mockData';

export default function Dashboard() {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // --- Delete Modal State ---
    const [deleteModal, setDeleteModal] = useState<{ eventId: string; eventTitle: string } | null>(null);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openDeleteModal = (eventId: string, eventTitle: string) => {
        setDeleteModal({ eventId, eventTitle });
        setDeletePassword('');
        setDeleteError('');
    };

    const closeDeleteModal = () => {
        setDeleteModal(null);
        setDeletePassword('');
        setDeleteError('');
    };

    const handleDelete = async () => {
        if (!deleteModal || !user?.email) return;
        setDeleteLoading(true);
        setDeleteError('');

        // 1. Verify password
        const { error: authError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: deletePassword,
        });

        if (authError) {
            setDeleteError('Contraseña incorrecta. Inténtalo de nuevo.');
            setDeleteLoading(false);
            return;
        }

        // 2. Delete related records first (RSVPs and Guests)
        try {
            // 1. Limpiar dependencias (RSVPs, Guests, Tables)
            await supabase.from('rsvps').delete().eq('event_id', deleteModal.eventId);
            await supabase.from('guests').delete().eq('event_id', deleteModal.eventId);
            await supabase.from('event_tables').delete().eq('event_id', deleteModal.eventId);

            // 2. Borrar el evento asegurando el user_id
            const { data, error } = await supabase
                .from('events')
                .delete()
                .eq('id', deleteModal.eventId)
                .eq('user_id', user.id)
                .select();
            
            if (error) {
                setDeleteError('Error en la base de datos: ' + error.message);
            } else if (!data || data.length === 0) {
                setDeleteError('No se pudo borrar el evento. Verifica tus permisos.');
            } else {
                setEvents(prev => prev.filter(e => e.id !== deleteModal.eventId));
                closeDeleteModal();
            }
        } catch (err: any) {
            setDeleteError('Error inesperado: ' + err.message);
        } finally {
            setDeletingId(null);
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;

        const fetchEvents = async () => {
            if (!import.meta.env.VITE_SUPABASE_URL) {
                setEvents(MOCK_EVENTS);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching events:', error);
            } else {
                setEvents(data || []);
            }
            setLoading(false);
        };

        fetchEvents();
    }, [user]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
            </div>
        );
    }

    return (
        <>
        <div className="animate-fade-in-up relative min-h-[60vh]">
            {/* Subtle Background Effects */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute top-1/2 -left-24 w-72 h-72 bg-stone-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="mb-8 md:mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif font-light text-stone-900 leading-tight">
                        Hola, <span className="font-semibold italic">{user?.email?.split('@')[0]}</span>
                    </h1>
                    <p className="mt-2 text-stone-500 font-light text-sm md:text-base">Gestiona tus eventos exclusivos.</p>
                </div>
                <Link to="/dashboard/new" className="w-full md:w-auto">
                    <Button className="w-full md:w-auto bg-[#1B2E1D] text-white hover:bg-stone-800 shadow-xl shadow-[#1B2E1D]/10 transition-all hover:-translate-y-1 py-6 md:py-3">
                        <Plus className="mr-2 h-5 w-5 md:h-4 md:w-4" />
                        Crear Nuevo Evento
                    </Button>
                </Link>
            </div>

            {events.length === 0 ? (
                <div className="mt-8 md:mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white/40 p-10 md:py-20 text-center shadow-sm backdrop-blur-sm">
                    <div className="mb-6 rounded-full bg-stone-100 p-5 md:p-4">
                        <Calendar className="h-10 w-10 md:h-8 md:w-8 text-stone-300" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-medium text-stone-900">No tienes eventos aún</h3>
                    <p className="mt-3 text-stone-500 max-w-sm font-light text-sm md:text-base">Aquí es donde comienza la magia. Crea tu primera invitación digital hoy mismo.</p>
                    <div className="mt-10">
                        <Link to="/dashboard/new">
                            <Button variant="outline" className="border-stone-200 hover:bg-white hover:border-stone-400 text-stone-600 transition-all px-8">
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Evento
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div id="events-grid" className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <div key={event.id} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100">
                            {/* Card Image */}
                            <div className="h-44 md:h-40 w-full bg-stone-50 relative overflow-hidden">
                                {(event.theme_config as any)?.hero_image_url ? (
                                    <img 
                                        src={(event.theme_config as any).hero_image_url} 
                                        alt={event.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <>
                                        <div className={`absolute inset-0 bg-gradient-to-br ${event.event_type === 'wedding' ? 'from-rose-50 to-teal-50/30' : 'from-indigo-50/50 to-pink-50/50'}`}></div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-5">
                                            <Calendar className="h-20 w-20" />
                                        </div>
                                    </>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase backdrop-blur-md border ${event.is_published ? 'bg-green-50/80 text-green-700 border-green-100' : 'bg-stone-50/80 text-stone-500 border-stone-100'}`}>
                                        {event.is_published ? 'Publicado' : 'Borrador'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 p-5 md:p-6">
                                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#BD7474]">
                                    {event.event_type === 'wedding' ? 'Boda' : event.event_type === 'xv' ? 'XV Años' : 'Evento'}
                                </span>
                                <h3 className="mb-4 text-xl md:text-2xl font-serif font-medium text-stone-900 group-hover:text-accent transition-colors leading-snug">
                                    <Link to={`/dashboard/event/${event.id}`} className="focus:outline-none">
                                        <span className="absolute inset-0" aria-hidden="true" />
                                        {event.title}
                                    </Link>
                                </h3>

                                <div className="space-y-3 mt-4 text-[13px] md:text-sm text-stone-500 font-light">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
                                            <Calendar className="h-4 w-4 text-stone-400" />
                                        </div>
                                        {format(new Date(event.date_time), 'PPP', { locale: es })}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
                                            <Clock className="h-4 w-4 text-stone-400" />
                                        </div>
                                        {format(new Date(event.date_time), 'p', { locale: es })} hrs
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
                                            <MapPin className="h-4 w-4 text-stone-400" />
                                        </div>
                                        <span className="truncate">{event.venue_name || 'Ubicación pendiente'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 flex border-t border-stone-50 divide-x divide-stone-50 bg-stone-50/30">
                                <Link to={`/dashboard/edit/${event.id}`} className="flex-1 p-4 hover:bg-white transition-colors focus:outline-none group/btn">
                                    <p className="text-[9px] text-center font-bold text-stone-400 group-hover/btn:text-stone-600 uppercase tracking-widest transition-colors">
                                        Editar
                                    </p>
                                </Link>
                                <Link to={`/dashboard/event/${event.id}`} className="flex-1 p-4 hover:bg-white transition-colors focus:outline-none group/btn">
                                    <p className="text-[9px] text-center font-bold text-[#BD7474] group-hover/btn:text-[#a66363] uppercase tracking-widest transition-colors">
                                        Gestionar
                                    </p>
                                </Link>
                                <button
                                    onClick={() => openDeleteModal(event.id, event.title)}
                                    disabled={deletingId === event.id}
                                    className="px-5 py-4 hover:bg-red-50 transition-colors focus:outline-none group/del disabled:opacity-50"
                                    title="Eliminar evento"
                                >
                                    {deletingId === event.id
                                        ? <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                                        : <Trash2 className="h-4 w-4 text-stone-300 group-hover/del:text-red-500 transition-colors" />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

            {/* ── Delete Confirmation Modal ── */}
            {deleteModal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" onClick={closeDeleteModal}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* Modal */}
                    <div
                        className="relative z-10 bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 border border-stone-100"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button onClick={closeDeleteModal} className="absolute top-5 right-5 p-2 rounded-xl text-stone-300 hover:text-stone-600 hover:bg-stone-50 transition-all">
                            <X className="h-5 w-5" />
                        </button>

                        {/* Warning icon */}
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 mb-6">
                            <AlertTriangle className="h-7 w-7 text-red-500" />
                        </div>

                        <h2 className="text-2xl font-serif text-[#1B2E1D] mb-2">Eliminar evento</h2>
                        <p className="text-stone-500 font-light text-sm mb-1">
                            Estás a punto de eliminar permanentemente:
                        </p>
                        <p className="font-bold text-[#1B2E1D] mb-6 italic">&ldquo;{deleteModal.eventTitle}&rdquo;</p>

                        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 text-xs text-red-700 font-medium">
                            ⚠️ Se eliminarán también todos los invitados y confirmaciones. Esta acción no se puede deshacer.
                        </div>

                        {/* Password field */}
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Confirma tu contraseña</label>
                        <div className="relative mb-4">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-300" />
                            <input
                                type="password"
                                placeholder="Tu contraseña"
                                value={deletePassword}
                                onChange={e => { setDeletePassword(e.target.value); setDeleteError(''); }}
                                onKeyDown={e => e.key === 'Enter' && handleDelete()}
                                className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none transition-all placeholder:text-stone-300 text-sm"
                                autoFocus
                            />
                        </div>

                        {deleteError && (
                            <p className="text-xs text-red-500 font-medium mb-4 flex items-center gap-2">
                                <X className="h-3 w-3" /> {deleteError}
                            </p>
                        )}

                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={closeDeleteModal}
                                className="flex-1 py-3.5 border border-stone-200 rounded-xl text-[10px] uppercase font-bold tracking-widest text-stone-500 hover:bg-stone-50 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading || !deletePassword}
                                className="flex-1 py-3.5 bg-red-500 text-white rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-red-600 transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                            >
                                {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
