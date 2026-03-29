'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import ProtectedRoute from '../../../components/ProtectedRoute';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { supabase } from '../../../lib/supabase';
import { createEscrowHold, releaseEscrow } from '../../../lib/payments';
import { LayoutDashboard, Users, ClipboardList, CreditCard, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from('escrow_transactions').select('*, task:tasks(id, title, status, client_id, client:profiles!tasks_client_id_fkey(full_name))').order('created_at', { ascending: false }).limit(100);
    setTransactions(data || []); setLoading(false);
  };

  const handleRelease = async (t) => {
    const assignment = await supabase.from('task_assignments').select('tasker_id, agreed_price').eq('task_id', t.task_id).single();
    if (!assignment.data) return toast.error('No assignment found');
    const { error } = await releaseEscrow(t.task_id, assignment.data.tasker_id, assignment.data.agreed_price);
    if (error) return toast.error(error.message);
    toast.success('Payment released!'); load();
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <Navbar />
      <div className="page-container"><div className="admin-layout">
        <div className="admin-sidebar">
          <Link href="/admin/" className="admin-nav-item"><LayoutDashboard size={16} style={{ marginRight: 6, verticalAlign: '-3px' }} /> Dashboard</Link>
          <Link href="/admin/users/" className="admin-nav-item"><Users size={16} style={{ marginRight: 6, verticalAlign: '-3px' }} /> Users</Link>
          <Link href="/admin/tasks/" className="admin-nav-item"><ClipboardList size={16} style={{ marginRight: 6, verticalAlign: '-3px' }} /> Tasks</Link>
          <Link href="/admin/payments/" className="admin-nav-item admin-active"><CreditCard size={16} style={{ marginRight: 6, verticalAlign: '-3px' }} /> Payments</Link>
          <Link href="/admin/disputes/" className="admin-nav-item"><AlertTriangle size={16} style={{ marginRight: 6, verticalAlign: '-3px' }} /> Disputes</Link>
        </div>
        <div className="admin-content">
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Payments</h1>
          {loading ? <LoadingSpinner /> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead><tr><th>Task</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id}>
                      <td>{t.task?.title || '—'}</td>
                      <td>{t.type}</td>
                      <td style={{ fontWeight: 600 }}>₹{t.amount}</td>
                      <td><span className="admin-badge" style={{ background: t.status === 'held' ? 'rgba(245,158,11,0.1)' : t.status === 'released' ? 'rgba(34,197,94,0.1)' : 'rgba(107,114,128,0.1)', color: t.status === 'held' ? '#F59E0B' : t.status === 'released' ? '#22C55E' : '#6B7280' }}>{t.status}</span></td>
                      <td>{new Date(t.created_at).toLocaleDateString('en-IN')}</td>
                      <td>{t.type === 'escrow_hold' && t.status === 'held' && t.task?.status === 'confirmed' && <button className="admin-action-btn" onClick={() => handleRelease(t)}>Release</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div></div>
    </ProtectedRoute>
  );
}
