import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/Seo';
import { ArrowLeft, Clock, Menu, X, Calendar, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from './data/blogData';

export default function BlogPostPage() {
  const { user } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: '2026-05-20',
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
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-[#222B38]">
      <Seo
        title={post.seo.title}
        description={post.seo.description}
        path={`/blog/${post.slug}`}
        jsonLd={jsonLd}
      />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-slate-100 px-4 md:px-6">
        <div className="mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-95 transition-opacity">
            <img src="/logo.png?v=3" alt="Invitto" className="h-8 md:h-10 w-auto object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/planes" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
              Planes y precios
            </Link>
            <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-[#DF3B94] transition-colors">
              Ejemplos
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
          </div>
        )}
      </header>

      {/* Post Header */}
      <section className="pt-32 pb-14 md:pt-44 md:pb-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#DF3B94] hover:underline mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> VOLVER AL BLOG
          </Link>

          <div className="space-y-6">
            <span className="inline-block px-3 py-1 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full text-[10px] uppercase font-bold tracking-wider text-[#DF3B94]">
              {post.category}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-extrabold tracking-tight leading-tight text-[#222B38]">
              {post.title}
            </h1>

            <p className="text-slate-600 font-normal text-base md:text-xl max-w-3xl leading-relaxed">
              {post.description}
            </p>

            <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-6 items-center text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#222B38] text-white font-bold flex items-center justify-center">
                  {post.author.avatar}
                </div>
                <div>
                  <p className="font-bold text-[#222B38]">{post.author.name}</p>
                  <p className="text-[10px] text-slate-400 font-normal">{post.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Article Content */}
          <article className="lg:col-span-2 space-y-6 bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm">
            {post.content.map((sec, i) => {
              if (sec.type === 'heading') {
                return (
                  <h2
                    key={i}
                    className="text-xl md:text-2xl font-display font-bold text-[#222B38] pt-6 pb-2 border-b border-slate-100"
                  >
                    {sec.content}
                  </h2>
                );
              } else if (sec.type === 'list' && sec.items) {
                return (
                  <ul key={i} className="list-disc pl-6 space-y-3 text-slate-600 font-normal text-sm md:text-base">
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
                    className="text-slate-600 font-normal leading-relaxed text-sm md:text-base"
                  >
                    {sec.content}
                  </p>
                );
              }
            })}

            {/* Author Bio Box */}
            <div className="mt-12 bg-[#F8F9FA] border border-slate-100 rounded-3xl p-8 flex flex-col sm:flex-row items-start gap-6">
              <div className="w-16 h-16 rounded-full bg-[#222B38] text-white font-bold flex items-center justify-center text-xl flex-shrink-0">
                {post.author.avatar}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-display font-bold text-[#222B38]">Acerca de {post.author.name}</h3>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{post.author.role}</p>
                <p className="text-sm text-slate-600 leading-relaxed font-normal pt-1">
                  {post.author.bio || `Especialista y colaborador habitual en el blog de Invitto, compartiendo consejos sobre ${post.category.toLowerCase()}.`}
                </p>
              </div>
            </div>
          </article>

          {/* Sticky Sidebar CTA */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-[#222B38] text-white rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden">
              <h3 className="text-xl font-display font-bold text-white relative z-10">
                ¿Planeando tu propio evento?
              </h3>
              <p className="text-xs text-slate-300 font-normal leading-relaxed relative z-10">
                Crea una invitación web espectacular con confirmación inteligente de asistencia, control de pases individuales y pases QR.
              </p>
              <div className="pt-2 relative z-10">
                <Link to="/planes">
                  <button className="w-full py-4 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-2xl text-xs uppercase font-bold tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                    Ver planes y precios <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </aside>
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
