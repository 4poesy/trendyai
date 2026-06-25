import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wtgwxnhnqdnbzpetltrt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Z3d4bmhucWRuYnpwZXRsdHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNjQ2NjUsImV4cCI6MjA4MDY0MDY2NX0.3eblmq4lsnDQU33M9XqZpBqux9bi9hX2G0yUuPScHJA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  console.log('Testing insert with new columns...');
  try {
    const testPage = {
      slug: 'test-insert-slug-456',
      title: 'Test Title',
      service: 'web-design',
      location: 'london',
      h1: 'Test H1',
      meta_description: 'Test Description',
      published: false,
      page_type: 'service-location', // New column
      country: 'UK' // New column
    };

    const { data, error } = await supabase
      .from('seo_pages')
      .upsert(testPage, { onConflict: 'slug' })
      .select();
    
    if (error) {
      console.error('❌ Insert failed:', error.message);
    } else {
      console.log('✅ Insert successful! Data:', data);
    }
  } catch (err) {
    console.error('❌ Exception:', err.message);
  }
}

test();
