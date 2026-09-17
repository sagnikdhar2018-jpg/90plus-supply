import { createFileRoute } from "@tanstack/react-router";
import { BOT_CORS, jsonPublic } from "@/lib/cors";

export const BOT_SPEC = {
  name: "90+ Supply",
  kind: "storefront",
  version: "1.0",
  github: "https://github.com/sagnikdhar2018-jpg/90plus-supply",
  endpoints: {
    spec: { method: "GET", path: "/api/bots" },
    catalog: { method: "GET", path: "/api/catalog" },
    inventoryLive: { method: "GET", path: "/api/inventory/live" },
    inventoryAlerts: { method: "GET", path: "/api/inventory" },
    restockNotify: { method: "POST", path: "/api/inventory", body: { email: "string", productId: "string" } },
    session: { method: "GET", path: "/api/session" },
    signIn: { method: "POST", path: "/api/auth/sign-in/email", body: { email: "string", password: "string" } },
    placeOrder: { method: "POST", path: "/api/orders", auth: "cookie or Bearer" },
    websocket: { method: "WS", path: "/ws/inventory" },
  },
};

export const Route = createFileRoute("/api/bots")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: BOT_CORS }),
      GET: async () => jsonPublic(BOT_SPEC),
    },
  },
});
