import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { HeadphonesIcon, BoltIcon, ShieldIcon, TruckIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Accessori",
  description:
    "Cover, vetri temperati, caricatori GaN, audio TWS, powerbank e accessori smart. Selezione tech premium.",
};

type Product = {
  name: string;
  category: string;
  price: string;
  badge?: string;
};

const PRODUCTS: Product[] = [
  { name: "Vetro Temperato 9D Full Coverage", category: "Protezione", price: "€ 19,90", badge: "Top" },
  { name: "Cover MagSafe Trasparente", category: "Cover", price: "€ 24,90" },
  { name: "Caricatore GaN 65W USB-C", category: "Carica", price: "€ 39,90", badge: "Fast" },
  { name: "Cavo USB-C Braided 1.5m", category: "Cavi", price: "€ 14,90" },
  { name: "Auricolari TWS Pro ANC", category: "Audio", price: "€ 79,90", badge: "Hot" },
  { name: "Powerbank 20.000 mAh PD", category: "Carica", price: "€ 49,90" },
  { name: "Smartwatch Sport AMOLED", category: "Wearable", price: "€ 99,00" },
  { name: "Speaker Bluetooth Waterproof", category: "Audio", price: "€ 59,00" },
];

const CATS = [
  { icon: <ShieldIcon />, t: "Protezione", d: "Vetri, cover, pellicole privacy." },
  { icon: <BoltIcon />, t: "Ricarica", d: "Caricatori GaN, cavi, powerbank." },
  { icon: <HeadphonesIcon />, t: "Audio", d: "TWS, cuffie ANC, speaker." },
  { icon: <TruckIcon />, t: "Spedizione 24h", d: "Ordina online, ritiro o consegna." },
];

export default function AccessoriPage() {
  return (
    <>
      <section className="container-page py-12 sm:py-16">
        <SectionHeading
          eyebrow="Accessori"
          title="Tech premium, selezionata."
          subtitle="Solo prodotti testati dai nostri tecnici. Compatibilità garantita con il tuo device."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATS.map((c) => (
            <div key={c.t} className="card flex gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neon-cyan">
                {c.icon}
              </span>
              <div>
                <p className="font-semibold text-white">{c.t}</p>
                <p className="text-sm text-white/65">{c.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-8 sm:py-12">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <SectionHeading eyebrow="Catalogo" title="Più richiesti" />
          <span className="text-sm text-white/50">Disponibile in negozio · Su richiesta online</span>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTS.map((p) => (
            <article key={p.name} className="card group flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-neon-cyan/15 via-neon-violet/15 to-neon-pink/15">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-2xl border border-white/15 bg-black/40 backdrop-blur flex items-center justify-center text-neon-cyan">
                    <HeadphonesIcon />
                  </div>
                </div>
                {p.badge && (
                  <span className="absolute left-3 top-3 chip text-[10px] uppercase tracking-wider">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="mt-4 flex flex-1 flex-col">
                <p className="text-xs uppercase tracking-wider text-white/50">{p.category}</p>
                <h3 className="mt-1 text-base font-semibold text-white line-clamp-2">{p.name}</h3>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-lg font-bold neon-text">{p.price}</span>
                  <button className="btn-ghost py-2 px-3 text-xs sm:text-sm">Aggiungi</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
