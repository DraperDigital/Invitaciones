import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
    Check, X, Clock, MessageSquare, Download, 
    Trash2, Edit2, Save, QrCode, Send as SendIcon, Users,
    Search, LayoutDashboard, MapPin, Eye, Copy, ArrowLeft, AlertTriangle, ChevronDown
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis } from 'recharts';
import { differenceInDays, isPast } from 'date-fns';

const EventRSVPs: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const eventIdFromUrl = searchParams.get('event');
    const [eventId, setEventId] = useState<string | null>(eventIdFromUrl);
    const [guests, setGuests] = useState<any[]>([]);
    const [event, setEvent] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [isManageMode] = useState(true);
    const [activeTab, setActiveTab] = useState<'list' | 'messages' | 'tables' | 'reminders' | 'statistics'>('list');
    const [userEvents, setUserEvents] = useState<any[]>([]);
    const [reminderTemplate] = useState('¡Hola {nombre}! 🌟 Te escribimos para recordarte la invitación a "{evento}". \n\nPuedes ver todos los detalles y confirmar aquí: {link} \n\n¡Te esperamos!');
    const [tables, setTables] = useState<any[]>([]);
    
    // Inline Edit State
    const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
    const [editData, setEditData] = useState({ name: '', group_name: '', status: '', plus_ones_confirmed: 0, table_id: '' });
    const [selectedGuestForQR, setSelectedGuestForQR] = useState<any | null>(null);

    // Filters & Views
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'yes' | 'no'>('all');
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

    const { user } = useAuth();
    const toast = useToast();

    // New Table State
    const [isAddingTable, setIsAddingTable] = useState(false);
    const [newTable, setNewTable] = useState({ name: '', capacity: 10 });

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const { data: eventsData } = await supabase
                    .from('events')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                setUserEvents(eventsData || []);

                let activeId = eventIdFromUrl;
                if (!activeId) {
                    activeId = localStorage.getItem(`last_managed_event_id_${user.id}`);
                    if (!activeId && eventsData?.length) {
                        activeId = eventsData[0].id;
                    }
                }

                const activeEvent = eventsData?.find(e => e.id === activeId);

                if (activeId && activeEvent) {
                    setEventId(activeId);
                    localStorage.setItem(`last_managed_event_id_${user.id}`, activeId);
                    setEvent(activeEvent);

                    const [tablesResult, guestsResult] = await Promise.all([
                        supabase
                            .from('event_tables')
                            .select('*')
                            .eq('event_id', activeId),
                        supabase
                            .from('guests')
                            .select('*, rsvps(*), event:events(title, slug)')
                            .eq('event_id', activeId)
                            .order('created_at', { ascending: false }),
                    ]);

                    if (guestsResult.error) throw guestsResult.error;
                    setTables(tablesResult.data || []);
                    setGuests(guestsResult.data || []);
                } else {
                    setEventId(null);
                    setEvent(null);
                    setTables([]);
                    setGuests([]);
                }
            } catch (err) {
                console.error('Error fetching RSVPs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventIdFromUrl, user]);

    const copyGeneralLink = async () => {
        if (!event) return;
        const slug = event.slug || event.id;
        const url = `${window.location.origin}/i/${slug}`;
        navigator.clipboard.writeText(url).then(() => {
            toast.success('¡Link copiado con éxito!');
        });
    };

    const shareOnWhatsApp = () => {
        if (!event) return;
        const slug = event.slug || event.id;
        const url = `${window.location.origin}/i/${slug}`;
        const message = `¡Hola! Te invito a mi evento: ${event.title}. \nConfirma tu asistencia aquí: ${url}`;
        const wpUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(wpUrl, '_blank');
    };

    const handleEventChange = (id: string) => {
        setSearchParams({ event: id });
        setEventId(id);
    };

    // Helper: leer estado desde guests.status (fuente confiable) y mapear a formato rsvp
    const getGuestStatus = (g: any): string => {
        // Primero intentar rsvps (si RLS los carga), si no, usar guests.status
        const rsvpStatus = g.rsvps?.[0]?.status;
        if (rsvpStatus) return rsvpStatus;
        // Mapear guests.status a formato rsvp
        if (g.status === 'confirmed') return 'yes';
        if (g.status === 'declined') return 'no';
        return 'pending';
    };

    // Helper: calcular PAX total de un invitado (1 + acompañantes)
    const getGuestPax = (g: any): number => {
        return (g.rsvps?.[0]?.plus_ones_confirmed || g.max_plus_ones || 0) + 1;
    };

    // Helper: calcular PAX ocupados en una mesa
    const getTableOccupiedPax = (tableId: string): number => {
        return guests.filter(g => g.table_id === tableId).reduce((sum, g) => sum + getGuestPax(g), 0);
    };

    // Helper: calcular PAX disponibles en una mesa
    const getTableAvailablePax = (tableId: string): number => {
        const table = tables.find(t => t.id === tableId);
        return table ? table.capacity - getTableOccupiedPax(tableId) : 0;
    };

    // Metrics - usando getGuestStatus
    const metrics = {
        totalInvitados: guests.reduce((acc, g) => acc + (g.max_plus_ones || 0) + 1, 0),
        confirmados: guests.filter(g => getGuestStatus(g) === 'yes').reduce((acc, g) => acc + (g.rsvps?.[0]?.plus_ones_confirmed || g.max_plus_ones || 0) + 1, 0),
        ingresados: guests.filter(g => g.checked_in_at).reduce((acc, g) => acc + (g.rsvps?.[0]?.plus_ones_confirmed || 0) + 1, 0),
        pendientes: guests.filter(g => getGuestStatus(g) === 'pending').reduce((acc, g) => acc + (g.max_plus_ones || 0) + 1, 0),
        noAsistiran: guests.filter(g => getGuestStatus(g) === 'no').length,
    };

    const statusData = [
        { name: 'Confirmados', value: metrics.confirmados, color: '#1B2E1D' },
        { name: 'Pendientes', value: metrics.pendientes, color: '#D9B880' },
        { name: 'Declinados', value: metrics.noAsistiran, color: '#BD7474' },
    ].filter(d => d.value > 0);

    const attendanceData = [
        { name: 'Esperados', total: metrics.confirmados, fill: '#D9B880' },
        { name: 'Ya Ingresaron', total: metrics.ingresados, fill: '#1B2E1D' },
    ];

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'yes': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'no': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-stone-50 text-stone-400 border-stone-100';
        }
    };

    const filteredGuests = guests.filter(g => {
        const status = getGuestStatus(g);
        const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (g.group_name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (guestId: string) => {
        try {
            const { error } = await supabase.from('guests').delete().eq('id', guestId);
            if (error) throw error;
            setGuests(prev => prev.filter(g => g.id !== guestId));
            toast.success('Invitado eliminado.');
        } catch (err: any) {
            toast.error('Error al eliminar');
        }
    };

    const handleSendReminder = async (guest: any) => {
        const eventTitle = guest.event?.title || event?.title;
        const invitationLink = `${window.location.origin}/i/${guest.event?.slug || event?.slug}?t=${guest.id}`;
        const message = reminderTemplate
            .replace(/{nombre}/g, guest.name)
            .replace(/{evento}/g, eventTitle)
            .replace(/{link}/g, invitationLink);
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        
        try {
            const now = new Date().toISOString();
            const updateData: any = { last_reminder_at: now };
            if (!guest.invitation_sent_at) {
                updateData.invitation_sent_at = now;
            }
            
            await supabase.from('guests').update(updateData).eq('id', guest.id);
            setGuests(guests.map(g => g.id === guest.id ? { ...g, ...updateData } : g));
            
            if (!guest.invitation_sent_at) {
                toast.success('¡Invitación lanzada y registrada!');
            }
        } catch (e) {}
    };

    const copyIndividualLink = (guest: any) => {
        const url = `${window.location.origin}/i/${guest.event?.slug || event?.slug}?t=${guest.id}`;
        navigator.clipboard.writeText(url).then(() => {
            toast.success('¡Link individual copiado!');
        });
    };

    const handleToggleSent = async (guest: any) => {
        const isSent = !!guest.invitation_sent_at;
        const newValue = isSent ? null : new Date().toISOString();
        
        try {
            const { error } = await supabase
                .from('guests')
                .update({ invitation_sent_at: newValue })
                .eq('id', guest.id);
                
            if (error) throw error;
            
            setGuests(guests.map(g => g.id === guest.id ? { ...g, invitation_sent_at: newValue } : g));
            toast.success(isSent ? 'Invitación marcada como pendiente' : 'Invitación marcada como enviada');
        } catch (error: any) {
            console.error('Error toggling sent status:', error);
            toast.error('Error al actualizar el estado de envío');
        }
    };

    const handleQuickStatusToggle = async (guest: any, forceStatus?: string) => {
        const current = getGuestStatus(guest);
        let newStatus = forceStatus || 'yes';
        if (!forceStatus) {
            if (current === 'yes') newStatus = 'no';
            if (current === 'no') newStatus = 'pending';
        }
        console.log('[RSVP] Cambiando via RPC:', guest.name, current, '→', newStatus);
        const previousGuests = [...guests];
        // Optimistic UI — si cambia a no-confirmado, quitar mesa
        const clearedTableId = newStatus !== 'yes' ? null : guest.table_id;
        setGuests(prev => prev.map(g => g.id === guest.id ? { ...g, status: newStatus === 'yes' ? 'confirmed' : newStatus === 'no' ? 'declined' : 'pending', table_id: clearedTableId, rsvps: [{ ...(g.rsvps?.[0] || {}), status: newStatus }] } : g) as any);
        try {
            const { data, error } = await supabase.rpc('set_guest_status', {
                p_guest_id: guest.id,
                p_event_id: guest.event_id,
                p_status: newStatus
            });
            if (error) { console.error('[RSVP RPC] Error:', error); throw error; }
            console.log('[RSVP RPC] ✅ Resultado:', data);
            toast.success('Estado actualizado');
        } catch (e: any) {
            console.error('[RSVP RPC] ❌ FALLO:', e);
            setGuests(previousGuests);
            toast.error('Error: ' + (e?.message || 'no se pudo guardar'));
        }
    };

    const handleSaveInline = async (guest: any) => {
        try {
            // Update guest info via RPC
            const { error: infoErr } = await supabase.rpc('update_guest_info', {
                p_guest_id: guest.id,
                p_event_id: guest.event_id,
                p_name: editData.name,
                p_group_name: editData.group_name,
                p_table_id: editData.table_id || ''
            });
            if (infoErr) { console.error('[Save] Info error:', infoErr); throw infoErr; }

            // Update status via RPC
            if (editData.status !== getGuestStatus(guest)) {
                await supabase.rpc('set_guest_status', {
                    p_guest_id: guest.id,
                    p_event_id: guest.event_id,
                    p_status: editData.status
                });
            }

            setGuests(guests.map(g => g.id === guest.id ? { 
                ...g, 
                name: editData.name, 
                group_name: editData.group_name, 
                table_id: editData.table_id || null,
                status: editData.status === 'yes' ? 'confirmed' : editData.status === 'no' ? 'declined' : 'pending',
                rsvps: [{ ...(g.rsvps?.[0] || {}), status: editData.status }] 
            } : g));
            setEditingGuestId(null);
            toast.success('Guardado correctamente');
        } catch (e: any) {
            console.error('[Save] Error:', e);
            toast.error('Error al guardar: ' + (e?.message || ''));
        }
    };

    const handleExportCSV = () => {
        const headers = ['Nombre Invitado', 'Grupo/Canal', 'Estado RSVP', 'Num. Acompañantes'];
        const rows = guests.map(guest => [
            `"${guest.name}"`, `"${guest.group_name || 'Individual'}"`, 
            `"${guest.rsvps?.[0]?.status || 'pending'}"`, `"${guest.rsvps?.[0]?.plus_ones_confirmed || 0}"`
        ].join(','));
        const link = document.createElement("a");
        link.href = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows].join('\n');
        link.download = "invitados.csv";
        link.click();
    };

    const handleAddTable = async () => {
        if (!eventId || !newTable.name) return;
        try {
            const { data } = await supabase.from('event_tables').insert([{ event_id: eventId, name: newTable.name, capacity: newTable.capacity }]).select();
            if (data) setTables([...tables, data[0]]);
            setNewTable({ name: '', capacity: 10 });
            setIsAddingTable(false);
        } catch (e) {}
    };

    const handleDeleteTable = async (tableId: string) => {
        const assignedGuests = guests.filter(g => g.table_id === tableId);
        if (assignedGuests.length > 0) {
            toast.error(`No se puede eliminar: hay ${assignedGuests.length} invitado(s) asignado(s). Reasígnalos primero.`);
            return;
        }
        if (!window.confirm("¿Eliminar mesa?")) return;
        try {
            await supabase.from('event_tables').delete().eq('id', tableId);
            setTables(tables.filter(t => t.id !== tableId));
        } catch (e) {
            toast.error('Error al eliminar mesa');
        }
    };



    if (loading) return <div className="flex h-screen items-center justify-center">Cargando...</div>;

    if (!event) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-serif mb-4">Selecciona un evento para gestionar</h2>
            <select value={eventId || ''} onChange={(e) => handleEventChange(e.target.value)} className="p-3 border border-stone-200 rounded-xl outline-none">
                <option value="">Seleccionar...</option>
                {userEvents.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
            </select>
        </div>
    );

    const percentConfirmed = metrics.totalInvitados > 0 ? Math.round((metrics.confirmados / metrics.totalInvitados) * 100) : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 bg-[#FDFBF7]">
            {/* Top Navigation & Fast Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="flex flex-col gap-2">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#BD7474]">Dashboard</p>
                    <select value={eventId || ''} onChange={(e) => handleEventChange(e.target.value)} className="text-3xl font-serif bg-transparent outline-none border-b border-transparent focus:border-stone-200 transition-all">
                        {userEvents.map(ev => <option key={ev.id} value={ev.id} className="text-base font-sans">{ev.title}</option>)}
                    </select>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-stone-100 shadow-sm w-full sm:w-auto justify-between sm:justify-start gap-2">
                        <Link to="/dashboard" className="h-10 w-10 bg-stone-50 border border-stone-100 rounded-xl flex items-center justify-center text-stone-400 hover:text-[#1B2E1D] transition-all group">
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1" />
                        </Link>
                        
                        <div className="h-10 w-px bg-stone-50 hidden sm:block mx-1" />

                        <div className="flex items-center gap-2">
                            <Link to={`/dashboard/edit/${event.id}`} className="px-4 h-10 bg-white border border-stone-200 text-stone-600 hover:text-emerald-600 hover:border-emerald-600 rounded-xl text-[8px] uppercase font-black tracking-widest shadow-sm flex items-center justify-center gap-2 transition-all">
                                <Edit2 className="h-3.5 w-3.5" /> <span className="xs:inline">Editar Info</span>
                            </Link>
                            <Link to={`/dashboard/design/${event.id}`} className="px-4 h-10 bg-white border border-stone-200 text-stone-600 hover:text-[#BD7474] hover:border-[#BD7474] rounded-xl text-[8px] uppercase font-black tracking-widest shadow-sm flex items-center justify-center gap-2 transition-all">
                                <LayoutDashboard className="h-3.5 w-3.5" /> <span className="xs:inline">Diseño</span>
                            </Link>
                            <Link to={`/i/${event.slug || event.id}?t=admin`} target="_blank" className="px-4 h-10 bg-white border border-stone-200 text-stone-600 hover:text-[#1B2E1D] hover:border-[#1B2E1D] rounded-xl text-[8px] uppercase font-black tracking-widest shadow-sm flex items-center justify-center gap-2 transition-all">
                                <Eye className="h-3.5 w-3.5" /> <span className="xs:inline">Ver</span>
                            </Link>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                            onClick={shareOnWhatsApp}
                            className="flex-1 sm:flex-none px-8 h-10 bg-[#25D366] text-white rounded-[1.5rem] text-[9px] uppercase font-black tracking-widest shadow-lg shadow-emerald-100/50 flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all"
                        >
                            <MessageSquare className="h-4 w-4" /> <span>Compartir</span>
                        </button>
                        <button onClick={handleExportCSV} className="p-3 bg-white border border-stone-100 rounded-xl shadow-sm text-stone-400 hover:text-[#1B2E1D]"><Download className="h-4 w-4" /></button>
                    </div>
                </div>
            </div>

            {/* Event Hero Profile */}
            <div className="bg-white rounded-[2rem] md:rounded-[4rem] border border-stone-100 p-8 md:p-20 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-stone-50 rounded-full -translate-y-1/2 translate-x-1/3 -z-0 group-hover:bg-[#BD7474]/5 transition-colors duration-1000" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10 md:gap-16">
                    <div className="space-y-8 md:space-y-12 flex-1">
                        <div className="flex flex-wrap items-center gap-3 md:gap-4">
                            <span className="px-4 md:px-6 py-1.5 md:py-2 bg-[#BD7474]/10 text-[#BD7474] text-[8px] md:text-[10px] uppercase font-black tracking-[0.3em] md:tracking-[0.4em] rounded-full">
                                {event.event_type}
                            </span>
                            <span className={`flex items-center gap-2 px-4 md:px-5 py-1.5 md:py-2 ${percentConfirmed > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-50 text-stone-300'} rounded-full text-[8px] md:text-[9px] uppercase font-black tracking-widest`}>
                                <div className={`h-1 w-1 md:h-1.5 md:w-1.5 rounded-full ${percentConfirmed > 0 ? 'bg-emerald-500 animate-pulse outline outline-4 outline-emerald-100' : 'bg-stone-200'}`} />
                                {percentConfirmed}% Confirmado
                            </span>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                            <h1 className="text-3xl xs:text-4xl sm:text-7xl lg:text-8xl font-serif text-[#1B2E1D] tracking-tighter leading-[0.9] md:leading-[0.8] mb-4 break-words">{event.title}</h1>
                            <p className="text-lg md:text-2xl text-stone-400 font-light italic flex items-center gap-3 md:gap-4 ml-1 md:ml-2">
                                <MapPin className="h-5 w-5 md:h-6 md:w-6 text-[#BD7474]" /> {event.venue_name || 'Ubicación Premium'}
                            </p>
                        </div>

                        {/* Event Timeline & RSVP Deadline Block */}
                        {(() => {
                            const deadlineDate = event.rsvp_deadline ? new Date(event.rsvp_deadline) : null;
                            const daysRemaining = deadlineDate ? differenceInDays(deadlineDate, new Date()) : null;
                            const isDeadlinePassed = deadlineDate ? isPast(deadlineDate) : false;

                            return (
                                <div className="grid grid-cols-2 lg:flex lg:items-center gap-8 pt-10 border-t border-stone-50">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-stone-300">Fecha del Evento</p>
                                        <p className="text-base font-bold text-[#1B2E1D]">{event.date_time ? new Date(event.date_time).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Próximamente'}</p>
                                    </div>
                                    <div className="h-10 w-px bg-stone-100 hidden lg:block" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-stone-300">Cierre Confirm.</p>
                                        <p className="text-base font-bold text-[#BD7474]">
                                            {deadlineDate ? deadlineDate.toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Sin definir'}
                                        </p>
                                    </div>
                                    
                                    {deadlineDate && (
                                        <>
                                            <div className="h-10 w-px bg-stone-100 hidden lg:block" />
                                            <div className="col-span-2 lg:col-span-1 space-y-3 lg:space-y-0">
                                                {isDeadlinePassed ? (
                                                    <span className="px-4 py-2 w-fit bg-red-50 text-red-600 rounded-lg text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                                                        <AlertTriangle className="h-3 w-3" /> Vencido
                                                    </span>
                                                ) : daysRemaining !== null && daysRemaining <= 14 ? (
                                                    <div className="flex flex-col sm:flex-row items-center gap-3">
                                                        <span className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 border border-orange-100 shadow-sm animate-pulse w-full sm:w-auto">
                                                            <Clock className="h-3 w-3 text-orange-500" /> Faltan {daysRemaining} Días
                                                        </span>
                                                    </div>
                                                ) : daysRemaining !== null && (
                                                    <span className="px-4 py-2 w-fit bg-emerald-50 text-emerald-600 rounded-lg text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                                                        <Check className="h-3 w-3" /> Faltan {daysRemaining} días
                                                    </span>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })()}
                    </div>

                    <div className="lg:w-96 space-y-8">
                        {/* Visual Progress Bar Card */}
                        <div className="p-8 bg-[#FDFBF7] rounded-[2.5rem] border border-stone-100 shadow-sm space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] md:text-[11px] uppercase font-black tracking-[0.3em] text-[#1B2E1D]">Asistencia</span>
                                <div className="text-right">
                                    <span className="text-3xl md:text-4xl font-serif text-[#1B2E1D]">{metrics.confirmados}</span>
                                    <span className="text-lg font-serif text-stone-300 ml-1">/{metrics.totalInvitados}</span>
                                </div>
                            </div>
                            <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden p-0.5">
                                <div 
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                    style={{ width: `${percentConfirmed}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-center gap-2 text-stone-400">
                                <Users className="h-3 w-3" />
                                <p className="text-[10px] uppercase font-bold tracking-widest italic">{metrics.totalInvitados === 0 ? 'Sin invitados' : 'En tiempo real'}</p>
                            </div>
                        </div>

                        <button onClick={copyGeneralLink} className="group w-full h-16 bg-[#1B2E1D] text-white rounded-[2rem] flex items-center justify-center gap-4 text-[10px] uppercase font-bold tracking-[0.4em] hover:bg-[#2C482F] transition-all shadow-xl hover:translate-y-[-4px]">
                            <Copy className="h-4 w-4 group-hover:scale-110 transition-transform" /> <span>Copiar Link</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: 'Total', value: metrics.totalInvitados, color: 'text-stone-900' },
                    { label: 'Confirm.', value: metrics.confirmados, color: 'text-emerald-500' },
                    { label: 'Check-in', value: metrics.ingresados, color: 'text-blue-500' },
                    { label: 'Pend.', value: metrics.pendientes, color: 'text-amber-500' },
                    { label: 'Decl.', value: metrics.noAsistiran, color: 'text-rose-500' },
                ].map(m => (
                    <div key={m.label} className="bg-white p-6 rounded-[1.5rem] border border-stone-100 shadow-sm">
                        <p className="text-[8px] uppercase font-bold text-stone-400 mb-2">{m.label}</p>
                        <p className={`text-2xl font-serif ${m.color}`}>{m.value}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-stone-100 gap-6 overflow-x-auto pb-1">
                {['list', 'statistics', 'messages', 'tables', 'reminders'].map(t => (
                    <button key={t} onClick={() => setActiveTab(t as any)} className={`pb-4 text-[10px] uppercase font-bold tracking-widest relative ${activeTab === t ? 'text-[#1B2E1D]' : 'text-stone-300'}`}>
                        {t === 'list' ? 'Lista' : t === 'statistics' ? 'Estadísticas' : t === 'messages' ? 'Mensajes' : t === 'tables' ? 'Mesas' : 'Avisos'}
                        {activeTab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B2E1D]" />}
                    </button>
                ))}
            </div>

            {/* Content Rendering */}
            {activeTab === 'list' && (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-300" />
                            <input type="text" placeholder="Buscar..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-stone-50 rounded-xl text-sm outline-none" />
                        </div>
                        <div className="flex gap-2">
                            {[
                                { id: 'all', label: 'Todos', color: 'bg-stone-50 text-stone-400' },
                                { id: 'yes', label: 'Conf.', color: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
                                { id: 'pending', label: 'Pend.', color: 'bg-amber-50 text-amber-600 border border-amber-100' },
                                { id: 'no', label: 'Decl.', color: 'bg-rose-50 text-rose-600 border border-rose-100' }
                            ].map(f => (
                                <button 
                                    key={f.id} 
                                    onClick={() => setStatusFilter(f.id as any)} 
                                    className={`px-4 py-2 rounded-xl text-[8px] uppercase font-bold tracking-widest transition-all ${
                                        statusFilter === f.id 
                                        ? (f.id === 'all' ? 'bg-[#1B2E1D] text-white' : f.color.replace('bg-', 'bg-').split(' ')[0] + ' ' + f.color.split(' ')[1] + ' ring-2 ring-offset-1 ring-[#1B2E1D]/10 shadow-md')
                                        : 'bg-stone-50 text-stone-400 opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                            <button onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')} className="p-3 bg-stone-50 rounded-xl text-stone-400">
                                {viewMode === 'table' ? <Users className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden">
                        {viewMode === 'table' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[#FDFBF7] border-b border-stone-100 text-[10px] uppercase font-bold text-stone-400">
                                        <tr>
                                            <th className="px-8 py-6">Invitado</th>
                                            <th className="px-8 py-6">Grupo</th>
                                            <th className="px-8 py-6 text-center">Enviado</th>
                                            <th className="px-8 py-6 text-center">Estado</th>
                                            <th className="px-8 py-6 text-center">Pax Total</th>
                                            <th className="px-8 py-6 text-center">Ingreso</th>
                                            <th className="px-8 py-6 text-center">Mesa</th>
                                            <th className="px-8 py-6 text-center">QR</th>
                                            {isManageMode && <th className="px-8 py-6 text-center">Acciones</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-50">
                                        {filteredGuests.map(g => (
                                            <tr key={g.id} className="hover:bg-stone-50/50 transition-all">
                                                <td className="px-8 py-6 font-medium text-[#1B2E1D]">
                                                    {editingGuestId === g.id ? <input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="border border-stone-200 px-3 py-1.5 rounded-lg w-full" /> : g.name}
                                                </td>
                                                <td className="px-8 py-6 text-stone-400 italic">
                                                    {editingGuestId === g.id ? <input value={editData.group_name} onChange={e => setEditData({...editData, group_name: e.target.value})} className="border border-stone-200 px-3 py-1.5 rounded-lg w-full" /> : g.group_name || 'Individual'}
                                                </td>
                                                <td className="px-8 py-6">
                                                     <div className="flex justify-center">
                                                        <button 
                                                            onClick={() => handleToggleSent(g)}
                                                            className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                                                g.invitation_sent_at 
                                                                    ? 'bg-[#1B2E1D] border-[#1B2E1D] text-white' 
                                                                    : 'bg-white border-stone-200 text-transparent hover:border-[#1B2E1D]/30'
                                                            }`}
                                                            title={g.invitation_sent_at ? "Marcar como no enviado" : "Marcar como enviado"}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </button>
                                                     </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    {editingGuestId === g.id ? (
                                                        <select 
                                                            value={editData.status} 
                                                            onChange={e => setEditData({...editData, status: e.target.value as any})}
                                                            className="border border-stone-200 px-2 py-1.5 rounded-lg text-xs"
                                                        >
                                                            <option value="pending">Pendiente</option>
                                                            <option value="yes">Confirmado</option>
                                                            <option value="no">Declinado</option>
                                                        </select>
                                                    ) : (
                                                    <div className="relative inline-flex items-center group">
                                                        <select
                                                            value={getGuestStatus(g)}
                                                            onChange={(e) => { e.stopPropagation(); handleQuickStatusToggle(g, e.target.value); }}
                                                            title="Cambiar estado"
                                                            className={`appearance-none outline-none pl-3 pr-7 py-1.5 rounded-full border text-[8px] uppercase font-bold cursor-pointer transition-transform group-hover:scale-105 shadow-sm hover:shadow-md ${getStatusStyles(getGuestStatus(g))}`}
                                                        >
                                                            <option value="pending" className="text-amber-600 bg-white">PENDIENTE</option>
                                                            <option value="yes" className="text-emerald-600 bg-white">CONFIRMADO</option>
                                                            <option value="no" className="text-rose-600 bg-white">DECLINADO</option>
                                                        </select>
                                                        <ChevronDown className={`absolute right-2 h-3 w-3 pointer-events-none transition-transform group-hover:scale-110 ${getStatusStyles(getGuestStatus(g)).split(' ')[1]}`} />
                                                    </div>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-center font-bold text-stone-700">
                                                    {getGuestPax(g)}
                                                </td>
                                                <td className="px-8 py-6 text-center text-xs text-stone-400">
                                                    {g.checked_in_at ? new Date(g.checked_in_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                                                </td>
                                                <td className="px-8 py-6 text-center text-xs text-stone-400 font-medium">
                                                    {getGuestStatus(g) !== 'yes' ? (
                                                        <span className="text-stone-300 text-[9px] italic" title="Solo invitados confirmados pueden tener mesa">🔒</span>
                                                    ) : editingGuestId === g.id ? (
                                                        <select 
                                                            value={editData.table_id || ''} 
                                                            onChange={e => {
                                                                const tid = e.target.value;
                                                                if (tid) {
                                                                    const available = getTableAvailablePax(tid) + (g.table_id === tid ? getGuestPax(g) : 0);
                                                                    if (getGuestPax(g) > available) {
                                                                        toast.error(`No caben ${getGuestPax(g)} PAX — solo ${available} disponibles`);
                                                                        return;
                                                                    }
                                                                }
                                                                setEditData({...editData, table_id: tid});
                                                            }}
                                                            className="border border-stone-200 px-2 py-1 rounded text-center text-xs bg-white cursor-pointer"
                                                        >
                                                            <option value="">Sin mesa</option>
                                                            {tables.map(t => {
                                                                const avail = getTableAvailablePax(t.id) + (g.table_id === t.id ? getGuestPax(g) : 0);
                                                                const fits = getGuestPax(g) <= avail;
                                                                return <option key={t.id} value={t.id} disabled={!fits}>{t.name} ({avail} disp.)</option>;
                                                            })}
                                                        </select>
                                                    ) : (
                                                        <select
                                                            value={g.table_id || ''}
                                                            onChange={async (e) => {
                                                                const newTableId = e.target.value;
                                                                if (newTableId) {
                                                                    const available = getTableAvailablePax(newTableId) + (g.table_id === newTableId ? getGuestPax(g) : 0);
                                                                    if (getGuestPax(g) > available) {
                                                                        toast.error(`No caben ${getGuestPax(g)} PAX — solo ${available} disponibles`);
                                                                        return;
                                                                    }
                                                                }
                                                                const prev = [...guests];
                                                                setGuests(gs => gs.map(x => x.id === g.id ? {...x, table_id: newTableId || null} : x));
                                                                try {
                                                                    const { error } = await supabase.rpc('update_guest_info', {
                                                                        p_guest_id: g.id,
                                                                        p_event_id: g.event_id,
                                                                        p_table_id: newTableId || ''
                                                                    });
                                                                    if (error) throw error;
                                                                    toast.success('Mesa asignada');
                                                                } catch (err: any) {
                                                                    setGuests(prev);
                                                                    toast.error('Error al asignar mesa');
                                                                }
                                                            }}
                                                            className="appearance-none bg-transparent text-center text-xs cursor-pointer hover:text-[#1B2E1D] outline-none border-b border-transparent hover:border-stone-300 pb-0.5 transition-all"
                                                        >
                                                            <option value="">-</option>
                                                            {tables.map(t => {
                                                                const avail = getTableAvailablePax(t.id) + (g.table_id === t.id ? getGuestPax(g) : 0);
                                                                const fits = getGuestPax(g) <= avail;
                                                                return <option key={t.id} value={t.id} disabled={!fits}>{t.name} ({avail})</option>;
                                                            })}
                                                        </select>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <button onClick={() => setSelectedGuestForQR(g)} className="p-2 text-stone-300 hover:text-[#1B2E1D]"><QrCode className="h-4 w-4" /></button>
                                                </td>
                                                {isManageMode && (
                                                    <td className="px-8 py-6 text-center">
                                                        {editingGuestId === g.id ? (
                                                            <div className="flex gap-2 justify-center">
                                                                <button onClick={() => handleSaveInline(g)} className="text-emerald-500"><Save className="h-4 w-4" /></button>
                                                                <button onClick={() => setEditingGuestId(null)} className="text-stone-300"><X className="h-4 w-4" /></button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex gap-2 justify-center">
                                                                <button onClick={() => copyIndividualLink(g)} className="p-2 text-stone-300 hover:text-[#1B2E1D]" title="Copiar Link"><Copy className="h-4 w-4" /></button>
                                                                <button onClick={() => handleSendReminder(g)} className="p-2 text-stone-300 hover:text-emerald-500" title="WhatsApp"><MessageSquare className="h-4 w-4" /></button>
                                                                <button onClick={() => { setEditingGuestId(g.id); setEditData({ name: g.name, group_name: g.group_name || '', status: getGuestStatus(g), plus_ones_confirmed: g.rsvps?.[0]?.plus_ones_confirmed || 0, table_id: g.table_id || '' }); }} className="p-2 text-stone-300 hover:text-[#1B2E1D]" title="Editar"><Edit2 className="h-4 w-4" /></button>
                                                                <button onClick={() => handleDelete(g.id)} className="p-2 text-stone-300 hover:text-rose-500" title="Eliminar"><Trash2 className="h-4 w-4" /></button>
                                                            </div>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredGuests.map(g => {
                                    const rsvp = g.rsvps?.[0];
                                    const status = getGuestStatus(g);
                                    const cardStyles = status === 'yes' 
                                        ? 'border-emerald-100 bg-emerald-50/10' 
                                        : status === 'no' 
                                            ? 'border-rose-100 bg-rose-50/10' 
                                            : 'border-stone-100 bg-white';

                                    return (
                                        <div key={g.id} className={`${cardStyles} p-6 rounded-[2rem] border shadow-sm space-y-4 hover:shadow-md transition-all`}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-serif text-lg text-[#1B2E1D]">{g.name}</h4>
                                                    <p className="text-[8px] uppercase font-bold text-stone-300">{g.group_name || 'Individual'}</p>
                                                </div>
                                                <div className="relative inline-flex items-center group">
                                                    <select
                                                        value={status}
                                                        onChange={(e) => { e.stopPropagation(); handleQuickStatusToggle(g, e.target.value); }}
                                                        title="Cambiar estado"
                                                        className={`appearance-none outline-none pl-3 pr-7 py-1 rounded-full border text-[8px] font-bold cursor-pointer transition-transform group-hover:scale-105 shadow-sm hover:shadow-md ${getStatusStyles(status)}`}
                                                    >
                                                        <option value="pending" className="text-amber-600 bg-white">PENDIENTE</option>
                                                        <option value="yes" className="text-emerald-600 bg-white">CONFIRMADO</option>
                                                        <option value="no" className="text-rose-600 bg-white">DECLINADO</option>
                                                    </select>
                                                    <ChevronDown className={`absolute right-2 h-3 w-3 pointer-events-none transition-transform group-hover:scale-110 ${getStatusStyles(status).split(' ')[1]}`} />
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-2 py-2 text-center text-stone-500 border-y border-stone-100/50">
                                                <div className="flex flex-col opacity-80">
                                                    <span className="text-[7px] uppercase font-bold tracking-widest text-[#1B2E1D]">Pax</span>
                                                    <span className="text-sm font-bold text-stone-700">{(rsvp?.plus_ones_confirmed || 0) + 1}</span>
                                                </div>
                                                <div className="flex flex-col opacity-80">
                                                    <span className="text-[7px] uppercase font-bold tracking-widest text-[#1B2E1D]">Ingreso</span>
                                                    <span className="text-xs font-serif mt-0.5">{g.checked_in_at ? new Date(g.checked_in_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}</span>
                                                </div>
                                                <div className="flex flex-col opacity-80">
                                                    <span className="text-[7px] uppercase font-bold tracking-widest text-[#1B2E1D]">Mesa</span>
                                                    <span className="text-xs font-serif mt-0.5">{g.table_id || '-'}</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-2">
                                                <div className="flex flex-col gap-2">
                                                    <button 
                                                        onClick={() => handleToggleSent(g)}
                                                        className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                                            g.invitation_sent_at 
                                                                ? 'bg-[#1B2E1D] border-[#1B2E1D] text-white' 
                                                                : 'bg-white border-stone-200 text-transparent'
                                                        }`}
                                                    >
                                                        <Check className="h-3 w-3" />
                                                    </button>
                                                    <button onClick={() => handleSendReminder(g)} className={`text-[8px] font-bold uppercase tracking-widest flex items-center gap-2 ${status === 'yes' ? 'text-emerald-600' : 'text-[#BD7474]'}`}>
                                                        <SendIcon className="h-3 w-3" /> {g.invitation_sent_at ? 'Recordar' : 'Enviar'}
                                                    </button>
                                                    {g.invitation_sent_at && (
                                                        <span className="text-[7px] text-stone-300 font-medium italic">
                                                            Enviada: {new Date(g.invitation_sent_at).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <button onClick={() => setSelectedGuestForQR(g)} className="text-stone-300 hover:text-[#1B2E1D]">
                                                    <QrCode className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'statistics' && (
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm h-80">
                        <h3 className="font-serif mb-6 text-stone-400 uppercase text-[10px] tracking-widest font-bold">Estado RSVP</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm h-80">
                        <h3 className="font-serif mb-6 text-stone-400 uppercase text-[10px] tracking-widest font-bold">Check-in</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceData}>
                                <XAxis dataKey="name" hide />
                                <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                                    {attendanceData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                                </Bar>
                                <Tooltip />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {activeTab === 'messages' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {guests.filter(g => g.rsvps?.[0]?.message).map(g => (
                        <div key={g.id} className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm space-y-4">
                            <h4 className="font-serif text-lg">{g.name}</h4>
                            <p className="text-stone-500 italic text-sm">"{g.rsvps[0].message}"</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'tables' && (
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm flex justify-between items-center">
                        <h3 className="font-serif text-xl">Distribución de Mesas</h3>
                        <button onClick={() => setIsAddingTable(!isAddingTable)} className="px-6 py-3 bg-[#BD7474] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">
                            {isAddingTable ? 'Cancelar' : 'Nueva Mesa'}
                        </button>
                    </div>
                    {isAddingTable && (
                        <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm grid md:grid-cols-3 gap-6 items-end">
                            <input value={newTable.name} onChange={e => setNewTable({...newTable, name: e.target.value})} placeholder="Nombre Mesa" className="bg-stone-50 p-4 rounded-xl outline-none" />
                            <input type="number" value={newTable.capacity} onChange={e => setNewTable({...newTable, capacity: parseInt(e.target.value)})} className="bg-stone-50 p-4 rounded-xl outline-none" />
                            <button onClick={handleAddTable} className="py-4 bg-[#1B2E1D] text-white rounded-xl font-bold text-[10px] uppercase">Guardar</button>
                        </div>
                    )}
                    <div className="grid md:grid-cols-3 gap-6">
                        {tables.map(t => {
                            const tableGuests = guests.filter(g => g.table_id === t.id);
                            const occupiedPax = tableGuests.reduce((sum, g) => sum + getGuestPax(g), 0);
                            const availablePax = t.capacity - occupiedPax;
                            const fillPercent = t.capacity > 0 ? Math.min((occupiedPax / t.capacity) * 100, 100) : 0;
                            return (
                                <div key={t.id} className={`bg-white p-6 rounded-[2rem] border shadow-sm space-y-4 ${availablePax <= 0 ? 'border-emerald-200 bg-emerald-50/30' : 'border-stone-100'}`}>
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-serif text-lg">{t.name}</h4>
                                        <button onClick={() => handleDeleteTable(t.id)} className="text-stone-300 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[8px] font-bold text-stone-400 uppercase">{occupiedPax} de {t.capacity} PAX</p>
                                            <p className={`text-[8px] font-bold uppercase ${availablePax <= 0 ? 'text-emerald-600' : availablePax <= 2 ? 'text-amber-500' : 'text-stone-300'}`}>
                                                {availablePax <= 0 ? 'COMPLETA' : `${availablePax} libres`}
                                            </p>
                                        </div>
                                        <div className="w-full bg-stone-100 rounded-full h-1.5">
                                            <div className={`h-1.5 rounded-full transition-all ${fillPercent >= 100 ? 'bg-emerald-500' : fillPercent >= 80 ? 'bg-amber-400' : 'bg-[#1B2E1D]'}`} style={{ width: `${fillPercent}%` }} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        {tableGuests.map(g => (
                                            <div key={g.id} className="flex justify-between items-center text-xs">
                                                <span className="text-stone-500">• {g.name}</span>
                                                <span className="text-stone-300 font-bold">{getGuestPax(g)} pax</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'reminders' && (
                <div className="grid md:grid-cols-3 gap-6">
                    {guests.filter(g => getGuestStatus(g) === 'pending').map(g => (
                        <div key={g.id} className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm flex justify-between items-center">
                            <div>
                                <h4 className="font-serif text-lg">{g.name}</h4>
                                <p className="text-[8px] text-stone-300 uppercase font-bold">{g.last_reminder_at ? `Avisado: ${new Date(g.last_reminder_at).toLocaleDateString()}` : 'Sin avisos'}</p>
                            </div>
                            <button onClick={() => handleSendReminder(g)} className="h-10 w-10 bg-[#25D366] text-white rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-[#25D366]/20">
                                <SendIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* QR Modal */}
            {selectedGuestForQR && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-stone-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full space-y-8 text-center relative">
                        <button onClick={() => setSelectedGuestForQR(null)} className="absolute top-6 right-6 text-stone-300"><X /></button>
                        <h3 className="text-2xl font-serif">{selectedGuestForQR.name}</h3>
                        <div className="flex justify-center p-4 bg-stone-50 rounded-2xl">
                            <QRCodeSVG value={`${window.location.origin}/i/${selectedGuestForQR.event?.slug || 'invite'}?t=${selectedGuestForQR.id}`} size={180} />
                        </div>
                        <button onClick={() => {
                            const msg = `Hola ${selectedGuestForQR.name}, aquí tu pase: ${window.location.origin}/i/${selectedGuestForQR.event?.slug}?t=${selectedGuestForQR.id}`;
                            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                        }} className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-bold text-[10px] uppercase">Compartir WA</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventRSVPs;
