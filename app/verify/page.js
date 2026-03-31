'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { verifyOtp } from '../../lib/auth';
import { KeyRound, CircleCheck } from 'lucide-react';
import toast from 'react-hot-toast';

function VerifyContent() {
    const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const isSignup = searchParams.get('signup') === 'true';
  const role = searchParams.get('role') || '';
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 8 digits entered
    if (newOtp.every(d => d !== '') && value) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    if (pasted.length === 8) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      inputRefs.current[7]?.focus();
      handleVerify(pasted);
    }
  };

  const handleVerify = async (code) => {
    if (!email) return toast.error('Email not found');
    setLoading(true);

    const otpType = isSignup ? 'signup' : 'magiclink';
    const { data, error } = await verifyOtp(email, code, otpType);
    setLoading(false);

    if (error) {
      toast.error(error.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } else {
      toast.success('Verified!');
      if (isSignup) {
        router.push(`/signup/?step=profile&role=${role}`);
      } else {
        router.push('/dashboard/');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <h1><KeyRound size={22} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 8 }} />Enter OTP</h1>
          <p className="auth-subtitle">
            We sent an 8-digit code to<br />
            <strong style={{ color: 'var(--dark)' }}>{email}</strong>
          </p>

          <div className="otp-container" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                className="otp-input"
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>

          <button
            className="form-submit"
            onClick={() => handleVerify(otp.join(''))}
            disabled={loading || otp.some(d => d === '')}
          >
            {loading ? 'Verifying...' : <><CircleCheck size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} /> Verify & Continue</>}
          </button>

          <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--gray)' }}>
            Didn&apos;t receive the code? Check spam or{' '}
            <button
              onClick={() => router.push('/login/')}
              style={{ background: 'none', border: 'none', color: 'var(--orange)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
            >
              try again
            </button>
          </p>
        </div>
      </div>
    </>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="page-loading"><p>Loading...</p></div>}>
      <VerifyContent />
    </Suspense>
  );
}
