import React, { useState } from 'react';
import { StoreProvider } from '@/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/pages/Dashboard';
import { DecisionsPage } from '@/pages/Decisions';
import { OutcomesPage } from '@/pages/Outcomes';
import { DebtPage } from '@/pages/Debt';
import { AnalyticsPage } from '@/pages/Analytics';
import { ActiveView, Decision } from '@/types';

function AppInner() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  const handleSelectDecision = (d: Decision) => {
    setSelectedDecision(d);
    setActiveView('decisions');
  };

  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
    if (view !== 'decisions') setSelectedDecision(null);
  };

  return (
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
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  );
}
