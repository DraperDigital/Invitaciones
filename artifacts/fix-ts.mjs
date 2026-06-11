import fs from 'fs';

// 1. Fix date_time in mockData.ts
let mockDataContent = fs.readFileSync('src/lib/mockData.ts', 'utf8');
mockDataContent = mockDataContent.replace(/event_date: /g, 'date_time: ');
fs.writeFileSync('src/lib/mockData.ts', mockDataContent, 'utf8');

// 2. Fix unused variables in new themes
const themesToFix = [
    'LuxuryGoldHero.tsx',
    'MagazineHero.tsx',
    'PassportHero.tsx',
    'PolaroidVintageHero.tsx',
    'SplitScreenHero.tsx'
];

for (const theme of themesToFix) {
    const p = 'src/components/themes/' + theme;
    let content = fs.readFileSync(p, 'utf8');
    // Just prefix unused variables with _ in the component signature
    content = content.replace(/\{ event, cfg, countdown, labels, heroImageUrl, scrollToSection \}/g, '{ event, cfg: _cfg, countdown, labels: _labels, heroImageUrl: _heroImageUrl, scrollToSection }');
    // For SplitScreenHero which has unused accentColor
    content = content.replace(/const accentColor = cfg\.accentColor \|\| cfg\.accent_color \|\| '#BD7474';/g, '');
    fs.writeFileSync(p, content, 'utf8');
}

// 3. Fix interface in ClassicEleganceHero.tsx and RomanticBotanicalHero.tsx
const olderThemes = ['ClassicEleganceHero.tsx', 'RomanticBotanicalHero.tsx'];
for (const theme of olderThemes) {
    const p = 'src/components/themes/' + theme;
    let content = fs.readFileSync(p, 'utf8');
    if (!content.includes('scrollToSection:')) {
        content = content.replace(/heroImageUrl: string \| null;/g, 'heroImageUrl: string | null;\n    scrollToSection: (id: string) => void;');
        // Add it to the destructured props
        content = content.replace(/\{ event, cfg, countdown, labels, heroImageUrl \}: Props/g, '{ event, cfg, countdown, labels, heroImageUrl, scrollToSection }: Props');
    }
    fs.writeFileSync(p, content, 'utf8');
}

console.log('Fixed TS errors');
