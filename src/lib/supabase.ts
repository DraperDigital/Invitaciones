import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iyunljflpqfztmwnlgup.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5dW5samZscHFmenRtd25sZ3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MjE3NDQsImV4cCI6MjA5MDM5Nzc0NH0.Fk3t7fu-wtOpt30e2s87UW8T_S5UdWWdehV27fKuehE';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
