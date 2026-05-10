import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page py-24 text-center">
      <p className="font-mono text-sm text-neon-cyan">404</p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold neon-text">
        Pagina non trovata
      </h1>
      <p className="mx-auto mt-4 max-w-md text-white/65">
        La pagina che cerchi non esiste o è stata spostata.
      </p>
      <Link href="/" className="btn-neon mt-8 inline-flex">
        Torna alla home
      </Link>
    </section>
  );
}
