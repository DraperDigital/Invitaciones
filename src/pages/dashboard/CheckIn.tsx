import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ChevronLeft, Users, MapPin, CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';

const CheckIn: React.FC = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();
    const [scannedId, setScannedId] = useState<string | null>(null);
    const [guestData, setGuestData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isScannerReady, setIsScannerReady] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'already_checked'>('idle');
    const [eventTitle, setEventTitle] = useState('Evento');
    const scannerRef = useRef<Html5Qrcode | null>(null);

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
                    } else {
                        // Unauthorized or non-existent
                        navigate('/dashboard');
                    }
                });
        }
    }, [eventId, user, navigate]);

    useEffect(() => {
        if (scannedId) return;

        // Flag para manejar la race condition: si el componente se desmonta
        // mientras el scanner todavía está iniciando (start() es async),
        // el cleanup no puede detenerlo porque isScanning aún es false.
        // Con este flag, una vez que start() resuelve verificamos si debemos
        // parar inmediatamente.
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

                // Si el efecto se limpió mientras start() estaba en vuelo,
                // detenemos el scanner que acaba de iniciar.
                if (cancelled) {
                    html5QrCode.stop().catch(() => {});
                } else {
                    // Cámara lista — ocultar overlay de inicialización
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
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().catch(() => {});
            }
        };
    }, [scannedId]);

    const stopScanner = () => {
        if (scannerRef.current?.isScanning) {
            scannerRef.current.stop().catch(() => {});
        }
    };

    const onScanSuccess = (decodedText: string) => {
        console.log("QR Decoded:", decodedText);
        try {
            const url = new URL(decodedText);
            const id = url.searchParams.get('t');
            if (id) {
                setScannedId(id);
                stopScanner();
                fetchGuestInfo(id);
            }
        } catch (e) {
            console.error("Invalid URL scanned");
        }
    };

    const onScanFailure = () => {
        // Subtle failure (e.g. no QR in frame) - ignore
    };

    const fetchGuestInfo = async (id: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('guests')
                .select('*, rsvps(*), event_tables(name)')
                .or(`id.eq.${id},guest_token.eq.${id}`)
                .eq('event_id', eventId)   // validación de pertenencia en DB, no solo en cliente
                .maybeSingle();

            if (error || !data) {
                setStatus('error');
            } else {
                setGuestData(data);
                if (data.checked_in_at) {
                    setStatus('already_checked');
                } else {
                    setStatus('idle');
                }
            }
        } catch (e) {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!guestData) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('guests')
                .update({ checked_in_at: new Date().toISOString() })
                .eq('id', guestData.id);

            if (error) throw error;
            setStatus('success');
        } catch (e: any) {
            console.error('Supabase update error:', e);
            toast.error('Error al registrar ingreso. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const resetScanner = () => {
        setScannedId(null);
        setGuestData(null);
        setStatus('idle');
        setIsScannerReady(false); // El scanner necesita reiniciar
    };

    return (
        <div className="min-h-screen bg-stone-900 text-white font-sans flex flex-col">
            <div className="p-6 flex items-center gap-4 bg-stone-800/50 backdrop-blur-md sticky top-0 z-50">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div>
                    <h1 className="text-lg font-serif italic">{eventTitle}</h1>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Escáner de Check-in</p>
                </div>
            </div>

            <div className="flex-1 relative flex flex-col items-center justify-center p-6">
                {!scannedId ? (
                    <div className="w-full max-w-sm aspect-square relative rounded-[3rem] overflow-hidden border-4 border-stone-800 shadow-2xl">
                        {/* El div #reader siempre está en el DOM para que html5-qrcode pueda montarse */}
                        <div id="reader" className="w-full h-full" />

                        {/* Overlay: inicializando cámara */}
                        {!isScannerReady && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-stone-900/90 z-10">
                                <Loader2 className="h-10 w-10 animate-spin text-[#BD7474]" />
                                <p className="text-xs font-bold uppercase tracking-widest text-[#BD7474]">
                                    Iniciando cámara...
                                </p>
                                <p className="text-[10px] text-stone-500 text-center px-8">
                                    Acepta el permiso de cámara si el navegador lo solicita
                                </p>
                            </div>
                        )}

                        {/* Overlay: escaneando (solo visible cuando la cámara está lista) */}
                        {isScannerReady && (
                            <>
                                <div className="absolute inset-0 border-[40px] border-stone-900/40 pointer-events-none z-10">
                                    <div className="w-full h-full border-2 border-[#BD7474] rounded-2xl animate-pulse" />
                                </div>
                                <p className="absolute bottom-10 left-0 right-0 text-center text-xs font-bold uppercase tracking-widest text-[#BD7474] drop-shadow-md z-10">
                                    Escaneando Código QR...
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="w-full max-w-md animate-in slide-in-from-bottom-10 duration-500">
                        {loading ? (
                            <div className="flex flex-col items-center gap-4 p-12">
                                <Loader2 className="h-12 w-12 animate-spin text-[#BD7474]" />
                                <p className="text-stone-400 font-serif italic">Validando invitado...</p>
                            </div>
                        ) : status === 'error' ? (
                            <div className="bg-rose-500/10 border border-rose-500/20 rounded-[2.5rem] p-10 text-center space-y-6">
                                <XCircle className="h-16 w-16 text-rose-500 mx-auto" />
                                <div>
                                    <h2 className="text-2xl font-serif">Error de Lectura</h2>
                                    <p className="text-stone-400 text-sm mt-2">Código inválido o invitado no pertenece a este evento.</p>
                                </div>
                                <button onClick={resetScanner} className="w-full py-4 bg-white text-stone-900 rounded-2xl font-bold uppercase text-xs tracking-widest">
                                    Reintentar
                                </button>
                            </div>
                        ) : (
                            <div className="bg-stone-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl space-y-8">
                                <div className="text-center space-y-2">
                                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-500">INVITADO DETECTADO</p>
                                    <h2 className="text-3xl font-serif italic text-white">{guestData?.name}</h2>
                                    <p className="text-stone-400 text-xs">{guestData?.group_name || 'Individual'}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-stone-900/50 p-6 rounded-3xl border border-white/5 space-y-2">
                                        <Users className="h-5 w-5 text-stone-500" />
                                        <p className="text-2xl font-serif">{1 + (guestData?.rsvps?.[0]?.plus_ones_confirmed || 0)}</p>
                                        <p className="text-[9px] uppercase font-bold text-stone-500 tracking-widest">INVITADOS (PAX)</p>
                                    </div>
                                    <div className="bg-stone-900/50 p-6 rounded-3xl border border-white/5 space-y-2">
                                        <MapPin className="h-5 w-5 text-stone-500" />
                                        <p className="text-xl font-serif">{guestData?.event_tables?.name || 'Mesa Lib.'}</p>
                                        <p className="text-[9px] uppercase font-bold text-stone-500 tracking-widest">UBICACIÓN</p>
                                    </div>
                                </div>

                                {status === 'already_checked' ? (
                                    <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-3xl text-center space-y-3">
                                        <CheckCircle2 className="h-8 w-8 text-amber-500 mx-auto" />
                                        <p className="text-amber-500 text-xs font-bold uppercase tracking-widest">Ya ingresó al evento</p>
                                        <p className="text-stone-500 text-[10px]">Marcado como asistido anteriormente.</p>
                                        <button onClick={resetScanner} className="w-full mt-4 py-3 border border-stone-700 text-stone-400 rounded-xl text-[10px] uppercase font-bold tracking-widest">
                                            Siguiente Invitado
                                        </button>
                                    </div>
                                ) : status === 'success' ? (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl text-center space-y-4">
                                        <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                                        <p className="text-emerald-500 text-sm font-bold uppercase tracking-widest">Ingreso Confirmado</p>
                                        <button onClick={resetScanner} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-emerald-900/20">
                                            Siguiente Invitado
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <button 
                                            onClick={handleConfirm}
                                            disabled={loading}
                                            className="w-full py-5 bg-[#BD7474] text-white rounded-2xl font-bold uppercase text-xs tracking-widest shadow-xl shadow-rose-900/20 flex items-center justify-center gap-3 active:scale-98 transition-all"
                                        >
                                            Confirmar Ingreso <ArrowRight className="h-4 w-4" />
                                        </button>
                                        <button onClick={resetScanner} className="w-full py-4 text-stone-500 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors">
                                            Cancelar y Volver a Escanear
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="p-8 bg-stone-800/30 border-t border-white/5 text-center">
                <p className="text-stone-500 text-[9px] uppercase tracking-[0.4em] font-bold mb-4">SEGURIDAD Y CONTROL DE ACCESO</p>
                <div className="flex justify-center gap-8 text-stone-400 text-[10px] font-bold">
                    <span>V.1.0</span>
                    <span>•</span>
                    <span>STITCH PROTOCOL</span>
                </div>
            </div>
        </div>
    );
};

export default CheckIn;
