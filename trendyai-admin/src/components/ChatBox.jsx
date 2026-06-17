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

const ChatBox = ({ agentFlow = ['TrendyAI Core', 'PromptWizard', 'Target Agent'], onClose, sourceAgentId = null }) => {
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
        service: 'puter', // Use Puter.js as default free service
        size: '1024x1024',
        quality: 'standard'
      });
      
      if (imageResult.success) {
        response = `I've generated an image based on your request: "${userMessage}". Here's what I created:`;
        mediaUrl = imageResult.imageUrl;
      } else {
        response = `I encountered an issue generating your image: ${imageResult.error}. ${imageResult.fallback?.note || ''}`;
        mediaUrl = imageResult.fallback?.imageUrl;
      }
    }
    // Check if this is a video request
    else if (lowerMessage.includes('video') || lowerMessage.includes('animation') || 
             currentAgent.includes('Video') || currentAgent.includes('Clip') || currentAgent.includes('Trendywood')) {
      
      const videoResult = await aiServiceIntegration.generateVideo(userMessage, {
        service: 'puter', // Use Puter.js as default free service
        duration: 10,
        quality: 'standard'
      });
      
      if (videoResult.success) {
        response = `I've created a video based on your request: "${userMessage}". Here's what I generated:`;
        mediaUrl = videoResult.videoUrl;
      } else {
        response = `I encountered an issue generating your video: ${videoResult.error}. ${videoResult.fallback?.note || ''}`;
        mediaUrl = videoResult.fallback?.videoUrl;
      }
    }
    // Check if this is an audio request
    else if (lowerMessage.includes('audio') || lowerMessage.includes('music') || lowerMessage.includes('sound') ||
             currentAgent.includes('Audio') || currentAgent.includes('Sonic')) {
      
      const audioResult = await aiServiceIntegration.generateAudio(userMessage, {
        service: 'puter', // Use Puter.js as default free service
        voice: 'alloy',
        speed: 1.0
      });
      
      if (audioResult.success) {
        response = `I've created audio based on your request: "${userMessage}". Here's what I generated:`;
        mediaUrl = audioResult.audioUrl;
      } else {
        response = `I encountered an issue generating your audio: ${audioResult.error}. ${audioResult.fallback?.note || ''}`;
      }
    }
    // Default to text response
    else {
      const textResult = await aiServiceIntegration.generateText(userMessage, {
        service: 'puter', // Use Puter.js as default free service
        model: 'gpt-3.5-turbo',
        maxTokens: 1000,
        temperature: 0.7
      });
      
      if (textResult.success) {
        response = textResult.text;
      } else {
        response = `I encountered an issue generating a response: ${textResult.error}. ${textResult.fallback?.note || ''}`;
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

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white shadow-lg rounded-xl flex flex-col w-80 max-w-full h-[420px] border-2 border-cyan-500">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-navy-900 text-white rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">{agentAvatars[agentFlow[0]]}</span>
          <span className="font-bold text-base">{agentFlow[0]}</span>
          {canRouteToStudioMode && (
            <FaExchangeAlt className="text-xs text-cyan-400" title="Can route to StudioMode" />
          )}
        </div>
        <button onClick={onClose} aria-label="Close chat" className="hover:text-red-400">
          <svg width="18" height="18" fill="currentColor"><line x1="4" y1="4" x2="14" y2="14" stroke="currentColor" strokeWidth="2"/><line x1="14" y1="4" x2="4" y2="14" stroke="currentColor" strokeWidth="2"/></svg>
        </button>
      </div>
      
      {/* Routing Status Indicator */}
      {routingStatus && (
        <div className="px-4 py-2 bg-cyan-500 text-navy-900 text-xs font-mono">
          {routingStatus === 'analyzing' && '🔍 Analyzing complexity...'}
          {routingStatus === 'routing' && '⚡ Routing to StudioMode...'}
          {routingStatus === 'error' && '❌ Routing failed'}
        </div>
      )}
      
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 bg-slate-50" style={{ minHeight: 0 }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}> 
            <div className={`rounded-lg px-3 py-2 max-w-[80%] text-sm shadow ${msg.sender === 'You' ? 'bg-cyan-500 text-navy-900' : 'bg-white text-navy-900'}`}
              aria-label={`${msg.sender} message`}
            >
              <div className="font-semibold mb-1">{msg.sender}</div>
              <div>{msg.text}</div>
              {msg.mediaUrl && (
                <div className="mt-2">
                  {msg.mediaUrl.includes('image') || msg.mediaUrl.includes('placeholder') ? (
                    <img 
                      src={msg.mediaUrl} 
                      alt="Generated content" 
                      className="w-full h-auto rounded-lg max-h-48 object-cover"
                    />
                  ) : msg.mediaUrl.includes('video') ? (
                    <video 
                      src={msg.mediaUrl} 
                      controls 
                      className="w-full h-auto rounded-lg max-h-48"
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
          <div className="flex justify-start mb-2">
            <div className="bg-white text-navy-900 rounded-lg px-3 py-2 text-sm shadow">
              <div className="font-semibold mb-1">{currentAgent}</div>
              <div className="flex items-center gap-1">
                <span>Typing</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-3 border-t border-cyan-500 bg-white rounded-b-xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={canRouteToStudioMode ? "Type your message (will route to StudioMode)..." : "Type your message..."}
            className="flex-1 px-3 py-2 border-2 border-cyan-500 rounded-lg focus:border-cyan-400 focus:outline-none text-sm bg-white text-navy-900"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-400 text-navy-900 rounded-lg transition-colors flex items-center gap-2"
          >
            <FaPaperPlane className="text-sm" />
          </button>
        </div>
        {canRouteToStudioMode && (
          <div className="text-xs text-cyan-600 mt-2 flex items-center gap-1">
            <FaExchangeAlt />
            <span>Connected to StudioMode routing system</span>
          </div>
        )}
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