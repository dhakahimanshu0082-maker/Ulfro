'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { signInWithPassword } from '../../lib/auth';
import { Send, CircleCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return toast.error('Please enter your password');
    setLoading(true);

    const { error } = await signInWithPassword(email, password);
    setLoading(false);

    if (error) {
      toast.error(error.message || 'Invalid login credentials');
    } else {
      toast.success('Logged in successfully!');
      router.push('/dashboard/');
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Log in to your Ulfro account</p>

          <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="form-submit" disabled={loading}>
                {loading ? 'Logging in...' : <><CircleCheck size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Log In</>}
              </button>
            </form>


          <div className="auth-footer">
            Don&apos;t have an account? <Link href="/signup/">Sign Up</Link>
          </div>
        </div>
      </div>
    </>
  );
}
