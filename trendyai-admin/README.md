# 🚀 TrendyAI Admin Dashboard

A comprehensive AI-powered admin dashboard with cross-domain authentication between **Trendtactics Digital** and **TrendyAI** platforms.

## 🌟 Features

### 🔐 Cross-Domain Authentication
- **Unified Login System**: Single sign-on across both domains
- **Shared Sessions**: Authentication persists between `trendtacticsdigital.com` and `trendyai.com`
- **Role-Based Access**: Admin, demo, and guest user roles

### 🤖 Studio Mode (AI Agent Workspace)
- **Agent-to-Agent Messaging**: Send messages between any registered AI agents
- **Task Assignment**: Assign tasks from one agent to another, with real-time status and performance tracking
- **Automated Workflow**: One-click pipeline from TrendyAI Core → Promptify (Prompt Engineer) → Core (Verification) → Final Agent (Production) → Core (Review)
- **Collaboration Rooms**: Create and manage multi-agent collaboration sessions
- **Progress Tracker**: Visualize workflow steps and completion
- **Manual & Automated Modes**: Use manual assignment or automated pipeline for complex tasks

### 📊 Analytics Dashboard
- **Real-time Metrics**: Client count, project status, revenue tracking
- **Performance Charts**: Visual data representation with interactive charts
- **Agent Performance**: AI agent efficiency monitoring
- **Activity Feed**: Live updates and notifications

### 🛡️ Security & Performance
- **Service Worker**: Offline functionality and caching
- **Error Boundaries**: Comprehensive error handling
- **Input Validation**: XSS prevention and data sanitization
- **Rate Limiting**: Protection against abuse
- **Toast Notifications**: User feedback system

### 🎨 Modern UI/UX
- **Glassmorphic Design**: Beautiful, modern interface
- **Responsive Layout**: Mobile-first, fully responsive
- **Dark Mode Support**: Toggle between light and dark themes
- **Compact Header**: Smaller navigation, Trendtactics/TrendyAI grouped in a dropdown
- **Accessibility**: Keyboard navigation, ARIA labels, readable contrast
- **SEO Optimized**: Meta tags, sitemap, robots.txt

## 🏗️ Architecture

```
TrendyAi/
├── trendyai-admin/              # This project
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── utils/              # Utilities and helpers
│   │   ├── contexts/           # React contexts
│   │   └── hooks/              # Custom hooks
│   ├── public/                 # Static assets
│   └── package.json
└── trendtactics-website/        # Main agency website
    ├── src/
    ├── public/
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern browser with ES6+ support

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/trendyai.git
cd trendyai/trendyai-admin

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the dashboard.

## 🤖 Studio Mode Usage

### Manual Agent Communication
1. Go to **Studio Mode** from the navigation.
2. Use the **From Agent** and **To Agent** dropdowns to select any agents.
3. Type a message or task and click **Send Message** or **Assign Task**.
4. View communication history and agent status in real time.

### Automated Workflow
1. In Studio Mode, scroll to the **Automated Workflow** section.
2. Select the final agent (e.g., WebWiz, ContentCrafter).
3. Enter the client request/task.
4. Click **Start Automated Workflow**.
5. The system will:
   - Assign to Promptify for prompt engineering
   - Return to TrendyAI Core for verification
   - Assign to the final agent for production
   - Return to Core for review
6. Track progress in the visual tracker. Final results appear in the UI.

### Collaboration Rooms
- Create multi-agent rooms for complex tasks and see active collaborations.

## 🖥️ UI/UX Highlights
- **Compact Header**: Navigation links are smaller, and Trendtactics/TrendyAI are grouped in a dropdown to save space.
- **Hover Effects**: Navigation links highlight with cyan or white on hover for clarity.
- **Fully Responsive**: Works on all devices and screen sizes.
- **Dark Mode**: Toggle in the header.
- **Accessibility**: Keyboard navigation, ARIA labels, and readable contrast.

## 🛠️ Development & Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🐛 Troubleshooting

### Agent Communication/Automation Issues
- **Assign Task not working**: Ensure both agents are registered and available. Check browser console for errors.
- **Duplicate key warning**: All dynamic lists use unique keys; if you see this, reload or clear cache.
- **Workflow not progressing**: Check agent status and ensure all agents are initialized.

### General Issues
- See the main troubleshooting section below for authentication, cross-domain, and performance issues.

## 📄 License & Support

© 2025 Trendtactics Digital. All rights reserved.

For support and questions:
- Check the documentation
- Review the deployment guide
- Contact the development team

---

**This README is always kept up to date with the latest features, UI changes, and usage instructions.**
