import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import loginImage from '../assets/login_image.jpg';
import { Logo } from '../components/common/Logo';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  return (
    <div className="h-screen max-h-screen w-full flex flex-col lg:flex-row bg-[#F7F7F7] overflow-hidden">
      {/* Left Column: Image Banner (Visible on lg/desktop screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-neutral-900 flex-col justify-between p-8 xl:p-12 text-white h-full">
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
        <div className="relative z-10 space-y-3 max-w-lg">
          <h2 className="font-['Outfit',sans-serif] text-2xl xl:text-3xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
            Academic operations, simplified in one workspace.
          </h2>

          <p className="text-xs xl:text-sm text-neutral-200 leading-relaxed font-normal drop-shadow-xs">
            Coordinate course catalogs, real-time roster attendance, timetable scheduling, and campus communications from a single unified portal.
          </p>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 text-[11px] text-neutral-400">
          © {new Date().getFullYear()} EduConflux Platform. All rights reserved.
        </div>
      </div>

      {/* Right Column: Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 h-full relative overflow-hidden">
        {/* Subtle mesh background on right */}
        <div className="absolute inset-0 bg-[radial-gradient(#E5E5E5_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none" />

        <div className="relative z-10 w-full max-w-[370px] my-auto">
          <LoginForm onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};
