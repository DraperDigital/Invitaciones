import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/Seo';
import Breadcrumb, { type BreadcrumbItem } from '../../components/Breadcrumb';
import {
  ArrowRight, ChevronDown, CheckCircle2, XCircle, Menu, X,
  Check, ExternalLink
} from 'lucide-react';
import type { LandingPageData } from './data/landingData';
import { getTemplatesForCategory } from '../../lib/themePresets';

/** Derive breadcrumb trail from the landing slug. */
function breadcrumbsForSlug(slug: string, h1: string): BreadcrumbItem[] {
  if (slug.startsWith('invitto-vs-') || slug === 'invitaciones-digitales-vs-papel') {
    return [
      { label: 'Comparativas', href: '/comparativas' },
      { label: h1 },
    ];
  }
  return [
    { label: 'Ejemplos', href: '/ejemplos' },
    { label: h1 },
  ];
}

const ALL_EVENT_CROSS_LINKS = [
  { slug: 'invitaciones-digitales-boda', label: 'Bodas', icon: '💍', desc: 'Diseño elegante con control de pases y música' },
  { slug: 'invitaciones-digitales-xv-anos', label: 'XV Años', icon: '👑', desc: 'Vals, fotos, padrinos y pase con código QR' },
  { slug: 'invitaciones-digitales-cumpleanos', label: 'Cumpleaños', icon: '🎂', desc: 'Festejos para todas las edades sin caos de chats' },
  { slug: 'invitaciones-digitales-bautizo', label: 'Bautizos', icon: '🕊️', desc: 'Padrinos, iglesia, recepción y confirmación fácil' },
  { slug: 'invitaciones-digitales-primera-comunion', label: 'Primera Comunión', icon: '⛪', desc: 'Ceremonia solemne, mapas y confirmación familiar' },
  { slug: 'invitaciones-digitales-baby-shower', label: 'Baby Shower', icon: '🍼', desc: 'Mesa de regalos, dinámicas y confirmación tierna' },
  { slug: 'invitaciones-digitales-revelacion-de-genero', label: 'Revelación de Género', icon: '🎈', desc: 'Cuenta regresiva, team rosa o azul y ubicación' },
  { slug: 'invitaciones-digitales-graduacion', label: 'Graduaciones', icon: '🎓', desc: 'Pases de gala individuales y acceso con QR en puerta' },
];

