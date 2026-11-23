import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useSearchParams, Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
    Check, X, MessageSquare, Download, 
    Trash2, Edit2, Save, QrCode, Send as SendIcon, Users,
    Search, LayoutDashboard, Copy, ArrowLeft, ChevronDown,
    Clock, MapPin, Eye, AlertTriangle, UserPlus, Upload, Loader2, Palette, Crown, Calendar
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis } from 'recharts';
import { differenceInDays, isPast } from 'date-fns';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import { EVENT_TYPE_OPTIONS } from '../EventWizard';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper: Formatear tipo de evento a etiqueta en español
function formatEventType(type?: string): string {
    if (!type) return 'Evento';
    const found = EVENT_TYPE_OPTIONS.find(opt => opt.id === type || opt.label.toLowerCase() === type.toLowerCase());
    if (found) return found.label;
    if (type.toLowerCase() === 'gender_reveal') return 'Revelación de Género';
    if (type.toLowerCase() === 'birthday') return 'Cumpleaños';
    if (type.toLowerCase() === 'wedding') return 'Boda';
    if (type.toLowerCase() === 'xv') return 'XV Años';
    return type.charAt(0).toUpperCase() + type.slice(1);
}

// Helper: Formatear fecha con locale es-MX ("11 de diciembre de 2026")
function formatEventDate(dateVal?: string | Date | null): string {
    if (!dateVal) return 'Sin definir';
    try {
        const d = typeof dateVal === 'string' ? new Date(dateVal) : dateVal;
        if (isNaN(d.getTime())) return 'Sin definir';
        return d.toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch {
        return 'Sin definir';
    }
}

const EventRSVPs: React.FC = () => {
    const { id: routeEventId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const eventIdFromUrl = searchParams.get('event');
    const [eventId, setEventId] = useState<string | null>(routeEventId || eventIdFromUrl);
    const [guests, setGuests] = useState<any[]>([]);
    const [event, setEvent] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [isManageMode] = useState(true);
    const [activeTab, setActiveTab] = useState<'list' | 'messages' | 'tables' | 'reminders' | 'statistics'>('list');
    const [userEvents, setUserEvents] = useState<any[]>([]);
    const [reminderTemplate] = useState('¡Hola {nombre}! 🌟 Te escribimos para recordarte la invitación a "{evento}". \n\nPuedes ver todos los detalles y confirmar aquí: {link} \n\n¡Te esperamos!');
    const [tables, setTables] = useState<any[]>([]);
    const [proModalFeature, setProModalFeature] = useState<string | null>(null);

    // Se muestra el dashboard de evento y sus botones de acción siempre que haya un evento seleccionado
    const isEventDashboard = Boolean(event);
    
    // Inline Edit State
    const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
    const [editData, setEditData] = useState({ name: '', group_name: '', status: '', plus_ones_confirmed: 0, max_plus_ones: 0, table_id: '' });
    const [selectedGuestForQR, setSelectedGuestForQR] = useState<any | null>(null);

    // Filters & Views
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'yes' | 'no'>('all');
    const [viewMode, setViewMode] = useState<'table' | 'cards'>( (typeof window !== 'undefined' && window.innerWidth < 1024) ? 'cards' : 'table');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, pageSize]);

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

                // Fuente de evento: 1) useParams (:id), 2) ?event=, 3) localStorage, 4) primer evento
                let activeId = routeEventId || eventIdFromUrl;
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
    }, [routeEventId, eventIdFromUrl, user]);

    const handleEventChange = (id: string) => {
        if (!id) return;
        setEventId(id);
        if (user) {
            localStorage.setItem(`last_managed_event_id_${user.id}`, id);
        }
        navigate(`/dashboard/events/${id}`);
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
            case 'yes': return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
            case 'no': return 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
            default: return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
        }
    };

    const filteredGuests = guests.filter(g => {
        const status = getGuestStatus(g);
        const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (g.group_name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const effectivePageSize = pageSize === -1 ? (filteredGuests.length || 1) : pageSize;
    const totalPages = Math.max(1, Math.ceil(filteredGuests.length / effectivePageSize));
    const startIndex = pageSize === -1 ? 0 : (currentPage - 1) * pageSize;
    const paginatedGuests = pageSize === -1 ? filteredGuests : filteredGuests.slice(startIndex, startIndex + pageSize);

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
                headStyles: { fillColor: [223, 59, 148] },
                alternateRowStyles: { fillColor: [248, 249, 250] },
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
            <h2 className="text-2xl font-display font-extrabold mb-4">Selecciona un evento para gestionar</h2>
            <select value={eventId || ''} onChange={(e) => handleEventChange(e.target.value)} className="p-3 border border-stone-200 rounded-xl outline-none">
                <option value="">Seleccionar...</option>
                {userEvents.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
            </select>
        </div>
    );


    const percentConfirmed = metrics.totalInvitados > 0 ? Math.round((metrics.confirmados / metrics.totalInvitados) * 100) : 0;

    return (
        <div className="space-y-6 sm:space-y-8">
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
                                    <h3 className="text-2xl font-display font-extrabold text-[#222B38]">Reporte de Importación</h3>
                                    <p className="text-stone-600 text-[10px] uppercase font-bold tracking-widest mt-0.5">Problemas detectados al procesar el archivo</p>
                                </div>
                            </div>
                            <button onClick={() => setImportErrors(null)} className="h-10 w-10 bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center text-stone-500 hover:text-stone-900 transition-all">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-4 space-y-3">
                            {importErrors.map((err, idx) => (
                                <div key={idx} className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex gap-4 items-start">
                                    <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                                    <p className="text-sm text-stone-800 leading-relaxed font-medium">{err}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex-shrink-0">
                            <button 
                                onClick={() => setImportErrors(null)}
                                className="w-full py-5 bg-[#DF3B94] text-white rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] shadow-xl hover:bg-black transition-all"
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
                    <div className="absolute inset-0 bg-[#DF3B94]/40 backdrop-blur-sm" onClick={() => setIsAddGuestOpen(false)} />
                    <div className="relative w-full max-w-2xl bg-white rounded-[3rem] p-10 sm:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-stone-200">
                        <div className="flex justify-between items-start mb-12">
                            <div className="space-y-2">
                                <h3 className="text-4xl font-display font-extrabold text-[#222B38]">Nuevo Invitado</h3>
                                <p className="text-stone-600 text-sm italic font-medium">Genera un enlace único de confirmación.</p>
                            </div>
                            <button onClick={() => setIsAddGuestOpen(false)} className="h-12 w-12 rounded-2xl bg-stone-100 border border-stone-200 text-stone-500 hover:text-stone-900 flex items-center justify-center transition-all">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={saveNewGuest} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-700 ml-1">Nombre del Invitado</label>
                                    <input 
                                        type="text" 
                                        required 
                                        autoFocus
                                        className="w-full p-5 bg-[#F8F9FA] rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] transition-all text-[#222B38] placeholder:text-stone-400 text-lg font-display font-extrabold" 
                                        placeholder="Ej. Sofía Velázquez"
                                        value={newGuest.name} 
                                        onChange={(e) => setNewGuest({...newGuest, name: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-700 ml-1">Grupo / Familia</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-5 bg-[#F8F9FA] rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] transition-all text-[#222B38] placeholder:text-stone-400 font-medium" 
                                        placeholder="Ej. Familia Velázquez"
                                        value={newGuest.group_name} 
                                        onChange={(e) => setNewGuest({...newGuest, group_name: e.target.value})} 
                                    />
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-700 ml-1">WhatsApp <span className="text-stone-500 font-normal lowercase">(opcional)</span></label>
                                    <input 
                                        type="tel" 
                                        className="w-full p-5 bg-[#F8F9FA] rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] transition-all text-[#222B38] placeholder:text-stone-400" 
                                        placeholder="Ej. +525512345678"
                                        value={newGuest.phone} 
                                        onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-700 ml-1">Email <span className="text-stone-500 font-normal lowercase">(opcional)</span></label>
                                    <input 
                                        type="email" 
                                        className="w-full p-5 bg-[#F8F9FA] rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] transition-all text-[#222B38] placeholder:text-stone-400" 
                                        placeholder="Ej. juan@correo.com"
                                        value={newGuest.email} 
                                        onChange={(e) => setNewGuest({...newGuest, email: e.target.value})} 
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-700 ml-1">Acompañantes Adicionales</label>
                                <div className="flex items-center gap-6 bg-[#F8F9FA] p-4 rounded-2xl w-full sm:w-1/2 border border-stone-200">
                                    <button 
                                        type="button" 
                                        onClick={() => setNewGuest({...newGuest, max_plus_ones: Math.max(0, newGuest.max_plus_ones - 1)})}
                                        className="h-12 w-12 rounded-xl bg-white border border-stone-300 flex items-center justify-center text-xl font-bold text-stone-700 hover:bg-stone-100 transition-colors shadow-sm"
                                    >
                                        -
                                    </button>
                                    <div className="flex-1 text-center">
                                        <span className="text-2xl font-display font-black text-[#222B38]">{newGuest.max_plus_ones}</span>
                                        <p className="text-[9px] uppercase tracking-wider text-stone-600 font-bold">Adicionales</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => setNewGuest({...newGuest, max_plus_ones: newGuest.max_plus_ones + 1})}
                                        className="h-12 w-12 rounded-xl bg-white border border-stone-300 flex items-center justify-center text-xl font-bold text-stone-700 hover:bg-stone-100 transition-colors shadow-sm"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSavingGuest}
                                className="w-full py-6 bg-[#DF3B94] text-white rounded-2xl text-[11px] uppercase font-bold tracking-[0.3em] shadow-2xl hover:bg-[#C52A7C] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
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
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#DF3B94]">Evento</p>
                    <div className="relative inline-block w-full sm:w-auto">
                        <select 
                            value={eventId || ''} 
                            onChange={(e) => handleEventChange(e.target.value)} 
                            className="w-full sm:w-auto pr-8 text-xl sm:text-2xl md:text-3xl font-display font-black text-[#222B38] bg-transparent outline-none border-b border-stone-200 focus:border-[#DF3B94] transition-all cursor-pointer py-1 truncate"
                        >
                            {userEvents.map(ev => (
                                <option key={ev.id} value={ev.id} className="text-base font-sans text-stone-900">
                                    {ev.title}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="h-4 w-4 text-stone-400 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {isEventDashboard && event && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
                        {/* Fila superior en celular con iconos + texto corto */}
                        <div className="grid grid-cols-4 sm:flex items-center gap-1.5 sm:gap-2 bg-white p-1 rounded-2xl border border-stone-200 shadow-xs">
                            <Link 
                                to="/dashboard" 
                                className="h-11 min-h-[44px] px-2.5 sm:px-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all whitespace-nowrap"
                                title="Volver a mis eventos"
                                aria-label="Volver"
                            >
                                <ArrowLeft className="h-4 w-4 shrink-0" />
                                <span className="hidden sm:inline">Volver</span>
                            </Link>
                            
                            <Link 
                                to={`/dashboard/edit/${event.id}`} 
                                className="h-11 min-h-[44px] px-2.5 sm:px-3 bg-white hover:bg-stone-50 border border-stone-200 hover:border-emerald-600 hover:text-emerald-700 text-stone-700 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
                                title="Editar información del evento"
                                aria-label="Editar información"
                            >
                                <Edit2 className="h-3.5 w-3.5 shrink-0" />
                                <span>Editar</span>
                            </Link>

                            <Link 
                                to={`/dashboard/design/${event.id}`} 
                                className="h-11 min-h-[44px] px-2.5 sm:px-3 bg-white hover:bg-stone-50 border border-stone-200 hover:border-[#DF3B94] hover:text-[#DF3B94] text-stone-700 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all whitespace-nowrap" 
                                title="Editar diseño en vivo"
                                aria-label="Diseño en vivo"
                            >
                                <Palette className="h-3.5 w-3.5 shrink-0" />
                                <span>Diseño</span>
                            </Link>

                            <Link 
                                to={`/i/${event.slug || event.id}?t=admin`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="h-11 min-h-[44px] px-2.5 sm:px-3 bg-white hover:bg-stone-50 border border-stone-200 hover:border-[#222B38] text-stone-700 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
                                title="Ver invitación terminada"
                                aria-label="Ver invitación"
                            >
                                <Eye className="h-3.5 w-3.5 shrink-0" />
                                <span>Ver</span>
                            </Link>

                            <Link 
                                to={event.slug ? `/std/${event.slug}` : `/dashboard/design/${event.id}`} 
                                target={event.slug ? "_blank" : undefined}
                                rel={event.slug ? "noopener noreferrer" : undefined}
                                className="h-11 min-h-[44px] px-2.5 sm:px-3 bg-white hover:bg-stone-50 border border-stone-200 hover:border-amber-600 hover:text-amber-700 text-stone-700 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
                                title="Save the Date digital"
                                aria-label="Save the Date"
                            >
                                <Calendar className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                                <span>Save the Date</span>
                            </Link>
                        </div>

                        {/* Fila inferior en celular: Compartir y Check-in a lo ancho */}
                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                            <button 
                                type="button"
                                onClick={shareOnWhatsApp}
                                className="h-11 min-h-[44px] px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#25D366]/20 flex items-center justify-center gap-2 transition-all whitespace-nowrap active:scale-95 cursor-pointer"
                                title="Compartir por WhatsApp"
                                aria-label="Compartir por WhatsApp"
                            >
                                <MessageSquare className="h-4 w-4 shrink-0" />
                                <span className="whitespace-nowrap">Compartir</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (hasFeature('access_control')) {
                                        navigate(`/dashboard/checkin/${event.id}`);
                                    } else {
                                        setProModalFeature('access_control');
                                    }
                                }}
                                className={`h-11 min-h-[44px] px-4 rounded-2xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                                    hasFeature('access_control')
                                        ? 'bg-[#DF3B94] hover:bg-[#C52A7C] text-white shadow-[#DF3B94]/20'
                                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
                                }`}
                                title="Acceso al Check-in QR"
                                aria-label="Check-in"
                            >
                                <QrCode className="h-4 w-4 shrink-0" />
                                <span className="whitespace-nowrap">Check-in</span>
                                {!hasFeature('access_control') && (
                                    <span className="text-[9px] bg-[#DF3B94] text-white px-1.5 py-0.5 rounded-full font-black ml-0.5">
                                        PRO
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Event Hero Profile - Condicional */}
            {isEventDashboard && event && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-4 sm:p-6 md:p-8 shadow-sm relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8">
                        <div className="space-y-4 flex-1">
                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1 bg-[#DF3B94]/10 text-[#DF3B94] text-xs font-bold rounded-full">
                                    {formatEventType(event.event_type)}
                                </span>
                                <span className={`flex items-center gap-1.5 px-3 py-1 ${percentConfirmed > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'} rounded-full text-xs font-bold`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${percentConfirmed > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                                    {percentConfirmed}% Confirmado
                                </span>
                            </div>

                            {/* Ubicación y detalles clave */}
                            <p className="text-sm md:text-base text-stone-700 font-medium flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-[#DF3B94] shrink-0" />
                                <span className="truncate">{event.venue_name || 'Ubicación por definir'}</span>
                            </p>

                            {/* Event Timeline & RSVP Deadline Block */}
                            {(() => {
                                const deadlineDate = event.rsvp_deadline ? new Date(event.rsvp_deadline) : null;
                                const daysRemaining = deadlineDate ? differenceInDays(deadlineDate, new Date()) : null;
                                const isDeadlinePassed = deadlineDate ? isPast(deadlineDate) : false;

                                return (
                                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6 pt-4 border-t border-stone-100 text-xs">
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Fecha del Evento</p>
                                            <p className="text-xs sm:text-sm font-bold text-[#222B38] flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                                                {formatEventDate(event.date_time)}
                                            </p>
                                        </div>
                                        <div className="h-8 w-px bg-stone-200 hidden sm:block" />
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Límite RSVP</p>
                                            <p className="text-xs sm:text-sm font-bold text-[#DF3B94]">
                                                {formatEventDate(event.rsvp_deadline)}
                                            </p>
                                        </div>
                                        
                                        {deadlineDate && (
                                            <>
                                                <div className="h-8 w-px bg-stone-200 hidden sm:block" />
                                                <div className="col-span-2 sm:col-span-1 flex items-center">
                                                    {isDeadlinePassed ? (
                                                        <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1">
                                                            <AlertTriangle className="h-3.5 w-3.5" /> Vencido
                                                        </span>
                                                    ) : daysRemaining !== null && daysRemaining <= 14 ? (
                                                        <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold flex items-center gap-1 animate-pulse">
                                                            <Clock className="h-3.5 w-3.5 text-amber-600" /> {daysRemaining} días restantes
                                                        </span>
                                                    ) : daysRemaining !== null && (
                                                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1">
                                                            <Check className="h-3.5 w-3.5" /> {daysRemaining} días
                                                        </span>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="w-full lg:w-80 space-y-3">
                            {/* Visual Progress Bar Card */}
                            <div className="p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs uppercase font-bold tracking-wider text-[#222B38]">Confirmados</span>
                                    <div className="text-right">
                                        <span className="text-2xl font-display font-extrabold text-[#222B38]">{metrics.confirmados}</span>
                                        <span className="text-sm font-display font-extrabold text-stone-500 ml-1">/{metrics.totalInvitados}</span>
                                    </div>
                                </div>
                                <div className="h-2.5 w-full bg-stone-200 rounded-full overflow-hidden p-0.5">
                                    <div 
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                        style={{ width: `${percentConfirmed}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <Users className="h-3.5 w-3.5 text-stone-400" />
                                        {metrics.totalInvitados === 0 ? 'Sin invitados' : 'En tiempo real'}
                                    </span>
                                    <span className="font-bold text-emerald-700">{percentConfirmed}%</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={copyGeneralLink}
                                className="w-full h-11 min-h-[44px] bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                                title="Copiar link de la invitación"
                            >
                                <Copy className="h-4 w-4 text-[#DF3B94]" />
                                <span>Copiar Link de Invitación</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                {[
                    { label: 'Total', value: metrics.totalInvitados, color: 'text-stone-900' },
                    { label: 'Confirm.', value: metrics.confirmados, color: 'text-emerald-700' },
                    { label: 'Check-in', value: metrics.ingresados, color: 'text-blue-700' },
                    { label: 'Pend.', value: metrics.pendientes, color: 'text-amber-700' },
                    { label: 'Decl.', value: metrics.noAsistiran, color: 'text-rose-700' },
                ].map(m => (
                    <div key={m.label} className="bg-white p-4 md:p-6 rounded-[1.2rem] md:rounded-[1.5rem] border border-stone-200 shadow-sm">
                        <p className="text-[8px] md:text-[10px] uppercase font-bold text-stone-600 mb-1 md:mb-2">{m.label}</p>
                        <p className={`text-xl md:text-2xl font-display font-black ${m.color}`}>{m.value}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="relative">
                <div className="flex border-b border-stone-200 gap-2 sm:gap-6 overflow-x-auto pb-1 no-scrollbar">
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
                                onClick={() => {
                                    if (isLocked) {
                                        setProModalFeature(t.feature);
                                    } else {
                                        setActiveTab(t.id as any);
                                    }
                                }} 
                                className={`pb-3.5 px-2 text-xs uppercase font-bold tracking-wider relative flex items-center gap-1.5 transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer ${
                                    activeTab === t.id ? 'text-stone-950 font-black' : 'text-stone-500 hover:text-stone-900'
                                } ${isLocked ? 'opacity-70 hover:opacity-100' : ''}`}
                            >
                                {t.label}
                                {isLocked && <span className="text-[9px] bg-stone-200 text-stone-700 font-bold px-1.5 py-0.5 rounded-full">PRO</span>}
                                {activeTab === t.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DF3B94]" />}
                            </button>
                        );
                    })}
                </div>
                {/* Degradado al borde derecho para indicar scroll en celular */}
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F8F9FA] to-transparent sm:hidden" />
            </div>

            {/* Content Rendering */}
            {activeTab === 'list' && (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                        <button 
                            type="button"
                            onClick={() => setIsAddGuestOpen(!isAddGuestOpen)} 
                            className="w-full sm:w-auto px-6 md:px-8 h-12 md:h-14 bg-[#DF3B94] text-white rounded-xl md:rounded-2xl text-xs uppercase font-bold tracking-wider shadow-md hover:bg-[#C52A7C] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                        >
                            <UserPlus className="h-4 w-4 md:h-5 md:w-5" /> <span>Nueva Invitación</span>
                        </button>
                        <button 
                            type="button"
                            onClick={() => {
                                if (!hasFeature('guest_import_excel')) {
                                    setProModalFeature('guest_import_excel');
                                    return;
                                }
                                fileInputRef.current?.click();
                            }}
                            className={`w-full sm:w-auto px-6 md:px-8 h-12 md:h-14 border-2 border-dashed rounded-xl md:rounded-2xl text-xs uppercase font-bold tracking-wider shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                                hasFeature('guest_import_excel') 
                                    ? 'bg-white text-[#222B38] border-stone-200 hover:border-[#DF3B94] hover:bg-stone-50' 
                                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                            }`}
                        >
                            <Upload className="h-4 w-4 md:h-5 md:w-5" /> 
                            <span>Importar CSV</span>
                            {!hasFeature('guest_import_excel') && <span className="text-[9px] bg-[#DF3B94] text-white font-black px-1.5 py-0.5 rounded-full ml-1">PRO</span>}
                        </button>
                    </div>

                    {/* Search & Filters (Sticky para no perderlo al hacer scroll) */}
                    <div className="flex flex-col lg:flex-row gap-4 justify-between bg-white/95 backdrop-blur-md p-4 md:p-6 rounded-2xl md:rounded-3xl border border-stone-200 shadow-sm sticky top-16 md:top-20 z-20">
                        <div className="relative w-full lg:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                            <input 
                                type="text" 
                                placeholder="Buscar por nombre o grupo..." 
                                value={searchQuery} 
                                onChange={e => setSearchQuery(e.target.value)} 
                                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-500 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] transition-all" 
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <div className="relative flex-1 lg:flex-none">
                                <div className="flex overflow-x-auto pb-1 sm:pb-0 gap-2 no-scrollbar">
                                    {[
                                        { id: 'all', label: 'Todos', activeClass: 'bg-[#DF3B94] text-white border-[#DF3B94] shadow-md', inactiveClass: 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200 hover:text-stone-900' },
                                        { id: 'yes', label: 'Conf.', activeClass: 'bg-emerald-600 text-white border-emerald-600 shadow-md', inactiveClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' },
                                        { id: 'pending', label: 'Pend.', activeClass: 'bg-amber-500 text-white border-amber-500 shadow-md', inactiveClass: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100' },
                                        { id: 'no', label: 'Decl.', activeClass: 'bg-rose-600 text-white border-rose-600 shadow-md', inactiveClass: 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100' }
                                    ].map(f => (
                                        <button 
                                            key={f.id} 
                                            type="button"
                                            onClick={() => setStatusFilter(f.id as any)} 
                                            className={`flex-none px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap min-h-[38px] cursor-pointer ${
                                                statusFilter === f.id ? f.activeClass : f.inactiveClass
                                            }`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent sm:hidden" />
                            </div>
                            <div className="flex gap-2 ml-auto">
                                <button 
                                    type="button"
                                    onClick={handleExportPDF} 
                                    className="h-11 w-11 min-h-[44px] min-w-[44px] bg-stone-100 border border-stone-200 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-200 flex items-center justify-center transition-colors cursor-pointer" 
                                    title="Exportar lista en PDF"
                                    aria-label="Exportar lista en PDF"
                                >
                                    <Download className="h-4 w-4" />
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')} 
                                    className="h-11 w-11 min-h-[44px] min-w-[44px] bg-stone-100 border border-stone-200 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-200 flex items-center justify-center transition-colors cursor-pointer"
                                    title={viewMode === 'table' ? 'Cambiar a vista de tarjetas' : 'Cambiar a vista de tabla'}
                                    aria-label={viewMode === 'table' ? 'Cambiar a vista de tarjetas' : 'Cambiar a vista de tabla'}
                                >
                                    {viewMode === 'table' ? <LayoutDashboard className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bulk Actions Bar */}
                    {selectedIds.size > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between bg-rose-50 border border-rose-200 p-4 md:p-6 rounded-[2rem] shadow-md animate-in slide-in-from-top-4 duration-500 gap-4">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="h-10 w-10 md:h-12 md:w-12 bg-rose-200 rounded-xl md:rounded-2xl flex items-center justify-center text-rose-800 font-bold text-base md:text-lg">
                                    {selectedIds.size}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] md:text-xs text-rose-900 font-extrabold uppercase tracking-widest">Seleccionados</span>
                                    <span className="text-xs md:text-sm text-rose-700 italic font-medium">
                                        {isBulkConfirmOpen ? '¿Estás seguro de eliminar?' : 'Acción en bloque disponible'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                {isBulkConfirmOpen ? (
                                    <>
                                        <button 
                                            onClick={() => setIsBulkConfirmOpen(false)} 
                                            className="flex-1 sm:flex-none px-6 py-3 bg-white text-stone-700 rounded-xl text-[9px] uppercase font-bold tracking-widest border border-stone-300 hover:bg-stone-100 transition-all"
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
                                            className="flex-1 sm:flex-none px-6 py-3 bg-white text-stone-700 rounded-xl text-[9px] uppercase font-bold tracking-widest border border-stone-300 hover:bg-stone-100 transition-all"
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

                    {/* Lista de Invitados / Empty State */}
                    {guests.length === 0 ? (
                        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
                            <div className="w-16 h-16 bg-rose-50 text-[#DF3B94] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                                <Users className="h-8 w-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-stone-900">Aún no tienes invitados</h3>
                                <p className="text-sm text-stone-500 max-w-sm mx-auto">Comienza agregando a tus invitados manualmente o importa una lista completa en formato CSV/Excel.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddGuestOpen(true)}
                                    className="w-full sm:w-auto px-6 py-3 bg-[#DF3B94] text-white rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-[#C52A7C] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Agregar el primero
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!hasFeature('guest_import_excel')) {
                                            setProModalFeature('guest_import_excel');
                                            return;
                                        }
                                        fileInputRef.current?.click();
                                    }}
                                    className="w-full sm:w-auto px-6 py-3 bg-white text-stone-700 border border-stone-200 rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-stone-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Upload className="h-4 w-4" />
                                    Importar desde Excel
                                </button>
                            </div>
                        </div>
                    ) : filteredGuests.length === 0 ? (
                        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-3">
                            <Search className="h-8 w-8 text-stone-400 mx-auto" />
                            <p className="text-sm font-bold text-stone-700">No se encontraron invitados con los filtros seleccionados.</p>
                            <button
                                type="button"
                                onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                                className="text-xs font-bold text-[#DF3B94] hover:underline cursor-pointer"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden">
                        {viewMode === 'cards' ? (
                            <div className="p-4 sm:p-8 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {paginatedGuests.map(g => {
                                    const rsvp = g.rsvps?.[0];
                                    const status = getGuestStatus(g);
                                    const cardStyles = status === 'yes' 
                                        ? 'border-emerald-200 bg-emerald-50/20' 
                                        : status === 'no' 
                                            ? 'border-rose-200 bg-rose-50/20' 
                                            : 'border-stone-200 bg-white';

                                    return (
                                        <div key={g.id} className={`${cardStyles} p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border shadow-sm space-y-4 hover:shadow-md transition-all relative group/card`}>
                                            <div className="absolute top-4 left-4">
                                                <button 
                                                    onClick={() => toggleSelectGuest(g.id)}
                                                    className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                                        selectedIds.has(g.id)
                                                            ? 'bg-[#DF3B94] border-[#DF3B94] text-white'
                                                            : 'bg-white border-stone-300 text-transparent group-hover/card:border-stone-400'
                                                    }`}
                                                >
                                                    <Check className="h-3 w-3" />
                                                </button>
                                            </div>
                                            
                                            <div className="flex justify-between items-start pt-2">
                                                <div className="pl-8">
                                                    <h4 className="font-display font-extrabold text-base sm:text-lg text-[#222B38] leading-tight mb-1">{g.name}</h4>
                                                    <p className="text-[8px] sm:text-[9px] uppercase font-bold text-stone-500 tracking-widest">{g.group_name || 'Individual'}</p>
                                                </div>
                                                <div className="relative inline-flex items-center group">
                                                    <select
                                                        value={status}
                                                        onChange={(e) => { e.stopPropagation(); handleQuickStatusToggle(g, e.target.value); }}
                                                        title="Cambiar estado"
                                                        className={`appearance-none outline-none pl-3 pr-6 py-1 rounded-full border text-[8px] sm:text-[9px] font-bold cursor-pointer transition-transform group-hover:scale-105 shadow-sm ${getStatusStyles(status)}`}
                                                    >
                                                        <option value="pending" className="text-amber-800 bg-white font-bold">PENDIENTE</option>
                                                        <option value="yes" className="text-emerald-800 bg-white font-bold">CONFIRMADO</option>
                                                        <option value="no" className="text-rose-800 bg-white font-bold">DECLINADO</option>
                                                    </select>
                                                    <ChevronDown className={`absolute right-2 h-3 w-3 pointer-events-none transition-transform group-hover:scale-110 ${getStatusStyles(status).split(' ')[1]}`} />
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-2 py-3 text-center border-y border-stone-200">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] uppercase font-bold tracking-widest text-stone-600 mb-0.5">Pax</span>
                                                    <span className="text-sm font-black text-stone-900">{getGuestPax(g)}</span>
                                                </div>
                                                <div className="flex flex-col border-x border-stone-200">
                                                    <span className="text-[8px] uppercase font-bold tracking-widest text-stone-600 mb-0.5">Ingreso</span>
                                                    <span className="text-[10px] font-semibold text-stone-700">{g.checked_in_at ? new Date(g.checked_in_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] uppercase font-bold tracking-widest text-stone-600 mb-0.5">Mesa</span>
                                                    <span className="text-[10px] font-bold text-stone-800 truncate px-1">
                                                        {g.table_id ? (tables.find(t => t.id === g.table_id)?.name || '-') : '-'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        onClick={() => handleToggleSent(g)}
                                                        className={`h-7 w-7 rounded-lg border flex items-center justify-center transition-all ${
                                                            g.invitation_sent_at 
                                                                ? 'bg-[#DF3B94] border-[#DF3B94] text-white shadow-md' 
                                                                : 'bg-white border-stone-300 text-stone-400 hover:border-[#DF3B94]'
                                                        }`}
                                                        title="Marcar enviado"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleSendReminder(g)} 
                                                        className={`h-7 w-7 rounded-lg border border-stone-300 flex items-center justify-center transition-all hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-stone-600`}
                                                        title="WhatsApp"
                                                    >
                                                        <MessageSquare className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                
                                                <div className="flex items-center gap-1.5">
                                                    <button onClick={() => setSelectedGuestForQR(g)} className="p-2 text-stone-500 hover:text-[#DF3B94] hover:bg-stone-100 rounded-lg transition-colors" title="Código QR">
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
                                                        className="p-2 text-stone-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(g.id)} className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Eliminar">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[#F8F9FA] border-b border-stone-200 text-[11px] uppercase font-extrabold text-stone-700 tracking-wider">
                                        <tr>
                                            <th className="px-4 py-6 w-12">
                                                <button 
                                                    onClick={toggleSelectAll}
                                                    className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                                        selectedIds.size > 0 && selectedIds.size === filteredGuests.length
                                                            ? 'bg-[#DF3B94] border-[#DF3B94] text-white'
                                                            : selectedIds.size > 0 
                                                                ? 'bg-[#DF3B94]/30 border-[#DF3B94] text-white'
                                                                : 'bg-white border-stone-300 text-transparent hover:border-stone-500'
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
                                    <tbody className="divide-y divide-stone-200">
                                        {paginatedGuests.map(g => (
                                            <tr key={g.id} className={`transition-all ${selectedIds.has(g.id) ? 'bg-rose-50/60' : 'hover:bg-stone-50/80'}`}>
                                                <td className="px-4 py-6">
                                                    <button 
                                                        onClick={() => toggleSelectGuest(g.id)}
                                                        className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                                            selectedIds.has(g.id)
                                                                ? 'bg-[#DF3B94] border-[#DF3B94] text-white'
                                                                : 'bg-white border-stone-300 text-transparent hover:border-stone-500'
                                                        }`}
                                                    >
                                                        <Check className="h-3 w-3" />
                                                    </button>
                                                </td>
                                                <td className="px-8 py-6 font-semibold text-stone-900">
                                                    {editingGuestId === g.id ? <input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="border border-stone-300 px-3 py-1.5 rounded-lg w-full text-stone-900 bg-white" /> : g.name}
                                                </td>
                                                <td className="px-8 py-6 text-stone-600 font-medium">
                                                    {editingGuestId === g.id ? <input value={editData.group_name} onChange={e => setEditData({...editData, group_name: e.target.value})} className="border border-stone-300 px-3 py-1.5 rounded-lg w-full text-stone-900 bg-white" /> : g.group_name || 'Individual'}
                                                </td>
                                                <td className="px-8 py-6">
                                                     <div className="flex justify-center">
                                                        <button 
                                                            onClick={() => handleToggleSent(g)}
                                                            className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                                                g.invitation_sent_at 
                                                                    ? 'bg-[#DF3B94] border-[#DF3B94] text-white' 
                                                                    : 'bg-white border-stone-300 text-transparent hover:border-[#DF3B94]'
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
                                                            className="border border-stone-300 px-2 py-1.5 rounded-lg text-xs text-stone-900 bg-white font-semibold"
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
                                                            className={`appearance-none outline-none pl-3 pr-7 py-1.5 rounded-full border text-[9px] uppercase font-bold cursor-pointer transition-transform group-hover:scale-105 shadow-sm hover:shadow-md ${getStatusStyles(getGuestStatus(g))}`}
                                                        >
                                                            <option value="pending" className="text-amber-800 bg-white font-bold">PENDIENTE</option>
                                                            <option value="yes" className="text-emerald-800 bg-white font-bold">CONFIRMADO</option>
                                                            <option value="no" className="text-rose-800 bg-white font-bold">DECLINADO</option>
                                                        </select>
                                                        <ChevronDown className={`absolute right-2 h-3.5 w-3.5 pointer-events-none transition-transform group-hover:scale-110 ${getStatusStyles(getGuestStatus(g)).split(' ')[1]}`} />
                                                    </div>
                                                    )}
                                                </td>
                                                 <td className="px-8 py-6 text-center font-bold text-stone-900">
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
                                                                 className="w-14 text-center border border-stone-300 rounded py-1 text-sm bg-white text-stone-900 focus:ring-1 focus:ring-[#DF3B94] outline-none font-bold"
                                                             />
                                                             <span className="text-[8px] text-stone-500 uppercase tracking-tight font-bold">Personas</span>
                                                         </div>
                                                     ) : (
                                                         getGuestPax(g)
                                                     )}
                                                 </td>
                                                {hasFeature('access_control') && (
                                                    <td className="px-8 py-6 text-center text-xs text-stone-700 font-medium">
                                                        {g.checked_in_at ? new Date(g.checked_in_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : <span className="text-stone-400 font-bold">-</span>}
                                                    </td>
                                                )}
                                                {hasFeature('table_management') && (
                                                    <td className="px-8 py-6 text-center text-xs text-stone-800 font-semibold">
                                                        {getGuestStatus(g) !== 'yes' ? (
                                                            <span className="text-stone-400 text-[10px] italic" title="Solo invitados confirmados pueden tener mesa">🔒</span>
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
                                                                className="border border-stone-300 px-2 py-1 rounded text-center text-xs bg-white text-stone-900 cursor-pointer font-medium"
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
                                                                className="appearance-none bg-transparent text-center text-xs cursor-pointer text-stone-800 hover:text-stone-950 font-semibold outline-none border-b border-transparent hover:border-stone-400 pb-0.5 transition-all"
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
                                                        <button onClick={() => setSelectedGuestForQR(g)} className="p-2 text-stone-500 hover:text-[#DF3B94] hover:bg-stone-100 rounded-lg transition-colors" title="Código QR"><QrCode className="h-4 w-4" /></button>
                                                    </td>
                                                )}
                                                {isManageMode && (
                                                    <td className="px-8 py-6 text-center">
                                                        {editingGuestId === g.id ? (
                                                            <div className="flex gap-2 justify-center">
                                                                <button onClick={() => handleSaveInline(g)} className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"><Save className="h-4 w-4" /></button>
                                                                <button onClick={() => setEditingGuestId(null)} className="p-1.5 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"><X className="h-4 w-4" /></button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex gap-1.5 justify-center">
                                                                <button onClick={() => copyIndividualLink(g)} className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors" title="Copiar Link"><Copy className="h-4 w-4" /></button>
                                                                <button onClick={() => handleSendReminder(g)} className="p-2 text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="WhatsApp"><MessageSquare className="h-4 w-4" /></button>
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
                                                                }} className="p-2 text-stone-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar"><Edit2 className="h-4 w-4" /></button>
                                                                <button onClick={() => handleDelete(g.id)} className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Eliminar"><Trash2 className="h-4 w-4" /></button>
                                                            </div>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Paginación y Selector de tamaño */}
                        {filteredGuests.length > 0 && (
                            <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-xs text-stone-600 font-medium text-center sm:text-left">
                                    Mostrando <span className="font-bold text-stone-900">{startIndex + 1}</span>–<span className="font-bold text-stone-900">{Math.min(startIndex + (pageSize === -1 ? filteredGuests.length : pageSize), filteredGuests.length)}</span> de <span className="font-bold text-stone-900">{filteredGuests.length}</span> invitados
                                    {searchQuery && ` (filtrados)`}
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 transition-all cursor-pointer"
                                        >
                                            Anterior
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                                .map((p, idx, arr) => (
                                                    <React.Fragment key={p}>
                                                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                                                            <span className="px-1 text-stone-400 text-xs">…</span>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => setCurrentPage(p)}
                                                            className={`h-8 w-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                                                currentPage === p
                                                                    ? 'bg-[#DF3B94] text-white shadow-sm'
                                                                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                                                            }`}
                                                        >
                                                            {p}
                                                        </button>
                                                    </React.Fragment>
                                                ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 transition-all cursor-pointer"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-xs text-stone-500">
                                    <span>Por página:</span>
                                    <select
                                        value={pageSize}
                                        onChange={e => setPageSize(Number(e.target.value))}
                                        className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-stone-800 outline-none focus:border-[#DF3B94] cursor-pointer"
                                    >
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value={-1}>Todos</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                    )}
                </div>
            )}

            {activeTab === 'statistics' && (
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm h-80">
                        <h3 className="font-display font-extrabold mb-6 text-stone-700 uppercase text-[11px] tracking-wider">Estado RSVP</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm h-80">
                        <h3 className="font-display font-extrabold mb-6 text-stone-700 uppercase text-[11px] tracking-wider">Check-in</h3>
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
                        <div key={g.id} className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-sm space-y-4">
                            <h4 className="font-display font-extrabold text-lg text-stone-900">{g.name}</h4>
                            <p className="text-stone-700 italic text-sm font-medium">"{g.rsvps[0].message}"</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'tables' && (
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h3 className="font-display font-extrabold text-xl text-stone-900">Distribución de Mesas</h3>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button 
                                onClick={handleExportTablesPDF}
                                className="flex-1 sm:flex-none px-6 py-3 bg-white border border-stone-300 text-stone-700 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:border-[#DF3B94] hover:text-[#DF3B94] transition-all"
                            >
                                <Download className="h-4 w-4" /> Exportar PDF
                            </button>
                            <button 
                                onClick={() => setIsAddingTable(!isAddingTable)} 
                                className="flex-1 sm:flex-none px-6 py-3 bg-[#DF3B94] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#C52A7C] transition-all"
                            >
                                {isAddingTable ? 'Cancelar' : 'Nueva Mesa'}
                            </button>
                        </div>
                    </div>
                    {isAddingTable && (
                        <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm grid md:grid-cols-3 gap-6 items-end">
                            <input value={newTable.name} onChange={e => setNewTable({...newTable, name: e.target.value})} placeholder="Nombre Mesa" className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-stone-900 placeholder:text-stone-500 outline-none" />
                            <input type="number" value={newTable.capacity} onChange={e => setNewTable({...newTable, capacity: parseInt(e.target.value)})} className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-stone-900 outline-none" />
                            <button onClick={handleAddTable} className="py-4 bg-[#DF3B94] text-white rounded-xl font-bold text-[10px] uppercase">Guardar</button>
                        </div>
                    )}
                    <div className="grid md:grid-cols-3 gap-6">
                        {tables.map(t => {
                            const tableGuests = guests.filter(g => g.table_id === t.id);
                            const occupiedPax = tableGuests.reduce((sum, g) => sum + getGuestPax(g), 0);
                            const availablePax = t.capacity - occupiedPax;
                            const fillPercent = t.capacity > 0 ? Math.min((occupiedPax / t.capacity) * 100, 100) : 0;
                            return (
                                <div key={t.id} className={`bg-white p-6 rounded-[2rem] border shadow-sm space-y-4 ${availablePax <= 0 ? 'border-emerald-300 bg-emerald-50/30' : 'border-stone-200'}`}>
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-display font-extrabold text-lg text-stone-900">{t.name}</h4>
                                        <button onClick={() => handleDeleteTable(t.id)} className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[9px] font-bold text-stone-700 uppercase">{occupiedPax} de {t.capacity} PAX</p>
                                            <p className={`text-[9px] font-bold uppercase ${availablePax <= 0 ? 'text-emerald-700' : availablePax <= 2 ? 'text-amber-700' : 'text-stone-600'}`}>
                                                {availablePax <= 0 ? 'COMPLETA' : `${availablePax} libres`}
                                            </p>
                                        </div>
                                        <div className="w-full bg-stone-200 rounded-full h-1.5">
                                            <div className={`h-1.5 rounded-full transition-all ${fillPercent >= 100 ? 'bg-emerald-500' : fillPercent >= 80 ? 'bg-amber-400' : 'bg-[#DF3B94]'}`} style={{ width: `${fillPercent}%` }} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        {tableGuests.map(g => (
                                            <div key={g.id} className="flex justify-between items-center text-xs">
                                                <span className="text-stone-800 font-medium">• {g.name}</span>
                                                <span className="text-stone-700 font-bold">{getGuestPax(g)} pax</span>
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
                        <div key={g.id} className="bg-white p-6 rounded-[2.5rem] border border-stone-200 shadow-sm flex justify-between items-center">
                            <div>
                                <h4 className="font-display font-extrabold text-lg text-stone-900">{g.name}</h4>
                                <p className="text-[9px] text-stone-600 uppercase font-bold">{g.last_reminder_at ? `Avisado: ${new Date(g.last_reminder_at).toLocaleDateString()}` : 'Sin avisos'}</p>
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
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full space-y-8 text-center relative border border-stone-200 shadow-2xl">
                        <button onClick={() => setSelectedGuestForQR(null)} className="absolute top-6 right-6 text-stone-500 hover:text-stone-900"><X /></button>
                        <h3 className="text-2xl font-display font-extrabold text-stone-900">{selectedGuestForQR.name}</h3>
                        <div className="flex justify-center p-4 bg-stone-50 rounded-2xl border border-stone-200">
                            <QRCodeSVG value={`${window.location.origin}/i/${selectedGuestForQR.event?.slug || 'invite'}?t=${selectedGuestForQR.id}`} size={180} />
                        </div>
                        <button onClick={() => {
                            const msg = `Hola ${selectedGuestForQR.name}, aquí tu pase: ${window.location.origin}/i/${selectedGuestForQR.event?.slug}?t=${selectedGuestForQR.id}`;
                            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                        }} className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-bold text-[10px] uppercase shadow-lg shadow-emerald-200/50 hover:bg-[#20ba59] transition-colors">Compartir WA</button>
                    </div>
                </div>
            )}
            {/* Pro Feature Modal */}
            {proModalFeature && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-stone-200 space-y-5 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DF3B94] to-[#C52A7C] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#DF3B94]/30">
                            <Crown className="h-7 w-7" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-display font-extrabold text-[#222B38]">
                                Esta función es del plan Pro
                            </h3>
                            <p className="text-sm text-stone-600 leading-relaxed">
                                {proModalFeature === 'metrics_dashboard' && 'Consulta analíticas detalladas, tasa de confirmación por grupo y tiempos de respuesta con el plan Pro.'}
                                {proModalFeature === 'guest_dashboard' && 'Visualiza y gestiona las dedicatorias y mensajes privados de tus invitados con el plan Pro.'}
                                {proModalFeature === 'table_management' && 'Organiza a tus invitados por mesas y asigna asientos fácilmente con el plan Pro.'}
                                {proModalFeature === 'reminders_automatic' && 'Envía recordatorios masivos y automáticos por WhatsApp con el plan Pro.'}
                                {proModalFeature === 'guest_import_excel' && 'Importa cientos de invitados en segundos desde un archivo Excel o CSV con el plan Pro.'}
                                {proModalFeature === 'access_control' && 'Controla el acceso en puerta con escáner de códigos QR y pases individuales con el plan Pro.'}
                                {!['metrics_dashboard', 'guest_dashboard', 'table_management', 'reminders_automatic', 'guest_import_excel', 'access_control'].includes(proModalFeature) &&
                                    'Mejora tu evento al plan Pro para desbloquear todas las herramientas avanzadas de gestión.'}
                            </p>
                        </div>
                        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                            <button
                                type="button"
                                onClick={() => setProModalFeature(null)}
                                className="flex-1 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                                Cerrar
                            </button>
                            <Link
                                to="/planes"
                                className="flex-1 py-3 px-4 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#DF3B94]/20 flex items-center justify-center gap-1.5"
                            >
                                <Crown className="h-4 w-4" />
                                Mejorar plan
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventRSVPs;
