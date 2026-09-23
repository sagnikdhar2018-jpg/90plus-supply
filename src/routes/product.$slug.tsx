import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { MatchBall } from "@/components/match-ball";
import { BallOrb } from "@/components/ball-orb";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { getProductBySlug, PRODUCTS } from "@/data/catalog";
import { useShop } from "@/lib/store";
import { inr } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const add = useShop((s) => s.add);
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <Link to="/shop" className="text-xs uppercase tracking-[0.16em] text-muted hover:text-volt">
        Back to shop
      </Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="relative min-h-[420px] overflow-hidden rounded-[18px] border border-line bg-[radial-gradient(circle_at_50%_42%,#191c1f,#101214_80%)]">
          {product.category === "balls" ? (
            <MatchBall colorway={product.colorwayIdx} finish={product.finishIdx} name={product.name.split(" ")[0]} className="absolute inset-0" />
          ) : (
            <div className="grid size-full min-h-[420px] place-items-center p-10">
              <BallOrb colorway={product.colorwayIdx} finish={product.finishIdx} size={280} />
            </div>
          )}
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">{product.categoryLabel}</p>
          <h1 className="mt-2 font-display text-4xl uppercase leading-tight">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted">
            <Star className="size-4 fill-volt text-volt" />
            {product.rating} · {product.reviewsCount} reviews · {product.sku}
            <button
              type="button"
              className="font-mono text-[10px] uppercase text-volt"
              onClick={() => {
                void navigator.clipboard.writeText(product.sku);
                toast.success("SKU copied");
              }}
            >
              Copy
            </button>
          </div>
          <p className="mt-4 font-mono text-2xl">
            {inr(product.price)}
            {product.compareAtPrice > product.price ? (
              <s className="ml-3 text-base text-subtle">{inr(product.compareAtPrice)}</s>
            ) : null}
          </p>
          <p className="mt-4 text-muted">{product.fullDesc || product.shortDesc}</p>
          <ul className="mt-5 space-y-2 text-sm text-muted">
            {product.features.map((f) => (
              <li key={f} className="border-l border-volt/50 pl-3">
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              onClick={() => {
                add(product.id);
                toast.success("Added to bag");
              }}
            >
              Add to bag
            </Button>
            <Button asChild variant="ghost">
              <Link to="/lab">Configure a match ball</Link>
            </Button>
          </div>
        </div>
      </div>
      {related.length > 0 ? (
        <div className="mt-16">
          <h2 className="font-display text-2xl uppercase">Also in {product.categoryLabel}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
