import { supabase } from './src/lib/supabase';

async function checkProfiles() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
    
    if (error) {
        console.error('Error fetching profiles:', error);
    } else {
        console.log('Columns in profiles:', Object.keys(data[0] || {}));
        console.log('Sample profile data:', data[0]);
    }
}

checkProfiles();
