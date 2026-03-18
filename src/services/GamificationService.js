
import pb from '@/lib/pocketbaseClient';

/**
 * Service for badges, achievements, leaderboards, and challenges.
 */
export const GamificationService = {
  async getUserAchievements(userId) {
    try {
      return await pb.collection('Achievements').getFirstListItem(`user_id="${userId}"`, {
        $autoCancel: false
      });
    } catch (e) {
      return { badge_ids: [], challenge_ids: [], progress: {} };
    }
  },

  async getLeaderboard(type = 'traveler', period = 'monthly') {
    try {
      return await pb.collection('Leaderboards').getFirstListItem(`type="${type}" && period="${period}"`, {
        $autoCancel: false
      });
    } catch (e) {
      return { top_users: [] };
    }
  },

  async getActiveChallenges() {
    return await pb.collection('Challenges').getFullList({
      filter: `start_date <= @now && end_date >= @now`,
      $autoCancel: false
    });
  }
};
