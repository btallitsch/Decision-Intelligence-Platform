import React, { useState } from 'react';
import { Outcome, OutcomeSentiment, ImpactScore, Decision } from '@/types';
import { Button } from '@/components/ui/Button';

interface OutcomeFormProps {
  decisions: Decision[];
  initial?: Outcome;
  defaultDecisionId?: string;
  onSave: (data: Omit<Outcome, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const OutcomeForm: React.FC<OutcomeFormProps> = ({
  decisions, initial, defaultDecisionId, onSave, onCancel,
}) => {
  const [decisionId, setDecisionId] = useState(initial?.decisionId ?? defaultDecisionId ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [sentiment, setSentiment] = useState<OutcomeSentiment>(initial?.sentiment ?? 'positive');
  const [actualImpactScore, setActualImpactScore] = useState<ImpactScore>(initial?.actualImpactScore ?? 5);
  const [measuredAt, setMeasuredAt] = useState(
    initial?.measuredAt ? initial.measuredAt.slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [expectedVsActual, setExpectedVsActual] = useState(initial?.expectedVsActual ?? '');
  const [lessonsLearned, setLessonsLearned] = useState(initial?.lessonsLearned ?? '');

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--color-surface-raised)',
    border: '1px solid var(--color-border)',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '13px',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--color-text-muted)',
    marginBottom: '6px',
  };
  const field: React.CSSProperties = { marginBottom: '16px' };

  const handleSubmit = () => {
    if (!decisionId || !description.trim()) return;
    onSave({
      decisionId,
      description: description.trim(),
      sentiment,
      actualImpactScore,
      measuredAt: new Date(measuredAt).toISOString(),
      expectedVsActual: expectedVsActual.trim(),
      lessonsLearned: lessonsLearned.trim(),
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={field}>
        <label style={labelStyle}>Decision *</label>
        <select style={inputStyle} value={decisionId} onChange={(e) => setDecisionId(e.target.value)}>
          <option value="">Select a decision…</option>
          {decisions.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
        </select>
      </div>

      <div style={field}>
        <label style={labelStyle}>Outcome Description *</label>
        <textarea
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What actually happened as a result of this decision?"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', ...field }}>
        <div>
          <label style={labelStyle}>Sentiment</label>
          <select style={inputStyle} value={sentiment} onChange={(e) => setSentiment(e.target.value as OutcomeSentiment)}>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Actual Impact (1–10)</label>
          <input
            style={inputStyle}
            type="number"
            min={1} max={10}
            value={actualImpactScore}
            onChange={(e) => setActualImpactScore(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)) as ImpactScore)}
          />
        </div>
        <div>
          <label style={labelStyle}>Measured On</label>
          <input style={inputStyle} type="date" value={measuredAt} onChange={(e) => setMeasuredAt(e.target.value)} />
        </div>
      </div>

      <div style={field}>
        <label style={labelStyle}>Expected vs. Actual</label>
        <textarea
          style={{ ...inputStyle, minHeight: '64px', resize: 'vertical' }}
          value={expectedVsActual}
          onChange={(e) => setExpectedVsActual(e.target.value)}
          placeholder="How did reality compare to what you expected?"
        />
      </div>

      <div style={field}>
        <label style={labelStyle}>Lessons Learned</label>
        <textarea
          style={{ ...inputStyle, minHeight: '64px', resize: 'vertical' }}
          value={lessonsLearned}
          onChange={(e) => setLessonsLearned(e.target.value)}
          placeholder="What would you do differently next time?"
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!decisionId || !description.trim()}>
          {initial ? 'Save Changes' : 'Record Outcome'}
        </Button>
      </div>
    </div>
  );
};
