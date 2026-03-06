import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { useStore } from '@/store';
import { Decision, Outcome, DecisionDebt } from '@/types';

// ─── Decisions Hook ───────────────────────────────────────────────────────
export function useDecisions() {
  const { state, dispatch } = useStore();

  const addDecision = useCallback(
    (data: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>) => {
      const decision: Decision = {
        ...data,
        id: uuid(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_DECISION', payload: decision });
      return decision;
    },
    [dispatch]
  );

  const updateDecision = useCallback(
    (data: Decision) => {
      dispatch({
        type: 'UPDATE_DECISION',
        payload: { ...data, updatedAt: new Date().toISOString() },
      });
    },
    [dispatch]
  );

  const deleteDecision = useCallback(
    (id: string) => dispatch({ type: 'DELETE_DECISION', payload: id }),
    [dispatch]
  );

  return {
    decisions: state.decisions,
    addDecision,
    updateDecision,
    deleteDecision,
  };
}

// ─── Outcomes Hook ────────────────────────────────────────────────────────
export function useOutcomes() {
  const { state, dispatch } = useStore();

  const addOutcome = useCallback(
    (data: Omit<Outcome, 'id' | 'createdAt'>) => {
      const outcome: Outcome = {
        ...data,
        id: uuid(),
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_OUTCOME', payload: outcome });
      // Update parent decision status to resolved
      const decision = state.decisions.find((d) => d.id === data.decisionId);
      if (decision && decision.status === 'active') {
        dispatch({
          type: 'UPDATE_DECISION',
          payload: { ...decision, status: 'resolved', updatedAt: new Date().toISOString() },
        });
      }
      return outcome;
    },
    [dispatch, state.decisions]
  );

  const updateOutcome = useCallback(
    (data: Outcome) => dispatch({ type: 'UPDATE_OUTCOME', payload: data }),
    [dispatch]
  );

  const deleteOutcome = useCallback(
    (id: string) => dispatch({ type: 'DELETE_OUTCOME', payload: id }),
    [dispatch]
  );

  const getOutcomesForDecision = useCallback(
    (decisionId: string) => state.outcomes.filter((o) => o.decisionId === decisionId),
    [state.outcomes]
  );

  return {
    outcomes: state.outcomes,
    addOutcome,
    updateOutcome,
    deleteOutcome,
    getOutcomesForDecision,
  };
}

// ─── Decision Debt Hook ───────────────────────────────────────────────────
export function useDecisionDebt() {
  const { state, dispatch } = useStore();

  const addDebt = useCallback(
    (data: Omit<DecisionDebt, 'id' | 'createdAt'>) => {
      const debt: DecisionDebt = {
        ...data,
        id: uuid(),
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_DEBT', payload: debt });
      return debt;
    },
    [dispatch]
  );

  const updateDebt = useCallback(
    (data: DecisionDebt) => dispatch({ type: 'UPDATE_DEBT', payload: data }),
    [dispatch]
  );

  const deleteDebt = useCallback(
    (id: string) => dispatch({ type: 'DELETE_DEBT', payload: id }),
    [dispatch]
  );

  const resolveDebt = useCallback(
    (id: string, notes: string) =>
      dispatch({ type: 'RESOLVE_DEBT', payload: { id, notes } }),
    [dispatch]
  );

  const getDebtForDecision = useCallback(
    (decisionId: string) => state.decisionDebts.filter((d) => d.decisionId === decisionId),
    [state.decisionDebts]
  );

  return {
    debts: state.decisionDebts,
    addDebt,
    updateDebt,
    deleteDebt,
    resolveDebt,
    getDebtForDecision,
  };
}
