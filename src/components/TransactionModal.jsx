import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';

export default function TransactionModal({ isOpen, initialData, onClose }) {
  const { addTransaction, updateTransaction } = useFinance();

  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Food and Dining');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense');
      setTitle(initialData.title || initialData.description || '');
      setAmount(initialData.amount ? initialData.amount.toString() : '');
      setDate(initialData.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]);
      setCategory(initialData.category || 'Food and Dining');
      setNotes(initialData.notes || '');
    } else {
      setType('expense');
      setTitle('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('Food and Dining');
      setNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const payload = {
      title: title || (type === 'income' ? 'Income Inflow' : 'Expense Outflow'),
      amount: Number(amount),
      type,
      category,
      date,
      notes
    };

    if (initialData && initialData.id) {
      updateTransaction({ ...initialData, ...payload });
    } else {
      addTransaction(payload);
    }
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(5, 11, 9, 0.8)', backdropFilter: 'blur(4px)', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '520px', backgroundColor: '#091510', border: '1px solid rgba(110, 231, 183, 0.2)', borderRadius: '20px', padding: '24px', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)', position: 'relative', color: '#F0FDF4' }}>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#F0FDF4' }}>Record Transaction</h2>
              <p style={{ fontSize: '11px', color: '#9CAFA3', margin: 0 }}>Add manual entry or paste UPI narration</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#9CAFA3', cursor: 'pointer', padding: '4px' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Type Toggle Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#050B09', padding: '4px', borderRadius: '14px', border: '1px solid rgba(110, 231, 183, 0.1)' }}>
            <button
              type="button"
              onClick={() => setType('expense')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer', backgroundColor: type === 'expense' ? 'rgba(251, 113, 133, 0.15)' : 'transparent', color: type === 'expense' ? '#FB7185' : '#9CAFA3', transition: 'all 0.2s' }}
            >
              <ArrowUpRight style={{ width: '14px', height: '14px' }} />
              <span>Expense Outflow</span>
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer', backgroundColor: type === 'income' ? 'rgba(16, 185, 129, 0.15)' : 'transparent', color: type === 'income' ? '#6EE7B7' : '#9CAFA3', transition: 'all 0.2s' }}
            >
              <ArrowDownLeft style={{ width: '14px', height: '14px' }} />
              <span>Income Inflow</span>
            </button>
          </div>

          {/* Narration / Merchant Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#9CAFA3' }}>Narration / Merchant Name</label>
            <input
              type="text"
              placeholder="e.g. UPI/P2A/987654/STARBUCKS INDIA or Swiggy"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ backgroundColor: '#050B09', border: '1px solid rgba(110, 231, 183, 0.16)', borderRadius: '12px', padding: '10px 14px', color: '#F0FDF4', fontSize: '13px', outline: 'none' }}
              required
            />
          </div>

          {/* Amount & Date Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#9CAFA3' }}>Amount (&zwnj;₹&zwnj; INR)</label>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#050B09', border: '1px solid rgba(110, 231, 183, 0.16)', borderRadius: '12px', padding: '10px 14px' }}>
                <span style={{ color: '#10B981', fontWeight: 'bold', marginRight: '6px' }}>&zwnj;₹&zwnj;</span>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ backgroundColor: 'transparent', border: 'none', color: '#F0FDF4', fontSize: '13px', outline: 'none', width: '100%', fontFamily: 'monospace' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#9CAFA3' }}>Transaction Date</label>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#050B09', border: '1px solid rgba(110, 231, 183, 0.16)', borderRadius: '12px', padding: '10px 14px' }}>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ backgroundColor: 'transparent', border: 'none', color: '#F0FDF4', fontSize: '13px', outline: 'none', width: '100%', colorScheme: 'dark' }}
                />
              </div>
            </div>
          </div>

          {/* Category Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#9CAFA3' }}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ backgroundColor: '#050B09', border: '1px solid rgba(110, 231, 183, 0.16)', borderRadius: '12px', padding: '10px 14px', color: '#F0FDF4', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
            >
              <option value="Food and Dining">Food and Dining</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills and Utilities">Bills and Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Transport">Transport</option>
              <option value="Health">Health</option>
              <option value="Income">Income / Freelance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#9CAFA3' }}>Notes (Optional)</label>
            <textarea
              rows={2}
              placeholder="e.g. Dinner with team, client meeting, coffee run"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ backgroundColor: '#050B09', border: '1px solid rgba(110, 231, 183, 0.16)', borderRadius: '12px', padding: '10px 14px', color: '#F0FDF4', fontSize: '13px', outline: 'none', resize: 'none' }}
            />
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '10px 16px', background: 'transparent', border: 'none', color: '#9CAFA3', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '10px 20px', backgroundColor: '#10B981', color: '#050B09', border: 'none', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', transition: 'background 0.2s' }}
            >
              Record Transaction
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}