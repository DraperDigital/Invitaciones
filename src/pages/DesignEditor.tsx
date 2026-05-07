import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Loader2, Save, ArrowLeft, Image as ImageIcon, Trash2, Plus, Gift, Clock, Heart, Music, PartyPopper, Wine, Utensils, Moon, Eye, Sparkles, Shield, ChevronDown, Upload, X, Flower2 } from 'lucide-react';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import { DEFAULT_SECTION_ORDER, type SectionId } from '../lib/sectionRegistry';

type DesignConfig = {
    primaryColor: string;
    heroTextColor: string;
    accentColor: string;
    cardBgColor: string;
    heroImage: string;
    decorativeImage: string;
    buttonColor: string;
    welcomeMessage: string;
    welcomeSubtitle: string;
    
    // Clasico
    showDetails: boolean;
    showCountdown: boolean;
    showMap: boolean;
    showGallery: boolean;
    showWhatsAppRSVP: boolean;

    // Premium
    enableGuestList: boolean;
    enableReminders: boolean;
    enableExcel: boolean;
    enableMetrics: boolean;

    // Pro
    enableAi: boolean;
    enableQr: boolean;
    enableAccessControl: boolean;
    enableCustomDomain: boolean;
    enableTableManagement: boolean;

    // Plan tier flags (written to theme_config for InvitationPage)
    isPro: boolean;
    isPremium: boolean;

    // Premium Features
    showEnvelope: boolean;

    // Ubicación Detallada (Misa / Ceremonia)
    misa_name: string;
    misa_address: string;
    misa_maps_link: string;
    misa_time: string;

    // Asistencia
    dress_code: string;
    rsvp_deadline: string;

    // Multimedia
    galleryImages: { url: string; caption: string }[];
    registryItems: { store: string; link: string; description: string }[];

    // Itinerario
    itinerary: { id: string; time: string; title: string; icon: string; }[];
    showItinerary: boolean;

    // Layout
    sectionOrder: SectionId[];

    // Toggles
    showMessage: boolean;
    showChambelanes: boolean;
    showHotels: boolean;
    showGifts: boolean;

    // Corte de Honor
    chambelanes: string[];
    damas: string[];

    // Colors
    heroBgColor: string;
    hero_bg_color?: string;

    // Typography
    typographyPreset: 'elegante' | 'moderna' | 'romantica';

    // Plan
    plan: 'clasico' | 'pro' | 'premium' | 'concierge';
    hotels: { name: string; distance: string; description: string; price: string; link: string; isRecommended: boolean }[];
    customCss: string;
};

const DEFAULT_CONFIG: DesignConfig = {
    // ... existing defaults ...
    primaryColor: '#1B2E1D',
    heroTextColor: '#ffffff',
    accentColor: '#BD7474',
    cardBgColor: '#C17B6A',
    heroImage: '',
    decorativeImage: '',
    buttonColor: '#1B2E1D',
    welcomeMessage: 'Te invitamos a ser parte de una tarde inolvidable de gratitud, risas y la calidez de nuestra familia.',
    welcomeSubtitle: '70 años',
    
    showDetails: true,
    showCountdown: true,
    showMap: true,
    showGallery: true,
    showWhatsAppRSVP: true,
    showHotels: true,
    showGifts: true,

    enableGuestList: false,
    enableReminders: false,
    enableExcel: false,
    enableMetrics: false,

    enableAi: false,
    enableQr: false,
    enableAccessControl: false,
    enableCustomDomain: false,
    enableTableManagement: false,

    isPro: false,
    isPremium: false,

    showEnvelope: false,

    misa_name: '',
    misa_address: '',
    misa_maps_link: '',
    misa_time: '',

    dress_code: '',
    rsvp_deadline: '',
    galleryImages: [],
    registryItems: [],
    itinerary: [],
    showItinerary: true,
    sectionOrder: DEFAULT_SECTION_ORDER,
    showMessage: true,
    showChambelanes: true,
    chambelanes: [],
    damas: [],
    heroBgColor: '#1B2E1D',
    typographyPreset: 'romantica',
    plan: 'clasico',
    hotels: [],
    customCss: '',
};

const TYPOGRAPHY_PRESETS = {
    elegante: {
        serif: 'Playfair Display',
        sans: 'Manrope',
        label: 'Elegante',
        desc: 'Alta costura y sofisticación',
        preview: 'Nuestra Boda'
    },
    moderna: {
        serif: 'Outfit',
        sans: 'Inter',
        label: 'Moderna',
        desc: 'Limpia, minimalista y actual',
        preview: 'Evento Social'
    },
    romantica: {
        serif: 'Libre Baskerville',
        sans: 'Lato',
        label: 'Romántica',
        desc: 'Dulce, clásica y artística',
        preview: 'Mis XV Años'
    },
};

const CollapsibleCard = ({ id, title, subtitle, icon, activeSection, setActiveSection, children }: any) => {
    const isOpen = activeSection === id;
    return (
        <div className={`bg-white rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${isOpen ? 'border-stone-200 shadow-xl' : 'border-stone-100 shadow-sm hover:shadow-md'}`}>
            <div onClick={() => setActiveSection(isOpen ? null : id)} className="p-8 sm:px-10 flex items-center justify-between cursor-pointer hover:bg-stone-50/30 transition-colors">
                <div className="flex items-center gap-5">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${isOpen ? 'bg-[#1B2E1D] text-white scale-110' : 'bg-stone-50 text-stone-400'}`}>{icon}</div>
                    <div>
                        <h2 className={`text-2xl font-serif ${isOpen ? 'text-[#1B2E1D]' : 'text-stone-700'}`}>{title}</h2>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest font-black mt-1">{subtitle}</p>
                    </div>
                </div>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center border border-stone-100 text-stone-300 transition-all ${isOpen ? 'rotate-180 bg-[#1B2E1D]/5 text-[#1B2E1D]' : ''}`}><ChevronDown className="h-5 w-5" /></div>
            </div>
            <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <div className="p-8 sm:p-12 pt-4 border-t border-stone-50">{children}</div>
            </div>
        </div>
    );
};

