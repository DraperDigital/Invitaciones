import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, PartyPopper, X, ExternalLink, Sparkles } from 'lucide-react';

interface CelebrationModalProps {
    open: boolean;
    onClose: () => void;
    invitationUrl: string;
    eventTitle?: string;
}

export default function CelebrationModal({ open, onClose, invitationUrl, eventTitle }: CelebrationModalProps) {
    const [copied, setCopied] = useState(false);

    if (!open) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(invitationUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Silent fail — user can still copy manually from the input
        }
    };

    const whatsAppText = eventTitle
        ? `¡Estás invitad@ a ${eventTitle}! Confirma tu asistencia aquí: ${invitationUrl}`
        : `¡Estás invitad@ a mi evento! Confirma tu asistencia aquí: ${invitationUrl}`;
    const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(whatsAppText)}`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-[#DF3B94]/60 backdrop-blur-sm" onClick={onClose} />

            {/* Confetti — pure CSS, 30 pieces */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 30 }).map((_, i) => (
                    <span
                        key={i}
                        className="confetti-piece absolute top-0"
                        style={{
                            left: `${(i * 100) / 30}%`,
                            animationDelay: `${(i % 10) * 0.15}s`,
                            backgroundColor: ['#BD7474', '#1B2E1D', '#FDE68A', '#FBCFE8', '#A7F3D0'][i % 5],
                        }}
                    />
                ))}
            </div>

            <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 md:p-12 shadow-2xl animate-in zoom-in-95 duration-500">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-900 transition-colors"
                    aria-label="Cerrar"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-2 relative">
                        <PartyPopper className="h-10 w-10 text-[#DF3B94]" />
                        <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-amber-400 animate-pulse" />
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-3xl md:text-4xl font-display font-extrabold text-[#222B38]">¡Tu invitación está lista!</h3>
                        <p className="text-stone-500 font-light leading-relaxed px-2">
                            Compártela con tus invitados y empieza a recibir confirmaciones al instante.
                        </p>
                    </div>

                    {/* URL display + copy */}
                    <div className="flex items-center gap-2 bg-stone-50 border border-stone-100 rounded-2xl p-3 text-left">
                        <input
                            type="text"
                            readOnly
                            value={invitationUrl}
                            className="flex-1 bg-transparent text-xs md:text-sm text-stone-700 outline-none px-2 truncate"
                            onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 px-3 py-2 bg-[#DF3B94] text-white rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-[#C52A7C] transition-all"
                        >
                            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            {copied ? 'Copiado' : 'Copiar'}
                        </button>
                    </div>

                    {/* Share actions */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <a
                            href={whatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white rounded-2xl text-[10px] uppercase font-bold tracking-widest hover:bg-[#1FAF54] transition-all shadow-lg"
                        >
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            WhatsApp
                        </a>
                        <Link
                            to={invitationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-4 bg-white border border-stone-200 text-stone-700 rounded-2xl text-[10px] uppercase font-bold tracking-widest hover:border-[#1B2E1D] hover:text-[#222B38] transition-all"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Ver invitación
                        </Link>
                    </div>

                    <button
                        onClick={onClose}
                        className="block w-full text-center text-[10px] uppercase font-bold tracking-widest text-stone-400 hover:text-[#222B38] transition-colors pt-2"
                    >
                        Personalizar diseño primero
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes confetti-fall {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                }
                .confetti-piece {
                    width: 8px;
                    height: 14px;
                    border-radius: 2px;
                    animation: confetti-fall 3.5s linear forwards;
                }
            `}</style>
        </div>
    );
}
