import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 
                     localStorage.getItem('VITE_SUPABASE_URL') || 
                     '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                          localStorage.getItem('VITE_SUPABASE_ANON_KEY') || 
                          '';

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

if (!supabase) {
  console.warn('⚠️ Supabase client not initialized in frontend. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are configured. Falling back to HTTP polling.');
}

export default supabase;
