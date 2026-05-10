import Link from "next/link";
import Image from "next/image";

type Props = {
  /**
   * - "full"  → SVG completo con wordmark integrato (per hero / OG image)
   * - "mark"  → solo brand-mark (per favicon / share icon)
   * - "lockup" → brand-mark + testo HTML "Fixit Repair Express"
   *              (consigliato per header / footer, sempre nitido)
   */
  variant?: "full" | "mark" | "lockup";
  className?: string;
  /** classe applicata al solo brand-mark dentro lockup */
  markClassName?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  withLink?: boolean;
  showTagline?: boolean;
};

export function Logo({
  variant = "lockup",
  className = "",
  markClassName = "",
  width,
  height,
  priority,
  withLink = true,
  showTagline = true,
}: Props) {
  let inner: React.ReactNode;

  if (variant === "lockup") {
    inner = (
      <span className={`inline-flex items-center gap-2 sm:gap-3 ${className}`}>
        <Image
          src="/logo-mark.svg"
          alt=""
          width={64}
          height={64}
          priority={priority}
          className={`shrink-0 drop-shadow-[0_0_8px_rgba(155,92,255,0.45)] ${markClassName || "h-9 w-9 sm:h-10 sm:w-10"}`}
        />
        <span className="flex flex-col leading-none">
          <span className="font-display text-[15px] sm:text-base font-bold tracking-[0.18em] neon-text">
            FIXIT REPAIR
          </span>
          {showTagline && (
            <span className="mt-0.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.42em] text-neon-cyan">
              EXPRESS
            </span>
          )}
        </span>
      </span>
    );
  } else {
    const src = variant === "full" ? "/logo.svg" : "/logo-mark.svg";
    const w = width ?? (variant === "full" ? 360 : 80);
    const h = height ?? (variant === "full" ? 160 : 80);
    inner = (
      <Image
        src={src}
        alt="Fixit Repair Express"
        width={w}
        height={h}
        priority={priority}
        className={className}
      />
    );
  }

  if (!withLink) return <>{inner}</>;
  return (
    <Link
      href="/"
      aria-label="Home Fixit Repair Express"
      className="inline-flex items-center"
    >
      {inner}
    </Link>
  );
}
