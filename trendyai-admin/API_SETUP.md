# API Setup Guide for Real AI Functionality

## Overview
TrendyAI currently shows demo responses because it needs API keys to connect to real AI services. Follow this guide to enable real AI functionality.

## Required API Keys

### 1. OpenRouter API Key (Recommended)
**Services:** Access to multiple AI models (GPT-4, Claude, DALL-E, etc.) through a single API
**Get it from:** https://openrouter.ai/keys
**Cost:** Free tier available with generous limits

### 2. OpenAI API Key (Alternative)
**Services:** GPT-4, DALL-E 3, Text-to-Speech, Video Generation
**Get it from:** https://platform.openai.com/api-keys

### 2. Stability AI API Key (Optional)
**Services:** Stable Diffusion XL for images
**Get it from:** https://platform.stability.ai/account/keys

### 3. Anthropic API Key (Optional)
**Services:** Claude for text generation
**Get it from:** https://console.anthropic.com/

## Setup Instructions

### Step 1: Create Environment File
Create a `.env` file in the `trendyai-admin` directory with the following content:

```env
# AI Service API Keys
REACT_APP_OPENROUTER_API_KEY=your-openrouter-api-key-here
REACT_APP_OPENAI_API_KEY=your-openai-api-key-here
REACT_APP_STABILITY_API_KEY=your-stability-api-key-here
REACT_APP_ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

### Step 2: Add Your API Keys
Replace the placeholder values with your actual API keys:

```env
REACT_APP_OPENROUTER_API_KEY=sk-or-your-actual-openrouter-key
REACT_APP_OPENAI_API_KEY=sk-your-actual-openai-key
REACT_APP_STABILITY_API_KEY=sk-your-actual-stability-key
REACT_APP_ANTHROPIC_API_KEY=sk-ant-your-actual-anthropic-key
```

### Step 3: Restart Development Server
After adding your API keys, restart the development server:

```bash
npm run dev
```

## What Each Service Does

### OpenRouter Services (Recommended)
- **Multiple AI Models**: Access to GPT-4, Claude, DALL-E, and many more through a single API
- **Cost Effective**: Often cheaper than individual API services
- **Unified Interface**: Single API key for multiple AI capabilities
- **Free Tier**: Generous free tier available

### OpenAI Services
- **GPT-4**: Text generation, copywriting, content creation
- **DALL-E 3**: High-quality image generation
- **Text-to-Speech**: Audio generation from text
- **Video Generation**: Short video clips from text

### Stability AI Services
- **Stable Diffusion XL**: Alternative image generation with different styles

### Anthropic Services
- **Claude**: Alternative text generation with different capabilities

## Testing Your Setup

1. **Start the development server**
2. **Navigate to the AI Agents section**
3. **Select a design agent (like DesignDex)**
4. **Ask for an image**: "Create a beautiful sunset landscape"
5. **You should see a real generated image instead of a demo response**

## Troubleshooting

### "Demo Response" Still Shows
- Check that your `.env` file is in the correct location
- Verify your API keys are correct
- Restart the development server after adding keys
- Check the browser console for error messages

### API Errors
- Ensure you have sufficient credits in your API accounts
- Check that your API keys have the correct permissions
- Verify the API services are available in your region

### Rate Limits
- OpenAI has rate limits based on your plan
- Consider upgrading your plan for higher limits
- The system will show fallback responses if rate limited

## Cost Considerations

### OpenAI Pricing (as of 2024)
- **GPT-4**: ~$0.03 per 1K tokens
- **DALL-E 3**: $0.040 per image
- **Text-to-Speech**: $0.015 per 1K characters
- **Video Generation**: $0.17 per second

### Stability AI Pricing
- **Stable Diffusion XL**: ~$0.002 per image

### Anthropic Pricing
- **Claude**: ~$0.015 per 1K tokens

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- API keys are only used on the client side for this demo
- For production, implement proper backend API key management

## Next Steps

Once you have real AI functionality working:

1. **Explore different agents** and their capabilities
2. **Test various content types** (images, text, audio, video)
3. **Customize the AI prompts** in the agent definitions
4. **Integrate with your digital marketing workflow**

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API keys are working in the respective platforms
3. Ensure you have sufficient credits in your API accounts
4. Check that the development server is running correctly 