import { NextResponse } from "next/server";
import { getGestionale } from "@/lib/gestionale";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const gestionale = getGestionale();
  try {
    const items = await gestionale.listRefurbished();
    return NextResponse.json(
      { ok: true, source: gestionale.name, items },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Catalogo ricondizionati momentaneamente non disponibile." },
      { status: 502 },
    );
  }
}
