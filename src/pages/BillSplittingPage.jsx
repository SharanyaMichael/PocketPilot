// @refresh reload
import React, { useState } from 'react';
import { Users, Plus, DollarSign, Receipt } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Overview Stat Cards (Forced Side-by-Side via Inline Flexbox) */}
      <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
        <div style={{ flex: 1, backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8EA399', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
            <span>Others owe you</span>
            <Users size={16} style={{ color: '#10B981' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#F0FDF4', fontFamily: 'monospace' }}>₹{othersOweYou.toLocaleString()}</div>
        </div>

        <div style={{ flex: 1, backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8EA399', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
            <span>You owe</span>
            <DollarSign size={16} style={{ color: '#34D399' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#F0FDF4', fontFamily: 'monospace' }}>₹0</div>
        </div>

        <div style={{ flex: 1, backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8EA399', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
            <span>Unsettled Bills</span>
            <Receipt size={16} style={{ color: '#10B981' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#F0FDF4', fontFamily: 'monospace' }}>{unsettledCount}</div>
        </div>
      </div>

      {/* Existing Bills List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {bills.map((bill) => (
          <div key={bill.id} style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #1C3930' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#F0FDF4', margin: 0 }}>{bill.title}</h3>
                <span style={{ fontSize: '12px', color: '#8EA399' }}>Paid by {bill.paidBy}</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10B981', fontFamily: 'monospace' }}>₹{bill.total.toLocaleString()}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
              {bill.participants.map((p, idx) => (
                <div
                  key={idx}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#050B09', border: '1px solid rgba(28,57,48,0.6)', padding: '12px 16px', borderRadius: '12px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#F0FDF4' }}>{p.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', fontFamily: 'monospace', color: p.settled ? '#10B981' : '#34D399', textDecoration: p.settled ? 'line-through' : 'none' }}>
                      {p.settled ? 'Settled' : `Owes ₹${p.share}`}
                    </span>
                    <button
                      onClick={() => toggleSettle(bill.id, idx)}
                      style={{
                        fontSize: '12px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        border: p.settled ? '1px solid rgba(16,185,129,0.4)' : '1px solid #1C3930',
                        backgroundColor: p.settled ? 'rgba(16,185,129,0.2)' : 'rgba(28,57,48,0.4)',
                        color: p.settled ? '#10B981' : '#8EA399',
                        transition: 'all 0.2s'
                      }}
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
      <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0FDF4', marginBottom: '16px', marginTop: 0 }}>New shared bill (equal split)</h3>
        <form onSubmit={handleAddBill} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#8EA399', marginBottom: '4px' }}>Title</label>
            <input
              type="text"
              placeholder="e.g. Dinner"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ width: '100%', backgroundColor: '#050B09', border: '1px solid #1C3930', borderRadius: '12px', padding: '10px 16px', fontSize: '12px', color: '#F0FDF4', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#8EA399', marginBottom: '4px' }}>Total (₹)</label>
            <input
              type="number"
              placeholder="0.00"
              value={newTotal}
              onChange={(e) => setNewTotal(e.target.value)}
              style={{ width: '100%', backgroundColor: '#050B09', border: '1px solid #1C3930', borderRadius: '12px', padding: '10px 16px', fontSize: '12px', color: '#F0FDF4', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#8EA399', marginBottom: '4px' }}>Participants</label>
            <input
              type="text"
              value={newParticipants}
              onChange={(e) => setNewParticipants(e.target.value)}
              style={{ width: '100%', backgroundColor: '#050B09', border: '1px solid #1C3930', borderRadius: '12px', padding: '10px 16px', fontSize: '12px', color: '#F0FDF4', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ gridColumn: 'span 3 / span 3', paddingTop: '8px' }}>
            <button
              type="submit"
              style={{ backgroundColor: '#10B981', color: '#050B09', fontWeight: 'bold', fontSize: '12px', padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}
            >
              <Plus size={16} /> Split equally
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}