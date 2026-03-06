import React from 'react';
import { ActiveView } from '@/types';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

const PAGE_META: Record<ActiveView, { title: string; description: string }> = {
  dashboard: {
    title: 'Command Center',
    description: 'Your strategic decision overview',
  },
  decisions: {
    title: 'Decision Ledger',
    description: 'Full lifecycle tracking of every important choice',
  },
  outcomes: {
    title: 'Outcome Registry',
    description: 'Linking decisions to real-world results',
  },
  debt: {
    title: 'Decision Debt',
    description: 'Deferred, rushed, or incomplete decisions requiring attention',
  },
  analytics: {
    title: 'Intelligence Layer',
    description: 'Patterns, trends, and strategic insights from your decisions',
  },
};

interface HeaderProps {
  activeView: ActiveView;
  onAction?: () => void;
  actionLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({ activeView, onAction, actionLabel }) => {
  const meta = PAGE_META[activeView];

  return (
    <header
      style={{
        padding: '24px 32px 20px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        background: 'var(--color-bg)',
      }}
    >
      <div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {meta.title}
        </h1>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
          }}
        >
          {meta.description}
        </p>
      </div>

      {onAction && actionLabel && (
        <Button variant="primary" size="md" icon={<Plus size={14} />} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </header>
  );
};
