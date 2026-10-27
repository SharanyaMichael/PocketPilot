import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate, CATEGORIES, CATEGORY_COLORS } from '../utils/formatters';
import {
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Edit2,
  Trash2,
  Sparkles,
  Calendar,
  X,
  FileText
} from 'lucide-react';

export default function TransactionsPage({ onOpenNewTransaction, onEditTransaction }) {
  const { transactions, deleteTransaction, fetchTransactions } = useFinance();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Client-side filtering when typing, or trigger fetch
  const filteredTransactions = transactions.filter(tx => {
    if (selectedCategory !== 'All' && tx.category !== selectedCategory) return false;
    if (selectedType !== 'All' && tx.type !== selectedType) return false;
    if (startDate && tx.date < startDate) return false;
    if (endDate && tx.date > endDate) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchDesc = (tx.description || '').toLowerCase().includes(q);
      const matchClean = (tx.clean_merchant || '').toLowerCase().includes(q);
      const matchNotes = (tx.notes || '').toLowerCase().includes(q);
      const matchCat = (tx.category || '').toLowerCase().includes(q);
      if (!matchDesc && !matchClean && !matchNotes && !matchCat) return false;
    }
    return true;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction record?')) {
      setDeletingId(id);
      try {
        await deleteTransaction(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedType('All');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#F0FDF4]">
            Transaction Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#A7C4B5] mt-0.5">
            Audit, categorize, and inspect all cash flows with deterministic UPI narration cleaning.
          </p>
        </div>
        <button
          onClick={onOpenNewTransaction}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#050B09] font-bold text-xs tracking-wide transition-all shadow-md hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Record Transaction</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-[#A7C4B5] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search merchant, narration, or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-xs text-[#F0FDF4] placeholder:text-[#A7C4B5]/50"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-xs text-[#F0FDF4] [color-scheme:dark]"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-xs text-[#F0FDF4] [color-scheme:dark]"
            >
              <option value="All">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>

          {/* Date Range quick clear / reset */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-2 py-2 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-xs text-[#F0FDF4] [color-scheme:dark]"
              title="Start Date"
            />
            {(search || selectedCategory !== 'All' || selectedType !== 'All' || startDate || endDate) && (
              <button
                onClick={handleResetFilters}
                className="p-2 rounded-xl bg-[#11251B] text-[#A7C4B5] hover:text-[#F0FDF4] hover:bg-[#11251B]/80 text-xs flex-shrink-0 cursor-pointer"
                title="Reset Filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status text */}
        <div className="flex items-center justify-between text-[11px] text-[#A7C4B5] pt-1">
          <span>Showing {filteredTransactions.length} of {transactions.length} records</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#34D399]"></span> Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FB7185]"></span> Expense
            </span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#091510] border-b border-[rgba(110,231,183,0.16)] text-[#A7C4B5] uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Merchant / Narration</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold text-right">Amount</th>
                <th className="py-3.5 px-4 font-semibold text-center">Type</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(110,231,183,0.1)] text-[#F0FDF4]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-xs text-[#A7C4B5]">
                    No transactions match your current search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#11251B]/40 transition-colors group">
                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-[#A7C4B5] whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>

                    {/* Merchant & Narration */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <div className="font-semibold text-[#F0FDF4] flex items-center gap-1.5">
                          <span>{tx.clean_merchant || tx.description}</span>
                          {tx.is_demo === 1 && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-white/5 text-[#A7C4B5] border border-white/10 font-normal">
                              demo
                            </span>
                          )}
                        </div>
                        {tx.clean_merchant && tx.clean_merchant !== tx.description && (
                          <span className="text-[10px] text-[#A7C4B5]/70 font-mono truncate max-w-xs" title={tx.description}>
                            Raw: {tx.description}
                          </span>
                        )}
                        {tx.notes && (
                          <span className="text-[10px] text-[#A7C4B5]/90 italic mt-0.5">
                            Note: {tx.notes}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium border"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[tx.category] || '#10B981'}15`,
                          borderColor: `${CATEGORY_COLORS[tx.category] || '#10B981'}40`,
                          color: CATEGORY_COLORS[tx.category] || '#6EE7B7'
                        }}
                      >
                        {tx.category}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold whitespace-nowrap text-sm">
                      <span className={tx.type === 'income' ? 'text-[#34D399]' : 'text-[#FB7185]'}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>

                    {/* Type pill */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        tx.type === 'income' ? 'bg-[#34D399]/15 text-[#34D399]' : 'bg-[#FB7185]/15 text-[#FB7185]'
                      }`}>
                        {tx.type === 'income' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {tx.type}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="p-1.5 rounded-lg text-[#A7C4B5] hover:text-[#6EE7B7] hover:bg-[#11251B] transition-colors cursor-pointer"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          disabled={deletingId === tx.id}
                          className="p-1.5 rounded-lg text-[#A7C4B5] hover:text-[#FB7185] hover:bg-[#11251B] transition-colors cursor-pointer disabled:opacity-40"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
