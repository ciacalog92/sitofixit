"use client";

import { useEffect, useState } from "react";

/**
 * Countdown all'apertura dello store.
 * Data target: 17 maggio 2026 ore 17:00 ora italiana (Europe/Rome, UTC+2 in DST).
 */
const TARGET_ISO = "2026-05-17T17:00:00+02:00";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diffParts(ms: number): Parts {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function OpeningCountdown() {
  const target = new Date(TARGET_ISO).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Server render & first paint: mostro placeholder neutro per evitare hydration mismatch
  const remaining = now == null ? null : diffParts(target - now);
  const opened = now != null && now >= target;

  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <p className="text-center text-xs sm:text-sm uppercase tracking-[0.3em] text-white/60">
        {opened ? "Siamo aperti!" : "Apertura tra"}
      </p>

      <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-4">
        <Cell label="Giorni" value={remaining?.days} pulse={!opened} />
        <Cell label="Ore" value={remaining?.hours} pulse={!opened} />
        <Cell label="Minuti" value={remaining?.minutes} pulse={!opened} />
        <Cell label="Secondi" value={remaining?.seconds} pulse highlight />
      </div>

      <p className="mt-4 text-center text-sm text-white/65">
        <span className="font-semibold text-white">Sabato 17 maggio</span>
        <span aria-hidden> · </span>
        <span className="text-neon-cyan">ore 17:00</span>
      </p>
    </div>
  );
}

function Cell({
  label,
  value,
  pulse,
  highlight,
}: {
  label: string;
  value: number | undefined;
  pulse?: boolean;
  highlight?: boolean;
}) {
  const display = value == null ? "—" : value.toString().padStart(2, "0");
  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-black/40 px-2 py-4 sm:py-5 text-center backdrop-blur ${
        highlight
          ? "border-neon-pink/40 shadow-neon-pink"
          : "border-white/10 shadow-neon-cyan/20"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 ${
          highlight
            ? "bg-gradient-to-br from-neon-pink/10 via-transparent to-neon-violet/10"
            : "bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-violet/10"
        }`}
      />
      <span
        className={`relative block font-display text-3xl sm:text-5xl font-extrabold tabular-nums neon-text ${
          pulse ? "animate-pulseNeon" : ""
        }`}
      >
        {display}
      </span>
      <span className="relative mt-1 block text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/55">
        {label}
      </span>
    </div>
  );
}
