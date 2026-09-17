import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  CircleDot,
  Crosshair,
  Hand,
  HeartPulse,
  Layers,
  Medal,
  Package,
  Shield,
  ShieldAlert,
  Sparkles,
  Star,
  Target,
  Truck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { MatchBall } from "@/components/match-ball";
import { BallOrb } from "@/components/ball-orb";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/data/catalog";
import type { CategoryId } from "@/data/catalog";
import { toast } from "sonner";

export const Route = createFileRoute("/")({ component: Home });

const TICKER = [
  "NEW SEASON DROP LIVE",
  "FREE SHIPPING OVER ₹999",
  "MATCH-GRADE FOOTBALLS",
  "48 HOUR DISPATCH",
  "LASER STAMPED CUSTOM BUILDS",
  "PREMIUM GRIP SOCKS",
  "TRAINING CONES & AGILITY KITS",
  "7-DAY EASY RETURNS",
  "BUILT FOR INDIAN PITCHES",
  "MONSOON-PROOF GEAR",
  "UPI · CARDS · COD ACCEPTED",
];

const CATS: { id: CategoryId; name: string; desc: string; icon: typeof CircleDot }[] = [
  { id: "balls", name: "Match & Tournament Balls", desc: "FIFA Quality Pro tolerances, 14-panel thermal bonding, Aerotrac flight grooves.", icon: CircleDot },
  { id: "training", name: "Training & Academy Balls", desc: "High-durability training spheres, futsal, and high-abrasion cage footballs.", icon: Activity },
  { id: "skills", name: "Skill & Precision Balls", desc: "Size 1 and 2 touch mastery spheres for juggling and close control.", icon: Target },
  { id: "socks", name: "Pro Grip Socks", desc: "Anti-slip silicone chevron grip to lock the foot and prevent blisters.", icon: Shield },
  { id: "sleeves", name: "Match Kit Sleeves", desc: "Seamless graduated compression calf sleeves for match-day grip socks.", icon: Layers },
  { id: "guards", name: "Carbon Shin Guards", desc: "38g aerospace carbon and honeycomb impact-dispersion shells.", icon: ShieldAlert },
  { id: "gloves", name: "Goalkeeper Pro Gloves", desc: "4mm German Contact Latex, negative cut, removable finger spines.", icon: Hand },
  { id: "agility", name: "Agility & Speed Kits", desc: "Speed ladders, hurdles, marker discs, and passing rebounders.", icon: Zap },
  { id: "bags", name: "Gear Bags & Sacks", desc: "Ventilated cleat garages and 900D ballistic nylon coaching sacks.", icon: Package },
  { id: "recovery", name: "Recovery & Physio", desc: "3D grid foam rollers, CryoFlex massage spheres, zinc oxide tape.", icon: HeartPulse },
  { id: "accessories", name: "Pitch & Referee Gear", desc: "Digital PSI gauges, dual-action pumps, armbands, and cleat care.", icon: Wrench },
];

const TESTS = [
  {
    name: "Rohan Deshmukh",
    role: "Semi-Pro Winger, Mumbai Elite Division",
    title: "Zero boot slippage during heavy monsoon matches",
    comment:
      "ApexLock grip socks changed my game. Wet June fixtures used to mean blisters. These lock your feet solid.",
    gear: "ApexLock Pro Grip Socks — Volt Rush",
  },
  {
    name: "Advait Nair",
    role: "Youth Development Coach, Bengaluru Grassroots Circuit",
    title: "Tournament-grade flight even during heavy monsoon matches",
    comment:
      "Twelve Apex Volt Pro balls for our U-19 squad. Aerotrac grooves keep knuckleballs predictable. Better feel than balls costing triple.",
    gear: "Apex Volt Pro Match Ball (14-Panel)",
  },
  {
    name: "Vikramjit Singh",
    role: "Competitive Centre Back, Punjab State League",
    title: "38 grams is absurdly light for real carbon",
    comment:
      "You forget the guards are on. Took a full stud-scrape last Saturday and didn’t feel a thing. The 3K carbon weave is legitimate.",
    gear: "AeroShield Carbon Pro Shin Guards",
  },
];

