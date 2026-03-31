import { supabase } from './supabase';

// Sign up with email OTP
export async function signUpWithEmail(email, metadata = {}) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: metadata,
    },
  });
  return { data, error };
}

// Verify OTP
export async function verifyOtp(email, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'magiclink',
  });
  return { data, error };
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

// Get current session
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

// Get or create user profile
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

// Update user profile (uses upsert to handle both new and existing profiles)
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...updates,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })
    .select();
  return { data: data?.[0] || null, error };
}

// Create profile on first signup
export async function createProfile(userId, profileData) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      ...profileData,
    })
    .select()
    .single();
  return { data, error };
}

// Check if user has completed profile setup
export async function isProfileComplete(userId) {
  const { data, error } = await getProfile(userId);
  if (error || !data) return false;
  return !!(data.full_name && data.phone && data.role && data.city);
}
