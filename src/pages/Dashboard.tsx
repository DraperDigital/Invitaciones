import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, Loader2, Clock, Trash2, X, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Event } from '../types/database.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MOCK_EVENTS } from '../lib/mockData';
import { getPlatformContext } from '../utils/context';

export default function Dashboard() {
    const { user } = useAuth();
    const { isCorporate } = getPlatformContext();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    // Delete Modal State
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

        const { error: authError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: deletePassword,
        });

        if (authError) {
            setDeleteError('Contraseña incorrecta. Inténtalo de nuevo.');
            setDeleteLoading(false);
            return;
        }

        try {
            await supabase.from('rsvps').delete().eq('event_id', deleteModal.eventId);
            await supabase.from('guests').delete().eq('event_id', deleteModal.eventId);
            await supabase.from('event_tables').delete().eq('event_id', deleteModal.eventId);

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
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="space-y-10 font-sans text-[#222B38]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-display font-extrabold text-[#222B38]">
                        {isCorporate ? 'Eventos Corporativos' : 'Mis Invitaciones'}
                    </h1>
                    <p className="text-sm text-slate-500 font-normal">
                        {isCorporate ? 'Administra tus cumbres y eventos B2B.' : 'Administra y edita todos tus eventos desde un solo lugar.'}
                    </p>
                </div>
                <Link to="/dashboard/new">
                    <button className={`px-6 py-3.5 ${
                        isCorporate ? 'bg-[#2563EB] hover:bg-[#1D4ED8]' : 'bg-[#DF3B94] hover:bg-[#C52A7C]'
                    } text-white rounded-2xl text-xs uppercase font-bold tracking-wider transition-all shadow-lg active:scale-95 flex items-center gap-2`}>
                        <Plus className="h-4 w-4" />
                        <span>{isCorporate ? 'Crear Evento B2B' : 'Crear Nuevo Evento'}</span>
                    </button>
                </Link>
            </div>

            {events.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-10 md:p-16 text-center shadow-sm space-y-6">
                    <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                        <Calendar className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-display font-extrabold text-[#222B38]">No tienes eventos aún</h3>
                    <p className="text-slate-500 font-normal text-sm max-w-sm mx-auto">
                        Comienza creando tu primer evento digital para gestionar invitaciones y asistencias.
                    </p>
                    <div>
                        <Link to="/dashboard/new">
                            <button className="px-6 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs uppercase font-bold tracking-wider transition-all">
                                <Plus className="inline h-4 w-4 mr-2" /> Crear Evento
                            </button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div id="events-grid" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <div key={event.id} className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 justify-between">
                            <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                                {(event.theme_config as any)?.hero_image_url ? (
                                    <img 
                                        src={(event.theme_config as any).hero_image_url} 
                                        alt={event.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                        <Calendar className="h-12 w-12 text-slate-300" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex items-center gap-2">
                                    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md border ${
                                        event.is_published ? 'bg-emerald-50/90 text-emerald-700 border-emerald-200' : 'bg-slate-100/90 text-slate-600 border-slate-200'
                                    }`}>
                                        {event.is_published ? 'Publicado' : 'Borrador'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 p-6 space-y-4">
                                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                                    isCorporate ? 'text-[#2563EB]' : 'text-[#DF3B94]'
                                }`}>
                                    {event.event_type}
                                </span>
                                <h3 className="text-xl font-display font-extrabold text-[#222B38] leading-tight">
                                    <Link to={`/dashboard/events/${event.id}`} className="hover:underline">
                                        {event.title}
                                    </Link>
                                </h3>

                                <div className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                                        <span>{format(new Date(event.date_time), 'PPP', { locale: es })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                                        <span>{format(new Date(event.date_time), 'p', { locale: es })} hrs</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                                        <span className="truncate">{event.venue_name || 'Ubicación pendiente'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                                <Link 
                                    to={`/dashboard/events/${event.id}`} 
                                    className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-center text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-all"
                                >
                                    Gestionar
                                </Link>
                                <button
                                    onClick={() => openDeleteModal(event.id, event.title)}
                                    className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                    title="Eliminar evento"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5" />
                                </div>
                                <h3 className="text-xl font-display font-extrabold text-[#222B38]">Confirmar Eliminación</h3>
                            </div>
                            <button onClick={closeDeleteModal} className="p-1 text-slate-400 hover:text-slate-900">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                            Esta acción eliminará permanentemente el evento <strong>"{deleteModal.eventTitle}"</strong> y toda su lista de invitados y datos de asistencia.
                        </p>

                        <div className="space-y-2">
                            <label className="block text-xs uppercase font-bold tracking-wider text-slate-500">
                                Ingresa tu contraseña de cuenta para confirmar:
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-rose-500"
                            />
                        </div>

                        {deleteError && (
                            <p className="text-xs text-rose-600 font-bold">{deleteError}</p>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={closeDeleteModal}
                                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading || !deletePassword}
                                className="flex-1 py-3 bg-rose-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                            >
                                {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
