import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env.local'), 'utf8');
const envVars = {};
for (const line of envContent.split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
}

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  console.log('?? SUPABASE_SERVICE_ROLE_KEY is not set in frontend/.env.local yet.');
  console.log('To confirm or inspect users via CLI, paste your service_role key into frontend/.env.local');
  process.exit(0);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('Error listing users:', error.message);
    return;
  }

  console.log(`Found ${users.length} users in Supabase Auth:`);
  users.forEach((u) => {
    console.log(`- Email: ${u.email}`);
    console.log(`  ID: ${u.id}`);
    console.log(`  Confirmed: ${u.email_confirmed_at ? 'YES (' + u.email_confirmed_at + ')' : 'NO (Unconfirmed - this causes "Invalid login credentials"!)'}`);
  });

  // If user passed --confirm <email>
  const emailArgIndex = process.argv.indexOf('--confirm');
  if (emailArgIndex !== -1 && process.argv[emailArgIndex + 1]) {
    const targetEmail = process.argv[emailArgIndex + 1].trim();
    const found = users.find((u) => u.email?.toLowerCase() === targetEmail.toLowerCase());
    if (found) {
      const { error: updateErr } = await supabase.auth.admin.updateUserById(found.id, {
        email_confirm: true,
      });
      if (updateErr) console.error('Failed to confirm user:', updateErr.message);
      else console.log(`? Successfully confirmed email for "${targetEmail}"! You can now log in.`);
    } else {
      console.log(`User "${targetEmail}" not found in auth list.`);
    }
  }
}

main();
