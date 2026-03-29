import { supabase } from './supabase';

// Create escrow hold (admin confirms UPI payment received)
export async function createEscrowHold(taskId, clientId, amount, upiRef = '') {
  const { data, error } = await supabase
    .from('escrow_transactions')
    .insert({
      task_id: taskId,
      from_user: clientId,
      to_user: null, // held by platform
      amount,
      type: 'escrow_hold',
      status: 'held',
      upi_ref: upiRef,
    })
    .select()
    .single();

  return { data, error };
}

// Release escrow to tasker (after client confirms completion)
export async function releaseEscrow(taskId, taskerId, totalAmount) {
  const commission = Math.round(totalAmount * 0.15); // 15% commission
  const taskerAmount = totalAmount - commission;

  // Record payout to tasker
  const { data: payout, error: payoutError } = await supabase
    .from('escrow_transactions')
    .insert({
      task_id: taskId,
      from_user: null, // from platform
      to_user: taskerId,
      amount: taskerAmount,
      type: 'payout',
      status: 'released',
    })
    .select()
    .single();

  if (payoutError) return { data: null, error: payoutError };

  // Record commission
  const { error: commError } = await supabase
    .from('escrow_transactions')
    .insert({
      task_id: taskId,
      from_user: null,
      to_user: null,
      amount: commission,
      type: 'commission',
      status: 'completed',
    });

  if (commError) return { data: null, error: commError };

  // Update task status to paid
  const { error: taskError } = await supabase
    .from('tasks')
    .update({ status: 'paid', updated_at: new Date().toISOString() })
    .eq('id', taskId);

  return { data: payout, error: taskError };
}

// Refund escrow to client
export async function refundEscrow(taskId, clientId, amount) {
  const { data, error } = await supabase
    .from('escrow_transactions')
    .insert({
      task_id: taskId,
      from_user: null,
      to_user: clientId,
      amount,
      type: 'refund',
      status: 'refunded',
    })
    .select()
    .single();

  return { data, error };
}

// Get escrow status for a task
export async function getEscrowStatus(taskId) {
  const { data, error } = await supabase
    .from('escrow_transactions')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true });

  if (error) return { status: null, transactions: null, error };

  const held = data.find(t => t.type === 'escrow_hold' && t.status === 'held');
  const released = data.find(t => t.type === 'payout' && t.status === 'released');
  const refunded = data.find(t => t.type === 'refund');

  let status = 'no_payment';
  if (refunded) status = 'refunded';
  else if (released) status = 'paid';
  else if (held) status = 'in_escrow';

  return { status, transactions: data, error: null };
}

// Get payment history for a user
export async function getPaymentHistory(userId) {
  const { data, error } = await supabase
    .from('escrow_transactions')
    .select(`
      *,
      task:tasks(id, title, category)
    `)
    .or(`from_user.eq.${userId},to_user.eq.${userId}`)
    .order('created_at', { ascending: false });

  return { data, error };
}

// Get total earnings for a tasker
export async function getTaskerEarnings(taskerId) {
  const { data, error } = await supabase
    .from('escrow_transactions')
    .select('amount')
    .eq('to_user', taskerId)
    .eq('type', 'payout')
    .eq('status', 'released');

  if (error) return { total: 0, error };

  const total = data.reduce((sum, t) => sum + t.amount, 0);
  return { total, count: data.length, error: null };
}

// Get platform revenue (admin)
export async function getPlatformRevenue() {
  const { data, error } = await supabase
    .from('escrow_transactions')
    .select('amount')
    .eq('type', 'commission')
    .eq('status', 'completed');

  if (error) return { total: 0, error };

  const total = data.reduce((sum, t) => sum + t.amount, 0);
  return { total, count: data.length, error: null };
}

// Get all pending payments (admin)
export async function getPendingPayments() {
  const { data, error } = await supabase
    .from('escrow_transactions')
    .select(`
      *,
      task:tasks(id, title, category, status,
        client:profiles!tasks_client_id_fkey(id, full_name, phone)
      )
    `)
    .eq('type', 'escrow_hold')
    .eq('status', 'held')
    .order('created_at', { ascending: false });

  return { data, error };
}
