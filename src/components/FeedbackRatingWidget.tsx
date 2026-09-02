import { useState, useEffect } from 'react';
import { X, Heart, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { trackEvent } from '../lib/analytics';

type Rating = 'dislike' | 'neutral' | 'like' | 'love';

export default function FeedbackRatingWidget() {
    const [visible, setVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useToast();

    useEffect(() => {
        // Check if user already submitted feedback today
        const lastRating = localStorage.getItem('invitto_user_feedback_timestamp');
        if (!lastRating) {
            // Delay widget appearance slightly so it doesn't interrupt page load
            const timer = setTimeout(() => setVisible(true), 2500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleSelectRating = (rating: Rating, label: string) => {
        setSubmitted(true);
        localStorage.setItem('invitto_user_feedback_timestamp', Date.now().toString());
        localStorage.setItem('invitto_user_feedback_val', rating);

        trackEvent('user_feedback', { rating, label });

        toast.success(`¡Gracias por tu calificación (${label})! 💖`);

        // Auto close after 3 seconds
        setTimeout(() => {
            setVisible(false);
        }, 3000);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-5 right-5 z-[99] animate-in slide-in-from-bottom duration-500 max-w-xs w-full">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border border-stone-200/80 relative overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={() => setVisible(false)}
                    className="absolute top-3 right-3 text-stone-300 hover:text-stone-500 p-1 rounded-full hover:bg-stone-100 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>

                {!submitted ? (
                    <div className="space-y-4">
                        <div className="pr-6">
                            <h4 className="text-xs font-bold text-[#1B2E1D] flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5 text-[#DF3B94]" />
                                ¿Cómo te está quedando tu invitación?
                            </h4>
                        </div>

                        <div className="grid grid-cols-4 gap-2 pt-1">
                            {([
                                { key: 'dislike' as const, emoji: '😒', label: 'No me gusta', color: 'hover:bg-rose-50 hover:border-rose-200' },
                                { key: 'neutral' as const, emoji: '😐', label: 'Neutral', color: 'hover:bg-amber-50 hover:border-amber-200' },
                                { key: 'like' as const, emoji: '😊', label: 'Me gusta', color: 'hover:bg-emerald-50 hover:border-emerald-200' },
                                { key: 'love' as const, emoji: '😻', label: 'Me encantó', color: 'hover:bg-pink-50 hover:border-pink-200' },
                            ]).map((opt) => (
                                <button
                                    key={opt.key}
                                    onClick={() => handleSelectRating(opt.key, opt.label)}
                                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border border-stone-100 bg-stone-50/50 hover:scale-105 transition-all text-center group ${opt.color}`}
                                >
                                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{opt.emoji}</span>
                                    <span className="text-[8px] font-bold text-stone-500 group-hover:text-stone-800 leading-tight">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="py-2 text-center space-y-2 animate-in zoom-in duration-300">
                        <div className="h-10 w-10 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Heart className="h-5 w-5 fill-current" />
                        </div>
                        <p className="text-xs font-bold text-[#1B2E1D]">¡Tu opinión nos ayuda a mejorar!</p>
                        <p className="text-[10px] text-stone-400">Gracias por formar parte de Invitto.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
