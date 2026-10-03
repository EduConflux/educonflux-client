import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import { useChangePasswordMutation } from '../features/auth/hooks/useAuthMutations';
import { PasswordInput } from '../components/common/PasswordInput';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';
import { ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '../components/common/ToastContext';

export const ChangePasswordPage: React.FC = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isDone, setIsDone] = useState(false);

  const changePasswordMutation = useChangePasswordMutation();

  const isFirstLogin = Boolean(user?.firstLogin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!currentPassword) {
      setValidationError('Current password is required.');
      return;
    }

    if (newPassword.length < 8) {
      setValidationError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError('New passwords do not match.');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });

      if (user) {
        setUser({ ...user, firstLogin: false });
      }

      setIsDone(true);
      success('Password Updated', 'Your institutional account password was changed successfully.');

      setTimeout(() => {
        if (user?.role === 'ADMIN') navigate('/admin');
        else if (user?.role === 'TEACHER') navigate('/teacher');
        else navigate('/student');
      }, 1200);
    } catch (err: any) {
      error('Failed to change password', err?.message || 'Check your current password and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
          <Logo size="md" />
          <button
            type="button"
            onClick={logout}
            className="text-xs text-[#737373] hover:text-[#171717] font-semibold cursor-pointer"
          >
            Sign out
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#171717]">
              {isFirstLogin ? 'Set Initial Password' : 'Change Account Password'}
            </h1>
            {isFirstLogin && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-extrabold uppercase">
                Required
              </span>
            )}
          </div>
          <p className="text-xs text-[#737373] leading-relaxed">
            {isFirstLogin
              ? 'Welcome to EduConflux. As this is your first institutional sign-in, please replace your temporary password with a secure permanent password.'
              : 'Keep your EduConflux institutional access secure by updating your password regularly.'}
          </p>
        </div>

        {isFirstLogin && (
          <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              Your password must be at least 8 characters with letters, numbers, and symbols.
            </div>
          </div>
        )}

        {validationError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold">
            {validationError}
          </div>
        )}

        {isDone && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-bold">Password successfully updated! Redirecting to your dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            label={isFirstLogin ? 'Temporary / Current Password' : 'Current Password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            required
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center mt-2 font-bold cursor-pointer"
            disabled={changePasswordMutation.isPending || isDone}
            isLoading={changePasswordMutation.isPending}
            rightIcon={!isDone ? <ArrowRight className="w-4 h-4" /> : undefined}
          >
            {isDone ? 'Redirecting...' : isFirstLogin ? 'Save and Access Workspace' : 'Update Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};
