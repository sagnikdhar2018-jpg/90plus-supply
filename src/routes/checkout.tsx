import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { getBearerToken } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cartTotal, useShop } from "@/lib/store";
import { inr } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({ component: Checkout });

function Checkout() {
  const { user, isPending } = useCurrentUserState();
  const cart = useShop((s) => s.cart);
  const clear = useShop((s) => s.clear);
  const total = cartTotal(cart);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", pin: "", code: "" });
  const [busy, setBusy] = useState(false);

  if (isPending) return <div className="mx-auto max-w-lg px-4 py-16 text-muted">Loading checkout…</div>;
  if (!user) return <RedirectToSignIn />;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-muted">Nothing to check out.</p>
        <Button asChild className="mt-4">
          <Link to="/shop">Shop</Link>
        </Button>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.city.trim() || form.pin.length < 6) {
      toast.error("Fill name, email, phone, city, and 6-digit PIN");
      return;
    }
    setBusy(true);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const token = getBearerToken();
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch("/api/orders", {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          pin: form.pin,
          coupon: form.code,
          paymentMethod: "cod",
          lines: cart.map((l) => ({
            productId: l.productId,
            qty: l.qty,
            customName: l.customName,
            customNumber: l.customNumber,
          })),
        }),
      });
      const data = (await res.json()) as { order?: { id: string; total: number }; error?: string };
      if (!res.ok || !data.order) throw new Error(data.error || "Could not place order");
      clear();
      toast.success(`Order ${data.order.id} placed · ${inr(data.order.total)}`);
      void navigate({ to: "/track", search: { id: data.order.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl uppercase">Checkout</h1>
      <p className="mt-2 text-sm text-muted">
        Signed in as {user.primaryEmail ?? user.displayName}. Total {inr(total)}. FIRST90 takes ₹150 off.
      </p>
      <form className="mt-8 space-y-3" onSubmit={(e) => void onSubmit(e)}>
        {(
          [
            ["name", "Full name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["address", "Address"],
            ["city", "City"],
            ["pin", "PIN code"],
            ["code", "Code (FIRST90)"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block text-xs uppercase tracking-[0.12em] text-subtle">
            {label}
            <input
              required={key !== "code"}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-fg outline-none focus:border-volt/50"
            />
          </label>
        ))}
        <Button type="submit" disabled={busy} className="mt-4 w-full">
          {busy ? "Placing…" : `Place order · ${inr(total)}`}
        </Button>
      </form>
    </div>
  );
}
