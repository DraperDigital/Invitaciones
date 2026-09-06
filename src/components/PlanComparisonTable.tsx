import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Minus, Gem, Crown, Heart, Sparkles, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface PlanComparisonTableProps {
    eventId?: string | null;
    theme?: string | null;
}

interface FeatureItem {
    name: string;
    description?: string;
    clasico: string | boolean;
    pro: string | boolean;
    premium: string | boolean;
    concierge: string | boolean;
}

interface FeatureCategory {
    id: string;
    title: string;
    icon: string;
    features: FeatureItem[];
}

const COMPARISON_CATEGORIES: FeatureCategory[] = [
    {
        id: 'diseno',
        title: 'Diseño & Experiencia Visual',
        icon: '🎨',
        features: [
            {
                name: 'Página web responsive (móviles y PC)',
                description: 'Diseño adaptativo que luce impecable en cualquier pantalla',
                clasico: true,
                pro: true,
                premium: true,
                concierge: true,
            },
            {
                name: 'Personalización de colores y tipografías',
                description: 'Paletas de colores y fuentes armónicas con tu evento',
                clasico: true,
                pro: true,
                premium: true,
                concierge: true,
            },
            {
                name: 'Cuenta regresiva interactiva',
                description: 'Reloj dinámico en tiempo real hacia el día del evento',
                clasico: true,
                pro: true,
                premium: true,
                concierge: true,
            },
            {
                name: 'Ubicación GPS interactiva (Maps / Waze)',
                description: 'Botones directos para abrir la ruta en Google Maps y Waze',
                clasico: true,
                pro: true,
                premium: true,
                concierge: true,
            },
            {
                name: 'Itinerario detallado y código de vestimenta',
                description: 'Programa del evento, guía de etiqueta y ejemplos visuales',
                clasico: true,
                pro: true,
                premium: true,
                concierge: true,
            },
            {
                name: 'Mesa de regalos & datos bancarios',
                description: 'Enlaces directos a tiendas (Liverpool, Amazon, etc.) o transferencia bancaria',
                clasico: true,
                pro: true,
                premium: true,
                concierge: true,
            },
            {
                name: 'Galería de fotos',
                description: 'Fotos del festejado/pareja con visor a pantalla completa',
                clasico: 'Hasta 10 fotos',
                pro: 'Hasta 20 fotos',
                premium: 'Ilimitadas',
                concierge: 'Ilimitadas',
            },
            {
                name: 'Música de fondo personalizable',
                description: 'Canción elegida por ti con reproductor sutil y control de audio',
                clasico: true,
                pro: true,
                premium: true,
                concierge: true,
            },
            {
                name: 'Sección de padrinos o familiares destacados',
                description: 'Mención especial y dedicatoria para personas clave del evento',
                clasico: false,
                pro: true,
                premium: true,
                concierge: true,
            },
            {
                name: 'Sugerencias de hospedaje para foráneos',
                description: 'Hoteles recomendados con tarifas especiales o datos de reserva',
                clasico: false,
                pro: true,
                premium: true,
                concierge: true,
            },
        ],
    },
    {
        id: 'gestion',
        title: 'Gestión & Confirmación de Invitados (RSVP)',
        icon: '👥',
        features: [
            {
                name: 'Tipo de confirmación de asistencia',
                description: 'Cómo reciben los anfitriones las respuestas de los invitados',
                clasico: 'WhatsApp directo',
                pro: 'Dashboard en tiempo real',
                premium: 'Dashboard en tiempo real',
                concierge: 'Gestión Concierge + Dashboard',
            },
            {
                name: 'Panel / Dashboard administrativo',
                description: 'Acceso privado para consultar confirmados, declinados y pendientes',
                clasico: false,
                pro: true,
                premium: true,
                concierge: true,
            },
            {
                name: 'Control de pases y boletos asignados',
                description: 'Limitar cuántos adultos y niños puede confirmar cada familia',
                clasico: false,
                pro: true,
                premium: true,
                concierge: true,
            },
            {
                name: 'Registro de acompañantes con nombre',
                description: 'Saber el nombre y apellido exacto de cada acompañante',
                clasico: false,
                pro: true,
                premium: true,
                concierge: true,
            },
            {
                name: 'Importación masiva de invitados (Excel / CSV)',
                description: 'Sube tu lista completa de invitados en segundos sin capturar uno a uno',
                clasico: false,
                pro: true,
                premium: true,
                concierge: true,
            },
            {
                name: 'Mensajes personalizados por invitado',
                description: 'Links únicos donde cada invitado ve su propio nombre en la invitación',
                clasico: false,
                pro: true,
                premium: true,
                concierge: true,
            },
            {
                name: 'Recordatorios automáticos por WhatsApp',
                description: 'Avisos automáticos a los que aún no han confirmado su asistencia',
                clasico: false,
                pro: true,
                premium: true,
                concierge: 'Realizados por Concierge',
            },
            {
                name: 'Notificaciones instantáneas de confirmación',
                description: 'Alertas cada vez que un invitado responde su asistencia',
                clasico: false,
                pro: true,
                premium: true,
                concierge: true,
            },
        ],
    },
    {
        id: 'acceso',
        title: 'Logística, Acceso & Seguridad',
        icon: '🎟️',
        features: [
            {
                name: 'Asignación de mesas y croquis de distribución',
                description: 'Indicar número o nombre de mesa a cada invitado confirmado',
                clasico: false,
                pro: true,
                premium: true,
                concierge: true,
            },
            {
                name: 'Métricas de visualización y apertura',
                description: 'Saber quién ya abrió la invitación y cuántas veces la ha visto',
                clasico: false,
                pro: true,
                premium: true,
                concierge: true,
            },
            {
                name: 'Código QR individual para pases de acceso',
                description: 'Cada invitado recibe un pase digital con QR único anti-duplicados',
                clasico: false,
                pro: false,
                premium: true,
                concierge: true,
            },
            {
                name: 'Control de acceso / Check-in con escáner en puerta',
                description: 'Validar pases en la entrada desde cualquier smartphone de tu staff',
                clasico: false,
                pro: false,
                premium: true,
                concierge: true,
            },
        ],
    },
    {
        id: 'servicio',
        title: 'Servicios Exclusivos & Soporte',
        icon: '✨',
        features: [
            {
                name: 'Elaboración y diseño de la invitación',
                description: 'Quién se encarga de dar de alta el contenido y afinar el diseño',
                clasico: 'Autoservicio asistido',
                pro: 'Autoservicio asistido',
                premium: 'Diseñador dedicado desde cero',
                concierge: 'Servicio 100% hecho por nosotros',
            },
            {
                name: 'Dominio web personalizado (.com)',
                description: 'Tu propio link exclusivo (ej. www.boda-maria-y-carlos.com)',
                clasico: false,
                pro: false,
                premium: true,
                concierge: true,
            },
            {
                name: 'Gestión total de lista de invitados por nuestro equipo',
                description: 'Nosotros capturamos, organizamos y depuramos tu lista de invitados',
                clasico: false,
                pro: false,
                premium: false,
                concierge: true,
            },
            {
                name: 'Envío de invitaciones vía WhatsApp Business Pro',
                description: 'Nuestro equipo envía las invitaciones personalizadas a tus invitados',
                clasico: false,
                pro: false,
                premium: false,
                concierge: true,
            },
            {
                name: 'Rondas de seguimiento y confirmación',
                description: 'Llamadas y mensajes de seguimiento a quienes no han confirmado',
                clasico: false,
                pro: false,
                premium: false,
                concierge: '4 rondas incluidas',
            },
            {
                name: 'Canal de soporte y atención',
                description: 'Nivel de acompañamiento técnico para resolver cualquier imprevisto',
                clasico: 'Email / Estándar',
                pro: 'WhatsApp prioritario',
                premium: 'Diseñador asignado 1 a 1',
                concierge: 'Concierge dedicado 24/7',
            },
            {
                name: 'Reporte ejecutivo final de asistencia',
                description: 'Documento PDF/Excel listo para imprimir o entregar al banquetero',
                clasico: false,
                pro: 'Descarga en Excel',
                premium: 'Descarga en Excel',
                concierge: 'Reporte ejecutivo impreso y digital',
            },
        ],
    },
];

