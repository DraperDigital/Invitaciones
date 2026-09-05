/**
 * sectionRegistry.ts
 * ──────────────────
 * Fuente única de verdad para el layout modular de invitaciones.
 *
 * MODELO MENTAL:
 *   tipo_evento  → define el ORDEN y las secciones presentes (layout preset)
 *   plan         → define QUÉ puede activarse (gating por tier)
 *   render final → intersección de ambos
 *
 * Cada SectionDef describe UN bloque de contenido:
 *  - id          → clave única, almacenada en theme_config.sectionOrder[]
 *  - label       → nombre en la UI del editor
 *  - planRequired→ plan mínimo para que el bloque sea visible
 *  - configKey   → flag boolean en theme_config que activa/desactiva la sección
 *  - fixed       → no reordenable (Hero, Footer)
 *  - defaultOrder→ posición en el layout genérico por defecto
 *
 * Layout base (estructura universal):
 *   [Hero]  →  [contenido dinámico por evento]  →  [RSVP]  →  [Footer]
 */

// ── Tipos ──────────────────────────────────────────────────────────────────

export type SectionId =
  | 'hero'           // FIJO — siempre primero
  | 'guest_welcome'  // FIJO — saludo personalizado al invitado
  | 'message'        // Texto de bienvenida / descripción del evento
  | 'location'       // Mapa + dirección (misa y/o celebración)
  | 'dress_code'     // Código de vestimenta
  | 'itinerary'      // Programa del día (Pro+)
  | 'rsvp'           // Confirmación de asistencia
  | 'gifts'          // Mesa de regalos (Pro+)
  | 'countdown'      // Cuenta regresiva (embebida en Hero para algunos tiers)
  | 'gallery'        // Galería de fotos (Premium)
  | 'chambelanes'    // Corte de honor / damas (Pro+)
  | 'hotels'         // Hospedaje (Premium — futuro)
  | 'footer';        // FIJO — siempre último

export type PlanTier = 'clasico' | 'pro' | 'premium';

/** Normaliza strings de plan (ej. 'CLASSIC' -> 'clasico') */
export function normalizePlan(plan: string | null | undefined): PlanTier {
  const p = (plan || '').toLowerCase();
  if (p === 'premium') return 'premium';
  if (p === 'pro') return 'pro';
  return 'clasico';
}

/** Compara si un plan tiene nivel suficiente para un requerimiento */
export function isPlanAtLeast(current: PlanTier, required: PlanTier): boolean {
  const ranks: Record<PlanTier, number> = { clasico: 0, pro: 1, premium: 2 };
  return (ranks[current] ?? 0) >= (ranks[required] ?? 0);
}

export type EventType =
  | 'xv'
  | 'wedding'
  | 'birthday'
  | 'bautizo'
  | 'primera_comunion'
  | 'confirmacion'
  | 'baby_shower'
  | 'gender_reveal'
  | 'graduacion'
  | 'corporate'
  | 'other';

