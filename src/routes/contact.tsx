import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({ component: Contact });

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", topic: "order", msg: "" });
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-volt">Support desk</p>
      <h1 className="mt-2 font-display text-5xl uppercase">Contact</h1>
      <p className="mt-2 text-muted">Indiranagar, Bengaluru · Mon–Sat 10:00–19:00 IST</p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2 font-mono text-sm">
        <div className="rounded-xl border border-line p-4">
          <dt className="text-[10px] uppercase text-subtle">Athlete helpline</dt>
          <dd className="mt-1">+91 80090 78775</dd>
        </div>
        <div className="rounded-xl border border-line p-4">
          <dt className="text-[10px] uppercase text-subtle">Lab email</dt>
          <dd className="mt-1">support@90plus.supply</dd>
        </div>
      </dl>
      <form
        className="mt-8 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Message queued on this device — we reply in production.");
          setForm({ name: "", email: "", topic: "order", msg: "" });
        }}
      >
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm outline-none focus:border-volt/50"
        />
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm outline-none focus:border-volt/50"
        />
        <select
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
          className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm outline-none focus:border-volt/50"
        >
          <option value="order">Order / tracking</option>
          <option value="lab">Custom ball lab</option>
          <option value="teams">Team / academy</option>
          <option value="returns">Returns</option>
        </select>
        <textarea
          required
          value={form.msg}
          onChange={(e) => setForm({ ...form, msg: e.target.value })}
          placeholder="How can the desk help?"
          className="min-h-32 w-full rounded-md border border-line bg-surface p-3 text-sm outline-none focus:border-volt/50"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
