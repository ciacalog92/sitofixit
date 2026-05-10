import { buildStages } from "./stages";
import type { GestionaleAdapter, RefurbishedPhone, Ticket } from "./types";

const TICKETS: Record<
  string,
  Omit<Ticket, "stages"> & { currentStageIndex: number }
> = {
  "FX-1001": {
    code: "FX-1001",
    device: "iPhone 13 Pro",
    service: "Sostituzione schermo OLED",
    customer: "M. R.",
    estimatedReady: "Oggi · 18:30",
    notes: "Ricambio originale Apple.",
    currentStageIndex: 4,
  },
  "FX-2056": {
    code: "FX-2056",
    device: "Samsung Galaxy S22",
    service: "Sostituzione batteria",
    customer: "L. B.",
    estimatedReady: "Domani · 11:00",
    notes: null,
    currentStageIndex: 3,
  },
  "FX-3120": {
    code: "FX-3120",
    device: "MacBook Air M2",
    service: "Recupero dati SSD",
    customer: "G. T.",
    estimatedReady: "Tra 48h",
    notes: "In attesa approvazione cliente.",
    currentStageIndex: 1,
  },
  "FX-4099": {
    code: "FX-4099",
    device: "iPad Air 5",
    service: "Sostituzione vetro + LCD",
    customer: "S. P.",
    estimatedReady: "Pronto · oggi",
    notes: null,
    currentStageIndex: 6,
  },
  "FX-5050": {
    code: "FX-5050",
    device: "Xiaomi Mi 11",
    service: "Microsaldatura IC carica",
    customer: "A. F.",
    estimatedReady: "Consegnato",
    notes: null,
    currentStageIndex: 7,
  },
};

const REFURB: RefurbishedPhone[] = [
  { id: "iph13-128-bk", brand: "Apple", model: "iPhone 13", storage: "128GB", price: 519, grade: "A+", battery: "92%", available: true },
  { id: "iph12pro-256-gr", brand: "Apple", model: "iPhone 12 Pro", storage: "256GB", price: 599, grade: "A", battery: "88%", available: true },
  { id: "sgs22-128-bk", brand: "Samsung", model: "Galaxy S22", storage: "128GB", price: 379, grade: "A", battery: "90%", available: true },
  { id: "iph14-128-mid", brand: "Apple", model: "iPhone 14", storage: "128GB", price: 679, grade: "A+", battery: "95%", available: true },
  { id: "pixel7-128-ob", brand: "Google", model: "Pixel 7", storage: "128GB", price: 349, grade: "A", battery: "89%", available: true },
  { id: "sgs23u-256-bk", brand: "Samsung", model: "Galaxy S23 Ultra", storage: "256GB", price: 829, grade: "A+", battery: "94%", available: true },
];

export const mockAdapter: GestionaleAdapter = {
  name: "mock",

  async getTicket(code) {
    const t = TICKETS[code];
    if (!t) return null;
    // simula latenza gestionale
    await new Promise((r) => setTimeout(r, 250));
    const { currentStageIndex, ...rest } = t;
    return { ...rest, stages: buildStages(currentStageIndex) };
  },

  async listRefurbished() {
    await new Promise((r) => setTimeout(r, 150));
    return REFURB.filter((p) => p.available);
  },
};
