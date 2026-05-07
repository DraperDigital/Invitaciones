import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log("Checking for duplicate functions...");
    const { data, error } = await supabase.rpc('get_event_feature_access', { p_event_id: 'fe16ba9c-d838-43ef-bd67-9f5d130b1fbd' });
    
    if (error) {
        console.error("RPC Error:", error);
    } else {
        console.log("RPC Success:", data);
    }
}
diagnose();
