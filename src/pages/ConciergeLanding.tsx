import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Check,
    ShieldCheck,
    ChevronDown,
    Sparkles
} from 'lucide-react';
import Seo from '../components/Seo';
import { WHATSAPP_SUPPORT_NUMBER } from '../lib/constants';

const WHATSAPP_CONFIRMA_URL = `https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=LISTA%20-%20Vengo%20de%20la%20p%C3%A1gina%20de%20Invitto%20Confirma`;

const SERVICE_JSONLD = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Invitto Confirma',
    serviceType: 'Confirmación de invitados para bodas',
    provider: { '@type': 'Organization', name: 'Invitto' },
    areaServed: { '@type': 'Country', name: 'México' },
    description: 'Le escribimos a cada invitado de tu boda en tu nombre hasta tener su respuesta. Tu lista final confirmada 15 días antes, sin que tú le ruegues a nadie.',
    offers: {
        '@type': 'Offer',
        price: '2499',
        priceCurrency: 'MXN',
        availability: 'https://schema.org/InStock',
        validThrough: '2026-11-02'
    },
};

const FAQ_ITEMS = [
    {
        q: '¿Y si mis tíos o mis abuelos no usan WhatsApp?',
        a: 'A quien no conteste por mensaje le llamamos por teléfono. Si un número no funciona, te pedimos el correcto en un solo mensaje.'
    },
    {
        q: '¿Qué pasa si alguien no contesta nunca?',
        a: 'Le escribimos tres veces y le llamamos una. Si aun así no responde, aparece en tu lista como "no respondió después de 4 intentos", con su nombre, para que tú decidas.'
    },
    {
        q: '¿Cuándo me entregan la lista?',
        a: '15 días antes de tu boda, o en la fecha que te pida tu salón para cerrar el número de platillos. Nos la dices al apartar.'
    },
    {
        q: '¿Mis invitados van a saber que contratamos a alguien?',
        a: 'Ven mensajes del "equipo de confirmaciones" de tu boda, con tu nombre y el de tu pareja. Te recomendamos avisarle a tu familia que les vamos a escribir para que nadie lo confunda con spam.'
    },
    {
        q: '¿Con cuánto tiempo antes tengo que contratar?',
        a: 'Lo ideal es entre 6 y 16 semanas antes de la boda. Con menos de 4 semanas no alcanzamos a hacer todas las rondas.'
    }
];

