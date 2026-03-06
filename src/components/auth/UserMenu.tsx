import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogOut, ChevronUp, Cloud, CloudOff, Loader } from 'lucide-react';
import { useStore } from '@/store';

export const UserMenu: React.FC = () => {
  const { user, logOut } = useAuth();
  const { state } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  const syncStatus = state.syncStatus;
  const SyncIcon =
    syncStatus === 'syncing' ? Loader :
    syncStatus === 'offline' ? CloudOff :
    Cloud;

  const syncColor =
    syncStatus === 'synced'  ? 'var(--color-green)' :
    syncStatus === 'syncing' ? 'var(--color-amber)' :
    syncStatus === 'error'   ? 'var(--color-red)' :
    syncStatus === 'offline' ? 'var(--color-text-muted)' :
    'var(--color-text-muted)';

  const syncLabel =
    syncStatus === 'synced'  ? 'Synced' :
    syncStatus === 'syncing' ? 'Syncing…' :
    syncStatus === 'error'   ? 'Sync error' :
    syncStatus === 'offline' ? 'Offline' :
    'Cloud sync';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '10px',
            right: '10px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            zIndex: 100,
          }}
        >
          {/* User info */}
          <div
            style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <div
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--color-text)',
                marginBottom: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user.displayName}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {user.email}
            </div>
          </div>

          {/* Sync status */}
          <div
            style={{
              padding: '10px 16px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <SyncIcon
              size={13}
              color={syncColor}
              style={{
                animation: syncStatus === 'syncing' ? 'spin 1s linear infinite' : undefined,
              }}
            />
            <span style={{ fontSize: '12px', color: syncColor }}>{syncLabel}</span>
          </div>

          {/* Sign out */}
          <button
            onClick={() => { setOpen(false); logOut(); }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-body)',
              textAlign: 'left',
              transition: 'background 0.1s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-raised)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 14px',
          background: 'none',
          border: 'none',
          borderTop: '1px solid var(--color-border)',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.12s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-raised)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
      >
        {/* Avatar */}
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName ?? ''}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              flexShrink: 0,
              border: '1px solid var(--color-border)',
            }}
          />
        ) : (
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--color-amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: '#0C0E14',
              flexShrink: 0,
            }}
          >
            {(user.displayName ?? user.email ?? 'U')[0].toUpperCase()}
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user.displayName ?? user.email}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '1px',
            }}
          >
            <SyncIcon
              size={10}
              color={syncColor}
              style={{
                animation: syncStatus === 'syncing' ? 'spin 1s linear infinite' : undefined,
              }}
            />
            <span
              style={{
                fontSize: '10px',
                color: syncColor,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {syncLabel}
            </span>
          </div>
        </div>

        <ChevronUp
          size={13}
          color="var(--color-text-muted)"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }}
        />
      </button>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
