import { format, formatDistanceToNow, parseISO, isPast } from 'date-fns';
import { DecisionStatus, DebtSeverity, ConfidenceLevel, OutcomeSentiment } from '@/types';

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'MMM d, yyyy');
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true });
}

export function isOverdue(iso: string): boolean {
  return isPast(parseISO(iso));
}

export function statusLabel(status: DecisionStatus): string {
  const map: Record<DecisionStatus, string> = {
    pending: 'Pending',
    active: 'In Progress',
    resolved: 'Resolved',
    reversed: 'Reversed',
  };
  return map[status];
}

export function statusColor(status: DecisionStatus): string {
  const map: Record<DecisionStatus, string> = {
    pending: 'var(--color-amber)',
    active: 'var(--color-teal)',
    resolved: 'var(--color-green)',
    reversed: 'var(--color-muted)',
  };
  return map[status];
}

export function severityColor(severity: DebtSeverity): string {
  const map: Record<DebtSeverity, string> = {
    low: 'var(--color-green)',
    medium: 'var(--color-amber)',
    high: 'var(--color-orange)',
    critical: 'var(--color-red)',
  };
  return map[severity];
}

export function confidenceColor(confidence: ConfidenceLevel): string {
  const map: Record<ConfidenceLevel, string> = {
    low: 'var(--color-red)',
    medium: 'var(--color-amber)',
    high: 'var(--color-green)',
  };
  return map[confidence];
}

export function sentimentColor(sentiment: OutcomeSentiment): string {
  const map: Record<OutcomeSentiment, string> = {
    positive: 'var(--color-green)',
    neutral: 'var(--color-amber)',
    negative: 'var(--color-red)',
  };
  return map[sentiment];
}

export function sentimentIcon(sentiment: OutcomeSentiment): string {
  const map: Record<OutcomeSentiment, string> = {
    positive: '↑',
    neutral: '→',
    negative: '↓',
  };
  return map[sentiment];
}
