import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Seo from '../../components/Seo';
import Breadcrumb from '../../components/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  MailOpen,
  Music,
  MapPin,
  Calendar,
  Users,
  QrCode,
  Gift,
  Shirt,
  ArrowRight,
  ChevronDown,
  Copy,
  Clock,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Check,
  Volume2
} from 'lucide-react';

const WEDDING_DEMOS = [
  {
    name: 'Ana & Carlos',
    style: 'Clásica Lujo / Editorial',
    slug: 'boda-ana-y-carlos-premium',
    thumbnail: '/images/templates/classic-elegance-pro.jpg',
    badge: 'Más popular',
  },
  {
    name: 'Isabel & Rodrigo',
    style: 'Romántica Atemporal',
    slug: 'boda-isabel-rodrigo-premium',
    thumbnail: '/images/templates/classic.jpg',
    badge: 'Elegante',
  },
  {
    name: 'Gabriela & Arturo',
    style: 'Moderna Minimalista',
    slug: 'boda-gabriela-arturo-premium',
    thumbnail: '/images/templates/modern-minimalist.jpg',
    badge: 'Vanguardia',
  },
  {
    name: 'Elena & Sebastián',
    style: 'Lacre Rojo Nupcial',
    slug: 'boda-lacre-rojo',
    thumbnail: '/images/templates/lacre-rojo.jpg',
    badge: 'Sobre y Lacre',
  },
  {
    name: 'Camila & Mateo',
    style: 'Simetría Floral / Jardín',
    slug: 'boda-simetria-floral',
    thumbnail: '/images/templates/floral-symmetry.jpg',
    badge: 'Jardín y Hacienda',
  },
  {
    name: 'Valentina & Daniel',
    style: 'Boda Destino / Pase',
    slug: 'boda-destino-premium',
    thumbnail: '/images/templates/passport.jpg',
    badge: 'Boda Destino',
  },
];

const FAQS = [
  {
    q: '¿Cómo funciona una invitación digital de boda?',
    a: 'Es una página web interactiva personalizada con su historia, fotos, itinerario y cuenta regresiva. Se envía mediante un enlace privado por WhatsApp o correo. Al abrirlo, el invitado experimenta la apertura de un sobre animado con música y confirma su asistencia con un solo clic, sin descargar ninguna aplicación.',
  },
  {
    q: '¿Qué pasa con los abuelos o familiares mayores que no usan mucha tecnología?',
    a: 'Es una de las dudas más frecuentes. La invitación de Invitto está diseñada para que cualquier persona que sepa abrir un mensaje de WhatsApp pueda usarla. No requiere crear cuentas, ni contraseñas, ni bajar apps. Solo tocan el botón verde de "Confirmar Asistencia". Si lo prefieren, también pueden imprimir un puñado de invitaciones en papel para abuelos y mandar digital al 95% restante.',
  },
  {
    q: '¿Puedo corregir datos si cambia la hora o el lugar después de mandarla?',
    a: '¡Sí, esa es una de las mayores ventajas! Con las de papel tendrías que reimprimir todo y gastar miles de pesos. En Invitto, cualquier cambio que hagas en tu panel se actualiza de inmediato para todos tus invitados sin cambiar de enlace.',
  },
  {
    q: '¿Cómo funciona la confirmación de pases por familia?',
    a: 'Tú defines cuántos pases tiene asignados cada familia o invitado (por ejemplo, "Familia Martínez - 3 pases"). Cuando ellos abren su link personalizado, solo pueden confirmar hasta el número de lugares que les otorgaste. Nadie puede llegar con "un amigo más" sin avisar.',
  },
  {
    q: '¿Cuánto tiempo permanece activa mi invitación?',
    a: 'Tu invitación permanece en línea desde el día en que la publicas hasta 30 días después de la boda, para que tus invitados sigan consultando la mesa de regalos, mapas y fotos del evento.',
  },
  {
    q: '¿Qué formas de pago aceptan en México?',
    a: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, AMEX), pago en efectivo en OXXO, transferencias SPEI, Apple Pay, Google Pay y hasta meses sin intereses en planes seleccionados.',
  },
];

