import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, RotateCcw, MapPin, SlidersHorizontal, Eye, ExternalLink, X, Smartphone, Monitor, Check, Clock, Church } from 'lucide-react';
import { EVENT_TYPE_OPTIONS } from '../../pages/EventWizard';
import { CANONICAL_TEMPLATES, getTemplatesForCategory, normalizeEventCategory } from '../../lib/themePresets';
import type { WizardData } from '../../pages/EventWizard';

interface Message {
    id: string;
    sender: 'assistant' | 'user';
    text: string;
    timestamp: Date;
    chips?: { label: string; value: string; icon?: any }[];
    templateCards?: { id: string; name: string; thumbnail: string; categoryLabel: string; slug: string }[];
    isSummary?: boolean;
}

interface Props {
    data: WizardData;
    updateData: (patch: Partial<WizardData>) => void;
    onSwitchToManual: () => void;
    onSubmit: () => void;
    loading: boolean;
}

const MONTHS_MAP: Record<string, number> = {
    enero: 1, en: 1,
    febrero: 2, feb: 2,
    marzo: 3, mar: 3,
    abril: 4, abr: 4,
    mayo: 5, may: 5,
    junio: 6, jun: 6,
    julio: 7, jul: 7,
    agosto: 8, ago: 8,
    septiembre: 9, setiembre: 9, sep: 9, set: 9,
    octubre: 10, oct: 10,
    noviembre: 11, nov: 11,
    diciembre: 12, dic: 12
};

const MONTH_NAMES_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/**
 * Parsea hora en texto en español de manera estricta
 */
function parseTimeStr(str: string): { hour: number; minute: number; timeStr24: string; timeStrDisplay: string } | null {
    const lower = str.toLowerCase();

    // 1. Con dos puntos (ej: 8:30 pm, 20:00, 8:00pm, 12:00pm, a las 5:30 pm)
    const colonMatch = lower.match(/(?:(?:a\s+las?|a\s+la|alas)\s*)?(\d{1,2}):(\d{2})\s*(am|pm|p\.m\.|a\.m\.|hrs|horas|de la tarde|de la noche|de la mañana)?/i);
    if (colonMatch) {
        let h = parseInt(colonMatch[1], 10);
        const m = parseInt(colonMatch[2], 10);
        const period = colonMatch[3] || '';
        const isPm = period.includes('pm') || period.includes('tarde') || period.includes('noche');
        const isAm = period.includes('am') || period.includes('mañana');

        if (isPm && h < 12) h += 12;
        if (isAm && h === 12) h = 0;

        if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
            const hStr = String(h).padStart(2, '0');
            const mStr = String(m).padStart(2, '0');
            const displayH = h % 12 === 0 ? 12 : h % 12;
            const displayPeriod = h >= 12 ? 'pm' : 'am';
            return {
                hour: h,
                minute: m,
                timeStr24: `${hStr}:${mStr}`,
                timeStrDisplay: `${displayH}:${mStr} ${displayPeriod} (${hStr}:${mStr} hrs)`
            };
        }
    }

    // 2. Sin dos puntos con indicador explícito (ej: "a las 8 pm", "8 pm", "8pm", "8 de la noche", "20 hrs")
    const wordMatch = lower.match(/(?:(?:a\s+las?|a\s+la|alas)\s*)?(\d{1,2})\s*(pm|am|p\.m\.|a\.m\.|hrs|horas|de la tarde|de la noche|de la mañana)/i);
    if (wordMatch) {
        let h = parseInt(wordMatch[1], 10);
        const period = wordMatch[2] || '';
        const isPm = period.includes('pm') || period.includes('tarde') || period.includes('noche');
        const isAm = period.includes('am') || period.includes('mañana');

        if (isPm && h < 12) h += 12;
        if (isAm && h === 12) h = 0;

        if (h >= 0 && h <= 23) {
            const hStr = String(h).padStart(2, '0');
            const mStr = '00';
            const displayH = h % 12 === 0 ? 12 : h % 12;
            const displayPeriod = h >= 12 ? 'pm' : 'am';
            return {
                hour: h,
                minute: 0,
                timeStr24: `${hStr}:${mStr}`,
                timeStrDisplay: `${displayH}:${mStr} ${displayPeriod} (${hStr}:${mStr} hrs)`
            };
        }
    }

    // 3. Con prefijo "a las X" sin am/pm
    const alasMatch = lower.match(/(?:a\s+las?|a\s+la|alas)\s*(\d{1,2})(?!\d)/i);
    if (alasMatch) {
        let h = parseInt(alasMatch[1], 10);
        if (h >= 1 && h <= 6) {
            h += 12; // 1 a 6 de la tarde
        } else if (h >= 7 && h <= 11) {
            h += 12; // 7 a 11 de la noche
        }
        if (h >= 0 && h <= 23) {
            const hStr = String(h).padStart(2, '0');
            const mStr = '00';
            const displayH = h % 12 === 0 ? 12 : h % 12;
            const displayPeriod = h >= 12 ? 'pm' : 'am';
            return {
                hour: h,
                minute: 0,
                timeStr24: `${hStr}:${mStr}`,
                timeStrDisplay: `${displayH}:${mStr} ${displayPeriod} (${hStr}:${mStr} hrs)`
            };
        }
    }

    return null;
}

/**
 * Parsea fecha en texto en español (ej: "23 de mayo 2027", "23/05/2027")
 */
