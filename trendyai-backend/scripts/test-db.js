import pg from 'pg';

const candidateRegions = [
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-central-1',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'ap-southeast-1',
  'ap-southeast-2'
];

const clusters = ['aws-0', 'aws-1', 'aws-2'];
const passwords = ['Trendtactics123@', 'Olawale123@', '?Tre.ndy_123.0@mi'];

async function testCombination(cluster, region) {
  const host = `${cluster}-${region}.pooler.supabase.com`;
  
  // Try resolving first to avoid wasting time on non-existent hosts
  try {
    const connectionString = `postgres://postgres.wtgwxnhnqdnbzpetltrt:${encodeURIComponent(passwords[0])}@${host}:6543/postgres`;
    const client = new pg.Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
    await client.connect();
    console.log(`🎉 SUCCESS: Connected to ${host}`);
    await client.end();
    return host;
  } catch (err) {
    if (err.message.includes('tenant/user') && err.message.includes('not found')) {
      // Host exists, but tenant is not in this region/cluster
      return null;
    }
    if (err.message.includes('password authentication failed')) {
      console.log(`ℹ️ Tenant found in ${host}, but password failed`);
      // We found the correct host! Let's try other passwords
      for (let i = 1; i < passwords.length; i++) {
        try {
          const connectionString = `postgres://postgres.wtgwxnhnqdnbzpetltrt:${encodeURIComponent(passwords[i])}@${host}:6543/postgres`;
          const client = new pg.Client({
            connectionString,
            ssl: { rejectUnauthorized: false }
          });
          await client.connect();
          console.log(`🎉 SUCCESS: Connected to ${host} with password ${passwords[i]}`);
          await client.end();
          return host;
        } catch (e) {
          console.log(`Password ${passwords[i]} failed for ${host}: ${e.message}`);
        }
      }
      return host;
    }
    // Host probably doesn't exist
    return null;
  }
}

async function testAll() {
  console.log('Testing pooler cluster combinations in parallel...');
  const promises = [];
  for (const cluster of clusters) {
    for (const region of candidateRegions) {
      promises.push(testCombination(cluster, region));
    }
  }
  await Promise.all(promises);
  console.log('Finished testing.');
}

testAll().catch(console.error);
