import fs from 'fs';

const path = 'src/lib/mockData.ts';
let content = fs.readFileSync(path, 'utf8');

// The new events to add
const newEventsData = `
    {
        id: 'mock-sofia-mateo',
        slug: 'boda-sofia-mateo-premium',
        user_id: 'mock-user-1',
        title: 'Sofía y Mateo',
        event_type: 'wedding',
        event_date: '2026-10-15T18:00:00Z',
        venue_name: 'Hacienda Los Arcángeles',
        venue_address: 'Carretera San Miguel de Allende',
        maps_link: 'https://goo.gl/maps/example',
        dress_code: 'Etiqueta Rigurosa',
        padrinos: null,
        parents: null,
        message: 'Acompáñanos a celebrar nuestro amor',
        status: 'published',
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        theme_config: {
            theme: 'split-screen',
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
        event_date: '2026-11-20T20:00:00Z',
        venue_name: 'Salón Metropolitan',
        venue_address: 'Av. Reforma 123',
        maps_link: 'https://goo.gl/maps/example',
        dress_code: 'Cocktail',
        padrinos: null,
        parents: null,
        message: 'La mejor noche de mi vida',
        status: 'published',
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        theme_config: {
            theme: 'magazine',
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
        event_date: '2026-12-31T21:00:00Z',
        venue_name: 'Gran Hotel',
        venue_address: 'Centro Histórico',
        maps_link: 'https://goo.gl/maps/example',
        dress_code: 'Black Tie',
        padrinos: null,
        parents: null,
        message: 'Celebrando 50 años de trayectoria',
        status: 'published',
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        theme_config: {
            theme: 'luxury-gold',
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
        event_date: '2026-08-10T17:00:00Z',
        venue_name: 'Playa del Carmen Resort',
        venue_address: 'Riviera Maya',
        maps_link: 'https://goo.gl/maps/example',
        dress_code: 'Guayabera y Vestido Largo',
        padrinos: null,
        parents: null,
        message: '¡Nos casamos en la playa!',
        status: 'published',
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        theme_config: {
            theme: 'passport',
            typography_preset: 'moderna',
            primary_color: '#006B7D',
            accent_color: '#FFB5A7',
            isPremium: true
        }
    },
`;

// Insert the new events
content = content.replace(
    /export const MOCK_EVENTS: Event\[\] = \[/,
    'export const MOCK_EVENTS: Event[] = [' + newEventsData
);

// Update Emilia to neon-glow
content = content.replace(
    /slug: 'cumple-emilia-premium',[\s\S]*?theme_config: \{[\s\S]*?\},/,
    `slug: 'cumple-emilia-premium',
        user_id: 'mock-user-1',
        title: 'Emilia',
        event_type: 'birthday',
        event_date: '2026-08-15T21:00:00Z',
        venue_name: 'Terraza Soho',
        venue_address: 'Av. Providencia 200',
        maps_link: 'https://goo.gl/maps/example',
        dress_code: 'Neon / Glow',
        padrinos: null,
        parents: null,
        message: '¡Vamos a celebrar en grande!',
        status: 'published',
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        theme_config: {
            theme: 'neon-glow',
            typography_preset: 'moderna',
            primary_color: '#ff00ff',
            accent_color: '#00ffff',
            isPremium: true,
            hero_image_url: 'https://images.unsplash.com/photo-1530103862676-de8892bf30b5?auto=format&fit=crop&w=1600&q=80'
        },`
);

// Update Ana to polaroid-vintage
content = content.replace(
    /slug: 'graduacion-ana-psicologia-premium',[\s\S]*?theme_config: \{[\s\S]*?\},/,
    `slug: 'graduacion-ana-psicologia-premium',
        user_id: 'mock-user-1',
        title: 'Ana - Licenciada en Psicología',
        event_type: 'graduacion',
        event_date: '2026-07-14T16:00:00Z',
        venue_name: 'Auditorio Universidad',
        venue_address: 'Campus Central, CDMX',
        maps_link: 'https://goo.gl/maps/example',
        dress_code: 'Formal',
        padrinos: null,
        parents: null,
        message: 'Acompáñame a celebrar este gran logro',
        status: 'published',
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        theme_config: {
            theme: 'polaroid-vintage',
            typography_preset: 'maquina',
            primary_color: '#Eae6df',
            accent_color: '#8b5a2b',
            isPremium: true,
            hero_image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80'
        },`
);

// Update Victoria to whimsical-kids
content = content.replace(
    /slug: 'bautizo-victoria-premium',[\s\S]*?theme_config: \{[\s\S]*?\},/,
    `slug: 'bautizo-victoria-premium',
        user_id: 'mock-user-1',
        title: 'Bautizo Victoria',
        event_type: 'bautizo',
        event_date: '2026-09-05T10:00:00Z',
        venue_name: 'Jardín Las Fuentes',
        venue_address: 'Zapopan, Jalisco',
        maps_link: 'https://goo.gl/maps/example',
        dress_code: 'Blanco o colores pastel',
        padrinos: null,
        parents: null,
        message: 'Acompáñanos a celebrar el bautizo de nuestra pequeña',
        status: 'published',
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        theme_config: {
            theme: 'whimsical-kids',
            typography_preset: 'infantil',
            primary_color: '#FFB5A7',
            accent_color: '#A0C4FF',
            isPremium: true,
            hero_image_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=80'
        },`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated mockData.ts');
