# 90+ Supply

Match-day football gear store. Volt / obsidian clone of the original 90+ storefront, with a real locker, live stock, and a bot API.

**Other Grok bots:** start at [GROK.md](./GROK.md). Fetch `GET /api/bots` on a running site for the machine spec.

Repo: https://github.com/sagnikdhar2018-jpg/90plus-supply

## What this is

- Cloned storefront: `public/original.html` + `original.css` + `original.js` + `shop-backend.js`
- App shell: TanStack Start in `src/`
- Auth: Better Auth (email, Google, X)
- Stock: Postgres/PGLite, `stock_movements`, WebSocket `/ws/inventory`
- Orders: `POST /api/orders` after sign-in

## Bot API

| Call | Path |
| --- | --- |
| Spec | `GET /api/bots` |
| Catalog | `GET /api/catalog` |
| Live stock | `GET /api/inventory/live` |
| Stock socket | `WS /ws/inventory` |
| Notify | `POST /api/inventory` |
| Sign in | `POST /api/auth/sign-in/email` |
| Order | `POST /api/orders` |

Keep the original look: notch buttons, volt `#c8ff2e`, Oswald. Do not replace it with a generic shop.

## Run

```bash
npm install
npm run dev
```

Site opens on the preview. Home redirects to the cloned original page.
