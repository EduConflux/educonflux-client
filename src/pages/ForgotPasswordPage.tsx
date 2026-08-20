import React, { useState } from 'react';
import { Logo } from '../components/common/Logo';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Mail, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (route: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Institutional email address is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E5E5_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <button 
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-block focus:outline-hidden rounded-md"
          >
            <Logo size="lg" />
          </button>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#171717]">
              Reset password
            </h1>
            <p className="text-xs text-[#525252]">
              Enter your institutional email address to receive password reset instructions.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-2xl border border-[#E5E5E5] bg-white shadow-xl space-y-6">
          {isSubmitted ? (
            <div className="py-4 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-[#F97316] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#171717]">Check your inbox</h3>
                <p className="text-xs text-[#525252]">
                  We sent password reset instructions to <span className="font-semibold text-[#171717]">{email}</span>
                </p>
              </div>

              <Button
                variant="outline"
                size="md"
                className="w-full justify-center mt-2"
                onClick={() => onNavigate('/login')}
              >
                Return to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Institutional Email"
                type="email"
                placeholder="user@institution.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Send Reset Link
              </Button>
            </form>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="inline-flex items-center gap-1.5 text-xs text-[#525252] hover:text-[#171717] font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};
