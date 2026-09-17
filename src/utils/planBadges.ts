export interface EventPlanBadge {
    label: string;
    classes: string;
    icon: string;
}

export function getEventPlanBadge(themeConfig: any): EventPlanBadge {
    let tc = themeConfig;
    if (typeof tc === 'string') {
        try {
            tc = JSON.parse(tc);
        } catch {
            tc = {};
        }
    }
    tc = tc || {};
    const raw = (tc.plan_tier || (tc.isPremium ? 'premium' : tc.isPro ? 'pro' : 'clasico')).toLowerCase();

    switch (raw) {
        case 'concierge':
            return {
                label: 'Concierge',
                classes: 'bg-stone-900/90 text-amber-300 border border-amber-400/40',
                icon: '💎',
            };
        case 'premium':
        case 'personalized':
            return {
                label: 'Diseño Pro',
                classes: 'bg-amber-500/90 text-white border border-amber-300/40',
                icon: '♛',
            };
        case 'pro':
            return {
                label: 'Plan Pro',
                classes: 'bg-emerald-600/90 text-white border border-emerald-400/40',
                icon: '👑',
            };
        case 'clasico':
        case 'classic':
        default:
            return {
                label: 'Clásica',
                classes: 'bg-slate-900/75 text-slate-100 border border-white/20',
                icon: '💌',
            };
    }
}
