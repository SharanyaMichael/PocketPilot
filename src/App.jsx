import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import BillSplittingLanding from './components/BillSplittingLanding';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CoolingOffModal from './components/CoolingOffModal';
import DailyLimitModal from './components/DailyLimitModal';
import TransactionModal from './components/TransactionModal';
import SubscriptionModal from './components/SubscriptionModal';
import SavingsGoalModal from './components/SavingsGoalModal';

import OverviewPage from './pages/OverviewPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';
import BillSplittingPage from './pages/BillSplittingPage'; // <-- IMPORTED HERE
import SubscriptionsPage from './pages/SubscriptionsPage';
import SavingsGoalsPage from './pages/SavingsGoalsPage';
import AffordabilityPage from './pages/AffordabilityPage';
import CoolingOffPage from './pages/CoolingOffPage';
import SettingsPage from './pages/SettingsPage';

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals state
  const [txModal, setTxModal] = useState({ isOpen: false, initialData: null });
  const [subModal, setSubModal] = useState({ isOpen: false, initialData: null });
  const [goalModal, setGoalModal] = useState({ isOpen: false, initialData: null, mode: 'manage' });

  return (
    <div className="min-h-screen bg-[#050B09] text-[#F0FDF4] flex flex-col lg:flex-row font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenNewTransaction={() => setTxModal({ isOpen: true, initialData: null })}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route
              path="/"
              element={
                <OverviewPage
                  onOpenNewTransaction={() => setTxModal({ isOpen: true, initialData: null })}
                  onOpenGoalModal={() => setGoalModal({ isOpen: true, initialData: null, mode: 'manage' })}
                />
              }
            />
            <Route
              path="/transactions"
              element={
                <TransactionsPage
                  onOpenNewTransaction={() => setTxModal({ isOpen: true, initialData: null })}
                  onEditTransaction={(tx) => setTxModal({ isOpen: true, initialData: tx })}
                />
              }
            />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/bills" element={<BillSplittingPage />} /> {/* <-- ROUTE ADDED HERE */}
            <Route
              path="/subscriptions"
              element={
                <SubscriptionsPage
                  onOpenNewSubscription={() => setSubModal({ isOpen: true, initialData: null })}
                  onEditSubscription={(sub) => setSubModal({ isOpen: true, initialData: sub })}
                />
              }
            />
            <Route
              path="/savings-goals"
              element={
                <SavingsGoalsPage
                  onOpenNewGoal={() => setGoalModal({ isOpen: true, initialData: null, mode: 'manage' })}
                  onEditGoal={(goal) => setGoalModal({ isOpen: true, initialData: goal, mode: 'manage' })}
                  onContributeGoal={(goal) => setGoalModal({ isOpen: true, initialData: goal, mode: 'contribute' })}
                />
              }
            />
            <Route path="/affordability" element={<AffordabilityPage />} />
            <Route
              path="/cooling-off"
              element={
                <CoolingOffPage
                  onOpenNewTransaction={() => setTxModal({ isOpen: true, initialData: null })}
                />
              }
            />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Modals */}
      <CoolingOffModal />
      <DailyLimitModal />

      <TransactionModal
        isOpen={txModal.isOpen}
        initialData={txModal.initialData}
        onClose={() => setTxModal({ isOpen: false, initialData: null })}
      />

      <SubscriptionModal
        isOpen={subModal.isOpen}
        initialData={subModal.initialData}
        onClose={() => setSubModal({ isOpen: false, initialData: null })}
      />

      <SavingsGoalModal
        isOpen={goalModal.isOpen}
        initialData={goalModal.initialData}
        mode={goalModal.mode}
        onClose={() => setGoalModal({ isOpen: false, initialData: null, mode: 'manage' })}
      />
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Landing Page */}
          <Route path="/" element={<BillSplittingLanding />} />
          
          {/* Dashboard Area */}
          <Route path="/dashboard/*" element={<DashboardLayout />} />
        </Routes>
      </BrowserRouter>
    </FinanceProvider>
  );
}