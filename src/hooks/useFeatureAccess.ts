import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { FeatureAccessResponse } from '../types/database.types';

// Matriz Canónica de Fallback estricta (no hardcodea permisos permisivos, refleja la DB)
function buildFallbackFeatures(planCode: string) {
    const code = planCode.toLowerCase();
    const isConcierge = code === 'concierge';
    const isPremium = isConcierge || code === 'premium';
    const isPro = isPremium || code === 'pro' || code === 'personalized' || code === 'personalizado';

    return [
        // Básicas (5)
        { code: 'show_details', status: 'enabled', upgrade_plan: null },
        { code: 'show_countdown', status: 'enabled', upgrade_plan: null },
        { code: 'show_map', status: 'enabled', upgrade_plan: null },
        { code: 'show_gallery', status: 'enabled', upgrade_plan: null },
        { code: 'show_whatsapp_rsvp', status: 'enabled', upgrade_plan: null },

        // Pro (8 adicionales -> 13)
        { code: 'guest_dashboard', status: isPro ? 'enabled' : 'disabled', upgrade_plan: isPro ? null : 'Pro' },
        { code: 'reminders_automatic', status: isPro ? 'enabled' : 'disabled', upgrade_plan: isPro ? null : 'Pro' },
        { code: 'guest_import_excel', status: isPro ? 'enabled' : 'disabled', upgrade_plan: isPro ? null : 'Pro' },
        { code: 'metrics_dashboard', status: isPro ? 'enabled' : 'disabled', upgrade_plan: isPro ? null : 'Pro' },
        { code: 'qr_passes', status: isPro ? 'enabled' : 'disabled', upgrade_plan: isPro ? null : 'Pro' },
        { code: 'access_control', status: isPro ? 'enabled' : 'disabled', upgrade_plan: isPro ? null : 'Pro' },
        { code: 'table_management', status: isPro ? 'enabled' : 'disabled', upgrade_plan: isPro ? null : 'Pro' },
        { code: 'background_music', status: isPro ? 'enabled' : 'disabled', upgrade_plan: isPro ? null : 'Pro' },

        // Premium (2 adicionales -> 15)
        { code: 'custom_domain', status: isPremium ? 'enabled' : 'disabled', upgrade_plan: isPremium ? null : 'Premium' },
        { code: 'event_planning', status: isPremium ? 'enabled' : 'disabled', upgrade_plan: isPremium ? null : 'Premium' },

        // Concierge (2 adicionales -> 17)
        { code: 'smart_concierge', status: isConcierge ? 'enabled' : 'disabled', upgrade_plan: isConcierge ? null : 'Concierge' },
        { code: 'confirma_whatsapp', status: isConcierge ? 'enabled' : 'disabled', upgrade_plan: isConcierge ? null : 'Concierge' }
    ];
}

