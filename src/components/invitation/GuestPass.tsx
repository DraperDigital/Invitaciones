import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Download, MapPin, Users } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useToast } from '../../context/ToastContext';

interface GuestPassProps {
    guest: any;
    event: any;
    primaryColor?: string;
}

const GuestPass: React.FC<GuestPassProps> = ({ guest, event, primaryColor = '#1B2E1D' }) => {
    const passRef = useRef<HTMLDivElement>(null);
    const toast = useToast();
    const checkInUrl = `${window.location.origin}/i/${event?.slug || 'invite'}?t=${guest?.guest_token || guest?.id}`;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Mi Pase para ${event?.title}`,
                    text: `Este es mi pase digital para el evento.`,
                    url: checkInUrl,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback: copiar al portapapeles
            try {
                await navigator.clipboard.writeText(checkInUrl);
                toast.success('Enlace copiado al portapapeles');
            } catch {
                toast.info('Copia este enlace: ' + checkInUrl);
            }
        }
    };

    const handleDownload = async () => {
        if (passRef.current === null) return;

        try {
            const dataUrl = await toPng(passRef.current, {
                cacheBust: true,
                quality: 1,
                backgroundColor: '#ffffff',
                style: { borderRadius: '0' }
            });
            const link = document.createElement('a');
            link.download = `pase-${guest?.name?.replace(/\s+/g, '_') || 'invitado'}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Error downloading pass:', err);
            toast.error('Error al descargar el pase. Por favor intenta de nuevo.');
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div 
                ref={passRef}
                className="w-[350px] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-stone-100 flex flex-col"
            >
                {/* Header / Ticket Top */}
                <div 
                    className="p-8 text-white text-center space-y-2 relative overflow-hidden"
                    style={{ backgroundColor: primaryColor }}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-60">PASE DIGITAL PERSONALIZADO</p>
                    <h3 className="text-2xl font-serif italic">{event?.title || 'Celebración'}</h3>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8 relative">
                    {/* Guest Info */}
                    <div className="text-center space-y-1">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-stone-300">INVITADO</p>
                        <p className="text-2xl font-serif text-stone-800">{guest?.name}</p>
                    </div>

                    {/* QR Section */}
                    <div className="flex justify-center p-4 bg-stone-50 rounded-[2rem] border border-stone-100 relative group transition-all">
                        <QRCodeSVG 
                            value={checkInUrl} 
                            size={180}
                            bgColor={"#F9F8F6"}
                            fgColor={primaryColor}
                            level={"H"}
                            includeMargin={false}
                            className="rounded-lg shadow-sm"
                        />
                    </div>

                    {/* Event Details Row */}
                    <div className="grid grid-cols-2 gap-4 border-y border-dashed border-stone-200 py-6">
                        <div className="flex flex-col items-center gap-1">
                            <Users className="h-4 w-4 text-stone-300" />
                            <span className="text-[10px] font-bold text-stone-800">{1 + (guest?.rsvps?.[0]?.plus_ones_confirmed || 0)} PAX</span>
                            <span className="text-[8px] uppercase tracking-widest text-stone-300 font-bold">ACCESO</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <MapPin className="h-4 w-4 text-stone-300" />
                            <span className="text-[10px] font-bold text-stone-800">{guest?.event_tables?.name || 'Mesa Lib.'}</span>
                            <span className="text-[8px] uppercase tracking-widest text-stone-300 font-bold">ASIGNACIÓN</span>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="text-center">
                        <p className="text-[9px] text-stone-400 font-medium leading-relaxed italic px-4">
                            Por favor presenta este código QR al llegar al evento para facilitar tu acceso y ubicación.
                        </p>
                    </div>
                </div>

                {/* Decorative Ticket Footer */}
                <div className="h-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between px-6">
                    <div className="w-4 h-4 bg-[#FDFBF7] rounded-full -ml-8 border border-stone-100" />
                    <div className="flex-1 border-t border-dashed border-stone-200 mx-2" />
                    <div className="w-4 h-4 bg-[#FDFBF7] rounded-full -mr-8 border border-stone-100" />
                </div>
            </div>

            {/* Actions (Outside the ref to not be in the image) */}
            <div className="mt-8 flex gap-4 w-full max-w-[350px]">
                <button 
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-100 text-stone-500 rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-stone-200 transition-all transition-colors"
                >
                    <Share2 className="h-3 w-3" /> Compartir
                </button>
                <button 
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-900 text-white rounded-xl text-[10px] uppercase font-bold tracking-widest hover:shadow-lg transition-all"
                >
                    <Download className="h-3 w-3" /> Descargar
                </button>
            </div>
        </div>
    );
};

export default GuestPass;
