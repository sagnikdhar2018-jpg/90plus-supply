import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/trajectory")({ component: Trajectory });

function sim(speed: number, spin: number, elev: number) {
  const v = speed / 3.6;
  const th = (elev * Math.PI) / 180;
  const vx = v * Math.cos(th);
  const vy0 = v * Math.sin(th);
  const k = (spin / 800) * 0.35;
  const g = 9.81;
  const pts: { x: number; y: number }[] = [];
  let x = 0,
    y = 0.11,
    t = 0;
  while (t < 4 && y >= 0) {
    const vy = vy0 - g * t + k * vx * t * 0.15;
    x = vx * t;
    y = 0.11 + vy0 * t - 0.5 * g * t * t + k * t * t * 2.2;
    if (y < 0) break;
    pts.push({ x, y });
    t += 0.02;
  }
  const range = pts.at(-1)?.x ?? 0;
  const apex = pts.reduce((m, p) => Math.max(m, p.y), 0);
  const cd = 0.22 + Math.abs(spin) / 6000;
  return { pts, range, apex, cd, t };
}

function Trajectory() {
  const [speed, setSpeed] = useState(118);
  const [spin, setSpin] = useState(440);
  const [elev, setElev] = useState(16);
  const [az, setAz] = useState(8);
  const radar = useRef<HTMLCanvasElement>(null);
  const flight = useRef<HTMLCanvasElement>(null);
  const data = sim(speed, spin, elev);

  useEffect(() => {
    const c = radar.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const w = (c.width = 420);
    const h = (c.height = 420);
    const cx = w / 2;
    const cy = h / 2 + 8;
    const maxR = 170;
    ctx.fillStyle = "#0a0c0e";
    ctx.fillRect(0, 0, w, h);
    [0.25, 0.5, 0.75, 1].forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * r, 0, Math.PI * 2);
      ctx.strokeStyle = i === 3 ? "rgba(200,255,46,0.45)" : "rgba(255,255,255,0.08)";
      ctx.stroke();
    });
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.moveTo(cx - maxR, cy);
    ctx.lineTo(cx + maxR, cy);
    ctx.moveTo(cx, cy - maxR);
    ctx.lineTo(cx, cy + maxR);
    ctx.stroke();
    const norm = Math.min(1, speed / 140);
    const ang = ((az - 90) * Math.PI) / 180;
    const vx = cx + Math.cos(ang) * maxR * norm;
    const vy = cy + Math.sin(ang) * maxR * norm;
    ctx.strokeStyle = "#c8ff2e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(vx, vy);
    ctx.stroke();
    ctx.fillStyle = "#c8ff2e";
    ctx.beginPath();
    ctx.arc(vx, vy, 4, 0, Math.PI * 2);
    ctx.fill();
    const mag = (Math.abs(spin) / 800) * 45;
    const perp = ang + (Math.PI / 2) * (spin >= 0 ? 1 : -1);
    ctx.strokeStyle = spin >= 0 ? "#7fd4ff" : "#ff7a6b";
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.lineTo(vx + Math.cos(perp) * mag, vy + Math.sin(perp) * mag);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#c8ff2e";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.fillText(`V_EXIT ${speed} km/h`, 16, 22);
    ctx.fillStyle = spin >= 0 ? "#7fd4ff" : "#ff7a6b";
    ctx.fillText(`MAGNUS ${spin >= 0 ? "+" : ""}${spin} RPM`, 16, 38);
    ctx.fillStyle = "#98a0a4";
    ctx.fillText(`Cd ${data.cd.toFixed(3)}`, 16, 54);
  }, [speed, spin, az, data.cd]);

  useEffect(() => {
    const c = flight.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const w = (c.width = 720);
    const h = (c.height = 280);
    ctx.fillStyle = "#0a0c0e";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.moveTo(24, h - 28);
    ctx.lineTo(w - 12, h - 28);
    ctx.stroke();
    const maxX = Math.max(28, data.range);
    const maxY = Math.max(4, data.apex);
    ctx.strokeStyle = "#c8ff2e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.pts.forEach((p, i) => {
      const x = 24 + (p.x / maxX) * (w - 48);
      const y = h - 28 - (p.y / maxY) * (h - 56);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = "#98a0a4";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.fillText(`${data.range.toFixed(1)} m range · ${data.apex.toFixed(1)} m apex`, 24, 20);
  }, [data]);

  const rating = speed >= 110 && Math.abs(spin) >= 300 ? "Tournament strike" : speed < 70 ? "Wall intercept risk" : "Calibrated";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-volt">Free-kick CFD studio</p>
      <h1 className="mt-2 font-display text-5xl uppercase">Magnus flight radar</h1>
      <p className="mt-2 max-w-xl text-muted">Tune exit velocity, spin, and elevation. Vector and range update live — no login.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[18px] border border-line bg-bg2">
            <canvas ref={radar} className="mx-auto block w-full max-w-[420px]" />
          </div>
          <div className="overflow-hidden rounded-[18px] border border-line bg-bg2">
            <canvas ref={flight} className="block w-full" />
          </div>
        </div>
        <aside className="h-fit space-y-5 rounded-[18px] border border-line bg-[rgba(14,16,18,0.55)] p-6">
          {(
            [
              ["Exit speed", speed, 50, 140, 1, "km/h", setSpeed],
              ["Spin", spin, -800, 800, 10, "RPM", setSpin],
              ["Elevation", elev, 4, 40, 0.5, "deg", setElev],
              ["Azimuth", az, -30, 30, 1, "deg", setAz],
            ] as const
          ).map(([label, val, min, max, step, unit, set]) => (
            <label key={label} className="block">
              <span className="flex justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
                {label}{" "}
                <b className="text-volt">
                  {val} {unit}
                </b>
              </span>
              <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => set(Number(e.target.value))} className="mt-2 w-full accent-[#c8ff2e]" />
            </label>
          ))}
          <p className="rounded-md border border-volt/30 bg-volt/10 px-3 py-2 font-mono text-[11px] uppercase text-volt">{rating}</p>
          <p className="text-sm text-muted">
            Range {data.range.toFixed(1)} m · hang {data.t.toFixed(2)} s. Pair with the{" "}
            <Link to="/lab" className="text-volt">
              match lab
            </Link>{" "}
            at 12.8–13.2 PSI for knuckle.
          </p>
          <Button asChild className="w-full">
            <Link to="/academy">Train this strike</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
