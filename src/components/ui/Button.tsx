import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  loading,
  children,
  disabled,
  style,
  ...rest
}) => {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    border: 'none',
    outline: 'none',
    transition: 'all 0.15s ease',
    opacity: disabled || loading ? 0.5 : 1,
    whiteSpace: 'nowrap',
  };

  const sizes: Record<Size, React.CSSProperties> = {
    sm: { padding: '5px 12px', fontSize: '12px', borderRadius: '3px' },
    md: { padding: '8px 16px', fontSize: '13px', borderRadius: '4px' },
    lg: { padding: '11px 22px', fontSize: '14px', borderRadius: '4px' },
  };

  const variants: Record<Variant, React.CSSProperties> = {
    primary: {
      background: 'var(--color-amber)',
      color: '#0D0F14',
    },
    secondary: {
      background: 'var(--color-surface-raised)',
      color: 'var(--color-text)',
      border: '1px solid var(--color-border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text-secondary)',
    },
    danger: {
      background: 'var(--color-red)20',
      color: 'var(--color-red)',
      border: '1px solid var(--color-red)40',
    },
  };

  return (
    <button
      disabled={disabled || loading}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      {...rest}
    >
      {loading ? <span style={{ fontSize: '12px' }}>⟳</span> : icon}
      {children}
    </button>
  );
};
