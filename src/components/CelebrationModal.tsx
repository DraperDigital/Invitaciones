import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, PartyPopper, X, ExternalLink, Heart } from 'lucide-react';

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300 overflow-y-auto">
            <div className="fixed inset-0 bg-[#DF3B94]/60 backdrop-blur-sm" onClick={onClose} />

            {/* Confetti — pure CSS, 30 pieces */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
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

            <div className="relative w-full max-w-md bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300 my-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                    aria-label="Cerrar"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="text-center space-y-5">
                    <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 rounded-full flex items-center justify-center relative shrink-0">
                        <PartyPopper className="h-8 w-8 sm:h-10 sm:w-10 text-[#DF3B94]" />
                        <Heart className="absolute -top-1 -right-1 h-5 w-5 text-rose-400 fill-rose-400 animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[#222B38] tracking-tight">
                            ¡Tu invitación está lista!
                        </h3>
                        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed px-1">
                            Compártela con tus invitados y empieza a recibir confirmaciones al instante.
                        </p>
                    </div>

                    {/* URL display + copy container (fluid & responsive, zero overflow) */}
                    <div className="flex items-center gap-2 bg-stone-50 border border-stone-200/80 rounded-2xl p-2 sm:p-2.5 text-left w-full overflow-hidden shadow-inner">
                        <input
                            type="text"
                            readOnly
                            value={invitationUrl}
                            className="min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-stone-700 outline-none px-2 truncate cursor-text"
                            onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        <button
                            onClick={handleCopy}
                            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-pink-500/20 cursor-pointer"
                        >
                            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            <span>{copied ? 'Copiado' : 'Copiar'}</span>
                        </button>
                    </div>

                    {/* Share actions grid */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                        <a
                            href={whatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-3.5 px-3 bg-[#25D366] hover:bg-[#1FAF54] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-emerald-500/20 cursor-pointer min-w-0"
                        >
                            <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            <span className="truncate">WhatsApp</span>
                        </a>
                        <Link
                            to={invitationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 py-3.5 px-2.5 bg-white border border-stone-200 hover:border-stone-400 text-stone-800 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm cursor-pointer min-w-0"
                        >
                            <ExternalLink className="h-4 w-4 shrink-0 text-stone-600" />
                            <span className="truncate">Ver invitación</span>
                        </Link>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full text-center text-xs font-semibold text-stone-400 hover:text-stone-700 py-2 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
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
