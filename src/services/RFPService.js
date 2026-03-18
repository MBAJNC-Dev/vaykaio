
import pb from '@/lib/pocketbaseClient';

export const RFPService = {
  async getDashboardStats(userId) {
    try {
      const rfps = await pb.collection('rfps').getFullList({
        filter: `user_id = "${userId}"`,
        $autoCancel: false
      });
      
      const activeCount = rfps.filter(r => ['draft', 'submitted', 'pending', 'responded'].includes(r.status)).length;
      const acceptedCount = rfps.filter(r => r.status === 'accepted').length;
      
      return {
        activeRFPs: activeCount,
        pendingResponses: rfps.filter(r => r.status === 'submitted' || r.status === 'pending').length,
        acceptedQuotes: acceptedCount,
        totalSavings: acceptedCount * 1250, // Mock calculation
        successRate: rfps.length ? Math.round((acceptedCount / rfps.length) * 100) : 0
      };
    } catch (error) {
      console.error("Error fetching RFP stats:", error);
      return { activeRFPs: 0, pendingResponses: 0, acceptedQuotes: 0, totalSavings: 0, successRate: 0 };
    }
  },

  async getRecentRFPs(userId) {
    try {
      return await pb.collection('rfps').getList(1, 5, {
        filter: `user_id = "${userId}"`,
        sort: '-created',
        $autoCancel: false
      });
    } catch (error) {
      console.error("Error fetching recent RFPs:", error);
      return { items: [] };
    }
  },

  async createRFP(data) {
    const rfpData = {
      user_id: pb.authStore.model.id,
      property_name: data.propertyName,
      property_url: data.propertyUrl,
      group_size: parseInt(data.groupSize),
      check_in_date: data.checkInDate,
      check_out_date: data.checkOutDate,
      status: 'draft'
    };

    const rfp = await pb.collection('rfps').create(rfpData, { $autoCancel: false });

    const detailsData = {
      rfp_id: rfp.id,
      rooms_needed: parseInt(data.roomsNeeded),
      room_types: data.roomTypes,
      meal_plan: data.mealPlan,
      activities: data.activities,
      special_requests: data.specialRequests,
      dietary_restrictions: data.dietaryRestrictions,
      budget_range: data.budgetRange
    };

    await pb.collection('rfp_details').create(detailsData, { $autoCancel: false });
    return rfp;
  }
};
