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

export function Logo({
  variant = "full",
  className = "",
  width,
  height,
  priority,
  withLink = true,
}: Props) {
  const src = variant === "full" ? "/logo.svg" : "/logo-mark.svg";
  const w = width ?? (variant === "full" ? 180 : 40);
  const h = height ?? (variant === "full" ? 60 : 40);

  const img = (
    <Image
      src={src}
      alt="Fixit Repair Express"
      width={w}
      height={h}
      priority={priority}
      className={className}
    />
  );

  if (!withLink) return img;
  return (
    <Link href="/" aria-label="Home Fixit Repair Express" className="inline-flex items-center">
      {img}
    </Link>
  );
}
