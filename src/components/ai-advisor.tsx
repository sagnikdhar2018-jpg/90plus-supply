import { Cpu, Loader2, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { POSITIONS, SURFACES, STYLES, recommend } from "@/data/tactics";
import { askMatchAi } from "@/lib/ai";
import { useShop } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import { toast } from "sonner";

export function AiAdvisor() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState("ST");
  const [surface, setSurface] = useState("FG");
  const [style, setStyle] = useState("SPEED");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<{ who: "bot" | "user"; text: string }[]>([
    { who: "bot", text: "Ask about PSI, shipping, returns, sizing, or which kit fits your role." },
  ]);
  const rec = useMemo(() => recommend(pos, surface, style), [pos, surface, style]);
  const add = useShop((s) => s.add);
  const navigate = useNavigate();

  async function ask() {
    const question = q.trim();
    if (!question || busy) return;
    setQ("");
    setLog((l) => [...l, { who: "user", text: question }]);
    setBusy(true);
    const ctx = rec.items.map((p) => `${p.name} ${p.id} ${p.price}`).join("; ");
    const res = await askMatchAi({ data: { question, context: `Kit: ${rec.title}. PSI ${rec.psi}. ${ctx}` } });
    setBusy(false);
    if (!res.ok) {
      setLog((l) => [...l, { who: "bot", text: res.error }]);
      return;
    }
    setLog((l) => [...l, { who: "bot", text: res.text }]);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-[22px] right-4 z-40 inline-flex min-h-11 items-center gap-2 rounded-full border border-volt/50 bg-bg px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-fg shadow-[0_12px_32px_rgba(0,0,0,0.55)] md:right-6"
      >
        <span className="size-2 rounded-full bg-volt" />
        <Cpu className="size-4 text-volt" />
        <span className="hidden sm:inline">Tactical advisor</span>
        <span className="rounded-sm bg-volt px-1.5 py-0.5 text-[9px] text-volt-ink">AI</span>
      </button>

      {open ? (
      <div
        className="fixed inset-0 z-50 flex justify-end bg-bg/70"
        onClick={() => setOpen(false)}
      >
        <aside
          className={cn(
            "flex h-full w-full max-w-[480px] flex-col border-l border-line bg-bg2 transition-transform duration-300",
            open ? "translate-x-0" : "translate-x-full",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <header className="flex items-start justify-between border-b border-line px-5 py-4">
            <div>
              <p className="font-display text-lg uppercase tracking-wide">Matchday tactical AI</p>
              <p className="text-sm text-muted">Kit, PSI, and pitch advice</p>
            </div>
            <Button variant="icon" size="icon" aria-label="Close advisor" onClick={() => setOpen(false)}>
              <X className="size-4" />
            </Button>
          </header>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
            <ChipGroup label="01 Position" value={pos} onChange={setPos} options={POSITIONS.map((p) => ({ id: p.id, label: p.title }))} />
            <ChipGroup label="02 Surface" value={surface} onChange={setSurface} options={SURFACES.map((s) => ({ id: s.id, label: s.label }))} />
            <ChipGroup label="03 Style" value={style} onChange={setStyle} options={STYLES.map((s) => ({ id: s.id, label: s.label }))} />

            <div className="space-y-3 rounded-lg border border-volt/30 bg-surface p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{rec.title} kit</h3>
                <span className="rounded-sm border border-volt/40 bg-volt/10 px-2 py-0.5 font-mono text-[10px] text-volt">
                  {rec.match}% match
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Calibrated PSI" value={`${rec.psi} PSI`} />
                <Stat label="Surface" value={rec.surfaceNote} />
              </div>
              <p className="border-l-2 border-volt pl-3 text-sm text-muted">{rec.tip}</p>
              <ul className="space-y-2">
                {rec.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-sm">
                    <span>{item.name}</span>
                    <span className="font-mono text-volt">{inr(item.price)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-end justify-between border-t border-line pt-3">
                <div>
                  <p className="font-mono text-xs text-subtle">MRP {inr(rec.original)}</p>
                  <p className="font-mono text-xl">{inr(rec.bundle)}</p>
                </div>
                <span className="font-mono text-[10px] uppercase text-volt">15% bundle</span>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  rec.items.forEach((item) =>
                    add(item.id, {
                      priceOverride: Math.round(item.price * 0.85),
                      customName: `${rec.pos} kit`,
                    }),
                  );
                  toast.success(`Added ${rec.title} kit`);
                  setOpen(false);
                }}
              >
                <ShoppingBag className="size-4" /> Add kit
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setOpen(false);
                  navigate({ to: "/lab", search: { cw: rec.cw, fin: rec.fin, name: `TACTICAL ${rec.pos}`, number: rec.pos === "GK" ? "1" : "10" } });
                }}
              >
                <SlidersHorizontal className="size-4" /> Test ball in lab
              </Button>
            </div>

            <div className="rounded-lg border border-line p-3">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">04 Ask the advisor</p>
              <div className="mb-3 max-h-40 space-y-2 overflow-y-auto">
                {log.map((m, i) => (
                  <p
                    key={i}
                    className={cn(
                      "max-w-[92%] rounded-md px-3 py-2 text-sm",
                      m.who === "bot" ? "border border-volt/20 bg-volt/5 text-muted" : "ml-auto border border-line bg-surface",
                    )}
                  >
                    {m.text}
                  </p>
                ))}
              </div>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void ask();
                }}
              >
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  maxLength={240}
                  placeholder="What PSI for wet turf?"
                  className="h-11 min-w-0 flex-1 rounded-md border border-line bg-bg px-3 text-sm outline-none focus:border-volt/50"
                />
                <Button type="submit" disabled={busy}>
                  {busy ? <Loader2 className="size-4 animate-spin" /> : "Ask"}
                </Button>
              </form>
            </div>
          </div>
        </aside>
      </div>
      ) : null}
    </>
  );
}

function ChipGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={cn(
              "min-h-10 rounded-full border px-3 text-xs",
              value === o.id ? "border-volt bg-volt/15 text-volt" : "border-line text-muted hover:border-line-strong",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-bg px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-wider text-subtle">{label}</p>
      <p className="font-mono text-sm text-volt">{value}</p>
    </div>
  );
}
