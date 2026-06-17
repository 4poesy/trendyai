// Real-time Collaboration System
// Enables seamless collaboration between users and AI agents

export class CollaborationSystem {
  constructor() {
    this.rooms = new Map();
    this.users = new Map();
    this.agents = new Map();
    this.messages = new Map();
    this.sharedResources = new Map();
    this.collaborationHistory = [];
    this.realTimeConnections = new Map();
  }

  // Room Management
  createRoom(roomId, roomConfig = {}) {
    const room = {
      id: roomId,
      name: roomConfig.name || `Room ${roomId}`,
      type: roomConfig.type || 'general',
      users: new Set(),
      agents: new Set(),
      messages: [],
      sharedResources: new Map(),
      permissions: roomConfig.permissions || {},
      createdAt: Date.now(),
      lastActivity: Date.now(),
      status: 'active'
    };

    this.rooms.set(roomId, room);
    return room;
  }

  joinRoom(roomId, userId, userType = 'user') {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }

    if (userType === 'user') {
      room.users.add(userId);
    } else if (userType === 'agent') {
      room.agents.add(userId);
    }

    room.lastActivity = Date.now();
    
    // Notify other participants
    this.notifyRoomParticipants(roomId, {
      type: 'user_joined',
      userId,
      userType,
      timestamp: Date.now()
    });

