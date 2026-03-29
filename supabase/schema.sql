-- =============================================
-- ULFRO Database Schema for Supabase
-- Run this in the Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ PROFILES ============
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  city TEXT,
  role TEXT CHECK (role IN ('client', 'tasker', 'admin')) DEFAULT 'client',
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[], -- array of category IDs the tasker can do
  aadhar_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ TASKS ============
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  budget INTEGER NOT NULL CHECK (budget >= 0),
  location TEXT,
  deadline TIMESTAMPTZ,
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent', 'flexible')),
  status TEXT DEFAULT 'open' CHECK (status IN ('draft', 'open', 'assigned', 'in_progress', 'completed', 'confirmed', 'paid', 'disputed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ TASK APPLICATIONS ============
CREATE TABLE task_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  tasker_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  proposed_price INTEGER NOT NULL CHECK (proposed_price >= 0),
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, tasker_id)
);

-- ============ TASK ASSIGNMENTS ============
CREATE TABLE task_assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tasker_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  agreed_price INTEGER NOT NULL CHECK (agreed_price >= 0),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ ESCROW TRANSACTIONS ============
CREATE TABLE escrow_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  from_user UUID REFERENCES profiles(id) ON DELETE SET NULL,
  to_user UUID REFERENCES profiles(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  type TEXT NOT NULL CHECK (type IN ('escrow_hold', 'payout', 'commission', 'refund')),
  status TEXT NOT NULL CHECK (status IN ('held', 'released', 'completed', 'refunded', 'failed')),
  upi_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ REVIEWS ============
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, reviewer_id)
);

-- ============ NOTIFICATIONS ============
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'info',
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ DISPUTES ============
CREATE TABLE disputes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  raised_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  resolution TEXT,
  admin_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ INDEXES ============
CREATE INDEX idx_tasks_client_id ON tasks(client_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_applications_task ON task_applications(task_id);
CREATE INDEX idx_applications_tasker ON task_applications(tasker_id);
CREATE INDEX idx_assignments_task ON task_assignments(task_id);
CREATE INDEX idx_assignments_tasker ON task_assignments(tasker_id);
CREATE INDEX idx_escrow_task ON escrow_transactions(task_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read) WHERE read = FALSE;
CREATE INDEX idx_disputes_status ON disputes(status);

-- ============ TRIGGER: Auto-create profile on signup ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ ENABLE REALTIME ============
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE task_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE task_assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE escrow_transactions;
