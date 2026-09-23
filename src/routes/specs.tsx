import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/specs")({ component: Specs });

const ROWS = [
  ["Seam fusion", "Thermal weld, zero stitch", "Machine hybrid stitch", "Hand stitch 32-panel"],
  ["PU thickness", "1.2 mm textured", "0.9 mm standard", "0.6 mm PVC"],
  ["Monsoon water uptake", "0.0% sealed", "1.8%", "6.5% weight gain"],
  ["Bladder", "Butyl + multi-ply", "Latex (weekly top-up)", "Rubber"],
  ["Rebound e (2 m drop)", "0.82 / 145 cm", "0.74 / 130 cm", "0.62 / 115 cm"],
  ["Drag Cd", "0.22 micro-dimple", "0.29 smooth", "0.34 drift"],
  ["Certification", "FIFA Quality Pro equiv.", "FIFA Basic", "Recreational"],
];

function Specs() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-volt">Telemetry matrix</p>
      <h1 className="mt-2 font-display text-5xl uppercase">Gear specs</h1>
      <p className="mt-2 max-w-xl text-muted">How a 90+ Pro match ball stacks against a standard FIFA ball and a training ball.</p>
      <div className="mt-8 overflow-x-auto rounded-[18px] border border-line">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-bg2 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
            <tr>
              <th className="px-4 py-3">Parameter</th>
              <th className="px-4 py-3 text-volt">90+ Pro match</th>
              <th className="px-4 py-3">Standard FIFA</th>
              <th className="px-4 py-3">Training grade</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r[0]} className="border-t border-line">
                {r.map((c, i) => (
                  <td key={i} className={`px-4 py-3 ${i === 1 ? "text-volt" : "text-muted"}`}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
