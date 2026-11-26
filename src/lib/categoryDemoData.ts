import type { Event } from '../types/database.types';

export interface CategoryDemoProfile {
    title: string;
    subtitle: string;
    bannerTitle: string;
    eventType: Event['event_type'];
    heroImageUrl?: string;
    welcomeMessage: string;
    venueName: string;
    venueAddress: string;
    mapsLink: string;
    dressCode: string;
    schedule: Array<{ time: string; event: string; location?: string }>;
    parents?: string;
    padrinos?: string;
    closingMessage?: string;
    giftTable?: {
        enabled: boolean;
        description: string;
        clabe?: string;
        bank?: string;
        beneficiary?: string;
        liverpoolCode?: string;
        amazonWishlist?: string;
    };
    ceremony?: {
        name: string;
        location: string;
        time: string;
    };
    reception?: {
        name: string;
        location: string;
        time: string;
    };
}

export const CATEGORY_DEMO_PROFILES: Record<string, CategoryDemoProfile> = {
    xv: {
        title: 'Valeria Sofía',
        subtitle: 'MIS XV AÑOS',
        bannerTitle: 'Mis XV Años',
        eventType: 'xv',
        heroImageUrl: '/images/categories/xv.jpg',
        welcomeMessage: 'Hay momentos en la vida que son inolvidables, pero compartirlos con las personas que más quiero los hace mágicos. Te espero para celebrar juntos mis XV años.',
        venueName: 'Salón Metropolitan & Jardín',
        venueAddress: 'Av. Paseo de las Palmas #850, Col. Lomas',
        mapsLink: 'https://maps.google.com/?q=Av.+Paseo+de+las+Palmas+850',
        dressCode: 'Rigurosa Etiqueta / Vestido Largo (Se reserva el color esmeralda para la festejada)',
        parents: 'Mis Papás: Carlos Mendoza & Mariana Villarreal',
        padrinos: 'Padrinos de Honor: Roberto Mendoza & Laura Villarreal',
        closingMessage: 'Gracias por ser parte fundamental de mi vida y celebrar conmigo una noche que guardaré por siempre en mi corazón.',
        ceremony: {
            name: 'Misa de Acción de Gracias — Parroquia San Juan Bautista',
            location: 'Plaza Hidalgo #12, Centro Histórico',
            time: '18:00'
        },
        reception: {
            name: 'Gran Gala de XV Años — Salón Metropolitan',
            location: 'Av. Paseo de las Palmas #850',
            time: '20:00'
        },
        schedule: [
            { time: '18:00', event: 'Misa de Acción de Gracias ⛪', location: 'Parroquia San Juan Bautista' },
            { time: '19:30', event: 'Recepción & Cóctel de Bienvenida 🍸', location: 'Foyer Metropolitan' },
            { time: '21:00', event: 'Vals Principal & Entrada Triunfal 👑', location: 'Pista Central' },
            { time: '22:00', event: 'Cena de Gala & Brindis de Honor 🥂', location: 'Salón Principal' },
            { time: '23:00', event: 'Apertura de Pista & Fiesta con DJ 🎶', location: 'Pista Central' }
        ],
        giftTable: {
            enabled: true,
            description: 'Tu presencia es mi mejor regalo. Si deseas hacerme un presente, pongo a tu disposición mi mesa de regalos o lluvia de sobres en recepción:',
            liverpoolCode: 'EVENTO-50493821',
            bank: 'BBVA',
            clabe: '012180004567891234',
            beneficiary: 'Valeria Sofía Mendoza'
        }
    },
    bautizo: {
        title: 'Mi Bautizo — Santiago',
        subtitle: 'SACRAMENTO DEL BAUTISMO',
        bannerTitle: 'Mi Bautizo',
        eventType: 'bautizo',
        heroImageUrl: '/images/categories/bautizo.jpg',
        welcomeMessage: 'Doy gracias a Dios por el don de la vida y a mis papás y padrinos por guiar mis primeros pasos en la fe.',
        venueName: 'Hacienda Los Laureles',
        venueAddress: 'Camino Real a Cholula #45',
        mapsLink: 'https://maps.google.com/?q=Hacienda+Los+Laureles',
        dressCode: 'Blanco / Guayabera o Vestido de Día',
        parents: 'Mis Papás: David Morales & Sofía Castillo',
        padrinos: 'Mis Padrinos: Alejandro Castillo & Carolina Ruiz',
        closingMessage: 'Gracias por bendecir el inicio de mi camino espiritual con tu cariño y compañía.',
        ceremony: {
            name: 'Ceremonia de Bautismo — Parroquia San Francisco',
            location: 'Calzada de los Fresnos #200',
            time: '12:00'
        },
        reception: {
            name: 'Recepción Familiar — Hacienda Los Laureles',
            location: 'Camino Real a Cholula #45',
            time: '14:00'
        },
        schedule: [
            { time: '12:00', event: 'Ceremonia de Bautismo 🕊️', location: 'Parroquia San Francisco' },
            { time: '14:00', event: 'Recepción & Comida Familiar 🥂', location: 'Jardín Principal' },
            { time: '16:00', event: 'Pastel & Mesa de Dulces 🎂', location: 'Terraza' },
            { time: '17:30', event: 'Tarde de Convivio Familiar ☕', location: 'Jardín Principal' }
        ],
        giftTable: {
            enabled: true,
            description: 'El mejor regalo es contar con tu bendición y cariño. Si deseas tener un detalle con Santiago:',
            bank: 'Santander',
            clabe: '014180001234567890',
            beneficiary: 'David Morales / Cuenta Santiago'
        }
    },
    baby_shower: {
        title: 'Baby Shower — Esperando a Emma',
        subtitle: '¡YA CASI LLEGA NUESTRA PRINCESA!',
        bannerTitle: 'Baby Shower',
        eventType: 'baby_shower',
        heroImageUrl: '/images/categories/baby_shower.jpg',
        welcomeMessage: 'Con mucha ilusión y el corazón lleno de amor, te invitamos a celebrar la próxima llegada de nuestra pequeña Emma.',
        venueName: 'Jardín Magnolia',
        venueAddress: 'Av. Manuel Gómez Morín #300, San Pedro',
        mapsLink: 'https://maps.google.com/?q=Av.+Manuel+Gomez+Morin+300',
        dressCode: 'Casual Elegante / Tonos Pastel',
        parents: 'Futuros Papás: Daniel & Daniela',
        closingMessage: 'Gracias por acompañarnos y colmar de amor y buenos deseos la llegada de Emma.',
        reception: {
            name: 'Celebración Baby Shower — Jardín Magnolia',
            location: 'Av. Manuel Gómez Morín #300',
            time: '16:30'
        },
        schedule: [
            { time: '16:30', event: 'Bienvenida & Mesa de Bebidas 🌸', location: 'Terraza Magnolia' },
            { time: '17:30', event: 'Juegos, Dinámicas & Risas 🍼', location: 'Jardín Central' },
            { time: '19:00', event: 'Merienda Especial & Mesa de Postres 🧁', location: 'Salón Climatizado' },
            { time: '20:30', event: 'Agradecimientos & Apertura de Regalos 🎁', location: 'Salón Climatizado' }
        ],
        giftTable: {
            enabled: true,
            description: 'Para ayudarnos a preparar la llegada de Emma, ponemos a tu disposición nuestra mesa de regalos:',
            liverpoolCode: 'BABY-EMMA-2026',
            amazonWishlist: 'https://amazon.com.mx/baby-reg/emma',
            bank: 'BBVA',
            clabe: '012180009876543210',
            beneficiary: 'Daniela Garza'
        }
    },
    comunion: {
        title: 'Mi Primera Comunión — Mateo',
        subtitle: 'EN COMPAÑÍA DE DIOS Y MI FAMILIA',
        bannerTitle: 'Mi Primera Comunión',
        eventType: 'comunion',
        heroImageUrl: '/images/categories/comunion.jpg',
        welcomeMessage: 'Señor, haz de mi corazón un sagrario digno de recibirte por primera vez. Gracias por acompañarme en este día tan sagrado.',
        venueName: 'Quinta Santa María',
        venueAddress: 'Calzada del Valle #800, Colonia del Valle',
        mapsLink: 'https://maps.google.com/?q=Calzada+del+Valle+800',
        dressCode: 'Formal / Guayabera o Traje Claro',
        parents: 'Mis Papás: Fernando Ruiz & Patricia Morales',
        padrinos: 'Mis Padrinos: Héctor Morales & Claudia Sánchez',
        closingMessage: 'Gracias por ser testigo de mi primer encuentro con Jesús en la Eucaristía.',
        ceremony: {
            name: 'Misa de Primera Comunión — Templo de San Agustín',
            location: 'Real de San Agustín #100',
            time: '10:00'
        },
        reception: {
            name: 'Brunch Conmemorativo — Quinta Santa María',
            location: 'Calzada del Valle #800',
            time: '12:30'
        },
        schedule: [
            { time: '10:00', event: 'Misa de Primera Comunión 🕊️', location: 'Templo de San Agustín' },
            { time: '12:30', event: 'Brunch & Cóctel de Honor ☕', location: 'Jardín de la Quinta' },
            { time: '14:30', event: 'Brindis Familiar & Mesa de Postres 🍰', location: 'Salón Principal' }
        ],
        giftTable: {
            enabled: true,
            description: 'Tu compañía y bendición es nuestro regalo más valioso. Si deseas tener un detalle con Mateo:',
            bank: 'Banorte',
            clabe: '072180005544332211',
            beneficiary: 'Fernando Ruiz / Mateo'
        }
    },
    graduacion: {
        title: 'Graduación Generación 2026',
        subtitle: 'LICENCIATURA EN DERECHO — UNIV. IBERO',
        bannerTitle: 'Nuestra Graduación',
        eventType: 'graduacion',
        heroImageUrl: '/images/categories/graduacion.jpg',
        welcomeMessage: 'El esfuerzo de ayer es el éxito de hoy. Llegó el momento de celebrar la culminación de nuestra etapa universitaria y brindar por el camino que comienza.',
        venueName: 'Pabellón M — Gran Salón de Eventos',
        venueAddress: 'Av. Constitución #100, Centro de Monterrey',
        mapsLink: 'https://maps.google.com/?q=Pabellon+M+Monterrey',
        dressCode: 'Rigurosa Etiqueta / Smoking o Traje Oscuro',
        closingMessage: 'Agradecemos a nuestras familias y maestros por impulsarnos a alcanzar nuestras metas.',
        ceremony: {
            name: 'Acto Académico — Auditorio Pabellón M',
            location: 'Av. Constitución #100',
            time: '18:00'
        },
        reception: {
            name: 'Cena de Gala & Fiesta — Gran Salón Pabellón M',
            location: 'Av. Constitución #100, Nivel 5',
            time: '20:30'
        },
        schedule: [
            { time: '18:00', event: 'Acto Académico & Entrega de Diplomas 🎓', location: 'Auditorio Principal' },
            { time: '20:30', event: 'Alfombra Roja & Cóctel de Honor 🥂', location: 'Foyer Panorámico' },
            { time: '21:30', event: 'Cena de Gala & Último Pase de Lista 🍽️', location: 'Gran Salón' },
            { time: '23:00', event: 'Brindis de Egresados & Gran Fiesta 🎷', location: 'Pista Central' }
        ],
        giftTable: {
            enabled: true,
            description: 'Tu presencia en nuestra graduación es el mejor reconocimiento. Para detalles y obsequios disponemos de lluvia de sobres en el acceso.'
        }
    },
    cumpleanos: {
        title: 'Celebrando mis 30 — Rodrigo',
        subtitle: 'A NIGHT TO REMEMBER',
        bannerTitle: 'Gran Festejo de Cumpleaños',
        eventType: 'birthday',
        heroImageUrl: '/images/categories/cumpleanos.jpg',
        welcomeMessage: 'Los 30 solo se cumplen una vez. Acompáñame a festejar una nueva década con buena música, cena, tragos y la mejor compañía.',
        venueName: 'Terraza Rooftop 45',
        venueAddress: 'Calle Londres #210, Col. Juárez, CDMX',
        mapsLink: 'https://maps.google.com/?q=Calle+Londres+210+Juarez',
        dressCode: 'Smart Casual / Noche de Fiesta',
        closingMessage: 'Gracias por formar parte de estos primeros 30 años y por celebrar conmigo esta noche.',
        reception: {
            name: 'Festejo de Cumpleaños — Rooftop 45',
            location: 'Calle Londres #210',
            time: '20:00'
        },
        schedule: [
            { time: '20:00', event: 'Welcome Drinks & Mixología 🍸', location: 'Terraza Lounge' },
            { time: '21:30', event: 'Cena Urbana & Taquiza Gourmet 🌮', location: 'Área Comedor' },
            { time: '23:00', event: 'Las Mañanitas, Pastel & Brindis 🎂', location: 'Bar Central' },
            { time: '23:30', event: 'DJ en Vivo & Fiesta hasta la madrugada 🪩', location: 'Pista Abierta' }
        ],
        giftTable: {
            enabled: true,
            description: '¡El mejor regalo es que no faltes y brindes conmigo! Si deseas tener un detalle:',
            bank: 'BBVA',
            clabe: '012180003322119988',
            beneficiary: 'Rodrigo Morales'
        }
    },
    gender_reveal: {
        title: '¿Niño o Niña? — Baby Reveal',
        subtitle: 'MATEO O SOFÍA · DESCÚBRELO CON NOSOTROS',
        bannerTitle: '¿Niño o Niña?',
        eventType: 'gender_reveal',
        heroImageUrl: '/images/categories/gender_reveal.jpg',
        welcomeMessage: '¿Equipo azul o equipo rosa? Ven listo con tu atuendo del color de tu predicción y descubramos juntos este gran secreto.',
        venueName: 'Quinta San Mateo',
        venueAddress: 'Carretera Nacional Km 245, El Uro',
        mapsLink: 'https://maps.google.com/?q=Carretera+Nacional+Km+245',
        dressCode: 'Usa un detalle Azul o Rosa según tu predicción',
        parents: 'Futuros Papás: Jorge & Andrea',
        closingMessage: 'Sea niño o niña, ya es inmensamente amado por todos nosotros. ¡Gracias por compartir este momento mágico!',
        reception: {
            name: 'Fiesta de Revelación — Quinta San Mateo',
            location: 'Carretera Nacional Km 245',
            time: '15:00'
        },
        schedule: [
            { time: '15:00', event: 'Recepción & Votación de Equipo (Rosa vs Azul) 👶', location: 'Entrada Principal' },
            { time: '16:30', event: 'Juegos de Predicciones & Apuestas Familiares 🎯', location: 'Jardín' },
            { time: '17:30', event: '¡EL GRAN MOMENTO DE LA REVELACIÓN! 💨✨', location: 'Explanada' },
            { time: '18:00', event: 'Brindis, Merienda & Festejo 🎉', location: 'Terraza' }
        ],
        giftTable: {
            enabled: true,
            description: 'Para ayudarnos a consentir a nuestro bebé que viene en camino:',
            bank: 'Banorte',
            clabe: '072180008877665544',
            beneficiary: 'Andrea Fuentes'
        }
    },
    infantil: {
        title: 'Mi Cumpleaños Mágico — Lucas',
        subtitle: '¡CUMPLO 5 AÑOS!',
        bannerTitle: '¡Mi Fiesta de Cumpleaños!',
        eventType: 'birthday',
        heroImageUrl: '/images/templates/dinosaurios.jpg',
        welcomeMessage: '¡Ven a celebrar mi cumpleaños número 5! Habrá juegos increíbles, piñata, show, pastel y muchísima diversión.',
        venueName: 'Salón de Fiestas Aventura Kids',
        venueAddress: 'Av. Eugenio Garza Sada #3200',
        mapsLink: 'https://maps.google.com/?q=Av.+Eugenio+Garza+Sada+3200',
        dressCode: 'Casual / Ropa cómoda para jugar',
        parents: 'Mis Papás: Javier & Marcela',
        closingMessage: '¡Gracias por venir a mi fiesta y hacer mi cumpleaños tan especial!',
        reception: {
            name: 'Festejo Infantil — Aventura Kids',
            location: 'Av. Eugenio Garza Sada #3200',
            time: '15:00'
        },
        schedule: [
            { time: '15:00', event: 'Bienvenida & Área de Juegos Inflables 🎈', location: 'Área Central' },
            { time: '16:30', event: 'Show Infantil & Sorpresas 🎭', location: 'Escenario Kids' },
            { time: '17:30', event: 'Piñata & Las Mañanitas 🪅', location: 'Patio de Piñatas' },
            { time: '18:00', event: 'Pastel, Merienda & Dulceros 🎂', location: 'Salón Comedor' }
        ],
        giftTable: {
            enabled: true,
            description: '¡El mejor regalo es tu sonrisa y jugar juntos!'
        }
    }
};

