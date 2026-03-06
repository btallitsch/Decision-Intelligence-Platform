# Decision Intelligence Platform

A strategic thinking system for tracking the full lifecycle of decisions — context, alternatives, opportunity costs, outcomes, and debt — with **Firebase cloud sync** and **Google authentication**.

## Features

- **Decision Ledger** — Record decisions with full context, chosen option, alternatives, and confidence levels
- **Opportunity Cost Tracking** — Document what you gave up and its estimated value
- **Outcome Registry** — Link decisions to real-world results with lessons learned
- **Decision Debt** — Flag rushed or incomplete decisions before they compound
- **Analytics & Intelligence** — Success rates, impact by category, confidence distribution, trends
- **Google Sign-In** — Authenticate with your Gmail account via Firebase Auth
- **Cloud Sync** — Real-time Firestore sync; data available on all devices instantly
- **Offline Support** — Firebase SDK caches data locally; writes queue when offline

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18 + TypeScript |
| Bundler | Vite |
| Charts | Recharts |
| Icons | Lucide React |
| Dates | date-fns |
| Auth | Firebase Authentication (Google) |
| Database | Cloud Firestore (real-time) |
| State | React Context + useReducer |

## Project Structure

```
src/
├── types/              # TypeScript interfaces
├── firebase/
│   ├── config.ts       # Firebase app init (reads from .env.local)
│   ├── auth.ts         # Google sign-in/out helpers
│   └── firestore.ts    # CRUD + real-time subscriptions
├── context/
│   └── AuthContext.tsx # Auth state provider + useAuth hook
├── store/
│   ├── index.tsx       # Context + useReducer (local optimistic state)
│   └── seedData.ts     # Example data for new users
├── hooks/index.ts      # useDecisions, useOutcomes, useDecisionDebt
│                         (optimistic dispatch + Firestore write)
├── utils/              # analytics.ts + formatters.ts
├── components/
│   ├── auth/           # LoginScreen, UserMenu
│   ├── ui/             # Badge, Button, Modal, Card
│   ├── layout/         # Sidebar (with UserMenu), Header
│   ├── decisions/      # DecisionCard, DecisionForm, DecisionDetail
│   ├── outcomes/       # OutcomeForm
│   └── debt/           # DebtForm
└── pages/              # Dashboard, Decisions, Outcomes, Debt, Analytics
```

## Firebase Setup

### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** and follow the wizard

### 2. Enable Google Authentication

1. In your project → **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add your app's domain to **Authorised domains** (add `localhost` for dev)

### 3. Create a Firestore database

1. **Firestore Database** → **Create database**
2. Start in **production mode**
3. Choose a region close to your users

### 4. Deploy security rules

```bash
# Install Firebase CLI if needed
npm install -g firebase-tools
firebase login

# From the project root:
firebase deploy --only firestore:rules
```

Or paste the contents of `firestore.rules` into the Firestore rules editor in the console.

### 5. Register a web app

1. **Project Settings** → **Your apps** → click the **</>** web icon
2. Copy the config values

### 6. Configure environment variables

```bash
cp .env.example .env.local
# Edit .env.local and fill in your Firebase values
```

### 7. Run the app

```bash
npm install
npm run dev
```

## Data Architecture

```
Firestore
└── users/
    └── {userId}/
        ├── decisions/   {decisionId}
        ├── outcomes/    {outcomeId}
        └── decisionDebts/ {debtId}
```

Each user owns their own sub-collections. Security rules enforce that only the authenticated owner can read or write their data.

## Sync Architecture

```
User action → optimistic dispatch (instant UI) → Firestore write (async)
                                                         ↓
                                              onSnapshot listener fires
                                                         ↓
                                         SET_DECISIONS / SET_OUTCOMES / SET_DEBTS
                                                         ↓
                                              Store state is source of truth
```

Optimistic updates mean the UI responds instantly. If a Firestore write fails, the snapshot listener will eventually correct the local state.
