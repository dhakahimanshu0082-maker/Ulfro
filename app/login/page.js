'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { signUpWithEmail } from '../../lib/auth';
import { Send, CircleCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);

    const { error } = await signUpWithEmail(email);
    setLoading(false);

    if (error) {
      toast.error(error.message || 'Something went wrong');
    } else {
      setSent(true);
      toast.success('OTP sent to your email!');
      setTimeout(() => {
        router.push(`/verify/?email=${encodeURIComponent(email)}`);
      }, 1000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Log in to your Ulfro account</p>

          {sent ? (
            <div className="auth-success">
              <CircleCheck size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> OTP sent to <strong>{email}</strong>! Check your inbox.
            </div>
          ) : (
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
              <button type="submit" className="form-submit" disabled={loading}>
                {loading ? 'Sending OTP...' : <><Send size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Send Login OTP</>}
              </button>
            </form>
          )}

          <div className="auth-footer">
            Don&apos;t have an account? <Link href="/signup/">Sign Up</Link>
          </div>
        </div>
      </div>
    </>
  );
}
