export interface DraftCheckoutIntent {
    plan?: string;
    coupon?: string;
}

export const PLAN_PRICES: Record<string, { name: string; price: number; formatted: string }> = {
    clasico:   { name: 'Clásica',    price: 499,  formatted: '$499' },
    pro:       { name: 'Pro',        price: 1699, formatted: '$1,699' },
    premium:   { name: 'Diseño Pro', price: 2499, formatted: '$2,499' },
    concierge: { name: 'Concierge',  price: 4499, formatted: '$4,499' }
};

/**
 * Guarda y recupera la intención de compra (plan y cupón) en sessionStorage por event.id.
 * Si vienen en la URL, se persisten para no perderlos al navegar entre vista previa y editor.
 */
export function syncCheckoutIntent(eventId?: string | null, searchParams?: URLSearchParams): DraftCheckoutIntent {
    if (!eventId) return {};
    const storageKey = `invitto_checkout_intent_${eventId}`;

    // 1. Leer valores de la URL si están presentes
    const urlPlan = searchParams?.get('plan')?.toLowerCase() || null;
    const urlCoupon = searchParams?.get('coupon') || null;

    // 2. Leer lo que ya esté en sessionStorage
    let stored: DraftCheckoutIntent = {};
    if (typeof window !== 'undefined' && window.sessionStorage) {
        try {
            const raw = sessionStorage.getItem(storageKey);
            if (raw) stored = JSON.parse(raw);
        } catch {
            // ignore parse error
        }
    }

    // 3. Resolver valores finales (prioridad URL > storage)
    const resolvedPlan = urlPlan || stored.plan || undefined;
    const resolvedCoupon = urlCoupon || stored.coupon || undefined;

    const updated: DraftCheckoutIntent = {
        plan: resolvedPlan,
        coupon: resolvedCoupon
    };

    // 4. Si hay valores resueltos o nuevos en URL, persistir en sessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
        try {
            if (resolvedPlan || resolvedCoupon) {
                sessionStorage.setItem(storageKey, JSON.stringify(updated));
            }
        } catch {
            // ignore storage error
        }
    }

    return updated;
}

/**
 * Genera el texto del botón y la URL de destino según el plan y cupón resueltos.
 * - Con plan específico: "Publicar mi invitación – $X" -> /checkout?plan=...&id=...
 * - Sin plan: "Publicar mi invitación – desde $499" -> /planes?id=...
 */
export function getPublishCta(intent: DraftCheckoutIntent, eventId: string, themeName?: string | null) {
    const planKey = intent.plan?.toLowerCase();
    const planInfo = planKey ? PLAN_PRICES[planKey] : null;
    const couponQs = intent.coupon ? `&coupon=${encodeURIComponent(intent.coupon)}` : '';
    const themeQs = themeName ? `&theme=${encodeURIComponent(themeName)}` : '';

    if (planInfo && planKey) {
        return {
            buttonText: `Publicar mi invitación – ${planInfo.formatted}`,
            mobileButtonText: `Publicar – ${planInfo.formatted}`,
            url: `/checkout?plan=${planKey}&id=${eventId}${couponQs}`,
            hasSpecificPlan: true,
            planKey,
            planInfo
        };
    }

    return {
        buttonText: 'Publicar mi invitación – desde $499',
        mobileButtonText: 'Publicar – desde $499',
        url: `/planes?id=${eventId}${themeQs}${couponQs}`,
        hasSpecificPlan: false,
        planKey: null,
        planInfo: null
    };
}
