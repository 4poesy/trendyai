// Advanced Workflow Orchestration System
// Handles complex multi-agent workflows with intelligent routing and optimization

export class WorkflowOrchestrator {
  constructor() {
    this.workflows = new Map();
    this.executionQueue = [];
    this.activeWorkflows = new Set();
    this.performanceMetrics = {
      totalWorkflows: 0,
      successfulWorkflows: 0,
      averageExecutionTime: 0,
      agentUtilization: new Map()
    };
    this.workflowTemplates = new Map();
    this.optimizationRules = new Map();
  }

  // Workflow Definition and Registration
  registerWorkflowTemplate(name, template) {
    this.workflowTemplates.set(name, {
      ...template,
      id: name,
      createdAt: Date.now(),
      usageCount: 0,
      successRate: 0
    });
  }

  createWorkflow(templateName, parameters = {}) {
    const template = this.workflowTemplates.get(templateName);
    if (!template) {
      throw new Error(`Workflow template '${templateName}' not found`);
    }

    const workflow = {
      id: `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      template: templateName,
      parameters,
      status: 'created',
      steps: [],
      startTime: null,
      endTime: null,
      result: null,
      error: null,
      priority: parameters.priority || 'normal',
      estimatedDuration: this.estimateWorkflowDuration(template, parameters)
    };

    this.workflows.set(workflow.id, workflow);
    template.usageCount++;
    
    return workflow;
  }

  estimateWorkflowDuration(template, parameters) {
    let baseDuration = template.estimatedDuration || 30000; // 30 seconds default
    
    // Adjust based on complexity
    if (parameters.complexity === 'high') {
      baseDuration *= 2;
    } else if (parameters.complexity === 'low') {
      baseDuration *= 0.5;
    }
    
    // Adjust based on number of agents
    if (template.agents && template.agents.length > 3) {
      baseDuration *= 1.5;
    }
    
    return baseDuration;
  }

  // Workflow Execution
  async executeWorkflow(workflowId) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow '${workflowId}' not found`);
    }

    workflow.status = 'executing';
    workflow.startTime = Date.now();
    this.activeWorkflows.add(workflowId);

    try {
      const template = this.workflowTemplates.get(workflow.template);
      const result = await this.executeWorkflowSteps(workflow, template);
      
      workflow.status = 'completed';
      workflow.result = result;
      workflow.endTime = Date.now();
      
      this.updatePerformanceMetrics(workflow, true);
      
    } catch (error) {
      workflow.status = 'failed';
      workflow.error = error.message;
      workflow.endTime = Date.now();
      
      this.updatePerformanceMetrics(workflow, false);
    } finally {
      this.activeWorkflows.delete(workflowId);
    }

