# rappi-mobileapp

A Rappi-style food delivery mobile app built with [Expo](https://expo.dev/) and React Native. It runs on iOS, Android, and the web from a single codebase.

## Features

- Browse nearby restaurants with ratings, delivery time, and fees
- Filter restaurants by category (Fast Food, Sushi, Healthy, Coffee, Dessert)
- Open a restaurant to view its menu
- Add/remove menu items with a live cart badge and running total
- Review the cart and place an order with an order confirmation

## Requirements

- Node.js 22.x
- npm 10+

## Getting started

```bash
npm install       # install dependencies
npm run web       # run in the browser (http://localhost:8081)
npm run android   # run on an Android emulator/device
npm run ios       # run on an iOS simulator (macOS only)
```

## Project structure

```
App.tsx            # App entry: home, restaurant menu, and cart screens
index.ts           # Expo root component registration
src/data.ts        # Restaurant and menu data + types
src/theme.ts       # Colors and spacing tokens
app.json           # Expo app configuration
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run start` | Start the Expo dev server (choose a target) |
| `npm run web` | Run the app in a web browser |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS (macOS only) |
| `npx tsc --noEmit` | Type-check the project |

## Cloud Agent environment

`.cursor/environment.json` installs dependencies with `npm install` and starts the
Expo web dev server on port `8081` in a persistent terminal.