    return room;
  }

  leaveRoom(roomId, userId, userType = 'user') {
    const room = this.rooms.get(roomId);
    if (!room) return;

    if (userType === 'user') {
      room.users.delete(userId);
    } else if (userType === 'agent') {
      room.agents.delete(userId);
    }

    room.lastActivity = Date.now();
    
    // Notify other participants
    this.notifyRoomParticipants(roomId, {
      type: 'user_left',
      userId,
      userType,
      timestamp: Date.now()
    });
  }

  // Message System
  sendMessage(roomId, senderId, message, messageType = 'text') {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }

    const messageObj = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      roomId,
      senderId,
      content: message,
      type: messageType,
      timestamp: Date.now(),
      reactions: new Map(),
      replies: [],
      metadata: {}
    };

    room.messages.push(messageObj);
    room.lastActivity = Date.now();

    // Store in global messages
    if (!this.messages.has(roomId)) {
      this.messages.set(roomId, []);
    }
    this.messages.get(roomId).push(messageObj);

    // Notify all participants
    this.notifyRoomParticipants(roomId, {
      type: 'new_message',
      message: messageObj
    });

    // Process agent responses if applicable
    this.processAgentResponses(roomId, messageObj);

    return messageObj;
  }

  async processAgentResponses(roomId, message) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    // Check if any agents should respond
    for (const agentId of room.agents) {
      const agent = this.agents.get(agentId);
      if (agent && agent.shouldRespond(message)) {
        const response = await agent.generateResponse(message, room);
        if (response) {
          this.sendMessage(roomId, agentId, response, 'agent_response');
        }
      }
    }
  }

  // Shared Resources
  shareResource(roomId, resourceId, resource, permissions = {}) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }

    const resourceObj = {
      id: resourceId,
      type: resource.type || 'file',
      name: resource.name || resourceId,
      content: resource.content,
      metadata: resource.metadata || {},
      permissions,
      sharedBy: resource.sharedBy,
      sharedAt: Date.now(),
      lastModified: Date.now(),
      version: 1
    };

    room.sharedResources.set(resourceId, resourceObj);
    
    // Store globally
    if (!this.sharedResources.has(roomId)) {
      this.sharedResources.set(roomId, new Map());
    }
    this.sharedResources.get(roomId).set(resourceId, resourceObj);

    // Notify participants
    this.notifyRoomParticipants(roomId, {
      type: 'resource_shared',
      resource: resourceObj
    });

    return resourceObj;
  }

  updateResource(roomId, resourceId, updates) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const resource = room.sharedResources.get(resourceId);
    if (!resource) return null;

    const updatedResource = {
      ...resource,
      ...updates,
      lastModified: Date.now(),
      version: resource.version + 1
    };

    room.sharedResources.set(resourceId, updatedResource);
    
    // Update global storage
    if (this.sharedResources.has(roomId)) {
      this.sharedResources.get(roomId).set(resourceId, updatedResource);
    }

    // Notify participants
    this.notifyRoomParticipants(roomId, {
      type: 'resource_updated',
      resource: updatedResource
    });

    return updatedResource;
  }

  // Real-time Notifications
  notifyRoomParticipants(roomId, notification) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const allParticipants = [...room.users, ...room.agents];
    
    allParticipants.forEach(participantId => {
      const connection = this.realTimeConnections.get(participantId);
      if (connection && connection.isActive) {
        connection.send(JSON.stringify({
          roomId,
          notification
        }));
      }
    });
  }

  // Agent Integration
  registerAgent(agentId, agentConfig) {
    const agent = {
      id: agentId,
      name: agentConfig.name,
      type: agentConfig.type,
      capabilities: agentConfig.capabilities || [],
      shouldRespond: agentConfig.shouldRespond || (() => false),
      generateResponse: agentConfig.generateResponse || (() => null),
      isActive: true,
      lastActivity: Date.now()
    };

    this.agents.set(agentId, agent);
    return agent;
  }

  // User Management
  registerUser(userId, userConfig) {
    const user = {
      id: userId,
      name: userConfig.name,
      role: userConfig.role || 'user',
      permissions: userConfig.permissions || {},
      isOnline: true,
      lastActivity: Date.now(),
      currentRoom: null
    };

    this.users.set(userId, user);
    return user;
  }

  // Real-time Connection Management
  establishConnection(userId, connection) {
    const connectionObj = {
      id: userId,
      connection,
      isActive: true,
      establishedAt: Date.now(),
      lastPing: Date.now(),
      send: (data) => {
        if (connectionObj.isActive) {
          try {
            connection.send(data);
          } catch (error) {
            connectionObj.isActive = false;
          }
        }
      }
    };

    this.realTimeConnections.set(userId, connectionObj);
    
    // Update user status
    const user = this.users.get(userId);
    if (user) {
      user.isOnline = true;
      user.lastActivity = Date.now();
    }
  }

  closeConnection(userId) {
    const connection = this.realTimeConnections.get(userId);
    if (connection) {
      connection.isActive = false;
      this.realTimeConnections.delete(userId);
    }

    // Update user status
    const user = this.users.get(userId);
    if (user) {
      user.isOnline = false;
    }
  }

  // Collaboration Analytics
  getCollaborationAnalytics(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const messages = this.messages.get(roomId) || [];
    const resources = this.sharedResources.get(roomId) || new Map();

    return {
      roomId,
      totalMessages: messages.length,
      totalUsers: room.users.size,
      totalAgents: room.agents.size,
      totalResources: resources.size,
      lastActivity: room.lastActivity,
      messageTypes: this.analyzeMessageTypes(messages),
      userActivity: this.analyzeUserActivity(messages),
      resourceUsage: this.analyzeResourceUsage(resources)
    };
  }

  analyzeMessageTypes(messages) {
    const types = {};
    messages.forEach(msg => {
      types[msg.type] = (types[msg.type] || 0) + 1;
    });
    return types;
  }

  analyzeUserActivity(messages) {
    const activity = {};
    messages.forEach(msg => {
      activity[msg.senderId] = (activity[msg.senderId] || 0) + 1;
    });
    return activity;
  }

  analyzeResourceUsage(resources) {
    const usage = {};
    resources.forEach((resource, id) => {
      usage[resource.type] = (usage[resource.type] || 0) + 1;
    });
    return usage;
  }

  // Search and Discovery
  searchMessages(roomId, query, filters = {}) {
    const messages = this.messages.get(roomId) || [];
    
    return messages.filter(msg => {
      // Text search
      if (query && !msg.content.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      
      // Type filter
      if (filters.type && msg.type !== filters.type) {
        return false;
      }
      
      // Sender filter
      if (filters.senderId && msg.senderId !== filters.senderId) {
        return false;
      }
      
      // Date range filter
      if (filters.startDate && msg.timestamp < filters.startDate) {
        return false;
      }
      
      if (filters.endDate && msg.timestamp > filters.endDate) {
        return false;
      }
      
      return true;
    });
  }

  searchResources(roomId, query, filters = {}) {
    const resources = this.sharedResources.get(roomId) || new Map();
    const results = [];
    
    resources.forEach((resource, id) => {
      // Text search
      if (query && !resource.name.toLowerCase().includes(query.toLowerCase())) {
        return;
      }
      
      // Type filter
      if (filters.type && resource.type !== filters.type) {
        return;
      }
      
      // Permission filter
      if (filters.requirePermission && !resource.permissions[filters.requirePermission]) {
        return;
      }
      
      results.push(resource);
    });
    
    return results;
  }

  // Export/Import
  exportRoomData(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    return {
      room: {
        id: room.id,
        name: room.name,
        type: room.type,
        createdAt: room.createdAt,
        lastActivity: room.lastActivity
      },
      messages: this.messages.get(roomId) || [],
      resources: Array.from((this.sharedResources.get(roomId) || new Map()).values()),
      users: Array.from(room.users),
      agents: Array.from(room.agents)
    };
  }

  importRoomData(data) {
    const room = this.createRoom(data.room.id, {
      name: data.room.name,
      type: data.room.type
    });

    // Import messages
    if (data.messages) {
      this.messages.set(room.id, data.messages);
      room.messages = data.messages;
    }

    // Import resources
    if (data.resources) {
      data.resources.forEach(resource => {
        room.sharedResources.set(resource.id, resource);
      });
      
      this.sharedResources.set(room.id, room.sharedResources);
    }

    // Import participants
    if (data.users) {
      data.users.forEach(userId => room.users.add(userId));
    }

    if (data.agents) {
      data.agents.forEach(agentId => room.agents.add(agentId));
    }

    return room;
  }

  // Cleanup and Maintenance
  cleanupInactiveRooms(maxInactiveTime = 24 * 60 * 60 * 1000) { // 24 hours
    const now = Date.now();
    const toDelete = [];

    this.rooms.forEach((room, roomId) => {
      if (now - room.lastActivity > maxInactiveTime) {
        toDelete.push(roomId);
      }
    });

    toDelete.forEach(roomId => {
      this.rooms.delete(roomId);
      this.messages.delete(roomId);
      this.sharedResources.delete(roomId);
    });

    return toDelete.length;
  }

  // Get system statistics
  getSystemStats() {
    return {
      totalRooms: this.rooms.size,
      totalUsers: this.users.size,
      totalAgents: this.agents.size,
      totalMessages: Array.from(this.messages.values()).reduce((sum, msgs) => sum + msgs.length, 0),
      totalResources: Array.from(this.sharedResources.values()).reduce((sum, resources) => sum + resources.size, 0),
      activeConnections: Array.from(this.realTimeConnections.values()).filter(conn => conn.isActive).length
    };
  }
}

