import React from 'react';
import { MapPin, Navigation, Map as MapIcon, ExternalLink } from 'lucide-react';

interface InteractiveMapProps {
    venueName: string;
    address: string;
    mapsLink?: string;
    title?: string;
    subtitle?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
    venueName, 
    address, 
    mapsLink, 
    title = "Ubicación del Evento", 
    subtitle = "Te esperamos con los brazos abiertos en este lugar tan especial." 
}) => {
    const handleGoogleMaps = () => {
        if (mapsLink) {
            window.open(mapsLink, '_blank');
        } else {
            const query = encodeURIComponent(`${venueName} ${address}`);
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
        }
    };

    const handleWaze = () => {
        const query = encodeURIComponent(`${venueName} ${address}`);
        window.open(`https://waze.com/ul?q=${query}&navigate=yes`, '_blank');
    };

    return (
        <section id="location" className="py-24 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#DF3B94]/5 rounded-br-[10rem] -z-0" />
            
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#DF3B94]/10 text-[#DF3B94] mb-4">
                        <MapIcon className="h-6 w-6" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-extrabold text-[#222B38]">{title}</h2>
                    <p className="text-stone-400 font-light italic max-w-xl mx-auto">{subtitle}</p>
                </div>

                <div className="bg-[#F8F9FA] rounded-[3rem] p-12 md:p-16 border border-stone-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] text-center space-y-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[#DF3B94]">
                            <MapPin className="h-3 w-3" /> PUNTO DE ENCUENTRO
                        </div>
                        <h3 className="text-3xl md:text-4xl font-display font-extrabold text-[#222B38]">{venueName}</h3>
                        <p className="text-stone-500 font-light text-lg italic max-w-md mx-auto">{address}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 pt-8">
                        <button 
                            onClick={handleGoogleMaps}
                            className="bg-white hover:bg-stone-50 text-[#222B38] py-6 rounded-2xl flex items-center justify-center gap-3 border border-stone-200 shadow-sm transition-all transform active:scale-[0.98] group"
                        >
                            <div className="h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                <Navigation className="h-4 w-4" />
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em]">GOOGLE MAPS</span>
                        </button>
                        
                        <button 
                            onClick={handleWaze}
                            className="bg-white hover:bg-stone-50 text-[#222B38] py-6 rounded-2xl flex items-center justify-center gap-3 border border-stone-200 shadow-sm transition-all transform active:scale-[0.98] group"
                        >
                            <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                <ExternalLink className="h-4 w-4" />
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em]">WAZE NAVIGATION</span>
                        </button>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-[8px] uppercase tracking-[0.4em] text-stone-300 font-medium">
                        POR FAVOR, REGISTRE SU ASISTENCIA ANTES DE CONSULTAR LA RUTA.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default InteractiveMap;
