import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-black/60">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo variant="full" width={180} height={90} />
          <p className="text-sm text-white/60 max-w-xs">
            Riparazioni rapide, accessori premium e smartphone ricondizionati
            con garanzia. Fixit Repair Express, la tua officina tech.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white/90">Servizi</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/65">
            <li><Link href="/riparazioni" className="hover:text-neon-cyan">Riparazioni</Link></li>
            <li><Link href="/accessori" className="hover:text-neon-cyan">Accessori</Link></li>
            <li><Link href="/ricondizionati" className="hover:text-neon-cyan">Ricondizionati</Link></li>
            <li><Link href="/stato-lavorazioni" className="hover:text-neon-cyan">Stato Lavorazioni</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white/90">Contatti</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/65">
            <li>Via Roma 12, Italia</li>
            <li><a href="tel:+390000000000" className="hover:text-neon-cyan">+39 000 000 0000</a></li>
            <li><a href="mailto:info@fixitrepairexpress.it" className="hover:text-neon-cyan">info@fixitrepairexpress.it</a></li>
            <li>Lun–Sab · 9:30 — 19:30</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white/90">Info</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/65">
            <li><Link href="#" className="hover:text-neon-cyan">Garanzia</Link></li>
            <li><Link href="#" className="hover:text-neon-cyan">Privacy</Link></li>
            <li><Link href="#" className="hover:text-neon-cyan">Termini</Link></li>
            <li><Link href="#" className="hover:text-neon-cyan">Cookie</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Fixit Repair Express. Tutti i diritti riservati.</p>
          <p>P.IVA 00000000000</p>
        </div>
      </div>
    </footer>
  );
}
