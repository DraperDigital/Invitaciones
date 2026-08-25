import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Save, User, MessageCircle, Mail, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { getPlatformContext } from '../../utils/context';

export default function SettingsPage() {
    const { user } = useAuth();
    const { isCorporate } = getPlatformContext();
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
                
                let highestPlan = data?.plan_tier || 'free';

                const { data: eventsData } = await supabase.from('events').select('theme_config').eq('user_id', user.id);
                if (eventsData && eventsData.length > 0) {
                    const ranks: Record<string, number> = { 'free': 0, 'clasico': 1, 'classic': 1, 'pro': 2, 'personalized': 2, 'premium': 3, 'concierge': 4 };
                    let currentMaxRank = ranks[highestPlan] || 0;
                    
                    for (const ev of eventsData) {
                        let tc = ev.theme_config;
                        if (typeof tc === 'string') { try { tc = JSON.parse(tc); } catch { tc = {}; } }
                        tc = tc || {};
                        const p = tc.plan_tier || (tc.isPremium ? 'premium' : tc.isPro ? 'pro' : 'clasico');
                        const r = ranks[p] || 0;
                        if (r > currentMaxRank) {
                            highestPlan = p;
                            currentMaxRank = r;
                        }
                    }
                }

                const profileData = data || { full_name: '', whatsapp_number: '' };

                setProfile({
                    full_name: profileData.full_name || '',
                    whatsapp_number: (profileData as any).whatsapp_number || '',
                    plan_tier: highestPlan,
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
        return labels[tier?.toLowerCase()] || 'PLAN PRO';
    };

    return (
        <div id="settings-card" className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20 font-sans text-[#222B38]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38]">Configuración</h1>
                    <p className="text-slate-500 font-normal text-base md:text-lg">Administra tu perfil y preferencia de cuenta.</p>
                </div>

                <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <Sparkles className={`h-4 w-4 ${isCorporate ? 'text-[#2563EB]' : 'text-[#DF3B94]'}`} />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">{getPlanLabel(profile.plan_tier)}</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {/* Perfil */}
                    <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-100 p-8 md:p-10 shadow-sm space-y-8 h-full flex flex-col justify-between">
                        <div className="space-y-6">
                            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">Información del Perfil</h3>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-slate-500">
                                        <User className={`h-4 w-4 ${isCorporate ? 'text-[#2563EB]' : 'text-[#DF3B94]'}`} /> Nombre Completo
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#DF3B94] focus:ring-1 focus:ring-[#DF3B94] transition-all text-sm font-normal text-[#222B38]"
                                        placeholder="Ej. Carlos López"
                                        value={profile.full_name}
                                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-slate-500">
                                        <MessageCircle className="h-4 w-4 text-emerald-600" /> WhatsApp
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+</span>
                                        <input 
                                            type="tel" 
                                            className="w-full p-3.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#DF3B94] focus:ring-1 focus:ring-[#DF3B94] transition-all text-sm font-normal text-[#222B38]"
                                            placeholder="525512345678"
                                            value={profile.whatsapp_number}
                                            onChange={(e) => setProfile({...profile, whatsapp_number: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider ${
                                message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}>
                                {message.text}
                            </div>
                        )}

                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={saving}
                                className={`px-8 py-3.5 ${
                                    isCorporate ? 'bg-[#2563EB] hover:bg-[#1D4ED8] shadow-[#2563EB]/20' : 'bg-[#DF3B94] hover:bg-[#C52A7C] shadow-[#DF3B94]/20'
                                } text-white rounded-xl text-xs uppercase font-bold tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2`}
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {saving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className={`${isCorporate ? 'bg-[#0F172A]' : 'bg-[#222B38]'} text-white rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden flex flex-col justify-between border border-slate-800`}>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">Cuenta Activa</h3>
                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                                    isCorporate ? 'bg-[#2563EB] text-white' : 'bg-[#DF3B94] text-white'
                                } uppercase tracking-wider`}>
                                    {getPlanLabel(profile.plan_tier)}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Mail className="h-4 w-4 text-slate-300" />
                                    </div>
                                    <span className="text-xs font-mono truncate text-slate-300">{user?.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-emerald-400">
                                    <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
                                    </div>
                                    <span className="text-xs uppercase font-bold tracking-wider">Verificado</span>
                                </div>
                            </div>
                        </div>

                        {profile.plan_tier?.toLowerCase() !== 'concierge' && (
                            <div className="pt-6 border-t border-slate-800 space-y-3">
                                <Link 
                                    to="/planes" 
                                    className={`block text-center p-3.5 rounded-xl ${
                                        isCorporate ? 'bg-[#2563EB] hover:bg-[#1D4ED8]' : 'bg-[#DF3B94] hover:bg-[#C52A7C]'
                                    } text-white transition-all text-xs font-bold uppercase tracking-widest shadow-lg active:scale-95`}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        Mejorar mi Plan
                                    </span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
