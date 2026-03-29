'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import ProtectedRoute from '../../../components/ProtectedRoute';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { supabase } from '../../../lib/supabase';
import { LayoutDashboard, Users, ClipboardList, CreditCard, AlertTriangle, Star, CircleCheck, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  const load = async () => { const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }); setUsers(data || []); setLoading(false); };

  const toggleVerify = async (userId, current) => {
    const { error } = await supabase.from('profiles').update({ aadhar_verified: !current }).eq('id', userId);
    if (error) return toast.error(error.message);
    toast.success(current ? 'Verification removed' : 'User verified!');
    load();
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <Navbar />
      <div className="page-container"><div className="admin-layout">
        <div className="admin-sidebar">
          <Link href="/admin/" className="admin-nav-item"><LayoutDashboard size={16} style={{ marginRight: 6, verticalAlign: '-3px' }} /> Dashboard</Link>
          <Link href="/admin/users/" className="admin-nav-item admin-active"><Users size={16} style={{ marginRight: 6, verticalAlign: '-3px' }} /> Users</Link>
          <Link href="/admin/tasks/" className="admin-nav-item"><ClipboardList size={16} style={{ marginRight: 6, verticalAlign: '-3px' }} /> Tasks</Link>
          <Link href="/admin/payments/" className="admin-nav-item"><CreditCard size={16} style={{ marginRight: 6, verticalAlign: '-3px' }} /> Payments</Link>
          <Link href="/admin/disputes/" className="admin-nav-item"><AlertTriangle size={16} style={{ marginRight: 6, verticalAlign: '-3px' }} /> Disputes</Link>
        </div>
        <div className="admin-content">
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Users ({users.length})</h1>
          {loading ? <LoadingSpinner /> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Verified</th><th>Rating</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 500 }}>{u.full_name || '—'}</td>
                      <td>{u.email || '—'}</td>
                      <td>{u.phone || '—'}</td>
                      <td><span className="admin-badge" style={{ background: u.role === 'admin' ? 'rgba(239,68,68,0.1)' : u.role === 'tasker' ? 'rgba(59,130,246,0.1)' : 'rgba(255,107,0,0.1)', color: u.role === 'admin' ? '#EF4444' : u.role === 'tasker' ? '#3B82F6' : '#FF6B00' }}>{u.role}</span></td>
                      <td>{u.aadhar_verified ? <CircleCheck size={16} style={{ color: '#22C55E' }} /> : <XCircle size={16} style={{ color: '#EF4444' }} />}</td>
                      <td>{u.rating > 0 ? <><Star size={13} style={{ color: '#F59E0B', verticalAlign: '-2px' }} /> {u.rating}</> : '—'}</td>
                      <td><button className="admin-action-btn" onClick={() => toggleVerify(u.id, u.aadhar_verified)}>{u.aadhar_verified ? 'Unverify' : 'Verify'}</button></td>
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
