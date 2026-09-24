import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, PRODUCTS, type CategoryId, type Product } from "@/data/catalog";
import { useShop } from "@/lib/store";
import { cn, inr } from "@/lib/utils";

type Search = { cat?: string; wish?: number };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    cat: typeof s.cat === "string" ? s.cat : undefined,
    wish: s.wish ? 1 : undefined,
  }),
  component: Shop,
});

function Shop() {
  const search = Route.useSearch();
  const [cat, setCat] = useState<CategoryId | "all">((search.cat as CategoryId) || "all");
  const [max, setMax] = useState(5000);
  const [sort, setSort] = useState<"feat" | "price" | "rate">("feat");
  const wishlist = useShop((s) => s.wishlist);
  const wishOnly = Boolean(search.wish);
  const [live, setLive] = useState<Product[]>(PRODUCTS);
  const [alerts, setAlerts] = useState<{ id: string; name: string; slug: string; stockCount: number; alert: string }[]>([]);

  useEffect(() => {
    let last = 0;
    let poll: number | null = null;
    let ws: WebSocket | null = null;
    let retry = 1500;

    function apply(data: {
      version?: number;
      items?: { id: string; stockCount: number; inStock: boolean; name: string; slug: string; alert: string }[];
    }) {
      if (!data.items) return;
      if (data.version && data.version === last) return;
      last = data.version ?? last;
      const byId = new Map(data.items.map((p) => [p.id, p]));
      setLive(
        PRODUCTS.map((p) => {
          const row = byId.get(p.id);
          return row ? { ...p, stockCount: row.stockCount, inStock: row.inStock } : p;
        }),
      );
      setAlerts(
        data.items
          .filter((p) => p.alert && p.alert !== "ok")
          .map((p) => ({ id: p.id, name: p.name, slug: p.slug, stockCount: p.stockCount, alert: p.alert })),
      );
    }

    function pull() {
      void fetch("/api/inventory/live")
        .then((r) => r.json())
        .then(apply)
        .catch(() => {});
    }

    function startPoll() {
      if (poll != null) return;
      pull();
      poll = window.setInterval(pull, 4000);
    }

    function stopPoll() {
      if (poll == null) return;
      window.clearInterval(poll);
      poll = null;
    }

    function connect() {
      // ponytail: WS only on Vite-dev (/ws/inventory plugin). Prod polls live API.
      const h = window.location.hostname;
      if (h !== "localhost" && h !== "127.0.0.1" && !h.endsWith(".local")) {
        startPoll();
        return;
      }
      const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
      try {
        ws = new WebSocket(`${proto}//${window.location.host}/ws/inventory`);
      } catch {
        startPoll();
        return;
      }
      ws.onopen = () => {
        retry = 1500;
        stopPoll();
      };
      ws.onmessage = (ev) => {
        try {
          apply(JSON.parse(String(ev.data)) as Parameters<typeof apply>[0]);
        } catch {
          /* ignore malformed tick */
        }
      };
      ws.onclose = () => {
        ws = null;
        startPoll();
        window.setTimeout(connect, retry);
        retry = Math.min(retry * 1.6, 12000);
      };
    }

    connect();
    startPoll();
    return () => {
      stopPoll();
      ws?.close();
    };
  }, []);

  const list = useMemo(() => {
    let rows = live.filter((p) => p.price <= max);
    if (wishOnly) rows = rows.filter((p) => wishlist.includes(p.id));
    if (cat !== "all") rows = rows.filter((p) => p.category === cat);
    if (sort === "price") rows = [...rows].sort((a, b) => a.price - b.price);
    if (sort === "rate") rows = [...rows].sort((a, b) => b.rating - a.rating);
    return rows;
  }, [live, cat, wishOnly, wishlist, max, sort]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <p className="inline-flex items-center gap-2 rounded-md border border-volt/40 bg-volt/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-volt">
        Live catalog
      </p>
      <h1 className="mt-4 font-display text-5xl uppercase leading-none">Match gear locker</h1>
      <p className="mt-3 max-w-xl text-muted">70 SKUs. Thermal-bonded balls, grip kit, and academy tools with telemetry filters.</p>
      {alerts.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {alerts.slice(0, 6).map((a) => (
            <a
              key={a.id}
              href={`/product/${a.slug}`}
              className="rounded-full border border-[#ff6b4a]/35 bg-[#ff5050]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#ffb199]"
            >
              {a.alert === "out" ? "Sold out" : a.alert === "critical" ? `Only ${a.stockCount} left` : `Low stock · ${a.stockCount}`} · {a.name}
            </a>
          ))}
        </div>
      ) : null}

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit space-y-6 rounded-[18px] border border-line bg-[rgba(18,20,24,0.75)] p-6 backdrop-blur-xl lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em]">
              <SlidersHorizontal className="size-4 text-volt" /> Filters
            </h2>
            <button
              type="button"
              className="font-mono text-[10px] uppercase text-muted hover:text-volt"
              onClick={() => {
                setCat("all");
                setMax(5000);
                setSort("feat");
              }}
            >
              Reset
            </button>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">Department</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCat(c.id)}
                  className={cn(
                    "rounded-full border px-3 py-2 text-[11px]",
                    cat === c.id ? "border-volt bg-volt text-volt-ink" : "border-line text-muted hover:text-fg",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">Max price</p>
              <span className="font-display text-lg text-volt">{inr(max)}</span>
            </div>
            <input
              type="range"
              min={299}
              max={5000}
              step={50}
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="mt-3 w-full accent-[#c8ff2e]"
            />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">Sort</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  ["feat", "Featured"],
                  ["price", "Price"],
                  ["rate", "Rating"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSort(id)}
                  className={cn(
                    "rounded-full border px-3 py-2 text-[11px]",
                    sort === id ? "border-volt text-volt" : "border-line text-muted",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </aside>
        <div>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">{list.length} pieces</p>
          {list.length === 0 ? (
            <p className="text-muted">Nothing matches those filters.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
