// ─── Decision Status ───────────────────────────────────────────────────────
export type DecisionStatus = 'pending' | 'active' | 'resolved' | 'reversed';

// ─── Decision Confidence ───────────────────────────────────────────────────
export type ConfidenceLevel = 'low' | 'medium' | 'high';

// ─── Impact Score ──────────────────────────────────────────────────────────
export type ImpactScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// ─── Outcome Sentiment ────────────────────────────────────────────────────
export type OutcomeSentiment = 'positive' | 'neutral' | 'negative';

// ─── Debt Severity ────────────────────────────────────────────────────────
export type DebtSeverity = 'low' | 'medium' | 'high' | 'critical';

// ─── Alternative Option ───────────────────────────────────────────────────
export interface Alternative {
  id: string;
  description: string;
  estimatedValue: string;
  reason: string; // why NOT chosen
}

// ─── Opportunity Cost ────────────────────────────────────────────────────
export interface OpportunityCost {
  description: string;
  estimatedValue: string; // qualitative or quantitative
  timeframe: string;
  probability: number; // 0–100
}

// ─── Decision ────────────────────────────────────────────────────────────
export interface Decision {
  id: string;
  title: string;
  context: string;
  chosenOption: string;
  alternatives: Alternative[];
  opportunityCosts: OpportunityCost[];
  status: DecisionStatus;
  confidence: ConfidenceLevel;
  impactScore: ImpactScore;
  category: string;
  tags: string[];
  reversible: boolean;
  reviewDate: string | null; // ISO string
  createdAt: string;
  updatedAt: string;
}

// ─── Outcome ─────────────────────────────────────────────────────────────
export interface Outcome {
  id: string;
  decisionId: string;
  description: string;
  measuredAt: string; // ISO string
  sentiment: OutcomeSentiment;
  actualImpactScore: ImpactScore;
  expectedVsActual: string; // narrative comparison
  lessonsLearned: string;
  createdAt: string;
}

// ─── Decision Debt ────────────────────────────────────────────────────────
export interface DecisionDebt {
  id: string;
  decisionId: string;
  reason: string; // why it's debt: rushed, incomplete info, etc.
  severity: DebtSeverity;
  dueDate: string | null; // ISO string for review
  resolved: boolean;
  resolvedAt: string | null;
  resolutionNotes: string;
  createdAt: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────
export interface DecisionMetrics {
  totalDecisions: number;
  resolvedDecisions: number;
  pendingDecisions: number;
  averageConfidence: number;
  averageImpact: number;
  successRate: number; // % of resolved with positive outcome
  totalDebt: number;
  unresolvedDebt: number;
  categoryBreakdown: Record<string, number>;
  monthlyTrend: MonthlyTrend[];
}

export interface MonthlyTrend {
  month: string;
  decisions: number;
  resolved: number;
  debt: number;
}

// ─── Store State ──────────────────────────────────────────────────────────
export interface AppState {
  decisions: Decision[];
  outcomes: Outcome[];
  decisionDebts: DecisionDebt[];
}

// ─── UI State ─────────────────────────────────────────────────────────────
export type ActiveView = 'dashboard' | 'decisions' | 'outcomes' | 'debt' | 'analytics';
