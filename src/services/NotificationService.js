import supabase from '@/lib/supabaseClient.js';

const NotificationService = {
  // Get notifications for a user with optional filters
  async getNotifications(userId, options = {}) {
    try {
      const { type, urgency, read } = options;

      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId);

      if (type !== undefined) {
        query = query.eq('type', type);
      }

      if (urgency !== undefined) {
        query = query.eq('urgency', urgency);
      }

      if (read !== undefined) {
        query = query.eq('read', read);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Failed to fetch notifications for user ${userId}:`, error);
      throw error;
    }
  },

  // Mark a notification as read
  async markAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({
          read: true,
          read_at: new Date().toISOString(),
        })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Failed to mark notification ${notificationId} as read:`, error);
      throw error;
    }
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    try {
      const { data: unreadNotifications, error: fetchError } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .eq('read', false);

      if (fetchError) throw fetchError;

      const updates = (unreadNotifications || []).map(notif =>
        supabase
          .from('notifications')
          .update({
            read: true,
            read_at: new Date().toISOString(),
          })
          .eq('id', notif.id)
      );

      return await Promise.all(updates);
    } catch (error) {
      console.error(`Failed to mark all notifications as read for user ${userId}:`, error);
      throw error;
    }
  },

  // Dismiss/delete a notification
  async dismissNotification(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Failed to dismiss notification ${notificationId}:`, error);
      throw error;
    }
  },

  // Create a new notification
  async createNotification(data) {
    try {
      const validUrgencies = ['fyi', 'action_soon', 'urgent_now'];
      const urgency = data.urgency || 'fyi';

      if (!validUrgencies.includes(urgency)) {
        throw new Error(`Invalid urgency level: ${urgency}`);
      }

      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          ...data,
          urgency,
          read: false,
        })
        .select()
        .single();

      if (error) throw error;
      return notification;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  },

  // Get count of unread notifications for a user
  async getUnreadCount(userId) {
    try {
      const { data, error, count } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error(`Failed to get unread count for user ${userId}:`, error);
      throw error;
    }
  },

  // Subscribe to real-time notification updates
  subscribeToNotifications(userId, callback) {
    try {
      // Subscribe to notifications channel for this user
      const channel = supabase
        .channel(`notifications:${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            callback(payload);
          }
        )
        .subscribe();

      // Return unsubscribe function
      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error(`Failed to subscribe to notifications for user ${userId}:`, error);
      throw error;
    }
  },
};

export default NotificationService;
