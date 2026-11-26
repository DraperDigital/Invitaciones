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
    'unicornio': {
        label: 'Unicornio',
        desc: 'Cumpleaños de niña en acuarela pastel: unicornio, pastel arcoíris y estrellas, con parallax',
        icon: '🦄',
        primaryColor: '#B58BD1',
        accentColor: '#E98FB3',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FDFBFB',
        textPrimary: '#5E4A72',
        textSecondary: '#8A7A9C',
        heroTextColor: '#A97CC4',
        heroBgColor: '#FDFBFB',
        typographyPreset: 'divertida'
    },
    'castillo': {
        label: 'Castillo de Princesa',
        desc: 'Cumpleaños de princesa: castillo rosa, marco dorado, corona y carroza, con parallax',
        icon: '🏰',
        primaryColor: '#8A5BC4',
        accentColor: '#D4A640',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FFF8FB',
        textPrimary: '#5B3D82',
        textSecondary: '#806A9C',
        heroTextColor: '#E04F96',
        heroBgColor: '#E9D6F0',
        typographyPreset: 'romantica'
    },
    'arcoiris': {
        label: 'Arcoíris Kawaii',
        desc: 'Cumpleaños kawaii: arcoíris acolchado, nubes con carita, globos y flores, con parallax',
        icon: '🌈',
        primaryColor: '#8F62D6',
        accentColor: '#F27AA8',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FBF6FF',
        textPrimary: '#5A4880',
        textSecondary: '#84759F',
        heroTextColor: '#8F62D6',
        heroBgColor: '#ECE4FB',
        typographyPreset: 'divertida'
    },
    'convivio': {
        label: 'Convivio Pastel',
        desc: 'Cumpleaños pastel: banderines, pastel con velitas, cupcake y regalos, con parallax',
        icon: '🎂',
        primaryColor: '#D9628F',
        accentColor: '#EF7FA6',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FFFAF3',
        textPrimary: '#5C4A52',
        textSecondary: '#8B7880',
        heroTextColor: '#D9628F',
        heroBgColor: '#FDF0F4',
        typographyPreset: 'divertida'
    },
    'juguetes': {
        label: 'Mis Primeros Juguetes',
        desc: 'Cumpleaños de colores primarios: jirafa, cubos ABC, crayolas, globos y pelotas, con parallax',
        icon: '🧸',
        primaryColor: '#2F7FD6',
        accentColor: '#E5483E',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FBF6EC',
        textPrimary: '#2B3A52',
        textSecondary: '#5C6B80',
        heroTextColor: '#2F7FD6',
        heroBgColor: '#EAF3FC',
        typographyPreset: 'divertida'
    },
    'capibaras': {
        label: 'Capibaras',
        desc: 'Cumpleaños kawaii con capibaras, arcoíris, banderines dorados y diamantina, con parallax',
        icon: '🐹',
        primaryColor: '#B8754A',
        accentColor: '#C9895E',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FDF6F4',
        textPrimary: '#5B4537',
        textSecondary: '#8A7263',
        heroTextColor: '#B8754A',
        heroBgColor: '#FBEEEE',
        typographyPreset: 'divertida'
    },
    'perritos': {
        label: 'Perritos Salchicha',
        desc: 'Cumpleaños con perritos salchicha en acuarela, cuadros amarillos, huesitos y huellitas, con parallax',
        icon: '🐶',
        primaryColor: '#9A6236',
        accentColor: '#D39B2A',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FFFBEF',
        textPrimary: '#5A4230',
        textSecondary: '#87715E',
        heroTextColor: '#9A6236',
        heroBgColor: '#FFF6DC',
        typographyPreset: 'divertida'
    },
    'mariposas': {
        label: 'Mariposas y Flores',
        desc: 'Cumpleaños de niña con marco de flores, mariposas brillantes y pastel de dulces, con parallax',
        icon: '🦋',
        primaryColor: '#B061A8',
        accentColor: '#B97AD6',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FDF9FC',
        textPrimary: '#5C4468',
        textSecondary: '#87739A',
        heroTextColor: '#B061A8',
        heroBgColor: '#F8EEF7',
        typographyPreset: 'romantica'
    },
    'globos3d': {
        label: 'Globos 3D',
        desc: 'Globos y nubes 3D en azul y rosa, pastel y pedestal; ideal para cumpleaños o revelación de sexo, con parallax',
        icon: '🎈',
        primaryColor: '#6D8FCF',
        accentColor: '#EC96B4',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#F7F9FD',
        textPrimary: '#44506A',
        textSecondary: '#73809A',
        heroTextColor: '#6D8FCF',
        heroBgColor: '#EEF4FB',
        typographyPreset: 'divertida'
    },
    'piloto': {
        label: 'Pequeño Piloto',
        desc: 'Cumpleaños de aviador vintage: avión, globos aerostáticos y cielo nocturno dorado, con parallax',
        icon: '✈️',
        primaryColor: '#1F2F52',
        accentColor: '#C9A14A',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#F6EFE0',
        textPrimary: '#1F2F52',
        textSecondary: '#556080',
        heroTextColor: '#1F2F52',
        heroBgColor: '#EFE4CF',
        typographyPreset: 'divertida'
    },
    'babyshower': {
        label: 'Baby Shower Nubes',
        desc: 'Baby shower 3D tierno: osito, elefantito, luna dormida y nubes en azul y crema, con parallax',
        icon: '🧸',
        primaryColor: '#6F8FC4',
        accentColor: '#8FADD8',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FBF7EF',
        textPrimary: '#5B5147',
        textSecondary: '#8A7F73',
        heroTextColor: '#6F8FC4',
        heroBgColor: '#E9F1FA',
        typographyPreset: 'divertida'
    },
    'bomberos': {
        label: 'Bomberos',
        desc: 'Cumpleaños de bomberos: camión rojo, escudo con la edad, escalera y pared de ladrillo, con parallax',
        icon: '🚒',
        primaryColor: '#D62B2B',
        accentColor: '#D62B2B',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FFF8F2',
        textPrimary: '#3A2A24',
        textSecondary: '#6E5A50',
        heroTextColor: '#D62B2B',
        heroBgColor: '#FFF1E3',
        typographyPreset: 'divertida'
    },
    'policias': {
        label: 'Policías',
        desc: 'Cumpleaños de policías en acuarela: patrulla, helicóptero, estación y perrito, con parallax',
        icon: '🚓',
        primaryColor: '#44597A',
        accentColor: '#44597A',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#F2F5F7',
        textPrimary: '#44597A',
        textSecondary: '#6B7A8F',
        heroTextColor: '#44597A',
        heroBgColor: '#E9EEF2',
        typographyPreset: 'divertida'
    },
    'hadas': {
        label: 'Jardín de Hadas',
        desc: 'Cumpleaños de hadas en acuarela: casita de pétalos, hadas, hongos y mariposas, con parallax',
        icon: '🧚',
        primaryColor: '#C64C56',
        accentColor: '#D9767A',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FDF7F6',
        textPrimary: '#7A4A4D',
        textSecondary: '#946A6C',
        heroTextColor: '#C64C56',
        heroBgColor: '#FCEFEE',
        typographyPreset: 'romantica'
    },
    'hadita': {
        label: 'Hadita Mágica 3D',
        desc: 'Primer añito de niña en 3D con diamantina: bebé hada, corona con la edad y mariposas de cristal, con parallax',
        icon: '🦋',
        primaryColor: '#D06C8F',
        accentColor: '#E08AA8',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FDF3EF',
        textPrimary: '#7A4F5E',
        textSecondary: '#9A7582',
        heroTextColor: '#D06C8F',
        heroBgColor: '#F9E6DF',
        typographyPreset: 'romantica'
    },
    'pase-abordar': {
        label: 'Pase de Abordar',
        desc: 'Boda destino: boleto de avión en navy y marfil, globo terráqueo, matasellos y avión que vuela con el parallax',
        icon: '✈️',
        primaryColor: '#0F1E3A',
        accentColor: '#0F1E3A',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#F3EEE4',
        textPrimary: '#1B2742',
        textSecondary: '#4F5A72',
        heroTextColor: '#0F1E3A',
        heroBgColor: '#EBE4D6',
        typographyPreset: 'romantica'
    },
    'sobre-marino': {
        label: 'Sobre Azul Marino',
        desc: 'Sobre azul marino con sello de cera dorado, flores de papel navy y blancas y aro dorado, con parallax',
        icon: '💌',
        primaryColor: '#13213F',
        accentColor: '#B8913F',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FBF8F2',
        textPrimary: '#13213F',
        textSecondary: '#4B5670',
        heroTextColor: '#13213F',
        heroBgColor: '#F2ECE0',
        typographyPreset: 'romantica'
    },
    'terciopelo-vino': {
        label: 'Terciopelo Vino',
        desc: 'Boda en vino: cortinas de terciopelo, rosas vino y blancas, papel rasgado y foto a sangre, con parallax',
        icon: '🥀',
        primaryColor: '#6B1626',
        accentColor: '#6B1626',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#F6EFE6',
        textPrimary: '#3A0D17',
        textSecondary: '#6E4D55',
        heroTextColor: '#6B1626',
        heroBgColor: '#EFE4D8',
        typographyPreset: 'romantica'
    },
    'azul-acuarela': {
        label: 'Azul Acuarela',
        desc: 'Boda en acuarela azul polvo: flores pintadas, sello de cera azul y accesos rápidos con íconos, con parallax',
        icon: '💙',
        primaryColor: '#5B7598',
        accentColor: '#6F88AA',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FBF9F5',
        textPrimary: '#2D3A52',
        textSecondary: '#56647E',
        heroTextColor: '#5B7598',
        heroBgColor: '#F7F4EE',
        typographyPreset: 'romantica'
    },
    'editorial-bn': {
        label: 'Editorial B&N',
        desc: 'Boda editorial en blanco y negro: foto a sangre, tipografía de revista y secciones negras y blancas, con parallax',
        icon: '🖤',
        primaryColor: '#0C0C0C',
        accentColor: '#F4F2EE',
        cardBgColor: '#151515',
        sectionBgColor: '#0C0C0C',
        textPrimary: '#F4F2EE',
        textSecondary: '#BDBAB4',
        heroTextColor: '#FFFFFF',
        heroBgColor: '#0C0C0C',
        typographyPreset: 'elegante'
    },
    'rosas-noche': {
        label: 'Rosas Blancas de Noche',
        desc: 'Boda de noche en jardín: rosas blancas, marco ornamentado marfil con calendario y guirnalda, con parallax',
        icon: '🤍',
        primaryColor: '#1D241F',
        accentColor: '#1D241F',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#F7F1E6',
        textPrimary: '#1D241F',
        textSecondary: '#4B514B',
        heroTextColor: '#1D241F',
        heroBgColor: '#EFE7D8',
        typographyPreset: 'romantica'
    },
    'salvia-eucalipto': {
        label: 'Verde Salvia',
        desc: 'Boda en acuarela verde salvia: eucalipto, monograma con iniciales, foto con borde rasgado y nombres en caligrafía, con parallax',
        icon: '🌿',
        primaryColor: '#6F7F62',
        accentColor: '#6F7F62',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#F8F5EE',
        textPrimary: '#2F3A2C',
        textSecondary: '#56614F',
        heroTextColor: '#2F3A2C',
        heroBgColor: '#F5F1E8',
        typographyPreset: 'romantica'
    },
    'malva-empolvado': {
        label: 'Rosa Empolvado',
        desc: 'Boda en rosa empolvado: flores en acuarela malva, foto con ola dorada y cuenta regresiva en cajitas, con parallax',
        icon: '🌸',
        primaryColor: '#8E5F71',
        accentColor: '#8E5F71',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#F6EFEE',
        textPrimary: '#3D2C35',
        textSecondary: '#6B5560',
        heroTextColor: '#3D2C35',
        heroBgColor: '#F0E6E4',
        typographyPreset: 'romantica'
    },
    'dulcelandia': {
        label: 'Dulcelandia 3D',
        desc: 'Mundo de dulces en 3D: castillo de betún, osito de gomita, paletas y galleta con moño, con parallax',
        icon: '🍭',
        primaryColor: '#E0528B',
        accentColor: '#F0679B',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FFF6F8',
        textPrimary: '#5B4057',
        textSecondary: '#8D7189',
        heroTextColor: '#E0528B',
        heroBgColor: '#FDEEF5',
        typographyPreset: 'divertida'
    },
    'tienda-dulces': {
        label: 'Tienda de Dulces',
        desc: 'Tienda de dulces 3D en lila: paletas, máquina de chicles, cupcake y frasco alrededor de la tarjeta',
        icon: '🍬',
        primaryColor: '#8F6AD6',
        accentColor: '#EF5D93',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FBF7FF',
        textPrimary: '#4F3F63',
        textSecondary: '#7F6F93',
        heroTextColor: '#8F6AD6',
        heroBgColor: '#EFE6FB',
        typographyPreset: 'divertida'
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
    'dinosaurios': {
        label: 'Dinosaurios',
        desc: 'Cumpleaños con dinos en ilustración plana pastel: T-rex, volcán, huevo y hojas tropicales',
        icon: '🦖',
        primaryColor: '#6E9A72',
        accentColor: '#E2A845',
        cardBgColor: '#FFFFFF',
        sectionBgColor: '#FBF8F1',
        textPrimary: '#5B544B',
        textSecondary: '#857C70',
        heroTextColor: '#5B544B',
        heroBgColor: '#FFFFFF',
        typographyPreset: 'divertida'
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
    // ── Bodas ──
    { id: 'classic', name: 'Clásica Atemporal', category: 'boda', categories: ['boda', 'xv', 'comunion', 'bautizo', 'baby_shower', 'gender_reveal'], categoryLabel: 'Boda / Elegante', slug: 'boda-isabel-rodrigo-premium', icon: '🏛️', plan: 'Clásica', thumbnail: '/images/templates/classic.jpg' },
    { id: 'classic-elegance-pro', name: 'Clásica Atemporal Pro', category: 'boda', categories: ['boda', 'xv'], categoryLabel: 'Boda / Lujo', slug: 'boda-ana-y-carlos-premium', icon: '👑', plan: 'Pro', thumbnail: '/images/templates/classic-elegance-pro.jpg' },
    { id: 'modern-minimalist', name: 'Moderna Minimalista', category: 'boda', categories: ['boda', 'xv', 'graduacion', 'corporate', 'comunion', 'bautizo', 'baby_shower', 'gender_reveal'], categoryLabel: 'Boda / Vanguardia', slug: 'boda-gabriela-arturo-premium', icon: '🖤', plan: 'Clásica', thumbnail: '/images/templates/modern-minimalist.jpg' },
    { id: 'split-screen', name: 'Vanguardia Dividida', category: 'boda', categories: ['boda', 'graduacion', 'corporate', 'gender_reveal'], categoryLabel: 'Boda / Vanguardia', slug: 'boda-sofia-mateo-premium', icon: '🌓', plan: 'Clásica', thumbnail: '/images/templates/split-screen.jpg' },
    { id: 'newspaper', name: 'Primera Plana', category: 'boda', categories: ['boda', 'graduacion', 'cumpleanos', 'comunion'], categoryLabel: 'Boda / Editorial', slug: 'boda-primera-plana-premium', icon: '📰', plan: 'Clásica', thumbnail: '/images/templates/newspaper.jpg' },
    { id: 'floral-symmetry', name: 'Simetría Floral', category: 'boda', categories: ['boda', 'xv', 'comunion', 'bautizo', 'baby_shower'], categoryLabel: 'Boda / Jardín', slug: 'boda-simetria-floral', icon: '🌸', plan: 'Clásica', thumbnail: '/images/templates/floral-symmetry.jpg' },
    { id: 'passport', name: 'Pase de Abordaje', category: 'boda', categories: ['boda', 'cumpleanos'], categoryLabel: 'Boda Destino', slug: 'boda-destino-premium', icon: '✈️', plan: 'Clásica', thumbnail: '/images/templates/passport.jpg' },
    { id: 'gotico-suave', name: 'Gótico Suave', category: 'boda', categories: ['boda', 'xv'], categoryLabel: 'Boda / Flat lay', slug: 'boda-gotico-suave', icon: '🖤', plan: 'Pro', thumbnail: '/images/templates/gotico-suave.jpg' },
    { id: 'lacre-rojo', name: 'Lacre Rojo', category: 'boda', categories: ['boda', 'xv'], categoryLabel: 'Boda / Editorial', slug: 'boda-lacre-rojo', icon: '❤️', plan: 'Pro', thumbnail: '/images/templates/lacre-rojo.jpg' },
    { id: 'bodegon-nocturno', name: 'Bodegón Nocturno', category: 'boda', categories: ['boda'], categoryLabel: 'Boda / Lujo', slug: 'boda-bodegon-nocturno', icon: '🥀', plan: 'Pro', thumbnail: '/images/templates/bodegon-nocturno.jpg' },
    { id: 'anturio-vino', name: 'Anturio Vino', category: 'boda', categories: ['boda'], categoryLabel: 'Boda / Flat lay', slug: 'boda-anturio-vino', icon: '🍷', plan: 'Pro', thumbnail: '/images/templates/anturio-vino.jpg' },
    { id: 'pase-abordar', name: 'Pase de Abordar', category: 'boda', categories: ['boda'], categoryLabel: 'Boda / Destino', slug: 'boda-pase-abordar', icon: '✈️', plan: 'Pro', thumbnail: '/images/templates/pase-abordar.jpg' },
    { id: 'sobre-marino', name: 'Sobre Azul Marino', category: 'boda', categories: ['boda'], categoryLabel: 'Boda / Clásica', slug: 'boda-sobre-marino', icon: '💌', plan: 'Pro', thumbnail: '/images/templates/sobre-marino.jpg' },
    { id: 'terciopelo-vino', name: 'Terciopelo Vino', category: 'boda', categories: ['boda'], categoryLabel: 'Boda / Romántica', slug: 'boda-terciopelo-vino', icon: '🥀', plan: 'Pro', thumbnail: '/images/templates/terciopelo-vino.jpg' },
    { id: 'azul-acuarela', name: 'Azul Acuarela', category: 'boda', categories: ['boda'], categoryLabel: 'Boda / Acuarela', slug: 'boda-azul-acuarela', icon: '💙', plan: 'Pro', thumbnail: '/images/templates/azul-acuarela.jpg' },
    { id: 'editorial-bn', name: 'Editorial B&N', category: 'boda', categories: ['boda'], categoryLabel: 'Boda / Editorial', slug: 'boda-editorial-bn', icon: '🖤', plan: 'Pro', thumbnail: '/images/templates/editorial-bn.jpg' },
    { id: 'rosas-noche', name: 'Rosas Blancas de Noche', category: 'boda', categories: ['boda'], categoryLabel: 'Boda / Noche', slug: 'boda-rosas-noche', icon: '🤍', plan: 'Pro', thumbnail: '/images/templates/rosas-noche.jpg' },
    { id: 'salvia-eucalipto', name: 'Verde Salvia', category: 'boda', categories: ['boda'], categoryLabel: 'Boda / Botánica', slug: 'boda-salvia-eucalipto', icon: '🌿', plan: 'Pro', thumbnail: '/images/templates/salvia-eucalipto.jpg' },
    { id: 'malva-empolvado', name: 'Rosa Empolvado', category: 'boda', categories: ['boda'], categoryLabel: 'Boda / Romántica', slug: 'boda-malva-empolvado', icon: '🌸', plan: 'Pro', thumbnail: '/images/templates/malva-empolvado.jpg' },
    { id: 'lirio-vainilla', name: 'Lirio Vainilla', category: 'boda', categories: ['boda', 'comunion', 'bautizo'], categoryLabel: 'Boda / Sacramental', slug: 'boda-lirio-vainilla', icon: '🤍', plan: 'Pro', thumbnail: '/images/templates/lirio-vainilla.jpg' },
    { id: 'collage', name: 'Collage Elegante', category: 'boda', categories: ['boda', 'xv', 'cumpleanos', 'graduacion', 'comunion', 'bautizo', 'baby_shower', 'gender_reveal'], categoryLabel: 'Boda / Álbum', slug: 'boda-collage-premium', icon: '🖼️', plan: 'Clásica', thumbnail: '/images/templates/collage.jpg' },

    // ── XV Años ──
    { id: 'magazine', name: 'Estilo Editorial', category: 'xv', categories: ['xv', 'cumpleanos', 'graduacion', 'boda'], categoryLabel: 'XV / Gala', slug: 'xv-valeria-premium', icon: '📖', plan: 'Clásica', thumbnail: '/images/templates/magazine.jpg' },
    { id: 'romantic-botanical', name: 'Elegancia Floral', category: 'xv', categories: ['xv', 'boda', 'comunion', 'bautizo', 'baby_shower'], categoryLabel: 'XV / Primavera', slug: 'xv-regina-2026-premium', icon: '🌿', plan: 'Clásica', thumbnail: '/images/templates/romantic-botanical.jpg' },

    // ── Cumpleaños (Adultos / Jóvenes / Fiestas) ──
    { id: 'neon-glow', name: 'Fiesta Neón', category: 'cumpleanos', categories: ['cumpleanos', 'xv'], categoryLabel: 'Cumpleaños / Party', slug: 'cumple-emilia-premium', icon: '🪩', plan: 'Clásica', thumbnail: '/images/templates/neon-glow.jpg' },
    { id: 'polaroid-vintage', name: 'Retro Fotográfico', category: 'cumpleanos', categories: ['cumpleanos', 'graduacion'], categoryLabel: 'Cumpleaños / Retro', slug: 'graduacion-ana-psicologia-premium', icon: '📸', plan: 'Clásica', thumbnail: '/images/templates/polaroid-vintage.jpg' },
    { id: 'luxury-gold', name: 'Lujo Metálico', category: 'cumpleanos', categories: ['cumpleanos', 'boda', 'corporate', 'graduacion'], categoryLabel: 'Gala / Aniversario', slug: 'gala-aniversario-premium', icon: '💎', plan: 'Clásica', thumbnail: '/images/templates/luxury-gold.jpg' },

    // ── Cumpleaños Infantiles / Fiestas Infantiles ──
    { id: 'dinosaurios', name: 'Dinosaurios', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Dinosaurios', slug: 'cumple-dinosaurios', icon: '🦖', plan: 'Clásica', thumbnail: '/images/templates/dinosaurios.jpg' },
    { id: 'sirenita', name: 'Sirenita', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Sirenita', slug: 'cumple-sirenita', icon: '🧜‍♀️', plan: 'Clásica', thumbnail: '/images/templates/sirenita.jpg' },
    { id: 'astronauta', name: 'Astronauta', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Astronauta', slug: 'cumple-astronauta', icon: '🚀', plan: 'Pro', thumbnail: '/images/templates/astronauta.jpg' },
    { id: 'unicornio', name: 'Unicornio', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Unicornio', slug: 'cumple-unicornio', icon: '🦄', plan: 'Pro', thumbnail: '/images/templates/unicornio.jpg' },
    { id: 'castillo', name: 'Castillo de Princesa', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Castillo', slug: 'cumple-castillo', icon: '🏰', plan: 'Pro', thumbnail: '/images/templates/castillo.jpg' },
    { id: 'arcoiris', name: 'Arcoíris Kawaii', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Arcoíris', slug: 'cumple-arcoiris', icon: '🌈', plan: 'Pro', thumbnail: '/images/templates/arcoiris.jpg' },
    { id: 'convivio', name: 'Convivio Pastel', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Convivio', slug: 'cumple-convivio', icon: '🎂', plan: 'Pro', thumbnail: '/images/templates/convivio.jpg' },
    { id: 'juguetes', name: 'Mis Primeros Juguetes', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Juguetes', slug: 'cumple-juguetes', icon: '🧸', plan: 'Pro', thumbnail: '/images/templates/juguetes.jpg' },
    { id: 'capibaras', name: 'Capibaras', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Capibaras', slug: 'cumple-capibaras', icon: '🐹', plan: 'Pro', thumbnail: '/images/templates/capibaras.jpg' },
    { id: 'perritos', name: 'Perritos Salchicha', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Perritos', slug: 'cumple-perritos', icon: '🐶', plan: 'Pro', thumbnail: '/images/templates/perritos.jpg' },
    { id: 'mariposas', name: 'Mariposas y Flores', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Mariposas', slug: 'cumple-mariposas', icon: '🦋', plan: 'Pro', thumbnail: '/images/templates/mariposas.jpg' },
    { id: 'globos3d', name: 'Globos 3D', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Globos 3D', slug: 'cumple-globos3d', icon: '🎈', plan: 'Pro', thumbnail: '/images/templates/globos3d.jpg' },
    { id: 'dulcelandia', name: 'Dulcelandia 3D', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Dulces', slug: 'cumple-dulcelandia', icon: '🍭', plan: 'Pro', thumbnail: '/images/templates/dulcelandia.jpg' },
    { id: 'tienda-dulces', name: 'Tienda de Dulces', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Dulces', slug: 'cumple-tienda-dulces', icon: '🍬', plan: 'Clásica', thumbnail: '/images/templates/tienda-dulces.jpg' },
    { id: 'piloto', name: 'Pequeño Piloto', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Piloto', slug: 'cumple-piloto', icon: '✈️', plan: 'Pro', thumbnail: '/images/templates/piloto.jpg' },
    { id: 'babyshower', name: 'Baby Shower Nubes', category: 'baby_shower', categories: ['baby_shower'], categoryLabel: 'Baby Shower / Nubes', slug: 'baby-babyshower', icon: '🧸', plan: 'Pro', thumbnail: '/images/templates/babyshower.jpg' },
    { id: 'bomberos', name: 'Bomberos', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Bomberos', slug: 'cumple-bomberos', icon: '🚒', plan: 'Pro', thumbnail: '/images/templates/bomberos.jpg' },
    { id: 'policias', name: 'Policías', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Policías', slug: 'cumple-policias', icon: '🚓', plan: 'Pro', thumbnail: '/images/templates/policias.jpg' },
    { id: 'hadas', name: 'Jardín de Hadas', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Hadas', slug: 'cumple-hadas', icon: '🧚', plan: 'Pro', thumbnail: '/images/templates/hadas.jpg' },
    { id: 'hadita', name: 'Hadita Mágica 3D', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Primer añito', slug: 'cumple-hadita', icon: '🦋', plan: 'Pro', thumbnail: '/images/templates/hadita.jpg' },
    { id: 'kids-farm', name: 'Zoológico Aventura', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Zoológico', slug: 'cumpleanos-zoologico-zair', icon: '🦁', plan: 'Clásica', thumbnail: '/images/templates/kids-farm.jpg' },
    { id: 'gamer-party', name: 'Gamer Party', category: 'infantil', categories: ['infantil', 'cumpleanos'], categoryLabel: 'Infantil / Gamer', slug: 'cumple-samuel-gamer', icon: '🎮', plan: 'Clásica', thumbnail: '/images/templates/gamer-party.jpg' },
    { id: 'pixel-craft', name: 'Mundo Píxel', category: 'infantil', categories: ['infantil'], categoryLabel: 'Infantil / Minecraft', slug: 'cumple-mateo-pixel-craft', icon: '🟩', plan: 'Clásica', thumbnail: '/images/templates/pixel-craft.jpg' },
    { id: 'rainbow-pop', name: 'Rainbow Pop', category: 'infantil', categories: ['infantil', 'bautizo', 'baby_shower', 'gender_reveal'], categoryLabel: 'Infantil / Color Pop', slug: 'cumple-lucas-rainbow-pop', icon: '🌈', plan: 'Clásica', thumbnail: '/images/templates/rainbow-pop.jpg' },
    { id: 'whimsical-kids', name: 'Fantasía Infantil', category: 'infantil', categories: ['infantil', 'bautizo', 'baby_shower', 'comunion', 'gender_reveal'], categoryLabel: 'Infantil / Fantasía', slug: 'bautizo-victoria-premium', icon: '🎈', plan: 'Clásica', thumbnail: '/images/templates/whimsical-kids.jpg' },

    // ── Baby Shower & Bautizo ──
    { id: 'nube-de-miel', name: 'Nube de Miel', category: 'baby_shower', categories: ['baby_shower', 'bautizo', 'infantil'], categoryLabel: 'Baby Shower / Tierno', slug: 'baby-nube-de-miel', icon: '🐑', plan: 'Pro', thumbnail: '/images/templates/nube-de-miel.jpg' },

    // ── Revelación de Género ──
    { id: 'reveal-bw', name: 'Misterio Monocromático', category: 'gender_reveal', categories: ['gender_reveal'], categoryLabel: 'Gender Reveal / B&W', slug: 'gender-reveal-secreto-bw-premium', icon: '❓', plan: 'Clásica', thumbnail: '/images/templates/reveal-bw.jpg' },
    { id: 'reveal-duo', name: 'Dúo Rosa & Azul', category: 'gender_reveal', categories: ['gender_reveal'], categoryLabel: 'Gender Reveal / Dúo', slug: 'gender-reveal-mateo-o-sofia-premium', icon: '👶', plan: 'Pro', thumbnail: '/images/templates/reveal-duo.jpg' }
];

export const EVENT_CATEGORY_LABELS: Record<string, string> = {
    boda: 'Boda',
    xv: 'XV Años',
    infantil: 'Cumpleaños Infantil',
    cumpleanos: 'Cumpleaños',
    baby_shower: 'Baby Shower',
    gender_reveal: 'Revelación de Género',
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
    if (['baby_shower', 'babyshower'].includes(lower)) return 'baby_shower';
    if (['infantil', 'infantiles', 'cumpleanos_infantil', 'cumple_infantil', 'fiesta_infantil', 'kids', 'ninos'].includes(lower)) return 'infantil';
    if (['birthday', 'cumpleanos', 'cumple'].includes(lower)) {
        if (currentTheme && [
            'whimsical-kids', 'kids-farm', 'gamer-party', 'pixel-craft', 
            'rainbow-pop', 'astronauta', 'sirenita', 'dinosaurios', 'nube-de-miel',
            'unicornio', 'castillo', 'arcoiris'
        ].includes(currentTheme)) {
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
    const categoryCoverMap: Record<string, string> = {
        xv: '/images/categories/xv.jpg',
        bautizo: '/images/categories/bautizo.jpg',
        baby_shower: '/images/categories/baby_shower.jpg',
        comunion: '/images/categories/comunion.jpg',
        graduacion: '/images/categories/graduacion.jpg',
        cumpleanos: '/images/categories/cumpleanos.jpg',
        gender_reveal: '/images/categories/gender_reveal.jpg',
    };

    return list.map(tpl => {
        // Si la plantilla es recomendada o compatible con otra categoría (ej. boda usando plantilla de xv),
        // adaptar la etiqueta de categoría y la portada representativa para no mostrar novios en XV o bautizos
        if (tpl.category !== cat && tpl.categories?.includes(cat)) {
            let style = tpl.name;
            if (tpl.id === 'romantic-botanical') style = 'Elegancia Floral';
            else if (tpl.id === 'magazine') style = 'Editorial';
            else if (tpl.categoryLabel.includes('/')) style = tpl.categoryLabel.split('/')[1].trim();

            const categoryThumbnail = categoryCoverMap[cat] || tpl.thumbnail;

            return {
                ...tpl,
                categoryLabel: `${catName} / ${style}`,
                thumbnail: categoryThumbnail
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

/**
 * Plantillas con parallax (y efectos animados): requieren plan Pro o superior.
 * El plan Clásica no las incluye.
 */
export const PRO_ONLY_TEMPLATES = ['astronauta', 'unicornio', 'castillo', 'arcoiris', 'convivio', 'juguetes', 'capibaras', 'perritos', 'mariposas', 'globos3d', 'piloto', 'babyshower', 'bomberos', 'policias', 'hadas', 'hadita', 'pase-abordar', 'sobre-marino', 'terciopelo-vino', 'azul-acuarela', 'editorial-bn', 'rosas-noche', 'salvia-eucalipto', 'malva-empolvado', 'dulcelandia'];

export function isProOnlyTemplate(themeIdOrSlug?: string | null): boolean {
    if (!themeIdOrSlug) return false;
    const tpl = CANONICAL_TEMPLATES.find(t => t.id === themeIdOrSlug || t.slug === themeIdOrSlug);
    return PRO_ONLY_TEMPLATES.includes(tpl?.id || themeIdOrSlug);
}

/** Página de venta del plan Concierge (destino de las plantillas Concierge) */
export const CONCIERGE_PLAN_URL = '/planes/concierge';

/**
 * Devuelve el plan mínimo requerido por una plantilla.
 * Las plantillas avanzadas del catálogo corresponden al plan Pro (o Diseño Pro / Premium si así está marcado).
 */
export function getTemplateRequiredPlan(themeIdOrSlug?: string | null): 'clasico' | 'pro' | 'premium' {
    if (!themeIdOrSlug) return 'clasico';
    const tpl = CANONICAL_TEMPLATES.find(t => t.id === themeIdOrSlug || t.slug === themeIdOrSlug);
    if (!tpl) return 'clasico';
    const p = (tpl.plan || '').toLowerCase();
    if (p.includes('diseño pro') || p.includes('premium')) return 'premium';
    if (p.includes('clásica') || p.includes('clasica') || p.includes('clasico')) return 'clasico';
    return 'pro';
}


