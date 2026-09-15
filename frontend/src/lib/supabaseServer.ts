import { createClient, SupabaseClient } from '@supabase/supabase-js';

if (typeof window !== 'undefined') {
  throw new Error('Security violation: supabaseServer must not be imported in client-side code.');
}

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
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables.');
  }
  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is missing in server environment variables. ' +
      'Administrative write operations require a configured service role key.'
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
 * Verifies that a user access token corresponds to an active, authenticated user
 * and that the user possesses administrative authorization.
 *
 * Checks:
 * 1. Valid token and active user session.
 * 2. User role in app_metadata or user_metadata is 'admin'.
 * 3. OR user email is contained in ADMIN_EMAILS (or default admin@aranyaorganicdairyfarm.com).
 * Any other user is rejected.
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

    const appRole = (user.app_metadata?.role as string) || '';
    const userRole = (user.user_metadata?.role as string) || '';
    const isAdminRole = appRole === 'admin' || userRole === 'admin';

    const adminEmailsEnv = process.env.ADMIN_EMAILS || 'admin@aranyaorganicdairyfarm.com';
    const allowedEmails = adminEmailsEnv
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const userEmail = (user.email || '').toLowerCase();
    const isEmailAllowed = !!userEmail && allowedEmails.includes(userEmail);

    if (!isAdminRole && !isEmailAllowed) {
      return {
        authorized: false,
        error: 'Forbidden: Access denied. Administrative privileges required.',
      };
    }

    return { authorized: true, user };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { authorized: false, error: message };
  }
}
