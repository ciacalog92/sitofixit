import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { PhoneIcon, ToolIcon, BoltIcon, ShieldIcon, CheckIcon, ClockIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Riparazioni",
  description:
    "Riparazioni smartphone, tablet, console e PC: schermo, batteria, scheda madre, recupero dati. Express 24h con garanzia.",
};

const SERVICES = [
  {
    title: "Schermo & Display",
    description: "Sostituzione vetro, LCD/OLED, true tone calibration. Ricambi originali e compatibili premium.",
    accent: "cyan" as const,
    icon: <PhoneIcon />,
  },
  {
    title: "Batteria",
    description: "Diagnostica autonomia, sostituzione celle, calibrazione su iPhone, Samsung, Xiaomi e altri.",
    accent: "violet" as const,
    icon: <BoltIcon />,
  },
  {
    title: "Scheda madre",
    description: "Microsaldatura BGA, ripristino IC carica, audio, Wi-Fi, riballing professionale.",
    accent: "pink" as const,
    icon: <ToolIcon />,
  },
  {
    title: "Danni da liquidi",
    description: "Ultrasuoni, pulizia logic board, recupero device caduti in acqua o esposti a umidità.",
    accent: "cyan" as const,
    icon: <ShieldIcon />,
  },
  {
    title: "Recupero dati",
    description: "Foto, video, contatti, chat. Recupero da device danneggiati o non funzionanti.",
    accent: "violet" as const,
    icon: <CheckIcon />,
  },
  {
    title: "Tablet, console & PC",
    description: "iPad, Galaxy Tab, PlayStation, Xbox, Switch, notebook: diagnosi e riparazione.",
    accent: "pink" as const,
    icon: <ClockIcon />,
  },
];

const STEPS = [
  { n: "01", t: "Diagnosi gratuita", d: "Valutiamo il device e ti diamo un preventivo trasparente." },
  { n: "02", t: "Approvazione", d: "Tu approvi, noi prepariamo il ricambio originale o premium." },
  { n: "03", t: "Riparazione express", d: "I nostri tecnici intervengono in laboratorio. Tracking live." },
  { n: "04", t: "Test & ritiro", d: "Quality check completo, pulizia e consegna garantita 12 mesi." },
];

export default function RiparazioniPage() {
  return (
    <>
      <section className="container-page py-12 sm:py-16">
        <SectionHeading
          eyebrow="Riparazioni"
          title="Diagnosi gratuita, intervento express."
          subtitle="Tecnici certificati e laboratorio di microsaldatura interno. Tutti gli interventi con garanzia 12 mesi."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <SectionHeading eyebrow="Come funziona" title="4 step, zero pensieri." />
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="card">
              <span className="text-3xl font-display font-bold neon-text">{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold text-white">{s.t}</h3>
              <p className="mt-2 text-sm text-white/65">{s.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link href="/stato-lavorazioni" className="btn-neon">Apri stato lavorazioni</Link>
          <a href="tel:+390000000000" className="btn-ghost">Chiama un tecnico</a>
        </div>
      </section>
    </>
  );
}