// Initialize the global collaboration system
export const globalCollaborationSystem = new CollaborationSystem();

// Pre-configured agent types for collaboration
export const collaborationAgentTypes = {
  'DesignDex': {
    name: 'DesignDex',
    type: 'design',
    capabilities: ['logo_creation', 'brand_design', 'visual_content'],
    shouldRespond: (message) => {
      const content = message.content.toLowerCase();
      return content.includes('design') || content.includes('logo') || content.includes('visual');
    },
    generateResponse: async (message, room) => {
      // Simulate intelligent response generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `I can help with that design request! Based on the context, I recommend focusing on modern, professional aesthetics. Would you like me to create some initial concepts?`;
    }
  },
  
  'ContentCrafter': {
    name: 'ContentCrafter',
    type: 'content',
    capabilities: ['copywriting', 'content_strategy', 'brand_messaging'],
    shouldRespond: (message) => {
      const content = message.content.toLowerCase();
      return content.includes('copy') || content.includes('content') || content.includes('write');
    },
    generateResponse: async (message, room) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return `I'd be happy to help with the content creation! I can craft compelling copy that aligns with your brand voice and target audience. What's the main message you want to convey?`;
    }
  },
  
  'WebWiz': {
    name: 'WebWiz',
    type: 'development',
    capabilities: ['web_development', 'ui_implementation', 'performance_optimization'],
    shouldRespond: (message) => {
      const content = message.content.toLowerCase();
      return content.includes('website') || content.includes('web') || content.includes('development');
    },
    generateResponse: async (message, room) => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return `I can assist with the web development needs! I specialize in creating responsive, modern websites with optimal performance. What specific features are you looking to implement?`;
    }
  }
};

// Register default agent types
Object.entries(collaborationAgentTypes).forEach(([agentId, config]) => {
  globalCollaborationSystem.registerAgent(agentId, config);
}); 