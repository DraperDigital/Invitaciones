export interface ThemeProfile {
    label: string;
    desc: string;
    icon: string;
    primaryColor: string;
    accentColor: string;
    cardBgColor: string;
    sectionBgColor: string;
    textPrimary: string;
    textSecondary: string;
    heroTextColor: string;
    heroBgColor: string;
    typographyPreset: 'elegante' | 'moderna' | 'romantica' | 'divertida';
}

export const THEME_PRESET_PROFILES: Record<string, ThemeProfile> = {
    'classic': {
        label: 'Clásica Atemporal',
        desc: 'Fondo marfil, ornamentos dorados y tipografía con serifa atemporal',
        icon: '✨',
        primaryColor: '#2B2625',
        accentColor: '#C5A059',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FAF8F5',
        textPrimary: '#2B2625',
        textSecondary: '#7A6E65',
        heroTextColor: '#FFFFFF',
        heroBgColor: '#2B2625',
        typographyPreset: 'elegante'
    },
    'classic-elegance': {
        label: 'Clásica Atemporal',
        desc: 'Fondo marfil, ornamentos dorados y tipografía con serifa atemporal',
        icon: '✨',
        primaryColor: '#2B2625',
        accentColor: '#C5A059',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FAF8F5',
        textPrimary: '#2B2625',
        textSecondary: '#7A6E65',
        heroTextColor: '#FFFFFF',
        heroBgColor: '#2B2625',
        typographyPreset: 'elegante'
    },
    'classic-elegance-pro': {
        label: 'Clásica Atemporal Pro',
        desc: 'Editorial oscuro — negro profundo, acentos en oro intenso y portada full-screen',
        icon: '👑',
        primaryColor: '#0A0A0A',
        accentColor: '#D4AF37',
        cardBgColor: '#1A1A1A',
        sectionBgColor: '#111111',
        textPrimary: '#F5E9C9',
        textSecondary: '#A39060',
        heroTextColor: '#F5D76E',
        heroBgColor: '#0A0A0A',
        typographyPreset: 'elegante'
    },
    'modern-minimalist': {
        label: 'Moderna Minimalista',
        desc: 'Líneas limpias, tipografía contemporánea y sobriedad monocromática',
        icon: '🖤',
        primaryColor: '#111111',
        accentColor: '#222222',
        cardBgColor: '#F5F5F7',
        sectionBgColor: '#FFFFFF',
        textPrimary: '#111111',
        textSecondary: '#666666',
        heroTextColor: '#111111',
        heroBgColor: '#FFFFFF',
        typographyPreset: 'moderna'
    },
    'split-screen': {
        label: 'Vanguardia Dividida',
        desc: 'Contraste moderno de imagen a pantalla dividida y tonos azules',
        icon: '🌓',
        primaryColor: '#0F172A',
        accentColor: '#38BDF8',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#F8FAFC',
        textPrimary: '#0F172A',
        textSecondary: '#64748B',
        heroTextColor: '#FFFFFF',
        heroBgColor: '#0F172A',
        typographyPreset: 'moderna'
    },
    'magazine': {
        label: 'Estilo Editorial',
        desc: 'Estilo portada de revista de moda, tipografía audaz y alto contraste',
        icon: '📖',
        primaryColor: '#000000',
        accentColor: '#E63946',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#F8F9FA',
        textPrimary: '#111111',
        textSecondary: '#4A4A4A',
        heroTextColor: '#000000',
        heroBgColor: '#FFFFFF',
        typographyPreset: 'moderna'
    },
    'romantic-botanical': {
        label: 'Elegancia Floral',
        desc: 'Ilustraciones botánicas delicadas, verdes bosque y rosas empolvados',
        icon: '🌿',
        primaryColor: '#2D3A2D',
        accentColor: '#9E6B6B',
        cardBgColor: '#FDFBF7',
        sectionBgColor: '#F4F7F4',
        textPrimary: '#2D3A2D',
        textSecondary: '#6B7A6B',
        heroTextColor: '#2D3A2D',
        heroBgColor: '#E8EFE8',
        typographyPreset: 'romantica'
    },
    'floral-symmetry': {
        label: 'Simetría Floral',
        desc: 'Marcos simétricos con ornamentos botánicos, rosa empolvado y eucalipto',
        icon: '🌸',
        primaryColor: '#3A5240',
        accentColor: '#B85568',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FAF7F5',
        textPrimary: '#262223',
        textSecondary: '#6B6062',
        heroTextColor: '#3A5240',
        heroBgColor: '#FAF7F5',
        typographyPreset: 'romantica'
    },
    'neon-glow': {
        label: 'Fiesta Neón',
        desc: 'Luces de neón vibrantes sobre fondo nocturno ultramoderno para fiesta',
        icon: '🪩',
        primaryColor: '#0F051D',
        accentColor: '#FF007F',
        cardBgColor: '#1A0933',
        sectionBgColor: '#0A0014',
        textPrimary: '#00F0FF',
        textSecondary: '#B57EDC',
        heroTextColor: '#00F0FF',
        heroBgColor: '#0F051D',
        typographyPreset: 'moderna'
    },
    'luxury-gold': {
        label: 'Lujo Metálico',
        desc: 'Destellos metálicos dorados sobre fondo oscuro de noche para galas',
        icon: '🌟',
        primaryColor: '#141414',
        accentColor: '#D4AF37',
        cardBgColor: '#1F1F1F',
        sectionBgColor: '#0B0B0B',
        textPrimary: '#F5D76E',
        textSecondary: '#A39060',
        heroTextColor: '#F5D76E',
        heroBgColor: '#0B0B0B',
        typographyPreset: 'elegante'
    },
    'passport': {
        label: 'Pase de Abordaje',
        desc: 'Temática de pasaporte y viaje para bodas destino y escapadas',
        icon: '✈️',
        primaryColor: '#0B2545',
        accentColor: '#134074',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#EEF4F8',
        textPrimary: '#0B2545',
        textSecondary: '#5C748D',
        heroTextColor: '#FFFFFF',
        heroBgColor: '#0B2545',
        typographyPreset: 'moderna'
    },
    'polaroid-vintage': {
        label: 'Retro Fotográfico',
        desc: 'Fotografías de estilo instantáneo y nostálgico con marcos cálidos sepia',
        icon: '📸',
        primaryColor: '#3D312A',
        accentColor: '#C87D55',
        cardBgColor: '#FFFDF9',
        sectionBgColor: '#EAE3D9',
        textPrimary: '#3D312A',
        textSecondary: '#7A6B61',
        heroTextColor: '#3D312A',
        heroBgColor: '#EAE3D9',
        typographyPreset: 'romantica'
    },
    'whimsical-kids': {
        label: 'Fantasía Infantil',
        desc: 'Colores alegres, pasteles brillantes e ilustraciones mágicas para peques',
        icon: '🎈',
        primaryColor: '#2C3E50',
        accentColor: '#FF6B6B',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FFF9EC',
        textPrimary: '#2C3E50',
        textSecondary: '#7F8C8D',
        heroTextColor: '#2C3E50',
        heroBgColor: '#FFEAA7',
        typographyPreset: 'divertida'
    },
    'collage': {
        label: 'Collage Elegante',
        desc: 'Composición dinámica de fotos inolvidables y tonos tierra cálidos',
        icon: '🖼️',
        primaryColor: '#332C27',
        accentColor: '#B07D62',
        cardBgColor: '#FFFDF9',
        sectionBgColor: '#F7F4EF',
        textPrimary: '#332C27',
        textSecondary: '#786C65',
        heroTextColor: '#FFFFFF',
        heroBgColor: '#332C27',
        typographyPreset: 'romantica'
    }
};

