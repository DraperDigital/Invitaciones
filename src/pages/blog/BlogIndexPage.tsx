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
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-[#222B38]">
      <Seo
        title="Blog de Invitaciones Digitales — Consejos y Etiqueta | Invitto"
        description="Encuentra guías, ideas de redacción y consejos de etiqueta para tus invitaciones digitales de boda, XV años y cumpleaños."
        path="/blog"
        jsonLd={BLOG_INDEX_JSONLD}
      />

      {/* Header */}
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
            <Link to="/blog" className="text-xs uppercase font-bold tracking-widest text-[#DF3B94]">
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
              to="/blog"
              className="block text-xs uppercase font-bold tracking-widest text-[#DF3B94]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
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
      <section className="relative pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden px-6 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#DF3B94]">
            <BookOpen className="h-4 w-4" />
            <span>Recursos & Guías de Organización</span>
          </div>

          <h1 className="text-4xl xs:text-5xl md:text-6xl font-display font-extrabold text-[#222B38] tracking-tight">
            Blog de Invitto
          </h1>

          <p className="text-base md:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto">
            Inspiración, etiqueta y consejos prácticos para planear la logística de tu evento sin estrés.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 md:py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#DF3B94]/5 transition-all duration-300 flex flex-col group"
              >
                <div className="h-40 bg-[#fdf2f8] p-8 flex flex-col justify-between relative overflow-hidden">
                  <span className="self-start px-3 py-1 bg-white rounded-full text-[10px] uppercase font-bold tracking-wider text-[#DF3B94] border border-slate-100">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                    <span>·</span>
                    <span>{post.date}</span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h2 className="text-xl font-display font-bold text-[#222B38] leading-snug group-hover:text-[#DF3B94] transition-colors">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-slate-600 font-normal text-sm leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#222B38] text-white font-bold flex items-center justify-center text-xs">
                        {post.author.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#222B38]">{post.author.name}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{post.author.role}</p>
                      </div>
                    </div>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-[#DF3B94] hover:text-[#C52A7C] transition-colors p-2"
                      aria-label={`Leer artículo: ${post.title}`}
                    >
                      <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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
