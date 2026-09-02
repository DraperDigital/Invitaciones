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
        <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-[#DF3B94]/10">
            {/* Header */}
            <header className="py-6 border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-6 md:px-8 flex justify-between items-center">
                    <Link to={eventId ? `/planes?id=${eventId}` : "/planes"} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#222B38] transition-all">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1" /> Volver a Planes
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-xl md:text-2xl font-display font-extrabold text-[#222B38]">Finalizar Orden</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] uppercase font-bold tracking-wider">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        <span className="hidden sm:inline">Pago Seguro SSL</span>
                    </div>
                </div>
            </header>

            <div className="py-12 md:py-16 px-6 md:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Draft selector — shown only when user landed without ?id= (e.g. browser back) */}
                    {!eventId && draftLookupDone && (
                        <div className="mb-12 p-8 md:p-10 bg-amber-50 border border-amber-200 rounded-3xl max-w-3xl mx-auto space-y-6">
                            {draftEvents.length > 0 ? (
                                <>
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700 flex-shrink-0">
                                            <Sparkles className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-display font-extrabold text-[#222B38] mb-1">¿Para qué invitación es este pago?</h3>
                                            <p className="text-sm text-slate-600">Selecciona tu evento o crea uno nuevo.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {draftEvents.map((d) => (
                                            <button
                                                key={d.id}
                                                onClick={() => selectDraftEvent(d.id)}
                                                className="w-full flex items-center justify-between gap-4 p-5 bg-white border border-slate-100 rounded-2xl hover:border-[#DF3B94] hover:shadow-md transition-all text-left group"
                                            >
                                                <div>
                                                    <p className="font-display font-bold text-base text-[#222B38] group-hover:text-[#DF3B94] transition-colors">{d.title || 'Evento sin título'}</p>
                                                    {d.date_time && (
                                                        <p className="text-xs text-slate-400 mt-0.5">
                                                            {new Date(d.date_time).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="text-xs uppercase font-bold tracking-wider text-[#DF3B94] flex items-center gap-1">Seleccionar →</span>
                                            </button>
                                        ))}
                                    </div>
                                    <Link
                                        to={`/dashboard/new?plan=${planId}`}
                                        className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-[#DF3B94] hover:underline"
                                    >
                                        + Crear una nueva invitación
                                    </Link>
                                </>
                            ) : (
                                <div className="text-center space-y-4">
                                    <h3 className="text-xl font-display font-extrabold text-[#222B38]">Necesitas crear una invitación primero</h3>
                                    <p className="text-sm text-slate-600">El pago se asocia a un evento específico. Crea tu invitación y luego completas la orden.</p>
                                    <Link
                                        to={`/dashboard/new?plan=${planId}`}
                                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#DF3B94] text-white rounded-2xl text-xs uppercase font-bold tracking-wider hover:bg-[#C52A7C] transition-all shadow-lg"
                                    >
                                        Crear mi invitación
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    <div className={`grid lg:grid-cols-12 gap-12 lg:gap-16 items-start ${!eventId ? 'opacity-40 pointer-events-none' : ''}`}>
                        {/* Form Section */}
                        <div className="lg:col-span-7 space-y-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Informacion de Contacto */}
                                <div className="p-8 md:p-10 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-6">
                                    <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                                        <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#DF3B94]">
                                            <Zap className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-display font-extrabold text-[#222B38]">Información del Cliente</h3>
                                            <p className="text-xs text-slate-500">Datos para la recepción de tu comprobante y activación.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase font-bold tracking-wider text-slate-400 ml-1">Nombre Completo</label>
                                            <input 
                                                type="text" 
                                                required
                                                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] focus:bg-white transition-all text-[#222B38] text-sm" 
                                                placeholder="Ej. Ana García"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase font-bold tracking-wider text-slate-400 ml-1">Teléfono WhatsApp</label>
                                            <input 
                                                type="tel" 
                                                required
                                                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] focus:bg-white transition-all text-[#222B38] text-sm" 
                                                placeholder="+52 55 ..."
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs uppercase font-bold tracking-wider text-slate-400 ml-1">Correo Electrónico</label>
                                            <input 
                                                type="email" 
                                                disabled
                                                className="w-full p-4 bg-slate-100 rounded-2xl border border-slate-200 text-slate-500 text-sm font-medium" 
                                                value={formData.email}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Sección de Código de Descuento */}
                                <div className="p-8 md:p-10 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-6">
                                    <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                                        <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#DF3B94]">
                                            <Crown className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-display font-extrabold text-[#222B38]">¿Tienes un Código Promocional?</h3>
                                            <p className="text-xs text-slate-500">Ingresa tu cupón de descuento o prueba gratuita.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs uppercase font-bold tracking-wider text-slate-400 ml-1">Código de Promoción</label>
                                        <div className="flex gap-3">
                                            <input 
                                                type="text" 
                                                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] focus:bg-white transition-all text-[#222B38] font-mono tracking-wider uppercase text-sm" 
                                                placeholder="Ej. INVITTO26PRO"
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
                                                className="px-8 bg-[#DF3B94] text-white rounded-2xl text-xs uppercase font-bold tracking-wider hover:bg-[#C52A7C] transition-all shadow-md disabled:opacity-50 shrink-0"
                                            >
                                                {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Aplicar'}
                                            </button>
                                        </div>
                                        {couponError && <p className="text-xs text-rose-500 ml-1">{couponError}</p>}
                                        {isCouponSuccess && <p className="text-xs text-emerald-600 ml-1 font-bold">¡Cupón aplicado exitosamente! El plan {selectedPlan.name} ha sido cubierto al 100%.</p>}
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-5 bg-rose-50 text-rose-600 rounded-2xl text-xs uppercase font-bold tracking-wider text-center border border-rose-200">
                                        {error}
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={isProcessing}
                                    className="group relative w-full py-5 bg-[#DF3B94] text-white rounded-2xl text-xs uppercase font-bold tracking-[0.2em] shadow-xl hover:bg-[#C52A7C] transition-all disabled:opacity-50 overflow-hidden active:scale-[0.99]"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Procesando Orden...
                                        </div>
                                    ) : (
                                        <span>
                                            {isCouponSuccess 
                                                ? "Continuar al Dashboard" 
                                                : `Confirmar y Pagar — $${selectedPlan.price} MXN`}
                                        </span>
                                    )}
                                </button>
                                
                                <p className="text-xs text-center text-slate-400 font-normal">
                                    Al completar tu compra, aceptas nuestros <Link to="/terminos" className="underline hover:text-slate-700">Términos de Servicio</Link> y <Link to="/aviso-de-privacidad" className="underline hover:text-slate-700">Privacidad</Link>.
                                </p>
                            </form>
                        </div>

                        {/* Order Summary Section */}
                        <div className="lg:col-span-5">
                            <div className="p-8 md:p-10 bg-[#222B38] text-white rounded-3xl sticky top-28 shadow-2xl border border-slate-800 relative overflow-hidden space-y-8">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF3B94]/20 rounded-full blur-[80px] -z-0 pointer-events-none" />
                                
                                <div className="relative z-10 space-y-8">
                                    <div className="space-y-2">
                                        <span className="px-3 py-1 bg-[#DF3B94]/20 text-[#DF3B94] border border-[#DF3B94]/30 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                                            Resumen de Orden
                                        </span>
                                        <h2 className="text-3xl font-display font-extrabold tracking-tight">Detalle Final</h2>
                                    </div>

                                    {/* Plan Highlight */}
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-5 backdrop-blur-sm">
                                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${selectedPlan.bg} shrink-0`}>
                                            <selectedPlan.icon className={`h-7 w-7 ${selectedPlan.color}`} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-display font-extrabold">Plan {selectedPlan.name}</h4>
                                            <p className="text-xs text-slate-300 font-mono uppercase tracking-wider mt-0.5">Acceso Completo</p>
                                        </div>
                                    </div>

                                    {/* Features Checklist */}
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Beneficios incluidos:</p>
                                        {selectedPlan.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="h-5 w-5 rounded-full bg-[#DF3B94]/20 flex items-center justify-center shrink-0">
                                                    <Check className="h-3 w-3 text-[#DF3B94]" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-300">{f}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total */}
                                    <div className="pt-8 border-t border-white/10 space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-slate-400 text-sm">Inversión Total</span>
                                            <span className="text-4xl font-display font-extrabold tracking-tight">${selectedPlan.price} <span className="text-base font-normal text-slate-400">MXN</span></span>
                                        </div>
                                        <div className="flex justify-end gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                                            <Check className="h-4 w-4" /> Incluye impuestos
                                        </div>
                                    </div>

                                    {/* Trust */}
                                    <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                                        <div className="flex -space-x-2">
                                            {[1,2,3].map(i => (
                                                <div key={i} className="h-8 w-8 rounded-full border-2 border-[#222B38] bg-slate-200 flex items-center justify-center overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="user" />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium">
                                            Únete a más de <span className="text-white font-bold">1,200+</span> anfitriones satisfechos.
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
