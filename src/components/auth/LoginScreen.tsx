import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export const LoginScreen: React.FC = () => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign-in failed';
      // Ignore popup-closed-by-user
      if (!msg.includes('popup-closed')) setError('Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background decorative grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />

      {/* Amber glow top-right */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          right: '-200px',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Left panel — brand + value prop */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo mark */}
        <div style={{ marginBottom: '48px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              background: 'var(--color-amber)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L3 8.5V15.5L12 21L21 15.5V8.5L12 3Z" stroke="#0C0E14" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 3V21M3 8.5L21 15.5M21 8.5L3 15.5" stroke="#0C0E14" strokeWidth="1.5" strokeOpacity="0.5"/>
            </svg>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--color-text)',
              lineHeight: 1.2,
              marginBottom: '6px',
            }}
          >
            Decision<br />
            <span style={{ color: 'var(--color-amber)' }}>Intelligence</span>
          </div>
          <div
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
            }}
          >
            Strategic Thinking Platform
          </div>
        </div>

        {/* Tagline */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '42px',
            fontWeight: 600,
            color: 'var(--color-text)',
            lineHeight: 1.25,
            marginBottom: '20px',
            maxWidth: '480px',
          }}
        >
          Turn every decision into a strategic asset.
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.8,
            maxWidth: '440px',
            marginBottom: '48px',
          }}
        >
          Track the full lifecycle of your decisions — context, alternatives,
          opportunity costs, outcomes, and debt — across every device. Your
          strategic knowledge base, always in sync.
        </p>

        {/* Feature bullets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            ['⬡', 'Decision Ledger', 'Context, alternatives & trade-offs'],
            ['◈', 'Outcome Tracking', 'Link choices to real-world results'],
            ['◎', 'Decision Debt', 'Flag rushed decisions before they compound'],
            ['▦', 'Intelligence Layer', 'Patterns and insights across all your decisions'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <span
                style={{
                  fontSize: '16px',
                  color: 'var(--color-amber)',
                  flexShrink: 0,
                  marginTop: '1px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {icon}
              </span>
              <div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    marginBottom: '1px',
                  }}
                >
                  {title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — auth card */}
      <div
        style={{
          width: '440px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: '100%',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '40px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: '8px',
            }}
          >
            Sign in to continue
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              marginBottom: '32px',
              lineHeight: 1.6,
            }}
          >
            Your decisions are synced to the cloud and available on all your devices.
          </p>

          {/* Google Sign-in Button */}
          <button
            onClick={handleSignIn}
            disabled={loading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '13px 20px',
              background: loading ? 'var(--color-surface-raised)' : '#fff',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'var(--font-body)',
              color: '#1a1a1a',
              transition: 'all 0.15s',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLButtonElement).style.transform = 'none';
            }}
          >
            {/* Google logo SVG */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A9.009 9.009 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            {loading ? 'Signing in…' : 'Continue with Google'}
          </button>

          {error && (
            <div
              style={{
                marginTop: '12px',
                padding: '10px 14px',
                background: 'var(--color-red)15',
                border: '1px solid var(--color-red)30',
                borderRadius: '4px',
                fontSize: '12px',
                color: 'var(--color-red)',
              }}
            >
              {error}
            </div>
          )}

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '24px 0',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              SECURE · PRIVATE
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
          </div>

          <p
            style={{
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              lineHeight: 1.7,
              textAlign: 'center',
            }}
          >
            Your data is stored in your own Firebase project. Only you can access
            it. Sign in with your Google account to get started.
          </p>
        </div>
      </div>
    </div>
  );
};
