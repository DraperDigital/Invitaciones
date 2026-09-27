import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import { Loader2, ArrowLeft, ArrowRight, Save, Calendar, PartyPopper, Heart, Crown, Droplet, Wine, Church, Baby, Cake, GraduationCap, Building2, MapPin, ExternalLink, Sparkles, SlidersHorizontal } from 'lucide-react';
import { getLayoutForEventType } from '../lib/sectionRegistry';
import { THEME_PRESET_PROFILES, EVENT_CATEGORY_LABELS, normalizeEventCategory, getTemplatesForCategory } from '../lib/themePresets';
import { trackEvent } from '../lib/analytics';
import WizardAiAssistant from '../components/wizard/WizardAiAssistant';

export type WizardData = {
    title: string;
    event_type: string;
    date_time: string;
    venue_name: string;
    venue_address: string;
    maps_link: string;
    misa_name: string;
    misa_address: string;
    misa_maps_link: string;
    misa_time: string;
    dress_code: string;
    rsvp_deadline: string;
    theme: string;
    venue_time: string;
};

const INITIAL_DATA: WizardData = {
    title: '',
    event_type: 'wedding',
    date_time: '',
    venue_name: '',
    venue_address: '',
    maps_link: '',
    misa_name: '',
    misa_address: '',
    misa_maps_link: '',
    misa_time: '',
    dress_code: '',
    rsvp_deadline: '',
    theme: 'classic',
    venue_time: '',
};

export const EVENT_TYPE_OPTIONS = [
    { id: 'wedding', label: 'Boda', icon: Heart, color: 'text-rose-500 bg-rose-50 border-rose-100', defaultTheme: 'classic' },
    { id: 'xv', label: 'XV Años', icon: Crown, color: 'text-purple-500 bg-purple-50 border-purple-100', defaultTheme: 'romantic-botanical' },
    { id: 'bautizo', label: 'Bautizo', icon: Droplet, color: 'text-sky-500 bg-sky-50 border-sky-100', defaultTheme: 'whimsical-kids' },
    { id: 'primera_comunion', label: 'Primera Comunión', icon: Wine, color: 'text-emerald-500 bg-emerald-50 border-emerald-100', defaultTheme: 'classic' },
    { id: 'confirmacion', label: 'Confirmación', icon: Church, color: 'text-amber-500 bg-amber-50 border-amber-100', defaultTheme: 'classic' },
    { id: 'baby_shower', label: 'Baby Shower', icon: Baby, color: 'text-pink-500 bg-pink-50 border-pink-100', defaultTheme: 'whimsical-kids' },
    { id: 'gender_reveal', label: 'Gender Reveal', icon: PartyPopper, color: 'text-indigo-500 bg-indigo-50 border-indigo-100', defaultTheme: 'reveal-duo' },
    { id: 'birthday', label: 'Cumpleaños', icon: Cake, color: 'text-amber-500 bg-amber-50 border-amber-100', defaultTheme: 'neon-glow' },
    { id: 'graduacion', label: 'Graduación', icon: GraduationCap, color: 'text-blue-500 bg-blue-50 border-blue-100', defaultTheme: 'polaroid-vintage' },
    { id: 'corporate', label: 'Corporativo', icon: Building2, color: 'text-slate-600 bg-slate-100 border-slate-200', defaultTheme: 'split-screen' },
    { id: 'other', label: 'Otro', icon: Calendar, color: 'text-stone-500 bg-stone-100 border-stone-200', defaultTheme: 'classic' },
];

