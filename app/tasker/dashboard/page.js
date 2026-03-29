'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProtectedRoute from '../../../components/ProtectedRoute';
import StatsCard from '../../../components/StatsCard';
import TaskCard from '../../../components/TaskCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useAuth } from '../../../hooks/useAuth';
import { getTaskerTasks, getTaskStats } from '../../../lib/tasks';
import { getTaskerEarnings } from '../../../lib/payments';

export default function TaskerDashboard() {
  const { user, profile } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState(null);
  const [earnings, setEarnings] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    const [assignRes, statsRes, earningsRes] = await Promise.all([
      getTaskerTasks(user.id),
      getTaskStats(user.id, 'tasker'),
      getTaskerEarnings(user.id),
    ]);
    setAssignments(assignRes.data || []);
    setStats(statsRes.stats);
    setEarnings(earningsRes);
    setLoading(false);
  };

  return (
    <ProtectedRoute requiredRole="tasker">
      <Navbar />
      <div className="page-container">
        <div className="page-content">
          <div className="page-header">
            <h1>Hey, {profile?.full_name?.split(' ')[0] || 'Tasker'} 💪</h1>
            <p>Your tasks and earnings at a glance</p>
          </div>

          {loading ? <div className="page-loading"><LoadingSpinner /></div> : (
            <>
              <div className="dashboard-grid">
                <StatsCard icon="💰" label="Total Earned" value={`₹${earnings.total}`} color="var(--orange)" />
                <StatsCard icon="📋" label="Total Tasks" value={stats?.total || 0} color="var(--blue)" />
                <StatsCard icon="🔄" label="Active" value={stats?.active || 0} color="#F59E0B" />
                <StatsCard icon="✅" label="Completed" value={stats?.completed || 0} color="var(--green)" />
              </div>

              <div className="dashboard-section">
                <div className="dashboard-section-header">
                  <h2>Quick Actions</h2>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link href="/tasker/browse/" className="btn-primary">🔍 Browse Tasks</Link>
                  <Link href="/tasker/applications/" className="btn-secondary">📝 My Applications</Link>
                  <Link href="/tasker/earnings/" className="btn-secondary">💰 Earnings</Link>
                </div>
              </div>

              <div className="dashboard-section">
                <div className="dashboard-section-header">
                  <h2>Active Tasks</h2>
                </div>
                {assignments.filter(a => ['assigned', 'in_progress'].includes(a.task?.status)).length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <div className="empty-state-title">No active tasks</div>
                    <div className="empty-state-desc">Browse available tasks and start earning!</div>
                    <Link href="/tasker/browse/" className="btn-primary">Browse Tasks</Link>
                  </div>
                ) : (
                  <div className="tasks-grid">
                    {assignments.filter(a => ['assigned', 'in_progress'].includes(a.task?.status)).map(a => (
                      <TaskCard key={a.id} task={a.task} linkPrefix="/tasker/task/?id=" showClient />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </ProtectedRoute>
  );
}
