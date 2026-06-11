import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
    event: any;
    cfg: any;
    countdown: any;
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
}

export default function MagazineHero({ event, countdown, heroImageUrl, scrollToSection }: Props) {
    const eventDate = new Date(event.date_time);

    return (
        <div className="relative min-h-screen bg-[#111111] text-white overflow-hidden flex flex-col justify-between p-8 sm:p-12 transition-colors duration-500">
            {/* Magazine Header */}
            <header className="flex justify-between items-start z-20">
                <div>
                    <p className="text-[10px] tracking-[0.3em] font-bold uppercase mb-1">Vol. 1</p>
                    <p className="text-xs uppercase tracking-widest opacity-60">{format(eventDate, "MMMM yyyy", { locale: es })}</p>
                </div>
                <nav className="flex gap-6 text-[10px] tracking-[0.2em] font-bold uppercase">
                    <button onClick={() => scrollToSection('rsvp')} className="hover:text-accent transition-colors">RSVP</button>
                    <button onClick={() => scrollToSection('location')} className="hover:text-accent transition-colors">Ubicaciones</button>
                </nav>
            </header>

            {/* Main Editorial Content */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-grow mt-12 mb-12">
                <div className="text-center relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
                    {/* Background Image overlapping text */}
                    {heroImageUrl && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 sm:w-1/2 aspect-[3/4] z-0 overflow-hidden opacity-80 shadow-2xl rounded-sm">
                            <img src={heroImageUrl} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                            <div className="absolute inset-0 bg-black/20" />
                        </div>
                    )}
                    
                    {/* Oversized Typography */}
                    <div className="relative z-10 pointer-events-none text-white w-full drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                        <p className="text-[12px] sm:text-sm tracking-[0.5em] font-bold uppercase mb-4 sm:mb-8 text-stone-300 drop-shadow-md">Edición Especial</p>
                        <h1 className="text-[clamp(4rem,15vw,15rem)] leading-[0.85] font-serif tracking-tighter uppercase whitespace-pre-line w-full break-words px-4">
                            {event.title.replace(' y ', '\n&\n')}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Editorial Footer */}
            <footer className="z-20 grid grid-cols-3 gap-4 border-t border-white/20 pt-6 text-stone-300">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">Dónde</p>
                    <p className="text-xs font-serif italic truncate">{event.venue_name}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">Cuándo</p>
                    <p className="text-xs font-serif italic">{format(eventDate, "d MMMM", { locale: es })}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">Faltan</p>
                    <p className="text-xs font-serif italic">{countdown.days} días</p>
                </div>
            </footer>
        </div>
    );
}
