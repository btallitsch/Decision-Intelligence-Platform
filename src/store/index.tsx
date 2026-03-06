import React, { createContext, useContext, useReducer } from 'react';
import { AppState, Decision, Outcome, DecisionDebt } from '@/types';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

export interface StoreState extends AppState {
  syncStatus: SyncStatus;
}

export type Action =
  | { type: 'HYDRATE'; payload: AppState }
  | { type: 'SET_DECISIONS'; payload: Decision[] }
  | { type: 'SET_OUTCOMES'; payload: Outcome[] }
  | { type: 'SET_DEBTS'; payload: DecisionDebt[] }
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
  | { type: 'SET_SYNC_STATUS'; payload: SyncStatus }
  | { type: 'RESET' };

const initialState: StoreState = {
  decisions: [],
  outcomes: [],
  decisionDebts: [],
  syncStatus: 'idle',
};

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload };
    case 'SET_DECISIONS':
      return { ...state, decisions: action.payload };
    case 'SET_OUTCOMES':
      return { ...state, outcomes: action.payload };
    case 'SET_DEBTS':
      return { ...state, decisionDebts: action.payload };
    case 'ADD_DECISION':
      return { ...state, decisions: [action.payload, ...state.decisions] };
    case 'UPDATE_DECISION':
      return { ...state, decisions: state.decisions.map((d) => d.id === action.payload.id ? action.payload : d) };
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
      return { ...state, outcomes: state.outcomes.map((o) => o.id === action.payload.id ? action.payload : o) };
    case 'DELETE_OUTCOME':
      return { ...state, outcomes: state.outcomes.filter((o) => o.id !== action.payload) };
    case 'ADD_DEBT':
      return { ...state, decisionDebts: [action.payload, ...state.decisionDebts] };
    case 'UPDATE_DEBT':
      return { ...state, decisionDebts: state.decisionDebts.map((d) => d.id === action.payload.id ? action.payload : d) };
    case 'DELETE_DEBT':
      return { ...state, decisionDebts: state.decisionDebts.filter((d) => d.id !== action.payload) };
    case 'RESOLVE_DEBT':
      return {
        ...state,
        decisionDebts: state.decisionDebts.map((d) =>
          d.id === action.payload.id
            ? { ...d, resolved: true, resolvedAt: new Date().toISOString(), resolutionNotes: action.payload.notes }
            : d
        ),
      };
    case 'SET_SYNC_STATUS':
      return { ...state, syncStatus: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface StoreContextValue {
  state: StoreState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