const ConciergeLanding: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-[#171E28] text-white font-sans selection:bg-[#DF3B94]/30 overflow-x-hidden">
            <Seo
                title="Invitto Confirma · Confirmamos a tus invitados por ti | Invitto"
                description="Le escribimos a cada invitado de tu boda en tu nombre hasta tener su respuesta. Tu lista final confirmada 15 días antes, sin que tú le ruegues a nadie."
                path="/concierge-service"
                jsonLd={SERVICE_JSONLD}
            />

            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-[#171E28]/85 backdrop-blur-md border-b border-white/10 px-4 md:px-6">
                <div className="mx-auto max-w-7xl h-16 md:h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center hover:opacity-95 transition-opacity">
                        <img src="/logo.png?v=3" alt="Invitto" className="h-8 md:h-10 w-auto object-contain brightness-0 invert" />
                    </Link>

                    <nav className="hidden lg:flex items-center gap-8">
                        <Link to="/ejemplos" className="text-xs uppercase font-bold tracking-widest text-slate-300 hover:text-[#DF3B94] transition-colors">
                            Ejemplos
                        </Link>
                        <Link to="/planes" className="text-xs uppercase font-bold tracking-widest text-slate-300 hover:text-[#DF3B94] transition-colors">
                            Planes
                        </Link>
                        <Link to="/comparativas" className="text-xs uppercase font-bold tracking-widest text-slate-300 hover:text-[#DF3B94] transition-colors">
                            Comparativas
                        </Link>
                        <Link to="/concierge-service" className="text-xs uppercase font-bold tracking-widest text-[#DF3B94]">
                            Concierge
                        </Link>
                        <Link to="/blog" className="text-xs uppercase font-bold tracking-widest text-slate-300 hover:text-[#DF3B94] transition-colors">
                            Blog
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <a
                            href={WHATSAPP_CONFIRMA_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 md:px-6 md:py-3 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-xl text-[10px] md:text-xs uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#DF3B94]/20 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                        >
                            Quiero mi lista confirmada
                        </a>
                    </div>
                </div>
            </header>

            {/* 1. HERO SECTION */}
            <section className="relative pt-32 md:pt-44 pb-20 md:pb-28 px-6 overflow-hidden bg-gradient-to-b from-[#222B38] via-[#171E28] to-[#171E28]">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[#DF3B94]/15 rounded-full blur-[140px] pointer-events-none" />
                
                <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                        <Sparkles className="h-4 w-4 text-[#DF3B94]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[#DF3B94]">
                            INVITTO CONFIRMA · 5 LUGARES DE FUNDADORA
                        </span>
                    </div>
                    
                    <h1 className="text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white leading-tight tracking-tight">
                        ¿Cuántos de los que te dijeron "sí" <br />
                        <span className="italic font-light text-[#DF3B94]">van a llegar de verdad?</span>
                    </h1>
                    
                    <p className="text-base md:text-xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
                        Le escribimos a cada invitado de tu boda en tu nombre, hasta tener su respuesta. Te entregamos tu lista final confirmada 15 días antes y la reconfirmamos la semana del evento. Tú no le ruegas a nadie.
                    </p>

                    <div className="pt-4 flex flex-col items-center justify-center gap-4">
                        <a
                            href={WHATSAPP_CONFIRMA_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full xs:w-auto px-10 md:px-12 py-5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-full font-bold text-xs md:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl shadow-[#DF3B94]/30 hover:-translate-y-0.5 active:scale-95"
                        >
                            Quiero mi lista confirmada <ArrowRight className="h-5 w-5" />
                        </a>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs text-slate-300 font-semibold">
                            <span>Precio de fundadora:</span>
                            <span className="text-[#F5B837] font-bold">$2,499 MXN</span>
                            <span className="line-through text-slate-500">$3,499</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">
                            Solo para las primeras 5 bodas · cierra el 2 de noviembre
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. EL PROBLEMA (LO QUE NOS CUENTAN LAS NOVIAS) */}
            <section className="py-20 md:py-28 px-6 border-t border-white/5 bg-[#171E28]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14 space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#DF3B94]">LO QUE NOS CUENTAN LAS NOVIAS</span>
                        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">
                            Confirmar no es mandar la invitación. Es perseguir a la gente.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#DF3B94]/30 transition-all flex flex-col justify-between">
                            <p className="text-base md:text-lg italic text-slate-200 font-serif leading-relaxed">
                                "Por pena te dicen que sí van y a la mera hora no van."
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#DF3B94]/30 transition-all flex flex-col justify-between">
                            <p className="text-base md:text-lg italic text-slate-200 font-serif leading-relaxed">
                                "O te cancelan faltando 4 días."
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#DF3B94]/30 transition-all flex flex-col justify-between">
                            <p className="text-base md:text-lg italic text-slate-200 font-serif leading-relaxed">
                                "Pagamos 116 platillos y llegaron 102 personas."
                            </p>
                        </div>
                    </div>

                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <p className="text-base md:text-lg text-slate-300 font-normal leading-relaxed">
                            Cada lugar vacío en tu boda cuesta entre $400 y $1,500. Y casi siempre es de alguien que dijo que sí. No es mala suerte: es que nadie volvió a preguntar a tiempo.
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                            Frases reales de novias en foros y redes sobre bodas en México.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. CÓMO FUNCIONA */}
            <section className="py-20 md:py-28 px-6 border-t border-white/5 bg-[#222B38]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#DF3B94]">CÓMO FUNCIONA</span>
                        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">
                            Tú nos pasas la lista. Nosotros nos encargamos del resto.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#DF3B94]/40 transition-all space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-[#DF3B94]/15 text-[#DF3B94] flex items-center justify-center font-display font-bold text-xl">
                                1
                            </div>
                            <p className="text-sm text-slate-300 font-normal leading-relaxed">
                                Nos mandas tu lista como la tengas. Excel, foto o notas del celular. Nosotros la ordenamos y asignamos los pases por familia.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#DF3B94]/40 transition-all space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-[#DF3B94]/15 text-[#DF3B94] flex items-center justify-center font-display font-bold text-xl">
                                2
                            </div>
                            <p className="text-sm text-slate-300 font-normal leading-relaxed">
                                Enviamos tu invitación, una por una. Por WhatsApp, a nombre del "equipo de confirmaciones de la boda de [tu nombre y el de tu pareja]". Nunca a nombre de una empresa.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#DF3B94]/40 transition-all space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-[#DF3B94]/15 text-[#DF3B94] flex items-center justify-center font-display font-bold text-xl">
                                3
                            </div>
                            <p className="text-sm text-slate-300 font-normal leading-relaxed">
                                Perseguimos a los que no contestan. Tres rondas de mensajes y una llamada a quien siga pendiente. Con trato cálido y sin presionar a tu familia.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#DF3B94]/40 transition-all space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-[#DF3B94]/15 text-[#DF3B94] flex items-center justify-center font-display font-bold text-xl">
                                4
                            </div>
                            <p className="text-sm text-slate-300 font-normal leading-relaxed">
                                Recibes tu lista final. 15 días antes de la boda, con la respuesta de cada invitación y el total de pases. 7 días antes reconfirmamos a todos los que dijeron que sí.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. POR QUÉ UN TERCERO (LO QUE NADIE MÁS HACE) */}
            <section className="py-20 md:py-28 px-6 bg-[#171E28] border-t border-white/5">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#DF3B94]">LO QUE NADIE MÁS HACE</span>
                        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">
                            No eres tú la que pregunta tres veces.
                        </h2>
                        <p className="text-base md:text-lg text-slate-300 font-normal leading-relaxed pt-2">
                            Muchas novias terminan pidiéndole a una amiga que se haga pasar por la organizadora, porque preguntar tanto se siente como rogar. Nosotros somos esa persona: le escribimos a tu tía, a tus compañeros de trabajo y a los primos del novio, y tú solo recibes las respuestas.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-2">
                            <div className="flex items-center gap-2 text-[#DF3B94]">
                                <Check className="h-5 w-5 shrink-0" />
                                <h4 className="font-bold text-sm text-white">Escribimos en tu nombre.</h4>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                Tus invitados reciben mensajes de tu boda, no de un proveedor.
                            </p>
                        </div>

                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-2">
                            <div className="flex items-center gap-2 text-[#DF3B94]">
                                <Check className="h-5 w-5 shrink-0" />
                                <h4 className="font-bold text-sm text-white">Avance cada semana.</h4>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                Te mandamos cuántos confirmaron, cuántos no van y cuántos faltan.
                            </p>
                        </div>

                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-2">
                            <div className="flex items-center gap-2 text-[#DF3B94]">
                                <Check className="h-5 w-5 shrink-0" />
                                <h4 className="font-bold text-sm text-white">Pases claros por familia.</h4>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                Cada invitación dice cuántos lugares tiene. Si alguien pide más, te preguntamos a ti.
                            </p>
                        </div>

                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-2">
                            <div className="flex items-center gap-2 text-[#DF3B94]">
                                <Check className="h-5 w-5 shrink-0" />
                                <h4 className="font-bold text-sm text-white">Un número que puedes darle al salón.</h4>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                Tu lista final en Excel con el total de pases confirmados.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. PRECIO Y QUÉ INCLUYE */}
            <section className="py-20 md:py-28 px-6 bg-[#222B38] border-t border-white/10">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-b from-white/10 to-white/5 p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8">
                        <div className="text-center space-y-3 border-b border-white/10 pb-8">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#DF3B94]">PRECIO DE FUNDADORA</span>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-4xl md:text-6xl font-display font-extrabold text-white">$2,499 MXN</span>
                                <span className="text-xl md:text-2xl line-through text-slate-500 font-bold">$3,499</span>
                            </div>
                            <p className="text-sm md:text-base text-slate-300 font-medium">
                                Para las primeras 5 bodas · cierra el 2 de noviembre de 2026
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            <div className="flex items-start gap-3 text-slate-200 text-sm">
                                <Check className="h-5 w-5 text-[#DF3B94] shrink-0 mt-0.5" />
                                <span>Invitación digital Invitto con confirmación y pases por familia</span>
                            </div>
                            <div className="flex items-start gap-3 text-slate-200 text-sm">
                                <Check className="h-5 w-5 text-[#DF3B94] shrink-0 mt-0.5" />
                                <span>Envío por WhatsApp a cada invitación</span>
                            </div>
                            <div className="flex items-start gap-3 text-slate-200 text-sm">
                                <Check className="h-5 w-5 text-[#DF3B94] shrink-0 mt-0.5" />
                                <span>3 rondas de seguimiento + 1 llamada a pendientes</span>
                            </div>
                            <div className="flex items-start gap-3 text-slate-200 text-sm">
                                <Check className="h-5 w-5 text-[#DF3B94] shrink-0 mt-0.5" />
                                <span>Lista final 15 días antes de tu boda</span>
                            </div>
                            <div className="flex items-start gap-3 text-slate-200 text-sm">
                                <Check className="h-5 w-5 text-[#DF3B94] shrink-0 mt-0.5" />
                                <span>Reconfirmación 7 días antes</span>
                            </div>
                            <div className="flex items-start gap-3 text-slate-200 text-sm">
                                <Check className="h-5 w-5 text-[#DF3B94] shrink-0 mt-0.5" />
                                <span>Hasta 120 invitaciones (≈300 invitados)</span>
                            </div>
                        </div>

                        <div className="text-center space-y-6 pt-4 border-t border-white/10">
                            <p className="text-xs md:text-sm text-slate-400 font-medium">
                                ¿Más de 120 invitaciones? $500 por cada 50 adicionales. Apartas con $1,250.
                            </p>
                            <a
                                href={WHATSAPP_CONFIRMA_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex px-10 py-5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-full font-bold text-xs md:text-sm uppercase tracking-widest transition-all items-center justify-center gap-3 shadow-xl shadow-[#DF3B94]/25 active:scale-95"
                            >
                                Quiero mi lista confirmada <ArrowRight className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. GARANTÍA DE ENTREGA */}
            <section className="py-16 md:py-24 px-6 bg-[#171E28] border-t border-white/5">
                <div className="max-w-3xl mx-auto">
                    <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-r from-[#DF3B94]/10 via-white/5 to-[#DF3B94]/10 border border-[#DF3B94]/30 space-y-4 text-center">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-[#DF3B94]/20 text-[#DF3B94] mx-auto">
                            <ShieldCheck className="h-7 w-7" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-display font-extrabold text-white">
                            Garantía de entrega
                        </h3>
                        <p className="text-sm md:text-base text-slate-200 leading-relaxed max-w-xl mx-auto font-normal">
                            Si en la fecha acordada no te entregamos la respuesta de cada una de tus invitaciones (sí, no o "no respondió después de 4 intentos"), te devolvemos el 100% de lo que pagaste.
                        </p>
                        <p className="text-xs text-slate-400 font-medium pt-2">
                            No podemos obligar a nadie a llegar. Lo que sí garantizamos es que nadie se queda sin que le preguntemos.
                        </p>
                    </div>
                </div>
            </section>

            {/* 7. PREGUNTAS FRECUENTES */}
            <section className="py-20 md:py-28 px-6 bg-[#171E28] border-t border-white/10">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#DF3B94]">PREGUNTAS FRECUENTES</span>
                        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">
                            Todo lo que necesitas saber
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {FAQ_ITEMS.map((item, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-colors"
                                >
                                    <button
                                        onClick={() => toggleFaq(idx)}
                                        className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer"
                                    >
                                        <span className="font-bold text-base md:text-lg text-white">
                                            {item.q}
                                        </span>
                                        <ChevronDown className={`h-5 w-5 text-[#DF3B94] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`px-6 pb-6 text-sm md:text-base text-slate-300 leading-relaxed ${isOpen ? 'block' : 'hidden'}`}>
                                        {item.a}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 8. CIERRE */}
            <section className="py-24 md:py-32 px-6 bg-[#222B38] border-t border-white/10">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#DF3B94]">PRÓXIMO PASO</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white leading-tight">
                        Que la lista que le das al salón sea la real.
                    </h2>

                    <p className="text-base md:text-xl text-slate-300 font-normal">
                        Quedan 5 lugares de fundadora para bodas de noviembre a febrero.
                    </p>

                    <div className="pt-2 flex flex-col items-center gap-3">
                        <a
                            href={WHATSAPP_CONFIRMA_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-10 py-5 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-full font-bold text-xs md:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl shadow-[#DF3B94]/30 active:scale-95"
                        >
                            Quiero mi lista confirmada <ArrowRight className="h-5 w-5" />
                        </a>
                        <p className="text-xs text-slate-400 font-medium">
                            Te contestamos por WhatsApp el mismo día.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#171E28] text-white pt-16 pb-12 px-6 border-t border-white/10">
                <div className="mx-auto max-w-7xl space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-4 space-y-4">
                            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
                                <img src="/logo.png?v=3" alt="Invitto" className="h-8 w-auto object-contain brightness-0 invert" />
                            </Link>
                            <p className="text-xs text-slate-400 font-normal leading-relaxed">
                                Invitto Confirma · Confirmación humana y personalizada de invitados para bodas y eventos en México.
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
};

export default ConciergeLanding;
