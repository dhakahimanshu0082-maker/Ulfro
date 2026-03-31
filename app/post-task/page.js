'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/ProtectedRoute';
import CategoryPicker from '../../components/CategoryPicker';
import { useAuth } from '../../hooks/useAuth';
import { createTask } from '../../lib/tasks';
import { DELHI_AREAS } from '../../lib/categories';
import { ClipboardList, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PostTaskPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: '', budget: '',
    location: '', deadline: '', urgency: 'normal',
  });

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.budget) {
      return toast.error('Please fill required fields');
    }
    setLoading(true);
    const { data, error } = await createTask({
      title: form.title,
      description: form.description,
      category: form.category,
      budget: parseInt(form.budget),
      location: form.location,
      deadline: form.deadline || null,
      urgency: form.urgency,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Task posted!');
    router.push(`/task/?id=${data.id}`);
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="page-container">
        <div className="page-content" style={{ maxWidth: 700 }}>
          <div className="page-header">
            <h1><ClipboardList size={24} style={{ display: 'inline', verticalAlign: '-4px', marginRight: 8 }} /> Post a New Task</h1>
            <p>Describe your task and let taskers come to you</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="detail-card" style={{ marginBottom: '1rem' }}>
              <h3>Task Details</h3>
              <div className="form-group">
                <label htmlFor="task-title">Task Title *</label>
                <input id="task-title" type="text" placeholder="e.g., Need grocery delivery from D-Mart" value={form.title} onChange={(e) => handleChange('title', e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="task-desc">Description</label>
                <textarea id="task-desc" placeholder="Describe what needs to be done, any special instructions..." value={form.description} onChange={(e) => handleChange('description', e.target.value)} style={{ height: 120 }} />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <CategoryPicker selected={form.category} onChange={(val) => handleChange('category', val)} singleSelect />
              </div>
            </div>
            <div className="detail-card" style={{ marginBottom: '1rem' }}>
              <h3>Budget & Location</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="task-budget">Budget (₹) *</label>
                  <input id="task-budget" type="number" min="50" placeholder="e.g., 200" value={form.budget} onChange={(e) => handleChange('budget', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="task-location">Location</label>
                  <select id="task-location" value={form.location} onChange={(e) => handleChange('location', e.target.value)}>
                    <option value="">Select area</option>
                    {DELHI_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="task-deadline">Deadline</label>
                  <input id="task-deadline" type="datetime-local" value={form.deadline} onChange={(e) => handleChange('deadline', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="task-urgency">Urgency</label>
                  <select id="task-urgency" value={form.urgency} onChange={(e) => handleChange('urgency', e.target.value)}>
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent (within hours)</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>
            </div>
            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? 'Posting...' : <><Send size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Post Task Now</>}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </ProtectedRoute>
  );
}
