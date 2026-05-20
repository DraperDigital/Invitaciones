import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, RefreshCw } from 'lucide-react';

const Terms: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1B2E1D] font-sans selection:bg-[#BD7474]/20 py-20 md:py-32">
            <div className="max-w-4xl mx-auto px-6">
                <Link to="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 hover:text-[#1B2E1D] transition-colors mb-16">
                    <ArrowLeft className="h-4 w-4" /> VOLVER AL INICIO
                </Link>

                <div className="space-y-8 mb-20">
                    <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight leading-none text-[#1B2E1D]">
                        Términos y <br /> Condiciones
                    </h1>
                    <p className="text-stone-400 font-light italic text-xl">
                        Las reglas que rigen el uso de Invitto.mx. Léelas antes de contratar tu plan.
                    </p>
                    <p className="text-stone-400 font-light text-sm">Última actualización: mayo 2026</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 mb-20">
                    <div className="p-10 bg-white rounded-[2rem] border border-stone-100 shadow-sm space-y-6">
                        <div className="h-12 w-12 bg-[#1B2E1D]/5 rounded-2xl flex items-center justify-center text-[#1B2E1D]">
                            <FileText className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-serif">Un solo pago</h3>
                        <p className="text-stone-500 font-light leading-relaxed text-sm">
                            Cada plan se paga una sola vez. No hay suscripción ni cargos recurrentes. Tu invitación queda activa hasta la fecha de tu evento.
                        </p>
                    </div>

                    <div className="p-10 bg-white rounded-[2rem] border border-stone-100 shadow-sm space-y-6">
                        <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <RefreshCw className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-serif">7 días de reembolso</h3>
                        <p className="text-stone-500 font-light leading-relaxed text-sm">
                            Si no has creado tu invitación, puedes solicitar el reembolso completo dentro de los primeros 7 días naturales.
                        </p>
                    </div>
                </div>

                <article className="space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">1. Aceptación de los términos</h2>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Al crear una cuenta o contratar un plan en Invitto.mx, aceptas estos Términos y Condiciones, junto con nuestro <Link to="/privacy-policy" className="text-[#BD7474] underline">Aviso de Privacidad</Link>. Si no estás de acuerdo con alguna parte, no utilices el servicio.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">2. Servicio que ofrecemos</h2>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Invitto.mx es una plataforma de invitaciones digitales con gestión de confirmaciones (RSVP), recordatorios y métricas de tus invitados. Cada plan tiene un conjunto específico de funcionalidades descritas en la página de <Link to="/planes" className="text-[#BD7474] underline">planes</Link>.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">3. Pagos</h2>
                        <ul className="list-disc pl-6 text-stone-500 font-light space-y-2">
                            <li>Todos los pagos se realizan en pesos mexicanos (MXN) vía Stripe.</li>
                            <li>Cada plan es de pago único. No se aplican cargos recurrentes.</li>
                            <li>Tu factura electrónica se emite a solicitud, contactándonos en {/* TODO: contacto */}<strong>{'{{EMAIL_CONTACTO}}'}</strong>.</li>
                            <li>Los precios pueden cambiar; el precio que aplica es el mostrado al momento de tu compra.</li>
                        </ul>
                    </section>

                    <section className="space-y-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl p-8 -mx-2">
                        <h2 className="text-2xl font-serif font-medium border-b border-emerald-100 pb-4">4. Política de reembolso y cancelación</h2>
                        <p className="text-stone-600 font-light leading-relaxed">
                            <strong className="text-[#1B2E1D]">Tienes 7 días naturales desde tu compra para solicitar un reembolso completo</strong>, siempre y cuando:
                        </p>
                        <ul className="list-disc pl-6 text-stone-600 font-light space-y-2">
                            <li>No hayas publicado tu invitación (es decir, no la hayas compartido con tus invitados).</li>
                            <li>No hayas usado el servicio Concierge (en el caso de ese plan, una vez iniciado el trabajo, el reembolso no aplica).</li>
                            <li>No hayas solicitado ya un diseño personalizado en el plan Diseño Pro o Concierge.</li>
                        </ul>
                        <p className="text-stone-600 font-light leading-relaxed">
                            Para solicitar tu reembolso, escribe a <strong>{'{{EMAIL_CONTACTO}}'}</strong> con el asunto &quot;Reembolso&quot; y tu correo de compra. Procesamos los reembolsos en un máximo de 10 días hábiles a la misma tarjeta o método con el que pagaste.
                        </p>
                        <p className="text-stone-600 font-light leading-relaxed">
                            Pasados los 7 días o si tu invitación ya está activa, no aplican reembolsos. Esto se debe a que el servicio ya se considera prestado.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">5. Cuenta y uso del servicio</h2>
                        <ul className="list-disc pl-6 text-stone-500 font-light space-y-2">
                            <li>Eres responsable de mantener segura tu contraseña y de la actividad en tu cuenta.</li>
                            <li>Eres responsable del contenido que cargues (fotos, lista de invitados, textos). No subas contenido ilegal, ofensivo ni que viole derechos de terceros.</li>
                            <li>No puedes revender, redistribuir ni usar la plataforma para ofrecer servicios a terceros sin acuerdo previo con Invitto.</li>
                            <li>Nos reservamos el derecho de suspender cuentas que violen estos términos.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">6. Vigencia de tu invitación</h2>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Tu invitación digital permanece activa hasta la fecha del evento que indicaste. Después de esa fecha, mantenemos el acceso por 30 días adicionales para que descargues tu lista final de confirmados. Pasado ese periodo, el contenido del evento puede archivarse.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">7. Limitación de responsabilidad</h2>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Invitto.mx hace su mejor esfuerzo por mantener el servicio disponible, pero no garantiza disponibilidad ininterrumpida. No somos responsables por daños indirectos, lucro cesante o consecuencias derivadas de fallas de servicios de terceros (proveedores de internet, mensajería de WhatsApp, etc.). Nuestra responsabilidad máxima frente a cualquier reclamo se limita al monto pagado por tu plan.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">8. Propiedad intelectual</h2>
                        <p className="text-stone-500 font-light leading-relaxed">
                            El diseño, código y marca de Invitto.mx son propiedad exclusiva de Invitto. El contenido que tú subas (fotos, textos del evento) sigue siendo tuyo; solo nos das licencia para mostrarlo dentro del servicio que contrataste.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">9. Modificaciones</h2>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Podemos actualizar estos términos. Si los cambios son sustanciales, te notificaremos por correo. El uso continuado del servicio después de un cambio implica tu aceptación de los nuevos términos.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">10. Ley aplicable</h2>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier disputa se resolverá en los tribunales competentes de la Ciudad de México, renunciando expresamente a cualquier otro fuero.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">11. Contacto</h2>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Para cualquier duda sobre estos términos, escríbenos a <strong>{'{{EMAIL_CONTACTO}}'}</strong> o por WhatsApp al <strong>{'{{WHATSAPP_CONTACTO}}'}</strong>.
                        </p>
                    </section>
                </article>

                <div className="mt-20 pt-12 border-t border-stone-100 text-center text-stone-400 text-xs uppercase tracking-widest font-bold">
                    © 2026 Invitto.mx
                </div>
            </div>
        </div>
    );
};

export default Terms;
