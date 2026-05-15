import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Save, User, MessageCircle, Mail, ShieldCheck, Sparkles, Loader2, ArrowRight } from 'lucide-react';

export default function SettingsPage() {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [profile, setProfile] = useState({
        full_name: '',
        whatsapp_number: '',
        plan_tier: 'free',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                if (error && error.code !== 'PGRST116') throw error;
                
                const profileData = data || { full_name: '', whatsapp_number: '', plan_tier: 'free' };

                setProfile({
                    full_name: profileData.full_name || '',
                    whatsapp_number: (profileData as any).whatsapp_number || '',
                    plan_tier: profileData.plan_tier || 'free',
                });
            } catch (error: any) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: profile.full_name,
                    whatsapp_number: profile.whatsapp_number,
                    plan_tier: profile.plan_tier,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;
            setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            console.error('Error saving profile:', error);
            setMessage({ type: 'error', text: 'Error al actualizar: ' + error.message });
        } finally {
            setSaving(false);
        }
    };

    const getPlanLabel = (tier: string) => {
        const labels: Record<string, string> = {
            'free':         'CUENTA GRATUITA',
            'clasico':      'PLAN CLÁSICA',
            'classic':      'PLAN CLÁSICA',
            'pro':          'PLAN PRO',
            'premium':      'DISEÑO PRO',
            'personalized': 'DISEÑO PRO',
            'concierge':    'PLAN CONCIERGE',
        };
        return labels[tier] || 'CUENTA GRATUITA';
    };

    return (
        <div id="settings-card" className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-serif text-[#1B2E1D]">Configuración</h1>
                    <p className="text-stone-400 font-light italic text-lg">Administra tu perfil.</p>
                    
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-stone-50 border border-stone-200 rounded-2xl">
                        <Sparkles className="h-4 w-4 text-stone-500" />
                        <span className="text-[10px] uppercase font-black tracking-widest text-stone-600">{getPlanLabel(profile.plan_tier)}</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    {/* Perfil */}
                    <form onSubmit={handleSave} className="bg-white rounded-[3rem] border border-stone-100 p-10 shadow-sm space-y-8 relative overflow-hidden h-full">
                        <div className="space-y-6">
                            <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-stone-400">Información del Perfil</h3>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
                                        <User className="h-4 w-4 text-[#BD7474]" /> Nombre Completo
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B2E1D]/10 transition-all font-serif text-lg"
                                        placeholder="Ej. Carlos Lopez"
                                        value={profile.full_name}
                                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
                                        <MessageCircle className="h-4 w-4 text-emerald-500" /> WhatsApp Concierge
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">+</span>
                                        <input 
                                            type="tel" 
                                            className="w-full p-4 pl-8 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B2E1D]/10 transition-all font-serif text-lg"
                                            placeholder="521234567890"
                                            value={profile.whatsapp_number}
                                            onChange={(e) => setProfile({...profile, whatsapp_number: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-widest animate-in slide-in-from-top-2 duration-300 ${
                                message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                                {message.text}
                            </div>
                        )}

                        <div className="pt-8 border-t border-stone-50 flex justify-end mt-auto">
                            <Button 
                                type="submit" 
                                disabled={saving}
                                className="px-12 py-4 bg-[#1B2E1D] hover:bg-[#2D312E] text-white rounded-2xl shadow-xl shadow-stone-200"
                            >
                                {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                                {saving ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="space-y-8">
                    <div className="bg-[#1B2E1D] text-white rounded-[2.5rem] p-8 space-y-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[5rem] group-hover:scale-110 transition-transform" />
                        <div className="flex justify-between items-start relative z-10">
                            <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40">Cuenta Activa</h3>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`text-[8px] font-bold px-3 py-1 rounded-full ${
                                    ['premium', 'concierge'].includes(profile.plan_tier) ? 'bg-[#BD7474] shadow-[0_0_15px_-5px_#BD7474]' : 'bg-white/10'
                                } tracking-widest uppercase`}>
                                    {getPlanLabel(profile.plan_tier)}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
                                    <Mail className="h-3 w-3 text-[#BD7474]" />
                                </div>
                                <span className="text-xs font-medium truncate opacity-70">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[#25D366]">
                                <div className="h-8 w-8 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                                    <ShieldCheck className="h-4 w-4" />
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-widest">Verificado</span>
                            </div>
                        </div>
                        
                        {profile.plan_tier?.toLowerCase() !== 'concierge' && (
                            <div className="pt-4 relative z-10">
                                <Link 
                                    to="/planes" 
                                    className="group block text-center p-4 rounded-2xl bg-white text-[#1B2E1D] hover:bg-[#BD7474] hover:text-white transition-all text-[9px] font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-[#BD7474]/40 hover:-translate-y-1"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <Sparkles className="h-3 w-3 animate-pulse" />
                                        Mejorar mi Experiencia
                                    </span>
                                </Link>
                                <p className="text-[8px] text-center mt-4 text-white/30 font-bold uppercase tracking-widest">
                                    Desbloquea todas las funciones
                                </p>
                            </div>
                        )}
                    </div>

                    <Link 
                        to={profile.plan_tier === 'concierge' ? "https://wa.me/521234567890" : "/concierge-service"}
                        target={profile.plan_tier === 'concierge' ? "_blank" : "_self"}
                        className="block group"
                    >
                        <div className="bg-[#FDFBF7] rounded-[2.5rem] p-10 border border-stone-100 text-stone-900 shadow-sm space-y-4 hover:border-[#BD7474]/30 hover:shadow-xl transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="h-4 w-4 text-[#BD7474]" />
                            </div>
                            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MessageCircle className="h-6 w-6 text-emerald-600" />
                            </div>
                            <h4 className="text-sm font-bold uppercase tracking-widest italic text-emerald-900">
                                {profile.plan_tier === 'concierge' ? 'Tu Concierge Dedicado' : 'Invitto Concierge'}
                            </h4>
                            <p className="text-sm leading-relaxed text-stone-500 font-light">
                                {profile.plan_tier === 'concierge' 
                                    ? 'Estamos listos para asistirte en todo momento. Haz clic para hablar con tu equipo de soporte VIP.' 
                                    : '¿Necesitas ayuda o quieres que gestionemos todo tu evento por ti? Descubre el nivel Concierge.'}
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
