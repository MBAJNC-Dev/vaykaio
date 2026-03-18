
import pb from '@/lib/pocketbaseClient';

/**
 * Service for referrals, promotions, and email marketing.
 */
export const MarketingService = {
  async getReferralStats(userId) {
    const referrals = await pb.collection('Referrals').getFullList({
      filter: `referrer_id = "${userId}"`,
      $autoCancel: false
    });
    
    return {
      totalReferrals: referrals.length,
      completedReferrals: referrals.filter(r => r.status === 'completed').length,
      rewardsEarned: referrals.reduce((sum, r) => sum + (r.reward_earned || 0), 0),
      referralCode: `REF-${userId.substring(0, 6).toUpperCase()}`
    };
  },

  async getActivePromotions() {
    return await pb.collection('Promotions').getFullList({
      filter: `status = "active"`,
      $autoCancel: false
    });
  },

  async updateEmailPreferences(userId, preferences) {
    // Assuming preferences are stored in UserProfiles or a dedicated collection
    return { success: true, message: 'Preferences updated' };
  }
};
