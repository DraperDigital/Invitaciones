import fs from 'fs';

let mockDataContent = fs.readFileSync('src/lib/mockData.ts', 'utf8');

mockDataContent = mockDataContent.replace(
    "theme: 'romantic-luxury',",
    "theme: 'modern-minimalist', hero_image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',"
);

mockDataContent = mockDataContent.replace(
    "theme: 'vintage-luxury',",
    "theme: 'classic-elegance', hero_image_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1600&q=80',"
);

mockDataContent = mockDataContent.replace(
    "theme: 'princess-luxury',",
    "theme: 'romantic-botanical', hero_image_url: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=1600&q=80',"
);

fs.writeFileSync('src/lib/mockData.ts', mockDataContent, 'utf8');
console.log('Fixed missing themes');
