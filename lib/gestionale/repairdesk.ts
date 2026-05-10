import { buildStages } from "./stages";
import type { GestionaleAdapter, Grade, RefurbishedPhone, Ticket } from "./types";

/**
 * Adapter pre-configurato per RepairDesk.
 *
 * Variabili richieste:
 *   REPAIRDESK_API_KEY       chiave api dal pannello RepairDesk → Settings → API
 *   REPAIRDESK_BASE_URL      opzionale, default https://api.repairdesk.co/api/web/v1
 *
 * RepairDesk usa la query string "?api_key=..." (non un header bearer).
 * Doc: https://api.repairdesk.co/
 */

const BASE = (process.env.REPAIRDESK_BASE_URL || "https://api.repairdesk.co/api/web/v1").replace(/\/+$/, "");
const KEY = process.env.REPAIRDESK_API_KEY || "";

async function rd<T>(path: string): Promise<T | null> {
  if (!KEY) return null;
  const sep = path.includes("?") ? "&" : "?";
  const url = `${BASE}${path}${sep}api_key=${encodeURIComponent(KEY)}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// RepairDesk → indice fase
function rdStatusToIndex(s: string | undefined): number {
  if (!s) return 0;
  const k = s.toLowerCase();
  if (k.includes("complete") || k.includes("delivered") || k.includes("picked")) return 7;
  if (k.includes("ready")) return 6;
  if (k.includes("test") || k.includes("qc")) return 5;
  if (k.includes("repair") || k.includes("progress")) return 4;
  if (k.includes("approved") || k.includes("accepted")) return 3;
  if (k.includes("quote") || k.includes("estimate")) return 2;
  if (k.includes("diagn")) return 1;
  return 0;
}

function rdGrade(v: unknown): Grade {
  const s = String(v ?? "").toUpperCase().replace(/\s+/g, "");
  if (s === "A+" || s === "APLUS") return "A+";
  if (s === "B") return "B";
  return "A";
}

type RDTicketResp = {
  data?: {
    ticket?: {
      ticket_no?: string;
      device?: { name?: string; manufacturer?: string };
      issue?: string;
      customer?: { full_name?: string; first_name?: string; last_name?: string };
      estimated_completion?: string;
      due_date?: string;
      status_name?: string;
      status?: string;
      private_notes?: string;
      notes?: string;
    };
  };
};

type RDInventoryResp = {
  data?: Array<{
    id?: string | number;
    name?: string;
    manufacturer?: { name?: string } | string;
    model?: string;
    sku?: string;
    storage?: string;
    color?: string;
    price?: number | string;
    retail_price?: number | string;
    custom_fields?: { grade?: string; battery_health?: string };
    grade?: string;
    battery_health?: string;
    image_url?: string;
    photo?: string;
    quantity?: number;
    in_stock?: boolean;
  }>;
};

export const repairdeskAdapter: GestionaleAdapter = {
  name: "repairdesk",

  async getTicket(code) {
    const r = await rd<RDTicketResp>(`/tickets?ticket_no=${encodeURIComponent(code)}`);
    const t = r?.data?.ticket;
    if (!t) return null;

    const customer =
      t.customer?.full_name ||
      [t.customer?.first_name, t.customer?.last_name].filter(Boolean).join(" ") ||
      "—";

    const ticket: Ticket = {
      code: t.ticket_no ?? code,
      device: t.device?.name ?? [t.device?.manufacturer, t.device?.name].filter(Boolean).join(" ") ?? "—",
      service: t.issue ?? "—",
      customer: customer || "—",
      estimatedReady: t.estimated_completion ?? t.due_date ?? "—",
      notes: t.private_notes ?? t.notes ?? null,
      stages: buildStages(rdStatusToIndex(t.status_name ?? t.status)),
    };
    return ticket;
  },

  async listRefurbished() {
    // RepairDesk: filtra inventory per categoria/etichetta "refurbished".
    // Se l'azienda usa una categoria custom, sovrascrivi l'env REPAIRDESK_REFURB_PATH.
    const path = process.env.REPAIRDESK_REFURB_PATH || "/inventory?category=refurbished";
    const r = await rd<RDInventoryResp>(path);
    const list = r?.data ?? [];

    return list
      .filter((row) => (row.in_stock ?? (row.quantity ?? 0) > 0))
      .map((row): RefurbishedPhone => {
        const brand =
          typeof row.manufacturer === "string"
            ? row.manufacturer
            : row.manufacturer?.name ?? "—";
        const price = Number(row.price ?? row.retail_price ?? 0);
        return {
          id: String(row.id ?? row.sku ?? `${brand}-${row.model ?? row.name}`),
          brand,
          model: row.model ?? row.name ?? "—",
          storage: row.storage ?? "",
          color: row.color || undefined,
          price: Number.isFinite(price) ? price : 0,
          priceLabel: price ? `€ ${Math.round(price)}` : undefined,
          grade: rdGrade(row.custom_fields?.grade ?? row.grade),
          battery: row.custom_fields?.battery_health ?? row.battery_health ?? "—",
          imageUrl: row.image_url ?? row.photo ?? null,
          available: true,
        };
      });
  },
};