    return workflow;
  }

  async executeWorkflowSteps(workflow, template) {
    const results = [];
    const context = { ...workflow.parameters };

    for (let i = 0; i < template.steps.length; i++) {
      const step = template.steps[i];
      const stepResult = await this.executeStep(step, context, workflow);
      
      results.push(stepResult);
      context[step.output] = stepResult.result;
      
      // Add step to workflow history
      workflow.steps.push({
        ...step,
        startTime: stepResult.startTime,
        endTime: stepResult.endTime,
        result: stepResult.result,
        status: stepResult.status
      });
    }

    return {
      results,
      context,
      executionTime: Date.now() - workflow.startTime
    };
  }

  async executeStep(step, context, workflow) {
    const stepStartTime = Date.now();
    
    try {
      let result;
      
      switch (step.type) {
        case 'agent_task':
          result = await this.executeAgentTask(step, context);
          break;
        case 'condition':
          result = await this.evaluateCondition(step, context);
          break;
        case 'loop':
          result = await this.executeLoop(step, context);
          break;
        case 'parallel':
          result = await this.executeParallel(step, context);
          break;
        case 'data_transform':
          result = await this.transformData(step, context);
          break;
        default:
          throw new Error(`Unknown step type: ${step.type}`);
      }
      
      return {
        ...step,
        result,
        status: 'completed',
        startTime: stepStartTime,
        endTime: Date.now()
      };
      
    } catch (error) {
      return {
        ...step,
        error: error.message,
        status: 'failed',
        startTime: stepStartTime,
        endTime: Date.now()
      };
    }
  }

  async executeAgentTask(step, context) {
    const { agentName, task, inputMapping } = step;
    
    // Map inputs from context
    const inputs = {};
    if (inputMapping) {
      Object.keys(inputMapping).forEach(key => {
        inputs[key] = this.resolveValue(inputMapping[key], context);
      });
    }
    
    // Simulate agent execution
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
    
    // Generate intelligent response based on agent and task
    const response = this.generateAgentResponse(agentName, task, inputs);
    
    // Update agent utilization metrics
    this.updateAgentUtilization(agentName, Date.now());
    
    return response;
  }

  generateAgentResponse(agentName, task, inputs) {
    const responses = {
      'DesignDex': {
        'create_logo': `Created professional logo with ${inputs.style || 'modern'} style`,
        'design_brand': `Developed comprehensive brand identity system`,
        'create_visual': `Generated high-quality visual content`
      },
      'ContentCrafter': {
        'write_copy': `Crafted compelling copy for ${inputs.target || 'audience'}`,
        'create_content': `Created engaging content strategy`,
        'optimize_text': `Optimized text for better engagement`
      },
      'WebWiz': {
        'build_website': `Built responsive website with ${inputs.features || 'modern'} features`,
        'optimize_performance': `Optimized website performance`,
        'implement_features': `Implemented requested features`
      }
    };
    
    const agentResponses = responses[agentName] || {};
    return agentResponses[task] || `Executed ${task} with professional quality`;
  }

  async evaluateCondition(step, context) {
    const { condition, operator, value } = step;
    const actualValue = this.resolveValue(condition, context);
    
    switch (operator) {
      case 'equals':
        return actualValue === value;
      case 'not_equals':
        return actualValue !== value;
      case 'greater_than':
        return actualValue > value;
      case 'less_than':
        return actualValue < value;
      case 'contains':
        return String(actualValue).includes(value);
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  }

  async executeLoop(step, context) {
    const { items, action, maxIterations = 10 } = step;
    const itemsList = this.resolveValue(items, context);
    const results = [];
    
    for (let i = 0; i < Math.min(itemsList.length, maxIterations); i++) {
      const itemContext = { ...context, currentItem: itemsList[i], index: i };
      const result = await this.executeStep(action, itemContext);
      results.push(result);
    }
    
    return results;
  }

  async executeParallel(step, context) {
    const { tasks } = step;
    const promises = tasks.map(task => this.executeStep(task, context));
    return await Promise.all(promises);
  }

  async transformData(step, context) {
    const { input, transformation, output } = step;
    const inputData = this.resolveValue(input, context);
    
    let result;
    switch (transformation) {
      case 'format_json':
        result = JSON.stringify(inputData, null, 2);
        break;
      case 'extract_text':
        result = typeof inputData === 'string' ? inputData : JSON.stringify(inputData);
        break;
      case 'filter':
        result = inputData.filter(item => this.evaluateFilter(item, step.filter));
        break;
      case 'map':
        result = inputData.map(item => this.applyMapping(item, step.mapping));
        break;
      default:
        result = inputData;
    }
    
    return result;
  }

  resolveValue(path, context) {
    if (typeof path === 'string' && path.startsWith('$.')) {
      const keys = path.substring(2).split('.');
      let value = context;
      for (const key of keys) {
        value = value[key];
        if (value === undefined) break;
      }
      return value;
    }
    return path;
  }

  // Performance Monitoring and Optimization
  updatePerformanceMetrics(workflow, success) {
    this.performanceMetrics.totalWorkflows++;
    
    if (success) {
      this.performanceMetrics.successfulWorkflows++;
    }
    
    const executionTime = workflow.endTime - workflow.startTime;
    this.performanceMetrics.averageExecutionTime = 
      (this.performanceMetrics.averageExecutionTime * (this.performanceMetrics.totalWorkflows - 1) + executionTime) / 
      this.performanceMetrics.totalWorkflows;
    
    // Update template success rate
    const template = this.workflowTemplates.get(workflow.template);
    if (template) {
      template.successRate = 
        (template.successRate * (template.usageCount - 1) + (success ? 1 : 0)) / 
        template.usageCount;
    }
  }

  updateAgentUtilization(agentName, timestamp) {
    if (!this.performanceMetrics.agentUtilization.has(agentName)) {
      this.performanceMetrics.agentUtilization.set(agentName, {
        totalTasks: 0,
        lastUsed: null,
        averageResponseTime: 0
      });
    }
    
    const metrics = this.performanceMetrics.agentUtilization.get(agentName);
    metrics.totalTasks++;
    metrics.lastUsed = timestamp;
  }

  // Workflow Optimization
  optimizeWorkflow(workflowId) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return null;

    const optimizations = [];
    
    // Check for parallel execution opportunities
    const parallelSteps = this.findParallelExecutionOpportunities(workflow);
    if (parallelSteps.length > 0) {
      optimizations.push({
        type: 'parallel_execution',
        description: `Found ${parallelSteps.length} steps that can be executed in parallel`,
        impact: 'high',
        estimatedTimeSavings: parallelSteps.length * 1000 // 1 second per step
      });
    }
    
    // Check for redundant steps
    const redundantSteps = this.findRedundantSteps(workflow);
    if (redundantSteps.length > 0) {
      optimizations.push({
        type: 'remove_redundant',
        description: `Found ${redundantSteps.length} redundant steps`,
        impact: 'medium',
        estimatedTimeSavings: redundantSteps.length * 500
      });
    }
    
    // Check for agent optimization
    const agentOptimizations = this.findAgentOptimizations(workflow);
    optimizations.push(...agentOptimizations);
    
    return optimizations;
  }

  findParallelExecutionOpportunities(workflow) {
    const template = this.workflowTemplates.get(workflow.template);
    if (!template) return [];
    
    const opportunities = [];
    
    for (let i = 0; i < template.steps.length - 1; i++) {
      const currentStep = template.steps[i];
      const nextStep = template.steps[i + 1];
      
      // Check if steps are independent
      if (this.areStepsIndependent(currentStep, nextStep)) {
        opportunities.push([currentStep, nextStep]);
      }
    }
    
    return opportunities;
  }

  areStepsIndependent(step1, step2) {
    // Check if step2 depends on step1's output
    if (step2.inputMapping) {
      const step1Outputs = this.getStepOutputs(step1);
      const step2Inputs = Object.values(step2.inputMapping);
      
      return !step2Inputs.some(input => 
        step1Outputs.some(output => input.includes(output))
      );
    }
    
    return true;
  }

  getStepOutputs(step) {
    return step.output ? [step.output] : [];
  }

  findRedundantSteps(workflow) {
    const template = this.workflowTemplates.get(workflow.template);
    if (!template) return [];
    
    const redundant = [];
    const seenTasks = new Set();
    
    template.steps.forEach(step => {
      if (step.type === 'agent_task') {
        const taskKey = `${step.agentName}_${step.task}`;
        if (seenTasks.has(taskKey)) {
          redundant.push(step);
        } else {
          seenTasks.add(taskKey);
        }
      }
    });
    
    return redundant;
  }

  findAgentOptimizations(workflow) {
    const template = this.workflowTemplates.get(workflow.template);
    if (!template) return [];
    
    const optimizations = [];
    
    template.steps.forEach(step => {
      if (step.type === 'agent_task') {
        const agentMetrics = this.performanceMetrics.agentUtilization.get(step.agentName);
        if (agentMetrics && agentMetrics.averageResponseTime > 3000) {
          optimizations.push({
            type: 'agent_performance',
            description: `${step.agentName} has slow response time`,
            impact: 'medium',
            recommendation: 'Consider using a faster agent or optimizing the task'
          });
        }
      }
    });
    
    return optimizations;
  }

  // Workflow Analytics
  getWorkflowAnalytics() {
    return {
      totalWorkflows: this.performanceMetrics.totalWorkflows,
      successRate: this.performanceMetrics.successfulWorkflows / this.performanceMetrics.totalWorkflows,
      averageExecutionTime: this.performanceMetrics.averageExecutionTime,
      activeWorkflows: this.activeWorkflows.size,
      topTemplates: this.getTopTemplates(),
      agentUtilization: Array.from(this.performanceMetrics.agentUtilization.entries())
    };
  }

  getTopTemplates() {
    return Array.from(this.workflowTemplates.values())
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 5)
      .map(template => ({
        name: template.id,
        usageCount: template.usageCount,
        successRate: template.successRate
      }));
  }

  // Export/Import workflows
  exportWorkflow(workflowId) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return null;
    
    return {
      ...workflow,
      template: this.workflowTemplates.get(workflow.template)
    };
  }

  importWorkflow(workflowData) {
    const workflow = {
      ...workflowData,
      id: `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'imported',
      startTime: null,
      endTime: null
    };
    
    this.workflows.set(workflow.id, workflow);
    return workflow.id;
  }
}

// Initialize the global workflow orchestrator
export const globalWorkflowOrchestrator = new WorkflowOrchestrator();

// Pre-defined workflow templates
export const workflowTemplates = {
  'brand_identity_creation': {
    name: 'Brand Identity Creation',
    description: 'Complete brand identity development workflow',
    estimatedDuration: 60000, // 1 minute
    agents: ['DesignDex', 'ContentCrafter', 'BizDevStrategist'],
    steps: [
      {
        type: 'agent_task',
        agentName: 'BizDevStrategist',
        task: 'analyze_business',
        inputMapping: { businessInfo: '$.businessInfo' },
        output: 'businessAnalysis'
      },
      {
        type: 'agent_task',
        agentName: 'DesignDex',
        task: 'create_logo',
        inputMapping: { 
          businessAnalysis: '$.businessAnalysis',
          style: '$.style' 
        },
        output: 'logoDesign'
      },
      {
        type: 'agent_task',
        agentName: 'ContentCrafter',
        task: 'write_brand_copy',
        inputMapping: { 
          businessAnalysis: '$.businessAnalysis',
          logoDesign: '$.logoDesign' 
        },
        output: 'brandCopy'
      },
      {
        type: 'agent_task',
        agentName: 'DesignDex',
        task: 'create_brand_guidelines',
        inputMapping: { 
          logoDesign: '$.logoDesign',
          brandCopy: '$.brandCopy' 
        },
        output: 'brandGuidelines'
      }
    ]
  },
  
  'website_development': {
    name: 'Website Development',
    description: 'Complete website development workflow',
    estimatedDuration: 90000, // 1.5 minutes
    agents: ['WebWiz', 'DesignDex', 'ContentCrafter'],
    steps: [
      {
        type: 'agent_task',
        agentName: 'WebWiz',
        task: 'plan_architecture',
        inputMapping: { requirements: '$.requirements' },
        output: 'architecture'
      },
      {
        type: 'parallel',
        tasks: [
          {
            type: 'agent_task',
            agentName: 'DesignDex',
            task: 'design_ui',
            inputMapping: { requirements: '$.requirements' },
            output: 'uiDesign'
          },
          {
            type: 'agent_task',
            agentName: 'ContentCrafter',
            task: 'write_website_copy',
            inputMapping: { requirements: '$.requirements' },
            output: 'websiteCopy'
          }
        ]
      },
      {
        type: 'agent_task',
        agentName: 'WebWiz',
        task: 'build_website',
        inputMapping: { 
          architecture: '$.architecture',
          uiDesign: '$.uiDesign',
          websiteCopy: '$.websiteCopy' 
        },
        output: 'website'
      }
    ]
  }
};

// Register default templates
Object.entries(workflowTemplates).forEach(([name, template]) => {
  globalWorkflowOrchestrator.registerWorkflowTemplate(name, template);
}); 