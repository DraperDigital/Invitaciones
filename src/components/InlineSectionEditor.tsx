import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import type { Event } from '../types/database.types';
import type { SectionId } from '../lib/sectionRegistry';

type Props = {
    sectionId: SectionId;
    event: Event;
    onClose: () => void;
    onUpdateThemeConfig: (key: string, value: any) => Promise<void>;
    onUpdateEventColumn: (column: string, value: any) => Promise<void>;
};

export default function InlineSectionEditor({ sectionId, event, onClose, onUpdateThemeConfig, onUpdateEventColumn }: Props) {
    const [isSaving, setIsSaving] = useState(false);
    const cfg = event.theme_config || {};
    
    // Local state for specific fields based on section
    const [title, setTitle] = useState(event.title || '');
    const [subtitle, setSubtitle] = useState(cfg.subtitle || '');
    const [welcomeMessage, setWelcomeMessage] = useState(cfg.welcome_message || '');
    const [dateTime, setDateTime] = useState(event.date_time ? new Date(event.date_time).toISOString().slice(0, 16) : '');
    const [venueName, setVenueName] = useState(event.venue_name || '');
    const [venueAddress, setVenueAddress] = useState(event.venue_address || '');
    const [mapsLink, setMapsLink] = useState(event.maps_link || '');
    const [venueTime, setVenueTime] = useState(cfg.venue_time || '');
    
    const [misaName, setMisaName] = useState(cfg.misa_name || '');
    const [misaTime, setMisaTime] = useState(cfg.misa_time || '');
    const [misaAddress, setMisaAddress] = useState(cfg.misa_address || '');
    const [misaMapsLink, setMisaMapsLink] = useState(cfg.misa_maps_link || '');

    const [dressCode, setDressCode] = useState(event.dress_code || '');

    useEffect(() => {
        setTitle(event.title || '');
        setSubtitle(cfg.subtitle || '');
        setWelcomeMessage(cfg.welcome_message || '');
        setDateTime(event.date_time ? new Date(event.date_time).toISOString().slice(0, 16) : '');
        setVenueName(event.venue_name || '');
        setVenueAddress(event.venue_address || '');
        setMapsLink(event.maps_link || '');
        setVenueTime(cfg.venue_time || '');
        setMisaName(cfg.misa_name || '');
        setMisaTime(cfg.misa_time || '');
        setMisaAddress(cfg.misa_address || '');
        setMisaMapsLink(cfg.misa_maps_link || '');
        setDressCode(event.dress_code || '');
    }, [event, sectionId]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (sectionId === 'hero') {
                if (title !== event.title) await onUpdateEventColumn('title', title);
                if (subtitle !== cfg.subtitle) await onUpdateThemeConfig('subtitle', subtitle);
            }
            if (sectionId === 'message') {
                if (title !== event.title) await onUpdateEventColumn('title', title);
                if (welcomeMessage !== cfg.welcome_message) await onUpdateThemeConfig('welcome_message', welcomeMessage);
            }
            if (sectionId === 'countdown') {
                if (dateTime) await onUpdateEventColumn('date_time', new Date(dateTime).toISOString());
            }
            if (sectionId === 'location') {
                if (venueName !== event.venue_name) await onUpdateEventColumn('venue_name', venueName);
                if (venueAddress !== event.venue_address) await onUpdateEventColumn('venue_address', venueAddress);
                if (mapsLink !== event.maps_link) await onUpdateEventColumn('maps_link', mapsLink);
                if (venueTime !== cfg.venue_time) await onUpdateThemeConfig('venue_time', venueTime);
                if (misaName !== cfg.misa_name) await onUpdateThemeConfig('misa_name', misaName);
                if (misaTime !== cfg.misa_time) await onUpdateThemeConfig('misa_time', misaTime);
                if (misaAddress !== cfg.misa_address) await onUpdateThemeConfig('misa_address', misaAddress);
                if (misaMapsLink !== cfg.misa_maps_link) await onUpdateThemeConfig('misa_maps_link', misaMapsLink);
            }
            if (sectionId === 'dress_code') {
                if (dressCode !== event.dress_code) await onUpdateEventColumn('dress_code', dressCode);
            }
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    const sectionTitles: Record<string, string> = {
        'hero': 'Portada Principal',
        'guest_welcome': 'Mensaje de Bienvenida',
        'message': 'Dedicatoria y Mensaje',
        'countdown': 'Cuenta Regresiva',
        'location': 'Mapa y Ubicación',
        'dress_code': 'Código de Vestimenta',
        'gallery': 'Galería de Fotos',
        'itinerary': 'Itinerario',
        'hotels': 'Hoteles y Hospedaje',
        'gifts': 'Mesa de Regalos',
        'chambelanes': 'Corte de Honor',
    };

    const getDesignSection = (id: string) => {
        switch(id) {
            case 'itinerary': return 'itinerary';
            case 'gallery': return 'gallery';
            case 'gifts': return 'gifts';
            case 'hotels': return 'hotels';
            case 'chambelanes': return 'chambelanes';
            case 'dress_code': return 'dress_code';
            case 'location': return 'events';
            case 'hero': return 'multimedia';
            case 'guest_welcome': return 'content';
            case 'message': return 'content';
            default: return 'matrix';
        }
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
                    <>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Subtítulo (ej. 70 Años)</label>
                            <input 
                                type="text" 
                                value={subtitle} 
                                onChange={e => setSubtitle(e.target.value)}
                                className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Título Principal</label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                            />
                        </div>
                    </>
                )}
                {sectionId === 'guest_welcome' && (
                    <div className="space-y-4 bg-stone-50 p-5 rounded-2xl border border-stone-200">
                        <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
                            <span className="text-base">✨</span>
                            <span>Mensaje y Saludo de Bienvenida</span>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">
                            Esta sección se sitúa de forma fija justo después de la portada principal. Saluda de forma personalizada a cada invitado (ej. <em>"¡Hola, Juan!"</em>) o de manera general (<em>"¡Bienvenidos!"</em>), junto a la frase representativa de tu evento.
                        </p>
                        <p className="text-[11px] text-stone-400 italic">
                            💡 Puedes activarla u ocultarla usando el botón de visibilidad (ojo) en la lista de secciones.
                        </p>
                    </div>
                )}
                {sectionId === 'message' && (
                    <>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Título Principal</label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Mensaje</label>
                            <textarea 
                                rows={4}
                                value={welcomeMessage} 
                                onChange={e => setWelcomeMessage(e.target.value)}
                                className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 resize-none text-stone-800"
                            />
                        </div>
                    </>
                )}

                {(sectionId === 'countdown') && (
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Fecha y Hora</label>
                        <input 
                            type="datetime-local" 
                            value={dateTime} 
                            onChange={e => setDateTime(e.target.value)}
                            className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                        />
                    </div>
                )}

                {sectionId === 'location' && (
                    <div className="space-y-8">
                        {/* Ceremonia */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-display font-extrabold font-bold text-[#222B38] border-b border-stone-100 pb-2">Datos de la Ceremonia (Misa)</h4>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Nombre del Lugar</label>
                                <input 
                                    type="text" 
                                    value={misaName} 
                                    onChange={e => setMisaName(e.target.value)}
                                    placeholder="Ej. Parroquia San Miguel"
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Hora</label>
                                <input 
                                    type="time" 
                                    value={misaTime} 
                                    onChange={e => setMisaTime(e.target.value)}
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Dirección</label>
                                <textarea 
                                    rows={2}
                                    value={misaAddress} 
                                    onChange={e => setMisaAddress(e.target.value)}
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 resize-none text-stone-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Link de Google Maps</label>
                                <input 
                                    type="url" 
                                    value={misaMapsLink} 
                                    onChange={e => setMisaMapsLink(e.target.value)}
                                    placeholder="https://maps.app.goo.gl/..."
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                                />
                            </div>
                        </div>

                        {/* Recepción */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-display font-extrabold font-bold text-[#222B38] border-b border-stone-100 pb-2">Datos de la Recepción</h4>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Nombre del Lugar</label>
                                <input 
                                    type="text" 
                                    value={venueName} 
                                    onChange={e => setVenueName(e.target.value)}
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Hora</label>
                                <input 
                                    type="time" 
                                    value={venueTime} 
                                    onChange={e => setVenueTime(e.target.value)}
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Dirección</label>
                                <textarea 
                                    rows={2}
                                    value={venueAddress} 
                                    onChange={e => setVenueAddress(e.target.value)}
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 resize-none text-stone-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Link de Google Maps</label>
                                <input 
                                    type="url" 
                                    value={mapsLink} 
                                    onChange={e => setMapsLink(e.target.value)}
                                    placeholder="https://maps.app.goo.gl/..."
                                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {sectionId === 'dress_code' && (
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Código de Vestimenta</label>
                        <select
                            value={['Formal', 'Semi-Formal', 'Guayabera', 'Casual Elegante', 'Etiqueta Rigurosa', 'Riguroso Negro (Black Tie)', 'Blanco y Tonos Pastel', 'Libre'].includes(dressCode) ? dressCode : ''}
                            onChange={e => setDressCode(e.target.value)}
                            className="w-full bg-stone-50 px-4 py-3 rounded-xl text-xs font-bold text-[#1B2E1D] border border-stone-200 outline-none cursor-pointer focus:ring-2 focus:ring-[#1B2E1D]/10"
                        >
                            <option value="">-- Selecciona de la Lista --</option>
                            <option value="Formal">👔 Formal / Traje Oscuro & Vestido Largo</option>
                            <option value="Semi-Formal">🍸 Semi-Formal / Cóctel</option>
                            <option value="Etiqueta Rigurosa">🎩 Etiqueta Rigurosa / Esmoquin & Vestido de Gala</option>
                            <option value="Guayabera">🏝️ Guayabera / Playa / Clima Cálido</option>
                            <option value="Casual Elegante">✨ Casual Elegante</option>
                            <option value="Riguroso Negro (Black Tie)">💃 Riguroso Negro (Black Tie)</option>
                            <option value="Blanco y Tonos Pastel">🌸 Blanco & Tonos Pastel</option>
                            <option value="Libre">🎨 Libre / Según la Ocasión</option>
                        </select>
                        <input 
                            type="text" 
                            value={dressCode} 
                            onChange={e => setDressCode(e.target.value)}
                            placeholder="o escribe un código personalizado..."
                            className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                        />
                    </div>
                )}
                
                {/* Fallback for unmapped sections */}
                {!['hero', 'message', 'countdown', 'location', 'dress_code'].includes(sectionId) && (
                    <div className="text-center py-8 space-y-4">
                        <p className="text-stone-500 text-sm font-medium">
                            Esta sección requiere herramientas avanzadas (como subir fotos o agregar listas).
                        </p>
                        <a 
                            href={`/dashboard/design/${event.id}?section=${getDesignSection(sectionId)}`}
                            className="inline-block px-6 py-3 bg-[#DF3B94] text-white text-xs font-bold rounded-xl shadow hover:scale-105 transition-all"
                        >
                            Ir a Herramienta Avanzada
                        </a>
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
