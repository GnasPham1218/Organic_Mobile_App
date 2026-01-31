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

## Development tips

- When adding routes, create files under `app/` following `expo-router` file-based conventions.
- Wrap new feature-specific state in `context/` if multiple screens need shared state.
- Use `components/` to keep UI reusable and small; many screen-level components exist under `components/screens/`.

## Production build

For production (signed APK/IPA) use EAS Build or Expo Application Services. Typical steps:

```bash
# login to expo
npx expo login

# build with EAS (recommended)
npx eas build --platform android
npx eas build --platform ios
```

Configure app signing and credentials in EAS or the native toolchains when building locally.

## Next steps I can help with

- Add a short `CONTRIBUTING.md` and PR checklist
- Add environment variable support (`.env`) and docs
- Add CI badges and a GitHub Actions workflow
- Add production build instructions specific to EAS

If you want, I will now mark the task done and update the TODO list.

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
