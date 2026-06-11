import type { LucideIcon } from 'lucide-react';
import {
  Heart, Sparkles, PartyPopper, MapPin, Send, Clock, Shield, Palette,
  BarChart3, QrCode, Users, Globe, Leaf, DollarSign, Smartphone, Zap,
  Star, Music, MessageCircle, Calendar
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────
export interface BenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Step {
  number: string;
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ComparisonRow {
  feature: string;
  invitto: string | boolean;
  competitor: string | boolean;
}

export interface Testimonial {
  quote: string;
  name: string;
  event: string;
}

export interface LandingPageData {
  slug: string;
  seo: {
    title: string;
    description: string;
    path: string;
  };
  hero: {
    badge?: string;
    h1: string;
    subtitle: string;
    cta: string;
  };
  benefits: BenefitItem[];
  steps: Step[];
  comparison?: {
    title: string;
    subtitle: string;
    invittoLabel: string;
    competitorLabel: string;
    rows: ComparisonRow[];
  };
  testimonials: Testimonial[];
  faq: FAQItem[];
  ctaFinal: {
    title: string;
    subtitle: string;
    cta: string;
  };
  jsonLd: object[];
}

// ─── Shared testimonials (reused across pages) ──────────────────────
const TESTIMONIALS_BODA: Testimonial[] = [
  {
    quote: 'Nuestros invitados no paraban de decir lo bonita que era la invitación. El RSVP nos ahorró horas de llamadas.',
    name: 'Cecilia & Andrés',
    event: 'Boda en Querétaro',
  },
  {
    quote: 'La verdad no pensé que algo digital pudiera verse tan elegante. Nos encantó el resultado.',
    name: 'Mariana & Luis',
    event: 'Boda en San Miguel de Allende',
  },
  {
    quote: 'Enviamos la invitación por WhatsApp y en 2 horas ya teníamos 50 confirmaciones. Increíble.',
    name: 'Paola & Diego',
    event: 'Boda en CDMX',
  },
];

const TESTIMONIALS_GENERAL: Testimonial[] = [
  {
    quote: 'Organizar el evento fue mucho más sencillo con el RSVP integrado. Todo en un solo lugar.',
    name: 'Fernanda R.',
    event: 'Cumpleaños 30',
  },
  {
    quote: 'Mis invitados quedaron impresionados con el diseño. Varios me preguntaron cómo la hice.',
    name: 'Sofía M.',
    event: 'XV Años en Guadalajara',
  },
  {
    quote: 'La compartí por WhatsApp y en 2 horas ya tenía 50 confirmaciones. Increíble.',
    name: 'Paola & Diego',
    event: 'Boda en CDMX',
  },
];

// ─── Shared steps ────────────────────────────────────────────────────
const DEFAULT_STEPS: Step[] = [
  {
    number: '01',
    title: 'Elige tu diseño',
    description: 'Explora nuestras plantillas premium diseñadas por profesionales y selecciona la que se adapte a tu estilo.',
  },
  {
    number: '02',
    title: 'Personaliza tu invitación',
    description: 'Agrega los datos de tu evento, elige colores, tipografías y la música de fondo que acompañará tu invitación.',
  },
  {
    number: '03',
    title: 'Comparte por WhatsApp',
    description: 'Envía tu invitación con un link único. Tus invitados confirman asistencia directamente desde su celular.',
  },
];

// ─── Helper to build JSON-LD ─────────────────────────────────────────
function buildJsonLd(data: { title: string; description: string; path: string; faq: FAQItem[] }): object[] {
  const ld: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: data.title,
      description: data.description,
      url: `https://invitto.com.mx${data.path}`,
      publisher: {
        '@type': 'Organization',
        name: 'Invitto',
        url: 'https://invitto.com.mx',
        logo: 'https://invitto.com.mx/logo.png',
      },
    },
  ];

  if (data.faq.length > 0) {
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faq.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    });
  }

  return ld;
}

// =====================================================================
// PAGE DATA
// =====================================================================