// ── Presets por tipo de evento ────────────────────────────────────────────
const EVENT_TYPE_PRESETS: Record<string, Record<string, boolean>> = {
    xv: {
        showDetails:      true,
        showItinerary:    true,
        showGallery:      true,
        showMap:          true,
        showWhatsAppRSVP: true,
        showCountdown:    true,
        showGifts:        false,
    },
    wedding: {
        showDetails:      true,
        showItinerary:    true,
        showMap:          true,
        showWhatsAppRSVP: true,
        showCountdown:    true,
        showGifts:        true,
        showGallery:      false,
    },
    birthday: {
        showMap:          true,
        showWhatsAppRSVP: true,
        showCountdown:    true,
        showDetails:      false,
        showItinerary:    false,
        showGallery:      false,
        showGifts:        false,
    },
    bautizo: {
        showMap:          true,
        showWhatsAppRSVP: true,
        showCountdown:    true,
        showDetails:      true,
        showItinerary:    false,
        showGallery:      false,
        showGifts:        true,
    },
    primera_comunion: {
        showMap:          true,
        showWhatsAppRSVP: true,
        showCountdown:    true,
        showDetails:      true,
        showItinerary:    false,
        showGallery:      false,
        showGifts:        true,
    },
    confirmacion: {
        showMap:          true,
        showWhatsAppRSVP: true,
        showCountdown:    true,
        showDetails:      true,
        showItinerary:    false,
        showGallery:      false,
        showGifts:        false,
    },
    baby_shower: {
        showMap:          true,
        showWhatsAppRSVP: true,
        showCountdown:    true,
        showDetails:      false,
        showItinerary:    false,
        showGallery:      true,
        showGifts:        true,
    },
    gender_reveal: {
        showMap:          true,
        showWhatsAppRSVP: true,
        showCountdown:    true,
        showDetails:      true,
        showItinerary:    false,
        showGallery:      true,
        showGifts:        true,
        showChambelanes:  false,
        showHotels:       false,
    },
    graduacion: {
        showMap:          true,
        showWhatsAppRSVP: true,
        showCountdown:    true,
        showDetails:      false,
        showItinerary:    true,
        showGallery:      false,
        showGifts:        false,
    },
    corporate: {
        showMap:          true,
        showWhatsAppRSVP: true,
        showCountdown:    false,
        showDetails:      true,
        showItinerary:    true,
        showGallery:      false,
        showGifts:        false,
    },
    other: {
        showMap:          true,
        showWhatsAppRSVP: true,
        showCountdown:    true,
        showDetails:      false,
        showItinerary:    false,
        showGallery:      false,
        showGifts:        false,
    },
};

