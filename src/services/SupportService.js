
import pb from '@/lib/pocketbaseClient';

/**
 * Service for ticketing, live chat, and knowledge base.
 */
export const SupportService = {
  async getTickets(userId) {
    return await pb.collection('SupportTickets').getFullList({
      filter: `user_id = "${userId}"`,
      sort: '-created',
      $autoCancel: false
    });
  },

  async createTicket(userId, subject, description, category, priority) {
    return await pb.collection('SupportTickets').create({
      user_id: userId,
      subject,
      description,
      category,
      priority,
      status: 'open'
    }, { $autoCancel: false });
  },

  async searchKnowledgeBase(query) {
    return await pb.collection('KnowledgeBaseArticles').getFullList({
      filter: `title ~ "${query}" || body ~ "${query}"`,
      $autoCancel: false
    });
  },

  async startLiveChat(userId) {
    return await pb.collection('LiveChats').create({
      user_id: userId,
      status: 'open',
      messages: [{ sender: 'system', text: 'Connecting you to an agent...', timestamp: new Date().toISOString() }]
    }, { $autoCancel: false });
  }
};
