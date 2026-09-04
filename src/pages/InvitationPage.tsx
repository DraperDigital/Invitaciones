import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Gift, CheckCircle2, Clock, Heart, Music, Camera, Flower2, Users as UsersIcon, Mail, Home, Calendar, Hotel, Download, Settings, Eye, EyeOff, Shield, Activity, X, Wine, Utensils, PartyPopper, Moon, GraduationCap, Crown, Cake, Baby, Church, ChevronUp, ChevronDown, Edit2, Smartphone, Monitor, Palette } from 'lucide-react';
import type { Event, Guest } from '../types/database.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PhotoGallery from '../components/invitation/PhotoGallery';
import { MOCK_EVENTS, MOCK_GUESTS } from '../lib/mockData';
import { QRCodeCanvas } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { buildSectionQueue, buildFullPlanQueue, normalizePlan, DEFAULT_SECTION_ORDER } from '../lib/sectionRegistry';
import type { SectionId } from '../lib/sectionRegistry';
import ModernMinimalistHero from '../components/themes/ModernMinimalistHero';
import InlineSectionEditor from '../components/InlineSectionEditor';
import ClassicEleganceHero from '../components/themes/ClassicEleganceHero';
import ClassicEleganceProHero from '../components/themes/ClassicEleganceProHero';
import RomanticBotanicalHero from '../components/themes/RomanticBotanicalHero';
import SplitScreenHero from '../components/themes/SplitScreenHero';
import MagazineHero from '../components/themes/MagazineHero';
import NeonGlowHero from '../components/themes/NeonGlowHero';
import LuxuryGoldHero from '../components/themes/LuxuryGoldHero';
import PassportHero from '../components/themes/PassportHero';
import PolaroidVintageHero from '../components/themes/PolaroidVintageHero';
import WhimsicalKidsHero from '../components/themes/WhimsicalKidsHero';
import CollageHero from '../components/themes/CollageHero';
import FloralSymmetryHero from '../components/themes/FloralSymmetryHero';