export const LANDING_PAGES: Record<string, LandingPageData> = {

  // ── 1. Invitaciones Digitales para Boda ────────────────────────────
  'invitaciones-digitales-boda': {
    slug: 'invitaciones-digitales-boda',
    seo: {
      title: 'Invitaciones Digitales para Boda — Diseño Premium',
      description: 'Crea invitaciones digitales para boda elegantes con RSVP integrado, música y diseño premium. Comparte por WhatsApp en segundos. Hecho en México.',
      path: '/invitaciones-digitales-boda',
    },
    hero: {
      badge: 'Bodas',
      h1: 'Invitaciones digitales para boda que enamoran',
      subtitle: 'Diseños premium con RSVP integrado, música de fondo y la elegancia que tu boda merece. Comparte por WhatsApp y recibe confirmaciones al instante.',
      cta: 'Diseñar mi invitación de boda',
    },
    benefits: [
      { icon: Heart, title: 'Diseños de boda premium', description: 'Plantillas elegantes diseñadas específicamente para bodas, con tipografías románticas y paletas de color sofisticadas.' },
      { icon: Send, title: 'Comparte por WhatsApp', description: 'Un link único que tus invitados abren directo en su celular. Sin descargas, sin apps, sin complicaciones.' },
      { icon: BarChart3, title: 'RSVP en tiempo real', description: 'Recibe confirmaciones al instante. Sabe quién asiste, quién lleva acompañante y las restricciones alimenticias.' },
      { icon: Music, title: 'Música de fondo', description: 'Acompaña tu invitación con la canción que define su historia de amor. Se reproduce automáticamente al abrirla.' },
      { icon: Palette, title: 'Personalización total', description: 'Colores, tipografías, fotos, itinerario, mesa de regalos y hasta código de vestimenta. Todo en un solo lugar.' },
      { icon: QrCode, title: 'Pase de acceso con QR', description: 'Cada invitado recibe un código QR único para control de acceso en la entrada de tu evento.' },
    ],
    steps: DEFAULT_STEPS,
    testimonials: TESTIMONIALS_BODA,
    faq: [
      { question: '¿Cuánto cuesta una invitación digital para boda?', answer: 'Invitto ofrece planes desde $349 MXN. Incluye diseño premium, RSVP integrado, música de fondo y envío ilimitado por WhatsApp. Sin costos por invitado adicional.' },
      { question: '¿Puedo personalizar los colores y la tipografía?', answer: 'Sí, todas nuestras plantillas de boda son 100% personalizables. Puedes cambiar colores, tipografías, fotos, música e incluir tu itinerario, mesa de regalos y código de vestimenta.' },
      { question: '¿Cómo funciona el RSVP digital?', answer: 'Tus invitados confirman asistencia directamente desde la invitación en su celular. Tú ves las confirmaciones en tiempo real en tu panel de control, con filtros por mesa, acompañantes y restricciones alimenticias.' },
      { question: '¿Es posible incluir un mapa de ubicación?', answer: 'Sí, puedes incluir la ubicación de la ceremonia y la recepción con un mapa interactivo de Google Maps integrado directamente en tu invitación.' },
      { question: '¿Puedo enviar la invitación por WhatsApp?', answer: 'Sí, esa es la forma principal de envío. Cada invitación tiene un link único que puedes compartir por WhatsApp, SMS, email o redes sociales. Tus invitados la abren directamente en su navegador sin descargar nada.' },
      { question: '¿Mis invitados necesitan descargar una app?', answer: 'No. Tu invitación es una página web optimizada para celular. Tus invitados solo necesitan abrir el link que les envías para ver la invitación y confirmar asistencia.' },
    ],
    ctaFinal: {
      title: 'Tu boda merece una invitación a la altura',
      subtitle: 'Crea tu invitación digital en minutos y compártela con todos tus invitados por WhatsApp.',
      cta: 'Crear mi invitación de boda',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 2. Invitaciones Digitales para XV Años ─────────────────────────
  'invitaciones-digitales-xv-anos': {
    slug: 'invitaciones-digitales-xv-anos',
    seo: {
      title: 'Invitaciones Digitales para XV Años — Diseños Modernos',
      description: 'Crea invitaciones digitales para XV años con diseños modernos, RSVP integrado y música. Comparte por WhatsApp. Hecho en México.',
      path: '/invitaciones-digitales-xv-anos',
    },
    hero: {
      badge: 'XV Años',
      h1: 'Invitaciones digitales para XV años que brillan',
      subtitle: 'Diseños modernos y elegantes para la quinceañera. Con RSVP integrado, música y toda la información de tu evento en un solo link.',
      cta: 'Diseñar mi invitación de XV',
    },
    benefits: [
      { icon: Sparkles, title: 'Diseños de XV años', description: 'Plantillas vibrantes y modernas pensadas para quinceañeras, con estilos que van de lo clásico a lo contemporáneo.' },
      { icon: Send, title: 'Envía por WhatsApp', description: 'Comparte un link único por WhatsApp. Tus invitados la abren en su celular sin descargar nada.' },
      { icon: BarChart3, title: 'Confirmaciones en vivo', description: 'Recibe las respuestas de asistencia en tiempo real. Organiza mesas y controla el número de invitados fácilmente.' },
      { icon: Music, title: 'Tu vals de fondo', description: 'La canción especial de la quinceañera suena al abrir la invitación. Un toque mágico que sorprende.' },
      { icon: Calendar, title: 'Itinerario completo', description: 'Incluye horario de misa, recepción, vals, brindis y más. Todo claro para tus invitados.' },
      { icon: QrCode, title: 'Pase de acceso QR', description: 'Control de acceso moderno con código QR individual para cada familia invitada.' },
    ],
    steps: DEFAULT_STEPS,
    testimonials: TESTIMONIALS_GENERAL,
    faq: [
      { question: '¿Cuánto cuesta una invitación digital para XV años?', answer: 'Los planes de Invitto comienzan desde $349 MXN e incluyen diseño premium, RSVP integrado, música de fondo y envío ilimitado por WhatsApp.' },
      { question: '¿Puedo poner la canción del vals en la invitación?', answer: 'Sí, puedes elegir cualquier canción como música de fondo para tu invitación. Se reproduce automáticamente cuando tus invitados la abren.' },
      { question: '¿Cómo sé quién va a ir a la fiesta?', answer: 'Cada invitado confirma directamente desde su celular. Tú ves en tiempo real quién va, cuántos acompañantes llevan y cualquier nota especial.' },
      { question: '¿Puedo incluir la ubicación del salón?', answer: 'Sí, incluimos un mapa interactivo de Google Maps con la dirección del salón y de la iglesia si aplica.' },
      { question: '¿Se ve bien en el celular?', answer: 'Sí, todas las invitaciones están optimizadas para verse perfectas en cualquier celular, tablet o computadora.' },
      { question: '¿Puedo agregar la mesa de regalos?', answer: 'Sí, puedes incluir links a tu mesa de regalos de Liverpool, Amazon o cualquier tienda directamente en la invitación.' },
    ],
    ctaFinal: {
      title: 'Haz que sus XV años sean inolvidables desde la invitación',
      subtitle: 'Diseña una invitación a la altura de su día especial.',
      cta: 'Crear mi invitación de XV',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 3. Invitaciones Digitales para Cumpleaños ──────────────────────
  'invitaciones-digitales-cumpleanos': {
    slug: 'invitaciones-digitales-cumpleanos',
    seo: {
      title: 'Invitaciones Digitales para Cumpleaños — Modernas y Fáciles',
      description: 'Crea invitaciones digitales para cumpleaños en minutos. Diseños modernos con RSVP y música. Comparte por WhatsApp. Hecho en México.',
      path: '/invitaciones-digitales-cumpleanos',
    },
    hero: {
      badge: 'Cumpleaños',
      h1: 'Invitaciones digitales para cumpleaños que sorprenden',
      subtitle: 'Diseños divertidos y modernos para cualquier edad. Con RSVP integrado para saber exactamente cuántos asistirán a tu fiesta.',
      cta: 'Crear mi invitación de cumpleaños',
    },
    benefits: [
      { icon: PartyPopper, title: 'Diseños para toda ocasión', description: 'Plantillas para cumpleaños infantiles, 30, 40, 50 años y más. Encuentra el estilo perfecto para tu celebración.' },
      { icon: Send, title: 'Comparte al instante', description: 'Envía tu invitación por WhatsApp en segundos. Sin imprimir, sin sobres, sin estrés.' },
      { icon: Users, title: 'Controla tu lista', description: 'Sabe en todo momento cuántos invitados han confirmado, cuántos faltan por responder y quién lleva acompañante.' },
      { icon: Smartphone, title: 'Perfecta en cualquier celular', description: 'Tu invitación se ve increíble en iPhone, Android, tablet o computadora. Sin apps que descargar.' },
      { icon: Clock, title: 'Lista en 10 minutos', description: 'Elige plantilla, personaliza y comparte. Así de fácil. No necesitas ser diseñador.' },
      { icon: Music, title: 'Música de fondo', description: 'Agrega la canción favorita del festejado para que suene al abrir la invitación.' },
    ],
    steps: DEFAULT_STEPS,
    testimonials: TESTIMONIALS_GENERAL,
    faq: [
      { question: '¿Puedo crear una invitación de cumpleaños gratis?', answer: 'Invitto ofrece la opción de crear y previsualizar tu invitación antes de pagar. Los planes con funciones premium comienzan desde $349 MXN.' },
      { question: '¿Sirve para cumpleaños infantiles?', answer: 'Sí, tenemos diseños divertidos y coloridos pensados para fiestas infantiles, así como opciones más elegantes para adultos.' },
      { question: '¿Cuántos invitados puedo incluir?', answer: 'No hay límite de invitados. Puedes compartir el link con tantas personas como necesites sin costos adicionales.' },
      { question: '¿Puedo poner la hora y dirección de la fiesta?', answer: 'Sí, incluye todos los detalles: fecha, hora, dirección con mapa interactivo, código de vestimenta y notas especiales.' },
      { question: '¿Cómo confirman los invitados?', answer: 'Tus invitados abren el link en su celular y confirman con un botón. Tú ves todas las respuestas en tu panel en tiempo real.' },
    ],
    ctaFinal: {
      title: 'Haz que tu cumpleaños empiece con una gran invitación',
      subtitle: 'Diseña tu invitación en minutos y compártela al instante.',
      cta: 'Diseñar mi invitación',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 4. Invitaciones Digitales CDMX ─────────────────────────────────
  'invitaciones-digitales-cdmx': {
    slug: 'invitaciones-digitales-cdmx',
    seo: {
      title: 'Invitaciones Digitales en CDMX — Bodas, XV Años y Más',
      description: 'Crea invitaciones digitales en la Ciudad de México para bodas, XV años y cumpleaños. Diseño premium con RSVP. Envía por WhatsApp.',
      path: '/invitaciones-digitales-cdmx',
    },
    hero: {
      badge: 'Ciudad de México',
      h1: 'Invitaciones digitales para eventos en CDMX',
      subtitle: 'La plataforma mexicana preferida para crear invitaciones de boda, XV años y todo tipo de celebraciones en la Ciudad de México.',
      cta: 'Crear mi invitación',
    },
    benefits: [
      { icon: MapPin, title: 'Hecho para la CDMX', description: 'Mapas integrados con las mejores ubicaciones de salones, iglesias y jardines de la Ciudad de México y zona metropolitana.' },
      { icon: Send, title: 'Envía por WhatsApp', description: 'Comparte tu invitación al instante. Ideal para el ritmo de la ciudad, donde todos están conectados.' },
      { icon: Globe, title: 'Invitados de fuera', description: '¿Tienes invitados que vienen de otras ciudades? Tu invitación incluye toda la información que necesitan para llegar.' },
      { icon: BarChart3, title: 'RSVP en tiempo real', description: 'Confirma asistencia de cientos de invitados sin perder el control. Panel de gestión incluido.' },
      { icon: Palette, title: 'Diseños premium', description: 'Plantillas elegantes para bodas, XV años, cumpleaños y todo tipo de celebraciones.' },
      { icon: Shield, title: 'Plataforma mexicana', description: 'Invitto es una empresa 100% mexicana. Tu información está segura y el soporte es en español.' },
    ],
    steps: DEFAULT_STEPS,
    testimonials: TESTIMONIALS_GENERAL,
    faq: [
      { question: '¿Invitto funciona para eventos en toda la CDMX?', answer: 'Sí, Invitto funciona para eventos en cualquier parte de la Ciudad de México y zona metropolitana. Puedes agregar la ubicación exacta de tu evento con mapa interactivo.' },
      { question: '¿Puedo incluir información de hoteles cercanos?', answer: 'Sí, puedes agregar recomendaciones de hoteles, estacionamiento y cualquier indicación útil para tus invitados que vienen de fuera.' },
      { question: '¿Las invitaciones se pueden compartir por WhatsApp?', answer: 'Sí, WhatsApp es la forma principal de envío. Cada invitación tiene un link único que tus invitados abren directamente en su navegador.' },
      { question: '¿Tienen diseños para bodas en jardines y haciendas?', answer: 'Sí, tenemos plantillas diseñadas para todo tipo de venue: jardines, haciendas, salones, playas y más.' },
      { question: '¿Cuánto tiempo tarda en estar lista mi invitación?', answer: 'Puedes tener tu invitación lista en menos de 15 minutos. Elige plantilla, personaliza y comparte.' },
    ],
    ctaFinal: {
      title: 'Tu evento en CDMX merece una invitación digital premium',
      subtitle: 'Únete a cientos de parejas y familias que ya confían en Invitto.',
      cta: 'Empezar ahora',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 5. Invitaciones Digitales Guadalajara ──────────────────────────
  'invitaciones-digitales-guadalajara': {
    slug: 'invitaciones-digitales-guadalajara',
    seo: {
      title: 'Invitaciones Digitales en Guadalajara — Bodas y XV Años',
      description: 'Crea invitaciones digitales en Guadalajara para bodas, XV años y eventos. Diseño premium, RSVP integrado. Comparte por WhatsApp.',
      path: '/invitaciones-digitales-guadalajara',
    },
    hero: {
      badge: 'Guadalajara',
      h1: 'Invitaciones digitales para eventos en Guadalajara',
      subtitle: 'Diseños premium para bodas, XV años y celebraciones en la Perla Tapatía. Comparte por WhatsApp y recibe confirmaciones al instante.',
      cta: 'Crear mi invitación',
    },
    benefits: [
      { icon: MapPin, title: 'Hecho para Guadalajara', description: 'Mapas integrados con las mejores ubicaciones de salones, jardines y haciendas de la zona metropolitana de Guadalajara.' },
      { icon: Heart, title: 'Bodas tapatías', description: 'Plantillas elegantes que combinan perfectamente con el estilo y la tradición de las bodas jaliscienses.' },
      { icon: Send, title: 'Comparte por WhatsApp', description: 'Tu invitación llega al instante a todos tus invitados con un solo link.' },
      { icon: BarChart3, title: 'RSVP en tiempo real', description: 'Controla la lista de invitados desde tu celular. Sabe quién va y quién falta por confirmar.' },
      { icon: Music, title: 'Música de fondo', description: 'Desde mariachi hasta canciones modernas. Elige la música que acompañará tu invitación.' },
      { icon: Shield, title: '100% mexicana', description: 'Invitto es una plataforma hecha en México para mexicanos. Soporte en español y precios en pesos.' },
    ],
    steps: DEFAULT_STEPS,
    testimonials: TESTIMONIALS_GENERAL,
    faq: [
      { question: '¿Invitto funciona para eventos en toda la zona metropolitana de Guadalajara?', answer: 'Sí, funciona para eventos en Guadalajara, Zapopan, Tlaquepaque, Tonalá y toda la zona metropolitana. Incluye mapas interactivos para cualquier ubicación.' },
      { question: '¿Tienen diseños con estilo mexicano?', answer: 'Sí, tenemos plantillas que combinan elegancia moderna con toques tradicionales mexicanos. Perfectas para bodas y XV años en Jalisco.' },
      { question: '¿Cuánto cuesta?', answer: 'Los planes comienzan desde $349 MXN. Incluye diseño premium, RSVP integrado, música y envío ilimitado por WhatsApp.' },
      { question: '¿Puedo incluir la ubicación de la iglesia y el salón?', answer: 'Sí, puedes agregar múltiples ubicaciones con mapas interactivos de Google Maps.' },
      { question: '¿Se puede personalizar completamente?', answer: 'Sí, puedes cambiar colores, tipografías, fotos, música, itinerario y más. Tu invitación, a tu estilo.' },
    ],
    ctaFinal: {
      title: 'Guadalajara celebra mejor con Invitto',
      subtitle: 'Crea tu invitación digital en minutos y sorprende a tus invitados.',
      cta: 'Diseñar mi invitación',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 6. Invitaciones Digitales Monterrey ────────────────────────────
  'invitaciones-digitales-monterrey': {
    slug: 'invitaciones-digitales-monterrey',
    seo: {
      title: 'Invitaciones Digitales en Monterrey — Bodas y Eventos',
      description: 'Crea invitaciones digitales en Monterrey para bodas, XV años y eventos. Diseño premium con RSVP integrado. Envía por WhatsApp.',
      path: '/invitaciones-digitales-monterrey',
    },
    hero: {
      badge: 'Monterrey',
      h1: 'Invitaciones digitales para eventos en Monterrey',
      subtitle: 'La plataforma mexicana preferida para invitaciones de boda, XV años y celebraciones en la Sultana del Norte. Diseño premium con RSVP.',
      cta: 'Crear mi invitación',
    },
    benefits: [
      { icon: MapPin, title: 'Hecho para Monterrey', description: 'Incluye mapas con las mejores ubicaciones de salones, quintas y jardines de Monterrey y su zona metropolitana.' },
      { icon: Zap, title: 'Rápido y eficiente', description: 'Como buen regio, directo al punto. Tu invitación lista en menos de 15 minutos.' },
      { icon: Send, title: 'Comparte por WhatsApp', description: 'Un link único para compartir tu invitación con todos tus invitados al instante.' },
      { icon: BarChart3, title: 'Control total', description: 'Dashboard en tiempo real para ver confirmaciones, gestionar mesas y exportar listas para tu banquetero.' },
      { icon: Palette, title: 'Diseño premium', description: 'Plantillas elegantes y modernas que reflejan el estilo y la sofisticación de la sociedad regiomontana.' },
      { icon: Shield, title: 'Plataforma mexicana', description: 'Tu información segura en una empresa 100% mexicana. Soporte rápido en español.' },
    ],
    steps: DEFAULT_STEPS,
    testimonials: TESTIMONIALS_GENERAL,
    faq: [
      { question: '¿Invitto funciona para eventos en toda el área metropolitana de Monterrey?', answer: 'Sí, funciona para Monterrey, San Pedro Garza García, San Nicolás, Apodaca, Escobedo y toda el área metropolitana. Incluye mapas interactivos.' },
      { question: '¿Puedo usar la invitación para eventos corporativos?', answer: 'Sí, Invitto funciona perfectamente para eventos empresariales, cenas de gala, aniversarios y más.' },
      { question: '¿Los invitados necesitan descargar algo?', answer: 'No, la invitación se abre directamente en el navegador del celular. Sin apps ni descargas.' },
      { question: '¿Cuánto cuesta una invitación digital?', answer: 'Los planes comienzan desde $349 MXN. Sin costos por invitado adicional.' },
      { question: '¿Puedo ver quién ya confirmó?', answer: 'Sí, tienes un panel de control donde ves todas las confirmaciones en tiempo real con nombre, número de acompañantes y notas.' },
    ],
    ctaFinal: {
      title: 'Monterrey celebra con estilo digital',
      subtitle: 'Crea tu invitación premium en minutos y compártela con un click.',
      cta: 'Empezar ahora',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 6.5 Invitaciones Digitales León ────────────────────────────────
  'invitaciones-digitales-leon': {
    slug: 'invitaciones-digitales-leon',
    seo: {
      title: 'Invitaciones Digitales en León, Gto — Bodas y XV Años',
      description: 'Crea invitaciones digitales en León, Guanajuato para bodas y XV años. Diseño premium con RSVP integrado. Envía por WhatsApp en segundos.',
      path: '/invitaciones-digitales-leon',
    },
    hero: {
      badge: 'León, Guanajuato',
      h1: 'Invitaciones digitales para eventos en León',
      subtitle: 'La plataforma ideal para invitaciones de boda, XV años y celebraciones en el Bajío. Diseño premium con RSVP.',
      cta: 'Crear mi invitación',
    },
    benefits: [
      { icon: MapPin, title: 'Hecho para León y el Bajío', description: 'Incluye mapas con las mejores ubicaciones de salones, ex-haciendas y jardines de León, Silao y Guanajuato.' },
      { icon: Zap, title: 'Rápido y moderno', description: 'Tu invitación lista en minutos. Sorprende a tus invitados con una experiencia totalmente digital.' },
      { icon: Send, title: 'Comparte por WhatsApp', description: 'Un link único para compartir tu invitación con todos tus familiares y amigos al instante.' },
      { icon: BarChart3, title: 'Control total de invitados', description: 'Dashboard en tiempo real para ver confirmaciones, ideal para eventos grandes en la región.' },
      { icon: Palette, title: 'Diseño elegante', description: 'Plantillas de alta gama que reflejan el buen gusto y la importancia de tu celebración.' },
      { icon: Shield, title: 'Plataforma mexicana', description: 'Soporte rápido en español. Hecho en México para las tradiciones mexicanas.' },
    ],
    steps: DEFAULT_STEPS,
    testimonials: TESTIMONIALS_GENERAL,
    faq: [
      { question: '¿Invitto funciona para eventos en todo Guanajuato?', answer: 'Sí, funciona perfectamente para León, Irapuato, Celaya, Guanajuato capital y todo el Bajío. Incluye mapas interactivos para cualquier recinto.' },
      { question: '¿Puedo enviar las invitaciones a invitados foráneos?', answer: '¡Por supuesto! Las invitaciones digitales son ideales para compartir la ubicación, opciones de hotel y detalles del evento a familiares que vienen de otras ciudades.' },
      { question: '¿Los invitados necesitan alguna aplicación?', answer: 'No, la invitación se abre directamente en el navegador de cualquier celular. Sin apps ni descargas.' },
      { question: '¿Cuánto cuesta una invitación digital?', answer: 'Los planes comienzan desde $349 MXN. Sin límite de envíos ni costos por invitado adicional.' },
    ],
    ctaFinal: {
      title: 'Tu evento en León merece la mejor invitación',
      subtitle: 'Crea tu invitación premium en minutos y compártela con un click.',
      cta: 'Empezar ahora',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 7. Invitaciones Digitales vs Papel ─────────────────────────────
  'invitaciones-digitales-vs-papel': {
    slug: 'invitaciones-digitales-vs-papel',
    seo: {
      title: 'Invitaciones Digitales vs Papel — ¿Cuál es Mejor?',
      description: 'Compara invitaciones digitales vs papel: costo, tiempo, impacto ambiental y experiencia. Descubre por qué lo digital gana en 2026.',
      path: '/invitaciones-digitales-vs-papel',
    },
    hero: {
      badge: 'Comparativa',
      h1: 'Invitaciones digitales vs papel: ¿cuál conviene más?',
      subtitle: 'Analizamos costo, tiempo de entrega, impacto ambiental y experiencia del invitado para ayudarte a elegir la mejor opción para tu evento.',
      cta: 'Probar invitación digital',
    },
    benefits: [
      { icon: DollarSign, title: 'Hasta 90% más económicas', description: 'Una invitación de papel para boda cuesta $30-80 MXN por pieza. Con Invitto pagas una vez e invitas a todos sin límite.' },
      { icon: Clock, title: 'Lista en minutos, no semanas', description: 'Las invitaciones de papel tardan 2-4 semanas entre diseño, impresión y distribución. Con Invitto, la tienes lista hoy.' },
      { icon: Leaf, title: 'Cero huella ambiental', description: 'Sin papel, sin tinta, sin transporte. Tu invitación digital es 100% ecológica.' },
      { icon: BarChart3, title: 'RSVP automático', description: 'Con papel necesitas llamar uno por uno. Con digital, tus invitados confirman con un botón y tú ves todo en tu panel.' },
      { icon: Smartphone, title: 'Siempre accesible', description: 'Tu invitado la tiene en su celular. No se pierde, no se arruga, no se olvida en el cajón.' },
      { icon: Palette, title: 'Actualizable al instante', description: '¿Cambió la hora o el salón? Actualiza tu invitación digital en segundos. Con papel, hay que reimprimir todo.' },
    ],
    steps: DEFAULT_STEPS,
    comparison: {
      title: 'Comparativa lado a lado',
      subtitle: 'Así se compara una invitación digital de Invitto contra una invitación de papel tradicional.',
      invittoLabel: 'Invitto (Digital)',
      competitorLabel: 'Papel Tradicional',
      rows: [
        { feature: 'Costo por 150 invitados', invitto: 'Desde $349 MXN (total)', competitor: '$4,500 — $12,000 MXN' },
        { feature: 'Tiempo de entrega', invitto: '15 minutos', competitor: '2 — 4 semanas' },
        { feature: 'RSVP integrado', invitto: true, competitor: false },
        { feature: 'Música de fondo', invitto: true, competitor: false },
        { feature: 'Mapa interactivo', invitto: true, competitor: false },
        { feature: 'Actualizable después de enviar', invitto: true, competitor: false },
        { feature: 'Ecológica', invitto: true, competitor: false },
        { feature: 'Pase de acceso con QR', invitto: true, competitor: false },
        { feature: 'Control de asistencia en tiempo real', invitto: true, competitor: false },
      ],
    },
    testimonials: TESTIMONIALS_BODA,
    faq: [
      { question: '¿Es mal visto enviar una invitación digital a una boda?', answer: 'No, al contrario. En 2026 las invitaciones digitales son la norma en México. Ofrecen una experiencia interactiva mucho más rica que el papel y tus invitados las agradecen por la comodidad.' },
      { question: '¿Puedo complementar digital con algunas de papel?', answer: 'Sí, muchas parejas envían digital a la mayoría e imprimen unas pocas para familiares mayores. Invitto facilita ambas estrategias.' },
      { question: '¿Se ve tan elegante como una de papel?', answer: 'Sí, e incluso más. Las invitaciones de Invitto incluyen animaciones, música y diseño profesional que el papel no puede ofrecer.' },
      { question: '¿Cuánto me ahorro vs papel?', answer: 'Para una boda de 150 invitados, una invitación de papel cuesta entre $4,500 y $12,000 MXN. Con Invitto, desde $349 MXN por todo. Un ahorro de hasta 90%.' },
    ],
    ctaFinal: {
      title: 'Elige lo inteligente. Elige digital.',
      subtitle: 'Crea tu invitación premium hoy y ahorra tiempo, dinero y árboles.',
      cta: 'Crear mi invitación digital',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 8. Invitto vs Paperless Post ───────────────────────────────────
  'invitto-vs-paperless-post': {
    slug: 'invitto-vs-paperless-post',
    seo: {
      title: 'Invitto vs Paperless Post — Comparativa Completa 2026',
      description: 'Compara Invitto vs Paperless Post: precios en pesos, funciones, diseño y soporte. Descubre por qué Invitto es la mejor opción en México.',
      path: '/invitto-vs-paperless-post',
    },
    hero: {
      badge: 'vs Paperless Post',
      h1: 'Invitto vs Paperless Post: ¿cuál es mejor para México?',
      subtitle: 'Paperless Post fue diseñada para el mercado estadounidense. Invitto fue creada desde cero para México. Compara funciones, precios y experiencia.',
      cta: 'Probar Invitto gratis',
    },
    benefits: [
      { icon: DollarSign, title: 'Precios en pesos mexicanos', description: 'Sin sorpresas con tipo de cambio. Invitto cobra en MXN con precios justos para el mercado mexicano.' },
      { icon: MessageCircle, title: 'Optimizado para WhatsApp', description: 'En México se comparte por WhatsApp, no por email. Invitto está diseñado para eso desde el primer día.' },
      { icon: Globe, title: 'Contenido en español', description: 'Toda la plataforma, los diseños y el soporte están 100% en español mexicano. Sin traducciones genéricas.' },
      { icon: BarChart3, title: 'RSVP integrado', description: 'Panel de control con confirmaciones en tiempo real, gestión de mesas y exportación de listas.' },
      { icon: Music, title: 'Música incluida', description: 'Paperless Post no incluye música. Invitto permite agregar la canción perfecta para tu evento.' },
      { icon: QrCode, title: 'Pase de acceso QR', description: 'Control de acceso profesional incluido en tu plan. Paperless Post no lo ofrece.' },
    ],
    steps: DEFAULT_STEPS,
    comparison: {
      title: 'Invitto vs Paperless Post',
      subtitle: 'Comparativa detallada de funciones y precios.',
      invittoLabel: 'Invitto',
      competitorLabel: 'Paperless Post',
      rows: [
        { feature: 'Idioma nativo', invitto: 'Español mexicano', competitor: 'Inglés (traducciones parciales)' },
        { feature: 'Moneda', invitto: 'Pesos MXN', competitor: 'Dólares USD' },
        { feature: 'Envío principal', invitto: 'WhatsApp', competitor: 'Email' },
        { feature: 'Música de fondo', invitto: true, competitor: false },
        { feature: 'RSVP con gestión de mesas', invitto: true, competitor: false },
        { feature: 'Pase de acceso QR', invitto: true, competitor: false },
        { feature: 'Soporte en español', invitto: true, competitor: false },
        { feature: 'Precio por evento', invitto: 'Desde $349 MXN', competitor: 'Desde $20 USD (~$360 MXN)' },
      ],
    },
    testimonials: TESTIMONIALS_BODA,
    faq: [
      { question: '¿Paperless Post funciona bien en México?', answer: 'Paperless Post fue diseñada para el mercado americano. Su método principal de envío es email, no WhatsApp, y sus precios están en dólares. Invitto fue creada específicamente para México.' },
      { question: '¿Invitto es más barato que Paperless Post?', answer: 'Sí, los precios son similares en monto pero Invitto cobra en pesos sin comisiones de tipo de cambio. Además incluye funciones como música y QR que Paperless Post no ofrece.' },
      { question: '¿Puedo enviar mi invitación por WhatsApp con Paperless Post?', answer: 'Paperless Post está diseñado para email. Puedes compartir un link por WhatsApp pero la experiencia no está optimizada para ello. Invitto está construido nativamente para WhatsApp.' },
      { question: '¿Cuál tiene mejores diseños para bodas mexicanas?', answer: 'Invitto tiene plantillas diseñadas específicamente para el estilo y las tradiciones de bodas mexicanas. Paperless Post ofrece diseños más genéricos orientados al mercado americano.' },
    ],
    ctaFinal: {
      title: 'La alternativa mexicana a Paperless Post',
      subtitle: 'Todo lo que necesitas para tu evento, hecho para México.',
      cta: 'Crear mi invitación con Invitto',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 9. Invitto vs Greenvelope ──────────────────────────────────────
  'invitto-vs-greenvelope': {
    slug: 'invitto-vs-greenvelope',
    seo: {
      title: 'Invitto vs Greenvelope — Comparativa México 2026',
      description: 'Compara Invitto vs Greenvelope: funciones, precios en pesos y experiencia para eventos en México. Descubre la mejor opción.',
      path: '/invitto-vs-greenvelope',
    },
    hero: {
      badge: 'vs Greenvelope',
      h1: 'Invitto vs Greenvelope: ¿cuál elegir en México?',
      subtitle: 'Greenvelope se enfoca en el mercado americano con envío por email. Invitto está optimizada para WhatsApp, en español y con precios en pesos.',
      cta: 'Probar Invitto gratis',
    },
    benefits: [
      { icon: DollarSign, title: 'Precios en pesos', description: 'Sin conversiones ni cargos internacionales. Paga en tu moneda con precios justos para México.' },
      { icon: MessageCircle, title: 'WhatsApp-first', description: 'En México el 95% de la gente usa WhatsApp. Invitto está diseñado para compartir por ahí. Greenvelope depende del email.' },
      { icon: Globe, title: 'Todo en español', description: 'Plataforma, plantillas, soporte y textos predeterminados — todo en español mexicano, no en traducciones automáticas.' },
      { icon: Music, title: 'Música de fondo', description: 'Greenvelope no permite música. Con Invitto, tu invitación cobra vida con la canción de tu evento.' },
      { icon: QrCode, title: 'QR para acceso', description: 'Código QR individual para cada invitado. Control de acceso profesional incluido.' },
      { icon: Star, title: 'Diseño mexicano', description: 'Plantillas pensadas para bodas, XV años y fiestas de cumpleaños con el estilo mexicano.' },
    ],
    steps: DEFAULT_STEPS,
    comparison: {
      title: 'Invitto vs Greenvelope',
      subtitle: 'Funciones comparadas para el mercado mexicano.',
      invittoLabel: 'Invitto',
      competitorLabel: 'Greenvelope',
      rows: [
        { feature: 'Idioma nativo', invitto: 'Español mexicano', competitor: 'Inglés' },
        { feature: 'Moneda', invitto: 'Pesos MXN', competitor: 'Dólares USD' },
        { feature: 'Canal principal', invitto: 'WhatsApp', competitor: 'Email' },
        { feature: 'Música de fondo', invitto: true, competitor: false },
        { feature: 'Pase de acceso QR', invitto: true, competitor: false },
        { feature: 'RSVP con mesas', invitto: true, competitor: 'Parcial' },
        { feature: 'Soporte en español', invitto: true, competitor: false },
        { feature: 'Precio', invitto: 'Desde $349 MXN', competitor: 'Desde $49 USD (~$900 MXN)' },
      ],
    },
    testimonials: TESTIMONIALS_BODA,
    faq: [
      { question: '¿Greenvelope funciona en México?', answer: 'Greenvelope opera desde Estados Unidos. Su plataforma está en inglés, cobra en dólares y su método de envío principal es email, no WhatsApp.' },
      { question: '¿Invitto es más barato que Greenvelope?', answer: 'Sí, significativamente. Greenvelope cobra desde $49 USD (~$900 MXN), mientras que Invitto comienza desde $349 MXN con más funciones incluidas.' },
      { question: '¿Cuál tiene mejor soporte para bodas mexicanas?', answer: 'Invitto fue creada en México para bodas mexicanas. Los diseños, el idioma y las funciones están pensados para nuestras tradiciones y costumbres.' },
      { question: '¿Puedo migrar de Greenvelope a Invitto?', answer: 'Sí, puedes crear tu invitación desde cero en Invitto en menos de 15 minutos. No necesitas migrar datos — simplemente comparte tu nuevo link.' },
    ],
    ctaFinal: {
      title: 'La mejor alternativa a Greenvelope en México',
      subtitle: 'Más funciones, mejor precio, hecho para ti.',
      cta: 'Comenzar con Invitto',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 10. Invitto vs Otras Plataformas ──────────────────────────────
  'invitto-vs-otras-plataformas': {
    slug: 'invitto-vs-otras-plataformas',
    seo: {
      title: 'Invitto vs Otras Plataformas de Invitaciones Digitales',
      description: 'Comparativa de Invitto contra Canva, Paperless Post, Greenvelope y otras alternativas. Analizamos precios, funciones y facilidad de envío por WhatsApp.',
      path: '/invitto-vs-otras-plataformas',
    },
    hero: {
      badge: 'Comparativa General',
      h1: 'Invitto vs Otras Plataformas de Invitaciones',
      subtitle: '¿Por qué elegir Invitto en lugar de opciones gratuitas o plataformas extranjeras? Descubre la diferencia en funciones, diseño y RSVP inteligente.',
      cta: 'Diseñar con Invitto',
    },
    benefits: [
      { icon: Zap, title: 'Más que un simple diseño plano', description: 'A diferencia de enviar un PDF o imagen estática, Invitto es una web interactiva con botones, mapas y animaciones.' },
      { icon: BarChart3, title: 'Control de asistencia (RSVP) real', description: 'Otras plataformas solo te dan diseño. Invitto te da tecnología para saber quién asiste y gestionar tus pases.' },
      { icon: MessageCircle, title: 'El mejor envío por WhatsApp', description: 'Las plataformas globales están pensadas para email. Invitto genera las mejores tarjetas de previsualización para WhatsApp.' },
      { icon: QrCode, title: 'Boletos QR integrados', description: 'La mayoría de las plataformas te cobran extra por accesos. En Invitto, el control por código QR viene incluido en tu plan.' },
      { icon: DollarSign, title: 'Precios claros en pesos (MXN)', description: 'Sin suscripciones mensuales ocultas ni cargos en dólares. Paga una sola vez por evento en tu propia moneda.' },
      { icon: Shield, title: 'Soporte humano en español', description: 'Si tienes dudas, no hablas con un robot en inglés. Tienes soporte dedicado en México listo para ayudarte.' },
    ],
    steps: DEFAULT_STEPS,
    comparison: {
      title: 'Comparativa General',
      subtitle: 'Invitto frente a las alternativas más comunes del mercado.',
      invittoLabel: 'Invitto',
      competitorLabel: 'Otras (Canva, PDFs, etc.)',
      rows: [
        { feature: 'Formatos interactivos', invitto: true, competitor: 'No (Suelen ser imágenes o PDFs)' },
        { feature: 'RSVP y conteo de asistentes', invitto: true, competitor: false },
        { feature: 'Envío nativo para WhatsApp', invitto: true, competitor: 'Parcial' },
        { feature: 'Control de pases por familia', invitto: true, competitor: false },
        { feature: 'Música de fondo', invitto: true, competitor: false },
        { feature: 'Google Maps y Waze', invitto: true, competitor: 'A veces' },
        { feature: 'Soporte y diseño en México', invitto: true, competitor: false },
      ],
    },
    testimonials: TESTIMONIALS_BODA,
    faq: [
      { question: '¿Por qué pagar por Invitto si puedo hacer una invitación gratis en Canva?', answer: 'Una imagen gratis solo cumple la función de avisar. Invitto resuelve la organización: te permite limitar el número de pases por invitado, te da un panel de confirmaciones (RSVP) en tiempo real y ofrece una experiencia web con botones y música. El ahorro en tiempo y control compensa el costo.' },
      { question: '¿Cuáles son las alternativas a Invitto?', answer: 'Existen creadores de PDFs interactivos, agencias de diseño web y plataformas extranjeras como Paperless Post o Greenvelope. Invitto se posiciona en el punto dulce: la tecnología de una plataforma global pero tropicalizada para los precios, el idioma y las costumbres de México.' },
      { question: '¿Invitto es solo para bodas?', answer: 'No, la plataforma y sus funciones tecnológicas se adaptan perfectamente a XV años, Bautizos, Cumpleaños y Eventos Corporativos. El control de accesos funciona igual para cualquier celebración.' },
    ],
    ctaFinal: {
      title: 'La decisión inteligente para tu evento',
      subtitle: 'Más tecnología. Mejor precio. La herramienta definitiva.',
      cta: 'Empieza a crear gratis',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },
};
