import React, { useState } from 'react';
import { Compass, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-[#061326] border-b border-[#233A58] sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 text-[#F8FAFC] font-bold text-xl">
          <Compass className="w-7 h-7 text-[#C7FF65]" />
          <span>Pocket Pilot</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-[#A9B7CC] font-medium text-sm">
          <a href="#home" className="hover:text-[#F8FAFC] transition">Home</a>
          <a href="#features" className="hover:text-[#F8FAFC] transition">Features</a>
          <a href="#how-it-works" className="hover:text-[#F8FAFC] transition">How It Works</a>
          <a href="#about" className="hover:text-[#F8FAFC] transition">About</a>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <a href="#login" className="text-[#A9B7CC] hover:text-[#F8FAFC] text-sm font-medium px-3 py-2">Log In</a>
          <button className="bg-[#C7FF65] text-[#061326] font-semibold text-sm px-5 py-2.5 rounded-xl hover:shadow-[0_0_15px_rgba(199,255,101,0.4)] transition">
            Get Started
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[#F8FAFC]">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#0B1B32] border-t border-[#233A58] mt-4 p-4 flex flex-col gap-4">
          <a href="#home" className="text-[#A9B7CC]">Home</a>
          <a href="#features" className="text-[#A9B7CC]">Features</a>
          <a href="#how-it-works" className="text-[#A9B7CC]">How It Works</a>
          <a href="#about" className="text-[#A9B7CC]">About</a>
          <div className="border-t border-[#233A58] pt-4 flex flex-col gap-2">
            <a href="#login" className="text-[#A9B7CC] text-center">Log In</a>
            <button className="bg-[#C7FF65] text-[#061326] font-semibold py-2.5 rounded-xl">Get Started</button>
          </div>
        </div>
      )}
    </nav>
  );
}