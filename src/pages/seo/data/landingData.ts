import type { LucideIcon } from 'lucide-react';
import {
  Heart, MapPin, Send, Clock, Shield, Palette,
  BarChart3, QrCode, Globe, Leaf, DollarSign, Smartphone, Zap,
  Star, Music, MessageCircle
} from 'lucide-react';

// ─── Base Types ───────────────────────────────────────────────────────
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

// ─── Event Landing Specific Types (11-step sales structure) ───────────
export interface EventThemeConfig {
  key: 'boda' | 'xv' | 'cumpleanos' | 'bautizo' | 'comunion' | 'baby_shower' | 'gender_reveal' | 'graduacion';
  bg: string;
  bg2: string;
  ink: string;
  muted: string;
  line: string;
  dark: string;
  darkInk: string;
  accent: string;
  accentText: string;
  btn: string;
  btnInk: string;
  btnRing: string;
  fontHead?: string;
  fontBody?: string;
}

export interface EventPhoneMockup {
  category: string;
  topBadge: string;
  title: string;
  dateStr: string;
  targetDate: string; // ISO string for live countdown
  guestName: string;
  passesText: string;
  rsvpDoneToast: string;
}

export interface RecommendedPlan {
  badge: string;
  name: string;
  price: string;
  period: string;
  note: string;
  features: string[];
  savingsText: string;
  ctaText: string;
  ctaMicro?: string;
}

export interface AltPlan {
  title: string;
  subtitle: string;
  priceOrAction: string;
  href?: string;
}

export interface ObjectionItem {
  question: string;
  answer: string;
}

export interface LandingPageData {
  slug: string;
  isEventLanding?: boolean;
  eventType?: 'wedding' | 'xv' | 'birthday' | 'bautizo' | 'primera_comunion' | 'baby_shower' | 'gender_reveal' | 'graduacion';
  theme?: EventThemeConfig;
  eyebrow?: string;
  h1Highlight?: string;
  h1Suffix?: string;
  h1Prefix?: string;
  waMessage?: string;

