import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import { Decision, Outcome, DecisionDebt } from '@/types';

// ─── Collection path helpers ───────────────────────────────────────────────
const decisionsRef  = (uid: string) => collection(db, 'users', uid, 'decisions');
const outcomesRef   = (uid: string) => collection(db, 'users', uid, 'outcomes');
const debtsRef      = (uid: string) => collection(db, 'users', uid, 'decisionDebts');

const decisionDoc   = (uid: string, id: string) => doc(db, 'users', uid, 'decisions', id);
const outcomeDoc    = (uid: string, id: string) => doc(db, 'users', uid, 'outcomes', id);
const debtDoc       = (uid: string, id: string) => doc(db, 'users', uid, 'decisionDebts', id);

// ─── Real-time subscriptions ───────────────────────────────────────────────
export function subscribeToDecisions(
  uid: string,
  callback: (data: Decision[]) => void
): () => void {
  const q = query(decisionsRef(uid), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => d.data() as Decision));
  });
}

export function subscribeToOutcomes(
  uid: string,
  callback: (data: Outcome[]) => void
): () => void {
  const q = query(outcomesRef(uid), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => d.data() as Outcome));
  });
}

export function subscribeToDebts(
  uid: string,
  callback: (data: DecisionDebt[]) => void
): () => void {
  const q = query(debtsRef(uid), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => d.data() as DecisionDebt));
  });
}

// ─── Decision writes ───────────────────────────────────────────────────────
export const writeDecision = (uid: string, d: Decision) =>
  setDoc(decisionDoc(uid, d.id), d);

export const removeDecision = (uid: string, id: string) =>
  deleteDoc(decisionDoc(uid, id));

// ─── Outcome writes ────────────────────────────────────────────────────────
export const writeOutcome = (uid: string, o: Outcome) =>
  setDoc(outcomeDoc(uid, o.id), o);

export const removeOutcome = (uid: string, id: string) =>
  deleteDoc(outcomeDoc(uid, id));

// ─── Debt writes ───────────────────────────────────────────────────────────
export const writeDebt = (uid: string, d: DecisionDebt) =>
  setDoc(debtDoc(uid, d.id), d);

export const removeDebt = (uid: string, id: string) =>
  deleteDoc(debtDoc(uid, id));

// ─── Cascade delete (when a decision is deleted) ───────────────────────────
export async function cascadeDeleteDecision(
  uid: string,
  decisionId: string,
  outcomeIds: string[],
  debtIds: string[]
): Promise<void> {
  const batch = writeBatch(db);
  batch.delete(decisionDoc(uid, decisionId));
  outcomeIds.forEach((id) => batch.delete(outcomeDoc(uid, id)));
  debtIds.forEach((id) => batch.delete(debtDoc(uid, id)));
  await batch.commit();
}

// ─── Seed data bulk write (first login) ───────────────────────────────────
export async function seedUserData(
  uid: string,
  decisions: Decision[],
  outcomes: Outcome[],
  debts: DecisionDebt[]
): Promise<void> {
  const batch = writeBatch(db);
  decisions.forEach((d) => batch.set(decisionDoc(uid, d.id), d));
  outcomes.forEach((o) => batch.set(outcomeDoc(uid, o.id), o));
  debts.forEach((d) => batch.set(debtDoc(uid, d.id), d));
  await batch.commit();
}
