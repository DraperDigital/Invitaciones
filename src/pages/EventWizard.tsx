import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import { Loader2, ArrowLeft, ArrowRight, Save, Sparkles, PartyPopper } from 'lucide-react';
import { getLayoutForEventType } from '../lib/sectionRegistry';

type WizardData = {
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

// ── Presets por tipo de evento ────────────────────────────────────────────
// Solo se aplican al CREAR (no al editar). Definen qué módulos van activos
// por defecto según el tipo de evento seleccionado.
const EVENT_TYPE_PRESETS: Record<string, Record<string, boolean>> = {
    xv: {
        showDetails:      true,   // Dress Code
        showItinerary:    true,   // Itinerario
        showGallery:      true,   // Galería
        showMap:          true,   // Mapa
        showWhatsAppRSVP: true,   // RSVP
        showCountdown:    true,   // Cuenta regresiva
        showGifts:        false,  // Mesa de regalos (opcional)
    },
    wedding: {
        showDetails:      true,   // Dress Code
        showItinerary:    true,   // Itinerario
        showMap:          true,   // Mapa
        showWhatsAppRSVP: true,   // RSVP
        showCountdown:    true,   // Cuenta regresiva
        showGifts:        true,   // Mesa de regalos
        showGallery:      false,  // Galería (opcional por plan)
    },
    birthday: {
        showMap:          true,   // Mapa
        showWhatsAppRSVP: true,   // RSVP
        showCountdown:    true,   // Cuenta regresiva
        showDetails:      false,  // Sin dress code por defecto
        showItinerary:    false,  // Sin itinerario
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
    const [searchParams] = useSearchParams();
    const isWelcome = searchParams.get('welcome') === 'true';
    const preselectedPlan = searchParams.get('plan');

    const isEditing = !!id;

    useEffect(() => {
        if (!user || dataLoaded) return;

        if (!id) {
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

    const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            // Validar fechas de forma segura
            let dateTimeStr = '';
            try {
                dateTimeStr = new Date(data.date_time).toISOString();
            } catch (e) {
                dateTimeStr = new Date().toISOString();
            }

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
                const insertPayload = {
                    id: crypto.randomUUID(),
                    ...payload,
                    user_id: user.id,
                    // Draft until payment confirmed. Stripe webhook flips this to true on successful checkout.
                    is_published: false,
                    theme_config: {
                        theme: data.theme,
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
                    slug: `${data.title.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`,
                };
                const { error } = await supabase.from('events').insert(insertPayload);
                if (error) throw error;
                toast.success('¡Evento creado! Último paso: elige tu plan para publicarlo.');
                // If user preselected a plan from the landing, skip /planes and go straight to checkout
                if (preselectedPlan) {
                    navigate(`/checkout?plan=${preselectedPlan}&id=${insertPayload.id}`);
                } else {
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
                <div className="mb-8 p-6 bg-gradient-to-r from-[#1B2E1D] to-[#2D4A30] rounded-2xl text-white flex items-center gap-5 shadow-xl">
                    <div className="p-3 bg-white/10 rounded-xl flex-shrink-0">
                        <PartyPopper className="h-8 w-8 text-[#BD7474]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="h-3 w-3 text-[#BD7474]" />
                            <span className="text-[9px] uppercase font-bold tracking-widest text-[#BD7474]">Bienvenido a Invitto</span>
                        </div>
                        <p className="font-serif text-xl leading-tight">¡Tu cuenta está lista! Crea tu primera invitación ahora.</p>
                        <p className="text-stone-400 text-xs mt-1 font-light">Solo 3 pasos y tu evento estará listo para compartir.</p>
                    </div>
                </div>
            )}

            <div className="mb-8 md:mb-12">
                <h1 className="text-2xl md:text-4xl font-serif text-[#1B2E1D] tracking-tight mb-2">{isEditing ? 'Editar Invitación' : 'Crear Nueva Invitación'}</h1>
                <div className="flex items-center justify-between mb-4">
                    <p className="text-stone-400 text-[10px] md:text-xs uppercase font-black tracking-widest">Progreso del Asistente</p>
                    <p className="text-[#BD7474] font-serif italic text-sm">Paso {step} de 3</p>
                </div>
                <div className="h-1.5 md:h-2 w-full rounded-full bg-stone-100 p-0.5 md:p-1 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-[#1B2E1D] transition-all duration-700 ease-out shadow-[0_0_10px_rgba(27,46,29,0.3)]"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </div>

            <div className="rounded-[2rem] md:rounded-[3rem] border border-stone-100 bg-white p-6 md:p-12 shadow-sm">
                {step === 1 && (
                    <div className="space-y-6 md:space-y-8">
                        <div className="space-y-1">
                            <h2 className="text-xl md:text-2xl font-serif text-[#1B2E1D]">Información Básica</h2>
                            <p className="text-xs md:text-sm text-stone-400 font-light">Comencemos con los detalles generales de tu evento.</p>
                        </div>
                        
                        <div className="space-y-4 md:space-y-6">
                            <div>
                                <label className="block text-[10px] md:text-xs uppercase font-bold text-stone-400 mb-2 tracking-widest ml-1">Título del Evento</label>
                                <input
                                    type="text"
                                    required
                                    value={data.title}
                                    onChange={(e) => updateData({ title: e.target.value })}
                                    className="block w-full rounded-xl md:rounded-2xl border border-stone-100 bg-stone-50/50 px-4 py-3 md:py-4 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 focus:bg-white transition-all"
                                    placeholder="Ej. Boda de Ana y Carlos"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] md:text-xs uppercase font-bold text-stone-400 mb-2 tracking-widest ml-1">Tipo de Evento</label>
                                <select
                                    value={data.event_type}
                                    onChange={(e) => updateData({ event_type: e.target.value })}
                                    className="block w-full rounded-xl md:rounded-2xl border border-stone-100 bg-stone-50/50 px-4 py-3 md:py-4 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 focus:bg-white transition-all appearance-none"
                                >
                                    <option value="wedding">Boda</option>
                                    <option value="xv">XV Años</option>
                                    <option value="birthday">Cumpleaños</option>
                                    <option value="bautizo">Bautizo</option>
                                    <option value="graduacion">Graduación</option>
                                    <option value="corporate">Corporativo</option>
                                    <option value="other">Otro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] md:text-xs uppercase font-bold text-stone-400 mb-2 tracking-widest ml-1">Fecha y Hora</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={data.date_time}
                                    onChange={(e) => updateData({ date_time: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 md:space-y-10">
                        <div className="space-y-1">
                            <h2 className="text-xl md:text-2xl font-serif text-[#1B2E1D]">Ubicación del Evento</h2>
                            <p className="text-xs md:text-sm text-stone-400 font-light">Define dónde ocurrirá la magia.</p>
                        </div>
                        
                        {/* Sección Misa / Ceremonia */}
                        <div className="p-5 md:p-8 border border-stone-100 bg-stone-50/30 rounded-[1.5rem] md:rounded-[2rem] space-y-6">
                            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[#BD7474]">Misa / Ceremonia</h3>
                            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-300 mb-2 tracking-widest ml-1">Lugar</label>
                                    <input
                                        type="text"
                                        value={data.misa_name}
                                        onChange={(e) => updateData({ misa_name: e.target.value })}
                                        className="block w-full rounded-xl md:rounded-2xl border border-stone-100 bg-white px-4 py-3 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#BD7474]/5 transition-all"
                                        placeholder="Ej. Parroquia de San Juan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-300 mb-2 tracking-widest ml-1">Hora</label>
                                    <input
                                        type="time"
                                        value={data.misa_time}
                                        onChange={(e) => updateData({ misa_time: e.target.value })}
                                        className="block w-full rounded-xl md:rounded-2xl border border-stone-100 bg-white px-4 py-3 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#BD7474]/5 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-stone-300 mb-2 tracking-widest ml-1">Dirección</label>
                                <input
                                    type="text"
                                    value={data.misa_address}
                                    onChange={(e) => updateData({ misa_address: e.target.value })}
                                    className="block w-full rounded-xl md:rounded-2xl border border-stone-100 bg-white px-4 py-3 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#BD7474]/5 transition-all"
                                    placeholder="Calle, Número, Colonia..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-stone-300 mb-2 tracking-widest ml-1">Link de Google Maps</label>
                                <input
                                    type="url"
                                    value={data.misa_maps_link}
                                    onChange={(e) => updateData({ misa_maps_link: e.target.value })}
                                    className="block w-full rounded-xl md:rounded-2xl border border-stone-100 bg-white px-4 py-3 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#BD7474]/5 transition-all"
                                    placeholder="https://goo.gl/maps/..."
                                />
                            </div>
                        </div>

                        {/* Sección Celebración */}
                        <div className="p-5 md:p-8 border border-stone-100 bg-stone-50/30 rounded-[1.5rem] md:rounded-[2rem] space-y-6">
                            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[#1B2E1D]">Celebración / Recepción</h3>
                            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-300 mb-2 tracking-widest ml-1">Lugar</label>
                                    <input
                                        type="text"
                                        value={data.venue_name}
                                        onChange={(e) => updateData({ venue_name: e.target.value })}
                                        className="block w-full rounded-xl md:rounded-2xl border border-stone-100 bg-white px-4 py-3 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all"
                                        placeholder="Ej. Hacienda Los Arcos"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-300 mb-2 tracking-widest ml-1">Hora</label>
                                    <input
                                        type="time"
                                        value={data.venue_time}
                                        onChange={(e) => updateData({ venue_time: e.target.value })}
                                        className="block w-full rounded-xl md:rounded-2xl border border-stone-100 bg-white px-4 py-3 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-stone-300 mb-2 tracking-widest ml-1">Dirección</label>
                                <input
                                    type="text"
                                    value={data.venue_address}
                                    onChange={(e) => updateData({ venue_address: e.target.value })}
                                    className="block w-full rounded-xl md:rounded-2xl border border-stone-100 bg-white px-4 py-3 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all"
                                    placeholder="Calle Principal 123..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-stone-300 mb-2 tracking-widest ml-1">Link de Google Maps</label>
                                <input
                                    type="url"
                                    value={data.maps_link}
                                    onChange={(e) => updateData({ maps_link: e.target.value })}
                                    className="block w-full rounded-xl md:rounded-2xl border border-stone-100 bg-white px-4 py-3 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 transition-all"
                                    placeholder="https://goo.gl/maps/..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8">
                        <div className="space-y-1">
                            <h2 className="text-xl md:text-2xl font-serif text-[#1B2E1D]">Detalles Finales</h2>
                            <p className="text-xs md:text-sm text-stone-400 font-light">Personaliza la experiencia para tus invitados.</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] md:text-xs uppercase font-bold text-stone-400 mb-2 tracking-widest ml-1">Código de Vestimenta</label>
                                <input
                                    type="text"
                                    value={data.dress_code}
                                    onChange={(e) => updateData({ dress_code: e.target.value })}
                                    className="block w-full rounded-xl md:rounded-2xl border border-stone-100 bg-stone-50/50 px-4 py-3 md:py-4 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 focus:bg-white transition-all"
                                    placeholder="Ej. Formal, Etiqueta Rigurosa..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] md:text-xs uppercase font-bold text-stone-400 mb-2 tracking-widest ml-1">Fecha Límite para Confirmar</label>
                                <input
                                    type="date"
                                    value={data.rsvp_deadline}
                                    onChange={(e) => updateData({ rsvp_deadline: e.target.value })}
                                    className="block w-full rounded-xl md:rounded-2xl border border-stone-100 bg-stone-50/50 px-4 py-3 md:py-4 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 focus:bg-white transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] md:text-xs uppercase font-bold text-stone-400 mb-2 tracking-widest ml-1">Estilo Visual</label>
                                <select
                                    value={data.theme}
                                    onChange={(e) => updateData({ theme: e.target.value })}
                                    className="block w-full rounded-xl md:rounded-2xl border border-stone-100 bg-stone-50/50 px-4 py-3 md:py-4 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#1B2E1D]/5 focus:bg-white transition-all appearance-none"
                                >
                                    <option value="classic">Clásico (Blanco y Negro)</option>
                                    <option value="gold">Gold (Tonos Dorados)</option>
                                    <option value="botanical">Botánico (Verdes)</option>
                                    <option value="cecilia-70">Atemporal (Floral)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-12 flex items-center justify-between pt-8 border-t border-stone-100">
                    {step > 1 ? (
                        <button onClick={handleBack} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-stone-400 hover:text-[#1B2E1D] transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Atrás
                        </button>
                    ) : (
                        <button onClick={() => navigate('/dashboard')} className="text-[10px] uppercase font-bold tracking-widest text-stone-300 hover:text-stone-500 transition-colors">
                            Cancelar
                        </button>
                    )}

                    {step < 3 ? (
                        <button 
                            onClick={handleNext} 
                            disabled={!data.title || !data.date_time}
                            className="px-8 py-4 bg-[#1B2E1D] text-white rounded-2xl text-[10px] uppercase font-bold tracking-widest shadow-xl shadow-stone-200/50 hover:bg-[#2D312E] transition-all disabled:opacity-30 disabled:grayscale flex items-center gap-2"
                        >
                            Siguiente <ArrowRight className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-10 py-4 bg-[#BD7474] text-white rounded-2xl text-[10px] uppercase font-bold tracking-widest shadow-xl shadow-rose-100 hover:bg-[#A65B5B] transition-all disabled:opacity-50 flex items-center gap-3"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {isEditing ? 'Guardar Cambios' : (preselectedPlan ? 'Continuar al Pago' : 'Elegir Plan y Publicar')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
