import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Seo from '../../components/Seo';
import Breadcrumb from '../../components/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  CheckSquare,
  Users,
  TrendingDown,
  ArrowRight,
  ChevronDown,
  Check,
  ExternalLink,
  PieChart,
  BellRing,
  Wallet,
  Briefcase
} from 'lucide-react';

const PLANNING_FAQS = [
  {
    q: '¿Qué diferencia hay entre este planeador y una plantilla de Excel?',
    a: 'Una hoja de Excel es estática: tienes que actualizar todo a mano, las fórmulas se rompen y no te avisa cuándo vencen los anticipos de tus proveedores. El Planeador de Invitto es un copiloto interactivo que está conectado en tiempo real a tus confirmaciones de asistencia (RSVP): si 10 invitados confirman o cancelan, recalcula al instante tu costo real por invitado, tus saldos pendientes y el acomodo de mesas sin que tengas que mover un dedo.',
  },
  {
    q: '¿Cómo funciona el cálculo del costo real por invitado?',
    a: 'Multiplica y divide en tiempo real el gasto real contratado entre los invitados confirmados por la invitación digital. Así sabes con precisión matemática cuánto estás invirtiendo por persona (platillo, mobiliario, bebidas, música prorrateada) y cuánto te ahorras con cada cancelación a tiempo antes de la fecha límite del banquetero.',
  },
  {
    q: '¿Mi pareja o mi wedding planner pueden ver el planeador?',
    a: '¡Sí! Puedes compartir un enlace de acceso privado en modo solo lectura con tu pareja, tus papás o tu wedding planner para que estén enterados del cronograma, presupuesto y pagos pendientes sin alterar la configuración.',
  },
  {
    q: '¿Ya viene con las tareas y rubros precargados?',
    a: 'Totalmente. Al activar el módulo no empiezas frente a una hoja en blanco: el sistema siembra automáticamente los 8 rubros de presupuesto nupcial más comunes en México y un checklist con más de 30 tareas ordenadas cronológicamente (12 meses, 6 meses, 3 meses, 1 mes y última semana).',
  },
  {
    q: '¿En qué plan de Invitto está disponible el planeador?',
    a: 'El módulo de Planeación Completa forma parte de nuestro Plan Pro (y superiores como Concierge). Si tienes una cuenta, puedes probar la demo interactiva en cualquier momento para ver cómo funciona con datos reales antes de contratar.',
  },
  {
    q: '¿Puedo registrar pagos parciales y anticipos a proveedores?',
    a: 'Sí. Por cada proveedor (salón, música, flores, fotografía, etc.) puedes registrar el costo total, cuánto diste de anticipo, las fechas límite de las parcialidades y marcar cada pago como "Pagado" o "Pendiente". El sistema te avisa cuáles están por vencer para evitar penalizaciones.',
  },
];

