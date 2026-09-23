import { createFileRoute } from "@tanstack/react-router";
import { BOT_CORS, jsonPublic } from "@/lib/cors";

export const BOT_SPEC = {
  name: "90+ Supply",
  kind: "storefront",
  version: "1.0",
  note: "This live preview is private to one Grok chat. Other Grok bots cannot enter that sandbox. Use these paths on the public site URL, or clone the GitHub repo once it is published.",
  github: "https://github.com/sagnikdhar2018-jpg/90plus-supply",
  endpoints: {
    spec: { method: "GET", path: "/api/bots" },
    catalog: { method: "GET", path: "/api/catalog" },
    inventoryLive: { method: "GET", path: "/api/inventory/live" },
    inventoryAlerts: { method: "GET", path: "/api/inventory" },
    restockNotify: { method: "POST", path: "/api/inventory", body: { email: "string", productId: "string" } },
    session: { method: "GET", path: "/api/session" },
    signIn: { method: "POST", path: "/api/auth/sign-in/email", body: { email: "string", password: "string" } },
    signUp: { method: "POST", path: "/api/auth/sign-up/email", body: { email: "string", password: "string", name: "string" } },
    placeOrder: { method: "POST", path: "/api/orders", auth: "cookie or Bearer", body: { name: "string", email: "string", phone: "10 digits", address: "string", city: "string", state: "string", pin: "6 digits", paymentMethod: "cod", lines: [{ productId: "string", qty: 1 }] } },
    websocket: { method: "WS", path: "/ws/inventory" },
  },
  handoff: [
    "You are extending 90+ Supply, a volt/obsidian football-gear store (70 SKUs, 3D lab, live inventory).",
    "Stack: TanStack Start + cloned storefront in public/original.html, original.css, original.js, shop-backend.js.",
    "Backend lives in src/lib/shop.server.ts (catalog, stock_movements, orders) and Better Auth.",
    "Do not rebuild as a new toy site. Clone the original look: notch buttons, #c8ff2e volt, Oswald display.",
    "Live stock: GET /api/inventory/live and WebSocket /ws/inventory.",
    "Auth: email/password + Google/X. Orders require a signed-in session.",
    "This Grok live preview is session-private. Work from GitHub or a public deploy URL the owner pastes.",
  ].join(" "),
};

export const Route = createFileRoute("/api/bots")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: BOT_CORS }),
      GET: async () => jsonPublic(BOT_SPEC),
    },
  },
});
