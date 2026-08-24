import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Gift, User, Calendar, Save, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface QuinielaModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface PredictionItem {
    id?: string;
    name: string;
    gender: 'niño' | 'niña' | 'sorpresa';
    date: string;
}

const DEFAULT_PREDICTIONS: PredictionItem[] = [
    { name: 'Tío Roberto', gender: 'niño', date: '2027-01-15' },
    { name: 'Abuela Carmen', gender: 'niña', date: '2027-01-10' },
    { name: 'Primo Alex', gender: 'sorpresa', date: '2027-01-22' }
];

export default function QuinielaModal({ isOpen, onClose }: QuinielaModalProps) {
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'niño' | 'niña' | 'sorpresa' | null>(null);
    const [date, setDate] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [predictions, setPredictions] = useState<PredictionItem[]>(DEFAULT_PREDICTIONS);
    const [loadingPredictions, setLoadingPredictions] = useState(false);

    // Fetch predictions from Supabase or localStorage
    const fetchPredictions = async () => {
        if (isSupabaseConfigured) {
            setLoadingPredictions(true);
            try {
                const { data, error } = await supabase
                    .from('quiniela_predictions')
                    .select('id, name, gender, date')
                    .eq('invitation_slug', 'carlos-y-frida')
                    .order('created_at', { ascending: false });

                if (!error && data && data.length > 0) {
                    setPredictions(data as PredictionItem[]);
                }
            } catch (e) {
                console.warn('Could not fetch predictions from Supabase, using defaults', e);
            } finally {
                setLoadingPredictions(false);
            }
        }
    };

    useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem('quiniela_carlos_frida');
            if (saved) {
                setIsSubmitted(true);
            }
            fetchPredictions();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !gender || !date) return;

        setIsSubmitting(true);
        const newPrediction: PredictionItem = { name, gender, date };

        if (isSupabaseConfigured) {
            try {
                await supabase.from('quiniela_predictions').insert([{
                    invitation_slug: 'carlos-y-frida',
                    name,
                    gender,
                    date
                }]);
            } catch (err) {
                console.error('Error saving to Supabase:', err);
            }
        }

        // Save locally
        localStorage.setItem('quiniela_carlos_frida', JSON.stringify(newPrediction));
        setIsSubmitted(true);
        setIsSubmitting(false);
        fetchPredictions();
    };

    const handleClear = () => {
        localStorage.removeItem('quiniela_carlos_frida');
        setIsSubmitted(false);
        setName('');
        setGender(null);
        setDate('');
    };

    const formatGenderLabel = (g: string) => {
        if (g === 'niño') return '👦 Niño';
        if (g === 'niña') return '👧 Niña';
        return '❓ Sorpresa';
    };

    const formatDateLabel = (d: string) => {
        if (!d) return '';
        try {
            const parts = d.split('-');
            if (parts.length === 3) {
                const day = parseInt(parts[2], 10);
                return `${day} Ene`;
            }
        } catch {
            // fallback
        }
        return d;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-stone-100 rounded-full text-stone-500 hover:bg-stone-200 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 sm:p-8">
                    {!isSubmitted ? (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-serif text-stone-800 mb-2">¡Haz tu Predicción! 👶</h2>
                                <p className="text-stone-500 text-sm">Quiniela Familiar Carlos & Frida</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Tu Nombre o Apodo
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-stone-400" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow bg-stone-50 text-stone-800 placeholder-stone-400"
                                            placeholder="Ej. Tía Rosa"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-3">
                                        ¿Qué crees que será?
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { id: 'niño', label: 'Niño', emoji: '👦' },
                                            { id: 'niña', label: 'Niña', emoji: '👧' },
                                            { id: 'sorpresa', label: 'Sorpresa', emoji: '❓' }
                                        ].map((g) => (
                                            <button
                                                key={g.id}
                                                type="button"
                                                onClick={() => setGender(g.id as any)}
                                                className={`py-3 px-2 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all
                                                    ${gender === g.id 
                                                        ? 'border-amber-500 bg-amber-50 text-amber-700' 
                                                        : 'border-stone-200 bg-white text-stone-500 hover:border-amber-200'
                                                    }`}
                                            >
                                                <span className="text-2xl">{g.emoji}</span>
                                                <span className="text-xs font-medium">{g.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Fecha estimada de nacimiento
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Calendar className="h-5 w-5 text-stone-400" />
                                        </div>
                                        <input
                                            type="date"
                                            required
                                            min="2027-01-01"
                                            max="2027-01-31"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow bg-stone-50 text-stone-800"
                                        />
                                    </div>
                                    <p className="text-xs text-stone-500 mt-2 ml-1">Debe ser en Enero de 2027.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!name || !gender || !date || isSubmitting}
                                    className="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                                        disabled:bg-stone-300 disabled:cursor-not-allowed
                                        bg-amber-600 hover:bg-amber-700 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Enviar mi Predicción
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6 space-y-6">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-serif text-stone-800">¡Gracias!</h2>
                            <p className="text-stone-600 text-lg">Tu predicción ha sido guardada.</p>
                            
                            <div className="bg-stone-50 p-4 rounded-2xl text-left border border-stone-100 max-h-60 overflow-y-auto">
                                <h3 className="font-semibold text-stone-800 mb-3 text-sm uppercase tracking-wider flex items-center gap-2 sticky top-0 bg-stone-50 py-1">
                                    <Gift className="w-4 h-4 text-amber-500" />
                                    Predicciones de la familia {loadingPredictions && <Loader2 className="w-3 h-3 animate-spin text-stone-400" />}
                                </h3>
                                <div className="space-y-3">
                                    {predictions.map((p, idx) => (
                                        <div key={p.id || idx} className="flex justify-between items-center text-sm border-b border-stone-200 pb-2 last:border-0">
                                            <span className="text-stone-700 font-medium">{p.name}</span>
                                            <span className="text-stone-500 font-mono text-xs">
                                                {formatGenderLabel(p.gender)} - {formatDateLabel(p.date)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="pt-4 flex flex-col gap-2">
                                <button 
                                    onClick={onClose}
                                    className="w-full py-3 bg-stone-100 text-stone-700 font-semibold rounded-xl hover:bg-stone-200 transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
