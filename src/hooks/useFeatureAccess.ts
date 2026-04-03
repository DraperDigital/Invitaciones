import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { FeatureAccessResponse } from '../types/database.types';

export function useFeatureAccess(eventId: string | undefined) {
    const [isLoading, setIsLoading] = useState(true);
    const [access, setAccess] = useState<FeatureAccessResponse | null>(null);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!eventId) return;

        // MOCK MODE: return clasico plan so feature gates work correctly in dev
        if (!import.meta.env.VITE_SUPABASE_URL) {
            setAccess({ plan: { code: 'clasico', name: 'Clásico' }, features: [] } as any);
            setIsLoading(false);
            return;
        }

        const fetchAccess = async () => {
            setIsLoading(true);
            try {
                // Call the Postgres RPC
                const { data, error: rpcError } = await supabase
                    .rpc('get_event_feature_access', { p_event_id: eventId });

                if (rpcError) {
                    console.warn('Feature access RPC failed, falling back to classic:', rpcError);
                    setAccess({ 
                        plan: { code: 'clasico', name: 'Clásico' }, 
                        features: [
                            // Basic features (Enabled)
                            { code: 'show_details', name: 'Información General', status: 'enabled' },
                            { code: 'show_countdown', name: 'Cuenta Regresiva', status: 'enabled' },
                            { code: 'show_map', name: 'Ubicación', status: 'enabled' },
                            { code: 'show_gallery', name: 'Galería Básica', status: 'enabled' },
                            { code: 'show_whatsapp_rsvp', name: 'Confirmación WhatsApp', status: 'enabled' },
                            { code: 'show_gifts', name: 'Mesa de Regalos', status: 'enabled' },
                            
                            // Premium/Pro features (Locked by status 'disabled')
                            { code: 'guest_dashboard', status: 'disabled' },
                            { code: 'reminders_automatic', status: 'disabled' },
                            { code: 'export_excel', status: 'disabled' },
                            { code: 'metrics_dashboard', status: 'disabled' },
                            { code: 'ai_assistant', status: 'disabled' },
                            { code: 'qr_passes', status: 'disabled' },
                            { code: 'access_control', status: 'disabled' },
                            { code: 'custom_domain', status: 'disabled' },
                            { code: 'table_management', status: 'disabled' }
                        ] 
                    } as any);
                    return;
                }
                setAccess(data as FeatureAccessResponse);
            } catch (err: any) {
                console.error('Error fetching feature access:', err);
                setAccess({ plan: { code: 'clasico', name: 'Clásico' }, features: [] } as any);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccess();
    }, [eventId]);

    const hasFeature = (featureCode: string): boolean => {
        if (!access) return false;
        
        const plan = access.plan?.code?.toLowerCase() || '';
        const isPersonalized = ['pro', 'personalized', 'personalizado'].includes(plan);
        const isPremium = plan === 'premium' || isPersonalized;

        // Pro/Personalizado has access to EVERYTHING
        if (isPersonalized) return true;

        // Premium has access to specific dashboard features
        const premiumFeatures = [
            'metrics_dashboard', 
            'guest_dashboard', 
            'reminders_automatic', 
            'guest_import_excel'
        ];
        if (isPremium && premiumFeatures.includes(featureCode)) return true;

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
