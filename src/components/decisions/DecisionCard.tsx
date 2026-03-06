import React from 'react';
import { Decision } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  statusLabel,
  statusColor,
  confidenceColor,
  formatRelative,
} from '@/utils/formatters';
import { Edit2, Trash2, ChevronRight, Lock, Unlock } from 'lucide-react';

interface DecisionCardProps {
  decision: Decision;
  outcomeCount: number;
  debtCount: number;
  onEdit: () => void;
  onDelete: () => void;
  onSelect: () => void;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  decision,
  outcomeCount,
  debtCount,
  onEdit,
  onDelete,
  onSelect,
}) => {
  return (
    <Card
      accent={statusColor(decision.status)}
      hoverable
      onClick={onSelect}
      style={{ padding: '18px 20px' }}
    >
      {/* Top row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '10px',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: '0 0 6px',
              lineHeight: 1.3,
            }}
          >
            {decision.title}
          </h3>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              margin: 0,
              lineHeight: 1.5,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {decision.context}
          </p>
        </div>

        {/* Actions */}
        <div
          style={{ display: 'flex', gap: '4px', flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="sm" icon={<Edit2 size={12} />} onClick={onEdit} />
          <Button variant="ghost" size="sm" icon={<Trash2 size={12} />} onClick={onDelete} />
          <Button variant="ghost" size="sm" icon={<ChevronRight size={12} />} onClick={onSelect} />
        </div>
      </div>

      {/* Badges */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '12px',
          alignItems: 'center',
        }}
      >
        <Badge label={statusLabel(decision.status)} color={statusColor(decision.status)} />
        <Badge label={decision.category} />
        <Badge
          label={`${decision.confidence} confidence`}
          color={confidenceColor(decision.confidence)}
        />
        <Badge label={`impact ${decision.impactScore}/10`} color="var(--color-teal)" />
        {decision.reversible ? (
          <Badge label="reversible" color="var(--color-green)" />
        ) : (
          <Badge label="one-way door" color="var(--color-orange)" />
        )}
      </div>

      {/* Footer row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '10px',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
            {outcomeCount} outcome{outcomeCount !== 1 ? 's' : ''}
          </span>
          {debtCount > 0 && (
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-orange)' }}>
              {debtCount} debt item{debtCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {decision.reversible ? (
            <Unlock size={10} color="var(--color-text-muted)" />
          ) : (
            <Lock size={10} color="var(--color-orange)" />
          )}
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            {formatRelative(decision.createdAt)}
          </span>
        </div>
      </div>
    </Card>
  );
};
