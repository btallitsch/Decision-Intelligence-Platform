import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Decision, Outcome, DecisionDebt } from '@/types';
import { SEED_DATA } from './seedData';

// ─── Action Types ─────────────────────────────────────────────────────────
type Action =
  | { type: 'ADD_DECISION'; payload: Decision }
  | { type: 'UPDATE_DECISION'; payload: Decision }
  | { type: 'DELETE_DECISION'; payload: string }
  | { type: 'ADD_OUTCOME'; payload: Outcome }
  | { type: 'UPDATE_OUTCOME'; payload: Outcome }
  | { type: 'DELETE_OUTCOME'; payload: string }
  | { type: 'ADD_DEBT'; payload: DecisionDebt }
  | { type: 'UPDATE_DEBT'; payload: DecisionDebt }
  | { type: 'DELETE_DEBT'; payload: string }
  | { type: 'RESOLVE_DEBT'; payload: { id: string; notes: string } }
  | { type: 'HYDRATE'; payload: AppState };

// ─── Initial State ────────────────────────────────────────────────────────
const initialState: AppState = {
  decisions: [],
  outcomes: [],
  decisionDebts: [],
};

// ─── Reducer ──────────────────────────────────────────────────────────────
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;

    case 'ADD_DECISION':
      return { ...state, decisions: [action.payload, ...state.decisions] };

    case 'UPDATE_DECISION':
      return {
        ...state,
        decisions: state.decisions.map((d) =>
          d.id === action.payload.id ? action.payload : d
        ),
      };

    case 'DELETE_DECISION':
      return {
        ...state,
        decisions: state.decisions.filter((d) => d.id !== action.payload),
        outcomes: state.outcomes.filter((o) => o.decisionId !== action.payload),
        decisionDebts: state.decisionDebts.filter((db) => db.decisionId !== action.payload),
      };

    case 'ADD_OUTCOME':
      return { ...state, outcomes: [action.payload, ...state.outcomes] };

    case 'UPDATE_OUTCOME':
      return {
        ...state,
        outcomes: state.outcomes.map((o) =>
          o.id === action.payload.id ? action.payload : o
        ),
      };

    case 'DELETE_OUTCOME':
      return { ...state, outcomes: state.outcomes.filter((o) => o.id !== action.payload) };

    case 'ADD_DEBT':
      return { ...state, decisionDebts: [action.payload, ...state.decisionDebts] };

    case 'UPDATE_DEBT':
      return {
        ...state,
        decisionDebts: state.decisionDebts.map((d) =>
          d.id === action.payload.id ? action.payload : d
        ),
      };

    case 'DELETE_DEBT':
      return {
        ...state,
        decisionDebts: state.decisionDebts.filter((d) => d.id !== action.payload),
      };

    case 'RESOLVE_DEBT':
      return {
        ...state,
        decisionDebts: state.decisionDebts.map((d) =>
          d.id === action.payload.id
            ? {
                ...d,
                resolved: true,
                resolvedAt: new Date().toISOString(),
                resolutionNotes: action.payload.notes,
              }
            : d
        ),
      };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────
interface StoreContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const STORAGE_KEY = 'dip_state_v1';

// ─── Provider ─────────────────────────────────────────────────────────────
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: AppState = JSON.parse(raw);
        dispatch({ type: 'HYDRATE', payload: parsed });
      } else {
        // Seed with example data on first load
        dispatch({ type: 'HYDRATE', payload: SEED_DATA });
      }
    } catch {
      dispatch({ type: 'HYDRATE', payload: SEED_DATA });
    }
  }, []);

  // Persist to localStorage on every state change
  useEffect(() => {
    if (state.decisions.length > 0 || state.outcomes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────
export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
