import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/Seo';
import { ArrowRight, BookOpen, Clock, Menu, X } from 'lucide-react';
import { BLOG_POSTS } from './data/blogData';

const BLOG_INDEX_JSONLD = [
  {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog de Invitto',
    url: 'https://invitto.com.mx/blog',
    description: 'Guías, ideas de redacción y consejos de etiqueta para invitaciones digitales de bodas, XV años y eventos en México.',
    inLanguage: 'es-MX',
    publisher: {
      '@type': 'Organization',
      name: 'Invitto',
      url: 'https://invitto.com.mx',
      logo: 'https://invitto.com.mx/logo.png',
    },
    blogPost: BLOG_POSTS.map((p: any) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `https://invitto.com.mx/blog/${p.slug}`,
      ...(p.publishedAt && { datePublished: p.publishedAt }),
    })),
  },
];

export default function BlogIndexPage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1B2E1D]">
      <Seo
        title="Blog de Invitaciones Digitales — Consejos y Etiqueta | Invitto"
        description="Encuentra guías, ideas de redacción y consejos de etiqueta para tus invitaciones digitales de boda, XV años y cumpleaños."
        path="/blog"
        jsonLd={BLOG_INDEX_JSONLD}
      />

      {/* ─── Header ────────────────────────────────────────────────── */}
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
            <Link to="/blog" className="text-xs uppercase font-bold tracking-widest text-[#BD7474] transition-colors">
              Blog
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
              to="/blog"
              className="block text-xs uppercase font-bold tracking-widest text-[#BD7474] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
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
        <div className="absolute top-20 -left-32 w-96 h-96 bg-[#BD7474]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="mx-auto max-w-4xl text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#BD7474]/10 rounded-full text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-[#BD7474] mx-auto">
            <BookOpen className="h-3 w-3" />
            Recursos y Guías
          </div>

          <h1 className="text-4xl xs:text-5xl md:text-7xl font-serif italic leading-tight tracking-tight text-[#1B2E1D]">
            Blog de Invitto
          </h1>

          <p className="text-base md:text-lg text-stone-500 font-light leading-relaxed max-w-xl mx-auto">
            Inspiración, etiqueta y consejos prácticos de expertos para planear las invitaciones digitales del día más importante de tu vida.
          </p>
        </div>
      </section>

      {/* ─── Articles Grid ──────────────────────────────────────────── */}
      <section className="pb-32 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-[2rem] border border-stone-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
              >
                {/* Decorative post header banner */}
                <div className="h-40 bg-gradient-to-br from-[#BD7474]/10 to-[#1B2E1D]/5 p-8 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#BD7474]/10 rounded-full blur-2xl" />
                  <span className="self-start px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[9px] uppercase font-bold tracking-wider text-[#1B2E1D]">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-3 text-[10px] text-stone-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                    <span>·</span>
                    <span>{post.date}</span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h2 className="text-xl font-serif text-[#1B2E1D] leading-snug group-hover:text-[#BD7474] transition-colors">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-stone-400 font-light text-sm leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1B2E1D] text-white font-serif flex items-center justify-center text-xs font-bold">
                        {post.author.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1B2E1D]">{post.author.name}</p>
                        <p className="text-[9px] text-stone-400 font-light">{post.author.role}</p>
                      </div>
                    </div>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-[#BD7474] hover:text-[#B06060] transition-colors p-2"
                      aria-label={`Leer artículo: ${post.title}`}
                    >
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
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
