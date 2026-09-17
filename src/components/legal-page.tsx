export function LegalPage({ title, kicker, children }: { title: string; kicker: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-volt">{kicker}</p>
      <h1 className="mt-2 font-display text-5xl uppercase">{title}</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted">{children}</div>
    </div>
  );
}
