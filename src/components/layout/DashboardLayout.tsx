import { useAuth } from '../../context/AuthContext';
import { LogOut, Home, Users, Settings, Layout, Menu, X, Sparkles, ChevronRight, PartyPopper, Check } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from '../../lib/supabase';

const GuidedTour = lazy(() => import('../dashboard/GuidedTour'));

export default function DashboardLayout() {
    const { signOut, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hasEvents, setHasEvents] = useState<boolean | null>(null);
    const [hasPlan, setHasPlan] = useState<boolean>(false);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        if (!user) return;
        const dismissed = localStorage.getItem(`onboarding_dismissed_${user.id}`);
        if (dismissed) { setShowOnboarding(false); return; }

        supabase.from('events').select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .then(({ count }) => {
                const noEvents = (count ?? 0) === 0;
                setHasEvents(!noEvents);
                // Banner only shows when user already has at least one event.
                // When the dashboard is empty, the big empty state on DashboardHome
                // already carries the onboarding message — showing both creates noise.
                setShowOnboarding(!noEvents);
            });

        supabase.from('profiles').select('plan_tier')
            .eq('id', user.id)
            .single()
            .then(({ data }) => {
                if (data && data.plan_tier !== 'free') {
                    setHasPlan(true);
                }
            });
    }, [user, location.pathname]);

    const dismissOnboarding = () => {
        if (user) localStorage.setItem(`onboarding_dismissed_${user.id}`, 'true');
        setShowOnboarding(false);
    };

    const navItems = [
        { name: 'Inicio', href: '/dashboard', icon: Home },
        { name: 'Mis Invitaciones', href: '/dashboard/events', icon: Layout },
        { name: 'Lista de Invitados', href: '/dashboard/rsvps', icon: Users },
        { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
    ];

    const isActive = (path: string) => location.pathname === path;

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 bg-[#222B38] text-white fixed h-full z-50 transition-all duration-300">
                <div className="p-8">
                    <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
                        <img src="/logo.png" alt="Invitto" className="h-8 w-auto object-contain brightness-0 invert" />
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-8">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-4 px-4 py-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all ${
                                    isActive(item.href)
                                        ? 'bg-white/10 text-white shadow-lg border border-white/5'
                                        : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Icon className={`h-5 w-5 ${isActive(item.href) ? 'text-[#DF3B94]' : ''}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-8 mt-auto border-t border-white/5">
                    <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold ring-2 ring-white/10">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] uppercase font-bold tracking-widest truncate">{user?.email?.split('@')[0]}</p>
                            <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-4 px-4 py-4 text-xs uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 w-full bg-[#222B38] text-white z-[60] px-6 h-16 flex items-center justify-between border-b border-white/5">
                <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
                    <img src="/logo.png" alt="Invitto" className="h-7 w-auto object-contain brightness-0 invert" />
                </Link>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Mobile Sidebar */}
            <aside className={`lg:hidden fixed left-0 top-0 h-full w-72 bg-[#1B2E1D] text-white z-[60] flex flex-col transition-transform duration-500 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <div className="p-8 h-16 flex items-center border-b border-white/5">
                    <span className="text-xl font-serif italic tracking-tighter">Invitto</span>
                </div>
                <nav className="flex-1 p-4 space-y-2 mt-8">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-4 px-4 py-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all ${
                                    isActive(item.href) ? 'bg-white/10 text-white' : 'text-white/50'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-8 mt-auto border-t border-white/5">
                    <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="h-10 w-10 rounded-full bg-stone-700 flex items-center justify-center text-xs font-bold ring-2 ring-white/10">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] uppercase font-bold tracking-widest truncate">{user?.email?.split('@')[0]}</p>
                            <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-4 px-4 py-4 text-xs uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 min-h-screen relative p-3 xs:p-4 md:p-12 lg:p-20 pt-20 xs:pt-24 lg:pt-20 overflow-x-hidden">
                {/* Header Context */}
                <div className="max-w-7xl mx-auto">

                    {/* ── Persistent Onboarding Banner ── */}
                    {showOnboarding && (
                        <div className="mb-8 bg-gradient-to-r from-[#1B2E1D] to-[#2D4A30] rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-lg relative overflow-hidden">
                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#BD7474]/10 rounded-full blur-2xl pointer-events-none" />

                            <div className="p-2.5 bg-white/10 rounded-xl flex-shrink-0">
                                <PartyPopper className="h-6 w-6 text-[#BD7474]" />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="h-3 w-3 text-[#BD7474]" />
                                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#BD7474]">Primeros Pasos</span>
                                </div>
                                <p className="font-serif text-base leading-tight mb-3">Configura tu primer evento para empezar a recibir confirmaciones</p>

                                {/* Step indicators */}
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        { label: 'Cuenta creada', done: true },
                                        { label: 'Crear evento', done: hasEvents === true, href: '/dashboard/new' },
                                        { label: 'Activar plan', done: hasPlan, href: hasEvents ? '/planes' : undefined },
                                        { label: 'Agregar invitados', done: false, href: '/dashboard/rsvps' },
                                    ].map((step, i) => (
                                        step.href && !step.done ? (
                                            <Link key={i} to={step.href}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#BD7474] rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-[#A05C5C] transition-all"
                                            >
                                                <ChevronRight className="h-3 w-3" />
                                                {step.label}
                                            </Link>
                                        ) : (
                                            <span key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                                                step.done ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-white/10 text-white/40'
                                            }`}>
                                                {step.done && <Check className="h-3 w-3" />}
                                                {step.label}
                                            </span>
                                        )
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={dismissOnboarding}
                                className="absolute top-3 right-3 p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
                                title="Cerrar"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    <Suspense fallback={null}>
                        <GuidedTour />
                    </Suspense>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
