import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/data/catalog";
import { cartTotal, linePrice, useShop } from "@/lib/store";
import { inr } from "@/lib/utils";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const cart = useShop((s) => s.cart);
  const setQty = useShop((s) => s.setQty);
  const remove = useShop((s) => s.remove);
  const total = cartTotal(cart);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl uppercase">Bag</h1>
      {cart.length === 0 ? (
        <div className="mt-10 rounded-xl border border-line p-8 text-center">
          <p className="text-muted">Your bag is empty.</p>
          <Button asChild className="mt-4">
            <Link to="/shop">Shop gear</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {cart.map((line) => {
            const p = getProduct(line.productId);
            return (
              <div key={line.key} className="flex items-center gap-4 rounded-lg border border-line bg-surface p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p?.name ?? line.productId}</p>
                  {line.customName ? (
                    <p className="font-mono text-[11px] text-muted">
                      {line.customName} {line.customNumber}
                    </p>
                  ) : null}
                  <p className="font-mono text-sm text-volt">{inr(linePrice(line))}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="grid size-10 place-items-center rounded-md border border-line" onClick={() => setQty(line.key, line.qty - 1)}>
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-6 text-center font-mono text-sm">{line.qty}</span>
                  <button type="button" className="grid size-10 place-items-center rounded-md border border-line" onClick={() => setQty(line.key, line.qty + 1)}>
                    <Plus className="size-3.5" />
                  </button>
                  <button type="button" className="grid size-10 place-items-center text-muted hover:text-danger" onClick={() => remove(line.key)} aria-label="Remove">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
          <div className="flex items-center justify-between border-t border-line pt-4">
            <span className="text-muted">Total</span>
            <span className="font-mono text-2xl">{inr(total)}</span>
          </div>
          <Button asChild className="w-full">
            <Link to="/checkout">Checkout</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
