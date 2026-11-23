// Initializes Microsoft Clarity, Google Analytics 4, and Meta Pixel (Facebook/Instagram).
// This is the single place that loads them; index.html no longer has hardcoded copies.
//
// Loading is consent-gated: initAnalytics() only fires the scripts once the
// visitor has accepted analytics cookies via CookieBanner (localStorage key
// 'invitto_cookie_consent' === 'all'). Call it again after consent is
// granted — it's a no-op otherwise, and safe to call more than once since
// each loader already skips re-injecting the script tags.

declare global {
    interface Window {
        clarity?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
        fbq?: (...args: unknown[]) => void;
        _fbq?: unknown;
    }
}

// Env vars override these if set (see .env.example), otherwise fall back to
// the site's production IDs so analytics keeps working even if the host's
// env vars were never configured.
const CLARITY_ID = (import.meta.env.VITE_CLARITY_ID as string | undefined) || 'zfve0nyeei';
const GA4_ID = (import.meta.env.VITE_GA4_ID as string | undefined) || 'G-Q3JRN12SSX';
const META_PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID as string | undefined) || '2108628290018190';

export function hasAnalyticsConsent(): boolean {
    try {
        const consent = localStorage.getItem('invitto_cookie_consent');
        // Solo regresa false cuando el usuario explícitamente eligió "Solo necesarias"
        if (consent === 'essential' || consent === 'necessary') {
            return false;
        }
        // Por default regresa true para visitas nuevas y usuarios con consentimiento
        return true;
    } catch {
        return true;
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

function loadMetaPixel(id: string) {
    if (window.fbq) return;
    (function (f: any, b: Document, e: string, v: string, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode?.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    const fbq = (window as any).fbq;
    if (typeof fbq === 'function') {
        fbq('init', id);
        fbq('track', 'PageView');
    }
}

// Vendora: registra visitas con sus UTM (para saber qué anuncio vendió) y deja window.vendora.utm() para el checkout.
const VENDORA_URL = (import.meta.env.VITE_VENDORA_URL as string | undefined) || 'https://vendora.drapersystems.online';
const VENDORA_TIENDA = (import.meta.env.VITE_VENDORA_TIENDA as string | undefined) || 'kids-lumina';

function loadVendora() {
    if (!VENDORA_URL || !VENDORA_TIENDA || document.querySelector('script[data-vendora]')) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = `${VENDORA_URL.replace(/\/$/, '')}/v.js`;
    s.setAttribute('data-tienda', VENDORA_TIENDA);
    s.setAttribute('data-vendora', '1');
    document.head.appendChild(s);
}

let hasLoadedThirdParty = false;

export function initAnalytics() {
    if (typeof window === 'undefined') return;

    // Solo se ejecutan si el usuario no ha rechazado explícitamente las cookies analíticas
    if (!hasAnalyticsConsent()) return;

    // Meta Pixel respeta la elección del usuario ('necessary' / 'essential')
    if (META_PIXEL_ID) loadMetaPixel(META_PIXEL_ID);
    loadVendora();

    if (CLARITY_ID) loadClarity(CLARITY_ID);
    if (GA4_ID) loadGA4(GA4_ID);
}

/**
 * Loads third-party tracking scripts:
 * - Meta Pixel loads on window 'load' (respetando si el usuario ya eligió 'essential'/'necessary').
 * - gtag (GA4/Ads) y Clarity se difieren con requestIdleCallback.
 * - Por defecto, si el visitante aún no ha elegido nada, hasAnalyticsConsent() regresa true.
 */
export function setupDeferredAnalytics() {
    if (typeof window === 'undefined') return;

    const onWindowLoaded = () => {
        if (hasLoadedThirdParty) return;
        hasLoadedThirdParty = true;

        // 1. Meta Pixel se carga en el evento load si hay consentimiento (o visita nueva por defecto)
        if (hasAnalyticsConsent() && META_PIXEL_ID) {
            loadMetaPixel(META_PIXEL_ID);
        }
        if (hasAnalyticsConsent()) loadVendora();

        // 2. gtag (Google Analytics / Ads) y Clarity se difieren con requestIdleCallback
        const loadGtagAndClarity = () => {
            if (!hasAnalyticsConsent()) return;
            if (GA4_ID) loadGA4(GA4_ID);
            if (CLARITY_ID) loadClarity(CLARITY_ID);
        };

        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => {
                loadGtagAndClarity();
            }, { timeout: 3000 });
        } else {
            setTimeout(loadGtagAndClarity, 1500);
        }
    };

    if (document.readyState === 'complete') {
        onWindowLoaded();
    } else {
        window.addEventListener('load', onWindowLoaded, { once: true });
    }
}

// Fire a conversion event across GA4 and Meta Pixel. Safe to call anytime.
export function trackEvent(
    name: string,
    params: Record<string, unknown> = {},
    options?: { eventID?: string }
) {
    if (typeof window === 'undefined') return;

    // Google Analytics 4
    if (window.gtag) {
        window.gtag('event', name, params);
    }

    // Meta Pixel (Facebook / Instagram)
    if (window.fbq) {
        const metaEventMap: Record<string, string> = {
            'page_view': 'PageView',
            'view_item': 'ViewContent',
            'select_item': 'AddToCart',
            'begin_checkout': 'InitiateCheckout',
            'purchase': 'Purchase',
            'generate_lead': 'Lead',
            'contact': 'Contact',
            'sign_up': 'CompleteRegistration',
        };

        const metaEvent = metaEventMap[name];
        const eventId = (options?.eventID || params.event_id || params.eventId) as string | undefined;
        const fbqOptions = eventId ? { eventID: eventId } : undefined;

        if (metaEvent) {
            if (fbqOptions) {
                window.fbq('track', metaEvent, params, fbqOptions);
            } else {
                window.fbq('track', metaEvent, params);
            }
        } else {
            if (fbqOptions) {
                window.fbq('trackCustom', name, params, fbqOptions);
            } else {
                window.fbq('trackCustom', name, params);
            }
        }
    }
}

// Track SPA route navigation across GA4 and Meta Pixel
export function trackPageView(path?: string) {
    if (typeof window === 'undefined') return;
    const pagePath = path || window.location.pathname;

    if (window.gtag) {
        window.gtag('event', 'page_view', { page_path: pagePath });
    }
    if (window.fbq) {
        window.fbq('track', 'PageView');
    }
}

