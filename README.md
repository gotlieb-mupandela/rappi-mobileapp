# RAPPI SPORTS HUB — Mobile Store

Official **RAPPI SPORTS HUB** consumer store, built with **Expo (React Native) + Expo Router** in TypeScript. Dark storefront with neon‑lime accents (**lime `#B6FF00` on `#0B0B0B`**). Runs on iOS, Android, and the web from one codebase.

Tagline: **EQUIP · PERFORM · INSPIRE**. Prices are retail Namibian dollars (**N$**).

## Catalog (real data, ~11k SKUs)

The full production catalog (same products / images / prices / stock / galleries / descriptions as [rappi-two.vercel.app](https://rappi-two.vercel.app)) is fetched at runtime from the `rappi-webapp` repo:

```
https://raw.githubusercontent.com/gotlieb-mupandela/rappi-webapp/main/data/products.json
```

- No SKUs are invented — everything comes from the live dataset.
- Product images use the real remote CDN URLs (multi‑angle galleries).
- Listings are **paginated client‑side** (24 per page, virtualized) so the ~11k catalog is never dumped into a single list.
- If the network is unavailable, a small bundled real subset (`assets/catalog/fallback.json`) keeps the app usable offline.

Override the source with `EXPO_PUBLIC_CATALOG_URL` if needed.

## Features / screens

| Screen | What it does |
| --- | --- |
| **Home** (Shop tab) | Logo header, search bar, hero banner, category chips with live counts, New Arrivals grid |
| **Category** | Shop by **Men / Women / Kids** + **sport hubs** (Sportswear, Football, Running & Fitness, Shoes, Basketball, Rugby, …) |
| **Listing** | Category / hub browse with audience filters and pagination |
| **Search** | Search by name, product **code**, or category; paginated results |
| **PDP** | Multi‑image gallery, sizes with per‑size stock (low‑stock flag), pack‑of‑10 items (e.g. training bibs @ **N$900**), description, add to cart |
| **Cart** | Line items, quantity steppers, subtotal (persisted) |
| **Checkout** | Shipping details + method — **Standard N$100 / Express N$150 / Hub pickup free** — order summary, place order |
| **Auth** | Login / Sign up / **Continue as guest** (uses Supabase when configured, else local demo) |
| **Me / Settings** | Profile, order‑status row, order history, catalog/source info, sign out |

Bottom tabs: **Shop · Category · Cart · Me**.

## Requirements

- Node.js 22.x, npm 10+

## Run it

```bash
npm install
npm run web       # Expo web at http://localhost:8081
# or
npx expo start --web --port 8081
```

Other targets:

```bash
npm run android   # Android emulator/device
npm run ios       # iOS simulator (macOS only)
npx tsc --noEmit  # type-check
```

## Auth / Supabase (optional)

Auth and checkout use Supabase when these are set (otherwise a local demo account and a local `place_order` are used):

```bash
export EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
export EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Demo login (no Supabase required): **`shop@rappi.com` / `rappi123`**, or **Continue as guest**. Orders placed without Supabase get an `RSH…` id and appear under **Me → My orders**.

## Project structure

```
app/                     # Expo Router routes
  _layout.tsx            # Providers + root stack (web is centered to phone width)
  (tabs)/                # Shop (index), Category, Cart, Me + tab bar
  product/[code].tsx     # PDP with gallery
  listing.tsx            # Category/hub listing (paginated)
  search.tsx             # Search (paginated)
  checkout.tsx           # Checkout
  order-confirmation.tsx # Order confirmation
  login.tsx              # Auth
  settings.tsx           # Settings
components/               # Logo, SearchBar, ProductCard, ProductGrid, QtyStepper, TopBar, ui
context/                 # Catalog, Cart, Orders, Auth providers
lib/                     # types, catalog (fetch/listing/pagination/classify), shipping, format, supabase
theme/tokens.ts          # Lime-on-dark design tokens
assets/brand/            # Rappi logo, mark, banner
assets/catalog/          # Offline fallback subset
```

## Cloud Agent environment

`.cursor/environment.json` installs dependencies with `npm install` and serves the Expo web dev server on port `8081` (ports are declared as objects: `{"name":"expo","port":8081}`).
