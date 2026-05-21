import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, Heart, Sparkles, Crown, Loader2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const planId = searchParams.get('plan') || 'pro';

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState<string | null>(null);
    const [isCouponSuccess, setIsCouponSuccess] = useState(false);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    // Fallback when ?id= is missing from the URL (browser back, manual nav, etc.)
    const [draftEvents, setDraftEvents] = useState<{ id: string; title: string; date_time: string | null }[]>([]);
    const [draftLookupDone, setDraftLookupDone] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: user?.email || '',
        phone: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        eventType: 'wedding',
        eventDate: ''
    });

    const eventId = searchParams.get('id');
    const promoCoupon = searchParams.get('coupon');

    useEffect(() => {
        if (!user) {
            navigate(`/login?redirect=/checkout?plan=${planId}`);
        }
    }, [user, navigate, planId]);

    // Pre-fill the coupon field if it arrived via ?coupon= (from the launch promo popup)
    useEffect(() => {
        if (promoCoupon && !couponCode) {
            setCouponCode(promoCoupon.toUpperCase());
        }
    }, [promoCoupon, couponCode]);

    // If user landed here without ?id=, look up their latest draft events
    // (typically caused by hitting the browser back button or pasting a URL).
    useEffect(() => {
        if (!user || eventId || draftLookupDone) return;
        let cancelled = false;
        (async () => {
            const { data } = await supabase
                .from('events')
                .select('id, title, date_time')
                .eq('user_id', user.id)
                .eq('is_published', false)
                .order('created_at', { ascending: false })
                .limit(5);
            if (cancelled) return;
            setDraftEvents(data ?? []);
            setDraftLookupDone(true);
        })();
        return () => { cancelled = true; };
    }, [user, eventId, draftLookupDone]);

    const selectDraftEvent = (id: string) => {
        const next = new URLSearchParams(searchParams);
        next.set('id', id);
        setSearchParams(next, { replace: true });
    };

    const plans = {
        clasico: {
            name: 'Clásica',
            price: 499,
            icon: Heart,
            color: 'text-stone-500',
            bg: 'bg-stone-100',
            features: [
                'Información del evento',
                'Cuenta regresiva',
                'Ubicación con mapa',
                'Galería de fotos',
                'Confirmación WhatsApp simple'
            ]
        },
        pro: {
            name: 'Pro',
            price: 1699,
            icon: Sparkles,
            color: 'text-rose-500',
            bg: 'bg-rose-50',
            features: [
                'Dashboard en tiempo real',
                'Recordatorios automáticos',
                'Control de pases y acompañantes',
                'Importación masiva (Excel)',
                'Métricas de visualización',
                'Todo en un solo lugar'
            ]
        },
        premium: {
            name: 'Diseño Pro',
            price: 2499,
            icon: Crown,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
            features: [
                'Todo lo del plan Pro',
                'Diseño desde cero por expertos',
                'Código QR para invitados',
                'Control de acceso (Check-in)',
                'Dominio personalizado (.com)',
                'Soporte prioritario'
            ]
        },
        concierge: {
            name: 'Concierge',
            price: 4499,
            icon: Crown,
            color: 'text-amber-500',
            bg: 'bg-amber-50',
            features: [
                'Todo lo del plan Diseño Pro',
                'Gestión de lista de invitados',
                'Envío vía WhatsApp Profesional',
                '4 rondas de seguimiento',
                'Concierge dedicado 24/7',
                'Reporte final de asistencia'
            ]
        }
    };

    const selectedPlan = plans[planId as keyof typeof plans] || plans.premium;

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsApplyingCoupon(true);
        setCouponError(null);

        try {
            if (!eventId) {
                throw new Error("Selecciona la invitación para la que quieres aplicar el cupón.");
            }
            
            const { data, error } = await supabase.functions.invoke('apply-coupon', {
                body: { 
                    couponCode: couponCode,
                    eventId: eventId,
                    planId: planId
                }
            });

            if (error) {
                let errorMessage = error.message;
                try {
                    // Access response body context for FunctionsHttpError
                    const body = await error.context.json();
                    if (body && body.error) {
                        errorMessage = body.error;
                    }
                } catch (_) {}
                throw new Error(errorMessage);
            }

            if (data && data.error) {
                throw new Error(data.error);
            }

            setIsCouponSuccess(true);
        } catch (err: any) {
            console.error('Coupon error:', err);
            setCouponError(err.message);
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsProcessing(true);
        setError(null);

        try {
            if (!eventId) {
                setError('Selecciona o crea una invitación antes de continuar con el pago.');
                setIsProcessing(false);
                return;
            }

            // Si el cupón fue exitoso, ya se actualizó la BD, simplemente redirigir.
            if (isCouponSuccess) {
                // FALLBACK CLIENTE: Asegurar que todo se actualice si la Edge Function antigua falló en algo
                
                // 1. Actualizar is_published y plan_tier en el evento
                const { data: eventData } = await supabase.from('events').select('theme_config').eq('id', eventId).single();
                if (eventData) {
                    let tc = eventData.theme_config || {};
                    if (typeof tc === 'string') { try { tc = JSON.parse(tc); } catch { tc = {}; } }
                    await supabase.from('events').update({ is_published: true, theme_config: { ...tc, plan_tier: planId } }).eq('id', eventId);
                }
                
                // 2. Forzar actualización del plan en el perfil del usuario (para arreglar el dashboard)
                await supabase.from('profiles').update({ plan_tier: planId }).eq('id', user.id);

                setIsSuccess(true);
                setTimeout(() => {
                    navigate(`/dashboard/design/${eventId}?upgrade=success`);
                }, 2000);
                return;
            }

            // Call our Edge Function to create a Stripe Checkout Session
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                body: { 
                    planId: planId,
                    eventId: eventId,
                    origin: window.location.origin
                }
            });

            if (error) {
                console.error("Function error:", error);
                throw error;
            }

            if (data?.url) {
                // Redirect user to Stripe Checkout
                window.location.href = data.url;
            } else {
                throw new Error("No se pudo obtener la URL de pago.");
            }

        } catch (err: any) {
            console.error('Checkout error:', err);
            setError('Error al iniciar la pasarela de pago: ' + err.message);
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-8">
                <div className="max-w-xl w-full bg-white rounded-[3rem] p-16 text-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in duration-700">
                    <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-emerald-50 mb-10">
                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    </div>
                    <h2 className="text-5xl font-serif text-[#1B2E1D] mb-6 tracking-tight">¡Bienvenido a la Élite!</h2>
                    <p className="text-xl text-stone-500 font-light italic leading-relaxed mb-12">
                        Tu pago por el <span className="text-[#BD7474] font-bold">Plan {selectedPlan.name}</span> se ha procesado con éxito. <br />
                        Tu panel de control ahora tiene superpoderes.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-stone-300">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Preparando tu experiencia...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] selection:bg-[#BD7474]/10">
            {/* Elegant Header */}
            <header className="pt-10 pb-8 border-b border-stone-50 bg-white/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-8 flex justify-between items-center">
                    <Link to={eventId ? `/planes?id=${eventId}` : "/planes"} className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 hover:text-[#1B2E1D] transition-all">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1" /> Volver a Planes
                    </Link>
                    <span className="text-3xl font-serif italic text-[#1B2E1D]">Finalizar Orden</span>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                        <span className="text-[9px] uppercase font-bold tracking-widest text-stone-400">SSL Secure</span>
                    </div>
                </div>
            </header>

            <div className="py-20 px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Draft selector — shown only when user landed without ?id= (e.g. browser back) */}
                    {!eventId && draftLookupDone && (
                        <div className="mb-12 p-8 md:p-10 bg-amber-50 border border-amber-200 rounded-[2rem] max-w-3xl mx-auto">
                            {draftEvents.length > 0 ? (
                                <>
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 flex-shrink-0">
                                            <Sparkles className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-serif text-[#1B2E1D] mb-1">¿Para qué invitación es este pago?</h3>
                                            <p className="text-sm text-stone-500 font-light">Selecciona tu evento o crea uno nuevo.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-6">
                                        {draftEvents.map((d) => (
                                            <button
                                                key={d.id}
                                                onClick={() => selectDraftEvent(d.id)}
                                                className="w-full flex items-center justify-between gap-4 p-4 bg-white border border-stone-100 rounded-2xl hover:border-[#1B2E1D] hover:shadow-md transition-all text-left"
                                            >
                                                <div>
                                                    <p className="font-serif text-base text-[#1B2E1D]">{d.title || 'Evento sin título'}</p>
                                                    {d.date_time && (
                                                        <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mt-1">
                                                            {new Date(d.date_time).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="text-[9px] uppercase font-bold tracking-widest text-[#BD7474]">Borrador →</span>
                                            </button>
                                        ))}
                                    </div>
                                    <Link
                                        to={`/dashboard/new?plan=${planId}`}
                                        className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-stone-400 hover:text-[#1B2E1D] transition-colors"
                                    >
                                        + Crear una nueva invitación
                                    </Link>
                                </>
                            ) : (
                                <div className="text-center">
                                    <h3 className="text-xl font-serif text-[#1B2E1D] mb-3">Necesitas crear una invitación primero</h3>
                                    <p className="text-sm text-stone-500 font-light mb-6">El pago se asocia a un evento específico. Crea tu invitación y luego vuelves a pagar.</p>
                                    <Link
                                        to={`/dashboard/new?plan=${planId}`}
                                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1B2E1D] text-white rounded-2xl text-[10px] uppercase font-bold tracking-widest hover:bg-[#2D312E] transition-all"
                                    >
                                        Crear mi invitación
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    <div className={`grid lg:grid-cols-12 gap-16 items-start ${!eventId ? 'opacity-40 pointer-events-none' : ''}`}>
                        {/* Form Section */}
                        <div className="lg:col-span-7 space-y-12">
                            <form onSubmit={handleSubmit} className="space-y-10">
                                {/* Informacion de Contacto */}
                                <div className="p-10 bg-white rounded-[2.5rem] border border-stone-100 shadow-sm space-y-8">
                                    <div className="flex items-center gap-4 border-b border-stone-50 pb-6">
                                        <div className="h-12 w-12 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-[#1B2E1D]">
                                            <Zap className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-2xl font-serif text-[#1B2E1D]">Información del Cliente</h3>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 ml-1">Nombre Completo</label>
                                            <input 
                                                type="text" 
                                                required
                                                className="w-full p-4 bg-[#FDFBF7] rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all text-[#1B2E1D]" 
                                                placeholder="Ej. Ana García"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 ml-1">Teléfono WhatsApp</label>
                                            <input 
                                                type="tel" 
                                                required
                                                className="w-full p-4 bg-[#FDFBF7] rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all text-[#1B2E1D]" 
                                                placeholder="+52 55 ..."
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 ml-1">Correo para comprobante</label>
                                            <input 
                                                type="email" 
                                                disabled
                                                className="w-full p-4 bg-[#FDFBF7] rounded-2xl border-none text-stone-400 opacity-60" 
                                                value={formData.email}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Sección de Código de Descuento */}
                                <div className="p-10 bg-white rounded-[2.5rem] border border-stone-100 shadow-sm space-y-8">
                                    <div className="flex items-center gap-4 border-b border-stone-50 pb-6">
                                        <div className="h-12 w-12 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-[#1B2E1D]">
                                            <Crown className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-2xl font-serif text-[#1B2E1D]">¿Tienes un código?</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 ml-1">Código de promoción</label>
                                        <div className="flex gap-4">
                                            <input 
                                                type="text" 
                                                className="w-full p-4 bg-[#FDFBF7] rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all text-[#1B2E1D] font-mono tracking-widest uppercase" 
                                                placeholder="Ej. INVITTO26"
                                                value={couponCode}
                                                onChange={(e) => {
                                                    setCouponCode(e.target.value.toUpperCase());
                                                    setCouponError(null);
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleApplyCoupon}
                                                disabled={!couponCode || isApplyingCoupon || isCouponSuccess}
                                                className="px-8 bg-stone-100 text-stone-600 rounded-2xl text-[10px] uppercase font-bold tracking-widest hover:bg-stone-200 transition-all disabled:opacity-50"
                                            >
                                                {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Aplicar'}
                                            </button>
                                        </div>
                                        {couponError && <p className="text-xs text-rose-500 ml-1">{couponError}</p>}
                                        {isCouponSuccess && <p className="text-xs text-emerald-500 ml-1 font-bold">¡Cupón aplicado exitosamente! El plan {selectedPlan.name} ha sido cubierto.</p>}
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-5 bg-rose-50 text-rose-500 rounded-2xl text-[10px] uppercase font-bold tracking-widest text-center border border-rose-100 animate-shake">
                                        {error}
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={isProcessing}
                                    className="group relative w-full py-8 bg-[#1B2E1D] text-white rounded-[2rem] text-[11px] uppercase font-bold tracking-[0.4em] shadow-2xl hover:bg-[#2C482F] transition-all disabled:opacity-50 overflow-hidden"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center justify-center gap-4">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Procesando...
                                        </div>
                                    ) : (
                                        <span>
                                            {isCouponSuccess 
                                                ? "Continuar al Dashboard" 
                                                : `Confirmar y Pagar - $${selectedPlan.price} MXN`}
                                        </span>
                                    )}
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                                
                                <p className="text-[9px] text-center text-stone-400 font-light italic">
                                    Al completar tu compra, aceptas nuestros <span className="underline cursor-pointer">Términos de Servicio</span> y <span className="underline cursor-pointer">Privacidad</span>.
                                </p>
                            </form>
                        </div>

                        {/* Order Summary Section */}
                        <div className="lg:col-span-5">
                            <div className="p-12 bg-[#1B2E1D] text-white rounded-[3rem] sticky top-36 shadow-2xl overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#BD7474]/10 rounded-full blur-[80px] -z-0" />
                                
                                <div className="relative z-10 space-y-12">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#BD7474]">Resumen de la Orden</p>
                                        <h2 className="text-4xl font-serif tracking-tight">Detalle Final</h2>
                                    </div>

                                    {/* Plan Highlight */}
                                    <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 flex items-center gap-6">
                                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${selectedPlan.bg}`}>
                                            <selectedPlan.icon className={`h-8 w-8 ${selectedPlan.color}`} />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-serif">Plan {selectedPlan.name}</h4>
                                            <p className="text-xs text-white/40 italic uppercase tracking-widest mt-1">Acceso Vitalicio</p>
                                        </div>
                                    </div>

                                    {/* Features Checklist */}
                                    <div className="space-y-6">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Beneficios incluidos:</p>
                                        {selectedPlan.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className="h-5 w-5 rounded-full bg-[#BD7474]/20 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-[#BD7474]" />
                                                </div>
                                                <span className="text-sm font-light text-white/70 italic">{f}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total */}
                                    <div className="pt-10 border-t border-white/10 space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-stone-400 font-light italic">Inversión Total</span>
                                            <span className="text-5xl font-serif tracking-tighter">${selectedPlan.price}</span>
                                        </div>
                                        <div className="flex justify-end gap-2 text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                                            <Check className="h-3 w-3" /> Incluye todos los impuestos
                                        </div>
                                    </div>

                                    {/* Trust */}
                                    <div className="flex items-center gap-4 pt-4">
                                        <div className="flex -space-x-2">
                                            {[1,2,3].map(i => (
                                                <div key={i} className="h-8 w-8 rounded-full border-2 border-[#1B2E1D] bg-stone-100 flex items-center justify-center overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="user" />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">
                                            Únete a más de <span className="text-white">1,200</span> <br /> anfitriones satisfechos.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
