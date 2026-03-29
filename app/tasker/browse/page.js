'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProtectedRoute from '../../../components/ProtectedRoute';
import TaskCard from '../../../components/TaskCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { getOpenTasks } from '../../../lib/tasks';
import { ALL_CATEGORIES, DELHI_AREAS } from '../../../lib/categories';

export default function BrowseTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', location: '', maxBudget: '' });

  useEffect(() => { loadTasks(); }, [filters]);

  const loadTasks = async () => {
    setLoading(true);
    const f = {};
    if (filters.category) f.category = filters.category;
    if (filters.location) f.location = filters.location;
    if (filters.maxBudget) f.maxBudget = parseInt(filters.maxBudget);
    const { data } = await getOpenTasks(f);
    setTasks(data || []);
    setLoading(false);
  };

  return (
    <ProtectedRoute requiredRole="tasker">
      <Navbar />
      <div className="page-container">
        <div className="page-content">
          <div className="page-header">
            <h1>Browse Tasks 🔍</h1>
            <p>Find tasks you can do and start earning</p>
          </div>
          <div className="filter-bar">
            <select value={filters.category} onChange={(e) => setFilters(p => ({ ...p, category: e.target.value }))}>
              <option value="">All Categories</option>
              {ALL_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
            <select value={filters.location} onChange={(e) => setFilters(p => ({ ...p, location: e.target.value }))}>
              <option value="">All Locations</option>
              {DELHI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={filters.maxBudget} onChange={(e) => setFilters(p => ({ ...p, maxBudget: e.target.value }))}>
              <option value="">Any Budget</option>
              <option value="100">Up to ₹100</option>
              <option value="300">Up to ₹300</option>
              <option value="500">Up to ₹500</option>
              <option value="1000">Up to ₹1000</option>
              <option value="5000">Up to ₹5000</option>
            </select>
          </div>
          {loading ? <div className="page-loading"><LoadingSpinner /></div> : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-title">No tasks found</div>
              <div className="empty-state-desc">Try different filters or check back later</div>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map(t => <TaskCard key={t.id} task={t} linkPrefix="/tasker/task/?id=" showClient />)}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </ProtectedRoute>
  );
}
