import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Background Subtle Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E5E5_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none" />
      
      <div className="relative z-10 w-full">
        <LoginForm onNavigate={onNavigate} />
      </div>
    </div>
  );
};
