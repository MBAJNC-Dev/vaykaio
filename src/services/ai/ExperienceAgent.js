import pb from '@/lib/pocketbaseClient.js';

const PLACE_DATABASE = {
  restaurants: [
    { name: 'The Seaside Bistro', category: 'seafood', rating: 4.7, price: '$$', distance: 0.5, cuisine: 'Mediterranean' },
    { name: 'Urban Kitchen', category: 'modern', rating: 4.5, price: '$$$', distance: 1.2, cuisine: 'Contemporary' },
    { name: 'Local Flavors', category: 'local', rating: 4.8, price: '$', distance: 0.3, cuisine: 'Traditional' },
    { name: 'The Grill House', category: 'steakhouse', rating: 4.6, price: '$$$', distance: 2.1, cuisine: 'Steakhouse' },
    { name: 'Spice Route', category: 'asian', rating: 4.4, price: '$$', distance: 1.5, cuisine: 'Asian Fusion' },
  ],
  attractions: [
    { name: 'Central Museum', category: 'museum', rating: 4.6, price: 15, distance: 2.3, duration: 180 },
    { name: 'Historic Old Town', category: 'sightseeing', rating: 4.8, price: 0, distance: 1.0, duration: 120 },
    { name: 'Art Gallery District', category: 'art', rating: 4.5, price: 12, distance: 3.1, duration: 150 },
    { name: 'Botanical Gardens', category: 'nature', rating: 4.7, price: 10, distance: 4.5, duration: 120 },
    { name: 'Adventure Park', category: 'adventure', rating: 4.4, price: 45, distance: 5.2, duration: 240 },
  ],
  activities: [
    { name: 'Cooking Class', category: 'workshop', rating: 4.9, price: 65, distance: 1.0, duration: 180 },
    { name: 'City Bike Tour', category: 'tour', rating: 4.6, price: 35, distance: 0.2, duration: 120 },
    { name: 'Spa & Wellness', category: 'wellness', rating: 4.8, price: 100, distance: 0.8, duration: 120 },
    { name: 'Sunset Cruise', category: 'tour', rating: 4.7, price: 55, distance: 2.0, duration: 150 },
    { name: 'Market Walking Tour', category: 'tour', rating: 4.5, price: 25, distance: 0.5, duration: 90 },
  ],
};

class ExperienceAgent {
  constructor() {
    this.status = 'idle';
    this.tripContext = null;
    this.recommendations = [];
  }

  async initialize(trip) {
    this.tripContext = trip;
    this.status = 'active';
    console.log(`ExperienceAgent: Initialized for trip "${trip.title}"`);
  }

