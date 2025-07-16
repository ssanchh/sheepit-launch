-- Create MVP proposals table
CREATE TABLE mvp_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  idea TEXT NOT NULL,
  features TEXT NOT NULL,
  timeline TEXT NOT NULL CHECK (timeline IN ('urgent', 'flexible')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Enable RLS
ALTER TABLE mvp_proposals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow anyone to insert a proposal (public submission)
CREATE POLICY "Anyone can submit MVP proposals" ON mvp_proposals
  FOR INSERT WITH CHECK (true);

-- Only admins can view and update proposals
CREATE POLICY "Only admins can view MVP proposals" ON mvp_proposals
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM users WHERE is_admin = true
    )
  );

CREATE POLICY "Only admins can update MVP proposals" ON mvp_proposals
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM users WHERE is_admin = true
    )
  );

-- Create indexes
CREATE INDEX idx_mvp_proposals_email ON mvp_proposals(email);
CREATE INDEX idx_mvp_proposals_status ON mvp_proposals(status);
CREATE INDEX idx_mvp_proposals_created_at ON mvp_proposals(created_at DESC);