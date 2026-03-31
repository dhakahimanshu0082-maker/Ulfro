'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ApplicationCard from '../../components/ApplicationCard';
import EscrowStatus from '../../components/EscrowStatus';
import RatingStars from '../../components/RatingStars';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { getTask } from '../../lib/tasks';
import { acceptApplication, confirmCompletion, manualAssignTask } from '../../lib/applications';
import { getEscrowStatus } from '../../lib/payments';
import { createReview, hasReviewed } from '../../lib/reviews';
import { getCategoryById } from '../../lib/categories';
import { XCircle, IndianRupee, MapPin, Clock, CircleCheck, ThumbsUp, ClipboardList, User, Star, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

function TaskDetailClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { user, profile } = useAuth();
  const [task, setTask] = useState(null);
  const [escrow, setEscrow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPrice, setAdminPrice] = useState('');

  useEffect(() => { if (id) loadData(); else setLoading(false); }, [id, user]);

  const loadData = async () => {
    const { data } = await getTask(id);
    setTask(data);
    if (data) {
      const escrowRes = await getEscrowStatus(id);
      setEscrow(escrowRes);
      if (user) { const reviewed = await hasReviewed(id, user.id); setAlreadyReviewed(reviewed); }
    }
    setLoading(false);
  };

  const handleAccept = async (application) => {
    setActionLoading(true);
    const { error } = await acceptApplication(application.id, task.id, application.tasker_id || application.tasker?.id, application.proposed_price);
    setActionLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Tasker accepted!'); loadData();
  };

  const handleConfirm = async () => {
    setActionLoading(true);
    const { error } = await confirmCompletion(task.id);
    setActionLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Task confirmed!'); loadData();
  };

  const handleAdminAssign = async (e) => {
    e.preventDefault();
    if (!adminPhone || !adminPrice) return toast.error('Enter phone and exact price');
    setActionLoading(true);
    const { error } = await manualAssignTask(task.id, adminPhone, parseInt(adminPrice));
    setActionLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Task successfully assigned to Tasker!'); 
    setAdminPhone(''); setAdminPrice('');
    loadData();
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!reviewRating) return toast.error('Select a rating');
    const revieweeId = isClient ? task.assignment?.[0]?.tasker?.id : task.client?.id;
    if (!revieweeId) return;
    setActionLoading(true);
    const { error } = await createReview(task.id, revieweeId, reviewRating, reviewComment);
    setActionLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Review submitted!'); setAlreadyReviewed(true);
  };

  if (loading) return (<><Navbar /><div className="page-container"><div className="page-loading"><LoadingSpinner /></div></div></>);
  if (!id || !task) return (<><Navbar /><div className="page-container"><div className="page-content"><div className="empty-state"><div className="empty-state-icon"><XCircle size={40} /></div><div className="empty-state-title">Task not found</div></div></div></div></>);

  const category = getCategoryById(task.category);
  const isClient = user?.id === task.client_id;
  const assignment = task.assignment?.[0];

  return (
    <><Navbar />
      <div className="page-container"><div className="page-content"><div className="task-detail">
        <div className="task-detail-main">
          <div className="detail-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div className="task-category-badge" style={{ marginBottom: '0.5rem' }}><span>{category?.icon || <ClipboardList size={16} />}</span> {category?.name || task.category}</div>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>{task.title}</h1>
              </div>
              <div className="task-status-badge" style={{ color: task.status === 'open' ? '#22C55E' : '#3B82F6', background: task.status === 'open' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)', fontSize: '0.85rem', padding: '0.3rem 1rem' }}>
                {task.status.replace('_', ' ').toUpperCase()}
              </div>
            </div>
            {task.description && <p style={{ color: 'var(--gray)', lineHeight: 1.7, marginBottom: '1rem' }}>{task.description}</p>}
            <div className="task-card-meta">
              <div className="task-meta-item"><span><IndianRupee size={15} /></span> ₹{task.budget}</div>
              {task.location && <div className="task-meta-item"><span><MapPin size={15} /></span> {task.location}</div>}
              {task.deadline && <div className="task-meta-item"><span><Clock size={15} /></span> {new Date(task.deadline).toLocaleString('en-IN')}</div>}
            </div>
          </div>

          {isClient && task.status === 'completed' && (
            <div className="detail-card" style={{ background: 'rgba(34,197,94,0.04)' }}>
              <h3><CircleCheck size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Confirm Completion?</h3>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '1rem' }}>The tasker marked this done. Confirm to release payment.</p>
              <button className="btn-primary" onClick={handleConfirm} disabled={actionLoading}>{actionLoading ? 'Processing...' : <><ThumbsUp size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Confirm & Pay</>}</button>
            </div>
          )}

          {isClient && task.status === 'open' && task.applications?.length > 0 && (
            <div className="detail-card">
              <h3>Applications ({task.applications.length})</h3>
              {task.applications.map(app => <ApplicationCard key={app.id} application={app} isClient onAccept={handleAccept} />)}
            </div>
          )}

          {profile?.role === 'admin' && task.status === 'open' && (
            <div className="detail-card" style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <h3><UserCheck size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6, color: '#8b5cf6' }} /> Admin Override: Manual Assignment</h3>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '1rem' }}>Enter the WhatsApp Tasker's phone number exactly as registered to forcibly assign this task.</p>
              <form onSubmit={handleAdminAssign} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) auto', gap: '0.8rem', alignItems: 'end' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: '#8b5cf6' }}>Tasker Phone Number</label>
                  <input type="tel" placeholder="+91 XXXXXXXXXX" value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: '#8b5cf6' }}>Agreed Price (₹)</label>
                  <input type="number" min="50" placeholder="e.g. 500" value={adminPrice} onChange={(e) => setAdminPrice(e.target.value)} required />
                </div>
                <button type="submit" className="btn-primary" style={{ background: '#8b5cf6', padding: '0.8rem 1.5rem', height: '42px', display: 'flex', alignItems: 'center' }} disabled={actionLoading}>
                  {actionLoading ? 'Assigning...' : 'Assign'}
                </button>
              </form>
            </div>
          )}

          {user && ['confirmed', 'paid'].includes(task.status) && !alreadyReviewed && (
            <div className="detail-card">
              <h3><Star size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Leave a Review</h3>
              <form onSubmit={handleReview}>
                <div style={{ marginBottom: '1rem' }}><RatingStars rating={reviewRating} interactive onChange={setReviewRating} size="large" /></div>
                <div className="form-group"><textarea placeholder="Share your experience..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} /></div>
                <button type="submit" className="btn-primary" disabled={actionLoading}>{actionLoading ? 'Submitting...' : 'Submit Review'}</button>
              </form>
            </div>
          )}

          {task.reviews?.length > 0 && (
            <div className="detail-card"><h3>Reviews</h3>
              {task.reviews.map(r => (<div key={r.id} style={{ padding: '0.8rem 0' }}><RatingStars rating={r.rating} size="small" />{r.comment && <p style={{ color: 'var(--gray)', fontSize: '0.88rem', marginTop: '0.3rem' }}>{r.comment}</p>}</div>))}
            </div>
          )}
        </div>

        <div className="task-detail-sidebar">
          <div className="detail-card">
            <h3>{isClient ? <><ClipboardList size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Your Task</> : <><User size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Posted by</>}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span className="profile-avatar" style={{ width: 44, height: 44, fontSize: '1.1rem' }}>{task.client?.full_name?.[0]?.toUpperCase() || '?'}</span>
              <div><div style={{ fontWeight: 600 }}>{task.client?.full_name}</div>{task.client?.rating > 0 && <div style={{ fontSize: '0.82rem', color: 'var(--orange)' }}><Star size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> {task.client.rating}</div>}</div>
            </div>
          </div>
          {assignment && (
            <div className="detail-card"><h3><UserCheck size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Assigned Tasker</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span className="application-avatar">{assignment.tasker?.full_name?.[0]?.toUpperCase() || '?'}</span>
                <div><div style={{ fontWeight: 600 }}>{assignment.tasker?.full_name}</div><div style={{ fontSize: '0.82rem', color: 'var(--gray)' }}>₹{assignment.agreed_price} agreed</div></div>
              </div>
            </div>
          )}
          {escrow && <EscrowStatus status={escrow.status} amount={assignment?.agreed_price || task.budget} />}
        </div>
      </div></div></div>
      <Footer />
    </>
  );
}

export default function TaskDetailPage() {
  return (
    <Suspense fallback={<div className="page-loading"><LoadingSpinner /></div>}>
      <TaskDetailClient />
    </Suspense>
  );
}
