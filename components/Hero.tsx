import Link from "next/link";
import { Logo } from "./Logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div
        className="absolute inset-0 bg-grid-neon opacity-40"
        style={{ backgroundSize: "44px 44px" }}
      />
      <div className="container-page relative pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="chip mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-pink shadow-neon-pink animate-pulseNeon" />
              Officina tech · Riparazioni express
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
              <span className="neon-text">Ripariamo</span> il tuo device.
              <br />
              <span className="text-white">Velocemente. Garantito.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg text-white/70">
              Smartphone, tablet, console e accessori premium. Ricondizionati
              certificati e tracking riparazioni in tempo reale, collegato
              direttamente al nostro gestionale.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/stato-lavorazioni" className="btn-neon">
                Stato lavorazioni
                <ArrowRight />
              </Link>
              <Link href="/riparazioni" className="btn-ghost">
                Scopri le riparazioni
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              <Stat value="24h" label="Riparazioni express" />
              <Stat value="12+" label="Mesi garanzia" />
              <Stat value="10k+" label="Clienti soddisfatti" />
            </dl>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-neon-cyan/20 via-neon-violet/20 to-neon-pink/20 blur-2xl" />
              <div className="relative h-full w-full rounded-[2rem] neon-border glass p-6 sm:p-10 flex items-center justify-center scanline overflow-hidden">
                <Logo variant="full" className="w-full h-auto max-w-md sm:max-w-lg animate-pulseNeon" priority withLink={false} />
              </div>
              <div className="pointer-events-none absolute -bottom-4 -right-4 hidden sm:block">
                <span className="chip backdrop-blur">Premium · Tech</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-2xl sm:text-3xl font-bold neon-text">{value}</dt>
      <dd className="mt-1 text-xs sm:text-sm text-white/60">{label}</dd>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
