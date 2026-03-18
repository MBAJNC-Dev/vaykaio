/**
 * USAGE EXAMPLES - VaykAIo AI Multi-Agent Service Layer
 *
 * This file demonstrates how to use the AI agent system in your application.
 */

import orchestrator from './AIAgentOrchestrator.js';
import PlannerAgent from './PlannerAgent.js';
import MonitorAgent from './MonitorAgent.js';
import ExperienceAgent from './ExperienceAgent.js';
import StayAgent from './StayAgent.js';
import CommunicationAgent from './CommunicationAgent.js';
import OptimizationAgent from './OptimizationAgent.js';
import RecoveryAgent from './RecoveryAgent.js';
import MemoryAgent from './MemoryAgent.js';

// ============================================================================
// EXAMPLE 1: Initialize Orchestrator for a Trip
// ============================================================================
async function example1_initializeTrip() {
  console.log('\n=== EXAMPLE 1: Initialize Trip ===');

  const tripId = 'trip_123abc';

  const result = await orchestrator.initializeForTrip(tripId);
  console.log('Initialization result:', result);
  // Output: { status: 'active', agents: ['planner', 'monitor', 'experience', ...] }
}

// ============================================================================
// EXAMPLE 2: Run Health Check on All Agents
// ============================================================================
async function example2_runHealthCheck() {
  console.log('\n=== EXAMPLE 2: Run Health Check ===');

  const tripId = 'trip_123abc';

  const results = await orchestrator.runCheck(tripId);

  // Each agent returns its status
  console.log('Planner status:', results.planner);
  console.log('Monitor status:', results.monitor);
  console.log('Experience status:', results.experience);
  // ... etc
}

// ============================================================================
// EXAMPLE 3: Generate Itinerary (PlannerAgent)
// ============================================================================
async function example3_generateItinerary() {
  console.log('\n=== EXAMPLE 3: Generate Itinerary ===');

  const tripId = 'trip_123abc';
  const preferences = {
    pace: 'moderate', // 'relaxed', 'moderate', 'adventure'
    interests: ['culture', 'food', 'nature'],
  };

  const planner = new PlannerAgent();
  const itinerary = await planner.generateItinerary(tripId, preferences);

  console.log('Generated itinerary:', itinerary);
  // Output: { status: 'success', itinerary: [{day: 1, activities: [...]}], totalDays: 5 }
}

// ============================================================================
// EXAMPLE 4: Get Recommendations (ExperienceAgent)
// ============================================================================
async function example4_getRecommendations() {
  console.log('\n=== EXAMPLE 4: Get Recommendations ===');

  const tripId = 'trip_123abc';

  const experience = new ExperienceAgent();
  experience.initialize({ id: tripId });

  const recommendations = await experience.getRecommendations(tripId, {
    budget: 3000,
    timeOfDay: 12, // noon
  });

  console.log('Top recommendations:', recommendations.slice(0, 3));
  // Shows restaurants, attractions, activities ranked by score
}

// ============================================================================
// EXAMPLE 5: Get Next Best Action (ExperienceAgent)
// ============================================================================
async function example5_getNextBestAction() {
  console.log('\n=== EXAMPLE 5: What Should We Do Now? ===');

  const tripId = 'trip_123abc';

  const experience = new ExperienceAgent();
  experience.initialize({ id: tripId });

  const action = await experience.getNextBestAction(tripId);

  console.log('Next best action:', action);
  // Output:
  // If scheduled activity coming: { status: 'busy', nextActivity: 'Museum Visit', timeUntil: 45 }
  // If time available: { status: 'time_available', suggestions: [...], timeAvailable: 90 }
  // If no scheduled: { status: 'no_scheduled_activity', suggestions: [...] }
}

// ============================================================================
// EXAMPLE 6: Check Weather & Alerts (MonitorAgent)
// ============================================================================
async function example6_weatherAndAlerts() {
  console.log('\n=== EXAMPLE 6: Weather & Alerts ===');

  const tripId = 'trip_123abc';

  const monitor = new MonitorAgent();
  monitor.initialize({ id: tripId, destination: 'Paris, France' });

  const check = await monitor.check(tripId);

  console.log('Weather:', check.weather);
  // Output: { location: 'Paris, France', condition: 'sunny', temperature: 18, ... }

  console.log('Alerts:', check.alerts);
  // Output: [{ type: 'info', message: 'Trip starts in one week!', severity: 'low' }, ...]
}

