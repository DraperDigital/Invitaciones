import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plane } from 'lucide-react';

interface Props {
    event: any;
    cfg: any;
    countdown: any;
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
}

export default function PassportHero({ event, cfg, countdown, heroImageUrl, scrollToSection }: Props) {
    const primaryColor = cfg.primaryColor || cfg.primary_color || '#006B7D'; // Deep ocean blue
    const eventDate = new Date(event.date_time);

    return (
        <div className="relative min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6 overflow-hidden">
            {/* Background Map Texture */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#006B7D 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[#006B7D]/10">
                {/* Boarding Pass Left - Image */}
                <div className="w-full md:w-2/5 h-64 md:h-auto relative">
                    {heroImageUrl ? (
                        <img src={heroImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 bg-[#E1E8ED]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <h2 className="text-white text-3xl font-serif leading-tight">{event.title.replace(' y ', '\n&\n')}</h2>
                    </div>
                </div>

                {/* Boarding Pass Right - Info */}
                <div className="w-full md:w-3/5 p-8 sm:p-12 relative bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                    {/* Perforation Line */}
                    <div className="hidden md:block absolute left-0 top-4 bottom-4 w-px border-l-2 border-dashed border-stone-300" />
                    
                    <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-stone-200">
                        <p className="text-[10px] tracking-[0.2em] font-bold text-stone-400 uppercase">Boarding Pass</p>
                        <Plane className="h-6 w-6 text-stone-300 transform rotate-45" />
                        <p className="text-[10px] tracking-[0.2em] font-bold text-stone-400 uppercase">First Class</p>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-[9px] uppercase font-bold text-stone-400 mb-1">Destination</p>
                                <p className="text-xl font-serif text-[#006B7D] truncate">{event.venue_name}</p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase font-bold text-stone-400 mb-1">Date</p>
                                <p className="text-xl font-serif text-[#006B7D]">{format(eventDate, "dd MMM yyyy", { locale: es })}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-[9px] uppercase font-bold text-stone-400 mb-1">Passenger</p>
                            <p className="text-2xl font-serif text-[#006B7D]">You're Invited!</p>
                        </div>

                        <div className="pt-8 border-t-2 border-stone-200 flex justify-between items-center">
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-stone-800">{countdown.days.toString().padStart(2, '0')}</p>
                                    <p className="text-[8px] uppercase font-bold text-stone-400">Days</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-stone-800">{countdown.hours.toString().padStart(2, '0')}</p>
                                    <p className="text-[8px] uppercase font-bold text-stone-400">Hrs</p>
                                </div>
                            </div>
                            
                            <button onClick={() => scrollToSection('rsvp')} className="px-6 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-widest hover:shadow-lg transition-all" style={{ backgroundColor: primaryColor }}>
                                RSVP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
