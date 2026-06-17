# Agent Routing System Documentation

## Overview

The Agent Routing System is a sophisticated integration layer that seamlessly connects AgentGrid agents to StudioMode agents, enabling intelligent task routing and workflow orchestration between the two systems.

## Architecture

```
AgentGrid Agents → Agent Routing System → StudioMode Agents
     ↓                    ↓                    ↓
  User Input → Complexity Analysis → Optimized Execution
```

## Key Components

### 1. Agent Routing System (`agentRoutingSystem.js`)

The core routing engine that handles:
- Agent mapping between AgentGrid and StudioMode
- Task complexity analysis
- Workflow selection (two-tier, single-tier, direct)
- Performance tracking and metrics

### 2. ChatBox Integration (`ChatBox.jsx`)

Enhanced chat component that:
- Detects when an AgentGrid agent can route to StudioMode
- Shows routing status and progress
- Handles fallback to direct AI responses
- Displays routing indicators and connection status

### 3. StudioMode Integration (`StudioModeIntegration.jsx`)

Dashboard component that provides:
- Real-time routing statistics
- Agent mapping visualization
- Recent routing history
- Test routing functionality
- Active connection monitoring

## Agent Mapping

### AgentGrid → StudioMode Mapping

| AgentGrid Agent | StudioMode Agent | Purpose |
|----------------|------------------|---------|
| `trendyai-core` | `TrendyAI Core` | Central orchestrator |
| `clientflow` | `ClientFlow` | Client management |
| `onboarding-agent` | `ONBOARDING AGENT` | Client onboarding |
| `bizdev-strategist` | `BizDevStrategist` | Business development |
| `content-crafter` | `ContentCrafter` | Content creation |
| `blogsmith` | `BlogSmith` | Blog content |
| `booksmith` | `BookSmith` | E-book creation |
| `rankrover` | `RankRover` | SEO optimization |
| `adgenie` | `AdGenie` | Ad copy creation |
| `mailmage` | `MailMage` | Email marketing |
| `postpilot` | `PostPilot` | Social media posts |
| `pixelwitch` | `PixelWitch` | Image generation |
| `designdex` | `DesignDex` | Graphic design |
| `clipcrafter` | `ClipCrafter` | Video editing |
| `trendywood` | `Trendywood` | Video production |
| `sonicvibe` | `SonicVibe` | Audio production |
| `stratoboss` | `StratoBoss` | Strategic planning |
| `pulsetrack` | `PulseTrack` | Analytics tracking |
| `trendscout` | `TrendScout` | Market trends |
| `promptify` | `Promptify` | Prompt optimization |
| `coursecraft` | `CourseCraft` | Course creation |
| `ebookstylist` | `EbookStylist` | E-book styling |
| `poeticai` | `PoeticAI` | Creative writing |
| `feedbackloop` | `FeedbackLoop` | Feedback analysis |
| `promptwizard` | `PromptWizard` | Advanced prompts |
| `funnelmanager` | `FunnelManager` | Marketing funnels |
| `articlerewriter` | `ArticleRewriter` | Content rewriting |

## Workflow Types

### 1. Two-Tier Workflow (High-Level Strategy)

**Triggered when:** Task complexity score ≥ 5

**Process:**
1. **PromptWizard** → Creates strategic framework
2. **Promptify** → Optimizes execution prompt
3. **Target Agent** → Executes with precision

**Use cases:**
- Brand identity design
- Video campaigns
- Business strategy
- Complex marketing plans

### 2. Single-Tier Workflow (Moderate Complexity)

**Triggered when:** Task complexity score 2-4

**Process:**
1. **Promptify** → Crafts optimized prompt
2. **Target Agent** → Executes with enhanced precision

**Use cases:**
- Content creation
- Design projects
- SEO optimization
- Social media campaigns

### 3. Direct Workflow (Simple Tasks)

**Triggered when:** Task complexity score < 2

**Process:**
1. **Target Agent** → Direct execution

**Use cases:**
- Simple image generation
- Basic copywriting
- Quick edits
- Simple queries

## Complexity Analysis

The system analyzes task complexity based on:

### Professional Keywords (Weight: 4x)
- `hyperrealistic`, `ultra-realistic`, `photorealistic`
- `professional`, `studio-quality`, `commercial-grade`
- `responsive`, `mobile-first`, `cross-platform`
- `enterprise`, `corporate`, `b2b`, `saas`

### Strategy Keywords (Weight: 3x)
- `strategy`, `campaign`, `plan`, `approach`
- `comprehensive`, `complete`, `end-to-end`
- `multi-channel`, `cross-platform`, `brand`
- `market`, `audience`, `competitive`, `analysis`

### Complex Keywords (Weight: 2x)
- `multiple`, `various`, `different`, `diverse`
- `collection`, `suite`, `package`, `bundle`
- `combination`, `integration`, `coordination`
- `management`, `administration`, `supervision`

### Simple Keywords (Weight: -1x)
- `single`, `one`, `simple`, `basic`
- `quick`, `fast`, `immediate`, `direct`
- `minor`, `small`, `tiny`, `brief`

### Additional Factors
- **Message length:** >20 words adds 2 points
- **Multiple requests:** Adds 3 points
- **Specific details:** Adds 1 point
- **Agent type:** Strategy agents get +2 points
- **Brand/identity design:** +3 points
- **Video campaigns:** +3 points

