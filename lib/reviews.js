import { supabase } from './supabase';

// Create a review
export async function createReview(taskId, revieweeId, rating, comment) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: 'Not authenticated' } };

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      task_id: taskId,
      reviewer_id: user.id,
      reviewee_id: revieweeId,
      rating,
      comment,
    })
    .select()
    .single();

  if (!error) {
    // Update the reviewee's average rating
    await updateUserRating(revieweeId);
  }

  return { data, error };
}

// Update user's average rating
async function updateUserRating(userId) {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('reviewee_id', userId);

  if (reviews && reviews.length > 0) {
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await supabase
      .from('profiles')
      .update({
        rating: Math.round(avg * 10) / 10,
        review_count: reviews.length,
      })
      .eq('id', userId);
  }
}

// Get reviews for a user
export async function getUserReviews(userId) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:profiles!reviews_reviewer_id_fkey(id, full_name, avatar_url),
      task:tasks(id, title, category)
    `)
    .eq('reviewee_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

// Check if already reviewed
export async function hasReviewed(taskId, reviewerId) {
  const { data } = await supabase
    .from('reviews')
    .select('id')
    .eq('task_id', taskId)
    .eq('reviewer_id', reviewerId)
    .single();

  return !!data;
}

// Get review stats for a user
export async function getReviewStats(userId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('reviewee_id', userId);

  if (error || !data || data.length === 0) {
    return { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  }

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  data.forEach(r => {
    distribution[r.rating] = (distribution[r.rating] || 0) + 1;
  });

  const average = data.reduce((sum, r) => sum + r.rating, 0) / data.length;

  return {
    average: Math.round(average * 10) / 10,
    count: data.length,
    distribution,
  };
}
