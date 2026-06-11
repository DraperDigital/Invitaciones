import fs from 'fs';

const path = 'src/pages/InvitationPage.tsx';
let content = fs.readFileSync(path, 'utf8');

// Insert variables at the top of the component
content = content.replace(
    'const { guestToken } = useGuestToken(slug || \'\');',
    `const { guestToken } = useGuestToken(slug || '');

    // Dynamic Theming Variables
    const isDarkTheme = cfg?.theme === 'modern-minimalist';
    const globalStyles = {
        '--section-bg': isDarkTheme ? '#1a1a1a' : '#ffffff',
        '--section-bg-alt': isDarkTheme ? '#151515' : '#FDFBF7',
        '--card-bg': isDarkTheme ? '#242424' : '#ffffff',
        '--text-primary': isDarkTheme ? '#ffffff' : '#1c1917',
        '--text-secondary': isDarkTheme ? '#a3a3a3' : '#57534e',
        '--border-color': isDarkTheme ? '#333333' : '#f5f5f4',
        '--card-border': isDarkTheme ? '#404040' : '#e7e5e4',
    } as React.CSSProperties;`
);

// Apply styles to the main wrapper
content = content.replace(
    '<div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-rose-50/20">',
    '<div className="min-h-screen bg-[var(--section-bg)] text-[var(--text-primary)] transition-colors duration-500" style={globalStyles}>'
);

// Replace Tailwind classes in render methods
const replacements = [
    { search: /\bbg-white\b/g, replace: 'bg-[var(--section-bg)]' },
    { search: /\bbg-stone-50\b/g, replace: 'bg-[var(--section-bg-alt)]' },
    { search: /\bbg-stone-100\b/g, replace: 'bg-[var(--section-bg-alt)]' },
    { search: /\btext-stone-900\b/g, replace: 'text-[var(--text-primary)]' },
    { search: /\btext-stone-800\b/g, replace: 'text-[var(--text-primary)]' },
    { search: /\btext-stone-700\b/g, replace: 'text-[var(--text-secondary)]' },
    { search: /\btext-stone-600\b/g, replace: 'text-[var(--text-secondary)]' },
    { search: /\btext-stone-500\b/g, replace: 'text-[var(--text-secondary)]' },
    { search: /\btext-stone-400\b/g, replace: 'text-[var(--text-secondary)]' },
    { search: /\bborder-stone-50\b/g, replace: 'border-[var(--border-color)]' },
    { search: /\bborder-stone-100\b/g, replace: 'border-[var(--border-color)]' },
    { search: /\bborder-stone-200\b/g, replace: 'border-[var(--card-border)]' },
    { search: /\bbg-gradient-to-br from-amber-50\/30 to-rose-50\/20\b/g, replace: 'bg-[var(--section-bg-alt)]' },
    { search: /\bbg-gradient-to-br from-stone-50 to-amber-50\/20\b/g, replace: 'bg-[var(--section-bg-alt)]' },
    { search: /\bbg-gradient-to-br from-stone-50 to-rose-50\/20\b/g, replace: 'bg-[var(--section-bg-alt)]' },
    { search: /\bbg-gradient-to-br from-amber-50\/50 to-rose-50\/30\b/g, replace: 'bg-[var(--section-bg-alt)]' },
    { search: /\bcard-premium\b/g, replace: 'bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl' },
];

let modifiedContent = content;
replacements.forEach(r => {
    modifiedContent = modifiedContent.replace(r.search, r.replace);
});

fs.writeFileSync(path, modifiedContent, 'utf8');
console.log('Successfully updated InvitationPage.tsx with dynamic CSS variables.');
