-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template_url TEXT NOT NULL,
  text_x INTEGER NOT NULL DEFAULT 0,
  text_y INTEGER NOT NULL DEFAULT 0,
  font_family TEXT DEFAULT 'Roboto',
  font_size INTEGER DEFAULT 50,
  font_color TEXT DEFAULT '000000',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  certificate_uuid UUID UNIQUE DEFAULT gen_random_uuid(),
  cloudinary_url TEXT,
  downloaded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_certificates_email ON certificates(participant_email);
CREATE INDEX IF NOT EXISTS idx_certificates_uuid ON certificates(certificate_uuid);
CREATE INDEX IF NOT EXISTS idx_certificates_event_id ON certificates(event_id);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read certificates" ON certificates;
DROP POLICY IF EXISTS "Anyone can read events" ON events;
DROP POLICY IF EXISTS "Anyone can insert events" ON events;
DROP POLICY IF EXISTS "Anyone can insert certificates" ON certificates;
DROP POLICY IF EXISTS "Anyone can update certificates" ON certificates;

-- Public read access to certificates for verification
CREATE POLICY "Anyone can read certificates" ON certificates
  FOR SELECT USING (true);

-- Public read access to events
CREATE POLICY "Anyone can read events" ON events
  FOR SELECT USING (true);

-- Allow insert for events (for admin operations)
CREATE POLICY "Anyone can insert events" ON events
  FOR INSERT WITH CHECK (true);

-- Allow insert for certificates (for bulk generation)
CREATE POLICY "Anyone can insert certificates" ON certificates
  FOR INSERT WITH CHECK (true);

-- Allow update for certificates (for download tracking)
CREATE POLICY "Anyone can update certificates" ON certificates
  FOR UPDATE USING (true);
