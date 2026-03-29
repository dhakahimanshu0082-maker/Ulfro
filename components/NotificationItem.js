'use client';

import Link from 'next/link';
import { NOTIFICATION_ICONS } from '../lib/notifications';

export default function NotificationItem({ notification, onMarkRead }) {
  const icon = NOTIFICATION_ICONS[notification.type] || 'ℹ️';

  return (
    <div
      className={`notification-item ${notification.read ? '' : 'notification-unread'}`}
      onClick={() => !notification.read && onMarkRead?.(notification.id)}
    >
      <div className="notification-icon">{icon}</div>
      <div className="notification-content">
        <div className="notification-title">{notification.title}</div>
        <div className="notification-body">{notification.body}</div>
        <div className="notification-time">
          {formatTimeAgo(notification.created_at)}
        </div>
      </div>
      {!notification.read && <div className="notification-dot" />}
      {notification.link && (
        <Link href={notification.link} className="notification-link">
          View →
        </Link>
      )}
    </div>
  );
}

function formatTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
