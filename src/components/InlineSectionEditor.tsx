import { useState, useEffect, useRef } from 'react';
import { X, Save, Plus, Trash2, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import type { Event } from '../types/database.types';
import type { SectionId } from '../lib/sectionRegistry';

type Props = {
    sectionId: SectionId;
    event: Event;
    onClose: () => void;
    onUpdateThemeConfig: (keyOrUpdates: string | Record<string, any>, value?: any) => Promise<void>;
    onUpdateEventColumn: (columnOrUpdates: string | Record<string, any>, value?: any) => Promise<void>;
};

export default function InlineSectionEditor({ sectionId, event, onClose, onUpdateThemeConfig, onUpdateEventColumn }: Props) {
    const toast = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const cfg = event.theme_config || {};
    
    // ── Hero & Common ──
    const [title, setTitle] = useState(event.title || '');
    const [subtitle, setSubtitle] = useState(cfg.subtitle || '');
    const [childName, setChildName] = useState(cfg.child_name || cfg.childName || '');
    const [age, setAge] = useState(cfg.age || cfg.turning_age || '');
    const [welcomeMessage, setWelcomeMessage] = useState(cfg.welcome_message || '');
    const [dateTime, setDateTime] = useState(event.date_time ? new Date(event.date_time).toISOString().slice(0, 16) : '');
    const [heroImageUrl, setHeroImageUrl] = useState(cfg.hero_image_url || cfg.heroImage || '');
    const [uploadingHero, setUploadingHero] = useState(false);
    const heroFileInputRef = useRef<HTMLInputElement>(null);

    // Gallery upload states
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const galleryFileInputRef = useRef<HTMLInputElement>(null);
    
    // ── Guest Welcome ──
    const [welcomeTitle, setWelcomeTitle] = useState(cfg.welcome_title || cfg.welcomeTitle || '¡Bienvenidos!');
    const [welcomeQuote, setWelcomeQuote] = useState(
        cfg.welcome_quote || cfg.welcomeQuote || cfg.quote || (
            event.event_type === 'wedding' 
                ? '"El amor no consiste en mirarse el uno al otro, sino en mirar juntos en la misma dirección"'
                : event.event_type === 'xv'
                ? '"El momento más especial de mi vida, y quiero compartirlo contigo"'
                : '"Un momento especial que quiero compartir contigo"'
        )
    );

    // ── Location ──
    const [venueName, setVenueName] = useState(event.venue_name || '');
    const [venueAddress, setVenueAddress] = useState(event.venue_address || '');
    const [mapsLink, setMapsLink] = useState(event.maps_link || '');
    const [venueTime, setVenueTime] = useState(cfg.venue_time || '');
    const [misaName, setMisaName] = useState(cfg.misa_name || '');
    const [misaTime, setMisaTime] = useState(cfg.misa_time || '');
    const [misaAddress, setMisaAddress] = useState(cfg.misa_address || '');
    const [misaMapsLink, setMisaMapsLink] = useState(cfg.misa_maps_link || '');

    // ── Dress Code ──
    const [dressCode, setDressCode] = useState(event.dress_code || '');
    const [dressCodeNotes, setDressCodeNotes] = useState(cfg.dress_code_notes || cfg.dressCodeNotes || '');

    // ── Gifts / Mesa de Regalos ──
    const [giftTitle, setGiftTitle] = useState(cfg.gift_title || cfg.giftTitle || 'Mesa de Regalos');
    const [giftMessage, setGiftMessage] = useState(cfg.gift_message || cfg.giftMessage || 'Nuestro mejor regalo es que estés con nosotros en nuestro día, pero si quieres hacernos un obsequio aquí están nuestras opciones');
    const [cashGiftTitle, setCashGiftTitle] = useState(cfg.cash_gift_title || 'Lluvia de Sobres');
    const [cashGiftMessage, setCashGiftMessage] = useState(cfg.cash_gift_message || cfg.cashGiftMessage || 'Si prefieres hacernos un obsequio en efectivo, te lo agradeceremos mucho');
    const [bankName, setBankName] = useState(cfg.bank_name || '');
    const [bankClabe, setBankClabe] = useState(cfg.bank_clabe || '');
    const [bankBeneficiary, setBankBeneficiary] = useState(cfg.bank_beneficiary || '');
    const [registryItems, setRegistryItems] = useState<{ store: string; link: string; description?: string }[]>(
        Array.isArray(cfg.registry_items) ? cfg.registry_items : (Array.isArray(cfg.registryItems) ? cfg.registryItems : [])
    );

    // ── Itinerary ──
    const rawItinerary = (cfg?.itinerary?.length > 0 ? cfg.itinerary : cfg?.schedule) || [];
    const [itineraryItems, setItineraryItems] = useState<{ id: string; time: string; title: string; description?: string; icon?: string }[]>(
        Array.isArray(rawItinerary) ? rawItinerary.map((item: any, i: number) => ({
            id: item.id || `itin-${i}`,
            time: item.time || '16:00',
            title: item.title || item.event || '',
            description: item.description || item.location || '',
            icon: item.icon || 'heart'
        })) : []
    );

    // ── Hotels ──
    const rawHotels = cfg.hotels || cfg.accommodations?.hotels || [];
    const [hotelsList, setHotelsList] = useState<{ name: string; distance?: string; description?: string; price?: string; link?: string; isRecommended?: boolean }[]>(
        Array.isArray(rawHotels) ? rawHotels : []
    );

    // ── Gallery ──
    const [galleryTitle, setGalleryTitle] = useState(cfg.gallery_title || cfg.galleryTitle || 'Galería de Fotos');
    const [gallerySubtitle, setGallerySubtitle] = useState(cfg.gallery_subtitle || cfg.gallerySubtitle || 'Momentos inolvidables compartidos con amor.');
    const rawGalleryImages = cfg.gallery_images || cfg.galleryImages || cfg.gallery || [];
    const [galleryImages, setGalleryImages] = useState<string[]>(
        Array.isArray(rawGalleryImages) 
            ? rawGalleryImages.map((img: any) => typeof img === 'string' ? img : img?.url || '').filter(Boolean)
            : []
    );
    const [newImageUrl, setNewImageUrl] = useState('');

    // ── RSVP ──
    const [rsvpDeadline, setRsvpDeadline] = useState(event.rsvp_deadline ? new Date(event.rsvp_deadline).toISOString().slice(0, 10) : '');
    const [rsvpNotes, setRsvpNotes] = useState(cfg.rsvp_notes || '');
    const [whatsappNumber, setWhatsappNumber] = useState(cfg.whatsapp_number || '');

    // ── Corte de Honor (Chambelanes & Parents) ──
    const [brideFather, setBrideFather] = useState(cfg.parents?.bride?.father || cfg.parents?.father || '');
    const [brideMother, setBrideMother] = useState(cfg.parents?.bride?.mother || cfg.parents?.mother || '');
    const [groomFather, setGroomFather] = useState(cfg.parents?.groom?.father || '');
    const [groomMother, setGroomMother] = useState(cfg.parents?.groom?.mother || '');
    const [chambelanesList, setChambelanesList] = useState<string[]>(Array.isArray(cfg.chambelanes) ? cfg.chambelanes : []);
    const [damasList, setDamasList] = useState<string[]>(Array.isArray(cfg.damas) ? cfg.damas : []);

    // Keep state fresh if event changes
    useEffect(() => {
        setTitle(event.title || '');
        setSubtitle(cfg.subtitle || '');
        setChildName(cfg.child_name || cfg.childName || '');
        setAge(cfg.age || cfg.turning_age || '');
        setHeroImageUrl(cfg.hero_image_url || cfg.heroImage || '');
        setWelcomeMessage(cfg.welcome_message || '');
        setDateTime(event.date_time ? new Date(event.date_time).toISOString().slice(0, 16) : '');
        setWelcomeTitle(cfg.welcome_title || cfg.welcomeTitle || '¡Bienvenidos!');
        setWelcomeQuote(
            cfg.welcome_quote || cfg.welcomeQuote || cfg.quote || (
                event.event_type === 'wedding' 
                    ? '"El amor no consiste en mirarse el uno al otro, sino en mirar juntos en la misma dirección"'
                    : event.event_type === 'xv'
                    ? '"El momento más especial de mi vida, y quiero compartirlo contigo"'
                    : '"Un momento especial que quiero compartir contigo"'
            )
        );
        setVenueName(event.venue_name || '');
        setVenueAddress(event.venue_address || '');
        setMapsLink(event.maps_link || '');
        setVenueTime(cfg.venue_time || '');
        setMisaName(cfg.misa_name || '');
        setMisaTime(cfg.misa_time || '');
        setMisaAddress(cfg.misa_address || '');
        setMisaMapsLink(cfg.misa_maps_link || '');
        setDressCode(event.dress_code || '');
        setDressCodeNotes(cfg.dress_code_notes || cfg.dressCodeNotes || '');
        setGiftTitle(cfg.gift_title || cfg.giftTitle || 'Mesa de Regalos');
        setGiftMessage(cfg.gift_message || cfg.giftMessage || 'Nuestro mejor regalo es que estés con nosotros en nuestro día, pero si quieres hacernos un obsequio aquí están nuestras opciones');
        setCashGiftTitle(cfg.cash_gift_title || 'Lluvia de Sobres');
        setCashGiftMessage(cfg.cash_gift_message || cfg.cashGiftMessage || 'Si prefieres hacernos un obsequio en efectivo, te lo agradeceremos mucho');
        setBankName(cfg.bank_name || '');
        setBankClabe(cfg.bank_clabe || '');
        setBankBeneficiary(cfg.bank_beneficiary || '');
        setRegistryItems(Array.isArray(cfg.registry_items) ? cfg.registry_items : (Array.isArray(cfg.registryItems) ? cfg.registryItems : []));
        setItineraryItems(Array.isArray(rawItinerary) ? rawItinerary.map((item: any, i: number) => ({
            id: item.id || `itin-${i}`,
            time: item.time || '16:00',
            title: item.title || item.event || '',
            description: item.description || item.location || '',
            icon: item.icon || 'heart'
        })) : []);
        setHotelsList(Array.isArray(rawHotels) ? rawHotels : []);
        setGalleryTitle(cfg.gallery_title || cfg.galleryTitle || 'Galería de Fotos');
        setGallerySubtitle(cfg.gallery_subtitle || cfg.gallerySubtitle || 'Momentos inolvidables compartidos con amor.');
        setGalleryImages(Array.isArray(rawGalleryImages) ? rawGalleryImages.map((img: any) => typeof img === 'string' ? img : img?.url || '').filter(Boolean) : []);
        setRsvpDeadline(event.rsvp_deadline ? new Date(event.rsvp_deadline).toISOString().slice(0, 10) : '');
        setRsvpNotes(cfg.rsvp_notes || '');
        setWhatsappNumber(cfg.whatsapp_number || '');
        setBrideFather(cfg.parents?.bride?.father || cfg.parents?.father || '');
        setBrideMother(cfg.parents?.bride?.mother || cfg.parents?.mother || '');
        setGroomFather(cfg.parents?.groom?.father || '');
        setGroomMother(cfg.parents?.groom?.mother || '');
        setChambelanesList(Array.isArray(cfg.chambelanes) ? cfg.chambelanes : []);
        setDamasList(Array.isArray(cfg.damas) ? cfg.damas : []);
    }, [event, sectionId]);

    const handleHeroUpload = async (file: File) => {
        if (!file || !event.id) return;
        setUploadingHero(true);
        try {
            const ext = file.name.split('.').pop() || 'jpg';
            const path = `events/${event.id}/hero-${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from('event-images')
                .upload(path, file, { upsert: true, contentType: file.type });
            if (uploadError) throw uploadError;
            const { data: urlData } = supabase.storage.from('event-images').getPublicUrl(path);
            const publicUrl = urlData.publicUrl + '?t=' + Date.now();
            setHeroImageUrl(publicUrl);
            toast.success('¡Foto de portada subida con éxito!');
        } catch (err: any) {
            console.error('Error uploading hero image:', err);
            toast.error('Error al subir la imagen. Intenta pegando una URL directa.');
        } finally {
            setUploadingHero(false);
        }
    };

    const handleGalleryUpload = async (file: File) => {
        if (!file || !event.id) return;
        setUploadingGallery(true);
        try {
            const ext = file.name.split('.').pop() || 'jpg';
            const path = `events/${event.id}/gallery-${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from('event-images')
                .upload(path, file, { upsert: true, contentType: file.type });
            if (uploadError) throw uploadError;
            const { data: urlData } = supabase.storage.from('event-images').getPublicUrl(path);
            const publicUrl = urlData.publicUrl + '?t=' + Date.now();
            setGalleryImages(prev => [...prev, publicUrl]);
            toast.success('¡Foto agregada a la galería!');
        } catch (err: any) {
            console.error('Error uploading gallery image:', err);
            toast.error('Error al subir la imagen.');
        } finally {
            setUploadingGallery(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (sectionId === 'hero') {
                if (title !== event.title) await onUpdateEventColumn('title', title);
                await onUpdateThemeConfig({
                    subtitle,
                    child_name: childName,
                    childName: childName,
                    age: Number(age) || age,
                    turning_age: Number(age) || age,
                    hero_image_url: heroImageUrl,
                    heroImage: heroImageUrl
                });
            } else if (sectionId === 'guest_welcome') {
                await onUpdateThemeConfig({
                    welcome_title: welcomeTitle,
                    welcomeTitle: welcomeTitle,
                    welcome_quote: welcomeQuote,
                    welcomeQuote: welcomeQuote
                });
            } else if (sectionId === 'message') {
                if (title !== event.title) await onUpdateEventColumn('title', title);
                await onUpdateThemeConfig({ welcome_message: welcomeMessage });
            } else if (sectionId === 'countdown') {
                if (dateTime) await onUpdateEventColumn('date_time', new Date(dateTime).toISOString());
            } else if (sectionId === 'location') {
                const eventUpdates: Record<string, any> = {};
                if (venueName !== event.venue_name) eventUpdates.venue_name = venueName;
                if (venueAddress !== event.venue_address) eventUpdates.venue_address = venueAddress;
                if (mapsLink !== event.maps_link) eventUpdates.maps_link = mapsLink;
                if (Object.keys(eventUpdates).length > 0) {
                    await onUpdateEventColumn(eventUpdates);
                }
                await onUpdateThemeConfig({
                    venue_time: venueTime,
                    misa_name: misaName,
                    misa_time: misaTime,
                    misa_address: misaAddress,
                    misa_maps_link: misaMapsLink
                });
            } else if (sectionId === 'dress_code') {
                if (dressCode !== event.dress_code) await onUpdateEventColumn('dress_code', dressCode);
                await onUpdateThemeConfig({
                    dress_code_notes: dressCodeNotes,
                    dressCodeNotes: dressCodeNotes
                });
            } else if (sectionId === 'gifts') {
                await onUpdateThemeConfig({
                    gift_title: giftTitle,
                    gift_message: giftMessage,
                    cash_gift_title: cashGiftTitle,
                    cash_gift_message: cashGiftMessage,
                    bank_name: bankName,
                    bank_clabe: bankClabe,
                    bank_beneficiary: bankBeneficiary,
                    registry_items: registryItems,
                    registryItems: registryItems
                });
            } else if (sectionId === 'itinerary') {
                await onUpdateThemeConfig({
                    itinerary: itineraryItems,
                    schedule: itineraryItems
                });
            } else if (sectionId === 'hotels') {
                await onUpdateThemeConfig({
                    hotels: hotelsList
                });
            } else if (sectionId === 'gallery') {
                await onUpdateThemeConfig({
                    gallery_title: galleryTitle,
                    gallery_subtitle: gallerySubtitle,
                    gallery_images: galleryImages,
                    galleryImages: galleryImages
                });
            } else if (sectionId === 'rsvp') {
                if (rsvpDeadline !== (event.rsvp_deadline ? new Date(event.rsvp_deadline).toISOString().slice(0, 10) : '')) {
                    await onUpdateEventColumn('rsvp_deadline', rsvpDeadline ? new Date(rsvpDeadline).toISOString() : null);
                }
                await onUpdateThemeConfig({
                    rsvp_notes: rsvpNotes,
                    whatsapp_number: whatsappNumber
                });
            } else if (sectionId === 'chambelanes') {
                const updatedParents = {
                    ...(cfg.parents || {}),
                    father: brideFather,
                    mother: brideMother,
                    bride: { father: brideFather, mother: brideMother },
                    groom: { father: groomFather, mother: groomMother }
                };
                await onUpdateThemeConfig({
                    parents: updatedParents,
                    chambelanes: chambelanesList.filter(s => s.trim().length > 0),
                    damas: damasList.filter(s => s.trim().length > 0)
                });
            }
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    const sectionTitles: Record<string, string> = {
        'hero': 'Portada Principal',
        'guest_welcome': 'Mensaje y Frase de Bienvenida',
        'message': 'Dedicatoria y Mensaje',
        'countdown': 'Cuenta Regresiva y Fecha',
        'location': 'Mapa y Ubicación',
        'dress_code': 'Código de Vestimenta',
        'gallery': 'Galería de Fotos',
        'itinerary': 'Itinerario y Programa',
        'hotels': 'Hoteles y Hospedaje',
        'gifts': 'Mesa de Regalos y Datos Bancarios',
        'chambelanes': 'Corte de Honor y Padres',
        'rsvp': 'Confirmación de Asistencia (RSVP)',
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white shadow-2xl rounded-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-stone-100 bg-white">
                    <div>
                        <h3 className="text-lg font-display font-extrabold text-[#222B38]">Editar Sección</h3>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">
                            {sectionTitles[sectionId as string] || sectionId}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                        <X className="h-5 w-5 text-stone-400" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[70vh] p-6 space-y-6 bg-white">
                {sectionId === 'hero' && (
                    <div className="space-y-5">
                        {/* Hero Photo / Portada */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-stone-500 flex items-center justify-between">
                                <span>Foto de Portada / Imagen Principal</span>
                                {heroImageUrl && (
                                    <button
                                        type="button"
                                        onClick={() => setHeroImageUrl('')}
                                        className="text-[10px] font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 normal-case tracking-normal"
                                    >
                                        <Trash2 className="h-3 w-3" /> Quitar foto
                                    </button>
                                )}
                            </label>

                            <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/70 p-4 transition-all hover:border-stone-300">
                                {heroImageUrl ? (
                                    <div className="space-y-3">
                                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-stone-900 shadow-inner group">
                                            <img 
                                                src={heroImageUrl} 
                                                alt="Portada" 
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => heroFileInputRef.current?.click()}
                                                    disabled={uploadingHero}
                                                    className="px-3 py-1.5 bg-white text-stone-800 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow hover:bg-stone-50 cursor-pointer"
                                                >
                                                    <Upload className="h-3.5 w-3.5" /> Cambiar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setHeroImageUrl('')}
                                                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" /> Quitar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-5 text-center">
                                        <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-2">
                                            <ImageIcon className="h-6 w-6" />
                                        </div>
                                        <p className="text-xs font-bold text-stone-700">Sin foto de portada</p>
                                        <p className="text-[10px] text-stone-400 mt-0.5">Sube una foto desde tu celular/computadora o pega un enlace</p>
                                    </div>
                                )}

                                <div className="mt-3">
                                    <input
                                        type="file"
                                        ref={heroFileInputRef}
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleHeroUpload(file);
                                            e.target.value = '';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => heroFileInputRef.current?.click()}
                                        disabled={uploadingHero}
                                        className="w-full py-2.5 px-4 bg-[#1B2E1D] hover:bg-[#2c492f] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        {uploadingHero ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" /> Subiendo foto...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4" /> Subir Foto desde tu Dispositivo
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="mt-3 pt-3 border-t border-stone-200">
                                    <label className="text-[9px] uppercase font-bold text-stone-400 tracking-wider block mb-1">
                                        O pegar enlace directo de imagen (URL):
                                    </label>
                                    <input 
                                        type="url"
                                        value={heroImageUrl}
                                        onChange={e => setHeroImageUrl(e.target.value)}
                                        placeholder="https://images.unsplash.com/... o enlace web"
                                        className="w-full bg-white px-3 py-2 rounded-xl text-xs font-mono border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1B2E1D]/20 text-stone-800"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Title & Subtitle */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">
                                {event.event_type === 'wedding' 
                                    ? 'Nombres de la Pareja / Título' 
                                    : event.event_type === 'xv' 
                                    ? 'Nombre de la Quinceañera / Título' 
                                    : 'Título Principal'}
                            </label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={e => setTitle(e.target.value)}
                                placeholder={event.event_type === 'wedding' ? "Ej. Sofía & Alejandro" : "Ej. Cumpleaños de Zair"}
                                className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800 font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Subtítulo / Frase</label>
                            <input 
                                type="text" 
                                value={subtitle} 
                                onChange={e => setSubtitle(e.target.value)}
                                placeholder="Ej. ¡Nos casamos! / ¡Festejando mis 5 años!"
                                className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                            />
                        </div>

                        {/* Child/Birthday fields (shown if kids/birthday event or if already has child name/age) */}
                        <div className="p-3.5 bg-stone-50/80 rounded-xl border border-stone-100 space-y-3">
                            <p className="text-[10px] uppercase font-black tracking-wider text-stone-400">Datos Infantiles / Cumpleaños (Opcional)</p>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Nombre del Festejado(a)</label>
                                <input 
                                    type="text" 
                                    value={childName} 
                                    onChange={e => setChildName(e.target.value)}
                                    placeholder="Ej. ZAIR, Lucas, Mateo, Sofía..."
                                    className="w-full bg-white px-3 py-2 rounded-lg text-xs font-bold border border-stone-200 text-stone-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Edad que cumple (Años)</label>
                                <input 
                                    type="number" 
                                    value={age} 
                                    onChange={e => setAge(e.target.value)}
                                    placeholder="Ej. 5, 1, 7..."
                                    className="w-full bg-white px-3 py-2 rounded-lg text-xs border border-stone-200 text-stone-800"
                                />
                            </div>
                        </div>
                    </div>
                )}
                    {/* ── GUEST WELCOME (Bienvenida & Cita) ── */}
                    {sectionId === 'guest_welcome' && (
                        <div className="space-y-6">
                            <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100 flex items-start gap-3">
                                <span className="text-xl">💌</span>
                                <p className="text-xs text-stone-600 leading-relaxed">
                                    Esta sección saluda a cada invitado con su nombre personalizado (si accede con su enlace personal) o mostrará tu saludo general.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Título / Saludo Predeterminado</label>
                                <input 
                                    type="text" 
                                    value={welcomeTitle} 
                                    onChange={e => setWelcomeTitle(e.target.value)}
                                    placeholder="Ej. ¡Bienvenidos!, ¡Nuestra Boda!..."
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 text-stone-800 font-bold"
                                />
                                <p className="text-[10px] text-stone-400">Si el invitado tiene enlace personalizado, verá "¡Hola, [Nombre]!".</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Frase o Cita Emotiva</label>
                                <textarea 
                                    rows={4}
                                    value={welcomeQuote} 
                                    onChange={e => setWelcomeQuote(e.target.value)}
                                    placeholder='Ej. "El amor no consiste en mirarse el uno al otro, sino en mirar juntos en la misma dirección"'
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 resize-none text-stone-800 italic"
                                />
                                <p className="text-[10px] text-stone-400">Aparece en cursiva elegante debajo del saludo.</p>
                            </div>
                        </div>
                    )}

                    {/* ── MESSAGE ── */}
                    {sectionId === 'message' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Título Principal</label>
                                <input 
                                    type="text" 
                                    value={title} 
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 text-stone-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Mensaje de los Anfitriones</label>
                                <textarea 
                                    rows={5}
                                    value={welcomeMessage} 
                                    onChange={e => setWelcomeMessage(e.target.value)}
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 resize-none text-stone-800"
                                />
                            </div>
                        </>
                    )}

                    {/* ── COUNTDOWN ── */}
                    {sectionId === 'countdown' && (
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Fecha y Hora del Evento</label>
                            <input 
                                type="datetime-local" 
                                value={dateTime} 
                                onChange={e => setDateTime(e.target.value)}
                                className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 text-stone-800"
                            />
                        </div>
                    )}

                    {/* ── LOCATION ── */}
                    {sectionId === 'location' && (
                        <div className="space-y-8">
                            {/* Ceremonia */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-display font-extrabold text-[#222B38] border-b border-stone-100 pb-2">Datos de la Ceremonia (Misa / Civil)</h4>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Nombre del Lugar</label>
                                    <input 
                                        type="text" 
                                        value={misaName} 
                                        onChange={e => setMisaName(e.target.value)}
                                        placeholder="Ej. Parroquia San Miguel Arcángel"
                                        className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 text-stone-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Hora</label>
                                    <input 
                                        type="time" 
                                        value={misaTime} 
                                        onChange={e => setMisaTime(e.target.value)}
                                        className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 text-stone-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Dirección</label>
                                    <textarea 
                                        rows={2}
                                        value={misaAddress} 
                                        onChange={e => setMisaAddress(e.target.value)}
                                        placeholder="Calle, número, colonia, ciudad..."
                                        className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 resize-none text-stone-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Link de Google Maps</label>
                                    <input 
                                        type="url" 
                                        value={misaMapsLink} 
                                        onChange={e => setMisaMapsLink(e.target.value)}
                                        placeholder="https://maps.app.goo.gl/..."
                                        className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 text-stone-800 font-mono text-xs"
                                    />
                                </div>
                            </div>

                            {/* Recepción */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-display font-extrabold text-[#222B38] border-b border-stone-100 pb-2">Datos de la Recepción (Fiesta)</h4>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Nombre del Lugar / Salón</label>
                                    <input 
                                        type="text" 
                                        value={venueName} 
                                        onChange={e => setVenueName(e.target.value)}
                                        placeholder="Ej. Hacienda Las Flores"
                                        className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 text-stone-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Hora</label>
                                    <input 
                                        type="time" 
                                        value={venueTime} 
                                        onChange={e => setVenueTime(e.target.value)}
                                        className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 text-stone-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Dirección</label>
                                    <textarea 
                                        rows={2}
                                        value={venueAddress} 
                                        onChange={e => setVenueAddress(e.target.value)}
                                        placeholder="Calle, número, colonia, ciudad..."
                                        className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 resize-none text-stone-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Link de Google Maps</label>
                                    <input 
                                        type="url" 
                                        value={mapsLink} 
                                        onChange={e => setMapsLink(e.target.value)}
                                        placeholder="https://maps.app.goo.gl/..."
                                        className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 text-stone-800 font-mono text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── DRESS CODE ── */}
                    {sectionId === 'dress_code' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Código de Vestimenta</label>
                                <select
                                    value={dressCode}
                                    onChange={e => setDressCode(e.target.value)}
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-xs font-bold text-[#1B2E1D] border border-stone-200 outline-none cursor-pointer focus:ring-2 focus:ring-[#DF3B94]/20"
                                >
                                    <option value="">-- Selecciona de la Lista --</option>
                                    {dressCode && !['Formal', 'Semi-Formal', 'Etiqueta Rigurosa', 'Guayabera', 'Casual Elegante', 'Riguroso Negro (Black Tie)', 'Blanco y Tonos Pastel', 'Libre'].includes(dressCode) && (
                                        <option value={dressCode}>{dressCode}</option>
                                    )}
                                    <option value="Formal">👔 Formal / Traje Oscuro & Vestido Largo</option>
                                    <option value="Semi-Formal">🍸 Semi-Formal / Cóctel</option>
                                    <option value="Etiqueta Rigurosa">🎩 Etiqueta Rigurosa / Esmoquin & Vestido de Gala</option>
                                    <option value="Guayabera">🏝️ Guayabera / Playa / Clima Cálido</option>
                                    <option value="Casual Elegante">👔 Casual Elegante</option>
                                    <option value="Riguroso Negro (Black Tie)">💃 Riguroso Negro (Black Tie)</option>
                                    <option value="Blanco y Tonos Pastel">🌸 Blanco & Tonos Pastel</option>
                                    <option value="Libre">🎨 Libre / Según la Ocasión</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Notas o Instrucciones Adicionales (Opcional)</label>
                                <textarea 
                                    rows={3}
                                    value={dressCodeNotes} 
                                    onChange={e => setDressCodeNotes(e.target.value)}
                                    placeholder="Ej. Mujeres: Vestido largo (reservarse el color blanco). Hombres: Traje formal."
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 resize-none text-stone-800"
                                />
                            </div>
                        </div>
                    )}

                    {/* ── GIFTS / MESA DE REGALOS ── */}
                    {sectionId === 'gifts' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Título de la Sección</label>
                                <input 
                                    type="text" 
                                    value={giftTitle} 
                                    onChange={e => setGiftTitle(e.target.value)}
                                    placeholder="Mesa de Regalos"
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 text-stone-800 font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Mensaje de Agradecimiento</label>
                                <textarea 
                                    rows={2}
                                    value={giftMessage} 
                                    onChange={e => setGiftMessage(e.target.value)}
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-xs border-none focus:ring-2 focus:ring-[#DF3B94]/20 resize-none text-stone-700"
                                />
                            </div>

                            {/* Tiendas / Mesas de Regalos */}
                            <div className="space-y-3 pt-2 border-t border-stone-100">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Tiendas o Mesas de Regalo</label>
                                    <button
                                        type="button"
                                        onClick={() => setRegistryItems([...registryItems, { store: '', link: '', description: '' }])}
                                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#DF3B94] hover:underline"
                                    >
                                        <Plus className="h-3 w-3" /> Agregar Tienda
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {registryItems.map((item, idx) => (
                                        <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-2 relative">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="text" 
                                                    value={item.store} 
                                                    onChange={e => {
                                                        const updated = [...registryItems];
                                                        updated[idx].store = e.target.value;
                                                        setRegistryItems(updated);
                                                    }}
                                                    placeholder="Nombre: Liverpool, Amazon..."
                                                    className="flex-1 bg-white px-3 py-2 rounded-lg text-xs font-bold border border-stone-200 text-stone-800"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setRegistryItems(registryItems.filter((_, i) => i !== idx))}
                                                    className="p-2 text-stone-400 hover:text-rose-500"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <input 
                                                type="url" 
                                                value={item.link} 
                                                onChange={e => {
                                                    const updated = [...registryItems];
                                                    updated[idx].link = e.target.value;
                                                    setRegistryItems(updated);
                                                }}
                                                placeholder="Enlace o número de evento: https://..."
                                                className="w-full bg-white px-3 py-2 rounded-lg text-xs border border-stone-200 text-stone-600 font-mono"
                                            />
                                            <input 
                                                type="text" 
                                                value={item.description || ''} 
                                                onChange={e => {
                                                    const updated = [...registryItems];
                                                    updated[idx].description = e.target.value;
                                                    setRegistryItems(updated);
                                                }}
                                                placeholder="Nota opcional (ej. Evento #50291)"
                                                className="w-full bg-white px-3 py-1.5 rounded-lg text-[11px] border border-stone-200 text-stone-500 italic"
                                            />
                                        </div>
                                    ))}
                                    {registryItems.length === 0 && (
                                        <p className="text-xs text-stone-400 italic text-center py-2">No hay tiendas añadidas.</p>
                                    )}
                                </div>
                            </div>

                            {/* Lluvia de sobres y Datos Bancarios */}
                            <div className="space-y-4 pt-3 border-t border-stone-100">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">Lluvia de Sobres / Transferencia</h4>
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-stone-400">Título</label>
                                    <input 
                                        type="text" 
                                        value={cashGiftTitle} 
                                        onChange={e => setCashGiftTitle(e.target.value)}
                                        placeholder="Lluvia de Sobres"
                                        className="w-full bg-stone-50 px-3 py-2 rounded-lg text-xs border border-stone-200 text-stone-800"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-stone-400">Mensaje</label>
                                    <textarea 
                                        rows={2}
                                        value={cashGiftMessage} 
                                        onChange={e => setCashGiftMessage(e.target.value)}
                                        className="w-full bg-stone-50 px-3 py-2 rounded-lg text-xs border border-stone-200 text-stone-700 resize-none"
                                    />
                                </div>

                                <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 space-y-3">
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Datos para Transferencia (Opcional)</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[9px] uppercase font-bold text-stone-400">Banco</label>
                                            <input 
                                                type="text" 
                                                value={bankName} 
                                                onChange={e => setBankName(e.target.value)}
                                                placeholder="Ej. BBVA, Santander..."
                                                className="w-full bg-white px-3 py-2 rounded-lg text-xs border border-stone-200 text-stone-800 font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] uppercase font-bold text-stone-400">CLABE Interbancaria</label>
                                            <input 
                                                type="text" 
                                                value={bankClabe} 
                                                onChange={e => setBankClabe(e.target.value)}
                                                placeholder="18 dígitos"
                                                className="w-full bg-white px-3 py-2 rounded-lg text-xs border border-stone-200 text-stone-800 font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] uppercase font-bold text-stone-400">Beneficiario / Titular</label>
                                        <input 
                                            type="text" 
                                            value={bankBeneficiary} 
                                            onChange={e => setBankBeneficiary(e.target.value)}
                                            placeholder="Nombre del titular de la cuenta"
                                            className="w-full bg-white px-3 py-2 rounded-lg text-xs border border-stone-200 text-stone-800 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── ITINERARY ── */}
                    {sectionId === 'itinerary' && (
                        <div className="space-y-6">
                            {/* Preset Selector */}
                            <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Agregar Evento Predefinido</label>
                                <select
                                    defaultValue=""
                                    onChange={e => {
                                        if (!e.target.value) return;
                                        const presets: Record<string, { title: string; time: string; icon: string }> = {
                                            ceremonia: { title: 'Ceremonia Religiosa / Civil', time: '16:00', icon: 'heart' },
                                            recepcion: { title: 'Recepción & Cóctel de Bienvenida', time: '17:30', icon: 'wine' },
                                            banquete:  { title: 'Cena / Banquete Principal', time: '19:00', icon: 'utensils' },
                                            baile:     { title: 'Vals / Baile Inaugural', time: '20:30', icon: 'music' },
                                            pastel:    { title: 'Corte de Pastel & Brindis', time: '21:30', icon: 'party' },
                                            mariachi:  { title: 'Mariachi / Grupo Musical', time: '22:30', icon: 'party' },
                                            trasnocho: { title: 'Trasnocho / Torneado', time: '23:30', icon: 'utensils' },
                                            fin:       { title: 'Fin del Evento', time: '02:00', icon: 'moon' }
                                        };
                                        const found = presets[e.target.value];
                                        if (found) {
                                            setItineraryItems([...itineraryItems, { id: Date.now().toString(), ...found }]);
                                        }
                                        e.target.value = '';
                                    }}
                                    className="w-full bg-white px-3 py-2 rounded-lg text-xs font-bold border border-stone-200 text-stone-800 outline-none"
                                >
                                    <option value="" disabled>-- Selecciona de la lista para agregar rápido --</option>
                                    <option value="ceremonia">💍 Ceremonia (16:00)</option>
                                    <option value="recepcion">🍸 Recepción & Cóctel (17:30)</option>
                                    <option value="banquete">🍽️ Cena / Banquete (19:00)</option>
                                    <option value="baile">💃 Vals / Baile (20:30)</option>
                                    <option value="pastel">🎂 Corte de Pastel & Brindis (21:30)</option>
                                    <option value="mariachi">🎺 Mariachi / Show (22:30)</option>
                                    <option value="trasnocho">🌮 Trasnocho (23:30)</option>
                                    <option value="fin">🎆 Fin de Fiesta (02:00)</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Momentos del Día ({itineraryItems.length})</label>
                                <button
                                    type="button"
                                    onClick={() => setItineraryItems([...itineraryItems, { id: Date.now().toString(), time: '18:00', title: 'Nuevo Momento', icon: 'heart' }])}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#DF3B94] hover:underline"
                                >
                                    <Plus className="h-3 w-3" /> Agregar Momento
                                </button>
                            </div>

                            <div className="space-y-3">
                                {itineraryItems.map((item, idx) => (
                                    <div key={item.id || idx} className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <input 
                                                type="time" 
                                                value={item.time} 
                                                onChange={e => {
                                                    const updated = [...itineraryItems];
                                                    updated[idx].time = e.target.value;
                                                    setItineraryItems(updated);
                                                }}
                                                className="bg-white px-2 py-2 rounded-lg text-xs font-mono font-bold border border-stone-200 text-stone-800 w-24"
                                            />
                                            <select
                                                value={item.icon || 'heart'}
                                                onChange={e => {
                                                    const updated = [...itineraryItems];
                                                    updated[idx].icon = e.target.value;
                                                    setItineraryItems(updated);
                                                }}
                                                className="bg-white px-2 py-2 rounded-lg text-xs border border-stone-200 text-stone-700"
                                            >
                                                <option value="heart">💍 Ceremonia</option>
                                                <option value="wine">🍸 Brindis</option>
                                                <option value="utensils">🍽️ Cena</option>
                                                <option value="music">💃 Baile</option>
                                                <option value="party">🎉 Fiesta</option>
                                                <option value="moon">🌙 Cierre</option>
                                                <option value="clock">⏰ Hora</option>
                                            </select>
                                        </div>

                                        <div className="flex-1 space-y-1.5 w-full">
                                            <input 
                                                type="text" 
                                                value={item.title} 
                                                onChange={e => {
                                                    const updated = [...itineraryItems];
                                                    updated[idx].title = e.target.value;
                                                    setItineraryItems(updated);
                                                }}
                                                placeholder="Título del evento"
                                                className="w-full bg-white px-3 py-1.5 rounded-lg text-xs font-bold border border-stone-200 text-stone-800"
                                            />
                                            <input 
                                                type="text" 
                                                value={item.description || ''} 
                                                onChange={e => {
                                                    const updated = [...itineraryItems];
                                                    updated[idx].description = e.target.value;
                                                    setItineraryItems(updated);
                                                }}
                                                placeholder="Lugar o descripción breve (opcional)"
                                                className="w-full bg-white px-3 py-1 rounded-lg text-[11px] border border-stone-200 text-stone-600"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setItineraryItems(itineraryItems.filter((_, i) => i !== idx))}
                                            className="self-end sm:self-center p-2 text-stone-400 hover:text-rose-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                {itineraryItems.length === 0 && (
                                    <p className="text-xs text-stone-400 italic text-center py-4">No hay eventos en el itinerario aún.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── HOTELS / HOSPEDAJE ── */}
                    {sectionId === 'hotels' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Hoteles Recomendados ({hotelsList.length})</label>
                                <button
                                    type="button"
                                    onClick={() => setHotelsList([...hotelsList, { name: '', distance: '', description: '', price: '', link: '', isRecommended: false }])}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#DF3B94] hover:underline"
                                >
                                    <Plus className="h-3 w-3" /> Agregar Hotel
                                </button>
                            </div>

                            <div className="space-y-4">
                                {hotelsList.map((hotel, idx) => (
                                    <div key={idx} className="p-4 bg-stone-50 rounded-xl border border-stone-100 space-y-3 relative">
                                        <div className="flex items-center justify-between">
                                            <input 
                                                type="text" 
                                                value={hotel.name} 
                                                onChange={e => {
                                                    const updated = [...hotelsList];
                                                    updated[idx].name = e.target.value;
                                                    setHotelsList(updated);
                                                }}
                                                placeholder="Nombre del Hotel (ej. Hyatt Regency)"
                                                className="flex-1 bg-white px-3 py-2 rounded-lg text-xs font-bold border border-stone-200 text-stone-800 mr-2"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setHotelsList(hotelsList.filter((_, i) => i !== idx))}
                                                className="p-1.5 text-stone-400 hover:text-rose-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <input 
                                                type="text" 
                                                value={hotel.distance || ''} 
                                                onChange={e => {
                                                    const updated = [...hotelsList];
                                                    updated[idx].distance = e.target.value;
                                                    setHotelsList(updated);
                                                }}
                                                placeholder="Cercanía (ej. A 5 mins)"
                                                className="bg-white px-3 py-1.5 rounded-lg text-xs border border-stone-200 text-stone-700"
                                            />
                                            <input 
                                                type="text" 
                                                value={hotel.price || ''} 
                                                onChange={e => {
                                                    const updated = [...hotelsList];
                                                    updated[idx].price = e.target.value;
                                                    setHotelsList(updated);
                                                }}
                                                placeholder="Tarifa (ej. $1,800 MXN)"
                                                className="bg-white px-3 py-1.5 rounded-lg text-xs border border-stone-200 text-stone-700"
                                            />
                                        </div>

                                        <textarea 
                                            rows={2}
                                            value={hotel.description || ''} 
                                            onChange={e => {
                                                const updated = [...hotelsList];
                                                updated[idx].description = e.target.value;
                                                setHotelsList(updated);
                                            }}
                                            placeholder="Detalles, teléfono o código de descuento para invitados..."
                                            className="w-full bg-white px-3 py-1.5 rounded-lg text-xs border border-stone-200 text-stone-700 resize-none"
                                        />

                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="url" 
                                                value={hotel.link || ''} 
                                                onChange={e => {
                                                    const updated = [...hotelsList];
                                                    updated[idx].link = e.target.value;
                                                    setHotelsList(updated);
                                                }}
                                                placeholder="Enlace web del hotel: https://..."
                                                className="flex-1 bg-white px-3 py-1.5 rounded-lg text-[11px] font-mono border border-stone-200 text-stone-600"
                                            />
                                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600 cursor-pointer flex-shrink-0">
                                                <input 
                                                    type="checkbox"
                                                    checked={!!hotel.isRecommended}
                                                    onChange={e => {
                                                        const updated = [...hotelsList];
                                                        updated[idx].isRecommended = e.target.checked;
                                                        setHotelsList(updated);
                                                    }}
                                                    className="rounded text-[#DF3B94]"
                                                />
                                                <span>Recomendado</span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                                {hotelsList.length === 0 && (
                                    <p className="text-xs text-stone-400 italic text-center py-4">No hay hoteles agregados aún.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── GALLERY ── */}
                    {sectionId === 'gallery' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Título de la Galería</label>
                                <input 
                                    type="text" 
                                    value={galleryTitle} 
                                    onChange={e => setGalleryTitle(e.target.value)}
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 text-stone-800 font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Subtítulo</label>
                                <input 
                                    type="text" 
                                    value={gallerySubtitle} 
                                    onChange={e => setGallerySubtitle(e.target.value)}
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-xs border-none focus:ring-2 focus:ring-[#DF3B94]/20 text-stone-700"
                                />
                            </div>

                            <div className="space-y-3 pt-2 border-t border-stone-100">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Agregar Imagen a la Galería</label>
                                
                                <div className="space-y-2">
                                    <input
                                        type="file"
                                        ref={galleryFileInputRef}
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleGalleryUpload(file);
                                            e.target.value = '';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => galleryFileInputRef.current?.click()}
                                        disabled={uploadingGallery}
                                        className="w-full py-2.5 px-4 bg-[#DF3B94] hover:bg-[#c22e7d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        {uploadingGallery ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" /> Subiendo foto a la galería...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4" /> Subir Foto desde tu Dispositivo
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="pt-2">
                                    <label className="text-[9px] uppercase font-bold text-stone-400 tracking-wider block mb-1">
                                        O agregar mediante enlace directo (URL):
                                    </label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="url" 
                                            value={newImageUrl} 
                                            onChange={e => setNewImageUrl(e.target.value)}
                                            placeholder="https://images.unsplash.com/..."
                                            className="flex-1 bg-stone-50 px-3 py-2 rounded-xl text-xs font-mono border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#DF3B94]/20 text-stone-800"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (newImageUrl.trim()) {
                                                    setGalleryImages([...galleryImages, newImageUrl.trim()]);
                                                    setNewImageUrl('');
                                                }
                                            }}
                                            className="px-4 py-2 bg-stone-800 text-white text-xs font-bold rounded-xl shadow hover:bg-stone-900 transition-all cursor-pointer"
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Fotos Actuales ({galleryImages.length})</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {galleryImages.map((url, idx) => (
                                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                                            <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                                                className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                            >
                                                <Trash2 className="h-5 w-5 text-red-400" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {galleryImages.length === 0 && (
                                    <p className="text-xs text-stone-400 italic text-center py-4">No hay fotos en la galería.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── RSVP ── */}
                    {sectionId === 'rsvp' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Fecha Límite de Confirmación</label>
                                <input 
                                    type="date" 
                                    value={rsvpDeadline} 
                                    onChange={e => setRsvpDeadline(e.target.value)}
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 text-stone-800"
                                />
                                <p className="text-[10px] text-stone-400">Tus invitados verán la fecha límite recomendada para responder.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Teléfono WhatsApp de Contacto</label>
                                <input 
                                    type="tel" 
                                    value={whatsappNumber} 
                                    onChange={e => setWhatsappNumber(e.target.value)}
                                    placeholder="Ej. +52 55 1234 5678"
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 text-stone-800 font-mono"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Notas o Reglas de Confirmación (Opcional)</label>
                                <textarea 
                                    rows={3}
                                    value={rsvpNotes} 
                                    onChange={e => setRsvpNotes(e.target.value)}
                                    placeholder="Ej. Evento exclusivo para adultos. Agradecemos confirmar con anticipación para asegurar tu lugar."
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#DF3B94]/20 resize-none text-stone-800"
                                />
                            </div>
                        </div>
                    )}

                    {/* ── CORTE DE HONOR / PADRES ── */}
                    {sectionId === 'chambelanes' && (
                        <div className="space-y-6">
                            {/* Padres */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">Padres</h4>
                                <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 space-y-3">
                                    <p className="text-[10px] uppercase font-bold text-stone-400">Padres de la Festejada / Novia</p>
                                    <input 
                                        type="text" 
                                        value={brideFather} 
                                        onChange={e => setBrideFather(e.target.value)}
                                        placeholder="Nombre del Padre"
                                        className="w-full bg-white px-3 py-2 rounded-lg text-xs border border-stone-200 text-stone-800"
                                    />
                                    <input 
                                        type="text" 
                                        value={brideMother} 
                                        onChange={e => setBrideMother(e.target.value)}
                                        placeholder="Nombre de la Madre"
                                        className="w-full bg-white px-3 py-2 rounded-lg text-xs border border-stone-200 text-stone-800"
                                    />
                                </div>

                                <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 space-y-3">
                                    <p className="text-[10px] uppercase font-bold text-stone-400">Padres del Novio (si aplica)</p>
                                    <input 
                                        type="text" 
                                        value={groomFather} 
                                        onChange={e => setGroomFather(e.target.value)}
                                        placeholder="Nombre del Padre del Novio"
                                        className="w-full bg-white px-3 py-2 rounded-lg text-xs border border-stone-200 text-stone-800"
                                    />
                                    <input 
                                        type="text" 
                                        value={groomMother} 
                                        onChange={e => setGroomMother(e.target.value)}
                                        placeholder="Nombre de la Madre del Novio"
                                        className="w-full bg-white px-3 py-2 rounded-lg text-xs border border-stone-200 text-stone-800"
                                    />
                                </div>
                            </div>

                            {/* Chambelanes */}
                            <div className="space-y-3 pt-2 border-t border-stone-100">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Chambelanes / Pajes ({chambelanesList.length})</label>
                                    <button
                                        type="button"
                                        onClick={() => setChambelanesList([...chambelanesList, ''])}
                                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#DF3B94] hover:underline"
                                    >
                                        <Plus className="h-3 w-3" /> Agregar
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {chambelanesList.map((chambelan, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={chambelan} 
                                                onChange={e => {
                                                    const updated = [...chambelanesList];
                                                    updated[idx] = e.target.value;
                                                    setChambelanesList(updated);
                                                }}
                                                placeholder="Nombre del Chambelán / Paje"
                                                className="flex-1 bg-stone-50 px-3 py-2 rounded-xl text-xs border-none focus:ring-2 focus:ring-[#DF3B94]/20 text-stone-800"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setChambelanesList(chambelanesList.filter((_, i) => i !== idx))}
                                                className="p-2 text-stone-400 hover:text-rose-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Damas */}
                            <div className="space-y-3 pt-2 border-t border-stone-100">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Damas de Honor ({damasList.length})</label>
                                    <button
                                        type="button"
                                        onClick={() => setDamasList([...damasList, ''])}
                                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#DF3B94] hover:underline"
                                    >
                                        <Plus className="h-3 w-3" /> Agregar
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {damasList.map((dama, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={dama} 
                                                onChange={e => {
                                                    const updated = [...damasList];
                                                    updated[idx] = e.target.value;
                                                    setDamasList(updated);
                                                }}
                                                placeholder="Nombre de la Dama de Honor"
                                                className="flex-1 bg-stone-50 px-3 py-2 rounded-xl text-xs border-none focus:ring-2 focus:ring-[#DF3B94]/20 text-stone-800"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setDamasList(damasList.filter((_, i) => i !== idx))}
                                                className="p-2 text-stone-400 hover:text-rose-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
            </div>

            <div className="p-6 border-t border-stone-100 bg-stone-50/50">
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-4 bg-[#DF3B94] text-white rounded-xl text-[10px] uppercase font-bold tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                    {isSaving ? (
                        'Guardando...'
                    ) : (
                        <>
                            <Save className="h-4 w-4" /> Guardar Cambios
                        </>
                    )}
                </button>
            </div>
        </div>
    </div>
    );
}
