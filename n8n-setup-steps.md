# n8n Setup Steps for n8n-mcp Integration

## Step 1: Choose Your n8n Setup

You have two options for running n8n:

### Option A: n8n Cloud (Recommended for beginners)
1. Go to [n8n.cloud](https://n8n.cloud)
2. Sign up for a free account
3. Create a new workspace
4. Your URL will be: `https://your-workspace-name.n8n.cloud`

### Option B: Self-hosted n8n
1. Install n8n locally:
   ```bash
   npm install -g n8n
   n8n start
   ```
2. Access at: `http://localhost:5678`
3. Create your first account

## Step 2: Get Your API Credentials

### For n8n Cloud:
1. Log into your n8n cloud workspace
2. Click on your profile icon (top right)
3. Go to **Settings** → **API**
4. Click **Generate API Key**
5. Copy the API key (it starts with `n8n_api_`)
6. Note your workspace URL

### For Self-hosted n8n:
1. Log into your n8n instance
2. Go to **Settings** → **API**
3. Click **Generate API Key**
4. Copy the API key
5. Note your instance URL

## Step 3: Test Your Connection

Let's test if your n8n instance is accessible:

```bash
# Test the API connection
curl -H "X-N8N-API-KEY: your-api-key-here" \
     https://your-workspace.n8n.cloud/api/v1/workflows
```

## Step 4: Configure Cursor Settings

### Method 1: Global Settings (Recommended)

1. Open Cursor
2. Go to **File** → **Preferences** → **Settings**
3. Click on the **{}** icon to open settings.json
4. Add this configuration:

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true",
        "N8N_API_URL": "https://your-workspace.n8n.cloud",
        "N8N_API_KEY": "your-actual-api-key-here"
      }
    }
  }
}
```

### Method 2: Workspace Settings

1. Create a `.cursor` folder in your project root
2. Create `settings.json` inside the `.cursor` folder
3. Add the same configuration as above

### Method 3: Environment Variables (Most Secure)

1. Set environment variables:
   ```bash
   # Windows PowerShell
   $env:N8N_API_URL="https://your-workspace.n8n.cloud"
   $env:N8N_API_KEY="your-actual-api-key-here"
   
   # Or add to your system environment variables
   ```

2. Use this configuration:
   ```json
   {
     "mcpServers": {
       "n8n-mcp": {
         "command": "npx",
         "args": ["n8n-mcp"],
         "env": {
           "MCP_MODE": "stdio",
           "LOG_LEVEL": "error",
           "DISABLE_CONSOLE_OUTPUT": "true",
           "N8N_API_URL": "${N8N_API_URL}",
           "N8N_API_KEY": "${N8N_API_KEY}"
         }
       }
     }
   }
   ```

## Step 5: Create a Test Workflow

1. In your n8n instance, create a simple workflow:
   - Add a **Webhook** trigger
   - Add a **Set** node to return some data
   - Activate the workflow

2. Test it from Cursor:
   ```
   "Execute the workflow named 'Test Workflow' with the data: {message: 'Hello from Cursor!'}"
   ```

## Step 6: Verify Installation

1. Restart Cursor
2. Check if n8n-mcp appears in Cursor's MCP servers
3. Try asking Cursor to list your workflows

## Troubleshooting

### "n8n-mcp not found"
- Make sure you installed it globally: `npm install -g n8n-mcp`
- Check if it's in your PATH: `npx n8n-mcp --help`

### "Connection failed"
- Verify your API URL is correct
- Check your API key is valid
- Ensure your n8n instance is running
- Test the API manually with curl

### "Permission denied"
- Check API key permissions in n8n settings
- Ensure the API key has the right scope

## Quick Test Commands

```bash
# Test n8n-mcp installation
npx n8n-mcp --help

# Test n8n API connection
curl -H "X-N8N-API-KEY: your-api-key" \
     https://your-workspace.n8n.cloud/api/v1/workflows

# List installed MCP servers in Cursor
# (Check Cursor's MCP server status)
```

## Next Steps

Once configured, you can:

1. **Create workflows** in n8n for automation
2. **Execute workflows** from Cursor
3. **Integrate with TrendyAI** agents
4. **Automate your development** process

## Example Use Cases for TrendyAI

### Automated Client Onboarding
```javascript
// n8n workflow: When new client is added
{
  "trigger": "webhook",
  "actions": [
    "send_welcome_email",
    "create_project_folder",
    "schedule_consultation",
    "update_crm"
  ]
}
```

### Content Publishing Automation
```javascript
// n8n workflow: When content is ready
{
  "trigger": "webhook",
  "actions": [
    "publish_to_social_media",
    "send_newsletter",
    "update_website",
    "track_analytics"
  ]
}
```

---

**Need Help?**
- Check the [n8n documentation](https://docs.n8n.io/)
- Visit the [n8n community](https://community.n8n.io/)
- Review the [n8n-mcp GitHub](https://github.com/n8n-io/n8n-mcp) 