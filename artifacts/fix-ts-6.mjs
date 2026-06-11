import fs from 'fs';

// 1. Fix mockData.ts
let mockDataContent = fs.readFileSync('src/lib/mockData.ts', 'utf8');
mockDataContent = mockDataContent.replace(/        is_published: true,\n/g, "        is_published: true,\n        plan: 'clasico',\n        rsvp_deadline: new Date(Date.now() + 86400000 * 15).toISOString(),\n");
fs.writeFileSync('src/lib/mockData.ts', mockDataContent, 'utf8');

console.log('Fixed TS errors 6');
