import { createFileRoute } from "@tanstack/react-router";
import { getSessionUser } from "@/lib/auth/verify.server";
import { listInventoryAlerts, subscribeRestock } from "@/lib/shop.server";

export const Route = createFileRoute("/api/inventory")({
  server: {
    handlers: {
      GET: async () => {
        const alerts = await listInventoryAlerts();
        return Response.json({ alerts });
      },
      POST: async ({ request }) => {
        const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || undefined;
        const user = await getSessionUser(bearer);
        let body: { email?: string; productId?: string };
        try {
          body = (await request.json()) as { email?: string; productId?: string };
        } catch {
          return Response.json({ error: "Invalid request" }, { status: 400 });
        }
        const email = (body.email || user?.email || "").trim();
        try {
          await subscribeRestock({ email, productId: body.productId || "", userId: user?.id ?? null });
          return Response.json({ ok: true });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Could not save alert";
          return Response.json({ error: message }, { status: 400 });
        }
      },
    },
  },
});
