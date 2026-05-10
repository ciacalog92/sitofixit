import { buildStages, STAGE_DEFS } from "./stages";
import type { GestionaleAdapter, Grade, RefurbishedPhone, Ticket } from "./types";

/**
 * Adapter REST configurabile via environment.
 *
 * Pensato per gestionali con API HTTPS + token (RepairDesk, RepairShopr,
 * Syncro, gestionali custom italiani con REST). Mappa i campi del JSON
 * remoto sui tipi interni del sito.
 *
 * Variabili supportate:
 *   GESTIONALE_BASE_URL          es. https://api.repairdesk.co/api/web/v1
 *   GESTIONALE_API_KEY           token bearer / api key
 *   GESTIONALE_AUTH_HEADER       header in cui mettere il token (default: Authorization)
 *   GESTIONALE_AUTH_PREFIX       prefisso del token (default: "Bearer ")
 *   GESTIONALE_TICKET_PATH       path lookup ticket; "{code}" = placeholder. Default: /tickets?ticket_no={code}
 *   GESTIONALE_REFURB_PATH       path lista ricondizionati. Default: /inventory?type=refurbished
 *
 * I JSONPath di mapping si trovano poco sotto: TICKET_FIELDS / REFURB_FIELDS.
 * Se il tuo gestionale risponde con campi diversi, modifica solo le costanti
 * di mapping — il resto della logica resta invariato.
 */

const env = (k: string, fallback?: string) =>
  (process.env[k] ?? fallback ?? "").trim();

function getJSON(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null) return undefined;
    if (Array.isArray(acc) && /^\d+$/.test(key)) return acc[Number(key)];
    if (typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

function asString(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return fallback;
}

function asNumber(v: unknown, fallback = 0): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const cleaned = v.replace(/[^\d.,-]/g, "").replace(",", ".");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function asBoolean(v: unknown, fallback = true): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return ["1", "true", "yes", "y", "si", "sì"].includes(v.toLowerCase());
  if (typeof v === "number") return v > 0;
  return fallback;
}

// Mapping tipico RepairDesk-like. Sovrascrivibile via env JSON.
const TICKET_FIELDS = {
  root: "data",
  code: "ticket_no",
  device: "device_name",
  service: "issue_summary",
  customer: "customer.name",
  estimatedReady: "estimated_completion",
  notes: "notes",
  status: "status",
};

const REFURB_FIELDS = {
  list: "data",
  id: "id",
  brand: "brand",
  model: "model",
  storage: "storage",
  color: "color",
  price: "price",
  grade: "grade",
  battery: "battery_health",
  imageUrl: "image_url",
  available: "in_stock",
};

// Mappa lo "status" del gestionale al nostro indice di fase.
const STATUS_TO_INDEX: Record<string, number> = {
  received: 0, "in ricezione": 0, "preso in carico": 0,
  diagnosis: 1, "in diagnosi": 1, diagnosing: 1,
  quote: 2, "preventivo inviato": 2, quoted: 2,
  approved: 3, "preventivo approvato": 3,
  repairing: 4, "in riparazione": 4, "in lavorazione": 4,
  qc: 5, "test": 5, testing: 5, "controllo qualita": 5,
  ready: 6, "pronto": 6, "pronto per il ritiro": 6,
  delivered: 7, consegnato: 7, "ritirato": 7, completato: 7, completed: 7,
};

function statusToIndex(s: string): number {
  if (!s) return 0;
  const k = s.toLowerCase().trim();
  if (k in STATUS_TO_INDEX) return STATUS_TO_INDEX[k];
  // fallback: prova a matchare un id stage diretto
  const i = STAGE_DEFS.findIndex((d) => d.id === k);
  return i >= 0 ? i : 0;
}

function gradeOf(v: unknown): Grade {
  const s = asString(v).toUpperCase().replace(/\s+/g, "");
  if (s === "A+") return "A+";
  if (s === "B") return "B";
  return "A";
}

async function callGestionale(path: string): Promise<unknown> {
  const baseUrl = env("GESTIONALE_BASE_URL");
  const apiKey = env("GESTIONALE_API_KEY");
  if (!baseUrl || !apiKey) {
    throw new Error("Gestionale REST non configurato (GESTIONALE_BASE_URL/GESTIONALE_API_KEY mancanti).");
  }
  const url = `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
  const headerName = env("GESTIONALE_AUTH_HEADER", "Authorization");
  const headerPrefix = env("GESTIONALE_AUTH_PREFIX", "Bearer ");

  const res = await fetch(url, {
    headers: {
      [headerName]: `${headerPrefix}${apiKey}`,
      Accept: "application/json",
    },
    cache: "no-store",
    // 5s timeout via AbortSignal (Node 18+ runtime)
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) {
    throw new Error(`Gestionale ${res.status} su ${path}`);
  }
  return res.json();
}

export const restAdapter: GestionaleAdapter = {
  name: "rest",

  async getTicket(code) {
    const path = env(
      "GESTIONALE_TICKET_PATH",
      "/tickets?ticket_no={code}",
    ).replace("{code}", encodeURIComponent(code));

    let payload: unknown;
    try {
      payload = await callGestionale(path);
    } catch {
      return null;
    }

    // Il root può essere un singolo oggetto oppure un array
    let raw: unknown = TICKET_FIELDS.root
      ? getJSON(payload, TICKET_FIELDS.root)
      : payload;
    if (Array.isArray(raw)) raw = raw[0];
    if (!raw || typeof raw !== "object") return null;

    const codeOut = asString(getJSON(raw, TICKET_FIELDS.code), code);
    const ticket: Ticket = {
      code: codeOut,
      device: asString(getJSON(raw, TICKET_FIELDS.device), "—"),
      service: asString(getJSON(raw, TICKET_FIELDS.service), "—"),
      customer: asString(getJSON(raw, TICKET_FIELDS.customer), "—"),
      estimatedReady: asString(getJSON(raw, TICKET_FIELDS.estimatedReady), "—"),
      notes: asString(getJSON(raw, TICKET_FIELDS.notes), "") || null,
      stages: buildStages(statusToIndex(asString(getJSON(raw, TICKET_FIELDS.status)))),
    };
    return ticket;
  },

  async listRefurbished() {
    const path = env("GESTIONALE_REFURB_PATH", "/inventory?type=refurbished");

    let payload: unknown;
    try {
      payload = await callGestionale(path);
    } catch {
      return [];
    }

    const list = REFURB_FIELDS.list
      ? getJSON(payload, REFURB_FIELDS.list)
      : payload;
    if (!Array.isArray(list)) return [];

    return list.map((r): RefurbishedPhone => {
      const price = asNumber(getJSON(r, REFURB_FIELDS.price));
      return {
        id: asString(getJSON(r, REFURB_FIELDS.id), crypto.randomUUID()),
        brand: asString(getJSON(r, REFURB_FIELDS.brand), "—"),
        model: asString(getJSON(r, REFURB_FIELDS.model), "—"),
        storage: asString(getJSON(r, REFURB_FIELDS.storage), ""),
        color: asString(getJSON(r, REFURB_FIELDS.color), "") || undefined,
        price,
        priceLabel: price ? `€ ${price}` : undefined,
        grade: gradeOf(getJSON(r, REFURB_FIELDS.grade)),
        battery: asString(getJSON(r, REFURB_FIELDS.battery), "—"),
        imageUrl: asString(getJSON(r, REFURB_FIELDS.imageUrl), "") || null,
        available: asBoolean(getJSON(r, REFURB_FIELDS.available), true),
      };
    });
  },
};
