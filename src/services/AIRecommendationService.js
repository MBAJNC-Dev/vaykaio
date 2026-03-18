
import pb from '@/lib/pocketbaseClient';

/**
 * Service for handling AI-driven travel recommendations.
 */
export const AIRecommendationService = {
  /**
   * Fetches personalized recommendations for a user.
   * @param {string} userId - The user's ID.
   * @param {string} type - Type of recommendation (destination, activity, etc.)
   * @returns {Promise<Array>} List of recommendations.
   */
  async getRecommendations(userId, type = null) {
    try {
      let filter = `user_id = "${userId}"`;
      if (type) filter += ` && type = "${type}"`;
      
      return await pb.collection('AIRecommendations').getFullList({
        filter,
        sort: '-score',
        $autoCancel: false
      });
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      throw error;
    }
  },

  /**
   * Generates new recommendations based on user preferences.
   * @param {Object} preferences - User preferences object.
   * @returns {Promise<Object>} Generated recommendation data.
   */
  async generateNewRecommendations(preferences) {
    // In a real app, this would call a backend endpoint that interfaces with OpenAI/Gemini
    // For now, we simulate the API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            { title: 'Kyoto, Japan', score: 95, reason: 'Matches your interest in culture and food.' },
            { title: 'Reykjavik, Japan', score: 88, reason: 'Great for historical exploration.' }
          ]
        });
      }, 1500);
    });
  },

  /**
   * Saves feedback on a recommendation to improve future results.
   * @param {string} recommendationId - The ID of the recommendation.
   * @param {string} feedback - 'positive' or 'negative'.
   */
  async submitFeedback(recommendationId, feedback) {
    return await pb.collection('AIRecommendations').update(recommendationId, {
      feedback,
      $autoCancel: false
    });
  }
};
