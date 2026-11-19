import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { WHATSAPP_SUPPORT_NUMBER } from '../lib/constants';
import { EVENTO_CONSENTIMIENTO_COOKIES } from './CookieBanner';

// Mismo texto que el CRM de WhatsApp espera para marcar «Te escribió desde tu web» (menos de 40 caracteres).
const MENSAJE_INICIAL = 'Hola, quiero mi invitación Invitto';
const CLAVE_BURBUJA_CERRADA = 'invitto_burbuja_whatsapp_cerrada';
const RETRASO_BURBUJA_MS = 4000;

const RETRASO_TRAS_COOKIES_MS = 2000;

/** El aviso de cookies sale mientras no haya respuesta guardada (ver CookieBanner). */
function avisoDeCookiesPendiente(): boolean {
    try {
        return !localStorage.getItem('invitto_cookie_consent');
    } catch {
        return false;
    }
}

function burbujaCerradaEnEstaSesion(): boolean {
    try {
        return sessionStorage.getItem(CLAVE_BURBUJA_CERRADA) === '1';
    } catch {
        return false;
    }
}

export default function FloatingWhatsAppButton() {
    const location = useLocation();
    const pathname = location.pathname;
    const [burbujaVisible, setBurbujaVisible] = useState(false);

    // La burbuja aparece a los pocos segundos, una vez por sesión: si la cierran, no vuelve a salir.
    // En la primera visita espera a que se responda el aviso de cookies, para no encimarse con él.
    useEffect(() => {
        if (burbujaCerradaEnEstaSesion()) return;
        let temporizador: number | undefined;
        const programar = (retraso: number) => {
            window.clearTimeout(temporizador);
            temporizador = window.setTimeout(() => setBurbujaVisible(true), retraso);
        };
        const alResponderCookies = () => programar(RETRASO_TRAS_COOKIES_MS);
        if (avisoDeCookiesPendiente()) {
            window.addEventListener(EVENTO_CONSENTIMIENTO_COOKIES, alResponderCookies);
        } else {
            programar(RETRASO_BURBUJA_MS);
        }
        return () => {
            window.clearTimeout(temporizador);
            window.removeEventListener(EVENTO_CONSENTIMIENTO_COOKIES, alResponderCookies);
        };
    }, []);

    // No mostrar en el dashboard administrativo
    if (pathname.startsWith('/dashboard')) {
        return null;
    }

    // No mostrar en las invitaciones de los invitados
    if (
        pathname.startsWith('/i/') ||
        pathname.startsWith('/preview/') ||
        pathname.startsWith('/invitacion/') ||
        pathname === '/carlos-y-frida' ||
        pathname === '/carlosyfrida' ||
        pathname === '/boda-cinematica-motion-premium' ||
        pathname === '/baby-posada' ||
        pathname === '/baby-posada-revelacion' ||
        pathname === '/cecilia-70'
    ) {
        return null;
    }

    const whatsAppUrl = `https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent(MENSAJE_INICIAL)}`;

    const cerrarBurbuja = () => {
        setBurbujaVisible(false);
        try {
            sessionStorage.setItem(CLAVE_BURBUJA_CERRADA, '1');
        } catch {
            // Sin almacenamiento (modo privado estricto): solo se oculta en esta vista.
        }
    };

    return (
        <div className="fixed bottom-20 sm:bottom-6 right-5 sm:right-6 z-40 flex flex-col items-end gap-3">
            {/* Burbuja de ayuda */}
            <div
                role="status"
                aria-hidden={!burbujaVisible}
                className={`relative max-w-[240px] rounded-2xl bg-white shadow-xl shadow-black/10 ring-1 ring-black/5 pl-4 pr-8 py-3 transition-all duration-500 motion-reduce:transition-none ${
                    burbujaVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
            >
                <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={burbujaVisible ? 0 : -1}
                    className="block text-left focus:outline-none"
                >
                    <span className="block text-sm font-bold text-gray-900">¿Tienes dudas? 👋</span>
                    <span className="block text-[13px] leading-snug text-gray-600 mt-0.5">
                        Soy tu asistente virtual. Escríbeme y te ayudo al momento.
                    </span>
                </a>
                <button
                    type="button"
                    onClick={cerrarBurbuja}
                    tabIndex={burbujaVisible ? 0 : -1}
                    aria-label="Cerrar mensaje de ayuda"
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                </button>
                {/* Piquito apuntando al botón */}
                <span
                    aria-hidden="true"
                    className="absolute -bottom-1.5 right-5 w-3 h-3 rotate-45 bg-white ring-1 ring-black/5 [clip-path:polygon(100%_0,100%_100%,0_100%)]"
                />
            </div>

            {/* Botón */}
            <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar por WhatsApp con el asistente virtual de Invitto"
                className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl shadow-[#25D366]/40 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
            >
                {/* Pulso para llamar la atención; se apaga si el usuario pidió menos movimiento */}
                <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 motion-safe:animate-ping [animation-duration:2s]"
                />
                <svg
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    fill="currentColor"
                    aria-hidden="true"
                    className="relative text-white drop-shadow-sm group-hover:rotate-6 transition-transform duration-300"
                >
                    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.301-.777.978-.952 1.179-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.783-1.675-2.083-.175-.301-.019-.464.131-.614.136-.135.301-.351.452-.527.15-.175.2-.3.301-.5.1-.2.05-.376-.025-.526-.075-.15-.678-1.635-.929-2.24-.244-.588-.492-.508-.677-.518-.175-.01-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.301-1.053 1.029-1.053 2.509 0 1.48 1.079 2.91 1.229 3.11.15.201 2.122 3.24 5.14 4.544.718.31 1.279.496 1.716.635.721.23 1.377.198 1.896.12.578-.087 1.78-.727 2.03-1.429.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35zM12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.95.56 3.77 1.53 5.31L2 22l4.82-1.52c1.48.91 3.21 1.44 5.22 1.44 5.53 0 10.02-4.49 10.02-10.02C22.06 6.49 17.57 2 12.04 2zm0 18.25c-1.73 0-3.34-.51-4.7-1.39l-.34-.22-2.86.9.92-2.79-.24-.37c-.98-1.5-1.5-3.26-1.5-5.06 0-4.55 3.7-8.25 8.25-8.25 4.55 0 8.25 3.7 8.25 8.25 0 4.55-3.7 8.25-8.25 8.25z" />
                </svg>
            </a>
        </div>
    );
}
