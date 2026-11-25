// Centralized configuration of Hero photo slots and theme_config fields per theme.
// Each template's Hero component may read photos differently (e.g. 5 collage photos,
// 1 circular photo, decorative monogram + hero image, 1 standard photo, or none).

export type HeroSlotType = 'collage' | 'circle' | 'single_with_decorative' | 'single' | 'none';

export interface HeroPhotoSlotDef {
    type: HeroSlotType;
    photoCount: number; // 0, 1, or 5
    hasDecorativeImage: boolean;
    isCircular: boolean;
    heroLabel: string;
    heroHelpText: string;
    fields: string[];
}

export const HERO_PHOTO_SLOTS: Record<string, HeroPhotoSlotDef> = {
    // ── 5 fotos en collage ──
    'collage': {
        type: 'collage',
        photoCount: 5,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Composición del Collage (5 Fotos)',
        heroHelpText: 'Esta plantilla utiliza 5 fotografías organizadas en un mosaico.',
        fields: ['collage_images', 'collageImages', 'hero_image_url', 'heroImage']
    },

    // ── 1 foto circular (Simetría Floral) ──
    'floral-symmetry': {
        type: 'circle',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: true,
        heroLabel: 'Foto Circular de la Pareja / Festejado',
        heroHelpText: 'Foto enmarcada circularmente entre los marcos botánicos simétricos.',
        fields: ['floral_avatar_url', 'hero_image_url', 'heroImage']
    },

    // ── Plantillas con foto principal + imagen decorativa / monograma ──
    'classic': {
        type: 'single_with_decorative',
        photoCount: 1,
        hasDecorativeImage: true,
        isCircular: false,
        heroLabel: 'Foto de Portada Enmarcada',
        heroHelpText: 'Foto de los anfitriones con marco clásico dorado y monograma superior.',
        fields: ['hero_image_url', 'heroImage', 'decorative_image_url', 'decorativeImage']
    },
    'classic-elegance': {
        type: 'single_with_decorative',
        photoCount: 1,
        hasDecorativeImage: true,
        isCircular: false,
        heroLabel: 'Foto de Portada Enmarcada',
        heroHelpText: 'Foto de los anfitriones con marco clásico dorado y monograma superior.',
        fields: ['hero_image_url', 'heroImage', 'decorative_image_url', 'decorativeImage']
    },
    'classic-elegance-pro': {
        type: 'single_with_decorative',
        photoCount: 1,
        hasDecorativeImage: true,
        isCircular: false,
        heroLabel: 'Foto de Portada Full-Screen',
        heroHelpText: 'Foto a pantalla completa con monograma o logo en la cabecera.',
        fields: ['hero_image_url', 'heroImage', 'decorative_image_url', 'decorativeImage']
    },
    'classic-pro': {
        type: 'single_with_decorative',
        photoCount: 1,
        hasDecorativeImage: true,
        isCircular: false,
        heroLabel: 'Foto de Portada Full-Screen',
        heroHelpText: 'Foto a pantalla completa con monograma o logo en la cabecera.',
        fields: ['hero_image_url', 'heroImage', 'decorative_image_url', 'decorativeImage']
    },
    'modern-minimalist': {
        type: 'single_with_decorative',
        photoCount: 1,
        hasDecorativeImage: true,
        isCircular: false,
        heroLabel: 'Foto de Portada de Fondo',
        heroHelpText: 'Fotografía de fondo a escala completa y monograma superior opcional.',
        fields: ['hero_image_url', 'heroImage', 'decorative_image_url', 'decorativeImage']
    },

    // ── Plantillas con 1 foto estándar de portada ──
    'cinematic-motion': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto de Portada Cinematográfica',
        heroHelpText: 'Fotografía principal integrada en el parallax multidimensional.',
        fields: ['hero_image_url', 'heroImage']
    },
    'split-screen': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto de Portada Pantalla Dividida',
        heroHelpText: 'Fotografía vertical a media pantalla.',
        fields: ['hero_image_url', 'heroImage']
    },
    'magazine': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto de Portada Revista Editorial',
        heroHelpText: 'Fotografía de portada de revista de alta resolución.',
        fields: ['hero_image_url', 'heroImage']
    },
    'newspaper': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Fotografía de Primera Plana',
        heroHelpText: 'Fotografía con textura editorial en la nota principal.',
        fields: ['hero_image_url', 'heroImage']
    },
    'romantic-botanical': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto de Portada Botánica',
        heroHelpText: 'Foto de fondo cálido con elementos botánicos.',
        fields: ['hero_image_url', 'heroImage']
    },
    'neon-glow': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto de Portada Party Neón',
        heroHelpText: 'Foto principal sobre fondo de luces neón.',
        fields: ['hero_image_url', 'heroImage']
    },
    'luxury-gold': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto de Portada Lujo Metálico',
        heroHelpText: 'Fotografía de fondo para gala con destellos dorados.',
        fields: ['hero_image_url', 'heroImage']
    },
    'passport': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto Tipo Visa / Pasaporte',
        heroHelpText: 'Fotografía tamaño pasaporte de los anfitriones.',
        fields: ['hero_image_url', 'heroImage']
    },
    'astronauta': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: true,
        heroLabel: 'Foto en la Ventanilla',
        heroHelpText: 'Foto del festejado; se muestra redonda, como ventanilla de nave.',
        fields: ['hero_image_url', 'heroImage']
    },
    'nube-de-miel': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto de la Portada',
        heroHelpText: 'Foto tipo polaroid bajo la portada azul (puede ser el ultrasonido o los papás).',
        fields: ['hero_image_url', 'heroImage']
    },
    'sirenita': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: true,
        heroLabel: 'Foto en la Burbuja',
        heroHelpText: 'Foto de la festejada; se muestra redonda, dentro de una burbuja.',
        fields: ['hero_image_url', 'heroImage']
    },
    'gotico-suave': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto Polaroid de la Portada',
        heroHelpText: 'Foto en polaroid junto al sobre negro.',
        fields: ['hero_image_url', 'heroImage']
    },
    'lacre-rojo': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto Principal de la Portada',
        heroHelpText: 'Foto vertical grande bajo "Nuestra boda", con el sello de lacre al pie.',
        fields: ['hero_image_url', 'heroImage']
    },
    'bodegon-nocturno': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto Principal de la Portada',
        heroHelpText: 'Foto vertical enmarcada bajo los nombres y la fecha.',
        fields: ['hero_image_url', 'heroImage']
    },
    'unicornio': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: true,
        heroLabel: 'Foto en el Círculo',
        heroHelpText: 'Foto de la festejada; se muestra redonda.',
        fields: ['hero_image_url', 'heroImage']
    },
    'castillo': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto en el Marco Dorado',
        heroHelpText: 'Foto de la festejada; se muestra en óvalo con marco dorado.',
        fields: ['hero_image_url', 'heroImage']
    },
    'arcoiris': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: true,
        heroLabel: 'Foto en el Círculo',
        heroHelpText: 'Foto del festejado; se muestra redonda con borde blanco.',
        fields: ['hero_image_url', 'heroImage']
    },
    'convivio': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: true,
        heroLabel: 'Foto en el Círculo',
        heroHelpText: 'Foto del festejado; se muestra redonda.',
        fields: ['hero_image_url', 'heroImage']
    },
    'juguetes': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto en el Marco',
        heroHelpText: 'Foto del festejado; se muestra en cuadro redondeado.',
        fields: ['hero_image_url', 'heroImage']
    },
    'capibaras': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: true,
        heroLabel: 'Foto en el Círculo',
        heroHelpText: 'Foto del festejado; se muestra redonda.',
        fields: ['hero_image_url', 'heroImage']
    },
    'perritos': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: true,
        heroLabel: 'Foto en el Círculo',
        heroHelpText: 'Foto del festejado; se muestra redonda.',
        fields: ['hero_image_url', 'heroImage']
    },
    'mariposas': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: true,
        heroLabel: 'Foto en el Círculo',
        heroHelpText: 'Foto de la festejada; se muestra redonda.',
        fields: ['hero_image_url', 'heroImage']
    },
    'globos3d': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: true,
        heroLabel: 'Foto en el Círculo',
        heroHelpText: 'Foto del festejado; se muestra redonda.',
        fields: ['hero_image_url', 'heroImage']
    },
    'anturio-vino': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto dentro del Arco',
        heroHelpText: 'Foto enmarcada en el arco vino con filo dorado.',
        fields: ['hero_image_url', 'heroImage']
    },
    'dinosaurios': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto en el Huevo',
        heroHelpText: 'Foto del festejado; se muestra con forma de huevo de dinosaurio.',
        fields: ['hero_image_url', 'heroImage']
    },
    'lirio-vainilla': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto Polaroid de la Portada',
        heroHelpText: 'Foto en polaroid junto al sobre y la tarjeta en arco.',
        fields: ['hero_image_url', 'heroImage']
    },
    'polaroid-vintage': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Fotografía Polaroid Instantánea',
        heroHelpText: 'Foto estilo polaroid vintage con marco blanco.',
        fields: ['hero_image_url', 'heroImage']
    },
    'whimsical-kids': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto del Festejado(a)',
        heroHelpText: 'Foto del festejado en marco festivo infantil.',
        fields: ['hero_image_url', 'heroImage']
    },
    'kids-farm': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto Zoológico Aventura',
        heroHelpText: 'Foto del festejado en su expedición de safari.',
        fields: ['hero_image_url', 'heroImage']
    },
    'gamer-party': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto Gamer Party',
        heroHelpText: 'Foto del jugador principal.',
        fields: ['hero_image_url', 'heroImage']
    },
    'pixel-craft': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto Mundo Píxel',
        heroHelpText: 'Foto del festejado en marco de bloques voxel.',
        fields: ['hero_image_url', 'heroImage']
    },
    'rainbow-pop': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto Rainbow Pop',
        heroHelpText: 'Foto del festejado con bordes festivos y confetti.',
        fields: ['hero_image_url', 'heroImage']
    },
    'reveal-bw': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto Misterio Monocromático',
        heroHelpText: 'Fotografía para revelación de género en blanco y negro.',
        fields: ['hero_image_url', 'heroImage']
    },
    'reveal-duo': {
        type: 'single',
        photoCount: 1,
        hasDecorativeImage: false,
        isCircular: false,
        heroLabel: 'Foto Dúo Rosa & Azul',
        heroHelpText: 'Fotografía para revelación de género con borde pastel.',
        fields: ['hero_image_url', 'heroImage']
    },
};

