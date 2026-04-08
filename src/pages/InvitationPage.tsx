import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { MapPin, Gift, CheckCircle2, Clock, Heart, Music, Camera, Sparkles, User, Mail, Home, Calendar, Hotel, Download, Loader2, Settings, Eye, EyeOff, Shield, Activity, X } from 'lucide-react';
import type { Event, Guest } from '../types/database.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { generateInvitationPDF, generateQRAsPDF } from '../utils/generatePDF';
import { MOCK_EVENTS, MOCK_GUESTS } from '../lib/mockData';
import { QRCodeCanvas } from 'qrcode.react';

export default function InvitationPage() {
    const { slug } = useParams<{ slug: string }>();
    const [searchParams] = useSearchParams();

    // El token se lee primero del query param (?t=), luego de sessionStorage (para refreshes).
    // Una vez cargado el guest, se limpia la URL para evitar que el token quede en
    // el historial del browser y en headers Referer al navegar a sitios externos.
    const sessionKey = slug ? `inv_token_${slug}` : null;
    const rawToken = searchParams.get('t');
    const guestToken: string | null =
        rawToken ?? (sessionKey ? sessionStorage.getItem(sessionKey) : null);

    const toast = useToast();
    const { user } = useAuth();
    const [event, setEvent] = useState<Event | null>(null);
    const [guest, setGuest] = useState<Guest | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rsvpSuccess, setRsvpSuccess] = useState(false);
    const [envelopeOpened, setEnvelopeOpened] = useState(false);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Form states for General Registration
    const [guestName, setGuestName] = useState('');
    const [numGuests, setNumGuests] = useState('1');
    const [error, setError] = useState<string | null>(null);

    const qrCanvasRef = useRef<HTMLCanvasElement>(null);
    const [notFound, setNotFound] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    // Admin mode: requires ?t=admin in URL + authenticated user who owns this event
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [lastSaveStatus, setLastSaveStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');

    const KEY_MAPPINGS: Record<string, string> = {
        showMap:          'show_map',
        showCountdown:    'show_countdown',
        showGallery:      'show_gallery',
        showDetails:      'show_details',
        showGifts:        'show_gifts',
        showWhatsAppRSVP: 'show_whatsapp_rsvp'
    };

    const handleUpdateFeature = async (key: string, value: boolean) => {
        if (!event) return;
        
        // Feedbak local instantáneo (UI reactiva)
        const updatedConfig = { 
            ...(event.theme_config || {}), 
            [key]: value 
        };
        
        // Sincronizamos con el formato legacy (snake_case)
        const legacyKey = KEY_MAPPINGS[key];
        if (legacyKey) (updatedConfig as any)[legacyKey] = value;
        
        setEvent({ ...event, theme_config: updatedConfig });
        
        setLastSaveStatus('saving');
        try {
            const { data: updated, error: updateError } = await supabase
                .from('events')
                .update({ theme_config: updatedConfig })
                .eq('id', event.id)
                .select('id');

            if (updateError) throw updateError;

            if (!updated || updated.length === 0) {
                throw new Error('RLS bloqueó el update (0 filas afectadas). Verifica las políticas de Supabase para la tabla events.');
            }

            setLastSaveStatus('ok');
            toast.success('¡Guardado!');
        } catch (err: any) {
            console.error('[SYNC_ERROR]', err);
            setLastSaveStatus('error');
            toast.error('Error al guardar: ' + (err.message || 'Error de red'));
            setEvent({ ...event, theme_config: event.theme_config });
        }
    };


    const downloadQR = useCallback(() => {
        const canvas = qrCanvasRef.current;
        if (!canvas || !event) return;
        
        try {
            const url = canvas.toDataURL('image/png');
            generateQRAsPDF(event, guestName, url);
        } catch (err: any) {
            console.error('Error generating QR PDF:', err);
            if (err?.message === 'popup_blocked') {
                toast.warning('Permite las ventanas emergentes en tu navegador para descargar el PDF.');
            } else {
                toast.error('No se pudo generar el PDF. Intenta tomar una captura de pantalla.');
            }
        }
    }, [event, guestName]);

    useEffect(() => {
        if (!slug) return;
        fetchEventAndGuest();
    }, [slug, guestToken]);

    const fetchEventAndGuest = async () => {
        setLoading(true);

        if (!import.meta.env.VITE_SUPABASE_URL) {
            const mockEvent = MOCK_EVENTS.find(e => e.slug === slug);
            setEvent(mockEvent || null);
            if (guestToken && mockEvent) {
                const mockGuest = MOCK_GUESTS.find(g => g.guest_token === guestToken);
                setGuest(mockGuest || null);
            }
            // In mock mode, allow admin if ?t=admin (no real auth available)
            if (rawToken === 'admin') setIsAdminMode(true);
            setLoading(false);
            return;
        }

        const { data: eventData, error: eventError } = await supabase
            .from('events')
            .select('*')
            .eq('slug', slug)
            .single();

        if (eventError || !eventData) {
            console.error('Event not found');
            setNotFound(true);
            setLoading(false);
            return;
        }
        setEvent(eventData);

        // Admin mode: only grant access if ?t=admin AND the logged-in user owns this event
        if (rawToken === 'admin' && user && user.id === eventData.user_id) {
            setIsAdminMode(true);
        } else if (rawToken === 'admin') {
            // Someone tried the URL trick without being the owner — silently deny
            console.warn('[SECURITY] Admin access denied: not the event owner.');
        }

        if (guestToken) {
            const { data: tokenData, error: tokenError } = await supabase
                .rpc('get_guest_by_token', { p_token: guestToken, p_slug: slug });

            if (!tokenError && tokenData) {
                const guestData = tokenData.guest;
                const rsvpData  = tokenData.rsvp;
                if (guestData) {
                    setGuest(guestData);
                    setGuestName(guestData.name);
                    if (rsvpData) {
                        setNumGuests((rsvpData.plus_ones_confirmed + 1).toString());
                        if (rsvpData.status === 'yes' || rsvpData.status === 'no') {
                            setRsvpSuccess(true);
                        }
                    }
                    // Guardar token en sessionStorage y limpiar la URL.
                    // Así el token no queda en el historial del browser ni
                    // se filtra via header Referer al navegar a links externos.
                    if (sessionKey && rawToken) {
                        sessionStorage.setItem(sessionKey, rawToken);
                        window.history.replaceState({}, '', window.location.pathname);
                    }
                }
            }
        }
        setLoading(false);
    };

    const handleRsvp = async (status: 'yes' | 'no') => {
        if (!event) {
            setError('No se pudo cargar el evento. Recarga la página e intenta de nuevo.');
            return;
        }
        const cleanedName = guestName.trim();
        if (!cleanedName) {
            setError('Por favor ingresa tu nombre completo');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            if (guestToken) {
                // Invitado con token personalizado: RPC valida token + slug server-side
                const { error: rsvpError } = await supabase.rpc('submit_rsvp_by_token', {
                    p_token:     guestToken,
                    p_slug:      slug,
                    p_status:    status,
                    p_plus_ones: (parseInt(numGuests) || 1) - 1,
                });
                if (rsvpError) throw rsvpError;
            } else {
                // Registro general (sin token): RPC busca/crea guest y hace upsert del RSVP
                const { error: rsvpError } = await supabase.rpc('register_rsvp_by_name', {
                    p_slug:      slug,
                    p_name:      cleanedName,
                    p_status:    status,
                    p_plus_ones: (parseInt(numGuests) || 1) - 1,
                });
                if (rsvpError) throw rsvpError;
            }

            setRsvpSuccess(true);
        } catch (err: any) {
            console.error('RSVP Error:', err);
            setError('Error al procesar tu confirmación. Reintenta por favor.');
        } finally {
            setSubmitting(false);
        }
    };

    // Countdown timer effect
    useEffect(() => {
        if (!event) return;

        const updateCountdown = () => {
            const now = new Date().getTime();
            const eventTime = new Date(event.date_time).getTime();
            const distance = eventTime - now;

            if (distance > 0) {
                setCountdown({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [event]);

    // Generate calendar links
    const generateGoogleCalendarLink = () => {
        if (!event) return '';
        const eventDate = new Date(event.date_time);
        const startDate = format(eventDate, "yyyyMMdd'T'HHmmss");
        const endDate = format(new Date(eventDate.getTime() + 3 * 60 * 60 * 1000), "yyyyMMdd'T'HHmmss");

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(`Te esperamos en nuestra ${event.event_type === 'wedding' ? 'boda' : 'celebración'}`)}&location=${encodeURIComponent(event.venue_name || '')}`;
    };

    const generateICalLink = () => {
        if (!event) return '';
        const eventDate = new Date(event.date_time);
        const startDate = format(eventDate, "yyyyMMdd'T'HHmmss");
        const endDate = format(new Date(eventDate.getTime() + 3 * 60 * 60 * 1000), "yyyyMMdd'T'HHmmss");

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.title}
DESCRIPTION:Te esperamos en nuestra ${event.event_type === 'wedding' ? 'boda' : 'celebración'}
LOCATION:${event.venue_name || ''}
END:VEVENT
END:VCALENDAR`;

        return 'data:text/calendar;charset=utf8,' + encodeURIComponent(icsContent);
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-cream to-amber-50">
            <div className="text-center space-y-4">
                <Sparkles className="h-12 w-12 animate-pulse text-accent mx-auto" />
                <p className="text-stone-500 font-serif italic">Preparando tu invitación...</p>
            </div>
        </div>;
    }

    if (notFound || !event) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
                {/* Header */}
                <header className="w-full px-6 py-5 border-b border-[#1B2E1D]/8">
                    <Link to="/" className="text-2xl font-serif italic tracking-tighter text-[#1B2E1D]">
                        Invitto
                    </Link>
                </header>

                {/* Error content */}
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                    <div className="max-w-md">
                        {/* Icon */}
                        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6">
                            <Heart className="h-9 w-9 text-stone-300" />
                        </div>

                        {/* Message */}
                        <h1 className="text-2xl font-serif text-[#1B2E1D] mb-3">
                            Invitación no encontrada
                        </h1>
                        <p className="text-stone-500 text-sm leading-relaxed mb-8">
                            Es posible que el enlace haya expirado, que la invitación aún no esté disponible,
                            o que el link tenga un error tipográfico. Pide al organizador que te reenvíe el link correcto.
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1B2E1D] text-white text-sm font-medium rounded-full hover:bg-[#1B2E1D]/90 transition-colors"
                            >
                                <Home className="h-4 w-4" />
                                Ir al inicio
                            </Link>
                            <button
                                onClick={() => window.history.back()}
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-stone-200 text-stone-600 text-sm font-medium rounded-full hover:bg-stone-50 transition-colors"
                            >
                                Volver atrás
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="w-full px-6 py-4 text-center">
                    <p className="text-xs text-stone-400">
                        ¿Quieres crear tu propia invitación?{' '}
                        <Link to="/" className="underline underline-offset-2 hover:text-stone-600 transition-colors">
                            Conoce Invitto
                        </Link>
                    </p>
                </footer>
            </div>
        );
    }

    if (!event.is_published) {
        return <div className="flex h-screen items-center justify-center bg-cream text-stone-500">Este evento aún no está publicado.</div>;
    }

    const eventDate = new Date(event.date_time);

    // ── Dynamic config from Visual Editor ──
    const cfg = event.theme_config || {};
    const primaryColor = cfg.primary_color || '#1B2E1D';
    const heroTextColor = cfg.hero_text_color || '#ffffff';
    const accentColor   = cfg.accent_color   || cfg.primary_color || '#BD7474';
    const cardBgColor   = cfg.card_bg_color  || '#C17B6A';
    const heroImageUrl = cfg.hero_image_url || null;
    const subtitle = cfg.subtitle || '';
    const welcomeMessage = cfg.welcome_message || null;
    // Feature flags Compatibility Layer — Support both camelCase (Dashboard) and snake_case (Legacy)
    // Feature flags Compatibility Layer — Support both camelCase (Dashboard) and snake_case (Legacy)
    // Priority: new camelCase key ?? fallback to old snake_case ?? default value
    const isEn = (camelKey: string, snakeKey: string, def = true) => {
        const camelVal = cfg[camelKey];
        const snakeVal = cfg[snakeKey] ?? cfg['show_whats_app_r_s_v_p']; // Catch specific naming typo in DB
        
        if (camelVal !== undefined && camelVal !== null) {
            return camelVal === true || camelVal === 'enabled' || camelVal === 'true';
        }
        if (snakeVal !== undefined && snakeVal !== null) {
            return snakeVal === true || snakeVal === 'enabled' || snakeVal === 'true';
        }
        return def;
    };

    const showCountdown  = isEn('showCountdown',    'show_countdown', true);
    const showLocation   = isEn('showMap',          'show_map',       true);
    const showDressCode  = isEn('showDetails',      'show_details',   true);
    const showRSVP       = isEn('showWhatsAppRSVP', 'show_whatsapp_rsvp', true);
    const showGallery    = isEn('showGallery',      'show_gallery',   true);
    const showGifts      = isEn('showGifts',        'show_gifts',     false);

    // Advanced features toggled in SettingsPage (Commented out to satisfy TS no-unused-vars)
    /*
    const enableMetrics         = isEn('enableMetrics',         'enable_metrics',         false);
    const enableGuestList       = isEn('enableGuestList',       'enable_guest_list',       false);
    const enableReminders       = isEn('enableReminders',       'enable_reminders',       false);
    const enableExcel           = isEn('enableExcel',           'enable_excel',           false);
    const enableAi              = isEn('enableAi',              'ai_assistant',           false);
    const enableQr              = isEn('enableQr',              'qr_passes',              false);
    const enableAccessControl    = isEn('enableAccessControl',    'access_control',         false);
    const enableTableManagement = isEn('enableTableManagement', 'table_management',       false);
    */

    // ── Labels by event type ──
    const eventLabels: Record<string, { ceremony: string; reception: string; tagline: string }> = {
        wedding:    { ceremony: 'Misa', reception: 'Celebración', tagline: 'Nos Casamos' },
        birthday:   { ceremony: 'Misa', reception: 'Celebración', tagline: 'Cumpleaños' },
        xv:         { ceremony: 'Misa de XV', reception: 'Fiesta de XV', tagline: 'Mis XV Años' },
        baptism:    { ceremony: 'Misa de Bautizo', reception: 'Celebración', tagline: 'Bautizo' },
        graduation: { ceremony: 'Ceremonia', reception: 'Festejo', tagline: 'Graduación' },
    };
    const labels = eventLabels[event.event_type] || eventLabels['birthday'];
    const baseSlug = slug?.replace(/-pro$|-premium$/, '');
    const currentVersion = slug?.endsWith('-premium') ? 'premium' : slug?.endsWith('-pro') ? 'pro' : 'classic';
    const isDemo = baseSlug && [
        // XV Años
        'xv-sofia-2026',
        'xv-julia-2026',
        'xv-regina-2026',
        // Bodas
        'boda-ana-y-carlos',
        'boda-gabriela-arturo',
        'boda-isabel-rodrigo',
        // Cumpleaños
        'cumple-emilia',
        // Bautizos
        'bautizo-victoria',
        'bautizo-camila',
        // Graduaciones
        'graduacion-ana-psicologia',
        'graduacion-roberto-ingenieria',
        // Comunión
        'comunion-gael'
    ].includes(baseSlug);

    // Get tier — Personalized plan always counts as Premium (highest tier)
    const isPersonalized = event.plan === 'personalized' || event.plan === 'personalizado' || event.plan === 'pro' || event.theme_config?.plan === 'personalized';
    const isPro = event.theme_config?.isPro || currentVersion === 'pro' || isPersonalized;
    const isPremium = event.theme_config?.isPremium || currentVersion === 'premium' || isPersonalized;
    const tier = isPremium ? 'premium' : isPro ? 'pro' : 'classic';

    // PREMIUM FEATURE: Envelope intro screen
    if (isPremium && !envelopeOpened) {
        return (
            <div className="min-h-screen bg-stone-900 flex items-center justify-center p-6 relative overflow-hidden">

                {/* Envelope card */}
                <div className="relative z-10 max-w-3xl w-full">


                    {/* Main envelope card */}
                    <div className="relative bg-white rounded-2xl border border-stone-200 overflow-hidden">

                        <div className="p-12 sm:p-16 text-center relative">
                            {/* Envelope illustration - Enhanced */}
                            <div className="mb-12 relative">
                                <div className="w-80 h-64 mx-auto relative">
                                    {/* Shadow beneath envelope */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-8 bg-black/10 blur-xl rounded-full" />

                                    {/* Envelope back */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-stone-200 via-stone-100 to-stone-200 rounded-2xl shadow-xl" style={{
                                        clipPath: 'polygon(0 0, 50% 45%, 100% 0, 100% 100%, 0 100%)'
                                    }} />

                                    {/* Decorative borders on envelope */}
                                    <div className="absolute inset-4 border-2 border-stone-300/50 rounded-xl" style={{
                                        clipPath: 'polygon(5% 20%, 50% 50%, 95% 20%, 95% 95%, 5% 95%)'
                                    }} />

                                    {/* Front flap - animated */}
                                    <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-amber-100 via-rose-50 to-stone-100 border-4 border-stone-200 shadow-lg" style={{
                                        clipPath: 'polygon(0 0, 50% 65%, 100% 0)',
                                        transformOrigin: 'top center',
                                        animation: 'envelope-flap 3s ease-in-out infinite'
                                    }} />

                                    {/* Wax seal - Premium */}
                                    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20">
                                        <div className="relative">
                                            {/* Glow effect */}
                                            <div className="absolute -inset-4 bg-red-500/30 blur-2xl rounded-full animate-pulse" />

                                            {/* Seal base */}
                                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-900 shadow-2xl flex items-center justify-center border-4 border-red-400/30">
                                                <Heart className="h-10 w-10 text-red-100 animate-pulse" fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Guest name if available - Enhanced */}
                            {guest && (
                                <div className="mb-8">
                                    <p className="text-xs uppercase tracking-[0.5em] text-accent font-semibold mb-3">Para</p>
                                    <h2 className="text-4xl sm:text-5xl font-serif font-light text-stone-900 mb-2">
                                        {guest.name}
                                    </h2>
                                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto" />
                                </div>
                            )}

                            {/* Event info - Premium typography */}
                            <div className="mb-10">
                                <h3 className="text-5xl sm:text-6xl md:text-7xl font-serif font-light text-transparent bg-clip-text bg-gradient-to-r from-stone-800 via-accent to-stone-800 mb-4 leading-tight">
                                    {event.title}
                                </h3>
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-accent/50" />
                                    <p className="text-stone-600 text-sm uppercase tracking-[0.4em] font-medium">
                                        {event.event_type === 'wedding' ? 'Boda' : event.event_type === 'xv' ? 'XV Años' : 'Celebración'}
                                    </p>
                                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-accent/50" />
                                </div>
                            </div>

                            {/* Invitation text - Elegant */}
                            <p className="text-stone-700 italic text-lg mb-12 max-w-lg mx-auto leading-relaxed font-serif">
                                "Te invitamos a ser parte de este momento único e inolvidable"
                            </p>

                            {/* Open button - Simple */}
                            <div className="inline-block mb-8">
                                <button
                                    onClick={() => setEnvelopeOpened(true)}
                                    className="inline-flex items-center gap-3 px-12 py-5 bg-accent text-white rounded-full font-sans font-bold uppercase tracking-widest text-sm hover:bg-accent-dark transition-colors duration-300"
                                >
                                    <Mail className="h-6 w-6" />
                                    <span>Abrir Invitación</span>
                                </button>
                            </div>

                            {/* Bottom decorative elements */}
                            <div className="flex items-center justify-center gap-3">
                                <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent/30" />
                                <div className="flex gap-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                                    <div className="h-1.5 w-1.5 rounded-full bg-accent/40" />
                                    <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                                </div>
                                <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent/30" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom badge */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center">
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-black/30 backdrop-blur-sm rounded-full border border-accent/30">
                            <Sparkles className="h-4 w-4 text-accent" />
                            <p className="text-xs text-accent uppercase tracking-[0.4em] font-semibold">
                                Invitación Premium
                            </p>
                        </div>
                    </div>
                </div>

                {/* Animation keyframes */}
                <style>{`
                    @keyframes envelope-flap {
                        0%, 100% { transform: rotateX(0deg); }
                        50% { transform: rotateX(-5deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-rose-50/20"
            style={{ '--color-accent': primaryColor } as React.CSSProperties}>
            {/* Version Switcher - Only for demo invitations */}
            {isDemo && (
                <div className="fixed top-4 right-4 z-50 flex flex-wrap gap-2 items-center">
                    {/* Home button */}
                    <Link to="/">
                        <button className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-stone-900 hover:bg-stone-100 border-2 border-stone-200 transition-all flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            <span className="hidden sm:inline">Inicio</span>
                        </button>
                    </Link>

                    {/* Version switcher */}
                    <a href={`/i/${baseSlug}?t=${guestToken || 'token-roberto'}`}>
                        <button className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${currentVersion === 'classic' ? 'bg-stone-900 text-white' : 'bg-white text-stone-900 hover:bg-stone-100 border-2 border-stone-200'}`}>
                            Clásica
                        </button>
                    </a>
                    <a href={`/i/${baseSlug}-pro?t=${guestToken || 'token-roberto'}`}>
                        <button className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${currentVersion === 'pro' ? 'bg-accent text-white' : 'bg-white text-stone-900 hover:bg-stone-100 border-2 border-stone-200'}`}>
                            Pro
                        </button>
                    </a>
                    <a href={`/i/${baseSlug}-premium?t=${guestToken || 'token-roberto'}`}>
                        <button className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${currentVersion === 'premium' ? 'bg-gradient-to-r from-accent to-accent-dark text-white' : 'bg-white text-stone-900 hover:bg-stone-100 border-2 border-stone-200'}`}>
                            Premium
                        </button>
                    </a>
                </div>
            )}

            {/* Cover Section - Different for each tier */}
            {tier === 'classic' ? (
                // CLASSIC HERO - Full-bleed image when available
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                    {/* Background: image or gradient */}
                    {heroImageUrl ? (
                        <>
                            <div className="absolute inset-0">
                                <img src={heroImageUrl} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30" />
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-cream to-amber-50/30" />
                    )}

                    <div className="relative z-10 text-center px-6 py-20 max-w-2xl">
                        <div className="mb-8">
                            <Sparkles className="h-12 w-12 mx-auto mb-6 animate-pulse" style={{color: heroTextColor, opacity: 0.8}} />
                        </div>
                        <p className="text-sm uppercase tracking-[0.4em] mb-6 font-sans" style={{color: heroTextColor, opacity: 0.85}}>
                            {subtitle || labels.tagline}
                        </p>
                        <h1 className="text-6xl sm:text-7xl md:text-8xl font-serif font-light mb-6 leading-none drop-shadow-sm" style={{color: heroTextColor}}>
                            {event.title}
                        </h1>
                        {welcomeMessage && (
                            <p className="text-lg font-serif italic mb-12 max-w-md mx-auto leading-relaxed" style={{color: heroTextColor, opacity: 0.9}}>
                                {welcomeMessage}
                            </p>
                        )}
                        <div className={`inline-block rounded-full p-8 mb-12 ${heroImageUrl ? 'bg-white/20 backdrop-blur-sm border border-white/30' : 'card-premium'}`}>
                            <p className="text-5xl font-serif font-light mb-2" style={{color: heroImageUrl ? heroTextColor : accentColor}}>
                                {format(eventDate, 'dd', { locale: es })}
                            </p>
                            <p className="text-sm uppercase tracking-[0.3em]" style={{color: heroImageUrl ? heroTextColor : 'rgb(87,83,78)', opacity: heroImageUrl ? 0.8 : 1}}>
                                {format(eventDate, 'MMMM', { locale: es })}
                            </p>
                            <p className="text-2xl font-serif mt-1" style={{color: heroImageUrl ? heroTextColor : 'rgb(28,25,23)'}}>
                                {format(eventDate, 'yyyy', { locale: es })}
                            </p>
                        </div>
                        <div className="mt-4">
                            {showCountdown && (
                            <div className="mb-8 flex flex-wrap justify-center gap-6">
                                <div className="text-center">
                                    <span className="text-3xl font-serif font-light" style={{color: heroImageUrl ? heroTextColor : accentColor}}>{countdown.days}</span>
                                    <p className="text-[10px] uppercase tracking-widest" style={{color: heroImageUrl ? heroTextColor : 'rgb(161,155,147)', opacity: heroImageUrl ? 0.6 : 1}}>Días</p>
                                </div>
                                <div className="text-center">
                                    <span className="text-3xl font-serif font-light" style={{color: heroImageUrl ? heroTextColor : accentColor}}>{countdown.hours}</span>
                                    <p className="text-[10px] uppercase tracking-widest" style={{color: heroImageUrl ? heroTextColor : 'rgb(161,155,147)', opacity: heroImageUrl ? 0.6 : 1}}>Horas</p>
                                </div>
                                <div className="text-center">
                                    <span className="text-3xl font-serif font-light" style={{color: heroImageUrl ? heroTextColor : accentColor}}>{countdown.minutes}</span>
                                    <p className="text-[10px] uppercase tracking-widest" style={{color: heroImageUrl ? heroTextColor : 'rgb(161,155,147)', opacity: heroImageUrl ? 0.6 : 1}}>Min</p>
                                </div>
                            </div>
                            )}
                            <div className="inline-flex flex-col items-center gap-2 animate-bounce" style={{color: heroImageUrl ? heroTextColor : 'rgb(161,155,147)', opacity: 0.7}}>
                                <p className="text-xs uppercase tracking-widest">Desliza</p>
                                <div className="h-12 w-px" style={{background: `linear-gradient(to bottom, ${heroImageUrl ? heroTextColor : accentColor}, transparent)`}} />
                            </div>
                        </div>
                    </div>
                </section>
            ) : tier === 'pro' ? (
                // PRO HERO - Enhanced with overlay patterns
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                        }} />
                    </div>

                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/50 to-stone-900" />
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/30 to-transparent" />

                    <div className="relative z-10 text-center px-6 py-20 max-w-4xl">
                        {/* Decorative elements */}
                        <div className="mb-8 flex justify-center gap-4">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent mt-3" />
                            <Sparkles className="h-6 w-6 text-accent animate-pulse" />
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent mt-3" />
                        </div>

                        <p className="text-xs uppercase tracking-[0.5em] text-accent mb-8 font-sans">
                            {subtitle || labels.tagline}
                        </p>

                        <h1 className="text-7xl sm:text-8xl md:text-9xl font-serif font-light mb-8 text-white leading-none tracking-tight">
                            {event.title}
                        </h1>

                        <div className="h-px w-32 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-12" />

                        {/* Enhanced date display */}
                        <div className="inline-block relative">
                            <div className="absolute inset-0 bg-accent/20 blur-2xl" />
                            <div className="relative bg-gradient-to-br from-stone-800 to-stone-900 border-2 border-accent/30 rounded-2xl p-10">
                                <p className="text-6xl font-serif font-light text-accent mb-3">
                                    {format(eventDate, 'dd', { locale: es })}
                                </p>
                                <p className="text-base uppercase tracking-[0.3em] text-stone-300 mb-2">
                                    {format(eventDate, 'MMMM', { locale: es })}
                                </p>
                                <p className="text-3xl font-serif text-white">
                                    {format(eventDate, 'yyyy', { locale: es })}
                                </p>
                            </div>
                        </div>

                        <div className="mt-20">
                            {showCountdown && (
                                <div className="inline-flex flex-col items-center gap-3 text-accent/60 animate-bounce">
                                    <p className="text-xs uppercase tracking-[0.4em]">Descubre Más</p>
                                    <div className="h-16 w-px bg-gradient-to-b from-accent to-transparent" />
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            ) : (
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                    {/* Premium background */}
                    <div className="absolute inset-0 bg-stone-900" />

                    <div className="relative z-10 text-center px-6 py-20 max-w-5xl">
                        {/* Premium decorative header */}
                        <div className="mb-12 flex items-center justify-center gap-6">
                            <div className="h-px w-20 bg-gradient-to-r from-transparent via-accent to-accent" />
                            <div className="relative">
                                <div className="absolute inset-0 bg-accent blur-xl opacity-50" />
                                <Sparkles className="relative h-8 w-8 text-accent" />
                            </div>
                            <div className="h-px w-20 bg-gradient-to-l from-transparent via-accent to-accent" />
                        </div>

                        <p className="text-sm uppercase tracking-[0.6em] text-accent mb-10 font-sans">
                            {subtitle || labels.tagline}
                        </p>

                        {/* Luxurious title with glow */}
                        <div className="relative mb-12">
                            <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-serif font-light text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-accent to-amber-600 leading-none tracking-tighter">
                                {event.title}
                            </h1>
                            <div className="absolute inset-0 text-8xl sm:text-9xl md:text-[10rem] font-serif font-light text-accent blur-2xl opacity-20 -z-10">
                                {event.title}
                            </div>
                        </div>

                        {/* Decorative divider */}
                        <div className="flex items-center justify-center gap-4 mb-12">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent" />
                            <div className="h-2 w-2 bg-accent rounded-full" />
                            <div className="h-px w-24 bg-accent" />
                            <div className="h-2 w-2 bg-accent rounded-full" />
                            <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent" />
                        </div>

                        {/* Premium date card */}
                        <div className="inline-block relative mb-16">
                            {/* Glow effect */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-accent/0 via-accent/40 to-accent/0 blur-2xl" />

                            {/* Card */}
                            <div className="relative bg-gradient-to-br from-amber-900/50 to-stone-900/50 backdrop-blur-sm border-2 border-accent/50 rounded-3xl p-12 shadow-2xl">
                                <p className="text-7xl font-serif font-light text-accent mb-4 tracking-tight">
                                    {format(eventDate, 'dd', { locale: es })}
                                </p>
                                <div className="h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-4" />
                                <p className="text-lg uppercase tracking-[0.4em] text-amber-200 mb-3">
                                    {format(eventDate, 'MMMM', { locale: es })}
                                </p>
                                <p className="text-4xl font-serif text-white font-light">
                                    {format(eventDate, 'yyyy', { locale: es })}
                                </p>
                            </div>
                        </div>

                        {/* COUNTDOWN TIMER - Premium */}
                        {showCountdown && (
                            <div className="mb-16">
                                <h3 className="text-2xl font-serif text-accent mb-8 tracking-wide">Cuenta Regresiva</h3>

                                <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto">
                                    {/* Days */}
                                    <div className="bg-gradient-to-br from-stone-800/80 to-stone-900/80 backdrop-blur-sm border border-accent/30 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                                        <div className="text-3xl sm:text-5xl font-bold text-accent mb-1 sm:mb-2">{countdown.days}</div>
                                        <div className="text-[10px] sm:text-xs uppercase tracking-widest text-stone-400">Días</div>
                                    </div>

                                    {/* Hours */}
                                    <div className="bg-gradient-to-br from-stone-800/80 to-stone-900/80 backdrop-blur-sm border border-accent/30 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                                        <div className="text-3xl sm:text-5xl font-bold text-accent mb-1 sm:mb-2">{countdown.hours}</div>
                                        <div className="text-[10px] sm:text-xs uppercase tracking-widest text-stone-400">Horas</div>
                                    </div>

                                    {/* Minutes */}
                                    <div className="bg-gradient-to-br from-stone-800/80 to-stone-900/80 backdrop-blur-sm border border-accent/30 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                                        <div className="text-3xl sm:text-5xl font-bold text-accent mb-1 sm:mb-2">{countdown.minutes}</div>
                                        <div className="text-[10px] sm:text-xs uppercase tracking-widest text-stone-400">Minutos</div>
                                    </div>

                                    {/* Seconds */}
                                    <div className="bg-gradient-to-br from-stone-800/80 to-stone-900/80 backdrop-blur-sm border border-accent/30 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                                        <div className="text-3xl sm:text-5xl font-bold text-accent mb-1 sm:mb-2">{countdown.seconds}</div>
                                        <div className="text-[10px] sm:text-xs uppercase tracking-widest text-stone-400">Segundos</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ADD TO CALENDAR BUTTONS */}
                        <div className="mb-16 px-4">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
                                {/* Google Calendar */}
                                <a
                                    href={generateGoogleCalendarLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-accent hover:bg-accent-dark text-white rounded-full font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider transition-colors w-full sm:w-auto"
                                >
                                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                    <span className="whitespace-nowrap">Google Calendar</span>
                                </a>

                                {/* iCal / Apple Calendar */}
                                <a
                                    href={generateICalLink()}
                                    download={`${event.title}.ics`}
                                    className="flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-stone-700 hover:bg-stone-600 text-white rounded-full font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider transition-colors w-full sm:w-auto"
                                >
                                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                    <span className="whitespace-nowrap">Descargar iCal</span>
                                </a>
                            </div>
                        </div>

                        {/* DOWNLOAD PDF BUTTON - Premium Only */}
                        <div className="mb-16 px-4">
                            <div className="max-w-md mx-auto">
                                {/* Divider with text */}
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-accent/20"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-black px-4 text-xs uppercase tracking-widest text-accent/60">
                                            Invitación Digital
                                        </span>
                                    </div>
                                </div>

                                {/* PDF Download Button */}
                                <button
                                    onClick={() => event && generateInvitationPDF(event)}
                                    className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-stone-800/50 to-stone-900/50 backdrop-blur-sm border border-accent/20 hover:border-accent/40 transition-all duration-500"
                                >
                                    {/* Subtle glow effect on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Content */}
                                    <div className="relative px-6 py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Download className="h-5 w-5 text-accent" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-semibold text-white group-hover:text-accent transition-colors">
                                                    Descargar Invitación
                                                </p>
                                                <p className="text-xs text-stone-400 group-hover:text-stone-300 transition-colors">
                                                    Guardar como PDF
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-accent group-hover:translate-x-1 transition-transform">
                                            →
                                        </div>
                                    </div>
                                </button>

                                {/* Subtle hint */}
                                <p className="text-center text-xs text-stone-500 mt-3">
                                    Perfecta para compartir o imprimir
                                </p>
                            </div>
                        </div>

                        {/* Premium scroll indicator */}
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-xs uppercase tracking-[0.5em] text-accent/80">Explora la Invitación</p>
                            <div className="relative h-16 w-px">
                                <div className="absolute inset-0 bg-gradient-to-b from-accent to-transparent animate-pulse" />
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-3 bg-accent rounded-full animate-bounce" />
                            </div>
                        </div>
                    </div>
                </section>
            )
            }

            {/* Guest Welcome */}
            {
                guest && (
                    <section className="py-20 text-center bg-white">
                        <div className="max-w-2xl mx-auto px-6">
                            <User className="h-8 w-8 mx-auto mb-6 text-accent/60" />
                            <p className="text-xs uppercase tracking-[0.4em] text-stone-400 mb-3">Con cariño para</p>
                            <h2 className="text-4xl sm:text-5xl font-serif text-stone-900 mb-6">{guest.name}</h2>
                            <div className="h-px w-24 mx-auto bg-accent/30" />
                        </div>
                    </section>
                )
            }

            {/* Message Section */}
            <section className="py-20 bg-gradient-to-br from-rose-50/50 to-amber-50/30">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <Heart className="h-10 w-10 mx-auto mb-8 text-rose-400" />
                    {welcomeMessage ? (
                        <p className="text-2xl sm:text-3xl font-serif font-light text-stone-700 leading-relaxed italic mb-8">
                            "{welcomeMessage}"
                        </p>
                    ) : (
                        <p className="text-2xl sm:text-3xl font-serif font-light text-stone-700 leading-relaxed italic mb-8">
                            {event.event_type === 'wedding'
                                ? '"Dos almas que se encuentran para escribir juntas la más hermosa historia de amor"'
                                : event.event_type === 'birthday'
                                ? '"Cada año es una nueva página llena de momentos inolvidables"'
                                : event.event_type === 'xv'
                                ? '"El momento más especial de mi vida, y quiero compartirlo contigo"'
                                : '"Un momento especial que quiero compartir contigo"'}
                        </p>
                    )}
                    <p className="text-stone-600 leading-relaxed">
                        Es un honor para nosotros invitarte a ser parte de este momento tan especial.
                        Tu presencia hará este día aún más memorable.
                    </p>
                </div>
            </section>

            {/* Location Section */}
            {showLocation && (
            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl sm:text-5xl font-serif font-light text-stone-900 mb-4">Ubicación</h3>
                        <p className="text-stone-600">Gracias por estar con nosotros, aquí las ubicaciones del evento</p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
                        {/* Ceremony - Only show if specifically configured with a name */}
                        {cfg.misa_name && (
                            <div className="flex-1 card-premium rounded-3xl p-10 text-center space-y-6 hover:shadow-2xl transition-all flex flex-col items-center">
                                <div className="inline-flex justify-center">
                                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center shadow-md">
                                        <Heart className="h-10 w-10 text-rose-400" />
                                    </div>
                                </div>
                                <h4 className="text-2xl font-serif font-medium text-stone-900 uppercase tracking-wider">{labels.ceremony}</h4>
                                <div className="space-y-3 text-stone-700 w-full">
                                    <p className="flex items-center justify-center gap-3 text-lg">
                                        <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                                        <span className="font-sans">{cfg.misa_time || "Por confirmar"} hrs</span>
                                    </p>
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="font-serif text-lg text-stone-900">{cfg.misa_name}</p>
                                        <p className="text-sm font-light text-stone-500 italic max-w-[250px]">{cfg.misa_address}</p>
                                    </div>
                                </div>
                                {cfg.misa_maps_link && (
                                    <a href={cfg.misa_maps_link} target="_blank" rel="noreferrer" className="mt-auto pt-4">
                                        <button className="btn-premium px-8 py-3 rounded-full text-white font-sans font-medium text-[11px] uppercase tracking-[0.2em]">
                                            ¿Cómo llegar?
                                        </button>
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Reception - Main Event */}
                        <div className="flex-1 card-premium rounded-3xl p-10 text-center space-y-6 hover:shadow-2xl transition-all flex flex-col items-center">
                            <div className="inline-flex justify-center">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shadow-md">
                                    <Music className="h-10 w-10 text-amber-500" />
                                </div>
                            </div>
                            <h4 className="text-2xl font-serif font-medium text-stone-900 uppercase tracking-wider">{labels.reception}</h4>
                            <div className="space-y-3 text-stone-700 w-full">
                                <p className="flex items-center justify-center gap-3 text-lg">
                                    <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                                    <span className="font-sans">
                                        {format(eventDate, 'HH:mm', { locale: es })} hrs
                                    </span>
                                </p>
                                <div className="flex flex-col items-center gap-1">
                                    <p className="font-serif text-lg text-stone-900">{event.venue_name}</p>
                                    <p className="text-sm font-light text-stone-500 italic max-w-[250px]">{event.venue_address}</p>
                                </div>
                            </div>
                            {event.maps_link && (
                                <a href={event.maps_link} target="_blank" rel="noreferrer" className="mt-auto pt-4">
                                    <button className="btn-premium px-8 py-3 rounded-full text-white font-sans font-medium text-[11px] uppercase tracking-[0.2em] bg-stone-900 hover:bg-stone-800">
                                        ¿Cómo llegar?
                                    </button>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* PRO+ Feature: Embedded Google Maps */}
                    {showLocation && (isPro || isPremium) && event.maps_link && (
                        <div className="mt-16 max-w-5xl mx-auto">
                            <div className="card-premium rounded-3xl overflow-hidden shadow-2xl">
                                <iframe
                                    src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&q=${encodeURIComponent(event.venue_address || '')}`}
                                    width="100%"
                                    height="450"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full"
                                />
                            </div>
                            <p className="text-center text-sm text-stone-500 mt-4">
                                Toca el mapa para ver la ubicación en Google Maps
                            </p>
                        </div>
                    )}
                </div>
            </section>
            )}

            {/* Dress Code */}
            {showDressCode && event.dress_code && (
                    <section className="py-20 bg-gradient-to-br from-stone-50 to-rose-50/20">
                        <div className="max-w-3xl mx-auto px-6 text-center">
                            <Sparkles className="h-10 w-10 mx-auto mb-8 text-accent/60" />
                            <h3 className="text-4xl font-serif font-light text-stone-900 mb-6">Dress Code</h3>
                            <div className="card-premium rounded-3xl p-12 inline-block">
                                <p className="text-3xl font-serif text-stone-900">{event.dress_code}</p>
                            </div>
                        </div>
                    </section>
                )
            }

            {/* RSVP Section */}
            {showRSVP && (
            <section id="rsvp" className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* LEFT: Form */}
                        <div>
                            <h3 className="text-4xl sm:text-5xl font-serif font-light text-stone-900 mb-3">Confirma tu asistencia</h3>
                            {event.rsvp_deadline && (
                                <p className="text-sm text-stone-400 mb-10">
                                    Favor de confirmarte antes del {format(new Date(event.rsvp_deadline), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                                </p>
                            )}

                            {rsvpSuccess ? (
                                <div className="animate-fade-in flex flex-col items-center text-center space-y-6">
                                    {/* Check icon */}
                                    <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center shadow-sm border border-green-100">
                                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                                    </div>

                                    <div>
                                        <h2 className="text-3xl font-serif text-stone-900 mb-1">¡Confirmado!</h2>
                                        <p className="text-stone-400 text-sm">Gracias {guestName || 'por confirmar'}. Tu respuesta ha sido registrada.</p>
                                    </div>

                                    {/* QR Code card */}
                                    {(guestToken || guest?.id) && (
                                        <div className="bg-stone-50 border border-stone-100 rounded-2xl p-6 flex flex-col items-center gap-4 w-full max-w-xs">
                                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">Tu pase de entrada</p>
                                            <div className="bg-white p-3 rounded-xl shadow-sm">
                                                <QRCodeCanvas
                                                    ref={qrCanvasRef}
                                                    value={`${window.location.origin}/i/${slug}?t=${guestToken || guest?.id}`}
                                                    size={180}
                                                    level="M"
                                                    includeMargin={false}
                                                />
                                            </div>
                                            <p className="text-[10px] text-stone-400 text-center">Muestra este código en la entrada del evento</p>
                                            <button
                                                onClick={downloadQR}
                                                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 hover:text-stone-900 transition-colors border border-stone-200 hover:border-stone-400 rounded-xl px-4 py-2"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                Descargar QR
                                            </button>
                                            <button
                                                onClick={() => event && generateInvitationPDF(event)}
                                                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 hover:text-stone-900 transition-colors border border-stone-200 hover:border-stone-400 rounded-xl px-4 py-2"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                Descargar invitación PDF
                                            </button>
                                        </div>
                                    )}

                                    {/* Calendar buttons */}
                                    <div className="w-full max-w-xs space-y-2">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-3">Agendar en mi calendario</p>
                                        <a
                                            href={generateGoogleCalendarLink()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition-all text-[10px] uppercase tracking-[0.2em] font-bold text-stone-600"
                                        >
                                            <Calendar className="h-3.5 w-3.5" />
                                            Google Calendar
                                        </a>
                                        <a
                                            href={generateICalLink()}
                                            download={`${slug || 'evento'}.ics`}
                                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition-all text-[10px] uppercase tracking-[0.2em] font-bold text-stone-600"
                                        >
                                            <Calendar className="h-3.5 w-3.5" />
                                            iCal / Apple Calendar
                                        </a>
                                    </div>

                                    {!guestToken && (
                                        <button
                                            onClick={() => setRsvpSuccess(false)}
                                            className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-300 hover:text-stone-600 transition-colors pt-2"
                                        >
                                            MODIFICAR RESPUESTA
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-300">
                                            NOMBRE COMPLETO
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={guestName}
                                            onChange={(e) => setGuestName(e.target.value)}
                                            placeholder="Tu nombre"
                                            disabled={submitting}
                                            className="w-full bg-transparent border-b border-stone-200 py-3 focus:border-stone-400 outline-none transition-colors font-light text-xl text-stone-800 placeholder:text-stone-200"
                                            readOnly={!!guest && !!guestToken}
                                        />
                                    </div>

                                    {/* Companion selector — only for token guests with assigned companions */}
                                    {guest && guestToken && guest.max_plus_ones > 0 && (
                                        <div className="space-y-4">
                                            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-300">
                                                ASISTENCIA
                                            </label>
                                            <div className="relative group">
                                                <select
                                                    value={numGuests}
                                                    onChange={(e) => setNumGuests(e.target.value)}
                                                    disabled={submitting}
                                                    className="w-full bg-transparent border-b border-stone-200 py-3 focus:border-stone-400 outline-none transition-colors font-light text-xl text-stone-800 appearance-none cursor-pointer"
                                                >
                                                    <option value="1">Solo yo</option>
                                                    <option value={(guest.max_plus_ones + 1).toString()}>
                                                        {guest.name} + {guest.max_plus_ones} acompañante{guest.max_plus_ones > 1 ? 's' : ''}
                                                    </option>
                                                </select>
                                                <div className="absolute right-0 bottom-4 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity">
                                                    <Heart className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {error && <p className="text-red-500 text-sm font-semibold bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}

                                    <div className="space-y-4 pt-4">
                                        <button
                                            onClick={() => handleRsvp('yes')}
                                            disabled={submitting}
                                            className="w-full py-6 rounded-2xl text-white font-bold text-[10px] uppercase tracking-[0.4em] transition-all disabled:opacity-50 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.98]"
                                            style={{ background: primaryColor }}
                                        >
                                            {submitting ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    PROCESANDO...
                                                </span>
                                            ) : 'SÍ, CONFIRMAR ASISTENCIA'}
                                        </button>
                                        
                                        <button
                                            onClick={() => handleRsvp('no')}
                                            disabled={submitting}
                                            className="w-full py-4 text-stone-400 hover:text-stone-900 font-bold text-[10px] uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {submitting ? (
                                                <>
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    Procesando...
                                                </>
                                            ) : 'No podré asistir'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Decorative card */}
                        <div className="hidden lg:flex justify-center">
                            <div className="relative w-72">
                                <div className="rounded-[2rem] overflow-hidden shadow-2xl" style={{background: cardBgColor, minHeight: '420px'}}>
                                    <div className="bg-white h-4 mx-6 mt-6 rounded-t-xl" />
                                    {/* Botanical illustration — always white background, illustration centered */}
                                    <div className="mx-6 bg-white rounded-xl overflow-hidden flex items-center justify-center" style={{height: '340px'}}>
                                        <img
                                            src="/botanical-peony.png"
                                            alt="Botanical illustration"
                                            className="w-full h-full object-contain p-4"
                                        />
                                    </div>
                                    <div className="text-center py-6 px-4">
                                        <p className="font-serif italic text-sm" style={{color: 'rgba(255,255,255,0.85)'}}>{event.title}</p>
                                        <p className="text-xs mt-1" style={{color: 'rgba(255,255,255,0.6)'}}>{format(eventDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                                    </div>
                                    <div className="bg-white h-4 mx-6 mb-6 rounded-b-xl" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            )}

            {/* Gift Registry */}
            {showGifts && (
            <section className="py-24 bg-gradient-to-br from-amber-50/30 to-rose-50/20">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h3 className="text-4xl font-serif font-light text-stone-900 mb-4">Mesa de Regalos</h3>
                        <p className="text-stone-600 leading-relaxed max-w-xl mx-auto">
                            Nuestro mejor regalo es que estés con nosotros en nuestro día, pero si quieres hacernos un obsequio aquí están nuestras opciones
                        </p>
                    </div>

                    <div className="card-premium rounded-3xl p-12 text-center">
                        <Gift className="h-16 w-16 mx-auto mb-8 text-accent" />

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <button className="px-8 py-4 rounded-full border-2 border-accent text-accent hover:bg-accent hover:text-white font-sans font-medium uppercase tracking-wider transition-all hover:scale-105">
                                Liverpool
                            </button>
                            <button className="px-8 py-4 rounded-full border-2 border-accent text-accent hover:bg-accent hover:text-white font-sans font-medium uppercase tracking-wider transition-all hover:scale-105">
                                Amazon
                            </button>
                        </div>

                        <div className="mt-12 pt-8 border-t border-stone-200">
                            <p className="text-sm uppercase tracking-wider text-stone-400 mb-4">Lluvia de Sobres</p>
                            <p className="text-stone-600 max-w-md mx-auto text-sm">
                                Si prefieres hacernos un obsequio en efectivo, te lo agradeceremos mucho
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            )}

            {/* Gallery Placeholder */}
            {showGallery && (
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <Camera className="h-16 w-16 mx-auto mb-8 text-stone-300" />
                    <h3 className="text-3xl font-serif font-light text-stone-900 mb-4">Galería de Fotos</h3>
                    <p className="text-stone-500 text-sm max-w-md mx-auto">
                        Será un gusto poder compartir este día contigo. Después del evento, podrás encontrar aquí las fotos del día.
                    </p>
                </div>
            </section>
            )}

            {/* PRO+ Feature: Itinerario Detallado */}
            {
                (isPro || isPremium) && event.theme_config?.schedule && (
                    <section className="py-24 bg-gradient-to-br from-amber-50/50 to-rose-50/30">
                        <div className="max-w-4xl mx-auto px-6">
                            <div className="text-center mb-16">
                                <h3 className="text-4xl sm:text-5xl font-serif font-light text-stone-900 mb-4">Itinerario del Evento</h3>
                                <p className="text-stone-600">Programa detallado del día</p>
                            </div>
                            <div className="space-y-6">
                                {event.theme_config.schedule.map((item: any, idx: number) => (
                                    <div key={idx} className="card-premium rounded-2xl p-6 flex items-center gap-6 hover:shadow-xl transition-all">
                                        <div className="flex-shrink-0">
                                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold text-lg">
                                                {item.time}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-semibold text-stone-900 mb-1">{item.event}</h4>
                                            {item.location && <p className="text-stone-600 text-sm">{item.location}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )
            }

            {/* PRO+ Feature: Chambelanes y Damas */}
            {
                (isPro || isPremium) && (event.theme_config?.chambelanes || event.theme_config?.damas) && (
                    <section className="py-24 bg-white">
                        <div className="max-w-6xl mx-auto px-6">
                            <div className="text-center mb-16">
                                <h3 className="text-4xl sm:text-5xl font-serif font-light text-stone-900 mb-4">Corte de Honor</h3>
                                <p className="text-stone-600">Mis acompañantes especiales</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-12">
                                {/* Chambelanes */}
                                {event.theme_config.chambelanes && (
                                    <div>
                                        <h4 className="text-2xl font-serif text-center mb-8 text-stone-900">Chambelanes</h4>
                                        <div className="space-y-4">
                                            {event.theme_config.chambelanes.map((name: string, idx: number) => (
                                                <div key={idx} className="card-premium rounded-xl p-4 text-center">
                                                    <p className="text-lg text-stone-800">{name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Damas */}
                                {event.theme_config.damas && (
                                    <div>
                                        <h4 className="text-2xl font-serif text-center mb-8 text-stone-900">Damas</h4>
                                        <div className="space-y-4">
                                            {event.theme_config.damas.map((name: string, idx: number) => (
                                                <div key={idx} className="card-premium rounded-xl p-4 text-center">
                                                    <p className="text-lg text-stone-800">{name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )
            }

            {/* PREMIUM Feature: Galería de Fotos - Ultra Luxury */}
            {
                isPremium && event.theme_config?.photoGallery?.enabled && (
                    <section className="py-32 bg-gradient-to-br from-black via-stone-900 to-amber-900 relative overflow-hidden">
                        {/* Premium background effects */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                                backgroundSize: '60px 60px'
                            }} />
                        </div>

                        <div className="relative z-10 max-w-7xl mx-auto px-6">
                            {/* Premium header */}
                            <div className="text-center mb-20">
                                <div className="inline-flex items-center gap-4 mb-6">
                                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent" />
                                    <Camera className="h-10 w-10 text-accent animate-pulse" />
                                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent" />
                                </div>
                                <h3 className="text-5xl sm:text-6xl font-serif font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-accent to-amber-600 mb-4">
                                    Galería Premium
                                </h3>
                                <p className="text-amber-200/80 text-lg">Momentos inolvidables</p>
                            </div>

                            {/* Premium masonry grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {[
                                    { span: 'col-span-2 row-span-2', height: 'h-96' },
                                    { span: 'col-span-1 row-span-1', height: 'h-44' },
                                    { span: 'col-span-1 row-span-1', height: 'h-44' },
                                    { span: 'col-span-1 row-span-2', height: 'h-96' },
                                    { span: 'col-span-1 row-span-1', height: 'h-44' },
                                    { span: 'col-span-2 row-span-1', height: 'h-44' },
                                    { span: 'col-span-1 row-span-1', height: 'h-44' },
                                    { span: 'col-span-1 row-span-2', height: 'h-96' }
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className={`${item.span} ${item.height} relative rounded-2xl overflow-hidden group cursor-pointer`}
                                    >
                                        {/* Premium gradient placeholder */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-stone-900/50 to-black/70 backdrop-blur-sm group-hover:scale-110 transition-transform duration-700" />

                                        {/* Glow effect on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/20 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Border glow */}
                                        <div className="absolute inset-0 border-2 border-accent/0 group-hover:border-accent/50 rounded-2xl transition-all duration-500" />

                                        {/* Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Camera className="h-16 w-16 text-accent/30 group-hover:text-accent group-hover:scale-125 transition-all duration-500" />
                                        </div>

                                        {/* Overlay text on hover */}
                                        <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="text-white">
                                                <p className="text-sm font-semibold mb-1">Foto {i + 1}</p>
                                                <p className="text-xs text-amber-200">Toca para ampliar</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Upload section for Premium */}
                            {isPremium && event.theme_config.photoGallery.uploadEnabled && (
                                <div className="mt-16 text-center">
                                    <div className="card-premium bg-gradient-to-br from-stone-900 to-stone-800 border-2 border-accent/30 rounded-3xl p-12 max-w-2xl mx-auto">
                                        <Camera className="h-12 w-12 text-accent mx-auto mb-6" />
                                        <h4 className="text-2xl font-serif text-white mb-4">¡Comparte tus fotos!</h4>
                                        <p className="text-stone-300 mb-8">
                                            Captura los mejores momentos y compártelos usando nuestro hashtag
                                        </p>
                                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black/50 border border-accent/30">
                                            <span className="text-accent text-lg font-semibold">{event.theme_config.hashtag || '#EventoEspecial'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )
            }


            {/* PREMIUM Feature: Accommodation / Hotels */}
            {
                isPremium && (
                    <section className="py-24 bg-gradient-to-br from-stone-50 to-amber-50/20">
                        <div className="max-w-6xl mx-auto px-6">
                            <div className="text-center mb-16">
                                <Hotel className="h-12 w-12 mx-auto mb-6 text-accent" />
                                <h3 className="text-4xl sm:text-5xl font-serif font-light text-stone-900 mb-4">¿Dónde Hospedarse?</h3>
                                <p className="text-stone-600 max-w-2xl mx-auto">
                                    Hemos seleccionado los mejores hoteles cerca del evento para tu comodidad
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Hotel 1 */}
                                <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-xl transition-all">
                                    <div className="relative h-48 bg-gradient-to-br from-stone-200 to-stone-300 overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Hotel className="h-16 w-16 text-stone-400" />
                                        </div>
                                        <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-semibold">
                                            Recomendado
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-xl font-serif font-semibold text-stone-900 mb-2">Hotel Gran Fiesta</h4>
                                        <div className="flex items-start gap-2 text-sm text-stone-600 mb-4">
                                            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-accent" />
                                            <span>A 5 min del evento</span>
                                        </div>
                                        <p className="text-sm text-stone-600 mb-4">
                                            Hotel boutique con habitaciones elegantes, spa y restaurante gourmet.
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-semibold text-stone-900">Desde $1,800/noche</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hotel 2 */}
                                <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-xl transition-all">
                                    <div className="relative h-48 bg-gradient-to-br from-amber-100 to-rose-100 overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Hotel className="h-16 w-16 text-amber-300" />
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-xl font-serif font-semibold text-stone-900 mb-2">Hotel Jardines</h4>
                                        <div className="flex items-start gap-2 text-sm text-stone-600 mb-4">
                                            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-accent" />
                                            <span>A 10 min del evento</span>
                                        </div>
                                        <p className="text-sm text-stone-600 mb-4">
                                            Amplio jardín, alberca y desayuno incluido. Perfecto para familias.
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-semibold text-stone-900">Desde $1,200/noche</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hotel 3 */}
                                <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-xl transition-all">
                                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-cyan-100 overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Hotel className="h-16 w-16 text-blue-300" />
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-xl font-serif font-semibold text-stone-900 mb-2">Hotel Centro</h4>
                                        <div className="flex items-start gap-2 text-sm text-stone-600 mb-4">
                                            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-accent" />
                                            <span>A 15 min del evento</span>
                                        </div>
                                        <p className="text-sm text-stone-600 mb-4">
                                            Ubicación céntrica, cerca de restaurantes y atracciones turísticas.
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-semibold text-stone-900">Desde $950/noche</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 text-center">
                                <p className="text-sm text-stone-500">
                                    Para reservar, menciona el código del evento para obtener tarifas preferenciales
                                </p>
                            </div>
                        </div>
                    </section>
                )
            }

            {/* Footer */}
            <footer className="bg-stone-900 text-white">
                {/* PDF Download removed from footer as per user request */}
                                <div className="py-2"></div>

                <div className="py-10 text-center space-y-4">
                    <div className="h-px w-32 mx-auto bg-white/20 mb-6" />
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                        Creado con amor · Invitto
                    </p>
                    <p className="text-xs text-stone-500">
                        © 2026 Todos los derechos reservados
                    </p>
                </div>
            </footer>

            {/* Floating Admin Control Panel — ONLY if ?t=admin */}
            {isAdminMode && (
                <>
                    {/* Gear Button */}
                    <button 
                        onClick={() => setIsAdminOpen(true)}
                        className="fixed top-6 right-6 z-[60] bg-white/90 backdrop-blur px-6 py-4 rounded-2xl shadow-2xl border border-stone-200 flex items-center gap-3 hover:scale-105 transition-all text-[#1B2E1D]"
                    >
                        <Settings className="h-5 w-5 spin-slow" />
                        <span className="text-xs font-black uppercase tracking-widest">Editor Directo</span>
                    </button>

                    {/* Sidebar Panel */}
                    {isAdminOpen && (
                        <div className="fixed inset-0 z-[70] flex justify-end">
                            {/* Backdrop */}
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAdminOpen(false)} />
                            
                            {/* Slide-over */}
                            <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-8 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300">
                                <div className="flex items-center justify-between mb-12">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-[#1B2E1D] rounded-xl text-white">
                                            <Activity className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-serif text-[#1B2E1D]">Configuración</h3>
                                            <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Admin Panel</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsAdminOpen(false)} className="p-4 hover:bg-stone-50 rounded-full transition-colors">
                                        <X className="h-6 w-6 text-stone-400" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-400 mb-6">Módulos Visibles</h4>
                                    
                                    {[
                                        { id: 'showGifts', label: 'Mesa de Regalos', icon: Gift },
                                        { id: 'showMap', label: 'Mapa y Ubicación', icon: MapPin },
                                        { id: 'showCountdown', label: 'Cuenta Regresiva', icon: Clock },
                                        { id: 'showGallery', label: 'Galería de Fotos', icon: Camera },
                                        { id: 'showDetails', label: 'Detalles (Dress Code)', icon: Sparkles },
                                        { id: 'showWhatsAppRSVP', label: 'Confirmación WhatsApp', icon: Mail }
                                    ].map((feat) => {
                                        const isEnabled = (event?.theme_config as any)?.[feat.id] !== false;
                                        return (
                                            <button 
                                                key={feat.id}
                                                onClick={() => handleUpdateFeature(feat.id, !isEnabled)}
                                                className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                                                    isEnabled ? 'bg-stone-50 border-[#1B2E1D]/10' : 'bg-white border-stone-100 opacity-60'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-lg ${isEnabled ? 'bg-[#1B2E1D] text-white' : 'bg-stone-100 text-stone-400'}`}>
                                                        <feat.icon className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-sm font-bold text-[#1B2E1D]">{feat.label}</span>
                                                </div>
                                                {isEnabled ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4 text-stone-300" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mt-12 p-6 bg-amber-50 rounded-3xl border border-amber-100/50">
                                    <div className="flex gap-4">
                                        <Shield className="h-5 w-5 text-amber-600 shrink-0" />
                                        <p className="text-[11px] leading-relaxed text-amber-800 font-medium">
                                            Los cambios realizados aquí son permanentes y se guardan directamente en la base de datos para este evento.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 border-t border-stone-100">
                                    <p className="text-[9px] text-stone-300 text-center uppercase tracking-widest font-bold">Invitto Direct Admin v2.0</p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            {/* Final Admin Debug Badge */}
            {isAdminMode && (
                <div className="fixed bottom-4 left-4 z-[9999]">
                    <div className="bg-black/95 text-white p-5 rounded-3xl border border-accent/30 text-[10px] font-mono shadow-2xl max-w-sm overflow-auto max-h-64 backdrop-blur-xl ring-1 ring-white/10 group hover:max-h-[80vh] transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-accent font-bold uppercase tracking-widest flex items-center gap-2">
                                <Shield className="h-3 w-3" />
                                persistence_diagnostics
                            </p>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] ${
                                lastSaveStatus === 'ok' ? 'bg-emerald-500/20 text-emerald-400' :
                                lastSaveStatus === 'error' ? 'bg-red-500/20 text-red-400' :
                                lastSaveStatus === 'saving' ? 'bg-amber-500/20 text-amber-400 animate-pulse' :
                                'bg-stone-500/20 text-stone-400'
                            }`}>{
                                lastSaveStatus === 'ok' ? 'GUARDADO_DB ✓' :
                                lastSaveStatus === 'error' ? 'ERROR_DB ✗' :
                                lastSaveStatus === 'saving' ? 'GUARDANDO...' :
                                'SIN_CAMBIOS'
                            }</span>
                        </div>
                        
                        <div className="space-y-1 mb-4 opacity-80 text-[9px]">
                            <p><strong>DB Slug:</strong> {slug}</p>
                            <p><strong>Event ID:</strong> {event.id}</p>
                            <p><strong>Actual Plan:</strong> {tier.toUpperCase()}</p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                            <p className="text-stone-400 mb-2 border-b border-white/10 pb-1 italic">current_configuration:</p>
                            <pre className="text-[9px] text-amber-100/90 leading-tight">
                                {JSON.stringify(event.theme_config || {}, null, 2)}
                            </pre>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-white/10 text-[8px] text-stone-500 flex justify-between items-center italic">
                            <span>Invitto Rescue v4.0</span>
                            <span className="text-stone-700">Refresca para verificar DB</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
