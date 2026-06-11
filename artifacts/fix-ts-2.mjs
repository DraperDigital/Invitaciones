import fs from 'fs';

// 1. Fix mockData.ts
let mockDataContent = fs.readFileSync('src/lib/mockData.ts', 'utf8');
mockDataContent = mockDataContent.replace(/        padrinos: null,\n/g, '');
mockDataContent = mockDataContent.replace(/        parents: null,\n/g, '');
fs.writeFileSync('src/lib/mockData.ts', mockDataContent, 'utf8');

// 2. Fix the renaming mistakes
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
    content = content.replace(/\{ event, cfg: _cfg, countdown, labels: _labels, heroImageUrl: _heroImageUrl, scrollToSection \}/g, '{ event, cfg, countdown, labels, heroImageUrl, scrollToSection }');
    content = content.replace(/\{ event, cfg, countdown, labels: _labels, heroImageUrl, scrollToSection \}/g, '{ event, cfg, countdown, labels, heroImageUrl, scrollToSection }');
    fs.writeFileSync(p, content, 'utf8');
}

const olderThemes = ['ClassicEleganceHero.tsx', 'RomanticBotanicalHero.tsx'];
for (const theme of olderThemes) {
    const p = 'src/components/themes/' + theme;
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/\{ event, cfg, countdown, labels, heroImageUrl, scrollToSection \}/g, '{ event, cfg, countdown, labels, heroImageUrl }');
    fs.writeFileSync(p, content, 'utf8');
}

console.log('Fixed TS errors again');
