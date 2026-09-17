export const BOT_CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Bot-Key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export function jsonPublic(data: unknown, status = 200) {
  return Response.json(data, { status, headers: BOT_CORS });
}
