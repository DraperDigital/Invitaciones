import type { Event, Guest } from '../types/database.types';

export const MOCK_USER = {
    id: 'mock-user-id',
    email: 'demo@invitaciones.mx',
};

export const MOCK_EVENTS: Event[] = [
    {
        id: 'evt-cecilia-70',
        user_id: MOCK_USER.id,
        title: 'Cecilia Cardona Nieto',
        event_type: 'birthday',
        date_time: '2026-05-01T14:30:00Z',
        venue_name: 'Hacienda La Escondida',
        venue_address: 'Valle de Santiago, Guanajuato',
        maps_link: 'https://www.google.com/maps/place/Hacienda+La+Escondida,+Valle+de+Santiago/@20.4009104,-101.1763565,1066m/data=!3m2!1e3!4b1!4m6!3m5!1s0x842c8d9d3f3ac5d1:0xcc7ef7c37c9f1e90!8m2!3d20.4009054!4d-101.1737816!16s%2Fg%2F11dybbw__l?entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D',
        dress_code: 'Formal / Tonos Claros',
        rsvp_deadline: '2026-04-25T23:59:59Z',
        is_published: true,
        plan: 'clasico',
        theme_config: { theme: 'cecilia-70' },
        slug: 'cecilia-70',
        created_at: new Date().toISOString(),
    },
    {
        id: 'evt-1',
        user_id: MOCK_USER.id,
        title: 'Boda de Ana y Carlos',
        event_type: 'wedding',
        date_time: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 days from now
        venue_name: 'Hacienda San Gabriel',
        venue_address: 'Carr. Federal 57, Km 20, San Luis Potosí',
        maps_link: 'https://maps.google.com',
        dress_code: 'Etiqueta Rigurosa',
        rsvp_deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: { theme: 'gold' },
        slug: 'boda-ana-y-carlos',
        created_at: new Date().toISOString(),
    },
    {
        id: 'evt-2',
        user_id: MOCK_USER.id,
        title: 'Sofía',
        event_type: 'xv',
        date_time: new Date(Date.now() + 86400000 * 60).toISOString(),
        venue_name: 'Salón Crystal',
        venue_address: 'Av. Vallarta 1234, Guadalajara, Jalisco',
        maps_link: 'https://maps.google.com/?q=20.6736,-103.3918',
        dress_code: 'Formal / Gala',
        rsvp_deadline: new Date(Date.now() + 86400000 * 45).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            theme: 'botanical',
            colors: {
                primary: '#C9A962',
                secondary: '#E8D5B7',
                accent: '#B8956A'
            },
            message: 'Hoy celebro mis quince años rodeada del amor de quienes más quiero. Será un honor compartir este momento tan especial contigo.',
            ceremony: {
                name: 'Ceremonia Religiosa',
                location: 'Parroquia de Nuestra Señora de Guadalupe',
                address: 'Av. Américas 1551, Guadalajara',
                time: '18:00',
                mapsLink: 'https://maps.google.com/?q=20.6834,-103.3918'
            },
            reception: {
                name: 'Recepción',
                location: 'Salón Crystal',
                address: 'Av. Vallarta 1234, Guadalajara',
                time: '20:00',
                endTime: '03:00'
            },
            parents: {
                father: 'Sr. Roberto García',
                mother: 'Sra. María Fernández'
            },
            padrinos: [
                { role: 'Padrinos de Honor', names: 'Luis y Carmen Rodríguez' },
                { role: 'Padrinos de Vals', names: 'Jorge y Ana Martínez' }
            ],
            dresscode: {
                men: 'Traje formal / Smoking',
                women: 'Vestido largo / Cocktail'
            },
            schedule: [
                { time: '18:00', event: 'Ceremonia Religiosa' },
                { time: '19:30', event: 'Recepción y Cóctel' },
                { time: '20:30', event: 'Vals y Baile Sorpresa' },
                { time: '21:00', event: 'Cena' },
                { time: '22:00', event: 'Fiesta' }
            ],
            giftRegistry: {
                enabled: true,
                message: 'Tu presencia es nuestro mejor regalo, pero si deseas tener un detalle:',
                options: [
                    { type: 'Liverpool', url: 'https://mesaderegalos.liverpool.com.mx/eventodebusqueda/SearchEventRegistration' },
                    { type: 'Sobre', description: 'Lo recibiremos con mucho cariño' }
                ]
            },
            hashtag: '#SofiaXV2026'
        },
        slug: 'xv-sofia-2026',
        created_at: new Date().toISOString(),
    },
    // Sofia's XV - PRO Version
    {
        id: 'evt-14',
        user_id: MOCK_USER.id,
        title: 'Sofía',
        event_type: 'xv',
        date_time: new Date(Date.now() + 86400000 * 60).toISOString(),
        venue_name: 'Salón Crystal',
        venue_address: 'Av. Vallarta 1234, Guadalajara, Jalisco',
        maps_link: 'https://maps.google.com/?q=20.6736,-103.3918',
        dress_code: 'Formal / Gala',
        rsvp_deadline: new Date(Date.now() + 86400000 * 45).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPro: true,
            theme: 'botanical-premium',
            message: 'Hoy celebro mis quince años rodeada del amor de quienes más quiero. Este día marca el inicio de una nueva etapa llena de sueños y esperanzas.',
            personalMessage: {
                title: 'Un mensaje especial',
                content: 'Gracias por acompañarme en cada paso de mi vida. Hoy quiero que seas parte de este momento único.',
                signature: 'Con cariño, Sofía'
            },
            ceremony: {
                name: 'Ceremonia Religiosa',
                location: 'Parroquia de Nuestra Señora de Guadalupe',
                address: 'Av. Américas 1551, Guadalajara',
                time: '18:00',
                mapsLink: 'https://maps.google.com/?q=20.6834,-103.3918'
            },
            reception: {
                name: 'Recepción',
                location: 'Salón Crystal',
                address: 'Av. Vallarta 1234, Guadalajara',
                time: '20:00',
                endTime: '03:00'
            },
            parents: {
                father: 'Sr. Roberto García',
                mother: 'Sra. María Fernández',
                message: 'Con el corazón lleno de orgullo y amor, te invitamos a celebrar los XV años de nuestra princesa'
            },
            padrinos: [
                { role: 'Padrinos de Honor', names: 'Luis y Carmen Rodríguez' },
                { role: 'Padrinos de Vals', names: 'Jorge y Ana Martínez' },
                { role: 'Padrinos de Brindis', names: 'Eduardo y Patricia López' }
            ],
            chambelanes: ['Santiago Hernández (Chambelán de Honor)', 'Diego Ramírez', 'Andrés Morales', 'Carlos Sánchez'],
            damas: ['Isabella Torres (Dama de Honor)', 'Valentina Ruiz', 'Camila González', 'Daniela Castro'],
            dresscode: {
                men: 'Traje formal / Smoking',
                women: 'Vestido largo / Cocktail',
                note: 'Evitar color dorado y rosa pastel'
            },
            schedule: [
                { time: '18:00', event: 'Ceremonia Religiosa', location: 'Parroquia' },
                { time: '19:30', event: 'Recepción y Cóctel', location: 'Salón Crystal' },
                { time: '20:30', event: 'Vals con Papá y Chambelanes', location: 'Pista Principal' },
                { time: '21:00', event: 'Cena de Gala', location: 'Salón Principal' },
                { time: '22:00', event: 'Baile Sorpresa', location: 'Pista Principal' },
                { time: '22:30', event: 'Apertura de Pista', location: 'Pista Principal' },
                { time: '01:00', event: 'Corte de Pastel', location: 'Jardín' }
            ],
            giftRegistry: {
                enabled: true,
                message: 'Tu presencia es nuestro mejor regalo, pero si deseas tener un detalle:',
                options: [
                    { type: 'Liverpool', url: 'https://mesaderegalos.liverpool.com.mx', number: '51234567' },
                    { type: 'Amazon', url: 'https://amazon.com.mx/wedding/sofia-xv' },
                    { type: 'Sobre', description: 'Lo recibiremos con mucho cariño' }
                ]
            },
            photoGallery: {
                enabled: true,
                images: ['/images/sofia-1.jpg', '/images/sofia-2.jpg', '/images/sofia-3.jpg']
            },
            liveStream: {
                enabled: true,
                platform: 'YouTube',
                message: 'Si no puedes asistir, podrás ver la ceremonia en vivo'
            },
            hashtag: '#SofiaXV2026Pro',
            countdown: true,
            backgroundMusic: true
        },
        slug: 'xv-sofia-2026-pro',
        created_at: new Date().toISOString(),
    },
    // Sofia's XV - PREMIUM Version
    {
        id: 'evt-15',
        user_id: MOCK_USER.id,
        title: 'Sofía',
        event_type: 'xv',
        date_time: new Date(Date.now() + 86400000 * 60).toISOString(),
        venue_name: 'Salón Crystal',
        venue_address: 'Av. Vallarta 1234, Guadalajara, Jalisco',
        maps_link: 'https://maps.google.com/?q=20.6736,-103.3918',
        dress_code: 'Formal / Gala',
        rsvp_deadline: new Date(Date.now() + 86400000 * 45).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPremium: true,
            theme: 'botanical-luxury',
            customDomain: 'sofia15.com',
            photoGallery: { enabled: true, uploadEnabled: true },
            liveStream: { enabled: true, platform: 'YouTube', multiCamera: true },
            hashtag: '#SofiaXV2026Premium',
            countdown: true,
            backgroundMusic: true,
            rsvpAdvanced: { dietaryRestrictions: true, songRequests: true }
        },
        slug: 'xv-sofia-2026-premium',
        created_at: new Date().toISOString(),
    },
    {
        id: 'evt-3',
        user_id: MOCK_USER.id,
        title: 'Cumpleaños de Miguel',
        event_type: 'birthday',
        date_time: new Date(Date.now() + 86400000 * 20).toISOString(),
        venue_name: 'Terraza Garden',
        venue_address: 'Av. Revolución 456, CDMX',
        maps_link: 'https://maps.google.com',
        dress_code: 'Casual Elegante',
        rsvp_deadline: new Date(Date.now() + 86400000 * 10).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: { theme: 'modern' },
        slug: 'cumple-miguel-40',
        created_at: new Date().toISOString(),
    },
    // More Bodas
    {
        id: 'evt-4',
        user_id: MOCK_USER.id,
        title: 'Boda de Gabriela y Arturo',
        event_type: 'wedding',
        date_time: new Date(Date.now() + 86400000 * 45).toISOString(),
        venue_name: 'Jardín Las Palomas',
        venue_address: 'Camino Real 789, Querétaro',
        maps_link: 'https://maps.google.com/?q=20.5888,-100.3899',
        dress_code: 'Formal',
        rsvp_deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: { theme: 'romantic' },
        slug: 'boda-gabriela-arturo',
        created_at: new Date().toISOString(),
    },
    // GABRIELA Y ARTURO - PREMIUM
    {
        id: 'evt-collage-premium',
        user_id: MOCK_USER.id,
        title: 'Carlo & Sofia',
        event_type: 'wedding',
        date_time: new Date(Date.now() + 86400000 * 45).toISOString(),
        venue_name: 'Driftwood Road',
        venue_address: '259 Driftwood Road, SF',
        maps_link: 'https://maps.google.com/?q=37.7749,-122.4194',
        dress_code: 'Green and Cream',
        rsvp_deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
        is_published: true,
        plan: 'premium',
        theme_config: {
            isPremium: true,
            theme: 'collage',
            heroBgColor: '#F8F5F0',
            primary_color: '#767A6B',
            accent_color: '#8B907D',
            hero_text_color: '#767A6B',
            welcome_message: 'Estás invitado a celebrar el gran día de',
            subtitle: 'Y así comienza la aventura',
            misa_time: '16:00',
            schedule: [
                { time: '16:00', event: 'Ceremonia', location: '1174 Lynch St., SF' },
                { time: '17:00', event: 'Hora del cóctel', location: 'Driftwood Road' },
                { time: '19:00', event: 'Cena y discursos', location: 'Salón Principal' },
                { time: '20:30', event: 'Bebidas y baile', location: 'Pista de baile' }
            ],
            gallery_images: [
                { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', caption: '1' },
                { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', caption: '2' },
                { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', caption: '3' },
                { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80', caption: '4' },
                { url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80', caption: '5' }
            ],
            photoGallery: {
                enabled: true,
                images: [
                    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
                ]
            },
            countdown: true,
            message: '¡Por favor, ven con tu mejor atuendo verde o crema y disfruta la celebración con nosotros!'
        },
        slug: 'boda-collage-premium',
        created_at: new Date().toISOString(),
    },
    // HELENA & AUSTIN - FLORAL SYMMETRY
    {
        id: 'evt-floral-symmetry',
        user_id: MOCK_USER.id,
        title: 'Helena & Austin',
        event_type: 'wedding',
        date_time: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString(),
        status: 'published',
        is_published: true,
        plan: 'premium',
        theme_config: {
            theme: 'floral-symmetry',
            heroBgColor: '#FAF9F2',
            primary_color: '#456A5B',
            accent_color: '#F47C62',
            save_the_date_text: 'Reserva la fecha',
            subtitle: 'comienzan su gran aventura juntos',
            banner_subtitle: 'Junto con nuestras familias',
            banner_title: 'Te invitamos a nuestra boda',
            story_title: 'Nos encantaría que nos acompañes',
            story_subtitle: 'En nuestro día tan especial',
            welcome_message: 'Como ocupas un lugar muy especial en nuestros corazones, tu presencia significaría el mundo para nosotros. Únete a nosotros para compartir nuestra historia de amor, vivir momentos inolvidables y crear recuerdos que atesoraremos por siempre.',
            schedule: [
                { time: '16:00', event: 'Ceremonia', location: 'Parroquia San Antonio\nAv. Principal 123' },
                { time: '17:30', event: 'Recepción', location: 'Jardín Las Rosas\nBlvd. Las Palmas 456' },
            ],
            gallery_images: [
                { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80', caption: '1' },
            ],
            countdown: true,
            message: ''
        },
        slug: 'boda-simetria-floral',
        created_at: new Date().toISOString(),
    },
    // GABRIELA Y ARTURO - PRO
    {
        id: 'evt-4-pro',
        user_id: MOCK_USER.id,
        title: 'Gabriela & Arturo',
        event_type: 'wedding',
        date_time: new Date(Date.now() + 86400000 * 45).toISOString(),
        venue_name: 'Jardín Las Palomas',
        venue_address: 'Camino Real 789, Querétaro',
        maps_link: 'https://maps.google.com/?q=20.5888,-100.3899',
        dress_code: 'Formal / Cocktail',
        rsvp_deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPro: true,
            theme: 'romantic-pro',
            schedule: [
                { time: '16:30', event: 'Ceremonia Civil', location: 'Jardín Las Palomas' },
                { time: '17:30', event: 'Ceremonia Religiosa', location: 'Capilla del Jardín' },
                { time: '19:00', event: 'Cóctel y Foto Booth', location: 'Terraza Principal' },
                { time: '20:00', event: 'Recepción y Cena', location: 'Salón de Cristal' },
                { time: '22:00', event: 'Fiesta', location: 'Pista de Baile' }
            ],
            parents: {
                bride: { father: 'Ing. Ricardo Torres', mother: 'Dra. Patricia López' },
                groom: { father: 'Lic. Arturo Mendoza Sr.', mother: 'Arq. Sofía Ramírez' }
            },
            message: 'Después de tantos años juntos, finalmente llegó el día de hacer oficial nuestro amor ante Dios y nuestras familias.'
        },
        slug: 'boda-gabriela-arturo-pro',
        created_at: new Date().toISOString(),
    },
    // GABRIELA Y ARTURO - PREMIUM
    {
        id: 'evt-4-premium',
        user_id: MOCK_USER.id,
        title: 'Gabriela & Arturo',
        event_type: 'wedding',
        date_time: new Date(Date.now() + 86400000 * 45).toISOString(),
        venue_name: 'Jardín Las Palomas',
        venue_address: 'Camino Real 789, Querétaro',
        maps_link: 'https://maps.google.com/?q=20.5888,-100.3899',
        dress_code: 'Formal / Cocktail',
        rsvp_deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPremium: true,
            theme: 'modern-minimalist', hero_image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
            schedule: [
                { time: '16:30', event: 'Ceremonia Civil', location: 'Jardín Las Palomas' },
                { time: '17:30', event: 'Ceremonia Religiosa', location: 'Capilla del Jardín' },
                { time: '19:00', event: 'Cóctel y Foto Booth', location: 'Terraza Principal' },
                { time: '20:00', event: 'Recepción y Cena', location: 'Salón de Cristal' },
                { time: '21:30', event: 'Primer Baile', location: 'Pista de Baile' },
                { time: '22:00', event: 'Fiesta', location: 'Pista de Baile' },
                { time: '00:30', event: 'Corte de Pastel', location: 'Jardín Central' }
            ],
            parents: {
                bride: { father: 'Ing. Ricardo Torres', mother: 'Dra. Patricia López' },
                groom: { father: 'Lic. Arturo Mendoza Sr.', mother: 'Arq. Sofía Ramírez' }
            },
            padrinos: [
                { role: 'Madrina de Anillos', names: 'Valeria López' },
                { role: 'Padrino de Lazo', names: 'Carlos Mendoza' },
                { role: 'Padrinos de Velación', names: 'Roberto y Elena Gómez' }
            ],
            photoGallery: {
                enabled: true,
                uploadEnabled: true,
                images: [
                    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80'
                ]
            },
            liveStream: {
                enabled: true,
                platform: 'Facebook',
                message: 'Transmisión en vivo de nuestra boda',
                multiCamera: true
            },
            hashtag: '#GabyYArturo2026',
            countdown: true,
            message: 'Después de tantos años juntos, finalmente llegó el día de hacer oficial nuestro amor ante Dios y nuestras familias.',
            giftRegistry: {
                enabled: true,
                message: 'El mejor regalo es su presencia, pero si desean obsequiarnos algo:',
                options: [
                    { type: 'Amazon', url: 'https://amazon.com.mx/wedding/gabriela-arturo' },
                    { type: 'Pallacio de Hierro', url: 'https://elpalaciodehierro.com' },
                    { type: 'Transferencia', account: 'BBVA 1234567890' }
                ]
            }
        },
        slug: 'boda-gabriela-arturo-premium',
        created_at: new Date().toISOString(),
    },
    {
        id: 'evt-5',
        user_id: MOCK_USER.id,
        title: 'Boda de Isabel y Rodrigo',
        event_type: 'wedding',
        date_time: new Date(Date.now() + 86400000 * 75).toISOString(),
        venue_name: 'Viñedos del Valle',
        venue_address: 'Carretera a Tequisquiapan, Querétaro',
        maps_link: 'https://maps.google.com/?q=20.5213,-99.8904',
        dress_code: 'Garden Party',
        rsvp_deadline: new Date(Date.now() + 86400000 * 60).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: { theme: 'vintage' },
        slug: 'boda-isabel-rodrigo',
        created_at: new Date().toISOString(),
    },
    // ISABEL Y RODRIGO - PRO
    {
        id: 'evt-5-pro',
        user_id: MOCK_USER.id,
        title: 'Isabel & Rodrigo',
        event_type: 'wedding',
        date_time: new Date(Date.now() + 86400000 * 75).toISOString(),
        venue_name: 'Viñedos del Valle',
        venue_address: 'Carretera a Tequisquiapan, Querétaro',
        maps_link: 'https://maps.google.com/?q=20.5213,-99.8904',
        dress_code: 'Garden Party / Semi-formal',
        rsvp_deadline: new Date(Date.now() + 86400000 * 60).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPro: true,
            theme: 'vintage-pro',
            schedule: [
                { time: '17:00', event: 'Bienvenida en Viñedo', location: 'Entrada Principal' },
                { time: '17:30', event: 'Ceremonia Simbólica', location: 'Entre las Vides' },
                { time: '18:30', event: 'Cata de Vinos', location: 'Cava Principal' },
                { time: '19:30', event: 'Recepción al Atardecer', location: 'Terraza Vista al Valle' },
                { time: '20:30', event: 'Cena Maridaje', location: 'Salón Vintage' },
                { time: '22:30', event: 'Baile bajo las Estrellas', location: 'Jardín Colonial' }
            ],
            parents: {
                bride: { father: 'Dr. Fernando Ruiz', mother: 'Lic. Laura Martínez' },
                groom: { father: 'Mtro. Rodrigo Sánchez Sr.', mother: 'Chef Ana María Torres' }
            },
            padrinos: [
                { role: 'Madrina de Anillos', names: 'Valeria López' },
                { role: 'Padrino de Lazo', names: 'Carlos Mendoza' },
                { role: 'Padrinos de Velación', names: 'Roberto y Elena Gómez' }
            ],
            message: 'Entre viñedos y bajo el cielo abierto, queremos compartir el inicio de nuestra historia como esposos.',
            photoGallery: {
                enabled: true,
                images: [
                    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80'
                ]
            }
        },
        slug: 'boda-isabel-rodrigo-pro',
        created_at: new Date().toISOString(),
    },
    // ISABEL Y RODRIGO - PREMIUM
    {
        id: 'evt-5-premium',
        user_id: MOCK_USER.id,
        title: 'Isabel & Rodrigo',
        event_type: 'wedding',
        date_time: new Date(Date.now() + 86400000 * 75).toISOString(),
        venue_name: 'Viñedos del Valle',
        venue_address: 'Carretera a Tequisquiapan, Querétaro',
        maps_link: 'https://maps.google.com/?q=20.5213,-99.8904',
        dress_code: 'Garden Party / Semi-formal',
        rsvp_deadline: new Date(Date.now() + 86400000 * 60).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPremium: true,
            theme: 'classic-elegance', hero_image_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1600&q=80',
            ceremony: {
                name: 'Ceremonia Simbólica',
                location: 'Entre las Vides',
                address: 'Viñedos del Valle',
                time: '17:30'
            },
            reception: {
                name: 'Recepción',
                location: 'Terraza Vista al Valle',
                time: '19:30'
            },
            schedule: [
                { time: '17:00', event: 'Bienvenida en Viñedo', location: 'Entrada Principal' },
                { time: '17:30', event: 'Ceremonia Simbólica', location: 'Entre las Vides' },
                { time: '18:30', event: 'Cata de Vinos', location: 'Cava Principal' },
                { time: '19:30', event: 'Recepción al Atardecer', location: 'Terraza Vista al Valle' },
                { time: '20:30', event: 'Cena Maridaje', location: 'Salón Vintage' },
                { time: '21:30', event: 'Brindis Especial', location: 'Terraza' },
                { time: '22:00', event: 'Primer Vals', location: 'Jardín Colonial' },
                { time: '22:30', event: 'Baile bajo las Estrellas', location: 'Jardín Colonial' },
                { time: '00:00', event: 'Barra de Postres', location: 'Cava' }
            ],
            parents: {
                bride: { father: 'Dr. Fernando Ruiz', mother: 'Lic. Laura Martínez' },
                groom: { father: 'Mtro. Rodrigo Sánchez Sr.', mother: 'Chef Ana María Torres' }
            },
            padrinos: [
                { role: 'Madrina de Anillos', names: 'Valeria López' },
                { role: 'Padrino de Lazo', names: 'Carlos Mendoza' },
                { role: 'Padrinos de Velación', names: 'Roberto y Elena Gómez' }
            ],
            photoGallery: {
                enabled: true,
                uploadEnabled: true,
                images: [
                    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80'
                ]
            },
            liveStream: {
                enabled: true,
                platform: 'Instagram',
                message: 'Vive nuestra boda en directo desde el viñedo',
                multiCamera: true
            },
            hashtag: '#IsaYRodrigoEnLasVides',
            countdown: true,
            message: 'Entre viñedos y bajo el cielo abierto, queremos compartir el inicio de nuestra historia como esposos.',
            dresscode: {
                men: 'Traje claro / Lino',
                women: 'Vestido floral / Garden party'
            },
            giftRegistry: {
                enabled: true,
                message: 'Estamos armando nuestro hogar juntos:',
                options: [
                    { type: 'Crate & Barrel', url: 'https://crateandbarrel.com' },
                    { type: 'Liverpool', url: 'https://liverpool.com.mx' },
                    { type: 'Luna de Miel', description: 'Ayúdanos a crear recuerdos inolvidables' }
                ]
            },
            accommodations: {
                enabled: true,
                hotels: [
                    { name: 'Hotel Viñedos', discount: '15% de descuento con código: ISAYRODRIGO' }
                ]
            }
        },
        slug: 'boda-isabel-rodrigo-premium',
        created_at: new Date().toISOString(),
    },
    // More XV Años
    {
        id: 'evt-6',
        user_id: MOCK_USER.id,
        title: 'XV Años de Julia',
        event_type: 'xv',
        date_time: new Date(Date.now() + 86400000 * 50).toISOString(),
        venue_name: 'Salón Versalles',
        venue_address: 'Av. Chapultepec 456, CDMX',
        maps_link: 'https://maps.google.com',
        dress_code: 'Gala',
        rsvp_deadline: new Date(Date.now() + 86400000 * 35).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: { theme: 'dreams' },
        slug: 'xv-julia-2026',
        created_at: new Date().toISOString(),
    },
    // JULIA XV - PRO
    {
        id: 'evt-6-pro',
        user_id: MOCK_USER.id,
        title: 'Julia',
        event_type: 'xv',
        date_time: new Date(Date.now() + 86400000 * 50).toISOString(),
        venue_name: 'Salón Versalles',
        venue_address: 'Av. Chapultepec 456, CDMX',
        maps_link: 'https://maps.google.com/?q=19.4326,-99.1332',
        dress_code: 'Gala / Formal',
        rsvp_deadline: new Date(Date.now() + 86400000 * 35).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPro: true,
            theme: 'dreams-pro',
            message: 'Hoy celebro mis XV años y quiero compartir este momento tan especial rodeada de las personas que más amo.',
            schedule: [
                { time: '18:00', event: 'Misa de Acción de Gracias', location: 'Catedral Metropolitana' },
                { time: '19:30', event: 'Recepción', location: 'Salón Versalles' },
                { time: '20:00', event: 'Vals con mi Padre', location: 'Salón Principal' },
                { time: '20:30', event: 'Vals Sorpresa', location: 'Salón Principal' },
                { time: '21:00', event: 'Cena', location: 'Salón Principal' },
                { time: '22:00', event: 'Fiesta', location: 'Pista de Baile' }
            ],
            chambelanes: [
                'Diego Martínez',
                'Sebastián López',
                'Emiliano García',
                'Mateo Hernández'
            ],
            damas: [
                'Valentina Ruiz',
                'Isabella Torres',
                'Camila Sánchez',
                'María José Castro'
            ],
            parents: {
                father: 'Ing. Carlos Mendoza',
                mother: 'Lic. Laura Jiménez'
            },
            padrinos: [
                { role: 'Padrinos de Honor', names: 'Tíos Miguel y Adriana' },
                { role: 'Padrinos de Vals', names: 'Abuelos José y Rosa' }
            ]
        },
        slug: 'xv-julia-2026-pro',
        created_at: new Date().toISOString(),
    },
    // JULIA XV - PREMIUM
    {
        id: 'evt-6-premium',
        user_id: MOCK_USER.id,
        title: 'Julia',
        event_type: 'xv',
        date_time: new Date(Date.now() + 86400000 * 50).toISOString(),
        venue_name: 'Salón Versalles',
        venue_address: 'Av. Chapultepec 456, CDMX',
        maps_link: 'https://maps.google.com/?q=19.4326,-99.1332',
        dress_code: 'Gala / Formal',
        rsvp_deadline: new Date(Date.now() + 86400000 * 35).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPremium: true,
            theme: 'dreams-luxury',
            message: 'Hoy celebro mis XV años y quiero compartir este momento tan especial rodeada de las personas que más amo.',
            ceremony: {
                name: 'Misa de Acción de Gracias',
                location: 'Catedral Metropolitana',
                address: 'Centro Histórico, CDMX',
                time: '18:00'
            },
            reception: {
                name: 'Recepción',
                location: 'Salón Versalles',
                address: 'Av. Chapultepec 456',
                time: '19:30'
            },
            schedule: [
                { time: '18:00', event: 'Misa de Acción de Gracias', location: 'Catedral Metropolitana' },
                { time: '19:30', event: 'Recepción', location: 'Salón Versalles' },
                { time: '20:00', event: 'Vals con mi Padre', location: 'Salón Principal' },
                { time: '20:15', event: 'Vals con Chambelanes', location: 'Salón Principal' },
                { time: '20:30', event: 'Vals Sorpresa', location: 'Salón Principal' },
                { time: '21:00', event: 'Cena', location: 'Salón Principal' },
                { time: '22:00', event: 'Brindis', location: 'Terraza' },
                { time: '22:30', event: 'Fiesta', location: 'Pista de Baile' },
                { time: '00:00', event: 'Hora Loca', location: 'Pista de Baile' }
            ],
            chambelanes: [
                'Diego Martínez',
                'Sebastián López',
                'Emiliano García',
                'Mateo Hernández'
            ],
            damas: [
                'Valentina Ruiz',
                'Isabella Torres',
                'Camila Sánchez',
                'María José Castro'
            ],
            parents: {
                father: 'Ing. Carlos Mendoza',
                mother: 'Lic. Laura Jiménez'
            },
            padrinos: [
                { role: 'Padrinos de Honor', names: 'Tíos Miguel y Adriana' },
                { role: 'Padrinos de Vals', names: 'Abuelos José y Rosa' },
                { role: 'Padrinos de Corona', names: 'Padrinos Roberto y Ana' }
            ],
            photoGallery: { enabled: true, uploadEnabled: true },
            liveStream: {
                enabled: true,
                platform: 'YouTube',
                message: 'No te pierdas ni un momento de mi fiesta',
                multiCamera: true
            },
            hashtag: '#JuliaXV2026',
            countdown: true,
            dresscode: {
                men: 'Traje formal / Smoking',
                women: 'Vestido largo / Cocktail'
            },
            giftRegistry: {
                enabled: true,
                message: 'Tu presencia es mi mejor regalo, pero si deseas obsequiarme algo:',
                options: [
                    { type: 'Liverpool', url: 'https://liverpool.com.mx/mesaderegalos' },
                    { type: 'Amazon', url: 'https://amazon.com.mx' },
                    { type: 'Sobre', description: 'Efectivo para mis sueños' }
                ]
            }
        },
        slug: 'xv-julia-2026-premium',
        created_at: new Date().toISOString(),
    },
    {
        id: 'evt-7',
        user_id: MOCK_USER.id,
        title: 'XV Años de Regina',
        event_type: 'xv',
        date_time: new Date(Date.now() + 86400000 * 90).toISOString(),
        venue_name: 'Casa Real',
        venue_address: 'Paseo de la Reforma 123, CDMX',
        maps_link: 'https://maps.google.com',
        dress_code: 'Formal',
        rsvp_deadline: new Date(Date.now() + 86400000 * 75).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: { theme: 'elegant' },
        slug: 'xv-regina-2026',
        created_at: new Date().toISOString(),
    },
    // REGINA XV - PRO
    {
        id: 'evt-7-pro',
        user_id: MOCK_USER.id,
        title: 'Regina',
        event_type: 'xv',
        date_time: new Date(Date.now() + 86400000 * 90).toISOString(),
        venue_name: 'Casa Real',
        venue_address: 'Paseo de la Reforma 123, CDMX',
        maps_link: 'https://maps.google.com/?q=19.4326,-99.1677',
        dress_code: 'Cocktail / Elegante',
        rsvp_deadline: new Date(Date.now() + 86400000 * 75).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPro: true,
            theme: 'princess-pro',
            message: 'Con la ilusión de una princesa que cumple un sueño, te invito a celebrar conmigo el día que tanto he esperado.',
            schedule: [
                { time: '17:00', event: 'Ceremonia Religiosa', location: 'Capilla del Rosario' },
                { time: '18:30', event: 'Sesión de Fotos', location: 'Jardín de Casa Real' },
                { time: '19:00', event: 'Recepción', location: 'Salón Imperial' },
                { time: '19:30', event: 'Vals Tradicional', location: 'Salón Imperial' },
                { time: '20:00', event: 'Cena de Gala', location: 'Salón Imperial' },
                { time: '21:30', event: 'Apertura de Pista', location: 'Salón de Baile' },
                { time: '22:00', event: 'Fiesta', location: 'Salón de Baile' }
            ],
            chambelanes: [
                'Alejandro Ruiz',
                'Gabriel Morales',
                'Daniel Castro',
                'Luis Fernando Díaz',
                'Pablo Herrera'
            ],
            damas: [
                'Sofía Jiménez',
                'Andrea Vega',
                'Daniela Luna',
                'Carolina Méndez',
                'Fernanda Solís'
            ],
            parents: {
                father: 'Arq. Fernando Pérez',
                mother: 'Dra. Claudia Soto'
            },
            padrinos: [
                { role: 'Padrinos de Velación', names: 'Abuelos Fernando y María' },
                { role: 'Padrinos de Anillo', names: 'Tíos Ricardo y Lucía' }
            ]
        },
        slug: 'xv-regina-2026-pro',
        created_at: new Date().toISOString(),
    },
    // REGINA XV - PREMIUM
    {
        id: 'evt-7-premium',
        user_id: MOCK_USER.id,
        title: 'Regina',
        event_type: 'xv',
        date_time: new Date(Date.now() + 86400000 * 90).toISOString(),
        venue_name: 'Casa Real',
        venue_address: 'Paseo de la Reforma 123, CDMX',
        maps_link: 'https://maps.google.com/?q=19.4326,-99.1677',
        dress_code: 'Cocktail / Elegante',
        rsvp_deadline: new Date(Date.now() + 86400000 * 75).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPremium: true,
            theme: 'romantic-botanical', hero_image_url: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=1600&q=80',
            message: 'Con la ilusión de una princesa que cumple un sueño, te invito a celebrar conmigo el día que tanto he esperado.',
            ceremony: {
                name: 'Ceremonia Religiosa',
                location: 'Capilla del Rosario',
                address: 'Polanco, CDMX',
                time: '17:00'
            },
            reception: {
                name: 'Recepción',
                location: 'Salón Imperial - Casa Real',
                address: 'Paseo de la Reforma 123',
                time: '19:00'
            },
            schedule: [
                { time: '17:00', event: 'Ceremonia Religiosa', location: 'Capilla del Rosario' },
                { time: '18:00', event: 'Cambio de Look', location: 'Suite Princesa' },
                { time: '18:30', event: 'Sesión de Fotos', location: 'Jardín de Casa Real' },
                { time: '19:00', event: 'Recepción', location: 'Salón Imperial' },
                { time: '19:30', event: 'Vals Tradicional', location: 'Salón Imperial' },
                { time: '19:50', event: 'Vals Moderno', location: 'Salón Imperial' },
                { time: '20:00', event: 'Cena de Gala', location: 'Salón Imperial' },
                { time: '21:00', event: 'Show Especial', location: 'Escenario Principal' },
                { time: '21:30', event: 'Apertura de Pista', location: 'Salón de Baile' },
                { time: '22:00', event: 'Fiesta', location: 'Salón de Baile' },
                { time: '23:30', event: 'Hora Loca', location: 'Salón de Baile' }
            ],
            chambelanes: [
                'Alejandro Ruiz',
                'Gabriel Morales',
                'Daniel Castro',
                'Luis Fernando Díaz',
                'Pablo Herrera'
            ],
            damas: [
                'Sofía Jiménez',
                'Andrea Vega',
                'Daniela Luna',
                'Carolina Méndez',
                'Fernanda Solís'
            ],
            parents: {
                father: 'Arq. Fernando Pérez',
                mother: 'Dra. Claudia Soto'
            },
            padrinos: [
                { role: 'Padrinos de Velación', names: 'Abuelos Fernando y María' },
                { role: 'Padrinos de Anillo', names: 'Tíos Ricardo y Lucía' },
                { role: 'Padrinos de Tiara', names: 'Madrinas Andrea y Beatriz' },
                { role: 'Padrinos de Brindis', names: 'Padrinos Jorge y Elena' }
            ],
            photoGallery: {
                enabled: true,
                uploadEnabled: true,
                images: [
                    'https://images.unsplash.com/photo-1518049362265-e5b450092420?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1530103043960-ef38714abb15?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1522413452208-99613f8e7150?auto=format&fit=crop&w=800&q=80'
                ]
            },
            liveStream: {
                enabled: true,
                platform: 'Facebook',
                message: 'Vive mi gran celebración en vivo',
                multiCamera: true
            },
            hashtag: '#ReginaXVPrincess',
            countdown: true,
            dresscode: {
                men: 'Traje oscuro / Smoking opcional',
                women: 'Vestido largo / Cocktail elegante'
            },
            giftRegistry: {
                enabled: true,
                message: 'Si quieres hacerme un regalo:',
                options: [
                    { type: 'Liverpool', url: 'https://liverpool.com.mx' },
                    { type: 'Palacio de Hierro', url: 'https://elpalaciodehierro.com' },
                    { type: 'Amazon', url: 'https://amazon.com.mx' },
                    { type: 'Efectivo', description: 'Para hacer realidad mis sueños' }
                ]
            },
            specialFeatures: {
                photoBoothEnabled: true,
                candyBarEnabled: true,
                showIncluded: true
            }
        },
        slug: 'xv-regina-2026-premium',
        created_at: new Date().toISOString(),
    },
    // More Cumpleaños
    {
        id: 'evt-8',
        user_id: MOCK_USER.id,
        title: 'Cumpleaños de Emilia',
        event_type: 'birthday',
        date_time: new Date(Date.now() + 86400000 * 15).toISOString(),
        venue_name: 'Salón Fiesta',
        venue_address: 'Av. Universidad 789, Monterrey',
        maps_link: 'https://maps.google.com',
        dress_code: 'Casual',
        rsvp_deadline: new Date(Date.now() + 86400000 * 10).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: { theme: 'fun' },
        slug: 'cumple-emilia',
        created_at: new Date().toISOString(),
    },
    // EMILIA CUMPLEAÑOS - PRO
    {
        id: 'evt-8-pro',
        user_id: MOCK_USER.id,
        title: 'Cumpleaños de Emilia - 10 Añitos',
        event_type: 'birthday',
        date_time: new Date(Date.now() + 86400000 * 25).toISOString(),
        venue_name: 'Club Campestre',
        venue_address: 'Av. Country Club 100, Monterrey',
        maps_link: 'https://maps.google.com/?q=25.6514,-100.2890',
        dress_code: 'Casual / Cómodo',
        rsvp_deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPro: true,
            theme: 'unicorn-pro',
            message: '¡Celebra conmigo mi primera década de vida! Será una fiesta mágica llena de diversión.',
            schedule: [
                { time: '15:00', event: 'Llegada de Invitados', location: 'Jardín Principal' },
                { time: '15:30', event: 'Juegos y Actividades', location: 'Área de Juegos' },
                { time: '16:30', event: 'Piñata', location: 'Jardín' },
                { time: '17:00', event: 'Pastel y Cumpleaños Feliz', location: 'Terraza' },
                { time: '17:30', event: 'Merienda', location: 'Salón' },
                { time: '18:00', event: 'Baile y Show', location: 'Pista' }
            ]
        },
        slug: 'cumple-emilia-pro',
        created_at: new Date().toISOString(),
    },
    // EMILIA CUMPLEAÑOS - PREMIUM
    {
        id: 'evt-8-premium',
        user_id: MOCK_USER.id,
        title: 'Emilia - 10 Años',
        event_type: 'birthday',
        date_time: new Date(Date.now() + 86400000 * 25).toISOString(),
        venue_name: 'Club Campestre',
        venue_address: 'Av. Country Club 100, Monterrey',
        maps_link: 'https://maps.google.com/?q=25.6514,-100.2890',
        dress_code: 'Casual / Cómodo (traer ropa de cambio)',
        rsvp_deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPremium: true,
            theme: 'neon-glow', hero_image_url: 'https://images.unsplash.com/photo-1530103862676-de8892bf30b5?auto=format&fit=crop&w=1600&q=80',
            message: '¡Celebra conmigo mi primera década de vida! Será una fiesta mágica llena de diversión y magia.',
            schedule: [
                { time: '15:00', event: 'Llegada de Invitados', location: 'Jardín Principal' },
                { time: '15:15', event: 'Bienvenida Mágica', location: 'Entrada' },
                { time: '15:30', event: 'Juegos Inflables', location: 'Área de Juegos' },
                { time: '16:00', event: 'Show de Magia', location: 'Escenario' },
                { time: '16:30', event: 'Piñata Tradicional', location: 'Jardín' },
                { time: '17:00', event: 'Pastel y Cumpleaños Feliz', location: 'Terraza' },
                { time: '17:30', event: 'Merienda con Barra de Dulces', location: 'Salón' },
                { time: '18:00', event: 'Baile y Show Musical', location: 'Pista' },
                { time: '18:30', event: 'Sorpresa Final', location: 'Jardín' }
            ],
            photoGallery: { 
                enabled: true, 
                uploadEnabled: true,
                images: [
                    'https://images.unsplash.com/photo-1530103862676-de8892bf30b5?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1513271239644-245c61eb6e60?auto=format&fit=crop&w=800&q=80'
                ]
            },
            liveStream: {
                enabled: true,
                platform: 'Facebook',
                message: 'Comparte la alegría en vivo',
                multiCamera: false
            },
            hashtag: '#Emilia10Años',
            countdown: true,
            specialFeatures: {
                magicShowIncluded: true,
                candyBarEnabled: true,
                inflatableGames: true
            }
        },
        slug: 'cumple-emilia-premium',
        created_at: new Date().toISOString(),
    },
    // Bautizos
    {
        id: 'evt-9',
        user_id: MOCK_USER.id,
        title: 'Bautizo de Victoria',
        event_type: 'bautizo',
        date_time: new Date(Date.now() + 86400000 * 25).toISOString(),
        venue_name: 'Parroquia Santa María',
        venue_address: 'Calle Principal 12, Puebla',
        maps_link: 'https://maps.google.com',
        dress_code: 'Smart Casual',
        rsvp_deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            theme: 'angel',
            hero_image_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=80',
            message: 'Acompáñanos a celebrar el bautizo de nuestra pequeña Victoria. Será un día lleno de bendiciones.',
            photoGallery: {
                enabled: true,
                images: [
                    'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1602052793312-b99c2a9ee797?auto=format&fit=crop&w=800&q=80'
                ]
            },
            parents: { father: 'Luis Sánchez', mother: 'Ana Fernanda Gómez' },
            padrinos: [{ role: 'Padrinos', names: 'Carlos y Valeria' }]
        },
        slug: 'bautizo-victoria',
        created_at: new Date().toISOString(),
    },
    // VICTORIA BAUTIZO - PRO
    {
        id: 'evt-9-pro',
        user_id: MOCK_USER.id,
        title: 'Bautizo de Victoria',
        event_type: 'bautizo',
        date_time: new Date(Date.now() + 86400000 * 25).toISOString(),
        venue_name: 'Parroquia Santa María',
        venue_address: 'Calle Principal 12, Puebla',
        maps_link: 'https://maps.google.com/?q=19.0414,-98.2063',
        dress_code: 'Formal / Elegante',
        rsvp_deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPro: true,
            theme: 'angel-pro',
            message: 'Con inmensa alegría invitamos a compartir el sacramento del bautismo de nuestra pequeña Victoria.',
            schedule: [
                { time: '12:00', event: 'Ceremonia de Bautizo', location: 'Parroquia Santa María' },
                { time: '13:00', event: 'Recepción', location: 'Jardín Los Ángeles' },
                { time: '13:30', event: 'Brindis', location: 'Jardín' },
                { time: '14:00', event: 'Comida', location: 'Salón Principal' }
            ],
            padrinos: [
                { role: 'Padrinos de Bautizo', names: 'Tíos Ricardo y Martha' }
            ]
        },
        slug: 'bautizo-victoria-pro',
        created_at: new Date().toISOString(),
    },
    // VICTORIA BAUTIZO - PREMIUM
    {
        id: 'evt-9-premium',
        user_id: MOCK_USER.id,
        title: 'Bautizo de Victoria',
        event_type: 'bautizo',
        date_time: new Date(Date.now() + 86400000 * 25).toISOString(),
        venue_name: 'Parroquia Santa María',
        venue_address: 'Calle Principal 12, Puebla',
        maps_link: 'https://maps.google.com/?q=19.0414,-98.2063',
        dress_code: 'Formal / Elegante',
        rsvp_deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPremium: true,
            theme: 'whimsical-kids', hero_image_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=80',
            message: 'Con inmensa alegría invitamos a compartir el sacramento del bautismo de nuestra amada Victoria.',
            ceremony: {
                name: 'Ceremonia de Bautizo',
                location: 'Parroquia Santa María',
                time: '12:00'
            },
            reception: {
                name: 'Recepción',
                location: 'Jardín Los Ángeles',
                time: '13:00'
            },
            schedule: [
                { time: '12:00', event: 'Ceremonia de Bautizo', location: 'Parroquia Santa María' },
                { time: '13:00', event: 'Recepción y Fotos', location: 'Jardín Los Ángeles' },
                { time: '13:30', event: 'Brindis de Bienvenida', location: 'Jardín' },
                { time: '14:00', event: 'Comida', location: 'Salón Principal' },
                { time: '15:30', event: 'Pastel de Bautizo', location: 'Terraza' }
            ],
            padrinos: [
                { role: 'Padrinos de Bautizo', names: 'Tíos Ricardo y Martha' },
                { role: 'Padrinos de Veladora', names: 'Abuelos José y Rosa' }
            ],
            photoGallery: { 
                enabled: true, 
                uploadEnabled: true,
                images: [
                    'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1602052793312-b99c2a9ee797?auto=format&fit=crop&w=800&q=80'
                ]
            },
            liveStream: {
                enabled: true,
                platform: 'YouTube',
                message: 'Transmisión de la ceremonia',
                multiCamera: false
            },
            hashtag: '#VictoriaBautizo2026',
            countdown: true
        },
        slug: 'bautizo-victoria-premium',
        created_at: new Date().toISOString(),
    },
    {
        id: 'evt-10',
        user_id: MOCK_USER.id,
        title: 'Bautizo de Camila',
        event_type: 'bautizo',
        date_time: new Date(Date.now() + 86400000 * 40).toISOString(),
        venue_name: 'Iglesia del Carmen',
        venue_address: 'Centro Histórico, Guanajuato',
        maps_link: 'https://maps.google.com',
        dress_code: 'Formal',
        rsvp_deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: { theme: 'heaven' },
        slug: 'bautizo-camila',
        created_at: new Date().toISOString(),
    },
    // CAMILA BAUTIZO - PRO
    {
        id: 'evt-10-pro',
        user_id: MOCK_USER.id,
        title: 'Bautizo de Camila',
        event_type: 'bautizo',
        date_time: new Date(Date.now() + 86400000 * 40).toISOString(),
        venue_name: 'Iglesia del Carmen',
        venue_address: 'Centro, Guadalajara',
        maps_link: 'https://maps.google.com/?q=20.6770,-103.3475',
        dress_code: 'Formal / Pasteles',
        rsvp_deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPro: true,
            theme: 'blessed-pro',
            message: 'Dios ha bendecido nuestro hogar con Camila, y queremos celebrar su entrada a la vida cristiana junto a ustedes.',
            schedule: [
                { time: '11:30', event: 'Recepción de Invitados', location: 'Atrio' },
                { time: '12:00', event: 'Sacramento del Bautizo', location: 'Iglesia del Carmen' },
                { time: '13:00', event: 'Sesión Fotográfica', location: 'Jardín' },
                { time: '13:30', event: 'Recepción', location: 'Salón Campestre' },
                { time: '14:00', event: 'Comida', location: 'Salón Principal' }
            ],
            padrinos: [
                { role: 'Padrinos de Bautizo', names: 'Tíos Gabriel y Sofía' }
            ]
        },
        slug: 'bautizo-camila-pro',
        created_at: new Date().toISOString(),
    },
    // CAMILA BAUTIZO - PREMIUM
    {
        id: 'evt-10-premium',
        user_id: MOCK_USER.id,
        title: 'Bautizo de Camila',
        event_type: 'bautizo',
        date_time: new Date(Date.now() + 86400000 * 40).toISOString(),
        venue_name: 'Iglesia del Carmen',
        venue_address: 'Centro, Guadalajara',
        maps_link: 'https://maps.google.com/?q=20.6770,-103.3475',
        dress_code: 'Formal / Colores Pasteles',
        rsvp_deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPremium: true,
            theme: 'blessed-luxury',
            message: 'Dios ha bendecido nuestro hogar con Camila, y queremos celebrar su entrada a la vida cristiana.',
            ceremony: {
                name: 'Sacramento del Bautizo',
                location: 'Iglesia del Carmen',
                time: '12:00'
            },
            reception: {
                name: 'Recepción',
                location: 'Salón Campestre',
                time: '13:30'
            },
            schedule: [
                { time: '11:30', event: 'Recepción de Invitados', location: 'Atrio' },
                { time: '12:00', event: 'Sacramento del Bautizo', location: 'Iglesia del Carmen' },
                { time: '13:00', event: 'Sesión Fotográfica Familiar', location: 'Jardín' },
                { time: '13:30', event: 'Recepción con Barra de Aguas', location: 'Salón Campestre' },
                { time: '14:00', event: 'Comida', location: 'Salón Principal' },
                { time: '15:30', event: 'Pastel', location: 'Terraza' },
                { time: '16:00', event: 'Cofre de Recuerdos', location: 'Salón' }
            ],
            padrinos: [
                { role: 'Padrinos de Bautizo', names: 'Tíos Gabriel y Sofía' },
                { role: 'Padrinos de Ropón', names: 'Abuelos Maternos' },
                { role: 'Padrinos de Veladora', names: 'Abuelos Paternos' }
            ],
            photoGallery: { enabled: true, uploadEnabled: true },
            liveStream: {
                enabled: true,
                platform: 'Facebook',
                message: 'Transmisión de la ceremonia',
                multiCamera: false
            },
            hashtag: '#CamilaBautizo2026',
            countdown: true
        },
        slug: 'bautizo-camila-premium',
        created_at: new Date().toISOString(),
    },
    // Graduaciones
    {
        id: 'evt-11',
        user_id: MOCK_USER.id,
        title: 'Graduación de Ana - Psicología',
        event_type: 'graduacion',
        date_time: new Date(Date.now() + 86400000 * 35).toISOString(),
        venue_name: 'Auditorio Universitario',
        venue_address: 'Ciudad Universitaria, CDMX',
        maps_link: 'https://maps.google.com',
        dress_code: 'Formal',
        rsvp_deadline: new Date(Date.now() + 86400000 * 25).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: { theme: 'academic' },
        slug: 'graduacion-ana-psicologia',
        created_at: new Date().toISOString(),
    },
    // ANA GRADUACIÓN - PRO
    {
        id: 'evt-11-pro',
        user_id: MOCK_USER.id,
        title: 'Graduación de Ana - Psicología',
        event_type: 'graduacion',
        date_time: new Date(Date.now() + 86400000 * 35).toISOString(),
        venue_name: 'Auditorio Universidad',
        venue_address: 'Campus Central, CDMX',
        maps_link: 'https://maps.google.com/?q=19.3327,-99.1870',
        dress_code: 'Formal / Elegante',
        rsvp_deadline: new Date(Date.now() + 86400000 * 25).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPro: true,
            theme: 'achievement-pro',
            message: '¡Después de años de esfuerzo, finalmente llega el día! Celebra conmigo este logro tan importante.',
            schedule: [
                { time: '10:00', event: 'Ceremonia de Graduación', location: 'Auditorio Universidad' },
                { time: '12:00', event: 'Fotos con Familiares', location: 'Jardines del Campus' },
                { time: '14:00', event: 'Brindis', location: 'Salón de Eventos' },
                { time: '15:00', event: 'Comida de Celebración', location: 'Restaurante Vista' }
            ]
        },
        slug: 'graduacion-ana-psicologia-pro',
        created_at: new Date().toISOString(),
    },
    // ANA GRADUACIÓN - PREMIUM
    {
        id: 'evt-11-premium',
        user_id: MOCK_USER.id,
        title: 'Ana - Licenciada en Psicología',
        event_type: 'graduacion',
        date_time: new Date(Date.now() + 86400000 * 35).toISOString(),
        venue_name: 'Auditorio Universidad',
        venue_address: 'Campus Central, CDMX',
        maps_link: 'https://maps.google.com/?q=19.3327,-99.1870',
        dress_code: 'Formal / Elegante',
        rsvp_deadline: new Date(Date.now() + 86400000 * 25).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPremium: true,
            theme: 'polaroid-vintage', hero_image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
            message: '¡Después de años de esfuerzo, sueños y dedicación, finalmente soy Licenciada en Psicología! Quiero compartir este logro contigo.',
            ceremony: {
                name: 'Ceremonia de Graduación',
                location: 'Auditorio Universidad',
                time: '10:00'
            },
            reception: {
                name: 'Comida de Celebración',
                location: 'Restaurante Vista',
                time: '15:00'
            },
            schedule: [
                { time: '10:00', event: 'Ceremonia de Graduación', location: 'Auditorio Universidad' },
                { time: '12:00', event: 'Fotos con Familiares', location: 'Jardines del Campus' },
                { time: '12:30', event: 'Sesión Fotográfica Profesional', location: 'Campus' },
                { time: '14:00', event: 'Brindis de Honor', location: 'Salón de Eventos' },
                { time: '15:00', event: 'Comida de Celebración', location: 'Restaurante Vista' },
                { time: '17:00', event: 'Entrega de Recuerdos', location: 'Restaurante' }
            ],
            photoGallery: { 
                enabled: true, 
                uploadEnabled: true,
                images: [
                    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80'
                ]
            },
            liveStream: {
                enabled: true,
                platform: 'YouTube',
                message: 'Transmisión de la ceremonia',
                multiCamera: false
            },
            hashtag: '#AnaPsicologa2026',
            countdown: true
        },
        slug: 'graduacion-ana-psicologia-premium',
        created_at: new Date().toISOString(),
    },
    {
        id: 'evt-12',
        user_id: MOCK_USER.id,
        title: 'Graduación de Roberto - Ingeniería',
        event_type: 'graduacion',
        date_time: new Date(Date.now() + 86400000 * 48).toISOString(),
        venue_name: 'Centro de Convenciones',
        venue_address: 'Av. Constitución 456, Guadalajara',
        maps_link: 'https://maps.google.com',
        dress_code: 'Semiformal',
        rsvp_deadline: new Date(Date.now() + 86400000 * 38).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: { theme: 'success' },
        slug: 'graduacion-roberto-ingenieria',
        created_at: new Date().toISOString(),
    },
    // ROBERTO GRADUACIÓN - PRO
    {
        id: 'evt-12-pro',
        user_id: MOCK_USER.id,
        title: 'Graduación de Roberto - Ingeniería',
        event_type: 'graduacion',
        date_time: new Date(Date.now() + 86400000 * 48).toISOString(),
        venue_name: 'Centro de Convenciones',
        venue_address: 'Av. Constitución 456, Guadalajara',
        maps_link: 'https://maps.google.com/?q=20.6597,-103.3494',
        dress_code: 'Semiformal / Business',
        rsvp_deadline: new Date(Date.now() + 86400000 * 38).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPro: true,
            theme: 'success-pro',
            message: 'Del sueño a la realidad: ¡Soy Ingeniero! Acompáñame en esta celebración.',
            schedule: [
                { time: '09:00', event: 'Ceremonia de Graduación', location: 'Centro de Convenciones' },
                { time: '11:30', event: 'Fotos Oficiales', location: 'Explanada' },
                { time: '13:00', event: 'Recepción', location: 'Salón Ejecutivo' },
                { time: '14:00', event: 'Comida', location: 'Salón Principal' }
            ]
        },
        slug: 'graduacion-roberto-ingenieria-pro',
        created_at: new Date().toISOString(),
    },
    // ROBERTO GRADUACIÓN - PREMIUM
    {
        id: 'evt-12-premium',
        user_id: MOCK_USER.id,
        title: 'Roberto - Ingeniero',
        event_type: 'graduacion',
        date_time: new Date(Date.now() + 86400000 * 48).toISOString(),
        venue_name: 'Centro de Convenciones',
        venue_address: 'Av. Constitución 456, Guadalajara',
        maps_link: 'https://maps.google.com/?q=20.6597,-103.3494',
        dress_code: 'Semiformal / Business',
        rsvp_deadline: new Date(Date.now() + 86400000 * 38).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPremium: true,
            theme: 'success-luxury',
            message: 'Del sueño a la realidad: después de años de estudio, ¡finalmente soy Ingeniero! Celebra conmigo.',
            ceremony: {
                name: 'Ceremonia de Graduación',
                location: 'Centro de Convenciones',
                time: '09:00'
            },
            reception: {
                name: 'Recepción',
                location: 'Salón Ejecutivo',
                time: '13:00'
            },
            schedule: [
                { time: '09:00', event: 'Ceremonia de Graduación', location: 'Centro de Convenciones' },
                { time: '11:30', event: 'Fotos Oficiales', location: 'Explanada' },
                { time: '12:00', event: 'Sesión con Catedráticos', location: 'Jardines' },
                { time: '13:00', event: 'Recepción con Brindis', location: 'Salón Ejecutivo' },
                { time: '14:00', event: 'Comida', location: 'Salón Principal' },
                { time: '16:00', event: 'Video de Recuerdos', location: 'Salón' },
                { time: '16:30', event: 'Celebración Final', location: 'Terraza' }
            ],
            photoGallery: { enabled: true, uploadEnabled: true },
            liveStream: {
                enabled: true,
                platform: 'Facebook',
                message: 'Transmisión en vivo de la ceremonia',
                multiCamera: false
            },
            hashtag: '#RobertoIngeniero2026',
            countdown: true
        },
        slug: 'graduacion-roberto-ingenieria-premium',
        created_at: new Date().toISOString(),
    },
    // Primera Comunión
    {
        id: 'evt-13',
        user_id: MOCK_USER.id,
        title: 'Primera Comunión de Gael',
        event_type: 'comunion',
        date_time: new Date(Date.now() + 86400000 * 55).toISOString(),
        venue_name: 'Catedral Metropolitana',
        venue_address: 'Plaza de la Constitución, CDMX',
        maps_link: 'https://maps.google.com',
        dress_code: 'Formal',
        rsvp_deadline: new Date(Date.now() + 86400000 * 45).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: { theme: 'blessed' },
        slug: 'comunion-gael',
        created_at: new Date().toISOString(),
    },
    // GAEL COMUNIÓN - PRO
    {
        id: 'evt-13-pro',
        user_id: MOCK_USER.id,
        title: 'Primera Comunión de Gael',
        event_type: 'comunion',
        date_time: new Date(Date.now() + 86400000 * 55).toISOString(),
        venue_name: 'Catedral Metropolitana',
        venue_address: 'Plaza de la Constitución, CDMX',
        maps_link: 'https://maps.google.com/?q=19.4342,-99.1332',
        dress_code: 'Formal / Elegante',
        rsvp_deadline: new Date(Date.now() + 86400000 * 45).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPro: true,
            theme: 'blessed-pro',
            message: 'Con alegría en el corazón, invitamos a la Primera Comunión de nuestro hijo Gael.',
            schedule: [
                { time: '11:00', event: 'Misa de Primera Comunión', location: 'Catedral Metropolitana' },
                { time: '12:30', event: 'Fotos Familiares', location: 'Atrio de la Catedral' },
                { time: '13:30', event: 'Recepción', location: 'Salón Celestial' },
                { time: '14:00', event: 'Comida', location: 'Salón Principal' }
            ],
            padrinos: [
                { role: 'Padrinos de Comunión', names: 'Tíos Eduardo y Patricia' }
            ]
        },
        slug: 'comunion-gael-pro',
        created_at: new Date().toISOString(),
    },
    // GAEL COMUNIÓN - PREMIUM
    {
        id: 'evt-13-premium',
        user_id: MOCK_USER.id,
        title: 'Primera Comunión de Gael',
        event_type: 'comunion',
        date_time: new Date(Date.now() + 86400000 * 55).toISOString(),
        venue_name: 'Catedral Metropolitana',
        venue_address: 'Plaza de la Constitución, CDMX',
        maps_link: 'https://maps.google.com/?q=19.4342,-99.1332',
        dress_code: 'Formal / Elegante',
        rsvp_deadline: new Date(Date.now() + 86400000 * 45).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPremium: true,
            theme: 'blessed-luxury',
            message: 'Con alegría en el corazón y bendiciones de Dios, invitamos a la Primera Comunión de nuestro amado hijo Gael.',
            ceremony: {
                name: 'Misa de Primera Comunión',
                location: 'Catedral Metropolitana',
                time: '11:00'
            },
            reception: {
                name: 'Recepción',
                location: 'Salón Celestial',
                time: '13:30'
            },
            schedule: [
                { time: '11:00', event: 'Misa de Primera Comunión', location: 'Catedral Metropolitana' },
                { time: '12:30', event: 'Fotos Familiares', location: 'Atrio de la Catedral' },
                { time: '13:00', event: 'Sesión Fotográfica Especial', location: 'Jardínes' },
                { time: '13:30', event: 'Recepción con Brindis', location: 'Salón Celestial' },
                { time: '14:00', event: 'Comida', location: 'Salón Principal' },
                { time: '15:30', event: 'Pastel', location: 'Terraza' },
                { time: '16:00', event: 'Recordatorio para Invitados', location: 'Salón' }
            ],
            padrinos: [
                { role: 'Padrinos de Comunión', names: 'Tíos Eduardo y Patricia' },
                { role: 'Padrinos de Rosario', names: 'Abuelos Maternos' },
                { role: 'Padrinos de Biblia', names: 'Abuelos Paternos' }
            ],
            photoGallery: { 
                enabled: true, 
                uploadEnabled: true,
                images: [
                    'https://images.unsplash.com/photo-1438032005730-c7aedb098c71?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1507676184212-d0330a156f97?auto=format&fit=crop&w=800&q=80'
                ]
            },
            liveStream: {
                enabled: true,
                platform: 'YouTube',
                message: 'Transmisión de la ceremonia religiosa',
                multiCamera: false
            },
            hashtag: '#GaelPrimeraComunion',
            countdown: true
        },
        slug: 'comunion-gael-premium',
        created_at: new Date().toISOString(),
    },

    // ==================== BODA ANA Y CARLOS - PRO ====================
    {
        id: 'evt-boda-1-pro',
        user_id: MOCK_USER.id,
        title: 'Ana & Carlos',
        event_type: 'wedding',
        date_time: new Date(Date.now() + 86400000 * 30).toISOString(),
        venue_name: 'Hacienda San Gabriel',
        venue_address: 'Carr. Federal 57, Km 20, San Luis Potosí',
        maps_link: 'https://maps.google.com/?q=22.0982,-101.0276',
        dress_code: 'Etiqueta Rigurosa',
        rsvp_deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPro: true,
            theme: 'gold-premium',
            schedule: [
                { time: '17:00', event: 'Ceremonia Religiosa', location: 'Capilla de la Hacienda' },
                { time: '18:30', event: 'Cóctel de Bienvenida', location: 'Jardín Principal' },
                { time: '19:30', event: 'Recepción', location: 'Salón Imperial' },
                { time: '20:00', event: 'Cena de Gala', location: 'Salón Imperial' },
                { time: '22:00', event: 'Baile y Fiesta', location: 'Pista Principal' }
            ],
            parents: {
                father: 'Sr. Juan García',
                mother: 'Sra. Elena Ruiz'
            },
            message: 'Con la bendición de Dios y nuestros padres, queremos compartir con ustedes el día más importante de nuestras vidas.'
        },
        slug: 'boda-ana-y-carlos-pro',
        created_at: new Date().toISOString(),
    },

    // ==================== BODA ANA Y CARLOS - PREMIUM ====================
    {
        id: 'evt-boda-1-premium',
        user_id: MOCK_USER.id,
        title: 'Ana & Carlos',
        event_type: 'wedding',
        date_time: new Date(Date.now() + 86400000 * 30).toISOString(),
        venue_name: 'Hacienda San Gabriel',
        venue_address: 'Carr. Federal 57, Km 20, San Luis Potosí',
        maps_link: 'https://maps.google.com/?q=22.0982,-101.0276',
        dress_code: 'Etiqueta Rigurosa / Black Tie',
        rsvp_deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
        is_published: true,
        plan: 'clasico',
        theme_config: {
            isPremium: true,
            theme: 'gold-luxury',
            schedule: [
                { time: '17:00', event: 'Ceremonia Religiosa', location: 'Capilla de la Hacienda' },
                { time: '18:30', event: 'Cóctel de Bienvenida', location: 'Jardín Principal' },
                { time: '19:30', event: 'Recepción', location: 'Salón Imperial' },
                { time: '20:00', event: 'Cena de Gala', location: 'Salón Imperial' },
                { time: '22:00', event: 'Primer Baile', location: 'Pista Principal' },
                { time: '22:30', event: 'Apertura de Pista', location: 'Pista Principal' },
                { time: '01:00', event: 'Corte de Pastel', location: 'Jardín' }
            ],
            parents: {
                father: 'Sr. Juan García',
                mother: 'Sra. Elena Ruiz'
            },
            photoGallery: { enabled: true, uploadEnabled: true },
            liveStream: { enabled: true, platform: 'YouTube', message: 'Sigue nuestra boda en vivo', multiCamera: true },
            hashtag: '#AnaYCarlos2026',
            countdown: true,
            backgroundMusic: true,
            message: 'Con la bendición de Dios y nuestros padres, queremos compartir con ustedes el día más importante de nuestras vidas.'
        },
        slug: 'boda-ana-y-carlos-premium',
        created_at: new Date().toISOString(),
    },

    // ==================== NEW 10 THEMES MOCK DATA ====================
    {
        id: 'mock-sofia-mateo',
        slug: 'boda-sofia-mateo-premium',
        user_id: 'mock-user-1',
        title: 'Sofía y Mateo',
        event_type: 'wedding',
        date_time: '2026-10-15T18:00:00Z',
        venue_name: 'Hacienda Los Arcángeles',
        venue_address: 'Carretera San Miguel de Allende',
        maps_link: 'https://goo.gl/maps/example',
        dress_code: 'Etiqueta Rigurosa',
        is_published: true,
        plan: 'clasico',
        rsvp_deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
        created_at: new Date().toISOString(),
        theme_config: {
            theme: 'split-screen', hero_image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80',
            typography_preset: 'moderna',
            primary_color: '#2d3748',
            accent_color: '#e2e8f0',
            isPremium: true
        }
    },
    {
        id: 'mock-valeria-xv',
        slug: 'xv-valeria-premium',
        user_id: 'mock-user-1',
        title: 'Valeria',
        event_type: 'xv',
        date_time: '2026-11-20T20:00:00Z',
        venue_name: 'Salón Metropolitan',
        venue_address: 'Av. Reforma 123',
        maps_link: 'https://goo.gl/maps/example',
        dress_code: 'Cocktail',
        is_published: true,
        plan: 'clasico',
        rsvp_deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
        created_at: new Date().toISOString(),
        theme_config: {
            theme: 'magazine', hero_image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600&q=80',
            typography_preset: 'editorial',
            primary_color: '#000000',
            accent_color: '#ffffff',
            isPremium: true
        }
    },
    {
        id: 'mock-gala',
        slug: 'gala-aniversario-premium',
        user_id: 'mock-user-1',
        title: 'Gala de Aniversario',
        event_type: 'wedding',
        date_time: '2026-12-31T21:00:00Z',
        venue_name: 'Gran Hotel',
        venue_address: 'Centro Histórico',
        maps_link: 'https://goo.gl/maps/example',
        dress_code: 'Black Tie',
        is_published: true,
        plan: 'clasico',
        rsvp_deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
        created_at: new Date().toISOString(),
        theme_config: {
            theme: 'luxury-gold', hero_image_url: 'https://images.unsplash.com/photo-1519671482749-fd09871171dd?auto=format&fit=crop&w=1600&q=80',
            typography_preset: 'clasica',
            primary_color: '#000000',
            accent_color: '#d4af37',
            isPremium: true
        }
    },
    {
        id: 'mock-destino',
        slug: 'boda-destino-premium',
        user_id: 'mock-user-1',
        title: 'Laura & David',
        event_type: 'wedding',
        date_time: '2026-08-10T17:00:00Z',
        venue_name: 'Playa del Carmen Resort',
        venue_address: 'Riviera Maya',
        maps_link: 'https://goo.gl/maps/example',
        dress_code: 'Guayabera y Vestido Largo',
        is_published: true,
        plan: 'clasico',
        rsvp_deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
        created_at: new Date().toISOString(),
        theme_config: {
            theme: 'passport', hero_image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80',
            typography_preset: 'moderna',
            primary_color: '#006B7D',
            accent_color: '#FFB5A7',
            isPremium: true
        }
    }
];

export const MOCK_GUESTS: Guest[] = [
    {
        id: 'guest-1',
        event_id: 'evt-1',
        name: 'Tío Roberto',
        phone: '5512345678',
        email: 'roberto@email.com',
        group_name: 'family',
        guest_token: 'token-roberto',
        max_plus_ones: 1,
        status: 'sent',
        views_count: 0,
        table_id: null,
        last_reminder_at: null,
        checked_in_at: null,
        created_at: new Date().toISOString(),
    },
    {
        id: 'guest-2',
        event_id: 'evt-1',
        name: 'Mariana López',
        phone: '5587654321',
        email: '',
        group_name: 'friends',
        guest_token: 'token-mariana',
        max_plus_ones: 0,
        status: 'pending',
        views_count: 0,
        table_id: null,
        last_reminder_at: null,
        checked_in_at: null,
        created_at: new Date().toISOString(),
    }
];
