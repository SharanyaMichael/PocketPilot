import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, CATEGORY_COLORS } from '../utils/formatters';
import {
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Trash2,
  Edit3
} from 'lucide-react';

export default function TransactionsPage({ onEditTransaction }) {
  const { transactions, deleteTransaction, isLoading } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid #10B981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <span style={{ fontSize: '12px', color: '#A7C4B5' }}>Loading transactions ledger...</span>
        </div>
      </div>
    );
  }

  const filteredTransactions = transactions.filter(tx => {
    const title = tx.title || tx.description || tx.name || 'Transaction';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.category && tx.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || tx.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const categories = [...new Set(transactions.map(tx => tx.category).filter(Boolean))];

  return (
    <div style={{ paddingBottom: '48px', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Header Banner */}
      <div style={{ background: '#091510', border: '1px solid rgba(110,231,183,0.14)', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#F0FDF4', margin: 0 }}>Transactions Ledger</h1>
        <p style={{ fontSize: '13px', color: '#A7C4B5', marginTop: '4px', margin: 0 }}>
          Comprehensive telemetry of all recorded cash inflows and outflows.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ background: '#091510', border: '1px solid rgba(110,231,183,0.14)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px', background: '#050B09', border: '1px solid rgba(110,231,183,0.12)', borderRadius: '12px', padding: '8px 14px' }}>
          <Search style={{ width: '16px', height: '16px', color: '#A7C4B5', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search transactions by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#F0FDF4', fontSize: '13px', outline: 'none', width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ background: '#050B09', border: '1px solid rgba(110,231,183,0.12)', color: '#F0FDF4', padding: '9px 14px', borderRadius: '12px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ background: '#050B09', border: '1px solid rgba(110,231,183,0.12)', color: '#F0FDF4', padding: '9px 14px', borderRadius: '12px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions Table Container */}
      <div style={{ background: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(110,231,183,0.1)', color: '#A7C4B5', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px 20px' }}>Transaction</th>
                <th style={{ padding: '16px 20px' }}>Category</th>
                <th style={{ padding: '16px 20px' }}>Date</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#A7C4B5' }}>
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx, idx) => {
                  const txTitle = tx.title || tx.description || tx.name || (tx.type === 'income' ? 'Income' : 'Expense');
                  return (
                    <tr key={tx.id || idx} style={{ borderBottom: '1px solid rgba(110,231,183,0.06)', transition: 'background 0.15s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = '#0d1d16'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: tx.type === 'income' ? 'rgba(16,185,129,0.1)' : 'rgba(251,113,133,0.1)', color: tx.type === 'income' ? '#10B981' : '#FB7185', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {tx.type === 'income' ? <ArrowDownLeft style={{ width: '18px', height: '18px' }} /> : <ArrowUpRight style={{ width: '18px', height: '18px' }} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: '#F0FDF4' }}>{txTitle}</div>
                          <div style={{ fontSize: '11px', color: '#A7C4B5', textTransform: 'capitalize' }}>{tx.type}</div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', background: 'rgba(110,231,183,0.08)', color: '#6EE7B7' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: CATEGORY_COLORS[tx.category] || '#10B981' }} />
                          {tx.category || 'General'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#A7C4B5', fontSize: '12px' }}>
                        {tx.date || 'Today'}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '14px', color: tx.type === 'income' ? '#10B981' : '#FB7185' }}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => onEditTransaction && onEditTransaction(tx)}
                            style={{ background: 'transparent', border: 'none', color: '#A7C4B5', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                            title="Edit transaction"
                          >
                            <Edit3 style={{ width: '14px', height: '14px' }} />
                          </button>
                          <button
                            onClick={() => deleteTransaction && deleteTransaction(tx.id)}
                            style={{ background: 'transparent', border: 'none', color: '#FB7185', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                            title="Delete transaction"
                          >
                            <Trash2 style={{ width: '14px', height: '14px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}