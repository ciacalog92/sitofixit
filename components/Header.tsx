"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";

const NAV = [
  { href: "/riparazioni", label: "Riparazioni" },
  { href: "/accessori", label: "Accessori" },
  { href: "/ricondizionati", label: "Ricondizionati" },
  { href: "/stato-lavorazioni", label: "Stato Lavorazioni" },
  { href: "/prenota", label: "Prenota" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo variant="mark" priority className="sm:hidden h-10 w-10" />
        <Logo variant="full" priority className="hidden sm:block h-12 w-auto" />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/prenota" className="btn-neon ml-2 px-4 py-2 text-sm">
            Prenota riparazione
          </Link>
        </nav>

        <button
          aria-label="Apri menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-white/80"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/5 bg-black/80 backdrop-blur-xl">
          <nav className="container-page flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-white/85 hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/prenota"
              onClick={() => setOpen(false)}
              className="btn-neon mt-2"
            >
              Prenota la tua riparazione
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
