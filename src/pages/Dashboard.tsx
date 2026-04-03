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

        // 2. Delete event
        setDeletingId(deleteModal.eventId);
        const { error } = await supabase.from('events').delete().eq('id', deleteModal.eventId);
        if (error) {
            setDeleteError('Error al eliminar: ' + error.message);
        } else {
            setEvents(prev => prev.filter(e => e.id !== deleteModal.eventId));
            closeDeleteModal();
        }
        setDeletingId(null);
        setDeleteLoading(false);
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
        <div className="animate-fade-in-up">
            <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-4xl font-serif font-light text-stone-900">
                        Hola, <span className="font-semibold italic">{user?.email?.split('@')[0]}</span>
                    </h1>
                    <p className="mt-2 text-stone-500 font-light">Gestiona tus eventos exclusivos.</p>
                </div>
                <Link to="/dashboard/new">
                    <Button className="bg-stone-900 text-white hover:bg-stone-800 shadow-lg transition-all hover:-translate-y-1">
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Nuevo Evento
                    </Button>
                </Link>
            </div>

            {events.length === 0 ? (
                <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white/50 py-20 text-center shadow-sm backdrop-blur-sm">
                    <div className="mb-4 rounded-full bg-stone-100 p-4">
                        <Calendar className="h-8 w-8 text-stone-400" />
                    </div>
                    <h3 className="text-xl font-serif font-medium text-stone-900">No tienes eventos aún</h3>
                    <p className="mt-2 text-stone-500 max-w-sm">Aquí es donde comienza la magia. Crea tu primera invitación digital hoy mismo.</p>
                    <div className="mt-8">
                        <Link to="/dashboard/new">
                            <Button variant="outline" className="border-stone-400 hover:bg-stone-50">
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Evento
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div id="events-grid" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <div key={event.id} className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl border border-stone-100">
                            {/* Card Image Placeholder */}
                            <div className="h-40 w-full bg-stone-200 relative overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-br ${event.event_type === 'wedding' ? 'from-rose-100 to-teal-50' : 'from-indigo-50 to-pink-50'}`}></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                    <Calendar className="h-20 w-20" />
                                </div>
                                <div className="absolute top-4 right-4">
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase ${event.is_published ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'}`}>
                                        {event.is_published ? 'Publicado' : 'Borrador'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 p-6">
                                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-accent">
                                    {event.event_type === 'wedding' ? 'Boda' : event.event_type === 'xv' ? 'XV Años' : 'Evento'}
                                </span>
                                <h3 className="mb-2 text-2xl font-serif font-medium text-stone-900 group-hover:text-amber-800 transition-colors">
                                    <Link to={`/dashboard/event/${event.id}`} className="focus:outline-none">
                                        <span className="absolute inset-0" aria-hidden="true" />
                                        {event.title}
                                    </Link>
                                </h3>

                                <div className="space-y-3 mt-4 text-sm text-stone-600">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4 text-accent" />
                                        {format(new Date(event.date_time), 'PPP', { locale: es })}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="mr-2 h-4 w-4 text-accent" />
                                        {format(new Date(event.date_time), 'p', { locale: es })} hrs
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="mr-2 h-4 w-4 text-accent" />
                                        <span className="truncate">{event.venue_name || 'Ubicación pendiente'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 flex border-t border-stone-100 divide-x divide-stone-100 bg-stone-50/50">
                                <Link to={`/dashboard/edit/${event.id}`} className="flex-1 p-4 hover:bg-stone-100 transition-colors focus:outline-none">
                                    <p className="text-[10px] text-center font-bold text-stone-500 uppercase tracking-widest">
                                        Editar Detalles
                                    </p>
                                </Link>
                                <Link to={`/dashboard/event/${event.id}`} className="flex-1 p-4 hover:bg-stone-100 transition-colors focus:outline-none">
                                    <p className="text-[10px] text-center font-bold text-[#BD7474] uppercase tracking-widest">
                                        Panel del Evento
                                    </p>
                                </Link>
                                <button
                                    onClick={() => openDeleteModal(event.id, event.title)}
                                    disabled={deletingId === event.id}
                                    className="px-4 py-4 hover:bg-red-50 transition-colors focus:outline-none group/del disabled:opacity-50"
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
