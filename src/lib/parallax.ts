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
PARALLAX_BY_THEME.piloto = [
    { selector: '.kh--piloto', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.kh-l--balloon-l', speed: 0.35 },
    { selector: '.kh-l--balloon-r', speed: 0.5 },
    { selector: '.kh-l--sign', speed: 0.1 },
    { selector: '.kh-l--plane', speed: -0.25 },
    { selector: '.kh-l--pclouds', speed: -0.12 },
    ...sectionLayers('piloto'),
];
PARALLAX_BY_THEME.babyshower = [
    { selector: '.kh--babyshower', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.kh-l--moon', speed: 0.4 },
    { selector: '.kh-l--bballoon', speed: 0.3 },
    { selector: '.kh-l--bear', speed: -0.15 },
    { selector: '.kh-l--elephant', speed: -0.2 },
    { selector: '.kh-l--bclouds', speed: -0.1 },
    ...sectionLayers('babyshower'),
];
PARALLAX_BY_THEME.bomberos = [
    { selector: '.kh--bomberos', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.kh-l--ladder', speed: 0.2 },
    { selector: '.kh-l--flame1', speed: 0.35 },
    { selector: '.kh-l--flame2', speed: 0.3 },
    { selector: '.kh-l--splash1', speed: -0.3 },
    { selector: '.kh-l--truck', speed: -0.12 },
    { selector: '.kh-l--ff-boy', speed: -0.2 },
    { selector: '.kh-l--ff-girl', speed: -0.22 },
    ...sectionLayers('bomberos'),
];
PARALLAX_BY_THEME.policias = [
    { selector: '.kh-l--sun', speed: 0.45 },
    { selector: '.kh-l--heli', speed: 0.3 },
    { selector: '.kh-l--drone', speed: -0.35 },
    { selector: '.kh-l--tree', speed: 0.1 },
    { selector: '.kh-l--station', speed: 0.08 },
    { selector: '.kh-l--car', speed: -0.15 },
    { selector: '.kh-l--dog', speed: -0.2 },
    ...sectionLayers('policias'),
];
PARALLAX_BY_THEME.hadas = [
    { selector: '.kh--hadas', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.kh-l--bf-a', speed: -0.45 },
    { selector: '.kh-l--bf-b', speed: -0.35 },
    { selector: '.kh-l--fairy-l', speed: -0.2 },
    { selector: '.kh-l--fairy-r', speed: -0.25 },
    { selector: '.kh-l--grass', speed: -0.08 },
    { selector: '.kh-l--shrooms', speed: -0.12 },
    ...sectionLayers('hadas'),
];
PARALLAX_BY_THEME.hadita = [
    { selector: '.kh--hadita', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.kh-l--gbf1', speed: -0.4 },
    { selector: '.kh-l--gbf2', speed: -0.3 },
    { selector: '.kh-l--gbf3', speed: -0.5 },
    { selector: '.kh-l--gflowers', speed: -0.1 },
    { selector: '.kh-l--baby', speed: -0.15 },
    ...sectionLayers('hadita'),
];
PARALLAX_BY_THEME['pase-abordar'] = [
    { selector: '.wh--pase', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.wp-plane', speed: -0.45 },
    { selector: '.wp-path', speed: 0.15 },
    { selector: '.wp-clouds', speed: -0.12 },
    ...sectionLayers('pase-abordar'),
];
PARALLAX_BY_THEME['sobre-marino'] = [
    { selector: '.wh--sobre', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.ws-corner--tl', speed: 0.25 },
    { selector: '.ws-corner--br', speed: -0.2 },
    { selector: '.ws-f--1', speed: -0.5 },
    { selector: '.ws-f--2', speed: -0.35 },
    { selector: '.ws-f--3', speed: 0.4 },
    { selector: '.ws-f--4', speed: -0.6 },
    { selector: '.ws-f--5', speed: -0.3 },
    { selector: '.ws-garland', speed: -0.1 },
    ...sectionLayers('sobre-marino'),
];
PARALLAX_BY_THEME['terciopelo-vino'] = [
    { selector: '.wh--vino', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.wv-curtain--l', speed: 0.12 },
    { selector: '.wv-curtain--r', speed: 0.12 },
    { selector: '.wv-roses', speed: -0.2 },
    { selector: '.wv-pt--1', speed: -0.5 },
    { selector: '.wv-pt--2', speed: -0.35 },
    { selector: '.wv-pt--3', speed: -0.6 },
    { selector: '.wv-pt--4', speed: -0.4 },
    { selector: '.wv-garland', speed: -0.08 },
    ...sectionLayers('terciopelo-vino'),
];
PARALLAX_BY_THEME['azul-acuarela'] = [
    { selector: '.wh--azul', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.wa-corner--tr', speed: 0.3 },
    { selector: '.wa-corner--bl', speed: -0.25 },
    { selector: '.wa-photo-flowers', speed: -0.15 },
    { selector: '.wa-wash', speed: 0.08 },
    { selector: '.wa-bouquet', speed: -0.2 },
    ...sectionLayers('azul-acuarela'),
];
PARALLAX_BY_THEME['editorial-bn'] = [
    { selector: '.we-bg', speed: 0.4 },
    { selector: '.wh--edit .wh-inner', speed: -0.12 },
    ...sectionLayers('editorial-bn'),
];
PARALLAX_BY_THEME['rosas-noche'] = [
    { selector: '.wh--noche', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.wn-pt--1', speed: -0.5 },
    { selector: '.wn-pt--2', speed: -0.35 },
    { selector: '.wn-pt--3', speed: -0.6 },
    { selector: '.wn-pt--4', speed: 0.4 },
    { selector: '.wn-rose--tl', speed: -0.12, max: 40 },
    { selector: '.wn-rose--br', speed: 0.12, max: 40 },
    { selector: '.wn-garland', speed: -0.1 },
    ...sectionLayers('rosas-noche'),
];
PARALLAX_BY_THEME['salvia-eucalipto'] = [
    { selector: '.wh--salvia', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.wg-corner--l', speed: 0.3 },
    { selector: '.wg-corner--r', speed: 0.3 },
    { selector: '.wg-hang--l', speed: -0.3 },
    { selector: '.wg-hang--r', speed: -0.4 },
    ...sectionLayers('salvia-eucalipto'),
];
PARALLAX_BY_THEME['malva-empolvado'] = [
    { selector: '.wh--malva', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.wm-hang--l', speed: 0.25 },
    { selector: '.wm-hang--r', speed: -0.3 },
    { selector: '.wm-flowers', speed: -0.12, max: 40 },
    { selector: '.wm-bouquet', speed: -0.2 },
    ...sectionLayers('malva-empolvado'),
];
PARALLAX_BY_THEME.dulcelandia = [
    { selector: '.kh--dulcelandia', speed: 0.3, cssVar: '--py-bg', varOnly: true },
    { selector: '.kh-l--castle', speed: 0.35 },
    { selector: '.kh-l--dl-pop', speed: 0.2 },
    { selector: '.kh-l--dl-c1', speed: -0.5 },
    { selector: '.kh-l--dl-c2', speed: -0.35 },
    { selector: '.kh-l--dl-c3', speed: -0.6 },
    { selector: '.kh-l--dl-c4', speed: 0.45 },
    { selector: '.kh-l--dl-ground', speed: -0.1 },
    { selector: '.kh-l--dl-cupcake', speed: -0.2 },
    { selector: '.kh-l--dl-bear', speed: -0.25 },
    ...sectionLayers('dulcelandia'),
];

export const PARALLAX_MAX_PX = 160;
