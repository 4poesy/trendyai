# Supabase Integration Guide for TrendyAI

This document explains how to integrate Supabase with the TrendyAI backend to create a unified data layer for all Trendtactics platforms.

## Architecture Overview

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│  trendtactics.com   │    │     TrendyAI        │    │   Academy (Soon)    │
│     (Website)       │    │   (Admin Panel)     │    │                     │
└─────────┬───────────┘    └─────────┬───────────┘    └─────────┬───────────┘
          │                          │                          │
          └──────────────────────────┼──────────────────────────┘
                                     │
                         ┌───────────▼───────────┐
                         │     Supabase          │
                         │  (Unified Backend)    │
                         │                       │
                         │  ┌─────────────────┐  │
                         │  │   Auth System   │  │
                         │  ├─────────────────┤  │
                         │  │   Data Tables   │  │
                         │  ├─────────────────┤  │
                         │  │   Realtime      │  │
                         │  ├─────────────────┤  │
                         │  │   Storage       │  │
                         │  └─────────────────┘  │
                         └───────────────────────┘
```

## Setup Instructions

### 1. Supabase Project Setup

1. Create a new project in your Supabase dashboard
2. Note your project URL and API keys:
   - Project URL (e.g., `https://your-project.supabase.co`)
   - Anonymous key (for client-side operations)
   - Service role key (for server-side operations)

### 2. Environment Configuration

Update your `.env` file with your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Database Schema Deployment

Run the migration script to set up the database schema:

```sql
-- Execute the SQL in supabase/migrations/001_initial_schema.sql
```

### 4. API Endpoints

The following endpoints are now available:

#### Clients
- `GET /api/v1/clients` - Get all clients
- `GET /api/v1/clients/:id` - Get client by ID
- `POST /api/v1/clients` - Create new client
- `PUT /api/v1/clients/:id` - Update client
- `DELETE /api/v1/clients/:id` - Delete client
- `GET /api/v1/clients/search/:query` - Search clients

#### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `POST /api/v1/users/authenticate` - Authenticate user

## Data Model

### Clients Table
```sql
create table public.clients (
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
```

### Users Table
```sql
create table public.users (
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
```

### Projects Table
```sql
create table public.projects (
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
```

## Security

Row Level Security (RLS) is enabled for all tables with the following policies:

- Users can only view/modify data they own or are assigned to
- Proper authentication is required for all operations
- Data isolation between different platforms is maintained through careful RLS policies

## Real-time Features

Supabase provides real-time capabilities that can be leveraged for:

- Live dashboard updates
- Real-time collaboration features
- Instant notifications
- Live analytics

## Next Steps

1. Implement authentication with Supabase Auth
2. Add storage for file uploads
3. Set up real-time subscriptions
4. Configure Row Level Security for all tables
5. Add more AI agent tables as needed
6. Implement proper error handling and logging

## Testing

To test the integration:

```bash
# Start the backend server
npm run dev

# Test client endpoints
curl http://localhost:3000/api/v1/clients

# Test user endpoints
curl http://localhost:3000/api/v1/users
```