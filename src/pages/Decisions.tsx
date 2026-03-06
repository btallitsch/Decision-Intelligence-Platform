import React, { useState, useMemo } from 'react';
import { Decision, DecisionStatus } from '@/types';
import { useDecisions, useOutcomes, useDecisionDebt } from '@/hooks';
import { DecisionCard } from '@/components/decisions/DecisionCard';
import { DecisionDetail } from '@/components/decisions/DecisionDetail';
import { DecisionForm } from '@/components/decisions/DecisionForm';
import { OutcomeForm } from '@/components/outcomes/OutcomeForm';
import { DebtForm } from '@/components/debt/DebtForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { Search } from 'lucide-react';

export const DecisionsPage: React.FC = () => {
  const { decisions, addDecision, updateDecision, deleteDecision } = useDecisions();
  const { addOutcome, getOutcomesForDecision } = useOutcomes();
  const { addDebt, resolveDebt, getDebtForDecision } = useDecisionDebt();

  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [editingDecision, setEditingDecision] = useState<Decision | null | 'new'>(null);
  const [addingOutcomeForId, setAddingOutcomeForId] = useState<string | null>(null);
  const [addingDebtForId, setAddingDebtForId] = useState<string | null>(null);
  const [resolvingDebtId, setResolvingDebtId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<DecisionStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = new Set(decisions.map((d) => d.category));
    return Array.from(cats).sort();
  }, [decisions]);

  const filtered = useMemo(() => {
    return decisions.filter((d) => {
      if (filterStatus !== 'all' && d.status !== filterStatus) return false;
      if (filterCategory !== 'all' && d.category !== filterCategory) return false;
      if (search && !d.title.toLowerCase().includes(search.toLowerCase()) &&
          !d.context.toLowerCase().includes(search.toLowerCase()) &&
          !d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))) return false;
      return true;
    });
  }, [decisions, filterStatus, filterCategory, search]);

  if (selectedDecision) {
    return (
      <>
        <Header activeView="decisions" />
        <DecisionDetail
          decision={selectedDecision}
          outcomes={getOutcomesForDecision(selectedDecision.id)}
          debts={getDebtForDecision(selectedDecision.id)}
          onBack={() => setSelectedDecision(null)}
          onAddOutcome={() => setAddingOutcomeForId(selectedDecision.id)}
          onAddDebt={() => setAddingDebtForId(selectedDecision.id)}
          onResolveDebt={(id) => { setResolvingDebtId(id); setResolutionNotes(''); }}
        />

        {/* Outcome Modal */}
        <Modal isOpen={addingOutcomeForId !== null} onClose={() => setAddingOutcomeForId(null)} title="Record Outcome" subtitle="Document what actually happened as a result of this decision.">
          <OutcomeForm
            decisions={decisions}
            defaultDecisionId={addingOutcomeForId ?? undefined}
            onSave={(data) => { addOutcome(data); setAddingOutcomeForId(null); }}
            onCancel={() => setAddingOutcomeForId(null)}
          />
        </Modal>

        {/* Debt Modal */}
        <Modal isOpen={addingDebtForId !== null} onClose={() => setAddingDebtForId(null)} title="Flag Decision Debt" subtitle="Identify what makes this decision rushed or incomplete.">
          <DebtForm
            decisions={decisions}
            defaultDecisionId={addingDebtForId ?? undefined}
            onSave={(data) => { addDebt(data); setAddingDebtForId(null); }}
            onCancel={() => setAddingDebtForId(null)}
          />
        </Modal>

        {/* Resolve Debt Modal */}
        <Modal isOpen={resolvingDebtId !== null} onClose={() => setResolvingDebtId(null)} title="Resolve Decision Debt" subtitle="Document how this debt was addressed.">
          <div style={{ padding: '24px' }}>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="How was this debt resolved? What did you learn?"
              style={{ width: '100%', background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '10px 12px', fontSize: '13px', color: 'var(--color-text)', minHeight: '80px', resize: 'vertical', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button variant="ghost" onClick={() => setResolvingDebtId(null)}>Cancel</Button>
              <Button variant="primary" onClick={() => { if (resolvingDebtId) { resolveDebt(resolvingDebtId, resolutionNotes); setResolvingDebtId(null); } }}>
                Mark Resolved
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  }

  return (
    <>
      <Header activeView="decisions" onAction={() => setEditingDecision('new')} actionLabel="New Decision" />

      {/* Filters */}
      <div style={{ padding: '16px 32px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '300px' }}>
          <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search decisions…"
            style={{ width: '100%', paddingLeft: '32px', background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '7px 10px 7px 32px', fontSize: '12px', color: 'var(--color-text)', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as DecisionStatus | 'all')}
          style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '7px 10px', fontSize: '12px', color: 'var(--color-text)', fontFamily: 'var(--font-body)', outline: 'none' }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
          <option value="reversed">Reversed</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '7px 10px', fontSize: '12px', color: 'var(--color-text)', fontFamily: 'var(--font-body)', outline: 'none' }}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
          {filtered.length} / {decisions.length} decisions
        </span>
      </div>

      {/* List */}
      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: '15px', marginBottom: '8px' }}>No decisions found</p>
            <Button variant="primary" onClick={() => setEditingDecision('new')}>Record your first decision</Button>
          </div>
        ) : (
          filtered.map((d) => (
            <DecisionCard
              key={d.id}
              decision={d}
              outcomeCount={getOutcomesForDecision(d.id).length}
              debtCount={getDebtForDecision(d.id).filter((db) => !db.resolved).length}
              onEdit={() => setEditingDecision(d)}
              onDelete={() => deleteDecision(d.id)}
              onSelect={() => setSelectedDecision(d)}
            />
          ))
        )}
      </div>

      {/* New/Edit Modal */}
      <Modal
        isOpen={editingDecision !== null}
        onClose={() => setEditingDecision(null)}
        title={editingDecision === 'new' ? 'Record New Decision' : 'Edit Decision'}
        subtitle="Document a strategic choice with full context and trade-offs."
        width="720px"
      >
        <DecisionForm
          initial={editingDecision !== 'new' && editingDecision ? editingDecision : undefined}
          onSave={(data) => {
            if (editingDecision === 'new') {
              addDecision(data as Parameters<typeof addDecision>[0]);
            } else if (editingDecision) {
              updateDecision(data as Decision);
            }
            setEditingDecision(null);
          }}
          onCancel={() => setEditingDecision(null)}
        />
      </Modal>
    </>
  );
};
