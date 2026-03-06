import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from '@/store';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { Dashboard } from '@/pages/Dashboard';
import { DecisionsPage } from '@/pages/Decisions';
import { OutcomesPage } from '@/pages/Outcomes';
import { DebtPage } from '@/pages/Debt';
import { AnalyticsPage } from '@/pages/Analytics';
import { ActiveView, Decision } from '@/types';
import {
  subscribeToDecisions,
  subscribeToOutcomes,
  subscribeToDebts,
  seedUserData,
} from '@/firebase/firestore';
import { SEED_DATA } from '@/store/seedData';

// ─── Firestore Sync ────────────────────────────────────────────────────────
// Subscribes to the authenticated user's Firestore collections and keeps
// the local store in sync via per-collection SET actions.
function FirestoreSync() {
  const { user } = useAuth();
  const { dispatch } = useStore();
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch({ type: 'RESET' });
      setSeeded(false);
      return;
    }

    dispatch({ type: 'SET_SYNC_STATUS', payload: 'syncing' });

    // Track whether initial load is complete for all 3 collections
    let decisionsReady = false;
    let outcomesReady = false;
    let debtsReady = false;
    let firstLoad = true;

    const checkAllReady = () => {
      if (decisionsReady && outcomesReady && debtsReady) {
        dispatch({ type: 'SET_SYNC_STATUS', payload: 'synced' });
      }
    };

    const unsubDecisions = subscribeToDecisions(user.uid, async (decisions) => {
      // On very first snapshot for a new user, seed example data
      if (firstLoad && decisions.length === 0 && !seeded) {
        setSeeded(true);
        try {
          await seedUserData(user.uid, SEED_DATA.decisions, SEED_DATA.outcomes, SEED_DATA.decisionDebts);
        } catch (e) {
          console.error('Failed to seed data:', e);
        }
        // The onSnapshot listeners will fire again with the seeded data
        firstLoad = false;
        return;
      }
      firstLoad = false;
      dispatch({ type: 'SET_DECISIONS', payload: decisions });
      decisionsReady = true;
      checkAllReady();
    });

    const unsubOutcomes = subscribeToOutcomes(user.uid, (outcomes) => {
      dispatch({ type: 'SET_OUTCOMES', payload: outcomes });
      outcomesReady = true;
      checkAllReady();
    });

    const unsubDebts = subscribeToDebts(user.uid, (debts) => {
      dispatch({ type: 'SET_DEBTS', payload: debts });
      debtsReady = true;
      checkAllReady();
    });

    // Mark offline if Firestore is unreachable after 8s
    const offlineTimer = setTimeout(() => {
      if (!decisionsReady) dispatch({ type: 'SET_SYNC_STATUS', payload: 'offline' });
    }, 8000);

    return () => {
      unsubDecisions();
      unsubOutcomes();
      unsubDebts();
      clearTimeout(offlineTimer);
    };
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

// ─── Loading Spinner ───────────────────────────────────────────────────────
function AuthLoadingScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '2px solid var(--color-border)',
          borderTop: '2px solid var(--color-amber)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <div
        style={{
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-text-muted)',
          letterSpacing: '0.08em',
        }}
      >
        AUTHENTICATING
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Main App Shell ────────────────────────────────────────────────────────
function AppInner() {
  const { user, authLoading } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  if (authLoading) return <AuthLoadingScreen />;
  if (!user) return <LoginScreen />;

  const handleSelectDecision = (d: Decision) => {
    setSelectedDecision(d);
    setActiveView('decisions');
  };

  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
    if (view !== 'decisions') setSelectedDecision(null);
  };

  return (
    <>
      <FirestoreSync />
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
        <Sidebar activeView={activeView} onNavigate={handleNavigate} />
        <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh' }}>
          {activeView === 'dashboard' && (
            <Dashboard onNavigate={handleNavigate} onSelectDecision={handleSelectDecision} />
          )}
          {activeView === 'decisions' && <DecisionsPage />}
          {activeView === 'outcomes' && <OutcomesPage />}
          {activeView === 'debt' && <DebtPage />}
          {activeView === 'analytics' && <AnalyticsPage />}
        </main>
      </div>
    </>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppInner />
      </StoreProvider>
    </AuthProvider>
  );
}
