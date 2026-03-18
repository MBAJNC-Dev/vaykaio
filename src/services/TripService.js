import supabase from '@/lib/supabaseClient.js';

const TripService = {
  // Get all trips for current user
  async getMyTrips(userId) {
    try {
      if (!userId) throw new Error('Not authenticated');

      // Get trips where user is owner
      const { data: ownedTrips, error: ownedError } = await supabase
        .from('trips')
        .select('*')
        .eq('owner_id', userId)
        .order('start_date', { ascending: false });

      if (ownedError) throw ownedError;

      // Get trips where user is a member
      const { data: memberships, error: memberError } = await supabase
        .from('trip_members')
        .select('trip_id')
        .eq('user_id', userId);

      if (memberError) throw memberError;

      const memberTripIds = memberships.map(m => m.trip_id);

      // Get member trips
      let memberTrips = [];
      if (memberTripIds.length > 0) {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .in('id', memberTripIds)
          .order('start_date', { ascending: false });

        if (error) throw error;
        memberTrips = data || [];
      }

      // Merge and deduplicate
      const allTrips = [...ownedTrips];
      memberTrips.forEach(t => {
        if (!allTrips.find(existing => existing.id === t.id)) {
          allTrips.push(t);
        }
      });

      return allTrips.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
    } catch (error) {
      console.error('Failed to fetch trips:', error);
      throw error;
    }
  },

  async getTrip(tripId) {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Failed to fetch trip ${tripId}:`, error);
      throw error;
    }
  },

  async createTrip(data, userId) {
    try {
      if (!userId) throw new Error('Not authenticated');

      const { data: trip, error } = await supabase
        .from('trips')
        .insert({
          ...data,
          owner_id: userId,
          status: data.status || 'planning',
        })
        .select()
        .single();

      if (error) throw error;
      return trip;
    } catch (error) {
      console.error('Failed to create trip:', error);
      throw error;
    }
  },

  async updateTrip(tripId, data) {
    try {
      const { data: trip, error } = await supabase
        .from('trips')
        .update(data)
        .eq('id', tripId)
        .select()
        .single();

      if (error) throw error;
      return trip;
    } catch (error) {
      console.error(`Failed to update trip ${tripId}:`, error);
      throw error;
    }
  },

  async deleteTrip(tripId) {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Failed to delete trip ${tripId}:`, error);
      throw error;
    }
  },

  // Trip Members
  async getTripMembers(tripId) {
    try {
      const { data, error } = await supabase
        .from('trip_members')
        .select('*, profiles(*)')
        .eq('trip_id', tripId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Failed to fetch trip members for ${tripId}:`, error);
      throw error;
    }
  },

  async addTripMember(tripId, userId, role = 'viewer') {
    try {
      const { data, error } = await supabase
        .from('trip_members')
        .insert({
          trip_id: tripId,
          user_id: userId,
          role: role,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Failed to add trip member:`, error);
      throw error;
    }
  },

  async inviteMember(tripId, email, role = 'viewer') {
    try {
      // Check if user exists by email
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email);

      if (userError) throw userError;

      if (users && users.length > 0) {
        return await this.addTripMember(tripId, users[0].id, role);
      }

      // Store pending invitation
      const { data, error } = await supabase
        .from('trip_members')
        .insert({
          trip_id: tripId,
          invited_email: email,
          role: role,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to invite member:', error);
      throw error;
    }
  },

  async removeTripMember(memberId) {
    try {
      const { error } = await supabase
        .from('trip_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Failed to remove trip member ${memberId}:`, error);
      throw error;
    }
  },

  async updateMemberRole(memberId, role) {
    try {
      const { data, error } = await supabase
        .from('trip_members')
        .update({ role })
        .eq('id', memberId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Failed to update member role ${memberId}:`, error);
      throw error;
    }
  },
};

export default TripService;
