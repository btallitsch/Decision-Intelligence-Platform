import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Decision, Alternative, OpportunityCost, DecisionStatus, ConfidenceLevel, ImpactScore } from '@/types';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

const CATEGORIES = [
  'Engineering', 'Product', 'Strategy', 'People', 'Finance',
  'Marketing', 'Operations', 'Legal', 'Partnerships', 'Other',
];

interface DecisionFormProps {
  initial?: Decision;
  onSave: (data: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'> | Decision) => void;
  onCancel: () => void;
}

const emptyAlternative = (): Alternative => ({
  id: uuid(), description: '', estimatedValue: '', reason: '',
});

const emptyCost = (): OpportunityCost => ({
  description: '', estimatedValue: '', timeframe: '', probability: 50,
});

export const DecisionForm: React.FC<DecisionFormProps> = ({ initial, onSave, onCancel }) => {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [context, setContext] = useState(initial?.context ?? '');
  const [chosenOption, setChosenOption] = useState(initial?.chosenOption ?? '');
  const [category, setCategory] = useState(initial?.category ?? 'Strategy');
  const [status, setStatus] = useState<DecisionStatus>(initial?.status ?? 'active');
  const [confidence, setConfidence] = useState<ConfidenceLevel>(initial?.confidence ?? 'medium');
  const [impactScore, setImpactScore] = useState<ImpactScore>(initial?.impactScore ?? 5);
  const [reversible, setReversible] = useState(initial?.reversible ?? true);
  const [reviewDate, setReviewDate] = useState(initial?.reviewDate ?? '');
  const [tags, setTags] = useState(initial?.tags.join(', ') ?? '');
  const [alternatives, setAlternatives] = useState<Alternative[]>(
    initial?.alternatives.length ? initial.alternatives : [emptyAlternative()]
  );
  const [costs, setCosts] = useState<OpportunityCost[]>(
    initial?.opportunityCosts.length ? initial.opportunityCosts : [emptyCost()]
  );

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

  const fieldStyle: React.CSSProperties = { marginBottom: '18px' };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const data = {
      ...(initial ?? {}),
      title: title.trim(),
      context: context.trim(),
      chosenOption: chosenOption.trim(),
      category,
      status,
      confidence,
      impactScore,
      reversible,
      reviewDate: reviewDate || null,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      alternatives: alternatives.filter((a) => a.description.trim()),
      opportunityCosts: costs.filter((c) => c.description.trim()),
    };
    onSave(data as Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>);
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Title */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Decision Title *</label>
        <input
          style={inputStyle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What is the core decision being made?"
        />
      </div>

      {/* Context */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Context & Background</label>
        <textarea
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Why is this decision necessary? What problem does it solve?"
        />
      </div>

      {/* Chosen Option */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Chosen Option</label>
        <textarea
          style={{ ...inputStyle, minHeight: '64px', resize: 'vertical' }}
          value={chosenOption}
          onChange={(e) => setChosenOption(e.target.value)}
          placeholder="Describe the option you chose or are committing to."
        />
      </div>

      {/* Meta row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '18px' }}>
        <div>
          <label style={labelStyle}>Category</label>
          <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value as DecisionStatus)}>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="reversed">Reversed</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Confidence</label>
          <select style={inputStyle} value={confidence} onChange={(e) => setConfidence(e.target.value as ConfidenceLevel)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '18px' }}>
        <div>
          <label style={labelStyle}>Impact Score (1–10)</label>
          <input
            style={inputStyle}
            type="number"
            min={1}
            max={10}
            value={impactScore}
            onChange={(e) => setImpactScore(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)) as ImpactScore)}
          />
        </div>
        <div>
          <label style={labelStyle}>Review Date</label>
          <input style={inputStyle} type="date" value={reviewDate} onChange={(e) => setReviewDate(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Reversible?</label>
          <select style={inputStyle} value={reversible ? 'yes' : 'no'} onChange={(e) => setReversible(e.target.value === 'yes')}>
            <option value="yes">Yes — can be undone</option>
            <option value="no">No — one-way door</option>
          </select>
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Tags (comma-separated)</label>
        <input style={inputStyle} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. strategy, hiring, q3" />
      </div>

      {/* Alternatives */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Alternatives Considered</label>
          <Button variant="ghost" size="sm" icon={<Plus size={12} />} onClick={() => setAlternatives([...alternatives, emptyAlternative()])}>
            Add
          </Button>
        </div>
        {alternatives.map((alt, i) => (
          <div key={alt.id} style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '12px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>ALT {i + 1}</span>
              <button onClick={() => setAlternatives(alternatives.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-red)', padding: 0 }}>
                <Trash2 size={13} />
              </button>
            </div>
            <input style={{ ...inputStyle, marginBottom: '6px' }} placeholder="Description" value={alt.description} onChange={(e) => setAlternatives(alternatives.map((a, j) => j === i ? { ...a, description: e.target.value } : a))} />
            <input style={{ ...inputStyle, marginBottom: '6px' }} placeholder="Estimated value / benefit" value={alt.estimatedValue} onChange={(e) => setAlternatives(alternatives.map((a, j) => j === i ? { ...a, estimatedValue: e.target.value } : a))} />
            <input style={inputStyle} placeholder="Why not chosen?" value={alt.reason} onChange={(e) => setAlternatives(alternatives.map((a, j) => j === i ? { ...a, reason: e.target.value } : a))} />
          </div>
        ))}
      </div>

      {/* Opportunity Costs */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Opportunity Costs</label>
          <Button variant="ghost" size="sm" icon={<Plus size={12} />} onClick={() => setCosts([...costs, emptyCost()])}>
            Add
          </Button>
        </div>
        {costs.map((cost, i) => (
          <div key={i} style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '12px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>COST {i + 1}</span>
              <button onClick={() => setCosts(costs.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-red)', padding: 0 }}>
                <Trash2 size={13} />
              </button>
            </div>
            <input style={{ ...inputStyle, marginBottom: '6px' }} placeholder="What are you giving up?" value={cost.description} onChange={(e) => setCosts(costs.map((c, j) => j === i ? { ...c, description: e.target.value } : c))} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input style={inputStyle} placeholder="Estimated value" value={cost.estimatedValue} onChange={(e) => setCosts(costs.map((c, j) => j === i ? { ...c, estimatedValue: e.target.value } : c))} />
              <input style={inputStyle} placeholder="Timeframe" value={cost.timeframe} onChange={(e) => setCosts(costs.map((c, j) => j === i ? { ...c, timeframe: e.target.value } : c))} />
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!title.trim()}>
          {initial ? 'Save Changes' : 'Record Decision'}
        </Button>
      </div>
    </div>
  );
};
