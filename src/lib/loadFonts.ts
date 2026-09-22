/**
 * On-demand Google Fonts loader for decorative invitation fonts.
 *
 * Only Playfair Display, Inter and Plus Jakarta Sans are loaded globally
 * (index.html) because they're used across the whole site. Every other
 * family below is only needed by specific invitation typography presets
 * or theme components, so we inject their <link> lazily instead of
 * shipping them on every page load.
 */

const injectedHrefs = new Set<string>();

export function loadGoogleFonts(families: string[]): void {
    if (typeof document === 'undefined' || families.length === 0) return;

    const href = `https://fonts.googleapis.com/css2?family=${families.join('&family=')}&display=swap`;

    if (injectedHrefs.has(href) || document.querySelector(`link[href="${href}"]`)) {
        return;
    }
    injectedHrefs.add(href);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

// Fonts needed per `typography_preset` value (Playfair/Inter/Plus Jakarta Sans excluded — already global)
export const TYPOGRAPHY_PRESET_FONTS: Record<string, string[]> = {
    elegante: ['Manrope:wght@400;500;600;700'],
    moderna: ['Outfit:wght@400;700'],
    romantica: ['Libre+Baskerville:wght@400;700', 'Lato:wght@400;700'],
    'romantica-playfair': ['Lato:wght@400;700'],
    divertida: ['Fredoka:wght@400;500;600;700', 'Quicksand:wght@400;500;600;700'],
};

// Fonts needed per invitation `theme` value (hardcoded inline in those Hero components)
export const THEME_DECORATIVE_FONTS: Record<string, string[]> = {
    'kids-farm': ['Fredoka:wght@400;500;600;700', 'Quicksand:wght@400;500;600;700'],
    'whimsical-kids': ['Fredoka:wght@400;500;600;700', 'Quicksand:wght@400;500;600;700'],
    'rainbow-pop': ['Fredoka:wght@400;500;600;700', 'Quicksand:wght@400;500;600;700'],
    'gamer-party': ['Press+Start+2P', 'VT323'],
    'pixel-craft': ['Press+Start+2P', 'VT323'],
};

// All decorative preset families combined — used by the editor's live preview,
// where every preset swatch can be visible at once regardless of the current theme.
export const ALL_TYPOGRAPHY_PRESET_FONTS: string[] = Array.from(
    new Set(Object.values(TYPOGRAPHY_PRESET_FONTS).flat())
);
