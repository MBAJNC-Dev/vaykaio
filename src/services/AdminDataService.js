
import pb from '@/lib/pocketbaseClient';

export const AdminDataService = {
  async fetchAllUsers(page = 1, limit = 50, filters = '', sort = '-created') {
    return await pb.collection('users').getList(page, limit, {
      filter: filters,
      sort: sort,
      $autoCancel: false
    });
  },

  async fetchAllPlans(page = 1, limit = 50, filters = '', sort = '-created') {
    return await pb.collection('AIPlans').getList(page, limit, {
      filter: filters,
      sort: sort,
      expand: 'user_id',
      $autoCancel: false
    });
  },

  async fetchAllGroupPlans(page = 1, limit = 50, filters = '', sort = '-created') {
    return await pb.collection('GroupTravelPlans').getList(page, limit, {
      filter: filters,
      sort: sort,
      expand: 'user_id',
      $autoCancel: false
    });
  },

  async fetchAllFamilyPlans(page = 1, limit = 50, filters = '', sort = '-created') {
    return await pb.collection('FamilyTravelPlans').getList(page, limit, {
      filter: filters,
      sort: sort,
      expand: 'user_id',
      $autoCancel: false
    });
  },

  async fetchAllSoloPlans(page = 1, limit = 50, filters = '', sort = '-created') {
    return await pb.collection('SoloTravelPlans').getList(page, limit, {
      filter: filters,
      sort: sort,
      expand: 'user_id',
      $autoCancel: false
    });
  },

  async fetchAllBookings(page = 1, limit = 50, filters = '', sort = '-created') {
    return await pb.collection('booking_checklist').getList(page, limit, {
      filter: filters,
      sort: sort,
      expand: 'trip_id',
      $autoCancel: false
    });
  },

  async fetchAllExpenses(page = 1, limit = 50, filters = '', sort = '-created') {
    return await pb.collection('expenses').getList(page, limit, {
      filter: filters,
      sort: sort,
      expand: 'user_id,trip_id',
      $autoCancel: false
    });
  },

  async fetchAllMessages(page = 1, limit = 50, filters = '', sort = '-created') {
    return await pb.collection('chat_history').getList(page, limit, {
      filter: filters,
      sort: sort,
      expand: 'user_id',
      $autoCancel: false
    });
  },

  async fetchActivityLogs(page = 1, limit = 50, filters = '', sort = '-created') {
    return await pb.collection('admin_logs').getList(page, limit, {
      filter: filters,
      sort: sort,
      expand: 'admin_id',
      $autoCancel: false
    });
  },

  async fetchAuditTrails(page = 1, limit = 50, filters = '', sort = '-created') {
    return await pb.collection('audit_logs').getList(page, limit, {
      filter: filters,
      sort: sort,
      expand: 'user_id',
      $autoCancel: false
    });
  },

  async getDashboardStats() {
    try {
      const [users, plans, bookings, expenses] = await Promise.all([
        pb.collection('users').getList(1, 1, { $autoCancel: false }),
        pb.collection('AIPlans').getList(1, 1, { $autoCancel: false }),
        pb.collection('booking_checklist').getList(1, 1, { filter: 'status="booked"', $autoCancel: false }),
        pb.collection('expenses').getList(1, 1000, { fields: 'amount', $autoCancel: false })
      ]);

      const totalRevenue = expenses.items.reduce((sum, exp) => sum + (exp.amount || 0), 0);

      return {
        totalUsers: users.totalItems,
        totalPlans: plans.totalItems,
        totalBookings: bookings.totalItems,
        totalRevenue: totalRevenue
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return { totalUsers: 0, totalPlans: 0, totalBookings: 0, totalRevenue: 0 };
    }
  },

  async logAdminAction(adminId, action, resourceType, resourceId, details) {
    try {
      await pb.collection('admin_logs').create({
        admin_id: adminId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details: JSON.stringify(details)
      }, { $autoCancel: false });
    } catch (error) {
      console.error("Failed to log admin action:", error);
    }
  }
};
