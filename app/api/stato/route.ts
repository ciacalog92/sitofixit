import { NextResponse } from "next/server";
import { getGestionale } from "@/lib/gestionale";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  // Accetta sia il formato breve (FX-2056) sia il formato esteso (LAB-2026-0011).
  if (!/^[A-Z]{1,6}(?:-\d{2,4}){1,3}$/.test(code) && !/^[A-Z]{1,6}-?\d{3,8}$/.test(code)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Formato codice non valido. Usa il codice sulla ricevuta (es. LAB-2026-0011).",
      },
      { status: 400 },
    );
  }

  const gestionale = getGestionale();

  try {
    const ticket = await gestionale.getTicket(code);
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
    return NextResponse.json({ ok: true, source: gestionale.name, ticket });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Errore di comunicazione con il gestionale. Riprova tra un istante.",
      },
      { status: 502 },
    );
  }
}
