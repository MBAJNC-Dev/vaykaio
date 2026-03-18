import supabase from '@/lib/supabaseClient.js';

const ItineraryService = {
  // Get all days and items for a trip's itinerary
  async getItinerary(tripId) {
    try {
      const { data, error } = await supabase
        .from('itinerary_days')
        .select('*, itinerary_items(*)')
        .eq('trip_id', tripId)
        .order('day_number');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Failed to fetch itinerary for trip ${tripId}:`, error);
      throw error;
    }
  },

  // Get items for a specific day
  async getDayItems(dayId) {
    try {
      const { data, error } = await supabase
        .from('itinerary_items')
        .select('*')
        .eq('day_id', dayId)
        .order('start_time');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Failed to fetch items for day ${dayId}:`, error);
      throw error;
    }
  },

  // Create an itinerary day
  async createDay(tripId, data) {
    try {
      const { data: day, error } = await supabase
        .from('itinerary_days')
        .insert({
          ...data,
          trip_id: tripId,
        })
        .select()
        .single();

      if (error) throw error;
      return day;
    } catch (error) {
      console.error(`Failed to create day for trip ${tripId}:`, error);
      throw error;
    }
  },

  // Update a day
  async updateDay(dayId, data) {
    try {
      const { data: day, error } = await supabase
        .from('itinerary_days')
        .update(data)
        .eq('id', dayId)
        .select()
        .single();

      if (error) throw error;
      return day;
    } catch (error) {
      console.error(`Failed to update day ${dayId}:`, error);
      throw error;
    }
  },

  // Delete a day
  async deleteDay(dayId) {
    try {
      const { error } = await supabase
        .from('itinerary_days')
        .delete()
        .eq('id', dayId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Failed to delete day ${dayId}:`, error);
      throw error;
    }
  },

  // Create an itinerary item
  async createItem(dayId, data) {
    try {
      const { data: item, error } = await supabase
        .from('itinerary_items')
        .insert({
          ...data,
          day_id: dayId,
          type: data.type || 'activity',
          status: data.status || 'planned',
        })
        .select()
        .single();

      if (error) throw error;
      return item;
    } catch (error) {
      console.error(`Failed to create item for day ${dayId}:`, error);
      throw error;
    }
  },

  // Update an item
  async updateItem(itemId, data) {
    try {
      const { data: item, error } = await supabase
        .from('itinerary_items')
        .update(data)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return item;
    } catch (error) {
      console.error(`Failed to update item ${itemId}:`, error);
      throw error;
    }
  },

  // Delete an item
  async deleteItem(itemId) {
    try {
      const { error } = await supabase
        .from('itinerary_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Failed to delete item ${itemId}:`, error);
      throw error;
    }
  },

  // Reorder items within a day
  async reorderItems(dayId, itemIds) {
    try {
      // Update each item with new sequence number
      const updates = itemIds.map((id, index) =>
        supabase
          .from('itinerary_items')
          .update({ sort_order: index })
          .eq('id', id)
      );
      const results = await Promise.all(updates);
      return results;
    } catch (error) {
      console.error(`Failed to reorder items for day ${dayId}:`, error);
      throw error;
    }
  },

  // Placeholder for AI generation
  async generateItinerary(tripId, preferences) {
    try {
      console.info(`AI itinerary generation requested for trip ${tripId} with preferences:`, preferences);
      // This would call an AI service to generate itinerary
      // For now, return success indication
      return {
        success: true,
        message: 'Itinerary generation initiated',
        tripId,
        preferences,
      };
    } catch (error) {
      console.error(`Failed to generate itinerary for trip ${tripId}:`, error);
      throw error;
    }
  },

  // Placeholder for AI schedule optimization
  async optimizeSchedule(tripId) {
    try {
      console.info(`Schedule optimization requested for trip ${tripId}`);
      // This would call an AI service to optimize the schedule
      // For now, return success indication
      return {
        success: true,
        message: 'Schedule optimization initiated',
        tripId,
      };
    } catch (error) {
      console.error(`Failed to optimize schedule for trip ${tripId}:`, error);
      throw error;
    }
  },
};

export default ItineraryService;