const CHECKLIST_PHASES = [
  {
    phase: '12 a 9 meses antes',
    badge: 'Cimientos y Presupuesto',
    tasks: [
      'Definir el presupuesto total máximo y fondo de imprevistos',
      'Crear lista inicial de invitados para calcular capacidad del salón',
      'Apartar fecha y salón / hacienda (generalmente requiere 30-50% de anticipo)',
      'Contratar fotógrafo y videógrafo (sus agendas se llenan con 1 año de anticipación)',
      'Elegir estilo de la boda (civil, religiosa, destino, jardín o salón)',
    ],
  },
  {
    phase: '8 a 6 meses antes',
    badge: 'Música, Menú y Save the Date',
    tasks: [
      'Degustación de menú y contratación del banquete',
      'Contratar grupo musical o DJ + iluminación arquitectónica',
      'Diseñar y enviar el Save The Date digital a invitados foráneos',
      'Elegir el vestido de novia y primer prueba de vestuario',
      'Contratar florista y definir paleta de colores del evento',
    ],
  },
  {
    phase: '5 a 3 meses antes',
    badge: 'Invitaciones y Trámites',
    tasks: [
      'Personalizar la invitación web interactiva con fotos, música y cuenta regresiva',
      'Cargar la lista de invitados con sus pases familiares en Invitto',
      'Abrir mesa de regalos (Liverpool, Amazon o CLABE bancaria)',
      'Iniciar trámites del registro civil o ceremonia religiosa',
      'Elegir y comprar alianzas matrimoniales',
    ],
  },
  {
    phase: '2 a 1 mes antes',
    badge: 'Cierre de Lista y Logística',
    tasks: [
      'Enviar las invitaciones oficiales por WhatsApp con link por familia',
      'Monitorear confirmaciones (RSVP) en tiempo real en tu panel',
      'Revisar restricciones alimentarias (vegetarianos, celíacos)',
      'Acomodar mesas definitivo con los invitados que dijeron "Sí"',
      'Liquidar anticipos restantes de proveedores según el calendario',
    ],
  },
  {
    phase: 'Última semana',
    badge: 'Detalles Finales',
    tasks: [
      'Exportar la lista final de confirmados en Excel para el banquetero',
      'Generar los códigos QR de acceso para la entrada del salón',
      'Ensayo general de la ceremonia y entrega de itinerario al cortejo',
      'Armar kit de emergencia para el gran día (costurero, analgésicos, retoque)',
      '¡Descansar y disfrutar el día más feliz de sus vidas!',
    ],
  },
];

