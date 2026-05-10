import type { Stage, StageStatus } from "./types";

export const STAGE_DEFS: Omit<Stage, "status">[] = [
  { id: "received", label: "Ricezione device", description: "Il dispositivo è stato preso in carico." },
  { id: "diagnosis", label: "Diagnosi tecnica", description: "Stiamo analizzando il problema." },
  { id: "quote", label: "Preventivo", description: "Preventivo inviato al cliente." },
  { id: "approved", label: "Approvato", description: "Preventivo approvato, ricambi in arrivo." },
  { id: "repairing", label: "Riparazione in corso", description: "I tecnici stanno intervenendo sul device." },
  { id: "qc", label: "Test & QC", description: "Quality check finale e collaudo." },
  { id: "ready", label: "Pronto per il ritiro", description: "Vieni a ritirarlo o richiedi spedizione." },
  { id: "delivered", label: "Consegnato", description: "Riparazione conclusa." },
];

export function buildStages(currentIndex: number): Stage[] {
  return STAGE_DEFS.map((s, i) => ({
    ...s,
    status: (i < currentIndex
      ? "done"
      : i === currentIndex
        ? "active"
        : "pending") as StageStatus,
  }));
}
