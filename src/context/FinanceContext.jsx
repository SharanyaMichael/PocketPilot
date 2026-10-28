import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
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
  const [insightsData, setInsightsData] = useState({ insights: [], has_user_data: false });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Global Intercept Modal State
  const [interceptModal, setInterceptModal] = useState({
    isOpen: false,
    attemptedPurchase: null,
    onSuccessCallback: null
  });

  // Ticking timer for Cooldown Mode
  const timerRef = useRef(null);

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
        setTransactions(data);
      }
    } catch (e) {
      console.warn('Backend transactions fetch failed:', e);
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
    setIsLoading(false);
  }, [fetchSummary, fetchTransactions, fetchSubscriptions, fetchSavingsGoals, fetchCooldown, fetchCooldownLogs, fetchSettings, fetchInsights]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Handle local countdown timer for active cooldown
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (cooldown.is_active && cooldown.remaining_seconds > 0) {
      timerRef.current = setInterval(() => {
        setCooldown(prev => {
          if (!prev.is_active || prev.remaining_seconds <= 1) {
            clearInterval(timerRef.current);
            // Re-fetch to ensure backend state aligns
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

  // Add transaction with global cooldown check
  const addTransaction = async (txData, overrideCooldown = false) => {
    // If expense and cooldown is active, intercept!
    if (txData.type === 'expense' && cooldown.is_active && !overrideCooldown) {
      return new Promise((resolve) => {
        setInterceptModal({
          isOpen: true,
          attemptedPurchase: txData,
          onSuccessCallback: async (shouldSave, overridden) => {
            if (shouldSave) {
              const res = await executeAddTransaction(txData, true);
              resolve({ intercepted: true, saved: true, result: res });
            } else {
              resolve({ intercepted: true, saved: false });
            }
          }
        });
      });
    }

    const res = await executeAddTransaction(txData, overrideCooldown);
    return { intercepted: false, saved: true, result: res };
  };

  const executeAddTransaction = async (txData, overrideCooldown) => {
    try {
      const res = await fetch(`${API_BASE}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...txData, override_cooldown: overrideCooldown })
      });

      if (!res.ok) {
        if (res.status === 423) {
          // Backend also rejected due to cooling-off mode!
          const data = await res.json();
          throw new Error('Expense intercepted by active Cooling-Off Mode');
        }
        throw new Error('Failed to create transaction');
      }

      const created = await res.json();
      await Promise.all([fetchSummary(), fetchTransactions(), fetchInsights()]);
      return created;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const updateTransaction = async (id, updateData) => {
    try {
      const res = await fetch(`${API_BASE}/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      if (!res.ok) throw new Error('Failed to update transaction');
      const updated = await res.json();
      await Promise.all([fetchSummary(), fetchTransactions(), fetchInsights()]);
      return updated;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/transactions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete transaction');
      await Promise.all([fetchSummary(), fetchTransactions(), fetchInsights()]);
      return true;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  // Cooldown actions
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
          merchant: attemptedPurchase.clean_merchant || attemptedPurchase.description,
          category: attemptedPurchase.category || 'Shopping',
          notes
        })
      });
      await fetchCooldownLogs();