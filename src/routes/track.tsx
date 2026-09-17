import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { inr } from "@/lib/utils";

type Search = { id?: string };
type Tracked = {
  id: string;
  city: string;
  total: number;
  status: string;
  trackingNumber: string | null;
  items: { name: string; qty: number; unitPrice: number }[];
};

export const Route = createFileRoute("/track")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    id: typeof s.id === "string" ? s.id : undefined,
  }),
  component: Track,
});

const STEPS = ["packed", "dispatched", "out_for_delivery", "delivered"];

function Track() {
  const { id: qid } = Route.useSearch();
  const [id, setId] = useState(qid ?? "");
  const [found, setFound] = useState<Tracked | null>(null);
  const [missing, setMissing] = useState(false);
  const [busy, setBusy] = useState(false);

  async function lookup(orderId: string) {
    const clean = orderId.trim();
    if (!clean) return;
    setBusy(true);
    setMissing(false);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(clean)}`);
      const data = (await res.json()) as { order?: Tracked };
      if (!res.ok || !data.order) {
        setFound(null);
        setMissing(true);
        return;
      }
      setFound(data.order);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (qid) void lookup(qid);
  }, [qid]);

  return (
    <div className="mx-auto max-w-lg px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl uppercase">Track order</h1>
      <p className="mt-2 text-sm text-muted">Look up a 90+ order ID from checkout.</p>
      <form
        className="mt-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void lookup(id);
        }}
      >
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="90P…"
          className="h-11 flex-1 rounded-md border border-line bg-surface px-3 font-mono text-sm outline-none focus:border-volt/50"
        />
        <Button type="submit" disabled={busy}>
          {busy ? "…" : "Track"}
        </Button>
      </form>

      {missing ? <p className="mt-6 text-sm text-muted">No order with that ID.</p> : null}

      {found ? (
        <div className="mt-8 rounded-xl border border-line bg-surface p-5">
          <p className="font-mono text-sm text-volt">{found.id}</p>
          <p className="mt-1 text-sm text-muted">
            {found.city} · {inr(found.total)}
            {found.trackingNumber ? ` · ${found.trackingNumber}` : ""}
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {found.items.map((item) => (
              <li key={item.name} className="flex justify-between">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span className="font-mono">{inr(item.unitPrice * item.qty)}</span>
              </li>
            ))}
          </ul>
          <ol className="mt-5 space-y-3">
            {STEPS.map((step, i) => {
              const active = STEPS.indexOf(found.status) >= i;
              return (
                <li key={step} className="flex items-center gap-3 text-sm">
                  <span className={`size-2 rounded-full ${active ? "bg-volt" : "bg-line-strong"}`} />
                  <span className={active ? "text-fg" : "text-subtle"}>{step.replaceAll("_", " ")}</span>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
