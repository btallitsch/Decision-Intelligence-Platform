import { format, parseISO, startOfMonth } from 'date-fns';
import { AppState, DecisionMetrics, MonthlyTrend } from '@/types';

export function computeMetrics(state: AppState): DecisionMetrics {
  const { decisions, outcomes, decisionDebts } = state;

  const resolved = decisions.filter((d) => d.status === 'resolved');
  const pending = decisions.filter((d) => d.status === 'pending' || d.status === 'active');

  // Average confidence
  const confidenceMap = { low: 1, medium: 2, high: 3 };
  const avgConf =
    decisions.length > 0
      ? decisions.reduce((acc, d) => acc + confidenceMap[d.confidence], 0) / decisions.length
      : 0;

  // Average impact score
  const avgImpact =
    decisions.length > 0
      ? decisions.reduce((acc, d) => acc + d.impactScore, 0) / decisions.length
      : 0;

  // Success rate: resolved decisions that have a positive outcome
  const positiveOutcomes = outcomes.filter((o) => o.sentiment === 'positive');
  const successRate =
    resolved.length > 0 ? (positiveOutcomes.length / resolved.length) * 100 : 0;

  // Category breakdown
  const categoryBreakdown: Record<string, number> = {};
  for (const d of decisions) {
    categoryBreakdown[d.category] = (categoryBreakdown[d.category] ?? 0) + 1;
  }

  // Monthly trend (last 6 months)
  const monthlyMap: Record<string, MonthlyTrend> = {};
  for (const d of decisions) {
    const key = format(startOfMonth(parseISO(d.createdAt)), 'MMM yyyy');
    if (!monthlyMap[key]) monthlyMap[key] = { month: key, decisions: 0, resolved: 0, debt: 0 };
    monthlyMap[key].decisions += 1;
    if (d.status === 'resolved') monthlyMap[key].resolved += 1;
  }
  for (const db of decisionDebts) {
    const key = format(startOfMonth(parseISO(db.createdAt)), 'MMM yyyy');
    if (!monthlyMap[key]) monthlyMap[key] = { month: key, decisions: 0, resolved: 0, debt: 0 };
    monthlyMap[key].debt += 1;
  }

  const monthlyTrend = Object.values(monthlyMap).slice(-6);

  return {
    totalDecisions: decisions.length,
    resolvedDecisions: resolved.length,
    pendingDecisions: pending.length,
    averageConfidence: avgConf,
    averageImpact: parseFloat(avgImpact.toFixed(1)),
    successRate: parseFloat(successRate.toFixed(1)),
    totalDebt: decisionDebts.length,
    unresolvedDebt: decisionDebts.filter((d) => !d.resolved).length,
    categoryBreakdown,
    monthlyTrend,
  };
}

export function formatConfidence(val: number): string {
  if (val >= 2.5) return 'High';
  if (val >= 1.5) return 'Medium';
  return 'Low';
}
