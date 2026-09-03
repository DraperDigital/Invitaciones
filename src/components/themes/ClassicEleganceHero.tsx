import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Church, Wine, Utensils, Music } from 'lucide-react';

interface Props {
    event: any;
    cfg: any;
    countdown: any;
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
}

export default function ClassicEleganceHero({ event, cfg, countdown, heroImageUrl, scrollToSection }: Props) {
    const eventDate = new Date(event.date_time || Date.now());
    const primaryGold = '#C5A059';

    // Couples Initials Monogram
    const getInitials = () => {
        if (!event?.title) return 'E & W';
        const parts = event.title.split(/ y | & | Y | e | E /i);
        if (parts.length >= 2) {
            return `${parts[0].trim()[0]} & ${parts[1].trim()[0]}`;
        }
        return event.title.slice(0, 3).toUpperCase();
    };

    const itineraryItems = cfg.itinerary && cfg.itinerary.length > 0 ? cfg.itinerary : [
        { time: '16:00', title: 'CEREMONIA RELIGIOSA', subtitle: event.misa_name || 'Catedral Principal', icon: 'church' },
        { time: '17:30', title: 'CÓCTEL DE BIENVENIDA', subtitle: 'Jardín de los Rosales', icon: 'wine' },
        { time: '19:00', title: 'BANQUETE Y CENA', subtitle: 'Salón Gran Imperial', icon: 'utensils' },
        { time: '21:00', title: 'VALS & FIESTA', subtitle: 'Pista Principal', icon: 'music' }
    ];

    return (
        <div className="w-full bg-[#FAF8F5] text-[#2B2625] font-serif relative overflow-hidden select-none">
            {/* ── Background Botanical & Filigree SVGs ── */}
            <div className="absolute top-0 left-0 w-48 sm:w-80 h-48 sm:h-80 pointer-events-none opacity-25">
                <svg viewBox="0 0 200 200" fill="none" stroke={primaryGold} strokeWidth="1">
                    <path d="M10,10 Q50,90 100,10 T190,10" />
                    <circle cx="40" cy="40" r="15" />
                    <path d="M20,20 C60,40 40,80 80,60" />
                    <path d="M0,0 C50,100 100,50 150,150" />
                </svg>
            </div>
            <div className="absolute top-0 right-0 w-48 sm:w-80 h-48 sm:h-80 pointer-events-none opacity-25 transform scale-x-[-1]">
                <svg viewBox="0 0 200 200" fill="none" stroke={primaryGold} strokeWidth="1">
                    <path d="M10,10 Q50,90 100,10 T190,10" />
                    <circle cx="40" cy="40" r="15" />
                    <path d="M20,20 C60,40 40,80 80,60" />
                </svg>
            </div>

            {/* ── 1. Top Header & Navigation Bar ── */}
            <header className="w-full pt-8 pb-4 text-center border-b border-[#C5A059]/20 relative z-20 bg-[#FAF8F5]/90 backdrop-blur-sm">
                {/* Gold Crest / Tiara Ornament */}
                <div className="flex justify-center mb-1">
                    <svg width="36" height="18" viewBox="0 0 40 20" fill="none" stroke={primaryGold} strokeWidth="1.2">
                        <path d="M20 2 L25 10 L35 4 L30 18 L10 18 L5 4 L15 10 Z" />
                        <circle cx="20" cy="2" r="1.5" fill={primaryGold} />
                        <circle cx="5" cy="4" r="1" fill={primaryGold} />
                        <circle cx="35" cy="4" r="1" fill={primaryGold} />
                    </svg>
                </div>
                {/* Monogram */}
                <h2 className="text-xl sm:text-2xl font-serif tracking-[0.25em] text-[#C5A059] font-normal mb-3">
                    {getInitials()}
                </h2>
                {/* Links */}
                <nav className="flex flex-wrap justify-center gap-4 sm:gap-8 text-[9px] sm:text-[11px] uppercase tracking-[0.3em] text-[#554D47] font-sans font-semibold">
                    <button onClick={() => scrollToSection('message')} className="hover:text-[#C5A059] transition-colors">SOBRE NOSOTROS</button>
                    <button onClick={() => scrollToSection('events')} className="hover:text-[#C5A059] transition-colors">EVENTOS</button>
                    <button onClick={() => scrollToSection('itinerary')} className="hover:text-[#C5A059] transition-colors">ITINERARIO</button>
                    <button onClick={() => scrollToSection('gifts')} className="hover:text-[#C5A059] transition-colors">REGALOS</button>
                    <button onClick={() => scrollToSection('rsvp')} className="hover:text-[#C5A059] transition-colors">RSVP</button>
                </nav>
            </header>

            {/* ── 2. Hero Section ── */}
            <section id="hero" className="py-12 sm:py-20 px-4 text-center relative z-10 max-w-4xl mx-auto">
                <div className="space-y-3 mb-8">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#9A7B38] uppercase font-light leading-tight">
                        {event?.title || 'ELEANOR & WILLIAM'}
                    </h1>
                    <p className="text-xs sm:text-sm uppercase tracking-[0.5em] text-[#5A5047] font-sans font-medium">
                        CELEBRA NUESTRO AMOR
                    </p>
                    <div className="inline-block mt-2 px-6 py-1.5 rounded-full border border-[#C5A059]/40 bg-[#FAF8F5] text-xs sm:text-sm font-sans tracking-[0.2em] text-[#8C7A5E]">
                        {format(eventDate, "dd 'DE' MMMM, yyyy", { locale: es }).toUpperCase()} &nbsp;|&nbsp; {event?.venue_name || 'CASA CAMPESTRE'}
                    </div>
                </div>

                {/* Framed Couple Photo */}
                <div className="relative mx-auto max-w-sm sm:max-w-md p-3 bg-white border-2 border-[#C5A059] shadow-2xl rounded-sm mb-14">
                    <div className="relative aspect-[3/4] overflow-hidden">
                        <img 
                            src={heroImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'} 
                            alt={event?.title || 'Pareja'} 
                            className="w-full h-full object-cover filter brightness-[1.02]"
                        />
                    </div>
                </div>

                {/* ── 3. Countdown Section ── */}
                <div className="py-10 border-t border-b border-[#C5A059]/30 relative my-8">
                    {/* Filigree Ornament top center */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FAF8F5] px-4 text-[#C5A059]">
                        ❦
                    </div>

                    <h3 className="text-xs sm:text-sm uppercase tracking-[0.4em] text-[#8C7A5E] font-sans font-bold mb-8">
                        CUENTA REGRESIVA PARA NUESTRO DÍA ESPECIAL
                    </h3>

                    <div className="grid grid-cols-4 gap-2 sm:gap-6 max-w-xl mx-auto divide-x divide-[#C5A059]/30">
                        {[
                            { label: 'DÍAS', value: countdown.days },
                            { label: 'HORAS', value: countdown.hours },
                            { label: 'MIN', value: countdown.minutes },
                            { label: 'SEG', value: countdown.seconds },
                        ].map((item) => (
                            <div key={item.label} className="px-2 text-center">
                                <span className="text-3xl sm:text-5xl font-serif text-[#C5A059] font-light block mb-1">
                                    {String(item.value).padStart(2, '0')}
                                </span>
                                <span className="text-[8px] sm:text-[10px] font-sans uppercase tracking-[0.3em] text-[#7A6E65] font-semibold">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#FAF8F5] px-4 text-[#C5A059]">
                        ❦
                    </div>
                </div>
            </section>

            {/* ── 4. Event Timeline Section ── */}
            <section id="itinerary" className="py-16 sm:py-24 bg-[#F5F2EC] border-t border-b border-[#C5A059]/20 relative">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <h3 className="text-2xl sm:text-3xl font-serif tracking-[0.2em] text-[#C5A059] uppercase mb-12">
                        ITINERARIO DEL EVENTO
                    </h3>

                    <div className="relative pl-6 sm:pl-0">
                        {/* Central vertical line */}
                        <div className="absolute left-8 sm:left-1/2 top-4 bottom-4 w-px bg-[#C5A059]/40 -translate-x-1/2" />

                        <div className="space-y-12 relative">
                            {itineraryItems.map((item: any, idx: number) => (
                                <div key={idx} className="flex flex-col sm:flex-row items-center justify-between gap-6 group">
                                    {/* Left (Time) */}
                                    <div className="w-full sm:w-1/2 text-left sm:text-right pr-0 sm:pr-8">
                                        <span className="text-sm font-sans font-bold tracking-[0.2em] text-[#C5A059] block">
                                            {item.time}
                                        </span>
                                        <h4 className="text-lg font-serif tracking-wider text-[#2B2625] uppercase mt-0.5">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs font-sans text-[#7A6E65] mt-1">
                                            {item.subtitle || item.description}
                                        </p>
                                    </div>

                                    {/* Center Icon Badge */}
                                    <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border-2 border-[#C5A059] flex items-center justify-center text-[#C5A059] shadow-md z-10 flex-shrink-0 group-hover:scale-110 transition-transform">
                                        {item.icon === 'church' || idx === 0 ? <Church className="h-5 w-5" /> :
                                         item.icon === 'wine' || idx === 1 ? <Wine className="h-5 w-5" /> :
                                         item.icon === 'utensils' || idx === 2 ? <Utensils className="h-5 w-5" /> :
                                         <Music className="h-5 w-5" />}
                                    </div>

                                    {/* Right spacer for desktop balance */}
                                    <div className="hidden sm:block w-1/2" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 5. Dress Code Section ── */}
            <section id="dress_code" className="py-16 sm:py-24 px-6 text-center max-w-3xl mx-auto relative">
                <div className="border border-[#C5A059]/40 p-8 sm:p-14 relative bg-white/60 shadow-sm rounded-sm">
                    {/* Corner Ornaments */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#C5A059]" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#C5A059]" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#C5A059]" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#C5A059]" />

                    <h3 className="text-2xl sm:text-3xl font-serif tracking-[0.25em] text-[#C5A059] uppercase mb-2">
                        CÓDIGO DE VESTIMENTA
                    </h3>
                    <p className="text-xs sm:text-sm font-sans tracking-[0.3em] uppercase text-[#5A5047] font-bold mb-10">
                        {cfg.dress_code || 'ETIQUETA RIGUROSA / FORMAL'}
                    </p>

                    <div className="grid grid-cols-2 gap-8 max-w-md mx-auto divide-x divide-[#C5A059]/30">
                        {/* Men Illustration */}
                        <div className="flex flex-col items-center gap-3">
                            <svg width="48" height="64" viewBox="0 0 48 64" fill="none" stroke="#C5A059" strokeWidth="1.5">
                                <path d="M14 12 L24 24 L34 12" />
                                <path d="M24 24 L24 60" />
                                <path d="M10 12 L24 4 L38 12 L38 60 L10 60 Z" />
                                <circle cx="24" cy="18" r="2" fill="#C5A059" />
                            </svg>
                            <span className="text-xs font-sans tracking-[0.3em] uppercase font-bold text-[#2B2625]">HOMBRES</span>
                            <span className="text-[10px] text-[#7A6E65] font-sans">ESMOQUIN / TRAJE OSCURO</span>
                        </div>

                        {/* Ladies Illustration */}
                        <div className="flex flex-col items-center gap-3 pl-8">
                            <svg width="48" height="64" viewBox="0 0 48 64" fill="none" stroke="#C5A059" strokeWidth="1.5">
                                <path d="M18 10 C18 10 24 18 24 22 C24 18 30 10 30 10" />
                                <path d="M18 10 L12 28 L24 60 L36 28 L30 10 Z" />
                            </svg>
                            <span className="text-xs font-sans tracking-[0.3em] uppercase font-bold text-[#2B2625]">MUJERES</span>
                            <span className="text-[10px] text-[#7A6E65] font-sans">VESTIDO LARGO DE NOCHE</span>
                        </div>
                    </div>

                    <p className="text-[10px] font-sans tracking-[0.2em] text-[#8C7A5E] uppercase mt-10">
                        SE SOLICITA VESTIMENTA FORMAL
                    </p>
                </div>
            </section>

            {/* ── 6. RSVP Section ── */}
            <section id="rsvp" className="py-16 sm:py-24 bg-[#F5F2EC] border-t border-[#C5A059]/20 relative">
                <div className="max-w-xl mx-auto px-6 text-center">
                    <h3 className="text-3xl font-serif tracking-[0.25em] text-[#C5A059] uppercase mb-2">
                        RSVP
                    </h3>
                    <p className="text-xs font-sans tracking-[0.3em] uppercase text-[#5A5047] font-bold mb-8">
                        CONFIRMACIÓN DE ASISTENCIA
                    </p>

                    <div className="bg-white p-8 sm:p-10 border border-[#C5A059]/40 shadow-xl rounded-sm text-left relative">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] uppercase font-sans tracking-widest text-[#7A6E65] font-bold block mb-1">Nombre</label>
                                    <input type="text" placeholder="Tu nombre" className="w-full bg-[#FAF8F5] border border-[#C5A059]/30 px-3 py-2 text-xs font-sans rounded-none focus:outline-none focus:border-[#C5A059]" />
                                </div>
                                <div>
                                    <label className="text-[9px] uppercase font-sans tracking-widest text-[#7A6E65] font-bold block mb-1">Apellidos</label>
                                    <input type="text" placeholder="Tus apellidos" className="w-full bg-[#FAF8F5] border border-[#C5A059]/30 px-3 py-2 text-xs font-sans rounded-none focus:outline-none focus:border-[#C5A059]" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[9px] uppercase font-sans tracking-widest text-[#7A6E65] font-bold block mb-1">Correo Electrónico</label>
                                <input type="email" placeholder="correo@ejemplo.com" className="w-full bg-[#FAF8F5] border border-[#C5A059]/30 px-3 py-2 text-xs font-sans rounded-none focus:outline-none focus:border-[#C5A059]" />
                            </div>
                            <div className="pt-2">
                                <button className="w-full py-3.5 bg-gradient-to-r from-[#B8860B] via-[#C5A059] to-[#9A7B38] text-white font-sans font-bold text-xs tracking-[0.3em] uppercase shadow-md hover:brightness-110 transition-all">
                                    CONFIRMAR ASISTENCIA
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 7. Footer ── */}
            <footer className="py-12 bg-[#FAF8F5] border-t border-[#C5A059]/20 text-center text-xs font-sans text-[#7A6E65]">
                <p className="tracking-[0.25em] uppercase text-[#C5A059] font-bold mb-2">
                    {event?.title || 'ELEANOR & WILLIAM'}
                </p>
                <p className="text-[10px] tracking-widest">
                    {format(eventDate, "dd 'de' MMMM, yyyy", { locale: es }).toUpperCase()}
                </p>
            </footer>
        </div>
    );
}
