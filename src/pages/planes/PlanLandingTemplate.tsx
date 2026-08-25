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

  const ctaLink = eventId 
    ? `/checkout?plan=${data.id}&id=${eventId}` 
    : `/dashboard/new?plan=${data.id}`;

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-[#222B38]">
      <Seo
        title={data.seo.title}
        description={data.seo.description}
        path={data.seo.path}
        jsonLd={data.jsonLd}
      />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-slate-100 px-4 md:px-6">
        <div className="mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-95 transition-opacity">
            <img src="/logo.png?v=3" alt="Invitto" className="h-8 md:h-10 w-auto object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/planes" className="text-xs uppercase font-bold tracking-widest text-[#DF3B94]">
              Planes y precios
            </Link>
            <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
              Ejemplos
            </Link>
            <Link to="/comparativas" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
              Comparativas
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
              to="/planes"
              className="hidden sm:inline-flex items-center gap-2 text-slate-500 hover:text-[#222B38] text-xs font-bold uppercase tracking-wider transition-colors mr-4"
            >
              <ArrowLeft className="h-4 w-4" /> Todos los planes
            </Link>

            <Link
              to={user ? '/dashboard' : '/planes'}
              className="hidden sm:inline-flex px-6 py-2.5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#DF3B94]/20"
            >
              {user ? 'Mi Dashboard' : 'Comenzar'}
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-6 space-y-4">
            <Link
              to="/planes"
              className="block text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Planes y precios
            </Link>
            <Link
              to="/ejemplos"
              className="block text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ejemplos
            </Link>
            <Link
              to={user ? '/dashboard' : '/planes'}
              className="block w-full text-center px-6 py-2.5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              {user ? 'Mi Dashboard' : 'Comenzar'}
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden px-6 bg-gradient-to-b from-[#fdf2f8]/50 via-white to-[#F8F9FA]">
        <div className="mx-auto max-w-4xl text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#DF3B94]">
            <span>{data.hero.badge}</span>
          </div>

          <h1 className="text-4xl xs:text-5xl md:text-7xl font-display font-extrabold text-[#222B38] leading-tight tracking-tight">
            {data.hero.title}
          </h1>

          <p className="text-base md:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            {data.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to={ctaLink} className="w-full sm:w-auto">
              <button className="w-full px-10 py-5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-2xl text-xs md:text-sm font-bold tracking-wider hover:-translate-y-0.5 transition-all shadow-xl shadow-[#DF3B94]/25 inline-flex items-center justify-center gap-3 active:scale-95">
                {data.hero.cta}
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>

            <Link to={data.demoUrl} target="_blank" className="w-full sm:w-auto">
              <button className="w-full px-10 py-5 bg-white text-slate-700 border border-slate-200 rounded-2xl text-xs md:text-sm font-bold tracking-wider hover:border-[#DF3B94]/30 hover:text-[#DF3B94] transition-all shadow-sm">
                Ver demo de prueba
              </button>
            </Link>
          </div>

          <div className="pt-6">
            <p className="text-3xl md:text-4xl font-display font-extrabold text-[#DF3B94]">
              {data.price} <span className="text-xs uppercase font-sans font-bold tracking-widest text-slate-400">{data.period}</span>
            </p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Un solo pago · Sin mensualidades</p>
          </div>
        </div>
      </section>

      {/* Detailed Intro */}
      <section className="py-16 md:py-24 px-6 border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#fdf2f8] text-[#DF3B94] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Icon className="h-8 w-8 text-[#DF3B94]" />
          </div>
          <h2 className="text-2xl md:text-4xl font-display font-extrabold text-[#222B38]">
            {data.details.introTitle}
          </h2>
          <p className="text-slate-600 font-normal leading-relaxed text-base md:text-lg">
            {data.details.introDesc}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 px-6 bg-[#F8F9FA]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#222B38]">
              Características del plan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {data.features.map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-[#DF3B94]/5 transition-all group"
              >
                <div className="w-10 h-10 bg-emerald-50 text-[#4E7B55] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-5 w-5 text-[#4E7B55]" />
                </div>
                <h3 className="text-lg font-display font-bold text-[#222B38] mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 font-normal leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Accordion */}
      <section className="py-20 md:py-32 px-6 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#222B38]">
              Preguntas sobre {data.name}
            </h2>
          </div>

          <div className="space-y-4">
            {data.faqs.map((item, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => toggleFaq(i)}
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

      {/* Final CTA */}
      <section className="relative py-28 md:py-36 bg-[#222B38] text-white text-center px-6 overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl xs:text-5xl md:text-6xl font-display font-extrabold text-white leading-tight">
            Comienza tu evento hoy mismo
          </h2>
          <p className="text-base md:text-xl text-slate-300 font-normal max-w-xl mx-auto leading-relaxed">
            Activa el {data.name} y personaliza cada detalle visual con el respaldo y la distinción de Invitto.
          </p>
          <div className="pt-4">
            <Link to={ctaLink} className="inline-block w-full xs:w-auto">
              <button className="px-10 py-5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-full text-xs md:text-sm font-bold tracking-widest uppercase transition-all shadow-2xl active:scale-95">
                Contratar ahora
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                <li><Link to="/planes" className="hover:text-white transition-colors">Planes y precios</Link></li>
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
            <p>© 2026 INVITTO.MX · TODOS LOS DERECHOS RESERVADOS</p>
            <p>HECHO CON CARIÑO EN MÉXICO</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
