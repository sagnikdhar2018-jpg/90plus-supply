import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BallOrb } from "@/components/ball-orb";
import type { Product } from "@/data/catalog";
import { useShop } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import { toast } from "sonner";

function stockCopy(product: Product) {
  const n = product.stockCount;
  if (product.inStock === false || n === 0) return { label: "Sold out", cls: "text-[#ff7a7a]" };
  if (typeof n === "number" && n <= 3) return { label: `Only ${n} left`, cls: "text-[#ffb199]" };
  if (typeof n === "number" && n <= 8) return { label: `Low stock · ${n}`, cls: "text-[#ffcc66]" };
  return null;
}

export function ProductCard({ product }: { product: Product }) {
  const add = useShop((s) => s.add);
  const wish = useShop((s) => s.wishlist.includes(product.id));
  const toggleWish = useShop((s) => s.toggleWish);
  const stock = stockCopy(product);

  return (
    <article className="group flex flex-col overflow-hidden rounded-[15px] border border-line bg-[rgba(14,16,18,0.55)] backdrop-blur-xl transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-volt/45 hover:shadow-[0_0_0_1px_rgba(200,255,46,0.25),0_20px_48px_rgba(0,0,0,0.7)]">
      <div className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_50%_42%,#191c1f,#101214_80%)]">
        <Link to="/product/$slug" params={{ slug: product.slug }} className="grid size-full place-items-center p-[12%]">
          <BallOrb
            colorway={product.colorwayIdx}
            finish={product.finishIdx}
            size={200}
            className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-6deg] group-hover:scale-105"
          />
        </Link>
        {product.badge ? (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-volt px-2 py-1 font-mono text-[10px] font-extrabold uppercase tracking-[0.16em] text-volt-ink shadow-[0_4px_12px_rgba(200,255,46,0.35)]">
            {product.badge}
          </span>
        ) : null}
        {stock ? (
          <span className={cn("absolute bottom-14 left-3 z-10 rounded-md border border-white/10 bg-black/55 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em]", stock.cls)}>
            {stock.label}
          </span>
        ) : null}
        <button
          type="button"
          aria-label={wish ? "Remove from wishlist" : "Save to wishlist"}
          onClick={() => toggleWish(product.id)}
          className={cn(
            "absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-[11px] border border-line bg-bg/80 backdrop-blur-md",
            wish ? "border-volt/50 text-volt" : "text-muted hover:text-volt",
          )}
        >
          <Heart className={cn("size-4", wish && "fill-volt")} />
        </button>
        <button
          type="button"
          className="notch absolute inset-x-3 bottom-3 z-10 flex h-11 items-center justify-center gap-2 bg-bg/90 font-sans text-[11px] font-bold uppercase tracking-[0.12em] opacity-100 transition-colors hover:bg-volt hover:text-volt-ink md:translate-y-[120%] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
          onClick={() => {
            if (stock?.label === "Sold out") {
              toast.error("Sold out — watch this SKU for restock");
              return;
            }
            add(product.id);
            toast.success(`${product.name} added`);
          }}
        >
          <ShoppingBag className="size-3.5" /> {stock?.label === "Sold out" ? "Notify me" : "Add to bag"}
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-[18px] pb-5 pt-4">
        <Link to="/product/$slug" params={{ slug: product.slug }} className="text-[15px] font-semibold leading-snug hover:text-volt">
          {product.name}
        </Link>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-subtle">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("size-3", i < Math.round(product.rating) ? "fill-volt text-volt" : "text-line-strong")} />
          ))}
          {product.rating} · {product.reviewsCount}
        </div>
        <div className="mt-auto flex items-center justify-between pt-2 font-mono">
          <span className="text-lg font-bold">
            {inr(product.price)}
            {product.compareAtPrice > product.price ? (
              <s className="ml-2 text-xs font-normal text-subtle">{inr(product.compareAtPrice)}</s>
            ) : null}
          </span>
        </div>
      </div>
    </article>
  );
}
