'use client';

export default function LoadingSpinner({ size = 40, color = 'var(--orange)' }) {
  return (
    <div className="loading-spinner" style={{ width: size, height: size }}>
      <div
        className="spinner-ring"
        style={{
          borderColor: `${color}20`,
          borderTopColor: color,
          width: size,
          height: size,
        }}
      />
    </div>
  );
}
