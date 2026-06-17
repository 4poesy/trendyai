-- Create clients table
create table if not exists public.clients (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text,
    email text,
    phone text,
    company text,
    status text default 'active',
    projects integer default 0,
    joined timestamp with time zone default timezone('utc'::text, now()),
    created_by uuid references auth.users(id),
    metadata jsonb
);

-- Create users table (if not using Supabase Auth)
create table if not exists public.users (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text,
    email text unique,
    password_hash text,
    role text default 'user',
    is_active boolean default true,
    last_login timestamp with time zone
);

-- Create projects table
create table if not exists public.projects (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text,
    description text,
    status text default 'draft',
    client_id uuid references public.clients(id),
    assigned_to uuid references auth.users(id),
    due_date timestamp with time zone,
    metadata jsonb
);

-- Create agents table
create table if not exists public.agents (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text unique,
    role text,
    description text,
    capabilities text[],
    is_active boolean default true,
    config jsonb
);

-- Create tasks table
create table if not exists public.tasks (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text,
    description text,
    status text default 'pending',
    priority text default 'medium',
    assigned_to uuid references auth.users(id),
    project_id uuid references public.projects(id),
    client_id uuid references public.clients(id),
    agent_id uuid references public.agents(id),
    due_date timestamp with time zone,
    completed_at timestamp with time zone,
    metadata jsonb
);

-- Create analytics table
create table if not exists public.analytics (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    event_type text,
    user_id uuid references auth.users(id),
    client_id uuid references public.clients(id),
    project_id uuid references public.projects(id),
    data jsonb,
    metadata jsonb
);

-- Set up Row Level Security (RLS)
alter table public.clients enable row level security;
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.agents enable row level security;
alter table public.tasks enable row level security;
alter table public.analytics enable row level security;

-- Create policies for clients table
create policy "Users can view their own clients"
    on public.clients for select
    using (auth.uid() = created_by);

create policy "Users can insert their own clients"
    on public.clients for insert
    with check (auth.uid() = created_by);

create policy "Users can update their own clients"
    on public.clients for update
    using (auth.uid() = created_by);

create policy "Users can delete their own clients"
    on public.clients for delete
    using (auth.uid() = created_by);

-- Create policies for projects table
create policy "Users can view projects they are assigned to"
    on public.projects for select
    using (auth.uid() = assigned_to or exists (
        select 1 from public.clients 
        where public.clients.id = public.projects.client_id 
        and public.clients.created_by = auth.uid()
    ));

create policy "Users can insert projects for their own clients"
    on public.projects for insert
    with check (exists (
        select 1 from public.clients 
        where public.clients.id = public.projects.client_id 
        and public.clients.created_by = auth.uid()
    ));

create policy "Users can update projects they are assigned to"
    on public.projects for update
    using (auth.uid() = assigned_to or exists (
        select 1 from public.clients 
        where public.clients.id = public.projects.client_id 
        and public.clients.created_by = auth.uid()
    ));

create policy "Users can delete projects they are assigned to"
    on public.projects for delete
    using (auth.uid() = assigned_to or exists (
        select 1 from public.clients 
        where public.clients.id = public.projects.client_id 
        and public.clients.created_by = auth.uid()
    ));

-- Create indexes for better performance
create index if not exists idx_clients_created_by on public.clients(created_by);
create index if not exists idx_projects_client_id on public.projects(client_id);
create index if not exists idx_projects_assigned_to on public.projects(assigned_to);
create index if not exists idx_tasks_project_id on public.tasks(project_id);
create index if not exists idx_tasks_assigned_to on public.tasks(assigned_to);
create index if not exists idx_tasks_agent_id on public.tasks(agent_id);
create index if not exists idx_analytics_user_id on public.analytics(user_id);
create index if not exists idx_analytics_client_id on public.analytics(client_id);
create index if not exists idx_analytics_event_type on public.analytics(event_type);

-- Insert sample data
insert into public.agents (name, role, description, capabilities) values
    ('TrendyAI Core', 'Master Orchestrator', 'Central intelligence for decomposing, assigning, and managing all client requests and workflows', ARRAY['intention recognition', 'task decomposition', 'agent assignment']),
    ('ClientFlow', 'Digital Marketing Concierge', 'Central orchestrator for client lifecycle management, lead nurturing, and automated service delivery', ARRAY['lead detection', 'client nurturing', 'service orchestration']),
    ('WebWiz', 'Web Design & Development', 'Creates and develops websites, encompassing wireframing, mockups, coding, and deployment', ARRAY['wireframe generation', 'mockup creation', 'website deployment']),
    ('RankRover', 'SEO Optimization', 'Conducts comprehensive SEO audits, keyword research, and monitors search performance', ARRAY['SEO auditing', 'keyword research', 'ranking monitoring']),
    ('AdGenie', 'Ad Copywriter & Campaign Manager', 'Writes engaging ad copy and manages digital advertising campaigns', ARRAY['ad copy generation', 'campaign setup', 'performance monitoring']);