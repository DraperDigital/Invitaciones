/**
 * Parallax por plantilla.
 *
 * Cada plantilla declara qué piezas son "capas" y a qué velocidad se mueven.
 * El componente <ParallaxLayers> las busca en la página y, al hacer scroll,
 * les escribe una variable CSS con el desplazamiento en px.
 *
 * speed > 0  → capa lejana: se mueve MÁS LENTO que el scroll (fondo)
 * speed < 0  → capa cercana: se mueve MÁS RÁPIDO que el scroll (frente)
 *
 * Por defecto el valor se escribe en `--py` y la regla global
 * `[data-parallax]{ transform: translate3d(0, var(--py), 0) }` lo aplica.
 * Con `varOnly: true` solo se escribe la variable (en otra, p. ej. `--py-bg`)
 * y la hoja de estilos de la plantilla decide dónde usarla
 * (útil para ::before, fondos o elementos que ya usan `transform`).
 *
 * Importante: los elementos con capa NO deben usar la propiedad `transform`
 * en su propio CSS/animaciones; usar `translate`, `rotate` y `scale`
 * (propiedades individuales), que se suman al parallax sin pisarlo.
 */

export interface ParallaxLayer {
    selector: string;
    speed: number;
    /** Nombre de la variable CSS (por defecto `--py`) */
    cssVar?: string;
    /** Solo escribir la variable, sin activar la regla de transform */
    varOnly?: boolean;
    /** Desplazamiento máximo en px (por defecto PARALLAX_MAX_PX) */
    max?: number;
    /** Medir desde el borde superior del elemento en vez de su centro (secciones altas) */
    fromTop?: boolean;
}

export const PARALLAX_BY_THEME: Record<string, ParallaxLayer[]> = {
    astronauta: [
        // Portada
        { selector: '.as-hero', speed: 0.35, cssVar: '--py-bg', varOnly: true }, // cielo de fondo
        { selector: '.as-earth', speed: 0.45 },
        { selector: '.as-twinkle', speed: 0.25 },
        { selector: '.as-rider', speed: -0.18 },
        { selector: '.as-rocket', speed: -0.12 },
        // Ilustraciones de las secciones (van en ::before → la hoja usa la variable)
        { selector: '.theme-astronauta section#message', speed: -0.22, cssVar: '--py-art', varOnly: true, max: 36, fromTop: true },
        { selector: '.theme-astronauta section#location', speed: -0.22, cssVar: '--py-art', varOnly: true, max: 36, fromTop: true },
        { selector: '.theme-astronauta section#gifts', speed: -0.22, cssVar: '--py-art', varOnly: true, max: 36, fromTop: true },
        { selector: '.theme-astronauta section#rsvp', speed: -0.16, cssVar: '--py-art', varOnly: true, max: 36, fromTop: true },
        { selector: '.theme-astronauta section#rsvp', speed: 0.15, cssVar: '--py-bg', varOnly: true },
        { selector: '.theme-astronauta .invitation-closing', speed: 0.15, cssVar: '--py-bg', varOnly: true },
        { selector: '.theme-astronauta .invitation-closing', speed: -0.2, cssVar: '--py-art', varOnly: true, max: 36, fromTop: true },
    ],
};

/** Capas de las ilustraciones de sección (::before) y fondos de confirmación/pie */
function sectionLayers(theme: string): ParallaxLayer[] {
    const t = `.theme-${theme}`;
    return [
        { selector: `${t} section#message`, speed: -0.22, cssVar: '--py-art', varOnly: true, max: 36, fromTop: true },
        { selector: `${t} section#location`, speed: -0.22, cssVar: '--py-art', varOnly: true, max: 36, fromTop: true },
        { selector: `${t} section#gifts`, speed: -0.22, cssVar: '--py-art', varOnly: true, max: 36, fromTop: true },
        { selector: `${t} section#rsvp`, speed: -0.16, cssVar: '--py-art', varOnly: true, max: 36, fromTop: true },
        { selector: `${t} section#rsvp`, speed: 0.15, cssVar: '--py-bg', varOnly: true },
        { selector: `${t} .invitation-closing`, speed: 0.15, cssVar: '--py-bg', varOnly: true },
        { selector: `${t} .invitation-closing`, speed: -0.2, cssVar: '--py-art', varOnly: true, max: 36, fromTop: true },
    ];
}

