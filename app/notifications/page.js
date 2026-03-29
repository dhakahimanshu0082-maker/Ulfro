'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/ProtectedRoute';
import NotificationItem from '../../components/NotificationItem';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { getNotifications, markAsRead, markAllAsRead } from '../../lib/notifications';
import { useNotifications } from '../../hooks/useNotifications';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { refreshCount } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) load(); }, [user]);
  const load = async () => { const { data } = await getNotifications(user.id); setNotifications(data || []); setLoading(false); };

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    refreshCount();
  };

  const handleMarkAll = async () => {
    await markAllAsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    refreshCount();
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="page-container"><div className="page-content" style={{ maxWidth: 700 }}>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><h1>Notifications 🔔</h1></div>
          {notifications.some(n => !n.read) && <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.82rem' }} onClick={handleMarkAll}>Mark all read</button>}
        </div>
        {loading ? <div className="page-loading"><LoadingSpinner /></div> : notifications.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🔕</div><div className="empty-state-title">No notifications</div><div className="empty-state-desc">We&apos;ll notify you when something happens</div></div>
        ) : (
          <div className="detail-card" style={{ padding: '0.5rem' }}>
            {notifications.map(n => <NotificationItem key={n.id} notification={n} onMarkRead={handleMarkRead} />)}
          </div>
        )}
      </div></div>
      <Footer />
    </ProtectedRoute>
  );
}
