# 90+ Supply — Grok bot handoff

Repo: https://github.com/sagnikdhar2018-jpg/90plus-supply

This Grok live preview is **private to one chat**. Other Grok bots should **clone this repo** (or hit a public site URL) instead of trying to enter that sandbox.

## How another Grok bot should work

1. Clone `https://github.com/sagnikdhar2018-jpg/90plus-supply`
2. Fetch `GET /api/bots` on a running site for the machine spec
3. Do not rebuild a generic shop. Keep volt `#c8ff2e`, notch buttons, Oswald, cloned `public/original.html`

## API

| Call | Path |
|---|---|
| Spec | `GET /api/bots` |
| Catalog | `GET /api/catalog` |
| Live stock | `GET /api/inventory/live` |
| Stock socket | `WS /ws/inventory` |
| Restock notify | `POST /api/inventory` `{ email, productId }` |
| Sign in | `POST /api/auth/sign-in/email` |
| Place order | `POST /api/orders` (session cookie) |

## Code map

- Storefront clone: `public/original.html`, `public/original.css`, `public/original.js`, `public/shop-backend.js`
- Backend: `src/lib/shop.server.ts`, `src/lib/auth/`
- Live stock bus: `src/lib/stock-bus.ts`, Vite `/ws/inventory`
