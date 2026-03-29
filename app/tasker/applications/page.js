'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProtectedRoute from '../../../components/ProtectedRoute';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useAuth } from '../../../hooks/useAuth';
import { getMyApplications } from '../../../lib/applications';
import { getCategoryById } from '../../../lib/categories';
import { FileText, Inbox, MapPin, CircleCheck, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TaskerApplicationsPage() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) load(); }, [user]);
  const load = async () => { const { data } = await getMyApplications(user.id); setApps(data || []); setLoading(false); };

  return (
    <ProtectedRoute requiredRole="tasker">
      <Navbar />
      <div className="page-container"><div className="page-content">
        <div className="page-header"><h1><FileText size={24} style={{ display: 'inline', verticalAlign: '-4px', marginRight: 8 }} /> My Applications</h1><p>Track all your task applications</p></div>
        {loading ? <div className="page-loading"><LoadingSpinner /></div> : apps.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon"><Inbox size={40} /></div><div className="empty-state-title">No applications yet</div><div className="empty-state-desc">Browse tasks and apply!</div><Link href="/tasker/browse/" className="btn-primary">Browse Tasks</Link></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {apps.map(app => {
              const cat = getCategoryById(app.task?.category);
              return (
                <Link key={app.id} href={`/tasker/task/?id=${app.task?.id}`} style={{ textDecoration: 'none' }}>
                  <div className="application-card">
                    <div className="application-card-header">
                      <div><div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>{cat?.icon} {app.task?.title}</div><div style={{ fontSize: '0.82rem', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {app.task?.location || 'Delhi'} · Budget: ₹{app.task?.budget}</div></div>
                      <div className="application-price"><span className="application-price-label">Your price</span><span className="application-price-amount">₹{app.proposed_price}</span></div>
                    </div>
                    <div className="application-card-footer">
                      <span className="application-time">{new Date(app.created_at).toLocaleDateString('en-IN')}</span>
                      <span className={`application-status-badge status-${app.status}`}>{app.status === 'accepted' ? <><CircleCheck size={13} style={{ verticalAlign: '-2px' }} /> Accepted</> : app.status === 'rejected' ? <><XCircle size={13} style={{ verticalAlign: '-2px' }} /> Rejected</> : app.status === 'pending' ? <><Clock size={13} style={{ verticalAlign: '-2px' }} /> Pending</> : app.status}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div></div>
      <Footer />
    </ProtectedRoute>
  );
}
