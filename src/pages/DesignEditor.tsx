import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Loader2, Save, ArrowLeft, Image as ImageIcon, Type, Upload, X } from 'lucide-react';
import { useFeatureAccess } from '../hooks/useFeatureAccess';

type DesignConfig = {
    primaryColor: string;
    heroTextColor: string;
    accentColor: string;
    cardBgColor: string;
    heroImage: string;
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
    // Ubicación Detallada (Misa / Ceremonia)
    misa_name: string;
    misa_address: string;
    misa_maps_link: string;
    misa_time: string;

    // Asistencia
    dress_code: string;
    rsvp_deadline: string;
};

const DEFAULT_CONFIG: DesignConfig = {
    primaryColor: '#1B2E1D',
    heroTextColor: '#ffffff',
    accentColor: '#BD7474',
    cardBgColor: '#C17B6A',
    heroImage: '',
    welcomeMessage: 'Te invitamos a ser parte de una tarde inolvidable de gratitud, risas y la calidez de nuestra familia.',
    welcomeSubtitle: '70 años',
    
    showDetails: true,
    showCountdown: true,
    showMap: true,
    showGallery: true,
    showWhatsAppRSVP: true,

    enableGuestList: false,
    enableReminders: false,
    enableExcel: false,
    enableMetrics: false,

    enableAi: false,
    enableQr: false,
    enableAccessControl: false,
    enableCustomDomain: false,
    enableTableManagement: false,

    misa_name: '',
    misa_address: '',
    misa_maps_link: '',
    misa_time: '',

    dress_code: '',
    rsvp_deadline: '',
};

