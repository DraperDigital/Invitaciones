import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, EyeOff } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1B2E1D] font-sans selection:bg-[#BD7474]/20 py-20 md:py-32">
            <div className="max-w-4xl mx-auto px-6">
                <Link to="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 hover:text-[#1B2E1D] transition-colors mb-16">
                    <ArrowLeft className="h-4 w-4" /> VOLVER AL INICIO
                </Link>

                <div className="space-y-8 mb-20">
                    <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight leading-none text-[#1B2E1D]">
                        Aviso de <br /> Privacidad
                    </h1>
                    <p className="text-stone-400 font-light italic text-xl">
                        Tu información personal está protegida bajo la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
                    </p>
                    <p className="text-stone-400 font-light text-sm">Última actualización: mayo 2026</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 mb-20">
                    <div className="p-10 bg-white rounded-[2rem] border border-stone-100 shadow-sm space-y-6">
                        <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-serif">Datos seguros</h3>
                        <p className="text-stone-500 font-light leading-relaxed text-sm">
                            Tus datos viajan cifrados y se almacenan en servidores certificados. Solo el equipo de Invitto.mx tiene acceso a tu información.
                        </p>
                    </div>

                    <div className="p-10 bg-white rounded-[2rem] border border-stone-100 shadow-sm space-y-6">
                        <div className="h-12 w-12 bg-[#BD7474]/10 rounded-2xl flex items-center justify-center text-[#BD7474]">
                            <EyeOff className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-serif">No vendemos tus datos</h3>
                        <p className="text-stone-500 font-light leading-relaxed text-sm">
                            Nunca compartimos ni vendemos tu información ni la de tus invitados a terceros con fines comerciales.
                        </p>
                    </div>
                </div>

                <article className="space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">1. Responsable del tratamiento</h2>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Invitto.mx (en adelante &quot;Invitto&quot;) es responsable del uso y protección de tus datos personales. Para cualquier asunto relacionado con este Aviso, puedes contactarnos en {/* TODO: contacto */}<strong>{'{{EMAIL_CONTACTO}}'}</strong>.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">2. Datos que recabamos</h2>
                        <p className="text-stone-500 font-light leading-relaxed mb-3">Para crear tu cuenta y procesar tu compra, recabamos:</p>
                        <ul className="list-disc pl-6 text-stone-500 font-light space-y-2">
                            <li>Nombre y correo electrónico</li>
                            <li>Número de teléfono / WhatsApp (opcional)</li>
                            <li>Datos del evento que organices (fecha, ubicación, lista de invitados)</li>
                            <li>Datos de facturación y pago (procesados directamente por Stripe; Invitto no almacena información de tarjetas)</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">3. Finalidades del tratamiento</h2>
                        <p className="text-stone-500 font-light leading-relaxed mb-3">Usamos tus datos para:</p>
                        <ul className="list-disc pl-6 text-stone-500 font-light space-y-2">
                            <li>Proveer el servicio contratado (crear, gestionar y enviar tus invitaciones digitales)</li>
                            <li>Procesar pagos y emitir comprobantes</li>
                            <li>Enviarte notificaciones operativas (confirmaciones, recordatorios, soporte)</li>
                            <li>Mejorar el producto mediante analítica anónima de uso</li>
                        </ul>
                        <p className="text-stone-500 font-light leading-relaxed mt-3">
                            No usamos tus datos para marketing de terceros ni para perfilado comercial fuera del servicio.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">4. Datos de tus invitados</h2>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Como anfitrión, tú eres responsable de los datos personales que cargues sobre tus invitados (nombre, teléfono, etc.). Invitto los trata exclusivamente para permitirte gestionar tu evento; no los compartimos con terceros ni los usamos con otros fines. Al terminar tu evento, puedes solicitar la eliminación de esta información.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">5. Transferencias de datos</h2>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Compartimos datos únicamente con proveedores estrictamente necesarios para operar el servicio: Supabase (hosting y base de datos), Stripe (procesamiento de pagos), Resend (correos transaccionales), y servicios de analítica anónima (Microsoft Clarity, Google Analytics). Todos cuentan con sus propios estándares de privacidad.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">6. Derechos ARCO</h2>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos personales, así como a limitar o revocar el consentimiento que nos hayas otorgado. Para ejercer cualquiera de estos derechos, escríbenos a <strong>{'{{EMAIL_CONTACTO}}'}</strong> con asunto &quot;ARCO&quot; y responderemos en un plazo máximo de 20 días hábiles.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">7. Cookies y tecnologías similares</h2>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Usamos cookies estrictamente necesarias para mantener tu sesión, y cookies de analítica anónima para entender cómo se usa el sitio. Puedes deshabilitar las cookies desde tu navegador, aunque algunas funciones del servicio podrían dejar de funcionar correctamente.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-medium border-b border-stone-100 pb-4">8. Cambios a este aviso</h2>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Podemos actualizar este Aviso de Privacidad. Cualquier cambio se publicará en esta misma página con su nueva fecha de actualización. Si los cambios son sustanciales, te notificaremos por correo electrónico.
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

export default PrivacyPolicy;
