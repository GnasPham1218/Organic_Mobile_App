Organic Mobile App

This repository contains a production-ready Expo + React Native mobile storefront app (Organic). It is implemented with TypeScript and uses `expo-router` file-based routing. The codebase includes authentication flows, category/product pages, cart & checkout, user address management, order history, promotions/vouchers, and a set of reusable UI components.

---

## Key Technologies

- Expo + `expo-router`
- React Native + TypeScript
- NativeWind (Tailwind) for styling
- Axios for HTTP requests
- Context API for lightweight state (Address, Cart, Confirm, Toast)

## Installation

Prerequisites:

- Node.js (14+ recommended)
- npm or yarn
- Optional: Android Studio (Android emulator) or Xcode (iOS simulator)

Install and run:

```bash
# 1) install dependencies
npm install

# 2) start dev server
npm run start

# open on Android emulator
npm run android

# open on iOS simulator
npm run ios

# serve web build
npm run web
```

Linting:

```bash
npm run lint
```

## Project Structure (high level)

- `app/` — file-based routes (main UI). Notable folders:
  - `(auth)/` — sign-in, sign-up, forgot/reset password, verify OTP
  - `(tabs)/` — main bottom-tab screens (home, category, orders, profile)
  - `cart/`, `product/`, `category/`, `order/`, `payment/`, `promotion/`, `return/` — feature screens
- `components/` — reusable UI components (auth, common, and screen-specific components)
- `context/` — React Context providers: `AddressContext`, `CartContext`, `ConfirmContext`, `ToastContext`
- `service/api.ts` — Axios wrapper / API client
- `assets/` — images, icons, splash
- `theme/` — global CSS + design tokens (`theme/global.css`, `theme/tokens.js`)
- `utils/` — helpers (dates, formatters, local storage)
- `data/mockData.ts` — sample/mock data used across UI
- `type/` — shared TypeScript types

## Main App Behavior

- App entry uses `expo-router` with a `Stack` defined in `app/_layout.tsx` and wraps the app with providers: `ToastProvider`, `ConfirmProvider`, `AddressProvider`, and `CartProvider`.
- `service/api.ts` centralizes network calls with Axios — set the backend `baseURL` there for integration.
- Styling uses NativeWind (Tailwind-like classes). Global styles live in `theme/global.css` and tokens in `theme/tokens.js`.

## Notable Features

- Full authentication flow: sign in, sign up, OTP verification, reset/forgot password.
- Product browsing: category lists, filters/sorting, product detail screens, image viewing.
- Cart: add/update/remove items, cart footer for quick checkout.
- Checkout & payments integration scaffolding (check `components/screens/checkout/payment.config.ts`).
- Order history and order detail views with status badges.
- Address management & shipping address UI.
- Promotions and voucher listing + promotion detail screens.
- Reusable UI components and screen-specific components for rapid feature development.

## Where to configure backend & environment

- Edit `service/api.ts` to set `baseURL` and authentication headers. Use environment variables or a `.env` approach if needed.


