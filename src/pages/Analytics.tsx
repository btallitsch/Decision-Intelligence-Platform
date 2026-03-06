import React from 'react';
import { useStore } from '@/store';
import { computeMetrics } from '@/utils/analytics';
import { Header } from '@/components/layout/Header';
import { Card, StatCard } from '@/components/ui/Card';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TrendingUp, Activity, Target, BookOpen } from 'lucide-react';

const COLORS = ['#F59E0B', '#06B6D4', '#10B981', '#F97316', '#8B5CF6', '#EF4444'];

export const AnalyticsPage: React.FC = () => {
  const { state } = useStore();
  const metrics = computeMetrics(state);

  const categoryData = Object.entries(metrics.categoryBreakdown).map(([name, value]) => ({ name, value }));

  const sentimentData = [
    { name: 'Positive', value: state.outcomes.filter((o) => o.sentiment === 'positive').length },
    { name: 'Neutral', value: state.outcomes.filter((o) => o.sentiment === 'neutral').length },
    { name: 'Negative', value: state.outcomes.filter((o) => o.sentiment === 'negative').length },
  ].filter((d) => d.value > 0);

  const debtData = [
    { severity: 'Critical', count: state.decisionDebts.filter((d) => d.severity === 'critical' && !d.resolved).length },
    { severity: 'High', count: state.decisionDebts.filter((d) => d.severity === 'high' && !d.resolved).length },
    { severity: 'Medium', count: state.decisionDebts.filter((d) => d.severity === 'medium' && !d.resolved).length },
    { severity: 'Low', count: state.decisionDebts.filter((d) => d.severity === 'low' && !d.resolved).length },
  ];

  const confidenceBreakdown = [
    { confidence: 'High', count: state.decisions.filter((d) => d.confidence === 'high').length },
    { confidence: 'Medium', count: state.decisions.filter((d) => d.confidence === 'medium').length },
    { confidence: 'Low', count: state.decisions.filter((d) => d.confidence === 'low').length },
  ];

  // Reversibility
  const reversibleCount = state.decisions.filter((d) => d.reversible).length;
  const irreversibleCount = state.decisions.length - reversibleCount;

  // Average impact by category
  const impactByCategory = Object.entries(
    state.decisions.reduce<Record<string, number[]>>((acc, d) => {
      acc[d.category] = [...(acc[d.category] ?? []), d.impactScore];
      return acc;
    }, {})
  ).map(([category, scores]) => ({
    category,
    avgImpact: parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)),
  }));

  const tooltipStyle = {
    contentStyle: { background: '#1E2330', border: '1px solid #2A3040', borderRadius: '4px', fontFamily: 'IBM Plex Mono', fontSize: '11px' },
    labelStyle: { color: '#9CA3AF' },
  };

  const sectionTitle = (title: string, subtitle?: string) => (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: '0 0 4px' }}>
        {title}
      </h3>
      {subtitle && <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>{subtitle}</p>}
    </div>
  );

  return (
    <>
      <Header activeView="analytics" />
      <div style={{ padding: '28px 32px' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
          <StatCard label="Success Rate" value={`${metrics.successRate}%`} sub="Positive outcomes / resolved" accent="var(--color-green)" icon={<TrendingUp size={16} />} />
          <StatCard label="Avg. Impact Score" value={`${metrics.averageImpact}/10`} sub="Across all decisions" accent="var(--color-teal)" icon={<Activity size={16} />} />
          <StatCard label="Debt Resolution Rate" value={`${metrics.totalDebt > 0 ? Math.round(((metrics.totalDebt - metrics.unresolvedDebt) / metrics.totalDebt) * 100) : 0}%`} sub={`${metrics.unresolvedDebt} still open`} accent="var(--color-amber)" icon={<Target size={16} />} />
          <StatCard label="Total Lessons" value={state.outcomes.filter((o) => o.lessonsLearned).length} sub="Outcomes with lessons" accent="var(--color-purple, #8B5CF6)" icon={<BookOpen size={16} />} />
        </div>

        {/* Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Decisions by Category */}
          <Card style={{ padding: '20px' }}>
            {sectionTitle('Decisions by Category')}
            {categoryData.length === 0 ? (
              <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>No data</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', fontFamily: 'IBM Plex Mono' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Outcome Sentiment */}
          <Card style={{ padding: '20px' }}>
            {sectionTitle('Outcome Sentiments')}
            {sentimentData.length === 0 ? (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>No outcomes recorded</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={sentimentData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                    {sentimentData.map((entry) => (
                      <Cell key={entry.name} fill={entry.name === 'Positive' ? '#10B981' : entry.name === 'Neutral' ? '#F59E0B' : '#EF4444'} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', fontFamily: 'IBM Plex Mono' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Avg Impact by Category */}
          <Card style={{ padding: '20px' }}>
            {sectionTitle('Average Impact by Category', 'Reveals where decisions carry the most strategic weight')}
            {impactByCategory.length === 0 ? (
              <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>No data</div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={impactByCategory} layout="vertical">
                  <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 10, fill: '#666', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: '#999', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} width={70} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="avgImpact" fill="#F59E0B" radius={[0, 3, 3, 0]} name="Avg Impact" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Confidence Distribution */}
          <Card style={{ padding: '20px' }}>
            {sectionTitle('Confidence Distribution', 'How certain were you when making decisions?')}
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={confidenceBreakdown}>
                <XAxis dataKey="confidence" tick={{ fontSize: 10, fill: '#999', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#666', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="count" radius={[3, 3, 0, 0]} name="Decisions">
                  {confidenceBreakdown.map((entry) => (
                    <Cell key={entry.confidence} fill={entry.confidence === 'High' ? '#10B981' : entry.confidence === 'Medium' ? '#F59E0B' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Row 3 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Debt by Severity */}
          <Card style={{ padding: '20px' }}>
            {sectionTitle('Unresolved Debt by Severity')}
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={debtData}>
                <XAxis dataKey="severity" tick={{ fontSize: 10, fill: '#999', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#666', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="count" radius={[3, 3, 0, 0]} name="Items">
                  {debtData.map((entry) => (
                    <Cell key={entry.severity} fill={entry.severity === 'Critical' ? '#EF4444' : entry.severity === 'High' ? '#F97316' : entry.severity === 'Medium' ? '#F59E0B' : '#10B981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Reversibility */}
          <Card style={{ padding: '20px' }}>
            {sectionTitle('Decision Reversibility', 'One-way doors carry more risk — track them carefully')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Reversible</span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-green)' }}>
                    {reversibleCount} ({state.decisions.length > 0 ? Math.round((reversibleCount / state.decisions.length) * 100) : 0}%)
                  </span>
                </div>
                <div style={{ height: '8px', background: 'var(--color-surface-raised)', borderRadius: '4px' }}>
                  <div style={{ height: '100%', width: `${state.decisions.length > 0 ? (reversibleCount / state.decisions.length) * 100 : 0}%`, background: 'var(--color-green)', borderRadius: '4px' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>One-Way Door</span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-orange)' }}>
                    {irreversibleCount} ({state.decisions.length > 0 ? Math.round((irreversibleCount / state.decisions.length) * 100) : 0}%)
                  </span>
                </div>
                <div style={{ height: '8px', background: 'var(--color-surface-raised)', borderRadius: '4px' }}>
                  <div style={{ height: '100%', width: `${state.decisions.length > 0 ? (irreversibleCount / state.decisions.length) * 100 : 0}%`, background: 'var(--color-orange)', borderRadius: '4px' }} />
                </div>
              </div>
            </div>

            {/* Strategic insight */}
            <div style={{ marginTop: '24px', padding: '14px', background: 'var(--color-surface-raised)', borderRadius: '4px', borderLeft: '3px solid var(--color-amber)' }}>
              <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '6px' }}>Strategic Insight</div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                {irreversibleCount > reversibleCount
                  ? 'More than half of your decisions are one-way doors. Ensure these carry high confidence and detailed context.'
                  : 'Good reversibility ratio. Your strategic flexibility is maintained — keep tracking outcomes to validate this.'}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};
