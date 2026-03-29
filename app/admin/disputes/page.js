'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import ProtectedRoute from '../../../components/ProtectedRoute';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from('disputes').select('*, task:tasks(id, title, budget), raised:profiles!disputes_raised_by_fkey(full_name)').order('created_at', { ascending: false });
    setDisputes(data || []); setLoading(false);
  };

  const resolve = async (id) => {
    const notes = prompt('Resolution notes:');
    if (!notes) return;
    const { error } = await supabase.from('disputes').update({ status: 'resolved', resolution: notes, resolved_at: new Date().toISOString() }).eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Dispute resolved!'); load();
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <Navbar />
      <div className="page-container"><div className="admin-layout">
        <div className="admin-sidebar">
          <Link href="/admin/" className="admin-nav-item">📊 Dashboard</Link>
          <Link href="/admin/users/" className="admin-nav-item">👥 Users</Link>
          <Link href="/admin/tasks/" className="admin-nav-item">📋 Tasks</Link>
          <Link href="/admin/payments/" className="admin-nav-item">💳 Payments</Link>
          <Link href="/admin/disputes/" className="admin-nav-item admin-active">⚠️ Disputes</Link>
        </div>
        <div className="admin-content">
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Disputes</h1>
          {loading ? <LoadingSpinner /> : disputes.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">✅</div><div className="empty-state-title">No disputes</div></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead><tr><th>Task</th><th>Raised By</th><th>Reason</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {disputes.map(d => (
                    <tr key={d.id}>
                      <td>{d.task?.title || '—'}</td>
                      <td>{d.raised?.full_name || '—'}</td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.reason}</td>
                      <td><span className="admin-badge" style={{ background: d.status === 'open' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: d.status === 'open' ? '#EF4444' : '#22C55E' }}>{d.status}</span></td>
                      <td>{new Date(d.created_at).toLocaleDateString('en-IN')}</td>
                      <td>{d.status === 'open' && <button className="admin-action-btn" onClick={() => resolve(d.id)}>Resolve</button>}</td>
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
