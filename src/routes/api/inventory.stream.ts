import { createFileRoute } from "@tanstack/react-router";
import { getLiveInventory } from "@/lib/shop.server";
import { subscribeStock } from "@/lib/stock-bus";

export const Route = createFileRoute("/api/inventory/stream")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const encoder = new TextEncoder();
        let closed = false;
        const stream = new ReadableStream({
          async start(controller) {
            const send = async (payload?: unknown) => {
              if (closed) return;
              try {
                const data = payload ?? (await getLiveInventory());
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
              } catch {
                /* keep the stream alive */
              }
            };
            await send();
            const unsub = subscribeStock((payload) => {
              void send(payload);
            });
            const beat = setInterval(() => {
              void send();
            }, 4000);
            const stop = () => {
              if (closed) return;
              closed = true;
              clearInterval(beat);
              unsub();
              try {
                controller.close();
              } catch {
                /* already closed */
              }
            };
            request.signal.addEventListener("abort", stop);
          },
        });
        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        });
      },
    },
  },
});
