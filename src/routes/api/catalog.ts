import { createFileRoute } from "@tanstack/react-router";
import { listCatalog } from "@/lib/shop.server";
import { BOT_CORS, jsonPublic } from "@/lib/cors";

export const Route = createFileRoute("/api/catalog")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: BOT_CORS }),
      GET: async () => {
        try {
          const products = await listCatalog();
          return jsonPublic({ products });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Catalog unavailable";
          return jsonPublic({ error: message }, 500);
        }
      },
    },
  },
});
