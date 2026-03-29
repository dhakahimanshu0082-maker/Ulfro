'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import StatsCard from '../../components/StatsCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { getPlatformRevenue } from '../../lib/payments';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  const load = async () => {
    const [users, tasks, revenue] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('tasks').select('*', { count: 'exact', head: true }),
      getPlatformRevenue(),
    ]);
    setStats({ users: users.count || 0, tasks: tasks.count || 0, revenue: revenue.total || 0 });
    setLoading(false);
  };

  const NAV = [
    { href: '/admin/', label: '📊 Dashboard', active: true },
    { href: '/admin/users/', label: '👥 Users' },
    { href: '/admin/tasks/', label: '📋 Tasks' },
    { href: '/admin/payments/', label: '💳 Payments' },
    { href: '/admin/disputes/', label: '⚠️ Disputes' },
  ];

  return (
    <ProtectedRoute requiredRole="admin">
      <Navbar />
      <div className="page-container">
        <div className="admin-layout">
          <div className="admin-sidebar">
            {NAV.map(n => (
              <Link key={n.href} href={n.href} className={`admin-nav-item ${n.active ? 'admin-active' : ''}`}>{n.label}</Link>
            ))}
          </div>
          <div className="admin-content">
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Admin Dashboard</h1>
            {loading ? <LoadingSpinner /> : (
              <div className="dashboard-grid">
                <StatsCard icon="👥" label="Total Users" value={stats.users} color="var(--blue)" />
                <StatsCard icon="📋" label="Total Tasks" value={stats.tasks} color="var(--orange)" />
                <StatsCard icon="💰" label="Revenue (15%)" value={`₹${stats.revenue}`} color="var(--green)" />
              </div>
            )}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/admin/users/" className="btn-primary">Manage Users</Link>
              <Link href="/admin/payments/" className="btn-secondary">Manage Payments</Link>
              <Link href="/admin/disputes/" className="btn-secondary">View Disputes</Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