function parseDateStr(str: string): { year: number; month: number; day: number; dateStrYmd: string; dateStrDisplay: string } | null {
    const lower = str.toLowerCase();

    // Patrón 1: "23 de mayo 2027", "23 de mayo del 2027", "23 mayo 2027"
    const monthKeys = Object.keys(MONTHS_MAP).join('|');
    const regexText = new RegExp(`(?:el\\s+)?(\\d{1,2})\\s*(?:de|\\/|-|\\s)\\s*(${monthKeys})\\s*(?:del?|de|\\/|-|\\s)?\\s*(\\d{4})?`, 'i');
    const match1 = lower.match(regexText);
    if (match1) {
        const d = parseInt(match1[1], 10);
        const mName = match1[2].toLowerCase();
        const m = MONTHS_MAP[mName];
        let y = match1[3] ? parseInt(match1[3], 10) : new Date().getFullYear();

        if (!match1[3]) {
            const now = new Date();
            if (m < now.getMonth() + 1 || (m === now.getMonth() + 1 && d < now.getDate())) {
                y = now.getFullYear() + 1;
            }
        }

        if (d >= 1 && d <= 31 && m >= 1 && m <= 12) {
            const dStr = String(d).padStart(2, '0');
            const mStr = String(m).padStart(2, '0');
            return {
                year: y,
                month: m,
                day: d,
                dateStrYmd: `${y}-${mStr}-${dStr}`,
                dateStrDisplay: `${d} de ${MONTH_NAMES_ES[m - 1]} de ${y}`
            };
        }
    }

    // Patrón 2: DD/MM/YYYY
    const slashMatch = lower.match(/(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})/);
    if (slashMatch) {
        const d = parseInt(slashMatch[1], 10);
        const m = parseInt(slashMatch[2], 10);
        const y = parseInt(slashMatch[3], 10);
        if (d >= 1 && d <= 31 && m >= 1 && m <= 12) {
            const dStr = String(d).padStart(2, '0');
            const mStr = String(m).padStart(2, '0');
            return {
                year: y,
                month: m,
                day: d,
                dateStrYmd: `${y}-${mStr}-${dStr}`,
                dateStrDisplay: `${d} de ${MONTH_NAMES_ES[m - 1]} de ${y}`
            };
        }
    }

    // Patrón 3: YYYY-MM-DD
    const isoMatch = lower.match(/(\d{4})[\/\.-](\d{1,2})[\/\.-](\d{1,2})/);
    if (isoMatch) {
        const y = parseInt(isoMatch[1], 10);
        const m = parseInt(isoMatch[2], 10);
        const d = parseInt(isoMatch[3], 10);
        if (d >= 1 && d <= 31 && m >= 1 && m <= 12) {
            const dStr = String(d).padStart(2, '0');
            const mStr = String(m).padStart(2, '0');
            return {
                year: y,
                month: m,
                day: d,
                dateStrYmd: `${y}-${mStr}-${dStr}`,
                dateStrDisplay: `${d} de ${MONTH_NAMES_ES[m - 1]} de ${y}`
            };
        }
    }

    return null;
}

