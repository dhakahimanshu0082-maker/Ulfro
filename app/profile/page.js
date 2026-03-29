'use client';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/ProtectedRoute';
import RatingStars from '../../components/RatingStars';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../lib/auth';
import { DELHI_AREAS } from '../../lib/categories';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: profile?.full_name || '', phone: profile?.phone || '', city: profile?.city || '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);
    const { error } = await updateProfile(profile.id, form);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Profile updated!'); await refreshProfile(); setEditing(false);
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="page-container"><div className="page-content" style={{ maxWidth: 600 }}>
        <div className="page-header"><h1>My Profile</h1></div>
        <div className="detail-card" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div className="profile-avatar" style={{ width: 80, height: 80, fontSize: '2rem', margin: '0 auto 1rem' }}>{profile?.full_name?.[0]?.toUpperCase() || '?'}</div>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 800 }}>{profile?.full_name}</h2>
          <p style={{ color: 'var(--gray)', fontSize: '0.9rem', textTransform: 'capitalize' }}>{profile?.role || 'User'}</p>
          {profile?.rating > 0 && <RatingStars rating={profile.rating} />}
          <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginTop: '0.3rem' }}>{profile?.review_count || 0} reviews</p>
        </div>
        {editing ? (
          <form onSubmit={handleSave}>
            <div className="detail-card">
              <div className="form-group"><label>Full Name</label><input type="text" value={form.full_name} onChange={(e) => setForm(p => ({ ...p, full_name: e.target.value }))} /></div>
              <div className="form-group"><label>Phone</label><input type="tel" value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
              <div className="form-group"><label>Area</label><select value={form.city} onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))}><option value="">Select</option>{DELHI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          </form>
        ) : (
          <div className="detail-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div><strong>📧 Email:</strong> {profile?.email}</div>
              <div><strong>📱 Phone:</strong> {profile?.phone || 'Not set'}</div>
              <div><strong>📍 Location:</strong> {profile?.city || 'Not set'}</div>
              <div><strong>🎭 Role:</strong> <span style={{ textTransform: 'capitalize' }}>{profile?.role}</span></div>
            </div>
            <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setEditing(true)}>✏️ Edit Profile</button>
          </div>
        )}
      </div></div>
      <Footer />
    </ProtectedRoute>
  );
}
