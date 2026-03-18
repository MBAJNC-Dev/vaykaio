import supabase from '@/lib/supabaseClient.js';

const FavoriteService = {
  // Get all favorites for a user
  async getFavorites(userId) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Failed to fetch favorites for user ${userId}:`, error);
      throw error;
    }
  },

  // Add a favorite place
  async addFavorite(userId, placeData) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          ...placeData,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to add favorite:', error);
      throw error;
    }
  },

  // Remove a favorite
  async removeFavorite(favoriteId) {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Failed to remove favorite ${favoriteId}:`, error);
      throw error;
    }
  },

  // Get custom favorite lists for a user
  async getFavoriteLists(userId) {
    try {
      const { data, error } = await supabase
        .from('favorite_lists')
        .select('*')
        .eq('user_id', userId)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Failed to fetch favorite lists for user ${userId}:`, error);
      throw error;
    }
  },

  // Create a new favorite list
  async createFavoriteList(userId, name, description = '') {
    try {
      const { data, error } = await supabase
        .from('favorite_lists')
        .insert({
          user_id: userId,
          name,
          description,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create favorite list:', error);
      throw error;
    }
  },

  // Add a favorite to a list
  async addToList(listId, favoriteId) {
    try {
      const { data: list, error: fetchError } = await supabase
        .from('favorite_lists')
        .select('favorite_ids')
        .eq('id', listId)
        .single();

      if (fetchError) throw fetchError;

      const favoriteIds = list.favorite_ids || [];
      if (!favoriteIds.includes(favoriteId)) {
        favoriteIds.push(favoriteId);
      }

      const { data, error } = await supabase
        .from('favorite_lists')
        .update({ favorite_ids: favoriteIds })
        .eq('id', listId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Failed to add favorite to list ${listId}:`, error);
      throw error;
    }
  },

  // Remove a favorite from a list
  async removeFromList(listId, favoriteId) {
    try {
      const { data: list, error: fetchError } = await supabase
        .from('favorite_lists')
        .select('favorite_ids')
        .eq('id', listId)
        .single();

      if (fetchError) throw fetchError;

      const favoriteIds = (list.favorite_ids || []).filter(id => id !== favoriteId);

      const { data, error } = await supabase
        .from('favorite_lists')
        .update({ favorite_ids: favoriteIds })
        .eq('id', listId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Failed to remove favorite from list ${listId}:`, error);
      throw error;
    }
  },

  // Share a favorite list with a trip (make it accessible to trip members)
  async shareFavoriteList(listId, tripId) {
    try {
      const { data: list, error: fetchError } = await supabase
        .from('favorite_lists')
        .select('shared_trip_ids')
        .eq('id', listId)
        .single();

      if (fetchError) throw fetchError;

      const sharedTrips = list.shared_trip_ids || [];
      if (!sharedTrips.includes(tripId)) {
        sharedTrips.push(tripId);
      }

      const { data, error } = await supabase
        .from('favorite_lists')
        .update({ shared_trip_ids: sharedTrips })
        .eq('id', listId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Failed to share favorite list ${listId} with trip ${tripId}:`, error);
      throw error;
    }
  },
};

export default FavoriteService;
