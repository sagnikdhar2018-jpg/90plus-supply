/**
 * Serve the cloned original 90+ Supply HTML at `/` so the live preview matches
 * the uploaded site. Keep `/?install=1&platform=ios` for the PWA tutorial.
 */
export default async function originalHomeMiddleware(
  event: { url: URL; req: { method: string } },
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const method = (event.req.method ?? "GET").toUpperCase();
  if (method !== "GET") return next();
  const path = event.url.pathname;
  const install = event.url.searchParams.get("install");
  const platform = (event.url.searchParams.get("platform") ?? "").toLowerCase();
  if ((install === "1" || install === "true") && platform === "ios") return next();
  if (path === "/" || path === "/index.html") {
    return new Response(null, {
      status: 302,
      headers: { Location: "/original.html", "cache-control": "no-cache" },
    });
  }
  return next();
}
