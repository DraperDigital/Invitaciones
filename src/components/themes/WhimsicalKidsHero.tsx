import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Star } from 'lucide-react';

interface Props {
    event: any;
    cfg: any;
    countdown: any;
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
}

export default function WhimsicalKidsHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection }: Props) {
    const primaryColor = cfg.primaryColor || cfg.primary_color || '#FFB5A7'; // Pastel pink
    const eventDate = new Date(event.date_time);

    return (
        <div className="relative min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Playful background shapes */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 rounded-full opacity-20 mix-blend-multiply blur-3xl animate-pulse" style={{ backgroundColor: primaryColor }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full opacity-20 mix-blend-multiply blur-3xl animate-pulse" style={{ backgroundColor: '#A0C4FF' }} />
            <div className="absolute top-[20%] right-[10%] w-40 h-40 rounded-full opacity-20 mix-blend-multiply blur-3xl animate-pulse" style={{ backgroundColor: '#FDFFB6' }} />

            <nav className="absolute top-6 w-full px-6 flex justify-between items-center z-20">
                <Star className="h-8 w-8 text-yellow-400 fill-yellow-400 animate-bounce" />
                <div className="flex gap-4">
                    <button onClick={() => scrollToSection('rsvp')} className="px-4 py-2 rounded-full text-white font-bold text-sm shadow-md hover:shadow-lg transition-all" style={{ backgroundColor: primaryColor }}>
                        ¡Confirma!
                    </button>
                </div>
            </nav>

            <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center text-center">
                {heroImageUrl && (
                    <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border-8 border-white shadow-xl overflow-hidden mb-8 transform -rotate-3 hover:rotate-3 transition-transform duration-500 relative">
                        <img src={heroImageUrl} alt="" className="w-full h-full object-cover" />
                        {/* Inner highlight */}
                        <div className="absolute inset-0 rounded-full ring-inset ring-4 ring-white/30" />
                    </div>
                )}

                <div className="bg-white/80 backdrop-blur-md p-8 sm:p-12 rounded-[3rem] shadow-xl border-4 border-white">
                    <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: primaryColor }}>
                        {labels.welcome}
                    </p>
                    
                    <h1 className="text-5xl sm:text-7xl font-black text-stone-800 leading-tight mb-6" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                        {event.title}
                    </h1>

                    <div className="inline-block bg-stone-100 rounded-full px-6 py-3 mb-8">
                        <p className="text-xl font-bold text-stone-600">
                            {format(eventDate, "d 'de' MMMM", { locale: es })} a las {format(eventDate, 'HH:mm', { locale: es })}
                        </p>
                    </div>

                    {(countdown.days > 0 || countdown.hours > 0) && (
                        <div className="flex justify-center gap-4 sm:gap-6">
                            {[
                                { label: 'Días', value: countdown.days, color: '#FFB5A7' },
                                { label: 'Hrs', value: countdown.hours, color: '#A0C4FF' },
                                { label: 'Min', value: countdown.minutes, color: '#FDFFB6' },
                            ].map((item) => (
                                <div key={item.label} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex flex-col items-center justify-center shadow-inner" style={{ backgroundColor: item.color }}>
                                    <p className="text-3xl sm:text-4xl font-black text-stone-800">{item.value}</p>
                                    <p className="text-xs font-bold text-stone-700 uppercase">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
