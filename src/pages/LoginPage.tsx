import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import loginImage from '../assets/login_image.jpg';
import { Logo } from '../components/common/Logo';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F7F7F7]">
      {/* Left Column: Image Banner (Visible on lg/desktop screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-neutral-900 flex-col justify-between p-12 text-white">
        {/* Background Image */}
        <img
          src={loginImage}
          alt="EduConflux Workspace"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />

        {/* Gradient & Dark Tint Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60 pointer-events-none" />

        {/* Top Header over Image */}
        <div className="relative z-10">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="focus:outline-hidden cursor-pointer"
          >
            <Logo size="md" variant="light" />
          </button>
        </div>

        {/* Bottom Text Lockup over Image */}
        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Modern Education Operations</span>
          </div>

          <h2 className="font-['Outfit',sans-serif] text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
            Academic operations, simplified in one workspace.
          </h2>

          <p className="text-sm text-neutral-200 leading-relaxed font-normal drop-shadow-xs">
            Coordinate course catalogs, real-time roster attendance, timetable scheduling, and campus communications from a single unified portal.
          </p>

          <div className="pt-2 flex items-center gap-6 text-xs text-neutral-300 font-semibold">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#F97316]" /> Enterprise Security</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#F97316]" /> Real-time Telemetry</span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 text-[11px] text-neutral-400">
          © {new Date().getFullYear()} EduConflux Platform. All rights reserved.
        </div>
      </div>

      {/* Right Column: Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 min-h-screen relative overflow-y-auto">
        {/* Subtle mesh background on right */}
        <div className="absolute inset-0 bg-[radial-gradient(#E5E5E5_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none" />

        <div className="relative z-10 w-full max-w-md my-auto">
          <LoginForm onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};