function Home() {
  const featured = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);

  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden bg-[radial-gradient(1200px_700px_at_70%_40%,#14171a_0%,#070809_68%)]">
        <div className="hero-pitch pointer-events-none" />
        <div className="hero-ring" />
        <div className="hero-grain" />
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] lg:block">
          <div className="grid size-full place-items-center">
            <BallOrb colorway={0} finish={2} name="90+ SUPPLY" number="90" size={340} />
          </div>
          <MatchBall colorway={0} finish={2} name="90+ SUPPLY" number="90" className="absolute inset-0" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-28 md:px-6 md:pt-32">
          <p className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-volt">
            <span className="h-px w-8 bg-volt/70" /> Premium Football Performance Lab
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-[clamp(3.1rem,9.5vw,7.6rem)] uppercase leading-[0.94]">
            <span className="block">
              90+ Supply<span className="hero-slash">.</span>
            </span>
            <span className="outline-title block">
              Built for the 90th minute<span className="hero-slash">.</span>
            </span>
          </h1>
          <p className="mt-6 max-w-[480px] text-[clamp(1.02rem,1.7vw,1.22rem)] leading-relaxed text-muted">
            Premium football accessories built for serious players who refuse to play ordinary. Match-grade gear engineered for high-intensity competition.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/shop">
                Shop football gear <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/lab">
                <Sparkles className="size-4" /> Build your ball
              </Link>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap gap-6 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
            <span>
              <b className="text-volt">Match-grade</b> tested
            </span>
            <span>
              <b className="text-volt">48h</b> rapid dispatch
            </span>
            <span>
              <b className="text-volt">Free</b> shipping over ₹999
            </span>
          </div>
        </div>
        <div className="scroll-cue">
          <div className="sc-line" />
          <span>Scroll</span>
        </div>
      </section>

      <div className="overflow-hidden border-y border-line bg-bg2 py-3.5">
        <div className="ticker-track flex w-max">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-6 px-6 font-display text-sm uppercase tracking-[0.14em] text-muted">
              <i className="inline-block size-2 rotate-45 bg-volt shadow-[0_0_10px_var(--color-volt)]" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-[76px] md:px-6 md:py-[118px]">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-volt">
              <span className="h-px w-8 bg-volt/70" /> Gear for every position
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.3rem,5.2vw,4.1rem)] uppercase leading-[0.94]">
              Gear for every
              <br />
              position on the pitch<span className="text-volt">.</span>
            </h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted hover:gap-3.5 hover:text-volt md:inline-flex">
            View full catalog <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATS.map((c, i) => {
            const n = PRODUCTS.filter((p) => p.category === c.id).length;
            return (
              <CatCard key={c.id} cat={c} i={i} count={n} />
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-[76px] md:px-6 md:pb-[118px]">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-volt">
              <span className="h-px w-8 bg-volt/70" /> Player approved
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.3rem,5.2vw,4.1rem)] uppercase leading-[0.94]">
              What the squad
              <br />
              is playing in<span className="text-volt">.</span>
            </h2>
          </div>
          <Link to="/shop" className="hidden text-xs font-bold uppercase tracking-[0.16em] text-muted hover:text-volt md:block">
            Shop all gear
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-bg2 py-[76px] md:py-[118px]">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-volt">
            <span className="h-px w-8 bg-volt/70" /> Match Ball Lab — Configurator
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.3rem,5.2vw,4.1rem)] uppercase leading-[0.94]">
            Built for the
            <br />
            90 minutes<span className="text-volt">.</span>
          </h2>
          <p className="mt-3 max-w-xl text-muted">
            Stamp your squad name and number, swap PBR materials, test match physics, and check your build under live floodlights.
          </p>
          <div className="lab-corners relative mt-10 min-h-[520px] overflow-hidden rounded-[18px] border border-line bg-[radial-gradient(740px_480px_at_50%_42%,#171b20,#070809_82%)] shadow-[inset_0_0_50px_rgba(0,0,0,0.7)]">
            <div className="lab-hud absolute left-4 top-4 z-10 flex flex-wrap gap-2">
              <span className="rounded-[10px] border border-line bg-bg/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted backdrop-blur">
                Drag to orbit · scroll to zoom
              </span>
              <span className="rounded-[10px] border border-line bg-bg/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted backdrop-blur">
                Real-time chrono
              </span>
            </div>
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <BallOrb colorway={0} finish={2} name="90+" number="10" size={280} />
            </div>
            <MatchBall colorway={0} finish={2} name="90+" number="10" className="absolute inset-0" />
            <div className="absolute bottom-4 left-4 hidden max-w-[210px] rounded-[14px] border border-line bg-bg/60 p-3.5 backdrop-blur md:block">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase">
                <Crosshair className="size-3.5 text-volt" /> Premium grip
              </h4>
              <p className="mt-1 text-[12px] text-muted">Micro-dimple PU skin for wet-surface precision control.</p>
            </div>
            <div className="absolute bottom-4 right-4 hidden max-w-[210px] rounded-[14px] border border-line bg-bg/60 p-3.5 backdrop-blur md:block">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase">
                <Layers className="size-3.5 text-volt" /> Match-ready build
              </h4>
              <p className="mt-1 text-[12px] text-muted">Thermal-bonded panels. Zero stitch. FIFA Pro bounce.</p>
            </div>
          </div>
          <Button asChild className="mt-6" size="lg">
            <Link to="/lab">
              Open full lab <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-[76px] md:px-6 md:py-[118px]">
        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-volt">
          <span className="h-px w-8 bg-volt/70" /> Why 90+ Supply
        </p>
        <h2 className="mt-3 mb-10 font-display text-[clamp(2.3rem,5.2vw,4.1rem)] uppercase leading-[0.94]">
          Serious gear,
          <br />
          zero ego<span className="text-volt">.</span>
        </h2>
        <div className="grid overflow-hidden rounded-[18px] border border-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, n: 12000, suf: "+", t: "Built for Players", d: "Grassroots players, academy athletes, and weekend warriors across India." },
            { icon: Medal, n: 4.9, dec: 1, suf: "/5", t: "Premium Quality", d: "Average verified rating across 4,000+ customer reviews." },
            { icon: Truck, n: 48, suf: "H", t: "Fast Shipping", d: "Packed at our Bengaluru warehouse and dispatched within 48 hours." },
            { icon: Crosshair, n: 300, suf: "+", t: "Player Tested", d: "Stress-tested on monsoon turf, gravel pitches, and hybrid academy grounds." },
          ].map((x, i) => (
            <div key={x.t} className={`bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)] p-9 ${i ? "border-t border-line lg:border-l lg:border-t-0" : ""}`}>
              <x.icon className="size-6 text-volt" />
              <p className="mt-3.5 font-display text-[clamp(2.4rem,4vw,3.4rem)] leading-none">
                <Count to={x.n} dec={x.dec} />
                <sub className="text-2xl text-volt">{x.suf}</sub>
              </p>
              <h3 className="mt-2 text-sm font-semibold">{x.t}</h3>
              <p className="mt-2 text-sm text-muted">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-line bg-bg2 py-[120px] text-center">
        <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[56%] font-display text-[clamp(14rem,30vw,28rem)] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.06)]">
          90+
        </p>
        <p className="relative flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-volt">
          <span className="h-px w-8 bg-volt/70" /> The Season Upgrade
        </p>
        <h2 className="relative mt-4 font-display text-[clamp(2.8rem,7vw,5.8rem)] uppercase leading-[0.96]">
          Your game<span className="text-volt">.</span> Your gear<span className="text-volt">.</span>
        </h2>
        <p className="relative mx-auto mt-4 max-w-[440px] text-muted">Upgrade your football setup without upgrading your budget.</p>
        <Button
          asChild
          className="relative mt-8"
          size="lg"
        >
          <Link to="/shop">
            Shop now <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-[76px] md:px-6 md:py-[118px]">
        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-volt">
          <span className="h-px w-8 bg-volt/70" /> Locker room testimonials
        </p>
        <h2 className="mt-3 mb-10 font-display text-[clamp(2.3rem,5.2vw,4.1rem)] uppercase leading-[0.94]">
          Players talk,
          <br />
          gear answers<span className="text-volt">.</span>
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {TESTS.map((t) => (
            <blockquote key={t.name} className="flex flex-col rounded-[18px] border border-line bg-[rgba(14,16,18,0.55)] p-7 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-2">
                <span className="flex text-volt">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-volt" />
                  ))}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-volt">
                  <BadgeCheck className="size-3.5" /> Verified athlete
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl uppercase leading-tight">“{t.title}”</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{t.comment}</p>
              <footer className="mt-5 border-t border-line pt-4">
                <b className="block text-sm">{t.name}</b>
                <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">{t.role}</span>
                <p className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-volt">
                  <Shield className="size-3" /> {t.gear}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-28 md:px-6">
        <form
          className="rounded-[22px] border border-line bg-[radial-gradient(560px_260px_at_50%_0%,rgba(200,255,46,0.08),transparent_70%)] px-6 py-16 text-center"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("You're in the 90+ Club");
            const el = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
            try {
              localStorage.setItem("90p_newsletter", el.value);
            } catch {
              /* ignore */
            }
            el.value = "";
          }}
        >
          <h2 className="font-display text-[clamp(2.2rem,5.2vw,3.6rem)] uppercase">
            Join the <em className="not-italic text-volt">90+ Club.</em>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">Get new drops, football gear and exclusive offers.</p>
          <div className="mx-auto mt-8 flex max-w-md flex-wrap gap-2">
            <input
              name="email"
              type="email"
              required
              placeholder="player@email.com"
              suppressHydrationWarning
              className="h-12 min-w-[200px] flex-1 rounded-[11px] border border-line bg-white/5 px-4 outline-none focus:border-volt/50"
            />
            <Button type="submit">Join now</Button>
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Zero spam. Unsubscribe anytime with one tap.</p>
        </form>
      </section>
    </>
  );
}

