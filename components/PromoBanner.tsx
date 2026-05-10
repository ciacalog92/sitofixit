export function PromoBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-neon-cyan/20 via-neon-violet/25 to-neon-pink/20 border-b border-white/10">
      <div className="absolute inset-0 bg-grid-neon opacity-30" style={{ backgroundSize: "32px 32px" }} />
      <div className="relative container-page flex flex-col sm:flex-row items-center justify-center gap-2 py-3 text-center">
        <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-neon-pink animate-pulseNeon">
          <span className="h-2 w-2 rounded-full bg-neon-pink shadow-neon-pink" />
          PROMO
        </span>
        <span className="text-sm sm:text-base font-semibold text-white">
          Batterie a <span className="neon-text font-extrabold text-lg sm:text-xl">€39</span> — valida per tutto il mese di giugno
        </span>
        <span className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-neon-pink animate-pulseNeon">
          PROMO
          <span className="h-2 w-2 rounded-full bg-neon-pink shadow-neon-pink" />
        </span>
      </div>
    </div>
  );
}
