import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { WHATSAPP_SUPPORT_NUMBER } from '../lib/constants';

const BUBBLE_DISMISSED_KEY = 'invitto_wa_bubble_dismissed';

// Landings de eventos que ya cuentan con su propia barra fija inferior con botón de WhatsApp
const EVENT_LANDING_ROUTES = [
    '/invitaciones-digitales-boda',
    '/invitaciones-digitales-xv-anos',
    '/invitaciones-digitales-cumpleanos',
    '/invitaciones-digitales-bautizo',
    '/invitaciones-digitales-primera-comunion',
    '/invitaciones-digitales-baby-shower',
    '/invitaciones-digitales-revelacion-de-genero',
    '/invitaciones-digitales-graduacion',
];

export default function FloatingWhatsAppButton() {
    const location = useLocation();
    const pathname = location.pathname;

    const [showBubble, setShowBubble] = useState(false);

    // Calcular si debe ocultarse en ciertas rutas (dashboard, invitaciones, landings de evento con barra fija inferior, etc.)
    const hidden = (
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/i/') ||
        pathname.startsWith('/preview/') ||
        pathname.startsWith('/invitacion/') ||
        EVENT_LANDING_ROUTES.includes(pathname) ||
        pathname === '/carlos-y-frida' ||
        pathname === '/carlosyfrida' ||
        pathname === '/boda-cinematica-motion-premium' ||
        pathname === '/baby-posada' ||
        pathname === '/baby-posada-revelacion' ||
        pathname === '/cecilia-70'
    );

    useEffect(() => {
        if (hidden) return;

        let isDismissed = false;
        try {
            isDismissed = Boolean(sessionStorage.getItem(BUBBLE_DISMISSED_KEY));
        } catch {
            isDismissed = false;
        }

        if (isDismissed) return;

        let triggered = false;
        const triggerBubble = () => {
            if (triggered) return;
            triggered = true;
            setShowBubble(true);
            window.removeEventListener('scroll', handleScroll);
        };

        // 1. Trigger después de 12 segundos
        const timer = setTimeout(triggerBubble, 12000);

        // 2. Trigger al hacer scroll más allá de la primera pantalla
        const handleScroll = () => {
            const scrollThreshold = window.innerHeight * 0.7;
            if (window.scrollY > scrollThreshold) {
                triggerBubble();
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [pathname, hidden]);

    // El return null se ejecuta después de TODOS los hooks para cumplir con las Reglas de Hooks de React
    if (hidden) {
        return null;
    }

    const handleDismissBubble = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowBubble(false);
        try {
            sessionStorage.setItem(BUBBLE_DISMISSED_KEY, '1');
        } catch {
            // Silencioso en caso de restricciones de storage
        }
    };

    const whatsAppUrl = `https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent('Hola, quiero mi invitación Invitto')}`;

    return (
        <div className="fixed bottom-6 right-4 sm:bottom-6 sm:right-6 z-40 flex items-end gap-2.5 pb-[env(safe-area-inset-bottom,0px)]">
            {/* Burbuja de Asistente WhatsApp (Aparece a los 12s o tras scroll) */}
            {showBubble && (
                <div
                    role="status"
                    className="relative bg-white text-slate-800 px-4 py-3 rounded-2xl shadow-2xl border border-slate-200/90 text-xs sm:text-sm font-medium max-w-[230px] sm:max-w-[270px] animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                    <button
                        type="button"
                        onClick={handleDismissBubble}
                        aria-label="Cerrar mensaje"
                        className="absolute -top-2 -left-2 bg-slate-900 text-white rounded-full p-1 shadow-md hover:bg-slate-700 transition-colors"
                    >
                        <X className="h-3 w-3" />
                    </button>
                    <a
                        href={whatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:text-[#25D366] transition-colors leading-snug"
                    >
                        👋 ¿Tienes dudas con tu invitación? ¡Escríbenos por WhatsApp!
                    </a>
                    {/* Piquito indicador hacia el botón */}
                    <span
                        aria-hidden="true"
                        className="hidden sm:block absolute -bottom-1.5 right-5 w-3 h-3 rotate-45 bg-white border-r border-b border-slate-200/90"
                    />
                </div>
            )}

            {/* Botón flotante verde de WhatsApp */}
            <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar por WhatsApp"
                className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl shadow-[#25D366]/40 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center shrink-0 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
            >
                <svg
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    fill="currentColor"
                    aria-hidden="true"
                    className="text-white drop-shadow-sm group-hover:rotate-6 transition-transform duration-300"
                >
                    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.301-.777.978-.952 1.179-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.783-1.675-2.083-.175-.301-.019-.464.131-.614.136-.135.301-.351.452-.527.15-.175.2-.3.301-.5.1-.2.05-.376-.025-.526-.075-.15-.678-1.635-.929-2.24-.244-.588-.492-.508-.677-.518-.175-.01-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.301-1.053 1.029-1.053 2.509 0 1.48 1.079 2.91 1.229 3.11.15.201 2.122 3.24 5.14 4.544.718.31 1.279.496 1.716.635.721.23 1.377.198 1.896.12.578-.087 1.78-.727 2.03-1.429.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35zM12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.95.56 3.77 1.53 5.31L2 22l4.82-1.52c1.48.91 3.21 1.44 5.22 1.44 5.53 0 10.02-4.49 10.02-10.02C22.06 6.49 17.57 2 12.04 2zm0 18.25c-1.73 0-3.34-.51-4.7-1.39l-.34-.22-2.86.9.92-2.79-.24-.37c-.98-1.5-1.5-3.26-1.5-5.06 0-4.55 3.7-8.25 8.25-8.25 4.55 0 8.25 3.7 8.25 8.25 0 4.55-3.7 8.25-8.25 8.25z"/>
                </svg>
            </a>
        </div>
    );
}
