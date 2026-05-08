import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Loader2, Save, ArrowLeft, ArrowRight, Image as ImageIcon, Trash2, Plus, Gift, Clock, Heart, Music, PartyPopper, Wine, Utensils, Moon, Eye, Sparkles, Shield, ChevronDown, Upload, X, Flower2 } from 'lucide-react';
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
        <div className={`bg-white rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${isOpen ? 'border-stone-200 shadow-xl' : 'border-stone-100 shadow-sm hover:shadow-md'}`}>
            <div onClick={() => setActiveSection(isOpen ? null : id)} className="p-6 md:p-10 flex items-center justify-between cursor-pointer hover:bg-stone-50/30 transition-colors">
                <div className="flex items-center gap-4 md:gap-5">
                    <div className={`h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl transition-all ${isOpen ? 'bg-[#1B2E1D] text-white scale-105 md:scale-110' : 'bg-stone-50 text-stone-400'}`}>{icon}</div>
                    <div>
                        <h2 className={`text-xl md:text-2xl font-serif ${isOpen ? 'text-[#1B2E1D]' : 'text-stone-700'}`}>{title}</h2>
                        <p className="text-[8px] md:text-[10px] text-stone-400 uppercase tracking-widest font-black mt-0.5 md:mt-1">{subtitle}</p>
                    </div>
                </div>
                <div className={`h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center border border-stone-100 text-stone-300 transition-all ${isOpen ? 'rotate-180 bg-[#1B2E1D]/5 text-[#1B2E1D]' : ''}`}><ChevronDown className="h-4 w-4 md:h-5 md:w-5" /></div>
            </div>
            <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <div className="p-6 md:p-12 pt-2 md:pt-4 border-t border-stone-50">{children}</div>
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
        <div className="max-w-5xl mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-500 py-6 md:py-10 px-4 md:px-6">
            <style>{liveStyles}</style>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Link to={`/dashboard/event/${id}`} className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-600 mb-4 md:mb-6 transition-colors font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
                        <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" /> Volver al panel
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-serif text-[#1B2E1D] tracking-tight">Diseño y Estilo</h1>
                    <p className="text-xs md:text-sm font-light italic text-stone-500 mt-2">Personaliza la estética y funciones de tu invitación.</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                    {event?.slug && (
                        <a
                            href={`/i/${event.slug}?t=admin`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-white border-2 border-[#1B2E1D] text-[#1B2E1D] rounded-xl md:rounded-2xl hover:bg-stone-50 transition-all text-[10px] md:text-[11px] font-bold uppercase tracking-widest"
                        >
                            <Eye className="h-4 w-4 md:h-5 md:w-5" />
                            <span className="hidden sm:inline">Vista Previa</span>
                            <span className="sm:hidden">Ver</span>
                        </a>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-[#1B2E1D] text-white rounded-xl md:rounded-2xl shadow-xl hover:bg-[#2D312E] transition-all text-[10px] md:text-[11px] font-bold uppercase tracking-widest disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" /> : <Save className="h-4 w-4 md:h-5 md:w-5" />}
                        {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* ── 1. Plan de la Invitación ── */}
                <CollapsibleCard
                    id="matrix"
                    title="Plan de la Invitación"
                    subtitle="Selecciona el nivel de tu evento"
                    icon="⭐"
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                >
                    <div className="space-y-8 md:space-y-12">
                        {/* Plan Buttons */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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
                                        className={`relative flex flex-col items-center text-center gap-2 py-4 md:py-6 px-3 md:px-4 rounded-2xl border-2 transition-all duration-300 ${
                                            isActive ? `${tier.active} text-white shadow-lg scale-[1.02]` : 
                                            isLocked ? 'border-dashed border-stone-100 bg-stone-50/30 opacity-40 grayscale' :
                                            `${tier.color} text-stone-700`
                                        }`}
                                    >
                                        <span className="text-xl md:text-3xl">{tier.icon}</span>
                                        <span className="font-black text-[9px] md:text-xs uppercase tracking-widest">{tier.label}</span>
                                        {isActive && (
                                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white text-[#1B2E1D] px-2 py-0.5 rounded-full border border-stone-200 shadow-sm flex items-center gap-1">
                                                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[7px] font-black uppercase tracking-widest">Activo</span>
                                            </div>
                                        )}
                                        {isLocked && !isActive && (
                                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[7px] font-bold uppercase tracking-widest bg-stone-100 text-stone-400 px-2 py-0.5 rounded-full border border-stone-200 whitespace-nowrap">
                                                Upgrade
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Feature Matrix - Responsive Scrollable Container */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-stone-400">Comparativa de Funciones</h3>
                                <div className="flex md:hidden items-center gap-1.5 text-stone-300">
                                    <span className="text-[8px] uppercase font-bold">Desliza</span>
                                    <ArrowRight className="h-3 w-3 animate-bounce-x" />
                                </div>
                            </div>
                            <div className="rounded-[1.5rem] md:rounded-[2rem] border border-stone-100 overflow-hidden bg-white shadow-sm overflow-x-auto no-scrollbar">
                                <div className="min-w-[600px]">
                                    <div className="grid grid-cols-5 text-[7px] md:text-[9px] font-black uppercase tracking-widest bg-stone-50/50">
                                        <div className="p-2 md:p-4 text-stone-400 border-r border-stone-100/50">Funciones</div>
                                        <div className="p-2 md:p-4 text-stone-700 text-center border-r border-stone-100/50">💌</div>
                                        <div className="p-2 md:p-4 text-blue-700 text-center border-r border-stone-100/50">✦</div>
                                        <div className="p-2 md:p-4 text-amber-700 text-center border-r border-stone-100/50">♛</div>
                                        <div className="p-2 md:p-4 bg-[#1B2E1D] text-white text-center">💎</div>
                                    </div>
                                    {([
                                        { label: 'Información del evento', clasico: true, pro: true, premium: true, concierge: true },
                                        { label: 'Cuenta regresiva', clasico: true, pro: true, premium: true, concierge: true },
                                        { label: 'Mapa / Ubicación', clasico: true, pro: true, premium: true, concierge: true },
                                        { label: 'RSVP por WhatsApp', clasico: true, pro: true, premium: true, concierge: true },
                                        { label: 'Código de vestimenta', clasico: false, pro: true, premium: true, concierge: true },
                                        { label: 'QR de acceso digital', clasico: false, pro: true, premium: true, concierge: true },
                                        { label: 'Itinerario del evento', clasico: false, pro: true, premium: true, concierge: true },
                                        { label: 'Mesa de regalos', clasico: false, pro: true, premium: true, concierge: true },
                                        { label: 'Galería de fotos', clasico: false, pro: false, premium: true, concierge: true },
                                        { label: 'Diseño Personalizado', clasico: false, pro: false, premium: true, concierge: true },
                                        { label: 'Envío Profesional WA', clasico: false, pro: false, premium: false, concierge: true },
                                        { label: 'Seguimiento Humano', clasico: false, pro: false, premium: false, concierge: true },
                                    ]).map((row, i) => {
                                        const activePlan = config.plan;
                                        const rowEnabled = (row as any)[activePlan as string];
                                        return (
                                            <div key={i} className={`grid grid-cols-5 text-[10px] md:text-[11px] border-t border-stone-100/50 transition-colors ${
                                                rowEnabled ? 'bg-white' : 'bg-stone-50/30'
                                            }`}>
                                                <div className={`p-3 md:p-4 border-r border-stone-100/50 font-medium ${
                                                    rowEnabled ? 'text-stone-700' : 'text-stone-400'
                                                }`}>{row.label}</div>
                                                <div className="p-3 md:p-4 text-center border-r border-stone-100/50">{row.clasico ? '✓' : '—'}</div>
                                                <div className="p-3 md:p-4 text-center border-r border-stone-100/50">{row.pro ? '✓' : '—'}</div>
                                                <div className="p-3 md:p-4 text-center border-r border-stone-100/50">{row.premium ? '✓' : '—'}</div>
                                                <div className="p-3 md:p-4 text-center bg-stone-900/5">{row.concierge ? '✓' : '—'}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </CollapsibleCard>

                {/* ── 2. Imagen Sensorial (Portada y Logo) ── */}
                <CollapsibleCard
                    id="imagery"
                    title="Imagen Sensorial"
                    subtitle="Multimedia y entorno visual"
                    icon="🖼️"
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                        {/* Column 1: Hero Image */}
                        <div className="space-y-6 md:space-y-8">
                            <div className="space-y-4 md:space-y-5">
                                <div className="flex items-center justify-between pl-1">
                                    <label className="text-[10px] md:text-[11px] uppercase font-black tracking-[0.2em] text-stone-800">Imagen de Portada</label>
                                    <span className="text-[8px] md:text-[9px] text-[#BD7474] font-bold tracking-wider">1920x1080</span>
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
                                    className="group w-full flex flex-col items-center justify-center gap-4 py-6 md:py-10 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-dashed border-stone-100 bg-stone-50/30 hover:bg-white hover:border-[#BD7474]/30 transition-all disabled:opacity-50"
                                >
                                    <div className="h-10 w-10 md:h-12 md:w-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-[#BD7474] shadow-sm group-hover:scale-110 transition-transform">
                                        {uploading ? <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin" /> : <Upload className="h-5 w-5 md:h-6 md:w-6" />}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-stone-800 mb-1">{uploading ? 'Subiendo...' : 'Subir Imagen'}</p>
                                        <p className="text-[8px] md:text-[9px] text-stone-400 font-medium">PNG, JPG hasta 5MB</p>
                                    </div>
                                </button>

                                <div className={`w-full h-40 md:h-56 rounded-[1.5rem] md:rounded-[2.5rem] border border-stone-100 flex items-center justify-center overflow-hidden relative shadow-inner ${config.heroImage ? 'bg-stone-900' : 'bg-stone-50/20'}`}>
                                    {config.heroImage ? (
                                        <>
                                            <img src={config.heroImage} className="w-full h-full object-cover opacity-80" alt="Preview Background" />
                                            <button
                                                onClick={() => setConfig(prev => ({ ...prev, heroImage: '' }))}
                                                className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/10 hover:bg-rose-500 backdrop-blur-md text-white rounded-full p-2 transition-all"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                            <ImageIcon className="h-8 w-8 md:h-10 md:w-10 text-stone-400" />
                                            <p className="text-[10px] font-serif italic text-stone-500">Sin imagen seleccionada</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Logo/Deco */}
                        <div className="space-y-6 md:space-y-8">
                             <div className="space-y-4 md:space-y-6">
                                <label className="text-[10px] md:text-[11px] uppercase font-black tracking-[0.2em] text-stone-800">Logo o Firma Digital</label>
                                <input
                                    type="url"
                                    placeholder="https://... o pega el enlace aquí"
                                    value={config.decorativeImage}
                                    onChange={(e) => setConfig({ ...config, decorativeImage: e.target.value })}
                                    className="w-full bg-stone-50/50 px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-none shadow-inner text-[10px] md:text-xs font-mono outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all"
                                />

                                <div className={`w-full h-40 md:h-56 rounded-[1.5rem] md:rounded-[2.5rem] border border-stone-100 flex items-center justify-center overflow-hidden relative shadow-inner ${config.decorativeImage ? 'bg-white' : 'bg-stone-50/10'}`}>
                                    {config.decorativeImage ? (
                                        <>
                                            <img src={config.decorativeImage} className="w-full h-full object-contain p-6 md:p-10" alt="Preview Decorative" />
                                            <button
                                                onClick={() => setConfig(prev => ({ ...prev, decorativeImage: '' }))}
                                                className="absolute top-3 right-3 md:top-4 md:right-4 bg-stone-100 hover:bg-rose-500 text-stone-400 hover:text-white rounded-full p-2 transition-all"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 opacity-10">
                                            <Flower2 className="h-8 w-8 md:h-10 md:w-10 text-stone-400" />
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
                    subtitle="El carácter de tu evento"
                    icon="🖋️"
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                        {(Object.entries(TYPOGRAPHY_PRESETS) as [keyof typeof TYPOGRAPHY_PRESETS, any][]).map(([key, preset]) => (
                            <button
                                key={key}
                                onClick={() => setConfig({ ...config, typographyPreset: key })}
                                className={`group relative p-5 md:p-8 rounded-2xl md:rounded-[2rem] border-2 transition-all text-left overflow-hidden ${
                                    config.typographyPreset === key
                                        ? 'border-[#1B2E1D] bg-[#1B2E1D]/5'
                                        : 'border-stone-50 hover:border-stone-200 bg-stone-50/20'
                                }`}
                            >
                                <div className="relative z-10">
                                    <p className={`text-[8px] md:text-[9px] uppercase font-black tracking-[0.2em] mb-4 md:mb-6 ${config.typographyPreset === key ? 'text-[#1B2E1D]' : 'text-stone-300'}`}>{preset.label}</p>
                                    <div className="space-y-1 md:space-y-2 mb-6 md:mb-8">
                                        <p style={{ fontFamily: preset.serif }} className="text-2xl md:text-4xl leading-none text-[#1B2E1D]">{preset.preview}</p>
                                        <p style={{ fontFamily: preset.sans }} className="text-[10px] md:text-xs text-stone-400 font-light leading-relaxed">{preset.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`h-4 w-4 md:h-5 md:w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                            config.typographyPreset === key ? 'border-[#1B2E1D] bg-[#1B2E1D] scale-110' : 'border-stone-200'
                                        }`}>
                                            {config.typographyPreset === key && <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-white" />}
                                        </div>
                                        <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${config.typographyPreset === key ? 'text-[#1B2E1D]' : 'text-stone-300'}`}>Seleccionar</span>
                                    </div>
                                </div>
                                <span className="absolute -right-4 -bottom-4 text-6xl md:text-8xl font-serif opacity-[0.03] select-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-700" style={{ fontFamily: preset.serif }}>Aa</span>
                            </button>
                        ))}
                    </div>
                </CollapsibleCard>

                {/* ── 4. Identidad Visual ── */}
                <CollapsibleCard
                    id="palette"
                    title="Identidad Visual"
                    subtitle="Colores maestros y atmósfera"
                    icon="🎨"
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                >
                    <div className="space-y-10 md:space-y-12">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {/* Hero text color */}
                            <div className="space-y-3">
                                <label className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-stone-400">Texto Portada</label>
                                <div className="flex items-center gap-2 md:gap-3 bg-stone-50/50 p-2 md:p-3 rounded-xl md:rounded-2xl shadow-inner border border-stone-100/50">
                                    <input
                                        type="color"
                                        value={config.heroTextColor}
                                        onChange={(e) => setConfig({ ...config, heroTextColor: e.target.value })}
                                        className="h-10 w-12 md:h-12 md:w-16 rounded-lg md:rounded-xl cursor-pointer bg-transparent border-0 p-0 flex-shrink-0"
                                    />
                                    <span className="font-mono text-[10px] text-stone-500 uppercase">{config.heroTextColor}</span>
                                </div>
                            </div>

                            {/* Accent color */}
                            <div className="space-y-3">
                                <label className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-stone-400">Acentos</label>
                                <div className="flex items-center gap-2 md:gap-3 bg-stone-50/50 p-2 md:p-3 rounded-xl md:rounded-2xl shadow-inner border border-stone-100/50">
                                    <input
                                        type="color"
                                        value={config.accentColor}
                                        onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                                        className="h-10 w-12 md:h-12 md:w-16 rounded-lg md:rounded-xl cursor-pointer bg-transparent border-0 p-0 flex-shrink-0"
                                    />
                                    <span className="font-mono text-[10px] text-stone-500 uppercase">{config.accentColor}</span>
                                </div>
                            </div>

                            {/* Card background color */}
                            <div className="space-y-3">
                                <label className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-stone-400">Tarjetas</label>
                                <div className="flex items-center gap-2 md:gap-3 bg-stone-50/50 p-2 md:p-3 rounded-xl md:rounded-2xl shadow-inner border border-stone-100/50">
                                    <input
                                        type="color"
                                        value={config.cardBgColor}
                                        onChange={(e) => setConfig({ ...config, cardBgColor: e.target.value })}
                                        className="h-10 w-12 md:h-12 md:w-16 rounded-lg md:rounded-xl cursor-pointer bg-transparent border-0 p-0 flex-shrink-0"
                                    />
                                    <span className="font-mono text-[10px] text-stone-500 uppercase">{config.cardBgColor}</span>
                                </div>
                            </div>

                            {/* Button color */}
                            <div className="space-y-3">
                                <label className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-stone-400">Botones</label>
                                <div className="flex items-center gap-2 md:gap-3 bg-stone-50/50 p-2 md:p-3 rounded-xl md:rounded-2xl shadow-inner border border-stone-100/50">
                                    <input
                                        type="color"
                                        value={config.buttonColor}
                                        onChange={(e) => setConfig({ ...config, buttonColor: e.target.value })}
                                        className="h-10 w-12 md:h-12 md:w-16 rounded-lg md:rounded-xl cursor-pointer bg-transparent border-0 p-0 flex-shrink-0"
                                    />
                                    <span className="font-mono text-[10px] text-stone-500 uppercase">{config.buttonColor}</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Background Color */}
                        <div className="space-y-5 pt-8 md:pt-10 border-t border-stone-50">
                            <label className="text-[10px] md:text-[11px] uppercase font-black tracking-[0.2em] text-stone-800 pl-1">Fondo de Portada (Layer Back)</label>
                            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-stone-50/30 rounded-[2rem] border border-stone-100/50">
                                <div className="h-20 w-full md:w-24 rounded-[1.5rem] border-4 border-white shadow-xl overflow-hidden relative" style={{ backgroundColor: config.heroBgColor || '#1B2E1D' }}>
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
                                <div className="text-center md:text-left">
                                    <p className="text-[10px] md:text-xs text-stone-400 leading-relaxed font-medium">Este tono define la elegancia visual cuando la imagen de portada aún no ha cargado o en transiciones premium.</p>
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
                            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-800 pl-1">Subtítulo (Ej. 70 Años)</label>
                            <input
                                type="text"
                                placeholder="Escribe algo elegante..."
                                value={config.welcomeSubtitle}
                                onChange={(e) => setConfig({ ...config, welcomeSubtitle: e.target.value })}
                                className="w-full bg-stone-50/50 px-6 md:px-8 py-5 md:py-6 rounded-xl md:rounded-2xl border-none shadow-inner text-stone-800 text-lg md:text-xl font-serif focus:ring-2 focus:ring-[#1B2E1D]/5 outline-none transition-all"
                            />
                        </div>
                        
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-800 pl-1">Cuerpo del Mensaje</label>
                            <textarea
                                placeholder="Te invitamos a ser parte de este momento..."
                                value={config.welcomeMessage}
                                onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                                rows={6}
                                className="w-full bg-stone-50/50 px-6 md:px-8 py-6 md:py-7 rounded-[1.5rem] md:rounded-[2rem] border-none shadow-inner resize-none text-stone-600 font-serif italic text-base md:text-lg leading-relaxed focus:ring-2 focus:ring-[#1B2E1D]/5 outline-none transition-all"
                            />
                        </div>
                    </div>
                </CollapsibleCard>

                {/* ── 6. Ceremonia y Logística ── */}
                <CollapsibleCard
                    id="logistics"
                    title="Ceremonia y Logística"
                    subtitle="Ubicación y detalles clave"
                    icon="⛪"
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                >
                    <div className="space-y-8 md:space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-400 pl-1">Nombre del Lugar</label>
                                <input
                                    type="text"
                                    value={config.misa_name}
                                    onChange={(e) => setConfig({ ...config, misa_name: e.target.value })}
                                    className="w-full bg-stone-50/50 px-6 py-4 rounded-xl md:rounded-2xl border-none shadow-inner text-stone-800 text-sm focus:ring-2 focus:ring-[#1B2E1D]/5 outline-none transition-all"
                                    placeholder="Ej. Parroquia de San Juan"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-400 pl-1">Código de Vestimenta</label>
                                <input
                                    type="text"
                                    value={config.dress_code}
                                    onChange={(e) => setConfig({ ...config, dress_code: e.target.value })}
                                    className="w-full bg-stone-50/50 px-6 py-4 rounded-xl md:rounded-2xl border-none shadow-inner text-stone-800 text-sm focus:ring-2 focus:ring-[#1B2E1D]/5 outline-none transition-all"
                                    placeholder="Ej. Formal, Blanco..."
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-400 pl-1">Enlace Google Maps</label>
                                <input
                                    type="url"
                                    value={config.misa_maps_link}
                                    onChange={(e) => setConfig({ ...config, misa_maps_link: e.target.value })}
                                    className="w-full bg-stone-50/50 px-6 py-4 rounded-xl md:rounded-2xl border-none shadow-inner text-[10px] font-mono text-stone-500 focus:ring-2 focus:ring-[#1B2E1D]/5 outline-none transition-all"
                                    placeholder="https://goo.gl/maps/..."
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-400 pl-1">Límite de Confirmación</label>
                                <input
                                    type="date"
                                    value={config.rsvp_deadline}
                                    onChange={(e) => setConfig({ ...config, rsvp_deadline: e.target.value })}
                                    className="w-full bg-stone-50/50 px-6 py-4 rounded-xl md:rounded-2xl border-none shadow-inner text-stone-800 text-sm focus:ring-2 focus:ring-[#1B2E1D]/5 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </CollapsibleCard>

                {/* ── 7. Activador de Módulos ── */}
                <CollapsibleCard
                    id="modules"
                    title="Activador de Módulos"
                    subtitle="Controla las secciones visibles"
                    icon="🧩"
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                >
                    <div className="space-y-10 md:space-y-12">
                        {([
                            {
                                group: 'INVITACIÓN',
                                icon: '🖼️',
                                color: 'text-indigo-600 bg-indigo-50',
                                features: [
                                    { id: 'showGallery',   label: 'Galería de Fotos', desc: 'Carrusel de imágenes',   icon: '📸', plans: ['pro', 'premium'] },
                                    { id: 'showEnvelope',  label: 'Sobre Digital', desc: 'Animación de entrada',          icon: '💌', plans: ['pro', 'premium'] },
                                    { id: 'showMessage',   label: 'Mensaje Texto', desc: 'Cuerpo de bienvenida',             icon: '✉️', plans: ['clasico', 'pro', 'premium'] },
                                ],
                            },
                            {
                                group: 'EVENTO',
                                icon: '📅',
                                color: 'text-rose-500 bg-rose-50',
                                features: [
                                    { id: 'showMap',         label: 'Ubicación / Maps', desc: 'Mapa interactivo',          icon: '📍', plans: ['clasico', 'pro', 'premium'] },
                                    { id: 'showItinerary',   label: 'Itinerario', desc: 'Cronograma del día',               icon: '🗓️', plans: ['pro', 'premium'] },
                                    { id: 'showDetails',     label: 'Vestimenta', desc: 'Dress Code visual',          icon: '✨', plans: ['pro', 'premium'] },
                                    { id: 'showChambelanes', label: 'Corte Honor', desc: 'Acompañantes',           icon: '👑', plans: ['pro', 'premium'] },
                                ],
                            },
                            {
                                group: 'INVITADOS',
                                icon: '👥',
                                color: 'text-emerald-600 bg-emerald-50',
                                features: [
                                    { id: 'showWhatsAppRSVP',      label: 'RSVP WhatsApp', desc: 'Confirmación directa', icon: '💬', plans: ['clasico', 'pro', 'premium'] },
                                    { id: 'enableGuestList',       label: 'Listado', desc: 'Gestión administrativa',     icon: '📋', plans: ['pro', 'premium'] },
                                    { id: 'enableQr',              label: 'Pases QR',           desc: 'Escaneo inteligente',       icon: '📱', plans: ['pro', 'premium'] },
                                    { id: 'enableAccessControl',   label: 'Check-in',  desc: 'Control de entrada',     icon: '🛡️', plans: ['pro', 'premium'] },
                                    { id: 'enableTableManagement', label: 'Mesas',   desc: 'Asignación de lugares',  icon: '🍽️', plans: ['pro', 'premium'] },
                                ],
                            },
                            {
                                group: 'EXTRAS',
                                icon: '⭐',
                                color: 'text-amber-600 bg-amber-50',
                                features: [
                                    { id: 'showGifts',         label: 'Mesa Regalos', desc: 'Datos bancarios/links',    icon: '🎁', plans: ['pro', 'premium'] },
                                    { id: 'showCountdown',     label: 'Countdown',desc: 'Contador de tiempo',      icon: '⏳', plans: ['clasico', 'pro', 'premium'] },
                                    { id: 'enableMetrics',     label: 'Métricas',        desc: 'Vistas y clics', icon: '📊', plans: ['pro', 'premium'] },
                                    { id: 'enableCustomDomain',label: 'Dominio',  desc: 'URL propia',             icon: '🌐', plans: ['pro', 'premium'] },
                                    { id: 'enableAi',          label: 'Asistente IA',    desc: 'Textos inteligentes',   icon: '🤖', plans: ['pro', 'premium'] },
                                ],
                            },
                        ] as const).map((module) => (
                            <div key={module.group} className="space-y-4 md:space-y-5">
                                <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-sm ${module.color} shadow-sm`}>
                                        {module.icon}
                                    </div>
                                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-stone-500">{module.group}</span>
                                    <div className="flex-1 h-px bg-stone-100" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
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
                                                className={`relative p-4 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all flex items-center gap-4 ${
                                                    isLocked
                                                        ? 'border-stone-50 bg-stone-50/30 opacity-50 cursor-not-allowed'
                                                        : isEnabled
                                                            ? 'border-[#1B2E1D] bg-[#1B2E1D]/5 cursor-pointer shadow-md shadow-emerald-900/5'
                                                            : 'border-stone-100 bg-white cursor-pointer hover:border-stone-200 shadow-sm'
                                                }`}
                                            >
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-xl transition-colors ${isEnabled ? 'bg-[#1B2E1D] text-white' : 'bg-stone-50 text-stone-400'}`}>
                                                    {feat.icon}
                                                </div>
                                                <div className="flex-1 min-w-0 text-left">
                                                    <p className={`text-[10px] md:text-[11px] font-black uppercase tracking-wide truncate ${
                                                        isLocked ? 'text-stone-300' : 'text-stone-800'
                                                    }`}>{feat.label}</p>
                                                    <p className="text-[9px] text-stone-400 truncate font-medium">{feat.desc}</p>
                                                </div>
                                                {isLocked ? (
                                                    <Shield className="h-3 w-3 text-stone-300" />
                                                ) : (
                                                    <div className={`h-5 w-9 rounded-full relative transition-colors flex-shrink-0 ${
                                                        isEnabled ? 'bg-[#1B2E1D]' : 'bg-stone-200'
                                                    }`}>
                                                        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
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
                        subtitle="Programa detallado del día"
                        icon="🗓️"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="space-y-8">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-400">Eventos del Día</label>
                                <button
                                    onClick={() => {
                                        const newItem = { id: Date.now().toString(), time: '16:00', title: 'Nuevo Evento', icon: 'heart' };
                                        setConfig({ ...config, itinerary: [...(config.itinerary || []), newItem] });
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#1B2E1D] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2D312E] transition-all shadow-lg shadow-emerald-900/10"
                                >
                                    <Plus className="h-3 w-3" /> Añadir
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {config.itinerary.map((item, idx) => (
                                    <div key={item.id || idx} className="flex flex-col sm:flex-row gap-4 p-5 bg-stone-50/50 rounded-2xl md:rounded-[2rem] items-start sm:items-center relative border border-stone-100/50 group hover:bg-white hover:shadow-xl transition-all">
                                        <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center text-[#1B2E1D] flex-shrink-0 relative border border-stone-100 group-hover:scale-105 transition-transform">
                                            <select 
                                                value={item.icon}
                                                onChange={(e) => {
                                                    const newItin = [...config.itinerary];
                                                    newItin[idx].icon = e.target.value;
                                                    setConfig({ ...config, itinerary: newItin });
                                                }}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            >
                                                <option value="heart">Ceremonia</option>
                                                <option value="wine">Brindis</option>
                                                <option value="utensils">Cena</option>
                                                <option value="music">Baile</option>
                                                <option value="party">Fiesta</option>
                                                <option value="moon">Final</option>
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
                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3 w-full">
                                            <input
                                                type="time"
                                                value={item.time}
                                                onChange={(e) => {
                                                    const newItin = [...config.itinerary];
                                                    newItin[idx].time = e.target.value;
                                                    setConfig({ ...config, itinerary: newItin });
                                                }}
                                                className="w-full sm:col-span-1 bg-white px-4 py-3 rounded-xl border border-stone-100 text-xs font-mono font-bold text-[#1B2E1D] focus:ring-2 focus:ring-[#1B2E1D]/5 outline-none"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Ej. Recepción de Invitados"
                                                value={item.title}
                                                onChange={(e) => {
                                                    const newItin = [...config.itinerary];
                                                    newItin[idx].title = e.target.value;
                                                    setConfig({ ...config, itinerary: newItin });
                                                }}
                                                className="w-full sm:col-span-3 bg-white px-5 py-3 rounded-xl border border-stone-100 text-xs font-medium text-stone-700 focus:ring-2 focus:ring-[#1B2E1D]/5 outline-none"
                                            />
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const newItin = config.itinerary.filter((_, i) => i !== idx);
                                                setConfig({ ...config, itinerary: newItin });
                                            }}
                                            className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 p-3 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
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
                        subtitle="Pajes, Damas y Chambelanes"
                        icon="👑"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            {/* Chambelanes */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#1B2E1D]">Chambelanes / Pajes</h3>
                                    <button
                                        onClick={() => setConfig({ ...config, chambelanes: [...(config.chambelanes || []), ''] })}
                                        className="h-8 w-8 flex items-center justify-center bg-stone-50 text-stone-400 rounded-full hover:bg-[#1B2E1D] hover:text-white transition-all shadow-sm"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {config.chambelanes.map((name, idx) => (
                                        <div key={idx} className="flex gap-2 animate-in slide-in-from-left duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => {
                                                    const newArr = [...config.chambelanes];
                                                    newArr[idx] = e.target.value;
                                                    setConfig({ ...config, chambelanes: newArr });
                                                }}
                                                placeholder="Nombre del Chambelán"
                                                className="w-full bg-stone-50/50 px-5 py-3 rounded-xl border border-stone-100 text-xs font-medium focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all outline-none"
                                            />
                                            <button 
                                                onClick={() => setConfig({ ...config, chambelanes: config.chambelanes.filter((_, i) => i !== idx) })}
                                                className="p-3 text-stone-300 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {config.chambelanes.length === 0 && (
                                        <div className="py-10 text-center border-2 border-dashed border-stone-50 rounded-[2rem] opacity-30">
                                            <p className="text-[10px] uppercase font-black tracking-widest text-stone-400">Sin registros</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Damas */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#1B2E1D]">Damas de Honor</h3>
                                    <button
                                        onClick={() => setConfig({ ...config, damas: [...(config.damas || []), ''] })}
                                        className="h-8 w-8 flex items-center justify-center bg-stone-50 text-stone-400 rounded-full hover:bg-[#1B2E1D] hover:text-white transition-all shadow-sm"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {config.damas.map((name, idx) => (
                                        <div key={idx} className="flex gap-2 animate-in slide-in-from-right duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => {
                                                    const newArr = [...config.damas];
                                                    newArr[idx] = e.target.value;
                                                    setConfig({ ...config, damas: newArr });
                                                }}
                                                placeholder="Nombre de la Dama"
                                                className="w-full bg-stone-50/50 px-5 py-3 rounded-xl border border-stone-100 text-xs font-medium focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all outline-none"
                                            />
                                            <button 
                                                onClick={() => setConfig({ ...config, damas: config.damas.filter((_, i) => i !== idx) })}
                                                className="p-3 text-stone-300 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {config.damas.length === 0 && (
                                        <div className="py-10 text-center border-2 border-dashed border-stone-50 rounded-[2rem] opacity-30">
                                            <p className="text-[10px] uppercase font-black tracking-widest text-stone-400">Sin registros</p>
                                        </div>
                                    )}
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
                        subtitle="Links y datos bancarios"
                        icon="🎁"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="space-y-8">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#1B2E1D]">Opciones de Regalo</h3>
                                <button
                                    onClick={() => setConfig({ ...config, registryItems: [...(config.registryItems || []), { store: '', link: '', description: '' }] })}
                                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/10"
                                >
                                    <Plus className="h-3 w-3" /> Nueva Opción
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4 md:gap-5">
                                {config.registryItems.map((item, idx) => (
                                    <div key={idx} className="group flex flex-col md:flex-row gap-4 md:gap-6 p-6 bg-stone-50/50 rounded-[1.5rem] md:rounded-[2rem] items-start md:items-center relative border border-stone-100 hover:bg-white hover:shadow-xl transition-all">
                                        <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center text-amber-500 flex-shrink-0 border border-stone-100 group-hover:scale-110 transition-transform">
                                            <Gift className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 space-y-3 w-full">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[8px] md:text-[9px] uppercase font-black tracking-widest text-stone-400 pl-1">Tienda o Banco</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Ej. Liverpool, BBVA..."
                                                        value={item.store}
                                                        onChange={(e) => {
                                                            const newItems = [...config.registryItems];
                                                            newItems[idx].store = e.target.value;
                                                            setConfig({ ...config, registryItems: newItems });
                                                        }}
                                                        className="w-full bg-white px-4 py-3 rounded-xl border border-stone-100 text-xs font-bold text-stone-700"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[8px] md:text-[9px] uppercase font-black tracking-widest text-stone-400 pl-1">Link o CLABE</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enlace o número"
                                                        value={item.link}
                                                        onChange={(e) => {
                                                            const newItems = [...config.registryItems];
                                                            newItems[idx].link = e.target.value;
                                                            setConfig({ ...config, registryItems: newItems });
                                                        }}
                                                        className="w-full bg-white px-4 py-3 rounded-xl border border-stone-100 text-[10px] font-mono text-stone-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] md:text-[9px] uppercase font-black tracking-widest text-stone-400 pl-1">Indicaciones (Opcional)</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej. 'Lluvia de sobres', 'Número de cuenta para transferencia'..."
                                                    value={item.description || ''}
                                                    onChange={(e) => {
                                                        const newItems = [...config.registryItems];
                                                        newItems[idx].description = e.target.value;
                                                        setConfig({ ...config, registryItems: newItems });
                                                    }}
                                                    className="w-full bg-white px-4 py-3 rounded-xl border border-stone-100 text-xs font-medium text-stone-400 italic"
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const newItems = config.registryItems.filter((_, i) => i !== idx);
                                                setConfig({ ...config, registryItems: newItems });
                                            }}
                                            className="absolute top-4 right-4 md:relative md:top-0 md:right-0 p-3 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                {config.registryItems.length === 0 && (
                                    <div className="py-12 text-center border-2 border-dashed border-stone-50 rounded-[2.5rem] opacity-30">
                                        <p className="text-[10px] uppercase font-black tracking-widest text-stone-400">Sin mesas configuradas</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CollapsibleCard>
                )}

                {/* ── 11. Galería de Fotos ── */}
                {currentPlan?.code === 'premium' && (
                    <CollapsibleCard
                        id="gallery"
                        title="Galería de Fotos"
                        subtitle="Álbum multimedia"
                        icon="📸"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="space-y-8">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#1B2E1D]">Álbum Visual</h3>
                                <button
                                    onClick={() => setConfig({ ...config, galleryImages: [...(config.galleryImages || []), { url: '', caption: '' }] })}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/10"
                                >
                                    <Plus className="h-3 w-3" /> Añadir Foto
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {config.galleryImages.map((img, idx) => (
                                    <div key={idx} className="group p-5 bg-stone-50/50 rounded-[1.5rem] md:rounded-[2rem] border border-stone-100 hover:bg-white hover:shadow-xl transition-all">
                                        <div className="flex flex-col gap-5">
                                            <div className="w-full aspect-video bg-white rounded-xl md:rounded-2xl shadow-inner border border-stone-100 overflow-hidden relative group-hover:scale-[1.02] transition-transform">
                                                {img.url ? (
                                                    <img src={img.url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-200">
                                                        <ImageIcon className="h-10 w-10" />
                                                        <span className="text-[8px] uppercase font-black tracking-widest">Sin imagen</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <label className="text-[8px] uppercase font-black tracking-widest text-stone-300 pl-1">URL Directa</label>
                                                    <input
                                                        type="url"
                                                        placeholder="https://images.unsplash.com/..."
                                                        value={img.url}
                                                        onChange={(e) => {
                                                            const newImages = [...config.galleryImages];
                                                            newImages[idx].url = e.target.value;
                                                            setConfig({ ...config, galleryImages: newImages });
                                                        }}
                                                        className="w-full bg-white px-4 py-2.5 rounded-xl border border-stone-50 text-[10px] font-mono text-stone-400"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 space-y-1">
                                                        <label className="text-[8px] uppercase font-black tracking-widest text-stone-300 pl-1">Título / Pie</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Ej. Sesión de fotos..."
                                                            value={img.caption || ''}
                                                            onChange={(e) => {
                                                                const newImages = [...config.galleryImages];
                                                                newImages[idx].caption = e.target.value;
                                                                setConfig({ ...config, galleryImages: newImages });
                                                            }}
                                                            className="w-full bg-white px-4 py-2.5 rounded-xl border border-stone-50 text-[11px] font-medium text-stone-700"
                                                        />
                                                    </div>
                                                    <button 
                                                        onClick={() => {
                                                            const newImages = config.galleryImages.filter((_, i) => i !== idx);
                                                            setConfig({ ...config, galleryImages: newImages });
                                                        }}
                                                        className="mt-4 p-3 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
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
                        subtitle="Alojamiento recomendado"
                        icon="🏨"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="space-y-8">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#1B2E1D]">Hospedaje Recomendado</h3>
                                <button
                                    onClick={() => setConfig({ ...config, hotels: [...(config.hotels || []), { name: '', distance: '', description: '', price: '', link: '', isRecommended: false }] })}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10"
                                >
                                    <Plus className="h-3 w-3" /> Nuevo Hotel
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6">
                                {config.hotels.map((hotel, idx) => (
                                    <div key={idx} className="group p-6 md:p-8 bg-stone-50/50 rounded-[2rem] border border-stone-100 hover:bg-white hover:border-blue-100 hover:shadow-2xl transition-all relative">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                                            <div className="space-y-5">
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] uppercase font-black tracking-[0.2em] text-stone-300 pl-1">Nombre Comercial</label>
                                                    <input
                                                        type="text"
                                                        value={hotel.name}
                                                        onChange={(e) => {
                                                            const newHotels = [...config.hotels];
                                                            newHotels[idx].name = e.target.value;
                                                            setConfig({ ...config, hotels: newHotels });
                                                        }}
                                                        className="w-full bg-white px-5 py-4 rounded-xl md:rounded-2xl border border-stone-50 text-base font-serif font-bold text-[#1B2E1D]"
                                                        placeholder="Ej. Hyatt Regency"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] uppercase font-black tracking-widest text-stone-300 pl-1">Cercanía</label>
                                                        <input
                                                            type="text"
                                                            value={hotel.distance}
                                                            onChange={(e) => {
                                                                const newHotels = [...config.hotels];
                                                                newHotels[idx].distance = e.target.value;
                                                                setConfig({ ...config, hotels: newHotels });
                                                            }}
                                                            className="w-full bg-white px-4 py-3 rounded-xl border border-stone-50 text-xs font-bold text-stone-600"
                                                            placeholder="Ej. A 5 mins"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] uppercase font-black tracking-widest text-stone-300 pl-1">Tarifa Aprox</label>
                                                        <input
                                                            type="text"
                                                            value={hotel.price}
                                                            onChange={(e) => {
                                                                const newHotels = [...config.hotels];
                                                                newHotels[idx].price = e.target.value;
                                                                setConfig({ ...config, hotels: newHotels });
                                                            }}
                                                            className="w-full bg-white px-4 py-3 rounded-xl border border-stone-50 text-xs font-bold text-stone-600"
                                                            placeholder="Ej. $2,400 MXN"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-5">
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] uppercase font-black tracking-[0.2em] text-stone-300 pl-1">Comentarios / Código</label>
                                                    <textarea
                                                        value={hotel.description}
                                                        onChange={(e) => {
                                                            const newHotels = [...config.hotels];
                                                            newHotels[idx].description = e.target.value;
                                                            setConfig({ ...config, hotels: newHotels });
                                                        }}
                                                        rows={2}
                                                        className="w-full bg-white px-5 py-4 rounded-xl md:rounded-2xl border border-stone-50 text-xs text-stone-500 font-medium resize-none leading-relaxed"
                                                        placeholder="Ej. 'Mencionar código BODA70 para tarifa especial'"
                                                    />
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                                    <div className="flex-1 space-y-1.5 w-full">
                                                        <label className="text-[9px] uppercase font-black tracking-widest text-stone-300 pl-1">Enlace Directo</label>
                                                        <input
                                                            type="url"
                                                            value={hotel.link}
                                                            onChange={(e) => {
                                                                const newHotels = [...config.hotels];
                                                                newHotels[idx].link = e.target.value;
                                                                setConfig({ ...config, hotels: newHotels });
                                                            }}
                                                            className="w-full bg-white px-5 py-3 rounded-xl border border-stone-50 text-[10px] font-mono text-blue-500"
                                                            placeholder="https://..."
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-3 self-end md:self-auto">
                                                        <button
                                                            onClick={() => {
                                                                const newHotels = [...config.hotels];
                                                                newHotels[idx].isRecommended = !newHotels[idx].isRecommended;
                                                                setConfig({ ...config, hotels: newHotels });
                                                            }}
                                                            className={`p-4 rounded-2xl border transition-all ${hotel.isRecommended ? 'bg-amber-400 border-amber-400 text-white shadow-lg shadow-amber-400/20' : 'bg-white border-stone-100 text-stone-200'}`}
                                                            title="Destacar como recomendado"
                                                        >
                                                            <Sparkles className="h-5 w-5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                const newHotels = config.hotels.filter((_, i) => i !== idx);
                                                                setConfig({ ...config, hotels: newHotels });
                                                            }}
                                                            className="p-4 text-stone-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl border border-transparent transition-all"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CollapsibleCard>
                )}

                {/* ── 13. Estilos Expertos (CSS) ── */}
                {config.plan === 'concierge' && (
                    <CollapsibleCard
                        id="expert"
                        title="Estilos Expertos"
                        subtitle="Inyección de código avanzado"
                        icon="⚡"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="space-y-6 md:space-y-8">
                            <div className="p-5 md:p-6 bg-amber-50 border border-amber-100/50 rounded-2xl md:rounded-[2rem] flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-amber-800">Zona de Desarrolladores</p>
                                    <p className="text-xs text-amber-700/80 font-medium leading-relaxed">
                                        Personaliza cada píxel de tu invitación. Los cambios aquí inyectados tienen prioridad máxima sobre los estilos base.
                                    </p>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/10 via-emerald-500/10 to-amber-500/10 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition-all duration-1000" />
                                <div className="relative bg-[#1B2E1D] p-1 rounded-[2.5rem] shadow-2xl">
                                    <div className="absolute top-4 right-8 flex gap-1.5 opacity-30">
                                        <div className="h-2 w-2 rounded-full bg-rose-500" />
                                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    </div>
                                    <textarea
                                        value={config.customCss}
                                        onChange={(e) => setConfig({ ...config, customCss: e.target.value })}
                                        placeholder="/* Inserta aquí tu CSS personalizado... */"
                                        className="w-full h-80 bg-transparent text-emerald-400 p-8 md:p-10 rounded-[2.5rem] font-mono text-[11px] md:text-xs leading-relaxed focus:ring-0 border-none resize-none selection:bg-emerald-500/20"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-3 opacity-30">
                                <div className="h-px w-8 bg-stone-200" />
                                <p className="text-[8px] md:text-[9px] text-stone-400 uppercase tracking-[0.3em] font-black">Design Pro Environment</p>
                                <div className="h-px w-8 bg-stone-200" />
                            </div>
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