export default function GuiaPlaneadorBodaPage() {
  const { user } = useAuth();
  const location = useLocation();

  // Interactive Simulator State
  const [totalBudget, setTotalBudget] = useState(250000);
  const [confirmedGuests, setConfirmedGuests] = useState(150);
  const [activeTab, setActiveTab] = useState<'presupuesto' | 'pagos' | 'checklist'>('presupuesto');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Preserve UTM params for CTAs
  const buildCtaUrl = (path: string) => {
    const params = new URLSearchParams(location.search);
    params.set('tipo', 'wedding');
    const qs = params.toString();
    return qs ? `${path}?${qs}` : path;
  };

  const primaryCta = buildCtaUrl(user ? '/dashboard/planeacion' : '/dashboard/new');

  // Simulator live calculations
  const costPerGuest = useMemo(() => {
    return Math.round(totalBudget / Math.max(1, confirmedGuests));
  }, [totalBudget, confirmedGuests]);

  const budgetBreakdown = useMemo(() => {
    return [
      { name: 'Banquete, Bebidas & Salón', pct: 48, amount: Math.round(totalBudget * 0.48), color: '#B8935A' },
      { name: 'Fotografía & Video Profesional', pct: 14, amount: Math.round(totalBudget * 0.14), color: '#3B82F6' },
      { name: 'Música, DJ & Audio/Luces', pct: 12, amount: Math.round(totalBudget * 0.12), color: '#8B5CF6' },
      { name: 'Flores & Decoración', pct: 10, amount: Math.round(totalBudget * 0.10), color: '#10B981' },
      { name: 'Vestuario, Ajuar & Maquillaje', pct: 8, amount: Math.round(totalBudget * 0.08), color: '#EC4899' },
      { name: 'Fondo de Imprevistos & Propinas', pct: 8, amount: Math.round(totalBudget * 0.08), color: '#64748B' },
    ];
  }, [totalBudget]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://invitto.com.mx/planeador-de-bodas',
    },
    headline: 'Planeador de Bodas Digital e Inteligente: La Guía Definitiva (2026)',
    description:
      'Descubre cómo organizar tu boda sin estrés financiero: control de presupuesto en vivo, cálculo de costo por invitado conectado al RSVP, calendario de anticipos a proveedores y checklist por meses.',
    image: 'https://invitto.com.mx/images/templates/classic-elegance-pro.jpg',
    author: {
      '@type': 'Organization',
      name: 'Equipo Editorial Invitto',
      url: 'https://invitto.com.mx',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Invitto',
      logo: {
        '@type': 'ImageObject',
        url: 'https://invitto.com.mx/logo.png',
      },
    },
    datePublished: '2026-02-10',
    dateModified: '2026-05-20',
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PLANNING_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1C1C] font-sans selection:bg-[#B8935A]/20">
      <Seo
        title="Planeador de Bodas Digital: Control de Presupuesto y Proveedores — Invitto"
        description="Organiza tu boda como un wedding planner profesional: copiloto de presupuesto en tiempo real, calendario de pagos a proveedores, costo por invitado y checklist nupcial en México."
        path="/planeador-de-bodas"
        jsonLd={[jsonLd, faqJsonLd]}
      />

      {/* ─── HEADER ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAF7F2]/90 border-b border-[#E3D9C9]">
        <div className="mx-auto max-w-6xl px-4 md:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img src="/logo.png?v=3" alt="Invitto" className="h-8 md:h-9 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs uppercase font-bold tracking-widest text-[#5E5850]">
            <a href="#simulador" className="hover:text-[#B8935A] transition-colors">Simulador</a>
            <a href="#pilares" className="hover:text-[#B8935A] transition-colors">Herramientas</a>
            <a href="#beneficios" className="hover:text-[#B8935A] transition-colors">Beneficios</a>
            <a href="#vs-excel" className="hover:text-[#B8935A] transition-colors">Vs Excel</a>
            <a href="#checklist" className="hover:text-[#B8935A] transition-colors">Checklist</a>
            <a href="#faq" className="hover:text-[#B8935A] transition-colors">Preguntas</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/planeacion/demo"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#5E5850] hover:text-[#1C1C1C] px-3 py-2 rounded-lg border border-[#E3D9C9] bg-white shadow-sm"
            >
              <span>Ver demo en vivo</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <Link
              to={primaryCta}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1C1C1C] text-[#FAF7F2] text-xs font-bold shadow-md hover:bg-[#333333] transition-all transform active:scale-95"
            >
              <span>Probar planeador</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="border-b border-[#E3D9C9]/60 bg-[#F2ECE2]/40">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-2.5">
          <Breadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Bodas', href: '/invitaciones-digitales-boda' },
              { label: 'Planeador de Bodas Digital' },
            ]}
          />
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 md:px-6 py-12 md:py-20 space-y-20 md:space-y-28">

        {/* ─── HERO ────────────────────────────────────────────────────────── */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B8935A]/15 text-[#8C6A35] text-xs font-bold tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Módulo Invitto Pro · Planeación Nupcial Inteligente</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight leading-[1.12] text-[#1C1C1C]">
            El Planeador de Bodas que <span className="italic font-normal text-[#B8935A]">piensa por ti</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5E5850] leading-relaxed max-w-2xl mx-auto">
            Olvídate de las hojas de Excel desactualizadas y las libretas con recibos perdidos. Controla tu presupuesto en tiempo real, anticipos a proveedores, checklist por fases y costo exacto por invitado conectado a tu invitación digital.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-semibold text-[#5E5850]">
            <span className="flex items-center gap-1.5 bg-[#F2ECE2] px-3.5 py-1.5 rounded-lg border border-[#E3D9C9]">
              <PieChart className="h-3.5 w-3.5 text-[#B8935A]" /> Presupuesto Estimado vs Real vs Pagado
            </span>
            <span className="flex items-center gap-1.5 bg-[#F2ECE2] px-3.5 py-1.5 rounded-lg border border-[#E3D9C9]">
              <BellRing className="h-3.5 w-3.5 text-emerald-600" /> Alertas de anticipos por vencer
            </span>
            <span className="flex items-center gap-1.5 bg-[#F2ECE2] px-3.5 py-1.5 rounded-lg border border-[#E3D9C9]">
              <Users className="h-3.5 w-3.5 text-[#B8935A]" /> Conectado al RSVP en vivo
            </span>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={primaryCta}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#1C1C1C] hover:bg-[#333333] text-white font-bold text-sm shadow-xl transition-transform active:scale-95"
            >
              <span>Comenzar a planear mi boda</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/dashboard/planeacion/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-[#FAF7F2] text-[#1C1C1C] font-bold text-sm border border-[#E3D9C9] shadow-sm transition-colors"
            >
              <span>Ver tablero demo en vivo</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* ─── SIMULADOR INTERACTIVO DEL COPILOTO ───────────────────────────── */}
        <section id="simulador" className="scroll-mt-24">
          <div className="rounded-3xl bg-gradient-to-b from-[#F2ECE2] to-[#FAF7F2] border border-[#E3D9C9] p-6 sm:p-10 shadow-lg space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs uppercase font-bold tracking-widest text-[#8C6A35]">
                Simulador Interactivo
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
                Calcula tu Presupuesto y Costo por Invitado
              </h2>
              <p className="text-sm sm:text-base text-[#5E5850]">
                Mueve los controles para ver cómo el algoritmo del copiloto distribuye tu presupuesto nupcial según los porcentajes recomendados en México:
              </p>
            </div>

            {/* Controles deslizantes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-[#E3D9C9] shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-[#1C1C1C]">Presupuesto Total Estimado</span>
                  <span className="text-lg font-serif text-[#B8935A]">
                    ${totalBudget.toLocaleString('es-MX')} MXN
                  </span>
                </div>
                <input
                  type="range"
                  min="60000"
                  max="600000"
                  step="10000"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full accent-[#B8935A] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#5E5850]">
                  <span>$60,000 MXN</span>
                  <span>$300,000 MXN</span>
                  <span>$600,000+ MXN</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-[#1C1C1C]">Invitados Confirmados (RSVP)</span>
                  <span className="text-lg font-serif text-[#1C1C1C]">
                    {confirmedGuests} personas
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="350"
                  step="10"
                  value={confirmedGuests}
                  onChange={(e) => setConfirmedGuests(Number(e.target.value))}
                  className="w-full accent-[#1C1C1C] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#5E5850]">
                  <span>30 invitados (íntima)</span>
                  <span>150 invitados (típica)</span>
                  <span>350+ invitados</span>
                </div>
              </div>
            </div>

            {/* Tarjetas de métricas calculadas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-[#E3D9C9] shadow-sm space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-[#5E5850]">Costo Real por Invitado</div>
                <div className="text-2xl sm:text-3xl font-serif font-extrabold text-[#B8935A]">
                  ${costPerGuest.toLocaleString('es-MX')} <span className="text-xs font-sans font-normal text-[#5E5850]">MXN/persona</span>
                </div>
                <p className="text-[11px] text-[#5E5850]">Incluye platillo, mobiliario, bebidas y servicios prorrateados.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E3D9C9] shadow-sm space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-[#5E5850]">Banquete + Salón (48%)</div>
                <div className="text-2xl sm:text-3xl font-serif font-extrabold text-[#1C1C1C]">
                  ${Math.round(totalBudget * 0.48).toLocaleString('es-MX')} <span className="text-xs font-sans font-normal text-[#5E5850]">MXN</span>
                </div>
                <p className="text-[11px] text-[#5E5850]">Monto recomendado máximo para locación y alimentos.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E3D9C9] shadow-sm space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-[#5E5850]">Fondo de Emergencia (8%)</div>
                <div className="text-2xl sm:text-3xl font-serif font-extrabold text-emerald-700">
                  ${Math.round(totalBudget * 0.08).toLocaleString('es-MX')} <span className="text-xs font-sans font-normal text-[#5E5850]">MXN</span>
                </div>
                <p className="text-[11px] text-[#5E5850]">Reserva intocable para horas extras, propinas e imprevistos.</p>
              </div>
            </div>

            {/* Pestañas de detalle */}
            <div className="bg-white rounded-2xl border border-[#E3D9C9] p-6 shadow-sm space-y-6">
              <div className="flex border-b border-[#E3D9C9] gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('presupuesto')}
                  className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                    activeTab === 'presupuesto'
                      ? 'border-[#B8935A] text-[#1C1C1C]'
                      : 'border-transparent text-[#5E5850] hover:text-[#1C1C1C]'
                  }`}
                >
                  Desglose por Rubros
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('pagos')}
                  className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                    activeTab === 'pagos'
                      ? 'border-[#B8935A] text-[#1C1C1C]'
                      : 'border-transparent text-[#5E5850] hover:text-[#1C1C1C]'
                  }`}
                >
                  Calendario de Anticipos (Simulado)
                </button>
              </div>

              {activeTab === 'presupuesto' && (
                <div className="space-y-4">
                  {budgetBreakdown.map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="font-semibold text-[#1C1C1C] flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          {item.name}
                        </span>
                        <span className="font-mono font-bold text-[#1C1C1C]">
                          ${item.amount.toLocaleString('es-MX')} MXN <span className="text-xs text-[#5E5850]">({item.pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-[#FAF7F2] h-2.5 rounded-full overflow-hidden border border-[#E3D9C9]/50">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'pagos' && (
                <div className="divide-y divide-[#E3D9C9] text-xs sm:text-sm">
                  {[
                    { provider: 'Hacienda San José (Salón)', concept: 'Anticipo 50%', amount: Math.round(totalBudget * 0.24), date: '15 de Mayo', status: 'Pagado', color: 'bg-emerald-100 text-emerald-800' },
                    { provider: 'Banquetes México Gourmet', concept: 'Segundo anticipo', amount: Math.round(totalBudget * 0.15), date: '30 de Junio', status: 'Por vencer (en 5 días)', color: 'bg-amber-100 text-amber-800 font-bold' },
                    { provider: 'Lente & Amor Fotografía', concept: 'Liquidación final', amount: Math.round(totalBudget * 0.10), date: 'Semana del evento', status: 'Pendiente', color: 'bg-slate-100 text-slate-700' },
                  ].map((pay, idx) => (
                    <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-[#1C1C1C]">{pay.provider}</div>
                        <div className="text-xs text-[#5E5850]">{pay.concept} · Fecha: {pay.date}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-[#1C1C1C]">${pay.amount.toLocaleString('es-MX')} MXN</span>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] ${pay.color}`}>{pay.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─── CAPÍTULO 1: LA PESADILLA DEL EXCEL ───────────────────────────── */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8C6A35]">Capítulo 1</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
              ¿Por qué el 75% de las parejas se pasa de su presupuesto de boda?
            </h2>
          </div>

          <p className="text-base sm:text-lg text-[#5E5850] leading-relaxed">
            Planear una boda en México involucra en promedio <strong>entre 12 y 20 proveedores distintos</strong> (salón, banquete, música, barra de alcohol, flores, foto, video, ajuar, transporte, souvenirs, pastel y juez/iglesia).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-white border border-rose-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                ✕
              </div>
              <h3 className="font-bold text-base text-[#1C1C1C]">Fórmulas de Excel que nadie actualiza</h3>
              <p className="text-xs sm:text-sm text-[#5E5850] leading-relaxed">
                Empiezas con una plantilla descargada de internet. A los dos meses alguien borra una celda, la suma no cuadra y ya no sabes cuánto dinero real queda en la cuenta de banco.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-rose-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                ✕
              </div>
              <h3 className="font-bold text-base text-[#1C1C1C]">Anticipos olvidados y penalizaciones</h3>
              <p className="text-xs sm:text-sm text-[#5E5850] leading-relaxed">
                El DJ o el florista pedían el 30% restante dos semanas antes. Si se te olvida la fecha, te arriesgas a recargos o incluso a perder la fecha apartada.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-rose-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                ✕
              </div>
              <h3 className="font-bold text-base text-[#1C1C1C]">Desconexión total con los invitados</h3>
              <p className="text-xs sm:text-sm text-[#5E5850] leading-relaxed">
                Tu presupuesto dice que presupuestaste 180 personas, pero por WhatsApp solo te confirmaron 140. Sigues pagando platillos extra al salón porque tu lista no se comunica con tus finanzas.
              </p>
            </div>
          </div>
        </section>

        {/* ─── CAPÍTULO 2: LOS 4 PILARES DE INVITTO PRO ─────────────────────── */}
        <section id="pilares" className="space-y-8 scroll-mt-24">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8C6A35]">Capítulo 2</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
              Las 4 herramientas clave del Planeador de Invitto
            </h2>
            <p className="text-base text-[#5E5850]">
              Diseñado desde cero bajo una sola premisa: <strong>todo el evento se calcula automáticamente para que la pareja no tenga que hacer trabajo manual</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-7 rounded-3xl bg-white border border-[#E3D9C9] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#B8935A] flex items-center justify-center border border-[#E3D9C9]">
                <TrendingDown className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1C1C1C]">
                1. El Copiloto Automático en Tiempo Real
              </h3>
              <p className="text-xs sm:text-sm text-[#5E5850] leading-relaxed">
                El corazón del sistema. Una sola función en vivo cruza tu presupuesto contratado con los invitados confirmados de tu invitación digital. Te dice en tiempo real cuántos días faltan, cuál es tu próximo pago urgente, cuántos pagos tienes vencidos y cuánto estás pagando por invitado.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#E3D9C9] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#B8935A] flex items-center justify-center border border-[#E3D9C9]">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1C1C1C]">
                2. Estimado vs. Real vs. Pagado
              </h3>
              <p className="text-xs sm:text-sm text-[#5E5850] leading-relaxed">
                Tres cifras claras que nunca se contradicen:
                <br />
                • <strong>Estimado:</strong> Lo que planeabas gastar por categoría.
                <br />
                • <strong>Real Contratado:</strong> El costo final pactado con tus proveedores.
                <br />
                • <strong>Pagado:</strong> La suma exacta de recibos y anticipos ya transferidos.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#E3D9C9] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#B8935A] flex items-center justify-center border border-[#E3D9C9]">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1C1C1C]">
                3. Directorio de Proveedores & Pagos
              </h3>
              <p className="text-xs sm:text-sm text-[#5E5850] leading-relaxed">
                Guarda los contratos, teléfonos, contactos y montos de cada proveedor (cotizando, contratado o cancelado). Desglosa cada servicio en anticipo, parcialidades y liquidación final con fechas de vencimiento.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#E3D9C9] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#B8935A] flex items-center justify-center border border-[#E3D9C9]">
                <CheckSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1C1C1C]">
                4. Checklist Precargado para México
              </h3>
              <p className="text-xs sm:text-sm text-[#5E5850] leading-relaxed">
                Al activar tu boda, el planeador siembra un checklist inteligente de más de 30 tareas ordenadas por fases. Solo marcas las casillas conforme vas completando y agregas tareas personalizadas si las necesitas.
              </p>
            </div>
          </div>
        </section>

        {/* ─── CAPÍTULO 3: BENEFICIOS PARA LA PAREJA ───────────────────────── */}
        <section id="beneficios" className="rounded-3xl bg-[#1C1C1C] text-[#FAF7F2] p-8 sm:p-14 space-y-8 shadow-xl">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#B8935A]">Capítulo 3</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">
              ¿Qué ganas al tener tu planeación en la misma plataforma de tus invitaciones?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              La magia ocurre cuando tu logística y tus invitados viven bajo el mismo techo digital:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-2xl font-bold font-serif text-[#B8935A]">01</div>
              <h3 className="font-bold text-base text-white">Ahorro de $15,000+</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Al tener claridad del costo por persona, evitas confirmar platillos de más que nadie se comerá.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-2xl font-bold font-serif text-[#B8935A]">02</div>
              <h3 className="font-bold text-base text-white">Paz Mental</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sabes exactamente cuánto debes pagar este mes y qué proveedores ya están cubiertos al 100%.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-2xl font-bold font-serif text-[#B8935A]">03</div>
              <h3 className="font-bold text-base text-white">Acomodo de Mesas</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Como tus invitados ya están en el sistema, solo los arrastras a la mesa 1, 2 o 3 sin recapturar nombres.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-2xl font-bold font-serif text-[#B8935A]">04</div>
              <h3 className="font-bold text-base text-white">Enlace Compartible</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Comparte un enlace de consulta con tu wedding planner o tus papás con un solo clic.
              </p>
            </div>
          </div>
        </section>

        {/* ─── CAPÍTULO 4: TABLA COMPARATIVA VS ALTERNATIVAS ───────────────── */}
        <section id="vs-excel" className="space-y-6 scroll-mt-24">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8C6A35]">Capítulo 4</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
              Comparativa: ¿Cómo se compara con otras opciones?
            </h2>
            <p className="text-base text-[#5E5850]">
              Analizamos las formas más comunes en que las parejas gestionan su boda en México:
            </p>
          </div>

          <div className="rounded-2xl border border-[#E3D9C9] bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#F2ECE2] border-b border-[#E3D9C9] text-[#1C1C1C]">
                    <th className="p-4 font-bold">Función</th>
                    <th className="p-4 font-semibold text-[#5E5850]">Libreta / Papel</th>
                    <th className="p-4 font-semibold text-[#5E5850]">Excel / Sheets</th>
                    <th className="p-4 font-semibold text-[#5E5850]">Apps Extranjeras (The Knot/Zola)</th>
                    <th className="p-4 font-bold text-emerald-900 bg-emerald-50/60">Invitto Planeador Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3D9C9]">
                  <tr>
                    <td className="p-4 font-semibold text-[#1C1C1C]">Cálculo en tiempo real con RSVP</td>
                    <td className="p-4 text-rose-600 font-bold">✕</td>
                    <td className="p-4 text-rose-600 font-bold">✕ (manual)</td>
                    <td className="p-4 text-rose-600 font-bold">✕</td>
                    <td className="p-4 text-emerald-800 bg-emerald-50/30 font-bold">✓ 100% Automático</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#1C1C1C]">Moneda y costos reales en México</td>
                    <td className="p-4 text-slate-500">Depende de ti</td>
                    <td className="p-4 text-slate-500">Depende de ti</td>
                    <td className="p-4 text-rose-600 font-bold">✕ (En dólares USD)</td>
                    <td className="p-4 text-emerald-800 bg-emerald-50/30 font-bold">✓ Pesos Mexicanos (MXN)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#1C1C1C]">Alertas de anticipos por vencer</td>
                    <td className="p-4 text-rose-600 font-bold">✕</td>
                    <td className="p-4 text-rose-600 font-bold">✕</td>
                    <td className="p-4 text-amber-600">Parcial</td>
                    <td className="p-4 text-emerald-800 bg-emerald-50/30 font-bold">✓ En tu tablero diario</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#1C1C1C]">Checklist nupcial precargado</td>
                    <td className="p-4 text-rose-600 font-bold">✕</td>
                    <td className="p-4 text-rose-600 font-bold">✕</td>
                    <td className="p-4 text-slate-600">Genérico EE.UU.</td>
                    <td className="p-4 text-emerald-800 bg-emerald-50/30 font-bold">✓ Específico para bodas en México</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#1C1C1C]">Acomodo de mesas con confirmados</td>
                    <td className="p-4 text-rose-600 font-bold">✕</td>
                    <td className="p-4 text-rose-600 font-bold">✕</td>
                    <td className="p-4 text-amber-600">Separado</td>
                    <td className="p-4 text-emerald-800 bg-emerald-50/30 font-bold">✓ Arrastra a tus confirmados</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#1C1C1C]">Disponibilidad en el celular</td>
                    <td className="p-4 text-rose-600 font-bold">✕ Solo en casa</td>
                    <td className="p-4 text-amber-600">Incómodo</td>
                    <td className="p-4 text-slate-600">App pesada</td>
                    <td className="p-4 text-emerald-800 bg-emerald-50/30 font-bold">✓ Web móvil sin instalar nada</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─── CAPÍTULO 5: CHECKLIST NUPCIAL POR MESES ─────────────────────── */}
        <section id="checklist" className="space-y-6 scroll-mt-24">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8C6A35]">Capítulo 5</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
              El Cronograma Ideal de una Boda en México
            </h2>
            <p className="text-base text-[#5E5850]">
              Este es el orden cronológico que nuestro planeador siembra automáticamente para guiarte paso a paso:
            </p>
          </div>

          <div className="space-y-4">
            {CHECKLIST_PHASES.map((phase, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#E3D9C9] shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3D9C9]/60 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#1C1C1C] text-[#FAF7F2] font-serif font-bold flex items-center justify-center text-sm">
                      {idx + 1}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#1C1C1C]">{phase.phase}</h3>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#B8935A]/15 text-[#8C6A35] self-start sm:self-auto">
                    {phase.badge}
                  </span>
                </div>

                <ul className="space-y-2 pt-1 text-xs sm:text-sm text-[#5E5850]">
                  {phase.tasks.map((task, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CAPÍTULO 6: PREGUNTAS FRECUENTES (FAQ) ──────────────────────── */}
        <section id="faq" className="space-y-6 scroll-mt-24">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8C6A35]">Capítulo 6</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
              Preguntas Frecuentes sobre el Planeador
            </h2>
            <p className="text-sm sm:text-base text-[#5E5850]">
              Resolvemos tus dudas antes de que comiences a organizar:
            </p>
          </div>

          <div className="divide-y divide-[#E3D9C9] border-y border-[#E3D9C9]">
            {PLANNING_FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left flex justify-between items-center gap-4 py-2 hover:opacity-80 transition-opacity"
                  >
                    <span className="font-serif font-bold text-base sm:text-lg text-[#1C1C1C]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-[#B8935A] flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pt-2 pb-4 text-xs sm:text-sm text-[#5E5850] leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── BANNER FINAL ────────────────────────────────────────────────── */}
        <section className="rounded-3xl bg-gradient-to-br from-[#1C1C1C] to-[#2B2725] text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-[#B8935A]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
              Comienza hoy mismo
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">
              Toma el control de tu boda. Sin números rojos ni sorpresas.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Descubre por qué cientos de parejas en México gestionan sus proveedores, presupuestos y confirmaciones en un solo lugar.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={primaryCta}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#B8935A] hover:bg-[#A37F47] text-white font-bold text-sm shadow-xl transition-transform active:scale-95"
              >
                <span>Activar mi planeador gratis</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/dashboard/planeacion/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-colors"
              >
                <span>Explorar la demo con datos reales</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            <p className="text-[11px] text-slate-400">
              Garantía de satisfacción de 7 días · Sin suscripciones forzosas · Soporte en México por WhatsApp
            </p>
          </div>
        </section>

      </main>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#E3D9C9] bg-[#F2ECE2] py-12 px-4 md:px-6 text-xs text-[#5E5850]">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img src="/logo.png?v=3" alt="Invitto" className="h-7 w-auto object-contain opacity-80" />
            </Link>
            <span>© {new Date().getFullYear()} Invitto. La plataforma #1 de bodas y eventos en México.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/invitaciones-digitales-boda" className="hover:underline">Invitaciones de Boda</Link>
            <Link to="/invitaciones-digitales-de-boda" className="hover:underline">Guía de Bodas</Link>
            <Link to="/planes" className="hover:underline">Planes y Precios</Link>
            <Link to="/blog" className="hover:underline">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
