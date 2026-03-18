import pb from '@/lib/pocketbaseClient.js';

class MonitorAgent {
  constructor() {
    this.status = 'idle';
    this.tripContext = null;
    this.lastCheckedAt = null;
  }

  async initialize(trip) {
    this.tripContext = trip;
    this.status = 'active';
    console.log(`MonitorAgent: Initialized for trip "${trip.title}"`);
  }

  async check(tripId) {
    try {
      const weatherCheck = await this.checkWeather(this.tripContext?.destination);
      const timeDrift = await this.checkTimeDrift(tripId);
      const alerts = await this.generateAlerts(tripId);

      this.lastCheckedAt = new Date().toISOString();

      return {
        status: 'ok',
        weather: weatherCheck,
        timeDrift: timeDrift,
        alerts: alerts,
        lastCheckedAt: this.lastCheckedAt,
      };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  async checkWeather(location) {
    // Mock weather data
    const conditions = ['sunny', 'cloudy', 'rainy', 'partly cloudy', 'thunderstorm'];
    const temperature = Math.floor(Math.random() * 25) + 15; // 15-40°C

    return {
      location: location || 'Unknown',
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      temperature: temperature,
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20),
      checkedAt: new Date().toISOString(),
      alerts: temperature > 35 ? ['Heat advisory - stay hydrated'] : [],
    };
  }

  async checkTimeDrift(tripId) {
    try {
      const activities = await pb.collection('activities').getFullList({
        filter: `trip = "${tripId}"`,
        sort: 'start_time',
      });

      const driftAnalysis = [];
      const now = new Date();

      for (const activity of activities) {
        const plannedStart = new Date(activity.start_time);
        const actualStart = activity.actual_start_time ? new Date(activity.actual_start_time) : null;

        if (actualStart && plannedStart < now) {
          const driftMinutes = Math.floor((actualStart - plannedStart) / 60000);
          if (Math.abs(driftMinutes) > 5) {
            driftAnalysis.push({
              activity: activity.title,
              plannedStart: plannedStart.toISOString(),
              actualStart: actualStart.toISOString(),
              driftMinutes: driftMinutes,
            });
          }
        }
      }

      return {
        activitiesAnalyzed: activities.length,
        driftsDetected: driftAnalysis.length,
        drifts: driftAnalysis,
        averageDrift: driftAnalysis.length > 0
          ? Math.round(driftAnalysis.reduce((sum, d) => sum + d.driftMinutes, 0) / driftAnalysis.length)
          : 0,
      };
    } catch (error) {
      console.error('MonitorAgent: Error checking time drift:', error);
      return { activitiesAnalyzed: 0, driftsDetected: 0, drifts: [] };
    }
  }

  async calculateLeaveBy(activity) {
    // Mock calculation for when to leave for an activity
    const activityTime = new Date(activity.start_time);
    const travelTime = activity.estimated_travel_time || 30; // minutes
    const bufferTime = 15; // minutes before activity

    const leaveTime = new Date(activityTime.getTime() - (travelTime + bufferTime) * 60000);

    return {
      activity: activity.title,
      activityStartTime: activityTime.toISOString(),
      leaveByTime: leaveTime.toISOString(),
      travelTimeMinutes: travelTime,
      bufferMinutes: bufferTime,
      totalLeadTime: travelTime + bufferTime,
    };
  }

  async generateAlerts(tripId) {
    const alerts = [];

    try {
      const trip = await pb.collection('trips').getOne(tripId);
      const now = new Date();
      const tripStart = new Date(trip.start_date);
      const tripEnd = new Date(trip.end_date);

      // Check if trip is soon
      const daysUntilTrip = Math.ceil((tripStart - now) / (1000 * 60 * 60 * 24));
      if (daysUntilTrip === 7) {
        alerts.push({
          type: 'info',
          message: 'Trip starts in one week! Time to pack and confirm reservations.',
          severity: 'low',
          actionRequired: false,
        });
      }
      if (daysUntilTrip === 1) {
        alerts.push({
          type: 'warning',
          message: 'Trip starts tomorrow! Final check on itinerary and reservations.',
          severity: 'medium',
          actionRequired: false,
        });
      }

      // Check for activities without accommodations
      const activities = await pb.collection('activities').getFullList({
        filter: `trip = "${tripId}"`,
      });

      const accommodations = await pb.collection('accommodations').getFullList({
        filter: `trip = "${tripId}"`,
      });

      if (activities.length > 0 && accommodations.length === 0) {
        alerts.push({
          type: 'warning',
          message: 'No accommodations booked. Please add lodging details.',
          severity: 'high',
          actionRequired: true,
        });
      }

      // Check for budget alerts
      const totalBudget = trip.budget || 5000;
      const estimatedSpend = activities.reduce((sum, a) => sum + (a.estimated_cost || 0), 0);
      if (estimatedSpend > totalBudget * 0.9) {
        alerts.push({
          type: 'warning',
          message: `Budget at ${Math.round((estimatedSpend / totalBudget) * 100)}% of limit. Consider cost-saving options.`,
          severity: 'medium',
          actionRequired: false,
        });
      }

      // Check for very packed days
      const daysWithMany = activities.filter(a => {
        const actDay = new Date(a.start_time).toDateString();
        return activities.filter(b => new Date(b.start_time).toDateString() === actDay).length > 4;
      });

      if (daysWithMany.length > 0) {
        alerts.push({
          type: 'info',
          message: `${daysWithMany.length} day(s) have many activities. Consider relaxing the pace.`,
          severity: 'low',
          actionRequired: false,
        });
      }
    } catch (error) {
      console.error('MonitorAgent: Error generating alerts:', error);
    }

    return alerts;
  }

  async handleEvent(event) {
    if (event.type === 'weather_change') {
      console.log(`MonitorAgent: Handling weather change event for ${event.tripId}`);
      return { status: 'processed', event: event.type, weatherAlert: true };
    }
    if (event.type === 'time_drift') {
      console.log(`MonitorAgent: Handling time drift event for ${event.tripId}`);
      return { status: 'processed', event: event.type, driftAlert: true };
    }
    if (event.type === 'reservation_change') {
      console.log(`MonitorAgent: Handling reservation change event for ${event.tripId}`);
      return { status: 'processed', event: event.type, reservationAlert: true };
    }
    return { status: 'ignored' };
  }

  getStatus() {
    return {
      name: 'MonitorAgent',
      status: this.status,
      tripId: this.tripContext?.id || null,
      lastCheckedAt: this.lastCheckedAt,
    };
  }
}

export default MonitorAgent;
