import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { COLORWAYS, FINISHES } from "@/data/colorways";
import { getProduct } from "@/data/catalog";
import { LOADOUTS } from "@/data/loadouts";
import { listOrders, listQuotes, useShop } from "@/lib/store";
import { inr } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/locker")({ component: Locker });

function Locker() {
  const wishlist = useShop((s) => s.wishlist);
  const builds = useShop((s) => s.builds);
  const add = useShop((s) => s.add);
  const removeBuild = useShop((s) => s.removeBuild);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const orders = useMemo(() => listOrders(), [builds, wishlist]);
  const quotes = useMemo(() => listQuotes(), []);
  const saved = PRODUCTS_FROM_WISH(wishlist);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-volt">Community locker room</p>
      <h1 className="mt-2 font-display text-5xl uppercase">Your kit locker</h1>
      <p className="mt-2 max-w-xl text-muted">Wishlist, lab builds, orders, and coach loadouts — stored on this device.</p>

      <section className="mt-10">
        <h2 className="font-display text-2xl uppercase">Coach loadouts</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {LOADOUTS.map((l) => {
            const items = l.items.map((id) => getProduct(id)).filter(Boolean);
            const total = items.reduce((n, p) => n + (p?.price ?? 0), 0);
            const v = (votes[l.id] ?? 0) + l.votes;
            return (
              <article key={l.id} className="flex flex-col rounded-[18px] border border-line bg-[rgba(14,16,18,0.55)] p-5">
                <p className="font-mono text-[10px] uppercase text-volt">{l.badge}</p>
                <h3 className="mt-1 font-display text-xl uppercase">{l.title}</h3>
                <p className="text-xs text-subtle">{l.author}</p>
                <p className="mt-2 text-sm text-muted">{l.desc}</p>
                <p className="mt-2 font-mono text-[10px] uppercase text-subtle">{l.pitch}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {items.map((p) =>
                    p ? (
                      <li key={p.id} className="flex justify-between">
                        <span>{p.name}</span>
                        <span className="font-mono">{inr(p.price)}</span>
                      </li>
                    ) : null,
                  )}
                </ul>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="font-mono">{inr(total)}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setVotes((m) => ({ ...m, [l.id]: (m[l.id] ?? 0) + 1 }))}
                    >
                      {v}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        items.forEach((p) => p && add(p.id));
                        toast.success(`${l.title} in bag`);
                      }}
                    >
                      Add kit
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl uppercase">Saved lab builds</h2>
        {builds.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Stamp a ball in the{" "}
            <Link to="/lab" className="text-volt">
              match lab
            </Link>{" "}
            and save it here.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {builds.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-xl border border-line p-4">
                <div>
                  <p className="font-display uppercase">
                    {b.name} #{b.number}
                  </p>
                  <p className="font-mono text-[11px] text-muted">
                    {COLORWAYS[b.cw]?.name} · {FINISHES[b.fin]?.name} · {b.psi.toFixed(1)} PSI
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/lab" search={{ cw: b.cw, fin: b.fin, name: b.name, number: b.number }}>
                      Open
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => removeBuild(b.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl uppercase">Wishlist</h2>
        {saved.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Heart a product from the shop.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {saved.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl uppercase">Orders</h2>
          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No orders on this device yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {orders.map((o) => (
                <li key={o.id} className="flex justify-between border-b border-line py-2">
                  <Link to="/track" search={{ id: o.id }} className="font-mono text-volt">
                    {o.id}
                  </Link>
                  <span>
                    {inr(o.total)} · {o.status.replaceAll("_", " ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="font-display text-2xl uppercase">Club quotes</h2>
          {quotes.length === 0 ? (
            <p className="mt-3 text-sm text-muted">
              Request from{" "}
              <Link to="/teams" className="text-volt">
                team sales
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {quotes.map((q) => (
                <li key={q.id} className="border-b border-line py-2">
                  <span className="font-mono text-volt">{q.id}</span> · {q.club} · {q.qty} kits
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function PRODUCTS_FROM_WISH(ids: string[]) {
  return ids.map((id) => getProduct(id)).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];
}
