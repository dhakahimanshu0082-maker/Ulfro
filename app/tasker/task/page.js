'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProtectedRoute from '../../../components/ProtectedRoute';
import EscrowStatus from '../../../components/EscrowStatus';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useAuth } from '../../../hooks/useAuth';
import { getTask } from '../../../lib/tasks';
import { applyToTask, hasApplied, startWork, markComplete } from '../../../lib/applications';
import { getEscrowStatus } from '../../../lib/payments';
import { getCategoryById } from '../../../lib/categories';
import toast from 'react-hot-toast';

function TaskerTaskClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [escrow, setEscrow] = useState(null);
  const [myApplication, setMyApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposedPrice, setProposedPrice] = useState('');
  const [message, setMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { if (id && user) loadData(); else setLoading(false); }, [id, user]);

  const loadData = async () => {
    const { data } = await getTask(id);
    setTask(data);
    if (data && user) {
      const { application } = await hasApplied(id, user.id);
      setMyApplication(application);
      const escrowRes = await getEscrowStatus(id);
      setEscrow(escrowRes);
    }
    setLoading(false);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!proposedPrice) return toast.error('Enter your price');
    setActionLoading(true);
    const { error } = await applyToTask(id, parseInt(proposedPrice), message);
    setActionLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Applied!'); loadData();
  };

  const handleStart = async () => { setActionLoading(true); const { error } = await startWork(id); setActionLoading(false); if (error) return toast.error(error.message); toast.success('Started!'); loadData(); };
  const handleDone = async () => { setActionLoading(true); const { error } = await markComplete(id); setActionLoading(false); if (error) return toast.error(error.message); toast.success('Marked complete!'); loadData(); };

  if (loading) return (<><Navbar /><div className="page-container"><div className="page-loading"><LoadingSpinner /></div></div></>);
  if (!id || !task) return (<><Navbar /><div className="page-container"><div className="page-content"><div className="empty-state"><div className="empty-state-icon">❌</div><div className="empty-state-title">Task not found</div></div></div></div></>);

  const category = getCategoryById(task.category);
  const isAssigned = task.assignment?.[0]?.tasker?.id === user?.id;

  return (
    <ProtectedRoute requiredRole="tasker">
      <Navbar />
      <div className="page-container"><div className="page-content"><div className="task-detail">
        <div className="task-detail-main">
          <div className="detail-card">
            <div className="task-category-badge" style={{ marginBottom: '0.5rem' }}><span>{category?.icon}</span> {category?.name || task.category}</div>
            <h1 style={{ fontFamily: 'Syne', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{task.title}</h1>
            {task.description && <p style={{ color: 'var(--gray)', lineHeight: 1.7, marginBottom: '1rem' }}>{task.description}</p>}
            <div className="task-card-meta">
              <div className="task-meta-item"><span>💰</span> ₹{task.budget}</div>
              {task.location && <div className="task-meta-item"><span>📍</span> {task.location}</div>}
              {task.deadline && <div className="task-meta-item"><span>⏰</span> {new Date(task.deadline).toLocaleString('en-IN')}</div>}
            </div>
          </div>

          {task.status === 'open' && !myApplication && (
            <div className="detail-card"><h3>🙋 Apply</h3>
              <form onSubmit={handleApply}>
                <div className="form-group"><label>Your Price (₹)</label><input type="number" min="50" placeholder={`Budget: ₹${task.budget}`} value={proposedPrice} onChange={(e) => setProposedPrice(e.target.value)} required /></div>
                <div className="form-group"><label>Message</label><textarea placeholder="Why you?" value={message} onChange={(e) => setMessage(e.target.value)} /></div>
                <button type="submit" className="form-submit" disabled={actionLoading}>{actionLoading ? 'Applying...' : '📨 Apply'}</button>
              </form>
            </div>
          )}

          {myApplication && !isAssigned && (<div className="detail-card" style={{ background: 'rgba(59,130,246,0.04)' }}><h3>📝 Applied</h3><p style={{ color: 'var(--gray)' }}>Status: <strong>{myApplication.status}</strong> | ₹{myApplication.proposed_price}</p></div>)}
          {isAssigned && task.status === 'assigned' && (<div className="detail-card" style={{ background: 'rgba(59,130,246,0.04)' }}><h3>🎉 Assigned!</h3><button className="btn-primary" onClick={handleStart} disabled={actionLoading}>{actionLoading ? '...' : '🚀 Start Working'}</button></div>)}
          {isAssigned && task.status === 'in_progress' && (<div className="detail-card" style={{ background: 'rgba(245,158,11,0.04)' }}><h3>💪 In Progress</h3><button className="btn-primary" onClick={handleDone} disabled={actionLoading}>{actionLoading ? '...' : '✅ Mark Complete'}</button></div>)}
        </div>

        <div className="task-detail-sidebar">
          <div className="detail-card"><h3>👤 Client</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span className="profile-avatar" style={{ width: 44, height: 44 }}>{task.client?.full_name?.[0]?.toUpperCase()}</span>
              <div><div style={{ fontWeight: 600 }}>{task.client?.full_name}</div>{task.client?.rating > 0 && <div style={{ fontSize: '0.82rem', color: 'var(--orange)' }}>⭐ {task.client.rating}</div>}</div>
            </div>
          </div>
          {escrow && isAssigned && <EscrowStatus status={escrow.status} amount={task.assignment?.[0]?.agreed_price || task.budget} />}
        </div>
      </div></div></div>
      <Footer />
    </ProtectedRoute>
  );
}

export default function TaskerTaskPage() {
  return (
    <Suspense fallback={<div className="page-loading"><LoadingSpinner /></div>}>
      <TaskerTaskClient />
    </Suspense>
  );
}
