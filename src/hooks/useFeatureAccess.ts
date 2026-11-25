import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { FeatureAccessResponse } from '../types/database.types';

export function useFeatureAccess(eventId: string | undefined, eventPlan?: 'clasico' | 'pro' | 'premium' | 'concierge') {
    const [isLoading, setIsLoading] = useState(true);
    const [access, setAccess] = useState<FeatureAccessResponse | null>(null);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        // Handle case where eventId is undefined but eventPlan was provided (e.g. demo mode)
        if (!eventId) {
            if (eventPlan) {
                const planCode = eventPlan.toLowerCase();
                const isPro = planCode === 'pro' || planCode === 'personalized' || planCode === 'personalizado';
                const isPremiumOrPro = isPro || planCode === 'premium' || planCode === 'concierge';
                const planName = planCode === 'concierge' ? 'Concierge' : planCode === 'premium' ? 'Diseño Pro' : isPro ? 'Pro' : 'Clásica';
                setAccess({
                    plan: { code: planCode, name: planName },
                    features: [
                        { code: 'show_details', status: 'enabled' },
                        { code: 'show_countdown', status: 'enabled' },
                        { code: 'show_map', status: 'enabled' },
                        { code: 'show_gallery', status: 'enabled' },
                        { code: 'show_whatsapp_rsvp', status: 'enabled' },
                        { code: 'guest_dashboard', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                        { code: 'reminders_automatic', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                        { code: 'guest_import_excel', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                        { code: 'metrics_dashboard', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                        { code: 'table_management', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                        { code: 'event_planning', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                        { code: 'access_control', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                        { code: 'qr_passes', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                        { code: 'confirma_whatsapp', status: isPremiumOrPro ? 'enabled' : 'disabled' }
                    ]
                } as any);
            }
            setIsLoading(false);
            return;
        }

        // MOCK MODE: use the actual plan passed in (from theme_config)
        if (!import.meta.env.VITE_SUPABASE_URL) {
            const plan = (eventPlan || 'clasico').toLowerCase();
            const isPro = plan === 'pro' || plan === 'personalized' || plan === 'personalizado';
            const isPremiumOrPro = isPro || plan === 'premium' || plan === 'concierge';
            const planName = plan === 'concierge' ? 'Concierge' : plan === 'premium' ? 'Diseño Pro' : isPro ? 'Pro' : 'Clásica';
            setAccess({
                plan: { code: plan, name: planName },
                features: [
                    { code: 'show_details', status: 'enabled' },
                    { code: 'show_countdown', status: 'enabled' },
                    { code: 'show_map', status: 'enabled' },
                    { code: 'show_gallery', status: 'enabled' },
                    { code: 'show_whatsapp_rsvp', status: 'enabled' },
                    { code: 'guest_dashboard', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                    { code: 'reminders_automatic', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                    { code: 'guest_import_excel', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                    { code: 'metrics_dashboard', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                    { code: 'table_management', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                    { code: 'event_planning', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                    { code: 'access_control', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                    { code: 'qr_passes', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                    { code: 'confirma_whatsapp', status: isPremiumOrPro ? 'enabled' : 'disabled' }
                ]
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
                            resolvedPlan = eventData.plan || eventData.theme_config?.plan || null;
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
                    const isPremiumOrPro = isPro || planCode === 'premium' || planCode === 'concierge';
                    const planName = planCode === 'concierge'
                        ? 'Concierge'
                        : planCode === 'premium'
                            ? 'Diseño Pro'
                            : isPro
                                ? 'Pro'
                                : 'Clásica';

                    setAccess({
                        plan: {
                            code: planCode,
                            name: planName
                        },
                        features: [
                            { code: 'show_details', status: 'enabled' },
                            { code: 'show_countdown', status: 'enabled' },
                            { code: 'show_map', status: 'enabled' },
                            { code: 'show_gallery', status: 'enabled' },
                            { code: 'show_whatsapp_rsvp', status: 'enabled' },
                            { code: 'guest_dashboard', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                            { code: 'reminders_automatic', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                            { code: 'guest_import_excel', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                            { code: 'metrics_dashboard', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                            { code: 'table_management', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                            { code: 'event_planning', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                            { code: 'access_control', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                            { code: 'qr_passes', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                            { code: 'confirma_whatsapp', status: isPremiumOrPro ? 'enabled' : 'disabled' }
                        ]
                    } as any);
                } catch (fallbackErr) {
                    console.error('Fallback also failed:', fallbackErr);
                    // Absolute safe default: clasico (disabled)
                    setAccess({
                        plan: { code: 'clasico', name: 'Clásica' },
                        features: [
                            { code: 'event_planning', status: 'disabled' }
                        ]
                    } as any);
                    setError(err);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccess();
    }, [eventId, eventPlan]);

    const hasFeature = (featureCode: string): boolean => {
        if (!access) return false;
        
        const plan = access.plan?.code?.toLowerCase() || '';
        const isPro = plan === 'pro' || plan === 'personalized' || plan === 'personalizado';
        const isPremium = plan === 'premium' || plan === 'concierge';

        // Premium or Concierge has access to EVERYTHING
        if (isPremium) return true;

        // Pro has access to specific dashboard features
        const proFeatures = [
            'metrics_dashboard', 
            'guest_dashboard', 
            'reminders_automatic', 
            'guest_import_excel',
            'table_management',
            'event_planning',
            'confirma_whatsapp'
        ];
        if (isPro && proFeatures.includes(featureCode)) return true;

        const feature = access.features?.find(f => f.code === featureCode);
        return feature?.status === 'enabled';
    };

    const getFeatureStatus = (featureCode: string): 'enabled' | 'locked' | 'limited' | 'not_found' => {
        if (!access) return 'not_found';
        if (hasFeature(featureCode)) return 'enabled';
        
        const feature = access.features?.find(f => f.code === featureCode);
        if (!feature) return 'not_found';
        return feature.status === 'enabled' ? 'enabled' : 'locked';
    };

    const getUpgradePlan = (featureCode: string): string | undefined => {
        if (!access) return undefined;
        const feature = access.features?.find(f => f.code === featureCode);
        return feature?.upgrade_plan;
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
