// Initializes Microsoft Clarity and Google Analytics 4 conditionally,
// based on env vars. Safe to call at app boot — no-op if vars are missing.

declare global {
    interface Window {
        clarity?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

const CLARITY_ID = import.meta.env.VITE_CLARITY_ID as string | undefined;
const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;

function loadClarity(id: string) {
    if (window.clarity) return;
    (function (c: any, l: Document, a: string, r: string, i: string) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        const t = l.createElement(r) as HTMLScriptElement;
        t.async = true;
        t.src = 'https://www.clarity.ms/tag/' + i;
        const y = l.getElementsByTagName(r)[0];
        y.parentNode?.insertBefore(t, y);
    })(window, document, 'clarity', 'script', id);
}

function loadGA4(id: string) {
    if (window.gtag) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer!.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id);
}

export function initAnalytics() {
    if (typeof window === 'undefined') return;
    if (CLARITY_ID) loadClarity(CLARITY_ID);
    if (GA4_ID) loadGA4(GA4_ID);
}

// Fire a conversion event. Safe to call even when GA4 isn't configured.
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', name, params);
}
