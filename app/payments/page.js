'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/ProtectedRoute';
import StatsCard from '../../components/StatsCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { getPaymentHistory } from '../../lib/payments';

export default function PaymentsPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) load(); }, [user]);
  const load = async () => { const { data } = await getPaymentHistory(user.id); setHistory(data || []); setLoading(false); };

  const totalSpent = history.filter(t => t.from_user === user?.id).reduce((s, t) => s + t.amount, 0);

  return (
    <ProtectedRoute requiredRole="client">
      <Navbar />
      <div className="page-container"><div className="page-content">
        <div className="page-header"><h1>Payments 💳</h1><p>Your transaction history</p></div>
        {loading ? <div className="page-loading"><LoadingSpinner /></div> : (
          <>
            <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
              <StatsCard icon="💳" label="Total Spent" value={`₹${totalSpent}`} color="var(--orange)" />
              <StatsCard icon="🔒" label="In Escrow" value={`₹${history.filter(t => t.status === 'held').reduce((s, t) => s + t.amount, 0)}`} color="var(--blue)" />
              <StatsCard icon="✅" label="Transactions" value={history.length} color="var(--green)" />
            </div>
            <div className="detail-card">
              <h3>Transaction History</h3>
              {history.length === 0 ? <p style={{ color: 'var(--gray)' }}>No transactions yet</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {history.map(t => (
                    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'var(--off-white)', borderRadius: '10px' }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{t.type === 'escrow_hold' ? '🔒 Payment Held' : t.type === 'payout' ? '💰 Released' : t.type === 'refund' ? '↩️ Refund' : t.type}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>{t.task?.title || 'Task'} · {new Date(t.created_at).toLocaleDateString('en-IN')}</div>
                      </div>
                      <div style={{ fontFamily: 'Syne', fontWeight: 800, color: t.type === 'refund' ? 'var(--green)' : 'var(--dark)' }}>₹{t.amount}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div></div>
      <Footer />
    </ProtectedRoute>
  );
}