// ============================================================================
// EXAMPLE 7: Get Check-In Information (StayAgent)
// ============================================================================
async function example7_getCheckInInfo() {
  console.log('\n=== EXAMPLE 7: Check-In Information ===');

  const tripId = 'trip_123abc';

  const stay = new StayAgent();
  stay.initialize({ id: tripId });

  const checkInInfo = await stay.getCheckInInfo(tripId);

  console.log('Check-in info:', checkInInfo);
  // Output: { status: 'success', accommodations: [...], firstCheckIn: {...} }
}

// ============================================================================
// EXAMPLE 8: Optimize Schedule (OptimizationAgent)
// ============================================================================
async function example8_optimizeSchedule() {
  console.log('\n=== EXAMPLE 8: Optimize Schedule ===');

  const tripId = 'trip_123abc';

  const optimizer = new OptimizationAgent();
  optimizer.initialize({ id: tripId });

  const optimizations = await optimizer.optimizeSchedule(tripId);

  console.log('Schedule issues found:', optimizations);
  // Output: { status: 'success', optimizations: [...], totalIssues: 2, criticalIssues: 0 }
}

// ============================================================================
// EXAMPLE 9: Optimize Budget (OptimizationAgent)
// ============================================================================
async function example9_optimizeBudget() {
  console.log('\n=== EXAMPLE 9: Optimize Budget ===');

  const tripId = 'trip_123abc';

  const optimizer = new OptimizationAgent();
  optimizer.initialize({ id: tripId });

  const budgetOptimizations = await optimizer.optimizeBudget(tripId);

  console.log('Budget analysis:', budgetOptimizations.budgetAnalysis);
  // Output: { totalBudget: 5000, totalSpend: 4200, remaining: 800, percentUsed: 84 }

  console.log('Suggestions:', budgetOptimizations.suggestions);
  // Recommendations for cost savings
}

// ============================================================================
// EXAMPLE 10: Handle Disruption (RecoveryAgent)
// ============================================================================
async function example10_handleDisruption() {
  console.log('\n=== EXAMPLE 10: Handle Disruption ===');

  const tripId = 'trip_123abc';

  const recovery = new RecoveryAgent();
  recovery.initialize({ id: tripId });

  const disruption = {
    id: 'disruption_123',
    type: 'cancellation', // 'cancellation', 'delay', 'location_unavailable', 'weather'
    activity: 'Wine Tasting Tour',
    severity: 'medium',
  };

  const recoveryPlan = await recovery.handleDisruption(tripId, disruption);

  console.log('Recovery plan:', recoveryPlan);
  // Output: { status: 'success', recoveryPlan: { steps: [...], alternatives: [...] } }
}

// ============================================================================
// EXAMPLE 11: Send Group Notification (CommunicationAgent)
// ============================================================================
async function example11_notifyGroup() {
  console.log('\n=== EXAMPLE 11: Notify Group ===');

  const tripId = 'trip_123abc';

  const communication = new CommunicationAgent();
  communication.initialize({ id: tripId });

  const result = await communication.notifyGroup(
    tripId,
    'Weather update: Afternoon rain expected. Suggest moving outdoor activities to morning.',
    'normal'
  );

  console.log('Notification sent to', result.deliveredTo, 'members');
}

// ============================================================================
// EXAMPLE 12: Auto-Tag Photo (MemoryAgent)
// ============================================================================
async function example12_tagPhoto() {
  console.log('\n=== EXAMPLE 12: Tag Photo ===');

  const photoId = 'photo_abc123';

  const memory = new MemoryAgent();

  const tagResult = await memory.tagPhoto(photoId);

  console.log('Photo tagged with:', tagResult.tags);
  // Output: { tags: ['Beach', 'Golden Hour', 'Adventure', 'Happy'], ... }
}

// ============================================================================
// EXAMPLE 13: Generate Day Recap (MemoryAgent)
// ============================================================================
async function example13_generateDayRecap() {
  console.log('\n=== EXAMPLE 13: Generate Day Recap ===');

  const tripId = 'trip_123abc';
  const dayNumber = 3;

  const memory = new MemoryAgent();
  memory.initialize({ id: tripId });

  const recap = await memory.generateDayRecap(tripId, dayNumber);

  console.log('Day recap:', recap.recap.title);
  console.log('Summary:', recap.recap.summary);
  console.log('Highlights:', recap.recap.highlights);
}

