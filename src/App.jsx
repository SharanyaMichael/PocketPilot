import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
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
import BillSplittingPage from './pages/BillSplittingPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import SavingsGoalsPage from './pages/SavingsGoalsPage';
import AffordabilityPage from './pages/AffordabilityPage';
import CoolingOffPage from './pages/CoolingOffPage';
import SettingsPage from './pages/SettingsPage';

function BillSplittingLanding() {
  return (
    <div className="min-h-screen bg-[#050B09] text-[#F0FDF4] flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#1C3930]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] font-bold">
            P
          </div>
          <span className="font-bold text-lg tracking-tight text-[#F0FDF4]">PocketPilot</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-[#A7C4B5]">
          <a href="#home" className="hover:text-white transition">Home</a>
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
          <a href="#about" className="hover:text-white transition">About</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-[#A7C4B5] hover:text-white transition cursor-pointer"
          >
            Log In
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#050B09] font-bold text-sm transition shadow-lg shadow-emerald-900/30 cursor-pointer"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Split bills, not <span className="text-[#10B981]">friendships.</span>
            </h1>
            <p className="text-[#A7C4B5] text-base sm:text-lg leading-relaxed">
              From dinners to trips, PocketPilot makes it easy to split expenses, track who owes what, and settle up — all in one place. No awkward math, no endless texts.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#050B09] font-bold text-sm transition shadow-lg shadow-emerald-900/30 flex items-center gap-2 cursor-pointer"
              >
                Get Started &rarr;
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded-xl bg-[#091510] hover:bg-[#0D1D16] text-[#F0FDF4] font-medium text-sm transition border border-[rgba(110,231,183,0.16)] cursor-pointer"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Graphic / Card Preview */}
          <div className="bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] rounded-2xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs text-[#A7C4B5] uppercase tracking-wider font-semibold">Group Expense</span>
                <h3 className="text-lg font-bold text-[#F0FDF4]">Friday Dinner 🍕</h3>
              </div>
              <span className="px-3 py-1 bg-[#10B981]/15 text-[#6EE7B7] border border-[#10B981]/30 rounded-full text-xs font-mono font-bold">
                ₹3,450.00
              </span>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-3 bg-[#091510] rounded-xl border border-[rgba(110,231,183,0.12)]">
                <div>
                  <p className="text-sm font-semibold text-[#F0FDF4]">You Paid</p>
                  <p className="text-xs text-[#A7C4B5]">Total amount</p>
                </div>
                <span className="px-2.5 py-1 bg-[#10B981]/20 text-[#6EE7B7] text-xs font-bold rounded-lg">Paid</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#091510] rounded-xl border border-[rgba(110,231,183,0.12)]">
                <div>
                  <p className="text-sm font-semibold text-[#F0FDF4]">Alex</p>
                  <p className="text-xs text-[#A7C4B5]">Owes ₹1,150</p>
                </div>
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-lg">Pending</span>
              </div>
            </div>
            <Link
              to="/dashboard/bills"
              className="block w-full py-3 bg-[#10B981] hover:bg-[#059669] text-[#050B09] font-bold text-center rounded-xl text-sm shadow-md transition cursor-pointer"
            >
              Send Reminders
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

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
            <Route path="/bills" element={<BillSplittingPage />} />
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