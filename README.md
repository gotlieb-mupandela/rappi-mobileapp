# RAPPI Sports Hub (Expo)

Official **RAPPI Sports Hub** mobile app — sportswear, footwear, and equipment in **Namibian dollars (N$)**. Tagline: **GEAR UP. SHOW UP. LEVEL UP.**

This is the companion app to the storefront at [rappi-two.vercel.app](https://rappi-two.vercel.app) and the catalog in [gotlieb-mupandela/rappi-webapp](https://github.com/gotlieb-mupandela/rappi-webapp). It is **not** a food-delivery clone and **not** a Joma brand app.

## Features

- **Shop** — website-identical RAPPI lockup (transparent, object-contain), search, hero carousel, category hubs, New Arrivals grid
- **Category** — Men / Women / Kids plus live sport hubs with piece counts
- **Search** — name, SKU code, or category; **paginated** (24 / page) with category chips
- **PDP** — photo gallery, sizes, live stock (low stock &lt; 5), wholesale assortment labels, add to cart
- **Cart** — size / qty, shipping preview
- **Checkout** — guest checkout, shipping **N$100 / N$150 / free hub pickup**, local order reservation
- **Auth** — demo `shop@rappi.com` / `rappi123` or continue as guest
- **Me / Settings** — order statuses, favorites, addresses, pricing, stores, dark mode, notifications

Bottom tabs: **Shop · Category · Cart · Me**.

## Catalog

Bundled from the webapp `data/products.json` (compacted for mobile):

- **11,104** real SKUs with real images, N$ prices, and per-size stock
- Remote product photography (Joma CDN URLs as stored in the official catalog)
- Currency is always **NAD** (`N$`)
- Shipping methods are locked: Standard **100**, Express **150**, Hub pickup **0**

Integrity check:

```bash
npm run verify
```

## Requirements

- Node.js 22.x
- npm 10+

## Getting started

```bash
npm install
npm run web          # http://localhost:8081
npm run android      # Android emulator / device
npm run ios          # iOS simulator (macOS)
npm run typecheck
npm run verify
```

On web the storefront is centered in a 430px phone frame.

## Demo login

| | |
| --- | --- |
| Email | `shop@rappi.com` |
| Password | `rappi123` |
| Guest | Continue as guest on Sign in — browse and check out without an account |

Checkout does **not** take real payments. Orders are reserved locally (same idea as the webapp stub / `place_order` path).

## Project structure

```
App.tsx                 # Providers, phone frame, stack + tabs
src/catalog.ts          # Categories, shipping, demo auth, hero slides
src/products.ts         # Search, filters, pagination
src/loadCatalog.ts      # Compact JSON + GitHub fallback
src/data/catalog.json   # Full live catalog (compact)
src/screens/            # Home, Category, Search, PDP, Cart, Checkout, Auth, Me
assets/brand/           # Official RAPPI lockup, mark, banner
.cursor/environment.json
```

## Cloud Agent environment

`.cursor/environment.json` installs with `npm install` and starts Expo web on port **8081**. `ports` is an array of objects (`{"name":"expo","port":8081}`), never bare numbers.

## Brand

Neon lime on black lockup from the website (`assets/brand/rappi-logo.png` RGBA + `rappi-mark.png`), rendered with `resizeMode="contain"` on a transparent background — no opaque plate. Default theme is dark `#0B0B0B` with lime `#B6FF00`. The in-app layout follows a clean commerce pattern (search, carousel, two-column cards, bottom tabs).
