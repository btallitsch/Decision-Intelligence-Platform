import React from 'react';
import { LayoutDashboard, GitBranch, CheckCircle2, AlertTriangle, BarChart3 } from 'lucide-react';
import { ActiveView } from '@/types';
import { useStore } from '@/store';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface SidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const { state } = useStore();

  const unresolvedDebt = state.decisionDebts.filter((d) => !d.resolved).length;
  const pendingDecisions = state.decisions.filter(
    (d) => d.status === 'pending' || d.status === 'active'
  ).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    {
      id: 'decisions',
      label: 'Decisions',
      icon: <GitBranch size={16} />,
      badge: pendingDecisions || undefined,
    },
    { id: 'outcomes', label: 'Outcomes', icon: <CheckCircle2 size={16} /> },
    {
      id: 'debt',
      label: 'Decision Debt',
      icon: <AlertTriangle size={16} />,
      badge: unresolvedDebt || undefined,
    },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
  ];

  return (
    <aside
      style={{
        width: '220px',
        flexShrink: 0,
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '17px',
            fontWeight: 700,
            color: 'var(--color-text)',
            lineHeight: 1.2,
          }}
        >
          Decision
          <br />
          <span style={{ color: 'var(--color-amber)' }}>Intelligence</span>
        </div>
        <div
          style={{
            marginTop: '4px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
          }}
        >
          Strategic Thinking Platform
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '4px',
                border: 'none',
                background: isActive ? 'var(--color-amber)15' : 'transparent',
                color: isActive ? 'var(--color-amber)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
                fontWeight: isActive ? 500 : 400,
                transition: 'all 0.12s',
                textAlign: 'left',
                marginBottom: '2px',
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'var(--color-surface-raised)';
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.6, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge !== undefined && (
                <span
                  style={{
                    background: item.id === 'debt' ? 'var(--color-orange)' : 'var(--color-teal)',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '1px 7px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 500,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--color-border)',
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-text-muted)',
          letterSpacing: '0.05em',
        }}
      >
        {state.decisions.length} DECISIONS TRACKED
      </div>
    </aside>
  );
};
