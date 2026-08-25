import React, { useState } from 'react';
import { Gift, Copy, Check, ExternalLink, Landmark } from 'lucide-react';

interface RegistryItem {
    type: 'bank' | 'link';
    title: string;
    bank_name?: string;
    account_number?: string;
    clabe?: string;
    beneficiary?: string;
    url?: string;
}

interface GiftRegistryProps {
    items: RegistryItem[];
    title?: string;
    subtitle?: string;
}

const GiftRegistry: React.FC<GiftRegistryProps> = ({ 
    items, 
    title = "Mesa de Regalos", 
    subtitle = "Tu presencia es nuestro mejor regalo, pero si deseas tener un detalle con nosotros..." 
}) => {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    if (!items || items.length === 0) return null;

    return (
        <section id="registry" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#DF3B94]/10 text-[#DF3B94] mb-4">
                        <Gift className="h-6 w-6" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-extrabold text-[#222B38]">{title}</h2>
                    <p className="text-stone-400 font-light italic max-w-xl mx-auto">{subtitle}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item, index) => (
                        <div 
                            key={index}
                            className="bg-[#F8F9FA] rounded-[2rem] p-10 border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
                        >
                            {item.type === 'bank' ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#222B38]">
                                            <Landmark className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-xl font-display font-extrabold">{item.title}</h3>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <p className="text-[9px] uppercase tracking-widest font-bold text-stone-300">Banco</p>
                                            <p className="text-stone-600 font-medium">{item.bank_name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] uppercase tracking-widest font-bold text-stone-300">Beneficiario</p>
                                            <p className="text-stone-600 font-medium">{item.beneficiary}</p>
                                        </div>
                                        <div className="space-y-1 relative group/copy">
                                            <p className="text-[9px] uppercase tracking-widest font-bold text-stone-300">CLABE</p>
                                            <div className="flex items-center justify-between gap-4 p-3 bg-white border border-stone-100 rounded-xl mt-1">
                                                <span className="font-mono text-xs tracking-wider text-stone-500">{item.clabe}</span>
                                                <button 
                                                    onClick={() => handleCopy(item.clabe || '', `clabe-${index}`)}
                                                    className="p-1.5 hover:bg-stone-50 rounded-lg transition-colors text-[#DF3B94]"
                                                >
                                                    {copied === `clabe-${index}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col justify-between space-y-8">
                                    <div className="space-y-6">
                                        <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#DF3B94]">
                                            <ExternalLink className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-xl font-display font-extrabold">{item.title}</h3>
                                        <p className="text-stone-400 text-sm italic font-light">Puedes encontrar nuestra mesa de regalos haciendo clic en el botón inferior.</p>
                                    </div>
                                    <a 
                                        href={item.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-3 w-full bg-[#DF3B94] text-white py-4 rounded-xl text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-[#C52A7C] transition-all transform active:scale-[0.98]"
                                    >
                                        VISITAR TIENDA <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GiftRegistry;
