import React, { useState } from 'react';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { KeyRound, ShieldAlert, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface ActivationPageProps {
  onNavigate: (route: string) => void;
}

export const ActivationPage: React.FC<ActivationPageProps> = ({ onNavigate }) => {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setStatus('error');
      setErrorMessage('Activation token is required.');
      return;
    }
    
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    
    setStatus('loading');
    setTimeout(() => {
      onNavigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-center items-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(#E5E5E5_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md mx-auto space-y-6">
        <div className="text-center space-y-3">
          <button onClick={() => onNavigate('/')} className="inline-block">
            <Logo size="lg" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-[#171717]">Activate Your Account</h1>
          <p className="text-xs text-[#525252]">Complete your institutional registration to join EduConflux</p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl border border-[#E5E5E5] bg-white shadow-xl space-y-6">
          {status === 'idle' && (
            <form onSubmit={handleActivate} className="space-y-4">
              <Input
                label="Activation Token"
                type="text"
                placeholder="Enter 16-character token from your email"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                leftIcon={<KeyRound className="w-4 h-4" />}
              />
              <Button type="submit" variant="primary" className="w-full justify-center">
                Verify Token <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          )}

          {status === 'loading' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-10 h-10 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#525252]">Processing transaction...</p>
            </div>
          )}

          {status === 'success' && (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex items-start gap-2.5 text-xs text-orange-800">
                <CheckCircle className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Token Verified!</span>
                  <span>Set a secure password for your EduConflux login credentials.</span>
                </div>
              </div>

              {errorMessage && (
                <div className="text-xs text-red-600 font-semibold">{errorMessage}</div>
              )}

              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button type="submit" variant="primary" className="w-full justify-center">
                Set Password & Log In
              </Button>
            </form>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Verification Failed</span>
                  <span>{errorMessage || 'The token is invalid, expired, or has already been used.'}</span>
                </div>
              </div>
              <Button onClick={() => setStatus('idle')} variant="outline" className="w-full justify-center">
                Try Again
              </Button>
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => onNavigate('/login')}
            className="inline-flex items-center gap-1.5 text-xs text-[#525252] hover:text-[#171717] font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
