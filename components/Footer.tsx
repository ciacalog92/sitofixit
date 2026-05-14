import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-black/60">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand + tagline + social */}
        <div className="space-y-4">
          <Logo variant="full" className="h-16 w-auto" />
          <p className="text-sm text-white/60 max-w-xs">
            Riparazioni rapide e smartphone ricondizionati con garanzia.
            Fixit Repair Express, la tua officina tech.
          </p>

          <div>
            <p className="text-xs uppercase tracking-widest text-white/50">Resta aggiornato</p>
            <div className="mt-3 flex gap-3">
              <SocialLink href="https://facebook.com" label="Facebook">
                <FacebookIcon />
              </SocialLink>
              <SocialLink href="https://instagram.com" label="Instagram">
                <InstagramIcon />
              </SocialLink>
              <SocialLink href="https://tiktok.com" label="TikTok">
                <TikTokIcon />
              </SocialLink>
            </div>
          </div>
        </div>

        {/* Servizi */}
        <div>
          <h4 className="text-sm font-semibold text-white/90">Servizi</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/65">
            <li><Link href="/riparazioni" className="hover:text-neon-cyan">Riparazioni</Link></li>
            <li><Link href="/ricondizionati" className="hover:text-neon-cyan">Ricondizionati</Link></li>
            <li><Link href="/stato-lavorazioni" className="hover:text-neon-cyan">Stato Lavorazioni</Link></li>
            <li><Link href="/prenota" className="hover:text-neon-cyan">Prenota riparazione</Link></li>
          </ul>
        </div>

        {/* Dove siamo + orari */}
        <div>
          <h4 className="text-sm font-semibold text-white/90">Dove siamo</h4>
          <address className="not-italic mt-3 text-sm text-white/70 space-y-1">
            <p className="text-white/85 font-medium">Fixit Repair Express</p>
            <p>Via A. Fabbri, 54</p>
            <p>53014 Monteroni d&apos;Arbia (SI)</p>
          </address>
          <p className="mt-4 text-xs uppercase tracking-widest text-white/50">Orari</p>
          <p className="mt-2 text-sm text-white/70">Lun–Sab · 9:30 — 19:30</p>
        </div>

        {/* Info aziendali */}
        <div>
          <h4 className="text-sm font-semibold text-white/90">Info aziendali</h4>
          <dl className="mt-3 space-y-2 text-sm text-white/70">
            <Pair label="PEC">
              <a href="mailto:fixitrepairexpress@pec.it" className="hover:text-neon-cyan">
                fixitrepairexpress@pec.it
              </a>
            </Pair>
            <Pair label="C.F.">SCCNTN89S22G793P</Pair>
            <Pair label="P. IVA">01632410526</Pair>
          </dl>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Fixit Repair Express. Tutti i diritti riservati.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-neon-cyan">Privacy</Link>
            <Link href="#" className="hover:text-neon-cyan">Termini</Link>
            <Link href="#" className="hover:text-neon-cyan">Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Pair({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <dt className="text-[11px] uppercase tracking-widest text-white/45 shrink-0">{label}</dt>
      <dd className="font-mono text-[13px] text-white/80 break-all">{children}</dd>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:border-neon-cyan/60 hover:text-neon-cyan"
    >
      {children}
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.7V4.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4v2.4H7.6V14h2.7v8h3.2z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19 8.5a6 6 0 0 1-3.7-1.3v7.4a5.4 5.4 0 1 1-5.4-5.4c.3 0 .6 0 .9.1v2.8a2.7 2.7 0 1 0 1.9 2.6V2.5h2.7A4 4 0 0 0 19 5.8v2.7z" />
    </svg>
  );
}
