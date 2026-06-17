export const agentDefinitions = [
  {
    name: "TrendyAI Core",
    shortName: "Core",
    role: "Master Orchestrator / Project Manager Agent",
    description: "Central intelligence for decomposing, assigning, and managing all client requests and workflows. Handles human review routing and notifications.",
    keyFunctions: [
      "Intention recognition",
      "Task decomposition",
      "Agent assignment",
      "Progress monitoring",
      "Output integration",
      "Project state management",
      "Human review routing",
      "Agent feedback handling",
      "Notification dispatch"
    ]
  },
  {
    name: "ClientFlow",
    shortName: "CF",
    role: "Digital Marketing Concierge & Lead Orchestrator",
    description: "Central orchestrator for client lifecycle management, lead nurturing, and automated service delivery. Monitors trendtacticsdigital.com and coordinates all client interactions.",
    keyFunctions: [
      "Lead detection & qualification",
      "Automated client nurturing",
      "Service orchestration",
      "Revenue optimization",
      "Team coordination",
      "Website monitoring",
      "Client journey management",
      "Upselling & cross-selling",
      "Retention & advocacy"
    ]
  },
  {
    name: "OnboardingAgent",
    shortName: "OA",
    role: "Client Onboarding Specialist",
    description: "Formalizes client onboarding, collecting necessary information, setting up projects, and preparing clients for service delivery.",
    keyFunctions: [
      "Client information collection",
      "Project creation",
      "Initial service assignment",
      "Welcome pack dispatch",
      "Contract management",
      "Payment processing",
      "Service handoff coordination"
    ]
  },
  {
    name: "WebWiz",
    role: "Web Design & Development",
    description: "Creates and develops websites, encompassing wireframing, mockups, coding, and deployment, with CMS integration capabilities.",
    keyFunctions: [
      "Wireframe generation",
      "Mockup creation",
      "Code generation (HTML, CSS, JS)",
      "Website deployment",
      "CMS integration"
    ]
  },
  {
    name: "RankRover",
    role: "SEO Optimization",
    description: "Conducts comprehensive SEO audits, keyword research, provides optimization recommendations, generates content briefs, and monitors search performance.",
    keyFunctions: [
      "SEO auditing",
      "Keyword research",
      "SEO recommendation generation",
      "Content brief creation",
      "Ranking monitoring"
    ]
  },
  {
    name: "StratoBoss",
    role: "Strategy Consultant",
    description: "Formulates overarching digital marketing strategies, market analysis, competitive intelligence, and strategic roadmaps.",
    keyFunctions: [
      "Market analysis",
      "Strategy development",
      "Roadmap creation",
      "Competitor analysis"
    ]
  },
  {
    name: "Promptify",
    role: "Prompt Engineer",
    description: "Dynamically generates and refines prompts for all other AI agents to ensure optimal output from LLMs and image generation models, learning from feedback.",
    keyFunctions: [
      "Prompt generation",
      "Prompt refinement",
      "Feedback learning",
      "Model selection optimization"
    ]
  },
  {
    name: "AdGenie",
    role: "Ad Copywriter & Campaign Manager",
    description: "Writes engaging ad copy, creates variations, and manages digital advertising campaigns across various platforms.",
    keyFunctions: [
      "Ad copy generation",
      "Creative variation generation",
      "Campaign setup",
      "Performance monitoring",
      "Bid adjustment"
    ]
  },
  {
    name: "MailMage",
    role: "Email Marketer",
    description: "Designs and executes email marketing campaigns, manages contact lists, and handles email dispatch.",
    keyFunctions: [
      "Email campaign design",
      "Email copy writing",
      "Contact list management",
      "Email sending"
    ]
  },
  {
    name: "PostPilot",
    role: "Social Media Manager & Video Publisher",
    description: "Plans, schedules, publishes, and manages social media content across various platforms and handles video uploads and management for platforms like YouTube.",
    keyFunctions: [
      "Content calendar planning",
      "Caption/hashtag generation",
      "Post publishing",
      "Audience engagement",
      "YouTube video upload and metadata management"
    ]
  },
  {
    name: "PulseTrack",
    role: "Performance Analytics",
    description: "Collects, analyzes, and visualizes performance data from all marketing channels, generating reports, identifying trends, and tracking client ad spend against budget.",
    keyFunctions: [
      "Data collection",
      "Performance analysis",
      "Report generation",
      "Trend identification",
      "Ad spend monitoring",
      "Budget alerts"
    ]
  },
  {
    name: "ContentCrafter",
    role: "Long-form Content Writer",
    description: "Generates comprehensive long-form content such as articles, whitepapers, case studies, and website copy, adapting tone and style to client briefs.",
    keyFunctions: [
      "Topic research",
      "Content writing",
      "Content formatting",
      "SEO optimization"
    ]
  },
  {
    name: "BlogSmith",
    role: "Blog Writer",
    description: "Specializes in writing engaging and SEO-friendly blog posts, manages blog calendars, and facilitates direct publishing.",
    keyFunctions: [
      "Blog idea generation",
      "Blog post writing",
      "Image integration",
      "CMS publishing"
    ]
  },
  {
    name: "BookSmith",
    role: "Book Writing AI",
    description: "Assists in the creation of full-length books, from outlining to drafting content, and coordinates with EbookStylist.",
    keyFunctions: [
      "Book outlining",
      "Chapter drafting",
      "Narrative refinement"
    ]
  },
  {
    name: "CourseCraft",
    role: "Course Generator AI",
    description: "Develops online course content, including lesson plans, video scripts, quizzes, and educational structures.",
    keyFunctions: [
      "Curriculum design",
      "Lesson content writing",
      "Quiz generation",
      "Video script creation"
    ]
  },
  {
    name: "PixelWitch",
    role: "AI Image Generator",
    description: "Generates unique, high-quality images and graphics based on textual prompts or existing assets, supporting various styles and manipulations.",
    keyFunctions: [
      "Image generation from prompt",
      "Image upscaling",
      "Image editing",
      "Style application"
    ],
    models: ['openai/dall-e-3', 'stability/stable-diffusion-xl', 'google/imagefx'],
    pickModel: (prompt) => {
      const p = prompt.toLowerCase();
      if (p.includes('anime') || p.includes('manga')) return 'stability/stable-diffusion-xl';
      if (p.includes('photo') || p.includes('realistic') || p.includes('hyper-realistic')) return 'openai/dall-e-3';
      if (p.includes('google') || p.includes('imagefx')) return 'google/imagefx';
      return 'openai/dall-e-3'; // default
    }
  },
  {
    name: "DesignDex",
    role: "Graphic Designer",
    description: "Creates professional graphic designs for branding, marketing materials, social media, and web elements, utilizing PixelWitch and integrating design principles.",
    keyFunctions: [
      "Logo design",
      "Branding guideline creation",
      "Marketing collateral design",
      "UI element creation"
    ],
    models: ['openai/dall-e-3', 'stability/stable-diffusion-xl'],
    pickModel: (prompt) => {
      const p = prompt.toLowerCase();
      if (p.includes('logo') || p.includes('vector')) return 'stability/stable-diffusion-xl';
      return 'openai/dall-e-3';
    }
  },
  {
    name: "ClipCrafter",
    role: "Video Editor",
    description: "Edits raw video footage, applying transitions, effects, text overlays, and audio enhancements, optimizing videos for various platforms.",
    keyFunctions: [
      "Video trimming",
      "Transition addition",
      "Effect application",
      "Text overlay",
      "Audio syncing"
    ]
  },
  {
    name: "Trendywood",
    role: "Full Video Production AI",
    description: "Manages end-to-end video production, from scriptwriting and storyboarding to generating animated scenes, voiceovers, and final video rendering. Utilizes ClipCrafter and SonicVibe, and signals PostPilot for publishing.",
    keyFunctions: [
      "Video script writing",
      "Storyboard creation",
      "Animation generation",
      "Voiceover production",
      "Final video rendering",
      "Publishing readiness signaling"
    ]
  },
  {
    name: "SonicVibe",
    role: "Music Generator",
    description: "Composes original music, soundtracks, and sound effects for videos, podcasts, and other media, adapting to various genres and moods.",
    keyFunctions: [
      "Music composition",
      "Sound effect generation",
      "Genre adaptation"
    ]
  },
  {
    name: "PoeticAI",
    role: "Poem & Spoken Word Creator",
    description: "Crafts original poems, spoken word pieces, and lyrical content for marketing campaigns, artistic projects, or unique brand messaging.",
    keyFunctions: [
      "Poem creation",
      "Spoken word generation",
      "Lyrical content development"
    ]
  },
  {
    name: "BizDevStrategist",
    role: "Business Development Strategist",
    description: "Identifies new market opportunities, potential partnerships, and analyzes industry trends to propose strategies for agency growth and service expansion.",
    keyFunctions: [
      "Market opportunity identification",
      "Partnership proposal",
      "Industry trend analysis",
      "Growth strategy development"
    ]
  },
  {
    name: "EbookStylist",
    role: "Ebook Formatting & Design",
    description: "Takes raw book content from BookSmith and formats it into professional, visually appealing ebooks, ensuring cross-device compatibility and publishing readiness.",
    keyFunctions: [
      "Ebook layout formatting",
      "Ebook cover design",
      "Reader optimization",
      "Publishing file generation"
    ]
  },
  {
    name: "TrendScout",
    role: "Trend Analysis & Forecasting",
    description: "Continuously monitors digital marketing trends, consumer behavior shifts, and technological advancements, providing forecasts and actionable insights to StratoBoss and other agents.",
    keyFunctions: [
      "Trend monitoring",
      "Consumer behavior analysis",
      "Future trend forecasting",
      "Actionable insight provision"
    ]
  },
  {
    name: "FeedbackLoop",
    role: "Human Feedback Processor",
    description: "Processes and structures human feedback from the dashboard, ensuring feedback is properly logged, categorized, and made actionable for Promptify and other agents' continuous improvement.",
    keyFunctions: [
      "Feedback logging",
      "Feedback categorization",
      "Feedback routing for learning",
      "Agent improvement tracking"
    ]
  },
  {
    name: "FunnelManager",
    role: "Funnel Creation & Management Specialist",
    description: "Designs, configures, and manages marketing and sales funnels tailored to specific campaigns, products, or client needs. Automates funnel setup, tracks performance, and suggests optimizations.",
    keyFunctions: [
      "Funnel blueprint creation (lead magnet, tripwire, core offer, upsell, etc.)",
      "Custom funnel setup for different products/services",
      "Integration with email, ads, landing pages, and analytics",
      "Real-time funnel performance tracking and reporting",
      "Automated A/B testing and optimization suggestions",
      "Funnel cloning, archiving, and versioning"
    ]
  },
  {
    name: "ArticleRewriter",
    role: "Content Paraphrasing & Repurposing Specialist",
    description: "Takes existing articles and rewrites them for freshness, SEO, or different audiences, ensuring originality, clarity, and quality. Can adapt tone, length, and style as needed.",
    keyFunctions: [
      "Accepts article URLs, text, or file uploads for rewriting",
      "Paraphrases content while preserving core meaning",
      "Option to adjust tone (formal, casual, persuasive, etc.)",
      "SEO keyword integration and optimization",
      "Plagiarism checking and uniqueness assurance",
      "Generates multiple rewrite versions if needed"
    ]
  },
  {
    name: "EbookSalesAgent",
    shortName: "ESA",
    role: "Ebook Sales & Marketing Specialist",
    description: "Manages ebook sales funnel, creates sales pages, handles pricing strategies, and optimizes conversion rates for ebook sales on trendtacticsdigital.com.",
    keyFunctions: [
      "Sales page creation",
      "Pricing strategy optimization",
      "Conversion rate optimization",
      "Sales funnel management",
      "Customer support automation",
      "Revenue tracking"
    ]
  },
  {
    name: "CourseSalesAgent",
    shortName: "CSA",
    role: "Online Course Sales Specialist",
    description: "Manages online course sales, creates compelling course descriptions, handles enrollment processes, and optimizes course sales performance.",
    keyFunctions: [
      "Course description writing",
      "Enrollment process management",
      "Student onboarding",
      "Course sales optimization",
      "Student support automation",
      "Revenue maximization"
    ]
  },
  {
    name: "WebsiteMonitor",
    shortName: "WM",
    role: "Website Performance Monitor",
    description: "Continuously monitors trendtacticsdigital.com performance, tracks visitor behavior, identifies conversion opportunities, and alerts ClientFlow of new leads.",
    keyFunctions: [
      "Website performance monitoring",
      "Visitor behavior tracking",
      "Lead detection",
      "Conversion opportunity identification",
      "Performance reporting",
      "Alert system management"
    ]
  },
  {
    name: "RevenueOptimizer",
    shortName: "RO",
    role: "Revenue Optimization Specialist",
    description: "Analyzes sales data, identifies revenue opportunities, optimizes pricing strategies, and implements upselling/cross-selling campaigns.",
    keyFunctions: [
      "Sales data analysis",
      "Revenue opportunity identification",
      "Pricing optimization",
      "Upselling campaign management",
      "Cross-selling strategy",
      "Revenue forecasting"
    ]
  },
  {
    name: "ClientSuccessAgent",
    shortName: "CSA",
    role: "Client Success & Retention Specialist",
    description: "Ensures client satisfaction, manages client relationships, handles support requests, and implements retention strategies.",
    keyFunctions: [
      "Client satisfaction monitoring",
      "Relationship management",
      "Support request handling",
      "Retention strategy implementation",
      "Client feedback collection",
      "Success metric tracking"
    ]
  }
]; 