# Spendly - Smart Expense Tracker

Spendly is a modern, high-fidelity daily expense tracker mobile application built using **React Native (Expo)** with **JavaScript (JSX)**, **React Navigation**, and **AsyncStorage**.

The application features a premium dark-mode theme inspired by modern fintech layouts, featuring thin glassmorphism card components, neon cyan highlights, custom-tinted category badges, and dynamic forms with robust error validations.

---

## Key Features

1. **Authentication Module**: 
   * Animated splash landing logo screen.
   * Sign-in and account registration screens with real-time format validation checks.
   * Hardware-aware session checking to preserve active logins.
2. **Dashboard Module**:
   * Dynamic calculations for **Total Spending** and **Current Month Spending** (filtered automatically).
   * Visual category spending breakdown via custom progress bar widgets.
   * Feed displaying the 5 most recent transactions.
3. **Expense Management (CRUD)**:
   * **Create**: Quick add form using a responsive 8-category selector grid.
   * **Read**: Scrollable history with title searching and filters.
   * **Update & Delete**: Pre-populated editing form and a details sheet with native double-check confirm prompts.
4. **Interactive Filters**:
   * Instant search matching query strings in expense titles/notes.
   * Horizontal slider chips filtering items by category.
   * Sort control pop-up ordering transactions by Date (Newest/Oldest) or Amount (High-to-Low/Low-to-High).
5. **Profile Module**:
   * Displays name, email, avatar badge, and account totals.
   * Collapsible editing cards to update details or modify passwords.

---

## Technical Architecture & Folder Structure

The source files are structured inside the `src/` directory to separate concerns:

```text
spendly/
├── App.js                     # Root wrapper (AuthProvider & NavigationContainer)
├── app.json                   # Expo SDK project metadata
├── package.json               # Package dependencies & scripts
└── src/
    ├── components/            # Stateless, reusable interface elements
    │   ├── CategoryIcon.js    # Colored vector icon badge generator
    │   ├── CustomButton.js    # Multi-variant action button (with loaders)
    │   ├── CustomInput.js     # Text fields with focus colors and secure eye toggles
    │   ├── ExpenseCard.js     # Glassmorphism container for transaction logs
    │   └── SummaryChart.js    # Custom progress indicator breakdown card
    ├── context/               # Global state providers
    │   └── AuthContext.js     # Manages active sessions and reactive expense caches
    ├── navigation/            # Router configurations
    │   └── AppNavigator.js    # Stack & Tab routes (integrates Safe Area measuring)
    ├── screens/               # Screen modules (9 required screens)
    │   ├── SplashScreen.js, LoginScreen.js, RegisterScreen.js
    │   ├── DashboardScreen.js, ExpenseListScreen.js, ExpenseDetailsScreen.js
    │   ├── AddExpenseScreen.js, EditExpenseScreen.js, ProfileScreen.js
    └── utils/                 # Utilities and helper libraries
        ├── storage.js         # AsyncStorage multi-user database driver
        └── theme.js           # Visual design system colors, spacing, and typography
```

---

## Data Management & Multi-User Isolation

To support multiple registered accounts on the same local device, Spendly isolates expense data using **email-scoped storage keys**:
* **Users Table**: Saved under key `@spendly:users` (array of user profiles).
* **Active Session**: Saved under key `@spendly:current_user` to enable automatic logins when opening the app.
* **Isolated Transactions**: Saved under key `@spendly:expenses_<email>` (e.g. `@spendly:expenses_john@mail.com`). This ensures that User A never sees User B's transaction logs. If a user edits their email address inside the profile settings, the storage driver automatically migrates their database key to the new email address.

---

## Input Validations & Security Policies

* **Email Validations**: Uses standard regex matching to check structure accuracy before submission:
  ```javascript
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  ```
* **Password Validation Rules**:
  * Enforces a minimum length of **6 characters**.
  * Requires at least one **Uppercase letter** (`/[A-Z]/`).
  * Requires at least one **Special character** (`/[^A-Za-z0-9]/`).
  * Includes a real-time reactive checklist indicator below the password input.
* **Currency Formatting**: Localized to **Sri Lankan Rupees (LKR / Rs.)** using `en-LK` formatters for a localized user experience.
* **Amount Rules**: Blocks submission if inputs are non-numeric or less than or equal to `0`.
* **Date Rules**: Enforces standard `YYYY-MM-DD` formatting and verifies date calendar validity.

---

## How to Get Started

### 1. Install Dependencies
Navigate into your project folder and install the packages:
```bash
npm install
```

### 2. Launch Metro Bundler
Start the development server with the cache cleared:
```bash
npm run android    # Run on a connected Android device/emulator
# or
npx expo start --lan --clear
```

### 3. Open on your Device
Open the **Expo Go** application on your mobile phone and scan the terminal QR code, or enter your computer's local link manually:
```text
exp://<your-computer-ip>:8081
```

---

## Production Considerations & Future Scalability

While AsyncStorage meets the prototype requirements, a production build would benefit from the following architectural enhancements:

1. **Hardware-Level Encryption**: Sensitive user passwords should be stored in **`expo-secure-store`** instead of AsyncStorage plaintext files, protecting them at the device's hardware keychain level (iOS Keychain / Android Keystore).
2. **Local Relational Databases**: Reading, parsing, and writing a single massive stringified JSON array on the main thread degrades performance with high transaction counts. Migrating transaction files to a database like **`expo-sqlite`** or **`Realm`** enables structured indexes and faster filtered queries.
3. **Cloud Synchronization**: Connecting the local driver to a cloud service (e.g. Supabase, Firebase, or a dedicated REST API) keeps user files backed up and synced across multiple devices.
