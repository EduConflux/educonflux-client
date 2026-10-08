import React, { useState } from 'react';
import { useCreateNotificationMutation } from '../hooks/useNotifications';
import { useUsersList } from '../../users/hooks/useUsers';
import type { UserRecord } from '../../users/types';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { useToast } from '../../../components/common/ToastContext';
import { BellRing, Send, Users, Megaphone } from 'lucide-react';

export const AdminNotificationDispatchView: React.FC = () => {
  const { success, error } = useToast();
  const { data: usersResponse, isLoading: isLoadingUsers } = useUsersList();
  const users: UserRecord[] = Array.isArray(usersResponse)
    ? (usersResponse as UserRecord[])
    : ((usersResponse as any)?.content || []);
  const createNotificationMutation = useCreateNotificationMutation();

  const [form, setForm] = useState<{
    targetType: 'ALL' | 'SPECIFIC';
    userId: number;
    title: string;
    message: string;
    type: string;
  }>({
    targetType: 'ALL',
    userId: 0,
    title: '',
    message: '',
    type: 'CAMPUS_ANNOUNCEMENT',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      error('Validation Error', 'Title and message are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (form.targetType === 'SPECIFIC') {
        if (!form.userId) {
          error('Validation Error', 'Please select a specific recipient user.');
          setIsSubmitting(false);
          return;
        }
        await createNotificationMutation.mutateAsync({
          userId: Number(form.userId),
          title: form.title,
          message: form.message,
          type: form.type,
        });
        success('Notification Sent', `Notification delivered to user #${form.userId}.`);
      } else {
        // Broadcast to all active users
        const activeUsers = users.filter((u: UserRecord) => u.status === 'ACTIVE');
        let sentCount = 0;
        for (const u of activeUsers) {
          try {
            await createNotificationMutation.mutateAsync({
              userId: u.id,
              title: form.title,
              message: form.message,
              type: form.type,
            });
            sentCount++;
          } catch {
            // continue for remaining users
          }
        }
        success('Broadcast Sent', `Notification broadcasted to ${sentCount} active accounts.`);
      }

      setForm({
        targetType: 'ALL',
        userId: 0,
        title: '',
        message: '',
        type: 'CAMPUS_ANNOUNCEMENT',
      });
    } catch (err: any) {
      error('Dispatch Failed', err?.message || 'Could not send notification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F97316] mb-1">
            <Megaphone className="w-4 h-4" />
            <span>Campus Notification Center</span>
          </div>
          <h2 className="text-xl font-black text-[#171717]">Broadcast Campus Announcements</h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Deliver official bulletins, scheduling notices, or urgent alerts directly to student and faculty feeds.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-bold text-[#171717] mb-1">Target Audience</label>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => setForm({ ...form, targetType: 'ALL' })}
              className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                form.targetType === 'ALL'
                  ? 'border-[#F97316] bg-orange-50/50 text-[#F97316]'
                  : 'border-[#E5E5E5] text-[#737373] hover:bg-neutral-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Broadcast to All Users</span>
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, targetType: 'SPECIFIC' })}
              className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                form.targetType === 'SPECIFIC'
                  ? 'border-[#F97316] bg-orange-50/50 text-[#F97316]'
                  : 'border-[#E5E5E5] text-[#737373] hover:bg-neutral-50'
              }`}
            >
              <BellRing className="w-4 h-4" />
              <span>Single Specific User</span>
            </button>
          </div>
        </div>

        {form.targetType === 'SPECIFIC' && (
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">Select Recipient User</label>
            <select
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-xl text-xs bg-white text-[#171717] outline-hidden focus:border-[#F97316]"
              required
            >
              <option value={0}>-- Select Recipient Account --</option>
              {isLoadingUsers ? (
                <option disabled>Loading users...</option>
              ) : (
                users.map((u: UserRecord) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.email}) — [{u.roles?.join(', ') || 'USER'}]
                  </option>
                ))
              )}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Notification Title *"
            placeholder="e.g. Campus Holiday / Midterm Schedule Released"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">Category / Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-xl text-xs bg-white text-[#171717] outline-hidden focus:border-[#F97316]"
            >
              <option value="CAMPUS_ANNOUNCEMENT">Campus Announcement</option>
              <option value="TIMETABLE_UPDATE">Timetable Schedule Update</option>
              <option value="ACADEMIC_ALERT">Academic Alert</option>
              <option value="GENERAL">General Notice</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#171717] mb-1">Message Body *</label>
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Type notification content to be sent to recipient inboxes..."
            className="w-full px-3 py-2 border border-[#E5E5E5] rounded-xl text-xs bg-white text-[#171717] outline-hidden focus:border-[#F97316] resize-none"
            required
          />
        </div>

        <div className="flex justify-end pt-3 border-t border-[#E5E5E5]">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Notification'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
