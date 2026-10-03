import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { Logo } from '../common/Logo';
import { NotificationDropdown } from '../../features/notification/components/NotificationDropdown';
import { SearchModal } from '../../features/search/components/SearchModal';
import { Search, User, KeyRound, LogOut, ChevronDown } from 'lucide-react';
import type { SearchResult } from '../../features/search/types';

export interface AppShellProps {
  children: React.ReactNode;
  activeRole: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

export const AppShell: React.FC<AppShellProps> = ({ children, activeRole }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchResultSelect = (result: SearchResult) => {
    // Search result selected
    console.log('Selected search result:', result);
  };

  const roleLabel =
    activeRole === 'ADMIN'
      ? 'Administrator Portal'
      : activeRole === 'TEACHER'
      ? 'Faculty Portal'
      : 'Student Workspace';

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col font-sans selection:bg-[#F97316] selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] px-4 sm:px-6 h-16 flex items-center justify-between shadow-xs">
        {/* Left: Logo & Portal title */}
        <div className="flex items-center gap-4">
          <Logo size="md" />
          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-[#E5E5E5]">
            <span className="text-xs font-black uppercase tracking-wider text-[#171717]">
              {roleLabel}
            </span>
          </div>
        </div>

        {/* Center: Search trigger */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 bg-neutral-100/80 hover:bg-neutral-100 border border-[#E5E5E5] rounded-xl text-xs text-[#737373] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#737373] group-hover:text-[#171717]" />
              <span>Search courses, classrooms, faculty...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-[#737373] bg-white border border-[#E5E5E5] rounded shadow-xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer border border-transparent hover:border-[#E5E5E5]"
            >
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#F97316] font-bold flex items-center justify-center text-xs">
                {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-[#171717] leading-tight">
                  {user?.firstName || 'User'}
                </span>
                <span className="text-[10px] text-[#737373] font-medium leading-tight">
                  {user?.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
            </button>

            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E5E5E5] z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100 text-xs">
                  <div className="px-4 py-3 border-b border-[#E5E5E5] bg-neutral-50/50">
                    <p className="font-bold text-[#171717] truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[11px] text-[#737373] truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>

                  <div className="p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#171717] hover:bg-neutral-100 transition-colors text-left font-medium cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#737373]" />
                      <span>Account Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/change-password');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#171717] hover:bg-neutral-100 transition-colors text-left font-medium cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4 text-[#737373]" />
                      <span>Change Password</span>
                    </button>
                  </div>

                  <div className="p-1 border-t border-[#E5E5E5]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-left font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSearchResultSelect}
      />
    </div>
  );
};
