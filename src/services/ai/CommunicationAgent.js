import pb from '@/lib/pocketbaseClient.js';

class CommunicationAgent {
  constructor() {
    this.status = 'idle';
    this.tripContext = null;
    this.pendingNotifications = [];
  }

  async initialize(trip) {
    this.tripContext = trip;
    this.status = 'active';
    console.log(`CommunicationAgent: Initialized for trip "${trip.title}"`);
  }

  async check(tripId) {
    try {
      const notifications = await this.getPendingNotifications(tripId);
      const groupMembers = await this.getGroupMembers(tripId);

      return {
        status: 'ok',
        pendingNotifications: notifications.length,
        groupSize: groupMembers.length,
        notificationsNeedingReview: notifications.filter(n => n.status === 'pending').length,
      };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  async notifyGroup(tripId, message, urgency = 'normal') {
    try {
      const groupMembers = await this.getGroupMembers(tripId);

      const notification = {
        tripId,
        type: 'group',
        message,
        urgency, // 'low', 'normal', 'high'
        sentAt: new Date().toISOString(),
        recipientCount: groupMembers.length,
        recipients: groupMembers.map(m => m.id),
        status: 'sent',
      };

      // Log the notification
      this.pendingNotifications.push(notification);

      console.log(`CommunicationAgent: Sent group notification to ${groupMembers.length} members: "${message}"`);

      // In a real app, would send via push/email/SMS
      return {
        status: 'success',
        notification,
        deliveredTo: groupMembers.length,
      };
    } catch (error) {
      console.error('CommunicationAgent: Error notifying group:', error);
      return { status: 'error', error: error.message };
    }
  }

  async notifyMember(tripId, userId, message, urgency = 'normal') {
    try {
      const notification = {
        tripId,
        type: 'individual',
        userId,
        message,
        urgency,
        sentAt: new Date().toISOString(),
        status: 'sent',
      };

      this.pendingNotifications.push(notification);

      console.log(`CommunicationAgent: Sent notification to user ${userId}: "${message}"`);

      return {
        status: 'success',
        notification,
      };
    } catch (error) {
      console.error('CommunicationAgent: Error notifying member:', error);
      return { status: 'error', error: error.message };
    }
  }

  async digestNotifications(tripId) {
    try {
      const trip = await pb.collection('trips').getOne(tripId);
      const groupMembers = await this.getGroupMembers(tripId);

      // Collect low-urgency notifications from the last 24 hours
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const lowUrgencyNotifications = this.pendingNotifications
        .filter(n => {
          const notifTime = new Date(n.sentAt);
          return (
            n.tripId === tripId &&
            n.urgency === 'low' &&
            notifTime > oneDayAgo &&
            n.status === 'pending'
          );
        });

      if (lowUrgencyNotifications.length === 0) {
        return {
          status: 'no_notifications',
          message: 'No low-priority notifications to digest',
        };
      }

      // Create a digest message
      const digest = {
        tripId,
        type: 'digest',
        generatedAt: new Date().toISOString(),
        notificationCount: lowUrgencyNotifications.length,
        summary: `Daily travel digest: ${lowUrgencyNotifications.length} updates`,
        notifications: lowUrgencyNotifications.map(n => ({
          message: n.message,
          sentAt: n.sentAt,
          type: n.type,
        })),
        recipients: groupMembers.map(m => m.id),
      };

      console.log(`CommunicationAgent: Created digest with ${lowUrgencyNotifications.length} notifications`);

      // Mark notifications as digested
      lowUrgencyNotifications.forEach(n => {
        n.status = 'digested';
      });

      return {
        status: 'success',
        digest,
        notificationsDigested: lowUrgencyNotifications.length,
      };
    } catch (error) {
      console.error('CommunicationAgent: Error creating digest:', error);
      return { status: 'error', error: error.message };
    }
  }

  async handleEvent(event) {
    if (event.type === 'weather_change') {
      const message = `Weather alert: ${event.condition}. Consider adjusting outdoor activities.`;
      return await this.notifyGroup(event.tripId, message, 'normal');
    }

    if (event.type === 'time_drift') {
      const message = `Schedule update: ${event.activity} running ${event.drift} minutes late.`;
      return await this.notifyGroup(event.tripId, message, 'normal');
    }

    if (event.type === 'budget_exceeded') {
      const message = `Budget alert: You've reached ${event.percentageUsed}% of your budget.`;
      return await this.notifyGroup(event.tripId, message, 'high');
    }

    if (event.type === 'member_joined') {
      const message = `New member joined the trip! Updated itinerary and logistics have been shared.`;
      return await this.notifyGroup(event.tripId, message, 'normal');
    }

    if (event.type === 'reservation_change') {
      const message = `Important: Reservation changed. Check your booking confirmation.`;
      return await this.notifyGroup(event.tripId, message, 'high');
    }

    return { status: 'ignored' };
  }

  getStatus() {
    return {
      name: 'CommunicationAgent',
      status: this.status,
      tripId: this.tripContext?.id || null,
      pendingNotifications: this.pendingNotifications.length,
    };
  }

  // Helper methods
  async getPendingNotifications(tripId) {
    return this.pendingNotifications.filter(n => n.tripId === tripId && n.status === 'pending');
  }

  async getGroupMembers(tripId) {
    try {
      const trip = await pb.collection('trips').getOne(tripId);
      // Mock group members - in reality would fetch from database
      return [
        { id: trip.creator, name: 'Trip Creator' },
        // Additional members would be loaded from trip.group_members
      ];
    } catch (error) {
      console.error('CommunicationAgent: Error getting group members:', error);
      return [];
    }
  }
}

export default CommunicationAgent;
