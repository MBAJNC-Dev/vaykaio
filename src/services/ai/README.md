# VaykAIo AI Multi-Agent Service Layer

The AI Multi-Agent Service Layer provides an intelligent travel team that quietly manages every aspect of your trip. Each agent has a distinct role and communicates through the central orchestrator.

## Architecture Overview

```
AIAgentOrchestrator (Master Coordinator)
├── PlannerAgent (Builds & optimizes itineraries)
├── MonitorAgent (Watches conditions & timing)
├── ExperienceAgent (Finds restaurants, activities, gems)
├── StayAgent (Manages accommodations)
├── CommunicationAgent (Group messaging & coordination)
├── OptimizationAgent (Optimizes schedules & budgets)
├── RecoveryAgent (Handles disruptions)
└── MemoryAgent (Captures & organizes memories)
```

## Quick Start

### Initialize the Orchestrator for a Trip

```javascript
import orchestrator from '@/services/ai/AIAgentOrchestrator.js';

// Initialize all agents for a trip
const result = await orchestrator.initializeForTrip(tripId);
// Returns: { status: 'active', agents: ['planner', 'monitor', ...] }
```

### Run All Agents' Checks

```javascript
const results = await orchestrator.runCheck(tripId);
// Returns: { planner: {...}, monitor: {...}, ... }
```

### Handle Events

```javascript
// Route events to appropriate agents
const eventResult = await orchestrator.handleEvent({
  type: 'weather_change',
  tripId: tripId,
  condition: 'rainy',
  severity: 'medium'
});
```

## Agent Details

### 1. PlannerAgent
**Role**: Builds and updates itineraries with realistic activities
- `generateItinerary(tripId, preferences)` - Creates full trip itinerary
- `suggestActivity(tripId, timeSlot)` - Recommends activity for empty slot
- Considers: destination type, trip length, pace, user interests

**Events Handled**: `new_activity`, `member_joined`

### 2. MonitorAgent
**Role**: Watches weather, timing, and potential issues
- `checkWeather(location)` - Gets current conditions
- `checkTimeDrift(tripId)` - Compares planned vs actual timing
- `calculateLeaveBy(activity)` - When to leave for next activity
- `generateAlerts(tripId)` - Creates alerts for issues

**Events Handled**: `weather_change`, `time_drift`, `reservation_change`

### 3. ExperienceAgent
**Role**: Finds restaurants, activities, and hidden gems
- `getRecommendations(tripId, options)` - Context-aware recommendations
- `getNextBestAction(tripId)` - "What should we do now?"
- `searchNearby(location, category, radius)` - Find nearby places
- Considers: time of day, weather, distance, budget, interests

**Events Handled**: `new_activity`

### 4. StayAgent
**Role**: Manages accommodations and check-in/out
- `getCheckInInfo(tripId)` - Returns check-in details
- `analyzeCheckInStatus(accommodations)` - Current status
- `getUpcomingCheckIns(accommodations)` - Next check-ins

**Events Handled**: `reservation_change`, `member_joined`

### 5. CommunicationAgent
**Role**: Handles group messaging and coordination
- `notifyGroup(tripId, message, urgency)` - Send to all members
- `notifyMember(tripId, userId, message, urgency)` - Send to individual
- `digestNotifications(tripId)` - Bundle low-priority notifications
- Urgency levels: 'low', 'normal', 'high'

**Events Handled**: All events trigger appropriate notifications

### 6. OptimizationAgent
**Role**: Optimizes schedules and budgets
- `optimizeSchedule(tripId)` - Find conflicts, tight gaps, long sessions
- `optimizeBudget(tripId)` - Budget warnings and cost-saving suggestions
- `rebalanceDay(tripId, dayId)` - Fix specific day's schedule
- Provides actionable suggestions

**Events Handled**: `weather_change`, `time_drift`, `budget_exceeded`

### 7. RecoveryAgent
**Role**: Handles disruptions and creates recovery plans
- `handleDisruption(tripId, disruption)` - Creates step-by-step recovery
- `suggestAlternatives(tripId, cancelledActivity)` - Find alternatives
- Types: cancellation, delay, location_unavailable, weather

**Events Handled**: `reservation_change`

### 8. MemoryAgent
**Role**: Captures and organizes memories
- `tagPhoto(photoId)` - Auto-tag with location, activity, mood
- `generateDayRecap(tripId, dayNumber)` - Create day summary
- `generateTripRecap(tripId)` - Create complete journey recap
- Extracts highlights, statistics, memorable moments

**Events Handled**: `photo_uploaded`

## Event Routing

Events are automatically routed to relevant agents:

```
weather_change → [monitor, optimization]
time_drift → [monitor, optimization, communication]
new_activity → [planner, optimization]
photo_uploaded → [memory]
member_joined → [communication, planner]
budget_exceeded → [optimization, communication]
reservation_change → [monitor, recovery, communication]
```

## Logging

All agent actions are logged via PocketBase:

```javascript
// View logs for a trip
const logs = await orchestrator.getAgentLogs(tripId, {
  agentName: 'planner' // optional
});
```

## Status Checks

```javascript
// Get orchestrator status
const status = await orchestrator.getStatus();
// Returns: { status, activeTripId, agents: {...} }

// Get individual agent status
const agentStatus = orchestrator.agents.planner.getStatus();
```

## Data Structures

### Activity Object
```javascript
{
  id: 'activity_123',
  trip: 'trip_id',
  title: 'Swimming and sunbathing',
  start_time: '2026-03-20T09:00:00Z',
  end_time: '2026-03-20T12:00:00Z',
  duration: 180, // minutes
  category: 'water',
  estimated_cost: 0,
  description: 'Beach time',
  actual_start_time: null
}
```

### Accommodation Object
```javascript
{
  id: 'acc_123',
  trip: 'trip_id',
  name: 'Seaside Resort',
  address: '123 Beach Ave',
  check_in_date: '2026-03-20',
  check_in_time: '15:00',
  check_out_date: '2026-03-25',
  check_out_time: '11:00',
  confirmation_number: 'RES123456',
  total_cost: 500
}
```

### Alert Object
```javascript
{
  type: 'warning', // 'info', 'warning'
  message: 'No accommodations booked',
  severity: 'high', // 'low', 'medium', 'high'
  actionRequired: true
}
```

## Integration Points

- **PocketBase**: All agents read/write to PocketBase collections
- **API Client**: Ready for external API integration
- **Mock Data**: Built-in realistic mock data for demo/testing

## Future Enhancements

- Real weather API integration
- Third-party booking API integration (hotels, restaurants, activities)
- Machine learning for better recommendations
- Real-time collaboration features
- Integration with travel booking sites
- Advanced photo recognition and tagging
- Predictive disruption detection

## Development Notes

- Each agent has internal `status` property: 'idle', 'active', 'alert'
- All agents implement `initialize()`, `check()`, `handleEvent()`, `getStatus()`
- Errors are handled gracefully with try-catch
- Console logging for debugging (ready for proper logging service)
- Mock data structured for real API integration