PARALLAX_BY_THEME.unicornio = [
    { selector: '.un-hero', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.un-star', speed: 0.4 },
    { selector: '.un-rainbow', speed: 0.18 },
    { selector: '.un-cake', speed: -0.1 },
    { selector: '.un-unicorn', speed: -0.2 },
    ...sectionLayers('unicornio'),
];
PARALLAX_BY_THEME.castillo = [
    { selector: '.cs-hero', speed: 0.35, cssVar: '--py-bg', varOnly: true },
    { selector: '.cs-cloud--1', speed: 0.5 },
    { selector: '.cs-cloud--2', speed: 0.45 },
    { selector: '.cs-castle', speed: 0.2 },
    { selector: '.cs-towers', speed: -0.12 },
    { selector: '.cs-cloud--front', speed: -0.3 },
    ...sectionLayers('castillo'),
];
PARALLAX_BY_THEME.arcoiris = [
    { selector: '.ar-hero', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.ar-rainbow', speed: 0.15 },
    { selector: '.ar-balloons', speed: -0.35 },
    { selector: '.ar-cloud', speed: -0.2 },
    { selector: '.ar-star', speed: -0.25 },
    { selector: '.ar-flowers', speed: -0.1 },
    ...sectionLayers('arcoiris'),
];

PARALLAX_BY_THEME.convivio = [
    { selector: '.kh--convivio', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.kh--convivio .kh-l--flags', speed: 0.25 },
    { selector: '.kh--convivio .kh-l--gifts', speed: -0.15 },
    { selector: '.kh--convivio .kh-l--cupcake', speed: -0.3 },
    ...sectionLayers('convivio'),
];
PARALLAX_BY_THEME.juguetes = [
    { selector: '.kh--juguetes', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.kh-l--sun', speed: 0.4 },
    { selector: '.kh-l--giraffe', speed: 0.15 },
    { selector: '.kh-l--balloons', speed: -0.35 },
    { selector: '.kh-l--blocks', speed: -0.12 },
    { selector: '.kh-l--crayons', speed: -0.18 },
    { selector: '.kh-l--balls', speed: -0.25 },
    ...sectionLayers('juguetes'),
];
PARALLAX_BY_THEME.capibaras = [
    { selector: '.kh--capibaras', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.kh--capibaras .kh-l--flags', speed: 0.3 },
    { selector: '.kh-l--rainbow', speed: 0.18 },
    { selector: '.kh-l--trio', speed: -0.15 },
    ...sectionLayers('capibaras'),
];
PARALLAX_BY_THEME.perritos = [
    { selector: '.kh--perritos', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.kh-l--lying', speed: 0.15 },
    { selector: '.kh-l--bone1', speed: 0.35 },
    { selector: '.kh-l--paw1', speed: 0.25 },
    { selector: '.kh-l--heart1', speed: -0.3 },
    { selector: '.kh-l--walk', speed: -0.2 },
    ...sectionLayers('perritos'),
];
PARALLAX_BY_THEME.mariposas = [
    { selector: '.kh--mariposas', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.kh-l--frame-l', speed: 0.08 },
    { selector: '.kh-l--frame-r', speed: 0.08 },
    { selector: '.kh-l--bf1', speed: -0.4 },
    { selector: '.kh-l--bf2', speed: -0.25 },
    { selector: '.kh-l--bf3', speed: -0.5 },
    ...sectionLayers('mariposas'),
];
PARALLAX_BY_THEME.globos3d = [
    { selector: '.kh--globos3d', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.kh-l--far', speed: 0.45 },
    { selector: '.kh-l--big-l', speed: -0.3 },
    { selector: '.kh-l--big-r', speed: -0.4 },
    { selector: '.kh-l--clouds', speed: -0.15 },
    ...sectionLayers('globos3d'),
];

export const PARALLAX_MAX_PX = 160;
