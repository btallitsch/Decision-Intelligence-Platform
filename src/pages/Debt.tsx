import React, { useState } from 'react';
import { DecisionDebt } from '@/types';
import { useDecisionDebt, useDecisions } from '@/hooks';
import { DebtForm } from '@/components/debt/DebtForm';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { severityColor, formatDate, isOverdue } from '@/utils/formatters';
import { Edit2, Trash2, CheckCircle } from 'lucide-react';

export const DebtPage: React.FC = () => {
  const { debts, addDebt, updateDebt, deleteDebt, resolveDebt } = useDecisionDebt();
  const { decisions } = useDecisions();
  const [editingDebt, setEditingDebt] = useState<DecisionDebt | null | 'new'>(null);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolved, setShowResolved] = useState(false);

  const getDecisionTitle = (id: string) =>
    decisions.find((d) => d.id === id)?.title ?? 'Unknown Decision';

  const unresolved = debts.filter((d) => !d.resolved)
    .sort((a, b) => {
      const sev = { critical: 4, high: 3, medium: 2, low: 1 };
      return sev[b.severity] - sev[a.severity];
    });

  const resolved = debts.filter((d) => d.resolved)
    .sort((a, b) => new Date(b.resolvedAt!).getTime() - new Date(a.resolvedAt!).getTime());

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

  const DebtItem = ({ debt }: { debt: DecisionDebt }) => (
    <Card
      style={{ padding: '18px 20px', opacity: debt.resolved ? 0.7 : 1 }}
      accent={debt.resolved ? 'var(--color-green)' : severityColor(debt.severity)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px', alignItems: 'center' }}>
            <Badge
              label={debt.resolved ? 'Resolved' : debt.severity}
              color={debt.resolved ? 'var(--color-green)' : severityColor(debt.severity)}
            />
            {debt.dueDate && !debt.resolved && (
              <Badge
                label={`Due ${formatDate(debt.dueDate)}`}
                color={isOverdue(debt.dueDate) ? 'var(--color-red)' : 'var(--color-amber)'}
              />
            )}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text)', margin: '0 0 6px', lineHeight: 1.6 }}>
            {debt.reason}
          </p>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
            {getDecisionTitle(debt.decisionId)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          {!debt.resolved && (
            <Button variant="ghost" size="sm" icon={<CheckCircle size={12} />} onClick={() => { setResolvingId(debt.id); setResolutionNotes(''); }}>
              Resolve
            </Button>
          )}
          <Button variant="ghost" size="sm" icon={<Edit2 size={12} />} onClick={() => setEditingDebt(debt)} />
          <Button variant="ghost" size="sm" icon={<Trash2 size={12} />} onClick={() => deleteDebt(debt.id)} />
        </div>
      </div>

      {debt.resolved && debt.resolutionNotes && (
        <div style={{ paddingTop: '10px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
            Resolution
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
            {debt.resolutionNotes}
          </p>
          {debt.resolvedAt && (
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginTop: '6px' }}>
              Resolved {formatDate(debt.resolvedAt)}
            </div>
          )}
        </div>
      )}
    </Card>
  );

  return (
    <>
      <Header activeView="debt" onAction={() => setEditingDebt('new')} actionLabel="Flag Debt" />

      <div style={{ padding: '24px 32px' }}>
        {/* Summary */}
        {unresolved.length > 0 && (
          <div style={{ background: 'var(--color-orange)10', border: '1px solid var(--color-orange)30', borderRadius: '6px', padding: '14px 18px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '20px' }}>⚠</span>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--color-text)', fontWeight: 500, marginBottom: '2px' }}>
                {unresolved.length} unresolved debt item{unresolved.length !== 1 ? 's' : ''} require attention
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {unresolved.filter((d) => d.severity === 'critical').length} critical ·{' '}
                {unresolved.filter((d) => d.severity === 'high').length} high ·{' '}
                {unresolved.filter((d) => d.dueDate && isOverdue(d.dueDate)).length} overdue
              </div>
            </div>
          </div>
        )}

        {/* Unresolved */}
        {unresolved.length === 0 && resolved.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: '15px', marginBottom: '8px' }}>No decision debt flagged</p>
            <p style={{ fontSize: '13px', marginBottom: '20px' }}>Decision debt tracks rushed, incomplete, or deferred decisions that may create future problems.</p>
            <Button variant="primary" onClick={() => setEditingDebt('new')}>Flag your first debt item</Button>
          </div>
        ) : (
          <>
            {unresolved.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                  Unresolved ({unresolved.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {unresolved.map((d) => <DebtItem key={d.id} debt={d} />)}
                </div>
              </div>
            )}

            {resolved.length > 0 && (
              <div>
                <Button variant="ghost" size="sm" onClick={() => setShowResolved(!showResolved)} style={{ marginBottom: '12px' }}>
                  {showResolved ? '▼' : '▶'} Resolved ({resolved.length})
                </Button>
                {showResolved && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {resolved.map((d) => <DebtItem key={d.id} debt={d} />)}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Flag Debt Modal */}
      <Modal
        isOpen={editingDebt !== null}
        onClose={() => setEditingDebt(null)}
        title={editingDebt === 'new' ? 'Flag Decision Debt' : 'Edit Debt Item'}
        subtitle="Identify a decision that was rushed, incomplete, or likely to cause future problems."
      >
        <DebtForm
          decisions={decisions}
          initial={editingDebt !== 'new' && editingDebt ? editingDebt : undefined}
          onSave={(data) => {
            if (editingDebt === 'new') {
              addDebt(data);
            } else if (editingDebt) {
              updateDebt({ ...editingDebt, ...data });
            }
            setEditingDebt(null);
          }}
          onCancel={() => setEditingDebt(null)}
        />
      </Modal>

      {/* Resolve Modal */}
      <Modal isOpen={resolvingId !== null} onClose={() => setResolvingId(null)} title="Resolve Debt" subtitle="Document how this debt was addressed.">
        <div style={{ padding: '24px' }}>
          <textarea
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            placeholder="How was this debt resolved? What corrective actions were taken?"
            style={{ ...inputStyle, minHeight: '96px', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button variant="ghost" onClick={() => setResolvingId(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => { if (resolvingId) { resolveDebt(resolvingId, resolutionNotes); setResolvingId(null); } }}>
              Mark Resolved
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
