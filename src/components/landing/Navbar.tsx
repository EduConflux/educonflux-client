import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { Button } from '../common/Button';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onNavigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Platform', href: '#platform' },
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E5E5E5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => onNavigate('/')} 
          className="focus:outline-hidden rounded-md focus:ring-2 focus:ring-[#F97316]"
        >
          <Logo size="md" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#525252] hover:text-[#171717] transition-colors flex items-center gap-1.5"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('/login')}
          >
            Login
          </Button>
          <Button
            variant="primary"
            size="sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => onNavigate('/login')}
          >
            Get Started
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          className="md:hidden p-2 text-[#525252] hover:text-[#171717] rounded-lg border border-[#E5E5E5]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E5E5] bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#525252] hover:text-[#171717] py-1 flex items-center gap-2"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 border-t border-[#E5E5E5] flex flex-col gap-2.5">
            <Button
              variant="outline"
              size="md"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/login');
              }}
            >
              Login
            </Button>
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/login');
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
