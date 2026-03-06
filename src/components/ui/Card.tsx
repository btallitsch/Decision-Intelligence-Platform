import React from 'react';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  hoverable?: boolean;
  onClick?: () => void;
  accent?: string; // left border color
}

export const Card: React.FC<CardProps> = ({ children, style, hoverable, onClick, accent }) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '6px',
        borderLeft: accent ? `3px solid ${accent}` : undefined,
        cursor: hoverable ? 'pointer' : undefined,
        transition: hoverable ? 'border-color 0.15s, transform 0.15s' : undefined,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-amber)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          (e.currentTarget as HTMLDivElement).style.borderColor = accent ?? 'var(--color-border)';
        }
      }}
    >
      {children}
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, sub, accent, icon }) => (
  <div
    style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderTop: accent ? `2px solid ${accent}` : '2px solid var(--color-border)',
      borderRadius: '6px',
      padding: '20px',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
      }}
    >
      <span
        style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
        }}
      >
        {label}
      </span>
      {icon && <span style={{ color: accent ?? 'var(--color-text-muted)', opacity: 0.6 }}>{icon}</span>}
    </div>
    <div
      style={{
        fontSize: '32px',
        fontFamily: 'var(--font-mono)',
        fontWeight: 500,
        color: accent ?? 'var(--color-text)',
        lineHeight: 1,
        marginBottom: '6px',
      }}
    >
      {value}
    </div>
    {sub && (
      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{sub}</div>
    )}
  </div>
);
