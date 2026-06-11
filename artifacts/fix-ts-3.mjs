import fs from 'fs';

// 1. Fix mockData.ts
let mockDataContent = fs.readFileSync('src/lib/mockData.ts', 'utf8');
mockDataContent = mockDataContent.replace(/        message: 'Acompáñanos a celebrar nuestro amor',\n/g, '');
mockDataContent = mockDataContent.replace(/        message: 'La mejor noche de mi vida',\n/g, '');
mockDataContent = mockDataContent.replace(/        message: 'Celebrando 50 años de trayectoria',\n/g, '');
mockDataContent = mockDataContent.replace(/        message: '¡Nos casamos en la playa!',\n/g, '');
fs.writeFileSync('src/lib/mockData.ts', mockDataContent, 'utf8');

// 2. Fix the unused parameters in themes
const files = [
    { file: 'LuxuryGoldHero.tsx', toReplace: /\{ event, cfg, countdown, labels, heroImageUrl, scrollToSection \}/g, replacement: '{ event, countdown, labels, scrollToSection }' },
    { file: 'MagazineHero.tsx', toReplace: /\{ event, cfg, countdown, labels, heroImageUrl, scrollToSection \}/g, replacement: '{ event, countdown, heroImageUrl, scrollToSection }' },
    { file: 'PassportHero.tsx', toReplace: /\{ event, cfg, countdown, labels, heroImageUrl, scrollToSection \}/g, replacement: '{ event, cfg, countdown, heroImageUrl, scrollToSection }' },
    { file: 'PolaroidVintageHero.tsx', toReplace: /\{ event, cfg, countdown, labels, heroImageUrl, scrollToSection \}/g, replacement: '{ event, countdown, heroImageUrl, scrollToSection }' },
];

for (const { file, toReplace, replacement } of files) {
    const p = 'src/components/themes/' + file;
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(toReplace, replacement);
    fs.writeFileSync(p, content, 'utf8');
}

console.log('Fixed TS errors 3');
