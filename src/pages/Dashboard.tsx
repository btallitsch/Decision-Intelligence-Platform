import React from 'react';
import { useStore } from '@/store';
import { computeMetrics } from '@/utils/analytics';
import { statusColor, formatRelative, severityColor } from '@/utils/formatters';
import { StatCard, Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { GitBranch, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { ActiveView, Decision } from '@/types';

interface DashboardProps {
  onNavigate: (view: ActiveView) => void;
  onSelectDecision: (d: Decision) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onSelectDecision }) => {
  const { state } = useStore();
  const metrics = computeMetrics(state);

  const recentDecisions = [...state.decisions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const criticalDebts = state.decisionDebts
    .filter((d) => !d.resolved && (d.severity === 'critical' || d.severity === 'high'))
    .slice(0, 4);

  return (
    <div style={{ padding: '28px 32px' }}>
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
        <StatCard
          label="Total Decisions"
          value={metrics.totalDecisions}
          sub={`${metrics.resolvedDecisions} resolved`}
          accent="var(--color-amber)"
          icon={<GitBranch size={16} />}
        />
        <StatCard
          label="Success Rate"
          value={`${metrics.successRate}%`}
          sub="Positive outcomes / resolved"
          accent="var(--color-green)"
          icon={<TrendingUp size={16} />}
        />
        <StatCard
          label="Avg. Impact"
          value={`${metrics.averageImpact}/10`}
          sub="Across all decisions"
          accent="var(--color-teal)"
          icon={<Activity size={16} />}
        />
        <StatCard
          label="Decision Debt"
          value={metrics.unresolvedDebt}
          sub={`${metrics.totalDebt} total items`}
          accent={metrics.unresolvedDebt > 0 ? 'var(--color-orange)' : 'var(--color-green)'}
          icon={<AlertTriangle size={16} />}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* Trend Chart */}
        <Card style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: '0 0 20px' }}>
            Decision Activity Trend
          </h3>
          {metrics.monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={metrics.monthlyTrend}>
                <defs>
                  <linearGradient id="ambGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#666', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#666', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#1E2330', border: '1px solid #2A3040', borderRadius: '4px', fontFamily: 'IBM Plex Mono', fontSize: '12px' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Area type="monotone" dataKey="decisions" stroke="#F59E0B" fill="url(#ambGrad)" strokeWidth={2} name="Decisions" />
                <Area type="monotone" dataKey="resolved" stroke="#06B6D4" fill="url(#tealGrad)" strokeWidth={2} name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
              No trend data yet
            </div>
          )}
        </Card>

        {/* Category breakdown */}
        <Card style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: '0 0 16px' }}>
            Decisions by Category
          </h3>
          {Object.keys(metrics.categoryBreakdown).length === 0 ? (
            <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>No data yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(metrics.categoryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, count]) => {
                  const pct = Math.round((count / metrics.totalDecisions) * 100);
                  return (
                    <div key={cat}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{cat}</span>
                        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{count} · {pct}%</span>
                      </div>
                      <div style={{ height: '4px', background: 'var(--color-surface-raised)', borderRadius: '2px' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--color-amber)', borderRadius: '2px', transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Decisions */}
        <Card style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0 }}>
              Recent Decisions
            </h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('decisions')}>View all</Button>
          </div>
          {recentDecisions.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>No decisions yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recentDecisions.map((d) => (
                <div
                  key={d.id}
                  onClick={() => onSelectDecision(d)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.12s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-raised)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor(d.status), flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '13px', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', flexShrink: 0 }}>{formatRelative(d.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Critical Debt */}
        <Card style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0 }}>
              Urgent Debt
            </h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('debt')}>View all</Button>
          </div>
          {criticalDebts.length === 0 ? (
            <p style={{ color: 'var(--color-green)', fontSize: '13px' }}>✓ No critical or high-severity debt</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {criticalDebts.map((debt) => {
                const decision = state.decisions.find((d) => d.id === debt.decisionId);
                return (
                  <div key={debt.id} style={{ padding: '10px 12px', borderRadius: '4px', border: `1px solid ${severityColor(debt.severity)}30`, background: `${severityColor(debt.severity)}08` }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <Badge label={debt.severity} color={severityColor(debt.severity)} />
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {decision?.title ?? 'Unknown'}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {debt.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
