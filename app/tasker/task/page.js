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
import { XCircle, IndianRupee, MapPin, Clock, FileText, PartyPopper, Play, Hammer, CircleCheck, User, Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';

function TaskerTaskClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [escrow, setEscrow] = useState(null);
  const [myApplication, setMyApplication] = useState(null);
  const [loading, setLoading] = useState(true);
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



  const handleStart = async () => { setActionLoading(true); const { error } = await startWork(id); setActionLoading(false); if (error) return toast.error(error.message); toast.success('Started!'); loadData(); };
  const handleDone = async () => { setActionLoading(true); const { error } = await markComplete(id); setActionLoading(false); if (error) return toast.error(error.message); toast.success('Marked complete!'); loadData(); };

  if (loading) return (<><Navbar /><div className="page-container"><div className="page-loading"><LoadingSpinner /></div></div></>);
  if (!id || !task) return (<><Navbar /><div className="page-container"><div className="page-content"><div className="empty-state"><div className="empty-state-icon"><XCircle size={40} /></div><div className="empty-state-title">Task not found</div></div></div></div></>);

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
              <div className="task-meta-item"><span><IndianRupee size={15} /></span> ₹{task.budget}</div>
              {task.location && <div className="task-meta-item"><span><MapPin size={15} /></span> {task.location}</div>}
              {task.deadline && <div className="task-meta-item"><span><Clock size={15} /></span> {new Date(task.deadline).toLocaleString('en-IN')}</div>}
            </div>
          </div>

          {task.status === 'open' && !myApplication && (
            <div className="detail-card">
              <h3><Send size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Apply via WhatsApp</h3>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Contact the Ulfro Admin directly to negotiate and receive the assignment.
              </p>
              <a 
                href={`https://wa.me/919079317277?text=${encodeURIComponent(`Hi! I'm interested in the Task: "${task.title}" (ID: ${task.id}).\n\nTask Link: https://ulfro.vercel.app/task/?id=${task.id}\n\nMy proposed price is ₹`)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#25D366', color: 'white', textDecoration: 'none' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.44C18.24 1.15 15.21 0 11.97 0 5.41 0 .07 5.34.07 11.9 0.07 14 0.62 16.03 1.66 17.83L0 24l6.32-1.66c1.74.96 3.71 1.47 5.75 1.47 6.56 0 11.9-5.34 11.9-11.9 .01-3.18-1.23-6.18-3.45-8.47zM12.06 21.8c-1.78 0-3.52-.48-5.05-1.38l-.36-.21-3.76.99.99-3.66-.23-.37c-1-1.59-1.53-3.42-1.53-5.3 0-5.5 4.47-9.97 9.97-9.97 5.5 0 9.97 4.47 9.97 9.97 0 5.5-4.47 9.98-9.99 9.98zm5.48-7.48c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-1.07-.94-1.79-2.1-2-2.4-.2-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.23-.25-.59-.5-.51-.68-.52l-.58-.02c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.1 3.22 5.1 4.51.72.31 1.28.5 1.72.64.69.22 1.34.19 1.86.11.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35z"/></svg>
                Connect on WhatsApp
              </a>
            </div>
          )}

          {myApplication && !isAssigned && (<div className="detail-card" style={{ background: 'rgba(59,130,246,0.04)' }}><h3><FileText size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Applied</h3><p style={{ color: 'var(--gray)' }}>Status: <strong>{myApplication.status}</strong> | ₹{myApplication.proposed_price}</p></div>)}
          {isAssigned && task.status === 'assigned' && (<div className="detail-card" style={{ background: 'rgba(59,130,246,0.04)' }}><h3><PartyPopper size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Assigned!</h3><button className="btn-primary" onClick={handleStart} disabled={actionLoading}>{actionLoading ? '...' : <><Play size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Start Working</>}</button></div>)}
          {isAssigned && task.status === 'in_progress' && (<div className="detail-card" style={{ background: 'rgba(245,158,11,0.04)' }}><h3><Hammer size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> In Progress</h3><button className="btn-primary" onClick={handleDone} disabled={actionLoading}>{actionLoading ? '...' : <><CircleCheck size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Mark Complete</>}</button></div>)}
        </div>

        <div className="task-detail-sidebar">
          <div className="detail-card"><h3><User size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Client</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span className="profile-avatar" style={{ width: 44, height: 44 }}>{task.client?.full_name?.[0]?.toUpperCase()}</span>
              <div><div style={{ fontWeight: 600 }}>{task.client?.full_name}</div>{task.client?.rating > 0 && <div style={{ fontSize: '0.82rem', color: 'var(--orange)' }}><Star size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> {task.client.rating}</div>}</div>
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
