import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ShieldCheck, ArrowLeft, Mail, MessageCircle, CheckCircle2, Lock } from 'lucide-react';
import Seo from '../components/Seo';
import { WHATSAPP_SUPPORT_URL } from '../lib/constants';
import { useAuth } from '../context/AuthContext';

const CookiesPolicyPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#222B38] font-sans selection:bg-[#DF3B94]/20">
            <Seo
                title="Política de Cookies | Invitto"
                description="Conoce qué cookies y tecnologías de almacenamiento utilizamos en Invitto.mx y cómo puedes gestionarlas o configurarlas."
                path="/cookies"
            />

            {/* Header Global */}
            <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-slate-100 px-4 md:px-6">
                <div className="mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center hover:opacity-95 transition-opacity">
                        <img src="/logo.png?v=3" alt="Invitto" className="h-8 md:h-10 w-auto object-contain" />
                    </Link>
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Ejemplos
                        </Link>
                        <Link to="/planes" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Planes
                        </Link>
                        <Link to="/comparativas" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Comparativas
                        </Link>
                        <Link to="/concierge-service" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            Concierge
                        </Link>
                        <Link to="/faq" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
                            FAQ
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link to={user ? "/dashboard" : "/planes"}>
                            <button className="px-5 py-2.5 md:px-6 md:py-3 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-[10px] md:text-xs uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#DF3B94]/20 hover:-translate-y-0.5 active:scale-95">
                                {user ? 'Dashboard' : 'Comenzar'}
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="mx-auto max-w-4xl px-6 pt-28 md:pt-36 pb-20 md:pb-32">
                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#DF3B94] transition-colors mb-8 group"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span>Volver al inicio</span>
                </Link>

                {/* Hero del Documento */}
                <div className="space-y-4 mb-12">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#DF3B94]">
                        <Cookie className="h-4 w-4" />
                        <span>Transparencia y Privacidad Digital</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-[#222B38] tracking-tight">
                        Política de Cookies
                    </h1>
                    <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-3xl">
                        En Invitto utilizamos cookies e identificadores de almacenamiento local para garantizar el funcionamiento seguro de tus invitaciones, procesar pagos y ofrecerte la mejor experiencia posible.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium pt-1">
                        <span>Última actualización: mayo 2026</span>
                        <span>•</span>
                        <span>México</span>
                    </div>
                </div>

                {/* Tarjetas Resumen */}
                <div className="grid gap-6 md:grid-cols-2 mb-16">
                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
                        <div className="h-12 w-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#DF3B94]">
                            <Lock className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-[#222B38]">Cookies estrictamente necesarias</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Son indispensables para mantener tu sesión activa, proteger el panel de administración, autenticar pases con código QR y procesar pagos vía Stripe de manera segura.
                        </p>
                    </div>

                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
                        <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-[#222B38]">Analítica anónima y agregada</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Nos permite medir tiempos de carga y corregir posibles errores de navegación. Nunca almacenamos contraseñas, datos bancarios ni vendemos información a redes de publicidad externas.
                        </p>
                    </div>
                </div>

                {/* Artículos de la Política */}
                <article className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-12 space-y-12">
                    <section className="space-y-4">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">1</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">¿Qué son las cookies y para qué sirven?</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Una cookie es un pequeño archivo de texto que un sitio web descarga en tu dispositivo (computadora, smartphone o tablet) cuando navegas por él. Permiten que la plataforma recuerde tus preferencias de idioma, mantenga tu sesión iniciada mientras navegas entre páginas y garantice que el flujo de confirmación de invitados (RSVP) funcione de forma instantánea y confiable.
                        </p>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">2</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Tipos de cookies que utilizamos</h2>
                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                                <h3 className="text-base font-bold text-[#222B38] flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    <span>a) Cookies Técnicas y Esenciales (Obligatorias)</span>
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Requeridas para la operativa fundamental del servicio: autenticación de usuarios (Supabase Auth), balanceo de carga en servidores en la nube, protección contra ataques CSRF y token de seguridad al confirmar asistencia como invitado.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                                <h3 className="text-base font-bold text-[#222B38] flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-[#DF3B94]" />
                                    <span>b) Cookies de Funcionalidad y Preferencias</span>
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Permiten recordar elecciones que haces en el sitio, como tu preferencia sobre cookies, el estado del sobre interactivo de una invitación o la vista de calendario seleccionada.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                                <h3 className="text-base font-bold text-[#222B38] flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-[#FAC345]" />
                                    <span>c) Cookies de Analítica y Rendimiento</span>
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Usamos Google Analytics y Microsoft Clarity para recopilar métricas técnicas anónimas (páginas más visitadas, tasas de error, tiempo de respuesta). La información es exclusivamente estadística y no permite identificar a personas en lo individual.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">3</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Detalle de cookies y tecnologías aplicadas</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600 border border-slate-100 rounded-2xl overflow-hidden">
                                <thead className="bg-slate-50 text-[#222B38] font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="p-3.5">Nombre / Origen</th>
                                        <th className="p-3.5">Tipo</th>
                                        <th className="p-3.5">Finalidad</th>
                                        <th className="p-3.5">Duración</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="p-3.5 font-semibold text-slate-800">sb-access-token / Supabase</td>
                                        <td className="p-3.5">Técnica (Esencial)</td>
                                        <td className="p-3.5">Mantiene tu sesión de cuenta segura y activa.</td>
                                        <td className="p-3.5">Sesión / 30 días</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-semibold text-slate-800">__stripe_mid, __stripe_sid</td>
                                        <td className="p-3.5">Seguridad y Pagos</td>
                                        <td className="p-3.5">Prevención de fraudes al procesar pagos en línea con Stripe.</td>
                                        <td className="p-3.5">1 año / 30 min</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-semibold text-slate-800">invitto_cookie_consent</td>
                                        <td className="p-3.5">Preferencia</td>
                                        <td className="p-3.5">Guarda tu elección sobre el aviso de cookies.</td>
                                        <td className="p-3.5">1 año</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-semibold text-slate-800">_ga, _ga_* (Google)</td>
                                        <td className="p-3.5">Analítica</td>
                                        <td className="p-3.5">Estadísticas anónimas de navegación para optimizar la velocidad del sitio.</td>
                                        <td className="p-3.5">2 años</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-semibold text-slate-800">_clck, _clsk (Clarity)</td>
                                        <td className="p-3.5">Analítica</td>
                                        <td className="p-3.5">Detección de errores de interfaz y problemas de usabilidad.</td>
                                        <td className="p-3.5">1 año / Sesión</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">4</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Cómo gestionar o desactivar cookies</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Puedes restringir, bloquear o borrar las cookies de Invitto en cualquier momento modificando la configuración de tu navegador web:
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-600">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <strong className="text-slate-800 block mb-1">Google Chrome:</strong>
                                <span>Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios.</span>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <strong className="text-slate-800 block mb-1">Apple Safari:</strong>
                                <span>Preferencias &gt; Privacidad &gt; Bloquear todas las cookies.</span>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <strong className="text-slate-800 block mb-1">Mozilla Firefox:</strong>
                                <span>Ajustes &gt; Privacidad &amp; Seguridad &gt; Cookies y datos del sitio.</span>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <strong className="text-slate-800 block mb-1">Microsoft Edge:</strong>
                                <span>Configuración &gt; Cookies y permisos del sitio &gt; Administrar y eliminar cookies.</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 italic mt-2">
                            * Nota: Si bloqueas las cookies técnicas esenciales, algunas funciones como el acceso a tu cuenta o el checkout de pago podrían no operar de forma correcta.
                        </p>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">5</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Actualizaciones de esta política</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Podemos modificar esta Política de Cookies en función de nuevas exigencias legales o cambios técnicos en la plataforma. Te sugerimos revisar esta sección periódicamente para mantenerte informado sobre cómo protegemos tu navegación.
                        </p>
                    </section>

                    {/* Contacto de Asistencia */}
                    <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl">
                        <div className="space-y-1 text-center sm:text-left">
                            <p className="text-sm font-bold text-[#222B38]">¿Dudas sobre nuestras cookies o privacidad?</p>
                            <p className="text-xs text-slate-500">Consulta nuestro <Link to="/aviso-de-privacidad" className="text-[#DF3B94] font-semibold underline">Aviso de Privacidad</Link> o contáctanos.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <a
                                href="mailto:soporte@invitto.com.mx"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:border-[#DF3B94] hover:text-[#DF3B94] transition-colors"
                            >
                                <Mail className="h-4 w-4" /> Email
                            </a>
                            <a
                                href={WHATSAPP_SUPPORT_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                            >
                                <MessageCircle className="h-4 w-4" /> WhatsApp
                            </a>
                        </div>
                    </div>
                </article>
            </main>

            {/* Footer Oficial */}
            <footer className="bg-[#222B38] text-white pt-16 pb-12 px-6 border-t border-white/10">
                <div className="mx-auto max-w-7xl space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-4 space-y-4">
                            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
                                <img src="/logo.png?v=3" alt="Invitto" className="h-8 w-auto object-contain brightness-0 invert" />
                            </Link>
                            <p className="text-xs text-slate-400 font-normal leading-relaxed">
                                Invitaciones digitales de alta gama con control de pases y confirmación inteligente para México y Latinoamérica.
                            </p>
                        </div>

                        <div className="lg:col-span-4 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-white">Navegación</p>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li><Link to="/planes" className="hover:text-white transition-colors">Planes y precios</Link></li>
                                <li><Link to="/ejemplos" className="hover:text-white transition-colors">Ejemplos</Link></li>
                                <li><Link to="/comparativas" className="hover:text-white transition-colors">Comparativas</Link></li>
                                <li><Link to="/terminos-y-condiciones" className="hover:text-white transition-colors">Términos y condiciones</Link></li>
                                <li><Link to="/aviso-de-privacidad" className="hover:text-white transition-colors">Aviso de privacidad</Link></li>
                            </ul>
                        </div>

                        <div className="lg:col-span-4 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-white">Contacto y Soporte</p>
                            <p className="text-xs text-slate-400">Atención personalizada directa vía WhatsApp y correo.</p>
                            <div className="space-y-1.5 pt-1">
                                <div><a href={WHATSAPP_SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 font-semibold hover:underline">WhatsApp Soporte</a></div>
                                <div><a href="mailto:soporte@invitto.com.mx" className="text-xs text-[#DF3B94] font-semibold hover:underline">soporte@invitto.com.mx</a></div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                        <p>© 2026 INVITTO.COM.MX · PLATAFORMA OFICIAL EN MÉXICO · TODOS LOS DERECHOS RESERVADOS</p>
                        <p>HECHO CON CARIÑO EN MÉXICO</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CookiesPolicyPage;