
import pb from '@/lib/pocketbaseClient';

export const AdminAuthService = {
  async login(email, password) {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      
      // Verify admin role
      if (authData.record.role !== 'admin' && authData.record.role !== 'super_admin') {
        pb.authStore.clear();
        throw new Error("Unauthorized: Admin access required.");
      }
      
      return authData;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    pb.authStore.clear();
  },

  isAdmin() {
    return pb.authStore.isValid && 
           (pb.authStore.model?.role === 'admin' || pb.authStore.model?.role === 'super_admin');
  },

  getCurrentAdmin() {
    return this.isAdmin() ? pb.authStore.model : null;
  }
};
