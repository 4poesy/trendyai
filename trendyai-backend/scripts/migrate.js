import pg from 'pg';

const connectionString = 'postgres://postgres.wtgwxnhnqdnbzpetltrt:Trendtactics123@@aws-1-eu-central-1.pooler.supabase.com:6543/postgres';

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const migrationSQL = `
-- Drop existing tables to start fresh
DROP TABLE IF EXISTS seo_page_metrics CASCADE;
DROP TABLE IF EXISTS seo_pages CASCADE;
DROP TABLE IF EXISTS seo_services CASCADE;

-- Main programmatic SEO pages table
CREATE TABLE seo_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  page_type TEXT NOT NULL, 
  -- 'service-location' | 'service-industry' | 'comparison' | 
  -- 'hire-agency' | 'cost-guide' | 'how-to' | 'tool-page'
  service TEXT NOT NULL,
  location TEXT,
  country TEXT,
  continent TEXT,
  industry TEXT,
  h1 TEXT NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  intro TEXT,
  content JSONB, -- structured sections
  faq JSONB, -- FAQ schema data
  schema_markup JSONB,
  internal_links JSONB,
  cta_headline TEXT,
  cta_subtext TEXT,
  cta_button TEXT,
  search_volume_estimate TEXT, -- 'high|medium|low'
  target_keyword TEXT,
  secondary_keywords JSONB,
  published BOOLEAN DEFAULT false,
  indexed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track page performance
CREATE TABLE seo_page_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  average_position DECIMAL,
  ctr DECIMAL,
  leads_generated INTEGER DEFAULT 0,
  recorded_date DATE DEFAULT CURRENT_DATE
);

-- Service definitions
CREATE TABLE seo_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  starting_price TEXT,
  currency TEXT DEFAULT 'USD',
  deliverables JSONB,
  tools_used JSONB,
  typical_timeline TEXT
);

-- Seed services
INSERT INTO seo_services (slug, name, description, starting_price, typical_timeline, deliverables) VALUES
('web-design', 'Web Design & Development', 
 'Custom websites built for conversion, performance, and global reach', '$800', '2-4 weeks', 
 '["Custom Responsive Design", "Speed & Performance Optimization", "SEO-Friendly Architecture", "CMS Integration (WordPress/Next.js)", "Lead Capture Forms", "1 Month Post-Launch Support"]'),
('mobile-app-development', 'Mobile App Development',
 'iOS and Android apps built with React Native and Flutter', '$2,500', '6-12 weeks',
 '["Cross-Platform iOS & Android App", "UI/UX App Prototyping", "Backend API Integration", "App Store & Play Store Publishing", "Push Notifications Setup", "3 Months Support & Maintenance"]'),
('seo-services', 'SEO Services',
 'Technical and content SEO that drives qualified organic traffic', '$500/month', 'Ongoing',
 '["Comprehensive Technical SEO Audit", "Keyword Research & Strategy", "On-Page Content Optimization", "Monthly Competitor Analysis", "Quality Link Building", "Monthly Search Visibility Reports"]'),
('social-media-management', 'Social Media Management',
 'Full social media strategy, content creation, and community management', '$400/month', 'Ongoing',
 '["Social Media Strategy & Calendar", "15+ Custom Graphic/Video Posts/Month", "Community Management & Moderation", "Targeted Ad Campaign Management", "Monthly Engagement Reports"]'),
('digital-marketing', 'Digital Marketing',
 'Full-funnel digital marketing from strategy to execution', '$800/month', 'Ongoing',
 '["Paid Ad Campaigns (Google & Meta)", "Conversion Rate Optimization (CRO)", "Email Marketing Sequences", "Landing Page Copywriting", "Full Funnel Tracking Setup", "Weekly Analytics Reports"]'),
('branding-design', 'Brand Identity & Graphic Design',
 'Complete brand identity including logo, guidelines, and visual assets', '$600', '1-3 weeks',
 '["Bespoke Logo Design", "Brand Color Palette & Typography Guidelines", "Social Media Templates", "Business Card & Stationery Design", "Brand Guidelines PDF"]'),
('ecommerce-development', 'E-commerce Development',
 'Shopify, WooCommerce, and custom e-commerce solutions', '$1,200', '3-6 weeks',
 '["E-commerce Platform Setup (Shopify/WooCommerce)", "Payment Gateway Integration", "Inventory & Order Management Configuration", "Product Page Copy & Layout Design", "Discount & Promotion Setup"]'),
('ui-ux-design', 'UI/UX Design',
 'User research, wireframes, prototypes, and design systems', '$700', '2-4 weeks',
 '["User Persona & Journey Mapping", "Wireframes & Interactive Prototypes", "Figma Design System", "User Testing & Feedback Analysis", "Developer Handoff Support"]'),
('wordpress-development', 'WordPress Development',
 'Custom WordPress themes, plugins, and CMS solutions', '$500', '1-3 weeks',
 '["Custom WordPress Theme Setup", "Elementor/Gutenberg Custom Blocks", "Speed & Security Hardening", "Essential Plugin Setup", "Easy Content Management Training"]'),
('nextjs-development', 'Next.js Development',
 'High-performance React applications with Next.js', '$1,500', '3-8 weeks',
 '["Next.js Server-Side Rendered (SSR) Frontend", "API Routes & Serverless Functions Setup", "Headless CMS Integration", "TailwindCSS Styling", "Vercel Deployment & SEO Config"]')
ON CONFLICT (slug) DO NOTHING;

-- Indexes for performance
CREATE INDEX idx_seo_pages_slug ON seo_pages(slug);
CREATE INDEX idx_seo_pages_service ON seo_pages(service);
CREATE INDEX idx_seo_pages_location ON seo_pages(location);
CREATE INDEX idx_seo_pages_published ON seo_pages(published);
CREATE INDEX idx_seo_pages_page_type ON seo_pages(page_type);

-- RLS Configuration for Public Access
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON seo_pages;
CREATE POLICY "Enable read access for all users" ON seo_pages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert access for all users" ON seo_pages;
CREATE POLICY "Enable insert access for all users" ON seo_pages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update access for all users" ON seo_pages;
CREATE POLICY "Enable update access for all users" ON seo_pages FOR UPDATE USING (true) WITH CHECK (true);

ALTER TABLE seo_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON seo_services;
CREATE POLICY "Enable read access for all users" ON seo_services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert access for all users" ON seo_services;
CREATE POLICY "Enable insert access for all users" ON seo_services FOR INSERT WITH CHECK (true);
`;

async function run() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Running schema migrations...');
    await client.query(migrationSQL);
    console.log('✅ Migrations completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await client.end();
  }
}

run().catch(console.error);
