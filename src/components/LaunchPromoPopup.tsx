import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { trackEvent } from '../lib/analytics';
import { useAuth } from '../context/AuthContext';

const COUPON_CODE = 'INVITTO26PRO';
const DISMISSED_STORAGE_KEY = 'invitto_promo_dismissed_at';
const DISMISSED_TTL_HOURS = 24;
const TIME_ON_PRICING_MS = 30_000; // 30s
const SCROLL_TRIGGER_PERCENT = 0.6; // 60% scroll

interface CouponStatus {
    available: boolean;
    remaining: number;
    max: number;
}

// Routes where the promo is allowed to surface.
// Logged-in users, auth pages, checkout, dashboard and invitation pages are excluded.
const ALLOWED_ROUTES = [
    '/',
    '/planes',
    '/ejemplos',
    '/concierge-service',
    '/comparativas',
];
const ALLOWED_PREFIXES = [
    '/invitaciones-digitales-',
    '/invitto-vs-',
    '/planes/',
];

function isRouteEligible(pathname: string): boolean {
    if (ALLOWED_ROUTES.includes(pathname)) return true;
    return ALLOWED_PREFIXES.some((p) => pathname.startsWith(p));
}

function wasRecentlyDismissed(): boolean {
    if (typeof window === 'undefined') return false;
    const raw = localStorage.getItem(DISMISSED_STORAGE_KEY);
    if (!raw) return false;
    const dismissedAt = parseInt(raw, 10);
    if (isNaN(dismissedAt)) return false;
    const hoursSince = (Date.now() - dismissedAt) / (1000 * 60 * 60);
    return hoursSince < DISMISSED_TTL_HOURS;
}

export default function LaunchPromoPopup() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [status, setStatus] = useState<CouponStatus | null>(null);
    const [visible, setVisible] = useState(false);
    const triggeredRef = useRef(false);

    const eligible = isRouteEligible(location.pathname) && !user && !wasRecentlyDismissed();

    // Fetch coupon availability once when the user lands on an eligible page
    useEffect(() => {
        if (!eligible || status) return;
        let cancelled = false;

        supabase.functions
            .invoke('coupon-status', { body: { code: COUPON_CODE } })
            .then(({ data }) => {
                if (cancelled) return;
                if (data && data.available) {
                    setStatus(data as CouponStatus);
                }
            })
            .catch(() => {
                /* Silently fail — promo is non-critical */
            });

        return () => { cancelled = true; };
    }, [eligible, status]);

    // Attach exit-intent + scroll + time-on-page triggers once the coupon is confirmed available
    useEffect(() => {
        if (!status?.available || visible || triggeredRef.current || !eligible) return;

        const trigger = (reason: string) => {
            if (triggeredRef.current) return;
            triggeredRef.current = true;
            setVisible(true);
            trackEvent('promo_view', {
                coupon: COUPON_CODE,
                trigger: reason,
                remaining: status.remaining,
                path: location.pathname,
            });
        };

        // Exit-intent: cursor leaves through the top of the viewport
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY < 10) trigger('exit_intent');
        };

        // Scroll: user reaches 60% of the page
        const handleScroll = () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            if (total <= 0) return;
            const pct = window.scrollY / total;
            if (pct >= SCROLL_TRIGGER_PERCENT) trigger('scroll_60');
        };

        // Time-on-pricing: user spends 30s on /planes specifically
        let timeoutId: number | undefined;
        if (location.pathname === '/planes') {
            timeoutId = window.setTimeout(() => trigger('time_on_pricing'), TIME_ON_PRICING_MS);
        }

        document.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('scroll', handleScroll);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [status, visible, eligible, location.pathname]);

    const handleDismiss = () => {
        localStorage.setItem(DISMISSED_STORAGE_KEY, Date.now().toString());
        setVisible(false);
        trackEvent('promo_dismiss', {
            coupon: COUPON_CODE,
            remaining: status?.remaining,
            path: location.pathname,
        });
    };

    const handleApply = () => {
        trackEvent('promo_apply', {
            coupon: COUPON_CODE,
            remaining: status?.remaining,
            path: location.pathname,
        });
        // Mark dismissed so it doesn't reappear during the same session
        localStorage.setItem(DISMISSED_STORAGE_KEY, Date.now().toString());
        setVisible(false);
        navigate(`/dashboard/new?plan=pro&coupon=${COUPON_CODE}`);
    };

    if (!visible || !status?.available) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300"
            role="dialog"
            aria-modal="true"
            aria-labelledby="promo-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#1B2E1D]/70 backdrop-blur-sm"
                onClick={handleDismiss}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-500">
                <button
                    onClick={handleDismiss}
                    className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-900 transition-colors"
                    aria-label="Cerrar promoción"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="text-center space-y-5">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#DF3B94]/10 rounded-full text-[10px] uppercase font-black tracking-widest text-[#DF3B94]">
                        Lanzamiento
                    </div>

                    {/* Title */}
                    <h2 id="promo-title" className="text-3xl md:text-4xl font-serif text-[#1B2E1D] leading-tight">
                        ¿De las primeras 10 en probar <span className="italic text-[#BD7474]">Invitto Pro</span>?
                    </h2>

                    {/* Body */}
                    <p className="text-stone-500 font-light leading-relaxed text-sm md:text-base">
                        Plan Pro <strong className="text-[#1B2E1D]">gratis</strong> (valor $1,699 MXN) a cambio de un testimonio honesto cuando termine tu evento.
                    </p>

                    {/* Counter */}
                    <div className="py-4 border-y border-stone-100">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400 mb-1">Disponibles</p>
                        <p className="text-3xl font-serif text-[#1B2E1D]">
                            {status.remaining}<span className="text-stone-300 text-xl"> / {status.max}</span>
                        </p>
                    </div>

                    {/* CTAs */}
                    <button
                        onClick={handleApply}
                        className="w-full px-8 py-4 bg-[#1B2E1D] text-white rounded-2xl text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-[#2D312E] transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                        Aplicar cupón <ArrowRight className="h-4 w-4" />
                    </button>

                    <button
                        onClick={handleDismiss}
                        className="block w-full text-[10px] uppercase font-bold tracking-widest text-stone-400 hover:text-[#1B2E1D] transition-colors"
                    >
                        No, gracias
                    </button>

                    <p className="text-[9px] text-stone-300 italic pt-2">
                        Cupón <strong>{COUPON_CODE}</strong> · Válido solo para Plan Pro · Sujeto a entregar testimonio post-evento.
                    </p>
                </div>
            </div>
        </div>
    );
}
