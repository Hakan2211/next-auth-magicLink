// lib/supabaseClientAdmin.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAdminKey) {
  throw new Error(
    'Supabase environment variables are missing. Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
  );
}

// Admin Supabase client for server-side operations (elevated privileges)
export const supabaseAdmin = createClient(supabaseUrl, supabaseAdminKey);
