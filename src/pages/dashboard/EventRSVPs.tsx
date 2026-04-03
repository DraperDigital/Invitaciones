import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Check, X, Clock, MessageCircle as MessageSquare, Download, User, UserPlus, Trash2, Edit2, Save, QrCode, SendIcon, Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LabelList } from 'recharts';

const EventRSVPs: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const eventIdFromUrl = searchParams.get('event');
    const [eventId, setEventId] = useState<string | null>(eventIdFromUrl);
    const [guests, setGuests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [eventName, setEventName] = useState('Lista de Invitados');
    const [isManageMode, setIsManageMode] = useState(false);
    const [activeTab, setActiveTab] = useState<'list' | 'messages' | 'tables' | 'reminders' | 'statistics'>('list');
    const [userEvents, setUserEvents] = useState<any[]>([]);
    const [reminderTemplate, setReminderTemplate] = useState('¡Hola {nombre}! 🌟 Te escribimos para recordarte la invitación a "{evento}". \n\nPuedes ver todos los detalles y confirmar aquí: {link} \n\n¡Te esperamos!');
    const [tables, setTables] = useState<any[]>([]);
    
    // Inline Edit State
    const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
    const [editData, setEditData] = useState({ name: '', group_name: '', status: '', plus_ones_confirmed: 0, table_id: '' });
    const [selectedGuestForQR, setSelectedGuestForQR] = useState<any | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { user } = useAuth();
    const toast = useToast();

    // New Table State
    const [isAddingTable, setIsAddingTable] = useState(false);
    const [newTable, setNewTable] = useState({ name: '', capacity: 10 });

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                // Query 1: todos los eventos del usuario (para el selector y validación de ownership)
                const { data: eventsData } = await supabase
                    .from('events')
                    .select('id, title, slug')
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

                // SECURITY CHECK: el evento debe pertenecer al usuario
                const activeEvent = eventsData?.find(e => e.id === activeId);

                if (activeId && activeEvent) {
                    setEventId(activeId);
                    localStorage.setItem(`last_managed_event_id_${user.id}`, activeId);

                    // El título ya está en eventsData — sin query extra
                    setEventName(activeEvent.title);

                    // Queries 2 y 3: tables y guests son independientes → paralelo
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
                    // ID no es del usuario o no existe — limpiar estado
                    setEventId(null);
                    setTables([]);
                    setGuests([]);
                    setEventName('Lista de Invitados');
                }
            } catch (err) {
                console.error('Error fetching RSVPs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventIdFromUrl]);

    const handleEventChange = (id: string) => {
        setSearchParams({ event: id });
        setEventId(id);
    };

    // Calculate Metrics
    const metrics = {
        totalInvitados: guests.reduce((acc, g) => acc + (g.max_plus_ones || 0) + 1, 0),
        confirmados: guests.filter(g => g.rsvps?.[0]?.status === 'yes').reduce((acc, g) => acc + (g.rsvps[0].plus_ones_confirmed || 0) + 1, 0),
        ingresados: guests.filter(g => g.checked_in_at).reduce((acc, g) => acc + (g.rsvps?.[0]?.plus_ones_confirmed || 0) + 1, 0),
        pendientes: guests.filter(g => !g.rsvps?.[0] || g.rsvps?.[0]?.status === 'pending').reduce((acc, g) => acc + (g.max_plus_ones || 0) + 1, 0),
        noAsistiran: guests.filter(g => g.rsvps?.[0]?.status === 'no').length,
    };

    // Data for Charts
    const statusData = [
        { name: 'Confirmados', value: metrics.confirmados, color: '#1B2E1D' }, // dark green
        { name: 'Pendientes', value: metrics.pendientes, color: '#D9B880' }, // gold
        { name: 'Declinados', value: metrics.noAsistiran, color: '#BD7474' }, // red
    ].filter(d => d.value > 0);

    const attendanceData = [
        { name: 'Esperados', total: metrics.confirmados, fill: '#D9B880' },
        { name: 'Ya Ingresaron', total: metrics.ingresados, fill: '#1B2E1D' },
    ];

    const groupMap = guests.reduce((acc, guest) => {
        const group = guest.group_name && guest.group_name.trim() !== '' ? guest.group_name : 'Individual';
        const pax = (guest.max_plus_ones || 0) + 1;
        if (!acc[group]) acc[group] = 0;
        acc[group] += pax;
        return acc;
    }, {} as Record<string, number>);

    const groupData = Object.entries(groupMap).map(([name, value]) => ({ name, value } as { name: string, value: number })).sort((a,b) => b.value - a.value);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'yes': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'no': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-stone-50 text-stone-400 border-stone-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'yes': return <Check className="h-4 w-4" />;
            case 'no': return <X className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    const handleDelete = async (guestId: string) => {
        setConfirmDeleteId(null);
        setDeletingId(guestId);
        try {
            const { data: deleted, error } = await supabase
                .from('guests')
                .delete()
                .eq('id', guestId)
                .select('id');
            if (error) throw error;
            if (!deleted || deleted.length === 0) {
                throw new Error('Sin permisos para eliminar. Verifica las políticas RLS de Supabase.');
            }
            setGuests(prev => prev.filter(g => g.id !== guestId));
            toast.success('Invitado eliminado.');
        } catch (err: any) {
            console.error(err);
            toast.error('Error al eliminar: ' + (err.message || 'Error desconocido'));
        } finally {
            setDeletingId(null);
        }
    };

    const handleSendReminder = async (guest: any) => {
        const eventTitle = guest.event?.title || eventName;
        const eventSlug = guest.event?.slug;
        if (!eventSlug) {
            toast.error('No se puede generar el link: el evento no tiene un slug válido.');
            return;
        }

        const invitationLink = `${window.location.origin}/i/${eventSlug}?t=${guest.id}`;
        const message = reminderTemplate
            .replace(/{nombre}/g, guest.name)
            .replace(/{evento}/g, eventTitle)
            .replace(/{link}/g, invitationLink);

        // Open WhatsApp
        const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');

        // Update last_reminder_at in DB
        try {
            const { error } = await supabase
                .from('guests')
                .update({ last_reminder_at: new Date().toISOString() })
                .eq('id', guest.id);
            
            if (!error) {
                setGuests(guests.map(g => g.id === guest.id ? { ...g, last_reminder_at: new Date().toISOString() } : g));
            }
        } catch (e) {
            console.error("Error updating last_reminder_at:", e);
        }
    };

    const handleSaveInline = async (guest: any) => {
        try {
            const { error: guestError } = await supabase.from('guests').update({
                name: editData.name,
                group_name: editData.group_name,
                table_id: editData.table_id || null
            }).eq('id', guest.id);
            if (guestError) throw guestError;

            const rsvp = guest.rsvps?.[0];
            const plusOnesCount = parseInt(editData.plus_ones_confirmed.toString()) || 0;
            if (rsvp) {
                const { error: rsvpError } = await supabase.from('rsvps').update({
                    status: editData.status,
                    plus_ones_confirmed: plusOnesCount
                }).eq('id', rsvp.id);
                if (rsvpError) throw rsvpError;
            } else {
                const { error: insertError } = await supabase.from('rsvps').insert([{
                    guest_id: guest.id,
                    event_id: guest.event_id,
                    status: editData.status,
                    plus_ones_confirmed: plusOnesCount,
                    message: "Actualización manual desde tabla"
                }]);
                if (insertError) throw insertError;
            }

            setGuests(guests.map(g => {
                if (g.id === guest.id) {
                    return {
                        ...g,
                        name: editData.name,
                        group_name: editData.group_name,
                        table_id: editData.table_id || null,
                        rsvps: [{
                            ...(rsvp || {}),
                            id: rsvp?.id || 'temp',
                            status: editData.status,
                            plus_ones_confirmed: plusOnesCount
                        }]
                    };
                }
                return g;
            }));
            setEditingGuestId(null);
        } catch (e) {
            console.error(e);
            toast.error('Error al guardar cambios.');
        }
    };

    const handleExportCSV = () => {
        const headers = ['Nombre Invitado', 'Grupo/Canal', 'Estado RSVP', 'Num. Acompañantes', 'Mensaje Adjunto', 'Fecha de Registro'];
        const rows = guests.map(guest => {
            const rsvp = guest.rsvps?.[0];
            const statusLabel = rsvp?.status === 'yes' ? 'Confirmado' : rsvp?.status === 'no' ? 'Declinado' : 'Pendiente';
            const escapeCSV = (str: string | null | undefined) => !str ? '""' : `"${String(str).replace(/"/g, '""')}"`;

            return [
                escapeCSV(guest.name),
                escapeCSV(guest.group_name || 'Individual'),
                escapeCSV(statusLabel),
                escapeCSV(rsvp?.plus_ones_confirmed || '0'),
                escapeCSV(rsvp?.message || ''),
                escapeCSV(rsvp?.created_at ? new Date(rsvp.created_at).toLocaleString() : '')
            ].join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `rsvps_${eventName.replace(/\s+/g, '_').toLowerCase()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleAddTable = async () => {
        if (!newTable.name) {
            toast.warning('El nombre de la mesa es requerido.');
            return;
        }
        if (!eventId) {
            toast.warning('No hay un evento seleccionado para guardar la mesa.');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('event_tables')
                .insert([{
                    event_id: eventId,
                    name: newTable.name,
                    capacity: newTable.capacity
                }])
                .select();
            
            if (error) throw error;
            if (data) setTables([...tables, data[0]]);
            setNewTable({ name: '', capacity: 10 });
            setIsAddingTable(false);
        } catch (e) {
            console.error(e);
            toast.error('Error al añadir mesa.');
        }
    };

    const handleDeleteTable = async (tableId: string) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta mesa? Los invitados asignados quedarán sin mesa.")) return;
        try {
            const { error } = await supabase.from('event_tables').delete().eq('id', tableId);
            if (error) throw error;
            setTables(tables.filter(t => t.id !== tableId));
            setGuests(guests.map(g => g.table_id === tableId ? { ...g, table_id: null } : g));
        } catch (e) {
            console.error(e);
            toast.error('Error al eliminar mesa.');
        }
    };

    const handleExportByTables = () => {
        const headers = ['Mesa', 'Nombre Invitado', 'Grupo/Canal', 'Acompañantes Confirmados'];
        
        const sortedGuests = [...guests].sort((a, b) => {
            const tableA = tables.find(t => t.id === a.table_id)?.name || 'Sin asignar';
            const tableB = tables.find(t => t.id === b.table_id)?.name || 'Sin asignar';
            return tableA.localeCompare(tableB);
        });

        const rows = sortedGuests.map(guest => {
            const tableName = tables.find(t => t.id === guest.table_id)?.name || 'Sin asignar';
            const rsvp = guest.rsvps?.[0];
            const escapeCSV = (str: string | null | undefined) => !str ? '""' : `"${String(str).replace(/"/g, '""')}"`;

            return [
                escapeCSV(tableName),
                escapeCSV(guest.name),
                escapeCSV(guest.group_name || 'Individual'),
                escapeCSV(rsvp?.plus_ones_confirmed || '0')
            ].join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `mesas_${eventName.replace(/\s+/g, '_').toLowerCase()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-10 w-10 border-4 border-stone-200 border-t-[#1B2E1D] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 md:py-12 space-y-8 md:space-y-16">
            {/* Header & Event Selector */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
                <div className="space-y-4 md:space-y-6 flex-1">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[#BD7474] mb-2 drop-shadow-sm">
                            Selecciona tu evento
                        </p>
                        <div className="relative group max-w-xl">
                            <select 
                                value={eventId || ''} 
                                onChange={(e) => handleEventChange(e.target.value)}
                                className="w-full bg-white border-2 border-stone-100 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] text-xl md:text-4xl font-serif text-[#1B2E1D] outline-none focus:border-[#BD7474]/30 shadow-sm transition-all appearance-none pr-16"
                            >
                                {userEvents.map(ev => (
                                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                                ))}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-stone-300 group-hover:text-[#BD7474] transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={handleExportCSV}
                        className="h-12 w-12 bg-white border border-stone-100 rounded-xl text-stone-300 hover:text-[#1B2E1D] shadow-sm transition-all flex items-center justify-center group"
                        title="Exportar Invitados"
                    >
                        <Download className="h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
                    </button>
                    
                    <button 
                        onClick={() => setIsManageMode(!isManageMode)}
                        className={`flex-1 md:flex-initial h-12 inline-flex items-center justify-center gap-3 px-8 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all shadow-lg ${
                            isManageMode 
                            ? 'bg-[#BD7474] text-white hover:bg-[#A05C5C] shadow-[#BD7474]/20' 
                            : 'bg-[#1B2E1D] text-white hover:bg-[#2D312E] shadow-[#1B2E1D]/20'
                        }`}
                    >
                        {isManageMode ? <X className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                        <span className="">{isManageMode ? 'Finalizar' : 'Gestionar'}</span>
                    </button>

                    {!isManageMode && (
                        <Link 
                            to={`/dashboard/checkin/${eventId}`}
                            className="flex-1 md:flex-initial h-12 inline-flex items-center justify-center gap-3 px-8 bg-white border border-stone-100 text-[#1B2E1D] rounded-xl text-[10px] uppercase font-black tracking-widest hover:bg-stone-50 transition-all shadow-sm"
                        >
                            <QrCode className="h-4 w-4" />
                            <span>Check-in</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Stats Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                {[
                    { label: 'Lugares (Pax)', value: metrics.totalInvitados, color: 'text-[#1B2E1D]', bg: 'bg-white', icon: <Users className="h-4 w-4" /> },
                    { label: 'Pax Confirm.', value: metrics.confirmados, color: 'text-emerald-500', bg: 'bg-emerald-50/20', icon: <Check className="h-4 w-4" /> },
                    { label: 'Check-in Real', value: metrics.ingresados, color: 'text-blue-500', bg: 'bg-blue-50/20', icon: <QrCode className="h-4 w-4" /> },
                    { label: 'Pax Pendientes', value: metrics.pendientes, color: 'text-amber-500', bg: 'bg-amber-50/20', icon: <Clock className="h-4 w-4" /> },
                    { label: 'Pax Declinados', value: metrics.noAsistiran, color: 'text-rose-500', bg: 'bg-rose-50/20', icon: <X className="h-4 w-4" /> },
                ].map((stat) => (
                    <div key={stat.label} className={`${stat.bg} p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-stone-100 shadow-sm transition-all hover:translate-y-[-4px] hover:shadow-xl hover:shadow-stone-200/50 flex flex-col justify-between group`}>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-400 group-hover:text-stone-500 transition-colors">{stat.label}</p>
                            <div className={`p-2 rounded-xl bg-white/80 shadow-sm ${stat.color} opacity-0 group-hover:opacity-100 transition-all`}>
                                {stat.icon}
                            </div>
                        </div>
                        <p className={`text-3xl md:text-4xl font-serif tracking-tighter ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-stone-100 gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-1">
                {['list', 'statistics', 'messages', 'tables', 'reminders'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-4 text-[10px] md:text-xs uppercase font-bold tracking-widest transition-all relative whitespace-nowrap ${
                            activeTab === tab ? 'text-[#1B2E1D]' : 'text-stone-300 hover:text-stone-400'
                        }`}
                    >
                        {tab === 'list' ? 'Lista' : tab === 'statistics' ? 'Estadísticas' : tab === 'messages' ? 'Mensajes' : tab === 'tables' ? 'Mesas' : 'Avisos'}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B2E1D]" />}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'list' && (
                <div className="bg-white md:rounded-[2rem] border-y md:border border-stone-100 shadow-sm overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#FDFBF7] border-b border-stone-100">
                                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-stone-400">Invitado</th>
                                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-stone-400">Grupo</th>
                                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-stone-400 text-center">Estado</th>
                                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-stone-400 text-center" title="Lugares requeridos por esta familia">PAX Total</th>
                                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-stone-400 text-center">Ingreso</th>
                                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-stone-400 text-center">Vistas</th>
                                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-stone-400">Mesa</th>
                                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-stone-400 text-center">QR</th>
                                    {isManageMode && <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-[#BD7474] text-center">Acciones</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {guests.map((guest) => {
                                    const rsvp = guest.rsvps?.[0];
                                    const isEditing = editingGuestId === guest.id;
                                    
                                    return (
                                        <tr key={guest.id} className="hover:bg-stone-50/50 transition-all">
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-[#1B2E1D]/5 text-[#1B2E1D] flex items-center justify-center flex-shrink-0">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    {isEditing ? (
                                                        <input 
                                                            value={editData.name} 
                                                            onChange={e => setEditData({...editData, name: e.target.value})}
                                                            className="font-medium text-[#1B2E1D] bg-white border border-stone-200 px-3 py-2 rounded-xl text-sm min-w-[150px]"
                                                        />
                                                    ) : (
                                                        <span className="font-medium text-[#1B2E1D]">{guest.name}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-stone-400 italic text-sm">
                                                {isEditing ? (
                                                    <input 
                                                        value={editData.group_name} 
                                                        onChange={e => setEditData({...editData, group_name: e.target.value})}
                                                        className="bg-white border border-stone-200 px-3 py-2 rounded-xl w-full"
                                                    />
                                                ) : (
                                                    guest.group_name || 'Individual'
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                {isEditing ? (
                                                    <select 
                                                        value={editData.status}
                                                        onChange={e => setEditData({...editData, status: e.target.value})}
                                                        className={`px-3 py-1.5 rounded-full border text-[9px] uppercase font-bold focus:outline-none ${getStatusStyles(editData.status)}`}
                                                    >
                                                        <option value="pending">Pendiente</option>
                                                        <option value="yes">Confirmado</option>
                                                        <option value="no">Declinado</option>
                                                    </select>
                                                ) : (
                                                    <div className={`mx-auto flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border text-[9px] uppercase font-bold tracking-tighter w-fit ${getStatusStyles(rsvp?.status)}`}>
                                                        {getStatusIcon(rsvp?.status)}
                                                        <span>{rsvp?.status === 'yes' ? 'Confirmado' : rsvp?.status === 'no' ? 'Declinado' : 'Pendiente'}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-center font-bold text-[#1B2E1D]">
                                                {isEditing ? (
                                                    <input 
                                                        type="number"
                                                        value={editData.plus_ones_confirmed} 
                                                        onChange={e => setEditData({...editData, plus_ones_confirmed: parseInt(e.target.value) || 0})}
                                                        className="bg-white border text-center border-stone-200 px-2 py-2 rounded-xl w-14"
                                                    />
                                                ) : (
                                                    rsvp?.status === 'yes' ? (rsvp?.plus_ones_confirmed || 0) + 1 : (guest.max_plus_ones || 0) + 1
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                {guest.checked_in_at ? (
                                                    <div className="mx-auto flex items-center justify-center bg-blue-50/50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100 text-[8px] uppercase font-bold tracking-tighter w-fit">
                                                        <Check className="h-3 w-3 mr-1" />
                                                        Asistió
                                                    </div>
                                                ) : (
                                                    <span className="text-stone-300 text-xs">-</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-center text-xs text-stone-400 font-medium">
                                                {guest.views_count || 0}
                                            </td>
                                            <td className="px-8 py-6">
                                                {isEditing ? (
                                                    <select 
                                                        value={editData.table_id || ''}
                                                        onChange={e => setEditData({...editData, table_id: e.target.value})}
                                                        className="bg-white border border-stone-200 px-3 py-2 rounded-xl text-[10px] w-full"
                                                    >
                                                        <option value="">N/A</option>
                                                        {tables.map(t => (
                                                            <option key={t.id} value={t.id}>{t.name}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className="text-sm font-semibold text-[#1B2E1D] whitespace-nowrap">
                                                        {tables.find(t => t.id === guest.table_id)?.name || '-'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <button 
                                                    onClick={() => setSelectedGuestForQR(guest)}
                                                    className="p-2 bg-stone-50 text-stone-300 hover:text-[#1B2E1D] rounded-lg transition-all"
                                                >
                                                    <QrCode className="h-4 w-4" />
                                                </button>
                                            </td>
                                            {isManageMode && (
                                                <td className="px-8 py-6 text-center">
                                                    {isEditing ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button onClick={() => handleSaveInline(guest)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Save className="h-4 w-4" /></button>
                                                            <button onClick={() => setEditingGuestId(null)} className="p-2 bg-stone-50 text-stone-400 rounded-lg"><X className="h-4 w-4" /></button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center gap-3">
                                                            <button 
                                                                onClick={() => {
                                                                    setEditingGuestId(guest.id);
                                                                    setEditData({
                                                                        name: guest.name,
                                                                        group_name: guest.group_name || '',
                                                                        status: rsvp?.status || 'pending',
                                                                        plus_ones_confirmed: rsvp?.plus_ones_confirmed || 0,
                                                                        table_id: guest.table_id || ''
                                                                    });
                                                                }}
                                                                className="p-2 text-stone-400 hover:text-[#1B2E1D]"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </button>
                                                            {confirmDeleteId === guest.id ? (
                                                                <div className="flex items-center gap-1">
                                                                    <button
                                                                        onClick={() => handleDelete(guest.id)}
                                                                        disabled={deletingId === guest.id}
                                                                        className="px-2 py-1 bg-rose-500 text-white text-xs font-medium rounded-lg hover:bg-rose-600 disabled:opacity-50"
                                                                    >
                                                                        {deletingId === guest.id ? '...' : '¿Eliminar?'}
                                                                    </button>
                                                                    <button onClick={() => setConfirmDeleteId(null)} className="p-1 text-stone-400 hover:text-stone-600">
                                                                        <X className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => setConfirmDeleteId(guest.id)}
                                                                    disabled={deletingId === guest.id}
                                                                    className="p-2 text-stone-300 hover:text-rose-500 disabled:opacity-50"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View (md:hidden) */}
                    <div className="md:hidden divide-y divide-stone-50">
                        {guests.length === 0 ? (
                            <div className="p-12 text-center text-stone-400 italic">No hay invitados registrados</div>
                        ) : (
                            guests.map((guest) => {
                                const rsvp = guest.rsvps?.[0];
                                const isEditing = editingGuestId === guest.id;
                                return (
                                    <div key={guest.id} className="p-6 space-y-4 hover:bg-[#FDFBF7] transition-all">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                {isEditing ? (
                                                    <input 
                                                        value={editData.name} 
                                                        onChange={e => setEditData({...editData, name: e.target.value})}
                                                        className="font-serif text-lg text-[#1B2E1D] bg-white border border-stone-200 px-3 py-2 rounded-xl w-full"
                                                    />
                                                ) : (
                                                    <h4 className="font-serif text-lg text-[#1B2E1D] leading-tight">{guest.name}</h4>
                                                )}
                                                {!isEditing && (
                                                    <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
                                                        {guest.group_name || 'Individual'} • Pax: {rsvp?.plus_ones_confirmed || 0}
                                                    </p>
                                                )}
                                            </div>
                                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] uppercase font-bold tracking-tighter ${isEditing ? 'bg-white' : getStatusStyles(rsvp?.status)}`}>
                                                {isEditing ? (
                                                    <select 
                                                        value={editData.status}
                                                        onChange={e => setEditData({...editData, status: e.target.value})}
                                                        className="bg-transparent focus:outline-none"
                                                    >
                                                        <option value="pending">PENDIENTE</option>
                                                        <option value="yes">CONFIRMADO</option>
                                                        <option value="no">DECLINADO</option>
                                                    </select>
                                                ) : (
                                                    <>
                                                        {getStatusIcon(rsvp?.status)}
                                                        {rsvp?.status === 'yes' ? 'Confirmado' : rsvp?.status === 'no' ? 'Declinado' : 'Pendiente'}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between py-3 border-y border-stone-50/50">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[8px] uppercase tracking-widest text-stone-300">Asistencia real</span>
                                                {guest.checked_in_at ? (
                                                    <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                                                        <Check className="h-3 w-3" /> Asistió
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-stone-400">Por llegar</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1 text-right">
                                                <span className="text-[8px] uppercase tracking-widest text-stone-300">Asignación Mesa</span>
                                                {isEditing ? (
                                                    <select 
                                                        value={editData.table_id || ''}
                                                        onChange={e => setEditData({...editData, table_id: e.target.value})}
                                                        className="bg-white border border-stone-200 px-2 py-1 rounded-lg text-[10px]"
                                                    >
                                                        <option value="">Sin Mesa</option>
                                                        {tables.map(t => (
                                                            <option key={t.id} value={t.id}>{t.name}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className="text-xs font-semibold text-[#1B2E1D]">
                                                        {tables.find(t => t.id === guest.table_id)?.name || 'Sin asignar'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => setSelectedGuestForQR(guest)}
                                                    className="p-2.5 bg-[#1B2E1D]/5 text-[#1B2E1D] rounded-xl hover:bg-white transition-all shadow-sm"
                                                >
                                                    <QrCode className="h-4 w-4" />
                                                </button>
                                                {isManageMode && !isEditing && (
                                                    <>
                                                        <button 
                                                            onClick={() => {
                                                                setEditingGuestId(guest.id);
                                                                setEditData({
                                                                    name: guest.name,
                                                                    group_name: guest.group_name || '',
                                                                    status: rsvp?.status || 'pending',
                                                                    plus_ones_confirmed: rsvp?.plus_ones_confirmed || 0,
                                                                    table_id: guest.table_id || ''
                                                                });
                                                            }}
                                                            className="p-2.5 bg-stone-50 text-stone-400 rounded-xl"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                        {confirmDeleteId === guest.id ? (
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => handleDelete(guest.id)}
                                                                    disabled={deletingId === guest.id}
                                                                    className="px-2 py-1.5 bg-rose-500 text-white text-xs font-medium rounded-xl disabled:opacity-50"
                                                                >
                                                                    {deletingId === guest.id ? '...' : '¿Eliminar?'}
                                                                </button>
                                                                <button onClick={() => setConfirmDeleteId(null)} className="p-2 text-stone-400 rounded-xl">
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setConfirmDeleteId(guest.id)}
                                                                disabled={deletingId === guest.id}
                                                                className="p-2.5 bg-stone-50 text-rose-300 rounded-xl disabled:opacity-50"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                                {isEditing && (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleSaveInline(guest)} className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg"><Save className="h-4 w-4" /></button>
                                                        <button onClick={() => setEditingGuestId(null)} className="p-2.5 bg-stone-100 text-stone-500 rounded-xl"><X className="h-4 w-4" /></button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'statistics' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Estado de Confirmaciones Pie Chart */}
                        <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col items-center hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-serif text-[#1B2E1D] mb-6 w-full text-left">Estado de Confirmaciones</h3>
                            {statusData.length > 0 ? (
                                <div className="w-full h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={65}
                                                outerRadius={95}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                                labelLine={false}
                                                label={({ cx, cy, midAngle, outerRadius, value }: any) => {
                                                    const RADIAN = Math.PI / 180;
                                                    const radius = (outerRadius || 0) + 15;
                                                    const angle = midAngle || 0;
                                                    const x = (cx || 0) + radius * Math.cos(-angle * RADIAN);
                                                    const y = (cy || 0) + radius * Math.sin(-angle * RADIAN);
                                                    return (
                                                        <text x={x} y={y} fill="#78716c" textAnchor={x > (cx || 0) ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fontWeight="bold">
                                                            {value}
                                                        </text>
                                                    );
                                                }}
                                            >
                                                {statusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`${value} PAX`, 'Cantidad']} contentStyle={{ borderRadius: '1.5rem', border: '1px solid #f5f5f4', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }} />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.1em', paddingTop: '10px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-64 flex items-center justify-center text-stone-400 italic text-sm">No hay datos suficientes</div>
                            )}
                        </div>

                        {/* Asistencia Real Bar Chart */}
                        <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col items-center hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-serif text-[#1B2E1D] mb-6 w-full text-left">Check-in vs Esperados</h3>
                            <div className="w-full h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={attendanceData} layout="vertical" margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f5f5f4" />
                                        <XAxis type="number" tick={{ fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} />
                                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#78716c', fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                                        <Tooltip cursor={{ fill: '#fafaf9' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }} />
                                        <Bar dataKey="total" radius={[0, 6, 6, 0]} maxBarSize={45}>
                                            {attendanceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                            <LabelList dataKey="total" position="right" fontSize={11} fontWeight="bold" fill="#1B2E1D" />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Distribucion por Grupos */}
                        <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm md:col-span-2 overflow-hidden hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-serif text-[#1B2E1D] mb-6">Distribución de Invitados por Grupo</h3>
                            <div className="w-full h-80 min-w-[500px] overflow-x-auto no-scrollbar">
                                {groupData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%" minWidth={600}>
                                        <BarChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#78716c', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                                            <YAxis tick={{ fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} />
                                            <Tooltip cursor={{ fill: '#fafaf9' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                                            <Bar dataKey="value" name="Total (PAX)" fill="#D9B880" radius={[6, 6, 0, 0]} maxBarSize={60}>
                                                <LabelList dataKey="value" position="top" fontSize={11} fontWeight="bold" fill="#1B2E1D" />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-stone-400 italic text-sm">Asigna grupos a tus invitados para ver esta gráfica</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'messages' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {guests.filter(g => g.rsvps?.[0]?.message).map((guest) => (
                        <div key={guest.id} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm space-y-6">
                            <h4 className="font-serif text-xl">{guest.name}</h4>
                            <p className="text-stone-500 italic">"{guest.rsvps[0].message}"</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'tables' && (
                <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-6 md:p-8 rounded-[2rem] border border-stone-100 shadow-sm gap-6">
                        <div>
                            <h3 className="text-xl md:text-2xl font-serif text-[#1B2E1D]">Distribución de Mesas</h3>
                            <p className="text-stone-400 text-sm italic">Organiza a tus invitados para la recepción.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 md:gap-4">
                            <button 
                                onClick={() => setIsAddingTable(!isAddingTable)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] uppercase font-bold tracking-widest shadow-md transition-all ${
                                    isAddingTable ? 'bg-stone-100 text-stone-600' : 'bg-[#BD7474] text-white'
                                }`}
                            >
                                <UserPlus className="h-4 w-4" /> {isAddingTable ? 'Cancelar' : 'Agregar Mesa'}
                            </button>
                            <button 
                                onClick={handleExportByTables}
                                className="flex items-center gap-2 px-6 py-3 bg-[#1B2E1D] text-white rounded-xl text-[10px] uppercase font-bold tracking-widest shadow-md"
                            >
                                <Download className="h-4 w-4" /> Exportar por Mesas
                            </button>
                        </div>
                    </div>

                    {isAddingTable && (
                        <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm animate-in slide-in-from-top duration-300">
                            <div className="grid md:grid-cols-3 gap-6 items-end">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Nombre de la Mesa</label>
                                    <input 
                                        type="text"
                                        placeholder="Ej. Mesa 1"
                                        value={newTable.name}
                                        onChange={e => setNewTable({...newTable, name: e.target.value})}
                                        className="w-full bg-[#FDFBF7] border border-stone-100 px-6 py-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2E1D]/5"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Capacidad (Pax)</label>
                                    <input 
                                        type="number"
                                        value={newTable.capacity}
                                        onChange={e => setNewTable({...newTable, capacity: parseInt(e.target.value) || 0})}
                                        className="w-full bg-[#FDFBF7] border border-stone-100 px-6 py-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2E1D]/5"
                                    />
                                </div>
                                <button 
                                    onClick={handleAddTable}
                                    className="w-full py-4 bg-[#1B2E1D] text-white rounded-xl text-[10px] uppercase font-bold tracking-widest shadow-lg hover:shadow-xl transition-all"
                                >
                                    Guardar Mesa
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tables.map(table => {
                            const tableGuests = guests.filter(g => g.table_id === table.id);
                            
                            const occupied = tableGuests.reduce((acc, g) => {
                                const rsvp = g.rsvps?.[0];
                                if (rsvp?.status === 'yes') return acc + (rsvp.plus_ones_confirmed || 0) + 1;
                                if (rsvp?.status === 'no') return acc;
                                return acc + (g.max_plus_ones || 0) + 1; 
                            }, 0);
                            
                            const available = Math.max(0, table.capacity - occupied);
                            const percent = Math.min(100, Math.round((occupied / table.capacity) * 100)) || 0;
                            const isOverbook = occupied > table.capacity;

                            return (
                                <div key={table.id} className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm space-y-6 group hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-[#1B2E1D]/5 flex items-center justify-center font-serif text-xl text-[#1B2E1D]">
                                                {table.name.replace(/[^0-9]/g, '') || table.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-serif text-[#1B2E1D] leading-tight">{table.name}</p>
                                                <p className="text-[9px] uppercase font-bold text-stone-400 tracking-widest mt-1">Total: {table.capacity} PAX</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteTable(table.id)}
                                            className="p-2 text-stone-200 hover:text-rose-500 transition-colors md:opacity-0 md:group-hover:opacity-100"
                                            title="Eliminar Mesa"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Capacidad Gráfica */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                                            <span className={`${isOverbook ? 'text-rose-500' : 'text-[#D9B880]'}`}>{occupied} Ocupados</span>
                                            <span className="text-stone-300">{available} Disp.</span>
                                        </div>
                                        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden flex">
                                            <div 
                                                className={`h-full transition-all duration-1000 ${isOverbook ? 'bg-rose-500' : 'bg-[#D9B880]'}`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        {isOverbook && <p className="text-[9px] text-rose-500 italic">La mesa supera su capacidad</p>}
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-stone-100">
                                        {tableGuests.map(g => {
                                            const rsvp = g.rsvps?.[0];
                                            let pax = 0;
                                            if (rsvp?.status === 'yes') pax = (rsvp.plus_ones_confirmed || 0) + 1;
                                            else if (rsvp?.status !== 'no') pax = (g.max_plus_ones || 0) + 1;

                                            return (
                                                <div key={g.id} className="flex justify-between items-center text-xs font-medium text-stone-600">
                                                    <span className="truncate pr-2">{g.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`h-1.5 w-1.5 rounded-full ${rsvp?.status === 'yes' ? 'bg-emerald-400' : rsvp?.status === 'no' ? 'bg-rose-400' : 'bg-amber-400'}`} />
                                                        <span className="text-[10px] w-6 text-right">{pax} px</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {tableGuests.length === 0 && (
                                            <p className="text-stone-300 text-[10px] uppercase tracking-widest text-center py-4">Mesa vacía</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'reminders' && (
                <div className="space-y-10">
                    <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm space-y-8">
                        <div>
                            <h3 className="text-3xl font-serif text-[#1B2E1D] mb-2">Editor de Recordatorios</h3>
                            <p className="text-stone-400 font-light italic">Personaliza el mensaje que recibirán tus invitados por WhatsApp.</p>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-[#BD7474]">Mensaje Personalizado</label>
                            <textarea 
                                value={reminderTemplate}
                                onChange={e => setReminderTemplate(e.target.value)}
                                className="w-full bg-[#FDFBF7] border border-stone-100 p-6 rounded-[2rem] text-stone-600 font-light focus:outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 min-h-[150px]"
                            />
                            <div className="flex flex-wrap gap-3">
                                {['{nombre}', '{evento}', '{link}'].map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-stone-50 border border-stone-100 text-[9px] font-bold text-stone-400 rounded-full">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-stone-300">Invitados Pendientes de Confirmar</h4>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {guests.filter(g => !g.rsvps?.[0] || g.rsvps[0].status === 'pending').map(guest => (
                                <div key={guest.id} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm flex justify-between items-center group hover:border-[#25D366]/30 transition-all">
                                    <div className="space-y-1">
                                        <p className="font-serif text-[#1B2E1D] text-lg">{guest.name}</p>
                                        <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">
                                            {guest.last_reminder_at ? `Último aviso: ${new Date(guest.last_reminder_at).toLocaleDateString()}` : 'Sin avisos'}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => handleSendReminder(guest)}
                                        className="h-12 w-12 bg-[#25D366] text-white rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-[#25D366]/20"
                                    >
                                        <SendIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}


            {/* QR Modal */}
            {selectedGuestForQR && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-stone-900/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl space-y-8 text-center animate-in zoom-in duration-300">
                        <button onClick={() => setSelectedGuestForQR(null)} className="absolute top-6 right-6 text-stone-300 hover:text-stone-900 transition-colors"><X className="h-6 w-6" /></button>
                        <div className="space-y-2">
                            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-300">Pase Personalizado</p>
                            <h3 className="text-3xl font-serif text-[#1B2E1D]">{selectedGuestForQR.name}</h3>
                        </div>
                        <div className="flex justify-center p-6 bg-[#FDFBF7] rounded-[2rem] border border-stone-100">
                            <QRCodeSVG 
                                value={`${window.location.origin}/i/${selectedGuestForQR.event?.slug || 'invite'}?t=${selectedGuestForQR.id}`} 
                                size={220}
                                fgColor="#1B2E1D"
                                bgColor="transparent"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Hola ${selectedGuestForQR.name}, aquí tienes tu pase digital para el evento: ${window.location.origin}/i/${selectedGuestForQR.event?.slug || 'invite'}?t=${selectedGuestForQR.id}`)}`, '_blank')}
                                className="flex-1 py-4 bg-[#25D366] text-white rounded-2xl text-[10px] uppercase font-bold tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
                            >
                                <MessageSquare className="h-4 w-4" /> Enviar por WA
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default EventRSVPs;
