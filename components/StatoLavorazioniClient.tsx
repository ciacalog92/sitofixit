"use client";

import { useState, type FormEvent } from "react";
import { SearchIcon, CheckIcon, ClockIcon } from "./icons";

type Stage = {
  id: string;
  label: string;
  description: string;
  status: "done" | "active" | "pending";
};

type Ticket = {
  code: string;
  device: string;
  service: string;
  customer: string;
  estimatedReady: string;
  notes: string | null;
  stages: Stage[];
};

type ApiResponse =
  | { ok: true; ticket: Ticket }
  | { ok: false; error: string };

export function StatoLavorazioniClient() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setTicket(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/stato?code=${encodeURIComponent(code)}`, {
        cache: "no-store",
      });
      const data: ApiResponse = await res.json();
      if (!data.ok) {
        setError(data.error);
      } else {
        setTicket(data.ticket);
      }
    } catch {
      setError("Errore di connessione al gestionale. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={onSubmit}
        className="card flex flex-col gap-4 sm:flex-row sm:items-end"
        noValidate
      >
        <div className="flex-1">
          <label htmlFor="code" className="block text-sm font-medium text-white/80">
            Codice pratica
          </label>
          <div className="relative mt-2">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/50">
              <SearchIcon />
            </span>
            <input
              id="code"
              name="code"
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="es. FX-2056"
              className="w-full min-h-[48px] rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-base text-white placeholder:text-white/35 focus:border-neon-cyan/60 focus:outline-none focus:ring-2 focus:ring-neon-cyan/40"
              aria-invalid={!!error}
              aria-describedby={error ? "code-error" : "code-hint"}
            />
          </div>
          <p id="code-hint" className="mt-2 text-xs text-white/50">
            Formato: FX-XXXX. Lo trovi sulla ricevuta o nell&apos;email di
            apertura pratica.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading || code.trim().length === 0}
          className="btn-neon w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifica…" : "Verifica stato"}
        </button>
      </form>

      {error && (
        <div
          id="code-error"
          role="alert"
          className="rounded-xl border border-neon-pink/40 bg-neon-pink/5 p-4 text-sm text-neon-pink"
        >
          {error}
        </div>
      )}

      {ticket && <TicketView ticket={ticket} />}

      {!ticket && !error && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/60">
          <p className="font-medium text-white/80">Codici demo per il test:</p>
          <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {["FX-1001", "FX-2056", "FX-3120", "FX-4099", "FX-5050"].map((c) => (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => setCode(c)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs font-mono text-neon-cyan hover:border-neon-cyan/50"
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TicketView({ ticket }: { ticket: Ticket }) {
  return (
    <article className="card relative overflow-hidden">
      <div className="pointer-events-none absolute -top-1/2 -right-1/2 h-full w-full rounded-full bg-gradient-to-br from-neon-violet/25 to-transparent blur-3xl" />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulseNeon" />
            Pratica · Live dal gestionale
          </span>
          <span className="font-mono text-sm text-white/70">{ticket.code}</span>
        </div>
        <h3 className="mt-4 text-2xl font-bold text-white">{ticket.device}</h3>
        <p className="mt-1 text-white/70">{ticket.service}</p>

        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <Info label="Cliente" value={ticket.customer} />
          <Info label="Stima pronto" value={ticket.estimatedReady} icon={<ClockIcon />} />
          <Info label="Note" value={ticket.notes ?? "—"} />
        </dl>

        <ol className="mt-8 space-y-4">
          {ticket.stages.map((s, idx) => (
            <li key={s.id} className="flex items-start gap-3">
              <span
                className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  s.status === "done"
                    ? "border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan shadow-neon-cyan"
                    : s.status === "active"
                      ? "border-neon-pink/70 bg-neon-pink/10 text-neon-pink shadow-neon-pink animate-pulseNeon"
                      : "border-white/15 bg-white/5 text-white/40"
                }`}
                aria-hidden
              >
                {s.status === "done" ? (
                  <CheckIcon width={14} height={14} />
                ) : (
                  <span className="text-[11px] font-semibold">{idx + 1}</span>
                )}
              </span>
              <div className="flex-1">
                <p
                  className={`text-sm sm:text-base font-semibold ${
                    s.status === "pending" ? "text-white/55" : "text-white"
                  }`}
                >
                  {s.label}
                </p>
                <p
                  className={`text-xs sm:text-sm ${
                    s.status === "pending" ? "text-white/40" : "text-white/65"
                  }`}
                >
                  {s.description}
                </p>
              </div>
              <span
                className={`text-[11px] uppercase tracking-wider ${
                  s.status === "done"
                    ? "text-neon-cyan"
                    : s.status === "active"
                      ? "text-neon-pink"
                      : "text-white/35"
                }`}
              >
                {s.status === "done"
                  ? "Completato"
                  : s.status === "active"
                    ? "In corso"
                    : "In attesa"}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
      <dt className="text-[11px] uppercase tracking-wider text-white/50">{label}</dt>
      <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-white">
        {icon && <span className="text-neon-cyan">{icon}</span>}
        <span className="truncate">{value}</span>
      </dd>
    </div>
  );
}
