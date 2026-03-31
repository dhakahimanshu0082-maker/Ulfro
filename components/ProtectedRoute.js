'use client';

import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

export default function ProtectedRoute({ children, requiredRole = null, redirectTo = '/login/' }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo);
        return;
      }
      // Profile exists but role not set — incomplete signup
      if (profile && !profile.role) {
        router.push('/signup/?step=profile');
        return;
      }
      // No profile at all — redirect to complete signup
      if (user && !profile) {
        router.push('/signup/?step=profile');
        return;
      }
      // Wrong role check (but allow admin to access everything)
      if (requiredRole && profile && profile.role !== requiredRole && profile.role !== 'admin') {
        toast.error(`Access denied. Allowed roles: ${requiredRole}`);
        router.push('/');
        return;
      }
    }
  }, [user, profile, loading, requiredRole, router, redirectTo]);

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner />
        <p>Loading...</p>
      </div>
    );
  }

  // Not logged in — will redirect via useEffect
  if (!user) return null;

  // Profile incomplete — will redirect via useEffect
  if (!profile || !profile.role) return null;

  // Wrong role — will redirect via useEffect
  if (requiredRole && profile.role !== requiredRole && profile.role !== 'admin') {
    return null;
  }

  return children;
}

