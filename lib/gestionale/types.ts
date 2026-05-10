// Tipi condivisi tra UI e adapter del gestionale.

export type StageStatus = "done" | "active" | "pending";

export type Stage = {
  id: string;
  label: string;
  description: string;
  status: StageStatus;
};

export type TicketOutcome =
  | "in_progress"
  | "delivered"
  | "not_repairable"
  | "cancelled";

export type Ticket = {
  code: string;
  device: string;
  service: string;
  customer: string;
  estimatedReady: string;
  notes: string | null;
  stages: Stage[];
  outcome?: TicketOutcome;
  priority?: "normale" | "urgente";
  quoteEur?: number | null;
  finalEur?: number | null;
  warrantyDays?: number | null;
};

export type Grade = "A+" | "A" | "B";

export type RefurbishedPhone = {
  id: string;
  brand: string;
  model: string;
  storage: string;
  color?: string;
  price: number;             // euro, intero (es. 519)
  priceLabel?: string;       // override formattato (es. "€ 519")
  grade: Grade;
  battery: string;           // es. "92%"
  imageUrl?: string | null;
  available: boolean;
};

export type GestionaleAdapter = {
  name: string;
  /** Recupera lo stato di una pratica per codice (es. FX-2056). Null se non trovata. */
  getTicket(code: string): Promise<Ticket | null>;
  /** Catalogo smartphone ricondizionati attualmente disponibili. */
  listRefurbished(): Promise<RefurbishedPhone[]>;
};
