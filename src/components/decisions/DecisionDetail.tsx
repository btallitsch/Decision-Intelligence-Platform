import React from 'react';
import { Decision, Outcome, DecisionDebt } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  statusLabel, statusColor, confidenceColor, sentimentColor,
  sentimentIcon, severityColor, formatDate,
} from '@/utils/formatters';
import { ArrowLeft, Lock, Unlock, Calendar } from 'lucide-react';

interface DecisionDetailProps {
  decision: Decision;
  outcomes: Outcome[];
  debts: DecisionDebt[];
  onBack: () => void;
  onAddOutcome: () => void;
  onAddDebt: () => void;
  onResolveDebt: (debtId: string) => void;
}

export const DecisionDetail: React.FC<DecisionDetailProps> = ({
  decision, outcomes, debts, onBack, onAddOutcome, onAddDebt, onResolveDebt,
}) => {
  const sectionTitle = (title: string) => (
    <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: '0 0 12px', paddingBottom: '8px', borderBottom: '1px solid var(--color-border)' }}>
      {title}
    </h4>
  );

  return (
    <div style={{ padding: '24px 32px', maxWidth: '860px' }}>
      {/* Back */}
      <Button variant="ghost" size="sm" icon={<ArrowLeft size={13} />} onClick={onBack} style={{ marginBottom: '20px' }}>
        Back to Decisions
      </Button>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--color-text)', margin: 0, flex: 1 }}>
            {decision.title}
          </h2>
          {decision.reversible
            ? <span title="Reversible"><Unlock size={18} color="var(--color-green)" /></span>
            : <span title="One-way door"><Lock size={18} color="var(--color-orange)" /></span>}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          <Badge label={statusLabel(decision.status)} color={statusColor(decision.status)} size="md" />
          <Badge label={decision.category} size="md" />
          <Badge label={`${decision.confidence} confidence`} color={confidenceColor(decision.confidence)} size="md" />
          <Badge label={`impact ${decision.impactScore}/10`} color="var(--color-teal)" size="md" />
          {decision.tags.map((t) => <Badge key={t} label={t} />)}
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            <Calendar size={10} style={{ display: 'inline', marginRight: '4px' }} />
            Created {formatDate(decision.createdAt)}
          </span>
          {decision.reviewDate && (
            <span style={{ fontSize: '12px', color: 'var(--color-amber)', fontFamily: 'var(--font-mono)' }}>
              Review due {formatDate(decision.reviewDate)}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Context */}
        <Card style={{ padding: '16px' }}>
          {sectionTitle('Context')}
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{decision.context || '—'}</p>
        </Card>
        {/* Chosen Option */}
        <Card style={{ padding: '16px' }} accent="var(--color-amber)">
          {sectionTitle('Chosen Option')}
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{decision.chosenOption || '—'}</p>
        </Card>
      </div>

      {/* Alternatives */}
      {decision.alternatives.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          {sectionTitle(`Alternatives Considered (${decision.alternatives.length})`)}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
            {decision.alternatives.map((alt) => (
              <Card key={alt.id} style={{ padding: '14px' }}>
                <p style={{ fontSize: '13px', color: 'var(--color-text)', margin: '0 0 8px', fontWeight: 500 }}>{alt.description}</p>
                {alt.estimatedValue && <p style={{ fontSize: '12px', color: 'var(--color-teal)', margin: '0 0 4px' }}>Value: {alt.estimatedValue}</p>}
                {alt.reason && <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>Rejected: {alt.reason}</p>}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Opportunity Costs */}
      {decision.opportunityCosts.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          {sectionTitle('Opportunity Costs')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
            {decision.opportunityCosts.map((oc, i) => (
              <Card key={i} style={{ padding: '14px' }} accent="var(--color-orange)">
                <p style={{ fontSize: '13px', color: 'var(--color-text)', margin: '0 0 8px', fontWeight: 500 }}>{oc.description}</p>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <span>{oc.estimatedValue}</span>
                  <span>{oc.timeframe}</span>
                  <span style={{ color: 'var(--color-amber)' }}>{oc.probability}% likely</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Outcomes */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          {sectionTitle(`Outcomes (${outcomes.length})`)}
          <Button variant="secondary" size="sm" onClick={onAddOutcome}>+ Record Outcome</Button>
        </div>
        {outcomes.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No outcomes recorded yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {outcomes.map((o) => (
              <Card key={o.id} style={{ padding: '16px' }} accent={sentimentColor(o.sentiment)}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px', color: sentimentColor(o.sentiment), fontFamily: 'var(--font-mono)' }}>{sentimentIcon(o.sentiment)}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', color: 'var(--color-text)', margin: '0 0 6px', lineHeight: 1.6 }}>{o.description}</p>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                      Measured {formatDate(o.measuredAt)} · Impact {o.actualImpactScore}/10
                    </div>
                  </div>
                </div>
                {o.lessonsLearned && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>Lessons</span>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '4px 0 0', lineHeight: 1.6 }}>{o.lessonsLearned}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Decision Debt */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          {sectionTitle(`Decision Debt (${debts.length})`)}
          <Button variant="secondary" size="sm" onClick={onAddDebt}>+ Flag Debt</Button>
        </div>
        {debts.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No debt flagged for this decision.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {debts.map((d) => (
              <Card key={d.id} style={{ padding: '16px', opacity: d.resolved ? 0.6 : 1 }} accent={d.resolved ? 'var(--color-green)' : severityColor(d.severity)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Badge label={d.resolved ? 'Resolved' : d.severity} color={d.resolved ? 'var(--color-green)' : severityColor(d.severity)} />
                  {!d.resolved && (
                    <Button variant="secondary" size="sm" onClick={() => onResolveDebt(d.id)}>Mark Resolved</Button>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-text)', margin: '0 0 6px', lineHeight: 1.6 }}>{d.reason}</p>
                {d.dueDate && <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-amber)' }}>Due {formatDate(d.dueDate)}</span>}
                {d.resolved && d.resolutionNotes && <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '8px 0 0', lineHeight: 1.5 }}>{d.resolutionNotes}</p>}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
