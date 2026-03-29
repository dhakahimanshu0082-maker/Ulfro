'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getUnreadCount } from '../lib/notifications';
import useAuth from './useAuth';

export function useNotifications() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshCount = useCallback(async () => {
    if (user) {
      const { count } = await getUnreadCount(user.id);
      setUnreadCount(count);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    refreshCount();

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications-count')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          setUnreadCount((prev) => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          refreshCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refreshCount]);

  return { unreadCount, refreshCount };
}

export default useNotifications;
