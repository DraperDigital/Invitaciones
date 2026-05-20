import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/Seo';
import { ArrowLeft, Clock, Menu, X, Calendar } from 'lucide-react';
import { BLOG_POSTS } from './data/blogData';

export default function BlogPostPage() {
  const { user } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Find post by slug
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Create JSON-LD Article Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: '2026-05-20', // or map dynamically if needed
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Invitto',
      logo: {
        '@type': 'ImageObject',
        url: 'https://invitto.com.mx/logo.png',
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://invitto.com.mx/blog/${post.slug}`,
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1B2E1D]">
      <Seo
        title={post.seo.title}
        description={post.seo.description}
        path={`/blog/${post.slug}`}
        jsonLd={jsonLd}
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

      {/* ─── Post Header ────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 md:pt-48 md:pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 hover:text-[#1B2E1D] transition-colors mb-12"
          >
            <ArrowLeft className="h-4 w-4" /> VOLVER AL BLOG
          </Link>

          <div className="space-y-6">
            <span className="inline-block px-3 py-1 bg-[#BD7474]/10 rounded-full text-[9px] uppercase font-bold tracking-wider text-[#BD7474]">
              {post.category}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-light tracking-tight leading-tight text-[#1B2E1D]">
              {post.title}
            </h1>

            <p className="text-stone-400 font-light italic text-base md:text-xl max-w-3xl leading-relaxed">
              {post.description}
            </p>

            <div className="pt-6 border-t border-stone-100 flex flex-wrap gap-6 items-center text-xs text-stone-400">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1B2E1D] text-white font-serif flex items-center justify-center font-bold">
                  {post.author.avatar}
                </div>
                <div>
                  <p className="font-bold text-[#1B2E1D]">{post.author.name}</p>
                  <p className="text-[10px] font-light">{post.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-stone-300" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-stone-300" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Content Section ────────────────────────────────────────── */}
      <section className="pb-24 md:pb-32 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Article Content */}
          <article className="lg:col-span-2 space-y-8 bg-white rounded-[2rem] p-8 md:p-12 border border-stone-100 shadow-sm">
            {post.content.map((sec, i) => {
              if (sec.type === 'heading') {
                return (
                  <h2
                    key={i}
                    className="text-xl md:text-2xl font-serif text-[#1B2E1D] pt-6 pb-2 border-b border-stone-100"
                  >
                    {sec.content}
                  </h2>
                );
              } else if (sec.type === 'list' && sec.items) {
                return (
                  <ul key={i} className="list-disc pl-6 space-y-3 text-stone-500 font-light text-sm md:text-base">
                    {sec.items.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              } else {
                return (
                  <p
                    key={i}
                    className="text-stone-500 font-light leading-relaxed text-sm md:text-base"
                  >
                    {sec.content}
                  </p>
                );
              }
            })}
          </article>

          {/* Sticky Sidebar CTA */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-[#1B2E1D] text-white rounded-[2rem] p-8 space-y-6 shadow-xl shadow-[#1B2E1D]/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#BD7474]/10 rounded-full blur-2xl" />
              <h3 className="text-xl font-serif italic text-white relative z-10">
                ¿Planeando tu propio evento?
              </h3>
              <p className="text-xs text-stone-300 font-light leading-relaxed relative z-10">
                Crea una invitación web espectacular con confirmación inteligente de asistencia, control de pases individuales y pases con código QR.
              </p>
              <div className="pt-4 relative z-10">
                <Link to="/planes">
                  <button className="w-full py-4 bg-[#BD7474] text-white rounded-xl text-[9px] uppercase font-bold tracking-[0.2em] hover:bg-[#B06060] transition-colors">
                    Ver planes y precios
                  </button>
                </Link>
              </div>
            </div>
          </aside>
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
