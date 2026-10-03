import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ArrowLeft, User as UserIcon, Mail, Shield, KeyRound, Building, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleBackToDashboard = () => {
    if (user.role === 'ADMIN') navigate('/admin');
    else if (user.role === 'TEACHER') navigate('/teacher');
    else navigate('/student');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>

          <span className="text-xs font-bold text-[#737373]">Account Settings</span>
        </div>

        {/* Profile Card */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-[#E5E5E5]">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-[#F97316] flex items-center justify-center font-black text-2xl">
              {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#171717]">
                  {user.firstName} {user.lastName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-100 text-[#F97316]">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-[#737373]">{user.email}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/change-password')}
              className="flex items-center gap-2 text-xs shrink-0"
            >
              <KeyRound className="w-4 h-4 text-[#F97316]" />
              <span>Change Password</span>
            </Button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-neutral-50 border border-[#E5E5E5] space-y-1">
              <span className="text-[#737373] font-semibold flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5" />
                Account Identifier
              </span>
              <p className="text-sm font-bold text-[#171717]">#{user.id}</p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-[#E5E5E5] space-y-1">
              <span className="text-[#737373] font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Institutional Email
              </span>
              <p className="text-sm font-bold text-[#171717] truncate">{user.email}</p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-[#E5E5E5] space-y-1">
              <span className="text-[#737373] font-semibold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Institutional Authority
              </span>
              <p className="text-sm font-bold text-[#171717]">
                {user.rawRole || user.role}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-[#E5E5E5] space-y-1">
              <span className="text-[#737373] font-semibold flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                Status
              </span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">Verified & Active</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
