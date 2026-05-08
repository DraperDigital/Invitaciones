import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
    Check, X, MessageSquare, Download, 
    Trash2, Edit2, Save, QrCode, Send as SendIcon, Users,
    Search, LayoutDashboard, Copy, ArrowLeft, ChevronDown,
    Clock, MapPin, Eye, AlertTriangle, UserPlus, Upload, Loader2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis } from 'recharts';
import { differenceInDays, isPast } from 'date-fns';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const EventRSVPs: React.FC = () => {
    const location = useLocation();
    const isEventDashboard = location.pathname.startsWith('/dashboard/event/');
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
    const [editData, setEditData] = useState({ name: '', group_name: '', status: '', plus_ones_confirmed: 0, max_plus_ones: 0, table_id: '' });
    const [selectedGuestForQR, setSelectedGuestForQR] = useState<any | null>(null);

    // Filters & Views
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'yes' | 'no'>('all');
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

    const { user } = useAuth();
    const toast = useToast();
    const { hasFeature } = useFeatureAccess(eventId || undefined);

    // New Table State
    const [isAddingTable, setIsAddingTable] = useState(false);
    const [newTable, setNewTable] = useState({ name: '', capacity: 10 });

    // Add Guest State
    const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
    const [isSavingGuest, setIsSavingGuest] = useState(false);
    const [newGuest, setNewGuest] = useState({ name: '', group_name: '', max_plus_ones: 0, phone: '', email: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importErrors, setImportErrors] = useState<string[] | null>(null);

    // Bulk Selection State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isDeletingBulk, setIsDeletingBulk] = useState(false);
    const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);

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
            // Update guest info directly in the table to allow max_plus_ones
            const { error: infoErr } = await supabase
                .from('guests')
                .update({
                    name: editData.name,
                    group_name: editData.group_name,
                    table_id: editData.table_id || null,
                    max_plus_ones: editData.max_plus_ones
                })
                .eq('id', guest.id)
                .select();
                
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
                max_plus_ones: editData.max_plus_ones,
                table_id: editData.table_id || null,
                status: editData.status === 'yes' ? 'confirmed' : editData.status === 'no' ? 'declined' : 'pending',
                rsvps: [{ 
                    ...(g.rsvps?.[0] || {}), 
                    status: editData.status,
                    plus_ones_confirmed: editData.status === 'yes' ? editData.max_plus_ones : (g.rsvps?.[0]?.plus_ones_confirmed || 0)
                }] 
            } : g));
            setEditingGuestId(null);
            toast.success('Guardado correctamente');
        } catch (e: any) {
            console.error('[Save] Error:', e);
            toast.error('Error al guardar: ' + (e?.message || ''));
        }
    };

    const handleExportPDF = () => {
        console.log('[ExportPDF] Iniciando exportación de invitados...');
        try {
            const doc = new jsPDF();
            
            doc.setFontSize(20);
            doc.setTextColor(27, 46, 29);
            doc.text(event?.title || 'Lista de Invitados', 14, 22);
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 30);

            const tableData = filteredGuests.map(g => [
                g.name,
                g.group_name || 'Individual',
                getGuestStatus(g) === 'yes' ? 'Confirmado' : getGuestStatus(g) === 'no' ? 'Declinado' : 'Pendiente',
                getGuestPax(g).toString(),
                g.checked_in_at ? 'SÍ' : 'NO'
            ]);

            autoTable(doc, {
                startY: 35,
                head: [['Invitado', 'Grupo', 'Estado', 'PAX', 'Check-in']],
                body: tableData,
                headStyles: { fillColor: [27, 46, 29] },
                alternateRowStyles: { fillColor: [253, 251, 247] },
                margin: { top: 35 }
            });

            // 1. Intentar descarga directa vía DataURI (Mejor para Desktop)
            const dataUri = doc.output('datauristring');
            const link = document.createElement('a');
            link.href = dataUri;
            link.download = `Invitados_${(event?.title || 'Evento').replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 2. Abrir en pestaña nueva (Mejor para Móvil y respaldo)
            // Usamos un timeout para no bloquear el hilo principal de UI
            setTimeout(() => {
                window.open(doc.output('bloburl'), '_blank');
            }, 100);
            
            toast.success('Reporte de invitados generado');
        } catch (error) {
            console.error('[ExportPDF] Error fatal:', error);
            toast.error('Error al generar PDF. Revisa la consola.');
        }
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

    // ── Add Guest Handler ──────────────────────────────────────────────
    const saveNewGuest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGuest.name.trim() || !eventId) return;
        setIsSavingGuest(true);
        try {
            const newToken = crypto.randomUUID();
            const insertData: any = {
                event_id: eventId,
                name: newGuest.name,
                group_name: newGuest.group_name || 'General',
                max_plus_ones: newGuest.max_plus_ones,
                phone: newGuest.phone,
                email: newGuest.email,
                guest_token: newToken,
                status: 'pending'
            };

            const { data, error } = await supabase.from('guests').insert([insertData]).select('*, rsvps(*), event:events(title, slug)');
            if (error) throw error;
            if (data && data.length > 0) {
                setGuests(prev => [data[0], ...prev]);
            }
            setNewGuest({ name: '', group_name: '', max_plus_ones: 0, phone: '', email: '' });
            setIsAddGuestOpen(false);
            toast.success('¡Invitado agregado con éxito!');
        } catch (error: any) {
            console.error('Error saving guest:', error);
            toast.error('Error al guardar invitado: ' + error.message);
        } finally {
            setIsSavingGuest(false);
        }
    };

    // ── CSV Import Handler ─────────────────────────────────────────────
    const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !eventId) return;
        const reader = new FileReader();
        reader.onload = async (e2) => {
            const buffer = e2.target?.result as ArrayBuffer;
            let text = '';
            
            const encodings = ['utf-8', 'windows-1252', 'iso-8859-15'];
            for (const encoding of encodings) {
                try {
                    const decoder = new TextDecoder(encoding, { fatal: true });
                    const decodedText = decoder.decode(buffer);
                    if (!decodedText.includes('\uFFFD')) {
                        text = decodedText;
                        break;
                    }
                } catch (_e) {
                    continue;
                }
            }

            if (!text) {
                text = new TextDecoder('windows-1252').decode(buffer);
            }
            
            if (text.startsWith('\uFEFF')) {
                text = text.substring(1);
            }

            const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
            if (lines.length < 2) {
                toast.error('El archivo está vacío o no tiene el formato correcto.');
                return;
            }

            const header = lines[0];
            const delimiter = header.includes(';') ? ';' : ',';
            const rows = lines.slice(1);

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const existingNames = new Set(guests.map(g => g.name.toLowerCase().trim()));
            const seenNamesInFile = new Set<string>();

            const rowErrors: string[] = [];
            const validGuests: any[] = [];

            rows.forEach((row, i) => {
                const lineNum = i + 2;
                const cols = row.split(delimiter).map(c => c.replace(/^["']|["']$/g, '').trim());
                
                const name = cols[0] || '';
                const group = cols[1] || 'General';
                const maxPlusOnes = parseInt(cols[2]) || 0;
                const phone = cols[3] || '';
                const email = cols[4] || '';

                if (!name) { 
                    rowErrors.push(`Fila ${lineNum}: El nombre es obligatorio.`); 
                    return; 
                }
                
                if (email && !emailRegex.test(email)) { 
                    rowErrors.push(`Fila ${lineNum} (${name}): El correo electrónico "${email}" no es válido.`); 
                    return; 
                }
                
                if (existingNames.has(name.toLowerCase())) { 
                    rowErrors.push(`Fila ${lineNum} (${name}): Este invitado ya existe en tu lista.`); 
                    return; 
                }
                
                if (seenNamesInFile.has(name.toLowerCase())) { 
                    rowErrors.push(`Fila ${lineNum} (${name}): El nombre está duplicado dentro del archivo.`); 
                    return; 
                }

                seenNamesInFile.add(name.toLowerCase());
                validGuests.push({
                    event_id: eventId,
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
                if (rowErrors.length > 0) {
                    setImportErrors(rowErrors);
                } else {
                    toast.error('No se encontró ningún invitado válido para importar.');
                }
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }

            try {
                const { data, error } = await supabase.from('guests').insert(validGuests).select('*, rsvps(*), event:events(title, slug)');
                if (error) throw error;
                
                if (data) {
                    setGuests(prev => [...data, ...prev]);
                    if (rowErrors.length > 0) {
                        setImportErrors(rowErrors);
                        toast.warning(`Se importaron ${data.length} invitados, pero hubo algunos problemas.`);
                    } else {
                        toast.success(`¡Éxito! Se importaron ${data.length} invitados correctamente.`);
                    }
                }
            } catch (err: any) {
                console.error('Error al importar:', err);
                toast.error('Hubo un error al guardar los invitados en la base de datos.');
            }
            
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsArrayBuffer(file);
    };

    // ── Bulk Selection & Delete ───────────────────────────────────────
    const toggleSelectGuest = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredGuests.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredGuests.map(g => g.id)));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        
        setIsDeletingBulk(true);
        const ids = Array.from(selectedIds);
        const deletedIds: string[] = [];
        const failedIds: string[] = [];

        try {
            console.log(`[BulkDelete] Starting deletion of ${ids.length} guests...`);
            // Process in sequential batches of 5 to avoid overwhelming the API
            for (let i = 0; i < ids.length; i += 5) {
                const batch = ids.slice(i, i + 5);
                const results = await Promise.all(
                    batch.map(async (id) => {
                        try {
                            // Exact same pattern as the working single handleDelete
                            const { error } = await supabase.from('guests').delete().eq('id', id);
                            if (error) {
                                console.error(`[BulkDelete] Error for guest ${id}:`, error);
                                return { id, success: false };
                            }
                            return { id, success: true };
                        } catch (e) {
                            console.error(`[BulkDelete] Exception for guest ${id}:`, e);
                            return { id, success: false };
                        }
                    })
                );
                results.forEach(r => {
                    if (r.success) deletedIds.push(r.id);
                    else failedIds.push(r.id);
                });
            }

            console.log(`[BulkDelete] Finished. Deleted: ${deletedIds.length}, Failed: ${failedIds.length}`);

            // Update UI
            if (deletedIds.length > 0) {
                const deletedSet = new Set(deletedIds);
                setGuests(prev => prev.filter(g => !deletedSet.has(g.id)));
            }
            
            setSelectedIds(new Set());
            setIsBulkConfirmOpen(false);

            if (failedIds.length === 0) {
                toast.success(`${deletedIds.length} invitado(s) eliminado(s).`);
            } else if (deletedIds.length > 0) {
                toast.warning(`${deletedIds.length} eliminado(s), ${failedIds.length} fallaron.`);
            } else {
                toast.error('No se pudo eliminar ningún invitado. Revisa la consola para más detalles.');
            }
        } catch (err: any) {
            console.error('[BulkDelete] Fatal error:', err);
            toast.error('Error crítico al eliminar: ' + (err.message || 'Error desconocido'));
        } finally {
            setIsDeletingBulk(false);
        }
    };

    const handleExportTablesPDF = () => {
        console.log('[ExportTables] Iniciando exportación de mesas...');
        try {
            const doc = new jsPDF();
            
            doc.setFontSize(20);
            doc.setTextColor(27, 46, 29);
            doc.text(`Distribución de Mesas - ${event?.title || 'Evento'}`, 14, 22);
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Reporte de asignación de asientos`, 14, 30);

            const tableData: any[] = [];
            tables.forEach(table => {
                const tableGuests = guests.filter(g => g.table_id === table.id);
                if (tableGuests.length === 0) {
                    tableData.push([{ content: table.name, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }, '(Mesa Vacía)', '0']);
                } else {
                    tableGuests.forEach((g, index) => {
                        tableData.push([
                            index === 0 ? { content: table.name, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } } : '',
                            g.name,
                            getGuestPax(g).toString()
                        ]);
                    });
                }
            });

            autoTable(doc, {
                startY: 35,
                head: [['Mesa', 'Invitado', 'PAX']],
                body: tableData,
                headStyles: { fillColor: [189, 116, 116] }, // #BD7474
                theme: 'grid',
                margin: { top: 35 }
            });

            // 1. Intentar descarga directa
            const dataUri = doc.output('datauristring');
            const link = document.createElement('a');
            link.href = dataUri;
            link.download = `Mesas_${(event?.title || 'Evento').replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // 2. Abrir en pestaña nueva
            setTimeout(() => {
                window.open(doc.output('bloburl'), '_blank');
            }, 100);

            toast.success('Reporte de mesas generado');
        } catch (error) {
            console.error('[ExportTables] Error fatal:', error);
            toast.error('Error al generar PDF de mesas.');
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
            {/* Hidden CSV Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImportCSV} 
                accept=".csv" 
                className="hidden" 
            />

            {/* Import Errors Modal */}
            {importErrors && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setImportErrors(null)} />
                    <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-stone-100 p-10 max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-8 flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                                    <AlertTriangle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif text-[#1B2E1D]">Reporte de Importación</h3>
                                    <p className="text-stone-400 text-[10px] uppercase font-bold tracking-widest mt-0.5">Problemas detectados al procesar el archivo</p>
                                </div>
                            </div>
                            <button onClick={() => setImportErrors(null)} className="h-10 w-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-300 hover:text-rose-500 transition-all">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-4 space-y-3">
                            {importErrors.map((err, idx) => (
                                <div key={idx} className="p-4 bg-stone-50 border border-stone-100 rounded-2xl flex gap-4 items-start">
                                    <div className="h-2 w-2 rounded-full bg-amber-300 mt-1.5 flex-shrink-0" />
                                    <p className="text-sm text-stone-600 leading-relaxed font-light">{err}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex-shrink-0">
                            <button 
                                onClick={() => setImportErrors(null)}
                                className="w-full py-5 bg-[#1B2E1D] text-white rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] shadow-xl hover:bg-black transition-all"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Guest Modal */}
            {isAddGuestOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-[#1B2E1D]/40 backdrop-blur-sm" onClick={() => setIsAddGuestOpen(false)} />
                    <div className="relative w-full max-w-2xl bg-white rounded-[3rem] p-10 sm:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-stone-100">
                        <div className="flex justify-between items-start mb-12">
                            <div className="space-y-2">
                                <h3 className="text-4xl font-serif text-[#1B2E1D]">Nuevo Invitado</h3>
                                <p className="text-stone-400 text-sm italic">Genera un enlace único de confirmación.</p>
                            </div>
                            <button onClick={() => setIsAddGuestOpen(false)} className="h-12 w-12 rounded-2xl bg-stone-50 text-stone-300 hover:text-rose-500 flex items-center justify-center transition-all">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={saveNewGuest} className="space-y-6">
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
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 ml-1">WhatsApp <span className="text-stone-300 font-normal lowercase">(opcional)</span></label>
                                    <input 
                                        type="tel" 
                                        className="w-full p-5 bg-[#FDFBF7] rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all text-[#1B2E1D]" 
                                        placeholder="Ej. +525512345678"
                                        value={newGuest.phone} 
                                        onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 ml-1">Email <span className="text-stone-300 font-normal lowercase">(opcional)</span></label>
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
                                <div className="flex items-center gap-6 bg-[#FDFBF7] p-4 rounded-2xl w-full sm:w-1/2">
                                    <button 
                                        type="button"
                                        onClick={() => setNewGuest({...newGuest, max_plus_ones: Math.max(0, newGuest.max_plus_ones - 1)})}
                                        className="h-12 w-12 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-xl text-stone-500 hover:bg-stone-100 transition-colors shadow-sm"
                                    >
                                        -
                                    </button>
                                    <div className="flex-1 text-center">
                                        <span className="text-2xl font-serif font-bold text-[#1B2E1D]">{newGuest.max_plus_ones}</span>
                                        <p className="text-[9px] uppercase tracking-tighter text-stone-300 font-bold">Adicionales</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setNewGuest({...newGuest, max_plus_ones: newGuest.max_plus_ones + 1})}
                                        className="h-12 w-12 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-xl text-stone-500 hover:bg-stone-100 transition-colors shadow-sm"
                                    >
                                        +
                                    </button>
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
                                ) : 'Guardar y Generar Enlace'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
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
                        
                        {isEventDashboard && (
                            <>
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
                            </>
                        )}
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        {isEventDashboard && (
                            <>
                                <button 
                                    onClick={shareOnWhatsApp}
                                    className="flex-1 sm:flex-none px-8 h-10 bg-[#25D366] text-white rounded-[1.5rem] text-[9px] uppercase font-black tracking-widest shadow-lg shadow-emerald-100/50 flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all"
                                >
                                    <MessageSquare className="h-4 w-4" /> <span>Compartir</span>
                                </button>
                                {hasFeature('access_control') && (
                                    <Link 
                                        to={`/dashboard/checkin/${event.id}`}
                                        className="flex-1 sm:flex-none px-8 h-10 bg-[#1B2E1D] text-white rounded-[1.5rem] text-[9px] uppercase font-black tracking-widest shadow-lg shadow-stone-200/50 flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all border border-white/10"
                                    >
                                        <QrCode className="h-4 w-4 text-[#BD7474]" /> <span>Check-in</span>
                                    </Link>
                                )}
                            </>
                        )}
                        {/* Download removed from here as per user request */}
                    </div>
                </div>
            </div>

            {/* Event Hero Profile - Condicional */}
            {isEventDashboard && (
                <div className="bg-white rounded-[2rem] md:rounded-[4rem] border border-stone-100 p-6 md:p-20 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[30rem] md:w-[50rem] h-[30rem] md:h-[50rem] bg-stone-50 rounded-full -translate-y-1/2 translate-x-1/3 -z-0 group-hover:bg-[#BD7474]/5 transition-colors duration-1000" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10 md:gap-16">
                        <div className="space-y-6 md:space-y-12 flex-1">
                            <div className="flex flex-wrap items-center gap-2 md:gap-4">
                                <span className="px-3 md:px-6 py-1 md:py-2 bg-[#BD7474]/10 text-[#BD7474] text-[7px] md:text-[10px] uppercase font-black tracking-[0.3em] md:tracking-[0.4em] rounded-full">
                                    {event.event_type}
                                </span>
                                <span className={`flex items-center gap-2 px-3 md:px-5 py-1 md:py-2 ${percentConfirmed > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-50 text-stone-300'} rounded-full text-[7px] md:text-[9px] uppercase font-black tracking-widest`}>
                                    <div className={`h-1 w-1 md:h-1.5 md:w-1.5 rounded-full ${percentConfirmed > 0 ? 'bg-emerald-500 animate-pulse outline outline-4 outline-emerald-100' : 'bg-stone-200'}`} />
                                    {percentConfirmed}% Conf.
                                </span>
                            </div>

                            <div className="space-y-2 md:space-y-4">
                                <h1 className="text-3xl xs:text-4xl sm:text-7xl lg:text-8xl font-serif text-[#1B2E1D] tracking-tighter leading-tight md:leading-[0.8] mb-2 break-words">{event.title}</h1>
                                <p className="text-sm md:text-2xl text-stone-400 font-light italic flex items-center gap-2 md:gap-4 ml-0.5 md:ml-2">
                                    <MapPin className="h-4 w-4 md:h-6 md:w-6 text-[#BD7474]" /> <span className="truncate">{event.venue_name || 'Ubicación Premium'}</span>
                                </p>
                            </div>

                            {/* Event Timeline & RSVP Deadline Block */}
                            {(() => {
                                const deadlineDate = event.rsvp_deadline ? new Date(event.rsvp_deadline) : null;
                                const daysRemaining = deadlineDate ? differenceInDays(deadlineDate, new Date()) : null;
                                const isDeadlinePassed = deadlineDate ? isPast(deadlineDate) : false;

                                return (
                                    <div className="grid grid-cols-2 lg:flex lg:items-center gap-4 md:gap-8 pt-6 md:pt-10 border-t border-stone-50">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] md:text-[10px] uppercase font-bold tracking-[0.2em] text-stone-300">Fecha</p>
                                            <p className="text-xs md:text-base font-bold text-[#1B2E1D] truncate">{event.date_time ? new Date(event.date_time).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Próximamente'}</p>
                                        </div>
                                        <div className="h-10 w-px bg-stone-100 hidden lg:block" />
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] md:text-[10px] uppercase font-bold tracking-[0.2em] text-stone-300">Cierre</p>
                                            <p className="text-xs md:text-base font-bold text-[#BD7474] truncate">
                                                {deadlineDate ? deadlineDate.toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Sin definir'}
                                            </p>
                                        </div>
                                        
                                        {deadlineDate && (
                                            <>
                                                <div className="h-10 w-px bg-stone-100 hidden lg:block" />
                                                <div className="col-span-2 lg:col-span-1">
                                                    {isDeadlinePassed ? (
                                                        <span className="px-3 py-1.5 w-fit bg-red-50 text-red-600 rounded-lg text-[8px] md:text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5">
                                                            <AlertTriangle className="h-3 w-3" /> Vencido
                                                        </span>
                                                    ) : daysRemaining !== null && daysRemaining <= 14 ? (
                                                        <span className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-[8px] md:text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 border border-orange-100 shadow-sm animate-pulse w-fit">
                                                            <Clock className="h-3 w-3 text-orange-500" /> {daysRemaining} Días rest.
                                                        </span>
                                                    ) : daysRemaining !== null && (
                                                        <span className="px-3 py-1.5 w-fit bg-emerald-50 text-emerald-600 rounded-lg text-[8px] md:text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5">
                                                            <Check className="h-3 w-3" /> {daysRemaining} días
                                                        </span>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="lg:w-96 space-y-6 md:space-y-8">
                            {/* Visual Progress Bar Card */}
                            <div className="p-6 md:p-8 bg-[#FDFBF7] rounded-[2rem] md:rounded-[2.5rem] border border-stone-100 shadow-sm space-y-4 md:space-y-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-[9px] md:text-[11px] uppercase font-black tracking-[0.3em] text-[#1B2E1D]">Asistencia</span>
                                    <div className="text-right">
                                        <span className="text-2xl md:text-4xl font-serif text-[#1B2E1D]">{metrics.confirmados}</span>
                                        <span className="text-sm md:text-lg font-serif text-stone-300 ml-1">/{metrics.totalInvitados}</span>
                                    </div>
                                </div>
                                <div className="h-2 md:h-2.5 w-full bg-stone-100 rounded-full overflow-hidden p-0.5">
                                    <div 
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                        style={{ width: `${percentConfirmed}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-center gap-2 text-stone-400">
                                    <Users className="h-3 w-3" />
                                    <p className="text-[8px] md:text-[10px] uppercase font-bold tracking-widest italic">{metrics.totalInvitados === 0 ? 'Sin invitados' : 'En tiempo real'}</p>
                                </div>
                            </div>

                            <button onClick={copyGeneralLink} className="group w-full h-14 md:h-16 bg-[#1B2E1D] text-white rounded-2xl md:rounded-[2rem] flex items-center justify-center gap-3 md:gap-4 text-[9px] md:text-[10px] uppercase font-bold tracking-[0.3em] md:tracking-[0.4em] hover:bg-[#2C482F] transition-all shadow-xl hover:translate-y-[-4px]">
                                <Copy className="h-4 w-4 group-hover:scale-110 transition-transform" /> <span>Copiar Link</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                {[
                    { label: 'Total', value: metrics.totalInvitados, color: 'text-stone-900' },
                    { label: 'Confirm.', value: metrics.confirmados, color: 'text-emerald-500' },
                    { label: 'Check-in', value: metrics.ingresados, color: 'text-blue-500' },
                    { label: 'Pend.', value: metrics.pendientes, color: 'text-amber-500' },
                    { label: 'Decl.', value: metrics.noAsistiran, color: 'text-rose-500' },
                ].map(m => (
                    <div key={m.label} className="bg-white p-4 md:p-6 rounded-[1.2rem] md:rounded-[1.5rem] border border-stone-100 shadow-sm">
                        <p className="text-[7px] md:text-[8px] uppercase font-bold text-stone-400 mb-1 md:mb-2">{m.label}</p>
                        <p className={`text-xl md:text-2xl font-serif ${m.color}`}>{m.value}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-stone-100 gap-6 overflow-x-auto pb-1">
                {[
                    { id: 'list', label: 'Lista', feature: null },
                    { id: 'statistics', label: 'Estadísticas', feature: 'metrics_dashboard' },
                    { id: 'messages', label: 'Mensajes', feature: 'guest_dashboard' },
                    { id: 'tables', label: 'Mesas', feature: 'table_management' },
                    { id: 'reminders', label: 'Avisos', feature: 'reminders_automatic' }
                ].map(t => {
                    const isLocked = t.feature ? !hasFeature(t.feature as any) : false;
                    
                    return (
                        <button 
                            key={t.id} 
                            onClick={() => !isLocked && setActiveTab(t.id as any)} 
                            className={`pb-4 text-[10px] uppercase font-bold tracking-widest relative flex items-center gap-2 ${
                                activeTab === t.id ? 'text-[#1B2E1D]' : 'text-stone-300'
                            } ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            {t.label}
                            {isLocked && <span className="text-[8px] bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded-full">PRO</span>}
                            {activeTab === t.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B2E1D]" />}
                        </button>
                    );
                })}
            </div>

            {/* Content Rendering */}
            {activeTab === 'list' && (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                        <button 
                            onClick={() => setIsAddGuestOpen(!isAddGuestOpen)} 
                            className="w-full sm:w-auto px-6 md:px-8 h-14 md:h-16 bg-[#BD7474] text-white rounded-2xl md:rounded-[2.5rem] text-[9px] md:text-[10px] uppercase font-black tracking-widest shadow-lg shadow-rose-100/50 hover:bg-[#A65B5B] transition-all flex items-center justify-center gap-3"
                        >
                            <UserPlus className="h-4 w-4 md:h-5 md:w-5" /> <span>Nueva Invitación</span>
                        </button>
                        <button 
                            onClick={() => {
                                if (!hasFeature('guest_import_excel')) {
                                    toast.error('La importación masiva no está disponible en el plan Clásico. Sube de plan para habilitar esta función.');
                                    return;
                                }
                                fileInputRef.current?.click();
                            }}
                            className={`w-full sm:w-auto px-6 md:px-8 h-14 md:h-16 border-2 border-dashed rounded-2xl md:rounded-[2.5rem] text-[9px] md:text-[10px] uppercase font-black tracking-widest shadow-sm flex items-center justify-center gap-3 transition-all ${
                                hasFeature('guest_import_excel') 
                                    ? 'bg-white text-[#1B2E1D] border-stone-200 hover:border-[#1B2E1D] hover:bg-stone-50' 
                                    : 'bg-stone-50 text-stone-300 border-stone-100 cursor-not-allowed opacity-60'
                            }`}
                        >
                            <Upload className="h-4 w-4 md:h-5 md:w-5" /> 
                            <span>Importar CSV</span>
                            {!hasFeature('guest_import_excel') && <span className="text-[8px] bg-[#BD7474] text-white px-1.5 py-0.5 rounded-full ml-1">PRO</span>}
                        </button>
                    </div>

                    {/* Search & Filters */}
                    <div className="flex flex-col lg:flex-row gap-4 justify-between bg-white p-4 md:p-6 rounded-[2rem] border border-stone-100 shadow-sm">
                        <div className="relative w-full lg:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-300" />
                            <input type="text" placeholder="Buscar por nombre o grupo..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-stone-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all" />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <div className="flex overflow-x-auto pb-1 sm:pb-0 gap-2 no-scrollbar flex-1 lg:flex-none">
                                {[
                                    { id: 'all', label: 'Todos', color: 'bg-stone-50 text-stone-400' },
                                    { id: 'yes', label: 'Conf.', color: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
                                    { id: 'pending', label: 'Pend.', color: 'bg-amber-50 text-amber-600 border border-amber-100' },
                                    { id: 'no', label: 'Decl.', color: 'bg-rose-50 text-rose-600 border border-rose-100' }
                                ].map(f => (
                                    <button 
                                        key={f.id} 
                                        onClick={() => setStatusFilter(f.id as any)} 
                                        className={`flex-none px-4 py-2.5 rounded-xl text-[7px] sm:text-[8px] uppercase font-bold tracking-widest transition-all ${
                                            statusFilter === f.id 
                                            ? (f.id === 'all' ? 'bg-[#1B2E1D] text-white shadow-md' : f.color.replace('bg-', 'bg-').split(' ')[0] + ' ' + f.color.split(' ')[1] + ' ring-2 ring-offset-1 ring-[#1B2E1D]/10 shadow-md')
                                            : 'bg-stone-50 text-stone-400 opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2 ml-auto">
                                <button onClick={handleExportPDF} className="h-10 w-10 sm:h-11 sm:w-11 bg-stone-50 rounded-xl text-stone-400 hover:text-[#1B2E1D] flex items-center justify-center transition-colors" title="Exportar PDF">
                                    <Download className="h-4 w-4" />
                                </button>
                                <button onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')} className="h-10 w-10 sm:h-11 sm:w-11 bg-stone-50 rounded-xl text-stone-400 flex items-center justify-center transition-colors">
                                    {viewMode === 'table' ? <LayoutDashboard className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bulk Actions Bar */}
                    {selectedIds.size > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between bg-rose-50 border border-rose-100 p-4 md:p-6 rounded-[2rem] shadow-md animate-in slide-in-from-top-4 duration-500 gap-4">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="h-10 w-10 md:h-12 md:w-12 bg-rose-100 rounded-xl md:rounded-2xl flex items-center justify-center text-rose-600 font-bold text-base md:text-lg">
                                    {selectedIds.size}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] md:text-xs text-rose-700 font-bold uppercase tracking-widest">Seleccionados</span>
                                    <span className="text-xs md:text-sm text-rose-600/70 italic">
                                        {isBulkConfirmOpen ? '¿Estás seguro de eliminar?' : 'Acción en bloque disponible'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                {isBulkConfirmOpen ? (
                                    <>
                                        <button 
                                            onClick={() => setIsBulkConfirmOpen(false)}
                                            className="flex-1 sm:flex-none px-6 py-3 bg-white text-stone-500 rounded-xl text-[9px] uppercase font-bold tracking-widest border border-stone-200 hover:bg-stone-50 transition-all"
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            onClick={handleBulkDelete}
                                            disabled={isDeletingBulk}
                                            className="flex-1 sm:flex-none px-6 py-3 bg-rose-600 text-white rounded-xl text-[9px] uppercase font-bold tracking-widest shadow-lg shadow-rose-200/50 hover:bg-rose-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                        >
                                            {isDeletingBulk ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Confirmar'}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => { setSelectedIds(new Set()); setIsBulkConfirmOpen(false); }}
                                            className="flex-1 sm:flex-none px-6 py-3 bg-white text-stone-500 rounded-xl text-[9px] uppercase font-bold tracking-widest border border-stone-200 hover:bg-stone-50 transition-all"
                                        >
                                            Limpiar
                                        </button>
                                        <button 
                                            onClick={() => setIsBulkConfirmOpen(true)}
                                            className="flex-1 sm:flex-none px-6 py-3 bg-rose-600 text-white rounded-xl text-[9px] uppercase font-bold tracking-widest shadow-lg shadow-rose-200/50 hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" /> Eliminar
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden">
                        {viewMode === 'table' ? (
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[#FDFBF7] border-b border-stone-100 text-[10px] uppercase font-bold text-stone-400">
                                        <tr>
                                            <th className="px-4 py-6 w-12">
                                                <button 
                                                    onClick={toggleSelectAll}
                                                    className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                                        selectedIds.size > 0 && selectedIds.size === filteredGuests.length
                                                            ? 'bg-[#1B2E1D] border-[#1B2E1D] text-white'
                                                            : selectedIds.size > 0 
                                                                ? 'bg-[#1B2E1D]/30 border-[#1B2E1D] text-white'
                                                                : 'bg-white border-stone-200 text-transparent hover:border-stone-400'
                                                    }`}
                                                >
                                                    <Check className="h-3 w-3" />
                                                </button>
                                            </th>
                                            <th className="px-8 py-6">Invitado</th>
                                            <th className="px-8 py-6">Grupo</th>
                                            <th className="px-8 py-6 text-center">Enviado</th>
                                            <th className="px-8 py-6 text-center">Estado</th>
                                            <th className="px-8 py-6 text-center">Pax Total</th>
                                            {hasFeature('access_control') && <th className="px-8 py-6 text-center">Ingreso</th>}
                                            {hasFeature('table_management') && <th className="px-8 py-6 text-center">Mesa</th>}
                                            {hasFeature('access_control') && <th className="px-8 py-6 text-center">QR</th>}
                                            {isManageMode && <th className="px-8 py-6 text-center">Acciones</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-50">
                                        {filteredGuests.map(g => (
                                            <tr key={g.id} className={`transition-all ${selectedIds.has(g.id) ? 'bg-rose-50/50' : 'hover:bg-stone-50/50'}`}>
                                                <td className="px-4 py-6">
                                                    <button 
                                                        onClick={() => toggleSelectGuest(g.id)}
                                                        className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                                            selectedIds.has(g.id)
                                                                ? 'bg-[#1B2E1D] border-[#1B2E1D] text-white'
                                                                : 'bg-white border-stone-200 text-transparent hover:border-stone-400'
                                                        }`}
                                                    >
                                                        <Check className="h-3 w-3" />
                                                    </button>
                                                </td>
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
                                                     {editingGuestId === g.id ? (
                                                         <div className="flex flex-col items-center gap-1 group/pax">
                                                             <input 
                                                                 type="number" 
                                                                 min="1"
                                                                 value={editData.max_plus_ones + 1}
                                                                 onChange={e => {
                                                                     const total = parseInt(e.target.value) || 1;
                                                                     setEditData({...editData, max_plus_ones: Math.max(0, total - 1)});
                                                                 }}
                                                                 className="w-14 text-center border border-stone-200 rounded py-1 text-sm bg-white focus:ring-1 focus:ring-[#1B2E1D] outline-none"
                                                             />
                                                             <span className="text-[7px] text-stone-300 uppercase tracking-tighter">Personas</span>
                                                         </div>
                                                     ) : (
                                                         getGuestPax(g)
                                                     )}
                                                 </td>
                                                {hasFeature('access_control') && (
                                                    <td className="px-8 py-6 text-center text-xs text-stone-400">
                                                        {g.checked_in_at ? new Date(g.checked_in_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                                                    </td>
                                                )}
                                                {hasFeature('table_management') && (
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
                                                )}
                                                {hasFeature('access_control') && (
                                                    <td className="px-8 py-6 text-center">
                                                        <button onClick={() => setSelectedGuestForQR(g)} className="p-2 text-stone-300 hover:text-[#1B2E1D]"><QrCode className="h-4 w-4" /></button>
                                                    </td>
                                                )}
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
                                                                 <button onClick={() => { 
                                                                     setEditingGuestId(g.id); 
                                                                     setEditData({ 
                                                                         name: g.name, 
                                                                         group_name: g.group_name || '', 
                                                                         status: getGuestStatus(g), 
                                                                         plus_ones_confirmed: g.rsvps?.[0]?.plus_ones_confirmed || 0, 
                                                                         max_plus_ones: g.max_plus_ones || 0,
                                                                         table_id: g.table_id || '' 
                                                                     }); 
                                                                 }} className="p-2 text-stone-300 hover:text-[#1B2E1D]" title="Editar"><Edit2 className="h-4 w-4" /></button>
                                                                <button onClick={() => handleDelete(g.id)} className="p-2 text-stone-300 hover:text-rose-500" title="Eliminar"><Trash2 className="h-4 w-4" /></button>
                                                            </div>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="md:hidden p-8 text-center text-stone-400 italic text-sm">
                                    Esta vista no es óptima para móviles. Cambia a vista de tarjetas arriba.
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 sm:p-8 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {filteredGuests.map(g => {
                                    const rsvp = g.rsvps?.[0];
                                    const status = getGuestStatus(g);
                                    const cardStyles = status === 'yes' 
                                        ? 'border-emerald-100 bg-emerald-50/10' 
                                        : status === 'no' 
                                            ? 'border-rose-100 bg-rose-50/10' 
                                            : 'border-stone-100 bg-white';

                                    return (
                                        <div key={g.id} className={`${cardStyles} p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border shadow-sm space-y-4 hover:shadow-md transition-all relative group/card`}>
                                            <div className="absolute top-4 left-4">
                                                <button 
                                                    onClick={() => toggleSelectGuest(g.id)}
                                                    className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                                        selectedIds.has(g.id)
                                                            ? 'bg-[#1B2E1D] border-[#1B2E1D] text-white'
                                                            : 'bg-white border-stone-200 text-transparent group-hover/card:border-stone-300'
                                                    }`}
                                                >
                                                    <Check className="h-3 w-3" />
                                                </button>
                                            </div>
                                            
                                            <div className="flex justify-between items-start pt-2">
                                                <div className="pl-8">
                                                    <h4 className="font-serif text-base sm:text-lg text-[#1B2E1D] leading-tight mb-1">{g.name}</h4>
                                                    <p className="text-[7px] sm:text-[8px] uppercase font-bold text-stone-300 tracking-widest">{g.group_name || 'Individual'}</p>
                                                </div>
                                                <div className="relative inline-flex items-center group">
                                                    <select
                                                        value={status}
                                                        onChange={(e) => { e.stopPropagation(); handleQuickStatusToggle(g, e.target.value); }}
                                                        title="Cambiar estado"
                                                        className={`appearance-none outline-none pl-3 pr-6 py-1 rounded-full border text-[7px] sm:text-[8px] font-bold cursor-pointer transition-transform group-hover:scale-105 shadow-sm ${getStatusStyles(status)}`}
                                                    >
                                                        <option value="pending" className="text-amber-600 bg-white">PENDIENTE</option>
                                                        <option value="yes" className="text-emerald-600 bg-white">CONFIRMADO</option>
                                                        <option value="no" className="text-rose-600 bg-white">DECLINADO</option>
                                                    </select>
                                                    <ChevronDown className={`absolute right-2 h-3 w-3 pointer-events-none transition-transform group-hover:scale-110 ${getStatusStyles(status).split(' ')[1]}`} />
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-2 py-3 text-center text-stone-500 border-y border-stone-100/30">
                                                <div className="flex flex-col opacity-80">
                                                    <span className="text-[7px] uppercase font-bold tracking-widest text-[#1B2E1D] mb-0.5">Pax</span>
                                                    <span className="text-sm font-bold text-stone-700">{getGuestPax(g)}</span>
                                                </div>
                                                <div className="flex flex-col opacity-80 border-x border-stone-100/50">
                                                    <span className="text-[7px] uppercase font-bold tracking-widest text-[#1B2E1D] mb-0.5">Ingreso</span>
                                                    <span className="text-[10px] font-serif font-medium text-stone-600">{g.checked_in_at ? new Date(g.checked_in_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}</span>
                                                </div>
                                                <div className="flex flex-col opacity-80">
                                                    <span className="text-[7px] uppercase font-bold tracking-widest text-[#1B2E1D] mb-0.5">Mesa</span>
                                                    <span className="text-[10px] font-bold text-stone-700 truncate px-1">
                                                        {g.table_id ? (tables.find(t => t.id === g.table_id)?.name || '-') : '-'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        onClick={() => handleToggleSent(g)}
                                                        className={`h-6 w-6 rounded-lg border flex items-center justify-center transition-all ${
                                                            g.invitation_sent_at 
                                                                ? 'bg-[#1B2E1D] border-[#1B2E1D] text-white shadow-md' 
                                                                : 'bg-white border-stone-200 text-stone-300 hover:border-[#1B2E1D]'
                                                        }`}
                                                        title="Marcar enviado"
                                                    >
                                                        <Check className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleSendReminder(g)} 
                                                        className={`h-6 w-6 rounded-lg border border-stone-200 flex items-center justify-center transition-all hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 text-stone-400`}
                                                        title="WhatsApp"
                                                    >
                                                        <MessageSquare className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => setSelectedGuestForQR(g)} className="p-2 text-stone-300 hover:text-[#1B2E1D] transition-colors">
                                                        <QrCode className="h-4 w-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setEditingGuestId(g.id);
                                                            setEditData({
                                                                name: g.name,
                                                                group_name: g.group_name || '',
                                                                status: status,
                                                                plus_ones_confirmed: rsvp?.plus_ones_confirmed || 0,
                                                                max_plus_ones: g.max_plus_ones || 0,
                                                                table_id: g.table_id || ''
                                                            });
                                                        }}
                                                        className="p-2 text-stone-300 hover:text-blue-500 transition-colors"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(g.id)} className="p-2 text-stone-300 hover:text-rose-500 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
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
                    <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h3 className="font-serif text-xl">Distribución de Mesas</h3>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button 
                                onClick={handleExportTablesPDF}
                                className="flex-1 sm:flex-none px-6 py-3 bg-white border border-stone-200 text-stone-600 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:border-[#1B2E1D] transition-all"
                            >
                                <Download className="h-4 w-4" /> Exportar PDF
                            </button>
                            <button 
                                onClick={() => setIsAddingTable(!isAddingTable)} 
                                className="flex-1 sm:flex-none px-6 py-3 bg-[#BD7474] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#A65B5B] transition-all"
                            >
                                {isAddingTable ? 'Cancelar' : 'Nueva Mesa'}
                            </button>
                        </div>
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