export default function DesignEditor() {
    const { id } = useParams<{ id: string }>();
    const { isLoading: loadingAccess } = useFeatureAccess(id || undefined);
    
    const { user } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
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
                    welcomeMessage: c.welcome_message  ?? c.welcomeMessage  ?? DEFAULT_CONFIG.welcomeMessage,
                    welcomeSubtitle:c.subtitle         ?? c.welcomeSubtitle ?? DEFAULT_CONFIG.welcomeSubtitle,
                    showDetails:    c.showDetails    ?? DEFAULT_CONFIG.showDetails,
                    showCountdown:  c.showCountdown  ?? DEFAULT_CONFIG.showCountdown,
                    showMap:        c.showMap        ?? DEFAULT_CONFIG.showMap,
                    showGallery:    c.showGallery    ?? DEFAULT_CONFIG.showGallery,
                    showWhatsAppRSVP: c.showWhatsAppRSVP ?? DEFAULT_CONFIG.showWhatsAppRSVP,
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
                });
            }
            setLoading(false);
        };
        fetchEvent();
    }, [id]);

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
                welcome_message:  config.welcomeMessage,
                subtitle:         config.welcomeSubtitle,
                
                // Explicitly keep feature flags from current state to be double safe
                showDetails:      config.showDetails,
                showCountdown:    config.showCountdown,
                showMap:          config.showMap,
                showGallery:      config.showGallery,
                showWhatsAppRSVP: config.showWhatsAppRSVP,
                
                enableGuestList:      config.enableGuestList,
                enableReminders:      config.enableReminders,
                enableExcel:          config.enableExcel,
                enableMetrics:        config.enableMetrics,
                enableAi:             config.enableAi,
                enableQr:             config.enableQr,
                enableAccessControl:  config.enableAccessControl,
                enableCustomDomain:   config.enableCustomDomain,
                enableTableManagement:config.enableTableManagement,

                // Ubicación Misa
                misa_name:            config.misa_name,
                misa_address:         config.misa_address,
                misa_maps_link:       config.misa_maps_link,
                misa_time:            config.misa_time,
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
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Link to={`/dashboard/event/${id}`} className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-600 mb-6 transition-colors font-bold uppercase tracking-widest text-[10px]">
                        <ArrowLeft className="h-4 w-4" /> Volver al panel del evento
                    </Link>
                    <h1 className="text-4xl font-serif text-[#1B2E1D]">Visual Editor Builder</h1>
                    <p className="text-sm font-light italic text-stone-500 mt-2">Personaliza textos, imagen de portada y características adicionales de tu invitación.</p>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-[#1B2E1D] text-white rounded-2xl shadow-xl hover:scale-105 transition-all text-[11px] font-bold uppercase tracking-widest disabled:opacity-50"
                >
                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Guardar Diseño
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Text section */}
                <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-stone-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] space-y-8 h-full">
                    <div className="flex items-center gap-4 border-b border-stone-50 pb-6">
                        <div className="h-12 w-12 bg-[#BD7474]/10 rounded-2xl flex items-center justify-center text-[#BD7474]">
                            <Type className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-serif text-[#1B2E1D]">Textos Personalizados</h2>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 pl-1">Subtítulo (ej. 70 años, Boda)</label>
                            <input
                                type="text"
                                value={config.welcomeSubtitle}
                                onChange={(e) => setConfig({ ...config, welcomeSubtitle: e.target.value })}
                                className="w-full bg-[#FDFBF7] px-6 py-5 rounded-2xl border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800 text-lg font-serif"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 pl-1">Mensaje de Bienvenida Corto</label>
                            <textarea
                                value={config.welcomeMessage}
                                onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                                rows={4}
                                className="w-full bg-[#FDFBF7] px-6 py-5 rounded-2xl border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-[#1B2E1D]/10 resize-none text-stone-600 font-serif italic text-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Imagery section */}
                <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-stone-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] space-y-8 h-full">
                    <div className="flex items-center gap-4 border-b border-stone-50 pb-6">
                        <div className="h-12 w-12 bg-[#BD7474]/10 rounded-2xl flex items-center justify-center text-[#BD7474]">
                            <ImageIcon className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-serif text-[#1B2E1D]">Imagen Sensorial</h2>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 pl-1">Imagen de Portada</label>

                        {/* Upload button */}
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
                            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-dashed border-[#BD7474]/40 bg-[#BD7474]/5 hover:bg-[#BD7474]/10 transition-all text-[#BD7474] font-bold text-[11px] uppercase tracking-widest disabled:opacity-50"
                        >
                            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                            {uploading ? 'Subiendo...' : 'Subir desde mi dispositivo'}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-stone-100" />
                            <span className="text-[10px] text-stone-400 uppercase tracking-widest">o pega una URL</span>
                            <div className="flex-1 h-px bg-stone-100" />
                        </div>

                        <input
                            type="url"
                            placeholder="https://images.unsplash.com/photo-..."
                            value={config.heroImage}
                            onChange={(e) => setConfig({ ...config, heroImage: e.target.value })}
                            className="w-full bg-[#FDFBF7] px-6 py-5 rounded-2xl border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-[#1B2E1D]/10 font-mono text-sm text-stone-600"
                        />

                        {/* Preview */}
                        <div className={`w-full h-48 sm:h-64 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden relative transition-all ${config.heroImage ? 'border-transparent bg-stone-100' : 'border-stone-200 bg-stone-50'}`}>
                            {config.heroImage ? (
                                <>
                                    <img src={config.heroImage} className="w-full h-full object-cover" alt="Preview Background" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent p-6 flex flex-col justify-end">
                                        <p className="text-white text-[10px] uppercase tracking-[0.4em] font-bold">Vista Previa</p>
                                    </div>
                                    <button
                                        onClick={() => setConfig(prev => ({ ...prev, heroImage: '' }))}
                                        className="absolute top-3 right-3 bg-black/50 hover:bg-red-500 text-white rounded-full p-1.5 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </>
                            ) : (
                                <p className="text-stone-300 font-serif italic text-xl">Sin Imagen Personalizada</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* ── Color Palette per section ── */}
            <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-stone-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] space-y-8">
                <div className="flex items-center gap-4 border-b border-stone-50 pb-6">
                    <div className="h-12 w-12 bg-[#BD7474]/10 rounded-2xl flex items-center justify-center" style={{color:'#BD7474'}}>
                        <span className="text-xl">🎨</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif text-[#1B2E1D]">Paleta de Colores por Sección</h2>
                        <p className="text-xs text-stone-400 mt-1">Cada zona de tu invitación puede tener su propio color</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">

                    {/* Hero text color */}
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">🖋 Texto en Portada</label>
                        <p className="text-xs text-stone-400 italic -mt-2">Color del nombre y subtítulo sobre la imagen</p>
                        <div className="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-2xl shadow-inner">
                            <input
                                type="color"
                                value={config.heroTextColor}
                                onChange={(e) => setConfig({ ...config, heroTextColor: e.target.value })}
                                className="h-12 w-16 rounded-xl cursor-pointer bg-transparent border-0 p-0 flex-shrink-0"
                            />
                            <span className="font-mono text-xs text-stone-500 uppercase">{config.heroTextColor}</span>
                        </div>
                        {/* Live preview */}
                        <div className="rounded-xl overflow-hidden h-20 relative flex items-center justify-center"
                            style={{background: config.heroImage ? `url(${config.heroImage}) center/cover` : 'linear-gradient(135deg,#f5ede8,#faf0ec)'}}>
                            <div className="absolute inset-0 bg-black/20" />
                            <p className="relative z-10 font-serif text-lg font-light" style={{color: config.heroTextColor}}>Tu Nombre Aquí</p>
                        </div>
                    </div>

                    {/* Accent color */}
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">✨ Acentos y Fechas</label>
                        <p className="text-xs text-stone-400 italic -mt-2">Números de fecha, iconos decorativos</p>
                        <div className="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-2xl shadow-inner">
                            <input
                                type="color"
                                value={config.accentColor}
                                onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                                className="h-12 w-16 rounded-xl cursor-pointer bg-transparent border-0 p-0 flex-shrink-0"
                            />
                            <span className="font-mono text-xs text-stone-500 uppercase">{config.accentColor}</span>
                        </div>
                        {/* Live preview */}
                        <div className="rounded-xl bg-white border border-stone-100 h-20 flex items-center justify-center gap-4 shadow-sm">
                            <span className="font-serif text-4xl font-light" style={{color: config.accentColor}}>01</span>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-stone-400">Mayo</p>
                                <p className="font-serif text-xl" style={{color: config.accentColor}}>2026</p>
                            </div>
                        </div>
                    </div>

                    {/* Card background color */}
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">🪷 Tarjeta Decorativa</label>
                        <p className="text-xs text-stone-400 italic -mt-2">Color del fondo de la tarjeta RSVP</p>
                        <div className="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded-2xl shadow-inner">
                            <input
                                type="color"
                                value={config.cardBgColor}
                                onChange={(e) => setConfig({ ...config, cardBgColor: e.target.value })}
                                className="h-12 w-16 rounded-xl cursor-pointer bg-transparent border-0 p-0 flex-shrink-0"
                            />
                            <span className="font-mono text-xs text-stone-500 uppercase">{config.cardBgColor}</span>
                        </div>
                        {/* Live preview */}
                        <div className="rounded-xl h-20 flex items-center justify-center" style={{background: config.cardBgColor}}>
                            <div className="bg-white rounded-lg px-4 py-1.5">
                                <p className="text-xs" style={{color: config.cardBgColor}}>■ Tarjeta RSVP</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {/* ── Advanced Features (Gated by Plan) ── */}
            <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-stone-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] space-y-8">
                <div className="flex items-center gap-4 border-b border-stone-50 pb-6">
                    <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                        <span className="text-xl">🚀</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif text-[#1B2E1D]">Características Avanzadas</h2>
                        <p className="text-xs text-stone-400 mt-1">Activa funciones exclusivas de tu plan personalizado</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { id: 'enableAi', label: 'Asistente IA', desc: 'Generación de textos con IA', icon: '🤖' },
                        { id: 'enableQr', label: 'Pases Digitales QR', desc: 'Códigos QR para acceso rápido', icon: '📱' },
                        { id: 'showGifts', label: 'Mesa de Regalos', desc: 'Añade una sección para regalos', icon: '🎁' },
                        { id: 'enableTableManagement', label: 'Gestión de Mesas', desc: 'Asigna lugares a tus invitados', icon: '🍽️' },
                        { id: 'enableAccessControl', label: 'Control de Acceso', desc: 'Check-in en tiempo real', icon: '🛡️' },
                        { id: 'enableCustomDomain', label: 'Dominio Propio', desc: 'URL personalizada (ej. boda.com)', icon: '🌐' },
                        { id: 'enableMetrics', label: 'Métricas Reales', desc: 'Estadísticas de visualización', icon: '📊' },
                    ].map((feat) => (
                        <div 
                            key={feat.id}
                            onClick={() => setConfig(prev => ({ ...prev, [feat.id]: !prev[feat.id as keyof DesignConfig] }))}
                            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col gap-3 group ${
                                config[feat.id as keyof DesignConfig] 
                                    ? 'border-[#1B2E1D] bg-[#1B2E1D]/5' 
                                    : 'border-stone-50 bg-[#FDFBF7] hover:border-stone-200'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-2xl">{feat.icon}</span>
                                <div className={`h-6 w-11 rounded-full relative transition-colors ${config[feat.id as keyof DesignConfig] ? 'bg-[#1B2E1D]' : 'bg-stone-200'}`}>
                                    <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${config[feat.id as keyof DesignConfig] ? 'left-6' : 'left-1'}`} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider">{feat.label}</h3>
                                <p className="text-[10px] text-stone-400 mt-1">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Misa / Ceremonia Detail ── */}
            <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-stone-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] space-y-8">
                <div className="flex items-center gap-4 border-b border-stone-50 pb-6">
                    <div className="h-12 w-12 bg-[#BD7474]/10 rounded-2xl flex items-center justify-center text-[#BD7474]">
                        <span className="text-xl">⛪</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif text-[#1B2E1D]">Detalles de Misa</h2>
                        <p className="text-xs text-stone-400 mt-1">Personaliza el lugar y hora de la ceremonia</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 pl-1">Nombre del Lugar</label>
                        <input
                            type="text"
                            value={config.misa_name}
                            onChange={(e) => setConfig({ ...config, misa_name: e.target.value })}
                            className="w-full bg-[#FDFBF7] px-6 py-4 rounded-2xl border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                            placeholder="Ej. Parroquia de San Juan"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 pl-1">Hora de Inicio</label>
                        <input
                            type="time"
                            value={config.misa_time}
                            onChange={(e) => setConfig({ ...config, misa_time: e.target.value })}
                            className="w-full bg-[#FDFBF7] px-6 py-4 rounded-2xl border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                        />
                    </div>
                    <div className="sm:col-span-2 space-y-3">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 pl-1">Dirección Completa</label>
                        <input
                            type="text"
                            value={config.misa_address}
                            onChange={(e) => setConfig({ ...config, misa_address: e.target.value })}
                            className="w-full bg-[#FDFBF7] px-6 py-4 rounded-2xl border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                            placeholder="Calle, Número, Colonia..."
                        />
                    </div>
                    <div className="sm:col-span-2 space-y-3">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 pl-1">Enlace de Google Maps</label>
                        <input
                            type="url"
                            value={config.misa_maps_link}
                            onChange={(e) => setConfig({ ...config, misa_maps_link: e.target.value })}
                            className="w-full bg-[#FDFBF7] px-6 py-4 rounded-2xl border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800 font-mono text-xs"
                            placeholder="https://maps.app.goo.gl/..."
                        />
                    </div>
                </div>
            </div>

            {/* ── Asistencia ── */}
            <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-stone-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] space-y-8">
                <div className="flex items-center gap-4 border-b border-stone-50 pb-6">
                    <div className="h-12 w-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-400">
                        <span className="text-xl">📅</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif text-[#1B2E1D]">Configuración de Asistencia</h2>
                        <p className="text-xs text-stone-400 mt-1">Configura el código de vestimenta y el límite de confirmación</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 pl-1">Código de Vestimenta (Dress Code)</label>
                        <input
                            type="text"
                            value={config.dress_code}
                            onChange={(e) => setConfig({ ...config, dress_code: e.target.value })}
                            className="w-full bg-[#FDFBF7] px-6 py-4 rounded-2xl border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                            placeholder="Ej. Formal, Cocktail..."
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 pl-1">Fecha Límite de Confirmación</label>
                        <input
                            type="date"
                            value={config.rsvp_deadline}
                            onChange={(e) => setConfig({ ...config, rsvp_deadline: e.target.value })}
                            className="w-full bg-[#FDFBF7] px-6 py-4 rounded-2xl border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                        />
                    </div>
                </div>
            </div>
            
            {/* Live Preview Button */}
            <div className="flex justify-center pt-8 border-t border-stone-200">
                <Link to={`/cecilia-70?t=test`} target="_blank" className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#BD7474] hover:text-[#1B2E1D] transition-colors border-b border-[#BD7474]/30 pb-1">
                    Ver Plantilla de Ejemplo Completa →
                </Link>
            </div>
        </div>
    );
}
