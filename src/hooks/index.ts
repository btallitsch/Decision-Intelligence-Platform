import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { useStore } from '@/store';
import { useAuth } from '@/context/AuthContext';
import { Decision, Outcome, DecisionDebt } from '@/types';
import {
  writeDecision, cascadeDeleteDecision,
  writeOutcome, removeOutcome,
  writeDebt, removeDebt,
} from '@/firebase/firestore';

// ─── Decisions Hook ───────────────────────────────────────────────────────
export function useDecisions() {
  const { state, dispatch } = useStore();
  const { user } = useAuth();

  const addDecision = useCallback(
    (data: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>) => {
      const decision: Decision = {
        ...data,
        id: uuid(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_DECISION', payload: decision });
      if (user) writeDecision(user.uid, decision).catch(console.error);
      return decision;
    },
    [dispatch, user]
  );

  const updateDecision = useCallback(
    (data: Decision) => {
      const updated = { ...data, updatedAt: new Date().toISOString() };
      dispatch({ type: 'UPDATE_DECISION', payload: updated });
      if (user) writeDecision(user.uid, updated).catch(console.error);
    },
    [dispatch, user]
  );

  const deleteDecision = useCallback(
    (id: string) => {
      const outcomeIds = state.outcomes
        .filter((o) => o.decisionId === id)
        .map((o) => o.id);
      const debtIds = state.decisionDebts
        .filter((d) => d.decisionId === id)
        .map((d) => d.id);
      dispatch({ type: 'DELETE_DECISION', payload: id });
      if (user) cascadeDeleteDecision(user.uid, id, outcomeIds, debtIds).catch(console.error);
    },
    [dispatch, user, state.outcomes, state.decisionDebts]
  );

  return { decisions: state.decisions, addDecision, updateDecision, deleteDecision };
}

// ─── Outcomes Hook ────────────────────────────────────────────────────────
export function useOutcomes() {
  const { state, dispatch } = useStore();
  const { user } = useAuth();

  const addOutcome = useCallback(
    (data: Omit<Outcome, 'id' | 'createdAt'>) => {
      const outcome: Outcome = {
        ...data,
        id: uuid(),
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_OUTCOME', payload: outcome });
      // Auto-resolve the parent decision
      const decision = state.decisions.find((d) => d.id === data.decisionId);
      if (decision && decision.status === 'active') {
        const updated = { ...decision, status: 'resolved' as const, updatedAt: new Date().toISOString() };
        dispatch({ type: 'UPDATE_DECISION', payload: updated });
        if (user) writeDecision(user.uid, updated).catch(console.error);
      }
      if (user) writeOutcome(user.uid, outcome).catch(console.error);
      return outcome;
    },
    [dispatch, user, state.decisions]
  );

  const updateOutcome = useCallback(
    (data: Outcome) => {
      dispatch({ type: 'UPDATE_OUTCOME', payload: data });
      if (user) writeOutcome(user.uid, data).catch(console.error);
    },
    [dispatch, user]
  );

  const deleteOutcome = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE_OUTCOME', payload: id });
      if (user) removeOutcome(user.uid, id).catch(console.error);
    },
    [dispatch, user]
  );

  const getOutcomesForDecision = useCallback(
    (decisionId: string) => state.outcomes.filter((o) => o.decisionId === decisionId),
    [state.outcomes]
  );

  return { outcomes: state.outcomes, addOutcome, updateOutcome, deleteOutcome, getOutcomesForDecision };
}

// ─── Decision Debt Hook ───────────────────────────────────────────────────
export function useDecisionDebt() {
  const { state, dispatch } = useStore();
  const { user } = useAuth();

  const addDebt = useCallback(
    (data: Omit<DecisionDebt, 'id' | 'createdAt'>) => {
      const debt: DecisionDebt = {
        ...data,
        id: uuid(),
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_DEBT', payload: debt });
      if (user) writeDebt(user.uid, debt).catch(console.error);
      return debt;
    },
    [dispatch, user]
  );

  const updateDebt = useCallback(
    (data: DecisionDebt) => {
      dispatch({ type: 'UPDATE_DEBT', payload: data });
      if (user) writeDebt(user.uid, data).catch(console.error);
    },
    [dispatch, user]
  );

  const deleteDebt = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE_DEBT', payload: id });
      if (user) removeDebt(user.uid, id).catch(console.error);
    },
    [dispatch, user]
  );

  const resolveDebt = useCallback(
    (id: string, notes: string) => {
      dispatch({ type: 'RESOLVE_DEBT', payload: { id, notes } });
      // Write the resolved state to Firestore
      const debt = state.decisionDebts.find((d) => d.id === id);
      if (user && debt) {
        const resolved = {
          ...debt,
          resolved: true,
          resolvedAt: new Date().toISOString(),
          resolutionNotes: notes,
        };
        writeDebt(user.uid, resolved).catch(console.error);
      }
    },
    [dispatch, user, state.decisionDebts]
  );

  const getDebtForDecision = useCallback(
    (decisionId: string) => state.decisionDebts.filter((d) => d.decisionId === decisionId),
    [state.decisionDebts]
  );

  return { debts: state.decisionDebts, addDebt, updateDebt, deleteDebt, resolveDebt, getDebtForDecision };
}
