import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

    // Redirect if already logged in
    useEffect(() => {
        // MOCK MODE: already logged in via AuthContext, go straight to dashboard
        if (!import.meta.env.VITE_SUPABASE_URL) {
            navigate('/dashboard');
            return;
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate('/dashboard');
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setIsPasswordRecovery(true);
                return;
            }
            if (session) {
                navigate('/dashboard');
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

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
                navigate('/dashboard');
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;
                // Redirect new user directly to wizard with welcome flag
                navigate('/dashboard/new?welcome=true');
            }
        } catch (err: any) {
            const isNetworkError = err.message === 'Failed to fetch';
            const msg = isNetworkError
                ? 'No se pudo conectar al servidor. Verifica tu conexión e intenta de nuevo.'
                : err.message === 'Invalid login credentials'
                ? 'Correo o contraseña incorrectos. Verifica tus datos.'
                : err.message || 'Ocurrió un error inesperado.';
            setMessage({ text: msg, type: 'error' });
        } finally {
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
        <div className="min-h-screen bg-[#FDFBF7] flex">
            {/* Left Side: Illustration & Branding */}
            <div className="hidden lg:flex w-1/2 bg-[#1B2E1D] relative items-center justify-center p-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/cecilia_roses_hero.png"
                        alt="Branding Background"
                        className="w-full h-full object-cover opacity-20 grayscale"
                    />
                    <div className="absolute inset-0 bg-[#1B2E1D]/80" />
                </div>
                
                <div className="relative z-10 text-white max-w-lg">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] uppercase font-bold tracking-widest mb-10 border border-white/10">
                        <Sparkles className="h-4 w-4 text-[#BD7474]" />
                        <span>Plataforma de Invitaciones Premium</span>
                    </div>
                    <h1 className="text-6xl font-serif mb-8 leading-tight">Digitaliza el amor, simplifica el evento.</h1>
                    <p className="text-xl text-stone-400 font-light leading-relaxed">
                        Gestiona tus confirmaciones, mesas de regalos y detalles del evento desde un panel profesional diseñado para ti.
                    </p>
                </div>

                <div className="absolute bottom-20 left-20 text-[10px] uppercase tracking-[0.5em] text-white/40 font-bold">
                    © 2026 INVITTO.MX
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
                <div className="max-w-md w-full">

                    {/* ── VISTA: Nueva contraseña (tras clic en el link del correo) ── */}
                    {isPasswordRecovery ? (
                        <>
                            <div className="mb-12">
                                <h2 className="text-4xl font-serif text-[#1B2E1D] mb-4">Nueva contraseña</h2>
                                <p className="text-stone-500 font-light italic">
                                    Elige una contraseña segura de al menos 8 caracteres.
                                </p>
                            </div>

                            <form onSubmit={handleUpdatePassword} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                                        NUEVA CONTRASEÑA
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300" />
                                        <input
                                            required
                                            type="password"
                                            placeholder="Mínimo 8 caracteres"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-xl focus:border-[#1B2E1D] focus:ring-1 focus:ring-[#1B2E1D] outline-none transition-all placeholder:text-stone-300"
                                        />
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
                                    className="w-full bg-[#1B2E1D] text-white py-5 rounded-xl text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#2D312E] transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 disabled:bg-stone-400"
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
                                className="flex items-center gap-2 text-stone-400 hover:text-[#1B2E1D] transition-colors text-[10px] uppercase tracking-widest font-bold mb-10"
                            >
                                <ArrowLeft className="h-4 w-4" /> Volver al inicio de sesión
                            </button>

                            <div className="mb-12">
                                <h2 className="text-4xl font-serif text-[#1B2E1D] mb-4">Recuperar acceso</h2>
                                <p className="text-stone-500 font-light italic">
                                    Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                                </p>
                            </div>

                            <form onSubmit={handleForgotPassword} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                                        CORREO ELECTRÓNICO
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300" />
                                        <input
                                            required
                                            type="email"
                                            placeholder="hola@tuempresa.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-xl focus:border-[#1B2E1D] focus:ring-1 focus:ring-[#1B2E1D] outline-none transition-all placeholder:text-stone-300"
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
                                    className="w-full bg-[#1B2E1D] text-white py-5 rounded-xl text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#2D312E] transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 disabled:bg-stone-400"
                                >
                                    {loading ? 'ENVIANDO...' : 'ENVIAR ENLACE DE RECUPERACIÓN'}
                                    {!loading && <ArrowRight className="h-4 w-4" />}
                                </button>
                            </form>
                        </>

                    ) : (
                        /* ── VISTA: Login / Registro (existente) ── */
                        <>
                            <div className="mb-12">
                                <h2 className="text-4xl font-serif text-[#1B2E1D] mb-4">
                                    {isLogin ? 'Bienvenido de nuevo' : 'Crea tu panel'}
                                </h2>
                                <p className="text-stone-500 font-light italic">
                                    {isLogin
                                        ? 'Ingresa tus credenciales para administrar tus invitaciones.'
                                        : 'Comienza hoy mismo a crear experiencias inolvidables para tus clientes.'}
                                </p>
                            </div>

                            <form onSubmit={handleAuth} className="space-y-6">
                                {!isLogin && (
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">NOMBRE COMPLETO</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300" />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Tu nombre"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-xl focus:border-[#1B2E1D] focus:ring-1 focus:ring-[#1B2E1D] outline-none transition-all placeholder:text-stone-300"
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
                                            placeholder="hola@tuempresa.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-xl focus:border-[#1B2E1D] focus:ring-1 focus:ring-[#1B2E1D] outline-none transition-all placeholder:text-stone-300"
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
                                                className="text-[10px] text-[#BD7474] hover:text-[#1B2E1D] font-bold transition-colors"
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300" />
                                        <input
                                            required
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-xl focus:border-[#1B2E1D] focus:ring-1 focus:ring-[#1B2E1D] outline-none transition-all placeholder:text-stone-300"
                                        />
                                    </div>
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
                                    className="w-full bg-[#1B2E1D] text-white py-5 rounded-xl text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#2D312E] transition-all transform active:scale-[0.98] shadow-lg shadow-[#1B2E1D]/10 flex items-center justify-center gap-3 disabled:bg-stone-400"
                                >
                                    {loading ? 'PROCESANDO...' : (isLogin ? 'ACCEDER AL PANEL' : 'CREAR CUENTA')}
                                    {!loading && <ArrowRight className="h-4 w-4" />}
                                </button>
                            </form>

                            <div className="mt-12 text-center">
                                <button
                                    onClick={() => { setIsLogin(!isLogin); setMessage(null); }}
                                    className="text-stone-400 font-light"
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
        </div>
    );
}
