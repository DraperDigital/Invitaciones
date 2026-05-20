import { Heart, Gem, Crown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface PlanFeature {
  title: string;
  description: string;
}

export interface PlanFaq {
  question: string;
  answer: string;
}

export interface PlanLandingData {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  subcopy: string;
  icon: LucideIcon;
  demoUrl: string;
  seo: {
    title: string;
    description: string;
    path: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
  };
  details: {
    introTitle: string;
    introDesc: string;
  };
  features: PlanFeature[];
  faqs: PlanFaq[];
  jsonLd: any;
}

export const PLANS_LANDING_DATA: Record<string, PlanLandingData> = {
  clasica: {
    id: 'clasico',
    name: 'Clásica',
    price: '$499',
    period: 'MXN',
    description: 'La esencia de tu celebración digital, con la elegancia visual de Invitto.',
    subcopy: '“Solo quiero mi invitación bonita”',
    icon: Heart,
    demoUrl: '/i/bautizo-victoria',
    seo: {
      title: 'Plan Clásica — Invitaciones Digitales Elegantes por $499 MXN',
      description: 'Crea tu invitación digital elegante. Incluye información de evento, cuenta regresiva, mapas, galería de fotos y confirmación vía WhatsApp. Sin mensualidades.',
      path: '/planes/clasica',
    },
    hero: {
      badge: 'Plan Clásica',
      title: 'Elegancia y sencillez para tu evento',
      subtitle: 'La forma más práctica y hermosa de invitar a tus seres queridos. Una plantilla digital premium con todos los datos importantes de tu evento y confirmación directa.',
      cta: 'Adquirir Plan Clásica',
    },
    details: {
      introTitle: 'Una carta de presentación digital de primer nivel',
      introDesc: 'El plan Clásica está pensado para quienes buscan una invitación de alto impacto visual sin la complejidad de gestionar un sistema automatizado de confirmaciones. Tus invitados tendrán toda la información a un clic y te confirmarán directamente por WhatsApp.',
    },
    features: [
      {
        title: 'Diseño Premium Optimizado',
        description: 'Una plantilla móvil que se adapta a cualquier pantalla con tipografías cuidadas y colores a tono con tu celebración.',
      },
      {
        title: 'Información Completa de Evento',
        description: 'Fecha, hora, nombres de los festejados, padres y padrinos. Todo estructurado de forma legible y elegante.',
      },
      {
        title: 'Cuenta Regresiva Activa',
        description: 'Un contador visual dinámico que genera expectativa y muestra el tiempo exacto que falta para el gran día.',
      },
      {
        title: 'Ubicaciones con Navegación',
        description: 'Tus invitados abren la dirección del evento directamente en Google Maps o Waze con un solo toque.',
      },
      {
        title: 'Galería de Fotos Integrada',
        description: 'Comparte hasta 5 fotografías profesionales de su sesión previa para darle un toque íntimo y personal.',
      },
      {
        title: 'Confirmación Simple por WhatsApp',
        description: 'Los invitados dan clic a un botón y se genera un mensaje prellenado directo a tu número de WhatsApp.',
      }
    ],
    faqs: [
      {
        question: '¿Cuánto tiempo permanece activa mi invitación?',
        answer: 'Tu invitación Clásica permanece en línea hasta el día de tu evento y 30 días posteriores para que puedas recordar la celebración.',
      },
      {
        question: '¿Puedo hacer cambios después de comprar?',
        answer: 'Sí. Puedes editar la fecha, horarios, ubicaciones y fotos desde tu panel de Invitto en cualquier momento sin costo adicional.',
      },
      {
        question: '¿Tengo que pagar mensualidades?',
        answer: 'No. El precio de $499 MXN es un pago único. No hay cargos ocultos ni suscripciones de renovación automática.',
      }
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Invitto Plan Clásica',
      description: 'Invitación digital premium con información de evento, mapas, cuenta regresiva y confirmación por WhatsApp.',
      brand: { '@type': 'Brand', name: 'Invitto' },
      offers: {
        '@type': 'Offer',
        price: '499',
        priceCurrency: 'MXN',
        availability: 'https://schema.org/InStock',
        url: 'https://invitto.com.mx/planes/clasica',
      }
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: '$1,699',
    period: 'MXN',
    description: 'Control total de tus invitados, recordatorios y pases asignados.',
    subcopy: '“Ya sé exactamente quién sí va a ir”',
    icon: Gem,
    demoUrl: '/i/boda-isabel-rodrigo-pro',
    seo: {
      title: 'Plan Pro — Invitaciones Digitales con Confirmación y Control de Pases',
      description: 'El plan más completo para eventos en México. Controla los acompañantes, pases individuales, recordatorios por WhatsApp y métricas en tiempo real. $1,699 MXN.',
      path: '/planes/pro',
    },
    hero: {
      badge: 'El Plan Favorito',
      title: 'Control total e inteligente de tus invitados',
      subtitle: 'Evita colados y sorpresas de último momento. Asigna pases específicos por familia, envía recordatorios automáticos y visualiza las confirmaciones en un dashboard profesional.',
      cta: 'Adquirir Plan Pro',
    },
    details: {
      introTitle: 'Se acabó el caos de las confirmaciones manuales',
      introDesc: 'El plan Pro está desarrollado especialmente para eventos de mediana y gran escala como bodas y XV años. Olvídate de perseguir invitados por llamada. Nuestro sistema les asigna un número de pases exacto y te permite ver quién ya leyó el mensaje y quién confirmó.',
    },
    features: [
      {
        title: 'Control de Pases y Acompañantes',
        description: 'Define exactamente cuántas personas de la familia están invitadas. El sistema no les permite confirmar más pases de los asignados.',
      },
      {
        title: 'Dashboard de Control 24/7',
        description: 'Accede a un panel privado que desglosa en tiempo real invitados totales, confirmados, rechazados y pendientes.',
      },
      {
        title: 'Importación Masiva desde Excel',
        description: 'Sube toda tu lista en segundos. Generamos enlaces de invitaciones personalizados para cada familia de forma automática.',
      },
      {
        title: 'Métricas de Lectura (Double Check)',
        description: 'Descubre al instante quién ya abrió su invitación personalizada y quién no la ha visto para optimizar tus recordatorios.',
      },
      {
        title: 'Sugerencias de Hospedaje y Regalos',
        description: 'Integra mesas de regalos (Liverpool, Amazon) y recomendaciones de hoteles con tarifas especiales para invitados foráneos.',
      },
      {
        title: 'Exportación a Excel en un Clic',
        description: 'Descarga la lista final organizada con nombres, asistencia, alérgenos y comentarios para entregársela a tu Wedding Planner o banquetera.',
      }
    ],
    faqs: [
      {
        question: '¿Cómo envían las invitaciones del Plan Pro?',
        answer: 'El sistema genera un enlace único para cada invitado (ej. invitto.com.mx/i/familia-gonzalez). Puedes enviárselo directamente por WhatsApp con un mensaje personalizado. El plan Concierge incluye el envío automatizado si prefieres delegarlo.',
      },
      {
        question: '¿Qué pasa si un invitado cancela a última hora?',
        answer: 'Puedes editar el estado del invitado manualmente desde tu panel al instante. Los datos se actualizan de inmediato en tu dashboard y en el archivo descargable.',
      },
      {
        question: '¿Los invitados necesitan bajar una app?',
        answer: 'No. La invitación abre directamente en el navegador de cualquier smartphone de forma rápida y fluida.',
      }
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Invitto Plan Pro',
      description: 'Invitación digital inteligente con control de pases asignados, lista en tiempo real y métricas de lectura.',
      brand: { '@type': 'Brand', name: 'Invitto' },
      offers: {
        '@type': 'Offer',
        price: '1699',
        priceCurrency: 'MXN',
        availability: 'https://schema.org/InStock',
        url: 'https://invitto.com.mx/planes/pro',
      }
    }
  },
  premium: {
    id: 'premium',
    name: 'Diseño Pro',
    price: '$2,499',
    period: 'MXN',
    description: 'Diseño exclusivo creado desde cero por profesionales para tu evento.',
    subcopy: '“Quiero algo único para mi evento”',
    icon: Crown,
    demoUrl: '/i/xv-regina-2026-premium',
    seo: {
      title: 'Plan Diseño Pro — Invitaciones Digitales a Medida con Diseñadores',
      description: 'Colabora con un diseñador experto para crear una invitación digital única. Incluye dominio propio (.com), sistema Pro de pases y check-in QR. $2,499 MXN.',
      path: '/planes/premium',
    },
    hero: {
      badge: 'Diseño Exclusivo',
      title: 'Diseño 100% único a la medida de tu boda o evento',
      subtitle: 'Trabaja de la mano con nuestro equipo de diseñadores gráficos. Recreamos la papelería física de tu evento, agregamos música de fondo, animaciones personalizadas y dominio propio.',
      cta: 'Adquirir Plan Diseño Pro',
    },
    details: {
      introTitle: 'Lleva tu diseño al siguiente nivel de sofisticación',
      introDesc: 'Si tienes una identidad de boda muy específica, tipografías personalizadas, ilustraciones de tu locación o acuarelas que deseas incluir, el plan Diseño Pro es tu mejor opción. Incluye todas las ventajas del Plan Pro y un dominio personalizado como "maria-y-alejandro.com".',
    },
    features: [
      {
        title: 'Diseñador Gráfico Dedicado',
        description: 'Tú compartes tu moodboard o invitaciones físicas y nuestro equipo se encarga de conceptualizar e implementar tu diseño digital único.',
      },
      {
        title: 'Dominio Personalizado (.com)',
        description: 'Tu invitación tendrá su propia dirección web (ej: boda-isabel-y-rodrigo.com) activa por un año completo, ideal para imprimirla en tarjetas.',
      },
      {
        title: 'Música de Fondo Premium',
        description: 'Acompaña la experiencia de tus invitados con una melodía instrumental o tu canción favorita cargada con reproducción automática fluida.',
      },
      {
        title: 'Sistema de Check-in con QR',
        description: 'Generamos un pase con código QR exclusivo para cada invitado. Tu personal de recepción podrá escanearlo el día del evento para validar pases.',
      },
      {
        title: 'Animaciones de Transición Elegantes',
        description: 'Efectos visuales a la medida, revelaciones suaves al hacer scroll y detalles interactivos que deleitarán a tus invitados.',
      },
      {
        title: 'Todo el Poder del Plan Pro',
        description: 'Conserva el dashboard interactivo de confirmación, control estricto de pases y exportación masiva a Excel sin límites.',
      }
    ],
    faqs: [
      {
        question: '¿Cuánto tiempo tarda la entrega del diseño personalizado?',
        answer: 'Una vez que nos compartes tu información, paleta de colores y recursos, entregamos la propuesta de diseño inicial en un lapso de 3 a 5 días hábiles.',
      },
      {
        question: '¿Qué incluye el dominio personalizado?',
        answer: 'Incluye la compra y configuración de un dominio web `.com` o `.mx` (sujeto a disponibilidad) por 12 meses. Nosotros nos encargamos de todo el enlace técnico.',
      },
      {
        question: '¿Cómo funciona el check-in con código QR?',
        answer: 'Cada invitado recibe un código QR único en su confirmación. El día del evento, tu personal o coordinadores escanean el QR desde cualquier celular para registrar su asistencia y ver cuántos pases tiene la familia.',
      }
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Invitto Plan Diseño Pro',
      description: 'Invitación digital de alta costura diseñada por profesionales con dominio web exclusivo y sistema de registro QR.',
      brand: { '@type': 'Brand', name: 'Invitto' },
      offers: {
        '@type': 'Offer',
        price: '2499',
        priceCurrency: 'MXN',
        availability: 'https://schema.org/InStock',
        url: 'https://invitto.com.mx/planes/premium',
      }
    }
  },
  concierge: {
    id: 'concierge',
    name: 'Concierge',
    price: '$4,499',
    period: 'MXN',
    description: 'Servicio llave en mano. Nosotros nos encargamos de toda la gestión de tus invitados.',
    subcopy: '“Yo no me encargo de nada”',
    icon: Crown,
    demoUrl: '/i/boda-gabriela-arturo-premium',
    seo: {
      title: 'Plan Concierge — Gestión de Invitados y Envío por WhatsApp Humano',
      description: 'Servicio premium de guante blanco. Cargamos tu lista, enviamos las invitaciones uno a uno por WhatsApp y hacemos 4 rondas de confirmación. $4,499 MXN.',
      path: '/planes/concierge',
    },
    hero: {
      badge: 'Servicio VIP',
      title: 'Despreocúpate por completo de las confirmaciones',
      subtitle: 'El único servicio de guante blanco en México. Un asistente dedicado se encarga de subir tus listas, enviar cada invitación personalizada por WhatsApp y realizar el seguimiento humano necesario.',
      cta: 'Adquirir Plan Concierge',
    },
    details: {
      introTitle: 'Un equipo a tu servicio para cuidar de tus invitados',
      introDesc: 'El tiempo antes de tu evento es valioso. No lo desperdicies enviando cientos de mensajes de texto o llamando para confirmar alérgenos. Tu asistente Concierge atiende dudas, coordina los cambios de mesa y entrega un reporte ejecutivo de asistencia impecable.',
    },
    features: [
      {
        title: 'Asistente Humano Dedicado',
        description: 'Se te asigna un concierge especializado disponible vía WhatsApp o llamada para cualquier cambio o solicitud operativa en tu lista.',
      },
      {
        title: 'Envío Uno a Uno vía WhatsApp',
        description: 'No hacemos spam robótico. Enviamos cada invitación una por una con un trato cálido y educado a nombre tuyo para asegurar la entrega.',
      },
      {
        title: '4 Rondes de Seguimiento Estratégico',
        description: 'Contactamos amablemente a los invitados rezagados en fechas clave para garantizar que tu lista de asistencia esté cerrada a tiempo.',
      },
      {
        title: 'Carga de Listas y Depuración',
        description: 'Tú solo nos envías tu Excel o tus contactos escritos como los tengas. Nosotros los ordenamos, limpiamos y subimos por ti.',
      },
      {
        title: 'Atención Directa de Dudas de Invitados',
        description: 'Configuramos una línea dedicada donde tus invitados nos pueden escribir para dudas sobre vestimenta, hoteles recomendados o pases extra.',
      },
      {
        title: 'Reporte de Asistencia Ejecutivo',
        description: 'Un documento PDF de alta calidad que resume estadísticas, alérgenos confirmados, comentarios especiales y la lista maestra ordenada.',
      }
    ],
    faqs: [
      {
        question: '¿Los mensajes se envían de forma automática?',
        answer: 'No. Los enviamos de manera manual y humanizada para evitar bloqueos y garantizar que tus invitados sientan un trato exclusivo e importante.',
      },
      {
        question: '¿Qué pasa si cambian de opinión sobre su asistencia?',
        answer: 'Tus invitados nos pueden escribir a la línea Concierge de soporte. Nosotros realizamos el ajuste en la base de datos de inmediato y te lo notificamos.',
      },
      {
        question: '¿El servicio incluye diseño personalizado?',
        answer: 'Sí. El Plan Concierge incluye todas las ventajas del Plan Diseño Pro: diseñador gráfico dedicado para tu invitación digital y dominio web propio `.com`.',
      }
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Invitto Plan Concierge',
      description: 'Servicio de gestión integral de invitados con envío personalizado por WhatsApp, seguimiento telefónico y reporte ejecutivo.',
      brand: { '@type': 'Brand', name: 'Invitto' },
      offers: {
        '@type': 'Offer',
        price: '4499',
        priceCurrency: 'MXN',
        availability: 'https://schema.org/InStock',
        url: 'https://invitto.com.mx/planes/concierge',
      }
    }
  }
};
