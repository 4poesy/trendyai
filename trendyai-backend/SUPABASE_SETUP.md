# Supabase Setup Guide for TrendyAI

This guide will help you set up Supabase for your TrendyAI project to create a unified backend for all Trendtactics platforms.

## Prerequisites

1. A Supabase account (free tier available at [supabase.com](https://supabase.com))
2. Your TrendyAI project running locally

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com/](https://app.supabase.com/)
2. Click "New Project"
3. Fill in the project details:
   - **Project Name**: TrendyAI or any name you prefer
   - **Database Password**: Create a strong password
   - **Region**: Choose the region closest to you
4. Click "Create New Project"

## Step 2: Get Your Supabase Credentials

Once your project is created, you'll need to get your API credentials:

1. In your Supabase dashboard, click on your project
2. Click on the "Project Settings" gear icon in the sidebar
3. Click on "API" in the settings menu
4. Note down the following values:
   - **Project URL**: This is your `SUPABASE_URL`
   - **anon public**: This is your `SUPABASE_ANON_KEY`
   - **service_role secret**: This is your `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Update Your Environment Variables

Update your `.env` file in the `trendyai-backend` directory with your actual Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=your_actual_project_url_here
SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

Replace the placeholder values with your actual credentials from Step 2.

## Step 4: Run Database Migrations

Execute the SQL migration to set up your database schema:

1. In your Supabase dashboard, click on "SQL Editor" in the sidebar
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste it into the SQL editor and click "RUN"

## Step 5: Test Your Setup

1. Restart your backend server:
   ```bash
   npm run dev
   ```

2. Test the API endpoints:
   ```bash
   curl http://localhost:3000/api/v1/clients
   ```

## Step 6: Configure Authentication (Optional)

For enhanced security, you can set up Supabase Auth:

1. In your Supabase dashboard, click on "Authentication" in the sidebar
2. Configure your preferred authentication providers
3. Update your Row Level Security policies as needed

## Troubleshooting

### Common Issues

1. **"fetch failed" error**: Check that your Supabase URL and keys are correct
2. **"permission denied" error**: Make sure your RLS policies are configured correctly
3. **"connection timeout" error**: Check your internet connection and firewall settings

### Testing Connection

You can test your Supabase connection with the provided test script:

```bash
node test-supabase.js
```

## Next Steps

1. Implement authentication in your frontend
2. Set up real-time subscriptions for live updates
3. Configure storage buckets for file uploads
4. Add more tables as needed for your AI agents
5. Set up proper error handling and logging

## Security Considerations

1. Never commit your `.env` file to version control
2. Use the service role key only on the server-side
3. Implement proper Row Level Security policies
4. Regularly rotate your API keys
5. Monitor your Supabase logs for suspicious activity

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Library](https://supabase.com/docs/reference/javascript/installation)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)