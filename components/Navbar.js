'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';

export default function Navbar() {
  const { user, profile, signOut, loading } = useAuth();
  const { unreadCount } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const dashboardLink = profile?.role === 'tasker' ? '/tasker/dashboard/' : '/dashboard/';

  return (
    <nav>
      <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
        UL<span>FRO</span>
      </Link>

      <ul className={`nav-links ${menuOpen ? 'nav-links-mobile' : ''}`}>
        <li><Link href="/#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link></li>
        <li><Link href="/#categories" onClick={() => setMenuOpen(false)}>Categories</Link></li>
        <li><Link href="/#safety" onClick={() => setMenuOpen(false)}>Safety</Link></li>
        <li><Link href="/#earn" onClick={() => setMenuOpen(false)}>Earn Money</Link></li>

        {!loading && !user && (
          <>
            <li><Link href="/login/" onClick={() => setMenuOpen(false)}>Login</Link></li>
            <li>
              <Link href="/signup/" className="nav-cta" onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </li>
          </>
        )}

        {!loading && user && (
          <>
            <li style={{ position: 'relative' }}>
              <Link href="/notifications/" onClick={() => setMenuOpen(false)} style={{ position: 'relative' }}>
                🔔
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </Link>
            </li>
            <li style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="profile-btn"
              >
                <span className="profile-avatar">
                  {profile?.full_name ? profile.full_name[0].toUpperCase() : '👤'}
                </span>
                <span className="profile-name">{profile?.full_name || 'Profile'}</span>
                <span style={{ fontSize: '0.6rem' }}>▼</span>
              </button>

              {profileDropdown && (
                <div className="profile-dropdown">
                  <Link href={dashboardLink} onClick={() => { setProfileDropdown(false); setMenuOpen(false); }}>
                    📊 Dashboard
                  </Link>
                  {profile?.role === 'client' && (
                    <Link href="/post-task/" onClick={() => { setProfileDropdown(false); setMenuOpen(false); }}>
                      📋 Post a Task
                    </Link>
                  )}
                  {profile?.role === 'tasker' && (
                    <Link href="/tasker/browse/" onClick={() => { setProfileDropdown(false); setMenuOpen(false); }}>
                      🔍 Browse Tasks
                    </Link>
                  )}
                  <Link href="/profile/" onClick={() => { setProfileDropdown(false); setMenuOpen(false); }}>
                    👤 My Profile
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link href="/admin/" onClick={() => { setProfileDropdown(false); setMenuOpen(false); }}>
                      ⚙️ Admin Panel
                    </Link>
                  )}
                  <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0.3rem 0' }} />
                  <button
                    onClick={async () => {
                      await signOut();
                      setProfileDropdown(false);
                      setMenuOpen(false);
                      window.location.href = '/';
                    }}
                    className="dropdown-signout"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </li>
          </>
        )}
      </ul>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span><span></span><span></span>
      </button>
    </nav>
  );
}
