export const agentDefinitions = [
  {
    name: "TrendyAI Core",
    shortName: "Core",
    role: "Master Orchestrator & System PM",
    description: "Central intelligence of TrendyAI. Absorbs Promptify, PromptWizard, and system orchestration roles. Coordinates webhooks, decomposes client requests, routes tasks, auto-adjusts system prompts, manages database state, and administers the human-in-the-loop approval queues.",
    keyFunctions: [
      "Natural language request parsing & intention recognition",
      "Decomposing large campaigns into micro-tasks",
      "Dynamic task routing & agent assignment",
      "System prompt generation and auto-optimization (Promptify capability)",
      "Project status and state synchronization in Supabase",
      "Human-in-the-loop review routing and approval gates",
      "System-level conflict resolution and error recovery",
      "Automated progress notifications to clients (email/slack updates)"
    ]
  },
  {
    name: "ClientFlow",
    shortName: "CF",
    role: "Client Onboarding & Success Manager",
    description: "Manages the client lifecycle. Absorbs OnboardingAgent, ClientSuccessAgent, and RevenueOptimizer roles. Guides onboarding intake, configures new client project spaces, coordinates billing setups, tracks retention, and triggers upselling/cross-selling recommendations.",
    keyFunctions: [
      "Smart lead detection, qualification, and follow-up",
      "Guided onboarding chats and information collection",
      "Welcome pack dispatch and contract setup coordination",
      "Project workspace initialization and client profile creation",
      "Monitoring client satisfaction metrics and retention risks",
      "Identifying upselling and cross-selling opportunities (RevenueOptimizer capability)",
      "Automated follow-up emails and support request ticketing"
    ]
  },
  {
    name: "StratoBoss",
    role: "Strategy & SEO Specialist",
    description: "The research and strategy hub. Absorbs StratoBoss, RankRover, TrendScout, and BizDevStrategist roles. Conducts search volumes audits, competitor sweeps, trend scanning, keyword mapping, and constructs digital marketing roadmap plans.",
    keyFunctions: [
      "Overarching multi-channel marketing strategy roadmaps",
      "Technical SEO auditing and on-page recommendations (RankRover capability)",
      "Keyword research and authority maps generation",
      "Content brief compiling for writer agents",
      "Competitor marketing sweeps and SWOT analysis",
      "Social media trend scanning and keyword forecasting",
      "Business development plans and agency growth strategies"
    ]
  },
  {
    name: "ContentSmith",
    role: "Intentionally Creative Multi-Format Writer",
    description: "The writing core. Absorbs ContentCrafter, BlogSmith, BookSmith, CourseCraft, PoeticAI, ArticleRewriter, AdGenie (copywriting), and MailMage (copywriting) roles. Acts as a chameleonic writer, dynamically adapting to behave as a copywriter, blog writer, poet, course compiler, or book author. Adapts brand tone and asks clarifying questions for ambiguous inputs.",
    keyFunctions: [
      "Dynamic persona shifting (blogger, copywriter, poet, author, educator)",
      "SEO-optimized blog posts, headlines, and call-to-actions (BlogSmith capability)",
      "Long-form case studies, whitepapers, and articles (ContentCrafter capability)",
      "Book chapter outlines and ghostwriting drafts (BookSmith capability)",
      "Online course curriculum mapping, lessons, and quizzes (CourseCraft capability)",
      "High-converting paid ad copy variations (AdGenie copy capability)",
      "Automated email marketing sequences and newsletters (MailMage copy capability)",
      "Creative poems, spoken word pieces, and brand hooks (PoeticAI capability)",
      "Content paraphrasing, re-writing, and repurposing (ArticleRewriter capability)"
    ]
  },
  {
    name: "PixelDex",
    role: "Visual Designer & Layout Stylist",
    description: "The visual designer. Absorbs PixelWitch, DesignDex, and EbookStylist roles. Focuses on visual balance, typography, and composition. Translates text prompts into brand-aligned images, designs corporate branding kits, layouts marketing banners, and formats ebook structures.",
    keyFunctions: [
      "AI text-to-image graphic generation (PixelWitch capability)",
      "Logo design and visual branding guideline books (DesignDex capability)",
      "Marketing banners, social media graphics, and ad assets creation",
      "Formatting raw book text into styled EPUB/PDF ebooks (EbookStylist capability)",
      "UI/UX layout assets design and wireframes graphics",
      "Image upscaling, editing, and background removal"
    ],
    models: ['openai/dall-e-3', 'stability/stable-diffusion-xl', 'google/imagefx'],
    pickModel: (prompt) => {
      const p = prompt.toLowerCase();
      if (p.includes('anime') || p.includes('manga') || p.includes('vector') || p.includes('logo')) return 'stability/stable-diffusion-xl';
      if (p.includes('photo') || p.includes('realistic') || p.includes('hyper-realistic')) return 'openai/dall-e-3';
      return 'openai/dall-e-3'; // default
    }
  },
  {
    name: "MediaWiz",
    role: "Video & Audio Specialist",
    description: "The media production core. Absorbs Trendywood, ClipCrafter, and SonicVibe roles. Operates end-to-end video workflows including scriptwriting, storyboarding, editing short clips (Shorts/TikToks/Reels), audio mixing, synthetic voiceovers, and composing background music.",
    keyFunctions: [
      "Video script writing and storyboard mapping (Trendywood capability)",
      "Short-form video editing and post-production (ClipCrafter capability)",
      "Text overlays, subtitles, transitions, and pacing effects",
      "Audio editing, mixing, and background music composition (SonicVibe capability)",
      "Synthetic voiceover generation and audio syncing",
      "Final video file rendering and formatting"
    ]
  },
  {
    name: "WebWiz",
    role: "Web Coder & Performance Monitor",
    description: "Designs UI code and ensures sites are live and optimized. Absorbs WebWiz and WebsiteMonitor roles. Generates clean frontend code (HTML/CSS/React), maps CMS connections, and checks site response metrics.",
    keyFunctions: [
      "Frontend web coding (HTML, CSS, JS, React)",
      "Interactive layout wireframing and deploy setups",
      "CMS integration and publishing workflows (WordPress, Webflow)",
      "Website performance checks and conversion metrics tracking",
      "Error logging and site downtime alerts (WebsiteMonitor capability)"
    ]
  },
  {
    name: "PulsePilot",
    role: "Publisher, Funnel Manager & Analytics Ops",
    description: "The operational distributor. Absorbs PostPilot, PulseTrack, FunnelManager, and AdGenie (management) roles. Connects to APIs to publish content (YouTube uploads, social posts), configures paid ad structures, tracks ad budgets, and maps marketing funnel conversion paths.",
    keyFunctions: [
      "Social media post publishing & content scheduling (PostPilot capability)",
      "YouTube video uploads and SEO metadata management",
      "Paid ad campaigns launch and bid adjustments (Meta, Google, TikTok Ads)",
      "Multi-channel marketing performance dashboards and tracking (PulseTrack capability)",
      "Client ad spend budget tracking and warning alerts",
      "Marketing funnel conversion maps and A/B test setup (FunnelManager capability)"
    ]
  }
]; 