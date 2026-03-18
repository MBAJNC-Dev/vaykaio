import pb from '@/lib/pocketbaseClient.js';

const ALTERNATIVE_ACTIVITIES = {
  outdoor: [
    { name: 'Indoor museum visit', type: 'culture', alternative_for: 'hiking' },
    { name: 'Covered market tour', type: 'food', alternative_for: 'beach' },
    { name: 'Shopping mall', type: 'shopping', alternative_for: 'outdoor market' },
    { name: 'Movie theater', type: 'entertainment', alternative_for: 'outdoor activity' },
    { name: 'Indoor swimming pool', type: 'water', alternative_for: 'beach' },
  ],
  restaurant: [
    { name: 'Cooking class at home', type: 'food', alternative_for: 'fine dining' },
    { name: 'Street food from vendor', type: 'food', alternative_for: 'restaurant' },
    { name: 'Picnic with local food', type: 'food', alternative_for: 'restaurant' },
    { name: 'Room service dining', type: 'food', alternative_for: 'restaurant' },
    { name: 'Food delivery tasting', type: 'food', alternative_for: 'restaurant' },
  ],
  transport: [
    { name: 'Local public transit tour', type: 'experience', alternative_for: 'car rental' },
    { name: 'Walking tour', type: 'tour', alternative_for: 'transportation' },
    { name: 'Bike rental', type: 'adventure', alternative_for: 'car rental' },
    { name: 'Local taxi', type: 'transport', alternative_for: 'car rental' },
    { name: 'Ride-sharing service', type: 'transport', alternative_for: 'car rental' },
  ],
};

class RecoveryAgent {
  constructor() {
    this.status = 'idle';
    this.tripContext = null;
    this.recoveryPlans = [];
  }

  async initialize(trip) {
    this.tripContext = trip;
    this.status = 'active';
    console.log(`RecoveryAgent: Initialized for trip "${trip.title}"`);
  }

