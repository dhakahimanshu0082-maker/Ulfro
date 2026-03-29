'use client';

import Link from 'next/link';
import { getCategoryById } from '../lib/categories';

const STATUS_BADGES = {
  open: { label: 'Open', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  assigned: { label: 'Assigned', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  in_progress: { label: 'In Progress', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  completed: { label: 'Completed', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  confirmed: { label: 'Confirmed', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  paid: { label: 'Paid', color: '#059669', bg: 'rgba(5,150,105,0.1)' },
  disputed: { label: 'Disputed', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  draft: { label: 'Draft', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
};

export default function TaskCard({ task, linkPrefix = '/task/?id=', showClient = false }) {
  const category = getCategoryById(task.category);
  const status = STATUS_BADGES[task.status] || STATUS_BADGES.draft;
  const deadline = task.deadline ? new Date(task.deadline) : null;
  const isUrgent = deadline && (deadline - Date.now()) < 24 * 60 * 60 * 1000;

  return (
    <Link href={`${linkPrefix}${task.id}`} className="task-card-link" style={{ textDecoration: 'none' }}>
      <div className="task-card">
        <div className="task-card-header">
          <div className="task-category-badge">
            <span>{category?.icon || '📋'}</span>
            <span>{category?.name || task.category}</span>
          </div>
          <span
            className="task-status-badge"
            style={{ color: status.color, background: status.bg }}
          >
            {status.label}
          </span>
        </div>

        <h3 className="task-card-title">{task.title}</h3>

        <p className="task-card-desc">
          {task.description?.substring(0, 120)}
          {task.description?.length > 120 ? '...' : ''}
        </p>

        <div className="task-card-meta">
          <div className="task-meta-item">
            <span>💰</span>
            <span>₹{task.budget}</span>
          </div>
          <div className="task-meta-item">
            <span>📍</span>
            <span>{task.location || 'Delhi'}</span>
          </div>
          {deadline && (
            <div className="task-meta-item" style={isUrgent ? { color: '#EF4444' } : {}}>
              <span>⏰</span>
              <span>{isUrgent ? 'Urgent!' : deadline.toLocaleDateString('en-IN')}</span>
            </div>
          )}
        </div>

        {showClient && task.client && (
          <div className="task-card-client">
            <span className="task-client-avatar">
              {task.client.full_name ? task.client.full_name[0].toUpperCase() : '?'}
            </span>
            <span className="task-client-name">{task.client.full_name}</span>
            {task.client.rating > 0 && (
              <span className="task-client-rating">⭐ {task.client.rating}</span>
            )}
          </div>
        )}

        {task.applications && (
          <div className="task-card-footer">
            <span className="task-application-count">
              🙋 {task.applications?.[0]?.count || task.applications?.length || 0} applications
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
