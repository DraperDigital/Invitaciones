export interface BlogSection {
  type: 'paragraph' | 'heading' | 'list';
  content?: string;
  items?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  seo: {
    title: string;
    description: string;
  };
  content: BlogSection[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'ventajas-invitaciones-digitales-boda',
    title: '5 Ventajas de usar invitaciones digitales para tu boda',
    description: 'Conoce por qué las parejas modernas en México están prefiriendo las invitaciones web frente al papel: ahorro, control de asistencia y cuidado ambiental.',
    date: '20 de mayo, 2026',
    readTime: '5 min de lectura',
    category: 'Bodas',
    author: {
      name: 'Sofía Martínez',
      role: 'Wedding Planner & Editora Invitto',
      avatar: 'SM'
    },
    seo: {
      title: '5 Ventajas de usar invitaciones digitales para tu boda — Invitto',
      description: 'Descubre por qué las invitaciones web de boda son la mejor opción en México: control de pases, mapas dinámicos, mesas de regalos y más.',
    },
    content: [
      {
        type: 'paragraph',
        content: 'Planear una boda en México es una de las aventuras más emocionantes pero también una de las más demandantes. Entre la elección de la locación, el banquete y el vestido, surge una pregunta crucial: ¿cómo invitaremos a nuestros seres queridos? Tradicionalmente, la papelería impresa era la única opción, pero hoy en día las invitaciones digitales han revolucionado el mercado de los eventos.'
      },
      {
        type: 'heading',
        content: '1. Ahorro económico sustancial'
      },
      {
        type: 'paragraph',
        content: 'El costo de imprimir 100 o 150 invitaciones físicas en papel texturizado, con hot stamping, listones y lacre, puede oscilar entre los $5,000 y $15,000 pesos mexicanos. Además, debes sumar el costo de envío o la gasolina para entregarlas en mano. Una invitación digital premium como la de Invitto cuesta una fracción de eso, permitiéndote destinar ese presupuesto a la luna de miel o la barra libre.'
      },
      {
        type: 'heading',
        content: '2. Confirmación de asistencia en tiempo real'
      },
      {
        type: 'paragraph',
        content: 'Con el papel impreso, el proceso de confirmación es lento e ineficiente: los novios deben llamar o enviar mensajes uno por uno. Una invitación digital inteligente incluye un sistema RSVP integrado que actualiza instantáneamente un panel de control con el número exacto de adultos y niños confirmados, intolerancias alimentarias y comentarios.'
      },
      {
        type: 'heading',
        content: '3. Evita colados con el control de pases'
      },
      {
        type: 'paragraph',
        content: 'Uno de los mayores dolores de cabeza de los novios es cuando un invitado confirma pases para toda su familia o amigos adicionales que no estaban contemplados en el presupuesto. Las invitaciones web personalizadas te permiten asignar un número exacto de pases por invitación (por ejemplo: "Familia Gómez - 2 pases"). El sistema no permitirá que confirmen de más.'
      },
      {
        type: 'heading',
        content: '4. Toda la información a un clic de distancia'
      },
      {
        type: 'paragraph',
        content: '¿Cuántas veces se ha perdido una invitación física de camino a la iglesia? Con una invitación digital, tus invitados llevan toda la información en el bolsillo:'
      },
      {
        type: 'list',
        items: [
          'Ubicaciones exactas integradas con Google Maps y Waze para que nadie se pierda.',
          'Enlaces directos a la mesa de regalos (Liverpool, Palacio de Hierro, Amazon).',
          'Sugerencias de hoteles y códigos de descuento para invitados foráneos.',
          'Cronograma detallado del evento con horarios precisos.'
        ]
      },
      {
        type: 'heading',
        content: '5. Cuidado del medio ambiente'
      },
      {
        type: 'paragraph',
        content: 'Hoy en día, la sustentabilidad es una prioridad. La gran mayoría de las invitaciones impresas terminan en el bote de basura pocos días después de que concluye la boda. Optar por un formato digital reduce el desperdicio de papel y la huella de carbono asociada con la distribución física.'
      }
    ]
  },
  {
    slug: 'confirmacion-invitados-xv-anos',
    title: 'Cómo organizar la confirmación de invitados de tus XV años sin morir en el intento',
    description: 'Consejos prácticos para coordinar a tus invitados de XV años, calcular pases por familia y evitar contratiempos el día del evento.',
    date: '18 de mayo, 2026',
    readTime: '6 min de lectura',
    category: 'XV Años',
    author: {
      name: 'Mariana Flores',
      role: 'Especialista en Eventos Juveniles',
      avatar: 'MF'
    },
    seo: {
      title: 'Confirmación de invitados en XV años: Guía Práctica — Invitto',
      description: 'Aprende a gestionar las confirmaciones de tus XV años de forma ágil. Consejos para manejar invitados jóvenes y adultos.',
    },
    content: [
      {
        type: 'paragraph',
        content: 'Organizar una fiesta de quince años implica coordinar dos perfiles de invitados muy distintos: los amigos de la quinceañera (jóvenes que suelen ser informales para confirmar) y los familiares adultos (tíos, padrinos y amigos de los padres). Lograr que todos confirmen su asistencia a tiempo puede parecer una tarea titánica.'
      },
      {
        type: 'heading',
        content: 'La importancia de las invitaciones personalizadas'
      },
      {
        type: 'paragraph',
        content: 'El error más común en los XV años es enviar una invitación grupal o general en PDF por grupos de WhatsApp o Facebook. Esto genera confusión sobre a quiénes realmente se está invitando y cuántos pases tienen asignados. La clave es enviar un enlace personalizado para cada grupo familiar o amigo.'
      },
      {
        type: 'heading',
        content: 'Pasos clave para la confirmación'
      },
      {
        type: 'list',
        items: [
          'Establece una fecha límite de confirmación: Lo ideal es fijarla 4 semanas antes de la fiesta.',
          'Define pases específicos para los amigos: Evita que los compañeros de escuela lleven acompañantes sorpresa asignando pases individuales en su invitación web.',
          'Usa recordatorios automatizados: A través de Invitto, puedes enviar un recordatorio rápido vía WhatsApp a los invitados rezagados con un solo clic.'
        ]
      },
      {
        type: 'heading',
        content: 'El día del evento: Check-in por Código QR'
      },
      {
        type: 'paragraph',
        content: 'Para evitar el desorden en la entrada del salón (donde a veces entran personas sin invitación), puedes optar por pases digitales con código QR. El personal del salón puede escanear el QR directamente desde su móvil al llegar el invitado, agilizando el registro y garantizando que se respete el número de mesas asignado.'
      }
    ]
  },
  {
    slug: 'protocolo-invitaciones-digitales-whatsapp',
    title: 'Protocolo y etiqueta para invitaciones digitales: ¿Es correcto enviarlas por WhatsApp?',
    description: 'Todo sobre el protocolo moderno para invitar digitalmente. Resuelve la duda: ¿Se ve informal enviar tu invitación por WhatsApp?',
    date: '15 de mayo, 2026',
    readTime: '4 min de lectura',
    category: 'Etiqueta',
    author: {
      name: 'Alejandro Sanz',
      role: 'Consultor de Etiqueta y Protocolo',
      avatar: 'AS'
    },
    seo: {
      title: '¿Es correcto enviar invitaciones de boda por WhatsApp? Etiqueta — Invitto',
      description: 'Reglas de etiqueta moderna para enviar invitaciones de boda y XV años digitales a través de WhatsApp de forma elegante.',
    },
    content: [
      {
        type: 'paragraph',
        content: 'Con la adopción de la tecnología, las reglas de etiqueta de los eventos sociales han evolucionado. En el pasado, enviar una invitación que no fuera impresa en papel de algodón era considerado informal o descortés. Hoy en día, las invitaciones digitales no solo son aceptadas, sino que se consideran modernas e inteligentes, siempre y cuando se respete el protocolo de envío.'
      },
      {
        type: 'heading',
        content: '¿Por qué WhatsApp es una excelente vía de entrega?'
      },
      {
        type: 'paragraph',
        content: 'WhatsApp es la aplicación de mensajería más utilizada en México y América Latina. Enviar tu invitación web por esta vía asegura que el destinatario la reciba de inmediato y la tenga a la mano el día del evento. No obstante, "etiqueta digital" significa evitar el envío masivo en cadena o el "spam".'
      },
      {
        type: 'heading',
        content: 'Reglas de oro para enviar tus invitaciones por WhatsApp'
      },
      {
        type: 'list',
        items: [
          'No uses grupos: Nunca envíes tu invitación en un grupo de amigos o familiares. Se pierde el carácter personal y especial de la invitación.',
          'Escribe un mensaje personalizado: Acompaña el enlace con un texto afectuoso escrito a mano para esa persona o familia específica (ej: "Queridos tíos, estamos felices de compartir nuestro gran día con ustedes...").',
          'Da seguimiento formal: Si el invitado no abre el enlace en unos días, un mensaje breve y cortés de seguimiento es bien recibido.'
        ]
      },
      {
        type: 'heading',
        content: '¿Y qué pasa con los invitados mayores?'
      },
      {
        type: 'paragraph',
        content: 'Una preocupación común es que los abuelos o tíos mayores no sepan usar el celular para abrir la invitación. En estos casos, la etiqueta dicta hacer una llamada telefónica para explicarles o entregarles un impreso sencillo de cortesía con el mismo estilo de la boda, ayudándoles a realizar la confirmación de viva voz.'
      }
    ]
  },
  {
    slug: 'guia-texto-invitacion-boda',
    title: 'Guía definitiva para redactar el texto de tu invitación de boda',
    description: 'Ideas de frases, estructura obligatoria y cómo redactar la mesa de regalos y el código de vestimenta de manera sutil y elegante.',
    date: '10 de mayo, 2026',
    readTime: '5 min de lectura',
    category: 'Redacción',
    author: {
      name: 'Sofía Martínez',
      role: 'Wedding Planner & Editora Invitto',
      avatar: 'SM'
    },
    seo: {
      title: 'Cómo redactar el texto de tu invitación de boda — Invitto',
      description: 'Ideas y ejemplos prácticos para redactar las secciones clave de tu invitación: horarios, código de vestir, mesa de regalos y pases.',
    },
    content: [
      {
        type: 'paragraph',
        content: 'La redacción de tu invitación de boda debe balancear dos elementos esenciales: el romanticismo de la fecha y la claridad de la información práctica. Tus invitados deben emocionarse al leerla, pero también saber con exactitud dónde presentarse y cómo vestir.'
      },
      {
        type: 'heading',
        content: 'Estructura recomendada para una invitación digital'
      },
      {
        type: 'paragraph',
        content: 'A diferencia de las invitaciones impresas tradicionales, donde todo el texto debe caber en una sola tarjeta, la invitación web te permite segmentar la información de manera limpia a través de secciones dedicadas:'
      },
      {
        type: 'list',
        items: [
          'Frase de apertura o bienvenida: Un poema corto, cita bíblica o pensamiento que los identifique como pareja.',
          'Nombres de los Novios y Padres: Tradicionalmente se listan los padres como anfitriones, aunque hoy en día es opcional.',
          'Detalles de la ceremonia y recepción: Fechas, nombres de los recintos y horarios de inicio claros.',
          'Código de vestimenta: Especificar si es Formal, Rigurosa Etiqueta, Guayabera o Cóctel.'
        ]
      },
      {
        type: 'heading',
        content: 'Cómo incluir la mesa de regalos con elegancia'
      },
      {
        type: 'paragraph',
        content: 'Mencionar los regalos o el dinero puede ser una conversación incómoda. En una invitación impresa, colocar la tarjeta de regalos se sentía a veces impositivo. En tu invitación digital, puedes habilitar una sección sutil llamada "Mesa de Regalos" o "Muestras de Cariño" con botones que enlacen a tus mesas registradas o con tus datos bancarios explicados de forma cálida.'
      }
    ]
  },
  {
    slug: 'invitaciones-digitales-vs-papel-ecologia',
    title: 'Invitaciones digitales vs. Invitaciones de papel: ¿Cuál es más ecológica y económica?',
    description: 'Un análisis comparativo detallado sobre el impacto ecológico y los costos reales de imprimir invitaciones físicas versus crear una web.',
    date: '05 de mayo, 2026',
    readTime: '6 min de lectura',
    category: 'Comparativa',
    author: {
      name: 'Alejandro Sanz',
      role: 'Consultor de Etiqueta y Sostenibilidad',
      avatar: 'AS'
    },
    seo: {
      title: 'Invitaciones Digitales vs Papel: Análisis de Costo y Ecología',
      description: 'Comparamos el impacto ecológico y el presupuesto requerido para invitaciones de papel vs. invitaciones digitales para eventos en México.',
    },
    content: [
      {
        type: 'paragraph',
        content: 'Al organizar una boda o XV años, cada decisión cuenta para el presupuesto y la huella ecológica del evento. Las invitaciones físicas han sido el estándar por siglos, pero las alternativas digitales ganan terreno rápidamente. Analicemos a fondo los dos aspectos más importantes: el bolsillo y el planeta.'
      },
      {
        type: 'heading',
        content: 'El Costo Financiero Real'
      },
      {
        type: 'paragraph',
        content: 'Cuando cotizas invitaciones de papel, la imprenta suele darte un precio base por unidad. Sin embargo, rara vez se contemplan los costos ocultos:'
      },
      {
        type: 'list',
        items: [
          'Impresión de boletos de recepción adicionales.',
          'Rotulación caligráfica a mano de los nombres.',
          'Costos de mensajería para enviarlas a familiares en otros estados.',
          'Pérdida de dinero por confirmaciones imprecisas que obligan a pagar platillos de banquete extra.'
        ]
      },
      {
        type: 'paragraph',
        content: 'Con las invitaciones web, el pago es único y cubre pases ilimitados, mapas dinámicos y todo el sistema de confirmaciones, eliminando la necesidad de imprimir pases de cartón o contratar mensajería.'
      },
      {
        type: 'heading',
        content: 'El Impacto Ecológico'
      },
      {
        type: 'paragraph',
        content: 'La industria del papel consume grandes cantidades de agua y energía, además del uso de tintas y solventes químicos no biodegradables para acabados como el dorado brillante o plastificados. Al ser entregadas, la mayoría de las invitaciones impresas acaban en el vertedero municipal tras el evento.'
      },
      {
        type: 'paragraph',
        content: 'Las invitaciones digitales eliminan por completo el uso de celulosa de madera, químicos de imprenta y emisiones de transporte de reparto. Su impacto ambiental se reduce al consumo energético de los servidores cloud, el cual es miles de veces menor que el proceso industrial papelero.'
      }
    ]
  }
];
