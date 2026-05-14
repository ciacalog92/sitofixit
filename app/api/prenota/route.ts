import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  sendEmail,
  templateCustomerConfirm,
  templateShopNotify,
} from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
  dispositivo_tipo?: string;
  marca?: string;
  modello?: string;
  problema?: string;
  data_preferita?: string;
  fascia_oraria?: string;
  note?: string;
  consenso_privacy?: boolean;
  // honeypot anti-spam: deve restare vuoto
  website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d\s().-]{6,}$/;

function trim(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "JSON non valido" }, { status: 400 });
  }

  // Honeypot: se compilato, fingiamo successo e usciamo.
  if (trim(body.website)) {
    return NextResponse.json({ ok: true, id: "blocked" });
  }

  // Validazione minima
  const nome = trim(body.nome);
  const cognome = trim(body.cognome);
  const email = trim(body.email).toLowerCase();
  const telefono = trim(body.telefono);
  const dispositivo_tipo = trim(body.dispositivo_tipo);
  const problema = trim(body.problema);
  const consenso = body.consenso_privacy === true;

  const errors: string[] = [];
  if (nome.length < 2) errors.push("nome");
  if (cognome.length < 2) errors.push("cognome");
  if (!EMAIL_RE.test(email)) errors.push("email");
  if (!PHONE_RE.test(telefono)) errors.push("telefono");
  if (!dispositivo_tipo) errors.push("dispositivo_tipo");
  if (problema.length < 5) errors.push("problema");
  if (!consenso) errors.push("consenso_privacy");

  if (errors.length > 0) {
    return NextResponse.json(
      { ok: false, error: "Campi non validi", fields: errors },
      { status: 422 },
    );
  }

  // Header informativi (best-effort)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;
  const ua = req.headers.get("user-agent")?.slice(0, 500) ?? null;

  // Genero l'UUID server-side: così non serve un RETURNING dopo l'insert,
  // e la policy RLS di SELECT può restare ristretta a service_role +
  // utenti autenticati del gestionale (anon NON deve poter leggere le
  // prenotazioni di altri).
  const id = randomUUID();
  const marca = trim(body.marca) || null;
  const modello = trim(body.modello) || null;
  const data_preferita = trim(body.data_preferita) || null;
  const fascia_oraria = trim(body.fascia_oraria) || null;
  const note = trim(body.note) || null;

  const { error } = await supabaseAdmin.from("prenotazioni").insert({
    id,
    nome,
    cognome,
    email,
    telefono,
    dispositivo_tipo,
    marca,
    modello,
    problema,
    data_preferita,
    fascia_oraria,
    note,
    consenso_privacy: consenso,
    origine: "sito_web",
    ip_address: ip,
    user_agent: ua,
  });

  if (error) {
    console.error("[/api/prenota] insert error:", error.message);
    return NextResponse.json(
      { ok: false, error: "Impossibile salvare la prenotazione. Riprova tra poco." },
      { status: 500 },
    );
  }

  const prenotazione = {
    id,
    nome,
    cognome,
    email,
    telefono,
    dispositivo_tipo,
    marca,
    modello,
    problema,
    data_preferita,
    fascia_oraria,
    note,
  };

  // Notifica email — best-effort, non blocca la risposta in caso di errore.
  const shopEmail = process.env.SHOP_NOTIFY_EMAIL;
  const emailResults: Record<string, unknown> = {};

  if (shopEmail) {
    const shopMail = templateShopNotify(prenotazione);
    emailResults.shop = await sendEmail({
      to: shopEmail,
      subject: shopMail.subject,
      html: shopMail.html,
      text: shopMail.text,
      replyTo: prenotazione.email,
    });
  } else {
    emailResults.shop = { ok: false, skipped: true, reason: "SHOP_NOTIFY_EMAIL non configurata" };
  }

  const customerMail = templateCustomerConfirm(prenotazione);
  emailResults.customer = await sendEmail({
    to: prenotazione.email,
    subject: customerMail.subject,
    html: customerMail.html,
    text: customerMail.text,
  });

  return NextResponse.json({
    ok: true,
    id: prenotazione.id,
    email: emailResults,
  });
}
