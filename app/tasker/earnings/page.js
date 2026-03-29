'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProtectedRoute from '../../../components/ProtectedRoute';
import StatsCard from '../../../components/StatsCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useAuth } from '../../../hooks/useAuth';
import { getTaskerEarnings, getPaymentHistory } from '../../../lib/payments';

export default function TaskerEarningsPage() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState({ total: 0, count: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) load(); }, [user]);
  const load = async () => {
    const [e, h] = await Promise.all([getTaskerEarnings(user.id), getPaymentHistory(user.id)]);
    setEarnings(e); setHistory(h.data || []); setLoading(false);
  };

  return (
    <ProtectedRoute requiredRole="tasker">
      <Navbar />
      <div className="page-container"><div className="page-content">
        <div className="page-header"><h1>Earnings 💰</h1><p>Track your income</p></div>
        {loading ? <div className="page-loading"><LoadingSpinner /></div> : (
          <>
            <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
              <StatsCard icon="💰" label="Total Earned" value={`₹${earnings.total}`} color="var(--orange)" />
              <StatsCard icon="✅" label="Completed Tasks" value={earnings.count} color="var(--green)" />
              <StatsCard icon="📊" label="Avg per Task" value={`₹${earnings.count ? Math.round(earnings.total / earnings.count) : 0}`} color="var(--blue)" />
            </div>
            <div className="detail-card">
              <h3>Transaction History</h3>
              {history.length === 0 ? <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>No transactions yet</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {history.map(t => (
                    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'var(--off-white)', borderRadius: '10px' }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{t.type === 'payout' ? '💰 Payment Received' : t.type === 'escrow_hold' ? '🔒 Escrow Hold' : t.type}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>{t.task?.title || 'Task'} · {new Date(t.created_at).toLocaleDateString('en-IN')}</div>
                      </div>
                      <div style={{ fontFamily: 'Syne', fontWeight: 800, color: t.type === 'payout' ? 'var(--green)' : 'var(--gray)' }}>
                        {t.type === 'payout' ? '+' : ''}₹{t.amount}
                      </div>
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
