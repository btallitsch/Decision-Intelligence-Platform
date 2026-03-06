import React, { useState } from 'react';
import { Outcome } from '@/types';
import { useOutcomes, useDecisions } from '@/hooks';
import { OutcomeForm } from '@/components/outcomes/OutcomeForm';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { sentimentColor, sentimentIcon, formatDate } from '@/utils/formatters';
import { Edit2, Trash2 } from 'lucide-react';

export const OutcomesPage: React.FC = () => {
  const { outcomes, addOutcome, updateOutcome, deleteOutcome } = useOutcomes();
  const { decisions } = useDecisions();
  const [editingOutcome, setEditingOutcome] = useState<Outcome | null | 'new'>(null);

  const getDecisionTitle = (id: string) =>
    decisions.find((d) => d.id === id)?.title ?? 'Unknown Decision';

  const sorted = [...outcomes].sort(
    (a, b) => new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime()
  );

  return (
    <>
      <Header activeView="outcomes" onAction={() => setEditingOutcome('new')} actionLabel="Record Outcome" />

      <div style={{ padding: '24px 32px' }}>
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: '15px', marginBottom: '8px' }}>No outcomes recorded yet</p>
            <p style={{ fontSize: '13px', marginBottom: '20px' }}>Outcomes link decisions to real-world results, creating a feedback loop for better future choices.</p>
            <Button variant="primary" onClick={() => setEditingOutcome('new')}>Record your first outcome</Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sorted.map((o) => (
              <Card key={o.id} style={{ padding: '20px' }} accent={sentimentColor(o.sentiment)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1 }}>
                    <span style={{ fontSize: '22px', color: sentimentColor(o.sentiment), fontFamily: 'var(--font-mono)', lineHeight: 1.2, flexShrink: 0 }}>
                      {sentimentIcon(o.sentiment)}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', color: 'var(--color-text)', margin: '0 0 6px', lineHeight: 1.6 }}>{o.description}</p>
                      <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                        {getDecisionTitle(o.decisionId)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <Button variant="ghost" size="sm" icon={<Edit2 size={12} />} onClick={() => setEditingOutcome(o)} />
                    <Button variant="ghost" size="sm" icon={<Trash2 size={12} />} onClick={() => deleteOutcome(o.id)} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                  <Badge label={o.sentiment} color={sentimentColor(o.sentiment)} />
                  <Badge label={`actual impact ${o.actualImpactScore}/10`} color="var(--color-teal)" />
                  <Badge label={`measured ${formatDate(o.measuredAt)}`} />
                </div>

                {(o.expectedVsActual || o.lessonsLearned) && (
                  <div style={{ display: 'grid', gridTemplateColumns: o.expectedVsActual && o.lessonsLearned ? '1fr 1fr' : '1fr', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                    {o.expectedVsActual && (
                      <div>
                        <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Expected vs. Actual</div>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>{o.expectedVsActual}</p>
                      </div>
                    )}
                    {o.lessonsLearned && (
                      <div>
                        <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Lessons Learned</div>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>{o.lessonsLearned}</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={editingOutcome !== null}
        onClose={() => setEditingOutcome(null)}
        title={editingOutcome === 'new' ? 'Record Outcome' : 'Edit Outcome'}
        subtitle="Document a real-world result tied to a past decision."
      >
        <OutcomeForm
          decisions={decisions}
          initial={editingOutcome !== 'new' && editingOutcome ? editingOutcome : undefined}
          onSave={(data) => {
            if (editingOutcome === 'new') {
              addOutcome(data);
            } else if (editingOutcome) {
              updateOutcome({ ...editingOutcome, ...data });
            }
            setEditingOutcome(null);
          }}
          onCancel={() => setEditingOutcome(null)}
        />
      </Modal>
    </>
  );
};