export default function SEOLandingTemplate({ data }: { data: LandingPageData }) {
  const { user } = useAuth();
  const location = useLocation();

  // Non-event FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Phone Mockup interactive RSVP state
  const [rsvpConfirmed, setRsvpConfirmed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Envelope animation state for Boda
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  // Live countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Mobile Sticky bottom bar visibility
  const [showStickyBar, setShowStickyBar] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);

  // Build CTA links preserving utm_* and fbclid
  const buildCtaUrl = (basePath: string, eventType?: string) => {
    const params = new URLSearchParams(location.search);
    if (eventType) {
      params.set('tipo', eventType);
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const primaryCtaUrl = data.isEventLanding
    ? buildCtaUrl('/dashboard/new', data.eventType)
    : buildCtaUrl('/dashboard/new');

  const waUrl = `https://wa.me/5215650314529?text=${encodeURIComponent(
    data.waMessage || 'Hola, quiero información sobre las invitaciones digitales de Invitto'
  )}`;

  // Live Countdown ticker
  useEffect(() => {
    if (!data.phone?.targetDate) return;
    const target = new Date(data.phone.targetDate).getTime();

    const updateTicker = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateTicker();
    const interval = setInterval(updateTicker, 1000);
    return () => clearInterval(interval);
  }, [data.phone?.targetDate]);

  // Envelope opening timer on Boda
  useEffect(() => {
    if (data.theme?.key === 'boda') {
      const timer = setTimeout(() => {
        setEnvelopeOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [data.theme?.key]);

  // IntersectionObserver for Sticky Mobile Bar
  useEffect(() => {
    const targetHero = heroRef.current;
    if (!targetHero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(targetHero);
    return () => observer.disconnect();
  }, []);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handlePhoneRsvpClick = () => {
    const nextState = !rsvpConfirmed;
    setRsvpConfirmed(nextState);
    if (nextState && data.phone?.rsvpDoneToast) {
      showToast(data.phone.rsvpDoneToast);
    }
  };

  const breadcrumbs = breadcrumbsForSlug(data.slug, data.hero.h1);

  // If this is an Event Landing page, render the specialized 11-step sales structure
  if (data.isEventLanding && data.theme) {
    const th = data.theme;
    const recommended = data.recommendedPlan;
    const demos = data.demoCategory ? getTemplatesForCategory(data.demoCategory).slice(0, 3) : [];
    const otherEvents = ALL_EVENT_CROSS_LINKS.filter(ev => ev.slug !== data.slug);

    return (
      <div
        className="min-h-screen text-[#1C1C1C] transition-colors selection:bg-[#B8935A]/20"
        style={{
          backgroundColor: th.bg,
          color: th.ink,
          fontFamily: th.fontBody || "'Inter', sans-serif",
        }}
      >
        <Seo
          title={data.seo.title}
          description={data.seo.description}
          path={data.seo.path}
          jsonLd={data.jsonLd}
        />

        {/* ─── Header: Direct logo without capsule ──────────────────────── */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b" style={{ borderColor: th.line, backgroundColor: `${th.bg}E6` }}>
          <div className="mx-auto max-w-6xl px-4 md:px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <img src="/logo.png?v=3" alt="Invitto" className="h-8 md:h-9 w-auto object-contain" />
            </Link>

            <div className="flex items-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold hover:opacity-80 transition-opacity"
                style={{ color: th.muted }}
              >
                <span className="text-emerald-600 font-bold">💬</span>
                <span>¿Dudas? WhatsApp</span>
              </a>

              <Link
                to={primaryCtaUrl}
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95 shadow-sm"
                style={{
                  backgroundColor: th.btn,
                  color: th.btnInk,
                  boxShadow: `0 0 0 1px ${th.btnRing} inset`,
                }}
              >
                {data.hero.cta}
              </Link>
            </div>
          </div>
        </header>

        {/* ─── 1. HERO SECTION ────────────────────────────────────────────── */}
        <section ref={heroRef} className="pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden px-4 md:px-6">
          <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div
                className="text-xs font-bold tracking-widest uppercase inline-block"
                style={{ color: th.accentText }}
              >
                {data.eyebrow}
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.12] tracking-tight"
                style={{ fontFamily: th.fontHead || 'inherit' }}
              >
                {data.h1Prefix}
                <span className="italic" style={{ color: th.accent }}>
                  {data.h1Highlight}
                </span>
                {data.h1Suffix}
              </h1>

              <p className="text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: th.muted }}>
                {data.hero.subtitle}
              </p>

              <div className="pt-2 space-y-3">
                <Link
                  to={primaryCtaUrl}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold shadow-xl transition-all hover:-translate-y-0.5 active:scale-95"
                  style={{
                    backgroundColor: th.btn,
                    color: th.btnInk,
                    boxShadow: `0 0 0 1px ${th.btnRing} inset, 0 12px 28px -10px rgba(0,0,0,0.3)`,
                  }}
                >
                  <span>{data.hero.cta}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <p className="text-xs leading-relaxed" style={{ color: th.muted }}>
                  Ármala gratis y mírala terminada · <b style={{ color: th.ink }}>pagas solo al publicar</b> · desde $499 · garantía de 7 días
                </p>

                <div>
                  <a
                    href="#precio"
                    className="inline-block text-xs sm:text-sm font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity"
                    style={{ color: th.muted }}
                  >
                    Ver qué incluye y cuánto cuesta ↓
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Phone Mockup Stage */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              {/* Event Background Animation Elements */}
              {th.key === 'xv' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                  {[10, 85, 20, 75, 5, 90, 35, 65, 45, 15, 55, 88].map((left, idx) => (
                    <span
                      key={idx}
                      className="absolute block w-2.5 h-2.5 rounded-full animate-ping opacity-60"
                      style={{
                        backgroundColor: th.accent,
                        left: `${left}%`,
                        top: `${[10, 15, 38, 45, 68, 72, 5, 92, 96, 88, 6, 28][idx]}%`,
                        animationDuration: `${2 + (idx % 3)}s`,
                        animationDelay: `${idx * 0.25}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Phone Mockup Shell */}
              <div
                className="w-[280px] h-[560px] rounded-[42px] bg-[#0D0D0D] p-3 shadow-2xl relative z-10 select-none border-4 border-slate-900"
                style={{ boxShadow: '0 30px 60px -25px rgba(0,0,0,0.55)' }}
              >
                {/* Phone Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30" />

                {/* Inner Screen */}
                <div
                  className="w-full h-full rounded-[32px] overflow-hidden relative flex flex-col items-center justify-between p-6 text-center"
                  style={{ backgroundColor: th.bg, color: th.ink }}
                >
                  {/* Boda Envelope Animation Overlay */}
                  {th.key === 'boda' && (
                    <div
                      className={`absolute inset-0 z-20 pointer-events-none transition-all duration-700 ${
                        envelopeOpen ? 'opacity-0 translate-y-8' : 'opacity-100'
                      }`}
                    >
                      <div className="absolute inset-0 bg-[#EFE6D6]" />
                      <div
                        className="absolute left-0 right-0 top-0 h-[58%] bg-[#E6DAC4] transition-transform duration-700 origin-top"
                        style={{
                          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                          transform: envelopeOpen ? 'scaleY(-1)' : 'scaleY(1)',
                        }}
                      />
                      <div
                        className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center font-serif text-lg font-bold shadow-md transition-opacity duration-300"
                        style={{
                          backgroundColor: th.accent,
                          color: '#FAF7F2',
                          opacity: envelopeOpen ? 0 : 1,
                        }}
                      >
                        A&D
                      </div>
                    </div>
                  )}

                  {/* Top Eyebrow */}
                  <div className="pt-6 space-y-1">
                    {th.key === 'xv' && (
                      <div className="text-xl leading-none">👑</div>
                    )}
                    <div className="text-[10px] uppercase font-bold tracking-widest" style={{ color: th.accentText }}>
                      {data.phone?.topBadge}
                    </div>
                    <div
                      className="text-2xl sm:text-3xl font-semibold leading-tight"
                      style={{ fontFamily: th.fontHead || 'serif' }}
                    >
                      {data.phone?.title}
                    </div>
                    <div className="text-xs font-semibold tracking-wider pt-1 opacity-80">
                      {data.phone?.dateStr}
                    </div>
                  </div>

                  {/* Live Countdown in Phone */}
                  <div className="grid grid-cols-4 gap-1.5 w-full max-w-[210px] my-2">
                    {[
                      { val: timeLeft.days, lbl: 'días' },
                      { val: timeLeft.hours, lbl: 'hrs' },
                      { val: timeLeft.minutes, lbl: 'min' },
                      { val: timeLeft.seconds, lbl: 'seg' },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg p-1.5 border text-center"
                        style={{ borderColor: `${th.line}B3`, backgroundColor: `${th.bg2}66` }}
                      >
                        <span className="block text-sm font-bold leading-none">{item.val}</span>
                        <span className="block text-[8px] uppercase tracking-wider opacity-75">{item.lbl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Passes reservation */}
                  <div
                    className="w-full rounded-xl p-2.5 text-center text-xs space-y-0.5 border"
                    style={{ backgroundColor: `${th.bg2}99`, borderColor: th.line }}
                  >
                    <div className="font-bold">{data.phone?.guestName}</div>
                    <div className="text-[10px] opacity-75">{data.phone?.passesText}</div>
                  </div>

                  {/* Interactive RSVP Button */}
                  <div className="w-full pb-2">
                    <button
                      type="button"
                      onClick={handlePhoneRsvpClick}
                      className="w-full py-3 px-4 rounded-xl text-xs font-bold transition-all transform active:scale-95 shadow-sm"
                      style={{
                        backgroundColor: rsvpConfirmed ? '#2F7D4F' : th.btn,
                        color: rsvpConfirmed ? '#FFFFFF' : th.btnInk,
                      }}
                    >
                      {rsvpConfirmed ? '✓ ¡Confirmados! Los esperamos' : 'Confirmar asistencia'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Phone hint */}
              <p className="text-xs font-medium text-center mt-3" style={{ color: th.muted }}>
                ↑ Tócala: así confirman tus invitados
              </p>
            </div>
          </div>
        </section>

        {/* ─── 2. PROBLEMA (Dark/Strong Background) ───────────────────────── */}
        <section className="py-16 md:py-24 px-4 md:px-6" style={{ backgroundColor: th.dark, color: th.darkInk }}>
          <div className="mx-auto max-w-2xl space-y-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ fontFamily: th.fontHead || 'inherit' }}>
              {data.problemTitle}
            </h2>

            <ul className="space-y-4">
              {data.problemItems?.map((item, i) => (
                <li key={i} className="flex items-start gap-3.5 text-sm sm:text-base leading-relaxed">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: th.darkInk }}
                  >
                    ✕
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Visualizer for Boda (116 seats) */}
            {data.showSeatsStat && (
              <div className="rounded-2xl p-6 border space-y-4 mt-8" style={{ borderColor: 'rgba(255,255,255,0.18)', backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <p className="text-xs font-medium opacity-85">Así se ve una lista típica a 3 semanas de la boda:</p>
                <div className="flex gap-8 items-baseline">
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold font-serif">116</div>
                    <div className="text-xs opacity-75">invitaciones enviadas</div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold font-serif" style={{ color: th.accent }}>43</div>
                    <div className="text-xs opacity-75">sin responder</div>
                  </div>
                </div>

                <div className="grid grid-cols-[repeat(29,minmax(0,1fr))] gap-1 pt-2">
                  {Array.from({ length: 116 }).map((_, idx) => (
                    <span
                      key={idx}
                      className="aspect-square rounded-full block"
                      style={
                        idx >= 73
                          ? { border: `1.5px solid ${th.accent}`, backgroundColor: 'transparent' }
                          : { backgroundColor: 'currentColor', opacity: 0.7 }
                      }
                    />
                  ))}
                </div>
                <p className="text-xs opacity-80 pt-1">Y el salón te pide el número final la próxima semana.</p>
              </div>
            )}
          </div>
        </section>

        {/* ─── 3. RESULTADO ───────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 px-4 md:px-6">
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight" style={{ fontFamily: th.fontHead || 'inherit' }}>
              {data.outcomeTitle}
            </h2>

            <ul className="space-y-4 pt-2">
              {data.outcomeItems?.map((item, i) => (
                <li key={i} className="flex items-start gap-3.5 text-sm sm:text-base leading-relaxed">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-sm"
                    style={{ backgroundColor: th.btn, color: th.btnInk }}
                  >
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── 4. CÓMO FUNCIONA (3 Steps) ─────────────────────────────────── */}
        <section className="py-16 md:py-24 px-4 md:px-6" style={{ backgroundColor: th.bg2 }}>
          <div className="mx-auto max-w-4xl space-y-10">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: th.accentText }}>
                Así de simple
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ fontFamily: th.fontHead || 'inherit' }}>
                {data.stepsTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.salesSteps?.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-6 border flex flex-col justify-between space-y-4 shadow-sm"
                  style={{ backgroundColor: th.bg, borderColor: th.line }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shadow-sm"
                    style={{ backgroundColor: th.btn, color: th.btnInk, fontFamily: th.fontHead || 'inherit' }}
                  >
                    {idx + 1}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold" style={{ color: th.ink }}>{step.title}</h3>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: th.muted }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 5. POR QUÉ FUNCIONA (3 Highlights) ─────────────────────────── */}
        <section className="py-16 md:py-24 px-4 md:px-6">
          <div className="mx-auto max-w-2xl space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ fontFamily: th.fontHead || 'inherit' }}>
                {data.whyTitle}
              </h2>
              <p className="text-sm sm:text-base" style={{ color: th.muted }}>
                {data.whyLead}
              </p>
            </div>

            <div className="space-y-4">
              {data.whyCards?.map((card, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-r-2xl border-l-4 shadow-sm"
                  style={{
                    backgroundColor: th.bg,
                    borderLeftColor: th.accent,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <div className="font-bold text-base mb-1" style={{ color: th.ink }}>
                    {card.title}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: th.muted }}>
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 6. QUÉ INCLUYE + PRECIO ────────────────────────────────────── */}
        <section id="precio" className="py-16 md:py-24 px-4 md:px-6 scroll-mt-10" style={{ backgroundColor: th.bg2 }}>
          <div className="mx-auto max-w-2xl space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: th.accentText }}>
                Qué incluye
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ fontFamily: th.fontHead || 'inherit' }}>
                Todo lo que necesitas para cerrar tu lista.
              </h2>
            </div>

            {/* Recommended Plan Card */}
            {recommended && (
              <div
                className="rounded-3xl p-6 sm:p-8 border-2 shadow-xl space-y-6"
                style={{
                  backgroundColor: th.bg,
                  borderColor: th.ink,
                  boxShadow: '0 20px 40px -25px rgba(0,0,0,0.4)',
                }}
              >
                <div>
                  <span className="text-xs font-bold tracking-widest uppercase inline-block mb-2" style={{ color: th.accentText }}>
                    {recommended.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold" style={{ fontFamily: th.fontHead || 'inherit' }}>
                    {recommended.name}
                  </h3>
                </div>

                <ul className="space-y-3">
                  {recommended.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                      <Check className="h-4 w-4 mt-1 flex-shrink-0" style={{ color: th.accent }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Savings / Value Box */}
                <div
                  className="rounded-2xl p-4 text-xs sm:text-sm leading-relaxed"
                  style={{ backgroundColor: th.bg2 }}
                  dangerouslySetInnerHTML={{ __html: recommended.savingsText }}
                />

                {/* Price Display */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold" style={{ fontFamily: th.fontHead || 'inherit' }}>
                      {recommended.price}
                    </span>
                    <span className="text-xs sm:text-sm" style={{ color: th.muted }}>
                      {recommended.period}
                    </span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: th.muted }}>
                    {recommended.note}
                  </p>
                </div>

                {/* CTA Button */}
                <div>
                  <Link
                    to={primaryCtaUrl}
                    className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-base font-bold shadow-lg transition-transform active:scale-95"
                    style={{
                      backgroundColor: th.btn,
                      color: th.btnInk,
                      boxShadow: `0 0 0 1px ${th.btnRing} inset`,
                    }}
                  >
                    <span>{recommended.ctaText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <p className="text-xs text-center mt-2.5" style={{ color: th.muted }}>
                    {recommended.ctaMicro || 'La armas gratis. Pagas solo cuando la quieras publicar.'}
                  </p>
                </div>
              </div>
            )}

            {/* Alternative Plans */}
            {data.altPlans && data.altPlans.length > 0 && (
              <div className="space-y-3 pt-2">
                {data.altPlans.map((alt, i) => (
                  <Link
                    key={i}
                    to={alt.href || '/planes'}
                    className="flex items-center justify-between p-4 rounded-2xl border transition-all hover:shadow-md"
                    style={{ backgroundColor: th.bg, borderColor: th.line }}
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-sm" style={{ color: th.ink }}>{alt.title}</div>
                      <div className="text-xs" style={{ color: th.muted }}>{alt.subtitle}</div>
                    </div>
                    <span className="text-xs sm:text-sm font-bold flex-shrink-0 pl-3" style={{ color: th.accentText }}>
                      {alt.priceOrAction} →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── 7. PRUEBA (Real Demos) ─────────────────────────────────────── */}
        <section className="py-16 md:py-24 px-4 md:px-6">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ fontFamily: th.fontHead || 'inherit' }}>
                No nos creas: <span className="italic" style={{ color: th.accent }}>pruébala</span>.
              </h2>
              <p className="text-sm sm:text-base" style={{ color: th.muted }}>
                {data.proofLead}
              </p>
            </div>

            {/* Real Demo Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {demos.map((tpl, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow"
                  style={{ backgroundColor: th.bg, borderColor: th.line }}
                >
                  <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
                    <img
                      src={tpl.thumbnail}
                      alt={tpl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-sm">
                      Ejemplo real
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: th.ink }}>{tpl.name}</h3>
                      <p className="text-xs" style={{ color: th.muted }}>{tpl.categoryLabel}</p>
                    </div>
                    <a
                      href={`/i/${tpl.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
                      style={{ color: th.accentText }}
                    >
                      <span>Ver demo en vivo</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs" style={{ color: th.muted }}>
              Testimonios: se agregan solo cuando haya reales y autorizados.
            </p>
          </div>
        </section>

        {/* ─── 8. OBJECIONES ──────────────────────────────────────────────── */}
        {data.objections && data.objections.length > 0 && (
          <section className="py-16 md:py-24 px-4 md:px-6" style={{ backgroundColor: th.bg2 }}>
            <div className="mx-auto max-w-2xl space-y-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ fontFamily: th.fontHead || 'inherit' }}>
                {data.objectionsTitle || 'Lo que nos preguntan antes de decidirse'}
              </h2>

              <div className="divide-y" style={{ borderColor: th.line }}>
                {data.objections.map((obj, i) => (
                  <details key={i} className="py-4 group">
                    <summary className="font-bold text-base cursor-pointer list-none flex justify-between items-center gap-4 hover:opacity-85 transition-opacity">
                      <span>{obj.question}</span>
                      <span className="text-xl font-bold group-open:rotate-45 transition-transform duration-200" style={{ color: th.accentText }}>
                        +
                      </span>
                    </summary>
                    <p className="text-sm leading-relaxed pt-3" style={{ color: th.muted }}>
                      {obj.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── 9. GARANTÍA ────────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 px-4 md:px-6">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-start gap-5">
              <div
                className="flex-shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl font-bold font-serif"
                style={{ borderColor: th.accent, color: th.accent }}
              >
                7
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ fontFamily: th.fontHead || 'inherit' }}>
                  {data.guaranteeTitle || 'Cero riesgo.'}
                </h2>
                <p
                  className="text-sm sm:text-base leading-relaxed"
                  style={{ color: th.muted }}
                  dangerouslySetInnerHTML={{ __html: data.guaranteeText || '' }}
                />
                {data.guaranteeExtra && (
                  <div
                    className="text-xs sm:text-sm leading-relaxed pt-1"
                    style={{ color: th.ink }}
                    dangerouslySetInnerHTML={{ __html: data.guaranteeExtra }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 10. CIERRE CON URGENCIA (Dark Background) ─────────────────── */}
        <section className="py-20 md:py-28 px-4 md:px-6 text-center" style={{ backgroundColor: th.dark, color: th.darkInk }}>
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight" style={{ fontFamily: th.fontHead || 'inherit' }}>
              {data.closingTitle}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed opacity-90 max-w-xl mx-auto">
              {data.closingLead}
            </p>
            <div className="pt-4 space-y-3">
              <Link
                to={primaryCtaUrl}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold shadow-xl transition-all hover:-translate-y-0.5 active:scale-95"
                style={{
                  backgroundColor: th.btn,
                  color: th.btnInk,
                  boxShadow: `0 0 0 1px ${th.btnRing} inset`,
                }}
              >
                <span>{data.closingCta || data.hero.cta}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-xs opacity-80">
                Ármala gratis y mírala terminada · <b>pagas solo al publicar</b> · desde $499 · garantía de 7 días
              </p>
            </div>
          </div>
        </section>

        {/* ─── 11. PREGUNTAS FRECUENTES ───────────────────────────────────── */}
        <section className="py-16 md:py-24 px-4 md:px-6">
          <div className="mx-auto max-w-2xl space-y-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ fontFamily: th.fontHead || 'inherit' }}>
              Preguntas frecuentes
            </h2>

            <div className="divide-y" style={{ borderColor: th.line }}>
              {data.faq.map((item, i) => (
                <details key={i} className="py-4 group">
                  <summary className="font-bold text-base cursor-pointer list-none flex justify-between items-center gap-4 hover:opacity-85 transition-opacity">
                    <span>{item.question}</span>
                    <span className="text-xl font-bold group-open:rotate-45 transition-transform duration-200" style={{ color: th.accentText }}>
                      +
                    </span>
                  </summary>
                  <p className="text-sm leading-relaxed pt-3" style={{ color: th.muted }}>
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 12. CROSS-LINKS: También hacemos invitaciones para… ────────── */}
        <section className="py-16 md:py-20 px-4 md:px-6 border-t" style={{ backgroundColor: th.bg2, borderColor: th.line }}>
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold" style={{ fontFamily: th.fontHead || 'inherit' }}>
                También hacemos invitaciones digitales para otros eventos
              </h2>
              <p className="text-xs sm:text-sm" style={{ color: th.muted }}>
                Elige la categoría de tu celebración y descubre sus funciones exclusivas:
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {otherEvents.map((ev, i) => (
                <Link
                  key={i}
                  to={`/${ev.slug}`}
                  className="p-4 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-md text-left flex flex-col justify-between"
                  style={{ backgroundColor: th.bg, borderColor: th.line }}
                >
                  <div className="text-2xl mb-2">{ev.icon}</div>
                  <div>
                    <div className="font-bold text-sm" style={{ color: th.ink }}>{ev.label}</div>
                    <div className="text-[11px] leading-snug mt-1" style={{ color: th.muted }}>{ev.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Footer ─────────────────────────────────────────────────────── */}
        <footer className="py-12 px-4 md:px-6 border-t text-center text-xs space-y-4" style={{ borderColor: th.line, color: th.muted }}>
          <div className="flex justify-center items-center gap-6 font-semibold">
            <Link to={data.eventType ? `/planes?tipo=${data.eventType}` : '/planes'} className="hover:underline">Planes y precios</Link>
            <Link to="/ejemplos" className="hover:underline">Ejemplos</Link>
            <Link to="/confirma" className="hover:underline">Invitto Confirma</Link>
            <Link to="/terminos" className="hover:underline">Términos</Link>
          </div>
          <p>© {new Date().getFullYear()} Invitto · Hecho con cariño en México · León, Gto.</p>
        </footer>

        {/* ─── Sticky Mobile Bar ──────────────────────────────────────────── */}
        <div
          className={`fixed left-0 right-0 bottom-0 z-50 p-3 backdrop-blur-md border-t flex gap-2.5 items-center justify-center transition-transform duration-300 ${
            showStickyBar ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{
            backgroundColor: `${th.bg}F0`,
            borderColor: th.line,
            paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
          }}
        >
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg border shadow-sm flex-shrink-0 transition-transform active:scale-95"
            style={{ backgroundColor: th.bg, borderColor: th.line }}
          >
            💬
          </a>
          <Link
            to={primaryCtaUrl}
            className="flex-1 max-w-sm py-3.5 px-4 rounded-xl text-center text-sm font-bold shadow-md transition-transform active:scale-95 truncate"
            style={{
              backgroundColor: th.btn,
              color: th.btnInk,
              boxShadow: `0 0 0 1px ${th.btnRing} inset`,
            }}
          >
            {data.hero.cta}
          </Link>
        </div>

        {/* ─── Floating Toast Feedback ────────────────────────────────────── */}
        {toastMessage && (
          <div className="fixed left-1/2 bottom-24 -translate-x-1/2 z-50 bg-[#111111] text-white text-xs sm:text-sm font-medium px-5 py-3 rounded-xl shadow-2xl max-w-[90vw] text-center animate-fade-in">
            {toastMessage}
          </div>
        )}
      </div>
    );
  }

  // ─── Default Layout for City & Comparative Landings ──────────────────
  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#222B38]">
      <Seo
        title={data.seo.title}
        description={data.seo.description}
        path={data.seo.path}
        jsonLd={data.jsonLd}
      />

      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-slate-100 px-4 md:px-6">
        <div className="mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-95 transition-opacity">
            <img src="/logo.png?v=3" alt="Invitto" className="h-8 md:h-10 w-auto object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
              Ejemplos
            </Link>
            <Link to="/planes" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
              Planes
            </Link>
            <Link to="/comparativas" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
              Comparativas
            </Link>
            <Link to="/confirma" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
              Invitto Confirma
            </Link>
            <Link to="/blog" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
              Blog
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-[#222B38]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link
              to={primaryCtaUrl}
              className="hidden sm:inline-flex px-6 py-2.5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#DF3B94]/20"
            >
              {user ? 'Mi Dashboard' : 'Comenzar'}
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-6 space-y-4 animate-fade-in">
            <Link
              to="/ejemplos"
              className="block text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ejemplos
            </Link>
            <Link
              to="/planes"
              className="block text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Planes
            </Link>
            <Link
              to={primaryCtaUrl}
              className="block w-full text-center px-6 py-2.5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              {user ? 'Mi Dashboard' : 'Comenzar'}
            </Link>
          </div>
        )}
      </header>

      {/* ─── Breadcrumb ────────────────────────────────────────── */}
      <div className="pt-24 md:pt-28 px-6">
        <div className="mx-auto max-w-5xl">
          <Breadcrumb items={breadcrumbs} />
        </div>
      </div>

      {/* ─── Hero Section ───────────────────────────────────────── */}
      <section className="relative pt-4 pb-16 md:pt-8 md:pb-28 overflow-hidden px-6 bg-gradient-to-b from-[#fdf2f8]/50 via-white to-[#F8F9FA]">
        <div className="mx-auto max-w-4xl text-center relative z-10">
          {data.hero.badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#DF3B94] mb-8">
              <span>{data.hero.badge}</span>
            </div>
          )}

          <h1 className="text-4xl xs:text-5xl md:text-6xl font-display font-extrabold text-[#222B38] leading-tight tracking-tight mb-8">
            {data.hero.h1}
          </h1>

          <p className="text-base md:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto mb-10">
            {data.hero.subtitle}
          </p>

          <Link 
            to={primaryCtaUrl}
            className="w-full xs:w-auto min-h-[44px] px-10 py-5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-2xl text-xs md:text-sm font-bold tracking-wider hover:-translate-y-0.5 transition-all shadow-xl shadow-[#DF3B94]/25 inline-flex items-center justify-center gap-3 active:scale-95 no-underline"
          >
            {data.hero.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ─── Benefits Grid ──────────────────────────────────────── */}
      {data.benefits && data.benefits.length > 0 && (
        <section className="py-20 md:py-32 px-6 bg-[#F8F9FA]">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16 md:mb-20 space-y-4">
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38] tracking-tight">
                Todo lo que necesitas para tu evento
              </h2>
              <p className="text-slate-600 max-w-xl mx-auto text-base">La plataforma inteligente de invitaciones en México</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {data.benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={i}
                    className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-[#DF3B94]/5 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-[#fdf2f8] text-[#DF3B94] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-[#DF3B94]" />
                    </div>
                    <h3 className="text-lg font-display font-bold text-[#222B38] mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-slate-600 font-normal leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── How It Works (Steps) ───────────────────────────────── */}
      {data.steps && data.steps.length > 0 && (
        <section className="py-20 md:py-32 px-6 bg-white border-y border-slate-100">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16 md:mb-20 space-y-4">
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38] tracking-tight">
                Así de fácil funciona
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {data.steps.map((step, i) => (
                <div key={i} className="bg-[#F8F9FA] p-8 rounded-3xl border border-slate-100 text-center space-y-4">
                  <span className="text-3xl font-display font-extrabold text-[#DF3B94]">{step.number}</span>
                  <h3 className="text-base font-bold text-[#222B38]">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Comparison Table (conditional) ─────────────────────── */}
      {data.comparison && (
        <section className="py-20 md:py-32 px-6 bg-[#F8F9FA]">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38] tracking-tight">
                {data.comparison.title}
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                {data.comparison.subtitle}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 overflow-x-auto">
              <table className="w-full min-w-[500px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 pb-4">
                    <th className="pb-4">Característica</th>
                    <th className="pb-4 text-center text-[#DF3B94]">{data.comparison.invittoLabel}</th>
                    <th className="pb-4 text-center">{data.comparison.competitorLabel}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {data.comparison.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 font-semibold text-[#222B38]">{row.feature}</td>
                      <td className="py-4 text-center font-bold text-[#DF3B94]">
                        {typeof row.invitto === 'boolean' ? (
                          row.invitto ? (
                            <CheckCircle2 className="h-5 w-5 text-[#4E7B55] mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span>{row.invitto}</span>
                        )}
                      </td>
                      <td className="py-4 text-center text-slate-400">
                        {typeof row.competitor === 'boolean' ? (
                          row.competitor ? (
                            <CheckCircle2 className="h-4 w-4 text-slate-400 mx-auto" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span>{row.competitor}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQ Accordion ──────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-6 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#222B38]">
              Preguntas frecuentes
            </h2>
          </div>

          <div className="space-y-4">
            {data.faq.map((item, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left font-bold text-slate-800 flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown className={`h-5 w-5 text-[#DF3B94] transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ──────────────────────────────────────────── */}
      <section className="relative py-28 md:py-36 bg-[#222B38] text-white text-center px-6 overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl xs:text-5xl md:text-6xl font-display font-extrabold text-white leading-tight">
            {data.ctaFinal.title}
          </h2>
          <p className="text-base md:text-xl text-slate-300 font-normal max-w-xl mx-auto leading-relaxed">
            {data.ctaFinal.subtitle}
          </p>
          <div className="pt-4">
            <Link 
              to={primaryCtaUrl} 
              className="inline-flex items-center justify-center min-h-[44px] w-full xs:w-auto px-10 py-5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-full text-xs md:text-sm font-bold tracking-widest uppercase transition-all shadow-2xl active:scale-95 no-underline"
            >
              {data.ctaFinal.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <footer className="bg-[#222B38] text-white pt-16 pb-12 px-6 border-t border-white/10">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-4">
              <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
                <img src="/logo.png?v=3" alt="Invitto" className="h-8 w-auto object-contain brightness-0 invert" />
              </Link>
              <p className="text-xs text-slate-400 font-normal leading-relaxed">
                Invitaciones digitales de alta gama con control de pases y confirmación inteligente para México y Latinoamérica.
              </p>
            </div>
            <div className="lg:col-span-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-white">Navegación</p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to={data.eventType ? `/planes?tipo=${data.eventType}` : '/planes'} className="hover:text-white transition-colors">Planes y precios</Link></li>
                <li><Link to="/ejemplos" className="hover:text-white transition-colors">Ejemplos</Link></li>
                <li><Link to="/comparativas" className="hover:text-white transition-colors">Comparativas</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div className="lg:col-span-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-white">Contacto</p>
              <p className="text-xs text-slate-400">Soporte directo por WhatsApp y correo en México.</p>
              <a href="mailto:soporte@invitto.com.mx" className="text-xs text-[#DF3B94] font-bold hover:underline">soporte@invitto.com.mx</a>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold">
            <p>© {new Date().getFullYear()} INVITTO.MX · TODOS LOS DERECHOS RESERVADOS</p>
            <p>HECHO CON CARIÑO EN MÉXICO</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
