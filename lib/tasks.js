import { supabase } from './supabase';

// Create a new task
export async function createTask(taskData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: 'Not authenticated' } };

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...taskData,
      client_id: user.id,
      status: 'open',
    })
    .select(`
      *,
      client:profiles!tasks_client_id_fkey(id, full_name, avatar_url, rating)
    `)
    .single();

  return { data, error };
}

// Get a single task by ID
export async function getTask(taskId) {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      client:profiles!tasks_client_id_fkey(id, full_name, avatar_url, rating, phone, city),
      applications:task_applications(
        id, proposed_price, message, status, created_at,
        tasker:profiles!task_applications_tasker_id_fkey(id, full_name, avatar_url, rating, phone)
      ),
      assignment:task_assignments(
        id, agreed_price, started_at, completed_at,
        tasker:profiles!task_assignments_tasker_id_fkey(id, full_name, avatar_url, rating, phone)
      ),
      reviews(id, rating, comment, reviewer_id, created_at)
    `)
    .eq('id', taskId)
    .single();

  return { data, error };
}

// Get all open tasks (for tasker browsing)
export async function getOpenTasks(filters = {}) {
  let query = supabase
    .from('tasks')
    .select(`
      *,
      client:profiles!tasks_client_id_fkey(id, full_name, avatar_url, rating),
      application_count:task_applications(count)
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.location) {
    query = query.eq('location', filters.location);
  }
  if (filters.minBudget) {
    query = query.gte('budget', filters.minBudget);
  }
  if (filters.maxBudget) {
    query = query.lte('budget', filters.maxBudget);
  }
  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  return { data, error };
}

// Get tasks posted by a client
export async function getClientTasks(clientId, statusFilter = null) {
  let query = supabase
    .from('tasks')
    .select(`
      *,
      applications:task_applications(count),
      assignment:task_assignments(
        tasker:profiles!task_assignments_tasker_id_fkey(id, full_name, avatar_url, rating)
      )
    `)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;
  return { data, error };
}

// Get tasks assigned to a tasker
export async function getTaskerTasks(taskerId, statusFilter = null) {
  let query = supabase
    .from('task_assignments')
    .select(`
      *,
      task:tasks(
        *,
        client:profiles!tasks_client_id_fkey(id, full_name, avatar_url, rating, phone)
      )
    `)
    .eq('tasker_id', taskerId)
    .order('created_at', { ascending: false });

  const { data, error } = await query;

  if (statusFilter && statusFilter !== 'all' && data) {
    return {
      data: data.filter(a => a.task?.status === statusFilter),
      error,
    };
  }

  return { data, error };
}

// Update task status
export async function updateTaskStatus(taskId, status) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .select()
    .single();

  return { data, error };
}

// Update task
export async function updateTask(taskId, updates) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .select()
    .single();

  return { data, error };
}

// Delete a task (only if status is 'open' or 'draft')
export async function deleteTask(taskId) {
  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .in('status', ['open', 'draft']);

  return { data, error };
}

// Search tasks
export async function searchTasks(searchTerm) {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      client:profiles!tasks_client_id_fkey(id, full_name, avatar_url, rating)
    `)
    .eq('status', 'open')
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false })
    .limit(20);

  return { data, error };
}

// Get task statistics for a user
export async function getTaskStats(userId, role) {
  if (role === 'client') {
    const { data, error } = await supabase
      .from('tasks')
      .select('status')
      .eq('client_id', userId);

    if (error) return { stats: null, error };

    const stats = {
      total: data.length,
      open: data.filter(t => t.status === 'open').length,
      assigned: data.filter(t => ['assigned', 'in_progress'].includes(t.status)).length,
      completed: data.filter(t => ['completed', 'confirmed', 'paid'].includes(t.status)).length,
      disputed: data.filter(t => t.status === 'disputed').length,
    };
    return { stats, error: null };
  } else {
    const { data, error } = await supabase
      .from('task_assignments')
      .select('task:tasks(status)')
      .eq('tasker_id', userId);

    if (error) return { stats: null, error };

    const stats = {
      total: data.length,
      active: data.filter(t => ['assigned', 'in_progress'].includes(t.task?.status)).length,
      completed: data.filter(t => ['completed', 'confirmed', 'paid'].includes(t.task?.status)).length,
    };
    return { stats, error: null };
  }
}
