// Initializes Microsoft Clarity and Google Analytics 4 — the site's only two
// trackers (no GTM container, no ad pixels). This is the single place that
// loads them; index.html no longer has its own hardcoded copy.
//
// Loading is consent-gated: initAnalytics() only fires the scripts once the
// visitor has accepted analytics cookies via CookieBanner (localStorage key
// 'invitto_cookie_consent' === 'all'). Call it again after consent is
// granted — it's a no-op otherwise, and safe to call more than once since
// loadClarity/loadGA4 already skip re-injecting the script tags.

declare global {
    interface Window {
        clarity?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

// Env vars override these if set (see .env.example), otherwise fall back to
// the site's production IDs so analytics keeps working even if Netlify's
// env vars were never configured.
const CLARITY_ID = (import.meta.env.VITE_CLARITY_ID as string | undefined) || 'wtt5sm69yn';
const GA4_ID = (import.meta.env.VITE_GA4_ID as string | undefined) || 'G-7MCFY4JRZ5';

export function hasAnalyticsConsent(): boolean {
    try {
        return localStorage.getItem('invitto_cookie_consent') === 'all';
    } catch {
        return false;
    }
}

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
    if (!hasAnalyticsConsent()) return;
    if (CLARITY_ID) loadClarity(CLARITY_ID);
    if (GA4_ID) loadGA4(GA4_ID);
}

// Fire a conversion event. Safe to call even when GA4 isn't configured.
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', name, params);
}
