import React, { useState } from 'react';
import {
  Search,
  Plus,
  Shield,
  GraduationCap,
  BookOpen,
  KeyRound,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import {
  useUsersList,
  useCreateUserMutation,
  useToggleUserStatusMutation,
  useResetPasswordMutation,
} from '../hooks/useUsers';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';
import { useToast } from '../../../components/common/ToastContext';
import type { CreateUserRequest, UserRecord } from '../types';

export const UserManagementView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState<CreateUserRequest>({
    email: '',
    personalEmail: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'ROLE_STUDENT',
  });

  const { success, error } = useToast();

  const { data: pageData, isLoading } = useUsersList({
    search: search.trim() || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    page,
    size: 15,
  });

  const createMutation = useCreateUserMutation();
  const toggleStatusMutation = useToggleUserStatusMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.personalEmail || !form.firstName || !form.lastName) {
      error('Validation Error', 'Please fill in all required fields.');
      return;
    }
    try {
      await createMutation.mutateAsync(form);
      success('User Created', `User ${form.firstName} ${form.lastName} created successfully. Temporary password sent.`);
      setIsCreateOpen(false);
      setForm({
        email: '',
        personalEmail: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'ROLE_STUDENT',
      });
    } catch (err: any) {
      error('Failed to create user', err?.message || 'Check email uniqueness or inputs.');
    }
  };

  const handleToggleStatus = async (user: UserRecord) => {
    const isCurrentlyActive = user.status === 'ACTIVE';
    try {
      await toggleStatusMutation.mutateAsync({
        userId: user.id,
        active: !isCurrentlyActive,
      });
      success(
        isCurrentlyActive ? 'User Deactivated' : 'User Activated',
        `${user.firstName} ${user.lastName} is now ${isCurrentlyActive ? 'inactive' : 'active'}.`
      );
    } catch (err: any) {
      error('Action failed', err?.message || 'Failed to update user status.');
    }
  };

  const handleResetPassword = async (user: UserRecord) => {
    if (!confirm(`Are you sure you want to reset the password for ${user.firstName} ${user.lastName}? A temporary password will be emailed.`)) {
      return;
    }
    try {
      await resetPasswordMutation.mutateAsync(user.id);
      success('Password Reset', `Temporary password has been emailed to ${user.email}.`);
    } catch (err: any) {
      error('Reset failed', err?.message || 'Could not reset password.');
    }
  };

  const users = pageData?.content || [];

  return (
    <div className="space-y-6">
      {/* Header with Search and Create */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs text-[#171717] placeholder:text-[#737373] outline-hidden focus:border-[#F97316]"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs text-[#171717] outline-hidden focus:border-[#F97316]"
          >
            <option value="">All Roles</option>
            <option value="ROLE_INSTITUTION_ADMIN">Admin</option>
            <option value="ROLE_FACULTY">Faculty</option>
            <option value="ROLE_STUDENT">Student</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs text-[#171717] outline-hidden focus:border-[#F97316]"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 text-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Institutional User</span>
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/75 border-b border-[#E5E5E5] text-[#737373] font-bold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Personal Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">First Login</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#737373]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#F97316]" />
                      <span>Loading user directory...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#737373]">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const roleStr = u.roles?.[0] || 'ROLE_STUDENT';
                  const isFaculty = roleStr.includes('FACULTY');
                  const isAdmin = roleStr.includes('ADMIN');

                  return (
                    <tr key={u.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#171717]">
                          {u.firstName} {u.lastName}
                        </div>
                        <div className="text-[11px] text-[#737373]">{u.email}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isAdmin
                              ? 'bg-purple-100 text-purple-700'
                              : isFaculty
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {isAdmin ? (
                            <Shield className="w-3 h-3" />
                          ) : isFaculty ? (
                            <BookOpen className="w-3 h-3" />
                          ) : (
                            <GraduationCap className="w-3 h-3" />
                          )}
                          <span>
                            {isAdmin ? 'Admin' : isFaculty ? 'Faculty' : 'Student'}
                          </span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[#737373]">
                        {u.personalEmail || '—'}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-neutral-100 text-[#737373] border border-neutral-200'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[11px] text-[#737373]">
                        {u.firstLogin ? (
                          <span className="text-amber-600 font-semibold">Pending password setup</span>
                        ) : (
                          <span className="text-neutral-500">Completed</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleResetPassword(u)}
                            className="p-1.5 rounded-lg text-[#737373] hover:text-[#F97316] hover:bg-orange-50 transition-colors cursor-pointer"
                            title="Reset password and email temp code"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              u.status === 'ACTIVE'
                                ? 'text-neutral-400 hover:text-red-600 hover:bg-red-50'
                                : 'text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={u.status === 'ACTIVE' ? 'Deactivate account' : 'Activate account'}
                          >
                            {u.status === 'ACTIVE' ? (
                              <XCircle className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pageData && pageData.totalPages > 1 && (
          <div className="p-3 border-t border-[#E5E5E5] bg-neutral-50 flex items-center justify-between text-xs text-[#737373]">
            <span>
              Page {pageData.number + 1} of {pageData.totalPages} ({pageData.totalElements} users)
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={pageData.first}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pageData.last}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Institutional User"
        description="A temporary password will be generated and emailed to both emails."
        maxWidth="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name *"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="e.g. Eleanor"
              required
            />
            <Input
              label="Last Name *"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="e.g. Vance"
              required
            />
          </div>

          <Input
            label="Institutional Email *"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="e.g. eleanor.vance@educonflux.edu"
            required
          />

          <Input
            label="Personal / Backup Email *"
            type="email"
            value={form.personalEmail}
            onChange={(e) => setForm({ ...form, personalEmail: e.target.value })}
            placeholder="e.g. eleanor.personal@gmail.com"
            required
          />

          <Input
            label="Phone Number (Optional)"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#171717]">
              Assigned Role *
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-sm text-[#171717] outline-hidden focus:border-[#F97316]"
            >
              <option value="ROLE_STUDENT">Student</option>
              <option value="ROLE_FACULTY">Faculty (Teacher)</option>
              <option value="ROLE_INSTITUTION_ADMIN">Institution Administrator</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E5E5]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating User...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
