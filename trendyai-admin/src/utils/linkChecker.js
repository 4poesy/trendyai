// Link Checker Utility for TrendyAI Admin Dashboard
// Prevents broken links and validates all URLs

export class LinkChecker {
  constructor() {
    this.brokenLinks = [];
    this.validatedLinks = new Set();
  }

  // Validate a single URL
  validateUrl(url) {
    if (!url) return { valid: false, error: 'URL is empty' };
    
    try {
      // Check if it's a relative URL
      if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
        return { valid: true, type: 'relative' };
      }
      
      // Check if it's a valid absolute URL
      const urlObj = new URL(url);
      return { 
        valid: true, 
        type: 'absolute',
        protocol: urlObj.protocol,
        domain: urlObj.hostname
      };
    } catch (error) {
      return { valid: false, error: 'Invalid URL format' };
    }
  }

  // Check if a link is accessible (for absolute URLs)
  async checkLinkAccessibility(url) {
    if (!url || url.startsWith('/')) return { accessible: true };
    
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors' // Avoid CORS issues
      });
      return { accessible: true, status: response.status };
    } catch (error) {
      return { accessible: false, error: error.message };
    }
  }

  // Validate all links in a component
  validateComponentLinks(componentName, links) {
    const results = {
      component: componentName,
      total: links.length,
      valid: 0,
      invalid: 0,
      issues: []
    };

    links.forEach((link, index) => {
      const validation = this.validateUrl(link.url);
      
      if (validation.valid) {
        results.valid++;
        this.validatedLinks.add(link.url);
      } else {
        results.invalid++;
        results.issues.push({
          index,
          url: link.url,
          error: validation.error,
          context: link.context || 'Unknown'
        });
        this.brokenLinks.push({
          component: componentName,
          url: link.url,
          error: validation.error,
          context: link.context
        });
      }
    });

    return results;
  }

  // Get all links that need validation
  getAllLinks() {
    return [
      // Navigation links
      { url: '/', context: 'Home navigation' },
      { url: '/analytics', context: 'Analytics navigation' },
      { url: '/clients', context: 'Clients navigation' },
      { url: '/projects', context: 'Projects navigation' },
      { url: '/approval-queue', context: 'Approval queue navigation' },
      { url: '/audit-logs', context: 'Audit logs navigation' },
      { url: '/agent-status', context: 'Agent status navigation' },
      { url: '/studio-mode', context: 'Studio mode navigation' },
      { url: '/agent-grid', context: 'Agent grid navigation' },
      
      // External links
      { url: 'https://trendtacticsdigital.com', context: 'Trendtactics Digital domain' },
      { url: 'https://trendyai.com', context: 'TrendyAI domain' },
      { url: 'https://js.puter.com/v2/', context: 'Puter.js script' },
      { url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;700&family=Inter:wght@400;700&display=swap', context: 'Google Fonts' },
      
      // Asset links
      { url: '/assets/trendyai-og.webp', context: 'OG image' },
      { url: '/favicon.png', context: 'Favicon' },
      { url: '/robots.txt', context: 'Robots file' },
      { url: '/sitemap.xml', context: 'Sitemap' },
      { url: '/sw.js', context: 'Service worker' }
    ];
  }

  // Run comprehensive link validation
  async runFullValidation() {
    console.log('🔍 Starting comprehensive link validation...');
    
    const allLinks = this.getAllLinks();
    const results = this.validateComponentLinks('Main Application', allLinks);
    
    // Log results
    console.log(`📊 Link Validation Results:`);
    console.log(`✅ Valid links: ${results.valid}`);
    console.log(`❌ Invalid links: ${results.invalid}`);
    
    if (results.issues.length > 0) {
      console.warn('⚠️ Broken links found:');
      results.issues.forEach(issue => {
        console.warn(`   - ${issue.url} (${issue.context}): ${issue.error}`);
      });
    }
    
    return results;
  }

  // Check for common broken link patterns
  checkCommonIssues() {
    const issues = [];
    
    // Check for placeholder URLs
    const placeholderPatterns = [
      /example\.com/,
      /placeholder\.com/,
      /lorem\.ipsum/,
      /#/,
      /javascript:void\(0\)/,
      /mailto:example/,
      /tel:123/
    ];
    
    this.getAllLinks().forEach(link => {
      placeholderPatterns.forEach(pattern => {
        if (pattern.test(link.url)) {
          issues.push({
            type: 'placeholder',
            url: link.url,
            context: link.context,
            suggestion: 'Replace with actual URL'
          });
        }
      });
    });
    
    return issues;
  }

  // Generate link validation report
  generateReport() {
    const validation = this.runFullValidation();
    const commonIssues = this.checkCommonIssues();
    
    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalLinks: validation.total,
        validLinks: validation.valid,
        invalidLinks: validation.invalid,
        successRate: ((validation.valid / validation.total) * 100).toFixed(2) + '%'
      },
      issues: [...validation.issues, ...commonIssues],
      recommendations: this.generateRecommendations(validation, commonIssues)
    };
  }

  // Generate recommendations based on validation results
  generateRecommendations(validation, commonIssues) {
    const recommendations = [];
    
    if (validation.invalid > 0) {
      recommendations.push('Fix invalid URLs before deployment');
    }
    
    if (commonIssues.length > 0) {
      recommendations.push('Replace placeholder URLs with actual links');
    }
    
    if (validation.valid < validation.total * 0.9) {
      recommendations.push('Link success rate is below 90% - review all links');
    }
    
    return recommendations;
  }
}

// Link validation for specific components
export const validateComponentLinks = (componentName, links) => {
  const checker = new LinkChecker();
  return checker.validateComponentLinks(componentName, links);
};

// Quick link validation
export const quickValidate = (url) => {
  const checker = new LinkChecker();
  return checker.validateUrl(url);
};

// Export singleton instance
export const linkChecker = new LinkChecker();

// Auto-run validation in development
if (import.meta.env.DEV) {
  // Run validation after page load
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        linkChecker.runFullValidation();
      }, 2000); // Wait for all resources to load
    });
  }
} 