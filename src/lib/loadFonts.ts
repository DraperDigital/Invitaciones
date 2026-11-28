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
    'astronauta': ['Baloo+2:wght@600;700;800', 'Nunito:wght@400;600;700'],
    'nube-de-miel': ['Playfair+Display:ital,wght@0,400;0,500;1,400', 'DM+Sans:wght@400;600', 'Pinyon+Script'],
    'sirenita': ['Dancing+Script:wght@600;700', 'Patrick+Hand', 'Quicksand:wght@400;500;600;700'],
    'gotico-suave': ['Pinyon+Script', 'Bodoni+Moda:wght@500', 'Montserrat:wght@400;600;700'],
    'lacre-rojo': ['Bodoni+Moda:wght@500;600', 'Syncopate:wght@700', 'Jost:wght@400;500;700', 'Monsieur+La+Doulaise', 'Allison'],
    'bodegon-nocturno': ['Monsieur+La+Doulaise', 'Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500', 'Cinzel:wght@600'],
    'unicornio': ['Comfortaa:wght@600;700', 'Quicksand:wght@400;500;600;700'],
    'castillo': ['Pacifico', 'Fredoka:wght@400;500;600;700'],
    'arcoiris': ['Baloo+2:wght@600;700;800', 'Nunito:wght@400;600;700;800'],
    'convivio': ['Fredoka:wght@500;600;700', 'Nunito:wght@400;600;700;800'],
    'juguetes': ['Baloo+2:wght@700;800', 'Nunito:wght@400;600;700;800'],
    'capibaras': ['Fredoka:wght@500;600;700', 'Quicksand:wght@400;500;600;700'],
    'perritos': ['Baloo+2:wght@700;800', 'Nunito:wght@400;600;700;800'],
    'mariposas': ['Dancing+Script:wght@600;700', 'Quicksand:wght@400;500;600;700'],
    'globos3d': ['Baloo+2:wght@700;800', 'Nunito:wght@400;600;700;800'],
    'piloto': ['Dancing+Script:wght@700', 'Nunito:wght@400;600;700;800'],
    'babyshower': ['Fredoka:wght@500;600', 'Quicksand:wght@400;500;600;700'],
    'bomberos': ['Baloo+2:wght@700;800', 'Nunito:wght@400;600;700;800'],
    'policias': ['Fredoka:wght@500;600', 'Nunito:wght@400;600;700;800'],
    'hadas': ['Dancing+Script:wght@600;700', 'Quicksand:wght@400;500;600;700'],
    'hadita': ['Dancing+Script:wght@600;700', 'Quicksand:wght@400;500;600;700'],
    'pase-abordar': ['Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@400;500;600'],
    'sobre-marino': ['Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@400;500;600'],
    'terciopelo-vino': ['Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@400;500;600'],
    'azul-acuarela': ['Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@400;500;600'],
    'editorial-bn': ['Bodoni+Moda:ital,wght@0,400;0,500;1,400', 'Pinyon+Script', 'Jost:wght@300;400;500'],
    'rosas-noche': ['Bodoni+Moda:ital,wght@0,400;0,500;1,400', 'Pinyon+Script', 'Cormorant+Garamond:wght@400;500', 'Montserrat:wght@400;500;600'],
    'salvia-eucalipto': ['Pinyon+Script', 'Cormorant+Garamond:wght@400;500;600', 'Montserrat:wght@400;500;600'],
    'malva-empolvado': ['Pinyon+Script', 'Cormorant+Garamond:wght@400;500;600', 'Montserrat:wght@400;500;600'],
    'dulcelandia': ['Fredoka:wght@500;600;700', 'Nunito:wght@400;600;700;800'],
    'tienda-dulces': ['Fredoka:wght@500;600;700', 'Nunito:wght@400;600;700;800'],
    'pueblo-papel': ['Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@400;500;600'],
    'bordado-lujo': ['Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@400;500;600'],
    'epoca-bonita': ['Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@400;500;600'],
    'noche-velas': ['Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@400;500;600'],
    'posada-mexicana': ['Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@400;500;600'],
    'posada-linea': ['Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@400;500;600'],
    'cuadros-escoceses': ['Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@400;500;600'],
    'rayas-rojas': ['Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400', 'Pinyon+Script', 'Montserrat:wght@400;500;600'],
    'holly-jolly': ['Cinzel:wght@500;700', 'Cormorant+Garamond:wght@400;500', 'Pinyon+Script', 'Montserrat:wght@400;500;600'],
    'casita-nevada': ['Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@400;500;600'],
    'brindis-oro': ['Bodoni+Moda:ital,wght@0,400;0,500;0,700;1,400', 'Cinzel:wght@500;700', 'Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@200;400;500;600;700;800'],
    'globos-champana': ['Bodoni+Moda:ital,wght@0,400;0,500;0,700;1,400', 'Cinzel:wght@500;700', 'Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@200;400;500;600;700;800'],
    'noche-disco': ['Bodoni+Moda:ital,wght@0,400;0,500;0,700;1,400', 'Cinzel:wght@500;700', 'Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@200;400;500;600;700;800'],
    'cena-gala': ['Bodoni+Moda:ital,wght@0,400;0,500;0,700;1,400', 'Cinzel:wght@500;700', 'Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@200;400;500;600;700;800'],
    'cierre-brillante': ['Bodoni+Moda:ital,wght@0,400;0,500;0,700;1,400', 'Cinzel:wght@500;700', 'Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@200;400;500;600;700;800'],
    'perlas-champana': ['Bodoni+Moda:ital,wght@0,400;0,500;0,700;1,400', 'Cinzel:wght@500;700', 'Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@200;400;500;600;700;800'],
    'soiree-deco': ['Bodoni+Moda:ital,wght@0,400;0,500;0,700;1,400', 'Cinzel:wght@500;700', 'Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@200;400;500;600;700;800'],
    'esmoquin': ['Bodoni+Moda:ital,wght@0,400;0,500;0,700;1,400', 'Cinzel:wght@500;700', 'Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@200;400;500;600;700;800'],
    'fuegos-plata': ['Bodoni+Moda:ital,wght@0,400;0,500;0,700;1,400', 'Cinzel:wght@500;700', 'Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@200;400;500;600;700;800'],
    'arco-dorado': ['Bodoni+Moda:ital,wght@0,400;0,500;0,700;1,400', 'Cinzel:wght@500;700', 'Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@200;400;500;600;700;800'],
    'brillo-oro': ['Bodoni+Moda:ital,wght@0,400;0,500;0,700;1,400', 'Cinzel:wght@500;700', 'Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@200;400;500;600;700;800'],
    'monos-rojos': ['Bodoni+Moda:ital,wght@0,400;0,500;0,700;1,400', 'Cinzel:wght@500;700', 'Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@200;400;500;600;700;800'],
    'mesa-nochevieja': ['Bodoni+Moda:ital,wght@0,400;0,500;0,700;1,400', 'Cinzel:wght@500;700', 'Cormorant+Garamond:wght@400;500;600', 'Pinyon+Script', 'Montserrat:wght@200;400;500;600;700;800'],
    'rosas': ['Pinyon+Script', 'Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400', 'Montserrat:wght@400;500;600'],
    'hacienda': ['Pinyon+Script', 'Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400', 'Montserrat:wght@400;500;600'],
    'dulce-espera': ['Great+Vibes', 'Lora:ital,wght@0,400;0,500;1,400;1,500', 'Cormorant+Garamond:wght@500;600;700'],
    'anturio-vino': ['Italiana', 'Pinyon+Script', 'Libre+Caslon+Text:ital,wght@0,400;0,700;1,400', 'La+Belle+Aurore'],
    'dinosaurios': ['Fredoka:wght@400;500;600;700', 'Nunito:wght@400;600;700'],
    'lirio-vainilla': ['Pinyon+Script', 'Marcellus', 'Josefin+Sans:wght@300;400;600', 'Cormorant+Garamond:ital@1'],
    'pixel-craft': ['Press+Start+2P', 'VT323'],
};

// All decorative preset families combined — used by the editor's live preview,
// where every preset swatch can be visible at once regardless of the current theme.
export const ALL_TYPOGRAPHY_PRESET_FONTS: string[] = Array.from(
    new Set(Object.values(TYPOGRAPHY_PRESET_FONTS).flat())
);