  phone?: EventPhoneMockup;
  problemTitle?: string;
  problemItems?: string[];
  showSeatsStat?: boolean;
  outcomeTitle?: string;
  outcomeItems?: string[];
  stepsTitle?: string;
  salesSteps?: { title: string; description: string }[];
  whyTitle?: string;
  whyLead?: string;
  whyCards?: { title: string; description: string }[];
  recommendedPlan?: RecommendedPlan;
  altPlans?: AltPlan[];
  proofTitle?: string;
  proofLead?: string;
  demoCategory?: string;
  objectionsTitle?: string;
  objections?: ObjectionItem[];
  guaranteeTitle?: string;
  guaranteeText?: string;
  guaranteeExtra?: string;
  closingTitle?: string;
  closingLead?: string;
  closingCta?: string;

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

// ─── Shared steps for city / comparative landings ────────────────────
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
    isEventLanding: true,
    eventType: 'wedding',
    theme: {
      key: 'boda',
      bg: '#FAF7F2',
      bg2: '#F2ECE2',
      ink: '#1C1C1C',
      muted: '#5E5850',
      line: '#E3D9C9',
      dark: '#1C1C1C',
      darkInk: '#FAF7F2',
      accent: '#B8935A',
      accentText: '#8C6A35',
      btn: '#1C1C1C',
      btnInk: '#FAF7F2',
      btnRing: '#B8935A',
      fontHead: "'Cormorant Garamond', Georgia, serif",
      fontBody: "'Inter', sans-serif",
    },
    eyebrow: 'Invitaciones digitales para boda',
    h1Prefix: 'Sabe exactamente ',
    h1Highlight: 'quién va',
    h1Suffix: ' a tu boda, sin rogarle a nadie.',
    waMessage: 'Hola, quiero información sobre invitaciones digitales para boda',
    phone: {
      category: 'boda',
      topBadge: 'Nos casamos',
      title: 'Ana & Diego',
      dateStr: '14 · 03 · 2027',
      targetDate: '2027-03-14T18:00:00',
      guestName: 'Familia Ramírez',
      passesText: '4 pases reservados para ustedes',
      rsvpDoneToast: 'Así le llega a tu panel: “Familia Ramírez confirmó 4 pases”',
    },
    problemTitle: '¿Te suena?',
    problemItems: [
      'Mandas la invitación y la mitad no contesta.',
      'Tienes que escribirle a cada tía: “¿entonces sí vienes?”. Y se siente como rogar.',
      'Te contestan “a lo mejor” y no sabes si contarlos o no.',
      'El salón te pide el número final y tú todavía no lo sabes.',
    ],
    showSeatsStat: true,
    outcomeTitle: 'Imagina llegar con el salón con la lista cerrada.',
    outcomeItems: [
      'Sabes cuántos sí, cuántos no y quién falta, sin abrir 200 chats.',
      'Cada familia sabe cuántos lugares tiene. Nadie llega con “un amigo más”.',
      'El día de la boda, la entrada se valida con un QR. Sin lista de papel en la puerta.',
    ],
    stepsTitle: 'Tu invitación y tu control de invitados, en un solo link.',
    salesSteps: [
      {
        title: 'Elige tu diseño y ármala',
        description: 'Fotos, música, itinerario, ubicación, mesa de regalos y dress code. Gratis, en minutos.',
      },
      {
        title: 'Mándala por WhatsApp',
        description: 'Cada familia recibe su link con su nombre y sus pases.',
      },
      {
        title: 'Mira tu lista llenarse',
        description: 'Las confirmaciones llegan solas a tu panel y los recordatorios salen a quien no ha respondido.',
      },
    ],
    whyTitle: 'Una invitación bonita no confirma nada.',
    whyLead: 'La gente contesta cuando responder es más fácil que ignorarte:',
    whyCards: [
      {
        title: 'Un link por familia, con su nombre',
        description: 'Se siente personal, no un mensaje masivo.',
      },
      {
        title: 'Un toque para confirmar',
        description: 'Sin descargar nada. Si saben abrir WhatsApp, saben confirmar.',
      },
      {
        title: 'Recordatorios automáticos',
        description: 'No eres tú la que pregunta otra vez.',
      },
    ],
    recommendedPlan: {
      badge: 'El que más eligen para bodas',
      name: 'Plan Pro',
      price: '$1,699',
      period: 'MXN · un solo pago',
      note: 'Sin cobro por invitado · sin suscripción · meses sin intereses',
      features: [
        'Invitación con tu diseño, fotos, música y cuenta regresiva',
        'Ubicación con Maps/Waze, itinerario, dress code y mesa de regalos',
        'Link personal por familia con sus pases',
        'Panel de confirmaciones en tiempo real + Excel final',
        'Recordatorios automáticos por WhatsApp',
        'Acomodo de mesas',
        'Pase con QR y check-in en la entrada',
        'Sección de padrinos y hospedaje para foráneos',
      ],
      savingsText: '<b>Lo que te ahorras:</b> semanas escribiéndole uno por uno a 150 invitados para saber si vienen. Aquí cada respuesta llega sola a tu panel.',
      ctaText: 'Crear mi invitación gratis',
      ctaMicro: 'La armas gratis. Pagas solo cuando la quieras publicar.',
    },
    altPlans: [
      {
        title: '¿Algo más sencillo?',
        subtitle: 'Clásica · invitación completa con confirmación por WhatsApp',
        priceOrAction: '$499',
        href: '/planes',
      },
      {
        title: '¿No quieres ni mandar recordatorios?',
        subtitle: 'Invitto Confirma · nuestro equipo confirma a cada invitado y te entrega la lista 15 días antes, o te devolvemos el 100%',
        priceOrAction: 'Ver ($3,499)',
        href: '/confirma',
      },
    ],
    proofTitle: 'No nos creas: pruébala.',
    proofLead: 'Ármala completa con tus datos y mírala terminada en tu celular antes de pagar un peso.',
    demoCategory: 'boda',
    objectionsTitle: 'Lo que nos preguntan antes de decidirse',
    objections: [
      {
        question: '“Mis tíos no saben usar esas cosas.”',
        answer: 'Si saben abrir un WhatsApp, saben confirmar. No se descarga nada.',
      },
      {
        question: '“Se ve menos formal que una impresa.”',
        answer: 'Puedes mandar impresas solo a los abuelos y digital al resto. La digital es la que te dice quién sí va.',
      },
      {
        question: '“No tengo tiempo de armarla.”',
        answer: 'Se arma en minutos. Y si prefieres que la hagamos nosotros, existe Diseño Pro.',
      },
      {
        question: '“$1,699 es mucho para una invitación.”',
        answer: 'Las impresas para 150 invitados cuestan bastante más y no te dicen quién contestó. Aquí, además de la invitación, tienes la lista lista para el salón.',
      },
      {
        question: '“¿Y si no me gusta?”',
        answer: 'La ves terminada antes de pagar, y además tienes 7 días de garantía.',
      },
    ],
    guaranteeTitle: 'Cero riesgo.',
    guaranteeText: 'Ármala gratis y mírala terminada. Si pagas y no te convence, tienes <b>7 días para pedir tu reembolso</b>.',
    guaranteeExtra: '<p><b>Con Invitto Confirma:</b> si no te entregamos la lista con la respuesta de cada invitación en la fecha acordada, te devolvemos el 100%.</p>',
    closingTitle: 'Tu fecha ya empezó a correr.',
    closingLead: 'El salón te va a pedir el número final semanas antes de la boda. Entre antes mandes la invitación, más tiempo tienen tus invitados para contestar.',
    closingCta: 'Crear mi invitación de boda gratis',
    seo: {
      title: 'Invitaciones Digitales para Boda — Diseño Premium y RSVP',
      description: 'Sabe exactamente quién va a tu boda sin rogarle a nadie. Invitaciones digitales elegantes con RSVP inteligente por WhatsApp. Hecho en México.',
      path: '/invitaciones-digitales-boda',
    },
    hero: {
      badge: 'Bodas',
      h1: 'Sabe exactamente quién va a tu boda, sin rogarle a nadie.',
      subtitle: 'Tu invitación digital confirma por ti: cada familia ve sus pases, responde con un toque y tú ves la lista en tiempo real.',
      cta: 'Crear mi invitación gratis',
    },
    benefits: [],
    steps: DEFAULT_STEPS,
    testimonials: [],
    faq: [
      { question: '¿Cuántos invitados puedo tener?', answer: 'Los que quieras. El precio no cambia por el número de invitados ni de envíos.' },
      { question: '¿Puedo cambiar datos después de mandarla?', answer: 'Sí. El link es el mismo y se actualiza solo en tiempo real para todos tus invitados.' },
      { question: '¿Cómo puedo pagar?', answer: 'Aceptamos tarjeta de débito o crédito, OXXO, meses sin intereses, Apple Pay y Google Pay.' },
      { question: '¿Puedo poner mi mesa de regalos?', answer: 'Sí: Liverpool, Amazon, tiendas departamentales o datos para transferencia bancaria directa.' },
      { question: '¿Cuánto tiempo sigue activa?', answer: 'Tu invitación permanece activa desde que la creas hasta 30 días naturales después de tu boda, para que tú y tus invitados puedan consultar fotos, itinerario y mesa de regalos sin prisas.' },
    ],
    ctaFinal: {
      title: 'Tu fecha ya empezó a correr.',
      subtitle: 'El salón te va a pedir el número final semanas antes de la boda. Entre antes mandes la invitación, más tiempo tienen tus invitados para contestar.',
      cta: 'Crear mi invitación de boda gratis',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 2. Invitaciones Digitales para XV Años ─────────────────────────
  'invitaciones-digitales-xv-anos': {
    slug: 'invitaciones-digitales-xv-anos',
    isEventLanding: true,
    eventType: 'xv',
    theme: {
      key: 'xv',
      bg: '#FCE8EF',
      bg2: '#F9DCE7',
      ink: '#3A1A2B',
      muted: '#7A4E62',
      line: '#F1C6D7',
      dark: '#D63F86',
      darkInk: '#FFFFFF',
      accent: '#C9A24D',
      accentText: '#9A7426',
      btn: '#D63F86',
      btnInk: '#FFFFFF',
      btnRing: '#C9A24D',
      fontHead: "'Playfair Display', Georgia, serif",
      fontBody: "'Montserrat', sans-serif",
    },
    eyebrow: 'Invitaciones digitales para XV años',
    h1Prefix: 'La invitación que tu hija va a querer ',
    h1Highlight: 'presumir',
    h1Suffix: ', y que a ti te dice quién sí va.',
    waMessage: 'Hola, quiero información sobre invitaciones digitales para XV años',
    phone: {
      category: 'xv',
      topBadge: 'Mis XV años',
      title: 'Valentina',
      dateStr: '20 · 06 · 2027',
      targetDate: '2027-06-20T19:00:00',
      guestName: 'Familia López',
      passesText: '3 pases reservados para ustedes',
      rsvpDoneToast: 'Así le llega a tu panel: “Familia López confirmó 3 pases”',
    },
    problemTitle: 'Ella quiere que se vea increíble. Tú necesitas saber cuántos van.',
    problemItems: [
      'Padrinos de vestido, de pastel, de vals… y todos preguntan lo mismo por WhatsApp.',
      'La mitad de los invitados no confirma.',
      'El salón ya te está pidiendo el número final.',
      'La impresa llega tarde, se pierde y no te dice nada.',
    ],
    showSeatsStat: false,
    outcomeTitle: 'Las dos contentas.',
    outcomeItems: [
      'Ella la comparte en sus estados y todas sus amigas la ven.',
      'Tú tienes la lista de confirmados al día, sin perseguir a nadie.',
      'Padrinos, horarios, ubicación y dress code en un link: se acaban las preguntas repetidas.',
      'En la entrada, un QR por familia. Solo entra quien está invitado.',
    ],
    stepsTitle: 'Su invitación y tu control de invitados, en un solo link.',
    salesSteps: [
      {
        title: 'Elijan juntas el diseño',
        description: 'Pongan sus fotos, su canción y los datos de la fiesta. Gratis.',
      },
      {
        title: 'Mándenla por WhatsApp',
        description: 'Cada familia recibe su link con su nombre y sus pases.',
      },
      {
        title: 'Ve las confirmaciones llegar',
        description: 'Panel en tiempo real y recordatorios automáticos a quien no ha contestado.',
      },
    ],
    whyTitle: 'A los 15 importa cómo se ve. A mamá, que contesten.',
    whyLead: 'Invitto junta las dos cosas:',
    whyCards: [
      {
        title: 'Una invitación que ella sí quiere mandar',
        description: 'Su foto, su canción, sus colores. Hecha para presumirse.',
      },
      {
        title: 'Un sistema que hace que contesten',
        description: 'Link por familia, un toque para confirmar y recordatorios automáticos.',
      },
      {
        title: 'Todo en un solo lugar',
        description: 'Padrinos, misa, recepción, vals y dress code. Nadie vuelve a preguntar la hora.',
      },
    ],
    recommendedPlan: {
      badge: 'El que más eligen para XV',
      name: 'Plan Pro',
      price: '$1,699',
      period: 'MXN · un solo pago',
      note: 'Sin cobro por invitado · sin suscripción · meses sin intereses',
      features: [
        'Diseño con sus fotos (hasta 20), su música y cuenta regresiva',
        'Sección de padrinos',
        'Itinerario (misa, recepción, vals), ubicación y dress code',
        'Mesa de regalos',
        'Link personal por familia con sus pases',
        'Panel de confirmaciones + recordatorios por WhatsApp',
        'Acomodo de mesas y pase con QR en la entrada',
      ],
      savingsText: '<b>Sin cobro por invitado:</b> el precio es el mismo para 80 que para 300 invitados, y la mandas cuantas veces quieras.',
      ctaText: 'Crear su invitación gratis',
      ctaMicro: 'La armas gratis. Pagas solo cuando la quieras publicar.',
    },
    altPlans: [
      {
        title: '¿Algo más sencillo?',
        subtitle: 'Clásica · invitación completa con confirmación por WhatsApp',
        priceOrAction: '$499',
        href: '/planes',
      },
      {
        title: '¿Quieren que confirmemos por ustedes?',
        subtitle: 'Invitto Confirma · nuestro equipo confirma a cada invitado por ustedes y entrega la lista a tiempo',
        priceOrAction: 'Ver ($3,499)',
        href: '/confirma',
      },
    ],
    proofTitle: 'No nos creas: pruébala.',
    proofLead: 'Ármenla completa y véanla terminada en el celular antes de pagar.',
    demoCategory: 'xv',
    objectionsTitle: 'Lo que nos preguntan antes de decidirse',
    objections: [
      {
        question: '“Ella quiere algo único, no una plantilla.”',
        answer: 'Cambian colores, tipografía, fotos y música. Y si quieren diseño desde cero, existe Diseño Pro.',
      },
      {
        question: '“Las abuelitas no van a saber.”',
        answer: 'Es un link de WhatsApp. Abren, ven y confirman con un toque.',
      },
      {
        question: '“¿Y los padrinos?”',
        answer: 'Tienen su sección, con nombre y lo que apadrinan.',
      },
      {
        question: '“¿Y si no nos gusta?”',
        answer: 'La ven terminada antes de pagar, y además hay 7 días de garantía.',
      },
    ],
    guaranteeTitle: 'Cero riesgo.',
    guaranteeText: 'Ármala gratis y mírala terminada. Si pagas y no te convence, tienes <b>7 días para pedir tu reembolso</b>.',
    closingTitle: 'Los XV se planean con meses, pero la lista se cierra en semanas.',
    closingLead: 'Manden la invitación con tiempo para que todos alcancen a contestar.',
    closingCta: 'Crear su invitación de XV gratis',
    seo: {
      title: 'Invitaciones Digitales para XV Años — Diseños Modernos y RSVP',
      description: 'La invitación que tu hija va a querer presumir y que a ti te dice quién sí va. Con música, fotos, padrinos y RSVP por WhatsApp. Hecho en México.',
      path: '/invitaciones-digitales-xv-anos',
    },
    hero: {
      badge: 'XV Años',
      h1: 'La invitación que tu hija va a querer presumir, y que a ti te dice quién sí va.',
      subtitle: 'Fotos, música, padrinos, vals y dress code en un solo link. Tus invitados confirman con un toque y tú ves la lista en tiempo real.',
      cta: 'Crear su invitación gratis',
    },
    benefits: [],
    steps: DEFAULT_STEPS,
    testimonials: [],
    faq: [
      { question: '¿Puedo poner chambelanes y padrinos?', answer: 'Sí, tienen su propia sección destacada con foto y nombre de lo que apadrinan.' },
      { question: '¿Cuántas fotos puedo subir?', answer: 'Plan Clásica incluye 10 fotos, Plan Pro 20 y Diseño Pro fotos ilimitadas.' },
      { question: '¿Cómo puedo pagar?', answer: 'Tarjeta de crédito o débito, OXXO, meses sin intereses, Apple Pay y Google Pay.' },
      { question: '¿Cuánto tiempo sigue activa?', answer: 'Permanece activa desde la creación hasta 30 días naturales después de los XV años.' },
    ],
    ctaFinal: {
      title: 'Los XV se planean con meses, pero la lista se cierra en semanas.',
      subtitle: 'Manden la invitación con tiempo para que todos alcancen a contestar.',
      cta: 'Crear su invitación de XV gratis',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 3. Invitaciones Digitales para Cumpleaños ──────────────────────
  'invitaciones-digitales-cumpleanos': {
    slug: 'invitaciones-digitales-cumpleanos',
    isEventLanding: true,
    eventType: 'birthday',
    theme: {
      key: 'cumpleanos',
      bg: '#FFFDF7',
      bg2: '#FFF6E0',
      ink: '#1A202C',
      muted: '#64748B',
      line: '#FFE5B4',
      dark: '#FF6B4A',
      darkInk: '#FFFFFF',
      accent: '#1FB5A8',
      accentText: '#0D8A80',
      btn: '#FF6B4A',
      btnInk: '#FFFFFF',
      btnRing: '#1FB5A8',
      fontHead: "'Inter', sans-serif",
      fontBody: "'Inter', sans-serif",
    },
    eyebrow: 'Invitaciones digitales para cumpleaños',
    h1Prefix: 'La fiesta que todos esperan, con la ',
    h1Highlight: 'lista clara',
    h1Suffix: ' desde el inicio.',
    waMessage: 'Hola, quiero información sobre invitaciones digitales para cumpleaños',
    phone: {
      category: 'cumpleanos',
      topBadge: '¡Festejemos!',
      title: 'Mateo · Mis 30',
      dateStr: '15 · 08 · 2027',
      targetDate: '2027-08-15T20:00:00',
      guestName: 'Familia Garza',
      passesText: '2 pases reservados',
      rsvpDoneToast: 'Así le llega a tu panel: “Familia Garza confirmó 2 pases”',
    },
    problemTitle: 'Armar un grupo de WhatsApp siempre termina en caos.',
    problemItems: [
      'Creas un grupo de 50 personas: la mitad se sale y los demás mandan memes.',
      'Nadie confirma con certeza y no sabes cuánta comida o bebida comprar.',
      'Te preguntan la ubicación y la hora 20 veces el mero día de la fiesta.',
      'Nadie sabe qué regalarte o dónde está la mesa de regalos.',
    ],
    showSeatsStat: false,
    outcomeTitle: 'Tu fiesta organizada, tus invitados confirmados.',
    outcomeItems: [
      'Un solo link bonito que mandas por privado o en tus historias.',
      'Confirmación en un toque: sabes exactamente quién asiste con su familia.',
      'Ubicación con Waze y Google Maps: nadie se pierde ni te llama en plena fiesta.',
      'Mesa de regalos, wish list o datos de transferencia en un solo lugar.',
    ],
    stepsTitle: 'Tu cumpleaños organizado en 3 pasos simples.',
    salesSteps: [
      {
        title: 'Personaliza tu invitación',
        description: 'Elige la plantilla que vaya con tu vibra, sube tus fotos y datos en minutos.',
      },
      {
        title: 'Compártela por WhatsApp',
        description: 'Envía el link personalizado por mensaje privado o difúndelo con tus amigos.',
      },
      {
        title: 'Recibe confirmaciones en vivo',
        description: 'Mira quién ya dijo que sí directo en tu panel de control.',
      },
    ],
    whyTitle: 'Fácil para tus amigos, sin estrés para ti.',
    whyLead: 'La forma más directa de asegurar las confirmaciones:',
    whyCards: [
      {
        title: 'Sin apps ni registros',
        description: 'Tus amigos abren el link y confirman en un clic.',
      },
      {
        title: 'Todo en una sola pantalla',
        description: 'Hora, mapa, música, dress code y regalos.',
      },
      {
        title: 'Recordatorio automático',
        description: 'Nadie olvida la fecha de tu festejo.',
      },
    ],
    recommendedPlan: {
      badge: 'El más elegido para cumpleaños',
      name: 'Plan Clásica',
      price: '$499',
      period: 'MXN · un solo pago',
      note: 'Sin límite de envíos · sin cargos ocultos',
      features: [
        'Invitación web completa para celular',
        'Confirmación de asistencia por WhatsApp',
        'Ubicación interactiva con Google Maps y Waze',
        'Mesa de regalos y datos bancarios',
        'Galería de fotos y cuenta regresiva',
        'Envío ilimitado sin costo extra por invitado',
      ],
      savingsText: '<b>Organización sin enredos:</b> olvídate de contar a mano entre cientos de mensajes de chat.',
      ctaText: 'Crear mi invitación gratis',
      ctaMicro: 'La armas gratis. Pagas solo cuando la quieras publicar.',
    },
    altPlans: [
      {
        title: '¿Quieres pases personalizados por familia?',
        subtitle: 'Plan Pro · pases individuales, código QR y acomodo',
        priceOrAction: '$1,699',
        href: '/planes',
      },
      {
        title: '¿Un evento grande con confirmación telefónica?',
        subtitle: 'Invitto Confirma · confirmamos a cada invitado por ti',
        priceOrAction: 'Ver ($3,499)',
        href: '/confirma',
      },
    ],
    proofTitle: 'No nos creas: pruébala.',
    proofLead: 'Ármala completa con tus datos y mírala terminada en tu celular antes de pagar un peso.',
    demoCategory: 'cumpleanos',
    objectionsTitle: 'Lo que nos preguntan antes de decidirse',
    objections: [
      {
        question: '“¿Puedo mandar la invitación a más de 100 amigos?”',
        answer: 'Sí, puedes enviarla a todos los invitados que quieras sin pagar nada extra.',
      },
      {
        question: '“¿Mis amigos tienen que instalar una app?”',
        answer: 'No. Se abre directo en cualquier navegador desde WhatsApp o redes sociales.',
      },
      {
        question: '“¿Puedo cambiar la hora o la dirección si llueve?”',
        answer: 'Sí, puedes editar los datos en cualquier momento y se actualiza al instante en el mismo link.',
      },
      {
        question: '“¿Y si no me gusta cómo queda?”',
        answer: 'La armas gratis y la ves completa en tu celular. Pagas solo cuando decidas publicarla, con 7 días de garantía.',
      },
    ],
    guaranteeTitle: 'Cero riesgo.',
    guaranteeText: 'Ármala gratis y mírala terminada. Si pagas y no te convence, tienes <b>7 días para pedir tu reembolso</b>.',
    closingTitle: 'Tu cumple se acerca: festeja sin complicaciones.',
    closingLead: 'Manda tu invitación hoy y ten la lista de confirmados lista para planear la mejor fiesta.',
    closingCta: 'Crear mi invitación gratis',
    seo: {
      title: 'Invitaciones Digitales para Cumpleaños — Modernas y Fáciles',
      description: 'Crea invitaciones digitales para cumpleaños con confirmación por WhatsApp, ubicación en Google Maps y mesa de regalos. Hecho en México.',
      path: '/invitaciones-digitales-cumpleanos',
    },
    hero: {
      badge: 'Cumpleaños',
      h1: 'La fiesta que todos esperan, con la lista clara desde el inicio.',
      subtitle: 'Ubicación en Maps, mesa de regalos o cuenta de sobre, fotos y confirmación directa por WhatsApp. Organiza tu cumple sin el caos de los grupos.',
      cta: 'Crear mi invitación gratis',
    },
    benefits: [],
    steps: DEFAULT_STEPS,
    testimonials: [],
    faq: [
      { question: '¿Puedo poner sugerencia de regalos o sobre?', answer: 'Sí, puedes enlazar tu mesa de regalos o agregar datos bancarios con botón para copiar CLABE.' },
      { question: '¿Funciona para fiestas infantiles y de adultos?', answer: 'Sí, tenemos plantillas temáticas para niños, jóvenes y adultos.' },
      { question: '¿Cuánto tiempo permanece activa?', answer: 'Tu invitación permanece activa desde que la creas hasta 30 días naturales después del cumpleaños.' },
    ],
    ctaFinal: {
      title: 'Tu cumple se acerca: festeja sin complicaciones.',
      subtitle: 'Manda tu invitación hoy y ten la lista de confirmados lista para planear la mejor fiesta.',
      cta: 'Crear mi invitación gratis',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 4. Invitaciones Digitales para Bautizo (NUEVA) ──────────────────
  'invitaciones-digitales-bautizo': {
    slug: 'invitaciones-digitales-bautizo',
    isEventLanding: true,
    eventType: 'bautizo',
    theme: {
      key: 'bautizo',
      bg: '#F7FAFC',
      bg2: '#EBF3F8',
      ink: '#202D3A',
      muted: '#5C6F84',
      line: '#DCE8F0',
      dark: '#5B8CAE',
      darkInk: '#FFFFFF',
      accent: '#C8A96A',
      accentText: '#9E7F42',
      btn: '#5B8CAE',
      btnInk: '#FFFFFF',
      btnRing: '#C8A96A',
      fontHead: "'Cormorant Garamond', Georgia, serif",
      fontBody: "'Inter', sans-serif",
    },
    eyebrow: 'Invitaciones digitales para bautizo',
    h1Prefix: 'La bienvenida más tierna, con la ',
    h1Highlight: 'familia reunida',
    h1Suffix: ' y confirmada.',
    waMessage: 'Hola, quiero información sobre invitaciones digitales para bautizo',
    phone: {
      category: 'bautizo',
      topBadge: 'Mi Bautizo',
      title: 'Santiago',
      dateStr: '18 · 09 · 2027',
      targetDate: '2027-09-18T12:00:00',
      guestName: 'Familia Morales',
      passesText: '3 pases reservados',
      rsvpDoneToast: 'Así le llega a tu panel: “Familia Morales confirmó 3 pases”',
    },
    problemTitle: 'Organizar la misa y la comida familiar no tiene por qué ser complicado.',
    problemItems: [
      'La misa es en un templo y la comida en otro lugar: la familia se confunde con los horarios y direcciones.',
      'Los tíos y abuelos olvidan avisar cuántos van a ir.',
      'Los padrinos no saben los detalles de la ceremonia ni qué llevar.',
      'Las invitaciones de papel se quedan en el auto o se pierden.',
    ],
    showSeatsStat: false,
    outcomeTitle: 'La bendición de tu bebé, con la lista lista.',
    outcomeItems: [
      'Dos ubicaciones claras con GPS: la parroquia y el jardín o salón.',
      'Espacio especial de honor para los padrinos de bautizo.',
      'Respuestas claras y a tiempo de toda la familia.',
      'Mesa de regalos o sugerencia de sobre en el mismo link.',
    ],
    stepsTitle: 'Comparte este día tan especial en 3 pasos.',
    salesSteps: [
      {
        title: 'Elige un diseño angelical',
        description: 'Sube la foto de tu bebé, agrega el nombre de los padrinos y los templos.',
      },
      {
        title: 'Envíala por WhatsApp a tu familia',
        description: 'Llega directo al celular de cada tío, abuelo y compadre.',
      },
      {
        title: 'Recibe confirmaciones al instante',
        description: 'Sabes exactamente cuántos adultos y niños asistirán a la comida.',
      },
    ],
    whyTitle: 'Claridad para la familia, tranquilidad para los papás.',
    whyLead: 'Diseñada para que hasta los abuelos confirmen sin dificultad:',
    whyCards: [
      {
        title: 'Botón directo de confirmación',
        description: 'Con un toque confirman sin contraseñas ni complicaciones.',
      },
      {
        title: 'GPS directo a la iglesia y al evento',
        description: 'Waze y Google Maps para que nadie llegue tarde a la misa.',
      },
      {
        title: 'Detalles de la ceremonia',
        description: 'Padrinos, vestimenta y recomendaciones para los niños.',
      },
    ],
    recommendedPlan: {
      badge: 'El más elegido para bautizo',
      name: 'Plan Clásica',
      price: '$499',
      period: 'MXN · un solo pago',
      note: 'Sin límite de envíos · sin cobro por invitado',
      features: [
        'Diseño delicado con fotos de tu bebé',
        'Sección especial de padrinos',
        'Doble mapa (iglesia y recepción)',
        'Confirmación de asistencia por WhatsApp',
        'Mesa de regalos o cuenta bancaria',
        'Música de fondo suave',
      ],
      savingsText: '<b>Todo en un solo link:</b> evita llamadas a última hora preguntando la dirección de la parroquia.',
      ctaText: 'Crear mi invitación gratis',
      ctaMicro: 'La armas gratis. Pagas solo cuando la quieras publicar.',
    },
    altPlans: [
      {
        title: '¿Quieres pases personalizados por familia y QR?',
        subtitle: 'Plan Pro · pases por familia, mesas y check-in',
        priceOrAction: '$1,699',
        href: '/planes',
      },
      {
        title: '¿Prefieres que confirmemos a cada invitado por ti?',
        subtitle: 'Invitto Confirma · servicio de confirmación personalizada',
        priceOrAction: 'Ver ($3,499)',
        href: '/confirma',
      },
    ],
    proofTitle: 'No nos creas: pruébala.',
    proofLead: 'Ármala completa con tus datos y mírala terminada en tu celular antes de pagar un peso.',
    demoCategory: 'bautizo',
    objectionsTitle: 'Lo que nos preguntan antes de decidirse',
    objections: [
      {
        question: '“¿Puedo poner la dirección de la iglesia y la del festejo?”',
        answer: 'Sí, puedes incluir ambos mapas de Google Maps y Waze con sus respectivos horarios.',
      },
      {
        question: '“¿Los abuelos sabrán usarla?”',
        answer: 'Totalmente. Al recibir el link en WhatsApp solo dan un clic y ven la invitación como una revista interactiva.',
      },
      {
        question: '“¿Se puede incluir sugerencia de regalo o sobre?”',
        answer: 'Sí, puedes activar la sección de mesa de regalos o agregar tus datos bancarios.',
      },
      {
        question: '“¿Y si cambian el horario de la misa?”',
        answer: 'Puedes cambiarlo en tu panel en segundos y se actualiza al momento para todos.',
      },
    ],
    guaranteeTitle: 'Cero riesgo.',
    guaranteeText: 'Ármala gratis y mírala terminada. Si pagas y no te convence, tienes <b>7 días para pedir tu reembolso</b>.',
    closingTitle: 'Celebra el bautizo de tu bebé con paz mental.',
    closingLead: 'Prepara la invitación en minutos y dedícate a disfrutar cada momento con tu familia.',
    closingCta: 'Crear mi invitación gratis',
    seo: {
      title: 'Invitaciones Digitales para Bautizo — Diseños Delicados y RSVP',
      description: 'Crea hermosas invitaciones digitales para bautizo con padrinos, mapas de iglesia y recepción, y confirmación por WhatsApp. Hecho en México.',
      path: '/invitaciones-digitales-bautizo',
    },
    hero: {
      badge: 'Bautizos',
      h1: 'La bienvenida más tierna, con la familia reunida y confirmada.',
      subtitle: 'Diseños delicados con sección de padrinos, iglesia, recepción y confirmación directa por WhatsApp. Todo en un solo link.',
      cta: 'Crear mi invitación de bautizo gratis',
    },
    benefits: [],
    steps: DEFAULT_STEPS,
    testimonials: [],
    faq: [
      { question: '¿Puedo subir varias fotos de mi bebé?', answer: 'Sí, incluye una galería de fotos con música de fondo.' },
      { question: '¿Puedo especificar el código de vestimenta?', answer: 'Sí, puedes indicar dress code formal, guayabera, tonos claros o lo que prefieras.' },
      { question: '¿Cuánto tiempo sigue activa?', answer: 'Permanece activa desde la creación hasta 30 días naturales después del bautizo.' },
    ],
    ctaFinal: {
      title: 'Celebra el bautizo de tu bebé con paz mental.',
      subtitle: 'Prepara la invitación en minutos y dedícate a disfrutar cada momento con tu familia.',
      cta: 'Crear mi invitación gratis',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 5. Invitaciones Digitales Primera Comunión (NUEVA) ──────────────
  'invitaciones-digitales-primera-comunion': {
    slug: 'invitaciones-digitales-primera-comunion',
    isEventLanding: true,
    eventType: 'primera_comunion',
    theme: {
      key: 'comunion',
      bg: '#FCFBF8',
      bg2: '#F2EFE8',
      ink: '#242823',
      muted: '#5F695D',
      line: '#E2DDD1',
      dark: '#748767',
      darkInk: '#FFFFFF',
      accent: '#B8935A',
      accentText: '#8C6A35',
      btn: '#748767',
      btnInk: '#FFFFFF',
      btnRing: '#B8935A',
      fontHead: "'Cormorant Garamond', Georgia, serif",
      fontBody: "'Inter', sans-serif",
    },
    eyebrow: 'Invitaciones digitales para primera comunión',
    h1Prefix: 'Un sacramento inolvidable, con la ',
    h1Highlight: 'familia reunida',
    h1Suffix: ' a tiempo.',
    waMessage: 'Hola, quiero información sobre invitaciones digitales para primera comunión',
    phone: {
      category: 'comunion',
      topBadge: 'Mi Primera Comunión',
      title: 'Sofía',
      dateStr: '24 · 10 · 2027',
      targetDate: '2027-10-24T11:00:00',
      guestName: 'Familia Hernández',
      passesText: '4 pases',
      rsvpDoneToast: 'Así le llega a tu panel: “Familia Hernández confirmó 4 pases”',
    },
    problemTitle: 'La coordinación entre la ceremonia y el festejo.',
    problemItems: [
      'Muchos familiares no saben a qué hora es la misa solemne y llegan tarde.',
      'No sabes cuántos platillos contratar porque nadie confirma con tiempo.',
      'Los invitados preguntan qué regalo llevar o si habrá código de vestimenta.',
      'Imprimir y repartir tarjetas toma semanas valiosas.',
    ],
    showSeatsStat: false,
    outcomeTitle: 'Toda la información clara, todos confirmados.',
    outcomeItems: [
      'Horarios puntuales de la ceremonia y mapa exacto del salón o jardín.',
      'Lista de confirmados clara para dar el número exacto al banquetero.',
      'Mención especial a los padrinos y sugerencias de regalo o sobre.',
      'Acceso fácil desde WhatsApp para toda la familia.',
    ],
    stepsTitle: 'Tu invitación lista en 3 simples pasos.',
    salesSteps: [
      {
        title: 'Elige y personaliza la plantilla',
        description: 'Agrega la foto de tu hijo/a, el templo y el salón en minutos.',
      },
      {
        title: 'Compártela en un toque por WhatsApp',
        description: 'Cada familiar la recibe directamente en su teléfono.',
      },
      {
        title: 'Consulta las confirmaciones en tiempo real',
        description: 'Mira quién asiste y organiza las mesas sin prisas.',
      },
    ],
    whyTitle: 'Sencillo de consultar, imposible de olvidar.',
    whyLead: 'Todo lo que tus invitados necesitan saber en un solo link:',
    whyCards: [
      {
        title: 'Ubicación GPS exacta',
        description: 'Llegada sin extravíos al templo y a la fiesta.',
      },
      {
        title: 'Confirmación rápida',
        description: 'Un toque basta para que tus familiares aseguren su asistencia.',
      },
      {
        title: 'Mesa de regalos o sobre',
        description: 'Guía clara para los familiares que desean dar un obsequio.',
      },
    ],
    recommendedPlan: {
      badge: 'El más elegido para primera comunión',
      name: 'Plan Clásica',
      price: '$499',
      period: 'MXN · un solo pago',
      note: 'Sin límite de invitados · un solo pago',
      features: [
        'Diseño sobrio y elegante para Primera Comunión',
        'Ubicación con mapas para iglesia y salón',
        'Sección de padrinos de comunión',
        'Confirmación de asistencia por WhatsApp',
        'Sugerencia de mesa de regalos o sobre',
        'Galería de fotos conmemorativas',
      ],
      savingsText: '<b>Comodidad para todos:</b> tus invitados tienen la hora y dirección en su WhatsApp en todo momento.',
      ctaText: 'Crear mi invitación gratis',
      ctaMicro: 'La armas gratis. Pagas solo cuando la quieras publicar.',
    },
    altPlans: [
      {
        title: '¿Quieres pases asignados y control de mesas?',
        subtitle: 'Plan Pro · pases con nombre, QR y acomodo',
        priceOrAction: '$1,699',
        href: '/planes',
      },
      {
        title: '¿Deseas confirmación por agentes dedicados?',
        subtitle: 'Invitto Confirma · nosotros confirmamos a tus invitados',
        priceOrAction: 'Ver ($3,499)',
        href: '/confirma',
      },
    ],
    proofTitle: 'No nos creas: pruébala.',
    proofLead: 'Ármala completa con tus datos y mírala terminada en tu celular antes de pagar un peso.',
    demoCategory: 'comunion',
    objectionsTitle: 'Lo que nos preguntan antes de decidirse',
    objections: [
      {
        question: '“¿Puedo poner fotos de la sesión previa?”',
        answer: 'Sí, puedes incluir fotos de la sesión fotográfica con su vestimenta de comunión.',
      },
      {
        question: '“¿Puedo aclarar el código de vestimenta?”',
        answer: 'Sí, puedes especificar vestimenta formal, guayabera o sugerencias de color.',
      },
      {
        question: '“¿Qué pasa si cambian de templo a última hora?”',
        answer: 'Entras a tu cuenta, actualizas la dirección y el link de WhatsApp se actualiza de inmediato.',
      },
      {
        question: '“¿Puedo probarla antes de comprar?”',
        answer: 'Sí, la creas y ves exactamente cómo luce en celular antes de pagar un solo centavo.',
      },
    ],
    guaranteeTitle: 'Cero riesgo.',
    guaranteeText: 'Ármala gratis y mírala terminada. Si pagas y no te convence, tienes <b>7 días para pedir tu reembolso</b>.',
    closingTitle: 'Un día de fe y alegría: prepáralo con anticipación.',
    closingLead: 'Diseña la invitación hoy mismo y ten la lista de invitados organizada a tiempo.',
    closingCta: 'Crear mi invitación gratis',
    seo: {
      title: 'Invitaciones Digitales Primera Comunión — Elegantes y RSVP',
      description: 'Invitaciones digitales elegantes para Primera Comunión con mapas de iglesia y recepción, confirmación por WhatsApp y sección de padrinos.',
      path: '/invitaciones-digitales-primera-comunion',
    },
    hero: {
      badge: 'Primera Comunión',
      h1: 'Un sacramento inolvidable, con la familia reunida a tiempo.',
      subtitle: 'Diseño elegante con información de la misa, recepción, padrinos y confirmación fácil por WhatsApp. Comparte la dicha de tu hijo.',
      cta: 'Crear invitación de primera comunión gratis',
    },
    benefits: [],
    steps: DEFAULT_STEPS,
    testimonials: [],
    faq: [
      { question: '¿Puedo incluir datos bancarios para regalos?', answer: 'Sí, puedes agregar tu CLABE interbancaria con botón para copiar fácil.' },
      { question: '¿La invitación se ve bien en cualquier celular?', answer: 'Sí, está optimizada para verse perfecta en iPhone, Android y computadoras.' },
      { question: '¿Cuánto tiempo permanece activa?', answer: 'Desde que la creas hasta 30 días naturales posteriores a la Primera Comunión.' },
    ],
    ctaFinal: {
      title: 'Un día de fe y alegría: prepáralo con anticipación.',
      subtitle: 'Diseña la invitación hoy mismo y ten la lista de invitados organizada a tiempo.',
      cta: 'Crear mi invitación gratis',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 6. Invitaciones Digitales Baby Shower (NUEVA) ───────────────────
  'invitaciones-digitales-baby-shower': {
    slug: 'invitaciones-digitales-baby-shower',
    isEventLanding: true,
    eventType: 'baby_shower',
    theme: {
      key: 'baby_shower',
      bg: '#FCFAF6',
      bg2: '#F5EFE6',
      ink: '#2E2A27',
      muted: '#6E6660',
      line: '#E8DEC9',
      dark: '#8FA683',
      darkInk: '#FFFFFF',
      accent: '#E2B866',
      accentText: '#A67D2C',
      btn: '#8FA683',
      btnInk: '#FFFFFF',
      btnRing: '#E2B866',
      fontHead: "'Montserrat', sans-serif",
      fontBody: "'Inter', sans-serif",
    },
    eyebrow: 'Invitaciones digitales para baby shower',
    h1Prefix: 'La fiesta más tierna para esperar a tu bebé, con la ',
    h1Highlight: 'asistencia asegurada',
    h1Suffix: '.',
    waMessage: 'Hola, quiero información sobre invitaciones digitales para baby shower',
    phone: {
      category: 'baby_shower',
      topBadge: 'Baby Shower',
      title: '¡Esperando a Camila!',
      dateStr: '12 · 07 · 2027',
      targetDate: '2027-07-12T16:00:00',
      guestName: 'Familia Castillo',
      passesText: '2 pases',
      rsvpDoneToast: 'Así le llega a tu panel: “Familia Castillo confirmó 2 pases”',
    },
    problemTitle: 'Organizar el baby shower entre antojos y preparativos.',
    problemItems: [
      'Muchas amigas preguntan qué cosas del bebé ya compraste para no repetir regalos.',
      'Los mensajes de WhatsApp se pierden y no sabes cuántas van a asistir a los juegos.',
      'Nadie sabe la talla de pañales o si tienes mesa de regalos abierta.',
      'El restaurante o salón te pide confirmar el número de lugares con anticipación.',
    ],
    showSeatsStat: false,
    outcomeTitle: 'Regalos útiles, amigas contentas y la lista lista.',
    outcomeItems: [
      'Enlace directo a tus mesas de regalos (Liverpool, Amazon, etc.) o sugerencia de pañales.',
      'Confirmación fácil en un toque para planear dinámicas y recuerditos.',
      'Ubicación con Google Maps para que todas lleguen a tiempo.',
      'Toda la ternura de la espera de tu bebé en una página hermosa.',
    ],
    stepsTitle: 'Tu baby shower listo en 3 sencillos pasos.',
    salesSteps: [
      {
        title: 'Diseña con los colores de tu bebé',
        description: 'Elige un tema tierno, pon la fecha, lugar y enlaces a tus regalos.',
      },
      {
        title: 'Mándala a tus amigas por WhatsApp',
        description: 'En un solo mensaje tienen todo: dirección, horario y mesa de regalos.',
      },
      {
        title: 'Recibe las confirmaciones al momento',
        description: 'Ve en tiempo real quién asistirá para calcular recuerdos y comida.',
      },
    ],
    whyTitle: 'Tus amigas felices de consentir a tu bebé.',
    whyLead: 'La forma más práctica de coordinar regalos y asistencia:',
    whyCards: [
      {
        title: 'Mesas de regalos a un clic',
        description: 'Tus invitadas compran directo en Liverpool o Amazon sin equivocarse.',
      },
      {
        title: 'Sin mensajes repetidos',
        description: 'Dirección, horario y dinámica explicadas en la invitación.',
      },
      {
        title: 'Confirmación sin fricción',
        description: 'Un toque para decir “¡Ahí estaré!”.',
      },
    ],
    recommendedPlan: {
      badge: 'El más elegido para baby shower',
      name: 'Plan Clásica',
      price: '$499',
      period: 'MXN · un solo pago',
      note: 'Sin límite de envíos · un solo pago',
      features: [
        'Diseño tierno y personalizable',
        'Enlace a mesas de regalos (Liverpool, Amazon, etc.)',
        'Guía de pañales y tallas sugeridas',
        'Confirmación de asistencia por WhatsApp',
        'Ubicación interactiva con Google Maps y Waze',
        'Música de fondo y cuenta regresiva',
      ],
      savingsText: '<b>Cero regalos duplicados:</b> tus amigas compran exactamente lo que necesitas para tu bebé.',
      ctaText: 'Crear mi invitación gratis',
      ctaMicro: 'La armas gratis. Pagas solo cuando la quieras publicar.',
    },
    altPlans: [
      {
        title: '¿Quieres pases con QR y acomodo por mesas?',
        subtitle: 'Plan Pro · pases individuales y confirmación avanzada',
        priceOrAction: '$1,699',
        href: '/planes',
      },
      {
        title: '¿Evento grande con confirmación asistida?',
        subtitle: 'Invitto Confirma · nuestro equipo confirma a tus invitadas',
        priceOrAction: 'Ver ($3,499)',
        href: '/confirma',
      },
    ],
    proofTitle: 'No nos creas: pruébala.',
    proofLead: 'Ármala completa con tus datos y mírala terminada en tu celular antes de pagar un peso.',
    demoCategory: 'baby_shower',
    objectionsTitle: 'Lo que nos preguntan antes de decidirse',
    objections: [
      {
        question: '“¿Puedo poner varias mesas de regalos?”',
        answer: 'Sí, puedes enlazar Amazon, Liverpool, Palacio de Hierro o sugerencia de sobre en efectivo.',
      },
      {
        question: '“¿Se puede especificar si es baby shower mixto o solo mujeres?”',
        answer: 'Sí, puedes indicar dress code y notas para acompañantes.',
      },
      {
        question: '“¿Puedo cambiar la fecha si se adelanta el reposo?”',
        answer: 'Sí, puedes actualizar la fecha o lugar en cualquier momento sin cambiar de link.',
      },
      {
        question: '“¿Puedo ver cómo queda antes de pagar?”',
        answer: 'Sí, la diseñas gratis y pagas únicamente si te gusta para publicarla.',
      },
    ],
    guaranteeTitle: 'Cero riesgo.',
    guaranteeText: 'Ármala gratis y mírala terminada. Si pagas y no te convence, tienes <b>7 días para pedir tu reembolso</b>.',
    closingTitle: 'Tu bebé está por llegar: celébralo sin prisas.',
    closingLead: 'Envía la invitación hoy y enfócate en consentirte a ti y a tu pancita.',
    closingCta: 'Crear mi invitación gratis',
    seo: {
      title: 'Invitaciones Digitales Baby Shower — Mesa de Regalos y RSVP',
      description: 'Crea tiernas invitaciones digitales para baby shower con mesa de regalos de Liverpool/Amazon, mapa interactivo y confirmación por WhatsApp.',
      path: '/invitaciones-digitales-baby-shower',
    },
    hero: {
      badge: 'Baby Shower',
      h1: 'La fiesta más tierna para esperar a tu bebé, con la asistencia asegurada.',
      subtitle: 'Comparte tu mesa de regalos de Liverpool o Amazon, dinámicas, ubicación y confirma a tus invitadas en un toque por WhatsApp.',
      cta: 'Crear invitación de baby shower gratis',
    },
    benefits: [],
    steps: DEFAULT_STEPS,
    testimonials: [],
    faq: [
      { question: '¿Se pueden agregar dinámicas o juegos?', answer: 'Sí, puedes incluir itinerario de los juegos y momentos especiales.' },
      { question: '¿Mis invitadas necesitan descargar algo?', answer: 'No, la invitación abre directo en cualquier celular.' },
      { question: '¿Cuánto tiempo sigue activa?', answer: 'Hasta 30 días naturales posteriores al baby shower.' },
    ],
    ctaFinal: {
      title: 'Tu bebé está por llegar: celébralo sin prisas.',
      subtitle: 'Envía la invitación hoy y enfócate en consentirte a ti y a tu pancita.',
      cta: 'Crear mi invitación gratis',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 7. Invitaciones Digitales Revelación de Género ───────────────────
  'invitaciones-digitales-revelacion-de-genero': {
    slug: 'invitaciones-digitales-revelacion-de-genero',
    isEventLanding: true,
    eventType: 'gender_reveal',
    theme: {
      key: 'gender_reveal',
      bg: '#FAF7FA',
      bg2: '#F2E8F0',
      ink: '#2D232A',
      muted: '#695763',
      line: '#E6D3E0',
      dark: '#4A3B4D',
      darkInk: '#FFFFFF',
      accent: '#E685A9',
      accentText: '#D85B88',
      btn: '#4A3B4D',
      btnInk: '#FFFFFF',
      btnRing: '#E685A9',
      fontHead: "'Montserrat', sans-serif",
      fontBody: "'Inter', sans-serif",
    },
    eyebrow: 'Invitaciones digitales para revelación de género',
    h1Prefix: 'El secreto mejor guardado, con todos tus invitados ',
    h1Highlight: 'a tiempo',
    h1Suffix: '.',
    waMessage: 'Hola, quiero información sobre invitaciones digitales para revelación de género',
    phone: {
      category: 'gender_reveal',
      topBadge: '¿Niño o Niña?',
      title: 'Team Rosa o Azul',
      dateStr: '05 · 11 · 2027',
      targetDate: '2027-11-05T17:00:00',
      guestName: 'Familia Navarro',
      passesText: '3 pases',
      rsvpDoneToast: 'Así le llega a tu panel: “Familia Navarro confirmó 3 pases”',
    },
    problemTitle: 'La revelación es a una hora exacta: nadie puede llegar tarde.',
    problemItems: [
      'Si los invitados llegan tarde, se pierden el humo, el polvo o el pastel de la revelación.',
      'La gente pregunta el dress code (¿venir de rosa o azul?) una y otra vez.',
      'No sabes cuántos souvenirs o recuerditos de cada color preparar.',
      'Enviar la ubicación por chat normal hace que los autos se pierdan en el camino.',
    ],
    showSeatsStat: false,
    outcomeTitle: 'Puntualidad total y la emoción al máximo.',
    outcomeItems: [
      'Cuenta regresiva exacta al momento de la revelación: todos llegan a tiempo.',
      'Dress code temático claro: ropa blanca, rosa o azul según su pronóstico.',
      'Conteo de confirmados para calcular humo, recuerditos y comida.',
      'Ubicación con Waze y Google Maps para que nadie se retrase.',
    ],
    stepsTitle: 'Crea la intriga en 3 pasos rápidos.',
    salesSteps: [
      {
        title: 'Personaliza tu diseño interactivo',
        description: 'Sube el ultrasonido o foto de papás y define la hora del gran momento.',
      },
      {
        title: 'Compártela por WhatsApp',
        description: 'Tus familiares eligen su team y ven la cuenta regresiva en vivo.',
      },
      {
        title: 'Mira las confirmaciones llegar',
        description: 'Sabes exactamente cuántos asistirán para preparar el momento cumbre.',
      },
    ],
    whyTitle: 'La expectativa que tu festejo merece.',
    whyLead: 'Diseñada para generar misterio y asegurar la puntualidad:',
    whyCards: [
      {
        title: 'Cuenta regresiva al segundo',
        description: 'Recuerda la hora exacta en la que se revela el gran secreto.',
      },
      {
        title: 'Dinámica visual de colores',
        description: 'Reglas de vestimenta y pronósticos claros.',
      },
      {
        title: 'Confirmación instantánea',
        description: 'En un solo clic confirman asistencia para toda su familia.',
      },
    ],
    recommendedPlan: {
      badge: 'El más elegido para revelación',
      name: 'Plan Clásica',
      price: '$499',
      period: 'MXN · un solo pago',
      note: 'Sin límite de envíos · un solo pago',
      features: [
        'Diseño especial para Gender Reveal (Rosa & Azul o Monocromático)',
        'Cuenta regresiva animada para la hora de la revelación',
        'Código de vestimenta temático (Team Rosa / Team Azul)',
        'Ubicación con mapas interactivos',
        'Mesa de regalos o datos bancarios',
        'Confirmación de asistencia por WhatsApp',
      ],
      savingsText: '<b>Puntualidad asegurada:</b> nadie se pierde el destello de color por no saber la hora o la ubicación.',
      ctaText: 'Crear mi invitación gratis',
      ctaMicro: 'La armas gratis. Pagas solo cuando la quieras publicar.',
    },
    altPlans: [
      {
        title: '¿Quieres pases individuales por familia con código QR?',
        subtitle: 'Plan Pro · pases individuales, QR y lista avanzada',
        priceOrAction: '$1,699',
        href: '/planes',
      },
      {
        title: '¿Fiesta grande con confirmación por llamada?',
        subtitle: 'Invitto Confirma · servicio de confirmación por agentes',
        priceOrAction: 'Ver ($3,499)',
        href: '/confirma',
      },
    ],
    proofTitle: 'No nos creas: pruébala.',
    proofLead: 'Ármala completa con tus datos y mírala terminada en tu celular antes de pagar un peso.',
    demoCategory: 'gender_reveal',
    objectionsTitle: 'Lo que nos preguntan antes de decidirse',
    objections: [
      {
        question: '“¿Puedo poner que lleven pañales o sobre?”',
        answer: 'Sí, puedes sugerir regalo en sobre, mesa de regalos o lluvia de pañales.',
      },
      {
        question: '“¿Se puede ocultar el resultado en la invitación?”',
        answer: '¡Por supuesto! La invitación solo genera expectativa; el secreto se revela en vivo en tu fiesta.',
      },
      {
        question: '“¿Puedo cambiar la hora de la revelación?”',
        answer: 'Sí, puedes actualizar cualquier dato desde tu panel y se sincroniza al instante.',
      },
      {
        question: '“¿Qué garantía tengo?”',
        answer: 'La ves terminada en tu celular antes de pagar, con 7 días de garantía de satisfacción.',
      },
    ],
    guaranteeTitle: 'Cero riesgo.',
    guaranteeText: 'Ármala gratis y mírala terminada. Si pagas y no te convence, tienes <b>7 días para pedir tu reembolso</b>.',
    closingTitle: '¿Niño o niña? La cuenta regresiva ya empezó.',
    closingLead: 'Prepara tu invitación ahora y reúne a todos para descubrir juntos el gran secreto.',
    closingCta: 'Crear mi invitación gratis',
    seo: {
      title: 'Invitaciones Digitales Revelación de Género — Team Rosa o Azul | Invitto',
      description: 'Crea invitaciones digitales interactivas para revelación de género con cuenta regresiva, dinámicas, mapa y confirmación directa por WhatsApp.',
      path: '/invitaciones-digitales-revelacion-de-genero',
    },
    hero: {
      badge: 'Revelación de Género',
      h1: 'El secreto mejor guardado, con todos tus invitados a tiempo.',
      subtitle: '¿Team Rosa o Team Azul? Crea expectativa con música, dinámicas de votación, ubicación y confirma la asistencia de todos por WhatsApp.',
      cta: 'Crear invitación de revelación gratis',
    },
    benefits: [],
    steps: DEFAULT_STEPS,
    testimonials: [],
    faq: [
      { question: '¿Puedo sugerir que vengan vestidos del color de su elección?', answer: 'Sí, puedes detallar el código de vestimenta temático en una sección dedicada.' },
      { question: '¿Funciona bien en cualquier celular?', answer: 'Sí, abre directo en WhatsApp en iPhone y Android sin necesidad de descargar aplicaciones.' },
      { question: '¿Cuánto tiempo sigue activa?', answer: 'Permanece activa desde la creación hasta 30 días después del evento.' },
    ],
    ctaFinal: {
      title: '¿Niño o niña? La cuenta regresiva ya empezó.',
      subtitle: 'Prepara tu invitación ahora y reúne a todos para descubrir juntos el gran secreto.',
      cta: 'Crear mi invitación gratis',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 8. Invitaciones Digitales Graduación (NUEVA) ────────────────────
  'invitaciones-digitales-graduacion': {
    slug: 'invitaciones-digitales-graduacion',
    isEventLanding: true,
    eventType: 'graduacion',
    theme: {
      key: 'graduacion',
      bg: '#0E1726',
      bg2: '#162238',
      ink: '#F8FAFC',
      muted: '#94A3B8',
      line: '#273852',
      dark: '#090E18',
      darkInk: '#F8FAFC',
      accent: '#C9A24D',
      accentText: '#E5BE6A',
      btn: '#C9A24D',
      btnInk: '#0E1726',
      btnRing: '#E5BE6A',
      fontHead: "'Cormorant Garamond', Georgia, serif",
      fontBody: "'Inter', sans-serif",
    },
    eyebrow: 'Invitaciones digitales para graduación',
    h1Prefix: 'La noche de gala que te ganaste, con los ',
    h1Highlight: 'pases bajo control',
    h1Suffix: '.',
    waMessage: 'Hola, quiero información sobre invitaciones digitales para graduación',
    phone: {
      category: 'graduacion',
      topBadge: '¡Nos Graduamos!',
      title: 'Generación 2023-2027',
      dateStr: '10 · 07 · 2027',
      targetDate: '2027-07-10T19:00:00',
      guestName: 'Familia Reyes',
      passesText: '4 pases',
      rsvpDoneToast: 'Así le llega a tu panel: “Familia Reyes confirmó 4 pases”',
    },
    problemTitle: 'El evento más formal de la carrera no puede tener desorden.',
    problemItems: [
      'El comité de graduación batalla para saber cuántos boletos y pases necesita cada alumno.',
      'Los boletos impresos se extravían o los invitados los olvidan en casa el día de la cena.',
      'En la puerta del salón se hacen filas eternas con listas de papel confusas.',
      'Nadie sabe el itinerario exacto: a qué hora es la misa, la recepción o el brindis.',
    ],
    showSeatsStat: false,
    outcomeTitle: 'Acceso ágil con QR y la gala perfecta.',
    outcomeItems: [
      'Cada familia recibe su link con el número exacto de pases asignados.',
      'Pase de acceso con código QR en el celular: check-in rápido en la entrada.',
      'Itinerario completo: ceremonia académica, misa de acción de gracias y cena-baile.',
      'Panel en tiempo real para el comité o el alumno con la lista cerrada.',
    ],
    stepsTitle: 'Tu fiesta de graduación organizada en 3 pasos.',
    salesSteps: [
      {
        title: 'Elige tu diseño de gala',
        description: 'Personaliza con los colores de tu carrera o universidad, fotos de generación e itinerario.',
      },
      {
        title: 'Envía los pases por WhatsApp',
        description: 'Cada alumno o familia recibe su link único con sus lugares asignados.',
      },
      {
        title: 'Escanea los QR en la entrada',
        description: 'Check-in en segundos desde cualquier celular, sin listas de papel.',
      },
    ],
    whyTitle: 'Elegancia y control para una noche inolvidable.',
    whyLead: 'La tecnología que los comités y graduados necesitan:',
    whyCards: [
      {
        title: 'Pases exactos por familia',
        description: 'Nadie entra con pases de más ni se generan confusiones en la puerta.',
      },
      {
        title: 'Check-in digital con QR',
        description: 'Control de acceso profesional sin filas ni retrasos para la cena.',
      },
      {
        title: 'Itinerario y mapa de gala',
        description: 'Waze y Maps para llegar puntual a la ceremonia y al salón.',
      },
    ],
    recommendedPlan: {
      badge: 'El más elegido para graduación',
      name: 'Plan Pro',
      price: '$1,699',
      period: 'MXN · un solo pago',
      note: 'Sin cobro por invitado · sin suscripción · meses sin intereses',
      features: [
        'Diseño editorial de gala con fotos de generación',
        'Pase digital individual con código QR para cada familia',
        'Sistema de check-in en puerta desde el celular',
        'Itinerario completo (ceremonia, brindis, fiesta)',
        'Acomodo de mesas y asignación de lugares',
        'Panel de confirmaciones en tiempo real',
      ],
      savingsText: '<b>Control absoluto en puerta:</b> evita filas en la entrada y boletos impresos perdidos.',
      ctaText: 'Crear invitación de graduación gratis',
      ctaMicro: 'La armas gratis. Pagas solo cuando la quieras publicar.',
    },
    altPlans: [
      {
        title: '¿Celebración íntima o fiesta de graduado individual?',
        subtitle: 'Plan Clásica · invitación elegante con confirmación WhatsApp',
        priceOrAction: '$499',
        href: '/planes',
      },
      {
        title: '¿Confirmación y llamadas por nuestro equipo?',
        subtitle: 'Invitto Confirma · nosotros confirmamos a tus invitados',
        priceOrAction: 'Ver ($3,499)',
        href: '/confirma',
      },
    ],
    proofTitle: 'No nos creas: pruébala.',
    proofLead: 'Ármala completa con tus datos y mírala terminada en tu celular antes de pagar un peso.',
    demoCategory: 'graduacion',
    objectionsTitle: 'Lo que nos preguntan antes de decidirse',
    objections: [
      {
        question: '“¿Cómo funciona el QR en la puerta?”',
        answer: 'El día del evento, el personal en la entrada escanea el QR desde cualquier celular y valida los pases en un segundo.',
      },
      {
        question: '“¿Sirve tanto para una fiesta individual como para toda la generación?”',
        answer: 'Sí, puedes usarla para tu cena familiar o para el comité de toda la carrera.',
      },
      {
        question: '“¿Puedo poner las fotos de la toga y birrete?”',
        answer: 'Sí, cuenta con galería de alta resolución para fotos individuales y de generación.',
      },
      {
        question: '“¿Qué pasa si un invitado no tiene celular?”',
        answer: 'Puedes descargar el pase en PDF o imprimir su código QR si lo necesita.',
      },
    ],
    guaranteeTitle: 'Cero riesgo.',
    guaranteeText: 'Ármala gratis y mírala terminada. Si pagas y no te convence, tienes <b>7 días para pedir tu reembolso</b>.',
    closingTitle: 'Años de esfuerzo merecen una celebración impecable.',
    closingLead: 'Arma tu invitación hoy y ten todo listo para una noche de graduación inolvidable.',
    closingCta: 'Crear mi invitación gratis',
    seo: {
      title: 'Invitaciones Digitales para Graduación — Pases con QR y RSVP',
      description: 'Pases digitales con QR para cenas de graduación, itinerario de gala, fotos de generación y confirmación por WhatsApp. Hecho en México.',
      path: '/invitaciones-digitales-graduacion',
    },
    hero: {
      badge: 'Graduación',
      h1: 'La noche de gala que te ganaste, con los pases bajo control.',
      subtitle: 'Pases individuales por alumno y familia, código QR de acceso a la fiesta, mesa de regalos o cuenta y dress code de gala. Todo en un link.',
      cta: 'Crear invitación de graduación gratis',
    },
    benefits: [],
    steps: DEFAULT_STEPS,
    testimonials: [],
    faq: [
      { question: '¿Se puede indicar código de vestimenta riguroso (Black Tie / Formal)?', answer: 'Sí, hay una sección especial para especificar el dress code con ejemplos visuales.' },
      { question: '¿Puedo incluir datos bancarios para regalos de graduación?', answer: 'Sí, cuenta con sección de regalos o transferencia bancaria.' },
      { question: '¿Cuánto tiempo sigue activa?', answer: 'Desde su creación hasta 30 días naturales después de la fecha de la graduación.' },
    ],
    ctaFinal: {
      title: 'Años de esfuerzo merecen una celebración impecable.',
      subtitle: 'Arma tu invitación hoy y ten todo listo para una noche de graduación inolvidable.',
      cta: 'Crear mi invitación gratis',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 9. Invitaciones Digitales CDMX ─────────────────────────────────
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
      subtitle: 'La plataforma mexicana para crear invitaciones de boda, XV años y todo tipo de celebraciones en la Ciudad de México.',
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
    testimonials: [],
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

  // ── 10. Invitaciones Digitales Guadalajara ──────────────────────────
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
    testimonials: [],
    faq: [
      { question: '¿Invitto funciona para eventos en toda la zona metropolitana de Guadalajara?', answer: 'Sí, funciona para eventos en Guadalajara, Zapopan, Tlaquepaque, Tonalá y toda la zona metropolitana. Incluye mapas interactivos para cualquier ubicación.' },
      { question: '¿Tienen diseños con estilo mexicano?', answer: 'Sí, tenemos plantillas que combinan elegancia moderna con toques tradicionales mexicanos. Perfectas para bodas y XV años en Jalisco.' },
      { question: '¿Cuánto cuesta?', answer: 'Los planes comienzan desde $499 MXN. Incluye diseño premium, RSVP integrado, música y envío ilimitado por WhatsApp.' },
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

  // ── 11. Invitaciones Digitales Monterrey ────────────────────────────
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
      subtitle: 'La plataforma mexicana para invitaciones de boda, XV años y celebraciones en la Sultana del Norte. Diseño premium con RSVP.',
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
    testimonials: [],
    faq: [
      { question: '¿Invitto funciona para eventos en toda el área metropolitana de Monterrey?', answer: 'Sí, funciona para Monterrey, San Pedro Garza García, San Nicolás, Apodaca, Escobedo y toda el área metropolitana. Incluye mapas interactivos.' },
      { question: '¿Puedo usar la invitación para eventos corporativos?', answer: 'Sí, Invitto funciona perfectamente para eventos empresariales, cenas de gala, aniversarios y más.' },
      { question: '¿Los invitados necesitan descargar algo?', answer: 'No, la invitación se abre directamente en el navegador del celular. Sin apps ni descargas.' },
      { question: '¿Cuánto cuesta una invitación digital?', answer: 'Los planes comienzan desde $499 MXN. Sin costos por invitado adicional.' },
      { question: '¿Puedo ver quién ya confirmó?', answer: 'Sí, tienes un panel de control donde ves todas las confirmaciones en tiempo real con nombre, número de acompañantes y notas.' },
    ],
    ctaFinal: {
      title: 'Monterrey celebra con estilo digital',
      subtitle: 'Crea tu invitación premium en minutos y compártela con un click.',
      cta: 'Empezar ahora',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 12. Invitaciones Digitales León ────────────────────────────────
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
    testimonials: [],
    faq: [
      { question: '¿Invitto funciona para eventos en todo Guanajuato?', answer: 'Sí, funciona perfectamente para León, Irapuato, Celaya, Guanajuato capital y todo el Bajío. Incluye mapas interactivos para cualquier recinto.' },
      { question: '¿Puedo enviar las invitaciones a invitados foráneos?', answer: '¡Por supuesto! Las invitaciones digitales son ideales para compartir la ubicación, opciones de hotel y detalles del evento a familiares que vienen de otras ciudades.' },
      { question: '¿Los invitados necesitan alguna aplicación?', answer: 'No, la invitación se abre directamente en el navegador de cualquier celular. Sin apps ni descargas.' },
      { question: '¿Cuánto cuesta una invitación digital?', answer: 'Los planes comienzan desde $499 MXN. Sin límite de envíos ni costos por invitado adicional.' },
    ],
    ctaFinal: {
      title: 'Tu evento en León merece la mejor invitación',
      subtitle: 'Crea tu invitación premium en minutos y compártela con un click.',
      cta: 'Empezar ahora',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 13. Invitaciones Digitales vs Papel ─────────────────────────────
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
        { feature: 'Costo por 150 invitados', invitto: 'Desde $499 MXN (total)', competitor: '$4,500 — $12,000 MXN' },
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
    testimonials: [],
    faq: [
      { question: '¿Es mal visto enviar una invitación digital a una boda?', answer: 'No, al contrario. En 2026 las invitaciones digitales son la norma en México. Ofrecen una experiencia interactiva mucho más rica que el papel y tus invitados las agradecen por la comodidad.' },
      { question: '¿Puedo complementar digital con algunas de papel?', answer: 'Sí, muchas parejas envían digital a la mayoría e imprimen unas pocas para familiares mayores. Invitto facilita ambas estrategias.' },
      { question: '¿Se ve tan elegante como una de papel?', answer: 'Sí, e incluso más. Las invitaciones de Invitto incluyen animaciones, música y diseño profesional que el papel no puede ofrecer.' },
      { question: '¿Cuánto me ahorro vs papel?', answer: 'Para una boda de 150 invitados, una invitación de papel cuesta entre $4,500 y $12,000 MXN. Con Invitto, desde $499 MXN por todo. Un ahorro de hasta 90%.' },
    ],
    ctaFinal: {
      title: 'Elige lo inteligente. Elige digital.',
      subtitle: 'Crea tu invitación premium hoy y ahorra tiempo, dinero y árboles.',
      cta: 'Crear mi invitación digital',
    },
    get jsonLd() { return buildJsonLd({ ...this.seo, faq: this.faq }); },
  },

  // ── 14. Invitto vs Paperless Post ───────────────────────────────────
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
        { feature: 'Precio por evento', invitto: 'Desde $499 MXN', competitor: 'Desde $20 USD (~$360 MXN)' },
      ],
    },
    testimonials: [],
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

  // ── 15. Invitto vs Greenvelope ──────────────────────────────────────
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
        { feature: 'Precio', invitto: 'Desde $499 MXN', competitor: 'Desde $49 USD (~$900 MXN)' },
      ],
    },
    testimonials: [],
    faq: [
      { question: '¿Greenvelope funciona en México?', answer: 'Greenvelope opera desde Estados Unidos. Su plataforma está en inglés, cobra en dólares y su método de envío principal es email, no WhatsApp.' },
      { question: '¿Invitto es más barato que Greenvelope?', answer: 'Sí, significativamente. Greenvelope cobra desde $49 USD (~$900 MXN), mientras que Invitto comienza desde $499 MXN con más funciones incluidas.' },
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

  // ── 16. Invitto vs Otras Plataformas ──────────────────────────────
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
      { icon: BarChart3, title: 'Control de confirmaciones (RSVP) real', description: 'Otras plataformas solo te dan diseño. Invitto te da tecnología para recibir confirmaciones y gestionar tus pases por familia.' },
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
    testimonials: [],
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
