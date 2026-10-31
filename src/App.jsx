import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import AboutPage from './pages/AboutPage';

function PP() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <style>{`
        :root {
          --bg: #050B09;
          --surface: #091510;
          --emerald: #10B981;
          --mint: #6EE7B7;
          --text: #F0FDF4;
          --muted: #9CAFA3;
        }

        .landing-container {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: var(--bg);
          color: var(--text);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
          overflow: hidden;
          width: 100%;
          margin: 0;
          padding: 0;
        }

        .scene {
          width: min(1120px, 96vw);
          min-height: 560px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid rgba(110, 231, 183, 0.14);
          border-radius: 24px;
          background: 
            radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.08), transparent 58%),
            linear-gradient(135deg, #07100c, #050B09 55%, #08140e);
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.38);
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .scene:hover {
          border-color: rgba(110, 231, 183, 0.35);
          box-shadow: 0 30px 90px rgba(16, 185, 129, 0.12);
        }

        .logo-lockup {
          width: min(930px, 90%);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 36px;
          position: relative;
          z-index: 2;
        }

        .icon-svg {
          width: clamp(140px, 20vw, 220px);
          height: auto;
          opacity: 0;
          transform: translateX(100px) scale(0.78) rotate(4deg);
        }

        .wordmark-svg {
          width: clamp(280px, 45vw, 520px);
          height: auto;
          opacity: 0;
          transform: translateX(-115px) scale(0.94);
        }

        .star {
          position: absolute;
          z-index: 1;
          color: var(--mint);
          font-size: clamp(14px, 2vw, 24px);
          line-height: 1;
          opacity: 0;
        }

        .star::before {
          content: "✦";
          text-shadow: 0 0 14px rgba(110, 231, 183, 0.4);
        }

        .s1 { left: 16%; top: 25%; }
        .s2 { left: 28%; top: 69%; font-size: 15px; }
        .s3 { right: 17%; top: 22%; }
        .s4 { right: 24%; bottom: 23%; font-size: 17px; }
        .s5 { right: 12%; top: 48%; font-size: 12px; }
        .s6 { left: 43%; top: 17%; font-size: 12px; }

        .ring {
          position: absolute;
          width: 360px;
          height: 360px;
          border: 1px solid rgba(110, 231, 183, 0.13);
          border-radius: 50%;
          opacity: 0;
          z-index: 0;
        }

        .ring::before,
        .ring::after {
          content: "";
          position: absolute;
          inset: 25px;
          border: 1px solid rgba(110, 231, 183, 0.09);
          border-radius: 50%;
        }

        .ring::after {
          inset: 55px;
        }

        .footer-text-group {
          position: absolute;
          bottom: 22px;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          opacity: 0;
        }

        .tagline {
          color: var(--muted);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .cta-subtext {
          color: var(--mint);
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
          opacity: 0.85;
        }

        @keyframes iconArrive {
          0% { opacity: 0; transform: translateX(100px) scale(0.78) rotate(4deg); }
          70% { opacity: 1; transform: translateX(-4px) scale(1.025) rotate(0); }
          100% { opacity: 1; transform: translateX(0) scale(1) rotate(0); }
        }

        @keyframes wordArrive {
          0% { opacity: 0; transform: translateX(-115px) scale(0.94); }
          72% { opacity: 1; transform: translateX(5px) scale(1.01); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.45) rotate(-20deg); }
          35% { opacity: 0.95; transform: scale(1.12) rotate(8deg); }
          55% { opacity: 0.3; transform: scale(0.8) rotate(0); }
        }

        @keyframes ringIn {
          0% { opacity: 0; transform: scale(0.72); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes footerIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .playing .icon-svg { animation: iconArrive 1.05s cubic-bezier(0.18, 0.78, 0.25, 1) 0.15s forwards; }
        .playing .wordmark-svg { animation: wordArrive 1.05s cubic-bezier(0.18, 0.78, 0.25, 1) 0.48s forwards; }
        .playing .ring { animation: ringIn 1.3s ease-out 0.1s forwards; }
        .playing .footer-text-group { animation: footerIn 0.7s ease-out 1.2s forwards; }

        .playing .s1 { animation: twinkle 1.8s ease-in-out infinite 0.2s; }
        .playing .s2 { animation: twinkle 1.8s ease-in-out infinite 0.8s; }
        .playing .s3 { animation: twinkle 1.8s ease-in-out infinite 0.55s; }
        .playing .s4 { animation: twinkle 1.8s ease-in-out infinite 1.1s; }
        .playing .s5 { animation: twinkle 1.8s ease-in-out infinite 0.35s; }
        .playing .s6 { animation: twinkle 1.8s ease-in-out infinite 1.35s; }
      `}</style>

      <main className="scene playing" onClick={() => navigate('/dashboard')} aria-label="PocketPilot animated logo">
        <div className="ring"></div>
        <span className="star s1"></span>
        <span className="star s2"></span>
        <span className="star s3"></span>
        <span className="star s4"></span>
        <span className="star s5"></span>
        <span className="star s6"></span>

        <div className="logo-lockup">
          <svg className="icon-svg" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="80" width="140" height="60" rx="18" fill="#10B981" />
            <rect x="20" y="80" width="140" height="60" rx="18" stroke="#050B09" strokeWidth="4" />
            <rect x="130" y="100" width="30" height="20" rx="8" fill="#091510" />
            <circle cx="148" cy="110" r="4" fill="#10B981" />
            <circle cx="110" cy="52" r="32" stroke="#10B981" strokeWidth="9" />
            <circle cx="110" cy="52" r="20" stroke="#10B981" strokeWidth="5" />
            <circle cx="110" cy="52" r="6" fill="#10B981" />
            <path d="M128 34 L146 18 M146 18 L136 18 M146 18 L146 28" stroke="#10B981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="30" y="24" width="46" height="64" rx="8" fill="#F0FDF4" />
            <path d="M38 42 L44 48 L56 36" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M38 60 L44 66 L56 54" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="42" y="18" width="22" height="10" rx="4" fill="#10B981" />
          </svg>

          {/* Wordmark matching the reference design precisely */}
          <svg className="wordmark-svg" viewBox="0 0 520 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="75" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="76" fill="#F0FDF4" letterSpacing="-1.5">P</text>
            <circle cx="68" cy="53" r="21" fill="none" stroke="#F0FDF4" strokeWidth="13" />
            <path d="M62 60 L75 45 L71 57 Z" fill="#10B981" />
            <text x="96" y="75" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="76" fill="#F0FDF4" letterSpacing="-1.5">cket</text>
            <text x="246" y="75" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="76" fill="#10B981" letterSpacing="-1.5">Pilot</text>
          </svg>
        </div>

        <div className="footer-text-group">
          <div className="tagline">KNOW YOUR MONEY. PLAN YOUR NEXT MOVE.</div>
          <div className="cta-subtext">Click anywhere to get started &rarr;</div>
        </div>
      </main>
    </div>
  );
}

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [txModal, setTxModal] = useState({ isOpen: false, initialData: null });
  const [subModal, setSubModal] = useState({ isOpen: false, initialData: null });
  const [goalModal, setGoalModal] = useState({ isOpen: false, initialData: null, mode: 'manage' });
  const [coolingOffModal, setCoolingOffModal] = useState({ isOpen: false, mode: 'TIME_WINDOW' });

  return (
    <div className="min-h-screen bg-[#050B09] text-[#F0FDF4] flex font-sans relative">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ paddingLeft: sidebarCollapsed ? '80px' : '280px' }}
      >
        <Header onOpenNewTransaction={() => setTxModal({ isOpen: true, initialData: null })} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-[1400px] mx-auto">
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
                  onTriggerTestNudge={() => setCoolingOffModal({ isOpen: true, mode: 'TIME_WINDOW' })}
                  onOpenDailyBudgetModal={() => setCoolingOffModal({ isOpen: true, mode: 'DAILY_BUDGET' })}
                />
              }
            />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <CoolingOffModal
        isOpen={coolingOffModal.isOpen}
        mode={coolingOffModal.mode}
        onClose={() => setCoolingOffModal({ isOpen: false, mode: 'TIME_WINDOW' })}
      />

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
          <Route path="/" element={<PP />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dashboard/*" element={<DashboardLayout />} />
        </Routes>
      </BrowserRouter>
    </FinanceProvider>
  );
}