export default function DesignEditor() {
    const { id } = useParams<{ id: string }>();
    const { isLoading: loadingAccess, currentPlan } = useFeatureAccess(id || undefined);
    
    const { user } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<string | null>('matrix');
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [event, setEvent] = useState<any>(null);
    const [config, setConfig] = useState<DesignConfig>(DEFAULT_CONFIG);
    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (!id || !user) return;
        const fetchEvent = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .maybeSingle();

            if (data && !error) {
                setEvent(data);
                // Merge existing config — support both old camelCase and new snake_case keys
                const c = data.theme_config || {};
                setConfig({
                    ...DEFAULT_CONFIG,
                    primaryColor:   c.primary_color    ?? c.primaryColor    ?? DEFAULT_CONFIG.primaryColor,
                    heroTextColor:  c.hero_text_color  ?? c.heroTextColor   ?? DEFAULT_CONFIG.heroTextColor,
                    accentColor:    c.accent_color     ?? c.accentColor     ?? DEFAULT_CONFIG.accentColor,
                    cardBgColor:    c.card_bg_color    ?? c.cardBgColor     ?? DEFAULT_CONFIG.cardBgColor,
                    heroImage:      c.hero_image_url   ?? c.heroImage       ?? DEFAULT_CONFIG.heroImage,
                    decorativeImage:c.decorative_image_url ?? c.decorativeImage ?? DEFAULT_CONFIG.decorativeImage,
                    buttonColor:    c.button_color     ?? c.buttonColor     ?? DEFAULT_CONFIG.buttonColor,
                    welcomeMessage: c.welcome_message  ?? c.welcomeMessage  ?? DEFAULT_CONFIG.welcomeMessage,
                    welcomeSubtitle:c.subtitle         ?? c.welcomeSubtitle ?? DEFAULT_CONFIG.welcomeSubtitle,
                    showDetails:    c.show_details    ?? c.showDetails    ?? DEFAULT_CONFIG.showDetails,
                    showCountdown:  c.show_countdown  ?? c.showCountdown  ?? DEFAULT_CONFIG.showCountdown,
                    showMap:        c.show_map        ?? c.showMap        ?? DEFAULT_CONFIG.showMap,
                    showGallery:    c.show_gallery    ?? c.showGallery    ?? DEFAULT_CONFIG.showGallery,
                    showWhatsAppRSVP: c.show_whatsapp_rsvp ?? c.showWhatsAppRSVP ?? DEFAULT_CONFIG.showWhatsAppRSVP,
                    showMessage:      c.show_message      ?? c.showMessage      ?? DEFAULT_CONFIG.showMessage,
                    showChambelanes:  c.show_chambelanes  ?? c.showChambelanes  ?? DEFAULT_CONFIG.showChambelanes,
                    showHotels:       c.show_hotels       ?? c.showHotels       ?? DEFAULT_CONFIG.showHotels,
                    enableGuestList:  c.enableGuestList  ?? DEFAULT_CONFIG.enableGuestList,
                    enableReminders:  c.enableReminders  ?? DEFAULT_CONFIG.enableReminders,
                    enableExcel:      c.enableExcel      ?? DEFAULT_CONFIG.enableExcel,
                    enableMetrics:    c.enableMetrics    ?? DEFAULT_CONFIG.enableMetrics,
                    enableAi:               c.enableAi              ?? DEFAULT_CONFIG.enableAi,
                    enableQr:               c.enableQr              ?? DEFAULT_CONFIG.enableQr,
                    enableAccessControl:    c.enableAccessControl   ?? DEFAULT_CONFIG.enableAccessControl,
                    enableCustomDomain:     c.enableCustomDomain    ?? DEFAULT_CONFIG.enableCustomDomain,
                    enableTableManagement:  c.enableTableManagement ?? DEFAULT_CONFIG.enableTableManagement,
                    misa_name:      c.misa_name      ?? c.misaName          ?? '',
                    misa_address:   c.misa_address   ?? c.misaAddress       ?? '',
                    misa_maps_link: c.misa_maps_link ?? c.misaMapsLink      ?? '',
                    misa_time:      c.misa_time      ?? c.misaTime          ?? '',
                    dress_code:     data.dress_code || '',
                    rsvp_deadline:  data.rsvp_deadline ? new Date(data.rsvp_deadline).toISOString().slice(0, 10) : '',
                    galleryImages:  c.gallery_images ?? [],
                    registryItems:  c.registry_items ?? [],
                    itinerary:      c.itinerary ?? [],
                    showItinerary:  c.showItinerary ?? true,
                    sectionOrder:   c.sectionOrder ?? DEFAULT_SECTION_ORDER,
                    chambelanes:     c.chambelanes ?? [],
                    damas:           c.damas       ?? [],
                    heroBgColor:     c.heroBgColor ?? c.hero_bg_color ?? '#1B2E1D',
                    typographyPreset: c.typography_preset ?? c.typographyPreset ?? DEFAULT_CONFIG.typographyPreset,
                    plan:           c.isPremium ? 'premium' : c.isPro ? 'pro' : 'clasico',
                    hotels:         c.hotels ?? [],
                    customCss:      c.custom_css ?? '',
                });
            }
            setLoading(false);
        };
        fetchEvent();
    }, [id]);

    // Live Preview Effect for Typography and Colors
    const [liveStyles, setLiveStyles] = useState('');

    useEffect(() => {
        // Safe color parsing
        const hex = (config.accentColor || '#BD7474').replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16) || 189;
        const g = parseInt(hex.substring(2, 4), 16) || 116;
        const b = parseInt(hex.substring(4, 6), 16) || 116;
        
        const styles = `
            :root, html {
                --color-accent: ${r} ${g} ${b} !important;
            }
            ${config.customCss}
        `;
        setLiveStyles(styles);
        
        // Update data attribute for font theme
        document.documentElement.setAttribute('data-theme-font', config.typographyPreset);
        
        // Also update document root for accent color
        document.documentElement.style.setProperty('--color-accent', `${r} ${g} ${b}`);
    }, [config.typographyPreset, config.accentColor, config.customCss]);

    const handleSave = async () => {
        if (!id || !event) return;
        setSaving(true);
        try {
            // Fetch current config to merge and avoid overwriting toggles from Settings page
            const { data: currentEvent } = await supabase
                .from('events')
                .select('theme_config')
                .eq('id', id)
                .single();

            const existingConfig = currentEvent?.theme_config || {};

            const newThemeConfig = {
                ...existingConfig,
                // Save with snake_case keys that InvitationPage reads
                primary_color:    config.primaryColor,
                hero_text_color:  config.heroTextColor,
                accent_color:     config.accentColor,
                card_bg_color:    config.cardBgColor,
                hero_image_url:   config.heroImage,
                decorative_image_url: config.decorativeImage,
                button_color:     config.buttonColor,
                welcome_message:  config.welcomeMessage,
                subtitle:         config.welcomeSubtitle,
                gallery_images:   config.galleryImages,
                registry_items:   config.registryItems,
                itinerary:        config.itinerary,
                
                // Explicitly keep feature flags from current state to be double safe
                // Toggles (Saving both formats for total sync)
                showDetails:      config.showDetails,
                show_details:     config.showDetails,
                showCountdown:    config.showCountdown,
                show_countdown:   config.showCountdown,
                showMap:          config.showMap,
                show_map:         config.showMap,
                showGallery:      config.showGallery,
                show_gallery:     config.showGallery,
                showWhatsAppRSVP: config.showWhatsAppRSVP,
                show_whatsapp_rsvp: config.showWhatsAppRSVP,
                showMessage:      config.showMessage,
                show_message:     config.showMessage,
                showChambelanes:  config.showChambelanes,
                show_chambelanes: config.showChambelanes,
                showHotels:       config.showHotels,
                show_hotels:      config.showHotels,
                
                chambelanes:      config.chambelanes,
                damas:            config.damas,
                heroBgColor:      config.heroBgColor,
                hero_bg_color:    config.heroBgColor,
                hotels:           config.hotels,
                
                enableGuestList:      config.enableGuestList,
                enableReminders:      config.enableReminders,
                enableExcel:          config.enableExcel,
                enableMetrics:        config.enableMetrics,
                enableAi:             config.enableAi,
                enableQr:             config.enableQr,
                enableAccessControl:  config.enableAccessControl,
                enableCustomDomain:   config.enableCustomDomain,
                enableTableManagement:config.enableTableManagement,
                
                // Plan tier
                isPro:     config.plan === 'pro',
                isPremium: config.plan === 'premium',

                // Layout order
                sectionOrder: config.sectionOrder,

                // Typography
                typography_preset:    config.typographyPreset,

                // Ubicación Misa
                misa_name:            config.misa_name,
                misa_address:         config.misa_address,
                misa_maps_link:       config.misa_maps_link,
                misa_time:            config.misa_time,

                // EXPERT CSS
                custom_css:           config.customCss,
            };

            const { error } = await supabase
                .from('events')
                .update({ 
                    theme_config: newThemeConfig,
                    dress_code: config.dress_code,
                    rsvp_deadline: config.rsvp_deadline ? new Date(config.rsvp_deadline).toISOString() : null
                })
                .eq('id', id);

            if (error) throw error;
            toast.success('¡Diseño guardado exitosamente!');
        } catch (error: any) {
            console.error('Error saving design:', error);
            toast.error('Error al guardar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!id || !file) return;
        setUploading(true);
        try {
            const ext = file.name.split('.').pop();
            const path = `events/${id}/hero.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from('event-images')
                .upload(path, file, { upsert: true, contentType: file.type });
            if (uploadError) throw uploadError;
            const { data: urlData } = supabase.storage.from('event-images').getPublicUrl(path);
            const publicUrl = urlData.publicUrl + '?t=' + Date.now();
            setConfig(prev => ({ ...prev, heroImage: publicUrl }));
        } catch (err: any) {
            toast.error('Error al subir imagen. Alternativa: pega la URL de la imagen en el campo de texto.');
        } finally {
            setUploading(false);
        }
    };

    // ── Plan Presets: auto-enable the right features when selecting a plan ──
    const PLAN_PRESETS: Record<'clasico' | 'pro' | 'premium' | 'concierge', Partial<DesignConfig>> = {
        clasico: {
            isPremium: false,
            isPro: false,
            showDetails: true,
            showCountdown: true,
            showMap: true,
            showGallery: false,
            showWhatsAppRSVP: true,
            showGifts: false,
            showItinerary: false,
            enableQr: false,
            enableAccessControl: false,
            enableTableManagement: false,
            enableAi: false,
            enableMetrics: false,
            enableCustomDomain: false,
            showHotels: false,
        },
        pro: {
            isPremium: false,
            isPro: true,
            showDetails: true,
            showCountdown: true,
            showMap: true,
            showGallery: false,
            showWhatsAppRSVP: true,
            showGifts: true,
            showItinerary: true,
            enableQr: true,
            enableAccessControl: true,
            enableTableManagement: true,
            enableAi: false,
            enableMetrics: true,
            enableCustomDomain: false,
            showHotels: false,
        },
        premium: {
            isPremium: true,
            isPro: true,
            showDetails: true,
            showCountdown: true,
            showMap: true,
            showGallery: true,
            showWhatsAppRSVP: true,
            showGifts: true,
            showItinerary: true,
            enableQr: true,
            enableAccessControl: true,
            enableTableManagement: true,
            enableAi: true,
            enableMetrics: true,
            enableCustomDomain: true,
            showHotels: true,
        },
        concierge: {
            isPremium: true,
            isPro: true,
            showDetails: true,
            showCountdown: true,
            showMap: true,
            showGallery: true,
            showWhatsAppRSVP: true,
            showGifts: true,
            showItinerary: true,
            enableQr: true,
            enableAccessControl: true,
            enableTableManagement: true,
            enableAi: true,
            enableMetrics: true,
            enableCustomDomain: true,
            showHotels: true,
        },
    };

    const applyPlan = (planId: 'clasico' | 'pro' | 'premium' | 'concierge') => {
        const ranks: Record<string, number> = { clasico: 0, pro: 1, premium: 2, concierge: 3, personalizado: 1 };
        const paidPlanCode = currentPlan?.code?.toLowerCase() || 'clasico';
        const paidRank = ranks[paidPlanCode] ?? 0;
        const targetRank = ranks[planId] ?? 0;

        if (targetRank > paidRank) {
            toast.error(`Tu evento tiene un plan ${currentPlan?.name || 'Clásico'}. Para usar ${planId.toUpperCase()} contacta a soporte para realizar el pago del upgrade.`);
            return;
        }

        setConfig(prev => ({ ...prev, ...PLAN_PRESETS[planId], plan: planId as any }));
    };

    if (loading || loadingAccess) {
        return (
             <div className="flex h-[60vh] items-center justify-center">
                 <Loader2 className="h-10 w-10 text-stone-300 animate-spin" />
             </div>
        );
    }

    if (!event) {
        return <div className="p-20 text-center">Evento no encontrado.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 py-10 px-6">
            <style>{liveStyles}</style>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Link to={`/dashboard/event/${id}`} className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-600 mb-6 transition-colors font-bold uppercase tracking-widest text-[10px]">
                        <ArrowLeft className="h-4 w-4" /> Volver al panel del evento
                    </Link>
                    <h1 className="text-4xl font-serif text-[#1B2E1D]">Visual Editor Builder</h1>
                    <p className="text-sm font-light italic text-stone-500 mt-2">Personaliza textos, imagen de portada y características adicionales de tu invitación.</p>
                </div>
                <div className="flex items-center gap-3">
                    {event?.slug && (
                        <a
                            href={`/i/${event.slug}?t=admin`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-[#1B2E1D] text-[#1B2E1D] rounded-2xl hover:bg-stone-50 hover:scale-105 transition-all text-[11px] font-bold uppercase tracking-widest"
                        >
                            <Eye className="h-5 w-5" />
                            Vista Previa
                        </a>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-[#1B2E1D] text-white rounded-2xl shadow-xl hover:scale-105 transition-all text-[11px] font-bold uppercase tracking-widest disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        Guardar Diseño
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* ── 1. Plan de la Invitación ── */}
                <CollapsibleCard
                    id="matrix"
                    title="Plan de la Invitación"
                    subtitle="Selecciona el nivel de tu evento y verifica funciones"
                    icon="⭐"
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                >
                    <div className="space-y-8">
                        {/* Plan Buttons */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {([
                                { id: 'clasico' as const, label: 'Clásica', icon: '💌', color: 'border-stone-300 bg-stone-50 hover:border-stone-400', active: 'border-[#1B2E1D] bg-[#1B2E1D]' },
                                { id: 'pro' as const, label: 'Pro', icon: '✦', color: 'border-blue-200 bg-blue-50 hover:border-blue-400', active: 'border-blue-600 bg-blue-600' },
                                { id: 'premium' as const, label: 'Premium', icon: '♛', color: 'border-amber-200 bg-amber-50 hover:border-amber-400', active: 'border-amber-500 bg-amber-500' },
                                { id: 'concierge' as const, label: 'Concierge', icon: '💎', color: 'border-stone-800 bg-stone-900 hover:border-black', active: 'border-black bg-black' },
                            ]).map(tier => {
                                const isActive = config.plan === tier.id;
                                const ranks: Record<string, number> = { clasico: 0, pro: 1, premium: 2, concierge: 3, personalizado: 1 };
                                const paidPlanCode = currentPlan?.code?.toLowerCase() || 'clasico';
                                const isLocked = (ranks[tier.id] ?? 0) > (ranks[paidPlanCode] ?? 0);

                                return (
                                    <button
                                        key={tier.id}
                                        onClick={() => applyPlan(tier.id)}
                                        className={`relative flex flex-col items-center text-center gap-2 py-5 px-4 rounded-2xl border-2 transition-all duration-300 ${
                                            isActive ? `${tier.active} text-white shadow-lg scale-[1.03]` : 
                                            isLocked ? 'border-dashed border-stone-200 bg-stone-50/50 opacity-60' :
                                            `${tier.color} text-stone-700`
                                        }`}
                                    >
                                        <span className="text-2xl">{tier.icon}</span>
                                        <span className="font-black text-sm uppercase tracking-widest">{tier.label}</span>
                                        {isActive && (
                                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest bg-white text-[#1B2E1D] px-2 py-0.5 rounded-full border border-stone-200 shadow-sm whitespace-nowrap">Activo</span>
                                        )}
                                        {isLocked && !isActive && (
                                            <>
                                                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-widest bg-stone-100 text-stone-400 px-2 py-0.5 rounded-full border border-stone-200 whitespace-nowrap flex items-center gap-1">
                                                    <Shield className="h-2 w-2" /> Bloqueado
                                                </span>
                                                <Link 
                                                    to="/concierge-service" 
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="mt-2 px-3 py-1 bg-[#BD7474]/10 text-[#BD7474] text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-[#BD7474] hover:text-white transition-colors"
                                                >
                                                    Saber más
                                                </Link>
                                            </>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Feature Matrix */}
                        <div className="rounded-2xl border border-stone-100 overflow-hidden">
                            <div className="grid grid-cols-5 text-[9px] font-black uppercase tracking-widest">
                                <div className="p-3 bg-stone-50 text-stone-500 border-r border-stone-100">Funcionalidad</div>
                                <div className="p-3 bg-stone-50 text-stone-700 text-center border-r border-stone-100">💌 Clásica</div>
                                <div className="p-3 bg-blue-50 text-blue-700 text-center border-r border-stone-100">✦ Pro</div>
                                <div className="p-3 bg-amber-50 text-amber-700 text-center border-r border-stone-100">♛ Premium</div>
                                <div className="p-3 bg-stone-900 text-white text-center">💎 Concierge</div>
                            </div>
                            {([
                                { label: 'Información del evento', clasico: true, pro: true, premium: true, concierge: true },
                                { label: 'Cuenta regresiva', clasico: true, pro: true, premium: true, concierge: true },
                                { label: 'Mapa / Ubicación', clasico: true, pro: true, premium: true, concierge: true },
                                { label: 'RSVP por WhatsApp', clasico: true, pro: true, premium: true, concierge: true },
                                { label: 'Código de vestimenta', clasico: false, pro: true, premium: true, concierge: true },
                                { label: 'QR de acceso digital', clasico: false, pro: true, premium: true, concierge: true },
                                { label: 'Itinerario del evento', clasico: false, pro: true, premium: true, concierge: true },
                                { label: 'Damas / Chambelanes', clasico: false, pro: true, premium: true, concierge: true },
                                { label: 'Mesa de regalos', clasico: false, pro: true, premium: true, concierge: true },
                                { label: 'Galería de fotos', clasico: false, pro: false, premium: true, concierge: true },
                                { label: 'Diseño Personalizado', clasico: false, pro: false, premium: true, concierge: true },
                                { label: 'Envío Profesional WA', clasico: false, pro: false, premium: false, concierge: true },
                                { label: 'Seguimiento Humano', clasico: false, pro: false, premium: false, concierge: true },
                            ]).map((row, i) => {
                                const activePlan = config.plan;
                                const rowEnabled = (row as any)[activePlan as string];
                                return (
                                    <div key={i} className={`grid grid-cols-5 text-[11px] border-t border-stone-100 transition-colors ${
                                        rowEnabled ? 'bg-white' : 'bg-stone-50/50'
                                    }`}>
                                        <div className={`p-3 border-r border-stone-100 font-medium ${
                                            rowEnabled ? 'text-stone-700' : 'text-stone-400'
                                        }`}>{row.label}</div>
                                        <div className="p-3 text-center border-r border-stone-100">{row.clasico ? '✓' : '—'}</div>
                                        <div className="p-3 text-center border-r border-stone-100">{row.pro ? '✓' : '—'}</div>
                                        <div className="p-3 text-center border-r border-stone-100">{row.premium ? '✓' : '—'}</div>
                                        <div className="p-3 text-center bg-stone-900/5">{row.concierge ? '✓' : '—'}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CollapsibleCard>

                {/* ── 2. Imagen Sensorial (Portada y Logo) ── */}
                <CollapsibleCard
                    id="imagery"
                    title="Imagen Sensorial"
                    subtitle="Multimedia y entorno visual de portada"
                    icon="🖼️"
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Column 1: Hero Image */}
                        <div className="space-y-8">
                            <div className="space-y-5">
                                <div className="flex items-center justify-between pl-1">
                                    <label className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-800">Imagen de Portada</label>
                                    <span className="text-[9px] text-[#BD7474] font-bold tracking-wider">1920x1080</span>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => {
                                        const f = e.target.files?.[0];
                                        if (f) handleImageUpload(f);
                                    }}
                                />
                                
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="group w-full flex flex-col items-center justify-center gap-4 py-8 rounded-[2rem] border-2 border-dashed border-stone-200 bg-stone-50/50 hover:bg-white hover:border-[#BD7474]/40 transition-all disabled:opacity-50"
                                >
                                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#BD7474] shadow-sm">
                                        {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[11px] font-black uppercase tracking-widest text-stone-800 mb-1">{uploading ? 'Subiendo...' : 'Subir Imagen'}</p>
                                    </div>
                                </button>

                                <div className={`w-full h-48 rounded-[2rem] border border-stone-100 flex items-center justify-center overflow-hidden relative shadow-sm ${config.heroImage ? 'bg-stone-900' : 'bg-stone-50/30'}`}>
                                    {config.heroImage ? (
                                        <>
                                            <img src={config.heroImage} className="w-full h-full object-cover opacity-80" alt="Preview Background" />
                                            <button
                                                onClick={() => setConfig(prev => ({ ...prev, heroImage: '' }))}
                                                className="absolute top-4 right-4 bg-white/10 hover:bg-red-500 backdrop-blur-md text-white rounded-full p-2 transition-all"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                            <ImageIcon className="h-10 w-10 text-stone-400" />
                                            <p className="text-sm font-serif italic text-stone-500">Sin imagen</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Logo/Deco */}
                        <div className="space-y-12">
                             <div className="space-y-6">
                                <label className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-800">Decoración Interna (Logo/Firma)</label>
                                <input
                                    type="url"
                                    placeholder="https://... o /botanical-peony.png"
                                    value={config.decorativeImage}
                                    onChange={(e) => setConfig({ ...config, decorativeImage: e.target.value })}
                                    className="w-full bg-[#FDFBF7] px-6 py-4 rounded-2xl border-none shadow-inner text-xs font-mono"
                                />

                                <div className={`w-full h-44 rounded-[2rem] border border-stone-100 flex items-center justify-center overflow-hidden relative shadow-sm ${config.decorativeImage ? 'bg-stone-50' : 'bg-stone-50/20'}`}>
                                    {config.decorativeImage ? (
                                        <>
                                            <img src={config.decorativeImage} className="w-full h-full object-contain p-6" alt="Preview Decorative" />
                                            <button
                                                onClick={() => setConfig(prev => ({ ...prev, decorativeImage: '' }))}
                                                className="absolute top-4 right-4 bg-white/60 hover:bg-red-500 text-stone-400 hover:text-white rounded-full p-2"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 opacity-20">
                                            <Flower2 className="h-8 w-8 text-stone-400" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CollapsibleCard>

                {/* ── 3. Tipografía ── */}
                <CollapsibleCard
                    id="typography"
                    title="Tipografía"
                    subtitle="Estilos de letra que definen el carácter del evento"
                    icon="🖋️"
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                >
                    <div className="grid sm:grid-cols-3 gap-4">
                        {(Object.entries(TYPOGRAPHY_PRESETS) as [keyof typeof TYPOGRAPHY_PRESETS, any][]).map(([key, preset]) => (
                            <button
                                key={key}
                                onClick={() => setConfig({ ...config, typographyPreset: key })}
                                className={`group relative p-6 rounded-2xl border-2 transition-all text-left overflow-hidden ${
                                    config.typographyPreset === key
                                        ? 'border-[#1B2E1D] bg-[#1B2E1D]/5'
                                        : 'border-stone-100 hover:border-stone-200 bg-[#FDFBF7]'
                                }`}
                            >
                                <div className="relative z-10">
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400 mb-4">{preset.label}</p>
                                    <div className="space-y-1 mb-6">
                                        <p style={{ fontFamily: preset.serif }} className="text-3xl leading-none text-[#1B2E1D]">{preset.preview}</p>
                                        <p style={{ fontFamily: preset.sans }} className="text-sm text-stone-500 font-medium">{preset.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                            config.typographyPreset === key ? 'border-[#1B2E1D] bg-[#1B2E1D]' : 'border-stone-200'
                                        }`}>
                                            {config.typographyPreset === key && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600">Seleccionar</span>
                                    </div>
                                </div>
                                <span className="absolute -right-4 -bottom-4 text-7xl font-serif opacity-[0.03] select-none group-hover:scale-110 transition-transform" style={{ fontFamily: preset.serif }}>Aa</span>
                            </button>
                        ))}
                    </div>
                </CollapsibleCard>

                {/* ── 4. Identidad Visual ── */}
                <CollapsibleCard
                    id="palette"
                    title="Identidad Visual"
                    subtitle="Colores maestros y atmósfera de la invitación"
                    icon="🎨"
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                >
                    <div className="space-y-12">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Hero text color */}
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">🖋 Texto en Portada</label>
                                <div className="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-2xl shadow-inner">
                                    <input
                                        type="color"
                                        value={config.heroTextColor}
                                        onChange={(e) => setConfig({ ...config, heroTextColor: e.target.value })}
                                        className="h-12 w-16 rounded-xl cursor-pointer bg-transparent border-0 p-0 flex-shrink-0"
                                    />
                                    <span className="font-mono text-xs text-stone-500 uppercase">{config.heroTextColor}</span>
                                </div>
                            </div>

                            {/* Accent color */}
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">✨ Acentos y Fechas</label>
                                <div className="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-2xl shadow-inner">
                                    <input
                                        type="color"
                                        value={config.accentColor}
                                        onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                                        className="h-12 w-16 rounded-xl cursor-pointer bg-transparent border-0 p-0 flex-shrink-0"
                                    />
                                    <span className="font-mono text-xs text-stone-500 uppercase">{config.accentColor}</span>
                                </div>
                            </div>

                            {/* Card background color */}
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">🪷 Tarjeta Decorativa</label>
                                <div className="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-2xl shadow-inner">
                                    <input
                                        type="color"
                                        value={config.cardBgColor}
                                        onChange={(e) => setConfig({ ...config, cardBgColor: e.target.value })}
                                        className="h-12 w-16 rounded-xl cursor-pointer bg-transparent border-0 p-0 flex-shrink-0"
                                    />
                                    <span className="font-mono text-xs text-stone-500 uppercase">{config.cardBgColor}</span>
                                </div>
                            </div>

                            {/* Button color */}
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">🔘 Botones de Acción</label>
                                <div className="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-2xl shadow-inner">
                                    <input
                                        type="color"
                                        value={config.buttonColor}
                                        onChange={(e) => setConfig({ ...config, buttonColor: e.target.value })}
                                        className="h-12 w-16 rounded-xl cursor-pointer bg-transparent border-0 p-0 flex-shrink-0"
                                    />
                                    <span className="font-mono text-xs text-stone-500 uppercase">{config.buttonColor}</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Background Color */}
                        <div className="space-y-5 pt-8 border-t border-stone-50">
                            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-800 pl-1">Fondo Portada (Back)</label>
                            <div className="flex items-center gap-6 p-6 bg-[#FDFBF7] rounded-[2.25rem] border border-stone-50">
                                <div className="h-20 w-20 rounded-[1.5rem] border-4 border-white shadow-xl overflow-hidden relative" style={{ backgroundColor: config.heroBgColor || '#1B2E1D' }}>
                                    <input
                                        type="color"
                                        value={config.heroBgColor || '#1B2E1D'}
                                        onChange={(e) => {
                                            const newColor = e.target.value;
                                            setConfig({ ...config, heroBgColor: newColor, hero_bg_color: newColor });
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-stone-400 leading-relaxed font-medium">Este tono define la elegancia de tu portada en las versiones <span className="text-accent font-bold">Pro</span> y <span className="text-accent font-bold">Premium</span>.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CollapsibleCard>

                {/* ── 5. Mensaje del Evento ── */}
                <CollapsibleCard
                    id="message"
                    title="Mensaje del Evento"
                    subtitle="Personaliza tus textos de bienvenida"
                    icon="✉️"
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                >
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-800">Subtítulo del Evento</label>
                            <input
                                type="text"
                                placeholder="Escribe un subtítulo elegante..."
                                value={config.welcomeSubtitle}
                                onChange={(e) => setConfig({ ...config, welcomeSubtitle: e.target.value })}
                                className="w-full bg-[#FDFBF7] px-8 py-6 rounded-2xl border-none shadow-inner text-stone-800 text-xl font-serif"
                            />
                        </div>
                        
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-800">Mensaje de Bienvenida</label>
                            <textarea
                                placeholder="Te invitamos a ser parte de este momento inolvidable..."
                                value={config.welcomeMessage}
                                onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                                rows={6}
                                className="w-full bg-[#FDFBF7] px-8 py-7 rounded-[2rem] border-none shadow-inner resize-none text-stone-600 font-serif italic text-lg leading-relaxed"
                            />
                        </div>
                    </div>
                </CollapsibleCard>

                {/* ── 6. Ceremonia y Logística ── */}
                <CollapsibleCard
                    id="logistics"
                    title="Ceremonia y Logística"
                    subtitle="Ubicación, horario y detalles del evento"
                    icon="⛪"
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                >
                    <div className="space-y-10">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 pl-1">Nombre del Lugar</label>
                                <input
                                    type="text"
                                    value={config.misa_name}
                                    onChange={(e) => setConfig({ ...config, misa_name: e.target.value })}
                                    className="w-full bg-[#FDFBF7] px-6 py-4 rounded-2xl border-none shadow-inner text-stone-800"
                                    placeholder="Ej. Parroquia de San Juan"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 pl-1">Código de Vestimenta</label>
                                <input
                                    type="text"
                                    value={config.dress_code}
                                    onChange={(e) => setConfig({ ...config, dress_code: e.target.value })}
                                    className="w-full bg-[#FDFBF7] px-6 py-4 rounded-2xl border-none shadow-inner text-stone-800"
                                    placeholder="Ej. Formal, Cocktail..."
                                />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 pl-1">Enlace a Google Maps</label>
                                <input
                                    type="url"
                                    value={config.misa_maps_link}
                                    onChange={(e) => setConfig({ ...config, misa_maps_link: e.target.value })}
                                    className="w-full bg-[#FDFBF7] px-6 py-4 rounded-2xl border-none shadow-inner text-xs font-mono text-stone-500"
                                    placeholder="https://goo.gl/maps/..."
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 pl-1">Fecha Límite Confirmación</label>
                                <input
                                    type="date"
                                    value={config.rsvp_deadline}
                                    onChange={(e) => setConfig({ ...config, rsvp_deadline: e.target.value })}
                                    className="w-full bg-[#FDFBF7] px-6 py-4 rounded-2xl border-none shadow-inner text-stone-800"
                                />
                            </div>
                        </div>
                    </div>
                </CollapsibleCard>

                {/* ── 7. Activador de Módulos ── */}
                <CollapsibleCard
                    id="modules"
                    title="Activador de Módulos"
                    subtitle="Activa o desactiva secciones de tu invitación"
                    icon="🧩"
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                >
                    <div className="space-y-10">
                        {([
                            {
                                group: 'INVITACIÓN',
                                icon: '🖼️',
                                color: 'text-indigo-600 bg-indigo-50',
                                features: [
                                    { id: 'showGallery',   label: 'Galería de Fotos', desc: 'Slideshow de fotos del evento',   icon: '📸', plans: ['pro', 'premium'] },
                                    { id: 'showEnvelope',  label: 'Sobre de Bienvenida', desc: 'Animación de apertura',          icon: '💌', plans: ['pro', 'premium'] },
                                    { id: 'showMessage',   label: 'Mensaje de Bienvenida', desc: 'Texto de bienvenida',             icon: '✉️', plans: ['clasico', 'pro', 'premium'] },
                                ],
                            },
                            {
                                group: 'EVENTO',
                                icon: '📅',
                                color: 'text-rose-500 bg-rose-50',
                                features: [
                                    { id: 'showMap',         label: 'Mapa y Ubicación', desc: 'Enlace a Google Maps',          icon: '📍', plans: ['clasico', 'pro', 'premium'] },
                                    { id: 'showItinerary',   label: 'Itinerario del Evento', desc: 'Programa del día',               icon: '🗓️', plans: ['pro', 'premium'] },
                                    { id: 'showDetails',     label: 'Código de Vestimenta', desc: 'Dress Code sugerido',          icon: '✨', plans: ['pro', 'premium'] },
                                    { id: 'showChambelanes', label: 'Corte de Honor', desc: 'Damas y chambelanes',           icon: '👑', plans: ['pro', 'premium'] },
                                ],
                            },
                            {
                                group: 'INVITADOS',
                                icon: '👥',
                                color: 'text-emerald-600 bg-emerald-50',
                                features: [
                                    { id: 'showWhatsAppRSVP',      label: 'Confirmación (WhatsApp)', desc: 'Botón de confirmar asistencia', icon: '💬', plans: ['clasico', 'pro', 'premium'] },
                                    { id: 'enableGuestList',       label: 'Lista de Invitados', desc: 'Dashboard de asistentes',     icon: '📋', plans: ['pro', 'premium'] },
                                    { id: 'enableQr',              label: 'Pases QR',           desc: 'Acceso digital por QR',       icon: '📱', plans: ['pro', 'premium'] },
                                    { id: 'enableAccessControl',   label: 'Control de Acceso',  desc: 'Check-in en tiempo real',     icon: '🛡️', plans: ['pro', 'premium'] },
                                    { id: 'enableTableManagement', label: 'Gestión de Mesas',   desc: 'Asigna lugares a invitados',  icon: '🍽️', plans: ['pro', 'premium'] },
                                ],
                            },
                            {
                                group: 'EXTRAS',
                                icon: '⭐',
                                color: 'text-amber-600 bg-amber-50',
                                features: [
                                    { id: 'showGifts',         label: 'Mesa de Regalos', desc: 'Links y opciones de regalo',    icon: '🎁', plans: ['pro', 'premium'] },
                                    { id: 'showCountdown',     label: 'Cuenta Regresiva',desc: 'Contador hasta el evento',      icon: '⏳', plans: ['clasico', 'pro', 'premium'] },
                                    { id: 'enableMetrics',     label: 'Métricas',        desc: 'Estadísticas de visualización', icon: '📊', plans: ['pro', 'premium'] },
                                    { id: 'enableCustomDomain',label: 'Dominio Propio',  desc: 'URL personalizada',             icon: '🌐', plans: ['pro', 'premium'] },
                                    { id: 'enableAi',          label: 'Asistente IA',    desc: 'Generación de textos con IA',   icon: '🤖', plans: ['pro', 'premium'] },
                                ],
                            },
                        ] as const).map((module) => (
                            <div key={module.group} className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-sm ${module.color}`}>
                                        {module.icon}
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500">{module.group}</span>
                                    <div className="flex-1 h-px bg-stone-100" />
                                </div>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {(module.features as readonly { id: string; label: string; desc: string; icon: string; plans: readonly string[] }[]).map((feat) => {
                                        const planCode = currentPlan?.code?.toLowerCase() || 'clasico';
                                        const isLocked = !feat.plans.includes(planCode);
                                        const isEnabled = !isLocked && !!config[feat.id as keyof DesignConfig];
                                        const minPlan = feat.plans[0];
                                        const planLabel: Record<string, string> = { pro: 'Pro', premium: 'Premium' };

                                        return (
                                            <button
                                                key={feat.id}
                                                onClick={() => {
                                                    if (isLocked) {
                                                        toast.error(`Esta función requiere plan ${planLabel[minPlan] || minPlan}`);
                                                        return;
                                                    }
                                                    setConfig({ ...config, [feat.id]: !isEnabled });
                                                }}
                                                className={`relative p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                                                    isLocked
                                                        ? 'border-stone-100 bg-stone-50 opacity-55 cursor-not-allowed'
                                                        : isEnabled
                                                            ? 'border-[#1B2E1D] bg-[#1B2E1D]/5 cursor-pointer'
                                                            : 'border-stone-100 bg-[#FDFBF7] cursor-pointer hover:border-stone-200'
                                                }`}
                                            >
                                                <span className="text-lg flex-shrink-0">{feat.icon}</span>
                                                <div className="flex-1 min-w-0 text-left">
                                                    <p className={`text-[11px] font-bold uppercase tracking-wide truncate ${
                                                        isLocked ? 'text-stone-400' : 'text-stone-800'
                                                    }`}>{feat.label}</p>
                                                    <p className="text-[10px] text-stone-400 truncate">{feat.desc}</p>
                                                </div>
                                                {isLocked ? (
                                                    <span className="text-[9px] font-black uppercase tracking-widest bg-stone-200 text-stone-400 px-1.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
                                                        {planLabel[minPlan] || minPlan}
                                                    </span>
                                                ) : (
                                                    <div className={`h-5 w-9 rounded-full relative transition-colors flex-shrink-0 ${
                                                        isEnabled ? 'bg-[#1B2E1D]' : 'bg-stone-200'
                                                    }`}>
                                                        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                                                            isEnabled ? 'left-[18px]' : 'left-0.5'
                                                        }`} />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </CollapsibleCard>

                {/* ── 8. Itinerario ── */}
                {(currentPlan?.code === 'pro' || currentPlan?.code === 'premium') && (
                    <CollapsibleCard
                        id="itinerary"
                        title="Itinerario"
                        subtitle="Programa detallado del día del evento"
                        icon="🗓️"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Eventos</label>
                                <button
                                    onClick={() => {
                                        const newItem = { id: Date.now().toString(), time: '16:00', title: 'Nuevo Evento', icon: 'heart' };
                                        setConfig({ ...config, itinerary: [...(config.itinerary || []), newItem] });
                                    }}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                                >
                                    <Plus className="h-3 w-3" /> Añadir Evento
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {config.itinerary.map((item, idx) => (
                                    <div key={item.id || idx} className="flex flex-col sm:flex-row gap-4 p-4 bg-[#FDFBF7] rounded-2xl items-start sm:items-center relative border border-stone-100">
                                        <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-400 flex-shrink-0 relative border border-stone-100">
                                            <select 
                                                value={item.icon}
                                                onChange={(e) => {
                                                    const newItin = [...config.itinerary];
                                                    newItin[idx].icon = e.target.value;
                                                    setConfig({ ...config, itinerary: newItin });
                                                }}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            >
                                                <option value="heart">Corazón / Ceremonia</option>
                                                <option value="wine">Copas / Brindis</option>
                                                <option value="utensils">Cubiertos / Cena</option>
                                                <option value="music">Música / Baile</option>
                                                <option value="party">Fiesta</option>
                                                <option value="moon">Luna / Fin</option>
                                                <option value="clock">Reloj</option>
                                            </select>
                                            {item.icon === 'heart' && <Heart className="h-6 w-6" />}
                                            {item.icon === 'wine' && <Wine className="h-6 w-6" />}
                                            {item.icon === 'utensils' && <Utensils className="h-6 w-6" />}
                                            {item.icon === 'music' && <Music className="h-6 w-6" />}
                                            {item.icon === 'party' && <PartyPopper className="h-6 w-6" />}
                                            {item.icon === 'moon' && <Moon className="h-6 w-6" />}
                                            {item.icon === 'clock' && <Clock className="h-6 w-6" />}
                                        </div>
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="time"
                                                value={item.time}
                                                onChange={(e) => {
                                                    const newItin = [...config.itinerary];
                                                    newItin[idx].time = e.target.value;
                                                    setConfig({ ...config, itinerary: newItin });
                                                }}
                                                className="w-32 bg-white px-4 py-2 rounded-xl border border-stone-100 text-xs font-mono"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Ej. Ceremonia"
                                                value={item.title}
                                                onChange={(e) => {
                                                    const newItin = [...config.itinerary];
                                                    newItin[idx].title = e.target.value;
                                                    setConfig({ ...config, itinerary: newItin });
                                                }}
                                                className="w-full bg-white px-4 py-2 rounded-xl border border-stone-100 text-xs"
                                            />
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const newItin = config.itinerary.filter((_, i) => i !== idx);
                                                setConfig({ ...config, itinerary: newItin });
                                            }}
                                            className="p-2 text-stone-300 hover:text-rose-500 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CollapsibleCard>
                )}

                {/* ── 9. Corte de Honor (Damas/Chambelanes) ── */}
                {(currentPlan?.code === 'pro' || currentPlan?.code === 'premium') && (
                    <CollapsibleCard
                        id="honor"
                        title="Corte de Honor"
                        subtitle="Personaliza tu lista de Chambelanes y Damas"
                        icon="👑"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] uppercase font-bold tracking-widest text-[#1B2E1D]">Chambelanes ({config.chambelanes?.length || 0})</h3>
                                    <button
                                        onClick={() => setConfig({ ...config, chambelanes: [...(config.chambelanes || []), ''] })}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                                    >
                                        <Plus className="h-3 w-3" /> Añadir
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {config.chambelanes.map((name, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => {
                                                    const newArr = [...config.chambelanes];
                                                    newArr[idx] = e.target.value;
                                                    setConfig({ ...config, chambelanes: newArr });
                                                }}
                                                placeholder="Nombre"
                                                className="w-full bg-[#FDFBF7] px-4 py-2 rounded-xl border border-stone-100 text-xs"
                                            />
                                            <button 
                                                onClick={() => setConfig({ ...config, chambelanes: config.chambelanes.filter((_, i) => i !== idx) })}
                                                className="p-2 text-stone-300 hover:text-rose-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] uppercase font-bold tracking-widest text-[#1B2E1D]">Damas ({config.damas?.length || 0})</h3>
                                    <button
                                        onClick={() => setConfig({ ...config, damas: [...(config.damas || []), ''] })}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                                    >
                                        <Plus className="h-3 w-3" /> Añadir
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {config.damas.map((name, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => {
                                                    const newArr = [...config.damas];
                                                    newArr[idx] = e.target.value;
                                                    setConfig({ ...config, damas: newArr });
                                                }}
                                                placeholder="Nombre"
                                                className="w-full bg-[#FDFBF7] px-4 py-2 rounded-xl border border-stone-100 text-xs"
                                            />
                                            <button 
                                                onClick={() => setConfig({ ...config, damas: config.damas.filter((_, i) => i !== idx) })}
                                                className="p-2 text-stone-300 hover:text-rose-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CollapsibleCard>
                )}

                {/* ── 10. Mesa de Regalos ── */}
                {(currentPlan?.code === 'pro' || currentPlan?.code === 'premium') && (
                    <CollapsibleCard
                        id="gifts"
                        title="Mesa de Regalos"
                        subtitle="Links y opciones para el obsequio de tus invitados"
                        icon="🎁"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] uppercase font-bold tracking-widest text-[#1B2E1D]">Tiendas ({config.registryItems?.length || 0})</h3>
                                <button
                                    onClick={() => setConfig({ ...config, registryItems: [...(config.registryItems || []), { store: '', link: '', description: '' }] })}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors"
                                >
                                    <Plus className="h-3 w-3" /> Añadir Tienda
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {config.registryItems.map((item, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 bg-[#FDFBF7] rounded-2xl items-start sm:items-center relative">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-400 flex-shrink-0">
                                            <Gift className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 space-y-2 w-full">
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Tienda"
                                                    value={item.store}
                                                    onChange={(e) => {
                                                        const newItems = [...config.registryItems];
                                                        newItems[idx].store = e.target.value;
                                                        setConfig({ ...config, registryItems: newItems });
                                                    }}
                                                    className="w-full bg-white px-4 py-2 rounded-xl border border-stone-100 text-xs"
                                                />
                                                <input
                                                    type="url"
                                                    placeholder="Enlace"
                                                    value={item.link}
                                                    onChange={(e) => {
                                                        const newItems = [...config.registryItems];
                                                        newItems[idx].link = e.target.value;
                                                        setConfig({ ...config, registryItems: newItems });
                                                    }}
                                                    className="w-full bg-white px-4 py-2 rounded-xl border border-stone-100 text-xs"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Mensaje adicional"
                                                value={item.description || ''}
                                                onChange={(e) => {
                                                    const newItems = [...config.registryItems];
                                                    newItems[idx].description = e.target.value;
                                                    setConfig({ ...config, registryItems: newItems });
                                                }}
                                                className="w-full bg-white px-4 py-2 rounded-xl border border-stone-100 text-xs"
                                            />
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const newItems = config.registryItems.filter((_, i) => i !== idx);
                                                setConfig({ ...config, registryItems: newItems });
                                            }}
                                            className="p-2 text-stone-300 hover:text-rose-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CollapsibleCard>
                )}

                {/* ── 11. Galería de Fotos ── */}
                {currentPlan?.code === 'premium' && (
                    <CollapsibleCard
                        id="gallery"
                        title="Galería de Fotos"
                        subtitle="Añade imágenes para mostrar en el carrusel principal"
                        icon="📸"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] uppercase font-bold tracking-widest text-[#1B2E1D]">Fotos ({config.galleryImages?.length || 0})</h3>
                                <button
                                    onClick={() => setConfig({ ...config, galleryImages: [...(config.galleryImages || []), { url: '', caption: '' }] })}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-[#1B2E1D]/5 text-[#1B2E1D] rounded-lg text-xs font-bold hover:bg-[#1B2E1D]/10 transition-colors"
                                >
                                    <Plus className="h-3 w-3" /> Añadir Foto
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {config.galleryImages.map((img, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 bg-[#FDFBF7] rounded-2xl items-start sm:items-center relative">
                                        {img.url ? (
                                            <img src={img.url} alt={`Preview ${idx}`} className="w-16 h-16 object-cover rounded-xl shadow-sm flex-shrink-0" />
                                        ) : (
                                            <div className="w-16 h-16 bg-stone-100 rounded-xl flex-shrink-0 flex items-center justify-center text-stone-300">
                                                <ImageIcon className="h-6 w-6" />
                                            </div>
                                        )}
                                        <div className="flex-1 space-y-2 w-full">
                                            <input
                                                type="url"
                                                placeholder="URL de la imagen"
                                                value={img.url}
                                                onChange={(e) => {
                                                    const newImages = [...config.galleryImages];
                                                    newImages[idx].url = e.target.value;
                                                    setConfig({ ...config, galleryImages: newImages });
                                                }}
                                                className="w-full bg-white px-4 py-2 rounded-xl border border-stone-100 text-xs"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Pie de foto"
                                                value={img.caption || ''}
                                                onChange={(e) => {
                                                    const newImages = [...config.galleryImages];
                                                    newImages[idx].caption = e.target.value;
                                                    setConfig({ ...config, galleryImages: newImages });
                                                }}
                                                className="w-full bg-white px-4 py-2 rounded-xl border border-stone-100 text-xs"
                                            />
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const newImages = config.galleryImages.filter((_, i) => i !== idx);
                                                setConfig({ ...config, galleryImages: newImages });
                                            }}
                                            className="p-2 text-stone-300 hover:text-rose-500 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CollapsibleCard>
                )}

                {/* ── 12. Hoteles y Hospedaje ── */}
                {currentPlan?.code === 'premium' && (
                    <CollapsibleCard
                        id="hotels"
                        title="Hoteles y Hospedaje"
                        subtitle="Recomendaciones para tus invitados foráneos"
                        icon="🏨"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] uppercase font-bold tracking-widest text-[#1B2E1D]">Lista ({config.hotels?.length || 0})</h3>
                                <button
                                    onClick={() => setConfig({ ...config, hotels: [...(config.hotels || []), { name: '', distance: '', description: '', price: '', link: '', isRecommended: false }] })}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                                >
                                    <Plus className="h-3 w-3" /> Añadir Hotel
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6">
                                {config.hotels.map((hotel, idx) => (
                                    <div key={idx} className="group p-6 bg-[#FDFBF7] rounded-[2rem] border border-stone-100 hover:border-blue-200 transition-all relative">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] uppercase font-black tracking-widest text-stone-400">Nombre del Hotel</label>
                                                    <input
                                                        type="text"
                                                        value={hotel.name}
                                                        onChange={(e) => {
                                                            const newHotels = [...config.hotels];
                                                            newHotels[idx].name = e.target.value;
                                                            setConfig({ ...config, hotels: newHotels });
                                                        }}
                                                        className="w-full bg-white px-5 py-3 rounded-xl border border-stone-50 text-sm font-medium"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] uppercase font-black tracking-widest text-stone-400">Distancia</label>
                                                        <input
                                                            type="text"
                                                            value={hotel.distance}
                                                            onChange={(e) => {
                                                                const newHotels = [...config.hotels];
                                                                newHotels[idx].distance = e.target.value;
                                                                setConfig({ ...config, hotels: newHotels });
                                                            }}
                                                            className="w-full bg-white px-4 py-3 rounded-xl border border-stone-50 text-xs"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] uppercase font-black tracking-widest text-stone-400">Tarifa</label>
                                                        <input
                                                            type="text"
                                                            value={hotel.price}
                                                            onChange={(e) => {
                                                                const newHotels = [...config.hotels];
                                                                newHotels[idx].price = e.target.value;
                                                                setConfig({ ...config, hotels: newHotels });
                                                            }}
                                                            className="w-full bg-white px-4 py-3 rounded-xl border border-stone-50 text-xs"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] uppercase font-black tracking-widest text-stone-400">Descripción</label>
                                                    <textarea
                                                        value={hotel.description}
                                                        onChange={(e) => {
                                                            const newHotels = [...config.hotels];
                                                            newHotels[idx].description = e.target.value;
                                                            setConfig({ ...config, hotels: newHotels });
                                                        }}
                                                        rows={2}
                                                        className="w-full bg-white px-5 py-3 rounded-xl border border-stone-50 text-xs resize-none"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1 space-y-1">
                                                        <label className="text-[9px] uppercase font-black tracking-widest text-stone-400">Link</label>
                                                        <input
                                                            type="url"
                                                            value={hotel.link}
                                                            onChange={(e) => {
                                                                const newHotels = [...config.hotels];
                                                                newHotels[idx].link = e.target.value;
                                                                setConfig({ ...config, hotels: newHotels });
                                                            }}
                                                            className="w-full bg-white px-5 py-3 rounded-xl border border-stone-50 text-[10px] font-mono text-blue-500"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const newHotels = [...config.hotels];
                                                            newHotels[idx].isRecommended = !newHotels[idx].isRecommended;
                                                            setConfig({ ...config, hotels: newHotels });
                                                        }}
                                                        className={`p-3 rounded-xl border transition-all ${hotel.isRecommended ? 'bg-amber-50 border-amber-200 text-amber-500' : 'bg-white border-stone-100 text-stone-300'}`}
                                                    >
                                                        <Sparkles className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const newHotels = config.hotels.filter((_, i) => i !== idx);
                                                setConfig({ ...config, hotels: newHotels });
                                            }}
                                            className="absolute -top-3 -right-3 h-8 w-8 bg-white text-stone-300 hover:text-rose-50 rounded-full border border-stone-100 flex items-center justify-center transition-all hover:scale-110"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CollapsibleCard>
                )}
                {/* ── 5. Estilos Expertos (CSS) ── */}
                {config.plan === 'concierge' && (
                    <CollapsibleCard
                        id="expert"
                        title="Estilos Expertos"
                        subtitle="Inyección de CSS para Diseño Pro y Concierge"
                        icon="⚡"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="space-y-6">
                            <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
                                <Shield className="h-6 w-6 text-amber-600 mt-1" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-800">Uso Avanzado</p>
                                    <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                        Este campo permite inyectar estilos CSS directamente en la invitación. Usa selectores específicos como <code>.invitation-content</code> para evitar conflictos. Los cambios se reflejan en la Vista Previa.
                                    </p>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#BD7474]/20 to-[#1B2E1D]/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition-all" />
                                <textarea
                                    value={config.customCss}
                                    onChange={(e) => setConfig({ ...config, customCss: e.target.value })}
                                    placeholder="/* Ejemplo: .invitation-content h1 { color: gold; } */"
                                    className="relative w-full h-64 bg-[#1B2E1D] text-emerald-400 p-8 rounded-[2rem] font-mono text-xs leading-relaxed focus:ring-2 focus:ring-[#BD7474] border-none shadow-2xl selection:bg-[#BD7474]/40"
                                />
                            </div>

                            <p className="text-[9px] text-stone-400 text-center uppercase tracking-widest font-bold">
                                Cualquier error en el CSS puede afectar la visualización de la invitación.
                            </p>
                        </div>
                    </CollapsibleCard>
                )}

            {/* Live Preview Button */}
            <div className="flex justify-center pt-8 border-t border-stone-200">
                <Link to={`/preview/${id}`} target="_blank" className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#BD7474] hover:text-[#1B2E1D] transition-colors border-b border-[#BD7474]/30 pb-1">
                    Ver Plantilla de Ejemplo Completa →
                </Link>
            </div>
        </div>
    </div>
    );
}
