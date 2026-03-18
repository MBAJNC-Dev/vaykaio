
import pb from '@/lib/pocketbaseClient';

/**
 * Service for marketplace integrations and custom builders.
 */
export const IntegrationService = {
  async getAvailableIntegrations() {
    return await pb.collection('Integrations').getFullList({
      $autoCancel: false
    });
  },

  async getUserIntegrations(userId) {
    return await pb.collection('CustomIntegrations').getFullList({
      filter: `user_id = "${userId}"`,
      $autoCancel: false
    });
  },

  async connectIntegration(userId, integrationId, config) {
    return await pb.collection('CustomIntegrations').create({
      user_id: userId,
      integration_id: integrationId,
      config,
      status: 'active'
    }, { $autoCancel: false });
  }
};
