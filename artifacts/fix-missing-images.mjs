import fs from 'fs';

let mockDataContent = fs.readFileSync('src/lib/mockData.ts', 'utf8');

mockDataContent = mockDataContent.replace(
    "theme: 'split-screen',",
    "theme: 'split-screen', hero_image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80',"
);

mockDataContent = mockDataContent.replace(
    "theme: 'magazine',",
    "theme: 'magazine', hero_image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600&q=80',"
);

mockDataContent = mockDataContent.replace(
    "theme: 'luxury-gold',",
    "theme: 'luxury-gold', hero_image_url: 'https://images.unsplash.com/photo-1519671482749-fd09871171dd?auto=format&fit=crop&w=1600&q=80',"
);

mockDataContent = mockDataContent.replace(
    "theme: 'passport',",
    "theme: 'passport', hero_image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80',"
);

fs.writeFileSync('src/lib/mockData.ts', mockDataContent, 'utf8');
console.log('Fixed missing hero image urls');
