import { createFileRoute, Link } from "@tanstack/react-router";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DRILLS } from "@/data/academy";
import { getProduct } from "@/data/catalog";
import { useShop } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/academy")({ component: Academy });

const CATS = Array.from(new Set(DRILLS.map((d) => d.categoryLabel)));

function Academy() {
  const [cat, setCat] = useState(CATS[0]);
  const list = useMemo(() => DRILLS.filter((d) => d.categoryLabel === cat), [cat]);
  const [id, setId] = useState(list[0]?.id ?? DRILLS[0].id);
  const drill = DRILLS.find((d) => d.id === id) ?? DRILLS[0];
  const [phase, setPhase] = useState<"work" | "rest">("work");
  const [left, setLeft] = useState(drill.workSeconds);
  const [round, setRound] = useState(1);
  const [run, setRun] = useState(false);
  const add = useShop((s) => s.add);

  useEffect(() => {
    if (!list.some((d) => d.id === id) && list[0]) setId(list[0].id);
  }, [list, id]);

  useEffect(() => {
    setPhase("work");
    setLeft(drill.workSeconds);
    setRound(1);
    setRun(false);
  }, [drill]);

  useEffect(() => {
    if (!run) return;
    const t = setInterval(() => {
      setLeft((n) => {
        if (n > 1) return n - 1;
        if (phase === "work") {
          setPhase("rest");
          return drill.restSeconds;
        }
        setPhase("work");
        setRound((r) => Math.min(drill.defaultSets, r + 1));
        return drill.workSeconds;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [run, phase, drill]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-volt">18-drill pitch academy</p>
      <h1 className="mt-2 font-display text-5xl uppercase">Drill clock</h1>
      <p className="mt-2 max-w-xl text-muted">Six blocks. Work / rest timer. Kit links into the bag.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={cn("rounded-full border px-3 py-2 text-[11px]", cat === c ? "border-volt bg-volt/15 text-volt" : "border-line text-muted")}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="grid gap-3 sm:grid-cols-2">
          {list.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setId(d.id)}
              className={cn("rounded-[18px] border p-5 text-left", id === d.id ? "border-volt bg-volt/10" : "border-line bg-[rgba(14,16,18,0.55)]")}
            >
              <p className="font-mono text-[10px] uppercase text-subtle">{d.difficulty} · {d.duration}</p>
              <h2 className="mt-1 font-display text-xl uppercase leading-tight">{d.title}</h2>
              <p className="mt-2 text-sm text-muted">{d.desc}</p>
            </button>
          ))}
        </div>
        <aside className="h-fit space-y-4 rounded-[18px] border border-line bg-bg2 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
            Set {round}/{drill.defaultSets} · {phase}
          </p>
          <p className="text-center font-display text-7xl tabular-nums leading-none text-volt">{left}</p>
          <p className="text-center font-mono text-xs uppercase text-muted">seconds · {drill.reps}</p>
          <div className="flex justify-center gap-2">
            <Button onClick={() => setRun((v) => !v)}>
              {run ? <Pause className="size-4" /> : <Play className="size-4" />}
              {run ? "Pause" : "Start"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setRun(false);
                setPhase("work");
                setLeft(drill.workSeconds);
                setRound(1);
              }}
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>
          <ol className="space-y-1 text-sm text-muted">
            {drill.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <div className="space-y-2">
            {drill.gear.map((gid) => {
              const p = getProduct(gid);
              if (!p) return null;
              return (
                <div key={gid} className="flex items-center justify-between gap-2 text-sm">
                  <Link to="/product/$slug" params={{ slug: p.slug }} className="hover:text-volt">
                    {p.name}
                  </Link>
                  <button
                    type="button"
                    className="font-mono text-[10px] uppercase text-volt"
                    onClick={() => {
                      add(p.id);
                      toast.success(`${p.name} added`);
                    }}
                  >
                    {inr(p.price)} add
                  </button>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
