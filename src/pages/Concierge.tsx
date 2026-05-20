import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Clock, Calendar, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Seo from '../components/Seo';

const Concierge: React.FC = () => {
    const [searchParams] = useSearchParams();
    const eventId = searchParams.get('e') || 'evt-cecilia-70'; // Default to Cecilia for now
    const [contactInfo, setContactInfo] = useState<{name: string, whatsapp: string} | null>(null);
    const [eventData, setEventData] = useState<{title: string, slug: string, id: string} | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConcierge = async () => {
            try {
                // Try to find event by ID or slug
                let query = supabase.from('events').select('id, user_id, title, slug');
                
                // UUID check (simple regex)
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId);
                
                if (isUuid) {
                    query = query.eq('id', eventId);
                } else {
                    query = query.eq('slug', eventId === 'evt-cecilia-70' ? 'cecilia-70' : eventId);
                }

                const { data: eData, error: eventError } = await query.maybeSingle();

                if (!eventError && eData) {
                    setEventData(eData);
                    // Get owner profile
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('full_name, whatsapp_number')
                        .eq('id', eData.user_id)
                        .single();

                    if (!profileError && profileData) {
                        setContactInfo({
                            name: profileData.full_name || 'Organizador',
                            whatsapp: (profileData as any).whatsapp_number || ''
                        });
                    }
                }
            } catch (err) {
                console.error('Error fetching concierge:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchConcierge();
    }, [eventId]);

    const handleWhatsAppClick = () => {
        if (!contactInfo?.whatsapp) return;
        const title = eventData?.title || 'tu evento';
        const message = encodeURIComponent(`Hola, tengo una duda sobre la invitación de "${title}"...`);
        window.open(`https://wa.me/${contactInfo.whatsapp}?text=${message}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1B2E1D] font-sans selection:bg-[#BD7474]/20 flex flex-col items-center justify-center p-6 py-20">
            <Seo
                title="Contacto Concierge"
                description="Página de contacto del concierge de tu evento."
                path="/concierge"
                noindex
            />
            <div className="max-w-xl w-full">
                <Link 
                    to={eventData?.slug === 'cecilia-70' ? '/cecilia-70' : (eventData?.slug ? `/i/${eventData.slug}` : '/')} 
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 hover:text-[#1B2E1D] transition-colors mb-12"
                >
                    <ArrowLeft className="h-4 w-4" /> VOLVER A LA INVITACIÓN
                </Link>

                <div className="bg-white rounded-[3rem] border border-stone-100 p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] space-y-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#BD7474]/5 rounded-bl-[10rem] -z-0" />
                    
                    <div className="text-center space-y-4 relative z-10">
                        <div className="h-16 w-16 bg-[#1B2E1D] rounded-full flex items-center justify-center text-white mx-auto shadow-xl ring-8 ring-stone-50">
                            <MessageCircle className="h-8 w-8" />
                        </div>
                        <h1 className="text-4xl font-serif mt-6">Concierge de Invitto</h1>
                        <p className="text-stone-400 font-light italic">Estamos aquí para hacer tu experiencia perfecta.</p>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <p className="text-stone-500 font-light text-center leading-relaxed px-4 lowercase italic text-lg">
                            "Si tienes alguna duda sobre la ubicación, el código de vestimenta o necesitas realizar un cambio en tu confirmación, por favor contáctanos."
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="p-6 bg-stone-50/50 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                                <Clock className="h-4 w-4 text-[#BD7474]" />
                                <span className="text-[9px] uppercase font-bold tracking-widest text-stone-400">Atención</span>
                                <span className="text-xs font-serif">Inmediata</span>
                            </div>
                            <div className="p-6 bg-stone-50/50 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                                <Calendar className="h-4 w-4 text-[#BD7474]" />
                                <span className="text-[9px] uppercase font-bold tracking-widest text-stone-400">Días</span>
                                <span className="text-xs font-serif">Lun - Dom</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 relative z-10">
                        {loading ? (
                            <div className="flex justify-center py-4">
                                <div className="h-6 w-6 border-2 border-stone-200 border-t-[#1B2E1D] rounded-full animate-spin" />
                            </div>
                        ) : contactInfo?.whatsapp ? (
                            <button 
                                onClick={handleWhatsAppClick}
                                className="w-full bg-[#1B2E1D] hover:bg-[#2D312E] text-white py-6 rounded-[2rem] text-[10px] uppercase font-bold tracking-[0.4em] transition-all transform active:scale-[0.98] shadow-2xl shadow-stone-200 flex items-center justify-center gap-3"
                            >
                                <MessageCircle className="h-5 w-5" /> CHATEAR POR WHATSAPP
                            </button>
                        ) : (
                            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-center">
                                <Info className="h-6 w-6 mx-auto mb-2 opacity-50" />
                                <p className="text-xs font-medium uppercase tracking-widest leading-relaxed">
                                    El servicio de concierge no se encuentra configurado para este evento.
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-[8px] uppercase tracking-[0.2em] font-medium text-stone-300 text-center">
                        © 2026 INVITTO LUXURY CONCIERGE SERVICE
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Concierge;
