import React from 'react';
import Navbar from './Navbar';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function BillSplittingLanding() {
  return (
    <div className="min-h-screen bg-[#061326] text-[#F8FAFC] font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div className="space-y-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Split bills, not <span className="text-[#C7FF65] drop-shadow-[0_0_10px_rgba(199,255,101,0.3)]">friendships.</span>
          </h1>

          <p className="text-[#A9B7CC] text-lg leading-relaxed max-w-xl">
            From dinners to trips, Pocket Pilot makes it easy to split expenses, track who owes what, and settle up — all in one place. No awkward math, no endless texts.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-[#C7FF65] text-[#061326] font-bold px-8 py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(199,255,101,0.4)] transition flex items-center justify-center gap-2">
              Get Started <ArrowRight size={18} />
            </button>
            <button className="border border-[#233A58] bg-[#0B1B32] text-[#F8FAFC] font-semibold px-8 py-3.5 rounded-xl hover:border-[#C7FF65] transition">
              See How It Works
            </button>
          </div>

          {/* Feature Indicators */}
          <div className="pt-6 border-t border-[#233A58]/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-[#A9B7CC]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-[#C7FF65]" size={18} />
              <span>Split with friends</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-[#C7FF65]" size={18} />
              <span>Track individual shares</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-[#C7FF65]" size={18} />
              <span>Settle up instantly</span>
            </div>
          </div>
        </div>

        {/* Right Hero Illustration / Smartphone Mockup */}
        <div className="relative flex justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#C7FF65]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full max-w-sm bg-[#0D203A] border-4 border-[#233A58] rounded-[40px] p-6 shadow-2xl transform lg:rotate-2 hover:rotate-0 transition duration-500">
            <div className="flex justify-between items-center mb-6 border-b border-[#233A58] pb-4">
              <div>
                <h4 className="text-xs text-[#A9B7CC] uppercase tracking-wider">Group Expense</h4>
                <p className="font-bold text-lg">Friday Dinner 🍕</p>
              </div>
              <span className="text-xs font-bold text-[#061326] bg-[#C7FF65] px-3 py-1 rounded-full">₹ 3,450.00</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#0B1B32] rounded-xl border border-[#233A58]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">P</div>
                  <div>
                    <p className="text-sm font-semibold">You Paid</p>
                    <p className="text-xs text-[#A9B7CC]">Total amount</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20 font-medium">Paid</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#0B1B32] rounded-xl border border-[#233A58]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">A</div>
                  <div>
                    <p className="text-sm font-semibold">Alex</p>
                    <p className="text-xs text-[#A9B7CC]">Owes ₹ 1,150</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-md border border-amber-500/20 font-medium">Pending</span>
              </div>
            </div>

            <button className="w-full mt-6 bg-[#C7FF65] text-[#061326] font-bold text-xs py-3 rounded-xl">
              Send Reminders
            </button>
          </div>
        </div>

      </section>
    </div>
  );
}