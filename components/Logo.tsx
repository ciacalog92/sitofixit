import Link from "next/link";
import Image from "next/image";

type Props = {
  variant?: "full" | "mark";
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  withLink?: boolean;
};

// Asset reali:
//   /logo.png       → 1996×459  (≈ 4.35:1)  — wordmark completo
//   /logo-mark.png  →  527×527  (1:1)       — solo simbolo (smartphone + anelli)
const FULL = { src: "/logo.png", w: 1996, h: 459 };
const MARK = { src: "/logo-mark.png", w: 527, h: 527 };

export function Logo({
  variant = "full",
  className = "",
  width,
  height,
  priority,
  withLink = true,
}: Props) {
  const asset = variant === "full" ? FULL : MARK;
  const w = width ?? asset.w;
  const h = height ?? asset.h;

  const img = (
    <Image
      src={asset.src}
      alt="Fixit Repair"
      width={w}
      height={h}
      priority={priority}
      className={className}
    />
  );

  if (!withLink) return img;
  return (
    <Link
      href="/"
      aria-label="Home Fixit Repair"
      className="inline-flex items-center"
    >
      {img}
    </Link>
  );
}
