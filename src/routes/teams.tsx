import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { saveQuote } from "@/lib/store";
import { inr } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/teams")({ component: Teams });

const TIERS = [
  { n: "11–24", off: 8, note: "Club starter" },
  { n: "25–49", off: 12, note: "Academy pack" },
  { n: "50–99", off: 16, note: "Squad season" },
  { n: "100+", off: 22, note: "Federation" },
];

function Teams() {
  const [form, setForm] = useState({ club: "", contact: "", email: "", phone: "", qty: "24", note: "" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-volt">B2B squad sales</p>
      <h1 className="mt-2 font-display text-5xl uppercase">Academy & club kits</h1>
      <p className="mt-2 max-w-xl text-muted">Volume pricing on match balls, grip socks, and guards. Quote stored on this device — we follow up by email in production.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((t) => (
          <div key={t.n} className="rounded-[18px] border border-line bg-[rgba(14,16,18,0.55)] p-6">
            <p className="font-mono text-[10px] uppercase text-subtle">{t.note}</p>
            <p className="mt-2 font-display text-3xl uppercase">{t.n}</p>
            <p className="mt-1 text-volt">{t.off}% off MRP</p>
            <p className="mt-3 text-sm text-muted">Example Volt Pro {inr(Math.round(1299 * (1 - t.off / 100)))} each</p>
          </div>
        ))}
      </div>
      <form
        className="mt-10 grid max-w-xl gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.club.trim() || !form.email.trim()) {
            toast.error("Club name and email required");
            return;
          }
          saveQuote({
            id: `QT${Date.now().toString(36).toUpperCase()}`,
            ...form,
            qty: Number(form.qty) || 11,
            at: Date.now(),
          });
          toast.success("Quote saved — check locker room");
          setForm({ club: "", contact: "", email: "", phone: "", qty: "24", note: "" });
        }}
      >
        <h2 className="font-display text-2xl uppercase">Request a quote</h2>
        {(
          [
            ["club", "Club / academy"],
            ["contact", "Contact name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["qty", "Kit count"],
          ] as const
        ).map(([k, label]) => (
          <label key={k} className="block text-xs uppercase tracking-[0.12em] text-subtle">
            {label}
            <input
              required={k === "club" || k === "email"}
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 font-sans text-sm normal-case tracking-normal text-fg outline-none focus:border-volt/50"
            />
          </label>
        ))}
        <textarea
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="Crest colours, delivery city, season dates"
          className="min-h-24 rounded-md border border-line bg-surface p-3 text-sm outline-none focus:border-volt/50"
        />
        <Button type="submit">Save quote</Button>
      </form>
    </div>
  );
}
