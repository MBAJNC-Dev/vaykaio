
import pb from '@/lib/pocketbaseClient';

/**
 * Service for user insights and advanced reporting.
 */
export const AnalyticsService = {
  async getUserInsights(userId) {
    // Simulated aggregation of user travel data
    return {
      totalTrips: 12,
      countriesVisited: 8,
      favoriteCategory: 'Adventure',
      averageTripDuration: 6.5, // days
      carbonFootprint: '2.4 tons'
    };
  },

  async getAdvancedReport(userId, dateRange) {
    // Simulated report generation
    return {
      spendingByCategory: [
        { name: 'Flights', value: 4500 },
        { name: 'Hotels', value: 3200 },
        { name: 'Food', value: 1800 },
        { name: 'Activities', value: 1200 }
      ],
      travelFrequency: [
        { month: 'Jan', trips: 1 },
        { month: 'Feb', trips: 0 },
        { month: 'Mar', trips: 2 }
      ]
    };
  }
};
