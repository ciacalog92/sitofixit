import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Stage = {
  id: string;
  label: string;
  description: string;
};

const STAGES: Stage[] = [
  { id: "received", label: "Ricezione device", description: "Il dispositivo è stato preso in carico." },
  { id: "diagnosis", label: "Diagnosi tecnica", description: "Stiamo analizzando il problema." },
  { id: "quote", label: "Preventivo", description: "Preventivo inviato al cliente." },
  { id: "approved", label: "Approvato", description: "Preventivo approvato, ricambi in arrivo." },
  { id: "repairing", label: "Riparazione in corso", description: "I tecnici stanno intervenendo sul device." },
  { id: "qc", label: "Test & QC", description: "Quality check finale e collaudo." },
  { id: "ready", label: "Pronto per il ritiro", description: "Vieni a ritirarlo o richiedi spedizione." },
  { id: "delivered", label: "Consegnato", description: "Riparazione conclusa." },
];

type Ticket = {
  code: string;
  device: string;
  service: string;
  customer: string;
  estimatedReady: string;
  currentStageIndex: number;
  notes?: string;
};

const TICKETS: Record<string, Ticket> = {
  "FX-1001": {
    code: "FX-1001",
    device: "iPhone 13 Pro",
    service: "Sostituzione schermo OLED",
    customer: "M. R.",
    estimatedReady: "Oggi · 18:30",
    currentStageIndex: 4,
    notes: "Ricambio originale Apple.",
  },
  "FX-2056": {
    code: "FX-2056",
    device: "Samsung Galaxy S22",
    service: "Sostituzione batteria",
    customer: "L. B.",
    estimatedReady: "Domani · 11:00",
    currentStageIndex: 3,
  },
  "FX-3120": {
    code: "FX-3120",
    device: "MacBook Air M2",
    service: "Recupero dati SSD",
    customer: "G. T.",
    estimatedReady: "Tra 48h",
    currentStageIndex: 1,
    notes: "In attesa approvazione cliente.",
  },
  "FX-4099": {
    code: "FX-4099",
    device: "iPad Air 5",
    service: "Sostituzione vetro + LCD",
    customer: "S. P.",
    estimatedReady: "Pronto · oggi",
    currentStageIndex: 6,
  },
  "FX-5050": {
    code: "FX-5050",
    device: "Xiaomi Mi 11",
    service: "Microsaldatura IC carica",
    customer: "A. F.",
    estimatedReady: "Consegnato",
    currentStageIndex: 7,
  },
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const codeRaw = url.searchParams.get("code") ?? "";
  const code = codeRaw.trim().toUpperCase();

  if (!code) {
    return NextResponse.json(
      { ok: false, error: "Inserisci un codice pratica." },
      { status: 400 },
    );
  }

  if (!/^FX-\d{3,5}$/.test(code)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Formato codice non valido. Usa il formato FX-XXXX (es. FX-2056).",
      },
      { status: 400 },
    );
  }

  // Simula latenza gestionale
  await new Promise((r) => setTimeout(r, 350));

  const ticket = TICKETS[code];
  if (!ticket) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Nessuna pratica trovata con questo codice. Verifica il codice riportato sulla ricevuta.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    ticket: {
      code: ticket.code,
      device: ticket.device,
      service: ticket.service,
      customer: ticket.customer,
      estimatedReady: ticket.estimatedReady,
      notes: ticket.notes ?? null,
      stages: STAGES.map((s, i) => ({
        ...s,
        status:
          i < ticket.currentStageIndex
            ? "done"
            : i === ticket.currentStageIndex
              ? "active"
              : "pending",
      })),
    },
  });
}
