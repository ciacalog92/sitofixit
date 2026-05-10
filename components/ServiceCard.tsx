import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  href?: string;
  cta?: string;
  icon?: ReactNode;
  accent?: "cyan" | "violet" | "pink";
};

const ACCENT: Record<NonNullable<Props["accent"]>, string> = {
  cyan: "from-neon-cyan/20 to-transparent",
  violet: "from-neon-violet/25 to-transparent",
  pink: "from-neon-pink/20 to-transparent",
};

export function ServiceCard({
  title,
  description,
  href,
  cta = "Scopri di più",
  icon,
  accent = "violet",
}: Props) {
  const body = (
    <div className="card relative h-full overflow-hidden">
      <div className={`pointer-events-none absolute -top-1/2 -right-1/2 h-full w-full rounded-full bg-gradient-to-br ${ACCENT[accent]} blur-3xl opacity-60`} />
      <div className="relative">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neon-cyan">
          {icon}
        </div>
        <h3 className="mt-4 text-lg sm:text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm sm:text-base text-white/65">{description}</p>
        {href && (
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-neon-cyan group-hover:text-neon-pink transition">
            {cta}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
  if (!href) return body;
  return (
    <Link href={href} className="group block h-full">
      {body}
    </Link>
  );
}