export interface CanonicalTemplate {
    id: string;
    name: string;
    category: string;
    categoryLabel: string;
    slug: string;
    icon: string;
    plan: string;
    thumbnail: string;
}

export const CANONICAL_TEMPLATES: CanonicalTemplate[] = [
    { id: 'modern-minimalist', name: 'Moderna Minimalista', category: 'boda', categoryLabel: 'Boda / Vanguardia', slug: 'boda-gabriela-arturo-premium', icon: '🖤', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop' },
    { id: 'split-screen', name: 'Vanguardia Dividida', category: 'boda', categoryLabel: 'Boda / Vanguardia', slug: 'boda-sofia-mateo-premium', icon: '🌓', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop' },
    { id: 'classic', name: 'Clásica Atemporal', category: 'boda', categoryLabel: 'Boda / Elegante', slug: 'boda-isabel-rodrigo-premium', icon: '✨', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop' },
    { id: 'classic-elegance-pro', name: 'Clásica Atemporal Pro', category: 'boda', categoryLabel: 'Boda / Lujo', slug: 'boda-ana-y-carlos-premium', icon: '👑', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop' },
    { id: 'magazine', name: 'Estilo Editorial', category: 'xv', categoryLabel: 'XV / Gala', slug: 'xv-valeria-premium', icon: '📖', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop' },
    { id: 'romantic-botanical', name: 'Elegancia Floral', category: 'xv', categoryLabel: 'XV / Primavera', slug: 'xv-regina-2026-premium', icon: '🌿', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop' },
    { id: 'floral-symmetry', name: 'Simetría Floral', category: 'boda', categoryLabel: 'Boda / Jardín', slug: 'boda-simetria-floral', icon: '🌸', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop' },
    { id: 'neon-glow', name: 'Fiesta Neón', category: 'cumpleanos', categoryLabel: 'Cumpleaños / Party', slug: 'cumple-emilia-premium', icon: '🪩', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop' },
    { id: 'luxury-gold', name: 'Lujo Metálico', category: 'boda', categoryLabel: 'Gala / Aniversario', slug: 'gala-aniversario-premium', icon: '🌟', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1519671482749-fd09871171dd?q=80&w=800&auto=format&fit=crop' },
    { id: 'passport', name: 'Pase de Abordaje', category: 'boda', categoryLabel: 'Boda Destino', slug: 'boda-destino-premium', icon: '✈️', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop' },
    { id: 'polaroid-vintage', name: 'Retro Fotográfico', category: 'graduacion', categoryLabel: 'Graduación / Retro', slug: 'graduacion-ana-psicologia-premium', icon: '📸', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop' },
    { id: 'whimsical-kids', name: 'Fantasía Infantil', category: 'bautizo', categoryLabel: 'Infantil / Bautizo', slug: 'bautizo-victoria-premium', icon: '🎈', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop' },
    { id: 'collage', name: 'Collage Elegante', category: 'boda', categoryLabel: 'Boda / Álbum', slug: 'boda-collage-premium', icon: '🖼️', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop' }
];
