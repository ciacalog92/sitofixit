import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { PhoneIcon, ShieldIcon, CheckIcon, RecycleIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Smartphone Ricondizionati",
  description:
    "Smartphone ricondizionati grado A: iPhone, Samsung, Google Pixel. Garanzia 12 mesi, batteria oltre l'85%.",
};

type Phone = {
  brand: string;
  model: string;
  storage: string;
  price: string;
  grade: "A" | "A+" | "B";
  battery: string;
};

const PHONES: Phone[] = [
  { brand: "Apple", model: "iPhone 13", storage: "128GB", price: "€ 519", grade: "A+", battery: "92%" },
  { brand: "Apple", model: "iPhone 12 Pro", storage: "256GB", price: "€ 599", grade: "A", battery: "88%" },
  { brand: "Samsung", model: "Galaxy S22", storage: "128GB", price: "€ 379", grade: "A", battery: "90%" },
  { brand: "Apple", model: "iPhone 14", storage: "128GB", price: "€ 679", grade: "A+", battery: "95%" },
  { brand: "Google", model: "Pixel 7", storage: "128GB", price: "€ 349", grade: "A", battery: "89%" },
  { brand: "Samsung", model: "Galaxy S23 Ultra", storage: "256GB", price: "€ 829", grade: "A+", battery: "94%" },
];

const GUARANTEES = [
  { icon: <ShieldIcon />, t: "12 mesi di garanzia", d: "Su ogni device venduto e su ricambi originali." },
  { icon: <CheckIcon />, t: "70+ controlli qualità", d: "Funzionali ed estetici prima della vendita." },
  { icon: <RecycleIcon />, t: "Sostenibili", d: "Un device ricondizionato = -50kg CO₂ rispetto al nuovo." },
];

const GRADE_STYLE: Record<Phone["grade"], string> = {
  "A+": "border-neon-pink/50 text-neon-pink",
  A: "border-neon-cyan/50 text-neon-cyan",
  B: "border-white/20 text-white/70",
};

export default function RicondizionatiPage() {
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
          <span className="text-sm text-white/50">Stock aggiornato dal gestionale</span>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PHONES.map((p) => (
            <article key={`${p.brand}-${p.model}-${p.storage}`} className="card group flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-neon-cyan/15 via-neon-violet/20 to-neon-pink/15">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-24 w-16 rounded-[1.4rem] border-2 border-white/20 bg-black/60 backdrop-blur flex items-end justify-center pb-1">
                    <PhoneIcon className="text-neon-cyan" />
                  </div>
                </div>
                <span className={`absolute left-3 top-3 chip border ${GRADE_STYLE[p.grade]}`}>
                  Grado {p.grade}
                </span>
                <span className="absolute right-3 top-3 chip text-[11px]">Batteria {p.battery}</span>
              </div>
              <div className="mt-4 flex flex-1 flex-col">
                <p className="text-xs uppercase tracking-wider text-white/50">{p.brand}</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{p.model}</h3>
                <p className="text-sm text-white/65">{p.storage}</p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-xl font-bold neon-text">{p.price}</span>
                  <Link href="#" className="btn-ghost py-2 px-3 text-xs sm:text-sm">Dettagli</Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl neon-border glass p-6 sm:p-8 text-center">
          <p className="text-white/80">
            Hai un vecchio smartphone? <span className="neon-text font-semibold">Lo ritiriamo</span> e lo
            valuti subito.
          </p>
          <Link href="#" className="btn-neon mt-4 inline-flex">Valuta il tuo usato</Link>
        </div>
      </section>
    </>
  );
}
