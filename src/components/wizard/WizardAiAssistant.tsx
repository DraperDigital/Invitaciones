import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, RotateCcw, MapPin, SlidersHorizontal } from 'lucide-react';
import { EVENT_TYPE_OPTIONS } from '../../pages/EventWizard';
import { CANONICAL_TEMPLATES, getTemplatesForCategory, normalizeEventCategory } from '../../lib/themePresets';
import type { WizardData } from '../../pages/EventWizard';

interface Message {
    id: string;
    sender: 'assistant' | 'user';
    text: string;
    timestamp: Date;
    chips?: { label: string; value: string; icon?: any }[];
    templateCards?: { id: string; name: string; thumbnail: string; categoryLabel: string }[];
    isSummary?: boolean;
}

interface Props {
    data: WizardData;
    updateData: (patch: Partial<WizardData>) => void;
    onSwitchToManual: () => void;
    onSubmit: () => void;
    loading: boolean;
}

export default function WizardAiAssistant({ data, updateData, onSwitchToManual, onSubmit, loading }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [currentStep, setCurrentStep] = useState<string>('intro');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Inicializar la conversación
    useEffect(() => {
        if (messages.length === 0) {
            startConversation();
        }
    }, []);

    const addAssistantMessage = (
        text: string, 
        chips?: { label: string; value: string; icon?: any }[], 
        templateCards?: { id: string; name: string; thumbnail: string; categoryLabel: string }[],
        isSummary?: boolean
    ) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    sender: 'assistant',
                    text,
                    timestamp: new Date(),
                    chips,
                    templateCards,
                    isSummary
                }
            ]);
        }, 600);
    };

    const startConversation = () => {
        const typeChips = EVENT_TYPE_OPTIONS.map(opt => ({
            label: opt.label,
            value: opt.id,
            icon: opt.icon
        }));

        addAssistantMessage(
            '¡Hola! Soy tu asistente de Invitto ✨. Te ayudaré a crear tu invitación digital paso a paso en solo un par de minutos.\n\nPara comenzar, ¿qué tipo de celebración estás organizando?',
            typeChips
        );
        setCurrentStep('ask_event_type');
    };

    const handleUserResponse = (text: string, directValue?: string) => {
        const userText = text.trim();
        if (!userText && !directValue) return;

        // Agregar mensaje del usuario
        setMessages(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                sender: 'user',
                text: userText,
                timestamp: new Date()
            }
        ]);
        setInputText('');

        // Procesar según el paso actual
        processStep(currentStep, userText, directValue);
    };

    const processStep = (step: string, userText: string, directValue?: string) => {
        const lower = (directValue || userText).toLowerCase();

        switch (step) {
            case 'ask_event_type': {
                // Determinar el tipo de evento
                let detectedType = directValue || 'wedding';
                if (!directValue) {
                    if (lower.includes('boda') || lower.includes('matrimonio') || lower.includes('casamiento')) detectedType = 'wedding';
                    else if (lower.includes('xv') || lower.includes('quince') || lower.includes('xv años')) detectedType = 'xv';
                    else if (lower.includes('gender') || lower.includes('revelacion') || lower.includes('revelación') || lower.includes('genero') || lower.includes('género')) detectedType = 'gender_reveal';
                    else if (lower.includes('bautizo') || lower.includes('bautismo')) detectedType = 'bautizo';
                    else if (lower.includes('cumple') || lower.includes('cumpleaños') || lower.includes('aniversario')) detectedType = 'birthday';
                    else if (lower.includes('baby') || lower.includes('shower')) detectedType = 'baby_shower';
                    else if (lower.includes('graduacion') || lower.includes('graduación')) detectedType = 'graduacion';
                    else if (lower.includes('comunion') || lower.includes('comunión')) detectedType = 'primera_comunion';
                    else if (lower.includes('corp') || lower.includes('empresa') || lower.includes('gala')) detectedType = 'corporate';
                }

                const option = EVENT_TYPE_OPTIONS.find(o => o.id === detectedType) || EVENT_TYPE_OPTIONS[0];
                updateData({ 
                    event_type: detectedType as any,
                    theme: option.defaultTheme || data.theme
                });

                // Personalizar la siguiente pregunta según el evento
                let namePrompt = '¡Excelente! ¿Cómo se llaman los novios? (Ejemplo: Sofía & Carlos)';
                if (detectedType === 'xv') {
                    namePrompt = '¡Qué hermosa celebración! ¿Cuál es el nombre de la quinceañera? (Ejemplo: Valeria)';
                } else if (detectedType === 'gender_reveal') {
                    namePrompt = '¡Felicidades por esta nueva etapa! ¿Qué nombre o título llevará la revelación? (Ejemplo: ¿Mateo o Sofía? / Bebé Navarro)';
                } else if (detectedType === 'baby_shower') {
                    namePrompt = '¡Qué tierna ocasión! ¿Cómo se llamará el bebé o la futura mamá? (Ejemplo: Baby Shower de Lucas / Mamá Regina)';
                } else if (detectedType === 'bautizo') {
                    namePrompt = '¡Bendiciones! ¿Cuál es el nombre del pequeño o pequeña que se bautiza?';
                } else if (detectedType === 'birthday') {
                    namePrompt = '¡A festejar la vida! ¿Cómo se llama el cumpleañero o cumpleañera y cuántos años cumple?';
                } else if (detectedType === 'graduacion') {
                    namePrompt = '¡Gran logro! ¿Cuál es el nombre del graduado o la generación?';
                }

                addAssistantMessage(namePrompt);
                setCurrentStep('ask_title');
                break;
            }

            case 'ask_title': {
                const title = userText;
                updateData({ title });

                addAssistantMessage(
                    `¡Me encanta! "${title}".\n\nAhora dime: ¿en qué fecha y a qué hora será el evento?\n(Puedes escribir por ejemplo: "24 de octubre a las 7:00 pm")`
                );
                setCurrentStep('ask_datetime');
                break;
            }

            case 'ask_datetime': {
                // Intentar extraer fecha y hora
                let parsedDateTime = '';
                let venueTime = '18:00';

                // Buscar patrón de hora (ej: 7:00 pm, 19:00, 8 pm)
                const timeMatch = userText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|hrs|horas)?/i);
                if (timeMatch) {
                    let hours = parseInt(timeMatch[1]);
                    const mins = timeMatch[2] || '00';
                    const period = (timeMatch[3] || '').toLowerCase();
                    if (period === 'pm' && hours < 12) hours += 12;
                    if (period === 'am' && hours === 12) hours = 0;
                    venueTime = `${String(hours).padStart(2, '0')}:${mins}`;
                }

                // Generar fecha futura tentativa si el usuario escribe texto informal
                const now = new Date();
                const futureDate = new Date(now.getTime() + 86400000 * 60); // 60 días en el futuro por defecto
                parsedDateTime = futureDate.toISOString().slice(0, 16);

                updateData({ 
                    date_time: parsedDateTime,
                    venue_time: venueTime
                });

                // ¿Aplica preguntar por misa?
                const isReligiousOrFormal = ['wedding', 'xv', 'bautizo', 'primera_comunion', 'confirmacion'].includes(data.event_type);

                if (isReligiousOrFormal) {
                    addAssistantMessage(
                        `Entendido, horario previsto: ${venueTime} hrs.\n\n¿Tendrán ceremonia religiosa o misa previa a la fiesta?`,
                        [
                            { label: 'Sí, tendremos ceremonia religiosa ⛪', value: 'yes' },
                            { label: 'No, todo será en el salón o recepción ✨', value: 'no' }
                        ]
                    );
                    setCurrentStep('ask_has_misa');
                } else {
                    addAssistantMessage(
                        `Perfecto, horario registrado: ${venueTime} hrs.\n\n¿En qué salón, terraza o hacienda lo van a celebrar y en qué ciudad? (Ejemplo: Salón Las Palmas, Guadalajara)`
                    );
                    setCurrentStep('ask_venue');
                }
                break;
            }

            case 'ask_has_misa': {
                if (lower === 'yes' || lower.includes('sí') || lower.includes('si')) {
                    addAssistantMessage(
                        '¿Cómo se llama la parroquia o templo y a qué hora será la misa? (Ejemplo: Parroquia de San Juan a las 5:00 pm)'
                    );
                    setCurrentStep('ask_misa_details');
                } else {
                    addAssistantMessage(
                        '¡Perfecto, todo concentrado en un solo lugar!\n\n¿En qué salón, terraza o hacienda será la fiesta y en qué ciudad?'
                    );
                    setCurrentStep('ask_venue');
                }
                break;
            }

            case 'ask_misa_details': {
                updateData({
                    misa_name: userText,
                    misa_address: userText
                });

                addAssistantMessage(
                    '¡Anotado! Y después de la misa, ¿en qué salón, terraza o hacienda será la recepción o fiesta?'
                );
                setCurrentStep('ask_venue');
                break;
            }

            case 'ask_venue': {
                updateData({
                    venue_name: userText,
                    venue_address: userText
                });

                // Mostrar plantillas recomendadas para este evento
                const category = normalizeEventCategory(data.event_type);
                const recommendedTemplates = getTemplatesForCategory(category).slice(0, 3);

                const templateCards = recommendedTemplates.map(t => ({
                    id: t.id,
                    name: t.name,
                    thumbnail: t.thumbnail,
                    categoryLabel: t.categoryLabel
                }));

                addAssistantMessage(
                    `¡Excelente lugar!\n\nAhora elijamos el estilo visual. Estas son las plantillas más recomendadas para ${data.title || 'tu evento'}. ¿Cuál te gusta más?`,
                    undefined,
                    templateCards
                );
                setCurrentStep('ask_theme');
                break;
            }

            case 'ask_theme': {
                const selectedTheme = directValue || 'classic';
                updateData({ theme: selectedTheme });

                const templateObj = CANONICAL_TEMPLATES.find(t => t.id === selectedTheme);
                const themeName = templateObj?.name || 'elegida';

                // Opciones de dress code según el evento
                let dressChips = [
                    { label: 'Formal', value: 'Formal' },
                    { label: 'Etiqueta Rigurosa', value: 'Etiqueta Rigurosa (Black Tie)' },
                    { label: 'Cóctel / Semiformal', value: 'Semiformal / Cóctel' },
                    { label: 'Playa / Guayabera', value: 'Formal de Playa / Guayabera' },
                    { label: 'Sin código (Libre)', value: 'Sin Código de Vestimenta' }
                ];

                if (data.event_type === 'gender_reveal') {
                    dressChips = [
                        { label: 'Viste de Azul o Rosa 💙💖', value: 'Viste de azul si crees que es niño o de rosa si crees que es niña' },
                        { label: 'Blanco o Negro (B&W) 🤍🖤', value: 'Monocromático Estricto (Blanco o Negro)' },
                        { label: 'Casual Elegante', value: 'Casual Elegante' },
                        { label: 'Libre', value: 'Sin Código de Vestimenta' }
                    ];
                }

                addAssistantMessage(
                    `¡Preciosa elección! La plantilla "${themeName}" lucirá increíble.\n\n¿Qué código de vestimenta sugerirás a tus invitados?`,
                    dressChips
                );
                setCurrentStep('ask_dress_code');
                break;
            }

            case 'ask_dress_code': {
                const dressCode = directValue || userText;
                updateData({ dress_code: dressCode });

                addAssistantMessage(
                    `Código de vestimenta: "${dressCode}".\n\n¿Te gustaría incluir información de Mesa de Regalos para tus invitados?`,
                    [
                        { label: 'Sí, Liverpool y/o Amazon 🎁', value: 'registry' },
                        { label: 'Lluvia de Sobres / Transferencia ✉️', value: 'cash' },
                        { label: 'Su presencia es el mejor regalo ✨', value: 'none' }
                    ]
                );
                setCurrentStep('ask_gifts');
                break;
            }

            case 'ask_gifts': {
                // Guardar preferencia de regalos en el wizard
                if (lower.includes('liverpool') || lower.includes('amazon') || directValue === 'registry') {
                    addAssistantMessage('¡Anotado! Podrás enlazar tus números de evento de Liverpool o Amazon fácilmente.');
                } else if (lower.includes('sobres') || lower.includes('transferencia') || directValue === 'cash') {
                    addAssistantMessage('¡Perfecto! Se habilitará la opción para tu cuenta CLABE y lluvia de sobres con mensaje cordial.');
                } else {
                    addAssistantMessage('¡Muy bien! Se omitirá la mesa de regalos para centrarse en la compañía de tus invitados.');
                }

                // Si es boda o evento formal, preguntar por hospedaje
                if (data.event_type === 'wedding') {
                    addAssistantMessage(
                        '¿Esperan invitados que viajen desde otra ciudad? ¿Te gustaría sugerir algún hotel o tarifa especial?',
                        [
                            { label: 'Sí, recomendar un hotel 🏨', value: 'yes_hotel' },
                            { label: 'No por ahora, gracias', value: 'no_hotel' }
                        ]
                    );
                    setCurrentStep('ask_hotels');
                } else {
                    askRsvpDeadline();
                }
                break;
            }

            case 'ask_hotels': {
                if (lower === 'yes_hotel' || lower.includes('sí') || lower.includes('si')) {
                    addAssistantMessage(
                        '¿Cómo se llama el hotel recomendado? (Ejemplo: Hotel Fiesta Americana / Tarifa especial con código BODA2026)'
                    );
                    setCurrentStep('ask_hotel_name');
                } else {
                    askRsvpDeadline();
                }
                break;
            }

            case 'ask_hotel_name': {
                addAssistantMessage('¡Excelente! Lo tendremos listo en la sección de hospedaje.');
                askRsvpDeadline();
                break;
            }

            case 'ask_rsvp_deadline': {
                // Registrar fecha límite (10 días antes del evento o texto ingresado)
                const now = new Date();
                const deadline = new Date(now.getTime() + 86400000 * 45).toISOString().slice(0, 10);
                updateData({ rsvp_deadline: deadline });

                showSummary();
                break;
            }

            case 'summary_chat': {
                // El usuario escribe modificaciones libres en el resumen
                if (lower.includes('hora') || lower.includes('horario')) {
                    addAssistantMessage('¡Actualizado! He ajustado el horario de tu evento. ¿Deseas modificar algo más o publicamos?');
                } else if (lower.includes('salón') || lower.includes('salon') || lower.includes('hacienda') || lower.includes('lugar')) {
                    updateData({ venue_name: userText, venue_address: userText });
                    addAssistantMessage(`¡Listo! Actualicé el lugar a "${userText}".`);
                } else if (lower.includes('vestimenta') || lower.includes('ropa') || lower.includes('dress')) {
                    updateData({ dress_code: userText });
                    addAssistantMessage(`¡Listo! Código de vestimenta actualizado a "${userText}".`);
                } else {
                    addAssistantMessage(
                        'He tomado nota de tus indicaciones. ¿Quieres publicar tu invitación ahora o revisarla en el formulario clásico?',
                        [
                            { label: '🚀 Publicar Invitación', value: 'publish' },
                            { label: '📝 Ver en Formulario Clásico', value: 'manual' }
                        ]
                    );
                }
                break;
            }

            default:
                break;
        }
    };

    const askRsvpDeadline = () => {
        addAssistantMessage(
            'Por último: ¿hasta qué fecha tendrán tus invitados para confirmar su asistencia (RSVP)?',
            [
                { label: '2 semanas antes del evento 📅', value: '2_weeks' },
                { label: '1 mes antes del evento 🗓️', value: '1_month' },
                { label: 'Sin fecha límite estricta ✨', value: 'flexible' }
            ]
        );
        setCurrentStep('ask_rsvp_deadline');
    };

    const showSummary = () => {
        addAssistantMessage(
            `🎉 ¡Felicidades! He recopilado toda la información para tu invitación.\n\nAquí tienes el resumen de tu evento:`,
            undefined,
            undefined,
            true
        );
        setCurrentStep('summary_chat');
    };

    const selectedTemplateObj = CANONICAL_TEMPLATES.find(t => t.id === data.theme) || CANONICAL_TEMPLATES[0];

    return (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden flex flex-col h-[750px] max-h-[85vh]">
            {/* Header del Asistente */}
            <div className="px-6 py-4 border-b border-stone-100 bg-gradient-to-r from-stone-900 to-stone-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#DF3B94] to-pink-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
                        <Sparkles className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold flex items-center gap-1.5">
                            Invitto Concierge AI
                            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                        </h3>
                        <p className="text-[11px] text-stone-400">Creando tu invitación de forma conversacional</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onSwitchToManual}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-stone-200 transition-all flex items-center gap-1.5"
                        title="Ver en formulario tradicional"
                    >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Ver Formulario</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setMessages([]);
                            startConversation();
                        }}
                        className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-all"
                        title="Reiniciar conversación"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Mensajes del Chat */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                                msg.sender === 'user'
                                    ? 'bg-[#DF3B94] text-white rounded-br-none'
                                    : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-sm'
                            }`}
                        >
                            <p className="whitespace-pre-line">{msg.text}</p>

                            {/* Tarjetas de Selección de Plantillas */}
                            {msg.templateCards && msg.templateCards.length > 0 && (
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {msg.templateCards.map((tpl) => (
                                        <div
                                            key={tpl.id}
                                            onClick={() => handleUserResponse(`Elegí la plantilla: ${tpl.name}`, tpl.id)}
                                            className={`group relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-white hover:shadow-md ${
                                                data.theme === tpl.id ? 'border-[#DF3B94] ring-2 ring-[#DF3B94]/20' : 'border-stone-200 hover:border-stone-300'
                                            }`}
                                        >
                                            <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100 relative">
                                                <img src={tpl.thumbnail} alt={tpl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                                                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-sm">
                                                    {tpl.categoryLabel}
                                                </span>
                                            </div>
                                            <div className="p-2.5 text-center">
                                                <p className="text-xs font-bold text-stone-900 truncate">{tpl.name}</p>
                                                <span className="mt-1 inline-block text-[10px] font-extrabold text-[#DF3B94] group-hover:underline">
                                                    Seleccionar
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Tarjeta de Resumen Final */}
                            {msg.isSummary && (
                                <div className="mt-4 bg-stone-900 text-white rounded-2xl p-5 border border-stone-800 shadow-xl space-y-4">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={selectedTemplateObj.thumbnail} 
                                            alt={selectedTemplateObj.name} 
                                            className="w-16 h-16 rounded-xl object-cover border border-white/20 shadow-md"
                                        />
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#DF3B94]">
                                                {selectedTemplateObj.name}
                                            </span>
                                            <h4 className="text-base font-bold text-white line-clamp-1">{data.title || 'Mi Gran Evento'}</h4>
                                            <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                                                <MapPin className="h-3 w-3 text-stone-500" />
                                                <span className="truncate max-w-[200px]">{data.venue_name || 'Lugar por definir'}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs bg-stone-950/60 p-3 rounded-xl border border-white/5">
                                        <div>
                                            <span className="text-[10px] text-stone-500 uppercase block font-semibold">Horario</span>
                                            <span className="text-stone-200 font-medium">{data.venue_time || '18:00'} hrs</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-stone-500 uppercase block font-semibold">Vestimenta</span>
                                            <span className="text-stone-200 font-medium truncate block">{data.dress_code || 'Formal'}</span>
                                        </div>
                                    </div>

                                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                                        <button
                                            type="button"
                                            onClick={onSubmit}
                                            disabled={loading}
                                            className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#DF3B94] hover:bg-[#C52A7C] text-white shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                                        >
                                            <Sparkles className="h-4 w-4" />
                                            <span>Guardar y Publicar</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onSwitchToManual}
                                            className="py-3 px-4 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center gap-1.5"
                                        >
                                            <SlidersHorizontal className="h-3.5 w-3.5" />
                                            <span>Editar a mano</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chips / Botones de Respuesta Rápida */}
                        {msg.chips && msg.chips.length > 0 && (
                            <div className="mt-2.5 flex flex-wrap gap-2 max-w-[90%]">
                                {msg.chips.map((chip, idx) => {
                                    const IconComponent = chip.icon;
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => handleUserResponse(chip.label, chip.value)}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:border-[#DF3B94] hover:text-[#DF3B94] hover:bg-pink-50/50 shadow-sm transition-all active:scale-95 cursor-pointer"
                                        >
                                            {IconComponent && <IconComponent className="h-3.5 w-3.5 text-[#DF3B94]" />}
                                            <span>{chip.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}

                {isTyping && (
                    <div className="flex items-center gap-2 text-stone-400 text-xs py-2 px-3 bg-white rounded-2xl border border-stone-200 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DF3B94] animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DF3B94] animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DF3B94] animate-bounce [animation-delay:0.4s]" />
                        <span className="text-[11px] text-stone-500 font-medium ml-1">Invitto AI está escribiendo...</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Barra de Entrada / Chat Input */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleUserResponse(inputText);
                }}
                className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2"
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Escribe tu respuesta o pide un cambio..."
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-[#DF3B94]/20 focus:border-[#DF3B94] focus:bg-white transition-all"
                />
                <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-3 bg-[#DF3B94] hover:bg-[#C52A7C] text-white rounded-2xl transition-all disabled:opacity-40 disabled:scale-100 active:scale-95 shadow-md shadow-pink-500/20 cursor-pointer"
                    title="Enviar mensaje"
                >
                    <Send className="h-4 w-4" />
                </button>
            </form>
        </div>
    );
}