  async check(tripId) {
    try {
      const disruptions = await this.identifyDisruptions(tripId);

      return {
        status: 'ok',
        disruptionsDetected: disruptions.length,
        disruptionTypes: [...new Set(disruptions.map(d => d.type))],
        requiresRecoveryPlan: disruptions.length > 0,
      };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  async handleDisruption(tripId, disruption) {
    try {
      const recoveryPlan = {
        tripId,
        disruptionId: disruption.id,
        disruptionType: disruption.type,
        originalActivity: disruption.activity,
        severity: disruption.severity,
        createdAt: new Date().toISOString(),
        steps: [],
        alternatives: [],
      };

      // Generate recovery steps based on disruption type
      if (disruption.type === 'cancellation') {
        recoveryPlan.steps = [
          { step: 1, action: 'Acknowledge cancellation', status: 'pending' },
          { step: 2, action: 'Check for rebooking options', status: 'pending' },
          { step: 3, action: 'Contact customer service if applicable', status: 'pending' },
          { step: 4, action: 'Update itinerary with alternatives', status: 'pending' },
          { step: 5, action: 'Notify travel group of changes', status: 'pending' },
        ];

        // Get alternatives
        recoveryPlan.alternatives = await this.suggestAlternatives(tripId, disruption.activity);
      }

      if (disruption.type === 'delay') {
        recoveryPlan.steps = [
          { step: 1, action: 'Confirm new timing', status: 'pending' },
          { step: 2, action: 'Adjust subsequent activities if needed', status: 'pending' },
          { step: 3, action: 'Update group with new schedule', status: 'pending' },
          { step: 4, action: 'Arrange alternative activities for delay period', status: 'pending' },
        ];

        // Suggest quick activities for delay period
        recoveryPlan.alternatives = await this.suggestAlternatives(tripId, disruption.activity);
      }

      if (disruption.type === 'location_unavailable') {
        recoveryPlan.steps = [
          { step: 1, action: 'Confirm unavailability', status: 'pending' },
          { step: 2, action: 'Search for nearby alternatives', status: 'pending' },
          { step: 3, action: 'Check if alternative meets original requirements', status: 'pending' },
          { step: 4, action: 'Update booking if applicable', status: 'pending' },
          { step: 5, action: 'Proceed with alternative or reschedule', status: 'pending' },
        ];

        recoveryPlan.alternatives = await this.suggestAlternatives(tripId, disruption.activity);
      }

      if (disruption.type === 'weather') {
        recoveryPlan.steps = [
          { step: 1, action: 'Monitor weather forecast', status: 'pending' },
          { step: 2, action: 'Decide: reschedule or find indoor alternative', status: 'pending' },
          { step: 3, action: 'Check activity cancellation policy', status: 'pending' },
          { step: 4, action: 'Implement decision', status: 'pending' },
          { step: 5, action: 'Update group on changes', status: 'pending' },
        ];

        recoveryPlan.alternatives = await this.suggestAlternatives(tripId, disruption.activity);
      }

      this.recoveryPlans.push(recoveryPlan);
      console.log(`RecoveryAgent: Created recovery plan for ${disruption.type} disruption`);

      return {
        status: 'success',
        recoveryPlan,
        estimatedResolutionTime: disruption.severity === 'high' ? '2-4 hours' : '1-2 hours',
      };
    } catch (error) {
      console.error('RecoveryAgent: Error handling disruption:', error);
      return { status: 'error', error: error.message };
    }
  }

  async suggestAlternatives(tripId, cancelledActivity) {
    try {
      const activity = cancelledActivity;
      const alternatives = [];

      // Determine activity category and suggest alternatives
      let category = 'general';
      if (activity.includes('beach') || activity.includes('swim') || activity.includes('water')) {
        category = 'water';
      } else if (activity.includes('hike') || activity.includes('outdoor') || activity.includes('park')) {
        category = 'outdoor';
      } else if (activity.includes('dine') || activity.includes('restaurant') || activity.includes('eat')) {
        category = 'restaurant';
      } else if (activity.includes('travel') || activity.includes('drive') || activity.includes('transport')) {
        category = 'transport';
      }

      const categoryAlternatives = ALTERNATIVE_ACTIVITIES[category] || ALTERNATIVE_ACTIVITIES.outdoor;

      for (let i = 0; i < Math.min(3, categoryAlternatives.length); i++) {
        const alt = categoryAlternatives[i];
        alternatives.push({
          rank: i + 1,
          name: alt.name,
          type: alt.type,
          estimatedCost: Math.floor(Math.random() * 100) + 20,
          timeToArrange: Math.floor(Math.random() * 60) + 15,
          availability: Math.random() > 0.3 ? 'available' : 'limited',
          pros: this.generatePros(alt.type),
          cons: this.generateCons(alt.type),
        });
      }

      console.log(`RecoveryAgent: Generated ${alternatives.length} alternatives for "${activity}"`);
      return alternatives;
    } catch (error) {
      console.error('RecoveryAgent: Error suggesting alternatives:', error);
      return [];
    }
  }

  async handleEvent(event) {
    if (event.type === 'reservation_change') {
      console.log(`RecoveryAgent: Handling reservation change event`);
      const disruption = {
        id: `disruption_${Date.now()}`,
        type: 'reservation_change',
        activity: event.activity || 'Unknown activity',
        severity: 'medium',
      };
      return await this.handleDisruption(event.tripId, disruption);
    }

    return { status: 'ignored' };
  }

  getStatus() {
    return {
      name: 'RecoveryAgent',
      status: this.status,
      tripId: this.tripContext?.id || null,
      activePlans: this.recoveryPlans.length,
    };
  }

  // Helper methods
  async identifyDisruptions(tripId) {
    try {
      const activities = await pb.collection('activities').getFullList({
        filter: `trip = "${tripId}"`,
      });

      const disruptions = [];
      const now = new Date();

      // Check each activity for potential disruptions
      for (const activity of activities) {
        const activityTime = new Date(activity.start_time);

        // Simulate disruption detection
        if (Math.random() > 0.95) {
          // 5% chance of disruption for demo
          disruptions.push({
            id: activity.id,
            activity: activity.title,
            type: ['cancellation', 'delay', 'location_unavailable', 'weather'][Math.floor(Math.random() * 4)],
            severity: Math.random() > 0.5 ? 'high' : 'medium',
            detected: new Date().toISOString(),
          });
        }
      }

      return disruptions;
    } catch (error) {
      console.error('RecoveryAgent: Error identifying disruptions:', error);
      return [];
    }
  }

  generatePros(type) {
    const prosMap = {
      culture: ['Educational', 'Indoor option', 'Usually affordable'],
      food: ['Great experience', 'Flexible timing', 'Memorable'],
      water: ['Refreshing', 'Fun for groups', 'Good photo opportunities'],
      entertainment: ['No weather concerns', 'Easy to book', 'Family-friendly'],
      experience: ['Unique', 'Local flavor', 'Flexible duration'],
      shopping: ['Indoor', 'Flexible timing', 'Budget-dependent'],
      tour: ['Guided experience', 'Educational', 'Social'],
      adventure: ['Active', 'Memorable', 'Good for photos'],
      transport: ['Reliable', 'Convenient', 'Safe'],
    };

    return prosMap[type] || ['Good option', 'Worth trying'];
  }

  generateCons(type) {
    const consMap = {
      culture: ['May be crowded', 'Requires advance booking'],
      food: ['May be expensive', 'Requires reservation'],
      water: ['Weather dependent', 'May be crowded'],
      entertainment: ['Can be pricey', 'Availability varies'],
      experience: ['Availability varies', 'May require booking'],
      shopping: ['Can be crowded', 'Time-consuming'],
      tour: ['Fixed schedule', 'May not match interests'],
      adventure: ['Physically demanding', 'May require equipment'],
      transport: ['Shared with others', 'Less flexible timing'],
    };

    return consMap[type] || ['Consider timing', 'Check availability'];
  }
}

export default RecoveryAgent;
