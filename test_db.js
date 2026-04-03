import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumn() {
    try {
        console.log("Checking if checked_in_at exists...");
        const { data, error } = await supabase
            .from('guests')
            .select('checked_in_at')
            .limit(1);

        if (error) {
            console.error("ERROR from Supabase:", error);
        } else {
            console.log("SUCCESS. Data:", data);
        }
    } catch(e) {
        console.error("Exception:", e);
    }
}
checkColumn();
