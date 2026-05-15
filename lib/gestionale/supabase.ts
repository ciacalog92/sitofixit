import { supabaseAdmin as supabase } from "../supabase-admin";
import { buildStages } from "./stages";
import type {
  GestionaleAdapter,
  Grade,
  RefurbishedPhone,
  Ticket,
  TicketOutcome,
} from "./types";

/**
 * Adapter Supabase per Fixit (schema reale).
 *
 * Tabelle coinvolte:
 *   riparazioni  ← pratica/ticket (codice = numero_pratica, es. "LAB-2026-0011")
 *   clienti       ← FK riparazioni.cliente_id
 *   dispositivi   ← FK riparazioni.dispositivo_id
 *   ricondizionati (opzionale, per la pagina /ricondizionati)
 *
 * Variabili richieste in `.env.local`:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Le RLS policy su Supabase devono permettere SELECT pubblico
 * sulle righe esposte (oppure usa SUPABASE_SERVICE_ROLE_KEY lato server).
 */

// === STATO → INDICE FASE ====================================================
// Le 8 fasi della UI sono:
//  0 ricezione · 1 diagnosi · 2 preventivo · 3 approvato
//  4 in riparazione · 5 qc · 6 pronto · 7 consegnato
// Enum DB `stato_riparazione`:
//   accettato | in_diagnosi | in_riparazione | in_attesa_ricambi
//   | pronto | consegnato | non_riparabile | annullato
const STATO_TO_INDEX: Record<string, number> = {
  // ── Accettazione / ricezione
  accettato: 0,
  in_attesa: 0,
  ricevuto: 0,

  // ── Diagnosi
  in_diagnosi: 1,
  diagnosi: 1,

  // ── Preventivo / approvazione (non in enum DB ma supportati per compat)
  preventivo: 2,
  preventivato: 2,
  approvato: 3,

  // ── Riparazione in corso (incluso attesa ricambi: per il cliente è "in lavorazione")
  in_riparazione: 4,
  in_lavorazione: 4,
  in_attesa_ricambi: 4,

  // ── QC / test
  in_test: 5,

  // ── Pronto al ritiro
  pronto: 6,

  // ── Consegnato
  consegnato: 7,

  // ── Stati terminali speciali (gestiti via outcome, l'indice è solo indicativo)
  non_riparabile: 1,
  annullato: 0,
};

function statoToIndex(stato: string | null | undefined): number {
  if (!stato) return 0;
  const k = stato.toLowerCase().trim();
  return k in STATO_TO_INDEX ? STATO_TO_INDEX[k] : 0;
}

function outcomeFor(stato: string | null | undefined): TicketOutcome {
  switch ((stato ?? "").toLowerCase()) {
    case "non_riparabile":
      return "not_repairable";
    case "annullato":
      return "cancelled";
    case "consegnato":
      return "delivered";
    default:
      return "in_progress";
  }
}

