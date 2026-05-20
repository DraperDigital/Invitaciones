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
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1B2E1D]">
      <Seo
        title={data.seo.title}
        description={data.seo.description}
        path={data.seo.path}
        jsonLd={data.jsonLd}
      />

      {/* ─── A. Header ─────────────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-[#1B2E1D]/5 px-4 md:px-6">
        <div className="mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-serif italic tracking-tighter text-[#1B2E1D]">
            Invitto
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest text-[#1B2E1D]/60 hover:text-[#BD7474] transition-colors">
              Ejemplos
            </Link>
            <Link to="/planes" className="text-xs uppercase font-bold tracking-widest text-[#1B2E1D]/60 hover:text-[#BD7474] transition-colors">
              Planes
            </Link>
            <Link to="/comparativas" className="text-xs uppercase font-bold tracking-widest text-[#1B2E1D]/60 hover:text-[#BD7474] transition-colors">
              Comparativas
            </Link>
            <Link to="/concierge-service" className="text-xs uppercase font-bold tracking-widest text-[#1B2E1D]/60 hover:text-[#BD7474] transition-colors">
              Concierge
            </Link>
            <Link to="/blog" className="text-xs uppercase font-bold tracking-widest text-[#1B2E1D]/60 hover:text-[#BD7474] transition-colors">
              Blog
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-[#1B2E1D]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

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
          <div className="lg:hidden border-t border-[#1B2E1D]/5 bg-[#FDFBF7]/95 backdrop-blur-md px-4 py-6 space-y-4 animate-fade-in">
            <Link
              to="/ejemplos"
              className="block text-xs uppercase font-bold tracking-widest text-[#1B2E1D]/60 hover:text-[#BD7474] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ejemplos
            </Link>
            <Link
              to="/planes"
              className="block text-xs uppercase font-bold tracking-widest text-[#1B2E1D]/60 hover:text-[#BD7474] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Planes
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

      {/* ─── A2. Breadcrumb ────────────────────────────────────────── */}
      <div className="pt-24 md:pt-28 px-6">
        <div className="mx-auto max-w-4xl">
          <Breadcrumb items={breadcrumbs} />
        </div>
      </div>

      {/* ─── B. Hero Section ───────────────────────────────────────── */}
      <section className="relative pt-4 pb-16 md:pt-8 md:pb-32 overflow-hidden px-6">
        {/* Decorative blurred circles */}
        <div className="absolute top-20 -left-32 w-96 h-96 bg-[#BD7474]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#1B2E1D]/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="mx-auto max-w-4xl text-center relative z-10">
          {data.hero.badge && (
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#1B2E1D]/5 rounded-full text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-[#1B2E1D] mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-[#BD7474]" />
              {data.hero.badge}
            </div>
          )}

          <h1 className="text-4xl xs:text-5xl md:text-7xl font-serif italic leading-tight tracking-tight mb-8">
            {data.hero.h1}
          </h1>

          <p className="text-base md:text-xl text-stone-500 font-light leading-relaxed max-w-2xl mx-auto mb-10">
            {data.hero.subtitle}
          </p>

          <Link to={ctaLink}>
            <button className="w-full xs:w-auto px-10 py-5 bg-[#1B2E1D] text-white rounded-2xl text-[9px] md:text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-[#2D312E] transition-all transform active:scale-95 shadow-xl shadow-[#1B2E1D]/20 inline-flex items-center justify-center gap-3">
              {data.hero.cta}
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* ─── C. Benefits Grid ──────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 md:mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif italic text-[#1B2E1D] tracking-tight">
              Todo lo que necesitas para tu evento
            </h2>
            <div className="h-1 w-16 md:w-20 bg-[#BD7474] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {data.benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-[#BD7474]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-[#BD7474]" />
                  </div>
                  <h3 className="text-lg font-medium text-[#1B2E1D] mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-stone-400 font-light leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── D. How It Works (Steps) ───────────────────────────────── */}
      <section className="py-20 md:py-32 px-6 bg-[#FDFBF7]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16 md:mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif italic text-[#1B2E1D] tracking-tight">
              Así de fácil
            </h2>
            <div className="h-1 w-16 md:w-20 bg-[#BD7474] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-[2.75rem] left-0 w-full h-[1px] bg-[#1B2E1D]/10 z-0" />

            {data.steps.map((step, i) => (
              <div key={i} className="text-center space-y-6 relative z-10 group">
                <div className="h-20 w-20 rounded-full bg-[#1B2E1D] text-white flex items-center justify-center font-bold text-xl mx-auto ring-8 ring-[#1B2E1D]/5 group-hover:bg-[#BD7474] transition-all duration-500">
                  {step.number}
                </div>
                <h3 className="text-lg font-medium text-[#1B2E1D]">
                  {step.title}
                </h3>
                <p className="text-sm text-stone-400 font-light leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── E. Comparison Table (conditional) ─────────────────────── */}
      {data.comparison && (
        <section className="py-20 md:py-32 px-6 bg-white">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16 md:mb-20 space-y-4">
              <h2 className="text-3xl md:text-5xl font-serif italic text-[#1B2E1D] tracking-tight">
                {data.comparison.title}
              </h2>
              <p className="text-base md:text-lg text-stone-400 font-light leading-relaxed">
                {data.comparison.subtitle}
              </p>
              <div className="h-1 w-16 md:w-20 bg-[#BD7474] mx-auto" />
            </div>

            <div className="overflow-x-auto rounded-[2rem] border border-stone-100 shadow-sm">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="bg-[#1B2E1D] text-white">
                    <th className="text-left py-5 px-6 text-[10px] md:text-xs uppercase font-bold tracking-widest">
                      Característica
                    </th>
                    <th className="text-center py-5 px-6 text-[10px] md:text-xs uppercase font-bold tracking-widest bg-[#BD7474]/20">
                      {data.comparison.invittoLabel}
                    </th>
                    <th className="text-center py-5 px-6 text-[10px] md:text-xs uppercase font-bold tracking-widest">
                      {data.comparison.competitorLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.comparison.rows.map((row, i) => (
                    <tr
                      key={i}
                      className={`border-t border-stone-100 ${i % 2 === 0 ? 'bg-[#FDFBF7]' : 'bg-white'} transition-colors hover:bg-[#BD7474]/5`}
                    >
                      <td className="py-4 px-6 text-sm font-medium text-[#1B2E1D]">
                        {row.feature}
                      </td>
                      <td className="py-4 px-6 text-center bg-[#BD7474]/[0.03]">
                        {typeof row.invitto === 'boolean' ? (
                          row.invitto ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm font-medium text-[#1B2E1D]">{row.invitto}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof row.competitor === 'boolean' ? (
                          row.competitor ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm text-stone-500">{row.competitor}</span>
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



      {/* ─── G. FAQ Accordion ──────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-6 bg-white">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-16 md:mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif italic text-[#1B2E1D] tracking-tight">
              Preguntas frecuentes
            </h2>
            <div className="h-1 w-16 md:w-20 bg-[#BD7474] mx-auto" />
          </div>

          <div className="space-y-4 md:space-y-6">
            {data.faq.map((item, i) => (
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

      {/* ─── H. Final CTA ──────────────────────────────────────────── */}
      <section className="py-24 md:py-40 bg-[#1B2E1D] text-white text-center relative overflow-hidden px-6">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-[#BD7474]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-8 md:space-y-10">
          <h2 className="text-3xl md:text-6xl font-serif italic leading-tight">
            {data.ctaFinal.title}
          </h2>
          <p className="text-base md:text-xl text-stone-300 font-light italic max-w-2xl mx-auto leading-relaxed">
            {data.ctaFinal.subtitle}
          </p>
          <Link to={ctaLink} className="inline-block w-full xs:w-auto">
            <button className="w-full px-12 md:px-16 py-5 md:py-6 bg-[#BD7474] text-white rounded-2xl text-[9px] md:text-[10px] uppercase font-bold tracking-[0.3em] shadow-2xl hover:bg-[#B06060] transition-all transform active:scale-95">
              {data.ctaFinal.cta}
            </button>
          </Link>
        </div>
      </section>

      {/* ─── I. Footer ─────────────────────────────────────────────── */}
      <footer className="bg-[#0A0C0A] text-white py-16 md:py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 mb-16">
            {/* Column 1: Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="text-2xl font-serif italic tracking-tighter">
                Invitto
              </Link>
              <p className="mt-4 text-xs text-white/40 font-light leading-relaxed">
                La plataforma mexicana de invitaciones digitales para bodas, XV años y todo tipo de celebraciones.
              </p>
            </div>

            {/* Column 2: Producto */}
            <div>
              <h5 className="text-[9px] uppercase font-bold tracking-[0.2em] text-white/60 mb-4">
                Producto
              </h5>
              <ul className="space-y-3">
                <li>
                  <Link to="/planes" className="text-sm text-white/40 hover:text-[#BD7474] transition-colors font-light">
                    Planes y precios
                  </Link>
                </li>
                <li>
                  <Link to="/ejemplos" className="text-sm text-white/40 hover:text-[#BD7474] transition-colors font-light">
                    Ejemplos
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-sm text-white/40 hover:text-[#BD7474] transition-colors font-light">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Comparativas */}
            <div>
              <h5 className="text-[9px] uppercase font-bold tracking-[0.2em] text-white/60 mb-4">
                Comparativas
              </h5>
              <ul className="space-y-3">
                <li>
                  <Link to="/invitaciones-digitales-vs-papel" className="text-sm text-white/40 hover:text-[#BD7474] transition-colors font-light">
                    Digital vs Papel
                  </Link>
                </li>
                <li>
                  <Link to="/invitto-vs-paperless-post" className="text-sm text-white/40 hover:text-[#BD7474] transition-colors font-light">
                    vs Paperless Post
                  </Link>
                </li>
                <li>
                  <Link to="/invitto-vs-greenvelope" className="text-sm text-white/40 hover:text-[#BD7474] transition-colors font-light">
                    vs Greenvelope
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
              <h5 className="text-[9px] uppercase font-bold tracking-[0.2em] text-white/60 mb-4">
                Legal
              </h5>
              <ul className="space-y-3">
                <li>
                  <Link to="/aviso-de-privacidad" className="text-sm text-white/40 hover:text-[#BD7474] transition-colors font-light">
                    Aviso de privacidad
                  </Link>
                </li>
                <li>
                  <Link to="/terminos" className="text-sm text-white/40 hover:text-[#BD7474] transition-colors font-light">
                    Términos y condiciones
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-xs text-white/30 font-light">
              © {new Date().getFullYear()} Invitto. Todos los derechos reservados. Hecho con ❤️ en México.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
