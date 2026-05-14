import type { Metadata } from "next";
import { PrenotazioneForm } from "@/components/PrenotazioneForm";
import { SectionHeading } from "@/components/SectionHeading";
import { BoltIcon, ShieldIcon, ClockIcon, CheckIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Prenota la tua riparazione",
  description:
    "Prenota online la tua riparazione. Ti ricontattiamo per confermare l'appuntamento e gestire la pratica.",
};

const POINTS = [
  { icon: <BoltIcon />, t: "Risposta rapida", d: "Ti ricontattiamo in giornata per confermare." },
  { icon: <ShieldIcon />, t: "Preventivo gratuito", d: "Diagnosi e preventivo senza impegno." },
  { icon: <ClockIcon />, t: "Express 24h", d: "La maggior parte delle riparazioni in 24h." },
  { icon: <CheckIcon />, t: "Garanzia 90 giorni", d: "Su ogni intervento e ricambio originale." },
];

export default function PrenotaPage() {
  return (
    <section className="container-page py-12 sm:py-16">
      <SectionHeading
        eyebrow="Prenotazione online"
        title="Prenota la tua riparazione"
        subtitle="Compila il form: ricevi conferma via email e veniamo richiamati noi al numero che lasci. La richiesta entra direttamente nel nostro gestionale."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <PrenotazioneForm />

        <aside className="space-y-4">
          <ul className="grid gap-3">
            {POINTS.map((p) => (
              <li key={p.t} className="card flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neon-cyan">
                  {p.icon}
                </span>
                <div>
                  <p className="font-semibold text-white">{p.t}</p>
                  <p className="text-sm text-white/65">{p.d}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="card">
            <p className="text-xs uppercase tracking-widest text-white/50">Dove siamo</p>
            <p className="mt-2 font-semibold text-white">Via 4 Novembre, 434</p>
            <p className="text-sm text-white/65">53014 Monteroni d&apos;Arbia (SI)</p>
            <p className="mt-3 text-xs uppercase tracking-widest text-white/50">Orari</p>
            <p className="mt-2 text-sm text-white/80">Lun–Sab · 9:30 — 19:30</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
