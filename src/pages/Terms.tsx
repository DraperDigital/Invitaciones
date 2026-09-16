import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, RefreshCw, CreditCard, ArrowLeft, Mail, MessageCircle, CheckCircle2 } from 'lucide-react';
import Seo from '../components/Seo';
import { WHATSAPP_SUPPORT_URL } from '../lib/constants';
import { useAuth } from '../context/AuthContext';

const Terms: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#222B38] font-sans selection:bg-[#DF3B94]/20">
            <Seo
                title="Términos y Condiciones | Invitto"
                description="Términos y Condiciones de uso y contratación de Invitto, incluyendo política de garantía de reembolso de 7 días naturales."
                path="/terminos-y-condiciones"
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
                        <FileText className="h-4 w-4" />
                        <span>Términos de Servicio y Contratación</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-[#222B38] tracking-tight">
                        Términos y Condiciones
                    </h1>
                    <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-3xl">
                        Las reglas claras que rigen la contratación y el uso de la plataforma Invitto. Transparencia total para que organices tu evento con absoluta tranquilidad.
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
                        <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-[#FAC345]">
                            <CreditCard className="h-6 w-6 text-[#DF3B94]" />
                        </div>
                        <h3 className="text-lg font-bold text-[#222B38]">Un solo pago transparente</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Sin mensualidades forzosas ni cobros sorpresa recurrentes. Pagas únicamente por tu evento y tu invitación permanece activa hasta concluir tu celebración.
                        </p>
                    </div>

                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
                        <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <RefreshCw className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-[#222B38]">Garantía de reembolso de 7 días</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Si compras un paquete y aún no has publicado ni compartido tu invitación, puedes solicitar la devolución del 100% de tu dinero durante los primeros 7 días naturales.
                        </p>
                    </div>
                </div>

                {/* Artículos de los Términos */}
                <article className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-12 space-y-12">
                    <section className="space-y-4">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">1</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Aceptación de los términos</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Al crear una cuenta, contratar o utilizar los servicios de Invitto.com.mx (en adelante &quot;Invitto&quot;), manifiestas haber leído, comprendido y aceptado en su totalidad estos Términos y Condiciones, junto con nuestro <Link to="/aviso-de-privacidad" className="text-[#DF3B94] font-semibold hover:underline">Aviso de Privacidad</Link>. Si no estás conforme con cualquiera de estas cláusulas, deberás abstenerte de utilizar la plataforma.
                        </p>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">2</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Servicio que ofrecemos</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Invitto es una plataforma de software en la nube especializada en la creación, diseño, alojamiento y gestión de invitaciones digitales interactivas para bodas, XV años, cumpleaños, aniversarios y eventos sociales y corporativos. Las funciones, número de pases, opciones de personalización y módulos adicionales varían de acuerdo al plan contratado según se detalla en nuestra sección de <Link to="/planes" className="text-[#DF3B94] font-semibold hover:underline">Planes y Precios</Link>.
                        </p>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">3</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Precios y formas de pago</h2>
                        <ul className="grid gap-2.5 text-slate-600 text-sm pl-2">
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>Todos los precios están expresados en pesos mexicanos (MXN) e incluyen los impuestos aplicables.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>Los pagos se procesan de forma cifrada e instantánea mediante Stripe, admitiendo tarjetas de débito, crédito y métodos digitales autorizados.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>Cada paquete es de pago único para el evento contratado. No existen renovaciones forzosas ni cobros mensuales recurrentes.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>Puedes solicitar comprobante fiscal digital (CFDI) dentro del mismo mes en que realizaste tu compra enviando tu constancia de situación fiscal a <a href="mailto:soporte@invitto.com.mx" className="text-[#DF3B94] font-semibold hover:underline">soporte@invitto.com.mx</a>.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Sección Destacada de Reembolso */}
                    <section id="politica-de-reembolso" className="space-y-5 bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border border-emerald-200 rounded-3xl p-8 md:p-10 -mx-2 md:-mx-4 shadow-sm">
                        <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                            <RefreshCw className="h-4 w-4 text-emerald-600" />
                            <span>Garantía de Satisfacción</span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#222B38]">4. Política de reembolso y cancelación</h2>
                        <p className="text-slate-700 leading-relaxed font-medium">
                            Cuentas con <strong className="text-emerald-900 font-bold">7 días naturales contados a partir de tu compra</strong> para solicitar el reembolso íntegro (100%) de tu pago, siempre y cuando se cumplan las siguientes condiciones:
                        </p>
                        <ul className="grid gap-2 text-slate-700 text-sm pl-2">
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                                <span>No haber publicado ni difundido el enlace de la invitación con tus invitados.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                                <span>En el plan Concierge o servicios a la medida, no haber iniciado la etapa de diseño o asignación del diseñador dedicado.</span>
                            </li>
                        </ul>
                        <div className="p-4 bg-white/90 rounded-2xl border border-emerald-200/80 text-xs text-slate-600 space-y-2">
                            <p>
                                <strong>Cómo solicitarlo:</strong> Envía un correo a <a href="mailto:soporte@invitto.com.mx" className="text-emerald-700 font-bold hover:underline">soporte@invitto.com.mx</a> con el asunto &quot;Reembolso&quot; indicando tu correo registrado y comprobante de compra.
                            </p>
                            <p>
                                Los reembolsos aprobados se procesan en un plazo de 5 a 10 días hábiles directamente al método de pago original a través de Stripe.
                            </p>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Una vez transcurridos los 7 días naturales o si la invitación ya ha sido publicada y compartida con invitados, no será aplicable el reembolso debido a que el servicio se considera consumido y puesto a disposición técnica.
                        </p>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">5</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Cuenta y uso del servicio</h2>
                        <ul className="grid gap-2.5 text-slate-600 text-sm pl-2">
                            <li className="flex items-start gap-2.5">
                                <span className="h-2 w-2 rounded-full bg-[#DF3B94] mt-2 flex-shrink-0" />
                                <span>Eres responsable de custodiar tus claves de acceso y de cualquier actividad efectuada desde tu cuenta.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="h-2 w-2 rounded-full bg-[#DF3B94] mt-2 flex-shrink-0" />
                                <span>Queda prohibido cargar o compartir contenido difamatorio, que incite al odio, viole derechos de autor, sea obsceno o vulnere la privacidad de terceros.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="h-2 w-2 rounded-full bg-[#DF3B94] mt-2 flex-shrink-0" />
                                <span>No está permitida la reventa de la plataforma ni la explotación comercial no autorizada sin acuerdo previo por escrito con Invitto.</span>
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">6</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Vigencia de tu invitación</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Tu invitación digital interactiva permanece en línea y totalmente funcional hasta la fecha del evento indicada en tu panel de control. Posteriormente, mantenemos el acceso a tu cuenta durante <strong>30 días naturales adicionales</strong> a la conclusión de tu celebración para que puedas consultar métricas, ver felicitaciones y exportar tu lista completa de confirmaciones (RSVP) en Excel o CSV.
                        </p>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">7</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Limitación de responsabilidad</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Invitto emplea altos estándares de disponibilidad y monitoreo en infraestructura en la nube. Sin embargo, no garantiza la operación ininterrumpida derivada de fallas ajenas a su control, tales como incidencias de proveedores globales de internet, saturación temporal de redes de mensajería (WhatsApp) o configuraciones particulares del dispositivo del usuario receptor. En todo caso, la responsabilidad máxima de Invitto frente a cualquier eventualidad queda limitada al monto efectivamente pagado por el usuario por el servicio contratado.
                        </p>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">8</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Propiedad intelectual</h2>
                        <p className="text-slate-600 leading-relaxed">
                            La marca Invitto, software, plantillas base, animaciones, código fuente e identidad visual son propiedad exclusiva de Invitto. El usuario conserva la total titularidad sobre los textos, nombres, fotografías, audios y contenido particular que suba a su evento, otorgando a Invitto una licencia limitada estrictamente para el alojamiento y despliegue del servicio contratado.
                        </p>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">9</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Modificaciones a los términos</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Invitto podrá actualizar estos Términos y Condiciones cuando existan mejoras en el producto o cambios regulatorios. Las modificaciones se publicarán en esta página y entrarán en vigor a partir de su publicación. Las condiciones pactadas para eventos previamente pagados no sufrirán modificaciones desfavorables.
                        </p>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">10</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Jurisdicción y ley aplicable</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Para la interpretación y cumplimiento de los presentes Términos, las partes se someten a la legislación federal de los Estados Unidos Mexicanos y a la competencia de los tribunales competentes de la Ciudad de México, renunciando expresamente a cualquier otro fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros.
                        </p>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">11</div>
                        <h2 className="text-2xl font-bold text-[#222B38]">Contacto y atención a clientes</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Si tienes cualquier pregunta sobre el funcionamiento de la plataforma o estos términos, contáctanos directamente a través de nuestros canales oficiales de atención:
                        </p>
                    </section>

                    {/* Contacto de Asistencia */}
                    <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl">
                        <div className="space-y-1 text-center sm:text-left">
                            <p className="text-sm font-bold text-[#222B38]">¿Necesitas ayuda o asesoría?</p>
                            <p className="text-xs text-slate-500">Estamos disponibles los 7 días de la semana para atenderte.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <a
                                href="mailto:soporte@invitto.com.mx"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:border-[#DF3B94] hover:text-[#DF3B94] transition-colors"
                            >
                                <Mail className="h-4 w-4" /> soporte@invitto.com.mx
                            </a>
                            <a
                                href={WHATSAPP_SUPPORT_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                            >
                                <MessageCircle className="h-4 w-4" /> WhatsApp Soporte
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

export default Terms;