// ============================================================================
// EXAMPLE 14: Generate Trip Recap (MemoryAgent)
// ============================================================================
async function example14_generateTripRecap() {
  console.log('\n=== EXAMPLE 14: Generate Trip Recap ===');

  const tripId = 'trip_123abc';

  const memory = new MemoryAgent();
  memory.initialize({ id: tripId });

  const recap = await memory.generateTripRecap(tripId);

  console.log('Trip recap:', recap.recap.title);
  console.log('Statistics:', recap.recap.statistics);
  console.log('Memorable quote:', recap.recap.memorableQuotes);
}

// ============================================================================
// EXAMPLE 15: Handle Events (Orchestrator)
// ============================================================================
async function example15_handleEvents() {
  console.log('\n=== EXAMPLE 15: Handle Events ===');

  const tripId = 'trip_123abc';

  // Event 1: Weather change
  const weatherEvent = {
    type: 'weather_change',
    tripId: tripId,
    condition: 'rainy',
    severity: 'medium',
  };
  const weatherResult = await orchestrator.handleEvent(weatherEvent);
  console.log('Weather event handled by:', Object.keys(weatherResult));

  // Event 2: Budget exceeded
  const budgetEvent = {
    type: 'budget_exceeded',
    tripId: tripId,
    percentageUsed: 95,
  };
  const budgetResult = await orchestrator.handleEvent(budgetEvent);
  console.log('Budget event handled by:', Object.keys(budgetResult));

  // Event 3: Photo uploaded
  const photoEvent = {
    type: 'photo_uploaded',
    tripId: tripId,
    photoId: 'photo_123',
  };
  const photoResult = await orchestrator.handleEvent(photoEvent);
  console.log('Photo event handled by:', Object.keys(photoResult));
}

// ============================================================================
// EXAMPLE 16: Get Agent Logs
// ============================================================================
async function example16_getAgentLogs() {
  console.log('\n=== EXAMPLE 16: Get Agent Logs ===');

  const tripId = 'trip_123abc';

  // Get all logs for trip
  const allLogs = await orchestrator.getAgentLogs(tripId);
  console.log('Total log entries:', allLogs.length);

  // Get logs for specific agent
  const plannerLogs = await orchestrator.getAgentLogs(tripId, {
    agentName: 'planner',
  });
  console.log('Planner logs:', plannerLogs.length);
}

// ============================================================================
// EXAMPLE 17: Complete Trip Flow
// ============================================================================
async function example17_completeTripFlow() {
  console.log('\n=== EXAMPLE 17: Complete Trip Flow ===');

  const tripId = 'trip_123abc';

  // 1. Initialize orchestrator
  console.log('1. Initializing orchestrator...');
  await orchestrator.initializeForTrip(tripId);

  // 2. Generate itinerary
  console.log('2. Generating itinerary...');
  const planner = new PlannerAgent();
  await planner.initialize({ id: tripId });
  const itinerary = await planner.generateItinerary(tripId, { pace: 'moderate' });

  // 3. Check weather and alerts
  console.log('3. Checking weather and alerts...');
  const monitor = new MonitorAgent();
  await monitor.initialize({ id: tripId, destination: 'Barcelona, Spain' });
  const weatherCheck = await monitor.check(tripId);

  // 4. Get recommendations
  console.log('4. Getting recommendations...');
  const experience = new ExperienceAgent();
  await experience.initialize({ id: tripId });
  const recommendations = await experience.getRecommendations(tripId);

  // 5. Optimize schedule
  console.log('5. Optimizing schedule...');
  const optimizer = new OptimizationAgent();
  await optimizer.initialize({ id: tripId });
  const scheduleOptimizations = await optimizer.optimizeSchedule(tripId);

  console.log('\n✅ Complete trip preparation done!');
  console.log(`✓ Generated ${itinerary.totalDays}-day itinerary`);
  console.log(`✓ Found ${recommendations.length} recommendations`);
  console.log(`✓ Identified ${weatherCheck.alerts.length} alerts`);
  console.log(`✓ Found ${scheduleOptimizations.totalIssues} schedule issues to fix`);
}

// ============================================================================
// Export all examples for use
// ============================================================================
export {
  example1_initializeTrip,
  example2_runHealthCheck,
  example3_generateItinerary,
  example4_getRecommendations,
  example5_getNextBestAction,
  example6_weatherAndAlerts,
  example7_getCheckInInfo,
  example8_optimizeSchedule,
  example9_optimizeBudget,
  example10_handleDisruption,
  example11_notifyGroup,
  example12_tagPhoto,
  example13_generateDayRecap,
  example14_generateTripRecap,
  example15_handleEvents,
  example16_getAgentLogs,
  example17_completeTripFlow,
};
