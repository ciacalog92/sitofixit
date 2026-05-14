import Link from "next/link";
import { Logo } from "./Logo";
import { OpeningCountdown } from "./OpeningCountdown";

/**
 * Poster "Prossima Apertura" ricostruito in codice (no immagini).
 * Mobile-first, responsive, coerente con la palette neon del brand.
 */
export function OpeningPoster() {
  return (
    <section className="relative overflow-hidden">
      {/* Sfondi decorativi */}
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div
        className="pointer-events-none absolute inset-0 bg-grid-neon opacity-30"
        style={{ backgroundSize: "44px 44px" }}
      />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-neon-violet/30 blur-3xl" />

      <div className="container-page relative py-16 sm:py-20 lg:py-24">
        {/* Header poster */}
        <header className="flex flex-col items-center text-center">
          <Logo
            variant="full"
            priority
            withLink={false}
            className="w-full max-w-sm sm:max-w-xl h-auto"
          />
          <p className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-neon-cyan">
            Ripariamo, velocemente, con cura.
          </p>
        </header>

        {/* Titolo gigante */}
        <div className="mt-10 sm:mt-14 text-center">
          <p className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            PROSSIMA
          </p>
          <h1 className="font-display text-6xl sm:text-8xl lg:text-9xl font-black leading-none tracking-tight neon-text animate-pulseNeon">
            APERTURA!
          </h1>

          {/* Pill "TI ASPETTIAMO" */}
          <div className="mt-6 inline-flex items-center gap-3">
            <span aria-hidden className="h-px w-6 sm:w-10 bg-gradient-to-r from-transparent to-neon-cyan" />
            <span className="rounded-full bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink px-5 py-2 text-sm sm:text-base font-extrabold uppercase tracking-widest text-black shadow-neon">
              Ti aspettiamo!
            </span>
            <span aria-hidden className="h-px w-6 sm:w-10 bg-gradient-to-l from-transparent to-neon-pink" />
          </div>

          {/* Countdown all'apertura */}
          <OpeningCountdown />
        </div>

        {/* Servizi */}
        <ul className="mx-auto mt-12 sm:mt-16 grid max-w-2xl gap-3 sm:gap-4">
          {SERVICES.map((s) => (
            <li
              key={s.label}
              className="card flex items-center gap-4 sm:gap-5 py-4 sm:py-5"
            >
              <span className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-neon-cyan">
                {s.icon}
              </span>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm uppercase tracking-widest text-white/60">
                  {s.kicker}
                </p>
                <p className="text-lg sm:text-2xl font-extrabold neon-text leading-tight">
                  {s.label}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* USP veloci / affidabili / con cura */}
        <div className="mt-12 sm:mt-16 rounded-3xl neon-border glass p-5 sm:p-8">
          <ul className="grid gap-6 sm:grid-cols-3 sm:gap-4">
            {USPS.map((u) => (
              <li key={u.title} className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-3 sm:text-center">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${u.tone}`}>
                  {u.icon}
                </span>
                <div>
                  <p className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                    {u.title}
                  </p>
                  <p className="mt-1 text-sm text-white/65">{u.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer poster: indirizzo + social + CTA */}
        <div className="mt-12 sm:mt-16 grid gap-8 lg:grid-cols-3 lg:items-center">
          {/* CTA testuale */}
          <div>
            <p className="font-display text-2xl sm:text-3xl font-black neon-text">
              TI ASPETTIAMO!
            </p>
            <p className="mt-2 text-sm sm:text-base text-white/70 max-w-sm">
              Scopri le offerte di apertura e tante sorprese per te.
            </p>
            <Link href="/stato-lavorazioni" className="btn-neon mt-4">
              Resta aggiornato
            </Link>
          </div>

          {/* Indirizzo */}
          <address className="not-italic flex items-start gap-3 text-white/85">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neon-cyan">
              <PinIcon />
            </span>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/50">Dove siamo</p>
              <p className="mt-1 font-semibold">Via 4 Novembre, 434</p>
              <p className="text-white/70">53014 Monteroni d&apos;Arbia (SI)</p>
            </div>
          </address>

          {/* Social */}
          <div className="lg:text-right">
            <p className="text-xs uppercase tracking-widest text-white/50">Seguici su</p>
            <div className="mt-3 flex gap-3 lg:justify-end">
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
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SERVICES = [
  { kicker: "Riparazione", label: "Smartphone", icon: <SmartphoneIcon /> },
  { kicker: "Riparazione", label: "Computer", icon: <LaptopIcon /> },
  { kicker: "Riparazione", label: "Tablet", icon: <TabletIcon /> },
  { kicker: "Console e", label: "Accessori", icon: <GamepadIcon /> },
  { kicker: "Assistenza", label: "Tecnica", icon: <GearIcon /> },
];

const USPS = [
  {
    title: "VELOCI",
    text: "Riparazioni rapide e professionali",
    icon: <StopwatchIcon />,
    tone: "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan",
  },
  {
    title: "AFFIDABILI",
    text: "Ricambi di qualità e garanzia",
    icon: <ShieldCheckIcon />,
    tone: "border-neon-violet/40 bg-neon-violet/10 text-neon-violet",
  },
  {
    title: "CON CURA",
    text: "Trattiamo i tuoi dispositivi come se fossero i nostri",
    icon: <HeartIcon />,
    tone: "border-neon-pink/40 bg-neon-pink/10 text-neon-pink",
  },
];

// ---------------------------------------------------------------------------
// Icone SVG (no image)
// ---------------------------------------------------------------------------

const baseIcon = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function SmartphoneIcon() {
  return (
    <svg {...baseIcon}>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}
function LaptopIcon() {
  return (
    <svg {...baseIcon}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M2 20h20" />
    </svg>
  );
}
function TabletIcon() {
  return (
    <svg {...baseIcon}>
      <rect x="4" y="2" width="16" height="20" rx="3" />
      <line x1="10" y1="19" x2="14" y2="19" />
    </svg>
  );
}
function GamepadIcon() {
  return (
    <svg {...baseIcon}>
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <circle cx="16" cy="11" r="0.6" fill="currentColor" />
      <circle cx="18" cy="13" r="0.6" fill="currentColor" />
      <path d="M7 17a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4l-2-2H9z" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg {...baseIcon}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.4 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.4l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}
function StopwatchIcon() {
  return (
    <svg {...baseIcon}>
      <circle cx="12" cy="14" r="8" />
      <path d="M12 10v4l2 2" />
      <path d="M9 2h6" />
      <path d="M12 2v3" />
    </svg>
  );
}
function ShieldCheckIcon() {
  return (
    <svg {...baseIcon}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg {...baseIcon}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg {...baseIcon}>
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
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
