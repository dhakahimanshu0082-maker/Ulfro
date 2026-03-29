'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import ProtectedRoute from '../../../components/ProtectedRoute';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { supabase } from '../../../lib/supabase';
import { LayoutDashboard, Users, ClipboardList, CreditCard, AlertTriangle } from 'lucide-react';

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from('tasks').select('*, client:profiles!tasks_client_id_fkey(full_name)').order('created_at', { ascending: false }).limit(100);
    setTasks(data || []); setLoading(false);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <Navbar />
      <div className="page-container"><div className="admin-layout">
        <div className="admin-sidebar">
          <Link href="/admin/" className="admin-nav-item"><LayoutDashboard size={16} style={{ marginRight: 6, verticalAlign: '-3px' }} /> Dashboard</Link>
          <Link href="/admin/users/" className="admin-nav-item"><Users size={16} style={{ marginRight: 6, verticalAlign: '-3px' }} /> Users</Link>
          <Link href="/admin/tasks/" className="admin-nav-item admin-active"><ClipboardList size={16} style={{ marginRight: 6, verticalAlign: '-3px' }} /> Tasks</Link>
          <Link href="/admin/payments/" className="admin-nav-item"><CreditCard size={16} style={{ marginRight: 6, verticalAlign: '-3px' }} /> Payments</Link>
          <Link href="/admin/disputes/" className="admin-nav-item"><AlertTriangle size={16} style={{ marginRight: 6, verticalAlign: '-3px' }} /> Disputes</Link>
        </div>
        <div className="admin-content">
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.5rem' }}>All Tasks ({tasks.length})</h1>
          {loading ? <LoadingSpinner /> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead><tr><th>Title</th><th>Client</th><th>Budget</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
                <tbody>
                  {tasks.map(t => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</td>
                      <td>{t.client?.full_name || '—'}</td>
                      <td>₹{t.budget}</td>
                      <td><span className="admin-badge" style={{ background: t.status === 'open' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)', color: t.status === 'open' ? '#22C55E' : '#3B82F6' }}>{t.status}</span></td>
                      <td>{new Date(t.created_at).toLocaleDateString('en-IN')}</td>
                      <td><Link href={`/task/?id=${t.id}`} className="admin-action-btn" style={{ textDecoration: 'none' }}>View</Link></td>
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
