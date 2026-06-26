import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaImage, FaVideo, FaMusic, FaExchangeAlt } from 'react-icons/fa';
import { aiServiceIntegration } from '../utils/aiServiceIntegration';
import { globalAgentRoutingSystem } from '../utils/agentRoutingSystem';

const agentAvatars = {
  You: '🧑',
  'TrendyAI Core': '🤖',
  PromptWizard: '🧙',
  Promptify: '⚡',
  // Add more agent avatars as needed
};

const ChatBox = ({ agentFlow = ['TrendyAI Core', 'PromptWizard', 'Target Agent'], onClose, sourceAgentId = null, isInline = false }) => {
  const [messages, setMessages] = useState([
    {
      sender: agentFlow[0],
      text: `Hello! I am ${agentFlow[0]}. How can I help you today?`,
      isAgent: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentAgent] = useState(agentFlow[0]);
  const [routingStatus, setRoutingStatus] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Check if this agent can route to StudioMode
  const canRouteToStudioMode = sourceAgentId && globalAgentRoutingSystem.hasStudioModeMapping(sourceAgentId);

  const generateRealAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    try {
      // If this is an AgentGrid agent and can route to StudioMode, use the routing system
      if (canRouteToStudioMode) {
        await handleStudioModeRouting(userMessage);
      } else {
        // Use the existing AI service integration
        await handleDirectAIResponse(userMessage);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      setMessages((prev) => [
        ...prev,
        {
          sender: currentAgent,
          text: `I encountered an error processing your request. Please try again or check your API configuration.`,
          isAgent: true,
          timestamp: new Date(),
        },
      ]);
    }
    
    setIsTyping(false);
  };

  // Handle routing to StudioMode
  const handleStudioModeRouting = async (userMessage) => {
    setRoutingStatus('analyzing');
    
    // Step 1: Show routing analysis
    setMessages((prev) => [
      ...prev,
      {
        sender: currentAgent,
        text: `🔍 **Analyzing request complexity and routing strategy...**\n\nI'm evaluating your request to determine the optimal workflow and target agent.`,
        isAgent: true,
        timestamp: new Date(),
      },
    ]);

    // Step 2: Route to StudioMode
    const routingResult = await globalAgentRoutingSystem.routeToStudioMode(sourceAgentId, userMessage, {
      sourceComponent: 'agentgrid',
      userAgent: currentAgent
    });

    if (routingResult.success) {
      setRoutingStatus('routing');
      
      // Step 3: Show routing details
      setTimeout(() => {
        let routingMessage = '';
        
        if (routingResult.result.workflow === 'two-tier') {
          routingMessage = `🧙 **High-Level Strategy Detected!**

I'm using the advanced two-tier workflow:
1️⃣ **PromptWizard** → Creating strategic framework
2️⃣ **Promptify** → Optimizing execution prompt
3️⃣ **${routingResult.result.targetAgent}** → Executing with precision

This ensures comprehensive strategy and optimal execution.`;
        } else if (routingResult.result.workflow === 'single-tier') {
          routingMessage = `⚡ **Moderate Complexity Detected!**

I'm using the optimized single-tier workflow:
1️⃣ **Promptify** → Crafting optimized prompt
2️⃣ **${routingResult.result.targetAgent}** → Executing with enhanced precision

This balances efficiency with quality optimization.`;
        } else {
          routingMessage = `🚀 **Simple Task Detected!**

I'm using direct routing for maximum efficiency:
1️⃣ **${routingResult.result.targetAgent}** → Direct execution

This ensures fast, focused results for straightforward tasks.`;
        }
        
        setMessages((prev) => [
          ...prev,
          { sender: currentAgent, text: routingMessage, isAgent: true, timestamp: new Date() }
        ]);
        
        // Step 4: Show final result
        setTimeout(() => {
          const result = routingResult.result.result;
          let finalMessage = `🎯 **Task Completed Successfully!**

**Target Agent:** ${routingResult.result.targetAgent}
**Workflow Type:** ${routingResult.result.workflow}
**Response Time:** ${routingResult.responseTime}ms

`;
          
          if (result.type === 'image') {
            finalMessage += `${result.content}`;
            setMessages((prev) => [
              ...prev,
              { 
                sender: result.agent, 
                text: finalMessage, 
                isAgent: true, 
                timestamp: new Date(),
                mediaUrl: result.mediaUrl
              }
            ]);
          } else if (result.type === 'video') {
            finalMessage += `${result.content}`;
            setMessages((prev) => [
              ...prev,
              { 
                sender: result.agent, 
                text: finalMessage, 
                isAgent: true, 
                timestamp: new Date(),
                mediaUrl: result.mediaUrl
              }
            ]);
          } else if (result.type === 'audio') {
            finalMessage += `${result.content}`;
            setMessages((prev) => [
              ...prev,
              { 
                sender: result.agent, 
                text: finalMessage, 
                isAgent: true, 
                timestamp: new Date(),
                mediaUrl: result.mediaUrl
              }
            ]);
          } else if (result.type === 'text') {
            finalMessage += `${result.content}`;
            setMessages((prev) => [
              ...prev,
              { 
                sender: result.agent, 
                text: finalMessage, 
                isAgent: true, 
                timestamp: new Date()
              }
            ]);
          } else {
            finalMessage += `${result.content}`;
            setMessages((prev) => [
              ...prev,
              { 
                sender: result.agent, 
                text: finalMessage, 
                isAgent: true, 
                timestamp: new Date(),
                mediaUrl: result.mediaUrl
              }
            ]);
          }
          
          setRoutingStatus(null);
        }, 1200);
      }, 800);
    } else {
      // Handle routing failure
      setRoutingStatus('error');
      setMessages((prev) => [
        ...prev,
        {
          sender: currentAgent,
          text: `❌ **Routing Failed**

I encountered an issue routing your request to StudioMode: ${routingResult.error}

Falling back to direct AI response...`,
          isAgent: true,
          timestamp: new Date(),
        },
      ]);
      
      // Fallback to direct AI response
      setTimeout(() => {
        handleDirectAIResponse(userMessage);
      }, 1000);
    }
  };

  // Handle direct AI response (existing functionality)
  const handleDirectAIResponse = async (userMessage) => {
    // Determine the type of response based on the current agent and message content
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let mediaUrl = null;
    
    // Check if this is an image request
    if (lowerMessage.includes('image') || lowerMessage.includes('picture') || lowerMessage.includes('photo') || 
        lowerMessage.includes('logo') || lowerMessage.includes('banner') || lowerMessage.includes('design') ||
        currentAgent.includes('Design') || currentAgent.includes('Pixel') || currentAgent.includes('Visual')) {
      
      const imageResult = await aiServiceIntegration.generateImage(userMessage, {
        agentId: sourceAgentId || 'pixeldex',
        size: '1024x1024',
        quality: 'standard'
      });
      
      if (imageResult.success) {
        response = `I've generated an image based on your request: "${userMessage}". Here's what I created:`;
        mediaUrl = imageResult.imageUrl;
      } else {
        response = `I encountered an issue generating your image: ${imageResult.error}`;
      }
    }
    // Check if this is a video request
    else if (lowerMessage.includes('video') || lowerMessage.includes('animation') || 
             currentAgent.includes('Video') || currentAgent.includes('Clip') || currentAgent.includes('Trendywood')) {
      
      const videoResult = await aiServiceIntegration.generateVideo(userMessage, {
        agentId: sourceAgentId || 'mediawiz',
        duration: 10,
        quality: 'standard'
      });
      
      if (videoResult.success) {
        response = `I've created a video based on your request: "${userMessage}". Here's what I generated:`;
        mediaUrl = videoResult.videoUrl;
      } else {
        response = `I encountered an issue generating your video: ${videoResult.error}`;
      }
    }
    // Check if this is an audio request
    else if (lowerMessage.includes('audio') || lowerMessage.includes('music') || lowerMessage.includes('sound') ||
             currentAgent.includes('Audio') || currentAgent.includes('Sonic')) {
      
      const audioResult = await aiServiceIntegration.generateAudio(userMessage, {
        agentId: sourceAgentId || 'mediawiz',
        voice: 'alloy',
        speed: 1.0
      });
      
      if (audioResult.success) {
        response = `I've created audio based on your request: "${userMessage}". Here's what I generated:`;
        mediaUrl = audioResult.audioUrl;
      } else {
        response = `I encountered an issue generating your audio: ${audioResult.error}`;
      }
    }
    // Default to text response
    else {
      const textResult = await aiServiceIntegration.generateText(userMessage, {
        agentId: sourceAgentId || 'trendyai-core',
        model: 'gpt-3.5-turbo',
        maxTokens: 1000,
        temperature: 0.7
      });
      
      if (textResult.success) {
        response = textResult.text;
      } else {
        response = `I encountered an issue generating a response: ${textResult.error}`;
      }
    }
    
    setMessages((prev) => [
      ...prev,
      {
        sender: currentAgent,
        text: response,
        isAgent: true,
        timestamp: new Date(),
        mediaUrl: mediaUrl
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages((prev) => [
      ...prev,
      {
        sender: 'You',
        text: userMessage,
        isAgent: false,
        timestamp: new Date(),
      },
    ]);
    setInput('');
    await generateRealAIResponse(userMessage);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isInline) {
    return (
      <div className="w-full h-full flex flex-col bg-bg-card rounded-xl overflow-hidden shadow-inner">
        {/* Routing Status Indicator */}
        {routingStatus && (
          <div className="px-4 py-2.5 bg-primary/10 border-b border-border-main text-text-main text-xs font-mono">
            {routingStatus === 'analyzing' && '🔍 Analyzing complexity...'}
            {routingStatus === 'routing' && '⚡ Routing to StudioMode...'}
            {routingStatus === 'error' && '❌ Routing failed'}
          </div>
        )}
        
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 bg-bg-panel space-y-4" style={{ minHeight: 0 }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}> 
              <div className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm shadow-sm border ${
                msg.sender === 'You' 
                  ? 'bg-primary border-primary text-white font-medium' 
                  : 'bg-bg-card border-border-main text-text-main'
              }`}
                aria-label={`${msg.sender} message`}
              >
                <div className="font-bold text-[10px] mb-1.5 opacity-70 uppercase tracking-wider">{msg.sender}</div>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                {msg.mediaUrl && (
                  <div className="mt-3">
                    {msg.mediaUrl.includes('image') || msg.mediaUrl.includes('placeholder') ? (
                      <img 
                        src={msg.mediaUrl} 
                        alt="Generated content" 
                        className="w-full h-auto rounded-xl max-h-64 object-cover border border-border-main"
                      />
                    ) : msg.mediaUrl.includes('video') ? (
                      <video 
                        src={msg.mediaUrl} 
                        controls 
                        className="w-full h-auto rounded-xl max-h-64 border border-border-main"
                      />
                    ) : msg.mediaUrl.includes('audio') ? (
                      <audio 
                        src={msg.mediaUrl} 
                        controls 
                        className="w-full"
                      />
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-bg-card border border-border-main text-text-main rounded-2xl px-4 py-3 text-sm shadow-sm">
                <div className="font-bold text-[10px] mb-1 opacity-70 uppercase tracking-wider">{currentAgent}</div>
                <div className="flex items-center gap-1.5 font-medium text-text-sub">
                  <span>Thinking</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        
        {/* Input area */}
        <div className="p-4 border-t border-border-main bg-bg-card">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={canRouteToStudioMode ? "Type your message (will route to StudioMode)..." : "Type your message..."}
              className="flex-1 px-4 py-2.5 border border-border-main bg-bg-panel text-text-main rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm transition-all"
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:bg-bg-panel disabled:text-text-muted text-white rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer font-semibold text-sm border border-transparent shadow-sm hover:shadow"
            >
              <FaPaperPlane className="text-xs" />
            </button>
          </div>
          {canRouteToStudioMode && (
            <div className="text-[11px] text-text-sub mt-2 flex items-center gap-1.5 font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span>Connected to StudioMode routing system</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-bg-card shadow-2xl rounded-2xl flex flex-col w-80 max-w-full h-[420px] border-2 border-primary overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-white">
        <div className="flex items-center gap-2">
          <span className="text-xl">{agentAvatars[agentFlow[0]]}</span>
          <span className="font-bold text-sm tracking-tight">{agentFlow[0]}</span>
          {canRouteToStudioMode && (
            <FaExchangeAlt className="text-xs text-white/80" title="Can route to StudioMode" />
          )}
        </div>
        <button onClick={onClose} aria-label="Close chat" className="hover:text-red-400 cursor-pointer p-1">
          <FaTimes />
        </button>
      </div>
      
      {/* Routing Status Indicator */}
      {routingStatus && (
        <div className="px-4 py-1.5 bg-primary/20 text-text-main text-xs font-mono border-b border-border-main">
          {routingStatus === 'analyzing' && '🔍 Analyzing complexity...'}
          {routingStatus === 'routing' && '⚡ Routing to StudioMode...'}
          {routingStatus === 'error' && '❌ Routing failed'}
        </div>
      )}
      
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 bg-bg-panel space-y-3" style={{ minHeight: 0 }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}> 
            <div className={`rounded-xl px-3 py-2 max-w-[80%] text-sm shadow-sm border ${
              msg.sender === 'You' 
                ? 'bg-primary border-primary text-white font-medium' 
                : 'bg-bg-card border-border-main text-text-main'
            }`}
              aria-label={`${msg.sender} message`}
            >
              <div className="font-bold text-[9px] mb-1 opacity-70 uppercase">{msg.sender}</div>
              <div className="whitespace-pre-wrap">{msg.text}</div>
              {msg.mediaUrl && (
                <div className="mt-2">
                  {msg.mediaUrl.includes('image') || msg.mediaUrl.includes('placeholder') ? (
                    <img 
                      src={msg.mediaUrl} 
                      alt="Generated content" 
                      className="w-full h-auto rounded-lg max-h-40 object-cover border border-border-main"
                    />
                  ) : msg.mediaUrl.includes('video') ? (
                    <video 
                      src={msg.mediaUrl} 
                      controls 
                      className="w-full h-auto rounded-lg max-h-40 border border-border-main"
                    />
                  ) : msg.mediaUrl.includes('audio') ? (
                    <audio 
                      src={msg.mediaUrl} 
                      controls 
                      className="w-full"
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-bg-card border border-border-main text-text-main rounded-xl px-3 py-2 text-sm shadow-sm">
              <div className="font-bold text-[9px] mb-1 opacity-70 uppercase">{currentAgent}</div>
              <div className="flex items-center gap-1 text-text-sub font-medium">
                <span>Typing</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-3 border-t border-border-main bg-bg-card">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={canRouteToStudioMode ? "Type message (routes to Studio)..." : "Type message..."}
            className="flex-1 px-3 py-1.5 border border-border-main bg-bg-panel text-text-main rounded-lg focus:border-primary focus:outline-none text-xs"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-3 py-1.5 bg-primary hover:bg-primary-hover disabled:bg-bg-panel disabled:text-text-muted text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer"
          >
            <FaPaperPlane className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

/* Add this CSS to the file or in a global CSS file for custom scrollbar styling */
// .custom-scrollbar::-webkit-scrollbar {
//   width: 8px;
// }
// .custom-scrollbar::-webkit-scrollbar-thumb {
//   background: #00CCCC;
//   border-radius: 6px;
// }
// .custom-scrollbar::-webkit-scrollbar-track {
//   background: #e0e7ef;
//   border-radius: 6px;
// } 
