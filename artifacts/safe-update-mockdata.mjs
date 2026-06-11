import fs from 'fs';

const path = 'src/lib/mockData.ts';
let content = fs.readFileSync(path, 'utf8');

// The new events to add
const newEventsData = `
    // ==================== NEW 10 THEMES MOCK DATA ====================
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
    }
];
`;

content = content.replace(
    "    theme: 'unicorn-luxury',",
    "    theme: 'neon-glow', hero_image_url: 'https://images.unsplash.com/photo-1530103862676-de8892bf30b5?auto=format&fit=crop&w=1600&q=80',"
);

content = content.replace(
    "    theme: 'achievement-luxury',",
    "    theme: 'polaroid-vintage', hero_image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',"
);

content = content.replace(
    "    theme: 'angel-luxury',",
    "    theme: 'whimsical-kids', hero_image_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=80',"
);

// We replace the end of MOCK_EVENTS array which is before MOCK_GUESTS
content = content.replace(
    /\n];\s*export const MOCK_GUESTS: Guest\[\] = \[/m,
    ',\n' + newEventsData + '\nexport const MOCK_GUESTS: Guest[] = ['
);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully applied SAFE mockData update.');
