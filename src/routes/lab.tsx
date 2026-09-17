import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MatchBall } from "@/components/match-ball";
import { BallOrb } from "@/components/ball-orb";
import { Button } from "@/components/ui/button";
import { COLORWAYS, FINISHES } from "@/data/colorways";
import { getProduct } from "@/data/catalog";
import { useShop } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import { toast } from "sonner";

type LabSearch = { cw?: number; fin?: number; name?: string; number?: string };

export const Route = createFileRoute("/lab")({
  validateSearch: (s: Record<string, unknown>): LabSearch => ({
    cw: Number(s.cw) || 0,
    fin: Number(s.fin) || 0,
    name: typeof s.name === "string" ? s.name.slice(0, 12) : "",
    number: typeof s.number === "string" ? s.number.slice(0, 2) : "",
  }),
  component: Lab,
});

function Lab() {
  const s = Route.useSearch();
  const [cw, setCw] = useState(s.cw ?? 0);
  const [fin, setFin] = useState(s.fin ?? 0);
  const [name, setName] = useState(s.name || "90+");
  const [number, setNumber] = useState(s.number || "10");
  const [psi, setPsi] = useState(12.6);
  const add = useShop((st) => st.add);
  const saveBuild = useShop((st) => st.saveBuild);
  const base = getProduct("ball-volt-pro");
  const price = (base?.price ?? 1299) + 150;
  const readout = useMemo(
    () => `${COLORWAYS[cw]?.name} · ${FINISHES[fin]?.name} · ${name} #${number} · ${psi.toFixed(1)} PSI`,
    [cw, fin, name, number, psi],
  );

  return (
    <div className="border-y border-line bg-bg2">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-volt">
          <span className="h-px w-8 bg-volt/70" /> Configurator
        </p>
        <h1 className="mt-3 font-display text-5xl uppercase">Match ball lab</h1>
        <p className="mt-2 max-w-xl text-muted">
          Drag the ball. Stamp a name and number. Embossed builds are final sale.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div className="lab-corners relative min-h-[520px] overflow-hidden rounded-[18px] border border-line bg-[radial-gradient(740px_480px_at_50%_42%,#171b20,#070809_82%)]">
            <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-[10px] border border-line bg-bg/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted backdrop-blur">
              Live PBR · drag to orbit
            </div>
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <BallOrb colorway={cw} finish={fin} name={name} number={number} size={280} />
            </div>
            <MatchBall colorway={cw} finish={fin} name={name} number={number} className="absolute inset-0" />
          </div>

          <div className="space-y-5 rounded-[18px] border border-line bg-[rgba(14,16,18,0.55)] p-6 backdrop-blur-xl">
            <div>
              <h5 className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-subtle">
                Colorway <em className="not-italic text-volt">{COLORWAYS[cw]?.name}</em>
              </h5>
              <div className="flex flex-wrap gap-2">
                {COLORWAYS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCw(c.id)}
                    className={cn(
                      "w-[78px] rounded-[13px] border p-1.5 text-center",
                      cw === c.id ? "border-volt bg-volt/10 shadow-[0_0_16px_rgba(200,255,46,0.2)]" : "border-line",
                    )}
                  >
                    <span className="mx-auto block aspect-square rounded-md" style={{ background: `radial-gradient(circle at 30% 30%, ${c.a}, ${c.b})` }} />
                    <span className="mt-1 block truncate font-mono text-[9px] text-muted">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h5 className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-subtle">Finish</h5>
              <div className="flex flex-wrap gap-2">
                {FINISHES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFin(f.id)}
                    className={cn(
                      "rounded-[13px] border px-3 py-2 text-xs",
                      fin === f.id ? "border-volt text-volt" : "border-line text-muted",
                    )}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-[1.4fr_0.7fr] gap-2">
              <input
                value={name}
                maxLength={12}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                className="h-11 rounded-[11px] border border-line bg-white/5 px-3 font-mono text-sm uppercase outline-none focus:border-volt/50"
                placeholder="NAME"
              />
              <input
                value={number}
                maxLength={2}
                onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
                className="h-11 rounded-[11px] border border-line bg-white/5 px-3 font-mono text-sm outline-none focus:border-volt/50"
                placeholder="10"
              />
            </div>
            <div>
              <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
                Inflation <span className="text-volt">{psi.toFixed(1)} PSI</span>
              </div>
              <input type="range" min={11.6} max={14.5} step={0.1} value={psi} onChange={(e) => setPsi(Number(e.target.value))} className="w-full accent-[#c8ff2e]" />
            </div>
            <div className="rounded-[11px] border border-dashed border-line-strong px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              {readout}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="font-mono text-[10px] text-subtle">Custom match ball</p>
                <p className="font-mono text-3xl">{inr(price)}</p>
              </div>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                add("ball-volt-pro", {
                  customName: `${name} ${psi.toFixed(1)}PSI`,
                  customNumber: number || "10",
                  priceOverride: price,
                });
                toast.success("Custom ball added to bag");
              }}
            >
              Add custom ball
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                saveBuild({ name: name || "90+", number: number || "10", cw, fin, psi });
                toast.success("Saved to locker");
              }}
            >
              Save to locker
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
