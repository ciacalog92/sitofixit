import { createClient } from "@supabase/supabase-js";
import { buildStages, STAGE_DEFS } from "./stages";
import type { GestionaleAdapter, Grade, RefurbishedPhone, Ticket } from "./types";

/**
 * Adapter Supabase — legge tickets e ricondizionati da un database Supabase.
 *
 * Variabili richieste:
 *   NEXT_PUBLIC_SUPABASE_URL      URL del progetto (es. https://xxxx.supabase.co)
 *   SUPABASE_SERVICE_ROLE_KEY     chiave service-role (server-only, mai esposta al browser)
 *
 * Variabili opzionali — nomi tabelle/colonne (defaults qui sotto):
 *   SUPABASE_TICKETS_TABLE        default: "tickets"
 *   SUPABASE_REFURB_TABLE         default: "ricondizionati"
 *
 * Schema atteso per la tabella TICKETS:
 *   codice          text  (es. "FX-2056")   ← SUPABASE_TICKET_COL_CODE
 *   device          text
 *   servizio        text                    ← SUPABASE_TICKET_COL_SERVICE
 *   cliente         text                    ← SUPABASE_TICKET_COL_CUSTOMER
 *   stato           text  (es. "repairing") ← SUPABASE_TICKET_COL_STATUS
 *   stima_ritiro    text                    ← SUPABASE_TICKET_COL_ETA
 *   note            text  (nullable)
 *
 * Schema atteso per la tabella RICONDIZIONATI:
 *   id              text/uuid
 *   brand           text
 *   modello         text                    ← SUPABASE_REFURB_COL_MODEL
 *   storage         text
 *   colore          text (nullable)         ← SUPABASE_REFURB_COL_COLOR
 *   prezzo          numeric                 ← SUPABASE_REFURB_COL_PRICE
 *   grado           text  ("A", "A+", "B") ← SUPABASE_REFURB_COL_GRADE
 *   batteria        text  (es. "92%")      ← SUPABASE_REFURB_COL_BATTERY
 *   immagine_url    text (nullable)         ← SUPABASE_REFURB_COL_IMAGE
 *   disponibile     boolean                 ← SUPABASE_REFURB_COL_AVAIL
 *
 * Se i nomi delle colonne nel tuo DB differiscono, impostali via env
 * oppure modificali nelle costanti TICKET_COLS / REFURB_COLS qui sotto.
 */

const env = (k: string, fallback = "") => (process.env[k] ?? fallback).trim();

// --- nomi tabelle -------------------------------------------------------
const TICKETS_TABLE = env("SUPABASE_TICKETS_TABLE", "tickets");
const REFURB_TABLE = env("SUPABASE_REFURB_TABLE", "ricondizionati");

// --- mapping colonne tickets ---------------------------------------------
const TICKET_COLS = {
  code: env("SUPABASE_TICKET_COL_CODE", "codice"),
  device: env("SUPABASE_TICKET_COL_DEVICE", "device"),
  service: env("SUPABASE_TICKET_COL_SERVICE", "servizio"),
  customer: env("SUPABASE_TICKET_COL_CUSTOMER", "cliente"),
  status: env("SUPABASE_TICKET_COL_STATUS", "stato"),
  eta: env("SUPABASE_TICKET_COL_ETA", "stima_ritiro"),
  notes: env("SUPABASE_TICKET_COL_NOTES", "note"),
};

// --- mapping colonne ricondizionati --------------------------------------
const REFURB_COLS = {
  id: env("SUPABASE_REFURB_COL_ID", "id"),
  brand: env("SUPABASE_REFURB_COL_BRAND", "brand"),
  model: env("SUPABASE_REFURB_COL_MODEL", "modello"),
  storage: env("SUPABASE_REFURB_COL_STORAGE", "storage"),
  color: env("SUPABASE_REFURB_COL_COLOR", "colore"),
  price: env("SUPABASE_REFURB_COL_PRICE", "prezzo"),
  grade: env("SUPABASE_REFURB_COL_GRADE", "grado"),
  battery: env("SUPABASE_REFURB_COL_BATTERY", "batteria"),
  image: env("SUPABASE_REFURB_COL_IMAGE", "immagine_url"),
  available: env("SUPABASE_REFURB_COL_AVAIL", "disponibile"),
};