// === FORMATTAZIONE DATE/CAMPI ==============================================
function formatDate(d: string | null | undefined): string {
  if (!d) return "—";
  // Supabase può restituire "2026-05-08" o ISO. Accetto entrambi.
  const parsed = new Date(d);
  if (Number.isNaN(parsed.getTime())) return d;
  return parsed.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function joinNonEmpty(parts: Array<string | null | undefined>, sep = " "): string {
  return parts.map((p) => (p ?? "").trim()).filter(Boolean).join(sep);
}

type ClienteRow = {
  nome?: string | null;
  cognome?: string | null;
  ragione_sociale?: string | null;
  full_name?: string | null;
};
type DispositivoRow = {
  marca?: string | null;
  brand?: string | null;
  produttore?: string | null;
  modello?: string | null;
  model?: string | null;
  colore?: string | null;
  storage?: string | null;
};

function formatCliente(c: ClienteRow | null | undefined, fallback: string): string {
  if (!c) return fallback;
  if (c.full_name) return String(c.full_name);
  if (c.ragione_sociale) return String(c.ragione_sociale);
  // privacy: mostriamo solo iniziali del cognome
  const nome = (c.nome ?? "").trim();
  const cognome = (c.cognome ?? "").trim();
  if (nome && cognome) return `${nome} ${cognome[0]}.`;
  return joinNonEmpty([nome, cognome]) || fallback;
}

function formatDispositivo(
  d: DispositivoRow | null | undefined,
  fallback: string,
): string {
  if (!d) return fallback;
  const brand = d.marca ?? d.brand ?? d.produttore ?? "";
  const model = d.modello ?? d.model ?? "";
  const out = joinNonEmpty([brand, model]) || fallback;
  return out;
}

// === RIPARAZIONI ============================================================
type RiparazioneRow = {
  id: string;
  numero_pratica: string;
  cliente_id: string | null;
  dispositivo_id: string | null;
  stato: string | null;
  priorita: "normale" | "urgente" | null;
  problema_dichiarato: string | null;
  diagnosi: string | null;
  intervento_effettuato: string | null;
  preventivo_euro: number | string | null;
  costo_finale_euro: number | string | null;
  data_prevista_consegna: string | null;
  data_consegna: string | null;
  garanzia_giorni: number | null;
  // Relazioni embed (Supabase FK)
  clienti?: ClienteRow | null;
  dispositivi?: DispositivoRow | null;
};

// Tenta select con embed FK; se fallisce (FK non definita), retry senza embed
async function fetchRiparazione(code: string): Promise<RiparazioneRow | null> {
  const SELECT_WITH_REL =
    "*, clienti(nome, cognome, ragione_sociale), dispositivi(marca, modello, colore, storage)";
  const SELECT_PLAIN = "*";

  let res = await supabase
    .from("riparazioni")
    .select(SELECT_WITH_REL)
    .eq("numero_pratica", code)
    .maybeSingle();

  if (res.error) {
    // FK probabilmente non definita o RLS che blocca le tabelle correlate
    res = await supabase
      .from("riparazioni")
      .select(SELECT_PLAIN)
      .eq("numero_pratica", code)
      .maybeSingle();
  }

  if (res.error || !res.data) return null;
  return res.data as unknown as RiparazioneRow;
}

function num(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

// === ADAPTER ===============================================================
export const supabaseAdapter: GestionaleAdapter = {
  name: "supabase",

  async getTicket(code) {
    const row = await fetchRiparazione(code);
    if (!row) return null;

    const customer = formatCliente(row.clienti, "Cliente");
    const device = formatDispositivo(row.dispositivi, "Dispositivo");
    const stato = row.stato ?? "";
    const outcome = outcomeFor(stato);

    // ETA: se consegnato, mostra la data di consegna; altrimenti la prevista
    const eta =
      outcome === "delivered"
        ? `Consegnato · ${formatDate(row.data_consegna ?? row.data_prevista_consegna)}`
        : outcome === "not_repairable"
          ? "Device non riparabile"
          : outcome === "cancelled"
            ? "Pratica annullata"
            : row.data_prevista_consegna
              ? `Prevista · ${formatDate(row.data_prevista_consegna)}`
              : "In definizione";

    // Note: preferiamo l'intervento effettuato, poi la diagnosi
    const notes =
      (row.intervento_effettuato && String(row.intervento_effettuato).trim()) ||
      (row.diagnosi && String(row.diagnosi).trim()) ||
      null;

    const ticket: Ticket = {
      code: row.numero_pratica,
      device,
      service:
        row.problema_dichiarato?.trim() ||
        row.intervento_effettuato?.trim() ||
        "Riparazione in corso",
      customer,
      estimatedReady: eta,
      notes,
      stages: buildStages(statoToIndex(stato)),
      outcome,
      priority: row.priorita ?? undefined,
      quoteEur: num(row.preventivo_euro),
      finalEur: num(row.costo_finale_euro),
      warrantyDays: row.garanzia_giorni ?? null,
    };
    return ticket;
  },

  async listRefurbished() {
    // Tabella opzionale: se non esiste, restituisco lista vuota.
    const { data, error } = await supabase
      .from("ricondizionati")
      .select("*")
      .eq("disponibile", true);

    if (error || !data) return [];

    return data.map((r): RefurbishedPhone => {
      const price = Number(r.prezzo ?? r.price ?? 0);
      const grade = String(r.grado ?? r.grade ?? "A").toUpperCase().replace(/\s+/g, "");
      return {
        id: String(r.id ?? crypto.randomUUID()),
        brand: String(r.brand ?? r.marca ?? "—"),
        model: String(r.modello ?? r.model ?? "—"),
        storage: String(r.storage ?? ""),
        color: r.colore || r.color || undefined,
        price: Number.isFinite(price) ? price : 0,
        priceLabel: price ? `€ ${Math.round(price)}` : undefined,
        grade: (grade === "A+" ? "A+" : grade === "B" ? "B" : "A") as Grade,
        battery: String(r.batteria ?? r.battery ?? "—"),
        imageUrl: r.immagine_url ?? r.image_url ?? null,
        available: true,
      };
    });
  },
};
