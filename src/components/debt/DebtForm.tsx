import React, { useState } from 'react';
import { DecisionDebt, DebtSeverity, Decision } from '@/types';
import { Button } from '@/components/ui/Button';

interface DebtFormProps {
  decisions: Decision[];
  initial?: DecisionDebt;
  defaultDecisionId?: string;
  onSave: (data: Omit<DecisionDebt, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const DebtForm: React.FC<DebtFormProps> = ({
  decisions, initial, defaultDecisionId, onSave, onCancel,
}) => {
  const [decisionId, setDecisionId] = useState(initial?.decisionId ?? defaultDecisionId ?? '');
  const [reason, setReason] = useState(initial?.reason ?? '');
  const [severity, setSeverity] = useState<DebtSeverity>(initial?.severity ?? 'medium');
  const [dueDate, setDueDate] = useState(initial?.dueDate?.slice(0, 10) ?? '');

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

  const handleSubmit = () => {
    if (!decisionId || !reason.trim()) return;
    onSave({
      decisionId,
      reason: reason.trim(),
      severity,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      resolved: false,
      resolvedAt: null,
      resolutionNotes: '',
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Decision *</label>
        <select style={inputStyle} value={decisionId} onChange={(e) => setDecisionId(e.target.value)}>
          <option value="">Select a decision…</option>
          {decisions.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Why Is This Debt? *</label>
        <textarea
          style={{ ...inputStyle, minHeight: '96px', resize: 'vertical' }}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="What made this decision rushed, incomplete, or likely to create future problems?"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
        <div>
          <label style={labelStyle}>Severity</label>
          <select style={inputStyle} value={severity} onChange={(e) => setSeverity(e.target.value as DebtSeverity)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Review Due Date</label>
          <input style={inputStyle} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!decisionId || !reason.trim()}>
          {initial ? 'Save Changes' : 'Flag as Debt'}
        </Button>
      </div>
    </div>
  );
};
