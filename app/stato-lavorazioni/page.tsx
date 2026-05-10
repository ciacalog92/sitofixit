import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { StatoLavorazioniClient } from "@/components/StatoLavorazioniClient";

export const metadata: Metadata = {
  title: "Stato Lavorazioni",
  description:
    "Inserisci il codice pratica e segui in tempo reale lo stato della tua riparazione direttamente dal gestionale Fixit.",
};

export default function StatoLavorazioniPage() {
  return (
    <section className="container-page py-12 sm:py-16">
      <SectionHeading
        eyebrow="Stato Lavorazioni · Live"
        title="Dove si trova la tua riparazione?"
        subtitle="Inserisci il codice pratica che hai ricevuto: leggiamo lo stato direttamente dal nostro gestionale."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <StatoLavorazioniClient />

        <aside className="card space-y-4 text-sm">
          <h3 className="text-base font-semibold text-white">Dove trovo il codice?</h3>
          <ul className="space-y-2 text-white/70">
            <li>· Sulla ricevuta consegnata in negozio.</li>
            <li>· Nell&apos;email di apertura pratica.</li>
            <li>· Nell&apos;SMS inviato al numero che ci hai lasciato.</li>
          </ul>
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-sm font-semibold text-white">Hai problemi?</h4>
            <p className="mt-1 text-white/65">
              Chiama il negozio o scrivici, controlliamo subito la tua pratica.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <a href="tel:+390000000000" className="btn-ghost flex-1 justify-center">
                Chiama
              </a>
              <a
                href="mailto:assistenza@fixitrepairexpress.it"
                className="btn-ghost flex-1 justify-center"
              >
                Scrivici
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
