import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ChevronLeft, Loader2, XCircle, Users, CheckCircle2, Calendar } from 'lucide-react';
import { getPlatformContext } from '../../utils/context';

const CheckIn: React.FC = () => {
    const { eventId: urlEventId } = useParams();
    const { user } = useAuth();
    const toast = useToast();
    const { isCorporate } = getPlatformContext();

    const [eventId, setEventId] = useState<string | null>(urlEventId || null);
    const [userEvents, setUserEvents] = useState<any[]>([]);
    const [scannedId, setScannedId] = useState<string | null>(null);
    const [guestData, setGuestData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isScannerReady, setIsScannerReady] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'already_checked'>('idle');
    const [eventTitle, setEventTitle] = useState('Evento');
    const scannerRef = useRef<Html5Qrcode | null>(null);

    // Fetch user events if eventId is missing
    useEffect(() => {
        if (!user) return;
        supabase.from('events')
            .select('id, title')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .then(({ data }) => {
                if (data && data.length > 0) {
                    setUserEvents(data);
                    if (!eventId) {
                        setEventId(data[0].id);
                        setEventTitle(data[0].title);
                    }
                }
            });
    }, [user, eventId]);

    useEffect(() => {
        if (eventId && user) {
            supabase.from('events')
                .select('title')
                .eq('id', eventId)
                .eq('user_id', user.id)
                .maybeSingle()
                .then(({ data }) => {
                    if (data) {
                        setEventTitle(data.title);
                    }
                });
        }
    }, [eventId, user]);

    useEffect(() => {
        if (scannedId || !eventId) return;

        let cancelled = false;

        const runScanner = async () => {
            try {
                const html5QrCode = new Html5Qrcode("reader");
                scannerRef.current = html5QrCode;

                await html5QrCode.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    onScanSuccess,
                    onScanFailure
                );

                if (cancelled) {
                    html5QrCode.stop().catch(() => {});
                } else {
                    setIsScannerReady(true);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error("Error starting scanner:", err);
                }
            }
        };

        runScanner();

        return () => {
            cancelled = true;
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {}).then(() => {
                    scannerRef.current?.clear();
                });
            }
        };
    }, [scannedId, eventId]);

    const onScanSuccess = async (decodedText: string) => {
        if (loading) return;
        setScannedId(decodedText);
        setLoading(true);
        setStatus('idle');

        try {
            const { data: guest, error } = await supabase
                .from('guests')
                .select('*, rsvps(*)')
                .or(`guest_token.eq.${decodedText},id.eq.${decodedText}`)
                .eq('event_id', eventId)
                .single();

            if (error || !guest) {
                setStatus('error');
                toast.error('Pase no encontrado o inválido');
                return;
            }

            setGuestData(guest);

            if (guest.checked_in_at) {
                setStatus('already_checked');
            } else {
                const { error: updateError } = await supabase
                    .from('guests')
                    .update({ checked_in_at: new Date().toISOString() })
                    .eq('id', guest.id);

                if (updateError) throw updateError;
                setStatus('success');
                toast.success('¡Check-in realizado exitosamente!');
            }
        } catch (err: any) {
            console.error('Error during check-in:', err);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const onScanFailure = () => {};

    const resetScan = () => {
        setScannedId(null);
        setGuestData(null);
        setStatus('idle');
        setIsScannerReady(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 font-sans text-[#222B38]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Link to="/dashboard/events" className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-xl">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="text-2xl md:text-4xl font-display font-extrabold text-[#222B38]">
                            Check-in en Puerta (Scanner QR)
                        </h1>
                    </div>
                    <p className="text-sm text-slate-500 font-normal ml-11">
                        Escanea el código QR del invitado para validar su ingreso.
                    </p>
                </div>

                {userEvents.length > 1 && (
                    <div className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl">
                        <Calendar className="h-4 w-4 text-slate-400 ml-2" />
                        <select
                            value={eventId || ''}
                            onChange={(e) => {
                                setEventId(e.target.value);
                                resetScan();
                            }}
                            className="bg-transparent text-xs font-bold uppercase tracking-wider outline-none pr-4 text-[#222B38]"
                        >
                            {userEvents.map((ev) => (
                                <option key={ev.id} value={ev.id}>{ev.title}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Evento Activo</span>
                    <span className="text-sm font-display font-bold text-[#222B38]">{eventTitle}</span>
                </div>

                {/* Scanner Area */}
                {!scannedId ? (
                    <div className="relative overflow-hidden rounded-2xl bg-slate-900 aspect-square max-w-sm mx-auto flex items-center justify-center border border-slate-800">
                        <div id="reader" className="w-full h-full" />
                        {!isScannerReady && (
                            <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-white space-y-3 p-6 text-center">
                                <Loader2 className="h-8 w-8 animate-spin text-[#60A5FA]" />
                                <p className="text-xs font-mono uppercase tracking-wider">Iniciando cámara trasera...</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Scanned Result Card */
                    <div className="max-w-md mx-auto space-y-6 animate-in zoom-in-95 duration-200">
                        {status === 'success' && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-4">
                                <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
                                <div>
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] uppercase font-mono font-bold rounded-full">
                                        INGRESO PERMITIDO
                                    </span>
                                    <h3 className="text-2xl font-display font-extrabold text-slate-900 mt-2">{guestData?.name}</h3>
                                    <p className="text-xs font-mono text-slate-500">{guestData?.group_name || 'Individual'}</p>
                                </div>
                            </div>
                        )}

                        {status === 'already_checked' && (
                            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-center space-y-4">
                                <Users className="h-16 w-16 text-amber-500 mx-auto" />
                                <div>
                                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] uppercase font-mono font-bold rounded-full">
                                        PASE YA INGRESADO PREVIAMENTE
                                    </span>
                                    <h3 className="text-2xl font-display font-extrabold text-slate-900 mt-2">{guestData?.name}</h3>
                                    <p className="text-xs font-mono text-slate-500">
                                        Ingreso registrado a las {new Date(guestData?.checked_in_at).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center space-y-4">
                                <XCircle className="h-16 w-16 text-rose-500 mx-auto" />
                                <div>
                                    <h3 className="text-2xl font-display font-extrabold text-rose-900">Pase Inválido</h3>
                                    <p className="text-xs text-rose-600">Este código QR no corresponde a la lista de invitados de este evento.</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={resetScan}
                            className={`w-full py-4 ${
                                isCorporate ? 'bg-[#2563EB] hover:bg-[#1D4ED8]' : 'bg-[#DF3B94] hover:bg-[#C52A7C]'
                            } text-white rounded-2xl text-xs uppercase font-bold tracking-widest transition-all shadow-lg active:scale-95`}
                        >
                            Escanear Siguiente Pase
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckIn;
