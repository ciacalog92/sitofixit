import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { PhoneIcon, ShieldIcon, CheckIcon, RecycleIcon } from "@/components/icons";
import { getGestionale, type RefurbishedPhone, type Grade } from "@/lib/gestionale";

export const metadata: Metadata = {
  title: "Smartphone Ricondizionati",
  description:
    "Smartphone ricondizionati grado A: iPhone, Samsung, Google Pixel. Garanzia 12 mesi, batteria oltre l'85%.",
};

// rigenera il catalogo dal gestionale ogni 60s (ISR)
export const revalidate = 60;

const GUARANTEES = [
  { icon: <ShieldIcon />, t: "12 mesi di garanzia", d: "Su ogni device venduto e su ricambi originali." },
  { icon: <CheckIcon />, t: "70+ controlli qualità", d: "Funzionali ed estetici prima della vendita." },
  { icon: <RecycleIcon />, t: "Sostenibili", d: "Un device ricondizionato = -50kg CO₂ rispetto al nuovo." },
];

const GRADE_STYLE: Record<Grade, string> = {
  "A+": "border-neon-pink/50 text-neon-pink",
  A: "border-neon-cyan/50 text-neon-cyan",
  B: "border-white/20 text-white/70",
};

export default async function RicondizionatiPage() {
  const gestionale = getGestionale();
  let phones: RefurbishedPhone[] = [];
  let live = false;
  try {
    phones = await gestionale.listRefurbished();
    live = gestionale.name !== "mock";
  } catch {
    phones = [];
  }

  return (
    <>
      <section className="container-page py-12 sm:py-16">
        <SectionHeading
          eyebrow="Ricondizionati"
          title="Smartphone come nuovi. Prezzo intelligente."
          subtitle="Ogni device viene rigenerato dai nostri tecnici, testato in 70+ punti e garantito 12 mesi."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {GUARANTEES.map((g) => (
            <div key={g.t} className="card flex gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neon-cyan">
                {g.icon}
              </span>
              <div>
                <p className="font-semibold text-white">{g.t}</p>
                <p className="text-sm text-white/65">{g.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-8 sm:py-12">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <SectionHeading eyebrow="Catalogo" title="In stock ora" />
          <span className="chip text-xs">
            <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-neon-cyan animate-pulseNeon" : "bg-white/40"}`} />
            {live ? "Live · sincronizzato col gestionale" : "Stock di esempio · gestionale non collegato"}
          </span>
        </div>

        {phones.length === 0 ? (
          <div className="mt-8 card text-center text-white/70">
            Catalogo momentaneamente vuoto. Riprova tra qualche minuto o
            <Link href="/stato-lavorazioni" className="ml-1 text-neon-cyan hover:underline">contattaci</Link>.
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {phones.map((p) => (
              <article key={p.id} className="card group flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-neon-cyan/15 via-neon-violet/20 to-neon-pink/15">
                  {p.imageUrl ? (
                    // immagini dal gestionale: dominio sconosciuto a priori → <img> diretto
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={`${p.brand} ${p.model}`}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-contain p-4"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-24 w-16 rounded-[1.4rem] border-2 border-white/20 bg-black/60 backdrop-blur flex items-end justify-center pb-1">
                        <PhoneIcon className="text-neon-cyan" />
                      </div>
                    </div>
                  )}
                  <span className={`absolute left-3 top-3 chip border ${GRADE_STYLE[p.grade]}`}>
                    Grado {p.grade}
                  </span>
                  <span className="absolute right-3 top-3 chip text-[11px]">Batteria {p.battery}</span>
                </div>
                <div className="mt-4 flex flex-1 flex-col">
                  <p className="text-xs uppercase tracking-wider text-white/50">{p.brand}</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{p.model}</h3>
                  <p className="text-sm text-white/65">
                    {[p.storage, p.color].filter(Boolean).join(" · ")}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="text-xl font-bold neon-text">
                      {p.priceLabel ?? `€ ${Math.round(p.price)}`}
                    </span>
                    <Link href="#" className="btn-ghost py-2 px-3 text-xs sm:text-sm">Dettagli</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </section>
    </>
  );
}