const DEFAULT_SLOT_DEF: HeroPhotoSlotDef = {
    type: 'single',
    photoCount: 1,
    hasDecorativeImage: false,
    isCircular: false,
    heroLabel: 'Foto de Portada',
    heroHelpText: 'Fotografía principal de la invitación.',
    fields: ['hero_image_url', 'heroImage']
};

export function getHeroPhotoSlot(theme?: string): HeroPhotoSlotDef {
    if (!theme) return HERO_PHOTO_SLOTS['classic'] || DEFAULT_SLOT_DEF;
    const normalized = theme.toLowerCase().trim();
    return HERO_PHOTO_SLOTS[normalized] || DEFAULT_SLOT_DEF;
}

/**
 * Extracts the primary photo already uploaded or configured by the user,
 * searching across all known photo fields.
 */
export function getPrimaryHeroPhoto(themeConfig: any): string | null {
    if (!themeConfig || typeof themeConfig !== 'object') return null;

    if (themeConfig.hero_image_url && typeof themeConfig.hero_image_url === 'string' && themeConfig.hero_image_url.trim()) {
        return themeConfig.hero_image_url.trim();
    }
    if (themeConfig.heroImage && typeof themeConfig.heroImage === 'string' && themeConfig.heroImage.trim()) {
        return themeConfig.heroImage.trim();
    }
    if (themeConfig.floral_avatar_url && typeof themeConfig.floral_avatar_url === 'string' && themeConfig.floral_avatar_url.trim()) {
        return themeConfig.floral_avatar_url.trim();
    }
    if (Array.isArray(themeConfig.collage_images) && themeConfig.collage_images.length > 0) {
        const first = themeConfig.collage_images[0];
        const url = typeof first === 'string' ? first : first?.url;
        if (url && typeof url === 'string' && url.trim()) return url.trim();
    }
    if (Array.isArray(themeConfig.collageImages) && themeConfig.collageImages.length > 0) {
        const first = themeConfig.collageImages[0];
        const url = typeof first === 'string' ? first : first?.url;
        if (url && typeof url === 'string' && url.trim()) return url.trim();
    }
    return null;
}

