'use client';

const ESCROW_STEPS = [
  { key: 'no_payment', label: 'Awaiting Payment', icon: '💳', desc: 'Client needs to make UPI payment' },
  { key: 'in_escrow', label: 'Funds Held Safely', icon: '🔒', desc: 'Money is safe with Ulfro' },
  { key: 'paid', label: 'Payment Released', icon: '💰', desc: 'Tasker has received payment' },
  { key: 'refunded', label: 'Refunded', icon: '↩️', desc: 'Payment returned to client' },
];

export default function EscrowStatus({ status, amount = 0, showDetails = true }) {
  const currentStep = ESCROW_STEPS.findIndex((s) => s.key === status);

  return (
    <div className="escrow-status">
      <div className="escrow-header">
        <h4 className="escrow-title">Payment Status</h4>
        {amount > 0 && <span className="escrow-amount">₹{amount}</span>}
      </div>

      {showDetails && (
        <div className="escrow-timeline">
          {ESCROW_STEPS.filter(s => s.key !== 'refunded' || status === 'refunded').map((step, i) => (
            <div
              key={step.key}
              className={`escrow-step ${
                i < currentStep ? 'escrow-step-done' :
                i === currentStep ? 'escrow-step-active' :
                'escrow-step-pending'
              }`}
            >
              <div className="escrow-step-dot">
                <span>{i < currentStep ? '✓' : step.icon}</span>
              </div>
              <div className="escrow-step-info">
                <div className="escrow-step-label">{step.label}</div>
                <div className="escrow-step-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {status === 'no_payment' && (
        <div className="escrow-action-hint">
          <p>📱 Make UPI payment to Ulfro and share the reference number</p>
        </div>
      )}
    </div>
  );
}
