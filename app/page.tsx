import Link from "next/link";
import { PromoBanner } from "@/components/PromoBanner";
import { Hero } from "@/components/Hero";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import {
  ToolIcon,
  RecycleIcon,
  SearchIcon,
  ShieldIcon,
  BoltIcon,
  ClockIcon,
  CheckIcon,
} from "@/components/icons";

export default function HomePage() {
  return (
    <>
      <PromoBanner />
      <Hero />

      {/* Sezioni servizi */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Cosa facciamo"
          title="Servizi su misura per il tuo device"
          subtitle="Dalla riparazione al ricondizionato, dalla prenotazione online al tracking lavorazioni: tutto in un unico ecosistema premium."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCard
            icon={<ToolIcon />}
            title="Riparazioni"
            description="Schermi, batterie, scheda madre, recupero dati. Tecnici certificati e ricambi originali."
            href="/riparazioni"
            accent="cyan"
          />
          <ServiceCard
            icon={<RecycleIcon />}
            title="Ricondizionati"
            description="Smartphone ricondizionati grado A con garanzia 12 mesi e batteria oltre l'85%."
            href="/ricondizionati"
            accent="pink"
          />
          <ServiceCard
            icon={<SearchIcon />}
            title="Stato Lavorazioni"
            description="Inserisci il codice pratica e segui in tempo reale la tua riparazione dal gestionale."
            href="/stato-lavorazioni"
            accent="cyan"
          />
        </div>
      </section>

      {/* Why Fixit */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Perché Fixit"
              title="Tecnologia, velocità e trasparenza."
              subtitle="Ogni riparazione è tracciata, ogni accessorio è testato, ogni ricondizionato è certificato. Tu sai sempre dove sei."
            />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: <BoltIcon />, t: "Express 24h", d: "Riparazioni standard concluse in giornata." },
                { icon: <ShieldIcon />, t: "Garanzia 12 mesi", d: "Tutti i ricondizionati e le riparazioni." },
                { icon: <ClockIcon />, t: "Tracking live", d: "Stato lavorazioni in tempo reale." },
                { icon: <CheckIcon />, t: "Ricambi originali", d: "Solo componentistica certificata." },
              ].map((f) => (
                <li key={f.t} className="card flex gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neon-cyan">
                    {f.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{f.t}</p>
                    <p className="text-sm text-white/65">{f.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-cyan/15 via-neon-violet/15 to-neon-pink/15 blur-2xl" />
            <div className="relative card overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="chip">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulseNeon" />
                  Live · Gestionale
                </span>
                <span className="text-xs text-white/50">FX-2056</span>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  { t: "Ricezione device", done: true },
                  { t: "Diagnosi tecnica", done: true },
                  { t: "Approvazione preventivo", done: true },
                  { t: "Riparazione in corso", done: false, active: true },
                  { t: "Test finale & QC", done: false },
                  { t: "Pronto per il ritiro", done: false },
                ].map((s) => (
                  <div key={s.t} className="flex items-center gap-3">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        s.done
                          ? "bg-neon-cyan shadow-neon-cyan"
                          : s.active
                          ? "bg-neon-pink shadow-neon-pink animate-pulseNeon"
                          : "bg-white/15"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        s.done || s.active ? "text-white" : "text-white/55"
                      }`}
                    >
                      {s.t}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/stato-lavorazioni" className="btn-neon mt-6 w-full">
                Apri tracking lavorazioni
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="container-page py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl neon-border glass p-8 sm:p-12 text-center">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
          <div className="relative">
            <h3 className="font-display text-3xl sm:text-4xl font-bold">
              <span className="neon-text">Pronto a riparare</span> il tuo device?
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-white/70">
              Porta il tuo dispositivo in negozio o richiedi un preventivo
              gratuito. Tracking in tempo reale incluso.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/prenota" className="btn-neon">Prenota riparazione</Link>
              <Link href="/stato-lavorazioni" className="btn-ghost">Verifica stato pratica</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
