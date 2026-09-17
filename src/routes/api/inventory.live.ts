import { createFileRoute } from "@tanstack/react-router";
import { getLiveInventory } from "@/lib/shop.server";
import { BOT_CORS, jsonPublic } from "@/lib/cors";

export const Route = createFileRoute("/api/inventory/live")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: BOT_CORS }),
      GET: async () => {
        try {
          const live = await getLiveInventory();
          return jsonPublic(live);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Inventory unavailable";
          return jsonPublic({ error: message }, 500);
        }
      },
    },
  },
});
