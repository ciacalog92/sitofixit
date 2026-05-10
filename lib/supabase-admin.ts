import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase per chiamate server-side.
 *
 * Usa la SERVICE_ROLE_KEY se presente (bypassa le RLS, ideale per
 * route handler e server component che devono leggere tabelle
 * protette come `riparazioni` con dati sensibili dei clienti).
 *
 * Se la service-role non è configurata, fa fallback alla anon key:
 * in quel caso il sito funzionerà solo se le RLS della tabella
 * permettono SELECT a `anon`.
 *
 * ⚠️  Non importare questo modulo da Client Component: la chiave
 * non deve mai finire nel bundle JS del browser.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export const supabaseAdmin = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export const usingServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
