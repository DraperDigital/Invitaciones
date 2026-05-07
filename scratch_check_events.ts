import { supabase } from './src/lib/supabase';

async function checkEventsTable() {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .limit(1);
    
    if (error) {
        console.error('Error fetching events:', error);
    } else {
        console.log('REAL columns in events table:', Object.keys(data[0] || {}));
    }
}

checkEventsTable();
