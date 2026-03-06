# Decision Intelligence Platform

A lightweight strategic thinking system for individuals and teams to systematically track the full lifecycle of important decisions — from the moment they're considered to their long-term outcomes.

## Features

- **Decision Ledger** — Record decisions with full context, chosen option, alternatives considered, and confidence levels
- **Opportunity Cost Tracking** — Document what you gave up and its estimated value and probability
- **Outcome Registry** — Link decisions to real-world results; track sentiment, actual impact, and lessons learned
- **Decision Debt** — Flag rushed or incomplete decisions with severity ratings and due dates for review
- **Analytics & Intelligence** — Visualize patterns: success rates, impact by category, confidence distribution, reversibility ratios, and monthly trends

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for bundling
- **Recharts** for data visualization
- **Lucide React** for icons
- **date-fns** for date formatting
- **uuid** for unique IDs
- **localStorage** for persistence (no backend required)

## Project Structure

```
src/
├── types/          # All TypeScript interfaces and types
├── store/          # Context + useReducer state management + seed data
├── hooks/          # Domain hooks (useDecisions, useOutcomes, useDecisionDebt)
├── utils/          # Analytics computation + formatters
├── components/
│   ├── ui/         # Badge, Button, Modal, Card (reusable primitives)
│   ├── layout/     # Sidebar, Header
│   ├── decisions/  # DecisionCard, DecisionForm, DecisionDetail
│   ├── outcomes/   # OutcomeForm
│   └── debt/       # DebtForm
└── pages/          # Dashboard, Decisions, Outcomes, Debt, Analytics
```

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Design Principles

- **Separation of concerns**: Business logic lives in hooks and utils; components only handle rendering
- **No external state library**: React Context + useReducer keeps the bundle small
- **Persistent state**: All data is stored in `localStorage` under `dip_state_v1`
- **Seed data**: First-time users get example decisions, outcomes, and debt items to explore the platform immediately

## Data Model

```
Decision
  ├─ alternatives[]       (options not chosen + why)
  ├─ opportunityCosts[]   (what was given up)
  ├─ outcomes[]           (real-world results)
  └─ decisionDebts[]      (flags for future resolution)
```
