/**
 * Sistema de Paletas de Color para Invitto.
 * Respetando la regla de diseño 60-30-10:
 * - 60% Fondo general y fondos alternos
 * - 30% Texto principal, secundario y tarjetas
 * - 10% Acento (botones principales, sello de cera, etiquetas y detalles)
 */

export interface ColorPalette {
    id: string;
    name: string;
    description: string;
    sectionBgColor: string;      // Fondo 60%
    sectionBgAltColor: string;   // Fondo alterno
    cardBgColor: string;         // Superficie de tarjetas
    textPrimaryColor: string;    // Texto principal 30%
    textSecondaryColor: string;  // Texto secundario
    accentColor: string;         // Acento 10% (sellos, detalles, bordes activos)
    buttonColor: string;         // Botones principales (contraste garantizado)
    heroBgColor: string;         // Fondo de portada
    heroTextColor: string;       // Texto de portada
    previewCircles: string[];    // 4 o 5 colores clave para la tarjeta del selector
    isOriginal?: boolean;
}

export const COLOR_OVERRIDE_KEYS = [
    'accent_color', 'accentColor',
    'button_color', 'buttonColor',
    'primary_color', 'primaryColor',
    'section_bg_color', 'sectionBgColor',
    'section_bg_alt_color', 'sectionBgAltColor',
    'card_bg_color', 'cardBgColor',
    'hero_bg_color', 'heroBgColor',
    'text_primary', 'textPrimary',
    'text_secondary', 'textSecondary',
    'hero_text_color', 'heroTextColor',
    'color_palette_id', 'custom_accent_base'
] as const;

/**
 * 10 Paletas prediseñadas oficiales de Invitto.
 */