/**
 * Copies the user's primary photo into the exact fields read by `newTheme`.
 * Useful when switching templates in the editor or saving design changes.
 */
export function syncHeroPhotoForNewTheme(prevConfig: any, newTheme: string): Record<string, any> {
    const slotDef = getHeroPhotoSlot(newTheme);
    const primaryPhoto = getPrimaryHeroPhoto(prevConfig);
    const decorativePhoto = prevConfig?.decorative_image_url || prevConfig?.decorativeImage || '';

    const updates: Record<string, any> = {};

    if (slotDef.type === 'none') {
        return updates;
    }

    if (slotDef.type === 'collage') {
        const existingCollage = Array.isArray(prevConfig?.collage_images)
            ? prevConfig.collage_images
            : (Array.isArray(prevConfig?.collageImages) ? prevConfig.collageImages : []);
        
        const collageArr: string[] = [];
        for (let i = 0; i < 5; i++) {
            const raw = existingCollage[i];
            const url = typeof raw === 'string' ? raw : raw?.url;
            if (url) {
                collageArr.push(url);
            } else if (i === 0 && primaryPhoto) {
                collageArr.push(primaryPhoto);
            }
        }
        if (primaryPhoto && (!collageArr[0] || collageArr[0] === '')) {
            collageArr[0] = primaryPhoto;
        }

        updates.collage_images = collageArr;
        updates.collageImages = collageArr;
        if (primaryPhoto) {
            updates.hero_image_url = primaryPhoto;
            updates.heroImage = primaryPhoto;
        }
    } else if (slotDef.type === 'circle') {
        if (primaryPhoto) {
            updates.floral_avatar_url = primaryPhoto;
            updates.hero_image_url = primaryPhoto;
            updates.heroImage = primaryPhoto;
        }
    } else if (slotDef.type === 'single_with_decorative') {
        if (primaryPhoto) {
            updates.hero_image_url = primaryPhoto;
            updates.heroImage = primaryPhoto;
        }
        if (decorativePhoto) {
            updates.decorative_image_url = decorativePhoto;
            updates.decorativeImage = decorativePhoto;
        }
    } else {
        // standard single photo
        if (primaryPhoto) {
            updates.hero_image_url = primaryPhoto;
            updates.heroImage = primaryPhoto;
        }
    }

    return updates;
}

