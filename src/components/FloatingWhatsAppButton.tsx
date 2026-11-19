import { useLocation } from 'react-router-dom';
import { WHATSAPP_SUPPORT_NUMBER } from '../lib/constants';

export default function FloatingWhatsAppButton() {
    const location = useLocation();
    const pathname = location.pathname;

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

    const whatsAppUrl = `https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent('Hola, quiero mi invitación Invitto')}`;

    return (
        <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            className="fixed bottom-20 sm:bottom-6 right-5 sm:right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl shadow-[#25D366]/40 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
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
    );
}
