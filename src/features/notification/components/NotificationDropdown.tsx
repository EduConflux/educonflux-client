import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import {
  useUnreadNotifications,
  useUnreadNotificationCount,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from '../hooks/useNotifications';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: count = 0 } = useUnreadNotificationCount();
  const { data: unreadList = [], isLoading } = useUnreadNotifications();
  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
        aria-label="Open notifications"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#F97316] rounded-full ring-2 ring-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E5E5E5] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between p-4 border-b border-[#E5E5E5] bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#171717]">Notifications</span>
              {count > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-orange-100 text-[#F97316] rounded-full">
                  {count} new
                </span>
              )}
            </div>

            {count > 0 && (
              <button
                type="button"
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                className="text-[11px] font-semibold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-neutral-400">Loading notifications...</div>
            ) : unreadList.length === 0 ? (
              <div className="p-8 text-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-2">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-neutral-700">All caught up!</div>
                <div className="text-[11px] text-neutral-400">No unread notifications right now.</div>
              </div>
            ) : (
              unreadList.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 hover:bg-neutral-50 transition-colors flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-xs font-bold text-neutral-900 leading-tight truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-neutral-600 leading-relaxed line-clamp-2">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-neutral-400 block">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : 'Just now'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => markReadMutation.mutate(item.id)}
                    title="Mark as read"
                    className="p-1 rounded-md text-neutral-300 hover:text-neutral-700 hover:bg-neutral-200/50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
