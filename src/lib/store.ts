import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct } from "@/data/catalog";

export type CartLine = {
  key: string;
  productId: string;
  qty: number;
  customName?: string;
  customNumber?: string;
  priceOverride?: number;
};

export type SavedBuild = {
  id: string;
  name: string;
  number: string;
  cw: number;
  fin: number;
  psi: number;
  at: number;
};

type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  builds: SavedBuild[];
  add: (productId: string, extra?: Partial<CartLine>) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  toggleWish: (productId: string) => void;
  saveBuild: (b: Omit<SavedBuild, "id" | "at">) => void;
  removeBuild: (id: string) => void;
};

function lineKey(productId: string, extra?: Partial<CartLine>) {
  return [productId, extra?.customName ?? "", extra?.customNumber ?? "", extra?.priceOverride ?? ""].join("|");
}

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      builds: [],
      add: (productId, extra) => {
        const key = extra?.key ?? lineKey(productId, extra);
        const existing = get().cart.find((l) => l.key === key);
        if (existing) {
          set({
            cart: get().cart.map((l) => (l.key === key ? { ...l, qty: l.qty + (extra?.qty ?? 1) } : l)),
          });
          return;
        }
        set({
          cart: [
            ...get().cart,
            {
              key,
              productId,
              qty: extra?.qty ?? 1,
              customName: extra?.customName,
              customNumber: extra?.customNumber,
              priceOverride: extra?.priceOverride,
            },
          ],
        });
      },
      setQty: (key, qty) => {
        if (qty <= 0) set({ cart: get().cart.filter((l) => l.key !== key) });
        else set({ cart: get().cart.map((l) => (l.key === key ? { ...l, qty } : l)) });
      },
      remove: (key) => set({ cart: get().cart.filter((l) => l.key !== key) }),
      clear: () => set({ cart: [] }),
      toggleWish: (productId) => {
        const has = get().wishlist.includes(productId);
        set({
          wishlist: has ? get().wishlist.filter((id) => id !== productId) : [...get().wishlist, productId],
        });
      },
      saveBuild: (b) =>
        set({
          builds: [{ ...b, id: `BLD${Date.now().toString(36).toUpperCase()}`, at: Date.now() }, ...get().builds].slice(0, 12),
        }),
      removeBuild: (id) => set({ builds: get().builds.filter((x) => x.id !== id) }),
    }),
    { name: "90p-shop" },
  ),
);

export function linePrice(line: CartLine) {
  if (typeof line.priceOverride === "number") return line.priceOverride;
  return getProduct(line.productId)?.price ?? 0;
}

export function cartCount(cart: CartLine[]) {
  return cart.reduce((n, l) => n + l.qty, 0);
}

export function cartTotal(cart: CartLine[]) {
  return cart.reduce((n, l) => n + linePrice(l) * l.qty, 0);
}

export type Order = {
  id: string;
  createdAt: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  pin: string;
  address: string;
  total: number;
  discount?: number;
  code?: string;
  lines: CartLine[];
  status: "packed" | "dispatched" | "out_for_delivery" | "delivered";
};

const ORDERS_KEY = "90p-orders";
const QUOTES_KEY = "90p-quotes";

export function saveOrder(order: Order) {
  const all = listOrders();
  all.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(all.slice(0, 20)));
}

export function listOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]") as Order[];
  } catch {
    return [];
  }
}

export function getOrder(id: string) {
  return listOrders().find((o) => o.id === id);
}

export type TeamQuote = {
  id: string;
  club: string;
  contact: string;
  email: string;
  phone: string;
  qty: number;
  note: string;
  at: number;
};

export function saveQuote(q: TeamQuote) {
  const all = listQuotes();
  all.unshift(q);
  localStorage.setItem(QUOTES_KEY, JSON.stringify(all.slice(0, 20)));
}

export function listQuotes(): TeamQuote[] {
  try {
    return JSON.parse(localStorage.getItem(QUOTES_KEY) || "[]") as TeamQuote[];
  } catch {
    return [];
  }
}
