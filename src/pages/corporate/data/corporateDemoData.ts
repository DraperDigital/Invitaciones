export interface Speaker {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  bio: string;
  linkedin?: string;
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  track: 'Plenaria' | 'Tech & AI' | 'Estrategia & Liderazgo' | 'Networking';
  speakers?: Speaker[];
}

export interface Sponsor {
  name: string;
  tier: 'Title' | 'Platinum' | 'Gold' | 'Media';
  logo: string;
  website: string;
}

export const CORPORATE_DEMO_SPEAKERS: Speaker[] = [
  {
    id: 'sp1',
    name: 'Dra. Elena Rostova',
    role: 'VP de Inteligencia Artificial',
    company: 'Nexus Global Tech',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80',
    bio: 'Pionera en adopción de modelos de lenguaje e hiperautomatización en empresas Fortune 500.',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'sp2',
    name: 'Lic. Roberto Sterling',
    role: 'Director de Innovación & Finanzas',
    company: 'Capital Group Latam',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80',
    bio: 'Especialista en capital de riesgo, fusiones tecnológicas y transformación digital corporativa.',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'sp3',
    name: 'Ing. Sofía Mendoza',
    role: 'Head of People Operations',
    company: 'Vanguard Enterprise',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80',
    bio: 'Líder en cultura organizacional híbrida y retención de talento ejecutivo multinacional.',
    linkedin: 'https://linkedin.com',
  },
];

export const CORPORATE_DEMO_AGENDA: AgendaItem[] = [
  {
    id: 'ag1',
    time: '08:30 - 09:30 AM',
    title: 'Acreditación, Entrega de Gafetes & Coffee Break Networking',
    description: 'Ingreso ágil en puerta con código QR y recepción ejecutiva en el Gran Foyer del centro de convenciones.',
    location: 'Foyer Principal · Acceso Norte',
    track: 'Networking',
  },
  {
    id: 'ag2',
    time: '09:30 - 10:45 AM',
    title: 'Keynote Magna: El Futuro de la Empresa Inteligente 2026+',
    description: 'Estrategias de escalabilidad, agentes autónomos e integración de valor en mercados globales.',
    location: 'Auditorio Principal A',
    track: 'Plenaria',
    speakers: [CORPORATE_DEMO_SPEAKERS[0]],
  },
  {
    id: 'ag3',
    time: '11:00 - 12:30 PM',
    title: 'Panel Ejecutivo: Inversión Tecnológica y Retorno de Capital',
    description: 'Mesa de debate con directores de finanzas sobre presupuestos de infraestructura y seguridad de datos.',
    location: 'Salón Innovación B',
    track: 'Estrategia & Liderazgo',
    speakers: [CORPORATE_DEMO_SPEAKERS[1], CORPORATE_DEMO_SPEAKERS[2]],
  },
  {
    id: 'ag4',
    time: '02:00 - 04:00 PM',
    title: 'Comida de Honor & Networking VIP con Directivos',
    description: 'Encuentro exclusivo para asistentes acreditados y patrocinadores del Summit.',
    location: 'Terraza Ejecutiva 360°',
    track: 'Networking',
  },
];

export const CORPORATE_DEMO_SPONSORS: Sponsor[] = [
  { name: 'Nexus Tech', tier: 'Title', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80', website: '#' },
  { name: 'Capital Group', tier: 'Platinum', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80', website: '#' },
  { name: 'Vanguard Labs', tier: 'Platinum', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80', website: '#' },
  { name: 'Enterprise Cloud', tier: 'Gold', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80', website: '#' },
];

export const CORPORATE_PLANES = [
  {
    id: 'corporate_event',
    name: 'Corporate Event',
    price: '$8,999',
    period: 'MXN / evento',
    description: 'Ideal para cenas gala, aniversarios de empresa y lanzamientos.',
    badge: 'MÁS POPULAR',
    features: [
      'Hasta 500 Ejecutivos Acreditados',
      'Confirmación RSVP Ejecutiva (Cargo y Empresa)',
      'Envío Masivo Nativo por WhatsApp & Email',
      'Pases Ejecutivos con Código QR',
      'Check-in Rápido en Puerta con Scanner App',
      'Ubicación GPS (Maps & Waze)',
      'Soporte Técnico Directo',
    ],
    cta: 'Contratar Plan Corporate',
  },
  {
    id: 'summit_congreso',
    name: 'Summit / Congreso',
    price: '$18,999',
    period: 'MXN / evento',
    description: 'Diseñado para congresos, cumbres y convenciones multi-día.',
    badge: 'MULTITRACK & SPEAKERS',
    popular: true,
    features: [
      'Asistentes Ilimitados',
      'Agenda Multi-Track & Salones',
      'Directorio de Ponentes (Speakers)',
      'Módulo de Patrocinadores (Sponsors Grid)',
      'Generador de Gafetes Ejecutivos (PDF/QR)',
      'Validación de Dominio de Correo (@empresa.com)',
      'Dominio Personalizado Incluido',
      'Marca Blanca (Sin Leyenda Invitto)',
      'Gerente de Cuenta Dedicado',
    ],
    cta: 'Contratar Plan Summit',
  },
  {
    id: 'enterprise_anual',
    name: 'Enterprise Anual',
    price: 'A Medida',
    period: 'Licencia Corporativa',
    description: 'Para corporativos con múltiples eventos internos y externos al año.',
    badge: 'MULTINACIONAL',
    features: [
      'Eventos e Invitados Ilimitados',
      'Integración CRM (Salesforce / HubSpot)',
      'Single Sign-On (SSO / SAML / Okta)',
      'Acuerdo de Confidencialidad (NDA Digital)',
      'SLA de Soporte 24/7 Garantizado',
      'Infraestructura Dedicada & Reportes Avanzados',
    ],
    cta: 'Hablar con un Consultor',
  },
];
