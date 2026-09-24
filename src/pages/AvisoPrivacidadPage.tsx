import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, EyeOff, Lock, ArrowLeft, Mail, MessageCircle } from 'lucide-react';
import Seo from '../components/Seo';
import { WHATSAPP_SUPPORT_URL } from '../lib/constants';
import { useAuth } from '../context/AuthContext';

const AvisoPrivacidadPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#222B38] font-sans selection:bg-[#DF3B94]/20">
            <Seo
                title="Aviso de Privacidad | Invitto"
                description="Aviso de Privacidad de Invitto conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)."
                path="/aviso-de-privacidad"
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
                        <ShieldCheck className="h-4 w-4" />
                        <span>Documento Legal Oficial · LFPDPPP</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-[#222B38] tracking-tight">
                        Aviso de Privacidad
                    </h1>
                    <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-3xl">
                        En Invitto nos tomamos muy en serio la seguridad y confidencialidad de tu información y la de los invitados de tu evento. Aquí te explicamos de forma transparente cómo protegemos tus datos personales.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium pt-1">
                        <span>Última actualización: mayo 2026</span>
                        <span>•</span>
                        <span>México</span>
                    </div>
                </div>

                {/* Tarjetas de Garantía de Confianza */}
                <div className="grid gap-6 md:grid-cols-2 mb-16">
                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
                        <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <Lock className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-[#222B38]">Datos 100% seguros y cifrados</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Toda la información viaja bajo protocolo SSL/TLS con encriptación bancaria y se resguarda en infraestructura certificada con aislamiento de datos.
                        </p>
                    </div>

                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
                        <div className="h-12 w-12 bg-[#fdf2f8] rounded-2xl flex items-center justify-center text-[#DF3B94]">
                            <EyeOff className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-[#222B38]">Cero venta de información</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Nunca vendemos, alquilamos ni transferimos tu información ni la de tu lista de invitados a terceras partes para fines publicitarios.
                        </p>
                    </div>
                </div>

                {/* Artículos del Aviso de Privacidad */}
                <article className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-12 space-y-12">
                    <section className="space-y-4">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">1</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Responsable del tratamiento</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Invitto.com.mx (en adelante &quot;Invitto&quot;) es responsable del tratamiento y protección de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP). Para cualquier asunto relacionado con este Aviso, puedes contactar a nuestro equipo de privacidad en <a href="mailto:soporte@invitto.com.mx" className="text-[#DF3B94] font-semibold hover:underline">soporte@invitto.com.mx</a>.
                        </p>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">2</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Datos que recabamos</h2>
                        <p className="text-slate-600 leading-relaxed mb-3">Para crear tu cuenta, configurar tu evento y procesar tu compra de manera segura, recabamos:</p>
                        <ul className="grid gap-2.5 text-slate-600 text-sm pl-2">
                            <li className="flex items-start gap-2.5">
                                <span className="h-2 w-2 rounded-full bg-[#DF3B94] mt-2 flex-shrink-0" />
                                <span><strong>Datos de identificación y contacto:</strong> Nombre completo, correo electrónico y número de teléfono o WhatsApp.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="h-2 w-2 rounded-full bg-[#DF3B94] mt-2 flex-shrink-0" />
                                <span><strong>Datos del evento:</strong> Nombre de los festejados, fecha, hora, ubicación de ceremonia y recepción, e información de confirmación (RSVP).</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="h-2 w-2 rounded-full bg-[#DF3B94] mt-2 flex-shrink-0" />
                                <span><strong>Datos de pago y facturación:</strong> Procesados directamente por pasarelas certificadas (Stripe). Invitto nunca almacena números completos ni códigos de seguridad (CVV) de tus tarjetas.</span>
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">3</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Finalidades del tratamiento</h2>
                        <p className="text-slate-600 leading-relaxed mb-3">Tus datos son recabados y tratados para los siguientes fines primarios:</p>
                        <ul className="grid gap-2.5 text-slate-600 text-sm pl-2">
                            <li className="flex items-start gap-2.5">
                                <span className="h-2 w-2 rounded-full bg-[#FAC345] mt-2 flex-shrink-0" />
                                <span>Proveer el servicio contratado: generar, alojar y distribuir tus invitaciones interactivas y boletos digitales.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="h-2 w-2 rounded-full bg-[#FAC345] mt-2 flex-shrink-0" />
                                <span>Gestionar en tiempo real las confirmaciones de asistencia (RSVP), mesas de regalos y pases con código QR.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="h-2 w-2 rounded-full bg-[#FAC345] mt-2 flex-shrink-0" />
                                <span>Procesamiento de pagos y emisión de comprobantes fiscales si los solicitas.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="h-2 w-2 rounded-full bg-[#FAC345] mt-2 flex-shrink-0" />
                                <span>Envío de notificaciones operativas relativas al estado de tu invitación, recordatorios y atención al cliente.</span>
                            </li>
                        </ul>
                        <p className="text-slate-600 leading-relaxed mt-2 text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <strong>Importante:</strong> No utilizamos tu información personal para finalidades secundarias incompatibles, ni comercializamos bases de datos.
                        </p>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">4</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Datos de tus invitados</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Como anfitrión del evento, tú tienes la titularidad y control de los datos personales de tus invitados que ingreses en la plataforma (nombres, teléfonos, número de pases asignados). Invitto actúa en calidad de encargado del tratamiento de dicha información exclusivamente para la operatividad de tu invitación. En ningún momento Invitto contactará a tus invitados con fines comerciales propios ni cederá dicha lista a terceros.
                        </p>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">5</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Transferencias de datos</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Invitto únicamente transfiere datos personales a prestadores de servicios tecnológicos estrictamente necesarios para la prestación del servicio:
                        </p>
                        <ul className="grid gap-2 text-slate-600 text-sm pl-2">
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-2" />
                                <span><strong>Supabase:</strong> Almacenamiento seguro de base de datos e infraestructura en la nube.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-2" />
                                <span><strong>Stripe Inc.:</strong> Procesador de pagos certificado bajo estándares PCI-DSS Nivel 1.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-2" />
                                <span><strong>Resend:</strong> Envío de correos electrónicos transaccionales y confirmaciones del sistema.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-2" />
                                <span><strong>Google (Google Analytics), Microsoft (Clarity) y Meta Platforms (Meta Pixel):</strong> Analítica y medición de rendimiento del sitio y optimización publicitaria, solo si aceptaste cookies analíticas en nuestro aviso de cookies.</span>
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">6</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Ejercicio de Derechos ARCO</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Conforme a la LFPDPPP, tienes derecho a ejercer en cualquier momento tus derechos de <strong>Acceso, Rectificación, Cancelación y Oposición (ARCO)</strong>, así como revocar el consentimiento otorgado.
                        </p>
                        <div className="p-6 bg-pink-50/60 rounded-2xl border border-pink-100 space-y-3">
                            <p className="text-sm text-slate-700">
                                Para iniciar una solicitud, envía un correo a <a href="mailto:soporte@invitto.com.mx" className="text-[#DF3B94] font-bold hover:underline">soporte@invitto.com.mx</a> con el asunto &quot;Solicitud ARCO&quot;, incluyendo:
                            </p>
                            <ol className="list-decimal pl-5 text-xs text-slate-600 space-y-1">
                                <li>Nombre completo y correo electrónico asociado a tu cuenta de Invitto.</li>
                                <li>Identificación oficial que acredite tu identidad.</li>
                                <li>Descripción clara de los datos respecto a los cuales buscas ejercer tus derechos ARCO.</li>
                            </ol>
                            <p className="text-xs text-slate-500">
                                Responderemos a tu solicitud en un plazo no mayor a 20 días hábiles conforme lo marca la ley.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">7</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Cookies y tecnologías de seguimiento</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Utilizamos cookies esenciales y de sesión requeridas para el inicio de sesión y funcionamiento de la plataforma, así como herramientas analíticas agregadas (Google Analytics y Microsoft Clarity) para evaluar y mejorar la experiencia de navegación sin identificar perfiles individuales. Estas últimas solo se activan si eliges &quot;Aceptar todas&quot; en nuestro aviso de cookies; si eliges &quot;Solo necesarias&quot;, no se cargan. También puedes desactivar o configurar las cookies desde los ajustes de tu navegador.
                        </p>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">8</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Cambios a este aviso</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Nos reservamos el derecho de modificar el presente Aviso de Privacidad para adecuarlo a novedades legislativas o mejoras en nuestras prácticas operativas. Cualquier cambio estará disponible de inmediato en esta URL con la fecha de actualización correspondiente.
                        </p>
                    </section>

                    {/* Contacto de Asistencia */}
                    <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl">
                        <div className="space-y-1 text-center sm:text-left">
                            <p className="text-sm font-bold text-[#222B38]">¿Dudas sobre el tratamiento de tus datos?</p>
                            <p className="text-xs text-slate-500">Nuestro equipo de atención está disponible para apoyarte.</p>
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
                                <li><Link to="/cookies" className="hover:text-white transition-colors">Política de cookies</Link></li>
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

export default AvisoPrivacidadPage;