export default function EventWizard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { id } = useParams<{ id: string }>();
    const [step, setStep] = useState(1);
    const [data, setData] = useState<WizardData>(INITIAL_DATA);
    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [wizardTemplateFilter, setWizardTemplateFilter] = useState<'recommended' | 'all'>('recommended');
    const [searchParams] = useSearchParams();
    const isWelcome = searchParams.get('welcome') === 'true';
    const preselectedPlan = searchParams.get('plan');
    const preselectedCoupon = searchParams.get('coupon');

    const isEditing = !!id;
    const [creationMode, setCreationMode] = useState<'assistant' | 'manual'>(id ? 'manual' : 'assistant');

    useEffect(() => {
        if (!user || dataLoaded) return;

        if (!id) {
            const preselectedTheme = searchParams.get('theme');
            if (preselectedTheme) {
                setData(prev => ({ ...prev, theme: preselectedTheme }));
            }
            setDataLoaded(true);
            return;
        }

        const fetchEvent = async () => {
            try {
                const { data: eventData, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (eventData) {
                    setData({
                        title: eventData.title || '',
                        event_type: eventData.event_type || 'wedding',
                        date_time: eventData.date_time ? new Date(eventData.date_time).toISOString().slice(0, 16) : '',
                        venue_name: eventData.venue_name || '',
                        venue_address: eventData.venue_address || '',
                        maps_link: eventData.maps_link || '',
                        misa_name: eventData.theme_config?.misa_name || eventData.theme_config?.misaName || '',
                        misa_address: eventData.theme_config?.misa_address || eventData.theme_config?.misaAddress || '',
                        misa_maps_link: eventData.theme_config?.misa_maps_link || eventData.theme_config?.misaMapsLink || '',
                        misa_time: eventData.theme_config?.misa_time || eventData.theme_config?.misaTime || '',
                        dress_code: eventData.dress_code || '',
                        rsvp_deadline: eventData.rsvp_deadline ? new Date(eventData.rsvp_deadline).toISOString().slice(0, 10) : '',
                        theme: eventData.theme_config?.theme || 'classic',
                        venue_time: eventData.theme_config?.venue_time || ''
                    });
                }
            } catch (err: any) {
                console.error('Error fetching event:', err);
                toast.error('Error al cargar datos del evento');
            } finally {
                setDataLoaded(true);
            }
        };

        fetchEvent();
    }, [id, user, dataLoaded]);

    const updateData = (updates: Partial<WizardData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        setStep((prev) => prev + 1);
    };

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        setStep((prev) => prev - 1);
    };

    const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
        if (e) e.preventDefault();
        if (!user) return;

        // Validar que la fecha sea válida y futura (BUG-08)
        const testDate = new Date(data.date_time);
        if (isNaN(testDate.getTime())) {
            toast.error('La fecha del evento no es válida.');
            return;
        }
        if (testDate < new Date()) {
            toast.error('La fecha del evento debe ser futura.');
            return;
        }

        setLoading(true);

        try {
            // Validar límite de borradores para cuentas no publicadas (DATA-01)
            if (!isEditing) {
                const { count, error: countError } = await supabase
                    .from('events')
                    .select('id', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .eq('is_published', false);

                if (!countError && (count || 0) >= 3) {
                    toast.error('Tienes 3 borradores sin publicar. Publica o elimina uno antes de crear otro.');
                    setLoading(false);
                    return;
                }
            }

            const dateTimeStr = testDate.toISOString();

            const payload = {
                title: data.title,
                event_type: data.event_type as any,
                date_time: dateTimeStr,
                venue_name: data.venue_name,
                venue_address: data.venue_address,
                maps_link: data.maps_link,
                dress_code: data.dress_code,
                rsvp_deadline: data.rsvp_deadline ? new Date(data.rsvp_deadline).toISOString() : null,
            };

            if (isEditing) {
                // Obtenemos el config actual para no borrar la galería y regalos
                const { data: oldData } = await supabase.from('events').select('theme_config').eq('id', id).single();
                const newConfig = { 
                    ...(oldData?.theme_config || {}), 
                    theme: data.theme,
                    misa_name: data.misa_name,
                    misa_address: data.misa_address,
                    misa_maps_link: data.misa_maps_link,
                    misa_time: data.misa_time,
                    venue_time: data.venue_time
                };
                
                const { error } = await supabase.from('events').update({ ...payload, theme_config: newConfig }).eq('id', id);
                if (error) throw error;
                toast.success('¡Evento actualizado!');
                navigate(`/dashboard/event/${id}`);
            } else {
                const eventPreset = EVENT_TYPE_PRESETS[data.event_type] || EVENT_TYPE_PRESETS.other;
                const layoutOrder = getLayoutForEventType(data.event_type);

                // Normalización robusta de slug (BUG-03)
                const normalizedTitle = data.title
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')   // quita acentos
                    .replace(/[^a-z0-9\s-]/g, '')     // quita &, ñ, símbolos
                    .trim()
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-');

                const generatedSlug = `${normalizedTitle || 'evento'}-${crypto.randomUUID().slice(0, 5)}`;

                const insertPayload = {
                    id: crypto.randomUUID(),
                    ...payload,
                    user_id: user.id,
                    // Draft until payment confirmed. Stripe webhook flips this to true on successful checkout.
                    is_published: false,
                    theme_config: {
                        theme: data.theme,
                        primary_color: (THEME_PRESET_PROFILES[data.theme] || THEME_PRESET_PROFILES.classic).primaryColor,
                        accent_color: (THEME_PRESET_PROFILES[data.theme] || THEME_PRESET_PROFILES.classic).accentColor,
                        card_bg_color: (THEME_PRESET_PROFILES[data.theme] || THEME_PRESET_PROFILES.classic).cardBgColor,
                        hero_text_color: (THEME_PRESET_PROFILES[data.theme] || THEME_PRESET_PROFILES.classic).heroTextColor,
                        hero_bg_color: (THEME_PRESET_PROFILES[data.theme] || THEME_PRESET_PROFILES.classic).heroBgColor,
                        typography_preset: (THEME_PRESET_PROFILES[data.theme] || THEME_PRESET_PROFILES.classic).typographyPreset,
                        misa_name: data.misa_name,
                        misa_address: data.misa_address,
                        misa_maps_link: data.misa_maps_link,
                        misa_time: data.misa_time,
                        venue_time: data.venue_time,
                        // Preset de módulos activos según tipo de evento
                        ...eventPreset,
                        // Preset de orden de secciones según tipo de evento
                        sectionOrder: layoutOrder,
                    },
                    slug: generatedSlug,
                };
                const { error } = await supabase.from('events').insert(insertPayload);
                if (error) throw error;
                trackEvent('generate_lead', {
                    event_type: data.event_type,
                    theme: data.theme,
                    event_id: insertPayload.id
                });
                if (preselectedPlan) {
                    const couponQs = preselectedCoupon ? `&coupon=${preselectedCoupon}` : '';
                    navigate(`/checkout?plan=${preselectedPlan}&id=${insertPayload.id}${couponQs}`);
                } else {
                    toast.success('¡Evento creado! Elige un plan para activar y publicar tu invitación.');
                    navigate(`/planes?id=${insertPayload.id}`);
                }
            }
        } catch (err: any) {
            console.error('Error submitting event:', err);
            toast.error('Error al guardar: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!dataLoaded) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-stone-300 w-10 h-10" /></div>;

    return (
        <div id="wizard-container" className="max-w-2xl mx-auto">

            {/* Welcome Banner for new users */}
            {isWelcome && !isEditing && (
                <div className="mb-8 p-6 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-2xl text-white flex items-center gap-5 shadow-xl border border-stone-800">
                    <div className="p-3 bg-white/10 rounded-xl flex-shrink-0">
                        <PartyPopper className="h-8 w-8 text-[#DF3B94]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Heart className="h-3 w-3 text-[#DF3B94] fill-[#DF3B94]" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#DF3B94]">Bienvenido a Invitto</span>
                        </div>
                        <p className="font-sans font-bold text-xl leading-tight">¡Tu cuenta está lista! Crea tu primera invitación ahora.</p>
                        <p className="text-stone-400 text-xs mt-1 font-normal">Solo 3 pasos y tu evento estará listo para compartir.</p>
                    </div>
                </div>
            )}

            {/* Selector de Modo: Asistente IA vs Formulario Clásico */}
            <div className="flex items-center justify-center mb-8">
                <div className="bg-stone-100 p-1.5 rounded-2xl flex items-center gap-1 border border-stone-200/80 shadow-inner">
                    <button
                        type="button"
                        onClick={() => setCreationMode('assistant')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            creationMode === 'assistant'
                                ? 'bg-white text-stone-900 shadow-md font-extrabold scale-[1.02]'
                                : 'text-stone-500 hover:text-stone-800'
                        }`}
                    >
                        <Sparkles className="h-4 w-4 text-[#DF3B94]" />
                        <span>Asistente IA</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DF3B94]/10 text-[#DF3B94] font-black">Nuevo</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setCreationMode('manual')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            creationMode === 'manual'
                                ? 'bg-white text-stone-900 shadow-md font-extrabold scale-[1.02]'
                                : 'text-stone-500 hover:text-stone-800'
                        }`}
                    >
                        <SlidersHorizontal className="h-4 w-4 text-stone-600" />
                        <span>Formulario Clásico</span>
                    </button>
                </div>
            </div>

            {creationMode === 'assistant' ? (
                <WizardAiAssistant
                    data={data}
                    updateData={updateData}
                    onSwitchToManual={() => setCreationMode('manual')}
                    onSubmit={() => handleSubmit()}
                    loading={loading}
                />
            ) : (
                <>
                    <div className="mb-8 md:mb-12">
                        <h1 className="text-2xl md:text-4xl font-display font-extrabold text-stone-900 tracking-tight mb-2">{isEditing ? 'Editar Invitación' : 'Crear Nueva Invitación'}</h1>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-stone-500 text-[10px] md:text-xs uppercase font-bold tracking-widest">Progreso del Asistente</p>
                            <p className="text-[#DF3B94] font-sans font-bold text-sm">Paso {step} de 3</p>
                        </div>
                        <div className="h-1.5 md:h-2 w-full rounded-full bg-stone-100 p-0.5 md:p-1 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-[#DF3B94] transition-all duration-700 ease-out shadow-[0_0_10px_rgba(223,59,148,0.4)]"
                                style={{ width: `${(step / 3) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="rounded-[2rem] md:rounded-[3rem] border border-stone-200 bg-white p-6 md:p-12 shadow-sm">
                {step === 1 && (
                    <div className="space-y-6 md:space-y-8">
                        <div className="space-y-1">
                            <h2 className="text-xl md:text-2xl font-display font-extrabold text-stone-900">Información Básica</h2>
                            <p className="text-xs md:text-sm text-stone-500 font-normal">Comencemos con los detalles generales de tu evento.</p>
                        </div>
                        
                        <div className="space-y-4 md:space-y-6">
                            <div>
                                <label className="block text-xs uppercase font-bold text-stone-700 mb-2 tracking-wider ml-1">Título del Evento</label>
                                <input
                                    type="text"
                                    required
                                    value={data.title}
                                    onChange={(e) => updateData({ title: e.target.value })}
                                    className="block w-full rounded-xl md:rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-3 md:py-4 text-sm md:text-base text-stone-900 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] focus:bg-white transition-all"
                                    placeholder="Ej. Boda de Ana y Carlos"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-stone-700 mb-3 tracking-wider ml-1">¿Qué estás celebrando?</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {EVENT_TYPE_OPTIONS.map((item) => {
                                        const isSelected = data.event_type === item.id;
                                        const IconComponent = item.icon;
                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => {
                                                    updateData({ event_type: item.id, theme: item.defaultTheme });
                                                }}
                                                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 text-center transition-all duration-200 ${
                                                    isSelected
                                                        ? 'border-[#DF3B94] bg-[#DF3B94]/5 shadow-md scale-[1.02]'
                                                        : 'border-stone-100 bg-stone-50/50 hover:border-stone-200 hover:bg-white'
                                                }`}
                                            >
                                                <div className={`p-3 rounded-xl ${item.color} ${isSelected ? 'scale-110' : ''} transition-transform`}>
                                                    <IconComponent className="h-5 w-5" />
                                                </div>
                                                <span className={`text-xs font-bold ${isSelected ? 'text-[#DF3B94]' : 'text-stone-700'}`}>
                                                    {item.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-stone-700 mb-2 tracking-wider ml-1">Fecha y Hora del Evento</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={data.date_time}
                                    onChange={(e) => updateData({ date_time: e.target.value })}
                                    className="block w-full rounded-xl md:rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-3 md:py-4 text-sm md:text-base text-stone-900 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] focus:bg-white transition-all"
                                />
                            </div>

                            {/* Selección de Plantilla / Diseño */}
                            <div className="pt-4 space-y-3 border-t border-stone-100">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs uppercase font-bold text-stone-700 tracking-wider ml-1">
                                        Plantilla / Diseño Visual
                                    </label>
                                    <a 
                                        href="/ejemplos" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs uppercase font-bold tracking-wider text-[#DF3B94] hover:text-[#c92f82] hover:underline flex items-center gap-1"
                                    >
                                        <span>Explorar Galería en Vivo</span> ↗
                                    </a>
                                </div>
                                <p className="text-xs text-stone-500 font-normal">Selecciona la plantilla inicial para tu invitación (puedes cambiarla después).</p>

                                {(() => {
                                    const effectiveCategory = normalizeEventCategory(data.event_type, data.theme);
                                    const categoryTemplates = getTemplatesForCategory(effectiveCategory, data.theme);
                                    const categoryLabel = EVENT_CATEGORY_LABELS[effectiveCategory] || 'Evento';

                                    const allTemplates = [
                                        { id: 'classic', name: 'Clásica Atemporal', category: 'Boda / Elegante', image: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'classic-elegance-pro', name: 'Clásica Atemporal Pro', category: 'Boda / Lujo', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'modern-minimalist', name: 'Moderna Minimalista', category: 'Boda / Vanguardia', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'split-screen', name: 'Vanguardia Dividida', category: 'Boda / Vanguardia', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'magazine', name: 'Estilo Editorial', category: 'XV / Gala', image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'romantic-botanical', name: 'Elegancia Floral', category: 'XV / Primavera', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'floral-symmetry', name: 'Simetría Floral', category: 'Boda / Jardín', image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'neon-glow', name: 'Fiesta Neón', category: 'Cumpleaños / Party', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'luxury-gold', name: 'Lujo Metálico', category: 'Gala / Aniversario', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'passport', name: 'Pase de Abordaje', category: 'Boda Destino', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'polaroid-vintage', name: 'Retro Fotográfico', category: 'Graduación / Retro', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'whimsical-kids', name: 'Fantasía Infantil', category: 'Infantil / Bautizo', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'kids-farm', name: 'Granja Festiva', category: 'Cumpleaños / Infantil', image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'gamer-party', name: 'Gamer Party', category: 'Cumpleaños / Gamer', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'pixel-craft', name: 'Mundo Píxel', category: 'Cumpleaños / Minecraft', image: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'rainbow-pop', name: 'Rainbow Pop', category: 'Cumpleaños / Infantil', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'collage', name: 'Collage Elegante', category: 'Boda / Álbum', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'reveal-bw', name: 'Misterio Monocromático', category: 'Gender Reveal / B&W', image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=400&auto=format&fit=crop' },
                                        { id: 'reveal-duo', name: 'Dúo Rosa & Azul', category: 'Gender Reveal / Dúo', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=400&auto=format&fit=crop' }
                                    ];

                                    const displayedTemplates = wizardTemplateFilter === 'all'
                                        ? allTemplates
                                        : allTemplates.filter(t => categoryTemplates.some(ct => ct.id === t.id) || t.id === data.theme);

                                    return (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between flex-wrap gap-2 pt-1 pb-2">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-bold text-stone-700">Recomendadas para:</span>
                                                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#DF3B94]/10 text-[#DF3B94] font-bold">
                                                        {categoryLabel}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-xs font-semibold">
                                                    <button
                                                        type="button"
                                                        onClick={() => setWizardTemplateFilter('recommended')}
                                                        className={`px-3 py-1 rounded-md transition-all ${
                                                            wizardTemplateFilter === 'recommended'
                                                                ? 'bg-white text-stone-900 shadow-sm font-bold'
                                                                : 'text-stone-500 hover:text-stone-800'
                                                        }`}
                                                    >
                                                        ✨ {categoryLabel} ({categoryTemplates.length})
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setWizardTemplateFilter('all')}
                                                        className={`px-3 py-1 rounded-md transition-all ${
                                                            wizardTemplateFilter === 'all'
                                                                ? 'bg-white text-stone-900 shadow-sm font-bold'
                                                                : 'text-stone-500 hover:text-stone-800'
                                                        }`}
                                                    >
                                                        🌐 Todas ({allTemplates.length})
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {displayedTemplates.map(tpl => {
                                                    const isSelected = data.theme === tpl.id;
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={tpl.id}
                                                            onClick={() => updateData({ theme: tpl.id })}
                                                            className={`relative flex flex-col overflow-hidden rounded-xl border text-left transition-all ${
                                                                isSelected ? 'border-[#DF3B94] ring-2 ring-[#DF3B94]/30 shadow-md scale-[1.02]' : 'border-stone-200 hover:border-stone-300 opacity-80 hover:opacity-100'
                                                            }`}
                                                        >
                                                            <div className="h-20 w-full relative">
                                                                <img src={tpl.image} alt={tpl.name} className="w-full h-full object-cover" />
                                                                {isSelected && (
                                                                    <div className="absolute top-1.5 right-1.5 bg-[#DF3B94] text-white p-1 rounded-full text-[10px] font-bold shadow-sm">
                                                                        ✓
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="p-2 bg-white flex-1">
                                                                <p className="text-[11px] font-bold text-stone-900 leading-tight">{tpl.name}</p>
                                                                <p className="text-[9px] text-stone-400 mt-0.5">{tpl.category}</p>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 md:space-y-10">
                        <div className="space-y-1">
                            <h2 className="text-xl md:text-2xl font-display font-extrabold text-stone-900">Ubicación del Evento</h2>
                            <p className="text-xs md:text-sm text-stone-500 font-normal">Define dónde ocurrirá la magia.</p>
                        </div>
                        
                        {/* Sección Misa / Ceremonia (solo para eventos religiosos/formales) */}
                        {!['gender_reveal', 'birthday', 'corporate'].includes(data.event_type) && (
                            <div className="p-5 md:p-8 border border-stone-200 bg-stone-50/60 rounded-[1.5rem] md:rounded-[2rem] space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#DF3B94] flex items-center gap-2">
                                        <Church className="h-4 w-4" /> Misa / Ceremonia
                                    </h3>
                                    <span className="text-[11px] text-stone-600 font-medium">Opcional</span>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="block text-xs uppercase font-bold text-stone-700 mb-2 tracking-wider ml-1">Lugar / Parroquia</label>
                                        <input
                                            type="text"
                                            value={data.misa_name}
                                            onChange={(e) => updateData({ misa_name: e.target.value })}
                                            className="block w-full rounded-xl md:rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm md:text-base text-stone-900 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] transition-all"
                                            placeholder="Ej. Parroquia de San Juan"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase font-bold text-stone-700 mb-2 tracking-wider ml-1">Hora</label>
                                        <input
                                            type="time"
                                            value={data.misa_time}
                                            onChange={(e) => updateData({ misa_time: e.target.value })}
                                            className="block w-full rounded-xl md:rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm md:text-base text-stone-900 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-stone-700 mb-2 tracking-wider ml-1">Dirección</label>
                                    <input
                                        type="text"
                                        value={data.misa_address}
                                        onChange={(e) => updateData({ misa_address: e.target.value })}
                                        className="block w-full rounded-xl md:rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm md:text-base text-stone-900 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] transition-all"
                                        placeholder="Calle, Número, Colonia, Ciudad..."
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs uppercase font-bold text-stone-700 tracking-wider ml-1">
                                            Link de Google Maps
                                        </label>
                                        {data.misa_maps_link && (
                                            <a
                                                href={data.misa_maps_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full transition-colors"
                                            >
                                                <ExternalLink className="h-3 w-3" /> Probar enlace
                                            </a>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="url"
                                            value={data.misa_maps_link}
                                            onChange={(e) => updateData({ misa_maps_link: e.target.value })}
                                            className="block w-full rounded-xl md:rounded-2xl border border-stone-200 bg-white pl-10 pr-4 py-3 text-sm md:text-base text-stone-900 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] transition-all"
                                            placeholder="Pega aquí el enlace (ej. https://maps.app.goo.gl/...)"
                                        />
                                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                                    </div>
                                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const query = [data.misa_name, data.misa_address].filter(Boolean).join(' ') || 'iglesia';
                                                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all border border-stone-200 shadow-sm"
                                        >
                                            <MapPin className="h-3.5 w-3.5 text-[#DF3B94]" />
                                            Buscar {data.misa_name ? `"${data.misa_name}"` : 'lugar'} en Google Maps
                                            <ExternalLink className="h-3 w-3 text-stone-400" />
                                        </button>
                                        <p className="text-[11px] text-stone-500 font-normal">
                                            💡 En Maps: haz clic en <strong>Compartir</strong> &gt; <strong>Copiar vínculo</strong> y pégalo arriba.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sección Celebración */}
                        <div className="p-5 md:p-8 border border-stone-200 bg-stone-50/60 rounded-[1.5rem] md:rounded-[2rem] space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-stone-900 flex items-center gap-2">
                                    <PartyPopper className="h-4 w-4 text-[#DF3B94]" /> Celebración / Recepción
                                </h3>
                                <span className="text-[11px] text-stone-600 font-medium">Principal</span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="block text-xs uppercase font-bold text-stone-700 mb-2 tracking-wider ml-1">Lugar / Salón o Hacienda</label>
                                    <input
                                        type="text"
                                        value={data.venue_name}
                                        onChange={(e) => updateData({ venue_name: e.target.value })}
                                        className="block w-full rounded-xl md:rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm md:text-base text-stone-900 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] transition-all"
                                        placeholder="Ej. Hacienda Los Arcos"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-stone-700 mb-2 tracking-wider ml-1">Hora</label>
                                    <input
                                        type="time"
                                        value={data.venue_time}
                                        onChange={(e) => updateData({ venue_time: e.target.value })}
                                        className="block w-full rounded-xl md:rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm md:text-base text-stone-900 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-stone-700 mb-2 tracking-wider ml-1">Dirección</label>
                                <input
                                    type="text"
                                    value={data.venue_address}
                                    onChange={(e) => updateData({ venue_address: e.target.value })}
                                    className="block w-full rounded-xl md:rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm md:text-base text-stone-900 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] transition-all"
                                    placeholder="Calle Principal 123, Colonia, Ciudad..."
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs uppercase font-bold text-stone-700 tracking-wider ml-1">
                                        Link de Google Maps
                                    </label>
                                    {data.maps_link && (
                                        <a
                                            href={data.maps_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full transition-colors"
                                        >
                                            <ExternalLink className="h-3 w-3" /> Probar enlace
                                        </a>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={data.maps_link}
                                        onChange={(e) => updateData({ maps_link: e.target.value })}
                                        className="block w-full rounded-xl md:rounded-2xl border border-stone-200 bg-white pl-10 pr-4 py-3 text-sm md:text-base text-stone-900 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] transition-all"
                                        placeholder="Pega aquí el enlace (ej. https://maps.app.goo.gl/...)"
                                    />
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                                </div>
                                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const query = [data.venue_name, data.venue_address].filter(Boolean).join(' ') || 'salón de eventos';
                                            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all border border-stone-200 shadow-sm"
                                    >
                                        <MapPin className="h-3.5 w-3.5 text-[#DF3B94]" />
                                        Buscar {data.venue_name ? `"${data.venue_name}"` : 'lugar'} en Google Maps
                                        <ExternalLink className="h-3 w-3 text-stone-400" />
                                    </button>
                                    <p className="text-[11px] text-stone-500 font-normal">
                                        💡 En Maps: haz clic en <strong>Compartir</strong> &gt; <strong>Copiar vínculo</strong> y pégalo arriba.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8">
                        <div className="space-y-1">
                            <h2 className="text-xl md:text-2xl font-display font-extrabold text-stone-900">Detalles Finales</h2>
                            <p className="text-xs md:text-sm text-stone-500 font-normal">Personaliza la experiencia para tus invitados.</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs uppercase font-bold text-stone-700 mb-2 tracking-wider ml-1">Código de Vestimenta</label>
                                <select
                                    value={
                                        ['Formal', 'Etiqueta Rigurosa (Black Tie)', 'Semiformal / Cóctel', 'Formal de Playa / Guayabera', 'Casual Elegante', 'Riguroso Blanco', 'Sin Código de Vestimenta'].includes(data.dress_code)
                                            ? data.dress_code
                                            : data.dress_code ? 'custom' : ''
                                    }
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === 'custom') {
                                            updateData({ dress_code: '' });
                                        } else {
                                            updateData({ dress_code: val });
                                        }
                                    }}
                                    className="block w-full rounded-xl md:rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-3 md:py-4 text-sm md:text-base text-stone-900 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] focus:bg-white transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Selecciona un Código de Vestimenta...</option>
                                    <option value="Formal">Formal</option>
                                    <option value="Etiqueta Rigurosa (Black Tie)">Etiqueta Rigurosa (Black Tie)</option>
                                    <option value="Semiformal / Cóctel">Semiformal / Cóctel</option>
                                    <option value="Formal de Playa / Guayabera">Formal de Playa / Guayabera</option>
                                    <option value="Casual Elegante">Casual Elegante</option>
                                    <option value="Riguroso Blanco">Riguroso Blanco (White Party)</option>
                                    <option value="Sin Código de Vestimenta">Sin Código de Vestimenta (Libre)</option>
                                    <option value="custom">✍️ Escribir código personalizado...</option>
                                </select>

                                {(!['Formal', 'Etiqueta Rigurosa (Black Tie)', 'Semiformal / Cóctel', 'Formal de Playa / Guayabera', 'Casual Elegante', 'Riguroso Blanco', 'Sin Código de Vestimenta'].includes(data.dress_code)) && (
                                    <input
                                        type="text"
                                        value={data.dress_code}
                                        onChange={(e) => updateData({ dress_code: e.target.value })}
                                        className="mt-3 block w-full rounded-xl md:rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] focus:bg-white transition-all"
                                        placeholder="Ej. Traje de noche, Vestido largo, Vestido de cóctel..."
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-stone-700 mb-2 tracking-wider ml-1">Fecha Límite para Confirmar (RSVP)</label>
                                <input
                                    type="date"
                                    value={data.rsvp_deadline}
                                    onChange={(e) => updateData({ rsvp_deadline: e.target.value })}
                                    className="block w-full rounded-xl md:rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-3 md:py-4 text-sm md:text-base text-stone-900 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] focus:bg-white transition-all"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-12 flex items-center justify-between pt-8 border-t border-stone-100">
                    {step > 1 ? (
                        <button onClick={handleBack} className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-stone-600 hover:text-stone-900 transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Atrás
                        </button>
                    ) : (
                        <button onClick={() => navigate('/dashboard')} className="text-xs uppercase font-bold tracking-wider text-stone-500 hover:text-stone-800 transition-colors">
                            Cancelar
                        </button>
                    )}

                    {step < 3 ? (
                        <button 
                            onClick={handleNext} 
                            disabled={!data.title || !data.date_time}
                            className="px-8 py-4 bg-stone-900 text-white rounded-2xl text-xs uppercase font-bold tracking-wider shadow-xl shadow-stone-200/50 hover:bg-[#DF3B94] transition-all disabled:opacity-30 disabled:grayscale flex items-center gap-2"
                        >
                            Siguiente <ArrowRight className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-10 py-4 bg-[#DF3B94] text-white rounded-2xl text-xs uppercase font-bold tracking-wider shadow-xl shadow-pink-200/50 hover:bg-[#c92f82] transition-all disabled:opacity-50 flex items-center gap-3"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {isEditing ? 'Guardar Cambios' : (preselectedPlan ? 'Continuar al Pago' : 'Elegir Plan y Publicar')}
                        </button>
                    )}
                </div>
            </div>
        </>
    )}
</div>
);
}
