import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Gift, User, Calendar, Save } from 'lucide-react';

interface QuinielaModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function QuinielaModal({ isOpen, onClose }: QuinielaModalProps) {
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'niño' | 'niña' | 'sorpresa' | null>(null);
    const [date, setDate] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem('quiniela_carlos_frida');
            if (saved) {
                setIsSubmitted(true);
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !gender || !date) return;
        
        localStorage.setItem('quiniela_carlos_frida', JSON.stringify({ name, gender, date }));
        setIsSubmitted(true);
    };

    const handleClear = () => {
        localStorage.removeItem('quiniela_carlos_frida');
        setIsSubmitted(false);
        setName('');
        setGender(null);
        setDate('');
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
                                    disabled={!name || !gender || !date}
                                    className="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                                        disabled:bg-stone-300 disabled:cursor-not-allowed
                                        bg-amber-600 hover:bg-amber-700 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Save className="w-5 h-5" />
                                    Enviar mi Predicción
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
                            
                            <div className="bg-stone-50 p-4 rounded-2xl text-left border border-stone-100">
                                <h3 className="font-semibold text-stone-800 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                                    <Gift className="w-4 h-4 text-amber-500" />
                                    Otras predicciones de la familia
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm border-b border-stone-200 pb-2">
                                        <span className="text-stone-600 font-medium">Tío Roberto</span>
                                        <span className="text-stone-500">👦 Niño - 15 Ene</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-stone-200 pb-2">
                                        <span className="text-stone-600 font-medium">Abuela Carmen</span>
                                        <span className="text-stone-500">👧 Niña - 10 Ene</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pb-1">
                                        <span className="text-stone-600 font-medium">Primo Alex</span>
                                        <span className="text-stone-500">❓ Sorpresa - 22 Ene</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-4 flex flex-col gap-2">
                                <button 
                                    onClick={onClose}
                                    className="w-full py-3 bg-stone-100 text-stone-700 font-semibold rounded-xl hover:bg-stone-200 transition-colors"
                                >
                                    Cerrar
                                </button>
                                <button 
                                    onClick={handleClear}
                                    className="text-xs text-stone-400 hover:text-stone-600 mt-2"
                                >
                                    (Dev) Borrar mi voto
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