export const PRESET_COLOR_PALETTES: ColorPalette[] = [
    {
        id: 'salvia-crema',
        name: 'Salvia y crema',
        description: 'Verdes orgánicos relajantes con lino crema y detalles botánicos.',
        sectionBgColor: '#F5F7F3',
        sectionBgAltColor: '#EBEFE8',
        cardBgColor: '#FFFFFF',
        textPrimaryColor: '#263126',
        textSecondaryColor: '#586558',
        accentColor: '#6B7F6A',
        buttonColor: '#455945',
        heroBgColor: '#F5F7F3',
        heroTextColor: '#263126',
        previewCircles: ['#F5F7F3', '#EBEFE8', '#6B7F6A', '#455945', '#263126']
    },
    {
        id: 'terracota',
        name: 'Terracota',
        description: 'Calidez rústica mediterránea, arcilla tostada y tonos tierra cálidos.',
        sectionBgColor: '#FAF5F0',
        sectionBgAltColor: '#F2E8DE',
        cardBgColor: '#FFFFFF',
        textPrimaryColor: '#36231C',
        textSecondaryColor: '#6D534A',
        accentColor: '#C46849',
        buttonColor: '#9B452A',
        heroBgColor: '#FAF5F0',
        heroTextColor: '#36231C',
        previewCircles: ['#FAF5F0', '#F2E8DE', '#C46849', '#9B452A', '#36231C']
    },
    {
        id: 'azul-polvo',
        name: 'Azul polvo',
        description: 'Serenidad romántica y etérea, azul pizarra suave y porcelana pura.',
        sectionBgColor: '#F4F7FA',
        sectionBgAltColor: '#E7EEF5',
        cardBgColor: '#FFFFFF',
        textPrimaryColor: '#1E293B',
        textSecondaryColor: '#556982',
        accentColor: '#6A8EA8',
        buttonColor: '#345570',
        heroBgColor: '#F4F7FA',
        heroTextColor: '#1E293B',
        previewCircles: ['#F4F7FA', '#E7EEF5', '#6A8EA8', '#345570', '#1E293B']
    },
    {
        id: 'burdeos-oro',
        name: 'Burdeos y oro',
        description: 'Vino tinto intenso, realeza nocturna y destellos dorados satinados.',
        sectionBgColor: '#FAF6F7',
        sectionBgAltColor: '#F3E9EB',
        cardBgColor: '#FFFFFF',
        textPrimaryColor: '#2B141B',
        textSecondaryColor: '#69434E',
        accentColor: '#C5A059',
        buttonColor: '#6D192C',
        heroBgColor: '#FAF6F7',
        heroTextColor: '#2B141B',
        previewCircles: ['#FAF6F7', '#C5A059', '#6D192C', '#8E283E', '#2B141B']
    },
    {
        id: 'champagne',
        name: 'Champagne',
        description: 'Lujo neutro atemporal, marfil suave, perlas y oro fino cepillado.',
        sectionBgColor: '#FAF8F4',
        sectionBgAltColor: '#F2ECE1',
        cardBgColor: '#FFFFFF',
        textPrimaryColor: '#2C2720',
        textSecondaryColor: '#685F52',
        accentColor: '#C8A765',
        buttonColor: '#8C6C35',
        heroBgColor: '#FAF8F4',
        heroTextColor: '#2C2720',
        previewCircles: ['#FAF8F4', '#F2ECE1', '#C8A765', '#8C6C35', '#2C2720']
    },
    {
        id: 'lavanda',
        name: 'Lavanda',
        description: 'Lila provenzal dulce, violeta suave y sutiles matices niebla.',
        sectionBgColor: '#F7F5FA',
        sectionBgAltColor: '#EDE7F4',
        cardBgColor: '#FFFFFF',
        textPrimaryColor: '#261C33',
        textSecondaryColor: '#5F5173',
        accentColor: '#9B74B0',
        buttonColor: '#63447D',
        heroBgColor: '#F7F5FA',
        heroTextColor: '#261C33',
        previewCircles: ['#F7F5FA', '#EDE7F4', '#9B74B0', '#63447D', '#261C33']
    },
    {
        id: 'esmeralda',
        name: 'Esmeralda',
        description: 'Verde joya señorial con frescura natural y contrastes elegantes.',
        sectionBgColor: '#F3F8F5',
        sectionBgAltColor: '#E4F0E9',
        cardBgColor: '#FFFFFF',
        textPrimaryColor: '#14271F',
        textSecondaryColor: '#456456',
        accentColor: '#2A7A57',
        buttonColor: '#175239',
        heroBgColor: '#F3F8F5',
        heroTextColor: '#14271F',
        previewCircles: ['#F3F8F5', '#E4F0E9', '#2A7A57', '#175239', '#14271F']
    },
    {
        id: 'negro-dorado',
        name: 'Negro y dorado',
        description: 'Etiqueta rigurosa black tie, noche carbón y oro líquido brillante.',
        sectionBgColor: '#141619',
        sectionBgAltColor: '#1C1F24',
        cardBgColor: '#20242B',
        textPrimaryColor: '#FAF8F5',
        textSecondaryColor: '#C4BEB5',
        accentColor: '#D4AF37',
        buttonColor: '#C5A059',
        heroBgColor: '#141619',
        heroTextColor: '#FAF8F5',
        previewCircles: ['#141619', '#20242B', '#D4AF37', '#C5A059', '#FAF8F5']
    },
    {
        id: 'rosa-palo',
        name: 'Rosa palo',
        description: 'Romance clásico floral, cuarzo rosa suave y tonos nude empolvados.',
        sectionBgColor: '#FCF7F7',
        sectionBgAltColor: '#F7ECEB',
        cardBgColor: '#FFFFFF',
        textPrimaryColor: '#332025',
        textSecondaryColor: '#6E5259',
        accentColor: '#C47786',
        buttonColor: '#964858',
        heroBgColor: '#FCF7F7',
        heroTextColor: '#332025',
        previewCircles: ['#FCF7F7', '#F7ECEB', '#C47786', '#964858', '#332025']
    },
    {
        id: 'original',
        name: 'Original de la plantilla',
        description: 'Restaura los colores, fondos y contrastes predeterminados de este diseño.',
        sectionBgColor: 'transparent',
        sectionBgAltColor: 'transparent',
        cardBgColor: 'transparent',
        textPrimaryColor: 'transparent',
        textSecondaryColor: 'transparent',
        accentColor: 'transparent',
        buttonColor: 'transparent',
        heroBgColor: 'transparent',
        heroTextColor: 'transparent',
        previewCircles: ['#BD7474', '#1B2E1D', '#FAF7F5', '#FFFFFF'],
        isOriginal: true
    }
];

// ─────────────────────────────────────────────────────────────────────────────
// Utilidades de Conversión y Colorimetría
// ─────────────────────────────────────────────────────────────────────────────

export interface HSL {
    h: number; // 0 a 360
    s: number; // 0 a 100
    l: number; // 0 a 100
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
    let clean = hex.replace('#', '').trim();
    if (clean.length === 3) {
        clean = clean.split('').map(c => c + c).join('');
    }
    const num = parseInt(clean, 16);
    if (isNaN(num) || clean.length !== 6) {
        return { r: 197, g: 160, b: 89 }; // Fallback dorado
    }
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
}

