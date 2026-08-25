import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/Seo';
import {
  Building2,
  Calendar,
  Users,
  QrCode,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Menu,
  X,
  Lock,
  ChevronRight,
  Download,
  Briefcase
} from 'lucide-react';
import {
  CORPORATE_DEMO_AGENDA,
  CORPORATE_DEMO_SPEAKERS,
  CORPORATE_DEMO_SPONSORS,
  CORPORATE_PLANES
} from './data/corporateDemoData';

const CORPORATE_JSONLD = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Invitto One',
    url: 'https://one.invitto.com.mx',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    description: 'Plataforma B2B de control de acceso, invitaciones ejecutivas y acreditación QR para congresos, cumbres y eventos corporativos.',
    offers: {
      '@type': 'Offer',
      price: '8999',
      priceCurrency: 'MXN',
    },
  },
];

export default function OneHomePage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDemoTab, setActiveDemoTab] = useState<'agenda' | 'speakers' | 'sponsors' | 'accreditation'>('agenda');
  const [rsvpsubmitted, setRsvpsubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans text-slate-100 selection:bg-[#2563EB]/30">
      <Seo
        title="Invitto One — Plataforma B2B para Eventos Corporativos e Institucionales"
        description="Gestión de asistentes, agenda multi-track, ponentes, acreditación QR y control de acceso para congresos, cumbres y eventos de empresa en México."
        path="/one"
        image="/logo-one.png?v=1"
        favicon="/favicon-one.png"
        jsonLd={CORPORATE_JSONLD}
      />

      {/* ─── Executive Header ────────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 px-4 md:px-8">
        <div className="mx-auto max-w-7xl h-20 flex items-center justify-between">
          <Link to="/one" className="flex items-center gap-3 hover:opacity-95 transition-opacity">
            <img src="/logo-one.png?v=1" alt="Invitto One" className="h-10 md:h-12 w-auto object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <a href="#pilares" className="text-xs uppercase font-bold tracking-widest text-slate-300 hover:text-[#60A5FA] transition-colors">
              Soluciones
            </a>
            <a href="#demo" className="text-xs uppercase font-bold tracking-widest text-slate-300 hover:text-[#60A5FA] transition-colors">
              Demo Interactiva
            </a>
            <a href="#planes" className="text-xs uppercase font-bold tracking-widest text-slate-300 hover:text-[#60A5FA] transition-colors">
              Planes Enterprise
            </a>
            <Link to="/comparativas" className="text-xs uppercase font-bold tracking-widest text-slate-400 hover:text-white transition-colors">
              B2C vs B2B
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-slate-300 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú corporativo"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link
              to={user ? '/dashboard' : '/login?redirect=/dashboard'}
              className="hidden sm:inline-flex px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#2563EB]/25"
            >
              {user ? 'Panel Ejecutivo' : 'Ingreso Portal'}
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#0F172A]/95 backdrop-blur-md px-6 py-6 space-y-4">
            <a
              href="#pilares"
              className="block text-xs uppercase font-bold tracking-widest text-slate-300 hover:text-[#60A5FA] py-2 border-b border-slate-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Soluciones Corporativas
            </a>
            <a
              href="#demo"
              className="block text-xs uppercase font-bold tracking-widest text-slate-300 hover:text-[#60A5FA] py-2 border-b border-slate-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Demo en Vivo
            </a>
            <a
              href="#planes"
              className="block text-xs uppercase font-bold tracking-widest text-slate-300 hover:text-[#60A5FA] py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Planes Enterprise
            </a>
            <div className="pt-3">
              <Link
                to={user ? '/dashboard' : '/login'}
                className="block w-full text-center px-6 py-3 bg-[#2563EB] text-white rounded-xl text-xs uppercase font-bold tracking-widest"
                onClick={() => setMobileMenuOpen(false)}
              >
                {user ? 'Panel Ejecutivo' : 'Ingreso Portal'}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-[#0F172A] to-[#0B1120]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#2563EB]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-6xl text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-full text-xs font-mono font-semibold text-[#60A5FA]">
            <Building2 className="h-4 w-4" />
            <span>PLATAFORMA B2B DE GESTIÓN & ACREDITACIÓN PARA EVENTOS CORPORATIVOS</span>
          </div>

          <h1 className="text-4xl xs:text-5xl md:text-7xl font-display font-extrabold text-white leading-tight tracking-tight max-w-5xl mx-auto">
            Control total de tus <br />
            <span className="bg-gradient-to-r from-[#60A5FA] via-[#38BDF8] to-[#34D399] bg-clip-text text-transparent">
              asistentes ejecutivos.
            </span>
          </h1>

          <p className="text-base md:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto">
            Invitaciones digitales ejecutivas, agenda multi-track, directorio de ponentes y acreditación QR en tiempo real para congresos, cumbres y eventos institucionales.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
            <a href="#demo" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl text-xs md:text-sm font-bold tracking-wider uppercase transition-all shadow-xl shadow-[#2563EB]/30 flex items-center justify-center gap-3 active:scale-95">
                Probar Demo Ejecutiva
                <ArrowRight className="h-4 w-4" />
              </button>
            </a>

            <a href="#planes" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl text-xs md:text-sm font-bold tracking-wider uppercase hover:bg-slate-700 transition-all">
                Ver Planes Enterprise
              </button>
            </a>
          </div>

          <div className="pt-8 flex flex-wrap justify-center items-center gap-8 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#34D399]" /> Cumplimiento SOC2 / ISO Ready
            </span>
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#60A5FA]" /> Validación Dominio Corporativo
            </span>
            <span className="flex items-center gap-2">
              <QrCode className="h-4 w-4 text-[#38BDF8]" /> Acreditación QR Instantánea
            </span>
          </div>
        </div>
      </section>

      {/* ─── Pilares de Valor B2B ────────────────────────────────────── */}
      <section id="pilares" className="py-20 md:py-32 px-6 bg-[#0B1120] border-t border-b border-slate-800">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 md:mb-24 space-y-4">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#60A5FA]">Soluciones Enterprise</p>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">
              Diseñado para las exigencias del sector corporativo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-3xl p-8 hover:border-[#2563EB]/50 transition-all group">
              <div className="w-12 h-12 bg-[#2563EB]/20 text-[#60A5FA] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">Agenda Multi-Track</h3>
              <p className="text-xs md:text-sm text-slate-400 font-normal leading-relaxed">
                Desglose detallado por salones, horarios, ponentes y keynotes con navegación interactiva para los asistentes.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/60 rounded-3xl p-8 hover:border-[#2563EB]/50 transition-all group">
              <div className="w-12 h-12 bg-[#2563EB]/20 text-[#60A5FA] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">Directorio de Ponentes</h3>
              <p className="text-xs md:text-sm text-slate-400 font-normal leading-relaxed">
                Fichas ejecutivas de conferenciantes con fotografía, biografía, cargo, empresa y perfil profesional.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/60 rounded-3xl p-8 hover:border-[#2563EB]/50 transition-all group">
              <div className="w-12 h-12 bg-[#2563EB]/20 text-[#60A5FA] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">Acreditación & Gafete QR</h3>
              <p className="text-xs md:text-sm text-slate-400 font-normal leading-relaxed">
                Generación automática de gafete digital o para impresión con código QR para escaneo masivo en recepción.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/60 rounded-3xl p-8 hover:border-[#2563EB]/50 transition-all group">
              <div className="w-12 h-12 bg-[#2563EB]/20 text-[#60A5FA] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">Acceso Restringido SSO</h3>
              <p className="text-xs md:text-sm text-slate-400 font-normal leading-relaxed">
                Filtro automático de registro exclusivo para dominios autorizados (ej. @tuempresa.com) y firma de NDA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Simulador de Evento Corporativo en Vivo (Demo Interactive) ── */}
      <section id="demo" className="py-20 md:py-32 px-6 bg-[#0F172A]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-full text-xs font-mono font-bold text-[#60A5FA]">
              <span>DEMOSTRACIÓN INTERACTIVA DE INVITTO ONE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">
              Simulador de Portal de Evento Ejecutivo
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
              Así experimentarán tus asistentes el portal del evento desde su celular o computadora.
            </p>
          </div>

          {/* Device Mockup Wrapper */}
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-[#2563EB]/10 overflow-hidden">
            {/* Header Event Banner */}
            <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#0F172A] p-6 md:p-8 rounded-2xl mb-8 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-white/10 text-xs font-mono font-bold rounded-full uppercase tracking-wider text-slate-200">
                  Evento Confirmado · Octubre 2026
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-extrabold text-white">
                  Summit Internacional de Innovación & Negocios Latam
                </h3>
                <p className="text-xs md:text-sm text-slate-300 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#38BDF8]" /> Centro Banamex · CDMX, México
                </p>
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={() => setRsvpsubmitted(!rsvpsubmitted)}
                  className={`px-6 py-3 rounded-xl text-xs uppercase font-bold tracking-widest transition-all ${
                    rsvpsubmitted
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-white text-[#1E3A8A] hover:bg-slate-100 shadow-xl'
                  }`}
                >
                  {rsvpsubmitted ? '✓ Acreditado con Éxito' : 'Acreditar Asistencia'}
                </button>
              </div>
            </div>

            {/* Demo Navigation Tabs */}
            <div className="flex gap-2 border-b border-slate-800 overflow-x-auto pb-3 mb-8 scrollbar-hide">
              <button
                onClick={() => setActiveDemoTab('agenda')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeDemoTab === 'agenda'
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Agenda & Horarios
              </button>
              <button
                onClick={() => setActiveDemoTab('speakers')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeDemoTab === 'speakers'
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Ponentes Keynote ({CORPORATE_DEMO_SPEAKERS.length})
              </button>
              <button
                onClick={() => setActiveDemoTab('sponsors')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeDemoTab === 'sponsors'
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Patrocinadores (Sponsors)
              </button>
              <button
                onClick={() => setActiveDemoTab('accreditation')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeDemoTab === 'accreditation'
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Pase QR Ejecutivo
              </button>
            </div>

            {/* TAB CONTENT: AGENDA */}
            {activeDemoTab === 'agenda' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {CORPORATE_DEMO_AGENDA.map((item) => (
                  <div key={item.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-[#60A5FA] bg-[#2563EB]/10 px-2.5 py-1 rounded-md border border-[#2563EB]/20">
                          {item.time}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded">
                          {item.track}
                        </span>
                      </div>
                      <h4 className="text-base md:text-lg font-display font-bold text-white">{item.title}</h4>
                      <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-2 bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-800 shrink-0">
                      <MapPin className="h-3.5 w-3.5 text-[#38BDF8]" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: SPEAKERS */}
            {activeDemoTab === 'speakers' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                {CORPORATE_DEMO_SPEAKERS.map((sp) => (
                  <div key={sp.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <img src={sp.avatar} alt={sp.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-700" />
                      <div>
                        <h4 className="text-base font-display font-bold text-white">{sp.name}</h4>
                        <p className="text-xs font-bold text-[#60A5FA]">{sp.role}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{sp.company}</p>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{sp.bio}</p>
                    </div>
                    <a href={sp.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" /> Perfil Ejecutivo
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: SPONSORS */}
            {activeDemoTab === 'sponsors' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Marcas e Instituciones Patrocinadoras</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {CORPORATE_DEMO_SPONSORS.map((s, idx) => (
                    <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2">
                      <Briefcase className="h-8 w-8 text-[#60A5FA]" />
                      <p className="text-sm font-bold text-white">{s.name}</p>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#2563EB]/10 text-[#60A5FA] rounded border border-[#2563EB]/20">
                        {s.tier} Partner
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: ACCREDITATION */}
            {activeDemoTab === 'accreditation' && (
              <div className="max-w-md mx-auto bg-slate-800 border border-slate-700 rounded-3xl p-8 text-center space-y-6 animate-in fade-in duration-300">
                <div className="w-12 h-12 bg-[#2563EB]/20 text-[#60A5FA] rounded-2xl flex items-center justify-center mx-auto">
                  <QrCode className="h-6 w-6" />
                </div>
                <div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-mono font-bold rounded">
                    GAFETE ACREDITADO
                  </span>
                  <h4 className="text-xl font-display font-bold text-white mt-3">Lic. Carlos Eduardo Mendoza</h4>
                  <p className="text-xs text-slate-400 font-mono">VP de Operaciones Latam · TechCorp Inc.</p>
                </div>
                <div className="bg-white p-4 rounded-2xl w-44 h-44 mx-auto flex items-center justify-center shadow-lg">
                  <QrCode className="w-36 h-36 text-slate-900" />
                </div>
                <p className="text-[10px] text-slate-400 font-mono">ID ACREDITACIÓN: ONE-SUMMIT-2026-88492</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Tabla de Planes Corporativos ───────────────────────────── */}
      <section id="planes" className="py-20 md:py-32 px-6 bg-[#0B1120] border-t border-slate-800">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 space-y-4">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#60A5FA]">Planes & Precios B2B</p>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">
              Licencias Corporativas a la medida de tu evento
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CORPORATE_PLANES.map((plan) => (
              <div
                key={plan.id}
                className={`bg-slate-800/60 rounded-3xl p-8 border flex flex-col justify-between relative transition-all ${
                  plan.popular ? 'border-[#2563EB] shadow-2xl shadow-[#2563EB]/20 bg-slate-800' : 'border-slate-700/80'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#2563EB] text-white text-[10px] font-mono uppercase font-bold tracking-widest rounded-full shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-700/60">
                    <p className="text-4xl font-display font-extrabold text-white">
                      {plan.price} <span className="text-xs font-mono text-slate-400 font-normal">{plan.period}</span>
                    </p>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-slate-700/60">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs md:text-sm text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link to={`/login?redirect=/checkout?plan=${plan.id}`}>
                    <button className="w-full py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl text-xs uppercase font-bold tracking-widest transition-all shadow-lg active:scale-95">
                      {plan.cta}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer Institucional B2B ────────────────────────────────── */}
      <footer className="bg-[#070B14] text-white pt-16 pb-12 px-6 border-t border-slate-800">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-4">
              <Link to="/one" className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
                <img src="/logo-one.png?v=1" alt="Invitto One" className="h-9 w-auto object-contain" />
              </Link>
              <p className="text-xs text-slate-400 font-normal leading-relaxed">
                Vertical B2B de Invitto para la gestión tecnológica, acreditación QR y control de asistentes en congresos, cumbres y eventos institucionales.
              </p>
            </div>
            <div className="lg:col-span-4 space-y-3">
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-200">Soluciones</p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#pilares" className="hover:text-white transition-colors">Agenda Multi-Track</a></li>
                <li><a href="#pilares" className="hover:text-white transition-colors">Directorio de Ponentes</a></li>
                <li><a href="#pilares" className="hover:text-white transition-colors">Acreditación Executiva QR</a></li>
                <li><a href="#planes" className="hover:text-white transition-colors">Planes Enterprise</a></li>
              </ul>
            </div>
            <div className="lg:col-span-4 space-y-3">
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-200">Contacto Ejecutivo</p>
              <p className="text-xs text-slate-400">Atención prioritaria para corporativos y agencias en México.</p>
              <a href="mailto:enterprise@invitto.com.mx" className="text-xs text-[#60A5FA] font-mono font-bold hover:underline">enterprise@invitto.com.mx</a>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
            <p>© 2026 INVITTO ONE · VERTICAL B2B ENTERPRISE</p>
            <p>TECNOLOGÍA DE ACCESO SEGURO</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
