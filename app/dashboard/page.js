'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/ProtectedRoute';
import StatsCard from '../../components/StatsCard';
import TaskCard from '../../components/TaskCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { getClientTasks, getTaskStats } from '../../lib/tasks';

export default function ClientDashboard() {
  const { user, profile } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    const [tasksRes, statsRes] = await Promise.all([
      getClientTasks(user.id),
      getTaskStats(user.id, 'client'),
    ]);
    setTasks(tasksRes.data || []);
    setStats(statsRes.stats);
    setLoading(false);
  };

  return (
    <ProtectedRoute requiredRole="client">
      <Navbar />
      <div className="page-container">
        <div className="page-content">
          <div className="page-header">
            <h1>Hi, {profile?.full_name?.split(' ')[0] || 'there'} 👋</h1>
            <p>Manage your tasks and track progress</p>
          </div>

          {loading ? (
            <div className="page-loading"><LoadingSpinner /></div>
          ) : (
            <>
              <div className="dashboard-grid">
                <StatsCard icon="📋" label="Total Tasks" value={stats?.total || 0} color="var(--orange)" />
                <StatsCard icon="🟢" label="Open" value={stats?.open || 0} color="#22C55E" />
                <StatsCard icon="🔄" label="In Progress" value={stats?.assigned || 0} color="#3B82F6" />
                <StatsCard icon="✅" label="Completed" value={stats?.completed || 0} color="#8B5CF6" />
              </div>

              <div className="dashboard-section">
                <div className="dashboard-section-header">
                  <h2>Recent Tasks</h2>
                  <Link href="/my-tasks/">View All →</Link>
                </div>
                {tasks.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <div className="empty-state-title">No tasks yet</div>
                    <div className="empty-state-desc">Post your first task and get it done!</div>
                    <Link href="/post-task/" className="btn-primary">Post a Task</Link>
                  </div>
                ) : (
                  <div className="tasks-grid">
                    {tasks.slice(0, 6).map(task => (
                      <TaskCard key={task.id} task={task} />
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
