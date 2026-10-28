import React, { useState } from 'react';
import { Users, Plus, CheckCircle2, DollarSign, Receipt } from 'lucide-react';

export default function BillSplittingPage() {
  const [bills, setBills] = useState([
    {
      id: 1,
      title: 'Weekend Dinner',
      total: 2400,
      paidBy: 'You',
      participants: [
        { name: 'Aarav', share: 600, settled: false },
        { name: 'Meera', share: 600, settled: false },
        { name: 'Kabir', share: 600, settled: false },
      ],
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newTotal, setNewTotal] = useState('');
  const [newParticipants, setNewParticipants] = useState('Aarav, Meera, Kabir');

  const handleAddBill = (e) => {
    e.preventDefault();
    if (!newTitle || !newTotal) return;

    const totalNum = parseFloat(newTotal);
    const names = newParticipants.split(',').map((n) => n.trim()).filter(Boolean);
    const count = names.length + 1; // including "You"
    const shareAmount = Math.round((totalNum / count) * 100) / 100;

    const participantsList = names.map((name) => ({
      name,
      share: shareAmount,
      settled: false,
    }));

    const newBillItem = {
      id: Date.now(),
      title: newTitle,
      total: totalNum,
      paidBy: 'You',
      participants: participantsList,
    };

    setBills([newBillItem, ...bills]);
    setNewTitle('');
    setNewTotal('');
  };

  const toggleSettle = (billId, participantIndex) => {
    setBills(
      bills.map((bill) => {
        if (bill.id !== billId) return bill;
        const updatedParticipants = [...bill.participants];
        updatedParticipants[participantIndex].settled =
          !updatedParticipants[participantIndex].settled;
        return { ...bill, participants: updatedParticipants };
      })
    );
  };

  // Calculate stats
  let othersOweYou = 0;
  let unsettledCount = 0;

  bills.forEach((bill) => {
    bill.participants.forEach((p) => {
      if (!p.settled) {
        othersOweYou += p.share;
        unsettledCount += 1;
      }
    });
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-[#0A1612] border border-[#1C3930] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#F0FDF4]">Bill Splitting</h1>
            <span className="text-[11px] font-semibold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 px-2.5 py-0.5 rounded-full">
              Simulated
            </span>
          </div>
          <p className="text-sm text-[#8EA399] mt-1">
            Track shared group expenses, split bills equally, and manage individual participant balances.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0A1612] border border-[#1C3930] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-[#8EA399] text-xs font-medium mb-2">
            <span>Others owe you</span>
            <Users size={16} className="text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold text-[#F0FDF4]">₹{othersOweYou.toLocaleString()}</div>
        </div>

        <div className="bg-[#0A1612] border border-[#1C3930] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-[#8EA399] text-xs font-medium mb-2">
            <span>You owe</span>
            <DollarSign size={16} className="text-[#34D399]" />
          </div>
          <div className="text-2xl font-bold text-[#F0FDF4]">₹0</div>
        </div>

        <div className="bg-[#0A1612] border border-[#1C3930] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-[#8EA399] text-xs font-medium mb-2">
            <span>Unsettled Bills</span>
            <Receipt size={16} className="text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold text-[#F0FDF4]">{unsettledCount}</div>
        </div>
      </div>

      {/* Existing Bills List */}
      <div className="space-y-4">
        {bills.map((bill) => (
          <div key={bill.id} className="bg-[#0A1612] border border-[#1C3930] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#1C3930]">
              <div>
                <h3 className="text-lg font-bold text-[#F0FDF4]">{bill.title}</h3>
                <span className="text-xs text-[#8EA399]">Paid by {bill.paidBy}</span>
              </div>
              <div className="text-lg font-bold text-[#10B981]">₹{bill.total.toLocaleString()}</div>
            </div>

            <div className="mt-4 space-y-2">
              {bill.participants.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-[#050B09] border border-[#1C3930]/60 px-4 py-3 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#F0FDF4]">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-semibold ${p.settled ? 'text-[#10B981] line-through' : 'text-[#34D399]'}`}>
                      {p.settled ? 'Settled' : `Owes ₹${p.share}`}
                    </span>
                    <button
                      onClick={() => toggleSettle(bill.id, idx)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition border ${
                        p.settled
                          ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                          : 'bg-[#1C3930]/40 text-[#8EA399] border-[#1C3930] hover:text-[#F0FDF4]'
                      }`}
                    >
                      {p.settled ? 'Mark Unpaid' : 'Mark Settled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create New Shared Bill Form */}
      <div className="bg-[#0A1612] border border-[#1C3930] rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-[#F0FDF4] mb-4">New shared bill (equal split)</h3>
        <form onSubmit={handleAddBill} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#8EA399] mb-1">Title</label>
            <input
              type="text"
              placeholder="e.g. Dinner"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-[#050B09] border border-[#1C3930] rounded-xl px-4 py-2.5 text-xs text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#8EA399] mb-1">Total (₹)</label>
            <input
              type="number"
              placeholder="0.00"
              value={newTotal}
              onChange={(e) => setNewTotal(e.target.value)}
              className="w-full bg-[#050B09] border border-[#1C3930] rounded-xl px-4 py-2.5 text-xs text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#8EA399] mb-1">Participants</label>
            <input
              type="text"
              value={newParticipants}
              onChange={(e) => setNewParticipants(e.target.value)}
              className="w-full bg-[#050B09] border border-[#1C3930] rounded-xl px-4 py-2.5 text-xs text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
            />
          </div>
          <div className="md:col-span-3 pt-2">
            <button
              type="submit"
              className="bg-[#10B981] hover:bg-[#059669] text-[#050B09] font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-[#10B981]/20 flex items-center gap-2"
            >
              <Plus size={16} /> Split equally
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}