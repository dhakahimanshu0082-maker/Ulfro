import { supabase } from './supabase';

// Apply to a task
export async function applyToTask(taskId, proposedPrice, message) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: 'Not authenticated' } };

  const { data, error } = await supabase
    .from('task_applications')
    .insert({
      task_id: taskId,
      tasker_id: user.id,
      proposed_price: proposedPrice,
      message,
      status: 'pending',
    })
    .select(`
      *,
      tasker:profiles!task_applications_tasker_id_fkey(id, full_name, avatar_url, rating)
    `)
    .single();

  return { data, error };
}

// Get applications for a task (client view)
export async function getTaskApplications(taskId) {
  const { data, error } = await supabase
    .from('task_applications')
    .select(`
      *,
      tasker:profiles!task_applications_tasker_id_fkey(id, full_name, avatar_url, rating, phone, city)
    `)
    .eq('task_id', taskId)
    .order('created_at', { ascending: false });

  return { data, error };
}

// Get my applications (tasker view)
export async function getMyApplications(taskerId) {
  const { data, error } = await supabase
    .from('task_applications')
    .select(`
      *,
      task:tasks(
        id, title, budget, category, location, deadline, status,
        client:profiles!tasks_client_id_fkey(id, full_name, avatar_url, rating)
      )
    `)
    .eq('tasker_id', taskerId)
    .order('created_at', { ascending: false });

  return { data, error };
}

// Accept an application (client action)
export async function acceptApplication(applicationId, taskId, taskerId, agreedPrice) {
  // Start by accepting the application
  const { error: acceptError } = await supabase
    .from('task_applications')
    .update({ status: 'accepted' })
    .eq('id', applicationId);

  if (acceptError) return { data: null, error: acceptError };

  // Reject all other applications for this task
  const { error: rejectError } = await supabase
    .from('task_applications')
    .update({ status: 'rejected' })
    .eq('task_id', taskId)
    .neq('id', applicationId);

  if (rejectError) return { data: null, error: rejectError };

  // Create assignment
  const { data: assignment, error: assignError } = await supabase
    .from('task_assignments')
    .insert({
      task_id: taskId,
      tasker_id: taskerId,
      agreed_price: agreedPrice,
    })
    .select()
    .single();

  if (assignError) return { data: null, error: assignError };

  // Update task status to assigned
  const { error: taskError } = await supabase
    .from('tasks')
    .update({ status: 'assigned', updated_at: new Date().toISOString() })
    .eq('id', taskId);

  if (taskError) return { data: null, error: taskError };

  return { data: assignment, error: null };
}

// Withdraw application (tasker action)
export async function withdrawApplication(applicationId) {
  const { data, error } = await supabase
    .from('task_applications')
    .update({ status: 'withdrawn' })
    .eq('id', applicationId);

  return { data, error };
}

// Check if tasker already applied
export async function hasApplied(taskId, taskerId) {
  const { data, error } = await supabase
    .from('task_applications')
    .select('id, status')
    .eq('task_id', taskId)
    .eq('tasker_id', taskerId)
    .single();

  return { hasApplied: !!data, application: data, error };
}

// Start work on assigned task (tasker action)
export async function startWork(taskId) {
  const { error: assignError } = await supabase
    .from('task_assignments')
    .update({ started_at: new Date().toISOString() })
    .eq('task_id', taskId);

  if (assignError) return { error: assignError };

  const { error: taskError } = await supabase
    .from('tasks')
    .update({ status: 'in_progress', updated_at: new Date().toISOString() })
    .eq('id', taskId);

  return { error: taskError };
}

// Mark task as completed (tasker action)
export async function markComplete(taskId) {
  const { error: assignError } = await supabase
    .from('task_assignments')
    .update({ completed_at: new Date().toISOString() })
    .eq('task_id', taskId);

  if (assignError) return { error: assignError };

  const { error: taskError } = await supabase
    .from('tasks')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', taskId);

  return { error: taskError };
}

// Confirm completion (client action)
export async function confirmCompletion(taskId) {
  const { error } = await supabase
    .from('tasks')
    .update({ status: 'confirmed', updated_at: new Date().toISOString() })
    .eq('id', taskId);

  return { error };
}

// Admin manual assignment via Phone number
export async function manualAssignTask(taskId, taskerPhone, agreedPrice) {
  // 1. Resolve Tasker ID from phone number
  const { data: profiles, error: profileErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('phone', taskerPhone)
    .limit(1);

  if (profileErr) return { error: profileErr };
  if (!profiles || profiles.length === 0) {
    return { error: { message: "Tasker not found with that phone number." } };
  }

  const taskerId = profiles[0].id;

  // 2. Reject existing applications if any exist
  await supabase
    .from('task_applications')
    .update({ status: 'rejected' })
    .eq('task_id', taskId);

  // 3. Create Assignment
  const { data: assignment, error: assignError } = await supabase
    .from('task_assignments')
    .insert({
      task_id: taskId,
      tasker_id: taskerId,
      agreed_price: agreedPrice,
    })
    .select()
    .single();

  if (assignError) return { error: assignError };

  // 4. Update task status to assigned
  const { error: taskError } = await supabase
    .from('tasks')
    .update({ status: 'assigned', updated_at: new Date().toISOString() })
    .eq('id', taskId);

  return { data: assignment, error: taskError };
}
