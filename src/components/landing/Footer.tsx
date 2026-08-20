import React from 'react';
import { Logo } from '../common/Logo';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-[#E5E5E5] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-xs text-[#525252] max-w-sm leading-relaxed">
              EduConflux is the unified operating platform for modern educational institutions, combining academic operations, learning management, and institutional analytics.
            </p>
            <p className="text-[11px] text-[#737373]">
              © {new Date().getFullYear()} EduConflux Inc. All rights reserved.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">Platform</h4>
            <ul className="space-y-2 text-xs text-[#525252]">
              <li><a href="#platform" className="hover:text-[#F97316] transition-colors">Academic Operations</a></li>
              <li><a href="#platform" className="hover:text-[#F97316] transition-colors">Learning Hub</a></li>
              <li><a href="#platform" className="hover:text-[#F97316] transition-colors">Communication</a></li>
              <li><a href="#platform" className="hover:text-[#F97316] transition-colors">Analytics & Reporting</a></li>
            </ul>
          </div>

          {/* Role Login Links Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">Workspace Login</h4>
            <ul className="space-y-2 text-xs text-[#525252]">
              <li><button onClick={() => onNavigate('/login')} className="hover:text-[#F97316] transition-colors">Admin Login</button></li>
              <li><button onClick={() => onNavigate('/login')} className="hover:text-[#F97316] transition-colors">Teacher Login</button></li>
              <li><button onClick={() => onNavigate('/login')} className="hover:text-[#F97316] transition-colors">Student Login</button></li>
              <li><button onClick={() => onNavigate('/login')} className="hover:text-[#F97316] transition-colors">Parent Login</button></li>
            </ul>
          </div>

          {/* Legal / Institutional */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">Institution</h4>
            <ul className="space-y-2 text-xs text-[#525252]">
              <li><a href="#" className="hover:text-[#171717] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#171717] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#171717] transition-colors">Security & Compliance</a></li>
              <li><a href="#" className="hover:text-[#171717] transition-colors">Help Center</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#737373] gap-4">
          <div>
            <span>Single Institution Release • Version 1.0.0</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#171717]">System Status</a>
            <a href="#" className="hover:text-[#171717]">Documentation</a>
            <a href="#" className="hover:text-[#171717]">Contact Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
