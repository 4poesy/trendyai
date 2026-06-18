-- Agent task tracking
CREATE TABLE IF NOT EXISTS agent_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent TEXT NOT NULL,
  message TEXT,
  client_id UUID REFERENCES clients(id),
  task_type TEXT,
  status TEXT DEFAULT 'pending', -- pending|running|completed|failed|awaiting_approval
  output JSONB,
  feedback TEXT,
  feedback_type TEXT, -- too_generic|hallucination|wrong_tone|perfect|incomplete
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Approval queue (tasks awaiting human review)
CREATE TABLE IF NOT EXISTS approval_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES agent_tasks(id),
  agent TEXT NOT NULL,
  client_id UUID REFERENCES clients(id), -- added reference constraint for safety
  output_summary TEXT,
  output_full JSONB,
  status TEXT DEFAULT 'pending', -- pending|approved|rejected|revision_requested
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Published content log
CREATE TABLE IF NOT EXISTS published_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES agent_tasks(id),
  client_id UUID REFERENCES clients(id),
  platform TEXT, -- instagram|facebook|linkedin|twitter|youtube|email
  content_type TEXT,
  content_text TEXT,
  media_url TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  performance_data JSONB
);

-- Agent performance tracking
CREATE TABLE IF NOT EXISTS agent_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent TEXT NOT NULL,
  task_id UUID REFERENCES agent_tasks(id), -- added reference constraint for safety
  model_used TEXT,
  response_time_ms INTEGER,
  feedback_score INTEGER, -- 1-10
  success BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE published_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;

-- Enable public select policies for these tables (consistent with other tables in initial_schema)
CREATE POLICY "Enable read access for all users" ON agent_tasks FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON agent_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON agent_tasks FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON approval_queue FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON approval_queue FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON approval_queue FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON published_content FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON published_content FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON agent_metrics FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON agent_metrics FOR INSERT WITH CHECK (true);
