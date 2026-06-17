# n8n-mcp Setup Guide for Cursor

## What is n8n-mcp?

n8n-mcp is a Model Context Protocol (MCP) server that enables AI assistants like Cursor to interact with n8n workflows. This allows you to:

- **Execute n8n workflows** directly from Cursor
- **Access data** from various services through n8n integrations
- **Automate tasks** like sending emails, API calls, database operations
- **Connect to 200+ services** through n8n's extensive integration library

## Prerequisites

1. **n8n Instance**: You need a running n8n instance (cloud or self-hosted)
2. **API Key**: Generate an API key from your n8n instance
3. **Node.js**: Ensure Node.js is installed on your system

## Step 1: Install n8n-mcp

```bash
npm install -g n8n-mcp
```

## Step 2: Get Your n8n Credentials

### For n8n Cloud:
1. Go to your n8n cloud dashboard
2. Navigate to Settings → API
3. Generate a new API key
4. Note your n8n instance URL (e.g., `https://your-workspace.n8n.cloud`)

### For Self-hosted n8n:
1. Go to your n8n instance
2. Navigate to Settings → API
3. Generate a new API key
4. Use your n8n instance URL (e.g., `http://localhost:5678`)

## Step 3: Configure Cursor Settings

### Option 1: Global Settings (Recommended)

Add this to your Cursor settings.json:

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

### Option 2: Workspace Settings

Create a `.cursor/settings.json` file in your project root:

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

## Step 4: Environment Variables (Alternative)

Instead of hardcoding credentials, you can use environment variables:

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

Then set your environment variables:
```bash
export N8N_API_URL="https://your-workspace.n8n.cloud"
export N8N_API_KEY="your-actual-api-key-here"
```

## Step 5: Test the Configuration

1. **Restart Cursor** after making configuration changes
2. **Check MCP Status**: Look for n8n-mcp in Cursor's MCP server status
3. **Test Connection**: Try asking Cursor to list your n8n workflows

## Common Use Cases

### 1. Execute Workflows
```
"Execute the workflow named 'Send Email Notification' with the data: {email: 'user@example.com', message: 'Hello!'}"
```

### 2. Get Workflow Data
```
"Get the latest execution results from the 'Data Processing' workflow"
```

### 3. Trigger Automations
```
"Run the 'Daily Report' workflow and send the results to my email"
```

### 4. Data Integration
```
"Fetch data from the CRM workflow and format it for the dashboard"
```

## Troubleshooting

### Issue 1: "n8n-mcp not found"
**Solution**: Install n8n-mcp globally
```bash
npm install -g n8n-mcp
```

### Issue 2: "Connection failed"
**Solutions**:
- Verify your N8N_API_URL is correct
- Check your N8N_API_KEY is valid
- Ensure your n8n instance is accessible
- Test the API connection manually

### Issue 3: "Permission denied"
**Solution**: Check API key permissions in n8n settings

### Issue 4: "Workflow not found"
**Solution**: Verify workflow names and IDs in your n8n instance

## Security Best Practices

1. **Use Environment Variables**: Don't hardcode API keys
2. **Restrict API Permissions**: Limit API key scope in n8n
3. **Regular Key Rotation**: Update API keys periodically
4. **Monitor Usage**: Check n8n logs for unusual activity

## Advanced Configuration

### Custom Workflow Parameters
```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "debug",
        "DISABLE_CONSOLE_OUTPUT": "false",
        "N8N_API_URL": "https://your-workspace.n8n.cloud",
        "N8N_API_KEY": "your-api-key",
        "N8N_WORKFLOW_TIMEOUT": "30000",
        "N8N_MAX_RETRIES": "3"
      }
    }
  }
}
```

### Multiple n8n Instances
```json
{
  "mcpServers": {
    "n8n-production": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "N8N_API_URL": "https://prod.n8n.cloud",
        "N8N_API_KEY": "prod-api-key"
      }
    },
    "n8n-development": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "N8N_API_URL": "https://dev.n8n.cloud",
        "N8N_API_KEY": "dev-api-key"
      }
    }
  }
}
```

## Integration with TrendyAI

For your TrendyAI project, n8n-mcp can be particularly useful for:

1. **Automated Client Onboarding**: Trigger workflows when new clients are added
2. **Content Publishing**: Automate social media posts and email campaigns
3. **Data Synchronization**: Sync data between different platforms
4. **Report Generation**: Automate analytics and reporting workflows
5. **Notification Systems**: Send alerts for important events

## Example Workflows for TrendyAI

### Client Onboarding Workflow
```javascript
// Trigger when new client is added
{
  "trigger": "webhook",
  "actions": [
    "create_calendar_event",
    "send_welcome_email",
    "create_project_folder",
    "assign_team_members"
  ]
}
```

### Content Publishing Workflow
```javascript
// Automate content distribution
{
  "trigger": "content_ready",
  "actions": [
    "publish_to_social_media",
    "send_newsletter",
    "update_website",
    "track_analytics"
  ]
}
```

## Next Steps

1. **Install n8n-mcp**: `npm install -g n8n-mcp`
2. **Configure your settings**: Use the JSON configuration above
3. **Test the connection**: Restart Cursor and test with a simple workflow
4. **Create workflows**: Build automation workflows in your n8n instance
5. **Integrate with TrendyAI**: Connect your AI agents with n8n workflows

## Support Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n-mcp GitHub](https://github.com/n8n-io/n8n-mcp)
- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [Cursor MCP Documentation](https://cursor.sh/docs/mcp)

---

**Note**: Replace `https://your-workspace.n8n.cloud` and `your-api-key-here` with your actual n8n instance URL and API key. 