  async check(tripId) {
    try {
      const trip = await pb.collection('trips').getOne(tripId);
      const recommendations = await this.getRecommendations(tripId, {});

      return {
        status: 'ok',
        recommendationsAvailable: recommendations.length > 0,
        topRecommendations: recommendations.slice(0, 3),
        totalRecommendations: recommendations.length,
      };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  async getRecommendations(tripId, options = {}) {
    try {
      const trip = await pb.collection('trips').getOne(tripId);
      const userPreferences = trip.preferences || {};
      const budget = options.budget || trip.budget || 5000;
      const timeOfDay = options.timeOfDay || new Date().getHours();

      const recommendations = [];

      // Filter recommendations based on preferences and constraints
      const allPlaces = [
        ...PLACE_DATABASE.restaurants.map(p => ({ ...p, type: 'restaurant' })),
        ...PLACE_DATABASE.attractions.map(p => ({ ...p, type: 'attraction' })),
        ...PLACE_DATABASE.activities.map(p => ({ ...p, type: 'activity' })),
      ];

      // Score and sort recommendations
      const scored = allPlaces.map(place => {
        let score = place.rating * 10;

        // Time-of-day preference
        if (place.type === 'restaurant') {
          if ((timeOfDay >= 11 && timeOfDay < 14) || (timeOfDay >= 18 && timeOfDay < 22)) score += 5;
        }

        // Budget consideration
        const priceValue = place.price ? place.price.length : 1;
        if (priceValue <= 2) score += 3;

        // Distance preference (closer is better)
        if (place.distance && place.distance < 2) score += 5;

        // Preference matching
        if (userPreferences.interests) {
          userPreferences.interests.forEach(interest => {
            if (place.category && place.category.includes(interest.toLowerCase())) score += 10;
            if (place.cuisine && place.cuisine.includes(interest)) score += 8;
          });
        }

        return { ...place, score };
      });

      // Sort by score and return top recommendations
      const sorted = scored.sort((a, b) => b.score - a.score).slice(0, 10);

      this.recommendations = sorted;
      console.log(`ExperienceAgent: Generated ${sorted.length} recommendations for trip ${tripId}`);

      return sorted;
    } catch (error) {
      console.error('ExperienceAgent: Error getting recommendations:', error);
      return [];
    }
  }

  async getNextBestAction(tripId) {
    try {
      const trip = await pb.collection('trips').getOne(tripId);
      const activities = await pb.collection('activities').getFullList({
        filter: `trip = "${tripId}"`,
        sort: 'start_time',
      });

      const now = new Date();
      const nextActivity = activities.find(a => new Date(a.start_time) > now);

      if (!nextActivity) {
        // No scheduled activity, suggest options
        const recommendations = await this.getRecommendations(tripId, {});
        return {
          status: 'no_scheduled_activity',
          suggestions: recommendations.slice(0, 5),
          message: 'No scheduled activities. Here are recommended experiences:',
        };
      }

      // Time until next activity
      const timeUntil = Math.floor((new Date(nextActivity.start_time) - now) / 60000);

      if (timeUntil > 90) {
        // Opportunity for something quick
        const recommendations = await this.getRecommendations(tripId, {
          timeOfDay: now.getHours(),
          maxDuration: timeUntil - 30,
        });
        return {
          status: 'time_available',
          timeAvailable: timeUntil - 30,
          nextScheduledActivity: nextActivity.title,
          suggestions: recommendations.slice(0, 3),
          message: `You have ${timeUntil - 30} minutes. Quick suggestions before ${nextActivity.title}:`,
        };
      }

      return {
        status: 'busy',
        nextActivity: nextActivity.title,
        timeUntil: timeUntil,
        message: `Upcoming: ${nextActivity.title} in ${timeUntil} minutes. Start heading that way!`,
      };
    } catch (error) {
      console.error('ExperienceAgent: Error getting next best action:', error);
      return { status: 'error', error: error.message };
    }
  }

  async searchNearby(location, category, radius = 5) {
    // Search for nearby places of a specific category
    let allPlaces = [];

    if (category.includes('restaurant') || category.includes('food')) {
      allPlaces = PLACE_DATABASE.restaurants;
    } else if (category.includes('attraction') || category.includes('sightseeing')) {
      allPlaces = PLACE_DATABASE.attractions;
    } else if (category.includes('activity') || category.includes('experience')) {
      allPlaces = PLACE_DATABASE.activities;
    } else {
      // Return all
      allPlaces = [
        ...PLACE_DATABASE.restaurants,
        ...PLACE_DATABASE.attractions,
        ...PLACE_DATABASE.activities,
      ];
    }

    // Filter by distance (mock)
    const nearby = allPlaces.filter(p => (p.distance || 0) <= radius);

    console.log(`ExperienceAgent: Found ${nearby.length} places near ${location} (${category})`);

    return {
      location,
      category,
      radius,
      results: nearby.sort((a, b) => (b.rating || 0) - (a.rating || 0)),
      count: nearby.length,
    };
  }

  async handleEvent(event) {
    if (event.type === 'new_activity') {
      console.log(`ExperienceAgent: Handling new activity event - updating recommendations`);
      await this.getRecommendations(event.tripId);
      return { status: 'processed', event: event.type };
    }
    return { status: 'ignored' };
  }

  getStatus() {
    return {
      name: 'ExperienceAgent',
      status: this.status,
      tripId: this.tripContext?.id || null,
      recommendationsLoaded: this.recommendations.length > 0,
    };
  }
}

export default ExperienceAgent;
