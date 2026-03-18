
import pb from '@/lib/pocketbaseClient';

export const AIVacationPlannerService = {
  async createPlan(planData) {
    try {
      const record = await pb.collection('AIPlans').create({
        user_id: pb.authStore.model?.id,
        plan_name: planData.plan_name || 'My Vacation Plan',
        destination: planData.destination || 'TBD',
        start_date: planData.start_date || new Date().toISOString(),
        end_date: planData.end_date || new Date().toISOString(),
        travelers_count: planData.travelers_count || 1,
        budget: planData.budget || 0,
        status: 'draft'
      }, { $autoCancel: false });
      return record;
    } catch (error) {
      console.error("Error creating plan:", error);
      throw error;
    }
  },

  async updatePlan(planId, updates) {
    try {
      return await pb.collection('AIPlans').update(planId, updates, { $autoCancel: false });
    } catch (error) {
      console.error("Error updating plan:", error);
      throw error;
    }
  },

  async getPlan(planId) {
    try {
      return await pb.collection('AIPlans').getOne(planId, { $autoCancel: false });
    } catch (error) {
      console.error("Error getting plan:", error);
      throw error;
    }
  },

  async listPlans(userId) {
    try {
      return await pb.collection('AIPlans').getFullList({
        filter: `user_id = "${userId}"`,
        sort: '-created',
        $autoCancel: false
      });
    } catch (error) {
      console.error("Error listing plans:", error);
      return [];
    }
  },

  async deletePlan(planId) {
    try {
      await pb.collection('AIPlans').delete(planId, { $autoCancel: false });
      return true;
    } catch (error) {
      console.error("Error deleting plan:", error);
      throw error;
    }
  },

  async savePlanDetails(planId, details) {
    try {
      // Check if details exist
      const existing = await pb.collection('AIPlanDetails').getList(1, 1, {
        filter: `plan_id = "${planId}"`,
        $autoCancel: false
      });

      if (existing.items.length > 0) {
        return await pb.collection('AIPlanDetails').update(existing.items[0].id, details, { $autoCancel: false });
      } else {
        return await pb.collection('AIPlanDetails').create({
          plan_id: planId,
          ...details
        }, { $autoCancel: false });
      }
    } catch (error) {
      console.error("Error saving plan details:", error);
      throw error;
    }
  }
};
