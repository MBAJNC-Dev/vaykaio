import PlannerAgent from './PlannerAgent.js';
import MonitorAgent from './MonitorAgent.js';
import ExperienceAgent from './ExperienceAgent.js';
import StayAgent from './StayAgent.js';
import CommunicationAgent from './CommunicationAgent.js';
import OptimizationAgent from './OptimizationAgent.js';
import RecoveryAgent from './RecoveryAgent.js';
import MemoryAgent from './MemoryAgent.js';
import pb from '@/lib/pocketbaseClient.js';

class AIAgentOrchestrator {
  constructor() {
    this.agents = {
      planner: new PlannerAgent(),
      monitor: new MonitorAgent(),
      experience: new ExperienceAgent(),
      stay: new StayAgent(),
      communication: new CommunicationAgent(),
      optimization: new OptimizationAgent(),
      recovery: new RecoveryAgent(),
      memory: new MemoryAgent(),
    };
    this.activeTripId = null;
    this.status = 'idle'; // idle, monitoring, alert
  }

  async initializeForTrip(tripId) {
    this.activeTripId = tripId;
    this.status = 'monitoring';
    // Initialize each agent with trip context
    const trip = await pb.collection('trips').getOne(tripId);
    for (const [name, agent] of Object.entries(this.agents)) {
      await agent.initialize(trip);
    }
    await this.logAction(tripId, 'orchestrator', 'initialized', 'All agents initialized for trip');
    return { status: 'active', agents: Object.keys(this.agents) };
  }

  async runCheck(tripId) {
    const results = {};
    for (const [name, agent] of Object.entries(this.agents)) {
      try {
        results[name] = await agent.check(tripId);
      } catch (error) {
        results[name] = { status: 'error', error: error.message };
      }
    }
    return results;
  }

  async getStatus() {
    return {
      status: this.status,
      activeTripId: this.activeTripId,
      agents: Object.fromEntries(
        Object.entries(this.agents).map(([name, agent]) => [name, agent.getStatus()])
      ),
    };
  }

  async handleEvent(event) {
    // Route events to appropriate agents
    const routing = {
      'weather_change': ['monitor', 'optimization'],
      'time_drift': ['monitor', 'optimization', 'communication'],
      'new_activity': ['planner', 'optimization'],
      'photo_uploaded': ['memory'],
      'member_joined': ['communication', 'planner'],
      'budget_exceeded': ['optimization', 'communication'],
      'reservation_change': ['monitor', 'recovery', 'communication'],
    };
    const targetAgents = routing[event.type] || ['monitor'];
    const results = {};
    for (const agentName of targetAgents) {
      if (this.agents[agentName]) {
        results[agentName] = await this.agents[agentName].handleEvent(event);
      }
    }
    return results;
  }

  async logAction(tripId, agentName, actionType, description, metadata = {}) {
    try {
      await pb.collection('ai_agent_logs').create({
        trip: tripId,
        agent_name: agentName,
        action_type: actionType,
        description: description,
        metadata: JSON.stringify(metadata),
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Failed to log AI action:', e);
    }
  }

  async getAgentLogs(tripId, options = {}) {
    const filter = [`trip = "${tripId}"`];
    if (options.agentName) filter.push(`agent_name = "${options.agentName}"`);
    return pb.collection('ai_agent_logs').getFullList({
      filter: filter.join(' && '),
      sort: '-timestamp',
    });
  }
}

export default new AIAgentOrchestrator();
