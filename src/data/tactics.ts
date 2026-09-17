import { getProduct, type Product } from "@/data/catalog";

export const POSITIONS = [
  { id: "ST", title: "Striker", items: ["ball-volt-pro", "sock-apex-volt", "guard-carbon-pro"], psi: 12.8, cw: 0, fin: 2, tip: "Knuckle the top corner at about 16° so it dips over a four-man wall." },
  { id: "WINGER", title: "Winger", items: ["ball-aerovortex", "sock-apex-volt", "bag-shoe-garage"], psi: 12.5, cw: 0, fin: 0, tip: "Inswinging delivery around 2200 RPM into the far-post channel." },
  { id: "MID", title: "Playmaker", items: ["ball-gold-trophy", "agility-cones-50", "acc-captain-armband"], psi: 13.0, cw: 4, fin: 1, tip: "Backspin holds 60 m diagonals and cuts overhit on wet turf." },
  { id: "DEF", title: "Centre-back", items: ["sleeve-blackout", "sock-stealth-black", "acc-dual-pump"], psi: 12.2, cw: 1, fin: 0, tip: "Driven clearance near 28° maximises aerial distance." },
  { id: "FB", title: "Full-back", items: ["sock-apex-volt", "sleeve-blackout", "agility-speed-pro"], psi: 12.5, cw: 0, fin: 2, tip: "Low cutback near 110 km/h for deflections in the six-yard box." },
  { id: "GK", title: "Goalkeeper", items: ["gloves-vortex-pro", "ball-reaction-reflex", "acc-dual-pump"], psi: 11.8, cw: 0, fin: 0, tip: "Side-volley outlets stay flat with less drag." },
] as const;

export const SURFACES = [
  { id: "FG", label: "Firm grass", dPsi: 0, note: "Firm-ground standard" },
  { id: "TURF", label: "3G / 4G turf", dPsi: 0.4, note: "Turf (+0.4 PSI)" },
  { id: "WET", label: "Wet / monsoon", dPsi: -0.3, note: "Wet grass (−0.3 PSI)" },
  { id: "INDOOR", label: "Indoor / futsal", dPsi: null, note: "Low-bounce futsal" },
] as const;

export const STYLES = [
  { id: "SPEED", label: "Explosive speed", extra: "agility-speed-pro", dPsi: 0.1, tip: "Prioritise first-step grip and a lighter match ball." },
  { id: "FK", label: "Free-kick dip", extra: "ball-aerovortex", dPsi: 0.2, tip: "Textured PU; strike through the valve for knuckle instability." },
  { id: "PRESS", label: "High press", extra: "guard-honeycomb-d3o", dPsi: -0.1, tip: "Add shin protection and high-grip socks for tackles." },
  { id: "DISTRIB", label: "Long distribution", extra: "acc-tactics-board", dPsi: 0.3, tip: "Firmer ball for driven 40–60 m switches." },
] as const;

export type Rec = {
  pos: string;
  title: string;
  items: Product[];
  original: number;
  bundle: number;
  savings: number;
  psi: string;
  surfaceNote: string;
  tip: string;
  match: number;
  cw: number;
  fin: number;
};

export function recommend(posId: string, surfaceId: string, styleId: string): Rec {
  const pos = POSITIONS.find((p) => p.id === posId) ?? POSITIONS[0];
  const surface = SURFACES.find((s) => s.id === surfaceId) ?? SURFACES[0];
  const style = STYLES.find((s) => s.id === styleId) ?? STYLES[0];
  const ids: string[] = [...pos.items];
  if (style.extra && !ids.includes(style.extra)) ids[2] = style.extra;
  const items = ids.slice(0, 3).map((id) => getProduct(id)).filter(Boolean) as Product[];
  const original = items.reduce((n, p) => n + p.price, 0);
  const bundle = Math.round(original * 0.85);
  let psi = pos.psi + style.dPsi;
  if (surface.id === "INDOOR") psi = 11.5;
  else psi += surface.dPsi ?? 0;
  psi = Math.max(11, Math.min(14.5, psi));
  return {
    pos: pos.id,
    title: pos.title,
    items,
    original,
    bundle,
    savings: original - bundle,
    psi: psi.toFixed(1),
    surfaceNote: surface.note,
    tip: `${style.tip} ${pos.tip}`,
    match: Math.min(99, 88 + (pos.id === "ST" ? 4 : 2) + (style.id === "SPEED" ? 3 : 1)),
    cw: pos.cw,
    fin: pos.fin,
  };
}
