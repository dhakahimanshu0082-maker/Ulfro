'use client';

import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, requiredRole = null, redirectTo = '/login/' }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo);
        return;
      }
      if (requiredRole && profile && profile.role !== requiredRole && profile.role !== 'admin') {
        router.push('/');
        return;
      }
      if (user && !profile) {
        // Profile not created yet — redirect to complete signup
        router.push('/signup/?step=profile');
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

  if (!user || (requiredRole && profile?.role !== requiredRole && profile?.role !== 'admin')) {
    return null;
  }

  return children;
}
