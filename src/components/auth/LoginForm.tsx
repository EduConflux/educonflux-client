import React, { useState } from 'react';
import type { LoginFormState, ValidationErrors, AuthErrorType } from '../../types/auth';
import { RoleSelector, ROLES_DATA } from './RoleSelector';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Logo } from '../common/Logo';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowLeft, 
  AlertCircle, 
  WifiOff, 
  CheckCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface LoginFormProps {
  onNavigate: (route: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onNavigate }) => {
  const [formState, setFormState] = useState<LoginFormState>({
    role: 'STUDENT',
    email: '',
    password: '',
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<AuthErrorType>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Demo state overrides for testing UI
  const [demoState, setDemoState] = useState<'normal' | 'invalid_cred' | 'network_err'>('normal');

  const selectedRoleInfo = ROLES_DATA.find(r => r.id === formState.role) || ROLES_DATA[2];

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formState.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formState.password) {
      newErrors.password = 'Password is required';
    } else if (formState.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API Auth Request
    setTimeout(() => {
      setIsLoading(false);

      if (demoState === 'invalid_cred') {
        setAuthError('INVALID_CREDENTIALS');
      } else if (demoState === 'network_err') {
        setAuthError('NETWORK');
      } else {
        // Success Transition
        setIsSuccess(true);
      }
    }, 1200);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Brand Header Lockup */}
      <div className="text-center space-y-3">
        <button 
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-block focus:outline-hidden focus:ring-2 focus:ring-[#F97316] rounded-md"
        >
          <Logo size="lg" />
        </button>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#171717]">
            Welcome back
          </h1>
          <p className="text-xs text-[#525252]">
            Sign in to your <span className="font-semibold text-[#171717]">{selectedRoleInfo.title}</span> workspace
          </p>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[#E5E5E5] bg-white shadow-xl space-y-6 relative overflow-hidden">
        {/* Success Modal / State Overlay */}
        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-[#F97316] mx-auto flex items-center justify-center">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#171717]">Authentication Successful</h3>
              <p className="text-xs text-[#525252]">
                Entering <span className="font-semibold text-[#F97316]">{selectedRoleInfo.title}</span> digital workspace...
              </p>
            </div>

            <div className="w-full bg-[#F7F7F7] h-2 rounded-full overflow-hidden">
              <div className="bg-[#F97316] h-full w-full animate-pulse" />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setIsSuccess(false)}
            >
              Reset Demo
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection Tabs */}
            <RoleSelector
              selectedRole={formState.role}
              onSelectRole={(role) => {
                setFormState(prev => ({ ...prev, role }));
                setErrors({});
                setAuthError(null);
              }}
            />

            {/* Error Banners */}
            {authError === 'INVALID_CREDENTIALS' && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Authentication Failed</span>
                  <span>Invalid email or password. Please verify your credentials for {selectedRoleInfo.title} role.</span>
                </div>
              </div>
            )}

            {authError === 'NETWORK' && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800 animate-in fade-in">
                <WifiOff className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold block">Network Timeout</span>
                  <span>Could not reach EduConflux servers. Check your connection.</span>
                  <button 
                    type="submit" 
                    className="underline text-amber-900 font-semibold block text-[11px] pt-1"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            )}

            {/* Email Input */}
            <Input
              label="Institutional Email"
              type="email"
              placeholder={
                formState.role === 'ADMIN' ? 'admin@institution.edu' :
                formState.role === 'TEACHER' ? 'faculty@institution.edu' :
                formState.role === 'STUDENT' ? 'student@institution.edu' :
                'parent@email.com'
              }
              value={formState.email}
              onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            {/* Password Input */}
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={formState.password}
              onChange={(e) => setFormState(prev => ({ ...prev, password: e.target.value }))}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-[#171717] focus:outline-hidden"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#525252] hover:text-[#171717]">
                <input
                  type="checkbox"
                  checked={formState.rememberMe}
                  onChange={(e) => setFormState(prev => ({ ...prev, rememberMe: e.target.checked }))}
                  className="rounded-md border-[#E5E5E5] text-[#F97316] focus:ring-[#F97316] w-4 h-4"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => onNavigate('/forgot-password')}
                className="font-medium text-[#F97316] hover:text-[#EA580C] focus:outline-hidden"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center"
              isLoading={isLoading}
              rightIcon={!isLoading ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              Sign In as {selectedRoleInfo.title}
            </Button>
          </form>
        )}

        {/* Demo Controls Switcher for UI verification */}
        <div className="pt-4 border-t border-[#E5E5E5] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#737373]">
            <span className="flex items-center gap-1 font-semibold text-[#171717]">
              <Sparkles className="w-3 h-3 text-[#F97316]" /> Phase 1 Demo Preset:
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => { setDemoState('normal'); setAuthError(null); }}
              className={`px-2 py-1 rounded-md border text-center font-medium ${
                demoState === 'normal' 
                  ? 'border-[#F97316] bg-orange-50 text-[#F97316]' 
                  : 'border-[#E5E5E5] text-[#525252] hover:bg-[#F7F7F7]'
              }`}
            >
              Normal
            </button>

            <button
              type="button"
              onClick={() => { setDemoState('invalid_cred'); setAuthError(null); }}
              className={`px-2 py-1 rounded-md border text-center font-medium ${
                demoState === 'invalid_cred' 
                  ? 'border-red-500 bg-red-50 text-red-600' 
                  : 'border-[#E5E5E5] text-[#525252] hover:bg-[#F7F7F7]'
              }`}
            >
              Auth Error
            </button>

            <button
              type="button"
              onClick={() => { setDemoState('network_err'); setAuthError(null); }}
              className={`px-2 py-1 rounded-md border text-center font-medium ${
                demoState === 'network_err' 
                  ? 'border-amber-500 bg-amber-50 text-amber-700' 
                  : 'border-[#E5E5E5] text-[#525252] hover:bg-[#F7F7F7]'
              }`}
            >
              Network Error
            </button>
          </div>
        </div>
      </div>

      {/* Back to Home Link */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs text-[#525252] hover:text-[#171717] font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to EduConflux Home</span>
        </button>
      </div>
    </div>
  );
};
