export const RAW_FAQ_ITEMS = [
    { q: '¿Mis invitados necesitan descargar una app?', a: 'No, ninguno de tus invitados tiene que descargar nada. Tu invitación es una página web responsiva optimizada para móviles que se abre instantáneamente al tocar el enlace.' },
    { q: '¿Cuánto tiempo estará disponible mi invitación?', a: 'Tu invitación queda activa desde que la publicas hasta 30 días después de tu evento. Durante ese tiempo la invitación sigue en línea y totalmente funcional, con acceso completo a tu panel para consultar felicitaciones y exportar tu lista final de confirmaciones (RSVP).' },
    { q: '¿Puedo editar la información después de publicarla?', a: 'Sí, por supuesto. Puedes modificar horarios, ubicaciones, textos, fotos y detalles de tus mesas en cualquier momento desde tu panel de control. Los cambios se actualizan al instante en el mismo enlace.' },
    { q: '¿Cómo funciona el RSVP inteligente?', a: 'Cada invitado o familia tiene asignado un número de pases personalizados. Al ingresar su nombre en la invitación, el sistema detecta sus pases disponibles (ej. "3 adultos, 1 de niño") y les permite confirmar quién asistirá. La confirmación actualiza tu panel en tiempo real.' },
    { q: '¿Puedo crear mi invitación sin pagar de inmediato?', a: 'Sí, puedes diseñar tu invitación, cargar tus fotos y configurar todas las secciones de manera totalmente gratuita en modo borrador. Solo realizas el pago único cuando decidas publicarla y compartirla.' },
    { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos tarjeta (Visa, Mastercard, Amex), pagos en efectivo en OXXO y meses sin intereses de forma segura a través de Stripe.' },
    { q: '¿Necesito tarjeta de crédito para empezar a crear?', a: 'No, para registrarte y empezar a diseñar tu invitación en borrador no necesitas ingresar ninguna tarjeta de crédito ni método de pago.' },
    { q: '¿Sirve para XV años y eventos en México?', a: 'Sí, está diseñada especialmente para el mercado mexicano y latinoamericano. Funciona perfecto para bodas, XV años, cumpleaños, bautizos, graduaciones y cualquier evento que requiera control de asistencia.' },
    { q: '¿Tienen la opción de Save the Date antes de la invitación formal?', a: 'Sí. Contamos con Save the Date digital de una sola pantalla con 10 estilos exclusivos, cuenta regresiva, ciudad y botón para que tus invitados agenden la fecha directo en su calendario de Google o Apple. Viene incluido sin costo adicional en los planes Premium y Concierge, o puedes agregarlo a tu evento Clásica o Pro por solo $299 MXN.' },
    { q: '¿Cómo comparto la invitación por WhatsApp o redes?', a: 'Una vez que publiques tu invitación, obtendrás un enlace personalizado (ej. invitto.com.mx/i/mi-evento). Puedes copiar y pegar este enlace en chats de WhatsApp, grupos o redes sociales. Al compartirlo, generará una vista previa automática y elegante de tu evento.' }
];

export const FAQ_ITEMS = RAW_FAQ_ITEMS.map(item => ({
    ...item,
    question: item.q,
    answer: item.a
}));

export const FAQ_JSONLD = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
};
