import { createFileRoute } from "@tanstack/react-router";
import { getSessionUser } from "@/lib/auth/verify.server";

export const Route = createFileRoute("/api/session")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || undefined;
        const user = await getSessionUser(bearer);
        if (!user) return Response.json({ user: null });
        return Response.json({ user: { id: user.id, email: user.email } });
      },
    },
  },
});
