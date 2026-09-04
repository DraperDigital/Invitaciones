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

export default function PolaroidVintageHero({ event, countdown, heroImageUrl, scrollToSection }: Props) {
    const eventDate = new Date(event.date_time);

    return (
        <div className="relative min-h-screen bg-[#Eae6df] flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Vintage Noise Overlay */}
            <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dust.png")' }} />

            <nav className="absolute top-8 w-full flex justify-center gap-8 text-sm font-mono tracking-widest uppercase text-stone-600 z-20">
                <button onClick={() => scrollToSection('rsvp')} className="hover:text-black transition-colors">RSVP</button>
                <button onClick={() => scrollToSection('location')} className="hover:text-black transition-colors">Ubicación</button>
            </nav>

            <div className="relative z-10 w-full max-w-lg mt-12 flex flex-col items-center">
                {/* Polaroid Frame */}
                <div className="bg-white p-4 pb-16 sm:p-6 sm:pb-20 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 w-full">
                    <div className="aspect-square w-full bg-stone-200 overflow-hidden shadow-inner relative">
                        {heroImageUrl ? (
                            <img src={heroImageUrl} alt="" className="w-full h-full object-cover contrast-125 sepia-[.3] hue-rotate-[-10deg]" />
                        ) : (
                            <div className="w-full h-full bg-stone-300" />
                        )}
                        {/* Film light leak overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-transparent to-red-500/20 mix-blend-overlay" />
                    </div>
                    
                    <div className="absolute bottom-4 left-0 right-0 text-center px-4">
                        <p className="font-mono text-xl sm:text-2xl text-stone-800 rotate-[-2deg] opacity-80" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                            {eventDate.getFullYear()}
                        </p>
                    </div>
                </div>

                {/* Hand-written style text */}
                <div className="mt-12 text-center text-stone-800 space-y-6">
                    <h1 className="text-3xl sm:text-6xl md:text-7xl font-serif italic tracking-tight break-normal hyphens-none">
                        {event.title}
                    </h1>
                    
                    <p className="font-mono text-lg uppercase tracking-[0.2em] opacity-70">
                        {format(eventDate, "dd . MM . yyyy", { locale: es })}
                    </p>

                    {(countdown.days > 0 || countdown.hours > 0) && (
                        <div className="flex justify-center gap-6 mt-8">
                            {[
                                { label: 'd', value: countdown.days },
                                { label: 'h', value: countdown.hours },
                                { label: 'm', value: countdown.minutes },
                            ].map((item) => (
                                <div key={item.label} className="bg-stone-800 text-[#Eae6df] px-4 py-2 rounded-sm font-mono shadow-md">
                                    <span className="text-xl font-bold">{item.value.toString().padStart(2, '0')}</span>
                                    <span className="text-xs ml-1">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
