import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { FeatureAccessResponse } from '../types/database.types';

export function useFeatureAccess(eventId: string | undefined, eventPlan?: 'clasico' | 'pro' | 'premium') {
    const [isLoading, setIsLoading] = useState(true);
    const [access, setAccess] = useState<FeatureAccessResponse | null>(null);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!eventId) return;

        // MOCK MODE: use the actual plan passed in (from theme_config)
        if (!import.meta.env.VITE_SUPABASE_URL) {
            const plan = eventPlan || 'clasico';
            setAccess({ plan: { code: plan, name: plan === 'premium' ? 'Premium' : plan === 'pro' ? 'Pro' : 'Clásico' }, features: [] } as any);
            setIsLoading(false);
            return;
        }

        const fetchAccess = async () => {
            setIsLoading(true);
            try {
                // Ensure eventId is a valid UUID before calling RPC to avoid 'text = uuid' errors
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                if (!uuidRegex.test(eventId)) {
                    // If it's not a UUID (e.g. it's a slug or empty), skip RPC and use basic fallback
                    throw new Error('Invalid UUID format');
                }

                // Call the Postgres RPC
                const { data, error: rpcError } = await supabase
                    .rpc('get_event_feature_access', { p_event_id: eventId });

                if (rpcError) {
                    throw rpcError;
                }
                setAccess(data as FeatureAccessResponse);
            } catch (err: any) {
                // FALLBACK LOGIC
                if (err.message !== 'Invalid UUID format') {
                    console.warn('Feature access RPC failed, trying profile fallback...', err.message || err);
                }

                try {
                    // Get current user session safely
                    const { data: { user } } = await supabase.auth.getUser();
                    
                    if (user) {
                        const { data: profileData, error: profileError } = await supabase
                            .from('profiles')
                            .select('plan_tier')
                            .eq('id', user.id)
                            .maybeSingle();

                        if (!profileError && profileData) {
                            const planTier = profileData.plan_tier || 'clasico';
                            const isPremiumOrPro = planTier === 'premium' || planTier === 'pro' || planTier === 'concierge';

                            setAccess({ 
                                plan: { 
                                    code: planTier, 
                                    name: planTier === 'concierge' ? 'Concierge' : planTier === 'premium' ? 'Diseño Pro' : planTier === 'pro' ? 'Pro' : 'Clásica' 
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
                                    { code: 'access_control', status: isPremiumOrPro ? 'enabled' : 'disabled' },
                                    { code: 'qr_passes', status: isPremiumOrPro ? 'enabled' : 'disabled' }
                                ] 
                            } as any);
                            return;
                        }
                    }
                } catch (fallbackErr) {
                    console.error('Fallback also failed:', fallbackErr);
                }

                // Global default if everything else fails
                setAccess({ plan: { code: 'clasico', name: 'Clásica' }, features: [] } as any);
                setError(err);
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
            'table_management'
        ];
        if (isPro && proFeatures.includes(featureCode)) return true;

        const feature = access.features.find(f => f.code === featureCode);
        return feature?.status === 'enabled';
    };

    const getFeatureStatus = (featureCode: string): 'enabled' | 'locked' | 'limited' | 'not_found' => {
        if (!access) return 'not_found';
        if (hasFeature(featureCode)) return 'enabled';
        
        const feature = access.features.find(f => f.code === featureCode);
        if (!feature) return 'not_found';
        return feature.status === 'enabled' ? 'enabled' : 'locked';
    };

    const getUpgradePlan = (featureCode: string): string | undefined => {
        if (!access) return undefined;
        const feature = access.features.find(f => f.code === featureCode);
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
