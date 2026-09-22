import { ShieldCheck, CreditCard, HeartHandshake } from 'lucide-react';

const ITEMS = [
    { icon: ShieldCheck, title: 'Pago seguro', desc: 'Conexión cifrada y pagos procesados por Stripe.' },
    { icon: CreditCard, title: 'Métodos de pago', desc: 'Aceptamos Visa, Mastercard y American Express.' },
    { icon: HeartHandshake, title: 'Acompañamiento real', desc: 'Te ayudamos antes y después de contratar.' },
];

export default function TrustBadges() {
    return (
        <div className="bg-[#171E28] rounded-3xl p-8 md:p-12 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#DF3B94] mb-8 text-center md:text-left">
                Compra con Confianza
            </p>

            <div className="grid sm:grid-cols-3 gap-8 mb-10">
                {ITEMS.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-full bg-[#DF3B94]/15 flex items-center justify-center flex-shrink-0">
                            <item.icon className="h-4 w-4 text-[#DF3B94]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white mb-1">{item.title}</p>
                            <p className="text-xs text-slate-400 font-normal leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-8 border-t border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Paga de forma segura con</p>
                <div className="flex flex-wrap gap-3">
                    <div className="h-10 px-4 rounded-xl bg-white flex items-center justify-center">
                        <span className="text-[#1A1F71] font-black italic text-sm tracking-tight">VISA</span>
                    </div>
                    <div className="h-10 px-4 rounded-xl bg-white flex items-center gap-2">
                        <span className="relative w-6 h-4 flex-shrink-0">
                            <span className="absolute left-0 top-0 h-4 w-4 rounded-full bg-[#EB001B]" />
                            <span className="absolute left-2 top-0 h-4 w-4 rounded-full bg-[#F79E1B] mix-blend-multiply" />
                        </span>
                        <span className="text-slate-800 font-bold text-xs">Mastercard</span>
                    </div>
                    <div className="h-10 px-4 rounded-xl bg-white flex items-center justify-center">
                        <span className="text-[#2E77BC] font-black text-sm tracking-tight">AMEX</span>
                    </div>
                    <div className="h-10 px-4 rounded-xl bg-white flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        <span className="text-slate-800 font-bold text-xs">Stripe Seguro</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
