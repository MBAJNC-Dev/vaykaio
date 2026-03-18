# Integration Guide - AI Multi-Agent Service Layer

This guide explains how to integrate the AI agent system into your VaykAIo application.

## Installation

The agents are already installed in:
```
/src/services/ai/
```

No additional packages needed - all dependencies use existing PocketBase and API client.

## Basic Setup

### 1. Import the Orchestrator

```javascript
import orchestrator from '@/services/ai/AIAgentOrchestrator.js';
```

### 2. Initialize When Trip is Created

```javascript
async function createTrip(tripData) {
  // Create trip in database
  const trip = await pb.collection('trips').create(tripData);

  // Initialize AI agents
  await orchestrator.initializeForTrip(trip.id);

  return trip;
}
```

### 3. Use Agents in Components

#### In a Vue/React Component:

```javascript
import orchestrator from '@/services/ai/AIAgentOrchestrator.js';

export default {
  data() {
    return {
      tripId: null,
      recommendations: [],
      weather: null,
    };
  },

  async mounted() {
    this.tripId = this.$route.params.tripId;
    await this.loadRecommendations();
    await this.checkWeather();
  },

  methods: {
    async loadRecommendations() {
      const experience = orchestrator.agents.experience;
      const recs = await experience.getRecommendations(this.tripId);
      this.recommendations = recs.slice(0, 5);
    },

    async checkWeather() {
      const monitor = orchestrator.agents.monitor;
      const check = await monitor.check(this.tripId);
      this.weather = check.weather;
    },
  },
};
```

## Real-World Integration Examples

### Example 1: Generate Itinerary Page

```javascript
// pages/trip/[id]/itinerary.vue

import orchestrator from '@/services/ai/AIAgentOrchestrator.js';

export default {
  async load({ params }) {
    const tripId = params.id;
    const planner = orchestrator.agents.planner;

    // Get itinerary
    const itinerary = await planner.generateItinerary(tripId, {
      pace: 'moderate',
      interests: ['food', 'culture', 'adventure'],
    });

    return { itinerary };
  },
};
```

### Example 2: Trip Dashboard with Real-Time Monitoring

```javascript
// components/TripDashboard.vue

import orchestrator from '@/services/ai/AIAgentOrchestrator.js';

export default {
  data() {
    return {
      agentStatuses: {},
      alerts: [],
      recommendations: [],
      nextBestAction: null,
    };
  },

  async mounted() {
    await this.initializeAgents();
    this.startMonitoring();
  },

  methods: {
    async initializeAgents() {
      const tripId = this.$route.params.tripId;
      await orchestrator.initializeForTrip(tripId);
    },

    startMonitoring() {
      // Run checks every 5 minutes
      setInterval(() => this.runAllChecks(), 5 * 60 * 1000);
      // Initial check
      this.runAllChecks();
    },

    async runAllChecks() {
      const tripId = this.$route.params.tripId;
      const results = await orchestrator.runCheck(tripId);

      // Extract alerts
      this.alerts = results.monitor?.alerts || [];

      // Get recommendations
      this.recommendations = results.experience?.topRecommendations || [];

      // Get next action
      this.nextBestAction = await orchestrator.agents.experience.getNextBestAction(tripId);
    },
  },
};
```

### Example 3: Activity Scheduling with Optimization

```javascript
// components/ActivityScheduler.vue

import orchestrator from '@/services/ai/AIAgentOrchestrator.js';

export default {
  async methods: {
    async scheduleActivity(activityData) {
      const tripId = this.$route.params.tripId;

      // Create activity
      const activity = await pb.collection('activities').create({
        ...activityData,
        trip: tripId,
      });

      // Trigger optimization
      const optimizer = orchestrator.agents.optimization;
      const optimizations = await optimizer.optimizeSchedule(tripId);

      // Show suggestions if issues found
      if (optimizations.optimizations.length > 0) {
        this.$toast.warning(
          `Found ${optimizations.optimizations.length} schedule issues. Review suggestions?`
        );
      }

      // Trigger communication if needed
      if (optimizations.criticalIssues > 0) {
        const communication = orchestrator.agents.communication;
        await communication.notifyGroup(
          tripId,
          `Schedule conflict detected: ${optimizations.optimizations[0].suggestion}`,
          'high'
        );
      }

      return activity;
    },
  },
};
```

### Example 4: Event Handling

```javascript
// When a photo is uploaded
async function onPhotoUpload(photoId, tripId) {
  const event = {
    type: 'photo_uploaded',
    tripId,
    photoId,
  };

  // Agents auto-tag and process photo
  await orchestrator.handleEvent(event);
}

// When weather changes
async function onWeatherAlert(tripId, condition) {
  const event = {
    type: 'weather_change',
    tripId,
    condition,
    severity: 'medium',
  };

  // Monitor and Optimization agents adjust schedule
  // Communication agent notifies group
  await orchestrator.handleEvent(event);
}

// When reservation fails
async function onReservationFailed(tripId, activity) {
  const event = {
    type: 'reservation_change',
    tripId,
    activity: activity.title,
  };

  // Recovery agent creates recovery plan
  // Communication agent notifies group
  await orchestrator.handleEvent(event);
}
```

### Example 5: Memory & Recaps