function CatCard({
  cat,
  i,
  count,
}: {
  cat: (typeof CATS)[number];
  i: number;
  count: number;
}) {
  const [spot, setSpot] = useState({ x: 50, y: 20 });
  const Icon = cat.icon;
  return (
    <Link
      to="/shop"
      search={{ cat: cat.id }}
      className="cat-spot group relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[18px] border border-line bg-[rgba(14,16,18,0.55)] p-7 backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:border-volt/50 hover:shadow-[0_24px_56px_-10px_rgba(0,0,0,0.7),0_0_28px_rgba(200,255,46,0.14)]"
      style={{ "--mx": `${spot.x}%`, "--my": `${spot.y}%` } as CSSProperties}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setSpot({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
      }}
    >
      <div className="relative z-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
        <span>Spec_{String(i + 1).padStart(2, "0")}</span>
        <span>{count} skus</span>
      </div>
      <Icon className="relative z-10 mt-8 size-8 text-volt" />
      <div className="relative z-10">
        <h3 className="font-display text-2xl uppercase leading-tight">{cat.name}</h3>
        <p className="mt-2 text-sm text-muted">{cat.desc}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] group-hover:text-volt">
          Equip now <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}

function Count({ to, dec = 0 }: { to: number; dec?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      setN(to * p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{dec ? n.toFixed(dec) : Math.round(n).toLocaleString("en-IN")}</>;
}
