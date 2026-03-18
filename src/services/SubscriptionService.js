import supabase from '@/lib/supabaseClient.js';

const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: {
      trips: 1,
      itinerary: 'basic',
      members: 2,
      aiAgents: false
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    features: {
      trips: 'unlimited',
      itinerary: 'ai-powered',
      members: 10,
      aiAgents: 'basic',
      groupSync: true
    }
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    features: {
      trips: 'unlimited',
      itinerary: 'ai-powered',
      members: 'unlimited',
      aiAgents: 'all',
      groupSync: true,
      memoryTimeline: true,
      prioritySupport: true
    }
  }
};

class SubscriptionService {
  // Get all available plans
  static getPlans() {
    return Object.values(PLANS);
  }

  // Get specific plan by ID
  static getPlan(planId) {
    return PLANS[planId] || null;
  }

  // Get user's current subscription
  static async getCurrentSubscription(userId) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_plan, subscription_status, subscription_renewal_date')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const planId = profile?.subscription_plan || 'free';
      const plan = PLANS[planId];

      return {
        userId,
        planId,
        plan,
        status: profile?.subscription_status || 'active',
        startDate: profile?.created_at || new Date(),
        renewalDate: profile?.subscription_renewal_date || null,
        paymentMethod: null
      };
    } catch (error) {
      console.error('Failed to get subscription:', error);
      // Default to free plan
      return {
        userId,
        planId: 'free',
        plan: PLANS.free,
        status: 'active',
        startDate: new Date(),
        renewalDate: null,
        paymentMethod: null
      };
    }
  }

  // Subscribe to a plan
  static async subscribe(userId, planId) {
    try {
      const plan = PLANS[planId];
      if (!plan) throw new Error('Invalid plan');

      const renewalDate = planId !== 'free' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null;

      const { data, error } = await supabase
        .from('profiles')
        .update({
          subscription_plan: planId,
          subscription_status: 'active',
          subscription_renewal_date: renewalDate,
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return {
        userId,
        planId,
        plan,
        status: 'active',
        startDate: new Date(),
        renewalDate,
        paymentMethod: planId !== 'free' ? { last4: '4242', brand: 'Visa' } : null
      };
    } catch (error) {
      console.error('Subscription failed:', error);
      throw error;
    }
  }

  // Upgrade subscription to a higher plan
  static async upgradeSubscription(userId, newPlanId) {
    try {
      const newPlan = PLANS[newPlanId];
      if (!newPlan) throw new Error('Invalid plan');

      const renewalDate = newPlanId !== 'free' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null;

      const { data, error } = await supabase
        .from('profiles')
        .update({
          subscription_plan: newPlanId,
          subscription_status: 'active',
          subscription_renewal_date: renewalDate,
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return {
        userId,
        planId: newPlanId,
        plan: newPlan,
        status: 'active',
        upgradeDate: new Date(),
        renewalDate,
      };
    } catch (error) {
      console.error('Upgrade failed:', error);
      throw error;
    }
  }

  // Cancel subscription
  static async cancelSubscription(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          subscription_plan: 'free',
          subscription_status: 'cancelled',
          subscription_renewal_date: null,
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return {
        userId,
        planId: 'free',
        plan: PLANS.free,
        status: 'cancelled',
        cancelledDate: new Date(),
        renewalDate: null
      };
    } catch (error) {
      console.error('Cancellation failed:', error);
      throw error;
    }
  }

  // Downgrade subscription
  static async downgradeSubscription(userId, newPlanId) {
    return this.upgradeSubscription(userId, newPlanId);
  }

  // Get feature access based on plan
  static async getFeatureAccess(userId) {
    try {
      const subscription = await this.getCurrentSubscription(userId);
      const plan = subscription.plan;

      return {
        trips: plan.features.trips,
        itinerary: plan.features.itinerary,
        members: plan.features.members,
        aiAgents: plan.features.aiAgents,
        groupSync: plan.features.groupSync || false,
        memoryTimeline: plan.features.memoryTimeline || false,
        prioritySupport: plan.features.prioritySupport || false,
        voiceInput: plan.features.voiceInput || false,
        calendarSync: plan.features.calendarSync || false,
        budgetOptimization: plan.features.budgetOptimization || false,
        offlineMode: plan.features.offlineMode || false
      };
    } catch (error) {
      console.error('Failed to get feature access:', error);
      return null;
    }
  }

  // Get billing history
  static async getBillingHistory(userId) {
    try {
      const { data, error } = await supabase
        .from('billing_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get billing history:', error);
      return [];
    }
  }

  // Add billing record
  static async addBillingRecord(userId, record) {
    try {
      const { data, error } = await supabase
        .from('billing_records')
        .insert({
          user_id: userId,
          ...record,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to add billing record:', error);
      throw error;
    }
  }

  // Get next billing date
  static async getNextBillingDate(userId) {
    try {
      const subscription = await this.getCurrentSubscription(userId);
      return subscription.renewalDate || null;
    } catch (error) {
      console.error('Failed to get next billing date:', error);
      return null;
    }
  }
}

export default SubscriptionService;
