"use client";

import { useState, type FormEvent } from "react";
import { CheckIcon } from "./icons";

const DEVICES = [
  "Smartphone",
  "Tablet",
  "Computer",
  "Console",
  "Accessorio",
  "Altro",
] as const;

const FASCE = ["Mattina (9:30–13)", "Pomeriggio (15–19:30)", "Sabato"] as const;

type FormState = {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  dispositivo_tipo: string;
  marca: string;
  modello: string;
  problema: string;
  data_preferita: string;
  fascia_oraria: string;
  note: string;
  consenso_privacy: boolean;
  website: string; // honeypot
};

const EMPTY: FormState = {
  nome: "",
  cognome: "",
  email: "",
  telefono: "",
  dispositivo_tipo: "",
  marca: "",
  modello: "",
  problema: "",
  data_preferita: "",
  fascia_oraria: "",
  note: "",
  consenso_privacy: false,
  website: "",
};

type ApiResponse =
  | { ok: true; id: string }
  | { ok: false; error: string; fields?: string[] };

export function PrenotazioneForm() {
  const [state, setState] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const [success, setSuccess] = useState<{ id: string } | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
    if (invalidFields.has(key as string)) {
      const next = new Set(invalidFields);
      next.delete(key as string);
      setInvalidFields(next);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInvalidFields(new Set());
    setLoading(true);

    try {
      const res = await fetch("/api/prenota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const data: ApiResponse = await res.json();
      if (!data.ok) {
        setError(data.error);
        if (data.fields) setInvalidFields(new Set(data.fields));
      } else {
        setSuccess({ id: data.id });
      }
    } catch {
      setError("Errore di connessione. Riprova tra qualche istante.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="card">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan shadow-neon-cyan">
            <CheckIcon />
          </span>
          <div>
            <h3 className="text-lg font-bold text-white">Prenotazione inviata!</h3>
            <p className="text-sm text-white/65">
              Ti abbiamo inviato una mail di conferma e ti ricontattiamo a breve.
            </p>
          </div>
        </div>
        <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-widest text-white/50">Codice richiesta</p>
          <p className="mt-1 font-mono text-sm text-neon-cyan">{success.id.slice(0, 8)}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSuccess(null);
            setState(EMPTY);
          }}
          className="btn-ghost mt-5"
        >
          Invia un&apos;altra richiesta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5" noValidate>
      {/* Honeypot — non visibile, solo bot lo compilano */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={state.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </label>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-white/80">I tuoi contatti</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Nome *"
            invalid={invalidFields.has("nome")}
          >
            <input
              type="text"
              autoComplete="given-name"
              value={state.nome}
              onChange={(e) => update("nome", e.target.value)}
              className={inputCls(invalidFields.has("nome"))}
              required
              minLength={2}
            />
          </Field>
          <Field label="Cognome *" invalid={invalidFields.has("cognome")}>
            <input
              type="text"
              autoComplete="family-name"
              value={state.cognome}
              onChange={(e) => update("cognome", e.target.value)}
              className={inputCls(invalidFields.has("cognome"))}
              required
              minLength={2}
            />
          </Field>
          <Field label="Email *" invalid={invalidFields.has("email")}>
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              value={state.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputCls(invalidFields.has("email"))}
              required
            />
          </Field>
          <Field label="Telefono *" invalid={invalidFields.has("telefono")}>
            <input
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={state.telefono}
              onChange={(e) => update("telefono", e.target.value)}
              className={inputCls(invalidFields.has("telefono"))}
              required
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-white/80">Il tuo dispositivo</legend>
        <Field label="Tipo dispositivo *" invalid={invalidFields.has("dispositivo_tipo")}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {DEVICES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => update("dispositivo_tipo", d)}
                aria-pressed={state.dispositivo_tipo === d}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                  state.dispositivo_tipo === d
                    ? "border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan"
                    : "border-white/10 bg-white/5 text-white/80 hover:border-white/25"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Marca" hint="es. Apple, Samsung, Xiaomi…">
            <input
              type="text"
              value={state.marca}
              onChange={(e) => update("marca", e.target.value)}
              className={inputCls(false)}
            />
          </Field>
          <Field label="Modello" hint="es. iPhone 13, Galaxy S22…">
            <input
              type="text"
              value={state.modello}
              onChange={(e) => update("modello", e.target.value)}
              className={inputCls(false)}
            />
          </Field>
        </div>
        <Field
          label="Descrivi il problema *"
          invalid={invalidFields.has("problema")}
          hint="Schermo rotto? Non si accende? Batteria scarica subito? Più dettagli ci dai, più rapida sarà la diagnosi."
        >
          <textarea
            rows={4}
            value={state.problema}
            onChange={(e) => update("problema", e.target.value)}
            className={inputCls(invalidFields.has("problema"))}
            required
            minLength={5}
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-white/80">Quando passi? (facoltativo)</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Data preferita">
            <input
              type="date"
              value={state.data_preferita}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => update("data_preferita", e.target.value)}
              className={inputCls(false)}
            />
          </Field>
          <Field label="Fascia oraria">
            <select
              value={state.fascia_oraria}
              onChange={(e) => update("fascia_oraria", e.target.value)}
              className={inputCls(false)}
            >
              <option value="">— seleziona —</option>
              {FASCE.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Note">
          <textarea
            rows={2}
            value={state.note}
            onChange={(e) => update("note", e.target.value)}
            className={inputCls(false)}
            placeholder="Qualcosa che dovremmo sapere?"
          />
        </Field>
      </fieldset>

      <label className="flex items-start gap-3 text-sm text-white/75">
        <input
          type="checkbox"
          checked={state.consenso_privacy}
          onChange={(e) => update("consenso_privacy", e.target.checked)}
          className={`mt-1 h-5 w-5 shrink-0 rounded border bg-white/5 accent-neon-cyan ${
            invalidFields.has("consenso_privacy")
              ? "border-neon-pink/60"
              : "border-white/15"
          }`}
          required
        />
        <span>
          Ho letto l&apos;informativa privacy e acconsento al trattamento dei
          miei dati per essere ricontattato in merito alla riparazione richiesta.
        </span>
      </label>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-neon-pink/40 bg-neon-pink/5 p-3 text-sm text-neon-pink"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-neon w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Invio in corso…" : "Invia prenotazione"}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  invalid,
  children,
}: {
  label: string;
  hint?: string;
  invalid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={`block text-sm font-medium ${invalid ? "text-neon-pink" : "text-white/85"}`}>
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-xs text-white/50">{hint}</p>}
    </label>
  );
}

function inputCls(invalid: boolean): string {
  return [
    "block w-full rounded-xl border bg-white/5 px-3.5 py-3 text-base text-white",
    "placeholder:text-white/35",
    "focus:outline-none focus:ring-2",
    invalid
      ? "border-neon-pink/50 focus:border-neon-pink/70 focus:ring-neon-pink/30"
      : "border-white/10 focus:border-neon-cyan/60 focus:ring-neon-cyan/40",
  ].join(" ");
}
