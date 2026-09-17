import { createFileRoute } from "@tanstack/react-router";
import { trackOrderPublic } from "@/lib/shop.server";

export const Route = createFileRoute("/api/orders/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const order = await trackOrderPublic(params.id);
        if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
        return Response.json({ order });
      },
    },
  },
});
