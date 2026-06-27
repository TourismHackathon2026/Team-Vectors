// Run this script to fix the broken auth trigger:
// node scripts/fix-auth-trigger.mjs
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

const PASSWORD = 'minecraft@9817@2064@#';
const REF = 'daezttstdpxwhuurptzz';

const client = new pg.Client({
  host: `db.${REF}.supabase.co`,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: PASSWORD,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log('Connected!');
  await client.query('DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users');
  console.log('Dropped trigger');
  await client.query('DROP FUNCTION IF EXISTS public.handle_new_user');
  await client.query('DROP FUNCTION IF EXISTS handle_new_user');
  console.log('Dropped functions');
  await client.end();
  console.log('Done! Signup should work now.');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