function getContrastColor(hexColor: string) {
    if (!hexColor) return '#ffffff';
    let hex = hexColor.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    const r = parseInt(hex.substring(0,2), 16) || 0;
    const g = parseInt(hex.substring(2,4), 16) || 0;
    const b = parseInt(hex.substring(4,6), 16) || 0;
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#111111' : '#ffffff';
}

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
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [editingSection, setEditingSection] = useState<SectionId | null>(null);

    // RSVP Status tracking
    const [rsvpSuccess, setRsvpSuccess] = useState(false);
    const [rsvpChoice, setRsvpChoice] = useState<'yes' | 'no' | null>(null);
    const [envelopeOpened, setEnvelopeOpened] = useState(false);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // ── Theme name — derived from event config ──
    const themeName = event?.theme_config?.theme || 'classic';

    // ── CSS Variable Theme Profiles ──────────────────────────────────
    // Each theme defines the full set of CSS variables consumed by
    // ALL existing components. Components never change — only variables do.
    const THEME_VARS: Record<string, {
        sectionBg: string; sectionBgAlt: string; cardBg: string;
        textPrimary: string; textSecondary: string;
        borderColor: string; cardBorder: string;
        accentOverride?: string; fontPreset: string;
        heroBg?: string; heroRadius?: string; cardRadius?: string;
    }> = {
        'classic': {
            sectionBg: '#FAF8F5', sectionBgAlt: '#F5F2EC', cardBg: '#FFFFFF',
            textPrimary: '#2B2625', textSecondary: '#7A6E65',
            borderColor: '#E8E0D5', cardBorder: '#D4AF3744',
            accentOverride: '#C5A059', fontPreset: 'elegante',
            heroRadius: '0px', cardRadius: '4px',
        },
        'classic-elegance': {
            sectionBg: '#FAF8F5', sectionBgAlt: '#F5F2EC', cardBg: '#FFFFFF',
            textPrimary: '#2B2625', textSecondary: '#7A6E65',
            borderColor: '#E8E0D5', cardBorder: '#C5A05944',
            accentOverride: '#C5A059', fontPreset: 'elegante',
            heroRadius: '0px', cardRadius: '4px',
        },
        'classic-elegance-pro': {
            sectionBg: '#111111', sectionBgAlt: '#0A0A0A', cardBg: '#1A1A1A',
            textPrimary: '#F5E9C9', textSecondary: '#A39060',
            borderColor: '#D4AF3722', cardBorder: '#D4AF3740',
            accentOverride: '#D4AF37', fontPreset: 'elegante',
            heroRadius: '0px', cardRadius: '4px',
        },
        'modern-minimalist': {
            sectionBg: '#FFFFFF', sectionBgAlt: '#F5F5F7', cardBg: '#F5F5F7',
            textPrimary: '#111111', textSecondary: '#555555',
            borderColor: '#E5E5E5', cardBorder: '#DDDDDD',
            fontPreset: 'moderna', heroRadius: '0px', cardRadius: '0px',
        },
        'romantic-botanical': {
            sectionBg: '#FDFBF7', sectionBgAlt: '#F4F7F1', cardBg: '#FFFFFF',
            textPrimary: '#2C2C2C', textSecondary: '#6B7280',
            borderColor: '#E5E7EB', cardBorder: '#FAC34533',
            accentOverride: '#FAC345', fontPreset: 'romantica-playfair',
            heroRadius: '0px', cardRadius: '4px',
        },
        'floral-symmetry': {
            sectionBg: '#FAEDCD', sectionBgAlt: '#FFF9F0', cardBg: '#FFFDF9',
            textPrimary: '#2C362B', textSecondary: '#6C756D',
            borderColor: '#E3C99F', cardBorder: '#C88A5844',
            accentOverride: '#C88A58', fontPreset: 'romantica',
            heroRadius: '0px', cardRadius: '8px',
        },
        'magazine': {
            sectionBg: '#FFFFFF', sectionBgAlt: '#F8F9FA', cardBg: '#FFFFFF',
            textPrimary: '#111111', textSecondary: '#4A4A4A',
            borderColor: '#222222', cardBorder: '#111111',
            accentOverride: '#E63946', fontPreset: 'moderna',
            heroRadius: '0px', cardRadius: '0px',
        },
        'luxury-gold': {
            sectionBg: '#0B0B0B', sectionBgAlt: '#141414', cardBg: '#1F1F1F',
            textPrimary: '#F5D76E', textSecondary: '#A39060',
            borderColor: '#D4AF3733', cardBorder: '#D4AF3744',
            accentOverride: '#D4AF37', fontPreset: 'elegante',
            heroRadius: '0px', cardRadius: '4px',
        },
        'split-screen': {
            sectionBg: '#F8FAFC', sectionBgAlt: '#EFF6FF', cardBg: '#FFFFFF',
            textPrimary: '#0F172A', textSecondary: '#64748B',
            borderColor: '#CBD5E1', cardBorder: '#38BDF833',
            accentOverride: '#38BDF8', fontPreset: 'moderna',
            heroRadius: '0px', cardRadius: '12px',
        },
        'collage': {
            sectionBg: '#F7F4EF', sectionBgAlt: '#EDE8E1', cardBg: '#FFFDF9',
            textPrimary: '#332C27', textSecondary: '#786C65',
            borderColor: '#D4C4B0', cardBorder: '#B07D6244',
            accentOverride: '#B07D62', fontPreset: 'romantica',
            heroRadius: '0px', cardRadius: '8px',
        },
        'passport': {
            sectionBg: '#EEF4F8', sectionBgAlt: '#E1E8ED', cardBg: '#FFFFFF',
            textPrimary: '#0B2545', textSecondary: '#5C748D',
            borderColor: '#BFD1DF', cardBorder: '#13407433',
            accentOverride: '#134074', fontPreset: 'moderna',
            heroRadius: '4px', cardRadius: '8px',
        },
        'polaroid-vintage': {
            sectionBg: '#EAE3D9', sectionBgAlt: '#DDD6CC', cardBg: '#FFFDF9',
            textPrimary: '#3D312A', textSecondary: '#7A6B61',
            borderColor: '#C4B8AC', cardBorder: '#C87D5544',
            accentOverride: '#C87D55', fontPreset: 'romantica',
            heroRadius: '0px', cardRadius: '2px',
        },
        'neon-glow': {
            sectionBg: '#0A0014', sectionBgAlt: '#0F051D', cardBg: '#1A0933',
            textPrimary: '#00F0FF', textSecondary: '#B57EDC',
            borderColor: '#FF007F44', cardBorder: '#FF007F66',
            accentOverride: '#FF007F', fontPreset: 'moderna',
            heroRadius: '0px', cardRadius: '16px',
        },
        'whimsical-kids': {
            sectionBg: '#FFF9EC', sectionBgAlt: '#FFF0F3', cardBg: '#FFFFFF',
            textPrimary: '#2C3E50', textSecondary: '#7F8C8D',
            borderColor: '#FFD3DC', cardBorder: '#FF6B6B44',
            accentOverride: '#FF6B6B', fontPreset: 'romantica',
            heroRadius: '16px', cardRadius: '24px',
        },
    };

    const activeVars = THEME_VARS[themeName] || THEME_VARS['classic'];
    const sectionBg    = activeVars.sectionBg;
    const sectionBgAlt = activeVars.sectionBgAlt;
    const cardBg       = activeVars.cardBg;
    const textPrimary  = activeVars.textPrimary;
    const textSecondary = activeVars.textSecondary;
    const borderColor  = activeVars.borderColor;
    const cardBorder   = activeVars.cardBorder;

    const _accentColor = activeVars.accentOverride || event?.theme_config?.accent_color || event?.theme_config?.primary_color || '#BD7474';
    const _buttonColor = activeVars.accentOverride || event?.theme_config?.button_color || event?.theme_config?.primary_color || '#1B2E1D';
    const accentContrast = getContrastColor(_accentColor);
    const buttonContrast = getContrastColor(_buttonColor);

    const globalStyles = {
        '--section-bg':      sectionBg,
        '--section-bg-alt':  sectionBgAlt,
        '--card-bg':         cardBg,
        '--text-primary':    textPrimary,
        '--text-secondary':  textSecondary,
        '--border-color':    borderColor,
        '--card-border':     cardBorder,
        '--accent-contrast': accentContrast,
        '--button-contrast': buttonContrast,
        '--theme-card-radius': activeVars.cardRadius || '24px',
        '--theme-hero-radius': activeVars.heroRadius || '0px',
    } as React.CSSProperties;

    // Apply font theme attribute and custom CSS - MUST be before any conditional returns
    useEffect(() => {
        const cfg = event?.theme_config || {};
        const preset = cfg.typography_preset || cfg.typographyPreset || 'romantica';
        document.documentElement.setAttribute('data-theme-font', preset);
        return () => {
            document.documentElement.removeAttribute('data-theme-font');
        };
    }, [event?.theme_config]);

    // Custom CSS Injected from theme_config (Plan Pro/Concierge)
    const customStyles = event?.theme_config?.custom_css || '';

    // Form states for General Registration
    const [guestName, setGuestName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const qrCanvasRef = useRef<HTMLCanvasElement>(null);
    const qrCardRef = useRef<HTMLDivElement>(null);
    const qrCardDesktopRef = useRef<HTMLDivElement>(null);
    const [notFound, setNotFound] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('desktop');

    // PLUS ONES States
    const [isAccompanied, setIsAccompanied] = useState(false);
    const [showPlusOnesModal, setShowPlusOnesModal] = useState(false);
    const [adultsCount, setAdultsCount] = useState(1);
    const [kidsCount, setKidsCount] = useState(0);

    const KEY_MAPPINGS: Record<string, string> = {
        showMap:          'show_map',
        showCountdown:    'show_countdown',
        showGallery:      'show_gallery',
        showDetails:      'show_details',
        showGifts:        'show_gifts',
        showWhatsAppRSVP: 'show_whatsapp_rsvp',
        showItinerary:    'show_itinerary',
        showMessage:      'show_message',
        showChambelanes:  'show_chambelanes',
        showHotels:       'show_hotels',
        showEnvelope:     'show_envelope'
    };

    const handleUpdateFeature = async (key: string, value: any) => {
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

            toast.success('¡Guardado!');
        } catch (err: any) {
            console.error('[SYNC_ERROR]', err);
            toast.error('Error al guardar: ' + (err.message || 'Error de red'));
            setEvent({ ...event, theme_config: event.theme_config });
        }
    };

    const handleUpdateEventColumn = async (column: string, value: any) => {
        if (!event) return;
        
        const updatedEvent = { ...event, [column]: value };
        setEvent(updatedEvent as Event);
        
        try {
            const { error } = await supabase
                .from('events')
                .update({ [column]: value })
                .eq('id', event.id);

            if (error) throw error;
            toast.success('¡Guardado!');
        } catch (err: any) {
            console.error('[SYNC_ERROR]', err);
            toast.error('Error al guardar: ' + (err.message || 'Error de red'));
            setEvent(event); // revert
        }
    };


    const downloadQR = useCallback(async (isDesktop: boolean = false) => {
        const targetRef = isDesktop ? qrCardDesktopRef.current : qrCardRef.current;
        if (!targetRef || !event) return;
        
        try {
            setSubmitting(true);
            const dataUrl = await toPng(targetRef, {
                cacheBust: true,
                backgroundColor: '#F9F8F6',
                quality: 1,
                pixelRatio: 2 // Alta resolución
            });
            
            const link = document.createElement('a');
            link.download = `Pase_${guestName.replace(/\s+/g, '_') || 'Invitado'}.png`;
            link.href = dataUrl;
            link.click();
            
            toast.success('¡Pase guardado en tu dispositivo!');
        } catch (err: any) {
            console.error('Error generating QR image:', err);
            toast.error('No se pudo generar la imagen. Intenta tomar una captura de pantalla.');
        } finally {
            setSubmitting(false);
        }
    }, [event, guestName]);

    useEffect(() => {
        if (!slug) return;
        fetchEventAndGuest();
    }, [slug, guestToken]);

    const fetchEventAndGuest = async () => {
        setLoading(true);

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug || '');

        if (!import.meta.env.VITE_SUPABASE_URL) {
            const mockEvent = MOCK_EVENTS.find(e => e.slug === slug || e.id === slug);
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

        const query = supabase.from('events').select('*');
        const { data: eventData, error: eventError } = await (isUuid ? query.eq('id', slug) : query.eq('slug', slug)).maybeSingle();

        if (eventError || !eventData) {
            // FALLBACK TO MOCK_EVENTS FOR EXAMPLES SHOWCASE
            const mockEventFallback = MOCK_EVENTS.find(e => e.slug === slug || e.id === slug);
            if (mockEventFallback) {
                setEvent(mockEventFallback);
                if (guestToken) {
                    const mockGuest = MOCK_GUESTS.find(g => g.guest_token === guestToken);
                    setGuest(mockGuest || null);
                }
                setLoading(false);
                return;
            }

            console.error('Event not found');
            setNotFound(true);
            setLoading(false);
            return;
        }
        setEvent(eventData);

        if (rawToken === 'admin' && user && user.id === eventData.user_id) {
            setIsAdminMode(true);
        } else if (rawToken === 'admin') {
            console.warn('[SECURITY] Admin access denied: not the event owner.');
        }

        // If it's admin mode or simple preview, skip guest fetching
        if (rawToken === 'admin') {
             setLoading(false);
             return;
        }

        if (guestToken) {
            try {
                // Validar si el token parece un UUID válido antes de consultar al RPC
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(guestToken);
                
                if (isUuid) {
                    const { data, error: rpcError } = await supabase.rpc('get_guest_by_token', {
                        p_token: guestToken,
                        p_slug: slug
                    });

                    if (!rpcError && data && data.guest) {
                        const guestData = data.guest as Guest;
                        const rsvpData = data.rsvp;

                        setGuest(guestData);
                        setGuestName(guestData.name);

                        // Inicialización predeterminada según capacidad del invitado (Acompañantes adicionales)
                        if (guestData.max_plus_ones > 0) {
                            setIsAccompanied(true);
                            setAdultsCount(guestData.max_plus_ones);
                        }

                        // Procesar RSVP existente si lo hay
                        if (rsvpData) {
                            try {
                                const msg = rsvpData.message || '';
                                const adultsMatch = msg.match(/Adultos: (\d+)/);
                                const kidsMatch = msg.match(/Niños: (\d+)/);
                                if (adultsMatch) {
                                    setAdultsCount(parseInt(adultsMatch[1]));
                                    setIsAccompanied(true);
                                }
                                if (kidsMatch) setKidsCount(parseInt(kidsMatch[1]));
                            } catch (e) {
                                console.error('Error parsing RSVP counts', e);
                            }
                            if (rsvpData.status === 'yes' || rsvpData.status === 'no') {
                                setRsvpChoice(rsvpData.status as 'yes' | 'no');
                                setRsvpSuccess(true);
                            }
                        }

                        // Persistir token en sesión y limpiar URL
                        if (sessionKey && rawToken) {
                            sessionStorage.setItem(sessionKey, rawToken);
                            window.history.replaceState({}, '', window.location.pathname);
                        }
                    } else if (rpcError) {
                        console.error('RPC Error fetching guest:', rpcError);
                    }
                } else {
                    console.log('Token is not a valid UUID:', guestToken);
                }
            } catch (err) {
                console.warn('Guest fetch failed:', err);
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
            const totalPlusOnes = isAccompanied ? (adultsCount + kidsCount) : 0;
            const detailNote = isAccompanied ? `[Acompañantes - Adultos: ${adultsCount}, Niños: ${kidsCount}]` : '';
            
            // Priorizar el ID real del invitado cargado para evitar confusiones de tokens antiguos
            const activeToken = guest?.id || guestToken;

            console.log('Submit RSVP Debug:', {
                slug,
                status,
                token: activeToken,
                totalPlusOnes,
                detailNote
            });

            if (activeToken === 'admin') {
                // Simulate success for editor preview mode
                console.log('Admin preview mode: simulating RSVP success');
                setRsvpChoice(status);
                setRsvpSuccess(true);
                return;
            }

            if (activeToken) {
                // Confirmación con token (RPC Bypass RLS)
                const { error: rpcErr } = await supabase.rpc('submit_rsvp_by_token', {
                    p_token: activeToken,
                    p_slug: slug,
                    p_status: status,
                    p_plus_ones: totalPlusOnes,
                    p_dietary: null,
                    p_message: detailNote || 'Registro Directo'
                });
                if (rpcErr) {
                    console.error('RPC Submit Error:', rpcErr);
                    throw rpcErr;
                }
            } else {
                // Registro por nombre público (RPC Bypass RLS)
                const { error: rpcErr } = await supabase.rpc('register_rsvp_by_name', {
                    p_slug: slug,
                    p_name: cleanedName,
                    p_status: status,
                    p_plus_ones: totalPlusOnes
                });
                if (rpcErr) {
                    console.error('RPC Register Error:', rpcErr);
                    throw rpcErr;
                }
            }

            // Solo si llegamos aquí, marcamos como éxito
            setRsvpChoice(status);
            setRsvpSuccess(true);
        } catch (err: any) {
            console.error('RSVP Full Error:', err);
            const dbErrorMsg = err.message || err.details || 'Error de red';
            setError(`Error al procesar: ${dbErrorMsg}. Por favor reintenta.`);
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
                <Flower2 className="h-12 w-12 animate-pulse text-accent mx-auto" strokeWidth={1.5} />
                <p className="text-[var(--text-secondary)] font-serif italic">Preparando tu invitación...</p>
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
                        <div className="w-20 h-20 rounded-full bg-[var(--section-bg-alt)] flex items-center justify-center mx-auto mb-6">
                            <Heart className="h-9 w-9 text-stone-300" />
                        </div>

                        {/* Message */}
                        <h1 className="text-2xl font-serif text-[#1B2E1D] mb-3">
                            Invitación no encontrada
                        </h1>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8">
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
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-[var(--card-border)] text-[var(--text-secondary)] text-sm font-medium rounded-full hover:bg-[var(--section-bg-alt)] transition-colors"
                            >
                                Volver atrás
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="w-full px-6 py-4 text-center">
                    <p className="text-xs text-[var(--text-secondary)]">
                        ¿Quieres crear tu propia invitación?{' '}
                        <Link to="/" className="underline underline-offset-2 hover:text-[var(--text-secondary)] transition-colors">
                            Conoce Invitto
                        </Link>
                    </p>
                </footer>
            </div>
        );
    }

    if (!event.is_published) {
        const isOwner = user && user.id === event.user_id;
        if (isOwner) {
            return (
                <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
                    <div className="max-w-lg w-full bg-[var(--section-bg)] rounded-[2.5rem] p-10 md:p-14 text-center shadow-xl border border-[var(--border-color)]">
                        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-amber-50 mb-8">
                            <Eye className="h-10 w-10 text-amber-500" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif text-[#1B2E1D] mb-4">Tu invitación está casi lista</h2>
                        <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-10">
                            Esta es la vista previa de tu invitación. Para que tus invitados puedan verla y confirmar su asistencia, necesitas activar tu plan.
                        </p>
                        <Link
                            to={`/planes?id=${event.id}`}
                            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#BD7474] text-white rounded-2xl text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-[#A65B5B] transition-all shadow-xl shadow-[#BD7474]/20"
                        >
                            Activar mi invitación
                        </Link>
                        <Link
                            to="/dashboard"
                            className="block mt-6 text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] hover:text-[#1B2E1D] transition-colors"
                        >
                            Volver al panel
                        </Link>
                    </div>
                </div>
            );
        }
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-center">
                <div>
                    <p className="text-[var(--text-secondary)] font-serif text-2xl italic mb-2">Esta invitación aún no está activa</p>
                    <p className="text-stone-300 text-sm">Pídele al anfitrión que la publique para poder verla.</p>
                </div>
            </div>
        );
    }

    const eventDate = new Date(event.date_time);

    // ── Dynamic config from Visual Editor ──
    const cfg = event.theme_config || {};
    const heroTextColor = cfg.hero_text_color || cfg.heroTextColor || '#ffffff';
    const heroImageUrl = cfg.hero_image_url || null;
    const heroBgColor  = cfg.heroBgColor || cfg.hero_bg_color || '#1B2E1D';
    const subtitle = cfg.subtitle || '';
    const welcomeMessage = cfg.welcome_message || null;
    const venueTime = cfg.venue_time || null;

    // ── Typography — prefer theme font, fall back to user preset ──
    const typographyPreset = activeVars.fontPreset || cfg.typography_preset || cfg.typographyPreset || 'romantica';
    const fontMapping = {
        elegante:           { serif: 'Playfair Display', sans: 'Manrope' },
        moderna:            { serif: 'Outfit', sans: 'Inter' },
        romantica:          { serif: 'Libre Baskerville', sans: 'Lato' },
        'romantica-playfair': { serif: 'Playfair Display', sans: 'Lato' },
    };
    const selectedFonts = fontMapping[typographyPreset as keyof typeof fontMapping] || fontMapping.romantica;

    // ── Compute accent hex RGB for color-accent variable ──
    const themeAccentHex = _accentColor.replace('#', '');
    const tR = parseInt(themeAccentHex.substring(0, 2), 16) || 197;
    const tG = parseInt(themeAccentHex.substring(2, 4), 16) || 160;
    const tB = parseInt(themeAccentHex.substring(4, 6), 16) || 89;
    const accentRgb = `${tR} ${tG} ${tB}`;
    // Legacy aliases used by older sections
    const accentColor = _accentColor;
    const buttonColor = _buttonColor;
    const primaryColor = _buttonColor;

    // ── Theme-specific style overrides ──
    // These inject on top of CSS variables for structural decoration per theme
    const isClassicTheme    = themeName === 'classic' || themeName === 'classic-elegance' || !themeName;
    const isClassicProTheme = themeName === 'classic-elegance-pro';
    const isDarkTheme       = ['luxury-gold', 'neon-glow'].includes(themeName);
    const isModernTheme     = ['modern-minimalist', 'magazine', 'split-screen'].includes(themeName);
    const isBotanicalTheme  = themeName === 'romantic-botanical';

    const themeSpecificCSS = isClassicTheme ? `
        /* ── Elegancia Clásica overrides ── */
        .invitation-content h2,
        .invitation-content h3 {
            color: #C5A059 !important;
            letter-spacing: 0.15em;
            text-transform: uppercase;
        }
        .invitation-content section {
            border-radius: 0 !important;
        }
        /* Gold accent buttons */
        .invitation-content button[class*="rounded-full"][style*="background"] {
            background: linear-gradient(135deg, #B8860B, #C5A059, #9A7B38) !important;
            color: #ffffff !important;
        }
        /* Card gold borders */
        .invitation-content [class*="border-\\[var(--card-border)\\]"] {
            border-color: #C5A05944 !important;
        }
        /* Section headings ornamental line */
        .invitation-content .text-4xl::after,
        .invitation-content .text-5xl::after {
            content: '';
            display: block;
            width: 60px;
            height: 1px;
            background: #C5A059;
            margin: 12px auto 0;
        }
    ` : isClassicProTheme ? `
        /* ── Elegancia Clásica Pro — dark editorial ── */

        /* Dark section backgrounds */
        .invitation-content {
            background-color: #111111 !important;
        }

        /* Headings: warm gold */
        .invitation-content h2,
        .invitation-content h3 {
            color: #D4AF37 !important;
            letter-spacing: 0.12em;
            text-transform: uppercase;
        }

        /* Gold gradient for main buttons */
        .invitation-content button[style*="background"] {
            background: linear-gradient(135deg, #9A7B38, #D4AF37, #F5D76E) !important;
            color: #0A0A0A !important;
            border-radius: 0 !important;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            font-weight: 700;
        }
        .invitation-content [class*="rounded-3xl"],
        .invitation-content [class*="rounded-2xl"],
        .invitation-content [class*="rounded-full"] {
            border-radius: 4px !important;
        }

        /* Cards: dark with gold border */
        .invitation-content [class*="shadow-xl"],
        .invitation-content [class*="shadow-2xl"] {
            box-shadow: 0 4px 24px rgba(0,0,0,0.5) !important;
        }
        .invitation-content [class*="border-\\[var(--card-border)\\]"] {
            border-color: #D4AF3740 !important;
        }

        /* Gold thin line under section headings */
        .invitation-content .text-4xl::after,
        .invitation-content .text-5xl::after {
            content: '';
            display: block;
            width: 40px;
            height: 1px;
            background: linear-gradient(to right, transparent, #D4AF37, transparent);
            margin: 10px auto 0;
        }

        /* Itinerary timeline: gold */
        .invitation-content #itinerary .bg-stone-300 {
            background: linear-gradient(to bottom, #D4AF37, #9A7B38) !important;
        }
        .invitation-content #itinerary [class*="border-\\[var(--border-color)\\]"] {
            border-color: #D4AF3760 !important;
        }

        /* Outline buttons: gold border */
        .invitation-content button:not([style*="background"]) {
            border-color: #D4AF3760 !important;
            color: #D4AF37 !important;
        }

        /* Footer: dark */
        .invitation-content #footer {
            background: #0A0A0A !important;
            border-top: 1px solid #D4AF3720;
        }
        .invitation-content #footer h2,
        .invitation-content #footer h3 {
            color: #D4AF37 !important;
        }
    ` : isBotanicalTheme ? `
        /* ── Romántico Botánico (Invitto Pro) overrides ── */


        /* ── Global: botones sin border-radius, uppercase, gold ── */
        .invitation-content button[style*="background"],
        .invitation-content a > button[style*="background"] {
            background: #FAC345 !important;
            color: #1a1a1a !important;
            border-radius: 0 !important;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            font-weight: 700;
            box-shadow: none !important;
        }
        .invitation-content [class*="rounded-3xl"],
        .invitation-content [class*="rounded-2xl"],
        .invitation-content [class*="rounded-full"] {
            border-radius: 4px !important;
        }

        /* ── Headings: verde #527853 ── */
        .invitation-content h2,
        .invitation-content h3 {
            color: #527853 !important;
            font-weight: 400;
        }
        .invitation-content h4 {
            color: #527853;
        }

        /* ── Ornamento ❦ en mensajes/welcome ── */
        .invitation-content #message .text-accent,
        .invitation-content #guest_welcome .text-accent {
            color: #FAC345 !important;
        }

        /* ── Cards: borde suave, sombra ligera ── */
        .invitation-content [class*="shadow-xl"] {
            box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
        }
        .invitation-content [class*="border-\\[var(--card-border)\\]"] {
            border-color: #E5E7EB !important;
        }

        /* ── Botones outline: border dorado → fill dorado en hover ── */
        .invitation-content button:not([style*="background"]) {
            border-color: #FAC345;
            color: #527853;
            border-radius: 0 !important;
            letter-spacing: 0.1em;
            font-size: 11px;
            text-transform: uppercase;
        }

        /* ── RSVP: fondo verde oscuro, texto blanco ── */
        .invitation-content #rsvp {
            background-color: #527853 !important;
        }
        .invitation-content #rsvp h2,
        .invitation-content #rsvp h3,
        .invitation-content #rsvp p,
        .invitation-content #rsvp label {
            color: rgba(255,255,255,0.9) !important;
        }
        .invitation-content #rsvp h2 {
            color: #FAC345 !important;
        }
        .invitation-content #rsvp input {
            border-color: rgba(255,255,255,0.35) !important;
            color: #ffffff !important;
            background: transparent !important;
        }
        .invitation-content #rsvp input::placeholder {
            color: rgba(255,255,255,0.45) !important;
        }
        .invitation-content #rsvp button[style*="background"] {
            background: #FAC345 !important;
            color: #1a1a1a !important;
        }
        .invitation-content #rsvp [class*="rounded"] {
            border-radius: 0 !important;
        }
        /* Radio buttons accent */
        .invitation-content #rsvp input[type="radio"] {
            accent-color: #FAC345;
        }

        /* ── Itinerary timeline: línea dorada ── */
        .invitation-content #itinerary .bg-stone-300 {
            background-color: #FAC345 !important;
        }
        /* Dots del itinerario: dorados */
        .invitation-content #itinerary [class*="border-\\[var(--border-color)\\]"] {
            border-color: #FAC345 !important;
        }
        .invitation-content #itinerary .bg-\\[var\\(--section-bg\\)\\] {
            background-color: #FDFBF7 !important;
        }

        /* ── Dress code: label en rosa ── */
        .invitation-content #dress_code [class*="text-accent"] {
            color: #E0409A !important;
        }

        /* ── Honor court: foto bordada en dorado ── */
        .invitation-content #chambelanes [class*="rounded-full"],
        .invitation-content [class*="rounded-full"][class*="border"] {
            border-color: #FAC345 !important;
            border-radius: 50% !important;
        }

        /* ── Footer: hashtag en script dorado ── */
        .invitation-content #footer {
            background: #FFFFFF !important;
            border-top: 1px solid #E5E7EB;
        }
        .invitation-content #footer h2,
        .invitation-content #footer h3 {
            color: #FAC345 !important;
        }

        /* ── QR pase: borde doble dorado ── */
        .invitation-content #qr_pass [class*="border"] {
            border-color: #FAC345 !important;
        }
    ` : isDarkTheme ? `
        /* ── Dark theme overrides ── */
        .invitation-content button[class*="rounded-full"] {
            border: 1px solid ${_accentColor}44;
        }
    ` : isModernTheme ? `
        /* ── Modern theme overrides ── */
        .invitation-content h2,
        .invitation-content h3 {
            letter-spacing: -0.02em;
            font-weight: 700;
        }
        .invitation-content [class*="rounded-3xl"],
        .invitation-content [class*="rounded-2xl"] {
            border-radius: 0 !important;
        }
    ` : '';

    // Inject styles directly into tags for dynamic updates - Scoped to .invitation-content
    const commonStyles = `
        :root, html { 
            --color-accent: ${accentRgb} !important; 
        }
        .invitation-content h1, 
        .invitation-content h2, 
        .invitation-content h3, 
        .invitation-content .font-serif { 
            font-family: "${selectedFonts.serif}", serif !important; 
        }
        .invitation-content,
        .invitation-content body, 
        .invitation-content .font-sans { 
            font-family: "${selectedFonts.sans}", sans-serif !important; 
        }

        /* Responsive Móvil Estricto: 1 Columna Universal (Móvil físico y Simulador Admin) */
        @media (max-width: 767px) {
            .invitation-content .invitation-locations-wrapper {
                flex-direction: column !important;
                align-items: stretch !important;
            }
            .invitation-content .invitation-locations-wrapper > * {
                width: 100% !important;
                max-width: 100% !important;
                flex: 1 1 100% !important;
            }
            .invitation-content .invitation-itinerary-wrapper .timeline-line {
                left: 27px !important;
                transform: none !important;
            }
            .invitation-content .invitation-itinerary-wrapper .timeline-dot {
                left: 0 !important;
                transform: none !important;
            }
            .invitation-content .invitation-itinerary-wrapper .timeline-item {
                left: 0 !important;
                width: 100% !important;
                margin-left: 0 !important;
                padding-left: 64px !important;
                padding-right: 0 !important;
                text-align: left !important;
            }
            .invitation-content .invitation-rsvp-grid {
                grid-template-columns: 1fr !important;
                display: flex !important;
                flex-direction: column !important;
            }
            .invitation-content .invitation-rsvp-grid > * {
                width: 100% !important;
                max-width: 100% !important;
            }
            .invitation-content h1,
            .invitation-content h2,
            .invitation-content h3 {
                word-break: break-word !important;
                overflow-wrap: break-word !important;
            }
        }

        .is-mobile-preview .invitation-locations-wrapper,
        .invitation-content.is-mobile-preview .invitation-locations-wrapper {
            flex-direction: column !important;
            align-items: stretch !important;
        }
        .is-mobile-preview .invitation-locations-wrapper > *,
        .invitation-content.is-mobile-preview .invitation-locations-wrapper > * {
            width: 100% !important;
            max-width: 100% !important;
            flex: 1 1 100% !important;
        }
        .is-mobile-preview .invitation-itinerary-wrapper .timeline-line,
        .invitation-content.is-mobile-preview .invitation-itinerary-wrapper .timeline-line {
            left: 27px !important;
            transform: none !important;
        }
        .is-mobile-preview .invitation-itinerary-wrapper .timeline-dot,
        .invitation-content.is-mobile-preview .invitation-itinerary-wrapper .timeline-dot {
            left: 0 !important;
            transform: none !important;
        }
        .is-mobile-preview .invitation-itinerary-wrapper .timeline-item,
        .invitation-content.is-mobile-preview .invitation-itinerary-wrapper .timeline-item {
            left: 0 !important;
            width: 100% !important;
            margin-left: 0 !important;
            padding-left: 64px !important;
            padding-right: 0 !important;
            text-align: left !important;
        }
        .is-mobile-preview .invitation-rsvp-grid,
        .invitation-content.is-mobile-preview .invitation-rsvp-grid {
            grid-template-columns: 1fr !important;
            display: flex !important;
            flex-direction: column !important;
        }
        .is-mobile-preview .invitation-rsvp-grid > *,
        .invitation-content.is-mobile-preview .invitation-rsvp-grid > * {
            width: 100% !important;
            max-width: 100% !important;
        }
        .is-mobile-preview .invitation-rsvp-grid .lg\\:flex,
        .invitation-content.is-mobile-preview .invitation-rsvp-grid .lg\\:flex {
            display: none !important;
        }
        .is-mobile-preview .invitation-content h1,
        .is-mobile-preview .invitation-content h2,
        .is-mobile-preview .invitation-content h3,
        .invitation-content.is-mobile-preview h1,
        .invitation-content.is-mobile-preview h2,
        .invitation-content.is-mobile-preview h3 {
            word-break: break-word !important;
            overflow-wrap: break-word !important;
        }
        ${themeSpecificCSS}
        ${customStyles}
    `;

    // ── Layout modular: sección queue ────────────────────────────────
    const baseSlug = slug?.replace(/-pro$|-premium$/, '');
    const currentVersion = slug?.endsWith('-premium') ? 'premium' : slug?.endsWith('-pro') ? 'pro' : 'classic';
    const isDemo = baseSlug && [
        'xv-sofia-2026', 'xv-julia-2026', 'xv-regina-2026',
        'boda-ana-y-carlos', 'boda-gabriela-arturo', 'boda-isabel-rodrigo',
        'boda-collage', 'boda-simetria-floral',
        'cumple-emilia', 'bautizo-victoria', 'bautizo-camila',
        'graduacion-ana-psicologia', 'graduacion-roberto-ingenieria', 'comunion-gael'
    ].includes(baseSlug);

    const isPro     = cfg.isPro     === true
                   || normalizePlan(event.plan) === 'pro'
                   || (isDemo && currentVersion === 'pro');
    const isPremium = cfg.isPremium === true
                   || normalizePlan(event.plan) === 'premium'
                   || (isDemo && currentVersion === 'premium');
    const planTier = isPremium ? 'premium' : isPro ? 'pro' : ('clasico' as const);

    const savedOrder = (cfg.sectionOrder ?? DEFAULT_SECTION_ORDER) as SectionId[];
    const sectionQueue = buildSectionQueue(planTier, cfg as Record<string, unknown>, savedOrder);

    // ── Helpers ─────────────────────────────────────────────────────
    const getSealIcon = () => {
        const type = (event?.event_type || '').toLowerCase();
        if (type.includes('wedding') || type.includes('boda')) {
            return <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-red-100 animate-pulse" fill="currentColor" />;
        }
        if (type.includes('graduation') || type.includes('graduacion') || type.includes('graduación')) {
            return <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-red-100 animate-pulse" />;
        }
        if (type.includes('xv') || type.includes('quince')) {
            return <Crown className="h-8 w-8 sm:h-10 sm:w-10 text-red-100 animate-pulse" />;
        }
        if (type.includes('birthday') || type.includes('cumple')) {
            return <Cake className="h-8 w-8 sm:h-10 sm:w-10 text-red-100 animate-pulse" />;
        }
        if (type.includes('bapt') || type.includes('bautizo')) {
            return <Baby className="h-8 w-8 sm:h-10 sm:w-10 text-red-100 animate-pulse" />;
        }
        if (type.includes('comunion') || type.includes('communion')) {
            return <Church className="h-8 w-8 sm:h-10 sm:w-10 text-red-100 animate-pulse" />;
        }
        return <Flower2 className="h-8 w-8 sm:h-10 sm:w-10 text-red-100 animate-pulse" />;
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setIsAdminOpen(false); // Cierra el menú al navegar
        }
    };

    const eventLabels: Record<string, { ceremony: string; reception: string; tagline: string }> = {
        wedding:    { ceremony: 'Misa', reception: 'Celebración', tagline: 'Nos Casamos' },
        birthday:   { ceremony: 'Misa', reception: 'Celebración', tagline: 'Cumpleaños' },
        xv:         { ceremony: 'Misa de XV', reception: 'Fiesta de XV', tagline: 'Mis XV Años' },
        baptism:    { ceremony: 'Misa de Bautizo', reception: 'Celebración', tagline: 'Bautizo' },
        graduation: { ceremony: 'Ceremonia', reception: 'Festejo', tagline: 'Graduación' },
    };
    const labels = eventLabels[event.event_type] || eventLabels['birthday'];

    // ── Section Renderers ───────────────────────────────────────────
    const renderHero = () => {
        // FULL-PAGE THEMES (Highest priority - override default hero)
        if (cfg.theme === 'classic-elegance-pro') {
            return <ClassicEleganceProHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'classic-elegance' || cfg.theme === 'classic' || !cfg.theme) {
            return <ClassicEleganceHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'floral-symmetry') {
            return <FloralSymmetryHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'collage') {
            return <CollageHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'modern-minimalist') {
            return <ModernMinimalistHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'romantic-botanical') {
            return <RomanticBotanicalHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'split-screen') {
            return <SplitScreenHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'magazine') {
            return <MagazineHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'neon-glow') {
            return <NeonGlowHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'luxury-gold') {
            return <LuxuryGoldHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'passport') {
            return <PassportHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'polaroid-vintage') {
            return <PolaroidVintageHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'whimsical-kids') {
            return <WhimsicalKidsHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }

        if (planTier === 'clasico') {
            return (
                <section id="hero" key="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
                    {heroImageUrl ? (
                        <div className="absolute inset-0">
                            <img src={heroImageUrl} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-cream to-amber-50/30" />
                    )}

                    <div className="relative z-10 text-center px-6 py-20 max-w-2xl">
                        <div className="mb-8">
                            <Flower2 className="h-12 w-12 mx-auto mb-6 animate-pulse" strokeWidth={1.5} style={{color: heroTextColor, opacity: 0.8}} />
                        </div>
                        <p className="text-sm uppercase tracking-[0.4em] mb-6 font-sans" style={{color: heroTextColor, opacity: 0.85}}>
                            {subtitle || labels.tagline}
                        </p>
                        <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-serif font-light mb-6 leading-[1.1] md:leading-none drop-shadow-sm" style={{color: heroTextColor}}>
                            {event.title}
                        </h1>
                        {welcomeMessage && (
                            <p className="text-lg font-serif italic mb-12 max-w-md mx-auto leading-relaxed" style={{color: heroTextColor, opacity: 0.9}}>
                                {welcomeMessage}
                            </p>
                        )}
                        <div className={`inline-block rounded-full p-8 mb-12 ${heroImageUrl ? 'bg-[var(--section-bg)]/20 backdrop-blur-sm border border-white/30' : 'bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl'}`}>
                            <p className="text-5xl font-serif font-light mb-2" style={{color: accentColor}}>
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
                            {(cfg.showCountdown !== false) && (
                            <div className="mb-8 flex flex-wrap justify-center gap-6">
                                {[
                                    { label: 'Días', value: countdown.days },
                                    { label: 'Hrs', value: countdown.hours },
                                    { label: 'Min', value: countdown.minutes },
                                    { label: 'Seg', value: countdown.seconds },
                                ].map((item) => (
                                    <div key={item.label} className="text-center min-w-[70px]">
                                        <p className="text-3xl font-serif mb-1" style={{color: heroTextColor}}>{item.value}</p>
                                        <p className="text-[10px] uppercase tracking-widest opacity-60" style={{color: heroTextColor}}>{item.label}</p>
                                    </div>
                                ))}
                            </div>
                            )}
                        </div>
                    </div>
                </section>
            );
        }

        if (planTier === 'pro') {
            return (
                <section id="hero" key="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1B2E1D]">
                    {heroImageUrl ? (
                        <div className="absolute inset-0">
                            <img src={heroImageUrl} alt="" className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1B2E1D] via-transparent to-transparent" />
                        </div>
                    ) : (
                        <div className="absolute inset-0">
                            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px]" />
                            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[100px]" />
                        </div>
                    )}

                    <div className="relative z-10 text-center px-6 max-w-4xl">
                        <div className="mb-12 animate-in fade-in slide-in-from-top-10 duration-1000">
                            <div className="h-px w-24 bg-gradient-to-r from-transparent via-accent/50 to-transparent mx-auto mb-8" />
                            <p className="text-xs sm:text-sm uppercase tracking-[0.6em] mb-8 font-sans text-accent font-black">
                                {subtitle || labels.tagline}
                            </p>
                            <h1 className="text-5xl xs:text-6xl sm:text-8xl md:text-9xl font-serif font-light mb-10 leading-[1.1] md:leading-tight tracking-tight text-white drop-shadow-2xl">
                                {event.title}
                            </h1>
                            <div className="h-px w-24 bg-gradient-to-r from-transparent via-accent/50 to-transparent mx-auto mt-2" />
                        </div>

                        {(cfg.showCountdown !== false) && (
                            <div className="grid grid-cols-4 gap-4 sm:gap-10 max-w-2xl mx-auto mb-16 animate-in fade-in zoom-in duration-1000 delay-300">
                                {[
                                    { label: 'Días', value: countdown.days },
                                    { label: 'Horas', value: countdown.hours },
                                    { label: 'Minutos', value: countdown.minutes },
                                    { label: 'Segundos', value: countdown.seconds },
                                ].map((item) => (
                                    <div key={item.label} className="group cursor-default">
                                        <div className="relative">
                                            <p className="text-4xl sm:text-6xl font-serif text-white mb-2 transition-transform group-hover:scale-110 duration-300">
                                                {item.value.toString().padStart(2, '0')}
                                            </p>
                                            <div className="absolute -inset-2 bg-[var(--section-bg)]/5 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
                                        </div>
                                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-accent/80 font-bold">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/90 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                            <div className="flex items-center gap-4 group">
                                <div className="h-12 w-12 rounded-2xl bg-[var(--section-bg)]/5 border border-white/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                    <Calendar className="h-5 w-5 text-accent" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] uppercase tracking-widest text-accent font-bold">Fecha</p>
                                    <p className="text-lg font-serif">{format(eventDate, "EEEE d 'de' MMMM", { locale: es })}</p>
                                </div>
                            </div>
                            <div className="h-12 w-px bg-[var(--section-bg)]/10 hidden sm:block" />
                            <div className="flex items-center gap-4 group">
                                <div className="h-12 w-12 rounded-2xl bg-[var(--section-bg)]/5 border border-white/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                    <Clock className="h-5 w-5 text-accent" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] uppercase tracking-widest text-accent font-bold">Hora</p>
                                    <p className="text-lg font-serif">{format(eventDate, 'HH:mm', { locale: es })} hrs</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                        <div className="h-12 w-6 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
                            <div className="h-2 w-1 bg-accent rounded-full animate-scroll-inner" />
                        </div>
                    </div>
                </section>
            );
        }
        return (
            <section id="hero" key="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: heroBgColor }}>
                {heroImageUrl && (
                    <div className="absolute inset-0">
                        <img src={heroImageUrl} alt="" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                    </div>
                )}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />
                    <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[140px]" />
                    <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[140px]" />
                </div>

                <div className="relative z-10 text-center px-6 w-full max-w-6xl">
                    <div className="space-y-12 mb-20">
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-12 duration-1000">
                            <p className="text-[10px] sm:text-sm uppercase tracking-[0.4em] sm:tracking-[0.8em] font-sans text-accent font-black mb-6 sm:mb-8">
                                {subtitle || labels.tagline}
                            </p>
                            <h1 className="text-6xl xs:text-7xl sm:text-9xl md:text-[11rem] font-serif font-light leading-[1.1] sm:leading-[0.85] tracking-tighter text-white drop-shadow-2xl">
                                {event.title}
                            </h1>
                        </div>

                        {(cfg.showCountdown !== false) && (
                            <div className="flex justify-center items-center gap-4 sm:gap-16 animate-in fade-in zoom-in duration-1000 delay-500">
                                {[
                                    { label: 'Días', value: countdown.days },
                                    { label: 'Hrs', value: countdown.hours },
                                    { label: 'Min', value: countdown.minutes },
                                    { label: 'Seg', value: countdown.seconds },
                                ].map((item, idx) => (
                                    <div key={item.label} className="flex items-center gap-4 sm:gap-16">
                                        <div className="text-center">
                                            <p className="text-5xl sm:text-8xl font-serif font-light text-white mb-2">{item.value.toString().padStart(2, '0')}</p>
                                            <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-accent/60 font-bold">{item.label}</p>
                                        </div>
                                        {idx < 3 && <div className="h-12 w-px bg-[var(--section-bg)]/10 hidden sm:block" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-4xl mx-auto border-t border-white/10 pt-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
                        <div className="space-y-3">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-black">Cuándo</p>
                            <p className="text-2xl font-serif text-white">{format(eventDate, "d 'de' MMMM", { locale: es })}</p>
                            <p className="text-sm text-white/50 uppercase tracking-widest">{format(eventDate, "yyyy", { locale: es })}</p>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-black">Hora</p>
                            <p className="text-2xl font-serif text-white">{format(eventDate, 'HH:mm', { locale: es })} hrs</p>
                            <p className="text-sm text-white/50 uppercase tracking-widest">Puntual</p>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-black">Dónde</p>
                            <p className="text-2xl font-serif text-white">{event.venue_name}</p>
                            <p className="text-sm text-white/50 uppercase tracking-widest truncate max-w-[200px] mx-auto">{event.venue_address}</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    const renderGuestWelcome = () => (
        <section id="guest_welcome" key="guest_welcome" className="py-24 bg-[var(--section-bg)] border-b border-[var(--border-color)]">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <div className="mb-12 inline-flex items-center justify-center gap-4">
                    <div className="h-px w-12 bg-accent/30" />
                    <Flower2 className="h-6 w-6 text-accent/40" strokeWidth={1.5} />
                    <div className="h-px w-12 bg-accent/30" />
                </div>
                
                <h2 className="text-4xl sm:text-6xl font-serif font-light text-[var(--text-primary)] mb-8 leading-tight whitespace-pre-line">
                    {guest ? (
                        <>
                            ¡Hola, <span className="text-accent">{guest.name.split(' ')[0]}</span>!
                        </>
                    ) : (
                        "¡Bienvenidos!"
                    )}
                </h2>
                
                <p className="text-xl font-serif italic text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
                    {event.event_type === 'wedding' 
                        ? '"El amor no consiste en mirarse el uno al otro, sino en mirar juntos en la misma dirección"'
                        : event.event_type === 'xv'
                        ? '"El momento más especial de mi vida, y quiero compartirlo contigo"'
                        : '"Un momento especial que quiero compartir contigo"'}
                </p>
            </div>
        </section>
    );

    const renderMessage = () => (
        <section id="message" key="message" className="py-20 bg-[var(--section-bg)]">
            <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
                <div className="relative inline-block">
                    <Heart className="h-12 w-12 text-accent/20 mx-auto" />
                    <div className="absolute inset-0 animate-ping opacity-20">
                        <Heart className="h-12 w-12 text-accent/20 mx-auto" />
                    </div>
                </div>
                <div className="space-y-6">
                    {event.title && (
                        <h3 className="text-3xl font-serif text-[var(--text-primary)] mb-4 whitespace-pre-line">
                            {event.title}
                        </h3>
                    )}
                    <p className="text-[var(--text-secondary)] leading-relaxed text-lg whitespace-pre-line">
                        {welcomeMessage ? welcomeMessage : `Es un honor para nosotros invitarte a ser parte de este momento tan especial.\nTu presencia hará este día aún más memorable.`}
                    </p>
                </div>
            </div>
        </section>
    );

    const renderLocation = () => (
        <section id="location" key="location" className="py-24 bg-[var(--section-bg)]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h3 className="text-4xl sm:text-5xl font-serif font-light text-[var(--text-primary)] mb-4">Ubicación</h3>
                    <p className="text-[var(--text-secondary)]">Gracias por estar con nosotros, aquí las ubicaciones del evento</p>
                </div>

                <div className="invitation-locations-wrapper flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
                    {cfg.misa_name && (
                        <div className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl rounded-3xl p-10 text-center space-y-6 hover:shadow-2xl transition-all flex flex-col items-center">
                            <div className="inline-flex justify-center">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center shadow-md">
                                    <Heart className="h-10 w-10 text-rose-400" />
                                </div>
                            </div>
                            <h4 className="text-2xl font-serif font-medium text-[var(--text-primary)] uppercase tracking-wider">{labels.ceremony}</h4>
                            <div className="space-y-3 text-[var(--text-secondary)] w-full">
                                <p className="flex items-center justify-center gap-3 text-lg">
                                    <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                                    <span className="font-sans">{cfg.misa_time || "Por confirmar"} hrs</span>
                                </p>
                                <div className="flex flex-col items-center gap-1">
                                    <p className="font-serif text-lg text-[var(--text-primary)]">{cfg.misa_name}</p>
                                    <p className="text-sm font-light text-[var(--text-secondary)] italic max-w-[250px]">{cfg.misa_address}</p>
                                </div>
                            </div>
                            {cfg.misa_maps_link && (
                                <a href={cfg.misa_maps_link} target="_blank" rel="noreferrer" className="mt-auto pt-4">
                                    <button className="px-8 py-3 rounded-full text-[var(--button-contrast)] font-sans font-medium text-[11px] uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5" style={{ background: buttonColor }}>
                                        ¿Cómo llegar?
                                    </button>
                                </a>
                            )}
                        </div>
                    )}

                    <div className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl rounded-3xl p-10 text-center space-y-6 hover:shadow-2xl transition-all flex flex-col items-center">
                        <div className="inline-flex justify-center">
                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shadow-md">
                                <Music className="h-10 w-10 text-amber-500" />
                            </div>
                        </div>
                        <h4 className="text-2xl font-serif font-medium text-[var(--text-primary)] uppercase tracking-wider">{labels.reception}</h4>
                        <div className="space-y-3 text-[var(--text-secondary)] w-full">
                            <p className="flex items-center justify-center gap-3 text-lg">
                                <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                                <span className="font-sans">
                                    {venueTime ? `${venueTime} hrs` : `${format(eventDate, 'HH:mm', { locale: es })} hrs`}
                                </span>
                            </p>
                            <div className="flex flex-col items-center gap-1">
                                <p className="font-serif text-lg text-[var(--text-primary)]">{event.venue_name}</p>
                                <p className="text-sm font-light text-[var(--text-secondary)] italic max-w-[250px]">{event.venue_address}</p>
                            </div>
                        </div>
                        {event.maps_link && (
                            <a href={event.maps_link} target="_blank" rel="noreferrer" className="mt-auto pt-4">
                                <button className="px-8 py-3 rounded-full text-[var(--button-contrast)] font-sans font-medium text-[11px] uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5" style={{ background: buttonColor }}>
                                    ¿Cómo llegar?
                                </button>
                            </a>
                        )}
                    </div>
                </div>

                {event.maps_link && (
                    <div className="mt-16 max-w-5xl mx-auto">
                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl rounded-3xl overflow-hidden shadow-2xl">
                            <iframe
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(event.venue_address || event.venue_name || '')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                width="100%"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full"
                            />
                        </div>
                        <p className="text-center text-sm text-[var(--text-secondary)] mt-4">
                            Toca el mapa para ver la ubicación en Google Maps
                        </p>
                    </div>
                )}
            </div>
        </section>
    );

    const renderDressCode = () => (
        <section id="dress_code" key="dress_code" className="py-20 bg-[var(--section-bg-alt)]">
            <div className="max-w-3xl mx-auto px-6 text-center">
                <Flower2 className="h-10 w-10 mx-auto mb-8 text-accent/60" strokeWidth={1.5} />
                <h3 className="text-4xl font-serif font-light text-[var(--text-primary)] mb-6">Dress Code</h3>
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl rounded-3xl p-12 inline-block">
                    <p className="text-3xl font-serif text-[var(--text-primary)]">{event.dress_code}</p>
                </div>
            </div>
        </section>
    );

    const renderItinerary = () => {
        const items = (cfg?.itinerary?.length > 0 ? cfg.itinerary : cfg?.schedule) || [];
        if (items.length === 0) return null;
        
        return (
            <section id="itinerary" key="itinerary" className="py-24 bg-[var(--section-bg-alt)]">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl sm:text-5xl font-serif font-light text-[var(--text-primary)] mb-4">Itinerario</h3>
                        <p className="text-[var(--text-secondary)]">Programa del día</p>
                    </div>
                    
                    <div className="invitation-itinerary-wrapper relative max-w-2xl mx-auto py-8">
                        <div className="timeline-line absolute left-[27px] md:left-1/2 top-0 bottom-0 w-0.5 bg-stone-300 md:-translate-x-1/2" />
                        
                        <div className="space-y-12">
                            {items.map((item: any, idx: number) => {
                                const isEven = idx % 2 === 0;
                                let ItemIcon = Heart;
                                if (item.icon === 'wine') ItemIcon = Wine;
                                if (item.icon === 'utensils') ItemIcon = Utensils;
                                if (item.icon === 'music') ItemIcon = Music;
                                if (item.icon === 'party') ItemIcon = PartyPopper;
                                if (item.icon === 'moon') ItemIcon = Moon;
                                if (item.icon === 'clock') ItemIcon = Clock;

                                const itemTitle = item.title || item.event;
                                const itemDesc = item.description || item.location;

                                return (
                                    <div key={idx} className={`relative flex flex-col md:flex-row items-start md:items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                                        <div className="timeline-dot absolute left-0 md:left-1/2 md:-translate-x-1/2 w-12 h-12 xs:w-14 xs:h-14 rounded-full bg-[var(--section-bg)] border-4 border-[var(--border-color)] flex items-center justify-center z-10 shadow-md transition-transform hover:scale-110" style={{color: accentColor}}>
                                            <ItemIcon className="h-5 w-5 xs:h-6 xs:w-6" />
                                        </div>
                                        <div className={`timeline-item w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                                            <div className="bg-[var(--section-bg)]/80 backdrop-blur-sm p-5 xs:p-6 rounded-2xl border border-[var(--border-color)]/50 shadow-sm hover:shadow-md transition-shadow">
                                                <span className="inline-block px-3 py-1.5 rounded-full text-[9px] xs:text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{backgroundColor: `${accentColor}1A`, color: accentColor}}>
                                                    {item.time}
                                                </span>
                                                <h4 className="text-lg xs:text-xl font-serif text-[var(--text-primary)]">{itemTitle}</h4>
                                                {itemDesc && <p className="text-[var(--text-secondary)] mt-2 text-sm xs:text-base leading-relaxed">{itemDesc}</p>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    const renderRSVP = () => (
        <section id="rsvp" key="rsvp" className="py-16 bg-[var(--section-bg)]">
            <div className="max-w-5xl mx-auto px-6">
                <div className="invitation-rsvp-grid grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        {guest && (
                            <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
                                <span className="inline-block px-4 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest mb-4">
                                    Invitación Personalizada
                                </span>
                                <h2 className="text-4xl sm:text-5xl font-serif text-[#1B2E1D]">¡Hola, {guest.name}!</h2>
                            </div>
                        )}

                        {rsvpSuccess ? (
                            <div className="animate-fade-in flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                                <div className={`h-16 w-16 rounded-full flex items-center justify-center shadow-sm border ${
                                    rsvpChoice === 'yes' ? 'bg-green-50 border-green-100' : 'bg-[var(--section-bg-alt)] border-[var(--border-color)]'
                                }`}>
                                    {rsvpChoice === 'yes' ? (
                                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                                    ) : (
                                        <X className="h-8 w-8 text-[var(--text-secondary)]" />
                                    )}
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-[var(--text-primary)] mb-1">
                                        {rsvpChoice === 'yes' ? '¡Confirmado!' : '¡Anotado!'}
                                    </h2>
                                    <p className="text-[var(--text-secondary)] text-sm">
                                        {rsvpChoice === 'yes' 
                                            ? `Gracias ${guestName || 'por confirmar'}. Tu respuesta ha sido registrada.`
                                            : `Lamentamos que no puedas acompañarnos, ${guestName || ''}. Se ha registrado tu respuesta.`}
                                    </p>
                                </div>

                                {rsvpChoice === 'yes' && (
                                    <div className="lg:hidden w-full flex flex-col items-center gap-6">
                                        <div ref={qrCardRef} className="bg-[var(--section-bg-alt)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col items-center gap-4 w-full max-w-xs">
                                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--text-secondary)]">Tu pase de entrada</p>
                                            <div className="bg-[var(--section-bg)] p-3 rounded-xl shadow-sm">
                                                <QRCodeCanvas
                                                    ref={qrCanvasRef}
                                                    value={`${window.location.origin}/i/${slug}?t=${guestToken || guest?.id}`}
                                                    size={180}
                                                    level="M"
                                                    includeMargin={false}
                                                />
                                            </div>
                                            <p className="text-[10px] text-[var(--text-secondary)] text-center">Muestra este código en la entrada del evento</p>
                                            <button onClick={() => downloadQR(false)} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--card-border)] hover:border-stone-400 rounded-xl px-4 py-2">
                                                <Download className="h-3.5 w-3.5" /> Descargar QR
                                            </button>
                                        </div>

                                        <div className="w-full max-w-xs space-y-2">
                                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--text-secondary)] mb-3 text-center">Agendar en mi calendario</p>
                                            <a href={generateGoogleCalendarLink()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[var(--card-border)] hover:border-stone-400 hover:bg-[var(--section-bg-alt)] transition-all text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--text-secondary)]">
                                                <Calendar className="h-3.5 w-3.5" /> Google Calendar
                                            </a>
                                            <a href={generateICalLink()} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[var(--card-border)] hover:border-stone-400 hover:bg-[var(--section-bg-alt)] transition-all text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--text-secondary)]">
                                                <Calendar className="h-3.5 w-3.5" /> Apple Calendar / iCal
                                            </a>
                                        </div>
                                    </div>
                                )}
                                
                                {!guestToken && (
                                    <button onClick={() => setRsvpSuccess(false)} className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-300 hover:text-[var(--text-secondary)] transition-colors pt-4">
                                        MODIFICAR RESPUESTA
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-10">
                                <div className="space-y-2">
                                    <h3 className="text-3xl sm:text-4xl font-serif font-light text-[var(--text-primary)] mb-1">Confirma tu asistencia</h3>
                                    {event.rsvp_deadline && (
                                        <p className="text-sm text-[var(--text-secondary)] mb-8">
                                            Favor de confirmarte antes del {format(new Date(event.rsvp_deadline), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Nombre Completo</label>
                                        <input required type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Tu nombre" disabled={submitting} className="w-full bg-transparent border-b border-[var(--card-border)] py-3 focus:border-stone-400 outline-none transition-colors font-light text-xl text-[var(--text-primary)] placeholder:text-stone-200" readOnly={!!guest && !!guestToken} />
                                    </div>

                                    {(!guest || guest.max_plus_ones > 0) && (
                                        <div className="flex flex-col gap-6">
                                            <label className="flex items-start gap-4 cursor-pointer group">
                                                <div className="relative flex items-center justify-center mt-1">
                                                    <input type="checkbox" checked={isAccompanied} onChange={(e) => { const checked = e.target.checked; setIsAccompanied(checked); if (checked) setShowPlusOnesModal(true); }} className="peer h-6 w-6 rounded-md border-2 border-[var(--card-border)] checked:bg-[#1B2E1D] checked:border-[#1B2E1D] transition-all appearance-none cursor-pointer" />
                                                    <X className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none rotate-45" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-black uppercase tracking-widest text-[#1B2E1D] group-hover:text-[var(--text-primary)] transition-colors">
                                                        {guest ? `CONFIRMAR ACOMPAÑANTES (TOTAL: ${(guest.max_plus_ones || 0) + 1} PERSONAS)` : `CONFIRMAR ACOMPAÑANTES`}
                                                    </span>
                                                    {isAccompanied && (
                                                        <div onClick={(e) => { e.preventDefault(); setShowPlusOnesModal(true); }} className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-medium hover:text-[#BD7474] transition-colors">
                                                            {adultsCount} Adultos, {kidsCount} Niños • <span className="underline underline-offset-2">Editar</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                        </div>
                                    )}

                                    {error && <p className="text-red-500 text-sm font-semibold bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}

                                    <div className="space-y-4 pt-4">
                                        <button onClick={() => handleRsvp('yes')} disabled={submitting} className="w-full h-16 md:h-20 rounded-2xl text-[var(--button-contrast)] font-bold text-[10px] uppercase tracking-[0.4em] transition-all disabled:opacity-50 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center" style={{ background: buttonColor }}>
                                            {submitting ? 'PROCESANDO...' : 'SÍ, CONFIRMAR ASISTENCIA'}
                                        </button>
                                        <button onClick={() => handleRsvp('no')} disabled={submitting} className="w-full h-12 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-[10px] uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                                            No podré asistir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="hidden lg:flex flex-col items-center justify-center w-full max-w-md mx-auto">
                        {rsvpSuccess && rsvpChoice === 'yes' ? (
                            <div className="w-full flex flex-col items-center gap-8">
                                <div ref={qrCardDesktopRef} className="bg-[var(--section-bg)] border border-[var(--border-color)] rounded-[2rem] p-8 flex flex-col items-center gap-4 w-full shadow-2xl">
                                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">Tu Pase de Entrada</p>
                                    <div className="bg-[var(--section-bg-alt)] p-4 rounded-2xl shadow-inner border border-[var(--card-border)]">
                                        <QRCodeCanvas
                                            id={`qr-desktop-${guest?.id}`}
                                            value={`${window.location.origin}/i/${slug}?t=${guestToken || guest?.id}`}
                                            size={200}
                                            level="H"
                                            fgColor={primaryColor}
                                        />
                                    </div>
                                    <button onClick={() => downloadQR(true)} className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--card-border)] hover:border-stone-400 rounded-xl px-6 py-3 shadow-sm">
                                        <Download className="h-4 w-4" /> Guardar Código
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-[var(--section-bg-alt)] to-[var(--card-bg)] border border-[var(--border-color)] rounded-[2rem] p-12 flex flex-col items-center text-center gap-6 w-full shadow-2xl relative overflow-hidden opacity-50">
                                <Shield className="h-10 w-10 text-[var(--text-secondary)]" />
                                <h4 className="font-serif text-3xl text-[var(--text-primary)]">Pase de Acceso</h4>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );

    const renderGifts = () => (
        <section id="gifts" key="gifts" className="py-24 bg-[var(--section-bg-alt)]">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h3 className="text-4xl font-serif font-light text-[var(--text-primary)] mb-4">Mesa de Regalos</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
                        Nuestro mejor regalo es que estés con nosotros en nuestro día, pero si quieres hacernos un obsequio aquí están nuestras opciones
                    </p>
                </div>

                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl rounded-3xl p-6 sm:p-12 text-center">
                    <Gift className="h-16 w-16 mx-auto mb-8 text-accent" />
                    {cfg?.registry_items?.length > 0 ? (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 flex-wrap">
                            {cfg.registry_items.map((item: any, idx: number) => (
                                <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="px-6 py-3 sm:px-8 sm:py-4 rounded-full border-2 border-accent text-accent hover:bg-accent hover:text-[var(--accent-contrast)] font-sans font-medium uppercase tracking-wider transition-all hover:scale-105 flex flex-col gap-1 items-center justify-center">
                                    <span>{item.store}</span>
                                    {item.description && <span className="text-[9px] opacity-80 normal-case tracking-normal">{item.description}</span>}
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <button className="px-6 py-3 sm:px-8 sm:py-4 rounded-full border-2 border-accent text-accent hover:bg-accent hover:text-[var(--accent-contrast)] font-sans font-medium uppercase tracking-wider transition-all hover:scale-105">Liverpool</button>
                            <button className="px-6 py-3 sm:px-8 sm:py-4 rounded-full border-2 border-accent text-accent hover:bg-accent hover:text-[var(--accent-contrast)] font-sans font-medium uppercase tracking-wider transition-all hover:scale-105">Amazon</button>
                        </div>
                    )}
                    <div className="mt-12 pt-8 border-t border-[var(--card-border)]">
                        <p className="text-sm uppercase tracking-wider text-[var(--text-secondary)] mb-4">Lluvia de Sobres</p>
                        <p className="text-[var(--text-secondary)] max-w-md mx-auto text-sm">Si prefieres hacernos un obsequio en efectivo, te lo agradeceremos mucho</p>
                    </div>
                </div>
            </div>
        </section>
    );

    const renderGallery = () => {
        const rawImages = cfg?.gallery_images || cfg?.photoGallery?.images || [];
        // Map string arrays to the {url, caption} format expected by PhotoGallery
        const galleryImages = rawImages.map((img: any) => 
            typeof img === 'string' ? { url: img } : img
        );

        return (
            <div id="gallery" key="gallery">
                {galleryImages.length > 0 ? (
                    <PhotoGallery images={galleryImages} />
                ) : (
                    <section className="py-20 bg-[var(--section-bg)]">
                        <div className="max-w-3xl mx-auto px-6 text-center">
                            <Camera className="h-16 w-16 mx-auto mb-8 text-stone-300" />
                            <h3 className="text-3xl font-serif font-light text-[var(--text-primary)] mb-4">Galería de Fotos</h3>
                            <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
                                Será un gusto poder compartir este día contigo. Después del evento, podrás encontrar aquí las fotos del día.
                            </p>
                        </div>
                    </section>
                )}
            </div>
        );
    };

    const renderChambelanes = () => {
        const hasChambelanes = cfg.chambelanes && cfg.chambelanes.length > 0;
        const hasDamas = cfg.damas && cfg.damas.length > 0;
        const hasPadrinos = cfg.padrinos && cfg.padrinos.length > 0;
        const hasParents = !!cfg.parents;

        if (!hasChambelanes && !hasDamas && !hasPadrinos && !hasParents) return null;

        return (
            <section id="chambelanes" key="chambelanes" className="py-24 bg-[var(--section-bg)]">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl sm:text-5xl font-serif font-light text-[var(--text-primary)] mb-4">Corte de Honor</h3>
                        <p className="text-[var(--text-secondary)]">Mis acompañantes especiales</p>
                    </div>

                    {hasParents && (
                        <div className="mb-16">
                            <h4 className="text-2xl font-serif text-center mb-8 text-[var(--text-primary)]">Nuestros Padres</h4>
                            {cfg.parents.bride || cfg.parents.groom ? (
                                <div className="grid md:grid-cols-2 gap-8">
                                    {cfg.parents.bride && (
                                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl rounded-xl p-6 text-center">
                                            <p className="text-sm uppercase tracking-wider text-[var(--text-secondary)] mb-4 font-bold" style={{color: accentColor}}>Padres de la Novia</p>
                                            {cfg.parents.bride.father && <p className="text-lg font-serif text-[var(--text-primary)] mb-2">{cfg.parents.bride.father}</p>}
                                            {cfg.parents.bride.mother && <p className="text-lg font-serif text-[var(--text-primary)]">{cfg.parents.bride.mother}</p>}
                                        </div>
                                    )}
                                    {cfg.parents.groom && (
                                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl rounded-xl p-6 text-center">
                                            <p className="text-sm uppercase tracking-wider text-[var(--text-secondary)] mb-4 font-bold" style={{color: accentColor}}>Padres del Novio</p>
                                            {cfg.parents.groom.father && <p className="text-lg font-serif text-[var(--text-primary)] mb-2">{cfg.parents.groom.father}</p>}
                                            {cfg.parents.groom.mother && <p className="text-lg font-serif text-[var(--text-primary)]">{cfg.parents.groom.mother}</p>}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="max-w-md mx-auto bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl rounded-xl p-6 text-center">
                                    {cfg.parents.father && <p className="text-lg font-serif text-[var(--text-primary)] mb-2">{cfg.parents.father}</p>}
                                    {cfg.parents.mother && <p className="text-lg font-serif text-[var(--text-primary)]">{cfg.parents.mother}</p>}
                                </div>
                            )}
                        </div>
                    )}

                    <div className={`grid gap-12 ${hasChambelanes && hasDamas ? 'md:grid-cols-2' : hasPadrinos ? 'grid-cols-1' : 'max-w-2xl mx-auto'}`}>
                        {hasChambelanes && (
                            <div>
                                <h4 className="text-2xl font-serif text-center mb-8 text-[var(--text-primary)]">Chambelanes</h4>
                                <div className="space-y-4">
                                    {cfg.chambelanes.map((name: string, idx: number) => (
                                        <div key={idx} className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl rounded-xl p-4 text-center">
                                            <p className="text-lg text-[var(--text-primary)]">{name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {hasDamas && (
                            <div>
                                <h4 className="text-2xl font-serif text-center mb-8 text-[var(--text-primary)]">Damas</h4>
                                <div className="space-y-4">
                                    {cfg.damas.map((name: string, idx: number) => (
                                        <div key={idx} className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl rounded-xl p-4 text-center">
                                            <p className="text-lg text-[var(--text-primary)]">{name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {hasPadrinos && (
                            <div className={hasChambelanes || hasDamas ? 'md:col-span-2' : ''}>
                                <h4 className="text-2xl font-serif text-center mb-8 text-[var(--text-primary)]">Padrinos</h4>
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {cfg.padrinos.map((padrino: {role: string, names: string}, idx: number) => (
                                        <div key={idx} className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl rounded-xl p-6 text-center">
                                            <p className="text-sm uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-bold" style={{color: accentColor}}>{padrino.role}</p>
                                            <p className="text-lg font-serif text-[var(--text-primary)]">{padrino.names}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    };

    const renderAccommodation = () => (
        <section id="hotels" key="hotels" className="py-24 bg-[var(--section-bg-alt)]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <Hotel className="h-12 w-12 mx-auto mb-6 text-accent" />
                    <h3 className="text-4xl sm:text-5xl font-serif font-light text-[var(--text-primary)] mb-4">¿Dónde Hospedarse?</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(cfg.hotels || []).map((hotel: any, idx: number) => (
                        <div key={idx} className="bg-[var(--section-bg)] rounded-2xl overflow-hidden border border-[var(--card-border)] p-8">
                            <h4 className="text-xl font-serif font-semibold text-[var(--text-primary)] mb-2">{hotel.name}</h4>
                            <p className="text-sm text-[var(--text-secondary)]">{hotel.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    const renderFooter = () => (
        <footer id="footer" key="footer" className="bg-[var(--section-bg-alt)] text-[var(--text-primary)] py-10 text-center space-y-4">
            <div className="h-px w-32 mx-auto mb-6" style={{backgroundColor: accentColor, opacity: 0.4}} />
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)]">
                Creado con amor · <a href="https://invitto.com.mx/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Invitto</a>
            </p>
            <p className="text-[10px] text-[var(--text-secondary)]">© 2026 Todos los derechos reservados</p>
        </footer>
    );

    // ── Section Mapping ──────────────────────────────────────────────
    const SECTION_COMPONENTS: Record<SectionId, () => React.ReactNode> = {
        hero:          renderHero,
        guest_welcome: renderGuestWelcome,
        message:       renderMessage,
        location:      renderLocation,
        dress_code:    renderDressCode,
        itinerary:     renderItinerary,
        rsvp:          renderRSVP,
        gifts:         renderGifts,
        gallery:       renderGallery,
        chambelanes:   renderChambelanes,
        hotels:        renderAccommodation,
        footer:        renderFooter,
        countdown:     () => null, // Integrated into Hero
    };

    return (
        <div className={`min-h-screen bg-[var(--section-bg)] text-[var(--text-primary)] transition-colors duration-500 theme-${themeName}`} style={globalStyles}>
            <style>{commonStyles}</style>
            
            {/* Version Switcher (Demo Only) */}
            {isDemo && (
                <div className="fixed bottom-6 right-6 z-[999] flex flex-wrap gap-2 items-center">
                    <Link to={`/planes?theme=${cfg.theme || 'classic'}`} className="mr-2 sm:mr-4">
                        <button className="px-5 py-2 rounded-full text-sm font-bold bg-[#1B2E1D] text-white hover:bg-stone-800 shadow-xl flex items-center gap-2 border-2 border-[#1B2E1D]/20">
                            <Flower2 className="h-4 w-4 text-amber-200" />
                            Quiero usar esta plantilla
                        </button>
                    </Link>
                    <Link to="/"><button className="px-4 py-2 rounded-full text-sm font-semibold bg-[var(--section-bg)] text-[var(--text-primary)] hover:bg-[var(--section-bg-alt)] border-2 border-[var(--card-border)] transition-all flex items-center gap-2 shadow-sm"><Home className="h-4 w-4" /><span className="hidden sm:inline">Inicio</span></button></Link>
                </div>
            )}

            {/* PRE-RENDER Intro (Sobre Digital / Pantalla de Entrada) */}
            {((cfg.show_envelope !== false && cfg.showEnvelope !== false) && (isPremium || cfg.showEnvelope === true || cfg.show_envelope === true)) && !envelopeOpened ? (
                <div className="invitation-content min-h-screen bg-[var(--section-bg-alt)] flex items-center justify-center p-6 relative overflow-hidden">
                    <div className="relative z-10 max-w-3xl w-full">
                        <div className="relative bg-[var(--section-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden">
                            <div className="p-6 xs:p-10 sm:p-16 text-center relative">
                                <div className="mb-8 sm:mb-12 relative">
                                    <div className="w-full max-w-[260px] sm:w-80 h-48 sm:h-64 mx-auto relative">
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[240px] sm:w-72 h-8 bg-black/10 blur-xl rounded-full" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-stone-200 via-stone-100 to-stone-200 rounded-2xl shadow-xl" style={{ clipPath: 'polygon(0 0, 50% 45%, 100% 0, 100% 100%, 0 100%)' }} />
                                        <div className="absolute inset-4 border-2 border-stone-300/50 rounded-xl" style={{ clipPath: 'polygon(5% 20%, 50% 50%, 95% 20%, 95% 95%, 5% 95%)' }} />
                                        <div className="absolute top-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-br from-amber-100 via-rose-50 to-stone-100 border-4 border-[var(--card-border)] shadow-lg" style={{ clipPath: 'polygon(0 0, 50% 65%, 100% 0)', transformOrigin: 'top center', animation: 'envelope-flap 3s ease-in-out infinite' }} />
                                        <div className="absolute top-16 sm:top-24 left-1/2 -translate-x-1/2 z-20">
                                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-900 shadow-2xl flex items-center justify-center border-4 border-red-400/30">
                                                {getSealIcon()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {guest && (
                                    <div className="mb-6 sm:mb-8">
                                        <p className="text-[10px] uppercase tracking-[0.5em] text-accent font-semibold mb-2 sm:mb-3">Para</p>
                                        <h2 className="text-3xl sm:text-5xl font-serif font-light text-[var(--text-primary)] mb-2">{guest.name}</h2>
                                        <div className="h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto" />
                                    </div>
                                )}
                                <div className="mb-8 sm:mb-10">
                                    <h3 className="text-3xl xs:text-4xl sm:text-7xl font-serif font-light text-transparent bg-clip-text bg-gradient-to-r from-stone-800 via-accent to-stone-800 mb-2 sm:mb-4 leading-tight">{event.title}</h3>
                                    <p className="text-[var(--text-secondary)] text-[10px] sm:text-sm uppercase tracking-[0.4em] font-medium">
                                        {(event.event_type as string) === 'wedding' ? 'Boda' 
                                            : (event.event_type as string) === 'xv' ? 'XV Años' 
                                            : (event.event_type as string) === 'graduacion' || (event.event_type as string) === 'graduation' ? 'Graduación' 
                                            : (event.event_type as string) === 'birthday' || (event.event_type as string) === 'cumpleanos' ? 'Cumpleaños' 
                                            : (event.event_type as string) === 'bautizo' || (event.event_type as string) === 'baptism' ? 'Bautizo' 
                                            : (event.event_type as string) === 'comunion' ? 'Primera Comunión' 
                                            : 'Celebración'}
                                    </p>
                                </div>
                                <button onClick={() => setEnvelopeOpened(true)} className="inline-flex items-center gap-2 sm:gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-accent text-[var(--accent-contrast)] rounded-full font-sans font-bold uppercase tracking-widest text-[10px] sm:text-sm hover:bg-accent-dark transition-colors"><Mail className="h-5 w-5 sm:h-6 sm:w-6" /><span>Abrir Invitación</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Floating Device Viewport & Template Selector Bar (Admin / Preview Mode) */}
                    {isAdminMode && (
                        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-2xl border border-stone-200/80 flex items-center gap-2 animate-in fade-in slide-in-from-top duration-300 max-w-[92vw] overflow-x-auto">
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setDeviceView('mobile')}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                        deviceView === 'mobile'
                                            ? 'bg-[#1B2E1D] text-white shadow-md'
                                            : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                                    }`}
                                >
                                    <Smartphone className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Móvil</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeviceView('desktop')}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                        deviceView === 'desktop'
                                            ? 'bg-[#1B2E1D] text-white shadow-md'
                                            : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                                    }`}
                                >
                                    <Monitor className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Desktop</span>
                                </button>
                            </div>

                            <div className="h-4 w-[1px] bg-stone-200" />

                            <div className="flex items-center gap-1.5 pl-0.5">
                                <Palette className="h-3.5 w-3.5 text-[#DF3B94] flex-shrink-0" />
                                <select
                                    value={cfg.theme || 'classic'}
                                    onChange={(e) => handleUpdateFeature('theme', e.target.value)}
                                    className="bg-transparent text-xs font-bold text-[#1B2E1D] outline-none cursor-pointer hover:text-[#DF3B94] border-none py-1 pr-1"
                                >
                                    <option value="classic">✨ Elegancia Clásica</option>
                                    <option value="classic-elegance-pro">👑 Elegancia Clásica Pro</option>
                                    <option value="modern-minimalist">🖤 Minimalista Moderno</option>
                                    <option value="romantic-botanical">🌿 Botánica Romántica</option>
                                    <option value="floral-symmetry">🌸 Simetría Floral</option>
                                    <option value="magazine">📖 Editorial / Revista</option>
                                    <option value="luxury-gold">🌟 Oro Lujoso</option>
                                    <option value="split-screen">🌓 Pantalla Dividida</option>
                                    <option value="collage">🖼️ Collage Fotográfico</option>
                                    <option value="passport">✈️ Pasaporte Viajero</option>
                                    <option value="polaroid-vintage">📸 Polaroid Vintage</option>
                                    <option value="neon-glow">🪩 Fiesta & Neón</option>
                                    <option value="whimsical-kids">🎈 Infantil Fantasía</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* MODULAR LAYOUT RENDERER */}
                    <div className={isAdminMode && deviceView === 'mobile' ? "is-mobile-preview max-w-[430px] mx-auto my-8 sm:my-16 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border-[8px] sm:border-[12px] border-stone-900 overflow-hidden relative bg-[var(--section-bg)] transition-all ring-1 ring-stone-900/10" : "w-full transition-all"}>
                        <div className={`invitation-content ${isAdminMode && deviceView === 'mobile' ? 'is-mobile-preview' : ''}`}>
                            {sectionQueue.map((section) => {
                                const renderer = SECTION_COMPONENTS[section.id];
                                const content = renderer ? renderer() : null;
                                if (!content) return null;
                                return <div key={section.id}>{content}</div>;
                            })}
                        </div>
                    </div>

                    {/* Admin Controls */}
                    {isAdminMode && (
                        <>
                            <button 
                                onClick={() => setIsAdminOpen(true)} 
                                className={`fixed ${isDemo ? 'top-20' : 'top-4'} right-4 z-[60] bg-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl border border-stone-200 flex items-center gap-3 hover:scale-105 hover:bg-stone-50 transition-all text-[#1B2E1D]`}
                            >
                                <Settings className="h-4 w-4 sm:h-5 sm:w-5 spin-slow" />
                                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest hidden xs:inline">Editor Directo</span>
                            </button>
                            {isAdminOpen && (
                                <div className="fixed inset-0 z-[70] flex justify-end">
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAdminOpen(false)} />
                                    <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-8 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-[#1B2E1D] rounded-xl text-white"><Activity className="h-5 w-5" /></div>
                                                <div><h3 className="text-lg font-serif text-[#1B2E1D]">Configuración</h3><p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Admin Panel</p></div>
                                            </div>
                                            <button onClick={() => setIsAdminOpen(false)} className="p-4 hover:bg-stone-100 rounded-full transition-colors"><X className="h-6 w-6 text-stone-400" /></button>
                                        </div>

                                        {/* Cambiador de Plantilla Card */}
                                        <div className="p-4 bg-gradient-to-r from-emerald-50/80 via-stone-50 to-white rounded-2xl border border-emerald-200/80 mb-4 flex flex-col gap-3 shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="p-2.5 bg-[#1B2E1D] text-white rounded-xl shadow-sm">
                                                        <Palette className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-bold text-[#1B2E1D]">Estilo de Plantilla</h4>
                                                        <p className="text-[10px] text-stone-400">Cambia el diseño en vivo</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <select
                                                value={cfg.theme || 'classic'}
                                                onChange={(e) => handleUpdateFeature('theme', e.target.value)}
                                                className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-[#1B2E1D] outline-none cursor-pointer focus:border-[#DF3B94]"
                                            >
                                                <option value="classic">✨ Elegancia Clásica</option>
                                                <option value="classic-elegance-pro">👑 Elegancia Clásica Pro</option>
                                                <option value="modern-minimalist">🖤 Minimalista Moderno</option>
                                                <option value="romantic-botanical">🌿 Botánica Romántica</option>
                                                <option value="floral-symmetry">🌸 Simetría Floral</option>
                                                <option value="magazine">📖 Editorial / Revista</option>
                                                <option value="luxury-gold">🌟 Oro Lujoso</option>
                                                <option value="split-screen">🌓 Pantalla Dividida</option>
                                                <option value="collage">🖼️ Collage Fotográfico</option>
                                                <option value="passport">✈️ Pasaporte Viajero</option>
                                                <option value="polaroid-vintage">📸 Polaroid Vintage</option>
                                                <option value="neon-glow">🪩 Fiesta & Neón</option>
                                                <option value="whimsical-kids">🎈 Infantil Fantasía</option>
                                            </select>
                                        </div>

                                        {/* Sobre Digital Toggle Switch Card */}
                                        <div className="p-4 bg-gradient-to-r from-pink-50/70 via-purple-50/40 to-white rounded-2xl border border-pink-200/80 mb-6 flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-[#DF3B94] text-white rounded-xl shadow-md shadow-pink-500/20">
                                                    <Mail className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-[#1B2E1D]">Sobre Digital</h4>
                                                    <p className="text-[10px] text-stone-400">Pantalla con botón "Abrir Invitación"</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const isCurrentlyActive = (cfg.show_envelope !== false && cfg.showEnvelope !== false);
                                                    handleUpdateFeature('showEnvelope', !isCurrentlyActive);
                                                }}
                                                className={`p-2 px-3 rounded-xl transition-all flex items-center gap-1.5 font-bold text-xs ${
                                                    (cfg.show_envelope !== false && cfg.showEnvelope !== false)
                                                        ? 'bg-emerald-500 text-white shadow-sm'
                                                        : 'bg-stone-200 text-stone-600'
                                                }`}
                                                title={(cfg.show_envelope !== false && cfg.showEnvelope !== false) ? "Ocultar Sobre Digital" : "Mostrar Sobre Digital"}
                                            >
                                                {(cfg.show_envelope !== false && cfg.showEnvelope !== false) ? (
                                                    <>
                                                        <Eye className="h-3.5 w-3.5" />
                                                        <span className="text-[10px]">Activo</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="h-3.5 w-3.5" />
                                                        <span className="text-[10px]">Oculto</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-400 mb-4">Secciones del Layout</h4>
                                            {buildFullPlanQueue(planTier).filter(sec => !sec.fixed).sort((a, b) => {
                                                const indexA = savedOrder.indexOf(a.id);
                                                const indexB = savedOrder.indexOf(b.id);
                                                if (indexA === -1 && indexB === -1) return 0;
                                                if (indexA === -1) return 1;
                                                if (indexB === -1) return -1;
                                                return indexA - indexB;
                                            }).map((sec, idx, arr) => {
                                                const isActive = sec.configKey ? cfg[sec.configKey] !== false : true;
                                                return (
                                                    <div 
                                                        key={sec.id} 
                                                        onClick={() => scrollToSection(sec.id)}
                                                        className="group flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-all cursor-pointer shadow-sm"
                                                    >
                                                        <span className="text-sm font-bold text-[#1B2E1D]">{sec.label}</span>
                                                        {!sec.fixed && (
                                                            <div className="flex items-center gap-1">
                                                                <button 
                                                                    onClick={async (e) => {
                                                                        e.stopPropagation();
                                                                        if (idx === 0) return;
                                                                        const newOrder = [...savedOrder];
                                                                        const secIndex = newOrder.indexOf(sec.id);
                                                                        if (secIndex > 0) {
                                                                            [newOrder[secIndex - 1], newOrder[secIndex]] = [newOrder[secIndex], newOrder[secIndex - 1]];
                                                                            await handleUpdateFeature('sectionOrder', newOrder);
                                                                        }
                                                                    }}
                                                                    disabled={idx === 0}
                                                                    className={`p-1.5 rounded-lg transition-colors ${idx === 0 ? 'text-stone-200 cursor-not-allowed' : 'text-stone-400 hover:bg-stone-200 hover:text-stone-700'}`}
                                                                    title="Mover Arriba"
                                                                >
                                                                    <ChevronUp className="h-4 w-4" />
                                                                </button>
                                                                <button 
                                                                    onClick={async (e) => {
                                                                        e.stopPropagation();
                                                                        if (idx === arr.length - 1) return;
                                                                        const newOrder = [...savedOrder];
                                                                        const secIndex = newOrder.indexOf(sec.id);
                                                                        if (secIndex !== -1 && secIndex < newOrder.length - 1) {
                                                                            [newOrder[secIndex + 1], newOrder[secIndex]] = [newOrder[secIndex], newOrder[secIndex + 1]];
                                                                            await handleUpdateFeature('sectionOrder', newOrder);
                                                                        }
                                                                    }}
                                                                    disabled={idx === arr.length - 1}
                                                                    className={`p-1.5 rounded-lg transition-colors ${idx === arr.length - 1 ? 'text-stone-200 cursor-not-allowed' : 'text-stone-400 hover:bg-stone-200 hover:text-stone-700'}`}
                                                                    title="Mover Abajo"
                                                                >
                                                                    <ChevronDown className="h-4 w-4" />
                                                                </button>
                                                                <button 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEditingSection(sec.id);
                                                                    }}
                                                                    className="ml-1 p-2 rounded-lg transition-colors text-stone-400 hover:bg-stone-100 hover:text-[#1B2E1D]"
                                                                    title={`Editar ${sec.label}`}
                                                                >
                                                                    <Edit2 className="h-4 w-4" />
                                                                </button>
                                                                <button 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (sec.configKey) handleUpdateFeature(sec.configKey, !isActive);
                                                                    }}
                                                                    className={`ml-1 p-2 rounded-lg transition-colors ${isActive ? 'text-emerald-500 bg-emerald-50' : 'text-stone-400 bg-stone-100'}`}
                                                                    title={isActive ? "Ocultar Sección" : "Mostrar Sección"}
                                                                >
                                                                    {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Inline Section Editor Modal (Elevated to root level z-100) */}
                    {editingSection && event && (
                        <InlineSectionEditor 
                            sectionId={editingSection}
                            event={event}
                            onClose={() => setEditingSection(null)}
                            onUpdateThemeConfig={handleUpdateFeature}
                            onUpdateEventColumn={handleUpdateEventColumn}
                        />
                    )}

                    {/* Plus Ones Modal */}
                    {showPlusOnesModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                            <div className="absolute inset-0 bg-[#1B2E1D]/40 backdrop-blur-sm" onClick={() => setShowPlusOnesModal(false)} />
                            <div className="relative w-full max-w-sm bg-[var(--section-bg)] rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-500">
                                <div className="text-center mb-10"><UsersIcon className="h-10 w-10 mx-auto mb-4 text-[#BD7474]" /><h3 className="text-2xl font-serif text-[#1B2E1D]">Acompañantes</h3></div>
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between bg-[var(--section-bg-alt)] p-6 rounded-2xl">
                                        <div><p className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)]">Adultos</p></div>
                                        <div className="flex items-center gap-4"><button onClick={() => setAdultsCount(Math.max(0, adultsCount - 1))} className="h-10 w-10 rounded-xl bg-[var(--section-bg)] border border-[var(--border-color)]">-</button><span className="text-xl font-bold w-6 text-center">{adultsCount}</span><button onClick={() => setAdultsCount(adultsCount + 1)} className="h-10 w-10 rounded-xl bg-[var(--section-bg)] border border-[var(--border-color)]">+</button></div>
                                    </div>
                                </div>
                                <button onClick={() => setShowPlusOnesModal(false)} className="w-full mt-10 py-5 bg-[#1B2E1D] text-white rounded-2xl text-[10px] uppercase font-black tracking-widest shadow-lg">Confirmar</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