## Usage Examples

### Example 1: High-Complexity Request

**User Input:** "Create a comprehensive brand identity system with hyperrealistic logo designs, responsive website mockups, and professional marketing materials for our enterprise SaaS platform"

**Analysis:**
- Professional keywords: 6 (24 points)
- Strategy keywords: 3 (9 points)
- Complex keywords: 2 (4 points)
- Message length: >20 words (2 points)
- Brand/identity design: +3 points
- **Total: 42 points** → Two-tier workflow

**Result:** PromptWizard → Promptify → DesignDex

### Example 2: Moderate-Complexity Request

**User Input:** "Write compelling ad copy for our social media campaign with SEO optimization"

**Analysis:**
- Professional keywords: 1 (4 points)
- Strategy keywords: 1 (3 points)
- Complex keywords: 1 (2 points)
- **Total: 9 points** → Single-tier workflow

**Result:** Promptify → AdGenie

### Example 3: Simple Request

**User Input:** "Generate a simple logo"

**Analysis:**
- Simple keywords: 1 (-1 point)
- **Total: -1 points** → Direct workflow

**Result:** DesignDex (direct execution)

## Performance Metrics

The system tracks:

- **Total Routings:** Number of routing attempts
- **Success Rate:** Percentage of successful routings
- **Average Response Time:** Mean time for routing completion
- **Active Connections:** Currently processing routings
- **Recent Routings:** Last 10 routing attempts with details

## Integration Points

### AgentGrid Integration

1. **ChatBox Enhancement:**
   - Detects `sourceAgentId` prop
   - Checks routing capability
   - Shows routing status indicators
   - Handles fallback scenarios

2. **AgentGridNew Updates:**
   - Passes `sourceAgentId` to ChatBox
   - Enables routing for all AgentGrid agents

### StudioMode Integration

1. **StudioModeIntegration Component:**
   - Real-time statistics dashboard
   - Agent mapping visualization
   - Test routing functionality
   - Active connection monitoring

2. **StudioMode Updates:**
   - Integrates StudioModeIntegration in intelligence section
   - Handles agent activation callbacks
   - Shows workflow completion notifications

## Error Handling

### Routing Failures

1. **Fallback Strategy:**
   - Attempts direct AI response
   - Shows error message to user
   - Logs failure for analysis

2. **Common Issues:**
   - Missing agent mapping
   - API service failures
   - Network connectivity issues
   - Invalid agent configurations

### Recovery Mechanisms

1. **Automatic Retry:** Failed routings are retried once
2. **Graceful Degradation:** Falls back to direct AI responses
3. **User Notification:** Clear error messages with suggestions
4. **Logging:** Comprehensive error logging for debugging

## Configuration

### Environment Variables

```bash
# Optional: Custom routing thresholds
ROUTING_COMPLEXITY_HIGH=5
ROUTING_COMPLEXITY_MODERATE=2

# Optional: Performance monitoring
ENABLE_ROUTING_METRICS=true
ROUTING_HISTORY_SIZE=100
```

### API Configuration

The system uses the same API configuration as the main AI service integration:

- OpenRouter (primary)
- OpenAI (fallback)
- Stability AI (images)
- Anthropic (text)

## Testing

### Manual Testing

1. **AgentGrid Testing:**
   - Open any AgentGrid agent chat
   - Send a request with professional keywords
   - Verify routing to StudioMode
   - Check response quality

2. **StudioMode Testing:**
   - Navigate to StudioMode → Intelligence
   - Use test routing functionality
   - Verify agent activation
   - Check statistics updates

### Automated Testing

```javascript
// Test routing functionality
const result = await globalAgentRoutingSystem.routeToStudioMode(
  'trendyai-core', 
  'Create a professional logo design',
  { testMode: true }
);

console.log('Routing result:', result);
```

## Future Enhancements

### Planned Features

1. **Advanced Analytics:**
   - Routing pattern analysis
   - Performance optimization suggestions
   - User behavior insights

2. **Dynamic Workflows:**
   - Machine learning-based workflow selection
   - Adaptive complexity thresholds
   - Personalized routing strategies

3. **Enhanced Integration:**
   - Real-time collaboration between agents
   - Cross-system memory sharing
   - Unified agent management

4. **Advanced Monitoring:**
   - Real-time performance dashboards
   - Predictive failure detection
   - Automated optimization

## Troubleshooting

### Common Issues

1. **Routing Not Working:**
   - Check agent mapping configuration
   - Verify API keys are set
   - Ensure network connectivity

2. **Poor Response Quality:**
   - Review complexity analysis
   - Check prompt optimization
   - Verify agent capabilities

3. **Performance Issues:**
   - Monitor response times
   - Check API rate limits
   - Review system resources

### Debug Mode

Enable debug logging:

```javascript
// Enable detailed logging
globalAgentRoutingSystem.debugMode = true;

// Check routing stats
console.log(globalAgentRoutingSystem.getRoutingStats());

// Test specific routing
const testResult = await globalAgentRoutingSystem.routeToStudioMode(
  'test-agent',
  'test message',
  { debug: true }
);
```

## Support

For issues or questions about the Agent Routing System:

1. Check the troubleshooting section
2. Review the performance metrics
3. Test with the provided examples
4. Contact the development team

---

**Version:** 1.0.0  
**Last Updated:** 2024-01-06  
**Maintainer:** TrendyAI Development Team 