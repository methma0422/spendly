# Spendly - Expense Tracker Mobile App

Spendly is a high-fidelity, feature-rich personal finance tracking application built using **React Native (Expo)**. The app features a premium dark-mode theme, incorporating glassmorphism cards, glowing neon elements, custom animations, and a seamless, multi-user storage layout.

---

## Technical Specifications

| Technology | Implementation | Description |
| :--- | :--- | :--- |
| **Core Framework** | React Native (Expo SDK 54) | Built with JavaScript (JSX) for cross-platform stability |
| **Navigation** | React Navigation (v6) | Native Stack + Bottom Tab routing with dynamic Safe Area spacing |
| **Local Storage** | AsyncStorage | Custom multi-user database driver with isolated email-scoped keys |
| **Icons** | `@expo/vector-icons` | Custom-colored Ionicons integrated inside category badges |
| **Safe Areas** | `react-native-safe-area-context` | Dynamic bottom and top status bar inset positioning |

---

## Key Features

### 1. Onboarding & App Landing
* **Interactive Intro Screen**: Styled with a floating, circular categories illustration representing expense buckets.
* **First-Launch Hook**: Checks a local flag (`@spendly:has_seen_onboarding`) on start. If incomplete, it shows the onboarding screen first; once completed, it is bypassed forever on subsequent launches.

### 2. Multi-User Authentication
* **Animated Splash Screen**: Displays a loading brand icon and name with scale springs.
* **Breathing Glow Backdrop**: Login and Register screens feature background neon orbs that pulse slowly.
* **Interactive Password Checklist**: Validates inputs in real-time, lighting up requirements (length, uppercase, special character) in emerald green as rules are met.

### 3. Home Dashboard (Home)
* **Custom Marquee Ticker**: An infinite horizontal rolling banner scrolling text (`SPENDLY • SECURE • SIMPLE • SMART...`) at a consistent, glitch-free speed.
* **Total Spending Widget**: Displays spring-animated balance cards formatted in **Sri Lankan Rupees (LKR / Rs.)**.
* **Category Progress Charts**: Custom visual indicator bars that expand smoothly on mount.
* **Floating Action Button**: A bouncing FAB that pops on load and guides the user to add transactions.

### 4. Expense Management & Filtering (CRUD)
* **Transaction Feed**: Shows recent transactions with category-colored left accent strips and outline glows.
* **Category Selector**: A responsive 8-category icon selector grid.
* **Search & Filters**: Title searching, category filter pills, and sorting overlays (by newest/oldest date or amount).
* **Themed Custom Dialogs**: Standard native alert popups are replaced with custom-designed dark dialog cards featuring glowing neon frames and animated scale transitions.

---

## Project Structure & Navigation Map

```text
spendly/
├── App.js                     # Providers wrapper (AuthProvider & CustomDialog overlay)
├── assets/                    # Graphic assets and app icons
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── CategoryIcon.js    # Colored vector icon badge generator
│   │   ├── CustomButton.js    # Spring-scalable action buttons
│   │   ├── CustomInput.js     # Dark input fields with secure eye toggles
│   │   ├── CustomDialog.js    # Themed success/error/confirm popups
│   │   ├── ExpenseCard.js     # Glassmorphic transaction feed items
│   │   └── SummaryChart.js    # Custom progress indicator bars
│   ├── context/               # Global state providers
│   │   └── AuthContext.js     # Sessions, cache, and global dialog triggers
│   ├── navigation/            # Router configurations
│   │   └── AppNavigator.js    # Tab and Stack Navigator setups
│   ├── screens/               # Screen modules (10 total screens)
│   │   ├── SplashScreen.js, OnboardingScreen.js, LoginScreen.js, RegisterScreen.js
│   │   ├── DashboardScreen.js, ExpenseListScreen.js, ExpenseDetailsScreen.js
│   │   ├── AddExpenseScreen.js, EditExpenseScreen.js, ProfileScreen.js
│   └── utils/                 # Design tokens and storage drivers
│       ├── storage.js         # AsyncStorage multi-user database driver
│       └── theme.js           # Visual design guidelines (colors, spaces)
```

---

## Data Management & Multi-User Isolation

To support multiple user profiles on the same local device without data leakage, Spendly implements **email-scoped storage keys**:
* **User Accounts**: Saved under a global `@spendly:users` profile array.
* **Active Session**: Saved under `@spendly:current_user` to preserve sessions across launches.
* **Isolated Transactions**: Expense records are saved under key `@spendly:expenses_<email_address>`.
* **Automatic Migration**: If a user updates their email inside their profile settings, the storage driver automatically migrates their transaction database keys to the new email address.

---

## Getting Started Locally

### 1. Install Dependencies
In your terminal, navigate into the project directory and run:
```bash
npm install
```

### 2. Launch the Development Server
Start the Metro compiler with cache clearing enabled:
```bash
npx expo start --lan --clear
```

### 3. Open on your Device
Download the **Expo Go** app on your phone, then:
* **Android**: Scan the terminal QR code using the scanner inside the Expo Go app.
* **iOS**: Scan the terminal QR code using the system Camera app.
* **Manual Input**: Connect manually by typing `exp://<your-computer-ip>:8081` in Expo Go.

---

## Submission Deliverables Checklist
1. **React Native Source Code**: Included in this repository.
2. **README Documentation**: (This file).
3. **Application Screenshots**: Saved in the submission folder.
4. **Short Demo Video**: Screen recording showing onboarding, signup checks, adding transactions, and custom sign-out sheets.
5. **Android APK Binary**: Configured inside `eas.json` for cloud builds.
