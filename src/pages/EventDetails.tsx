import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { 
    Check, ArrowLeft, Trash2,
    Search, UserPlus,
    MapPin, Tag, Upload, FileType,
    LayoutDashboard, Users as UsersIcon, Gift, Image as ImageIcon, Plus, X as CloseIcon, Save,
    AlertTriangle, Copy, BellRing, MessageCircle, Edit2, Eye, Clock, Loader2
} from 'lucide-react';
import { differenceInDays, isPast } from 'date-fns';
import type { Event, Guest, RSVP } from '../types/database.types';
import { GuestStatusBadge } from '../components/dashboard/GuestStatusBadge';

interface GuestWithRSVP extends Guest {
    rsvps: RSVP | RSVP[] | null;
}

export default function EventDetails() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [event, setEvent] = useState<Event | null>(null);
    const [guests, setGuests] = useState<GuestWithRSVP[]>([]);
    const [activeTab, setActiveTab] = useState<'guests' | 'content'>('guests');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isSavingGuest, setIsSavingGuest] = useState(false);
    const [newGuest, setNewGuest] = useState({ name: '', group_name: '', max_plus_ones: 0, phone: '', email: '' });
    
    // Content state
    const [registryItems, setRegistryItems] = useState<any[]>([]);
    const [galleryImages, setGalleryImages] = useState<any[]>([]);

    useEffect(() => {
        if (!id || !user) return;
        fetchEventData();
    }, [id, user]);

    const fetchEventData = async () => {
        if (!id || !user) return;
        setLoading(true);
        try {
            // Una sola query: evento + guests + rsvps en un único round-trip.
            // Supabase convierte el nested select en un JOIN server-side.
            const { data, error } = await supabase
                .from('events')
                .select('*, guests(*, rsvps(*))')
                .or(`id.eq.${id},slug.eq.${id}`)
                .eq('user_id', user.id)
                .maybeSingle();

            if (error && error.code !== 'PGRST116') throw error;
            if (!data) { setEvent(null); return; }

            // Separar guests del objeto de evento antes de guardarlo en state
            const { guests: rawGuests, ...eventData } = data as any;

            setEvent(eventData);

            const config = eventData.theme_config || {};
            setRegistryItems(config.registry || []);
            setGalleryImages(config.gallery || []);

            // Ordenar por nombre en cliente (el nested select no soporta .order())
            const sorted = [...(rawGuests || [])].sort((a: any, b: any) =>
                a.name.localeCompare(b.name, 'es'),
            );
            setGuests(sorted as GuestWithRSVP[]);
        } catch (error) {
            console.error('Error fetching event data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveContent = async () => {
        if (!event || !id) return;
        setIsSaving(true);
        try {
            const newConfig = {
                ...event.theme_config,
                registry: registryItems,
                gallery: galleryImages
            };

            const { error } = await supabase
                .from('events')
                .update({ theme_config: newConfig })
                .eq('id', event.id);

            if (error) throw error;
            setEvent({ ...event, theme_config: newConfig });
            toast.success('¡Contenido guardado con éxito!');
        } catch (err: any) {
            toast.error('Error al guardar: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const saveGuest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGuest.name.trim() || !event) return;
        setIsSavingGuest(true);
        try {
            if (editingGuestId) {
                // Update existing guest
                const updateData = {
                    name: newGuest.name,
                    group_name: newGuest.group_name || 'General',
                    max_plus_ones: newGuest.max_plus_ones,
                    phone: newGuest.phone,
                    email: newGuest.email // Restaurado a petición del usuario
                };
                
                const { error, data } = await supabase
                    .from('guests')
                    .update(updateData)
                    .eq('id', editingGuestId)
                    .select()
                    .single();
                    
                if (error) throw error;
                if (data) {
                    setGuests(guests.map(g => g.id === editingGuestId ? { ...g, ...data } : g));
                }
            } else {
                // Insert new guest
                const newToken = crypto.randomUUID();
                const insertData: any = {
                    event_id: event.id,
                    name: newGuest.name,
                    group_name: newGuest.group_name || 'General',
                    max_plus_ones: newGuest.max_plus_ones,
                    phone: newGuest.phone,
                    email: newGuest.email, // Restaurado
                    guest_token: newToken,
                    status: 'pending'
                };

                const { data, error } = await supabase.from('guests').insert([insertData]).select().single();
                if (error) throw error;
                if (data) {
                    setGuests([...guests, { ...data, rsvps: null }]);
                }
            }
            // Cleanup
            setNewGuest({ name: '', group_name: '', max_plus_ones: 0, phone: '', email: '' });
            setEditingGuestId(null);
            setIsAddOpen(false);
        } catch (error: any) {
            console.error('Error saving guest:', error);
            toast.error('Error al guardar invitado: ' + error.message);
        } finally {
            setIsSavingGuest(false);
        }
    };

    const deleteGuest = async (guestId: string) => {
        if (!confirm('¿Eliminar invitado?')) return;
        try {
            const { error } = await supabase.from('guests').delete().eq('id', guestId);
            if (error) throw error;
            setGuests(guests.filter(g => g.id !== guestId));
        } catch (error) {
            console.error('Error deleting guest:', error);
        }
    };

    const getRSVPStatus = (guest: GuestWithRSVP): 'pending' | 'yes' | 'no' | 'maybe' => {
        if (!guest.rsvps) return 'pending';
        const rsvp = Array.isArray(guest.rsvps) ? guest.rsvps[0] : guest.rsvps;
        return rsvp?.status || 'pending';
    };

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

    const sendBulkReminder = () => {
        const pending = guests.filter(g => getRSVPStatus(g) === 'pending');
        if (pending.length === 0) {
            toast.info('No hay invitados pendientes por confirmar.');
            return;
        }
        toast.info(`Se enviarán recordatorios a ${pending.length} invitados. (Simulación)`);
    };

    const sendIndividualReminder = (guest: Guest) => {
        if (!event) return;
        const slug = event.slug || event.id;
        const token = (guest as any).guest_token || guest.id;
        const url = `${window.location.origin}/i/${slug}?t=${token}`;
        const message = `Hola ${guest.name}, te recordamos confirmar tu asistencia para ${event.title}. \nConfirma aquí: ${url}`;
        const wpUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(wpUrl, '_blank');
    };

    const copyGuestLink = async (guest: Guest) => {
        if (!event) return;
        const slug = event.slug || event.id;
        const token = (guest as any).guest_token || guest.id;
        const url = `${window.location.origin}/i/${slug}?t=${token}`;

        const message = `¡Hola ${guest.name}!\n\nTe comparto tu invitación personal y pases para acompañarnos a la celebración de: ${event.title}.\n\nPor favor, ingresa al siguiente enlace para ver los detalles y confirmar tu asistencia:\n${url}\n\n¡Esperamos contar con tu presencia!`;
        
        try {
            await navigator.clipboard.writeText(message);
            toast.success('¡Mensaje de invitación copiado!');
        } catch (err) {
            console.error('Error al copiar', err);
        }
    };

    const handleToggleRSVP = async (guest: GuestWithRSVP) => {
        if (!event) return;
        
        const currentStatus = getRSVPStatus(guest);
        const isConfirming = currentStatus !== 'yes';
        
        try {
            // Delete existing RSVPs for this guest
            await supabase.from('rsvps').delete().eq('guest_id', guest.id);
            
            if (isConfirming) {
                // Insert manual RSVP to confirmed
                const { error: rsvpError } = await supabase.from('rsvps').insert([{
                    event_id: event.id,
                    guest_id: guest.id,
                    status: 'yes',
                    plus_ones_confirmed: guest.max_plus_ones || 0,
                    message: 'Confirmación manual desde Dashboard'
                }]);
                if (rsvpError) throw rsvpError;
                
                // Update guest status
                await supabase.from('guests').update({ status: 'confirmed' }).eq('id', guest.id);
            } else {
                // Revert to pending
                await supabase.from('guests').update({ status: 'pending' }).eq('id', guest.id);
            }
            
            // Refresh local state to reflect changes instantly
            fetchEventData(); 
            
            if (isConfirming) {
                toast.success(`Asistencia de ${guest.name} confirmada`);
            } else {
                toast.info(`Asistencia de ${guest.name} cancelada`);
            }
        } catch (error) {
            console.error('Error toggling RSVP:', error);
            toast.error('Ocurrió un error al actualizar la confirmación.');
        }
    };

    const downloadCSV = (filename: string, content: string) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !event) return;
        const reader = new FileReader();
        reader.onload = async (e2) => {
            const text = e2.target?.result as string;
            const rows = text.split(/\r?\n/).filter(line => line.trim() !== '').slice(1);

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const existingNames = new Set(guests.map(g => g.name.toLowerCase().trim()));
            const existingPhones = new Set(guests.map(g => g.phone?.trim()).filter(Boolean));
            const existingEmails = new Set(guests.map(g => g.email?.trim()).filter(Boolean));
            const seenNamesInFile = new Set<string>();

            const rowErrors: string[] = [];
            const validGuests: any[] = [];

            rows.forEach((row, i) => {
                const lineNum = i + 2; // +2: 1-indexed + skip header
                const cols = row.includes(';') ? row.split(';') : row.split(',');
                const name = cols[0]?.trim() || '';
                const group = cols[1]?.trim() || 'General';
                const maxPlusOnes = parseInt(cols[2]?.trim() || '0') || 0;
                const phone = cols[3]?.trim() || '';
                const email = cols[4]?.trim() || '';

                if (!name) { rowErrors.push(`Fila ${lineNum}: nombre vacío`); return; }
                if (!phone && !email) { rowErrors.push(`Fila ${lineNum} (${name}): falta WhatsApp o email`); return; }
                if (email && !emailRegex.test(email)) { rowErrors.push(`Fila ${lineNum} (${name}): email inválido "${email}"`); return; }
                if (existingNames.has(name.toLowerCase())) { rowErrors.push(`Fila ${lineNum} (${name}): ya existe en la lista`); return; }
                if (phone && existingPhones.has(phone)) { rowErrors.push(`Fila ${lineNum} (${name}): teléfono ${phone} ya registrado`); return; }
                if (email && existingEmails.has(email)) { rowErrors.push(`Fila ${lineNum} (${name}): email ${email} ya registrado`); return; }
                if (seenNamesInFile.has(name.toLowerCase())) { rowErrors.push(`Fila ${lineNum} (${name}): nombre duplicado en el archivo`); return; }

                seenNamesInFile.add(name.toLowerCase());
                validGuests.push({
                    event_id: event.id,
                    name,
                    group_name: group,
                    max_plus_ones: maxPlusOnes,
                    phone,
                    email,
                    guest_token: crypto.randomUUID(),
                    status: 'pending'
                });
            });

            if (validGuests.length === 0) {
                toast.error(`No se importó ningún invitado. Revisa el formato del archivo.`);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }

            const { data, error } = await supabase.from('guests').insert(validGuests).select();
            if (!error && data) {
                setGuests(prev => [...prev, ...data as GuestWithRSVP[]]);
                const errSummary = rowErrors.length > 0
                    ? `\n\n⚠️ ${rowErrors.length} fila(s) omitidas:\n${rowErrors.slice(0, 5).join('\n')}${rowErrors.length > 5 ? `\n...y ${rowErrors.length - 5} más` : ''}`
                    : '';
                toast.success(`Se importaron ${data.length} invitados correctamente.${errSummary}`);
            } else if (error) {
                console.error('Database error importing guests:', error);
                toast.error('Error al guardar en la base de datos. Intenta de nuevo.');
            }
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
    };

    const filteredGuests = guests.filter(g => {
        const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (g.group_name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const stats = {
        total: guests.length,
        confirmed: guests.filter(g => getRSVPStatus(g) === 'yes').length,
        declined: guests.filter(g => getRSVPStatus(g) === 'no').length,
        pending: guests.filter(g => getRSVPStatus(g) === 'pending').length,
    };

    const percentConfirmed = stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0;

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="h-10 w-10 border-4 border-stone-200 border-t-[#1B2E1D] rounded-full animate-spin" />
        </div>
    );
    
    if (!event) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-serif mb-4">Evento no encontrado</h2>
            <Link to="/dashboard" className="text-stone-500 underline">Volver al panel</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFBF7] selection:bg-[#BD7474]/10 pb-20">
            {/* Hidden Input for CSV - ALWAYS in DOM */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImportCSV} 
                accept=".csv" 
                className="hidden" 
            />

            {/* Premium Add Guest Modal Overlay */}
            {isAddOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-[#1B2E1D]/40 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
                    <div className="relative w-full max-w-2xl bg-white rounded-[3rem] p-10 sm:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-stone-100 animate-in zoom-in slide-in-from-bottom-8 duration-500">
                        <div className="flex justify-between items-start mb-12">
                            <div className="space-y-2">
                                <h3 className="text-4xl font-serif text-[#1B2E1D]">{editingGuestId ? 'Editar Invitado' : 'Nuevo Invitado'}</h3>
                                <p className="text-stone-400 text-sm italic">Genera un enlace único de confirmación.</p>
                            </div>
                            <button onClick={() => setIsAddOpen(false)} className="h-12 w-12 rounded-2xl bg-stone-50 text-stone-300 hover:text-rose-500 flex items-center justify-center transition-all">
                                <CloseIcon className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={saveGuest} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 ml-1">Nombre del Invitado</label>
                                    <input 
                                        type="text" 
                                        required 
                                        autoFocus
                                        className="w-full p-5 bg-[#FDFBF7] rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all text-[#1B2E1D] text-lg font-serif" 
                                        placeholder="Ej. Sofía Velázquez"
                                        value={newGuest.name} 
                                        onChange={(e) => setNewGuest({...newGuest, name: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 ml-1">Grupo / Familia</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-5 bg-[#FDFBF7] rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all text-[#1B2E1D]" 
                                        placeholder="Ej. Familia Velázquez"
                                        value={newGuest.group_name} 
                                        onChange={(e) => setNewGuest({...newGuest, group_name: e.target.value})} 
                                    />
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 ml-1">WhatsApp <span className="text-stone-300 font-normal lowercase">(o Email)</span></label>
                                    <input 
                                        type="tel" 
                                        className="w-full p-5 bg-[#FDFBF7] rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all text-[#1B2E1D]" 
                                        placeholder="Ej. +525512345678"
                                        value={newGuest.phone} 
                                        onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 ml-1">Email <span className="text-stone-300 font-normal lowercase">(o WhatsApp)</span></label>
                                    <input 
                                        type="email" 
                                        className="w-full p-5 bg-[#FDFBF7] rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all text-[#1B2E1D]" 
                                        placeholder="Ej. juan@correo.com"
                                        value={newGuest.email} 
                                        onChange={(e) => setNewGuest({...newGuest, email: e.target.value})} 
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 ml-1">Acompañantes Adicionales</label>
                                <div className="flex items-center gap-6">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="10"
                                        className="flex-1 accent-[#1B2E1D]"
                                        value={newGuest.max_plus_ones} 
                                        onChange={(e) => setNewGuest({...newGuest, max_plus_ones: parseInt(e.target.value) || 0})} 
                                    />
                                    <span className="text-2xl font-serif text-[#1B2E1D] w-8">{newGuest.max_plus_ones}</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSavingGuest}
                                className="w-full py-6 bg-[#1B2E1D] text-white rounded-2xl text-[11px] uppercase font-bold tracking-[0.3em] shadow-2xl hover:bg-[#2C482F] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {isSavingGuest ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : editingGuestId ? 'Guardar Cambios' : 'Guardar y Generar Enlace'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 space-y-16">
                {/* Top Navigation & Fast Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="flex bg-white/50 backdrop-blur-md p-1 rounded-xl md:rounded-2xl border border-stone-100 shadow-sm overflow-x-auto no-scrollbar w-full sm:w-auto">
                        <button 
                            onClick={() => setActiveTab('guests')}
                            className={`flex items-center justify-center gap-3 px-4 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl text-[9px] md:text-[10px] uppercase font-bold tracking-widest transition-all flex-1 sm:flex-none whitespace-nowrap ${activeTab === 'guests' ? 'bg-[#1B2E1D] text-white shadow-lg' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                            <UsersIcon className="h-4 w-4" /> <span className="hidden xs:inline">Invitados</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('content')}
                            className={`flex items-center justify-center gap-3 px-4 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl text-[9px] md:text-[10px] uppercase font-bold tracking-widest transition-all flex-1 sm:flex-none whitespace-nowrap ${activeTab === 'content' ? 'bg-[#1B2E1D] text-white shadow-lg' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                            <LayoutDashboard className="h-4 w-4" /> <span className="hidden xs:inline">Personalización</span>
                        </button>
                    </div>

                    {/* Balanced Quick Action Cluster */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-stone-100 shadow-sm w-full sm:w-auto justify-between sm:justify-start gap-2">
                            <Link to="/dashboard" className="h-10 w-10 bg-stone-50 border border-stone-100 rounded-xl flex items-center justify-center text-stone-400 hover:text-[#1B2E1D] transition-all group">
                                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1" />
                            </Link>
                            
                            <div className="h-10 w-px bg-stone-50 hidden sm:block mx-1" />

                            <div className="flex items-center gap-2">
                                <Link to={`/dashboard/design/${event.id}`} className="px-4 h-10 bg-white border border-stone-200 text-stone-600 hover:text-[#BD7474] hover:border-[#BD7474] rounded-xl text-[8px] uppercase font-black tracking-widest shadow-sm flex items-center justify-center gap-2 transition-all">
                                    <Edit2 className="h-3.5 w-3.5" /> <span className="xs:inline">Diseño</span>
                                </Link>
                                <Link to={`/i/${event.slug || event.id}?t=admin`} target="_blank" className="px-4 h-10 bg-white border border-stone-200 text-stone-600 hover:text-[#1B2E1D] hover:border-[#1B2E1D] rounded-xl text-[8px] uppercase font-black tracking-widest shadow-sm flex items-center justify-center gap-2 transition-all">
                                    <Eye className="h-3.5 w-3.5" /> <span className="xs:inline">Ver</span>
                                </Link>
                            </div>
                        </div>

                        <button 
                            onClick={shareOnWhatsApp}
                            className="w-full sm:w-auto px-10 h-10 bg-[#25D366] text-white rounded-[1.5rem] text-[9px] uppercase font-black tracking-widest shadow-lg shadow-emerald-100/50 flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all"
                        >
                            <MessageCircle className="h-4 w-4" /> <span>Compartir Link</span>
                        </button>
                    </div>
                </div>

                {/* Event Hero Profile */}
                <div className="bg-white rounded-[2rem] md:rounded-[4rem] border border-stone-100 p-6 md:p-20 shadow-sm relative overflow-hidden group">
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
                                <h1 className="text-3xl xs:text-4xl sm:text-7xl lg:text-[9rem] font-serif text-[#1B2E1D] tracking-tighter leading-[0.9] md:leading-[0.8] mb-4 break-words">{event.title}</h1>
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
                                                            <button 
                                                                onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`¡Hola! Te recordamos confirmar tu asistencia a "${event.title}". Quedan ${daysRemaining} días para el cierre. Por favor confirma aquí: ${window.location.origin}/i/${event.slug}`)}`, '_blank')}
                                                                className="px-4 py-2 w-full sm:w-auto bg-[#1B2E1D] hover:bg-[#2A442E] text-white rounded-lg text-[9px] uppercase tracking-widest font-bold transition-all shadow-md flex items-center justify-center gap-2"
                                                            >
                                                                <MessageCircle className="h-3 w-3" /> Recordar Inv.
                                                            </button>
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
                            <div className="p-6 md:p-10 bg-[#FDFBF7] rounded-[2rem] md:rounded-[3rem] border border-stone-100 shadow-sm space-y-4 md:space-y-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-[9px] md:text-[11px] uppercase font-black tracking-[0.2em] md:tracking-[0.3em] text-[#1B2E1D]">Asistencia</span>
                                    <div className="text-right">
                                        <span className="text-2xl md:text-4xl font-serif text-[#1B2E1D]">{stats.confirmed}</span>
                                        <span className="text-sm md:text-lg font-serif text-stone-300 ml-1">/{stats.total}</span>
                                    </div>
                                </div>
                                <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden p-0.5">
                                    <div 
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                        style={{ width: `${percentConfirmed}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-center gap-2 text-stone-400">
                                    <UsersIcon className="h-3 w-3" />
                                    <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest italic">{stats.total === 0 ? 'Sin invitados' : 'En progreso'}</p>
                                </div>
                            </div>

                            <button onClick={copyGeneralLink} className="group w-full h-16 md:h-20 bg-[#1B2E1D] text-white rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center gap-4 text-[10px] md:text-[11px] uppercase font-bold tracking-[0.3em] md:tracking-[0.4em] hover:bg-[#2C482F] transition-all shadow-xl hover:translate-y-[-4px]">
                                <Copy className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform" /> <span className="hidden xs:inline">Copiar Enlace</span><span className="xs:hidden">Copiar Link</span>
                            </button>
                        </div>
                    </div>
                </div>

            {activeTab === 'guests' ? (
                /* GUESTS TAB CONTENT */
                <div className="space-y-12">
                    {/* Stats & Priority Metrics */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                        {[
                            { label: 'Invitados', count: stats.total, color: 'text-stone-900', bg: 'bg-white' },
                            { label: 'Confirmados', count: stats.confirmed, color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
                            { label: 'Declinados', count: stats.declined, color: 'text-rose-600', bg: 'bg-rose-50/50' },
                            { label: 'Pendientes', count: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50/50' },
                        ].map((stat, i) => (
                            <div key={i} className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-stone-100 shadow-sm transition-all hover:shadow-md ${stat.bg}`}>
                                <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-stone-400 mb-2">{stat.label}</p>
                                <p className={`text-2xl md:text-4xl font-serif ${stat.color}`}>{stat.count}</p>
                            </div>
                        ))}
                        {stats.pending > 0 && (
                            <div className="col-span-full lg:col-span-1 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#1B2E1D] text-white shadow-2xl relative overflow-hidden flex flex-col justify-center border-none">
                                <AlertTriangle className="absolute -top-4 -right-4 h-24 w-24 text-white opacity-5 rotate-12" />
                                <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-[#BD7474] mb-2">Urgente</p>
                                <p className="text-lg md:text-xl font-serif leading-tight">Faltan {stats.pending} por confirmar</p>
                            </div>
                        )}
                    </div>

                    {/* Common Form & Input Logic (Always available) */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImportCSV} 
                        accept=".csv" 
                        className="hidden" 
                    />


                    {guests.length === 0 ? (
                        /* EMPTY STATE */
                        <div className="py-24 px-10 bg-white rounded-[3rem] border-2 border-dashed border-stone-100 flex flex-col items-center text-center space-y-8 animate-in fade-in duration-700">
                             <div className="h-24 w-24 bg-[#FDFBF7] rounded-[2rem] flex items-center justify-center text-stone-200">
                                <UsersIcon className="h-12 w-12" />
                             </div>
                             <div className="space-y-3 max-w-md">
                                <h3 className="text-3xl font-serif text-[#1B2E1D]">Aún no tienes invitados</h3>
                                <p className="text-stone-400 font-light italic">Empieza agregando tus primeros invitados o comparte el enlace para recibir confirmaciones automáticas.</p>
                             </div>
                             
                             <div className="flex flex-col items-center gap-6 pt-4">
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Button 
                                        onClick={() => setIsAddOpen(true)}
                                        className="bg-[#1B2E1D] text-white px-10 py-5 rounded-2xl shadow-xl hover:scale-105 transition-all text-[10px] uppercase tracking-widest"
                                    >
                                        <UserPlus className="mr-2 h-4 w-4" /> Agregar primer invitado
                                    </Button>
                                    <button
                                        onClick={copyGeneralLink}
                                        className="px-10 py-5 bg-white border border-stone-100 rounded-2xl text-[10px] uppercase font-bold tracking-widest text-stone-600 hover:text-[#1B2E1D] transition-all hover:bg-stone-50 shadow-sm"
                                    >
                                        Copiar enlace
                                    </button>
                                </div>
                                
                                <div className="flex items-center gap-3 p-2 bg-stone-50 rounded-2xl border border-stone-100">
                                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-5 py-3 rounded-xl text-[9px] uppercase font-bold tracking-widest text-stone-500 hover:bg-white hover:shadow-sm transition-all">
                                        <Upload className="h-4 w-4 text-emerald-500" /> Importar CSV
                                    </button>
                                    <div className="h-4 w-px bg-stone-200" />
                                    <button onClick={() => downloadCSV('plantilla.csv', 'Nombre,Grupo,Pax_Extra,WhatsApp,Email\nJuan Perez,Familia,2,+525555555555,juan@ejemplo.com')} className="flex items-center gap-2 px-5 py-3 rounded-xl text-[9px] uppercase font-bold tracking-widest text-stone-500 hover:bg-white hover:shadow-sm transition-all">
                                        <FileType className="h-4 w-4 text-[#BD7474]" /> Descargar Plantilla
                                    </button>
                                </div>
                             </div>
                        </div>
                    ) : (
                        /* GUEST LIST TABLE */
                        <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                             <div className="p-10 border-b border-stone-100 bg-[#FDFBF7] flex flex-col lg:flex-row gap-8 justify-between items-center">
                                <div className="relative w-full lg:w-[35rem]">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300" />
                                    <input 
                                        type="text" 
                                        placeholder="Buscar por nombre o grupo..."
                                        className="w-full pl-16 pr-6 py-4 bg-white border border-stone-100 rounded-2xl text-base focus:ring-2 focus:ring-[#1B2E1D]/10 outline-none transition-all shadow-sm font-light text-stone-600"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                                    <div className="flex bg-white p-1 rounded-2xl border border-stone-100 shadow-sm flex-1 lg:flex-none">
                                        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-5 py-3 rounded-xl text-[9px] uppercase font-bold tracking-widest text-stone-500 hover:bg-stone-50 transition-all">
                                            <Upload className="h-4 w-4 text-emerald-500" /> Importar
                                        </button>
                                        <button onClick={() => downloadCSV('plantilla.csv', 'Nombre,Grupo,Pax_Extra,WhatsApp,Email\nJuan Perez,Familia,2,+525555555555,juan@ejemplo.com')} className="flex items-center gap-2 px-5 py-3 rounded-xl text-[9px] uppercase font-bold tracking-widest text-stone-500 hover:bg-stone-50 transition-all border-l border-stone-100">
                                            <FileType className="h-4 w-4 text-[#BD7474]" /> Plantilla
                                        </button>
                                    </div>
                                    
                                    <Button 
                                        onClick={() => {
                                            setNewGuest({ name: '', group_name: '', max_plus_ones: 0, phone: '', email: '' });
                                            setEditingGuestId(null);
                                            setIsAddOpen(true);
                                        }}
                                        className="bg-[#BD7474] text-white hover:bg-[#A05C5C] px-10 py-5 rounded-2xl shadow-xl shadow-[#BD7474]/20 flex-1 lg:flex-none text-[10px] uppercase tracking-widest"
                                    >
                                        <UserPlus className="mr-2 h-5 w-5" /> Agregar invitado
                                    </Button>
                                </div>
                            </div>

                            <div className="md:rounded-[2.5rem] overflow-hidden">
                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto p-10">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[10px] uppercase font-bold tracking-widest text-stone-300">
                                                <th className="px-4 py-6">Invitado</th>
                                                <th className="px-4 py-6">Grupo</th>
                                                <th className="px-4 py-6 text-center">Estado Visual</th>
                                                <th className="px-4 py-6">Estatus</th>
                                                <th className="px-4 py-6 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-50">
                                            {filteredGuests.map((guest) => (
                                                <tr key={guest.id} className="group hover:bg-[#FDFBF7] transition-colors">
                                                    <td className="px-4 py-8">
                                                        <div className="font-serif text-xl text-stone-900 mb-1">{guest.name}</div>
                                                        <div className="text-[9px] text-[#BD7474] font-bold tracking-[0.2em] uppercase">
                                                            Capacidad: {1 + (guest.max_plus_ones || 0)} Personas
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-8">
                                                        <span className="flex items-center gap-2 text-stone-400 text-sm italic font-light">
                                                            <Tag className="h-3.5 w-3.5 text-stone-200" /> {guest.group_name}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-8">
                                                         <div className="flex justify-center">
                                                            <div className={`h-2.5 w-2.5 rounded-full ${
                                                                getRSVPStatus(guest) === 'yes' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                                                                getRSVPStatus(guest) === 'no' ? 'bg-rose-500 shadow-[0_0_10_rgba(244,63,94,0.5)]' :
                                                                'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                                                            }`} />
                                                         </div>
                                                    </td>
                                                    <td className="px-4 py-8">
                                                        <div className="flex flex-col gap-3">
                                                            <GuestStatusBadge status={getRSVPStatus(guest)} />
                                                            <div className="flex items-center gap-3">
                                                                <button
                                                                    onClick={() => handleToggleRSVP(guest)}
                                                                    className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#BD7474] focus:ring-offset-2 ${
                                                                        getRSVPStatus(guest) === 'yes' ? 'bg-[#BD7474]' : 'bg-stone-300'
                                                                    }`}
                                                                    title={getRSVPStatus(guest) === 'yes' ? "Cancelar confirmación manual" : "Confirmar manualmente"}
                                                                >
                                                                    <span
                                                                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                                            getRSVPStatus(guest) === 'yes' ? 'translate-x-4.5' : 'translate-x-0.5'
                                                                        }`}
                                                                        style={{ transform: getRSVPStatus(guest) === 'yes' ? 'translateX(18px)' : 'translateX(2px)' }}
                                                                    />
                                                                </button>
                                                                <span className="text-[9px] uppercase tracking-widest font-bold text-stone-400">
                                                                    Manual
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-8 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button 
                                                                onClick={() => copyGuestLink(guest)}
                                                                className="p-3 bg-stone-50 text-stone-500 hover:bg-stone-200 hover:text-stone-800 rounded-2xl transition-all shadow-sm"
                                                                title="Copiar mensaje de invitación con link"
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => {
                                                                    setNewGuest({
                                                                        name: guest.name,
                                                                        group_name: guest.group_name || '',
                                                                        max_plus_ones: guest.max_plus_ones || 0,
                                                                        phone: guest.phone || '',
                                                                        email: guest.email || ''
                                                                    });
                                                                    setEditingGuestId(guest.id);
                                                                    setIsAddOpen(true);
                                                                }}
                                                                className="p-3 bg-slate-50 text-slate-500 hover:bg-slate-200 hover:text-slate-800 rounded-2xl transition-all shadow-sm"
                                                                title="Editar invitado"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => sendIndividualReminder(guest)}
                                                                className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all shadow-sm"
                                                                title="Enviar recordatorio por WhatsApp"
                                                            >
                                                                <MessageCircle className="h-4 w-4" />
                                                            </button>
                                                            <button onClick={() => deleteGuest(guest.id)} className="p-3 bg-rose-50 text-rose-300 hover:text-rose-600 rounded-2xl transition-colors">
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="md:hidden divide-y divide-stone-50">
                                    {filteredGuests.map((guest) => {
                                        const status = getRSVPStatus(guest);
                                        return (
                                            <div key={guest.id} className="p-6 space-y-4 hover:bg-[#FDFBF7] transition-all">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <h4 className="font-serif text-lg text-[#1B2E1D] leading-tight">{guest.name}</h4>
                                                        <p className="text-[10px] uppercase font-bold tracking-widest text-[#BD7474]">
                                                            Pax: {1 + (guest.max_plus_ones || 0)} • {guest.group_name || 'Individual'}
                                                        </p>
                                                    </div>
                                                    <GuestStatusBadge status={status} />
                                                </div>

                                                <div className="flex items-center justify-between py-3 border-y border-stone-50/50">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleToggleRSVP(guest)}
                                                            className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#BD7474] focus:ring-offset-2 ${
                                                                status === 'yes' ? 'bg-[#BD7474]' : 'bg-stone-200'
                                                            }`}
                                                        >
                                                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${status === 'yes' ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                                                        </button>
                                                        <span className="text-[8px] uppercase tracking-widest font-bold text-stone-400">Confirmación Manual</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => sendIndividualReminder(guest)} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><MessageCircle className="h-4 w-4" /></button>
                                                        <button onClick={() => copyGuestLink(guest)} className="p-2.5 bg-stone-50 text-stone-500 rounded-xl"><Copy className="h-4 w-4" /></button>
                                                        <button 
                                                            onClick={() => {
                                                                setNewGuest({
                                                                    name: guest.name,
                                                                    group_name: guest.group_name || '',
                                                                    max_plus_ones: guest.max_plus_ones || 0,
                                                                    phone: guest.phone || '',
                                                                    email: guest.email || ''
                                                                });
                                                                setEditingGuestId(guest.id);
                                                                setIsAddOpen(true);
                                                            }}
                                                            className="p-2.5 bg-stone-50 text-stone-400 rounded-xl"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                        <button onClick={() => deleteGuest(guest.id)} className="p-2.5 bg-rose-50 text-rose-300 rounded-xl"><Trash2 className="h-4 w-4" /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ALWAYS VISIBLE: Invitados sin confirmar section */}
                    <div className="mt-12 space-y-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[#BD7474] mb-2">Seguimiento</p>
                                <h2 className="text-3xl sm:text-4xl font-serif text-[#1B2E1D] flex items-center gap-4">
                                    Invitados sin confirmar
                                </h2>
                                <p className="text-stone-400 text-sm font-light italic">Aquí aparecerán las personas que aún no responden.</p>
                            </div>
                            
                            {guests.filter(g => getRSVPStatus(g) === 'pending').length > 0 && (
                                <button 
                                    onClick={sendBulkReminder}
                                    className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-5 bg-[#1B2E1D] text-white rounded-[1.5rem] md:rounded-[2rem] text-[10px] uppercase font-black tracking-[0.2em] shadow-xl hover:bg-[#2A442E] transition-all border-b-4 border-black/20 group"
                                >
                                    <BellRing className="h-4 w-4 group-hover:rotate-12 transition-transform" /> 
                                    Enviar recordatorios masivos
                                </button>
                            )}
                        </div>
                        
                        {guests.filter(g => getRSVPStatus(g) === 'pending').length === 0 ? (
                            <div className="py-12 px-10 bg-white rounded-[2rem] border border-stone-100 flex flex-col items-center text-center space-y-4">
                                <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                                    <Check className="h-8 w-8" />
                                </div>
                                <p className="text-stone-500 font-medium italic">Todos tus invitados han confirmado su asistencia. ¡Excelente!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {guests.filter(g => getRSVPStatus(g) === 'pending').map((guest) => (
                                    <div key={guest.id} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="font-serif text-xl text-[#1B2E1D]">{guest.name}</h3>
                                                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-bold uppercase tracking-widest">Pendiente</span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-stone-400 text-xs font-light">Grupo: <span className="text-stone-600 font-medium">{guest.group_name}</span></p>
                                                <p className="text-stone-400 text-xs font-light">Asistentes: <span className="text-stone-600 font-medium">{guest.max_plus_ones + 1}</span></p>
                                            </div>
                                        </div>
                                        <div className="mt-8">
                                            <button 
                                                onClick={() => sendIndividualReminder(guest)}
                                                className="w-full flex items-center justify-center gap-2 py-4 bg-stone-50 text-stone-600 rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-[#25D366] hover:text-white transition-all font-sans"
                                            >
                                                <MessageCircle className="h-4 w-4" /> Recordar por WhatsApp
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* CONTENT TAB CONTENT */
                <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-end mb-8">
                        <div className="space-y-2">
                             <h2 className="text-3xl font-serif text-[#1B2E1D]">Contenido Multimedia</h2>
                             <p className="text-stone-400 text-sm font-light italic">Configura tu mesa de regalos y galería de fotos.</p>
                        </div>
                        <button 
                            onClick={handleSaveContent} 
                            disabled={isSaving}
                            className="bg-[#1B2E1D] text-white px-10 py-5 rounded-2xl shadow-2xl flex items-center gap-2 hover:scale-105 transition-all"
                        >
                            {isSaving ? 'Guardando...' : <><Save className="h-5 w-5" /> Guardar Todo</>}
                        </button>
                    </div>

                    {/* Mesa de Regalos Configuration */}
                    <div className="bg-white rounded-[2.5rem] border border-stone-100 p-10 shadow-sm space-y-10">
                         <div className="flex items-center gap-4 border-b border-stone-50 pb-8">
                            <div className="h-14 w-14 bg-[#BD7474]/10 rounded-[1.5rem] flex items-center justify-center text-[#BD7474]">
                                <Gift className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-serif text-[#1B2E1D]">Mesa de Regalos</h3>
                                <p className="text-stone-400 text-xs tracking-widest uppercase font-bold mt-1">Soporta transferencias y links externos</p>
                            </div>
                         </div>

                         <div className="grid md:grid-cols-2 gap-8">
                            {registryItems.map((item, index) => (
                                <div key={index} className="p-8 bg-[#FDFBF7] rounded-[2rem] border border-stone-100 relative group">
                                    <button 
                                        onClick={() => setRegistryItems(registryItems.filter((_, i) => i !== index))}
                                        className="absolute top-4 right-4 h-8 w-8 bg-white text-stone-300 hover:text-rose-500 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <CloseIcon className="h-4 w-4" />
                                    </button>
                                    
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-white border border-stone-100 rounded-full text-[8px] uppercase font-bold text-stone-400">{item.type}</span>
                                            <h4 className="font-serif text-lg">{item.title}</h4>
                                        </div>
                                        
                                        {item.type === 'bank' ? (
                                            <div className="space-y-4">
                                                <input placeholder="Banco" className="w-full bg-white p-3 rounded-xl border-none shadow-sm text-sm" value={item.bank_name} onChange={e => {
                                                    const n = [...registryItems]; n[index].bank_name = e.target.value; setRegistryItems(n);
                                                }} />
                                                <input placeholder="CLABE" className="w-full bg-white p-3 rounded-xl border-none shadow-sm text-sm" value={item.clabe} onChange={e => {
                                                    const n = [...registryItems]; n[index].clabe = e.target.value; setRegistryItems(n);
                                                }} />
                                                <input placeholder="Beneficiario" className="w-full bg-white p-3 rounded-xl border-none shadow-sm text-sm" value={item.beneficiary} onChange={e => {
                                                    const n = [...registryItems]; n[index].beneficiary = e.target.value; setRegistryItems(n);
                                                }} />
                                            </div>
                                        ) : (
                                            <input placeholder="URL de la mesa" className="w-full bg-white p-3 rounded-xl border-none shadow-sm text-sm" value={item.url} onChange={e => {
                                                const n = [...registryItems]; n[index].url = e.target.value; setRegistryItems(n);
                                            }} />
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button 
                                onClick={() => setRegistryItems([...registryItems, { type: 'bank', title: 'Nueva Cuenta', bank_name: '', clabe: '', beneficiary: '' }])}
                                className="p-8 border-2 border-dashed border-stone-100 rounded-[2rem] flex flex-col items-center justify-center text-stone-300 hover:border-[#BD7474] hover:text-[#BD7474] transition-all gap-4 group"
                            >
                                <Plus className="h-8 w-8 transition-transform group-hover:rotate-90" />
                                <span className="text-[10px] uppercase font-bold tracking-widest text-inherit">Agregar Transferencia</span>
                            </button>
                         </div>
                    </div>

                    {/* Gallery Configuration */}
                    <div className="bg-white rounded-[2.5rem] border border-stone-100 p-10 shadow-sm space-y-10">
                        <div className="flex items-center gap-4 border-b border-stone-50 pb-8">
                            <div className="h-14 w-14 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600">
                                <ImageIcon className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-serif text-[#1B2E1D]">Galería de Fotos</h3>
                                <p className="text-stone-400 text-xs tracking-widest uppercase font-bold mt-1">Imágenes para tu invitación</p>
                            </div>
                         </div>

                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {galleryImages.map((img, index) => (
                                <div key={index} className="aspect-square bg-stone-100 rounded-[1.5rem] relative group overflow-hidden">
                                     <img src={img.url} className="w-full h-full object-cover" alt="preview" />
                                     <button 
                                        onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== index))}
                                        className="absolute top-2 right-2 h-7 w-7 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                     >
                                        <CloseIcon className="h-4 w-4" />
                                     </button>
                                     <div className="absolute inset-x-2 bottom-2">
                                        <input 
                                            placeholder="Pie de foto" 
                                            className="w-full p-2 bg-white/90 backdrop-blur-md text-[9px] rounded-lg outline-none border-none shadow-sm"
                                            value={img.caption || ''}
                                            onChange={e => {
                                                const n = [...galleryImages]; n[index].caption = e.target.value; setGalleryImages(n);
                                            }}
                                        />
                                     </div>
                                </div>
                            ))}
                            <button 
                                onClick={() => {
                                    const url = prompt('Introduce la URL de tu imagen:');
                                    if (url) setGalleryImages([...galleryImages, { url, caption: '' }]);
                                }}
                                className="aspect-square border-2 border-dashed border-stone-100 rounded-[1.5rem] flex flex-col items-center justify-center text-stone-200 hover:border-emerald-400 hover:text-emerald-500 transition-all gap-4 group"
                            >
                                <Plus className="h-8 w-8 group-hover:scale-125 transition-transform" />
                                <span className="text-[8px] uppercase font-bold tracking-widest text-inherit text-center">Añadir Foto<br />(vía URL)</span>
                            </button>
                         </div>
                         </div>
                </div>
            )}
            </div>
        </div>
    );
}
