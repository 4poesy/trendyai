# Puter.js Setup Guide - Free AI Service

## Overview
Puter.js provides free AI services that can be used as an alternative to paid APIs like OpenRouter. This guide will help you set up Puter.js for your TrendyAI system.

## Step 1: Get Your Puter.js API Key

1. **Visit Puter.com**: Go to [https://puter.com](https://puter.com)
2. **Create Account**: Sign up for a free account
3. **Get API Key**: 
   - Go to your dashboard
   - Navigate to API settings
   - Generate a new API key
   - Copy the API key

## Step 2: Configure Puter.js in TrendyAI

### Option A: Environment Variables (Recommended)
Add your Puter.js credentials to your `.env` file:

```env
# Puter.js Configuration
PUTER_APP_ID=a913df5a-f2b6-4adb-b1a4-d2f6148b1508
PUTER_API_KEY=your-puter-api-key-here
```

### Option B: Direct Configuration
Update the `puterAIService.js` file with your credentials:

```javascript
const result = await puterConfig.initialize(
  'a913df5a-f2b6-4adb-b1a4-d2f6148b1508', // Your App ID
  'your-actual-puter-api-key' // Replace with your real API key
);
```

## Step 3: Test the Integration

1. **Start the development server**:
   ```bash
   cd trendyai-admin
   npm run dev
   ```

2. **Test AI services**:
   - Try generating text: "Write a short story about a robot"
   - Try generating images: "A beautiful sunset over mountains"
   - Try creating poems: "Write a poem about technology"

## Available Puter.js AI Features

### Text Generation
- **Models**: GPT-3.5, GPT-4, Claude, Gemini, and more
- **Use Cases**: Articles, stories, poems, code, analysis
- **Cost**: Free with reasonable limits

### Image Generation
- **Models**: DALL-E, Stable Diffusion variants
- **Sizes**: 512x512, 1024x1024, 1792x1024
- **Styles**: Natural, artistic, photorealistic
- **Cost**: Free with reasonable limits

### Code Generation
- **Languages**: JavaScript, Python, Java, C++, and more
- **Features**: Code completion, debugging, optimization
- **Cost**: Free with reasonable limits

## Benefits of Using Puter.js

✅ **Completely Free**: No credit card required  
✅ **Multiple Models**: Access to various AI models  
✅ **No Rate Limits**: Generous free tier limits  
✅ **Easy Integration**: Simple JavaScript SDK  
✅ **Reliable Service**: Enterprise-grade infrastructure  

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check your API key is correct
   - Ensure your account is active
   - Verify the App ID is correct

2. **"Service not available"**
   - Check your internet connection
   - Verify Puter.js service status
   - Try again in a few minutes

3. **"Rate limit exceeded"**
   - Wait a few minutes before trying again
   - Consider upgrading your Puter.js plan
   - Use fallback services temporarily

### Getting Help

- **Puter.js Documentation**: [https://docs.puter.com](https://docs.puter.com)
- **API Reference**: [https://docs.puter.com/api](https://docs.puter.com/api)
- **Community Support**: [https://community.puter.com](https://community.puter.com)

## Migration from OpenRouter

If you're currently using OpenRouter and want to switch to Puter.js:

1. **Update Service Priority**: Puter.js is now the default service
2. **Test All Features**: Ensure all AI features work correctly
3. **Monitor Usage**: Check that you're within free tier limits
4. **Backup Configuration**: Keep your OpenRouter keys as backup

## Next Steps

Once Puter.js is configured:

1. **Test all AI agents** in your TrendyAI system
2. **Monitor performance** and response quality
3. **Adjust prompts** if needed for better results
4. **Explore advanced features** like custom models

Your TrendyAI system will now use Puter.js as the primary AI service, providing free, high-quality AI capabilities! 