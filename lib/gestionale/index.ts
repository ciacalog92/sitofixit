import { mockAdapter } from "./mock";
import { repairdeskAdapter } from "./repairdesk";
import { restAdapter } from "./rest";
import { supabaseAdapter } from "./supabase";
import type { GestionaleAdapter } from "./types";

export type { GestionaleAdapter, RefurbishedPhone, Ticket, Stage, Grade } from "./types";

/**
 * Sceglie l'adapter in base alle env var presenti, in ordine di priorità:
 *   1. GESTIONALE_DRIVER esplicito ("mock" | "supabase" | "repairdesk" | "rest")
 *   2. NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY → Supabase
 *   3. REPAIRDESK_API_KEY → RepairDesk
 *   4. GESTIONALE_BASE_URL + GESTIONALE_API_KEY → REST generico
 *   5. fallback → mock (dati di esempio)
 */
export function getGestionale(): GestionaleAdapter {
  const driver = (process.env.GESTIONALE_DRIVER || "").toLowerCase().trim();

  if (driver === "mock") return mockAdapter;
  if (driver === "supabase") return supabaseAdapter;
  if (driver === "repairdesk") return repairdeskAdapter;
  if (driver === "rest") return restAdapter;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)) {
    return supabaseAdapter;
  }
  if (process.env.REPAIRDESK_API_KEY) return repairdeskAdapter;
  if (process.env.GESTIONALE_BASE_URL && process.env.GESTIONALE_API_KEY) {
    return restAdapter;
  }
  return mockAdapter;
}
