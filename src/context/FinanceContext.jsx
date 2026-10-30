// @refresh reload
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = 'https://pocketpilot-backend-1ouw.onrender.com';

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [summary, setSummary] = useState(null);

  // Initialize transactions with local storage fallback for instant responsiveness
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('pocketpilot_transactions_local');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [subscriptions, setSubscriptions] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [cooldown, setCooldown] = useState({
    is_active: false,
    start_time: null,
    duration_seconds: 0,
    expiry_time: null,
    remaining_seconds: 0,
    reason: ''
  });
  const [cooldownLogs, setCooldownLogs] = useState([]);
  const [settings, setSettings] = useState({
    monthly_budget: 65000,
    min_savings_buffer: 20000,
    preferred_currency: 'INR',
    currency_symbol: '₹',
    demo_mode_enabled: true
  });

  // Optional Daily Limit State
  const [dailyLimit, setDailyLimit] = useState(() => {
    return localStorage.getItem('pocket_pilot_daily_limit') || '';
  });

  const [insightsData, setInsightsData] = useState({ insights: [], has_user_data: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [error, setError] = useState(null);

  // Global Intercept Modal State
  const [interceptModal, setInterceptModal] = useState({
    isOpen: false,
    attemptedPurchase: null,
    todaySpent: 0,
    dailyLimit: null,
    reason: 'cooldown', // 'cooldown' or 'daily_limit'
    onSuccessCallback: null
  });

  // Ticking timer for Cooldown Mode
  const timerRef = useRef(null);

  const updateDailyLimit = (value) => {
    setDailyLimit(value);
    if (value) {
      localStorage.setItem('pocket_pilot_daily_limit', value);
    } else {
      localStorage.removeItem('pocket_pilot_daily_limit');
    }
  };

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/summary`);
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (e) {
      console.warn('Backend summary fetch failed:', e);
    }
  }, []);

  const fetchTransactions = useCallback(async (filters = {}) => {
    try {
      const query = new URLSearchParams();
      if (filters.category) query.append('category', filters.category);
      if (filters.type) query.append('type', filters.type);
      if (filters.search) query.append('search', filters.search);
      if (filters.start_date) query.append('start_date', filters.start_date);
      if (filters.end_date) query.append('end_date', filters.end_date);

      const res = await fetch(`${API_BASE}/api/transactions?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setTransactions(data);
          localStorage.setItem('pocketpilot_transactions_local', JSON.stringify(data));
        }
      }
    } catch (e) {
      console.warn('Backend transactions fetch failed, using local:', e);
    }
  }, []);

  const fetchSubscriptions = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/subscriptions`);
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data);
      }
    } catch (e) {
      console.warn('Backend subscriptions fetch failed:', e);
    }
  }, []);

  const fetchSavingsGoals = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/savings-goals`);
      if (res.ok) {
        const data = await res.json();
        setSavingsGoals(data);
      }
    } catch (e) {
      console.warn('Backend savings goals fetch failed:', e);
    }
  }, []);

  const fetchCooldown = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cooldown`);
      if (res.ok) {
        const data = await res.json();
        setCooldown(data);
      }
    } catch (e) {
      console.warn('Backend cooldown fetch failed:', e);
    }
  }, []);

  const fetchCooldownLogs = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cooldown/logs`);
      if (res.ok) {
        const data = await res.json();
        setCooldownLogs(data);
      }
    } catch (e) {
      console.warn('Backend cooldown logs fetch failed:', e);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/settings`);
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (e) {
      console.warn('Backend settings fetch failed:', e);
    }
  }, []);

  const fetchInsights = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/insights`);
      if (res.ok) {
        const data = await res.json();
        setInsightsData(data);
      }
    } catch (e) {
      console.warn('Backend insights fetch failed:', e);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    setIsWakingUp(false);

    const wakeupTimer = setTimeout(() => {
      setIsWakingUp(true);
    }, 3000);

    try {
      await Promise.all([
        fetchSummary(),
        fetchTransactions(),
        fetchSubscriptions(),
        fetchSavingsGoals(),
        fetchCooldown(),
        fetchCooldownLogs(),
        fetchSettings(),
        fetchInsights()
      ]);
    } finally {
      clearTimeout(wakeupTimer);
      setIsLoading(false);
      setIsWakingUp(false);
    }
  }, [fetchSummary, fetchTransactions, fetchSubscriptions, fetchSavingsGoals, fetchCooldown, fetchCooldownLogs, fetchSettings, fetchInsights]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (cooldown.is_active && cooldown.remaining_seconds > 0) {
      timerRef.current = setInterval(() => {
        setCooldown(prev => {
          if (!prev.is_active || prev.remaining_seconds <= 1) {
            clearInterval(timerRef.current);
            fetchCooldown();
            return { ...prev, is_active: false, remaining_seconds: 0 };
          }
          return { ...prev, remaining_seconds: prev.remaining_seconds - 1 };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cooldown.is_active, cooldown.expiry_time, fetchCooldown]);

  const addTransaction = async (txData, overrideCooldown = false) => {
    const isExpense = (txData.type || 'expense').toLowerCase() === 'expense';

    if (isExpense && cooldown.is_active && !overrideCooldown) {
      return new Promise((resolve) => {
        setInterceptModal({
          isOpen: true,
          attemptedPurchase: txData,
          reason: 'cooldown',
          onSuccessCallback: async (shouldSave, overridden) => {
            if (shouldSave) {
              const res = await executeAddTransaction(txData, true);
              resolve({ intercepted: true, saved: true, result: res });
            } else {
              await logCooldownAction('CANCELLED', txData, 'Cancelled during Global Cooldown');
              resolve({ intercepted: true, saved: false });
            }
          }
        });
      });
    }

    if (isExpense && dailyLimit && Number(dailyLimit) > 0 && !overrideCooldown) {
      const todayStr = new Date().toISOString().split('T')[0];
      const todaySpent = transactions
        .filter(tx => (tx.type || 'expense').toLowerCase() === 'expense' && tx.date?.startsWith(todayStr))
        .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

      const newAmount = Number(txData.amount || 0);

      if (todaySpent + newAmount > Number(dailyLimit)) {
        return new Promise((resolve) => {
          setInterceptModal({
            isOpen: true,
            attemptedPurchase: txData,
            todaySpent,
            dailyLimit: Number(dailyLimit),
            reason: 'daily_limit',
            onSuccessCallback: async (shouldSave, overridden) => {
              if (shouldSave) {
                const res = await executeAddTransaction(txData, true);
                if (overridden) {
                  await logCooldownAction('OVERRIDDEN', txData, 'Daily spend limit exceeded but overridden');
                }
                resolve({ intercepted: true, saved: true, result: res });
              } else {
                await logCooldownAction('CANCELLED', txData, 'Cancelled after exceeding Daily Limit');
                resolve({ intercepted: true, saved: false });
              }
            }
          });
        });
      }
    }

    const res = await executeAddTransaction(txData, overrideCooldown);
    return { intercepted: false, saved: true, result: res };
  };

  const executeAddTransaction = async (txData, overrideCooldown) => {
    const transactionWithId = {
      ...txData,
      id: txData.id || 'tx_' + Date.now(),
      date: txData.date || new Date().toISOString().split('T')[0]
    };

    // 1. Instantly prepend to state and localStorage so it shows up immediately
    setTransactions(prev => {
      const updated = [transactionWithId, ...prev];
      localStorage.setItem('pocketpilot_transactions_local', JSON.stringify(updated));
      return updated;
    });

    // 2. Sync with backend asynchronously
    try {
      const res = await fetch(`${API_BASE}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...txData, override_cooldown: overrideCooldown })
      });

      if (res.ok) {
        const responseJson = await res.json();
        const created = responseJson.transaction || responseJson.data || responseJson;
        if (created && created.id) {
          setTransactions(prev => {
            const updated = prev.map(t => t.id === transactionWithId.id ? created : t);
            localStorage.setItem('pocketpilot_transactions_local', JSON.stringify(updated));
            return updated;
          });
        }
        await Promise.all([fetchSummary(), fetchInsights()]);
      }
    } catch (e) {
      console.warn('Backend sync failed, transaction saved locally:', e);
    }

    return transactionWithId;
  };

  const updateTransaction = async (id, updateData) => {
    try {
      setTransactions(prev => {
        const updated = prev.map(t => t.id === id ? { ...t, ...updateData } : t);
        localStorage.setItem('pocketpilot_transactions_local', JSON.stringify(updated));
        return updated;
      });

      const res = await fetch(`${API_BASE}/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      if (!res.ok) throw new Error('Failed to update transaction');
      await Promise.all([fetchSummary(), fetchTransactions(), fetchInsights()]);
      return true;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      setTransactions(prev => {
        const updated = prev.filter(t => t.id !== id);
        localStorage.setItem('pocketpilot_transactions_local', JSON.stringify(updated));
        return updated;
      });

      const res = await fetch(`${API_BASE}/api/transactions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete transaction');
      await Promise.all([fetchSummary(), fetchTransactions(), fetchInsights()]);
      return true;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const activateCooldown = async (durationSeconds, reason = '') => {
    try {
      const res = await fetch(`${API_BASE}/api/cooldown/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration_seconds: durationSeconds, reason })
      });
      if (res.ok) {
        const state = await res.json();
        setCooldown(state);
        await fetchSummary();
        return state;
      }
    } catch (e) {
      console.error('Failed to activate cooldown:', e);
    }
  };

  const cancelCooldownSession = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cooldown/cancel-session`, { method: 'POST' });
      if (res.ok) {
        setCooldown(prev => ({ ...prev, is_active: false, remaining_seconds: 0 }));
        await fetchSummary();
        return true;
      }
    } catch (e) {
      console.error('Failed to cancel cooldown session:', e);
    }
  };

  const logCooldownAction = async (action, attemptedPurchase, notes = '') => {
    try {
      await fetch(`${API_BASE}/api/cooldown/intercept-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          attempted_amount: attemptedPurchase.amount,
          merchant: attemptedPurchase.clean_merchant || attemptedPurchase.description || attemptedPurchase.title || 'Expense Item',
          category: attemptedPurchase.category || 'Shopping',
          notes
        })
      });
      await fetchCooldownLogs();
    } catch (e) {
      console.error('Failed to log cooldown action:', e);
    }
  };

  const addSubscription = async (subData) => {
    const res = await fetch(`${API_BASE}/api/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subData)
    });
    if (!res.ok) throw new Error('Failed to create subscription');
    const created = await res.json();
    await Promise.all([fetchSubscriptions(), fetchSummary()]);
    return created;
  };

  const updateSubscription = async (id, updateData) => {
    const res = await fetch(`${API_BASE}/api/subscriptions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (!res.ok) throw new Error('Failed to update subscription');
    const updated = await res.json();
    await Promise.all([fetchSubscriptions(), fetchSummary()]);
    return updated;
  };

  const deleteSubscription = async (id) => {
    const res = await fetch(`${API_BASE}/api/subscriptions/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete subscription');
    await Promise.all([fetchSubscriptions(), fetchSummary()]);
    return true;
  };

  const addSavingsGoal = async (goalData) => {
    const res = await fetch(`${API_BASE}/api/savings-goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalData)
    });
    if (!res.ok) throw new Error('Failed to create goal');
    const created = await res.json();
    await Promise.all([fetchSavingsGoals(), fetchSummary()]);
    return created;
  };

  const updateSavingsGoal = async (id, updateData) => {
    const res = await fetch(`${API_BASE}/api/savings-goals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (!res.ok) throw new Error('Failed to update goal');
    const updated = await res.json();
    await Promise.all([fetchSavingsGoals(), fetchSummary()]);
    return updated;
  };

  const contributeToGoal = async (id, amount) => {
    const res = await fetch(`${API_BASE}/api/savings-goals/${id}/contribute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    if (!res.ok) throw new Error('Failed to contribute to goal');
    const updated = await res.json();
    await Promise.all([fetchSavingsGoals(), fetchSummary()]);
    return updated;
  };

  const deleteSavingsGoal = async (id) => {
    const res = await fetch(`${API_BASE}/api/savings-goals/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete goal');
    await Promise.all([fetchSavingsGoals(), fetchSummary()]);
    return true;
  };

  const updateSettings = async (newSettings) => {
    const res = await fetch(`${API_BASE}/api/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    const saved = await res.json();
    setSettings(saved);
    await Promise.all([fetchSummary(), fetchInsights()]);
    return saved;
  };

  const resetDemoData = async (mode = 'restore') => {
    const res = await fetch(`${API_BASE}/api/demo-data/reset?mode=${mode}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset data');
    await refreshAll();
    return true;
  };

  const closeInterceptModal = () => {
    setInterceptModal({
      isOpen: false,
      attemptedPurchase: null,
      todaySpent: 0,
      dailyLimit: null,
      reason: 'cooldown',
      onSuccessCallback: null
    });
  };

  return (
    <FinanceContext.Provider value={{
      summary,
      transactions,
      subscriptions,
      savingsGoals,
      cooldown,
      cooldownLogs,
      settings,
      dailyLimit,
      updateDailyLimit,
      insightsData,
      isLoading,
      isWakingUp,
      error,
      refreshAll,
      fetchTransactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addSubscription,
      updateSubscription,
      deleteSubscription,
      addSavingsGoal,
      updateSavingsGoal,
      contributeToGoal,
      deleteSavingsGoal,
      activateCooldown,
      cancelCooldownSession,
      logCooldownAction,
      updateSettings,
      resetDemoData,
      interceptModal,
      closeInterceptModal,
      setInterceptModal
    }}>
      {isLoading && isWakingUp && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D1D16] border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-fade-in">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-400 border-t-transparent" />
          <div className="text-xs">
            <p className="font-bold text-[#F0FDF4]">Waking up backend server...</p>
            <p className="text-[#A7C4B5]">Render free tier takes ~30s on first load.</p>
          </div>
        </div>
      )}
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}