export function useFeatureAccess(eventId: string | undefined, eventPlan?: 'clasico' | 'pro' | 'premium' | 'concierge') {
    const [isLoading, setIsLoading] = useState(true);
    const [access, setAccess] = useState<FeatureAccessResponse | null>(null);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        // Handle case where eventId is undefined but eventPlan was provided (e.g. demo mode)
        if (!eventId) {
            if (eventPlan) {
                const planCode = eventPlan.toLowerCase();
                const planName = planCode === 'concierge' ? 'Concierge' : planCode === 'premium' ? 'Premium' : (planCode === 'pro' || planCode === 'personalized' || planCode === 'personalizado') ? 'Pro' : 'Clásica';
                setAccess({
                    plan: { code: planCode, name: planName },
                    features: buildFallbackFeatures(planCode)
                } as any);
            }
            setIsLoading(false);
            return;
        }

        // MOCK MODE: use the actual plan passed in (from theme_config)
        if (!import.meta.env.VITE_SUPABASE_URL) {
            const plan = (eventPlan || 'clasico').toLowerCase();
            const planName = plan === 'concierge' ? 'Concierge' : plan === 'premium' ? 'Premium' : (plan === 'pro' || plan === 'personalized' || plan === 'personalizado') ? 'Pro' : 'Clásica';
            setAccess({
                plan: { code: plan, name: planName },
                features: buildFallbackFeatures(plan)
            } as any);
            setIsLoading(false);
            return;
        }

        const fetchAccess = async () => {
            setIsLoading(true);
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

            try {
                if (!uuidRegex.test(eventId)) {
                    throw new Error('Invalid UUID format');
                }

                // Call the Postgres RPC (primary source of truth per event)
                const { data, error: rpcError } = await supabase
                    .rpc('get_event_feature_access', { p_event_id: eventId });

                if (rpcError) {
                    throw rpcError;
                }
                if (data && (data as any).plan) {
                    setAccess(data as FeatureAccessResponse);
                    return;
                }
                throw new Error('Empty feature access response');
            } catch (err: any) {
                // FALLBACK LOGIC — STRICTLY PER EVENT (NEVER FROM profiles.plan_tier)
                if (err.message !== 'Invalid UUID format') {
                    console.warn('get_event_feature_access RPC failed, using event-based fallback:', err.message || err);
                }

                try {
                    let resolvedPlan: string | null = eventPlan || null;

                    // 1. Check the event's own plan column and theme_config
                    if (!resolvedPlan) {
                        const { data: eventData, error: eventError } = await supabase
                            .from('events')
                            .select('plan, theme_config')
                            .eq('id', eventId)
                            .maybeSingle();

                        if (!eventError && eventData) {
                            resolvedPlan = eventData.plan || eventData.theme_config?.plan || eventData.theme_config?.plan_tier || null;
                        }
                    }

                    // 2. Check active subscription for this specific event
                    if (!resolvedPlan && uuidRegex.test(eventId)) {
                        const { data: subData } = await supabase
                            .from('event_subscriptions')
                            .select('plan_id, plans(code)')
                            .eq('event_id', eventId)
                            .eq('status', 'active')
                            .maybeSingle();

                        if (subData?.plans) {
                            resolvedPlan = (Array.isArray(subData.plans) ? subData.plans[0]?.code : (subData.plans as any)?.code) || null;
                        }
                    }

                    // Default to most restrictive: 'clasico'
                    const planCode = (resolvedPlan || 'clasico').toLowerCase();
                    const isPro = planCode === 'pro' || planCode === 'personalized' || planCode === 'personalizado';
                    const planName = planCode === 'concierge'
                        ? 'Concierge'
                        : planCode === 'premium'
                            ? 'Premium'
                            : isPro
                                ? 'Pro'
                                : 'Clásica';

                    setAccess({
                        plan: {
                            code: planCode,
                            name: planName
                        },
                        features: buildFallbackFeatures(planCode)
                    } as any);
                } catch (fallbackErr) {
                    console.error('Fallback also failed:', fallbackErr);
                    // Absolute safe default: clasico (disabled)
                    setAccess({
                        plan: { code: 'clasico', name: 'Clásica' },
                        features: buildFallbackFeatures('clasico')
                    } as any);
                    setError(err);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccess();
    }, [eventId, eventPlan]);

    // La ÚNICA fuente de verdad es lo que indica el RPC / base de datos
    const hasFeature = (featureCode: string): boolean => {
        if (!access) return false;
        const feature = access.features?.find(f => f.code === featureCode);
        return feature?.status === 'enabled';
    };

    const getFeatureStatus = (featureCode: string): 'enabled' | 'locked' | 'limited' | 'not_found' => {
        if (!access) return 'not_found';
        const feature = access.features?.find(f => f.code === featureCode);
        if (!feature) return 'not_found';
        return feature.status === 'enabled' ? 'enabled' : 'locked';
    };

    const getUpgradePlan = (featureCode: string): string | undefined => {
        if (!access) return 'Pro';
        const feature = access.features?.find(f => f.code === featureCode);
        return feature?.upgrade_plan || 'Pro';
    };

    return {
        isLoading,
        access,
        error,
        hasFeature,
        getFeatureStatus,
        getUpgradePlan,
        currentPlan: access?.plan
    };
}