const PLANS_META = [
    {
        id: 'clasico',
        name: 'Clásica',
        tagline: 'Solo lo básico',
        price: '$499',
        currency: 'MXN',
        popular: false,
        icon: Heart,
        cta: 'Elegir Clásica',
        badge: null,
    },
    {
        id: 'pro',
        name: 'Pro',
        tagline: 'Control total de invitados',
        price: '$1,699',
        currency: 'MXN',
        popular: true,
        icon: Gem,
        cta: 'Elegir Pro',
        badge: 'MÁS POPULAR',
    },
    {
        id: 'premium',
        name: 'Diseño Pro',
        tagline: 'Diseño a tu medida',
        price: '$2,499',
        currency: 'MXN',
        popular: false,
        icon: Crown,
        cta: 'Elegir Diseño Pro',
        badge: 'PERSONALIZADO',
    },
    {
        id: 'concierge',
        name: 'Concierge',
        tagline: 'Nosotros hacemos todo',
        price: '$4,499',
        currency: 'MXN',
        popular: false,
        icon: Crown,
        cta: 'Elegir Concierge',
        badge: 'TODO INCLUIDO',
    },
];

export default function PlanComparisonTable({ eventId, theme }: PlanComparisonTableProps) {
    const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
    const [selectedMobilePlan, setSelectedMobilePlan] = useState<string>('pro');

    const toggleCategory = (catId: string) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [catId]: !prev[catId],
        }));
    };

    const getPlanUrl = (planId: string) => {
        return eventId
            ? `/checkout?plan=${planId}&id=${eventId}`
            : `/dashboard/new?plan=${planId}${theme ? `&theme=${theme}` : ''}`;
    };

    const renderValue = (val: string | boolean, isHighlighted = false) => {
        if (typeof val === 'boolean') {
            if (val) {
                return (
                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100/80 text-emerald-700 shadow-sm">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                    </div>
                );
            }
            return (
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-stone-100 text-stone-400">
                    <Minus className="w-4 h-4 stroke-[2]" />
                </div>
            );
        }

        // Text value
        return (
            <span
                className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold text-center leading-tight ${
                    isHighlighted
                        ? 'bg-[#fdf2f8] text-[#e0409a] border border-[#fbcfe8]'
                        : 'bg-stone-100 text-stone-700'
                }`}
            >
                {val}
            </span>
        );
    };

    return (
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            {/* Header Section */}
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fdf2f8] border border-[#fbcfe8] text-[#e0409a] text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Comparativa detallada</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
                    ¿Qué incluye exactamente cada plan?
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                    Compara cada función lado a lado para elegir el plan ideal para tu evento. Sin sorpresas ni costos ocultos.
                </p>
            </div>

            {/* Mobile Plan Selector Tabs (< md screens) */}
            <div className="block md:hidden mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 text-center">
                    Selecciona un plan para comparar:
                </div>
                <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 rounded-2xl border border-stone-200">
                    {PLANS_META.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setSelectedMobilePlan(p.id)}
                            className={`py-2 px-1 text-center rounded-xl transition-all ${
                                selectedMobilePlan === p.id
                                    ? 'bg-white shadow-md text-[#e0409a] font-bold scale-[1.02]'
                                    : 'text-stone-600 hover:text-stone-900 font-medium'
                            }`}
                        >
                            <span className="block text-xs truncate">{p.name}</span>
                            <span className="block text-[10px] font-serif text-stone-400">{p.price}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Container */}
            <div className="relative rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px] md:min-w-full">
                        {/* Table Header with Plans */}
                        <thead>
                            <tr className="border-b border-stone-200 bg-stone-50/70">
                                <th className="p-4 sm:p-6 w-[28%] min-w-[200px] align-bottom bg-stone-50/90 backdrop-blur-sm sticky left-0 z-20 shadow-[2px_0_8px_rgba(0,0,0,0.03)]">
                                    <div className="space-y-1">
                                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-400">
                                            Características
                                        </span>
                                        <p className="text-xs text-stone-500 hidden sm:block">
                                            Desplázate hacia abajo para ver todos los detalles.
                                        </p>
                                    </div>
                                </th>

                                {PLANS_META.map(plan => {
                                    const isPro = plan.id === 'pro';
                                    const isMobileSelected = selectedMobilePlan === plan.id;
                                    return (
                                        <th
                                            key={plan.id}
                                            className={`p-4 sm:p-6 w-[18%] min-w-[150px] text-center align-top relative transition-all ${
                                                isPro
                                                    ? 'bg-slate-900 text-white'
                                                    : 'text-slate-900'
                                            } ${isMobileSelected ? 'ring-2 ring-inset ring-[#e0409a] md:ring-0' : ''}`}
                                        >
                                            {plan.badge && (
                                                <div
                                                    className={`absolute -top-0.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-b-md text-[9px] font-bold uppercase tracking-wider whitespace-nowrap shadow-sm ${
                                                        isPro
                                                            ? 'bg-[#e0409a] text-white'
                                                            : 'bg-stone-200 text-stone-700'
                                                    }`}
                                                >
                                                    {plan.badge}
                                                </div>
                                            )}

                                            <div className="pt-2 space-y-2">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <plan.icon
                                                        className={`w-4 h-4 ${
                                                            isPro ? 'text-[#e0409a]' : 'text-stone-400'
                                                        }`}
                                                    />
                                                    <span className="font-display font-extrabold text-base sm:text-lg tracking-tight">
                                                        {plan.name}
                                                    </span>
                                                </div>

                                                <p
                                                    className={`text-[11px] font-light italic leading-tight line-clamp-1 ${
                                                        isPro ? 'text-stone-300' : 'text-stone-500'
                                                    }`}
                                                >
                                                    {plan.tagline}
                                                </p>

                                                <div className="py-1">
                                                    <div className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                                                        {plan.price}
                                                        <span
                                                            className={`text-[10px] ml-1 uppercase font-normal ${
                                                                isPro ? 'text-stone-400' : 'text-stone-400'
                                                            }`}
                                                        >
                                                            {plan.currency}
                                                        </span>
                                                    </div>
                                                    <span
                                                        className={`text-[9px] uppercase tracking-wider block ${
                                                            isPro ? 'text-stone-400' : 'text-stone-400'
                                                        }`}
                                                    >
                                                        Un solo pago
                                                    </span>
                                                </div>

                                                <Link to={getPlanUrl(plan.id)} className="block pt-1">
                                                    <button
                                                        className={`w-full py-2.5 px-3 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all shadow-md hover:scale-[1.02] active:scale-95 ${
                                                            isPro
                                                                ? 'bg-[#e0409a] text-white hover:bg-[#c93284] shadow-[#e0409a]/25'
                                                                : 'bg-[#1B2E1D] text-white hover:bg-[#2D312E]'
                                                        }`}
                                                    >
                                                        {plan.cta}
                                                    </button>
                                                </Link>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        {/* Table Body by Categories */}
                        <tbody className="divide-y divide-stone-100 text-sm">
                            {COMPARISON_CATEGORIES.map(category => {
                                const isCollapsed = collapsedCategories[category.id];

                                return (
                                    <React.Fragment key={category.id}>
                                        {/* Category Title Row */}
                                        <tr className="bg-stone-100/75 border-t-2 border-stone-200">
                                            <td
                                                colSpan={5}
                                                onClick={() => toggleCategory(category.id)}
                                                className="py-3.5 px-4 sm:px-6 cursor-pointer hover:bg-stone-200/60 transition-colors select-none"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="text-lg">{category.icon}</span>
                                                        <span className="font-display font-bold text-slate-800 text-sm sm:text-base tracking-tight">
                                                            {category.title}
                                                        </span>
                                                        <span className="text-xs text-stone-500 font-normal">
                                                            ({category.features.length} características)
                                                        </span>
                                                    </div>
                                                    <div className="text-stone-400 p-1 hover:text-stone-600">
                                                        {isCollapsed ? (
                                                            <ChevronDown className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronUp className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Feature Rows */}
                                        {!isCollapsed &&
                                            category.features.map((feature, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="hover:bg-stone-50/80 transition-colors group"
                                                >
                                                    {/* Feature Name & Description */}
                                                    <td className="p-3.5 sm:p-4 align-middle bg-white group-hover:bg-stone-50/80 sticky left-0 z-10 shadow-[2px_0_8px_rgba(0,0,0,0.02)]">
                                                        <div className="space-y-0.5">
                                                            <span className="font-medium text-slate-800 text-xs sm:text-sm block">
                                                                {feature.name}
                                                            </span>
                                                            {feature.description && (
                                                                <span className="text-[11px] text-stone-500 font-light block leading-tight">
                                                                    {feature.description}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Clásica */}
                                                    <td className="p-3.5 sm:p-4 text-center align-middle">
                                                        {renderValue(feature.clasico)}
                                                    </td>

                                                    {/* Pro (Highlighted column) */}
                                                    <td className="p-3.5 sm:p-4 text-center align-middle bg-[#fdf2f8]/40 border-x border-[#fbcfe8]/40">
                                                        {renderValue(feature.pro, true)}
                                                    </td>

                                                    {/* Diseño Pro */}
                                                    <td className="p-3.5 sm:p-4 text-center align-middle">
                                                        {renderValue(feature.premium)}
                                                    </td>

                                                    {/* Concierge */}
                                                    <td className="p-3.5 sm:p-4 text-center align-middle">
                                                        {renderValue(feature.concierge)}
                                                    </td>
                                                </tr>
                                            ))}
                                    </React.Fragment>
                                );
                            })}

                            {/* Bottom Footer Row with Actions */}
                            <tr className="border-t-2 border-stone-200 bg-stone-50/80">
                                <td className="p-4 sm:p-6 sticky left-0 bg-stone-50/90 z-10 font-bold text-xs uppercase tracking-wider text-stone-500 align-middle">
                                    Elige tu plan
                                </td>
                                {PLANS_META.map(plan => {
                                    const isPro = plan.id === 'pro';
                                    return (
                                        <td
                                            key={plan.id}
                                            className={`p-4 sm:p-6 text-center align-middle ${
                                                isPro ? 'bg-[#fdf2f8]/60 border-x border-[#fbcfe8]/50' : ''
                                            }`}
                                        >
                                            <div className="space-y-2">
                                                <div className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                                                    {plan.price}
                                                </div>
                                                <Link to={getPlanUrl(plan.id)} className="block">
                                                    <button
                                                        className={`w-full py-2.5 px-3 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all shadow-md hover:scale-[1.02] active:scale-95 ${
                                                            isPro
                                                                ? 'bg-[#e0409a] text-white hover:bg-[#c93284] shadow-[#e0409a]/25'
                                                                : 'bg-[#1B2E1D] text-white hover:bg-[#2D312E]'
                                                        }`}
                                                    >
                                                        {plan.cta}
                                                    </button>
                                                </Link>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Explanatory Footer Note */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left text-xs text-stone-500">
                <Info className="w-4 h-4 text-[#e0409a] flex-shrink-0" />
                <span>
                    ¿Tienes dudas sobre qué plan se ajusta mejor a tu cantidad de invitados?{' '}
                    <a
                        href="https://wa.me/5215585338302?text=Hola!%20Tengo%20dudas%20sobre%20los%20planes%20de%20Invitto"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#e0409a] hover:underline"
                    >
                        Escríbenos por WhatsApp para asesorarte gratis →
                    </a>
                </span>
            </div>
        </div>
    );
}