/**
 * Aplica sobre un evento demo los datos contextuales de la categoría solicitada
 * cuando el usuario está navegando en el catálogo en una pestaña específica (ej. ?category=xv).
 * Si la plantilla ya pertenece nativamente a esa categoría, o si la categoría es 'todas' o 'boda',
 * el evento conserva su diseño y datos originales.
 */
export function applyCategoryDemoOverlay(baseEvent: Event, requestedCategory?: string | null): Event {
    if (!requestedCategory || requestedCategory === 'todas' || requestedCategory === 'auto') {
        return baseEvent;
    }

    const normCat = requestedCategory.toLowerCase().trim();
    const profile = CATEGORY_DEMO_PROFILES[normCat];
    if (!profile) return baseEvent;

    // Si el evento base ya es nativamente de esta categoría (ej. un evento que ya es 'xv'), no sobreescribir
    const nativeType = (baseEvent.event_type || '').toLowerCase();
    if (nativeType === profile.eventType && (
        (normCat === 'xv' && nativeType === 'xv') ||
        (normCat === 'bautizo' && nativeType === 'bautizo') ||
        (normCat === 'baby_shower' && nativeType === 'baby_shower') ||
        (normCat === 'comunion' && nativeType === 'comunion') ||
        (normCat === 'graduacion' && nativeType === 'graduacion') ||
        (normCat === 'gender_reveal' && nativeType === 'gender_reveal')
    )) {
        return baseEvent;
    }

    const updated: Event = { ...baseEvent };
    updated.title = profile.title;
    updated.event_type = profile.eventType;
    updated.venue_name = profile.venueName;
    updated.venue_address = profile.venueAddress;
    updated.maps_link = profile.mapsLink;
    updated.dress_code = profile.dressCode;

    // Actualizar theme_config con textos y agenda del tipo de evento
    const baseCfg = (baseEvent.theme_config || {}) as Record<string, any>;
    const updatedCfg: Record<string, any> = {
        ...baseCfg,
        event_type: profile.eventType,
        customTitle: profile.title,
        title: profile.title,
        subtitle: profile.subtitle,
        banner_title: profile.bannerTitle,
        bannerTitle: profile.bannerTitle,
        welcome_message: profile.welcomeMessage,
        welcomeMessage: profile.welcomeMessage,
        dress_code: profile.dressCode,
        dressCode: profile.dressCode,
        schedule: profile.schedule,
        itinerary: profile.schedule,
        parents: profile.parents,
        padrinos: profile.padrinos,
        closing_message: profile.closingMessage,
        closingMessage: profile.closingMessage,
        venue_name: profile.venueName,
        venue_address: profile.venueAddress,
    };

    if (profile.heroImageUrl) {
        updatedCfg.hero_image_url = profile.heroImageUrl;
        updatedCfg.heroImage = profile.heroImageUrl;
        updatedCfg.coverPhoto = profile.heroImageUrl;
        updatedCfg.photo = profile.heroImageUrl;
    }

    if (profile.ceremony) {
        updatedCfg.ceremony = profile.ceremony;
    }
    if (profile.reception) {
        updatedCfg.reception = profile.reception;
    }
    if (profile.giftTable) {
        updatedCfg.gift_table = {
            ...(baseCfg.gift_table || {}),
            ...profile.giftTable
        };
    }

    updated.theme_config = updatedCfg;
    return updated;
}
