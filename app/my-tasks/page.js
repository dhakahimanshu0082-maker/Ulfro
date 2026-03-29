'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/ProtectedRoute';
import TaskCard from '../../components/TaskCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { getClientTasks } from '../../lib/tasks';
import Link from 'next/link';

const FILTERS = ['all', 'open', 'assigned', 'in_progress', 'completed', 'confirmed', 'paid', 'disputed'];

export default function MyTasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) loadTasks(); }, [user, filter]);

  const loadTasks = async () => {
    setLoading(true);
    const { data } = await getClientTasks(user.id, filter);
    setTasks(data || []);
    setLoading(false);
  };

  return (
    <ProtectedRoute requiredRole="client">
      <Navbar />
      <div className="page-container">
        <div className="page-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1>My Tasks</h1>
              <p>All your posted tasks</p>
            </div>
            <Link href="/post-task/" className="btn-primary">+ Post New Task</Link>
          </div>
          <div className="filter-bar">
            <div className="filter-tabs">
              {FILTERS.map(f => (
                <button key={f} className={`filter-tab ${filter === f ? 'filter-active' : ''}`} onClick={() => setFilter(f)}>
                  {f === 'all' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
          {loading ? <div className="page-loading"><LoadingSpinner /></div> : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-title">No tasks found</div>
              <div className="empty-state-desc">Try a different filter or post a new task</div>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </ProtectedRoute>
  );
}
