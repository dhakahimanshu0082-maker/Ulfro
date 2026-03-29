import { supabase } from './supabase';

// Create a notification
export async function createNotification(userId, title, body, type = 'info', link = '') {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      body,
      type,
      link,
      read: false,
    })
    .select()
    .single();

  return { data, error };
}

// Get user notifications
export async function getNotifications(userId, limit = 50) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data, error };
}

// Mark notification as read
export async function markAsRead(notificationId) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  return { error };
}

// Mark all notifications as read
export async function markAllAsRead(userId) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);

  return { error };
}

// Get unread count
export async function getUnreadCount(userId) {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);

  return { count: count || 0, error };
}

// Delete old notifications (older than 30 days)
export async function cleanupNotifications(userId) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', userId)
    .eq('read', true)
    .lt('created_at', thirtyDaysAgo.toISOString());

  return { error };
}

// Notification type icon keys (mapped to Lucide icons in NotificationItem)
export const NOTIFICATION_TYPES = {
  task_posted: 'task_posted',
  application_received: 'application_received',
  application_accepted: 'application_accepted',
  application_rejected: 'application_rejected',
  task_started: 'task_started',
  task_completed: 'task_completed',
  payment_received: 'payment_received',
  payment_held: 'payment_held',
  review_received: 'review_received',
  dispute_opened: 'dispute_opened',
  dispute_resolved: 'dispute_resolved',
  info: 'info',
  warning: 'warning',
};
