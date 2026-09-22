import type { CSSProperties } from 'react';

/**
 * Lets a portrait/landscape hero photo be repositioned and zoomed inside its
 * frame (theme_config.hero_image_position_y 0-100, hero_image_zoom e.g. 1-2.5)
 * instead of always defaulting to a dead-center object-fit: cover crop.
 */
export function getHeroImageStyle(cfg: Record<string, unknown> | null | undefined): CSSProperties {
    const y = Number(cfg?.hero_image_position_y ?? 50);
    const zoom = Number(cfg?.hero_image_zoom ?? 1);
    return {
        objectPosition: `50% ${Number.isFinite(y) ? y : 50}%`,
        transform: zoom && zoom !== 1 ? `scale(${zoom})` : undefined,
    };
}

/** Same idea for themes that use a CSS background-image instead of an <img> tag. */
export function getHeroBackgroundStyle(cfg: Record<string, unknown> | null | undefined, url: string | null): CSSProperties {
    const y = Number(cfg?.hero_image_position_y ?? 50);
    const zoom = Number(cfg?.hero_image_zoom ?? 1);
    return {
        backgroundImage: url ? `url("${url}")` : undefined,
        backgroundPosition: `50% ${Number.isFinite(y) ? y : 50}%`,
        backgroundSize: 'cover',
        transform: zoom && zoom !== 1 ? `scale(${zoom})` : undefined,
    };
}
