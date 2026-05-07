import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Check, CreditCard, ArrowLeft, Heart, Sparkles, Crown, Loader2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const planId = searchParams.get('plan') || 'pro';

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    useEffect(() => {
        if (!user) {
            navigate(`/login?redirect=/checkout?plan=${planId}`);
        }
    }, [user, navigate, planId]);

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

    const eventId = searchParams.get('id');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsProcessing(true);
        setError(null);

        try {
            // Simular procesamiento de pago
            await new Promise(resolve => setTimeout(resolve, 2500));

            // Actualizar la suscripción del evento
            // Nota: En una app real, esto lo haría un webhook de Stripe
            if (eventId) {
                // Primero buscamos el UUID del plan basándonos en el código (premium, pro, etc)
                const { data: planData } = await supabase
                    .from('plans')
                    .select('id')
                    .eq('code', planId)
                    .single();

                if (planData) {
                    const { error: subError } = await supabase
                        .from('event_subscriptions')
                        .upsert({ 
                            event_id: eventId,
                            plan_id: planData.id,
                            status: 'active',
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'event_id' });

                    if (subError) throw subError;
                }
            }

            // También actualizamos el perfil para consistencia legacy si es necesario
            await supabase
                .from('profiles')
                .update({ plan_tier: planId })
                .eq('id', user.id);

            setIsSuccess(true);
            setTimeout(() => {
                if (eventId) {
                    navigate(`/dashboard/design/${eventId}?upgrade=success`);
                } else {
                    navigate(`/dashboard/new`);
                }
            }, 3000);

        } catch (err: any) {
            console.error('Checkout error:', err);
            setError('Error en la pasarela de pago: ' + err.message);
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
                    <Link to="/planes" className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 hover:text-[#1B2E1D] transition-all">
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
                    <div className="grid lg:grid-cols-12 gap-16 items-start">
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

                                {/* Metodo de Pago Moderno */}
                                <div className="p-10 bg-white rounded-[2.5rem] border border-stone-100 shadow-sm space-y-8">
                                    <div className="flex items-center justify-between border-b border-stone-50 pb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-[#1B2E1D]">
                                                <CreditCard className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-2xl font-serif text-[#1B2E1D]">Método de Pago</h3>
                                        </div>
                                        <div className="flex gap-2">
                                            {['VISA', 'MC', 'AMEX'].map(m => (
                                                <span key={m} className="px-2 py-1 bg-stone-50 border border-stone-100 rounded text-[8px] font-bold text-stone-300">{m}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 ml-1">Número de Tarjeta</label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-200" />
                                                <input 
                                                    type="text" 
                                                    required
                                                    className="w-full pl-14 p-4 bg-[#FDFBF7] rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all text-[#1B2E1D] font-mono tracking-widest" 
                                                    placeholder="XXXX XXXX XXXX XXXX"
                                                    maxLength={19}
                                                    value={formData.cardNumber}
                                                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 ml-1">Expiración</label>
                                                <input 
                                                    type="text" 
                                                    required
                                                    className="w-full p-4 bg-[#FDFBF7] rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all text-[#1B2E1D]" 
                                                    placeholder="MM/AA"
                                                    maxLength={5}
                                                    value={formData.expiry}
                                                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 ml-1">CVC / CVV</label>
                                                <input 
                                                    type="password" 
                                                    required
                                                    className="w-full p-4 bg-[#FDFBF7] rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all text-[#1B2E1D]" 
                                                    placeholder="***"
                                                    maxLength={4}
                                                    value={formData.cvv}
                                                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                                                />
                                            </div>
                                        </div>
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
                                            Procesando Pago Seguro...
                                        </div>
                                    ) : (
                                        <span>Confirmar y Pagar - ${selectedPlan.price} MXN</span>
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
