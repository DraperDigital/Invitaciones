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
        { selector: '.theme-astronauta section#message', speed: -0.22, cssVar: '--py-art', varOnly: true },
        { selector: '.theme-astronauta section#location', speed: -0.22, cssVar: '--py-art', varOnly: true },
        { selector: '.theme-astronauta section#gifts', speed: -0.22, cssVar: '--py-art', varOnly: true },
        { selector: '.theme-astronauta section#rsvp', speed: -0.16, cssVar: '--py-art', varOnly: true },
        { selector: '.theme-astronauta section#rsvp', speed: 0.15, cssVar: '--py-bg', varOnly: true },
        { selector: '.theme-astronauta .invitation-closing', speed: 0.15, cssVar: '--py-bg', varOnly: true },
        { selector: '.theme-astronauta .invitation-closing', speed: -0.2, cssVar: '--py-art', varOnly: true },
    ],
};

export const PARALLAX_MAX_PX = 160;
