-- =============================================
-- Row Level Security Policies for ULFRO
-- Run this AFTER schema.sql in Supabase SQL Editor
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- ============ PROFILES ============
CREATE POLICY "Anyone can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============ TASKS ============
CREATE POLICY "Anyone can view open tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create tasks" ON tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Task owners can update their tasks" ON tasks FOR UPDATE USING (auth.uid() = client_id);
CREATE POLICY "Task owners can delete draft/open tasks" ON tasks FOR DELETE USING (auth.uid() = client_id AND status IN ('draft', 'open'));

-- ============ TASK APPLICATIONS ============
CREATE POLICY "Task owner and applicant can view applications" ON task_applications FOR SELECT USING (
  auth.uid() = tasker_id OR
  auth.uid() IN (SELECT client_id FROM tasks WHERE id = task_id)
);
CREATE POLICY "Taskers can apply" ON task_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = tasker_id);
CREATE POLICY "Involved users can update applications" ON task_applications FOR UPDATE USING (
  auth.uid() = tasker_id OR
  auth.uid() IN (SELECT client_id FROM tasks WHERE id = task_id)
);

-- ============ TASK ASSIGNMENTS ============
CREATE POLICY "Involved users can view assignments" ON task_assignments FOR SELECT USING (
  auth.uid() = tasker_id OR
  auth.uid() IN (SELECT client_id FROM tasks WHERE id = task_id)
);
CREATE POLICY "Task owner can create assignments" ON task_assignments FOR INSERT TO authenticated WITH CHECK (
  auth.uid() IN (SELECT client_id FROM tasks WHERE id = task_id)
);
CREATE POLICY "Involved users can update assignments" ON task_assignments FOR UPDATE USING (
  auth.uid() = tasker_id OR
  auth.uid() IN (SELECT client_id FROM tasks WHERE id = task_id)
);

-- ============ ESCROW TRANSACTIONS ============
CREATE POLICY "Involved users can view escrow" ON escrow_transactions FOR SELECT USING (
  auth.uid() = from_user OR auth.uid() = to_user OR
  auth.uid() IN (SELECT client_id FROM tasks WHERE id = task_id)
);
-- Note: Escrow creation should ideally be done through a server-side function
-- For MVP, allow authenticated users
CREATE POLICY "Authenticated can create escrow" ON escrow_transactions FOR INSERT TO authenticated WITH CHECK (true);

-- ============ REVIEWS ============
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = reviewer_id);

-- ============ NOTIFICATIONS ============
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated can create notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- ============ DISPUTES ============
CREATE POLICY "Involved users can view disputes" ON disputes FOR SELECT USING (
  auth.uid() = raised_by OR
  auth.uid() IN (SELECT client_id FROM tasks WHERE id = task_id)
);
CREATE POLICY "Authenticated can create disputes" ON disputes FOR INSERT TO authenticated WITH CHECK (auth.uid() = raised_by);
CREATE POLICY "Admin can update disputes" ON disputes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============ ADMIN OVERRIDE POLICIES ============
-- Admins can see everything
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can view all escrow" ON escrow_transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage escrow" ON escrow_transactions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can view all tasks" ON tasks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
