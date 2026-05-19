import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iyunljflpqfztmwnlgup.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5dW5samZscHFmenRtd25sZ3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MjE3NDQsImV4cCI6MjA5MDM5Nzc0NH0.Fk3t7fu-wtOpt30e2s87UW8T_S5UdWWdehV27fKuehE'; // Service Role key

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupBucket() {
    console.log("Creating public bucket 'event-images'...");
    const { data: createData, error: createError } = await supabase.storage.createBucket('event-images', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880 // 5MB
    });

    console.log("Create Bucket Result:", { createData, createError });
}

setupBucket();
