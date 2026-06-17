import dotenv from 'dotenv';
import { supabase } from './src/services/supabaseClient.js';

// Load environment variables
dotenv.config();

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  // Check if environment variables are set
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET');
  console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.log('Please set your Supabase credentials in the .env file');
    return;
  }
  
  try {
    // Test connection by trying to get the Supabase version
    console.log('Attempting to connect to Supabase...');
    const { data, error } = await supabase.rpc('version');
    
    if (error) {
      console.log('Connection test result:', error.message);
      if (error.message.includes('function "version" does not exist')) {
        console.log('✅ Connected to Supabase successfully (function does not exist is expected)');
      } else {
        console.log('❌ Failed to connect to Supabase');
      }
    } else {
      console.log('✅ Connected to Supabase successfully');
      console.log('Version:', data);
    }
  } catch (err) {
    console.log('❌ Error connecting to Supabase:', err.message);
  }
}

testSupabaseConnection();