```javascript
// pages/trip/[id]/recap.vue

import orchestrator from '@/services/ai/AIAgentOrchestrator.js';

export default {
  async load({ params }) {
    const tripId = params.id;
    const memory = orchestrator.agents.memory;

    // Generate complete trip recap
    const recapResult = await memory.generateTripRecap(tripId);

    return { recap: recapResult.recap };
  },

  template: `
    <div class="trip-recap">
      <h1>{{ recap.title }}</h1>
      <p class="quote">{{ recap.memorableQuotes }}</p>

      <section class="statistics">
        <h2>Your Trip by Numbers</h2>
        <ul>
          <li>Total Activities: {{ recap.overview.totalActivities }}</li>
          <li>Photos Captured: {{ recap.overview.totalPhotos }}</li>
          <li>Budget Used: ${{ recap.overview.totalBudgetUsed }}</li>
          <li>Busiest Day: {{ recap.statistics.busyestDay }}</li>
        </ul>
      </section>

      <section class="highlights">
        <h2>Trip Highlights</h2>
        <ul>
          <li v-for="h in recap.highlights" :key="h.title">
            {{ h.title }}
          </li>
        </ul>
      </section>

      <section class="photos">
        <h2>Photo Gallery</h2>
        <img v-for="p in recap.topPhotos" :key="p.id" :src="p.url" />
      </section>

      <section class="recommendations">
        <h2>For Your Next Trip</h2>
        <ul>
          <li v-for="r in recap.recommendations" :key="r">
            {{ r }}
          </li>
        </ul>
      </section>
    </div>
  `,
};
```

## Connecting to UI Components

### Quick Example: Activity Recommendations Widget

```vue
<template>
  <div class="recommendations-widget">
    <h3>What Should We Do Now?</h3>

    <div v-if="nextAction.status === 'busy'" class="busy-status">
      <p>{{ nextAction.message }}</p>
    </div>

    <div v-else-if="nextAction.status === 'time_available'" class="suggestions">
      <p>{{ nextAction.message }}</p>
      <div class="suggestion-cards">
        <div
          v-for="suggestion in nextAction.suggestions"
          :key="suggestion.name"
          class="suggestion-card"
          @click="selectActivity(suggestion)"
        >
          <h4>{{ suggestion.name }}</h4>
          <p>Rating: {{ suggestion.rating }}/5</p>
          <p>Distance: {{ suggestion.distance }}km</p>
          <p>Price: {{ suggestion.price }}</p>
        </div>
      </div>
    </div>

    <div v-else class="no-schedule">
      <p>{{ nextAction.message }}</p>
      <div class="all-recommendations">
        <div
          v-for="place in nextAction.suggestions"
          :key="place.name"
          class="place-card"
        >
          <h5>{{ place.name }}</h5>
          <p>{{ place.category }}</p>
          <button @click="bookActivity(place)">Book Now</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orchestrator from '@/services/ai/AIAgentOrchestrator.js';

export default {
  data() {
    return {
      nextAction: {},
    };
  },

  async mounted() {
    const tripId = this.$route.params.tripId;
    const experience = orchestrator.agents.experience;
    this.nextAction = await experience.getNextBestAction(tripId);
  },

  methods: {
    async selectActivity(suggestion) {
      // User selected an activity
      const activity = await pb.collection('activities').create({
        trip: this.$route.params.tripId,
        title: suggestion.name,
        category: suggestion.type,
        estimated_cost: suggestion.price,
      });

      // Trigger event handlers
      await orchestrator.handleEvent({
        type: 'new_activity',
        tripId: this.$route.params.tripId,
      });

      this.$toast.success(`Added ${suggestion.name} to itinerary!`);
    },
  },
};
</script>
```

## Database Setup

Ensure your PocketBase has these collections:

```
Collections needed:
- trips
- activities
- accommodations
- photos
- ai_agent_logs (for logging agent actions)
```

### Sample ai_agent_logs schema:

```javascript
{
  trip: (relation) trips,
  agent_name: (text) 'planner', 'monitor', etc,
  action_type: (text) 'initialized', 'check', 'suggestion', etc,
  description: (text) description of what agent did,
  metadata: (text/json) additional data,
  timestamp: (date) when action occurred,
}
```

## Performance Considerations

1. **Caching**: Consider caching recommendations for 30-60 seconds
2. **Background Tasks**: Run expensive checks (like budget optimization) in background
3. **Event Batching**: Batch similar events to avoid redundant agent calls
4. **Rate Limiting**: Limit check frequency (e.g., every 5 minutes)

## Debugging

Enable logging by adding to your app startup:

```javascript
// In main.js or startup file
const orchestrator = require('@/services/ai/AIAgentOrchestrator.js').default;

// All console.log calls in agents are now visible
// For production, replace with proper logging service
```

## Next Steps

1. ✅ Agents created and ready to use
2. ⚡ Integrate into your Vue/React components
3. 🔧 Connect to real APIs (weather, booking services)
4. 📊 Set up proper logging service
5. 🚀 Deploy and monitor

## Support Files

- `README.md` - Full agent documentation
- `USAGE_EXAMPLES.js` - 17 code examples
- `INTEGRATION_GUIDE.md` - This file