/**
 * Builds the exact photo fields to save for the given theme when editing the Hero.
 * Never writes collage_images if the theme is not collage!
 */
export function getHeroSaveFields(
    theme: string | undefined,
    values: {
        heroImageUrl?: string;
        floralAvatarUrl?: string;
        decorativeImageUrl?: string;
        collageImages?: string[];
        heroImagePositionY?: number;
        heroImageZoom?: number;
    }
): Record<string, any> {
    const slotDef = getHeroPhotoSlot(theme);
    const result: Record<string, any> = {};

    if (slotDef.type === 'none') {
        return result;
    }

    // Common framing positions
    if (typeof values.heroImagePositionY === 'number') {
        result.hero_image_position_y = values.heroImagePositionY;
    }
    if (typeof values.heroImageZoom === 'number') {
        result.hero_image_zoom = values.heroImageZoom;
    }

    if (slotDef.type === 'collage') {
        const images = Array.isArray(values.collageImages) ? values.collageImages : [];
        result.collage_images = images;
        result.collageImages = images;
        const main = images[0] || values.heroImageUrl || '';
        result.hero_image_url = main;
        result.heroImage = main;
    } else if (slotDef.type === 'circle') {
        const photo = (values.floralAvatarUrl && values.floralAvatarUrl.trim()) 
            || (values.heroImageUrl && values.heroImageUrl.trim()) 
            || '';
        result.floral_avatar_url = photo;
        result.hero_image_url = photo;
        result.heroImage = photo;
    } else if (slotDef.type === 'single_with_decorative') {
        const photo = values.heroImageUrl || '';
        result.hero_image_url = photo;
        result.heroImage = photo;
        if (values.decorativeImageUrl !== undefined) {
            result.decorative_image_url = values.decorativeImageUrl;
            result.decorativeImage = values.decorativeImageUrl;
        }
    } else {
        // standard single photo
        const photo = values.heroImageUrl || '';
        result.hero_image_url = photo;
        result.heroImage = photo;
    }

    return result;
}
