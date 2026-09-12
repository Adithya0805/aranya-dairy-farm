import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let cachedAdminClient: SupabaseClient | null = null;

/**
 * Returns a Supabase client authenticated with the SERVICE_ROLE key.
 * Used strictly in Server Actions and server-side routes to bypass RLS
 * for authorized administrative operations.
 */
export function getAdminClient(): SupabaseClient {
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined in .env.local');
  }
  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is missing in .env.local. ' +
      'Please add your service_role key to frontend/.env.local to enable admin write operations.'
    );
  }

  if (!cachedAdminClient) {
    cachedAdminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return cachedAdminClient;
}

/**
 * Verifies that a user access token corresponds to an active, authenticated user.
 */
export async function verifyAdminUser(token?: string) {
  if (!token) {
    return { authorized: false, error: 'No authorization token provided.' };
  }

  try {
    const admin = getAdminClient();
    const { data: { user }, error } = await admin.auth.getUser(token);

    if (error || !user) {
      return { authorized: false, error: error?.message || 'Invalid or expired session.' };
    }

    return { authorized: true, user };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { authorized: false, error: message };
  }
}
