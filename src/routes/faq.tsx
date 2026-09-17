import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FAQ } from "@/data/faq";

export const Route = createFileRoute("/faq")({ component: FaqPage });

function FaqPage() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return FAQ;
    return FAQ.filter((f) => f.q.toLowerCase().includes(t) || f.a.toLowerCase().includes(t));
  }, [q]);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-volt">Knowledge base</p>
      <h1 className="mt-2 font-display text-5xl uppercase">FAQ</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search PSI, shipping, returns…"
        className="mt-6 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm outline-none focus:border-volt/50"
      />
      <div className="mt-8 space-y-3">
        {list.map((f) => (
          <details key={f.q} className="rounded-[14px] border border-line bg-[rgba(14,16,18,0.55)] p-4">
            <summary className="cursor-pointer font-medium">{f.q}</summary>
            <p className="mt-2 text-sm text-muted">{f.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted">
        Still stuck?{" "}
        <Link to="/contact" className="text-volt">
          Contact desk
        </Link>
        .
      </p>
    </div>
  );
}
