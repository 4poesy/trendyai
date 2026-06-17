# 🚀 Deployment Guide: Trendtactics Digital & TrendyAI

This guide will help you deploy both websites and set up the cross-domain authentication system.

## 📋 Prerequisites

- Domain names: `trendtacticsdigital.com` and `trendyai.com`
- Hosting provider (Netlify, Vercel, or cPanel)
- GitHub repository (recommended)

## 🌐 Domain Setup

### 1. DNS Configuration

Configure your domains with these DNS records:

```bash
# For trendtacticsdigital.com
A     @     185.199.108.153    # Netlify IP
A     @     185.199.109.153    # Netlify IP
A     @     185.199.110.153    # Netlify IP
A     @     185.199.111.153    # Netlify IP
CNAME www   trendtacticsdigital.com

# For trendyai.com (Internal AI Workspace - Admin Only)
A     @     185.199.108.153    # Netlify IP
A     @     185.199.109.153    # Netlify IP
A     @     185.199.110.153    # Netlify IP
A     @     185.199.111.153    # Netlify IP
CNAME www   trendyai.com
```

### 2. SSL Certificates

Both domains need SSL certificates for cross-domain cookies to work:

```bash
# Enable HTTPS on both domains
# Most hosting providers auto-generate SSL certificates
```

## 🏗️ Project Structure

```
TrendyAi/
├── trendyai-admin/          # TrendyAI Admin Dashboard
│   ├── src/
│   ├── public/
│   └── package.json
└── trendtactics-website/    # Trendtactics Digital Website
    ├── src/
    ├── public/
    └── package.json
```

## 📦 Deployment Options

### Option 1: Netlify (Recommended)

#### For TrendyAI Admin:
```bash
# 1. Build the project
cd trendyai-admin
npm run build

# 2. Deploy to Netlify
netlify deploy --prod --dir=dist

# 3. Configure domain
netlify domain:add trendyai.com
```

#### For Trendtactics Digital:
```bash
# 1. Build the project
cd trendtactics-website
npm run build

# 2. Deploy to Netlify
netlify deploy --prod --dir=dist

# 3. Configure domain
netlify domain:add trendtacticsdigital.com
```

### Option 2: Vercel

#### For TrendyAI Admin:
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
cd trendyai-admin
vercel --prod

# 3. Configure custom domain
vercel domains add trendyai.com
```

#### For Trendtactics Digital:
```bash
cd trendtactics-website
vercel --prod
vercel domains add trendtacticsdigital.com
```

### Option 3: cPanel

#### For TrendyAI Admin:
```bash
# 1. Build the project
cd trendyai-admin
npm run build

# 2. Upload dist/ folder to public_html/
# 3. Configure .htaccess for SPA routing
```

#### For Trendtactics Digital:
```bash
# 1. Build the project
cd trendtactics-website
npm run build

# 2. Upload dist/ folder to public_html/
# 3. Configure .htaccess for SPA routing
```

## 🔐 Cross-Domain Authentication Setup

### 1. Environment Variables

Create `.env` files for both projects:

```bash
# trendyai-admin/.env
VITE_API_URL=https://api.trendyai.com
VITE_TRENDTACTICS_URL=https://trendtacticsdigital.com
VITE_ENVIRONMENT=production

# trendtactics-website/.env
VITE_API_URL=https://api.trendtacticsdigital.com
VITE_TRENDYAI_URL=https://trendyai.com
VITE_ENVIRONMENT=production
```

### 2. Cookie Domain Configuration

Update the cross-domain cookie settings in `domainIntegration.js`:

```javascript
// For production
setCrossDomainCookie(name, value, days) {
  const domain = '.trendtacticsdigital.com'; // Shared domain
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; domain=${domain}; secure; samesite=strict`;
}
```

### 3. CORS Configuration

If you have a backend API, configure CORS:

```javascript
// Backend CORS configuration
app.use(cors({
  origin: [
    'https://trendtacticsdigital.com',
    'https://trendyai.com',
    'https://www.trendtacticsdigital.com',
    'https://www.trendyai.com'
  ],
  credentials: true
}));
```

## 🔄 GitHub Integration

### 1. Create Repository

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository
# Then push to GitHub
git remote add origin https://github.com/yourusername/trendyai.git
git push -u origin main
```

### 2. GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './dist'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🧪 Testing Cross-Domain Authentication

### 1. Local Testing

```bash
# Start both projects locally
cd trendyai-admin && npm run dev  # localhost:5173
cd trendtactics-website && npm run dev  # localhost:3000

# Test authentication flow
# 1. Login on one domain
# 2. Navigate to other domain
# 3. Verify authentication persists
```

### 2. Production Testing

```bash
# Test the live domains
# 1. Visit https://trendtacticsdigital.com (Client Portal)
# 2. Login as client (limited access)
# 3. Try to access https://trendyai.com (should be blocked)
# 4. Login as admin on TrendyAI (full access)
# 5. Verify cross-domain authentication works for admins only
```

## 🔧 Post-Deployment Configuration

### 1. Analytics Setup

```javascript
// Google Analytics
gtag('config', 'GA_MEASUREMENT_ID', {
  cookie_domain: '.trendtacticsdigital.com'
});

// Google Tag Manager
gtag('config', 'GTM_ID', {
  cookie_domain: '.trendtacticsdigital.com'
});
```

### 2. SEO Configuration

Update `robots.txt` and `sitemap.xml` for both domains:

```xml
<!-- robots.txt -->
User-agent: *
Allow: /
Sitemap: https://trendtacticsdigital.com/sitemap.xml
Sitemap: https://trendyai.com/sitemap.xml
```

### 3. Performance Monitoring

```javascript
// Add performance monitoring
// Google PageSpeed Insights
// Web Vitals monitoring
// Error tracking (Sentry)
```

## 🚨 Security Considerations

### 1. HTTPS Enforcement

```javascript
// Force HTTPS redirect
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
```

### 2. Content Security Policy

```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://js.puter.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.trendyai.com https://api.trendtacticsdigital.com;
">
```

### 3. Rate Limiting

```javascript
// Implement rate limiting on login attempts
// Use the RateLimiter class from validation.js
```

## 📊 Monitoring & Maintenance

### 1. Health Checks

```javascript
// Add health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

### 2. Error Monitoring

```javascript
// Set up error tracking
// Sentry, LogRocket, or similar
```

### 3. Performance Monitoring

```javascript
// Monitor Core Web Vitals
// Set up alerts for performance degradation
```

## 🎯 Next Steps

1. **Deploy both projects** using your preferred hosting provider
2. **Configure DNS** for both domains
3. **Set up SSL certificates**
4. **Test cross-domain authentication**
5. **Configure analytics and monitoring**
6. **Set up CI/CD pipelines**

## 📞 Support

If you encounter issues during deployment:

1. Check the browser console for errors
2. Verify DNS propagation
3. Test SSL certificates
4. Check CORS configuration
5. Verify environment variables

---

**Remember**: The cross-domain authentication system works by sharing cookies and localStorage data between domains. Make sure both domains are properly configured and SSL certificates are valid for this to work correctly. 