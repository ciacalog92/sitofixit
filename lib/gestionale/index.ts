import { mockAdapter } from "./mock";
import { repairdeskAdapter } from "./repairdesk";
import { restAdapter } from "./rest";
import type { GestionaleAdapter } from "./types";

export type { GestionaleAdapter, RefurbishedPhone, Ticket, Stage, Grade } from "./types";

/**
 * Sceglie l'adapter in base alle env var presenti, in ordine di priorità:
 *   1. GESTIONALE_DRIVER esplicito ("mock" | "repairdesk" | "rest")
 *   2. REPAIRDESK_API_KEY → adapter RepairDesk
 *   3. GESTIONALE_BASE_URL + GESTIONALE_API_KEY → adapter REST generico
 *   4. fallback → mock (dati di esempio per sviluppo)
 */
export function getGestionale(): GestionaleAdapter {
  const driver = (process.env.GESTIONALE_DRIVER || "").toLowerCase().trim();

  if (driver === "mock") return mockAdapter;
  if (driver === "repairdesk") return repairdeskAdapter;
  if (driver === "rest") return restAdapter;

  if (process.env.REPAIRDESK_API_KEY) return repairdeskAdapter;
  if (process.env.GESTIONALE_BASE_URL && process.env.GESTIONALE_API_KEY) {
    return restAdapter;
  }
  return mockAdapter;
}
