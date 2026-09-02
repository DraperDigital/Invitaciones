import { useState } from 'react';
import { X, Sparkles, Wand2, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onApplyAiTheme: (aiTheme: {
        primaryColor: string;
        accentColor: string;
        cardBgColor: string;
        typographyPreset: 'elegante' | 'moderna' | 'romantica';
        welcomeMessage: string;
        welcomeSubtitle: string;
    }) => void;
};

const SAMPLE_PROMPTS = [
    { label: '🌸 Boda Boho Chic en Jardín', prompt: 'Boda romántica boho chic al aire libre con flores de eucalipto, tonos lavanda, oro rosa y detalles vintage.' },
    { label: '🏰 XV Años Estilo Cuento de Hadas', prompt: 'Fiesta de XV años elegante estilo princesa con tonos rosa pastel, dorado real y magia de luces.' },
    { label: '🌿 Bautizo Botánico Minimalista', prompt: 'Bautizo sereno y elegante con tonos crema, verde olivo, oro sutil y elementos naturales.' },
    { label: '🎓 Graduación Moderna & Neón', prompt: 'Fiesta de graduación universitaria vanguardista con tonos azul marino, dorado y estilo minimalista contemporáneo.' },
];

export default function AiDesignModal({ isOpen, onClose, onApplyAiTheme }: Props) {
    const [promptText, setPromptText] = useState('');
    const [generating, setGenerating] = useState(false);
    const [generatedTheme, setGeneratedTheme] = useState<any>(null);
    const toast = useToast();

    if (!isOpen) return null;

    const handleGenerate = async (customPrompt?: string) => {
        const textToUse = customPrompt || promptText;
        if (!textToUse.trim()) {
            toast.error('Por favor escribe o selecciona una idea para tu evento.');
            return;
        }

        setGenerating(true);
        setGeneratedTheme(null);

        // Smart AI Theme Synthesizer
        setTimeout(() => {
            const lower = textToUse.toLowerCase();
            let primary = '#1B2E1D';
            let accent = '#BD7474';
            let cardBg = '#C17B6A';
            let typography: 'elegante' | 'moderna' | 'romantica' = 'romantica';
            let welcome = 'Nos llena de alegría invitarte a compartir este momento tan especial lleno de amor y calidez.';
            let subtitle = 'Nuestra Celebración';

            if (lower.includes('boda') || lower.includes('novios')) {
                primary = '#2B3A2C';
                accent = '#D4AF37';
                cardBg = '#F9F6F0';
                typography = 'elegante';
                welcome = 'Con la bendición de nuestras familias y la alegría de nuestros corazones, te invitamos a celebrar nuestra unión eterna.';
                subtitle = 'Nuestra Boda';
            } else if (lower.includes('xv') || lower.includes('quince')) {
                primary = '#3A1E2B';
                accent = '#E08DAA';
                cardBg = '#FDF5F8';
                typography = 'romantica';
                welcome = 'Doy gracias a la vida por cumplir 15 años y quiero celebrar este sueño inolvidable rodeada de quienes más quiero.';
                subtitle = 'Mis XV Años';
            } else if (lower.includes('bautizo') || lower.includes('comunion')) {
                primary = '#1E2D3A';
                accent = '#A4C3B2';
                cardBg = '#F4F7F6';
                typography = 'moderna';
                welcome = 'Agradecemos a Dios el regalo de la vida e invitamos con amor a acompañarnos en esta sagrada bendición.';
                subtitle = 'Mi Bautizo';
            } else if (lower.includes('graduacion') || lower.includes('graduación')) {
                primary = '#111827';
                accent = '#F59E0B';
                cardBg = '#F9FAFB';
                typography = 'moderna';
                welcome = 'Un ciclo culmina y una gran meta se cumple. Te espero para brindar y celebrar este gran logro juntos.';
                subtitle = 'Mi Graduación';
            }

            setGeneratedTheme({
                primaryColor: primary,
                accentColor: accent,
                cardBgColor: cardBg,
                typographyPreset: typography,
                welcomeMessage: welcome,
                welcomeSubtitle: subtitle,
            });

            setGenerating(false);
            toast.success('¡Estilo IA generado con éxito! ✨');
        }, 1200);
    };

    const handleApply = () => {
        if (generatedTheme) {
            onApplyAiTheme(generatedTheme);
            toast.success('¡Tema IA aplicado a tu invitación!');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-stone-100 bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-[#DF3B94] text-white flex items-center justify-center shadow-lg shadow-[#DF3B94]/20">
                            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-serif text-[#1B2E1D]">Diseña con Inteligencia Artificial</h3>
                            <p className="text-[10px] sm:text-xs text-stone-400 font-medium">Crea paletas, tipografías y textos únicos en 1 clic</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs uppercase font-bold tracking-wider text-stone-700">¿Cómo imaginas tu evento?</label>
                        <textarea
                            rows={3}
                            placeholder="Ej. Boda elegante en jardín al atardecer con rosas blancas, velas y tonos lavanda..."
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] resize-none"
                        />
                    </div>

                    {/* Sample Ideas */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">O elige una plantilla de idea rápida:</p>
                        <div className="flex flex-wrap gap-2">
                            {SAMPLE_PROMPTS.map((item, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        setPromptText(item.prompt);
                                        handleGenerate(item.prompt);
                                    }}
                                    className="px-3 py-1.5 bg-stone-100 hover:bg-[#DF3B94]/10 hover:text-[#DF3B94] text-stone-600 rounded-full text-[10px] font-bold transition-all border border-stone-200/60"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        type="button"
                        onClick={() => handleGenerate()}
                        disabled={generating}
                        className="w-full py-4 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-[#DF3B94]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                        {generating ? 'Generando Magia IA...' : 'Generar Tema con IA'}
                    </button>

                    {/* Preview Generated Result */}
                    {generatedTheme && (
                        <div className="p-5 bg-gradient-to-br from-stone-50 to-pink-50/40 rounded-2xl border border-pink-200/60 space-y-4 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    Resultado Generado por IA
                                </span>
                                <span className="text-[10px] font-mono uppercase bg-white px-2 py-0.5 rounded-full border border-stone-200 text-stone-500">
                                    Preset: {generatedTheme.typographyPreset}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-[10px] uppercase font-bold text-stone-400">Paleta:</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-6 w-6 rounded-full border border-stone-200 shadow-sm" style={{ backgroundColor: generatedTheme.primaryColor }} title="Color Principal" />
                                    <div className="h-6 w-6 rounded-full border border-stone-200 shadow-sm" style={{ backgroundColor: generatedTheme.accentColor }} title="Color Acento" />
                                    <div className="h-6 w-6 rounded-full border border-stone-200 shadow-sm" style={{ backgroundColor: generatedTheme.cardBgColor }} title="Color Fondo Tarjeta" />
                                </div>
                            </div>

                            <div className="bg-white p-3.5 rounded-xl border border-stone-200/60 space-y-1">
                                <p className="text-[10px] font-bold uppercase text-[#DF3B94]">{generatedTheme.welcomeSubtitle}</p>
                                <p className="text-xs italic font-serif text-stone-700">"{generatedTheme.welcomeMessage}"</p>
                            </div>

                            <button
                                type="button"
                                onClick={handleApply}
                                className="w-full py-3 bg-[#1B2E1D] hover:bg-[#2A442E] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                Aplicar este Tema a mi Invitación <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
