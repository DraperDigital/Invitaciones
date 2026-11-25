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
    'cinematic-motion': {
        label: 'Cinemática Motion (HTML Parallax)',
        desc: 'Portada cinematográfica responsiva, efectos parallax multidimensionales, texturas de papel y detalles en ocre cálido',
        icon: '🎨',
        primaryColor: '#CCA461',
        accentColor: '#CCA461',
        cardBgColor: '#FDF8F0',
        sectionBgColor: '#E1EAF2',
        textPrimary: '#4A443E',
        textSecondary: '#8D6B4F',
        heroTextColor: '#4A443E',
        heroBgColor: '#E1EAF2',
        typographyPreset: 'elegante'
    },
    'classic': {
        label: 'Clásica Atemporal',
        desc: 'Fondo marfil, ornamentos dorados y tipografía con serifa atemporal',
        icon: '🏛️',
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
        icon: '🏛️',
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
    'newspaper': {
        label: 'Primera Plana',
        desc: 'Portada de periódico — cabecera con líneas, nota a dos columnas y tipografía editorial',
        icon: '📰',
        primaryColor: '#1A1A1A',
        accentColor: '#1A1A1A',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#F7F6F3',
        textPrimary: '#1A1A1A',
        textSecondary: '#5C5C5C',
        heroTextColor: '#1A1A1A',
        heroBgColor: '#FFFFFF',
        typographyPreset: 'elegante'
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
    'kids-farm': {
        label: 'Zoológico Aventura',
        desc: 'Expedición salvaje con león, jirafa, monito travieso, hojas de la selva y estilo safari para peques',
        icon: '🦁',
        primaryColor: '#15803D',
        accentColor: '#D97706',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#F0FDF4',
        textPrimary: '#1E293B',
        textSecondary: '#475569',
        heroTextColor: '#0F172A',
        heroBgColor: '#DCFCE7',
        typographyPreset: 'divertida'
    },
    'gamer-party': {
        label: 'Gamer Party',
        desc: 'Estilo arcade y consola con control neón, tipografía pixel 8-bit y modo oscuro RGB',
        icon: '🎮',
        primaryColor: '#10B981',
        accentColor: '#3B82F6',
        cardBgColor: '#111827',
        sectionBgColor: '#0B0F19',
        textPrimary: '#F9FAFB',
        textSecondary: '#9CA3AF',
        heroTextColor: '#FFFFFF',
        heroBgColor: '#0A0D14',
        typographyPreset: 'moderna'
    },
    'pixel-craft': {
        label: 'Mundo Píxel',
        desc: 'Aventura de bloques cúbicos estilo Minecraft con Creeper, pastel con velas, banderines y estética voxel',
        icon: '🟩',
        primaryColor: '#22C55E',
        accentColor: '#FACC15',
        cardBgColor: '#523A28',
        sectionBgColor: '#3D2817',
        textPrimary: '#F9FAFB',
        textSecondary: '#FEF3C7',
        heroTextColor: '#86EFAC',
        heroBgColor: '#3D2817',
        typographyPreset: 'divertida'
    },
    'rainbow-pop': {
        label: 'Rainbow Pop',
        desc: 'Diseño súper alegre con letras burbuja multicolor, confetti pastel, tarjetas con bordes celestes y estilo festivo',
        icon: '🌈',
        primaryColor: '#EC4899',
        accentColor: '#06B6D4',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FAFAF9',
        textPrimary: '#1E293B',
        textSecondary: '#64748B',
        heroTextColor: '#EC4899',
        heroBgColor: '#FDF2F8',
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
    },
    'astronauta': {
        label: 'Astronauta',
        desc: 'Cumpleaños espacial en acuarela: cielo nocturno, cohete, luna y arcos con línea punteada',
        icon: '🚀',
        primaryColor: '#5B82B5',
        accentColor: '#F2A65A',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#F3F0EA',
        textPrimary: '#22324A',
        textSecondary: '#55627A',
        heroTextColor: '#FFFFFF',
        heroBgColor: '#22324A',
        typographyPreset: 'moderna'
    },
    'nube-de-miel': {
        label: 'Nube de Miel',
        desc: 'Editorial tierno en azul marino, cielo y miel, con capítulos e ilustraciones propias',
        icon: '🐑',
        primaryColor: '#0F2A4A',
        accentColor: '#0F2A4A',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FAF7F1',
        textPrimary: '#13243A',
        textSecondary: '#5A6B80',
        heroTextColor: '#FFFFFF',
        heroBgColor: '#0F2A4A',
        typographyPreset: 'elegante'
    },
    'sirenita': {
        label: 'Sirenita',
        desc: 'Cumpleaños de niña bajo el mar: acuarela pastel, cola de sirena, listón lila y concha',
        icon: '🧜‍♀️',
        primaryColor: '#6B4E9B',
        accentColor: '#E98A9B',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FBF8F4',
        textPrimary: '#4A3D66',
        textSecondary: '#7A6B8F',
        heroTextColor: '#6B4E9B',
        heroBgColor: '#FBF8F4',
        typographyPreset: 'romantica'
    },
    'gotico-suave': {
        label: 'Gótico Suave',
        desc: 'Collage gótico: damasco gris, sobre negro con flores oscuras, marcos barrocos y tarjetas carmesí',
        icon: '🖤',
        primaryColor: '#141414',
        accentColor: '#141414',
        cardBgColor: '#F7F3EA',
        sectionBgColor: '#E9E6E6',
        textPrimary: '#141414',
        textSecondary: '#3A3A3A',
        heroTextColor: '#141414',
        heroBgColor: '#E9E6E6',
        typographyPreset: 'elegante'
    },
    'lacre-rojo': {
        label: 'Lacre Rojo',
        desc: 'Editorial en blanco y negro con un solo acento: el sello de lacre rojo',
        icon: '❤️',
        primaryColor: '#111111',
        accentColor: '#111111',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FFFFFF',
        textPrimary: '#111111',
        textSecondary: '#3A3A3A',
        heroTextColor: '#111111',
        heroBgColor: '#FFFFFF',
        typographyPreset: 'moderna'
    },
    'bodegon-nocturno': {
        label: 'Bodegón Nocturno',
        desc: 'Lujo clásico: papel de algodón sobre pintura floral oscura, caligrafía con florituras y sello dorado',
        icon: '🥀',
        primaryColor: '#141210',
        accentColor: '#141210',
        cardBgColor: '#F3F0EA',
        sectionBgColor: '#F3F0EA',
        textPrimary: '#141210',
        textSecondary: '#3D3833',
        heroTextColor: '#141210',
        heroBgColor: '#F3F0EA',
        typographyPreset: 'elegante'
    },
    'anturio-vino': {
        label: 'Anturio Vino',
        desc: 'Collage flat lay en vino, papel rasgado y oro: arco con foto, sello de cera y anturios',
        icon: '🍷',
        primaryColor: '#5C1A26',
        accentColor: '#5C1A26',
        cardBgColor: '#F4EFE6',
        sectionBgColor: '#D9D7D3',
        textPrimary: '#3B1A1F',
        textSecondary: '#6A4A4A',
        heroTextColor: '#5C1A26',
        heroBgColor: '#D9D7D3',
        typographyPreset: 'romantica'
    },
    'lirio-vainilla': {
        label: 'Lirio Vainilla',
        desc: 'Estilo flat lay: tarjetas de papel, sobre con forro de lirios, sello de cera y tonos salvia',
        icon: '🤍',
        primaryColor: '#1D1D1B',
        accentColor: '#1D1D1B',
        cardBgColor: '#FBFAF6',
        sectionBgColor: '#DCDCD2',
        textPrimary: '#1D1D1B',
        textSecondary: '#55554F',
        heroTextColor: '#1D1D1B',
        heroBgColor: '#DCDCD2',
        typographyPreset: 'romantica'
    },
    'reveal-bw': {
        label: 'Misterio Monocromático',
        desc: 'Blanco puro con contrastes negros y elegancia total. Cero pistas para máxima intriga.',
        icon: '❓',
        primaryColor: '#0A0A0A',
        accentColor: '#171717',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FAFAFA',
        textPrimary: '#0A0A0A',
        textSecondary: '#525252',
        heroTextColor: '#0A0A0A',
        heroBgColor: '#FFFFFF',
        typographyPreset: 'moderna'
    },
    'reveal-duo': {
        label: 'Dúo Rosa & Azul',
        desc: 'Equilibrio perfecto de celeste y rosa pastel para despistar a tus invitados hasta el final.',
        icon: '👶',
        primaryColor: '#0284C7',
        accentColor: '#EC4899',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FAFAFA',
        textPrimary: '#1E293B',
        textSecondary: '#64748B',
        heroTextColor: '#0284C7',
        heroBgColor: '#F8FAFC',
        typographyPreset: 'divertida'
    }
};

export interface CanonicalTemplate {
    id: string;
    name: string;
    category: string;
    categories?: string[];
    categoryLabel: string;
    slug: string;
    icon: string;
    plan: string;
    thumbnail: string;
}

export const CANONICAL_TEMPLATES: CanonicalTemplate[] = [
    { id: 'classic', name: 'Clásica Atemporal', category: 'boda', categories: ['boda', 'xv', 'graduacion', 'corporate', 'comunion', 'bautizo', 'cumpleanos'], categoryLabel: 'Boda / Elegante', slug: 'boda-isabel-rodrigo-premium', icon: '🏛️', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop' },
    { id: 'classic-elegance-pro', name: 'Clásica Atemporal Pro', category: 'boda', categories: ['boda', 'xv', 'corporate', 'graduacion'], categoryLabel: 'Boda / Lujo', slug: 'boda-ana-y-carlos-premium', icon: '👑', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop' },
    { id: 'modern-minimalist', name: 'Moderna Minimalista', category: 'boda', categories: ['boda', 'xv', 'cumpleanos', 'graduacion', 'corporate'], categoryLabel: 'Boda / Vanguardia', slug: 'boda-gabriela-arturo-premium', icon: '🖤', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop' },
    { id: 'split-screen', name: 'Vanguardia Dividida', category: 'boda', categories: ['boda', 'xv', 'cumpleanos', 'corporate'], categoryLabel: 'Boda / Vanguardia', slug: 'boda-sofia-mateo-premium', icon: '🌓', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop' },
    { id: 'magazine', name: 'Estilo Editorial', category: 'xv', categories: ['xv', 'boda', 'cumpleanos', 'graduacion'], categoryLabel: 'XV / Gala', slug: 'xv-valeria-premium', icon: '📖', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop' },
    { id: 'newspaper', name: 'Primera Plana', category: 'boda', categories: ['boda', 'xv', 'graduacion', 'corporate'], categoryLabel: 'Boda / Editorial', slug: 'boda-primera-plana-premium', icon: '📰', plan: 'Premium', thumbnail: '/images/couples/ana-carlos-hero.jpg' },
    { id: 'romantic-botanical', name: 'Elegancia Floral', category: 'xv', categories: ['boda', 'xv', 'bautizo', 'comunion'], categoryLabel: 'XV / Primavera', slug: 'xv-regina-2026-premium', icon: '🌿', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop' },
    { id: 'floral-symmetry', name: 'Simetría Floral', category: 'boda', categories: ['boda', 'xv', 'comunion'], categoryLabel: 'Boda / Jardín', slug: 'boda-simetria-floral', icon: '🌸', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop' },
    { id: 'neon-glow', name: 'Fiesta Neón', category: 'cumpleanos', categories: ['cumpleanos', 'xv', 'graduacion'], categoryLabel: 'Cumpleaños / Party', slug: 'cumple-emilia-premium', icon: '🪩', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop' },
    { id: 'luxury-gold', name: 'Lujo Metálico', category: 'boda', categories: ['boda', 'xv', 'corporate', 'graduacion', 'cumpleanos'], categoryLabel: 'Gala / Aniversario', slug: 'gala-aniversario-premium', icon: '💎', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop' },
    { id: 'passport', name: 'Pase de Abordaje', category: 'boda', categories: ['boda', 'xv', 'cumpleanos'], categoryLabel: 'Boda Destino', slug: 'boda-destino-premium', icon: '✈️', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop' },
    { id: 'polaroid-vintage', name: 'Retro Fotográfico', category: 'graduacion', categories: ['boda', 'graduacion', 'cumpleanos', 'xv'], categoryLabel: 'Graduación / Retro', slug: 'graduacion-ana-psicologia-premium', icon: '📸', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop' },
    { id: 'nube-de-miel', name: 'Nube de Miel', category: 'infantil', categories: ['infantil', 'baby_shower', 'bautizo'], categoryLabel: 'Baby Shower / Bautizo', slug: 'baby-nube-de-miel', icon: '🐑', plan: 'Premium', thumbnail: '/images/templates/nube-de-miel.jpg' },
    { id: 'astronauta', name: 'Astronauta', category: 'infantil', categories: ['infantil', 'cumpleanos'], categoryLabel: 'Infantil / Cumpleaños', slug: 'cumple-astronauta', icon: '🚀', plan: 'Premium', thumbnail: '/images/templates/astronauta.jpg' },
    { id: 'gotico-suave', name: 'Gótico Suave', category: 'boda', categories: ['boda', 'xv'], categoryLabel: 'Boda / Flat lay', slug: 'boda-gotico-suave', icon: '🖤', plan: 'Premium', thumbnail: '/images/templates/gotico-suave.jpg' },
    { id: 'sirenita', name: 'Sirenita', category: 'infantil', categories: ['infantil', 'cumpleanos'], categoryLabel: 'Infantil / Cumpleaños', slug: 'cumple-sirenita', icon: '🧜‍♀️', plan: 'Premium', thumbnail: '/images/templates/sirenita.jpg' },
    { id: 'lacre-rojo', name: 'Lacre Rojo', category: 'boda', categories: ['boda', 'xv', 'graduacion', 'corporate'], categoryLabel: 'Boda / Editorial', slug: 'boda-lacre-rojo', icon: '❤️', plan: 'Premium', thumbnail: '/images/templates/lacre-rojo.jpg' },
    { id: 'bodegon-nocturno', name: 'Bodegón Nocturno', category: 'boda', categories: ['boda', 'xv', 'graduacion', 'corporate'], categoryLabel: 'Boda / Lujo', slug: 'boda-bodegon-nocturno', icon: '🥀', plan: 'Premium', thumbnail: '/images/templates/bodegon-nocturno.jpg' },
    { id: 'anturio-vino', name: 'Anturio Vino', category: 'boda', categories: ['boda', 'xv', 'graduacion', 'corporate'], categoryLabel: 'Boda / Flat lay', slug: 'boda-anturio-vino', icon: '🍷', plan: 'Premium', thumbnail: '/images/templates/anturio-vino.jpg' },
    { id: 'lirio-vainilla', name: 'Lirio Vainilla', category: 'boda', categories: ['boda', 'xv', 'comunion', 'bautizo'], categoryLabel: 'Boda / Flat lay', slug: 'boda-lirio-vainilla', icon: '🤍', plan: 'Premium', thumbnail: '/images/templates/lirio-vainilla.jpg' },
    { id: 'collage', name: 'Collage Elegante', category: 'boda', categories: ['boda', 'xv', 'cumpleanos', 'graduacion'], categoryLabel: 'Boda / Álbum', slug: 'boda-collage-premium', icon: '🖼️', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop' },
    // ── Plantillas Infantiles Exclusivas ──
    { id: 'whimsical-kids', name: 'Fantasía Infantil', category: 'infantil', categories: ['infantil', 'bautizo', 'baby_shower'], categoryLabel: 'Infantil / Bautizo', slug: 'bautizo-victoria-premium', icon: '🎈', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop' },
    { id: 'kids-farm', name: 'Zoológico Aventura', category: 'infantil', categories: ['infantil', 'cumpleanos'], categoryLabel: 'Infantil / Zoológico', slug: 'cumpleanos-zoologico-zair', icon: '🦁', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=800&auto=format&fit=crop' },
    { id: 'gamer-party', name: 'Gamer Party', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Gamer', slug: 'cumple-samuel-gamer', icon: '🎮', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop' },
    { id: 'pixel-craft', name: 'Mundo Píxel', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Minecraft', slug: 'cumple-mateo-pixel-craft', icon: '🟩', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=800&auto=format&fit=crop' },
    { id: 'rainbow-pop', name: 'Rainbow Pop', category: 'infantil', categories: ['infantil', 'bautizo', 'baby_shower'], categoryLabel: 'Infantil / Color Pop', slug: 'cumple-lucas-rainbow-pop', icon: '🌈', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop' },
    // ── Plantillas de Revelación de Género ──
    { id: 'reveal-bw', name: 'Misterio Monocromático', category: 'gender_reveal', categories: ['gender_reveal', 'infantil', 'baby_shower'], categoryLabel: 'Gender Reveal / B&W', slug: 'gender-reveal-secreto-bw-premium', icon: '❓', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1510154221590-ff63e90a136f?q=80&w=800&auto=format&fit=crop' },
    { id: 'reveal-duo', name: 'Dúo Rosa & Azul', category: 'gender_reveal', categories: ['gender_reveal', 'infantil', 'baby_shower'], categoryLabel: 'Gender Reveal / Dúo', slug: 'gender-reveal-mateo-o-sofia-premium', icon: '👶', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop' }
];

export const EVENT_CATEGORY_LABELS: Record<string, string> = {
    boda: 'Boda',
    xv: 'XV Años',
    gender_reveal: 'Revelación de Género',
    infantil: 'Infantiles',
    cumpleanos: 'Cumpleaños',
    bautizo: 'Bautizos',
    comunion: 'Primera Comunión',
    graduacion: 'Graduaciones',
    corporate: 'Corporativo',
    todas: 'Todas las Categorías',
};

export function normalizeEventCategory(eventTypeOrCategory?: string, currentTheme?: string): string {
    if (!eventTypeOrCategory) return 'boda';
    const lower = eventTypeOrCategory.toLowerCase().trim();
    if (['wedding', 'boda', 'bodas'].includes(lower)) return 'boda';
    if (['xv', 'quince', 'quinceanera', 'xv-anos', 'xv_anos'].includes(lower)) return 'xv';
    if (['bautizo', 'bautizos'].includes(lower)) return 'bautizo';
    if (['comunion', 'primera_comunion', 'confirmacion'].includes(lower)) return 'comunion';
    if (['gender_reveal', 'gender-reveal', 'revelacion', 'revelacion_genero', 'revelacion-de-genero'].includes(lower)) return 'gender_reveal';
    if (['baby_shower', 'infantil', 'infantiles'].includes(lower)) return 'infantil';
    if (['birthday', 'cumpleanos', 'cumple'].includes(lower)) {
        if (currentTheme && ['whimsical-kids', 'kids-farm', 'gamer-party', 'pixel-craft', 'rainbow-pop'].includes(currentTheme)) {
            return 'infantil';
        }
        return 'cumpleanos';
    }
    if (['graduacion', 'graduaciones'].includes(lower)) return 'graduacion';
    if (['corporate', 'corporativo', 'gala'].includes(lower)) return 'corporate';
    return lower;
}

export function getTemplatesForCategory(categoryOrType?: string, currentTheme?: string): CanonicalTemplate[] {
    const cat = normalizeEventCategory(categoryOrType, currentTheme);
    const list = cat === 'todas' 
        ? CANONICAL_TEMPLATES 
        : CANONICAL_TEMPLATES.filter(tpl => {
            if (currentTheme && tpl.id === currentTheme) return true;
            return tpl.category === cat || (tpl.categories && tpl.categories.includes(cat));
        });

    if (cat === 'todas') return list;

    const catName = EVENT_CATEGORY_LABELS[cat] || 'Evento';
    return list.map(tpl => {
        // Si la plantilla es recomendada o compatible con otra categoría (ej. boda usando plantilla de xv),
        // adaptar la etiqueta de categoría para que no confunda al usuario con "XV / Primavera" en una boda
        if (tpl.category !== cat && tpl.categories?.includes(cat)) {
            let style = tpl.name;
            if (tpl.id === 'romantic-botanical') style = 'Elegancia Floral';
            else if (tpl.id === 'magazine') style = 'Editorial';
            else if (tpl.categoryLabel.includes('/')) style = tpl.categoryLabel.split('/')[1].trim();

            return {
                ...tpl,
                categoryLabel: `${catName} / ${style}`
            };
        }
        return tpl;
    });
}

/**
 * ¿La plantilla es exclusiva del plan Concierge? (las de portada/sobre en video)
 * Se muestran en Ejemplos como escaparate, pero solo se pueden usar con Concierge.
 */
export function isConciergeTemplate(themeIdOrSlug?: string | null): boolean {
    if (!themeIdOrSlug) return false;
    const tpl = CANONICAL_TEMPLATES.find(t => t.id === themeIdOrSlug || t.slug === themeIdOrSlug);
    return (tpl?.plan || '').toLowerCase() === 'concierge';
}

/** Página de venta del plan Concierge (destino de las plantillas Concierge) */
export const CONCIERGE_PLAN_URL = '/planes/concierge';

/**
 * Devuelve el plan mínimo requerido por una plantilla.
 * Las plantillas avanzadas del catálogo corresponden al plan Pro (o Diseño Pro / Premium si así está marcado).
 */
export function getTemplateRequiredPlan(themeIdOrSlug?: string | null): 'clasico' | 'pro' | 'premium' {
    if (!themeIdOrSlug || themeIdOrSlug === 'classic') return 'clasico';
    const tpl = CANONICAL_TEMPLATES.find(t => t.id === themeIdOrSlug || t.slug === themeIdOrSlug);
    if (!tpl) return 'clasico';
    const p = (tpl.plan || '').toLowerCase();
    if (p.includes('diseño pro')) return 'premium';
    return 'pro';
}


