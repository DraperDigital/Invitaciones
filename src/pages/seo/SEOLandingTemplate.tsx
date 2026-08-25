import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/Seo';
import Breadcrumb, { type BreadcrumbItem } from '../../components/Breadcrumb';
import { ArrowRight, ChevronDown, CheckCircle2, XCircle, Menu, X } from 'lucide-react';
import type { LandingPageData } from './data/landingData';

/** Derive breadcrumb trail from the landing slug. Slugs cluster into three groups. */
function breadcrumbsForSlug(slug: string, h1: string): BreadcrumbItem[] {
  // Comparison cluster — child of /comparativas
  if (slug.startsWith('invitto-vs-') || slug === 'invitaciones-digitales-vs-papel') {
    return [
      { label: 'Comparativas', href: '/comparativas' },
      { label: h1 },
    ];
  }
  // City cluster — child of /ejemplos
  if (['cdmx', 'guadalajara', 'monterrey'].some((c) => slug.includes(c))) {
    return [
      { label: 'Ejemplos', href: '/ejemplos' },
      { label: h1 },
    ];
  }
  // Event-type cluster (boda, xv-anos, cumpleanos) — child of /ejemplos
  return [
    { label: 'Ejemplos', href: '/ejemplos' },
    { label: h1 },
  ];
}

export default function SEOLandingTemplate({ data }: { data: LandingPageData }) {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const ctaLink = user ? '/dashboard/new' : '/planes';
  const breadcrumbs = breadcrumbsForSlug(data.slug, data.hero.h1);

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
            <img src="/logo.png" alt="Invitto" className="h-8 md:h-10 w-auto object-contain" />
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
            <Link to="/concierge-service" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
              Concierge
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
              to={user ? '/dashboard' : '/planes'}
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
              to={user ? '/dashboard' : '/planes'}
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

          <Link to={ctaLink}>
            <button className="w-full xs:w-auto px-10 py-5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-2xl text-xs md:text-sm font-bold tracking-wider hover:-translate-y-0.5 transition-all shadow-xl shadow-[#DF3B94]/25 inline-flex items-center justify-center gap-3 active:scale-95">
              {data.hero.cta}
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* ─── Benefits Grid ──────────────────────────────────────── */}
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

      {/* ─── How It Works (Steps) ───────────────────────────────── */}
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
                <span className="text-3xl font-display font-extrabold text-[#DF3B94]">0{step.number}</span>
                <h3 className="text-base font-bold text-[#222B38]">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            <Link to={ctaLink} className="inline-block w-full xs:w-auto">
              <button className="px-10 py-5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-full text-xs md:text-sm font-bold tracking-widest uppercase transition-all shadow-2xl active:scale-95">
                {data.ctaFinal.cta}
              </button>
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
                <img src="/logo.png" alt="Invitto" className="h-8 w-auto object-contain brightness-0 invert" />
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