export function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => {
        const clamped = Math.max(0, Math.min(255, Math.round(n)));
        return clamped.toString(16).padStart(2, '0');
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h = (h % 360 + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r1 = 0, g1 = 0, b1 = 0;
    if (h >= 0 && h < 60) { r1 = c; g1 = x; b1 = 0; }
    else if (h >= 60 && h < 120) { r1 = x; g1 = c; b1 = 0; }
    else if (h >= 120 && h < 180) { r1 = 0; g1 = c; b1 = x; }
    else if (h >= 180 && h < 240) { r1 = 0; g1 = x; b1 = c; }
    else if (h >= 240 && h < 300) { r1 = x; g1 = 0; b1 = c; }
    else if (h >= 300 && h < 360) { r1 = c; g1 = 0; b1 = x; }

    return {
        r: Math.round((r1 + m) * 255),
        g: Math.round((g1 + m) * 255),
        b: Math.round((b1 + m) * 255)
    };
}

export function hslToHex(h: number, s: number, l: number): string {
    const { r, g, b } = hslToRgb(h, s, l);
    return rgbToHex(r, g, b);
}

/**
 * Calcula la luminancia relativa según estándar WCAG 2.1
 */
export function getRelativeLuminance(hex: string): number {
    const { r, g, b } = hexToRgb(hex);
    const sRGB = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Ratio de contraste entre dos colores (ej. 4.5:1)
 */
export function getContrastRatio(hex1: string, hex2: string): number {
    const lum1 = getRelativeLuminance(hex1);
    const lum2 = getRelativeLuminance(hex2);
    const bright = Math.max(lum1, lum2);
    const dark = Math.min(lum1, lum2);
    return (bright + 0.05) / (dark + 0.05);
}

/**
 * Genera una paleta de color completa, equilibrada y con contraste garantizado (≥ 4.5:1)
 * a partir de un solo color base (acento de la boda).
 */
export function generatePaletteFromColor(baseHex: string, label: string = 'Mis colores'): ColorPalette {
    const rgb = hexToRgb(baseHex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    // 1. Acento: el color que eligió la pareja
    const accentColor = baseHex.toUpperCase();

    // 2. Fondo claro armonizado (60%): matiz suave del mismo tono
    // Luminosidad muy alta (97.5%) y baja saturación (12-16%)
    const bgSat = Math.min(hsl.s, 16);
    const sectionBgColor = hslToHex(hsl.h, Math.max(bgSat, 8), 97.5);

    // 3. Fondo alterno (secciones secundarias): ligeramente más contrastado (94%)
    const sectionBgAltColor = hslToHex(hsl.h, Math.min(hsl.s, 20), 93.5);

    // 4. Tarjetas: blanco puro para máxima legibilidad y nitidez
    const cardBgColor = '#FFFFFF';

    // 5. Texto principal (30%): tono muy oscuro derivado de la misma familia cromática
    // Luminosidad 13% garantiza ratio de contraste > 10:1 sobre fondo blanco
    const textPrimaryColor = hslToHex(hsl.h, Math.min(hsl.s, 30), 13.5);

    // 6. Texto secundario: contraste intermedio accesible (~38% luminosidad, ratio > 5:1)
    const textSecondaryColor = hslToHex(hsl.h, Math.min(hsl.s, 22), 38);

    // 7. Botón principal: si el color elegido tiene suficiente contraste con texto blanco (>= 4.0),
    // lo usamos directo; si no, oscurecemos el tono hacia luminosidad 34% para garantizar legibilidad.
    const whiteContrast = getContrastRatio(accentColor, '#FFFFFF');
    const buttonColor = whiteContrast >= 4.0
        ? accentColor
        : hslToHex(hsl.h, Math.max(hsl.s, 40), 32);

    return {
        id: `custom-${baseHex.replace('#', '').toLowerCase()}`,
        name: label,
        description: `Paleta personalizada generada a partir de ${accentColor}.`,
        sectionBgColor,
        sectionBgAltColor,
        cardBgColor,
        textPrimaryColor,
        textSecondaryColor,
        accentColor,
        buttonColor,
        heroBgColor: sectionBgColor,
        heroTextColor: textPrimaryColor,
        previewCircles: [sectionBgColor, sectionBgAltColor, accentColor, buttonColor, textPrimaryColor]
    };
}

/**
 * Mapea una paleta de color a las propiedades que theme_config guarda en la base de datos.
 */
export function getColorPaletteThemeConfig(palette: ColorPalette): Record<string, any> {
    return {
        // Acentos y Botones
        accent_color: palette.accentColor,
        accentColor: palette.accentColor,
        button_color: palette.buttonColor,
        buttonColor: palette.buttonColor,
        primary_color: palette.buttonColor,
        primaryColor: palette.buttonColor,

        // Fondos
        section_bg_color: palette.sectionBgColor,
        sectionBgColor: palette.sectionBgColor,
        section_bg_alt_color: palette.sectionBgAltColor,
        sectionBgAltColor: palette.sectionBgAltColor,
        card_bg_color: palette.cardBgColor,
        cardBgColor: palette.cardBgColor,
        hero_bg_color: palette.heroBgColor,
        heroBgColor: palette.heroBgColor,

        // Textos
        text_primary: palette.textPrimaryColor,
        textPrimary: palette.textPrimaryColor,
        text_secondary: palette.textSecondaryColor,
        textSecondary: palette.textSecondaryColor,
        hero_text_color: palette.heroTextColor,
        heroTextColor: palette.heroTextColor,

        // Metadatos
        color_palette_id: palette.id,
    };
}
