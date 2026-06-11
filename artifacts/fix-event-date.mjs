import fs from 'fs';
import path from 'path';

const themesDir = 'src/components/themes';
const files = fs.readdirSync(themesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    const filePath = path.join(themesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('event.event_date')) {
        content = content.replace(/event\.event_date/g, 'event.date_time');
        fs.writeFileSync(filePath, content, 'utf8');
    }
}
console.log('Fixed event_date');