export type SectionDef = {
  id: SectionId;
  label: string;
  icon: string;
  planRequired: PlanTier;
  /** Flag boolean en theme_config que puede desactivar esta sección */
  configKey?: keyof Record<string, any>;
  /** Posición ordinal por defecto (1..N) */
  defaultOrder: number;
  /** Indica si la sección está en posición fija y no puede moverse */
  fixed?: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRO DE SECCIONES (catálogo maestro de bloques disponibles)
// ─────────────────────────────────────────────────────────────────────────────

export const SECTION_REGISTRY: SectionDef[] = [
  {
    id: 'hero',
    label: 'Portada Principal',
    icon: '🖼️',
    planRequired: 'clasico',
    defaultOrder: 1,
    fixed: true,
  },
  {
    id: 'guest_welcome',
    label: 'Mensaje de Bienvenida',
    icon: '💌',
    planRequired: 'clasico',
    configKey: 'showGuestWelcome',
    defaultOrder: 2,
    fixed: true,
  },
  {
    id: 'message',
    label: 'Dedicatoria y Mensaje',
    icon: '✍️',
    planRequired: 'clasico',
    configKey: 'showMessage',
    defaultOrder: 3,
  },
  {
    id: 'location',
    label: 'Ubicación y Mapa',
    icon: '📍',
    planRequired: 'clasico',
    configKey: 'showMap',
    defaultOrder: 4,
  },
  {
    id: 'dress_code',
    label: 'Código de Vestimenta',
    icon: '👔',
    planRequired: 'clasico',
    configKey: 'showDetails',
    defaultOrder: 5,
  },
  {
    id: 'itinerary',
    label: 'Itinerario del Evento',
    icon: '⏱️',
    planRequired: 'pro',
    configKey: 'showItinerary',
    defaultOrder: 6,
  },
  {
    id: 'rsvp',
    label: 'Confirmación RSVP',
    icon: '💌',
    planRequired: 'clasico',
    configKey: 'showWhatsAppRSVP',
    defaultOrder: 7,
  },
  {
    id: 'gifts',
    label: 'Mesa de Regalos',
    icon: '🎁',
    planRequired: 'clasico',
    configKey: 'showGifts',
    defaultOrder: 8,
  },
  {
    id: 'countdown',
    label: 'Cuenta Regresiva',
    icon: '⏳',
    planRequired: 'clasico',
    configKey: 'showCountdown',
    defaultOrder: 9,
  },
  {
    id: 'gallery',
    label: 'Galería de Fotos',
    icon: '📸',
    planRequired: 'clasico',
    configKey: 'showGallery',
    defaultOrder: 10,
  },
  {
    id: 'chambelanes',
    label: 'Corte de Honor',
    icon: '👑',
    planRequired: 'pro',
    configKey: 'showChambelanes',
    defaultOrder: 11,
  },
  {
    id: 'hotels',
    label: 'Hoteles y Hospedaje',
    icon: '🏨',
    planRequired: 'clasico',
    configKey: 'showHotels',
    defaultOrder: 12,
  },
  {
    id: 'footer',
    label: 'Pie de Página',
    icon: '🌟',
    planRequired: 'clasico',
    defaultOrder: 99,
    fixed: true,
  },
];

// ── Orden por defecto (sin preset de evento) ───────────────────────────────

export const DEFAULT_SECTION_ORDER: SectionId[] = SECTION_REGISTRY
  .slice()
  .sort((a, b) => a.defaultOrder - b.defaultOrder)
  .map((s) => s.id);

// ── Layout presets por tipo de evento ─────────────────────────────────────
//
// Cada preset define el ORDEN y las secciones que el tipo de evento incluye.
// El plan define QUÉ puede mostrarse de esa lista.
// render final = preset ∩ plan_allowed ∩ configKey_enabled
//
// Regla: siempre incluir 'hero', 'guest_welcome', 'rsvp', 'footer'
// (son fixed y se garantizan independientemente, pero los dejamos explícitos
//  para que el orden sea claro y completo).

export const EVENT_LAYOUT_PRESETS: Record<EventType, SectionId[]> = {
  xv: [
    'hero',
    'guest_welcome',
    'message',
    'rsvp',
    'itinerary',
    'location',
    'dress_code',
    'gallery',
    'chambelanes',
    'gifts',
    'countdown',
    'footer',
  ],
  wedding: [
    'hero',
    'guest_welcome',
    'message',
    'rsvp',
    'itinerary',
    'location',
    'dress_code',
    'gifts',
    'gallery',
    'hotels',
    'countdown',
    'footer',
  ],
  birthday: [
    'hero',
    'guest_welcome',
    'message',
    'rsvp',
    'location',
    'countdown',
    'footer',
  ],
  bautizo: [
    'hero',
    'guest_welcome',
    'message',
    'rsvp',
    'location',
    'dress_code',
    'gifts',
    'gallery',
    'footer',
  ],
  primera_comunion: [
    'hero',
    'guest_welcome',
    'message',
    'rsvp',
    'location',
    'dress_code',
    'gifts',
    'gallery',
    'footer',
  ],
  confirmacion: [
    'hero',
    'guest_welcome',
    'message',
    'rsvp',
    'location',
    'dress_code',
    'footer',
  ],
  baby_shower: [
    'hero',
    'guest_welcome',
    'message',
    'rsvp',
    'location',
    'gifts',
    'gallery',
    'countdown',
    'footer',
  ],
  gender_reveal: [
    'hero',
    'guest_welcome',
    'message',
    'rsvp',
    'location',
    'gallery',
    'countdown',
    'footer',
  ],
  graduacion: [
    'hero',
    'guest_welcome',
    'message',
    'rsvp',
    'itinerary',
    'location',
    'countdown',
    'gallery',
    'footer',
  ],
  corporate: [
    'hero',
    'guest_welcome',
    'message',
    'rsvp',
    'itinerary',
    'location',
    'dress_code',
    'footer',
  ],
  other: [
    'hero',
    'guest_welcome',
    'message',
    'rsvp',
    'location',
    'dress_code',
    'gifts',
    'footer',
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────

/** Devuelve la SectionDef de una sección por su id */
export function getSectionDef(id: SectionId): SectionDef | undefined {
  return SECTION_REGISTRY.find((s) => s.id === id);
}

/**
 * Devuelve el layout preset para un tipo de evento.
 * Si el tipo no existe, usa DEFAULT_SECTION_ORDER.
 */
export function getLayoutForEventType(eventType: string): SectionId[] {
  return EVENT_LAYOUT_PRESETS[eventType as EventType] ?? DEFAULT_SECTION_ORDER;
}

/**
 * Construye la cola de secciones a renderizar, en orden, aplicando:
 *  1. Orden del preset (layout del evento o personalizado)
 *  2. Filtro de plan (planRequired <= tier actual)
 *  3. Filtro de configKey (si configKey === false en theme_config, excluir)
 *
 * @param tier        Plan activo ('clasico' | 'pro' | 'premium')
 * @param themeConfig Objeto theme_config del evento
 * @param order       Array de SectionId — viene de theme_config.sectionOrder
 *                    (que a su vez se inicializó con el EVENT_LAYOUT_PRESET al crear)
 */
export function buildSectionQueue(
  tier: PlanTier,
  themeConfig: Record<string, unknown>,
  order: SectionId[] = DEFAULT_SECTION_ORDER,
): SectionDef[] {

  const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

  const filtered = order
    .map((id) => getSectionDef(id))
    .filter((def): def is SectionDef => {
      if (!def) return false;

      // 1. Filtrar por plan
      if (!isPlanAtLeast(tier, def.planRequired)) return false;

      // 2. Filtrar por configKey (Doble compatibilidad camelCase y snake_case)
      if (def.configKey) {
        const camelKey = def.configKey;
        const snakeKey = toSnakeCase(camelKey);
        
        // Si cualquiera de los dos está en false, se oculta.
        // Si no existen (undefined), se asume true (visible por defecto).
        if (themeConfig[camelKey] === false || themeConfig[snakeKey] === false) {
            return false;
        }
      }

      return true;
    });

  // REGLA ESTRICTA DE LAYOUT:
  // - 'hero' SIEMPRE es el primer elemento.
  // - 'guest_welcome' SIEMPRE es el segundo elemento (fijo después de hero, si está activo).
  // - 'footer' SIEMPRE va hasta el final absoluto, nunca entre secciones intermedias.
  const heroDef = filtered.find((s) => s.id === 'hero');
  const guestWelcomeDef = filtered.find((s) => s.id === 'guest_welcome');
  const footerDef = filtered.find((s) => s.id === 'footer');
  const contentSections = filtered.filter((s) => s.id !== 'hero' && s.id !== 'guest_welcome' && s.id !== 'footer');

  const result: SectionDef[] = [];
  if (heroDef) result.push(heroDef);
  if (guestWelcomeDef) result.push(guestWelcomeDef);
  result.push(...contentSections);
  if (footerDef) result.push(footerDef);

  return result;
}

/**
 * Devuelve sólo las secciones reordenables (no fijas) para
 * el editor visual de orden.
 */
export function getReorderableSections(order: SectionId[] = DEFAULT_SECTION_ORDER): SectionDef[] {
  return order
    .map((id) => getSectionDef(id))
    .filter((def): def is SectionDef => !!def && !def.fixed);
}

/**
 * Devuelve todas las secciones permitidas por el plan,
 * ignorando si están activas o no por configKey.
 * Útil para listados de administración/toggles.
 */
export function buildFullPlanQueue(
  tier: PlanTier
): SectionDef[] {
  return SECTION_REGISTRY
    .filter((def): def is SectionDef => {
      return isPlanAtLeast(tier, def.planRequired);
    });
}
