import pb from '@/lib/pocketbaseClient.js';

const ACTIVITY_TEMPLATES = {
  beach: [
    { name: 'Swimming and sunbathing', duration: 180, type: 'water', cost: 0 },
    { name: 'Snorkeling adventure', duration: 240, type: 'water', cost: 45 },
    { name: 'Beach volleyball', duration: 120, type: 'water', cost: 0 },
    { name: 'Sunset beach walk', duration: 90, type: 'water', cost: 0 },
  ],
  city: [
    { name: 'Museum visit', duration: 180, type: 'culture', cost: 20 },
    { name: 'Street food tour', duration: 120, type: 'food', cost: 35 },
    { name: 'Shopping and sightseeing', duration: 240, type: 'shopping', cost: 50 },
    { name: 'Architecture walking tour', duration: 150, type: 'culture', cost: 25 },
    { name: 'Local market exploration', duration: 120, type: 'food', cost: 0 },
    { name: 'City viewpoint visit', duration: 90, type: 'sightseeing', cost: 15 },
  ],
  mountain: [
    { name: 'Hiking trail', duration: 240, type: 'adventure', cost: 0 },
    { name: 'Mountain biking', duration: 180, type: 'adventure', cost: 30 },
    { name: 'Scenic viewpoint photography', duration: 120, type: 'photography', cost: 0 },
    { name: 'Camping and nature', duration: 300, type: 'adventure', cost: 20 },
  ],
  culture: [
    { name: 'Temple or monument visit', duration: 120, type: 'culture', cost: 15 },
    { name: 'Traditional cooking class', duration: 180, type: 'food', cost: 55 },
    { name: 'Local artisan workshop', duration: 150, type: 'culture', cost: 40 },
    { name: 'Traditional dance show', duration: 120, type: 'culture', cost: 45 },
  ],
  food: [
    { name: 'Fine dining experience', duration: 150, type: 'food', cost: 120 },
    { name: 'Street food tasting', duration: 90, type: 'food', cost: 20 },
    { name: 'Wine or brewery tour', duration: 180, type: 'food', cost: 60 },
    { name: 'Local restaurant exploration', duration: 120, type: 'food', cost: 40 },
  ],
};

class PlannerAgent {
  constructor() {
    this.status = 'idle';
    this.tripContext = null;
  }

  async initialize(trip) {
    this.tripContext = trip;
    this.status = 'active';
    console.log(`PlannerAgent: Initialized for trip "${trip.title}"`);
  }

  async check(tripId) {
    try {
      const trip = await pb.collection('trips').getOne(tripId);
      const activities = await pb.collection('activities').getFullList({
        filter: `trip = "${tripId}"`,
      });

      const hasEmptySlots = this.hasScheduleGaps(activities);
      const needsOptimization = activities.length < this.estimateIdealActivityCount(trip);

      return {
        status: 'ok',
        hasEmptySlots,
        needsOptimization,
        currentActivityCount: activities.length,
        estimatedIdealCount: this.estimateIdealActivityCount(trip),
      };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  async generateItinerary(tripId, preferences = {}) {
    try {
      const trip = await pb.collection('trips').getOne(tripId);
      const itinerary = [];

      const startDate = new Date(trip.start_date);
      const endDate = new Date(trip.end_date);
      const tripLength = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      // Determine destination type for activity selection
      const destType = this.getDestinationType(trip.destination);

      for (let day = 0; day < tripLength; day++) {
        const dayDate = new Date(startDate);
        dayDate.setDate(dayDate.getDate() + day);

        const dayActivities = this.generateDayActivities(destType, trip, day + 1, preferences);
        itinerary.push({
          day: day + 1,
          date: dayDate.toISOString().split('T')[0],
          activities: dayActivities,
        });
      }

      console.log(`PlannerAgent: Generated ${tripLength}-day itinerary for trip ${tripId}`);
      return { status: 'success', itinerary, totalDays: tripLength };
    } catch (error) {
      console.error('PlannerAgent: Error generating itinerary:', error);
      return { status: 'error', error: error.message };
    }
  }

  async suggestActivity(tripId, timeSlot) {
    try {
      const trip = await pb.collection('trips').getOne(tripId);
      const destType = this.getDestinationType(trip.destination);
      const templates = ACTIVITY_TEMPLATES[destType] || ACTIVITY_TEMPLATES.city;

      // Pick a random activity and adjust for time slot
      const baseActivity = templates[Math.floor(Math.random() * templates.length)];
      const activity = {
        ...baseActivity,
        startTime: timeSlot.start,
        endTime: timeSlot.end,
        suggestedAt: new Date().toISOString(),
      };

      console.log(`PlannerAgent: Suggested activity "${activity.name}" for ${tripId}`);
      return { status: 'success', suggestion: activity };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  async handleEvent(event) {
    if (event.type === 'new_activity') {
      console.log(`PlannerAgent: Handling new activity event for ${event.tripId}`);
      return { status: 'processed', event: event.type };
    }
    if (event.type === 'member_joined') {
      console.log(`PlannerAgent: Adjusting itinerary for new member in trip ${event.tripId}`);
      return { status: 'processed', event: event.type };
    }
    return { status: 'ignored' };
  }

  getStatus() {
    return {
      name: 'PlannerAgent',
      status: this.status,
      tripId: this.tripContext?.id || null,
    };
  }

  // Helper methods
  hasScheduleGaps(activities) {
    if (activities.length === 0) return true;
    const sortedActivities = activities.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    for (let i = 0; i < sortedActivities.length - 1; i++) {
      const gap = new Date(sortedActivities[i + 1].start_time) - new Date(sortedActivities[i].end_time);
      if (gap > 3600000) return true; // More than 1 hour gap
    }
    return false;
  }

  estimateIdealActivityCount(trip) {
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return days * 2; // Roughly 2 activities per day
  }

  getDestinationType(destination) {
    const dest = destination.toLowerCase();
    if (dest.includes('beach') || dest.includes('island') || dest.includes('coast')) return 'beach';
    if (dest.includes('mountain') || dest.includes('alps') || dest.includes('peak')) return 'mountain';
    if (dest.includes('paris') || dest.includes('city') || dest.includes('urban')) return 'city';
    if (dest.includes('temple') || dest.includes('historic') || dest.includes('cultural')) return 'culture';
    if (dest.includes('food') || dest.includes('wine') || dest.includes('cuisine')) return 'food';
    return 'city'; // Default to city
  }

  generateDayActivities(destType, trip, dayNumber, preferences) {
    const templates = ACTIVITY_TEMPLATES[destType] || ACTIVITY_TEMPLATES.city;
    const numActivities = preferences.pace === 'relaxed' ? 1 : preferences.pace === 'moderate' ? 2 : 3;
    const activities = [];

    for (let i = 0; i < numActivities; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const startHour = 8 + i * 6;
      activities.push({
        title: template.name,
        time: `${String(startHour).padStart(2, '0')}:00`,
        duration: template.duration,
        category: template.type,
        estimatedCost: template.cost,
        description: `${template.name} - Day ${dayNumber}, Activity ${i + 1}`,
      });
    }

    return activities;
  }
}

export default PlannerAgent;
