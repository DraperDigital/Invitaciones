import fs from 'fs';

const path = 'src/pages/ExamplesPage.tsx';
let content = fs.readFileSync(path, 'utf8');

const newTemplates = `
        const TEMPLATES = [
            { id: 'modern-minimalist', name: 'Moderna Minimalista', category: 'boda', slug: 'boda-gabriela-arturo-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop' },
            { id: 'split-screen', name: 'Vanguardia Dividida', category: 'boda', slug: 'boda-sofia-mateo-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop' },
            { id: 'classic-elegance', name: 'Clásica Atemporal', category: 'boda', slug: 'boda-isabel-rodrigo-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop' },
            { id: 'magazine', name: 'Estilo Editorial', category: 'xv', slug: 'xv-valeria-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop' },
            { id: 'romantic-botanical', name: 'Elegancia Floral', category: 'xv', slug: 'xv-regina-2026-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=800&auto=format&fit=crop' },
            { id: 'neon-glow', name: 'Fiesta Neón', category: 'cumpleanos', slug: 'cumple-emilia-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8892bf30b5?q=80&w=800&auto=format&fit=crop' },
            { id: 'luxury-gold', name: 'Lujo Metálico', category: 'boda', slug: 'gala-aniversario-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop' },
            { id: 'passport', name: 'Pase de Abordaje', category: 'boda', slug: 'boda-destino-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop' },
            { id: 'polaroid-vintage', name: 'Retro Fotográfico', category: 'graduacion', slug: 'graduacion-ana-psicologia-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop' },
            { id: 'whimsical-kids', name: 'Fantasía Infantil', category: 'bautizo', slug: 'bautizo-victoria-premium', plan: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop' }
        ];
`;

content = content.replace(
    /        const TEMPLATES = \[[\s\S]*?\];/,
    newTemplates.trim()
);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated ExamplesPage with 10 templates.');
