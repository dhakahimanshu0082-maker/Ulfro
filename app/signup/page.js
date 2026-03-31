'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { signUpWithPassword, updateProfile } from '../../lib/auth';
import { useAuth } from '../../hooks/useAuth';
import { ClipboardList, Wallet, Send, CircleCheck, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DELHI_AREAS } from '../../lib/categories';

function SignupContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || '';
  const stepParam = searchParams.get('step') || '';

  const { user, refreshProfile } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(stepParam === 'profile' && user ? 2 : 1);
  const [loading, setLoading] = useState(false);

  // Step 1: Account
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2: Profile
  const [role, setRole] = useState(initialRole);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Enter your email and password');
    setLoading(true);
    const { error } = await signUpWithPassword(email, password);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Account created!');
    setStep(2);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!role) return toast.error('Choose a role');
    if (!fullName || !phone || !city) return toast.error('Fill all fields');
    setLoading(true);

    const { error } = await updateProfile(user.id, {
      full_name: fullName,
      phone,
      city,
      role,
      email: user.email,
    });
    setLoading(false);

    if (error) {
      return toast.error(error.message);
    } else {
      toast.success('Profile created successfully!');
    }

    await refreshProfile();
    router.push(role === 'tasker' ? '/tasker/dashboard/' : '/dashboard/');
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          {step === 1 && !user && (
            <>
              <h1>Join Ulfro</h1>
              <p className="auth-subtitle">Start getting tasks done or earning money</p>

              {/* Role Selection */}
              <div className="role-cards">
                <div
                  className={`role-card ${role === 'client' ? 'role-selected' : ''}`}
                  onClick={() => setRole('client')}
                >
                  <span className="role-card-icon"><ClipboardList size={28} /></span>
                  <div className="role-card-title">I Need Help</div>
                  <div className="role-card-desc">Post tasks and get them done</div>
                </div>
                <div
                  className={`role-card ${role === 'tasker' ? 'role-selected' : ''}`}
                  onClick={() => setRole('tasker')}
                >
                  <span className="role-card-icon"><Wallet size={28} /></span>
                  <div className="role-card-title">I Want to Earn</div>
                  <div className="role-card-desc">Complete tasks and earn money</div>
                </div>
              </div>

              <form onSubmit={handleSignup}>
                <div className="form-group">
                  <label htmlFor="signup-email">Email Address</label>
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-password">Password</label>
                  <input
                    id="signup-password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="form-submit" disabled={loading || !role}>
                  {loading ? 'Creating account...' : <><CircleCheck size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Create Account</>}
                </button>
              </form>

              <div className="auth-footer">
                Already have an account? <Link href="/login/">Log In</Link>
              </div>
            </>
          )}

          {(step === 2 || user) && (
            <>
              <h1><Sparkles size={22} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Complete Your Profile</h1>
              <p className="auth-subtitle">Tell us a bit about yourself</p>

              <form onSubmit={handleProfileSubmit}>
                {!role && (
                  <div className="role-cards" style={{ marginBottom: '1rem' }}>
                    <div className={`role-card ${role === 'client' ? 'role-selected' : ''}`} onClick={() => setRole('client')}>
                      <span className="role-card-icon"><ClipboardList size={24} /></span>
                      <div className="role-card-title">Client</div>
                    </div>
                    <div className={`role-card ${role === 'tasker' ? 'role-selected' : ''}`} onClick={() => setRole('tasker')}>
                      <span className="role-card-icon"><Wallet size={24} /></span>
                      <div className="role-card-title">Tasker</div>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="full-name">Full Name</label>
                  <input id="full-name" type="text" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="city">Area / Location</label>
                  <select id="city" value={city} onChange={(e) => setCity(e.target.value)} required>
                    <option value="">Select your area</option>
                    {DELHI_AREAS.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="form-submit" disabled={loading}>
                  {loading ? 'Saving...' : <><CircleCheck size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Complete Signup</>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="page-loading"><LoadingSpinner /></div>}>
      <SignupContent />
    </Suspense>
  );
}
