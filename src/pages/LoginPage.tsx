import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, CheckCircle2, ArrowLeft, Eye, EyeOff, X } from 'lucide-react';
import Seo from '../components/Seo';

export default function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/dashboard';
    const isFromCheckout = redirectUrl.includes('/checkout') || redirectUrl.includes('/dashboard/new');

    const [isLogin, setIsLogin] = useState(!isFromCheckout);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Detect password recovery token in URL hash (#type=recovery)
        const hash = window.location.hash;
        if (hash && hash.includes('type=recovery')) {
            setIsPasswordRecovery(true);
        }

        // Check if session exists
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session && !hash.includes('type=recovery')) {
                navigate(redirectUrl, { replace: true });
            }
        });
    }, [navigate, redirectUrl]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                navigate(redirectUrl, { replace: true });
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName }
                    }
                });
                if (error) throw error;

                if (data.session) {
                    navigate(redirectUrl, { replace: true });
                } else {
                    setShowSuccessModal(true);
                }
            }
        } catch (err: any) {
            setMessage({
                text: err.message === 'Invalid login credentials' 
                    ? 'Correo o contraseña incorrectos.' 
                    : err.message || 'Ocurrió un error. Intenta de nuevo.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthLogin = async (provider: 'google') => {
        setLoading(true);
        setMessage(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}${redirectUrl}`
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setMessage({ text: err.message || 'Error con inicio de sesión social.', type: 'error' });
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/login#type=recovery`
            });
            if (error) throw error;
            setMessage({
                text: 'Te enviamos un correo con las instrucciones para restablecer tu contraseña.',
                type: 'success'
            });
        } catch (err: any) {
            setMessage({ text: err.message || 'Error al enviar correo de recuperación.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setMessage({ text: 'La contraseña debe tener al menos 6 caracteres.', type: 'error' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            setMessage({ text: '¡Contraseña actualizada exitosamente! Redirigiendo...', type: 'success' });
            setTimeout(() => navigate('/dashboard'), 1800);
        } catch (err: any) {
            setMessage({ text: err.message || 'Error al actualizar la contraseña.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex relative font-sans text-[#222B38]">
            <Seo
                title={isLogin ? 'Iniciar sesión | Invitto' : 'Crear cuenta | Invitto'}
                description="Accede a tu panel de Invitto para gestionar tus invitaciones y confirmaciones en tiempo real."
                path="/login"
                noindex
            />
            {/* Left Side: Illustration & Branding */}
            <div className="hidden lg:flex w-1/2 bg-[#222B38] relative items-center justify-center p-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?auto=format&fit=crop&q=80"
                        alt="Event Branding Background"
                        className="w-full h-full object-cover opacity-15 grayscale"
                    />
                    <div className="absolute inset-0 bg-[#222B38]/85" />
                </div>
                
                <div className="relative z-10 text-white max-w-lg space-y-6">
                    <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
                        <img src="/logo.png?v=3" alt="Invitto" className="h-10 w-auto object-contain brightness-0 invert mb-6" />
                    </Link>
                    <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wider border border-white/10 text-slate-200">
                        <span>Plataforma #1 de Invitaciones Digitales</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display font-extrabold leading-tight">
                        Tu evento, <span className="text-[#DF3B94]">sin estrés.</span>
                    </h1>
                    <p className="text-base md:text-lg text-slate-300 font-normal leading-relaxed">
                        Confirma a tus invitados, manda recordatorios por WhatsApp y ve quién va — todo desde un solo lugar.
                    </p>
                </div>

                <div className="absolute bottom-12 left-20 text-xs uppercase tracking-widest text-slate-500 font-bold">
                    © 2026 INVITTO.MX · TODOS LOS DERECHOS RESERVADOS
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-16">
                <div className="max-w-md w-full bg-white md:bg-transparent rounded-3xl p-6 sm:p-8 md:p-0 border md:border-none border-slate-100 shadow-xl md:shadow-none">

                    {/* VISTA: Nueva contraseña */}
                    {isPasswordRecovery ? (
                        <>
                            <div className="mb-8 md:mb-10">
                                <Link to="/" className="inline-block mb-6 hover:opacity-90 transition-opacity">
                                    <img src="/logo.png?v=3" alt="Invitto" className="h-9 md:h-10 w-auto object-contain" />
                                </Link>
                                <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#222B38] mb-2">
                                    Nueva contraseña
                                </h2>
                                <p className="text-slate-600 font-normal text-sm md:text-base">
                                    Elige una contraseña segura de al menos 6 caracteres.
                                </p>
                            </div>

                            <form onSubmit={handleUpdatePassword} className="space-y-5">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">NUEVA CONTRASEÑA</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            required
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#DF3B94] focus:ring-1 focus:ring-[#DF3B94] outline-none transition-all placeholder:text-slate-400 text-sm md:text-base"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#222B38] transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                {message && (
                                    <div className={`flex items-start gap-3 p-4 rounded-xl text-sm font-medium ${
                                        message.type === 'error'
                                            ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    }`}>
                                        {message.type === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />}
                                        <span>{message.text}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#DF3B94] hover:bg-[#C52A7C] text-white py-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all active:scale-[0.98] shadow-lg shadow-[#DF3B94]/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? 'GUARDANDO...' : 'GUARDAR CONTRASEÑA'}
                                    {!loading && <ArrowRight className="h-4 w-4" />}
                                </button>
                            </form>
                        </>

                    ) : isForgotPassword ? (
                        /* VISTA: Recuperar contraseña */
                        <>
                            <button
                                onClick={() => { setIsForgotPassword(false); setMessage(null); }}
                                className="flex items-center gap-2 text-slate-500 hover:text-[#222B38] transition-colors text-xs uppercase tracking-widest font-bold mb-8"
                            >
                                <ArrowLeft className="h-4 w-4" /> Volver al inicio de sesión
                            </button>

                            <div className="mb-8">
                                <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#222B38] mb-2">Recuperar acceso</h2>
                                <p className="text-slate-600 font-normal text-sm md:text-base">
                                    Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                                </p>
                            </div>

                            <form onSubmit={handleForgotPassword} className="space-y-5">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">
                                        CORREO ELECTRÓNICO
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            required
                                            type="email"
                                            placeholder="tu@correo.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#DF3B94] focus:ring-1 focus:ring-[#DF3B94] outline-none transition-all placeholder:text-slate-400 text-sm md:text-base"
                                        />
                                    </div>
                                </div>

                                {message && (
                                    <div className={`flex items-start gap-3 p-4 rounded-xl text-sm font-medium ${
                                        message.type === 'error'
                                            ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    }`}>
                                        {message.type === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />}
                                        <span>{message.text}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#DF3B94] hover:bg-[#C52A7C] text-white py-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all active:scale-[0.98] shadow-lg shadow-[#DF3B94]/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? 'ENVIANDO...' : 'ENVIAR ENLACE'}
                                    {!loading && <ArrowRight className="h-4 w-4" />}
                                </button>
                            </form>
                        </>

                    ) : (
                        /* VISTA: Login / Registro */
                        <>
                            <div className="mb-8">
                                <Link to="/" className="inline-block mb-6 hover:opacity-90 transition-opacity">
                                    <img src="/logo.png?v=3" alt="Invitto" className="h-9 md:h-10 w-auto object-contain" />
                                </Link>
                                <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#222B38] mb-2 leading-tight">
                                    {isLogin
                                        ? 'Bienvenido de nuevo'
                                        : isFromCheckout ? 'Crea tu cuenta para continuar' : 'Crea tu cuenta'}
                                </h2>
                                <p className="text-slate-600 font-normal text-sm md:text-base leading-relaxed">
                                    {isLogin
                                        ? 'Ingresa para administrar tu evento.'
                                        : isFromCheckout
                                            ? 'Solo te toma 30 segundos. Después creamos tu invitación.'
                                            : 'Empieza a organizar tu evento sin estrés. Solo te toma 30 segundos.'}
                                </p>
                            </div>

                            <div className="mb-6">
                                <button
                                    type="button"
                                    onClick={() => handleOAuthLogin('google')}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        <path fill="none" d="M1 1h22v22H1z"/>
                                    </svg>
                                    Continuar con Google
                                </button>
                            </div>

                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                                    <span className="bg-[#F8F9FA] md:bg-white px-3 text-slate-400">O {isLogin ? 'ingresa' : 'regístrate'} con tu correo</span>
                                </div>
                            </div>

                            <form onSubmit={handleAuth} className="space-y-4 md:space-y-5">
                                {!isLogin && (
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">
                                            NOMBRE <span className="text-slate-400 normal-case tracking-normal font-normal">(opcional)</span>
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Tu nombre"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#DF3B94] focus:ring-1 focus:ring-[#DF3B94] outline-none transition-all placeholder:text-slate-400 text-sm md:text-base font-normal text-[#222B38]"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">CORREO ELECTRÓNICO</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            required
                                            type="email"
                                            placeholder="tu@correo.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#DF3B94] focus:ring-1 focus:ring-[#DF3B94] outline-none transition-all placeholder:text-slate-400 text-sm md:text-base font-normal text-[#222B38]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs uppercase tracking-wider font-bold text-slate-500">CONTRASEÑA</label>
                                        {isLogin && (
                                            <button
                                                type="button"
                                                onClick={() => { setIsForgotPassword(true); setMessage(null); }}
                                                className="text-xs text-[#DF3B94] hover:underline font-bold transition-colors"
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            required
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#DF3B94] focus:ring-1 focus:ring-[#DF3B94] outline-none transition-all placeholder:text-slate-400 text-sm md:text-base font-normal text-[#222B38]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#222B38] transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {!isLogin && (
                                        <p className="text-xs text-slate-400 font-normal mt-2">Mínimo 6 caracteres.</p>
                                    )}
                                </div>

                                {message && (
                                    <div className={`flex flex-col gap-3 p-4 rounded-xl text-sm font-medium ${
                                        message.type === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    }`}>
                                        <div className="flex items-start gap-3">
                                            {message.type === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />}
                                            <span>{message.text}</span>
                                        </div>
                                        {message.type === 'error' && (message.text.includes('expirado') || message.text.includes('inválido')) && (
                                            <button 
                                                type="button" 
                                                onClick={() => { setIsForgotPassword(true); setMessage(null); }} 
                                                className="self-start text-xs font-bold text-[#DF3B94] hover:underline"
                                            >
                                                Solicitar nuevo enlace
                                            </button>
                                        )}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#DF3B94] hover:bg-[#C52A7C] text-white py-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all active:scale-[0.98] shadow-lg shadow-[#DF3B94]/20 flex items-center justify-center gap-3 disabled:opacity-50 mt-2"
                                >
                                    {loading
                                        ? 'PROCESANDO...'
                                        : isLogin
                                            ? 'ENTRAR'
                                            : isFromCheckout ? 'CREAR MI INVITACIÓN' : 'CREAR CUENTA'}
                                    {!loading && <ArrowRight className="h-4 w-4" />}
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => { setIsLogin(!isLogin); setMessage(null); }}
                                    className="text-slate-500 font-normal text-sm"
                                >
                                    {isLogin ? '¿No tienes cuenta? ' : '¿Ya eres miembro? '}
                                    <span className="text-[#DF3B94] font-bold hover:underline">
                                        {isLogin ? 'Regístrate' : 'Inicia sesión'}
                                    </span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Success Modal for Signup */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />
                    <div className="relative w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-2xl animate-in zoom-in duration-300 text-center">
                        <button 
                            onClick={() => setShowSuccessModal(false)}
                            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                        </div>

                        <h3 className="text-2xl font-display font-extrabold text-[#222B38] mb-3">
                            ¡Cuenta creada exitosamente!
                        </h3>

                        <p className="text-slate-600 font-normal text-sm leading-relaxed mb-6">
                            Hemos enviado un enlace de confirmación a tu correo electrónico (<strong className="text-slate-900">{email}</strong>). Por favor revisa tu bandeja de entrada o carpeta de spam.
                        </p>

                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full py-3.5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-xs uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#DF3B94]/20"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
