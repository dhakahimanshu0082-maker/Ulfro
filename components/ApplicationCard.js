'use client';

export default function ApplicationCard({ application, onAccept, onReject, isClient = false }) {
  const tasker = application.tasker;

  return (
    <div className="application-card">
      <div className="application-card-header">
        <div className="application-tasker-info">
          <span className="application-avatar">
            {tasker?.full_name ? tasker.full_name[0].toUpperCase() : '?'}
          </span>
          <div>
            <div className="application-tasker-name">{tasker?.full_name || 'Unknown'}</div>
            <div className="application-tasker-meta">
              {tasker?.rating > 0 && <span>⭐ {tasker.rating}</span>}
              {tasker?.city && <span>📍 {tasker.city}</span>}
            </div>
          </div>
        </div>
        <div className="application-price">
          <span className="application-price-label">Proposed</span>
          <span className="application-price-amount">₹{application.proposed_price}</span>
        </div>
      </div>

      {application.message && (
        <p className="application-message">{application.message}</p>
      )}

      <div className="application-card-footer">
        <span className="application-time">
          {new Date(application.created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>

        {isClient && application.status === 'pending' && (
          <div className="application-actions">
            <button
              className="btn-accept"
              onClick={() => onAccept?.(application)}
            >
              ✅ Accept
            </button>
            <button
              className="btn-reject"
              onClick={() => onReject?.(application)}
            >
              ❌ Reject
            </button>
          </div>
        )}

        {application.status !== 'pending' && (
          <span
            className={`application-status-badge status-${application.status}`}
          >
            {application.status === 'accepted' ? '✅ Accepted' :
             application.status === 'rejected' ? '❌ Rejected' :
             application.status === 'withdrawn' ? '↩️ Withdrawn' :
             application.status}
          </span>
        )}
      </div>
    </div>
  );
}
