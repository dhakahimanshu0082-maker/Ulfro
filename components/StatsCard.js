'use client';

export default function StatsCard({ icon, label, value, trend = null, color = 'var(--orange)' }) {
  return (
    <div className="stats-card">
      <div className="stats-card-icon" style={{ background: `${color}15` }}>
        <span>{icon}</span>
      </div>
      <div className="stats-card-info">
        <div className="stats-card-value" style={{ color }}>{value}</div>
        <div className="stats-card-label">{label}</div>
        {trend !== null && (
          <div className={`stats-card-trend ${trend >= 0 ? 'trend-up' : 'trend-down'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}
