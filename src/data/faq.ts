export const FAQ_ITEMS = [
    { q: '¿Mis invitados necesitan descargar una app?', a: 'No, ninguno de tus invitados tiene que descargar nada. Tu invitación es una página web responsiva optimizada para móviles que se abre instantáneamente al tocar el enlace.' },
    { q: '¿Cuánto tiempo estará disponible mi invitación?', a: 'Tu invitación estará totalmente activa desde el momento en que la creas hasta 30 días después de que finalice tu evento, permitiéndote consultar y descargar la lista final de asistentes.' },
    { q: '¿Puedo editar la información después de publicarla?', a: 'Sí, por supuesto. Puedes modificar horarios, ubicaciones, textos, fotos y detalles de tus mesas en cualquier momento desde tu panel de control. Los cambios se actualizan al instante en el mismo enlace.' },
    { q: '¿Cómo funciona el RSVP inteligente?', a: 'Cada invitado o familia tiene asignado un número de pases personalizados. Al ingresar su nombre en la invitación, el sistema detecta sus pases disponibles (ej. "3 adultos, 1 de niño") y les permite confirmar quién asistirá. La confirmación actualiza tu panel en tiempo real.' },
    { q: '¿Puedo crear mi invitación sin pagar de inmediato?', a: 'Sí, puedes diseñar tu invitación, cargar tus fotos y configurar todas las secciones de manera totalmente gratuita en modo borrador. Solo realizas el pago único cuando decidas publicarla y compartirla.' },
    { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, American Express) de forma segura a través de Stripe, además de transferencias bancarias (SPEI).' },
    { q: '¿Necesito tarjeta de crédito para empezar a crear?', a: 'No, para registrarte y empezar a diseñar tu invitación en borrador no necesitas ingresar ninguna tarjeta de crédito ni método de pago.' },
    { q: '¿Sirve para XV años y eventos en México?', a: 'Sí, está diseñada especialmente para el mercado mexicano y latinoamericano. Funciona perfecto para bodas, XV años, cumpleaños, bautizos, graduaciones y cualquier evento que requiera control de asistencia.' },
    { q: '¿Cómo comparto la invitación por WhatsApp o redes?', a: 'Una vez que publiques tu invitación, obtendrás un enlace personalizado (ej. invitto.mx/i/mi-evento). Puedes copiar y pegar este enlace en chats de WhatsApp, grupos o redes sociales. Al compartirlo, generará una vista previa automática y elegante de tu evento.' }
];

export const FAQ_JSONLD = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
};
