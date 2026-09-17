import { createFileRoute } from "@tanstack/react-router";
import { getSessionUser } from "@/lib/auth/verify.server";
import { listOrdersForUser, placeOrder, type PlaceOrderInput } from "@/lib/shop.server";

export const Route = createFileRoute("/api/orders")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || undefined;
        const user = await getSessionUser(bearer);
        if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
        const orders = await listOrdersForUser(user.id);
        return Response.json({ orders });
      },
      POST: async ({ request }) => {
        const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || undefined;
        const user = await getSessionUser(bearer);
        if (!user) return Response.json({ error: "Sign in to place an order" }, { status: 401 });
        let body: PlaceOrderInput;
        try {
          body = (await request.json()) as PlaceOrderInput;
        } catch {
          return Response.json({ error: "Invalid order" }, { status: 400 });
        }
        try {
          const order = await placeOrder(user.id, body);
          return Response.json({ order });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Could not place order";
          return Response.json({ error: message }, { status: 400 });
        }
      },
    },
  },
});
