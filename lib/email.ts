/**
 * Notifiche email server-only.
 *
 * Usa Resend (https://resend.com) tramite REST API — zero dipendenze NPM.
 * Configurazione via env:
 *
 *   RESEND_API_KEY        chiave API Resend (re_xxx)
 *   RESEND_FROM           mittente verificato, es. "Fixit <prenotazioni@tuodominio.it>"
 *   SHOP_NOTIFY_EMAIL     destinatario interno (lo shop), es. "info@fixitrepair.it"
 *   RESEND_REPLY_TO       opzionale, default: email del cliente
 *
 * Se RESEND_API_KEY non è impostata: la funzione restituisce
 * { ok: false, skipped: true } senza errori — la prenotazione viene
 * comunque salvata in Supabase e visibile nel gestionale.
 */

export type SendResult =
  | { ok: true; id: string }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped: false; error: string };

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export async function sendEmail({ to, subject, html, text, replyTo }: SendArgs): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    return {
      ok: false,
      skipped: true,
      reason: "RESEND_API_KEY o RESEND_FROM non configurati",
    };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
        reply_to: replyTo,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      return {
        ok: false,
        skipped: false,
        error: `Resend ${res.status}: ${errBody.slice(0, 300)}`,
      };
    }

    const data = (await res.json()) as { id?: string };
    return { ok: true, id: data.id ?? "unknown" };
  } catch (err) {
    return {
      ok: false,
      skipped: false,
      error: err instanceof Error ? err.message : "errore sconosciuto",
    };
  }
}

// === Template ===============================================================

type Prenotazione = {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  dispositivo_tipo: string;
  marca?: string | null;
  modello?: string | null;
  problema: string;
  data_preferita?: string | null;
  fascia_oraria?: string | null;
  note?: string | null;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:6px 12px 6px 0;color:#6b6b80;font-size:13px;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td>
    <td style="padding:6px 0;color:#0b0b14;font-size:14px;font-weight:500">${escapeHtml(value)}</td>
  </tr>`;
}

/** Email al banco/officina: nuova prenotazione ricevuta. */
export function templateShopNotify(p: Prenotazione): { subject: string; html: string; text: string } {
  const subject = `Nuova prenotazione: ${p.dispositivo_tipo}${p.modello ? " · " + p.modello : ""} — ${p.nome} ${p.cognome}`;

  const html = `<!doctype html>
<html><body style="margin:0;background:#f5f5fa;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif">
  <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e6e6f0">
    <div style="padding:20px 24px;background:linear-gradient(90deg,#22e0ff,#9b5cff,#ff3df0);color:#fff">
      <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:0.9">Fixit Repair · Prenotazioni</p>
      <h1 style="margin:6px 0 0;font-size:20px">Nuova richiesta dal sito</h1>
    </div>
    <div style="padding:20px 24px">
      <p style="margin:0 0 14px;color:#0b0b14;font-size:14px">
        Ciao, è arrivata una nuova prenotazione da <strong>${escapeHtml(p.nome)} ${escapeHtml(p.cognome)}</strong>.
      </p>
      <table style="width:100%;border-collapse:collapse;margin-top:8px">
        ${row("Email", p.email)}
        ${row("Telefono", p.telefono)}
        ${row("Dispositivo", p.dispositivo_tipo)}
        ${row("Marca", p.marca)}
        ${row("Modello", p.modello)}
        ${row("Problema", p.problema)}
        ${row("Data preferita", p.data_preferita)}
        ${row("Fascia oraria", p.fascia_oraria)}
        ${row("Note", p.note)}
        ${row("ID prenotazione", p.id)}
      </table>
      <p style="margin:18px 0 0;font-size:12px;color:#6b6b80">
        Apri il gestionale per gestire la pratica o rispondi direttamente al cliente a
        <a href="mailto:${escapeHtml(p.email)}" style="color:#9b5cff">${escapeHtml(p.email)}</a>.
      </p>
    </div>
  </div>
</body></html>`;

  const text =
    `Nuova prenotazione Fixit Repair\n\n` +
    `Cliente: ${p.nome} ${p.cognome}\n` +
    `Email: ${p.email}\n` +
    `Telefono: ${p.telefono}\n` +
    `Dispositivo: ${p.dispositivo_tipo}${p.marca ? " " + p.marca : ""}${p.modello ? " " + p.modello : ""}\n` +
    `Problema: ${p.problema}\n` +
    (p.data_preferita ? `Data preferita: ${p.data_preferita}\n` : "") +
    (p.fascia_oraria ? `Fascia oraria: ${p.fascia_oraria}\n` : "") +
    (p.note ? `Note: ${p.note}\n` : "") +
    `\nID prenotazione: ${p.id}`;

  return { subject, html, text };
}

/** Email di conferma al cliente. */
export function templateCustomerConfirm(p: Prenotazione): { subject: string; html: string; text: string } {
  const subject = "Abbiamo ricevuto la tua prenotazione · Fixit Repair";

  const html = `<!doctype html>
<html><body style="margin:0;background:#f5f5fa;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif">
  <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e6e6f0">
    <div style="padding:20px 24px;background:linear-gradient(90deg,#22e0ff,#9b5cff,#ff3df0);color:#fff">
      <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:0.9">Fixit Repair</p>
      <h1 style="margin:6px 0 0;font-size:20px">Prenotazione ricevuta ✓</h1>
    </div>
    <div style="padding:20px 24px">
      <p style="margin:0 0 12px;color:#0b0b14;font-size:14px">
        Ciao <strong>${escapeHtml(p.nome)}</strong>, grazie per averci scelto.
        Abbiamo ricevuto la tua richiesta e ti ricontatteremo a breve per
        confermare l&rsquo;appuntamento.
      </p>
      <div style="margin-top:14px;padding:14px;border:1px solid #e6e6f0;border-radius:10px;background:#fafaff">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#6b6b80">Riepilogo</p>
        <table style="width:100%;border-collapse:collapse">
          ${row("Dispositivo", p.dispositivo_tipo)}
          ${row("Marca/Modello", [p.marca, p.modello].filter(Boolean).join(" "))}
          ${row("Problema", p.problema)}
          ${row("Data preferita", p.data_preferita)}
          ${row("Fascia oraria", p.fascia_oraria)}
        </table>
      </div>
      <p style="margin:18px 0 6px;color:#0b0b14;font-size:14px">
        Per qualsiasi cosa puoi rispondere a questa email o contattarci direttamente.
      </p>
      <p style="margin:0;font-size:12px;color:#6b6b80">
        Codice richiesta: <code style="background:#f0f0f7;padding:2px 6px;border-radius:4px">${escapeHtml(p.id.slice(0, 8))}</code>
      </p>
    </div>
  </div>
</body></html>`;

  const text =
    `Ciao ${p.nome}, grazie per la tua prenotazione su Fixit Repair.\n\n` +
    `Ti ricontatteremo a breve per confermare l'appuntamento.\n\n` +
    `Riepilogo:\n` +
    `- Dispositivo: ${p.dispositivo_tipo}${p.marca ? " " + p.marca : ""}${p.modello ? " " + p.modello : ""}\n` +
    `- Problema: ${p.problema}\n` +
    (p.data_preferita ? `- Data preferita: ${p.data_preferita}\n` : "") +
    (p.fascia_oraria ? `- Fascia oraria: ${p.fascia_oraria}\n` : "") +
    `\nCodice richiesta: ${p.id.slice(0, 8)}\n`;

  return { subject, html, text };
}
