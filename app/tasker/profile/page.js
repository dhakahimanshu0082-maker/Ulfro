'use client';
import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProtectedRoute from '../../../components/ProtectedRoute';
import CategoryPicker from '../../../components/CategoryPicker';
import { useAuth } from '../../../hooks/useAuth';
import { updateProfile } from '../../../lib/auth';
import { DELHI_AREAS } from '../../../lib/categories';
import { User, CircleCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TaskerProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name: profile?.full_name || '', phone: profile?.phone || '', city: profile?.city || '', bio: profile?.bio || '', skills: profile?.skills || [] });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const { error } = await updateProfile(profile.id, form);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Profile updated!'); await refreshProfile();
  };

  return (
    <ProtectedRoute requiredRole="tasker">
      <Navbar />
      <div className="page-container"><div className="page-content" style={{ maxWidth: 600 }}>
        <div className="page-header"><h1><User size={24} style={{ display: 'inline', verticalAlign: '-4px', marginRight: 8 }} /> My Profile</h1></div>
        <form onSubmit={handleSubmit}>
          <div className="detail-card" style={{ marginBottom: '1rem' }}>
            <h3>Personal Info</h3>
            <div className="form-group"><label>Full Name</label><input type="text" value={form.full_name} onChange={(e) => setForm(p => ({ ...p, full_name: e.target.value }))} /></div>
            <div className="form-group"><label>Phone</label><input type="tel" value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
            <div className="form-group"><label>Area</label><select value={form.city} onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))}><option value="">Select</option>{DELHI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
            <div className="form-group"><label>Bio</label><textarea placeholder="Tell clients about yourself..." value={form.bio} onChange={(e) => setForm(p => ({ ...p, bio: e.target.value }))} /></div>
          </div>
          <div className="detail-card" style={{ marginBottom: '1rem' }}>
            <h3>Skills & Categories</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '1rem' }}>Select the categories you can work in</p>
            <CategoryPicker selected={form.skills} onChange={(val) => setForm(p => ({ ...p, skills: val }))} maxSelect={15} />
          </div>
          <button type="submit" className="form-submit" disabled={loading}>{loading ? 'Saving...' : <><CircleCheck size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Save Profile</>}</button>
        </form>
      </div></div>
      <Footer />
    </ProtectedRoute>
  );
}
