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
    const [welcomeMessage, setWelcomeMessage] = useState(cfg.welcome_message || '');
    const [dateTime, setDateTime] = useState(event.date_time ? new Date(event.date_time).toISOString().slice(0, 16) : '');
    const [venueName, setVenueName] = useState(event.venue_name || '');
    const [venueAddress, setVenueAddress] = useState(event.venue_address || '');
    const [dressCode, setDressCode] = useState(event.dress_code || '');

    useEffect(() => {
        setTitle(event.title || '');
        setWelcomeMessage(cfg.welcome_message || '');
        setDateTime(event.date_time ? new Date(event.date_time).toISOString().slice(0, 16) : '');
        setVenueName(event.venue_name || '');
        setVenueAddress(event.venue_address || '');
        setDressCode(event.dress_code || '');
    }, [event, sectionId]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
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
        'message': 'Mensaje de Bienvenida',
        'countdown': 'Cuenta Regresiva',
        'location': 'Mapa y Ubicación',
        'dress_code': 'Código de Vestimenta',
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white shadow-2xl rounded-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-stone-100 bg-white">
                    <div>
                        <h3 className="text-lg font-serif text-[#1B2E1D]">Editar Sección</h3>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">
                            {sectionTitles[sectionId as string] || sectionId}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                        <X className="h-5 w-5 text-stone-400" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[70vh] p-6 space-y-6 bg-white">
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
                    <>
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
                            <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Dirección</label>
                            <textarea 
                                rows={2}
                                value={venueAddress} 
                                onChange={e => setVenueAddress(e.target.value)}
                                className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 resize-none text-stone-800"
                            />
                        </div>
                    </>
                )}

                {sectionId === 'dress_code' && (
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-stone-500">Código de Vestimenta</label>
                        <input 
                            type="text" 
                            value={dressCode} 
                            onChange={e => setDressCode(e.target.value)}
                            className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#1B2E1D]/10 text-stone-800"
                        />
                    </div>
                )}
                
                {/* Fallback for unmapped sections */}
                {!['message', 'countdown', 'location', 'dress_code'].includes(sectionId) && (
                    <div className="text-center py-8 space-y-4">
                        <p className="text-stone-500 text-sm font-medium">
                            Esta sección requiere herramientas avanzadas (como subir fotos o agregar listas).
                        </p>
                        <a 
                            href={`/dashboard/edit/${event.id}`}
                            className="inline-block px-6 py-3 bg-[#1B2E1D] text-white text-xs font-bold rounded-xl shadow hover:scale-105 transition-all"
                        >
                            Editar en Dashboard
                        </a>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-stone-100 bg-stone-50/50">
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-4 bg-[#1B2E1D] text-white rounded-xl text-[10px] uppercase font-bold tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
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
