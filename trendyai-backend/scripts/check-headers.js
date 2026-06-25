async function checkHeaders() {
  try {
    const res = await fetch('https://wtgwxnhnqdnbzpetltrt.supabase.co');
    console.log('Status:', res.status);
    console.log('Headers:');
    for (const [key, value] of res.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkHeaders().catch(console.error);