export default function GuiaInvitacionesBodaPage() {
  const { user } = useAuth();
  const location = useLocation();

  // Interactive envelope simulator state
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Preserve UTM params for CTAs
  const buildCtaUrl = (path: string) => {
    const params = new URLSearchParams(location.search);
    params.set('tipo', 'wedding');
    const qs = params.toString();
    return qs ? `${path}?${qs}` : path;
  };

  const primaryCta = buildCtaUrl(user ? '/dashboard' : '/dashboard/new');

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(index);
    setTimeout(() => setCopiedTemplate(null), 2500);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://invitto.com.mx/invitaciones-digitales-de-boda',
    },
    headline: 'Guía Completa de Invitaciones Digitales de Boda: Todo lo que necesitas saber',
    description:
      'Descubre cómo funcionan las invitaciones de boda digitales e interactivas: sobre virtual con lacre, música, confirmación RSVP inteligente por WhatsApp y comparativa de costos vs papel.',
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
    datePublished: '2026-01-15',
    dateModified: '2026-05-20',
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
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
        title="Invitaciones Digitales de Boda: La Guía Definitiva (2026) — Invitto"
        description="Todo sobre las invitaciones de boda digitales e interactivas en formato web: sobre con sello de lacre, música, RSVP inteligente, mapa al salón y ahorro de más de $10,000 MXN."
        path="/invitaciones-digitales-de-boda"
        jsonLd={[jsonLd, faqJsonLd]}
      />

      {/* ─── NAVEGACIÓN SUPERIOR ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAF7F2]/90 border-b border-[#E3D9C9]">
        <div className="mx-auto max-w-6xl px-4 md:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img src="/logo.png?v=3" alt="Invitto" className="h-8 md:h-9 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs uppercase font-bold tracking-widest text-[#5E5850]">
            <a href="#que-son" className="hover:text-[#B8935A] transition-colors">¿Qué son?</a>
            <a href="#sobre-digital" className="hover:text-[#B8935A] transition-colors">Sobre Digital</a>
            <a href="#funciones" className="hover:text-[#B8935A] transition-colors">Qué incluyen</a>
            <a href="#vs-papel" className="hover:text-[#B8935A] transition-colors">Vs Papel</a>
            <a href="#demos" className="hover:text-[#B8935A] transition-colors">Demos</a>
            <a href="#faq" className="hover:text-[#B8935A] transition-colors">Preguntas</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to={primaryCta}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1C1C1C] text-[#FAF7F2] text-xs font-bold shadow-md hover:bg-[#333333] transition-all transform active:scale-95"
            >
              <span>Crear gratis</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb bar */}
      <div className="border-b border-[#E3D9C9]/60 bg-[#F2ECE2]/40">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-2.5">
          <Breadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Bodas', href: '/invitaciones-digitales-boda' },
              { label: 'Guía Completa de Invitaciones de Boda' },
            ]}
          />
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 md:px-6 py-12 md:py-20 space-y-20 md:space-y-28">

        {/* ─── HERO INTRODUCTORIO ───────────────────────────────────────────── */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B8935A]/15 text-[#8C6A35] text-xs font-bold tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Guía Nupcial 2026 · Edición Definitiva</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight leading-[1.12] text-[#1C1C1C]">
            Invitaciones Digitales de Boda: <span className="italic font-normal text-[#B8935A]">La Guía Completa</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5E5850] leading-relaxed max-w-2xl mx-auto">
            Todo lo que necesitas saber antes de anunciar el día más importante de tu vida: el efecto del sobre interactivo con lacre, música, confirmación inteligente (RSVP) por WhatsApp y cómo ahorrar más de $10,000 pesos frente al papel tradicional.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-semibold text-[#5E5850]">
            <span className="flex items-center gap-1.5 bg-[#F2ECE2] px-3 py-1.5 rounded-lg border border-[#E3D9C9]">
              <Clock className="h-3.5 w-3.5 text-[#B8935A]" /> 8 min de lectura
            </span>
            <span className="flex items-center gap-1.5 bg-[#F2ECE2] px-3 py-1.5 rounded-lg border border-[#E3D9C9]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Probado en +5,000 bodas
            </span>
            <span className="flex items-center gap-1.5 bg-[#F2ECE2] px-3 py-1.5 rounded-lg border border-[#E3D9C9]">
              <Smartphone className="h-3.5 w-3.5 text-[#B8935A]" /> Sin apps que descargar
            </span>
          </div>
        </section>

        {/* ─── SIMULADOR INTERACTIVO DEL SOBRE VIRTUAL ─────────────────────── */}
        <section id="sobre-digital" className="scroll-mt-24">
          <div className="rounded-3xl bg-gradient-to-b from-[#F2ECE2] to-[#FAF7F2] border border-[#E3D9C9] p-6 sm:p-10 shadow-lg relative overflow-hidden">
            <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
              <span className="text-xs uppercase font-bold tracking-widest text-[#8C6A35]">
                La Experiencia del Invitado
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
                El Sobre Digital con Sello de Lacre
              </h2>
              <p className="text-sm sm:text-base text-[#5E5850]">
                Toca el sobre a continuación para simular lo que sentirán tus familiares y amigos cuando reciban su enlace por WhatsApp:
              </p>
            </div>

            {/* Stage del Sobre */}
            <div className="max-w-md mx-auto relative flex flex-col items-center">
              <div
                onClick={() => setEnvelopeOpen(!envelopeOpen)}
                className="w-full max-w-[360px] aspect-[4/3] rounded-2xl bg-[#EFE6D6] border-2 border-[#D9C8B0] shadow-2xl relative cursor-pointer select-none transition-transform duration-300 hover:scale-[1.02] flex items-center justify-center p-6 text-center overflow-hidden"
              >
                {/* Solapa superior que se abre */}
                <div
                  className={`absolute left-0 right-0 top-0 h-[60%] bg-[#E4D5BE] border-b border-[#D4C3A9] transition-transform duration-700 origin-top z-20 ${
                    envelopeOpen ? '-rotate-180 opacity-0' : 'rotate-0 opacity-100'
                  }`}
                  style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                />

                {/* Sello de Lacre */}
                {!envelopeOpen && (
                  <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center animate-bounce">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A62B2B] to-[#7A1C1C] text-white flex items-center justify-center font-serif text-xl font-bold shadow-lg border-2 border-[#8C1F1F]">
                      A & C
                    </div>
                    <span className="mt-2 text-[11px] font-bold tracking-wider uppercase bg-[#1C1C1C] text-white px-3 py-1 rounded-full shadow-md">
                      Toca para abrir ✨
                    </span>
                  </div>
                )}

                {/* Tarjeta interior revelada */}
                <div
                  className={`w-full h-full rounded-xl bg-[#FAF7F2] border border-[#E3D9C9] p-4 flex flex-col justify-between items-center text-center transition-all duration-700 ${
                    envelopeOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#8C6A35] uppercase tracking-widest">
                      <Volume2 className="h-3 w-3 animate-pulse text-emerald-600" />
                      <span>Sonando: “Can’t Help Falling in Love”</span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-[#1C1C1C]">Ana & Carlos</h3>
                    <p className="text-xs text-[#5E5850]">14 de Noviembre · Hacienda San José</p>
                  </div>

                  <div className="w-full bg-[#F2ECE2] rounded-lg p-2 text-xs border border-[#E3D9C9]">
                    <span className="font-bold text-[#1C1C1C]">Familia Ramírez</span>
                    <span className="block text-[10px] text-[#5E5850]">4 pases reservados</span>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2 px-3 rounded-lg bg-emerald-700 text-white text-xs font-bold shadow-sm"
                  >
                    ✓ Confirmar Asistencia
                  </button>
                </div>
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setEnvelopeOpen(!envelopeOpen)}
                  className="text-xs font-bold text-[#B8935A] underline underline-offset-4 hover:opacity-80"
                >
                  {envelopeOpen ? '← Cerrar sobre de nuevo' : 'Toca el sobre para abrir'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CAPÍTULO 1: ¿QUÉ ES UNA INVITACIÓN WEB? ─────────────────────── */}
        <section id="que-son" className="space-y-6 scroll-mt-24">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8C6A35]">Capítulo 1</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
              ¿Qué es realmente una invitación digital de boda interactiva?
            </h2>
          </div>

          <p className="text-base sm:text-lg text-[#5E5850] leading-relaxed">
            Muchos novios piensan que una invitación digital es simplemente un archivo PDF o una imagen JPG diseñada en Canva y mandada por WhatsApp. <strong>Ese es el error más común</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-white border border-rose-200 shadow-sm space-y-3">
              <div className="inline-block px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 text-xs font-bold">
                ✕ El PDF o Imagen Estática (Lo que ya no funciona)
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#5E5850]">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Los invitados la abren, la ven 3 segundos y se pierde entre los 500 chats de WhatsApp.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>No tiene música, mapas interactivos ni botones dinámicos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span><strong>No confirma nada</strong>: tienes que escribirle a cada uno: <em>“¿Oye tía, si vas a ir?”</em>.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-emerald-300 shadow-sm space-y-3 ring-1 ring-emerald-200">
              <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                ✓ La Invitación Web Interactiva de Invitto
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#5E5850]">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Es un <strong>minisitio web privado</strong> diseñado exclusivamente para tu boda.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Animación del sobre, su canción favorita sonando de fondo y cuenta regresiva.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>RSVP inteligente</strong>: cada familia responde con un toque y la lista se arma sola en tiempo real.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ─── CAPÍTULO 2: ANATOMÍA DE LA INVITACIÓN PERFECTA ──────────────── */}
        <section id="funciones" className="space-y-8 scroll-mt-24">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8C6A35]">Capítulo 2</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
              Anatomía de una invitación de boda: todo lo que debe incluir
            </h2>
            <p className="text-base text-[#5E5850]">
              Para que tu invitación sea un éxito total y resuelva todas las dudas de tus invitados sin que tengan que molestarte, debe contener estos 8 elementos esenciales:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: MailOpen,
                title: 'Sobre con Lacre',
                desc: 'Apertura inmersiva con textura de papel y sello con las iniciales de la pareja.',
              },
              {
                icon: Music,
                title: 'Música de Fondo',
                desc: 'Su canción especial comienza al abrir el sobre, creando la atmósfera romántica perfecta.',
              },
              {
                icon: Calendar,
                title: 'Itinerario Detallado',
                desc: 'Horarios exactos para la ceremonia religiosa, cóctel de bienvenida, banquete y fiesta.',
              },
              {
                icon: MapPin,
                title: 'Mapas con 1 Clic',
                desc: 'Enlaces directos a Google Maps y Waze para que nadie se pierda en el camino.',
              },
              {
                icon: Shirt,
                title: 'Dress Code & Paleta',
                desc: 'Código de vestimenta con guía visual de colores sugeridos o reservados para los novios.',
              },
              {
                icon: Gift,
                title: 'Mesa de Regalos',
                desc: 'Liverpool, Amazon, tiendas departamentales o datos CLABE directos sin comisiones.',
              },
              {
                icon: Users,
                title: 'Control de Pases',
                desc: 'Asignación personalizada por familia (ej. 2 adultos y 1 niño) para evitar colados.',
              },
              {
                icon: QrCode,
                title: 'Pase con Código QR',
                desc: 'Acceso seguro al salón y check-in digital en la puerta sin listas de papel arrugadas.',
              },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-[#E3D9C9] shadow-sm space-y-2 hover:-translate-y-1 transition-transform"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#B8935A] flex items-center justify-center border border-[#E3D9C9]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#1C1C1C]">{feat.title}</h3>
                  <p className="text-xs text-[#5E5850] leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── CAPÍTULO 3: LA REVOLUCIÓN DEL RSVP ──────────────────────────── */}
        <section className="rounded-3xl bg-[#1C1C1C] text-[#FAF7F2] p-8 sm:p-12 space-y-8 shadow-xl">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#B8935A]">Capítulo 3</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">
              La revolución del RSVP: cómo confirmar asistencia sin estrés
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Preguntarle a cada invitado si va a ir es una de las tareas más desgastantes y agotadoras de planear una boda. Con Invitto, la confirmación ocurre sola:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-2xl font-bold font-serif text-[#B8935A]">01</div>
              <h3 className="font-bold text-base text-white">Link por familia</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cada invitado recibe un mensaje con su enlace único. Al abrirlo, ve su nombre y el número exacto de lugares reservados.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-2xl font-bold font-serif text-[#B8935A]">02</div>
              <h3 className="font-bold text-base text-white">Menú y Alergias</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tus invitados pueden indicarte si son vegetarianos, celíacos o tienen alguna restricción alimentaria para el banquetero.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-2xl font-bold font-serif text-[#B8935A]">03</div>
              <h3 className="font-bold text-base text-white">Excel en tiempo real</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Todo se sincroniza automáticamente en tu panel. Cuando el salón te pida el número final, descargas la lista con un solo clic.
              </p>
            </div>
          </div>
        </section>

        {/* ─── CAPÍTULO 4: TABLA COMPARATIVA VS PAPEL ──────────────────────── */}
        <section id="vs-papel" className="space-y-6 scroll-mt-24">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8C6A35]">Capítulo 4</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
              Invitaciones Digitales vs. Papel Tradicional
            </h2>
            <p className="text-base text-[#5E5850]">
              ¿Vale la pena gastar miles de pesos en imprenta tradicional? Veamos los números y hechos reales:
            </p>
          </div>

          <div className="rounded-2xl border border-[#E3D9C9] bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#F2ECE2] border-b border-[#E3D9C9] text-[#1C1C1C]">
                    <th className="p-4 font-bold">Criterio</th>
                    <th className="p-4 font-bold text-rose-800 bg-rose-50/50">Papel Tradicional</th>
                    <th className="p-4 font-bold text-emerald-900 bg-emerald-50/60">Invitto Digital</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3D9C9]">
                  <tr>
                    <td className="p-4 font-semibold text-[#1C1C1C]">Costo promedio (150 invitados)</td>
                    <td className="p-4 text-rose-700 bg-rose-50/20 font-medium">$12,000 – $22,000 MXN</td>
                    <td className="p-4 text-emerald-800 bg-emerald-50/30 font-bold">$499 – $1,699 MXN (Pago único)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#1C1C1C]">Tiempo de entrega</td>
                    <td className="p-4 text-[#5E5850]">3 a 6 semanas de imprenta</td>
                    <td className="p-4 text-emerald-800 font-bold">Inmediato (la armas en 5 minutos)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#1C1C1C]">¿Qué pasa si hay un error en la fecha u hora?</td>
                    <td className="p-4 text-rose-700">Reimpresión completa y volver a pagar</td>
                    <td className="p-4 text-emerald-800 font-semibold">Lo editas en segundos sin costo</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#1C1C1C]">Confirmación de asistencia (RSVP)</td>
                    <td className="p-4 text-[#5E5850]">Manual (llamar o mandar mensajes uno a uno)</td>
                    <td className="p-4 text-emerald-800 font-bold">Automática en tiempo real con Excel</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#1C1C1C]">Mapas y ubicación</td>
                    <td className="p-4 text-[#5E5850]">Croquis impreso estático</td>
                    <td className="p-4 text-emerald-800 font-semibold">Google Maps y Waze directo en el celular</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#1C1C1C]">Impacto ecológico</td>
                    <td className="p-4 text-[#5E5850]">Hojas, tintas y sobres desechados</td>
                    <td className="p-4 text-emerald-800 font-semibold">100% ecológico, cero desperdicio</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-[#8C6A35] font-semibold">
            💡 <strong>Consejo pro de wedding planners:</strong> Imprime 5 a 10 recuerdos en papel únicamente para abuelos y papás, y usa Invitto para el 95% de tus invitados. Te ahorras más de $15,000 MXN para tu luna de miel.
          </p>
        </section>

        {/* ─── CAPÍTULO 5: PROTOCOLO Y PLANTILLAS DE WHATSAPP ──────────────── */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8C6A35]">Capítulo 5</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
              Protocolo y Etiqueta: ¿Cómo mandarla por WhatsApp?
            </h2>
            <p className="text-base text-[#5E5850]">
              El secreto para que una invitación digital se sienta elegante y personal es el mensaje que acompaña al enlace. No envíes mensajes masivos sin nombre. Utiliza estas plantillas probadas:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plantilla 1 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E3D9C9] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B8935A]">Para Familiares y Amigos Cercanos</span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      '¡Hola Familia González! ✨ Con muchísima emoción queremos compartirles que nos casamos. Diseñamos con todo nuestro cariño esta invitación con todos los detalles de nuestra boda (itinerario, mapa y mesa de regalos). Les dejamos aquí su enlace personal para que puedan verla y confirmar su asistencia: https://invitto.com.mx/i/tu-boda ¡Nos dará enorme felicidad verlos ahí! Con cariño, Ana & Diego 💍',
                      1
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5E5850] hover:text-[#1C1C1C]"
                >
                  {copiedTemplate === 1 ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar texto</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E3D9C9] text-xs sm:text-sm text-[#1C1C1C] leading-relaxed font-mono">
                ¡Hola Familia González! ✨ Con muchísima emoción queremos compartirles que nos casamos. Diseñamos con todo nuestro cariño esta invitación con todos los detalles de nuestra boda (itinerario, mapa y mesa de regalos). Les dejamos aquí su enlace personal para que puedan verla y confirmar su asistencia:
                <br /><br />
                👉 <strong>https://invitto.com.mx/i/tu-boda</strong>
                <br /><br />
                ¡Nos dará enorme felicidad verlos ahí! Con cariño, Ana & Diego 💍
              </div>
            </div>

            {/* Plantilla 2 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E3D9C9] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B8935A]">Tono Formal / Compromisos</span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      'Estimada Familia Pérez: Esperamos se encuentren muy bien. Es un verdadero honor para nosotros invitarlos a celebrar nuestra unión matrimonial el próximo 14 de Noviembre. Pueden consultar toda la información de la ceremonia y confirmar su asistencia a través de la siguiente invitación digital interactiva: https://invitto.com.mx/i/tu-boda Agradecemos de antemano su compañía en este día tan especial. Saludos cordiales, Ana Sofía & Carlos.',
                      2
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5E5850] hover:text-[#1C1C1C]"
                >
                  {copiedTemplate === 2 ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar texto</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E3D9C9] text-xs sm:text-sm text-[#1C1C1C] leading-relaxed font-mono">
                Estimada Familia Pérez: Esperamos se encuentren muy bien. Es un verdadero honor para nosotros invitarlos a celebrar nuestra unión matrimonial el próximo 14 de Noviembre. Pueden consultar toda la información de la ceremonia y confirmar su asistencia a través de la siguiente invitación digital:
                <br /><br />
                👉 <strong>https://invitto.com.mx/i/tu-boda</strong>
                <br /><br />
                Agradecemos de antemano su compañía en este día tan especial. Saludos cordiales, Ana Sofía & Carlos.
              </div>
            </div>
          </div>
        </section>

        {/* ─── CAPÍTULO 6: DEMOS EN VIVO ───────────────────────────────────── */}
        <section id="demos" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#8C6A35]">Capítulo 6</span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
                Galería de Demos en Vivo
              </h2>
              <p className="text-sm sm:text-base text-[#5E5850]">
                Toca cualquier modelo para abrir una invitación de boda real y ver cómo luce en tu dispositivo:
              </p>
            </div>
            <Link
              to="/ejemplos?category=boda"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#B8935A] hover:underline"
            >
              <span>Ver catálogo completo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WEDDING_DEMOS.map((demo, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#E3D9C9] bg-white overflow-hidden shadow-sm group hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="aspect-[4/5] bg-slate-100 overflow-hidden relative">
                  <img
                    src={demo.thumbnail}
                    alt={demo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-sm">
                    {demo.badge}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-serif font-bold text-lg text-[#1C1C1C]">{demo.name}</h3>
                  <p className="text-xs text-[#5E5850]">{demo.style}</p>
                  <div className="pt-2">
                    <a
                      href={`/i/${demo.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8935A] hover:underline"
                    >
                      <span>Abrir demo en vivo</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CAPÍTULO 7: PREGUNTAS FRECUENTES (FAQ) ──────────────────────── */}
        <section id="faq" className="space-y-6 scroll-mt-24">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8C6A35]">Capítulo 7</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1C1C]">
              Preguntas Frecuentes de Parejas y Novias
            </h2>
            <p className="text-sm sm:text-base text-[#5E5850]">
              Respuestas directas a las dudas más comunes antes de armar su invitación:
            </p>
          </div>

          <div className="divide-y divide-[#E3D9C9] border-y border-[#E3D9C9]">
            {FAQS.map((faq, index) => {
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

        {/* ─── BANNER FINAL DE CONVERSIÓN ──────────────────────────────────── */}
        <section className="rounded-3xl bg-gradient-to-br from-[#1C1C1C] to-[#2B2725] text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-[#B8935A]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
              Empieza sin costo
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">
              Tu boda se acerca. Diseña tu invitación en minutos.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Ármala gratis con tus fotos, música y fecha. Puedes ver exactamente cómo se ve en tu propio teléfono antes de pagar un solo peso.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={primaryCta}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#B8935A] hover:bg-[#A37F47] text-white font-bold text-sm shadow-xl transition-transform active:scale-95"
              >
                <span>Crear mi invitación de boda gratis</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="https://wa.me/5215650314529?text=Hola,%20leí%20la%20guía%20de%20bodas%20y%20me%20gustaría%20asesoría"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-colors"
              >
                <span>Hablar con un asesor en WhatsApp</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-400">
              Garantía de satisfacción de 7 días · Sin suscripciones mensuales · Soporte en México
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
            <span>© {new Date().getFullYear()} Invitto. Hecho con ❤️ para bodas en México.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/planeador-de-bodas" className="hover:underline font-bold text-[#8C6A35]">Planeador de Bodas</Link>
            <Link to="/invitaciones-digitales-boda" className="hover:underline">Landing de Bodas</Link>
            <Link to="/planes" className="hover:underline">Planes y Precios</Link>
            <Link to="/ejemplos" className="hover:underline">Ejemplos Reales</Link>
            <Link to="/blog" className="hover:underline">Blog de Bodas</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
