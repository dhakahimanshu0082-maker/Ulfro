'use client';

import Link from 'next/link';
import {
  ClipboardList, UserPlus, CircleCheck, XCircle, Rocket, PartyPopper,
  Wallet, Lock, Star, AlertTriangle, Info
} from 'lucide-react';

const ICON_MAP = {
  task_posted: <ClipboardList size={18} />,
  application_received: <UserPlus size={18} />,
  application_accepted: <CircleCheck size={18} />,
  application_rejected: <XCircle size={18} />,
  task_started: <Rocket size={18} />,
  task_completed: <PartyPopper size={18} />,
  payment_received: <Wallet size={18} />,
  payment_held: <Lock size={18} />,
  review_received: <Star size={18} />,
  dispute_opened: <AlertTriangle size={18} />,
  dispute_resolved: <CircleCheck size={18} />,
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
};

export default function NotificationItem({ notification, onMarkRead }) {
  const icon = ICON_MAP[notification.type] || <Info size={18} />;

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
