import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Loader2, ArrowLeft, ArrowRight, Save, Sparkles, PartyPopper } from 'lucide-react';

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
    
    const isEditing = !!id;

    useEffect(() => {
        if (id && user) {
            const fetchEvent = async () => {
                const { data: eventData } = await supabase
                    .from('events')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (eventData) {
                    setData({
                        title: eventData.title || '',
                        event_type: eventData.event_type || 'wedding',
                        date_time: eventData.date_time ? new Date(eventData.date_time).toISOString().slice(0, 16) : '',
                        venue_name: eventData.venue_name || '',
                        venue_address: eventData.venue_address || '',
                        maps_link: eventData.maps_link || '',
                        misa_name: eventData.theme_config?.misa_name || '',
                        misa_address: eventData.theme_config?.misa_address || '',
                        misa_maps_link: eventData.theme_config?.misa_maps_link || '',
                        misa_time: eventData.theme_config?.misa_time || '',
                        dress_code: eventData.dress_code || '',
                        rsvp_deadline: eventData.rsvp_deadline ? new Date(eventData.rsvp_deadline).toISOString().slice(0, 10) : '',
                        theme: eventData.theme_config?.theme || 'classic'
                    });
                }
                setDataLoaded(true);
            };
            fetchEvent();
        } else {
            setDataLoaded(true);
        }
    }, [id, user]);

    const updateData = (updates: Partial<WizardData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);

        // Validar theme_config anterior si lo hubiera? O simplificar y sobrescribir
        // Lo sobrescribimos asegurándonos de mantener el 'theme'
        const payload = {
            title: data.title,
            event_type: data.event_type as any,
            date_time: new Date(data.date_time).toISOString(),
            venue_name: data.venue_name,
            venue_address: data.venue_address,
            maps_link: data.maps_link,
            dress_code: data.dress_code,
            rsvp_deadline: data.rsvp_deadline ? new Date(data.rsvp_deadline).toISOString() : null,
            // Aquí idealmente deberíamos hacer merge del theme_config en modo editar,
            // pero si la base no tiene más configuraciones en esta pantalla, basta con asentar el theme
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
                misa_time: data.misa_time
            };
            
            const { error } = await supabase.from('events').update({ ...payload, theme_config: newConfig }).eq('id', id);
            setLoading(false);
            if (error) {
                toast.error('Error al actualizar el evento: ' + error.message);
            } else {
                navigate(`/dashboard/event/${id}`);
            }
        } else {
            const insertPayload = {
                id: crypto.randomUUID(),
                ...payload,
                user_id: user.id,
                is_published: true,
                theme_config: { 
                    theme: data.theme,
                    misa_name: data.misa_name,
                    misa_address: data.misa_address,
                    misa_maps_link: data.misa_maps_link,
                    misa_time: data.misa_time
                },
                slug: `${data.title.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`,
            };
            const { error } = await supabase.from('events').insert(insertPayload);
            setLoading(false);
            if (error) {
                toast.error('Error al crear el evento: ' + error.message);
            } else {
                navigate('/dashboard');
            }
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

            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-stone-900">{isEditing ? 'Editar Invitación' : 'Crear Nueva Invitación'}</h1>
                <p className="text-stone-500">Paso {step} de 3</p>
                <div className="mt-4 h-2 w-full rounded-full bg-stone-200">
                    <div
                        className="h-2 rounded-full bg-stone-900 transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-medium">Información Básica</h2>
                        <div>
                            <label className="block text-sm font-medium text-stone-700">Título del Evento</label>
                            <input
                                type="text"
                                required
                                value={data.title}
                                onChange={(e) => updateData({ title: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                                placeholder="Ej. Boda de Ana y Carlos"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700">Tipo de Evento</label>
                            <select
                                value={data.event_type}
                                onChange={(e) => updateData({ event_type: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                            >
                                <option value="wedding">Boda</option>
                                <option value="xv">XV Años</option>
                                <option value="birthday">Cumpleaños</option>
                                <option value="corporate">Corporativo</option>
                                <option value="other">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700">Fecha y Hora</label>
                            <input
                                type="datetime-local"
                                required
                                value={data.date_time}
                                onChange={(e) => updateData({ date_time: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-xl font-medium text-stone-900 font-serif">Ubicación del Evento</h2>
                        </div>
                        
                        {/* Sección Misa / Ceremonia */}
                        <div className="p-5 border border-stone-100 bg-stone-50/50 rounded-2xl space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#BD7474]">Ceremonia / Misa</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-stone-500 mb-1">Nombre del Lugar</label>
                                    <input
                                        type="text"
                                        value={data.misa_name}
                                        onChange={(e) => updateData({ misa_name: e.target.value })}
                                        className="block w-full rounded-xl border border-stone-200 px-3 py-2 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                                        placeholder="Ej. Parroquia de San Juan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-stone-500 mb-1">Hora de Inicio</label>
                                    <input
                                        type="time"
                                        value={data.misa_time}
                                        onChange={(e) => updateData({ misa_time: e.target.value })}
                                        className="block w-full rounded-xl border border-stone-200 px-3 py-2 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-stone-500 mb-1">Dirección</label>
                                <input
                                    type="text"
                                    value={data.misa_address}
                                    onChange={(e) => updateData({ misa_address: e.target.value })}
                                    className="block w-full rounded-xl border border-stone-200 px-3 py-2 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                                    placeholder="Calle, Número, Colonia..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-stone-500 mb-1">Enlace de Google Maps</label>
                                <input
                                    type="url"
                                    value={data.misa_maps_link}
                                    onChange={(e) => updateData({ misa_maps_link: e.target.value })}
                                    className="block w-full rounded-xl border border-stone-200 px-3 py-2 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                                    placeholder="https://goo.gl/maps/..."
                                />
                            </div>
                        </div>

                        {/* Sección Celebración */}
                        <div className="p-5 border border-stone-100 bg-stone-50/50 rounded-2xl space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900">Celebración / Fiesta</h3>
                            <div>
                                <label className="block text-xs font-medium text-stone-500 mb-1">Nombre del Lugar</label>
                                <input
                                    type="text"
                                    value={data.venue_name}
                                    onChange={(e) => updateData({ venue_name: e.target.value })}
                                    className="block w-full rounded-xl border border-stone-200 px-3 py-2 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                                    placeholder="Ej. Hacienda Los Arcos"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-stone-500 mb-1">Dirección</label>
                                <input
                                    type="text"
                                    value={data.venue_address}
                                    onChange={(e) => updateData({ venue_address: e.target.value })}
                                    className="block w-full rounded-xl border border-stone-200 px-3 py-2 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                                    placeholder="Calle Principal 123..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-stone-500 mb-1">Enlace de Google Maps</label>
                                <input
                                    type="url"
                                    value={data.maps_link}
                                    onChange={(e) => updateData({ maps_link: e.target.value })}
                                    className="block w-full rounded-xl border border-stone-200 px-3 py-2 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                                    placeholder="https://goo.gl/maps/..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-medium">Detalles Finales</h2>
                        <div>
                            <label className="block text-sm font-medium text-stone-700">Código de Vestimenta</label>
                            <input
                                type="text"
                                value={data.dress_code}
                                onChange={(e) => updateData({ dress_code: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                                placeholder="Ej. Formal, Etiqueta Rigurosa..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700">Fecha Límite de RSVP</label>
                            <input
                                type="date"
                                value={data.rsvp_deadline}
                                onChange={(e) => updateData({ rsvp_deadline: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700">Tema Visual</label>
                            <select
                                value={data.theme}
                                onChange={(e) => updateData({ theme: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                            >
                                <option value="classic">Clásico (Blanco y Negro)</option>
                                <option value="gold">Gold (Tonos Dorados)</option>
                                <option value="botanical">Botánico (Verdes)</option>
                            </select>
                        </div>
                    </div>
                )}

                <div className="mt-8 flex justify-between pt-6 border-t border-stone-100">
                    {step > 1 ? (
                        <Button variant="outline" onClick={handleBack}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Atrás
                        </Button>
                    ) : (
                        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                            Cancelar
                        </Button>
                    )}

                    {step < 3 ? (
                        <Button onClick={handleNext} disabled={!data.title || !data.date_time}>
                            Siguiente
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? 'Guardar Cambios' : 'Publicar'}
                            {!loading && <Save className="ml-2 h-4 w-4" />}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
