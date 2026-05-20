import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/Seo';
import { ArrowLeft, ChevronDown, CheckCircle2, Menu, X, ArrowRight } from 'lucide-react';
import type { PlanLandingData } from './data/plansLandingData';

interface PlanLandingTemplateProps {
  data: PlanLandingData;
}

export default function PlanLandingTemplate({ data }: PlanLandingTemplateProps) {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('id');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const Icon = data.icon;

  // Set up CTA action URL
  const ctaLink = eventId 
    ? `/checkout?plan=${data.id}&id=${eventId}` 
    : `/dashboard/new?plan=${data.id}`;

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1B2E1D]">
      <Seo
        title={data.seo.title}
        description={data.seo.description}
        path={data.seo.path}
        jsonLd={data.jsonLd}
      />

      {/* ─── Header ────────────────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-[#1B2E1D]/5 px-4 md:px-6">
        <div className="mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-serif italic tracking-tighter text-[#1B2E1D]">
            Invitto
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/planes" className="text-xs uppercase font-bold tracking-widest text-[#1B2E1D]/60 hover:text-[#BD7474] transition-colors">
              Planes y precios
            </Link>
            <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest text-[#1B2E1D]/60 hover:text-[#BD7474] transition-colors">
              Ejemplos
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-[#1B2E1D]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link
              to="/planes"
              className="hidden sm:inline-flex items-center gap-2 text-stone-400 hover:text-[#1B2E1D] text-xs uppercase font-bold tracking-widest transition-colors mr-4"
            >
              <ArrowLeft className="h-4 w-4" /> Todos los planes
            </Link>

            <Link
              to={user ? '/dashboard' : '/planes'}
              className="hidden sm:inline-flex px-6 py-2.5 bg-[#1B2E1D] text-white rounded-xl text-[9px] uppercase font-bold tracking-[0.2em] hover:bg-[#2D312E] transition-all"
            >
              {user ? 'Mi Dashboard' : 'Comenzar'}
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#1B2E1D]/5 bg-[#FDFBF7]/95 backdrop-blur-md px-4 py-6 space-y-4">
            <Link
              to="/planes"
              className="block text-xs uppercase font-bold tracking-widest text-[#1B2E1D]/60 hover:text-[#BD7474] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Planes y precios
            </Link>
            <Link
              to="/ejemplos"
              className="block text-xs uppercase font-bold tracking-widest text-[#1B2E1D]/60 hover:text-[#BD7474] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ejemplos
            </Link>
            <Link
              to={user ? '/dashboard' : '/planes'}
              className="block w-full text-center px-6 py-2.5 bg-[#1B2E1D] text-white rounded-xl text-[9px] uppercase font-bold tracking-[0.2em] hover:bg-[#2D312E] transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              {user ? 'Mi Dashboard' : 'Comenzar'}
            </Link>
          </div>
        )}
      </header>

      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 overflow-hidden px-6">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-[#BD7474]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#1B2E1D]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-4xl text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#1B2E1D]/5 rounded-full text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-[#1B2E1D]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#BD7474]" />
            {data.hero.badge}
          </div>

          <h1 className="text-4xl xs:text-5xl md:text-7xl font-serif italic leading-tight tracking-tight text-[#1B2E1D]">
            {data.hero.title}
          </h1>

          <p className="text-base md:text-xl text-stone-500 font-light leading-relaxed max-w-2xl mx-auto">
            {data.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to={ctaLink} className="w-full sm:w-auto">
              <button className="w-full px-10 py-5 bg-[#1B2E1D] text-white rounded-2xl text-[9px] md:text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-[#2D312E] transition-all transform active:scale-95 shadow-xl shadow-[#1B2E1D]/10 inline-flex items-center justify-center gap-3">
                {data.hero.cta}
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>

            <Link to={data.demoUrl} target="_blank" className="w-full sm:w-auto">
              <button className="w-full px-10 py-5 bg-white text-[#1B2E1D] border border-stone-200 rounded-2xl text-[9px] md:text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-stone-50 transition-all">
                Ver demo de prueba
              </button>
            </Link>
          </div>

          <div className="pt-6">
            <p className="text-3xl md:text-4xl font-serif text-[#BD7474]">
              {data.price} <span className="text-xs uppercase font-sans font-bold tracking-widest text-stone-400">{data.period}</span>
            </p>
            <p className="text-[9px] uppercase font-bold tracking-widest text-stone-400 mt-1">Un solo pago · Acceso de por vida</p>
          </div>
        </div>
      </section>

      {/* ─── Detailed Intro ─────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-6 border-t border-stone-100 bg-white">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#BD7474]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon className="h-8 w-8 text-[#BD7474]" />
          </div>
          <h2 className="text-2xl md:text-4xl font-serif text-[#1B2E1D]">
            {data.details.introTitle}
          </h2>
          <p className="text-stone-500 font-light leading-relaxed text-base md:text-lg">
            {data.details.introDesc}
          </p>
        </div>
      </section>

      {/* ─── Features Grid ──────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-6 bg-[#FDFBF7]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 md:mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif italic text-[#1B2E1D] tracking-tight">
              Características del plan
            </h2>
            <div className="h-1 w-16 md:w-20 bg-[#BD7474] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {data.features.map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-[#1B2E1D]/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <h3 className="text-lg font-medium text-[#1B2E1D] mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-stone-400 font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQs Accordion ─────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-6 bg-white">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-16 md:mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif italic text-[#1B2E1D] tracking-tight">
              Preguntas sobre {data.name}
            </h2>
            <div className="h-1 w-16 md:w-20 bg-[#BD7474] mx-auto" />
          </div>

          <div className="space-y-4 md:space-y-6">
            {data.faqs.map((item, i) => (
              <div
                key={i}
                className="border-b border-stone-100 pb-5 md:pb-6 cursor-pointer group"
                onClick={() => toggleFaq(i)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-base md:text-lg font-medium text-[#1B2E1D]">
                    {item.question}
                  </h4>
                  <ChevronDown
                    className={`h-4 w-4 md:h-5 md:w-5 text-stone-300 flex-shrink-0 transition-transform duration-300 ${
                      openFaq === i ? 'rotate-180 text-[#BD7474]' : ''
                    }`}
                  />
                </div>
                <div
                  className={`grid transition-all duration-300 ${
                    openFaq === i ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm text-stone-400 font-light leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ──────────────────────────────────────────────── */}
      <section className="py-24 md:py-40 bg-[#1B2E1D] text-white text-center relative overflow-hidden px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-[#BD7474]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-6xl font-serif italic leading-tight">
            Comienza tu evento hoy mismo
          </h2>
          <p className="text-base md:text-xl text-stone-300 font-light italic max-w-2xl mx-auto leading-relaxed">
            Activa el {data.name} y personaliza cada detalle visual con el respaldo y la distinción de Invitto.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
            <Link to={ctaLink} className="w-full">
              <button className="w-full py-5 bg-[#BD7474] text-white rounded-2xl text-[9px] md:text-[10px] uppercase font-bold tracking-[0.3em] shadow-2xl hover:bg-[#B06060] transition-all transform active:scale-95">
                Contratar ahora
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-[#0A0C0A] text-white py-16 px-6">
        <div className="mx-auto max-w-7xl text-center space-y-6">
          <Link to="/" className="text-2xl font-serif italic tracking-tighter">
            Invitto
          </Link>
          <div className="flex flex-wrap justify-center gap-8 text-xs text-white/40">
            <Link to="/planes" className="hover:text-white transition-colors">Planes</Link>
            <Link to="/ejemplos" className="hover:text-white transition-colors">Ejemplos</Link>
            <Link to="/aviso-de-privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <Link to="/terminos" className="hover:text-white transition-colors">Términos</Link>
          </div>
          <p className="text-xs text-white/20 pt-4">
            © {new Date().getFullYear()} Invitto. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