// --- mappa stato testuale → indice fase ---------------------------------
const STATUS_MAP: Record<string, number> = {
  received: 0, "preso in carico": 0, ricezione: 0,
  diagnosis: 1, diagnosi: 1, "in diagnosi": 1,
  quote: 2, preventivo: 2, "preventivo inviato": 2,
  approved: 3, approvato: 3, "preventivo approvato": 3,
  repairing: 4, "in riparazione": 4, "in lavorazione": 4,
  qc: 5, "test qc": 5, collaudo: 5,
  ready: 6, pronto: 6, "pronto per il ritiro": 6,
  delivered: 7, consegnato: 7, completato: 7,
};

function statusToIndex(s: string | null | undefined): number {
  if (!s) return 0;
  const k = s.toLowerCase().trim();
  if (k in STATUS_MAP) return STATUS_MAP[k];
  const i = STAGE_DEFS.findIndex((d) => d.id === k);
  return i >= 0 ? i : 0;
}

function gradeOf(v: unknown): Grade {
  const s = String(v ?? "").toUpperCase().replace(/\s+/g, "");
  if (s === "A+" || s === "APLUS") return "A+";
  if (s === "B") return "B";
  return "A";
}

function getSupabaseClient() {
  const url = env("NEXT_PUBLIC_SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_ANON_KEY");
  if (!url || !key) throw new Error("Supabase non configurato (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY mancanti).");
  return createClient(url, key, { auth: { persistSession: false } });
}

export const supabaseAdapter: GestionaleAdapter = {
  name: "supabase",

  async getTicket(code) {
    let supabase;
    try { supabase = getSupabaseClient(); } catch { return null; }

    const { data, error } = await supabase
      .from(TICKETS_TABLE)
      .select("*")
      .eq(TICKET_COLS.code, code)
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    const ticket: Ticket = {
      code: String(data[TICKET_COLS.code] ?? code),
      device: String(data[TICKET_COLS.device] ?? "—"),
      service: String(data[TICKET_COLS.service] ?? "—"),
      customer: String(data[TICKET_COLS.customer] ?? "—"),
      estimatedReady: String(data[TICKET_COLS.eta] ?? "—"),
      notes: data[TICKET_COLS.notes] ? String(data[TICKET_COLS.notes]) : null,
      stages: buildStages(statusToIndex(data[TICKET_COLS.status] as string)),
    };
    return ticket;
  },

  async listRefurbished() {
    let supabase;
    try { supabase = getSupabaseClient(); } catch { return []; }

    const { data, error } = await supabase
      .from(REFURB_TABLE)
      .select("*")
      .eq(REFURB_COLS.available, true)
      .order(REFURB_COLS.brand, { ascending: true });

    if (error || !data) return [];

    return data.map((row): RefurbishedPhone => {
      const price = Number(row[REFURB_COLS.price] ?? 0);
      return {
        id: String(row[REFURB_COLS.id] ?? crypto.randomUUID()),
        brand: String(row[REFURB_COLS.brand] ?? "—"),
        model: String(row[REFURB_COLS.model] ?? "—"),
        storage: String(row[REFURB_COLS.storage] ?? ""),
        color: row[REFURB_COLS.color] ? String(row[REFURB_COLS.color]) : undefined,
        price: Number.isFinite(price) ? price : 0,
        priceLabel: price ? `€ ${Math.round(price)}` : undefined,
        grade: gradeOf(row[REFURB_COLS.grade]),
        battery: String(row[REFURB_COLS.battery] ?? "—"),
        imageUrl: row[REFURB_COLS.image] ? String(row[REFURB_COLS.image]) : null,
        available: true,
      };
    });
  },
};
