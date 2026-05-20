import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, CheckCircle2, ArrowLeft, Eye, EyeOff, X, Gem } from 'lucide-react';
import Seo from '../components/Seo';

export default function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/dashboard';
    // User came from a "buy plan" click on landing/pricing → wants to create + buy
    const isFromCheckout = redirectUrl.includes('/checkout') || redirectUrl.includes('/dashboard/new');

    // If user lands here from a "buy plan" click, default to signup, not login
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

    // Redirect if already logged in
    useEffect(() => {
        // MOCK MODE: already logged in via AuthContext, go straight to redirectUrl
        if (!import.meta.env.VITE_SUPABASE_URL) {
            navigate(redirectUrl);
            return;
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate(redirectUrl);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setIsPasswordRecovery(true);
                return;
            }
            if (session) {
                navigate(redirectUrl);
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate, redirectUrl]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!email.trim() || !password.trim()) {
            setMessage({ text: 'Por favor completa todos los campos.', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate(redirectUrl);
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                        emailRedirectTo: `${window.location.origin}${redirectUrl}`
                    },
                });
                if (error) throw error;
                
                if (data.user && !data.session) {
                    // Email confirmation required
                    setShowSuccessModal(true);
                } else {
                    // Redirect to the intended URL, or to the wizard if none specified
                    if (redirectUrl === '/dashboard') {
                        navigate('/dashboard/new?welcome=true');
                    } else {
                        navigate(redirectUrl);
                    }
                }
            }
        } catch (err: any) {
            const isNetworkError = err.message === 'Failed to fetch';
            const isEmailNotConfirmed = err.message === 'Email not confirmed';
            const msg = isNetworkError
                ? 'No se pudo conectar al servidor. Verifica tu conexión e intenta de nuevo.'
                : isEmailNotConfirmed
                ? 'Por favor verifica tu correo electrónico para activar tu cuenta. Revisa también tu carpeta de Spam.'
                : err.message === 'Invalid login credentials'
                ? 'Correo o contraseña incorrectos. Verifica tus datos.'
                : err.message || 'Ocurrió un error inesperado.';
            setMessage({ text: msg, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
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
            setMessage({ text: err.message || `Error al iniciar sesión con ${provider}`, type: 'error' });
            setLoading(false);
        }
    };

    // Envía el correo de recuperación
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/login`,
            });
            if (error) throw error;
            setMessage({
                text: 'Te enviamos un enlace de recuperación. Revisa tu correo (incluyendo la carpeta de spam).',
                type: 'success',
            });
        } catch (err: any) {
            setMessage({ text: err.message || 'Error al enviar el correo. Intenta de nuevo.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Actualiza la contraseña tras el flujo de recuperación
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 8) {
            setMessage({ text: 'La contraseña debe tener al menos 8 caracteres.', type: 'error' });
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
        <div className="min-h-screen bg-[#FDFBF7] flex relative">
            <Seo
                title={isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
                description="Accede a tu panel de Invitto para gestionar tus invitaciones y confirmaciones."
                path="/login"
                noindex
            />
            {/* Left Side: Illustration & Branding */}
            <div className="hidden lg:flex w-1/2 bg-[#1B2E1D] relative items-center justify-center p-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?auto=format&fit=crop&q=80"
                        alt="Event Branding Background"
                        className="w-full h-full object-cover opacity-20 grayscale"
                    />
                    <div className="absolute inset-0 bg-[#1B2E1D]/80" />
                </div>
                
                <div className="relative z-10 text-white max-w-lg">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] uppercase font-bold tracking-widest mb-10 border border-white/10">
                        <Gem className="h-4 w-4 text-[#BD7474]" />
                        <span>Plataforma de Invitaciones Premium</span>
                    </div>
                    <h1 className="text-6xl font-serif mb-8 leading-tight">Tu evento, <span className="italic text-[#BD7474]">sin estrés.</span></h1>
                    <p className="text-xl text-stone-400 font-light leading-relaxed">
                        Confirma a tus invitados, manda recordatorios y ve quién va — todo desde un solo lugar. Sin perseguir a nadie por WhatsApp.
                    </p>
                </div>

                <div className="absolute bottom-20 left-20 text-[10px] uppercase tracking-[0.5em] text-white/40 font-bold">
                    © 2026 INVITTO.MX
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-16">
                <div className="max-w-md w-full">

                    {/* ── VISTA: Nueva contraseña (tras clic en el link del correo) ── */}
                    {isPasswordRecovery ? (
                        <>
                            <div className="mb-8 md:mb-12">
                                <h2 className="text-3xl md:text-4xl font-serif text-[#1B2E1D] mb-3 md:mb-4">Nueva contraseña</h2>
                                <p className="text-stone-500 font-light italic text-sm md:text-base">
                                    Elige una contraseña segura de al menos 8 caracteres.
                                </p>
                            </div>

                            <form onSubmit={handleUpdatePassword} className="space-y-5 md:space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                                        NUEVA CONTRASEÑA
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300" />
                                        <input
                                            required
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Mínimo 8 caracteres"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full pl-12 pr-12 py-4 bg-white border border-stone-200 rounded-xl focus:border-[#1B2E1D] focus:ring-1 focus:ring-[#1B2E1D] outline-none transition-all placeholder:text-stone-300 text-sm md:text-base"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#1B2E1D] transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                {message && (
                                    <div className={`flex items-center gap-3 p-4 rounded-xl text-sm ${
                                        message.type === 'error'
                                            ? 'bg-red-50 text-red-600 border border-red-100'
                                            : 'bg-green-50 text-green-600 border border-green-100'
                                    }`}>
                                        {message.type === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0" />}
                                        {message.text}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#1B2E1D] text-white py-4 md:py-5 rounded-xl text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#2D312E] transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 disabled:bg-stone-400"
                                >
                                    {loading ? 'GUARDANDO...' : 'GUARDAR CONTRASEÑA'}
                                    {!loading && <ArrowRight className="h-4 w-4" />}
                                </button>
                            </form>
                        </>

                    ) : isForgotPassword ? (
                        /* ── VISTA: Recuperar contraseña ── */
                        <>
                            <button
                                onClick={() => { setIsForgotPassword(false); setMessage(null); }}
                                className="flex items-center gap-2 text-stone-400 hover:text-[#1B2E1D] transition-colors text-[10px] uppercase tracking-widest font-bold mb-8 md:mb-10"
                            >
                                <ArrowLeft className="h-4 w-4" /> Volver al inicio de sesión
                            </button>

                            <div className="mb-8 md:mb-12">
                                <h2 className="text-3xl md:text-4xl font-serif text-[#1B2E1D] mb-3 md:mb-4">Recuperar acceso</h2>
                                <p className="text-stone-500 font-light italic text-sm md:text-base">
                                    Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                                </p>
                            </div>

                            <form onSubmit={handleForgotPassword} className="space-y-5 md:space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                                        CORREO ELECTRÓNICO
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300" />
                                        <input
                                            required
                                            type="email"
                                            placeholder="tu@correo.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-xl focus:border-[#1B2E1D] focus:ring-1 focus:ring-[#1B2E1D] outline-none transition-all placeholder:text-stone-300 text-sm md:text-base"
                                        />
                                    </div>
                                </div>

                                {message && (
                                    <div className={`flex items-start gap-3 p-4 rounded-xl text-sm ${
                                        message.type === 'error'
                                            ? 'bg-red-50 text-red-600 border border-red-100'
                                            : 'bg-green-50 text-green-600 border border-green-100'
                                    }`}>
                                        {message.type === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />}
                                        <span>{message.text}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#1B2E1D] text-white py-4 md:py-5 rounded-xl text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#2D312E] transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 disabled:bg-stone-400"
                                >
                                    {loading ? 'ENVIANDO...' : 'ENVIAR ENLACE'}
                                    {!loading && <ArrowRight className="h-4 w-4" />}
                                </button>
                            </form>
                        </>

                    ) : (
                        /* ── VISTA: Login / Registro (existente) ── */
                        <>
                            <div className="mb-8 md:mb-12">
                                <h2 className="text-3xl md:text-4xl font-serif text-[#1B2E1D] mb-3 md:mb-4">
                                    {isLogin
                                        ? 'Bienvenido de nuevo'
                                        : isFromCheckout ? 'Crea tu cuenta para continuar' : 'Crea tu cuenta'}
                                </h2>
                                <p className="text-stone-500 font-light italic text-sm md:text-base">
                                    {isLogin
                                        ? 'Ingresa para administrar tu evento.'
                                        : isFromCheckout
                                            ? 'Solo te toma 30 segundos. Después creamos tu invitación.'
                                            : 'Empieza a organizar tu evento sin estrés. Solo te toma 30 segundos.'}
                                </p>
                            </div>

                            <div className="mb-8">
                                <button
                                    type="button"
                                    onClick={() => handleOAuthLogin('google')}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 bg-white border border-stone-200 text-stone-700 py-3.5 rounded-xl text-[10px] md:text-[11px] uppercase font-bold tracking-widest hover:bg-stone-50 transition-all shadow-sm disabled:opacity-50"
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

                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-stone-200"></div>
                                </div>
                                <div className="relative flex justify-center text-[9px] md:text-[10px] uppercase font-bold tracking-widest">
                                    <span className="bg-[#FDFBF7] px-4 text-stone-400">O {isLogin ? 'ingresa' : 'regístrate'} con tu correo</span>
                                </div>
                            </div>

                            <form onSubmit={handleAuth} className="space-y-5 md:space-y-6">
                                {!isLogin && (
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                                            NOMBRE <span className="text-stone-300 normal-case tracking-normal font-normal">(opcional)</span>
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300" />
                                            <input
                                                type="text"
                                                placeholder="Tu nombre"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-xl focus:border-[#1B2E1D] focus:ring-1 focus:ring-[#1B2E1D] outline-none transition-all placeholder:text-stone-300 text-sm md:text-base"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">CORREO ELECTRÓNICO</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300" />
                                        <input
                                            required
                                            type="email"
                                            placeholder="tu@correo.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-xl focus:border-[#1B2E1D] focus:ring-1 focus:ring-[#1B2E1D] outline-none transition-all placeholder:text-stone-300 text-sm md:text-base"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400">CONTRASEÑA</label>
                                        {isLogin && (
                                            <button
                                                type="button"
                                                onClick={() => { setIsForgotPassword(true); setMessage(null); }}
                                                className="text-[9px] md:text-[10px] text-[#BD7474] hover:text-[#1B2E1D] font-bold transition-colors"
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300" />
                                        <input
                                            required
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-12 py-4 bg-white border border-stone-200 rounded-xl focus:border-[#1B2E1D] focus:ring-1 focus:ring-[#1B2E1D] outline-none transition-all placeholder:text-stone-300 text-sm md:text-base"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#1B2E1D] transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {!isLogin && (
                                        <p className="text-[10px] text-stone-400 font-light mt-2 italic">Mínimo 6 caracteres.</p>
                                    )}
                                </div>

                                {message && (
                                    <div className={`flex items-center gap-3 p-4 rounded-xl text-sm ${
                                        message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
                                    }`}>
                                        {message.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
                                        {message.text}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#1B2E1D] text-white py-4 md:py-5 rounded-xl text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#2D312E] transition-all transform active:scale-[0.98] shadow-lg shadow-[#1B2E1D]/10 flex items-center justify-center gap-3 disabled:bg-stone-400"
                                >
                                    {loading
                                        ? 'PROCESANDO...'
                                        : isLogin
                                            ? 'ENTRAR'
                                            : isFromCheckout ? 'CREAR MI INVITACIÓN' : 'CREAR CUENTA'}
                                    {!loading && <ArrowRight className="h-4 w-4" />}
                                </button>
                            </form>

                            <div className="mt-8 md:mt-12 text-center">
                                <button
                                    onClick={() => { setIsLogin(!isLogin); setMessage(null); }}
                                    className="text-stone-400 font-light text-sm"
                                >
                                    {isLogin ? '¿No tienes cuenta? ' : '¿Ya eres miembro? '}
                                    <span className="text-[#1B2E1D] font-bold underline underline-offset-4 decoration-[#BD7474]/40 hover:decoration-[#BD7474] transition-all">
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
                    <div className="absolute inset-0 bg-[#1B2E1D]/40 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />
                    <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 md:p-12 shadow-2xl animate-in zoom-in duration-500 text-center">
                        <button 
                            onClick={() => setShowSuccessModal(false)}
                            className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-900 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Mail className="h-10 w-10 text-emerald-600" />
                        </div>
                        
                        <h3 className="text-3xl font-serif text-[#1B2E1D] mb-4">¡Casi listo!</h3>
                        <p className="text-stone-500 font-light leading-relaxed mb-8">
                            Hemos enviado un enlace de activación a <span className="font-bold text-[#1B2E1D]">{email}</span>. 
                            <br/><br/>
                            Por favor revisa tu bandeja de entrada (y la carpeta de spam) para confirmar tu cuenta y empezar a crear tus invitaciones.
                        </p>
                        
                        <button 
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full py-5 bg-[#1B2E1D] text-white rounded-2xl text-[10px] uppercase font-black tracking-widest shadow-lg hover:bg-[#2D312E] transition-all"
                        >
                            ENTENDIDO
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
