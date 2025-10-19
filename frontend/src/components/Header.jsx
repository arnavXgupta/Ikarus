// Header.jsx
import { Link } from 'react-router-dom';
import { Sparkles, Bell, Menu, X } from "lucide-react";
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#18191A] text-gray-200 py-2 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3">
          <Sparkles size={24} className="text-[#f505a9]" />
          <span className="font-semibold text-sm sm:text-base">Ikarus Digital Atelier</span>
        </div>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-[#f505a9] hover:font-semibold transition">My Atelier</Link>
          <Link to="/analytics" className="hover:text-[#f505a9] hover:font-semibold transition">Analytics</Link>
        </nav>
        
        {/* Desktop Right: Bell + Avatar */}
        <div className="hidden md:flex items-center gap-4">
          <Bell size={22} className="text-gray-400" />
          <div className="w-8 h-8 rounded-full border-2 border-[#f505a9] bg-pink-100" />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#18191A] border-t border-gray-700">
          <nav className="flex flex-col py-4 px-4 space-y-4">
            <Link 
              to="/" 
              className="hover:text-[#f505a9] hover:font-semibold transition py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Atelier
            </Link>
            <Link 
              to="/analytics" 
              className="hover:text-[#f505a9] hover:font-semibold transition py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Analytics
            </Link>
            <div className="flex items-center gap-4 pt-2 border-t border-gray-700">
              <Bell size={22} className="text-gray-400" />
              <div className="w-8 h-8 rounded-full border-2 border-[#f505a9] bg-pink-100" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
