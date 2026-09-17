import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tactics")({ component: Tactics });

const FORMS: Record<string, { name: string; slots: [number, number][] }> = {
  "433": {
    name: "4-3-3",
    slots: [
      [50, 88],
      [18, 70],
      [38, 72],
      [62, 72],
      [82, 70],
      [30, 50],
      [50, 48],
      [70, 50],
      [18, 22],
      [50, 16],
      [82, 22],
    ],
  },
  "4231": {
    name: "4-2-3-1",
    slots: [
      [50, 88],
      [18, 70],
      [38, 72],
      [62, 72],
      [82, 70],
      [35, 52],
      [65, 52],
      [20, 32],
      [50, 30],
      [80, 32],
      [50, 14],
    ],
  },
  "352": {
    name: "3-5-2",
    slots: [
      [50, 88],
      [28, 70],
      [50, 72],
      [72, 70],
      [12, 48],
      [32, 46],
      [50, 44],
      [68, 46],
      [88, 48],
      [38, 18],
      [62, 18],
    ],
  },
  "442": {
    name: "4-4-2",
    slots: [
      [50, 88],
      [18, 70],
      [38, 72],
      [62, 72],
      [82, 70],
      [18, 44],
      [38, 46],
      [62, 46],
      [82, 44],
      [38, 16],
      [62, 16],
    ],
  },
  "532": {
    name: "5-3-2",
    slots: [
      [50, 88],
      [12, 68],
      [32, 72],
      [50, 74],
      [68, 72],
      [88, 68],
      [30, 44],
      [50, 42],
      [70, 44],
      [38, 16],
      [62, 16],
    ],
  },
};

function Tactics() {
  const [id, setId] = useState("433");
  const form = FORMS[id];
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-volt">Tactics board</p>
      <h1 className="mt-2 font-display text-5xl uppercase">Pitch whiteboard</h1>
      <p className="mt-2 max-w-xl text-muted">Five matchday shapes. Pair with the tactical advisor for kit PSI.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {Object.entries(FORMS).map(([k, v]) => (
          <button
            key={k}
            type="button"
            onClick={() => setId(k)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs uppercase",
              id === k ? "border-volt bg-volt/15 text-volt" : "border-line text-muted",
            )}
          >
            {v.name}
          </button>
        ))}
      </div>
      <div className="relative mx-auto mt-8 aspect-[3/4] max-w-lg overflow-hidden rounded-[18px] border border-volt/30 bg-[#0c3b24]">
        <div className="absolute inset-3 rounded-md border border-white/25" />
        <div className="absolute left-3 right-3 top-1/2 h-px bg-white/25" />
        <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
        <div className="absolute bottom-3 left-1/2 h-16 w-40 -translate-x-1/2 border border-white/25" />
        <div className="absolute left-1/2 top-3 h-16 w-40 -translate-x-1/2 border border-white/25" />
        {form.slots.map(([x, y], i) => (
          <span
            key={i}
            className="absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-volt font-mono text-[10px] font-bold text-volt-ink"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}
