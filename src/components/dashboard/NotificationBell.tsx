'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell } from 'lucide-react';
import useSWR from 'swr';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { notificationsService, AppNotification } from '@/services/notifications.service';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: unreadData, mutate: mutateCount } = useSWR(
    '/api/notifications/unread-count',
    () => notificationsService.getUnreadCount(),
    { refreshInterval: 30000 }
  );

  const count = unreadData?.unreadCount ?? 0;

  const fetchNotifications = useCallback(async () => {
    setLoadingNotifs(true);
    try {
      const data = await notificationsService.getAll();
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      setNotifications([]);
    } finally {
      setLoadingNotifs(false);
    }
  }, []);

  const handleToggle = () => {
    if (!open) {
      fetchNotifications();
    }
    setOpen((prev) => !prev);
  };

  const handleMarkRead = async (id: number) => {
    try {
      await notificationsService.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      mutateCount();
    } catch {
      // silent
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      mutateCount();
    } catch {
      // silent
    }
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handler);
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative"
        aria-label="Notificaciones"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-[#0A110F] border border-white/5 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <span className="text-white font-bold text-sm">Notificaciones</span>
            {hasUnread && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                Marcar todas leídas
              </button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-80 overflow-y-auto">
            {loadingNotifs ? (
              <div className="flex items-center justify-center py-8">
                <span className="text-slate-500 text-sm">Cargando...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <Bell className="w-8 h-8 text-slate-700" />
                <span className="text-slate-500 text-sm">No tienes notificaciones</span>
              </div>
            ) : (
              <ul>
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    onClick={() => !notif.read && handleMarkRead(notif.id)}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-0 transition-colors ${
                      notif.read
                        ? 'opacity-60 cursor-default'
                        : 'cursor-pointer hover:bg-white/5'
                    }`}
                  >
                    {/* Unread dot */}
                    <div className="mt-1.5 shrink-0">
                      {!notif.read ? (
                        <span className="w-2 h-2 bg-emerald-400 rounded-full block" />
                      ) : (
                        <span className="w-2 h-2 rounded-full block" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">{notif.title}</p>
                      <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5 line-clamp-2">
                        {notif.body}
                      </p>
                      <p className="text-slate-600 text-[10px] mt-1">
                        {formatDistanceToNow(new Date(notif.createdAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
