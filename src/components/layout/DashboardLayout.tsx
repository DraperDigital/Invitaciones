import { useAuth } from '../../context/AuthContext';
import { LogOut, Home, Users, Settings, Layout, Menu, X, QrCode, ClipboardList } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from '../../lib/supabase';
import { getPlatformContext } from '../../utils/context';

const GuidedTour = lazy(() => import('../dashboard/GuidedTour'));

export default function DashboardLayout() {
    const { signOut, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hasEvents, setHasEvents] = useState<boolean | null>(null);
    const [hasPlan, setHasPlan] = useState<boolean>(false);
    const [showOnboarding, setShowOnboarding] = useState(false);

    const { isCorporate } = getPlatformContext();

    // Cierre automático del menú móvil al cambiar de ruta
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Bloqueo del scroll de la página mientras el menú móvil está abierto
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        if (!user) return;
        const dismissed = localStorage.getItem(`onboarding_dismissed_${user.id}`);
        if (dismissed) { setShowOnboarding(false); return; }

        supabase.from('events').select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .then(({ count }) => {
                const noEvents = (count ?? 0) === 0;
                setHasEvents(!noEvents);
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
        { name: isCorporate ? 'Eventos & Cumbres' : 'Mis Invitaciones', href: '/dashboard/events', icon: Layout },
        { name: isCorporate ? 'Asistentes & Acreditación' : 'Lista de Invitados', href: '/dashboard/rsvps', icon: Users },
        { name: isCorporate ? 'Check-in QR Puerta' : 'Escanear QR', href: '/dashboard/checkin', icon: QrCode },
        { name: 'Planeación', href: '/dashboard/planeacion', icon: ClipboardList },
        { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
    ];

    const isActive = (path: string) => location.pathname === path;

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-[#222B38] w-full overflow-x-hidden">
            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex flex-col w-72 ${isCorporate ? 'bg-[#0F172A]' : 'bg-[#222B38]'} text-white fixed h-full z-50 transition-all duration-300 border-r border-slate-800`}>
                <div className="p-6 md:p-8">
                    <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
                        {isCorporate ? (
                            <img src="/logo-one-white.png?v=1" alt="Invitto One" className="h-10 w-auto object-contain" />
                        ) : (
                            <img src="/logo.png?v=3" alt="Invitto" className="h-8 md:h-9 w-auto object-contain brightness-0 invert" />
                        )}
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
                                    active
                                        ? isCorporate 
                                            ? 'bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/30 shadow-md'
                                            : 'bg-white/10 text-white border border-white/10 shadow-md'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Icon className={`h-5 w-5 ${active ? (isCorporate ? 'text-[#60A5FA]' : 'text-[#DF3B94]') : 'text-slate-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 mt-auto border-t border-slate-800">
                    {user ? (
                        <>
                            <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-2xl border border-white/5">
                                <div className={`h-10 w-10 rounded-xl ${isCorporate ? 'bg-[#2563EB]' : 'bg-[#DF3B94]'} text-white flex items-center justify-center text-xs font-bold uppercase`}>
                                    {user?.email?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold truncate text-slate-200">{user?.email?.split('@')[0]}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs uppercase font-bold tracking-wider transition-all cursor-pointer"
                            >
                                <LogOut className="h-4 w-4" />
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <div className="space-y-3">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
                                <p className="text-xs font-semibold text-white">Modo Demo Invitto</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Explorando el Planeador</p>
                            </div>
                            <Link
                                to="/login"
                                className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${isCorporate ? 'bg-[#2563EB] hover:bg-[#1D4ED8]' : 'bg-[#DF3B94] hover:bg-[#C22D7F]'} text-white rounded-xl text-xs uppercase font-bold tracking-wider transition-all shadow-md`}
                            >
                                Iniciar Sesión / Registro
                            </Link>
                            <Link
                                to="/"
                                className="w-full flex items-center justify-center gap-2 px-4 py-1.5 text-slate-400 hover:text-white text-xs transition-colors"
                            >
                                ← Volver al inicio
                            </Link>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-72 flex flex-col min-w-0 w-full overflow-x-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden bg-[#222B38] text-white px-4 h-16 flex items-center justify-between sticky top-0 z-[60] border-b border-slate-800">
                    <Link to="/" className="flex items-center gap-2">
                        {isCorporate ? (
                            <img src="/logo-one-white.png?v=1" alt="Invitto One" className="h-8 w-auto object-contain" />
                        ) : (
                            <img src="/logo.png?v=3" alt="Invitto" className="h-7 w-auto object-contain brightness-0 invert" />
                        )}
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-slate-300 hover:text-white cursor-pointer"
                        aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </header>

                {/* Mobile Dropdown Menu (Fijo bajo el header con backdrop oscuro) */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 top-16 z-50">
                        {/* Fondo oscuro detrás que lo cierra al tocar */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200 cursor-pointer"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-hidden="true"
                        />
                        {/* Panel del menú fijo bajo el header */}
                        <div className="relative bg-[#222B38] border-b border-slate-800 px-6 py-6 space-y-3 z-10 shadow-2xl max-h-[calc(100vh-6rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
                                            active
                                                ? 'bg-white/10 text-white border border-white/10 shadow-md'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <Icon className={`h-5 w-5 ${active ? 'text-[#DF3B94]' : 'text-slate-400'}`} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                            <div className="pt-4 border-t border-slate-800">
                                {user ? (
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:text-rose-300 text-xs uppercase font-bold tracking-wider rounded-xl hover:bg-rose-500/10 transition-all cursor-pointer"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Cerrar Sesión
                                    </button>
                                ) : (
                                    <div className="space-y-2">
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${isCorporate ? 'bg-[#2563EB]' : 'bg-[#DF3B94]'} text-white rounded-xl text-xs uppercase font-bold tracking-wider`}
                                        >
                                            Iniciar Sesión / Registro
                                        </Link>
                                        <Link
                                            to="/"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-400 text-xs"
                                        >
                                            ← Volver al inicio
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Page Slot */}
                <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl w-full mx-auto min-w-0">
                    {/* Onboarding Tour Banner */}
                    {showOnboarding && hasEvents !== null && (
                        <Suspense fallback={null}>
                            <GuidedTour
                                onComplete={dismissOnboarding}
                                onDismiss={dismissOnboarding}
                                hasEvents={hasEvents}
                                hasPlan={hasPlan}
                            />
                        </Suspense>
                    )}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
