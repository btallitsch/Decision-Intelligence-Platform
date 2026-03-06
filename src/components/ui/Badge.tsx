import React from 'react';

interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, color, size = 'sm' }) => {
  const padding = size === 'sm' ? '2px 8px' : '4px 12px';
  const fontSize = size === 'sm' ? '11px' : '12px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding,
        borderRadius: '2px',
        fontSize,
        fontFamily: 'var(--font-mono)',
        fontWeight: 500,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: color ?? 'var(--color-text-secondary)',
        border: `1px solid ${color ?? 'var(--color-border)'}`,
        background: color ? `${color}15` : 'var(--color-surface)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
};
