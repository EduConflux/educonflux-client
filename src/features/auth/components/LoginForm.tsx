import React, { useState } from 'react';
import { useLoginMutation } from '../hooks/useAuthMutations';
import { useAuth } from '../context/AuthContext';
import { extractUserFromAuthResponse } from '../../../lib/authUtils';
import type { LoginFormState, ValidationErrors, AuthErrorType } from '../types';
import { RoleSelector, ROLES_DATA } from './RoleSelector';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Logo } from '../../../components/common/Logo';
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
  const { login } = useAuth();
  const loginMutation = useLoginMutation();

  const [formState, setFormState] = useState<LoginFormState>({
    role: 'STUDENT',
    email: '',
    password: '',
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [authError, setAuthError] = useState<AuthErrorType>(null);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validateForm()) {
      return;
    }

    try {
      const res = await loginMutation.mutateAsync({
        email: formState.email.trim(),
        password: formState.password,
      });

      const token = res?.token || res?.accessToken || (typeof res === 'string' ? res : 'active-session-token');
      const user = extractUserFromAuthResponse(res, formState.email.trim(), formState.role);

      login(token, user);
      setIsSuccess(true);

      setTimeout(() => {
        const targetRole = user.role || formState.role;
        if (targetRole === 'ADMIN') {
          onNavigate('/admin');
        } else if (targetRole === 'TEACHER') {
          onNavigate('/teacher');
        } else {
          onNavigate('/student');
        }
      }, 600);
    } catch (err: any) {
      if (err?.status === 0 || err?.status === 504 || err?.status === 502 || err?.name === 'TypeError') {
        setAuthError('NETWORK');
      } else {
        setAuthError('INVALID_CREDENTIALS');
      }
    }
  };

  const handleRoleSelect = (role: LoginFormState['role']) => {
    setFormState(prev => ({ ...prev, role }));
    if (authError) setAuthError(null);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-5 sm:p-6 shadow-xl relative z-10">
      {/* Mobile-only Logo */}
      <div className="lg:hidden flex items-center justify-between pb-3 mb-3 border-b border-[#E5E5E5]">
        <Logo size="sm" />
        <span className="text-[11px] font-semibold text-[#525252]">EduConflux</span>
      </div>

      <div className="space-y-4">
        {/* Header Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#171717]">Sign In</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-[#F97316]">
              {selectedRoleInfo.badge}
            </span>
          </div>
          <p className="text-xs text-[#525252] leading-tight">
            {selectedRoleInfo.description}
          </p>
        </div>

        {/* Global Error Alert */}
        {authError === 'INVALID_CREDENTIALS' && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">Authentication Failed</span>
              <span className="text-[11px] leading-relaxed">Invalid credentials provided. Please recheck your institutional email and password.</span>
            </div>
          </div>
        )}

        {authError === 'NETWORK' && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2 animate-in fade-in duration-200">
            <WifiOff className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">Backend Connection Offline</span>
              <span className="text-[11px] leading-relaxed">Unable to reach authentication server on port 8080.</span>
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-semibold text-[11px]">Authentication successful. Launching workspace...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <RoleSelector
            selectedRole={formState.role}
            onSelectRole={handleRoleSelect}
          />

          <Input
            label="Institutional Email"
            type="email"
            placeholder="name@institution.edu"
            value={formState.email}
            onChange={(e) => {
              setFormState(prev => ({ ...prev, email: e.target.value }));
              if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4" />}
            autoComplete="email"
          />

          <div className="space-y-1">
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formState.password}
                onChange={(e) => {
                  setFormState(prev => ({ ...prev, password: e.target.value }));
                  if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                }}
                error={errors.password}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#737373] hover:text-[#171717] focus:outline-hidden cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 text-xs text-[#525252] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formState.rememberMe}
                onChange={(e) => setFormState(prev => ({ ...prev, rememberMe: e.target.checked }))}
                className="w-3.5 h-3.5 rounded border-[#E5E5E5] text-[#F97316] focus:ring-[#F97316] accent-[#F97316]"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => onNavigate('/forgot-password')}
              className="text-xs text-[#F97316] hover:underline font-semibold cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center mt-2 shadow-sm font-bold cursor-pointer"
            isLoading={loginMutation.isPending}
            disabled={isSuccess}
            rightIcon={!isSuccess ? <ArrowRight className="w-4 h-4" /> : undefined}
          >
            {isSuccess ? 'Launching Portal...' : `Sign in as ${selectedRoleInfo.title}`}
          </Button>
        </form>

        {/* Activation & Home links */}
        <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-[#737373]">
          <button
            type="button"
            onClick={() => onNavigate('/activate')}
            className="text-[#525252] hover:text-[#171717] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#F97316]" />
            <span>First time? Activate Account</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="hover:text-[#171717] flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
