# Spendly - Expense Tracker Mobile App

Spendly is a personal finance tracker I built with React Native (Expo). It's dark-mode by default, with a bit of glassmorphism and glow styling on the cards, and supports multiple user accounts stored locally on the same device.

I wanted it to feel closer to a real product and spent extra time on things like onboarding flow, custom dialogs (instead of the default Alert popups), and small animation details on the dashboard.

---

## Stack

- **Framework**: React Native, Expo SDK 54, JavaScript/JSX
- **Navigation**: React Navigation v6 — Native Stack + Bottom Tabs
- **Storage**: AsyncStorage, with a custom driver I wrote to handle multi-user data isolation (more on this below)
- **Icons**: `@expo/vector-icons` (Ionicons)
- **Safe areas**: `react-native-safe-area-context`

---

## Features

### Onboarding
First launch shows an intro screen with a circular illustration of expense categories. This only needs to run once — I store a flag (`@spendly:has_seen_onboarding`) in AsyncStorage and check it on app start. If it's not set, onboarding shows; if it is, we skip straight past it. Logging in/out later doesn't bring it back, since the flag lives at the device/install level, not per account.

### Auth
Splash screen on launch with a simple scale animation on the logo. Login and Register screens have a slow-pulsing glow effect in the background (mostly just to make the app feel less flat). Password requirements (length, uppercase, special character) light up green in real time as the user types, instead of showing an error only after submit.

### Dashboard
- A scrolling marquee banner up top (`SPENDLY • SECURE • SIMPLE • SMART...`) — this took a few tries to get scrolling smoothly without stutter
- Total balance card in LKR (Rs.), animated in on mount
- Category spend bars that animate their width in
- Floating action button for adding a new transaction, with a small bounce-in animation

### Expenses (CRUD)
- Transaction list with color-coded left borders per category
- Category picker — 8 categories, icon grid
- Search by title, filter by category, sort by date/amount
- Custom dialog components replace the native Alert for confirmations and success/error messages — styled to match the rest of the app

---

## Project Structure

```text
spendly/
├── App.js                     # Providers wrapper (AuthProvider, CustomDialog overlay)
├── assets/
├── src/
│   ├── components/
│   │   ├── CategoryIcon.js
│   │   ├── CustomButton.js
│   │   ├── CustomInput.js
│   │   ├── CustomDialog.js
│   │   ├── ExpenseCard.js
│   │   └── SummaryChart.js
│   ├── context/
│   │   └── AuthContext.js     # session state, cache, global dialog triggers
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── OnboardingScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── ExpenseListScreen.js
│   │   ├── ExpenseDetailsScreen.js
│   │   ├── AddExpenseScreen.js
│   │   ├── EditExpenseScreen.js
│   │   └── ProfileScreen.js
│   └── utils/
│       ├── storage.js         # AsyncStorage multi-user driver
│       └── theme.js           # colors, spacing, design tokens
```

---

## How multi-user storage works

Since there's no backend, everything lives on-device in AsyncStorage, scoped by email so multiple accounts can coexist without mixing data:

- `@spendly:users` — array of registered profiles
- `@spendly:current_user` — whoever's currently logged in, so sessions survive app restarts
- `@spendly:expenses_<email>` — each user's transactions live under their own key

One thing I had to handle: if a user changes their email in their profile, their old transaction key becomes orphaned unless I migrate it. So `storage.js` checks for this and copies the data over to the new key when it happens.

---

## Known limitations

- Everything is local-only — no backend/cloud sync, so uninstalling the app wipes all data
- No password recovery flow (would need a real backend for that)
- Category list is fixed at 8 — not currently user-editable
- Tested mainly on Android via Expo Go; iOS testing was more limited

---

## Production considerations & future scalability

AsyncStorage was fine for a prototype, but if I were to take this further, a few things would need to change:

1. **Hardware-level encryption** — passwords are currently stored in AsyncStorage as plaintext, which isn't safe for anything beyond a demo. Moving them to `expo-secure-store` would protect them at the device's hardware keychain level (iOS Keychain / Android Keystore) instead.
2. **A real local database** — right now transactions are stored as one big stringified JSON array. That works fine for a handful of records, but reading/parsing/writing the whole array on the main thread doesn't scale — it'll get noticeably slower as transaction count grows. Something like `expo-sqlite` or `Realm` would give proper indexing and let queries and filters run without loading everything into memory at once.
3. **Cloud sync** — everything is local-only at the moment, so data doesn't survive an uninstall and can't move between devices. Hooking the storage driver up to something like Supabase, Firebase, or a custom REST API would fix both of those.

---

## Running it locally

```bash
npm install
npx expo start --lan --clear
```

Then either:
- **Android**: scan the QR code from the terminal using the scanner inside the Expo Go app
- **iOS**: scan it with the system Camera app
- **Manual**: type `exp://<your-computer-ip>:8081` into Expo Go
