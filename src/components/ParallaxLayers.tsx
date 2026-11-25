import { useEffect } from 'react';
import { PARALLAX_BY_THEME, PARALLAX_MAX_PX, type ParallaxLayer } from '../lib/parallax';

/**
 * Activa el parallax de la plantilla `theme` (ver src/lib/parallax.ts).
 * No dibuja nada. Usa un solo listener de scroll + requestAnimationFrame
 * y escribe variables CSS (no cambia el layout). Se apaga si el sistema
 * pide "reducir movimiento".
 */

interface Target {
    el: HTMLElement;
    layer: ParallaxLayer;
    applied: number;
}

const clamp = (v: number, max = PARALLAX_MAX_PX) => Math.max(-max, Math.min(max, v));

export default function ParallaxLayers({ theme }: { theme?: string | null }) {
    useEffect(() => {
        const layers = theme ? PARALLAX_BY_THEME[theme] : undefined;
        if (!layers || typeof window === 'undefined') return;
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

        let targets: Target[] = [];
        let raf = 0;

        const scan = () => {
            const next: Target[] = [];
            for (const layer of layers) {
                document.querySelectorAll<HTMLElement>(layer.selector).forEach((el) => {
                    const prev = targets.find((t) => t.el === el && t.layer === layer);
                    next.push(prev || { el, layer, applied: 0 });
                    if (!layer.varOnly) el.setAttribute('data-parallax', '');
                });
            }
            targets = next;
        };

        const update = () => {
            raf = 0;
            const vh = window.innerHeight;
            const sy = window.scrollY;
            for (const t of targets) {
                if (!t.el.isConnected) continue;
                const r = t.el.getBoundingClientRect();
                // Posición "natural" (sin el desplazamiento que ya le aplicamos)
                const anchor = t.layer.fromTop ? r.top + Math.min(r.height / 2, vh * 0.35) : r.top + r.height / 2;
                const center = anchor - (t.layer.varOnly ? 0 : t.applied);
                if (center < -vh || center > vh * 2) continue; // fuera de pantalla: no gastar
                const naturalAbs = center + sy;
                // Lo que está en la primera pantalla parte de 0 al cargar
                const raw = naturalAbs < vh ? sy * t.layer.speed : -(center - vh / 2) * t.layer.speed;
                const py = Math.round(clamp(raw, t.layer.max) * 10) / 10;
                if (py !== t.applied) {
                    t.applied = py;
                    t.el.style.setProperty(t.layer.cssVar || '--py', `${py}px`);
                }
            }
        };

        let calls = 0;
        const onScroll = () => {
            // De vez en cuando volver a buscar capas (secciones que aparecen tarde)
            if (++calls % 45 === 0) scan();
            if (!raf) raf = requestAnimationFrame(update);
        };

        scan();
        update();
        // Las secciones aparecen después de abrir el sobre: volver a buscar un rato
        let tries = 0;
        const iv = window.setInterval(() => {
            scan();
            onScroll();
            if (++tries > 20) window.clearInterval(iv);
        }, 700);

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.clearInterval(iv);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (raf) cancelAnimationFrame(raf);
            targets.forEach((t) => {
                t.el.style.removeProperty(t.layer.cssVar || '--py');
                t.el.removeAttribute('data-parallax');
            });
        };
    }, [theme]);

    return null;
}
