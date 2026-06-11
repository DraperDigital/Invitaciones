import fs from 'fs';

// 1. Fix mockData.ts
let mockDataContent = fs.readFileSync('src/lib/mockData.ts', 'utf8');
mockDataContent = mockDataContent.replace(/        status: 'published',\n/g, '');
fs.writeFileSync('src/lib/mockData.ts', mockDataContent, 'utf8');

console.log('Fixed TS errors 4');