export default function WizardAiAssistant({ data, updateData, onSwitchToManual, onSubmit, loading }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [currentStep, setCurrentStep] = useState<string>('intro');
    const [isTyping, setIsTyping] = useState(false);
    
    // Modal de vista previa interactiva
    const [previewModalSlug, setPreviewModalSlug] = useState<string | null>(null);
    const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

    // Almacenamiento temporal para pasos que requieren validación en 2 turnos
    const [tempDateStrYmd, setTempDateStrYmd] = useState<string>('');
    const [tempDateDisplay, setTempDateDisplay] = useState<string>('');
    const [tempMisaName, setTempMisaName] = useState<string>('');
    const [tempVenueName, setTempVenueName] = useState<string>('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sincroniza datos con sessionStorage y localStorage para que la vista previa en iframe o pestaña externa muestre los datos reales ingresados
    const syncPreviewStorage = (currentData: WizardData) => {
        try {
            const payload = JSON.stringify(currentData);
            sessionStorage.setItem('invitto_wizard_preview_data', payload);
            localStorage.setItem('invitto_wizard_preview_data', payload);
        } catch (e) {
            console.warn('Could not sync wizard preview storage', e);
        }
    };

    const updateDataAndSync = (patch: Partial<WizardData>) => {
        const next = { ...data, ...patch };
        updateData(patch);
        syncPreviewStorage(next);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Inicializar la conversación y sincronizar almacenamiento
    useEffect(() => {
        syncPreviewStorage(data);
        if (messages.length === 0) {
            startConversation();
        }
    }, []);

    const addAssistantMessage = (
        text: string, 
        chips?: { label: string; value: string; icon?: any }[], 
        templateCards?: { id: string; name: string; thumbnail: string; categoryLabel: string; slug: string }[],
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
        }, 550);
    };

    const startConversation = () => {
        const typeChips = EVENT_TYPE_OPTIONS.map(opt => ({
            label: opt.label,
            value: opt.id,
            icon: opt.icon
        }));

        addAssistantMessage(
            '¡Hola! Soy tu asistente de Invitto ✨. Te ayudaré a crear y configurar tu invitación digital paso a paso.\n\nPara comenzar, ¿qué tipo de celebración estás organizando?',
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
                updateDataAndSync({ 
                    event_type: detectedType as any,
                    theme: option.defaultTheme || data.theme
                });

                let namePrompt = '¡Excelente! ¿Cómo se llaman los novios? (Ejemplo: Sofía & Carlos)';
                if (detectedType === 'xv') {
                    namePrompt = '¡Qué hermosa celebración! ¿Cuál es el nombre de la quinceañera? (Ejemplo: Valeria)';
                } else if (detectedType === 'gender_reveal') {
                    namePrompt = '¡Felicidades por esta nueva etapa! ¿Qué título llevará la revelación? (Ejemplo: ¿Mateo o Sofía? / Revelación Bebé Navarro)';
                } else if (detectedType === 'baby_shower') {
                    namePrompt = '¡Qué tierna ocasión! ¿Cómo se llamará el bebé o la futura mamá? (Ejemplo: Baby Shower de Lucas / Mamá Regina)';
                } else if (detectedType === 'bautizo') {
                    namePrompt = '¡Bendiciones! ¿Cuál es el nombre del pequeño o pequeña que se bautiza?';
                } else if (detectedType === 'birthday') {
                    namePrompt = '¡A festejar la vida! ¿Cómo se llama el cumpleañero o cumpleañera y cuántos años cumple?';
                } else if (detectedType === 'graduacion') {
                    namePrompt = '¡Gran logro! ¿Cuál es el nombre del graduado o la generación escolar?';
                }

                addAssistantMessage(namePrompt);
                setCurrentStep('ask_title');
                break;
            }

            case 'ask_title': {
                const title = userText;
                updateDataAndSync({ title });

                addAssistantMessage(
                    `¡Me encanta! "${title}".\n\nAhora indícame la fecha y la hora del evento.\n(Ejemplo: "23 de mayo 2027 a las 8 pm" o "15/12/2026 a las 19:00 hrs")`
                );
                setCurrentStep('ask_datetime');
                break;
            }

            case 'ask_datetime': {
                const parsedDate = parseDateStr(userText);
                const parsedTime = parseTimeStr(userText);

                // Caso 1: Se dio la fecha pero FALTA la hora
                if (parsedDate && !parsedTime) {
                    setTempDateStrYmd(parsedDate.dateStrYmd);
                    setTempDateDisplay(parsedDate.dateStrDisplay);
                    addAssistantMessage(
                        `Anoté la fecha: **${parsedDate.dateStrDisplay}** 📅.\n\nEs un requisito indispensable para la invitación saber el horario:\n**¿A qué hora comenzará la recepción o celebración?**\n(Ejemplo: 8:00 pm, 19:30 hrs o 20:00)`
                    );
                    setCurrentStep('ask_time_only');
                    return;
                }

                // Caso 2: Se dio la hora pero FALTA la fecha
                if (!parsedDate && parsedTime) {
                    updateDataAndSync({ venue_time: parsedTime.timeStr24 });
                    addAssistantMessage(
                        `Anoté el horario: **${parsedTime.timeStrDisplay}** 🕗.\n\nAhora es necesario indicar la fecha:\n**¿Qué día, mes y año se celebrará tu evento?**\n(Ejemplo: 23 de mayo de 2027 o 24/10/2026)`
                    );
                    setCurrentStep('ask_date_only');
                    return;
                }

                // Caso 3: No se entendió ni fecha ni hora
                if (!parsedDate || !parsedTime) {
                    addAssistantMessage(
                        'No pude identificar claramente la fecha y hora. Por favor indícalas con día, mes, año y horario.\n(Ejemplo: "23 de mayo 2027 a las 8 pm")'
                    );
                    return;
                }

                // Caso 4: Se dieron AMBOS datos correctamente
                const combinedIso = `${parsedDate.dateStrYmd}T${parsedTime.timeStr24}`;
                const testDate = new Date(combinedIso);
                if (isNaN(testDate.getTime())) {
                    addAssistantMessage('La fecha ingresada no es válida. Por favor escribe una fecha válida (Ejemplo: "23 de mayo 2027 a las 8:00 pm").');
                    return;
                }
                if (testDate < new Date()) {
                    addAssistantMessage('La fecha del evento debe ser a futuro. Por favor indica una fecha posterior a hoy.');
                    return;
                }

                updateDataAndSync({
                    date_time: combinedIso,
                    venue_time: parsedTime.timeStr24
                });

                continueAfterDateTime(parsedDate.dateStrDisplay, parsedTime.timeStrDisplay);
                break;
            }

            case 'ask_time_only': {
                const parsedTime = parseTimeStr(userText);
                if (!parsedTime) {
                    addAssistantMessage(
                        'Por favor indícame la hora de inicio en formato claro (Ejemplo: "8:00 pm", "20:00 hrs" o "a las 7 pm").'
                    );
                    return;
                }

                const dateBase = tempDateStrYmd || new Date().toISOString().slice(0, 10);
                const combinedIso = `${dateBase}T${parsedTime.timeStr24}`;

                updateDataAndSync({
                    date_time: combinedIso,
                    venue_time: parsedTime.timeStr24
                });

                continueAfterDateTime(tempDateDisplay || 'la fecha indicada', parsedTime.timeStrDisplay);
                break;
            }

            case 'ask_date_only': {
                const parsedDate = parseDateStr(userText);
                if (!parsedDate) {
                    addAssistantMessage(
                        'Por favor indícame el día, mes y año de tu evento (Ejemplo: "23 de mayo 2027" o "18/11/2026").'
                    );
                    return;
                }

                const currentTime = data.venue_time || '19:00';
                const combinedIso = `${parsedDate.dateStrYmd}T${currentTime}`;
                const testDate = new Date(combinedIso);
                if (testDate < new Date()) {
                    addAssistantMessage('La fecha del evento debe ser futura. Por favor escribe una fecha posterior a hoy.');
                    return;
                }

                updateDataAndSync({
                    date_time: combinedIso
                });

                const timeDisplay = `${currentTime} hrs`;
                continueAfterDateTime(parsedDate.dateStrDisplay, timeDisplay);
                break;
            }

            case 'ask_has_misa': {
                if (lower === 'yes' || lower.includes('sí') || lower.includes('si')) {
                    addAssistantMessage(
                        '¿Cómo se llama la parroquia o templo y a qué hora será la misa? ⛪\n(Ejemplo: Parroquia de San Juan a las 5:00 pm)'
                    );
                    setCurrentStep('ask_misa_details');
                } else {
                    addAssistantMessage(
                        '¡Perfecto, todo concentrado en un solo lugar! ✨\n\n¿Cómo se llama el salón, terraza o hacienda donde será la fiesta? (Ejemplo: Salón Las Palmas)'
                    );
                    setCurrentStep('ask_venue');
                }
                break;
            }

            case 'ask_misa_details': {
                const timeInMisa = parseTimeStr(userText);

                if (!timeInMisa) {
                    // El usuario dio el nombre de la parroquia pero no dio la hora -> Insistir estrictamente
                    setTempMisaName(userText);
                    updateDataAndSync({
                        misa_name: userText,
                        misa_address: userText
                    });
                    addAssistantMessage(
                        `Tengo registrada la iglesia: **${userText}** ⛪.\n\nEs un requisito indispensable para la invitación indicar el horario:\n**¿A qué hora será la misa o ceremonia religiosa?**\n(Ejemplo: 5:00 pm o 17:00 hrs)`
                    );
                    setCurrentStep('ask_misa_time');
                    return;
                }

                // El usuario proporcionó tanto templo como hora
                let churchName = userText
                    .replace(/(?:a\s+las?|a\s+la|alas)?\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|p\.m\.|a\.m\.|hrs|horas|de la tarde|de la noche)?/gi, '')
                    .replace(/,\s*$/, '')
                    .trim();

                if (!churchName || churchName.length < 3) {
                    churchName = userText;
                }

                updateDataAndSync({
                    misa_name: churchName,
                    misa_address: churchName,
                    misa_time: timeInMisa.timeStr24
                });

                addAssistantMessage(
                    `¡Anotado! Ceremonia religiosa en **${churchName} a las ${timeInMisa.timeStrDisplay}** ⛪.\n\nAhora, ¿cómo se llama el salón, terraza o hacienda donde será la fiesta o recepción? (Ejemplo: Salón Las Palmas)`
                );
                setCurrentStep('ask_venue');
                break;
            }

            case 'ask_misa_time': {
                const timeInMisa = parseTimeStr(userText);
                if (!timeInMisa) {
                    addAssistantMessage(
                        'Por favor indícame la hora de la misa (Ejemplo: "5:00 pm", "17:00 hrs" o "12 del día").'
                    );
                    return;
                }

                updateDataAndSync({
                    misa_time: timeInMisa.timeStr24
                });

                const church = tempMisaName || data.misa_name || 'la parroquia';
                addAssistantMessage(
                    `¡Excelente! Ceremonia en **${church} a las ${timeInMisa.timeStrDisplay}** ⛪.\n\nAhora, ¿cómo se llama el salón, terraza o hacienda donde será la fiesta o recepción? (Ejemplo: Hacienda San Gabriel)`
                );
                setCurrentStep('ask_venue');
                break;
            }

            case 'ask_venue': {
                const rawVenue = userText.trim();

                // Verificar si el usuario ya incluyó la ciudad en su mensaje (ej: "Salón 1, Guadalajara" o "Salón 1 en Monterrey")
                let detectedVenue = rawVenue;
                let detectedCity = '';

                if (rawVenue.includes(',')) {
                    const parts = rawVenue.split(',');
                    detectedVenue = parts[0].trim();
                    detectedCity = parts.slice(1).join(',').trim();
                } else if (/\s+en\s+/i.test(rawVenue)) {
                    const parts = rawVenue.split(/\s+en\s+/i);
                    detectedVenue = parts[0].trim();
                    detectedCity = parts[1].trim();
                }

                if (detectedCity) {
                    // El usuario ingresó salón y ciudad juntos
                    const fullAddress = `${detectedVenue}, ${detectedCity}`;
                    updateDataAndSync({
                        venue_name: detectedVenue,
                        venue_address: fullAddress,
                        maps_link: `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`
                    });

                    addAssistantMessage(`¡Anotado! Lugar: **${detectedVenue} en ${detectedCity}** 📍.`);
                    askThemeStyle();
                    return;
                }

                // El usuario solo dio el nombre del salón (ej: "salón 1") -> Preguntar estrictamente por la ciudad
                setTempVenueName(rawVenue);
                updateDataAndSync({
                    venue_name: rawVenue,
                    venue_address: rawVenue
                });

                addAssistantMessage(
                    `Anoté el lugar: **${rawVenue}** 📍.\n\nEs indispensable para tus invitados y para el botón de Google Maps saber la ubicación:\n**¿En qué ciudad o cuál es la dirección completa donde se ubica?**\n(Ejemplo: Guadalajara, Jal. / Monterrey / CDMX)`
                );
                setCurrentStep('ask_venue_city');
                break;
            }

            case 'ask_venue_city': {
                const cityOrAddress = userText.trim();
                const venueName = tempVenueName || data.venue_name || 'Lugar de recepción';
                const fullAddress = `${venueName}, ${cityOrAddress}`;

                updateDataAndSync({
                    venue_name: venueName,
                    venue_address: fullAddress,
                    maps_link: `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`
                });

                addAssistantMessage(
                    `¡Perfecto! Recepción en **${venueName} (${cityOrAddress})** 📍.`
                );
                askThemeStyle();
                break;
            }

            case 'ask_theme_style': {
                const styleChosen = directValue || userText;
                recommendTemplatesByStyle(styleChosen);
                break;
            }

            case 'ask_theme': {
                const selectedTheme = directValue || 'classic';
                updateDataAndSync({ theme: selectedTheme });

                const templateObj = CANONICAL_TEMPLATES.find(t => t.id === selectedTheme);
                const themeName = templateObj?.name || 'elegida';

                // Opciones de dress code según el evento
                let dressChips = [
                    { label: 'Formal', value: 'Formal' },
                    { label: 'Etiqueta Rigurosa (Black Tie)', value: 'Etiqueta Rigurosa (Black Tie)' },
                    { label: 'Cóctel / Semiformal', value: 'Semiformal / Cóctel' },
                    { label: 'Formal de Playa / Guayabera', value: 'Formal de Playa / Guayabera' },
                    { label: 'Sin código (Libre)', value: 'Sin Código de Vestimenta' }
                ];

                if (data.event_type === 'gender_reveal') {
                    dressChips = [
                        { label: 'Viste de Azul o Rosa 💙💖', value: 'Viste de azul si crees que es niño o de rosa si crees que es niña' },
                        { label: 'Monocromático (Blanco o Negro) 🤍🖤', value: 'Monocromático Estricto (Blanco o Negro)' },
                        { label: 'Casual Elegante', value: 'Casual Elegante' },
                        { label: 'Sin código (Libre)', value: 'Sin Código de Vestimenta' }
                    ];
                }

                addAssistantMessage(
                    `¡Preciosa elección! La plantilla "${themeName}" lucirá increíble ✨.\n\n¿Qué código de vestimenta sugerirás a tus invitados?`,
                    dressChips
                );
                setCurrentStep('ask_dress_code');
                break;
            }

            case 'ask_dress_code': {
                const dressCode = directValue || userText;
                updateDataAndSync({ dress_code: dressCode });

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
                if (lower.includes('liverpool') || lower.includes('amazon') || directValue === 'registry') {
                    addAssistantMessage('¡Anotado! Podrás enlazar tus números de evento de Liverpool o Amazon fácilmente.');
                } else if (lower.includes('sobres') || lower.includes('transferencia') || directValue === 'cash') {
                    addAssistantMessage('¡Perfecto! Se habilitará la opción para tu cuenta CLABE y lluvia de sobres con mensaje cordial.');
                } else {
                    addAssistantMessage('¡Muy bien! Se omitirá la mesa de regalos para centrarse en la compañía de tus invitados.');
                }

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
                        '¿Cómo se llama el hotel recomendado? (Ejemplo: Hotel Fiesta Americana / Tarifa especial con código BODA2027)'
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
                let deadlineStr = '';
                if (directValue === '2_weeks') {
                    const eventDate = new Date(data.date_time);
                    const deadline = new Date(eventDate.getTime() - 86400000 * 14);
                    deadlineStr = deadline.toISOString().slice(0, 10);
                } else if (directValue === '1_month') {
                    const eventDate = new Date(data.date_time);
                    const deadline = new Date(eventDate.getTime() - 86400000 * 30);
                    deadlineStr = deadline.toISOString().slice(0, 10);
                } else {
                    const eventDate = new Date(data.date_time);
                    const deadline = new Date(eventDate.getTime() - 86400000 * 15);
                    deadlineStr = deadline.toISOString().slice(0, 10);
                }

                updateDataAndSync({ rsvp_deadline: deadlineStr });
                showSummary();
                break;
            }

            case 'summary_chat': {
                if (directValue === 'preview') {
                    syncPreviewStorage(data);
                    const currentTpl = CANONICAL_TEMPLATES.find(t => t.id === data.theme) || CANONICAL_TEMPLATES[0];
                    setPreviewModalSlug(currentTpl.slug);
                    return;
                }
                if (directValue === 'publish') {
                    onSubmit();
                    return;
                }
                if (directValue === 'manual') {
                    onSwitchToManual();
                    return;
                }

                if (lower.includes('hora') || lower.includes('horario')) {
                    const newTime = parseTimeStr(userText);
                    if (newTime) {
                        const dateOnly = (data.date_time || '2027-01-01').slice(0, 10);
                        updateDataAndSync({
                            date_time: `${dateOnly}T${newTime.timeStr24}`,
                            venue_time: newTime.timeStr24
                        });
                        addAssistantMessage(`¡Horario actualizado a ${newTime.timeStrDisplay}! 🎉`);
                    } else {
                        addAssistantMessage('Indícame la nueva hora (ejemplo: "9:00 pm" o "21:00 hrs").');
                    }
                } else if (lower.includes('salón') || lower.includes('salon') || lower.includes('hacienda') || lower.includes('lugar')) {
                    updateDataAndSync({ venue_name: userText, venue_address: userText });
                    addAssistantMessage(`¡Listo! Actualicé el lugar a "${userText}".`);
                } else if (lower.includes('misa') || lower.includes('iglesia') || lower.includes('templo')) {
                    updateDataAndSync({ misa_name: userText, misa_address: userText });
                    addAssistantMessage(`¡Listo! Iglesia actualizada a "${userText}".`);
                } else if (lower.includes('vestimenta') || lower.includes('ropa') || lower.includes('dress')) {
                    updateDataAndSync({ dress_code: userText });
                    addAssistantMessage(`¡Listo! Código de vestimenta actualizado a "${userText}".`);
                } else {
                    addAssistantMessage(
                        'He tomado nota de tus comentarios. Puedes abrir la vista previa para ver el resultado o publicar de inmediato:',
                        [
                            { label: '👁️ Ver Vista Previa', value: 'preview' },
                            { label: '🚀 Guardar y Publicar', value: 'publish' },
                            { label: '📝 Formulario Clásico', value: 'manual' }
                        ]
                    );
                }
                break;
            }

            default:
                break;
        }
    };

    const continueAfterDateTime = (dateDisplay: string, timeDisplay: string) => {
        const isReligiousOrFormal = ['wedding', 'xv', 'bautizo', 'primera_comunion', 'confirmacion'].includes(data.event_type);

        if (isReligiousOrFormal) {
            addAssistantMessage(
                `Entendido: **${dateDisplay} a las ${timeDisplay}** 🎉.\n\n¿Tendrán ceremonia religiosa o misa previa a la fiesta?`,
                [
                    { label: 'Sí, tendremos ceremonia religiosa ⛪', value: 'yes' },
                    { label: 'No, todo será en el salón o recepción ✨', value: 'no' }
                ]
            );
            setCurrentStep('ask_has_misa');
        } else {
            addAssistantMessage(
                `Entendido: **${dateDisplay} a las ${timeDisplay}** 🎉.\n\n¿Cómo se llama el salón, terraza o hacienda donde lo van a celebrar? (Ejemplo: Salón Las Palmas)`
            );
            setCurrentStep('ask_venue');
        }
    };

    const askThemeStyle = () => {
        let styleChips = [
            { label: '🏛️ Elegante & Clásico', value: 'classic' },
            { label: '🌿 Rústico / Boho / Jardín', value: 'rustic' },
            { label: '🌸 Romántico & Floral', value: 'floral' },
            { label: '🖤 Moderno & Minimalista', value: 'modern' },
            { label: '✈️ Boda Destino / Viaje', value: 'destination' }
        ];

        if (data.event_type === 'xv') {
            styleChips = [
                { label: '👑 Princesa Clásica & Gala', value: 'classic' },
                { label: '🌸 Romántica & Floral', value: 'floral' },
                { label: '📖 Estilo Revista Juvenil', value: 'magazine' },
                { label: '🪩 Neón / Party Festivo', value: 'neon' }
            ];
        } else if (data.event_type === 'gender_reveal') {
            styleChips = [
                { label: '🤍🖤 Monocromático Misterio (B&W)', value: 'reveal_bw' },
                { label: '💙💖 Dúo Rosa & Azul (Tradicional)', value: 'reveal_duo' },
                { label: '🌿 Neutral & Minimalista', value: 'modern' }
            ];
        } else if (data.event_type === 'birthday' || data.event_type === 'baby_shower' || data.event_type === 'bautizo') {
            styleChips = [
                { label: '🎈 Fantasía Infantil & Dulce', value: 'kids' },
                { label: '🌈 Rainbow Pop Multicolor', value: 'rainbow' },
                { label: '🎮 Gamer / Píxel', value: 'gamer' },
                { label: '🏛️ Clásico & Elegante', value: 'classic' }
            ];
        }

        addAssistantMessage(
            `Para recomendarte la plantilla ideal: **¿Qué estilo, vibra visual o tema tienes en mente para tu evento?**`,
            styleChips
        );
        setCurrentStep('ask_theme_style');
    };

    const recommendTemplatesByStyle = (style: string) => {
        const lower = style.toLowerCase();
        const category = normalizeEventCategory(data.event_type);
        const allCategoryTemplates = getTemplatesForCategory(category);

        let filtered = allCategoryTemplates;

        if (lower.includes('reveal_bw') || lower.includes('monocromático') || lower.includes('blanco y negro') || lower.includes('misterio')) {
            filtered = allCategoryTemplates.filter(t => t.id === 'reveal-bw').concat(allCategoryTemplates.filter(t => t.id !== 'reveal-bw'));
        } else if (lower.includes('reveal_duo') || lower.includes('rosa') || lower.includes('azul') || lower.includes('dúo')) {
            filtered = allCategoryTemplates.filter(t => t.id === 'reveal-duo').concat(allCategoryTemplates.filter(t => t.id !== 'reveal-duo'));
        } else if (lower.includes('rustic') || lower.includes('rústico') || lower.includes('jardín') || lower.includes('boho')) {
            const prioritized = ['romantic-botanical', 'floral-symmetry', 'collage'];
            filtered = allCategoryTemplates.filter(t => prioritized.includes(t.id)).concat(allCategoryTemplates.filter(t => !prioritized.includes(t.id)));
        } else if (lower.includes('floral') || lower.includes('romántico') || lower.includes('romantico')) {
            const prioritized = ['floral-symmetry', 'romantic-botanical', 'classic'];
            filtered = allCategoryTemplates.filter(t => prioritized.includes(t.id)).concat(allCategoryTemplates.filter(t => !prioritized.includes(t.id)));
        } else if (lower.includes('modern') || lower.includes('minimalista') || lower.includes('vanguardia')) {
            const prioritized = ['modern-minimalist', 'split-screen', 'magazine'];
            filtered = allCategoryTemplates.filter(t => prioritized.includes(t.id)).concat(allCategoryTemplates.filter(t => !prioritized.includes(t.id)));
        } else if (lower.includes('destination') || lower.includes('destino') || lower.includes('playa') || lower.includes('viaje')) {
            const prioritized = ['passport', 'split-screen', 'classic'];
            filtered = allCategoryTemplates.filter(t => prioritized.includes(t.id)).concat(allCategoryTemplates.filter(t => !prioritized.includes(t.id)));
        } else if (lower.includes('magazine') || lower.includes('revista')) {
            const prioritized = ['magazine', 'newspaper', 'split-screen'];
            filtered = allCategoryTemplates.filter(t => prioritized.includes(t.id)).concat(allCategoryTemplates.filter(t => !prioritized.includes(t.id)));
        } else if (lower.includes('neon') || lower.includes('fiesta')) {
            const prioritized = ['neon-glow', 'split-screen'];
            filtered = allCategoryTemplates.filter(t => prioritized.includes(t.id)).concat(allCategoryTemplates.filter(t => !prioritized.includes(t.id)));
        } else if (lower.includes('gamer')) {
            const prioritized = ['gamer-party', 'pixel-craft'];
            filtered = allCategoryTemplates.filter(t => prioritized.includes(t.id)).concat(allCategoryTemplates.filter(t => !prioritized.includes(t.id)));
        } else if (lower.includes('rainbow')) {
            const prioritized = ['rainbow-pop', 'whimsical-kids'];
            filtered = allCategoryTemplates.filter(t => prioritized.includes(t.id)).concat(allCategoryTemplates.filter(t => !prioritized.includes(t.id)));
        } else if (lower.includes('kids') || lower.includes('infantil')) {
            const prioritized = ['whimsical-kids', 'rainbow-pop', 'kids-farm'];
            filtered = allCategoryTemplates.filter(t => prioritized.includes(t.id)).concat(allCategoryTemplates.filter(t => !prioritized.includes(t.id)));
        } else {
            // Clásico / Elegante por defecto
            const prioritized = ['classic', 'classic-elegance-pro', 'luxury-gold'];
            filtered = allCategoryTemplates.filter(t => prioritized.includes(t.id)).concat(allCategoryTemplates.filter(t => !prioritized.includes(t.id)));
        }

        const cards = filtered.slice(0, 3).map(t => ({
            id: t.id,
            name: t.name,
            thumbnail: t.thumbnail,
            categoryLabel: t.categoryLabel,
            slug: t.slug
        }));

        addAssistantMessage(
            `¡Gran visión de estilo! Para esa temática, estas son las mejores plantillas prediseñadas para ti. Puedes ver un previo interactivo con tus datos reales o seleccionar tu favorita:`,
            [
                { label: '🎨 Ver todas las plantillas disponibles', value: 'all_templates' }
            ],
            cards
        );
        setCurrentStep('ask_theme');
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
            `🎉 ¡Felicidades! He recopilado toda la información para tu invitación.\n\nPuedes ver la vista previa para asegurarte de que todo luce perfecto, hacer ajustes o publicarla de inmediato:`,
            [
                { label: '👁️ Ver Vista Previa', value: 'preview' },
                { label: '🚀 Guardar y Publicar', value: 'publish' },
                { label: '📝 Editar en Formulario Clásico', value: 'manual' }
            ],
            undefined,
            true
        );
        setCurrentStep('summary_chat');
    };

    const openPreviewModal = (slug: string) => {
        syncPreviewStorage(data);
        setPreviewModalSlug(slug);
    };

    const selectedTemplateObj = CANONICAL_TEMPLATES.find(t => t.id === data.theme) || CANONICAL_TEMPLATES[0];

    return (
        <>
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
                                className={`max-w-[90%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                                    msg.sender === 'user'
                                        ? 'bg-[#DF3B94] text-white rounded-br-none'
                                        : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-sm'
                                }`}
                            >
                                <p className="whitespace-pre-line">{msg.text}</p>

                                {/* Tarjetas de Selección de Plantillas con botón de Previsualización */}
                                {msg.templateCards && msg.templateCards.length > 0 && (
                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {msg.templateCards.map((tpl) => (
                                            <div
                                                key={tpl.id}
                                                className={`group relative rounded-2xl overflow-hidden border-2 transition-all bg-white hover:shadow-md flex flex-col justify-between ${
                                                    data.theme === tpl.id ? 'border-[#DF3B94] ring-2 ring-[#DF3B94]/20' : 'border-stone-200 hover:border-stone-300'
                                                }`}
                                            >
                                                <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100 relative">
                                                    <img 
                                                        src={tpl.thumbnail} 
                                                        alt={tpl.name} 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                                                    <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-sm">
                                                        {tpl.categoryLabel}
                                                    </span>
                                                </div>
                                                <div className="p-3 text-center space-y-2">
                                                    <p className="text-xs font-bold text-stone-900 truncate">{tpl.name}</p>
                                                    <div className="flex items-center gap-1.5 justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openPreviewModal(tpl.slug);
                                                            }}
                                                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all flex items-center gap-1 cursor-pointer"
                                                            title="Ver demo en vivo con tus datos"
                                                        >
                                                            <Eye className="h-3 w-3 text-stone-600" />
                                                            <span>Ver previo</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUserResponse(`Elegí la plantilla: ${tpl.name}`, tpl.id)}
                                                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-[#DF3B94] hover:bg-[#C52A7C] text-white transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                                                        >
                                                            <Check className="h-3 w-3" />
                                                            <span>Elegir</span>
                                                        </button>
                                                    </div>
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
                                            <div className="flex-1 min-w-0">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#DF3B94]">
                                                    Plantilla: {selectedTemplateObj.name}
                                                </span>
                                                <h4 className="text-base font-bold text-white truncate">{data.title || 'Mi Gran Evento'}</h4>
                                                <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5 truncate">
                                                    <MapPin className="h-3 w-3 text-stone-500 shrink-0" />
                                                    <span className="truncate">{data.venue_address || data.venue_name || 'Lugar por definir'}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-stone-950/60 p-3 rounded-xl border border-white/5">
                                            <div>
                                                <span className="text-[10px] text-stone-500 uppercase block font-semibold flex items-center gap-1">
                                                    <Clock className="h-2.5 w-2.5" /> Recepción
                                                </span>
                                                <span className="text-stone-200 font-medium">{data.venue_time || 'Por definir'} hrs</span>
                                            </div>
                                            {data.misa_name && (
                                                <div>
                                                    <span className="text-[10px] text-stone-500 uppercase block font-semibold flex items-center gap-1">
                                                        <Church className="h-2.5 w-2.5" /> Misa
                                                    </span>
                                                    <span className="text-stone-200 font-medium">{data.misa_time || 'Por definir'} hrs</span>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-[10px] text-stone-500 uppercase block font-semibold">Vestimenta</span>
                                                <span className="text-stone-200 font-medium truncate block">{data.dress_code || 'Formal'}</span>
                                            </div>
                                        </div>

                                        <div className="pt-2 flex flex-col sm:flex-row gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openPreviewModal(selectedTemplateObj.slug)}
                                                className="py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/15"
                                            >
                                                <Eye className="h-4 w-4 text-[#DF3B94]" />
                                                <span>Ver Vista Previa</span>
                                            </button>
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
                                                className="py-3 px-4 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-stone-300 transition-all flex items-center justify-center gap-1.5"
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

            {/* Modal de Vista Previa Interactiva */}
            {previewModalSlug && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
                    <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden shadow-2xl">
                        {/* Header del Modal */}
                        <div className="px-5 py-3 border-b border-stone-800 bg-stone-950 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <span className="text-xs uppercase tracking-widest font-black text-[#DF3B94] bg-[#DF3B94]/10 px-2.5 py-1 rounded-full border border-[#DF3B94]/20">
                                    Vista Previa Interactiva
                                </span>
                                <span className="text-xs text-stone-400 hidden sm:inline">
                                    Previsualizando con tus datos en tiempo real
                                </span>
                            </div>

                            {/* Controles: Dispositivo & Cerrar */}
                            <div className="flex items-center gap-2">
                                <div className="bg-stone-800 p-0.5 rounded-xl flex items-center border border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewDevice('mobile')}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                            previewDevice === 'mobile' ? 'bg-[#DF3B94] text-white' : 'text-stone-400 hover:text-white'
                                        }`}
                                    >
                                        <Smartphone className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Móvil</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewDevice('desktop')}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                            previewDevice === 'desktop' ? 'bg-[#DF3B94] text-white' : 'text-stone-400 hover:text-white'
                                        }`}
                                    >
                                        <Monitor className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Escritorio</span>
                                    </button>
                                </div>

                                <a
                                    href={`/i/${previewModalSlug}?t=token-preview&wizard_preview=1`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-all"
                                    title="Abrir en pestaña nueva"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>

                                <button
                                    type="button"
                                    onClick={() => setPreviewModalSlug(null)}
                                    className="p-1.5 rounded-xl bg-stone-800 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 transition-all"
                                    title="Cerrar vista previa"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Contenido del Iframe con tus datos sincronizados */}
                        <div className="flex-1 bg-stone-950 flex items-center justify-center p-2 sm:p-4 overflow-hidden relative">
                            {previewDevice === 'mobile' ? (
                                <div className="w-[375px] h-full max-h-[740px] rounded-[40px] border-[10px] border-stone-800 shadow-2xl overflow-hidden bg-black flex flex-col">
                                    <div className="h-5 bg-stone-800 flex items-center justify-center">
                                        <div className="w-16 h-3 bg-stone-900 rounded-full" />
                                    </div>
                                    <iframe
                                        src={`/i/${previewModalSlug}?t=token-preview&wizard_preview=1&_ts=${Date.now()}`}
                                        title="Vista Previa Móvil"
                                        className="w-full flex-1 border-0"
                                    />
                                </div>
                            ) : (
                                <iframe
                                    src={`/i/${previewModalSlug}?t=token-preview&wizard_preview=1&_ts=${Date.now()}`}
                                    title="Vista Previa Escritorio"
                                    className="w-full h-full rounded-2xl border border-stone-800 shadow-2xl"
                                />
                            )}
                        </div>

                        {/* Footer del Modal */}
                        <div className="px-5 py-3 border-t border-stone-800 bg-stone-950 flex items-center justify-between">
                            <span className="text-xs text-stone-400">
                                {previewDevice === 'mobile' ? 'Vista optimizada para WhatsApp e Instagram' : 'Vista en pantalla completa'}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPreviewModalSlug(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white bg-stone-800/80 hover:bg-stone-800 transition-all"
                                >
                                    Volver al asistente
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const matchingTpl = CANONICAL_TEMPLATES.find(t => t.slug === previewModalSlug);
                                        if (matchingTpl) {
                                            updateDataAndSync({ theme: matchingTpl.id });
                                            handleUserResponse(`Elegí la plantilla: ${matchingTpl.name}`, matchingTpl.id);
                                        }
                                        setPreviewModalSlug(null);
                                    }}
                                    className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#DF3B94] hover:bg-[#C52A7C] text-white shadow-lg shadow-pink-500/30 transition-all flex items-center gap-1.5"
                                >
                                    <Check className="h-4 w-4" />
                                    <span>Elegir esta plantilla</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
